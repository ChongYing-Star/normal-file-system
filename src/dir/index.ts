import { NFileSystemBase, fs as defaultFs } from '~/file-system/index.js';
import { resolve } from 'node:path';
import { normalize } from '~path/index.js';

export class NDir<T extends NFileSystemBase> {
  private __path: string;
  constructor (path: string)
  constructor (path: string, fs: T)
  constructor (path: string, readonly fs = defaultFs) {
    this.__path = normalize(path);
  }
  get path () { return this.__path; }
  cd (path: string) {
    this.__path = resolve(this.__path, normalize(path));
    return this;
  }
}
