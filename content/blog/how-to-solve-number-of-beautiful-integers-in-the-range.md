---
title: "How to Solve Number of Beautiful Integers in the Range — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Beautiful Integers in the Range. Hard difficulty, 21.6% acceptance rate. Topics: Math, Dynamic Programming."
date: "2026-03-17"
category: "dsa-patterns"
tags: ["number-of-beautiful-integers-in-the-range", "math", "dynamic-programming", "hard"]
---

# How to Solve Number of Beautiful Integers in the Range

This problem asks us to count numbers in a range `[low, high]` that have equal counts of even and odd digits AND are divisible by `k`. What makes this challenging is that we can't brute force check every number (the range can be up to 10^9), and we need to track multiple constraints simultaneously: digit parity balance and divisibility modulo `k`. This is a classic **digit dynamic programming** problem where we need to count numbers with specific digit properties.

## Visual Walkthrough

Let's trace through a small example: `low = 10, high = 20, k = 2`.

We need numbers where:

1. Count of even digits = count of odd digits
2. Number is divisible by 2

Let's check each number:

- 10: digits [1,0] → 1 odd, 1 even ✓, 10%2=0 ✓ → Beautiful
- 11: digits [1,1] → 2 odd, 0 even ✗
- 12: digits [1,2] → 1 odd, 1 even ✓, 12%2=0 ✓ → Beautiful
- 13: digits [1,3] → 2 odd, 0 even ✗
- 14: digits [1,4] → 1 odd, 1 even ✓, 14%2=0 ✓ → Beautiful
- 15: digits [1,5] → 2 odd, 0 even ✗
- 16: digits [1,6] → 1 odd, 1 even ✓, 16%2=0 ✓ → Beautiful
- 17: digits [1,7] → 2 odd, 0 even ✗
- 18: digits [1,8] → 1 odd, 1 even ✓, 18%2=0 ✓ → Beautiful
- 19: digits [1,9] → 2 odd, 0 even ✗
- 20: digits [2,0] → 0 odd, 2 even ✗

Result: 5 beautiful integers (10, 12, 14, 16, 18).

For larger ranges, checking every number becomes impossible. We need a smarter approach that counts numbers with specific properties without enumerating them all.

## Brute Force Approach

The brute force solution would iterate through every number from `low` to `high`, check if it has equal even/odd digits, and check if it's divisible by `k`:

<div class="code-group">

```python
# Time: O((high-low+1) * d) where d is number of digits
# Space: O(1)
def brute_force(low, high, k):
    count = 0
    for num in range(low, high + 1):
        # Check digit parity balance
        even_count = 0
        odd_count = 0
        temp = num
        while temp > 0:
            digit = temp % 10
            if digit % 2 == 0:
                even_count += 1
            else:
                odd_count += 1
            temp //= 10

        # Check both conditions
        if even_count == odd_count and num % k == 0:
            count += 1
    return count
```

```javascript
// Time: O((high-low+1) * d) where d is number of digits
// Space: O(1)
function bruteForce(low, high, k) {
  let count = 0;
  for (let num = low; num <= high; num++) {
    // Check digit parity balance
    let evenCount = 0;
    let oddCount = 0;
    let temp = num;
    while (temp > 0) {
      const digit = temp % 10;
      if (digit % 2 === 0) {
        evenCount++;
      } else {
        oddCount++;
      }
      temp = Math.floor(temp / 10);
    }

    // Check both conditions
    if (evenCount === oddCount && num % k === 0) {
      count++;
    }
  }
  return count;
}
```

```java
// Time: O((high-low+1) * d) where d is number of digits
// Space: O(1)
public int bruteForce(int low, int high, int k) {
    int count = 0;
    for (int num = low; num <= high; num++) {
        // Check digit parity balance
        int evenCount = 0;
        int oddCount = 0;
        int temp = num;
        while (temp > 0) {
            int digit = temp % 10;
            if (digit % 2 == 0) {
                evenCount++;
            } else {
                oddCount++;
            }
            temp /= 10;
        }

        // Check both conditions
        if (evenCount == oddCount && num % k == 0) {
            count++;
        }
    }
    return count;
}
```

</div>

**Why this fails:** The range can be up to 10^9, so iterating through up to a billion numbers is too slow. Even with optimizations, we need a solution that scales with the number of digits (logarithmic in the number range), not with the range itself.

## Optimized Approach

The key insight is to use **digit dynamic programming (digit DP)**. Instead of checking each number, we count how many numbers up to a certain bound satisfy our conditions. We can then compute `countUpTo(high) - countUpTo(low-1)`.

For digit DP, we need to track:

1. **Position**: Which digit position we're processing (from most significant to least)
2. **Balance**: Difference between even and odd digit counts (can be positive or negative)
3. **Remainder**: Current number modulo `k`
4. **Tight bound**: Whether we're constrained by the original number's digits at this position
5. **Leading zeros**: Whether we're still processing leading zeros (which don't count toward balance)

We'll use memoization to avoid recomputing states. The maximum number of digits is 10 (since 10^9 < 2^31), and balance can range from -10 to 10, remainder from 0 to k-1, giving us manageable state space.

## Optimal Solution

Here's the complete digit DP solution:

<div class="code-group">

```python
# Time: O(d * balance_range * k * 2) where d is number of digits, balance_range is 2*d+1
# Space: O(d * balance_range * k * 2) for memoization
def numberOfBeautifulIntegers(low, high, k):
    def count_up_to(n):
        if n == 0:
            return 0

        # Convert number to digit array for digit DP
        digits = list(map(int, str(n)))
        n_len = len(digits)

        # Memoization cache: dp[pos][balance][rem][tight][started]
        # pos: current digit position (0 to n_len)
        # balance: even_count - odd_count (offset by n_len to make it non-negative)
        # rem: current remainder modulo k
        # tight: 1 if we're bound by original number's digits, 0 otherwise
        # started: 1 if we've started placing non-zero digits, 0 if still leading zeros
        from functools import lru_cache

        @lru_cache(None)
        def dp(pos, balance, rem, tight, started):
            # Base case: processed all digits
            if pos == n_len:
                # Valid if balance is 0 (equal even/odd) and remainder is 0 (divisible by k)
                # Also must have started (number > 0)
                return 1 if balance == 0 and rem == 0 and started else 0

            max_digit = digits[pos] if tight else 9
            total = 0

            for digit in range(max_digit + 1):
                # Calculate new tight flag: stays tight if we were tight AND digit equals max_digit
                new_tight = tight and (digit == max_digit)

                # Handle leading zeros
                if not started and digit == 0:
                    # Still in leading zeros, balance doesn't change, remainder doesn't change
                    total += dp(pos + 1, balance, rem, new_tight, 0)
                else:
                    # We've started placing digits
                    new_started = 1

                    # Update balance: +1 for even digits, -1 for odd digits
                    # We offset balance by n_len to make it non-negative
                    new_balance = balance + (1 if digit % 2 == 0 else -1)

                    # Update remainder: (old_remainder * 10 + digit) % k
                    new_rem = (rem * 10 + digit) % k

                    total += dp(pos + 1, new_balance, new_rem, new_tight, new_started)

            return total

        # Start DP from position 0, with balance offset by n_len (so balance=n_len means actual balance=0)
        # Initial remainder is 0, tight is True (bound by original number), started is False (leading zeros)
        return dp(0, n_len, 0, True, False)

    # Count numbers in [low, high] = count_up_to(high) - count_up_to(low-1)
    return count_up_to(high) - count_up_to(low - 1)
```

```javascript
// Time: O(d * balance_range * k * 2) where d is number of digits, balance_range is 2*d+1
// Space: O(d * balance_range * k * 2) for memoization
function numberOfBeautifulIntegers(low, high, k) {
  function countUpTo(n) {
    if (n === 0) return 0;

    // Convert number to digit array
    const digits = n.toString().split("").map(Number);
    const nLen = digits.length;

    // Memoization cache: dp[pos][balance][rem][tight][started]
    const memo = new Array(nLen + 1)
      .fill(null)
      .map(() =>
        new Array(2 * nLen + 1)
          .fill(null)
          .map(() =>
            new Array(k)
              .fill(null)
              .map(() => new Array(2).fill(null).map(() => new Array(2).fill(-1)))
          )
      );

    function dp(pos, balance, rem, tight, started) {
      // Base case: processed all digits
      if (pos === nLen) {
        // Valid if balance is 0 (equal even/odd) and remainder is 0
        // Also must have started (number > 0)
        return balance === nLen && rem === 0 && started ? 1 : 0;
      }

      // Check memoization
      if (memo[pos][balance][rem][tight ? 1 : 0][started ? 1 : 0] !== -1) {
        return memo[pos][balance][rem][tight ? 1 : 0][started ? 1 : 0];
      }

      const maxDigit = tight ? digits[pos] : 9;
      let total = 0;

      for (let digit = 0; digit <= maxDigit; digit++) {
        // Calculate new tight flag
        const newTight = tight && digit === maxDigit;

        // Handle leading zeros
        if (!started && digit === 0) {
          // Still in leading zeros
          total += dp(pos + 1, balance, rem, newTight, false);
        } else {
          // We've started placing digits
          const newStarted = true;

          // Update balance: +1 for even, -1 for odd
          const newBalance = balance + (digit % 2 === 0 ? 1 : -1);

          // Update remainder
          const newRem = (rem * 10 + digit) % k;

          total += dp(pos + 1, newBalance, newRem, newTight, newStarted);
        }
      }

      // Store in memo
      memo[pos][balance][rem][tight ? 1 : 0][started ? 1 : 0] = total;
      return total;
    }

    // Start DP with balance offset by nLen (so balance=nLen means actual balance=0)
    return dp(0, nLen, 0, true, false);
  }

  return countUpTo(high) - countUpTo(low - 1);
}
```

```java
// Time: O(d * balance_range * k * 2) where d is number of digits, balance_range is 2*d+1
// Space: O(d * balance_range * k * 2) for memoization
class Solution {
    public int numberOfBeautifulIntegers(int low, int high, int k) {
        return countUpTo(high, k) - countUpTo(low - 1, k);
    }

    private int countUpTo(int n, int k) {
        if (n == 0) return 0;

        // Convert number to digit array
        String s = Integer.toString(n);
        int[] digits = new int[s.length()];
        for (int i = 0; i < s.length(); i++) {
            digits[i] = s.charAt(i) - '0';
        }
        int nLen = digits.length;

        // Memoization cache: dp[pos][balance][rem][tight][started]
        Integer[][][][][] memo = new Integer[nLen + 1][2 * nLen + 1][k][2][2];

        return dp(0, nLen, 0, 1, 0, digits, k, nLen, memo);
    }

    private int dp(int pos, int balance, int rem, int tight, int started,
                   int[] digits, int k, int nLen, Integer[][][][][] memo) {
        // Base case: processed all digits
        if (pos == nLen) {
            // Valid if balance is 0 (equal even/odd) and remainder is 0
            // Also must have started (number > 0)
            return (balance == nLen && rem == 0 && started == 1) ? 1 : 0;
        }

        // Check memoization
        if (memo[pos][balance][rem][tight][started] != null) {
            return memo[pos][balance][rem][tight][started];
        }

        int maxDigit = (tight == 1) ? digits[pos] : 9;
        int total = 0;

        for (int digit = 0; digit <= maxDigit; digit++) {
            // Calculate new tight flag
            int newTight = (tight == 1 && digit == maxDigit) ? 1 : 0;

            // Handle leading zeros
            if (started == 0 && digit == 0) {
                // Still in leading zeros
                total += dp(pos + 1, balance, rem, newTight, 0, digits, k, nLen, memo);
            } else {
                // We've started placing digits
                int newStarted = 1;

                // Update balance: +1 for even, -1 for odd
                int newBalance = balance + (digit % 2 == 0 ? 1 : -1);

                // Update remainder
                int newRem = (rem * 10 + digit) % k;

                total += dp(pos + 1, newBalance, newRem, newTight, newStarted, digits, k, nLen, memo);
            }
        }

        // Store in memo
        memo[pos][balance][rem][tight][started] = total;
        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(d × B × k × 2 × 10) where:

- `d` is the number of digits (max 10 for numbers up to 10^9)
- `B` is the balance range (2d+1, max 21)
- `k` is the divisor (up to 20 in constraints)
- 2 comes from the tight flag states
- 10 comes from digit choices (0-9)

This simplifies to O(d × B × k) which is about 10 × 21 × 20 = 4200 operations, very efficient.

**Space Complexity:** O(d × B × k × 2) for the memoization cache, which is similarly small.

## Common Mistakes

1. **Forgetting to handle leading zeros**: Leading zeros don't count toward the even/odd balance. If you count them, you'll incorrectly count numbers like "0012" as having different balance than "12".

2. **Incorrect balance offset**: Balance can be negative (more odds than evens). We need to offset it by `n_len` to use it as an array index. Forgetting this causes index out of bounds errors.

3. **Missing the "started" flag**: Without tracking whether we've started placing non-zero digits, we might:
   - Count 0 as a valid number when it shouldn't be (0 has no digits to balance)
   - Incorrectly handle numbers with different digit lengths

4. **Not using memoization properly**: Each DP state depends on 5 parameters. Forgetting any of them (especially `tight` or `started`) leads to incorrect caching and wrong results.

## When You'll See This Pattern

Digit DP appears in problems where you need to count numbers in a range with specific digit properties:

1. **Count Numbers with Non-Decreasing Digits** (LeetCode 357 variant): Count numbers where each digit is greater than or equal to the previous digit.

2. **Numbers At Most N Given Digit Set** (LeetCode 902): Count numbers that can be formed using only specific digits.

3. **Digit Count in Range** (LeetCode 1067): Count how many times a specific digit appears in all numbers in a range.

The pattern is: when you need to count numbers with digit constraints in a range, think digit DP with state tracking for the constraints.

## Key Takeaways

1. **Digit DP transforms range counting**: Instead of iterating through numbers, count valid numbers up to a bound using digit-by-digit construction with memoization.

2. **Track all relevant constraints**: For this problem, we needed position, balance, remainder, tight bound, and started flag. Each constraint becomes a dimension in the DP state.

3. **Handle edge cases carefully**: Leading zeros and the number 0 itself often need special handling in digit DP problems.

Related problems: [Count Numbers with Non-Decreasing Digits](/problem/count-numbers-with-non-decreasing-digits)
