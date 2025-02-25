export interface Delta {
  ops: UnknownOp[];
}

export interface UnknownOp {
  insert?: unknown;
}

export type Op = InsertOp | LineFormatOp;

export interface InsertOp {
  insert: string | ImageInsert;
  attributes?: TextAttributes & StyleAttributes;
}

export interface ImageInsert {
  image: string;
}

export function isImage(value: unknown): value is ImageInsert {
  return !!value && typeof value === 'object' && 'image' in value;
}

export interface LineFormatOp {
  insert: '\n';
  attributes: LineAttributes & StyleAttributes;
}

export function isLineFormatOp(op: Op): op is LineFormatOp {
  return op.insert === '\n' && !!op.attributes;
}

export interface TextAttributes {
  bold?: boolean;
  italic?: boolean;
  link?: string;
  script?: string;
  strike?: boolean;
  underline?: boolean;
}

export type TextAttribute = keyof TextAttributes;

export interface LineAttributes {
  blockquote?: boolean;
  header?: number;
  list?: string;
  indent?: number;
}

export type LineAttribute = keyof LineAttributes;

export interface StyleAttributes {
  align?: string;
  background?: string;
  color?: string;
}

export type StyleAttribute = keyof StyleAttributes;
