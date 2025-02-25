import { Element } from './element';

export class Text extends Element {
  public constructor(public readonly text: string) {
    super('span');
  }

  public withChildren(): this {
    throw new Error('Cannot add children to text element.');
  }

  protected getOpenTag(): string {
    return this.shouldWrapSpan() ? super.getOpenTag() : '';
  }

  protected getCloseTag(): string {
    return this.shouldWrapSpan() ? super.getCloseTag() : '';
  }

  protected getChildrenHtml(): string {
    return this.text;
  }

  private shouldWrapSpan(): boolean {
    return Object.keys(this.attributes).length > 0 || this.styles.length > 0;
  }
}
