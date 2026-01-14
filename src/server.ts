import { HChatProxy } from "./proxy";
import logger from "./logger";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.HCHAT_API_KEY;
const apiBase =
  process.env.HCHAT_API_BASE || "https://h-chat-api.autoever.com/v2/api";
const port = Number(process.env.PORT) || 11435;

if (!apiKey) {
  logger.error("HCHAT_API_KEY environment variable is required");
  process.exit(1);
}

const proxy = new HChatProxy({ apiKey, apiBase, port });

proxy
  .start()
  .then(() => {
    logger.info(`Server running in headless mode`);
  })
  .catch((err) => {
    logger.error("Failed to start server", { error: err });
    process.exit(1);
  });

process.on("SIGINT", () => {
  logger.info("Stopping server...");
  proxy.stop();
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Stopping server...");
  proxy.stop();
  process.exit(0);
});
