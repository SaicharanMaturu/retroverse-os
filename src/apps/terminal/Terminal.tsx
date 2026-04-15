import { useState, useRef, useEffect } from "react";
import { runCommand, getPrompt } from "../../core/commandEngine/commandEngine";
import { getNode } from "../../core/fileSystem/fsUtils";
import { AIAssistantPanel } from "../../components/AIAssistantPanel";
import { getAIAssistant } from "../../core/aiCommandAssistant";
import { getNLPParser } from "../../core/nlpCommandParser";
import { getMetricsTracker } from "../../core/metricsTracker";
import { getSemanticNLPEngine } from "../../core/semanticNLP";
import { findKnowledgeEntry, getSuggestedNextSteps } from "../../core/advancedKnowledgeBase";
import { getSmartContextMemory } from "../../core/smartContextMemory";

export default function Terminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [tabMatches, setTabMatches] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [commandPreview, setCommandPreview] = useState<string | null>(null);
  const [nlpInterpretation, setNlpInterpretation] = useState<{
    understood: boolean;
    command?: string;
    confidence?: number;
    explanation?: string;
  }>({ understood: false });
  const [semanticReady, setSemanticReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const ai = getAIAssistant();
  const nlp = getNLPParser();
  const semanticEngine = getSemanticNLPEngine();
  const contextMemory = getSmartContextMemory();

  // Initialize semantic engine on mount
  useEffect(() => {
    semanticEngine.initialize().then(() => {
      setSemanticReady(true);
      console.log("🧠 Semantic AI ready!");
    });
  }, [semanticEngine]);

  // For live command suggestion (basic, only for first word)
  useEffect(() => {
    if (!input.trim()) {
      setSuggestion(null);
      setTabMatches([]);
      setTabIndex(0);
      setNlpInterpretation({ understood: false });
      return;
    }
    
    // Check for natural language input
    const looksLikeNaturalLanguage = !input.trim().match(/^(ls|cd|mkdir|touch|cat|rm|pwd|help|clear|echo|cp|mv|grep)\b/) && 
                                     input.includes(" ") && 
                                     !input.trim().match(/^[a-zA-Z-]+$/);
    
    if (looksLikeNaturalLanguage) {
      const parsed = nlp.parseNaturalLanguage(input);
      if (parsed.confidence > 0.6) {
        setNlpInterpretation({
          understood: true,
          command: parsed.command ?? undefined,
          confidence: parsed.confidence,
          explanation: parsed.explanation,
        });
      }
    } else {
      setNlpInterpretation({ understood: false });
    }
    
    const cmd = input.trim().split(/\s+/)[0];
    const commands = ["ls", "cd", "mkdir", "touch", "cat", "clear", "help", "pwd", "rm", "echo", "cp", "mv"];
    if (cmd && !commands.includes(cmd)) {
      // Suggest closest
      let best: string | null = null;
      let bestDist = Infinity;
      for (const known of commands) {
        let dist = 0;
        if (cmd.length && known.length) {
          // Levenshtein
          const dp = Array.from({ length: cmd.length + 1 }, (_, i) =>
            Array.from({ length: known.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
          );
          for (let i = 1; i <= cmd.length; i++) {
            for (let j = 1; j <= known.length; j++) {
              dp[i][j] = cmd[i - 1] === known[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
          }
          dist = dp[cmd.length][known.length];
        }
        if (dist < bestDist) { bestDist = dist; best = known; }
      }
      setSuggestion(bestDist <= 3 && best !== cmd ? best : null);
    } else {
      setSuggestion(null);
    }
    setTabMatches([]);
    setTabIndex(0);
  }, [input, nlp]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onEnter = async () => {
    if (!input.trim()) {
      return;
    }
    
    // Show thinking effect
    setThinking(true);
    setCommandPreview(null);
    
    const metrics = getMetricsTracker();
    const startTime = performance.now();
    
    // Try semantic parsing first if available, otherwise use pattern matching
    let parsed;
    if (semanticReady) {
      parsed = await nlp.parseWithSemantic(input);
    } else {
      parsed = nlp.parseNaturalLanguage(input);
    }
    
    let commandToRun = input.trim();
    let isNaturalLanguage = false;
    
    // Record NLP parse
    metrics.recordNLPParse(
      parsed.confidence,
      parsed.confidence > 0.7,
      performance.now() - startTime
    );
    
    // If high confidence and not a direct command, use NLP suggestion
    if (parsed.confidence > 0.7 && !input.trim().match(/^(ls|cd|mkdir|touch|cat|rm|pwd|help|clear|echo|cp|mv|grep)\b/)) {
      isNaturalLanguage = true;
      commandToRun = parsed.command || input.trim();
      setNlpInterpretation({
        understood: true,
        command: parsed.command ?? undefined,
        confidence: parsed.confidence,
        explanation: parsed.explanation,
      });
      // Show the interpretation in output
      setLines(prev => [
        ...prev,
        `${getPrompt()} ${input}`,
        `${parsed.explanation.includes("🧠") ? "🧠" : "🤖"} ${parsed.explanation}`,
        `📝 Running: ${parsed.command}`,
      ]);
    } else if (input.includes("?")) {
      // Check if it's a question - try advanced knowledge base first
      const knowledgeEntry = findKnowledgeEntry(input);
      let answer: string;
      let source: string;

      if (knowledgeEntry) {
        // Smart knowledge match
        answer = knowledgeEntry.answer;
        source = "📚 Knowledge Base";
        
        // Add context-aware suggestions (smart suggestions based on history)
        let suggestions = getSuggestedNextSteps(knowledgeEntry.command);
        
        // Override with smart context suggestions if available
        const contextSuggestions = contextMemory.getSmartSuggestions();
        if (contextSuggestions.length > 0) {
          suggestions = contextSuggestions;
        }
        
        if (suggestions.length > 0) {
          answer += `\n\n💡 Next commands you might try: ${suggestions.join(", ")}`;
        }
      } else {
        // Fallback to NLP Q&A
        answer = nlp.answerQuestion(input);
        source = "🤖 AI Assistant";
      }

      metrics.recordQuestion(true);
      setLines(prev => [
        ...prev,
        `${getPrompt()} ${input}`,
        `${source}`,
        `${answer}`,
      ]);
      setInput("");
      setSuggestion(null);
      return;
    }
    
    // Stop thinking effect
    setThinking(false);
    
    // Show command preview
    setCommandPreview(commandToRun);
    
    const newHistory = [...history, input];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length);

    if (commandToRun === "clear") {
      setLines([]);
    } else if (isNaturalLanguage || input.trim().match(/^(ls|cd|mkdir|touch|cat|rm|pwd|help|clear|echo|cp|mv|grep|find|sort)\\b/)) {
      try {
        const execStartTime = performance.now();
        const output = await runCommand(commandToRun);
        const execEndTime = performance.now();
        const isSuccess = !output.includes("not found") && !output.includes("Error") && !output.includes("denied");
        
        // Record execution metrics
        metrics.recordCommandExecution(isSuccess, execEndTime - execStartTime);
        
        // Record to smart context memory for intelligent suggestions
        contextMemory.recordCommand(commandToRun, isSuccess, output);
        
        ai.learn(
          commandToRun.trim().split(" ")[0],
          isSuccess,
          isSuccess ? 10 : 0,
          history.length > 0 ? history[history.length - 1].trim().split(" ")[0] : undefined
        );
        
        if (!isSuccess) {
          setFailedAttempts(prev => prev + 1);
        } else {
          setFailedAttempts(0);
        }
        
        if (output === "__CLEAR__") {
          setLines([]);
        } else if (output) {
          const motivationalMsg = contextMemory.getMotivationalMessage();
          if (!isNaturalLanguage) {
            setLines(prev => [...prev, `${getPrompt()} ${input}`, output, ...(motivationalMsg ? [`💬 ${motivationalMsg}`] : [])]);
          } else {
            setLines(prev => [...prev, output, ...(motivationalMsg ? [`💬 ${motivationalMsg}`] : [])]);
          }
        } else {
          if (!isNaturalLanguage) {
            setLines(prev => [...prev, `${getPrompt()} ${input}`]);
          }
        }
      } catch (err) {
        console.error("Command error:", err);
      }
    }
    setInput("");
    setSuggestion(null);
    setCommandPreview(null);
    setNlpInterpretation({ understood: false });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onEnter();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex > 0 ? historyIndex - 1 : 0;
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx]);
      } else {
        setHistoryIndex(history.length);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Tab completion for files/folders
      const parts = input.trim().split(/\s+/);
      const cmd = parts[0];
      const arg = parts.slice(1).join(" ");
      // Only for commands that take a file/folder argument
      const fileCmds = ["cd", "cat", "rm", "touch", "mkdir", "cp", "mv"];
      if (fileCmds.includes(cmd)) {
        // Get current path from prompt
        let path = (getPrompt().replace(/\s*>$/, "").replace(/^\//, "").split("/"));
        if (path.length === 1 && path[0] === "") path = ["home"];
        // For cd, mkdir, touch, rm, cat: complete last arg
        const node = getNode(path);
        if (node && node.children) {
          let matches = node.children.map(c => c.name);
          if (arg) {
            matches = matches.filter(n => n.startsWith(arg));
          }
          if (matches.length > 0) {
            // Cycle through matches
            let idx = tabIndex;
            if (tabMatches.length !== matches.length || tabMatches.join() !== matches.join()) {
              idx = 0;
            } else {
              idx = (tabIndex + 1) % matches.length;
            }
            setTabMatches(matches);
            setTabIndex(idx);
            setInput(cmd + " " + matches[idx]);
            setSuggestion(null);
            return;
          }
        }
      }
      // If not file/folder command, fallback to command suggestion
      if (suggestion) {
        const rest = input.trim().split(/\s+/).slice(1).join(" ");
        setInput(suggestion + (rest ? " " + rest : " "));
        setSuggestion(null);
      }
    }
  };

  return (
    <div 
      className="text-[#4ade80] font-mono p-4 w-full h-full overflow-y-auto flex flex-col relative"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="absolute inset-0 pointer-events-none opacity-20 synth-grid" style={{ zIndex: 0 }}></div>
      <div className="relative z-10 flex flex-col h-full w-full">
        <div className="mb-4 opacity-90 border-b-2 border-[#4ade80]/50 pb-3 border-dashed shrink-0">
          <p className="text-xl tracking-wider font-bold mb-1 text-glow truncate overflow-hidden whitespace-nowrap lg:whitespace-normal w-full" style={{lineHeight: 1.5}}>M SAI CHARAN CMD</p>
          <p className="text-xs opacity-80 mt-1 uppercase font-bold text-glow">Cyberpunk Terminal OS v1.0. Ready.</p>
        </div>

        <AIAssistantPanel 
          currentCommand={input}
          currentPath={[]}
          completedChallenges={[]}
          failedAttempts={failedAttempts}
          isVisible={true}
        />

        <div className="space-y-1.5 opacity-100 text-[15px] font-bold tracking-wide flex-1 overflow-y-auto">
          {lines.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap leading-relaxed text-[#4ade80] text-glow">{l}</div>
          ))}

          <div className="flex mt-2 relative pb-6 text-glow items-center">
            <span className="mr-3 font-bold opacity-100">{getPrompt()}</span>
            <div className="relative flex-1 flex overflow-hidden">
              <input
                ref={inputRef}
                className="bg-transparent outline-none flex-1 text-transparent caret-transparent absolute inset-0 z-10 w-full"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoFocus
                tabIndex={0}
                aria-label="Terminal input"
              />
              <div className="flex-1 select-none pointer-events-none pt-[1px] text-[#4ade80]">
                {input}<span className="block-cursor bg-[#4ade80] w-3 h-[1.2rem] inline-block align-middle ml-1"></span>
              </div>
              {thinking && (
                <div className="absolute left-0 top-full mt-1 text-xs bg-black/90 border border-[#fbbf24] px-2 py-1 rounded shadow-lg text-[#fbbf24] font-mono z-20 animate-pulse flex items-center gap-1">
                  <span>🧠 Thinking</span>
                  <span className="animate-bounce inline-block">.</span>
                  <span className="animate-bounce inline-block animation-delay-100">.</span>
                  <span className="animate-bounce inline-block animation-delay-200">.</span>
                </div>
              )}
              {commandPreview && !thinking && (
                <div className="absolute left-0 top-full mt-1 text-xs bg-black/90 border border-[#4ade80]/70 px-2 py-1 rounded shadow-lg text-[#4ade80]/70 font-mono z-20">
                  → will run: <span className="font-bold text-[#4ade80]">{commandPreview}</span>
                </div>
              )}
              {suggestion && (
                <div className="absolute left-0 top-full mt-1 text-xs bg-black/90 border border-[#4ade80] px-2 py-1 rounded shadow-lg text-[#4ade80] font-mono z-20">
                  Did you mean <span className="font-bold">{suggestion}</span>? (Tab to autocomplete)
                </div>
              )}
              {nlpInterpretation.understood && (
                <div className="absolute left-0 top-full mt-1 text-xs bg-black/90 border border-[#fbbf24] px-2 py-1 rounded shadow-lg text-[#fbbf24] font-mono z-20">
                  🤖 Understood: <span className="font-bold">{nlpInterpretation.explanation}</span> → <span className="text-[#4ade80]">{nlpInterpretation.command}</span> (Press Enter)
                </div>
              )}
              {tabMatches.length > 0 && (
                <div className="absolute left-0 top-full mt-8 text-xs bg-black/90 border border-[#4ade80] px-2 py-1 rounded shadow-lg text-[#4ade80] font-mono z-20 flex flex-wrap gap-2 max-w-[400px]">
                  {tabMatches.map((m, i) => (
                    <span key={m} className={i === tabIndex ? "underline font-bold" : ""}>{m}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
