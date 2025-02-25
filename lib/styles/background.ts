import { Style } from './style.ts';

export class Background extends Style {
  public constructor(color: string) {
    super('background-color', color);
  }

  public static fromAttr(value: unknown): Background {
    if (typeof value !== 'string') {
      throw new Error('Background must be a string.');
    }
    return new Background(value);
  }
}
