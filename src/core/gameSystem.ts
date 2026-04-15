// Game System: Levels, Challenges, XP, Achievements
export interface Challenge {
  id: string;
  level: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  objective: string;
  hints: string[];
  solution: string[];
  xpReward: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
}

export interface PlayerProgress {
  level: number;
  xp: number;
  completedChallenges: string[];
  currentChallenge: string | null;
  achievements: string[];
}

// Level 1: Basic Navigation (Easy)
export const LEVEL_1_CHALLENGES: Challenge[] = [
  {
    id: "basic_1",
    level: 1,
    title: "Explore Your Home",
    description: "Learn to see what's in your current directory",
    objective: "Type 'ls' to list files and folders in your home directory",
    hints: [
      "The 'ls' command shows what's in your current folder",
      "Just type 'ls' and press Enter",
      "You should see files and folders displayed"
    ],
    solution: ["ls"],
    xpReward: 10,
    difficulty: "Easy"
  },
  {
    id: "basic_2",
    level: 1,
    title: "Where Am I?",
    description: "Find your current location",
    objective: "Use 'pwd' to see your current path",
    hints: [
      "'pwd' stands for 'print working directory'",
      "It shows you exactly where you are",
      "Type 'pwd' to see your location"
    ],
    solution: ["pwd"],
    xpReward: 10,
    difficulty: "Easy"
  },
  {
    id: "basic_3",
    level: 1,
    title: "Create Your First Folder",
    description: "Make a new folder to organize files",
    objective: "Create a folder named 'projects' using 'mkdir'",
    hints: [
      "'mkdir' creates a new folder",
      "Try: mkdir projects",
      "After creating, use 'ls' to see it"
    ],
    solution: ["mkdir projects"],
    xpReward: 15,
    difficulty: "Easy"
  },
  {
    id: "basic_4",
    level: 1,
    title: "Enter Your Folder",
    description: "Navigate into a folder",
    objective: "Use 'cd projects' to enter the folder you created",
    hints: [
      "'cd' changes your current directory",
      "Type: cd projects",
      "Use 'pwd' to confirm you're inside"
    ],
    solution: ["cd projects"],
    xpReward: 15,
    difficulty: "Easy"
  },
  {
    id: "basic_5",
    level: 1,
    title: "Create Your First File",
    description: "Make a new text file",
    objective: "Create a file named 'notes.txt' using 'touch'",
    hints: [
      "'touch' creates a new empty file",
      "Try: touch notes.txt",
      "Use 'ls' to see it in your folder"
    ],
    solution: ["touch notes.txt"],
    xpReward: 15,
    difficulty: "Easy"
  }
];

// Level 2: File Operations (Medium)
export const LEVEL_2_CHALLENGES: Challenge[] = [
  {
    id: "intermediate_1",
    level: 2,
    title: "Backup Important File",
    description: "Copy a file to create a backup",
    objective: "Copy 'notes.txt' to 'notes_backup.txt' using 'cp'",
    hints: [
      "'cp' copies files: cp source destination",
      "Create a backup: cp notes.txt notes_backup.txt",
      "Use 'ls' to see both files"
    ],
    solution: ["cp notes.txt notes_backup.txt"],
    xpReward: 20,
    difficulty: "Medium"
  },
  {
    id: "intermediate_2",
    level: 2,
    title: "Rename a File",
    description: "Change a file's name",
    objective: "Rename 'notes_backup.txt' to 'notes_archive.txt' using 'mv'",
    hints: [
      "'mv' moves or renames files: mv oldName newName",
      "Try: mv notes_backup.txt notes_archive.txt",
      "The original is gone, renamed file remains"
    ],
    solution: ["mv notes_backup.txt notes_archive.txt"],
    xpReward: 20,
    difficulty: "Medium"
  },
  {
    id: "intermediate_3",
    level: 2,
    title: "Organize Project Structure",
    description: "Create a project folder structure",
    objective: "Create folders: 'src', 'docs', 'tests' inside projects",
    hints: [
      "Use mkdir to create each folder",
      "Create src: mkdir src",
      "Create docs: mkdir docs",
      "Create tests: mkdir tests",
      "Use 'ls' to verify all folders exist"
    ],
    solution: ["mkdir src", "mkdir docs", "mkdir tests"],
    xpReward: 30,
    difficulty: "Medium"
  },
  {
    id: "intermediate_4",
    level: 2,
    title: "View File Contents",
    description: "Read what's inside a file",
    objective: "Use 'cat' to display contents of notes.txt",
    hints: [
      "'cat' displays file contents",
      "Try: cat notes.txt",
      "It shows everything in the file"
    ],
    solution: ["cat notes.txt"],
    xpReward: 15,
    difficulty: "Medium"
  },
  {
    id: "intermediate_5",
    level: 2,
    title: "Clean Up",
    description: "Delete unnecessary files",
    objective: "Remove 'notes_archive.txt' using 'rm'",
    hints: [
      "'rm' permanently deletes files - be careful!",
      "Try: rm notes_archive.txt",
      "Check with 'ls' that it's gone",
      "WARNING: You cannot undo this!"
    ],
    solution: ["rm notes_archive.txt"],
    xpReward: 20,
    difficulty: "Medium"
  }
];

// Level 3: Advanced Terminal (Hard)
export const LEVEL_3_CHALLENGES: Challenge[] = [
  {
    id: "advanced_1",
    level: 3,
    title: "Search Inside Files",
    description: "Find text patterns in files using grep",
    objective: "Use 'grep' to search for text in files",
    hints: [
      "'grep' searches for patterns inside files",
      "Create files first with text",
      "Then use: grep pattern filename"
    ],
    solution: ["grep"],
    xpReward: 25,
    difficulty: "Hard"
  },
  {
    id: "advanced_2",
    level: 3,
    title: "Chain Commands",
    description: "Use pipes to combine commands",
    objective: "Use pipes (|) to chain commands together",
    hints: [
      "Pipes connect commands: command1 | command2",
      "Output of first becomes input of second",
      "Example: ls | grep project"
    ],
    solution: ["cat notes.txt | grep"],
    xpReward: 30,
    difficulty: "Hard"
  },
  {
    id: "advanced_3",
    level: 3,
    title: "Redirect Output",
    description: "Save command output to a file",
    objective: "Use '>' to save ls output to a file",
    hints: [
      "Redirection saves output: command > file",
      "Try: ls > filelist.txt",
      "Then: cat filelist.txt to see what was saved"
    ],
    solution: ["ls > filelist.txt"],
    xpReward: 25,
    difficulty: "Hard"
  },
  {
    id: "advanced_4",
    level: 3,
    title: "Find Files",
    description: "Search for files by name",
    objective: "Use 'find' to locate specific files",
    hints: [
      "'find' searches for files",
      "Try: find . -name pattern",
      "The '.' means search current directory"
    ],
    solution: ["find"],
    xpReward: 30,
    difficulty: "Hard"
  },
  {
    id: "advanced_5",
    level: 3,
    title: "Set Permissions",
    description: "Control who can access files",
    objective: "Use 'chmod' to change file permissions",
    hints: [
      "'chmod' changes permissions: chmod 755 file",
      "Three numbers: owner, group, others",
      "7=read/write/execute, 5=read/execute"
    ],
    solution: ["chmod"],
    xpReward: 35,
    difficulty: "Hard"
  }
];

// Level 4: Expert Mode (Expert)
export const LEVEL_4_CHALLENGES: Challenge[] = [
  {
    id: "expert_1",
    level: 4,
    title: "Create Shell Script",
    description: "Write automation scripts",
    objective: "Create a script that automates tasks",
    hints: [
      "Scripts combine multiple commands",
      "Create script.sh file",
      "Use echo, mkdir, cp, etc. together"
    ],
    solution: ["touch script.sh"],
    xpReward: 50,
    difficulty: "Expert"
  },
  {
    id: "expert_2",
    level: 4,
    title: "Build Project",
    description: "Create a complete project structure",
    objective: "Design and build a professional project layout",
    hints: [
      "Real projects have organized structure",
      "src/ for source code",
      "tests/ for testing",
      "docs/ for documentation"
    ],
    solution: ["mkdir -p project/src/components"],
    xpReward: 50,
    difficulty: "Expert"
  },
  {
    id: "expert_3",
    level: 4,
    title: "Master Git Basics",
    description: "Version control fundamentals",
    objective: "Understand git commands and workflow",
    hints: [
      "Git tracks changes: git init, git add, git commit",
      "Create repository: git init",
      "Stage changes: git add .",
      "Save changes: git commit -m 'message'"
    ],
    solution: ["git init"],
    xpReward: 40,
    difficulty: "Expert"
  },
  {
    id: "expert_4",
    level: 4,
    title: "Combine All Skills",
    description: "Use everything you've learned",
    objective: "Create, organize, search, backup a project",
    hints: [
      "Create folders",
      "Add files",
      "Search contents",
      "Create backups",
      "Organize structure"
    ],
    solution: ["mkdir project"],
    xpReward: 60,
    difficulty: "Expert"
  },
  {
    id: "expert_5",
    level: 4,
    title: "Real-World Project",
    description: "Build like a real developer",
    objective: "Create a complete, professional project",
    hints: [
      "Professional structure needed",
      "Multiple folders and files",
      "Proper organization",
      "Documentation"
    ],
    solution: [""],
    xpReward: 100,
    difficulty: "Expert"
  }
];

// All challenges
export const ALL_CHALLENGES = [
  ...LEVEL_1_CHALLENGES,
  ...LEVEL_2_CHALLENGES,
  ...LEVEL_3_CHALLENGES,
  ...LEVEL_4_CHALLENGES
];

// Initial player progress
export const initialProgress: PlayerProgress = {
  level: 1,
  xp: 0,
  completedChallenges: [],
  currentChallenge: "basic_1",
  achievements: []
};

// Check if challenge is completed
export function checkChallenge(input: string, challenge: Challenge): boolean {
  const lower = input.toLowerCase().trim();
  return challenge.solution.some(sol => lower.includes(sol.toLowerCase()));
}

// Get next challenge
export function getNextChallenge(currentId: string): Challenge | null {
  const currentIndex = ALL_CHALLENGES.findIndex(c => c.id === currentId);
  if (currentIndex === -1 || currentIndex >= ALL_CHALLENGES.length - 1) return null;
  return ALL_CHALLENGES[currentIndex + 1];
}

// Get achievements
export const ACHIEVEMENTS = {
  first_command: { id: "first_command", title: "First Steps", description: "Complete first challenge" },
  level_1_master: { id: "level_1_master", title: "Explorer", description: "Complete all Level 1 challenges" },
  level_2_master: { id: "level_2_master", title: "Organizer", description: "Complete all Level 2 challenges" },
  level_3_master: { id: "level_3_master", title: "Power User", description: "Complete all Level 3 challenges" },
  all_levels: { id: "all_levels", title: "Master", description: "Complete all levels in the game" },
  xp_100: { id: "xp_100", title: "Rising Star", description: "Earn 100 XP" },
  xp_500: { id: "xp_500", title: "Terminal Expert", description: "Earn 500 XP" },
};
