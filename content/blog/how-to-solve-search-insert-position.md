---
title: "How to Solve Search Insert Position — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Search Insert Position. Easy difficulty, 50.7% acceptance rate. Topics: Array, Binary Search."
date: "2026-02-26"
category: "dsa-patterns"
tags: ["search-insert-position", "array", "binary-search", "easy"]
---

# How to Solve Search Insert Position

You're given a sorted array of distinct integers and a target value. You need to find the index where the target exists, or if it doesn't exist, find the index where it should be inserted to maintain sorted order. The challenge is that you must achieve O(log n) runtime complexity, which immediately points to binary search. What makes this problem interesting is that it's not just a standard binary search—you need to handle both finding the target AND determining its correct insertion position when it's not found.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 3, 5, 6]` with `target = 5`.

**Step 1:** Initialize `left = 0`, `right = 3` (array length - 1)
**Step 2:** Calculate `mid = (0 + 3) // 2 = 1`
**Step 3:** Compare `nums[1] = 3` with `target = 5`

- Since `3 < 5`, we know the target must be in the right half
- Update `left = mid + 1 = 2`

**Step 4:** Now `left = 2`, `right = 3`
**Step 5:** Calculate `mid = (2 + 3) // 2 = 2`
**Step 6:** Compare `nums[2] = 5` with `target = 5`

- They're equal! Return `mid = 2`

Now let's try `target = 2` with the same array:

**Step 1:** `left = 0`, `right = 3`
**Step 2:** `mid = (0 + 3) // 2 = 1`
**Step 3:** Compare `nums[1] = 3` with `target = 2`

- Since `3 > 2`, target must be in left half
- Update `right = mid - 1 = 0`

**Step 4:** Now `left = 0`, `right = 0`
**Step 5:** `mid = (0 + 0) // 2 = 0`
**Step 6:** Compare `nums[0] = 1` with `target = 2`

- Since `1 < 2`, update `left = mid + 1 = 1`

**Step 7:** Loop ends because `left = 1`, `right = 0` (left > right)
**Key Insight:** When the loop ends, `left` points to where the target should be inserted! In this case, `left = 1`, which is correct because `2` should go between `1` and `3`.

## Brute Force Approach

The brute force solution would be to simply iterate through the array from left to right:

1. Check if the target exists at the current index
2. If it does, return that index
3. If we find an element greater than the target, return the current index (that's where we'd insert)
4. If we reach the end, return the array length

While this approach is simple and works, it has O(n) time complexity, which violates the problem's requirement for O(log n) runtime. In an interview, you should mention this solution to show you understand the problem, then immediately explain why we need something better for large arrays.

## Optimal Solution

The optimal solution uses binary search. The key insight is that even when the target isn't found, binary search naturally converges to the insertion point. When the loop ends, the `left` pointer will be at the position where the target should be inserted.

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def searchInsert(nums, target):
    """
    Returns the index where target is found or should be inserted.

    Args:
        nums: List[int] - sorted array of distinct integers
        target: int - value to find or insert

    Returns:
        int - index of target or insertion position
    """
    # Initialize pointers to cover the entire array
    left, right = 0, len(nums) - 1

    # Continue searching while the search space is valid
    while left <= right:
        # Calculate middle index - prevents overflow in languages with fixed integers
        mid = left + (right - left) // 2

        # If we found the target, return immediately
        if nums[mid] == target:
            return mid

        # If middle element is less than target, search right half
        elif nums[mid] < target:
            left = mid + 1  # Target must be to the right of mid

        # If middle element is greater than target, search left half
        else:  # nums[mid] > target
            right = mid - 1  # Target must be to the left of mid

    # When loop ends, left points to the insertion position
    # This works because:
    # 1. If target > all elements, left ends at len(nums)
    # 2. If target < all elements, left ends at 0
    # 3. Otherwise, left points between elements where target fits
    return left
```

```javascript
// Time: O(log n) | Space: O(1)
function searchInsert(nums, target) {
  /**
   * Returns the index where target is found or should be inserted.
   *
   * @param {number[]} nums - sorted array of distinct integers
   * @param {number} target - value to find or insert
   * @return {number} - index of target or insertion position
   */

  // Initialize pointers to cover the entire array
  let left = 0;
  let right = nums.length - 1;

  // Continue searching while the search space is valid
  while (left <= right) {
    // Calculate middle index - prevents overflow with large numbers
    const mid = Math.floor(left + (right - left) / 2);

    // If we found the target, return immediately
    if (nums[mid] === target) {
      return mid;
    }

    // If middle element is less than target, search right half
    if (nums[mid] < target) {
      left = mid + 1; // Target must be to the right of mid
    }
    // If middle element is greater than target, search left half
    else {
      right = mid - 1; // Target must be to the left of mid
    }
  }

  // When loop ends, left points to the insertion position
  // This works because:
  // 1. If target > all elements, left ends at nums.length
  // 2. If target < all elements, left ends at 0
  // 3. Otherwise, left points between elements where target fits
  return left;
}
```

```java
// Time: O(log n) | Space: O(1)
class Solution {
    public int searchInsert(int[] nums, int target) {
        /**
         * Returns the index where target is found or should be inserted.
         *
         * @param nums - sorted array of distinct integers
         * @param target - value to find or insert
         * @return index of target or insertion position
         */

        // Initialize pointers to cover the entire array
        int left = 0;
        int right = nums.length - 1;

        // Continue searching while the search space is valid
        while (left <= right) {
            // Calculate middle index - prevents integer overflow
            int mid = left + (right - left) / 2;

            // If we found the target, return immediately
            if (nums[mid] == target) {
                return mid;
            }

            // If middle element is less than target, search right half
            if (nums[mid] < target) {
                left = mid + 1;  // Target must be to the right of mid
            }
            // If middle element is greater than target, search left half
            else {
                right = mid - 1;  // Target must be to the left of mid
            }
        }

        // When loop ends, left points to the insertion position
        // This works because:
        // 1. If target > all elements, left ends at nums.length
        // 2. If target < all elements, left ends at 0
        // 3. Otherwise, left points between elements where target fits
        return left;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log n)

- Each iteration of the while loop halves the search space
- Starting with n elements, after k iterations we have n/(2^k) elements
- The loop stops when n/(2^k) ≤ 1, which means k ≤ log₂(n)
- Thus we perform at most log₂(n) iterations

**Space Complexity:** O(1)

- We only use a constant amount of extra space (pointers: left, right, mid)
- No additional data structures are created that scale with input size
- The input array is not modified

## Common Mistakes

1. **Infinite loop with wrong termination condition:** Using `while (left < right)` instead of `while (left <= right)` can cause the loop to exit early when `left == right`, potentially missing the target. Always test with a single-element array to catch this.

2. **Returning wrong insertion position:** Some candidates try to return `mid`, `right`, or `right + 1` instead of `left`. Remember: when the loop ends with `left > right`, `left` is always the correct insertion point. Test with targets that should be inserted at the beginning, middle, and end.

3. **Integer overflow when calculating mid:** Using `(left + right) // 2` can overflow in languages with fixed-size integers when `left` and `right` are large. Always use `left + (right - left) // 2` to prevent this.

4. **Forgetting the array is 0-indexed:** When returning the insertion position for a target larger than all elements, you should return `len(nums)`, not `len(nums) - 1`. The position after the last element is valid for insertion.

## When You'll See This Pattern

This "modified binary search" pattern appears whenever you need to find:

1. **The first position where a condition becomes true** (like First Bad Version)
2. **The boundary between two regions** in a sorted array
3. **The insertion point** in any sorted data structure

Related problems:

- **First Bad Version** - Almost identical pattern: you're finding the first bad version in a sorted sequence of good then bad versions
- **Find First and Last Position of Element in Sorted Array** - Uses binary search twice: once to find the left boundary, once to find the right boundary
- **Sqrt(x)** - Uses binary search to find the integer square root, which is essentially finding the insertion point for a perfect square

## Key Takeaways

1. **Binary search isn't just for exact matches** - It can find insertion positions, boundaries, and other "first/last" positions by carefully choosing what to return when the loop ends.

2. **The `left` pointer has special meaning** - When binary search ends with `left > right`, `left` points to where the target would be inserted in a sorted array. This is a fundamental property of this implementation.

3. **Test edge cases systematically** - Always test: empty array, single element, target smaller than all elements, target larger than all elements, target exactly equal to an element, and target between two elements.

Related problems: [First Bad Version](/problem/first-bad-version), [Minimum Operations to Exceed Threshold Value I](/problem/minimum-operations-to-exceed-threshold-value-i)
