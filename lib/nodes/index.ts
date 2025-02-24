import { Header } from './header.ts';
import { List } from './list.ts';
import { Paragraph } from './paragraph.ts';
import { LineAttributes } from '../delta.ts';

export type Node = TextNode | Element;

export type Element = Paragraph | Header | List;

export class TextNode {
  public constructor(public readonly text: string) {}
}

type ElemFromAttrFunc = (value: unknown, attrs: LineAttributes) => Element;

export const attributeToElement: Record<string, ElemFromAttrFunc> = {
  header: Header.fromAttr,
  list: List.fromAttr,
};
