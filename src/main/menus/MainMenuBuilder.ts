import { MenuItemConstructorOptions } from 'electron';
import MenuBuilder from './MenuBuilder';

export default class MainMenuBuilder extends MenuBuilder {
  // ==================================================================================================

  /**
   *  Create template for menus in Mac OS
   * @returns menuTemplate {MenuItemConstructorOptions[]}
   */
  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    //-------------------------------------------------------------------------------------------------
    // 'View' menu (in development mode)
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.window.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.window.setFullScreen(!this.window.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.window.webContents.toggleDevTools();
          },
        },
      ],
    };
    //-------------------------------------------------------------------------------------------------
    // 'View' menu (in producition mode)
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.window.setFullScreen(!this.window.isFullScreen());
          },
        },
      ],
    };
    //-------------------------------------------------------------------------------------------------
    // subMenuView → If in development mode or debug (in production), use 'subMenuViewDev', otherwise use 'subMenuViewProd'
    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    // Return an array of menu items
    return [subMenuView];
  }

  // ==================================================================================================

  /**
   *  Create template for menus in Windows and Linux
   * @returns menuTemplate {Object[]}
   */
  buildDefaultTemplate() {
    //-------------------------------------------------------------------------------------------------
    /**
     * Construct an array of menu objects
     * const templateDefault = [
     *    {
     *        label: 'Top level Menu label',
     *        submenu: [
     *            {
     *                label: 'Submenu label',
     *                accelerator: 'Shortcut associated with this submenu',
     *                click: function() {  What to do when clicked  }
     *            },
     *          ...other submenus...
     *         ]
     *    }
     *    ,
     *    ...other top menus...
     * ];
     */
    const templateDefault = [
      {
        label: '&View', // Top level menu
        // Array of menus under 'View'
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                // Development mode submenus under 'View'
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.window.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.window.setFullScreen(!this.window.isFullScreen());
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.window.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                // Production mode submenus under 'View'
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.window.setFullScreen(!this.window.isFullScreen());
                  },
                },
              ],
      },
    ];

    //-------------------------------------------------------------------------------------------------
    return templateDefault;
  }
}
