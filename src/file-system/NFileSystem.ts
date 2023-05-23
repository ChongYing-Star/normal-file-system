import { NFileInfo } from '~/file-info/index.js';

export abstract class NFileSystem {
  abstract absolute (path: string): string;
  abstract relative (path: string): string;
  abstract info (path: string): Promise<NFileInfo>;
  abstract exists (path: string): Promise<boolean>;
}
