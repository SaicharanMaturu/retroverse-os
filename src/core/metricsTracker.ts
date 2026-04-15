// Metrics Tracker - Comprehensive evaluation metrics for AI system performance

export interface Metrics {
  // NLP Metrics
  nlpCommandsParsed: number;
  nlpSuccessRate: number; // % of parsed commands that executed successfully
  nlpAverageConfidence: number; // 0-1
  nlpHighConfidenceCount: number; // > 0.8
  nlpLowConfidenceCount: number; // < 0.5

  // Command Execution Metrics
  totalCommandsExecuted: number;
  successfulCommands: number;
  failedCommands: number;
  executionSuccessRate: number; // %

  // Pattern Learning Metrics
  learnedPatterns: number;
  uniqueCommandsLearned: number;
  averagePatternFrequency: number;

  // Performance Metrics
  averageResponseTime: number; // ms
  parseTimeMs: number; // NLP parsing time
  executionTimeMs: number; // Command execution time

  // Knowledge Base Metrics
  questionsAnswered: number;
  questionsTotal: number;
  questionAnswerRate: number; // %

  // Overall Health
  systemHealthScore: number; // 0-100 (weighted average)
  lastUpdated: number; // timestamp
}

class MetricsTracker {
  private metrics: Metrics = {
    nlpCommandsParsed: 0,
    nlpSuccessRate: 0,
    nlpAverageConfidence: 0,
    nlpHighConfidenceCount: 0,
    nlpLowConfidenceCount: 0,
    totalCommandsExecuted: 0,
    successfulCommands: 0,
    failedCommands: 0,
    executionSuccessRate: 0,
    learnedPatterns: 0,
    uniqueCommandsLearned: 0,
    averagePatternFrequency: 0,
    averageResponseTime: 0,
    parseTimeMs: 0,
    executionTimeMs: 0,
    questionsAnswered: 0,
    questionsTotal: 0,
    questionAnswerRate: 0,
    systemHealthScore: 85,
    lastUpdated: Date.now(),
  };

  private confidenceScores: number[] = [];
  private responseTimes: number[] = [];
  private patternFrequencies: number[] = [];

  /**
   * Record a parsed NLP command
   */
  recordNLPParse(confidence: number, success: boolean, parseTimeMs: number = 0) {
    this.metrics.nlpCommandsParsed++;
    this.confidenceScores.push(confidence);

    if (confidence > 0.8) {
      this.metrics.nlpHighConfidenceCount++;
    } else if (confidence < 0.5) {
      this.metrics.nlpLowConfidenceCount++;
    }

    // Update average confidence
    this.metrics.nlpAverageConfidence =
      this.confidenceScores.reduce((a, b) => a + b, 0) / this.confidenceScores.length;

    // Track success rate of parsed commands
    if (success) {
      this.metrics.successfulCommands++;
    } else {
      this.metrics.failedCommands++;
    }

    this.metrics.nlpSuccessRate =
      this.metrics.totalCommandsExecuted > 0
        ? (this.metrics.successfulCommands / this.metrics.totalCommandsExecuted) * 100
        : 0;

    // Track parse time
    if (parseTimeMs > 0) {
      this.responseTimes.push(parseTimeMs);
      this.metrics.parseTimeMs = parseTimeMs;
      this.metrics.averageResponseTime =
        this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
    }

    this.updateHealth();
  }

  /**
   * Record command execution
   */
  recordCommandExecution(success: boolean, executionTimeMs: number = 0) {
    this.metrics.totalCommandsExecuted++;

    if (success) {
      this.metrics.successfulCommands++;
    } else {
      this.metrics.failedCommands++;
    }

    this.metrics.executionSuccessRate =
      (this.metrics.successfulCommands / this.metrics.totalCommandsExecuted) * 100;

    if (executionTimeMs > 0) {
      this.responseTimes.push(executionTimeMs);
      this.metrics.executionTimeMs = executionTimeMs;
      this.metrics.averageResponseTime =
        this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
    }

    this.updateHealth();
  }

  /**
   * Record pattern learning
   */
  recordPatternLearned(patternFrequency: number = 1) {
    this.metrics.learnedPatterns++;
    this.patternFrequencies.push(patternFrequency);
    this.metrics.averagePatternFrequency =
      this.patternFrequencies.reduce((a, b) => a + b, 0) / this.patternFrequencies.length;

    this.updateHealth();
  }

  /**
   * Record unique command learned
   */
  recordUniqueCommand() {
    this.metrics.uniqueCommandsLearned++;
    this.updateHealth();
  }

  /**
   * Record question answered
   */
  recordQuestion(answered: boolean = true) {
    this.metrics.questionsTotal++;
    if (answered) {
      this.metrics.questionsAnswered++;
    }
    this.metrics.questionAnswerRate =
      (this.metrics.questionsAnswered / this.metrics.questionsTotal) * 100;

    this.updateHealth();
  }

  /**
   * Calculate overall health score (0-100)
   * Weighted average of all metrics
   */
  private updateHealth() {
    const weights = {
      nlpSuccessRate: 0.25,
      executionSuccessRate: 0.25,
      nlpAverageConfidence: 0.2,
      questionAnswerRate: 0.15,
      learnedPatterns: 0.15, // scales to 0-1
    };

    const learnedPatternsNormalized = Math.min(
      this.metrics.learnedPatterns / 50,
      1
    );

    this.metrics.systemHealthScore =
      weights.nlpSuccessRate * (this.metrics.nlpSuccessRate || 85) +
      weights.executionSuccessRate * (this.metrics.executionSuccessRate || 85) +
      weights.nlpAverageConfidence * (this.metrics.nlpAverageConfidence * 100) +
      weights.questionAnswerRate * (this.metrics.questionAnswerRate || 80) +
      weights.learnedPatterns * (learnedPatternsNormalized * 100);

    this.metrics.lastUpdated = Date.now();
  }

  /**
   * Get current metrics
   */
  getMetrics(): Metrics {
    return { ...this.metrics };
  }

  /**
   * Get formatted metrics for display
   */
  getFormattedMetrics(): Record<string, string> {
    return {
      "NLP Success Rate": `${this.metrics.nlpSuccessRate.toFixed(1)}%`,
      "Avg Confidence": `${(this.metrics.nlpAverageConfidence * 100).toFixed(1)}%`,
      "High Confidence Parses": `${this.metrics.nlpHighConfidenceCount} (${(this.metrics.nlpCommandsParsed > 0 ? (this.metrics.nlpHighConfidenceCount / this.metrics.nlpCommandsParsed) * 100 : 0).toFixed(0)}%)`,
      "Commands Executed": `${this.metrics.totalCommandsExecuted}`,
      "Success Rate": `${this.metrics.executionSuccessRate.toFixed(1)}%`,
      "Learned Patterns": `${this.metrics.learnedPatterns}`,
      "Unique Commands": `${this.metrics.uniqueCommandsLearned}`,
      "Avg Response Time": `${this.metrics.averageResponseTime.toFixed(2)}ms`,
      "Questions Answered": `${this.metrics.questionsAnswered}/${this.metrics.questionsTotal} (${this.metrics.questionAnswerRate.toFixed(1)}%)`,
      "System Health": `${this.metrics.systemHealthScore.toFixed(0)}/100`,
    };
  }

  /**
   * Get health status emoji
   */
  getHealthStatus(): string {
    if (this.metrics.systemHealthScore >= 90) return "🟢 Excellent";
    if (this.metrics.systemHealthScore >= 75) return "🟡 Good";
    if (this.metrics.systemHealthScore >= 60) return "🟠 Fair";
    return "🔴 Poor";
  }

  /**
   * Reset all metrics
   */
  reset() {
    this.metrics = {
      nlpCommandsParsed: 0,
      nlpSuccessRate: 0,
      nlpAverageConfidence: 0,
      nlpHighConfidenceCount: 0,
      nlpLowConfidenceCount: 0,
      totalCommandsExecuted: 0,
      successfulCommands: 0,
      failedCommands: 0,
      executionSuccessRate: 0,
      learnedPatterns: 0,
      uniqueCommandsLearned: 0,
      averagePatternFrequency: 0,
      averageResponseTime: 0,
      parseTimeMs: 0,
      executionTimeMs: 0,
      questionsAnswered: 0,
      questionsTotal: 0,
      questionAnswerRate: 0,
      systemHealthScore: 85,
      lastUpdated: Date.now(),
    };
    this.confidenceScores = [];
    this.responseTimes = [];
    this.patternFrequencies = [];
  }
}

// Singleton instance
let trackerInstance: MetricsTracker | null = null;

export function getMetricsTracker(): MetricsTracker {
  if (!trackerInstance) {
    trackerInstance = new MetricsTracker();
  }
  return trackerInstance;
}
