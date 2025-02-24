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
