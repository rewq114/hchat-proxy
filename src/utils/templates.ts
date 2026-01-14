export interface StatusPageData {
  apiBase: string;
  port: number;
  maskedApiKey: string;
  models: Array<{ id: string; owned_by: string }>;
}

export function generateStatusPage(data: StatusPageData): string {
  const modelListHtml = data.models
    .map(
      (m) => `<li><strong>${m.id}</strong> <small>(${m.owned_by})</small></li>`
    )
    .join("");

  return `
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
            <div class="value">${data.apiBase}</div>
            <div class="label">Proxy Port</div>
            <div class="value">${data.port}</div>
            <div class="label">API Key</div>
            <div class="value">${data.maskedApiKey}</div>
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
}
