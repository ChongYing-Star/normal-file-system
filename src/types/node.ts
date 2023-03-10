export interface NodeSyscallError extends Error {
  errno: number,
  code: 'EBUSY'|'EMFILE'|'ENFILE'|'ENOTEMPTY'|'EPERM'|'ENOENT'|'ENOTDIR',
  syscall: string,
  path: string,
}

export interface NodeProcessChdirError extends NodeSyscallError {
  dest: string,
}
