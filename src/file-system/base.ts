import { NFileInfo } from '~/file-info/index.js';

export interface NFileSystemBase {
  getChildren: (path: string) => Promise<NFileInfo[]>,
}
