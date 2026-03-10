---
title: "How to Solve Maximum Subarray Sum with One Deletion — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Subarray Sum with One Deletion. Medium difficulty, 46.8% acceptance rate. Topics: Array, Dynamic Programming."
date: "2027-12-15"
category: "dsa-patterns"
tags: ["maximum-subarray-sum-with-one-deletion", "array", "dynamic-programming", "medium"]
---

# How to Solve Maximum Subarray Sum with One Deletion

This problem asks us to find the maximum sum of a non-empty contiguous subarray where we're allowed to delete at most one element. What makes this tricky is that we need to consider two scenarios simultaneously: subarrays where we don't delete any elements (standard maximum subarray problem) and subarrays where we delete exactly one element. The challenge is finding an efficient way to track both possibilities without checking every possible deletion.

## Visual Walkthrough

Let's trace through the example `[1, -2, 0, 3]` step by step:

**Without deletions:**

- Subarray `[1]`: sum = 1
- Subarray `[1, -2]`: sum = -1
- Subarray `[1, -2, 0]`: sum = -1
- Subarray `[1, -2, 0, 3]`: sum = 2
- Subarray `[-2]`: sum = -2
- Subarray `[-2, 0]`: sum = -2
- Subarray `[-2, 0, 3]`: sum = 1
- Subarray `[0]`: sum = 0
- Subarray `[0, 3]`: sum = 3
- Subarray `[3]`: sum = 3

Maximum without deletion: 3 (from `[0, 3]` or `[3]`)

**With one deletion:**

- Delete -2 from `[1, -2, 0, 3]`: `[1, 0, 3]` sum = 4
- Delete 0 from `[1, -2, 0, 3]`: `[1, -2, 3]` sum = 2
- Delete 3 from `[1, -2, 0, 3]`: `[1, -2, 0]` sum = -1
- Delete -2 from `[-2, 0, 3]`: `[0, 3]` sum = 3
- Delete 0 from `[-2, 0, 3]`: `[-2, 3]` sum = 1
- Delete 3 from `[-2, 0, 3]`: `[-2, 0]` sum = -2

Maximum with deletion: 4 (from `[1, 0, 3]`)

Final answer: max(3, 4) = 4

The key insight is that when we delete an element at index `i`, we're essentially connecting the maximum subarray ending at `i-1` with the maximum subarray starting at `i+1`.

## Brute Force Approach

The brute force approach would check every possible subarray and for each subarray, try deleting every element:

1. For each starting index `i` from 0 to n-1
2. For each ending index `j` from i to n-1
3. For each deletion index `k` from i to j (or no deletion)
4. Calculate the sum of the subarray with element at index `k` removed

This gives us O(n³) time complexity since we have three nested loops. For an array of size 1000, this would be 1 billion operations - far too slow.

Even a slightly better brute force that precomputes prefix sums would still be O(n²) since we'd need to check all O(n²) subarrays and for each, try O(n) possible deletions.

## Optimized Approach

The optimal solution uses dynamic programming with two passes. The key insight is that for any position `i`, the maximum sum ending at `i` with at most one deletion can be derived from:

1. The maximum sum ending at `i-1` with no deletions (extend the subarray)
2. The maximum sum ending at `i-1` with one deletion (extend the subarray)
3. Start a new subarray at `i`

More formally, we maintain two DP arrays:

- `noDelete[i]`: maximum sum of subarray ending at `i` with no deletions
- `oneDelete[i]`: maximum sum of subarray ending at `i` with exactly one deletion

The recurrence relations are:

- `noDelete[i] = max(nums[i], noDelete[i-1] + nums[i])` (standard Kadane's algorithm)
- `oneDelete[i] = max(noDelete[i-1], oneDelete[i-1] + nums[i])`
  - Either delete the current element (take `noDelete[i-1]` and don't add `nums[i]`)
  - Or we already deleted an element earlier (take `oneDelete[i-1] + nums[i]`)

We also need to consider starting a new subarray after a deletion, which is handled by the `max(nums[i], ...)` in the `noDelete` recurrence.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) (can be optimized to O(1))
def maximumSum(self, arr):
    """
    Returns the maximum sum of a non-empty subarray with at most one deletion.

    Args:
        arr: List[int] - Input array of integers

    Returns:
        int - Maximum sum achievable
    """
    n = len(arr)

    # Edge case: array must be non-empty by problem definition
    if n == 0:
        return 0

    # DP arrays:
    # no_delete[i] = max sum ending at i with no deletions
    # one_delete[i] = max sum ending at i with exactly one deletion
    no_delete = [0] * n
    one_delete = [0] * n

    # Initialize first element
    no_delete[0] = arr[0]  # Only option is to take the first element
    one_delete[0] = arr[0]  # Can't delete only element and have non-empty subarray

    # Track overall maximum
    max_sum = arr[0]

    for i in range(1, n):
        # Standard Kadane's algorithm: either extend previous subarray or start new
        no_delete[i] = max(arr[i], no_delete[i-1] + arr[i])

        # For one deletion ending at i:
        # Option 1: Delete current element (take no_delete[i-1] without adding arr[i])
        # Option 2: Already deleted earlier (extend one_delete[i-1] with arr[i])
        one_delete[i] = max(no_delete[i-1], one_delete[i-1] + arr[i])

        # Update overall maximum considering both possibilities
        max_sum = max(max_sum, no_delete[i], one_delete[i])

    return max_sum
```

```javascript
// Time: O(n) | Space: O(n) (can be optimized to O(1))
/**
 * Returns the maximum sum of a non-empty subarray with at most one deletion.
 *
 * @param {number[]} arr - Input array of integers
 * @return {number} - Maximum sum achievable
 */
var maximumSum = function (arr) {
  const n = arr.length;

  // Edge case: array must be non-empty by problem definition
  if (n === 0) return 0;

  // DP arrays:
  // noDelete[i] = max sum ending at i with no deletions
  // oneDelete[i] = max sum ending at i with exactly one deletion
  const noDelete = new Array(n);
  const oneDelete = new Array(n);

  // Initialize first element
  noDelete[0] = arr[0]; // Only option is to take the first element
  oneDelete[0] = arr[0]; // Can't delete only element and have non-empty subarray

  // Track overall maximum
  let maxSum = arr[0];

  for (let i = 1; i < n; i++) {
    // Standard Kadane's algorithm: either extend previous subarray or start new
    noDelete[i] = Math.max(arr[i], noDelete[i - 1] + arr[i]);

    // For one deletion ending at i:
    // Option 1: Delete current element (take noDelete[i-1] without adding arr[i])
    // Option 2: Already deleted earlier (extend oneDelete[i-1] with arr[i])
    oneDelete[i] = Math.max(noDelete[i - 1], oneDelete[i - 1] + arr[i]);

    // Update overall maximum considering both possibilities
    maxSum = Math.max(maxSum, noDelete[i], oneDelete[i]);
  }

  return maxSum;
};
```

```java
// Time: O(n) | Space: O(n) (can be optimized to O(1))
class Solution {
    /**
     * Returns the maximum sum of a non-empty subarray with at most one deletion.
     *
     * @param arr - Input array of integers
     * @return - Maximum sum achievable
     */
    public int maximumSum(int[] arr) {
        int n = arr.length;

        // Edge case: array must be non-empty by problem definition
        if (n == 0) return 0;

        // DP arrays:
        // noDelete[i] = max sum ending at i with no deletions
        // oneDelete[i] = max sum ending at i with exactly one deletion
        int[] noDelete = new int[n];
        int[] oneDelete = new int[n];

        // Initialize first element
        noDelete[0] = arr[0];  // Only option is to take the first element
        oneDelete[0] = arr[0]; // Can't delete only element and have non-empty subarray

        // Track overall maximum
        int maxSum = arr[0];

        for (int i = 1; i < n; i++) {
            // Standard Kadane's algorithm: either extend previous subarray or start new
            noDelete[i] = Math.max(arr[i], noDelete[i-1] + arr[i]);

            // For one deletion ending at i:
            // Option 1: Delete current element (take noDelete[i-1] without adding arr[i])
            // Option 2: Already deleted earlier (extend oneDelete[i-1] with arr[i])
            oneDelete[i] = Math.max(noDelete[i-1], oneDelete[i-1] + arr[i]);

            // Update overall maximum considering both possibilities
            maxSum = Math.max(maxSum, Math.max(noDelete[i], oneDelete[i]));
        }

        return maxSum;
    }
}
```

</div>

**Space Optimization:** The above solutions use O(n) space, but we can optimize to O(1) space by only storing the previous values instead of the entire arrays:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maximumSum(self, arr):
    n = len(arr)
    if n == 0:
        return 0

    # Track previous values instead of entire arrays
    no_delete_prev = arr[0]
    one_delete_prev = arr[0]
    max_sum = arr[0]

    for i in range(1, n):
        # Calculate current values
        no_delete_curr = max(arr[i], no_delete_prev + arr[i])
        one_delete_curr = max(no_delete_prev, one_delete_prev + arr[i])

        # Update maximum
        max_sum = max(max_sum, no_delete_curr, one_delete_curr)

        # Update previous values for next iteration
        no_delete_prev = no_delete_curr
        one_delete_prev = one_delete_curr

    return max_sum
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the array, performing constant work at each position
- Each iteration involves a few comparisons and arithmetic operations

**Space Complexity:** O(n) for the basic DP solution, O(1) for the optimized version

- The basic solution stores two arrays of size n
- The optimized version only needs to store the previous values and current maximum

## Common Mistakes

1. **Forgetting that the subarray must be non-empty after deletion**: Some candidates might allow deleting the only element, resulting in an empty subarray. The initialization `one_delete[0] = arr[0]` handles this by treating the single element as both with and without deletion.

2. **Incorrect recurrence for oneDelete[i]**: A common mistake is `oneDelete[i] = max(noDelete[i-1], oneDelete[i-1] + arr[i], arr[i])`. The third term `arr[i]` is unnecessary because starting a new subarray at `i` after a deletion is equivalent to deleting the current element from a single-element subarray, which is covered by `noDelete[i-1]` when `i-1` doesn't exist (handled by base case).

3. **Not considering negative numbers properly**: With negative numbers, `max(arr[i], noDelete[i-1] + arr[i])` correctly handles when it's better to start a new subarray. Some candidates might incorrectly use `max(0, noDelete[i-1]) + arr[i]` which fails for all-negative arrays.

4. **Off-by-one errors in space-optimized version**: When updating `no_delete_prev` and `one_delete_prev`, they must be updated after calculating `max_sum`, not before. Otherwise, you'd be using the wrong previous values.

## When You'll See This Pattern

This problem combines two classic patterns:

1. **Kadane's Algorithm (Maximum Subarray)**: The `noDelete` array follows the standard Kadane's algorithm for finding maximum subarray sum. Problems like "Maximum Subarray" (LeetCode 53) and "Best Time to Buy and Sell Stock" (LeetCode 121) use similar techniques.

2. **DP with State Transitions**: The two-state DP (no deletion vs. one deletion) appears in problems where you have limited "actions" or "exceptions". Similar patterns appear in:
   - "Best Time to Buy and Sell Stock with Cooldown" (LeetCode 309) - states for holding, not holding, cooldown
   - "House Robber" (LeetCode 198) and "House Robber II" (LeetCode 213) - states for robbing or not robbing
   - "Maximum Product Subarray" (LeetCode 152) - states for tracking max and min products

## Key Takeaways

1. **When you need to track "with/without" some operation, use multiple DP states**: This problem teaches us to maintain separate states for different scenarios (no deletion vs. one deletion). Each state has its own transition rules.

2. **Kadane's algorithm is the foundation for subarray sum problems**: Most subarray sum problems build upon the basic Kadane's algorithm pattern of `max(current, previous + current)`.

3. **Space optimization is often possible**: Even with multiple states, we usually only need the previous values, not the entire history. This reduces space from O(n) to O(1).

Related problems: [Maximize Subarray Sum After Removing All Occurrences of One Element](/problem/maximize-subarray-sum-after-removing-all-occurrences-of-one-element), [Maximum Unique Subarray Sum After Deletion](/problem/maximum-unique-subarray-sum-after-deletion)
