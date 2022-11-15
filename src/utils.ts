export function removeDuplicates(array: Array<any>) {
  return array.sort().filter(((item, pos, self) => {
    return !pos || item !== self[pos - 1];
  }));
}