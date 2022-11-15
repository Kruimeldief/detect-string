import type { RateOptions, TreeOptions } from './options.js';
import { BinarySearchTree } from './binarySearchTree.js';

interface Node {
  string: string,
  rate: number,
}

export class BinarySearchTreeBuilder {
  list: Node[]
  sanitize: boolean;

  /**
   * Constructor.
   */
  constructor(options?: TreeOptions) {
    this.list = new Array<Node>();
    this.sanitize = options?.sanitize || false;
    // TODO: Consider using setters instead of an option object (keyof object)
  }

  #addString(string: string, rate = 0, rateOptions?: RateOptions) {
    if (this.#isValidString(string)) {
      const index = this.list.findIndex((item) => item.string === string);
      if (index === -1) {
        const node: Node = {
          string: string,
          rate: rate,
        }
        this.list.push(node)
      }
      else if (rateOptions?.overwriteRate) {
        this.list[index].rate = rate;
      }
      else if (rateOptions?.useHighestRate) {
        this.list[index].rate = Math.max(this.list[index].rate, rate);
      }
    }
    else {
      throw new Error('Cannot add an empty string to a binary search tree.');
    }
  }

  /**
   * Add a string or array of strings to the binary search tree. 
   * @param strings Strings to include in the binary search tree.
   * @param rate Rating of the string (rank or severity).
   */
  add(strings: string | Array<string>, rate = 0, rateOptions?: RateOptions) {
    if (typeof strings === 'string') {
      this.#addString(strings, rate, rateOptions);
    }
    else {
      const length = strings.length;
      for (let i = 0; i < length; i++) {
        this.#addString(strings[i], rate, rateOptions);
      }
    }
    return this;
  }

  #removeString(string: string) {
    if (this.#isValidString(string) && this.list.length > 0) {
      const index = this.list.findIndex((item) => item.string === string);
      if (index !== -1) {
        this.list.splice(index, 1);
      }
    }
  }

  /**
   * Remove a string or array of strings from the binary search tree.
   * @param strings Strings to remove from the binary search tree.
   */
  remove(strings: string | Array<string>) {
    if (typeof strings === 'string') {
      this.#removeString(strings);
    }
    else {
      for (let i = strings.length - 1; i >= 0; i--) {
        this.#removeString(strings[i]);
      }
    }
    return this;
  }

  #isValidString(string: string) {
    return string.length > 0;
  }

  /**
   * Build the binary search tree.
   */
  build() {
    if (this.list.length === 0) {
      throw new Error('Tree contains no strings.');
    }

    // Sort to get the correct median.
    this.list = this.list.sort((a, b) => a.string.localeCompare(b.string));

    // Length must be able to accomodate a complete tree.
    const length = this.list.length;
    const treeNodeSize = Math.pow(2, Math.ceil(Math.log2(length + 1)));

    const stringTree = new Array<string>(this.list.length);
    const rateTree = new Array<number>(this.list.length);

    // Store next range for each next branch of nodes.
    const ranges = new Array(treeNodeSize);
    ranges[0] = [0, length];

    // Store index for old and new array.
    let i1 = 1; // strings' index (smaller length).
    let i2 = 0; // trees' index (bigger length).

    while (i1 <= length) {
      const low = ranges[i2][0];
      const high = ranges[i2][1];
      if (low > high) {
        i2++;
        continue;
      }

      const mid = Math.floor((low + high) / 2);
      stringTree[i2] = this.list[mid].string;
      rateTree[i2] = this.list[mid].rate;

      if (i1 * 2 <= treeNodeSize) {
        ranges[i1 * 2 - 1] = [low, mid - 1];
        ranges[i1 * 2] = [mid + 1, high];
      }
      i1++;
      i2++;
    }

    const tree = new BinarySearchTree(stringTree, rateTree);
    this.list = [];
    return tree;
  }
}