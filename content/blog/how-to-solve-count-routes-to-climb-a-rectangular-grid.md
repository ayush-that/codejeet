---
title: "How to Solve Count Routes to Climb a Rectangular Grid — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Routes to Climb a Rectangular Grid. Hard difficulty, 24.0% acceptance rate. Topics: Array, Dynamic Programming, Matrix, Prefix Sum."
date: "2026-09-23"
category: "dsa-patterns"
tags: ["count-routes-to-climb-a-rectangular-grid", "array", "dynamic-programming", "matrix", "hard"]
---

# How to Solve Count Routes to Climb a Rectangular Grid

You're given a rectangular grid where some cells are blocked, and you need to count the number of valid routes from the bottom-left corner to the top-right corner, moving only right or up. The challenge is that blocked cells make certain paths impossible, and the grid can be large (up to 1000×1000), requiring an efficient solution. What makes this problem interesting is that it's not just a simple path-counting problem—you need to handle obstacles while maintaining computational efficiency.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this 3×3 grid:

```
grid = [
    "..#",
    ".#.",
    "..."
]
```

We need to count routes from (0,0) to (2,2), moving only right or up. The grid coordinates: (0,0) is bottom-left, (2,2) is top-right.

**Step-by-step reasoning:**

1. Starting at (0,0): It's available ('.'), so we can start here.
2. From (0,0), we can move to (1,0) or (0,1).
3. Check (1,0): It's available ('.'), so we can reach it.
4. Check (0,1): It's available ('.'), so we can reach it.
5. Continue this process, but note that (1,1) is blocked ('#'), so no routes can pass through it.
6. Also, (2,0) is blocked ('#'), so no routes can pass through it.

The valid routes would be:

- (0,0) → (0,1) → (0,2) → (1,2) → (2,2)
- (0,0) → (0,1) → (1,1) is blocked, so no route through there
- (0,0) → (1,0) → (2,0) is blocked, so no route through there
- (0,0) → (1,0) → (1,1) is blocked, so no route through there

Actually, with these obstacles, there's only one valid path: go all the way up the left column, then all the way right along the top row. But wait—(0,2) to (1,2) to (2,2) is valid since those cells are available.

This visualization shows why we need a systematic approach: manually counting becomes impractical even for moderate-sized grids.

## Brute Force Approach

A naive approach would be to explore all possible paths using DFS (Depth-First Search) or BFS (Breadth-First Search). Starting from the bottom-left, we'd recursively try moving right and up until we either:

1. Reach the destination (count it as 1 valid route)
2. Hit a blocked cell (count it as 0)
3. Go out of bounds (count it as 0)

The brute force code would look something like this:

<div class="code-group">

```python
def countRoutesBruteForce(grid):
    n = len(grid)      # number of rows
    m = len(grid[0])   # number of columns

    def dfs(i, j):
        # If out of bounds or blocked
        if i >= n or j >= m or grid[i][j] == '#':
            return 0
        # If reached destination
        if i == n-1 and j == m-1:
            return 1
        # Try moving right and up
        return dfs(i, j+1) + dfs(i+1, j)

    return dfs(0, 0)
```

```javascript
function countRoutesBruteForce(grid) {
  const n = grid.length;
  const m = grid[0].length;

  function dfs(i, j) {
    // If out of bounds or blocked
    if (i >= n || j >= m || grid[i][j] === "#") {
      return 0;
    }
    // If reached destination
    if (i === n - 1 && j === m - 1) {
      return 1;
    }
    // Try moving right and up
    return dfs(i, j + 1) + dfs(i + 1, j);
  }

  return dfs(0, 0);
}
```

```java
public int countRoutesBruteForce(String[] grid) {
    int n = grid.length;
    int m = grid[0].length();

    return dfs(0, 0, grid, n, m);
}

private int dfs(int i, int j, String[] grid, int n, int m) {
    // If out of bounds or blocked
    if (i >= n || j >= m || grid[i].charAt(j) == '#') {
        return 0;
    }
    // If reached destination
    if (i == n-1 && j == m-1) {
        return 1;
    }
    // Try moving right and up
    return dfs(i, j+1, grid, n, m) + dfs(i+1, j, grid, n, m);
}
```

</div>

**Why this is insufficient:** The time complexity is exponential—O(2^(n+m)) in the worst case. For a 1000×1000 grid, this is astronomically large (2^2000 operations). We need a better approach.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem. Notice two important properties:

1. **Optimal substructure**: The number of ways to reach cell (i,j) depends only on the number of ways to reach (i-1,j) and (i,j-1).
2. **Overlapping subproblems**: The brute force recalculates the same subproblems repeatedly.

We can use a 2D DP array where `dp[i][j]` represents the number of ways to reach cell (i,j) from the start. The recurrence relation is:

- If cell (i,j) is blocked: `dp[i][j] = 0`
- Otherwise: `dp[i][j] = dp[i-1][j] + dp[i][j-1]` (ways from above + ways from left)

Base cases:

- Starting cell (0,0): If it's not blocked, `dp[0][0] = 1`, else `dp[0][0] = 0`
- First row (i=0): Can only come from left, so `dp[0][j] = dp[0][j-1]` if not blocked
- First column (j=0): Can only come from above, so `dp[i][0] = dp[i-1][0]` if not blocked

We need to be careful with modulo arithmetic since the number of routes can be huge.

## Optimal Solution

Here's the complete DP solution with detailed comments:

<div class="code-group">

```python
# Time: O(n*m) - We process each cell once
# Space: O(n*m) - For the DP table
def countRoutes(grid):
    n = len(grid)      # number of rows
    m = len(grid[0])   # number of columns
    MOD = 10**9 + 7    # Modulo value to prevent overflow

    # Create DP table initialized with zeros
    dp = [[0] * m for _ in range(n)]

    # Base case: starting cell
    if grid[0][0] == '.':
        dp[0][0] = 1
    else:
        return 0  # Starting cell blocked, no routes possible

    # Fill first column (can only come from above)
    for i in range(1, n):
        if grid[i][0] == '.':
            dp[i][0] = dp[i-1][0]  # Only way is from cell above
        else:
            dp[i][0] = 0  # Blocked cell, no routes through here

    # Fill first row (can only come from left)
    for j in range(1, m):
        if grid[0][j] == '.':
            dp[0][j] = dp[0][j-1]  # Only way is from cell to the left
        else:
            dp[0][j] = 0  # Blocked cell, no routes through here

    # Fill the rest of the DP table
    for i in range(1, n):
        for j in range(1, m):
            if grid[i][j] == '#':
                dp[i][j] = 0  # Blocked cell
            else:
                # Ways to reach current cell = ways from above + ways from left
                dp[i][j] = (dp[i-1][j] + dp[i][j-1]) % MOD

    # The answer is in the bottom-right corner
    return dp[n-1][m-1]
```

```javascript
// Time: O(n*m) - We process each cell once
// Space: O(n*m) - For the DP table
function countRoutes(grid) {
  const n = grid.length;
  const m = grid[0].length;
  const MOD = 10 ** 9 + 7;

  // Create DP table initialized with zeros
  const dp = Array(n)
    .fill()
    .map(() => Array(m).fill(0));

  // Base case: starting cell
  if (grid[0][0] === ".") {
    dp[0][0] = 1;
  } else {
    return 0; // Starting cell blocked, no routes possible
  }

  // Fill first column (can only come from above)
  for (let i = 1; i < n; i++) {
    if (grid[i][0] === ".") {
      dp[i][0] = dp[i - 1][0]; // Only way is from cell above
    } else {
      dp[i][0] = 0; // Blocked cell
    }
  }

  // Fill first row (can only come from left)
  for (let j = 1; j < m; j++) {
    if (grid[0][j] === ".") {
      dp[0][j] = dp[0][j - 1]; // Only way is from cell to the left
    } else {
      dp[0][j] = 0; // Blocked cell
    }
  }

  // Fill the rest of the DP table
  for (let i = 1; i < n; i++) {
    for (let j = 1; j < m; j++) {
      if (grid[i][j] === "#") {
        dp[i][j] = 0; // Blocked cell
      } else {
        // Ways to reach current cell = ways from above + ways from left
        dp[i][j] = (dp[i - 1][j] + dp[i][j - 1]) % MOD;
      }
    }
  }

  // The answer is in the bottom-right corner
  return dp[n - 1][m - 1];
}
```

```java
// Time: O(n*m) - We process each cell once
// Space: O(n*m) - For the DP table
public int countRoutes(String[] grid) {
    int n = grid.length;
    int m = grid[0].length();
    final int MOD = 1000000007;

    // Create DP table
    int[][] dp = new int[n][m];

    // Base case: starting cell
    if (grid[0].charAt(0) == '.') {
        dp[0][0] = 1;
    } else {
        return 0;  // Starting cell blocked, no routes possible
    }

    // Fill first column (can only come from above)
    for (int i = 1; i < n; i++) {
        if (grid[i].charAt(0) == '.') {
            dp[i][0] = dp[i-1][0];  // Only way is from cell above
        } else {
            dp[i][0] = 0;  // Blocked cell
        }
    }

    // Fill first row (can only come from left)
    for (int j = 1; j < m; j++) {
        if (grid[0].charAt(j) == '.') {
            dp[0][j] = dp[0][j-1];  // Only way is from cell to the left
        } else {
            dp[0][j] = 0;  // Blocked cell
        }
    }

    // Fill the rest of the DP table
    for (int i = 1; i < n; i++) {
        for (int j = 1; j < m; j++) {
            if (grid[i].charAt(j) == '#') {
                dp[i][j] = 0;  // Blocked cell
            } else {
                // Ways to reach current cell = ways from above + ways from left
                dp[i][j] = (dp[i-1][j] + dp[i][j-1]) % MOD;
            }
        }
    }

    // The answer is in the bottom-right corner
    return dp[n-1][m-1];
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m)

- We iterate through each cell of the grid exactly once
- For each cell, we perform constant-time operations (check if blocked, add two numbers, take modulo)
- This is optimal since we must at least look at each cell once to determine if it's blocked

**Space Complexity:** O(n × m)

- We store a DP table of size n × m
- We could optimize to O(min(n, m)) by only keeping the current and previous rows, but the n × m approach is clearer and easier to understand in interviews

## Common Mistakes

1. **Forgetting to handle the starting cell**: If the starting cell (0,0) is blocked, the answer should be 0 immediately. Some candidates start with dp[0][0] = 1 without checking.

2. **Not using modulo arithmetic**: The number of routes can grow exponentially and quickly exceed integer limits. Always apply modulo operations when adding counts.

3. **Incorrect boundary conditions**: For the first row and first column, the recurrence is different. In the first row, you can only come from the left; in the first column, you can only come from above. Mixing these up leads to incorrect counts.

4. **Confusing row and column indices**: Remember that grid[i][j] typically means row i, column j. When moving "right", j increases; when moving "up", i increases (if (0,0) is bottom-left).

## When You'll See This Pattern

This grid path counting with obstacles is a classic DP pattern that appears in various forms:

1. **Unique Paths II (LeetCode 63)**: Almost identical problem—count paths from top-left to bottom-right with obstacles, moving only down or right.

2. **Minimum Path Sum (LeetCode 64)**: Instead of counting paths, find the path with minimum sum of values, moving only down or right. Uses similar DP structure.

3. **Dungeon Game (LeetCode 174)**: More complex version where you need to ensure the knight never drops below 1 health, moving only right or down.

The core pattern is: when you have a grid and can only move in certain directions (usually right/down or up/right), and you need to compute some cumulative value (counts, sums, minimums), dynamic programming is almost always the solution.

## Key Takeaways

1. **Grid movement with restricted directions often leads to DP solutions**: When you can only move right and up (or down and right), the number of ways to reach a cell depends only on the cells to its left and above.

2. **Handle base cases and boundaries carefully**: The first row and first column have different recurrence relations than interior cells. Always check if the starting cell is accessible.

3. **Modulo arithmetic is crucial for counting problems**: When counting combinatorial objects, the numbers can grow very large. Always apply modulo operations during computation, not just at the end.

[Practice this problem on CodeJeet](/problem/count-routes-to-climb-a-rectangular-grid)
