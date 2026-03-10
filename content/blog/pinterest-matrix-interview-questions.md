---
title: "Matrix Questions at Pinterest: What to Expect"
description: "Prepare for Matrix interview questions at Pinterest — patterns, difficulty breakdown, and study tips."
date: "2029-08-29"
category: "dsa-patterns"
tags: ["pinterest", "matrix", "interview prep"]
---

## Why Matrix Questions Matter at Pinterest

If you're preparing for Pinterest interviews, you need to understand why matrix problems appear in roughly 8% of their coding questions (4 out of 48). Unlike companies where matrix problems are generic algorithmic tests, Pinterest's matrix questions directly reflect their core product: a visual discovery engine built on a grid of images. When you're asked to traverse or manipulate a matrix at Pinterest, you're essentially working with a simplified representation of their pin board interface.

This isn't academic—engineers at Pinterest regularly work with 2D data structures for features like image recommendations, board organization, and visual search. Interviewers use matrix problems to assess your spatial reasoning and ability to handle grid-based algorithms that mirror real Pinterest systems. While not their most frequent question type, matrix problems serve as an excellent filter for candidates who can think in two dimensions, which is crucial for a company whose entire product is organized in rows and columns of content.

## Specific Patterns Pinterest Favors

Pinterest's matrix questions tend to cluster around three specific patterns that reflect practical engineering challenges:

1. **Modified BFS/DFS for Connected Components** - They love problems where you need to find connected regions in a grid, often with constraints. Think "islands" problems but with additional conditions like minimum size requirements or shape constraints. This mirrors how they might analyze clusters of similar pins.

2. **Dynamic Programming on Grids** - Particularly iterative DP where you build solutions row by row or column by column. These problems test your ability to optimize spatial operations, similar to how Pinterest might optimize layout algorithms.

3. **Matrix Traversal with State** - Problems where you traverse a matrix while tracking multiple pieces of information (direction, visited cells with conditions, path history). This reflects the complexity of tracking user interactions across their grid interface.

For example, **Number of Islands (#200)** frequently appears in modified forms—instead of just counting islands, you might need to return their sizes or shapes. **Unique Paths (#62)** and its variations test the iterative DP pattern they value. **Rotting Oranges (#994)** combines BFS with state tracking, which is particularly relevant for modeling content propagation through Pinterest's grid.

## How to Prepare

The key to Pinterest matrix questions is recognizing that they're rarely about implementing textbook algorithms. You need to adapt standard patterns to specific constraints. Let's examine the most important pattern: BFS/DFS for connected components with additional conditions.

<div class="code-group">

```python
# Modified BFS for connected components with size tracking
# Problem: Find all islands with area >= min_size
# Time: O(m*n) | Space: O(m*n) for visited matrix, O(min(m,n)) for BFS queue
def find_large_islands(grid, min_size):
    if not grid:
        return []

    rows, cols = len(grid), len(grid[0])
    visited = [[False] * cols for _ in range(rows)]
    large_islands = []

    def bfs(start_row, start_col):
        queue = [(start_row, start_col)]
        visited[start_row][start_col] = True
        island_cells = []

        while queue:
            row, col = queue.pop(0)
            island_cells.append((row, col))

            # 4-directional movement (Pinterest often uses 4, not 8)
            for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
                new_row, new_col = row + dr, col + dc
                if (0 <= new_row < rows and 0 <= new_col < cols and
                    not visited[new_row][new_col] and grid[new_row][new_col] == 1):
                    visited[new_row][new_col] = True
                    queue.append((new_row, new_col))

        return island_cells

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1 and not visited[r][c]:
                island = bfs(r, c)
                if len(island) >= min_size:
                    large_islands.append(island)

    return large_islands
```

```javascript
// Modified BFS for connected components with size tracking
// Time: O(m*n) | Space: O(m*n) for visited matrix
function findLargeIslands(grid, minSize) {
  if (!grid || grid.length === 0) return [];

  const rows = grid.length,
    cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const largeIslands = [];

  const bfs = (startRow, startCol) => {
    const queue = [[startRow, startCol]];
    visited[startRow][startCol] = true;
    const islandCells = [];

    while (queue.length > 0) {
      const [row, col] = queue.shift();
      islandCells.push([row, col]);

      // 4-directional movement
      const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];
      for (const [dr, dc] of directions) {
        const newRow = row + dr,
          newCol = col + dc;
        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          !visited[newRow][newCol] &&
          grid[newRow][newCol] === 1
        ) {
          visited[newRow][newCol] = true;
          queue.push([newRow, newCol]);
        }
      }
    }

    return islandCells;
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1 && !visited[r][c]) {
        const island = bfs(r, c);
        if (island.length >= minSize) {
          largeIslands.push(island);
        }
      }
    }
  }

  return largeIslands;
}
```

```java
// Modified BFS for connected components with size tracking
// Time: O(m*n) | Space: O(m*n) for visited matrix
import java.util.*;

public class MatrixProblems {
    public List<List<int[]>> findLargeIslands(int[][] grid, int minSize) {
        List<List<int[]>> largeIslands = new ArrayList<>();
        if (grid == null || grid.length == 0) return largeIslands;

        int rows = grid.length, cols = grid[0].length;
        boolean[][] visited = new boolean[rows][cols];

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 1 && !visited[r][c]) {
                    List<int[]> island = bfs(grid, visited, r, c, rows, cols);
                    if (island.size() >= minSize) {
                        largeIslands.add(island);
                    }
                }
            }
        }

        return largeIslands;
    }

    private List<int[]> bfs(int[][] grid, boolean[][] visited,
                           int startRow, int startCol, int rows, int cols) {
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{startRow, startCol});
        visited[startRow][startCol] = true;
        List<int[]> islandCells = new ArrayList<>();

        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            islandCells.add(current);
            int row = current[0], col = current[1];

            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols &&
                    !visited[newRow][newCol] && grid[newRow][newCol] == 1) {
                    visited[newRow][newCol] = true;
                    queue.offer(new int[]{newRow, newCol});
                }
            }
        }

        return islandCells;
    }
}
```

</div>

Another critical pattern is iterative DP for path problems. Pinterest often presents variations where you need to track additional constraints:

<div class="code-group">

```python
# DP with additional constraint (like obstacles or limited turns)
# Problem: Unique Paths II (#63) with path tracking
# Time: O(m*n) | Space: O(m*n) for DP table
def uniquePathsWithObstacles(obstacleGrid):
    if not obstacleGrid or obstacleGrid[0][0] == 1:
        return 0

    m, n = len(obstacleGrid), len(obstacleGrid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = 1

    # First row
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] if obstacleGrid[0][j] == 0 else 0

    # First column
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] if obstacleGrid[i][0] == 0 else 0

    # Fill rest of DP table
    for i in range(1, m):
        for j in range(1, n):
            if obstacleGrid[i][j] == 0:
                dp[i][j] = dp[i-1][j] + dp[i][j-1]
            else:
                dp[i][j] = 0

    return dp[m-1][n-1]
```

```javascript
// DP with obstacles - Unique Paths II variation
// Time: O(m*n) | Space: O(m*n)
function uniquePathsWithObstacles(obstacleGrid) {
  if (!obstacleGrid || obstacleGrid[0][0] === 1) return 0;

  const m = obstacleGrid.length,
    n = obstacleGrid[0].length;
  const dp = Array.from({ length: m }, () => Array(n).fill(0));
  dp[0][0] = 1;

  // First row
  for (let j = 1; j < n; j++) {
    dp[0][j] = obstacleGrid[0][j] === 0 ? dp[0][j - 1] : 0;
  }

  // First column
  for (let i = 1; i < m; i++) {
    dp[i][0] = obstacleGrid[i][0] === 0 ? dp[i - 1][0] : 0;
  }

  // Fill rest
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (obstacleGrid[i][j] === 0) {
        dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
      } else {
        dp[i][j] = 0;
      }
    }
  }

  return dp[m - 1][n - 1];
}
```

```java
// DP with obstacles - Unique Paths II variation
// Time: O(m*n) | Space: O(m*n)
public class MatrixDP {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        if (obstacleGrid == null || obstacleGrid[0][0] == 1) return 0;

        int m = obstacleGrid.length, n = obstacleGrid[0].length;
        int[][] dp = new int[m][n];
        dp[0][0] = 1;

        // First row
        for (int j = 1; j < n; j++) {
            dp[0][j] = obstacleGrid[0][j] == 0 ? dp[0][j-1] : 0;
        }

        // First column
        for (int i = 1; i < m; i++) {
            dp[i][0] = obstacleGrid[i][0] == 0 ? dp[i-1][0] : 0;
        }

        // Fill rest
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (obstacleGrid[i][j] == 0) {
                    dp[i][j] = dp[i-1][j] + dp[i][j-1];
                } else {
                    dp[i][j] = 0;
                }
            }
        }

        return dp[m-1][n-1];
    }
}
```

</div>

## How Pinterest Tests Matrix vs Other Companies

Pinterest's matrix questions differ from other companies in three key ways:

**1. Practical over Theoretical:** While Google might ask abstract matrix rotation algorithms, Pinterest frames problems in product terms. You might hear "pins" instead of "cells" or "boards" instead of "matrices." The constraints often reflect real limitations of their system.

**2. Medium Difficulty with Product Twist:** Facebook and Amazon sometimes go for hard matrix DP problems, but Pinterest typically stays at medium difficulty. However, they add product-specific twists that require careful reading. A problem might look like "Number of Islands" but with the added requirement that islands must be rectangular to represent organized pin boards.

**3. Emphasis on Clean Implementation:** At Pinterest, code readability matters more than at some hedge funds or pure tech companies. They want to see you write maintainable grid traversal code with clear variable names and separation of concerns. Commenting your approach is more valuable here than micro-optimizations.

**4. 4-directional Movement:** Notice how all our examples use 4-directional movement (up, down, left, right) rather than 8-directional. This is consistent across Pinterest problems—it reflects how users navigate their grid interface.

## Study Order

Master matrix problems in this specific order for Pinterest:

1. **Basic Traversal Patterns** - Start with simple row/column iteration and understand how to navigate neighbors. Practice both BFS and DFS approaches.
2. **Connected Components** - Master island-finding algorithms before moving to more complex patterns. This is the foundation for most Pinterest matrix problems.

3. **Dynamic Programming on Grids** - Learn bottom-up DP for path counting and optimization problems. Focus on iterative approaches rather than recursive memoization.

4. **Matrix Modification Problems** - Practice problems where you modify the matrix in-place (like set matrix zeroes). Pinterest cares about space efficiency.

5. **Search in Sorted Matrix** - While less common, understanding how to leverage sorted properties in 2D arrays shows deeper algorithmic thinking.

6. **Complex Constraints** - Finally, practice problems with multiple constraints (like "Pacific Atlantic Water Flow" #417) which combine several patterns.

This order works because each layer builds on the previous one. You can't solve complex constraint problems without mastering connected components, and you can't optimize DP solutions without understanding basic traversal.

## Recommended Practice Order

Solve these problems in sequence, focusing on the Pinterest-specific patterns:

1. **Number of Islands (#200)** - The absolute foundation. Solve it with both DFS and BFS.
2. **Max Area of Island (#695)** - Adds size tracking to the basic pattern.
3. **Rotting Oranges (#994)** - BFS with multiple states and time tracking.
4. **Unique Paths (#62)** - Basic DP on grids.
5. **Unique Paths II (#63)** - DP with obstacles (common Pinterest variation).
6. **Set Matrix Zeroes (#73)** - In-place modification, tests space optimization.
7. **Word Search (#79)** - DFS with backtracking and state management.
8. **Pacific Atlantic Water Flow (#417)** - Combines multiple patterns with constraints.

After mastering these, look for Pinterest-specific variations in their tagged problems. Remember that at Pinterest, the matrix isn't just an abstract data structure—it's their product interface. Your ability to reason about grids directly correlates with your ability to contribute to their visual discovery systems.

[Practice Matrix at Pinterest](/company/pinterest/matrix)
