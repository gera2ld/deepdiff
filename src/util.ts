export enum DiffOperation {
  REPLACE = 'replace',
  DELETE = 'delete',
  INSERT = 'insert',
}

export type DiffItem = {
  op: DiffOperation;
  path: string;
  oldVal?: any;
  newVal?: any;
};

export type DataType = 'array' | 'null' | 'object' | 'string' | 'undefined' | 'number' | 'boolean' | 'function' | 'symbol';

export type DiffOptions = {
  hashObject: (obj: any) => string;
};

export function getType(obj: any): DataType {
  if (Array.isArray(obj)) return 'array';
  if (obj === null) return 'null';
  let type = typeof obj;
  if (type === 'bigint') type = 'number';
  return type;
}

const HASH_KEY = Symbol('deepdiff:hash');

export function stringify(obj: any): string {
  return obj?.[HASH_KEY] || JSON.stringify(obj);
}

function makeStringified(target: any, value: string): any {
  target[HASH_KEY] = value;
  return target;
}

export function prestringify(obj: any): any {
  if (Array.isArray(obj)) {
    const target = obj.map(prestringify);
    const tokens = ['['];
    for (let i = 0; i < target.length; i += 1) {
      if (i) tokens.push(',');
      tokens.push(stringify(target[i]));
    }
    tokens.push(']');
    const value = tokens.join('');
    return makeStringified(target, value);
  }
  if (obj && typeof obj === 'object') {
    const target = {};
    const keys = Object.keys(obj).sort();
    const tokens = ['{'];
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      target[key] = prestringify(obj[key]);
      if (i) tokens.push(',');
      tokens.push(JSON.stringify(key), ':', stringify(target[key]));
    }
    tokens.push('}');
    const value = tokens.join('');
    return makeStringified(target, value);
  }
  return obj;
}

export function hashObject(obj: any): string {
  return stringify(obj);
}

export function intersection<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  const result = new Set<T>();
  for (const item of set1) {
    if (set2.has(item)) result.add(item);
  }
  return result;
}

export function difference<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  const result = new Set<T>();
  for (const item of set1) {
    if (!set2.has(item)) result.add(item);
  }
  return result;
}
