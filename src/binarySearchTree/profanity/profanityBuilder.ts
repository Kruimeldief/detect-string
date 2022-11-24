import type { ProfanityOptions, BSTBaseBuilderOptions } from '../../types.js';
import fs from 'fs';
import { BSTBaseBuilder } from '../binarySearchTreeBaseBuilder.js';
import type { Profanity } from './profanity.js';

type ProfanityJSON = {
  sentences: {
    rate: number,
    separator: string,
    variations: string[][]
  }[],
  words: {
    rate: number,
    strings: string[]
  }[]
}

export class ProfanityBuilder extends BSTBaseBuilder<Profanity> {

  /**
   * Constructor.
   */
  constructor(options?: ProfanityOptions) {
    super(options as BSTBaseBuilderOptions);
    const opts: ProfanityOptions = {
      defaultProfanityList: 'include'
    };
    Object.assign(opts, options);
    if (opts.defaultProfanityList === 'include') {
      this.loadProfanityList();
    }
  }

  private loadProfanityList(): void {
    const list: ProfanityJSON = JSON.parse(fs.readFileSync(new URL('../lists/profanity.json', import.meta.url), 'utf-8'));
    let sentences: string[] = [];

    // Build-up the variations from the sentences.
    for (let i = 0, len = list.sentences.length; i < len; i++) {
      const obj = list.sentences[i];
      sentences = obj.variations[0];
      for (let j = 1, len = obj.variations.length; j < len; j++) {
        sentences = sentences.flatMap((str1) => {
          return obj.variations[j].map((str2) => {
            return (str1 + obj.separator + str2).trimEnd();
          });
        });
      }
      sentences = sentences.map((string) => string.replace(/(\s)\1+/g, '$1'));

      // Add sentences.
      for (let i = 0, len = sentences.length; i < len; i++) {
        this.add(sentences, obj.rate);
      }
    }
  }
}