import { create } from "zustand";

interface FSStore {
  version: number;
  notifyFSChange: () => void;
}

export const useFSStore = create<FSStore>((set) => ({
  version: 0,
  notifyFSChange: () => set((state) => ({ version: state.version + 1 }))
}));
