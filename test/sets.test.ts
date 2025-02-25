import * as fs from 'node:fs';
import * as path from 'node:path';
import { deltaToHtml } from '../src';
import { Delta } from '../src/delta';

describe('sets', () => {
  const setsDir = path.resolve(__dirname, 'sets');
  const names = fs
    .readdirSync(setsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.substring(0, f.length - 5));

  it.each(names)('generates the correct html from delta: %s', (name) => {
    const input: Delta = JSON.parse(
      fs.readFileSync(path.resolve(setsDir, `${name}.json`)).toString(),
    );
    const expected = fs
      .readFileSync(path.resolve(setsDir, `${name}.html`))
      .toString()
      .trim();

    expect(deltaToHtml(input)).toBe(expected);
  });
});
