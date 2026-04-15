# Advanced Knowledge Base - Test Verification Guide

## How It Works
1. Type a question ending with `?` in the Terminal
2. System searches advancedKnowledgeBase using fuzzy matching
3. Shows answer + examples + related commands
4. If no match (score < 0.65), falls back to general NLP Q&A

---

## Test Cases - LS Command

### Test 1: Basic Question (No Typo)
```
Input:  what is ls?
Expected: 📚 Knowledge Base
Answer: "ls (list) shows all files and folders..."
Examples shown
Next commands: pwd, cd, cat
```

### Test 2: Typo Tolerance - Missing Letter
```
Input:  wht is ls?
Expected: MATCH - Levenshtein distance catches "wht" ≈ "what"
Answer: Same as Test 1
```

### Test 3: Alternative Phrasing
```
Input:  how to show files?
Expected: MATCH - Matches "ls-how" entry with "how to show files" alternative
Answer: "Just type 'ls' and press Enter..."
Examples: Direct ls examples
Next commands: cd, pwd, cat, mkdir
```

### Test 4: Typo + Grammar Error
```
Input:  hwo see content?
Expected: MATCH - Fuzzy matching finds "how see content" in alternatives
Answer: "Just type 'ls' and press Enter..."
```

### Test 5: Follow-up Question
```
Input:  after ls what next?
Expected: MATCH - "ls-after" entry
Answer: "After listing files, you can:\n1. View with cat...\n2. Go into folder with cd..."
Next commands: cat, cd, rm, touch
```

---

## Test Cases - MKDIR Command

### Test 6: What is mkdir (with typo)
```
Input:  wat is mkdir?
Expected: MATCH - "wat" ≈ "what"
Answer: "mkdir (make directory) creates a new folder..."
Next commands: cd, ls, touch
```

### Test 7: How to make folder
```
Input:  how make directory?
Expected: MATCH - Matches "mkdir-how" entry
Answer: "Type 'mkdir foldername'..."
Examples shown
```

### Test 8: After mkdir what to do
```
Input:  i created folder now what?
Expected: MATCH - Fuzzy matches with "mkdir-after" alternatives
Answer: "Change into it with 'cd', create files with 'touch'..."
Next commands: cd, ls, touch, rm
```

---

## Test Cases - CD Command

### Test 9: What is cd
```
Input:  what is cd?
Expected: MATCH - Direct match
Answer: "cd (change directory) moves you into a different folder..."
```

### Test 10: How to change directory
```
Input:  how to go inside folder?
Expected: MATCH - "cd-how" entry matches "go inside" variant
Answer: "Type 'cd foldername'..."
```

### Test 11: After cd (Context-aware)
```
Input:  after changing folder what?
Expected: MATCH - "cd-after" entry
Answer: "After changing to a folder, you can: List files with 'ls'..."
Next commands: ls, touch, mkdir
```

---

## Test Cases - TOUCH Command

### Test 12: What is touch
```
Input:  wht touch for?
Expected: MATCH - Levenshtein catches "wht" ≈ "what"
Answer: "touch creates a new empty file..."
Examples: touch file.txt, touch script.py
```

### Test 13: How to create file
```
Input:  hwo create file?
Expected: MATCH - "touch-how" entry with typo in "hwo"
Answer: "Type 'touch filename'..."
Examples shown
```

### Test 14: After creating file
```
Input:  after creating file what i do?
Expected: MATCH - Grammar flexible fuzzy matching
Answer: "After creating a file, you can: View with 'cat'..."
```

---

## Test Cases - Error Handling

### Test 15: General Error/Typo Help
```
Input:  something not working?
Expected: MATCH - "typo-help" entry
Answer: "Try 'help' to see all commands..."
```

### Test 16: Failed Command
```
Input:  command not found what do?
Expected: MATCH - Entry with "somthing wrong" alternative
Answer: Troubleshooting guide
```

---

## Feature Verification Checklist

### Typo Tolerance ✓
- [ ] "wht" matches "what"
- [ ] "hwo" matches "how"
- [ ] "mkidr" matches "mkdir" 
- [ ] "direktory" matches "directory"
- [ ] "nexrt" matches "next"

### Fuzzy Matching ✓
- [ ] "show files" matches "how to show files" entry
- [ ] "go inside" matches "go into a folder"
- [ ] "i created folder" matches alternatives list

### Related Commands ✓
- [ ] After "ls?" → suggests "pwd, cd, cat"
- [ ] After "mkdir?" → suggests "cd, ls, touch"
- [ ] After "touch?" → suggests "cat, ls, rm"

### Fallback to NLP ✓
- [ ] Questions not in KB (score < 0.65) fall back to general NLP
- [ ] System doesn't crash on unknown questions

---

## Quick Test Sequence

Copy-paste these in order to Terminal:

```
what is ls?
wht is ls?
how to show files?
what is mkdir?
how make directory?
after mkdir what next?
what is cd?
how to change directory?
wht touch for?
hwo create file?
after creating file what i do?
something not working?
```

Expected: All should return 📚 Knowledge Base answers with examples and next commands.

---

## Success Criteria

✅ **All 16+ test cases** return 📚 Knowledge Base (not 🤖 AI Assistant)
✅ **Typo tolerance** - misspelled words still match
✅ **Fuzzy matching** - various phrasings work
✅ **Examples shown** - each answer includes examples
✅ **Next commands** - "Try next:" suggestions appear
✅ **No crashes** - system handles all questions gracefully
✅ **Build compiles** - No TypeScript errors

