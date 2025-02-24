import { Node } from './index.ts';

export abstract class BaseElement {
  public children: Node[] = [];

  protected constructor(public readonly tag: string) {}

  public getHtml(): string {
    return `<${this.tag}>${this.children.map((n) => n.getHtml()).join('')}</${this.tag}>`;
  }
}
