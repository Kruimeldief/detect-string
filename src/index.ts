import { FilterBuilder } from './filter.js';

/**
 * Examples
 */

const filter = new FilterBuilder({
  confusablesByPackage: 'include',
  confusablesByUnicode: 'exclude',
  confusables: 'purify',
  doubleRating: 'overwrite',
  emojis: 'allow'
})
  .add([
    'pancake', 'candy', 'cookie', 'chocolate',
    'cupcake', 'pie', 'pastry', 'ice cream',
    'dessert', 'cake', 'doughnut', 'muffin'
  ], 1)
  .add([
    'mushroom', 'cucumber', 'leek', 'onion',
    'beet', 'spinach', 'broccoolii', 'corn',
    'yam', 'tomato', 'pumpkin', 'asparagus',
  ], 2)
  .add('pancake', 3, 'overwrite')
  .remove('mushroom')
  .add('pink mushroom') // No rate => use default 0
  .build();

console.log(filter.scan('pancake'));
// Prints { purified: 'pancake', matches: [ { string: 'pancake', rate: 3 } ] }

console.log(filter.scan('chocolate'));
// { purified: 'chocolate', matches: [{ string: 'chocolate', rate: 1 }] }

console.log(filter.scan('pink mushroom'));
// Prints { purified: 'pink mushroom', matches: [{ string: 'pink mushroom', rate: 0 }] }

console.log(filter.scan('abc123')); // Never added
console.log(filter.scan('mushroom')); // Added and removed
// Both print { purified: 'abc123', matches: [] }