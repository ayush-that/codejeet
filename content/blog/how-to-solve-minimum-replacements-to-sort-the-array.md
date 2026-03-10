---
title: "How to Solve Minimum Replacements to Sort the Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Replacements to Sort the Array. Hard difficulty, 53.2% acceptance rate. Topics: Array, Math, Greedy."
date: "2027-12-26"
category: "dsa-patterns"
tags: ["minimum-replacements-to-sort-the-array", "array", "math", "greedy", "hard"]
---

# How to Solve Minimum Replacements to Sort the Array

You're given an array where you can split any element into two numbers that sum to it. Your goal is to find the **minimum number of splits** needed to make the array non-decreasing. The tricky part is that splits create new elements, which can affect earlier positions, and you must work backwards to make optimal decisions.

## Visual Walkthrough

Let's trace through `nums = [3, 9, 3]`:

1. Start from the end: `nums[2] = 3` is fine.
2. Move to `nums[1] = 9`. We need `9 ≤ 3` to be non-decreasing, but `9 > 3`. We must split 9 into smaller pieces.
3. Question: How many pieces? We want as few splits as possible while ensuring all pieces ≤ 3.
   - If we split into 3 pieces: 3, 3, 3 (all ≤ 3) → 2 splits
   - If we split into 4 pieces: 2.25, 2.25, 2.25, 2.25 → 3 splits (more than needed)
   - Minimum pieces = ceil(9 / 3) = 3 pieces → 2 splits
4. But wait — the largest piece becomes the new "limit" for the previous element! When we split 9 into 3 pieces, the pieces are as equal as possible: floor(9 / 3) = 3, but 9 ÷ 3 = 3 exactly, so all pieces are 3.
5. Now move to `nums[0] = 3`. We need `3 ≤ 3` (the largest piece from splitting 9), which is true. No split needed.
6. Total operations = 2.

Key insight: Work **backwards** because the limit for each element comes from the element after it (after any splits).

## Brute Force Approach

A naive approach might try forward simulation: whenever `nums[i] > nums[i+1]`, split `nums[i]` into two pieces. But which two pieces? If you split 9 into (1, 8), you still have 8 > 3, requiring more splits. You could try all possible splits at each position — but that's exponential.

Even a greedy forward approach fails. Consider `[5, 4, 3]`:

- Forward: Split 5 into (2, 3) → [2, 3, 4, 3] still not sorted
- Split 4 into (1, 3) → [2, 3, 1, 3, 3] still not sorted
- This approach doesn't guarantee minimal operations.

The brute force would explore all split combinations at each position — O(k^n) where k is the number of possible splits per element.

## Optimized Approach

The key insight is **backwards greedy processing**:

1. Start from the last element (no constraint after it).
2. For each element `nums[i]` moving left:
   - Let `limit` be the maximum allowed value for `nums[i]` (initially the value after it).
   - If `nums[i] ≤ limit`, no split needed. Update `limit = nums[i]` for next iteration.
   - If `nums[i] > limit`, we must split `nums[i]` into `k` pieces where all pieces ≤ limit.
     - Minimum `k = ceil(nums[i] / limit)`
     - Number of splits = `k - 1`
     - To minimize the maximum piece (which becomes the new limit for previous element), split as evenly as possible:
       - Each piece = `nums[i] // k` or `nums[i] // k + 1`
       - The new limit = `nums[i] // k` (the smallest piece size)
3. Accumulate total splits.

Why backwards? Because when you split an element, the largest resulting piece becomes the constraint for the element to its left. Working backwards lets us determine the exact constraint needed.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimumReplacement(nums):
    """
    Calculate minimum splits to make array non-decreasing.

    Args:
        nums: List[int] - input array

    Returns:
        int - minimum number of replacement operations
    """
    n = len(nums)
    operations = 0
    # Start with last element as initial limit
    limit = nums[-1]

    # Process from second-last to first element
    for i in range(n - 2, -1, -1):
        if nums[i] > limit:
            # Calculate minimum pieces needed
            # Each piece must be <= limit
            pieces = (nums[i] + limit - 1) // limit  # ceil(nums[i] / limit)
            operations += pieces - 1  # splits = pieces - 1

            # Update limit for previous element
            # When splitting evenly, smallest piece = nums[i] // pieces
            limit = nums[i] // pieces
        else:
            # No split needed, update limit to current value
            limit = nums[i]

    return operations
```

```javascript
// Time: O(n) | Space: O(1)
function minimumReplacement(nums) {
  /**
   * Calculate minimum splits to make array non-decreasing.
   *
   * @param {number[]} nums - input array
   * @return {number} - minimum number of replacement operations
   */
  const n = nums.length;
  let operations = 0;
  // Start with last element as initial limit
  let limit = nums[n - 1];

  // Process from second-last to first element
  for (let i = n - 2; i >= 0; i--) {
    if (nums[i] > limit) {
      // Calculate minimum pieces needed (ceil division)
      const pieces = Math.ceil(nums[i] / limit);
      operations += pieces - 1; // splits = pieces - 1

      // Update limit for previous element
      // Smallest piece when splitting evenly
      limit = Math.floor(nums[i] / pieces);
    } else {
      // No split needed, update limit to current value
      limit = nums[i];
    }
  }

  return operations;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public long minimumReplacement(int[] nums) {
        /**
         * Calculate minimum splits to make array non-decreasing.
         *
         * @param nums - input array
         * @return minimum number of replacement operations
         */
        int n = nums.length;
        long operations = 0;  // Use long to avoid overflow
        // Start with last element as initial limit
        int limit = nums[n - 1];

        // Process from second-last to first element
        for (int i = n - 2; i >= 0; i--) {
            if (nums[i] > limit) {
                // Calculate minimum pieces needed (ceil division)
                int pieces = (nums[i] + limit - 1) / limit;
                operations += pieces - 1;  // splits = pieces - 1

                // Update limit for previous element
                // Smallest piece when splitting evenly
                limit = nums[i] / pieces;
            } else {
                // No split needed, update limit to current value
                limit = nums[i];
            }
        }

        return operations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once from right to left.
- Each iteration performs O(1) operations (arithmetic calculations).

**Space Complexity: O(1)**

- We use only a constant amount of extra space (variables for `operations`, `limit`, and loop index).
- The input array is not modified.

## Common Mistakes

1. **Working forwards instead of backwards**: Candidates try to fix the array from left to right, but this doesn't account for how splits affect previous elements. Always verify directionality in array constraints.

2. **Incorrect piece calculation**: Using `pieces = nums[i] / limit` without ceiling operation gives wrong results when division isn't exact. Remember: `ceil(a/b) = (a + b - 1) // b` in integer arithmetic.

3. **Forgetting to update limit after split**: After splitting, the new limit should be the smallest piece (`nums[i] // pieces`), not the original limit or the largest piece. This ensures the previous element has the correct constraint.

4. **Integer overflow**: With large arrays and values, the operations count can exceed 32-bit integer range. Use 64-bit integers (long in Java, no issue in Python).

## When You'll See This Pattern

This **backwards greedy with constraints** pattern appears when:

1. Decisions affect previous elements (like here, where splits create new constraints for left neighbors)
2. You need to minimize operations while satisfying ordering constraints

Related problems:

- **Minimum Operations to Make Array Increasing** (Easy): Similar constraint satisfaction but simpler forward pass.
- **Minimum Number of Increments on Subarrays to Form a Target Array** (Hard): Another backwards processing problem where you determine operations based on differences between adjacent elements.
- **Minimum Number of Operations to Make Array Continuous** (Hard): Involves sorting and finding optimal windows, though with different constraints.

## Key Takeaways

1. **When constraints flow backwards, process backwards**: If each element's requirement depends on what comes after it, start from the end and work toward the beginning.

2. **Even splitting minimizes maximum piece**: When dividing a number into k parts with sum constraints, making parts as equal as possible minimizes the largest piece, which is often what you need for previous constraints.

3. **Ceil division trick**: `ceil(a/b) = (a + b - 1) // b` is essential for integer arithmetic without floating-point errors.

Related problems: [Minimum Operations to Make the Array Increasing](/problem/minimum-operations-to-make-the-array-increasing)
