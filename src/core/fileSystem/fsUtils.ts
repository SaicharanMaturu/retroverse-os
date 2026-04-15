import { fileSystem } from "./fs";
import type { FileNode } from "./fs";

export function getNode(path: string[]): FileNode | null {
  let current: FileNode | undefined = fileSystem;

  for (let p of path) {
    if (!current || !current.children) return null;
    current = current.children.find((c: FileNode) => c.name === p);
    if (!current) return null;
  }

  return current || null;
}

// Convert path string to array and resolve relative paths
export function resolvePath(pathStr: string, currentPath: string[]): string[] {
  if (pathStr === "/") {
    return [];
  }

  if (pathStr.startsWith("/")) {
    // Absolute path
    return pathStr
      .split("/")
      .filter((p) => p !== "")
      .map((p) => p === "~" ? "home/user" : p)
      .join("/")
      .split("/");
  }

  // Relative path
  const parts = pathStr.split("/");
  let result = [...currentPath];

  for (const part of parts) {
    if (part === "" || part === ".") {
      // Do nothing
    } else if (part === "..") {
      result.pop();
    } else if (part === "~") {
      result = ["home", "user"];
    } else {
      result.push(part);
    }
  }

  return result;
}

// Get path string from array
export function pathToString(path: string[]): string {
  return "/" + path.join("/");
}

// Check if node exists and is of a specific type
export function nodeExists(path: string[], type?: "file" | "folder"): boolean {
  const node = getNode(path);
  if (!node) return false;
  if (type && node.type !== type) return false;
  return true;
}

// Get parent directory
export function getParent(path: string[]): string[] {
  return path.slice(0, -1);
}

// Get filename from path
export function getBasename(path: string[]): string {
  return path[path.length - 1] || "root";
}

// Get directory name from path
export function getDirname(path: string[]): string[] {
  return path.slice(0, -1);
}

// List directory contents with options
export function listDirectory(
  path: string[],
  options: { all?: boolean; long?: boolean } = {}
): { name: string; type: string; permissions?: string; size?: number; content?: string }[] {
  const node = getNode(path);
  if (!node || node.type !== "folder" || !node.children) {
    return [];
  }

  const items = node.children;
  const result = items
    .filter((item) => options.all || !item.name.startsWith("."))
    .map((item) => ({
      name: item.name,
      type: item.type,
      permissions: item.permissions || "755",
      size: item.type === "file" ? (item.content || "").length : 0,
      content: item.content,
    }));

  return result;
}

// Deep copy node
export function deepCopyNode(node: FileNode): FileNode {
  return JSON.parse(JSON.stringify(node));
}

// Get all files recursively
export function findAllFiles(path: string[], pattern?: string): string[] {
  const node = getNode(path);
  if (!node) return [];

  const results: string[] = [];

  function traverse(current: FileNode, currentPath: string[]) {
    if (current.type === "file") {
      const pathStr = "/" + currentPath.join("/");
      if (!pattern || pathStr.includes(pattern)) {
        results.push(pathStr);
      }
    } else if (current.type === "folder" && current.children) {
      for (const child of current.children) {
        traverse(child, [...currentPath, child.name]);
      }
    }
  }

  if (node.type === "file") {
    return ["/" + path.join("/")];
  } else if (node.type === "folder" && node.children) {
    for (const child of node.children) {
      traverse(child, [...path, child.name]);
    }
  }

  return results;
}

// Format file info for ls -l
export function formatFileInfo(item: FileNode, width: number = 50): string {
  const type = item.type === "folder" ? "d" : "-";
  const perms = item.permissions || (item.type === "folder" ? "755" : "644");
  const owner = item.owner || "root";
  const group = item.group || "root";
  const size = item.type === "folder" ? "-" : ((item.content || "").length.toString().padStart(5));
  const date = new Date(item.modified || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const name = item.name + (item.type === "folder" ? "/" : "");
  return `${type}${perms} ${owner.padEnd(8)} ${group.padEnd(8)} ${size} ${date} ${name.substring(0, width)}`;
}
