import { StyleAttribute } from '../delta.ts';
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

// TODO
