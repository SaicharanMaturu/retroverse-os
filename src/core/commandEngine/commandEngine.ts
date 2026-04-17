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
let commandHistory: string[] = [];
let aliases: Record<string, string> = {};
let environment: Record<string, string> = {
  USER: "retroverse",
  HOME: "/home",
  PATH: "/bin:/usr/bin:/usr/local/bin",
  SHELL: "/bin/bash",
  OS: "RetroOS-v1.0",
  VERSION: "1.0.0",
};
let theme: "dark" | "neon" | "retro" = "dark";
let commandCount = 0;
let achievements: Record<string, boolean> = {
  first_command: false,
  ten_commands: false,
  file_explorer: false,
  system_admin: false,
};
const tips = [
  "💡 Use 'man <command>' to learn about any command",
  "💡 Press Tab to autocomplete command names",
  "💡 Use arrow up/down to navigate command history",
  "💡 Try 'alias myls=ls' to create command shortcuts",
  "💡 Use 'calc' for quick math: calc 100*2",
  "💡 'env' shows all environment variables",
  "💡 'history' shows all your previous commands",
  "💡 'find' can search for files by pattern",
  "💡 'grep' searches inside file contents",
  "💡 'mkdir -p' creates nested folders",
];
const manDatabase: Record<string, string> = {
  ls: "LIST - List directory contents\nUsage: ls\nShow all files and folders in current directory",
  cd: "CHANGE DIRECTORY - Navigate to folder\nUsage: cd <folder>\nExample: cd home\nUse 'cd ..' to go back",
  mkdir: "MAKE DIRECTORY - Create new folder\nUsage: mkdir <name>\nExample: mkdir projects",
  touch: "CREATE FILE - Create empty file\nUsage: touch <filename>\nExample: touch notes.txt",
  cat: "CONCATENATE - Display file contents\nUsage: cat <filename>\nExample: cat readme.txt",
  rm: "REMOVE - Delete file or folder\nUsage: rm <name>\nWARNING: Permanent deletion",
  cp: "COPY - Duplicate file or folder\nUsage: cp <source> <destination>\nExample: cp old.txt new.txt",
  mv: "MOVE/RENAME - Move or rename file\nUsage: mv <source> <destination>\nExample: mv old.txt new.txt",
  pwd: "PRINT WORKING DIRECTORY - Show current path\nUsage: pwd\nShows full path from root",
  echo: "ECHO - Print text\nUsage: echo <text>\nExample: echo Hello World",
  grep: "GLOBAL REGULAR EXPRESSION - Search in files\nUsage: grep <pattern> <file>\nExample: grep 'hello' file.txt",
  find: "FIND - Search for files\nUsage: find <pattern>\nExample: find *.txt",
  head: "HEAD - Show first lines\nUsage: head <file> [lines]\nDefault: 5 lines",
  tail: "TAIL - Show last lines\nUsage: tail <file> [lines]\nDefault: 5 lines",
  wc: "WORD COUNT - Count lines/words/bytes\nUsage: wc <file>",
  sort: "SORT - Sort file lines\nUsage: sort <file>",
  uniq: "UNIQUE - Remove duplicate lines\nUsage: uniq <file>",
  chmod: "CHANGE MODE - Change permissions\nUsage: chmod <perms> <file>",
  date: "DATE - Show current date and time\nUsage: date",
  whoami: "WHO AM I - Show current user\nUsage: whoami",
  uname: "UNIX NAME - Show OS info\nUsage: uname",
  uptime: "UPTIME - Show system uptime\nUsage: uptime",
  df: "DISK FREE - Show disk usage\nUsage: df",
  ps: "PROCESS - Show running processes\nUsage: ps",
  file: "FILE - Detect file type\nUsage: file <filename>",
  stat: "STAT - Show file statistics\nUsage: stat <filename>",
  ln: "LINK - Create symbolic link\nUsage: ln <source> <target>",
  basename: "BASENAME - Get filename only\nUsage: basename <path>",
  dirname: "DIRNAME - Get directory path\nUsage: dirname <path>",
  cut: "CUT - Extract columns\nUsage: cut -f <fields> <file>",
  paste: "PASTE - Combine lines\nUsage: paste <file1> <file2>",
  tr: "TRANSLATE - Change characters\nUsage: tr <source> <dest>",
  rev: "REVERSE - Reverse line contents\nUsage: rev <file>",
  nl: "NUMBER LINES - Add line numbers\nUsage: nl <file>",
  col: "COLUMNS - Format columns\nUsage: col <file>",
  history: "HISTORY - Show command history\nUsage: history\nShows all commands you've run",
  alias: "ALIAS - Create command shortcut\nUsage: alias <name> <command>\nExample: alias ll='ls -la'",
  env: "ENVIRONMENT - Show env variables\nUsage: env\nShows all system environment variables",
  export: "EXPORT - Set environment variable\nUsage: export VAR=value",
  time: "TIME - Measure execution time\nUsage: time <command>",
  which: "WHICH - Find command location\nUsage: which <command>",
  calc: "CALCULATOR - Perform math\nUsage: calc <expression>\nExample: calc 2+2*3",
  bc: "CALCULATOR - Alternative math\nUsage: bc <expression>",
  help: "HELP - Show available commands\nUsage: help",
  clear: "CLEAR - Clear terminal screen\nUsage: clear",
  about: "ABOUT - Show project info\nUsage: about",
  man: "MANUAL - Show command help\nUsage: man <command>\nExample: man ls",
  system: "SYSTEM - Show system stats\nUsage: system",
  theme: "THEME - Change terminal theme\nUsage: theme <dark|neon|retro>",
  tip: "TIP - Show random tip\nUsage: tip",
  achievements: "ACHIEVEMENTS - Show your badges and progress\nUsage: achievements\nTrack milestones and unlocked achievements",
  stats: "STATISTICS - View detailed activity stats\nUsage: stats\nSee commands run, files created, success rate",
  challenges: "CHALLENGES - View learning objectives\nUsage: challenges\nComplete learning goals to progress",
  banner: "BANNER - Show welcome screen\nUsage: banner\nDisplays RetroVerse OS welcome banner",
  skills: "SKILLS - View skill progression\nUsage: skills\nTrack your mastery levels across different areas",
};

export function getPrompt(): string {
  return "/" + currentPath.join("/") + " >";
}

function ls(): string {
  recordAchievement();
  return lsColored();
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

// ===== SYSTEM INFO COMMANDS =====
function date(): string {
  return new Date().toLocaleString();
}

function whoami(): string {
  return environment.USER;
}

function uname(): string {
  return `${environment.OS} (RetroOS kernel 4.4.0)`;
}

function uptime(): string {
  const ms = Date.now();
  const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return `System up ${days} days, ${hours} hours`;
}

function df(): string {
  const total = 1000; // MB
  const used = 234 + Math.random() * 100;
  const available = total - used;
  return `Filesystem  Size  Used  Avail  Use%\nroot        ${total}M  ${used.toFixed(0)}M  ${available.toFixed(0)}M  ${((used/total)*100).toFixed(0)}%`;
}

function ps(): string {
  return `PID  NAME         STATE      MEM\n1    init         running    2.1%\n42   terminal     running    5.3%\n99   kernel       running    1.8%\n234  shell        running    3.2%`;
}

// ===== FILE TOOLS =====
function file(name: string): string {
  if (!name) return "Usage: file <filename>";
  const node = getNode(currentPath);
  if (!node || !node.children) return "Cannot read";
  const item = node.children.find((c: any) => c.name === name);
  if (!item) return `${name}: cannot open`;
  if (item.type === "folder") return `${name}: directory`;
  const content = item.content || "";
  if (content.match(/^[\x00-\x08\x0B-\x0C\x0E-\x1F]/)) return `${name}: binary data`;
  if (content.match(/^\{[\s\S]*\}$/) || content.match(/^\[[\s\S]*\]$/)) return `${name}: JSON text`;
  return `${name}: ASCII text`;
}

function stat(name: string): string {
  if (!name) return "Usage: stat <filename>";
  const node = getNode(currentPath);
  if (!node || !node.children) return "Cannot stat";
  const item = node.children.find((c: any) => c.name === name);
  if (!item) return `stat: cannot stat '${name}'`;
  const size = item.type === "file" ? (item.content || "").length : 4096;
  const now = new Date().toISOString();
  return `File: ${name}\nSize: ${size}B  Blocks: ${Math.ceil(size/512)}  Type: ${item.type === "folder" ? "directory" : "regular file"}\nAccess: (0644)  Uid: (1000)  Gid: (1000)\nModify: ${now}`;
}

function ln(src: string, dest: string): string {
  if (!src || !dest) return "Usage: ln <source> <target>";
  return `Created link ${dest} -> ${src}`;
}

function basename(path: string): string {
  if (!path) return "Usage: basename <path>";
  return path.split("/").pop() || path;
}

function dirname(path: string): string {
  if (!path) return "Usage: dirname <path>";
  const parts = path.split("/");
  if (parts.length <= 1) return ".";
  parts.pop();
  return parts.join("/") || "/";
}

// ===== TEXT PROCESSING =====
function cut(args: string[]): string {
  if (args.length === 0) return "Usage: cut -f <fields> <file>";
  // Simplified: cut -f 1,2 filename
  const fileIdx = args.findIndex(a => !a.startsWith("-"));
  if (fileIdx === -1) return "No file specified";
  const fileName = args[fileIdx];
  const node = getNode(currentPath);
  if (!node || !node.children) return "Cannot read";
  const file = node.children.find((c: any) => c.name === fileName && c.type === "file");
  if (!file) return `${fileName}: cannot open`;
  const lines = (file.content || "").split("\n");
  return lines.map(l => l.split("\t")[0]).join("\n");
}

function paste(args: string[]): string {
  if (args.length === 0) return "Usage: paste <file1> <file2> ...";
  const node = getNode(currentPath);
  if (!node || !node.children) return "Cannot read";
  const files = args.map(name => {
    const f = node.children!.find((c: any) => c.name === name && c.type === "file");
    return f ? (f.content || "").split("\n") : [];
  });
  const maxLen = Math.max(...files.map(f => f.length));
  const result = [];
  for (let i = 0; i < maxLen; i++) {
    result.push(files.map((f) => f[i] || "").join("\t"));
  }
  return result.join("\n");
}

function tr(args: string[]): string {
  if (args.length < 2) return "Usage: tr <source> <dest>";
  // Simple translation: tr 'a' 'b' (reads from stdin, we'll just show usage)
  return `tr: translating '${args[0]}' to '${args[1]}'`;
}

function rev(name: string): string {
  if (!name) return "Usage: rev <file>";
  const node = getNode(currentPath);
  if (!node || !node.children) return "Cannot read";
  const file = node.children.find((c: any) => c.name === name && c.type === "file");
  if (!file) return `${name}: cannot open`;
  return (file.content || "").split("\n").map(l => l.split("").reverse().join("")).join("\n");
}

function nl(name: string): string {
  if (!name) return "Usage: nl <file>";
  const node = getNode(currentPath);
  if (!node || !node.children) return "Cannot read";
  const file = node.children.find((c: any) => c.name === name && c.type === "file");
  if (!file) return `${name}: cannot open`;
  const lines = (file.content || "").split("\n");
  return lines.map((l, i) => `${(i + 1).toString().padStart(6)}  ${l}`).join("\n");
}

function col(name: string): string {
  if (!name) return "Usage: col <file>";
  // Simplified column formatter
  const node = getNode(currentPath);
  if (!node || !node.children) return "Cannot read";
  const file = node.children.find((c: any) => c.name === name && c.type === "file");
  if (!file) return `${name}: cannot open`;
  return (file.content || "").split("\n").map(l => l.split("\t").join("  ")).join("\n");
}

// ===== HISTORY & CONFIG =====
function historyCmd(): string {
  if (commandHistory.length === 0) return "No command history";
  return commandHistory.map((c, i) => `${i + 1}  ${c}`).join("\n");
}

function alias(arg1: string, arg2: string): string {
  if (!arg1) return Object.entries(aliases).map(([k, v]) => `alias ${k}='${v}'`).join("\n") || "No aliases defined";
  if (!arg2) return `alias: ${arg1}: not found`;
  aliases[arg1] = arg2;
  return "";
}

function env(): string {
  return Object.entries(environment).map(([k, v]) => `${k}=${v}`).join("\n");
}

function exportCmd(arg: string): string {
  if (!arg) return "Usage: export VAR=value";
  const [key, value] = arg.split("=");
  if (!value) return `export: ${key}: not set`;
  environment[key] = value;
  return "";
}

// ===== UTILITY =====
function time_cmd(cmd: string): string {
  if (!cmd) return "Usage: time <command>";
  const ms = Math.random() * 100 + 10;
  return `${cmd}  ${(ms / 1000).toFixed(3)}s user  ${(ms / 1000).toFixed(3)}s system`;
}

function which(cmd: string): string {
  if (!cmd) return "Usage: which <command>";
  const commands = ["ls", "cd", "mkdir", "cat", "echo"];
  if (commands.includes(cmd)) return `/bin/${cmd}`;
  return `which: ${cmd}: not found`;
}

function calc(expr: string): string {
  if (!expr) return "Usage: calc <expression> (e.g., calc 2+2*3)";
  try {
    // Safe eval - only allow numeric operations
    if (!/^[\d\s+\-*/.()]*$/.test(expr)) return "Error: invalid characters";
    const result = Function('"use strict"; return (' + expr + ')')();
    return result.toString();
  } catch (e) {
    return `Error: ${expr}`;
  }
}

// ===== NEW FEATURES =====
function man(cmd: string): string {
  if (!cmd) return "Usage: man <command>\nExample: man ls\n\nAvailable commands: " + Object.keys(manDatabase).join(", ");
  const help = manDatabase[cmd];
  if (!help) return `No manual entry for '${cmd}'`;
  return help;
}

function about(): string {
  return `
╔════════════════════════════════════════╗
║      RetroVerse OS v1.0                ║
║   A Minimal Cyberpunk Terminal         ║
║                                        ║
║  • 52+ Real Commands                   ║
║  • 276KB Bundle Size                   ║
║  • Built with React + TypeScript       ║
║  • Deployed with Netlify               ║
║                                        ║
║  GitHub: SaicharanMaturu/retroverse-os ║
║  Live: superb-gumption-8d1fd5.netlify  ║
╚════════════════════════════════════════╝
`;
}

function systemCmd(): string {
  const days = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % 365;
  const hours = Math.floor(Date.now() / (1000 * 60 * 60)) % 24;
  const used = 234 + Math.random() * 100;
  const total = 1000;
  return `
╔═══ SYSTEM STATS ═══╗
hostname: retroverse
kernel: RetroOS 4.4.0
uptime: ${days}d ${hours}h
memory: ${used.toFixed(0)}MB / ${total}MB (${((used/total)*100).toFixed(1)}%)
cpu: 42% load avg
commands: 52+ available
theme: ${theme}
commands run: ${commandCount}
╚═══════════════════╝
`;
}

function theme_cmd(newTheme: string): string {
  const themes = ["dark", "neon", "retro"];
  if (!newTheme) return `Current theme: ${theme}\nAvailable: ${themes.join(", ")}`;
  if (!themes.includes(newTheme)) return `Unknown theme. Use: ${themes.join(", ")}`;
  theme = newTheme as any;
  return `Theme changed to: ${newTheme} ✓`;
}

function tip(): string {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  return randomTip;
}

function recordAchievement(): void {
  commandCount++;
  if (commandCount === 1) achievements.first_command = true;
  if (commandCount === 10) achievements.ten_commands = true;
}

function lsColored(): string {
  const node = getNode(currentPath);
  if (!node || !Array.isArray(node.children)) return "Empty";
  if (node.children.length === 0) return "(empty directory)";
  
  return node.children.map((c: any) => {
    if (c.type === "folder") {
      return `📁 ${c.name}/`;
    } else {
      return `📄 ${c.name}`;
    }
  }).join("  ");
}

function achievementsCmd(): string {
  const unlockedCount = Object.values(achievements).filter(Boolean).length;
  const progress = Math.round((unlockedCount / 4) * 100);
  
  return `
╔═══ 🏆 ACHIEVEMENTS ═══╗
║
║  Total Commands Run: ${commandCount}
║  Achievements Unlocked: ${unlockedCount}/4
║  Progress: ${'█'.repeat(Math.floor(progress/10))}${'░'.repeat(10-Math.floor(progress/10))} ${progress}%
║
║  ${achievements.first_command ? '✅' : '🔒'} First Command - Run 1 command
║  ${achievements.ten_commands ? '✅' : '🔒'} Command Master - Run 10 commands  
║  ${achievements.file_explorer ? '✅' : '🔒'} File Explorer - Create 5 files
║  ${achievements.system_admin ? '✅' : '🔒'} System Admin - Run system commands
║
╚═══════════════════════╝
`;
}

function stats(): string {
  const filesCreated = Object.keys(aliases).length + 2;
  const foldersCreated = 3;
  const successRate = Math.round((commandCount / Math.max(commandCount - 2, 1)) * 100);
  
  return `
╔═══ 📊 STATISTICS ═══╗
║
║  Commands Run: ${commandCount}
║  Files Created: ~${filesCreated}
║  Folders Created: ~${foldersCreated}
║  Success Rate: ${successRate}%
║  Theme: ${theme}
║  
║  Today's Activity:
║    • Morning: Light usage
║    • Afternoon: ${Math.floor(commandCount * 0.6)} commands
║    • Total: ${commandCount} commands
║
╚══════════════════════╝
`;
}

function challenges(): string {
  const challengeProgress = Math.min(Math.floor(commandCount / 5), 100);
  
  return `
╔═══ 🎯 CHALLENGES ═══╗
║
║  1. Beginner
║    └ Run 5 commands
║      Progress: ${'█'.repeat(Math.floor(challengeProgress/10))}${'░'.repeat(10-Math.floor(challengeProgress/10))} ${Math.min(challengeProgress, 100)}%
║
║  2. Intermediate  
║    └ Create 3 files
║      Progress: ${'█'.repeat(3)}${'░'.repeat(7)} 30%
║
║  3. Advanced
║    └ Use 10 different commands
║      Progress: ${'█'.repeat(Math.min(Math.floor(commandCount/10)*10, 10))}${'░'.repeat(Math.max(10-Math.floor(commandCount/10)*10, 0))} ${Math.min(Math.floor((commandCount/10)*100), 100)}%
║
║  4. Master
║    └ Run 50 commands
║      Progress: ${'█'.repeat(Math.floor(Math.min(commandCount, 50)/5))}${'░'.repeat(Math.max(10-Math.floor(Math.min(commandCount, 50)/5), 0))} ${Math.floor((Math.min(commandCount, 50)/50)*100)}%
║
╚══════════════════════╝
`;
}

function banner(): string {
  return `
 ╔════════════════════════════════════════════════════════╗
 ║                                                        ║
 ║   ██████╗ ███████╗████████╗██████╗  ██████╗ ██████╗   ║
 ║   ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗██╔══██╗  ║
 ║   ██████╔╝█████╗     ██║   ██████╔╝██║   ██║██████╔╝  ║
 ║   ██╔══██╗██╔══╝     ██║   ██╔══██╗██║   ██║██╔══██╗  ║
 ║   ██║  ██║███████╗   ██║   ██║  ██║╚██████╔╝██║  ██║  ║
 ║   ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝  ║
 ║                   OS v1.0                             ║
 ║                                                        ║
 ║   Welcome to RetroVerse - A Cyberpunk Terminal        ║
 ║                                                        ║
 ║   Type 'help' for commands                            ║
 ║   Type 'man <cmd>' for help on specific commands      ║
 ║   Type 'banner' to see this screen again              ║
 ║                                                        ║
 ╚════════════════════════════════════════════════════════╝
`;
}

function skills(): string {
  const cmdSkill = Math.min(Math.floor(commandCount / 10), 10);
  const fileSkill = Math.min(6, 6);
  const sysSkill = Math.min(4, 4);
  const advSkill = Math.min(Math.floor(commandCount / 15), 10);
  
  return `
╔═══ 🚀 SKILL PROGRESSION ═══╗
║
║  Command Mastery
║  ${'█'.repeat(cmdSkill)}${'░'.repeat(10-cmdSkill)} Level ${cmdSkill + 1}
║
║  File Operations
║  ${'█'.repeat(fileSkill)}${'░'.repeat(10-fileSkill)} Level ${fileSkill}
║
║  System Knowledge
║  ${'█'.repeat(sysSkill)}${'░'.repeat(10-sysSkill)} Level ${sysSkill}
║
║  Advanced Techniques
║  ${'█'.repeat(advSkill)}${'░'.repeat(10-advSkill)} Level ${advSkill + 1}
║
║  Overall Rank: ${['Novice', 'Apprentice', 'Journeyman', 'Expert', 'Master'][Math.min(Math.floor((cmdSkill + fileSkill + sysSkill + advSkill) / 10), 4)]}
║
╚════════════════════════════════╝
`;
}

// Rule-based smart AI command runner with LLM support
export async function runCommand(input: string): Promise<string> {
  if (!input.trim()) return "";
  
  // Record command to history
  commandHistory.push(input);

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
    
    // ✨ NEW COMMANDS
    case "man": return man(args[0]);
    case "about": return about();
    case "system": return systemCmd();
    case "theme": return theme_cmd(args[0]);
    case "tip": return tip();
    
    // System Info
    case "date": return date();
    case "whoami": return whoami();
    case "uname": return uname();
    case "uptime": return uptime();
    case "df": return df();
    case "ps": return ps();
    
    // File Tools
    case "file": return file(args[0]);
    case "stat": return stat(args[0]);
    case "ln": return ln(args[0], args[1]);
    case "basename": return basename(args[0]);
    case "dirname": return dirname(args[0]);
    
    // Text Processing
    case "cut": return cut(args);
    case "paste": return paste(args);
    case "tr": return tr(args);
    case "rev": return rev(args[0]);
    case "nl": return nl(args[0]);
    case "col": return col(args[0]);
    
    // History & Config
    case "history": return historyCmd();
    case "alias": return alias(args[0], args.slice(1).join(" "));
    case "env": return env();
    case "export": return exportCmd(args.join("="));
    
    // Utility
    case "time": return time_cmd(args.join(" "));
    case "which": return which(args[0]);
    case "calc":
    case "bc": return calc(args.join(""));
    
    // Advanced Commands
    case "grep": {
      recordAchievement();
      const result = AdvancedCommands.grep(args[0], args[1], currentPath);
      return result.output;
    }
    case "find": {
      recordAchievement();
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
    
    // ✨ NEW GAMIFICATION COMMANDS
    case "achievements": return achievementsCmd();
    case "stats": return stats();
    case "challenges": return challenges();
    case "banner": return banner();
    case "skills": return skills();
    
    default:
      recordAchievement();
      const sug = suggest(command);
      if (sug) return `Command not found. Did you mean: ${sug}?`;
      return "Command not found";
  }
}
