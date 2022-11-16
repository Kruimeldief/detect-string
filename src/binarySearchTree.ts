import type { TreeOptions } from "./options.js";
import { Sanitizer } from "./sanitizer.js";

/**
 * Return object for BinarySearchTree.search() function.
 */
type Output = {
  hasMatch: boolean,
  match?: string,
  rate?: number,
  sanitized?: string
}

/**
 * Binary Search Tree.
 * Instance of this class should be created only by BinarySearchTreeBuilder.
 */
export class BinarySearchTree {
  /**
   * String tree nodes.
   */
  public readonly strings: string[];

  /**
   * Rate tree nodes.
   */
  public readonly rates: number[];

  /**
   * Tree options.
   */
  public readonly treeOptions: TreeOptions;

  /**
   * Sanitizer object with which to remove unwanted characters from strings.
   */
  private readonly sanitizer: Sanitizer;

  /**
   * Constructor.
   */
  public constructor(strings: string[], rates: number[], treeOptions: TreeOptions) {
    this.strings = strings;
    this.rates = rates;
    this.treeOptions = treeOptions;
    this.sanitizer = Sanitizer.instance;
  }

  /**
   * Search a string in the binary search tree.
   * @param string Input string.
   * @returns Informative object.
   */
  public search(string: string): Output {
    string = this.sanitizer.sanitize(string);
    let i = 1;
    while (i <= this.strings.length) {
      const compare = this.strings[i - 1]?.localeCompare(string);
      if (typeof compare === 'undefined') {
        return {
          'hasMatch': false
        }
      }
      if (compare === 0) {
        return {
          'hasMatch': true,
          'match': this.strings[i - 1],
          'rate': this.rates[i - 1],
          'sanitized': string
        }
      }
      if (compare < 0) {
        i = i * 2 + 1;
      }
      else {
        i = i * 2;
      }
    }
    return {
      'hasMatch': false
    }
  }
}