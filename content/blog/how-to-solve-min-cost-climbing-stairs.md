---
title: "How to Solve Min Cost Climbing Stairs — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Min Cost Climbing Stairs. Easy difficulty, 68.0% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-06-21"
category: "dsa-patterns"
tags: ["min-cost-climbing-stairs", "array", "dynamic-programming", "easy"]
---

# How to Solve Min Cost Climbing Stairs

This problem asks you to find the minimum cost to reach the top of a staircase where each step has an associated cost, and you can climb either one or two steps at a time. The twist is that you can start from either step 0 or step 1, which means the optimal path might not begin at the very first step. What makes this problem interesting is that it's a classic dynamic programming problem disguised as a simple array problem—the optimal solution at each step depends on the optimal solutions of previous steps.

## Visual Walkthrough

Let's trace through an example: `cost = [10, 15, 20]`

We need to reach the top, which is **one step beyond the last step** (index 3 in this case, since steps are 0, 1, 2).

**Step-by-step reasoning:**

1. We can start at step 0 (cost 10) or step 1 (cost 15)
2. If we start at step 0:
   - Pay 10, then can go to step 1 or step 2
   - Best from step 0: min(cost[0] + cost[1], cost[0] + cost[2]) = min(25, 30) = 25
   - But wait—this isn't right! We need to think recursively: the cost to reach step i depends on the minimum cost to reach step i-1 or i-2

Let's think differently: Let `dp[i]` be the minimum cost to reach step i.

- `dp[0] = cost[0]` (if we start here)
- `dp[1] = cost[1]` (if we start here)
- But actually, we need to reach the top, which is beyond the last step. So for step i, the cost is `cost[i] + min(dp[i-1], dp[i-2])`

Better approach: Let `dp[i]` be the minimum cost to **reach step i** (and pay cost[i] when standing on it).

For `cost = [10, 15, 20]`:

- `dp[0] = 10` (must pay 10 to stand on step 0)
- `dp[1] = 15` (must pay 15 to stand on step 1)
- `dp[2] = min(dp[0], dp[1]) + cost[2] = min(10, 15) + 20 = 10 + 20 = 30`

But we need to reach the top (beyond step 2). The top can be reached from step 1 (one step) or step 2 (one step). So:

- From step 1: cost = dp[1] = 15
- From step 2: cost = dp[2] = 30
- Minimum = min(15, 30) = 15

So the minimum cost is 15: start at step 1 (pay 15), then take one step to the top.

## Brute Force Approach

A brute force solution would try all possible paths from both starting points. For each step, we have two choices: climb 1 step or 2 steps. This creates a binary decision tree with exponential time complexity O(2^n).

The recursive brute force would look like:

```python
def minCostClimbingStairs(cost):
    n = len(cost)

    def dfs(i):
        if i >= n:
            return 0
        return cost[i] + min(dfs(i + 1), dfs(i + 2))

    return min(dfs(0), dfs(1))
```

This solution is correct but extremely inefficient. For n=30, we'd have over 1 billion recursive calls! The problem is we're recomputing the same subproblems over and over. For example, `dfs(2)` gets called from both `dfs(0)` and `dfs(1)`.

## Optimal Solution

The optimal solution uses dynamic programming to avoid redundant calculations. We can solve this with either a bottom-up iterative approach or top-down with memoization. The iterative approach is more space-efficient.

The key insight: The minimum cost to reach step i is `cost[i] + min(dp[i-1], dp[i-2])`. We need to reach the top, which is one step beyond the last step, so the answer is `min(dp[n-1], dp[n-2])`.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for dp array, O(1) with optimization
def minCostClimbingStairs(cost):
    """
    Calculate minimum cost to reach the top of the staircase.

    Args:
        cost: List of integers where cost[i] is cost of ith step

    Returns:
        Minimum cost to reach the top
    """
    n = len(cost)

    # Handle edge cases
    if n == 0:
        return 0
    if n == 1:
        return cost[0]

    # dp[i] represents minimum cost to reach step i
    dp = [0] * n

    # Base cases: cost to reach first two steps
    dp[0] = cost[0]  # If we start at step 0
    dp[1] = cost[1]  # If we start at step 1

    # Fill dp array from step 2 to n-1
    for i in range(2, n):
        # To reach step i, we come from either i-1 or i-2
        # We pay cost[i] when we land on step i
        dp[i] = cost[i] + min(dp[i-1], dp[i-2])

    # We can reach the top from either last step or second last step
    # The top is one step beyond the last step, so we don't pay additional cost
    return min(dp[n-1], dp[n-2])


# Space-optimized version (O(1) space)
def minCostClimbingStairs_optimized(cost):
    """
    Optimized version using only two variables instead of full dp array.
    """
    n = len(cost)

    if n == 0:
        return 0
    if n == 1:
        return cost[0]

    # Track only the last two costs instead of entire array
    prev2 = cost[0]  # dp[i-2]
    prev1 = cost[1]  # dp[i-1]

    for i in range(2, n):
        # Current cost = cost[i] + min(previous two costs)
        current = cost[i] + min(prev1, prev2)

        # Shift variables for next iteration
        prev2, prev1 = prev1, current

    # Final answer: min of last two computed values
    return min(prev1, prev2)
```

```javascript
// Time: O(n) | Space: O(n) for dp array, O(1) with optimization
/**
 * Calculate minimum cost to reach the top of the staircase.
 * @param {number[]} cost - Array where cost[i] is cost of ith step
 * @return {number} Minimum cost to reach the top
 */
function minCostClimbingStairs(cost) {
  const n = cost.length;

  // Handle edge cases
  if (n === 0) return 0;
  if (n === 1) return cost[0];

  // dp[i] represents minimum cost to reach step i
  const dp = new Array(n);

  // Base cases
  dp[0] = cost[0]; // Cost to reach step 0
  dp[1] = cost[1]; // Cost to reach step 1

  // Fill dp array
  for (let i = 2; i < n; i++) {
    // Minimum cost to reach step i is cost[i] plus
    // minimum of reaching previous two steps
    dp[i] = cost[i] + Math.min(dp[i - 1], dp[i - 2]);
  }

  // Reach top from either last or second last step
  return Math.min(dp[n - 1], dp[n - 2]);
}

// Space-optimized version (O(1) space)
function minCostClimbingStairsOptimized(cost) {
  const n = cost.length;

  if (n === 0) return 0;
  if (n === 1) return cost[0];

  // Track only last two values
  let prev2 = cost[0]; // dp[i-2]
  let prev1 = cost[1]; // dp[i-1]

  for (let i = 2; i < n; i++) {
    // Calculate current minimum cost
    const current = cost[i] + Math.min(prev1, prev2);

    // Update for next iteration
    prev2 = prev1;
    prev1 = current;
  }

  return Math.min(prev1, prev2);
}
```

```java
// Time: O(n) | Space: O(n) for dp array, O(1) with optimization
class Solution {
    /**
     * Calculate minimum cost to reach the top of the staircase.
     * @param cost Array where cost[i] is cost of ith step
     * @return Minimum cost to reach the top
     */
    public int minCostClimbingStairs(int[] cost) {
        int n = cost.length;

        // Handle edge cases
        if (n == 0) return 0;
        if (n == 1) return cost[0];

        // dp[i] represents minimum cost to reach step i
        int[] dp = new int[n];

        // Base cases
        dp[0] = cost[0];  // Cost to reach step 0
        dp[1] = cost[1];  // Cost to reach step 1

        // Fill dp array
        for (int i = 2; i < n; i++) {
            // Minimum cost to reach step i is cost[i] plus
            // minimum of reaching previous two steps
            dp[i] = cost[i] + Math.min(dp[i-1], dp[i-2]);
        }

        // Reach top from either last or second last step
        return Math.min(dp[n-1], dp[n-2]);
    }

    // Space-optimized version (O(1) space)
    public int minCostClimbingStairsOptimized(int[] cost) {
        int n = cost.length;

        if (n == 0) return 0;
        if (n == 1) return cost[0];

        // Track only last two values
        int prev2 = cost[0];  // dp[i-2]
        int prev1 = cost[1];  // dp[i-1]

        for (int i = 2; i < n; i++) {
            // Calculate current minimum cost
            int current = cost[i] + Math.min(prev1, prev2);

            // Update for next iteration
            prev2 = prev1;
            prev1 = current;
        }

        return Math.min(prev1, prev2);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the cost array once, performing constant-time operations at each step.
- The loop runs n-2 times (from i=2 to n-1), which is O(n).

**Space Complexity:**

- **DP array approach:** O(n) for storing the dp array
- **Optimized approach:** O(1) since we only store the last two values (prev1 and prev2)

The space-optimized version is preferred in interviews as it shows you understand that you only need the previous two values, not the entire history.

## Common Mistakes

1. **Off-by-one errors with the "top" position:** Many candidates forget that the top is one step beyond the last step. They might return `dp[n-1]` instead of `min(dp[n-1], dp[n-2])`. Remember: you can reach the top from either the last step or the second-to-last step.

2. **Incorrect base cases:** For n=1, the answer should be `cost[0]` (you start at step 0 and immediately reach the top). For n=2, the answer should be `min(cost[0], cost[1])`. Always test these edge cases.

3. **Starting cost calculation:** Some candidates initialize `dp[0] = 0` and `dp[1] = 0`, thinking they don't pay until they leave a step. But the problem says "once you pay the cost, you can either climb one or two steps" — you pay when you're on a step, not when you leave it.

4. **Forgetting both starting points:** The problem allows starting at step 0 OR step 1. Your solution must consider both possibilities, which is why we have two base cases and why the final answer is `min(dp[n-1], dp[n-2])`.

## When You'll See This Pattern

This is a classic **dynamic programming** problem with **optimal substructure** — the optimal solution at step i depends on optimal solutions at steps i-1 and i-2. You'll see this pattern in:

1. **Climbing Stairs (LeetCode 70):** Almost identical structure but counting ways instead of minimizing cost. The recurrence is `dp[i] = dp[i-1] + dp[i-2]`.

2. **House Robber (LeetCode 198):** Similar "take or skip" decision at each house, with the constraint that you can't rob adjacent houses. Recurrence: `dp[i] = max(dp[i-1], nums[i] + dp[i-2])`.

3. **Fibonacci Number (LeetCode 509):** The simplest form of this pattern with recurrence `F(n) = F(n-1) + F(n-2)`.

These problems all share the characteristic that the solution at position i depends on solutions at i-1 and i-2, allowing for O(1) space optimization.

## Key Takeaways

1. **Recognize overlapping subproblems:** When a problem asks for an optimal value (min/max) and decisions at each step affect future steps, dynamic programming is often the solution. The recurrence relation usually involves looking back 1-2 steps.

2. **Space optimization is often possible:** When the recurrence only depends on the last 1-2 values, you can use variables instead of an entire array. This shows deeper understanding in interviews.

3. **Pay attention to starting and ending conditions:** Many DP problems have special cases for the first 1-2 elements and the final answer. Always test with small inputs (n=0,1,2) to catch edge cases.

Related problems: [Climbing Stairs](/problem/climbing-stairs), [Find Number of Ways to Reach the K-th Stair](/problem/find-number-of-ways-to-reach-the-k-th-stair)
