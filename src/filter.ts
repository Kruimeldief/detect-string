import { Profanity } from "./binarySearchTree/profanity/profanity.js";
import { Whitelist } from "./binarySearchTree/whitelist/whitelist.js";
import { PurifierList, FilterOptions } from "./types.js";

interface Node<T> {
  category: T,
  strings: string[]
}
interface Matches<T> {
  query: string,
  purified: string,
  matches: Node<T>[],
}

export class Filter<CategoryT> {

  private _profanity: Profanity<CategoryT>;

  private _whitelist: Whitelist | null;

  private _purifierList: PurifierList;

  private readonly _options: FilterOptions;

  constructor(
    profanity: Profanity<CategoryT>,
    whitelist: Whitelist | null,
    purifierList: PurifierList,
    options: FilterOptions
  ) {
    this._profanity = profanity;
    this._whitelist = whitelist;
    this._purifierList = purifierList;
    this._options = options;
  }

  /**
   * Search the string in all categories.
   */
  public search(string: string): Matches<CategoryT>;
  /**
   * Search the string in specified category.
   */
  public search(string: string, category: CategoryT): Matches<CategoryT>;
  public search(string: string, category?: CategoryT): Matches<CategoryT> {
    const result: Matches<CategoryT> = {
      query: string,
      purified: this.purify(string),
      matches: []
    }

    const lenPurifier = this._purifierList.length;
    if (lenPurifier > 0) {
      for (let i = 0; i < lenPurifier; i++) {
        string = this._purifierList[i](string);
      }
    }

    const searchSlice = (array: string[]): void => {
      const regexList: [RegExp | string, string][] = [
        ['', ''],                 // Use original string
        [/\W/g, ''],              // Remove non-words
        [/\s/g, ''],              // Remove spaces
        [/(\s)\1+/g, '$1'],       // Reduce double spaces to one
        [/(\w)\1+/g, '$1'],       // Reduce double letters to one
        [/(.)\1+/g, '$1'],        // Reduce double characters to one
        [/(\s)\1{2,}/g, '$1$1'],  // Reduce multiple spaces to two
        [/(\w)\1{2,}/g, '$1$1'],  // Reduce multiple letters to two
        [/(.)\1{2,}/g, '$1$1'],   // Reduce multiple characters to two
        [/[^a-zA-Z\s]/g, ''],     // Remove non-Latin letter (necessary?)
        [/[aeiou]/g, ''],         // Remove non-vowels (non-English compatible?)
      ];

      // Processor intensive algorithm.
      for (let parts = 1, len = array.length, maxParts = Math.min(len, this._options.sliceSize || len); parts <= maxParts; parts++) {
        for (let i = 0; i <= len - parts; i++) {
          // Build partial string from array.
          const slice = array.slice(i, i + parts).join(' ');
          if (this._whitelist?.search(slice)) {
            continue;
          }
          for (let iReg = 0, lenReg = regexList.length; iReg < lenReg; iReg++) {
            // Modify string with regex.
            const modified = slice.replace(regexList[iReg][0], regexList[iReg][1]);
            const categories = category
              ? this._profanity.search(modified, category)
              : this._profanity.search(modified);
            if (categories) {
              // Add string match to each respective category.
              for (let iCat = 0, lenCats = categories.length; iCat < lenCats; iCat++) {
                const iCatMatch = result.matches.findIndex(v => v.category === categories[iCat]);
                if (iCatMatch === -1) {
                  result.matches.push({
                    category: categories[iCat],
                    strings: [modified]
                  });
                }
                else if (!result.matches[iCatMatch].strings.includes(modified)) {
                  result.matches[iCatMatch].strings.push(modified);
                }
              }
            }
          }
        }
      }
    }

    searchSlice(string.split(' '));
    searchSlice(string.replace(/\s/g, '').split(/\W/g));

    return result;
  }

  public purify(string: string) {
    for (let i = 0, len = this._purifierList.length; i < len; i++) {
      string = this._purifierList[i](string);
    }
    return string;
  }
}