import { BST } from "../binarySearchTree.js";

export class Profanity extends BST {

  /**
   * Constructor.
   */
  public constructor(strings: string[], rates: number[]) {
    super(strings, rates);
  }
}