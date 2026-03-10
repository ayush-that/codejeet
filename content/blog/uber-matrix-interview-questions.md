---
title: "Matrix Questions at Uber: What to Expect"
description: "Prepare for Matrix interview questions at Uber — patterns, difficulty breakdown, and study tips."
date: "2027-06-05"
category: "dsa-patterns"
tags: ["uber", "matrix", "interview prep"]
---

If you're preparing for a software engineering interview at Uber, you'll almost certainly face a matrix question. With 41 matrix-related problems in their tagged LeetCode list, it's one of their most frequent data structure topics. But why? Uber's core business—mapping, routing, and real-time logistics—is fundamentally built on grids. Whether it's modeling city blocks for ETA calculations, processing sensor data from self-driving cars, or optimizing delivery routes in a warehouse-like grid, the ability to navigate and reason about two-dimensional data is not just an academic exercise; it's daily engineering work. In interviews, matrix problems serve as an efficient proxy for assessing spatial reasoning, systematic problem-solving, and clean implementation of graph algorithms on a structured "graph."

## Specific Patterns Uber Favors

Uber's matrix problems aren't about obscure mathematical tricks. They heavily favor **applied graph traversal** and **dynamic programming (DP) with clear spatial meaning**. You're far more likely to see a problem framed as navigating a driver through city streets or calculating the number of unique paths to a destination than a purely mathematical matrix rotation.

The two dominant patterns are:

1.  **Grid as an Implicit Graph (BFS/DFS):** The matrix cells are nodes, and adjacent moves (up, down, left, right, and sometimes diagonally) are edges. This is the bread and butter.
    - **BFS** is king for finding **shortest paths** in unweighted grids. Think "minimum steps to reach a target" or "distance from a service to all city blocks." Problems often include obstacles (like `Walls and Gates (#286)` or `Shortest Path in Binary Matrix (#1091)`).
    - **DFS** is used for **exploration, counting, or filling regions**, like calculating the area of an island (`Number of Islands (#200)`) or marking all reachable cells from a point.

2.  **Spatial Dynamic Programming:** These problems ask for an aggregate count, sum, or optimal value to reach a cell, where the value depends on values from earlier cells (typically above and to the left).
    - The classic is `Unique Paths (#62)` and its variants with obstacles (`Unique Paths II (#63)`). The recurrence `dp[i][j] = dp[i-1][j] + dp[i][j-1]` is fundamental.
    - Uber sometimes extends this to more complex state, like `Minimum Path Sum (#64)`, where you find the path with the minimum total cost.

Here is the essential BFS template for a grid. Notice the use of a queue, the `directions` array, and bounds checking.

<div class="code-group">

```python
from collections import deque
from typing import List

def bfs_shortest_path(grid: List[List[int]], start: List[int]) -> List[List[int]]:
    """
    Given a 2D grid (0=empty, 1=obstacle), returns a distance matrix from start.
    """
    if not grid:
        return []

    rows, cols = len(grid), len(grid[0])
    # Initialize distance matrix with -1 (unvisited)
    dist = [[-1] * cols for _ in range(rows)]
    sr, sc = start
    # If start is an obstacle, return immediately
    if grid[sr][sc] == 1:
        return dist

    queue = deque([(sr, sc)])
    dist[sr][sc] = 0
    # Four possible movement directions
    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    while queue:
        r, c = queue.popleft()
        current_dist = dist[r][c]

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            # Check bounds, obstacle, and if cell is unvisited
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0 and dist[nr][nc] == -1:
                dist[nr][nc] = current_dist + 1
                queue.append((nr, nc))
    return dist
# Time: O(R * C) - each cell is processed at most once.
# Space: O(R * C) for the distance matrix and, in worst case, the queue.
```

```javascript
/**
 * @param {number[][]} grid (0=empty, 1=obstacle)
 * @param {number[]} start [row, col]
 * @return {number[][]} distance matrix
 */
function bfsShortestPath(grid, start) {
  if (!grid.length) return [];

  const rows = grid.length,
    cols = grid[0].length;
  // Initialize distance matrix with -1 (unvisited)
  const dist = Array.from({ length: rows }, () => new Array(cols).fill(-1));
  const [sr, sc] = start;
  if (grid[sr][sc] === 1) return dist;

  const queue = [[sr, sc]];
  dist[sr][sc] = 0;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length) {
    const [r, c] = queue.shift();
    const currentDist = dist[r][c];

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        grid[nr][nc] === 0 &&
        dist[nr][nc] === -1
      ) {
        dist[nr][nc] = currentDist + 1;
        queue.push([nr, nc]);
      }
    }
  }
  return dist;
}
// Time: O(R * C) | Space: O(R * C)
```

```java
import java.util.*;

public class Solution {
    public int[][] bfsShortestPath(int[][] grid, int[] start) {
        if (grid == null || grid.length == 0) return new int[0][0];

        int rows = grid.length, cols = grid[0].length;
        int[][] dist = new int[rows][cols];
        for (int[] row : dist) Arrays.fill(row, -1);

        int sr = start[0], sc = start[1];
        if (grid[sr][sc] == 1) return dist;

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{sr, sc});
        dist[sr][sc] = 0;
        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};

        while (!queue.isEmpty()) {
            int[] cell = queue.poll();
            int r = cell[0], c = cell[1];
            int currentDist = dist[r][c];

            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                    grid[nr][nc] == 0 && dist[nr][nc] == -1) {
                    dist[nr][nc] = currentDist + 1;
                    queue.offer(new int[]{nr, nc});
                }
            }
        }
        return dist;
    }
}
// Time: O(R * C) | Space: O(R * C)
```

</div>

## How Uber Tests Matrix vs Other Companies

Uber's matrix questions are distinguished by their **practical framing** and **emphasis on correctness under constraints**. Unlike some finance companies that might ask complex matrix multiplication or a pure math company asking about determinants, Uber's problems are almost always about navigation, optimization, or state propagation.

The difficulty often lies not in the algorithm itself, but in the **details of the problem statement and edge cases**. For example, a problem might involve multiple agents, time-dependent states, or specific movement rules (e.g., a delivery scooter that can only turn at certain points). They test if you can take a real-world constraint and cleanly model it in code. The expectation is production-quality code: well-named variables, proper separation of logic, and handling of invalid inputs.

## How to Prepare

1.  **Master the two core patterns above first.** Internalize the BFS queue template and the 2D DP formula. Write them from scratch until you make zero syntax errors.
2.  **Practice "Layer 2" variations.** Once you're comfortable with vanilla BFS and DP, practice common twists:
    - **Multiple Sources BFS:** Initialize the queue with all source points (like `Walls and Gates (#286)`). This efficiently finds the distance to the _nearest_ source.
    - **DP with Space Optimization:** Learn to reduce a 2D DP table to 1D when the recurrence only depends on the previous row (`dp[j] = dp[j] + dp[j-1]`).
    - **DFS with Backtracking:** For problems involving placing items or finding _all_ paths, like `Word Search (#79)`.
3.  **Draw it out.** Before coding, always sketch a 3x3 or 4x4 grid and walk through your algorithm with an example. This catches off-by-one errors in your bounds checking and solidifies the spatial logic.

Here is the classic DP pattern for `Unique Paths`, including the space-optimized version. This is a must-know.

<div class="code-group">

```python
def uniquePaths(m: int, n: int) -> int:
    # Standard 2D DP
    dp = [[1] * n for _ in range(m)]
    # Start from (1,1) because first row and col are already 1
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    return dp[m-1][n-1]
# Time: O(M * N) | Space: O(M * N)

def uniquePaths_optimized(m: int, n: int) -> int:
    # Space-optimized 1D DP
    dp = [1] * n
    for i in range(1, m):
        for j in range(1, n):
            # dp[j] (new) = dp[j] (old, from above) + dp[j-1] (from left)
            dp[j] = dp[j] + dp[j-1]
    return dp[n-1]
# Time: O(M * N) | Space: O(N)
```

```javascript
function uniquePaths(m, n) {
  // Standard 2D DP
  const dp = Array.from({ length: m }, () => new Array(n).fill(1));
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
}
// Time: O(M * N) | Space: O(M * N)

function uniquePathsOptimized(m, n) {
  // Space-optimized 1D DP
  let dp = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] = dp[j] + dp[j - 1];
    }
  }
  return dp[n - 1];
}
// Time: O(M * N) | Space: O(N)
```

```java
public class Solution {
    public int uniquePaths(int m, int n) {
        // Standard 2D DP
        int[][] dp = new int[m][n];
        for (int[] row : dp) Arrays.fill(row, 1);
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
            }
        }
        return dp[m-1][n-1];
    }
    // Time: O(M * N) | Space: O(M * N)

    public int uniquePathsOptimized(int m, int n) {
        // Space-optimized 1D DP
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[j] = dp[j] + dp[j-1];
            }
        }
        return dp[n-1];
    }
    // Time: O(M * N) | Space: O(N)
}
```

</div>

## Study Order

Follow this progression to build competence without getting overwhelmed:

1.  **Basic Traversal (DFS/BFS):** Learn to visit every cell. This is your foundation for everything else. Practice `Number of Islands (#200)`.
2.  **Shortest Path (BFS):** Understand why BFS gives the shortest path on an unweighted grid. Practice `Shortest Path in Binary Matrix (#1091)`.
3.  **Basic Spatial DP:** Learn the "paths to a cell" recurrence. Practice `Unique Paths (#62)` and `Minimum Path Sum (#64)`.
4.  **Traversal with Constraints/State:** Combine traversal with additional rules or memory. Practice `Rotting Oranges (#994)` (BFS with a timer) and `Word Search (#79)` (DFS with backtracking).
5.  **Advanced Variations:** Tackle problems that combine patterns or have complex state, like `Surrounded Regions (#130)` (DFS for marking) or ones requiring Dijkstra's algorithm on a weighted grid.

## Recommended Practice Order

Solve these Uber-tagged or highly relevant problems in sequence:

1.  `Number of Islands (#200)` - Pure DFS/BFS foundation.
2.  `Walls and Gates (#286)` - Excellent multi-source BFS practice.
3.  `Unique Paths (#62)` - Foundational 2D DP.
4.  `Rotting Oranges (#994)` - BFS with a clear "rounds" progression.
5.  `Word Search (#79)` - DFS with backtracking, a common pattern.
6.  `Shortest Path in Binary Matrix (#1091)` - Standard BFS shortest path.
7.  `Minimum Path Sum (#64)` - Slightly more complex DP.
8.  `Surrounded Regions (#130)` - Requires thinking about borders and traversal.

This sequence builds from simple traversal to combined concepts, mirroring how an interview might progress from a core problem to a follow-up with added complexity.

[Practice Matrix at Uber](/company/uber/matrix)
