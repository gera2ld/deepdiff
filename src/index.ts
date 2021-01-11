import { DiffOptions, DiffItem, hashObject } from './util';
import { diffAny } from './diff';

export { DiffItem, DiffOperation } from './util';

const defaultOptions: DiffOptions = {
  hashObject,
};

export function deepdiff(
  obj1: any,
  obj2: any,
  options?: Partial<DiffOptions>,
): DiffItem<any>[] {
  const mergedOptions: DiffOptions = {
    ...defaultOptions,
    ...options,
  };
  return diffAny(obj1, obj2, '', mergedOptions);
}
