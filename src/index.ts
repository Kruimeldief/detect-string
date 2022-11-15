import { characterSet } from "./sanitizer.js";
import { BinarySearchTreeBuilder } from "./binarySearchTreeBuilder.js";

/**
 * Examples
 */

// Print all substitution characters for character '2'.
console.log(characterSet['2']);
// Prints [
//   'Ƨ', 'Ϩ', 'ᒿ', 'Ꙅ',
//   'ꛯ', 'Ꝛ', '𝟐' , '𝟚' ,
//   '𝟤' , '𝟮' , '𝟸' , '🯲'
// ]

// BSTBuilder.
const tree = new BinarySearchTreeBuilder()
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
console.log(tree.search('cucumber'));
// Prints '3' and '7' respectively.

console.log(tree.search('abc123'));
console.log(tree.search('mushroom'));
// Both print '0' (default) because string is not found.

console.log(tree.search('pink mushroom'));
// Prints '0' (default) because string has no specifieed rating.