import { BinarySearchTree } from "./binarySearchTree";

test('Search for value in binary search tree', () => {
  const tree = new BinarySearchTree(
    ['d', 'b', 'f', 'a', 'c', 'e', 'g'],
    [4, 2, 6, 1, 3, 5, 7]
  );
  expect(tree.search('a')).toBe(1);
  expect(tree.search('b')).toBe(2);
  expect(tree.search('c')).toBe(3);
  expect(tree.search('d')).toBe(4);
  expect(tree.search('e')).toBe(5);
  expect(tree.search('f')).toBe(6);
  expect(tree.search('g')).toBe(7);
});