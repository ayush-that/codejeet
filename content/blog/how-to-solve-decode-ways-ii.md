---
title: "How to Solve Decode Ways II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Decode Ways II. Hard difficulty, 31.7% acceptance rate. Topics: String, Dynamic Programming."
date: "2027-09-05"
category: "dsa-patterns"
tags: ["decode-ways-ii", "string", "dynamic-programming", "hard"]
---

# How to Solve Decode Ways II

This problem asks us to count how many ways a string of digits (which may contain `'*'` wildcards) can be decoded into letters using the mapping `'A'→"1"` through `'Z'→"26"`. The `'*'` can represent any digit from `1` to `9`. What makes this problem tricky is that we need to handle both single-digit decodings (1-9) and two-digit decodings (10-26), while accounting for the wildcard's flexibility, which dramatically increases the number of possibilities.

## Visual Walkthrough

Let's trace through the example `s = "1*"` to build intuition.

We'll process digits from left to right, keeping track of how many ways we can decode up to each position.

**Initialization:**

- `dp[0] = 1` (one way to decode empty string: do nothing)
- `dp[1]` will represent ways to decode first character

**Processing first character `'1'` (index 0):**

- Single-digit decoding: `'1'` → `'A'` (1 way)
- Two-digit decoding: Not possible yet (need at least 2 characters)
- So `dp[1] = 1`

**Processing second character `'*'` (index 1):**
We need to consider both single-digit and two-digit decodings:

1. **Single-digit case** (treat `'*'` alone):
   - `'*'` can be 1-9 → 9 possible letters
   - Each builds on `dp[1] = 1` way
   - Contribution: `1 × 9 = 9`

2. **Two-digit case** (pair `'1'` with `'*'`):
   - The pair `"1*"` forms numbers 10-19
   - All are valid (10→'J', 11→'K', ..., 19→'S')
   - That's 10 possible letters (10 through 19)
   - This builds on `dp[0] = 1` way
   - Contribution: `1 × 10 = 10`

Total: `dp[2] = 9 + 10 = 19` ways

So `"1*"` has 19 possible decodings.

## Brute Force Approach

A naive recursive solution would explore every possible decoding path:

- At each position, try decoding 1 character (if valid)
- Also try decoding 2 characters (if valid)
- For `'*'`, branch into all possible digit values

This leads to exponential time complexity because:

1. Each `'*'` creates 9 branches for single-digit decoding
2. Each `'*'` in a two-digit pair creates up to 26 branches
3. We re-compute the same subproblems repeatedly

The brute force would look like this (Python pseudocode):

```python
def numDecodings(s, i=0):
    if i == len(s): return 1
    if s[i] == '0': return 0

    total = 0
    # Single digit
    if s[i] == '*':
        total += 9 * numDecodings(s, i+1)
    else:
        total += numDecodings(s, i+1)

    # Two digits
    if i+1 < len(s):
        # Many cases for s[i] and s[i+1] combinations...
        # This gets very complex with all the * combinations
    return total
```

This is O(2^n) in worst case and times out for longer strings. We need dynamic programming to avoid redundant computations.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with state transitions based on the last 1-2 characters. We can maintain a DP array where `dp[i]` represents the number of ways to decode the first `i` characters.

At each position `i`, we consider:

1. **Single-digit decoding**: Can the current digit alone form a valid letter (1-9)?
2. **Two-digit decoding**: Can the previous digit and current digit together form a valid letter (10-26)?

The challenge is handling all the cases with `'*'`:

- `'*'` alone: 9 possibilities (1-9)
- `'*'` as first of pair: Different counts depending on second digit
- `'*'` as second of pair: Different counts depending on first digit
- `'**'` (both stars): 15 possibilities (11-19, 21-26)

We'll use three variables instead of a full array to save space:

- `dp` = ways for current position
- `dp1` = ways for previous position (i-1)
- `dp2` = ways for position before that (i-2)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is length of string
# Space: O(1) using only three variables
def numDecodings(s: str) -> int:
    MOD = 10**9 + 7

    # dp represents ways to decode up to current position
    # dp1 represents ways up to previous position (i-1)
    # dp2 represents ways up to position before that (i-2)
    dp, dp1, dp2 = 0, 1, 0

    for i in range(len(s)):
        # Reset dp for current position
        dp = 0

        # === SINGLE DIGIT DECODING ===
        # Check if current character can be decoded alone
        if s[i] == '*':
            # '*' can be 1-9, so 9 possibilities
            dp += 9 * dp1
        elif s[i] != '0':
            # Regular digit 1-9, one possibility
            dp += dp1

        # === TWO DIGIT DECODING ===
        # Check if previous and current character can be decoded together
        if i > 0:
            # Case 1: Previous character is '*'
            if s[i-1] == '*':
                if s[i] == '*':
                    # '**' can be 11-19 or 21-26 = 15 possibilities
                    dp += 15 * dp2
                elif '0' <= s[i] <= '6':
                    # '*X' where X=0-6: can be 10-16 or 20-26 = 2 possibilities each
                    dp += 2 * dp2
                elif '7' <= s[i] <= '9':
                    # '*X' where X=7-9: can be 17-19 = 1 possibility each
                    dp += dp2

            # Case 2: Previous character is '1' or '2'
            elif s[i-1] == '1':
                if s[i] == '*':
                    # '1*' can be 10-19 = 10 possibilities
                    dp += 10 * dp2
                else:
                    # '1X' where X is any digit is valid
                    dp += dp2
            elif s[i-1] == '2':
                if s[i] == '*':
                    # '2*' can be 20-26 = 7 possibilities
                    dp += 7 * dp2
                elif '0' <= s[i] <= '6':
                    # '2X' where X=0-6 is valid
                    dp += dp2

            # Case 3: Previous character is other digit (0, 3-9)
            # Two-digit decoding not possible in these cases

        # Take modulo to prevent overflow
        dp %= MOD

        # Shift variables for next iteration
        dp2, dp1 = dp1, dp

    return dp
```

```javascript
// Time: O(n) where n is length of string
// Space: O(1) using only three variables
function numDecodings(s) {
  const MOD = 10 ** 9 + 7;

  // dp represents ways to decode up to current position
  // dp1 represents ways up to previous position (i-1)
  // dp2 represents ways up to position before that (i-2)
  let dp = 0,
    dp1 = 1,
    dp2 = 0;

  for (let i = 0; i < s.length; i++) {
    // Reset dp for current position
    dp = 0;

    // === SINGLE DIGIT DECODING ===
    // Check if current character can be decoded alone
    if (s[i] === "*") {
      // '*' can be 1-9, so 9 possibilities
      dp = (dp + 9 * dp1) % MOD;
    } else if (s[i] !== "0") {
      // Regular digit 1-9, one possibility
      dp = (dp + dp1) % MOD;
    }

    // === TWO DIGIT DECODING ===
    // Check if previous and current character can be decoded together
    if (i > 0) {
      // Case 1: Previous character is '*'
      if (s[i - 1] === "*") {
        if (s[i] === "*") {
          // '**' can be 11-19 or 21-26 = 15 possibilities
          dp = (dp + 15 * dp2) % MOD;
        } else if (s[i] >= "0" && s[i] <= "6") {
          // '*X' where X=0-6: can be 10-16 or 20-26 = 2 possibilities each
          dp = (dp + 2 * dp2) % MOD;
        } else if (s[i] >= "7" && s[i] <= "9") {
          // '*X' where X=7-9: can be 17-19 = 1 possibility each
          dp = (dp + dp2) % MOD;
        }
      }
      // Case 2: Previous character is '1' or '2'
      else if (s[i - 1] === "1") {
        if (s[i] === "*") {
          // '1*' can be 10-19 = 10 possibilities
          dp = (dp + 10 * dp2) % MOD;
        } else {
          // '1X' where X is any digit is valid
          dp = (dp + dp2) % MOD;
        }
      } else if (s[i - 1] === "2") {
        if (s[i] === "*") {
          // '2*' can be 20-26 = 7 possibilities
          dp = (dp + 7 * dp2) % MOD;
        } else if (s[i] >= "0" && s[i] <= "6") {
          // '2X' where X=0-6 is valid
          dp = (dp + dp2) % MOD;
        }
      }
      // Case 3: Previous character is other digit (0, 3-9)
      // Two-digit decoding not possible in these cases
    }

    // Shift variables for next iteration
    dp2 = dp1;
    dp1 = dp;
  }

  return dp;
}
```

```java
// Time: O(n) where n is length of string
// Space: O(1) using only three variables
class Solution {
    public int numDecodings(String s) {
        int MOD = 1000000007;

        // dp represents ways to decode up to current position
        // dp1 represents ways up to previous position (i-1)
        // dp2 represents ways up to position before that (i-2)
        long dp = 0, dp1 = 1, dp2 = 0;

        for (int i = 0; i < s.length(); i++) {
            // Reset dp for current position
            dp = 0;

            // === SINGLE DIGIT DECODING ===
            // Check if current character can be decoded alone
            if (s.charAt(i) == '*') {
                // '*' can be 1-9, so 9 possibilities
                dp = (dp + 9 * dp1) % MOD;
            } else if (s.charAt(i) != '0') {
                // Regular digit 1-9, one possibility
                dp = (dp + dp1) % MOD;
            }

            // === TWO DIGIT DECODING ===
            // Check if previous and current character can be decoded together
            if (i > 0) {
                // Case 1: Previous character is '*'
                if (s.charAt(i-1) == '*') {
                    if (s.charAt(i) == '*') {
                        // '**' can be 11-19 or 21-26 = 15 possibilities
                        dp = (dp + 15 * dp2) % MOD;
                    } else if (s.charAt(i) >= '0' && s.charAt(i) <= '6') {
                        // '*X' where X=0-6: can be 10-16 or 20-26 = 2 possibilities each
                        dp = (dp + 2 * dp2) % MOD;
                    } else if (s.charAt(i) >= '7' && s.charAt(i) <= '9') {
                        // '*X' where X=7-9: can be 17-19 = 1 possibility each
                        dp = (dp + dp2) % MOD;
                    }
                }
                // Case 2: Previous character is '1' or '2'
                else if (s.charAt(i-1) == '1') {
                    if (s.charAt(i) == '*') {
                        // '1*' can be 10-19 = 10 possibilities
                        dp = (dp + 10 * dp2) % MOD;
                    } else {
                        // '1X' where X is any digit is valid
                        dp = (dp + dp2) % MOD;
                    }
                } else if (s.charAt(i-1) == '2') {
                    if (s.charAt(i) == '*') {
                        // '2*' can be 20-26 = 7 possibilities
                        dp = (dp + 7 * dp2) % MOD;
                    } else if (s.charAt(i) >= '0' && s.charAt(i) <= '6') {
                        // '2X' where X=0-6 is valid
                        dp = (dp + dp2) % MOD;
                    }
                }
                // Case 3: Previous character is other digit (0, 3-9)
                // Two-digit decoding not possible in these cases
            }

            // Shift variables for next iteration
            dp2 = dp1;
            dp1 = dp;
        }

        return (int) dp;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the string once, performing constant-time operations at each position
- All condition checks and arithmetic operations are O(1)

**Space Complexity:** O(1)

- We only use three variables (`dp`, `dp1`, `dp2`) regardless of input size
- This is an optimization over the O(n) DP array approach

## Common Mistakes

1. **Forgetting the modulo operation**: The result can be huge (up to 9^n), so we must take `MOD = 10^9 + 7` at each addition. Candidates often compute the full result then mod at the end, causing integer overflow.

2. **Missing cases with `'*'`**: The most common error is not handling all combinations:
   - `'*'` alone (9 ways)
   - `'1*'` (10 ways: 10-19)
   - `'2*'` (7 ways: 20-26)
   - `'*0'` - `'*6'` (2 ways each: e.g., `'*3'` could be 13 or 23)
   - `'*7'` - `'*9'` (1 way each: only 17-19)
   - `'**'` (15 ways: 11-19 and 21-26)

3. **Incorrect handling of `'0'`**: `'0'` cannot be decoded alone, but can be part of `'10'` or `'20'`. Candidates often treat `'0'` as always invalid.

4. **Off-by-one errors in DP indices**: When using a DP array, `dp[i]` usually represents ways to decode first `i` characters, so `dp[0] = 1` (empty string). Confusing this with 0-based string indexing causes errors.

## When You'll See This Pattern

This problem uses **dynamic programming with state transitions based on the last k characters**, a pattern common in:

1. **Decode Ways (LeetCode 91)**: The simpler version without `'*'` wildcards. Same DP approach but with fewer cases to handle.

2. **Number of Ways to Separate Numbers (LeetCode 1977)**: Similar DP where you need to count valid partitions, with constraints on numeric comparisons between segments.

3. **Climbing Stairs (LeetCode 70)**: The simplest form of this pattern - each step depends on the previous 1-2 steps.

4. **Word Break (LeetCode 139)**: More complex but similar idea - whether a string can be segmented depends on previous segments.

The core pattern is: "Number of ways to reach state i depends on states i-1, i-2, ... i-k" where k is the maximum "lookback" needed.

## Key Takeaways

1. **DP with limited lookback**: When the solution at position `i` depends only on a constant number of previous positions (usually 1-2), you can use O(1) space instead of O(n) by keeping only those previous states.

2. **Systematic case analysis**: For problems with special characters or conditions, create a decision tree or case table before coding. For this problem, the 6 cases for two-digit decoding must be handled carefully.

3. **Modulo arithmetic for counting problems**: When a problem asks for the count modulo some value (often 10^9+7), apply the modulo at each addition/multiplication to prevent overflow, not just at the end.

Related problems: [Decode Ways](/problem/decode-ways), [Number of Ways to Separate Numbers](/problem/number-of-ways-to-separate-numbers), [Number of Ways to Divide a Long Corridor](/problem/number-of-ways-to-divide-a-long-corridor)
