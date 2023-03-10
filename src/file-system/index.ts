import { normalize } from '~path/index.js';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { Dir } from '~/dir/index.js';
import { chdir, cwd } from 'node:process';
import { NodeProcessChdirError } from '~/types/node.js';
import { FileNonExistentError, FileSystemError } from '~/types/errors.js';

export class FileSystem {
  constructor () {
    // ...
  }
  get home () {
    return normalize(homedir());
  }
  getHomeDir () {
    return new Dir(this.home, this);
  }
  get current () {
    return normalize(cwd());
  }
  getCurrentDir () {
    return new Dir(this.current, this);
  }
  /**
   * `cd`方法更改Node.js进程的当前工作目录，或者在失败时抛出异常（例如，如果指定的`path`不存在）。
   *
   * 此功能在`Worker`线程中不可用。
   * @throws FileSystemError
   */
  cd (path: string) {
    const _fullPath = resolve(this.current, path);
    try {
      return chdir(path);
    } catch (error) {
      if (error instanceof Error) {
        if ((error as NodeProcessChdirError).code === 'ENOENT') {
          throw new FileNonExistentError(_fullPath, error);
        } else {
          throw new FileSystemError(error.message, error);
        }
      } else {
        throw new FileSystemError('Unknown error', error);
      }
    }
  }
}

export const fs = new FileSystem();
