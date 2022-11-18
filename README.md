# detect-string

Create a filter to scan strings for bad language. This package distinguishes itself from other filter packages by (1) its extended components, (2) plug-and-play interface and (3) pre-building any data to improve scan performance.

This is a work in progress. It has yet to distinguish itself from other filter package. But each commit is a step closer. The README will be centered around functionalities and basic examples while it's a work in progress.

##### Highlights

- Scan a string for bad languages.
  - User can define the wordlist and numeric categories.
  - Scan returns a purified word and its match with the bad language.
- Applied [Builder design pattern](https://refactoring.guru/design-patterns/builder) and [Facade structural pattern](https://refactoring.guru/design-patterns/facade) to allow for user friendly interaction with the package.
- Use options (optional object properties) to customise the filter in detail.

##### Upcoming features

- Apply a `slicer()` to the string before the scan.
- Allow custom regex tests for each BST Node in a scan.
  - Improve performance by pre-building regex-ed BST words into a nested string array.
- Allow substitution characters for each slice at the cost of an immensely lower scan performance.
- Add a whitelist to prevent false positive scan results.
  - Show intersection of the wordlist and whitelist during the `build()`.
- Add a default list of English profanity.
- Don't ship the default list but `fetch()` them from this repository at the cost of the internet connection requirement and fetching delay.
- Decouple all features when possible and expose them through the facade pattern.

##### Optimalisations

- Store one rating (number) if all listed words have the same rating.
- Perhaps refactor facade `Filter` to their respective classes to improve performance, but at the cost of user friendliness.

## Install

This package is not available on `npm` or `yarn` (or `bower`?). This is my first Typescript project so I don't have any reference to how long it takes for me to implement the aforementioned features (and more). I want to write an adequate package before publishing.

You can clone this repository and transpile the TypeScript to JavaScript. Make sure to have installed [Yarn](https://yarnpkg.com/getting-started/install) and [Node.js](https://nodejs.org/en/) on your system. Open the command prompt in the root folder and run the command below. The JavaScript files appear in `%rootdir%/dist/`.
```sh
yarn && yarn build
```

## Example

```Typescript
import { BinarySearchTreeBuilder } from './bst/binarySearchTreeBuilder';

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