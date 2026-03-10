---
title: "How to Solve Palindrome Partitioning — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Palindrome Partitioning. Medium difficulty, 73.7% acceptance rate. Topics: String, Dynamic Programming, Backtracking."
date: "2026-08-15"
category: "dsa-patterns"
tags: ["palindrome-partitioning", "string", "dynamic-programming", "backtracking", "medium"]
---

# How to Solve Palindrome Partitioning

This problem asks us to partition a string into substrings where every substring is a palindrome, and return all possible valid partitions. What makes this problem interesting is that we need to explore all possible ways to cut the string while ensuring each piece is valid. It's a classic combination of backtracking and palindrome checking that tests your ability to think recursively about string manipulation.

## Visual Walkthrough

Let's trace through a small example: `s = "aab"`

We need to find all ways to split this string so that every substring is a palindrome:

1. **Start at index 0**: We can take substrings starting from position 0
   - Take `"a"` (palindrome) → Remaining: `"ab"`
     - From index 1: Take `"a"` (palindrome) → Remaining: `"b"`
       - From index 2: Take `"b"` (palindrome) → No remaining
       - Result: `["a", "a", "b"]`
     - From index 1: Try `"ab"` (not palindrome) → Skip
   - Take `"aa"` (palindrome) → Remaining: `"b"`
     - From index 2: Take `"b"` (palindrome) → No remaining
     - Result: `["aa", "b"]`
   - Take `"aab"` (not palindrome) → Skip

2. **Final results**: `[["a","a","b"], ["aa","b"]]`

The key insight is that at each position, we try all possible substrings starting from that position, check if they're palindromes, and if so, recursively process the remaining string.

## Brute Force Approach

A naive approach would be to generate all possible partitions of the string and check if each partition contains only palindromes. For a string of length `n`, there are `2^(n-1)` possible ways to cut the string (each position between characters can either be cut or not). For each partition, we'd need to check each substring for palindrome property, which takes O(n) time per substring.

This leads to a complexity of O(n × 2^n) which is extremely inefficient for even moderately sized strings. For example, with n=20, we'd have over 1 million partitions to check, each requiring palindrome validation.

The problem with brute force is that it doesn't prune invalid paths early. We keep generating partitions that contain non-palindromic substrings, wasting computation.

## Optimized Approach

The key insight is to use **backtracking with memoization**:

1. At each position in the string, try all possible substrings starting from that position
2. Check if the substring is a palindrome
3. If it is, add it to the current partition and recursively process the remaining string
4. When we reach the end of the string, add the current partition to results

We can optimize further by:

- **Memoizing palindrome checks**: Store results of palindrome checks in a DP table to avoid recomputing
- **Pruning early**: Only explore paths where the current substring is a palindrome

The backtracking approach is efficient because it prunes invalid paths immediately. If a substring isn't a palindrome, we don't explore any partitions that include it.

## Optimal Solution

Here's the complete solution using backtracking with memoized palindrome checks:

<div class="code-group">

```python
# Time: O(n * 2^n) | Space: O(n^2) for DP table + O(n) for recursion stack
def partition(s: str):
    n = len(s)
    result = []
    current_partition = []

    # DP table for palindrome checks: dp[i][j] = True if s[i:j+1] is palindrome
    dp = [[False] * n for _ in range(n)]

    # Precompute palindrome table using DP
    # A substring s[i:j+1] is palindrome if:
    # 1. s[i] == s[j]
    # 2. The substring between i and j is palindrome (or length <= 2)
    for i in range(n):
        dp[i][i] = True  # Single character is always palindrome

    # Build the DP table for all substrings
    for length in range(2, n + 1):  # Check substrings of increasing length
        for i in range(n - length + 1):
            j = i + length - 1
            # Check if first and last characters match
            if s[i] == s[j]:
                # For length 2 or if inner substring is palindrome
                if length == 2 or dp[i + 1][j - 1]:
                    dp[i][j] = True

    def backtrack(start):
        # If we've reached the end of the string, add current partition to results
        if start == n:
            result.append(current_partition.copy())
            return

        # Try all possible substrings starting from 'start'
        for end in range(start, n):
            # Check if substring s[start:end+1] is palindrome using DP table
            if dp[start][end]:
                # Add valid palindrome to current partition
                current_partition.append(s[start:end + 1])
                # Recursively process the remaining string
                backtrack(end + 1)
                # Backtrack: remove last added substring
                current_partition.pop()

    # Start backtracking from the beginning of the string
    backtrack(0)
    return result
```

```javascript
// Time: O(n * 2^n) | Space: O(n^2) for DP table + O(n) for recursion stack
function partition(s) {
  const n = s.length;
  const result = [];
  const currentPartition = [];

  // DP table for palindrome checks: dp[i][j] = true if s[i..j] is palindrome
  const dp = Array(n)
    .fill()
    .map(() => Array(n).fill(false));

  // Precompute palindrome table using DP
  // Fill diagonal: single characters are always palindromes
  for (let i = 0; i < n; i++) {
    dp[i][i] = true;
  }

  // Build the DP table for all substrings
  // We need to fill by increasing substring length
  for (let length = 2; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length - 1;
      // Check if first and last characters match
      if (s[i] === s[j]) {
        // For length 2 or if inner substring is palindrome
        if (length === 2 || dp[i + 1][j - 1]) {
          dp[i][j] = true;
        }
      }
    }
  }

  function backtrack(start) {
    // If we've reached the end of the string, add current partition to results
    if (start === n) {
      result.push([...currentPartition]);
      return;
    }

    // Try all possible substrings starting from 'start'
    for (let end = start; end < n; end++) {
      // Check if substring s[start..end] is palindrome using DP table
      if (dp[start][end]) {
        // Add valid palindrome to current partition
        currentPartition.push(s.substring(start, end + 1));
        // Recursively process the remaining string
        backtrack(end + 1);
        // Backtrack: remove last added substring
        currentPartition.pop();
      }
    }
  }

  // Start backtracking from the beginning of the string
  backtrack(0);
  return result;
}
```

```java
// Time: O(n * 2^n) | Space: O(n^2) for DP table + O(n) for recursion stack
import java.util.*;

class Solution {
    public List<List<String>> partition(String s) {
        List<List<String>> result = new ArrayList<>();
        List<String> currentPartition = new ArrayList<>();
        int n = s.length();

        // DP table for palindrome checks: dp[i][j] = true if s[i..j] is palindrome
        boolean[][] dp = new boolean[n][n];

        // Precompute palindrome table using DP
        // Fill diagonal: single characters are always palindromes
        for (int i = 0; i < n; i++) {
            dp[i][i] = true;
        }

        // Build the DP table for all substrings
        // We need to fill by increasing substring length
        for (int length = 2; length <= n; length++) {
            for (int i = 0; i <= n - length; i++) {
                int j = i + length - 1;
                // Check if first and last characters match
                if (s.charAt(i) == s.charAt(j)) {
                    // For length 2 or if inner substring is palindrome
                    if (length == 2 || dp[i + 1][j - 1]) {
                        dp[i][j] = true;
                    }
                }
            }
        }

        backtrack(s, 0, dp, currentPartition, result);
        return result;
    }

    private void backtrack(String s, int start, boolean[][] dp,
                          List<String> currentPartition, List<List<String>> result) {
        int n = s.length();

        // If we've reached the end of the string, add current partition to results
        if (start == n) {
            result.add(new ArrayList<>(currentPartition));
            return;
        }

        // Try all possible substrings starting from 'start'
        for (int end = start; end < n; end++) {
            // Check if substring s[start..end] is palindrome using DP table
            if (dp[start][end]) {
                // Add valid palindrome to current partition
                currentPartition.add(s.substring(start, end + 1));
                // Recursively process the remaining string
                backtrack(s, end + 1, dp, currentPartition, result);
                // Backtrack: remove last added substring
                currentPartition.remove(currentPartition.size() - 1);
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × 2^n)**

- The DP table construction takes O(n²) time
- The backtracking explores up to 2^n possible partitions in the worst case (when all substrings are palindromes, like "aaa...")
- For each partition, we're doing O(1) palindrome checks using the DP table
- The dominant factor is the backtracking: O(n × 2^n) where n is for creating substrings

**Space Complexity: O(n²)**

- The DP table uses O(n²) space
- The recursion stack uses O(n) space in the worst case
- The result storage could take up to O(n × 2^n) space, but this is output space and typically not counted in space complexity analysis

## Common Mistakes

1. **Forgetting to backtrack properly**: After the recursive call, you must remove the last added substring. This is crucial for exploring all possibilities.

2. **Inefficient palindrome checking**: Checking if a substring is palindrome by reversing it each time takes O(k) time for a substring of length k. Using a DP table for O(1) checks is much more efficient.

3. **Incorrect DP table construction**: When building the palindrome DP table, you must fill it by increasing substring length, not by row/column order. The inner substring `dp[i+1][j-1]` must be computed before `dp[i][j]`.

4. **Off-by-one errors with indices**: Be careful with substring indices. In Python, `s[start:end+1]` gives characters from start to end inclusive. In Java/JavaScript, `substring(start, end+1)` does the same.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Backtracking/DFS for generating combinations**: Similar to combination sum, subsets, and permutation problems where you need to explore all possibilities.
2. **Palindrome DP table**: Used in many palindrome-related problems for efficient palindrome checking.

Related problems that use similar techniques:

- **Palindrome Partitioning II (Hard)**: Uses the same palindrome DP table but adds another DP layer to find the minimum cuts.
- **Palindrome Partitioning IV (Hard)**: Extends to checking if a string can be partitioned into exactly three palindromes.
- **Longest Palindromic Substring (Medium)**: Uses a similar DP approach for finding the longest palindrome.
- **Word Break (Medium)**: Similar backtracking structure but checks against a dictionary instead of palindrome property.

## Key Takeaways

1. **Backtracking is natural for partition problems**: When you need to explore all ways to split a sequence, backtracking lets you build partitions incrementally and prune invalid paths early.

2. **Memoize expensive checks**: Palindrome checking is O(n) if done naively. Precomputing a DP table gives O(1) checks and significantly improves performance.

3. **The pattern of "try all substrings starting from current position"** is common in string partition problems. Each recursive call processes the remaining string after taking a valid substring.

Related problems: [Palindrome Partitioning II](/problem/palindrome-partitioning-ii), [Palindrome Partitioning IV](/problem/palindrome-partitioning-iv), [Maximum Number of Non-overlapping Palindrome Substrings](/problem/maximum-number-of-non-overlapping-palindrome-substrings)
