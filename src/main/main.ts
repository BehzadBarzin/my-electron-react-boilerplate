/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app } from 'electron';
import MainWindow from './windows/MainWindow';
import { Channels } from './ipc/Channels';
import * as Messenger from './ipc/MainMessenger';

// =============================================================================================

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

// =============================================================================================

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) require('electron-debug')();

// =============================================================================================

/**
 * Creating windows
 */
const mainWindow: MainWindow = new MainWindow(isDebug, app.isPackaged);

// =============================================================================================

/**
 * Add event listeners...
 */
// Get message from front
Messenger.listen(Channels.Main, (...args) => {
  console.log(args[0]);
});

// =============================================================================================

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// =============================================================================================

app
  .whenReady()
  .then(async () => {
    //-------------------------------------------------------------------------------------------
    // Call the createWindow method of windows
    await mainWindow.createWindow();
    //-------------------------------------------------------------------------------------------
    // When the window is rendered, send a message
    // NOTE: We put this here, because mainWindow.createWindow() must have been called
    mainWindow.window?.webContents.once('dom-ready', () => {
      Messenger.send(mainWindow.window, Channels.Main, 'Hello from back!');
    });
    //-------------------------------------------------------------------------------------------
    app.on('activate', async () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow.window === null) await mainWindow.createWindow();
    });
    //-------------------------------------------------------------------------------------------
  })
  .catch(console.log);
