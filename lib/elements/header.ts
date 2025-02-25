import { BlockElement } from './element.ts';

export class Header extends BlockElement {
  public constructor(header: number) {
    super(`h${header}`);
  }

  public static fromAttr(value: unknown): Header {
    if (typeof value !== 'number' || value <= 0 || value > 6) {
      throw new Error('Header attribute must be a number between 0 and 6.');
    }
    return new Header(value);
  }
}
