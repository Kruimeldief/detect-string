import { BST, BSTBuilder, Match } from "./binarySearchTreeBuilder.js";
import { CharacterSetBuilder, Purifier, confusableSet } from "./characterSetBuilder.js";
import type { BSTBOptions, CSBOptions, FilterOptions, RateOption, UnicodeOptions } from "./options.js";

type Matches = {
  purified: string,
  matches: Match[]
}

type PurifierList = ((string: string) => string)[];

class Filter {

  private _bst: BST;

  private _purifierList: PurifierList;

  private _purifySize: number;

  constructor(bst: BST, purifierSet: PurifierList) {
    this._bst = bst;
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

    /* Apply slicer here */

    const match: Match | undefined = this._bst.search(string);
    if (match) {
      matches.matches.push(match);
    }
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

  private _bstb: BSTBuilder;

  private _csb: CharacterSetBuilder;

  private _purifierList: PurifierList;

  private _unicodeOptions: UnicodeOptions;

  constructor(options?: FilterOptions) {
    const bstbOptions: BSTBOptions = options || {};
    this._bstb = new BSTBuilder(bstbOptions);
    const csbOptions: CSBOptions = options || {};
    this._csb = new CharacterSetBuilder(csbOptions);
    this._purifierList = [];
    this._unicodeOptions = options || {};
  }

  public add(strings: string | string[], rate = 0, doubleRating?: RateOption): this {
    this._bstb.add(strings, rate, doubleRating);
    return this;
  }

  public remove(...strings: string[]): this {
    this._bstb.remove(...strings);
    return this;
  }

  public addConfusables(key: string, ...characters: string[]): this {
    this._csb.addConfusables(key, ...characters);
    return this;
  }

  public whitelistConfusable(...characters: string[]): this {
    this._csb.whitelist(...characters);
    return this;
  }

  public addConfusableSet(set: confusableSet): this {
    this._csb.add(set);
    return this;
  }

  public refactorConfusables(): this {
    this._csb.refactor();
    return this;
  }

  public build(): Filter {
    const cs = this._csb.build();
    const bst = this._bstb.build(cs);
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