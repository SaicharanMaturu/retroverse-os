import { getNode } from "../../core/fileSystem/fsUtils";
import { useFSStore } from "../../store/useFSStore";
import { useOSStore } from "../../store/useOSStore";

export default function FolderViewer({ folderPath }: { folderPath: string }) {
  useFSStore(s => s.version);
  const node = getNode(folderPath.split("/"));
  const spawnWindow = useOSStore(s => s.spawnWindow);

  if (!node || node.type !== "folder") {
    return <div className="text-red-500 p-4 font-mono font-bold tracking-widest text-glow">ERR: DIRECTORY NOT ACCESSIBLE.</div>;
  }

  const children = node.children || [];

  return (
    <div className="w-full h-full bg-transparent p-4 overflow-auto flex flex-wrap gap-4 content-start relative">
      <div className="absolute inset-0 synth-grid opacity-10 pointer-events-none z-0"></div>
      
      {children.length === 0 && (
        <div className="text-[#4ade80]/40 font-mono italic w-full text-center mt-10 z-10 tracking-[0.2em] font-bold">- DIRECTORY IS EMPTY -</div>
      )}

      {children.map((child: any, i: number) => (
        <div
            key={i}
            className="group cursor-pointer select-none w-24 flex flex-col items-center justify-center p-2 border-2 border-transparent hover:bg-[#4ade80]/10 hover:border-[#4ade80]/60 transition-all duration-150 rounded-lg z-10"
            onDoubleClick={(e) => {
              e.stopPropagation();
              const childPath = `${folderPath}/${child.name}`;
              if (child.type === "file") {
                spawnWindow(`file:${childPath}`, child.name);
              } else {
                spawnWindow(`folder:${childPath}`, `[DIR] ${child.name}`);
              }
            }}
          >
            <div className="text-4xl mb-2 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)] group-hover:-translate-y-1 transition-transform">
              {child.type === "folder" ? "📁" : "📄"}
            </div>
            <div className="text-[10px] font-bold tracking-widest text-[#4ade80] font-mono text-center flex-1 max-w-full overflow-hidden text-ellipsis line-clamp-1">
              {child.name.toUpperCase()}
            </div>
          </div>
      ))}
    </div>
  );
}
