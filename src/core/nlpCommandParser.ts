// NLP Command Parser - Understands natural language and converts to commands
// Uses semantic matching to parse user intent

import { getSemanticNLPEngine } from "./semanticNLP";

export class NLPCommandParser {
  // Command patterns - maps natural language to terminal commands
  private commandMappings = {
    // Navigation
    "show|list|see|display": "ls",
    "go|move|navigate|cd|enter": "cd",
    "where|location|current|pwd": "pwd",
    "back|parent|up": "cd ..",

    // File operations
    "create|make|new": "mkdir",
    "touch|add|file": "touch",
    "copy|duplicate": "cp",
    "move|rename|mv": "mv",
    "delete|remove|rm": "rm",
    "view|read|show|cat": "cat",
    "search|find|grep": "grep",
    "look|search|match": "grep",

    // System
    "clear|clean": "clear",
    "help|info|what|how": "help",
    "echo|print|say": "echo",
  };

  // Intent templates - phrases that indicate user intent
  private intentPatterns = {
    list_files: [
      /show me (the )?files/i,
      /list (all )?files/i,
      /what files/i,
      /see what.s (in|here)/i,
      /how (to |can i )?list/i,
      /how (to |can i )?show/i,
      /ls$/i,
    ],
    navigate: [
      /go to (.+)/i,
      /cd (.+)/i,
      /navigate to (.+)/i,
      /enter (.+)/i,
      /change director(y|ies) to (.+)/i,
      /how (to |can i )?(change|go to|move|navigate) (director(y|ies)|folder)/i,
      /how (to |can i )?ch(a|n)nge/i,
    ],
    create_folder: [
      /create.*folder (.+)/i,
      /mkdir (.+)/i,
      /make.*director(y|ies) (.+)/i,
      /new folder (.+)/i,
      /how (to |can i )?create.*folder/i,
      /how (to |can i )?mkdir/i,
    ],
    create_file: [
      /create.*file (.+)/i,
      /touch (.+)/i,
      /make.*file (.+)/i,
      /new file (.+)/i,
      /how (to |can i )?create.*file/i,
      /how (to |can i )?touch/i,
      /how (to |can i )?make.*file/i,
    ],
    search: [
      /find (.+)/i,
      /search for (.+)/i,
      /grep (.+)/i,
      /look for (.+)/i,
      /how (to |can i )?find/i,
      /how (to |can i )?search/i,
    ],
    view_file: [
      /show me (.+)/i,
      /view (.+)/i,
      /read (.+)/i,
      /cat (.+)/i,
      /how (to |can i )?view/i,
      /how (to |can i )?read/i,
    ],
    delete: [
      /delete (.+)/i,
      /remove (.+)/i,
      /rm (.+)/i,
      /how (to |can i )?delete/i,
      /how (to |can i )?remove/i,
    ],
  };

  /**
   * Parse natural language input and convert to command
   * Examples:
   * - "show me all files" → "ls"
   * - "go to projects folder" → "cd projects"
   * - "create a new folder called data" → "mkdir data"
   * - "search for hello" → "grep hello"
   * - "how to change the directory" → "cd"
   */
  parseNaturalLanguage(input: string): {
    command: string | null;
    confidence: number;
    explanation: string;
  } {
    let trimmed = input.toLowerCase().trim();

    // Correct common typos before processing
    trimmed = this.correctTypos(trimmed);

    // Check intent patterns first (highest confidence) - MUST be before keyword fallback
    for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
      for (const pattern of patterns) {
        const match = trimmed.match(pattern);
        if (match) {
          const result = this.handleIntent(intent, match);
          if (result.command) {
            return {
              command: result.command,
              confidence: 0.95,
              explanation: result.explanation,
            };
          }
        }
      }
    }

    // Fallback: ONLY for direct commands, not for "how to" phrases
    if (!trimmed.includes("how") && !trimmed.includes("what") && !trimmed.includes("why")) {
      for (const [keywords, cmd] of Object.entries(this.commandMappings)) {
        const keywordArray = keywords.split("|");
        for (const keyword of keywordArray) {
          if (trimmed.includes(keyword)) {
            // Extract argument if present
            const parts = trimmed.split(keyword);
            const arg = parts[1]?.trim() || "";
            return {
              command: cmd + (arg ? ` ${arg}` : ""),
              confidence: 0.75,
              explanation: `Detected: ${keyword} → ${cmd}`,
            };
          }
        }
      }
    }

    return {
      command: null,
      confidence: 0,
      explanation: "Could not parse command",
    };
  }

  /**
   * Semantic parsing using ML - Try this first for better understanding
   * Falls back to pattern matching if semantic engine not available
   */
  async parseWithSemantic(input: string): Promise<{
    command: string | null;
    confidence: number;
    explanation: string;
  }> {
    const semanticEngine = getSemanticNLPEngine();

    // Try semantic classification first (ML-based)
    try {
      const semanticResult = await semanticEngine.classifyCommand(input);
      if (semanticResult && semanticResult.confidence > 0.6) {
        return {
          command: semanticResult.command,
          confidence: semanticResult.confidence,
          explanation: `🧠 Semantic AI: ${semanticResult.reason}`,
        };
      }

      // Fallback to fast similarity matching
      const similarResult = semanticEngine.findSimilarCommand(input);
      if (similarResult && similarResult.confidence > 0.65) {
        return {
          command: similarResult.command,
          confidence: similarResult.confidence,
          explanation: `🧠 Semantic match: ${similarResult.reason}`,
        };
      }
    } catch (err) {
      console.warn("Semantic parsing fallback:", err);
    }

    // Ultimate fallback: Use pattern-based parsing
    return this.parseNaturalLanguage(input);
  }

  /**
   * Correct common typos using Levenshtein distance
   */
  private correctTypos(input: string): string {
    const commonTypos: Record<string, string> = {
      chnage: "change",
      chnafa: "change",
      chnafe: "change",
      directiry: "directory",
      directorie: "directory",
      direcrory: "directory",
      creat: "create",
      creae: "create",
      delte: "delete",
      delt: "delete",
      serach: "search",
      seach: "search",
      find: "find",
      sarch: "search",
      mkidr: "mkdir",
      tuch: "touch",
      touh: "touch",
      vieww: "view",
      reead: "read",
    };

    let corrected = input;
    for (const [typo, correct] of Object.entries(commonTypos)) {
      corrected = corrected.replace(new RegExp(`\\b${typo}\\b`, "gi"), correct);
    }

    return corrected;
  }

  /**
   * Handle specific intents and extract arguments
   */
  private handleIntent(
    intent: string,
    match: RegExpMatchArray
  ): { command: string | null; explanation: string } {
    // Get the last captured group (usually the argument)
    const arg = match[match.length - 1]?.trim() || "";

    switch (intent) {
      case "list_files":
        return {
          command: "ls",
          explanation: "Show files and folders",
        };
      case "navigate":
        // Extract folder name from match
        const navArg = arg || this.extractFolderName(match[0]);
        return {
          command: navArg ? `cd ${navArg}` : "cd",
          explanation: `Navigate to ${navArg || "home"}`,
        };
      case "create_folder":
        const folderName = arg || this.extractFolderName(match[0]);
        return {
          command: folderName ? `mkdir ${folderName}` : "mkdir folder",
          explanation: `Create folder: ${folderName}`,
        };
      case "create_file":
        const fileName = arg || this.extractFileName(match[0]);
        return {
          command: fileName ? `touch ${fileName}` : "touch file",
          explanation: `Create file: ${fileName}`,
        };
      case "search":
        return {
          command: arg ? `grep ${arg}` : "grep",
          explanation: `Search for: ${arg}`,
        };
      case "view_file":
        const viewFile = arg || this.extractFileName(match[0]);
        return {
          command: viewFile ? `cat ${viewFile}` : "cat",
          explanation: `View file: ${viewFile}`,
        };
      case "delete":
        const deleteTarget = arg || this.extractFileName(match[0]);
        return {
          command: deleteTarget ? `rm ${deleteTarget}` : "rm",
          explanation: `Delete: ${deleteTarget}`,
        };
      default:
        return {
          command: null,
          explanation: "Unknown intent",
        };
    }
  }

  /**
   * Extract folder/path name from a sentence
   */
  private extractFolderName(sentence: string): string {
    // Look for patterns like "into X", "to X", "called X", "named X"
    const patterns = [
      /(?:to|into|called|named|as)\s+(['"]?)([^'"\s]+)\1/i,
      /folder\s+(['"]?)([^'"\s]+)\1/i,
      /directory\s+(['"]?)([^'"\s]+)\1/i,
    ];

    for (const pattern of patterns) {
      const match = sentence.match(pattern);
      if (match) {
        return match[2] || match[1] || "";
      }
    }

    return "";
  }

  /**
   * Extract file name from a sentence
   */
  private extractFileName(sentence: string): string {
    // Look for patterns like "file X", "called X", "named X"
    const patterns = [
      /(?:file|called|named|as)\s+(['"]?)([^'"\s]+)\1/i,
      /inside\s+(?:the\s+)?folder\s*$/i,
    ];

    for (const pattern of patterns) {
      const match = sentence.match(pattern);
      if (match && match[2]) {
        return match[2];
      }
    }

    return "";
  }

  /**
   * Semantic similarity between two strings (simple version)
   * Returns 0-1 score
   */
  semanticSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase().split(" ");
    const s2 = str2.toLowerCase().split(" ");

    const matches = s1.filter((word) => s2.includes(word)).length;
    const total = Math.max(s1.length, s2.length);

    return total > 0 ? matches / total : 0;
  }

  /**
   * Extract command suggestions from natural language
   * For when we want to offer multiple options
   */
  suggestCommands(input: string): Array<{
    command: string;
    confidence: number;
    reason: string;
  }> {
    const suggestions: Array<{
      command: string;
      confidence: number;
      reason: string;
    }> = [];

    const parsed = this.parseNaturalLanguage(input);
    if (parsed.command) {
      suggestions.push({
        command: parsed.command,
        confidence: parsed.confidence,
        reason: parsed.explanation,
      });
    }

    // Add alternative suggestions based on keywords
    const keywords = input.toLowerCase().split(" ");
    for (const keyword of keywords) {
      for (const [patterns, cmd] of Object.entries(this.commandMappings)) {
        const patternArray = patterns.split("|");
        if (
          patternArray.some((p) => p.startsWith(keyword)) &&
          !suggestions.some((s) => s.command.startsWith(cmd))
        ) {
          suggestions.push({
            command: cmd,
            confidence: 0.6,
            reason: `Keyword match: ${keyword}`,
          });
        }
      }
    }

    return suggestions;
  }

  /**
   * Understand user questions and provide helpful responses
   */
  answerQuestion(question: string): string {
    const lower = question.toLowerCase();

    // "What is..." questions
    if (lower.includes("what is") || lower.includes("what's")) {
      if (lower.includes("ls")) return "ls lists files and folders in current directory";
      if (lower.includes("cd")) return "cd changes to a different directory";
      if (lower.includes("mkdir")) return "mkdir creates a new folder";
      if (lower.includes("touch")) return "touch creates a new empty file";
      if (lower.includes("rm")) return "rm removes files or folders";
      if (lower.includes("cat")) return "cat displays file contents";
      if (lower.includes("grep")) return "grep searches for text patterns";
      if (lower.includes("pwd")) return "pwd shows current directory path";
      if (lower.includes("cp")) return "cp copies files or folders";
      if (lower.includes("mv")) return "mv moves or renames files";
    }

    // "How to..." questions
    if (lower.includes("how to") || lower.includes("how do i")) {
      if (lower.includes("list")) return "Type 'ls' to list files";
      if (lower.includes("create") && lower.includes("folder"))
        return "Type 'mkdir foldername' to create a folder";
      if (lower.includes("create") && lower.includes("file"))
        return "Type 'touch filename' to create a file";
      if (lower.includes("delete")) return "Type 'rm filename' to delete";
      if (lower.includes("navigate") || lower.includes("go"))
        return "Type 'cd foldername' to navigate";
      if (lower.includes("search")) return "Type 'grep searchtext' to search";
    }

    // "Why..." questions
    if (lower.includes("why")) {
      if (lower.includes("error")) return "Check your syntax or file names. Use 'help' for guidance.";
      if (lower.includes("not work"))
        return "The command might have wrong syntax or the file/folder doesn't exist.";
    }

    return "I didn't understand. Try: 'what is ls', 'how to create a file', or type 'help'.";
  }
}

// Singleton instance
let parserInstance: NLPCommandParser | null = null;

export function getNLPParser(): NLPCommandParser {
  if (!parserInstance) {
    parserInstance = new NLPCommandParser();
  }
  return parserInstance;
}
