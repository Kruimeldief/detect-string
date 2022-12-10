import type { Match } from "../../types.js";
import { BSTBase } from "../binarySearchTreeBase.js";


export class Profanity extends BSTBase {

  /**
   * Constructor.
   */
  public constructor(strings: string[], rates: number[]) {
    super(strings, rates);
  }

  public search(string: string): Match | undefined {
    return this.get(string);
  }
}