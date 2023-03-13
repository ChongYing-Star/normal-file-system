import { normalize, localization, childName, basename, join } from '~path/index.js';
import { normalize as $normalize } from 'node:path/posix';

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

test('Drive letter to uppercase', () => {
  expect(normalize('C:/content')).toBe(process.platform === 'win32' ? '/C:/content' : 'C:/content');
  expect(normalize('C:/ /content')).toBe(process.platform === 'win32' ? '/C:/content' : 'C:/content');
  expect(normalize('C:\\content')).toBe(process.platform === 'win32' ? '/C:/content' : 'C:/content');
  expect(normalize('d:/content')).toBe(process.platform === 'win32' ? '/D:/content' : 'd:/content');
  expect(normalize('e:/Content')).toBe(process.platform === 'win32' ? '/E:/Content' : 'e:/Content');
});

test('Localization', () => {
  expect(localization('d:/content')).toBe(process.platform === 'win32' ? 'd:/content' : 'd:/content');
  expect(localization('D:/content')).toBe(process.platform === 'win32' ? 'D:/content' : 'D:/content');
  expect(localization('/e:/content')).toBe(process.platform === 'win32' ? 'e:/content' : '/e:/content');
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
  if (process.platform === 'win32') {
    expect(childName('c:/parent', '/C:/parent/child')).toBe('child');
    expect(childName('/d:/parent', 'D:/parent/child/grandchild')).toBe('child');
  } else {
    expect(childName('c:/parent', '/C:/parent/child')).toBe('');
    expect(childName('/d:/parent', 'D:/parent/child/grandchild')).toBe('');
  }
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
