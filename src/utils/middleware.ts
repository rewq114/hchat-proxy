import * as http from "http";
import logger from "../logger";

export type MiddlewareFunction = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void
) => void;

// CORS middleware
export function corsMiddleware(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void
): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  next();
}

// Logging middleware
export function loggingMiddleware(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void
): void {
  const clientIp = req.socket.remoteAddress || "unknown";
  const url = req.url || "";

  logger.info("Client connection", {
    ip: clientIp,
    method: req.method,
    url: url,
  });

  next();
}

// Compose multiple middlewares
export function composeMiddlewares(
  middlewares: MiddlewareFunction[]
): MiddlewareFunction {
  return (req, res, next) => {
    let index = 0;

    function dispatch(): void {
      if (index >= middlewares.length) {
        next();
        return;
      }

      const middleware = middlewares[index++];
      middleware(req, res, dispatch);
    }

    dispatch();
  };
}
