import { useEffect, useState } from "react";

export default function BootScreen({ onFinish }: any) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 400);
          return 100;
        }
        return p + Math.floor(Math.random() * 20);
      });
    }, 150);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="w-screen h-screen bg-[#020402] text-green-500 flex flex-col items-center justify-center font-mono relative overflow-hidden">
      <div className="synth-grid"></div>
      <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none"></div>

      <div className="z-20 flex flex-col items-center text-glow">
        <h1 className="text-4xl md:text-6xl font-black tracking-widest mb-4 text-center select-none uppercase font-pixel leading-loose">
          M SAI CHARAN CMD
        </h1>
        
        <p className="text-lg mb-16 tracking-[0.4em] opacity-80 animate-pulse font-bold">BOOT SEQUENCE INITIATED_</p>

        <div className="w-80 md:w-96 border-2 border-green-500 bg-black h-8 p-1 relative shadow-[0_0_20px_rgba(74,222,128,0.2)]">
          <div
            className="bg-green-500 h-full transition-all duration-75 relative"
            style={{ width: `${progress > 100 ? 100 : progress}%` }}
          >
            <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/50 blur-[1px]"></div>
          </div>
        </div>
        <p className="mt-4 text-xl font-bold tracking-widest uppercase text-glow">LOADING DATABASES [ {progress > 100 ? 100 : progress}% ]</p>
      </div>
    </div>
  );
}
