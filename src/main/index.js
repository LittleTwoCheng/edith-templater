"use strict";

import { app, BrowserWindow, ipcMain, shell } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";
import getAppSettings from "./getAppSettings";
import getTemplateNames from "./getTemplateNames";
import getDataSetAsync from "./getDataSetAsync";
import os from "os";
import throttle from "../core/throttle";
import { config } from "dotenv";
config();

const isDevelopment = process.env.NODE_ENV !== "production";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow() {
  const window = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
      })
    );
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

let store = {};
let appData = null;
const dataSetPromise = getDataSetAsync(__static);

function onAppEvent(event, action) {
  // console.log("💥onAppEvent", { action });
  const mutatedStore = reduceActions(store, action);
  if (mutatedStore) {
    mainWindow.webContents.send("storeUpdated", {
      appData,
      store: {
        ...store,
        ...mutatedStore
      }
    });
  }
}

const shellOpenItemWithThrottle = throttle(
  path => shell.openItem(path),
  1000,
  true
);
function reduceActions(store, { type, payload }) {
  switch (type) {
    case "document.open":
      shellOpenItemWithThrottle(payload.path);
      return null;

    default:
      //do nothing
      return null;
  }
}

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  mainWindow = createMainWindow();

  if (isDevelopment && process.env.REACT_DEVTOOL_PATH) {
    BrowserWindow.addDevToolsExtension(
      path.join(os.homedir(), process.env.REACT_DEVTOOL_PATH)
    );
  }
  mainWindow.webContents.on("did-finish-load", () => {
    dataSetPromise.then(dataSet => {
      appData = {
        settings: getAppSettings(__static, getTemplateNames),
        dataSet
      };

      ipcMain.on("appEvent", onAppEvent);
      mainWindow.webContents.send("appUpdated", { appData, store });
    });
  });
});
