import { Node } from './index.ts';

export abstract class BaseElement {
  public readonly children: Node[] = [];

  protected constructor(public readonly tag: string) {}
}
