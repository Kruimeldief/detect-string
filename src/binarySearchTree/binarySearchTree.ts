export abstract class BST<CategoryT> {
  /**
   * Tree array of strings.
   */
  private readonly _strings: Array<string>;

  /**
   * Bit masks for each strings in `BST._strings` on the same index.
   * The index of each bit corresponds to the category on the same index in `BST._categories`.
   * If there is only one category, this variable is set to `null`.
   */
  private readonly _masks: Uint8Array | Uint16Array | Uint32Array | null;

  /**
   * Array of categories. If array contains one element, `BST._mask` is set to `null`.
   */
  private readonly _categories: Array<CategoryT>;

  /**
   * Length of shortest string in `BST._strings`.
   */
  private readonly _minLength: number;

  /**
   * Length of longest string in `BST._strings`.
   */
  private readonly _maxLength: number;

  /**
   * Binary search tree with the default category. Category is essentially useless.
   */
  protected constructor(
    stringTree: Array<string>,
    category: CategoryT
  );
  /**
   * Binary search tree with multiple categories.
   */
  protected constructor(
    stringTree: Array<string>,
    categories: Array<CategoryT>,
    categoryIndexes: Uint8Array | Uint16Array | Uint32Array
  );
  protected constructor(
    stringTree: Array<string>,
    categories: CategoryT | Array<CategoryT>,
    categoryIndexes?: Uint8Array | Uint16Array | Uint32Array
  ) {
    this._strings = stringTree;
    this._categories = Array<CategoryT>().concat(categories);
    this._masks = categoryIndexes || null;
    this._minLength = stringTree.reduce((a, b) => a.length < b.length ? a : b).length;
    this._maxLength = stringTree.reduce((a, b) => a.length > b.length ? a : b).length;
  }

  /**
   * Search allows you to find the categories of a string.
   * If string exists, search returns all associated categories.
   * Otherwise, search returns undefined.
   */
  public search(string: string): CategoryT[] | undefined;
  /**
   * Search allows you to check the existance of a string with a specified category.
   * If string exists, search returns your provided category.
   * Otherwise, search returns undefined.
   * 
   * Search' return essentially works as a boolean.
   */
  public search(string: string, category: CategoryT): CategoryT[] | undefined;
  public search(string: string, category?: CategoryT): CategoryT[] | undefined {
    const length = string.length;
    if (length < this._minLength || length > this._maxLength) {
      return;
    }
    let i = 1;
    while (i <= this._strings.length) {
      const compare = this._strings[i - 1]?.localeCompare(string);
      if (typeof compare === 'undefined') {
        return;
      }
      // If string matches.
      if (compare === 0) {
        // If category is set, return this category (essentially as boolean).
        if (category) {
          const iCat = this._categories.findIndex(v => v === category);
          const mask = 1 << iCat;
          if (mask === ((this._masks?.at(i) || 1) & mask)) {
            return [category];
          }
          return;
        }
        // Return all categories.
        else {
          const result: CategoryT[] = [];
          for (let bit = 0, len = this._categories.length; bit < len; bit++) {
            if (1 << bit === ((this._masks?.at(i) || 1) & 1 << bit)) {
              result.push(this._categories[bit]);
            }
          }
          return result;
        }
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