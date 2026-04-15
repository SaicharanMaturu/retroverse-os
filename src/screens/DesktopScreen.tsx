import { useOSStore } from "../store/useOSStore";
import { useFSStore } from "../store/useFSStore";
import { getNode } from "../core/fileSystem/fsUtils";
import { AIAssistantPanel } from "../components/AIAssistantPanel";

interface DesktopScreenProps {
  theme: "retro" | "future";
  onThemeToggle: () => void;
}

export default function DesktopScreen({ theme, onThemeToggle }: DesktopScreenProps) {
  const openWindow = useOSStore((s) => s.openWindow);
  useFSStore((s) => s.version); // Reactivity anchor

  const homeNode = getNode(["home"]);
  const desktopNodes = homeNode?.children || [];

  return (
    <div className="w-screen h-screen bg-[#020402] relative overflow-hidden flex flex-col">
      {/* Theme Toggle & AI Panel in top right */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-3 max-w-xs">
        <button
          onClick={onThemeToggle}
          className="px-4 py-2 bg-[#4ade80]/20 border border-[#4ade80]/60 text-[#4ade80] rounded hover:bg-[#4ade80]/30 transition-all font-mono text-sm"
        >
          🎨 {theme === "retro" ? "Future" : "Retro"} Mode
        </button>
        
        {/* AI Assistant Stats Panel */}
        <AIAssistantPanel
          currentCommand=""
          failedAttempts={0}
          isVisible={true}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="synth-grid"></div>
        <div className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-[#010201] via-[#020503] to-transparent z-0 pointer-events-none"></div>

        <div className="absolute z-0 top-[20%] flex flex-col items-center select-none shadow-[#4ade80]/10 opacity-100 pointer-events-none">
          <div className="text-[#4ade80] font-bold font-pixel text-4xl md:text-6xl tracking-widest text-glow mb-4 text-center leading-normal" style={{ textShadow: '0 0 20px #4ade80' }}>
             M SAI CHARAN CMD
          </div>
          <p className="font-mono text-[#4ade80] opacity-90 tracking-[0.4em] font-bold mt-2 text-glow">CYBERPUNK NEURAL ENVIRONMENT</p>
        </div>

        <div className="absolute top-8 left-8 z-10 flex flex-wrap gap-4 content-start w-[80vw] h-[80vh]">
          <div
            className="group cursor-pointer select-none w-28 flex flex-col items-center justify-center p-4 border-2 border-transparent hover:bg-[#4ade80]/10 hover:border-[#4ade80]/60 transition-all duration-150 rounded-lg hover:scale-110"
            onDoubleClick={() => openWindow("terminal")}
          >
            <div className="text-5xl mb-2 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)] group-hover:-translate-y-1 transition-transform animate-pulse">💻</div>
            <div className="text-xs font-bold tracking-widest text-[#4ade80] font-mono text-center">TERMINAL</div>
          </div>

          {desktopNodes.map((node: any, i: number) => (
            <div
              key={i}
              className="group cursor-pointer select-none w-28 flex flex-col items-center justify-center p-4 border-2 border-transparent hover:bg-[#4ade80]/10 hover:border-[#4ade80]/60 transition-all duration-150 rounded-lg hover:scale-110"
              onDoubleClick={(e) => {
                e.stopPropagation();
                const absPath = "home/" + node.name;
                if (node.type === "file") {
                  useOSStore.getState().spawnWindow(`file:${absPath}`, node.name);
                } else {
                  useOSStore.getState().spawnWindow(`folder:${absPath}`, `[DIR] ${node.name}`);
                }
              }}
            >
              <div className="text-5xl mb-2 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)] group-hover:-translate-y-1 transition-transform">
                {node.type === "folder" ? "📁" : "📄"}
              </div>
              <div className="text-xs font-bold tracking-widest text-[#4ade80] font-mono text-center flex-1 max-w-full overflow-hidden text-ellipsis">
                {node.name.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
