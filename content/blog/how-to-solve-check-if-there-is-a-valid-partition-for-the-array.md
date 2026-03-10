---
title: "How to Solve Check if There is a Valid Partition For The Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Check if There is a Valid Partition For The Array. Medium difficulty, 52.2% acceptance rate. Topics: Array, Dynamic Programming."
date: "2027-06-15"
category: "dsa-patterns"
tags:
  ["check-if-there-is-a-valid-partition-for-the-array", "array", "dynamic-programming", "medium"]
---

# How to Solve "Check if There is a Valid Partition For The Array"

This problem asks whether we can partition an array into contiguous subarrays where each subarray satisfies one of three specific conditions: containing exactly 2 equal elements, exactly 3 equal elements, or exactly 3 consecutive increasing elements. The challenge lies in determining whether such a partition exists without trying every possible combination, which would be computationally infeasible for larger arrays.

What makes this problem interesting is that it appears to be about partitioning, but it's actually a **dynamic programming** problem in disguise. The constraints on subarrays (2 equal, 3 equal, or 3 consecutive) create overlapping subproblems that we can solve efficiently with memoization or tabulation.

## Visual Walkthrough

Let's trace through the example `nums = [4, 4, 4, 5, 6]` step by step:

We want to check if we can partition this array into valid subarrays. Let's think from left to right:

1. **Starting at index 0**: We have `[4, 4, 4]` which satisfies condition 2 (exactly 3 equal elements)
   - If we take these first 3 elements, we're left with `[5, 6]`
   - `[5, 6]` doesn't satisfy any condition (not equal, not consecutive), so this path fails

2. **Alternative at index 0**: We have `[4, 4]` which satisfies condition 1 (exactly 2 equal elements)
   - If we take these first 2 elements, we're left with `[4, 5, 6]`
   - `[4, 5, 6]` satisfies condition 3 (exactly 3 consecutive increasing elements)
   - This gives us a valid partition: `[4, 4]` + `[4, 5, 6]`

The key insight is that at each position `i`, we need to check if we can form a valid partition starting from `i`. This depends on whether we can form valid partitions starting from `i+2`, `i+3`, etc., creating overlapping subproblems.

## Brute Force Approach

A naive approach would be to try every possible partition point recursively. At each position `i`, we could:

1. Check if `nums[i] == nums[i+1]` and recursively check from `i+2`
2. Check if `nums[i] == nums[i+1] == nums[i+2]` and recursively check from `i+3`
3. Check if `nums[i] + 1 == nums[i+1]` and `nums[i+1] + 1 == nums[i+2]` and recursively check from `i+3`

This leads to exponential time complexity O(3^n) because at each step we might explore up to 3 branches. For an array of length 1000, this would be completely infeasible (3¹⁰⁰⁰ operations).

The brute force fails because it repeatedly solves the same subproblems. For example, whether we can partition starting from index 5 might be checked many times from different paths.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem. We can define `dp[i]` as a boolean indicating whether we can form a valid partition starting from index `i` to the end of the array.

**Recurrence relation:**

- `dp[i]` is true if ANY of these are true:
  1. `nums[i] == nums[i+1]` AND `dp[i+2]` is true
  2. `nums[i] == nums[i+1] == nums[i+2]` AND `dp[i+3]` is true
  3. `nums[i] + 1 == nums[i+1]` AND `nums[i+1] + 1 == nums[i+2]` AND `dp[i+3]` is true

**Base cases:**

- `dp[n] = true` (empty array is trivially partitionable)
- `dp[n-1] = false` (single element can't form any valid subarray)

We can solve this either with **memoization** (top-down) or **tabulation** (bottom-up). The bottom-up approach is often preferred in interviews because it's more intuitive and avoids recursion depth issues.

## Optimal Solution

Here's the complete solution using dynamic programming with tabulation:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def validPartition(nums):
    """
    Determines if the array can be partitioned into valid subarrays.
    Valid subarrays are: 2 equal elements, 3 equal elements, or 3 consecutive elements.
    """
    n = len(nums)

    # dp[i] represents whether we can form a valid partition from index i to the end
    # We need n+1 because we want dp[n] = True (empty array case)
    dp = [False] * (n + 1)
    dp[n] = True  # Base case: empty array is valid

    # Process from right to left
    for i in range(n - 1, -1, -1):
        # Check condition 1: exactly 2 equal elements
        if i + 1 < n and nums[i] == nums[i + 1]:
            dp[i] = dp[i] or dp[i + 2]

        # Check condition 2: exactly 3 equal elements
        if i + 2 < n and nums[i] == nums[i + 1] == nums[i + 2]:
            dp[i] = dp[i] or dp[i + 3]

        # Check condition 3: exactly 3 consecutive increasing elements
        if i + 2 < n and nums[i] + 1 == nums[i + 1] and nums[i + 1] + 1 == nums[i + 2]:
            dp[i] = dp[i] or dp[i + 3]

    # dp[0] tells us if we can partition the entire array
    return dp[0]
```

```javascript
// Time: O(n) | Space: O(n)
function validPartition(nums) {
  const n = nums.length;

  // dp[i] represents whether we can form a valid partition from index i to the end
  // We need n+1 because we want dp[n] = true (empty array case)
  const dp = new Array(n + 1).fill(false);
  dp[n] = true; // Base case: empty array is valid

  // Process from right to left
  for (let i = n - 1; i >= 0; i--) {
    // Check condition 1: exactly 2 equal elements
    if (i + 1 < n && nums[i] === nums[i + 1]) {
      dp[i] = dp[i] || dp[i + 2];
    }

    // Check condition 2: exactly 3 equal elements
    if (i + 2 < n && nums[i] === nums[i + 1] && nums[i] === nums[i + 2]) {
      dp[i] = dp[i] || dp[i + 3];
    }

    // Check condition 3: exactly 3 consecutive increasing elements
    if (i + 2 < n && nums[i] + 1 === nums[i + 1] && nums[i + 1] + 1 === nums[i + 2]) {
      dp[i] = dp[i] || dp[i + 3];
    }
  }

  // dp[0] tells us if we can partition the entire array
  return dp[0];
}
```

```java
// Time: O(n) | Space: O(n)
public boolean validPartition(int[] nums) {
    int n = nums.length;

    // dp[i] represents whether we can form a valid partition from index i to the end
    // We need n+1 because we want dp[n] = true (empty array case)
    boolean[] dp = new boolean[n + 1];
    dp[n] = true;  // Base case: empty array is valid

    // Process from right to left
    for (int i = n - 1; i >= 0; i--) {
        // Check condition 1: exactly 2 equal elements
        if (i + 1 < n && nums[i] == nums[i + 1]) {
            dp[i] = dp[i] || dp[i + 2];
        }

        // Check condition 2: exactly 3 equal elements
        if (i + 2 < n && nums[i] == nums[i + 1] && nums[i] == nums[i + 2]) {
            dp[i] = dp[i] || dp[i + 3];
        }

        // Check condition 3: exactly 3 consecutive increasing elements
        if (i + 2 < n && nums[i] + 1 == nums[i + 1] && nums[i + 1] + 1 == nums[i + 2]) {
            dp[i] = dp[i] || dp[i + 3];
        }
    }

    // dp[0] tells us if we can partition the entire array
    return dp[0];
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once from right to left (n iterations)
- At each position, we perform at most 3 constant-time checks and boolean operations
- Total operations: O(3n) = O(n)

**Space Complexity: O(n)**

- We maintain a DP array of size n+1
- This could be optimized to O(1) by only keeping the last 3 DP values since we only look ahead 2-3 indices, but the O(n) solution is usually acceptable in interviews

## Common Mistakes

1. **Off-by-one errors in array bounds checking**: When checking `nums[i] == nums[i+1] == nums[i+2]`, forgetting to verify that `i+2 < n` leads to index out of bounds errors. Always check array bounds before accessing elements.

2. **Incorrect base case**: Setting `dp[n-1] = true` instead of `dp[n] = true`. The empty array (position n) is trivially partitionable, but a single element at position n-1 cannot form any valid subarray.

3. **Wrong direction of DP iteration**: Processing from left to right instead of right to left. We need to know if the "rest of the array" can be partitioned, which requires knowing results for later indices first.

4. **Missing OR conditions**: Using `dp[i] = dp[i+2]` instead of `dp[i] = dp[i] or dp[i+2]`. A position might be reachable via multiple valid subarrays, so we need to OR the possibilities together.

## When You'll See This Pattern

This problem uses a classic **"partition DP"** pattern that appears in many problems:

1. **Decode Ways (LeetCode 91)**: Similar structure where you check if 1 or 2 characters can form a valid letter, and DP[i] depends on DP[i+1] and DP[i+2].

2. **Word Break (LeetCode 139)**: Check if a string can be segmented into dictionary words, where DP[i] depends on whether there's a word ending at position i and DP[j] for some j < i.

3. **Perfect Squares (LeetCode 279)**: Find the minimum number of perfect squares that sum to n, where DP[i] depends on DP[i - j*j] for various j.

The common pattern is: "Can the array/string be broken into valid segments?" with the solution involving checking prefixes/suffixes and using DP to avoid recomputation.

## Key Takeaways

1. **Partition problems are often DP problems**: When you need to determine if a sequence can be broken into valid segments, think about whether the validity of the whole depends on the validity of suffixes/prefixes.

2. **Right-to-left DP is natural for suffix problems**: When your recurrence depends on "the rest of the array," process from the end backward so you have computed the needed future values.

3. **Three conditions create three transition rules**: Each valid subarray type becomes a potential transition in the DP recurrence. Always check array bounds for each condition separately.

Related problems: [Count the Number of Good Partitions](/problem/count-the-number-of-good-partitions)
