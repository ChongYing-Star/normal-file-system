import { normalize, resolve } from '~path/index.js';
import { homedir } from 'node:os';
import { NDir } from '~/dir/index.js';
import { chdir, cwd } from 'node:process';
import { NodeProcessChdirError } from '~/types/node.js';
import { NFileNonExistentError, NFileSystemError } from '~/types/errors.js';
import { NFileInfo } from '~/file-info/index.js';
import { NFileSystemBase } from './base.js';

export class NFileSystem implements NFileSystemBase {
  constructor () {
    // ...
  }
  get home () {
    return normalize(homedir());
  }
  getHomeDir () {
    return new NDir(this.home, this);
  }
  get current () {
    return normalize(cwd());
  }
  getCurrentDir () {
    return new NDir(this.current, this);
  }
  /**
   * `cd`方法更改Node.js进程的当前工作目录，或者在失败时抛出异常（例如，如果指定的`path`不存在）。
   *
   * 此功能在`Worker`线程中不可用。
   * @throws NFileSystemError | NFileNonExistentError
   */
  cd (path: string) {
    const _fullPath = resolve(this.current, path);
    try {
      return chdir(path);
    } catch (error) {
      if (error instanceof Error) {
        if ((error as NodeProcessChdirError).code === 'ENOENT') {
          throw new NFileNonExistentError(_fullPath, error);
        } else {
          throw new NFileSystemError(error.message, error);
        }
      } else {
        throw new NFileSystemError('Unknown error', error);
      }
    }
  }

  async getChildren (path: string): Promise<NFileInfo[]> {
    path;
    return [];
  }
}
