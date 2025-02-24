export interface Delta {
  ops: Op[];
}

export interface Op {
  insert: string;
  attributes?: Attributes;
}

export interface Attributes extends Record<string, unknown> {
  bold?: string;
  italic?: boolean;
  underline?: boolean;
  header?: number;
  list?: ListType;
  link?: string;
}

export type ListType = 'ordered' | 'bullet';
