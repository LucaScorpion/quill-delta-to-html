import { Delta, ImageInsert, isImage, Op } from './delta.ts';
import { attributeToElement, Element, Node, TextNode } from './nodes';
import { Line, opsToLines, Text } from './line.ts';
import { BaseElement } from './nodes/base.ts';
import { Paragraph } from './nodes/paragraph.ts';
import { List, ListItem } from './nodes/list.ts';
import { Image } from './nodes/image.ts';

export function deltaToHtml(delta: Delta): string {
  const ops = delta.ops as Op[];
  const lines = opsToLines(ops);
  const [nodes, consumed] = linesToNodes(lines);

  if (consumed < lines.length) {
    console.warn(`Did not consume all lines: ${consumed}/${lines.length}`);
  }

  return nodesToHtml(combineListNodes(nodes));
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

    // If we're going up an indent, parse the indented lines.
    if (line.indent > ctx.indent) {
      const [indentedNodes, consumed] = linesToNodes(lines.slice(i), {
        indent: line.indent,
      });
      i += consumed;

      // Append indented nodes to the last element's children while possible.
      const lastNode = nodes[nodes.length - 1];
      if (lastNode instanceof BaseElement) {
        while (
          indentedNodes.length > 0 &&
          lastNode.canAppendChild(indentedNodes[0])
        ) {
          lastNode.children.push(...indentedNodes.splice(0, 1));
        }
      }

      // Append the remaining indented nodes as siblings.
      nodes.push(...indentedNodes);

      continue;
    }

    // If we're staying at the same indent, add to the siblings.
    i++;
    nodes.push(lineToElement(line));
  }

  return [nodes, i];
}

function lineToElement(line: Line): Element {
  const children = line.items.map((t) => lineItemToNode(t));

  // Check if this is an element.
  for (const key in attributeToElement) {
    if (line.attributes.hasOwnProperty(key)) {
      const elem = attributeToElement[key](
        line.attributes[key],
        line.attributes,
      );

      elem.children = children;

      return elem;
    }
  }

  // If nothing matched, return a paragraph.
  return new Paragraph(children);
}

function lineItemToNode(value: Text | ImageInsert): Node {
  if (isImage(value)) {
    return new Image(value.image);
  }

  let node: Node = new TextNode(value.value);

  for (const key in value.attributes) {
    if (attributeToElement[key]) {
      const wrappingNode = attributeToElement[key](
        value.attributes[key],
        value.attributes,
      );
      wrappingNode.children = [node];

      node = wrappingNode;
    }
  }

  return node;
}

function combineListNodes(nodes: Node[]): Node[] {
  // First go over all children, working from the bottom up.
  nodes
    .filter((n) => n instanceof BaseElement)
    .forEach((n) => {
      n.children = combineListNodes(n.children);
    });

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node instanceof ListItem) {
      // Find all following list items with matching type.
      let count = 1;
      while (true) {
        if (i + count >= nodes.length) {
          break;
        }

        const nextNode = nodes[i + count];
        if (!(nextNode instanceof ListItem) || nextNode.type !== node.type) {
          break;
        }

        count++;
      }

      // Create a list node, and replace the list items with it.
      const wrappingNode = new List(node.type);
      wrappingNode.children = nodes.splice(i, count, wrappingNode);
    }
  }

  return nodes;
}

function nodesToHtml(nodes: Node[]): string {
  return nodes.map((node: Node) => node.getHtml()).join('\n');
}
