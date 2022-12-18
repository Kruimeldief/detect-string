import { Profanity } from "./binarySearchTree/profanity/profanity.js";
import { ProfanityBuilder } from "./binarySearchTree/profanity/profanityBuilder.js";
import { Whitelist } from "./binarySearchTree/whitelist/whitelist.js";
import { WhitelistBuilder } from "./binarySearchTree/whitelist/whitelistBuilder.js";
import { CharacterSet, CharacterSetBuilder, Purifier } from "./characterSetBuilder.js";
import { Filter } from "./filter.js";
import { ConfusablesOptions, defaultCategory, FilterBuilderOptions, FilterOptions, ProfanityOptions, PurifierList, PurifyOptions, WhitelistOptions } from "./types.js";


export class FilterBuilder<CategoryT = defaultCategory> {

  private _profanityBuilder: ProfanityBuilder<CategoryT>;
  get blacklist() {
    return this._profanityBuilder;
  }

  private _whitelistBuilder: WhitelistBuilder;
  get whitelist() {
    return this._whitelistBuilder;
  }

  private _confusableBuilder: CharacterSetBuilder;
  get confusables() {
    return this._confusableBuilder;
  }

  private readonly _options: FilterBuilderOptions;

  constructor(options?: FilterBuilderOptions) {
    const opts: FilterBuilderOptions = {
      sliceSize: 1
    }
    Object.assign(opts, options);

    const profanityOptions: ProfanityOptions = opts || {};
    this._profanityBuilder = new ProfanityBuilder<CategoryT>(profanityOptions);
    const whitelistOptions: WhitelistOptions = {
      defaultCategory: null,
      allowMultipleCategories: false
    }
    this._whitelistBuilder = new WhitelistBuilder(whitelistOptions);
    const csbOptions: ConfusablesOptions = opts || {};
    this._confusableBuilder = new CharacterSetBuilder(csbOptions);
    this._options = opts || {};
  }

  public build(): Filter<CategoryT> {
    const cs: CharacterSet = this._confusableBuilder.build();
    const profanity: Profanity<CategoryT> = this._profanityBuilder.setConfusables(cs).build();
    const whitelist: Whitelist | null = this._whitelistBuilder.list.length
      ? this._whitelistBuilder.setConfusables(cs).build()
      : null;
    const purifierList: PurifierList = [];
    for (const key in Purifier) {
      const k = key as keyof PurifyOptions;
      if (this._options[k] === 'purify') {
        purifierList.push(cs.purify);
      }
      else if (this._options[k] === 'remove') {
        purifierList.push(cs.remove);
      }
    }
    return new Filter<CategoryT>(
      profanity,
      whitelist,
      purifierList,
      this._options as FilterOptions
    );
  }
}