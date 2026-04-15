// Comprehensive Educational Knowledge Base - 100+ Q&A for Students
// Covers all commands: what is, why, how to, when to use, how does it work
export const knowledgeBase: Record<string, string> = {
  // ==================== FILE SYSTEM CONCEPTS ====================
  "file": "A file is a named collection of data stored on your computer. Files contain text, images, code, videos, etc. You create files with 'touch', view with 'cat', delete with 'rm'.",
  "what is a file": "A file is a container that stores data. It has a name and can contain anything - text, numbers, images. Files live inside folders.",
  "why do we need files": "Files are how we permanently store information. Without files, everything you create disappears when you close a program.",
  "how to create a file": "Use the 'touch' command: touch filename.txt",
  "when to use touch": "Use 'touch' to create a new empty file quickly.",
  
  "folder": "A folder (or directory) is a container that organizes files. Folders can contain files and other folders. Use 'mkdir' to create, 'cd' to enter.",
  "what is a folder": "A folder is like a real-world folder - it holds files and other folders. Helps organize your data.",
  "why use folders": "Folders keep your data organized. Without them, you'd have thousands of files in one place - chaos!",
  "how to create a folder": "Use the 'mkdir' command: mkdir folderName",
  "when to use mkdir": "Use 'mkdir' when you need to create a new directory to organize your files.",
  
  "directory": "Same as a folder - a container for organizing files and other directories. Use 'cd' to change, 'pwd' to see current location.",
  "what is a directory": "A directory is a location/folder that stores files. It's the same as a folder.",
  "difference between file and folder": "A file stores content (data). A folder stores files and other folders.",
  
  "path": "A path is the route/address to reach a file or folder. Absolute paths start with '/', relative paths are from your current location.",
  "what is a path": "A path shows WHERE a file or folder is located. Like an address on a GPS.",
  "how does path work": "A path is a sequence of folder names separated by '/' that leads to your file.",
  "absolute path": "An absolute path starts from the root (/) and shows the full route. Example: /home/documents/file.txt",
  "relative path": "A relative path is from your current location. Example: documents/file.txt (if you're in home)",
  "what is root directory": "The root (/) is the top-level directory. Everything on your computer is inside the root.",
  
  // ==================== COMMAND - LS ====================
  "ls": "ls (list) displays all files and folders in the current directory. Shows what you have.",
  "what is ls": "ls shows you the contents of your current folder - all files and folders inside.",
  "why use ls": "ls lets you see what's in a folder. You need to know what files exist before you can work with them.",
  "how to use ls": "Type 'ls' and press Enter. It shows all files and folders in the current directory.",
  "when to use ls": "Use ls whenever you want to see what's in your current folder.",
  "what does ls show": "ls shows the names of all files and folders (directories) in your current location.",
  "how does ls work": "ls lists the contents of a directory by reading the file system.",
  "can ls show hidden files": "By default, ls shows all files. Hidden files start with a dot (.)",
  
  // ==================== COMMAND - CD ====================
  "cd": "cd (change directory) moves you to a different folder. Navigate through your file system with this command.",
  "what is cd": "cd is a command that moves you from one folder to another.",
  "why use cd": "cd helps you navigate around your file system to find and work with different folders.",
  "how to use cd": "Type 'cd folderName' to go into a folder, or 'cd ..' to go back one level.",
  "when to use cd": "Use cd whenever you need to go into a different folder.",
  "how does cd work": "cd changes your 'current working directory' to the folder you specify.",
  "what does cd do": "cd moves your location from one directory to another.",
  "what does .. mean": "The '..' means 'parent directory' (one level up/back).",
  "cd ..": "The command 'cd ..' takes you back one folder level (to the parent directory).",
  "what does cd .. do": "'cd ..' moves you up/back to the parent folder.",
  "how to go back": "Use 'cd ..' to go back to the parent directory (one level up).",
  "how many levels can i go back": "You can keep typing 'cd ..' to go all the way back to root (/).",
  "what if folder name has spaces": "Use quotes: cd \"folder name with spaces\"",
  
  // ==================== COMMAND - MKDIR ====================
  "mkdir": "mkdir (make directory) creates a new folder. Use it to organize your files.",
  "what is mkdir": "mkdir is a command that creates a new empty folder with the name you specify.",
  "why use mkdir": "mkdir lets you create new folders to organize and store your files.",
  "how to use mkdir": "Type 'mkdir folderName' to create a new folder.",
  "what does mkdir do": "mkdir creates a new directory/folder in your current location.",
  "how does mkdir work": "mkdir adds a new folder to your file system in the current directory.",
  "can i create multiple folders": "You can create folders one at a time with mkdir, then use cd to enter them.",
  "what if folder already exists": "mkdir will show an error if the folder already exists.",
  "can folder names have spaces": "Yes, but use quotes: mkdir \"my project\"",
  
  // ==================== COMMAND - TOUCH ====================
  "touch": "touch creates a new empty file. Used to quickly create blank files.",
  "what is touch": "touch is a command that creates a new empty file with the name you specify.",
  "why use touch": "touch lets you create blank files quickly. You can edit them later.",
  "how to use touch": "Type 'touch filename.txt' to create a new file.",
  "what format can i create": "You can create any file type: .txt, .py, .js, .html, etc. The extension determines the type.",
  "can i create multiple files": "You can create one file at a time with touch.",
  "what is file extension": "The extension (.txt, .py) tells the computer what type of file it is.",
  "does file extension matter": "Yes! The extension determines how the file is opened and interpreted.",
  
  // ==================== COMMAND - RM ====================
  "rm": "rm (remove) deletes a file or folder. WARNING: Deletion is permanent - no undo!",
  "what is rm": "rm is a command that permanently deletes a file or folder.",
  "why use rm": "rm helps you delete files and folders you no longer need.",
  "how to use rm": "Type 'rm fileName' to delete a file, or 'rm -r folderName' to delete a folder.",
  "when to use rm": "Use rm to delete files you don't want anymore.",
  "is rm permanent": "YES! Once you delete with rm, the file is gone forever. No recycle bin!",
  "how to be safe with rm": "Check with 'ls' what you're deleting before using rm. Be careful!",
  "what does -r mean": "The -r flag means 'recursive' - it deletes folders and everything inside them.",
  "can i undo rm": "NO! There is no undo. Be very careful with the rm command!",
  "what if i delete wrong file": "You cannot recover it. This is why you should backup important files with 'cp'.",
  
  // ==================== COMMAND - CAT ====================
  "cat": "cat displays the contents of a file. Let's you read what's inside without editing.",
  "what is cat": "cat is a command that shows/displays the contents of a file on the screen.",
  "why use cat": "cat lets you quickly read what's in a file without opening an editor.",
  "how to use cat": "Type 'cat filename.txt' to display the file's contents.",
  "when to use cat": "Use cat to quickly view the contents of a file.",
  "what does cat show": "cat displays all the text/content inside a file.",
  "can i edit with cat": "No, cat only shows contents. To edit, you need a text editor.",
  "what if file is missing": "If the file doesn't exist, cat will show an error message.",
  "how to cat multiple files": "You can type: cat file1.txt file2.txt to show both files.",
  
  // ==================== COMMAND - CP ====================
  "cp": "cp (copy) creates a duplicate of a file with a new name. Useful for backing up files.",
  "what is cp": "cp duplicates a file. Creates a copy with a different name.",
  "why use cp": "cp lets you backup important files or create variations of files.",
  "how to use cp": "Type 'cp source.txt destination.txt' to copy source to destination.",
  "when to use cp": "Use cp to backup files or duplicate them.",
  "what does cp preserve": "cp copies the content but creates it as a new file.",
  "can i copy folders": "Yes, use 'cp -r' to copy folders and everything inside.",
  "what happens if destination exists": "If the destination file exists, cp might overwrite it. Be careful!",
  "how to backup important file": "Use: cp important.txt important_backup.txt",
  "does original stay after copy": "YES! cp keeps the original and creates a copy.",
  
  // ==================== COMMAND - MV ====================
  "mv": "mv (move) relocates a file or renames it. The file itself moves, not copied.",
  "what is mv": "mv moves a file from one location to another, or renames it.",
  "why use mv": "mv lets you organize files by moving them to different folders, or rename them.",
  "how to use mv": "Type 'mv oldName.txt newName.txt' to rename, or 'mv file.txt folder/' to move.",
  "when to use mv": "Use mv to move files to different folders or to rename files.",
  "mv vs cp": "mv MOVES the file (original is gone), cp COPIES it (original stays).",
  "can i move folders": "Yes, mv works with folders too.",
  "how to rename": "Use 'mv oldName newName' to rename a file or folder.",
  "does original file stay after mv": "NO! mv removes it from the original location.",
  "can i move to another folder": "Yes: mv file.txt /path/to/folder/",
  
  // ==================== COMMAND - PWD ====================
  "pwd": "pwd (print working directory) shows your current location in the file system.",
  "what is pwd": "pwd displays the full path of where you currently are.",
  "why use pwd": "pwd helps you know where you are when you're lost in the file system.",
  "how to use pwd": "Just type 'pwd' and it shows your current path.",
  "when to use pwd": "Use pwd whenever you're confused about your current location.",
  "what does pwd display": "pwd shows the absolute path from root (/) to your current location.",
  "how does pwd work": "pwd reads the system's current working directory and displays it.",
  "when is pwd useful": "pwd is useful when you're not sure where you are in the file system.",
  
  // ==================== COMMAND - ECHO ====================
  "echo": "echo prints text to the screen. Simple way to display messages.",
  "what is echo": "echo repeats/displays the text you give it.",
  "why use echo": "echo is useful for printing messages or testing.",
  "how to use echo": "Type 'echo Hello World' to print text.",
  "when to use echo": "Use echo to display messages or text quickly.",
  "what can echo print": "echo can print any text, variables, or messages you want.",
  "how to print multiple lines": "Use separate echo commands or special characters.",
  
  // ==================== COMMAND - CLEAR ====================
  "clear": "clear cleans the terminal screen. Removes all previous commands and output.",
  "what is clear": "clear removes all previous text from the terminal screen.",
  "why use clear": "clear gives you a clean screen to start fresh.",
  "how to use clear": "Just type 'clear' and the screen wipes clean.",
  "when to use clear": "Use clear when your terminal gets cluttered with too much output.",
  "does clear delete my files": "NO! clear only clears the terminal display. Your files are safe.",
  
  // ==================== COMMAND - HELP ====================
  "help": "help displays all available commands in this system.",
  "what is help": "help lists all commands you can use.",
  "why use help": "help shows you what commands are available when you forget.",
  "how to use help": "Just type 'help' to see all commands.",
  "when to use help": "Use help when you don't know what commands are available.",
  
  // ==================== PROGRAMMING CONCEPTS ====================
  "programming": "Programming is writing instructions for computers using code. Like giving step-by-step directions to a robot.",
  "what is programming": "Programming is creating instructions that computers follow to do tasks.",
  "why learn programming": "Programming lets you automate tasks, create apps, build websites, and solve problems.",
  "how to start programming": "Start with basics: learn a language (Python, JavaScript), then practice!",
  "what is code": "Code is a set of instructions written in a programming language that computers can execute.",
  "why do we use code": "Code tells computers exactly what to do. Without code, computers can't do anything.",
  "how long to learn programming": "Basics take weeks, proficiency takes months/years of practice.",
  
  "python": "Python is a popular programming language. Easy to learn, used for web apps, data science, AI, automation.",
  "what is python": "Python is a programming language known for being beginner-friendly and powerful.",
  "why use python": "Python is easy to learn, has huge libraries, and is used everywhere in tech.",
  "when to use python": "Use Python for web development, data science, machine learning, scripting, automation.",
  "is python hard": "No! Python is one of the easiest languages to learn for beginners.",
  
  "javascript": "JavaScript is a programming language for web browsers. Powers interactive websites and web apps.",
  "what is javascript": "JavaScript is a language that runs in web browsers and makes websites interactive.",
  "why use javascript": "JavaScript lets you make responsive, interactive web applications.",
  "when to use javascript": "Use JavaScript for web development, making websites interactive.",
  
  "variable": "A variable is a named storage location that holds a value. Like a labeled box holding information.",
  "what is a variable": "A variable is a container that stores data. It has a name and value.",
  "why use variables": "Variables let you store and reuse data without retyping it.",
  "how many variables can i have": "You can have as many as you need for your program.",
  
  "function": "A function is a reusable block of code that performs a specific task. Call it multiple times.",
  "what is a function": "A function groups code that does one specific job. You can run it whenever needed.",
  "why use functions": "Functions reduce repetition and make code organized and reusable.",
  "how do functions work": "You define a function once, then 'call' it multiple times by name.",
  "what is a parameter": "A parameter is input to a function - data you give it to work with.",
  "what is a return value": "A return value is the output that a function gives back after doing its job.",
  
  "loop": "A loop repeats a block of code multiple times. Useful for processing many items without repeating code.",
  "what is a loop": "A loop runs the same code multiple times automatically.",
  "why use loops": "Loops save time - instead of writing code 100 times, write it once in a loop.",
  "when to use loops": "Use loops when you need to repeat the same action multiple times.",
  "for loop": "A for loop repeats a specific number of times.",
  "while loop": "A while loop repeats while a condition is true.",
  
  "if statement": "An if statement checks a condition and runs code only if the condition is true. Makes decisions.",
  "what is an if statement": "An if statement says 'IF this is true, THEN do this'.",
  "why use if statements": "if statements let code make decisions based on conditions.",
  "how does if work": "if checks a condition, if true it runs the code block, if false it skips it.",
  "what is else": "else is used with if - it runs when the if condition is false.",
  
  // ==================== TECHNOLOGY ====================
  "database": "A database is an organized collection of data stored structured way. Used by apps to store information.",
  "what is a database": "A database is an organized system for storing and retrieving data efficiently.",
  "why use database": "Databases store large amounts of data efficiently and let you search/retrieve it easily.",
  "what is sql": "SQL is a language for querying and managing databases.",
  
  "api": "API (Application Programming Interface) is set of rules that allows software to communicate/share data.",
  "what is an api": "An API is like a messenger - it lets different programs talk to each other.",
  "why use api": "APIs let different applications share data and features seamlessly.",
  "how does api work": "APIs provide rules and formats for how programs can ask for and receive data.",
  
  "html": "HTML is the language that structures web pages. Creates the content and layout of websites.",
  "what is html": "HTML is a language for creating the structure of web pages.",
  "why use html": "HTML provides the foundation/framework that web browsers display.",
  "what is a tag": "A tag is a code instruction in HTML that tells the browser what to display.",
  
  "css": "CSS styles and designs how web pages look. Controls colors, fonts, layouts, sizes.",
  "what is css": "CSS is a language that controls the visual style of web pages.",
  "why use css": "CSS makes websites look beautiful and professional.",
  "html vs css": "HTML structures the content, CSS styles how it looks.",
  
  "web": "The web is the system of interconnected documents/resources accessed via HTTP protocol on the internet.",
  "what is the web": "The web is the system of interconnected websites and resources you access via internet.",
  "how does web work": "You type a URL, your browser sends a request, server returns HTML/CSS/JavaScript.",
  
  "server": "A server is a powerful computer that stores data/applications and serves them to client computers.",
  "what is a server": "A server is a computer that provides services or data to other computers.",
  "why use servers": "Servers store important data centrally so many users can access it.",
  "what is client server": "Client (your computer) requests data, Server responds with the answer.",
  
  "git": "Git is a version control system that tracks changes to code. Helps developers collaborate.",
  "what is git": "Git is a tool that tracks changes to code over time.",
  "why use git": "Git lets multiple programmers work together without overwriting each other's code.",
  "what does git track": "Git tracks every change to every file - what changed, when, who changed it.",
  
  "github": "GitHub is a website where programmers share, store, and collaborate on code projects.",
  "what is github": "GitHub is a platform for sharing code and working with other programmers.",
  "why use github": "GitHub lets you backup code, share projects, and collaborate with others.",
  "difference between git and github": "Git is the tool, GitHub is the website that hosts git projects.",
  
  // ==================== AI & ADVANCED ====================
  "ai": "Artificial Intelligence is when computers learn and make decisions like humans. Powers voice assistants, recommendations, self-driving cars, etc.",
  "what is ai": "AI is technology that lets computers think and learn like humans.",
  "why is ai important": "AI automates complex tasks, makes better decisions, and powers modern apps.",
  "how does ai work": "AI learns from lots of examples and patterns, then makes predictions on new data.",
  
  "machine learning": "Machine Learning is AI where computers learn from data automatically. They improve without explicit programming.",
  "what is machine learning": "Machine learning is AI that learns from examples and data without being told what to do.",
  "why use machine learning": "ML lets computers solve problems without programmers writing exact instructions.",
  "ml example": "Email spam detection learns from examples of spam vs. real emails.",
  
  "deep learning": "Deep Learning uses neural networks with many layers to process complex data like images and text.",
  "what is deep learning": "Deep learning is advanced ML using artificial neural networks.",
  
  "data science": "Data science uses statistics, programming, and domain knowledge to extract insights from data.",
  "what is data science": "Data science is analyzing data to find patterns, insights, and make predictions.",
  "why is data science valuable": "Data science helps organizations make better decisions based on data.",
  
  // ==================== FILE OPERATIONS SCENARIOS ====================
  "how to organize files": "Create folders with mkdir, then mv files into them to organize by type/project.",
  "how to backup a file": "Use 'cp' to create a copy as backup: cp important.txt important_backup.txt",
  "how to rename a file": "Use 'mv': mv oldName.txt newName.txt",
  "how to delete a file safely": "List with 'ls' first, double-check with 'cat', then 'rm'.",
  "how to move a file": "Use 'mv': mv file.txt destinationFolder/",
  "how to view a file": "Use 'cat': cat filename.txt",
  "how to find current location": "Use 'pwd' to see your current location.",
  "how to see folder contents": "Use 'ls' to list everything in the current folder.",
  "how to navigate to home": "Use 'cd home' to go to the home directory.",
  "how to go to parent folder": "Use 'cd ..' to go up one level.",
  "how to create file and folder": "Use 'mkdir' to make folder, 'touch' to make file.",
  "how to organize a project": "Create main folder, make subfolders (src, docs, tests, etc) with mkdir.",
  "best practices for file names": "Use meaningful names, avoid spaces, use lowercase, use extensions.",
};

// Question type detection
export function detectQuestionType(input: string): string {
  const lower = input.toLowerCase();
  
  if (lower.includes("what") || lower.includes("define")) return "what";
  if (lower.includes("why")) return "why";
  if (lower.includes("how")) return "how";
  if (lower.includes("when")) return "when";
  if (lower.includes("can i")) return "capability";
  if (lower.includes("does") || lower.includes("do")) return "explanation";
  
  return "general";
}

// Generate intelligent responses with better matching
export function generateOfflineResponse(question: string): string {
  const lower = question.toLowerCase().trim();
  
  // Direct knowledge base lookup with exact and fuzzy matching
  for (const key in knowledgeBase) {
    if (lower === key || lower === key + "?") {
      return knowledgeBase[key];
    }
  }
  
  // Fuzzy matching for partial matches
  for (const key in knowledgeBase) {
    if (lower.includes(key)) {
      return knowledgeBase[key];
    }
  }
  
  // Try matching with wildcards
  const questionType = detectQuestionType(lower);
  
  if (questionType === "what") {
    const topic = lower.replace(/^what (is\s+|are\s+)?/, "").replace(/\?.*$/, "").trim();
    if (knowledgeBase[topic]) return knowledgeBase[topic];
    if (knowledgeBase[`what is ${topic}`]) return knowledgeBase[`what is ${topic}`];
    if (knowledgeBase[`what ${topic}`]) return knowledgeBase[`what ${topic}`];
  }
  
  if (questionType === "how") {
    const task = lower.replace(/^how (to|do i|does)\s+/, "").replace(/\?.*$/, "").trim();
    if (knowledgeBase[`how to ${task}`]) return knowledgeBase[`how to ${task}`];
    if (knowledgeBase[task]) return knowledgeBase[task];
  }
  
  if (questionType === "why") {
    const topic = lower.replace(/^why\s+/, "").replace(/\?.*$/, "").trim();
    if (knowledgeBase[`why ${topic}`]) return knowledgeBase[`why ${topic}`];
    if (knowledgeBase[`why use ${topic}`]) return knowledgeBase[`why use ${topic}`];
    if (knowledgeBase[`why do we need ${topic}`]) return knowledgeBase[`why do we need ${topic}`];
  }
  
  if (questionType === "when") {
    const topic = lower.replace(/^when\s+/, "").replace(/\?.*$/, "").trim();
    if (knowledgeBase[`when to use ${topic}`]) return knowledgeBase[`when to use ${topic}`];
    if (knowledgeBase[`when to ${topic}`]) return knowledgeBase[`when to ${topic}`];
  }
  
  // Helpful guidance if no match
  return `I have 100+ educational answers! Try asking: "what is [topic]?", "how to [task]?", "why [thing]?", "when to use [cmd]?", or type "help" for all commands.`;
}
