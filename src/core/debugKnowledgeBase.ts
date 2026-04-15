// Debug Helper - Test Knowledge Base Matching
// Use this to verify questions are matching correctly with scoring

import { advancedKnowledgeBase } from "./advancedKnowledgeBase";

interface DebugResult {
  question: string;
  matched: boolean;
  entryId: string | null;
  entryCommand: string | null;
  matchDetails: {
    mainQuestionScore: number;
    alternativeMatches: { alternative: string; score: number }[];
    bestAlternativeScore: number;
    finalScore: number;
  };
  answer: string | null;
}

// Calculate similarity between two strings (copy of function from advancedKnowledgeBase)
function similarityScore(str1: string, str2: string): number {
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);

  const commonWords = words1.filter((w) =>
    words2.some(
      (w2) => w.includes(w2) || w2.includes(w) || levenshteinDistance(w, w2) <= 2
    )
  ).length;

  return commonWords / Math.max(words1.length, words2.length);
}

function levenshteinDistance(s1: string, s2: string): number {
  const len1 = s1.length;
  const len2 = s2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len2; i++) matrix[i] = [i];
  for (let j = 0; j <= len1; j++) matrix[0][j] = j;

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (s2[i - 1] === s1[j - 1]) {
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

  return matrix[len2][len1];
}

/**
 * Debug function to test question matching
 * Shows detailed matching scores for each question
 */
export function debugTestQuestion(question: string): DebugResult {
  const q = question.toLowerCase().trim();
  let bestMatch = null;
  let bestScore = 0;
  let mainQuestionScore = 0;
  let alternativeMatches: { alternative: string; score: number }[] = [];

  // Test against all entries
  for (const entry of advancedKnowledgeBase) {
    // Check main question
    const mainScore = similarityScore(q, entry.mainQuestion);
    if (mainScore > mainQuestionScore) {
      mainQuestionScore = mainScore;
    }

    // Check alternatives
    for (const alt of entry.alternatives) {
      const altScore = similarityScore(q, alt);
      alternativeMatches.push({ alternative: alt, score: altScore });

      if (altScore > bestScore) {
        bestScore = altScore;
        bestMatch = entry;
      }
    }

    // Check main question for best score
    if (mainScore > bestScore) {
      bestScore = mainScore;
      bestMatch = entry;
    }
  }

  // Sort alternatives by score for display
  alternativeMatches.sort((a, b) => b.score - a.score);

  return {
    question,
    matched: bestScore > 0.65,
    entryId: bestMatch?.id ?? null,
    entryCommand: bestMatch?.command ?? null,
    matchDetails: {
      mainQuestionScore,
      alternativeMatches: alternativeMatches.slice(0, 5), // Top 5
      bestAlternativeScore: bestScore,
      finalScore: bestScore,
    },
    answer: bestMatch?.answer ?? null,
  };
}

/**
 * Batch test multiple questions
 */
export function debugBatchTest(questions: string[]): DebugResult[] {
  return questions.map((q) => debugTestQuestion(q));
}

/**
 * Print results in console-friendly format
 */
export function printDebugResults(result: DebugResult): string {
  return `
═════════════════════════════════════════
Question: "${result.question}"
═════════════════════════════════════════
✓ Matched: ${result.matched ? "YES ✅" : "NO ❌"}
  | Entry: ${result.entryId} (${result.entryCommand})
  | Score: ${(result.matchDetails.finalScore * 100).toFixed(1)}%
  | Threshold: 65% (needs to be above this)
─────────────────────────────────────────
📊 Score Breakdown:
  | Main Question Score: ${(result.matchDetails.mainQuestionScore * 100).toFixed(1)}%
  | Best Alternative Score: ${(result.matchDetails.bestAlternativeScore * 100).toFixed(1)}%
─────────────────────────────────────────
Top Matching Alternatives:
  ${result.matchDetails.alternativeMatches
    .map(
      (m) =>
        `| "${m.alternative}" → ${(m.score * 100).toFixed(1)}% match`
    )
    .join("\n  ")}
─────────────────────────────────────────
Answer Preview:
  ${result.answer?.substring(0, 100)}...
${result.answer?.length! > 100 ? "  (truncated)" : ""}
═════════════════════════════════════════
`;
}

// Test cases for batch testing
export const TEST_QUESTIONS = [
  // Basic tests
  "what is ls?",
  "wht is ls?", // typo
  "how to show files?",
  "hwo see content?", // typo + grammar

  // Mkdir tests
  "what is mkdir?",
  "wat is mkdir?", // typo
  "how make directory?",
  "after mkdir what next?",

  // CD tests
  "what is cd?",
  "how to change directory?",
  "after cd what can i do?",

  // Touch tests
  "what is touch?",
  "wht touch for?", // typo
  "how create file?",
  "hwo new file?", // typo
  "after creating file what?",

  // Error cases
  "something not working?",
  "command didnt work?",

  // Edge cases
  "how do i list files like seriously?",
  "can you tell me about mkdir?",
  "i made mistake help?",
];

// Run tests
if (typeof window !== "undefined") {
  (window as any).debugKB = {
    test: debugTestQuestion,
    batchTest: debugBatchTest,
    printResults: printDebugResults,
    testAll: () => {
      const results = debugBatchTest(TEST_QUESTIONS);
      results.forEach((r) => {
        console.log(printDebugResults(r));
      });
      return results;
    },
  };

  console.log(
    "🔍 Knowledge Base Debug Loaded! Use window.debugKB.testAll() to run all tests"
  );
  console.log("   Or: window.debugKB.test('your question?') for single test");
}
