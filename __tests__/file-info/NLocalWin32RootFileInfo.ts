import { test, expect, describe, vi, Mock } from 'vitest';
import { NFileInfo, NLocalWin32RootFileInfo } from '~/file-info/index.js';
import * as $fs from 'node:fs/promises';

test('Instance of NFileInfo', () => {
  const info = new NLocalWin32RootFileInfo({} as any);
  expect(info).toBeInstanceOf(NFileInfo);
});

test('The path must be "/"', () => {
  const info = new NLocalWin32RootFileInfo({} as any);
  expect(info.path).toBe('/');
});

test('The birthtime must be "origin"', () => {
  const info = new NLocalWin32RootFileInfo({} as any);
  expect(info.birthTime.valueOf()).toBe(0);
});

test('Is must not be file', () => {
  const info = new NLocalWin32RootFileInfo({} as any);
  expect(info.isFile()).toBe(false);
});

test('Is must be directory', () => {
  const info = new NLocalWin32RootFileInfo({} as any);
  expect(info.isDirectory()).toBe(true);
});

test('Is must not be symbolic link', () => {
  const info = new NLocalWin32RootFileInfo({} as any);
  expect(info.isSymbolicLink()).toBe(false);
});

vi.mock('node:fs/promises', async (importActual) => {
  const m = await importActual() as typeof import('node:fs/promises');
  return {
    ...m,
    access: vi.fn(m.access),
    __access: m.access,
  };
});

describe('Test isReadable & isWritable', () => {
  type F = typeof import('fs/promises').access;
  const { access } = $fs as unknown as { access: Mock<Parameters<F>, ReturnType<F>>, __access: F };

  test('It must be readable', async () => {
    const info = new NLocalWin32RootFileInfo({} as any);
    await expect(info.isReadable()).resolves.toBe(true);
    expect(access).not.toHaveBeenCalled();
  });
  test('It must not be writable', async () => {
    const info = new NLocalWin32RootFileInfo({} as any);
    await expect(info.isWritable()).resolves.toBe(false);
    expect(access).not.toHaveBeenCalled();
  });
});
