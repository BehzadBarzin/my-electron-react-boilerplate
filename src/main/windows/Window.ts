import path from 'path';
import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  shell,
} from 'electron';
import MenuBuilder from '../menus/MenuBuilder';
import AppUpdater from '../utils/AppUpdater';
import PathUtils from '../utils/PathUtils';
import { installExtensions } from '../utils/WindowUtils';

abstract class Window {
  window: BrowserWindow | null = null;

  abstract size: { x: number; y: number };

  abstract view: string;

  abstract icon: string;

  openDevTools: boolean = true;

  isDebug: boolean;

  isPackaged: boolean;

  constructor(isDebug: boolean, isPackaged: boolean) {
    this.isDebug = isDebug;
    this.isPackaged = isPackaged;
  }

  /**
   * This method must return an instance of menu builder to be used in createWindow
   */
  abstract getMenuBuilder(): MenuBuilder | null;

  async createWindow() {
    const pathUtils = new PathUtils(this.isPackaged);

    if (this.isDebug) {
      await installExtensions();
    }
    // WARN: Be careful with the preload paths below (they are relative to windows/Window.ts)
    const options: BrowserWindowConstructorOptions = {
      show: false,
      width: this.size.x,
      height: this.size.y,
      icon: pathUtils.getAssetPath(this.icon),
      webPreferences: {
        devTools: this.openDevTools,
        sandbox: false,
        preload: this.isPackaged
          ? path.join(__dirname, '../preload.js')
          : path.join(__dirname, '../../../.erb/dll/preload.js'),
      },
    };

    this.window = new BrowserWindow(options);

    this.window.loadURL(PathUtils.resolveHtmlPath(`${this.view}.html`));

    this.window.on('ready-to-show', () => {
      if (!this.window) {
        throw new Error('"mainWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        this.window.minimize();
      } else {
        this.window.show();
      }
    });

    this.window.on('closed', () => {
      this.window = null;
    });

    // If a class was provided as the menu builder, build the menu
    const menuBuilder = this.getMenuBuilder();
    if (menuBuilder) menuBuilder.buildMenu();

    // Open urls in the user's browser
    this.window.webContents.setWindowOpenHandler((edata) => {
      shell.openExternal(edata.url);
      return { action: 'deny' };
    });

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
      new AppUpdater();
  }
}

export default Window;
