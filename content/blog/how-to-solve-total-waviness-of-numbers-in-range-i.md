---
title: "How to Solve Total Waviness of Numbers in Range I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Total Waviness of Numbers in Range I. Medium difficulty, 80.5% acceptance rate. Topics: Math, Dynamic Programming, Enumeration."
date: "2029-07-31"
category: "dsa-patterns"
tags:
  ["total-waviness-of-numbers-in-range-i", "math", "dynamic-programming", "enumeration", "medium"]
---

# How to Solve Total Waviness of Numbers in Range I

This problem asks us to calculate the total waviness across all numbers in a given range. The waviness of a single number is defined as the count of its "peaks" and "valleys" — digits that are strictly greater or smaller than both immediate neighbors. What makes this problem interesting is that we can't simply brute force check every number in the range, as the range can be up to 10^9, which would be far too slow. Instead, we need a clever way to count waviness without enumerating all numbers.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we have the range `[123, 129]`. We need to calculate waviness for each number:

- **123**: Digits are 1, 2, 3. Check middle digit 2: left neighbor is 1, right neighbor is 3. 2 is NOT greater than both (2 > 1 but 2 < 3), so no peak. 2 is NOT less than both (2 > 1), so no valley. No other digits to check (first and last digits don't have both neighbors). Waviness = 0.

- **124**: Digits 1, 2, 4. Check digit 2: 2 > 1 but 2 < 4 → no peak, no valley. Waviness = 0.

- **125**: Digits 1, 2, 5. Check digit 2: 2 > 1 but 2 < 5 → no peak, no valley. Waviness = 0.

- **126**: Digits 1, 2, 6. Check digit 2: 2 > 1 but 2 < 6 → no peak, no valley. Waviness = 0.

- **127**: Digits 1, 2, 7. Check digit 2: 2 > 1 but 2 < 7 → no peak, no valley. Waviness = 0.

- **128**: Digits 1, 2, 8. Check digit 2: 2 > 1 but 2 < 8 → no peak, no valley. Waviness = 0.

- **129**: Digits 1, 2, 9. Check digit 2: 2 > 1 but 2 < 9 → no peak, no valley. Waviness = 0.

Total waviness = 0 + 0 + 0 + 0 + 0 + 0 + 0 = 0.

Now let's look at a more interesting example: `[131, 135]`:

- **131**: Digits 1, 3, 1. Check digit 3: left neighbor 1, right neighbor 1. 3 > 1 and 3 > 1 → peak! Waviness = 1.

- **132**: Digits 1, 3, 2. Check digit 3: 3 > 1 and 3 > 2 → peak! Waviness = 1.

- **133**: Digits 1, 3, 3. Check digit 3: 3 > 1 but 3 is NOT > 3 (equal) → no peak. 3 is NOT < both neighbors. Waviness = 0.

- **134**: Digits 1, 3, 4. Check digit 3: 3 > 1 but 3 < 4 → no peak, no valley. Waviness = 0.

- **135**: Digits 1, 3, 5. Check digit 3: 3 > 1 but 3 < 5 → no peak, no valley. Waviness = 0.

Total waviness = 1 + 1 + 0 + 0 + 0 = 2.

The key observation: we're checking the middle digit of each 3-digit sequence. For numbers with more than 3 digits, we check every interior digit (not the first or last).

## Brute Force Approach

The most straightforward approach is to iterate through every number in the range `[num1, num2]`, convert each to a string, and check each interior digit to see if it's a peak or valley.

**Algorithm:**

1. Initialize `total = 0`
2. For each number `n` from `num1` to `num2`:
   - Convert `n` to string `s`
   - For each index `i` from 1 to `len(s)-2`:
     - If `s[i] > s[i-1]` and `s[i] > s[i+1]`: increment count (peak)
     - Else if `s[i] < s[i-1]` and `s[i] < s[i+1]`: increment count (valley)
   - Add count to total
3. Return total

**Why this fails:**
The range can be up to 10^9, which means we could have up to 1 billion numbers to check. Each number could have up to 10 digits, so we're looking at up to 10 billion digit comparisons. This is far too slow for any reasonable time limit.

## Optimized Approach

The key insight is that we can use **digit dynamic programming** (digit DP) to count waviness without enumerating all numbers. Digit DP is a technique for counting numbers in a range that satisfy certain properties related to their digits.

**Core idea:** Instead of checking each number individually, we count how many numbers in the range have peaks/valleys at specific positions. We need to track:

1. Current position in the number (which digit we're building)
2. Whether we're still constrained by the upper bound (tight)
3. The previous digit (to compare with current and next)
4. The digit before previous (to check if previous digit is peak/valley)
5. Whether the number has started (to handle leading zeros)

**State definition:**

- `pos`: current digit position (0 = most significant digit)
- `tight`: whether we're still constrained by the upper bound
- `prev`: the previous digit (-1 if none)
- `prev2`: the digit before previous (-1 if none)
- `started`: whether we've started placing non-zero digits

**Transition:**
At each position, we try all possible digits (0-9, constrained by `tight`). When we have both `prev2` and `prev`, we can check if `prev` is a peak or valley by comparing with `prev2` and current digit.

**Special handling for leading zeros:**
We need to be careful with leading zeros because they shouldn't count toward waviness. For example, the number "0123" is actually 123, and we shouldn't check waviness for the leading zero.

## Optimal Solution

We'll implement a digit DP solution with memoization. The function `countWaviness(x)` calculates total waviness for numbers from 0 to x, then we compute `countWaviness(num2) - countWaviness(num1-1)`.

<div class="code-group">

```python
# Time: O(10 * 2 * 10 * 10 * 2 * len(digits)) ≈ O(4000 * n) where n is max digits
# Space: O(10 * 2 * 10 * 10 * 2 * len(digits)) for memoization
class Solution:
    def totalWaviness(self, num1: int, num2: int) -> int:
        # Helper function to count waviness from 0 to x inclusive
        def count_up_to(x: int) -> int:
            if x < 0:
                return 0

            digits = list(map(int, str(x)))
            n = len(digits)

            # Memoization cache: dp[pos][tight][prev][prev2][started]
            # pos: 0 to n (we process digits from most significant to least)
            # tight: 0 or 1 (whether we're constrained by x)
            # prev: -1 to 9 (previous digit, -1 means no previous digit)
            # prev2: -1 to 9 (digit before previous, -1 means none)
            # started: 0 or 1 (whether we've started placing non-zero digits)
            from functools import lru_cache

            @lru_cache(None)
            def dfs(pos, tight, prev, prev2, started):
                # Base case: processed all digits
                if pos == n:
                    return 0

                total = 0
                # Determine the maximum digit we can place at this position
                max_digit = digits[pos] if tight else 9

                for d in range(max_digit + 1):
                    # Calculate new tight value
                    new_tight = tight and (d == max_digit)
                    # Determine if we've started placing non-zero digits
                    new_started = started or (d != 0)

                    # If we haven't started (all zeros so far), prev and prev2 remain -1
                    new_prev = d if new_started else -1
                    new_prev2 = prev if new_started else -1

                    # Count waviness contributed by placing digit d at current position
                    waviness_here = 0

                    # We can check if the previous digit (prev) is a peak or valley
                    # only if we have all three: prev2, prev, and current digit d
                    if prev2 != -1 and prev != -1 and new_started:
                        # Check if prev is a peak (greater than both neighbors)
                        if prev > prev2 and prev > d:
                            waviness_here += 1
                        # Check if prev is a valley (smaller than both neighbors)
                        elif prev < prev2 and prev < d:
                            waviness_here += 1

                    # Recursively process next position and add waviness from this placement
                    total += waviness_here + dfs(pos + 1, new_tight, new_prev, new_prev2, new_started)

                return total

            return dfs(0, True, -1, -1, False)

        # Total waviness in [num1, num2] = waviness(0 to num2) - waviness(0 to num1-1)
        return count_up_to(num2) - count_up_to(num1 - 1)
```

```javascript
// Time: O(10 * 2 * 10 * 10 * 2 * n) ≈ O(4000 * n) where n is max digits
// Space: O(10 * 2 * 10 * 10 * 2 * n) for memoization
/**
 * @param {number} num1
 * @param {number} num2
 * @return {number}
 */
var totalWaviness = function (num1, num2) {
  // Helper function to count waviness from 0 to x inclusive
  const countUpTo = (x) => {
    if (x < 0) return 0;

    const digits = x.toString().split("").map(Number);
    const n = digits.length;

    // Memoization cache: dp[pos][tight][prev][prev2][started]
    // We use a 5D array for memoization
    const memo = new Array(n + 1);
    for (let i = 0; i <= n; i++) {
      memo[i] = new Array(2);
      for (let j = 0; j < 2; j++) {
        memo[i][j] = new Array(11); // prev: -1 to 9
        for (let k = 0; k < 11; k++) {
          memo[i][j][k] = new Array(11); // prev2: -1 to 9
          for (let l = 0; l < 11; l++) {
            memo[i][j][k][l] = new Array(2);
            for (let m = 0; m < 2; m++) {
              memo[i][j][k][l][m] = -1;
            }
          }
        }
      }
    }

    const dfs = (pos, tight, prev, prev2, started) => {
      // Base case: processed all digits
      if (pos === n) {
        return 0;
      }

      // Check memoization
      if (memo[pos][tight ? 1 : 0][prev + 1][prev2 + 1][started ? 1 : 0] !== -1) {
        return memo[pos][tight ? 1 : 0][prev + 1][prev2 + 1][started ? 1 : 0];
      }

      let total = 0;
      // Determine the maximum digit we can place at this position
      const maxDigit = tight ? digits[pos] : 9;

      for (let d = 0; d <= maxDigit; d++) {
        // Calculate new tight value
        const newTight = tight && d === maxDigit;
        // Determine if we've started placing non-zero digits
        const newStarted = started || d !== 0;

        // If we haven't started (all zeros so far), prev and prev2 remain -1
        const newPrev = newStarted ? d : -1;
        const newPrev2 = newStarted ? prev : -1;

        // Count waviness contributed by placing digit d at current position
        let wavinessHere = 0;

        // We can check if the previous digit (prev) is a peak or valley
        // only if we have all three: prev2, prev, and current digit d
        if (prev2 !== -1 && prev !== -1 && newStarted) {
          // Check if prev is a peak (greater than both neighbors)
          if (prev > prev2 && prev > d) {
            wavinessHere += 1;
          }
          // Check if prev is a valley (smaller than both neighbors)
          else if (prev < prev2 && prev < d) {
            wavinessHere += 1;
          }
        }

        // Recursively process next position and add waviness from this placement
        total += wavinessHere + dfs(pos + 1, newTight, newPrev, newPrev2, newStarted);
      }

      // Memoize and return
      memo[pos][tight ? 1 : 0][prev + 1][prev2 + 1][started ? 1 : 0] = total;
      return total;
    };

    return dfs(0, true, -1, -1, false);
  };

  // Total waviness in [num1, num2] = waviness(0 to num2) - waviness(0 to num1-1)
  return countUpTo(num2) - countUpTo(num1 - 1);
};
```

```java
// Time: O(10 * 2 * 10 * 10 * 2 * n) ≈ O(4000 * n) where n is max digits
// Space: O(10 * 2 * 10 * 10 * 2 * n) for memoization
class Solution {
    public int totalWaviness(int num1, int num2) {
        return countUpTo(num2) - countUpTo(num1 - 1);
    }

    private int countUpTo(int x) {
        if (x < 0) return 0;

        String s = Integer.toString(x);
        int[] digits = new int[s.length()];
        for (int i = 0; i < s.length(); i++) {
            digits[i] = s.charAt(i) - '0';
        }
        int n = digits.length;

        // Memoization cache: dp[pos][tight][prev][prev2][started]
        // We add 1 to prev and prev2 to handle -1 case (use index 0 for -1, 1 for 0, ..., 10 for 9)
        int[][][][][] memo = new int[n + 1][2][11][11][2];
        for (int i = 0; i <= n; i++) {
            for (int j = 0; j < 2; j++) {
                for (int k = 0; k < 11; k++) {
                    for (int l = 0; l < 11; l++) {
                        for (int m = 0; m < 2; m++) {
                            memo[i][j][k][l][m] = -1;
                        }
                    }
                }
            }
        }

        return dfs(0, true, -1, -1, false, digits, memo);
    }

    private int dfs(int pos, boolean tight, int prev, int prev2, boolean started,
                   int[] digits, int[][][][][] memo) {
        // Base case: processed all digits
        if (pos == digits.length) {
            return 0;
        }

        // Convert parameters to indices for memoization
        int tightIdx = tight ? 1 : 0;
        int prevIdx = prev + 1; // -1 -> 0, 0 -> 1, ..., 9 -> 10
        int prev2Idx = prev2 + 1;
        int startedIdx = started ? 1 : 0;

        // Check memoization
        if (memo[pos][tightIdx][prevIdx][prev2Idx][startedIdx] != -1) {
            return memo[pos][tightIdx][prevIdx][prev2Idx][startedIdx];
        }

        int total = 0;
        // Determine the maximum digit we can place at this position
        int maxDigit = tight ? digits[pos] : 9;

        for (int d = 0; d <= maxDigit; d++) {
            // Calculate new tight value
            boolean newTight = tight && (d == maxDigit);
            // Determine if we've started placing non-zero digits
            boolean newStarted = started || (d != 0);

            // If we haven't started (all zeros so far), prev and prev2 remain -1
            int newPrev = newStarted ? d : -1;
            int newPrev2 = newStarted ? prev : -1;

            // Count waviness contributed by placing digit d at current position
            int wavinessHere = 0;

            // We can check if the previous digit (prev) is a peak or valley
            // only if we have all three: prev2, prev, and current digit d
            if (prev2 != -1 && prev != -1 && newStarted) {
                // Check if prev is a peak (greater than both neighbors)
                if (prev > prev2 && prev > d) {
                    wavinessHere += 1;
                }
                // Check if prev is a valley (smaller than both neighbors)
                else if (prev < prev2 && prev < d) {
                    wavinessHere += 1;
                }
            }

            // Recursively process next position and add waviness from this placement
            total += wavinessHere + dfs(pos + 1, newTight, newPrev, newPrev2, newStarted, digits, memo);
        }

        // Memoize and return
        memo[pos][tightIdx][prevIdx][prev2Idx][startedIdx] = total;
        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(10 × 2 × 10 × 10 × 2 × n) ≈ O(4000 × n), where n is the maximum number of digits (up to 10 for numbers up to 10^9). This comes from:

- 10 choices for current digit
- 2 possibilities for `tight` (constrained or not)
- 10 possibilities for `prev` (-1 to 9, but we use 11 in implementation)
- 10 possibilities for `prev2` (-1 to 9, but we use 11 in implementation)
- 2 possibilities for `started` (true/false)
- n positions to process

In practice, many states are unreachable, so it's much faster. For n=10, this is about 40,000 operations, which is very efficient.

**Space Complexity:** O(10 × 2 × 10 × 10 × 2 × n) for the memoization cache, which is the same as time complexity. The recursion depth is O(n).

## Common Mistakes

1. **Not handling leading zeros correctly:** When a number has leading zeros (e.g., "0123" is actually 123), we shouldn't check waviness for those leading zeros. The `started` flag is crucial for this.

2. **Forgetting to check both peak AND valley conditions:** Some candidates only check for peaks or only check for valleys. Remember that waviness counts both.

3. **Off-by-one errors in range calculation:** When computing `countUpTo(num2) - countUpTo(num1 - 1)`, forgetting to subtract 1 from num1 will exclude num1 from the range.

4. **Incorrect tight flag propagation:** The tight flag should only remain true if all previous digits matched the upper bound AND the current digit equals the maximum allowed digit.

5. **Not memoizing all state parameters:** Forgetting to include `prev`, `prev2`, or `started` in the memoization key will lead to incorrect results because different paths to the same position might have different waviness contributions.

## When You'll See This Pattern

Digit DP is a powerful technique for counting numbers in a range that satisfy digit-based properties. You'll see similar patterns in:

1. **LeetCode 233: Number of Digit One** - Counts how many digit '1's appear in all numbers from 0 to n.
2. **LeetCode 902: Numbers At Most N Given Digit Set** - Counts numbers that can be formed using only certain digits.
3. **LeetCode 1012: Numbers With Repeated Digits** - Counts numbers with no repeated digits.
4. **LeetCode 600: Non-negative Integers without Consecutive Ones** - Counts numbers without consecutive 1s in binary representation.

The common theme is counting numbers in a range where the property depends on the digits, and the range is too large to enumerate.

## Key Takeaways

1. **Digit DP is the go-to technique** for counting numbers with digit-based properties over large ranges. The state typically includes position, tight constraint, and any needed information about previous digits.

2. **Leading zeros require special handling** because they don't represent actual digits in the number. Use a `started` flag to track when you've placed the first non-zero digit.

3. **The range [L, R] can be computed as count(R) - count(L-1)**. This is a common pattern for range queries in counting problems.

4. **Memoization is crucial for efficiency** because many different paths lead to the same state (same position, same constraints, same recent digit history).

[Practice this problem on CodeJeet](/problem/total-waviness-of-numbers-in-range-i)
