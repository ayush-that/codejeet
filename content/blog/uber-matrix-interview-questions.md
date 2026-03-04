---
title: "Matrix Questions at Uber: What to Expect"
description: "Prepare for Matrix interview questions at Uber — patterns, difficulty breakdown, and study tips."
date: "2027-06-13"
category: "dsa-patterns"
tags: ["uber", "matrix", "interview prep"]
---

Matrix questions appear in over 10% of Uber's technical interview problems. For a company that manages real-time location data, driver-rider matching, surge pricing, and route optimization, the matrix is a fundamental data structure. Uber's systems constantly process grid-based maps, geographical zones, and spatial data representations, making proficiency with 2D arrays a non-negotiable skill for engineers working on its core logistics and mapping platforms.

## What to Expect — Types of Problems

Uber's matrix problems typically fall into three categories, each reflecting a real-world engineering challenge.

**Traversal & Search:** These are the most common. You'll be asked to navigate a grid, often representing a map or a board. Expect variations of Breadth-First Search (BFS) and Depth-First Search (DFS) to find paths, count islands, or spread influence from a point (e.g., modeling ride requests spreading through city blocks). Questions may involve obstacles, weighted cells, or multiple starting points.

**Dynamic Programming on Grids:** These problems require building a solution incrementally across the matrix. Classic examples include finding unique paths from a start to an end cell (with or without obstacles), calculating minimum path sums (like optimizing a route's cost), or solving problems like maximal square. They test your ability to break down a complex spatial problem into overlapping subproblems.

**Simulation & State Change:** Here, you model a process over time. The matrix state updates in passes according to specific rules. The "Game of Life" problem is a canonical example, analogous to simulating traffic flow patterns or the spread of demand hotspots. You must carefully manage state transitions without using the updated matrix as input for the same iteration.

## How to Prepare — Study Tips with One Code Example

Master the core patterns. Don't just memorize solutions—understand why BFS is used for shortest path in unweighted grids and DFS for connected components. Practice writing clean, bug-free code for grid traversal immediately. Always clarify edge cases: empty matrix, 1x1 grid, and boundaries.

A fundamental pattern is **BFS for shortest path in a binary matrix**. This is crucial for problems like finding the shortest route from point A to B, avoiding obstacles. The key is to use a queue to explore cells layer by layer, marking them visited as you go.

<div class="code-group">

```python
from collections import deque

def shortestPathBinaryMatrix(grid):
    if not grid or grid[0][0] == 1:
        return -1

    n = len(grid)
    directions = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    queue = deque([(0, 0, 1)])  # (row, col, distance)
    grid[0][0] = 1  # Mark visited

    while queue:
        r, c, dist = queue.popleft()
        if r == n-1 and c == n-1:
            return dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                queue.append((nr, nc, dist + 1))
                grid[nr][nc] = 1  # Mark visited
    return -1
```

```javascript
function shortestPathBinaryMatrix(grid) {
  if (!grid || grid[0][0] === 1) return -1;

  const n = grid.length;
  const dirs = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  const queue = [[0, 0, 1]]; // [row, col, distance]
  grid[0][0] = 1;

  while (queue.length) {
    const [r, c, dist] = queue.shift();
    if (r === n - 1 && c === n - 1) return dist;

    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {
        queue.push([nr, nc, dist + 1]);
        grid[nr][nc] = 1;
      }
    }
  }
  return -1;
}
```

```java
import java.util.LinkedList;
import java.util.Queue;

public int shortestPathBinaryMatrix(int[][] grid) {
    if (grid == null || grid[0][0] == 1) return -1;

    int n = grid.length;
    int[][] dirs = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{0, 0, 1}); // {row, col, distance}
    grid[0][0] = 1;

    while (!queue.isEmpty()) {
        int[] cell = queue.poll();
        int r = cell[0], c = cell[1], dist = cell[2];
        if (r == n-1 && c == n-1) return dist;

        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0) {
                queue.offer(new int[]{nr, nc, dist + 1});
                grid[nr][nc] = 1;
            }
        }
    }
    return -1;
}
```

</div>

## Recommended Practice Order

Start with foundational traversal (DFS/BFS) on simple grids. Then, move to classic DP problems like "Unique Paths." Next, tackle simulation problems, ensuring you can manage state correctly. Finally, combine patterns in harder problems, such as those requiring BFS with multiple starting points or DP with traversal elements. Always time yourself and verbalize your thought process as you would in an interview.

[Practice Matrix at Uber](/company/uber/matrix)
