import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MIN_CODE_POINTS = 1;
const MAX_CODE_POINTS = 280;

const JOKE =
  'When our live demo crashed, my AI coding agent compacted its context mid-fix—then cheerfully asked, "What are we building today?"';

function countCodePoints(text: string): number {
  return Array.from(text).length;
}

function validateEntry(text: string): void {
  const codePoints = countCodePoints(text);
  if (codePoints < MIN_CODE_POINTS || codePoints > MAX_CODE_POINTS) {
    throw new Error(
      `Entry length (${codePoints} code points) must be between ${MIN_CODE_POINTS} and ${MAX_CODE_POINTS}.`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error('Entry must not be empty or whitespace only.');
  }
  if (/[\r\n\u0000-\u001f\u007f]/.test(text)) {
    throw new Error('Entry must be a single line with no newlines or control characters.');
  }
}

function main(): void {
  validateEntry(JOKE);
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, 'entry.txt');
  const payload = Buffer.from(JOKE, 'utf8');
  writeFileSync(outputPath, payload, { mode: 0o644 });

  const written = readFileSync(outputPath);
  if (!written.equals(payload)) {
    throw new Error('Written /output/entry.txt bytes did not match expected UTF-8 payload.');
  }
}

main();
