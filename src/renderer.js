const { ipcRenderer, shell } = require("electron");

const apiKeyInput = document.getElementById("apiKey");
const apiBaseInput = document.getElementById("apiBase");
const portInput = document.getElementById("port");
const autoStartCheck = document.getElementById("autoStart");
const saveBtn = document.getElementById("saveBtn");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const statusText = document.getElementById("statusText");
const webLinkDiv = document.getElementById("web-link");
const openWebBtn = document.getElementById("openWebBtn");

// Load settings
ipcRenderer.send("get-settings");

ipcRenderer.on("settings-data", (event, data) => {
  if (data.apiKey) apiKeyInput.value = data.apiKey;
  if (data.apiBase) apiBaseInput.value = data.apiBase;
  if (data.port) portInput.value = data.port;
  if (data.autoStart) autoStartCheck.checked = data.autoStart;
});

saveBtn.addEventListener("click", () => {
  const settings = {
    apiKey: apiKeyInput.value,
    apiBase: apiBaseInput.value,
    port: portInput.value,
    autoStart: autoStartCheck.checked,
  };
  ipcRenderer.send("save-settings", settings);
});

ipcRenderer.on("settings-saved", () => {
  alert("Settings saved!");
});

startBtn.addEventListener("click", () => {
  ipcRenderer.send("control-server", "start");
});

stopBtn.addEventListener("click", () => {
  ipcRenderer.send("control-server", "stop");
});

openWebBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const port = portInput.value || 11435;
  shell.openExternal(`http://localhost:${port}/`);
});

ipcRenderer.on("status", (event, status) => {
  statusText.innerText = status.charAt(0).toUpperCase() + status.slice(1);
  statusText.className = status;
  webLinkDiv.style.display = status === "running" ? "block" : "none";
});

ipcRenderer.on("error", (event, message) => {
  alert(message);
});
