---
title: "How to Solve Shortest Unsorted Continuous Subarray — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Shortest Unsorted Continuous Subarray. Medium difficulty, 38.0% acceptance rate. Topics: Array, Two Pointers, Stack, Greedy, Sorting."
date: "2027-08-17"
category: "dsa-patterns"
tags: ["shortest-unsorted-continuous-subarray", "array", "two-pointers", "stack", "medium"]
---

# How to Solve Shortest Unsorted Continuous Subarray

You're given an array of integers, and you need to find the shortest continuous subarray that, when sorted, makes the entire array sorted. The challenge is that you can't just sort the whole array and compare - you need to identify exactly which portion is out of order without actually sorting anything. This problem tests your ability to think about array properties and boundary conditions.

## Visual Walkthrough

Let's trace through an example: `nums = [2, 6, 4, 8, 10, 9, 15]`

**Step 1: Identify the problem visually**
The array should be sorted in non-decreasing order. Looking at it:

- `2, 6` ✓ (sorted)
- `6, 4` ✗ (4 < 6, so 4 is out of place)
- `8, 10, 9` ✗ (9 < 10, so 9 is out of place)
- `15` ✓ (end of array)

**Step 2: Find the boundaries**
The unsorted portion starts at the first element that's out of place when scanning left to right. That's `4` at index 2.
The unsorted portion ends at the last element that's out of place when scanning right to left. That's `10` at index 4.

**Step 3: But wait - is that the whole story?**
If we just sort indices 2 through 4 (`[4, 8, 10, 9]` becomes `[4, 8, 9, 10]`), we get: `[2, 6, 4, 8, 9, 10, 15]`
Check: `6, 4` ✗ (4 < 6) - still not sorted!

**Step 4: The key insight**
We need to find the _minimum_ and _maximum_ values within the unsorted portion, then expand our boundaries outward until everything fits. In our example:

- Within indices 2-4, min = 4, max = 10
- We need to expand left until all elements ≤ min (4)
- We need to expand right until all elements ≥ max (10)

**Step 5: Final boundaries**

- Expand left: At index 1, value 6 > min (4), so include it
- Expand right: At index 5, value 9 < max (10), so include it
  Final subarray: indices 1 through 5 → length = 5

## Brute Force Approach

The brute force approach would be to check every possible subarray:

1. For each starting index `i` from 0 to n-1
2. For each ending index `j` from i to n-1
3. Extract subarray `nums[i:j+1]`, sort it
4. Check if sorting this subarray makes the entire array sorted
5. Track the minimum length where this is true

This approach has O(n³) time complexity (O(n²) subarrays × O(n log n) sorting) and is clearly too slow for typical constraints (n up to 10⁴ or 10⁵).

Even a slightly better brute force would be O(n²): for each pair (i, j), check if all elements before i are ≤ all elements in the sorted subarray, and all elements after j are ≥ all elements in the sorted subarray. Still too slow.

## Optimized Approach

The key insight is that we don't need to check every subarray. Instead, we can:

1. **Find the unsorted portion boundaries** by scanning from both ends
2. **Find the min and max within that portion**
3. **Expand the boundaries** to include any elements that should be part of the sort

Here's the step-by-step reasoning:

**Step 1: Find initial unsorted boundaries**

- From left to right, find the first index where `nums[i] > nums[i+1]` (breaking the non-decreasing order)
- From right to left, find the first index where `nums[j] < nums[j-1]` (breaking the non-decreasing order)

**Step 2: Find min and max within this range**

- If the array is already sorted, return 0
- Otherwise, find the minimum and maximum values within the range [left, right]

**Step 3: Expand boundaries**

- Expand left boundary leftward while `nums[left-1] > min` (elements on left are too large)
- Expand right boundary rightward while `nums[right+1] < max` (elements on right are too small)

**Step 4: Calculate length**

- Length = right - left + 1

This approach works because:

- Any element outside the initial boundaries that's between min and max must be included
- The boundaries define the minimum region that needs sorting

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findUnsortedSubarray(nums):
    """
    Find the shortest subarray that needs sorting to make the entire array sorted.

    Approach:
    1. Find initial unsorted boundaries from both ends
    2. Find min and max within those boundaries
    3. Expand boundaries based on min and max values
    4. Calculate length of the subarray
    """
    n = len(nums)

    # Edge case: empty array or single element
    if n <= 1:
        return 0

    # Step 1: Find the initial unsorted boundaries
    # From left to right, find first element that's greater than the next
    left = 0
    while left < n - 1 and nums[left] <= nums[left + 1]:
        left += 1

    # If we reached the end, array is already sorted
    if left == n - 1:
        return 0

    # From right to left, find first element that's less than the previous
    right = n - 1
    while right > 0 and nums[right] >= nums[right - 1]:
        right -= 1

    # Step 2: Find min and max within the range [left, right]
    # We need to check the entire range, not just the boundaries
    subarray_min = float('inf')
    subarray_max = float('-inf')

    for i in range(left, right + 1):
        subarray_min = min(subarray_min, nums[i])
        subarray_max = max(subarray_max, nums[i])

    # Step 3: Expand boundaries outward
    # Expand left while elements are greater than subarray_min
    while left > 0 and nums[left - 1] > subarray_min:
        left -= 1

    # Expand right while elements are less than subarray_max
    while right < n - 1 and nums[right + 1] < subarray_max:
        right += 1

    # Step 4: Calculate length
    return right - left + 1
```

```javascript
// Time: O(n) | Space: O(1)
function findUnsortedSubarray(nums) {
  /**
   * Find the shortest subarray that needs sorting to make the entire array sorted.
   *
   * Approach:
   * 1. Find initial unsorted boundaries from both ends
   * 2. Find min and max within those boundaries
   * 3. Expand boundaries based on min and max values
   * 4. Calculate length of the subarray
   */
  const n = nums.length;

  // Edge case: empty array or single element
  if (n <= 1) {
    return 0;
  }

  // Step 1: Find the initial unsorted boundaries
  // From left to right, find first element that's greater than the next
  let left = 0;
  while (left < n - 1 && nums[left] <= nums[left + 1]) {
    left++;
  }

  // If we reached the end, array is already sorted
  if (left === n - 1) {
    return 0;
  }

  // From right to left, find first element that's less than the previous
  let right = n - 1;
  while (right > 0 && nums[right] >= nums[right - 1]) {
    right--;
  }

  // Step 2: Find min and max within the range [left, right]
  // We need to check the entire range, not just the boundaries
  let subarrayMin = Infinity;
  let subarrayMax = -Infinity;

  for (let i = left; i <= right; i++) {
    subarrayMin = Math.min(subarrayMin, nums[i]);
    subarrayMax = Math.max(subarrayMax, nums[i]);
  }

  // Step 3: Expand boundaries outward
  // Expand left while elements are greater than subarrayMin
  while (left > 0 && nums[left - 1] > subarrayMin) {
    left--;
  }

  // Expand right while elements are less than subarrayMax
  while (right < n - 1 && nums[right + 1] < subarrayMax) {
    right++;
  }

  // Step 4: Calculate length
  return right - left + 1;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int findUnsortedSubarray(int[] nums) {
        /**
         * Find the shortest subarray that needs sorting to make the entire array sorted.
         *
         * Approach:
         * 1. Find initial unsorted boundaries from both ends
         * 2. Find min and max within those boundaries
         * 3. Expand boundaries based on min and max values
         * 4. Calculate length of the subarray
         */
        int n = nums.length;

        // Edge case: empty array or single element
        if (n <= 1) {
            return 0;
        }

        // Step 1: Find the initial unsorted boundaries
        // From left to right, find first element that's greater than the next
        int left = 0;
        while (left < n - 1 && nums[left] <= nums[left + 1]) {
            left++;
        }

        // If we reached the end, array is already sorted
        if (left == n - 1) {
            return 0;
        }

        // From right to left, find first element that's less than the previous
        int right = n - 1;
        while (right > 0 && nums[right] >= nums[right - 1]) {
            right--;
        }

        // Step 2: Find min and max within the range [left, right]
        // We need to check the entire range, not just the boundaries
        int subarrayMin = Integer.MAX_VALUE;
        int subarrayMax = Integer.MIN_VALUE;

        for (int i = left; i <= right; i++) {
            subarrayMin = Math.min(subarrayMin, nums[i]);
            subarrayMax = Math.max(subarrayMax, nums[i]);
        }

        // Step 3: Expand boundaries outward
        // Expand left while elements are greater than subarrayMin
        while (left > 0 && nums[left - 1] > subarrayMin) {
            left--;
        }

        // Expand right while elements are less than subarrayMax
        while (right < n - 1 && nums[right + 1] < subarrayMax) {
            right++;
        }

        // Step 4: Calculate length
        return right - left + 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding initial boundaries: O(n) in worst case (scanning entire array)
- Finding min/max within range: O(n) in worst case (entire array unsorted)
- Expanding boundaries: O(n) in worst case (expanding to entire array)
- Overall: O(3n) = O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for pointers and min/max variables
- No additional data structures that grow with input size

## Common Mistakes

1. **Not checking if array is already sorted**: Many candidates forget the early return when `left == n - 1`. This is crucial for efficiency and correctness.

2. **Incorrect boundary expansion logic**: Using `>=` instead of `>` or `<=` instead of `<` when expanding boundaries. Remember: we expand left when `nums[left-1] > min` (strictly greater) because if it's equal, it doesn't need to be sorted.

3. **Forgetting to check the entire range for min/max**: Some candidates only check `nums[left]` and `nums[right]` for min/max, but the actual min/max could be somewhere in the middle of the unsorted portion.

4. **Off-by-one errors in boundary conditions**: When expanding boundaries, ensure you check `left > 0` before accessing `nums[left-1]` and `right < n-1` before accessing `nums[right+1]` to avoid index out of bounds errors.

## When You'll See This Pattern

This "find unsorted subarray" pattern appears in several related problems:

1. **Find Minimum in Rotated Sorted Array (LeetCode 153)**: Similar concept of finding boundaries where order breaks, though in a rotated array context.

2. **Maximum Product Subarray (LeetCode 152)**: While different in goal, it uses similar boundary expansion thinking when dealing with negative numbers.

3. **Container With Most Water (LeetCode 11)**: Uses two pointers moving inward from both ends, similar to our initial boundary finding.

4. **Trapping Rain Water (LeetCode 42)**: Requires finding boundaries and dealing with min/max values within ranges.

The core pattern is: when you need to find a subarray based on some ordering property, consider scanning from both ends to find violation points, then adjust based on values within the range.

## Key Takeaways

1. **Two-pointer approach from both ends**: When looking for boundaries in an array, scanning from both ends is often more efficient than scanning from one end only.

2. **Local violations imply global adjustments**: A local ordering violation (like `nums[i] > nums[i+1]`) often means you need to adjust boundaries more broadly based on min/max values in the affected region.

3. **Think in terms of invariants**: The solution maintains the invariant that after expansion, all elements left of `left` are ≤ min of unsorted portion, and all elements right of `right` are ≥ max of unsorted portion.

Related problems: [Smallest Subarray to Sort in Every Sliding Window](/problem/smallest-subarray-to-sort-in-every-sliding-window)
