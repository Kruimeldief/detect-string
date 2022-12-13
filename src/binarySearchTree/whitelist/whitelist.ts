import { BST } from "../binarySearchTree.js";

export class Whitelist extends BST {

  /**
   * Constructor.
   */
  public constructor(strings: string[], rates: number[]) {
    super(strings, rates);
  }
}