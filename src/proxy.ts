import * as http from "http";
import { HChat } from "hchat-sdk-node";

export interface ProxyConfig {
  apiKey: string;
  apiBase: string;
  port: number;
}

export class HChatProxy {
  private server: http.Server | null = null;
  private hchat: HChat | null = null;

  constructor(private config: ProxyConfig) {
    this.hchat = new HChat(config.apiKey, config.apiBase);
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = http.createServer(async (req, res) => {
        // CORS
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization"
        );

        if (req.method === "OPTIONS") {
          res.writeHead(204);
          res.end();
          return;
        }

        const url = req.url || "";
        console.log(`[Proxy] Incoming ${req.method} ${url}`);

        // 0. Status Page
        if ((url === "/" || url === "/v1") && req.method === "GET") {
          try {
            const models = await this.hchat!.models.list();
            const modelListHtml = models.data
              .map(
                (m: any) =>
                  `<li><strong>${m.id}</strong> <small>(${m.owned_by})</small></li>`
              )
              .join("");

            const maskedKey =
              this.config.apiKey.substring(0, 10) +
              "..." +
              this.config.apiKey.substring(this.config.apiKey.length - 4);

            const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>HChat Proxy Status</title>
    <style>
        body { font-family: 'Inter', -apple-system, system-ui, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .card { background: #1e293b; padding: 2rem; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); width: 100%; max-width: 500px; border: 1px solid #334155; }
        h1 { margin-top: 0; color: #38bdf8; display: flex; align-items: center; gap: 0.5rem; font-size: 1.5rem; }
        .status { display: inline-flex; align-items: center; gap: 0.5rem; background: #064e3b; color: #34d399; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; margin-bottom: 1.5rem; }
        .status-dot { width: 8px; height: 8px; background: #34d399; border-radius: 50%; box-shadow: 0 0 8px #34d399; animate: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        .info-grid { display: grid; grid-template-columns: 100px 1fr; gap: 0.75rem; font-size: 0.9375rem; background: #0f172a; padding: 1rem; border-radius: 0.5rem; border: 1px solid #334155; }
        .label { color: #94a3b8; font-weight: 500; }
        .value { color: #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; word-break: break-all; }
        h2 { font-size: 1.125rem; margin: 1.5rem 0 1rem; color: #94a3b8; border-bottom: 1px solid #334155; padding-bottom: 0.5rem; }
        ul { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
        li { background: #334155; padding: 0.5rem; border-radius: 0.375rem; font-size: 0.8125rem; }
        li strong { color: #38bdf8; display: block; }
        li small { color: #94a3b8; }
        .footer { margin-top: 2rem; text-align: center; font-size: 0.75rem; color: #64748b; }
        a { color: #38bdf8; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="card">
        <h1>HChat Proxy Settings & Status</h1>
        <div class="status"><div class="status-dot"></div> Running Online</div>
        
        <div class="info-grid">
            <div class="label">API Base</div>
            <div class="value">${this.config.apiBase}</div>
            <div class="label">Proxy Port</div>
            <div class="value">${this.config.port}</div>
            <div class="label">API Key</div>
            <div class="value">${maskedKey}</div>
        </div>

        <h2>Available Models</h2>
        <ul>${modelListHtml}</ul>

        <div class="footer">
            Endpoint: <a href="/v1/models" target="_blank">/v1/models</a> | 
            Version: 1.2.3
        </div>
    </div>
</body>
</html>
            `;
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
            return;
          } catch (error: any) {
            this.sendError(res, error);
            return;
          }
        }

        // 1. Models List
        if (url.includes("/models") && req.method === "GET") {
          try {
            const models = await this.hchat!.models.list();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(models));
            return;
          } catch (error: any) {
            this.sendError(res, error);
            return;
          }
        }

        // 2. Chat Completions
        if (url.includes("/chat/completions") && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", async () => {
            try {
              const requestData = JSON.parse(body);
              console.log(
                `[Proxy] Request Body: ${JSON.stringify(requestData).substring(
                  0,
                  200
                )}...`
              );

              // Support Azure-style paths: /openai/deployments/{model}/chat/completions
              if (!requestData.model) {
                const azureMatch = url.match(
                  /\/openai\/deployments\/([^\/\?]+)/
                );
                if (azureMatch) {
                  requestData.model = azureMatch[1];
                }
              }

              if (requestData.stream) {
                const stream = await this.hchat!.chat.completions.create(
                  requestData
                );
                if (stream && (stream as any)[Symbol.asyncIterator]) {
                  res.writeHead(200, {
                    "Content-Type": "text/event-stream",
                    "Cache-Control": "no-cache",
                    Connection: "keep-alive",
                  });
                  for await (const chunk of stream as any) {
                    const data = `data: ${JSON.stringify(chunk)}\n\n`;
                    res.write(data);
                  }
                  res.write("data: [DONE]\n\n");
                  res.end();
                } else {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify(stream));
                }
              } else {
                const response = await this.hchat!.chat.completions.create(
                  requestData
                );
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(response));
              }
            } catch (error: any) {
              this.sendError(res, error);
            }
          });
          return;
        }

        // 3. Embeddings
        if (url.includes("/embeddings") && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", async () => {
            try {
              const requestData = JSON.parse(body);
              const response = await this.hchat!.embeddings.create(requestData);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(response));
            } catch (error: any) {
              this.sendError(res, error);
            }
          });
          return;
        }

        res.writeHead(404);
        res.end(
          JSON.stringify({
            error: { message: "Not Found", type: "invalid_request_error" },
          })
        );
      });

      this.server.listen(this.config.port, () => {
        console.log(
          `[Proxy] Running at http://localhost:${this.config.port}/v1`
        );
        resolve();
      });

      this.server.on("error", (err) => {
        reject(err);
      });
    });
  }

  private sendError(res: http.ServerResponse, error: any) {
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: {
            message: error.message,
            type: error.constructor.name,
            code: error.code,
          },
        })
      );
    } else if (!res.writableEnded) {
      res.write(
        `data: ${JSON.stringify({
          error: { message: error.message, type: "proxy_error" },
        })}\n\n`
      );
      res.end();
    }
  }

  public stop(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }
}
