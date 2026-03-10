---
title: "How to Solve Scramble String — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Scramble String. Hard difficulty, 43.9% acceptance rate. Topics: String, Dynamic Programming."
date: "2027-12-27"
category: "dsa-patterns"
tags: ["scramble-string", "string", "dynamic-programming", "hard"]
---

# How to Solve Scramble String

The Scramble String problem asks us to determine if one string can be transformed into another through a specific recursive scrambling operation. What makes this problem particularly tricky is that it's not about simple character rearrangements—it's about recursively splitting strings and potentially swapping the resulting halves, which creates a complex tree of possible transformations that we need to efficiently explore.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we have `s = "great"` and `t = "rgeat"`. We need to determine if `t` is a scrambled version of `s`.

The scrambling process works like this:

1. Start with `"great"`
2. Split at index 1: `"g"` and `"reat"`
3. We could either:
   - Keep the order: scramble `"g"` and `"reat"` separately
   - Swap the halves: scramble `"reat"` and `"g"` separately

Let's see if `"rgeat"` could come from `"great"`:

- Split `"great"` at index 2: `"gr"` and `"eat"`
- If we swap these halves, we get `"eat"` + `"gr"` = `"eatgr"`
- That's not `"rgeat"`, so let's try another split

Actually, let's think recursively:

- `"great"` split at index 2 → `"gr"` and `"eat"`
- For `"rgeat"` to match, we need either:
  1. `"rg"` is scrambled from `"gr"` AND `"eat"` is scrambled from `"eat"` (no swap)
  2. `"eat"` is scrambled from `"gr"` AND `"rg"` is scrambled from `"eat"` (with swap)

Option 1 looks promising: `"eat"` equals `"eat"`, and `"rg"` is a scramble of `"gr"` (split `"gr"` at index 1, swap to get `"rg"`).

This recursive checking with potential swapping at each level is the core of the problem.

## Brute Force Approach

The most straightforward approach is to implement the scrambling definition directly through recursion. For strings `s` and `t`:

1. If `s == t`, return true (base case)
2. If the sorted characters of `s` and `t` don't match, return false (pruning)
3. For every possible split point `i` from 1 to `len(s)-1`:
   - Check if `s[0:i]` scrambles to `t[0:i]` AND `s[i:]` scrambles to `t[i:]` (no swap case)
   - OR if `s[0:i]` scrambles to `t[len-i:]` AND `s[i:]` scrambles to `t[0:len-i]` (swap case)

This brute force solution has exponential time complexity because at each level we're making up to `n-1` splits, and for each split we're making two recursive calls. The time complexity is roughly O(5ⁿ) in the worst case (similar to the Catalan number growth).

The key insight is that we're recomputing the same subproblems many times. For example, when checking different split points, we might check if `"ab"` scrambles to `"ba"` multiple times.

## Optimized Approach

The optimal solution uses memoization (top-down dynamic programming) to avoid redundant computations. We store results for `(s, t)` pairs in a dictionary so we don't recompute them.

The key optimizations are:

1. **Early pruning**: If `s` and `t` have different lengths or different character counts, they can't be scrambles
2. **Memoization**: Store computed results for `(s, t)` to avoid exponential blowup
3. **Smart splitting**: We only need to check splits where the character counts match on both sides

The most efficient implementation uses a 3D DP table where `dp[i][j][k]` represents whether the substring of `s` starting at `i` and the substring of `t` starting at `j`, both of length `k`, are scrambles. This bottom-up approach has better constant factors but is harder to implement correctly.

## Optimal Solution

Here's the memoized recursive solution that's most intuitive for interviews:

<div class="code-group">

```python
# Time: O(n^4) worst case, but much better with memoization | Space: O(n^3) for memoization
class Solution:
    def isScramble(self, s1: str, s2: str) -> bool:
        # Memoization dictionary: (i, j, length) -> bool
        memo = {}

        def dfs(i: int, j: int, length: int) -> bool:
            """Check if s1[i:i+length] is a scramble of s2[j:j+length]"""
            # Check memo first
            if (i, j, length) in memo:
                return memo[(i, j, length)]

            # Base case: substrings are equal
            if s1[i:i+length] == s2[j:j+length]:
                memo[(i, j, length)] = True
                return True

            # Pruning: check character frequencies
            freq = [0] * 26
            for k in range(length):
                freq[ord(s1[i+k]) - ord('a')] += 1
                freq[ord(s2[j+k]) - ord('a')] -= 1

            # If any character count is non-zero, strings can't be scrambles
            if any(count != 0 for count in freq):
                memo[(i, j, length)] = False
                return False

            # Try all possible split points
            for k in range(1, length):
                # Case 1: No swap - left part of s1 matches left part of s2
                if dfs(i, j, k) and dfs(i+k, j+k, length-k):
                    memo[(i, j, length)] = True
                    return True

                # Case 2: With swap - left part of s1 matches right part of s2
                if dfs(i, j+length-k, k) and dfs(i+k, j, length-k):
                    memo[(i, j, length)] = True
                    return True

            # No split worked
            memo[(i, j, length)] = False
            return False

        # Edge case: different lengths can't be scrambles
        if len(s1) != len(s2):
            return False

        return dfs(0, 0, len(s1))
```

```javascript
// Time: O(n^4) worst case, but much better with memoization | Space: O(n^3) for memoization
var isScramble = function (s1, s2) {
  // Memoization map: key = i + ":" + j + ":" + length
  const memo = new Map();

  function dfs(i, j, length) {
    // Check memo first
    const key = i + ":" + j + ":" + length;
    if (memo.has(key)) {
      return memo.get(key);
    }

    // Base case: substrings are equal
    if (s1.substring(i, i + length) === s2.substring(j, j + length)) {
      memo.set(key, true);
      return true;
    }

    // Pruning: check character frequencies
    const freq = new Array(26).fill(0);
    for (let k = 0; k < length; k++) {
      freq[s1.charCodeAt(i + k) - 97]++; // 'a' = 97
      freq[s2.charCodeAt(j + k) - 97]--;
    }

    // If any character count is non-zero, strings can't be scrambles
    if (freq.some((count) => count !== 0)) {
      memo.set(key, false);
      return false;
    }

    // Try all possible split points
    for (let k = 1; k < length; k++) {
      // Case 1: No swap - left part of s1 matches left part of s2
      if (dfs(i, j, k) && dfs(i + k, j + k, length - k)) {
        memo.set(key, true);
        return true;
      }

      // Case 2: With swap - left part of s1 matches right part of s2
      if (dfs(i, j + length - k, k) && dfs(i + k, j, length - k)) {
        memo.set(key, true);
        return true;
      }
    }

    // No split worked
    memo.set(key, false);
    return false;
  }

  // Edge case: different lengths can't be scrambles
  if (s1.length !== s2.length) {
    return false;
  }

  return dfs(0, 0, s1.length);
};
```

```java
// Time: O(n^4) worst case, but much better with memoization | Space: O(n^3) for memoization
class Solution {
    // Memoization map: key = i + ":" + j + ":" + length
    private Map<String, Boolean> memo = new HashMap<>();

    public boolean isScramble(String s1, String s2) {
        // Edge case: different lengths can't be scrambles
        if (s1.length() != s2.length()) {
            return false;
        }

        return dfs(s1, s2, 0, 0, s1.length());
    }

    private boolean dfs(String s1, String s2, int i, int j, int length) {
        String key = i + ":" + j + ":" + length;

        // Check memo first
        if (memo.containsKey(key)) {
            return memo.get(key);
        }

        // Base case: substrings are equal
        if (s1.substring(i, i + length).equals(s2.substring(j, j + length))) {
            memo.put(key, true);
            return true;
        }

        // Pruning: check character frequencies
        int[] freq = new int[26];
        for (int k = 0; k < length; k++) {
            freq[s1.charAt(i + k) - 'a']++;
            freq[s2.charAt(j + k) - 'a']--;
        }

        // If any character count is non-zero, strings can't be scrambles
        for (int count : freq) {
            if (count != 0) {
                memo.put(key, false);
                return false;
            }
        }

        // Try all possible split points
        for (int k = 1; k < length; k++) {
            // Case 1: No swap - left part of s1 matches left part of s2
            if (dfs(s1, s2, i, j, k) && dfs(s1, s2, i + k, j + k, length - k)) {
                memo.put(key, true);
                return true;
            }

            // Case 2: With swap - left part of s1 matches right part of s2
            if (dfs(s1, s2, i, j + length - k, k) && dfs(s1, s2, i + k, j, length - k)) {
                memo.put(key, true);
                return true;
            }
        }

        // No split worked
        memo.put(key, false);
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n⁴) in the worst case, but with memoization it's much better in practice. Here's why:

- We have n³ possible states (i, j, length)
- For each state, we check up to n splits
- For each split, we make O(n) time for frequency check
- So worst case is O(n³ × n × n) = O(n⁵), but with memoization it reduces to O(n⁴)

**Space Complexity**: O(n³) for the memoization storage. We store results for all possible (i, j, length) combinations.

## Common Mistakes

1. **Forgetting the character frequency check**: Without this pruning, the algorithm will waste time exploring impossible scrambles. Always check if two strings have the same character counts before attempting to scramble them.

2. **Incorrect indexing in the swap case**: When checking the "swap" scenario, it's easy to mess up the indices. Remember: if we split at position k, then:
   - No swap: compare s1[0:k] with t[0:k] AND s1[k:] with t[k:]
   - With swap: compare s1[0:k] with t[n-k:] AND s1[k:] with t[0:n-k]

3. **Not handling the base case properly**: The base case should be when the substrings are equal, not just when length == 1. A length 1 substring that doesn't match should return false.

4. **Using string concatenation for memoization keys**: In Java/JavaScript, avoid building long strings for memo keys. Use a 3D array or a custom key object for better performance with large inputs.

## When You'll See This Pattern

The Scramble String problem uses **interval DP** (dynamic programming on substrings/intervals), which appears in several other problems:

1. **Matrix Chain Multiplication** (LeetCode 1547) - Similar recursive splitting with optimization
2. **Burst Balloons** (LeetCode 312) - DP on intervals with different split combinations
3. **Palindrome Partitioning II** (LeetCode 132) - Checking palindrome properties on substrings

The pattern to recognize: when a problem involves operations on substrings/subarrays where the solution for a larger interval depends on solutions for smaller intervals, interval DP is often the right approach.

## Key Takeaways

1. **Interval DP problems often involve checking all possible split points** within a range and combining results from both sides. The scramble operation (with or without swap) is a classic example of this pattern.

2. **Memoization is crucial for exponential recursive problems**. If you find yourself writing a recursive solution that explores multiple possibilities at each step, always consider whether you're recomputing the same subproblems.

3. **Pruning early saves exponential time**. The character frequency check in this problem reduces the search space dramatically. Always look for quick rejection criteria before diving into expensive computations.

[Practice this problem on CodeJeet](/problem/scramble-string)
