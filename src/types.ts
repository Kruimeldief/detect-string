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
export type PurifyOptions = EnumType<typeof Purifier, PurifyOption>;

export type RateOption = 'overwrite' | 'useLowest' | 'useHighest' | 'skip' | 'throwError';
export type ascdesOption = 'ascending' | 'descending';
export type OrderOptions = {
  orderByCodePoint?: ascdesOption,
  orderByRate?: ascdesOption,
  orderByLength?: ascdesOption,
}
type IncludeOption = 'include' | 'exclude';
type PurifyOption = 'allow' | 'purify' | 'remove';

/* Constructor options */
export type FilterBuilderOptions = 
  & ProfanityOptions
  & ConfusablesOptions
  & FilterOptions;
export type FilterOptions = {
  sliceSize?: number
}
export type ConfusablesOptions = 
  & BSTBuilderOptions
  & PurifyOptions
  & {
    confusablesByUnicode?: IncludeOption,
    confusablesByPackage?: IncludeOption,
  };
export type ProfanityOptions = 
  & BSTBuilderOptions
  & {
    defaultProfanityList?: IncludeOption,
  }
export type BSTBuilderOptions = {
  doubleRating?: RateOption
}
export type WhitelistOptions =
  & BSTBuilderOptions

/* Global types */
export type TreeLists = {
  strings: string[],
  rates: number[],
}
export type Node = {
  string: string,
  rate: number,
}
export type Matches = {
  purified: string,
  matches: Node[],
}
export type PurifierList = ((string: string) => string)[]