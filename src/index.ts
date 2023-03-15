import { NDir } from '~/dir/index.js';

try {
  const dir = new NDir('d:\\root');
  console.log(dir.path);
} catch (error) {
  console.log(error);
  console.log(error instanceof Error);
}
