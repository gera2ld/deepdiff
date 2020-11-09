import test from 'tape';
import { findCommonItems, deepdiff } from '#';

test('deepdiff', t => {
  t.test('should equal', q => {
    q.deepEqual(deepdiff({
      a: [1, 2, 3, 5],
      b: 1,
    }, {
      a: [2, 3, 4, 5],
      b: 2,
    }), [
      { op: 'delete', path: '/a/0', oldVal: 1 },
      { op: 'insert', path: '/a/3', newVal: 4 },
      { op: 'replace', path: '/b', oldVal: 1, newVal: 2 },
    ]);
    q.end();
  });

  t.test('find common items', q => {
    q.deepEqual(findCommonItems([1, 2, 3], [2, 3, 4]), [
      [1, 0],
      [2, 1],
    ]);
    q.end();
  });

  t.test('ignore order of object keys', q => {
    q.deepEqual(deepdiff({
      a: 1,
      b: 2,
      c: 3,
    }, {
      c: 3,
      b: 2,
      a: 1,
    }), []);
    q.end();
  });
});
