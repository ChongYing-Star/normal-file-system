import { fs } from '~/file-system/index.js';

try {
  fs.cd('/________');
  console.log('done');
} catch (error) {
  console.log(error);
  console.log(error instanceof Error);
}
