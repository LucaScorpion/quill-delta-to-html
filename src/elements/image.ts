import { Element } from './element';

export class Image extends Element {
  public constructor(src: string) {
    super('img');
    this.attributes.src = src;
  }
}
