import { LineAttributes, Op, TextAttributes } from './delta.ts';

export interface Line {
  text: Text[];
  attributes: LineAttributes;
  indent: number;
}

export interface Text {
  value: string;
  attributes: TextAttributes;
}

export function opsToLines(ops: Op[]): Line[] {
  let lines: Line[] = [newLine()];

  for (const op of ops) {
    // If we have a line format, apply that to the last line.
    if (op.insert === '\n') {
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

    let [first, ...nextLines] = op.insert.split('\n');

    // Add the first text part to the current line.
    if (first) {
      lines[lines.length - 1].text.push({
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
    (l) => l.text.length > 0 || Object.keys(l.attributes).length > 0,
  );
}

function newLine(text?: string): Line {
  const l: Line = { text: [], attributes: {}, indent: 0 };
  if (text) {
    l.text.push({ value: text, attributes: {} });
  }
  return l;
}
