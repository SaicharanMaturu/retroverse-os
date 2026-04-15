import { useState } from "react";
import { getNode } from "../core/fileSystem/fsUtils";

interface FileTreeProps {
  currentPath: string[];
  onSelectFile?: (filepath: string) => void;
}

export default function FileTree({ currentPath, onSelectFile }: FileTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const node = getNode(currentPath);
  const children = node?.children || [];

  const toggleFolder = (name: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpanded(newExpanded);
  };

  const renderTree = (items: any[], depth = 0) => {
    return items.map((item) => (
      <div key={item.name}>
        <div
          className="flex items-center gap-2 px-2 py-1 hover:bg-gray-700 cursor-pointer"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (item.type === "folder") {
              toggleFolder(item.name);
            } else if (onSelectFile) {
              onSelectFile(item.name);
            }
          }}
        >
          {item.type === "folder" ? (
            <>
              <span className="text-cyan-400">
                {expanded.has(item.name) ? "📂" : "📁"}
              </span>
              <span className="text-cyan-300 font-semibold">{item.name}/</span>
            </>
          ) : (
            <>
              <span className="text-yellow-400">📄</span>
              <span className="text-gray-300">{item.name}</span>
            </>
          )}
        </div>

        {item.type === "folder" && expanded.has(item.name) && item.children && (
          <div>
            {renderTree(item.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="bg-gray-900 border-r border-cyan-500 w-64 h-full overflow-auto">
      <div className="p-3 font-bold text-cyan-300 border-b border-cyan-500">
        📁 File Explorer
      </div>
      <div className="p-2 text-sm">
        <div className="px-2 py-1 text-gray-400 text-xs mb-2">
          📍 /{currentPath.join("/")}
        </div>
        {children.length > 0 ? (
          renderTree(children)
        ) : (
          <div className="px-2 py-1 text-gray-500 text-xs italic">
            (empty folder)
          </div>
        )}
      </div>
    </div>
  );
}
