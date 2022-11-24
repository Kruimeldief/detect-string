import type { ProfanityOptions, RateOption } from "../types.js";
import { removeDuplicates } from "../utils.js";
import type { CharacterSet } from "../characterSetBuilder.js";
import { BSTBase } from "./binarySearchTreeBase.js";

/**
 * Interface object to combine string and rate into a simple Node array.
 */
interface Node {
  string: string,
  rate: number,
}

export abstract class BSTBaseBuilder<T> {
  /**
   * List with nodes.
   */
  private _list: Node[];
  get list(): Node[] { return this._list; }

  /**
   * Binary search tree options.
   */
  private readonly _options: ProfanityOptions;

  /**
   * Constructor.
   */
  protected constructor(options?: ProfanityOptions) {
    this._list = new Array<Node>();
    this._options = {
      doubleRating: 'throwError',
      defaultProfanityList: 'include'
    }
    Object.assign(this._options, options);
  }

  /**
   * Add a string or array of strings to the binary search tree. 
   * @param strings Strings to include in the binary search tree.
   * @param rate Rating of the strings (rank or severity).
   */
  public add(strings: string | string[], rate = 0, doubleRating?: RateOption): this {
    if (typeof strings === 'string') {
      strings = [strings];
    }

    for (let i = 0, len = strings.length; i < len; i++) {
      if (!this.isValidString(strings[i])) {
        throw new Error('String must contain at least one character.');
      }

      // Check if string already exists.
      const index = this._list.findIndex((item) => item.string === strings[i]);
      if (index === -1) {
        this._list.push({
          string: strings[i],
          rate: rate
        } as Node)
      }
      else {
        this.fixDoubleRates(index, rate, doubleRating);
      }
    }
    return this;
  }

  private fixDoubleRates(index: number, rate: number, doubleRating?: RateOption): void {
    switch (doubleRating || this._options.doubleRating) {
      case 'skip':
        return;
      case 'overwrite':
        this._list[index].rate = rate;
        break;
      case 'useHighest':
        this._list[index].rate = Math.max(this._list[index].rate, rate);
        break;
      case 'useLowest':
        this._list[index].rate = Math.min(this._list[index].rate, rate);
        break;
      case 'throwError':
        throw new Error(
          'Cannot add existing string "'
          + this._list[index].string
          + '" because doubleRate option is set to "throwError".');
      default:
        throw new Error('Invalid doubleRate option provided.');
    }
  }

  /**
   * Remove a string or array of strings from the binary search tree.
   * @param strings Strings to remove from the binary search tree.
   */
  public remove(...strings: string[]): this {
    for (let i = strings.length - 1; i >= 0; i--) {
      if (this.isValidString(strings[i]) && this._list.length > 0) {
        const index = this._list.findIndex((item) => item.string === strings[i]);
        if (index !== -1) {
          this._list.splice(index, 1);
        }
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

  public abstract build(): T;

  /**
   * Build the binary search tree.
   * @returns Binary search tree.
   */
  private createTrees(characterSet?: CharacterSet): T {
    if (this._list.length === 0) {
      throw new Error('Tree contains no strings.');
    }

    // Purify strings if specified.
    if (characterSet !== undefined) {
      for (let i = 0, len = this._list.length; i < len; i++) {
        this._list[i].string = characterSet.purify(this._list[i].string);
      }
    }

    // Remove doubles created by purifying words.
    // Example: ['boob', 'b00b'] => ['boob', 'boob']
    // Reverse search to prevent finding itself if there are doubles.
    for (let i = this._list.length - 1; i >= 0; i--) {
      const iDouble = this._list.indexOf(this._list[i]);
      if (iDouble > 0 && i !== iDouble) {
        this.fixDoubleRates(iDouble, this._list[i].rate, this._options.doubleRating);
      }
    }

    // Function incidentally also sorts the list to get the correct medians.
    this._list = removeDuplicates(this._list)
      .sort((a, b) => a.string.localeCompare(b.string));

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

    

    return this.activator<BSTBase>(BSTBase)

    return new BSTBase(stringTree, rateTree) as T;
  }
}