import { normalize, childName, basename, join, cd, fromLocalization, localization } from '~/path/utils.js';
import { normalize as $normalize } from 'node:path/posix';
import { jest } from '@jest/globals';

const originalPlatform = process.platform;

const platform = jest.fn();
platform.mockReturnValue(originalPlatform);
Object.defineProperty(process, 'platform', { get: platform });
afterEach(() => platform.mockReturnValue(originalPlatform));

test('Exports', async () => {
  const source = await import('node:path/posix');
  const target = await import('~/path/utils.js');
  expect(target.dirname).toBe(source.dirname);
  expect(target.extname).toBe(source.extname);
  expect(target.isAbsolute).toBe(source.isAbsolute);
  expect(target.relative).toBe(source.relative);
});

test('Multiple slashes', () => {
  expect(normalize('')).toBe($normalize(''));
  expect(normalize('//')).toBe('/');
  expect(normalize('\\')).toBe('/');
  expect(normalize('\\\\')).toBe('/');
  expect(normalize('\\\\//\\')).toBe('/');
  expect(normalize('content')).toBe('content');
  expect(normalize('content//')).toBe('content');
  expect(normalize('//content')).toBe('/content');
  expect(normalize('//content//')).toBe('/content');
  expect(normalize('/////content////')).toBe('/content');
});

test('Multiple slashes and spaces', () => {
  expect(normalize('/ /content')).toBe('/content');
  expect(normalize('content/ /')).toBe('content');
  expect(normalize('/content/ /')).toBe('/content');
  expect(normalize('/content with space/ /')).toBe('/content with space');
  expect(normalize('/with tab/   /')).toBe('/with tab');
  expect(normalize('with tab/   /')).toBe('with tab');
  expect(normalize('two/ /  /spaces')).toBe('two/spaces');
  expect(normalize('/three/ / / /spaces/')).toBe('/three/spaces');
  expect(normalize('three / / / /spaces/')).toBe('three/spaces');
  expect(normalize('/ more / / / / and more //spaces ')).toBe('/more/and more/spaces');
});

test('Path basename', () => {
  expect(basename('/parent/ child')).toBe('child');
  expect(basename('/parent /child')).toBe('child');
  expect(basename('parent////child / grandchild')).toBe('grandchild');
  expect(basename('/parent')).toBe('parent');
  expect(basename('/')).toBe('');
  expect(basename('c:/dir/test.txt')).toBe('test.txt');
  expect(basename('c:\\dir\\test.txt')).toBe('test.txt');
  expect(basename('c:/test.txt')).toBe('test.txt');
});

test('Path child name', () => {
  expect(childName('/parent', '/parent/child')).toBe('child');
  expect(childName('/parent', '/parent/child/grandchild')).toBe('child');
  expect(childName('/parent', 'parent/child/grandchild')).toBe('');
  expect(childName('parent', 'parent/child/grandchild')).toBe('child');
  expect(childName('parent/child', 'parent/child/grandchild')).toBe('grandchild');
  expect(childName('/', '/child/grandchild')).toBe('child');
  expect(childName('/', '/')).toBe('');
  expect(childName('/parent', '/parent')).toBe('');
  expect(childName('/parent/child', '/parent/child/')).toBe('');
  expect(childName('/parent/child', '/parent/')).toBe('');
  expect(childName('c:/parent', 'c:/parent/child')).toBe('child');
  expect(childName('c:/parent', 'C:/parent/child')).toBe('');
  expect(childName('C:/parent', 'c:/parent/child')).toBe('');
  expect(childName('c:/parent', '/c:/parent/child')).toBe('');
  expect(childName('/d:/parent', 'd:/parent/child/grandchild')).toBe('');
});

test('Path join', () => {
  expect(join('/a', '/b')).toBe('/a/b');
  expect(join('/a', 'b')).toBe('/a/b');
  expect(join('a', 'b/')).toBe('a/b');
  expect(join('a', 'b')).toBe('a/b');
  expect(join('a', '/b')).toBe('a/b');
  expect(join('a/', '/b')).toBe('a/b');
  expect(join('/a/', '/b')).toBe('/a/b');
  expect(join('/a/', '/b/')).toBe('/a/b');
});

test('Path cd', () => {
  expect(cd('/a', 'b')).toBe('/a/b');
  expect(cd('/a/c', 'b')).toBe('/a/c/b');
  expect(cd('/a', '/b')).toBe('/b');
  expect(cd('a', '/b')).toBe('/b');
  expect(cd('a', 'b')).toBe('a/b');
  expect(cd('a/c', 'b')).toBe('a/c/b');
  expect(cd('c:/', 'b')).toBe('c:/b');
  expect(cd('c:/', 'd:/')).toBe('c:/d:');
  expect(cd('c:/', '/d:/')).toBe('/d:');
});

describe.each(['linux', 'win32'])('In %s platform', (p) => {
  beforeEach(() => platform.mockReturnValue(p));

  test.each([
    { source: 'C:', linux: 'C:', win32: '/C:' },
    { source: 'C:/', linux: 'C:', win32: '/C:' },
    { source: '/C:', linux: '/C:', win32: '/C:' },
    { source: '/C:/', linux: '/C:', win32: '/C:' },
    { source: 'C:/content', linux: 'C:/content', win32: '/C:/content' },
    { source: 'd:/content', linux: 'd:/content', win32: '/D:/content' },
    { source: 'e:/Content', linux: 'e:/Content', win32: '/E:/Content' },
    { source: '/e:/Content', linux: '/e:/Content', win32: '/E:/Content' },
  ])('From localization "$source"', ({ source, ...values }) => {
    expect(fromLocalization(source)).toBe(values[p as 'linux'|'win32']);
  });

  test('Localization', () => {
    expect(localization('d:')).toBe(process.platform === 'win32' ? 'd:' : 'd:');
    expect(localization('d:/')).toBe(process.platform === 'win32' ? 'd:' : 'd:');
    expect(localization('/d:')).toBe(process.platform === 'win32' ? 'd:' : '/d:');
    expect(localization('/d:/')).toBe(process.platform === 'win32' ? 'd:' : '/d:');
    expect(localization('d:/content')).toBe(process.platform === 'win32' ? 'd:/content' : 'd:/content');
    expect(localization('D:/content')).toBe(process.platform === 'win32' ? 'D:/content' : 'D:/content');
    expect(localization('/e:/content')).toBe(process.platform === 'win32' ? 'e:/content' : '/e:/content');
  });
});
