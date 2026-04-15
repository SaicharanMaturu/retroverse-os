import { useState, useEffect } from "react";
import { getNode } from "../core/fileSystem/fsUtils";
import { useFSStore } from "../store/useFSStore";

interface FileEditorProps {
  filepath: string;
  currentPath: string[];
  onClose: () => void;
}

export default function FileEditor({ filepath, currentPath, onClose }: FileEditorProps) {
  const [content, setContent] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load file content
    const node = getNode([...currentPath, filepath]);
    if (node && node.type === "file") {
      setContent(node.content || "");
      setIsModified(false);
    }
  }, [filepath, currentPath]);

  const handleSave = () => {
    setIsSaving(true);
    try {
      // Find the file node
      const fileNode = getNode([...currentPath, filepath]);
      if (fileNode && fileNode.type === "file") {
        fileNode.content = content;
        useFSStore.getState().notifyFSChange();
        setIsModified(false);
        setIsSaving(false);
      }
    } catch (err) {
      console.error("Save failed:", err);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-950 border-2 border-cyan-500 rounded-lg w-11/12 h-5/6 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900 to-purple-900 px-4 py-2 flex justify-between items-center border-b border-cyan-500">
          <h2 className="text-cyan-300 font-bold">📝 Edit File: {filepath}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Editor */}
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setIsModified(true);
          }}
          className="flex-1 bg-gray-900 text-green-300 p-4 font-mono text-sm resize-none focus:outline-none border-none"
          placeholder="File content here..."
        />

        {/* Footer */}
        <div className="bg-gray-800 px-4 py-3 border-t border-cyan-500 flex justify-between items-center">
          <div className="text-gray-400 text-sm">
            {isModified && <span className="text-yellow-400 mr-4">●  Modified</span>}
            <span>{content.split("\n").length} lines</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isModified || isSaving}
              className={`px-4 py-2 rounded font-bold ${
                isModified
                  ? "bg-green-600 hover:bg-green-500 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
