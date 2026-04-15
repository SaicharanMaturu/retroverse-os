// Semantic NLP Engine - Uses Transformers.js for AI-powered understanding
// Makes the AI understand meaning, not just keywords

import { pipeline } from "@xenova/transformers";

export class SemanticNLPEngine {
  private zeroShotClassifier: any = null;
  private initialized = false;

  // Command descriptions for semantic understanding
  private commandDescriptions: Record<string, string[]> = {
    ls: [
      "list files",
      "show files",
      "display files",
      "view files",
      "what files are here",
      "show folder contents",
      "display directory contents",
      "enumerate files",
    ],
    cd: [
      "change directory",
      "navigate to folder",
      "go to folder",
      "enter folder",
      "move to directory",
      "switch directory",
      "open folder",
      "change folder",
    ],
    mkdir: [
      "create folder",
      "make directory",
      "new folder",
      "create new folder",
      "make a directory",
      "create a directory",
      "new directory",
      "add folder",
    ],
    touch: [
      "create file",
      "make file",
      "new file",
      "create new file",
      "add file",
      "create a file",
      "make a file",
      "new empty file",
    ],
    rm: [
      "delete file",
      "remove file",
      "delete folder",
      "remove folder",
      "erase file",
      "get rid of file",
      "remove directory",
      "delete permanently",
    ],
    cat: [
      "view file",
      "read file",
      "show file contents",
      "display file",
      "open file",
      "read contents",
      "see file contents",
      "check file",
    ],
    pwd: [
      "show current directory",
      "where am i",
      "current location",
      "current path",
      "show path",
      "print working directory",
      "what is my location",
    ],
    grep: [
      "search file",
      "find text",
      "look for content",
      "search contents",
      "find in file",
      "search for text",
      "filter contents",
      "locate text",
    ],
    cp: [
      "copy file",
      "duplicate file",
      "copy folder",
      "backup file",
      "make a copy",
      "clone file",
    ],
    mv: [
      "move file",
      "rename file",
      "move folder",
      "rename folder",
      "relocate file",
    ],
  };

  /**
   * Initialize the semantic engine (async)
   */
  async initialize() {
    try {
      if (!this.initialized) {
        // Silently attempt to load transformer model
        this.zeroShotClassifier = await pipeline(
          "zero-shot-classification",
          "Xenova/mobilebert-uncased-mnli"
        );
        this.initialized = true;
      }
    } catch (err) {
      // Silently fall back to basic NLP mode - transformer not available
      this.initialized = false;
    }
  }

  /**
   * Semantic command classification using ML
   * Returns the most likely command based on user input meaning
   */
  async classifyCommand(input: string): Promise<{
    command: string;
    confidence: number;
    reason: string;
  } | null> {
    if (!this.zeroShotClassifier) {
      return null;
    }

    try {
      const commands = Object.keys(this.commandDescriptions);
      const candidateLabels = commands.map((cmd) => `${cmd} command`);

      const result = await this.zeroShotClassifier(input, candidateLabels, {
        multi_class: false,
      });

      if (result && result.labels && result.scores) {
        const topCommand = result.labels[0].replace(" command", "");
        const topScore = result.scores[0];

        // Only return if confidence is high enough
        if (topScore > 0.5) {
          return {
            command: topCommand,
            confidence: topScore,
            reason: `Semantic understanding: "${input}" → ${topCommand}`,
          };
        }
      }
    } catch (err) {
      console.warn("Classification error:", err);
    }

    return null;
  }

  /**
   * Find semantic similarity between input and command descriptions
   * Fast fallback when transformer model not available
   */
  findSimilarCommand(input: string): {
    command: string;
    confidence: number;
    reason: string;
  } | null {
    const inputLower = input.toLowerCase();
    let bestMatch: {
      command: string;
      score: number;
    } | null = null;

    for (const [cmd, descriptions] of Object.entries(this.commandDescriptions)) {
      for (const description of descriptions) {
        const similarity = this.stringSimilarity(inputLower, description);
        if (!bestMatch || similarity > bestMatch.score) {
          bestMatch = { command: cmd, score: similarity };
        }
      }
    }

    if (bestMatch && bestMatch.score > 0.6) {
      return {
        command: bestMatch.command,
        confidence: bestMatch.score,
        reason: `Semantic match: found similar meaning to "${bestMatch.command}"`,
      };
    }

    return null;
  }

  /**
   * Calculate string similarity (0-1)
   * Uses word overlap and Levenshtein distance
   */
  private stringSimilarity(str1: string, str2: string): number {
    // Word overlap similarity
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    const commonWords = words1.filter((w) => words2.includes(w)).length;
    const wordSimilarity =
      commonWords / Math.max(words1.length, words2.length);

    // Character-level similarity (Levenshtein)
    const charSimilarity = 1 - this.levenshteinDistance(str1, str2) / Math.max(str1.length, str2.length);

    // Weighted average
    return wordSimilarity * 0.7 + charSimilarity * 0.3;
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = [];

    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2[i - 1] === str1[j - 1]) {
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
   * Get semantic explanation for a command
   */
  getSemanticExplanation(command: string, input: string): string {
    const descriptions = this.commandDescriptions[command];
    if (descriptions && descriptions.length > 0) {
      return `🧠 Semantic: "${input}" means → ${descriptions[0]}`;
    }
    return `Semantic match: ${command}`;
  }
}

// Singleton instance
let semanticEngine: SemanticNLPEngine | null = null;

export function getSemanticNLPEngine(): SemanticNLPEngine {
  if (!semanticEngine) {
    semanticEngine = new SemanticNLPEngine();
  }
  return semanticEngine;
}
