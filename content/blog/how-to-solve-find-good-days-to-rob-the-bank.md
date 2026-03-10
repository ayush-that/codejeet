---
title: "How to Solve Find Good Days to Rob the Bank — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Good Days to Rob the Bank. Medium difficulty, 51.4% acceptance rate. Topics: Array, Dynamic Programming, Prefix Sum."
date: "2028-10-12"
category: "dsa-patterns"
tags: ["find-good-days-to-rob-the-bank", "array", "dynamic-programming", "prefix-sum", "medium"]
---

# How to Solve "Find Good Days to Rob the Bank"

This problem asks us to find days where the number of guards is non-increasing for `time` days before and non-decreasing for `time` days after. What makes this tricky is that we need to efficiently check both directions for every possible day without repeatedly scanning the same elements. The brute force approach would be too slow for large inputs, so we need a smarter way to precompute the necessary information.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `security = [5,3,3,3,5,6,4]`, `time = 2`

We need to find days `i` where:

1. For all `j` in `[i-time, i-1]`: `security[j] >= security[j+1]` (non-increasing before)
2. For all `k` in `[i+1, i+time]`: `security[k] <= security[k+1]` (non-decreasing after)

Let's manually check each day:

- **Day 0**: Can't check 2 days before (out of bounds) → ❌
- **Day 1**: Can't check 2 days before (day -1 out of bounds) → ❌
- **Day 2**:
  - Before: Days 0-1: 5→3 (decrease), 3→3 (equal) → non-increasing ✓
  - After: Days 3-4: 3→3 (equal), 3→5 (increase) → non-decreasing ✓ → ✅ Good day
- **Day 3**:
  - Before: Days 1-2: 3→3 (equal), 3→3 (equal) → non-increasing ✓
  - After: Days 4-5: 3→5 (increase), 5→6 (increase) → non-decreasing ✓ → ✅ Good day
- **Day 4**:
  - Before: Days 2-3: 3→3 (equal), 3→3 (equal) → non-increasing ✓
  - After: Days 5-6: 5→6 (increase), 6→4 (decrease) → ❌ (day 6 decreases)
- **Day 5**: After needs day 7 (out of bounds) → ❌
- **Day 6**: After needs day 8 (out of bounds) → ❌

**Result:** `[2, 3]`

The key insight: We're checking the same relationships repeatedly. Day 3 checks if 3→3 is non-increasing, which Day 2 already checked. We can precompute this information!

## Brute Force Approach

The naive solution would be to check each day individually by scanning `time` days before and after:

1. For each day `i` from `time` to `n-time-1` (to avoid bounds issues)
2. Check if `security[j] >= security[j+1]` for all `j` from `i-time` to `i-1`
3. Check if `security[k] <= security[k+1]` for all `k` from `i` to `i+time-1`
4. If both conditions hold, add `i` to result

**Why it's too slow:** This takes O(n × time) time. In the worst case where `time ≈ n`, this becomes O(n²), which is too slow for n up to 10⁵. We're repeatedly checking the same adjacent pairs - when checking day `i` and day `i+1`, we're re-checking most of the same relationships.

## Optimized Approach

The key insight is that we can **precompute** two arrays:

1. `nonInc[i]`: How many consecutive days before day `i` (including `i`) are non-increasing
2. `nonDec[i]`: How many consecutive days after day `i` (including `i`) are non-decreasing

**Step-by-step reasoning:**

1. **Left-to-right scan for non-increasing streaks:**
   - Start with `nonInc[0] = 1` (a single day is trivially non-increasing)
   - For each day `i > 0`:
     - If `security[i] <= security[i-1]`, the streak continues: `nonInc[i] = nonInc[i-1] + 1`
     - Otherwise, streak breaks: `nonInc[i] = 1`

2. **Right-to-left scan for non-decreasing streaks:**
   - Start with `nonDec[n-1] = 1`
   - For each day `i` from `n-2` down to `0`:
     - If `security[i] <= security[i+1]`, the streak continues: `nonDec[i] = nonDec[i+1] + 1`
     - Otherwise, streak breaks: `nonDec[i] = 1`

3. **Check each day:**
   - Day `i` is valid if `nonInc[i] > time` (has at least `time` non-increasing days before, including itself)
   - AND `nonDec[i] > time` (has at least `time` non-decreasing days after, including itself)
   - Wait, careful: We need exactly `time` days before and after, not including day `i` itself!
   - Actually: We need `nonInc[i] >= time + 1` (day `i` plus `time` days before)
   - And `nonDec[i] >= time + 1` (day `i` plus `time` days after)

This approach runs in O(n) time with O(n) space - a huge improvement!

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def goodDaysToRobBank(security, time):
    """
    Find days where guards are non-increasing for 'time' days before
    and non-decreasing for 'time' days after.

    Args:
        security: List of guard counts per day
        time: Number of days required before/after

    Returns:
        List of good days to rob the bank
    """
    n = len(security)

    # Edge case: if time is 0, all days are valid
    if time == 0:
        return list(range(n))

    # Edge case: not enough days to have 'time' days before and after
    if n < 2 * time + 1:
        return []

    # Step 1: Precompute non-increasing streaks from left to right
    # non_inc[i] = length of non-increasing streak ending at i
    non_inc = [1] * n
    for i in range(1, n):
        if security[i] <= security[i - 1]:
            # Streak continues: current day <= previous day
            non_inc[i] = non_inc[i - 1] + 1
        else:
            # Streak breaks: current day > previous day
            non_inc[i] = 1

    # Step 2: Precompute non-decreasing streaks from right to left
    # non_dec[i] = length of non-decreasing streak starting at i
    non_dec = [1] * n
    for i in range(n - 2, -1, -1):
        if security[i] <= security[i + 1]:
            # Streak continues: current day <= next day
            non_dec[i] = non_dec[i + 1] + 1
        else:
            # Streak breaks: current day > next day
            non_dec[i] = 1

    # Step 3: Check each day that has enough room before and after
    result = []
    # We need at least 'time' days before and 'time' days after
    # So valid days are in range [time, n - time - 1]
    for i in range(time, n - time):
        # Check if we have at least 'time + 1' days in both streaks
        # (day i plus 'time' days before/after)
        if non_inc[i] >= time + 1 and non_dec[i] >= time + 1:
            result.append(i)

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function goodDaysToRobBank(security, time) {
  /**
   * Find days where guards are non-increasing for 'time' days before
   * and non-decreasing for 'time' days after.
   *
   * @param {number[]} security - Array of guard counts per day
   * @param {number} time - Number of days required before/after
   * @return {number[]} - List of good days to rob the bank
   */
  const n = security.length;

  // Edge case: if time is 0, all days are valid
  if (time === 0) {
    return Array.from({ length: n }, (_, i) => i);
  }

  // Edge case: not enough days to have 'time' days before and after
  if (n < 2 * time + 1) {
    return [];
  }

  // Step 1: Precompute non-increasing streaks from left to right
  // nonInc[i] = length of non-increasing streak ending at i
  const nonInc = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    if (security[i] <= security[i - 1]) {
      // Streak continues: current day <= previous day
      nonInc[i] = nonInc[i - 1] + 1;
    } else {
      // Streak breaks: current day > previous day
      nonInc[i] = 1;
    }
  }

  // Step 2: Precompute non-decreasing streaks from right to left
  // nonDec[i] = length of non-decreasing streak starting at i
  const nonDec = new Array(n).fill(1);
  for (let i = n - 2; i >= 0; i--) {
    if (security[i] <= security[i + 1]) {
      // Streak continues: current day <= next day
      nonDec[i] = nonDec[i + 1] + 1;
    } else {
      // Streak breaks: current day > next day
      nonDec[i] = 1;
    }
  }

  // Step 3: Check each day that has enough room before and after
  const result = [];
  // We need at least 'time' days before and 'time' days after
  // So valid days are in range [time, n - time - 1]
  for (let i = time; i < n - time; i++) {
    // Check if we have at least 'time + 1' days in both streaks
    // (day i plus 'time' days before/after)
    if (nonInc[i] >= time + 1 && nonDec[i] >= time + 1) {
      result.push(i);
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> goodDaysToRobBank(int[] security, int time) {
        /**
         * Find days where guards are non-increasing for 'time' days before
         * and non-decreasing for 'time' days after.
         *
         * @param security - Array of guard counts per day
         * @param time - Number of days required before/after
         * @return List of good days to rob the bank
         */
        int n = security.length;
        List<Integer> result = new ArrayList<>();

        // Edge case: if time is 0, all days are valid
        if (time == 0) {
            for (int i = 0; i < n; i++) {
                result.add(i);
            }
            return result;
        }

        // Edge case: not enough days to have 'time' days before and after
        if (n < 2 * time + 1) {
            return result;
        }

        // Step 1: Precompute non-increasing streaks from left to right
        // nonInc[i] = length of non-increasing streak ending at i
        int[] nonInc = new int[n];
        nonInc[0] = 1;
        for (int i = 1; i < n; i++) {
            if (security[i] <= security[i - 1]) {
                // Streak continues: current day <= previous day
                nonInc[i] = nonInc[i - 1] + 1;
            } else {
                // Streak breaks: current day > previous day
                nonInc[i] = 1;
            }
        }

        // Step 2: Precompute non-decreasing streaks from right to left
        // nonDec[i] = length of non-decreasing streak starting at i
        int[] nonDec = new int[n];
        nonDec[n - 1] = 1;
        for (int i = n - 2; i >= 0; i--) {
            if (security[i] <= security[i + 1]) {
                // Streak continues: current day <= next day
                nonDec[i] = nonDec[i + 1] + 1;
            } else {
                // Streak breaks: current day > next day
                nonDec[i] = 1;
            }
        }

        // Step 3: Check each day that has enough room before and after
        // We need at least 'time' days before and 'time' days after
        // So valid days are in range [time, n - time - 1]
        for (int i = time; i < n - time; i++) {
            // Check if we have at least 'time + 1' days in both streaks
            // (day i plus 'time' days before/after)
            if (nonInc[i] >= time + 1 && nonDec[i] >= time + 1) {
                result.add(i);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make three passes through the array:
  1. Left-to-right scan to compute non-increasing streaks: O(n)
  2. Right-to-left scan to compute non-decreasing streaks: O(n)
  3. Final pass to check valid days: O(n)
- Total: O(3n) = O(n)

**Space Complexity: O(n)**

- We store two additional arrays of size n: `nonInc` and `nonDec`
- The result list could be up to O(n) in worst case, but this is output space
- Auxiliary space (excluding output): O(2n) = O(n)

## Common Mistakes

1. **Off-by-one errors in the final check:**
   - Mistake: Checking `nonInc[i] >= time` instead of `time + 1`
   - Why: We need `time` days before PLUS the current day
   - Fix: Remember `nonInc[i]` counts streak length including day `i`

2. **Incorrect bounds for the loop:**
   - Mistake: Looping from `0` to `n-1` without checking bounds
   - Why: Day `i` needs `time` days before and after, so `i` must be in `[time, n-time-1]`
   - Fix: Use `for i in range(time, n - time)`

3. **Forgetting edge cases:**
   - When `time = 0`: All days are valid
   - When `n < 2*time + 1`: No days can have enough before/after days
   - Fix: Handle these at the beginning

4. **Confusing non-increasing with strictly decreasing:**
   - Mistake: Using `<` instead of `<=` when comparing adjacent days
   - Why: "Non-increasing" allows equal values (5, 3, 3 is non-increasing)
   - Fix: Use `security[i] <= security[i-1]` for non-increasing check

## When You'll See This Pattern

This "precompute streaks in both directions" pattern appears in problems where you need to check local properties over sliding windows:

1. **Longest Mountain in Array (Medium)** - Find the longest subarray that is first strictly increasing then strictly decreasing. Similar precomputation of increasing/decreasing streaks helps.

2. **Non-decreasing Array (Medium)** - Check if array can be made non-decreasing with at most one modification. Understanding streaks helps identify problematic points.

3. **Find in Mountain Array (Hard)** - Search in an array that increases then decreases. The mountain peak finding uses similar streak logic.

4. **Trapping Rain Water (Hard)** - Precomputing left and right maximums uses the same bidirectional precomputation idea.

The core technique is: **When you need to check a property over a window for each element, precompute the property from both directions to avoid O(n²) complexity.**

## Key Takeaways

1. **Bidirectional precomputation** is powerful for problems requiring checking local windows. Compute left-to-right and right-to-left to capture dependencies in both directions.

2. **Streak counting** is an efficient way to track monotonic sequences. Store the length of the current streak at each position rather than recomputing from scratch.

3. **Pay attention to inclusive/exclusive bounds** when counting. In this problem, `nonInc[i]` includes day `i` in the streak, so we need `time + 1` to get `time` days before plus the current day.

4. **Always handle edge cases early** - zero `time`, insufficient array length, and single-element arrays often break the general logic.

Related problems: [Non-decreasing Array](/problem/non-decreasing-array), [Longest Mountain in Array](/problem/longest-mountain-in-array), [Find in Mountain Array](/problem/find-in-mountain-array)
