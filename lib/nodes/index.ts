import { Header } from './header.ts';
import { ListItem } from './list.ts';
import { Bold } from './bold.ts';
import { Italic } from './italic.ts';
import { Underline } from './underline.ts';
import { Link } from './link.ts';
import { Strike } from './strike.ts';
import { Blockquote } from './blockquote.ts';
import { Script } from './script.ts';
import { LineAttribute, TextAttribute } from '../delta.ts';
import { Element } from './element.ts';

export type Node = TextNode | Element;

export class TextNode {
  public constructor(public readonly text: string) {}

  public getHtml(): string {
    return this.text;
  }
}

type ElemFromAttr = (value: unknown) => Element;

export const lineAttributeToElement: Record<LineAttribute, ElemFromAttr> = {
  header: Header.fromAttr,
  list: ListItem.fromAttr,
  blockquote: always(Blockquote),
};

export const textAttributeToElement: Record<TextAttribute, ElemFromAttr> = {
  link: Link.fromAttr,
  script: Script.fromAttr,
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
