import * as http from "http";
import logger from "./logger";
import { routeTable, matchRoute } from "./routes";
import {
  OpenAIService,
  AnthropicService,
  GoogleService,
  ModelsService,
  EmbeddingsService,
} from "./client/services";
import { handleProxyError } from "./utils/errorHandler";
import { generateStatusPage } from "./utils/templates";
import {
  corsMiddleware,
  loggingMiddleware,
  composeMiddlewares,
} from "./utils/middleware";

export interface ProxyConfig {
  apiKey: string;
  apiBase: string;
  port: number;
}

/**
 * HChatProxy - Main proxy server with refactored architecture
 *
 * Uses:
 * - Service Layer for business logic
 * - Declarative routing from routes/index.ts
 * - Single responsibility services
 */
export class HChatProxy {
  private server: http.Server | null = null;
  private openAIService: OpenAIService;
  private anthropicService: AnthropicService;
  private googleService: GoogleService;
  private modelsService: ModelsService;
  private embeddingsService: EmbeddingsService;

  constructor(private config: ProxyConfig) {
    // Initialize services once (singleton pattern)
    this.openAIService = new OpenAIService(config.apiKey, config.apiBase);
    this.anthropicService = new AnthropicService(config.apiKey, config.apiBase);
    this.googleService = new GoogleService(config.apiKey, config.apiBase);
    this.modelsService = new ModelsService(config.apiKey, config.apiBase);
    this.embeddingsService = new EmbeddingsService(
      config.apiKey,
      config.apiBase
    );
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      const middlewares = composeMiddlewares([
        corsMiddleware,
        loggingMiddleware,
      ]);

      this.server = http.createServer(async (req, res) => {
        middlewares(req, res, async () => {
          const url = req.url || "";
          const method = req.method || "GET";

          try {
            const route = matchRoute(url, method);

            if (!route) {
              logger.warn(`[Router] No route matched: ${method} ${url}`);
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  error: {
                    message: `Route not found: ${method} ${url}`,
                    type: "invalid_request_error",
                  },
                })
              );
              return;
            }

            logger.info(
              `[Router] Matched: ${route.description} (${method} ${url})`
            );

            await this.handleRoute(route.handler, req, res, url);
          } catch (error: any) {
            logger.error("Unhandled error in request handler", { error });
            if (!res.headersSent) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  error: {
                    message: "Internal server error",
                    type: "server_error",
                  },
                })
              );
            }
          }
        });
      });

      this.server.listen(this.config.port, () => {
        logger.info(`Proxy server started`, {
          url: `http://localhost:${this.config.port}/v1`,
          port: this.config.port,
        });
        resolve();
      });

      this.server.on("error", (err) => {
        logger.error("Server error", { error: err });
        reject(err);
      });
    });
  }

  private async handleRoute(
    handler: string,
    req: http.IncomingMessage,
    res: http.ServerResponse,
    url: string
  ): Promise<void> {
    switch (handler) {
      case "status":
        await this.handleStatus(res);
        break;
      case "openai":
        await this.handleOpenAI(req, res);
        break;
      case "anthropic":
        await this.handleAnthropic(req, res);
        break;
      case "google":
        await this.handleGoogle(req, res, url);
        break;
      case "models":
        await this.handleModels(res);
        break;
      case "embeddings":
        await this.handleEmbeddings(req, res);
        break;
      default:
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: { message: "Unknown handler" } }));
    }
  }

  private async handleStatus(res: http.ServerResponse): Promise<void> {
    try {
      const models = await this.modelsService.list();
      const maskedKey =
        this.config.apiKey.substring(0, 10) +
        "..." +
        this.config.apiKey.substring(this.config.apiKey.length - 4);

      const html = generateStatusPage({
        apiBase: this.config.apiBase,
        port: this.config.port,
        maskedApiKey: maskedKey,
        models: models.data,
      });

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    } catch (error: any) {
      handleProxyError(res, error, "status");
    }
  }

  private async handleOpenAI(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    const body = await this.parseBody(req);

    try {
      const result = await this.openAIService.create(body);

      if (body.stream && result && (result as any)[Symbol.asyncIterator]) {
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
        });

        for await (const chunk of result as any) {
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }
        res.write("data: [DONE]\n\n");
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      }
    } catch (error: any) {
      handleProxyError(res, error, "openai");
    }
  }

  private async handleAnthropic(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    const body = await this.parseBody(req);

    try {
      const result = await this.anthropicService.create(body);

      if (body.stream && result && (result as any)[Symbol.asyncIterator]) {
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
        });

        for await (const chunk of result as any) {
          // Anthropic SSE format: event: <type>\ndata: <json>\n\n
          const eventType = chunk.type || "message";
          res.write(`event: ${eventType}\ndata: ${JSON.stringify(chunk)}\n\n`);
        }
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      }
    } catch (error: any) {
      handleProxyError(res, error, "anthropic");
    }
  }

  private async handleGoogle(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    url: string
  ): Promise<void> {
    const body = await this.parseBody(req);

    try {
      const result = await this.googleService.forward(url, body);

      if (
        url.includes("stream") &&
        result &&
        (result as any)[Symbol.asyncIterator]
      ) {
        const isSSE = url.includes("alt=sse");

        if (isSSE) {
          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "Access-Control-Allow-Origin": "*",
          });

          for await (const chunk of result as any) {
            // Google SSE format is usually just data: <json>\n\n
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
          }
        } else {
          // Default Google streaming format is a JSON array: [ chunk, chunk, ... ]
          res.writeHead(200, {
            "Content-Type": "application/json",
            "Transfer-Encoding": "chunked",
          });

          res.write("[\n");
          let first = true;
          for await (const chunk of result as any) {
            if (!first) {
              res.write(",\n");
            }
            res.write(JSON.stringify(chunk));
            first = false;
          }
          res.write("\n]");
        }
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      }
    } catch (error: any) {
      handleProxyError(res, error, "google");
    }
  }

  private async handleModels(res: http.ServerResponse): Promise<void> {
    try {
      const models = await this.modelsService.list();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(models));
    } catch (error: any) {
      handleProxyError(res, error, "models");
    }
  }

  private async handleEmbeddings(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    const body = await this.parseBody(req);

    try {
      const response = await this.embeddingsService.create(body);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    } catch (error: any) {
      handleProxyError(res, error, "embeddings");
    }
  }

  private parseBody(req: http.IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error("Invalid JSON body"));
        }
      });
      req.on("error", reject);
    });
  }

  public stop(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
      logger.info("Proxy server stopped");
    }
  }
}
