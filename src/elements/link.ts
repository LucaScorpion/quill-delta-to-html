import { Element } from './element';

export class Link extends Element {
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
