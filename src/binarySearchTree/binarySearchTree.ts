import { OrderOptions, Node } from "../types.js";

export abstract class BST {
  /**
   * String tree nodes.
   */
  protected readonly _strings: string[];

  /**
   * Rate tree nodes.
   */
  protected readonly _rates: number[];

  /**
   * Number of tree nodes.
   */
  protected readonly _size: number;

  /**
   * Constructor.
   */
  protected constructor(strings: string[], rates: number[]) {
    if (strings.length !== rates.length) {
      throw new Error('Array of strings and rates must be of same length.');
    }
    this._strings = strings;
    this._rates = rates;
    this._size = strings.length;
  }

  public getList(options?: OrderOptions): Node[] {
    const length = this._strings.length;
    let list: Node[] = Array<Node>(length);
    for (let i = 0; i < length; i++) {
      list[i] = {
        string: this._strings[i],
        rate: this._rates[i]
      }
    }

    // Default sorting to prevent unnatural bst order.
    const opts: OrderOptions = {
      orderByCodePoint: 'ascending'
    }
    Object.assign(opts, options);

    // Prioritise from bottom to top.
    if (opts.orderByCodePoint) {
      list = list.sort((a, b) => {
        return opts.orderByCodePoint === 'ascending'
          ? a.string.localeCompare(b.string)
          : b.string.localeCompare(a.string)
      })
    }
    if (opts.orderByLength) {
      list = list.sort((a, b) => {
        return opts.orderByLength === 'ascending'
          ? a.string.length - b.string.length
          : b.string.length - a.string.length
      });
    }
    if (opts.orderByRate) {
      list = list.sort((a, b) => {
        return opts.orderByRate === 'ascending'
          ? a.rate - b.rate
          : b.rate - a.rate
      });
    }

    return list;
  }

  public abstract search(string: string): Node[] | Node | undefined;
}