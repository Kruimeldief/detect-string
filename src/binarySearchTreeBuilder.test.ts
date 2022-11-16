import { BinarySearchTreeBuilder } from "./binarySearchTreeBuilder";

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