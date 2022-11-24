import type { Purifier } from "./characterSetBuilder.js";

/** 
 * @source https://stackoverflow.com/questions/65805600/type-union-not-checking-for-excess-properties#answer-65805753
 * Modified by Kruimeldief.
 */
type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnion<T> = T extends any
  ? T & Partial<Record<Exclude<UnionKeys<T>, keyof T>, never>>
  : never;
/* End of source */
type EnumTypeHelper<Enum, T, Keys extends keyof Enum = keyof Enum> = Partial<Record<Keys, T>>
type EnumType<Enum, T> = StrictUnion<EnumTypeHelper<Enum, T>>

/* Constructor options */
export type RateOption = 'overwrite' | 'useLowest' | 'useHighest' | 'skip' | 'throwError';
type PurifyOption = 'allow' | 'purify' | 'remove';
type IncludeOption = 'include' | 'exclude';
export type UnicodeOptions = EnumType<typeof Purifier, PurifyOption>;
export type CSBOptions = ConfusableOptions & UnicodeOptions;
export type FilterOptions = BSTBaseBuilderOptions & CSBOptions;
export type BSTBaseBuilderOptions = { // Binary Search Tree Builder Options
  doubleRating?: RateOption
}
export type ProfanityOptions = BSTBaseBuilderOptions & {
  defaultProfanityList?: IncludeOption,
}
export type ConfusableOptions = {
  confusablesByUnicode?: IncludeOption,
  confusablesByPackage?: IncludeOption,
}

/* Multi-use types */
export type Match = {
  string: string,
  rate: number,
}
export type TreeLists = {
  strings: string[],
  rates: number[],
}