import { Delta, Op } from './delta.ts';
import { attributeToElement, Node, TextNode } from './nodes';
import { Line, opsToLines, Text } from './line.ts';
import { BaseElement, BlockElement } from './nodes/base.ts';
import { Paragraph } from './nodes/paragraph.ts';

export function deltaToHtml(delta: Delta): string {
  const ops = delta.ops as Op[];
  const lines = opsToLines(ops);
  const [nodes, consumed] = linesToNodes(lines);

  if (consumed < lines.length) {
    console.warn(`Did not consume all lines: ${consumed}/${lines.length}`);
  }

  return nodesToHtml(cleanupNodes(nodes));
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

function cleanupNodes(nodes: Node[]): Node[] {
  return nodes.map((n) => {
    // Wrap root-level non-block elements in paragraphs.
    if (!(n instanceof BlockElement)) {
      const p = new Paragraph();
      p.children = [n];
      return p;
    }
    return n;
  });

  // TODO: Fix lists
}

function nodesToHtml(nodes: Node[]): string {
  return nodes.map((node: Node) => node.getHtml()).join('\n');
}
