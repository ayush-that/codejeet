---
title: "How to Solve Find Indices With Index and Value Difference I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Indices With Index and Value Difference I. Easy difficulty, 60.3% acceptance rate. Topics: Array, Two Pointers."
date: "2028-06-18"
category: "dsa-patterns"
tags: ["find-indices-with-index-and-value-difference-i", "array", "two-pointers", "easy"]
---

# How to Solve Find Indices With Index and Value Difference I

This problem asks us to find two indices `i` and `j` in an array where both their index positions and their corresponding values are sufficiently far apart. Specifically, we need `abs(i - j) >= indexDifference` and `abs(nums[i] - nums[j]) >= valueDifference`. The challenge lies in efficiently checking all possible index pairs while ensuring we don't miss any valid combinations.

What makes this problem interesting is that while it appears to require checking all pairs (which would be O(n²)), we can actually solve it with a much simpler O(n) approach by carefully tracking minimum and maximum values as we iterate through the array.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** `nums = [5, 1, 4, 1]`, `indexDifference = 2`, `valueDifference = 4`

We need to find indices `i` and `j` where:

1. Their positions are at least 2 apart (`abs(i - j) >= 2`)
2. Their values are at least 4 apart (`abs(nums[i] - nums[j]) >= 4`)

Let's walk through the array step by step:

**Step 1:** Start at index 0 (value = 5)

- We can't check any pairs yet because we need at least `indexDifference = 2` between indices
- Track minimum value seen so far: `min_val = 5` at index `min_idx = 0`
- Track maximum value seen so far: `max_val = 5` at index `max_idx = 0`

**Step 2:** Move to index 1 (value = 1)

- Still can't check pairs (only 1 index apart, need 2)
- Update minimum: `1 < 5`, so `min_val = 1`, `min_idx = 1`
- Maximum remains: `max_val = 5`, `max_idx = 0`

**Step 3:** Move to index 2 (value = 4)

- Now we can check pairs with indices at least 2 positions back
- Check with minimum (index 1, value 1): `abs(2 - 1) = 1` ❌ (needs 2)
- Check with maximum (index 0, value 5): `abs(2 - 0) = 2` ✓, `abs(4 - 5) = 1` ❌ (needs 4)
- Update tracking: `4 > 1` but `4 < 5`, so no change to min/max

**Step 4:** Move to index 3 (value = 1)

- Check with minimum (index 1, value 1): `abs(3 - 1) = 2` ✓, `abs(1 - 1) = 0` ❌
- Check with maximum (index 0, value 5): `abs(3 - 0) = 3` ✓, `abs(1 - 5) = 4` ✓
- **Found valid pair!** Return `[0, 3]`

The key insight: by tracking the minimum and maximum values we've seen (and their indices), we only need to check two candidates at each step instead of all previous indices.

## Brute Force Approach

The most straightforward solution is to check all possible pairs of indices:

1. For each index `i` from 0 to n-1
2. For each index `j` from 0 to n-1
3. Check if `abs(i - j) >= indexDifference` and `abs(nums[i] - nums[j]) >= valueDifference`
4. If both conditions are met, return `[i, j]`
5. If no pair is found, return `[-1, -1]`

This approach has O(n²) time complexity, which is acceptable for small inputs but becomes inefficient for larger arrays. The problem constraints (n up to 100) make the brute force technically acceptable, but we can do better with a more elegant O(n) solution.

## Optimal Solution

The optimal approach uses a single pass through the array while tracking the minimum and maximum values seen so far. For each new element, we check if it forms a valid pair with either the current minimum or maximum value, ensuring the index difference condition is satisfied.

**Why this works:** If we want a large value difference, we need either:

1. A small current value paired with a large new value (current min with new element)
2. A large current value paired with a small new value (current max with new element)

By tracking only the minimum and maximum values (and their indices), we cover both extreme cases that could satisfy the value difference condition.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findIndices(self, nums, indexDifference, valueDifference):
    """
    Find two indices i and j such that:
    1. abs(i - j) >= indexDifference
    2. abs(nums[i] - nums[j]) >= valueDifference

    Approach: Track min and max values seen so far.
    For each new element, check if it forms a valid pair
    with either the current min or max.
    """
    n = len(nums)

    # Track the index of minimum and maximum values seen so far
    min_idx = 0  # index of minimum value
    max_idx = 0  # index of maximum value

    # Start from indexDifference because we need at least that much gap
    for i in range(indexDifference, n):
        # Update min_idx if we found a smaller value
        # We compare with the value at min_idx, not the stored min value
        if nums[i - indexDifference] < nums[min_idx]:
            min_idx = i - indexDifference

        # Update max_idx if we found a larger value
        if nums[i - indexDifference] > nums[max_idx]:
            max_idx = i - indexDifference

        # Check if current element forms valid pair with minimum
        # We need to ensure index difference condition is met
        if abs(nums[i] - nums[min_idx]) >= valueDifference:
            # i is always >= indexDifference ahead of min_idx
            return [min_idx, i]

        # Check if current element forms valid pair with maximum
        if abs(nums[i] - nums[max_idx]) >= valueDifference:
            # i is always >= indexDifference ahead of max_idx
            return [max_idx, i]

    # No valid pair found
    return [-1, -1]
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Find two indices i and j such that:
 * 1. abs(i - j) >= indexDifference
 * 2. abs(nums[i] - nums[j]) >= valueDifference
 *
 * Approach: Track min and max values seen so far.
 * For each new element, check if it forms a valid pair
 * with either the current min or max.
 */
function findIndices(nums, indexDifference, valueDifference) {
  const n = nums.length;

  // Track the index of minimum and maximum values seen so far
  let minIdx = 0; // index of minimum value
  let maxIdx = 0; // index of maximum value

  // Start from indexDifference because we need at least that much gap
  for (let i = indexDifference; i < n; i++) {
    // Update minIdx if we found a smaller value
    // We compare with the value at minIdx, not a stored min value
    if (nums[i - indexDifference] < nums[minIdx]) {
      minIdx = i - indexDifference;
    }

    // Update maxIdx if we found a larger value
    if (nums[i - indexDifference] > nums[maxIdx]) {
      maxIdx = i - indexDifference;
    }

    // Check if current element forms valid pair with minimum
    // The index difference is guaranteed because i - minIdx >= indexDifference
    if (Math.abs(nums[i] - nums[minIdx]) >= valueDifference) {
      return [minIdx, i];
    }

    // Check if current element forms valid pair with maximum
    if (Math.abs(nums[i] - nums[maxIdx]) >= valueDifference) {
      return [maxIdx, i];
    }
  }

  // No valid pair found
  return [-1, -1];
}
```

```java
// Time: O(n) | Space: O(1)
/**
 * Find two indices i and j such that:
 * 1. abs(i - j) >= indexDifference
 * 2. abs(nums[i] - nums[j]) >= valueDifference
 *
 * Approach: Track min and max values seen so far.
 * For each new element, check if it forms a valid pair
 * with either the current min or max.
 */
public int[] findIndices(int[] nums, int indexDifference, int valueDifference) {
    int n = nums.length;

    // Track the index of minimum and maximum values seen so far
    int minIdx = 0;  // index of minimum value
    int maxIdx = 0;  // index of maximum value

    // Start from indexDifference because we need at least that much gap
    for (int i = indexDifference; i < n; i++) {
        // Update minIdx if we found a smaller value
        // Note: we compare with nums[minIdx], not a stored min value
        if (nums[i - indexDifference] < nums[minIdx]) {
            minIdx = i - indexDifference;
        }

        // Update maxIdx if we found a larger value
        if (nums[i - indexDifference] > nums[maxIdx]) {
            maxIdx = i - indexDifference;
        }

        // Check if current element forms valid pair with minimum
        // The index difference is guaranteed: i - minIdx >= indexDifference
        if (Math.abs(nums[i] - nums[minIdx]) >= valueDifference) {
            return new int[]{minIdx, i};
        }

        // Check if current element forms valid pair with maximum
        if (Math.abs(nums[i] - nums[maxIdx]) >= valueDifference) {
            return new int[]{maxIdx, i};
        }
    }

    // No valid pair found
    return new int[]{-1, -1};
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the array from `indexDifference` to `n-1`
- Each iteration performs constant-time operations: comparisons and absolute value calculations
- Even though we check two conditions per iteration, both are O(1) operations

**Space Complexity:** O(1)

- We only store a few integer variables: `min_idx`, `max_idx`, and loop counter
- No additional data structures that grow with input size
- The input array is given and not counted toward our space usage

## Common Mistakes

1. **Starting the loop at 0 instead of `indexDifference`**: If you start at 0, you'll check pairs that don't satisfy the index difference condition. Remember, for index `i`, the earliest valid partner is at index `i - indexDifference`.

2. **Forgetting to update min/max indices correctly**: Some candidates try to store the actual min/max values instead of their indices. You need the indices to check the index difference condition, so always track indices, not just values.

3. **Not handling the case where no valid pair exists**: Always include the return `[-1, -1]` at the end. Some candidates forget this and either return nothing or throw an error when no pair is found.

4. **Incorrect index difference check**: The condition is `abs(i - j) >= indexDifference`, not `>`. Some candidates use strict inequality, which would miss valid pairs where the difference equals exactly `indexDifference`.

## When You'll See This Pattern

This "track extremes" pattern appears in several array problems where you need to find pairs with certain properties:

1. **Best Time to Buy and Sell Stock**: Track the minimum price seen so far to calculate maximum profit at each day.

2. **Maximum Difference Between Increasing Elements**: Similar to this problem but with ordering constraints on indices.

3. **Container With Most Water**: Track two pointers from both ends, moving the pointer with the smaller height inward.

The core idea is that for problems involving differences or distances, you often only need to consider extreme values (minimum/maximum) rather than checking all possibilities.

## Key Takeaways

1. **When looking for large differences, track extremes**: If you need elements with large value differences, you only need to check the minimum and maximum values seen so far. Any other value would produce a smaller difference.

2. **Consider index constraints when designing loops**: The `indexDifference` parameter determines where your loop should start and which indices are valid to compare.

3. **Store indices, not just values**: When you need to return indices (not just values), track the indices of your min/max values directly rather than storing the values and searching for their indices later.

Related problems: [Minimum Absolute Difference Between Elements With Constraint](/problem/minimum-absolute-difference-between-elements-with-constraint), [Find Indices With Index and Value Difference II](/problem/find-indices-with-index-and-value-difference-ii)
