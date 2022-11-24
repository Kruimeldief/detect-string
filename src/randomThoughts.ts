const list: string[] = [
  'boob',
  'bobs',
  'booby',
  'boobs'
];

const boob: Record<string, ([string, object] | boolean)[]> = {
  y: [true],
  s: [true]
}

const bob: Record<string, ([string, object] | boolean)[]> = {
  s: [true]
}

const boo: Record<string, ([string, object] | boolean)[]> = {
  b: [['b', boob], true]
}

const bo: Record<string, ([string, object] | boolean)[]> = {
  o: [['o', boo], ['b', bob]]
}

const start: Record<string, ([string, object] | boolean)[]> = {
  b: [['o', bo]]
}

//                     'boobbobsboobyboobs' => 10 compressed, 18 uncompressed
const string: string = 'bobobsbys';
const steps:  string = '122310100'; // steps forward to next set.
const index:  string = '12 3 112 '; // Set lengths: how many next characters to check.
/**                     |||||||||
 *    Find              ||||||||└- Next letter in set.        Letter 's' found.
 *        word          |||||||└-- Current set is length 2.   Letter 's' not found. Go to next letter in set.
 *            boobs     ||||||└--- Current set is length 1. + Letter 'b' found. Go 1 steps forward.
 *                      |||||└---- 
 *                      ||||└----- 
 *                      |||└------ Current set is length 3. + Letter 'o' found. Go 3 steps forward.
 *                      ||└------- 
 *                      |└-------- Current set is length 2. + Letter 'o' found. Go 2 steps forward.
 *                      └--------- Current set is length 1. + letter 'b' found. Go 1 steps forward.
 * Ideas:
 * - Index string is not needed if you order each set on CodePoint.
 *   If the next character has a lower value, it's a new set thus the word is not in the string.
 * 
 */

// function search(string: string): boolean {
//   let obj = start;
//   let found = false;
//   let index = 0;
//   while (!found) {
//     const nextObj = obj[index];
//     if (nextObj && typeof nextObj === 'object') {
//       obj = nextObj
//     }
//   }

//   return false;
// }

