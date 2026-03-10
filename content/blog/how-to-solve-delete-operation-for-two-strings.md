---
title: "How to Solve Delete Operation for Two Strings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Delete Operation for Two Strings. Medium difficulty, 65.3% acceptance rate. Topics: String, Dynamic Programming."
date: "2027-08-26"
category: "dsa-patterns"
tags: ["delete-operation-for-two-strings", "string", "dynamic-programming", "medium"]
---

# How to Solve Delete Operation for Two Strings

This problem asks us to find the minimum number of character deletions needed to make two strings identical. The tricky part is that we can delete from either string, and deletions from both strings count toward our total. This creates a combinatorial explosion of possibilities that we need to navigate efficiently.

## Visual Walkthrough

Let's trace through a concrete example: `word1 = "sea"`, `word2 = "eat"`.

We want both strings to become the same. One way to think about this: we want to find the longest sequence of characters that appears in both strings in the same order (a common subsequence). Any characters NOT in this common subsequence need to be deleted.

For "sea" and "eat":

- The longest common subsequence is "ea" (positions: s**e**a and **e**a**t**)
- From "sea": we need to delete 's' → 1 deletion
- From "eat": we need to delete 't' → 1 deletion
- Total deletions: 1 + 1 = 2

Let's verify this works step-by-step:

1. Delete 's' from "sea" → "ea"
2. Delete 't' from "eat" → "ea"
3. Both strings are now "ea" after 2 deletions

Another way: we could delete all characters and end up with empty strings:

- Delete all 3 from "sea" → 3 deletions
- Delete all 3 from "eat" → 3 deletions
- Total: 6 deletions (not minimal)

The key insight: **minimum deletions = (len(word1) + len(word2)) - 2 \* (length of longest common subsequence)**

## Brute Force Approach

A naive approach would be to try all possible deletions. For each string of length n, there are 2^n possible subsequences (each character can either be kept or deleted). We could:

1. Generate all subsequences of word1
2. Generate all subsequences of word2
3. Find the longest common subsequence between any pair
4. Calculate deletions needed

This is extremely inefficient: O(2^(m+n)) time complexity where m and n are the string lengths. For strings of length 20, that's over 1 trillion operations!

Even a slightly better brute force would try to match characters greedily or use recursion to explore deletion choices, but without memoization, it still has exponential time complexity.

## Optimized Approach

The key insight is that this problem is fundamentally about finding the **Longest Common Subsequence (LCS)**. Once we know the LCS length, the answer is straightforward:

```
min_deletions = len(word1) + len(word2) - 2 * LCS_length
```

Why does this work?

- `len(word1) + len(word2)` counts all characters in both strings
- `2 * LCS_length` counts the characters we want to keep (they appear in both strings)
- The difference is the characters we need to delete

So the problem reduces to finding the LCS length. We can solve this with dynamic programming:

Let `dp[i][j]` = length of LCS between `word1[0:i]` and `word2[0:j]` (first i chars of word1, first j chars of word2).

Transition:

- If `word1[i-1] == word2[j-1]`: we can extend the LCS
  `dp[i][j] = dp[i-1][j-1] + 1`
- Otherwise: take the best of skipping a character from either string
  `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

Base case: `dp[0][j] = 0` and `dp[i][0] = 0` (empty string has no common subsequence)

## Optimal Solution

Here's the complete solution using dynamic programming to find the LCS length:

<div class="code-group">

```python
# Time: O(m*n) where m = len(word1), n = len(word2)
# Space: O(m*n) for the DP table
def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)

    # Create DP table with dimensions (m+1) x (n+1)
    # dp[i][j] = LCS length of word1[:i] and word2[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                # Characters match: extend LCS from previous position
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                # Characters don't match: take best of skipping char from either string
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    # LCS length is at dp[m][n]
    lcs_length = dp[m][n]

    # Minimum deletions = total chars - 2 * LCS length
    return (m + n) - 2 * lcs_length
```

```javascript
// Time: O(m*n) where m = word1.length, n = word2.length
// Space: O(m*n) for the DP table
function minDistance(word1, word2) {
  const m = word1.length,
    n = word2.length;

  // Create DP table with dimensions (m+1) x (n+1)
  // dp[i][j] = LCS length of word1[0..i-1] and word2[0..j-1]
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        // Characters match: extend LCS from previous position
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // Characters don't match: take best of skipping char from either string
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // LCS length is at dp[m][n]
  const lcsLength = dp[m][n];

  // Minimum deletions = total chars - 2 * LCS length
  return m + n - 2 * lcsLength;
}
```

```java
// Time: O(m*n) where m = word1.length(), n = word2.length()
// Space: O(m*n) for the DP table
class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();

        // Create DP table with dimensions (m+1) x (n+1)
        // dp[i][j] = LCS length of word1[0..i-1] and word2[0..j-1]
        int[][] dp = new int[m + 1][n + 1];

        // Fill DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    // Characters match: extend LCS from previous position
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    // Characters don't match: take best of skipping char from either string
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        // LCS length is at dp[m][n]
        int lcsLength = dp[m][n];

        // Minimum deletions = total chars - 2 * LCS length
        return (m + n) - 2 * lcsLength;
    }
}
```

</div>

## Space Optimization

We can optimize space to O(min(m, n)) by only keeping two rows of the DP table at a time:

<div class="code-group">

```python
# Time: O(m*n) | Space: O(min(m, n))
def minDistanceOptimized(word1: str, word2: str) -> int:
    # Use the shorter string for the DP array to save space
    if len(word1) < len(word2):
        word1, word2 = word2, word1

    m, n = len(word1), len(word2)

    # dp[j] represents LCS length for current row
    # prev[j] represents LCS length for previous row
    dp = [0] * (n + 1)

    for i in range(1, m + 1):
        prev = dp[:]  # Copy current row to prev
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[j] = prev[j - 1] + 1
            else:
                dp[j] = max(prev[j], dp[j - 1])

    return (m + n) - 2 * dp[n]
```

```javascript
// Time: O(m*n) | Space: O(min(m, n))
function minDistanceOptimized(word1, word2) {
  // Use the shorter string for the DP array to save space
  if (word1.length < word2.length) {
    [word1, word2] = [word2, word1];
  }

  const m = word1.length,
    n = word2.length;

  // dp[j] represents LCS length for current row
  let dp = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    let prev = [...dp]; // Copy current row to prev
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[j] = prev[j - 1] + 1;
      } else {
        dp[j] = Math.max(prev[j], dp[j - 1]);
      }
    }
  }

  return m + n - 2 * dp[n];
}
```

```java
// Time: O(m*n) | Space: O(min(m, n))
class Solution {
    public int minDistance(String word1, String word2) {
        // Use the shorter string for the DP array to save space
        if (word1.length() < word2.length()) {
            String temp = word1;
            word1 = word2;
            word2 = temp;
        }

        int m = word1.length(), n = word2.length();

        // dp[j] represents LCS length for current row
        int[] dp = new int[n + 1];

        for (int i = 1; i <= m; i++) {
            int[] prev = dp.clone();  // Copy current row to prev
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[j] = prev[j - 1] + 1;
                } else {
                    dp[j] = Math.max(prev[j], dp[j - 1]);
                }
            }
        }

        return (m + n) - 2 * dp[n];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n) where m and n are the lengths of the two strings. We need to fill an m×n DP table (or equivalent with space optimization).

**Space Complexity:**

- Basic solution: O(m × n) for the full DP table
- Optimized solution: O(min(m, n)) by only storing two rows

The time complexity comes from the nested loops over both string lengths. Each cell computation takes O(1) time.

## Common Mistakes

1. **Off-by-one errors in DP indices**: Remember that `dp[i][j]` corresponds to `word1[0:i-1]` and `word2[0:j-1]`. A common mistake is using `word1[i]` instead of `word1[i-1]`. Always be careful with 0-based vs 1-based indexing in DP.

2. **Forgetting the base cases**: The first row and column should be initialized to 0 since an empty string has no common subsequence with any string. Forgetting this can lead to incorrect results.

3. **Incorrect formula for deletions**: Some candidates try to compute deletions directly in the DP table instead of using the LCS formula. The correct formula is `(m + n) - 2 * LCS_length`, not `max(m, n) - LCS_length` or other variations.

4. **Not considering space optimization**: In interviews, it's good to mention that we can optimize space to O(min(m, n)). Even if you implement the full table first, discussing optimization shows deeper understanding.

## When You'll See This Pattern

This problem uses the **Longest Common Subsequence (LCS)** pattern, which appears in many string comparison problems:

1. **Edit Distance (LeetCode 72)**: Similar DP structure but with more operations (insert, delete, replace).
2. **Minimum ASCII Delete Sum for Two Strings (LeetCode 712)**: Same LCS structure but with weighted deletions (ASCII values).
3. **Longest Palindromic Subsequence (LeetCode 516)**: Can be solved by finding LCS between the string and its reverse.
4. **Shortest Common Supersequence (LeetCode 1092)**: Related to LCS - the supersequence contains the LCS.

The pattern is recognizable when you need to find alignment or similarity between two sequences with operations like insert, delete, or replace.

## Key Takeaways

1. **Reduction to known problems**: Many seemingly complex problems can be reduced to classic algorithms. Here, we reduced deletion distance to LCS length.

2. **DP for sequence alignment**: When comparing two sequences with operations that maintain order, dynamic programming with a 2D table is often the solution.

3. **Space-time tradeoff**: The O(m×n) space solution is easier to understand and implement first. Always consider if you can optimize space by keeping only necessary rows/columns.

Remember: minimum deletions = total characters - 2 × LCS length. This insight transforms the problem from a complex deletion counting exercise into a straightforward LCS computation.

Related problems: [Edit Distance](/problem/edit-distance), [Minimum ASCII Delete Sum for Two Strings](/problem/minimum-ascii-delete-sum-for-two-strings), [Longest Common Subsequence](/problem/longest-common-subsequence)
