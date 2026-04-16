import { useState, useRef, useEffect } from "react";
import { runCommand, getPrompt } from "../../core/commandEngine/commandEngine";

export default function Terminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Basic command autocomplete suggestion
  useEffect(() => {
    if (!input.trim()) {
      setSuggestion(null);
      return;
    }

    const cmd = input.trim().split(/\s+/)[0];
    const commands = [
      // Basic
      "ls",
      "cd",
      "mkdir",
      "touch",
      "cat",
      "clear",
      "help",
      "pwd",
      "rm",
      "echo",
      "cp",
      "mv",
      // System Info
      "date",
      "whoami",
      "uname",
      "uptime",
      "df",
      "ps",
      // File Tools
      "file",
      "stat",
      "ln",
      "basename",
      "dirname",
      // Text Processing
      "cut",
      "paste",
      "tr",
      "rev",
      "nl",
      "col",
      // History & Config
      "history",
      "alias",
      "env",
      "export",
      // Utilities
      "time",
      "which",
      "calc",
      "bc",
      // ✨ NEW
      "man",
      "about",
      "system",
      "theme",
      "tip",
      // Advanced
      "grep",
      "find",
      "sort",
      "head",
      "tail",
      "wc",
      "chmod",
      "uniq",
    ];

    if (cmd && !commands.includes(cmd)) {
      // Find closest match using Levenshtein distance
      let best: string | null = null;
      let bestDist = Infinity;

      for (const known of commands) {
        let dist = 0;
        if (cmd.length && known.length) {
          const dp = Array.from({ length: cmd.length + 1 }, (_, i) =>
            Array.from({ length: known.length + 1 }, (_, j) =>
              i === 0 ? j : j === 0 ? i : 0
            )
          );
          for (let i = 1; i <= cmd.length; i++) {
            for (let j = 1; j <= known.length; j++) {
              dp[i][j] =
                cmd[i - 1] === known[j - 1]
                  ? dp[i - 1][j - 1]
                  : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
          }
          dist = dp[cmd.length][known.length];
        }
        if (dist < bestDist) {
          bestDist = dist;
          best = known;
        }
      }

      setSuggestion(bestDist <= 2 && best !== cmd ? best : null);
    } else {
      setSuggestion(null);
    }
  }, [input]);

  // Focus input on mount and click
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onEnter = async () => {
    if (!input.trim()) return;

    const commandToRun = input.trim();
    const newHistory = [...history, input];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length);

    if (commandToRun === "clear") {
      setLines([]);
    } else {
      try {
        const output = await runCommand(commandToRun);

        if (output === "__CLEAR__") {
          setLines([]);
        } else if (output) {
          setLines((prev) => [
            ...prev,
            `${getPrompt()} ${input}`,
            output,
          ]);
        } else {
          setLines((prev) => [...prev, `${getPrompt()} ${input}`]);
        }
      } catch (err) {
        setLines((prev) => [...prev, `${getPrompt()} ${input}`, `Error: ${err}`]);
      }
    }

    setInput("");
    setSuggestion(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex =
        historyIndex > 0 ? historyIndex - 1 : history.length - 1;
      setHistoryIndex(newIndex);
      setInput(history[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex =
        historyIndex < history.length - 1 ? historyIndex + 1 : -1;
      setHistoryIndex(newIndex);
      setInput(newIndex === -1 ? "" : history[newIndex]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (suggestion) {
        setInput(suggestion);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-black text-[#4ade80] font-pixel text-sm border-4 border-[#4ade80]">
      {/* Terminal output */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {lines.map((l, i) => (
          <div
            key={i}
            className="whitespace-pre-wrap leading-relaxed text-[#4ade80]"
          >
            {l}
          </div>
        ))}
      </div>

      {/* Command input */}
      <div className="p-4 border-t border-[#4ade80] space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[#4ade80]">{getPrompt()}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            onClick={() => inputRef.current?.focus()}
            className="flex-1 bg-black text-[#4ade80] outline-none font-pixel text-sm border-0 p-0"
            autoFocus
          />
          <span className="animate-pulse text-[#4ade80]">▮</span>
        </div>

        {/* Auto-complete suggestion */}
        {suggestion && (
          <div className="text-[#4ade80] text-xs opacity-60 pl-8">
            [Tab] {suggestion}
          </div>
        )}
      </div>
    </div>
  );
}
