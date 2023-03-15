import { NFileInfo } from '~/file-info/index.js';

export interface NFileSystemBase {
  absolute: (path: string) => string,
  relative: (path: string) => string,
  getChildren: (path: string) => Promise<NFileInfo[]>,
}
