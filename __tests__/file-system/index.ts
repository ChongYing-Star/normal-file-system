import { fs } from '~/file-system/index.js';
import { normalize, resolve } from '~path/index.js';
import { homedir } from 'node:os';
import { cwd } from 'node:process';

test('Get home path', async () => {
  expect(fs.home).toBe(normalize(homedir()));
});

test('Get home path', async () => {
  const dir = fs.getHomeDir();
  expect(dir.path).toBe(fs.home);
  expect(dir.fs).toBe(fs);
});

test('Get current path', async () => {
  expect(fs.current).toBe(normalize(cwd()));
});

test('Get current path', async () => {
  const dir = fs.getCurrentDir();
  expect(dir.path).toBe(fs.current);
  expect(dir.fs).toBe(fs);
});

test('Cd success', () => {
  const current = fs.current;
  fs.cd('src');
  expect(fs.current).toBe(resolve(current, 'src'));
});
