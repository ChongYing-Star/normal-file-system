import { NLocalFileSystem } from '~/file-system/NLocalFileSystem.js';
import { fromLocalization } from '~/path/utils.js';
import { homedir } from 'node:os';
import { NFileNonExistentError, NFileSystemError, NNotDirectoryError } from '~/types/errors.js';
import { jest } from '@jest/globals';
import { chdir as $chdir, cwd as $cwd } from 'node:process';
import { resolve as $resolve } from 'node:path';

const originalChdir = process.chdir;

const chdir = jest.fn(originalChdir);
process.chdir = chdir;
afterEach(() => chdir.mockImplementation(originalChdir));

const fs = NLocalFileSystem.instance;

test('Get home path', async () => {
  expect(fs.home).toBe(fromLocalization(homedir()));
});

test('Get home path', async () => {
  const dir = fs.getHomeDir();
  expect(dir.path).toBe(fs.home);
  expect(dir.fs).toBe(fs);
});

test('Get current path', async () => {
  expect(fs.current).toBe(fromLocalization($cwd()));
});

test('Get current path', async () => {
  const dir = fs.getCurrentDir();
  expect(dir.path).toBe(fs.current);
  expect(dir.fs).toBe(fs);
});

test('Cd success', () => {
  const current = $cwd();
  try {
    fs.cd('src');
    expect($cwd()).toBe($resolve(current, 'src'));
  } finally {
    $chdir(current);
  }
});

test('Cd non existent dir', () => {
  const current = $cwd();
  try {
    expect(() => fs.cd('_____')).toThrow(NFileNonExistentError);
    expect($cwd()).toBe(current);
  } finally {
    $chdir(current);
  }
});

test('Cd file', () => {
  const current = $cwd();
  try {
    expect(() => fs.cd('package.json')).toThrow(NNotDirectoryError);
    expect($cwd()).toBe(current);
  } finally {
    $chdir(current);
  }
});

test('Cd throw unknown Error', () => {
  chdir.mockImplementation(() => { throw new Error; });
  const current = $cwd();
  try {
    expect(() => fs.cd('-----')).toThrow(NFileSystemError);
    expect($cwd()).toBe(current);
  } finally {
    $chdir(current);
  }
});

test('Cd throw unknown error type', () => {
  chdir.mockImplementation(() => { throw ''; });
  const current = $cwd();
  try {
    expect(() => fs.cd('-----')).toThrow(NFileSystemError);
    expect($cwd()).toBe(current);
  } finally {
    $chdir(current);
  }
});

test('Make absolute', () => {
  expect(fs.makeAbsolute('src')).toBe(fs.current + '/src');
  expect(fs.makeAbsolute('/src')).toBe('/src');
});

test('Relative', () => {
  expect(fs.relative(fs.current + '/src')).toBe('src');
  expect(fs.relative(fs.current)).toBe('');
  expect(fs.relative(fs.makeAbsolute('..'))).toBe('..');
  expect(fs.relative(fs.makeAbsolute('../../test'))).toBe('../../test');
  expect(fs.relative('src')).toBe('src');
});

describe('In win32', () => {
  const originalPlatform = process.platform;
  const platform = jest.fn();
  platform.mockReturnValue(originalPlatform);
  Object.defineProperty(process, 'platform', { get: platform });
  beforeAll(() => platform.mockReturnValue('win32'));
  afterAll(() => platform.mockReturnValue(originalPlatform));

  test('Cd to "/"', () => {
    const current = $cwd();
    try {
      fs.cd('/');
      expect(fs.current).toBe('/');
    } finally {
      $chdir(current);
    }
  });

  test('Cd to "/illegal"', () => {
    const current = $cwd();
    try {
      expect(() => fs.cd('/illegal')).toThrow(NFileNonExistentError);
      expect($cwd()).toBe(current);
    } finally {
      $chdir(current);
    }
  });
});
