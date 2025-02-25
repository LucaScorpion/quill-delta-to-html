import { Element } from './element';

type ScriptType = 'sub' | 'super';

export class Script extends Element {
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
