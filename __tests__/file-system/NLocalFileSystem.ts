import { NLocalFileSystem } from '~/file-system/NLocalFileSystem.js';
import { fromLocalization, cd } from '~/path/utils.js';
import { homedir } from 'node:os';
import { cwd } from 'node:process';

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
  expect(fs.current).toBe(fromLocalization(cwd()));
});

test('Get current path', async () => {
  const dir = fs.getCurrentDir();
  expect(dir.path).toBe(fs.current);
  expect(dir.fs).toBe(fs);
});

test('Cd success', () => {
  const current = fs.current;
  fs.cd('src');
  expect(fs.current).toBe(cd(current, 'src'));
});