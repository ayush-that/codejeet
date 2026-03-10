---
title: "How to Solve Array Partition — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Array Partition. Easy difficulty, 81.5% acceptance rate. Topics: Array, Greedy, Sorting, Counting Sort."
date: "2027-02-07"
category: "dsa-patterns"
tags: ["array-partition", "array", "greedy", "sorting", "easy"]
---

# How to Solve Array Partition

You're given an array of `2n` integers. Your task is to pair them up into `n` pairs, then sum up the minimum value from each pair. The goal is to maximize that sum. What makes this problem interesting is that it looks like a complex optimization problem at first glance, but has a surprisingly elegant solution once you understand the underlying pattern.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have `nums = [1, 4, 3, 2]` (here `n = 2` since we have 4 elements).

**Step 1: Understanding the pairing constraint**
We need to create 2 pairs from these 4 numbers. Let's try some possibilities:

- Pair (1,4) and (3,2): Sum of min values = min(1,4) + min(3,2) = 1 + 2 = 3
- Pair (1,3) and (4,2): Sum = min(1,3) + min(4,2) = 1 + 2 = 3
- Pair (1,2) and (4,3): Sum = min(1,2) + min(4,3) = 1 + 3 = 4

The last pairing gives us the maximum sum of 4.

**Step 2: Looking for a pattern**
Notice what happened: In the optimal pairing (1,2) and (4,3), we paired the smallest number (1) with the second smallest (2), and the third smallest (3) with the fourth smallest (4). This suggests a pattern: **sort the array and pair consecutive elements**.

**Step 3: Why this works**
When we sort the array: [1, 2, 3, 4]

- If we pair (1,2): we get 1 as the minimum
- If we pair (3,4): we get 3 as the minimum
  Total = 1 + 3 = 4

The intuition: To maximize the sum of minimums, we want to avoid "wasting" large numbers by pairing them with even larger numbers (which would make the large number disappear as the minimum). By pairing the smallest with the second smallest, we preserve the second smallest for the sum. The third smallest gets paired with the fourth smallest, preserving the third smallest, and so on.

## Brute Force Approach

A brute force approach would try all possible pairings. For an array of size `2n`, we could:

1. Generate all permutations of the array
2. For each permutation, create pairs from consecutive elements
3. Calculate the sum of minimums for each pairing
4. Track the maximum sum found

However, this approach is extremely inefficient. The number of ways to partition `2n` elements into `n` unordered pairs is given by the double factorial: `(2n-1)!! = (2n-1) × (2n-3) × ... × 3 × 1`. For `n = 10` (20 elements), this is already over 6.5 million possibilities. The time complexity would be roughly O((2n)!), which is completely impractical.

Even if we tried to be smarter about it (like trying all combinations of pairs), we'd still face exponential complexity. This brute force approach helps us understand why we need a more clever solution.

## Optimal Solution

The key insight is that sorting the array and pairing consecutive elements gives us the optimal solution. After sorting, we take every other element starting from index 0 (the 1st, 3rd, 5th, etc. smallest numbers) and sum them up.

Why does this work mathematically?

- After sorting: `a₁ ≤ a₂ ≤ a₃ ≤ ... ≤ a₂ₙ`
- If we pair `(a₁, a₂)`, `(a₃, a₄)`, ..., `(a₂ₙ₋₁, a₂ₙ)`
- The sum becomes: `a₁ + a₃ + a₅ + ... + a₂ₙ₋₁`
- Any other pairing would give us at least one pair where the gap between elements is larger, resulting in a smaller minimum for that pair

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def arrayPairSum(nums):
    """
    Maximizes the sum of minimums from pairs by sorting and summing every other element.

    Args:
        nums: List of integers with length 2n

    Returns:
        Maximum possible sum of minimum values from each pair
    """
    # Step 1: Sort the array in ascending order
    # This allows us to pair the smallest with second smallest,
    # third smallest with fourth smallest, etc.
    nums.sort()

    # Step 2: Initialize sum to 0
    total_sum = 0

    # Step 3: Iterate through the sorted array with step 2
    # We take every other element starting from index 0
    # These are the 1st, 3rd, 5th, etc. smallest numbers
    for i in range(0, len(nums), 2):
        total_sum += nums[i]

    # Step 4: Return the computed sum
    return total_sum
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
function arrayPairSum(nums) {
  /**
   * Maximizes the sum of minimums from pairs by sorting and summing every other element.
   *
   * @param {number[]} nums - Array of integers with length 2n
   * @return {number} Maximum possible sum of minimum values from each pair
   */

  // Step 1: Sort the array in ascending order
  // Using (a, b) => a - b ensures numerical sorting (default is lexicographic)
  nums.sort((a, b) => a - b);

  // Step 2: Initialize sum to 0
  let totalSum = 0;

  // Step 3: Iterate through the sorted array with step 2
  // We take every other element starting from index 0
  for (let i = 0; i < nums.length; i += 2) {
    totalSum += nums[i];
  }

  // Step 4: Return the computed sum
  return totalSum;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;

class Solution {
    public int arrayPairSum(int[] nums) {
        /**
         * Maximizes the sum of minimums from pairs by sorting and summing every other element.
         *
         * @param nums Array of integers with length 2n
         * @return Maximum possible sum of minimum values from each pair
         */

        // Step 1: Sort the array in ascending order
        // Arrays.sort() uses Dual-Pivot Quicksort for primitives
        Arrays.sort(nums);

        // Step 2: Initialize sum to 0
        int totalSum = 0;

        // Step 3: Iterate through the sorted array with step 2
        // We take every other element starting from index 0
        for (int i = 0; i < nums.length; i += 2) {
            totalSum += nums[i];
        }

        // Step 4: Return the computed sum
        return totalSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- The dominant operation is sorting the array. Most efficient comparison-based sorting algorithms (like quicksort, mergesort, or timsort) have O(n log n) time complexity.
- The subsequent iteration through the array with step 2 takes O(n) time, but this is dominated by the sorting step.

**Space Complexity: O(1) or O(n)**

- For in-place sorting algorithms (like the quicksort variant used in Python's `sort()` for lists), the space complexity is O(1) excluding the input storage.
- Some languages or implementations might use O(n) auxiliary space for sorting (like mergesort).
- The additional variables we use (`total_sum` and loop index) require only O(1) space.

## Common Mistakes

1. **Forgetting to sort numerically in JavaScript**: JavaScript's `Array.sort()` without a comparator function sorts lexicographically (alphabetically), not numerically. `[1, 10, 2]` would be sorted as `[1, 10, 2]` instead of `[1, 2, 10]`. Always use `nums.sort((a, b) => a - b)` for numerical sorting.

2. **Summing the wrong elements**: Some candidates might mistakenly sum every element or sum elements starting from index 1 instead of index 0. Remember: after sorting, we want the 1st, 3rd, 5th, etc. elements (indices 0, 2, 4, ...).

3. **Overcomplicating with unnecessary data structures**: The solution doesn't need hash maps, heaps, or other complex structures. The optimal solution is remarkably simple: sort and sum every other element.

4. **Not handling odd-length arrays**: While the problem guarantees the array has even length (2n), in practice you might want to add a check or handle edge cases if implementing a more general version.

## When You'll See This Pattern

This "sort and pair" or "sort and take every other element" pattern appears in several optimization problems where you need to maximize or minimize some function of pairs:

1. **Minimum Difference Between Highest and Lowest of K Scores (LeetCode 1984)**: To minimize the difference between max and min in groups of size k, you sort and slide a window of size k through the sorted array.

2. **Minimum Cost of Buying Candies With Discount (LeetCode 2144)**: To minimize cost when every third item is free, you sort in descending order and skip every third element.

3. **Assign Cookies (LeetCode 455)**: To maximize the number of content children, you sort both the greed factors and cookie sizes, then use a two-pointer approach.

The core insight in all these problems is that sorting brings structure to the problem, making the optimal strategy more apparent.

## Key Takeaways

1. **When dealing with pairing problems, consider sorting first**: Sorting often reveals patterns that aren't obvious in an unsorted array. Many greedy solutions start with sorting.

2. **For maximizing sums of minimums in pairs, pair small with small**: Intuitively, you don't want to "waste" a moderately large number by pairing it with a much larger number (which would make the moderately large number the minimum and disappear from the sum).

3. **Simple solutions often exist for seemingly complex problems**: This problem looks like it might require dynamic programming or complex optimization, but has an O(n log n) solution with just sorting and a single pass.

Remember: In coding interviews, always start by working through small examples to discover patterns before jumping to implementation.

---

**Related problems:** [Minimum Difference Between Highest and Lowest of K Scores](/problem/minimum-difference-between-highest-and-lowest-of-k-scores), [Minimum Cost of Buying Candies With Discount](/problem/minimum-cost-of-buying-candies-with-discount), [All Divisions With the Highest Score of a Binary Array](/problem/all-divisions-with-the-highest-score-of-a-binary-array)
