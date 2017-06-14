
const electron = require('electron');
const path = require('path');
const url = require('url');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden-inset',
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
