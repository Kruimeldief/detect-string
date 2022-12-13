import { regexFormat, removeDuplicates } from './utils.js';
import fs from 'fs';
import type { ConfusablesOptions } from './types.js';

export type confusablesSet = Record<string, string[]>;
type RegexSet = Record<string, RegExp>;

/**
 * Property and value should be identical to update
 * the character set options.
 */
export enum Purifier {
  confusables = 'confusables',
  // emojis = 'emojis'
}

/**
 * Interface for JSON file /root/lists/confusables.json
 */
interface Confusables {
  alphabetSets: {
    alphabet: string[],
    characterSet: string[][]
  }[],
  numberSet: string[][],
  parallelCharacterSet: {
    replacementSet: string[],
    characterSet: string[],
  },
  serialCharacterSets: {
    replacement: string,
    characterSet: string[]
  }[]
}

interface Whitelist {
  ranges: string[][],
  characters: string[]
}

/**
 * Character set contains unwanted character regexes indexed by their replacement character.
 */
export class CharacterSet {

  /**
   * Set of unwanted characters (values) indexed by their replacement character (key).
   */
  private readonly _characterSet: RegexSet;
  public get characterSet(): RegexSet {
    return this._characterSet;
  }

  /**
   * Cached list of all character set keys.
   */
  private readonly _keyList: string[];

  /**
   * Cached list of all character set values.
   * `undefined` if user priorities memory.
   */
  private readonly _valueList: RegExp[];

  /**
   * Cache the size of the character set.
   */
  private readonly _size: number;

  /**
   * Union of all character set values. One regex to rule them all.
   */
  private readonly _regex: RegExp;

  /**
   * @param characterSet Set of character regexes.
   * @param csOptions Character set options to specify functionalities and performance.
   */
  public constructor(characterSet: confusablesSet) {
    this._keyList = Object.keys(characterSet);
    this._characterSet = {};
    for (let i = 0, len = this._keyList.length; i < len; i++) {
      const key = this._keyList[i]
      this._characterSet[key] = new RegExp(characterSet[key].map((item) => regexFormat(item)).join('|'), 'g');
    }
    this._regex = new RegExp(Object.values(characterSet).flat().map((item) => regexFormat(item)).join('|'));
    this._valueList = Object.values(this._characterSet);
    this._size = this._keyList.length;
  }

  /**
   * Remove any unwanted characters from a string.
   * @param string String from which to remove unwanted characters.
   * @returns String without unwanted characters.
   */
  public purify(string: string): string {
    if (!this._size || !this._regex.test(string)) {
      return string;
    }
    let i = 0, len = this._size;
    while (i++ < len) {
      string = string.replace(this._valueList[i], this._keyList[i]); // 20020 ops
      // string = string.split(this._valueList[i]).join(this._keyList[i]) // 19182 ops
    }
    return string;
  }

  public remove(string: string): string {
    if (this._size) {
      return string.split(this._regex).join('');
    }
    return string;
  }
}

/**
 * Character set contains unwanted characters indexed by their replacement character.
 */
export class CharacterSetBuilder {
  /**
   * CSB options to specify the character set build.
   */
  private readonly _options: ConfusablesOptions;

  private _characterSet: confusablesSet;

  private _whitelist: string[];

  public constructor(options?: ConfusablesOptions) {
    this._options = {
      confusablesByUnicode: 'exclude',
      confusablesByPackage: 'include',
      confusables: 'purify',
      // emojis: 'allow'
    };
    this._options = Object.assign(this._options, options);
    this._characterSet = {};
    this._whitelist = [];
    if (this._options.confusablesByPackage === 'include') {
      this.loadLocalConfusables();
    }
    if (this._options.confusablesByUnicode === 'include') {
      this.loadUnicodeConfusables();
    }
    this.refactor();
  }

  public add(set: confusablesSet): this {
    const keyList = Object.keys(set);
    for (let i = 0, len = keyList.length; i < len; i++) {
      const key = keyList[i];
      this.addConfusables(key, ...set[key]);
    }
    return this;
  }

  public whitelist(...characters: string[]): this {
    this._whitelist.push(...characters);
    return this;
  }

  /**
   * Refactor keys and remove double values per key.
   */
  private refactor(): this {
    // Refactor keys by moving values from a key to another key if that key is found as a value in another key.
    let keyList: string[] = Object.keys(this._characterSet);
    for (let i = 0, len = keyList.length; i < len; i++) {
      for (let j = 0; j < len; j++) {
        const key: string = keyList[i];
        const value: string = keyList[j];
        const index: number = this._characterSet[key].indexOf(value);
        if (index === -1 || key === value) {
          continue;
        }
        else {
          this._characterSet[key].concat(this._characterSet[value]);
          delete this._characterSet[value];
          keyList = Object.keys(this._characterSet);
          len--;
        }
      }
    }

    // Remove any double values per key.
    for (let i = 0, len = keyList.length; i < len; i++) {
      const key = keyList[i];
      this._characterSet[key] = removeDuplicates(this._characterSet[key]);
    }
    return this;
  }

  /**
   * Remove all characters from the character set and the whitelist.
   * It's bad practise to use this method because it's a Builder design anti-pattern.
   * 
   * Use `new CharacterSetBuilder({ defaultSet: 'empty' })` if you want to skip
   * the default set initialisation.
   */
  public clear(): this {
    this._characterSet = {};
    this._whitelist = [];
    return this;
  }
  
  /**
   * Add an array of characters to the key in the the character set.
   * @param key Preferred character.
   * @param values Unwanted character.
   */
  public addConfusables(key: string, ...values: string[]): this {
    if (key.length === 0) {
      throw new Error('Key cannot be empty.')
    }
    for (let i = 0, len = values.length; i < len; i++) {
      if (values[i].length === 0) {
        throw new Error('Key "' + key + '" cannot have an empty value.');
      }
    }
    if (typeof this._characterSet[key] === 'undefined') {
      this._characterSet[key] = [];
    }
    this._characterSet[key].push(...values);
    return this;
  }

  /**
   * Load the Unicode.org confusables into the character set.
   */
  private loadUnicodeConfusables(): void {
    fs.readFileSync(new URL('../lists/confusablesUnicode.txt', import.meta.url), 'utf-8')
      .toString()
      .split('\r\n')
      .filter((item) => item.length !== 0 && !item.startsWith('#'))
      .forEach((item) => {
        const array = item.split(';');
        const values = [...array[0].matchAll(/[0-9a-f]+/gi)]
          .map((item) => String.fromCodePoint(parseInt(item[0], 16)))
          .join('');
        const key = [...array[1].matchAll(/[0-9a-f]+/gi)]
          .map((item) => String.fromCodePoint(parseInt(item[0], 16)))
          .join('');
        this.addConfusables(key, values);
      });

    const whitelist: Whitelist = JSON.parse(fs.readFileSync(new URL('../lists/confusablesWhitelist.json', import.meta.url), 'utf-8'));
    this._whitelist.push(...whitelist.characters);
    this._whitelist.push(...whitelist.ranges.map((item) => {
      const string: string[] = [];
      let i: number = item[0].codePointAt(0) || -1;
      const len: number = item[1].codePointAt(0) || -1;
      if (i === -1 || len === -1) {
        throw new Error('Whitelist range contains an empty value.');
      }
      for (; i < len; i++) {
        string.push(String.fromCodePoint(i));
      }
      return string;
    }).flat());
  }

  /**
   * Load the local confusables into the character set.
   */
  private loadLocalConfusables(): void {
    const confusables: Confusables = JSON.parse(fs.readFileSync(new URL('../lists/confusablesPackage.json', import.meta.url), 'utf-8'));
    // Add alphabet sets.
    for (let i = 0, c = confusables.alphabetSets, len = c.length; i < len; i++) {
      for (let j = 0, alphabetLen = c[i].alphabet.length; j < alphabetLen; j++) {
        this.addConfusables(
          c[i].alphabet[j],
          ...c[i].characterSet.map((item) => item[j])
        );
      }
    }
    // Add number sets.
    for (let i = 0, c = confusables.numberSet, len = c.length; i < len; i++) {
      for (let j = 0, numberLen = c[i].length; j < numberLen; j++) {
        this.addConfusables(
          String(j),
          c[i][j]
        );
      }
    }
    // Add parallel character set.
    for (let i = 0, c = confusables.parallelCharacterSet, len = c.characterSet.length; i < len; i++) {
      this.addConfusables(
        c.replacementSet[i],
        c.characterSet[i]
      );
    }
    // Add serial character sets.
    for (let i = 0, c = confusables.serialCharacterSets, len = c.length; i < len; i++) {
      this.addConfusables(
        c[i].replacement,
        ...c[i].characterSet
      );
    }
  }

  /**
   * Build the character set.
   */
  public build(): CharacterSet {
    this.refactor();

    // Remove whitelisted characters.
    const keyList = Object.keys(this._characterSet);
    const regex = this._whitelist.length !== 0
      ? new RegExp(this._whitelist.map((item) => regexFormat(item)).join('|'), 'g')
      : undefined;
    for (let i = 0, keyLen = keyList.length; i < keyLen; i++) {
      const key = keyList[i];
      if (regex) {
        this._characterSet[key] = this._characterSet[key].filter((item) => !regex.test(item));
      }
    }

    // Each one character cannot be assigned to multiple keys.
    const duplicates = Object.values(this._characterSet).flat().sort().filter((item, pos, self) => {
      return pos && item === self[pos - 1];
      });
    if (duplicates.length > 0) {
      console.error('[TEMPORARY] Character set contains values assigned to multiple keys: [\'' + duplicates.join("', '") + '\']');
      // TODO: replace error message with throw error once the default confusables are fixed.
      // throw new Error('Character set contains values assigned to multiple keys: [\''
      //   + duplicates.join("', '")) + '\']';
    }

    return new CharacterSet(this._characterSet);
  }
}