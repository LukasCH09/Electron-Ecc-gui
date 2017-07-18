/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, Tray, Menu, BrowserWindow} from 'electron';
import path from 'path';
import MenuBuilder from './menu';
const autoUpdater = require("electron-updater").autoUpdater;
const settings = require('electron-settings');

var ds = settings.get('settings.display');
let tray = null;


function sendStatusToWindow(text) {
  console.log(text);
  mainWindow.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater.');
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded; will install in 5 seconds');
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  setTimeout(function() {
    autoUpdater.quitAndInstall();  
  }, 5000)
})


let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};



app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 670,
    minWidth: 1200,
    minHeight: 620,
    icon: path.join(__dirname, 'icon.png'),
    title: "Ecc-Wallet"
  });

  mainWindow.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('minimize',function(event){
    if(ds != undefined && ds.minimise_to_tray != undefined && ds.minimise_to_tray){
      event.preventDefault();
      mainWindow.setSkipTaskbar(true);
      mainWindow.hide();
      return false;
    }
  });

  mainWindow.on('show',function(event){
    mainWindow.setSkipTaskbar(false);
  });


  mainWindow.on('close', function (event) {
    if(ds != undefined && ds.minimise_on_close != undefined && ds.minimise_on_close){
      event.preventDefault();
      if(!ds.minimise_to_tray){
        mainWindow.minimize();
      }else{
        mainWindow.hide();
      }
    }else{
      app.quit();
    }
    return false;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  if(ds == undefined || ds.tray_icon == undefined || !ds.tray_icon){
    const iconPath = path.join(__dirname, 'icon.png');
    const defaultMenu = [
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() {
          app.exit(0);
        }
      },
    ];

    tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate(defaultMenu);
    tray.setToolTip('Ecc-Wallet');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    });
  }

  autoUpdater.checkForUpdates();
});
