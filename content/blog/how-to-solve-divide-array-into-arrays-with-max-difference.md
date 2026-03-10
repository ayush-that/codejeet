---
title: "How to Solve Divide Array Into Arrays With Max Difference — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Divide Array Into Arrays With Max Difference. Medium difficulty, 79.0% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2028-02-18"
category: "dsa-patterns"
tags: ["divide-array-into-arrays-with-max-difference", "array", "greedy", "sorting", "medium"]
---

# How to Solve Divide Array Into Arrays With Max Difference

You need to split an array into groups of three where all elements in each group are within `k` of each other. The challenge is that you must create valid groups while using every element exactly once—you can't skip elements that don't fit. This makes the problem interesting because you need to find a systematic way to group elements that guarantees success when possible.

## Visual Walkthrough

Let's walk through an example: `nums = [1, 3, 4, 8, 9, 12]` with `k = 3`. We need to create `6/3 = 2` groups of size 3.

**Step 1: Sort the array**  
Sorted: `[1, 3, 4, 8, 9, 12]`

**Step 2: Process elements in chunks of three**  
Take the first three elements: `[1, 3, 4]`  
Check if `max(1,3,4) - min(1,3,4) ≤ k`: `4 - 1 = 3 ≤ 3` ✓ Valid group.

Take the next three elements: `[8, 9, 12]`  
Check if `max(8,9,12) - min(8,9,12) ≤ k`: `12 - 8 = 4 > 3` ✗ Invalid group.

But wait—this suggests our initial approach might fail. Let's try a different grouping strategy.

**Step 3: Try grouping smallest elements together**  
Actually, after sorting, the optimal strategy is to take consecutive triplets starting from the smallest element. Let's verify:

Group 1: `[1, 3, 4]` ✓ (4-1=3≤3)  
Group 2: `[8, 9, 12]` ✗ (12-8=4>3)

This fails. But what if we try different groupings? Let's think: after sorting, the elements closest together should be grouped. The best chance for three elements to be within `k` is to take three consecutive sorted elements.

**Step 4: The correct insight**  
Actually, the problem guarantees that if a valid grouping exists, grouping consecutive sorted elements in triplets will work. Let me prove it with a different example:

`nums = [1, 2, 3, 4, 5, 6]` with `k = 2`  
Sorted: `[1, 2, 3, 4, 5, 6]`  
Group 1: `[1, 2, 3]` ✓ (3-1=2≤2)  
Group 2: `[4, 5, 6]` ✓ (6-4=2≤2)

The key insight: After sorting, if we take elements `i`, `i+1`, `i+2` (where `i` is 0, 3, 6, ...), then for any valid grouping to exist, these consecutive triplets must satisfy the condition. If they don't, no other grouping will work either.

## Brute Force Approach

A brute force approach would try all possible ways to partition the sorted array into groups of three and check if any arrangement satisfies the condition. This is essentially generating all permutations of groupings.

For an array of size `n`, there are `(n!)/((3!)^(n/3) * (n/3)!)` possible partitions—an astronomical number even for moderate `n`. We'd need to:

1. Generate all possible partitions into groups of three
2. For each partition, check if every group satisfies `max(group) - min(group) ≤ k`
3. Return the first valid partition found

This approach has factorial time complexity and is completely impractical for any reasonable input size. Even for `n = 12`, there are thousands of possible partitions to check.

The brute force teaches us that we need a more systematic approach rather than trying all combinations.

## Optimized Approach

The key insight comes from two observations:

1. **Sorting helps**: The condition `max - min ≤ k` is about the range of values. After sorting, elements that are close in value are adjacent.
2. **Greedy grouping works**: If we sort the array, then the only way to create valid groups is to take consecutive triplets. Here's why:
   - Consider the smallest element `x`. It needs two partners.
   - The best chance for success is to pair it with the next two smallest elements `y` and `z`.
   - If `z - x > k`, then no other elements can work with `x` either (since all others are ≥ `z`).
   - If `z - x ≤ k`, then this forms a valid group, and we should use it.

This leads to a simple greedy algorithm:

1. Sort the array in ascending order
2. Process the array in steps of 3
3. For each triplet `(nums[i], nums[i+1], nums[i+2])`, check if `nums[i+2] - nums[i] ≤ k`
4. If any triplet fails, return an empty array (no valid grouping exists)
5. Otherwise, collect all triplets as the answer

Why is this greedy approach optimal? Because if a valid grouping exists, the sorted-and-consecutive approach will find it. Any deviation would mean leaving a smaller element to pair with larger ones, which only increases the range.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) for output, O(1) extra space
def divideArray(nums, k):
    """
    Divide array into groups of 3 where max-min <= k for each group.

    Args:
        nums: List of integers to divide
        k: Maximum allowed difference within each group

    Returns:
        List of groups (each group is a list of 3 elements) or empty list if impossible
    """
    # Step 1: Sort the array to bring close values together
    # Sorting is O(n log n) and is the bottleneck
    nums.sort()

    result = []
    n = len(nums)

    # Step 2: Process in chunks of 3
    # We need exactly n/3 groups, so we iterate i from 0 to n-1 with step 3
    for i in range(0, n, 3):
        # Get current triplet: i, i+1, i+2
        # Since n is multiple of 3, i+2 is always valid
        a, b, c = nums[i], nums[i + 1], nums[i + 2]

        # Step 3: Check if the triplet satisfies the condition
        # We only need to check max-min <= k
        # Since array is sorted, max is c and min is a
        if c - a > k:
            # Condition violated, no valid grouping possible
            return []

        # Step 4: Add valid triplet to result
        # We preserve the original order from sorted array
        result.append([a, b, c])

    return result
```

```javascript
// Time: O(n log n) | Space: O(n) for output, O(1) extra space
function divideArray(nums, k) {
  /**
   * Divide array into groups of 3 where max-min <= k for each group.
   *
   * @param {number[]} nums - Array of integers to divide
   * @param {number} k - Maximum allowed difference within each group
   * @return {number[][]} - Array of groups or empty array if impossible
   */

  // Step 1: Sort the array to bring close values together
  // JavaScript sort() sorts lexicographically by default, so we need compare function
  nums.sort((a, b) => a - b);

  const result = [];
  const n = nums.length;

  // Step 2: Process in chunks of 3
  // We need exactly n/3 groups, so we iterate i from 0 to n-1 with step 3
  for (let i = 0; i < n; i += 3) {
    // Get current triplet: i, i+1, i+2
    // Since n is multiple of 3, i+2 is always valid
    const a = nums[i];
    const b = nums[i + 1];
    const c = nums[i + 2];

    // Step 3: Check if the triplet satisfies the condition
    // We only need to check max-min <= k
    // Since array is sorted, max is c and min is a
    if (c - a > k) {
      // Condition violated, no valid grouping possible
      return [];
    }

    // Step 4: Add valid triplet to result
    // We preserve the original order from sorted array
    result.push([a, b, c]);
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n) for output, O(1) extra space
import java.util.*;

class Solution {
    public int[][] divideArray(int[] nums, int k) {
        /**
         * Divide array into groups of 3 where max-min <= k for each group.
         *
         * @param nums: Array of integers to divide
         * @param k: Maximum allowed difference within each group
         * @return: Array of groups or empty array if impossible
         */

        // Step 1: Sort the array to bring close values together
        Arrays.sort(nums);

        int n = nums.length;
        int[][] result = new int[n / 3][3];
        int groupIndex = 0;

        // Step 2: Process in chunks of 3
        // We need exactly n/3 groups, so we iterate i from 0 to n-1 with step 3
        for (int i = 0; i < n; i += 3) {
            // Get current triplet: i, i+1, i+2
            // Since n is multiple of 3, i+2 is always valid
            int a = nums[i];
            int b = nums[i + 1];
            int c = nums[i + 2];

            // Step 3: Check if the triplet satisfies the condition
            // We only need to check max-min <= k
            // Since array is sorted, max is c and min is a
            if (c - a > k) {
                // Condition violated, return empty array
                return new int[0][0];
            }

            // Step 4: Add valid triplet to result
            // We preserve the original order from sorted array
            result[groupIndex][0] = a;
            result[groupIndex][1] = b;
            result[groupIndex][2] = c;
            groupIndex++;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time, which dominates the algorithm
- The subsequent loop runs O(n) times but with O(1) work per iteration
- Total: O(n log n) + O(n) = O(n log n)

**Space Complexity: O(n) for output, O(1) extra space**

- The output requires O(n) space to store all groups
- Sorting may require O(log n) to O(n) space depending on the sorting algorithm implementation
- Our algorithm uses only O(1) extra space beyond input and output

## Common Mistakes

1. **Not sorting the array first**: Some candidates try to group elements without sorting, which fails because you might pair a small element with two large ones, violating the condition unnecessarily.

2. **Checking wrong elements in the triplet**: After sorting, you only need to check `nums[i+2] - nums[i] ≤ k`, not all pairwise differences. Checking all three pairs (`b-a`, `c-a`, `c-b`) is redundant since `c-a` is the largest difference when the array is sorted.

3. **Forgetting that n is a multiple of 3**: The problem guarantees this, so you don't need to handle cases where the array length isn't divisible by 3. However, in interviews, it's good to mention this assumption.

4. **Returning wrong empty value**: Different languages have different conventions for empty arrays. In Python, return `[]`; in JavaScript, return `[]`; in Java, return `new int[0][0]`. Mixing these up can cause type errors.

## When You'll See This Pattern

This "sort then group greedily" pattern appears in several interval and grouping problems:

1. **Meeting Rooms II (LeetCode 253)**: Sort meeting start times, then use a min-heap to track end times as you allocate rooms greedily.

2. **Non-overlapping Intervals (LeetCode 435)**: Sort intervals by end time, then greedily select non-overlapping intervals.

3. **Partition Labels (LeetCode 763)**: Track the last occurrence of each character, then partition greedily when you reach the max last occurrence of current segment.

The common theme is that sorting transforms the problem into one where a local optimal choice (greedy) leads to a global optimum. When you need to group or partition elements with some proximity condition, sorting is often the first step.

## Key Takeaways

1. **Sorting enables greedy solutions**: When elements need to be close in value, sorting brings them together, allowing simple sequential processing.

2. **Check only extreme values in sorted groups**: In a sorted triplet `(a, b, c)`, the maximum difference is always `c - a`, so you don't need to check all pairs.

3. **Greedy works when local optimality implies global optimality**: If taking the smallest available elements together doesn't work, no other grouping will work either—this is the hallmark of problems where greedy algorithms succeed.

[Practice this problem on CodeJeet](/problem/divide-array-into-arrays-with-max-difference)
