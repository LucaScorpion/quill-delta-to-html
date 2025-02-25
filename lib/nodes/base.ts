import { Node } from './index.ts';

export abstract class BaseElement {
  public children: Node[] = [];
  protected newlinesInHtml = false;

  protected constructor(public readonly tag: string) {}

  public getHtml(): string {
    const joiner = this.newlinesInHtml ? '\n' : '';
    return `<${this.tag}>${joiner}${this.children.map((n) => n.getHtml()).join(joiner)}${joiner}</${this.tag}>`;
  }
}

export abstract class BlockElement extends BaseElement {}
