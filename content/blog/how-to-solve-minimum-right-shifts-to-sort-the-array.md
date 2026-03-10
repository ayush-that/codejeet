---
title: "How to Solve Minimum Right Shifts to Sort the Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Right Shifts to Sort the Array. Easy difficulty, 57.3% acceptance rate. Topics: Array."
date: "2028-10-21"
category: "dsa-patterns"
tags: ["minimum-right-shifts-to-sort-the-array", "array", "easy"]
---

# How to Solve Minimum Right Shifts to Sort the Array

You're given an array of distinct positive integers and need to find the minimum number of right shifts required to sort it. A right shift moves each element one position to the right, with the last element wrapping around to the front. The challenge is that the array must be sortable through this rotation operation—if it's not, you return -1. What makes this interesting is that we're not actually performing the shifts; we're analyzing the structure of the array to determine if it can be sorted through rotation and, if so, how many rotations are needed.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [3, 4, 5, 1, 2]`.

1. **Check if sorted**: The array isn't sorted as-is (3, 4, 5, 1, 2).
2. **Look for the "break point"**: In a sorted array rotated some number of times, there should be exactly one place where `nums[i] > nums[i+1]`. Let's check:
   - Compare 3 and 4: 3 < 4 ✓
   - Compare 4 and 5: 4 < 5 ✓
   - Compare 5 and 1: 5 > 1 ← Found the break point at index 2
   - Compare 1 and 2: 1 < 2 ✓
3. **Verify it's sortable**: Since we found exactly one break point, this array can be sorted by rotating. The break point tells us where the original sorted sequence was split.
4. **Calculate shifts**: The break point is at index 2. This means elements from index 3 onward (1, 2) were originally at the beginning of the sorted array. To restore the sorted order, we need to right-shift enough times to move these elements back to the front. Since there are 2 elements after the break point (indices 3 and 4), we need 2 right shifts.

Let's verify: After 1 right shift: [2, 3, 4, 5, 1]  
After 2 right shifts: [1, 2, 3, 4, 5] ✓ Sorted!

Now consider `nums = [2, 1, 4, 3]`:

- Compare 2 and 1: 2 > 1 ← First break point
- Compare 1 and 4: 1 < 4 ✓
- Compare 4 and 3: 4 > 3 ← Second break point
  We found two break points, so this array cannot be sorted through rotation alone. Return -1.

## Brute Force Approach

A naive approach would be to actually perform right shifts one by one until the array is sorted, counting as we go. For each shift, we'd check if the array is sorted, which takes O(n) time. In the worst case, we might need to check all n possible rotations.

**Why this is inefficient**:

- Time complexity: O(n²) since we might perform n rotations and check n elements each time
- Space complexity: O(n) if we create new arrays for each rotation
- The problem constraints (n up to 100) make this technically acceptable, but it's not the elegant solution an interviewer expects. More importantly, it misses the insight about analyzing the array structure directly.

## Optimal Solution

The key insight is that for an array to be sortable by rotation, it must consist of two sorted segments: the first segment decreasing (or rather, the wrap-around point) and the second segment increasing, with exactly one "break point" where `nums[i] > nums[i+1]`. If we find zero break points, the array is already sorted (0 shifts needed). If we find more than one break point, it's impossible to sort through rotation (-1). If we find exactly one break point, the number of shifts needed equals `n - breakIndex - 1`.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimumRightShifts(nums):
    """
    Find minimum right shifts to sort array through rotation.

    Args:
        nums: List of distinct positive integers

    Returns:
        Minimum right shifts needed or -1 if impossible
    """
    n = len(nums)
    break_count = 0
    break_index = -1

    # Step 1: Count how many times nums[i] > nums[i+1]
    # This identifies "break points" where sorted order is violated
    for i in range(n - 1):
        if nums[i] > nums[i + 1]:
            break_count += 1
            break_index = i  # Store the last break point

    # Step 2: Check the wrap-around case (last element vs first element)
    # This is needed because rotation creates a circular relationship
    if nums[-1] > nums[0]:
        break_count += 1

    # Step 3: Determine if sortable through rotation
    # More than one break point means impossible to sort via rotation
    if break_count > 1:
        return -1

    # Step 4: Calculate shifts needed
    # If already sorted (break_count == 0), no shifts needed
    if break_count == 0:
        return 0

    # If exactly one break point, shifts needed = elements after break point
    # Formula: n - break_index - 1
    return n - break_index - 1
```

```javascript
// Time: O(n) | Space: O(1)
function minimumRightShifts(nums) {
  /**
   * Find minimum right shifts to sort array through rotation.
   *
   * @param {number[]} nums - Array of distinct positive integers
   * @return {number} Minimum right shifts needed or -1 if impossible
   */
  const n = nums.length;
  let breakCount = 0;
  let breakIndex = -1;

  // Step 1: Count how many times nums[i] > nums[i+1]
  // This identifies "break points" where sorted order is violated
  for (let i = 0; i < n - 1; i++) {
    if (nums[i] > nums[i + 1]) {
      breakCount++;
      breakIndex = i; // Store the last break point
    }
  }

  // Step 2: Check the wrap-around case (last element vs first element)
  // This is needed because rotation creates a circular relationship
  if (nums[n - 1] > nums[0]) {
    breakCount++;
  }

  // Step 3: Determine if sortable through rotation
  // More than one break point means impossible to sort via rotation
  if (breakCount > 1) {
    return -1;
  }

  // Step 4: Calculate shifts needed
  // If already sorted (breakCount === 0), no shifts needed
  if (breakCount === 0) {
    return 0;
  }

  // If exactly one break point, shifts needed = elements after break point
  // Formula: n - breakIndex - 1
  return n - breakIndex - 1;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minimumRightShifts(List<Integer> nums) {
        /**
         * Find minimum right shifts to sort array through rotation.
         *
         * @param nums List of distinct positive integers
         * @return Minimum right shifts needed or -1 if impossible
         */
        int n = nums.size();
        int breakCount = 0;
        int breakIndex = -1;

        // Step 1: Count how many times nums[i] > nums[i+1]
        // This identifies "break points" where sorted order is violated
        for (int i = 0; i < n - 1; i++) {
            if (nums.get(i) > nums.get(i + 1)) {
                breakCount++;
                breakIndex = i;  // Store the last break point
            }
        }

        // Step 2: Check the wrap-around case (last element vs first element)
        // This is needed because rotation creates a circular relationship
        if (nums.get(n - 1) > nums.get(0)) {
            breakCount++;
        }

        // Step 3: Determine if sortable through rotation
        // More than one break point means impossible to sort via rotation
        if (breakCount > 1) {
            return -1;
        }

        // Step 4: Calculate shifts needed
        // If already sorted (breakCount == 0), no shifts needed
        if (breakCount == 0) {
            return 0;
        }

        // If exactly one break point, shifts needed = elements after break point
        // Formula: n - breakIndex - 1
        return n - breakIndex - 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array to count break points: O(n)
- We perform one additional comparison for the wrap-around check: O(1)
- All other operations are constant time: O(1)

**Space Complexity: O(1)**

- We only use a fixed number of variables (n, breakCount, breakIndex) regardless of input size
- No additional data structures are created that scale with input size

## Common Mistakes

1. **Forgetting the wrap-around check**: Candidates often only check adjacent pairs `nums[i] > nums[i+1]` for `i = 0` to `n-2`, but miss that in a rotated sorted array, the last element should be less than the first element. This causes incorrect results for cases like `[2, 3, 4, 5, 1]`.

2. **Off-by-one errors in shift calculation**: When calculating `n - breakIndex - 1`, candidates might use `n - breakIndex` (off by 1) or `breakIndex + 1` (wrong direction). Remember: if the break is at index `i`, there are `n - i - 1` elements after it that need to be shifted to the front.

3. **Incorrect handling of already-sorted array**: If the array is already sorted (`breakCount == 0`), we should return 0, not continue with the shift calculation. Some candidates forget this special case.

4. **Assuming only one sorted segment**: The problem states the array contains distinct positive integers, but candidates might incorrectly assume the array is a rotation of a sorted array. Always verify by counting break points—if more than one, return -1.

## When You'll See This Pattern

This problem uses the **rotated sorted array analysis** pattern, which appears in several other problems:

1. **Search in Rotated Sorted Array (LeetCode 33)**: Uses similar logic to find the rotation point (pivot) before performing binary search. The technique of finding where the sorted order "breaks" is identical.

2. **Find Minimum in Rotated Sorted Array (LeetCode 153)**: Directly finds the rotation point, which is essentially the break point plus one in our problem.

3. **Check if Array Is Sorted and Rotated (LeetCode 1752)**: Almost identical to this problem—checking if an array can be a rotation of a sorted array by counting break points.

The core technique is recognizing that a rotated sorted array has at most one "descent" (where `nums[i] > nums[i+1]`), and using this property to determine rotation information without actually rotating.

## Key Takeaways

1. **Look for structural properties**: Instead of simulating operations (like actually performing shifts), analyze the array's structure. A rotated sorted array has exactly zero or one "break points" where `nums[i] > nums[i+1]`.

2. **Handle circular structures carefully**: When dealing with rotations/cyclic data, remember to check the wrap-around case (last element vs first element). This is a common oversight in rotation problems.

3. **Count, don't simulate**: For "minimum operations" problems, often the answer can be derived from counting certain properties rather than simulating the process step-by-step. This leads to optimal O(n) solutions instead of O(n²).

[Practice this problem on CodeJeet](/problem/minimum-right-shifts-to-sort-the-array)
