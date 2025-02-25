import { BaseElement } from './base.ts';

export class Image extends BaseElement {
  public constructor(src: string) {
    super('img');
    this.attributes.src = src;
  }
}
