import { NLocalFileSystem } from '~/file-system/index.js';
import { BigIntStats, constants } from 'node:fs';
import { access } from 'node:fs/promises';
import { NFileInfo } from './NFileInfo.js';
import { localization } from '~path/index.js';

export class NLocalFileInfo extends NFileInfo<NLocalFileSystem> {
  constructor (fs: NLocalFileSystem, path: string, public readonly stats: BigIntStats) {
    super(path, fs);
  }
  async isReadable () {
    return access(localization(this.path), constants.R_OK | constants.X_OK)
      .then(() => true)
      .catch(() => false);
  }
  async isWritable () {
    return access(localization(this.path), constants.W_OK)
      .then(() => true)
      .catch(() => false);
  }
  get birthTime () {
    return this.stats.birthtime;
  }
  isFile () {
    return this.stats.isFile();
  }
  isDirectory () {
    return this.stats.isDirectory();
  }
  isSymbolicLink () {
    return this.stats.isSymbolicLink();
  }
}

export class NLocalWin32RootFileInfo extends NFileInfo<NLocalFileSystem> {
  constructor (fs: NLocalFileSystem) {
    super('/', fs);
  }
  isReadable () {
    return Promise.resolve(true);
  }
  isWritable () {
    return Promise.resolve(false);
  }

  get birthTime () {
    return new Date(0);
  }
  isDirectory () {
    return true;
  }
  isFile () {
    return false;
  }
  isSymbolicLink () {
    return false;
  }
}
