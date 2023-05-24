import { test, expect, describe, vi, Mock } from 'vitest';
import { NFileInfo, NLocalFileInfo } from '~/file-info/index.js';
import { BigIntStats } from 'fs';
import * as $fs from 'node:fs/promises';
import { localization } from '~path/utils.js';

test('Instance of NFileInfo', () => {
  const info = new NLocalFileInfo({} as any, '_____', {} as any);
  expect(info).toBeInstanceOf(NFileInfo);
});

test('Get stats', () => {
  const stats = { birthtime: new Date } as BigIntStats;
  const info = new NLocalFileInfo({} as any, '_____', stats);
  expect(info.stats).toBe(stats);
});

test('Get birthtime', () => {
  const stats = { birthtime: new Date } as BigIntStats;
  const info = new NLocalFileInfo({} as any, '_____', stats);
  expect(info.birthTime).toBe(stats.birthtime);
});

test('Is file', () => {
  const stats = { isFile: () => true } as BigIntStats;
  const isFile = vi.spyOn(stats, 'isFile');
  const info = new NLocalFileInfo({} as any, '_____', stats);
  expect(info.isFile()).toBe(true);
  expect(isFile).toHaveBeenCalledOnce();
});

test('Is directory', () => {
  const stats = { isDirectory: () => true } as BigIntStats;
  const isDirectory = vi.spyOn(stats, 'isDirectory');
  const info = new NLocalFileInfo({} as any, '_____', stats);
  expect(info.isDirectory()).toBe(true);
  expect(isDirectory).toHaveBeenCalledOnce();
});

test('Is symbolic link', () => {
  const stats = { isSymbolicLink: () => true } as BigIntStats;
  const isSymbolicLink = vi.spyOn(stats, 'isSymbolicLink');
  const info = new NLocalFileInfo({} as any, '_____', stats);
  expect(info.isSymbolicLink()).toBe(true);
  expect(isSymbolicLink).toHaveBeenCalledOnce();
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

  test('When file is readable', async () => {
    access.mockResolvedValue(undefined);
    const info = new NLocalFileInfo({} as any, '_____', {} as any);
    await expect(info.isReadable()).resolves.toBe(true);
    expect(access).toHaveBeenCalledOnce();
    expect(access).toHaveBeenCalledWith(localization('_____'), $fs.constants.R_OK | $fs.constants.X_OK);
  });
  test('When file is not readable', async () => {
    access.mockRejectedValue(undefined);
    const info = new NLocalFileInfo({} as any, '_____', {} as any);
    await expect(info.isReadable()).resolves.toBe(false);
    expect(access).toHaveBeenCalledOnce();
    expect(access).toHaveBeenCalledWith(localization('_____'), $fs.constants.R_OK | $fs.constants.X_OK);
  });

  test('When file is writable', async () => {
    access.mockResolvedValue(undefined);
    const info = new NLocalFileInfo({} as any, '_____', {} as any);
    await expect(info.isWritable()).resolves.toBe(true);
    expect(access).toHaveBeenCalledOnce();
    expect(access).toHaveBeenCalledWith(localization('_____'), $fs.constants.W_OK);
  });
  test('When file is not writable', async () => {
    access.mockRejectedValue(undefined);
    const info = new NLocalFileInfo({} as any, '_____', {} as any);
    await expect(info.isWritable()).resolves.toBe(false);
    expect(access).toHaveBeenCalledOnce();
    expect(access).toHaveBeenCalledWith(localization('_____'), $fs.constants.W_OK);
  });
});
