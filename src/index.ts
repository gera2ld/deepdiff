import { DiffOptions, DiffItem, hashObject } from './util';
import { diffAny } from './diff';

const defaultOptions: DiffOptions = {
  hashObject,
};

export function deepdiff<T = any>(
  obj1: T,
  obj2: T,
  options: Partial<DiffOptions>,
): DiffItem<T>[] {
  const mergedOptions: DiffOptions = {
    ...defaultOptions,
    ...options,
  };
  return diffAny(obj1, obj2, '', mergedOptions);
}
