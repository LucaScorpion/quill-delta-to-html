import { Style } from './style.ts';

export class Color extends Style {
  public constructor(color: string) {
    super('color', color);
  }

  public static fromAttr(value: unknown): Color {
    if (typeof value !== 'string') {
      throw new Error('Color must be a string.');
    }
    return new Color(value);
  }
}
