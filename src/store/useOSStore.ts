import { create } from "zustand";

type WindowState = {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
};

interface OSState {
  windows: WindowState[];
  activeWindow: string | null;

  dirtyWindows: Record<string, boolean>;
  saveHandlers: Record<string, () => void>;

  openWindow: (id: string) => void;
  spawnWindow: (id: string, title: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;

  setWindowDirty: (id: string, isDirty: boolean) => void;
  registerSaveHandler: (id: string, handler: () => void) => void;
  unregisterSaveHandler: (id: string) => void;
}

export const useOSStore = create<OSState>((set) => ({
  windows: [
    { id: "terminal", title: "Terminal", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1 },
  ],

  activeWindow: null,
  dirtyWindows: {},
  saveHandlers: {},

  openWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w, i) =>
        w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: 100 } : { ...w, zIndex: i }
      ),
      activeWindow: id,
    })),

  spawnWindow: (id, title) =>
    set((state) => {
      const exists = state.windows.find((w) => w.id === id);
      if (exists) {
        return {
          windows: state.windows.map((w, i) =>
            w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: 100 } : { ...w, zIndex: i }
          ),
          activeWindow: id,
        };
      }
      return {
        windows: [
          ...state.windows.map((w, i) => ({ ...w, zIndex: i })),
          { id, title, isOpen: true, isMinimized: false, isMaximized: false, zIndex: 100 },
        ],
        activeWindow: id,
      };
    }),

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isOpen: false, isMinimized: false, isMaximized: false } : w
      ),
    })),

  focusWindow: (id) =>
    set((state) => ({
      activeWindow: id,
      windows: state.windows.map((w, i) =>
        w.id === id ? { ...w, zIndex: 100 } : { ...w, zIndex: i }
      ),
    })),

  toggleMinimize: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
      ),
    })),

  toggleMaximize: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized, isMinimized: false } : w
      ),
    })),

  setWindowDirty: (id, isDirty) =>
    set((state) => ({
      dirtyWindows: { ...state.dirtyWindows, [id]: isDirty }
    })),

  registerSaveHandler: (id, handler) =>
    set((state) => ({
      saveHandlers: { ...state.saveHandlers, [id]: handler }
    })),

  unregisterSaveHandler: (id) =>
    set((state) => {
      const newHandlers = { ...state.saveHandlers };
      delete newHandlers[id];
      return { saveHandlers: newHandlers };
    }),
}));
