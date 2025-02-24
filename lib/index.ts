import { Delta, Op } from './delta.ts';
import { attributeToElement, Node, TextNode } from './nodes';
import { Line, opsToLines, Text } from './line.ts';
import { BaseElement } from './nodes/base.ts';

export function deltaToHtml(delta: Delta): string {
  const ops = delta.ops as Op[];
  const lines = opsToLines(ops);
  const [nodes, consumed] = linesToNodes(lines);

  if (consumed < lines.length) {
    console.warn(`Did not consume all lines: ${consumed}/${lines.length}`);
  }

  return JSON.stringify(nodes, null, 2);
  return '';
  // const lines = opsToLines(ops);
  // return linesToHtml(lines);
}

interface LineContext {
  indent: number;
}

function linesToNodes(
  lines: Line[],
  ctx: LineContext = { indent: 0 },
): [Node[], number] {
  const nodes: Node[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // If we're going down an indent, stop parsing.
    if (line.indent < ctx.indent) {
      break;
    }

    // If we're going up an indent, append to the last node's children.
    if (line.indent > ctx.indent) {
      const [children, consumed] = linesToNodes(lines.slice(i), {
        indent: line.indent + ctx.indent,
      });
      i += consumed;

      const lastNode = nodes[nodes.length - 1];
      if (lastNode instanceof BaseElement) {
        lastNode.children.push(...children);
      } else {
        console.warn('Could not append children to last node.');
        nodes.push(...children);
      }

      continue;
    }

    // If we're staying at the same indent, add to the siblings.
    i++;
    nodes.push(...lineToNodes(line));
  }

  return [nodes, i];
}

function lineToNodes(line: Line): Node[] {
  const children = line.text.map((t) => textToNode(t));

  // Check if this is an element.
  for (const key in attributeToElement) {
    if (line.attributes.hasOwnProperty(key)) {
      const elem = attributeToElement[key](
        line.attributes[key],
        line.attributes,
      );

      elem.children = children;

      return [elem];
    }
  }

  // If no element matched, simply return the child nodes.
  return children;
}

function textToNode(text: Text): Node {
  let node: Node = new TextNode(text.value);

  for (const key in text.attributes) {
    if (attributeToElement[key]) {
      const wrappingNode = attributeToElement[key](
        text.attributes[key],
        text.attributes,
      );
      wrappingNode.children = [node];

      node = wrappingNode;
    }
  }

  return node;
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
