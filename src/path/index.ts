import { normalize as $normalize, basename as $basename, resolve } from 'path/posix';

export function normalize (path: string) {
  const pre = path.replace(/\\/g, '/').replace(/(\/\s+\/)|(\s*\/+\s*)/g, '/');
  const value = $normalize(pre).replace(/\/\s+\//g, '/').trim();
  if (value === '/') return value;
  else return value.replace(/(\s|\/)+$/g, '');
}

export function basename (path: string) {
  return $basename(normalize(path));
}

export function childName (parent: string, input_path: string) {
  const parentPath = resolve(normalize(parent));
  const path = resolve(normalize(input_path));
  if (!path.startsWith(parentPath)) {
    return '';
  }
  return path.replace(RegExp(`^${parentPath}\\/?`), '').replace(/\/.+$/, '');
}

export function join (parent: string, child: string) {
  return normalize(parent + '/' + child);
}
