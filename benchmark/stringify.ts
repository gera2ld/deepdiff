#!/usr/bin/env deno run
import { prestringify, stringify } from '../src/util.ts';

function createNode(nest: number) {
  const node: any = {};
  if (nest > 0) {
    for (let i = 0; i < 6; i += 1) {
      node['k' + i] = createNode(nest - 1);
    }
  }
  return node;
}

function walkStringify(obj: any) {
  const result = [stringify(obj)];
  if (obj && typeof obj === 'object') {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      result.push(...walkStringify(obj[key]));
    }
  }
  return result;
}

console.time('create');
const obj1 = createNode(7);
console.timeEnd('create');

console.time('clone');
const obj2 = JSON.parse(JSON.stringify(obj1));
console.timeEnd('clone');

console.time('prestringify');
prestringify(obj2);
console.timeEnd('prestringify');

console.time('stringify1');
const res1 = walkStringify(obj1);
console.timeEnd('stringify1');

console.time('stringify2');
const res2 = walkStringify(obj2);
console.timeEnd('stringify2');

console.log(res1.join('\n') === res2.join('\n'));

