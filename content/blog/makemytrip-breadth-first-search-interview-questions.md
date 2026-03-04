---
title: "Breadth-First Search Questions at MakeMyTrip: What to Expect"
description: "Prepare for Breadth-First Search interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-19"
category: "dsa-patterns"
tags: ["makemytrip", "breadth-first-search", "interview prep"]
---

Breadth-First Search (BFS) is a critical algorithm for MakeMyTrip's technical interviews, appearing in roughly 17% of their coding questions. For a travel platform managing complex systems like route planning, booking engines, and dynamic pricing, BFS provides the foundational logic for exploring states, finding shortest paths in unweighted graphs, and processing data in levels. Mastering it is non-negotiable for roles involving backend systems, distributed services, or any problem requiring systematic traversal.

## What to Expect — Types of Problems

MakeMyTrip's BFS questions typically model real-world platform scenarios. You won't see abstract graph theory; expect problems grounded in operational logic.

1.  **Shortest Path & Step Transitions:** This is the most common pattern. Problems involve finding the minimum number of steps to transform one state to another (e.g., minimum clicks to book a multi-city trip, minimum operations to reconfigure a seating map) or the shortest path in a grid or network (e.g., fewest connections between cities, navigating a service mesh).
2.  **Level-Order Traversal & Serialization:** While tree traversal is less frequent, BFS is key for serializing/deserializing hierarchical data (like nested itinerary structures or category trees) and for any problem requiring processing data level by level.
3.  **Multi-Source BFS:** A frequent advanced twist. Instead of one starting point, you begin BFS from multiple nodes simultaneously. This perfectly models scenarios like propagating price updates from multiple origin cities or calculating the nearest available service node from several data centers.

The constraints are often designed to push you beyond a naive BFS implementation, requiring careful state management and avoidance of redundant visits.

## How to Prepare — Study Tips with One Code Example

Focus on the core pattern: using a queue to explore neighbors level by level, paired with a visited set to prevent cycles. The key is to cleanly define what constitutes a "node" or "state" in your problem's search space.

A fundamental pattern you must internalize is **BFS for shortest path in an unweighted grid**. This is the building block for many MakeMyTrip problems.

<div class="code-group">

```python
from collections import deque

def shortest_path_in_grid(grid, start, target):
    # Grid: 0 = traversable, 1 = obstacle
    rows, cols = len(grid), len(grid[0])
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    queue = deque([(start[0], start[1], 0)]) # (row, col, distance)
    visited = set([(start[0], start[1])])

    while queue:
        r, c, dist = queue.popleft()
        if (r, c) == (target[0], target[1]):
            return dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols and
                grid[nr][nc] == 0 and (nr, nc) not in visited):
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))
    return -1 # No path found
```

```javascript
function shortestPathInGrid(grid, start, target) {
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

  while (queue.length > 0) {
    const [r, c, dist] = queue.shift();
    if (r === target[0] && c === target[1]) return dist;

    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      const key = `${nr},${nc}`;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0 && !visited.has(key)) {
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

public class GridBFS {
    public int shortestPathInGrid(int[][] grid, int[] start, int[] target) {
        int rows = grid.length, cols = grid[0].length;
        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
        Queue<int[]> queue = new LinkedList<>();
        boolean[][] visited = new boolean[rows][cols];

        queue.offer(new int[]{start[0], start[1], 0});
        visited[start[0]][start[1]] = true;

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1], dist = curr[2];
            if (r == target[0] && c == target[1]) return dist;

            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                    grid[nr][nc] == 0 && !visited[nr][nc]) {
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

Build competence sequentially. Start with the standard template for tree and graph traversal. Then, solve classic grid-based shortest path problems. Next, tackle problems where the "node" is a string or a custom state (like "minimum genetic mutation" or "word ladder"). Finally, practice the advanced multi-source BFS pattern. For each problem, explicitly identify the state, the neighbors, and the goal condition.

[Practice Breadth-First Search at MakeMyTrip](/company/makemytrip/breadth-first-search)
