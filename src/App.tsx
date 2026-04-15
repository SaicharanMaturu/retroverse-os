import { useState } from "react";
import BootScreen from "./screens/BootScreen";
import DesktopScreen from "./screens/DesktopScreen";
import Window from "./components/window/Window";
import Terminal from "./apps/terminal/Terminal";
import FileViewer from "./apps/fileViewer/FileViewer";
import FolderViewer from "./apps/folderViewer/FolderViewer";
import Taskbar from "./components/Taskbar";
// import ChallengePanel from "./components/ChallengePanel";
import { useOSStore } from "./store/useOSStore";

function App() {
  const [booted, setBooted] = useState(false);
  const [theme, setTheme] = useState<"retro" | "future">("future");
  const windows = useOSStore((s) => s.windows);

  if (!booted) return <BootScreen onFinish={() => setBooted(true)} />;

  return (
    <div className={theme === "retro" ? "retro-theme" : "future-theme"}>
      {/* <ChallengePanel /> */}
      <DesktopScreen theme={theme} onThemeToggle={() => setTheme(theme === "retro" ? "future" : "retro")} />

      {windows.map((w) => {
        if (!w.isOpen) return null;

        let WindowContent = null;
        if (w.id === "terminal") {
           WindowContent = <Terminal />;
        } else if (w.id.startsWith("file:")) {
           WindowContent = <FileViewer filePath={w.id.replace("file:", "")} windowId={w.id} />;
        } else if (w.id.startsWith("folder:")) {
           WindowContent = <FolderViewer folderPath={w.id.replace("folder:", "")} />;
        }

        return (
          <Window key={w.id} id={w.id} title={w.title}>
            {WindowContent}
          </Window>
        );
      })}

      <Taskbar />
    </div>
  );
}

export default App;
