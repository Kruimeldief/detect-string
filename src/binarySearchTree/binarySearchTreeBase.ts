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
}