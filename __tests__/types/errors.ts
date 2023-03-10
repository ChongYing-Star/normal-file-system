import { FileSystemError, FileNonExistentError } from '~/types/errors.js';

test('FileSystemError<Error>', () => {
  const cause = new Error('message');
  const error = new FileSystemError('Fs message', cause);
  expect(error.cause).toBe(cause);
  expect(error.source).toBe(cause);
  expect(error.message).toBe('Fs message');
  expect(error.name).toBe('FileSystemError<Error>');
});

const types = [
  { value: new FileSystemError('fs error', new Error()), name: 'FileSystemError<Error>' },
  { value: {}, name: 'Object' },
  { value: (new class {}), name: 'Object' },
  { value: (new class Test {}), name: 'Test' },
  { value: 'string', name: typeof 'string' },
  { value: true, name: typeof true },
  { value: undefined, name: typeof undefined },
];

test.each(types)('FileSystemError<$name>', ({ value, name }) => {
  expect((new FileSystemError('msg', value)).name).toBe(`FileSystemError<${name}>`);
});

test('FileNonExistentError<Error>', () => {
  const cause = new Error('message');
  const error = new FileNonExistentError('/aaa', cause);
  expect(error.cause).toBe(cause);
  expect(error.source).toBe(cause);
  expect(error.message).toBe('The file "/aaa" does not exist');
  expect(error.name).toBe('FileNonExistentError<Error>');
});

test('FileNonExistentError<FileSystemError<undefined>>', () => {
  const cause = new FileSystemError('message');
  const error = new FileNonExistentError('FileNonExistentError message', cause);
  expect(error.name).toBe('FileNonExistentError<FileSystemError<undefined>>');
});
