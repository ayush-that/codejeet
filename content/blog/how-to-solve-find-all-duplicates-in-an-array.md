---
title: "How to Solve Find All Duplicates in an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find All Duplicates in an Array. Medium difficulty, 76.8% acceptance rate. Topics: Array, Hash Table, Sorting."
date: "2026-10-16"
category: "dsa-patterns"
tags: ["find-all-duplicates-in-an-array", "array", "hash-table", "sorting", "medium"]
---

# How to Solve Find All Duplicates in an Array

You're given an array of integers where every number is between 1 and `n` (the array length), and each number appears at most twice. Your task is to find all numbers that appear exactly twice. The challenge is doing this in O(n) time with only constant extra space — you can't use a hash table to count frequencies directly.

What makes this problem interesting is the constraint: numbers are in `[1, n]` and the array has length `n`. This structure gives us a clever way to use the array itself as a data structure, marking visited numbers without extra space.

## Visual Walkthrough

Let's trace through an example: `nums = [4, 3, 2, 7, 8, 2, 3, 1]` (n = 8)

**Key insight:** Since all numbers are between 1 and n, each number can map to a specific index (number-1). We can use this to mark when we've seen a number before.

Step-by-step process:

1. Start with index 0: value = 4 → go to index 3 (4-1)
   - Mark index 3 by making nums[3] negative: nums[3] = -7
   - Array becomes: [4, 3, 2, -7, 8, 2, 3, 1]

2. Index 1: value = 3 → go to index 2 (3-1)
   - Mark index 2: nums[2] = -2
   - Array: [4, 3, -2, -7, 8, 2, 3, 1]

3. Index 2: value = -2 (absolute value = 2) → go to index 1 (2-1)
   - Mark index 1: nums[1] = -3
   - Array: [4, -3, -2, -7, 8, 2, 3, 1]

4. Index 3: value = -7 (absolute value = 7) → go to index 6 (7-1)
   - Mark index 6: nums[6] = -3
   - Array: [4, -3, -2, -7, 8, 2, -3, 1]

5. Index 4: value = 8 → go to index 7 (8-1)
   - Mark index 7: nums[7] = -1
   - Array: [4, -3, -2, -7, 8, 2, -3, -1]

6. Index 5: value = 2 → go to index 1 (2-1)
   - nums[1] is already negative! This means we've seen 2 before
   - Add 2 to our result list
   - Array unchanged: [4, -3, -2, -7, 8, 2, -3, -1]

7. Index 6: value = -3 (absolute value = 3) → go to index 2 (3-1)
   - nums[2] is already negative! This means we've seen 3 before
   - Add 3 to our result list
   - Array unchanged: [4, -3, -2, -7, 8, 2, -3, -1]

8. Index 7: value = -1 (absolute value = 1) → go to index 0 (1-1)
   - Mark index 0: nums[0] = -4
   - Array: [-4, -3, -2, -7, 8, 2, -3, -1]

Final result: [2, 3]

## Brute Force Approach

The most straightforward solution would be to count frequencies using a hash table:

1. Create a frequency counter (dictionary/hash map)
2. Iterate through the array, counting each number
3. Return all numbers with count = 2

This approach is O(n) time and O(n) space, which violates the constant space requirement. A naive candidate might also try sorting first (O(n log n) time, O(1) space if in-place), but that's slower than required.

The brute force fails because:

- Hash table solution uses O(n) extra space
- Sorting solution is O(n log n) time
- Neither meets both constraints (O(n) time, O(1) space)

## Optimized Approach

The key insight comes from the constraints: numbers are in `[1, n]` and array length is `n`. This means:

1. Every value can map to a valid index (value - 1)
2. We can use the array itself as a marker system

**Core technique:** For each number, use it as an index to mark that position as "seen" by making the value at that index negative. If we ever try to mark a position that's already negative, we've found a duplicate.

Why this works:

- When we see a number `x`, we look at position `x-1`
- If the value at `x-1` is positive, we haven't seen `x` before → mark it negative
- If the value at `x-1` is already negative, we've seen `x` before → it's a duplicate
- We use absolute values because we might encounter negative values (already marked positions)

This is essentially using the array as a bitset where the sign bit indicates "seen/not seen."

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output array
def findDuplicates(nums):
    """
    Find all numbers that appear exactly twice in the array.
    Uses the array itself as a marker system by making values negative.
    """
    result = []

    # Iterate through each number in the array
    for i in range(len(nums)):
        # Get the absolute value (since we might have marked it negative)
        num = abs(nums[i])

        # Map the number to an index (1-based to 0-based)
        index = num - 1

        # Check if we've seen this number before
        if nums[index] < 0:
            # If the value at the mapped index is already negative,
            # we've seen this number before → it's a duplicate
            result.append(num)
        else:
            # Mark this number as seen by making the value at the
            # mapped index negative
            nums[index] = -nums[index]

    # Optional: Restore the original array values (not required for solution)
    # for i in range(len(nums)):
    #     nums[i] = abs(nums[i])

    return result
```

```javascript
// Time: O(n) | Space: O(1) excluding output array
function findDuplicates(nums) {
  /**
   * Find all numbers that appear exactly twice in the array.
   * Uses the array itself as a marker system by making values negative.
   */
  const result = [];

  // Iterate through each number in the array
  for (let i = 0; i < nums.length; i++) {
    // Get the absolute value (since we might have marked it negative)
    const num = Math.abs(nums[i]);

    // Map the number to an index (1-based to 0-based)
    const index = num - 1;

    // Check if we've seen this number before
    if (nums[index] < 0) {
      // If the value at the mapped index is already negative,
      // we've seen this number before → it's a duplicate
      result.push(num);
    } else {
      // Mark this number as seen by making the value at the
      // mapped index negative
      nums[index] = -nums[index];
    }
  }

  // Optional: Restore the original array values (not required for solution)
  // for (let i = 0; i < nums.length; i++) {
  //     nums[i] = Math.abs(nums[i]);
  // }

  return result;
}
```

```java
// Time: O(n) | Space: O(1) excluding output array
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> findDuplicates(int[] nums) {
        /**
         * Find all numbers that appear exactly twice in the array.
         * Uses the array itself as a marker system by making values negative.
         */
        List<Integer> result = new ArrayList<>();

        // Iterate through each number in the array
        for (int i = 0; i < nums.length; i++) {
            // Get the absolute value (since we might have marked it negative)
            int num = Math.abs(nums[i]);

            // Map the number to an index (1-based to 0-based)
            int index = num - 1;

            // Check if we've seen this number before
            if (nums[index] < 0) {
                // If the value at the mapped index is already negative,
                // we've seen this number before → it's a duplicate
                result.add(num);
            } else {
                // Mark this number as seen by making the value at the
                // mapped index negative
                nums[index] = -nums[index];
            }
        }

        // Optional: Restore the original array values (not required for solution)
        // for (int i = 0; i < nums.length; i++) {
        //     nums[i] = Math.abs(nums[i]);
        // }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the array once: O(n)
- Each iteration does constant work: absolute value, index calculation, comparison, and possibly negation
- No nested loops or recursive calls

**Space Complexity:** O(1) extra space (excluding the output array)

- We only use a few integer variables (i, num, index)
- The output array doesn't count toward space complexity in most interview settings
- We modify the input array in-place instead of using additional data structures
- If we need to preserve the original array, we could restore it with another O(n) pass (still O(1) extra space)

## Common Mistakes

1. **Forgetting to use absolute value:** When we encounter a negative number (already marked), we need to use its absolute value to calculate the correct index. Without `abs()`, we'd get negative indices or incorrect mappings.

2. **Off-by-one errors with index mapping:** Remember that number `x` maps to index `x-1`, not `x`. This is because arrays are 0-indexed but our numbers start at 1.

3. **Modifying the array while iterating:** We must be careful not to use the modified (negative) value when calculating indices. Always use `abs(nums[i])` to get the original value before any modifications.

4. **Not handling the "at most twice" constraint:** The problem guarantees each number appears at most twice, so we don't need to worry about counting beyond two. If a number could appear more than twice, we'd need additional logic to avoid adding duplicates to the result multiple times.

## When You'll See This Pattern

This "array as hash table" or "index marking" pattern appears in several LeetCode problems with similar constraints:

1. **Find All Numbers Disappeared in an Array (Easy)** - Uses the exact same technique: mark indices as negative to track which numbers (1..n) are present. Instead of finding duplicates, you find missing numbers by looking for positive values at the end.

2. **First Missing Positive (Hard)** - A more complex version where you need to place each number at its correct index through swapping. The core idea is similar: use the array indices to represent which numbers are present.

3. **Set Mismatch (Easy)** - Find the duplicate and missing number in an array of 1..n. Can be solved with similar index marking or mathematical approaches.

The pattern to recognize: when you have an array of length n with values in [1, n] or [0, n-1], consider whether you can use the array indices themselves to store information about which values have been seen.

## Key Takeaways

1. **When values map to valid indices, use the array as a data structure.** If numbers are in [1, n] and array length is n, you can often use the sign bit or swap elements to mark visited numbers without extra space.

2. **The sign marking trick is reversible.** By making values negative, we preserve their original magnitude (via absolute value) while adding a "visited" flag. This is cleaner than using special values like `n+1` which could overflow.

3. **Always check constraints carefully.** The "numbers in [1, n]" and "each appears at most twice" constraints are what make this O(1) space solution possible. Without these, you'd need a hash table.

Related problems: [Find All Numbers Disappeared in an Array](/problem/find-all-numbers-disappeared-in-an-array), [Sum of Distances](/problem/sum-of-distances), [The Two Sneaky Numbers of Digitville](/problem/the-two-sneaky-numbers-of-digitville)
