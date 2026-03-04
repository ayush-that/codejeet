---
title: "Breadth-First Search Questions at Adobe: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Adobe — patterns, difficulty breakdown, and study tips."
date: "2027-09-01"
category: "dsa-patterns"
tags: ["adobe", "breadth-first-search", "interview prep"]
---

Breadth-First Search (BFS) is a core algorithm for traversing graphs and trees level by level. At Adobe, with 23 BFS questions in their problem set, it's a non-negotiable skill. Adobe's products, like Experience Manager and Photoshop, involve complex data structures for document layers, dependency graphs, and UI component trees. BFS is the natural tool for operations that require finding the shortest path, exploring nearest neighbors, or processing hierarchical data in order—making it directly relevant to the system design and problem-solving you'll be tested on.

## What to Expect — Types of Problems

Adobe's BFS questions typically fall into three categories. You won't see abstract algorithm theory; you'll solve concrete problems.

1.  **Shortest Path in Grids & Matrices:** This is the most frequent pattern. You'll be given a 2D grid representing something like an image canvas, a delivery map, or a UI layout. Problems ask for the shortest number of steps to reach a target, spread a change (like a "fill" tool), or navigate around obstacles. Think "minimum steps for a pixel editor tool to flood an area" or "fewest clicks to navigate a menu tree."
2.  **Tree Level-Order Traversal:** While often straightforward, these questions test your ability to process hierarchical data precisely—key for working with document object models or layer groups. Variations include zigzag traversal, connecting level siblings, or finding the largest value on each level.
3.  **Graph Traversal & Topological Sorting:** For problems involving dependencies, like task scheduling for a render job or plugin loading order. BFS's variant, Kahn's Algorithm for topological sort, is essential here. You'll build a graph and process nodes based on indegree.

The difficulty often comes from layering BFS with other concepts: you might need to track multiple states (like keys and doors), use multiple concurrent queues, or combine BFS with a hash map for O(1) lookups.

## How to Prepare — Study Tips with One Code Example

Master the standard BFS template for a queue. Then, practice identifying the "state" that must be enqueued. Is it just a position `(r, c)`? Or is it `(r, c, keys_held, steps)`? Your visited tracking structure (e.g., a set or a 2D array) must match this state to avoid cycles.

The most critical pattern is BFS on a grid for shortest path. Here is the clean, reusable template:

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
    return -1  # Target not reachable
```

```javascript
function bfsShortestPath(grid, start, target) {
  if (!grid.length) return -1;
  const rows = grid.length,
    cols = grid[0].length;
  const dirs = [
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
    for (const [dr, dc] of dirs) {
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

**Study Tip:** Internalize this template. Then, practice modifying it: change `visited` to a 3D array for holding keys, or queue multiple starting points for multi-source BFS.

## Recommended Practice Order

Don't jump into hard problems. Build competence sequentially.

1.  **Fundamentals:** Start with pure level-order traversal on binary trees.
2.  **Grid Basics:** Solve classic "Number of Islands" and "Rotting Oranges" to solidify grid BFS.
3.  **Shortest Path:** Practice "Shortest Path in Binary Matrix" and "Walls and Gates."
4.  **State Tracking:** Tackle "Shortest Path to Get All Keys" or "Sliding Puzzle." These are Adobe-level.
5.  **Topological Sort:** Finally, practice "Course Schedule" and "Alien Dictionary."

Focus on writing bug-free BFS quickly. In interviews, you'll often extend the base pattern under pressure.

[Practice Breadth-First Search at Adobe](/company/adobe/breadth-first-search)
