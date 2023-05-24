import { test, expect, vi, Mock } from 'vitest';
import { NDir } from '~/dir/NDir.js';
import { NFileSystem, NLocalFileSystem } from '~/file-system/index.js';

vi.mock('~path/utils.js', async (importActual) => {
  const m = await importActual() as typeof import('~path/utils.js');
  return {
    ...m,
    basename: vi.fn(m.basename),
    __basename: m.basename,
    dirname: vi.fn(m.dirname),
    __dirname: m.dirname,
  };
});

test('Construct', () => {
  const dir = new NDir('/');
  expect(dir.path).toBe('/');
});

test('Construct with default file system', () => {
  const dir = new NDir('/');
  expect(dir.fs).toBe(NLocalFileSystem.instance);
});

test('Construct with my file system', () => {
  const fn = vi.fn();
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

test('Path filename', async () => {
  const $path = await import('~path/utils.js');
  type F = typeof $path.basename;
  const { basename, __basename } = $path as unknown as { basename: Mock<Parameters<F>, ReturnType<F>>, __basename: F };
  expect(new NDir('/src/index.ts').filename).toBe(__basename('/src/index.ts'));
  expect(basename).toHaveBeenCalledOnce();
  expect(basename).toHaveBeenCalledWith('/src/index.ts');
});

test('Path dirname', async () => {
  const $path = await import('~path/utils.js');
  type F = typeof $path.dirname;
  const { dirname, __dirname } = $path as unknown as { dirname: Mock<Parameters<F>, ReturnType<F>>, __dirname: F };
  expect(new NDir('/src/index.ts').dirname).toBe(__dirname('/src/index.ts'));
  expect(dirname).toHaveBeenCalledOnce();
  expect(dirname).toHaveBeenCalledWith('/src/index.ts');
});

test('Get path basename without suffix', async () => {
  const $path = await import('~path/utils.js');
  type F = typeof $path.basename;
  const { basename, __basename } = $path as unknown as { basename: Mock<Parameters<F>, ReturnType<F>>, __basename: F };
  expect(new NDir('/src/index.ts').getBasename()).toBe(__basename('/src/index.ts'));
  expect(basename).toHaveBeenCalledOnce();
  expect(basename).toHaveBeenCalledWith('/src/index.ts', undefined);
});

test('Get path basename with suffix', async () => {
  const $path = await import('~path/utils.js');
  type F = typeof $path.basename;
  const { basename, __basename } = $path as unknown as { basename: Mock<Parameters<F>, ReturnType<F>>, __basename: F };
  expect(new NDir('/src/index.ts').getBasename('.ts')).toBe(__basename('/src/index.ts', '.ts'));
  expect(basename).toHaveBeenCalledOnce();
  expect(basename).toHaveBeenCalledWith('/src/index.ts', '.ts');
});
