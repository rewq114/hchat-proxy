import * as http from "http";
import logger from "../logger";

export function handleProxyError(
  res: http.ServerResponse,
  error: any,
  context?: string
): void {
  // Log the error with context
  logger.error("Proxy error", {
    context: context || "unknown",
    message: error.message,
    stack: error.stack,
    code: error.code,
  });

  // Determine appropriate HTTP status code
  const statusCode =
    error.statusCode || error.code === "ECONNREFUSED" ? 503 : 500;

  // Check if headers were already sent
  if (res.headersSent) {
    // If in streaming mode, try to send error as SSE event
    if (!res.writableEnded) {
      try {
        res.write(
          `data: ${JSON.stringify({
            error: { message: error.message, type: "proxy_error" },
          })}\n\n`
        );
      } catch (writeError) {
        logger.error("Failed to write error to stream", { error: writeError });
      }
      res.end();
    }
    return;
  }

  // Send error response
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      error: {
        message: error.message || "Internal server error",
        type: error.constructor.name || "UnknownError",
        code: error.code,
      },
    })
  );
}
