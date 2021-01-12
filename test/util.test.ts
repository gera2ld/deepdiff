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
  const obj2 = prestringify(obj1);
  const JSON_stringify = JSON.stringify;
  JSON.stringify = () => { throw new Error('Should not call this') };
  expect(stringify(obj2)).toEqual(JSON_stringify(obj1));
  JSON.stringify = JSON_stringify;
});
