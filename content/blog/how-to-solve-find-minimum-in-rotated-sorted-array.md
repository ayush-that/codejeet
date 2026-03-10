---
title: "How to Solve Find Minimum in Rotated Sorted Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Minimum in Rotated Sorted Array. Medium difficulty, 53.8% acceptance rate. Topics: Array, Binary Search."
date: "2026-04-06"
category: "dsa-patterns"
tags: ["find-minimum-in-rotated-sorted-array", "array", "binary-search", "medium"]
---

# How to Solve Find Minimum in Rotated Sorted Array

This problem asks us to find the minimum element in a rotated sorted array. The array was originally sorted in ascending order, then rotated some number of times (between 1 and n times). What makes this problem interesting is that while the array isn't fully sorted, it still has enough structure to allow for efficient searching—specifically, we can use a modified binary search to find the minimum in O(log n) time instead of the O(n) linear scan.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider the rotated sorted array: `[4,5,6,7,0,1,2]`

**Key observation:** In a rotated sorted array, there's exactly one "pivot point" where the element is smaller than the previous element. This pivot point is the minimum element. All elements to the left of the pivot are greater than all elements to the right.

Let's visualize the binary search process:

1. **Initial state:** left = 0, right = 6, mid = 3
   - nums[mid] = 7
   - Compare with nums[right] = 2: 7 > 2
   - This tells us the pivot (minimum) must be in the right half (indices 4-6)
   - Update left = mid + 1 = 4

2. **Second iteration:** left = 4, right = 6, mid = 5
   - nums[mid] = 1
   - Compare with nums[right] = 2: 1 < 2
   - This tells us the pivot is in the left half (indices 4-5) or could be nums[mid] itself
   - Update right = mid = 5

3. **Third iteration:** left = 4, right = 5, mid = 4
   - nums[mid] = 0
   - Compare with nums[right] = 1: 0 < 1
   - Update right = mid = 4

4. **Loop ends:** left = 4, right = 4
   - Minimum is nums[4] = 0

The key insight is that by comparing nums[mid] with nums[right], we can determine which half contains the minimum. If nums[mid] > nums[right], the minimum must be in the right half. Otherwise, it's in the left half (including mid itself).

## Brute Force Approach

The most straightforward solution is to simply scan through the entire array and keep track of the minimum element:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findMin(nums):
    """
    Brute force linear scan approach.
    Works but doesn't take advantage of the rotated sorted property.
    """
    min_val = float('inf')
    for num in nums:
        if num < min_val:
            min_val = num
    return min_val
```

```javascript
// Time: O(n) | Space: O(1)
function findMin(nums) {
  /**
   * Brute force linear scan approach.
   * Works but doesn't take advantage of the rotated sorted property.
   */
  let minVal = Infinity;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < minVal) {
      minVal = nums[i];
    }
  }
  return minVal;
}
```

```java
// Time: O(n) | Space: O(1)
public int findMin(int[] nums) {
    /**
     * Brute force linear scan approach.
     * Works but doesn't take advantage of the rotated sorted property.
     */
    int minVal = Integer.MAX_VALUE;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] < minVal) {
            minVal = nums[i];
        }
    }
    return minVal;
}
```

</div>

**Why this isn't optimal:** The brute force approach runs in O(n) time, but we can do better. The problem states the array was originally sorted, which gives us additional structure to exploit. Even though it's rotated, we can still use binary search to achieve O(log n) time complexity. In an interview, you'd want to mention this approach to show you understand the basics, then immediately explain why we can do better.

## Optimized Approach

The key insight is that a rotated sorted array can be divided into two sorted portions. The minimum element is the first element of the second sorted portion, which is also the only element that's smaller than the element immediately before it.

**Modified binary search approach:**

1. Use two pointers: `left` at the start and `right` at the end of the array
2. While `left < right` (not `left <= right` because we want to exit when we've found the minimum)
3. Calculate `mid = left + (right - left) // 2` (prevents integer overflow)
4. Compare `nums[mid]` with `nums[right]`:
   - If `nums[mid] > nums[right]`: The minimum must be in the right half (mid+1 to right)
   - If `nums[mid] < nums[right]`: The minimum must be in the left half (left to mid)
   - If `nums[mid] == nums[right]`: This case doesn't occur in this problem (no duplicates), but in the variant with duplicates, we'd need special handling
5. When `left == right`, we've found the minimum

**Why compare with nums[right] instead of nums[left]?**
Comparing with nums[right] is more reliable because:

- If the array is rotated, nums[left] might be part of the larger values
- nums[right] will always be in the second (smaller) portion if there's a rotation
- This approach handles the edge case where the array isn't rotated at all

## Optimal Solution

Here's the complete implementation using modified binary search:

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def findMin(nums):
    """
    Find the minimum element in a rotated sorted array using binary search.

    Args:
        nums: List[int] - rotated sorted array

    Returns:
        int - minimum element in the array
    """
    # Edge case: empty array (problem guarantees non-empty, but good practice)
    if not nums:
        return -1

    # Initialize pointers
    left, right = 0, len(nums) - 1

    # Binary search while left < right (not <= because we want to exit when found)
    while left < right:
        # Calculate mid point (prevents overflow compared to (left+right)//2)
        mid = left + (right - left) // 2

        # Compare mid element with right element
        if nums[mid] > nums[right]:
            # If mid element is greater than right element,
            # the minimum must be in the right half (after mid)
            # Example: [4,5,6,7,0,1,2], mid=7, right=2, 7>2
            left = mid + 1
        else:
            # If mid element is less than or equal to right element,
            # the minimum is in the left half (including mid)
            # Example: [4,5,6,7,0,1,2], mid=1, right=2, 1<2
            right = mid

    # When left == right, we've found the minimum
    return nums[left]
```

```javascript
// Time: O(log n) | Space: O(1)
function findMin(nums) {
  /**
   * Find the minimum element in a rotated sorted array using binary search.
   *
   * @param {number[]} nums - rotated sorted array
   * @return {number} - minimum element in the array
   */
  // Edge case: empty array (problem guarantees non-empty, but good practice)
  if (nums.length === 0) return -1;

  // Initialize pointers
  let left = 0;
  let right = nums.length - 1;

  // Binary search while left < right (not <= because we want to exit when found)
  while (left < right) {
    // Calculate mid point (using bitwise shift for integer division)
    const mid = Math.floor(left + (right - left) / 2);

    // Compare mid element with right element
    if (nums[mid] > nums[right]) {
      // If mid element is greater than right element,
      // the minimum must be in the right half (after mid)
      left = mid + 1;
    } else {
      // If mid element is less than or equal to right element,
      // the minimum is in the left half (including mid)
      right = mid;
    }
  }

  // When left == right, we've found the minimum
  return nums[left];
}
```

```java
// Time: O(log n) | Space: O(1)
public int findMin(int[] nums) {
    /**
     * Find the minimum element in a rotated sorted array using binary search.
     *
     * @param nums - rotated sorted array
     * @return minimum element in the array
     */
    // Edge case: empty array (problem guarantees non-empty, but good practice)
    if (nums == null || nums.length == 0) return -1;

    // Initialize pointers
    int left = 0;
    int right = nums.length - 1;

    // Binary search while left < right (not <= because we want to exit when found)
    while (left < right) {
        // Calculate mid point (prevents overflow compared to (left+right)/2)
        int mid = left + (right - left) / 2;

        // Compare mid element with right element
        if (nums[mid] > nums[right]) {
            // If mid element is greater than right element,
            // the minimum must be in the right half (after mid)
            left = mid + 1;
        } else {
            // If mid element is less than or equal to right element,
            // the minimum is in the left half (including mid)
            right = mid;
        }
    }

    // When left == right, we've found the minimum
    return nums[left];
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log n)

- We're using binary search, which halves the search space each iteration
- Each iteration does constant work (comparisons and pointer updates)
- In the worst case, we need log₂(n) iterations

**Space Complexity:** O(1)

- We only use a constant amount of extra space (pointers and mid variable)
- No additional data structures are created
- The algorithm works in-place

## Common Mistakes

1. **Using `left <= right` instead of `left < right` in the while condition**
   - With `<=`, the loop might not terminate properly
   - We want to exit when `left == right` because that's when we've found the minimum
   - Test with a simple case like `[2,1]` to see the difference

2. **Comparing with `nums[left]` instead of `nums[right]`**
   - Comparing with `nums[left]` fails when the array isn't rotated
   - Example: `[1,2,3,4,5]` - if we compare `nums[mid]` with `nums[left]`, we might incorrectly move left
   - `nums[right]` gives more reliable information about which half contains the minimum

3. **Forgetting edge cases**
   - Single element array: `[5]` should return `5`
   - Already sorted array (no rotation): `[1,2,3,4,5]` should return `1`
   - Two-element array: `[2,1]` should return `1`
   - Always test these cases mentally before coding

4. **Integer overflow when calculating mid**
   - Using `(left + right) // 2` can overflow for large arrays
   - Always use `left + (right - left) // 2` to prevent overflow
   - This is especially important in Java and other statically-typed languages

## When You'll See This Pattern

This modified binary search pattern appears in several related problems:

1. **Search in Rotated Sorted Array (LeetCode 33)**
   - Similar structure: rotated sorted array
   - First find the pivot (minimum), then decide which half to search for the target
   - Uses the same comparison technique to determine which half is sorted

2. **Find Minimum in Rotated Sorted Array II (LeetCode 154)**
   - Extension of this problem with duplicates
   - Requires handling `nums[mid] == nums[right]` case by decrementing `right`
   - Time complexity becomes O(n) in worst case due to duplicates

3. **Find Peak Element (LeetCode 162)**
   - Similar binary search on a non-fully-sorted array
   - Uses comparisons with neighbors to determine search direction
   - Teaches how to apply binary search when the array isn't monotonically increasing

The core pattern is: **When you have a partially sorted array or an array with some known structure, you can often use a modified binary search by comparing the middle element with boundary elements to determine which half to search next.**

## Key Takeaways

1. **Rotated sorted arrays have structure you can exploit**
   - They consist of two sorted portions
   - The minimum is the first element of the second portion
   - All elements in the first portion are greater than all elements in the second portion

2. **Modified binary search works on non-fully-sorted arrays**
   - The key is finding the right comparison to determine search direction
   - Compare `nums[mid]` with `nums[right]` (or `nums[left]`) to decide which half contains the answer
   - The loop condition `left < right` ensures proper termination

3. **Always test edge cases**
   - Single element arrays
   - Two element arrays
   - Already sorted (unrotated) arrays
   - Arrays with the minimum at different positions

This problem teaches you to look beyond the obvious and recognize that binary search can be applied even when the array isn't perfectly sorted, as long as there's enough structure to consistently eliminate half of the search space.

Related problems: [Search in Rotated Sorted Array](/problem/search-in-rotated-sorted-array), [Find Minimum in Rotated Sorted Array II](/problem/find-minimum-in-rotated-sorted-array-ii)
