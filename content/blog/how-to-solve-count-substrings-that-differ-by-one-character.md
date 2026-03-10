---
title: "How to Solve Count Substrings That Differ by One Character — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Substrings That Differ by One Character. Medium difficulty, 72.4% acceptance rate. Topics: Hash Table, String, Dynamic Programming, Enumeration."
date: "2028-12-29"
category: "dsa-patterns"
tags:
  [
    "count-substrings-that-differ-by-one-character",
    "hash-table",
    "string",
    "dynamic-programming",
    "medium",
  ]
---

# How to Solve Count Substrings That Differ by One Character

This problem asks us to count how many substrings from string `s` can be transformed into a substring from string `t` by changing exactly one character. The challenge lies in efficiently comparing all possible substrings without resorting to O(n³) or O(n⁴) brute force comparisons. What makes this interesting is that while we need to compare substrings, we don't actually need to generate all of them explicitly—we can use a clever dynamic programming approach that builds on the longest common prefix/suffix concept.

## Visual Walkthrough

Let's trace through a small example: `s = "aba"`, `t = "baba"`.

We need to find all substrings of `s` that differ from some substring of `t` by exactly one character. Let's manually check some possibilities:

1. Substring `"a"` from `s` (starting at index 0):
   - Compare with `"b"` from `t`: differ by 1 character ✓
   - Compare with `"a"` from `t`: differ by 0 characters ✗
   - Compare with `"b"` from `t` (starting at index 2): differ by 1 character ✓
   - Compare with `"a"` from `t`: differ by 0 characters ✗

2. Substring `"ab"` from `s` (starting at index 0):
   - Compare with `"ba"` from `t`: characters at positions: a≠b, b≠a → 2 differences ✗
   - Compare with `"ab"` from `t`: 0 differences ✗
   - Compare with `"ba"` from `t` (starting at index 2): a≠b, b=a → 1 difference ✓

3. Substring `"ba"` from `s` (starting at index 1):
   - Compare with `"ab"` from `t`: b≠a, a≠b → 2 differences ✗
   - Compare with `"ba"` from `t`: 0 differences ✗
   - Compare with `"ab"` from `t` (starting at index 2): b≠a, a=b → 1 difference ✓

The key insight: For each pair of starting positions `(i, j)` where `i` is in `s` and `j` is in `t`, we can find how many substrings starting at these positions differ by exactly one character. We do this by looking at the longest common prefix before the difference and the longest common suffix after it.

## Brute Force Approach

The most straightforward approach would be to:

1. Generate all substrings of `s` (O(n²) substrings)
2. For each substring, generate all substrings of `t` (O(m²) substrings)
3. Compare each pair to see if they differ by exactly one character (O(k) time per comparison, where k is substring length)

This gives us O(n² × m² × min(n,m)) time complexity, which is far too slow for typical constraints (strings up to length 100). Even for moderate string lengths, this approach becomes impractical.

A slightly better brute force would be O(n² × m²) by comparing substrings of equal length only, but this is still too slow. We need a more efficient way to compare substrings without explicitly generating all of them.

## Optimized Approach

The key insight is to use dynamic programming to compute, for each pair of positions `(i, j)`, the longest common prefix starting from those positions. But here's the twist: we need to find substrings that differ by exactly one character, not identical substrings.

The optimal approach uses two passes:

1. **Forward pass**: Compute `dp1[i][j]` = length of longest common prefix of `s[i:]` and `t[j:]`
2. **Backward pass**: Compute `dp2[i][j]` = length of longest common suffix of `s[:i]` and `t[:j]`

Then, for each possible difference position `k` in the substring, we can combine the prefix before `k` and suffix after `k` to count valid substrings. Specifically, for positions `(i, j)` where `s[i] ≠ t[j]`, the number of valid substrings starting with this difference is:
`(prefix_length + 1) × (suffix_length + 1)`

Why? Because:

- `prefix_length` tells us how many characters before `(i, j)` match
- `suffix_length` tells us how many characters after `(i, j)` match
- We can extend the substring to include 0 to `prefix_length` characters before the difference
- We can extend the substring to include 0 to `suffix_length` characters after the difference
- The `+1` accounts for the substring that starts/ends exactly at the difference point

## Optimal Solution

Here's the complete solution using dynamic programming with O(n × m) time and space complexity:

<div class="code-group">

```python
# Time: O(n * m) | Space: O(n * m)
def countSubstrings(s: str, t: str) -> int:
    """
    Count substrings of s that differ from substrings of t by exactly one character.

    Approach:
    1. Compute longest common prefix from each position (forward DP)
    2. Compute longest common suffix to each position (backward DP)
    3. For each position where characters differ, count valid substrings
    """
    n, m = len(s), len(t)

    # dp1[i][j] = longest common prefix of s[i:] and t[j:]
    dp1 = [[0] * (m + 1) for _ in range(n + 1)]

    # Fill dp1 from bottom-right to top-left (backward)
    for i in range(n - 1, -1, -1):
        for j in range(m - 1, -1, -1):
            if s[i] == t[j]:
                dp1[i][j] = dp1[i + 1][j + 1] + 1

    # dp2[i][j] = longest common suffix of s[:i] and t[:j]
    dp2 = [[0] * (m + 1) for _ in range(n + 1)]

    # Fill dp2 from top-left to bottom-right (forward)
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if s[i - 1] == t[j - 1]:
                dp2[i][j] = dp2[i - 1][j - 1] + 1

    result = 0

    # For each position (i, j) where characters differ
    for i in range(n):
        for j in range(m):
            if s[i] != t[j]:
                # prefix_len = common chars before (i, j)
                # suffix_len = common chars after (i, j)
                prefix_len = dp2[i][j]  # i, j are 0-indexed for strings
                suffix_len = dp1[i + 1][j + 1]  # look ahead one position

                # Number of valid substrings with difference at (i, j)
                # = (ways to extend left) × (ways to extend right)
                # = (prefix_len + 1) × (suffix_len + 1)
                result += (prefix_len + 1) * (suffix_len + 1)

    return result
```

```javascript
// Time: O(n * m) | Space: O(n * m)
function countSubstrings(s, t) {
  /**
   * Count substrings of s that differ from substrings of t by exactly one character.
   *
   * Approach:
   * 1. Compute longest common prefix from each position (forward DP)
   * 2. Compute longest common suffix to each position (backward DP)
   * 3. For each position where characters differ, count valid substrings
   */
  const n = s.length,
    m = t.length;

  // dp1[i][j] = longest common prefix of s[i:] and t[j:]
  const dp1 = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  // Fill dp1 from bottom-right to top-left (backward)
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (s[i] === t[j]) {
        dp1[i][j] = dp1[i + 1][j + 1] + 1;
      }
    }
  }

  // dp2[i][j] = longest common suffix of s[:i] and t[:j]
  const dp2 = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  // Fill dp2 from top-left to bottom-right (forward)
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (s[i - 1] === t[j - 1]) {
        dp2[i][j] = dp2[i - 1][j - 1] + 1;
      }
    }
  }

  let result = 0;

  // For each position (i, j) where characters differ
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (s[i] !== t[j]) {
        // prefix_len = common chars before (i, j)
        // suffix_len = common chars after (i, j)
        const prefixLen = dp2[i][j]; // i, j are 0-indexed for strings
        const suffixLen = dp1[i + 1][j + 1]; // look ahead one position

        // Number of valid substrings with difference at (i, j)
        // = (ways to extend left) × (ways to extend right)
        // = (prefix_len + 1) × (suffix_len + 1)
        result += (prefixLen + 1) * (suffixLen + 1);
      }
    }
  }

  return result;
}
```

```java
// Time: O(n * m) | Space: O(n * m)
class Solution {
    public int countSubstrings(String s, String t) {
        /**
         * Count substrings of s that differ from substrings of t by exactly one character.
         *
         * Approach:
         * 1. Compute longest common prefix from each position (forward DP)
         * 2. Compute longest common suffix to each position (backward DP)
         * 3. For each position where characters differ, count valid substrings
         */
        int n = s.length(), m = t.length();

        // dp1[i][j] = longest common prefix of s.substring(i) and t.substring(j)
        int[][] dp1 = new int[n + 1][m + 1];

        // Fill dp1 from bottom-right to top-left (backward)
        for (int i = n - 1; i >= 0; i--) {
            for (int j = m - 1; j >= 0; j--) {
                if (s.charAt(i) == t.charAt(j)) {
                    dp1[i][j] = dp1[i + 1][j + 1] + 1;
                }
            }
        }

        // dp2[i][j] = longest common suffix of s.substring(0, i) and t.substring(0, j)
        int[][] dp2 = new int[n + 1][m + 1];

        // Fill dp2 from top-left to bottom-right (forward)
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (s.charAt(i - 1) == t.charAt(j - 1)) {
                    dp2[i][j] = dp2[i - 1][j - 1] + 1;
                }
            }
        }

        int result = 0;

        // For each position (i, j) where characters differ
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (s.charAt(i) != t.charAt(j)) {
                    // prefix_len = common chars before (i, j)
                    // suffix_len = common chars after (i, j)
                    int prefixLen = dp2[i][j];  // i, j are 0-indexed for strings
                    int suffixLen = dp1[i + 1][j + 1];  // look ahead one position

                    // Number of valid substrings with difference at (i, j)
                    // = (ways to extend left) × (ways to extend right)
                    // = (prefix_len + 1) × (suffix_len + 1)
                    result += (prefixLen + 1) * (suffixLen + 1);
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m)

- We perform two nested loops to fill `dp1`: O(n × m)
- We perform two nested loops to fill `dp2`: O(n × m)
- We perform two nested loops to count results: O(n × m)
- Total: O(3 × n × m) = O(n × m)

**Space Complexity:** O(n × m)

- We store two DP tables of size (n+1) × (m+1)
- Each table requires O(n × m) space
- Total: O(2 × n × m) = O(n × m)

We could optimize space to O(min(n, m)) by only storing one row/column at a time for each DP table, but the code becomes more complex and O(n × m) space is usually acceptable for interview constraints.

## Common Mistakes

1. **Off-by-one errors in DP indices**: The most common mistake is mixing 0-indexed string positions with 1-indexed DP table positions. Remember that `dp2[i][j]` corresponds to strings `s[:i]` and `t[:j]` (using Python slice notation), so when `i` and `j` are string indices, we need `dp2[i][j]` for the prefix, but `dp1[i+1][j+1]` for the suffix.

2. **Forgetting the `+1` in the final calculation**: When counting valid substrings for a difference at `(i, j)`, we can extend left by 0 to `prefix_len` characters (that's `prefix_len + 1` possibilities) and right by 0 to `suffix_len` characters (that's `suffix_len + 1` possibilities). Forgetting the `+1` will undercount single-character substrings.

3. **Only checking substrings of equal length**: Some candidates mistakenly only compare substrings of the same length. The problem allows the substring from `s` and substring from `t` to be of different lengths as long as they differ by exactly one character after replacement. However, note that if we replace one character, the lengths must be equal, so this isn't actually a mistake but a common misunderstanding.

4. **Double-counting substrings**: When a substring from `s` can match multiple substrings from `t` with one character difference, we might be tempted to count it multiple times. The problem asks for the number of ways to choose a substring from `s` and modify it, so each `(substring, modification position)` pair should be counted once.

## When You'll See This Pattern

This "longest common prefix/suffix" DP pattern appears in several string comparison problems:

1. **Longest Common Substring** (though usually solved with a simpler 2D DP)
2. **Edit Distance** problems where you need to find strings differing by exactly K operations
3. **Palindrome-related problems** where you expand around centers (similar to combining prefix and suffix)
4. **Substring matching with wildcards or errors**

The core technique of precomputing prefix/suffix matches and then combining them is useful whenever you need to compare many substrings efficiently. It transforms an O(n³) or O(n⁴) problem into O(n²).

## Key Takeaways

1. **When comparing all substrings between two strings**, consider using DP to precompute common prefixes/suffixes from each position rather than comparing substrings explicitly.

2. **The "difference by one character" constraint** can be handled by fixing the difference position and counting how many extensions are possible on both sides where characters match.

3. **DP indices require careful handling** when mixing 0-indexed strings with 1-indexed DP tables. Always be explicit about what each index represents.

Related problems: [Count Words Obtained After Adding a Letter](/problem/count-words-obtained-after-adding-a-letter)
