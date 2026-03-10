---
title: "How to Solve Dungeon Game — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Dungeon Game. Hard difficulty, 40.9% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2028-01-22"
category: "dsa-patterns"
tags: ["dungeon-game", "array", "dynamic-programming", "matrix", "hard"]
---

# How to Solve Dungeon Game

The Dungeon Game problem asks us to find the **minimum initial health** a knight needs to start with in order to rescue a princess from the bottom-right corner of a grid, moving only right or down, while each cell adds or subtracts from the knight's health. The tricky part is that health cannot drop below 1 at any point — if it does, the knight dies. This constraint makes the problem fundamentally different from typical path-sum problems, because we must ensure the knight survives the _entire_ path, not just reach the end with positive health.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
dungeon = [
  [-2, -3,  3],
  [-5, -10, 1],
  [10,  30, -5]
]
```

If we think greedily from the start, we might try to follow a path that minimizes health loss. But the correct approach is to think **backwards** from the princess. Why? Because at the princess cell, we know exactly what we need: if the cell has value `-5`, we need at least 6 health before entering to survive (since 6 - 5 = 1). If the cell has value `10`, we need only 1 health before entering (since 1 + 10 = 11, which is fine).

Let's work backwards from the bottom-right corner `(2,2)` with value `-5`:

- At `(2,2)`: We need `max(1, 1 - (-5)) = 6` health before stepping here.

Now move to `(2,1)` with value `30`:

- From `(2,1)`, we can go right to `(2,2)` which requires 6 health before entering `(2,2)`.
- So at `(2,1)`, we need enough health such that after adding 30, we have at least 6.
- That means: `health_needed + 30 >= 6` → `health_needed >= 6 - 30 = -24`.
- Since health cannot be negative, we take `max(1, 6 - 30) = 1`.
- So at `(2,1)`, we need at least 1 health before entering.

Similarly for `(2,0)` with value `10`:

- From `(2,0)`, we can go down to `(2,1)` which requires 1 health.
- `health_needed + 10 >= 1` → `health_needed >= 1 - 10 = -9` → `max(1, -9) = 1`.

Continue this process for all cells, always taking the minimum required health from the two possible moves (right or down). The final answer will be the required health at the starting cell `(0,0)`.

## Brute Force Approach

A naive brute force would explore all possible paths from start to end. For each path, we could simulate the knight's health, tracking the minimum health needed to never drop below 1. We would then return the minimum initial health across all paths.

The problem? There are `C(m+n-2, m-1)` possible paths in an `m x n` grid (choosing when to go down among `m+n-2` steps). For a typical 10x10 grid, that's over 184,756 paths. For larger grids, this becomes astronomically large — an exponential `O(2^(m+n))` time complexity.

Even if we tried to optimize with memoization on position alone, we'd still run into trouble because the required health depends not just on position but on the current health value, which could be any positive integer. This makes the state space too large for DP with just position.

## Optimized Approach

The key insight is that we must think **backwards** and track the **minimum health needed to survive from each cell to the princess**. This transforms the problem into a classic dynamic programming problem where `dp[i][j]` represents the minimum health needed before entering cell `(i,j)` to reach the princess.

Why backwards?

1. At the princess cell, we know exactly what we need: `max(1, 1 - dungeon[m-1][n-1])`.
2. For any other cell, we need enough health to survive that cell AND then have enough to continue to the princess.
3. The transition: `dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j])`
   - `min(dp[i+1][j], dp[i][j+1])` is the minimum health needed from the next step (we take the easier path)
   - Subtract `dungeon[i][j]` because this cell's value will modify our health
   - Take `max(1, ...)` because health cannot drop below 1

We fill the DP table from bottom-right to top-left, handling boundary cells carefully.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m*n) | Space: O(m*n) (can be optimized to O(n))
def calculateMinimumHP(dungeon):
    """
    Calculate the minimum initial health needed to rescue the princess.

    Args:
        dungeon: List[List[int]] - grid where positive values heal,
                 negative values damage the knight

    Returns:
        int - minimum initial health required
    """
    m, n = len(dungeon), len(dungeon[0])

    # Create DP table with extra row and column for boundary handling
    dp = [[float('inf')] * (n + 1) for _ in range(m + 1)]

    # Base cases:
    # - Cell to the right of princess requires 1 health to reach princess
    # - Cell below princess requires 1 health to reach princess
    dp[m][n-1] = dp[m-1][n] = 1

    # Fill DP table from bottom-right to top-left
    for i in range(m-1, -1, -1):
        for j in range(n-1, -1, -1):
            # Minimum health needed from the next step (right or down)
            min_health_next = min(dp[i+1][j], dp[i][j+1])

            # Health needed before entering current cell:
            # We need enough health so that after dungeon[i][j], we have at least min_health_next
            # Formula: health_needed + dungeon[i][j] >= min_health_next
            # So: health_needed >= min_health_next - dungeon[i][j]
            health_needed = min_health_next - dungeon[i][j]

            # Health cannot drop below 1
            dp[i][j] = max(1, health_needed)

    return dp[0][0]
```

```javascript
// Time: O(m*n) | Space: O(m*n) (can be optimized to O(n))
function calculateMinimumHP(dungeon) {
  /**
   * Calculate the minimum initial health needed to rescue the princess.
   *
   * @param {number[][]} dungeon - grid where positive values heal,
   *                               negative values damage the knight
   * @return {number} - minimum initial health required
   */
  const m = dungeon.length;
  const n = dungeon[0].length;

  // Create DP table with extra row and column for boundary handling
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(Infinity));

  // Base cases:
  // - Cell to the right of princess requires 1 health to reach princess
  // - Cell below princess requires 1 health to reach princess
  dp[m][n - 1] = dp[m - 1][n] = 1;

  // Fill DP table from bottom-right to top-left
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      // Minimum health needed from the next step (right or down)
      const minHealthNext = Math.min(dp[i + 1][j], dp[i][j + 1]);

      // Health needed before entering current cell:
      // We need enough health so that after dungeon[i][j], we have at least minHealthNext
      // Formula: healthNeeded + dungeon[i][j] >= minHealthNext
      // So: healthNeeded >= minHealthNext - dungeon[i][j]
      const healthNeeded = minHealthNext - dungeon[i][j];

      // Health cannot drop below 1
      dp[i][j] = Math.max(1, healthNeeded);
    }
  }

  return dp[0][0];
}
```

```java
// Time: O(m*n) | Space: O(m*n) (can be optimized to O(n))
class Solution {
    public int calculateMinimumHP(int[][] dungeon) {
        /**
         * Calculate the minimum initial health needed to rescue the princess.
         *
         * @param dungeon - grid where positive values heal,
         *                 negative values damage the knight
         * @return minimum initial health required
         */
        int m = dungeon.length;
        int n = dungeon[0].length;

        // Create DP table with extra row and column for boundary handling
        int[][] dp = new int[m + 1][n + 1];

        // Initialize all cells to a large value (like infinity)
        for (int i = 0; i <= m; i++) {
            for (int j = 0; j <= n; j++) {
                dp[i][j] = Integer.MAX_VALUE;
            }
        }

        // Base cases:
        // - Cell to the right of princess requires 1 health to reach princess
        // - Cell below princess requires 1 health to reach princess
        dp[m][n - 1] = dp[m - 1][n] = 1;

        // Fill DP table from bottom-right to top-left
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                // Minimum health needed from the next step (right or down)
                int minHealthNext = Math.min(dp[i + 1][j], dp[i][j + 1]);

                // Health needed before entering current cell:
                // We need enough health so that after dungeon[i][j], we have at least minHealthNext
                // Formula: healthNeeded + dungeon[i][j] >= minHealthNext
                // So: healthNeeded >= minHealthNext - dungeon[i][j]
                int healthNeeded = minHealthNext - dungeon[i][j];

                // Health cannot drop below 1
                dp[i][j] = Math.max(1, healthNeeded);
            }
        }

        return dp[0][0];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(m * n)` where `m` is the number of rows and `n` is the number of columns. We iterate through each cell exactly once while computing the DP table.

**Space Complexity:** `O(m * n)` for the DP table. However, we can optimize this to `O(n)` by only keeping two rows (current and next) since we only need values from the row below and column to the right. The space-optimized version would use a 1D array of size `n` and update it from right to left.

## Common Mistakes

1. **Thinking forwards instead of backwards**: Many candidates try to solve this like Minimum Path Sum, tracking maximum health gain along the path. This fails because a path with high total gain might have a dangerous low point that kills the knight. Always think backwards when the constraint is "never drop below a threshold."

2. **Incorrect base case handling**: Forgetting to set `dp[m][n-1] = dp[m-1][n] = 1` leads to wrong results. These "virtual" cells represent the requirement after reaching the princess. Without them, the princess cell calculation is incorrect.

3. **Not taking max(1, ...) at each step**: Some candidates only check the final health, but we must ensure health never drops below 1 at ANY point, not just at the end. The `max(1, ...)` enforces this constraint at every cell.

4. **Using greedy approach**: Trying to always pick the cell with higher value (less negative) doesn't work. Consider a path that goes through `-100` then `+200` versus a path with all `-1` cells. The first path requires 101 initial health, while the second might require less even though it looks worse locally.

## When You'll See This Pattern

This "backwards DP" pattern appears in problems where:

1. You need to satisfy a constraint throughout the entire path (not just at the end)
2. The optimal decision depends on future states
3. There's a minimum threshold that cannot be violated

Related problems:

- **Minimum Path Sum (LeetCode 64)**: Similar grid traversal but forward DP works because there's no constraint violation.
- **Cherry Pickup (LeetCode 741)**: Also requires thinking about round trips, often solved with DP thinking both forwards and backwards.
- **Triangle (LeetCode 120)**: Can be solved with bottom-up DP from the base to the top.

## Key Takeaways

1. **When you see "minimum initial value to satisfy constraint throughout," think backwards DP.** Start from the goal and work backwards to determine what you need at each step.

2. **The health constraint changes everything.** Unlike path sum problems where you accumulate values, here you must ensure a minimum threshold is maintained at all points.

3. **Boundary conditions matter.** The extra row/column in the DP table simplifies the logic for edge cells. Always test with small grids (1x1, 1xn, mx1) to catch boundary issues.

Related problems: [Unique Paths](/problem/unique-paths), [Minimum Path Sum](/problem/minimum-path-sum), [Cherry Pickup](/problem/cherry-pickup)
