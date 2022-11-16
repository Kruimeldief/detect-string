/**
 * Remove any double values in an array.
 * @param array Any type of array.
 * @returns An array without double values.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeDuplicates(array: any[]): any[] {
  return array.sort().filter(((item, pos, self) => {
    return !pos || item !== self[pos - 1];
  }));
}