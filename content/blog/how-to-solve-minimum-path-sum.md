---
title: "How to Solve Minimum Path Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Path Sum. Medium difficulty, 67.8% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2026-06-13"
category: "dsa-patterns"
tags: ["minimum-path-sum", "array", "dynamic-programming", "matrix", "medium"]
---

# How to Solve Minimum Path Sum

You're given a grid of non-negative numbers and need to find the path from the top-left to bottom-right corner that minimizes the sum of numbers along the path. You can only move down or right. What makes this problem interesting is that it looks like a simple traversal problem, but the optimal solution requires recognizing that local greedy choices don't work—you need to consider the entire path. This is a classic dynamic programming problem that tests whether you can see the overlapping subproblems structure.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this 3×3 grid:

```
grid = [
  [1, 3, 1],
  [1, 5, 1],
  [4, 2, 1]
]
```

We start at the top-left cell `(0,0)` with value 1. Our goal is to reach `(2,2)` with the minimum sum.

If we try to think greedily (always picking the smaller adjacent value), we'd go:

- From `(0,0)=1` to `(0,1)=3` (right) because 3 < 1? Wait, that's not right—we're comparing the next cells, not the current ones. Actually, from `(0,0)`, we can go to `(0,1)=3` or `(1,0)=1`. The greedy choice would be `(1,0)=1` since 1 < 3. But this greedy path `1→1→4→2→1` gives us sum 9, while the optimal path `1→3→1→1→1` gives us sum 7. So greedy fails!

The key insight: The minimum sum to reach any cell `(i,j)` depends only on:

1. The minimum sum to reach the cell above it `(i-1,j)`
2. The minimum sum to reach the cell to its left `(i,j-1)`
3. Plus the value at `(i,j)` itself

Let's build this bottom-up:

- `(0,0)`: Minimum sum = 1 (starting point)
- `(0,1)`: Can only come from left: 1 + 3 = 4
- `(0,2)`: Can only come from left: 4 + 1 = 5
- `(1,0)`: Can only come from above: 1 + 1 = 2
- `(1,1)`: Can come from above (2) or left (4). Choose minimum: min(2,4) + 5 = 7
- `(1,2)`: Can come from above (5) or left (7). Choose minimum: min(5,7) + 1 = 6
- `(2,0)`: Can only come from above: 2 + 4 = 6
- `(2,1)`: Can come from above (7) or left (6). Choose minimum: min(7,6) + 2 = 8
- `(2,2)`: Can come from above (6) or left (8). Choose minimum: min(6,8) + 1 = 7

The minimum path sum is 7, which matches our earlier optimal path.

## Brute Force Approach

The brute force solution would explore all possible paths from top-left to bottom-right. Since at each cell we have 2 choices (down or right), and we need to make (m-1)+(n-1) moves, the total number of paths is the binomial coefficient C((m-1)+(n-1), (m-1)). For an m×n grid, this is exponential in m and n.

Here's what the brute force recursion would look like:

```python
def minPathSum(grid):
    def dfs(i, j):
        if i == len(grid)-1 and j == len(grid[0])-1:
            return grid[i][j]
        if i >= len(grid) or j >= len(grid[0]):
            return float('inf')

        down = dfs(i+1, j)
        right = dfs(i, j+1)

        return grid[i][j] + min(down, right)

    return dfs(0, 0)
```

This solution has exponential time complexity O(2^(m+n)) because it explores every possible path. For a 10×10 grid, that's about 2^20 ≈ 1 million operations. For a 20×20 grid, it's 2^40 ≈ 1 trillion operations—completely impractical.

The problem with brute force is that it recalculates the same subproblems over and over. For example, to compute the minimum sum to reach cell `(1,1)`, we might compute it multiple times from different paths. This is where dynamic programming comes in.

## Optimized Approach

The key insight is that this problem has **optimal substructure** and **overlapping subproblems**—the hallmarks of dynamic programming.

**Optimal substructure**: The optimal path to `(i,j)` must pass through either `(i-1,j)` or `(i,j-1)`. If it didn't, we could improve it by changing the last step.

**Overlapping subproblems**: The minimum sum to reach `(i,j)` is needed to compute the minimum sum for `(i+1,j)` and `(i,j+1)`.

We can solve this with a 2D DP table where `dp[i][j]` represents the minimum path sum to reach cell `(i,j)`. The recurrence relation is:

- `dp[0][0] = grid[0][0]`
- For the first row: `dp[0][j] = dp[0][j-1] + grid[0][j]` (can only come from left)
- For the first column: `dp[i][0] = dp[i-1][0] + grid[i][0]` (can only come from above)
- For other cells: `dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]`

We can optimize space further: since we only need the previous row and current row (or previous column and current column), we can reduce space from O(m×n) to O(min(m,n)).

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(m×n) | Space: O(1) - modifying input grid
def minPathSum(grid):
    """
    Find minimum path sum from top-left to bottom-right in a grid.
    Only moves allowed: down or right.

    Args:
        grid: List[List[int]] - 2D grid of non-negative integers

    Returns:
        int - minimum path sum
    """
    m, n = len(grid), len(grid[0])

    # Fill first row: each cell can only be reached from the left
    for j in range(1, n):
        grid[0][j] += grid[0][j-1]

    # Fill first column: each cell can only be reached from above
    for i in range(1, m):
        grid[i][0] += grid[i-1][0]

    # Fill remaining cells: each cell can be reached from above or left
    # Choose the minimum of the two possible paths
    for i in range(1, m):
        for j in range(1, n):
            # Minimum path to current cell = value at current cell +
            # minimum of path from above or left
            grid[i][j] += min(grid[i-1][j], grid[i][j-1])

    # Bottom-right cell now contains the minimum path sum
    return grid[m-1][n-1]
```

```javascript
// Time: O(m×n) | Space: O(1) - modifying input grid
function minPathSum(grid) {
  /**
   * Find minimum path sum from top-left to bottom-right in a grid.
   * Only moves allowed: down or right.
   *
   * @param {number[][]} grid - 2D grid of non-negative integers
   * @return {number} - minimum path sum
   */
  const m = grid.length;
  const n = grid[0].length;

  // Fill first row: each cell can only be reached from the left
  for (let j = 1; j < n; j++) {
    grid[0][j] += grid[0][j - 1];
  }

  // Fill first column: each cell can only be reached from above
  for (let i = 1; i < m; i++) {
    grid[i][0] += grid[i - 1][0];
  }

  // Fill remaining cells: each cell can be reached from above or left
  // Choose the minimum of the two possible paths
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      // Minimum path to current cell = value at current cell +
      // minimum of path from above or left
      grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
    }
  }

  // Bottom-right cell now contains the minimum path sum
  return grid[m - 1][n - 1];
}
```

```java
// Time: O(m×n) | Space: O(1) - modifying input grid
class Solution {
    public int minPathSum(int[][] grid) {
        /**
         * Find minimum path sum from top-left to bottom-right in a grid.
         * Only moves allowed: down or right.
         *
         * @param grid - 2D grid of non-negative integers
         * @return minimum path sum
         */
        int m = grid.length;
        int n = grid[0].length;

        // Fill first row: each cell can only be reached from the left
        for (int j = 1; j < n; j++) {
            grid[0][j] += grid[0][j-1];
        }

        // Fill first column: each cell can only be reached from above
        for (int i = 1; i < m; i++) {
            grid[i][0] += grid[i-1][0];
        }

        // Fill remaining cells: each cell can be reached from above or left
        // Choose the minimum of the two possible paths
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                // Minimum path to current cell = value at current cell +
                // minimum of path from above or left
                grid[i][j] += Math.min(grid[i-1][j], grid[i][j-1]);
            }
        }

        // Bottom-right cell now contains the minimum path sum
        return grid[m-1][n-1];
    }
}
```

</div>

**Alternative space-optimized version** (if you can't modify input):

<div class="code-group">

```python
# Time: O(m×n) | Space: O(n) - using only 1D DP array
def minPathSum(grid):
    m, n = len(grid), len(grid[0])

    # Initialize dp array with first row
    dp = [0] * n
    dp[0] = grid[0][0]

    # Fill first row
    for j in range(1, n):
        dp[j] = dp[j-1] + grid[0][j]

    # Fill remaining rows
    for i in range(1, m):
        # First column in current row
        dp[0] += grid[i][0]

        for j in range(1, n):
            # dp[j] currently holds value from row above (i-1, j)
            # dp[j-1] holds value from current row, previous column (i, j-1)
            dp[j] = min(dp[j], dp[j-1]) + grid[i][j]

    return dp[n-1]
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n)**

- We iterate through every cell in the m×n grid exactly once
- For each cell, we perform O(1) operations (addition and comparison)
- Total operations = m × n

**Space Complexity: O(1) for in-place modification, O(min(m,n)) for optimized DP**

- In-place modification: We reuse the input grid, so no extra space beyond a few variables
- Optimized DP: We can use a 1D array of size n (or m) to store only the current and previous row
- If we create a separate DP table without modifying input: O(m×n)

## Common Mistakes

1. **Trying greedy approach**: Candidates often think "always go to the smaller adjacent cell." This fails because a locally optimal choice doesn't guarantee global optimality. The example in the visual walkthrough shows why.

2. **Forgetting to handle the first row and column separately**: These cells have only one way to reach them (from left for first row, from above for first column). If you apply the general formula `min(above, left)` to them without checking bounds, you'll get index errors or incorrect results.

3. **Incorrect initialization**: When using a separate DP array, you need to initialize `dp[0][0] = grid[0][0]`. A common mistake is initializing everything to 0, which works for the first cell but causes issues when you add `grid[i][j]` to it.

4. **Off-by-one errors in loops**: When iterating from 1 to m-1 or 1 to n-1, remember that Python/JavaScript use 0-based indexing but the problem statement often uses 1-based terminology. Double-check your loop boundaries.

5. **Not considering non-negative constraint**: The problem states numbers are non-negative. This matters because if negative numbers were allowed, we'd need different logic (like in Dungeon Game).

## When You'll See This Pattern

This minimum path sum problem is a classic **2D dynamic programming** pattern. You'll see similar patterns in:

1. **Unique Paths (LeetCode 62)**: Instead of summing values, you count the number of unique paths. The recurrence is similar: `dp[i][j] = dp[i-1][j] + dp[i][j-1]`.

2. **Dungeon Game (LeetCode 174)**: A harder variation where you need minimum initial health. You work backwards from the bottom-right to top-left because the optimal substructure works in reverse.

3. **Triangle (LeetCode 120)**: Minimum path sum in a triangular array. Similar concept but with a different grid structure.

4. **Cherry Pickup (LeetCode 741)**: A more complex 2D DP where you make two passes through the grid.

The core pattern to recognize: When you have a grid and can only move in certain directions (usually down/right or up/left), and you need to optimize some cumulative value (sum, count, etc.), think 2D dynamic programming.

## Key Takeaways

1. **Grid + restricted movement + optimization = DP**: When you see a grid problem where you can only move in certain directions and need to find an optimal path, dynamic programming is usually the solution.

2. **Start with brute force recursion, then memoize**: The brute force recursion reveals the recurrence relation. Once you have that, you can implement bottom-up DP for better efficiency.

3. **Space optimization is often possible**: For 2D DP problems, you can usually reduce space from O(m×n) to O(min(m,n)) by noticing you only need the previous row/column.

4. **Handle edges separately**: The first row and first column often have simpler recurrence relations because they have fewer incoming paths.

Related problems: [Unique Paths](/problem/unique-paths), [Dungeon Game](/problem/dungeon-game), [Cherry Pickup](/problem/cherry-pickup)
