---
title: "Matrix Questions at Geico: What to Expect"
description: "Prepare for Matrix interview questions at Geico — patterns, difficulty breakdown, and study tips."
date: "2031-09-30"
category: "dsa-patterns"
tags: ["geico", "matrix", "interview prep"]
---

Matrix problems at Geico aren't just another topic—they're a critical filter. With 3 out of 21 questions dedicated to matrices, that's over 14% of their question bank. This is significantly higher than the average at most large tech companies, where matrix problems might appear as 1 in 10 or 15 questions. Why the emphasis? Geico's core business—insurance—relies heavily on spatial data analysis for risk assessment (think geographic claim density, property grids, and routing for adjusters). Matrix questions test your ability to navigate and reason about structured, two-dimensional data, which directly mirrors how they model many of their real-world problems. In interviews, you're almost guaranteed to see at least one matrix problem, often in the second technical round.

## Specific Patterns Geico Favors

Geico's matrix problems lean heavily toward **applied graph traversal on a grid**, not abstract graph theory. You won't see complex algorithms like Max Flow or Bellman-Ford here. Instead, they focus on problems where the matrix itself is the graph—each cell is a node, and movement is restricted to four (sometimes eight) directions. The core pattern is **Breadth-First Search (BFS) for shortest path or propagation problems**, and **Depth-First Search (DFS) for connected component or exploration problems**.

A classic example is the "rotting oranges" problem (LeetCode #994). You're given a grid representing a box of oranges, and you must determine the minimum time until all fresh oranges are rotten, given that rotten oranges contaminate adjacent fresh ones each minute. This is pure BFS propagation. Another favorite is "number of islands" (LeetCode #200), a foundational DFS problem for counting connected components. They also show a preference for **in-place modification** problems, like "set matrix zeroes" (LeetCode #73), which tests your ability to manipulate a matrix efficiently without extra space—a skill valuable when dealing with large datasets.

## How to Prepare

Master the BFS-on-a-grid template. The key insight is to treat the matrix as an implicit graph. Start by identifying all "source" nodes (like all rotten oranges) and add them to a queue. Then, process layer by layer, marking visited cells to avoid cycles. Here's the core pattern:

<div class="code-group">

```python
from collections import deque

def bfs_grid(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    # Queue holds (row, col, optional_distance)
    queue = deque()
    # 1. Initialize: find all starting points
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:  # Example: rotten orange
                queue.append((r, c, 0))

    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    max_time = 0

    # 2. Process layer by layer
    while queue:
        r, c, time = queue.popleft()
        max_time = max(max_time, time)
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:  # Valid & fresh
                grid[nr][nc] = 2  # Mark as visited/rotten
                queue.append((nr, nc, time + 1))

    # 3. Check for any unprocessed cells
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                return -1  # Impossible case
    return max_time

# Time: O(rows * cols) | Space: O(rows * cols) in worst case (queue size)
```

```javascript
function bfsGrid(grid) {
  if (!grid.length) return 0;

  const rows = grid.length,
    cols = grid[0].length;
  const queue = [];
  // 1. Initialize
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        queue.push([r, c, 0]);
      }
    }
  }

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let maxTime = 0;

  // 2. Process
  while (queue.length) {
    const [r, c, time] = queue.shift();
    maxTime = Math.max(maxTime, time);
    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
        grid[nr][nc] = 2;
        queue.push([nr, nc, time + 1]);
      }
    }
  }

  // 3. Check for leftovers
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) return -1;
    }
  }
  return maxTime;
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

```java
import java.util.LinkedList;
import java.util.Queue;

public int bfsGrid(int[][] grid) {
    if (grid.length == 0) return 0;

    int rows = grid.length, cols = grid[0].length;
    Queue<int[]> queue = new LinkedList<>();
    // 1. Initialize
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 2) {
                queue.offer(new int[]{r, c, 0});
            }
        }
    }

    int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
    int maxTime = 0;

    // 2. Process
    while (!queue.isEmpty()) {
        int[] curr = queue.poll();
        int r = curr[0], c = curr[1], time = curr[2];
        maxTime = Math.max(maxTime, time);
        for (int[] dir : directions) {
            int nr = r + dir[0], nc = c + dir[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                grid[nr][nc] = 2;
                queue.offer(new int[]{nr, nc, time + 1});
            }
        }
    }

    // 3. Check for leftovers
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 1) return -1;
        }
    }
    return maxTime;
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

</div>

For DFS problems like "number of islands," the pattern is about recursive exploration and marking visited cells. The key is to avoid stack overflow by ensuring your recursion depth doesn't exceed the grid size (which it typically won't for Geico's problem sizes). Here's the concise template:

<div class="code-group">

```python
def dfs_grid(grid, r, c):
    if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]) or grid[r][c] != 1:
        return
    grid[r][c] = 0  # Mark as visited
    # Explore 4 directions
    dfs_grid(grid, r+1, c)
    dfs_grid(grid, r-1, c)
    dfs_grid(grid, r, c+1)
    dfs_grid(grid, r, c-1)

# Time: O(rows * cols) | Space: O(rows * cols) for recursion stack in worst case
```

```javascript
function dfsGrid(grid, r, c) {
  if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== 1) {
    return;
  }
  grid[r][c] = 0;
  dfsGrid(grid, r + 1, c);
  dfsGrid(grid, r - 1, c);
  dfsGrid(grid, r, c + 1);
  dfsGrid(grid, r, c - 1);
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

```java
public void dfsGrid(int[][] grid, int r, int c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != 1) {
        return;
    }
    grid[r][c] = 0;
    dfsGrid(grid, r+1, c);
    dfsGrid(grid, r-1, c);
    dfsGrid(grid, r, c+1);
    dfsGrid(grid, r, c-1);
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

</div>

## How Geico Tests Matrix vs Other Companies

At FAANG companies, matrix problems often serve as a gateway to more complex topics—you might get a matrix problem that's actually a dynamic programming challenge (like "minimum path sum") or one that requires advanced algorithms (like "search a 2D matrix II" with binary search). At Geico, the approach is more pragmatic. Their problems are **self-contained grid traversals** with clear real-world analogs. The difficulty is typically in the **implementation details and edge cases**, not algorithmic novelty. For example, they might add a twist like "you can only move in two directions" or "you need to track two different states per cell." The uniqueness lies in their focus on **correctness under constraints**—can you write bug-free BFS/DFS that handles all edge cases (empty grid, all fresh, all rotten, unreachable cells)? They care less about you knowing Dijkstra's and more about you cleanly solving the problem they gave you.

## Study Order

1.  **Basic Matrix Navigation**: Learn how to iterate through a matrix, access neighbors, and handle boundaries. This is your foundation.
2.  **Depth-First Search (DFS) on Grid**: Start with counting islands (#200). This teaches you recursive exploration and marking visited cells. It's simpler than BFS because you don't need a queue.
3.  **Breadth-First Search (BFS) on Grid**: Move to propagation problems like rotting oranges (#994). BFS is essential for shortest path problems in unweighted grids.
4.  **In-Place Modification**: Practice problems like set matrix zeroes (#73). This teaches you to use the matrix itself to store state, a common space optimization.
5.  **Combined Traversal & State Tracking**: Tackle problems where you need to track multiple states, like "01 matrix" (#542) where you calculate distances to the nearest zero. This often involves multi-source BFS.
6.  **Pathfinding with Obstacles**: Finally, try problems like "unique paths II" (#63), which introduces obstacles and often leads into simple DP concepts.

This order works because each step builds on the previous. You can't implement BFS correctly if you can't navigate neighbors. You can't do in-place modification if you don't understand how traversal affects state.

## Recommended Practice Order

Solve these problems in sequence to build competency:

1.  **Number of Islands (LeetCode #200)** – Master DFS on a grid.
2.  **Rotting Oranges (LeetCode #994)** – Master multi-source BFS.
3.  **Set Matrix Zeroes (LeetCode #73)** – Learn in-place modification.
4.  **01 Matrix (LeetCode #542)** – Practice multi-source BFS with distance tracking.
5.  **Flood Fill (LeetCode #733)** – Simple DFS/BFS application, good for reinforcement.
6.  **Walls and Gates (LeetCode Premium #286)** – Another classic BFS propagation problem (if you have access).
7.  **Unique Paths II (LeetCode #63)** – Introduces obstacles and simple DP thinking.

This sequence takes you from foundational traversal to more nuanced applications, mirroring the progression you'll see in Geico interviews.

[Practice Matrix at Geico](/company/geico/matrix)
