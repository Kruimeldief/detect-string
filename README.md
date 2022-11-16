# detect-string

Create a filter to detect strings. This is a work in progress. The final product should allow you to detect bad language and look-alikes.

## Install

This package is not yet available.

## Example

```Typescript
import { BinarySearchTreeBuilder } from './bst/binarySearchTreeBuilder';

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
  .remove('mushroom')
  .add('pink mushroom')
  .build();

console.log(tree.search('pancake'));
// Prints { hasMatch: true, match: 'pancake', rate: 3, sanitized: 'pancake' }

console.log(tree.search('pink mushroom'));
// Prints { hasMatch: true, match: 'pink mushroom', rate: 0, sanitized: 'pink mushroom' }

console.log(tree.search('abc123')); // Never added
console.log(tree.search('mushroom')); // Added and removed
// Both print { hasMatch: false }
```