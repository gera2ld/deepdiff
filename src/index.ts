const OP_REPLACE = 'replace';
const OP_DELETE = 'delete';
const OP_INSERT = 'insert';

interface DiffItem {
  op: string;
  path: string;
  oldVal?: any;
  newVal?: any;
}

type DataType = 'array' | 'null' | 'object' | 'string' | 'undefined' | 'number' | 'boolean' | 'function' | 'symbol' ;

function getType(obj: any): DataType {
  if (Array.isArray(obj)) return 'array';
  if (obj === null) return 'null';
  let type = typeof obj;
  if (type === 'bigint') type = 'number';
  return type;
}

const hashCache = new Map();

function hashObject(obj: any): string {
  let value = hashCache.get(obj);
  if (!value) {
    value = JSON.stringify(obj);
    hashCache.set(obj, value);
  }
  return value;
}

function intersection<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  const result = new Set<T>();
  for (const item of set1) {
    if (set2.has(item)) result.add(item);
  }
  return result;
}

function difference<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  const result = new Set<T>();
  for (const item of set1) {
    if (!set2.has(item)) result.add(item);
  }
  return result;
}

function diffObject(obj1: object, obj2: object, path: string): DiffItem[] {
  const keys1 = new Set(Object.keys(obj1));
  const keys2 = new Set(Object.keys(obj2));
  const only1 = difference(keys1, keys2);
  const only2 = difference(keys2, keys1);
  const common = intersection(keys1, keys2);
  const result: DiffItem[] = [];
  for (const key of only1) {
    result.push({
      op: OP_DELETE,
      path: `${path}/${key}`,
      oldVal: obj1[key],
    });
  }
  for (const key of only2) {
    result.push({
      op: OP_INSERT,
      path: `${path}/${key}`,
      newVal: obj2[key],
    });
  }
  for (const key of common) {
    result.push(...deepdiff(obj1[key], obj2[key], `${path}/${key}`));
  }
  return result;
}

function getMaxArray<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.length < arr2.length ? arr2 : arr1;
}

export function findCommonItems<T>(arr1: T[], arr2: T[]): [number, number][] {
  let precache: [number, number][][] = [];
  let cache: [number, number][][] = [];
  for (let i = 0; i < arr1.length; i += 1) {
    for (let j = 0; j < arr2.length; j += 1) {
      let best: [number, number][] = [];
      if (arr1[i] === arr2[j]) {
        best = getMaxArray(best, [...precache[j - 1] || [], [i, j]]);
      } else {
        best = getMaxArray(best, cache[j - 1] || []);
        best = getMaxArray(best, precache[j] || []);
      }
      cache[j] = best;
    }
    precache = cache;
    cache = [];
  }
  return precache[arr2.length - 1];
}

function diffArray(obj1: any[], obj2: any[], path: string): DiffItem[] {
  const hash1 = obj1.map(hashObject);
  const hash2 = obj2.map(hashObject);
  const common = findCommonItems(hash1, hash2);
  common.push([obj1.length, obj2.length]);
  const result: DiffItem[] = [];
  let i1 = 0;
  let j1 = 0;
  for (const [i2, j2] of common) {
    while (i1 < i2 && j1 < j2) {
      result.push(...deepdiff(obj1[i1], obj2[j1], `${path}/${i1}`));
      i1 += 1;
      j1 += 1;
    }
    while (i1 < i2) {
      result.push({
        op: OP_DELETE,
        path: `${path}/${i1}`,
        oldVal: obj1[i1],
      });
      i1 += 1;
    }
    while (j1 < j2) {
      result.push({
        op: OP_INSERT,
        path: `${path}/${i1}`,
        newVal: obj2[j1],
      });
      j1 += 1;
    }
    i1 += 1;
    j1 += 1;
  }
  return result;
}

export function deepdiff(obj1: any, obj2: any, path = ''): DiffItem[] {
  const type1 = getType(obj1);
  const type2 = getType(obj2);
  const result: DiffItem[] = [];
  if (type1 === type2 && type1 === 'object') {
    result.push(...diffObject(obj1, obj2, path));
  } else if (type1 === type2 && type1 === 'array') {
    result.push(...diffArray(obj1, obj2, path));
  } else if (obj1 !== obj2) {
    result.push({
      op: OP_REPLACE,
      path,
      oldVal: obj1,
      newVal: obj2,
    });
  }
  return result;
}
