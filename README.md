# Filter

Create a filter to scan strings for bad language. This package distinguishes itself from other filter packages by (1) its extended components, (2) plug-and-play interface and (3) pre-building any data to improve scan performance. The filter is tested with the English alphabet and profanity, but should work for any language if you provide your own lists.

This is a work in progress. It has yet to distinguish itself from other filter package. But each commit is a step closer. The README will be centered around functionalities and basic examples while it's a work in progress.

#### Highlights

- Scan a string for bad languages.
  - User can define the wordlist and numeric categories.
  - Scan returns a purified word and its match with the bad language.
- Applied [Builder design pattern](https://refactoring.guru/design-patterns/builder) and [Facade structural pattern](https://refactoring.guru/design-patterns/facade) to allow for user friendly interaction with the package.
- Use options (optional object properties) to customise the filter in detail.
- Processor friendly for profanity lists of at least 400 words due to its CPU usage on logmarictic (base 2) scale.
  - Package provides a default profanity list of >>>N<<< strings: >>>N<<< words and >>>N<<< word variations.

#### Upcoming features

1. (DONE) Apply a `slicer()` to the string before the scan.
2. Allow custom regex tests for each BST Node in a scan.
   - Improve performance by pre-building regex-ed BST words into a nested string array.

3. (TO TEST) Add a whitelist to prevent false positive scan results.
   - Show intersection of the wordlist and whitelist during the `build()`.
4. Add a default list of English profanity.
5. Don't ship the default list but `fetch()` them from this repository at the cost of the internet connection requirement and fetching delay.
6. (PROGRESS) Decouple all features when possible and expose them through the facade pattern.
7. Add documentation.
8. Add option `readThroughAll` to create a regex of the [wordlist in ascending length] to apply to the string.
9. Add a minimum length option to which (variations of) bad language must adhere.
10. Wordlist searches itself with `new RegExp('\\b' + strings.join('|') + '\\b')` for bad language to remove redundant strings.
   - Example: 'ass' removes 'ass hair' because if 'ass hair' matches the string, so does 'ass'.
   - Consider removing  such strings only of the rate is the same. Different rates may be used for profanity categories or separate lists.
   - Pre-build such a regex for `readThroughAll` [9.] too.
11. Expose wordlist to user with options `{ byCodePoint?: 'asc' | 'dec', byRating?: 'asc' | 'dec', stringLength?: 'asc' | 'dec' } as SortType`.
12. Use BST for purifying as well (keyList & valueList) and iterate through strings using BST.search().
   - Make a base BST to extent.
13. Allow any value for a rate. Store value in any array and use their index (as number) to specify string ratings in the rate aray. Use bit-wise to allow for words to have multiple ratings. Ratings can be used for anything: string severity, word language, dictionary, etc.
14. Add modified-string checks to avoid unnecessary searches.
    - Modified-string should be between min. and max. length of BST strings.
    - ...?

#### Optimalisations

- Store one rating (number) if all listed words have the same rating.
- Perhaps refactor facade `Filter` to their respective classes to improve performance, but at the cost of user friendliness.
- Change `rate` to type `string` and store them in a `rateIdentifiers: array[]`. The index is used for `rates: number[]`.
- Find a way to optimise all regexes. [see 13.]

#### Shelved features

1. Allow substitution characters for each slice.
   - Example: string `bitchez` becomes `bitches` and vica versa.
   - Feature is performance heavy that (up to) squares the processing time per single substitution.
   - Approach:
      - In `Profanity.search()`, create a branch if the substitution character is identical to the same index character of the Node string.
      - Use an object `{ string: string, ti: number, ri: number }[]` from which to start each search.
         - `ti`: tree index to skip previously checked words.
         - `ri`: replacement index to prevent substituting previousl substituted characters.
   - Reason: disadvantages of false positives and performance impact outweighs its advantage of catching filter by-passes.

## Install

This package is not available on `npm` or `yarn` (or `bower`?). I want to write an adequate package before publishing. This is my first Typescript project so I don't have any reference to how long it takes for me to implement the aforementioned features (and more).

You can clone this repository and transpile the TypeScript to JavaScript. Make sure to have installed [Yarn](https://yarnpkg.com/getting-started/install) and [Node.js](https://nodejs.org/en/) on your system. Open the command prompt in the root folder and run the command below. The JavaScript files appear in `%rootdir%/dist/`.
```sh
yarn && yarn build
```

## Example

```Typescript
/**
 * File: "%rootdir%/src/index.js"
 * Use package name import once this package is published.
 */
import { FilterBuilder } from './filter.js';

// Build the filter before use.
const filter = new FilterBuilder()
  .add([
    'pancake', 'candy', 'cookie', 'pudding',
    'cupcake', 'pie', 'pastry', 'ice cream',
    'dessert', 'cake', 'doughnut', 'muffin',
  ], 1)
  .add([
    'mushroom', 'cucumber', 'leek', 'onion',
    'beet', 'spinach', 'broccoli', 'celery',
    'yam', 'tomato', 'pumpkin', 'asparagus',
  ], 2)
  .add('pancake', 3, 'overwrite')
  .remove('mushroom')
  .add('pink mushroom') // No rate => use default 0
  .build();

console.log(filter.scan('chocolate'));
// Prints { purified: 'chocolate', matches: [{ string: 'chocolate', rate: 1 }] }

console.log(filter.scan('pancake'));
// Prints { purified: 'pancake', matches: [{ string: 'pancake', rate: 3 }] }

console.log(filter.scan('pink mushroom'));
// Prints { purified: 'pink mushroom', matches: [{ string: 'pink mushroom', rate: 0 }] }

console.log(filter.scan('abc123')); // Never added
console.log(filter.scan('mushroom')); // Added and removed
// Both print { purified: 'abc123', matches: [] }
```