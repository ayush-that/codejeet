---
title: "Breadth-First Search Questions at PhonePe: What to Expect"
description: "Prepare for Breadth-First Search interview questions at PhonePe — patterns, difficulty breakdown, and study tips."
date: "2028-07-01"
category: "dsa-patterns"
tags: ["phonepe", "breadth-first-search", "interview prep"]
---

Breadth-First Search (BFS) is a core algorithm for PhonePe’s technical interviews. Given that 18 out of their 102 cataloged problems involve BFS, it’s clearly a priority. For a company handling massive transaction graphs, payment networks, and real-time fraud detection systems, BFS is indispensable for exploring states, finding shortest paths in unweighted graphs, and modeling level-by-step processes. Mastering it is non-negotiable.

## What to Expect — Types of Problems

PhonePe’s BFS questions typically fall into three categories.

**1. Shortest Path in Grids & Matrices:** This is the most frequent pattern. You’re given a 2D grid (like a map of obstacles, characters, or states) and must find the minimum steps to reach a target. Variations include moving in 4 or 8 directions, dealing with keys and locks, or destroying obstacles along the way.

**2. Tree Level-Order Traversal:** While straightforward, these questions test your fundamental BFS implementation. Expect problems involving printing levels, finding the largest value on each level, or zigzag traversal. They often serve as a warm-up.

**3. Graph Traversal & State Search:** These are the most challenging. Problems involve traversing implicit graphs, like transforming one word to another through a dictionary (Word Ladder) or solving a puzzle like a sliding block. The "state" might be a combination of positions, keys collected, or time elapsed, encoded into a visited set.

## How to Prepare — Study Tips with One Code Example

Focus on the pattern, not just memorization. BFS always uses a queue. The key is correctly defining what constitutes a "node" and a "neighbor" for your problem. For grids, the node is a cell `(r, c)`; for state search, it might be a tuple `(position, keys_mask)`.

Always use a `visited` set to avoid cycles. For shortest path, track distance either by storing it in the queue with the node or by using a separate dictionary.

Here is the essential BFS template for a shortest path in a binary matrix, a classic PhonePe problem pattern.

<div class="code-group">

```python
from collections import deque

def shortestPathBinaryMatrix(grid):
    if grid[0][0] == 1:
        return -1
    n = len(grid)
    directions = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    queue = deque([(0, 0, 1)])  # (row, col, distance)
    visited = set((0, 0))

    while queue:
        r, c, dist = queue.popleft()
        if r == n-1 and c == n-1:
            return dist
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0 and (nr, nc) not in visited:
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))
    return -1
```

```javascript
function shortestPathBinaryMatrix(grid) {
  if (grid[0][0] === 1) return -1;
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
  const visited = new Set();
  visited.add("0,0");

  while (queue.length) {
    const [r, c, dist] = queue.shift();
    if (r === n - 1 && c === n - 1) return dist;
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      const key = `${nr},${nc}`;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0 && !visited.has(key)) {
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

public class Solution {
    public int shortestPathBinaryMatrix(int[][] grid) {
        if (grid[0][0] == 1) return -1;
        int n = grid.length;
        int[][] dirs = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0, 1}); // {row, col, distance}
        boolean[][] visited = new boolean[n][n];
        visited[0][0] = true;

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1], dist = curr[2];
            if (r == n-1 && c == n-1) return dist;
            for (int[] d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < n && nc >=0 && nc < n && grid[nr][nc] == 0 && !visited[nr][nc]) {
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

1.  **Fundamentals:** Start with Tree Level-Order Traversal to internalize the queue mechanics.
2.  **Grid Shortest Path:** Practice basic "01 matrix" and "shortest path in binary matrix" problems. This builds intuition for direction arrays and boundary checks.
3.  **Obstacle & Key Variations:** Move to problems where the state changes, like "Shortest Path to Get All Keys." This teaches you to encode state in your visited set.
4.  **Implicit Graph & Word Problems:** Finally, tackle problems like "Word Ladder" and "Sliding Puzzle." These test your ability to model a problem as a BFS graph from scratch.

[Practice Breadth-First Search at PhonePe](/company/phonepe/breadth-first-search)
