---
title: "How to Solve Painting the Walls — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Painting the Walls. Hard difficulty, 48.9% acceptance rate. Topics: Array, Dynamic Programming."
date: "2027-11-16"
category: "dsa-patterns"
tags: ["painting-the-walls", "array", "dynamic-programming", "hard"]
---

# How to Solve Painting the Walls

This problem presents a classic optimization challenge with a twist: you have two painters with different constraints, and you need to minimize cost while ensuring all walls get painted. The tricky part is that the paid painter's time can be "spent" to cover multiple walls painted by the free painter, creating a trade-off between cost and time efficiency. This is essentially a knapsack-style problem disguised as a painting scenario.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we have:

- `cost = [1, 2, 3, 2]`
- `time = [1, 2, 3, 2]`
- `n = 4` walls

We need to select some walls for the paid painter (paying their cost) and let the free painter handle the rest. The key constraint: for every wall the paid painter paints (taking `time[i]`), the free painter can paint up to `time[i]` walls (one unit per wall).

Think of it this way: if we select walls for the paid painter, their total time becomes "credits" that allow the free painter to work. We need enough credits to cover all walls not painted by the paid painter.

Let's try selecting walls 0 and 3 for the paid painter:

- Paid painter cost: `1 + 2 = 3`
- Paid painter time: `1 + 2 = 3` credits
- Walls painted by paid: 2 walls (0 and 3)
- Walls left for free painter: 2 walls (1 and 2)
- Credits needed: 2 (free painter needs 1 credit per wall)
- Credits available: 3 ✓

This works! Total cost = 3. But can we do better?

What if we select only wall 2 for the paid painter:

- Paid painter cost: 3
- Paid painter time: 3 credits
- Walls painted by paid: 1 wall
- Walls left for free painter: 3 walls
- Credits needed: 3
- Credits available: 3 ✓

This also works with cost = 3. The minimum appears to be 3.

The challenge is finding the optimal selection without trying all 2^n possibilities.

## Brute Force Approach

The brute force solution would try every possible subset of walls for the paid painter. For each subset:

1. Calculate total cost of selected walls
2. Calculate total time (credits) from selected walls
3. Check if: `(number of selected walls) + (total time from selected walls) >= n`
   - Selected walls are painted by paid painter
   - Total time allows free painter to paint remaining walls (1 credit per wall)

This check works because:

- Paid painter paints `k` walls (where `k` is the number of selected walls)
- Free painter needs to paint `n - k` walls
- Free painter gets `total_time` credits from paid painter's work
- We need `total_time >= n - k`, which rearranges to `k + total_time >= n`

The brute force has O(2^n) time complexity, which is infeasible for n up to 500.

## Optimized Approach

The key insight is recognizing this as a **dynamic programming knapsack problem** with a twist. Instead of the usual weight/value knapsack, we're tracking:

- How many "credits" we have (from paid painter's time)
- How many walls are covered

But there's a more elegant formulation: we can think in terms of **net walls covered**.

For each wall `i`:

- If the paid painter paints it: we pay `cost[i]` and gain `time[i] + 1` net walls
  - The `+1` accounts for the wall itself being painted
  - The `time[i]` credits allow the free painter to paint that many additional walls
- We need to reach at least `n` net walls with minimum cost

This transforms the problem into: "Find the minimum cost to achieve at least n net walls, where each item (wall) gives `time[i] + 1` net walls at cost `cost[i]`."

Now we can use a 1D DP array:

- `dp[j]` = minimum cost to achieve exactly `j` net walls
- Initialize `dp[0] = 0`, others to infinity
- For each wall `i`, iterate `j` from `n` down to `time[i] + 1`
- Update: `dp[j] = min(dp[j], dp[j - (time[i] + 1)] + cost[i])`

Finally, the answer is `min(dp[n], dp[n+1], ..., dp[2n])` since we can overshoot n net walls.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n)
def paintWalls(cost, time):
    """
    Returns the minimum cost to paint all walls.

    Approach: Transform to knapsack where each wall gives
    (time[i] + 1) "net walls" at cost cost[i].
    We need at least n net walls total.
    """
    n = len(cost)

    # dp[j] = min cost to achieve exactly j net walls
    # We might need up to 2n net walls in worst case
    # Initialize with infinity (large number)
    INF = float('inf')
    dp = [INF] * (n + 1)
    dp[0] = 0  # 0 cost for 0 net walls

    # Process each wall
    for i in range(n):
        # Current wall gives net_walls = time[i] + 1
        net_walls = time[i] + 1

        # Iterate backwards to avoid reusing the same wall multiple times
        # We go from n down to net_walls
        for j in range(n, net_walls - 1, -1):
            # Either don't take this wall (dp[j] stays same)
            # Or take this wall: cost increases by cost[i],
            # net walls increase by net_walls
            dp[j] = min(dp[j], dp[j - net_walls] + cost[i])

        # Also handle cases where net_walls > current j
        # For j < net_walls, taking this wall would give at least net_walls
        # So we can update dp[net_walls] if taking this wall is cheaper
        # than whatever we had for exactly net_walls
        dp[net_walls] = min(dp[net_walls], cost[i])

    # We need at least n net walls
    # Check dp[n], dp[n+1], ..., dp[n] (since we only computed up to n)
    # Actually, we computed exactly up to n, so answer is dp[n]
    # But if dp[n] is INF, we need to check higher values
    # In our DP, we only go up to n, so dp[n] should have the answer
    # because any solution with > n net walls would have been
    # captured when we tried to achieve exactly n walls

    return dp[n] if dp[n] != INF else 0

# Alternative implementation with 2n limit for clarity
def paintWallsAlternative(cost, time):
    n = len(cost)
    INF = float('inf')

    # We might overshoot n, so allocate up to 2n
    # Maximum net walls from one wall is time[i] + 1 <= n + 1
    # With n walls, maximum total is n + sum(time) which could be ~n^2
    # But practically, we only need up to 2n
    dp = [INF] * (2 * n + 1)
    dp[0] = 0

    for i in range(n):
        net_walls = time[i] + 1
        current_cost = cost[i]

        # Iterate backwards from 2n down to net_walls
        for j in range(2 * n, net_walls - 1, -1):
            if dp[j - net_walls] != INF:
                dp[j] = min(dp[j], dp[j - net_walls] + current_cost)

    # Find minimum cost for at least n net walls
    result = INF
    for j in range(n, 2 * n + 1):
        result = min(result, dp[j])

    return result if result != INF else 0
```

```javascript
// Time: O(n^2) | Space: O(n)
/**
 * Returns the minimum cost to paint all walls.
 * @param {number[]} cost - Cost for each wall
 * @param {number[]} time - Time for each wall
 * @return {number} - Minimum total cost
 */
function paintWalls(cost, time) {
  const n = cost.length;

  // dp[j] = minimum cost to achieve exactly j net walls
  // Initialize with Infinity
  const INF = Number.MAX_SAFE_INTEGER;
  const dp = new Array(n + 1).fill(INF);
  dp[0] = 0; // Zero cost for zero net walls

  // Process each wall
  for (let i = 0; i < n; i++) {
    // This wall gives time[i] + 1 net walls
    const netWalls = time[i] + 1;
    const currentCost = cost[i];

    // Iterate backwards to avoid using same wall multiple times
    // We only need up to n net walls
    for (let j = n; j >= netWalls; j--) {
      // If we can achieve (j - netWalls) net walls with some cost,
      // we can add this wall to achieve j net walls
      if (dp[j - netWalls] !== INF) {
        dp[j] = Math.min(dp[j], dp[j - netWalls] + currentCost);
      }
    }

    // Special case: if netWalls is less than or equal to n,
    // update dp[netWalls] directly
    if (netWalls <= n) {
      dp[netWalls] = Math.min(dp[netWalls], currentCost);
    }
  }

  // We need at least n net walls
  return dp[n] !== INF ? dp[n] : 0;
}

// Alternative with 2n limit
function paintWallsAlternative(cost, time) {
  const n = cost.length;
  const INF = Number.MAX_SAFE_INTEGER;

  // Allow up to 2n net walls to handle overshoot
  const dp = new Array(2 * n + 1).fill(INF);
  dp[0] = 0;

  for (let i = 0; i < n; i++) {
    const netWalls = time[i] + 1;
    const currentCost = cost[i];

    // Backward iteration for 0/1 knapsack
    for (let j = 2 * n; j >= netWalls; j--) {
      if (dp[j - netWalls] !== INF) {
        dp[j] = Math.min(dp[j], dp[j - netWalls] + currentCost);
      }
    }
  }

  // Find minimum cost for at least n net walls
  let result = INF;
  for (let j = n; j <= 2 * n; j++) {
    result = Math.min(result, dp[j]);
  }

  return result !== INF ? result : 0;
}
```

```java
// Time: O(n^2) | Space: O(n)
class Solution {
    public int paintWalls(int[] cost, int[] time) {
        int n = cost.length;

        // dp[j] = minimum cost to achieve exactly j net walls
        // We only need up to n since we want at least n
        int INF = Integer.MAX_VALUE / 2;  // Avoid overflow
        int[] dp = new int[n + 1];

        // Initialize dp array
        Arrays.fill(dp, INF);
        dp[0] = 0;  // Zero cost for zero net walls

        // Process each wall
        for (int i = 0; i < n; i++) {
            // This wall contributes time[i] + 1 net walls
            int netWalls = time[i] + 1;
            int currentCost = cost[i];

            // Iterate backwards for 0/1 knapsack
            // Start from n down to netWalls
            for (int j = n; j >= netWalls; j--) {
                // Check if we can reach (j - netWalls) net walls
                if (dp[j - netWalls] != INF) {
                    // Either keep current dp[j] or add this wall
                    dp[j] = Math.min(dp[j], dp[j - netWalls] + currentCost);
                }
            }

            // Also update dp[netWalls] if this wall alone is cheaper
            if (netWalls <= n) {
                dp[netWalls] = Math.min(dp[netWalls], currentCost);
            }
        }

        // We need at least n net walls
        return dp[n] != INF ? dp[n] : 0;
    }
}

// Alternative implementation with 2n limit
class SolutionAlternative {
    public int paintWalls(int[] cost, int[] time) {
        int n = cost.length;
        int INF = Integer.MAX_VALUE / 2;

        // Allow overshoot up to 2n
        int[] dp = new int[2 * n + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0;

        for (int i = 0; i < n; i++) {
            int netWalls = time[i] + 1;
            int currentCost = cost[i];

            // Standard 0/1 knapsack backward iteration
            for (int j = 2 * n; j >= netWalls; j--) {
                if (dp[j - netWalls] != INF) {
                    dp[j] = Math.min(dp[j], dp[j - netWalls] + currentCost);
                }
            }
        }

        // Find minimum cost for at least n net walls
        int result = INF;
        for (int j = n; j <= 2 * n; j++) {
            result = Math.min(result, dp[j]);
        }

        return result != INF ? result : 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- We have n walls to process
- For each wall, we iterate through the DP array of size O(n)
- This gives us O(n × n) = O(n²) operations
- Even with the 2n version, it's still O(n × 2n) = O(n²)

**Space Complexity:** O(n)

- We use a 1D DP array of size O(n) (or O(2n) in the alternative)
- No other significant data structures are used
- This is optimal for a knapsack-style DP solution

## Common Mistakes

1. **Misunderstanding the constraint relationship**: The most common error is not correctly translating "paid painter's time allows free painter to paint that many walls" into the `k + total_time >= n` condition. Remember: each unit of paid time allows ONE free wall, not necessarily in order.

2. **Using greedy approach**: Candidates might try to sort by cost/time ratio and pick the "best value" walls. This fails because the problem has dependencies—selecting a wall affects how many other walls can be painted for free.

3. **Incorrect DP state definition**: Defining DP state as `dp[i][j]` = min cost using first i walls to get exactly j time credits. This misses the crucial insight that we need to track net walls (time + 1), not just time.

4. **Forgetting to iterate backwards in knapsack**: When implementing the 0/1 knapsack, you must iterate the inner loop backwards to avoid using the same item multiple times. Forward iteration would give the unbounded knapsack solution.

## When You'll See This Pattern

This problem uses a **transformed knapsack** pattern where you redefine what the "weight" and "value" mean to fit the problem constraints. Similar problems include:

1. **Target Sum (LeetCode 494)**: Transform to subset sum problem by rearranging the equation.
2. **Partition Equal Subset Sum (LeetCode 416)**: Classic subset sum/knapsack problem.
3. **Coin Change (LeetCode 322)**: Knapsack with coins as items and amount as capacity.
4. **Last Stone Weight II (LeetCode 1049)**: Transform to partition problem to minimize difference.

The key insight in all these problems is recognizing the underlying combinatorial structure and mapping it to a known DP formulation.

## Key Takeaways

1. **Look for transformation opportunities**: When a problem seems complex, try to reformulate it in terms of standard patterns. Here, the breakthrough was realizing `time[i] + 1` represents "net walls covered."

2. **Knapsack variations are common**: Many optimization problems with selection constraints can be solved with knapsack DP. The 0/1 knapsack (backward iteration) vs unbounded knapsack (forward iteration) distinction is crucial.

3. **DP state compression**: When the DP transition only depends on the previous row (or previous values in 1D), you can often optimize space from O(n²) to O(n) by iterating carefully.

[Practice this problem on CodeJeet](/problem/painting-the-walls)
