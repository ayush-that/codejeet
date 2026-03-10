---
title: "How to Solve Minimum Difference Between Highest and Lowest of K Scores — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Difference Between Highest and Lowest of K Scores. Easy difficulty, 66.2% acceptance rate. Topics: Array, Sliding Window, Sorting."
date: "2028-05-17"
category: "dsa-patterns"
tags:
  [
    "minimum-difference-between-highest-and-lowest-of-k-scores",
    "array",
    "sliding-window",
    "sorting",
    "easy",
  ]
---

# How to Solve Minimum Difference Between Highest and Lowest of K Scores

This problem asks us to find the smallest possible difference between the highest and lowest scores when selecting exactly `k` students from an array. While it seems straightforward, the key insight is recognizing that the optimal selection will always consist of consecutive elements when the array is sorted. This transforms the problem into a sliding window challenge over sorted data.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [9,4,1,7]` and `k = 2`.

**Step 1: Sort the array**
First, we sort the array: `[1, 4, 7, 9]`. This is crucial because when we want to minimize the difference between highest and lowest, we want to pick numbers that are as close together as possible. In a sorted array, numbers that are close together are neighbors.

**Step 2: Consider all windows of size k**
Now we look at all possible windows of size 2 in the sorted array:

- Window 1: `[1, 4]` → Difference = 4 - 1 = 3
- Window 2: `[4, 7]` → Difference = 7 - 4 = 3
- Window 3: `[7, 9]` → Difference = 9 - 7 = 2

**Step 3: Find the minimum difference**
The smallest difference is 2, which comes from the window `[7, 9]`. Notice that we didn't need to consider non-consecutive selections like `[1, 7]` (difference = 6) or `[4, 9]` (difference = 5) because in a sorted array, any non-consecutive selection will have a larger difference than some consecutive selection containing the same smallest element.

**Why this works:** When the array is sorted, the minimum difference for any starting point `i` will be between `nums[i]` and `nums[i+k-1]` (the element exactly `k-1` positions ahead). Any other selection starting at `i` but not ending at `i+k-1` would either include fewer than `k` elements or would have a larger maximum value, resulting in a larger difference.

## Brute Force Approach

A naive approach would be to consider all possible combinations of `k` elements from the array. For each combination, we'd find the minimum and maximum values, compute their difference, and track the smallest difference found.

The brute force solution would:

1. Generate all combinations of `k` elements from `n` elements (using recursion or combinatorial generation)
2. For each combination, find min and max values
3. Compute the difference and track the minimum

**Why this is inefficient:**

- Generating all combinations of `k` from `n` has time complexity O(C(n,k)), which grows factorially
- For `n=1000` and `k=500`, this is computationally impossible
- Even for moderate inputs, this approach is far too slow

The key realization is that we don't need to check all combinations - only consecutive elements in the sorted array matter.

## Optimal Solution

The optimal solution has three simple steps:

1. Sort the array so that close values are neighbors
2. Slide a window of size `k` through the sorted array
3. For each window, compute the difference between the first and last element (which are the min and max in that window)
4. Track the minimum difference across all windows

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def minimumDifference(nums, k):
    """
    Find the minimum difference between highest and lowest of k scores.

    Args:
        nums: List of student scores
        k: Number of students to select

    Returns:
        Minimum possible difference
    """
    # Edge case: if k is 1, difference is always 0 (same student)
    if k == 1:
        return 0

    # Step 1: Sort the array to bring close values together
    # Sorting is O(n log n) and is the bottleneck
    nums.sort()

    # Initialize result with a large value
    # Using float('inf') ensures any real difference will be smaller
    min_diff = float('inf')

    # Step 2: Slide window of size k through sorted array
    # We start from index 0 and go up to len(nums)-k
    # For each starting position i, the window is nums[i:i+k]
    # The difference in this window is nums[i+k-1] - nums[i]
    for i in range(len(nums) - k + 1):
        # Current window difference = max - min in window
        # Since array is sorted, max is at i+k-1, min is at i
        current_diff = nums[i + k - 1] - nums[i]

        # Update minimum difference if current is smaller
        min_diff = min(min_diff, current_diff)

    return min_diff
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
function minimumDifference(nums, k) {
  /**
   * Find the minimum difference between highest and lowest of k scores.
   *
   * @param {number[]} nums - Array of student scores
   * @param {number} k - Number of students to select
   * @return {number} Minimum possible difference
   */

  // Edge case: if k is 1, difference is always 0
  if (k === 1) {
    return 0;
  }

  // Step 1: Sort the array in ascending order
  // This brings close values together for efficient window sliding
  nums.sort((a, b) => a - b);

  // Initialize with a very large number
  let minDiff = Infinity;

  // Step 2: Slide window of size k through the sorted array
  // We iterate from index 0 to nums.length - k
  for (let i = 0; i <= nums.length - k; i++) {
    // For window starting at i, the last element is at i + k - 1
    // Difference = last element - first element (max - min in sorted window)
    const currentDiff = nums[i + k - 1] - nums[i];

    // Update minimum if current difference is smaller
    minDiff = Math.min(minDiff, currentDiff);
  }

  return minDiff;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;

class Solution {
    public int minimumDifference(int[] nums, int k) {
        /**
         * Find the minimum difference between highest and lowest of k scores.
         *
         * @param nums Array of student scores
         * @param k Number of students to select
         * @return Minimum possible difference
         */

        // Edge case: if k is 1, difference is always 0
        if (k == 1) {
            return 0;
        }

        // Step 1: Sort the array in ascending order
        // Arrays.sort() uses Dual-Pivot Quicksort for primitives (O(n log n) average)
        Arrays.sort(nums);

        // Initialize with maximum possible integer value
        int minDiff = Integer.MAX_VALUE;

        // Step 2: Slide window of size k through sorted array
        // Loop from index 0 to nums.length - k (inclusive)
        for (int i = 0; i <= nums.length - k; i++) {
            // For window starting at i, the k-th element is at i + k - 1
            // In sorted array, this is max - min for this window
            int currentDiff = nums[i + k - 1] - nums[i];

            // Update minimum difference if current is smaller
            if (currentDiff < minDiff) {
                minDiff = currentDiff;
            }
        }

        return minDiff;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time (using efficient sort like Timsort, Quicksort, or Mergesort)
- The sliding window loop takes O(n) time since we iterate through the array once
- The dominant term is O(n log n), making this the overall time complexity

**Space Complexity: O(1) or O(n)**

- If the sorting algorithm is in-place (like Quicksort for primitives in Java), space complexity is O(1)
- If the sorting algorithm uses additional space (like Timsort in Python or Mergesort), space complexity is O(n)
- The sliding window part uses only O(1) additional space for variables

## Common Mistakes

1. **Forgetting to sort the array**: This is the most common mistake. Without sorting, the sliding window approach doesn't work because elements that minimize difference might not be consecutive in the unsorted array.

2. **Off-by-one errors in the loop range**: The loop should run `for i in range(len(nums) - k + 1)`, not `len(nums) - k`. The `+1` is crucial because we need to include the window that starts at index `len(nums)-k`. For example, with `nums = [1,2,3,4,5]` and `k=2`, we need windows starting at indices 0,1,2,3 (4 windows total), which is `5-2+1=4` iterations.

3. **Not handling the k=1 edge case**: When `k=1`, we're selecting just one student, so the difference between highest and lowest of that one score is always 0. While the general algorithm handles this correctly (the loop would run and compute differences of 0), explicitly handling it makes the code clearer and avoids unnecessary computation.

4. **Using the wrong index for window maximum**: In the window starting at `i`, the maximum is at `nums[i+k-1]`, not `nums[i+k]`. Remember array indices are 0-based, so if `k=3`, the elements are at indices `i`, `i+1`, and `i+2` (which is `i+3-1`).

## When You'll See This Pattern

This "sort + sliding window" pattern appears in many problems where you need to optimize some property of a subset of elements:

1. **Array Partition (LeetCode 561)**: Partition array into pairs to maximize sum of min values. Solution involves sorting and taking every other element.

2. **Maximum Product of Three Numbers (LeetCode 628)**: Find three numbers with maximum product. After sorting, the answer is either the product of the three largest numbers or the two smallest (negative) numbers multiplied by the largest.

3. **Assign Cookies (LeetCode 455)**: Match children with cookies using greedy approach after sorting both arrays.

The pattern is: when you need to optimize something about a subset of elements (min difference, max product, best matching), often sorting first simplifies the problem significantly, and then a linear scan or sliding window finds the optimal solution.

## Key Takeaways

1. **Sorting transforms selection problems into window problems**: When you need to select k elements optimizing some property, sorting often reveals that the optimal selection consists of consecutive elements in the sorted order.

2. **Sliding window is efficient for consecutive elements**: Once sorted, you don't need to check all combinations - just slide a window of size k through the array for O(n) checking after O(n log n) sorting.

3. **Edge cases matter**: Always check for small k values (especially k=1) and ensure your loop boundaries are correct with off-by-one considerations.

Related problems: [Array Partition](/problem/array-partition)
