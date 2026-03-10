---
title: "How to Solve Apply Operations to an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Apply Operations to an Array. Easy difficulty, 74.7% acceptance rate. Topics: Array, Two Pointers, Simulation."
date: "2028-03-17"
category: "dsa-patterns"
tags: ["apply-operations-to-an-array", "array", "two-pointers", "simulation", "easy"]
---

# How to Solve "Apply Operations to an Array"

This problem asks you to transform an array by applying two rules: when adjacent elements are equal, double the left one and set the right one to zero, then shift all non-zero elements to the front while maintaining their relative order. What makes this interesting is that it combines two distinct operations—pairwise comparison/modification and zero rearrangement—into a single transformation that must be performed in-place. The challenge lies in executing both phases correctly without extra space while handling edge cases.

## Visual Walkthrough

Let's trace through the example `nums = [1, 2, 2, 1, 1, 0]`:

**Phase 1: Apply operations**

- i=0: nums[0]=1, nums[1]=2 → not equal, no change → `[1, 2, 2, 1, 1, 0]`
- i=1: nums[1]=2, nums[2]=2 → equal → double nums[1] to 4, set nums[2] to 0 → `[1, 4, 0, 1, 1, 0]`
- i=2: nums[2]=0, nums[3]=1 → not equal → `[1, 4, 0, 1, 1, 0]`
- i=3: nums[3]=1, nums[4]=1 → equal → double nums[3] to 2, set nums[4] to 0 → `[1, 4, 0, 2, 0, 0]`
- i=4: nums[4]=0, nums[5]=0 → equal → double nums[4] to 0, set nums[5] to 0 → `[1, 4, 0, 2, 0, 0]`

**Phase 2: Shift non-zeros**
We need to move all non-zero elements to the front while preserving order:

- Read pointer scans for non-zeros: finds 1 at index 0 → write to position 0
- Finds 4 at index 1 → write to position 1
- Finds 0 at index 2 → skip
- Finds 2 at index 3 → write to position 2
- Remaining positions (3, 4, 5) get filled with zeros
- Final result: `[1, 4, 2, 0, 0, 0]`

## Brute Force Approach

A naive approach might use extra arrays: one to store the result of the operations phase, and another to store the shifted result. While this would work, it violates the problem's implicit requirement for in-place modification (though not explicitly stated, interviewers expect it). More importantly, it uses O(n) extra space when O(1) is achievable.

Another brute force mistake would be to separate the operations completely—first apply all operations, then shift zeros. But if you shift zeros immediately after each operation, you might break the pairwise comparisons that need to happen between original adjacent elements. The correct approach must complete all comparisons first, then do the shifting.

## Optimal Solution

The optimal solution uses two passes through the array:

1. **First pass**: Apply the operations exactly as described, comparing each element with its right neighbor
2. **Second pass**: Use a two-pointer technique to shift non-zero elements to the front

The key insight is that these two phases are independent—the operations phase doesn't care about zeros created earlier, and the shifting phase doesn't need to know how zeros were created.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def applyOperations(nums):
    """
    Apply operations to array in two phases:
    1. Compare adjacent elements and apply doubling/zeroing rules
    2. Shift all non-zero elements to the front
    """
    n = len(nums)

    # Phase 1: Apply operations for i = 0 to n-2
    for i in range(n - 1):
        if nums[i] == nums[i + 1]:
            nums[i] *= 2      # Double the current element
            nums[i + 1] = 0   # Set next element to zero

    # Phase 2: Shift non-zero elements to front
    # Use two pointers: write_ptr writes non-zeros, read_ptr scans the array
    write_ptr = 0

    # First pass: copy all non-zero elements to front
    for read_ptr in range(n):
        if nums[read_ptr] != 0:
            nums[write_ptr] = nums[read_ptr]
            write_ptr += 1

    # Second pass: fill remaining positions with zeros
    for i in range(write_ptr, n):
        nums[i] = 0

    return nums
```

```javascript
// Time: O(n) | Space: O(1)
function applyOperations(nums) {
  const n = nums.length;

  // Phase 1: Apply operations for i = 0 to n-2
  for (let i = 0; i < n - 1; i++) {
    if (nums[i] === nums[i + 1]) {
      nums[i] *= 2; // Double the current element
      nums[i + 1] = 0; // Set next element to zero
    }
  }

  // Phase 2: Shift non-zero elements to front
  // writeIndex tracks where to place next non-zero element
  let writeIndex = 0;

  // First pass: copy all non-zero elements to front
  for (let readIndex = 0; readIndex < n; readIndex++) {
    if (nums[readIndex] !== 0) {
      nums[writeIndex] = nums[readIndex];
      writeIndex++;
    }
  }

  // Second pass: fill remaining positions with zeros
  for (let i = writeIndex; i < n; i++) {
    nums[i] = 0;
  }

  return nums;
}
```

```java
// Time: O(n) | Space: O(1)
public int[] applyOperations(int[] nums) {
    int n = nums.length;

    // Phase 1: Apply operations for i = 0 to n-2
    for (int i = 0; i < n - 1; i++) {
        if (nums[i] == nums[i + 1]) {
            nums[i] *= 2;      // Double the current element
            nums[i + 1] = 0;   // Set next element to zero
        }
    }

    // Phase 2: Shift non-zero elements to front
    // writePtr tracks where to place next non-zero element
    int writePtr = 0;

    // First pass: copy all non-zero elements to front
    for (int readPtr = 0; readPtr < n; readPtr++) {
        if (nums[readPtr] != 0) {
            nums[writePtr] = nums[readPtr];
            writePtr++;
        }
    }

    // Second pass: fill remaining positions with zeros
    for (int i = writePtr; i < n; i++) {
        nums[i] = 0;
    }

    return nums;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Phase 1: Single pass through n-1 elements → O(n)
- Phase 2: Two passes through n elements each → O(n) + O(n) = O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We modify the array in-place using only a few integer variables
- No additional data structures proportional to input size
- The shifting operation is done by overwriting positions in the original array

## Common Mistakes

1. **Modifying and shifting in the same pass**: Attempting to shift zeros immediately after creating them can break subsequent comparisons. For example, if you have `[2, 2, 3]` and you double the first 2 to 4, set the second to 0, then immediately shift, you get `[4, 3, 0]`. Now you compare 4 and 3 instead of the original second 2 and 3.

2. **Off-by-one in the operations loop**: The loop should run from `i = 0` to `n-2` (inclusive), not `n-1`. Comparing `nums[n-1]` with `nums[n]` would cause an index out of bounds error.

3. **Incorrect zero handling in shift phase**: Simply swapping non-zeros with zeros doesn't preserve order. The two-pointer approach with a write pointer ensures relative order is maintained.

4. **Forgetting to handle the "remaining zeros"**: After shifting non-zeros to the front, you must explicitly set the remaining positions to zero. Some candidates stop after the first pass of the shift phase, leaving the original values in the tail positions.

## When You'll See This Pattern

This problem combines two fundamental array manipulation patterns:

1. **Pairwise comparison with modification**: Similar to problems where you compare adjacent elements and perform some transformation, like removing duplicates or merging intervals. The key is to process elements in relation to their neighbors without affecting unprocessed elements.

2. **In-place rearrangement with two pointers**: The shift-zeroes pattern appears in many problems:
   - **Move Zeroes (Easy)**: Exactly the same zero-shifting logic
   - **Remove Duplicates from Sorted Array (Easy)**: Similar two-pointer approach to shift unique elements forward
   - **Remove Element (Easy)**: Shift all elements not equal to a target value to the front

These problems all share the core technique of using a "write pointer" to track where valid elements should go, and a "read pointer" to scan through the array.

## Key Takeaways

1. **Separate concerns in multi-step transformations**: When a problem requires multiple operations on an array, complete each independent phase fully before moving to the next. This keeps logic clean and prevents interference between operations.

2. **Two-pointer technique for in-place rearrangement**: When you need to shift elements based on a condition while preserving order, use a write pointer to track the next position for valid elements and a read pointer to scan through the array.

3. **Boundary awareness in pairwise operations**: Always check loop bounds when comparing `nums[i]` with `nums[i+1]`. The last valid index to check is `n-2`, not `n-1`.

Related problems: [Remove Duplicates from Sorted Array](/problem/remove-duplicates-from-sorted-array), [Move Zeroes](/problem/move-zeroes)
