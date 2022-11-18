import type { Purifier } from "./characterSetBuilder.js";

export type RateOption = 'overwrite' | 'useLowest' | 'useHighest' | 'skip' | 'throwError';
type PurifyOption = 'allow' | 'purify' | 'remove';
type includeOption = 'include' | 'exclude';

/**
 * @source https://stackoverflow.com/questions/65805600/type-union-not-checking-for-excess-properties#answer-65805753
 * @author https://stackoverflow.com/users/125734/titian-cernicova-dragomir
 * Modified by Kruimeldief.
 * eslint-disable @typescript-eslint/no-explicit-any
 */
type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnion<T> = T extends any
  ? T & Partial<Record<Exclude<UnionKeys<T>, keyof T>, never>>
  : never; 
type EnumTypeHelper<Enum, T, Keys extends keyof Enum = keyof Enum> = Partial<Record<Keys, T>>
type EnumType<Enum, T> = StrictUnion<EnumTypeHelper<Enum, T>>
/* eslint-enable */

export type UnicodeOptions = & EnumType<typeof Purifier, PurifyOption>;
export type ObjectKey<T> = keyof T ;

export type BSTBOptions = {
  doubleRating?: RateOption,
}

export type ConfusablesOptions = {
  confusablesByUnicode?: includeOption,
  confusablesByPackage?: includeOption
}

export type CSBOptions = ConfusablesOptions & UnicodeOptions
export type FilterOptions = BSTBOptions & CSBOptions;