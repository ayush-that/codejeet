---
title: "How to Solve Longest Common Subsequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Common Subsequence. Medium difficulty, 58.9% acceptance rate. Topics: String, Dynamic Programming."
date: "2026-06-14"
category: "dsa-patterns"
tags: ["longest-common-subsequence", "string", "dynamic-programming", "medium"]
---

# How to Solve Longest Common Subsequence

The Longest Common Subsequence (LCS) problem asks: given two strings, what's the longest sequence of characters that appears in both strings in the same order (though not necessarily consecutively)? This is a classic dynamic programming problem that appears in everything from DNA sequence alignment to version control systems. What makes it tricky is that you can't just compare characters position by position—you need to consider all possible subsequences, which grows exponentially with string length.

## Visual Walkthrough

Let's trace through a concrete example: `text1 = "abcde"` and `text2 = "ace"`.

We want to find the longest sequence of characters that appears in both strings in order. Looking at the strings:

- Both contain "a" then "c" then "e" in that order
- "ace" is 3 characters long
- No longer common subsequence exists

But how do we systematically find this? Let's think about comparing the strings character by character:

1. Compare 'a' (first char of both): they match! So we have at least LCS length 1.
2. Now compare 'b' from text1 with 'c' from text2: they don't match. We have two choices:
   - Skip 'b' from text1 and keep comparing with 'c' from text2
   - Skip 'c' from text2 and keep comparing 'b' from text1 with the next char of text2
3. We need to consider both possibilities and take the maximum result.

This branching is what makes the brute force approach exponential. The key insight is that we can build up solutions to smaller subproblems and reuse them.

## Brute Force Approach

A naive solution would try all possible subsequences of both strings and compare them. For each string of length n, there are 2^n possible subsequences (each character can either be included or excluded). Comparing all pairs would take O(2^(m+n)) time, where m and n are the string lengths.

Even for modest strings like length 20, this is over 1 trillion operations—completely impractical. A candidate might try recursion without memoization:

<div class="code-group">

```python
# Time: O(2^(m+n)) | Space: O(m+n) for recursion stack
def brute_lcs(text1, text2, i, j):
    # Base case: reached end of either string
    if i == len(text1) or j == len(text2):
        return 0

    # If characters match, include in LCS
    if text1[i] == text2[j]:
        return 1 + brute_lcs(text1, text2, i + 1, j + 1)

    # If they don't match, try both possibilities
    return max(brute_lcs(text1, text2, i + 1, j),
               brute_lcs(text1, text2, i, j + 1))
```

```javascript
// Time: O(2^(m+n)) | Space: O(m+n) for recursion stack
function bruteLCS(text1, text2, i, j) {
  // Base case: reached end of either string
  if (i === text1.length || j === text2.length) {
    return 0;
  }

  // If characters match, include in LCS
  if (text1[i] === text2[j]) {
    return 1 + bruteLCS(text1, text2, i + 1, j + 1);
  }

  // If they don't match, try both possibilities
  return Math.max(bruteLCS(text1, text2, i + 1, j), bruteLCS(text1, text2, i, j + 1));
}
```

```java
// Time: O(2^(m+n)) | Space: O(m+n) for recursion stack
public int bruteLCS(String text1, String text2, int i, int j) {
    // Base case: reached end of either string
    if (i == text1.length() || j == text2.length()) {
        return 0;
    }

    // If characters match, include in LCS
    if (text1.charAt(i) == text2.charAt(j)) {
        return 1 + bruteLCS(text1, text2, i + 1, j + 1);
    }

    // If they don't match, try both possibilities
    return Math.max(
        bruteLCS(text1, text2, i + 1, j),
        bruteLCS(text1, text2, i, j + 1)
    );
}
```

</div>

This recursive solution has overlapping subproblems—the same `(i, j)` pair gets computed many times. For example, when we skip a character from text1 and then skip one from text2, we end up at the same state as if we had done the opposite order. This exponential duplication is why we need dynamic programming.

## Optimized Approach

The key insight is that LCS has **optimal substructure**: the solution to the main problem can be built from solutions to smaller subproblems. Specifically:

1. If the last characters of both strings match, then the LCS includes that character plus the LCS of the strings without their last characters.
2. If the last characters don't match, then the LCS is the maximum of:
   - LCS of text1 without its last character and text2
   - LCS of text1 and text2 without its last character

We can define `dp[i][j]` as the length of LCS of `text1[0:i]` and `text2[0:j]` (first i characters of text1 and first j characters of text2).

The recurrence relation:

- If `text1[i-1] == text2[j-1]`: `dp[i][j] = 1 + dp[i-1][j-1]`
- Otherwise: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

We build a 2D table where `dp[i][j]` depends on three neighboring cells: left, top, and top-left. This allows us to fill the table in O(m×n) time instead of exponential time.

## Optimal Solution

Here's the complete dynamic programming solution:

<div class="code-group">

```python
# Time: O(m * n) | Space: O(m * n)
def longestCommonSubsequence(text1: str, text2: str) -> int:
    """
    Returns the length of the longest common subsequence between text1 and text2.

    Args:
        text1: First input string
        text2: Second input string

    Returns:
        Length of the longest common subsequence
    """
    m, n = len(text1), len(text2)

    # Create a (m+1) x (n+1) DP table initialized with zeros
    # dp[i][j] represents LCS length for text1[0:i] and text2[0:j]
    # The +1 dimensions handle empty string cases (0 characters)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Fill the DP table row by row
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            # Check if current characters match (note: i-1 and j-1 because dp has +1 offset)
            if text1[i - 1] == text2[j - 1]:
                # Characters match: LCS increases by 1
                # Add 1 to the LCS of the prefixes without these characters
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                # Characters don't match: take the best of two possibilities
                # Either skip current char from text1 or skip current char from text2
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    # The bottom-right cell contains the answer for full strings
    return dp[m][n]
```

```javascript
// Time: O(m * n) | Space: O(m * n)
/**
 * Returns the length of the longest common subsequence between text1 and text2.
 *
 * @param {string} text1 - First input string
 * @param {string} text2 - Second input string
 * @return {number} Length of the longest common subsequence
 */
function longestCommonSubsequence(text1, text2) {
  const m = text1.length,
    n = text2.length;

  // Create a (m+1) x (n+1) DP table initialized with zeros
  // dp[i][j] represents LCS length for text1[0:i] and text2[0:j]
  // The +1 dimensions handle empty string cases (0 characters)
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  // Fill the DP table row by row
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // Check if current characters match (note: i-1 and j-1 because dp has +1 offset)
      if (text1[i - 1] === text2[j - 1]) {
        // Characters match: LCS increases by 1
        // Add 1 to the LCS of the prefixes without these characters
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        // Characters don't match: take the best of two possibilities
        // Either skip current char from text1 or skip current char from text2
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // The bottom-right cell contains the answer for full strings
  return dp[m][n];
}
```

```java
// Time: O(m * n) | Space: O(m * n)
class Solution {
    /**
     * Returns the length of the longest common subsequence between text1 and text2.
     *
     * @param text1 First input string
     * @param text2 Second input string
     * @return Length of the longest common subsequence
     */
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();

        // Create a (m+1) x (n+1) DP table initialized with zeros
        // dp[i][j] represents LCS length for text1[0:i] and text2[0:j]
        // The +1 dimensions handle empty string cases (0 characters)
        int[][] dp = new int[m + 1][n + 1];

        // Fill the DP table row by row
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                // Check if current characters match (note: i-1 and j-1 because dp has +1 offset)
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    // Characters match: LCS increases by 1
                    // Add 1 to the LCS of the prefixes without these characters
                    dp[i][j] = 1 + dp[i - 1][j - 1];
                } else {
                    // Characters don't match: take the best of two possibilities
                    // Either skip current char from text1 or skip current char from text2
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        // The bottom-right cell contains the answer for full strings
        return dp[m][n];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n), where m and n are the lengths of the two strings. We fill an (m+1) × (n+1) DP table, and each cell takes O(1) time to compute.

**Space Complexity:** O(m × n) for the DP table. We can optimize to O(min(m, n)) by only keeping two rows of the DP table at a time, since each row only depends on the previous row. However, the O(m × n) solution is usually acceptable in interviews and easier to explain.

## Common Mistakes

1. **Off-by-one errors with indices:** The most common mistake is mixing up string indices (0-based) with DP table indices (1-based). Remember: `dp[i][j]` corresponds to `text1[0:i-1]` and `text2[0:j-1]`. When checking characters, use `text1[i-1]` and `text2[j-1]`.

2. **Forgetting empty string cases:** The DP table needs +1 dimensions to handle the case where we compare an empty string with another string. `dp[0][j]` and `dp[i][0]` should always be 0.

3. **Confusing subsequence with substring:** A subsequence doesn't require characters to be consecutive, while a substring does. Don't reset the count when characters don't match—instead, take the maximum of skipping from either string.

4. **Trying to optimize space too early:** In an interview, it's better to present the clear O(m×n) space solution first, then mention the O(min(m,n)) optimization if asked. Starting with the optimized version can lead to index confusion.

## When You'll See This Pattern

The LCS pattern appears in many string comparison problems:

1. **Longest Palindromic Subsequence (#516):** Find the longest subsequence of a string that's a palindrome. This is essentially LCS between the string and its reverse.

2. **Delete Operation for Two Strings (#583):** Find the minimum number of deletions to make two strings equal. This equals `len(s1) + len(s2) - 2 * LCS(s1, s2)`.

3. **Shortest Common Supersequence (#1092):** Find the shortest string that has both input strings as subsequences. The length is `len(s1) + len(s2) - LCS(s1, s2)`.

4. **Edit Distance (#72):** Similar recurrence but with three operations (insert, delete, replace) instead of just matching/skipping.

This pattern also appears in bioinformatics (DNA sequence alignment), version control (diff algorithms), and natural language processing (sentence similarity).

## Key Takeaways

1. **Recognize optimal substructure:** When a problem asks for the "longest" or "maximum" of something with sequential constraints, and the solution can be built from smaller subproblems, think dynamic programming.

2. **2D DP for two sequences:** When comparing two sequences (strings, arrays), a 2D DP table where `dp[i][j]` represents the solution for prefixes is often the right approach.

3. **The recurrence reveals the logic:** The structure `if match: 1 + dp[i-1][j-1] else: max(dp[i-1][j], dp[i][j-1])` is a classic pattern for sequence comparison problems.

Remember: Practice deriving the recurrence relation from scratch. Draw the DP table for small examples to build intuition. Once you internalize this pattern, you'll recognize it in many medium-to-hard string problems.

Related problems: [Longest Palindromic Subsequence](/problem/longest-palindromic-subsequence), [Delete Operation for Two Strings](/problem/delete-operation-for-two-strings), [Shortest Common Supersequence](/problem/shortest-common-supersequence)
