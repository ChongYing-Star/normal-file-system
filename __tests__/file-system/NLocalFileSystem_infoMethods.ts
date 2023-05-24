import { test, expect, describe, vi, Mock } from 'vitest';
import { NLocalFileSystem } from '~/file-system/NLocalFileSystem.js';
import * as $fs from 'node:fs/promises';
import { Stats } from 'node:fs';
import { NLocalFileInfo } from '~/file-info/NLocalFileInfo.js';
import { NFileSystemError } from '~/types/errors.js';
import { localization } from '~path/index.js';

const fs = NLocalFileSystem.instance;

vi.mock('node:fs/promises', async (importActual) => {
  const m = await importActual() as typeof import('node:fs/promises');
  return {
    ...m,
    lstat: vi.fn(m.lstat),
    __lstat: m.lstat,
    access: vi.fn(m.access),
    __access: m.access,
  };
});

describe('Test NLocalFileSystem::info', () => {
  type F = typeof import('fs/promises').lstat;
  const { lstat } = $fs as unknown as { lstat: Mock<Parameters<F>, ReturnType<F>>, __lstat: F };

  test('Get file info', async () => {
    const stats = new Stats();
    lstat.mockResolvedValue(stats);
    const info = await fs.info('_____');
    expect(info).toBeInstanceOf(NLocalFileInfo);
    expect((info as NLocalFileInfo).stats).toBe(stats);
    expect(lstat).toHaveBeenCalledOnce();
    expect(lstat).toHaveBeenCalledWith(localization(fs.absolute('_____')), { bigint: true });
  });
  test('Get file info fail', async () => {
    lstat.mockRejectedValue(new Error);
    await expect(fs.info('_____')).rejects.toBeInstanceOf(NFileSystemError);
    expect(lstat).toHaveBeenCalledOnce();
    expect(lstat).toHaveBeenCalledWith(localization(fs.absolute('_____')), { bigint: true });
  });
});

describe('Test NLocalFileSystem::exists', () => {
  type F = typeof import('fs/promises').access;
  const { access } = $fs as unknown as { access: Mock<Parameters<F>, ReturnType<F>>, __access: F };

  test('Get file existence, file is existent', async () => {
    access.mockResolvedValue(undefined);
    await expect(fs.exists('_____')).resolves.toBe(true);
    expect(access).toHaveBeenCalledOnce();
    expect(access).toHaveBeenCalledWith(localization(fs.absolute('_____')), $fs.constants.F_OK);
  });
  test('Get file existence, file is not existent', async () => {
    access.mockRejectedValue(undefined);
    await expect(fs.exists('_____')).resolves.toBe(false);
    expect(access).toHaveBeenCalledOnce();
    expect(access).toHaveBeenCalledWith(localization(fs.absolute('_____')), $fs.constants.F_OK);
  });
});
