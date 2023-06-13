import { exec } from 'node:child_process';
import { ChildProcessError } from '~/types/errors.js';

export async function getAllCaption () {
  if (process.platform !== 'win32') {
    return [];
  }
  const stdout = await new Promise<string>((resolve, reject) => {
    // cSpell:disable-next-line
    exec('wmic logicaldisk get caption', { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        reject(new ChildProcessError('Fail to carry out command', error, stderr));
      } else {
        resolve(stdout);
      }
    });
  });
  return stdout.match(/\n([A-Z]:)/g)?.map((str) => str.slice(1)) ?? [];
}
