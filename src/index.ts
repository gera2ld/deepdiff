import {
  DiffOptions, DiffItem, hashObject, prestringify,
} from './util';
import { diffAny } from './diff';

export type { DiffItem } from './util';
export { DiffOperation } from './util';

const defaultOptions: DiffOptions = {
  hashObject,
  prestringify: false,
};

export function deepdiff(
  obj1: any,
  obj2: any,
  options?: Partial<DiffOptions>,
): DiffItem[] {
  const mergedOptions: DiffOptions = {
    ...defaultOptions,
    ...options,
  };
  if (mergedOptions.prestringify) {
    prestringify(obj1);
    prestringify(obj2);
  }
  return diffAny(obj1, obj2, '', mergedOptions);
}
