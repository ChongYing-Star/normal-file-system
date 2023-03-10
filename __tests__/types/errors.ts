import { NFileSystemError, NFileNonExistentError } from '~/types/errors.js';

test('FileSystemError<Error>', () => {
  const cause = new Error('message');
  const error = new NFileSystemError('Fs message', cause);
  expect(error.cause).toBe(cause);
  expect(error.source).toBe(cause);
  expect(error.message).toBe('Fs message');
  expect(error.name).toBe('NFileSystemError<Error>');
});

const types = [
  { value: new NFileSystemError('fs error', new Error()), name: 'NFileSystemError<Error>' },
  { value: {}, name: 'Object' },
  { value: (new class {}), name: 'Object' },
  { value: (new class Test {}), name: 'Test' },
  { value: 'string', name: typeof 'string' },
  { value: true, name: typeof true },
  { value: undefined, name: typeof undefined },
];

test.each(types)('FileSystemError<$name>', ({ value, name }) => {
  expect((new NFileSystemError('msg', value)).name).toBe(`NFileSystemError<${name}>`);
});

test('FileNonExistentError<Error>', () => {
  const cause = new Error('message');
  const error = new NFileNonExistentError('/aaa', cause);
  expect(error.cause).toBe(cause);
  expect(error.source).toBe(cause);
  expect(error.message).toBe('The file "/aaa" does not exist');
  expect(error.name).toBe('NFileNonExistentError<Error>');
});

test('FileNonExistentError<FileSystemError<undefined>>', () => {
  const cause = new NFileSystemError('message');
  const error = new NFileNonExistentError('FileNonExistentError message', cause);
  expect(error.name).toBe('NFileNonExistentError<NFileSystemError<undefined>>');
});
