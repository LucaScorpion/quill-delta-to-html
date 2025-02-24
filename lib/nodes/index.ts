import { Header } from './header.ts';
import { List } from './list.ts';
import { Paragraph } from './paragraph.ts';
import { LineAttributes } from '../delta.ts';
import { Bold } from './bold.ts';
import { Italic } from './italic.ts';
import { Underline } from './underline.ts';

export type Node = TextNode | Element;

export type Element = Paragraph | Header | List;

export class TextNode {
  public constructor(public readonly text: string) {}
}

type ElemFromAttr = (value: unknown, attrs: LineAttributes) => Element;

export const attributeToElement: Record<string, ElemFromAttr> = {
  header: Header.fromAttr,
  list: List.fromAttr,

  bold: always(Bold),
  italic: always(Italic),
  underline: always(Underline),
};

function always<E extends Element, T extends new () => E>(
  Cls: T,
): ElemFromAttr {
  return () => new Cls();
}
