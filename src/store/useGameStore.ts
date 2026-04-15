import { create } from "zustand";
import type { PlayerProgress, Challenge } from "../core/gameSystem";
import { initialProgress, ALL_CHALLENGES } from "../core/gameSystem";

interface GameStore {
  progress: PlayerProgress;
  currentChallenge: Challenge | null;
  hints: string[];
  showChallenge: boolean;
  
  // Methods
  setProgress: (progress: PlayerProgress) => void;
  completeChallenge: (challengeId: string, xp: number) => void;
  addXP: (amount: number) => void;
  getCurrentChallenge: () => Challenge | null;
  getHints: () => string[];
  nextChallenge: () => void;
  showHint: () => void;
  unlockAchievement: (achievementId: string) => void;
  resetProgress: () => void;
  toggleChallengeView: (show: boolean) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  progress: initialProgress,
  currentChallenge: ALL_CHALLENGES[0],
  hints: [],
  showChallenge: true,
  
  setProgress: (progress) => set({ progress }),
  
  completeChallenge: (challengeId, xp) => {
    const current = get().progress;
    const updated = {
      ...current,
      xp: current.xp + xp,
      completedChallenges: [...current.completedChallenges, challengeId]
    };
    set({ progress: updated, hints: [] });
    get().nextChallenge();
  },
  
  addXP: (amount) => {
    const current = get().progress;
    set({
      progress: {
        ...current,
        xp: current.xp + amount
      }
    });
  },
  
  getCurrentChallenge: () => {
    const challengeId = get().progress.currentChallenge;
    if (!challengeId) return null;
    return ALL_CHALLENGES.find(c => c.id === challengeId) || null;
  },
  
  getHints: () => {
    return get().hints;
  },
  
  nextChallenge: () => {
    const current = get().getCurrentChallenge();
    if (!current) return;
    
    const currentIndex = ALL_CHALLENGES.findIndex(c => c.id === current.id);
    if (currentIndex < ALL_CHALLENGES.length - 1) {
      const next = ALL_CHALLENGES[currentIndex + 1];
      set(state => ({
        progress: {
          ...state.progress,
          currentChallenge: next.id,
          level: next.level
        },
        currentChallenge: next,
        hints: []
      }));
    }
  },
  
  showHint: () => {
    const challenge = get().getCurrentChallenge();
    if (!challenge) return;
    
    const hints = get().hints;
    if (hints.length < challenge.hints.length) {
      set({
        hints: [...hints, challenge.hints[hints.length]]
      });
    }
  },
  
  unlockAchievement: (achievementId) => {
    const current = get().progress;
    if (!current.achievements.includes(achievementId)) {
      set({
        progress: {
          ...current,
          achievements: [...current.achievements, achievementId]
        }
      });
    }
  },
  
  resetProgress: () => {
    set({
      progress: initialProgress,
      currentChallenge: ALL_CHALLENGES[0],
      hints: []
    });
  },
  
  toggleChallengeView: (show) => {
    set({ showChallenge: show });
  }
}));
