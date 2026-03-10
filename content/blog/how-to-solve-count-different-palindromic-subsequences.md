---
title: "How to Solve Count Different Palindromic Subsequences — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Different Palindromic Subsequences. Hard difficulty, 47.5% acceptance rate. Topics: String, Dynamic Programming."
date: "2028-09-19"
category: "dsa-patterns"
tags: ["count-different-palindromic-subsequences", "string", "dynamic-programming", "hard"]
---

# How to Solve Count Different Palindromic Subsequences

This problem asks us to count all distinct non-empty palindromic subsequences in a given string `s`. A subsequence is obtained by deleting zero or more characters (but here, non-empty means at least one character), and it's palindromic if it reads the same forwards and backwards. The challenge is that we must count **distinct** palindromic subsequences, not all possible ones, and the result can be huge, so we return it modulo 10^9+7.

What makes this problem tricky:

1. We need to avoid counting duplicates while considering all possible subsequences.
2. A brute-force approach would generate all 2^n subsequences, which is infeasible for n up to 1000.
3. The "distinct" requirement means we can't just use standard palindromic subsequence counting DP—we need to track which palindromes we've already counted.

## Visual Walkthrough

Let's trace through a small example: `s = "bccb"`. We want to count distinct palindromic subsequences.

**Step 1: Identify all palindromic subsequences**

- Single characters: `"b"`, `"c"`, `"c"`, `"b"` → distinct: `{"b", "c"}`
- Length 2: `"bb"`, `"cc"`, `"bc"` (not palindrome), `"cb"` (not palindrome) → distinct: `{"bb", "cc"}`
- Length 3: `"bcb"`, `"ccb"` (not palindrome), `"bcc"` (not palindrome), `"ccb"` (not palindrome) → distinct: `{"bcb"}`
- Length 4: `"bccb"` → distinct: `{"bccb"}`

Total distinct palindromic subsequences: `{"b", "c", "bb", "cc", "bcb", "bccb"}` = 6.

**Step 2: Notice the pattern**
When we have matching characters at the ends of a substring, like `s[0] = 'b'` and `s[3] = 'b'` in `"bccb"`, we can form palindromes by:

1. Using just the two `'b'`s: `"bb"`
2. Using the two `'b'`s with what's between them: `"b" + (palindrome inside) + "b"`

But we must be careful not to double-count. For example, when the inner substring `"cc"` has its own palindromes (`"c"` and `"cc"`), adding `'b'` to both sides gives `"bcb"` and `"bccb"`. However, if the inner substring contains `'b'`, we might create duplicates.

This intuition leads us to a dynamic programming approach where `dp[i][j]` = number of distinct palindromic subsequences in `s[i..j]`.

## Brute Force Approach

A naive solution would generate all 2^n subsequences, check if each is a palindrome, and add it to a set to ensure uniqueness. This is clearly O(2^n \* n) time (checking each palindrome takes O(n)), which is impossible for n=1000.

Even a slightly better brute force using recursion:

- For each substring `s[i..j]`, we could recursively count palindromic subsequences.
- But without memoization, we'd recompute the same subproblems repeatedly.
- And we'd still struggle with the "distinct" requirement—we'd need to track actual palindromes, not just counts.

The brute force fails because:

1. Exponential time complexity
2. Difficulty handling "distinct" without storing all palindromes (exponential space)
3. No way to leverage overlapping subproblems efficiently

## Optimized Approach

The key insight is to use **dynamic programming with careful case analysis** when endpoints match. Let's define `dp[i][j]` as the number of distinct palindromic subsequences in `s[i..j]`.

**Base cases:** `dp[i][i] = 1` (single character is always a palindrome)

**Recurrence relation:**

1. If `s[i] != s[j]`:  
   `dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1]`  
   We add counts from both smaller substrings but subtract the overlap.

2. If `s[i] == s[j]`:  
   This is trickier. Let `c = s[i] = s[j]`. We need to count:
   - All palindromes from `s[i+1..j-1]`
   - Those same palindromes wrapped with `c` on both ends
   - Plus the two-character palindrome `"cc"`
   - Plus the single character `"c"` (if not already counted)

   But we must avoid duplicates! The critical observation:  
   Find the first index `left` > i where `s[left] == c`  
   Find the last index `right` < j where `s[right] == c`  
   Then:
   - If `left > right`: No `c` inside → add only `"cc"` and `"c"`
   - If `left == right`: Exactly one `c` inside → add `"c"` once
   - If `left < right`: Multiple `c`s inside → subtract duplicates from `s[left+1..right-1]`

   This gives us:  
   `dp[i][j] = 2 * dp[i+1][j-1] + (left > right ? 2 : left == right ? 1 : -dp[left+1][right-1])`

**Why this works:**  
When endpoints match, we can:

1. Take any palindrome inside `s[i+1..j-1]` as is (first `dp[i+1][j-1]`)
2. Wrap each of those with `c` on both ends (another `dp[i+1][j-1]`)
3. Add `"c"` and `"cc"` (the +2 case)
4. But if there are `c`s inside, some palindromes are already counted with `c` wrappings, so we adjust.

The indices `left` and `right` help us find how many distinct palindromes starting/ending with `c` are already in the inner substring, so we don't double-count.

## Optimal Solution

We implement this with DP, precomputing `next` and `prev` arrays to quickly find `left` and `right` for any `(i, j)` pair.

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n^2)
class Solution:
    def countPalindromicSubsequences(self, s: str) -> int:
        MOD = 10**9 + 7
        n = len(s)

        # dp[i][j] = number of distinct palindromic subsequences in s[i..j]
        dp = [[0] * n for _ in range(n)]

        # Base case: single characters
        for i in range(n):
            dp[i][i] = 1

        # Precompute next and prev arrays for each position and character
        # next[i][c]: next index >= i with character c
        # prev[i][c]: previous index <= i with character c
        next_pos = [[-1] * 4 for _ in range(n)]
        prev_pos = [[-1] * 4 for _ in range(n)]

        # Map characters to indices 0-3 (only 'a', 'b', 'c', 'd' per constraints)
        char_to_idx = {ch: i for i, ch in enumerate('abcd')}

        # Initialize last seen positions
        last = [-1] * 4
        for i in range(n):
            idx = char_to_idx[s[i]]
            last[idx] = i
            for c in range(4):
                prev_pos[i][c] = last[c]

        # Reset for next computation
        last = [-1] * 4
        for i in range(n-1, -1, -1):
            idx = char_to_idx[s[i]]
            last[idx] = i
            for c in range(4):
                next_pos[i][c] = last[c]

        # Fill DP table for increasing lengths
        for length in range(2, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1

                if s[i] != s[j]:
                    # Add both smaller substrings, subtract overlap
                    dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1]
                else:
                    c_idx = char_to_idx[s[i]]
                    left = next_pos[i+1][c_idx]  # first same char after i
                    right = prev_pos[j-1][c_idx] # last same char before j

                    if left == -1 or right == -1 or left > right:
                        # No same character inside
                        # Inner palindromes + each wrapped with s[i] + "s[i]s[i]"
                        dp[i][j] = 2 * dp[i+1][j-1] + 2
                    elif left == right:
                        # Exactly one same character inside
                        # That character is already counted as single char palindrome
                        # So we add 1 instead of 2 for the single character case
                        dp[i][j] = 2 * dp[i+1][j-1] + 1
                    else:
                        # Multiple same characters inside
                        # Subtract palindromes counted twice (those inside left+1..right-1)
                        dp[i][j] = 2 * dp[i+1][j-1] - dp[left+1][right-1]

                # Handle modulo and negative values
                dp[i][j] %= MOD
                if dp[i][j] < 0:
                    dp[i][j] += MOD

        return dp[0][n-1]
```

```javascript
// Time: O(n^2) | Space: O(n^2)
var countPalindromicSubsequences = function (s) {
  const MOD = 1000000007;
  const n = s.length;

  // dp[i][j] = number of distinct palindromic subsequences in s[i..j]
  const dp = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  // Base case: single characters
  for (let i = 0; i < n; i++) {
    dp[i][i] = 1;
  }

  // Precompute next and prev arrays
  const next = Array(n)
    .fill()
    .map(() => Array(4).fill(-1));
  const prev = Array(n)
    .fill()
    .map(() => Array(4).fill(-1));

  // Map characters to indices
  const charToIdx = { a: 0, b: 1, c: 2, d: 3 };

  // Fill prev array (closest same character to the left)
  const last = [-1, -1, -1, -1];
  for (let i = 0; i < n; i++) {
    const idx = charToIdx[s[i]];
    last[idx] = i;
    for (let c = 0; c < 4; c++) {
      prev[i][c] = last[c];
    }
  }

  // Fill next array (closest same character to the right)
  last.fill(-1);
  for (let i = n - 1; i >= 0; i--) {
    const idx = charToIdx[s[i]];
    last[idx] = i;
    for (let c = 0; c < 4; c++) {
      next[i][c] = last[c];
    }
  }

  // Fill DP table for increasing substring lengths
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;

      if (s[i] !== s[j]) {
        // s[i] != s[j]: combine counts from smaller substrings
        dp[i][j] = dp[i + 1][j] + dp[i][j - 1] - dp[i + 1][j - 1];
      } else {
        const c = charToIdx[s[i]];
        const left = next[i + 1][c]; // first same char after i
        const right = prev[j - 1][c]; // last same char before j

        if (left === -1 || right === -1 || left > right) {
          // No same character between i and j
          // All inner palindromes can be wrapped with s[i]
          // Plus "s[i]" and "s[i]s[i]"
          dp[i][j] = 2 * dp[i + 1][j - 1] + 2;
        } else if (left === right) {
          // Exactly one same character in between
          // The single character palindrome is already counted
          dp[i][j] = 2 * dp[i + 1][j - 1] + 1;
        } else {
          // Multiple same characters inside
          // Subtract duplicates from s[left+1..right-1]
          dp[i][j] = 2 * dp[i + 1][j - 1] - dp[left + 1][right - 1];
        }
      }

      // Handle modulo and negative values
      dp[i][j] %= MOD;
      if (dp[i][j] < 0) {
        dp[i][j] += MOD;
      }
    }
  }

  return dp[0][n - 1];
};
```

```java
// Time: O(n^2) | Space: O(n^2)
class Solution {
    public int countPalindromicSubsequences(String s) {
        final int MOD = 1000000007;
        int n = s.length();

        // dp[i][j] = number of distinct palindromic subsequences in s[i..j]
        int[][] dp = new int[n][n];

        // Base case: single characters
        for (int i = 0; i < n; i++) {
            dp[i][i] = 1;
        }

        // Precompute next and prev arrays
        int[][] next = new int[n][4];
        int[][] prev = new int[n][4];

        // Initialize with -1
        for (int i = 0; i < n; i++) {
            Arrays.fill(next[i], -1);
            Arrays.fill(prev[i], -1);
        }

        // Map characters to indices
        int[] last = new int[4];
        Arrays.fill(last, -1);

        // Fill prev array (closest same character to the left)
        for (int i = 0; i < n; i++) {
            int idx = s.charAt(i) - 'a';
            last[idx] = i;
            for (int c = 0; c < 4; c++) {
                prev[i][c] = last[c];
            }
        }

        // Fill next array (closest same character to the right)
        Arrays.fill(last, -1);
        for (int i = n - 1; i >= 0; i--) {
            int idx = s.charAt(i) - 'a';
            last[idx] = i;
            for (int c = 0; c < 4; c++) {
                next[i][c] = last[c];
            }
        }

        // Fill DP table for increasing substring lengths
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;

                if (s.charAt(i) != s.charAt(j)) {
                    // s[i] != s[j]: combine counts from smaller substrings
                    dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1];
                } else {
                    int c = s.charAt(i) - 'a';
                    int left = next[i+1][c];  // first same char after i
                    int right = prev[j-1][c]; // last same char before j

                    if (left == -1 || right == -1 || left > right) {
                        // No same character between i and j
                        dp[i][j] = 2 * dp[i+1][j-1] + 2;
                    } else if (left == right) {
                        // Exactly one same character in between
                        dp[i][j] = 2 * dp[i+1][j-1] + 1;
                    } else {
                        // Multiple same characters inside
                        dp[i][j] = 2 * dp[i+1][j-1] - dp[left+1][right-1];
                    }
                }

                // Handle modulo and negative values
                dp[i][j] %= MOD;
                if (dp[i][j] < 0) {
                    dp[i][j] += MOD;
                }
            }
        }

        return dp[0][n-1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- We fill an n×n DP table: O(n²) subproblems
- For each subproblem, we do O(1) work (thanks to precomputed `next` and `prev` arrays)
- Precomputing `next` and `prev` arrays takes O(4n) = O(n) time
- Total: O(n²)

**Space Complexity:** O(n²)

- The DP table is n×n: O(n²)
- The `next` and `prev` arrays are n×4 each: O(n)
- Total: O(n²) dominated by the DP table

## Common Mistakes

1. **Forgetting to handle negative values after subtraction**  
   When we do `dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1]`, the result can be negative due to modulo arithmetic. Always check and add MOD if negative.

2. **Incorrectly handling the case when endpoints match**  
   The three cases (no inner matching char, exactly one, multiple) must be handled carefully. A common error is always adding 2 when `s[i] == s[j]`, which overcounts when there are matching characters inside.

3. **Not using modulo properly**  
   The result can be huge, so apply modulo after each addition/subtraction. But be careful: `(a - b) % MOD` can be negative in some languages, so we need `((a - b) % MOD + MOD) % MOD`.

4. **Confusing subsequences with substrings**  
   Remember: subsequences can skip characters, substrings cannot. This affects how we combine counts from smaller subproblems.

## When You'll See This Pattern

This problem uses **interval DP** (dynamic programming on substrings/intervals) with **precomputed indices** for optimization. You'll see similar patterns in:

1. **Longest Palindromic Subsequence (LeetCode 516)**  
   Also uses interval DP where `dp[i][j]` represents the LPS length in `s[i..j]`. The recurrence is simpler since we don't need to track distinct sequences.

2. **Palindrome Partitioning II (LeetCode 132)**  
   Uses DP to find minimum cuts for palindrome partitioning, often with precomputed palindrome table.

3. **Count Different Palindromic Substrings (not subsequences)**  
   A variant where we count distinct palindromic substrings (contiguous), which can be solved with Manacher's algorithm.

The core pattern: when a problem asks about properties of all substrings/subsequences, especially palindromic properties, interval DP is often the solution.

## Key Takeaways

1. **Interval DP is powerful for substring/subsequence problems**  
   Define `dp[i][j]` as the answer for substring `s[i..j]`, then build from shorter to longer substrings.

2. **Precomputation can optimize DP transitions**  
   Here, precomputing `next` and `prev` arrays lets us find matching characters in O(1) time instead of O(n) during DP.

3. **Handle edge cases in recurrence relations carefully**  
   When endpoints match, the three cases (no inner match, one inner match, multiple inner matches) must be distinguished to avoid double-counting.

Related problems: [Longest Palindromic Subsequence](/problem/longest-palindromic-subsequence), [Count Palindromic Subsequences](/problem/count-palindromic-subsequences)
