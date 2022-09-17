import { contextBridge } from 'electron';
import * as Messenger from './ipc/RendererMessenger';

// Attaches an object called 'app' to the window global object
contextBridge.exposeInMainWorld('app', {
  messenger: {
    send: Messenger.send,
    listen: Messenger.listen,
    listenOnce: Messenger.listenOnce,
  },
});
