import { Header } from './header.ts';
import { ListItem } from './list.ts';
import { Paragraph } from './paragraph.ts';
import { LineAttributes } from '../delta.ts';
import { Bold } from './bold.ts';
import { Italic } from './italic.ts';
import { Underline } from './underline.ts';

export type Node = TextNode | Element;

export type Element = Paragraph | Header | ListItem;

export class TextNode {
  public constructor(public readonly text: string) {}

  public getHtml(): string {
    return this.text;
  }
}

type ElemFromAttr = (value: unknown, attrs: LineAttributes) => Element;

export const attributeToElement: Record<string, ElemFromAttr> = {
  header: Header.fromAttr,
  list: ListItem.fromAttr,

  bold: always(Bold),
  italic: always(Italic),
  underline: always(Underline),
};

function always<E extends Element, T extends new () => E>(
  Cls: T,
): ElemFromAttr {
  return () => new Cls();
}
