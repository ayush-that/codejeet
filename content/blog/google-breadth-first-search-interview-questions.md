---
title: "Breadth-First Search Questions at Google: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Google — patterns, difficulty breakdown, and study tips."
date: "2027-02-15"
category: "dsa-patterns"
tags: ["google", "breadth-first-search", "interview prep"]
---

Breadth-First Search (BFS) is a fundamental algorithm that appears in roughly 7% of Google's technical interview questions. This high frequency is not accidental. Google's engineering problems often involve navigating relationships in systems—whether that's web pages in a crawl, nodes in a distributed network, or positions in a grid-based puzzle. BFS is the optimal tool for finding the shortest path in unweighted graphs and for exploring spaces level by level, which directly models many real-world Google scenarios like determining degrees of separation in social graphs or the minimum steps in a UI state machine. Mastering BFS demonstrates you can think systematically about state, transitions, and optimal discovery.

## What to Expect — Types of Problems

Google's BFS questions typically fall into a few predictable categories. Recognizing the pattern is half the battle.

1.  **Shortest Path in Unweighted Graphs:** The most classic use case. Given a start and end point (like two Wikipedia articles or two locations on a map), find the minimum number of hops. The graph is often implicit, such as possible moves from a board game state or transformations of a string.
2.  **Level-Order Traversal:** While tree level-order is straightforward, Google often extends this to scenarios requiring processing all nodes at the same "distance" or "depth" before moving deeper. This is common in problems involving broadcasting messages or cascading updates.
3.  **Matrix Traversal (BFS on Grids):** Given a 2D grid, find the shortest path from a starting cell to a target, often with obstacles (like walls or water). You'll need to model the grid as a graph where each cell is a node connected to its four (or eight) neighbors.
4.  **Multi-Source BFS:** A powerful variation where you initialize the queue with multiple starting points. This efficiently solves problems like "rotten oranges" (time for infection to spread) or finding the nearest gate in a maze from multiple entrances.

## How to Prepare — Study Tips with One Code Example

Focus on the core BFS template and its variations. Internalize this pattern so you can adapt it quickly.

- **Memorize the Template:** The standard BFS uses a queue and a visited set. Practice writing it from memory.
- **State Representation:** The trickiest part is often defining what constitutes a "node" in your graph. It could be a `(row, col)` tuple, a string, or a custom object. Be precise.
- **Avoiding Cycles:** Always use a visited set (or mark cells in-place on a grid) to prevent infinite loops.
- **Track Distance:** To find shortest paths, associate a distance with each node in the queue or track the number of levels processed.

Here is the essential BFS template for shortest path in an unweighted graph, shown for a grid:

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
            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];
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

Build your skill progressively. Start with the classic template, then tackle variations.

1.  **Foundation:** Implement standard BFS on an explicit graph and level-order tree traversal.
2.  **Grids:** Solve "Number of Islands" and "Rotting Oranges." These cement the grid-as-graph model.
3.  **Shortest Path:** Practice "Word Ladder" and "Open the Lock." These teach you to build the graph implicitly from state transitions.
4.  **Multi-Source:** Solve "01 Matrix" (or "Walls and Gates"). This teaches you to optimize by seeding the queue with multiple starting nodes.
5.  **Complex State:** Finally, tackle problems where the node state includes additional data, like "Shortest Path in a Grid with Obstacles Elimination."

[Practice Breadth-First Search at Google](/company/google/breadth-first-search)
