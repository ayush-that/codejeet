---
title: "How to Solve Number of Zero-Filled Subarrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Zero-Filled Subarrays. Medium difficulty, 70.1% acceptance rate. Topics: Array, Math."
date: "2027-12-28"
category: "dsa-patterns"
tags: ["number-of-zero-filled-subarrays", "array", "math", "medium"]
---

# How to Solve Number of Zero-Filled Subarrays

This problem asks us to count all contiguous subarrays in an array that contain only zeros. While the concept is straightforward, the challenge lies in doing this efficiently—a brute force check of every possible subarray would be too slow for large arrays. The interesting insight is recognizing that counting zero-filled subarrays is fundamentally about counting arithmetic sequences within runs of consecutive zeros.

## Visual Walkthrough

Let's trace through the example `nums = [1, 0, 0, 0, 2, 0, 0]` step by step:

1. **Index 0 (value 1)**: Not zero, so no zero-filled subarrays end here.
2. **Index 1 (value 0)**: We have our first zero. A single zero forms exactly 1 zero-filled subarray: `[0]`.
3. **Index 2 (value 0)**: We now have two consecutive zeros. The new subarrays ending here are:
   - `[0, 0]` (the entire two-zero sequence)
   - `[0]` (just the second zero)
     That's 2 new subarrays, making a total of 1 + 2 = 3 so far.
4. **Index 3 (value 0)**: Three consecutive zeros. New subarrays ending here:
   - `[0, 0, 0]` (all three zeros)
   - `[0, 0]` (last two zeros)
   - `[0]` (just the third zero)
     That's 3 new subarrays, total becomes 3 + 3 = 6.
5. **Index 4 (value 2)**: Not zero, breaks the streak. No new subarrays.
6. **Index 5 (value 0)**: New streak begins. 1 new subarray, total becomes 7.
7. **Index 6 (value 0)**: Two consecutive zeros in this new streak. 2 new subarrays, total becomes 9.

Notice the pattern: when we encounter a zero, the number of **new** zero-filled subarrays ending at the current position equals the length of the current consecutive zero streak. The total count accumulates these contributions.

## Brute Force Approach

The most straightforward approach is to check every possible subarray:

1. Generate all possible starting indices `i` from 0 to n-1
2. For each starting index, generate all possible ending indices `j` from i to n-1
3. For each subarray `nums[i..j]`, check if all elements are zero
4. Increment a counter whenever we find a zero-filled subarray

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def zeroFilledSubarray(nums):
    n = len(nums)
    count = 0

    # Check every possible subarray
    for i in range(n):
        for j in range(i, n):
            # Check if all elements in nums[i..j] are zero
            all_zero = True
            for k in range(i, j + 1):
                if nums[k] != 0:
                    all_zero = False
                    break

            if all_zero:
                count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function zeroFilledSubarray(nums) {
  const n = nums.length;
  let count = 0;

  // Check every possible subarray
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Check if all elements in nums[i..j] are zero
      let allZero = true;
      for (let k = i; k <= j; k++) {
        if (nums[k] !== 0) {
          allZero = false;
          break;
        }
      }

      if (allZero) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public long zeroFilledSubarray(int[] nums) {
    int n = nums.length;
    long count = 0;

    // Check every possible subarray
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Check if all elements in nums[i..j] are zero
            boolean allZero = true;
            for (int k = i; k <= j; k++) {
                if (nums[k] != 0) {
                    allZero = false;
                    break;
                }
            }

            if (allZero) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** With three nested loops, this runs in O(n³) time. For an array of size 10⁵ (common in LeetCode constraints), this would require up to 10¹⁵ operations—far too slow. We need a linear solution.

## Optimized Approach

The key insight is that we don't need to check every subarray explicitly. Instead, we can process the array in a single pass and use a mathematical formula:

1. As we iterate through the array, we maintain `currentStreak`—the length of the current consecutive zero sequence.
2. Whenever we encounter a zero:
   - Increment `currentStreak` by 1 (extending the current streak)
   - Add `currentStreak` to our total count
3. Whenever we encounter a non-zero:
   - Reset `currentStreak` to 0 (breaking the streak)

**Why does this work?** Consider a streak of `k` consecutive zeros. The number of zero-filled subarrays that **end at the last position** of this streak is exactly `k`:

- The subarray containing all `k` zeros
- The subarray containing the last `k-1` zeros
- The subarray containing the last `k-2` zeros
- ...
- The subarray containing just the last zero

This is the sum 1 + 2 + 3 + ... + k, but we accumulate it incrementally as we build the streak, not all at once.

## Optimal Solution

Here's the efficient implementation using the single-pass approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def zeroFilledSubarray(nums):
    """
    Counts all subarrays filled with zeros.

    The key insight: for a streak of k consecutive zeros,
    the number of zero-filled subarrays ending at position i
    equals the current streak length.

    Args:
        nums: List of integers

    Returns:
        Total count of zero-filled subarrays
    """
    total_count = 0
    current_streak = 0  # Length of current consecutive zero streak

    for num in nums:
        if num == 0:
            # Extend the current zero streak
            current_streak += 1
            # Add all new subarrays ending at current position
            total_count += current_streak
        else:
            # Non-zero breaks the streak
            current_streak = 0

    return total_count
```

```javascript
// Time: O(n) | Space: O(1)
function zeroFilledSubarray(nums) {
  /**
   * Counts all subarrays filled with zeros.
   *
   * The key insight: for a streak of k consecutive zeros,
   * the number of zero-filled subarrays ending at position i
   * equals the current streak length.
   *
   * @param {number[]} nums - Array of integers
   * @return {number} Total count of zero-filled subarrays
   */
  let totalCount = 0;
  let currentStreak = 0; // Length of current consecutive zero streak

  for (const num of nums) {
    if (num === 0) {
      // Extend the current zero streak
      currentStreak++;
      // Add all new subarrays ending at current position
      totalCount += currentStreak;
    } else {
      // Non-zero breaks the streak
      currentStreak = 0;
    }
  }

  return totalCount;
}
```

```java
// Time: O(n) | Space: O(1)
public long zeroFilledSubarray(int[] nums) {
    /**
     * Counts all subarrays filled with zeros.
     *
     * The key insight: for a streak of k consecutive zeros,
     * the number of zero-filled subarrays ending at position i
     * equals the current streak length.
     *
     * @param nums Array of integers
     * @return Total count of zero-filled subarrays
     */
    long totalCount = 0;
    int currentStreak = 0;  // Length of current consecutive zero streak

    for (int num : nums) {
        if (num == 0) {
            // Extend the current zero streak
            currentStreak++;
            // Add all new subarrays ending at current position
            totalCount += currentStreak;
        } else {
            // Non-zero breaks the streak
            currentStreak = 0;
        }
    }

    return totalCount;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, performing constant-time operations for each element.
- The loop runs exactly n times, where n is the length of the input array.

**Space Complexity: O(1)**

- We only use a fixed number of variables (`total_count` and `current_streak`), regardless of input size.
- No additional data structures that grow with input size are used.

## Common Mistakes

1. **Using integer instead of long for the count (in Java/C++)**: The result can be very large. For an array of 100,000 zeros, the answer is 100,000 \* 100,001 / 2 ≈ 5 billion, which exceeds 32-bit integer range. Always use 64-bit integers (`long` in Java, `long long` in C++) for the counter.

2. **Resetting the streak incorrectly**: Some candidates reset `current_streak` to 0 when encountering non-zero, but forget to do it at the end of the array. Actually, we don't need to reset at the end since the loop ends anyway, but forgetting to reset when seeing non-zeros is a critical error.

3. **Adding 1 instead of `current_streak`**: A subtle mistake is adding just 1 for each zero instead of the current streak length. This would undercount because each new zero in a streak creates multiple new subarrays, not just one.

4. **Overcomplicating with prefix sums or two pointers**: While valid, these approaches are more complex than necessary. The single variable `current_streak` is sufficient and cleaner.

## When You'll See This Pattern

This "streak counting" pattern appears in many problems where you need to count contiguous sequences satisfying some property:

1. **Arithmetic Slices (LeetCode 413)**: Count contiguous arithmetic sequences (constant difference between consecutive elements). Similar to counting zero streaks, but with a more complex condition.

2. **Number of Smooth Descent Periods of a Stock (LeetCode 2110)**: Count contiguous periods where stock prices decrease by exactly 1 each day. This is essentially the same pattern with a different condition (difference of -1 instead of all zeros).

3. **Length of the Longest Alphabetical Continuous Substring (LeetCode 2414)**: Find the longest streak where letters are consecutive in the alphabet. While this asks for maximum length rather than count, it uses the same streak-tracking technique.

The core pattern: when you need to count or analyze contiguous sequences with some property, track the current streak length and update your answer based on how the streak grows or breaks.

## Key Takeaways

1. **Streak-based counting**: When counting contiguous sequences with a property, track the current streak length. The contribution of each new element to the total count often depends on the current streak length.

2. **Mathematical insight matters**: Recognize that for a streak of length k, the number of valid subarrays ending at the last position is k. This avoids the need for nested loops.

3. **Watch for integer overflow**: When counting combinations or sequences, results can grow quickly. Use appropriate data types (64-bit integers) to avoid overflow, especially in languages like Java and C++.

Related problems: [Arithmetic Slices](/problem/arithmetic-slices), [Number of Smooth Descent Periods of a Stock](/problem/number-of-smooth-descent-periods-of-a-stock), [Length of the Longest Alphabetical Continuous Substring](/problem/length-of-the-longest-alphabetical-continuous-substring)
