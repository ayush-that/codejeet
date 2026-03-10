---
title: "How to Solve Can Make Arithmetic Progression From Sequence — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Can Make Arithmetic Progression From Sequence. Easy difficulty, 69.1% acceptance rate. Topics: Array, Sorting."
date: "2027-11-13"
category: "dsa-patterns"
tags: ["can-make-arithmetic-progression-from-sequence", "array", "sorting", "easy"]
---

# How to Solve "Can Make Arithmetic Progression From Sequence"

An arithmetic progression is a sequence where the difference between consecutive terms is constant. Given an array of numbers, we need to determine if the elements can be rearranged to form such a progression. While this is labeled as an easy problem, it tests your understanding of sequence properties and your ability to recognize that sorting is the key to efficiently checking arithmetic progression conditions.

## Visual Walkthrough

Let's walk through an example: `arr = [3, 5, 1]`

**Step 1: Sort the array**

- Original: `[3, 5, 1]`
- Sorted: `[1, 3, 5]`

**Step 2: Calculate the expected difference**

- For an arithmetic progression, the difference between consecutive terms should be constant
- With sorted array `[1, 3, 5]`, we can calculate the difference between the first two elements: `3 - 1 = 2`

**Step 3: Verify all consecutive differences match**

- Check `arr[1] - arr[0] = 3 - 1 = 2` ✓
- Check `arr[2] - arr[1] = 5 - 3 = 2` ✓

**Step 4: Conclusion**
All differences equal 2, so `[1, 3, 5]` is an arithmetic progression. Since we can rearrange the original array to get this sorted order, the answer is `true`.

Let's try a counterexample: `arr = [1, 2, 4]`

**Step 1: Sort the array**

- Original: `[1, 2, 4]`
- Sorted: `[1, 2, 4]` (already sorted)

**Step 2: Calculate the expected difference**

- Difference between first two elements: `2 - 1 = 1`

**Step 3: Verify all consecutive differences match**

- Check `arr[1] - arr[0] = 2 - 1 = 1` ✓
- Check `arr[2] - arr[1] = 4 - 2 = 2` ✗ (2 ≠ 1)

**Step 4: Conclusion**
The differences are not constant, so no rearrangement can form an arithmetic progression. The answer is `false`.

## Brute Force Approach

A brute force approach would generate all possible permutations of the array and check if any permutation forms an arithmetic progression. For each permutation, we would:

1. Calculate the difference between the first two elements
2. Verify that all subsequent consecutive differences match this value

However, this approach has a factorial time complexity of O(n!) due to generating all permutations, where n is the length of the array. Even for moderately sized arrays (n > 10), this becomes computationally infeasible. The space complexity would also be O(n!) to store all permutations.

The key insight is that if an arithmetic progression exists, the sorted version of the array must be that progression. This is because in an arithmetic progression, the terms are evenly spaced, so sorting them will naturally arrange them in increasing order with constant differences.

## Optimal Solution

The optimal solution leverages sorting to efficiently check for arithmetic progression:

1. Sort the array in ascending order
2. Calculate the expected difference from the first two elements
3. Verify this difference holds for all consecutive pairs

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) if sorting in-place, O(n) if not
def canMakeArithmeticProgression(arr):
    """
    Determines if an array can be rearranged to form an arithmetic progression.

    Args:
        arr: List of integers to check

    Returns:
        True if array can form arithmetic progression, False otherwise
    """
    # Step 1: Sort the array in ascending order
    # This allows us to check consecutive differences easily
    arr.sort()

    # Step 2: Calculate the expected difference
    # In an arithmetic progression, difference between any two consecutive
    # elements should be constant. We use the first two elements as reference.
    diff = arr[1] - arr[0]

    # Step 3: Check if all consecutive differences match the expected difference
    # We start from index 2 since we already checked indices 0 and 1
    for i in range(2, len(arr)):
        # If any pair doesn't have the expected difference, it's not an AP
        if arr[i] - arr[i - 1] != diff:
            return False

    # Step 4: All differences match, so it can form an arithmetic progression
    return True
```

```javascript
// Time: O(n log n) | Space: O(1) if sorting in-place, O(n) if not
/**
 * Determines if an array can be rearranged to form an arithmetic progression.
 *
 * @param {number[]} arr - Array of numbers to check
 * @return {boolean} True if array can form arithmetic progression, False otherwise
 */
function canMakeArithmeticProgression(arr) {
  // Step 1: Sort the array in ascending order
  // The sort function needs a comparator for numerical sorting
  arr.sort((a, b) => a - b);

  // Step 2: Calculate the expected difference
  // Use the first two elements as the reference difference
  const diff = arr[1] - arr[0];

  // Step 3: Check if all consecutive differences match
  // Start from index 2 since we already checked indices 0 and 1
  for (let i = 2; i < arr.length; i++) {
    // If any consecutive pair doesn't match the expected difference,
    // it cannot form an arithmetic progression
    if (arr[i] - arr[i - 1] !== diff) {
      return false;
    }
  }

  // Step 4: All differences are consistent
  return true;
}
```

```java
// Time: O(n log n) | Space: O(1) if sorting in-place, O(n) if not
import java.util.Arrays;

class Solution {
    /**
     * Determines if an array can be rearranged to form an arithmetic progression.
     *
     * @param arr Array of integers to check
     * @return True if array can form arithmetic progression, False otherwise
     */
    public boolean canMakeArithmeticProgression(int[] arr) {
        // Step 1: Sort the array in ascending order
        // Arrays.sort() uses Dual-Pivot Quicksort for primitives
        Arrays.sort(arr);

        // Step 2: Calculate the expected difference
        // The difference between first two elements defines the progression
        int diff = arr[1] - arr[0];

        // Step 3: Verify all consecutive differences match
        // Iterate from the third element to the end
        for (int i = 2; i < arr.length; i++) {
            // If any pair doesn't maintain the constant difference,
            // return false immediately
            if (arr[i] - arr[i - 1] != diff) {
                return false;
            }
        }

        // Step 4: All checks passed
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- The dominant operation is sorting the array, which takes O(n log n) time for comparison-based sorts
- The subsequent linear scan through the array takes O(n) time
- Since O(n log n) dominates O(n), the overall time complexity is O(n log n)

**Space Complexity: O(1) or O(n)**

- If the sorting algorithm is in-place (like heapsort or some quicksort implementations), the space complexity is O(1)
- If the sorting algorithm requires additional space (like mergesort), the space complexity is O(n)
- The additional variables (like `diff` and loop counter) use O(1) space

## Common Mistakes

1. **Not handling small arrays properly**: For arrays with fewer than 2 elements, any sequence trivially forms an arithmetic progression. While the problem constraints typically guarantee at least 2 elements, it's good practice to handle edge cases explicitly.

2. **Forgetting to sort the array**: Some candidates try to calculate differences without sorting first. This fails because the original order might not be the arithmetic progression order, even if one exists.

3. **Incorrect difference calculation**: Using the wrong indices to calculate the reference difference. The difference should be `arr[1] - arr[0]` after sorting, not from arbitrary elements.

4. **Integer overflow in difference calculation**: While not a concern for typical constraints, with very large integers, the difference calculation could overflow. In such cases, using a larger data type (like `long` in Java) would be necessary.

5. **Assuming the array is already sorted**: The problem states the array can be rearranged, so we must consider all possible orderings, not just the given order.

## When You'll See This Pattern

The pattern of "sort first, then check properties" appears in many array problems:

1. **Arithmetic Subarrays (LeetCode 1630)**: This is a direct extension where you need to check multiple subarrays for arithmetic progression properties. The same sorting approach works for each subarray.

2. **Minimum Moves to Equal Array Elements II (LeetCode 462)**: Finding the median after sorting helps minimize the total moves needed to make all elements equal.

3. **Array Partition I (LeetCode 561)**: Sorting allows you to pair elements optimally to maximize the sum of minimums in each pair.

4. **Non-overlapping Intervals (LeetCode 435)**: Sorting intervals by end time helps find the maximum number of non-overlapping intervals.

The core insight is that sorting often reveals structure or optimal ordering that isn't apparent in the original arrangement.

## Key Takeaways

1. **Sorting reveals hidden structure**: When a problem involves checking relationships between elements (like constant differences), sorting often transforms the problem into a simpler one where patterns become obvious.

2. **Arithmetic progressions have a natural sorted form**: If an arithmetic progression exists, its terms will be evenly spaced when sorted in ascending order. This means checking the sorted array is sufficient.

3. **Think about what properties must hold in the optimal arrangement**: Instead of checking all possible arrangements (which is exponential), identify what properties the solution must have and test for those properties directly.

Related problems: [Arithmetic Subarrays](/problem/arithmetic-subarrays)
