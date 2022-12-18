import { BST } from "../binarySearchTree";

export class Confusables extends BST<null> {
  public constructor(stringTree: Array<string>) {
    super(stringTree, null);
  }
}