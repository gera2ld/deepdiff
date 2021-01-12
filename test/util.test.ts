import { prestringify, stringify } from '../src/util';

it('equal to JSON.stringify', () => {
  const obj1 = {
    a: {
      b: {
        c: {
          d: '',
        },
      },
    },
  };
  const obj2 = JSON.parse(JSON.stringify(obj1));
  prestringify(obj2);
  const jsonStringify = JSON.stringify;
  JSON.stringify = () => { throw new Error('Should not call this'); };
  expect(stringify(obj2)).toEqual(jsonStringify(obj1));
  JSON.stringify = jsonStringify;
});
