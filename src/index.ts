import { NLocalFileSystem } from '~/file-system/index.js';
import { NDir } from '~/dir/index.js';
import { fromLocalization } from '~/path/utils.js';

try {
  console.log(NLocalFileSystem.instance.home);
  console.log(NLocalFileSystem.instance.current);
  const dir = new NDir('d:\\root');
  console.log(dir.path); // 'd:/root'
  dir.cd('test');
  console.log(dir.path); // 'd:/root/test'
  dir.cd('c:/test');
  console.log(dir.path); // 'd:/root/test/c:/test'
  dir.cd(fromLocalization('c:\\root'));
  console.log(dir.path); // win: '/C:/root' else: 'd:/root/test/c:/test/c:/root'
} catch (error) {
  console.log(error);
  console.log(error instanceof Error);
}
