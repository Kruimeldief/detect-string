export class BinarySearchTree {
  readonly strings: string[];
  readonly rates: number[];

  /**
   * Constructor.
   */
  constructor(strings: string[], rates: number[]) {
    this.strings = strings;
    this.rates = rates;
  }

  search(string: string) {
    let i = 1;
    while (i <= this.strings.length) {
      const compare = this.strings[i - 1]?.localeCompare(string);
      if (typeof compare === 'undefined') {
        return 0;
      }
      else if (compare < 0) {
        i = i * 2 + 1;
      }
      else if (compare > 0) {
        i = i * 2;
      }
      else {
        return this.rates[i - 1];
      }
    }
    return 0;
  }
}