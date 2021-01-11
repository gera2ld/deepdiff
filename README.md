# @gera2ld/deepdiff

![NPM](https://img.shields.io/npm/v/@gera2ld/deepdiff.svg)
![License](https://img.shields.io/npm/l/@gera2ld/deepdiff.svg)
![Downloads](https://img.shields.io/npm/dt/@gera2ld/deepdiff.svg)

Deep difference JSON objects.

## Installation

```sh
$ yarn add @gera2ld/deepdiff
```

## Usage

```js
import { deepdiff } from '@gera2ld/deepdiff';

console.log(deepdiff({
  a: [1, 2, 3, 5],
  b: 1,
}, {
  a: [2, 3, 4, 5],
  b: 2,
}));
// -> [
//   { op: 'delete', path: '/a/0', oldVal: 1 },
//   { op: 'insert', path: '/a/3', newVal: 4 },
//   { op: 'replace', path: '/b', oldVal: 1, newVal: 2 },
// ]

// Custom hashObject
console.log(deepdiff({
  a: [1, 2, 3, 5],
  b: 1,
}, {
  a: [2, 3, 4, 5],
  b: 2,
}, {
  hashObject: () => 'all same hash',
}));
// -> []
```
