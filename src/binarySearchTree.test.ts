import { BinarySearchTree } from "./binarySearchTree";

test('Search for value in binary search tree', () => {
  const array = new Array<string>(6);
  array[0] = 'd';
  array[1] = 'b';
  array[2] = 'f';
  array[4] = 'c';
  array[5] = 'e';
  const tree = new BinarySearchTree(
    array,
    [4, 2, 6, 0, 3, 5],
    {
      priority: 'cpu',
      rateOption: 'useHighest',
      searchOptions: {
        confusables: 'remove',
        emojis: 'latinize',
        numbers: 'latinize',
        punctuation: 'remove',
        casing: 'lowercase',
      },
      sanitizeOptions: {
        confusables: 'remove',
        emojis: 'allow',
        numbers: 'allow',
        punctuation: 'allow',
        casing: 'original',
      }
    }
  );
  expect(tree.search('a')).toMatchObject({
    'hasMatch': false
  });
  expect(tree.search('b')).toMatchObject({
    'hasMatch': true,
    'match': 'b',
    'rate': 2,
    'sanitized': 'b'
  });
  expect(tree.search('c')).toMatchObject({
    'hasMatch': true,
    'match': 'c',
    'rate': 3,
    'sanitized': 'c'
  });
  expect(tree.search('d')).toMatchObject({
    'hasMatch': true,
    'match': 'd',
    'rate': 4,
    'sanitized': 'd'
  });
  expect(tree.search('e')).toMatchObject({
    'hasMatch': true,
    'match': 'e',
    'rate': 5,
    'sanitized': 'e'
  });
  expect(tree.search('f')).toMatchObject({
    'hasMatch': true,
    'match': 'f',
    'rate': 6,
    'sanitized': 'f'
  });
  expect(tree.search('g')).toMatchObject({
    'hasMatch': false
  });
});