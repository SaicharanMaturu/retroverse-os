// Advanced Knowledge Base - Handles typos, context, multiple ways of asking

export interface KnowledgeEntry {
  id: string;
  command: string;
  mainQuestion: string;
  alternatives: string[]; // Different ways to ask
  answer: string;
  examples: string[];
  relatedCommands: string[]; // What to do next
  category: "basics" | "how-to" | "troubleshooting" | "advanced";
}

export const advancedKnowledgeBase: KnowledgeEntry[] = [
  // ========== LS COMMAND ==========
  {
    id: "ls-what",
    command: "ls",
    mainQuestion: "what is ls",
    alternatives: [
      "what does ls do",
      "what ls command",
      "wht is ls", // typo
      "what ls mean",
      "what is ls used for",
      "ls definition",
    ],
    answer:
      "ls (list) shows all files and folders in your current directory. It's like opening a folder on your computer to see what's inside.",
    examples: [
      "$ ls                    → Shows all files",
      "$ ls /home              → Shows files in /home",
      "$ ls -l                 → Shows detailed info",
    ],
    relatedCommands: ["pwd", "cd", "cat"],
    category: "basics",
  },

  {
    id: "ls-how",
    command: "ls",
    mainQuestion: "how to list files",
    alternatives: [
      "how to show files",
      "how see content",
      "hwo to list", // typo
      "how do i list files",
      "how can i see files",
      "how list directory",
      "show me all files",
      "display files",
      "what's in this folder",
    ],
    answer: "Just type 'ls' and press Enter. It will show all files and folders in your current directory.",
    examples: [
      "$ ls",
      "$ ls /documents",
      "$ ls /home/projects",
    ],
    relatedCommands: ["cd", "pwd", "cat", "mkdir"],
    category: "how-to",
  },

  {
    id: "ls-after",
    command: "ls",
    mainQuestion: "what to do after ls",
    alternatives: [
      "after ls what next",
      "what should i do after listing files",
      "i used ls now what",
      "nexrt after ls", // typo
      "what comes after ls",
    ],
    answer:
      "After listing files, you can:\n1. View a file with 'cat filename'\n2. Go into a folder with 'cd foldername'\n3. Delete a file with 'rm filename'\n4. Edit a file with your editor",
    examples: [
      "$ ls                    → See files",
      "$ cat file.txt          → Read the file",
      "$ cd projects           → Enter projects folder",
    ],
    relatedCommands: ["cat", "cd", "rm", "touch"],
    category: "how-to",
  },

  // ========== MKDIR COMMAND ==========
  {
    id: "mkdir-what",
    command: "mkdir",
    mainQuestion: "what is mkdir",
    alternatives: [
      "what does mkdir do",
      "what mkdir command",
      "wat is mkdir", // typo
      "mkdir meaning",
      "what mkdir for",
      "mkir definition", // typo
    ],
    answer:
      "mkdir (make directory) creates a new folder. It's like making a new folder on your computer to organize files.",
    examples: [
      "$ mkdir projects        → Creates 'projects' folder",
      "$ mkdir documents       → Creates 'documents' folder",
      "$ mkdir my-app          → Creates 'my-app' folder",
    ],
    relatedCommands: ["cd", "ls", "touch"],
    category: "basics",
  },

  {
    id: "mkdir-how",
    command: "mkdir",
    mainQuestion: "how to create folder",
    alternatives: [
      "how make directory",
      "hwo to make folder", // typo
      "how create a folder",
      "how do i make a folder",
      "create new folder how",
      "make director how",
      "new folder how",
      "i want to create a folder",
    ],
    answer: "Type 'mkdir foldername' where 'foldername' is what you want to call it.",
    examples: [
      "$ mkdir projects",
      "$ mkdir data",
      "$ mkdir my-workspace",
    ],
    relatedCommands: ["cd", "ls", "touch"],
    category: "how-to",
  },

  {
    id: "mkdir-after",
    command: "mkdir",
    mainQuestion: "what to do after mkdir",
    alternatives: [
      "after mkdir what next",
      "i created a folder now what",
      "after making a directory what",
      "nexst step after mkdir", // typo
      "what do i do after mkdir",
    ],
    answer:
      "After creating a folder, you typically:\n1. Go INTO it with 'cd foldername'\n2. Create files in it with 'touch filename'\n3. View it with 'ls'\n4. Move files into it",
    examples: [
      "$ mkdir projects        → Create folder",
      "$ cd projects           → Enter it",
      "$ touch main.py         → Create file inside",
      "$ ls                    → See your file",
    ],
    relatedCommands: ["cd", "touch", "ls"],
    category: "how-to",
  },

  // ========== CD COMMAND ==========
  {
    id: "cd-what",
    command: "cd",
    mainQuestion: "what is cd",
    alternatives: [
      "what does cd do",
      "what cd command",
      "cd meaning",
      "wht is cd", // typo
      "what is cd used for",
    ],
    answer:
      "cd (change directory) moves you to a different folder. It's like opening folders one by one on your computer.",
    examples: [
      "$ cd projects           → Go to projects folder",
      "$ cd /home              → Go to /home folder",
      "$ cd ..                 → Go back one folder",
    ],
    relatedCommands: ["ls", "pwd", "mkdir"],
    category: "basics",
  },

  {
    id: "cd-how",
    command: "cd",
    mainQuestion: "how to change directory",
    alternatives: [
      "how to go to folder",
      "hwo change dir", // typo
      "how enter folder",
      "how move to folder",
      "navigate to folder how",
      "how do i change directory",
      "change folder how",
    ],
    answer: "Type 'cd foldername' to go into that folder, or 'cd ..' to go back one level.",
    examples: [
      "$ cd projects           → Enter projects folder",
      "$ cd ..                 → Go back to parent folder",
      "$ cd /home/user         → Go to specific path",
    ],
    relatedCommands: ["ls", "pwd"],
    category: "how-to",
  },

  {
    id: "cd-after",
    command: "cd",
    mainQuestion: "what to do after cd",
    alternatives: [
      "after cd what next",
      "i changed directory now what",
      "after chaning folder what",
      "nexst after cd", // typo
      "what should i do after cd",
    ],
    answer:
      "After changing to a folder, you can:\n1. List files with 'ls'\n2. Create files with 'touch filename'\n3. Create subfolders with 'mkdir foldername'\n4. View file contents with 'cat filename'",
    examples: [
      "$ cd projects           → Enter folder",
      "$ ls                    → See what's inside",
      "$ touch app.py          → Create file",
      "$ mkdir src             → Create subfolder",
    ],
    relatedCommands: ["ls", "touch", "mkdir"],
    category: "how-to",
  },

  // ========== TOUCH COMMAND ==========
  {
    id: "touch-what",
    command: "touch",
    mainQuestion: "what is touch",
    alternatives: [
      "what does touch do",
      "touch command meaning",
      "wht touch for", // typo
      "what is touch used for",
    ],
    answer:
      "touch creates a new empty file. It's quick way to create blank files that you can edit later.",
    examples: [
      "$ touch file.txt        → Create text file",
      "$ touch script.py       → Create Python file",
      "$ touch index.html      → Create HTML file",
    ],
    relatedCommands: ["cat", "mkdir", "ls"],
    category: "basics",
  },

  {
    id: "touch-how",
    command: "touch",
    mainQuestion: "how to create file",
    alternatives: [
      "how make file",
      "hwo create file", // typo
      "how new file",
      "create file how",
      "how do i create a file",
      "how create a new file",
      "new file how",
      "i want to make a file",
    ],
    answer: "Type 'touch filename' where filename is what you want to name it (include extension like .txt, .py, .js).",
    examples: [
      "$ touch README.md       → Create README",
      "$ touch data.json       → Create JSON",
      "$ touch app.jsx         → Create React file",
    ],
    relatedCommands: ["cat", "mkdir", "ls"],
    category: "how-to",
  },

  {
    id: "touch-after",
    command: "touch",
    mainQuestion: "what to do after touch",
    alternatives: [
      "after touch what next",
      "i created file now what",
      "after creating file what",
      "nexst step after touch", // typo
      "what do i do after touch",
    ],
    answer:
      "After creating a file, you can:\n1. View it with 'cat filename'\n2. Edit it with your editor\n3. Copy it with 'cp filename copy.txt'\n4. Delete it with 'rm filename'",
    examples: [
      "$ touch data.txt        → Create file",
      "$ cat data.txt          → View it (empty)",
      "$ cp data.txt backup.txt → Copy it",
    ],
    relatedCommands: ["cat", "ls", "rm"],
    category: "how-to",
  },

  // ========== CAT COMMAND ==========
  {
    id: "cat-what",
    command: "cat",
    mainQuestion: "what is cat",
    alternatives: [
      "what does cat do",
      "cat command meaning",
      "wht is cat", // typo
      "what cat for",
      "cat definition",
      "how to read file",
    ],
    answer:
      "cat (concatenate) reads and displays file contents. It's the simplest way to view what's inside a file.",
    examples: [
      "$ cat file.txt          → Show file contents",
      "$ cat README.md         → Display readme",
      "$ cat /path/to/file     → View any file",
    ],
    relatedCommands: ["ls", "grep", "less"],
    category: "basics",
  },

  {
    id: "cat-how",
    command: "cat",
    mainQuestion: "how to read file",
    alternatives: [
      "how see file content",
      "hwo display file", // typo
      "how show file inside",
      "how view file",
      "view file content how",
      "how do i read a file",
      "show file how",
    ],
    answer: "Type 'cat filename' to display the entire file contents in your terminal.",
    examples: [
      "$ cat data.txt",
      "$ cat /home/user/file.txt",
      "$ cat app.js",
    ],
    relatedCommands: ["ls", "grep", "echo"],
    category: "how-to",
  },

  {
    id: "cat-after",
    command: "cat",
    mainQuestion: "what to do after cat",
    alternatives: [
      "after cat what next",
      "i read file now what",
      "after viewing file what",
      "nexst after cat", // typo
      "what do i do after cat",
    ],
    answer:
      "After viewing a file, you can:\n1. Edit it with an editor\n2. Search in it with 'grep'\n3. Copy it with 'cp'\n4. Delete it with 'rm'",
    examples: [
      "$ cat file.txt          → Read file",
      "$ grep word file.txt    → Search in it",
      "$ cp file.txt copy.txt  → Copy it",
    ],
    relatedCommands: ["grep", "cp", "rm"],
    category: "how-to",
  },

  // ========== RM COMMAND ==========
  {
    id: "rm-what",
    command: "rm",
    mainQuestion: "what is rm",
    alternatives: [
      "what does rm do",
      "rm command meaning",
      "wht is rm", // typo
      "what rm for",
      "rm definition",
      "how to delete file",
    ],
    answer:
      "rm (remove) deletes files permanently. Be careful - deleted files are gone for good! There's no trash/recycle bin.",
    examples: [
      "$ rm file.txt           → Delete file",
      "$ rm data.json          → Remove JSON file",
      "$ rm /path/to/file      → Delete any file",
    ],
    relatedCommands: ["ls", "cd", "touch"],
    category: "basics",
  },

  {
    id: "rm-how",
    command: "rm",
    mainQuestion: "how to delete file",
    alternatives: [
      "how remove file",
      "hwo delete file", // typo
      "how remove a file",
      "how do i delete a file",
      "delete file how",
      "remove file how",
      "how remove something",
    ],
    answer: "Type 'rm filename' to delete that file. WARNING: Deleted files cannot be recovered!",
    examples: [
      "$ rm old.txt",
      "$ rm backup.js",
      "$ rm /home/user/temp.txt",
    ],
    relatedCommands: ["ls", "pwd"],
    category: "how-to",
  },

  {
    id: "rm-after",
    command: "rm",
    mainQuestion: "what to do after rm",
    alternatives: [
      "after rm what next",
      "i deleted file now what",
      "after removing file what",
      "nexst after rm", // typo
      "what do i do after rm",
    ],
    answer:
      "After deleting a file, you can:\n1. Verify it's gone with 'ls'\n2. Check if you're in the right place with 'pwd'\n3. Create a new file with 'touch'",
    examples: [
      "$ rm old.txt            → Delete it",
      "$ ls                    → Verify it's gone",
      "$ touch new.txt         → Create replacement",
    ],
    relatedCommands: ["ls", "pwd", "touch"],
    category: "how-to",
  },

  // ========== PWD COMMAND ==========
  {
    id: "pwd-what",
    command: "pwd",
    mainQuestion: "what is pwd",
    alternatives: [
      "what does pwd do",
      "pwd meaning",
      "wht is pwd", // typo
      "what pwd for",
      "pwd definition",
      "where am i",
    ],
    answer:
      "pwd (print working directory) shows your current location/folder path. Use it when you're lost and need to know where you are.",
    examples: [
      "$ pwd                   → Shows location",
      "$ pwd                   → Displays /home/user/projects",
      "$ pwd                   → Helpful for navigation",
    ],
    relatedCommands: ["cd", "ls"],
    category: "basics",
  },

  {
    id: "pwd-how",
    command: "pwd",
    mainQuestion: "how to check location",
    alternatives: [
      "how see current folder",
      "hwo check where i am", // typo
      "how know my location",
      "check location how",
      "where am i in terminal",
      "how do i know my location",
    ],
    answer: "Just type 'pwd' and press Enter. It will show your complete folder path.",
    examples: [
      "$ pwd",
      "$ pwd                   → Shows /home/user",
      "$ pwd                   → Displays full path",
    ],
    relatedCommands: ["cd", "ls"],
    category: "how-to",
  },

  // ========== CP COMMAND ==========
  {
    id: "cp-what",
    command: "cp",
    mainQuestion: "what is cp",
    alternatives: [
      "what does cp do",
      "cp command meaning",
      "wht is cp", // typo
      "what cp for",
      "cp definition",
      "how to copy file",
    ],
    answer:
      "cp (copy) duplicates a file. It creates an exact copy with a new name, leaving the original untouched.",
    examples: [
      "$ cp file.txt copy.txt      → Copy file",
      "$ cp data.json backup.json  → Create backup",
      "$ cp app.js app-old.js      → Duplicate file",
    ],
    relatedCommands: ["ls", "rm", "mv"],
    category: "basics",
  },

  {
    id: "cp-how",
    command: "cp",
    mainQuestion: "how to copy file",
    alternatives: [
      "how duplicate file",
      "hwo copy file", // typo
      "how make copy of file",
      "how do i copy a file",
      "copy file how",
      "duplicate file how",
    ],
    answer: "Type 'cp sourcefile newname' to copy. The original stays, and a copy is created with the new name.",
    examples: [
      "$ cp original.txt backup.txt",
      "$ cp config.json config-old.json",
      "$ cp script.py script-copy.py",
    ],
    relatedCommands: ["rm", "mv", "ls"],
    category: "how-to",
  },

  {
    id: "cp-after",
    command: "cp",
    mainQuestion: "what to do after cp",
    alternatives: [
      "after cp what next",
      "i copied file now what",
      "after copying file what",
      "nexst after cp", // typo
      "what do i do after cp",
    ],
    answer:
      "After copying, you can:\n1. Verify both exist with 'ls'\n2. View copies with 'cat'\n3. Delete original with 'rm'\n4. Move copy with 'mv'",
    examples: [
      "$ cp data.txt data-backup.txt",
      "$ ls                    → See both files",
      "$ cat data-backup.txt   → Check copy",
    ],
    relatedCommands: ["ls", "cat", "rm", "mv"],
    category: "how-to",
  },

  // ========== MV COMMAND ==========
  {
    id: "mv-what",
    command: "mv",
    mainQuestion: "what is mv",
    alternatives: [
      "what does mv do",
      "mv command meaning",
      "wht is mv", // typo
      "what mv for",
      "mv definition",
      "how to move file",
    ],
    answer:
      "mv (move) moves or renames a file. You can use it to relocate files or change their names.",
    examples: [
      "$ mv old.txt new.txt       → Rename file",
      "$ mv file.txt folder/      → Move to folder",
      "$ mv app.js src/app.js     → Move and organize",
    ],
    relatedCommands: ["cp", "rm", "ls"],
    category: "basics",
  },

  {
    id: "mv-how",
    command: "mv",
    mainQuestion: "how to move file",
    alternatives: [
      "how rename file",
      "hwo move file", // typo
      "how rename or move",
      "how do i move a file",
      "move file how",
      "rename file how",
    ],
    answer: "Type 'mv oldname newname' to rename, or 'mv file folder/' to move it to a folder.",
    examples: [
      "$ mv main.py app.py          → Rename",
      "$ mv file.txt ./backup/      → Move to folder",
      "$ mv old-v1.js old-v2.js     → Rename version",
    ],
    relatedCommands: ["cp", "rm", "ls"],
    category: "how-to",
  },

  {
    id: "mv-after",
    command: "mv",
    mainQuestion: "what to do after mv",
    alternatives: [
      "after mv what next",
      "i moved file now what",
      "after moving file what",
      "nexst after mv", // typo
      "what do i do after mv",
    ],
    answer:
      "After moving/renaming, you can:\n1. Verify with 'ls' in both locations\n2. Check with 'pwd' to confirm location\n3. View with 'cat'\n4. Make another copy with 'cp'",
    examples: [
      "$ mv data.txt archive/data.txt",
      "$ ls                    → See it's gone",
      "$ cat archive/data.txt  → Check it's there",
    ],
    relatedCommands: ["ls", "pwd", "cp"],
    category: "how-to",
  },

  // ========== GREP COMMAND ==========
  {
    id: "grep-what",
    command: "grep",
    mainQuestion: "what is grep",
    alternatives: [
      "what does grep do",
      "grep command meaning",
      "wht is grep", // typo
      "what grep for",
      "grep definition",
      "how to search in file",
    ],
    answer:
      "grep (global regular expression print) searches for text inside files. It finds and shows lines containing a specific word or pattern.",
    examples: [
      "$ grep 'error' log.txt      → Find 'error' lines",
      "$ grep 'TODO' code.js       → Find 'TODO' comments",
      "$ grep 'user' data.json     → Search for 'user'",
    ],
    relatedCommands: ["cat", "ls"],
    category: "basics",
  },

  {
    id: "grep-how",
    command: "grep",
    mainQuestion: "how to search in file",
    alternatives: [
      "how find text in file",
      "hwo search file", // typo
      "how look for text",
      "how do i search in a file",
      "search in file how",
      "find text how",
    ],
    answer: "Type 'grep searchterm filename' to find lines with that text. It shows all matching lines.",
    examples: [
      "$ grep 'error' app.log",
      "$ grep 'function' script.js",
      "$ grep 'config' settings.json",
    ],
    relatedCommands: ["cat", "ls"],
    category: "how-to",
  },

  // ========== ECHO COMMAND ==========
  {
    id: "echo-what",
    command: "echo",
    mainQuestion: "what is echo",
    alternatives: [
      "what does echo do",
      "echo command meaning",
      "wht is echo", // typo
      "what echo for",
      "echo definition",
    ],
    answer:
      "echo prints text to the screen. Use it to display messages or create text files.",
    examples: [
      "$ echo 'Hello World'    → Print text",
      "$ echo 'test' > file.txt → Save to file",
      "$ echo 'line' >> file.txt → Append to file",
    ],
    relatedCommands: ["cat", "touch"],
    category: "basics",
  },

  {
    id: "echo-how",
    command: "echo",
    mainQuestion: "how to print text",
    alternatives: [
      "how display message",
      "hwo echo text", // typo
      "how print text",
      "how do i print text",
      "print text how",
      "display text how",
    ],
    answer: "Type 'echo text' to print it. Use 'echo text > file.txt' to write to a file.",
    examples: [
      "$ echo 'Hello'",
      "$ echo 'Test' > test.txt",
      "$ echo 'More' >> test.txt",
    ],
    relatedCommands: ["cat", "touch"],
    category: "how-to",
  },

  // ========== HELP COMMAND ==========
  {
    id: "help-what",
    command: "help",
    mainQuestion: "what is help",
    alternatives: [
      "what does help do",
      "help command meaning",
      "wht is help", // typo
      "what help for",
      "help definition",
    ],
    answer:
      "help shows all available commands and their descriptions. Use it when you forget which commands exist or what they do.",
    examples: [
      "$ help                  → Show all commands",
      "$ help                  → Lists with descriptions",
      "$ help                  → Quick reference",
    ],
    relatedCommands: ["ls", "pwd"],
    category: "basics",
  },

  {
    id: "help-how",
    command: "help",
    mainQuestion: "how to see all commands",
    alternatives: [
      "show all commands",
      "hwo see commands", // typo
      "how know commands",
      "what commands available",
      "how do i see available commands",
      "commands how",
      "list all commands",
    ],
    answer: "Just type 'help' and press Enter. It displays all available commands with explanations.",
    examples: [
      "$ help",
      "$ help                  → Shows full list",
      "$ help                  → Command reference",
    ],
    relatedCommands: ["ls", "pwd"],
    category: "how-to",
  },

  // ========== FIND COMMAND ==========
  {
    id: "find-what",
    command: "find",
    mainQuestion: "what is find",
    alternatives: [
      "what does find do",
      "find command meaning",
      "wht is find", // typo
      "what find for",
      "find definition",
      "how to find file",
    ],
    answer:
      "find searches for files and folders by name. It's powerful for locating files in many nested folders at once.",
    examples: [
      "$ find . -name '*.txt'     → Find all .txt files",
      "$ find . -name 'data*'     → Find files starting with 'data'",
      "$ find . -name 'config.json' → Find specific file",
    ],
    relatedCommands: ["grep", "ls"],
    category: "basics",
  },

  {
    id: "find-how",
    command: "find",
    mainQuestion: "how to find file",
    alternatives: [
      "how search for file",
      "hwo find file", // typo
      "how locate file",
      "how do i find a file",
      "find file how",
      "search for file how",
    ],
    answer: "Type 'find . -name filename' to search current folder and all subfolders for that file.",
    examples: [
      "$ find . -name 'app.js'",
      "$ find . -name '*.html'",
      "$ find . -name 'config*'",
    ],
    relatedCommands: ["ls", "grep"],
    category: "how-to",
  },

  // ========== SORT COMMAND ==========
  {
    id: "sort-what",
    command: "sort",
    mainQuestion: "what is sort",
    alternatives: [
      "what does sort do",
      "sort command meaning",
      "wht is sort", // typo
      "what sort for",
      "sort definition",
    ],
    answer:
      "sort arranges lines in a file alphabetically. It helps organize text data in order.",
    examples: [
      "$ sort file.txt          → Sort alphabetically",
      "$ sort names.txt         → Sort names",
      "$ sort data.txt | head   → Sort and show first lines",
    ],
    relatedCommands: ["cat", "grep"],
    category: "basics",
  },

  // ========== TYPO/ERROR HANDLING ==========
  {
    id: "typo-help",
    command: "general",
    mainQuestion: "i made a mistake",
    alternatives: [
      "command not found",
      "error",
      "it didnt work",
      "wat do i do",
      "somthing wrong", // typo
      "not working",
      "failed",
    ],
    answer:
      "Try 'help' to see all commands. Check:\n1. Is the command spelled correctly?\n2. Did you include all required arguments?\n3. Does the file/folder exist?",
    examples: [
      "$ help                  → Show all commands",
      "$ ls                    → List to check files",
      "$ pwd                   → Check your location",
    ],
    relatedCommands: ["help", "ls", "pwd"],
    category: "troubleshooting",
  },
];

/**
 * Find knowledge entry with typo tolerance
 * Handles spelling mistakes, grammar errors
 */
export function findKnowledgeEntry(question: string): KnowledgeEntry | null {
  const q = question.toLowerCase().trim();

  // Direct match first
  for (const entry of advancedKnowledgeBase) {
    if (q.includes(entry.mainQuestion)) {
      return entry;
    }

    // Check alternatives (exact or partial)
    for (const alt of entry.alternatives) {
      if (q.includes(alt) || similarityScore(q, alt) > 0.7) {
        return entry;
      }
    }
  }

  // Fuzzy match if no direct hit
  let bestMatch: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of advancedKnowledgeBase) {
    const mainScore = similarityScore(q, entry.mainQuestion);
    if (mainScore > bestScore) {
      bestScore = mainScore;
      bestMatch = entry;
    }

    for (const alt of entry.alternatives) {
      const altScore = similarityScore(q, alt);
      if (altScore > bestScore) {
        bestScore = altScore;
        bestMatch = entry;
      }
    }
  }

  // Return if confidence > 0.65
  return bestScore > 0.65 ? bestMatch : null;
}

/**
 * Get suggested next commands based on what you just did
 */
export function getSuggestedNextSteps(lastCommand: string): string[] {
  const cmd = lastCommand.toLowerCase().split(" ")[0];

  // Find the entry and return related commands
  for (const entry of advancedKnowledgeBase) {
    if (entry.command === cmd) {
      return entry.relatedCommands;
    }
  }

  return [];
}

/**
 * Calculate similarity between two strings (0-1)
 */
function similarityScore(str1: string, str2: string): number {
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);

  // Word overlap
  const commonWords = words1.filter((w) => words2.some((w2) => 
    w.includes(w2) || w2.includes(w) || levenshteinDistance(w, w2) <= 2
  )).length;

  return commonWords / Math.max(words1.length, words2.length);
}

/**
 * Levenshtein distance for typo tolerance
 */
function levenshteinDistance(s1: string, s2: string): number {
  const len1 = s1.length;
  const len2 = s2.length;
  const matrix = Array(len2 + 1)
    .fill(null)
    .map(() => Array(len1 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[0][i] = i;
  for (let j = 0; j <= len2; j++) matrix[j][0] = j;

  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[len2][len1];
}
