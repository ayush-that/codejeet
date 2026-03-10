---
title: "How to Solve Count Stepping Numbers in Range — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Stepping Numbers in Range. Hard difficulty, 27.8% acceptance rate. Topics: String, Dynamic Programming."
date: "2026-05-15"
category: "dsa-patterns"
tags: ["count-stepping-numbers-in-range", "string", "dynamic-programming", "hard"]
---

## How to Solve Count Stepping Numbers in Range

This problem asks us to count integers between `low` and `high` (inclusive) where every adjacent digit differs by exactly 1. For example, 123 is a stepping number (|1-2|=1, |2-3|=1), but 124 is not (|2-4|=2). The challenge comes from two aspects: the bounds can be up to 10^100 (far beyond 64-bit integers), and we need an efficient way to generate/validate stepping numbers without checking every number in the range.

---

## Visual Walkthrough

Let's trace through a small example: `low = "10"`, `high = "20"`.

We need to find all stepping numbers between 10 and 20:

- 10: |1-0| = 1 → valid
- 11: |1-1| = 0 → invalid
- 12: |1-2| = 1 → valid
- 13: |1-3| = 2 → invalid
- 14: |1-4| = 3 → invalid
- 15: |1-5| = 4 → invalid
- 16: |1-6| = 5 → invalid
- 17: |1-7| = 6 → invalid
- 18: |1-8| = 7 → invalid
- 19: |1-9| = 8 → invalid
- 20: |2-0| = 2 → invalid

Valid stepping numbers: 10, 12 → count = 2.

The brute force approach would check each number, but with bounds up to 10^100, that's impossible. Instead, we need to generate only stepping numbers within the range.

---

## Brute Force Approach

A naive solution would:

1. Convert `low` and `high` to integers
2. Iterate from `low` to `high`
3. For each number, check if all adjacent digits differ by 1

**Why this fails:**

- `low` and `high` can be up to 100 digits long (10^100)
- Converting to integers would overflow in any standard integer type
- Even if we could store them, iterating through 10^100 numbers is impossible
- Checking each digit for every number would be O((high-low+1) \* d) where d is number of digits

This approach is completely infeasible for the problem constraints.

---

## Optimized Approach

The key insight: **We can generate all stepping numbers of a given length using DFS/backtracking.**

Stepping numbers have a special property: if you know the first digit, the next digit must be either `current_digit + 1` or `current_digit - 1` (if within 0-9 range). This suggests a recursive construction:

1. Start with each digit 1-9 as the first digit (0 can't be first unless the number is 0 itself)
2. Recursively append valid next digits (current_digit ± 1)
3. Stop when we reach the desired length
4. Check if the generated number is within [`low`, `high`]

But we still need to handle the string comparison since numbers can be 100 digits long. We'll:

- Generate numbers as strings
- Compare strings by length first, then lexicographically
- Use memoization to avoid recomputation

The optimal approach uses **Digit DP (Dynamic Programming)**:

- We need to count numbers in range that satisfy the stepping property
- We can define a DP state: `dp[pos][prev_digit][tight][has_started]`
  - `pos`: current position in the number (0-indexed)
  - `prev_digit`: the previous digit we placed (or -1 if none yet)
  - `tight`: whether we're bound by the `high` limit at this position
  - `has_started`: whether we've started placing non-leading zeros

We run this DP twice: once for numbers ≤ `high`, once for numbers < `low`, then subtract.

---

## Optimal Solution

We'll implement a digit DP solution that counts stepping numbers up to a given bound, then use `count(high) - count(low-1)`.

<div class="code-group">

```python
# Time: O(10 * n * 2 * 2) where n is max length of high (≈100) → O(400n) → O(n)
# Space: O(10 * n * 2 * 2) for memoization → O(n)
class Solution:
    def countSteppingNumbers(self, low: str, high: str) -> int:
        # Helper function to count stepping numbers ≤ bound
        def count_up_to(bound):
            n = len(bound)

            # Memoization: dp[pos][prev_digit][tight][has_started]
            # prev_digit: 0-9 (10 options), use 10 for no previous digit
            # tight: 0/1, has_started: 0/1
            memo = [[[[-1] * 2 for _ in range(2)] for _ in range(11)] for _ in range(n + 1)]

            def dfs(pos, prev_digit, tight, has_started):
                # Base case: processed all digits
                if pos == n:
                    return 1 if has_started else 0  # Valid if we've started a number

                # Check memo
                if memo[pos][prev_digit][tight][has_started] != -1:
                    return memo[pos][prev_digit][tight][has_started]

                # Determine the maximum digit we can place at this position
                max_digit = int(bound[pos]) if tight else 9

                total = 0
                # Try placing each possible digit
                for digit in range(0, max_digit + 1):
                    next_tight = tight and (digit == max_digit)

                    if not has_started:
                        # Haven't started placing non-leading zeros yet
                        if digit == 0:
                            # Continue without starting
                            total += dfs(pos + 1, 10, next_tight, 0)
                        else:
                            # Start with this digit as first
                            total += dfs(pos + 1, digit, next_tight, 1)
                    else:
                        # Already started, check stepping property
                        if prev_digit == 10 or abs(prev_digit - digit) == 1:
                            total += dfs(pos + 1, digit, next_tight, 1)

                memo[pos][prev_digit][tight][has_started] = total
                return total

            # Start from position 0, no previous digit, tight bound, not started
            return dfs(0, 10, 1, 0)

        # Count stepping numbers ≤ high
        count_high = count_up_to(high)

        # Count stepping numbers < low by subtracting 1 from low
        # We need to handle the subtraction manually since low is a string
        low_minus_one = self.decrement_string(low)
        if low_minus_one == "-1":  # low is "0" or "1"
            count_low_minus_one = 0
        else:
            count_low_minus_one = count_up_to(low_minus_one)

        return count_high - count_low_minus_one

    def decrement_string(self, s: str) -> str:
        """Decrement a decimal string by 1, return "-1" if result would be negative"""
        if s == "0":
            return "-1"

        chars = list(s)
        i = len(chars) - 1

        # Borrow from left digits if needed
        while i >= 0 and chars[i] == '0':
            chars[i] = '9'
            i -= 1

        if i < 0:
            return "-1"  # Shouldn't happen since we checked for "0"

        # Decrement the digit
        chars[i] = str(int(chars[i]) - 1)

        # Remove leading zeros
        result = ''.join(chars).lstrip('0')
        return result if result else "0"
```

```javascript
// Time: O(n) where n is length of high (max 100)
// Space: O(n) for memoization
var countSteppingNumbers = function (low, high) {
  // Helper to count stepping numbers ≤ bound
  const countUpTo = (bound) => {
    const n = bound.length;

    // memo[pos][prevDigit][tight][hasStarted]
    // prevDigit: 0-9, 10 for no previous digit
    const memo = Array(n + 1)
      .fill()
      .map(() =>
        Array(11)
          .fill()
          .map(() =>
            Array(2)
              .fill()
              .map(() => Array(2).fill(-1))
          )
      );

    const dfs = (pos, prevDigit, tight, hasStarted) => {
      if (pos === n) {
        return hasStarted ? 1 : 0;
      }

      if (memo[pos][prevDigit][tight][hasStarted] !== -1) {
        return memo[pos][prevDigit][tight][hasStarted];
      }

      const maxDigit = tight ? parseInt(bound[pos]) : 9;
      let total = 0;

      for (let digit = 0; digit <= maxDigit; digit++) {
        const nextTight = tight && digit === maxDigit;

        if (!hasStarted) {
          if (digit === 0) {
            // Continue without starting
            total += dfs(pos + 1, 10, nextTight, 0);
          } else {
            // Start with this digit
            total += dfs(pos + 1, digit, nextTight, 1);
          }
        } else {
          // Check stepping property
          if (prevDigit === 10 || Math.abs(prevDigit - digit) === 1) {
            total += dfs(pos + 1, digit, nextTight, 1);
          }
        }
      }

      memo[pos][prevDigit][tight][hasStarted] = total;
      return total;
    };

    return dfs(0, 10, 1, 0);
  };

  // Count stepping numbers ≤ high
  const countHigh = countUpTo(high);

  // Count stepping numbers < low
  const lowMinusOne = decrementString(low);
  let countLowMinusOne = 0;
  if (lowMinusOne !== "-1") {
    countLowMinusOne = countUpTo(lowMinusOne);
  }

  return countHigh - countLowMinusOne;
};

// Helper to decrement a decimal string
const decrementString = (s) => {
  if (s === "0") return "-1";

  const chars = s.split("");
  let i = chars.length - 1;

  // Borrow from left if current digit is 0
  while (i >= 0 && chars[i] === "0") {
    chars[i] = "9";
    i--;
  }

  if (i < 0) return "-1";

  // Decrement the digit
  chars[i] = (parseInt(chars[i]) - 1).toString();

  // Remove leading zeros
  const result = chars.join("").replace(/^0+/, "");
  return result || "0";
};
```

```java
// Time: O(n) where n is length of high (max 100)
// Space: O(n) for memoization
class Solution {
    public int countSteppingNumbers(String low, String high) {
        // Count stepping numbers ≤ high
        int countHigh = countUpTo(high);

        // Count stepping numbers < low
        String lowMinusOne = decrementString(low);
        int countLowMinusOne = 0;
        if (!lowMinusOne.equals("-1")) {
            countLowMinusOne = countUpTo(lowMinusOne);
        }

        return countHigh - countLowMinusOne;
    }

    private int countUpTo(String bound) {
        int n = bound.length();

        // memo[pos][prevDigit][tight][hasStarted]
        // prevDigit: 0-9, 10 for no previous digit
        Integer[][][][] memo = new Integer[n + 1][11][2][2];

        return dfs(0, 10, 1, 0, bound, memo);
    }

    private int dfs(int pos, int prevDigit, int tight, int hasStarted,
                   String bound, Integer[][][][] memo) {
        if (pos == bound.length()) {
            return hasStarted == 1 ? 1 : 0;
        }

        if (memo[pos][prevDigit][tight][hasStarted] != null) {
            return memo[pos][prevDigit][tight][hasStarted];
        }

        int maxDigit = tight == 1 ? bound.charAt(pos) - '0' : 9;
        int total = 0;

        for (int digit = 0; digit <= maxDigit; digit++) {
            int nextTight = (tight == 1 && digit == maxDigit) ? 1 : 0;

            if (hasStarted == 0) {
                if (digit == 0) {
                    // Continue without starting
                    total += dfs(pos + 1, 10, nextTight, 0, bound, memo);
                } else {
                    // Start with this digit
                    total += dfs(pos + 1, digit, nextTight, 1, bound, memo);
                }
            } else {
                // Check stepping property
                if (prevDigit == 10 || Math.abs(prevDigit - digit) == 1) {
                    total += dfs(pos + 1, digit, nextTight, 1, bound, memo);
                }
            }
        }

        memo[pos][prevDigit][tight][hasStarted] = total;
        return total;
    }

    private String decrementString(String s) {
        if (s.equals("0")) return "-1";

        char[] chars = s.toCharArray();
        int i = chars.length - 1;

        // Borrow from left if current digit is 0
        while (i >= 0 && chars[i] == '0') {
            chars[i] = '9';
            i--;
        }

        if (i < 0) return "-1";

        // Decrement the digit
        chars[i] = (char)(chars[i] - 1);

        // Remove leading zeros
        String result = new String(chars).replaceFirst("^0+", "");
        return result.isEmpty() ? "0" : result;
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity:** O(n × 10 × 2 × 2) = O(40n) ≈ O(n)

- `n`: maximum length of `high` (≤ 100)
- For each position, we try up to 10 digits
- `tight` has 2 states (0 or 1)
- `has_started` has 2 states (0 or 1)
- Each state is computed once due to memoization

**Space Complexity:** O(n × 11 × 2 × 2) = O(44n) ≈ O(n)

- Memoization table size
- Recursion depth is O(n)

---

## Common Mistakes

1. **Trying to convert strings to integers**: The bounds can be 100 digits long (10^100), which exceeds 64-bit integer limits. Always work with strings directly.

2. **Forgetting to handle leading zeros**: The number "0" is a valid stepping number, but "01" is not. We need the `has_started` flag to distinguish between leading zeros and actual zeros in the number.

3. **Incorrect range subtraction**: To get count in [low, high], we need `count(high) - count(low-1)`. Many candidates forget to subtract 1 from `low` or handle the case where `low = "0"`.

4. **Missing memoization for all states**: The DP has 4 dimensions (pos, prev_digit, tight, has_started). Omitting any dimension leads to incorrect counts because the same position with different constraints yields different results.

---

## When You'll See This Pattern

This **Digit DP** pattern appears in problems where we need to count numbers in a range satisfying certain digit-based constraints:

1. **Numbers At Most N (LeetCode 902)**: Count numbers ≤ N that can be formed from a given digit set.
2. **Non-negative Integers without Consecutive Ones (LeetCode 600)**: Count numbers ≤ n with no consecutive 1s in binary.
3. **Count Numbers with Unique Digits (LeetCode 357)**: Count numbers with all unique digits.

The pattern is: when you need to count numbers in a range with digit constraints, and the range is too large to iterate, use Digit DP with states for position, previous digit, tight bound, and any problem-specific flags.

---

## Key Takeaways

1. **Digit DP is the go-to technique** for counting numbers in large ranges with digit constraints. The state typically includes: current position, previous digit, tight bound flag, and problem-specific flags.

2. **Always handle numbers as strings** when they can exceed standard integer limits. Compare by length first, then lexicographically.

3. **The tight flag is crucial**: It tracks whether we're still bound by the upper limit's prefix. When `tight=1`, we can only use digits ≤ the current digit of the bound; when `tight=0`, we can use any digit 0-9.

---

Related problems: [Stepping Numbers](/problem/stepping-numbers)
