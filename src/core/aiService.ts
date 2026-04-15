// aiService.ts
// Central LLM/AI agent service for the OS simulation
// Supports multi-provider (OpenAI, Gemini, local), multi-turn, context-aware, agentic workflows
// Extensible for RAG, plugins, analytics, and MLOps

// Gemini API endpoint (updated to v1 and latest model)
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// OpenAI API endpoint
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Provider abstraction
export type LLMProvider = "openai" | "gemini" | "local";

export interface LLMOptions {
  provider?: LLMProvider;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  context?: string[];
  tools?: string[];
  userId?: string;
}

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
}

export interface LLMResult {
  output: string;
  usage?: any;
  trace?: any;
  actions?: Array<{ type: string; payload: any }>;
}

// Session memory for multi-turn
const sessionMessages: LLMMessage[] = [];

// Main LLM call (mock for now)
export async function callLLM(
  messages: LLMMessage[],
  options: LLMOptions = {}
): Promise<LLMResult> {
  const provider = options.provider || "gemini";
  if (provider === "gemini") {
    if (!GEMINI_API_KEY) {
      return { output: "[Gemini API key not set. Please add it to .env.local as VITE_GEMINI_API_KEY]", usage: {}, trace: { provider: "gemini" }, actions: [] };
    }
    // Gemini expects a single prompt string
    const prompt = messages.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");
    try {
      const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
      if (!res.ok) {
        let errorText = await res.text();
        let errorMsg = `[Gemini error: ${res.status}`;
        try {
          const errJson = JSON.parse(errorText);
          errorMsg += ` - ${errJson.error?.message || errorText}`;
        } catch {
          errorMsg += ` - ${errorText}`;
        }
        errorMsg += "]";
        return { output: errorMsg, usage: {}, trace: { provider: "gemini", error: errorText }, actions: [] };
      }
      const data = await res.json();
      const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "[No response]";
      return { output, usage: {}, trace: { provider: "gemini", raw: data }, actions: [] };
    } catch (e: any) {
      return { output: `[Gemini error: ${e.message}]`, usage: {}, trace: { provider: "gemini" }, actions: [] };
    }
  }
  if (provider === "openai") {
    if (!OPENAI_API_KEY) {
      return { output: "[OpenAI API key not set. Please add it to .env.local as VITE_OPENAI_API_KEY]", usage: {}, trace: { provider: "openai" }, actions: [] };
    }
    try {
      const res = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 512
        })
      });
      if (!res.ok) {
        return { output: `[OpenAI error: ${res.status}]`, usage: {}, trace: { provider: "openai" }, actions: [] };
      }
      const data = await res.json();
      const output = data.choices?.[0]?.message?.content || "[No response]";
      return { output, usage: data.usage, trace: { provider: "openai", raw: data }, actions: [] };
    } catch (e: any) {
      return { output: `[OpenAI error: ${e.message}]`, usage: {}, trace: { provider: "openai" }, actions: [] };
    }
  }
  // fallback: echo
  const lastUser = messages.filter(m => m.role === "user").pop();
  return {
    output: `Echo: ${lastUser?.content}`,
    usage: {},
    trace: { provider: options.provider || "mock" },
    actions: []
  };
}

// Add message to session
export function addMessage(msg: LLMMessage) {
  sessionMessages.push(msg);
}

export function getSessionMessages() {
  return [...sessionMessages];
}

// Reset session
export function resetSession() {
  sessionMessages.length = 0;
}

// Example: High-level agentic command
export async function runAgenticCommand(
  input: string,
  options: LLMOptions = {}
): Promise<LLMResult> {
  addMessage({ role: "user", content: input });
  // TODO: Add context (file system, history, etc.)
  const result = await callLLM(getSessionMessages(), options);
  addMessage({ role: "assistant", content: result.output });
  return result;
}
