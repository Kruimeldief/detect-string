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
    [4, 2, 6, 0, 3, 5]
  );
  expect(tree.search('a')).toBe(0);
  expect(tree.search('b')).toBe(2);
  expect(tree.search('c')).toBe(3);
  expect(tree.search('d')).toBe(4);
  expect(tree.search('e')).toBe(5);
  expect(tree.search('f')).toBe(6);
  expect(tree.search('g')).toBe(0);
});