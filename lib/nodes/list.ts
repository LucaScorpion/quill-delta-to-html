import { LineAttributes } from '../delta.ts';
import { BaseElement } from './base.ts';

type ListType = 'ordered' | 'bullet';

export class List extends BaseElement {
  public constructor(
    list: ListType,
    private readonly indent = 0,
  ) {
    super(`${list === 'ordered' ? 'o' : 'u'}l`);
  }

  public static fromAttr(value: unknown, attrs: LineAttributes): List {
    if (
      typeof value !== 'string' ||
      (value !== 'ordered' && value !== 'bullet')
    ) {
      throw new Error('List attribute must specify a valid list type.');
    }
    return new List(value, attrs.indent);
  }
}
