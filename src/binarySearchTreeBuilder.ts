import type { RateOption, TreeOptions } from './options.js';
import { BinarySearchTree } from './binarySearchTree.js';
import { Sanitizer } from './sanitizer.js';

interface Node {
  string: string,
  rate: number,
}

export class BinarySearchTreeBuilder {
  /**
   * List with nodes.
   */
  private _list: Node[];

  /**
   * Binary search tree options.
   */
  private _options: TreeOptions;

  /**
   * Sanitizer instance with which to 'sanitize' strings.
   */
  private _sanitizer: Sanitizer;

  /**
   * Getter for the node list.
   */
  get list(): Node[] {
    return this._list;
  }

  /**
   * Getter for the tree options.
   */
  get options(): TreeOptions {
    return this._options;
  }

  /**
   * Setter for the tree options.
   */
  set options(options: TreeOptions) {
    Object.assign(this._options, options);
  }

  /**
   * Constructor.
   */
  constructor(options?: TreeOptions) {
    this._list = new Array<Node>();
    this._options = {
      priority: 'cpu',
      rateOption: 'useHighest',
      searchOptions: {
        confusables: 'remove',
        emojis: 'latinize',
        numbers: 'latinize',
        punctuation: 'remove',
        casing: 'lowercase',
      },
      sanitizeOptions: {
        confusables: 'remove',
        emojis: 'allow',
        numbers: 'allow',
        punctuation: 'allow',
        casing: 'original',
      },
    }
    Object.assign(this._options, options);
    this._sanitizer = Sanitizer.instance;
  }

  /**
   * Add a string to the binary search tree.
   * @param string Node string.
   * @param rate Node rating: rate the string.
   * @param rateOption Specify action for the node rating if the string (and rate) already exist.
   */
  private addString(string: string, rate = 0, rateOption?: RateOption) {
    if (this.isValidString(string)) {
      const index = this._list.findIndex((item) => item.string === string);
      if (index === -1) {
        const node: Node = {
          string: string,
          rate: rate,
        }
        this._list.push(node)
      }
      else if (rateOption === 'skip') {
        return;
      }
      else if (rateOption === 'overwrite') {
        this._list[index].rate = rate;
      }
      else if (rateOption === 'useHighest') {
        this._list[index].rate = Math.max(this._list[index].rate, rate);
      }
      else if (rateOption === 'useLowest') {
        this._list[index].rate = Math.min(this._list[index].rate, rate);
      }
      else {
        throw new Error('Invalid rate option "' + rateOption + '"');
      }
    }
    else {
      throw new Error('String must contain at least one character.');
    }
  }

  /**
   * Add a string or array of strings to the binary search tree. 
   * @param strings Strings to include in the binary search tree.
   * @param rate Rating of the strings (rank or severity).
   */
  public add(strings: string | string[], rate = 0, rateOptions?: RateOption): this {
    if (typeof strings === 'string') {
      this.addString(strings, rate, rateOptions);
    }
    else {
      const length = strings.length;
      for (let i = 0; i < length; i++) {
        this.addString(strings[i], rate, rateOptions);
      }
    }
    return this;
  }

  /**
   * Remove a string from the binary search tree.
   * @param string Node string.
   */
  private removeString(string: string) {
    if (this.isValidString(string) && this._list.length > 0) {
      const index = this._list.findIndex((item) => item.string === string);
      if (index !== -1) {
        this._list.splice(index, 1);
      }
    }
  }

  /**
   * Remove a string or array of strings from the binary search tree.
   * @param strings Strings to remove from the binary search tree.
   */
  public remove(strings: string | string[]): this {
    if (typeof strings === 'string') {
      this.removeString(strings);
    }
    else {
      for (let i = strings.length - 1; i >= 0; i--) {
        this.removeString(strings[i]);
      }
    }
    return this;
  }

  /**
   * Validate a string.
   * @param string String to validate.
   * @returns Boolean
   */
  private isValidString(string: string): boolean {
    return string.length > 0;
  }

  /**
   * Build the binary search tree.
   * @returns Binary search tree.
   */
  public build(): BinarySearchTree {
    if (this._list.length === 0) {
      throw new Error('Tree contains no strings.');
    }

    // Sanitize and sort to get the correct medians.
    this._list = this._list.map((item) => {
      item.string = this._sanitizer.sanitize(item.string);
      return item;
    }).sort((a, b) => a.string.localeCompare(b.string));

    // Length must be able to accomodate a complete tree.
    const length = this._list.length;
    const treeNodeSize = Math.pow(2, Math.ceil(Math.log2(length + 1)));

    const stringTree = new Array<string>(this._list.length);
    const rateTree = new Array<number>(this._list.length);

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
      stringTree[i2] = this._list[mid].string;
      rateTree[i2] = this._list[mid].rate;

      if (i1 * 2 <= treeNodeSize) {
        ranges[i1 * 2 - 1] = [low, mid - 1];
        ranges[i1 * 2] = [mid + 1, high];
      }
      i1++;
      i2++;
    }

    const tree = new BinarySearchTree(stringTree, rateTree, this._options);
    this._list = [];
    return tree;
  }
}