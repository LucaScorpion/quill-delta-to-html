import { Style } from '../styles/style.ts';

export abstract class Element {
  public children: Element[] = [];
  protected newlinesInHtml = false;
  protected attributes: Record<string, string> = {};
  protected styles: Style[] = [];

  protected constructor(public readonly tag: string) {}

  private static escapeAttributeValue(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('"', '&quot;');
  }

  public withChildren(children: Element[]): this {
    this.children = children;
    return this;
  }

  public withStyles(styles: Style[]): this {
    this.styles = styles;
    return this;
  }

  public canAppendChild(_: Element): boolean {
    return false;
  }

  public getHtml(): string {
    const joiner = this.newlinesInHtml ? '\n' : '';
    return `${this.getOpenTag()}${joiner}${this.getChildrenHtml()}${joiner}${this.getCloseTag()}`;
  }

  protected getOpenTag(): string {
    const combinedAttributes = { ...this.attributes };
    if (this.styles.length > 0) {
      combinedAttributes.style = this.styles.map((s) => s.getCss()).join(' ');
    }

    const attrString = Object.entries(combinedAttributes)
      .map(([key, value]) => `${key}="${Element.escapeAttributeValue(value)}"`)
      .join(' ');

    return `<${this.tag}${attrString ? ' ' : ''}${attrString}>`;
  }

  protected getCloseTag(): string {
    return `</${this.tag}>`;
  }

  protected getChildrenHtml(): string {
    return this.children
      .map((n) => n.getHtml())
      .join(this.newlinesInHtml ? '\n' : '');
  }
}

export abstract class BlockElement extends Element {}
