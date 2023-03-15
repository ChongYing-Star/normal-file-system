import { normalize, fromLocalization, localization, cd, relative } from '~/path/utils.js';
import { homedir } from 'node:os';
import { NDir } from '~/dir/index.js';
import { NodeProcessChdirError } from '~/types/node.js';
import { NFileNonExistentError, NFileSystemError, NNotDirectoryError } from '~/types/errors.js';
import { NFileInfo } from '~/file-info/index.js';
import { NFileSystemBase } from './base.js';

export class NLocalFileSystem implements NFileSystemBase {
  private static __instance: NLocalFileSystem;
  private __win32_current_is_root = false;

  static get instance () {
    if (NLocalFileSystem.__instance === undefined) {
      NLocalFileSystem.__instance = new NLocalFileSystem();
    }
    return NLocalFileSystem.__instance;
  }

  private constructor () {
    // ...
  }
  get home () {
    return fromLocalization(homedir());
  }
  getHomeDir () {
    return new NDir(this.home, this);
  }
  get current () {
    if (process.platform === 'win32' && this.__win32_current_is_root) {
      return '/';
    }
    return fromLocalization(process.cwd());
  }
  getCurrentDir () {
    return new NDir(this.current, this);
  }
  /**
   * `cd`方法更改Node.js进程的当前工作目录，或者在失败时抛出异常（例如，如果指定的`path`不存在）。
   *
   * 此功能在`Worker`线程中不可用。
   * @throws NFileSystemError | NFileNonExistentError | NNotDirectoryError
   */
  cd (path: string) {
    const _fullPath = cd(this.current, path);
    if (process.platform === 'win32') {
      if (_fullPath === '/') {
        this.__win32_current_is_root = true;
        return;
      }
      if (!/^\/\w:/.test(_fullPath)) {
        throw new NFileNonExistentError(_fullPath);
      }
    }
    try {
      return process.chdir(localization(path));
    } catch (error) {
      if ((error as Error).name === 'Error') {
        switch ((error as NodeProcessChdirError).code) {
          case 'ENOENT': throw new NFileNonExistentError(_fullPath, error);
          case 'ENOTDIR': throw new NNotDirectoryError(_fullPath, error);
          default: throw new NFileSystemError((error as Error).message, error);
        }
      } else {
        throw new NFileSystemError('Unknown error', error);
      }
    }
  }

  makeAbsolute (path: string): string {
    return cd(this.current, path);
  }
  relative (path: string): string {
    return relative(this.current, normalize(path));
  }
  async getChildren (path: string): Promise<NFileInfo[]> {
    path;
    return [];
  }
}
