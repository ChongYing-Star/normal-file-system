import { NLocalFileSystem } from '~/file-system/NLocalFileSystem.js';
import { fromLocalization, cd } from '~/path/utils.js';
import { homedir } from 'node:os';
import { NFileNonExistentError, NFileSystemError, NNotDirectoryError } from '~/types/errors.js';
import { jest } from '@jest/globals';

const originalChdir = process.chdir;

const chdir = jest.fn(originalChdir);
process.chdir = chdir;
afterEach(() => chdir.mockImplementation(originalChdir));

const fs = NLocalFileSystem.instance;

test('Get home path', async () => {
  expect(fs.home).toBe(fromLocalization(homedir()));
});

test('Get home path', async () => {
  const dir = fs.getHomeDir();
  expect(dir.path).toBe(fs.home);
  expect(dir.fs).toBe(fs);
});

test('Get current path', async () => {
  expect(fs.current).toBe(fromLocalization(process.cwd()));
});

test('Get current path', async () => {
  const dir = fs.getCurrentDir();
  expect(dir.path).toBe(fs.current);
  expect(dir.fs).toBe(fs);
});

test('Cd success', () => {
  const current = fs.current;
  fs.cd('src');
  expect(fs.current).toBe(cd(current, 'src'));
  fs.cd(current);
});

test('Cd non existent dir', () => {
  expect(() => fs.cd('_____')).toThrow(NFileNonExistentError);
});

test('Cd file', () => {
  expect(() => fs.cd('package.json')).toThrow(NNotDirectoryError);
});

test('Cd throw unknown Error', () => {
  chdir.mockImplementation(() => { throw new Error; });
  expect(() => fs.cd('-----')).toThrow(NFileSystemError);
});

test('Cd throw unknown error type', () => {
  chdir.mockImplementation(() => { throw ''; });
  expect(() => fs.cd('-----')).toThrow(NFileSystemError);
});
