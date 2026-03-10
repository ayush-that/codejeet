---
title: "How to Solve House Robber — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode House Robber. Medium difficulty, 52.9% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-03-18"
category: "dsa-patterns"
tags: ["house-robber", "array", "dynamic-programming", "medium"]
---

# How to Solve House Robber

You're a robber deciding which houses to rob along a street. Each house has money, but robbing adjacent houses triggers an alarm. The challenge is to maximize your loot without robbing neighboring houses. This problem is interesting because it's a classic introduction to dynamic programming — you need to make optimal decisions at each house based on previous choices, and the constraint about adjacent houses creates a dependency between decisions.

## Visual Walkthrough

Let's trace through the example `[2, 7, 9, 3, 1]` step by step:

**House 0:** Only $2 available. Best we can do is rob it → $2

**House 1:** We have two choices:

- Rob house 1 ($7) and skip house 0 → $7
- Skip house 1 and keep house 0's loot → $2
  Best choice: Rob house 1 → $7

**House 2:** Again, two choices:

- Rob house 2 ($9) plus best loot from house 0 → $9 + $2 = $11
- Skip house 2 and keep best loot from house 1 → $7
  Best choice: Rob house 2 → $11

**House 3:** Choices:

- Rob house 3 ($3) plus best loot from house 1 → $3 + $7 = $10
- Skip house 3 and keep best loot from house 2 → $11
  Best choice: Skip house 3 → $11

**House 4:** Choices:

- Rob house 4 ($1) plus best loot from house 2 → $1 + $11 = $12
- Skip house 4 and keep best loot from house 3 → $11
  Best choice: Rob house 4 → $12

Final maximum: $12 (robbing houses 0, 2, and 4)

Notice the pattern: At each house `i`, the maximum loot is either:

1. Rob current house + maximum loot from `i-2`
2. Skip current house + maximum loot from `i-1`

## Brute Force Approach

A naive approach would be to try all possible combinations of houses that don't include adjacent ones. For each house, we have two choices: rob or skip. This leads to a recursive solution where we explore both possibilities at each step.

The brute force would look like this: For house `i`, we recursively compute:

- Option 1: Rob house `i` + best from starting at `i+2`
- Option 2: Skip house `i` + best from starting at `i+1`

The problem? This has exponential time complexity O(2ⁿ) because we're recomputing the same subproblems over and over. For example, when we skip house 0 and rob house 2, we'll compute the optimal solution for houses 3 onward multiple times. With just 30 houses, we'd have over 1 billion computations!

## Optimized Approach

The key insight is that we can use **dynamic programming** to avoid recomputing solutions. We store the maximum loot achievable up to each house in an array `dp`, where `dp[i]` represents the maximum loot we can get from the first `i+1` houses (houses 0 through i).

The recurrence relation is:

```
dp[i] = max(dp[i-1],            // Skip current house
            nums[i] + dp[i-2])  // Rob current house
```

But wait — we only need the last two values to compute the current one! We don't need to store the entire `dp` array. We can optimize space by keeping just two variables:

- `prev1`: Maximum loot up to the previous house (i-1)
- `prev2`: Maximum loot up to two houses back (i-2)

This gives us O(n) time and O(1) space — optimal for this problem.

## Optimal Solution

Here's the optimized dynamic programming solution with constant space:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def rob(nums):
    """
    Calculate the maximum amount of money you can rob without alerting police.

    Args:
        nums: List of non-negative integers representing money in each house

    Returns:
        Maximum amount that can be robbed
    """
    # Edge case: empty list
    if not nums:
        return 0

    # Initialize prev2 and prev1
    # prev2 represents max loot from houses up to i-2
    # prev1 represents max loot from houses up to i-1
    prev2 = 0  # For i = -1 (no houses)
    prev1 = 0  # For i = 0 initially, will be updated

    for i in range(len(nums)):
        # At each house, we have two choices:
        # 1. Rob current house: nums[i] + prev2 (since we can't rob i-1)
        # 2. Skip current house: prev1 (carry forward previous max)
        current = max(prev1, nums[i] + prev2)

        # Shift values for next iteration
        prev2 = prev1  # Current prev1 becomes prev2 for next house
        prev1 = current  # Current max becomes prev1 for next house

    # After loop, prev1 holds the maximum for all houses
    return prev1
```

```javascript
// Time: O(n) | Space: O(1)
function rob(nums) {
  /**
   * Calculate the maximum amount of money you can rob without alerting police.
   *
   * @param {number[]} nums - Array of non-negative integers representing money in each house
   * @return {number} Maximum amount that can be robbed
   */

  // Edge case: empty array
  if (nums.length === 0) {
    return 0;
  }

  // Initialize prev2 and prev1
  // prev2 represents max loot from houses up to i-2
  // prev1 represents max loot from houses up to i-1
  let prev2 = 0; // For i = -1 (no houses)
  let prev1 = 0; // For i = 0 initially, will be updated

  for (let i = 0; i < nums.length; i++) {
    // At each house, we have two choices:
    // 1. Rob current house: nums[i] + prev2 (since we can't rob i-1)
    // 2. Skip current house: prev1 (carry forward previous max)
    const current = Math.max(prev1, nums[i] + prev2);

    // Shift values for next iteration
    prev2 = prev1; // Current prev1 becomes prev2 for next house
    prev1 = current; // Current max becomes prev1 for next house
  }

  // After loop, prev1 holds the maximum for all houses
  return prev1;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int rob(int[] nums) {
        /**
         * Calculate the maximum amount of money you can rob without alerting police.
         *
         * @param nums Array of non-negative integers representing money in each house
         * @return Maximum amount that can be robbed
         */

        // Edge case: empty array
        if (nums.length == 0) {
            return 0;
        }

        // Initialize prev2 and prev1
        // prev2 represents max loot from houses up to i-2
        // prev1 represents max loot from houses up to i-1
        int prev2 = 0;  // For i = -1 (no houses)
        int prev1 = 0;  // For i = 0 initially, will be updated

        for (int i = 0; i < nums.length; i++) {
            // At each house, we have two choices:
            // 1. Rob current house: nums[i] + prev2 (since we can't rob i-1)
            // 2. Skip current house: prev1 (carry forward previous max)
            int current = Math.max(prev1, nums[i] + prev2);

            // Shift values for next iteration
            prev2 = prev1;  // Current prev1 becomes prev2 for next house
            prev1 = current;  // Current max becomes prev1 for next house
        }

        // After loop, prev1 holds the maximum for all houses
        return prev1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We iterate through the array once, performing constant-time operations at each house. Each house requires exactly one comparison and a couple of assignments.

**Space Complexity:** O(1)  
We only use three variables (`prev1`, `prev2`, and `current`), regardless of input size. This is the space-optimized version. The non-optimized DP approach would use O(n) space for the `dp` array.

## Common Mistakes

1. **Forgetting the empty array case:** Always check if `nums` is empty. If you try to access `nums[0]` without checking, you'll get an index error.

2. **Incorrect initialization of DP array:** In the non-optimized version, `dp[0]` should be `nums[0]` and `dp[1]` should be `max(nums[0], nums[1])`. A common mistake is setting `dp[1] = nums[1]`, which doesn't account for the possibility that robbing house 0 might be better.

3. **Off-by-one errors in the loop:** When using the optimized two-variable approach, it's easy to get confused about which variable represents what. Remember: `prev1` is the max up to the previous house, `prev2` is the max up to two houses back.

4. **Not considering negative numbers:** The problem states houses have non-negative amounts, but some candidates try to handle negatives. This adds unnecessary complexity — stick to the problem constraints.

## When You'll See This Pattern

This "take or skip" pattern with adjacency constraints appears in many DP problems:

1. **House Robber II** (LeetCode 213): The same problem but with houses arranged in a circle. The solution involves running the House Robber algorithm twice: once excluding the first house, once excluding the last house.

2. **Maximum Product Subarray** (LeetCode 152): Similar "keep track of previous best" approach, but you need to track both maximum and minimum because of negative numbers.

3. **Paint House** (LeetCode 256): At each house, you choose a color different from the previous house to minimize cost. The DP state tracks minimum cost for each ending color.

4. **Climbing Stairs** (LeetCode 70): Simpler version where you count ways to reach the top — the recurrence is `dp[i] = dp[i-1] + dp[i-2]`.

## Key Takeaways

1. **Recognize the "take or skip" pattern:** When you have a sequence of items and need to make binary decisions (take/not take) with constraints on adjacent choices, dynamic programming is likely the solution.

2. **Space optimization is often possible:** If your recurrence only depends on the last 1-2 states, you can reduce space from O(n) to O(1) by keeping just those variables.

3. **Start with the recurrence relation:** Before writing code, define what `dp[i]` represents and how to compute it from previous states. This clarifies your thinking and helps avoid implementation errors.

Related problems: [Maximum Product Subarray](/problem/maximum-product-subarray), [House Robber II](/problem/house-robber-ii), [Paint House](/problem/paint-house)
