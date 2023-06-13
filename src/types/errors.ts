import type { NodeSyscallError } from '~/types/node.js';
import type { ExecException } from 'node:child_process';

const ClassNameKey = Symbol('ClassNameKey');

function _getTypeName (value: any) {
  if (value instanceof Error) {
    return value.name;
  } else if (value instanceof Object && typeof value.constructor.name === 'string') {
    return value.constructor.name === '' ? 'Object' : value.constructor.name as string;
  } else {
    return typeof value;
  }
}

export class NFileSystemError<T> extends Error {
  get [ClassNameKey] () { return 'NFileSystemError'; }

  constructor (message: string, cause?: T) {
    super(message, { cause });
    this.name = `${this[ClassNameKey]}<${_getTypeName(cause)}>`;
  }
  get source () {
    return this.cause as T|undefined;
  }
}

export class NFileNonExistentError<T = NodeSyscallError> extends NFileSystemError<T> {
  get [ClassNameKey] () { return 'NFileNonExistentError'; }
  constructor (public readonly path: string, cause?: T) {
    super(`The target "${path}" does not exist`, cause);
  }
}

export class NNotDirectoryError<T = NodeSyscallError> extends NFileSystemError<T> {
  get [ClassNameKey] () { return 'NNotDirectoryError'; }
  constructor (public readonly path: string, cause?: T) {
    super(`The target "${path}" not a directory`, cause);
  }
}

export class ChildProcessError extends Error {
  constructor (message: string, cause: ExecException, readonly stderr: string) {
    super(message, { cause });
    this.name = 'ChildProcessError';
  }
}
