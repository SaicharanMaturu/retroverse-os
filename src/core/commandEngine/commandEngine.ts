function cp(src: string, dest: string): string {
  if (!src || !dest) return "Usage: cp <source> <destination>";
  const node = getNode(currentPath);
  if (!node || !Array.isArray(node.children)) return "Cannot copy here";
  const idx = node.children.findIndex((c: any) => c.name === src);
  if (idx === -1) return `Source not found: ${src}`;
  const item = node.children[idx];
  if (node.children.some((c: any) => c.name === dest)) {
    return `Destination already exists: ${dest}`;
  }
  // Deep copy for folders
  function deepCopy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }
  const copy = deepCopy(item);
  copy.name = dest;
  node.children.push(copy);
  useFSStore.getState().notifyFSChange();
  return `Copied ${src} to ${dest}`;
}

function mv(src: string, dest: string): string {
  if (!src || !dest) return "Usage: mv <source> <destination>";
  const node = getNode(currentPath);
  if (!node || !Array.isArray(node.children)) return "Cannot move here";
  const idx = node.children.findIndex((c: any) => c.name === src);
  if (idx === -1) return `Source not found: ${src}`;
  if (node.children.some((c: any) => c.name === dest)) {
    return `Destination already exists: ${dest}`;
  }
  node.children[idx].name = dest;
  useFSStore.getState().notifyFSChange();
  return `Renamed/Moved ${src} to ${dest}`;
}
function rm(name: string): string {
  if (!name) return "Specify file or folder name";
  const node = getNode(currentPath);
  if (!node || !Array.isArray(node.children)) return "Cannot remove here";
  const idx = node.children.findIndex((c: any) => c.name === name);
  if (idx === -1) {
    // Fuzzy match
    const all = node.children.map((c: any) => c.name);
    const suggestion = fuzzyMatch(name, all);
    if (suggestion) {
      return `Not found. Did you mean: ${suggestion}?`;
    }
    return "File or folder not found";
  }
  node.children.splice(idx, 1);
  useFSStore.getState().notifyFSChange();
  return `Removed: ${name}`;
}

import { getNode } from "../fileSystem/fsUtils";
import { useFSStore } from "../../store/useFSStore";
import { smartMap } from "./smartCommands";
import { helpDB } from "./helpDatabase";
import { suggest } from "../../utils/suggestions";
import { callLLM } from "../aiService";
import { generateOfflineResponse } from "./knowledgeBase";
import { AdvancedCommands } from "../advancedCommands";

function pwd(): string {
  return "/" + currentPath.join("/");
}

function fuzzyMatch(name: string, candidates: string[]): string | null {
  let best = null;
  let bestDist = Infinity;
  for (const c of candidates) {
    const dist = levenshtein(name, c);
    if (dist < bestDist) {
      bestDist = dist;
      best = c;
    }
  }
  return bestDist <= 2 ? best : null;
}

function levenshtein(a: string, b: string): number {
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

let currentPath: string[] = ["home"];

export function getPrompt(): string {
  return "/" + currentPath.join("/") + " >";
}

function ls(): string {
  const node = getNode(currentPath);
  if (!node || !Array.isArray(node.children)) return "Empty";
  if (node.children.length === 0) return "";
  return node.children.map((c: any) => `${c.name}${c.type === 'folder' ? '/' : ''}`).join("  ");
}

function cd(folder: string): string {
  if (!folder) return "Specify folder";

  if (folder === "..") {
    if (currentPath.length > 0) currentPath.pop();
    return "";
  }

  const node = getNode(currentPath);
  if (!node || !node.children) return "Folder not found";
  let target = folder;
  if (!node.children.some((c: any) => c.name === folder && c.type === "folder")) {
    // Fuzzy match
    const folders = node.children.filter((c: any) => c.type === "folder").map((c: any) => c.name);
    const suggestion = fuzzyMatch(folder, folders);
    if (suggestion) {
      target = suggestion;
    } else {
      return `Folder not found${folders.length ? `. Did you mean: ${folders.join(", ")}?` : ""}`;
    }
  }
  const newPath = [...currentPath, target];
  const found = getNode(newPath);
  if (!found || found.type !== "folder") {
    return "Folder not found";
  }
  currentPath = newPath;
  return "";
}

function mkdir(name: string): string {
  if (!name) return "Specify folder name";
  const node = getNode(currentPath);
  if (!node || !Array.isArray(node.children)) return "Cannot create folder here";
  if (node.children.some((c: any) => c.name === name)) {
    return "Folder already exists";
  }
  // Fuzzy suggestion for similar folder names
  const folders = node.children.filter((c: any) => c.type === "folder").map((c: any) => c.name);
  const suggestion = fuzzyMatch(name, folders);
  if (suggestion) {
    return `A similar folder exists: ${suggestion}`;
  }
  node.children.push({
    name,
    type: "folder",
    children: [],
  });
  useFSStore.getState().notifyFSChange();
  return `Folder ${name} created`;
}

function touch(name: string): string {
  if (!name) return "Specify file name";
  const node = getNode(currentPath);
  if (!node || !Array.isArray(node.children)) return "Cannot create file here";
  if (node.children.some((c: any) => c.name === name)) {
    return "File already exists";
  }
  // Fuzzy suggestion for similar file names
  const files = node.children.filter((c: any) => c.type === "file").map((c: any) => c.name);
  const suggestion = fuzzyMatch(name, files);
  if (suggestion) {
    return `A similar file exists: ${suggestion}`;
  }
  node.children.push({
    name,
    type: "file",
    content: "",
  });
  useFSStore.getState().notifyFSChange();
  return `File ${name} created`;
}

function cat(name: string): string {
  if (!name) return "Specify file name";
  const node = getNode(currentPath);
  if (!node || !node.children) return "File not found";
  let target = name;
  if (!node.children.some((c: any) => c.name === name && c.type === "file")) {
    // Fuzzy match
    const files = node.children.filter((c: any) => c.type === "file").map((c: any) => c.name);
    const suggestion = fuzzyMatch(name, files);
    if (suggestion) {
      target = suggestion;
    } else {
      return `File not found${files.length ? `. Did you mean: ${files.join(", ")}?` : ""}`;
    }
  }
  const found = getNode([...currentPath, target]);
  if (!found || found.type !== "file") {
    return "File not found";
  }
  return found.content || "";
}

// Rule-based smart AI command runner with LLM support
export async function runCommand(input: string): Promise<string> {
  if (!input.trim()) return "";

  // 1. SMART LANGUAGE
  const mapped = smartMap(input);
  if (mapped) {
    return runCommand(mapped);
  }

  const [command, ...args] = input.split(" ");

  // 2. HELP AI - More intelligent question answering
  if (input.toLowerCase().startsWith("what is")) {
    const key = input.replace(/what is/i, "").trim().toLowerCase();
    const match = Object.keys(helpDB).find(k => k.includes(key) || key.includes(k));
    if (match) {
      return helpDB[match];
    }
    // Try offline knowledge base first
    const offlineResponse = generateOfflineResponse(input);
    if (!offlineResponse.includes("I can answer")) {
      return offlineResponse;
    }
    // Use AI only if offline response is generic
    try {
      const result = await callLLM(
        [{ role: "user", content: `Answer briefly: ${input}` }],
        { provider: "gemini" }
      );
      return result.output || offlineResponse;
    } catch {
      return offlineResponse;
    }
  }

  if (input.toLowerCase().startsWith("how to")) {
    const offlineResponse = generateOfflineResponse(input);
    if (!offlineResponse.includes("Try:")) {
      return offlineResponse;
    }
    return offlineResponse;
  }

  // Check if it's a general question (contains "?" or starts with question words)
  if (input.endsWith("?") || /^(who|what|where|when|why|how)\s/i.test(input)) {
    const offlineResponse = generateOfflineResponse(input);
    // If offline response is helpful, use it
    if (!offlineResponse.includes("I can answer")) {
      return offlineResponse;
    }
    // Otherwise try API
    try {
      const result = await callLLM(
        [{ role: "user", content: input }],
        { provider: "gemini" }
      );
      return result.output || offlineResponse;
    } catch (e) {
      return offlineResponse;
    }
  }

  // 3. REAL COMMANDS
  switch (command) {
    case "ls": return ls();
    case "cd": return cd(args[0]);
    case "mkdir": return mkdir(args[0]);
    case "touch": return touch(args[0]);
    case "cat": return cat(args[0]);
    case "rm": return rm(args[0]);
    case "cp": return cp(args[0], args[1]);
    case "mv": return mv(args[0], args[1]);
    case "pwd": return pwd();
    case "echo": return args.join(" ");
    case "clear": return "";
    case "help": return Object.keys(helpDB).join(", ");
    
    // Advanced Commands
    case "grep": {
      const result = AdvancedCommands.grep(args[0], args[1], currentPath);
      return result.output;
    }
    case "find": {
      const result = AdvancedCommands.find(args.join(" "), currentPath);
      return result.output;
    }
    case "head": {
      const lines = args[1] ? parseInt(args[1]) : 5;
      const result = AdvancedCommands.head(args[0], lines, currentPath);
      return result.output;
    }
    case "tail": {
      const lines = args[1] ? parseInt(args[1]) : 5;
      const result = AdvancedCommands.tail(args[0], lines, currentPath);
      return result.output;
    }
    case "wc": {
      const result = AdvancedCommands.wc(args[0], currentPath);
      return result.output;
    }
    case "sort": {
      const result = AdvancedCommands.sort(args[0], currentPath);
      return result.output;
    }
    case "uniq": {
      const result = AdvancedCommands.uniq(args[0], currentPath);
      return result.output;
    }
    case "chmod": {
      const result = AdvancedCommands.chmod(args[0], args[1], currentPath);
      return result.output;
    }
    
    default:
      const sug = suggest(command);
      if (sug) return `Command not found. Did you mean: ${sug}?`;
      return "Command not found";
  }
}
