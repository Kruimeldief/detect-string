import { Node } from "../../types.js";
import { BST } from "../binarySearchTree.js";

interface Log {
  str: string, // String modified with replacement characters.
  ti: number, // Index of start in the tree arrays.
  ci: number, // Index of last replacement in the string.
}

export class Profanity extends BST {

  private readonly _replacements: [string, string][];

  /**
   * Constructor.
   */
  public constructor(strings: string[], rates: number[], replacements: [string, string][]) {
    super(strings, rates);
    this._replacements = replacements;
  }

  public override search(string: string): Node[] {
    let backlog: Log[] = [];
    let matches: Node[] = [];
    let log: Log | undefined = { str: string, ti: 1, ci: 0 };
    while (log) {

      let i = log.ti;
      while (i <= this._size) {
        const nodeString: string = this._strings[i - 1];
        const inputString: string = log.str;

        // Mimmick String.prototype.localeCompare but return index of chance.
        if (inputString === nodeString) {
          matches.push({
            string: nodeString,
            rate: this._rates[i - 1]
          } as Node);
          break;
        }
        // c = character & i = index in string
        let ci: number = log.ci;
        for (let c: string = inputString[ci]; c === nodeString[ci]; c = inputString[ci++]) {
          const ri: number = this._replacements.findIndex(v => v[0] === c);
          if (ri !== -1) {
            backlog.push({
              str: inputString.slice(0, ci) + this._replacements[ri][1] + inputString.slice(ci + 1),
              ti: i,
              ci: ci
            });
          }
        }

        if (inputString[ci] > nodeString[ci]) {
          i = i * 2 + 1;
        }
        else {
          i = i * 2;
        }
      }

      log = backlog.pop();
    }
    return matches;
  }
}