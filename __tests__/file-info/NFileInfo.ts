import { test, expect, vi, Mock } from 'vitest';
import { NLocalFileInfo } from '~/file-info/index.js';
import { NLocalFileSystem } from '~/file-system/index.js';

const fs = NLocalFileSystem.instance;

vi.mock('~path/utils.js', async (importActual) => {
  const m = await importActual() as typeof import('~path/utils.js');
  return {
    ...m,
    basename: vi.fn(m.basename),
    __basename: m.basename,
    dirname: vi.fn(m.dirname),
    __dirname: m.dirname,
    extname: vi.fn(m.extname),
    __extname: m.extname,
  };
});

test('NFileInfo', () => {
  const fs = {};
  const info = new NLocalFileInfo(fs as any, '/src/index.ts', {} as any);
  expect(info.fs).toBe(fs);
  expect(info.path).toBe('/src/index.ts');
});

test('Get file basename without suffix', async () => {
  const $path = await import('~path/utils.js');
  type F = typeof $path.basename;
  const { basename, __basename } = $path as unknown as { basename: Mock<Parameters<F>, ReturnType<F>>, __basename: F };
  const info = new NLocalFileInfo(fs, '/src/index.ts', {} as any);
  expect(info.getBasename()).toBe(__basename('/src/index.ts'));
  expect(basename).toHaveBeenCalledOnce();
  expect(basename).toHaveBeenCalledWith('/src/index.ts', undefined);
});

test('Get file basename with suffix', async () => {
  const $path = await import('~path/utils.js');
  type F = typeof $path.basename;
  const { basename, __basename } = $path as unknown as { basename: Mock<Parameters<F>, ReturnType<F>>, __basename: F };
  const info = new NLocalFileInfo(fs, '/src/index.ts', {} as any);
  expect(info.getBasename('.ts')).toBe(__basename('/src/index.ts', '.ts'));
  expect(basename).toHaveBeenCalledOnce();
  expect(basename).toHaveBeenCalledWith('/src/index.ts', '.ts');
});

test('File filename', async () => {
  const $path = await import('~path/utils.js');
  type F = typeof $path.basename;
  const { basename, __basename } = $path as unknown as { basename: Mock<Parameters<F>, ReturnType<F>>, __basename: F };
  const info = new NLocalFileInfo(fs, '/src/index.ts', {} as any);
  expect(info.filename).toBe(__basename('/src/index.ts'));
  expect(basename).toHaveBeenCalledOnce();
  expect(basename).toHaveBeenCalledWith('/src/index.ts');
});

test('File dirname', async () => {
  const $path = await import('~path/utils.js');
  type F = typeof $path.dirname;
  const { dirname, __dirname } = $path as unknown as { dirname: Mock<Parameters<F>, ReturnType<F>>, __dirname: F };
  const info = new NLocalFileInfo(fs, '/src/index.ts', {} as any);
  expect(info.dirname).toBe(__dirname('/src/index.ts'));
  expect(dirname).toHaveBeenCalledOnce();
  expect(dirname).toHaveBeenCalledWith('/src/index.ts');
});

test('File extname', async () => {
  const $path = await import('~path/utils.js');
  type F = typeof $path.extname;
  const { extname, __extname } = $path as unknown as { extname: Mock<Parameters<F>, ReturnType<F>>, __extname: F };
  const info = new NLocalFileInfo(fs, '/src/index.ts', {} as any);
  expect(info.extname).toBe(__extname('/src/index.ts'));
  expect(extname).toHaveBeenCalledOnce();
  expect(extname).toHaveBeenCalledWith('/src/index.ts');
});
