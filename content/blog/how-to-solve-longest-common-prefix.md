---
title: "How to Solve Longest Common Prefix — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Longest Common Prefix. Easy difficulty, 47.1% acceptance rate. Topics: Array, String, Trie."
date: "2026-02-15"
category: "dsa-patterns"
tags: ["longest-common-prefix", "array", "string", "trie", "easy"]
---

# How to Solve Longest Common Prefix

Finding the longest common prefix among an array of strings seems straightforward at first glance, but it has subtle edge cases that trip up many candidates. The challenge lies in efficiently comparing characters across all strings while handling varying lengths and empty inputs. This problem is interesting because it can be solved with multiple approaches (horizontal scanning, vertical scanning, divide and conquer, and even a trie), but the optimal solution is elegant in its simplicity.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider the input: `["flower", "flow", "flight"]`.

**Step 1:** We need to find the longest prefix common to all strings. A prefix must start from the beginning of each string.

**Step 2:** Look at the first character of each string:

- `"flower"` → `'f'`
- `"flow"` → `'f'`
- `"flight"` → `'f'`

All three match, so `"f"` is part of our common prefix.

**Step 3:** Move to the second character:

- `"flower"` → `'l'`
- `"flow"` → `'l'`
- `"flight"` → `'l'`

All match again, so our prefix becomes `"fl"`.

**Step 4:** Third character:

- `"flower"` → `'o'`
- `"flow"` → `'o'`
- `"flight"` → `'i'`

Here we have a mismatch! `'o'` ≠ `'i'`. This means we've found the end of our common prefix.

**Result:** The longest common prefix is `"fl"`.

This step-by-step comparison forms the basis of our optimal solution: we compare characters at the same index across all strings until we find a mismatch or reach the end of the shortest string.

## Brute Force Approach

A naive approach would be to compare every possible prefix of the first string with all other strings. For each prefix length (from 1 to length of first string), check if that prefix exists at the start of every other string. While this works, it's inefficient because:

1. We might do unnecessary comparisons for prefixes that are longer than the shortest string
2. We're repeatedly checking the same characters in longer strings

The brute force would have O(S·n) time complexity where S is the sum of all string lengths and n is the number of strings. While this might be acceptable for small inputs, we can do better with a more targeted approach.

## Optimal Solution

The most efficient and intuitive solution uses **vertical scanning**. We compare characters at the same index across all strings, moving from left to right. We stop when:

1. We find a character mismatch
2. We reach the end of the shortest string
3. We've processed all strings

This approach minimizes comparisons and handles edge cases gracefully.

<div class="code-group">

```python
# Time: O(S) where S is the sum of all characters in all strings
# Space: O(1) extra space (excluding output)
def longestCommonPrefix(strs):
    # Edge case: empty array
    if not strs:
        return ""

    # Use the first string as reference for comparison
    # We'll compare each character of this string with corresponding
    # characters in all other strings
    for i in range(len(strs[0])):
        # Get the character at position i from the first string
        char = strs[0][i]

        # Compare this character with the character at the same position
        # in every other string
        for j in range(1, len(strs)):
            # Two stopping conditions:
            # 1. Current string is shorter than our index i
            # 2. Characters don't match
            if i >= len(strs[j]) or strs[j][i] != char:
                # Return the prefix up to (but not including) the current position
                return strs[0][:i]

    # If we complete the loop without returning, the entire first string
    # is the common prefix (this happens when first string is shortest)
    return strs[0]
```

```javascript
// Time: O(S) where S is the sum of all characters in all strings
// Space: O(1) extra space (excluding output)
function longestCommonPrefix(strs) {
  // Edge case: empty array
  if (!strs || strs.length === 0) {
    return "";
  }

  // Use the first string as our reference for comparison
  // We'll examine each character position from left to right
  for (let i = 0; i < strs[0].length; i++) {
    // Get the character at current position from first string
    const char = strs[0][i];

    // Compare this character with all other strings
    for (let j = 1; j < strs.length; j++) {
      // Stop if:
      // 1. We've reached the end of current string (i is out of bounds)
      // 2. Characters don't match
      if (i >= strs[j].length || strs[j][i] !== char) {
        // Return the prefix up to current position (exclusive)
        return strs[0].substring(0, i);
      }
    }
  }

  // If we never hit a mismatch, the entire first string is the common prefix
  return strs[0];
}
```

```java
// Time: O(S) where S is the sum of all characters in all strings
// Space: O(1) extra space (excluding output)
public String longestCommonPrefix(String[] strs) {
    // Edge case: empty array
    if (strs == null || strs.length == 0) {
        return "";
    }

    // Use first string as reference for comparison
    // Iterate through each character position
    for (int i = 0; i < strs[0].length(); i++) {
        // Get current character from first string
        char c = strs[0].charAt(i);

        // Compare with all other strings
        for (int j = 1; j < strs.length; j++) {
            // Stop conditions:
            // 1. Current string is shorter than index i
            // 2. Characters don't match
            if (i >= strs[j].length() || strs[j].charAt(i) != c) {
                // Return substring from beginning up to position i
                return strs[0].substring(0, i);
            }
        }
    }

    // If we complete the loop, entire first string is common prefix
    return strs[0];
}
```

</div>

## Complexity Analysis

**Time Complexity: O(S)** where S is the sum of all characters in all strings. In the worst case, we compare every character of every string once. However, we typically stop early when we find a mismatch or reach the end of the shortest string, so average case is often better.

**Space Complexity: O(1)** extra space. We only use a few variables for indices and character comparisons. The output string uses O(m) space where m is the length of the common prefix, but this is considered output space, not auxiliary space.

## Common Mistakes

1. **Not handling empty array input**: Many candidates forget to check if `strs` is empty or `null`. Always validate your input first.

2. **Assuming all strings have equal length**: This leads to index out of bounds errors. Always check `i >= len(strs[j])` before accessing `strs[j][i]`.

3. **Using the wrong comparison order**: Some candidates compare strings pairwise instead of comparing all strings at the same position. The vertical scanning approach is more efficient and clearer.

4. **Returning the wrong substring**: When you find a mismatch, remember to return the prefix up to but not including the current position. Using `strs[0][:i]` (Python) or `strs[0].substring(0, i)` (Java/JavaScript) correctly excludes the mismatched character.

5. **Forgetting the case where first string is the shortest**: If the first string is the shortest and all its characters match with prefixes of longer strings, we need to return the entire first string. That's why we have the final return statement outside the loops.

## When You'll See This Pattern

The vertical scanning pattern appears in problems where you need to compare elements at the same position across multiple sequences:

1. **Merge k Sorted Lists (Hard)**: While merging, you compare the current elements of all lists to find the smallest one.

2. **Valid Sudoku (Medium)**: You check rows, columns, and sub-boxes by examining elements at specific positions across the board.

3. **Trapping Rain Water (Hard)**: The two-pointer approach involves comparing heights at symmetric positions from both ends.

The key insight is recognizing when you can process data "column-wise" (across multiple items) instead of "row-wise" (within each item).

## Key Takeaways

1. **Vertical scanning is often optimal for prefix/suffix problems**: When comparing the beginning or end of multiple strings, process them character by character across all strings rather than string by string.

2. **Use the shortest string as a natural boundary**: You can't have a common prefix longer than the shortest string, so your loop should be bounded by its length.

3. **Early termination improves efficiency**: Stop comparing as soon as you find a mismatch rather than continuing unnecessary comparisons.

4. **Edge cases matter**: Empty arrays, single-element arrays, and strings of varying lengths are common test cases that separate working from broken solutions.

Related problems: [Smallest Missing Integer Greater Than Sequential Prefix Sum](/problem/smallest-missing-integer-greater-than-sequential-prefix-sum), [Find the Length of the Longest Common Prefix](/problem/find-the-length-of-the-longest-common-prefix), [Longest Common Suffix Queries](/problem/longest-common-suffix-queries)
