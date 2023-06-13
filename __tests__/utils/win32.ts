import { test, expect, describe, beforeEach, vi, Mock } from 'vitest';
import { getAllCaption } from '~/utils/win32.js';
import * as $childProcess from 'node:child_process';
import { ChildProcessError } from '~/types/errors.js';

const stdout = 'Caption  \r\r\nC:       \r\r\nD:       \r\r\nE:       \r\r\n\r\r\n';

vi.mock('node:child_process', async (importActual) => {
  const m = await importActual() as typeof import('node:child_process');
  return {
    ...m,
    exec: vi.fn(m.exec),
    __exec: m.exec,
  };
});

let platform = vi.spyOn(process, 'platform', 'get');
beforeEach(() => {
  platform = vi.spyOn(process, 'platform', 'get');
  return () => platform.mockRestore();
});

describe('In linux', () => {
  beforeEach(() => {
    platform.mockReturnValue('linux');
  });
  test('Get All Caption', async () => {
    await expect(getAllCaption()).resolves.toEqual([]);
  });
});

describe('In win32', () => {
  beforeEach(() => {
    platform.mockReturnValue('win32');
  });
  type F = typeof import('node:child_process').exec;
  const { exec } = $childProcess as unknown as { exec: Mock<Parameters<F>, ReturnType<F>>, __exec: F };
  test('Get all caption', async () => {
    const promise = getAllCaption();
    await new Promise((r) => setTimeout(r, 0));
    expect(exec).toHaveBeenCalledOnce();
    const callback = exec.mock.calls[0][2];
    // cSpell:disable-next-line
    expect(exec).toHaveBeenLastCalledWith('wmic logicaldisk get caption', { windowsHide: true }, callback);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    callback!(null, stdout, '');
    await expect(promise).resolves.toEqual(['C:', 'D:', 'E:']);
  });
  test('Get caption when error', async () => {
    const promise = getAllCaption();
    await new Promise((r) => setTimeout(r, 0));
    const callback = exec.mock.calls[0][2];
    const error = new Error as $childProcess.ExecException;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    callback!(error, stdout, 'stderr');
    await expect(promise).rejects.toEqual(new ChildProcessError('Fail to carry out command', error, 'stderr'));
  });
  test('Get caption fail', async () => {
    const promise = getAllCaption();
    await new Promise((r) => setTimeout(r, 0));
    const callback = exec.mock.calls[0][2];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    callback!(null, '', '');
    await expect(promise).resolves.toEqual([]);
  });
});
