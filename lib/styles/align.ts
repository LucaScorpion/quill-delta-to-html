import { Style } from './style.ts';

type AlignType = 'left' | 'center' | 'right' | 'justify';

export class Align extends Style {
  public constructor(align: AlignType) {
    super('text-align', align);
  }

  public static fromAttr(value: unknown): Align {
    if (
      value !== 'left' &&
      value !== 'center' &&
      value !== 'right' &&
      value !== 'justify'
    ) {
      throw new Error('Align value must specify a valid type.');
    }
    return new Align(value);
  }
}
