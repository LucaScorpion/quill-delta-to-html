type BooleanAttributeFunc = (text: string) => string;

export const booleanAttributes: Record<string, BooleanAttributeFunc> = {
  bold: (text) => `<strong>${text}</strong>`,
  italic: (text) => `<i>${text}</i>`,
  underline: (text) => `<ins>${text}</ins>`,
};
