import { test, expect, describe } from 'vitest';
import { NFileSystemError, NFileNonExistentError, NNotDirectoryError } from '~/types/errors.js';

test('NFileSystemError<Error>', () => {
  const cause = new Error('message');
  const error = new NFileSystemError('Fs message', cause);
  expect(error.cause).toBe(cause);
  expect(error.source).toBe(cause);
  expect(error.message).toBe('Fs message');
  expect(error.name).toBe('NFileSystemError<Error>');
});

test.each([
  { value: new NFileSystemError('fs error', new Error()), name: 'NFileSystemError<Error>' },
  { value: {}, name: 'Object' },
  { value: (new class {}), name: 'Object' },
  { value: (new class Test {}), name: 'Test' },
  { value: 'string', name: typeof 'string' },
  { value: true, name: typeof true },
  { value: undefined, name: typeof undefined },
])('NFileSystemError<$name>', ({ value, name }) => {
  expect((new NFileSystemError('msg', value)).name).toBe(`NFileSystemError<${name}>`);
});

describe.each([
  { type: NFileNonExistentError, name: 'NFileNonExistentError', msg: (path: string) => `The target "${path}" does not exist` },
  { type: NNotDirectoryError, name: 'NNotDirectoryError', msg: (path: string) => `The target "${path}" not a directory` },
])('', ({ type, name, msg }) => {
  test(`${name}<Error>`, () => {
    const cause = new Error('message');
    const error = new type('/path', cause);
    expect(error.cause).toBe(cause);
    expect(error.source).toBe(cause);
    expect(error.message).toBe(msg('/path'));
    expect(error.name).toBe(`${name}<Error>`);
  });

  test(`${name}<NFileSystemError<undefined>>`, () => {
    const cause = new NFileSystemError('message');
    const error = new type(`${name} message`, cause);
    expect(error.name).toBe(`${name}<NFileSystemError<undefined>>`);
  });
});
