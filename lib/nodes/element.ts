import { Node } from './index.ts';

export abstract class Element {
  public children: Node[] = [];
  protected newlinesInHtml = false;
  protected attributes: Record<string, string> = {};

  protected constructor(public readonly tag: string) {}

  private static escapeAttributeValue(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('"', '&quot;');
  }

  public canAppendChild(_: Node): boolean {
    return false;
  }

  public getHtml(): string {
    const joiner = this.newlinesInHtml ? '\n' : '';
    const childrenHtml = this.children.map((n) => n.getHtml()).join(joiner);

    return `${this.getOpenTag()}${joiner}${childrenHtml}${joiner}</${this.tag}>`;
  }

  private getOpenTag(): string {
    const attrString = Object.entries(this.attributes)
      .map(([key, value]) => `${key}="${Element.escapeAttributeValue(value)}"`)
      .join(' ');

    return `<${this.tag}${attrString ? ' ' : ''}${attrString}>`;
  }
}

export abstract class BlockElement extends Element {}
