import { Header } from './header.ts';
import { ListItem } from './list.ts';
import { Paragraph } from './paragraph.ts';
import { LineAttributes } from '../delta.ts';
import { Bold } from './bold.ts';
import { Italic } from './italic.ts';
import { Underline } from './underline.ts';
import { Link } from './link.ts';
import { Strike } from './strike.ts';
import { Blockquote } from './blockquote.ts';
import { Script } from './script.ts';

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
  link: Link.fromAttr,
  list: ListItem.fromAttr,
  script: Script.fromAttr,

  blockquote: always(Blockquote),
  bold: always(Bold),
  italic: always(Italic),
  strike: always(Strike),
  underline: always(Underline),
};

function always<E extends Element, T extends new () => E>(
  Cls: T,
): ElemFromAttr {
  return () => new Cls();
}
