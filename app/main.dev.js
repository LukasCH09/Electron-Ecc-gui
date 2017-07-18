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
import { app, Tray, Menu, BrowserWindow, nativeImage} from 'electron';
import path from 'path';
import MenuBuilder from './menu';
const autoUpdater = require("electron-updater").autoUpdater;
const settings = require('electron-settings');

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

  var ds = settings.get('settings.display');

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 670,
    minWidth: 1200,
    minHeight: 620,
    icon: 'icon.png',
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

    var iconPath = nativeImage.createFromDataURL("data:image/png;base64,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");



    //console.log(__static);
    
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
  
    // if(process.platform == "darwin"){
    //   tray.setImage('icon.png');  
    // }else if(process.platform == "linux"){
    //   tray.setImage('icon.png');  
    // }else if(process.platform.indexOf("win") > -1){
    //   tray.setImage('icon.ico');  
    // }

    tray.on('click', () => {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    });
  }

  autoUpdater.checkForUpdates();
});
