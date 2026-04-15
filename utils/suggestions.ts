const commands = [
  "ls", "cd", "mkdir", "touch", "cat",
  "rm", "pwd", "echo", "clear", "help"
];

export function getSuggestion(input: string): string | null {
  let bestMatch = "";
  let minDistance = Infinity;

  for (let cmd of commands) {
    const dist = levenshtein(input, cmd);
    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = cmd;
    }
  }

  return minDistance <= 2 ? bestMatch : null;
}

function levenshtein(a: string, b: string): number {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
