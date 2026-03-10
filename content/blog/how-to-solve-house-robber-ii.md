---
title: "How to Solve House Robber II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode House Robber II. Medium difficulty, 44.6% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-09-02"
category: "dsa-patterns"
tags: ["house-robber-ii", "array", "dynamic-programming", "medium"]
---

# How to Solve House Robber II

House Robber II is a classic dynamic programming problem that builds on the original House Robber problem with a twist: the houses are arranged in a circle, meaning the first and last houses are adjacent. This constraint prevents us from robbing both the first and last house simultaneously, which fundamentally changes how we approach the problem. The challenge lies in adapting the linear dynamic programming solution to handle this circular constraint efficiently.

## Visual Walkthrough

Let's walk through an example step by step to build intuition. Consider the input `[2, 3, 2]`.

In the original House Robber problem (without the circle), we could rob houses 0 and 2 (2 + 2 = 4) since they're not adjacent. But with the circular arrangement, house 0 and house 2 are now neighbors! This means we can't rob both of them.

Here's how we need to think about it:

1. **Option 1**: Rob houses in the range [0, n-2] (exclude the last house)
   - For `[2, 3, 2]`, this means considering `[2, 3]`
   - Maximum we can rob from `[2, 3]` is max(2, 3) = 3
2. **Option 2**: Rob houses in the range [1, n-1] (exclude the first house)
   - For `[2, 3, 2]`, this means considering `[3, 2]`
   - Maximum we can rob from `[3, 2]` is max(3, 2) = 3

3. **Final answer**: Take the maximum of both options = max(3, 3) = 3

Let's try another example: `[1, 2, 3, 1]`

- **Option 1** (houses 0-2): `[1, 2, 3]` → max = 4 (rob houses 1 and 3)
- **Option 2** (houses 1-3): `[2, 3, 1]` → max = 3 (rob houses 1 and 3)
- **Final answer**: max(4, 3) = 4

The key insight is that the circular constraint forces us to consider two separate linear problems: one without the first house, and one without the last house.

## Brute Force Approach

A naive brute force approach would be to try all possible combinations of houses to rob, checking for the circular constraint. For each house, we have two choices: rob it or skip it. This gives us 2^n possible combinations where n is the number of houses.

For each combination, we would need to:

1. Check that no two adjacent houses are robbed (including the first and last if both are robbed)
2. Calculate the total money from that combination
3. Track the maximum valid total

The brute force code would involve recursion or generating all subsets, but it's clearly inefficient with O(2^n) time complexity. Even for n=20, we'd have over 1 million combinations to check. This approach fails because it doesn't leverage the optimal substructure property of the problem - the fact that the optimal solution to a subproblem can help solve the larger problem.

## Optimized Approach

The key insight is that we can break the circular problem into two linear problems:

1. Rob houses from index 0 to n-2 (excluding the last house)
2. Rob houses from index 1 to n-1 (excluding the first house)

For each linear subproblem, we can use the same dynamic programming approach as the original House Robber problem:

**DP State Definition**:
Let `dp[i]` represent the maximum amount we can rob from the first `i+1` houses (0 to i).

**DP Transition**:
For each house i, we have two choices:

- Rob house i: `nums[i] + dp[i-2]` (can't rob adjacent house i-1)
- Skip house i: `dp[i-1]` (take the best up to house i-1)
  So: `dp[i] = max(nums[i] + dp[i-2], dp[i-1])`

**Base Cases**:

- `dp[0] = nums[0]` (only one house)
- `dp[1] = max(nums[0], nums[1])` (two houses, take the richer one)

We apply this DP approach to both linear subarrays and take the maximum result.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def rob(nums):
    """
    Main function to solve House Robber II.
    Handles the circular constraint by solving two linear subproblems.
    """
    n = len(nums)

    # Edge cases: empty array, single house, or two houses
    if n == 0:
        return 0
    if n == 1:
        return nums[0]
    if n == 2:
        return max(nums[0], nums[1])

    # Helper function to solve the linear House Robber problem
    def rob_linear(houses):
        """
        Solves the original House Robber problem for a linear street.
        Uses constant space by only keeping track of the last two DP states.
        """
        # prev2 represents dp[i-2], prev1 represents dp[i-1]
        prev2, prev1 = 0, 0

        for amount in houses:
            # At each house, we choose between:
            # 1. Robbing this house + best from two houses ago (prev2)
            # 2. Skipping this house, taking best from previous house (prev1)
            current = max(amount + prev2, prev1)

            # Shift the window: prev2 becomes old prev1, prev1 becomes current
            prev2, prev1 = prev1, current

        # After processing all houses, prev1 holds the maximum amount
        return prev1

    # Option 1: Rob houses 0 to n-2 (exclude last house)
    max_without_last = rob_linear(nums[:-1])

    # Option 2: Rob houses 1 to n-1 (exclude first house)
    max_without_first = rob_linear(nums[1:])

    # Take the maximum of both options
    return max(max_without_last, max_without_first)
```

```javascript
// Time: O(n) | Space: O(1)
function rob(nums) {
  /**
   * Main function to solve House Robber II.
   * Handles the circular constraint by solving two linear subproblems.
   */
  const n = nums.length;

  // Edge cases: empty array, single house, or two houses
  if (n === 0) return 0;
  if (n === 1) return nums[0];
  if (n === 2) return Math.max(nums[0], nums[1]);

  // Helper function to solve the linear House Robber problem
  function robLinear(houses) {
    /**
     * Solves the original House Robber problem for a linear street.
     * Uses constant space by only keeping track of the last two DP states.
     */
    // prev2 represents dp[i-2], prev1 represents dp[i-1]
    let prev2 = 0,
      prev1 = 0;

    for (const amount of houses) {
      // At each house, we choose between:
      // 1. Robbing this house + best from two houses ago (prev2)
      // 2. Skipping this house, taking best from previous house (prev1)
      const current = Math.max(amount + prev2, prev1);

      // Shift the window: prev2 becomes old prev1, prev1 becomes current
      prev2 = prev1;
      prev1 = current;
    }

    // After processing all houses, prev1 holds the maximum amount
    return prev1;
  }

  // Option 1: Rob houses 0 to n-2 (exclude last house)
  const maxWithoutLast = robLinear(nums.slice(0, -1));

  // Option 2: Rob houses 1 to n-1 (exclude first house)
  const maxWithoutFirst = robLinear(nums.slice(1));

  // Take the maximum of both options
  return Math.max(maxWithoutLast, maxWithoutFirst);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int rob(int[] nums) {
        /**
         * Main function to solve House Robber II.
         * Handles the circular constraint by solving two linear subproblems.
         */
        int n = nums.length;

        // Edge cases: empty array, single house, or two houses
        if (n == 0) return 0;
        if (n == 1) return nums[0];
        if (n == 2) return Math.max(nums[0], nums[1]);

        // Option 1: Rob houses 0 to n-2 (exclude last house)
        int maxWithoutLast = robLinear(nums, 0, n - 2);

        // Option 2: Rob houses 1 to n-1 (exclude first house)
        int maxWithoutFirst = robLinear(nums, 1, n - 1);

        // Take the maximum of both options
        return Math.max(maxWithoutLast, maxWithoutFirst);
    }

    private int robLinear(int[] nums, int start, int end) {
        /**
         * Solves the original House Robber problem for a linear segment.
         * Uses constant space by only keeping track of the last two DP states.
         *
         * @param nums The array of house values
         * @param start Starting index (inclusive)
         * @param end Ending index (inclusive)
         * @return Maximum amount that can be robbed from this segment
         */
        // prev2 represents dp[i-2], prev1 represents dp[i-1]
        int prev2 = 0, prev1 = 0;

        for (int i = start; i <= end; i++) {
            // At each house, we choose between:
            // 1. Robbing this house + best from two houses ago (prev2)
            // 2. Skipping this house, taking best from previous house (prev1)
            int current = Math.max(nums[i] + prev2, prev1);

            // Shift the window: prev2 becomes old prev1, prev1 becomes current
            prev2 = prev1;
            prev1 = current;
        }

        // After processing all houses, prev1 holds the maximum amount
        return prev1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n)

- We process the array twice: once for houses 0 to n-2, and once for houses 1 to n-1
- Each pass takes O(n) time
- Total time is O(2n) = O(n)

**Space Complexity**: O(1)

- We only use a constant amount of extra space for the DP variables (prev1, prev2, current)
- Even though we create subarrays in Python/JavaScript, we could avoid this by passing indices (as shown in the Java solution)
- The space used is independent of the input size

## Common Mistakes

1. **Forgetting the circular constraint**: The most common mistake is solving it like the original House Robber problem without considering that the first and last houses are adjacent. Always remember to handle the circular nature by considering two cases.

2. **Incorrect base cases for small arrays**: When n=1 or n=2, we need special handling. For n=1, we can only rob that one house. For n=2, we can only rob one of them (the richer one) since they're adjacent in a circle.

3. **Double-counting or missing cases**: Some candidates try to modify the original DP formula to handle the circle directly, which often leads to complex logic errors. The clean approach is to break it into two linear problems.

4. **Inefficient space usage**: While O(n) space is acceptable, the optimal solution uses O(1) space by only keeping track of the last two DP states. Candidates who create full DP arrays waste space unnecessarily.

## When You'll See This Pattern

This problem teaches the important technique of **reducing a constrained problem to multiple unconstrained subproblems**. You'll see similar patterns in:

1. **House Robber (LeetCode 198)**: The foundational problem without the circular constraint. Mastering this first is essential.

2. **Paint House (LeetCode 256)**: Another DP problem where you need to make optimal choices with adjacency constraints, though with multiple color options instead of binary choices.

3. **Maximum Sum Circular Subarray (LeetCode 918)**: Uses a similar technique of considering two cases - one where the maximum subarray doesn't wrap around, and one where it does (by finding the minimum subarray and subtracting from total).

4. **Delete and Earn (LeetCode 740)**: Transforms into a House Robber-like problem after preprocessing, where you can't take adjacent values.

## Key Takeaways

1. **Constraint decomposition**: When faced with a complex constraint (like a circle), break it into simpler cases. Here, we decomposed the circular problem into two linear problems by excluding either the first or last house.

2. **Space optimization in DP**: Many DP problems can be optimized from O(n) to O(1) space by recognizing that you only need the last few states, not the entire DP array.

3. **Think in subproblems**: The core of dynamic programming is identifying optimal substructure. If you can solve smaller versions of the problem optimally, you can build up to the full solution.

Remember: For circular arrangement problems, the trick is often to consider what happens when you include/exclude the boundary elements, then solve the resulting linear problems.

Related problems: [House Robber](/problem/house-robber), [Paint House](/problem/paint-house), [Paint Fence](/problem/paint-fence)
