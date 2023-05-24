import { test, expect, describe, beforeAll, vi, Mock } from 'vitest';
import { NLocalFileSystem } from '~/file-system/NLocalFileSystem.js';
import * as $fs from 'node:fs/promises';
import { NLocalWin32RootFileInfo } from '~/file-info/NLocalFileInfo.js';
import { NFileNonExistentError } from '~/types/errors.js';
import { platform as $platform } from 'node:process';

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

beforeAll(() => {
  const platform = vi.spyOn(process, 'platform', 'get');
  platform.mockReturnValue('win32');
  return () => {
    platform.mockReturnValue($platform);
  };
});

describe('Test NLocalFileSystem::info', () => {
  type F = typeof import('fs/promises').lstat;
  const { lstat } = $fs as unknown as { lstat: Mock<Parameters<F>, ReturnType<F>>, __lstat: F };

  test('Get "/" info', async () => {
    await expect(fs.info('/')).resolves.toBeInstanceOf(NLocalWin32RootFileInfo);
    expect(lstat).not.toHaveBeenCalled();
  });
  test('Get "/illegal" info', async () => {
    await expect(fs.info('/illegal')).rejects.toBeInstanceOf(NFileNonExistentError);
    expect(lstat).not.toHaveBeenCalled();
  });
});

describe('Test NLocalFileSystem::exists', () => {
  type F = typeof import('fs/promises').access;
  const { access } = $fs as unknown as { access: Mock<Parameters<F>, ReturnType<F>>, __access: F };

  test('Get "/" existence', async () => {
    await expect(fs.exists('/')).resolves.toBe(true);
    expect(access).not.toHaveBeenCalled();
  });
  test('Get "/illegal" existence', async () => {
    await expect(fs.exists('/illegal')).resolves.toBe(false);
    expect(access).not.toHaveBeenCalled();
  });
});
