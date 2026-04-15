// AI Command Assistant - Intelligent command suggestion & prediction
// Browser-based ML using pattern matching, decision trees, and learning

export interface CommandPattern {
  command: string;
  frequency: number;
  successRate: number;
  averageXpGain: number;
  followedBy: Map<string, number>;
}

export interface CommandHistory {
  command: string;
  timestamp: number;
  success: boolean;
  xpGained: number;
  nextCommand?: string;
}

export class AICommandAssistant {
  private history: CommandHistory[] = [];
  private patterns: Map<string, CommandPattern> = new Map();

  /**
   * Learn from command execution
   */
  learn(command: string, success: boolean, xpGained: number = 0, nextCommand?: string) {
    const timestamp = Date.now();
    this.history.push({
      command,
      timestamp,
      success,
      xpGained,
      nextCommand
    });

    // Update pattern
    if (!this.patterns.has(command)) {
      this.patterns.set(command, {
        command,
        frequency: 0,
        successRate: 0,
        averageXpGain: 0,
        followedBy: new Map()
      });
    }

    const pattern = this.patterns.get(command)!;
    pattern.frequency++;
    pattern.successRate = (pattern.successRate * (pattern.frequency - 1) + (success ? 1 : 0)) / pattern.frequency;
    pattern.averageXpGain = (pattern.averageXpGain * (pattern.frequency - 1) + xpGained) / pattern.frequency;

    // Track command sequences
    if (nextCommand) {
      const count = pattern.followedBy.get(nextCommand) || 0;
      pattern.followedBy.set(nextCommand, count + 1);
    }
  }

  /**
   * Predict next command based on history
   */
  predictNextCommand(currentCommand: string): string | null {
    const pattern = this.patterns.get(currentCommand);
    if (!pattern || pattern.followedBy.size === 0) return null;

    // Find most common next command
    let maxCount = 0;
    let mostLikelyNext = null;
    for (const [cmd, count] of pattern.followedBy) {
      if (count > maxCount) {
        maxCount = count;
        mostLikelyNext = cmd;
      }
    }

    return mostLikelyNext;
  }

  /**
   * Get smart command suggestions based on context
   */
  suggestCommand(context: {
    currentPath: string[];
    completedChallenges: string[];
    failedAttempts: number;
    currentChallenge?: string;
  }): string | null {
    // If stuck on challenge, suggest the solution
    if (context.currentChallenge && context.failedAttempts > 2) {
      return this.suggestChallengeCommand(context.currentChallenge);
    }

    // Predict based on pattern
    if (this.history.length > 0) {
      const lastCommand = this.history[this.history.length - 1].command;
      const next = this.predictNextCommand(lastCommand);
      if (next) return next;
    }

    // Default suggestions by path
    return this.suggestByContext(context);
  }

  /**
   * Suggest command based on challenge
   */
  private suggestChallengeCommand(challengeId: string): string | null {
    const suggestions: Record<string, string> = {
      "basic_1": "ls",
      "basic_2": "pwd",
      "basic_3": "mkdir projects",
      "basic_4": "cd projects",
      "basic_5": "touch notes.txt",
      "intermediate_1": "cp notes.txt notes_backup.txt",
      "intermediate_2": "mv notes_backup.txt notes_archive.txt",
      "intermediate_3": "mkdir src",
      "intermediate_4": "cat notes.txt",
      "intermediate_5": "rm notes_archive.txt",
      "advanced_1": "grep",
      "advanced_2": "cat | grep",
      "advanced_3": "ls > filelist.txt",
      "advanced_4": "find",
      "advanced_5": "chmod 755"
    };
    return suggestions[challengeId] || null;
  }

  /**
   * Context-aware suggestions
   */
  private suggestByContext(context: {
    currentPath: string[];
    completedChallenges: string[];
    failedAttempts: number;
  }): string | null {
    // If in root, suggest exploring
    if (context.currentPath.length <= 1) {
      return "ls";
    }

    // If many files exist, suggest organization
    if (context.completedChallenges.includes("basic_5")) {
      return "mkdir";
    }

    return null;
  }

  /**
   * Analyze command for errors and suggest corrections
   */
  analyzeCommand(input: string, availableCommands: string[]): {
    isValid: boolean;
    suggestion?: string;
    confidence: number;
  } {
    const parts = input.trim().split(" ");
    const command = parts[0].toLowerCase();

    // Check if valid
    if (availableCommands.includes(command)) {
      return { isValid: true, confidence: 1.0 };
    }

    // Find closest match using Levenshtein distance
    let closest = null;
    let minDist = Infinity;
    for (const cmd of availableCommands) {
      const dist = this.levenshteinDistance(command, cmd);
      if (dist < minDist) {
        minDist = dist;
        closest = cmd;
      }
    }

    if (closest && minDist <= 2) {
      return {
        isValid: false,
        suggestion: closest,
        confidence: 1 - minDist / 3
      };
    }

    return { isValid: false, confidence: 0 };
  }

  /**
   * Calculate similarity between commands
   */
  private levenshteinDistance(a: string, b: string): number {
    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }
    return dp[a.length][b.length];
  }

  /**
   * Get learning statistics
   */
  getStats() {
    const totalCommands = this.history.length;
    const successRate = this.history.filter(h => h.success).length / (totalCommands || 1);
    const totalXp = this.history.reduce((sum, h) => sum + h.xpGained, 0);
    const uniqueCommands = this.patterns.size;

    return {
      totalCommands,
      successRate,
      totalXp,
      uniqueCommands,
      learningProgress: (uniqueCommands / 20) * 100 // 20 commands cap
    };
  }

  /**
   * Get command difficulty ranking
   */
  getCommandDifficulty(command: string): number {
    const pattern = this.patterns.get(command);
    if (!pattern) return 0;
    
    // 0-100 scale: lower success rate = harder
    return (1 - pattern.successRate) * 100;
  }

  /**
   * Get adaptive difficulty
   */
  getAdaptiveDifficulty(): "easy" | "medium" | "hard" {
    const stats = this.getStats();
    if (stats.successRate > 0.8) return "hard";
    if (stats.successRate > 0.5) return "medium";
    return "easy";
  }

  /**
   * AI Debugging: Suggest why command failed
   */
  suggestDebugInfo(_failedCommand: string, error: string): string {
    const hints: Record<string, string> = {
      "missing argument": "This command needs more information. Try: command --help",
      "not found": "File or folder doesn't exist. Use 'ls' to see what's available.",
      "permission denied": "You don't have permission. Try 'chmod' to change permissions.",
      "invalid syntax": "Check your command spelling and syntax.",
      "is a directory": "This is a folder, not a file. Use 'cd' to enter it.",
      "already exists": "This file already exists. Use 'rm' to delete it first or choose another name."
    };

    for (const [key, hint] of Object.entries(hints)) {
      if (error.toLowerCase().includes(key)) {
        return hint;
      }
    }

    return "Try using 'help' to see available commands, or type 'what is [command]?' for help.";
  }
}

// Singleton instance
let assistantInstance: AICommandAssistant | null = null;

export function getAIAssistant(): AICommandAssistant {
  if (!assistantInstance) {
    assistantInstance = new AICommandAssistant();
  }
  return assistantInstance;
}

export function resetAIAssistant() {
  assistantInstance = null;
}
