// Smart Context Memory - Tracks execution history and provides intelligent suggestions
// This enables the system to remember what the user just did and suggest logical next steps

export interface CommandContext {
  command: string;
  timestamp: number;
  success: boolean;
  result?: string;
}

export interface CommandPattern {
  sequence: string[];
  frequency: number;
  confidence: number;
}

class SmartContextMemory {
  private commandHistory: CommandContext[] = [];
  private maxHistory = 10;
  private commandPatterns: Map<string, string[]> = new Map();
  private executionSuccessRate: Map<string, number> = new Map();

  /**
   * Record a command execution
   */
  recordCommand(command: string, success: boolean, result?: string): void {
    const context: CommandContext = {
      command: command.trim(),
      timestamp: Date.now(),
      success,
      result,
    };

    this.commandHistory.push(context);

    // Keep only last N commands
    if (this.commandHistory.length > this.maxHistory) {
      this.commandHistory.shift();
    }

    // Track success rate
    const cmd = command.split(" ")[0].toLowerCase();
    const current = this.executionSuccessRate.get(cmd) || 0;
    this.executionSuccessRate.set(cmd, success ? current + 1 : current);

    // Track patterns (what command follows what)
    if (this.commandHistory.length >= 2) {
      const prevCmd = this.commandHistory[this.commandHistory.length - 2].command.split(" ")[0].toLowerCase();
      const currCmd = cmd;

      if (!this.commandPatterns.has(prevCmd)) {
        this.commandPatterns.set(prevCmd, []);
      }

      const nextCommands = this.commandPatterns.get(prevCmd)!;
      nextCommands.push(currCmd);
    }
  }

  /**
   * Get last executed command
   */
  getLastCommand(): CommandContext | null {
    return this.commandHistory.length > 0 ? this.commandHistory[this.commandHistory.length - 1] : null;
  }

  /**
   * Get last N executed commands
   */
  getRecentCommands(n: number = 5): CommandContext[] {
    return this.commandHistory.slice(Math.max(0, this.commandHistory.length - n));
  }

  /**
   * Get the command before the last one
   */
  getPreviousCommand(): CommandContext | null {
    return this.commandHistory.length >= 2 ? this.commandHistory[this.commandHistory.length - 2] : null;
  }

  /**
   * Get smart suggestions based on what user just did
   */
  getSmartSuggestions(): string[] {
    const lastCmd = this.getLastCommand();
    if (!lastCmd) return [];

    const cmd = lastCmd.command.split(" ")[0].toLowerCase();
    const patterns = this.commandPatterns.get(cmd);

    if (!patterns || patterns.length === 0) {
      // Fallback to logical next steps
      const logicalNextSteps: Record<string, string[]> = {
        "mkdir": ["cd", "ls", "touch"],
        "touch": ["cat", "ls", "cp"],
        "ls": ["cd", "cat", "grep"],
        "cd": ["ls", "touch", "mkdir"],
        "cat": ["grep", "cp", "rm"],
        "cp": ["ls", "rm", "cat"],
        "mv": ["ls", "pwd", "cat"],
        "rm": ["ls", "pwd"],
        "pwd": ["ls", "cd"],
        "grep": ["cat", "ls"],
        "echo": ["cat", "ls"],
        "find": ["cat", "ls"],
        "sort": ["cat", "grep"],
        "help": ["ls", "pwd", "cd"],
      };

      return logicalNextSteps[cmd] || [];
    }

    // Count occurrences and rank by frequency
    const frequency = patterns.reduce((acc, cmd) => {
      acc[cmd] = (acc[cmd] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3) // Top 3 suggestions
      .map(([cmd]) => cmd);
  }

  /**
   * Get context-aware help message
   */
  getContextAwareHelp(): string {
    const last = this.getLastCommand();
    if (!last) return "";

    const cmd = last.command.split(" ")[0].toLowerCase();
    const suggestions = this.getSmartSuggestions();

    if (suggestions.length > 0) {
      return `Based on your last action (${cmd}), you might want to try: ${suggestions.join(", ")}`;
    }

    return "";
  }

  /**
   * Get success rate for a command
   */
  getSuccessRate(command: string): number {
    const cmd = command.split(" ")[0].toLowerCase();
    const successes = this.executionSuccessRate.get(cmd) || 0;
    return successes > 0 ? (successes / (successes + 1)) * 100 : 0;
  }

  /**
   * Check if user is in a logical sequence
   * Example: mkdir → cd → touch (good sequence)
   */
  isLogicalSequence(): boolean {
    if (this.commandHistory.length < 2) return true;

    const recent = this.getRecentCommands(3).map((c) => c.command.split(" ")[0].toLowerCase());
    const logicalPatterns = [
      ["mkdir", "cd"], // Make folder then enter it
      ["cd", "ls"], // Enter folder then list
      ["touch", "cat"], // Create file then view it
      ["ls", "cd"], // List then navigate
      ["find", "cat"], // Find then view
      ["grep", "cat"], // Grep results
      ["cp", "ls"], // Copy then verify
      ["rm", "ls"], // Delete then verify
    ];

    for (const pattern of logicalPatterns) {
      if (recent.length >= pattern.length) {
        const recentSubset = recent.slice(-pattern.length);
        if (JSON.stringify(recentSubset) === JSON.stringify(pattern)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get a motivational message based on usage
   */
  getMotivationalMessage(): string {
    const total = this.commandHistory.length;
    const successful = this.commandHistory.filter((c) => c.success).length;

    if (total === 0) return "Ready to help! Type a command or ask a question.";
    if (successful === total) {
      return `Great job! ${total} perfect commands in a row! 🎯`;
    }
    if (this.isLogicalSequence()) {
      return "Nice! Your command sequence looks logical! 👍";
    }
    if (successful > total * 0.7) {
      return `${((successful / total) * 100).toFixed(0)}% success rate! Keep going! 💪`;
    }

    return "Learning! Type 'help' if you need guidance.";
  }

  /**
   * Clear history (for reset/new session)
   */
  clearHistory(): void {
    this.commandHistory = [];
    this.commandPatterns.clear();
    this.executionSuccessRate.clear();
  }

  /**
   * Get full context state (for debugging)
   */
  getFullContext() {
    return {
      recentCommands: this.getRecentCommands(5),
      lastCommand: this.getLastCommand(),
      smartSuggestions: this.getSmartSuggestions(),
      isLogical: this.isLogicalSequence(),
      totalCommands: this.commandHistory.length,
      patterns: Array.from(this.commandPatterns.entries()),
    };
  }
}

// Singleton instance
let instance: SmartContextMemory | null = null;

/**
 * Get the singleton instance of SmartContextMemory
 */
export function getSmartContextMemory(): SmartContextMemory {
  if (!instance) {
    instance = new SmartContextMemory();
  }
  return instance;
}
