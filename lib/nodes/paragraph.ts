import { BlockElement } from './element.ts';
import { Node } from './index.ts';

export class Paragraph extends BlockElement {
  public constructor(children?: Node[]) {
    super('p');
    this.children = children ?? [];
  }
}
