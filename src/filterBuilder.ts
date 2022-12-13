import { Profanity } from "./binarySearchTree/profanity/profanity.js";
import { ProfanityBuilder } from "./binarySearchTree/profanity/profanityBuilder.js";
import { Whitelist } from "./binarySearchTree/whitelist/whitelist.js";
import { WhitelistBuilder } from "./binarySearchTree/whitelist/whitelistBuilder.js";
import { CharacterSet, CharacterSetBuilder, confusablesSet, Purifier } from "./characterSetBuilder.js";
import { Filter } from "./filter.js";
import { ConfusablesOptions, FilterBuilderOptions, FilterOptions, ProfanityOptions, PurifierList, PurifyOptions, RateOption, WhitelistOptions } from "./types.js";


export class FilterBuilder {

  private _profanityBuilder: ProfanityBuilder;

  private _whitelistBuilder: WhitelistBuilder;

  private _confusableBuilder: CharacterSetBuilder;

  private _purifierList: PurifierList;

  private _replacements: [string, string][];

  private readonly _options: FilterBuilderOptions;

  constructor(options?: FilterBuilderOptions) {
    const profanityOptions: ProfanityOptions = options || {};
    this._profanityBuilder = new ProfanityBuilder(profanityOptions);
    const whitelistOptions: WhitelistOptions = options || {};
    this._whitelistBuilder = new WhitelistBuilder(whitelistOptions);
    const csbOptions: ConfusablesOptions = options || {};
    this._confusableBuilder = new CharacterSetBuilder(csbOptions);
    this._purifierList = [];
    this._replacements = [];
    this._options = options || {};
  }

  public blacklistAdd(strings: string | string[], rate = 0, doubleRating?: RateOption): this {
    this._profanityBuilder.add(strings, rate, doubleRating);
    return this;
  }

  public blacklistRemove(...strings: string[]): this {
    this._profanityBuilder.remove(...strings);
    return this;
  }

  public whitelistAdd(strings: string | string[], rate = 0, doubleRating?: RateOption): this {
    this._whitelistBuilder.add(strings, rate, doubleRating);
    return this;
  }

  public whitelistRemove(...strings: string[]): this {
    this._whitelistBuilder.remove(...strings);
    return this;
  }

  public confusablesAdd(key: string, ...characters: string[]): this {
    this._confusableBuilder.addConfusables(key, ...characters);
    return this;
  }

  public confusablesWhitelist(...characters: string[]): this {
    this._confusableBuilder.whitelist(...characters);
    return this;
  }

  public confusablesAddSet(set: confusablesSet): this {
    this._confusableBuilder.add(set);
    return this;
  }

  public replacementsAdd(original: string, replacement: string): this {
    this._replacements.push([original, replacement]);
    return this;
  }

  public build(): Filter {
    const cs: CharacterSet = this._confusableBuilder.build();
    const profanity: Profanity = this._profanityBuilder.setConfusables(cs).build();
    const whitelist: Whitelist | null = this._whitelistBuilder.list.length
      ? this._whitelistBuilder.setConfusables(cs).build()
      : null;
    for (const key in Purifier) {
      const k = key as keyof PurifyOptions;
      if (this._options[k] === 'purify') {
        this._purifierList.push(cs.purify);
      }
      else if (this._options[k] === 'remove') {
        this._purifierList.push(cs.remove);
      }
    }
    return new Filter(
      profanity,
      whitelist,
      this._purifierList,
      this._replacements,
      this._options as FilterOptions
    );
  }
}