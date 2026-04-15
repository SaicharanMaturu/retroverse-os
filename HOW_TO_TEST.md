# Advanced Knowledge Base - Manual Testing Guide

## System Status ✅
- Build: **SUCCESSFUL** (No TypeScript errors)
- Knowledge Base: **INTEGRATED** into Terminal
- Debug Tools: **AVAILABLE** in browser console
- All 10 KB entries loaded with 50+ question variations

---

## How to Test Manually

### Setup
1. Open app at **http://localhost:5173**
2. Click on **Terminal** (bottom-left corner)
3. Type questions ending with `?`
4. System will show: `📚 Knowledge Base` or `🤖 AI Assistant`

---

## Test Sequence (Copy-Paste These in Order)

### LS Command Tests (4 tests)
```
what is ls?
wht is ls?
how to show files?
after ls what next?
```
**Expected Result**: All show `📚 Knowledge Base` with answer + examples + next commands

---

### MKDIR Command Tests (3 tests)
```
what is mkdir?
wat is mkdir?
how make directory?
```
**Expected Result**: All show `📚 Knowledge Base`

---

### CD Command Tests (2 tests)
```
what is cd?
how to go inside folder?
```
**Expected Result**: All show `📚 Knowledge Base`

---

### TOUCH Command Tests (3 tests)
```
what is touch?
wht touch for?
hwo create file?
```
**Expected Result**: All show `📚 Knowledge Base` with typo tolerance

---

### Follow-up Questions (3 tests)
```
after mkdir what next?
after touch what i do?
after changing directory what can i do?
```
**Expected Result**: 
- Shows appropriate answer
- Shows `💡 Next commands you might try: ...`

---

### Error Handling (2 tests)
```
something not working?
command didnt work?
```
**Expected Result**: `📚 Knowledge Base` with troubleshooting help

---

### Extreme Typos (Test Levenshtein Distance)
```
wht is ls?
mkidr definition?
cd folder means wat?
touc command?
```
**Expected Result**: All should still match despite multiple typos

---

## What You're Testing

### ✅ Feature 1: Typo Tolerance
**Goal**: System understands misspelled words
```
"wht" should match "what"
"mkidr" should match "mkdir"
"direktory" should match "directory"
"touc" should match "touch"
```

### ✅ Feature 2: Multiple Phrasings
**Goal**: Different ways of asking should work
```
"what is ls" = "what does ls do" = "ls meaning" = "ls definition"
"how make file" = "hwo create file" = "new file how" = "create file how"
```

### ✅ Feature 3: Context-Aware Follow-ups
**Goal**: After executing a command, system suggests what to do next
```
User: "after mkdir what next?"
System returns: "Next commands: cd, ls, touch"
```

### ✅ Feature 4: Examples for Every Answer
**Goal**: Each answer includes practical examples
```
Answer shows:
- What command does
- HOW to use it (with examples)
- What to do next
```

### ✅ Feature 5: Source Attribution
**Goal**: Shows where answer came from
```
📚 Knowledge Base = From advancedKnowledgeBase (perfect match)
🤖 AI Assistant = Fallback if no KB match
```

---

## Using Browser Console for Advanced Testing

Open DevTools (F12) and try:

### Option 1: Test Individual Questions
```javascript
window.debugKB.test("what is mkdir?")
// Output shows: match score, matched entry, alternatives tried
```

### Option 2: Test All 18 Predefined Questions
```javascript
window.debugKB.testAll()
// Logs detailed results for each test case
```

### Option 3: Custom Batch Test
```javascript
window.debugKB.batchTest([
  "wht is ls?",
  "hwo make file?",
  "after cd what?"
])
// Returns array with detailed match info
```

### Option 4: Print Formatted Results
```javascript
const result = window.debugKB.test("your question?");
console.log(window.debugKB.printResults(result));
// Pretty-printed results with scores
```

---

## Expected Console Output Example

```
═════════════════════════════════════════
Question: "wht is ls?"
═════════════════════════════════════════
✓ Matched: YES ✅
  | Entry: ls-what (ls)
  | Score: 85.3%
  | Threshold: 65% (needs to be above this)
─────────────────────────────────────────
📊 Score Breakdown:
  | Main Question Score: 75.0%
  | Best Alternative Score: 85.3%
─────────────────────────────────────────
Top Matching Alternatives:
  | "wht is ls" → 85.3% match
  | "what is ls" → 90.0% match
  | "what ls mean" → 72.1% match
─────────────────────────────────────────
Answer Preview:
  ls (list) shows all files and folders in your current directory. It's like opening a folder on your...
═════════════════════════════════════════
```

---

## Success Criteria - Verification Checklist

### Basic Functionality ✅
- [ ] Questions with `?` trigger Knowledge Base lookup
- [ ] No matching question falls back to NLP Q&A
- [ ] System doesn't crash on any input

### Typo Tolerance ✅
- [ ] "wht" matches despite missing 'a'
- [ ] "hwo" matches despite 'h' and 'w' transposed
- [ ] "mkidr" matches despite transposed letters
- [ ] Levenshtein distance working (≤2 char differences)

### Fuzzy Matching ✅
- [ ] "show files" finds "how to show files" entry
- [ ] "go inside" finds "go into a folder" entry
- [ ] "now what" finds follow-up entries
- [ ] Word order doesn't matter

### Answer Quality ✅
- [ ] Each answer has clear explanation
- [ ] Examples are provided (3+ per entry)
- [ ] Related commands suggested ("💡 Try next:")
- [ ] Answer is relevant to question

### Fallback Behavior ✅
- [ ] If no KB match (score < 0.65), uses NLP Q&A
- [ ] NLP answers are reasonable
- [ ] No crashes on edge cases

---

## Test Results Reporting

When you've tested, report:

### ✅ All Tests Pass
```
Category          | Passed | Total | Status
─────────────────────────────────────────
LS Commands       |   4/4  |   4   | ✅ PASS
MKDIR Commands    |   3/3  |   3   | ✅ PASS
CD Commands       |   2/2  |   2   | ✅ PASS
TOUCH Commands    |   3/3  |   3   | ✅ PASS
Follow-ups        |   3/3  |   3   | ✅ PASS
Error Handling    |   2/2  |   2   | ✅ PASS
Extreme Typos     |   4/4  |   4   | ✅ PASS
─────────────────────────────────────────
TOTAL             |  21/21 |  21   | ✅ PASS
```

### If Any Fail
Which test? What was expected? What happened instead?

---

## Next Steps After Verification

✅ **If all tests pass**:
- Add 10+ more KB entries for: cat, rm, cp, mv, pwd, grep, echo, help, find, sort
- Expand each with 8+ variations
- Add more context tracking

❌ **If tests fail**:
- Which entry didn't match?
- What was the question?
- Check similarity score (should be > 0.65)
- Add that variant to alternatives list

---

## Pro Tips

1. **Type slowly**: Sometimes Terminal registration might lag
2. **Use exact examples from guide**: Ensures you're testing real cases
3. **Check console logs**: Browser DevTools shows what the app is doing
4. **Test typos progressively**: Start with 1 typo, then add more
5. **Try phrasing variations**: "what is x" vs "x definition" vs "tell me x"

---

## Files to Reference

- **Terminal**: Open at http://localhost:5173
- **Test Guide**: [KNOWLEDGE_BASE_TEST.md](KNOWLEDGE_BASE_TEST.md)
- **KB Source**: [src/core/advancedKnowledgeBase.ts](src/core/advancedKnowledgeBase.ts)
- **Terminal Code**: [src/apps/terminal/Terminal.tsx](src/apps/terminal/Terminal.tsx)
- **Debug Tools**: [src/core/debugKnowledgeBase.ts](src/core/debugKnowledgeBase.ts)

