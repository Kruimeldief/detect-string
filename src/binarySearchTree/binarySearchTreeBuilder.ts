// import type { BSTBOptions, BSTBBOptions } from '../options.js';
// import fs from 'fs';
// import { BSTBBuilder } from './binarySearchTreeBase.js';

// /**
//  * Return object for BinarySearchTree.search() function.
//  */
// export type Match = {
//   string: string,
//   rate: number,
// }

// type ProfanityJSON = {
//   sentences: {
//     rate: number,
//     separator: string,
//     variations: string[][]
//   }[],
//   words: {
//     rate: number,
//     strings: string[]
//   }[]
// }

// export class BST {
//   /**
//    * String tree nodes.
//    */
//   public readonly strings: string[];

//   /**
//    * Rate tree nodes.
//    */
//   public readonly rates: number[];

//   /**
//    * Constructor.
//    */
//   public constructor(strings: string[], rates: number[]) {
//     this.strings = strings;
//     this.rates = rates;
//   }

//   /**
//    * Search a string in the binary search tree.
//    * @param string Input string.
//    * @returns Informative object.
//    */
//   public search(string: string): Match | undefined {
//     let i = 1;
//     while (i <= this.strings.length) {
//       const compare = this.strings[i - 1]?.localeCompare(string);
//       if (typeof compare === 'undefined') {
//         return;
//       }
//       if (compare === 0) {
//         return {
//           string: this.strings[i - 1],
//           rate: this.rates[i - 1]
//         } as Match;
//       }
//       if (compare < 0) {
//         i = i * 2 + 1;
//       }
//       else {
//         i = i * 2;
//       }
//     }
//     return;
//   }
// }

// export class BSTBuilder extends BSTBBuilder {

//   /**
//    * Constructor.
//    */
//   constructor(options?: BSTBOptions) {
//     super(options as BSTBBOptions);
//     const opts: BSTBOptions = {
//       defaultProfanityList: 'include'
//     };
//     Object.assign(opts, options);
//     if (opts.defaultProfanityList === 'include') {
//       this.loadProfanityList();
//     }
//   }

//   private loadProfanityList(): void {
//     const list: ProfanityJSON = JSON.parse(fs.readFileSync(new URL('../lists/profanity.json', import.meta.url), 'utf-8'));
//     let sentences: string[] = [];

//     // Build-up the variations from the sentences.
//     for (let i = 0, len = list.sentences.length; i < len; i++) {
//       const obj = list.sentences[i];
//       sentences = obj.variations[0];
//       for (let j = 1, len = obj.variations.length; j < len; j++) {
//         sentences = sentences.flatMap((str1) => {
//           return obj.variations[j].map((str2) => {
//             return (str1 + obj.separator + str2).trimEnd();
//           });
//         });
//       }
//       sentences = sentences.map((string) => string.replace(/(\s)\1+/g, '$1'));

//       // Add sentences.
//       for (let i = 0, len = sentences.length; i < len; i++) {
//         this.add(sentences, obj.rate);
//       }
//     }
//   }

//   public override build() {
//     super();
    
//   }
// }