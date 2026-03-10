---
title: "How to Solve Minimum Path Cost in a Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Path Cost in a Grid. Medium difficulty, 67.9% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2028-11-19"
category: "dsa-patterns"
tags: ["minimum-path-cost-in-a-grid", "array", "dynamic-programming", "matrix", "medium"]
---

# How to Solve Minimum Path Cost in a Grid

You're given an `m x n` grid where each cell contains a unique integer from `0` to `m*n-1`. Starting from any cell in the first row, you need to reach the last row, moving only to cells in the next row. The cost of moving from cell `(r, c)` to `(r+1, k)` is `grid[r+1][k]`. Your task is to find the minimum total cost to reach the last row from the first row.

What makes this problem interesting is that while it looks like a standard dynamic programming grid problem, you can move from any column in one row to any column in the next row, creating `n²` possible transitions between rows. This means a naive approach would be too slow for larger grids.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [
    [5, 1, 2],
    [4, 0, 3]
]
```

We have a 2×3 grid (2 rows, 3 columns). Starting from the first row, we need to reach the second row.

**Step 1: Starting costs**

- Starting from `grid[0][0] = 5`: cost so far = 5
- Starting from `grid[0][1] = 1`: cost so far = 1
- Starting from `grid[0][2] = 2`: cost so far = 2

**Step 2: Moving to row 1**
From each starting cell, we can move to any cell in row 1:

- From (0,0) with cost 5:
  - To (1,0): total = 5 + 4 = 9
  - To (1,1): total = 5 + 0 = 5
  - To (1,2): total = 5 + 3 = 8
- From (0,1) with cost 1:
  - To (1,0): total = 1 + 4 = 5
  - To (1,1): total = 1 + 0 = 1
  - To (1,2): total = 1 + 3 = 4
- From (0,2) with cost 2:
  - To (1,0): total = 2 + 4 = 6
  - To (1,1): total = 2 + 0 = 2
  - To (1,2): total = 2 + 3 = 5

**Step 3: Finding minimum**
The minimum total cost to reach row 1 is 1 (from starting at (0,1) and moving to (1,1)).

Notice that for each cell in row 1, we need the minimum of: `(starting cost from any cell in row 0) + (grid[1][current column])`. This gives us the DP recurrence.

## Brute Force Approach

A brute force approach would explore all possible paths from the first row to the last row. Since from each cell in row `r` you can move to any of `n` cells in row `r+1`, and there are `m-1` transitions to make, the total number of paths is `n × n^(m-1) = n^m`.

For each path, we'd sum up the costs:

- Start with a value from the first row
- Add the value from each cell we visit in subsequent rows

This approach has exponential time complexity `O(n^m)`, which is completely impractical for even moderately sized grids (e.g., with `m=10` and `n=10`, that's `10^10` paths).

## Optimized Approach

The key insight is that this is a **dynamic programming** problem. For each cell in the current row, we need to know: what's the minimum cost to reach this cell from the previous row?

Let's define `dp[r][c]` as the minimum total cost to reach cell `(r, c)`.

The recurrence relation is:

```
dp[r][c] = min(dp[r-1][k] for all k from 0 to n-1) + grid[r][c]
```

Wait, that's not quite right! We need to be careful: the problem states that when moving from `(r-1, k)` to `(r, c)`, we pay `grid[r][c]` as the cost. But `dp[r-1][k]` already includes the cost of being at `(r-1, k)`, which is `grid[r-1][k]`. So the correct recurrence is:

```
dp[r][c] = min(dp[r-1][k] for all k from 0 to n-1) + grid[r][c]
```

For the first row, we simply have:

```
dp[0][c] = grid[0][c]
```

The answer will be `min(dp[m-1][c] for all c from 0 to n-1)`.

However, computing `min(dp[r-1][k] for all k)` for each cell in row `r` would give us `O(m × n²)` time complexity. We can optimize this to `O(m × n)` by precomputing the minimum value from the previous row.

## Optimal Solution

We can solve this in `O(m × n)` time with `O(n)` space by only keeping track of the current and previous rows. For each new row, we:

1. Find the minimum value in the previous row's dp array
2. For each cell in the current row, compute: `min(prev_row_min, ...) + grid[current_row][current_col]`

Actually, there's a subtlety: when we're at column `j` in the current row, if the minimum in the previous row came from column `j`, we need the _second_ minimum instead (since we can't stay in the same column when moving down? Wait, re-reading the problem: "you can move to any other cell in the next row" - this suggests we CAN move to the same column index! The problem says "any other cell" but looking at examples, you can move to the same column. So we don't need to worry about this.)

Let's implement the straightforward DP approach:

<div class="code-group">

```python
# Time: O(m × n) | Space: O(n)
def minPathCost(grid):
    """
    Calculate the minimum path cost from the first row to the last row.

    Args:
        grid: 2D list of integers with dimensions m x n

    Returns:
        Minimum total cost to reach the last row from the first row
    """
    m, n = len(grid), len(grid[0])

    # dp array for the current row - stores minimum cost to reach each cell
    # Start with the first row values
    dp = grid[0][:]

    # Process each subsequent row
    for r in range(1, m):
        # Create a new dp array for the current row
        new_dp = [0] * n

        # Find the minimum value in the previous row's dp
        prev_min = min(dp)

        # For each column in the current row
        for c in range(n):
            # The cost to reach current cell is:
            # minimum cost to reach any cell in previous row + current cell value
            new_dp[c] = prev_min + grid[r][c]

        # Update dp for the next iteration
        dp = new_dp

    # The answer is the minimum value in the last row's dp
    return min(dp)
```

```javascript
// Time: O(m × n) | Space: O(n)
function minPathCost(grid) {
  /**
   * Calculate the minimum path cost from the first row to the last row.
   *
   * @param {number[][]} grid - 2D array of integers with dimensions m x n
   * @return {number} Minimum total cost to reach the last row from the first row
   */
  const m = grid.length;
  const n = grid[0].length;

  // dp array for the current row - stores minimum cost to reach each cell
  // Start with the first row values
  let dp = [...grid[0]];

  // Process each subsequent row
  for (let r = 1; r < m; r++) {
    // Create a new dp array for the current row
    const newDp = new Array(n).fill(0);

    // Find the minimum value in the previous row's dp
    const prevMin = Math.min(...dp);

    // For each column in the current row
    for (let c = 0; c < n; c++) {
      // The cost to reach current cell is:
      // minimum cost to reach any cell in previous row + current cell value
      newDp[c] = prevMin + grid[r][c];
    }

    // Update dp for the next iteration
    dp = newDp;
  }

  // The answer is the minimum value in the last row's dp
  return Math.min(...dp);
}
```

```java
// Time: O(m × n) | Space: O(n)
class Solution {
    public int minPathCost(int[][] grid) {
        /**
         * Calculate the minimum path cost from the first row to the last row.
         *
         * @param grid 2D array of integers with dimensions m x n
         * @return Minimum total cost to reach the last row from the first row
         */
        int m = grid.length;
        int n = grid[0].length;

        // dp array for the current row - stores minimum cost to reach each cell
        // Start with the first row values
        int[] dp = new int[n];
        for (int c = 0; c < n; c++) {
            dp[c] = grid[0][c];
        }

        // Process each subsequent row
        for (int r = 1; r < m; r++) {
            // Create a new dp array for the current row
            int[] newDp = new int[n];

            // Find the minimum value in the previous row's dp
            int prevMin = Integer.MAX_VALUE;
            for (int val : dp) {
                prevMin = Math.min(prevMin, val);
            }

            // For each column in the current row
            for (int c = 0; c < n; c++) {
                // The cost to reach current cell is:
                // minimum cost to reach any cell in previous row + current cell value
                newDp[c] = prevMin + grid[r][c];
            }

            // Update dp for the next iteration
            dp = newDp;
        }

        // The answer is the minimum value in the last row's dp
        int result = Integer.MAX_VALUE;
        for (int val : dp) {
            result = Math.min(result, val);
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We iterate through all `m` rows
- For each row, we:
  - Find the minimum of the previous row's dp array: O(n)
  - Compute new values for each of the `n` columns: O(n)
- Total: O(m × n)

**Space Complexity: O(n)**

- We only store two arrays of size `n`: the current dp row and the new dp row
- This is much better than O(m × n) which would be needed for a full DP table

## Common Mistakes

1. **Misunderstanding the cost calculation**: Some candidates think the movement cost is `grid[r][c] + grid[r+1][k]` (sum of both cells), but it's actually just `grid[r+1][k]`. The starting cell's value is included as the initial cost.

2. **Using O(m × n) space unnecessarily**: While a full DP table with O(m × n) space would work and is easier to understand, it's not optimal. Interviewers often look for candidates who can optimize space usage.

3. **Forgetting to handle the base case**: The first row needs special handling since there's no previous row to come from. Each cell in the first row has cost equal to its own value.

4. **Incorrectly computing the minimum**: Some candidates try to find the minimum for each cell by scanning the previous row inside the inner loop, resulting in O(m × n²) time complexity. Always precompute the row minimum outside the column loop.

## When You'll See This Pattern

This problem uses a **row-by-row dynamic programming** pattern that appears in many grid problems:

1. **Minimum Path Sum (LeetCode 64)**: Similar but you can only move right or down, not to any column in the next row.

2. **Triangle (LeetCode 120)**: Find minimum path sum in a triangle where you can move to adjacent numbers on the next row.

3. **Paint House (LeetCode 256)**: Similar DP structure where you choose between options with different costs, minimizing total cost while avoiding same choices in adjacent rows.

The key pattern is: when you need to make a sequence of choices (one per row/step) and the cost depends on both your current choice and previous choices, DP is often the solution.

## Key Takeaways

1. **Row-by-row DP is powerful for grid problems**: When you need to make one decision per row and the decision affects future costs, consider maintaining a DP array that represents the best cost to reach each position in the current row.

2. **Space optimization is often possible**: If you only need values from the previous row to compute the current row, you can reduce space from O(m × n) to O(n).

3. **Look for opportunities to precompute**: Instead of recomputing the minimum for each cell (O(n²)), compute it once per row (O(n)).

Related problems: [Unique Paths](/problem/unique-paths), [Unique Paths II](/problem/unique-paths-ii), [Minimum Path Sum](/problem/minimum-path-sum)
