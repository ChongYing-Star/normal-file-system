import { NFileInfo } from '~/file-info/index.js';

export interface NFileSystemBase {
  makeAbsolute: (path: string) => string,
  getChildren: (path: string) => Promise<NFileInfo[]>,
}
