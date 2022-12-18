import { BST } from "../binarySearchTree.js";

export class Whitelist extends BST<null> {
  
  public constructor(strings: string[]) {
    super(strings, null);
  }
}