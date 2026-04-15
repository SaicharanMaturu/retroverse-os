// Advanced Commands: grep, pipes, redirects, find, chmod, etc.
import { getNode } from "./fileSystem/fsUtils";
import { useFSStore } from "../store/useFSStore";

export interface CommandResult {
  output: string;
  isError: boolean;
}

// GREP: Search for patterns in files
export function grep(pattern: string, filename: string, currentPath: string[]): CommandResult {
  if (!pattern || !filename) {
    return {
      output: "Usage: grep pattern filename",
      isError: true
    };
  }
  
  const node = getNode([...currentPath, filename]);
  if (!node || node.type !== "file") {
    return {
      output: `File not found: ${filename}`,
      isError: true
    };
  }
  
  const content = (node.content || "").split("\n");
  const matches = content
    .map((line, i) => line.includes(pattern) ? `${i + 1}: ${line}` : null)
    .filter(Boolean);
  
  if (matches.length === 0) {
    return {
      output: `No matches found for "${pattern}"`,
      isError: false
    };
  }
  
  return {
    output: matches.join("\n"),
    isError: false
  };
}

// FIND: Search for files by name
export function find(pattern: string, currentPath: string[]): CommandResult {
  const results: string[] = [];
  
  function search(node: any, path: string) {
    if (!node) return;
    
    if (node.name.includes(pattern)) {
      results.push(path);
    }
    
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        search(child, `${path}/${child.name}`);
      }
    }
  }
  
  const root = getNode(currentPath);
  if (root && root.children) {
    for (const child of root.children) {
      search(child, child.name);
    }
  }
  
  if (results.length === 0) {
    return {
      output: `No files found matching "${pattern}"`,
      isError: false
    };
  }
  
  return {
    output: results.join("\n"),
    isError: false
  };
}

// CHMOD: Change file permissions (simulated)
export function chmod(permissions: string, filename: string, currentPath: string[]): CommandResult {
  if (!permissions || !filename) {
    return {
      output: "Usage: chmod permissions filename",
      isError: true
    };
  }
  
  const permRegex = /^[0-7]{3}$/;
  if (!permRegex.test(permissions)) {
    return {
      output: `Invalid permissions: ${permissions}. Use 3-digit number (e.g., 755)`,
      isError: true
    };
  }
  
  const node = getNode([...currentPath, filename]);
  if (!node) {
    return {
      output: `File not found: ${filename}`,
      isError: true
    };
  }
  
  // Add permission metadata to node
  (node as any).permissions = permissions;
  useFSStore.getState().notifyFSChange();
  
  return {
    output: `Changed ${filename} permissions to ${permissions}`,
    isError: false
  };
}

// HEAD: Show first N lines of file
export function head(filename: string, lines: number = 5, currentPath: string[]): CommandResult {
  const node = getNode([...currentPath, filename]);
  if (!node || node.type !== "file") {
    return {
      output: `File not found: ${filename}`,
      isError: true
    };
  }
  
  const content = (node.content || "").split("\n").slice(0, lines).join("\n");
  return {
    output: content,
    isError: false
  };
}

// TAIL: Show last N lines of file
export function tail(filename: string, lines: number = 5, currentPath: string[]): CommandResult {
  const node = getNode([...currentPath, filename]);
  if (!node || node.type !== "file") {
    return {
      output: `File not found: ${filename}`,
      isError: true
    };
  }
  
  const content = (node.content || "").split("\n").slice(-lines).join("\n");
  return {
    output: content,
    isError: false
  };
}

// WC: Word/line count
export function wc(filename: string, currentPath: string[]): CommandResult {
  const node = getNode([...currentPath, filename]);
  if (!node || node.type !== "file") {
    return {
      output: `File not found: ${filename}`,
      isError: true
    };
  }
  
  const content = node.content || "";
  const lines = content.split("\n").length;
  const words = content.split(/\s+/).filter(w => w.length > 0).length;
  const chars = content.length;
  
  return {
    output: `  ${lines}  ${words}  ${chars}  ${filename}`,
    isError: false
  };
}

// SORT: Sort file contents
export function sort(filename: string, currentPath: string[]): CommandResult {
  const node = getNode([...currentPath, filename]);
  if (!node || node.type !== "file") {
    return {
      output: `File not found: ${filename}`,
      isError: true
    };
  }
  
  const sorted = (node.content || "")
    .split("\n")
    .sort()
    .join("\n");
  
  return {
    output: sorted,
    isError: false
  };
}

// UNIQ: Show unique lines
export function uniq(filename: string, currentPath: string[]): CommandResult {
  const node = getNode([...currentPath, filename]);
  if (!node || node.type !== "file") {
    return {
      output: `File not found: ${filename}`,
      isError: true
    };
  }
  
  const unique = Array.from(new Set((node.content || "").split("\n"))).join("\n");
  
  return {
    output: unique,
    isError: false
  };
}

// TALLY: Count occurrences (alias for uniq -c)
export function tally(filename: string, currentPath: string[]): CommandResult {
  const node = getNode([...currentPath, filename]);
  if (!node || node.type !== "file") {
    return {
      output: `File not found: ${filename}`,
      isError: true
    };
  }
  
  const lines = (node.content || "").split("\n");
  const counts: Record<string, number> = {};
  
  lines.forEach(line => {
    counts[line] = (counts[line] || 0) + 1;
  });
  
  const results = Object.entries(counts)
    .map(([line, count]) => `${count} ${line}`)
    .join("\n");
  
  return {
    output: results,
    isError: false
  };
}

// TR: Transform/replace characters
export function tr(from: string, to: string, text: string): CommandResult {
  if (from.length !== to.length) {
    return {
      output: "Error: from and to must be same length",
      isError: true
    };
  }
  
  let result = text;
  for (let i = 0; i < from.length; i++) {
    result = result.replaceAll(from[i], to[i]);
  }
  
  return {
    output: result,
    isError: false
  };
}

// File redirection simulation
export function redirectToFile(
  output: string,
  filename: string,
  currentPath: string[],
  append: boolean = false
): CommandResult {
  const parentNode = getNode(currentPath);
  if (!parentNode || !Array.isArray(parentNode.children)) {
    return {
      output: `Cannot write to ${filename}`,
      isError: true
    };
  }
  
  let node = parentNode.children.find((c: any) => c.name === filename);
  
  if (!node) {
    // Create new file
    node = {
      name: filename,
      type: "file",
      content: output
    };
    parentNode.children.push(node);
  } else if (node.type === "file") {
    // Update existing file
    if (append) {
      node.content = (node.content || "") + "\n" + output;
    } else {
      node.content = output;
    }
  } else {
    return {
      output: `${filename} is not a file`,
      isError: true
    };
  }
  
  useFSStore.getState().notifyFSChange();
  
  return {
    output: `Output redirected to ${filename}`,
    isError: false
  };
}

// Parse pipes
export function parsePipes(input: string): string[] {
  return input.split("|").map(cmd => cmd.trim());
}

export const AdvancedCommands = {
  grep,
  find,
  chmod,
  head,
  tail,
  wc,
  sort,
  uniq,
  tally,
  tr,
  redirectToFile,
  parsePipes
};
