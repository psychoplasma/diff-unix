import { readFileSync } from 'fs';
import { diffLines } from 'planetarium-diff';

(() => {
  // Read files contents
  const oldText = readFileSync(process.argv[2]).toString('utf-8');
  const newText = readFileSync(process.argv[3]).toString('utf-8');

  // Diff files
  const diffs = diffLines(oldText, newText);

  // If the contents are same, simply return
  if (diffs === undefined) {
    process.stdout.write('no change');
    return;
  };

  // Parse diff and write it to stdout
  for (const diff of diffs) {
    const lines = diff.value?.split('\n');
    const editSymbol = diff.added ? '++  ' : diff.removed ? '--  ' : undefined;

    // Skip no-change components
    if (editSymbol === undefined) {
      continue;
    }

    const reconstructed = lines?.reduce((acc, line) => acc + '\n' + editSymbol + line, '');

    process.stdout.write(reconstructed as string);
  }

  process.stdout.write('\n');
})();
