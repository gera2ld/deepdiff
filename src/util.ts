export enum DiffOperation {
  REPLACE = 'replace',
  DELETE = 'delete',
  INSERT = 'insert',
}

export type IDiffItem = {
  op: DiffOperation;
  path: string;
  oldVal?: any;
  newVal?: any;
};

export type IDataType =
  | 'array'
  | 'null'
  | 'object'
  | 'string'
  | 'undefined'
  | 'number'
  | 'boolean'
  | 'function'
  | 'symbol';

export type IDiffOptions = {
  hashObject: (obj: any) => string;
  prestringify: boolean;
};

export function getType(obj: any): IDataType {
  if (Array.isArray(obj)) return 'array';
  if (obj === null) return 'null';
  let type = typeof obj;
  if (type === 'bigint') type = 'number';
  return type;
}

export const HASH_KEY = Symbol('deepdiff:hash');

export function stringify(obj: any): string {
  return obj?.[HASH_KEY] || JSON.stringify(obj);
}

function makeStringified(target: any, value: string): any {
  target[HASH_KEY] = value;
  return target;
}

export function prestringify(obj: any): void {
  if (Array.isArray(obj)) {
    const tokens = ['['];
    for (let i = 0; i < obj.length; i += 1) {
      if (i) tokens.push(',');
      const value = obj[i];
      prestringify(value);
      tokens.push(stringify(value));
    }
    tokens.push(']');
    const str = tokens.join('');
    makeStringified(obj, str);
  }
  if (obj && typeof obj === 'object') {
    const keys = Object.keys(obj).sort();
    const tokens = ['{'];
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const value = obj[key];
      prestringify(value);
      if (i) tokens.push(',');
      tokens.push(JSON.stringify(key), ':', stringify(value));
    }
    tokens.push('}');
    const str = tokens.join('');
    makeStringified(obj, str);
  }
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
