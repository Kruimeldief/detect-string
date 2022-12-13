import type { BSTBuilderOptions, WhitelistOptions } from '../../types.js';
import { BSTBuilder } from '../binarySearchTreeBuilder.js';
import { Whitelist } from './whitelist.js';

export class WhitelistBuilder extends BSTBuilder<Whitelist> {

  /**
   * Constructor.
   */
  public constructor(options?: WhitelistOptions) {
    super(options as BSTBuilderOptions);
  }

  public build(): Whitelist {
    const trees = this.buildTrees();
    return new Whitelist(trees.strings, trees.rates);
  }
}