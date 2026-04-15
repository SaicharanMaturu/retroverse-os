import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { useOSStore } from "../../store/useOSStore";

export default function Window({ id, title, children }: any) {
  const windowState = useOSStore((s) => s.windows.find(w => w.id === id));
  const closeWindow = useOSStore((s) => s.closeWindow);
  const focusWindow = useOSStore((s) => s.focusWindow);
  const toggleMinimize = useOSStore((s) => s.toggleMinimize);
  const toggleMaximize = useOSStore((s) => s.toggleMaximize);
  
  const nodeRef = useRef<HTMLDivElement>(null);
  const [showClosePrompt, setShowClosePrompt] = useState(false);
  const isDirty = useOSStore(s => s.dirtyWindows[id]);
  const saveHandler = useOSStore(s => s.saveHandlers[id]);

  if (!windowState) return null;
  const { isMinimized, isMaximized, zIndex } = windowState;

  return (
    <Draggable handle=".window-header" nodeRef={nodeRef} bounds="parent" defaultPosition={{x: 100, y: 50}} disabled={isMaximized}>
      <div
        ref={nodeRef}
        className={`absolute terminal-window flex flex-col w-[650px] h-[450px] transition-all duration-200 ${isMaximized ? 'window-maximized' : ''} ${isMinimized ? 'window-minimized' : ''}`}
        style={{ zIndex, resize: isMaximized || isMinimized ? 'none' : 'both', overflow: 'hidden' }}
        onMouseDown={() => focusWindow(id)}
      >
        <div className="window-header flex justify-between items-center bg-[#0a1a12] border-b-2 border-[#4ade80] p-3 cursor-move select-none shrink-0" style={{ pointerEvents: 'auto' }}>
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 bg-[#4ade80] border border-white ${isMinimized ? '' : 'animate-pulse'}`}></div>
            <span className="text-sm font-bold tracking-[0.2em] font-pixel text-[#4ade80]" style={{ textShadow: '0 0 10px #4ade80' }}>
              {title.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Minimize */}
            <button 
              className="w-8 h-8 flex items-center justify-center bg-yellow-900/80 hover:bg-yellow-500 text-white border border-yellow-400 transition-all duration-200 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleMinimize(id);
              }}
            >
              <span className="text-sm font-bold block mb-2">_</span>
            </button>
            {/* Maximize */}
            <button 
              className="w-8 h-8 flex items-center justify-center bg-blue-900/80 hover:bg-blue-500 text-white border border-blue-400 transition-all duration-200 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleMaximize(id);
              }}
            >
              <span className="text-[10px] font-bold block border-[2px] border-white w-3 h-3"></span>
            </button>
            {/* Close */}
            <button 
              className="w-8 h-8 flex items-center justify-center bg-red-900 hover:bg-red-500 text-white border border-red-400 transition-all duration-200 shrink-0 shadow-[0_0_10px_red]"
              onClick={(e) => {
                e.stopPropagation();
                if (isDirty) {
                  setShowClosePrompt(true);
                } else {
                  closeWindow(id);
                }
              }}
            >
              <span className="text-sm uppercase font-sans font-bold">✕</span>
            </button>
          </div>
        </div>
        <div className={`window-content bg-black/90 flex-1 overflow-hidden relative border-t-0 p-0 ${isMinimized ? 'hidden' : 'block'}`} style={{ pointerEvents: 'auto' }}>
          {children}
          {showClosePrompt && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-[100] backdrop-blur-sm pointer-events-auto">
              <div className="bg-[#0a1a12] border-2 border-[#4ade80] p-6 shadow-[0_0_20px_rgba(74,222,128,0.5)] max-w-[90%]">
                <h3 className="text-[#4ade80] font-pixel text-xl mb-4 tracking-widest text-center">UNSAVED CHANGES</h3>
                <p className="text-[#4ade80]/80 font-mono text-sm mb-6 text-center">Would you like to save changes before closing?</p>
                <div className="flex justify-center gap-4 text-sm font-mono font-bold tracking-wider flex-wrap">
                   <button 
                     className="px-4 py-2 border border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80] hover:text-black transition-colors"
                     onClick={() => {
                       if (saveHandler) saveHandler();
                       closeWindow(id);
                     }}
                   >
                     SAVE
                   </button>
                   <button 
                     className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                     onClick={() => {
                       closeWindow(id);
                     }}
                   >
                     DON'T SAVE
                   </button>
                   <button 
                     className="px-4 py-2 border border-stone-500 text-stone-500 hover:bg-stone-500 hover:text-white transition-colors"
                     onClick={() => setShowClosePrompt(false)}
                   >
                     CANCEL
                   </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {!isMinimized && !isMaximized && (
          <div className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize bg-[#4ade80]/30 border-t-2 border-l-2 border-[#4ade80] z-50 rounded-tl-lg pointer-events-none"></div>
        )}
      </div>
    </Draggable>
  );
}
