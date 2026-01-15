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
    error.statusCode ||
    error.context?.metadata?.status ||
    (error.code === "ECONNREFUSED" ? 503 : 500);

  // Check if headers were already sent
  if (res.headersSent) {
    if (!res.writableEnded) {
      try {
        const errorMessage =
          error.context?.metadata?.errorData?.error?.message ||
          error.context?.metadata?.errorData?.message ||
          error.message;

        if (context === "anthropic") {
          res.write(
            `data: ${JSON.stringify({
              type: "error",
              error: { type: "overloaded_error", message: errorMessage },
            })}\n\n`
          );
        } else {
          res.write(
            `data: ${JSON.stringify({
              error: { message: errorMessage, type: "proxy_error" },
            })}\n\n`
          );
        }
      } catch (writeError) {
        logger.error("Failed to write error to stream", { error: writeError });
      }
      res.end();
    }
    return;
  }

  // Extract the most relevant error message
  const finalMessage =
    error.context?.metadata?.errorData?.error?.message ||
    error.context?.metadata?.errorData?.message ||
    error.message;

  // Send context-aware error response
  res.writeHead(statusCode, { "Content-Type": "application/json" });

  if (context === "anthropic") {
    // Return Anthropic native error format
    res.end(
      JSON.stringify({
        type: "error",
        error: {
          type:
            error.code === "LLM_RATE_LIMIT"
              ? "rate_limit_error"
              : "invalid_request_error",
          message: finalMessage,
        },
      })
    );
  } else if (context === "openai") {
    // Return OpenAI native error format
    res.end(
      JSON.stringify({
        error: {
          message: finalMessage,
          type:
            error.code === "LLM_RATE_LIMIT"
              ? "insufficient_quota"
              : "invalid_request_error",
          code: error.code,
        },
      })
    );
  } else {
    // Default HChatProxy error format
    res.end(
      JSON.stringify({
        error: {
          message: finalMessage,
          type: error.constructor.name || "UnknownError",
          code: error.code,
        },
      })
    );
  }
}
