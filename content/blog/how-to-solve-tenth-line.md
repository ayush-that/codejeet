---
title: "How to Solve Tenth Line — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Tenth Line. Easy difficulty, 36.2% acceptance rate. Topics: Shell."
date: "2026-08-17"
category: "dsa-patterns"
tags: ["tenth-line", "shell", "easy"]
---

# How to Solve Tenth Line

This problem asks you to print only the 10th line from a text file. While conceptually simple, it's interesting because it tests your understanding of shell scripting fundamentals, file processing, and edge case handling. The low acceptance rate (36.2%) suggests many candidates struggle with the nuances of shell commands and proper error handling.

## Visual Walkthrough

Let's trace through a concrete example. Suppose `file.txt` contains:

```
Line 1
Line 2
Line 3
Line 4
Line 5
Line 6
Line 7
Line 8
Line 9
Line 10
Line 11
Line 12
```

We want to extract just "Line 10" (the 10th line). Here's what happens conceptually:

1. **Read the file**: The system opens `file.txt` and prepares to read it line by line
2. **Count lines**: We need to track which line number we're currently processing
3. **Stop at line 10**: When we reach the 10th line, we should output it
4. **Handle missing lines**: If the file has fewer than 10 lines, we should output nothing

The challenge is doing this efficiently in a shell environment where we can't easily store all lines in memory (for very large files) and need to handle edge cases properly.

## Brute Force Approach

A naive approach might read the entire file into memory and then access the 10th element. In shell scripting, this could look like:

```bash
# Problematic approach - reads entire file
lines=$(cat file.txt)
echo "$lines" | head -10 | tail -1
```

**Why this is insufficient:**

1. **Memory inefficiency**: For large files, storing all lines in memory is wasteful
2. **Incorrect for short files**: If the file has fewer than 10 lines, this might still output something (possibly the last line)
3. **Multiple commands**: Using multiple pipes (`|`) adds overhead

While this might work for small files, it doesn't demonstrate understanding of efficient file processing or proper edge case handling.

## Optimal Solution

The optimal solution uses `sed`, `awk`, or `head/tail` combinations that process the file stream efficiently without loading everything into memory. Here are three clean approaches:

<div class="code-group">

```bash
# Solution 1: Using sed (Stream Editor)
# Time: O(n) - processes file once | Space: O(1) - constant memory
# sed -n '10p' means: don't print by default (-n), print only line 10 (10p)
sed -n '10p' file.txt
```

```bash
# Solution 2: Using awk
# Time: O(n) - processes file once | Space: O(1) - constant memory
# NR is the current record (line) number. When NR==10, print the line
awk 'NR==10' file.txt
```

```bash
# Solution 3: Using head and tail (efficient combination)
# Time: O(n) - but only reads up to line 10 | Space: O(1) - constant memory
# head -10 gets first 10 lines, tail -1 gets the last of those (line 10)
head -10 file.txt | tail -1
```

</div>

**Detailed explanation of each approach:**

**Solution 1 (sed):**

- `sed -n` tells sed not to print lines by default
- `'10p'` is the sed command meaning "on line 10, print"
- This processes the file line by line, only printing when it reaches line 10
- Very efficient for large files since it stops processing after line 10 (in GNU sed)

**Solution 2 (awk):**

- `NR` is a built-in awk variable that tracks the current record (line) number
- `NR==10` is a pattern that matches only when we're on line 10
- When the pattern matches, awk executes the default action (print the line)
- Clean and readable, with good performance

**Solution 3 (head + tail):**

- `head -10` reads and outputs only the first 10 lines
- `tail -1` takes that output and returns only the last line (line 10)
- Some implementations continue reading the entire file, but many optimize to stop after 10 lines
- Intuitive approach that's easy to remember

## Complexity Analysis

**Time Complexity: O(n) in worst case, but often better**

- All solutions process the file sequentially
- In the worst case (line 10 is near the end or file has <10 lines), they read the entire file: O(n)
- For `head -10 | tail -1`, most implementations stop reading after 10 lines: O(1) for files with ≥10 lines
- `sed` and `awk` typically process the entire file but are optimized for streaming

**Space Complexity: O(1)**

- All solutions process the file line by line
- They only need to store the current line and a counter
- No solution loads the entire file into memory
- This is crucial for handling very large files

## Common Mistakes

1. **Off-by-one errors with head/tail combinations**

   ```bash
   # WRONG: This gets line 11, not line 10
   head -11 file.txt | tail -1

   # WRONG: This gets line 9, not line 10
   head -10 file.txt | tail +10
   ```

   **Fix**: Remember `head -N` gets first N lines, `tail -1` gets the last of those. For line 10: `head -10 | tail -1`.

2. **Not handling files with fewer than 10 lines**

   ```bash
   # Problem: If file has 5 lines, this outputs line 5 (wrong!)
   sed -n '10p' file.txt  # Outputs nothing (correct)
   head -10 file.txt | tail -1  # Outputs line 5 (wrong in some implementations!)
   ```

   **Fix**: Use `sed` or `awk` which handle this correctly, or add a line count check.

3. **Using inefficient multi-command pipelines**

   ```bash
   # Inefficient: Reads file twice
   line10=$(cat file.txt | sed -n '10p')
   echo $line10

   # Better: Process file once
   sed -n '10p' file.txt
   ```

   **Fix**: Use single commands when possible to avoid unnecessary I/O.

4. **Forgetting that line numbers start at 1**
   ```bash
   # WRONG: This would print line 9 (if it worked this way)
   awk 'NR==9' file.txt  # Actually, NR==9 is line 9, not line 10
   ```
   **Fix**: Remember shell utilities use 1-based indexing for line numbers.

## When You'll See This Pattern

This problem teaches **stream processing** and **line-based file operations**, which appear in many real-world scenarios:

1. **Log file analysis** (LeetCode 192. Word Frequency)
   - Both problems require processing text files line by line
   - Use similar tools (`awk`, `sed`, `grep`) for extraction and counting
   - Emphasize efficient streaming over loading entire files

2. **Data extraction from large files** (LeetCode 195. Tenth Line - this problem!)
   - The exact same pattern: extract specific lines or patterns
   - Teaches how to handle files too large for memory

3. **Text processing pipelines** (LeetCode 193. Valid Phone Numbers)
   - Uses `grep` with regular expressions to filter lines
   - Similar streaming approach with pattern matching
   - Builds on the same shell command knowledge

The core technique is **processing data streams without loading everything into memory**, which is essential for working with large datasets, log files, or any text processing task in shell environments.

## Key Takeaways

1. **Stream processing is essential for large files**: Always consider whether your solution needs to load entire files into memory or can process them line by line. Shell utilities like `sed`, `awk`, `head`, and `tail` are optimized for streaming.

2. **Know your shell utilities**: Understanding when to use `sed` (simple line operations), `awk` (more complex processing), or `head/tail` (position-based extraction) will save time in both interviews and real work.

3. **Edge cases matter**: Always consider what happens with empty files, files with fewer lines than needed, and extremely large files. The best solutions handle all cases gracefully.

4. **1-based indexing is common**: In shell text processing, line numbers typically start at 1, not 0. This differs from many programming languages and is a common source of errors.

[Practice this problem on CodeJeet](/problem/tenth-line)
