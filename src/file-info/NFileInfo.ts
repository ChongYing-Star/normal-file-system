import { NFileSystem, NLocalFileSystem } from '~/file-system/index.js';
import { basename, dirname, extname } from '~path/index.js';

export abstract class NFileInfo<T extends NFileSystem = NLocalFileSystem> {
  constructor (path: string)
  constructor (path: string, fs: T)
  constructor (public readonly path: string, readonly fs = NLocalFileSystem.instance) {
  }

  getBasename (suffix?: string) {
    return basename(this.path, suffix);
  }
  get extname () {
    return extname(this.path);
  }
  get filename () {
    return basename(this.path);
  }
  get dirname () {
    return dirname(this.path);
  }
  abstract isReadable (): Promise<boolean>;
  abstract isWritable (): Promise<boolean>;
  abstract readonly birthTime: Date;
  abstract isFile (): boolean;
  abstract isDirectory (): boolean;
  abstract isSymbolicLink (): boolean;
}
