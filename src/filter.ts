import { Profanity } from "./binarySearchTree/profanity/profanity.js";
import { Whitelist } from "./binarySearchTree/whitelist/whitelist.js";
import { Matches, PurifierList, OrderOptions, Node, FilterOptions } from "./types.js";

export class Filter {

  private _profanity: Profanity;

  private _whitelist: Whitelist | null;

  private _purifierList: PurifierList;

  private _replacements: [string, string][];

  private readonly _options: FilterOptions;

  constructor(
    profanity: Profanity,
    whitelist: Whitelist | null,
    purifierList: PurifierList,
    replacements: [string, string][],
    options: FilterOptions
  ) {
    this._profanity = profanity;
    this._whitelist = whitelist;
    this._purifierList = purifierList;
    this._replacements = replacements;
    this._options = {
      sliceSize: 6
    }
    Object.assign(this._options, options);
  }

  public getBlacklist(options: OrderOptions): Node[] {
    return this._profanity.getList(options);
  }

  public getWhitelist(options: OrderOptions): Node[] | null {
    return this._whitelist instanceof Whitelist
      ? this._whitelist.getList(options)
      : null;
  }

  public search(string: string): Matches {
    const matches: Matches = {
      purified: this.purify(string),
      matches: []
    }
    for (let i = 0, len = this._purifierList.length; i < len; i++) {
      string = this._purifierList[i](string);
    }

    const searchSlice = (array: string[]): void => {
      const regexList: [RegExp | string, string][] = [
        ['', ''],                 // Use original string
        [/\W/g, ''],              // Remove non-words
        [/\s/g, ''],              // Remove spaces
        [/(\s)\1+/g, '$1'],       // Reduce double spaces to one
        [/(\w)\1+/g, '$1'],       // Reduce double letters to one
        [/(.)\1+/g, '$1'],        // Reduce double characters to one
        [/(\s)\1{2,}/g, '$1$1'],  // Reduce 3+ spaces to two
        [/(\w)\1{2,}/g, '$1$1'],  // Reduce 3+ letters to two
        [/(.)\1{2,}/g, '$1$1'],   // Reduce 3+ characters to two
        [/[^a-zA-Z\s]/g, ''],     // Remove non-Latin letter (necessary?)
        [/[aeiou]/g, ''],         // Remove non-vowels (non-English compatible?)
      ];

      // Processor intensive algorithm.
      for (let parts = 1, len = array.length, maxParts = Math.min(len, this._options.sliceSize || len); parts <= maxParts; parts++) {
        for (let i = 0; i <= len - parts; i++) {
          let slice = array.slice(i, i + parts).join(' ');
          for (let iReg = 0, lenReg = regexList.length; iReg < lenReg; iReg++) {
            for (let iRepl = -1, lenRepl = this._replacements.length; iRepl < lenRepl; iRepl++) {
              if (iRepl !== -1) {
                slice = slice.replace(this._replacements[i][0], this._replacements[i][1]);
              }
            }
            // Check for new match that's not whitelisted.
            const match = this._profanity.search(
              slice.replace(regexList[iReg][0], regexList[iReg][1])
            );
            if (match
              && !matches.matches.some((item) => item.string === match.string)
              && (this._whitelist?.search(match?.string) || true)) {
                matches.matches.push(match);
            }
          }
        }
      }
    }

    searchSlice(string.split(' '));
    searchSlice(string.replace(/\s/g, '').split(/\W/g));

    return matches;
  }

  public purify(string: string) {
    for (let i = 0, len = this._purifierList.length; i < len; i++) {
      string = this._purifierList[i](string);
    }
    return string;
  }
}