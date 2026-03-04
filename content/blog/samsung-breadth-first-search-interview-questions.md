---
title: "Breadth-First Search Questions at Samsung: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Samsung — patterns, difficulty breakdown, and study tips."
date: "2028-11-30"
category: "dsa-patterns"
tags: ["samsung", "breadth-first-search", "interview prep"]
---

Breadth-First Search (BFS) is a core algorithm for Samsung coding interviews. With 10 out of their 69 total tagged questions, it’s one of their most frequently assessed topics. Samsung’s problems often involve modeling real-world systems—like network routing, robot navigation, or circuit simulation—where you must find the shortest path or minimum steps in a state space. BFS is the natural tool for these scenarios because it systematically explores all possibilities level by level, guaranteeing the first solution found is the shortest in an unweighted graph.

## What to Expect — Types of Problems

Samsung’s BFS questions rarely present as simple graph traversals. You’ll typically need to adapt the algorithm to a complex grid or state-based problem.

1.  **Grid-Based Shortest Path:** The most common type. You’re given an N x M grid with obstacles (walls, fire, water) and a starting point. The goal is to find the minimum steps to reach a target or exit. Variations include moving in 4 or 8 directions, or having keys that unlock doors.
2.  **Multi-Source BFS:** Problems where multiple starting points exist simultaneously, like multiple fires spreading or several agents starting a search. The solution initializes the queue with all sources.
3.  **State-Aware BFS (BFS on a Graph of States):** The “node” in your search isn’t just a coordinate; it’s a _state_ (e.g., position + keys collected + time elapsed). This expands the visited dimension beyond a simple 2D array to a higher-dimensional space (e.g., `visited[x][y][key_bitmask]`).
4.  **Simulation + BFS:** The problem requires you to simulate a process (like block falling, water flow, or infection spread) and use BFS to find the outcome after a certain number of steps or the steps to reach a condition.

## How to Prepare — Study Tips with One Code Example

Master the standard BFS template for a grid. Then, practice identifying the “state” you need to track. Your visited data structure must account for all unique aspects of that state to avoid cycles.

A key pattern is **Multi-Source BFS**. Imagine a grid where several cells are starting points (e.g., rotten oranges, fire sources). Instead of doing BFS from each source separately, you initialize the queue with _all_ sources at distance 0. This efficiently simulates simultaneous expansion.

<div class="code-group">

```python
from collections import deque

def multi_source_bfs(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    # Initialize: push all source cells into queue
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:  # Source
                queue.append((r, c, 0))  # (row, col, distance)
    # Directions
    dirs = [(0,1), (1,0), (0,-1), (-1,0)]
    max_distance = 0
    while queue:
        r, c, dist = queue.popleft()
        max_distance = max(max_distance, dist)
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0:
                grid[nr][nc] = 1  # Mark as visited/processed
                queue.append((nr, nc, dist + 1))
    return max_distance
```

```javascript
function multiSourceBFS(grid) {
  const rows = grid.length,
    cols = grid[0].length;
  const queue = [];
  // Initialize queue with all sources
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        queue.push([r, c, 0]); // [row, col, distance]
      }
    }
  }
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  let maxDistance = 0;
  while (queue.length) {
    const [r, c, dist] = queue.shift();
    maxDistance = Math.max(maxDistance, dist);
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0) {
        grid[nr][nc] = 1;
        queue.push([nr, nc, dist + 1]);
      }
    }
  }
  return maxDistance;
}
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class MultiSourceBFS {
    public int multiSourceBFS(int[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        // Initialize queue with all sources
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 1) {
                    queue.offer(new int[]{r, c, 0}); // {row, col, distance}
                }
            }
        }
        int[][] dirs = {{0,1}, {1,0}, {0,-1}, {-1,0}};
        int maxDistance = 0;
        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1], dist = curr[2];
            maxDistance = Math.max(maxDistance, dist);
            for (int[] d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 0) {
                    grid[nr][nc] = 1;
                    queue.offer(new int[]{nr, nc, dist + 1});
                }
            }
        }
        return maxDistance;
    }
}
```

</div>

## Recommended Practice Order

1.  Start with classic grid BFS (Number of Islands, Shortest Path in Binary Matrix).
2.  Practice Multi-Source BFS (Rotting Oranges, Walls and Gates).
3.  Tackle State-Aware BFS problems (Shortest Path to Get All Keys).
4.  Finally, solve Samsung’s specific, often more complex, problem variations. These integrate the above patterns within intricate scenarios.

[Practice Breadth-First Search at Samsung](/company/samsung/breadth-first-search)
