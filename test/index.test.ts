import { findCommonItems, deepdiff } from '#';

it('should equal', () => {
  const diff = deepdiff({
    a: [1, 2, 3, 5],
    b: 1,
  }, {
    a: [2, 3, 4, 5],
    b: 2,
  });
  expect(diff).toEqual([
    { op: 'delete', path: '/a/0', oldVal: 1 },
    { op: 'insert', path: '/a/3', newVal: 4 },
    { op: 'replace', path: '/b', oldVal: 1, newVal: 2 },
  ]);
});

it('should support empty diff diff', () => {
  const diff = deepdiff([1, 2, 3], []);
  expect(diff).toMatchSnapshot();
});

it('find common items', () => {
  const common = findCommonItems([1, 2, 3], [2, 3, 4]);
  expect(common).toEqual([
    [1, 0],
    [2, 1],
  ]);
});

it('find common items for empty array', () => {
  const common = findCommonItems([1, 2, 3], []);
  expect(common).toEqual([]);
});

it('ignore order of object keys', () => {
  const diff = deepdiff({
    a: 1,
    b: 2,
    c: 3,
  }, {
    c: 3,
    b: 2,
    a: 1,
  });
  expect(diff).toEqual([]);
});
