import { normalize as $normalize, basename as $basename, resolve } from 'node:path/posix';
export { resolve, dirname, extname } from 'node:path';

export function normalize (path: string) {
  const pre = path.replace(/\\/g, '/').replace(/(\/\s+\/)|(\s*\/+\s*)/g, '/');
  const value = $normalize(pre).replace(/\/\s+\//g, '/').trim();
  if (value === '/') {
    return value;
  }
  else {
    const path = value.replace(/(\s|\/)+$/g, '');
    if (process.platform === 'win32') {
      const reg = /^\w:\//;
      const march = reg.exec(path);
      if (march?.[0]) {
        return path.replace(reg, '/' + march[0].toUpperCase());
      }
    }
    return path;
  }
}

export function localization (path: string) {
  const path_ = normalize(path);
  if (process.platform === 'win32') {
    const reg = /^\/(\w:\/)/;
    const march = reg.exec(path_);
    if (march?.[0]) {
      return path_.replace(reg, march[0]);
    }
  }
  return path_;
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
