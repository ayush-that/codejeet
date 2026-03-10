---
title: "How to Solve Longest Increasing Path in a Matrix — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Longest Increasing Path in a Matrix. Hard difficulty, 56.3% acceptance rate. Topics: Array, Dynamic Programming, Depth-First Search, Breadth-First Search, Graph Theory."
date: "2027-01-18"
category: "dsa-patterns"
tags:
  [
    "longest-increasing-path-in-a-matrix",
    "array",
    "dynamic-programming",
    "depth-first-search",
    "hard",
  ]
---

# How to Solve Longest Increasing Path in a Matrix

This problem asks us to find the longest strictly increasing path in a matrix where we can only move to adjacent cells (up, down, left, right) with higher values. What makes this problem tricky is that paths can wind through the matrix in complex ways, and a naive approach would explore the same cells repeatedly, leading to exponential time complexity. The key insight is that once we compute the longest path starting from a particular cell, we can reuse that result for all paths that pass through that cell.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Matrix:
9 9 4
6 6 8
2 1 1
```

We need to find the longest path where each step moves to a cell with a higher value.

**Step 1:** Start at cell (0,0) with value 9. From here, we can only move to cells with values > 9, but all adjacent cells (9, 6) are ≤ 9. So the longest path starting at (0,0) is just 1 (the cell itself).

**Step 2:** Cell (0,1) also has value 9, with neighbors (9, 4, 6). All are ≤ 9, so path length = 1.

**Step 3:** Cell (0,2) has value 4. Neighbors: up (none), down=6 (>4), left=9 (>4), right (none). The best path is 4→6→8, giving length 3.

**Step 4:** Cell (1,0) has value 6. Neighbors: up=9 (>6), down=2, left (none), right=6. The best path is 6→9, length 2.

**Step 5:** Cell (1,1) has value 6. Neighbors: up=9 (>6), down=1, left=6, right=8 (>6). The best path is 6→8, length 2.

**Step 6:** Cell (1,2) has value 8. Neighbors: up=4, down=1, left=6, right (none). All adjacent values are < 8, so length = 1.

**Step 7:** Cell (2,0) has value 2. Neighbors: up=6 (>2), down (none), left (none), right=1. The best path is 2→6→8, length 3.

**Step 8:** Cell (2,1) has value 1. Neighbors: up=6 (>1), down (none), left=2 (>1), right=1. The best path is 1→2→6→8, length 4.

**Step 9:** Cell (2,2) has value 1. Neighbors: up=8 (>1), down (none), left=1, right (none). The best path is 1→8, length 2.

The longest path is 4 (1→2→6→8 or 1→6→8→9). Notice how we computed the path from cell (2,1) by reusing results from its neighbors. This reuse is the key to optimization.

## Brute Force Approach

A naive brute force approach would explore every possible path from every starting cell using DFS. For each cell, we would recursively explore all four directions to cells with higher values, tracking the maximum path length.

The problem with this approach is exponential time complexity. In the worst case (like a strictly increasing sequence arranged in a snake pattern), each cell could lead to exploring most of the matrix, and we'd do this for every starting cell. This gives us O(4^(m×n)) time complexity, which is completely impractical for even moderately sized matrices.

Even with memoization (which we'll discuss next), a candidate might try to use BFS from each cell, but that would still be O((m×n)²) since we'd traverse the matrix from each starting point.

## Optimized Approach

The key insight is **memoization with DFS** (also called **DFS with memoization** or **top-down dynamic programming**). Here's the step-by-step reasoning:

1. **Subproblem definition**: Let `dp[i][j]` represent the length of the longest increasing path starting from cell `(i, j)`.

2. **Optimal substructure**: The longest path from `(i, j)` is 1 (the cell itself) plus the maximum of the longest paths from its valid neighbors (cells with higher values). If a cell has no valid neighbors, its path length is 1.

3. **Overlapping subproblems**: When computing paths from different starting cells, we'll encounter the same intermediate cells multiple times. For example, when computing paths starting from (0,0) and (0,1), both might pass through (1,1).

4. **Memoization strategy**: We store computed results in a `dp` matrix. Before computing the path from a cell, we check if we've already computed it. This ensures each cell's longest path is computed exactly once.

5. **DFS with backtracking**: We perform DFS from each cell, but only proceed to neighbors with higher values (ensuring the path is strictly increasing, which also prevents cycles).

The algorithm:

- Initialize a `dp` matrix with zeros (uncomputed)
- For each cell in the matrix, compute the longest increasing path starting from that cell using DFS with memoization
- Keep track of the maximum path length found
- Return the maximum

## Optimal Solution

<div class="code-group">

```python
# Time: O(m×n) - each cell is computed once
# Space: O(m×n) - for the dp matrix and recursion stack
class Solution:
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:
        if not matrix or not matrix[0]:
            return 0

        rows, cols = len(matrix), len(matrix[0])
        # dp[i][j] stores the longest increasing path starting from (i, j)
        dp = [[0] * cols for _ in range(rows)]
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # right, down, left, up

        def dfs(i, j):
            # If we've already computed this cell, return cached result
            if dp[i][j] != 0:
                return dp[i][j]

            # Initialize path length as 1 (the cell itself)
            max_length = 1

            # Explore all four directions
            for dx, dy in directions:
                x, y = i + dx, j + dy

                # Check if neighbor is within bounds and has higher value
                if 0 <= x < rows and 0 <= y < cols and matrix[x][y] > matrix[i][j]:
                    # Recursively compute path length from neighbor
                    length_from_neighbor = dfs(x, y)
                    # Update max_length if we found a longer path
                    max_length = max(max_length, 1 + length_from_neighbor)

            # Cache the result before returning
            dp[i][j] = max_length
            return max_length

        result = 0
        # Compute longest path starting from each cell
        for i in range(rows):
            for j in range(cols):
                result = max(result, dfs(i, j))

        return result
```

```javascript
// Time: O(m×n) - each cell is computed once
// Space: O(m×n) - for the dp matrix and recursion stack
/**
 * @param {number[][]} matrix
 * @return {number}
 */
var longestIncreasingPath = function (matrix) {
  if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
    return 0;
  }

  const rows = matrix.length;
  const cols = matrix[0].length;
  // dp[i][j] stores the longest increasing path starting from (i, j)
  const dp = Array(rows)
    .fill()
    .map(() => Array(cols).fill(0));
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]; // right, down, left, up

  const dfs = (i, j) => {
    // If we've already computed this cell, return cached result
    if (dp[i][j] !== 0) {
      return dp[i][j];
    }

    // Initialize path length as 1 (the cell itself)
    let maxLength = 1;

    // Explore all four directions
    for (const [dx, dy] of directions) {
      const x = i + dx;
      const y = j + dy;

      // Check if neighbor is within bounds and has higher value
      if (x >= 0 && x < rows && y >= 0 && y < cols && matrix[x][y] > matrix[i][j]) {
        // Recursively compute path length from neighbor
        const lengthFromNeighbor = dfs(x, y);
        // Update maxLength if we found a longer path
        maxLength = Math.max(maxLength, 1 + lengthFromNeighbor);
      }
    }

    // Cache the result before returning
    dp[i][j] = maxLength;
    return maxLength;
  };

  let result = 0;
  // Compute longest path starting from each cell
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result = Math.max(result, dfs(i, j));
    }
  }

  return result;
};
```

```java
// Time: O(m×n) - each cell is computed once
// Space: O(m×n) - for the dp matrix and recursion stack
class Solution {
    private int[][] dp;
    private int[][] matrix;
    private int rows, cols;
    private final int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    public int longestIncreasingPath(int[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return 0;
        }

        this.matrix = matrix;
        rows = matrix.length;
        cols = matrix[0].length;
        // dp[i][j] stores the longest increasing path starting from (i, j)
        dp = new int[rows][cols];

        int result = 0;
        // Compute longest path starting from each cell
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                result = Math.max(result, dfs(i, j));
            }
        }

        return result;
    }

    private int dfs(int i, int j) {
        // If we've already computed this cell, return cached result
        if (dp[i][j] != 0) {
            return dp[i][j];
        }

        // Initialize path length as 1 (the cell itself)
        int maxLength = 1;

        // Explore all four directions
        for (int[] dir : directions) {
            int x = i + dir[0];
            int y = j + dir[1];

            // Check if neighbor is within bounds and has higher value
            if (x >= 0 && x < rows && y >= 0 && y < cols && matrix[x][y] > matrix[i][j]) {
                // Recursively compute path length from neighbor
                int lengthFromNeighbor = dfs(x, y);
                // Update maxLength if we found a longer path
                maxLength = Math.max(maxLength, 1 + lengthFromNeighbor);
            }
        }

        // Cache the result before returning
        dp[i][j] = maxLength;
        return maxLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n)**

- Each cell in the matrix is visited exactly once during the DFS
- When we compute the path for a cell, we check its 4 neighbors, but each neighbor's computation is cached
- The outer loop goes through all m×n cells, but the DFS only computes uncached cells
- Total operations are proportional to the number of cells

**Space Complexity: O(m×n)**

- The `dp` matrix stores results for each cell: O(m×n)
- The recursion stack in worst case could be O(m×n) if the path goes through all cells (e.g., in a strictly increasing snake pattern)
- In practice, the recursion depth is limited by the longest path length

## Common Mistakes

1. **Forgetting to check bounds before accessing neighbors**: This is the most common error. Always check `0 <= x < rows` and `0 <= y < cols` before accessing `matrix[x][y]` or making recursive calls.

2. **Not handling empty matrix**: The problem doesn't guarantee non-empty input. Always check if `matrix` is `null` or empty at the beginning and return 0.

3. **Using BFS without memoization**: Some candidates try BFS from each cell, which gives O((m×n)²) time. The DFS with memoization approach is more efficient because it computes each cell's result once.

4. **Incorrect memoization initialization**: Initializing `dp` with `-1` instead of `0` can cause issues if a cell's actual longest path is 1. Using `0` as "uncomputed" works because every valid path has length at least 1.

5. **Not ensuring strictly increasing path**: The condition `matrix[x][y] > matrix[i][j]` is crucial. Using `>=` would allow equal values and potentially create cycles in the DFS.

## When You'll See This Pattern

This pattern of **DFS with memoization** appears in many grid-based dynamic programming problems:

1. **Number of Increasing Paths in a Grid (Hard)** - Almost identical problem but asks for the count of all increasing paths rather than just the longest one.

2. **Longest Increasing Path in a Matrix (this problem)** - The classic example.

3. **Out of Boundary Paths (Medium)** - Uses memoization to count paths that exit the grid within certain moves.

4. **Knight Probability in Chessboard (Medium)** - Uses memoization to compute probabilities of staying on the board.

The common theme is exploring a state space (grid positions) with overlapping subproblems, where the result from a given state can be reused.

## Key Takeaways

1. **DFS with memoization is powerful for grid traversal problems** - When you need to explore all paths but many paths share common subpaths, memoization avoids redundant computation.

2. **Look for optimal substructure** - If the solution for a cell depends only on solutions for neighboring cells (and those dependencies don't form cycles), memoization will work.

3. **Strictly increasing/decreasing constraints prevent cycles** - This is why we don't need a `visited` set; we can only move to cells with higher values, so we never revisit a cell in the same path.

Related problems: [Number of Increasing Paths in a Grid](/problem/number-of-increasing-paths-in-a-grid)
