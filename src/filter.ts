import type { Profanity } from "./binarySearchTree/profanity/profanity.js";
import { ProfanityBuilder } from "./binarySearchTree/profanity/profanityBuilder.js";
import { CharacterSetBuilder, Purifier, confusableSet } from "./characterSetBuilder.js";
import type { ProfanityOptions, CSBOptions, FilterOptions, RateOption, UnicodeOptions, Match } from "./types.js";

type Matches = {
  purified: string,
  matches: Match[]
}

type PurifierList = ((string: string) => string)[];

class Filter {

  private _profanity: Profanity;

  private _purifierList: PurifierList;

  private _purifySize: number;

  constructor(bst: Profanity, purifierSet: PurifierList) {
    this._profanity = bst;
    this._purifierList = purifierSet;
    this._purifySize = this._purifierList.length;
  }

  public scan(string: string): Matches {
    const matches: Matches = {
      purified: this.purify(string),
      matches: []
    }
    for (let i = 0; i < this._purifySize; i++) {
      string = this._purifierList[i](string);
    }

    const searchSlice = (array: string[]): void => {
      const regexList: [RegExp | string, string][] = [
        ['', ''],                  // Use original string
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
      for (let parts = 1, len = array.length; parts <= len; parts++) {
        for (let i = 0; i <= len - parts; i++) {
          const slice = array.slice(i, i + parts).join(' ');
          for (let iReg = 0, lenReg = regexList.length; iReg < lenReg; iReg++) {
            const match = this._profanity.search(
              slice.replace(regexList[iReg][0], regexList[iReg][1])
            );
            if (match && !matches.matches.some((item) => item.string === match.string)) {
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
    for (let i = 0; i < this._purifySize; i++) {
      string = this._purifierList[i](string);
    }
    return string;
  }
}


export class FilterBuilder {

  private _profanityBuilder: ProfanityBuilder;

  private _confusableBuilder: CharacterSetBuilder;

  private _purifierList: PurifierList;

  private _unicodeOptions: UnicodeOptions;

  constructor(options?: FilterOptions) {
    const bstbOptions: ProfanityOptions = options || {};
    this._profanityBuilder = new ProfanityBuilder(bstbOptions);
    const csbOptions: CSBOptions = options || {};
    this._confusableBuilder = new CharacterSetBuilder(csbOptions);
    this._purifierList = [];
    this._unicodeOptions = options || {};
  }

  public add(strings: string | string[], rate = 0, doubleRating?: RateOption): this {
    this._profanityBuilder.add(strings, rate, doubleRating);
    return this;
  }

  public remove(...strings: string[]): this {
    this._profanityBuilder.remove(...strings);
    return this;
  }

  public addConfusables(key: string, ...characters: string[]): this {
    this._confusableBuilder.addConfusables(key, ...characters);
    return this;
  }

  public whitelistConfusable(...characters: string[]): this {
    this._confusableBuilder.whitelist(...characters);
    return this;
  }

  public addConfusableSet(set: confusableSet): this {
    this._confusableBuilder.add(set);
    return this;
  }

  public refactorConfusables(): this {
    this._confusableBuilder.refactor();
    return this;
  }

  public build(): Filter {
    const cs = this._confusableBuilder.build();
    const bst = this._profanityBuilder.build(cs);
    for (const key in Purifier) {
      const k = key as keyof typeof this._unicodeOptions;
      if (this._unicodeOptions[k] === 'purify') {
        this._purifierList.push(cs.purify);
      }
      else if (this._unicodeOptions[k] === 'remove') {
        this._purifierList.push(cs.remove);
      }
    }
    return new Filter(bst, this._purifierList);
  }
}