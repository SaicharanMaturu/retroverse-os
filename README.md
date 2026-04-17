# RetroVerse OS - Minimal Cyberpunk Terminal

A lightweight, fast terminal simulator built with React + TypeScript. 62 real commands, zero bloat.

![RetroVerse](https://img.shields.io/badge/version-1.0.0-green)
![Size](https://img.shields.io/badge/size-288KB-blue)
![Commands](https://img.shields.io/badge/commands-62-brightgreen)

## 🚀 Live Demo

**Play online:** https://superb-gumption-8d1fd5.netlify.app

## Features

- ✅ **62 Real Commands** - `ls`, `cd`, `mkdir`, `grep`, `find`, `man`, `achievements`, and more
- ⚡ **Lightweight** - Only 288KB total, 90KB gzipped
- 🎮 **Interactive** - Tab autocomplete, command history, suggestions
- 🏆 **Gamified** - Achievements, stats, challenges, skills tracking
- 🎨 **Themeable** - Dark, neon, and retro modes
- 📚 **Help System** - `man` command for every function
- 💡 **Tips** - Learn new commands with random tips

## Quick Commands

```
man ls           - Get help for ls command
about            - Show project info
achievements     - View your badges 🏆
stats            - See activity stats 📊
challenges       - View learning goals 🎯
skills           - Track skill progress 🚀
banner           - Show welcome screen
```

## All 62 Commands

### Gamification (5) 🎮
- `achievements` - View unlocked badges and progress
- `stats` - Detailed activity statistics
- `challenges` - Learning objectives with progress
- `banner` - Welcome ASCII art
- `skills` - Skill progression tracking

### Features (5) ✨
- `man <cmd>` - Manual for any command
- `about` - Project information
- `system` - System dashboard
- `theme` - Change theme (dark/neon/retro)
- `tip` - Get random learning tip

### File Operations (11)
- `ls`, `cd`, `pwd`, `mkdir`, `touch`, `cat`, `rm`, `cp`, `mv`, `echo`, `clear`

### System Info (6)
- `date`, `whoami`, `uname`, `uptime`, `df`, `ps`

### File Tools (5)
- `file`, `stat`, `ln`, `basename`, `dirname`

### Text Processing (6)
- `cut`, `paste`, `tr`, `rev`, `nl`, `col`

### Advanced (8)
- `grep`, `find`, `head`, `tail`, `wc`, `sort`, `uniq`, `chmod`

### History & Config (4)
- `history`, `alias`, `env`, `export`

### Utilities (6)
- `time`, `which`, `calc`, `bc`, `help`

## Quick Start

```bash
git clone https://github.com/SaicharanMaturu/retroverse-os.git
cd retroverse-os
npm install
npm run dev        # Local dev
npm run build      # Production build
```

Visit: https://superb-gumption-8d1fd5.netlify.app

## Usage Examples

```
ls                    # List files with emoji
mkdir projects        # Create folder
cd projects           # Enter folder
touch readme.txt      # Create file
cat readme.txt        # Read file
man ls                # Get help
achievements          # View badges 🏆
stats                 # Show statistics
challenges            # View goals
skills                # Track progress
challenge             # View learning objectives
banner                # Show welcome
theme neon            # Change theme
tip                   # Get learning tip
grep hello file       # Search
calc 10+5*2           # Math
```

## Tech Stack

- **React 18** + TypeScript
- **Tailwind CSS** for styling
- **Vite** for fast builds
- **Zustand** for state
- **Netlify** for hosting

## Stats

| Metric | Value |
|--------|-------|
| Commands | 62 |
| Bundle | 288KB |
| Gzipped | 90KB |
| Build | ~1.5s |
| Achievements | 4 |

## Keyboard Shortcuts

- `⬆ Arrow Up` - Previous command
- `⬇ Arrow Down` - Next command
- `Tab` - Autocomplete
- `Enter` - Execute

## License

MIT © 2026 Sai Charan Maturu

---

**🎮 Try it now:** https://superb-gumption-8d1fd5.netlify.app
