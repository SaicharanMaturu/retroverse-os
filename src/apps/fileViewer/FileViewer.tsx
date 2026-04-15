import { useState, useEffect, useCallback } from "react";
import { getNode } from "../../core/fileSystem/fsUtils";
import { useFSStore } from "../../store/useFSStore";
import { useOSStore } from "../../store/useOSStore";

export default function FileViewer({ filePath, windowId }: { filePath: string, windowId: string }) {
  const version = useFSStore(s => s.version);
  const node = getNode(filePath.split("/"));
  
  const [content, setContent] = useState(node?.content || "");
  const setWindowDirty = useOSStore(s => s.setWindowDirty);
  const registerSaveHandler = useOSStore(s => s.registerSaveHandler);
  const unregisterSaveHandler = useOSStore(s => s.unregisterSaveHandler);

  // Re-sync local content if node changes structurally
  useEffect(() => {
    if (node && node.type === "file") {
      setContent(node.content || "");
    }
  }, [node, version]);

  const isDirty = node ? content !== node.content : false;

  useEffect(() => {
    if (windowId) {
      setWindowDirty(windowId, isDirty);
    }
  }, [isDirty, windowId, setWindowDirty]);

  const save = useCallback(() => {
    if (node && windowId) {
      node.content = content;
      useFSStore.getState().notifyFSChange();
      setWindowDirty(windowId, false);
    }
  }, [content, node, windowId, setWindowDirty]);

  useEffect(() => {
    if (windowId) {
      registerSaveHandler(windowId, save);
      return () => unregisterSaveHandler(windowId);
    }
  }, [windowId, save, registerSaveHandler, unregisterSaveHandler]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      save();
    }
  };

  return (
    <div className="w-full h-full bg-transparent text-[#4ade80] font-mono p-4 overflow-auto">
      {node && node.type === "file" ? (
        <textarea 
           className="w-full h-full bg-transparent outline-none resize-none"
           value={content} 
           onChange={(e) => setContent(e.target.value)}
           onKeyDown={handleKeyDown}
           spellCheck={false}
        />
      ) : (
        <div className="text-red-500 font-bold">ERR: FILE CORRUPTED OR MOVED.</div>
      )}
    </div>
  );
}
