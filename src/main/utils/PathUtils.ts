/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';

class PathUtils {
  resourcesPath: string;

  constructor(isPackaged: boolean) {
    this.resourcesPath = isPackaged
      ? path.join(process.resourcesPath, 'assets')
      : path.join(__dirname, '../../assets');
  }

  static resolveHtmlPath(htmlFileName: string) {
    if (process.env.NODE_ENV === 'development') {
      const port = process.env.PORT || 1212;
      const url = new URL(`http://localhost:${port}`);
      url.pathname = htmlFileName;
      return url.href;
    }
    return `file://${path.resolve(
      __dirname,
      '../renderer/templates/',
      htmlFileName
    )}`;
  }

  getAssetPath(...paths: string[]): string {
    return path.join(this.resourcesPath, ...paths);
  }
}

export default PathUtils;
