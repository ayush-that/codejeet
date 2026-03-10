---
title: "How to Solve Remove Comments — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove Comments. Medium difficulty, 40.0% acceptance rate. Topics: Array, String."
date: "2027-10-03"
category: "dsa-patterns"
tags: ["remove-comments", "array", "string", "medium"]
---

# How to Solve Remove Comments

You're given a C++ program represented as an array of strings, where each string is a line of source code. Your task is to remove all comments while preserving the original code structure. The challenge lies in correctly handling two types of comments: line comments (`//`) that comment out everything until the end of the line, and block comments (`/* */`) that can span multiple lines. What makes this problem interesting is that you need to track whether you're inside a block comment across line boundaries while also handling cases where comment markers appear inside strings or character literals (which we don't need to worry about per the problem constraints).

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
source = [
    "int main() {",
    "  // This is a comment",
    "  int a = 1; /* inline block */",
    "  /* Multi-line",
    "     comment */ int b = 2;",
    "  return 0;",
    "}"
]
```

**Step-by-step processing:**

1. **Line 1:** `"int main() {"` - No comments, keep as is.
2. **Line 2:** `"  // This is a comment"` - Line comment, remove everything after `//`, resulting in empty string.
3. **Line 3:** `"  int a = 1; /* inline block */"` - Mixed content. We keep `"  int a = 1; "` then encounter `/*`, so we enter block comment mode, skip until we find `*/`, then continue (nothing after in this line).
4. **Line 4:** `"  /* Multi-line"` - We're already in block comment mode from line 3, so skip this entire line.
5. **Line 5:** `"     comment */ int b = 2;"` - Still in block comment mode until we find `*/`, then we keep `" int b = 2;"`.
6. **Lines 6-7:** No comments, keep as is.

**Final output:**

```
[
    "int main() {",
    "",
    "  int a = 1; ",
    " int b = 2;",
    "  return 0;",
    "}"
]
```

Notice how we need to track whether we're inside a block comment across line boundaries, and how we might have partial lines before/after comment markers.

## Brute Force Approach

A naive approach might try to process each line independently, but this fails because block comments span multiple lines. Another brute force idea would be to concatenate all lines into one big string and process it character by character, but we need to maintain the original line structure in the output.

What a candidate might initially try:

1. For each line, check if it contains `//` or `/*`
2. If `//` is found, remove everything after it
3. If `/*` is found, remove everything from `/*` to `*/` (assuming it's on the same line)
4. Add the processed line to the result

**Why this fails:**

- Block comments can span multiple lines, so we can't process lines independently
- We need to track whether we're inside a block comment when moving to the next line
- We might have code both before and after comment markers on the same line

The brute force approach that actually works would be to process the entire source as one string, track block comment state, and then split back into lines. But this gets messy with line boundaries and empty lines.

## Optimized Approach

The key insight is that we need to process the source **character by character** while maintaining two crucial pieces of state:

1. Whether we're currently inside a block comment
2. The current line we're building

We process the source line by line, but within each line, we examine characters sequentially. When we encounter `//` and we're not in a block comment, we can ignore the rest of the line. When we encounter `/*` and we're not in a block comment, we enter block comment mode and skip characters until we find `*/`. The tricky part is that `//` and `/*` have no special meaning when we're already inside a block comment.

**Step-by-step reasoning:**

1. Initialize `in_block = False` to track if we're inside a block comment
2. Initialize `new_line = []` to build the current output line
3. For each line in source:
   - Initialize `i = 0` to track our position in the line
   - While `i < len(line)`:
     - If we're in a block comment:
       - Look for `*/` starting at position `i`
       - If found, set `in_block = False` and move `i` past the `*/`
       - Otherwise, break out of the loop (rest of line is in comment)
     - Else (not in block comment):
       - Check if we have `//` starting at `i` → if yes, break (ignore rest of line)
       - Check if we have `/*` starting at `i` → if yes, set `in_block = True`, move `i` past `/*`
       - Otherwise, add `line[i]` to `new_line` and increment `i`
   - If we're not in a block comment and `new_line` has content, add it to result
   - Reset `new_line` for next line

This approach correctly handles all cases while preserving line structure.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is total characters in source
# Space: O(n) for the output
def removeComments(source):
    """
    Remove all comments from C++ source code.

    Args:
        source: List of strings representing source code lines

    Returns:
        List of strings with comments removed
    """
    result = []  # Stores final lines without comments
    in_block = False  # Tracks if we're inside a block comment /* */
    new_line = []  # Builds current line character by character

    for line in source:
        i = 0  # Index to traverse current line
        n = len(line)

        while i < n:
            if in_block:
                # We're inside a block comment, look for closing */
                if i + 1 < n and line[i] == '*' and line[i + 1] == '/':
                    in_block = False  # Exit block comment
                    i += 2  # Skip past the */
                else:
                    i += 1  # Skip this character (it's commented out)
            else:
                # Not in block comment, check for comment starters
                if i + 1 < n and line[i] == '/' and line[i + 1] == '/':
                    # Line comment: ignore rest of the line
                    break
                elif i + 1 < n and line[i] == '/' and line[i + 1] == '*':
                    # Start of block comment
                    in_block = True
                    i += 2  # Skip past the /*
                else:
                    # Regular character, add to current line
                    new_line.append(line[i])
                    i += 1

        # After processing the line
        if not in_block and new_line:
            # Only add non-empty lines when not in block comment
            result.append(''.join(new_line))
            new_line = []  # Reset for next line
        elif not in_block:
            # We're not in block comment but new_line is empty
            # This happens when line had only comments
            # We don't add empty string unless it's meaningful
            pass

    return result
```

```javascript
// Time: O(n) where n is total characters in source
// Space: O(n) for the output
function removeComments(source) {
  /**
   * Remove all comments from C++ source code.
   *
   * @param {string[]} source - Array of source code lines
   * @return {string[]} Array of lines with comments removed
   */
  const result = []; // Stores final lines without comments
  let inBlock = false; // Tracks if we're inside a block comment /* */
  let newLine = []; // Builds current line character by character

  for (const line of source) {
    let i = 0; // Index to traverse current line
    const n = line.length;

    while (i < n) {
      if (inBlock) {
        // We're inside a block comment, look for closing */
        if (i + 1 < n && line[i] === "*" && line[i + 1] === "/") {
          inBlock = false; // Exit block comment
          i += 2; // Skip past the */
        } else {
          i += 1; // Skip this character (it's commented out)
        }
      } else {
        // Not in block comment, check for comment starters
        if (i + 1 < n && line[i] === "/" && line[i + 1] === "/") {
          // Line comment: ignore rest of the line
          break;
        } else if (i + 1 < n && line[i] === "/" && line[i + 1] === "*") {
          // Start of block comment
          inBlock = true;
          i += 2; // Skip past the /*
        } else {
          // Regular character, add to current line
          newLine.push(line[i]);
          i += 1;
        }
      }
    }

    // After processing the line
    if (!inBlock && newLine.length > 0) {
      // Only add non-empty lines when not in block comment
      result.push(newLine.join(""));
      newLine = []; // Reset for next line
    }
    // Note: We don't push empty strings when line had only comments
  }

  return result;
}
```

```java
// Time: O(n) where n is total characters in source
// Space: O(n) for the output
import java.util.*;

class Solution {
    public List<String> removeComments(String[] source) {
        /**
         * Remove all comments from C++ source code.
         *
         * @param source Array of source code lines
         * @return List of strings with comments removed
         */
        List<String> result = new ArrayList<>();  // Stores final lines without comments
        boolean inBlock = false;  // Tracks if we're inside a block comment /* */
        StringBuilder newLine = new StringBuilder();  // Builds current line character by character

        for (String line : source) {
            int i = 0;  // Index to traverse current line
            int n = line.length();

            while (i < n) {
                if (inBlock) {
                    // We're inside a block comment, look for closing */
                    if (i + 1 < n && line.charAt(i) == '*' && line.charAt(i + 1) == '/') {
                        inBlock = false;  // Exit block comment
                        i += 2;  // Skip past the */
                    } else {
                        i += 1;  // Skip this character (it's commented out)
                    }
                } else {
                    // Not in block comment, check for comment starters
                    if (i + 1 < n && line.charAt(i) == '/' && line.charAt(i + 1) == '/') {
                        // Line comment: ignore rest of the line
                        break;
                    } else if (i + 1 < n && line.charAt(i) == '/' && line.charAt(i + 1) == '*') {
                        // Start of block comment
                        inBlock = true;
                        i += 2;  // Skip past the /*
                    } else {
                        // Regular character, add to current line
                        newLine.append(line.charAt(i));
                        i += 1;
                    }
                }
            }

            // After processing the line
            if (!inBlock && newLine.length() > 0) {
                // Only add non-empty lines when not in block comment
                result.add(newLine.toString());
                newLine.setLength(0);  // Reset for next line
            }
            // Note: We don't add empty strings when line had only comments
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the total number of characters in all source code lines. We process each character exactly once (or skip groups of characters when in comments).

**Space Complexity:** O(n) for the output. In the worst case where there are no comments, we store all characters from the input. The auxiliary space (excluding output) is O(m) where m is the length of the longest line, for building the current line.

## Common Mistakes

1. **Not tracking block comment state across lines:** The most common error is processing each line independently. Remember that `/* */` can span multiple lines, so you need a boolean flag that persists between lines.

2. **Incorrect order of checking comment markers:** Always check for `//` before `/*` when not in a block comment. If you check for `/*` first, you might incorrectly enter block comment mode when you see `//`.

3. **Forgetting to handle empty lines properly:** When a line contains only comments, it should result in an empty string only if there was some code before the comment on that line. If the entire line is a comment, we shouldn't add an empty string to the output (unless it's a line with only `//` and we had code before it on the same line).

4. **Off-by-one errors with string indices:** When checking for two-character sequences like `//` or `/*`, always ensure `i + 1 < n` before accessing `line[i + 1]`. Also remember to increment `i` by 2 when skipping these markers.

## When You'll See This Pattern

This problem uses a **state machine** or **parser** pattern where you process input sequentially while maintaining state. Similar problems include:

1. **Mini Parser (LeetCode 385):** Parsing nested structures requires tracking depth/state similar to how we track block comment state.

2. **Ternary Expression Parser (LeetCode 439):** Parsing conditional expressions with `?` and `:` requires similar state management.

3. **Valid Parentheses (LeetCode 20):** While simpler, it also uses state (stack depth) to track matching pairs, similar to how we track block comment boundaries.

4. **Decode String (LeetCode 394):** Parsing nested encoded strings requires maintaining context about repetition counts and nested levels.

## Key Takeaways

1. **State machines are your friend for parsing problems:** When you need to process text with different "modes" (like inside/outside comments), maintain boolean flags or a state variable to track your current context.

2. **Process sequentially, think globally:** Even though input comes as separate lines, you often need to process it as a continuous stream when dealing with multi-line constructs.

3. **Order matters in conditionals:** When checking for multiple patterns that might overlap (like `//` and `/*`), think carefully about which to check first based on precedence rules.

Related problems: [Mini Parser](/problem/mini-parser), [Ternary Expression Parser](/problem/ternary-expression-parser)
