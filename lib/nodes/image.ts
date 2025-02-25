import { Element } from './element.ts';

export class Image extends Element {
  public constructor(src: string) {
    super('img');
    this.attributes.src = src;
  }
}
