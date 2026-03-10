---
title: "How to Solve Find Polygon With the Largest Perimeter — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Polygon With the Largest Perimeter. Medium difficulty, 65.5% acceptance rate. Topics: Array, Greedy, Sorting, Prefix Sum."
date: "2026-10-04"
category: "dsa-patterns"
tags: ["find-polygon-with-the-largest-perimeter", "array", "greedy", "sorting", "medium"]
---

# How to Solve Find Polygon With the Largest Perimeter

This problem asks us to find the largest possible perimeter of a polygon we can form from a given array of positive integers. The key constraint is that for any valid polygon, the longest side must be strictly smaller than the sum of all other sides. What makes this problem interesting is that it's essentially a generalization of the triangle inequality to polygons with more than three sides, and it requires careful thinking about how to efficiently check which combinations of sides can form valid polygons.

## Visual Walkthrough

Let's walk through an example: `nums = [1, 12, 1, 2, 5, 50, 3]`

**Step 1: Understanding the polygon condition**
For a polygon with sides `a₁, a₂, ..., aₖ`, if we sort them so that `aₖ` is the largest, the condition becomes: `aₖ < a₁ + a₂ + ... + aₖ₋₁`. This is essentially saying the largest side must be smaller than the sum of all other sides.

**Step 2: Sorting the array**
First, let's sort our array in ascending order: `[1, 1, 2, 3, 5, 12, 50]`

**Step 3: Building up from smallest to largest**
We want the largest perimeter, so we should consider including as many of the largest elements as possible, but we need to ensure the polygon condition holds.

Let's start from the end and work backwards:

- Consider `[1, 1, 2, 3, 5, 12, 50]`: Check if 50 < sum of others (1+1+2+3+5+12=24) → 50 < 24? No.
- Consider `[1, 1, 2, 3, 5, 12]`: Check if 12 < sum of others (1+1+2+3+5=12) → 12 < 12? No (must be strictly smaller).
- Consider `[1, 1, 2, 3, 5]`: Check if 5 < sum of others (1+1+2+3=7) → 5 < 7? Yes! Perimeter = 1+1+2+3+5 = 12.

**Step 4: Why this greedy approach works**
Notice that if we sort the array, when we check whether the current largest element can be part of a valid polygon with all previous elements, we're essentially checking the most restrictive condition. If the largest element works with all previous ones, then any subset of those previous elements would also work (since removing elements only decreases the sum on the right side).

## Brute Force Approach

A naive approach would be to try all possible subsets of size 3 or more, check if they satisfy the polygon condition, and track the maximum perimeter. For each subset, we would:

1. Find the maximum element
2. Calculate the sum of all elements
3. Check if `max_element < (sum - max_element)`

The problem with this approach is the number of subsets grows exponentially with `n`. For an array of length `n`, there are `2ⁿ` possible subsets, and we'd need to check all subsets of size ≥ 3. Even with optimizations, this would be O(2ⁿ) time complexity, which is completely impractical for typical constraints where `n` can be up to 10⁵.

## Optimized Approach

The key insight is that **if we sort the array, we can use a greedy approach with prefix sums**. Here's the reasoning:

1. **Sorting**: When we sort in ascending order, the last element in any prefix is always the largest in that prefix.
2. **Prefix sums**: As we iterate through the sorted array, we can maintain a running sum of all elements seen so far.
3. **Greedy check**: For each element `nums[i]` (where i ≥ 2 since we need at least 3 sides), we check if `nums[i] < prefix_sum[i-1]` (where `prefix_sum[i-1]` is the sum of all elements before index `i`).
   - If true, then `nums[i]` can be the largest side of a polygon formed by all elements up to index `i`.
   - The perimeter would be `prefix_sum[i]` (sum of all elements up to `i`).
4. **Why this works**: If the current largest element satisfies the condition with all previous elements, then we have a valid polygon. We don't need to check subsets because including more elements only increases the sum on the right side of the inequality, making the condition easier to satisfy.

The algorithm becomes:

1. Sort the array in ascending order
2. Initialize a running sum and answer variable
3. Iterate through the sorted array
4. For each element (starting from index 2), check if it's smaller than the running sum of previous elements
5. If yes, update the answer to be the current total sum (running sum + current element)
6. Add the current element to the running sum
7. Return the answer (or -1 if no valid polygon found)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) due to sorting | Space: O(1) if we sort in-place, O(n) if not
def largestPerimeter(nums):
    """
    Find the largest perimeter of a polygon that can be formed from nums.

    The key insight: For a sorted array, if nums[i] < sum(nums[0:i]),
    then all elements up to i can form a valid polygon with nums[i] as
    the largest side.
    """
    # Step 1: Sort the array in ascending order
    # This ensures that as we iterate, the current element is always
    # the largest among the elements we've considered so far
    nums.sort()

    # Step 2: Initialize prefix sum and answer
    # prefix_sum tracks the sum of all elements before current index
    # max_perimeter tracks the largest valid perimeter found so far
    prefix_sum = 0
    max_perimeter = -1

    # Step 3: Iterate through the sorted array
    for i in range(len(nums)):
        # Step 4: Check if we have at least 3 sides and if the
        # current element (largest so far) is smaller than the
        # sum of all previous elements
        # Note: We need i >= 2 to have at least 3 elements
        if i >= 2 and nums[i] < prefix_sum:
            # Step 5: Update max_perimeter with the sum of all
            # elements up to current index (prefix_sum + nums[i])
            # This represents the perimeter of the polygon formed
            # by all elements from index 0 to i
            max_perimeter = prefix_sum + nums[i]

        # Step 6: Add current element to prefix_sum for next iteration
        # This builds up the sum of all elements seen so far
        prefix_sum += nums[i]

    # Step 7: Return the result
    # If no valid polygon found, max_perimeter remains -1
    return max_perimeter
```

```javascript
// Time: O(n log n) due to sorting | Space: O(1) if we sort in-place
function largestPerimeter(nums) {
  /**
   * Find the largest perimeter of a polygon that can be formed from nums.
   *
   * The key insight: For a sorted array, if nums[i] < sum(nums[0:i]),
   * then all elements up to i can form a valid polygon with nums[i] as
   * the largest side.
   */

  // Step 1: Sort the array in ascending order
  // This ensures that as we iterate, the current element is always
  // the largest among the elements we've considered so far
  nums.sort((a, b) => a - b);

  // Step 2: Initialize prefix sum and answer
  // prefixSum tracks the sum of all elements before current index
  // maxPerimeter tracks the largest valid perimeter found so far
  let prefixSum = 0;
  let maxPerimeter = -1;

  // Step 3: Iterate through the sorted array
  for (let i = 0; i < nums.length; i++) {
    // Step 4: Check if we have at least 3 sides and if the
    // current element (largest so far) is smaller than the
    // sum of all previous elements
    // Note: We need i >= 2 to have at least 3 elements
    if (i >= 2 && nums[i] < prefixSum) {
      // Step 5: Update maxPerimeter with the sum of all
      // elements up to current index (prefixSum + nums[i])
      // This represents the perimeter of the polygon formed
      // by all elements from index 0 to i
      maxPerimeter = prefixSum + nums[i];
    }

    // Step 6: Add current element to prefixSum for next iteration
    // This builds up the sum of all elements seen so far
    prefixSum += nums[i];
  }

  // Step 7: Return the result
  // If no valid polygon found, maxPerimeter remains -1
  return maxPerimeter;
}
```

```java
// Time: O(n log n) due to sorting | Space: O(1) if we sort in-place
class Solution {
    public long largestPerimeter(int[] nums) {
        /**
         * Find the largest perimeter of a polygon that can be formed from nums.
         *
         * The key insight: For a sorted array, if nums[i] < sum(nums[0:i]),
         * then all elements up to i can form a valid polygon with nums[i] as
         * the largest side.
         */

        // Step 1: Sort the array in ascending order
        // This ensures that as we iterate, the current element is always
        // the largest among the elements we've considered so far
        Arrays.sort(nums);

        // Step 2: Initialize prefix sum and answer
        // prefixSum tracks the sum of all elements before current index
        // maxPerimeter tracks the largest valid perimeter found so far
        long prefixSum = 0;
        long maxPerimeter = -1;

        // Step 3: Iterate through the sorted array
        for (int i = 0; i < nums.length; i++) {
            // Step 4: Check if we have at least 3 sides and if the
            // current element (largest so far) is smaller than the
            // sum of all previous elements
            // Note: We need i >= 2 to have at least 3 elements
            if (i >= 2 && nums[i] < prefixSum) {
                // Step 5: Update maxPerimeter with the sum of all
                // elements up to current index (prefixSum + nums[i])
                // This represents the perimeter of the polygon formed
                // by all elements from index 0 to i
                maxPerimeter = prefixSum + nums[i];
            }

            // Step 6: Add current element to prefixSum for next iteration
            // This builds up the sum of all elements seen so far
            prefixSum += nums[i];
        }

        // Step 7: Return the result
        // If no valid polygon found, maxPerimeter remains -1
        return maxPerimeter;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- The dominant operation is sorting the array, which takes O(n log n) time in most programming languages using standard sorting algorithms (like Timsort in Python, Merge sort in Java, or Quick sort in JavaScript).
- The single pass through the sorted array takes O(n) time, which is dominated by the sorting step.

**Space Complexity: O(1) or O(n)**

- If we sort in-place (like in Python's `list.sort()` or Java's `Arrays.sort()`), the space complexity is O(1) for the algorithm itself (excluding input storage).
- If the sorting algorithm creates a new array (like in some JavaScript implementations), or if we need to copy the array, the space complexity could be O(n).
- The additional variables (`prefix_sum`, `max_perimeter`) use O(1) space.

## Common Mistakes

1. **Forgetting to sort the array**: This is the most critical step. Without sorting, we can't use the greedy prefix sum approach because we wouldn't know which element is the largest in any given subset.

2. **Using ≤ instead of <**: The problem states the longest side must be **smaller** than (not equal to) the sum of other sides. Using `nums[i] <= prefix_sum` would incorrectly include cases where they're equal.

3. **Starting the check too early**: We need at least 3 sides to form a polygon, so we should only start checking when `i >= 2`. Checking earlier would consider polygons with fewer than 3 sides.

4. **Not handling large sums correctly**: The sum of elements can exceed 32-bit integer limits, especially since `n` can be up to 10⁵ and each element up to 10⁹. Always use 64-bit integers (long in Java/C++, BigInt in JavaScript if needed).

5. **Returning the wrong value when no polygon exists**: The problem doesn't specify what to return when no valid polygon exists, but typically we return -1. Make sure to initialize your answer variable appropriately.

## When You'll See This Pattern

This problem uses a combination of **sorting + greedy + prefix sum** pattern that appears in several other problems:

1. **Valid Triangle Number (LeetCode 611)**: Very similar concept - count how many triplets can form triangles. The triangle inequality (a + b > c) is essentially the same condition for a 3-sided polygon.

2. **3Sum Smaller (LeetCode 259)**: Count the number of triplets where the sum is less than a target. Uses similar two-pointer technique after sorting.

3. **Maximum Perimeter Triangle (HackerRank)**: Find the maximum perimeter triangle from an array, which is a simpler version of this problem (only 3 sides).

The core pattern is: when you need to check combinations where the largest element must satisfy an inequality with the sum of others, sorting first often allows for efficient greedy or two-pointer solutions.

## Key Takeaways

1. **Sorting transforms inequality checks**: When dealing with conditions like "largest element < sum of others", sorting the array lets you efficiently identify the largest element in any subset as you iterate.

2. **Prefix sums enable efficient validation**: Maintaining a running sum allows you to check the polygon condition in O(1) time per element after sorting, rather than recalculating sums repeatedly.

3. **Greedy works for this polygon condition**: If including all smaller elements works, then any subset of them would also work. This greedy property lets us consider only the "all elements up to i" case rather than checking all subsets.

Related problems: [3Sum Smaller](/problem/3sum-smaller), [Valid Triangle Number](/problem/valid-triangle-number)
