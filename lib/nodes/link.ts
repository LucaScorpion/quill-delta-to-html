import { BaseElement } from './base.ts';

export class Link extends BaseElement {
  public constructor(link: string) {
    super('a');
    this.attributes.href = link;
  }

  public static fromAttr(value: unknown): Link {
    if (typeof value !== 'string') {
      throw new Error('Link attribute must be a string.');
    }
    return new Link(value);
  }
}
