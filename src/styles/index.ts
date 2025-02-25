import { StyleAttribute, StyleAttributes } from '../delta';
import { Align } from './align';
import { Style } from './style';
import { Color } from './color';
import { Background } from './background';

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
