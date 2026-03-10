---
title: "How to Solve Maximum Beauty of an Array After Applying Operation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Beauty of an Array After Applying Operation. Medium difficulty, 58.3% acceptance rate. Topics: Array, Binary Search, Sliding Window, Sorting."
date: "2026-12-19"
category: "dsa-patterns"
tags:
  [
    "maximum-beauty-of-an-array-after-applying-operation",
    "array",
    "binary-search",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Maximum Beauty of an Array After Applying Operation

You're given an array `nums` and an integer `k`. You can adjust each element by up to `±k`, but each index can only be modified once. The goal is to maximize the size of a "beautiful" subset where all elements are equal after these adjustments. What makes this problem interesting is that it looks like subset selection, but the operation constraint transforms it into a clever interval overlap problem.

## Visual Walkthrough

Let's trace through `nums = [4, 6, 1, 2]` with `k = 2`:

1. **Understanding the operation**: For each number, we can choose any value in `[num - k, num + k]`. For example:
   - `4` can become any number in `[2, 6]`
   - `6` can become any number in `[4, 8]`
   - `1` can become any number in `[-1, 3]`
   - `2` can become any number in `[0, 4]`

2. **Finding overlap**: We want the largest group of numbers whose adjustment intervals all share at least one common value. Let's sort the numbers first: `[1, 2, 4, 6]`

3. **Checking intervals**:
   - `1`: `[-1, 3]`
   - `2`: `[0, 4]` → overlaps with `1` at `[0, 3]`
   - `4`: `[2, 6]` → overlaps with `1` and `2` at `[2, 3]`
   - `6`: `[4, 8]` → doesn't overlap with `[2, 3]`

4. **Maximum group**: The largest group with overlapping intervals is `[1, 2, 4]` (size 3). They can all become `2` or `3`.

This reveals the core insight: after sorting, we're looking for the longest contiguous subsequence where `nums[right] - nums[left] ≤ 2k`.

## Brute Force Approach

A naive approach would try all possible subsets of indices, check if they can all be adjusted to the same value, and track the maximum size. For each subset of size `m`, we'd need to check if the intersection of all `[nums[i] - k, nums[i] + k]` intervals is non-empty.

The brute force code would look like this:

```python
def maximumBeauty(nums, k):
    n = len(nums)
    max_size = 0

    # Try all subsets using bitmask (only works for n ≤ 20)
    for mask in range(1 << n):
        current = []
        for i in range(n):
            if mask & (1 << i):
                current.append(nums[i])

        if not current:
            continue

        # Check if all intervals overlap
        low = max(num - k for num in current)
        high = min(num + k for num in current)

        if low <= high:
            max_size = max(max_size, len(current))

    return max_size
```

**Why this fails**: With `n` up to 10⁵, trying all `2ⁿ` subsets is impossible. Even for smaller `n`, the `O(2ⁿ × n)` complexity is prohibitive. We need a smarter approach that doesn't examine every subset.

## Optimized Approach

The key insight is that **if we sort the array, the problem reduces to finding the longest subarray where the difference between max and min is ≤ 2k**.

**Reasoning step-by-step**:

1. **Sorting transformation**: After sorting, any beautiful subset will consist of consecutive elements in the sorted array. Why? If we have three numbers `a ≤ b ≤ c` where `a` and `c` can be adjusted to the same value, then `b` must also be adjustable to that same value since its interval contains values between `a` and `c`.

2. **Interval overlap condition**: For a sorted subarray `nums[left...right]`, all elements can become the same value if and only if:

   ```
   nums[right] - nums[left] ≤ 2k
   ```

   This comes from each element `x` having range `[x-k, x+k]`. For the smallest and largest in the group to overlap:

   ```
   (nums[left] + k) ≥ (nums[right] - k)
   => nums[right] - nums[left] ≤ 2k
   ```

3. **Sliding window**: We can use a sliding window to find the longest subarray satisfying this condition. As we expand the right pointer, if the condition breaks, we move the left pointer until it's satisfied again.

4. **Why this works**: The sliding window maintains a valid group where all elements can be adjusted to a common value (specifically, any value in the overlap of their intervals). The window size gives us the maximum beautiful subset size.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def maximumBeauty(nums, k):
    """
    Find the maximum size of a beautiful subset where all elements
    can be adjusted to the same value using ±k operations.

    Approach:
    1. Sort the array to bring numbers with close values together
    2. Use sliding window to find the longest subarray where
       nums[right] - nums[left] ≤ 2k
    3. The window size is our answer
    """
    # Step 1: Sort the array - O(n log n)
    nums.sort()

    left = 0  # Left pointer of our sliding window
    max_beauty = 0  # Track the maximum window size found

    # Step 2: Expand window with right pointer - O(n)
    for right in range(len(nums)):
        # While current window violates the condition (gap too large)
        # Shrink from the left until it's valid again
        while nums[right] - nums[left] > 2 * k:
            left += 1

        # Update maximum beauty with current window size
        # Window size = right - left + 1
        max_beauty = max(max_beauty, right - left + 1)

    return max_beauty
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
function maximumBeauty(nums, k) {
  /**
   * Find the maximum size of a beautiful subset where all elements
   * can be adjusted to the same value using ±k operations.
   *
   * Approach:
   * 1. Sort the array to bring numbers with close values together
   * 2. Use sliding window to find the longest subarray where
   *    nums[right] - nums[left] ≤ 2k
   * 3. The window size is our answer
   */

  // Step 1: Sort the array - O(n log n)
  nums.sort((a, b) => a - b);

  let left = 0; // Left pointer of our sliding window
  let maxBeauty = 0; // Track the maximum window size found

  // Step 2: Expand window with right pointer - O(n)
  for (let right = 0; right < nums.length; right++) {
    // While current window violates the condition (gap too large)
    // Shrink from the left until it's valid again
    while (nums[right] - nums[left] > 2 * k) {
      left++;
    }

    // Update maximum beauty with current window size
    // Window size = right - left + 1
    maxBeauty = Math.max(maxBeauty, right - left + 1);
  }

  return maxBeauty;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;

class Solution {
    public int maximumBeauty(int[] nums, int k) {
        /**
         * Find the maximum size of a beautiful subset where all elements
         * can be adjusted to the same value using ±k operations.
         *
         * Approach:
         * 1. Sort the array to bring numbers with close values together
         * 2. Use sliding window to find the longest subarray where
         *    nums[right] - nums[left] ≤ 2k
         * 3. The window size is our answer
         */

        // Step 1: Sort the array - O(n log n)
        Arrays.sort(nums);

        int left = 0;  // Left pointer of our sliding window
        int maxBeauty = 0;  // Track the maximum window size found

        // Step 2: Expand window with right pointer - O(n)
        for (int right = 0; right < nums.length; right++) {
            // While current window violates the condition (gap too large)
            // Shrink from the left until it's valid again
            while (nums[right] - nums[left] > 2 * k) {
                left++;
            }

            // Update maximum beauty with current window size
            // Window size = right - left + 1
            maxBeauty = Math.max(maxBeauty, right - left + 1);
        }

        return maxBeauty;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: `O(n log n)`

- Sorting the array takes `O(n log n)` time
- The sliding window traversal is `O(n)` since each element is visited at most twice (once by `right`, once by `left`)
- Dominated by the sorting step

**Space Complexity**: `O(1)` or `O(n)` depending on sorting implementation

- In-place sorting (like Python's Timsort) uses `O(1)` additional space
- Some languages' sort implementations may use `O(n)` auxiliary space
- Our algorithm itself uses only `O(1)` extra space for pointers and counters

## Common Mistakes

1. **Forgetting to sort**: The sliding window approach only works on sorted data. Without sorting, `nums[right] - nums[left] ≤ 2k` doesn't guarantee all intermediate elements satisfy the condition.

2. **Using `if` instead of `while`**: When the condition `nums[right] - nums[left] > 2k` is violated, you need a `while` loop to shrink the window, not an `if`. A single `if` might leave the window too large.

3. **Incorrect inequality**: Using `nums[right] - nums[left] ≤ k` instead of `≤ 2k`. Remember each element can move `±k`, so the total allowable gap is `2k`.

4. **Edge case with k = 0**: When `k = 0`, all elements in the beautiful subset must be exactly equal. The algorithm still works correctly since we're looking for `nums[right] - nums[left] ≤ 0`.

## When You'll See This Pattern

This "sort + sliding window for max subarray with constraint" pattern appears in several problems:

1. **Maximum Size Subarray Sum Equals k**: While not identical, it uses similar two-pointer logic to find subarrays satisfying a sum constraint.

2. **Partition Array Such That Maximum Difference Is K**: Requires partitioning into subsequences where max-min ≤ k, using sorting and greedy grouping.

3. **Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit**: Almost identical pattern—find longest subarray where max-min ≤ limit.

4. **Boats to Save People**: Sort people by weight, then use two pointers to pair heaviest with lightest when possible.

The core pattern: when a problem asks for "maximum subset satisfying some difference constraint," consider sorting first, then using a sliding window or two pointers.

## Key Takeaways

1. **Sorting transforms subset problems into contiguous subarray problems**: When you can reorder elements without changing the answer, sorting often reveals simpler structure.

2. **Sliding window finds maximum subarray with constraint**: The `while` loop that shrinks the left pointer when the constraint is violated is a classic pattern worth memorizing.

3. **Interval overlap reduces to difference constraint**: The condition that all `[x-k, x+k]` intervals overlap is equivalent to `max(x) - min(x) ≤ 2k` for the subset.

Related problems: [Maximum Size Subarray Sum Equals k](/problem/maximum-size-subarray-sum-equals-k), [Partition Array Such That Maximum Difference Is K](/problem/partition-array-such-that-maximum-difference-is-k)
