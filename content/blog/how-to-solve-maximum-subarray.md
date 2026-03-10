---
title: "How to Solve Maximum Subarray — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Subarray. Medium difficulty, 53.0% acceptance rate. Topics: Array, Divide and Conquer, Dynamic Programming."
date: "2026-02-11"
category: "dsa-patterns"
tags: ["maximum-subarray", "array", "divide-and-conquer", "dynamic-programming", "medium"]
---

# How to Solve Maximum Subarray

The Maximum Subarray problem asks us to find the contiguous subarray within an integer array that has the largest sum, and return just that sum. What makes this problem deceptively tricky is that negative numbers can appear anywhere in the array—they might be part of the maximum subarray if including them allows us to reach even larger positive numbers later, or they might need to be excluded entirely. The challenge is determining when to start a new subarray versus extending the current one.

## Visual Walkthrough

Let's trace through the example `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]` step by step to build intuition.

We'll keep track of two values as we iterate:

- **Current sum**: The maximum sum ending at the current position
- **Maximum sum**: The overall maximum sum we've seen so far

**Step 1:** Start with `current_sum = -2`, `max_sum = -2`

- At index 0, we only have [-2], so both values are -2

**Step 2:** At index 1 (value = 1)

- Option A: Extend previous subarray: -2 + 1 = -1
- Option B: Start new subarray: 1
- Better to start fresh: `current_sum = 1`, `max_sum = max(-2, 1) = 1`

**Step 3:** At index 2 (value = -3)

- Extend: 1 + (-3) = -2
- Start new: -3
- Better to extend: `current_sum = -2`, `max_sum` stays 1

**Step 4:** At index 3 (value = 4)

- Extend: -2 + 4 = 2
- Start new: 4
- Better to start fresh: `current_sum = 4`, `max_sum = max(1, 4) = 4`

**Step 5:** At index 4 (value = -1)

- Extend: 4 + (-1) = 3
- Start new: -1
- Better to extend: `current_sum = 3`, `max_sum` stays 4

**Step 6:** At index 5 (value = 2)

- Extend: 3 + 2 = 5
- Start new: 2
- Better to extend: `current_sum = 5`, `max_sum = max(4, 5) = 5`

**Step 7:** At index 6 (value = 1)

- Extend: 5 + 1 = 6
- Start new: 1
- Better to extend: `current_sum = 6`, `max_sum = max(5, 6) = 6`

**Step 8:** At index 7 (value = -5)

- Extend: 6 + (-5) = 1
- Start new: -5
- Better to extend: `current_sum = 1`, `max_sum` stays 6

**Step 9:** At index 8 (value = 4)

- Extend: 1 + 4 = 5
- Start new: 4
- Better to extend: `current_sum = 5`, `max_sum` stays 6

The maximum subarray sum is 6, which comes from the subarray `[4, -1, 2, 1]`.

## Brute Force Approach

The most straightforward approach is to check every possible subarray. For each starting index `i`, we iterate through all ending indices `j ≥ i`, compute the sum of `nums[i:j+1]`, and track the maximum.

Why this is insufficient: With `n` elements, there are `n(n+1)/2` possible subarrays, making this an O(n²) solution. For an array of size 10,000, that's about 50 million operations—far too slow for typical constraints.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def maxSubArrayBruteForce(nums):
    """
    Brute force solution checking all subarrays.
    Too slow for large inputs (n > 1000).
    """
    n = len(nums)
    max_sum = float('-inf')  # Initialize with negative infinity

    # Check every possible subarray
    for i in range(n):
        current_sum = 0
        for j in range(i, n):
            current_sum += nums[j]  # Add next element to current subarray
            max_sum = max(max_sum, current_sum)

    return max_sum
```

```javascript
// Time: O(n²) | Space: O(1)
function maxSubArrayBruteForce(nums) {
  /**
   * Brute force solution checking all subarrays.
   * Too slow for large inputs (n > 1000).
   */
  let maxSum = -Infinity;
  const n = nums.length;

  // Check every possible subarray
  for (let i = 0; i < n; i++) {
    let currentSum = 0;
    for (let j = i; j < n; j++) {
      currentSum += nums[j]; // Add next element to current subarray
      maxSum = Math.max(maxSum, currentSum);
    }
  }

  return maxSum;
}
```

```java
// Time: O(n²) | Space: O(1)
public int maxSubArrayBruteForce(int[] nums) {
    /**
     * Brute force solution checking all subarrays.
     * Too slow for large inputs (n > 1000).
     */
    int maxSum = Integer.MIN_VALUE;
    int n = nums.length;

    // Check every possible subarray
    for (int i = 0; i < n; i++) {
        int currentSum = 0;
        for (int j = i; j < n; j++) {
            currentSum += nums[j];  // Add next element to current subarray
            maxSum = Math.max(maxSum, currentSum);
        }
    }

    return maxSum;
}
```

</div>

## Optimized Approach

The key insight is **Kadane's Algorithm**, which uses dynamic programming. At each position, we ask: "Should I extend the previous subarray, or start a new one from here?"

The recurrence relation is:

```
current_sum = max(nums[i], current_sum + nums[i])
max_sum = max(max_sum, current_sum)
```

Why this works: If adding the current element to our running sum gives us a value less than the element itself, it means our previous running sum was negative and dragging us down. In that case, we're better off "resetting" and starting a fresh subarray from the current element.

This approach transforms an O(n²) problem into O(n) by avoiding redundant calculations—we only need to pass through the array once, making a constant-time decision at each step.

## Optimal Solution

Here's the complete implementation of Kadane's Algorithm:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxSubArray(nums):
    """
    Kadane's Algorithm: At each position, decide whether to extend
    the previous subarray or start a new one from current element.
    """
    # Edge case: empty array (problem guarantees non-empty, but good practice)
    if not nums:
        return 0

    # Initialize with first element
    current_sum = nums[0]
    max_sum = nums[0]

    # Start from second element
    for i in range(1, len(nums)):
        # Key decision: extend previous subarray or start fresh?
        # If current_sum is negative, starting fresh with nums[i] is better
        current_sum = max(nums[i], current_sum + nums[i])

        # Update global maximum if we found a better subarray
        max_sum = max(max_sum, current_sum)

    return max_sum
```

```javascript
// Time: O(n) | Space: O(1)
function maxSubArray(nums) {
  /**
   * Kadane's Algorithm: At each position, decide whether to extend
   * the previous subarray or start a new one from current element.
   */
  // Edge case: empty array (problem guarantees non-empty, but good practice)
  if (nums.length === 0) return 0;

  // Initialize with first element
  let currentSum = nums[0];
  let maxSum = nums[0];

  // Start from second element
  for (let i = 1; i < nums.length; i++) {
    // Key decision: extend previous subarray or start fresh?
    // If currentSum is negative, starting fresh with nums[i] is better
    currentSum = Math.max(nums[i], currentSum + nums[i]);

    // Update global maximum if we found a better subarray
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}
```

```java
// Time: O(n) | Space: O(1)
public int maxSubArray(int[] nums) {
    /**
     * Kadane's Algorithm: At each position, decide whether to extend
     * the previous subarray or start a new one from current element.
     */
    // Edge case: empty array (problem guarantees non-empty, but good practice)
    if (nums.length == 0) return 0;

    // Initialize with first element
    int currentSum = nums[0];
    int maxSum = nums[0];

    // Start from second element
    for (int i = 1; i < nums.length; i++) {
        // Key decision: extend previous subarray or start fresh?
        // If currentSum is negative, starting fresh with nums[i] is better
        currentSum = Math.max(nums[i], currentSum + nums[i]);

        // Update global maximum if we found a better subarray
        maxSum = Math.max(maxSum, currentSum);
    }

    return maxSum;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array exactly once
- At each of the n positions, we perform constant-time operations (max comparisons and additions)

**Space Complexity: O(1)**

- We only use a fixed number of variables (current_sum and max_sum)
- No additional data structures that grow with input size

## Common Mistakes

1. **Initializing max_sum to 0 instead of nums[0] or negative infinity**
   - Problem: If all numbers are negative, initializing to 0 will incorrectly return 0 instead of the largest (least negative) number
   - Fix: Initialize with the first element or negative infinity

2. **Forgetting to handle the empty array case**
   - Problem: While the problem states the array is non-empty, in interviews you should still mention edge cases
   - Fix: Add a check at the beginning and return an appropriate value (0 or throw exception)

3. **Confusing when to reset current_sum**
   - Problem: Some candidates reset current_sum whenever they encounter a negative number
   - Fix: Only reset when current_sum + nums[i] < nums[i], which simplifies to current_sum < 0

4. **Trying to track start and end indices unnecessarily**
   - Problem: The problem only asks for the sum, not the subarray itself
   - Fix: Focus on the sum unless explicitly asked for indices

## When You'll See This Pattern

Kadane's Algorithm and its variations appear in many problems involving contiguous subsequences:

1. **Best Time to Buy and Sell Stock (Easy)**
   - Similarity: You're looking for the maximum difference between two points (buy low, sell high)
   - Connection: This is essentially Kadane's Algorithm on the array of price differences

2. **Maximum Product Subarray (Medium)**
   - Similarity: Looking for contiguous subarray with maximum product
   - Connection: Uses a modified Kadane's approach but needs to track both min and max due to negative numbers

3. **Maximum Sum Circular Subarray (Medium)**
   - Similarity: Array is circular (wraps around)
   - Connection: Uses Kadane's Algorithm twice—once for normal case, once for circular case

## Key Takeaways

1. **Kadane's Algorithm is the standard approach** for maximum subarray problems: at each step, decide whether to extend the current subarray or start fresh from the current element.

2. **The core insight is dynamic programming**: The optimal solution at position i depends on the optimal solution at position i-1, but we only need to remember the previous value, not all previous values.

3. **Recognize this pattern when** you need to find an optimal contiguous subsequence and the decision at each position is binary (include or don't include in current sequence).

Related problems: [Best Time to Buy and Sell Stock](/problem/best-time-to-buy-and-sell-stock), [Maximum Product Subarray](/problem/maximum-product-subarray), [Degree of an Array](/problem/degree-of-an-array)
