---
title: "Matrix Questions at DoorDash: What to Expect"
description: "Prepare for Matrix interview questions at DoorDash — patterns, difficulty breakdown, and study tips."
date: "2028-08-26"
category: "dsa-patterns"
tags: ["doordash", "matrix", "interview prep"]
---

Matrix questions appear in 14% of DoorDash’s technical interview problems. For a company that maps deliveries, optimizes routes, and manages logistics grids, matrices are a natural data structure. Success here demonstrates you can navigate 2D data—essential for real-world problems like delivery zone mapping, inventory grids, or simulating movement across a city layout.

## What to Expect — Types of Problems

DoorDash matrix problems typically fall into three categories:

1. **Grid Traversal and Pathfinding**  
   Problems involve moving through a matrix (e.g., representing a map or warehouse layout) using BFS, DFS, or dynamic programming. Common examples: shortest path in a grid, counting unique paths with obstacles, or finding connected regions.

2. **Matrix Transformation and Simulation**  
   These questions ask you to modify the matrix in-place or simulate a process. Examples: rotating an image (matrix), the “game of life” simulation, or spreading changes across adjacent cells over time—similar to how delivery hotspots might propagate.

3. **Search in Sorted Matrix**  
   While less frequent, some problems involve searching in a matrix sorted row-wise or column-wise, testing your ability to optimize beyond a naive O(m\*n) scan.

Expect constraints around efficiency and edge cases, such as large matrices or in-place operation requirements.

## How to Prepare — Study Tips with One Code Example

Focus on core patterns: BFS for shortest path, DFS for connected components, and in-place rotation techniques. Practice writing clean, bug-free code under time pressure. Always clarify the problem (e.g., input bounds, movement rules) before starting.

A key pattern is **BFS for shortest path in a grid**. Here’s a template for problems where you move up, down, left, right and need the shortest path length from a start to a target, avoiding obstacles:

<div class="code-group">

```python
from collections import deque

def shortest_path(grid, start, target):
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
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0 and (nr, nc) not in visited:
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))
    return -1  # No path found
```

```javascript
function shortestPath(grid, start, target) {
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

public class MatrixBFS {
    public int shortestPath(int[][] grid, int[] start, int[] target) {
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
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 0 && !visited[nr][nc]) {
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

1. Start with fundamental traversals (DFS/BFS) on binary matrices.
2. Move to dynamic programming problems (e.g., unique paths, minimum path sum).
3. Practice in-place transformations (rotate, transpose).
4. Tackle advanced simulations (e.g., game of life, flood fill variations).
5. Finally, mix in search problems in sorted matrices.

Prioritize quality over quantity: solve each problem, then analyze time/space complexity and edge cases.

[Practice Matrix at DoorDash](/company/doordash/matrix)
