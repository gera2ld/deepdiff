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

function makeToJSON(target: any): any {
  const value = JSON.stringify(target);
  Object.defineProperty(target, 'toJSON', { value: () => value, enumerable: false });
  return target;
}

export function prestringify(obj: any): any {
  if (Array.isArray(obj)) {
    const target = obj.map(prestringify);
    return makeToJSON(target);
  }
  if (obj && typeof obj === 'object') {
    const target = {};
    Object.keys(obj).sort().forEach(key => {
      target[key] = prestringify(obj[key]);
    });
    return makeToJSON(target);
  }
  return obj;
}

export function hashObject(obj: any): string {
  return JSON.stringify(obj);
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
