---
title: "How to Solve Maximum Number of Moves in a Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Moves in a Grid. Medium difficulty, 58.8% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2026-12-12"
category: "dsa-patterns"
tags: ["maximum-number-of-moves-in-a-grid", "array", "dynamic-programming", "matrix", "medium"]
---

# How to Solve Maximum Number of Moves in a Grid

This problem asks us to find the maximum number of moves we can make starting from any cell in the first column of a grid, moving only to strictly larger-valued cells in the next column. The challenge lies in tracking multiple possible paths while ensuring we always move to cells with greater values—a classic dynamic programming problem disguised as a grid traversal.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [
    [2, 4, 3, 5],
    [5, 1, 6, 7],
    [3, 7, 8, 9]
]
```

We can start from any cell in column 0: (0,0)=2, (1,0)=5, or (2,0)=3.

**Starting from (0,0)=2:**

- From (0,0), we can move to (0,1)=4 (2 < 4 ✓) or (1,1)=1 (2 < 1 ✗)
- From (0,1)=4, we can move to (0,2)=3 (4 < 3 ✗), (1,2)=6 (4 < 6 ✓), or (2,2)=8 (4 < 8 ✓)
- From (1,2)=6, we can move to (0,3)=5 (6 < 5 ✗), (1,3)=7 (6 < 7 ✓), or (2,3)=9 (6 < 9 ✓)
- From (2,2)=8, we can move to (1,3)=7 (8 < 7 ✗) or (2,3)=9 (8 < 9 ✓)

Best path: (0,0)→(0,1)→(2,2)→(2,3) = 3 moves

**Starting from (1,0)=5:**

- From (1,0), we can move to (0,1)=4 (5 < 4 ✗), (1,1)=1 (5 < 1 ✗), or (2,1)=7 (5 < 7 ✓)
- From (2,1)=7, we can move to (1,2)=6 (7 < 6 ✗), (2,2)=8 (7 < 8 ✓)
- From (2,2)=8, we can move to (1,3)=7 (8 < 7 ✗) or (2,3)=9 (8 < 9 ✓)

Best path: (1,0)→(2,1)→(2,2)→(2,3) = 3 moves

**Starting from (2,0)=3:**

- From (2,0), we can move to (1,1)=1 (3 < 1 ✗), (2,1)=7 (3 < 7 ✓)
- From (2,1)=7, we can move to (1,2)=6 (7 < 6 ✗), (2,2)=8 (7 < 8 ✓)
- From (2,2)=8, we can move to (1,3)=7 (8 < 7 ✗) or (2,3)=9 (8 < 9 ✓)

Best path: (2,0)→(2,1)→(2,2)→(2,3) = 3 moves

The maximum moves is 3. Notice how we need to track the best path from each starting position and consider all three possible moves at each step.

## Brute Force Approach

A naive approach would be to try all possible paths from every starting cell in the first column. For each starting position, we'd recursively explore all valid moves, tracking the maximum depth we can reach.

The brute force would look like this:

1. For each cell (r, 0) in the first column
2. Recursively explore all three possible moves: (r-1, c+1), (r, c+1), (r+1, c+1)
3. Only move if the new cell has a greater value than the current cell
4. Track the maximum moves from each starting position

This approach has exponential time complexity O(3^(m\*n)) in the worst case, which is completely impractical for typical constraints (m, n up to 1000). The problem is we're recomputing the same subproblems repeatedly—if we reach cell (i, j) from different paths, we're exploring its future moves multiple times.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem. For each cell (i, j), we want to know: "What's the maximum number of moves I can make starting from this cell?"

We can work backwards from the last column to the first:

- Base case: Any cell in the last column (col = n-1) can make 0 more moves (we're already at the last column)
- For other cells: We can make 1 + max(moves from valid next cells), where "valid" means the next cell has a greater value

However, there's a catch: we need to process columns from right to left because the answer for column j depends on column j+1. But we also need to ensure we only move to cells with strictly greater values.

The optimal approach uses DP where `dp[i][j]` represents the maximum moves starting from cell (i, j):

1. Initialize `dp[i][n-1] = 0` for all i (last column)
2. For column j from n-2 down to 0:
   - For each row i:
     - Check three possible moves: (i-1, j+1), (i, j+1), (i+1, j+1)
     - For each valid move (within bounds AND grid[next] > grid[current]):
       - `dp[i][j] = max(dp[i][j], 1 + dp[next_row][j+1])`
3. The answer is `max(dp[i][0])` for all i

This approach runs in O(m\*n) time since we process each cell once and check at most 3 neighbors for each.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m * n) | Space: O(m * n)
def maxMoves(grid):
    """
    Returns the maximum number of moves starting from any cell in the first column.

    Approach: Dynamic Programming from right to left.
    dp[i][j] = max moves starting from cell (i, j)
    """
    m, n = len(grid), len(grid[0])

    # dp[i][j] will store the maximum moves starting from cell (i, j)
    dp = [[0] * n for _ in range(m)]

    # Process columns from right to left (n-2 to 0)
    # We start from second last column because last column has 0 moves
    for col in range(n - 2, -1, -1):
        for row in range(m):
            # Check three possible moves: up-right, right, down-right
            # Each move must be within bounds and go to a cell with greater value

            # Move up-right: (row-1, col+1)
            if row - 1 >= 0 and grid[row][col] < grid[row - 1][col + 1]:
                dp[row][col] = max(dp[row][col], 1 + dp[row - 1][col + 1])

            # Move right: (row, col+1)
            if grid[row][col] < grid[row][col + 1]:
                dp[row][col] = max(dp[row][col], 1 + dp[row][col + 1])

            # Move down-right: (row+1, col+1)
            if row + 1 < m and grid[row][col] < grid[row + 1][col + 1]:
                dp[row][col] = max(dp[row][col], 1 + dp[row + 1][col + 1])

    # Answer is the maximum starting from any cell in the first column
    max_moves = 0
    for row in range(m):
        max_moves = max(max_moves, dp[row][0])

    return max_moves
```

```javascript
// Time: O(m * n) | Space: O(m * n)
function maxMoves(grid) {
  /**
   * Returns the maximum number of moves starting from any cell in the first column.
   *
   * Approach: Dynamic Programming from right to left.
   * dp[i][j] = max moves starting from cell (i, j)
   */
  const m = grid.length;
  const n = grid[0].length;

  // dp[i][j] will store the maximum moves starting from cell (i, j)
  const dp = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  // Process columns from right to left (n-2 to 0)
  // We start from second last column because last column has 0 moves
  for (let col = n - 2; col >= 0; col--) {
    for (let row = 0; row < m; row++) {
      // Check three possible moves: up-right, right, down-right
      // Each move must be within bounds and go to a cell with greater value

      // Move up-right: (row-1, col+1)
      if (row - 1 >= 0 && grid[row][col] < grid[row - 1][col + 1]) {
        dp[row][col] = Math.max(dp[row][col], 1 + dp[row - 1][col + 1]);
      }

      // Move right: (row, col+1)
      if (grid[row][col] < grid[row][col + 1]) {
        dp[row][col] = Math.max(dp[row][col], 1 + dp[row][col + 1]);
      }

      // Move down-right: (row+1, col+1)
      if (row + 1 < m && grid[row][col] < grid[row + 1][col + 1]) {
        dp[row][col] = Math.max(dp[row][col], 1 + dp[row + 1][col + 1]);
      }
    }
  }

  // Answer is the maximum starting from any cell in the first column
  let maxMoves = 0;
  for (let row = 0; row < m; row++) {
    maxMoves = Math.max(maxMoves, dp[row][0]);
  }

  return maxMoves;
}
```

```java
// Time: O(m * n) | Space: O(m * n)
class Solution {
    public int maxMoves(int[][] grid) {
        /**
         * Returns the maximum number of moves starting from any cell in the first column.
         *
         * Approach: Dynamic Programming from right to left.
         * dp[i][j] = max moves starting from cell (i, j)
         */
        int m = grid.length;
        int n = grid[0].length;

        // dp[i][j] will store the maximum moves starting from cell (i, j)
        int[][] dp = new int[m][n];

        // Process columns from right to left (n-2 to 0)
        // We start from second last column because last column has 0 moves
        for (int col = n - 2; col >= 0; col--) {
            for (int row = 0; row < m; row++) {
                // Check three possible moves: up-right, right, down-right
                // Each move must be within bounds and go to a cell with greater value

                // Move up-right: (row-1, col+1)
                if (row - 1 >= 0 && grid[row][col] < grid[row - 1][col + 1]) {
                    dp[row][col] = Math.max(dp[row][col], 1 + dp[row - 1][col + 1]);
                }

                // Move right: (row, col+1)
                if (grid[row][col] < grid[row][col + 1]) {
                    dp[row][col] = Math.max(dp[row][col], 1 + dp[row][col + 1]);
                }

                // Move down-right: (row+1, col+1)
                if (row + 1 < m && grid[row][col] < grid[row + 1][col + 1]) {
                    dp[row][col] = Math.max(dp[row][col], 1 + dp[row + 1][col + 1]);
                }
            }
        }

        // Answer is the maximum starting from any cell in the first column
        int maxMoves = 0;
        for (int row = 0; row < m; row++) {
            maxMoves = Math.max(maxMoves, dp[row][0]);
        }

        return maxMoves;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- We iterate through each of the m × n cells exactly once
- For each cell, we check at most 3 neighboring cells (constant time)
- Total operations: m × n × 3 = O(m × n)

**Space Complexity:** O(m × n)

- We store a dp table of size m × n
- We could optimize to O(m) by only storing the current and next column, but the code is clearer with the full table
- The input grid itself is O(m × n), but that's given and not counted in auxiliary space

## Common Mistakes

1. **Processing columns left to right instead of right to left:** If you process left to right, you won't have computed dp values for the next column yet. The dependency is: dp[i][j] depends on dp values in column j+1, so we must process from right to left.

2. **Forgetting to check bounds for diagonal moves:** When checking (row-1, col+1) or (row+1, col+1), you must ensure row-1 ≥ 0 and row+1 < m. Missing these bounds checks causes index out of range errors.

3. **Not enforcing the "strictly greater" condition:** The problem states you can only move to cells with greater values. Some candidates mistakenly use ≥ (greater than or equal to), which is incorrect.

4. **Returning dp[0][0] instead of max(dp[i][0]):** The answer is the maximum starting from ANY cell in the first column, not just (0,0). You must check all starting rows.

## When You'll See This Pattern

This grid DP pattern appears in many problems where you need to find optimal paths through a grid with specific movement rules:

1. **Minimum Path Sum (LeetCode 64)** - Similar DP approach but with different movement rules (only down and right) and optimization criteria (minimize sum).

2. **Unique Paths II (LeetCode 63)** - Grid traversal with obstacles, using DP to count valid paths.

3. **Dungeon Game (LeetCode 174)** - More complex grid DP where you need to find minimum initial health, requiring right-to-left DP like this problem.

The key pattern is: when you need to find an optimal path through a grid and the decision at each cell depends on future cells, think about dynamic programming from the end to the beginning.

## Key Takeaways

1. **Right-to-left DP is natural for forward-moving constraints:** When you can only move forward (to higher column indices), processing from right to left ensures you have computed the future states you depend on.

2. **Grid DP often involves checking multiple neighbors:** Unlike 1D DP where you typically check 1-2 previous states, grid DP often involves checking multiple directional neighbors (here: up-right, right, down-right).

3. **The state definition is crucial:** Defining `dp[i][j]` as "maximum moves starting from (i,j)" makes the recurrence relation clear: it's 1 + max(valid moves to next column).

[Practice this problem on CodeJeet](/problem/maximum-number-of-moves-in-a-grid)
