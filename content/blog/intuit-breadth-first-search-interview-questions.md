---
title: "Breadth-First Search Questions at Intuit: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Intuit — patterns, difficulty breakdown, and study tips."
date: "2028-11-10"
category: "dsa-patterns"
tags: ["intuit", "breadth-first-search", "interview prep"]
---

Breadth-First Search (BFS) is a core algorithm for navigating graphs and trees level by level. At Intuit, with 10 out of 71 tagged questions involving BFS, it's a non-negotiable skill. The algorithm's nature—exploring nearest neighbors first—makes it ideal for problems Intuit engineers tackle: finding shortest paths in data flows, calculating degrees of separation in user networks, or processing hierarchical financial data in layers. Mastering BFS demonstrates you can think systematically about data relationships, a key requirement for building scalable applications in tax, accounting, and payment systems.

## What to Expect — Types of Problems

Intuit's BFS questions typically fall into two categories. First, **classic shortest path in grids**. You'll be given a 2D matrix representing a map (like a user transaction network or a system state) and asked to find the minimum steps to a target, often with obstacles or specific movement rules. These test your ability to model a grid as a graph and apply BFS for the optimal solution.

Second, **level-order traversal in trees and graphs**. This extends beyond binary trees to more complex structures, like dependency graphs between software services or organizational hierarchies. Problems may ask you to collect nodes per level, find the minimum depth, or locate nodes at a specific distance. The focus is on processing data in waves, which mirrors batch processing jobs common in financial software.

## How to Prepare — Study Tips with One Code Example

Focus on the BFS template. The core pattern uses a queue to explore nodes, a visited set to avoid cycles, and processes nodes level by level. Practice writing this from memory. Then, learn to adapt it: track levels, store paths, or handle dynamic obstacles. Always clarify problem constraints—grid size, possible movements, and what constitutes a "step."

A key pattern is the **BFS for shortest path in an unweighted grid**. Here’s the template in three languages:

<div class="code-group">

```python
from collections import deque

def bfs_shortest_path(grid, start, target):
    if not grid:
        return -1
    rows, cols = len(grid), len(grid[0])
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    queue = deque([(start[0], start[1], 0)])  # (row, col, distance)
    visited = set([(start[0], start[1])])

    while queue:
        r, c, dist = queue.popleft()
        if (r, c) == target:
            return dist
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols and
                grid[nr][nc] != '#' and  # '#' represents an obstacle
                (nr, nc) not in visited):
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))
    return -1
```

```javascript
function bfsShortestPath(grid, start, target) {
  if (!grid.length) return -1;
  const rows = grid.length,
    cols = grid[0].length;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const queue = [[start[0], start[1], 0]]; // [row, col, distance]
  const visited = new Set();
  visited.add(`${start[0]},${start[1]}`);

  while (queue.length) {
    const [r, c, dist] = queue.shift();
    if (r === target[0] && c === target[1]) return dist;
    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      const key = `${nr},${nc}`;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        grid[nr][nc] !== "#" &&
        !visited.has(key)
      ) {
        visited.add(key);
        queue.push([nr, nc, dist + 1]);
      }
    }
  }
  return -1;
}
```

```java
import java.util.*;

public class BFSShortestPath {
    public int bfsShortestPath(char[][] grid, int[] start, int[] target) {
        if (grid.length == 0) return -1;
        int rows = grid.length, cols = grid[0].length;
        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{start[0], start[1], 0});
        boolean[][] visited = new boolean[rows][cols];
        visited[start[0]][start[1]] = true;

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1], dist = curr[2];
            if (r == target[0] && c == target[1]) return dist;
            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                    grid[nr][nc] != '#' && !visited[nr][nc]) {
                    visited[nr][nc] = true;
                    queue.offer(new int[]{nr, nc, dist + 1});
                }
            }
        }
        return -1;
    }
}
```

</div>

## Recommended Practice Order

Start with fundamentals. Solve simple tree level-order traversal and binary tree breadth-first search problems. Next, move to grid-based shortest path questions without obstacles to solidify the template. Then, introduce obstacles and multi-source BFS (like starting from multiple points). Finally, tackle Intuit’s company-tagged problems, which often combine BFS with slight twists, such as tracking paths or modifying the grid during traversal. This progression builds from pattern recognition to adaptive application.

[Practice Breadth-First Search at Intuit](/company/intuit/breadth-first-search)
