---
title: "Breadth-First Search Questions at Citadel: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Citadel — patterns, difficulty breakdown, and study tips."
date: "2028-08-10"
category: "dsa-patterns"
tags: ["citadel", "breadth-first-search", "interview prep"]
---

Breadth-First Search (BFS) is a fundamental algorithm that appears in roughly 11% of Citadel's technical interview questions. For a firm that builds high-performance trading systems and manages complex financial networks, the ability to efficiently traverse graphs and grids is not academic—it's practical. BFS excels at finding the shortest path in unweighted graphs, modeling state transitions, and exploring levels of a problem space, all of which are directly applicable to problems in market connectivity, order routing, and risk propagation analysis. Mastering BFS demonstrates you can think in terms of layers, distances, and systematic exploration, a mindset valued for solving real-time, data-intensive problems.

## What to Expect — Types of Problems

Citadel's BFS questions typically fall into a few concrete categories. You will rarely see a textbook "traverse this graph" question. Instead, BFS is the engine for solving more complex puzzles.

1.  **Shortest Path in a Grid:** This is the most common pattern. You're given a 2D grid (representing a map, game board, or matrix) with obstacles, and you must find the minimum number of steps from a start point to a target. Variations include collecting items, breaking through walls, or multiple agents.
2.  **Level-Order Traversal & Tree/Binary Tree Problems:** While trees are a subset of graphs, BFS is the natural tool for level-by-level processing. Citadel may use this to assess understanding of hierarchical data structures.
3.  **Word Ladder & State Search:** Here, BFS traverses a graph of possible states. The classic "Word Ladder" problem (transform one word to another by changing one letter at a time) is a prime example. This models finding the shortest sequence of transitions between two valid states, analogous to certain financial modeling tasks.
4.  **Multi-Source BFS:** A powerful optimization where you initialize the queue with multiple starting points. This efficiently solves problems like "rotting oranges" or calculating distances from the nearest point of interest, which can model network effects or contagion.

## How to Prepare — Study Tips with One Code Example

Focus on understanding the core BFS template and then learn to adapt it. The key components are a queue, a visited set, and processing nodes level by level.

1.  **Memorize the Template:** Internalize the standard BFS loop so you can write it flawlessly and focus on problem-specific logic.
2.  **Practice Grid Transformations:** Become adept at moving in four (and sometimes eight) directions using direction arrays. This is crucial for shortest path problems.
3.  **Model the State:** For more complex problems, the "node" in your queue may not just be a position `(r, c)`. It could be a tuple like `(r, c, keys_collected, steps)`. Determining what constitutes the state is the hardest part.
4.  **Use a Multi-Language Template:** Be prepared to implement in your chosen language. Here is the essential BFS template for a grid:

<div class="code-group">

```python
from collections import deque

def bfs_shortest_path(grid, start, target):
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
                grid[nr][nc] != '#' and  # Not an obstacle
                (nr, nc) not in visited):
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))
    return -1  # Target not reachable
```

```javascript
function bfsShortestPath(grid, start, target) {
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
  return -1; // Target not reachable
}
```

```java
import java.util.*;

public class BFSShortestPath {
    public int bfsShortestPath(char[][] grid, int[] start, int[] target) {
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
            for (int[] d : directions) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                    grid[nr][nc] != '#' && !visited[nr][nc]) {
                    visited[nr][nc] = true;
                    queue.offer(new int[]{nr, nc, dist + 1});
                }
            }
        }
        return -1; // Target not reachable
    }
}
```

</div>

## Recommended Practice Order

Build your skills progressively. Start with the standard template application and move to Citadel-level variations.

1.  **Foundation:** Binary Tree Level Order Traversal, Number of Islands (though DFS is common, solve it with BFS).
2.  **Core Citadel Pattern:** Shortest Path in Binary Matrix, Rotting Oranges (introduces multi-source BFS).
3.  **State Search:** Word Ladder, Shortest Path to Get All Keys. This is where interviews are often decided.
4.  **Advanced Optimization:** Bus Routes, Sliding Puzzle. These test your ability to design an efficient state representation and adjacency.

[Practice Breadth-First Search at Citadel](/company/citadel/breadth-first-search)
