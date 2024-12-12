import { diffAny } from './diff';
import { IDiffItem, IDiffOptions, hashObject, prestringify } from './util';

export { findCommonItems } from './diff';
export { DiffOperation, type IDiffItem } from './util';

const defaultOptions: IDiffOptions = {
  hashObject,
  prestringify: false,
};

export function deepdiff(
  obj1: any,
  obj2: any,
  options?: Partial<IDiffOptions>
): IDiffItem[] {
  const mergedOptions: IDiffOptions = {
    ...defaultOptions,
    ...options,
  };
  if (mergedOptions.prestringify) {
    prestringify(obj1);
    prestringify(obj2);
  }
  return diffAny(obj1, obj2, '', mergedOptions);
}
