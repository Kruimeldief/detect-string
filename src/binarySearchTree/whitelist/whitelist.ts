import { Node } from "../../types.js";
import { BST } from "../binarySearchTree.js";

export class Whitelist extends BST {

  /**
   * Constructor.
   */
  public constructor(strings: string[], rates: number[]) {
    super(strings, rates);
  }

  public search(string: string): Node | undefined {
    let i = 1;
    while (i <= this._strings.length) {
      const compare = this._strings[i - 1]?.localeCompare(string);
      if (typeof compare === 'undefined') {
        return;
      }
      if (compare === 0) {
        return {
          string: this._strings[i - 1],
          rate: this._rates[i - 1]
        } as Node;
      }
      if (compare < 0) {
        i = i * 2 + 1;
      }
      else {
        i = i * 2;
      }
    }
    return;
  }
}