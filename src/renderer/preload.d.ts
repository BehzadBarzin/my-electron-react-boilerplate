import { TSend, TListen, TListenOnce } from '../main/ipc/RendererMessenger';

/**
 * This file declares the types of objects attached to global window object via the preload (using contextBridge)
 * This is so that we wouldn't get any errors when using them in the frontend
 */
declare global {
  interface Window {
    app: {
      messenger: {
        send: TSend;
        listen: TListen;
        listenOnce: TListenOnce;
      };
    };
  }
}

export {};
