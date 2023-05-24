import { normalize, fromLocalization, localization, cd, relative, isAbsolute } from '~/path/index.js';
import { homedir } from 'node:os';
import { NDir } from '~/dir/index.js';
import { NodeProcessChdirError } from '~/types/node.js';
import { NFileNonExistentError, NFileSystemError, NNotDirectoryError } from '~/types/errors.js';
import { NLocalFileInfo, NLocalWin32RootFileInfo } from '~/file-info/index.js';
import { NFileSystem } from './NFileSystem.js';
import { lstat, access, constants } from 'node:fs/promises';

export class NLocalFileSystem extends NFileSystem {
  private static __instance: NLocalFileSystem;
  private __win32_current_is_root = false;

  static get instance () {
    if (NLocalFileSystem.__instance === undefined) {
      NLocalFileSystem.__instance = new NLocalFileSystem();
    }
    return NLocalFileSystem.__instance;
  }

  private constructor () {
    super();
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
   * @throws { NFileNonExistentError } 如果指定的`path`不存在，将抛出错误
   * @throws { NNotDirectoryError } 如果指定的`path`不是一个文件夹，将抛出错误
   * @throws { NFileSystemError } 未知错误
   */
  cd (path: string) {
    const _fullPath = this.absolute(path);
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
      throw _catchLocalFsError(error, _fullPath);
    }
  }

  absolute (path: string): string {
    return cd(this.current, path);
  }
  relative (path: string): string {
    if (!isAbsolute(path)) {
      return path;
    }
    return relative(this.current, normalize(path));
  }
  /**
   * 获取指定`path`在信息
   * @throws { NFileNonExistentError } 如果指定的`path`不存在，将抛出错误
   * @throws { NFileSystemError } 未知错误
   */
  async info (path: string) {
    const _fullPath = this.absolute(path);
    if (process.platform === 'win32') {
      if (_fullPath === '/') {
        return new NLocalWin32RootFileInfo(this);
      }
      if (!/^\/\w:/.test(_fullPath)) {
        throw new NFileNonExistentError(_fullPath);
      }
    }
    try {
      const stats = await lstat(localization(_fullPath), { bigint: true });
      return new NLocalFileInfo(this, _fullPath, stats);
    } catch (error) {
      throw _catchLocalFsError(error, _fullPath);
    }
  }
  async exists (path: string) {
    const _fullPath = this.absolute(path);
    if (process.platform === 'win32') {
      if (_fullPath === '/') {
        return true;
      }
      if (!/^\/\w:/.test(_fullPath)) {
        return false;
      }
    }
    return access(localization(_fullPath), constants.F_OK)
      .then(() => true)
      .catch(() => false);
  }
}

function _catchLocalFsError (error: any, fullPath: string) {
  if ((error as Error).name === 'Error') {
    switch ((error as NodeProcessChdirError).code) {
      case 'ENOENT': return new NFileNonExistentError(fullPath, error);
      case 'ENOTDIR': return new NNotDirectoryError(fullPath, error);
      default: return new NFileSystemError((error as Error).message, error);
    }
  } else {
    return new NFileSystemError('Unknown error', error);
  }
}
