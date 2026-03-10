---
title: "How to Solve Find Minimum in Rotated Sorted Array II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Minimum in Rotated Sorted Array II. Hard difficulty, 44.7% acceptance rate. Topics: Array, Binary Search."
date: "2027-03-07"
category: "dsa-patterns"
tags: ["find-minimum-in-rotated-sorted-array-ii", "array", "binary-search", "hard"]
---

# How to Solve Find Minimum in Rotated Sorted Array II

This problem asks us to find the minimum element in a rotated sorted array that may contain duplicates. While the classic "Find Minimum in Rotated Sorted Array" (without duplicates) can be solved with a clean binary search, the presence of duplicates introduces a significant complication: when `nums[mid] == nums[right]`, we can't determine which half contains the minimum. This makes the problem "Hard" rather than "Medium" and requires careful handling of edge cases.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [3, 3, 1, 3]`:

1. **Initial state**: `left = 0`, `right = 3`, `nums = [3, 3, 1, 3]`
2. **First iteration**: `mid = (0 + 3) // 2 = 1`
   - `nums[mid] = 3`, `nums[right] = 3`
   - Since `nums[mid] == nums[right]`, we can't tell which side contains the minimum
   - We'll decrement `right` by 1: `right = 2`
3. **Second iteration**: `left = 0`, `right = 2`
   - `mid = (0 + 2) // 2 = 1`
   - `nums[mid] = 3`, `nums[right] = 1`
   - Since `nums[mid] > nums[right]`, the minimum must be in the right half
   - Update `left = mid + 1 = 2`
4. **Third iteration**: `left = 2`, `right = 2` (loop ends)
5. **Result**: `nums[left] = 1` is the minimum

The key insight: when `nums[mid] == nums[right]`, we can't safely eliminate half the array, so we gradually shrink the search space by moving the right pointer inward.

## Brute Force Approach

The brute force solution is straightforward: simply scan the entire array and keep track of the minimum element.

**Why it's insufficient**: While this approach works (O(n) time, O(1) space), it doesn't leverage the fact that the array was originally sorted. In an interview, you'd be expected to optimize this using binary search, especially since the problem is tagged as "Hard" and the non-duplicate version has an O(log n) solution.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findMin_brute(nums):
    """
    Brute force linear scan approach.
    Works but doesn't use the sorted/rotated property.
    """
    min_val = float('inf')
    for num in nums:
        if num < min_val:
            min_val = num
    return min_val
```

```javascript
// Time: O(n) | Space: O(1)
function findMinBrute(nums) {
  /**
   * Brute force linear scan approach.
   * Works but doesn't use the sorted/rotated property.
   */
  let minVal = Infinity;
  for (let num of nums) {
    if (num < minVal) {
      minVal = num;
    }
  }
  return minVal;
}
```

```java
// Time: O(n) | Space: O(1)
public int findMinBrute(int[] nums) {
    /**
     * Brute force linear scan approach.
     * Works but doesn't use the sorted/rotated property.
     */
    int minVal = Integer.MAX_VALUE;
    for (int num : nums) {
        if (num < minVal) {
            minVal = num;
        }
    }
    return minVal;
}
```

</div>

## Optimized Approach

The optimal approach uses a modified binary search. Here's the step-by-step reasoning:

1. **Standard binary search setup**: Use `left` and `right` pointers to define the search space.

2. **Key comparison**: Compare `nums[mid]` with `nums[right]` (not `nums[left]`):
   - If `nums[mid] > nums[right]`: The minimum must be in the right half (including mid+1)
   - If `nums[mid] < nums[right]`: The minimum must be in the left half (including mid)
   - If `nums[mid] == nums[right]`: We can't determine which half contains the minimum

3. **Handling duplicates**: When `nums[mid] == nums[right]`, we can't eliminate half the array. The safest approach is to decrement `right` by 1. This gradually shrinks the search space while maintaining the invariant that the minimum remains within `[left, right]`.

4. **Termination**: The loop continues until `left == right`, at which point we've found the minimum.

**Why compare with `nums[right]` instead of `nums[left]`?** When the array is rotated, comparing with the right element gives us more reliable information about which side is sorted and which contains the rotation point.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(log n) average, O(n) worst case | Space: O(1)
def findMin(nums):
    """
    Find minimum in rotated sorted array with duplicates.

    Args:
        nums: List[int] - rotated sorted array with possible duplicates

    Returns:
        int - minimum element in the array
    """
    # Edge case: empty array (problem guarantees non-empty, but good practice)
    if not nums:
        return -1

    left, right = 0, len(nums) - 1

    # Binary search while left < right
    while left < right:
        mid = left + (right - left) // 2  # Avoid overflow, equivalent to (left+right)//2

        # Compare mid element with right element
        if nums[mid] > nums[right]:
            # Minimum must be in the right half (excluding mid)
            # Example: [3,4,5,1,2] -> nums[mid]=5 > nums[right]=2
            left = mid + 1
        elif nums[mid] < nums[right]:
            # Minimum must be in the left half (including mid)
            # Example: [5,1,2,3,4] -> nums[mid]=2 < nums[right]=4
            right = mid
        else:
            # nums[mid] == nums[right], can't determine which half
            # Example: [3,3,1,3] -> nums[mid]=3 == nums[right]=3
            # Safely shrink search space from the right
            right -= 1

    # When left == right, we've found the minimum
    return nums[left]
```

```javascript
// Time: O(log n) average, O(n) worst case | Space: O(1)
function findMin(nums) {
  /**
   * Find minimum in rotated sorted array with duplicates.
   *
   * @param {number[]} nums - rotated sorted array with possible duplicates
   * @return {number} - minimum element in the array
   */
  // Edge case: empty array (problem guarantees non-empty, but good practice)
  if (nums.length === 0) return -1;

  let left = 0;
  let right = nums.length - 1;

  // Binary search while left < right
  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2); // Avoid overflow

    // Compare mid element with right element
    if (nums[mid] > nums[right]) {
      // Minimum must be in the right half (excluding mid)
      // Example: [3,4,5,1,2] -> nums[mid]=5 > nums[right]=2
      left = mid + 1;
    } else if (nums[mid] < nums[right]) {
      // Minimum must be in the left half (including mid)
      // Example: [5,1,2,3,4] -> nums[mid]=2 < nums[right]=4
      right = mid;
    } else {
      // nums[mid] == nums[right], can't determine which half
      // Example: [3,3,1,3] -> nums[mid]=3 == nums[right]=3
      // Safely shrink search space from the right
      right--;
    }
  }

  // When left == right, we've found the minimum
  return nums[left];
}
```

```java
// Time: O(log n) average, O(n) worst case | Space: O(1)
public int findMin(int[] nums) {
    /**
     * Find minimum in rotated sorted array with duplicates.
     *
     * @param nums - rotated sorted array with possible duplicates
     * @return minimum element in the array
     */
    // Edge case: empty array (problem guarantees non-empty, but good practice)
    if (nums == null || nums.length == 0) return -1;

    int left = 0;
    int right = nums.length - 1;

    // Binary search while left < right
    while (left < right) {
        int mid = left + (right - left) / 2;  // Avoid overflow

        // Compare mid element with right element
        if (nums[mid] > nums[right]) {
            // Minimum must be in the right half (excluding mid)
            // Example: [3,4,5,1,2] -> nums[mid]=5 > nums[right]=2
            left = mid + 1;
        } else if (nums[mid] < nums[right]) {
            // Minimum must be in the left half (including mid)
            // Example: [5,1,2,3,4] -> nums[mid]=2 < nums[right]=4
            right = mid;
        } else {
            // nums[mid] == nums[right], can't determine which half
            // Example: [3,3,1,3] -> nums[mid]=3 == nums[right]=3
            // Safely shrink search space from the right
            right--;
        }
    }

    // When left == right, we've found the minimum
    return nums[left];
}
```

</div>

## Complexity Analysis

**Time Complexity**:

- **Best/Average case**: O(log n) when duplicates are sparse. Each iteration eliminates approximately half the search space.
- **Worst case**: O(n) when the array contains many duplicates. In the worst case (e.g., `[1,1,1,1,1,1,1]`), we might need to decrement `right` all the way from `n-1` to `0`, taking linear time.

**Space Complexity**: O(1). We only use a constant amount of extra space for pointers and variables.

The O(n) worst-case time is unavoidable with duplicates because when `nums[mid] == nums[right]`, we can't determine which half contains the minimum without potentially missing it.

## Common Mistakes

1. **Comparing with `nums[left]` instead of `nums[right]`**: When the array is rotated, comparing with the left element can give incorrect results. For example, in `[2,2,2,0,2]`, comparing with `nums[left]` would incorrectly eliminate the right half.

2. **Not handling the `nums[mid] == nums[right]` case properly**: Some candidates try to use the same logic as the non-duplicate version and get stuck in infinite loops or incorrect results. The key is to recognize that when values are equal, we must shrink the search space gradually.

3. **Incorrect update of pointers**: When `nums[mid] > nums[right]`, the minimum is in `(mid, right]`, so we set `left = mid + 1`. When `nums[mid] < nums[right]`, the minimum could be at `mid` or to its left, so we set `right = mid` (not `mid - 1`).

4. **Using `while (left <= right)` instead of `while (left < right)`**: With `<=`, you might need additional checks to avoid infinite loops. Using `<` and returning `nums[left]` when `left == right` is cleaner and more intuitive.

## When You'll See This Pattern

This modified binary search pattern appears in several rotated array problems:

1. **Search in Rotated Sorted Array II (LeetCode 81)**: Similar logic for searching a target in a rotated sorted array with duplicates. You need to handle the `nums[mid] == nums[right]` case by incrementing/decrementing pointers.

2. **Find Peak Element (LeetCode 162)**: While not exactly the same, it uses similar comparative logic to determine which direction to search.

3. **Find First and Last Position of Element in Sorted Array (LeetCode 34)**: Uses binary search with careful handling of equal elements to find boundaries.

The core pattern is: **when you can't determine which half to search due to equal values, gradually shrink the search space from the side that preserves the solution**.

## Key Takeaways

1. **Modified binary search for duplicates**: When duplicates prevent you from eliminating half the search space, the fallback is to shrink the space gradually (usually by 1) from the appropriate side.

2. **Compare with the right element**: For rotated array problems, comparing with `nums[right]` is often more reliable than comparing with `nums[left]` because it directly tells you about the rotation point.

3. **Worst-case linear time is acceptable**: With duplicates, O(n) worst-case time is sometimes the best you can do. Be prepared to explain why this is necessary.

Related problems: [Find Minimum in Rotated Sorted Array](/problem/find-minimum-in-rotated-sorted-array)
