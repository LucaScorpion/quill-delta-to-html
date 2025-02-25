export interface Delta {
  ops: UnknownOp[];
}

export interface UnknownOp {
  insert?: unknown;
}

export type Op = InsertOp | LineFormatOp;

export interface InsertOp {
  insert: string | ImageInsert;
  attributes?: TextAttributes;
}

export interface ImageInsert {
  image: string;
}

export function isImage(value: unknown): value is ImageInsert {
  return !!value && typeof value === 'object' && 'image' in value;
}

export interface LineFormatOp {
  insert: '\n';
  attributes: LineAttributes;
}

export interface TextAttributes extends Record<string, unknown> {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  link?: string;
}

export interface LineAttributes extends Record<string, unknown> {
  header?: number;
  list?: 'ordered' | 'bullet';
  indent?: number;
}
