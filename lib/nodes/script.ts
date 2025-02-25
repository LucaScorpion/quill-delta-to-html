import { BaseElement } from './base.ts';

type ScriptType = 'sub' | 'super';

export class Script extends BaseElement {
  public constructor(type: ScriptType) {
    super(type.substring(0, 3));
  }

  public static fromAttr(value: unknown): Script {
    if (value !== 'sub' && value !== 'super') {
      throw new Error('Script attribute must specify a valid script type.');
    }
    return new Script(value);
  }
}
