import { BaseElement, BlockElement } from './base.ts';

type ListType = 'ordered' | 'bullet';

export class ListItem extends BaseElement {
  public constructor(public readonly type: ListType) {
    super('li');
  }

  public static fromAttr(value: unknown): ListItem {
    if (
      typeof value !== 'string' ||
      (value !== 'ordered' && value !== 'bullet')
    ) {
      throw new Error('List attribute must specify a valid list type.');
    }
    return new ListItem(value);
  }
}

export class List extends BlockElement {
  public constructor(type: ListType) {
    super(`${type === 'ordered' ? 'o' : 'u'}l`);
    this.newlinesInHtml = true;
  }
}
