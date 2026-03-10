---
title: "How to Solve Minimum Insertion Steps to Make a String Palindrome — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Insertion Steps to Make a String Palindrome. Hard difficulty, 73.7% acceptance rate. Topics: String, Dynamic Programming."
date: "2028-01-09"
category: "dsa-patterns"
tags:
  ["minimum-insertion-steps-to-make-a-string-palindrome", "string", "dynamic-programming", "hard"]
---

# How to Solve Minimum Insertion Steps to Make a String Palindrome

This problem asks us to find the minimum number of character insertions needed to transform any string into a palindrome. What makes this problem interesting is that we can only insert characters—we cannot delete or replace existing ones. This constraint forces us to think about the longest palindromic subsequence already present in the string, since those characters don't need to be matched with new insertions.

## Visual Walkthrough

Let's trace through the example `s = "mbadm"` to build intuition.

A palindrome reads the same forwards and backwards. The key insight is that characters that already form a palindrome within the string don't need any insertions—we just need to insert characters to match the ones that aren't part of that palindrome.

For `"mbadm"`:

- If we look at the string, we can see that `"madam"` is a palindrome
- Our string contains `"m"`, `"a"`, `"d"`, `"a"`, `"m"` in that order
- But wait, `"mbadm"` isn't `"madam"`—let's think differently

Actually, let's find the longest subsequence that's already a palindrome:

- `"mam"` is a palindrome (positions 0, 3, 4: m, a, m)
- `"mdm"` is also a palindrome (positions 0, 2, 4: m, b, m)
- The longest is length 3

Since the longest palindromic subsequence has length 3, and our string length is 5, we need to insert `5 - 3 = 2` characters to make it a palindrome.

Let's verify: Starting with `"mbadm"`:

1. Insert 'd' at position 1: `"mdbadm"`
2. Insert 'b' at position 5: `"mdbabdm"` (palindrome!)

So 2 insertions work. The minimum is indeed 2.

## Brute Force Approach

A naive approach would be to try all possible insertion sequences. For a string of length n, at each step we could insert any of 26 letters at any of (n+1) positions. The search space grows exponentially—this is clearly infeasible.

Another brute force idea: generate all possible palindromes that contain the original string as a subsequence, then find the shortest such palindrome. But the number of possible palindromes containing a given string as subsequence is enormous.

What a candidate might initially try is a greedy approach: compare characters from both ends and insert when they don't match. For `"mbadm"`:

- Compare 'm' and 'm': match ✓
- Compare 'b' and 'd': don't match ✗
- Insert 'd' after 'b': now we have `"mbdadm"`
- Compare 'b' and 'd' again: still don't match ✗
- This greedy approach fails because it doesn't consider optimal matching

The greedy approach fails on cases like `"leetcode"` where optimal matching requires looking ahead.

## Optimized Approach

The key insight is that this problem reduces to finding the **Longest Palindromic Subsequence (LPS)** of the string. Once we know the length of the LPS, the minimum insertions needed is simply:

```
min_insertions = len(s) - LPS_length
```

Why does this work? Because:

1. Characters in the LPS are already in palindrome order
2. For characters NOT in the LPS, we need to insert matching characters
3. Each character not in the LPS needs exactly one insertion to pair with it

To find the LPS, we can use dynamic programming. The LPS of a string is the LCS (Longest Common Subsequence) of the string and its reverse. So:

```
LPS(s) = LCS(s, reverse(s))
```

This gives us two equivalent DP approaches:

1. Direct LPS DP: `dp[i][j]` = LPS length for substring `s[i:j+1]`
2. LCS DP: `dp[i][j]` = LCS length between first i chars of s and first j chars of reverse(s)

We'll use the direct LPS approach as it's more intuitive for this problem.

## Optimal Solution

We'll implement a dynamic programming solution that finds the longest palindromic subsequence length, then subtract it from the string length.

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n^2) where n = len(s)
def minInsertions(s: str) -> int:
    """
    Returns minimum insertions to make s palindrome.
    Approach: Find longest palindromic subsequence (LPS),
    then answer = len(s) - LPS_length.
    """
    n = len(s)
    # dp[i][j] = length of LPS in substring s[i:j+1]
    dp = [[0] * n for _ in range(n)]

    # Base case: single characters are palindromes of length 1
    for i in range(n):
        dp[i][i] = 1

    # Fill DP table diagonally
    # We iterate over substring lengths from 2 to n
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1  # end index of substring

            if s[i] == s[j]:
                # If ends match, they contribute 2 to LPS
                # Add LPS of middle substring s[i+1:j]
                if length == 2:
                    dp[i][j] = 2  # Special case: two identical chars
                else:
                    dp[i][j] = dp[i + 1][j - 1] + 2
            else:
                # If ends don't match, take max of:
                # 1. LPS without first char: s[i+1:j+1]
                # 2. LPS without last char: s[i:j]
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])

    # LPS length for entire string is dp[0][n-1]
    lps_length = dp[0][n - 1]

    # Minimum insertions = total chars - LPS chars
    return n - lps_length
```

```javascript
// Time: O(n^2) | Space: O(n^2) where n = s.length
function minInsertions(s) {
  /**
   * Returns minimum insertions to make s palindrome.
   * Approach: Find longest palindromic subsequence (LPS),
   * then answer = s.length - LPS_length.
   */
  const n = s.length;
  // dp[i][j] = length of LPS in substring s[i..j]
  const dp = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  // Base case: single characters are palindromes of length 1
  for (let i = 0; i < n; i++) {
    dp[i][i] = 1;
  }

  // Fill DP table diagonally
  // We iterate over substring lengths from 2 to n
  for (let length = 2; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length - 1; // end index of substring

      if (s[i] === s[j]) {
        // If ends match, they contribute 2 to LPS
        // Add LPS of middle substring s[i+1..j-1]
        if (length === 2) {
          dp[i][j] = 2; // Special case: two identical chars
        } else {
          dp[i][j] = dp[i + 1][j - 1] + 2;
        }
      } else {
        // If ends don't match, take max of:
        // 1. LPS without first char: s[i+1..j]
        // 2. LPS without last char: s[i..j-1]
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }

  // LPS length for entire string is dp[0][n-1]
  const lpsLength = dp[0][n - 1];

  // Minimum insertions = total chars - LPS chars
  return n - lpsLength;
}
```

```java
// Time: O(n^2) | Space: O(n^2) where n = s.length()
class Solution {
    public int minInsertions(String s) {
        /**
         * Returns minimum insertions to make s palindrome.
         * Approach: Find longest palindromic subsequence (LPS),
         * then answer = s.length() - LPS_length.
         */
        int n = s.length();
        // dp[i][j] = length of LPS in substring s[i..j]
        int[][] dp = new int[n][n];

        // Base case: single characters are palindromes of length 1
        for (int i = 0; i < n; i++) {
            dp[i][i] = 1;
        }

        // Fill DP table diagonally
        // We iterate over substring lengths from 2 to n
        for (int length = 2; length <= n; length++) {
            for (int i = 0; i <= n - length; i++) {
                int j = i + length - 1;  // end index of substring

                if (s.charAt(i) == s.charAt(j)) {
                    // If ends match, they contribute 2 to LPS
                    // Add LPS of middle substring s[i+1..j-1]
                    if (length == 2) {
                        dp[i][j] = 2;  // Special case: two identical chars
                    } else {
                        dp[i][j] = dp[i + 1][j - 1] + 2;
                    }
                } else {
                    // If ends don't match, take max of:
                    // 1. LPS without first char: s[i+1..j]
                    // 2. LPS without last char: s[i..j-1]
                    dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
                }
            }
        }

        // LPS length for entire string is dp[0][n-1]
        int lpsLength = dp[0][n - 1];

        // Minimum insertions = total chars - LPS chars
        return n - lpsLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) where n is the length of the string. We fill an n×n DP table, and each cell takes O(1) time to compute.

**Space Complexity:** O(n²) for the DP table. We can optimize to O(n) by only keeping two rows of the DP table at a time since we only need `dp[i+1][j]` and `dp[i][j-1]` to compute `dp[i][j]`. However, the O(n²) solution is usually acceptable in interviews and clearer to explain.

## Common Mistakes

1. **Confusing subsequence with substring**: A subsequence doesn't need to be contiguous, while a substring does. We're looking for the longest palindromic subsequence, not substring. Using substring would give wrong answers for cases like `"bbbab"` where the LPS is `"bbbb"` (length 4) but the longest palindromic substring is only length 3.

2. **Off-by-one errors in DP indices**: When `length = 2`, we can't access `dp[i+1][j-1]` because `i+1 > j-1`. That's why we need the special case check. Many candidates forget this and get index out of bounds errors.

3. **Trying greedy two-pointer approach**: Some candidates try to use two pointers at the ends and insert when characters don't match. This fails for `"leetcode"` where optimal solution requires 5 insertions (`"leetcodocteel"`), but greedy might take more.

4. **Not recognizing the LPS connection**: The biggest conceptual mistake is not realizing that `min_insertions = n - LPS_length`. Without this insight, candidates might try overly complicated DP formulations.

## When You'll See This Pattern

This pattern of "minimum edits to make palindrome" appears in several variations:

1. **Minimum Deletions to Make String Palindrome** (similar to this but with deletions instead of insertions) - Same LPS approach works: `min_deletions = n - LPS_length`

2. **Longest Palindromic Subsequence** (LeetCode 516) - This is the core subproblem we solve here.

3. **Minimum Insertion Steps to Make a String Palindrome** (this problem) - The exact problem we're solving.

4. **Palindrome Partitioning II** (LeetCode 132) - Also uses palindrome DP but for partitioning rather than insertions.

The common thread is using dynamic programming to find palindromic structures within strings, often with a 2D DP table where `dp[i][j]` represents some optimal value for substring `s[i:j+1]`.

## Key Takeaways

1. **Palindrome problems often reduce to finding the longest palindromic subsequence**. When you need minimum insertions/deletions to make a string palindrome, think LPS first.

2. **LPS can be found via DP comparing a string with its reverse** (LCS approach) or directly with substring DP. The direct DP recurrence is:
   - If ends match: `dp[i][j] = dp[i+1][j-1] + 2`
   - If ends don't match: `dp[i][j] = max(dp[i+1][j], dp[i][j-1])`

3. **Fill DP tables diagonally by increasing substring length**. This ensures smaller subproblems are solved before larger ones.

Remember: `minimum insertions to make palindrome = string length - LPS length`.

Related problems: [Minimum Number of Moves to Make Palindrome](/problem/minimum-number-of-moves-to-make-palindrome)
