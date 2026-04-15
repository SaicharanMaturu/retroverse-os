import { useState, useEffect } from "react";
import { useOSStore } from "../store/useOSStore";

export default function Taskbar() {
  const windows = useOSStore((s) => s.windows);
  const activeWindow = useOSStore((s) => s.activeWindow);
  const focusWindow = useOSStore((s) => s.focusWindow);
  const toggleMinimize = useOSStore((s) => s.toggleMinimize);
  
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const openWindows = windows.filter(w => w.isOpen);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#0a1a12]/90 border-t-2 border-[#4ade80] z-[9999] flex items-center justify-between px-2 backdrop-blur-md pointer-events-auto shadow-[0_-5px_20px_rgba(74,222,128,0.2)]">
      
      {/* Applications */}
      <div className="flex items-center gap-2 overflow-x-auto h-full pr-4 py-1.5 flex-1">
        {openWindows.map(w => {
          const isActive = activeWindow === w.id && !w.isMinimized;
          return (
            <button
              key={w.id}
              onClick={() => {
                if (w.isMinimized) {
                  toggleMinimize(w.id);
                  focusWindow(w.id);
                } else if (isActive) {
                  toggleMinimize(w.id);
                } else {
                  focusWindow(w.id);
                }
              }}
              className={`h-full min-w-[120px] px-3 flex items-center gap-2 border border-[#4ade80] transition-colors truncate max-w-[200px] text-xs font-bold font-mono tracking-wider
                ${isActive ? 'bg-[#4ade80] text-[#020402] shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-black text-[#4ade80] hover:bg-[#4ade80]/20'}`}
            >
              <span className="shrink-0">{w.id.startsWith("file:") ? "📄" : w.id.startsWith("folder:") ? "📁" : "💻"}</span>
              <span className="truncate">{w.title.toUpperCase()}</span>
            </button>
          )
        })}
      </div>

      {/* Clock Widgets */}
      <div className="flex items-center gap-4 text-[#4ade80] font-mono px-4 h-full border-l-2 border-[#4ade80]/50 shrink-0 select-none bg-[#020402]">
        <div className="flex flex-col items-end justify-center text-glow">
            <span className="text-[13px] font-bold tracking-[0.2em]">{time.toLocaleTimeString()}</span>
            <span className="text-[9px] opacity-70 tracking-widest">{time.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
