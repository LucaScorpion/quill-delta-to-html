export interface Delta {
  ops: UnknownOp[];
}

export interface UnknownOp {
  insert?: unknown;
}

export type Op = InsertOp | LineFormatOp;

export interface InsertOp {
  insert: string;
  attributes?: TextAttributes;
}

export function isInsertOp(op: Op): op is InsertOp {
  return !isLineFormatOp(op);
}

export interface LineFormatOp {
  insert: '\n';
  attributes: LineAttributes;
}

export function isLineFormatOp(op: Op): op is LineFormatOp {
  return op.insert === '\n' && 'attributes' in op;
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
}
