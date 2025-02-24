import { Node } from './index.ts';

export abstract class BaseElement {
  public children: Node[] = [];

  protected constructor(public readonly tag: string) {}
}
