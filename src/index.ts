import {
  Delta,
  ImageInsert,
  isImage,
  LineAttribute,
  Op,
  TextAttribute,
} from './delta';
import { lineAttributeToElement, textAttributeToElement } from './elements';
import { Line, opsToLines, TextInsert } from './line';
import { Element } from './elements/element';
import { Paragraph } from './elements/paragraph';
import { List, ListItem } from './elements/list';
import { Image } from './elements/image';
import { Text } from './elements/text';
import { stylesFromAttributes } from './styles';

export function deltaToHtml(delta: Delta): string {
  // Validate that all operations are inserts.
  if (delta.ops.find((op) => typeof op.insert !== 'string')) {
    throw new Error('Delta should only contain insert operations.');
  }

  const ops = delta.ops as Op[];
  const lines = opsToLines(ops);
  const [elements, consumed] = linesToElements(lines);

  // Check if we consumed everything.
  if (consumed < lines.length) {
    console.warn(`Did not consume all lines: ${consumed}/${lines.length}`);
  }

  return combineListElements(elements)
    .map((node) => node.getHtml())
    .join('\n');
}

interface LineContext {
  indent: number;
}

function linesToElements(
  lines: Line[],
  ctx: LineContext = { indent: 0 },
): [Element[], number] {
  const elements: Element[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // If we're going down an indent, stop parsing.
    if (line.indent < ctx.indent) {
      break;
    }

    // If we're going up an indent, parse the indented lines.
    if (line.indent > ctx.indent) {
      const [indentedElems, consumed] = linesToElements(lines.slice(i), {
        indent: line.indent,
      });
      i += consumed;

      // Append indented elements to the last element's children while possible.
      const lastElem = elements[elements.length - 1];
      if (lastElem) {
        while (
          indentedElems.length > 0 &&
          lastElem.canAppendChild(indentedElems[0])
        ) {
          lastElem.children.push(...indentedElems.splice(0, 1));
        }
      }

      // Append the remaining indented elements as siblings.
      elements.push(...indentedElems);

      continue;
    }

    // If we're staying at the same indent, add to the siblings.
    i++;
    elements.push(lineToElement(line));
  }

  return [elements, i];
}

function lineToElement(line: Line): Element {
  const children = line.items.map((t) => lineItemToElement(t));

  // Check if this is an element.
  for (const [key, fn] of Object.entries(lineAttributeToElement)) {
    if (line.attributes.hasOwnProperty(key) && fn) {
      return fn(line.attributes[key as LineAttribute])
        .withChildren(children)
        .withStyles(stylesFromAttributes(line.attributes));
    }
  }

  // If nothing matched, return a paragraph.
  return new Paragraph().withChildren(children);
}

function lineItemToElement(value: TextInsert | ImageInsert): Element {
  if (isImage(value)) {
    return new Image(value.image);
  }

  let elem: Element = new Text(value.value);

  for (const [key, fn] of Object.entries(textAttributeToElement)) {
    if (value.attributes.hasOwnProperty(key)) {
      elem = fn(value.attributes[key as TextAttribute]).withChildren([elem]);
    }
  }

  return elem.withStyles(stylesFromAttributes(value.attributes));
}

function combineListElements(elements: Element[]): Element[] {
  // First go over all children, working from the bottom up.
  elements.forEach((n) => {
    n.children = combineListElements(n.children);
  });

  for (let i = 0; i < elements.length; i++) {
    const elem = elements[i];

    if (elem instanceof ListItem) {
      // Find all following list items with matching type.
      let count = 1;
      while (true) {
        if (i + count >= elements.length) {
          break;
        }

        const nextElem = elements[i + count];
        if (!(nextElem instanceof ListItem) || nextElem.type !== elem.type) {
          break;
        }

        count++;
      }

      // Create a list element, and replace the list items with it.
      const wrapper = new List(elem.type);
      wrapper.children = elements.splice(i, count, wrapper);
    }
  }

  return elements;
}
