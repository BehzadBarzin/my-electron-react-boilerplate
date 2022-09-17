import { ipcRenderer, IpcRendererEvent } from 'electron';
import { Channel } from './Channels';

// =============================================================================================

type MessageCallback = (...args: unknown[]) => void;

/**
 * The below types are declared for functions below so that they could be imported into /renderer/preload.d.ts
 */
export type TSend = (channel: Channel, ...args: unknown[]) => void;

export type TListen = (
  channel: Channel,
  func: MessageCallback
) => (() => void) | undefined;

export type TListenOnce = (channel: Channel, func: MessageCallback) => void;

// =============================================================================================

/**
 * Send a message to the main process.
 * @param {Channel} channel - the channel on which we want to send a message
 * @param {unknown[]} args - a list of arguments that contain data
 */
const send: TSend = (channel: Channel, ...args: unknown[]): void => {
  ipcRenderer.send(channel, ...args);
};

// =============================================================================================

/**
 * Listen on a channel for any message from the main process.
 * @param {Channel} channel - the channel on which we want to listen for a message
 * @param {MessageCallback} func - listener that would be called when a message arrives
 * @returns - a function that when called, removes this listener
 */
const listen: TListen = (
  channel: Channel,
  func: MessageCallback
): (() => void) | undefined => {
  //--------------------------------------------------------------------------------------------
  // Calling the MessageCallback through the below one (essentially taking out _event)
  const callback = (_event: IpcRendererEvent, ...args: unknown[]) => {
    func(...args);
  };
  //--------------------------------------------------------------------------------------------
  ipcRenderer.on(channel, callback);
  //--------------------------------------------------------------------------------------------
  // This is a function that is returned so that we could remove this listener
  const listenerRemover = () => {
    ipcRenderer.removeListener(channel, callback);
  };
  //--------------------------------------------------------------------------------------------
  return listenerRemover;
};

// =============================================================================================

/**
 * Listen on a channel for one message from the main process.
 * @param {Channel} channel - the channel on which we want to listen for a message
 * @param {MessageCallback} func - listener that would be called when the message arrives (only called once)
 */
const listenOnce: TListenOnce = (
  channel: Channel,
  func: MessageCallback
): void => {
  //--------------------------------------------------------------------------------------------
  const callback = (_event: IpcRendererEvent, ...args: unknown[]) => {
    // Calling the MessageCallback through the below one (essentially taking out _event)
    func(...args);
  };
  //--------------------------------------------------------------------------------------------
  ipcRenderer.once(channel, callback);
};

// =============================================================================================

export { send, listen, listenOnce };
