import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import { Channel } from './Channels';

// =============================================================================================

type MessageCallback = (...args: unknown[]) => void;

// =============================================================================================

/**
 * Send a message to the renderer process.
 * @param {Channel} channel - the channel on which we want to send a message
 * @param {unknown[]} args - a list of arguments that contain data
 */
const send = (
  window: BrowserWindow | null,
  channel: Channel,
  ...args: unknown[]
) => {
  if (window === null) return;
  window.webContents.send(channel, ...args);
};

// =============================================================================================

/**
 * Listen on a channel for any message from the renderer process.
 * @param {Channel} channel - the channel on which we want to listen for a message
 * @param {MessageCallback} func - listener that would be called when a message arrives
 * @returns - a function that when called, removes this listener
 */
const listen = (channel: Channel, func: MessageCallback) => {
  //--------------------------------------------------------------------------------------------
  // Calling the MessageCallback through the below one (essentially taking out _event)
  const callback = (_event: IpcMainEvent, ...args: unknown[]) => {
    func(...args);
  };
  //--------------------------------------------------------------------------------------------
  ipcMain.on(channel, callback);
  //--------------------------------------------------------------------------------------------
  // This is a function that is returned so that we could remove this listener
  const listenerRemover = () => {
    ipcMain.removeListener(channel, callback);
  };
  //--------------------------------------------------------------------------------------------
  return listenerRemover;
};

// =============================================================================================

/**
 * Listen on a channel for one message from the renderer process.
 * @param {Channel} channel - the channel on which we want to listen for a message
 * @param {MessageCallback} func - listener that would be called when the message arrives (only called once)
 */
const listenOnce = (channel: Channel, func: MessageCallback) => {
  //--------------------------------------------------------------------------------------------
  const callback = (_event: IpcMainEvent, ...args: unknown[]) => {
    // Calling the MessageCallback through the below one (essentially taking out _event)
    func(...args);
  };
  //--------------------------------------------------------------------------------------------
  ipcMain.once(channel, callback);
};

// =============================================================================================

export { send, listen, listenOnce };
