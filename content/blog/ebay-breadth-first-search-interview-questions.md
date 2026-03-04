---
title: "Breadth-First Search Questions at eBay: What to Expect"
description: "Prepare for Breadth-First Search interview questions at eBay — patterns, difficulty breakdown, and study tips."
date: "2029-03-22"
category: "dsa-patterns"
tags: ["ebay", "breadth-first-search", "interview prep"]
---

Breadth-First Search (BFS) is a core algorithm for navigating graphs and trees level by level. At eBay, where engineers build systems for search, recommendations, logistics, and network analysis, BFS is a practical tool for solving real-world connectivity and shortest-path problems. The platform's scale—millions of users, items, and data relationships—makes efficient graph traversal essential. eBay's interview process reflects this: out of approximately 60 total coding questions tagged to the company, 8 are specifically BFS problems. Mastering BFS demonstrates you can handle hierarchical data, find optimal routes, and reason about system states, which are critical skills for backend and infrastructure roles.

## What to Expect — Types of Problems

eBay's BFS questions typically fall into two categories. First, **classic graph traversal** on implicit or explicit graphs. You might be asked to find the shortest path in a grid, compute distances between nodes in a network, or traverse a tree level-by-level. Second, **state-space search** problems, where each "state" (like a configuration of a puzzle or a step in a process) is a node, and transitions are edges. For example, finding the minimum steps to reach a target configuration or the shortest sequence of operations. Problems often involve adjacency in a 2D grid (like marketplace item relationships or warehouse layouts) or BFS on a tree (for hierarchical category structures). Constraints usually require an optimal solution, making BFS the natural choice over DFS for shortest-path scenarios.

## How to Prepare — Study Tips with One Code Example

Focus on the standard BFS template using a queue. Remember to track visited nodes to avoid cycles and handle level-by-level traversal if needed. Practice converting problem descriptions into graph nodes and edges. A key pattern is **BFS on a grid** for shortest paths. Here’s a template for finding the shortest path in a binary matrix from `(0,0)` to `(n-1, m-1)`, avoiding obstacles (`1`s).

<div class="code-group">

```python
from collections import deque

def shortestPathBinaryMatrix(grid):
    if not grid or grid[0][0] == 1:
        return -1

    n = len(grid)
    directions = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    queue = deque([(0, 0, 1)])  # (row, col, distance)
    grid[0][0] = 1  # mark visited

    while queue:
        r, c, dist = queue.popleft()
        if r == n-1 and c == n-1:
            return dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                queue.append((nr, nc, dist + 1))
                grid[nr][nc] = 1  # mark visited
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
    queue.offer(new int[]{0, 0, 1}); // row, col, distance
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

Start with fundamental tree-level traversal and basic grid BFS. Move to shortest-path variations, then tackle state-space problems. Practice eBay’s tagged questions last to simulate the interview. A solid sequence:

1. Binary Tree Level Order Traversal
2. Number of Islands (BFS version)
3. Shortest Path in Binary Matrix (as above)
4. Word Ladder
5. eBay’s specific BFS problems

[Practice Breadth-First Search at eBay](/company/ebay/breadth-first-search)
