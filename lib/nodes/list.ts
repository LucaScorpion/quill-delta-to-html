import { BlockElement } from './base.ts';

type ListType = 'ordered' | 'bullet';

export class List extends BlockElement {
  public constructor(list: ListType) {
    super(`${list === 'ordered' ? 'o' : 'u'}l`);
  }

  public static fromAttr(value: unknown): List {
    if (
      typeof value !== 'string' ||
      (value !== 'ordered' && value !== 'bullet')
    ) {
      throw new Error('List attribute must specify a valid list type.');
    }
    return new List(value);
  }
}
