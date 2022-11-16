/**
 * Specify the rate of a string if the string already exists.
 * @argument overwrite Overwrite the existing rate of a string if string already exists.
 * @argument useLowest Use the lowest rate of a string if string already exists.
 * @argument useHighest Use the highest rate of a string if string already exists.
 * @argument skip Use the original rate of a string if string already exists.
 */
export type RateOption = 'overwrite' | 'useLowest' | 'useHighest' | 'skip';

/**
 * Options for the binary search tree builder.
 * @param priority Prioritize a system aspect.
 * @param rateOption Specify the rate of a string if the string already exists.
 * @param sanitizeOptions Modify the return string to specifications.
 * @param searchOptions Modify the string for search in the binary search tree.
 */
export type TreeOptions = {
  priority?: 'memory' | 'cpu', // Among other things, pre-initialising lists in sanitizer.js.
  rateOption?: RateOption,
  sanitizeOptions?: StringOptions,
  searchOptions?: StringOptions,
}

/**
 * Options for string modification.
 * @param confusables Uncommon characters that look similar to more commonly used characters.
 * @param emojis All emojis including symbols such as ☺ ☻ ♥ ♦ ♣ ♠.
 * @param numbers Any Arabic numerals that may be used as letters such as f00.
 * @param punctuation Any common punctuation in the English language. May add unicode support.
 * @param casing Force a casing on the characters.
 * @argument allow Allow the type of characters.
 * @argument remove Remove the type of characters.
 * @argument latinize Replace the type of characters each with their corresponding confusable latin character.
 * @argument original Keep the original casing of all characters whether lower- or uppercase.
 * @argument lowercase Change all characters to lowercase if possible.
 * @argument uppercase Change all characters to uppercase if possible.
 */
type StringOptions = {
  confusables?: 'allow' | 'remove',
  emojis?: 'allow' | 'remove' | 'latinize',
  numbers?: 'allow' | 'latinize',
  punctuation?: 'allow' | 'remove' | 'latinize',
  casing?: 'original' | 'lowercase' | 'uppercase',
}

/**
 * @link https://www.unicode.org/Public/security/latest/IdentifierType.txt
 * @link Explanation http://www.unicode.org/reports/tr39/
 * 
 * Not_Character:     Unassigned characters, private use characters, surrogates, non-whitespace
 *                    control characters.
 * Deprecated:  	    Characters with the Unicode property Deprecated=Yes.
 * Default_Ignorable: Characters with the Unicode property Default_Ignorable_Code_Point=Yes.
 * Not_NFKC:        	Characters that cannot occur in strings normalized to NFKC.
 * Not_XID:         	Characters that do not qualify as default Unicode identifiers; that is,
 *                    they do not have the Unicode property XID_Continue=True.
 * Exclusion:       	Characters with Script_Extensions values containing a script in Table 4,
 *                    Excluded Scripts from [UAX31], and no script from Table 7, Limited Use
 *                    Scripts or Table 5, Recommended Scripts, other than “Common” or “Inherited”.
 * Obsolete:        	Characters that are no longer in modern use, or that are not commonly used
 *                    in modern text.
 * Technical:       	Specialized usage: technical, liturgical, etc.
 * Uncommon_Use:     	Characters that are uncommon, or are limited in use (even though they are in
 *                    scripts that are not "Limited_Use"), or whose usage is uncertain.
 * Limited_Use:     	Characters from scripts that are in limited use: with Script_Extensions
 *                    values containing a script in Table 7, Limited Use Scripts in [UAX31], and
 *                    no script from Table 5, Recommended Scripts, other than “Common” or “Inherited”.
 * Inclusion:       	Exceptionally allowed characters, including Table 3a, Optional Characters for
 *                    Medial and Table 3b, Optional Characters for Continue in [UAX31], and some
 *                    characters for [IDNA2008], except for certain characters that are Restricted
 *                    above.
 * Recommended:     	Characters from scripts that are in widespread everyday common use: with
 *                    Script_Extensions values containing a script in Table 5, Recommended Scripts
 *                    in [UAX31], except for those characters that are Restricted above.
 */
// type CharType = {
//   notCharacter?: 'allow' | 'remove',
//   depreciated?: 'allow' | 'remove',
//   defaultIgnorable?: 'allow' | 'remove',
//   notNFKC?: 'allow' | 'remove',
//   notXID?: 'allow' | 'remove',
//   exclusion?: 'allow' | 'remove',
//   obsolete?: 'allow' | 'remove',
//   technical?: 'allow' | 'remove',
//   uncommonUse?: 'allow' | 'remove',
//   limitedUse?: 'allow' | 'remove',
//   inclusion?: 'allow' | 'remove',
//   recommended?: 'allow' | 'remove'
// }

