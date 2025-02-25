import {
  ImageInsert,
  isImage,
  isLineFormatOp,
  LineAttributes,
  Op,
  StyleAttributes,
  TextAttributes,
} from './delta.ts';

export interface Line {
  items: (Text | ImageInsert)[];
  attributes: LineAttributes & StyleAttributes;
  indent: number;
}

export interface Text {
  value: string;
  attributes: TextAttributes & StyleAttributes;
}

export function opsToLines(ops: Op[]): Line[] {
  let lines: Line[] = [newLine()];

  for (const op of ops) {
    // If we have a line format, apply that to the last line.
    if (isLineFormatOp(op)) {
      lines[lines.length - 1].attributes = {
        ...lines[lines.length - 1].attributes,
        ...op.attributes,
      };

      // Set the indent of the last line.
      if (typeof op.attributes?.indent === 'number') {
        lines[lines.length - 1].indent = op.attributes.indent;
      }

      lines.push(newLine());
      continue;
    }

    // If the insert is an image, add it to the current line.
    if (isImage(op.insert)) {
      lines[lines.length - 1].items.push(op.insert);
      continue;
    }

    let [first, ...nextLines] = op.insert.split('\n');

    // Add the first text part to the current line.
    if (first) {
      lines[lines.length - 1].items.push({
        value: first,
        attributes: op.attributes ?? {},
      });
    }

    // Store the other lines.
    nextLines.forEach((lineText) => {
      lines.push(newLine(lineText));
    });
  }

  // Discard empty lines.
  return lines.filter(
    (l) => l.items.length > 0 || Object.keys(l.attributes).length > 0,
  );
}

function newLine(text?: string): Line {
  const l: Line = { items: [], attributes: {}, indent: 0 };
  if (text) {
    l.items.push({ value: text, attributes: {} });
  }
  return l;
}
