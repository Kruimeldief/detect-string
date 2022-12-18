import GraphemeSplitter from "grapheme-splitter";
import { BSTBuilderOptions, ConfusablesOptions } from "../../types";
import { BSTBuilder } from "../binarySearchTreeBuilder";
import { Confusables } from "./confusables";

export class ConfusablesBuilder extends BSTBuilder<Confusables> {

  private _splitter: GraphemeSplitter;

  public constructor(options?: ConfusablesOptions) {
    super(options as BSTBuilderOptions);
    this._splitter = new GraphemeSplitter();
  }

  public build(): Confusables {
    return new Confusables(this.buildTrees().stringTree)
  }

  protected override throwInvalid(character: string): void {
    if (this._splitter.countGraphemes(character) !== 1) {
      throw new Error('Confusable must one grapheme (character).');
    }
  }
}