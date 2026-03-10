---
title: "How to Solve Count Number of Texts — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Number of Texts. Medium difficulty, 49.9% acceptance rate. Topics: Hash Table, Math, String, Dynamic Programming."
date: "2029-05-22"
category: "dsa-patterns"
tags: ["count-number-of-texts", "hash-table", "math", "string", "medium"]
---

# How to Solve Count Number of Texts

This problem asks us to count the number of possible text messages Alice could have sent given a sequence of key presses. The tricky part is that each digit (2-9) maps to multiple letters (3-4 letters each), and pressing the same digit consecutively could represent different letters from that key. This creates a combinatorial counting problem that resembles decoding a sequence where each digit can represent 1-4 characters depending on how many times it's pressed consecutively.

## Visual Walkthrough

Let's trace through example `"222"` to build intuition. The digit '2' maps to letters "abc".

- **First press**: "2" → could be "a"
- **Second press**: "22" → could be "aa", "b" (since two presses of '2' could mean 'b')
- **Third press**: "222" → we need to consider all possibilities:
  1. "aaa" (three single presses)
  2. "ab" (first 'a', then two presses for 'b')
  3. "ba" (two presses for 'b', then 'a')
  4. "c" (three presses for 'c')

That's 4 possible messages. Notice the pattern: when we see consecutive same digits, we need to consider all ways to group them into presses of length 1-4 (or 1-3 for digits 7 and 9).

For `"2222"`, digit '2' allows up to 3 presses per letter, so we can group as:

- Four single presses: "aaaa"
- Two singles then a double: "aab", "aba", "baa"
- A double then two singles: "baa", "aba", "aab" (wait, duplicates!)
- A single then a triple: "ac", "ca"
- A triple then a single: "ca", "ac"
- Two doubles: "bb"
- A quadruple? No, '2' only has 3 letters, so 4 consecutive presses must be broken into smaller groups.

We need a systematic way to count without missing or duplicating possibilities.

## Brute Force Approach

A naive approach would generate all possible groupings of consecutive same digits, then multiply the possibilities. For each block of `k` consecutive same digits, we could try all ways to partition it into groups of size 1-3 (or 1-4 for 7/9), then count the number of messages for each partition.

However, this becomes combinatorially explosive. For a string of length `n`, there are exponentially many partitions to consider. Even for moderate `n` (up to 10^5 in constraints), this is completely infeasible.

What makes this problem tractable is recognizing it as a **dynamic programming** problem similar to "Decode Ways" — each position's count depends on a limited number of previous positions.

## Optimized Approach

The key insight: This is a **linear DP problem with bounded lookback**.

Let `dp[i]` = number of ways to interpret the first `i` characters of the pressedKeys string.

For position `i` (1-indexed for DP), we consider:

- The current digit as a single press: adds `dp[i-1]` ways
- The current digit as part of a 2-press sequence (if `pressedKeys[i-1] == pressedKeys[i-2]`): adds `dp[i-2]` ways
- For 3-press sequence: if last 3 digits are same, adds `dp[i-3]` ways
- For 4-press sequence: if last 4 digits are same AND digit is 7 or 9, adds `dp[i-4]` ways

Why does this work? Each grouping of `k` consecutive same digits corresponds to choosing a letter from that key's mapping. The number of ways to interpret the sequence up to position `i` is the sum of ways to interpret sequences ending with groupings of size 1, 2, 3, or 4 (if allowed).

We initialize `dp[0] = 1` (empty string has 1 interpretation), and build up from left to right.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n = len(pressedKeys)
# Space: O(n) for the DP array, reducible to O(1) with sliding window
class Solution:
    def countTexts(self, pressedKeys: str) -> int:
        MOD = 10**9 + 7
        n = len(pressedKeys)

        # dp[i] = number of ways to interpret first i characters
        dp = [0] * (n + 1)
        dp[0] = 1  # empty string has 1 way

        for i in range(1, n + 1):
            # Current digit
            current_digit = pressedKeys[i-1]

            # Option 1: Single press (always valid)
            dp[i] = dp[i-1]

            # Option 2: Two consecutive same digits
            if i >= 2 and pressedKeys[i-2] == current_digit:
                dp[i] = (dp[i] + dp[i-2]) % MOD

                # Option 3: Three consecutive same digits
                if i >= 3 and pressedKeys[i-3] == current_digit:
                    dp[i] = (dp[i] + dp[i-3]) % MOD

                    # Option 4: Four consecutive same digits (only for 7 and 9)
                    if i >= 4 and pressedKeys[i-4] == current_digit and current_digit in "79":
                        dp[i] = (dp[i] + dp[i-4]) % MOD

        return dp[n]
```

```javascript
// Time: O(n) where n = pressedKeys.length
// Space: O(n) for the DP array
/**
 * @param {string} pressedKeys
 * @return {number}
 */
var countTexts = function (pressedKeys) {
  const MOD = 1_000_000_007;
  const n = pressedKeys.length;

  // dp[i] = number of ways to interpret first i characters
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; // empty string has 1 way

  for (let i = 1; i <= n; i++) {
    const currentDigit = pressedKeys[i - 1];

    // Option 1: Single press (always valid)
    dp[i] = dp[i - 1];

    // Option 2: Two consecutive same digits
    if (i >= 2 && pressedKeys[i - 2] === currentDigit) {
      dp[i] = (dp[i] + dp[i - 2]) % MOD;

      // Option 3: Three consecutive same digits
      if (i >= 3 && pressedKeys[i - 3] === currentDigit) {
        dp[i] = (dp[i] + dp[i - 3]) % MOD;

        // Option 4: Four consecutive same digits (only for 7 and 9)
        if (
          i >= 4 &&
          pressedKeys[i - 4] === currentDigit &&
          (currentDigit === "7" || currentDigit === "9")
        ) {
          dp[i] = (dp[i] + dp[i - 4]) % MOD;
        }
      }
    }
  }

  return dp[n];
};
```

```java
// Time: O(n) where n = pressedKeys.length()
// Space: O(n) for the DP array
class Solution {
    public int countTexts(String pressedKeys) {
        final int MOD = 1_000_000_007;
        int n = pressedKeys.length();

        // dp[i] = number of ways to interpret first i characters
        long[] dp = new long[n + 1];
        dp[0] = 1;  // empty string has 1 way

        for (int i = 1; i <= n; i++) {
            char currentDigit = pressedKeys.charAt(i - 1);

            // Option 1: Single press (always valid)
            dp[i] = dp[i - 1];

            // Option 2: Two consecutive same digits
            if (i >= 2 && pressedKeys.charAt(i - 2) == currentDigit) {
                dp[i] = (dp[i] + dp[i - 2]) % MOD;

                // Option 3: Three consecutive same digits
                if (i >= 3 && pressedKeys.charAt(i - 3) == currentDigit) {
                    dp[i] = (dp[i] + dp[i - 3]) % MOD;

                    // Option 4: Four consecutive same digits (only for 7 and 9)
                    if (i >= 4 && pressedKeys.charAt(i - 4) == currentDigit &&
                        (currentDigit == '7' || currentDigit == '9')) {
                        dp[i] = (dp[i] + dp[i - 4]) % MOD;
                    }
                }
            }
        }

        return (int) dp[n];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of `pressedKeys`. We iterate through the string once, and at each position we do at most 4 constant-time checks and additions.

**Space Complexity:** O(n) for the DP array. This can be optimized to O(1) by only keeping the last 4 values since we only look back up to 4 positions, but the O(n) version is clearer for understanding.

## Common Mistakes

1. **Forgetting modulo operations**: The result can be huge (exponential in n), so we need to apply modulo 10^9+7 at each addition, not just at the end. Intermediate values might overflow 32-bit integers.

2. **Incorrect handling of digits 7 and 9**: These are the only digits with 4 letters. A common mistake is allowing 4-press sequences for all digits or forgetting to allow them for 7 and 9.

3. **Off-by-one errors in DP indices**: Using 0-based indexing for the string but 1-based for DP requires careful translation. The current character is at `pressedKeys[i-1]` when `dp[i]` represents first `i` characters.

4. **Not initializing dp[0] = 1**: The empty string has exactly 1 interpretation (no message). This is crucial for the recurrence to work correctly.

## When You'll See This Pattern

This problem uses **linear DP with bounded lookback**, a pattern seen in:

1. **Decode Ways (LeetCode 91)**: Count ways to decode a digit string where '1'-'9' map to 'A'-'I' and '10'-'26' map to 'J'-'Z'. Similar recurrence: `dp[i] = dp[i-1] + dp[i-2]` with conditions.

2. **Climbing Stairs (LeetCode 70)**: Count ways to reach step n taking 1 or 2 steps at a time. Simpler version: `dp[i] = dp[i-1] + dp[i-2]`.

3. **Knight Dialer (LeetCode 935)**: Count sequences of phone dialer moves. Also uses DP where each position depends on previous positions according to movement rules.

The pattern to recognize: when counting sequences where each step has limited dependencies on previous steps, and the count grows combinatorially.

## Key Takeaways

1. **Bounded lookback DP** is ideal for counting problems where each position's contribution depends only on a fixed number of previous positions. Look for problems where "the number of ways to get here" equals sum of "ways to get to recent states that can transition here".

2. **Modulo arithmetic** is crucial when counts grow exponentially. Apply modulo at each addition to prevent overflow, especially in languages with fixed-width integers.

3. **Edge cases matter**: Special digits (7,9) with different properties, empty string handling, and proper DP initialization are what separate working solutions from buggy ones.

Related problems: [Letter Combinations of a Phone Number](/problem/letter-combinations-of-a-phone-number), [Decode Ways](/problem/decode-ways)
