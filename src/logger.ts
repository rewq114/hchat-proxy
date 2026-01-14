import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { app } from "electron";
import * as path from "path";

// Get the logs directory path
const logDir = app.getPath("logs");

// Create a custom format for better readability
const customFormat = winston.format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  }
);

// Configure the logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    // General logs with daily rotation, 10 day retention
    new DailyRotateFile({
      dirname: logDir,
      filename: "hchat-proxy-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "10d",
      level: "info",
    }),
    // Error logs with daily rotation, 10 day retention
    new DailyRotateFile({
      dirname: logDir,
      filename: "hchat-proxy-error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "10d",
      level: "error",
    }),
    // Console output for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        customFormat
      ),
    }),
  ],
});

// Log the logs directory location on startup
logger.info(`Logs directory: ${logDir}`);

export default logger;
