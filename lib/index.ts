import { Delta, Op } from './delta.ts';
import { attributeToElement, Element, Node, TextNode } from './nodes';
import { opsToLines } from './line.ts';

export function deltaToHtml(delta: Delta): string {
  const ops = delta.ops as Op[];
  const lines = opsToLines(ops);
  return '';
  // const lines = opsToLines(ops);
  // return linesToHtml(lines);
}

interface OpContext {
  elem: Element;
  indent: number;
}

function parseOps(ops: Op[], ctx?: OpContext): Node[] {
  const nodes: Node[] = [];

  for (const op of ops) {
    nodes.push(parseOp(op));
  }

  return nodes;
}

function parseOp(op: Op): Node {
  // Check if this is an element.
  for (const key in attributeToElement) {
    if (op.attributes?.hasOwnProperty(key)) {
      const elem = attributeToElement[key](op.attributes[key], op.attributes);

      return elem;
    }
  }

  // If nothing matched, this is simply a text node.
  return new TextNode(op.insert);
}

// function linesToHtml(lines: Line[]): string {
//   let stack: string[] = [];
//
//   return lines
//     .flatMap((l) => {
//       let tag = 'p';
//       let preTags: string[] = [];
//
//       if (l.type === 'ul' || l.type === 'ol') {
//         tag = 'li';
//       }
//
//       const indent = (l.indent ?? 0) + 1;
//
//       // Remove items from the stack until the indent matches.
//       while (stack.length > indent) {
//         preTags.push(`</${stack.pop()}>`);
//       }
//
//       // Check if we are starting a new type or indent.
//       if (l.type !== stack[stack.length - 1] || indent > stack.length) {
//         // If we are starting a new type on the same indent level,
//         // close the previous tag.
//         if (indent <= stack.length) {
//           preTags.push(`</${stack.pop()}>`);
//         }
//
//         preTags.push(`<${l.type}>`);
//         stack.push(l.type);
//       }
//
//       // Close and clear the indenting tags.
//       // preTags.push(...stack.toReversed().map((t) => `</${t}>`));
//       // stack = [];
//
//       return [...preTags, `<${tag}>${l.text}</${tag}>`];
//     })
//     .concat(stack.toReversed().map((t) => `</${t}>`))
//     .join('\n');
// }
