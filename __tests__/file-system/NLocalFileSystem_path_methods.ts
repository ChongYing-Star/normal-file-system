import { test, expect, beforeEach, vi } from 'vitest';
import { NLocalFileSystem } from '~/file-system/NLocalFileSystem.js';
import { fromLocalization } from '~/path/index.js';
import { homedir } from 'node:os';
import { NFileNonExistentError, NNotDirectoryError, NFileSystemError } from '~/types/errors.js';
import { cwd as $cwd } from 'node:process';
import { NodeProcessChdirError } from '~/types/node.js';

let chdir = vi.spyOn(process, 'chdir');
beforeEach(() => {
  chdir = vi.spyOn(process, 'chdir');
  return () => chdir.mockRestore();
});

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
  expect(fs.current).toBe(fromLocalization($cwd()));
});

test('Get current path', async () => {
  const dir = fs.getCurrentDir();
  expect(dir.path).toBe(fs.current);
  expect(dir.fs).toBe(fs);
});

test('Cd success', () => {
  chdir.mockImplementation(() => void 0);
  fs.cd('src');
  expect(chdir).toHaveBeenCalledOnce();
  expect(chdir).toHaveBeenCalledWith('src');
});

test('Cd not existent', () => {
  const error = new Error as NodeProcessChdirError;
  error.code = 'ENOENT';
  chdir.mockImplementation(() => { throw error; });
  expect(() => fs.cd('_____')).toThrow(NFileNonExistentError);
  expect(chdir).toHaveBeenCalledOnce();
  expect(chdir).toHaveBeenCalledWith('_____');
});

test('Cd not directory', () => {
  const error = new Error as NodeProcessChdirError;
  error.code = 'ENOTDIR';
  chdir.mockImplementation(() => { throw error; });
  expect(() => fs.cd('_____')).toThrow(NNotDirectoryError);
  expect(chdir).toHaveBeenCalledOnce();
  expect(chdir).toHaveBeenCalledWith('_____');
});

test('Cd throw unknown Error', () => {
  chdir.mockImplementation(() => { throw new Error; });
  expect(() => fs.cd('_____')).toThrow(NFileSystemError);
  expect(chdir).toHaveBeenCalledOnce();
  expect(chdir).toHaveBeenCalledWith('_____');
});

test('Cd throw unknown error type', () => {
  chdir.mockImplementation(() => { throw ''; });
  expect(() => fs.cd('_____')).toThrow(NFileSystemError);
  expect(chdir).toHaveBeenCalledOnce();
  expect(chdir).toHaveBeenCalledWith('_____');
});

test('Make absolute', () => {
  expect(fs.absolute('src')).toBe(fs.current + '/src');
  expect(fs.absolute('/src')).toBe('/src');
});

test('Relative', () => {
  expect(fs.relative(fs.current + '/src')).toBe('src');
  expect(fs.relative(fs.current)).toBe('');
  expect(fs.relative(fs.absolute('..'))).toBe('..');
  expect(fs.relative(fs.absolute('../../test'))).toBe('../../test');
  expect(fs.relative('src')).toBe('src');
});
