import { normalize as $normalize, basename as $basename, resolve, isAbsolute } from 'node:path/posix';
export { dirname, extname, isAbsolute } from 'node:path/posix';

export function normalize (path: string) {
  const pre = path.replace(/\\/g, '/').replace(/(\/\s+\/)|(\s*\/+\s*)/g, '/');
  const value = $normalize(pre).replace(/\/\s+\//g, '/').trim();
  if (value === '/') {
    return value;
  } else {
    const path = value.replace(/(\s|\/)+$/g, '');
    return path;
  }
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

export function cd (from: string, to: string) {
  if (isAbsolute(to)) {
    return normalize(to);
  } else {
    return join(from, to);
  }
}

export function fromLocalization (path: string) {
  const path_ = normalize(path);
  if (process.platform === 'win32') {
    const reg = /^\/?\w:\//;
    const march = reg.exec(path_);
    if (march?.[0]) {
      return path_.replace(reg, (march[0][0] === '/' ? '' : '/') + march[0].toUpperCase());
    }
  }
  return path_;
}

export function localization (path: string) {
  const path_ = normalize(path);
  if (process.platform === 'win32') {
    const reg = /^\/(\w:\/)/;
    const march = reg.exec(path_);
    if (march?.[0]) {
      return path_.replace(reg, march[1]);
    }
  }
  return path_;
}
