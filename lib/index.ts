import { Delta, isLineFormatOp, Op } from './types.ts';
import { booleanAttributes } from './booleanAttributes.ts';
import { LineType, lineTypeAttributes } from './lineType.ts';

interface Line {
  text: string;
  type?: LineType;
}

export function deltaToHtml(delta: Delta): string {
  const ops = delta.ops as Op[];
  const lines = opsToLines(ops);
  return linesToHtml(lines);
}

function opsToLines(ops: Op[]): Line[] {
  let lines: Line[] = [{ text: '' }];

  for (const op of ops) {
    // Sanity check to ensure we're only processing insert operations.
    if (typeof op.insert !== 'string') {
      throw new Error(`Unknown op: ${JSON.stringify(op)}`);
    }

    // If we have a line format, first apply that to the last line.
    if (isLineFormatOp(op)) {
      Object.entries(lineTypeAttributes).forEach(([attrName, fn]) => {
        if (op.attributes.hasOwnProperty(attrName)) {
          lines[lines.length - 1].type = fn(op.attributes[attrName]);
        }
      });
    }

    // Add a line for each line in the insert.
    let [insert, ...nextLines] = op.insert.split('\n');

    // Apply any attributes.
    // Note that operations with attributes never contain newlines,
    // so we only have to consider the first part of the split here.
    Object.entries(booleanAttributes).forEach(([attrName, fn]) => {
      if (op.attributes?.[attrName]) {
        insert = fn(insert);
      }
    });

    // Append the insert to the last line, and push the next lines.
    lines[lines.length - 1].text += insert;
    lines.push(...nextLines.map((l): Line => ({ text: l })));
  }

  // Discard empty lines without type.
  return lines.filter((l) => l.text !== '' || l.type);
}

function linesToHtml(lines: Line[]): string {
  return lines
    .map((l) => {
      let tag = l.type ?? 'p';
      return `<${tag}>${l.text}</${tag}>`;
    })
    .join('\n');
}
