import type { BSTBuilderOptions, defaultCategory } from "../types.js";
import { removeDuplicates } from "../utils.js";
import { CharacterSet } from "../characterSetBuilder.js";

/**
 * Interface object to return built trees for BST creation.
 */
interface TreeArrays {
  stringTree: string[],
  categoryTree: Uint8Array | Uint16Array | Uint32Array
}

interface Node {
  string: string,
  iCategory: number[]
}

export abstract class BSTBuilder<ClassT, CategoryT = defaultCategory> {

  /**
   * List with nodes.
   */
  protected _list: Node[];
  get list(): Node[] {
    return this._list;
  }

  protected _confusables: CharacterSet | null;
  public setConfusables(confusables: CharacterSet): this {
    this._confusables = confusables;
    return this;
  }

  protected _categories: CategoryT[];

  /**
   * Binary search tree options.
   */
  protected readonly _options: BSTBuilderOptions;

  /**
   * Constructor.
   */
  protected constructor(options?: BSTBuilderOptions) {
    this._list = new Array<Node>();
    this._confusables = null;
    this._categories = [];
    this._options = {
      defaultCategory: 0,
      allowMultipleCategories: true
    }
    Object.assign(this._options, options);
  }

  /**
   * Add a string to the binary search tree.
   */
  public add(string: string): this;
  /**
   * Add multiple strings to the binary search tree.
   */
  public add(strings: string[]): this;
  /**
   * Add a categorised string to the binary search tree.
   */
  public add(string: string, category: CategoryT): this;
  /**
   * Add multiple categorised strings to the binary search tree.
   */
  public add(strings: string[], category: CategoryT): this;
  /**
   * Add a multi-categorised string to the binary search tree.
   */
  public add(string: string, categories: CategoryT[]): this;
  /**
   * Add multiple multi-categorised strings to the binary search tree.
   */
  public add(strings: string[], categories: CategoryT[]): this;
  public add(strings: string | string[], categories?: CategoryT | CategoryT[]): this {
    // Make all arguments instance of array.
    if (typeof strings === 'string') {
      strings = [strings];
    }
    if (typeof categories === 'undefined') {
      categories = [this._options.defaultCategory];
    }
    else if (!(categories instanceof Array)) {
      categories = [categories];
    }

    // Index categories.
    const iCats: number[] = [];
    for (let i = 0, len = categories.length; i < len; i++) {
      let iCat = this._categories.indexOf(categories[i]);
      if (iCat === -1) {
        this._categories.push(categories[i]);
        iCat = this._categories.length - 1;
      }
      iCats.push(iCat);
    }

    // Check if multiple categories are allowed.
    if (this._options.allowMultipleCategories && iCats.length > 1) {
      this.throwCategories();
    }

    // Add strings and categories.
    for (let i = 0, len = strings.length; i < len; i++) {
      this.throwInvalid(strings[i]);

      // Push new strings, or add categories to existing strings.
      const iString = this._list.findIndex(v =>  v.string === strings[i]);
      if (iString === -1) {
        this._list.push({
          string: strings[i],
          iCategory: iCats
        });
      }
      else {
        const cats = this._list[iString].iCategory;
        for (let j = 0, len = cats.length; j < len; j++) {
          if (cats.indexOf(iCats[j]) === -1) {
            this._list[iString].iCategory.push(iCats[j]);
          }
        }
        // Check if multiple categories are allowed.
        if (!this._options.allowMultipleCategories && this._list[iString].iCategory.length > 1) {
          this.throwCategories();
        }
      }
    }
    return this;
  }

  /**
   * Remove a string or array of strings from the binary search tree.
   * @param strings Strings to remove from the binary search tree.
   */
  public remove(...strings: string[]): this {
    for (let i = 0, len = strings.length; i < len; i++) {
      this.throwInvalid(strings[i]);
      if (this._list.length > 0) {
        const index = this._list.findIndex(v => v.string === strings[i]);
        if (index !== -1) {
          this._list.splice(index, 1);
        }
      }
    }
    return this;
  }

  /**
   * Throw an error if the string is invalid.
   * @param string String to validate.
   */
  protected throwInvalid(string: string): void {
    if (string.length === 0) {
      throw new Error('String \'' + string + '\' cannot be empty.');
    }
  }

  protected throwCategories() {
    throw new Error('Strings cannot have multiple categories because allowMultipleCategories is set to ' + this._options.allowMultipleCategories);
  }

  public abstract build(): ClassT;

  /**
   * Build the binary search tree arrays.
   * @returns Binary search tree arrays.
   */
  protected buildTrees(): TreeArrays {
    if (this._list.length === 0) {
      throw new Error('Tree contains no strings.');
    }

    // Purify strings if possible.
    if (this._confusables instanceof CharacterSet) {
      for (let i = 0, len = this._list.length; i < len; i++) {
        this._list[i].string = this._confusables.purify(this._list[i].string);
      }
    }

    // Remove doubles created by purifying words.
    // Example: ['boob', 'b00b'] => ['boob', 'boob']
    // Reverse search to prevent finding itself if there are doubles.
    // Reverse search to splice the latest added element and corret the firstly added element.
    for (let i = this._list.length - 1; i >= 0; i--) {
      const iDouble = this._list.indexOf(this._list[i]);
      if (iDouble > 0 && i !== iDouble) {
        this._list[iDouble].iCategory = removeDuplicates(
          [this._list[iDouble].iCategory, this._list[i].iCategory].flat()
        );
        this._list.splice(i, 1);
      }
    }

    // Sort based on string to get the correct medians.
    this._list = this._list.sort((a, b) => a.string.localeCompare(b.string));

    // Remove unused categories.
    const categories: CategoryT[] = [];
    for (let iCat = 0, len = this._categories.length; iCat < len; iCat++) {
      if (!this._list.some(v => v.iCategory.includes(iCat))) {
        continue;
      }
      categories.push(this._categories[iCat]);
      const newICat = categories.length - 1;
      if (iCat === newICat) {
        continue;
      }
      // Correct the iCateogry with the new category index.
      for (let iList = 0, len = this._list.length; iList < len; iList++) {
        this._list[iList].iCategory = this._list[iList].iCategory.map(v => v === iCat ? newICat : v);
      }
    }
    this._categories = categories;

    // Determine length of category tree bit mask.
    const catSize = Math.pow(2, Math.ceil(Math.log2(this._categories.length)));
    if (catSize > 32) throw new Error('BST cannot have more than 32 categories.');
    
    // Length must be able to accomodate a complete tree.
    const length = this._list.length;
    const treeNodeSize = Math.pow(2, Math.ceil(Math.log2(length + 1)));

    // Create tree arrays.
    const stringTree = new Array<string>(this._list.length);
    const categoryTree = catSize === 8
      ? new Uint8Array(length)
      : catSize === 16
        ? new Uint16Array(length)
        : new Uint32Array(length);

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

      // Create category mask
      let catMask = 0;
      for (let i = 0, len = this._categories.length; i < len; i++) {
        if (this._list[mid].iCategory.includes(i)) {
          catMask = catMask | 1 << i;
        }
      }

      stringTree[i2] = this._list[mid].string;
      categoryTree[i2] = catMask;

      if (i1 * 2 <= treeNodeSize) {
        ranges[i1 * 2 - 1] = [low, mid - 1];
        ranges[i1 * 2] = [mid + 1, high];
      }
      i1++;
      i2++;
    }

    return {
      stringTree: stringTree,
      categoryTree: categoryTree,
    } as TreeArrays;
  }
}