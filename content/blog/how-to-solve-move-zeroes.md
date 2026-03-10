---
title: "How to Solve Move Zeroes — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Move Zeroes. Easy difficulty, 63.6% acceptance rate. Topics: Array, Two Pointers."
date: "2026-02-22"
category: "dsa-patterns"
tags: ["move-zeroes", "array", "two-pointers", "easy"]
---

# How to Solve Move Zeroes

The "Move Zeroes" problem asks us to rearrange an array so all zeros appear at the end while preserving the relative order of non-zero elements. The challenge comes from the **in-place requirement** — we can't use extra space proportional to the input size — and the need to maintain relative order, which rules out simple swaps.

## Visual Walkthrough

Let's trace through `nums = [0, 1, 0, 3, 12]` step by step:

**Initial state:** `[0, 1, 0, 3, 12]`

We'll use two pointers:

- `write` pointer: tracks where the next non-zero element should go
- `read` pointer: scans through the array looking for non-zero elements

**Step 1:** `read = 0`, `write = 0`

- `nums[read] = 0` (zero, so skip)
- Array unchanged: `[0, 1, 0, 3, 12]`

**Step 2:** `read = 1`, `write = 0`

- `nums[read] = 1` (non-zero)
- Copy `nums[read]` to `nums[write]`: `nums[0] = 1`
- Increment both pointers
- Array: `[1, 1, 0, 3, 12]` (temporary duplicate at index 1)

**Step 3:** `read = 2`, `write = 1`

- `nums[read] = 0` (zero, so skip)
- Array: `[1, 1, 0, 3, 12]`

**Step 4:** `read = 3`, `write = 1`

- `nums[read] = 3` (non-zero)
- Copy `nums[read]` to `nums[write]`: `nums[1] = 3`
- Increment both pointers
- Array: `[1, 3, 0, 3, 12]` (temporary duplicate at index 3)

**Step 5:** `read = 4`, `write = 2`

- `nums[read] = 12` (non-zero)
- Copy `nums[read]` to `nums[write]`: `nums[2] = 12`
- Increment both pointers
- Array: `[1, 3, 12, 3, 12]`

**Final step:** Fill remaining positions with zeros

- From `write = 3` to end of array, set elements to 0
- Final array: `[1, 3, 12, 0, 0]`

Notice how non-zero elements `[1, 3, 12]` maintain their original relative order.

## Brute Force Approach

A naive approach might involve creating a new array, copying all non-zero elements first, then filling the rest with zeros. However, this violates the **in-place requirement** and uses O(n) extra space.

Another brute force approach could use bubble-sort-like swaps: repeatedly scan the array and swap each zero with the next non-zero element. This would take O(n²) time in the worst case (when all zeros are at the beginning) and is unnecessarily complex.

The key insight is that we don't need to actually "move" zeros — we just need to collect non-zero elements at the front and fill the rest with zeros.

## Optimal Solution

The optimal solution uses the **two-pointer technique** with one pointer tracking where to write the next non-zero element, and another scanning through the array. This approach runs in O(n) time with O(1) space.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def moveZeroes(nums):
    """
    Move all zeros to the end while maintaining relative order of non-zero elements.

    Args:
        nums: List[int] - the input array to modify in-place
    """
    # Pointer that tracks where to place the next non-zero element
    write = 0

    # First pass: move all non-zero elements to the front
    for read in range(len(nums)):
        if nums[read] != 0:
            # Place non-zero element at the write position
            nums[write] = nums[read]
            write += 1  # Move write pointer forward

    # Second pass: fill remaining positions with zeros
    for i in range(write, len(nums)):
        nums[i] = 0
```

```javascript
// Time: O(n) | Space: O(1)
function moveZeroes(nums) {
  /**
   * Move all zeros to the end while maintaining relative order of non-zero elements.
   *
   * @param {number[]} nums - The input array to modify in-place
   * @return {void} Do not return anything, modify nums in-place instead.
   */
  // Pointer that tracks where to place the next non-zero element
  let write = 0;

  // First pass: move all non-zero elements to the front
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      // Place non-zero element at the write position
      nums[write] = nums[read];
      write++; // Move write pointer forward
    }
  }

  // Second pass: fill remaining positions with zeros
  for (let i = write; i < nums.length; i++) {
    nums[i] = 0;
  }
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public void moveZeroes(int[] nums) {
        /**
         * Move all zeros to the end while maintaining relative order of non-zero elements.
         *
         * @param nums - The input array to modify in-place
         */
        // Pointer that tracks where to place the next non-zero element
        int write = 0;

        // First pass: move all non-zero elements to the front
        for (int read = 0; read < nums.length; read++) {
            if (nums[read] != 0) {
                // Place non-zero element at the write position
                nums[write] = nums[read];
                write++;  // Move write pointer forward
            }
        }

        // Second pass: fill remaining positions with zeros
        for (int i = write; i < nums.length; i++) {
            nums[i] = 0;
        }
    }
}
```

</div>

**Alternative one-pass solution:** Some implementations use a single pass with swapping, which can be more efficient when writes are expensive, though it has the same time complexity:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - One-pass version
def moveZeroesOnePass(nums):
    write = 0
    for read in range(len(nums)):
        if nums[read] != 0:
            # Swap instead of copy to avoid the second pass
            nums[write], nums[read] = nums[read], nums[write]
            write += 1
```

```javascript
// Time: O(n) | Space: O(1) - One-pass version
function moveZeroesOnePass(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      // Swap instead of copy to avoid the second pass
      [nums[write], nums[read]] = [nums[read], nums[write]];
      write++;
    }
  }
}
```

```java
// Time: O(n) | Space: O(1) - One-pass version
public void moveZeroesOnePass(int[] nums) {
    int write = 0;
    for (int read = 0; read < nums.length; read++) {
        if (nums[read] != 0) {
            // Swap instead of copy to avoid the second pass
            int temp = nums[write];
            nums[write] = nums[read];
            nums[read] = temp;
            write++;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one or two passes through the array, each taking O(n) time
- In the two-pass solution: first pass moves non-zero elements (O(n)), second pass fills zeros (O(n) worst case)
- In the one-pass solution: we visit each element exactly once (O(n))

**Space Complexity: O(1)**

- We only use a constant amount of extra space (the `write` pointer and possibly a temporary variable for swapping)
- All modifications are done in-place on the input array

## Common Mistakes

1. **Forgetting to maintain relative order**: Some candidates try to use two pointers from both ends, swapping zeros from the left with non-zeros from the right. This breaks the relative order requirement. Always test with `[0, 1, 0, 3, 12]` to ensure output is `[1, 3, 12, 0, 0]` not `[12, 3, 1, 0, 0]`.

2. **Not handling all zeros or no zeros**: Edge cases like `[0, 0, 0]` or `[1, 2, 3]` should work correctly. With `[0, 0, 0]`, the `write` pointer never increments, so the second pass fills the entire array with zeros (which it already is). With `[1, 2, 3]`, all elements get copied to their original positions, and the second pass does nothing since `write = len(nums)`.

3. **Incorrect zero-filling range**: In the two-pass solution, candidates sometimes write `for i in range(write + 1, len(nums))` instead of `for i in range(write, len(nums))`. The `write` pointer points to the _next_ position to write, so positions `write` through `n-1` need zeros.

4. **Modifying the array while iterating**: In languages where you might use `forEach` or enhanced for-loops, modifying the array during iteration can cause issues. Always use standard for-loops with indices when doing in-place modifications.

## When You'll See This Pattern

The two-pointer technique used here appears in many array manipulation problems:

1. **Remove Element (LeetCode #27)**: Almost identical pattern — instead of moving zeros to the end, you remove elements equal to a given value. The solution uses the same `write` pointer approach.

2. **Remove Duplicates from Sorted Array (LeetCode #26)**: Uses a similar two-pointer approach where one pointer tracks where to write the next unique element.

3. **Sort Colors (LeetCode #75)**: A more advanced version where you partition an array into three sections (like the Dutch National Flag problem), using multiple pointers.

4. **Apply Operations to an Array (LeetCode #2460)**: A variation where you perform operations before moving zeros, but the zero-moving part uses the exact same pattern.

The core pattern is: **when you need to rearrange elements in an array based on some condition while maintaining order, consider using a write pointer to track where the next "good" element should go.**

## Key Takeaways

1. **The two-pointer write/read pattern** is perfect for in-place array modifications where you need to filter or rearrange elements. The `write` pointer tracks where to place the next element that meets your criteria, while the `read` pointer scans through the array.

2. **You don't always need to actually "move" elements** — sometimes it's easier to collect what you want first, then handle what's left. In this case, we collect non-zeros, then fill the rest with zeros.

3. **Test edge cases systematically**: All zeros, no zeros, single element, empty array. These often reveal off-by-one errors in pointer logic.

Related problems: [Remove Element](/problem/remove-element), [Apply Operations to an Array](/problem/apply-operations-to-an-array)
