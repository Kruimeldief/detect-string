import type { BSTBuilderOptions, WhitelistOptions } from '../../types.js';
import { BSTBuilder } from '../binarySearchTreeBuilder.js';
import { Whitelist } from './whitelist.js';

export class WhitelistBuilder extends BSTBuilder<Whitelist> {

  public constructor(options?: WhitelistOptions) {
    super(options as BSTBuilderOptions);
  }

  public build(): Whitelist {
    return new Whitelist(this.buildTrees().stringTree);
  }
}