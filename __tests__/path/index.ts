import { normalize, localization, childName, basename, join } from '~path/index.js';
import { normalize as $normalize } from 'node:path/posix';
import { jest } from '@jest/globals';

const originalPlatform = process.platform;

const platform = jest.fn();
platform.mockReturnValue(originalPlatform);
Object.defineProperty(process, 'platform', { get: platform });
afterEach(platform.mockReturnValue(originalPlatform));

test('Exports', async () => {
  const source = await import('node:path/posix');
  const target = await import('~path/index.js');
  expect(target.resolve).toBe(source.resolve);
  expect(target.dirname).toBe(source.dirname);
  expect(target.extname).toBe(source.extname);
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

describe.each(['linux', 'win32'])('In %s', (p) => {
  beforeEach(() => { platform.mockReturnValue(p); });

  test.each([
    { source: 'C:/content', linux: 'C:/content', win32: '/C:/content' },
    { source: 'C:/ /content', linux: 'C:/content', win32: '/C:/content' },
    { source: 'C:\\content', linux: 'C:/content', win32: '/C:/content' },
    { source: 'd:/content', linux: 'd:/content', win32: '/D:/content' },
    { source: 'e:/Content', linux: 'e:/Content', win32: '/E:/Content' },
    { source: '/e:/Content', linux: '/e:/Content', win32: '/E:/Content' },
  ])('Drive letter to uppercase "$source"', ({ source, ...values }) => {
    expect(normalize(source)).toBe(values[p as 'linux'|'win32']);
  });

  test('Localization', () => {
    expect(localization('d:/content')).toBe(process.platform === 'win32' ? 'd:/content' : 'd:/content');
    expect(localization('D:/content')).toBe(process.platform === 'win32' ? 'D:/content' : 'D:/content');
    expect(localization('/e:/content')).toBe(process.platform === 'win32' ? 'e:/content' : '/e:/content');
  });

  test('Path child name', () => {
    if (process.platform === 'win32') {
      expect(childName('c:/parent', '/C:/parent/child')).toBe('child');
      expect(childName('/d:/parent', 'D:/parent/child/grandchild')).toBe('child');
    } else {
      expect(childName('c:/parent', '/C:/parent/child')).toBe('');
      expect(childName('/d:/parent', 'D:/parent/child/grandchild')).toBe('');
    }
  });
});
