import { BST } from "../binarySearchTree.js";

export class Profanity<CategoryT> extends BST<CategoryT> {
  public constructor(
    stringTree: Array<string>,
    categories: Array<CategoryT>,
    categoryIndexes: Uint8Array | Uint16Array | Uint32Array
  ) {
    super(stringTree, categories, categoryIndexes);
  }
}