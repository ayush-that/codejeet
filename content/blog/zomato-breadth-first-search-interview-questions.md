---
title: "Breadth-First Search Questions at Zomato: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Zomato — patterns, difficulty breakdown, and study tips."
date: "2030-11-22"
category: "dsa-patterns"
tags: ["zomato", "breadth-first-search", "interview prep"]
---

Breadth-First Search (BFS) is a core algorithm for Zomato’s technical interviews because it directly models real-world platform operations. The company’s systems—from mapping delivery partner locations and calculating delivery radii to organizing restaurant hierarchies and modeling user connection networks—rely on processing relationships in layers. BFS’s guarantee of finding the shortest path in an unweighted graph makes it ideal for logistics, network traversal, and level-order analysis. With 5 out of 29 total tagged questions involving BFS, mastering it is non-negotiable for roles in backend engineering, data infrastructure, and systems design at Zomato.

## What to Expect — Types of Problems

Zomato’s BFS questions typically fall into three categories, each reflecting a domain problem.

1.  **Shortest Path in Grids or Networks:** This is the most common pattern. You’ll be given a grid (representing a city map or delivery zones) or a network graph (representing user connections or restaurant partnerships) and asked to find the shortest number of steps or connections between two points. Problems often involve obstacles (like blocked streets or unavailable restaurants) and require modifications like multi-source BFS.
2.  **Level-Order Traversal & Hierarchical Processing:** This applies to tree or graph structures, such as organizing restaurant menus in categories and subcategories, or processing orders in batches based on priority or proximity. The core task is to process all nodes at the same depth or distance before moving deeper.
3.  **Connected Components & State Reachability:** These problems ask you to explore all reachable nodes from a starting point, like identifying all delivery areas serviceable from a warehouse or all users reachable through a referral network within a certain degree of separation.

## How to Prepare — Study Tips with One Code Example

Focus on the underlying patterns, not just memorizing syntax. Start by solidifying the standard BFS template using a queue. Then, practice applying it to grids (2D arrays) and adjacency list graphs. The key is to recognize when "shortest path in unweighted graph" or "process in layers" is the requirement.

A fundamental pattern is BFS on a grid for shortest path. Here is the core template for finding the shortest path from a starting cell to a target cell, avoiding obstacles.

<div class="code-group">

```python
from collections import deque

def bfs_shortest_path(grid, start, target):
    if not grid:
        return -1
    rows, cols = len(grid), len(grid[0])
    # Directions: up, down, left, right
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    queue = deque([(start[0], start[1], 0)]) # (row, col, distance)
    visited = set()
    visited.add((start[0], start[1]))

    while queue:
        row, col, dist = queue.popleft()
        if (row, col) == (target[0], target[1]):
            return dist
        for dr, dc in directions:
            new_r, new_c = row + dr, col + dc
            if (0 <= new_r < rows and 0 <= new_c < cols and
                grid[new_r][new_c] != '#' and # '#' represents an obstacle
                (new_r, new_c) not in visited):
                visited.add((new_r, new_c))
                queue.append((new_r, new_c, dist + 1))
    return -1 # Target not reachable
```

```javascript
function bfsShortestPath(grid, start, target) {
  if (!grid || grid.length === 0) return -1;
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

  while (queue.length > 0) {
    const [row, col, dist] = queue.shift();
    if (row === target[0] && col === target[1]) return dist;
    for (const [dr, dc] of directions) {
      const newR = row + dr,
        newC = col + dc;
      const key = `${newR},${newC}`;
      if (
        newR >= 0 &&
        newR < rows &&
        newC >= 0 &&
        newC < cols &&
        grid[newR][newC] !== "#" && // '#' represents an obstacle
        !visited.has(key)
      ) {
        visited.add(key);
        queue.push([newR, newC, dist + 1]);
      }
    }
  }
  return -1; // Target not reachable
}
```

```java
import java.util.*;

public class GridBFS {
    public int bfsShortestPath(char[][] grid, int[] start, int[] target) {
        if (grid == null || grid.length == 0) return -1;
        int rows = grid.length, cols = grid[0].length;
        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{start[0], start[1], 0}); // {row, col, distance}
        boolean[][] visited = new boolean[rows][cols];
        visited[start[0]][start[1]] = true;

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0], col = current[1], dist = current[2];
            if (row == target[0] && col == target[1]) return dist;
            for (int[] dir : directions) {
                int newR = row + dir[0], newC = col + dir[1];
                if (newR >= 0 && newR < rows && newC >= 0 && newC < cols &&
                    grid[newR][newC] != '#' && // '#' represents an obstacle
                    !visited[newR][newC]) {
                    visited[newR][newC] = true;
                    queue.offer(new int[]{newR, newC, dist + 1});
                }
            }
        }
        return -1; // Target not reachable
    }
}
```

</div>

## Recommended Practice Order

Build competency progressively:

1.  **Foundation:** Implement standard BFS on a tree (level-order traversal) and a simple adjacency list graph.
2.  **Core Pattern:** Solve at least 3-5 "shortest path in a binary matrix" or "rotting oranges" style grid problems.
3.  **Variants:** Practice multi-source BFS (like multiple delivery start points) and BFS with state (like carrying a key through doors).
4.  **Zomato Context:** Finally, apply these patterns to problems involving networks, hierarchies, and reachability to think like a Zomato engineer.

[Practice Breadth-First Search at Zomato](/company/zomato/breadth-first-search)
