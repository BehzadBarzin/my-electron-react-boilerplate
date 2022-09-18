import MenuBuilder from 'main/menus/MenuBuilder';
import MainMenuBuilder from '../menus/MainMenuBuilder';
import Window from './Window';

class MainWindow extends Window {
  size = { x: 800, y: 480 };

  view = 'index';

  icon = 'icon.png';

  openDevTools = false;

  getMenuBuilder(): MenuBuilder | null {
    if (this.window) {
      return new MainMenuBuilder(this.window);
    }
    return null;
  }
}

export default MainWindow;
