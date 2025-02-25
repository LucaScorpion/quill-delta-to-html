import { Header } from './header';
import { ListItem } from './list';
import { Bold } from './bold';
import { Italic } from './italic';
import { Underline } from './underline';
import { Link } from './link';
import { Strike } from './strike';
import { Blockquote } from './blockquote';
import { Script } from './script';
import { LineAttribute, TextAttribute } from '../delta';
import { Element } from './element';

type ElemFromAttr = (value: unknown) => Element;

export const lineAttributeToElement: Record<
  LineAttribute,
  ElemFromAttr | undefined
> = {
  header: Header.fromAttr,
  list: ListItem.fromAttr,
  blockquote: always(Blockquote),
  indent: undefined,
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
