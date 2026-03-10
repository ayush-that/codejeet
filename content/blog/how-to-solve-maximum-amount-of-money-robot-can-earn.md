---
title: "How to Solve Maximum Amount of Money Robot Can Earn — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Amount of Money Robot Can Earn. Medium difficulty, 29.5% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2029-09-11"
category: "dsa-patterns"
tags: ["maximum-amount-of-money-robot-can-earn", "array", "dynamic-programming", "matrix", "medium"]
---

# How to Solve Maximum Amount of Money Robot Can Earn

This problem presents a classic grid traversal scenario with a twist: cells can have negative values that reduce the robot's earnings. The robot starts at the top-left corner and must reach the bottom-right corner, moving only right or down. The challenge is finding the path that maximizes the total sum of coin values collected, even when negative values might force us to strategically avoid certain cells or accept temporary losses. What makes this interesting is that unlike standard "maximum path sum" problems, negative values mean we can't simply take the maximum of previous cells—we need to carefully track whether a path remains viable.

## Visual Walkthrough

Let's trace through a small 3×3 example to build intuition:

```
coins = [
  [ 1, -2,  3],
  [ 4, -5,  6],
  [ 7,  8, -9]
]
```

The robot starts at (0,0) with 1 coin. At each step, it can only move right or down. Let's think about what happens:

1. **From (0,0) to (0,1)**: If we go right, we add -2, so total becomes -1.
2. **From (0,0) to (1,0)**: If we go down, we add 4, so total becomes 5.

Already we see that going down gives us a better path. But here's the key insight: we can't just look at immediate gains. The path through (1,0) might lead to better overall results even if (0,1) had a higher immediate value.

Let's manually trace the optimal path:

- Start: (0,0) = 1
- Down to (1,0): 1 + 4 = 5
- Right to (1,1): 5 + (-5) = 0
- Right to (1,2): 0 + 6 = 6
- Down to (2,2): 6 + (-9) = -3

Wait, that gives us -3! But there's a better path:

- Start: (0,0) = 1
- Right to (0,1): 1 + (-2) = -1
- Right to (0,2): -1 + 3 = 2
- Down to (1,2): 2 + 6 = 8
- Down to (2,2): 8 + (-9) = -1

Still negative! Let's try:

- Start: (0,0) = 1
- Down to (1,0): 1 + 4 = 5
- Down to (2,0): 5 + 7 = 12
- Right to (2,1): 12 + 8 = 20
- Right to (2,2): 20 + (-9) = 11 ✓

This gives us 11, which is the maximum. Notice how we avoided the negative cells at (0,1), (1,1), and took advantage of the positive cells at (2,0) and (2,1).

## Brute Force Approach

The brute force approach would explore all possible paths from (0,0) to (m-1,n-1). Since at each cell the robot can move right or down, and there are m+n-2 moves to make with m-1 down moves and n-1 right moves, the total number of paths is the binomial coefficient C(m+n-2, m-1).

For each path, we would sum all the coin values along that path and track the maximum. This approach has exponential time complexity: O(2^(m+n)) in practice since we're exploring a binary decision tree at each step.

The problem with this approach is obvious: for even moderately sized grids (say 20×20), we'd have C(38,19) ≈ 35 billion paths to check! This is completely infeasible.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with **optimal substructure**: the maximum coins we can earn reaching cell (i,j) depends only on the maximum coins we could earn reaching the cell above it (i-1,j) and the cell to its left (i,j-1).

However, there's a crucial detail: if all paths to a cell result in negative totals, we shouldn't take that path at all. We need to track whether a cell is reachable with a non-negative total. If both possible predecessor cells have negative maximums (or are unreachable), then the current cell is also unreachable.

Our DP approach:

1. Create a 2D DP array where `dp[i][j]` stores the maximum coins we can have when reaching cell (i,j)
2. Initialize `dp[0][0] = coins[0][0]` (unless it's negative, in which case no valid path exists)
3. For each cell (i,j):
   - If we're in the first row (i=0), we can only come from the left
   - If we're in the first column (j=0), we can only come from above
   - Otherwise, we can come from above or left
4. We only take a path if the predecessor cell had a non-negative total
5. If no valid path reaches a cell, we mark it with a special value (like negative infinity)

The recurrence relation:

- `dp[i][j] = coins[i][j] + max(dp[i-1][j], dp[i][j-1])`
- But only if at least one of `dp[i-1][j]` or `dp[i][j-1]` is ≥ 0
- If both are negative, `dp[i][j]` remains negative (unreachable)

## Optimal Solution

<div class="code-group">

```python
# Time: O(m*n) | Space: O(m*n)
def maxMoney(coins):
    """
    Calculate the maximum money a robot can earn moving from top-left
    to bottom-right in a grid, moving only right or down.

    Args:
        coins: 2D list of integers representing coin values in each cell

    Returns:
        Maximum coins collectable, or -1 if no valid path exists
    """
    m = len(coins)
    n = len(coins[0])

    # Create DP table with same dimensions as coins grid
    dp = [[0] * n for _ in range(m)]

    # Initialize starting cell
    dp[0][0] = coins[0][0]

    # Fill first column (can only come from above)
    for i in range(1, m):
        # If cell above has non-negative value, we can continue the path
        if dp[i-1][0] >= 0:
            dp[i][0] = dp[i-1][0] + coins[i][0]
        else:
            # If above cell is negative, this path is invalid
            dp[i][0] = -float('inf')

    # Fill first row (can only come from left)
    for j in range(1, n):
        # If cell to the left has non-negative value, we can continue
        if dp[0][j-1] >= 0:
            dp[0][j] = dp[0][j-1] + coins[0][j]
        else:
            # If left cell is negative, this path is invalid
            dp[0][j] = -float('inf')

    # Fill rest of the DP table
    for i in range(1, m):
        for j in range(1, n):
            # Get maximum from top and left cells, but only if they're non-negative
            from_top = dp[i-1][j] if dp[i-1][j] >= 0 else -float('inf')
            from_left = dp[i][j-1] if dp[i][j-1] >= 0 else -float('inf')

            # Take the better of the two valid paths
            best_prev = max(from_top, from_left)

            if best_prev > -float('inf'):
                # We have at least one valid path to this cell
                dp[i][j] = best_prev + coins[i][j]
            else:
                # No valid path reaches this cell
                dp[i][j] = -float('inf')

    # Return result for bottom-right cell, or -1 if unreachable
    return dp[m-1][n-1] if dp[m-1][n-1] >= 0 else -1
```

```javascript
// Time: O(m*n) | Space: O(m*n)
function maxMoney(coins) {
  /**
   * Calculate the maximum money a robot can earn moving from top-left
   * to bottom-right in a grid, moving only right or down.
   *
   * @param {number[][]} coins - 2D array of integers representing coin values
   * @return {number} Maximum coins collectable, or -1 if no valid path exists
   */
  const m = coins.length;
  const n = coins[0].length;

  // Create DP table with same dimensions as coins grid
  const dp = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  // Initialize starting cell
  dp[0][0] = coins[0][0];

  // Fill first column (can only come from above)
  for (let i = 1; i < m; i++) {
    // If cell above has non-negative value, we can continue the path
    if (dp[i - 1][0] >= 0) {
      dp[i][0] = dp[i - 1][0] + coins[i][0];
    } else {
      // If above cell is negative, this path is invalid
      dp[i][0] = -Infinity;
    }
  }

  // Fill first row (can only come from left)
  for (let j = 1; j < n; j++) {
    // If cell to the left has non-negative value, we can continue
    if (dp[0][j - 1] >= 0) {
      dp[0][j] = dp[0][j - 1] + coins[0][j];
    } else {
      // If left cell is negative, this path is invalid
      dp[0][j] = -Infinity;
    }
  }

  // Fill rest of the DP table
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      // Get maximum from top and left cells, but only if they're non-negative
      const fromTop = dp[i - 1][j] >= 0 ? dp[i - 1][j] : -Infinity;
      const fromLeft = dp[i][j - 1] >= 0 ? dp[i][j - 1] : -Infinity;

      // Take the better of the two valid paths
      const bestPrev = Math.max(fromTop, fromLeft);

      if (bestPrev > -Infinity) {
        // We have at least one valid path to this cell
        dp[i][j] = bestPrev + coins[i][j];
      } else {
        // No valid path reaches this cell
        dp[i][j] = -Infinity;
      }
    }
  }

  // Return result for bottom-right cell, or -1 if unreachable
  return dp[m - 1][n - 1] >= 0 ? dp[m - 1][n - 1] : -1;
}
```

```java
// Time: O(m*n) | Space: O(m*n)
class Solution {
    public int maxMoney(int[][] coins) {
        /**
         * Calculate the maximum money a robot can earn moving from top-left
         * to bottom-right in a grid, moving only right or down.
         *
         * @param coins 2D array of integers representing coin values in each cell
         * @return Maximum coins collectable, or -1 if no valid path exists
         */
        int m = coins.length;
        int n = coins[0].length;

        // Create DP table with same dimensions as coins grid
        int[][] dp = new int[m][n];

        // Initialize starting cell
        dp[0][0] = coins[0][0];

        // Fill first column (can only come from above)
        for (int i = 1; i < m; i++) {
            // If cell above has non-negative value, we can continue the path
            if (dp[i-1][0] >= 0) {
                dp[i][0] = dp[i-1][0] + coins[i][0];
            } else {
                // If above cell is negative, this path is invalid
                dp[i][0] = Integer.MIN_VALUE;
            }
        }

        // Fill first row (can only come from left)
        for (int j = 1; j < n; j++) {
            // If cell to the left has non-negative value, we can continue
            if (dp[0][j-1] >= 0) {
                dp[0][j] = dp[0][j-1] + coins[0][j];
            } else {
                // If left cell is negative, this path is invalid
                dp[0][j] = Integer.MIN_VALUE;
            }
        }

        // Fill rest of the DP table
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                // Get maximum from top and left cells, but only if they're non-negative
                int fromTop = dp[i-1][j] >= 0 ? dp[i-1][j] : Integer.MIN_VALUE;
                int fromLeft = dp[i][j-1] >= 0 ? dp[i][j-1] : Integer.MIN_VALUE;

                // Take the better of the two valid paths
                int bestPrev = Math.max(fromTop, fromLeft);

                if (bestPrev > Integer.MIN_VALUE) {
                    // We have at least one valid path to this cell
                    dp[i][j] = bestPrev + coins[i][j];
                } else {
                    // No valid path reaches this cell
                    dp[i][j] = Integer.MIN_VALUE;
                }
            }
        }

        // Return result for bottom-right cell, or -1 if unreachable
        return dp[m-1][n-1] >= 0 ? dp[m-1][n-1] : -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)  
We iterate through each cell of the m × n grid exactly once. For each cell, we perform constant-time operations: checking up to two predecessor cells and performing a simple addition and comparison.

**Space Complexity:** O(m × n)  
We create a DP table of the same dimensions as the input grid to store the maximum coins reachable at each cell. We could optimize this to O(min(m, n)) by only keeping the current and previous rows, but the standard solution uses the full table for clarity.

## Common Mistakes

1. **Not handling negative paths correctly**: The most common mistake is treating all negative predecessor values as valid. If a path gives you negative coins, you shouldn't take it because you can't "recover" from negative coins—the problem implies you need to maintain a non-negative total throughout the journey.

2. **Forgetting to initialize the first row and column separately**: These boundary cases only have one possible predecessor (left for first row, above for first column). Candidates often try to apply the general recurrence to these cells and get index errors.

3. **Using the wrong special value for unreachable cells**: Some candidates use 0 or a large negative number like -10^9. It's better to use language-specific constants like `-float('inf')` in Python, `-Infinity` in JavaScript, or `Integer.MIN_VALUE` in Java to clearly distinguish "unreachable" from "reachable with negative coins".

4. **Not returning -1 when no valid path exists**: The problem requires returning -1 if the robot cannot reach the destination with a non-negative coin total. Candidates sometimes return the negative value from the DP table instead.

## When You'll See This Pattern

This problem combines two classic patterns: **grid DP** and **pathfinding with constraints**. You'll see similar patterns in:

1. **LeetCode 64: Minimum Path Sum** - Almost identical structure but minimizes sum instead of maximizing, and all values are non-negative so no special handling needed for negative paths.

2. **LeetCode 120: Triangle** - Another DP problem where you move through a triangular grid, choosing between two possible predecessors at each step.

3. **LeetCode 174: Dungeon Game** - A more complex variant where you must ensure the knight never drops below 1 health, requiring backward DP from destination to start.

The core pattern is: when you have a grid where you can only move in certain directions (usually right/down), and you need to optimize some cumulative value along the path, dynamic programming is almost always the solution.

## Key Takeaways

1. **Grid traversal with only right/down moves creates optimal substructure** - The best path to any cell depends only on the best paths to its top and left neighbors, making DP the natural solution.

2. **Negative values require careful handling** - Unlike problems with all non-negative values, you can't simply take the maximum of predecessor cells. You need to track whether a path remains "viable" (non-negative total).

3. **Boundary conditions matter** - The first row and first column have only one possible predecessor, so they need separate initialization logic in your DP solution.

[Practice this problem on CodeJeet](/problem/maximum-amount-of-money-robot-can-earn)
