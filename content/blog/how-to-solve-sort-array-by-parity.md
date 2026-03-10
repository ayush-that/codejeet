---
title: "How to Solve Sort Array By Parity — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sort Array By Parity. Easy difficulty, 76.5% acceptance rate. Topics: Array, Two Pointers, Sorting."
date: "2026-10-18"
category: "dsa-patterns"
tags: ["sort-array-by-parity", "array", "two-pointers", "sorting", "easy"]
---

# How to Solve Sort Array By Parity

The problem asks us to rearrange an array so all even numbers appear before all odd numbers, while preserving the relative order of numbers within each group. While this sounds simple, the challenge lies in doing it efficiently in-place (O(1) space) while maintaining stability (preserving order). This is essentially a two-pointer partitioning problem that tests your ability to manipulate array indices correctly.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 1, 2, 4]`

We want to move all even numbers to the front. A good approach is to use two pointers:

- `i` starts at the beginning and moves forward looking for odd numbers
- `j` starts at the end and moves backward looking for even numbers

Step-by-step:

1. Initialize `i = 0`, `j = 3`
2. `nums[i] = 3` (odd) and `nums[j] = 4` (even) → swap them: `[4, 1, 2, 3]`
3. Increment `i` to 1, decrement `j` to 2
4. `nums[i] = 1` (odd) and `nums[j] = 2` (even) → swap them: `[4, 2, 1, 3]`
5. Increment `i` to 2, decrement `j` to 1
6. Now `i > j`, so we stop

Result: `[4, 2, 1, 3]` — all evens (4, 2) come before all odds (1, 3)

## Brute Force Approach

A naive approach would be to create two separate arrays: one for evens and one for odds. Then concatenate them back into the original array.

**Why this isn't optimal:**

- Requires O(n) extra space for the two arrays
- While the time complexity is O(n), we can do better with in-place swapping
- The problem doesn't require preserving relative order, so we can use a more efficient in-place algorithm

However, if the problem required stable sorting (preserving order within evens and odds), this two-array approach would actually be reasonable. For this specific problem statement, we can optimize further.

## Optimal Solution

The most efficient solution uses the two-pointer technique with one pointer starting at the beginning and another at the end. We swap whenever we find an odd number at the front and an even number at the back.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - in-place modification
def sortArrayByParity(nums):
    """
    Rearranges nums so all even numbers come before all odd numbers.
    Uses two pointers: one from start (i), one from end (j).
    Swaps when nums[i] is odd and nums[j] is even.
    """
    i, j = 0, len(nums) - 1

    # Continue until pointers cross
    while i < j:
        # Move i forward while nums[i] is even (already in correct position)
        while i < j and nums[i] % 2 == 0:
            i += 1

        # Move j backward while nums[j] is odd (already in correct position)
        while i < j and nums[j] % 2 == 1:
            j -= 1

        # At this point, nums[i] is odd and nums[j] is even, so swap them
        if i < j:
            nums[i], nums[j] = nums[j], nums[i]
            i += 1
            j -= 1

    return nums
```

```javascript
// Time: O(n) | Space: O(1) - in-place modification
function sortArrayByParity(nums) {
  /**
   * Rearranges nums so all even numbers come before all odd numbers.
   * Uses two pointers: one from start (left), one from end (right).
   * Swaps when nums[left] is odd and nums[right] is even.
   */
  let left = 0;
  let right = nums.length - 1;

  // Continue until pointers cross
  while (left < right) {
    // Move left forward while nums[left] is even (already in correct position)
    while (left < right && nums[left] % 2 === 0) {
      left++;
    }

    // Move right backward while nums[right] is odd (already in correct position)
    while (left < right && nums[right] % 2 === 1) {
      right--;
    }

    // At this point, nums[left] is odd and nums[right] is even, so swap them
    if (left < right) {
      // Swap using destructuring assignment
      [nums[left], nums[right]] = [nums[right], nums[left]];
      left++;
      right--;
    }
  }

  return nums;
}
```

```java
// Time: O(n) | Space: O(1) - in-place modification
class Solution {
    public int[] sortArrayByParity(int[] nums) {
        /**
         * Rearranges nums so all even numbers come before all odd numbers.
         * Uses two pointers: one from start (left), one from end (right).
         * Swaps when nums[left] is odd and nums[right] is even.
         */
        int left = 0;
        int right = nums.length - 1;

        // Continue until pointers cross
        while (left < right) {
            // Move left forward while nums[left] is even (already in correct position)
            while (left < right && nums[left] % 2 == 0) {
                left++;
            }

            // Move right backward while nums[right] is odd (already in correct position)
            while (left < right && nums[right] % 2 == 1) {
                right--;
            }

            // At this point, nums[left] is odd and nums[right] is even, so swap them
            if (left < right) {
                int temp = nums[left];
                nums[left] = nums[right];
                nums[right] = temp;
                left++;
                right--;
            }
        }

        return nums;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the array once with two pointers
- Each element is examined at most once
- The inner while loops don't add extra complexity because each pointer moves through the array exactly once

**Space Complexity: O(1)**

- We only use a constant amount of extra space for the pointers and temporary swap variable
- The modification is done in-place on the input array

## Common Mistakes

1. **Forgetting to check `i < j` in the inner while loops**: This can cause index out of bounds errors when the array contains all evens or all odds. Always include the boundary check.

2. **Incorrect parity check**: Using `nums[i] % 2 == 1` to check for odd numbers fails for negative numbers (e.g., -3 % 2 = -1 in some languages). Use `nums[i] % 2 != 0` or check both `== 1` and `== -1`.

3. **Not incrementing/decrementing pointers after swap**: After swapping, you must move both pointers; otherwise, you'll get stuck in an infinite loop checking the same elements repeatedly.

4. **Assuming order preservation is required**: The problem says "return any array that satisfies this condition," so we don't need to preserve relative order. If order mattered, we'd need a different approach.

## When You'll See This Pattern

This two-pointer partitioning technique appears in many array manipulation problems:

1. **Move Zeroes (LeetCode 283)**: Similar pattern but moving zeros to the end instead of odds/evens.

2. **Quick Sort Partition**: This is essentially the partition step of quicksort, using parity as the pivot condition instead of a pivot value.

3. **Sort Colors (LeetCode 75)**: A three-pointer variation of this pattern for sorting three distinct values.

4. **Valid Palindrome (LeetCode 125)**: Uses two pointers moving inward, though for comparison rather than swapping.

## Key Takeaways

1. **Two-pointer technique is powerful for in-place array rearrangement**: When you need to partition an array based on a condition, consider using one pointer from the start and one from the end.

2. **Always check pointer boundaries**: The `i < j` check in both outer and inner loops is crucial to prevent index errors.

3. **Understand what "any array" means**: When the problem allows any valid arrangement, you can use swapping techniques that don't preserve relative order, which are more space-efficient.

Related problems: [Sort Array By Parity II](/problem/sort-array-by-parity-ii), [Sort Even and Odd Indices Independently](/problem/sort-even-and-odd-indices-independently), [Largest Number After Digit Swaps by Parity](/problem/largest-number-after-digit-swaps-by-parity)
