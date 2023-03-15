import { NFileSystemBase, NLocalFileSystem } from '~/file-system/index.js';
import { normalize, cd } from '~/path/utils.js';

export class NDir<T extends NFileSystemBase> {
  private __path: string;
  constructor (path: string)
  constructor (path: string, fs: T)
  constructor (path: string, readonly fs = NLocalFileSystem.instance) {
    this.__path = normalize(path);
  }
  get path () { return this.__path; }
  cd (path: string) {
    this.__path = cd(this.__path, normalize(path));
    return this;
  }
  toAbsolute () {
    this.__path = this.fs.absolute(this.__path);
    return this;
  }
  toRelative () {
    this.__path = this.fs.relative(this.__path);
    return this;
  }
}
