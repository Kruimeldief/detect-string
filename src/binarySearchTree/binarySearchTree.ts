import { OrderOptions, Node } from "../types.js";

export abstract class BST {
  /**
   * String tree nodes.
   */
  private readonly _strings: string[];

  /**
   * Rate tree nodes.
   */
  private readonly _rates: number[];

  /**
   * Constructor.
   */
  protected constructor(strings: string[], rates: number[]) {
    this._strings = strings;
    this._rates = rates;
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

  public search(string: string): Node | undefined {
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
        } as Node;
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