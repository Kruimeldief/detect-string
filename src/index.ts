import { BinarySearchTreeBuilder } from "./binarySearchTreeBuilder.js";

/**
 * Examples
 */

// BSTBuilder.
const tree = new BinarySearchTreeBuilder({sanitizeOptions: {}})
  .add([
    'pancake', 'candy', 'cookie', 'chocolate',
    'cupcake', 'pie', 'pastry', 'ice cream',
    'dessert', 'cake', 'doughnut', 'muffin'
  ], 3)
  .add([
    'mushroom', 'cucumber', 'leek', 'onion',
    'beet', 'spinach', 'broccoolii', 'corn',
    'yam', 'tomato', 'pumpkin', 'asparagus',
  ], 7)
  .add('pancake', 4, 'overwrite')
  .remove('mushroom')
  .add('pink mushroom') // No rate => use default 0
  .build();

console.log(tree.search('pancake'));
// Prints { hasMatch: true, match: 'pancake', rate: 4, sanitized: 'pancake' }

console.log(tree.search('chocolate'));
// Prints { hasMatch: true, match: 'chocolate', rate: 3, sanitized: 'chocolate' }

console.log(tree.search('pink mushroom'));
// Prints { hasMatch: true, match: 'pink mushroom', rate: 0, sanitized: 'pink mushroom' }

console.log(tree.search('abc123')); // Never added
console.log(tree.search('mushroom')); // Added and removed
// Both print { hasMatch: false }