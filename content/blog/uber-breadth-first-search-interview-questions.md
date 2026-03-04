---
title: "Breadth-First Search Questions at Uber: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Uber — patterns, difficulty breakdown, and study tips."
date: "2027-06-15"
category: "dsa-patterns"
tags: ["uber", "breadth-first-search", "interview prep"]
---

Breadth-First Search (BFS) is a fundamental algorithm for navigating graphs and grids level by level. At Uber, with its massive datasets mapping cities, drivers, trips, and delivery routes, BFS is a critical tool for solving real-world spatial and connectivity problems. The algorithm's ability to find the shortest path in unweighted graphs makes it directly applicable to features like estimating ride times, calculating delivery zones, optimizing dispatch, and analyzing network reliability. Mastering BFS is non-negotiable for tackling nearly 60 Uber-specific questions that model these operational challenges.

## What to Expect — Types of Problems

Uber's BFS questions typically model real-world systems as graphs. You won't see abstract puzzle problems; expect scenarios grounded in Uber's operations.

1.  **Shortest Path in a Grid:** This is the most common pattern. The grid represents a city map, a warehouse layout, or a network of nodes. Cells may be blocked (representing buildings, obstacles, or offline nodes). You'll be asked to find the minimum steps (time, distance) for a driver to reach a rider, a delivery to reach a destination, or to check if a location is reachable.
2.  **Level-Order Traversal & Tree Analysis:** While less frequent than grids, tree problems appear. These often involve analyzing hierarchical data, like organizational structures or nested geographical regions, requiring processing level by level.
3.  **Multi-Source BFS:** A key advanced variation. Instead of starting BFS from a single point, you initialize the queue with multiple sources. This perfectly models scenarios like finding the nearest available driver from a set of drivers to a rider, or calculating the distance from any service center to all points in a city.
4.  **Graph Connectivity & Component Analysis:** Questions may ask you to count the number of isolated service regions, check if all data centers are connected, or find the size of a connected cluster of points (like a surge pricing zone).

## How to Prepare — Study Tips with One Code Example

Focus on the patterns, not just memorizing code. Internalize the BFS template: a queue, a visited set, and processing nodes level by level. Always clarify the graph representation: is it an adjacency list, a grid, or an implicit graph? For Uber, explicitly state how the problem maps to a real Uber use case (e.g., "The grid here represents city blocks, where '1' is a traversable road and '0' is a construction zone").

Practice writing the BFS template from scratch quickly and without bugs. The following example shows the essential **Shortest Path in a Binary Matrix (Grid)** pattern, a cornerstone for Uber problems.

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

  while (queue.length > 0) {
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
        int[] curr = queue.poll();
        int r = curr[0], c = curr[1], dist = curr[2];
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

Build competence progressively. Start with classic LeetCode problems that establish the core pattern, then move to Uber-tagged questions that apply it.

1.  **Fundamentals:** Solve `Binary Tree Level Order Traversal` and `Number of Islands` to solidify the basic queue and visited set logic.
2.  **Core Shortest Path:** Master `Shortest Path in Binary Matrix` (as above) and `Rotting Oranges`. The latter is a perfect primer for Multi-Source BFS.
3.  **Multi-Source & Advanced:** Practice `01 Matrix` (Multi-Source BFS) and `Shortest Path to Get All Keys`. These mirror complex Uber dispatch and multi-point routing.
4.  **Uber-Specific:** Finally, target the [Uber-tagged BFS problems](https://leetcode.com/company/uber/). Filter by frequency and start with the most common. Apply the patterns you've drilled to their business contexts.

[Practice Breadth-First Search at Uber](/company/uber/breadth-first-search)
