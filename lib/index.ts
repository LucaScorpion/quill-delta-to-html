import { Delta, Op } from './types.ts';

export function deltaToHtml(deltaOrOps: Delta | Op[]): string {
  const ops = Array.isArray(deltaOrOps) ? deltaOrOps : deltaOrOps.ops;

  // TODO
  return '<div></div>';
}
