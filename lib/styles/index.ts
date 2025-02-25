import { StyleAttribute, StyleAttributes } from '../delta.ts';
import { Align } from './align.ts';
import { Style } from './style.ts';
import { Color } from './color.ts';
import { Background } from './background.ts';

type StyleFromAttr = (value: unknown) => Style;

export const attributeToStyle: Record<StyleAttribute, StyleFromAttr> = {
  align: Align.fromAttr,
  background: Background.fromAttr,
  color: Color.fromAttr,
};

export function stylesFromAttributes(attrs: StyleAttributes): Style[] {
  return Object.entries(attributeToStyle)
    .filter(([key]) => attrs.hasOwnProperty(key))
    .map(([key, fn]) => fn(attrs[key as StyleAttribute]));
}
