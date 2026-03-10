---
title: "How to Solve Number of Increasing Paths in a Grid — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Increasing Paths in a Grid. Hard difficulty, 57.4% acceptance rate. Topics: Array, Dynamic Programming, Depth-First Search, Breadth-First Search, Graph Theory."
date: "2027-10-29"
category: "dsa-patterns"
tags:
  [
    "number-of-increasing-paths-in-a-grid",
    "array",
    "dynamic-programming",
    "depth-first-search",
    "hard",
  ]
---

# How to Solve Number of Increasing Paths in a Grid

This problem asks you to count all strictly increasing paths in a grid, where you can start and end at any cell, and move only to adjacent cells (up, down, left, right) with strictly larger values. The challenge is that paths can be of any length, and the number of possible paths grows exponentially with grid size, making brute force enumeration impossible for larger grids. What makes this problem interesting is that while it seems similar to finding the _longest_ increasing path, here we need to count _all_ increasing paths, which requires a different dynamic programming approach.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this 2×2 grid:

```
grid = [[1, 2],
        [3, 4]]
```

We need to count all strictly increasing paths. Let's examine each cell:

**Cell (0,0) = 1:**

- Can go to (0,1)=2 (1 < 2) → path length 2
- Can go to (1,0)=3 (1 < 3) → path length 2
- Total paths starting at (0,0): 2

**Cell (0,1) = 2:**

- Can go to (1,1)=4 (2 < 4) → path length 2
- No other moves (can't go to (0,0)=1 since 2 > 1)
- Total paths starting at (0,1): 1

**Cell (1,0) = 3:**

- Can go to (1,1)=4 (3 < 4) → path length 2
- Total paths starting at (1,0): 1

**Cell (1,1) = 4:**

- No moves possible (all neighbors have smaller values)
- Total paths starting at (1,1): 0

But wait — we also need to count single-cell paths! Every cell itself is a valid path of length 1. So we need to add those:

- Cell (0,0): 1 (itself) + 2 = 3 total paths starting here
- Cell (0,1): 1 + 1 = 2
- Cell (1,0): 1 + 1 = 2
- Cell (1,1): 1 + 0 = 1

Total paths = 3 + 2 + 2 + 1 = 8

The key insight: For each cell, the number of increasing paths starting at that cell equals 1 (for the path consisting of just that cell) plus the sum of paths starting at each neighbor with a larger value. This suggests a recursive relationship that we can compute efficiently with memoization.

## Brute Force Approach

A naive solution would try to enumerate all possible increasing paths starting from each cell using DFS. For each cell, we'd explore all possible next moves to larger-valued neighbors, and count each complete path we find.

The problem with this approach is the exponential time complexity. In the worst case (like a strictly increasing sequence arranged in a snake pattern), each path could be O(m×n) long, and there could be exponentially many such paths. For an m×n grid, the brute force could take O(4^(m×n)) time in pathological cases, which is completely infeasible even for moderate grid sizes.

Even with pruning (only moving to larger values), the number of paths can still grow exponentially. We need a way to avoid recomputing the same subproblems over and over.

## Optimized Approach

The key insight is that the number of increasing paths starting from a given cell depends only on:

1. The cell's value
2. The number of paths starting from its neighbors with larger values

This is a perfect candidate for **dynamic programming with memoization** (also called top-down DP or DFS with memoization). We define:

`dp[r][c]` = number of strictly increasing paths starting at cell (r, c)

The recurrence relation is:

```
dp[r][c] = 1 + sum(dp[nr][nc] for all neighbors (nr, nc) where grid[nr][nc] > grid[r][c])
```

The "1" accounts for the path consisting of just the current cell itself. The sum adds all paths that continue from this cell to larger neighbors.

We compute this recursively with memoization:

- If we've already computed `dp[r][c]`, return it
- Otherwise, compute it by checking all four neighbors
- Store the result before returning

This ensures each cell's value is computed only once, giving us polynomial time complexity instead of exponential.

## Optimal Solution

Here's the complete solution using DFS with memoization:

<div class="code-group">

```python
# Time: O(m * n) | Space: O(m * n)
class Solution:
    def countPaths(self, grid: List[List[int]]) -> int:
        MOD = 10**9 + 7
        m, n = len(grid), len(grid[0])

        # dp[r][c] will store the number of increasing paths starting at (r, c)
        # We use -1 to indicate uncomputed values
        dp = [[-1] * n for _ in range(m)]

        # Directions: up, down, left, right
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

        def dfs(r: int, c: int) -> int:
            """Return number of increasing paths starting at (r, c)."""
            # If already computed, return cached value
            if dp[r][c] != -1:
                return dp[r][c]

            # Start with 1 for the path consisting of just this cell
            total_paths = 1

            # Check all four neighbors
            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                # Check if neighbor is within bounds and has larger value
                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] > grid[r][c]:
                    # Add all paths starting from this neighbor
                    total_paths = (total_paths + dfs(nr, nc)) % MOD

            # Cache the result before returning
            dp[r][c] = total_paths
            return total_paths

        # Sum up paths starting from every cell
        result = 0
        for r in range(m):
            for c in range(n):
                result = (result + dfs(r, c)) % MOD

        return result
```

```javascript
// Time: O(m * n) | Space: O(m * n)
/**
 * @param {number[][]} grid
 * @return {number}
 */
var countPaths = function (grid) {
  const MOD = 1_000_000_007;
  const m = grid.length,
    n = grid[0].length;

  // dp[r][c] stores number of increasing paths starting at (r, c)
  // Use null to indicate uncomputed values
  const dp = Array(m)
    .fill()
    .map(() => Array(n).fill(null));

  // Directions: up, down, left, right
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  /**
   * Returns number of increasing paths starting at (r, c)
   * @param {number} r - row index
   * @param {number} c - column index
   * @return {number}
   */
  const dfs = (r, c) => {
    // If already computed, return cached value
    if (dp[r][c] !== null) {
      return dp[r][c];
    }

    // Start with 1 for the path consisting of just this cell
    let totalPaths = 1;

    // Check all four neighbors
    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;

      // Check if neighbor is within bounds and has larger value
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] > grid[r][c]) {
        // Add all paths starting from this neighbor
        totalPaths = (totalPaths + dfs(nr, nc)) % MOD;
      }
    }

    // Cache the result before returning
    dp[r][c] = totalPaths;
    return totalPaths;
  };

  // Sum up paths starting from every cell
  let result = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      result = (result + dfs(r, c)) % MOD;
    }
  }

  return result;
};
```

```java
// Time: O(m * n) | Space: O(m * n)
class Solution {
    private static final int MOD = 1_000_000_007;
    private int[][] dp;
    private int[][] grid;
    private int m, n;

    public int countPaths(int[][] grid) {
        this.grid = grid;
        m = grid.length;
        n = grid[0].length;

        // dp[r][c] stores number of increasing paths starting at (r, c)
        // Use -1 to indicate uncomputed values
        dp = new int[m][n];
        for (int i = 0; i < m; i++) {
            Arrays.fill(dp[i], -1);
        }

        // Sum up paths starting from every cell
        int result = 0;
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                result = (result + dfs(r, c)) % MOD;
            }
        }

        return result;
    }

    private int dfs(int r, int c) {
        // If already computed, return cached value
        if (dp[r][c] != -1) {
            return dp[r][c];
        }

        // Start with 1 for the path consisting of just this cell
        int totalPaths = 1;

        // Check all four neighbors
        // Directions: up, down, left, right
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        for (int[] dir : directions) {
            int nr = r + dir[0];
            int nc = c + dir[1];

            // Check if neighbor is within bounds and has larger value
            if (nr >= 0 && nr < m && nc >= 0 && nc < n &&
                grid[nr][nc] > grid[r][c]) {
                // Add all paths starting from this neighbor
                totalPaths = (totalPaths + dfs(nr, nc)) % MOD;
            }
        }

        // Cache the result before returning
        dp[r][c] = totalPaths;
        return totalPaths;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- Each cell is visited exactly once during the DFS
- For each cell, we check up to 4 neighbors (constant time)
- Total operations: O(4 × m × n) = O(m × n)

**Space Complexity:** O(m × n)

- The dp array stores one value per cell: O(m × n)
- The recursion stack depth could be O(m × n) in the worst case (if the grid is strictly increasing in a snake pattern)
- In practice, the recursion depth is limited by the longest increasing path, but we still account for worst case

## Common Mistakes

1. **Forgetting to count single-cell paths:** Each cell by itself is a valid increasing path of length 1. This is why we start with `totalPaths = 1` in the DFS function, not 0.

2. **Not using memoization:** Attempting pure DFS without caching results in exponential time complexity. The memoization is crucial for efficiency.

3. **Incorrect modulo operation placement:** The modulo operation should be applied whenever we add to the total, not just at the end. This prevents integer overflow in languages with fixed-size integers.

4. **Wrong direction checks:** Forgetting to check array bounds before accessing neighbors leads to index out of bounds errors. Always check `0 <= nr < m` and `0 <= nc < n` before accessing `grid[nr][nc]`.

5. **Using the wrong comparison:** The problem says "strictly increasing," so we need `grid[nr][nc] > grid[r][c]`, not `>=`.

## When You'll See This Pattern

This pattern of DFS with memoization on a grid appears in several related problems:

1. **Longest Increasing Path in a Matrix (LeetCode 329):** Very similar problem but asks for the maximum length instead of counting all paths. Uses the same DP with memoization approach.

2. **Maximum Strictly Increasing Cells in a Matrix (LeetCode 2713):** Another variation that builds on similar concepts of increasing paths in a grid.

3. **All Paths From Source to Target (LeetCode 797):** While not on a grid, it uses similar DFS with memoization for path counting in directed acyclic graphs.

The core pattern is: when you need to compute a value for each cell that depends on values from neighboring cells, and there's a dependency relationship (like increasing values), DFS with memoization is often the right approach.

## Key Takeaways

1. **DFS with memoization is powerful for grid DP problems:** When each cell's value depends on its neighbors and there are overlapping subproblems, memoization turns exponential time into polynomial time.

2. **Think about what "starting at a cell" means:** Defining `dp[r][c]` as "number of paths starting at (r, c)" creates a clean recurrence relation. The alternative (paths ending at a cell) would be harder to compute.

3. **Don't forget the base case:** The path consisting of just the current cell itself is always valid, which gives us the "+1" in our recurrence.

Related problems: [Longest Increasing Path in a Matrix](/problem/longest-increasing-path-in-a-matrix), [All Paths From Source to Target](/problem/all-paths-from-source-to-target), [Maximum Strictly Increasing Cells in a Matrix](/problem/maximum-strictly-increasing-cells-in-a-matrix)
