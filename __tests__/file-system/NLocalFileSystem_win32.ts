import { NLocalFileSystem } from '~/file-system/NLocalFileSystem.js';
import { NFileNonExistentError } from '~/types/errors.js';
import { jest } from '@jest/globals';
import { chdir as $chdir, cwd as $cwd, platform as $platform } from 'node:process';

const fs = NLocalFileSystem.instance;

const platform = jest.fn();
platform.mockReturnValue($platform);
Object.defineProperty(process, 'platform', { get: platform });
beforeAll(() => platform.mockReturnValue('win32'));
afterAll(() => platform.mockReturnValue($platform));

test('Cd to "/"', () => {
  const current = $cwd();
  try {
    fs.cd('/');
    expect(fs.current).toBe('/');
  } finally {
    $chdir(current);
  }
});

test('Cd to "/illegal"', () => {
  const current = $cwd();
  try {
    expect(() => fs.cd('/illegal')).toThrow(NFileNonExistentError);
    expect($cwd()).toBe(current);
  } finally {
    $chdir(current);
  }
});
