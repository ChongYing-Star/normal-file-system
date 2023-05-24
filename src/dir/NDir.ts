import { NFileSystem, NLocalFileSystem } from '~/file-system/index.js';
import { cd, basename, dirname } from '~/path/index.js';

export class NDir<T extends NFileSystem = NLocalFileSystem> {
  private __path: string;
  constructor (path: string)
  constructor (path: string, fs: T)
  constructor (path: string, readonly fs = NLocalFileSystem.instance) {
    this.__path = fs.absolute(path);
  }
  get path () { return this.__path; }
  get relativePath () {
    return this.fs.relative(this.__path);
  }
  get filename () {
    return basename(this.path);
  }
  get dirname () {
    return dirname(this.path);
  }
  getBasename (suffix?: string) {
    return basename(this.path, suffix);
  }
  cd (path: string) {
    this.__path = cd(this.__path, path);
    return this;
  }
  async exists (): Promise<boolean>
  async exists (path: string): Promise<boolean>
  async exists (path?: string): Promise<boolean> {
    try {
      const path_ = path ? cd(this.__path, path) : this.__path;
      const info = await this.fs.info(path_);
      return info.isDirectory();
    } catch (error) {
      return false;
    }
  }
}
