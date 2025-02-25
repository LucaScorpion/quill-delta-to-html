import { BlockElement } from './base.ts';
import { Node } from './index.ts';

export class Paragraph extends BlockElement {
  public constructor(children?: Node[]) {
    super('p');
    this.children = children ?? [];
  }
}
