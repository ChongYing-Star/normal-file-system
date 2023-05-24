import { test, expect, beforeAll, beforeEach, vi } from 'vitest';
import { NLocalFileSystem } from '~/file-system/NLocalFileSystem.js';
import { NFileNonExistentError } from '~/types/errors.js';
import { platform as $platform } from 'node:process';

const fs = NLocalFileSystem.instance;

let chdir = vi.spyOn(process, 'chdir');
beforeEach(() => {
  chdir = vi.spyOn(process, 'chdir');
  return () => chdir.mockRestore();
});

beforeAll(() => {
  const platform = vi.spyOn(process, 'platform', 'get');
  platform.mockReturnValue('win32');
  return () => {
    platform.mockReturnValue($platform);
  };
});

test('Cd to "/"', () => {
  fs.cd('/');
  expect(fs.current).toBe('/');
  expect(chdir).not.toHaveBeenCalled();
});

test('Cd to "/illegal"', () => {
  expect(() => fs.cd('/illegal')).toThrow(NFileNonExistentError);
  expect(chdir).not.toHaveBeenCalled();
});
