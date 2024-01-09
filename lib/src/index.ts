import Diff from './diff';

class LineDiff extends Diff {
  tokenize (value) {
    const lines = value.split(/(\n|\r\n)/);

    // Ignore the final empty token that occurs if the string ends with a new line
    if (!lines[lines.length - 1]) {
      lines.pop();
    }

    return lines;
  }
}

export function diffLines (oldStr, newStr) {
  const lineDiff = new LineDiff();
  return lineDiff.diff(oldStr, newStr);
}
