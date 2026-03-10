---
title: "How to Solve Number of Smooth Descent Periods of a Stock — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Smooth Descent Periods of a Stock. Medium difficulty, 67.7% acceptance rate. Topics: Array, Math, Two Pointers, Dynamic Programming, Sliding Window."
date: "2026-10-22"
category: "dsa-patterns"
tags: ["number-of-smooth-descent-periods-of-a-stock", "array", "math", "two-pointers", "medium"]
---

# How to Solve Number of Smooth Descent Periods of a Stock

This problem asks us to count all contiguous subarrays where each element is exactly one less than the previous element. While it sounds simple, the challenge lies in doing this efficiently for large arrays where a brute force approach would be too slow. The interesting insight is recognizing that each new valid element extends all previous valid subarrays, creating a pattern similar to counting arithmetic sequences.

## Visual Walkthrough

Let's trace through the example `prices = [3, 2, 1, 4]` step by step:

**Day 0 (price = 3):**

- Single day subarray: [3] → valid (1 period)
- Total so far: 1

**Day 1 (price = 2):**

- Check if 2 = 3 - 1? Yes, it continues the descent
- New subarrays ending at day 1:
  - [2] (single day) → valid
  - [3, 2] (extends previous) → valid
- We add 2 new periods (1 for the single day + 1 for extending previous)
- Total: 1 + 2 = 3

**Day 2 (price = 1):**

- Check if 1 = 2 - 1? Yes, continues descent
- New subarrays ending at day 2:
  - [1] (single day) → valid
  - [2, 1] (extends day 1's single day) → valid
  - [3, 2, 1] (extends day 1's 2-day period) → valid
- We add 3 new periods (1 + 2 from previous)
- Total: 3 + 3 = 6

**Day 3 (price = 4):**

- Check if 4 = 1 - 1? No (4 ≠ 0), descent breaks
- Only [4] (single day) is valid
- We add just 1 new period
- Total: 6 + 1 = 7

The key pattern: when we have a continuing descent, each new day adds `(current streak length)` new valid periods. When the descent breaks, we reset to just 1.

## Brute Force Approach

The most straightforward approach is to check every possible subarray:

1. Generate all possible starting indices `i` from 0 to n-1
2. For each starting index, generate all ending indices `j` from i to n-1
3. Check if the subarray `prices[i:j+1]` forms a smooth descent (each element is exactly 1 less than previous)
4. Count all valid subarrays

This approach requires O(n³) time in the worst case (O(n²) subarrays, each checked in O(n) time). For an array of length 10⁵ (common in LeetCode constraints), this would require checking roughly 10¹⁵ operations, which is completely infeasible.

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def bruteForce(prices):
    n = len(prices)
    count = 0

    # Check all possible subarrays
    for i in range(n):
        for j in range(i, n):
            # Check if prices[i:j+1] is a smooth descent
            valid = True
            for k in range(i + 1, j + 1):
                if prices[k] != prices[k-1] - 1:
                    valid = False
                    break
            if valid:
                count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function bruteForce(prices) {
  const n = prices.length;
  let count = 0;

  // Check all possible subarrays
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Check if prices[i..j] is a smooth descent
      let valid = true;
      for (let k = i + 1; k <= j; k++) {
        if (prices[k] !== prices[k - 1] - 1) {
          valid = false;
          break;
        }
      }
      if (valid) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public long bruteForce(int[] prices) {
    int n = prices.length;
    long count = 0;

    // Check all possible subarrays
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Check if prices[i..j] is a smooth descent
            boolean valid = true;
            for (int k = i + 1; k <= j; k++) {
                if (prices[k] != prices[k-1] - 1) {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we don't need to check every subarray independently. Instead, we can use a **dynamic programming** or **sliding window** approach:

1. **Observation**: A smooth descent period must be contiguous. If `prices[i:j]` is valid, then `prices[i:j-1]` must also be valid.
2. **Pattern**: When we're at day `i`, if `prices[i] = prices[i-1] - 1`, then we're continuing a descent. Each new valid day extends all valid subarrays that ended at the previous day.
3. **Counting trick**: If we have a current streak of length `k` where each consecutive pair differs by exactly 1, then the number of new smooth descent periods ending at the current day is exactly `k`. This is because:
   - The single day `[current]` is valid (1 period)
   - The 2-day period `[previous, current]` is valid (1 period)
   - The 3-day period `[two days ago, previous, current]` is valid (1 period)
   - ... up to the k-day period starting k-1 days ago
4. **Reset condition**: When `prices[i] ≠ prices[i-1] - 1`, the streak breaks and we start over from 1.

This reduces the problem to a single pass through the array, counting streaks of consecutive elements where each is exactly 1 less than the previous.

## Optimal Solution

We maintain a `currentStreak` counter that tracks how many consecutive days we've had a smooth descent ending at the current day. For each day, we add `currentStreak` to our total count.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def getDescentPeriods(prices):
    """
    Counts all smooth descent periods in the stock prices.

    A smooth descent period is a contiguous subarray where each
    element is exactly 1 less than the previous element.

    Args:
        prices: List of daily stock prices

    Returns:
        Total number of smooth descent periods
    """
    n = len(prices)
    total_periods = 0
    current_streak = 1  # Start with 1 for the first day

    for i in range(n):
        # If we're continuing a descent from previous day
        if i > 0 and prices[i] == prices[i-1] - 1:
            # Extend the current streak
            current_streak += 1
        else:
            # Start a new streak (single day)
            current_streak = 1

        # Add all periods ending at current day
        # current_streak represents the number of valid subarrays
        # that end at position i
        total_periods += current_streak

    return total_periods
```

```javascript
// Time: O(n) | Space: O(1)
function getDescentPeriods(prices) {
  /**
   * Counts all smooth descent periods in the stock prices.
   *
   * A smooth descent period is a contiguous subarray where each
   * element is exactly 1 less than the previous element.
   *
   * @param {number[]} prices - Array of daily stock prices
   * @return {number} Total number of smooth descent periods
   */
  const n = prices.length;
  let totalPeriods = 0;
  let currentStreak = 1; // Start with 1 for the first day

  for (let i = 0; i < n; i++) {
    // If we're continuing a descent from previous day
    if (i > 0 && prices[i] === prices[i - 1] - 1) {
      // Extend the current streak
      currentStreak++;
    } else {
      // Start a new streak (single day)
      currentStreak = 1;
    }

    // Add all periods ending at current day
    // currentStreak represents the number of valid subarrays
    // that end at position i
    totalPeriods += currentStreak;
  }

  return totalPeriods;
}
```

```java
// Time: O(n) | Space: O(1)
public long getDescentPeriods(int[] prices) {
    /**
     * Counts all smooth descent periods in the stock prices.
     *
     * A smooth descent period is a contiguous subarray where each
     * element is exactly 1 less than the previous element.
     *
     * @param prices Array of daily stock prices
     * @return Total number of smooth descent periods
     */
    int n = prices.length;
    long totalPeriods = 0;
    int currentStreak = 1;  // Start with 1 for the first day

    for (int i = 0; i < n; i++) {
        // If we're continuing a descent from previous day
        if (i > 0 && prices[i] == prices[i-1] - 1) {
            // Extend the current streak
            currentStreak++;
        } else {
            // Start a new streak (single day)
            currentStreak = 1;
        }

        // Add all periods ending at current day
        // currentStreak represents the number of valid subarrays
        // that end at position i
        totalPeriods += currentStreak;
    }

    return totalPeriods;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array of length `n`
- Each iteration performs constant-time operations (comparison, addition)
- No nested loops or expensive operations

**Space Complexity: O(1)**

- We only use a few variables (`totalPeriods`, `currentStreak`, loop index)
- No additional data structures that scale with input size
- The input array is given and not counted toward our space usage

## Common Mistakes

1. **Using int instead of long for the count**: With n up to 10⁵, the maximum answer can be n\*(n+1)/2 ≈ 5×10⁹, which exceeds 32-bit integer range. Always use 64-bit integers (long in Java/C++, long long in C) for counting problems with large n.

2. **Off-by-one errors in streak calculation**: A common mistake is starting `currentStreak` at 0 instead of 1. Remember that even a single day counts as a valid period, so when we start a new streak, it should be 1, not 0.

3. **Incorrect comparison condition**: The problem says "lower than the price on the preceding day" but the examples show it must be exactly 1 less. Some candidates mistakenly check `prices[i] < prices[i-1]` instead of `prices[i] == prices[i-1] - 1`.

4. **Not resetting streak properly**: When the descent breaks, you must reset `currentStreak` to 1 (for the current single day), not to 0. The reset value represents the number of valid subarrays ending at the current position when starting a new streak.

## When You'll See This Pattern

This "streak counting" pattern appears in many array problems where you need to count contiguous subarrays satisfying some condition:

1. **Number of Zero-Filled Subarrays (LeetCode 2348)**: Count all subarrays filled entirely with 0s. The solution uses the same streak pattern: each new zero extends all previous zero subarrays.

2. **Arithmetic Slices (LeetCode 413)**: Count arithmetic subarrays (consecutive elements with same difference). While slightly more complex (needs difference of 3+ elements), it uses similar streak-based counting.

3. **Subarray Product Less Than K (LeetCode 713)**: Count subarrays with product less than K. Uses a sliding window approach but shares the "count subarrays ending at each position" thinking.

4. **Max Consecutive Ones (LeetCode 485)**: Find the maximum length of consecutive 1s. While it finds max instead of counting all, it uses the same streak tracking mechanism.

## Key Takeaways

1. **Streak-based counting**: When counting contiguous subarrays with a property that can be checked locally (between consecutive elements), track the current streak length. The number of new valid subarrays ending at position i often equals the current streak length.

2. **End-at-position thinking**: Instead of counting all subarrays directly, count how many valid subarrays **end at each position**. This often leads to simpler O(n) solutions.

3. **Mathematical insight**: For a streak of length k where each consecutive pair satisfies a condition, there are exactly k subarrays ending at the current position that satisfy the condition (sizes 1, 2, ..., k).

Related problems: [Subarray Product Less Than K](/problem/subarray-product-less-than-k), [Number of Valid Subarrays](/problem/number-of-valid-subarrays), [Number of Zero-Filled Subarrays](/problem/number-of-zero-filled-subarrays)
