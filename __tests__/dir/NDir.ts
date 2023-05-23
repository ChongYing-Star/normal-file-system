import { NDir } from '~/dir/NDir.js';
import { NFileSystem, NLocalFileSystem } from '~/file-system/index.js';
import { jest } from '@jest/globals';

test('Construct', () => {
  const dir = new NDir('/');
  expect(dir.path).toBe('/');
});

test('Construct with default file system', () => {
  const dir = new NDir('/');
  expect(dir.fs).toBe(NLocalFileSystem.instance);
});

test('Construct with my file system', () => {
  const fn = jest.fn();
  class MyFileSystem { absolute = fn; }
  const fs = new MyFileSystem;
  const dir = new NDir('/', fs as unknown as NFileSystem);
  expect(dir.fs).toBe(fs);
  expect(fn).toBeCalledWith('/');
});

test('Cd', () => {
  const dir = new NDir('d:/root');
  const path = dir.path;
  expect(dir.path).toBe(path);
  dir.cd('test');
  expect(dir.path).toBe(path + '/test');
  dir.cd('c:/test');
  expect(dir.relativePath).toBe('d:/root/test/c:/test');
  dir.cd('..');
  expect(dir.relativePath).toBe('d:/root/test/c:');
  dir.cd('../../other');
  expect(dir.relativePath).toBe('d:/root/other');
  dir.cd('/home');
  expect(dir.path).toBe('/home');
  dir.cd('../..');
  expect(dir.path).toBe('/');
  dir.cd('..');
  expect(dir.path).toBe('/');
});

test('Absolute path', () => {
  expect(new NDir('src/index.ts').path).toBe(NLocalFileSystem.instance.current + '/src/index.ts');
  expect(new NDir('/src/index.ts').path).toBe('/src/index.ts');
});

test('Relative path', () => {
  expect(new NDir('src/index.ts').relativePath).toBe('src/index.ts');
  expect(new NDir('../test').relativePath).toBe('../test');
});
