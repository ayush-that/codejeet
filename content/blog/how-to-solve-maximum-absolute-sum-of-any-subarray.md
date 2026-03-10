---
title: "How to Solve Maximum Absolute Sum of Any Subarray — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Absolute Sum of Any Subarray. Medium difficulty, 71.2% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-03-07"
category: "dsa-patterns"
tags: ["maximum-absolute-sum-of-any-subarray", "array", "dynamic-programming", "medium"]
---

# How to Solve Maximum Absolute Sum of Any Subarray

This problem asks us to find the maximum absolute value of any subarray sum in a given integer array. While it resembles the classic Maximum Subarray problem (Kadane's algorithm), the twist is that we need to consider both positive and negative sums since we're taking absolute values. A subarray with a large negative sum could have a large absolute value too. The challenge is efficiently tracking both extremes.

## Visual Walkthrough

Let's trace through `nums = [1, -3, 2, 3, -4]`:

**Step 1: Understanding what we're looking for**

- Subarray `[1]`: sum = 1, abs = 1
- Subarray `[-3]`: sum = -3, abs = 3
- Subarray `[1, -3]`: sum = -2, abs = 2
- Subarray `[2, 3]`: sum = 5, abs = 5
- Subarray `[-3, 2, 3]`: sum = 2, abs = 2
- Subarray `[2, 3, -4]`: sum = 1, abs = 1
- Subarray `[-3, 2, 3, -4]`: sum = -2, abs = 2
- Subarray `[1, -3, 2, 3, -4]`: sum = -1, abs = 1

The maximum absolute sum is 5 (from subarray `[2, 3]`).

**Step 2: Key observation**
Notice that:

- The maximum positive sum we can get is 5 (subarray `[2, 3]`)
- The minimum (most negative) sum we can get is -3 (subarray `[-3]`)

The maximum absolute value is `max(5, abs(-3)) = 5`.

**Step 3: Another example**
Consider `nums = [-5, -2, 1, -3]`:

- Maximum positive sum: 1 (subarray `[1]`)
- Minimum negative sum: -7 (subarray `[-5, -2]`)
- Maximum absolute value: `max(1, abs(-7)) = 7`

This shows why we need to track both maximum and minimum subarray sums.

## Brute Force Approach

The brute force solution checks every possible subarray:

1. Generate all subarrays using two nested loops
2. For each subarray, compute its sum
3. Take the absolute value and track the maximum

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def maxAbsoluteSum(nums):
    n = len(nums)
    max_abs = 0  # Empty subarray has sum 0

    # Generate all subarrays
    for i in range(n):
        for j in range(i, n):
            # Compute sum of current subarray
            current_sum = 0
            for k in range(i, j + 1):
                current_sum += nums[k]

            # Update maximum absolute value
            max_abs = max(max_abs, abs(current_sum))

    return max_abs
```

```javascript
// Time: O(n³) | Space: O(1)
function maxAbsoluteSum(nums) {
  const n = nums.length;
  let maxAbs = 0; // Empty subarray has sum 0

  // Generate all subarrays
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Compute sum of current subarray
      let currentSum = 0;
      for (let k = i; k <= j; k++) {
        currentSum += nums[k];
      }

      // Update maximum absolute value
      maxAbs = Math.max(maxAbs, Math.abs(currentSum));
    }
  }

  return maxAbs;
}
```

```java
// Time: O(n³) | Space: O(1)
public int maxAbsoluteSum(int[] nums) {
    int n = nums.length;
    int maxAbs = 0;  // Empty subarray has sum 0

    // Generate all subarrays
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Compute sum of current subarray
            int currentSum = 0;
            for (int k = i; k <= j; k++) {
                currentSum += nums[k];
            }

            // Update maximum absolute value
            maxAbs = Math.max(maxAbs, Math.abs(currentSum));
        }
    }

    return maxAbs;
}
```

</div>

**Why this is inefficient:**

- Time complexity is O(n³) due to three nested loops
- For n = 1000, we'd need ~1 billion operations
- We're recomputing sums from scratch for overlapping subarrays

We can optimize to O(n²) by using prefix sums, but that's still too slow for large inputs (n up to 10⁵).

## Optimized Approach

The key insight is that the maximum absolute sum must come from either:

1. The maximum subarray sum (largest positive), OR
2. The minimum subarray sum (most negative), whose absolute value might be large

This reduces the problem to two applications of Kadane's algorithm:

- One to find the maximum subarray sum
- One to find the minimum subarray sum

**Why this works:**

- Any subarray with maximum absolute sum will either have a large positive sum or a large negative sum
- If it has a large positive sum, it's the maximum subarray sum
- If it has a large negative sum, it's the minimum subarray sum
- We take the maximum of these two values (with the minimum's absolute value)

**Step-by-step reasoning:**

1. Initialize `max_ending_here` and `min_ending_here` to track the best subarray ending at each position
2. At each element, we can either:
   - Start a new subarray at this element, OR
   - Extend the previous best subarray
3. Update global `max_so_far` and `min_so_far`
4. Return `max(max_so_far, abs(min_so_far))`

## Optimal Solution

Here's the efficient O(n) solution using modified Kadane's algorithm:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxAbsoluteSum(nums):
    """
    Returns the maximum absolute sum of any subarray.

    The key insight is that the maximum absolute sum is either:
    1. The maximum subarray sum (if positive), OR
    2. The absolute value of the minimum subarray sum (if negative)

    We use a modified Kadane's algorithm to track both maximum
    and minimum subarray sums simultaneously.
    """
    # Initialize tracking variables
    max_ending_here = nums[0]  # Best subarray ending at current position (max)
    min_ending_here = nums[0]  # Best subarray ending at current position (min)
    max_so_far = nums[0]       # Global maximum subarray sum
    min_so_far = nums[0]       # Global minimum subarray sum

    # Process each element starting from the second one
    for i in range(1, len(nums)):
        # For maximum: either start new subarray or extend previous best
        # We take max(0, ...) for max_ending_here because if previous is negative,
        # we're better off starting fresh (for maximum sum)
        max_ending_here = max(nums[i], max_ending_here + nums[i])
        max_so_far = max(max_so_far, max_ending_here)

        # For minimum: either start new subarray or extend previous worst
        # We take min(0, ...) for min_ending_here because if previous is positive,
        # we're better off starting fresh (for minimum sum)
        min_ending_here = min(nums[i], min_ending_here + nums[i])
        min_so_far = min(min_so_far, min_ending_here)

    # The answer is the larger of: max positive sum OR absolute of min negative sum
    return max(max_so_far, abs(min_so_far))
```

```javascript
// Time: O(n) | Space: O(1)
function maxAbsoluteSum(nums) {
  /**
   * Returns the maximum absolute sum of any subarray.
   *
   * The key insight is that the maximum absolute sum is either:
   * 1. The maximum subarray sum (if positive), OR
   * 2. The absolute value of the minimum subarray sum (if negative)
   *
   * We use a modified Kadane's algorithm to track both maximum
   * and minimum subarray sums simultaneously.
   */
  // Initialize tracking variables
  let maxEndingHere = nums[0]; // Best subarray ending at current position (max)
  let minEndingHere = nums[0]; // Best subarray ending at current position (min)
  let maxSoFar = nums[0]; // Global maximum subarray sum
  let minSoFar = nums[0]; // Global minimum subarray sum

  // Process each element starting from the second one
  for (let i = 1; i < nums.length; i++) {
    // For maximum: either start new subarray or extend previous best
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);

    // For minimum: either start new subarray or extend previous worst
    minEndingHere = Math.min(nums[i], minEndingHere + nums[i]);
    minSoFar = Math.min(minSoFar, minEndingHere);
  }

  // The answer is the larger of: max positive sum OR absolute of min negative sum
  return Math.max(maxSoFar, Math.abs(minSoFar));
}
```

```java
// Time: O(n) | Space: O(1)
public int maxAbsoluteSum(int[] nums) {
    /**
     * Returns the maximum absolute sum of any subarray.
     *
     * The key insight is that the maximum absolute sum is either:
     * 1. The maximum subarray sum (if positive), OR
     * 2. The absolute value of the minimum subarray sum (if negative)
     *
     * We use a modified Kadane's algorithm to track both maximum
     * and minimum subarray sums simultaneously.
     */
    // Initialize tracking variables
    int maxEndingHere = nums[0];  // Best subarray ending at current position (max)
    int minEndingHere = nums[0];  // Best subarray ending at current position (min)
    int maxSoFar = nums[0];       // Global maximum subarray sum
    int minSoFar = nums[0];       // Global minimum subarray sum

    // Process each element starting from the second one
    for (int i = 1; i < nums.length; i++) {
        // For maximum: either start new subarray or extend previous best
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);

        // For minimum: either start new subarray or extend previous worst
        minEndingHere = Math.min(nums[i], minEndingHere + nums[i]);
        minSoFar = Math.min(minSoFar, minEndingHere);
    }

    // The answer is the larger of: max positive sum OR absolute of min negative sum
    return Math.max(maxSoFar, Math.abs(minSoFar));
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array
- Each element is processed exactly once
- Constant work per element (just a few comparisons and arithmetic operations)

**Space Complexity: O(1)**

- We only use a fixed number of variables regardless of input size
- No additional data structures that grow with input size
- The input array itself is given and doesn't count toward space complexity

## Common Mistakes

1. **Only tracking maximum sum**: The most common mistake is applying standard Kadane's algorithm and taking the absolute value at the end. This fails for cases like `[-5, -2, 1, -3]` where the answer comes from the minimum (most negative) sum, not the maximum positive sum.

2. **Forgetting about the empty subarray**: The problem states "possibly empty" subarray, which has sum 0. Our solution handles this because we initialize with the first element, and if all numbers are negative, the maximum might be 0. However, some implementations might miss this edge case.

3. **Incorrect initialization**: Starting tracking variables at 0 instead of `nums[0]` can cause issues with arrays containing only negative numbers. If we start at 0, we might incorrectly think we can get a sum of 0 when we shouldn't (unless we explicitly allow empty subarrays).

4. **Confusing subarray with subsequence**: Remember a subarray is contiguous. Some candidates try to pick and choose elements non-contiguously, which is incorrect for this problem.

## When You'll See This Pattern

This "track both maximum and minimum" pattern appears in several problems:

1. **Maximum Product Subarray (LeetCode 152)**: Similar to this problem but for products instead of sums. You need to track both max and min because a negative number can turn a minimum product into a maximum when multiplied by another negative.

2. **Best Time to Buy and Sell Stock (LeetCode 121)**: While not identical, it also involves tracking extremes (minimum price seen so far and maximum profit).

3. **Maximum Sum Circular Subarray (LeetCode 918)**: Requires understanding both maximum subarray sum and minimum subarray sum to handle wrap-around cases.

The core idea is that when operations aren't monotonic (like absolute value or multiplication with negatives), you often need to track both best and worst cases at each step.

## Key Takeaways

1. **Absolute value problems often require tracking both extremes**: When dealing with absolute values, remember that both large positive and large negative values can be important after taking the absolute value.

2. **Kadane's algorithm is versatile**: It can be adapted to track minimum values as well as maximum values. The core recurrence relation `max_ending_here = max(nums[i], max_ending_here + nums[i])` has a dual for minimum: `min_ending_here = min(nums[i], min_ending_here + nums[i])`.

3. **Test with both positive and negative extremes**: Always test your solution with arrays containing all positive numbers, all negative numbers, and mixed signs to ensure it handles all cases correctly.

Related problems: [Maximum Subarray](/problem/maximum-subarray)
