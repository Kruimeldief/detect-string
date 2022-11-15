export type RateOptions = {
  overwriteRate?: boolean,
  useHighestRate?: boolean
};

export type TreeOptions = {
  sanitize?: boolean,
  sanitizeOptions?: SanitizeOptions
}

/**
 * TODO:
 * - Remove emojis.
 * - Remove numbers and/or change numbers into letters (ideally not limited to latin).
 * - Remove punctuation and/or change punctuation into letters (ideally not limited to latin).
 * - Remove certain type of characters.
 */
export type SanitizeOptions = {
  characters?: boolean,
  emojis?: boolean,
  numbers?: boolean,
  punctuation?: boolean,
  charType?: CharType
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
type CharType = {
  notCharacter?: boolean,
  depreciated?: boolean,
  defaultIgnorable?: boolean,
  notNFKC?: boolean,
  notXID?: boolean,
  exclusion?: boolean,
  obsolete?: boolean,
  technical?: boolean,
  uncommonUse?: boolean,
  limitedUse?: boolean,
  inclusion?: boolean,
  recommended?: boolean
}