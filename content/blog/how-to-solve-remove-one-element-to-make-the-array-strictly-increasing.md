---
title: "How to Solve Remove One Element to Make the Array Strictly Increasing — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Remove One Element to Make the Array Strictly Increasing. Easy difficulty, 29.6% acceptance rate. Topics: Array."
date: "2027-10-02"
category: "dsa-patterns"
tags: ["remove-one-element-to-make-the-array-strictly-increasing", "array", "easy"]
---

# How to Solve Remove One Element to Make the Array Strictly Increasing

This problem asks us to determine if we can remove exactly one element from an array to make it strictly increasing. The tricky part is that we need to check all possible removal positions efficiently, and handle cases where removing one element might fix multiple violations or create new ones.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 10, 5, 7]`

**Step 1:** Check if the array is already strictly increasing.

- Compare 1 < 2 ✓
- Compare 2 < 10 ✓
- Compare 10 < 5 ✗ (violation at index 3)

**Step 2:** We found a violation at index 3 (10 > 5). When we find a violation `nums[i-1] >= nums[i]`, we have two candidates for removal:

- Remove `nums[i-1]` (10 at index 2)
- Remove `nums[i]` (5 at index 3)

**Step 3:** Test removing `nums[i-1]` (index 2):

- New array would be: `[1, 2, 5, 7]`
- Check: 1 < 2 ✓, 2 < 5 ✓, 5 < 7 ✓
- This works!

**Step 4:** But we should also check the other possibility. Test removing `nums[i]` (index 3):

- New array would be: `[1, 2, 10, 7]`
- Check: 1 < 2 ✓, 2 < 10 ✓, 10 < 7 ✗
- This fails.

Since at least one option works, we return `true`.

The key insight is that when we find a violation, we only need to check the two elements involved in that violation as potential removal candidates.

## Brute Force Approach

A naive approach would be to try removing each element one by one and checking if the resulting array is strictly increasing:

1. For each index `i` from 0 to n-1:
   - Create a new array without element at index `i`
   - Check if this new array is strictly increasing
   - If yes, return `true`

2. If we've tried all indices and none work, return `false`

**Why this is inefficient:**

- Time complexity: O(n²) - For each of n elements, we create a new array (O(n)) and check if it's increasing (O(n))
- Space complexity: O(n) for creating new arrays
- This approach is too slow for large arrays (n up to 10⁵ in typical constraints)

## Optimal Solution

The optimal solution uses a single pass through the array. We look for the first violation where `nums[i-1] >= nums[i]`. When we find it, we check if removing either `nums[i-1]` or `nums[i]` would fix the array. We need helper functions to check if a subarray is strictly increasing without actually creating new arrays.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def canBeIncreasing(nums):
    """
    Check if removing exactly one element makes the array strictly increasing.

    Approach:
    1. Find the first violation where nums[i-1] >= nums[i]
    2. Try removing nums[i-1] and check if the rest is increasing
    3. Try removing nums[i] and check if the rest is increasing
    4. If either works, return True, else False
    """
    n = len(nums)

    # Helper function to check if array is strictly increasing
    # from start to end (inclusive start, exclusive end)
    def is_strictly_increasing(arr, start, end):
        """Check if subarray arr[start:end] is strictly increasing."""
        for i in range(start + 1, end):
            if arr[i - 1] >= arr[i]:
                return False
        return True

    # Find the first violation
    for i in range(1, n):
        if nums[i - 1] >= nums[i]:
            # Found a violation at position i

            # Option 1: Remove nums[i-1]
            # Check if array without nums[i-1] is strictly increasing
            # We need to check two parts:
            # 1. Everything before i-1 (already checked to be increasing)
            # 2. The connection between nums[i-2] and nums[i] (if i-2 exists)
            # 3. Everything after i (needs checking)

            # Check if removing nums[i-1] works
            # Case 1: i-2 doesn't exist (i-1 is the first element)
            # Case 2: i-2 exists, check nums[i-2] < nums[i]
            remove_prev_valid = True
            if i - 2 >= 0 and nums[i - 2] >= nums[i]:
                remove_prev_valid = False
            # Also need to check the rest of the array after i
            if remove_prev_valid and not is_strictly_increasing(nums, i + 1, n):
                remove_prev_valid = False

            # Option 2: Remove nums[i]
            # Check if array without nums[i] is strictly increasing
            remove_current_valid = True
            # Check the connection between nums[i-1] and nums[i+1] (if i+1 exists)
            if i + 1 < n and nums[i - 1] >= nums[i + 1]:
                remove_current_valid = False
            # Also need to check the rest of the array after i+1
            if remove_current_valid and not is_strictly_increasing(nums, i + 2, n):
                remove_current_valid = False

            # If either removal works, we can make the array strictly increasing
            return remove_prev_valid or remove_current_valid

    # No violations found, array is already strictly increasing
    return True
```

```javascript
// Time: O(n) | Space: O(1)
function canBeIncreasing(nums) {
  /**
   * Check if removing exactly one element makes the array strictly increasing.
   *
   * Approach:
   * 1. Find the first violation where nums[i-1] >= nums[i]
   * 2. Try removing nums[i-1] and check if the rest is increasing
   * 3. Try removing nums[i] and check if the rest is increasing
   * 4. If either works, return true, else false
   */

  const n = nums.length;

  // Helper function to check if subarray is strictly increasing
  // from start to end (inclusive start, exclusive end)
  const isStrictlyIncreasing = (start, end) => {
    for (let i = start + 1; i < end; i++) {
      if (nums[i - 1] >= nums[i]) {
        return false;
      }
    }
    return true;
  };

  // Find the first violation
  for (let i = 1; i < n; i++) {
    if (nums[i - 1] >= nums[i]) {
      // Found a violation at position i

      // Option 1: Remove nums[i-1]
      let removePrevValid = true;

      // Check the connection between nums[i-2] and nums[i] if i-2 exists
      if (i - 2 >= 0 && nums[i - 2] >= nums[i]) {
        removePrevValid = false;
      }

      // Check the rest of the array after i
      if (removePrevValid && !isStrictlyIncreasing(i + 1, n)) {
        removePrevValid = false;
      }

      // Option 2: Remove nums[i]
      let removeCurrentValid = true;

      // Check the connection between nums[i-1] and nums[i+1] if i+1 exists
      if (i + 1 < n && nums[i - 1] >= nums[i + 1]) {
        removeCurrentValid = false;
      }

      // Check the rest of the array after i+1
      if (removeCurrentValid && !isStrictlyIncreasing(i + 2, n)) {
        removeCurrentValid = false;
      }

      // If either removal works, we can make the array strictly increasing
      return removePrevValid || removeCurrentValid;
    }
  }

  // No violations found, array is already strictly increasing
  return true;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean canBeIncreasing(int[] nums) {
        /**
         * Check if removing exactly one element makes the array strictly increasing.
         *
         * Approach:
         * 1. Find the first violation where nums[i-1] >= nums[i]
         * 2. Try removing nums[i-1] and check if the rest is increasing
         * 3. Try removing nums[i] and check if the rest is increasing
         * 4. If either works, return true, else false
         */

        int n = nums.length;

        // Find the first violation
        for (int i = 1; i < n; i++) {
            if (nums[i - 1] >= nums[i]) {
                // Found a violation at position i

                // Option 1: Remove nums[i-1]
                boolean removePrevValid = true;

                // Check the connection between nums[i-2] and nums[i] if i-2 exists
                if (i - 2 >= 0 && nums[i - 2] >= nums[i]) {
                    removePrevValid = false;
                }

                // Check the rest of the array after i
                if (removePrevValid && !isStrictlyIncreasing(nums, i + 1, n)) {
                    removePrevValid = false;
                }

                // Option 2: Remove nums[i]
                boolean removeCurrentValid = true;

                // Check the connection between nums[i-1] and nums[i+1] if i+1 exists
                if (i + 1 < n && nums[i - 1] >= nums[i + 1]) {
                    removeCurrentValid = false;
                }

                // Check the rest of the array after i+1
                if (removeCurrentValid && !isStrictlyIncreasing(nums, i + 2, n)) {
                    removeCurrentValid = false;
                }

                // If either removal works, we can make the array strictly increasing
                return removePrevValid || removeCurrentValid;
            }
        }

        // No violations found, array is already strictly increasing
        return true;
    }

    // Helper method to check if subarray is strictly increasing
    // from start to end (inclusive start, exclusive end)
    private boolean isStrictlyIncreasing(int[] nums, int start, int end) {
        for (int i = start + 1; i < end; i++) {
            if (nums[i - 1] >= nums[i]) {
                return false;
            }
        }
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array to find the first violation: O(n)
- When we find a violation, we check at most two subarrays:
  - Checking the rest of the array after the violation: O(n) in worst case
  - But this only happens once, so total is O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables
- We don't create any new arrays or use recursion

## Common Mistakes

1. **Only checking one removal option**: When finding `nums[i-1] >= nums[i]`, some candidates only try removing `nums[i]` and forget to check removing `nums[i-1]`. Both must be checked because sometimes one works and the other doesn't.

2. **Not checking the entire array after removal**: After deciding which element to remove, you must check that the ENTIRE resulting array is strictly increasing, not just the point of violation. For example, in `[1, 2, 3, 2, 4, 5]`, removing the first 2 fixes the immediate violation but creates a new one later.

3. **Off-by-one errors with array bounds**: When checking `nums[i-2]` or `nums[i+1]`, you must verify these indices exist before accessing them. Failing to do so causes ArrayIndexOutOfBounds exceptions.

4. **Assuming at most one violation**: The problem allows multiple violations if removing one element fixes them all. For example, `[1, 2, 3, 2, 4, 5]` has violations but removing the second 2 fixes everything.

## When You'll See This Pattern

This "single violation fix" pattern appears in problems where you need to check array ordering with limited modifications:

1. **Non-decreasing Array (LeetCode 665)**: Very similar problem - check if array can be made non-decreasing by modifying at most one element.

2. **Steps to Make Array Non-decreasing (LeetCode 2289)**: A more complex version where you need to count steps to remove elements until array is non-decreasing.

3. **Array transformation problems**: Any problem where you need to check if an array can be made to satisfy a property with limited operations often uses similar single-pass approaches.

The core technique is identifying critical points where the property is violated and systematically checking limited modification options around those points.

## Key Takeaways

1. **Single violation principle**: When you can make at most one modification, you only need to check the first violation point thoroughly. If removing one element doesn't fix the first violation, no single removal will fix the array.

2. **Check both sides of a violation**: When you find `nums[i-1] >= nums[i]`, both `nums[i-1]` and `nums[i]` are candidates for removal. You must check both possibilities.

3. **Boundary awareness is critical**: Always check array bounds before accessing `i-2`, `i+1`, etc. Edge cases (first element, last element) often break naive implementations.

Related problems: [Steps to Make Array Non-decreasing](/problem/steps-to-make-array-non-decreasing), [Find the Maximum Factor Score of Array](/problem/find-the-maximum-factor-score-of-array)
