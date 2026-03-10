---
title: "How to Solve Find All Good Strings — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find All Good Strings. Hard difficulty, 45.1% acceptance rate. Topics: String, Dynamic Programming, String Matching."
date: "2026-06-14"
category: "dsa-patterns"
tags: ["find-all-good-strings", "string", "dynamic-programming", "string-matching", "hard"]
---

# How to Solve "Find All Good Strings"

This problem asks us to count strings of length `n` that fall alphabetically between `s1` and `s2`, while also avoiding a forbidden substring `evil`. The challenge comes from combining three constraints: length, alphabetical bounds, and substring exclusion. A naive enumeration would be impossible for larger `n`, requiring a smarter counting approach.

## Visual Walkthrough

Let's trace through a small example: `n = 3`, `s1 = "aab"`, `s2 = "aac"`, `evil = "ab"`.

We need to count all 3-letter strings between `"aab"` and `"aac"` (inclusive) that don't contain `"ab"`:

1. **"aab"** - Contains `"ab"` (positions 1-2) ❌
2. **"aac"** - Doesn't contain `"ab"` ✅

That's only one valid string. But let's think about the counting process systematically:

We need to consider strings position by position:

- First character: Must be `'a'` (since both bounds start with `'a'`)
- Second character: Can be `'a'` or `'b'` depending on bounds
- Third character: Constrained by the second character and bounds

The tricky part is tracking whether we've started matching `evil` while building the string. For example:

- If we have `"aa"` so far, we've matched `""` of `evil`
- If we have `"ab"` so far, we've fully matched `evil` and should reject

This suggests we need to track our progress in matching `evil` as we build the string character by character.

## Brute Force Approach

A brute force solution would generate all possible strings of length `n` using the alphabet (26 letters), check if each falls between `s1` and `s2`, and check if it contains `evil`.

**Why this fails:**

- There are 26ⁿ possible strings. For `n = 100`, that's 26¹⁰⁰ ≈ 10¹⁴¹ possibilities.
- Even with pruning using the bounds, the search space is still exponential.
- Checking each string for the `evil` substring takes O(n) time, making it O(n × 26ⁿ) overall.

This is computationally impossible for any non-trivial `n`.

## Optimized Approach

The key insight is to use **digit DP (Dynamic Programming) with KMP automaton**:

1. **Digit DP pattern**: Count numbers/strings within bounds by processing digit-by-digit while tracking:
   - Whether we're still matching the lower bound (`tight_low`)
   - Whether we're still matching the upper bound (`tight_high`)
   - This lets us count valid strings without enumerating them all

2. **KMP for evil matching**: As we build the string, we need to know how much of `evil` we've matched so far. The KMP failure function tells us, for each state (how much of `evil` is matched) and next character, what the next state should be.

3. **DP state**: `dp[pos][evil_state][tight_low][tight_high]` = number of ways to build the suffix starting at position `pos`, given:
   - `evil_state`: How many characters of `evil` we've matched so far (0 to m, where m = len(evil))
   - `tight_low`: Whether we're still forced to match `s1` from this position onward
   - `tight_high`: Whether we're still forced to match `s2` from this position onward

4. **Transition**: For each possible next character (constrained by tight conditions), compute:
   - New evil state using KMP transition
   - New tight flags based on whether we're still matching bounds
   - Skip if new evil state reaches full match (m)

5. **Result**: We compute `count(s2) - count(s1-1)`, where `count(s)` counts good strings ≤ `s`. To get `s1-1`, we decrement `s1` as if it were a number in base 26.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * m * 4 * 26) where n = length, m = len(evil)
# Space: O(n * m * 4) for DP table
class Solution:
    def findGoodStrings(self, n: int, s1: str, s2: str, evil: str) -> int:
        MOD = 10**9 + 7
        m = len(evil)

        # Build KMP failure function for evil string
        # lps[i] = length of longest proper prefix of evil[0:i+1] that is also a suffix
        lps = [0] * m
        length = 0
        i = 1
        while i < m:
            if evil[i] == evil[length]:
                length += 1
                lps[i] = length
                i += 1
            else:
                if length != 0:
                    length = lps[length - 1]
                else:
                    lps[i] = 0
                    i += 1

        # Precompute KMP transition table
        # kmp_transition[state][char] = next state when at state `state` and adding character `char`
        kmp_transition = [[0] * 26 for _ in range(m)]
        for state in range(m):
            for c in range(26):
                char = chr(ord('a') + c)
                if state < m and char == evil[state]:
                    # Character matches, move to next state
                    kmp_transition[state][c] = state + 1
                else:
                    # Use KMP failure function to find next state
                    j = state
                    while j > 0 and char != evil[j]:
                        j = lps[j - 1]
                    if char == evil[j]:
                        j += 1
                    kmp_transition[state][c] = j

        # Memoized DFS function
        # pos: current position in string (0 to n)
        # evil_state: how much of evil is matched (0 to m, m means evil found)
        # tight_low: whether we're still matching s1 from this position
        # tight_high: whether we're still matching s2 from this position
        from functools import lru_cache

        @lru_cache(None)
        def dfs(pos, evil_state, tight_low, tight_high):
            # If we've fully matched evil, this path is invalid
            if evil_state == m:
                return 0
            # If we've built a complete string of length n
            if pos == n:
                return 1

            # Determine the range of characters we can choose at this position
            low_char = ord(s1[pos]) if tight_low else ord('a')
            high_char = ord(s2[pos]) if tight_high else ord('z')

            total = 0
            # Try each possible character in the allowed range
            for c_code in range(low_char, high_char + 1):
                char = chr(c_code)
                char_idx = ord(char) - ord('a')

                # Calculate new evil state using KMP transition
                new_evil_state = kmp_transition[evil_state][char_idx]

                # Calculate new tight flags
                # Still tight with lower bound if we were tight before AND chose the minimum allowed character
                new_tight_low = tight_low and (char == s1[pos])
                # Still tight with upper bound if we were tight before AND chose the maximum allowed character
                new_tight_high = tight_high and (char == s2[pos])

                # Recurse to next position
                total = (total + dfs(pos + 1, new_evil_state, new_tight_low, new_tight_high)) % MOD

            return total

        # Count good strings ≤ s2
        count_s2 = dfs(0, 0, True, True)

        # We need to subtract strings < s1. To do this, we decrement s1.
        # Convert s1 to a list of characters for decrement operation
        s1_list = list(s1)
        i = n - 1
        while i >= 0 and s1_list[i] == 'a':
            s1_list[i] = 'z'
            i -= 1
        if i >= 0:
            s1_list[i] = chr(ord(s1_list[i]) - 1)
        else:
            # s1 is "a"*n, so s1-1 is empty string (count = 0)
            return count_s2 % MOD

        s1_minus_one = ''.join(s1_list)

        # Clear memoization cache for new upper bound
        dfs.cache_clear()

        # Count good strings ≤ (s1 - 1)
        count_s1_minus_one = dfs(0, 0, True, True)

        # Final answer: count(s2) - count(s1-1)
        return (count_s2 - count_s1_minus_one) % MOD
```

```javascript
// Time: O(n * m * 4 * 26) where n = length, m = len(evil)
// Space: O(n * m * 4) for DP memoization
/**
 * @param {number} n
 * @param {string} s1
 * @param {string} s2
 * @param {string} evil
 * @return {number}
 */
var findGoodStrings = function (n, s1, s2, evil) {
  const MOD = 10 ** 9 + 7;
  const m = evil.length;

  // Build KMP failure function (Longest Prefix Suffix)
  const lps = new Array(m).fill(0);
  let len = 0;
  let i = 1;
  while (i < m) {
    if (evil[i] === evil[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  // Precompute KMP transition table
  // transition[state][charIndex] = next state
  const transition = Array.from({ length: m }, () => new Array(26).fill(0));
  for (let state = 0; state < m; state++) {
    for (let c = 0; c < 26; c++) {
      const char = String.fromCharCode("a".charCodeAt(0) + c);
      if (state < m && char === evil[state]) {
        // Exact match, advance state
        transition[state][c] = state + 1;
      } else {
        // Use KMP failure function
        let j = state;
        while (j > 0 && char !== evil[j]) {
          j = lps[j - 1];
        }
        if (char === evil[j]) {
          j++;
        }
        transition[state][c] = j;
      }
    }
  }

  // Memoization cache
  const memo = new Map();

  // DFS function to count valid strings
  function dfs(pos, evilState, tightLow, tightHigh) {
    // If evil is fully matched, invalid path
    if (evilState === m) return 0;
    // If we've built a complete string
    if (pos === n) return 1;

    // Create memoization key
    const key = `${pos},${evilState},${tightLow},${tightHigh}`;
    if (memo.has(key)) return memo.get(key);

    // Determine character bounds for current position
    const lowChar = tightLow ? s1.charCodeAt(pos) : "a".charCodeAt(0);
    const highChar = tightHigh ? s2.charCodeAt(pos) : "z".charCodeAt(0);

    let total = 0;
    // Try each character in the allowed range
    for (let c = lowChar; c <= highChar; c++) {
      const char = String.fromCharCode(c);
      const charIndex = c - "a".charCodeAt(0);

      // Calculate new evil state
      const newEvilState = transition[evilState][charIndex];

      // Calculate new tight flags
      const newTightLow = tightLow && char === s1[pos];
      const newTightHigh = tightHigh && char === s2[pos];

      // Recurse to next position
      total = (total + dfs(pos + 1, newEvilState, newTightLow, newTightHigh)) % MOD;
    }

    memo.set(key, total);
    return total;
  }

  // Count strings ≤ s2
  const countS2 = dfs(0, 0, true, true);

  // Decrement s1 to get s1 - 1
  let s1MinusOne = s1.split("");
  let idx = n - 1;
  while (idx >= 0 && s1MinusOne[idx] === "a") {
    s1MinusOne[idx] = "z";
    idx--;
  }
  if (idx >= 0) {
    s1MinusOne[idx] = String.fromCharCode(s1MinusOne[idx].charCodeAt(0) - 1);
  } else {
    // s1 is "a"*n, so s1-1 is empty
    return countS2 % MOD;
  }

  s1MinusOne = s1MinusOne.join("");

  // Clear memoization for new calculation
  memo.clear();

  // Update s2 to s1-1 for the second count
  const originalS2 = s2;
  s2 = s1MinusOne;

  // Count strings ≤ (s1 - 1)
  const countS1MinusOne = dfs(0, 0, true, true);

  // Restore original s2
  s2 = originalS2;

  // Final result: count(s2) - count(s1-1)
  return (countS2 - countS1MinusOne + MOD) % MOD;
};
```

```java
// Time: O(n * m * 4 * 26) where n = length, m = len(evil)
// Space: O(n * m * 4) for DP memoization
class Solution {
    private static final int MOD = 1000000007;
    private int n, m;
    private String s1, s2, evil;
    private int[][] transition;
    private Long[][][][] memo;

    public int findGoodStrings(int n, String s1, String s2, String evil) {
        this.n = n;
        this.s1 = s1;
        this.s2 = s2;
        this.evil = evil;
        this.m = evil.length();

        // Build KMP failure function
        int[] lps = new int[m];
        int len = 0;
        int i = 1;
        while (i < m) {
            if (evil.charAt(i) == evil.charAt(len)) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }

        // Precompute KMP transition table
        transition = new int[m][26];
        for (int state = 0; state < m; state++) {
            for (int c = 0; c < 26; c++) {
                char ch = (char)('a' + c);
                if (state < m && ch == evil.charAt(state)) {
                    transition[state][c] = state + 1;
                } else {
                    int j = state;
                    while (j > 0 && ch != evil.charAt(j)) {
                        j = lps[j - 1];
                    }
                    if (ch == evil.charAt(j)) {
                        j++;
                    }
                    transition[state][c] = j;
                }
            }
        }

        // Initialize memoization table
        memo = new Long[n + 1][m + 1][2][2];

        // Count strings ≤ s2
        long countS2 = dfs(0, 0, 1, 1);

        // Decrement s1 to get s1 - 1
        char[] s1Arr = s1.toCharArray();
        int idx = n - 1;
        while (idx >= 0 && s1Arr[idx] == 'a') {
            s1Arr[idx] = 'z';
            idx--;
        }
        if (idx >= 0) {
            s1Arr[idx]--;
        } else {
            // s1 is "a"*n, so s1-1 is empty
            return (int)(countS2 % MOD);
        }

        String s1MinusOne = new String(s1Arr);

        // Reset memoization for new calculation
        memo = new Long[n + 1][m + 1][2][2];
        this.s2 = s1MinusOne;

        // Count strings ≤ (s1 - 1)
        long countS1MinusOne = dfs(0, 0, 1, 1);

        // Final result: count(s2) - count(s1-1)
        long result = (countS2 - countS1MinusOne) % MOD;
        if (result < 0) result += MOD;
        return (int)result;
    }

    private long dfs(int pos, int evilState, int tightLow, int tightHigh) {
        // If evil is fully matched, invalid path
        if (evilState == m) return 0;
        // If we've built a complete string
        if (pos == n) return 1;

        // Check memoization
        if (memo[pos][evilState][tightLow][tightHigh] != null) {
            return memo[pos][evilState][tightLow][tightHigh];
        }

        // Determine character bounds
        char lowChar = tightLow == 1 ? s1.charAt(pos) : 'a';
        char highChar = tightHigh == 1 ? s2.charAt(pos) : 'z';

        long total = 0;
        // Try each character in the allowed range
        for (char c = lowChar; c <= highChar; c++) {
            int charIndex = c - 'a';

            // Calculate new evil state
            int newEvilState = transition[evilState][charIndex];

            // Calculate new tight flags
            int newTightLow = (tightLow == 1 && c == s1.charAt(pos)) ? 1 : 0;
            int newTightHigh = (tightHigh == 1 && c == s2.charAt(pos)) ? 1 : 0;

            // Recurse to next position
            total = (total + dfs(pos + 1, newEvilState, newTightLow, newTightHigh)) % MOD;
        }

        memo[pos][evilState][tightLow][tightHigh] = total;
        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m × 4 × 26)

- `n`: length of strings to build
- `m`: length of evil string
- `4`: combinations of tight_low and tight_high flags (2 × 2)
- `26`: possible characters at each position
- The KMP preprocessing takes O(m × 26) time, which is dominated by the DP

**Space Complexity:** O(n × m × 4)

- For the memoization table storing results for each (pos, evil_state, tight_low, tight_high) combination
- The KMP transition table uses O(m × 26) space

## Common Mistakes

1. **Forgetting to handle the "s1-1" case properly**: When computing `count(s2) - count(s1-1)`, candidates often forget that strings are inclusive of both bounds. The subtraction should exclude strings strictly less than s1, not ≤ s1.

2. **Incorrect KMP transition logic**: The KMP failure function must be applied correctly when a character doesn't match. A common error is resetting to state 0 instead of using the failure function to find the longest prefix that is also a suffix.

3. **Not resetting memoization between counts**: When computing `count(s1-1)`, we need to clear the memoization cache because the upper bound changes from s2 to s1-1.

4. **Integer overflow without modulo**: The counts can be huge (26¹⁰⁰), so we must apply modulo operations at each addition to prevent overflow.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Digit DP**: Used in problems like:
   - [902. Numbers At Most N Given Digit Set](https://leetcode.com/problems/numbers-at-most-n-given-digit-set/) - Count numbers with digit constraints
   - [600. Non-negative Integers without Consecutive Ones](https://leetcode.com/problems/non-negative-integers-without-consecutive-ones/) - Count numbers with pattern constraints

2. **DP with automaton**: Used when you need to track pattern matching while building strings:
   - [1397. Find All Good Strings](https://leetcode.com/problems/find-all-good-strings/) - This problem itself
   - [1220. Count Vowels Permutation](https://leetcode.com/problems/count-vowels-permutation/) - Tracking state transitions between characters

The key insight is recognizing when you need to track "how much of a pattern is matched so far" while building a sequence incrementally.

## Key Takeaways

1. **Digit DP with tight constraints**: When counting numbers/strings within bounds, process digit-by-digit while tracking whether you're still matching the bounds exactly.

2. **KMP automaton for substring tracking**: When you need to avoid a pattern while building strings incrementally, use KMP to efficiently track partial matches.

3. **Complement counting**: For inclusive ranges [s1, s2], compute `count(s2) - count(s1-1)` rather than trying to count directly within the range.

[Practice this problem on CodeJeet](/problem/find-all-good-strings)
