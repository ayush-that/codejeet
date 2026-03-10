---
title: "How to Solve Delete Columns to Make Sorted III — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Delete Columns to Make Sorted III. Hard difficulty, 72.7% acceptance rate. Topics: Array, String, Dynamic Programming."
date: "2028-01-05"
category: "dsa-patterns"
tags: ["delete-columns-to-make-sorted-iii", "array", "string", "dynamic-programming", "hard"]
---

# How to Solve Delete Columns to Make Sorted III

You're given an array of equal-length strings. You can delete columns (character positions), and after deletion, you want the remaining strings to be in **lexicographic order** (non-decreasing from top to bottom). The goal is to **minimize the number of columns deleted**, which is equivalent to **maximizing the number of columns kept**.

What makes this problem tricky: It's not about checking if columns are sorted individually (like in Delete Columns to Make Sorted I). Instead, we need to find the **longest sequence of columns** where, when concatenated in order, the strings remain sorted. This is essentially finding the **longest increasing subsequence** across columns.

## Visual Walkthrough

Let's trace through `strs = ["babca","bbazb"]`:

```
Columns:  0 1 2 3 4
String 0: b a b c a
String 1: b b a z b
```

We want to keep as many columns as possible while maintaining lex order. Let's think column by column:

- If we keep only column 0: `["b","b"]` → sorted ✓
- If we keep columns 0 and 1: Compare `"ba"` vs `"bb"` → `"ba"` < `"bb"` ✓
- Columns 0, 1, 2: `"bab"` vs `"bba"` → `"bab"` < `"bba"` ✓
- Columns 0, 1, 2, 3: `"babс"` vs `"bbaz"` → `"babс"` < `"bbaz"` ✓
- Columns 0, 1, 2, 3, 4: `"babca"` vs `"bbazb"` → `"babca"` < `"bbazb"` ✓

Wait, all columns seem sorted! But look carefully at column 2: `"b"` vs `"a"` in rows 0 and 1. Column 2 by itself is NOT sorted (b > a). However, when combined with previous columns, the strings remain sorted because `"bab"` < `"bba"`.

The key insight: **We can keep column j after column i if for every row, `strs[row][i] <= strs[row][j]`**. This is the condition for the concatenated strings to remain sorted.

Let's find the maximum columns we can keep:

- Column 0: can always start a sequence (length 1)
- Column 1: Check if it can follow column 0: Compare `"a"` ≤ `"b"`? Yes ✓ So length 2
- Column 2: Can it follow column 0? `"b"` ≤ `"a"`? No ✗  
  Can it follow column 1? `"b"` ≤ `"a"`? No ✗ So length 1
- Column 3: Follow column 0? `"c"` ≤ `"z"`? Yes ✓ (length 2)  
  Follow column 1? `"c"` ≤ `"z"`? Yes ✓ (length 3)  
  Follow column 2? `"c"` ≤ `"z"`? Yes ✓ (length 2)
- Column 4: Follow column 0? `"a"` ≤ `"b"`? Yes ✓ (length 2)  
  Follow column 1? `"a"` ≤ `"b"`? Yes ✓ (length 3)  
  Follow column 2? `"a"` ≤ `"b"`? Yes ✓ (length 2)  
  Follow column 3? `"a"` ≤ `"b"`? Yes ✓ (length 4)

Maximum length found: 4 columns. So we delete 5 - 4 = 1 column.

## Brute Force Approach

A naive approach would try all subsets of columns (2^k subsets where k = string length). For each subset:

1. Check if the strings are sorted when only those columns are kept
2. Track the largest subset size

This is O(2^k _ n _ k) time — impossibly slow for k up to 100.

What a candidate might try: Greedily keep columns that are "mostly sorted" or check columns individually. But this fails because:

- A column might not be sorted individually but can be kept if combined with previous columns
- The order matters: we're looking for a sequence, not just a set

The brute force teaches us: We need to consider **sequences** of columns, and whether column j can follow column i depends on comparing all characters in those two columns across all rows.

## Optimized Approach

The key insight: This is exactly the **Longest Increasing Subsequence (LIS)** problem, but in 2D!

In standard LIS (like [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)), we find the longest subsequence where each element is greater than the previous.

Here, "element" = column, and "greater than" means: for all rows, character in column i ≤ character in column j.

So we can adapt the LIS DP solution:

- `dp[j]` = length of longest valid column sequence ending at column j
- For each column j, check all previous columns i < j
- If column j can follow column i (all rows satisfy `strs[row][i] <= strs[row][j]`), then `dp[j] = max(dp[j], dp[i] + 1)`
- Answer = `k - max(dp)` (columns to delete = total columns - longest sequence we can keep)

This gives us O(k² \* n) time, which is acceptable for constraints (n ≤ 100, k ≤ 100).

## Optimal Solution

We implement the LIS-inspired DP approach. The check `canFollow(i, j)` compares all characters in column i vs column j across all rows.

<div class="code-group">

```python
# Time: O(k^2 * n) where k = len(strs[0]), n = len(strs)
# Space: O(k) for DP array
def minDeletionSize(strs):
    """
    Returns minimum columns to delete so remaining strings are sorted.

    Approach: Find longest sequence of columns where each column is
    "less than or equal to" the next column in all rows.
    This is a 2D version of Longest Increasing Subsequence.
    """
    n = len(strs)  # Number of strings
    k = len(strs[0])  # Length of each string (number of columns)

    # dp[j] = length of longest valid column sequence ending at column j
    dp = [1] * k  # Each column can be a sequence of length 1

    # For each column j, check if it can extend sequences ending at previous columns
    for j in range(k):
        # Check all previous columns i
        for i in range(j):
            # Check if column j can follow column i
            # For ALL rows, character in column i must be <= character in column j
            valid = True
            for row in range(n):
                if strs[row][i] > strs[row][j]:
                    valid = False
                    break

            # If valid, update dp[j] to consider extending sequence from i
            if valid:
                dp[j] = max(dp[j], dp[i] + 1)

    # Longest sequence we can keep
    longest = max(dp)
    # Columns to delete = total columns - columns we keep
    return k - longest
```

```javascript
// Time: O(k^2 * n) where k = strs[0].length, n = strs.length
// Space: O(k) for DP array
function minDeletionSize(strs) {
  /**
   * Returns minimum columns to delete so remaining strings are sorted.
   *
   * Approach: Find longest sequence of columns where each column is
   * "less than or equal to" the next column in all rows.
   * This is a 2D version of Longest Increasing Subsequence.
   */
  const n = strs.length; // Number of strings
  const k = strs[0].length; // Length of each string (number of columns)

  // dp[j] = length of longest valid column sequence ending at column j
  const dp = new Array(k).fill(1); // Each column can be a sequence of length 1

  // For each column j, check if it can extend sequences ending at previous columns
  for (let j = 0; j < k; j++) {
    // Check all previous columns i
    for (let i = 0; i < j; i++) {
      // Check if column j can follow column i
      // For ALL rows, character in column i must be <= character in column j
      let valid = true;
      for (let row = 0; row < n; row++) {
        if (strs[row].charCodeAt(i) > strs[row].charCodeAt(j)) {
          valid = false;
          break;
        }
      }

      // If valid, update dp[j] to consider extending sequence from i
      if (valid) {
        dp[j] = Math.max(dp[j], dp[i] + 1);
      }
    }
  }

  // Longest sequence we can keep
  const longest = Math.max(...dp);
  // Columns to delete = total columns - columns we keep
  return k - longest;
}
```

```java
// Time: O(k^2 * n) where k = strs[0].length(), n = strs.length
// Space: O(k) for DP array
class Solution {
    public int minDeletionSize(String[] strs) {
        /**
         * Returns minimum columns to delete so remaining strings are sorted.
         *
         * Approach: Find longest sequence of columns where each column is
         * "less than or equal to" the next column in all rows.
         * This is a 2D version of Longest Increasing Subsequence.
         */
        int n = strs.length;  // Number of strings
        int k = strs[0].length();  // Length of each string (number of columns)

        // dp[j] = length of longest valid column sequence ending at column j
        int[] dp = new int[k];
        // Initialize: each column can be a sequence of length 1
        for (int j = 0; j < k; j++) {
            dp[j] = 1;
        }

        // For each column j, check if it can extend sequences ending at previous columns
        for (int j = 0; j < k; j++) {
            // Check all previous columns i
            for (int i = 0; i < j; i++) {
                // Check if column j can follow column i
                // For ALL rows, character in column i must be <= character in column j
                boolean valid = true;
                for (int row = 0; row < n; row++) {
                    if (strs[row].charAt(i) > strs[row].charAt(j)) {
                        valid = false;
                        break;
                    }
                }

                // If valid, update dp[j] to consider extending sequence from i
                if (valid) {
                    dp[j] = Math.max(dp[j], dp[i] + 1);
                }
            }
        }

        // Longest sequence we can keep
        int longest = 0;
        for (int length : dp) {
            longest = Math.max(longest, length);
        }

        // Columns to delete = total columns - columns we keep
        return k - longest;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(k² \* n)

- Outer loop: O(k) for each column j
- Inner loop: O(k) for each previous column i
- Innermost check: O(n) to compare all rows for columns i and j
- Total: O(k _ k _ n) = O(k² \* n)

**Space Complexity:** O(k)

- We only store the DP array of length k
- No additional data structures needed

For constraints (n ≤ 100, k ≤ 100), this is 100³ = 1,000,000 operations, which is efficient.

## Common Mistakes

1. **Checking columns individually instead of sequences**: Candidates might delete all columns that aren't sorted individually. Counterexample: `["ba","ab"]` - neither column is sorted individually, but keeping both gives `["ba","ab"]` which is sorted (`"ba"` < `"ab"`? Actually no, `"ba"` > `"ab"`, so this example needs at least one deletion. But the point stands: individual column sort isn't the right criterion).

2. **Forgetting to check ALL rows in the comparison**: When checking if column j can follow column i, you must verify `strs[row][i] <= strs[row][j]` for EVERY row. Missing even one row breaks the lex order.

3. **Off-by-one in DP initialization**: Each `dp[j]` should start at 1 (the column itself forms a sequence of length 1), not 0. Starting at 0 would underestimate sequence lengths.

4. **Returning max(dp) instead of k - max(dp)**: The problem asks for columns to DELETE, not columns to KEEP. Always double-check what the problem is asking for.

## When You'll See This Pattern

This "2D LIS" pattern appears when you need to find a subsequence with constraints involving multiple comparisons:

1. **Longest Increasing Subsequence (LeetCode 300)**: The 1D version of this problem. Instead of comparing columns across rows, you compare single numbers.

2. **Russian Doll Envelopes (LeetCode 354)**: Find maximum envelopes you can Russian doll, where envelope A fits in B if `width_A < width_B AND height_A < height_B`. This is LIS in 2D after sorting.

3. **Maximum Length of Pair Chain (LeetCode 646)**: Similar to LIS but with interval pairs. You're finding the longest chain where each pair can follow the previous.

The pattern: When you need to find the **longest sequence** where each element must satisfy a **comparison condition** with the previous element, think LIS DP.

## Key Takeaways

1. **Recognize LIS in disguise**: When a problem asks for "maximum subsequence where each element satisfies some condition with the previous," it's often an LIS variant. The condition might be 1D (simple comparison) or multi-dimensional (compare across multiple attributes).

2. **DP state definition is key**: `dp[j] = longest sequence ending at position j` is the classic LIS formulation. The transition checks all previous positions i to see if j can extend the sequence ending at i.

3. **Minimizing deletions = maximizing kept elements**: Many "minimum deletions" problems are actually "maximum kept elements" problems in disguise. Frame the problem positively to find the DP formulation.

[Practice this problem on CodeJeet](/problem/delete-columns-to-make-sorted-iii)
