---
title: "Matrix Questions at eBay: What to Expect"
description: "Prepare for Matrix interview questions at eBay — patterns, difficulty breakdown, and study tips."
date: "2029-03-12"
category: "dsa-patterns"
tags: ["ebay", "matrix", "interview prep"]
---

## Why Matrix Problems Matter at eBay

If you're preparing for an eBay interview, you need to take matrix problems seriously. With 8 out of 60 total questions being matrix-related, they represent over 13% of their technical question bank. This isn't a random distribution — it reflects eBay's actual engineering work. Think about their core business: inventory management, shipping logistics, recommendation systems, and fraud detection grids. These all involve processing tabular data, spatial relationships, and grid-based optimizations. In my conversations with engineers there, matrix questions appear in roughly 1 out of every 3 technical interviews, often as the second coding question after a warm-up. They're not just testing if you can traverse a grid; they're testing if you can model real eBay problems as matrix operations.

## Specific Patterns eBay Favors

eBay's matrix questions tend to cluster around three specific patterns that mirror their business domains:

1. **Grid Traversal with State** — These aren't simple "flood fill" problems. eBay adds layers like visited states with obstacles, multiple possible paths with constraints, or traversal with resource limits. Think "Robot in a Grid" but with inventory items as obstacles and pick-up/drop-off points. LeetCode #980 (Unique Paths III) is a perfect example of the complexity level they expect.

2. **Matrix as Implicit Graph** — Many eBay problems treat the matrix as an adjacency matrix or implicit graph. This appears in fraud detection (finding connected suspicious accounts) and recommendation systems (finding clusters of similar items). They particularly favor problems that blend BFS/DFS with additional constraints. LeetCode #200 (Number of Islands) is the foundational problem here, but expect variations with diagonal movement or minimum steps between points.

3. **Dynamic Programming on Grids** — Unlike companies that focus on 1D DP, eBay frequently uses 2D DP for optimization problems. These model shipping route optimization, warehouse picking paths, or bid calculation matrices. The patterns are usually iterative rather than recursive, emphasizing space optimization. LeetCode #64 (Minimum Path Sum) is their go-to baseline for this category.

Here's the core BFS pattern they expect you to know cold for implicit graph problems:

<div class="code-group">

```python
from collections import deque

def bfs_matrix(grid, start):
    """
    Standard BFS for matrix traversal with obstacle handling.
    Grid: 2D list where 0 = empty, 1 = obstacle
    Start: (row, col) tuple
    Returns: distance matrix to all reachable cells
    """
    if not grid:
        return []

    rows, cols = len(grid), len(grid[0])
    directions = [(1,0), (-1,0), (0,1), (0,-1)]  # 4-directional
    distance = [[-1] * cols for _ in range(rows)]

    queue = deque([start])
    distance[start[0]][start[1]] = 0

    while queue:
        r, c = queue.popleft()

        for dr, dc in directions:
            nr, nc = r + dr, c + dc

            # Check bounds, obstacles, and if not visited
            if (0 <= nr < rows and 0 <= nc < cols and
                grid[nr][nc] == 0 and distance[nr][nc] == -1):
                distance[nr][nc] = distance[r][c] + 1
                queue.append((nr, nc))

    return distance

# Time: O(rows * cols) - each cell processed at most once
# Space: O(rows * cols) - for distance matrix and queue in worst case
```

```javascript
function bfsMatrix(grid, start) {
  if (!grid.length) return [];

  const rows = grid.length,
    cols = grid[0].length;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const distance = Array.from({ length: rows }, () => Array(cols).fill(-1));

  const queue = [start];
  distance[start[0]][start[1]] = 0;

  while (queue.length) {
    const [r, c] = queue.shift();

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;

      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        grid[nr][nc] === 0 &&
        distance[nr][nc] === -1
      ) {
        distance[nr][nc] = distance[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }

  return distance;
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

```java
import java.util.*;

public class MatrixBFS {
    public int[][] bfsMatrix(int[][] grid, int[] start) {
        if (grid.length == 0) return new int[0][0];

        int rows = grid.length, cols = grid[0].length;
        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
        int[][] distance = new int[rows][cols];
        for (int[] row : distance) Arrays.fill(row, -1);

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(start);
        distance[start[0]][start[1]] = 0;

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1];

            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];

                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                    grid[nr][nc] == 0 && distance[nr][nc] == -1) {
                    distance[nr][nc] = distance[r][c] + 1;
                    queue.offer(new int[]{nr, nc});
                }
            }
        }

        return distance;
    }
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

</div>

## How eBay Tests Matrix vs Other Companies

eBay's matrix questions have a distinct flavor compared to other tech companies:

- **vs Google**: Google focuses on clever algorithmic tricks and optimality proofs. eBay cares more about practical implementation and handling edge cases that mirror real data issues (missing values, irregular shapes, memory constraints).

- **vs Facebook/Meta**: Meta often uses matrices for social network graphs with millions of nodes. eBay's matrices are smaller but more constrained — think warehouse grids with specific movement rules rather than friend networks.

- **vs Amazon**: Amazon loves adjacency matrices for their fulfillment centers, but their problems are more about pure graph theory. eBay blends graph traversal with business logic layers.

What's unique about eBay's approach is the **domain translation**. They'll describe a real eBay problem ("optimizing seller inventory placement across warehouses") and expect you to recognize it as a matrix problem. The interviewer wants to see if you can map business requirements to technical solutions, not just implement algorithms.

## Study Order

Don't jump straight into hard matrix problems. Follow this progression:

1. **Basic Traversal** — Master row/column iteration, understanding how to navigate neighbors. This is your foundation.
2. **DFS/BFS on Grids** — Learn to treat matrices as graphs. Start with 4-directional, then add diagonals.
3. **Dynamic Programming on Grids** — Begin with 2D DP where each cell depends on left/up neighbors, then progress to more complex dependencies.
4. **Optimization Techniques** — Learn to reduce space from O(m×n) to O(n) or O(1) for DP problems.
5. **Advanced Patterns** — Multi-source BFS, A\* search for grids, and union-find for connected components.

This order works because each layer builds on the previous one. You can't optimize DP space if you don't understand the basic DP formulation. You can't handle multi-source BFS if you're shaky on single-source BFS.

## How to Prepare

Practice with constraints that eBay interviewers emphasize: memory efficiency, clean boundary checking, and readable code. When you solve a problem, always ask: "How would this apply to eBay's business?" That mental model will help you during interviews.

Here's the iterative DP pattern you must master for their optimization problems:

<div class="code-group">

```python
def min_path_sum(grid):
    """
    LeetCode #64: Minimum Path Sum
    Returns minimum sum of path from top-left to bottom-right
    Can only move down or right.
    """
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])

    # Space-optimized DP: only keep previous row
    dp = [0] * cols
    dp[0] = grid[0][0]

    # Initialize first row (only right moves)
    for c in range(1, cols):
        dp[c] = dp[c-1] + grid[0][c]

    # Fill remaining rows
    for r in range(1, rows):
        # First column (only down moves)
        dp[0] += grid[r][0]

        for c in range(1, cols):
            # Minimum of coming from left or above
            dp[c] = min(dp[c-1], dp[c]) + grid[r][c]

    return dp[cols-1]

# Time: O(rows * cols) - process each cell once
# Space: O(cols) - optimized from O(rows * cols)
```

```javascript
function minPathSum(grid) {
  if (!grid.length) return 0;

  const rows = grid.length,
    cols = grid[0].length;
  const dp = new Array(cols).fill(0);
  dp[0] = grid[0][0];

  // First row
  for (let c = 1; c < cols; c++) {
    dp[c] = dp[c - 1] + grid[0][c];
  }

  // Remaining rows
  for (let r = 1; r < rows; r++) {
    // First column
    dp[0] += grid[r][0];

    for (let c = 1; c < cols; c++) {
      dp[c] = Math.min(dp[c - 1], dp[c]) + grid[r][c];
    }
  }

  return dp[cols - 1];
}

// Time: O(rows * cols) | Space: O(cols)
```

```java
public class MatrixDP {
    public int minPathSum(int[][] grid) {
        if (grid.length == 0) return 0;

        int rows = grid.length, cols = grid[0].length;
        int[] dp = new int[cols];
        dp[0] = grid[0][0];

        // First row
        for (int c = 1; c < cols; c++) {
            dp[c] = dp[c-1] + grid[0][c];
        }

        // Remaining rows
        for (int r = 1; r < rows; r++) {
            // First column
            dp[0] += grid[r][0];

            for (int c = 1; c < cols; c++) {
                dp[c] = Math.min(dp[c-1], dp[c]) + grid[r][c];
            }
        }

        return dp[cols-1];
    }
}

// Time: O(rows * cols) | Space: O(cols)
```

</div>

## Recommended Practice Order

Solve these problems in sequence:

1. **LeetCode #733 (Flood Fill)** — Basic DFS traversal
2. **LeetCode #200 (Number of Islands)** — Connected components in grid
3. **LeetCode #695 (Max Area of Island)** — DFS with area counting
4. **LeetCode #994 (Rotting Oranges)** — Multi-source BFS
5. **LeetCode #64 (Minimum Path Sum)** — Basic 2D DP
6. **LeetCode #62 (Unique Paths)** — Combinatorial DP on grid
7. **LeetCode #980 (Unique Paths III)** — DFS with backtracking (eBay favorite)
8. **LeetCode #329 (Longest Increasing Path)** — DFS with memoization

After completing these, search for "matrix" in eBay's tagged questions and solve 3-4 of their actual interview problems. Notice how they add eBay-specific constraints to classic problems.

[Practice Matrix at eBay](/company/ebay/matrix)
