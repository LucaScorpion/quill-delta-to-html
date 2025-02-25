import { Element, BlockElement } from './element.ts';
import { Node } from './index.ts';

type ListType = 'ordered' | 'bullet';

export class ListItem extends Element {
  public constructor(public readonly type: ListType) {
    super('li');
  }

  public static fromAttr(value: unknown): ListItem {
    if (value !== 'ordered' && value !== 'bullet') {
      throw new Error('List attribute must specify a valid list type.');
    }
    return new ListItem(value);
  }

  public canAppendChild(node: Node): boolean {
    return node instanceof ListItem;
  }
}

export class List extends BlockElement {
  public constructor(type: ListType) {
    super(`${type === 'ordered' ? 'o' : 'u'}l`);
    this.newlinesInHtml = true;
  }
}
