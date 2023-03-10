import type { NodeSyscallError } from '~/types/node.js';

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

export class FileSystemError<T> extends Error {
  get [ClassNameKey] () { return 'FileSystemError'; }

  constructor (message: string, cause?: T) {
    super(message, { cause });
    this.name = `${this[ClassNameKey]}<${_getTypeName(cause)}>`;
  }
  get source () {
    return this.cause as T|undefined;
  }
}

export class FileNonExistentError<T = NodeSyscallError> extends FileSystemError<T> {
  get [ClassNameKey] () { return 'FileNonExistentError'; }
  constructor (public readonly path: string, cause?: T) {
    super(`The file "${path}" does not exist`, cause);
  }
}
