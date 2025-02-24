export type LineType =
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'ul'
  | 'ol';

const listTypeMap: Record<string, LineType> = {
  ordered: 'ol',
  bullet: 'ul',
};

type LineTypeAttributeFunc = (value: unknown) => LineType;

export const lineTypeAttributes: Record<string, LineTypeAttributeFunc> = {
  header: (value) => {
    if (typeof value !== 'number' || value <= 0 || value > 6) {
      throw new Error('Header attribute must be a number between 0 and 6.');
    }
    return `h${value}` as LineType;
  },
  list: (value) => {
    if (typeof value !== 'string' || !listTypeMap[value]) {
      throw new Error('List attribute must specify a valid list type.');
    }
    return listTypeMap[value];
  },
};
