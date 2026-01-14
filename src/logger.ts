import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import * as path from "path";
import * as fs from "fs";

// Determine if running in Electron (Main process)
// process.versions.electron is defined in Electron
const isElectron = process.versions.hasOwnProperty("electron");

let logDir = path.join(process.cwd(), "logs");

if (isElectron) {
  try {
    // Dynamic require to prevent errors in pure Node environment
    const { app } = require("electron");
    // Ensure app is ready or use available path
    if (app) {
      logDir = app.getPath("logs");
    }
  } catch (error) {
    // Fallback to local logs directory
  }
}

// Ensure logs directory exists in Node environment
if (!isElectron) {
  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  } catch (e) {
    // Ignore error if creating directory fails
  }
}

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

const transports: winston.transport[] = [];

// 1. Console Transport (Always enabled, preferred for Docker)
transports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      customFormat
    ),
  })
);

// 2. File Transport (Enable if writable)
try {
  transports.push(
    new DailyRotateFile({
      dirname: logDir,
      filename: "hchat-proxy-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "10d",
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        customFormat
      ),
    })
  );

  transports.push(
    new DailyRotateFile({
      dirname: logDir,
      filename: "hchat-proxy-error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "10d",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        customFormat
      ),
    })
  );
} catch (e) {
  // If file transport fails (e.g. read-only fs), console is enough
  console.warn("Failed to initialize file logging:", e);
}

// Configure the logger
const logger = winston.createLogger({
  level: "info",
  transports,
});

// Log the logs directory location on startup
logger.info(`Logs directory: ${logDir}`);

export default logger;
