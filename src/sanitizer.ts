import { removeDuplicates } from './utils.js';
import fs from 'fs';

type Set = {
  [key: string]: string[]
};

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

/**
 * Use class to 'sanitize' strings.
 */
export class Sanitizer {
  /**
   * Singleton instance.
   */
  private static _instance: Sanitizer;

  /**
   * Cached array of all characterSet keys.
   */
  private readonly keyList: string[]

  /**
   * Cached regular expression that matches with any unwanted character from characterSet.
   */
  private readonly characterRegex: RegExp;

  /**
   * Cached regular expressions to match & link any unwanted character to their replacement character.
   */
  private readonly characterRegexSet: { [key: string]: RegExp };

  /**
   * Private contructor to prevent direct construction calls with the `new` operator.
   */
  private constructor() {
    const characterSet: Set = this.getCharacterSets();
    this.keyList = Object.keys(characterSet);
    this.characterRegex = new RegExp(Object.values(characterSet).flat().join('|'), 'g');
    this.characterRegexSet = {};
    for (let i = 0, len = this.keyList.length; i < len; i++) {
      const key = this.keyList[i]
      this.characterRegexSet[key] = new RegExp(characterSet[key].join('|'), 'g');
    }
  }

  /**
   * Get the Sanitizer Singleton instance.
   */
  public static get instance(): Sanitizer {
    if (!Sanitizer._instance) {
      Sanitizer._instance = new Sanitizer();
    }
    return Sanitizer._instance;
  }

  /**
   * Get all unwanted characters and their preferred character counterpart.
   * @returns Returns character set (map).
   */
  private getCharacterSets(): Set {
    const set: Set = {};

    /**
     * Remove duplicate values per key in the set.
     */
    const cleanSet = () => {
      const keyList = Object.keys(set);
      for (let i = 0, len = keyList.length; i < len; i++) {
        const key = keyList[i];
        set[key] = removeDuplicates(set[key]);
      }
    }

    /**
     * Add a set of characters to... set.
     * @param key Preferred character.
     * @param values Unwanted character.
     */
    const addCharacters = (key: string, values: string | string[]) => {
      if (key.length === 0 || values.length === 0) {
        throw new Error('Key or values cannot be empty.')
      }
      if (typeof set[key] === 'undefined') {
        set[key] = [];
      }
      set[key].push(...values);
    }
  
    // TODO: load ../lists/confusables.json
    const confusables: Confusables = JSON.parse(fs.readFileSync(new URL('../lists/confusables.json', import.meta.url), 'utf-8'));
    // Add alphabet sets.
    for (let i = 0, c = confusables.alphabetSets, len = c.length; i < len; i++) {
      for (let j = 0, alphabetLen = c[i].alphabet.length; j < alphabetLen; j++) {
        addCharacters(
          c[i].alphabet[j],
          c[i].characterSet.map((item) => item[j])
        );
      }
    }
    // Add number sets.
    for (let i = 0, c = confusables.numberSet, len = c.length; i < len; i++) {
      for (let j = 0, numberLen = c[i].length; j < numberLen; j++) {
        addCharacters(
          String(j),
          c[i][j]
        );
      }
    }
    // Add parallel character set.
    for (let i = 0, c = confusables.parallelCharacterSet, len = c.characterSet.length; i < len; i++) {
      addCharacters(
        c.replacementSet[i],
        c.characterSet[i]
      );
    }
    // Add serial character sets.
    for (let i = 0, c = confusables.serialCharacterSets, len = c.length; i < len; i++) {
      addCharacters(
        c[i].replacement,
        c[i].characterSet
      );
    }
  
    // Load Unicode.org's ../lists/confusables.txt
    fs.readFileSync(new URL('../lists/confusables.txt', import.meta.url), 'utf-8')
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
        addCharacters(key, values);
      });
    cleanSet();
    
    // Move values from a key to another key if that key is found as value in another key.
    let keyList: string[] = Object.keys(set);
    for (let i = 0, len = keyList.length; i < len; i++) {
      if (i === 77) {
        console.log('arrived');
      }
      for (let j = 0; j < len; j++) {
        const key: string = keyList[i];
        const value: string = keyList[j];
        const index: number = set[key].indexOf(value);
        if (index === -1) {
          continue;
        }
        if (key === value) {
          set[key].splice(index, 1);
        }
        else {
          set[key].concat(set[value]);
          delete set[value];
          keyList = Object.keys(set);
          len--;
        }
      }
    }
    cleanSet();
  
    // Test for values assigned to multiple keys.
    const duplicates = Object.values(set).flat().sort().filter((item, pos, self) => {
      return pos && item === self[pos - 1];
      });
    if (duplicates.length > 0) {
      console.error('[TEMPORARY] Character set contains values assigned to multiple keys: [\'' + duplicates.join("', '") + '\']');
      // throw new Error('Character set contains values assigned to multiple keys: [\''
      //   + duplicates.join("', '")) + '\']';
    }
  
    return set;
  }

  /**
   * Remove unwanted characters from a string.
   * @param string String to sanitize: remove unwanted characters.
   * @returns Sanitized string.
   */
  public sanitize(string: string): string {
    if (!this.characterRegex.test(string)) {
      return string;
    }
    for (const key in this.keyList) {
      string.split(this.characterRegexSet[key]).join(key);
    }
    return string;
  }
}