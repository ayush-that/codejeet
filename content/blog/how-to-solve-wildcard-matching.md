---
title: "How to Solve Wildcard Matching — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Wildcard Matching. Hard difficulty, 31.4% acceptance rate. Topics: String, Dynamic Programming, Greedy, Recursion."
date: "2026-11-29"
category: "dsa-patterns"
tags: ["wildcard-matching", "string", "dynamic-programming", "greedy", "hard"]
---

# How to Solve Wildcard Matching

Wildcard matching asks us to determine if a given string `s` matches a pattern `p` containing two special characters: `'?'` (matches any single character) and `'*'` (matches any sequence of characters, including empty). The entire string must match the pattern. What makes this problem tricky is the `'*'` character, which can match zero or more characters, creating many possible matching paths that we need to explore efficiently.

## Visual Walkthrough

Let's trace through an example: `s = "adceb"`, `p = "*a*b"`.

We need to check if the entire string matches the pattern:

- `'*'` can match any sequence, so it could match nothing, "a", "ad", etc.
- `'a'` must match exactly 'a'
- `'*'` again can match any sequence
- `'b'` must match exactly 'b'

A step-by-step matching process:

1. First `'*'` in pattern: It could match nothing, so we note this possibility
2. Next pattern char `'a'`: We look for 'a' in the string
3. Second `'*'` in pattern: After matching 'a', this `'*'` could match the remaining "dceb", "ceb", "eb", "b", or nothing
4. Final `'b'`: Must match 'b' at the end

One valid matching path:

- First `'*'` matches nothing
- `'a'` matches first 'a' in "adceb" (position 0)
- Second `'*'` matches "dce"
- `'b'` matches final 'b'

This shows why we need a systematic way to track all possible matching states.

## Brute Force Approach

The most straightforward approach is recursive backtracking. At each position in the pattern:

- If it's a regular character, check if it matches the current string character
- If it's `'?'`, it matches any single character (advance both pointers)
- If it's `'*'`, we have multiple options:
  1. Match `'*'` to zero characters (advance pattern pointer only)
  2. Match `'*'` to one character (advance both pointers)
  3. Match `'*'` to more characters (advance string pointer only, keeping pattern pointer at `'*'`)

This leads to exponential time complexity because for each `'*'`, we explore multiple branches. With `k` stars in the pattern, we could have up to `O(3^k)` recursive calls in the worst case.

<div class="code-group">

```python
# Brute Force Recursive Solution
# Time: O(3^(m+n)) in worst case | Space: O(m+n) for recursion stack
def isMatchBruteForce(s: str, p: str) -> bool:
    def backtrack(s_idx: int, p_idx: int) -> bool:
        # Base case: both pointers at the end
        if p_idx == len(p):
            return s_idx == len(s)

        # If pattern char is '*', try all possibilities
        if p[p_idx] == '*':
            # Option 1: Match '*' to zero characters
            if backtrack(s_idx, p_idx + 1):
                return True
            # Option 2: Match '*' to one or more characters
            if s_idx < len(s) and backtrack(s_idx + 1, p_idx):
                return True
            return False

        # If pattern char is '?' or matches current char
        if s_idx < len(s) and (p[p_idx] == '?' or p[p_idx] == s[s_idx]):
            return backtrack(s_idx + 1, p_idx + 1)

        return False

    return backtrack(0, 0)
```

```javascript
// Brute Force Recursive Solution
// Time: O(3^(m+n)) in worst case | Space: O(m+n) for recursion stack
function isMatchBruteForce(s, p) {
  function backtrack(sIdx, pIdx) {
    // Base case: both pointers at the end
    if (pIdx === p.length) {
      return sIdx === s.length;
    }

    // If pattern char is '*', try all possibilities
    if (p[pIdx] === "*") {
      // Option 1: Match '*' to zero characters
      if (backtrack(sIdx, pIdx + 1)) {
        return true;
      }
      // Option 2: Match '*' to one or more characters
      if (sIdx < s.length && backtrack(sIdx + 1, pIdx)) {
        return true;
      }
      return false;
    }

    // If pattern char is '?' or matches current char
    if (sIdx < s.length && (p[pIdx] === "?" || p[pIdx] === s[sIdx])) {
      return backtrack(sIdx + 1, pIdx + 1);
    }

    return false;
  }

  return backtrack(0, 0);
}
```

```java
// Brute Force Recursive Solution
// Time: O(3^(m+n)) in worst case | Space: O(m+n) for recursion stack
public boolean isMatchBruteForce(String s, String p) {
    return backtrack(s, p, 0, 0);
}

private boolean backtrack(String s, String p, int sIdx, int pIdx) {
    // Base case: both pointers at the end
    if (pIdx == p.length()) {
        return sIdx == s.length();
    }

    // If pattern char is '*', try all possibilities
    if (p.charAt(pIdx) == '*') {
        // Option 1: Match '*' to zero characters
        if (backtrack(s, p, sIdx, pIdx + 1)) {
            return true;
        }
        // Option 2: Match '*' to one or more characters
        if (sIdx < s.length() && backtrack(s, p, sIdx + 1, pIdx)) {
            return true;
        }
        return false;
    }

    // If pattern char is '?' or matches current char
    if (sIdx < s.length() && (p.charAt(pIdx) == '?' || p.charAt(pIdx) == s.charAt(sIdx))) {
        return backtrack(s, p, sIdx + 1, pIdx + 1);
    }

    return false;
}
```

</div>

This brute force solution is too slow for longer strings because it explores redundant paths. For example, with pattern `"*********a"` (9 stars followed by 'a'), we'd explore all combinations of how many characters each star consumes.

## Optimized Approach

The key insight is that we can use dynamic programming to avoid redundant computations. Let's define `dp[i][j]` as whether the first `i` characters of `s` match the first `j` characters of `p`.

Transition rules:

1. If `p[j-1]` is `'*'`:
   - It can match zero characters: `dp[i][j] = dp[i][j-1]`
   - It can match one or more characters: `dp[i][j] = dp[i-1][j]` (if `i > 0`)
2. If `p[j-1]` is `'?'` or matches `s[i-1]`:
   - `dp[i][j] = dp[i-1][j-1]`

We initialize `dp[0][0] = True` (empty string matches empty pattern). For the first row (`i=0`, empty string), `dp[0][j]` is True only if all pattern characters up to `j` are `'*'`.

This approach reduces the time complexity to `O(m*n)` where `m` is string length and `n` is pattern length.

## Optimal Solution

Here's the complete dynamic programming solution with detailed comments:

<div class="code-group">

```python
# Dynamic Programming Solution
# Time: O(m*n) where m = len(s), n = len(p) | Space: O(m*n)
def isMatch(s: str, p: str) -> bool:
    m, n = len(s), len(p)

    # dp[i][j] = True if first i chars of s match first j chars of p
    dp = [[False] * (n + 1) for _ in range(m + 1)]

    # Base case: empty string matches empty pattern
    dp[0][0] = True

    # Handle patterns that start with '*' (can match empty string)
    for j in range(1, n + 1):
        if p[j-1] == '*':
            dp[0][j] = dp[0][j-1]

    # Fill the DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j-1] == '*':
                # '*' can match:
                # 1. Zero characters: dp[i][j-1]
                # 2. One or more characters: dp[i-1][j]
                dp[i][j] = dp[i][j-1] or dp[i-1][j]
            elif p[j-1] == '?' or p[j-1] == s[i-1]:
                # '?' matches any single char, or chars match exactly
                dp[i][j] = dp[i-1][j-1]
            # else: dp[i][j] remains False (default)

    return dp[m][n]
```

```javascript
// Dynamic Programming Solution
// Time: O(m*n) where m = s.length, n = p.length | Space: O(m*n)
function isMatch(s, p) {
  const m = s.length,
    n = p.length;

  // dp[i][j] = true if first i chars of s match first j chars of p
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(false));

  // Base case: empty string matches empty pattern
  dp[0][0] = true;

  // Handle patterns that start with '*' (can match empty string)
  for (let j = 1; j <= n; j++) {
    if (p[j - 1] === "*") {
      dp[0][j] = dp[0][j - 1];
    }
  }

  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === "*") {
        // '*' can match:
        // 1. Zero characters: dp[i][j-1]
        // 2. One or more characters: dp[i-1][j]
        dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
      } else if (p[j - 1] === "?" || p[j - 1] === s[i - 1]) {
        // '?' matches any single char, or chars match exactly
        dp[i][j] = dp[i - 1][j - 1];
      }
      // else: dp[i][j] remains false (default)
    }
  }

  return dp[m][n];
}
```

```java
// Dynamic Programming Solution
// Time: O(m*n) where m = s.length(), n = p.length() | Space: O(m*n)
public boolean isMatch(String s, String p) {
    int m = s.length(), n = p.length();

    // dp[i][j] = true if first i chars of s match first j chars of p
    boolean[][] dp = new boolean[m + 1][n + 1];

    // Base case: empty string matches empty pattern
    dp[0][0] = true;

    // Handle patterns that start with '*' (can match empty string)
    for (int j = 1; j <= n; j++) {
        if (p.charAt(j-1) == '*') {
            dp[0][j] = dp[0][j-1];
        }
    }

    // Fill the DP table
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (p.charAt(j-1) == '*') {
                // '*' can match:
                // 1. Zero characters: dp[i][j-1]
                // 2. One or more characters: dp[i-1][j]
                dp[i][j] = dp[i][j-1] || dp[i-1][j];
            } else if (p.charAt(j-1) == '?' || p.charAt(j-1) == s.charAt(i-1)) {
                // '?' matches any single char, or chars match exactly
                dp[i][j] = dp[i-1][j-1];
            }
            // else: dp[i][j] remains false (default)
        }
    }

    return dp[m][n];
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(m*n)` where `m` is the length of string `s` and `n` is the length of pattern `p`. We fill an `(m+1) × (n+1)` DP table, and each cell takes constant time to compute.

**Space Complexity:** `O(m*n)` for the DP table. We can optimize this to `O(n)` by only keeping two rows at a time since we only need the previous row to compute the current row. However, the `O(m*n)` solution is usually acceptable in interviews and is easier to understand.

## Common Mistakes

1. **Forgetting to handle consecutive `'*'` characters:** Multiple `'*'` in a row are equivalent to a single `'*'`, but our DP solution handles this correctly because `dp[i][j] = dp[i][j-1] or dp[i-1][j]` for each `'*'`.

2. **Incorrect base case initialization:** Many candidates forget that `'*'` can match the empty string. We need to initialize `dp[0][j] = True` for patterns like `"***"` that can match empty string.

3. **Off-by-one errors in indices:** Since we're using 1-based indexing in the DP table but 0-based indexing for strings, it's easy to mix up `s[i-1]` vs `s[i]`. Always be careful with the offset.

4. **Not considering the greedy two-pointer approach:** While DP is the most robust solution, there's also a greedy approach with backtracking that uses `O(1)` space. However, it's trickier to implement correctly and has `O(m*n)` worst-case time.

## When You'll See This Pattern

This pattern of using dynamic programming for string matching appears in several related problems:

1. **Regular Expression Matching (LeetCode #10):** Similar to wildcard matching but with more complex rules (`.` matches any character, `*` matches zero or more of the preceding element). The DP approach is very similar but with different transition rules.

2. **Edit Distance (LeetCode #72):** Uses a similar DP table to find the minimum operations to transform one string into another. The recurrence relation has similarities to our matching problem.

3. **Longest Common Subsequence (LeetCode #1143):** Another 2D DP problem on strings where `dp[i][j]` represents the LCS of the first `i` chars of `s1` and first `j` chars of `s2`.

The common thread is that when you need to match or compare two sequences with complex rules, a 2D DP table where `dp[i][j]` represents the state after processing the first `i` elements of one sequence and first `j` elements of another is often the right approach.

## Key Takeaways

1. **When you see pattern matching with special characters**, think about dynamic programming with a 2D table where `dp[i][j]` represents whether the first `i` characters of the string match the first `j` characters of the pattern.

2. **The recurrence relation depends on the pattern character:**
   - For `'*'`: `dp[i][j] = dp[i][j-1] or dp[i-1][j]`
   - For `'?'` or matching characters: `dp[i][j] = dp[i-1][j-1]`
   - Otherwise: `dp[i][j] = False`

3. **Pay special attention to base cases**, particularly when the string or pattern is empty. An empty pattern only matches an empty string, but a pattern with only `'*'` characters can match any string (including empty).

Related problems: [Regular Expression Matching](/problem/regular-expression-matching), [Substring Matching Pattern](/problem/substring-matching-pattern)
