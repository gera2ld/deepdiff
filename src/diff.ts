import {
  DiffOperation, DiffItem, DiffOptions,
  difference, intersection, getType, prestringify,
} from './util';

function diffObject(
  obj1: object,
  obj2: object,
  path: string,
  options: DiffOptions,
): DiffItem[] {
  const keys1 = new Set(Object.keys(obj1));
  const keys2 = new Set(Object.keys(obj2));
  const only1 = difference(keys1, keys2);
  const only2 = difference(keys2, keys1);
  const common = intersection(keys1, keys2);
  const result: DiffItem[] = [];
  for (const key of only1) {
    result.push({
      op: DiffOperation.DELETE,
      path: `${path}/${key}`,
      oldVal: obj1[key],
    });
  }
  for (const key of only2) {
    result.push({
      op: DiffOperation.INSERT,
      path: `${path}/${key}`,
      newVal: obj2[key],
    });
  }
  for (const key of common) {
    result.push(...diffAny(obj1[key], obj2[key], `${path}/${key}`, options));
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
  return precache[arr2.length - 1] || [];
}

function diffArray<T>(obj1: T[], obj2: T[], path: string, options: DiffOptions): DiffItem[] {
  if (typeof (obj1 as any).toJSON !== 'function') {
    obj1 = prestringify(obj1);
    obj2 = prestringify(obj2);
  }
  const hash1 = obj1.map(options.hashObject);
  const hash2 = obj2.map(options.hashObject);
  const common = findCommonItems(hash1, hash2);
  common.push([obj1.length, obj2.length]);
  const result: DiffItem[] = [];
  let i1 = 0;
  let j1 = 0;
  for (const [i2, j2] of common) {
    while (i1 < i2 && j1 < j2) {
      result.push(...diffAny(obj1[i1], obj2[j1], `${path}/${i1}`, options));
      i1 += 1;
      j1 += 1;
    }
    while (i1 < i2) {
      result.push({
        op: DiffOperation.DELETE,
        path: `${path}/${i1}`,
        oldVal: obj1[i1],
      });
      i1 += 1;
    }
    while (j1 < j2) {
      result.push({
        op: DiffOperation.INSERT,
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

export function diffAny(
  obj1: any,
  obj2: any,
  path: string,
  options: DiffOptions,
): DiffItem[] {
  const type1 = getType(obj1);
  const type2 = getType(obj2);
  const result: DiffItem[] = [];
  if (type1 === type2 && type1 === 'object') {
    result.push(...diffObject(obj1 as any, obj2 as any, path, options));
  } else if (type1 === type2 && type1 === 'array') {
    result.push(...diffArray(obj1 as any, obj2 as any, path, options));
  } else if (obj1 !== obj2) {
    result.push({
      op: DiffOperation.REPLACE,
      path,
      oldVal: obj1,
      newVal: obj2,
    });
  }
  return result;
}
