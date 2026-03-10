---
title: "How to Solve Remove Duplicates from Sorted Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Remove Duplicates from Sorted Array. Easy difficulty, 62.3% acceptance rate. Topics: Array, Two Pointers."
date: "2026-02-05"
category: "dsa-patterns"
tags: ["remove-duplicates-from-sorted-array", "array", "two-pointers", "easy"]
---

# How to Solve Remove Duplicates from Sorted Array

This problem asks us to remove duplicate elements from a sorted array **in-place**, keeping only one occurrence of each unique element while maintaining their relative order. The tricky part is that we must modify the original array without using extra space for another array, and we need to return the count of unique elements. This is a classic two-pointer problem that tests your understanding of in-place array manipulation.

## Visual Walkthrough

Let's trace through an example: `nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]`

We'll use two pointers:

- `unique_ptr` (or `k`) tracks where to place the next unique element
- `i` scans through the array looking for new unique elements

**Step-by-step process:**

1. Initialize `unique_ptr = 0` (first element is always unique)
2. Start scanning with `i = 1`:
   - `i = 1`: `nums[1] = 0`, same as `nums[unique_ptr] = 0` → skip (duplicate)
   - `i = 2`: `nums[2] = 1`, different from `nums[unique_ptr] = 0` → found new unique!
     - Increment `unique_ptr` to 1
     - Copy `nums[2]` to `nums[unique_ptr]` → `nums[1] = 1`
     - Array: `[0, 1, 1, 1, 1, 2, 2, 3, 3, 4]`
   - `i = 3`: `nums[3] = 1`, same as `nums[unique_ptr] = 1` → skip
   - `i = 4`: `nums[4] = 1`, same as `nums[unique_ptr] = 1` → skip
   - `i = 5`: `nums[5] = 2`, different from `nums[unique_ptr] = 1` → found new unique!
     - Increment `unique_ptr` to 2
     - Copy `nums[5]` to `nums[unique_ptr]` → `nums[2] = 2`
     - Array: `[0, 1, 2, 1, 1, 2, 2, 3, 3, 4]`
   - Continue this process...

After processing all elements:

- Final array: `[0, 1, 2, 3, 4, 2, 2, 3, 3, 4]` (first 5 elements are unique)
- Return `unique_ptr + 1 = 5` (number of unique elements)

The key insight: because the array is sorted, all duplicates are adjacent. When we find a new unique element, we place it at the next available position in the "unique section" of the array.

## Brute Force Approach

A naive approach would be to use extra space:

1. Create a new empty array or set
2. Iterate through `nums`, adding elements to the set if not already present
3. Copy the unique elements back to the original array
4. Return the count of unique elements

**Why this isn't optimal:**

- Space complexity would be O(n) for the new array/set
- The problem specifically asks for **in-place** modification
- While this would work, it doesn't meet the space constraints implied by the "in-place" requirement

Even though the problem doesn't explicitly forbid extra space, the optimal solution uses O(1) extra space, which is what interviewers expect for this type of array manipulation problem.

## Optimal Solution

The optimal solution uses the **two-pointer technique**. One pointer tracks where to place the next unique element, and the other scans through the array. Since the array is sorted, duplicates are adjacent, so we only need to compare each element with the last unique element we found.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def removeDuplicates(nums):
    """
    Removes duplicates from a sorted array in-place.

    Args:
        nums: List[int] - sorted array in non-decreasing order

    Returns:
        int - number of unique elements
    """
    # Edge case: empty array
    if not nums:
        return 0

    # Pointer to track where to place the next unique element
    # First element is always unique, so start at index 0
    unique_ptr = 0

    # Start scanning from the second element (index 1)
    for i in range(1, len(nums)):
        # If current element is different from the last unique element
        # we found a new unique element
        if nums[i] != nums[unique_ptr]:
            # Move unique pointer forward to next position
            unique_ptr += 1
            # Place the new unique element at the unique pointer position
            nums[unique_ptr] = nums[i]

    # Return count of unique elements (unique_ptr is 0-indexed, so add 1)
    return unique_ptr + 1
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Removes duplicates from a sorted array in-place.
 *
 * @param {number[]} nums - sorted array in non-decreasing order
 * @return {number} - number of unique elements
 */
function removeDuplicates(nums) {
  // Edge case: empty array
  if (nums.length === 0) {
    return 0;
  }

  // Pointer to track where to place the next unique element
  // First element is always unique, so start at index 0
  let uniquePtr = 0;

  // Start scanning from the second element (index 1)
  for (let i = 1; i < nums.length; i++) {
    // If current element is different from the last unique element
    // we found a new unique element
    if (nums[i] !== nums[uniquePtr]) {
      // Move unique pointer forward to next position
      uniquePtr++;
      // Place the new unique element at the unique pointer position
      nums[uniquePtr] = nums[i];
    }
  }

  // Return count of unique elements (uniquePtr is 0-indexed, so add 1)
  return uniquePtr + 1;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Removes duplicates from a sorted array in-place.
     *
     * @param nums - sorted array in non-decreasing order
     * @return number of unique elements
     */
    public int removeDuplicates(int[] nums) {
        // Edge case: empty array
        if (nums.length == 0) {
            return 0;
        }

        // Pointer to track where to place the next unique element
        // First element is always unique, so start at index 0
        int uniquePtr = 0;

        // Start scanning from the second element (index 1)
        for (int i = 1; i < nums.length; i++) {
            // If current element is different from the last unique element
            // we found a new unique element
            if (nums[i] != nums[uniquePtr]) {
                // Move unique pointer forward to next position
                uniquePtr++;
                // Place the new unique element at the unique pointer position
                nums[uniquePtr] = nums[i];
            }
        }

        // Return count of unique elements (uniquePtr is 0-indexed, so add 1)
        return uniquePtr + 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array exactly once with the `i` pointer
- Each element is examined once, and unique elements are copied once
- The loop runs `n-1` times (or `n` times for empty array check), giving us linear time

**Space Complexity: O(1)**

- We only use a constant amount of extra space: the `unique_ptr` variable and loop counter
- All modifications are done in-place on the original array
- No additional arrays, sets, or data structures are created

The algorithm is optimal because we must examine each element at least once to determine if it's unique, giving us a lower bound of O(n) time. The O(1) space is the best possible since we're modifying the array in-place.

## Common Mistakes

1. **Forgetting the empty array edge case**: If the array is empty, we should return 0 immediately. Without this check, accessing `nums[0]` would cause an index error.

2. **Starting the unique pointer at 1 instead of 0**: Some candidates think they need to skip the first element, but the first element is always unique and should be counted. Starting at 1 would miss it.

3. **Comparing with the wrong element**: A common error is comparing `nums[i]` with `nums[i-1]` instead of `nums[unique_ptr]`. While this often works, it's less intuitive and can lead to off-by-one errors when implementing variations of this problem.

4. **Returning the wrong value**: Remember that `unique_ptr` is 0-indexed, so the count of unique elements is `unique_ptr + 1`. Some candidates return `unique_ptr` or the length of the modified portion incorrectly.

5. **Modifying the array incorrectly when all elements are unique**: In this case, the algorithm still works correctly because when `nums[i] != nums[unique_ptr]`, we increment `unique_ptr` and copy the element to the same position (since `unique_ptr + 1 == i`). This is inefficient but correct.

## When You'll See This Pattern

The two-pointer technique used here appears in many array manipulation problems:

1. **Remove Element (LeetCode 27)**: Almost identical pattern - one pointer tracks where to place elements that should be kept, another scans through the array.

2. **Remove Duplicates from Sorted Array II (LeetCode 80)**: A variation where you're allowed at most 2 duplicates. The same two-pointer approach works with a slight modification to track count of duplicates.

3. **Move Zeroes (LeetCode 283)**: Similar pattern where you move non-zero elements to the front and zeros to the end using two pointers.

4. **Merge Sorted Array (LeetCode 88)**: Uses two pointers starting from the end of each array to merge in-place.

The key insight is that when you need to filter or rearrange elements in an array in-place, two pointers (one for reading, one for writing) is often the optimal approach.

## Key Takeaways

1. **Sorted arrays enable efficient duplicate removal**: Because duplicates are adjacent in sorted arrays, we only need to compare each element with the last unique element we found, not with all previous elements.

2. **Two-pointer technique for in-place modification**: When you need to modify an array in-place while preserving some order, consider using one pointer to track where to write and another to scan through the array.

3. **Edge cases matter**: Always check for empty arrays and single-element arrays. These often reveal bugs in the logic.

4. **The return value is part of the contract**: In this problem, you need to both modify the array AND return the count of unique elements. Forgetting either part is a common interview mistake.

Related problems: [Remove Element](/problem/remove-element), [Remove Duplicates from Sorted Array II](/problem/remove-duplicates-from-sorted-array-ii), [Apply Operations to an Array](/problem/apply-operations-to-an-array)
