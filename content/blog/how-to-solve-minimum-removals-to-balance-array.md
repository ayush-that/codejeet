---
title: "How to Solve Minimum Removals to Balance Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Removals to Balance Array. Medium difficulty, 47.9% acceptance rate. Topics: Array, Binary Search, Sliding Window, Sorting."
date: "2026-11-01"
category: "dsa-patterns"
tags: ["minimum-removals-to-balance-array", "array", "binary-search", "sliding-window", "medium"]
---

# How to Solve Minimum Removals to Balance Array

You're given an array `nums` and an integer `k`. A balanced array has its maximum element at most `k` times its minimum element. You can remove any number of elements (but not all) to make the array balanced. Return the minimum number of removals needed.

What makes this problem interesting is that you can remove elements from anywhere in the array, not just from the ends. This means you're looking for the largest "balanced subarray" within the original array, since keeping more elements means removing fewer. The challenge is finding this subarray efficiently.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 5, 1, 7, 2, 8]` with `k = 3`.

A balanced subarray must satisfy: `max(subarray) ≤ k × min(subarray)`

**Step 1: Sort the array**  
Sorted: `[1, 2, 3, 5, 7, 8]`  
Now any subarray will have its minimum at the left end and maximum at the right end.

**Step 2: Find the longest valid window**  
We'll use two pointers (left and right):

- Start with left = 0, right = 0
- Check: `nums[right] ≤ k × nums[left]`? `8 ≤ 3×1`? `8 ≤ 3`? No → too big
- Move left pointer rightward to try smaller windows

Let's systematically check:

- Window [1,8]: `8 ≤ 3×1`? No
- Window [2,8]: `8 ≤ 3×2`? `8 ≤ 6`? No
- Window [3,8]: `8 ≤ 3×3`? `8 ≤ 9`? Yes! This window is balanced
- Can we make it longer? Try right = 5 (already at end)
- Move left to 4: Window [5,8]: `8 ≤ 3×5`? `8 ≤ 15`? Yes, but shorter
- Move left to 5: Window [7,8]: `8 ≤ 3×7`? `8 ≤ 21`? Yes, but even shorter

The longest balanced window is [3,8] with length 3.  
Minimum removals = total elements - longest balanced window length = 6 - 3 = 3.

## Brute Force Approach

The brute force approach would check every possible subarray to find the longest balanced one:

1. Generate all possible subarrays (O(n²) subarrays)
2. For each subarray, find its min and max (O(n) per subarray)
3. Check if `max ≤ k × min`
4. Track the longest valid subarray length
5. Return `n - longest_length`

This would be O(n³) time complexity, which is far too slow for typical constraints (n up to 10⁵).

Even an optimized brute force that precomputes min/max for subarrays would still be O(n²), which is too slow. We need a more efficient approach.

## Optimized Approach

The key insight is that **sorting doesn't change the problem** because:

1. We can remove elements from anywhere
2. After sorting, any subarray is contiguous in the sorted order
3. In a sorted subarray, the minimum is the first element and maximum is the last element

This transforms the problem into: "Find the longest contiguous subarray in the sorted array where `last ≤ k × first`."

We can solve this with a **sliding window**:

1. Sort the array (O(n log n))
2. Use two pointers: `left` and `right`
3. Expand `right` as long as `nums[right] ≤ k × nums[left]`
4. If the condition fails, increment `left` to try a new window
5. Track the maximum window length

Why does this work? When we move `left` forward, we're trying windows with larger minimum values, which makes the condition `nums[right] ≤ k × nums[left]` easier to satisfy for the same `right`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def minRemovals(nums, k):
    """
    Returns minimum number of removals to make array balanced.

    Args:
        nums: List of integers
        k: Integer multiplier for balance condition

    Returns:
        Minimum number of elements to remove
    """
    n = len(nums)

    # Step 1: Sort the array
    # Sorting allows us to use sliding window since any subarray
    # in sorted order will have min at left and max at right
    nums.sort()

    # Step 2: Initialize sliding window pointers
    left = 0
    max_length = 0  # Track longest valid window

    # Step 3: Slide the window through the sorted array
    for right in range(n):
        # While current window is invalid (max > k * min),
        # shrink from the left
        while left <= right and nums[right] > k * nums[left]:
            left += 1

        # Current window [left, right] is valid
        # Update max_length if this window is longer
        current_length = right - left + 1
        max_length = max(max_length, current_length)

    # Step 4: Minimum removals = total elements - longest valid window
    # We need to keep at least 1 element (problem says array can't be empty)
    # If max_length is 0 (shouldn't happen with at least 1 element), return n-1
    return n - max_length if max_length > 0 else n - 1
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
function minRemovals(nums, k) {
  /**
   * Returns minimum number of removals to make array balanced.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Multiplier for balance condition
   * @return {number} Minimum number of elements to remove
   */
  const n = nums.length;

  // Step 1: Sort the array in ascending order
  // This transforms the problem to finding longest subarray
  // where last element ≤ k * first element
  nums.sort((a, b) => a - b);

  // Step 2: Initialize sliding window
  let left = 0;
  let maxLength = 0; // Track longest valid window

  // Step 3: Slide right pointer through array
  for (let right = 0; right < n; right++) {
    // Shrink window from left while it's invalid
    // Invalid means: max (nums[right]) > k * min (nums[left])
    while (left <= right && nums[right] > k * nums[left]) {
      left++;
    }

    // Window [left, right] is now valid
    // Calculate its length and update maxLength if needed
    const currentLength = right - left + 1;
    maxLength = Math.max(maxLength, currentLength);
  }

  // Step 4: Minimum removals = total - longest valid window
  // Ensure we keep at least 1 element (array can't be empty)
  return maxLength > 0 ? n - maxLength : n - 1;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;

class Solution {
    public int minRemovals(int[] nums, int k) {
        /**
         * Returns minimum number of removals to make array balanced.
         *
         * @param nums Array of integers
         * @param k Multiplier for balance condition
         * @return Minimum number of elements to remove
         */
        int n = nums.length;

        // Step 1: Sort the array
        // After sorting, problem reduces to finding longest subarray
        // where last element ≤ k * first element
        Arrays.sort(nums);

        // Step 2: Initialize sliding window pointers
        int left = 0;
        int maxLength = 0;  // Track longest valid window

        // Step 3: Slide right pointer through the array
        for (int right = 0; right < n; right++) {
            // While current window is invalid, shrink from left
            // Invalid condition: max > k * min
            // In sorted array, nums[right] is max, nums[left] is min
            while (left <= right && nums[right] > k * nums[left]) {
                left++;
            }

            // Current window [left, right] is valid
            // Update maxLength if this window is longer
            int currentLength = right - left + 1;
            maxLength = Math.max(maxLength, currentLength);
        }

        // Step 4: Minimum removals = total - longest valid window
        // We must keep at least 1 element (array can't be empty)
        return maxLength > 0 ? n - maxLength : n - 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time
- The sliding window part takes O(n) time:
  - The `right` pointer moves n times
  - The `left` pointer only moves forward, at most n times total
  - Each element is processed at most twice (once by `right`, once by `left`)
- Dominated by the sorting step: O(n log n)

**Space Complexity: O(1) or O(n)**

- If sorting is done in-place (like Python's Timsort), space is O(1) or O(log n) for recursion stack
- If sorting requires extra space (like merge sort), it's O(n)
- The sliding window uses only O(1) extra space for pointers and counters

## Common Mistakes

1. **Not sorting the array first**  
   Candidates might try to apply sliding window directly on the unsorted array, which doesn't work because the min and max aren't at the ends of the window. Remember: after sorting, any subarray has its minimum at the left end and maximum at the right end.

2. **Incorrect window shrinking condition**  
   Using `if` instead of `while` to shrink the window: when `nums[right] > k * nums[left]`, you need to keep moving `left` forward until the condition is satisfied, not just move it once.

3. **Forgetting the "array can't be empty" constraint**  
   The problem states you can't remove all elements. In edge cases where no two elements satisfy the condition, you need to keep at least one element. Our code handles this by returning `n - 1` when `maxLength` would be 0.

4. **Integer overflow with multiplication**  
   When `k` and `nums[left]` are large, `k * nums[left]` could overflow. In Python, integers are arbitrary precision, but in Java/JavaScript, consider using long integers or checking for overflow.

## When You'll See This Pattern

This "sort + sliding window" pattern appears in problems where:

1. You need to find a subarray/subsequence satisfying some condition
2. The condition involves both min and max elements
3. You can reorder elements or the order doesn't matter

Related LeetCode problems:

1. **Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit** (LeetCode 1438) - Similar sliding window but uses deques to track min/max in unsorted array
2. **Maximum Length of Subarray With Positive Product** (LeetCode 1567) - Different condition but similar sliding window approach
3. **Frequency of the Most Frequent Element** (LeetCode 1838) - Also uses sort + sliding window to find the longest subarray that can be made equal with limited operations

## Key Takeaways

1. **When order doesn't matter, sort first** - Many array problems become easier when you sort because you can use techniques like two pointers or binary search that rely on ordered data.

2. **Sliding window finds longest subarray satisfying condition** - When you need the longest subarray where some condition holds for all elements in the window, sliding window with two pointers is often the solution.

3. **Balance conditions often reduce to comparing ends** - Problems involving "balanced" arrays frequently boil down to conditions between the minimum and maximum elements, which in a sorted array are just the first and last elements of any subarray.

[Practice this problem on CodeJeet](/problem/minimum-removals-to-balance-array)
