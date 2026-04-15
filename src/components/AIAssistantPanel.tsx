import React, { useState, useEffect } from "react";
import { getAIAssistant } from "../core/aiCommandAssistant";
import { getMetricsTracker } from "../core/metricsTracker";

interface AIAssistantPanelProps {
  currentCommand: string;
  failedAttempts: number;
  currentPath?: string[];
  completedChallenges?: string[];
  lastCommand?: string;
  currentChallenge?: string;
  isVisible?: boolean;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  currentCommand,
  failedAttempts,
  isVisible = true
}) => {
  const [stats, setStats] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [showFullMetrics, setShowFullMetrics] = useState(false);
  const assistant = getAIAssistant();
  const metricsTracker = getMetricsTracker();

  useEffect(() => {
    const newStats = assistant.getStats();
    const newMetrics = metricsTracker.getMetrics();
    setStats(newStats);
    setMetrics(newMetrics);
  }, [currentCommand, failedAttempts]);

  if (!isVisible) return null;

  const formattedMetrics = metricsTracker.getFormattedMetrics();
  const healthStatus = metricsTracker.getHealthStatus();

  return (
    <div style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "8px",
      padding: "12px",
      marginBottom: "12px",
      color: "white",
      fontSize: "12px"
    }}>
      <div style={{ fontWeight: "bold", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>🤖 AI Assistant</span>
        <button 
          onClick={() => setShowFullMetrics(!showFullMetrics)}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "white",
            padding: "2px 8px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "10px"
          }}
        >
          {showFullMetrics ? "Hide" : "Show"} Metrics
        </button>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div style={{ fontSize: "11px", lineHeight: "1.6", marginBottom: "8px" }}>
          <div>✅ Success: {(stats.successRate * 100).toFixed(0)}% | 📊 Commands: {stats.uniqueCommands}/20</div>
          <div>🏆 XP: {stats.totalXp}pt | {healthStatus}</div>
        </div>
      )}

      {/* Full Metrics */}
      {showFullMetrics && metrics && (
        <div style={{
          background: "rgba(0,0,0,0.3)",
          padding: "10px",
          borderRadius: "4px",
          fontSize: "10px",
          lineHeight: "1.8",
          maxHeight: "200px",
          overflowY: "auto",
          marginBottom: "8px"
        }}>
          <div style={{ fontWeight: "bold", marginBottom: "6px", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "6px" }}>
            📈 Complete Metrics
          </div>
          {Object.entries(formattedMetrics).map(([key, value]) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
              <span>{key}:</span>
              <span style={{ fontWeight: "bold" }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stuck Detection */}
      {failedAttempts > 2 && (
        <div style={{ marginTop: "8px", padding: "8px", background: "rgba(255, 193, 7, 0.2)", borderRadius: "4px", fontSize: "11px" }}>
          ⚠️ Stuck? Try: command --help
        </div>
      )}
    </div>
  );
};
