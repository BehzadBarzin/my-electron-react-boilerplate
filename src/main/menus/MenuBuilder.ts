import { Menu, BrowserWindow, MenuItemConstructorOptions } from 'electron';

export interface DarwinMenuItemConstructorOptions
  extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default abstract class MenuBuilder {
  window: BrowserWindow;

  constructor(window: BrowserWindow) {
    this.window = window;
  }

  // ==================================================================================================
  /**
   * Create a menu object to be attached to window
   * @returns menu {Menu} - returns a menu object
   */
  buildMenu(): Menu {
    // If in dev mode or debug mode (in production) setup dev environment
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    // Get the menu template based on OS (Mac or Other)
    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    // Build menu from template defined above
    const menu = Menu.buildFromTemplate(template);

    /**
     * Set menu too all of the windows in application
     * On macOS → sets menu as the application menu.
     * On Windows and Linux → the menu will be set as each window's top menu.
     */
    Menu.setApplicationMenu(menu);

    return menu;
  }

  // ==================================================================================================

  /**
   * Setup an option for inspecting elements via 'dev tools' in the context menu
   * Calls this method if in dev mode or debug is on in production mode (called in 'buildMenu' method)
   */
  setupDevelopmentEnvironment(): void {
    this.window.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.window.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.window });
    });
  }

  // ==================================================================================================

  /**
   *  Create template for menus in Mac OS
   * @returns menuTemplate {MenuItemConstructorOptions[]}
   */
  abstract buildDarwinTemplate(): MenuItemConstructorOptions[];

  // ==================================================================================================

  /**
   *  Create template for menus in Windows and Linux
   * @returns menuTemplate {Object[]}
   */
  abstract buildDefaultTemplate(): any[];
}
