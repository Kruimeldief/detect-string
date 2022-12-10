// import { ConfusablesOptions } from "../../types";
// import { BSTBaseBuilder } from "../binarySearchTreeBaseBuilder";
// import { Confusables } from "./confusables";

// export type ConfusablesSet = Record<string, string[]>;
// type RegexSet = Record<string, RegExp>;

// /**
//  * Interface for JSON file /root/lists/confusables.json
//  */
// interface ConfusablesJSON {
//     alphabetSets: {
//       alphabet: string[],
//       characterSet: string[][]
//     }[],
//     numberSet: string[][],
//     parallelCharacterSet: {
//       replacementSet: string[],
//       characterSet: string[],
//     },
//     serialCharacterSets: {
//       replacement: string,
//       characterSet: string[]
//     }[]
//   }
  
//   interface Whitelist {
//     ranges: string[][],
//     characters: string[]
//   }

// export class ConfusablesBuilder extends BSTBaseBuilder<Confusables> {

//   private readonly _options: ConfusablesOptions;

//   private _confusables: ConfusablesSet;

//   private _whitelist: string[];

//   public constructor(options?: ConfusablesOptions) {
//     super(options);
//     this._options = {
//       confusablesByUnicode: 'exclude',
//       confusablesByPackage: 'include',
//       confusables: 'purify',
//       // emojis: 'allow'
//     };
//   }

//   public build(): Confusables {
    
//     return new Confusables([], []);
//   }

// }