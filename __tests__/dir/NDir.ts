import { NDir } from '~/dir/NDir.js';
import { NFileSystemBase, NLocalFileSystem } from '~/file-system/index.js';

test('Construct', () => {
  const dir = new NDir('/');
  expect(dir.path).toBe('/');
});

test('Construct with default file system', () => {
  const dir = new NDir('/');
  expect(dir.fs).toBe(NLocalFileSystem.instance);
});

test('Construct with my file system', () => {
  class MyFileSystem {}
  const fs = new MyFileSystem;
  const dir = new NDir('/', fs as NFileSystemBase);
  expect(dir.fs).toBe(fs);
});

test('Cd', () => {
  const dir = new NDir('d:/root');
  expect(dir.path).toBe('d:/root');
  dir.cd('test');
  expect(dir.path).toBe('d:/root/test');
  dir.cd('c:/test');
  expect(dir.path).toBe('d:/root/test/c:/test');
  dir.cd('..');
  expect(dir.path).toBe('d:/root/test/c:');
  dir.cd('../../other');
  expect(dir.path).toBe('d:/root/other');
  dir.cd('/home');
  expect(dir.path).toBe('/home');
  dir.cd('../..');
  expect(dir.path).toBe('/');
  dir.cd('..');
  expect(dir.path).toBe('/');
});

test('To absolute', () => {
  expect(new NDir('src/index.ts').toAbsolute().path).toBe(NLocalFileSystem.instance.current + '/src/index.ts');
  expect(new NDir('/src/index.ts').toAbsolute().path).toBe('/src/index.ts');
});

test('To relative', () => {
  expect(new NDir('src/index.ts').toRelative().path).toBe('src/index.ts');
  expect(new NDir('../test').toAbsolute().toRelative().path).toBe('../test');
});
