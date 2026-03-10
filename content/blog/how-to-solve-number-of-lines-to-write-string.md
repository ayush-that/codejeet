---
title: "How to Solve Number of Lines To Write String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Lines To Write String. Easy difficulty, 72.1% acceptance rate. Topics: Array, String."
date: "2027-04-03"
category: "dsa-patterns"
tags: ["number-of-lines-to-write-string", "array", "string", "easy"]
---

# How to Solve Number of Lines To Write String

You're given a string and the pixel width of each lowercase letter. Your task is to calculate how many lines the string will occupy when written with a maximum line width of 100 pixels, and how many pixels are used on the last line. The challenge lies in tracking both the current line's pixel count and the total lines used while respecting the 100-pixel limit per line.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
widths = [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10]
s = "abcdefghijklmnopqrstuvwxyz"
```

Each letter is 10 pixels wide, and the line limit is 100 pixels.

**Step-by-step:**

1. Start with `lines = 1` (we need at least one line) and `current_width = 0`
2. Process 'a' (10px): `current_width = 10` (≤ 100, stays on line 1)
3. Process 'b' (10px): `current_width = 20` (≤ 100, stays on line 1)
4. Continue through 'j' (10px each): After 'j', `current_width = 100` (exactly at limit)
5. Process 'k' (10px): Would make `current_width = 110` (> 100), so:
   - Increment `lines` to 2
   - Reset `current_width = 10` (just 'k' on new line)
6. Continue through 't' (10px each): After 't', `current_width = 100` on line 2
7. Process 'u' (10px): Would make `current_width = 110`, so:
   - Increment `lines` to 3
   - Reset `current_width = 10`
8. Continue through 'z': Final state: `lines = 3`, `current_width = 60`

**Output:** `[3, 60]`

## Brute Force Approach

For this problem, there's essentially only one reasonable approach: process each character sequentially while tracking the current line's pixel count. A truly "brute force" alternative doesn't exist since we must examine every character to determine line breaks.

However, a naive implementation might try to:

1. Pre-calculate total pixels needed for the entire string
2. Divide by 100 to estimate lines
3. Use modulo to find last line width

**Why this fails:** This approach doesn't account for how words/characters can't be split mid-character. If a character's width would exceed 100 pixels, it must move to the next line entirely. Simple division doesn't capture this constraint.

For example, with `s = "a"` and `widths[0] = 100`, the naive division approach would work. But with `s = "ab"` where 'a' = 60px and 'b' = 50px:

- Correct: Line 1: 'a' (60px), Line 2: 'b' (50px) → `[2, 50]`
- Naive division: Total = 110px, 110/100 = 1.1 → 2 lines, 110%100 = 10px → `[2, 10]` (wrong!)

The character 'b' can't be partially placed on line 1, so the last line should have 50px, not 10px.

## Optimal Solution

We process the string character by character, maintaining:

- `lines`: Number of lines used so far (starts at 1)
- `current_width`: Pixels used on the current line

For each character:

1. Get its pixel width using `widths[ord(char) - ord('a')]`
2. If adding it to `current_width` would exceed 100, start a new line
3. Otherwise, add it to the current line

<div class="code-group">

```python
# Time: O(n) where n = len(s) | Space: O(1)
def numberOfLines(widths, s):
    """
    Calculate how many lines are needed to write string s with given character widths.

    Args:
        widths: List of 26 integers representing pixel widths for 'a' to 'z'
        s: String to write

    Returns:
        List [total_lines, pixels_on_last_line]
    """
    # Initialize: we always have at least 1 line, current line starts empty
    lines = 1
    current_width = 0

    # Process each character in the string
    for char in s:
        # Get the pixel width of current character
        # 'a' -> index 0, 'b' -> index 1, etc.
        char_width = widths[ord(char) - ord('a')]

        # Check if this character fits on current line
        if current_width + char_width > 100:
            # Character doesn't fit, start new line
            lines += 1
            # Reset current_width to just this character's width
            # (it's the first character on the new line)
            current_width = char_width
        else:
            # Character fits, add to current line
            current_width += char_width

    # Return total lines and pixels used on last line
    return [lines, current_width]
```

```javascript
// Time: O(n) where n = s.length | Space: O(1)
function numberOfLines(widths, s) {
  /**
   * Calculate how many lines are needed to write string s with given character widths.
   *
   * @param {number[]} widths - Array of 26 integers for pixel widths of 'a' to 'z'
   * @param {string} s - String to write
   * @return {number[]} - [total_lines, pixels_on_last_line]
   */

  // Initialize: we always have at least 1 line, current line starts empty
  let lines = 1;
  let currentWidth = 0;

  // Process each character in the string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    // Get the pixel width of current character
    // 'a' -> index 0, 'b' -> index 1, etc.
    const charWidth = widths[char.charCodeAt(0) - "a".charCodeAt(0)];

    // Check if this character fits on current line
    if (currentWidth + charWidth > 100) {
      // Character doesn't fit, start new line
      lines++;
      // Reset currentWidth to just this character's width
      // (it's the first character on the new line)
      currentWidth = charWidth;
    } else {
      // Character fits, add to current line
      currentWidth += charWidth;
    }
  }

  // Return total lines and pixels used on last line
  return [lines, currentWidth];
}
```

```java
// Time: O(n) where n = s.length() | Space: O(1)
class Solution {
    public int[] numberOfLines(int[] widths, String s) {
        /**
         * Calculate how many lines are needed to write string s with given character widths.
         *
         * @param widths - Array of 26 integers for pixel widths of 'a' to 'z'
         * @param s - String to write
         * @return int[] - {total_lines, pixels_on_last_line}
         */

        // Initialize: we always have at least 1 line, current line starts empty
        int lines = 1;
        int currentWidth = 0;

        // Process each character in the string
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            // Get the pixel width of current character
            // 'a' -> index 0, 'b' -> index 1, etc.
            int charWidth = widths[c - 'a'];

            // Check if this character fits on current line
            if (currentWidth + charWidth > 100) {
                // Character doesn't fit, start new line
                lines++;
                // Reset currentWidth to just this character's width
                // (it's the first character on the new line)
                currentWidth = charWidth;
            } else {
                // Character fits, add to current line
                currentWidth += charWidth;
            }
        }

        // Return total lines and pixels used on last line
        return new int[]{lines, currentWidth};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of string `s`

- We process each character exactly once
- For each character, we perform O(1) operations: index calculation, addition, comparison

**Space Complexity:** O(1)

- We only use a fixed number of variables: `lines`, `current_width`, loop counter
- No additional data structures that scale with input size
- The output array (size 2) is not counted toward space complexity in standard analysis

## Common Mistakes

1. **Starting with `lines = 0` instead of `lines = 1`**
   - If the string is empty, we should return `[0, 0]`, but the problem guarantees `s` has at least 1 character
   - With at least 1 character, we always need at least 1 line
   - **Fix:** Initialize `lines = 1`

2. **Incorrect index calculation for character widths**
   - Using `widths[ord(char)]` instead of `widths[ord(char) - ord('a')]`
   - This tries to access index 97+ for lowercase letters, causing IndexError
   - **Fix:** Subtract `ord('a')` to map 'a'→0, 'b'→1, etc.

3. **Using `>= 100` instead of `> 100` for line break condition**
   - If current line has exactly 100 pixels, the next character must go to a new line
   - But if `current_width + char_width == 100`, the character fits perfectly
   - **Fix:** Use `> 100` not `>= 100`

4. **Forgetting to reset `current_width` when starting a new line**
   - Some candidates add to `current_width` then check if it exceeds 100
   - This leaves overflow pixels on the previous line
   - **Fix:** When starting new line, set `current_width = char_width` (not 0)

## When You'll See This Pattern

This problem uses **sequential processing with accumulation and reset** - a pattern common in:

1. **Text Justification (LeetCode 68)** - Similar line-wrapping logic but with spaces between words
2. **Partition Labels (LeetCode 763)** - Accumulating until a condition is met, then resetting
3. **Gas Station (LeetCode 134)** - Tracking cumulative sum that resets under certain conditions
4. **Maximum Subarray (LeetCode 53)** - Kadane's algorithm uses similar reset logic when sum becomes negative

The core pattern: Process elements in order, maintain a running total, reset when a constraint is violated, and count how many resets occurred.

## Key Takeaways

1. **When dealing with line/wrapping problems**, process elements sequentially and track both the current container's usage and total containers used. Don't try to calculate everything upfront.

2. **The reset condition is critical** - here it's `> 100` not `>= 100`. Always test edge cases where the sum equals exactly the limit.

3. **Mapping characters to indices** using `ord(char) - ord('a')` is a standard technique for problems involving lowercase English letters. Remember that `ord('a')` is 97 in ASCII.

[Practice this problem on CodeJeet](/problem/number-of-lines-to-write-string)
