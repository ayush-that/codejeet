---
title: "How to Solve Maximum Difference Between Adjacent Elements in a Circular Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Difference Between Adjacent Elements in a Circular Array. Easy difficulty, 75.7% acceptance rate. Topics: Array."
date: "2026-06-16"
category: "dsa-patterns"
tags: ["maximum-difference-between-adjacent-elements-in-a-circular-array", "array", "easy"]
---

# How to Solve Maximum Difference Between Adjacent Elements in a Circular Array

This problem asks us to find the maximum absolute difference between adjacent elements in a circular array, where the first and last elements are considered adjacent. The circular nature makes this interesting because we need to check one extra pair that doesn't exist in a regular linear array.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the array `[4, 2, 1, 8]`:

In a **linear array**, we would check these adjacent pairs:

- |4 - 2| = 2
- |2 - 1| = 1
- |1 - 8| = 7

Maximum difference in linear view: 7

But this is a **circular array**, so we also need to check the wrap-around pair between the last and first elements:

- |8 - 4| = 4

Now we have all adjacent pairs in the circular arrangement:

- |4 - 2| = 2
- |2 - 1| = 1
- |1 - 8| = 7
- |8 - 4| = 4

The maximum absolute difference is 7.

The key insight: In a circular array, we need to check **n** adjacent pairs instead of **n-1**, where n is the array length. The extra pair connects the last element back to the first.

## Brute Force Approach

A naive approach would be to manually check every possible adjacent pair, including the wrap-around. We could:

1. Initialize a variable to track the maximum difference
2. Loop through indices 0 to n-1
3. For each index i, calculate the difference with the next element (i+1), using modulo to handle the wrap-around
4. Update the maximum if the current difference is larger

While this approach works, it's worth noting that for this particular problem, there's no more efficient solution than checking all adjacent pairs. The "brute force" here is actually optimal because we must examine every adjacent relationship to guarantee we find the maximum difference.

However, a truly naive candidate might forget about the circular nature entirely and only check n-1 pairs, missing the critical wrap-around pair between the last and first elements.

## Optimal Solution

The optimal solution is straightforward: iterate through all elements, calculate the absolute difference between each element and its next neighbor (using modulo for the circular wrap-around), and track the maximum.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def max_adjacent_difference(nums):
    """
    Find the maximum absolute difference between adjacent elements in a circular array.

    Args:
        nums: List of integers representing the circular array

    Returns:
        Maximum absolute difference between adjacent elements
    """
    n = len(nums)

    # Edge case: if array has less than 2 elements, no adjacent pairs exist
    if n < 2:
        return 0

    max_diff = 0

    # Iterate through all elements in the array
    for i in range(n):
        # Calculate the index of the next element in the circular array
        # Using modulo ensures we wrap around to index 0 when i = n-1
        next_index = (i + 1) % n

        # Calculate absolute difference between current and next element
        current_diff = abs(nums[i] - nums[next_index])

        # Update maximum difference if current difference is larger
        if current_diff > max_diff:
            max_diff = current_diff

    return max_diff
```

```javascript
// Time: O(n) | Space: O(1)
function maxAdjacentDifference(nums) {
  /**
   * Find the maximum absolute difference between adjacent elements in a circular array.
   *
   * @param {number[]} nums - Array of integers representing the circular array
   * @return {number} Maximum absolute difference between adjacent elements
   */
  const n = nums.length;

  // Edge case: if array has less than 2 elements, no adjacent pairs exist
  if (n < 2) {
    return 0;
  }

  let maxDiff = 0;

  // Iterate through all elements in the array
  for (let i = 0; i < n; i++) {
    // Calculate the index of the next element in the circular array
    // Using modulo ensures we wrap around to index 0 when i = n-1
    const nextIndex = (i + 1) % n;

    // Calculate absolute difference between current and next element
    const currentDiff = Math.abs(nums[i] - nums[nextIndex]);

    // Update maximum difference if current difference is larger
    if (currentDiff > maxDiff) {
      maxDiff = currentDiff;
    }
  }

  return maxDiff;
}
```

```java
// Time: O(n) | Space: O(1)
public class Solution {
    public int maxAdjacentDifference(int[] nums) {
        /**
         * Find the maximum absolute difference between adjacent elements in a circular array.
         *
         * @param nums Array of integers representing the circular array
         * @return Maximum absolute difference between adjacent elements
         */
        int n = nums.length;

        // Edge case: if array has less than 2 elements, no adjacent pairs exist
        if (n < 2) {
            return 0;
        }

        int maxDiff = 0;

        // Iterate through all elements in the array
        for (int i = 0; i < n; i++) {
            // Calculate the index of the next element in the circular array
            // Using modulo ensures we wrap around to index 0 when i = n-1
            int nextIndex = (i + 1) % n;

            // Calculate absolute difference between current and next element
            int currentDiff = Math.abs(nums[i] - nums[nextIndex]);

            // Update maximum difference if current difference is larger
            if (currentDiff > maxDiff) {
                maxDiff = currentDiff;
            }
        }

        return maxDiff;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing constant-time operations for each element
- The loop runs n times, where n is the length of the input array
- Each iteration involves: modulo operation, array access, subtraction, absolute value, and comparison

**Space Complexity: O(1)**

- We use only a constant amount of extra space regardless of input size
- Variables: n, max_diff, i, next_index, current_diff (all fixed size)
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting the circular nature**: The most common mistake is treating the array as linear and only checking n-1 pairs, missing the critical wrap-around pair between the last and first elements. Always remember: "circular" means the end connects back to the beginning.

2. **Incorrect modulo handling**: Using `(i + 1) % n` correctly handles the wrap-around, but some candidates might use `(i + 1) % (n-1)` or other incorrect variations. Test your modulo logic with the last element: when i = n-1, next_index should be 0.

3. **Not handling edge cases**:
   - Empty array: Should return 0 (no adjacent pairs)
   - Single-element array: Should return 0 (no adjacent pairs)
   - Two-element array: Should return the absolute difference between them (only one pair in circular arrangement)

4. **Integer overflow**: While less common in this problem, in languages with fixed integer sizes, calculating the absolute difference between very large numbers could overflow. Using built-in absolute value functions usually handles this, but it's worth considering in interview discussions.

## When You'll See This Pattern

The circular array pattern appears in several LeetCode problems where you need to consider wrap-around behavior:

1. **LeetCode 213: House Robber II** - Houses are arranged in a circle, so the first and last houses are adjacent. You need to adapt the dynamic programming solution to handle the circular constraint.

2. **LeetCode 503: Next Greater Element II** - A circular array version of Next Greater Element I, where you need to find the next greater element for each element, considering elements after wrapping around.

3. **LeetCode 189: Rotate Array** - While not exactly the same pattern, it involves circular shifting of array elements and requires similar modulo arithmetic for index manipulation.

The core technique of using modulo arithmetic (`(i + 1) % n`) to handle circular traversal is reusable across these problems. Whenever you see "circular array" in a problem description, immediately think about how you'll handle the wrap-around from the last element back to the first.

## Key Takeaways

1. **Circular arrays require checking n pairs, not n-1**: The defining characteristic of circular array problems is that you need to consider the connection between the last and first elements. This often means your loop needs to run n times instead of n-1 times.

2. **Modulo arithmetic is your friend**: The expression `(i + 1) % n` elegantly handles the wrap-around by resetting to 0 when we reach the end of the array. This pattern appears frequently in circular array problems.

3. **Edge cases matter**: Always consider empty arrays, single-element arrays, and two-element arrays. These boundary cases often reveal flaws in your logic and are frequently tested in interviews.

[Practice this problem on CodeJeet](/problem/maximum-difference-between-adjacent-elements-in-a-circular-array)
