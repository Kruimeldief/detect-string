import { BinarySearchTreeBuilder } from './binarySearchTreeBuilder';

test('Add string to tree', () => {
  const tree = new BinarySearchTreeBuilder().add('string');
  expect(tree.list).toMatchObject([{ string: 'string', rate: 0 }]);
});

test('Add empty string to tree', () => {
  expect(() => new BinarySearchTreeBuilder().add('')).toThrow();
})

test('Add string to tree with rateOption overwrite', () => {
  const tree = new BinarySearchTreeBuilder()
    .add('string', 0)
    .add('string', 1, 'overwrite');
  expect(tree.list).toMatchObject([{ string: 'string', rate: 1 }]);
});

test('Add string to tree with rateOption useHighest', () => {
  const tree = new BinarySearchTreeBuilder()
    .add('string', 1)
    .add('string', 0, 'useHighest');
  expect(tree.list).toMatchObject([{ string: 'string', rate: 1 }]);
});

test('Add string to tree with rateOption useLowest', () => {
  const tree = new BinarySearchTreeBuilder()
    .add('string', 0)
    .add('string', 1, 'useLowest');
  expect(tree.list).toMatchObject([{ string: 'string', rate: 0 }]);
});

test('Add string to tree with rateOption useLowest', () => {
  const tree = new BinarySearchTreeBuilder()
    .add('string', 0)
    .add('string', 1, 'skip');
  expect(tree.list).toMatchObject([{ string: 'string', rate: 0 }]);
});

test('Add existing string to tree', () => {
  expect(() => new BinarySearchTreeBuilder().add('string', 0).add('string', 1)).toThrow();
});

test('Add array of strings to tree', () => {
  const tree = new BinarySearchTreeBuilder()
    .add(['string1', 'string2']);
  expect(tree.list).toMatchObject([{ string: 'string1', rate: 0 }, { string: 'string2', rate: 0 }]);
});

test('Remove string from tree', () => {
  const tree = new BinarySearchTreeBuilder()
    .add(['string1', 'string2'])
    .remove('string1');
  expect(tree.list).toMatchObject([{ string: 'string2', rate: 0 }]);
});

test('Remove array of strings from tree', () => {
  const tree = new BinarySearchTreeBuilder()
    .add(['string1', 'string2', 'string3'])
    .remove(['string1', 'string3']);
  expect(tree.list).toMatchObject([{ string: 'string2', rate: 0 }]);
});

test('Build a tree with sorted strings', () => {
  const tree = new BinarySearchTreeBuilder()
    .add(['string1', 'string2', 'string3', 'string4', 'string5', 'string6'])
    .build();
  expect(tree.strings).toMatchObject(['string4', 'string2', 'string6', 'string1', 'string3', 'string5'])
  expect(tree.rates).toMatchObject([0, 0, 0, 0, 0, 0]);
});

test('Build a tree with unsorted strings', () => {
  const tree = new BinarySearchTreeBuilder()
    .add(['string3', 'string2', 'string5', 'string1', 'string6', 'string4'])
    .build();
  expect(tree.strings).toMatchObject(['string4', 'string2', 'string6', 'string1', 'string3', 'string5'])
  expect(tree.rates).toMatchObject([0, 0, 0, 0, 0, 0]);
});

test('Try to build an empty tree', () => {
  expect(() => new BinarySearchTreeBuilder().build()).toThrow();
});

// test('Search for value in binary search tree', () => {
//   const array = new Array<string>(6);
//   array[0] = 'd';
//   array[1] = 'b';
//   array[2] = 'f';
//   array[4] = 'c';
//   array[5] = 'e';
//   const tree = new BinarySearchTree(
//     array,
//     [4, 2, 6, 0, 3, 5],
//     {
//       priority: 'cpu',
//       rateOption: 'useHighest',
//       searchOptions: {
//         confusables: 'remove',
//         emojis: 'latinize',
//         numbers: 'latinize',
//         punctuation: 'remove',
//         casing: 'lowercase',
//       },
//       sanitizeOptions: {
//         confusables: 'remove',
//         emojis: 'allow',
//         numbers: 'allow',
//         punctuation: 'allow',
//         casing: 'original',
//       }
//     },
//     new CharacterSetBuilder().build()
//   );
//   expect(tree.search('a')).toMatchObject({
//     'hasMatch': false
//   });
//   expect(tree.search('b')).toMatchObject({
//     'hasMatch': true,
//     'match': 'b',
//     'rate': 2,
//     'sanitized': 'b'
//   });
//   expect(tree.search('c')).toMatchObject({
//     'hasMatch': true,
//     'match': 'c',
//     'rate': 3,
//     'sanitized': 'c'
//   });
//   expect(tree.search('d')).toMatchObject({
//     'hasMatch': true,
//     'match': 'd',
//     'rate': 4,
//     'sanitized': 'd'
//   });
//   expect(tree.search('e')).toMatchObject({
//     'hasMatch': true,
//     'match': 'e',
//     'rate': 5,
//     'sanitized': 'e'
//   });
//   expect(tree.search('f')).toMatchObject({
//     'hasMatch': true,
//     'match': 'f',
//     'rate': 6,
//     'sanitized': 'f'
//   });
//   expect(tree.search('g')).toMatchObject({
//     'hasMatch': false
//   });
// });