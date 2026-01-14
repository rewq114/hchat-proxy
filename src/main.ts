import { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage } from "electron";
import { autoUpdater } from "electron-updater";
import * as path from "path";
import Store from "electron-store";
import { HChatProxy } from "./proxy";
import logger from "./logger";

const store = new Store();
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let proxy: HChatProxy | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false, // Initially hidden
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.on("close", (event) => {
    if (!(app as any).isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });
}

function createTray() {
  // Correct path relative to dist/main.js
  const iconPath = path.join(__dirname, "../assets/icon.png");
  logger.info("Loading icon from:", { path: iconPath });

  let icon = nativeImage.createFromPath(iconPath);
  if (icon.isEmpty()) {
    logger.error("Failed to load icon: Icon is empty");
    // Fallback or just continue
  }
  // Resize for tray if needed (though Tray usually handles it, nativeImage is safer)
  icon = icon.resize({ width: 16, height: 16 });

  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: "Show Settings", click: () => mainWindow?.show() },
    { type: "separator" },
    { label: "Start Server", click: startProxy },
    { label: "Stop Server", click: stopProxy },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        (app as any).isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip("HChat Proxy");
  tray.setContextMenu(contextMenu);

  tray.on("double-click", () => mainWindow?.show());
}

async function startProxy() {
  const config = {
    apiKey: store.get("apiKey") as string,
    apiBase:
      (store.get("apiBase") as string) ||
      "https://h-chat-api.autoever.com/v2/api",
    port: Number(store.get("port")) || 11435,
  };

  if (!config.apiKey) {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.webContents.send("error", "API Key is missing");
    }
    return;
  }

  try {
    if (proxy) proxy.stop();
    proxy = new HChatProxy(config);
    await proxy.start();
    logger.info("Proxy started successfully");
    mainWindow?.webContents.send("status", "running");
  } catch (error: any) {
    logger.error("Failed to start server", { error: error.message });
    mainWindow?.webContents.send(
      "error",
      `Failed to start server: ${error.message}`
    );
  }
}

function stopProxy() {
  if (proxy) {
    proxy.stop();
    proxy = null;
    mainWindow?.webContents.send("status", "stopped");
  }
}

app.on("ready", async () => {
  try {
    logger.info("App ready, initializing...");
    createWindow();
    createTray();
    autoUpdater.checkForUpdatesAndNotify();

    // Auto-start if configured
    if (store.get("autoStart")) {
      logger.info("Auto-starting proxy...");
      await startProxy();
    } else {
      mainWindow?.show();
    }
  } catch (error) {
    logger.error("Error during startup", { error });
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // We stay alive in the tray
  }
});

ipcMain.on("save-settings", (event, settings) => {
  store.set("apiKey", settings.apiKey);
  store.set("apiBase", settings.apiBase);
  store.set("port", settings.port);
  store.set("autoStart", settings.autoStart);
  event.reply("settings-saved");
});

ipcMain.on("get-settings", (event) => {
  event.reply("settings-data", {
    apiKey: store.get("apiKey"),
    apiBase: store.get("apiBase"),
    port: store.get("port"),
    autoStart: store.get("autoStart"),
  });
});

ipcMain.on("control-server", (event, command) => {
  if (command === "start") startProxy();
  else if (command === "stop") stopProxy();
});
