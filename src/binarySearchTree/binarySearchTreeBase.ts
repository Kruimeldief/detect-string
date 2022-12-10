import { Match } from "../types.js";

export class BSTBase {
  /**
   * String tree nodes.
   */
  public readonly _strings: string[];

  /**
   * Rate tree nodes.
   */
  public readonly _rates: number[];

  /**
   * Constructor.
   */
  public constructor(strings: string[], rates: number[]) {
    this._strings = strings;
    this._rates = rates;
  }

  protected get(string: string): Match | undefined {
    let i = 1;
    while (i <= this._strings.length) {
      const compare = this._strings[i - 1]?.localeCompare(string);
      if (typeof compare === 'undefined') {
        return;
      }
      if (compare === 0) {
        return {
          string: this._strings[i - 1],
          rate: this._rates[i - 1]
        } as Match;
      }
      if (compare < 0) {
        i = i * 2 + 1;
      }
      else {
        i = i * 2;
      }
    }
    return;
  }
}