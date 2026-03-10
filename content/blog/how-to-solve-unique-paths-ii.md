---
title: "How to Solve Unique Paths II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Unique Paths II. Medium difficulty, 44.2% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2026-07-25"
category: "dsa-patterns"
tags: ["unique-paths-ii", "array", "dynamic-programming", "matrix", "medium"]
---

# How to Solve Unique Paths II

This problem is a twist on the classic grid path counting problem. You're given an `m x n` grid where some cells contain obstacles (marked as 1), and you need to count all possible paths from the top-left to bottom-right corners, moving only right or down, while avoiding obstacles. What makes this tricky is that obstacles create "dead zones" in the grid that block paths, requiring careful handling of edge cases where the start or end positions themselves might be blocked.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:  [[0,0,0],
        [0,1,0],
        [0,0,0]]
```

We need to count paths from (0,0) to (2,2). The obstacle is at (1,1).

**Step-by-step reasoning:**

1. Start at (0,0): 1 way to be here (starting position)
2. First row: can only come from left
   - (0,1): comes from (0,0) → 1 way
   - (0,2): comes from (0,1) → 1 way
3. First column: can only come from above
   - (1,0): comes from (0,0) → 1 way
   - (2,0): comes from (1,0) → 1 way
4. (1,1): obstacle → 0 ways (blocked)
5. (1,2): comes from left (1,1) or above (0,2)
   - (1,1) is obstacle → 0 ways from left
   - (0,2) has 1 way → 1 way total
6. (2,1): comes from left (2,0) or above (1,1)
   - (2,0) has 1 way → 1 way from left
   - (1,1) is obstacle → 0 ways from above
   - Total: 1 way
7. (2,2): comes from left (2,1) or above (1,2)
   - (2,1) has 1 way
   - (1,2) has 1 way
   - Total: 2 ways

So there are 2 possible paths that avoid the obstacle.

## Brute Force Approach

A naive approach would be to use DFS recursion to explore all possible paths:

```python
def uniquePathsWithObstacles(grid):
    m, n = len(grid), len(grid[0])

    def dfs(i, j):
        # If out of bounds or obstacle
        if i >= m or j >= n or grid[i][j] == 1:
            return 0
        # If reached destination
        if i == m-1 and j == n-1:
            return 1
        # Move right + move down
        return dfs(i+1, j) + dfs(i, j+1)

    return dfs(0, 0)
```

**Why this fails:**

- Time complexity: O(2^(m+n)) in worst case (binary tree of decisions at each cell)
- Space complexity: O(m+n) for recursion stack
- Repeated calculations: The same subproblems (paths from a given cell to destination) are computed many times
- For a 100x100 grid, this would take longer than the age of the universe!

## Optimized Approach

The key insight is that this has **optimal substructure**: the number of ways to reach cell (i,j) depends only on:

1. The number of ways to reach the cell above it (i-1,j)
2. The number of ways to reach the cell to its left (i,j-1)

This is a classic **dynamic programming** problem. We can build a DP table where `dp[i][j]` = number of ways to reach cell (i,j).

**Step-by-step reasoning:**

1. If the starting cell (0,0) is an obstacle, answer is 0 (no paths possible)
2. Initialize `dp[0][0] = 1` if it's not an obstacle
3. For first row (i=0): can only come from left, so `dp[0][j] = dp[0][j-1]` if current cell is not obstacle
4. For first column (j=0): can only come from above, so `dp[i][0] = dp[i-1][0]` if current cell is not obstacle
5. For other cells: `dp[i][j] = dp[i-1][j] + dp[i][j-1]` if current cell is not obstacle
6. If a cell is obstacle, `dp[i][j] = 0` (no paths through obstacles)

We can optimize space by using only 1D array since we only need previous row's values.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(m*n) | Space: O(n) - optimized space using 1D array
def uniquePathsWithObstacles(grid):
    """
    Count unique paths from top-left to bottom-right in a grid with obstacles.

    Args:
        grid: 2D list where 0 = empty cell, 1 = obstacle

    Returns:
        Number of unique paths avoiding obstacles
    """
    m, n = len(grid), len(grid[0])

    # Edge case: if start or end is obstacle, no paths exist
    if grid[0][0] == 1 or grid[m-1][n-1] == 1:
        return 0

    # Initialize DP array for current row
    dp = [0] * n
    dp[0] = 1  # Starting position

    # Process each row
    for i in range(m):
        for j in range(n):
            # If current cell is obstacle, no paths through it
            if grid[i][j] == 1:
                dp[j] = 0
            # For non-first column, add paths from left
            elif j > 0:
                dp[j] += dp[j-1]
            # For j=0, dp[j] already has value from previous row (or 1 for i=0,j=0)
            # No need to explicitly handle, dp[j] carries over from previous iteration

    return dp[n-1]
```

```javascript
// Time: O(m*n) | Space: O(n) - optimized space using 1D array
function uniquePathsWithObstacles(grid) {
  /**
   * Count unique paths from top-left to bottom-right in a grid with obstacles.
   *
   * @param {number[][]} grid - 2D array where 0 = empty cell, 1 = obstacle
   * @return {number} Number of unique paths avoiding obstacles
   */
  const m = grid.length;
  const n = grid[0].length;

  // Edge case: if start or end is obstacle, no paths exist
  if (grid[0][0] === 1 || grid[m - 1][n - 1] === 1) {
    return 0;
  }

  // Initialize DP array for current row
  const dp = new Array(n).fill(0);
  dp[0] = 1; // Starting position

  // Process each row
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // If current cell is obstacle, no paths through it
      if (grid[i][j] === 1) {
        dp[j] = 0;
      }
      // For non-first column, add paths from left
      else if (j > 0) {
        dp[j] += dp[j - 1];
      }
      // For j=0, dp[j] already has value from previous row
      // (or 1 for i=0,j=0), so we don't need to change it
    }
  }

  return dp[n - 1];
}
```

```java
// Time: O(m*n) | Space: O(n) - optimized space using 1D array
public int uniquePathsWithObstacles(int[][] grid) {
    /**
     * Count unique paths from top-left to bottom-right in a grid with obstacles.
     *
     * @param grid 2D array where 0 = empty cell, 1 = obstacle
     * @return Number of unique paths avoiding obstacles
     */
    int m = grid.length;
    int n = grid[0].length;

    // Edge case: if start or end is obstacle, no paths exist
    if (grid[0][0] == 1 || grid[m-1][n-1] == 1) {
        return 0;
    }

    // Initialize DP array for current row
    int[] dp = new int[n];
    dp[0] = 1;  // Starting position

    // Process each row
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            // If current cell is obstacle, no paths through it
            if (grid[i][j] == 1) {
                dp[j] = 0;
            }
            // For non-first column, add paths from left
            else if (j > 0) {
                dp[j] += dp[j-1];
            }
            // For j=0, dp[j] already has value from previous row
            // (or 1 for i=0,j=0), so we don't need to change it
        }
    }

    return dp[n-1];
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n)**

- We iterate through every cell in the grid exactly once
- Each cell requires constant time operations (check obstacle, update DP value)

**Space Complexity: O(n)**

- We maintain only a 1D array of size `n` (number of columns)
- This is the optimized version; the 2D DP approach would be O(m×n)
- The input grid itself is O(m×n), but we're not counting that as extra space

## Common Mistakes

1. **Forgetting to check if start/end cells are obstacles**
   - If grid[0][0] == 1 or grid[m-1][n-1] == 1, answer should be 0
   - Many candidates miss this edge case and get wrong answers

2. **Incorrect initialization of first row/column**
   - In first row, cells can only be reached from left (not from above)
   - In first column, cells can only be reached from above (not from left)
   - If there's an obstacle in first row/column, all cells after it become unreachable

3. **Using integer overflow for large grids**
   - Number of paths grows exponentially with grid size
   - For 100x100 grid without obstacles, number of paths is ~2×10^58
   - In languages with fixed-size integers (like Java), use `long` or `BigInteger`

4. **Confusing obstacle value with path count**
   - Obstacles are marked as 1 in input, but we use 1 to mark starting position in DP
   - Always check `grid[i][j] == 1` before using DP value

## When You'll See This Pattern

This **2D grid DP with movement restrictions** pattern appears in many problems:

1. **Unique Paths** (LeetCode 62) - Same problem without obstacles
   - Simpler version, good warm-up for this problem

2. **Minimum Path Sum** (LeetCode 64) - Find minimum cost path
   - Instead of counting paths, find minimum sum of values along path
   - Same DP structure but with `min()` instead of `+`

3. **Dungeon Game** (LeetCode 174) - More complex health-based variant
   - Similar grid traversal with additional state (health)
   - Requires backward DP from end to start

4. **Robot Room Cleaner** (LeetCode 489) - Similar movement constraints
   - Robot can only move in four directions but needs to clean all cells

## Key Takeaways

1. **Grid path counting problems are almost always DP**
   - When you can only move right/down (or in limited directions), think DP
   - The recurrence is usually: `dp[i][j] = dp[i-1][j] + dp[i][j-1]` with modifications for obstacles

2. **Space optimization is often possible**
   - If you only need previous row/column, use 1D array
   - This reduces space from O(m×n) to O(min(m,n))

3. **Handle edge cases first**
   - Check start and end positions immediately
   - Initialize first row and column carefully (they have only one way to reach them)

4. **Visualize with small examples**
   - Draw a 3x3 grid and trace the DP values
   - This helps catch initialization errors and obstacle handling issues

Related problems: [Unique Paths](/problem/unique-paths), [Unique Paths III](/problem/unique-paths-iii), [Minimum Path Cost in a Grid](/problem/minimum-path-cost-in-a-grid)
