import { test, expect, beforeEach, vi } from 'vitest';
import { NLocalFileSystem } from '~/file-system/NLocalFileSystem.js';
import { NFileSystemError } from '~/types/errors.js';

const fs = NLocalFileSystem.instance;

let chdir = vi.spyOn(process, 'chdir');
beforeEach(() => {
  chdir = vi.spyOn(process, 'chdir');
  return () => chdir.mockRestore();
});

test('Get static instance', () => {
  expect(fs).toBeInstanceOf(NLocalFileSystem);
});

test('Catch unknown error', () => {
  expect.assertions(4);
  const error = new Error('unknown error');
  (error as any).code = '__unknown__';
  chdir.mockImplementation(() => { throw error; });
  expect(() => fs.cd('-----')).toThrow(NFileSystemError);
  try {
    fs.cd('-----');
  } catch (e) {
    expect((e as NFileSystemError<Error>).message).toBe('unknown error');
    expect((e as NFileSystemError<Error>).cause).toBe(error);
  }
  expect(chdir).toBeCalledTimes(2);
});

test('Catch unknown throw', () => {
  expect.assertions(4);
  const error = { code: '__unknown__' };
  chdir.mockImplementation(() => { throw error; });
  expect(() => fs.cd('-----')).toThrow(NFileSystemError);
  try {
    fs.cd('-----');
  } catch (e) {
    expect((e as NFileSystemError<Error>).message).toBe('Unknown error');
    expect((e as NFileSystemError<Error>).cause).toBe(error);
  }
  expect(chdir).toBeCalledTimes(2);
});
