---
title: "How to Solve Numbers With Repeated Digits — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Numbers With Repeated Digits. Hard difficulty, 45.8% acceptance rate. Topics: Math, Dynamic Programming."
date: "2029-08-21"
category: "dsa-patterns"
tags: ["numbers-with-repeated-digits", "math", "dynamic-programming", "hard"]
---

# How to Solve Numbers With Repeated Digits

Given an integer `n`, we need to count how many numbers from 1 to `n` (inclusive) have at least one repeated digit. For example, 11 has a repeated digit (1 appears twice), while 123 does not. This problem is tricky because checking every number from 1 to `n` would be too slow when `n` can be up to 10⁹. Instead, we need a mathematical approach that counts numbers _without_ repeated digits and subtracts from the total.

## Visual Walkthrough

Let's trace through a small example: `n = 20`.

We want to count numbers from 1 to 20 that have at least one repeated digit. Instead of counting them directly, we'll count numbers with _no_ repeated digits and subtract from the total.

**Step 1: Convert to string representation**
We'll work with the string "20" to handle digits individually.

**Step 2: Count numbers with no repeated digits**
We need to count numbers ≤ 20 with all distinct digits. Let's break this down:

1. **Numbers with 1 digit (1-9):** All 9 numbers (1-9) have distinct digits (they're single digits).

2. **Numbers with 2 digits (10-20):** We need to count 2-digit numbers ≤ 20 with distinct digits:
   - 10: digits 1 and 0 are distinct ✓
   - 11: digits 1 and 1 are repeated ✗
   - 12: digits 1 and 2 are distinct ✓
   - 13: digits 1 and 3 are distinct ✓
   - 14: digits 1 and 4 are distinct ✓
   - 15: digits 1 and 5 are distinct ✓
   - 16: digits 1 and 6 are distinct ✓
   - 17: digits 1 and 7 are distinct ✓
   - 18: digits 1 and 8 are distinct ✓
   - 19: digits 1 and 9 are distinct ✓
   - 20: digits 2 and 0 are distinct ✓

   That's 10 numbers (excluding 11). So total numbers with distinct digits = 9 (1-digit) + 10 (2-digit) = 19.

**Step 3: Calculate numbers with repeated digits**
Total numbers from 1 to 20 = 20.
Numbers with repeated digits = Total - Numbers with distinct digits = 20 - 19 = 1.

Indeed, only 11 has a repeated digit in the range 1-20.

The challenge is doing this efficiently for large `n` without checking each number individually.

## Brute Force Approach

The brute force approach is straightforward: iterate through all numbers from 1 to `n`, convert each to a string, check if it has any repeated digits using a set, and count those that do.

<div class="code-group">

```python
# Time: O(n * d) where d is number of digits (up to 10) | Space: O(d)
def numDupDigitsAtMostN_brute(n: int) -> int:
    count = 0
    for num in range(1, n + 1):
        s = str(num)
        if len(s) != len(set(s)):  # Repeated digit if string length ≠ set length
            count += 1
    return count
```

```javascript
// Time: O(n * d) where d is number of digits (up to 10) | Space: O(d)
function numDupDigitsAtMostN_brute(n) {
  let count = 0;
  for (let num = 1; num <= n; num++) {
    const s = num.toString();
    const set = new Set(s);
    if (s.length !== set.size) {
      // Repeated digit if string length ≠ set size
      count++;
    }
  }
  return count;
}
```

```java
// Time: O(n * d) where d is number of digits (up to 10) | Space: O(d)
public int numDupDigitsAtMostN_brute(int n) {
    int count = 0;
    for (int num = 1; num <= n; num++) {
        String s = Integer.toString(num);
        Set<Character> set = new HashSet<>();
        for (char c : s.toCharArray()) {
            set.add(c);
        }
        if (s.length() != set.size()) {  // Repeated digit if string length ≠ set size
            count++;
        }
    }
    return count;
}
```

</div>

**Why this fails:** When `n = 10⁹`, we need to check a billion numbers. Each check takes O(d) time where d is the number of digits (up to 10). That's roughly 10 billion operations, which is far too slow. We need a solution that scales with the number of digits, not with `n` itself.

## Optimized Approach

The key insight is to use **complementary counting**: instead of counting numbers _with_ repeated digits, count numbers _without_ repeated digits and subtract from `n`.

**Step 1: Count numbers with all distinct digits**
We need to count numbers ≤ `n` with all distinct digits. Let `digits` be the string representation of `n`.

1. **Count numbers with fewer digits than `n`:**
   - For length `k` (where 1 ≤ k < len(digits)), count all k-digit numbers with distinct digits.
   - For the first digit: 9 choices (1-9, can't be 0)
   - For each subsequent digit: decreasing choices (9, 8, 7, ...) because we can't reuse digits
   - Formula: 9 × 9 × 8 × 7 × ... for k digits

2. **Count numbers with same number of digits as `n` and ≤ `n`:**
   - Use digit dynamic programming (DP) with memoization
   - Process digits from left to right
   - Keep track of which digits have been used
   - At each position, count numbers where we choose a digit less than the current digit of `n`
   - Handle leading zeros carefully (they're not used digits)

**Step 2: Subtract from total**
Numbers with repeated digits = `n` - numbers with all distinct digits

**Why this works:** We're counting possibilities combinatorially rather than iterating through all numbers. The time complexity depends on the number of digits (max 10), not on `n`.

## Optimal Solution

We implement the combinatorial counting approach using digit DP with memoization.

<div class="code-group">

```python
# Time: O(d * 2^10 * 10) where d is number of digits (max 10) | Space: O(d * 2^10)
def numDupDigitsAtMostN(n: int) -> int:
    # Convert n to string to process digits
    s = str(n)
    length = len(s)

    # Memoization: dp[pos][mask][is_limit][is_started]
    # pos: current digit position (0 to length)
    # mask: bitmask of used digits (10 bits for digits 0-9)
    # is_limit: whether we're bound by the original number's digits
    # is_started: whether we've started placing non-zero digits
    from functools import lru_cache

    @lru_cache(None)
    def dfs(pos, mask, is_limit, is_started):
        # Base case: processed all digits
        if pos == length:
            return 1 if is_started else 0  # Count valid numbers (non-zero)

        total = 0
        # Determine the upper bound for current digit
        upper = int(s[pos]) if is_limit else 9

        # Try each possible digit
        for digit in range(0, upper + 1):
            # Skip if digit is already used (unless it's 0 and we haven't started)
            if mask >> digit & 1 and (digit != 0 or is_started):
                continue

            # Update states for next recursion
            new_is_limit = is_limit and (digit == upper)
            new_is_started = is_started or (digit != 0)
            new_mask = mask

            # Mark digit as used if we've started (or if digit is non-zero)
            if new_is_started:
                new_mask |= 1 << digit

            total += dfs(pos + 1, new_mask, new_is_limit, new_is_started)

        return total

    # Count numbers with all distinct digits (including 0, which we'll subtract)
    distinct_count = dfs(0, 0, True, False)

    # Total numbers from 1 to n = n
    # Numbers with repeated digits = total - numbers with all distinct digits
    return n - distinct_count
```

```javascript
// Time: O(d * 2^10 * 10) where d is number of digits (max 10) | Space: O(d * 2^10)
function numDupDigitsAtMostN(n) {
  // Convert n to string to process digits
  const s = n.toString();
  const length = s.length;

  // Memoization: dp[pos][mask][isLimit][isStarted]
  const memo = new Map();

  function dfs(pos, mask, isLimit, isStarted) {
    // Base case: processed all digits
    if (pos === length) {
      return isStarted ? 1 : 0; // Count valid numbers (non-zero)
    }

    // Create memoization key
    const key = `${pos},${mask},${isLimit},${isStarted}`;
    if (memo.has(key)) return memo.get(key);

    let total = 0;
    // Determine the upper bound for current digit
    const upper = isLimit ? parseInt(s[pos]) : 9;

    // Try each possible digit
    for (let digit = 0; digit <= upper; digit++) {
      // Skip if digit is already used (unless it's 0 and we haven't started)
      if ((mask >> digit) & 1 && (digit !== 0 || isStarted)) {
        continue;
      }

      // Update states for next recursion
      const newIsLimit = isLimit && digit === upper;
      const newIsStarted = isStarted || digit !== 0;
      let newMask = mask;

      // Mark digit as used if we've started (or if digit is non-zero)
      if (newIsStarted) {
        newMask |= 1 << digit;
      }

      total += dfs(pos + 1, newMask, newIsLimit, newIsStarted);
    }

    memo.set(key, total);
    return total;
  }

  // Count numbers with all distinct digits (including 0, which we'll subtract)
  const distinctCount = dfs(0, 0, true, false);

  // Total numbers from 1 to n = n
  // Numbers with repeated digits = total - numbers with all distinct digits
  return n - distinctCount;
}
```

```java
// Time: O(d * 2^10 * 10) where d is number of digits (max 10) | Space: O(d * 2^10)
class Solution {
    public int numDupDigitsAtMostN(int n) {
        // Convert n to string to process digits
        String s = Integer.toString(n);
        int length = s.length();

        // Memoization: dp[pos][mask][isLimit][isStarted]
        Integer[][][][] memo = new Integer[length][1 << 10][2][2];

        return n - dfs(0, 0, true, false, s, length, memo);
    }

    private int dfs(int pos, int mask, boolean isLimit, boolean isStarted,
                   String s, int length, Integer[][][][] memo) {
        // Base case: processed all digits
        if (pos == length) {
            return isStarted ? 1 : 0;  // Count valid numbers (non-zero)
        }

        // Convert booleans to indices for memoization
        int limitIdx = isLimit ? 1 : 0;
        int startedIdx = isStarted ? 1 : 0;

        // Check memoization
        if (memo[pos][mask][limitIdx][startedIdx] != null) {
            return memo[pos][mask][limitIdx][startedIdx];
        }

        int total = 0;
        // Determine the upper bound for current digit
        int upper = isLimit ? s.charAt(pos) - '0' : 9;

        // Try each possible digit
        for (int digit = 0; digit <= upper; digit++) {
            // Skip if digit is already used (unless it's 0 and we haven't started)
            if (((mask >> digit) & 1) == 1 && (digit != 0 || isStarted)) {
                continue;
            }

            // Update states for next recursion
            boolean newIsLimit = isLimit && (digit == upper);
            boolean newIsStarted = isStarted || (digit != 0);
            int newMask = mask;

            // Mark digit as used if we've started (or if digit is non-zero)
            if (newIsStarted) {
                newMask |= (1 << digit);
            }

            total += dfs(pos + 1, newMask, newIsLimit, newIsStarted, s, length, memo);
        }

        // Store result in memoization table
        memo[pos][mask][limitIdx][startedIdx] = total;
        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(d × 2^10 × 10) where d is the number of digits in `n` (maximum 10).

- We have d positions (digits) to process
- For each position, we have 2^10 possible masks (bitmask of used digits, 10 bits)
- For each mask, we try up to 10 possible digits (0-9)
- In practice, many states are unreachable, so it's much faster

**Space Complexity:** O(d × 2^10) for the memoization table

- We store results for each combination of (position, mask, is_limit, is_started)
- The is_limit and is_started add constant factors (2×2=4)

This is exponentially faster than the brute force O(n) approach when n is large.

## Common Mistakes

1. **Forgetting to handle leading zeros:** When counting numbers with distinct digits, leading zeros don't count as "used" digits. A number like 0123 is actually 123. Failing to handle this will undercount valid numbers.

2. **Incorrect bitmask handling:** Using the wrong bitmask operations or forgetting to check if a digit is already used. Remember: `mask >> digit & 1` checks if digit is used, and `mask | (1 << digit)` marks digit as used.

3. **Off-by-one errors with the limit:** When `is_limit` is true, the current digit can only go up to the corresponding digit in `n`. Forgetting to propagate the `is_limit` flag correctly (only true when previous digits matched `n` and current digit equals `n`'s digit) will overcount.

4. **Not counting zero as a valid number:** The problem asks for numbers from 1 to n, but our DFS might count 0. We need to ensure we only count numbers where `is_started` is true at the end, or subtract 1 from the result.

## When You'll See This Pattern

This **digit DP with bitmask** pattern appears in problems where we need to count numbers with specific digit properties:

1. **Count Numbers With Unique Digits (LeetCode 357):** Count numbers with all unique digits from 0 to 10^n. This is a simpler version without the upper bound constraint.

2. **Count Special Integers (LeetCode 2376):** Very similar problem - count numbers with distinct digits up to n.

3. **Non-negative Integers without Consecutive Ones (LeetCode 600):** Uses digit DP to count numbers without consecutive 1s in binary representation.

The pattern is: when you need to count numbers with specific digit properties up to a large `n`, think digit DP with state tracking (used digits, previous digit, limits, etc.).

## Key Takeaways

1. **Complementary counting is powerful:** When direct counting is hard, count the complement and subtract. Here, counting numbers _without_ repeated digits is easier than counting those _with_ repeated digits.

2. **Digit DP handles large ranges efficiently:** By processing digits independently rather than iterating through all numbers, we reduce complexity from O(n) to O(d × states).

3. **Bitmasks efficiently track sets:** When tracking which digits/characters have been used (max 10 digits or 26 letters), bitmasks provide O(1) checks and updates with minimal memory.

Related problems: [Count the Number of Powerful Integers](/problem/count-the-number-of-powerful-integers)
