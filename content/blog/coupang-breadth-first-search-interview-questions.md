---
title: "Breadth-First Search Questions at Coupang: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Coupang — patterns, difficulty breakdown, and study tips."
date: "2029-07-06"
category: "dsa-patterns"
tags: ["coupang", "breadth-first-search", "interview prep"]
---

Breadth-First Search (BFS) is a core algorithmic technique for navigating graphs and trees level by level. At Coupang, a company built on complex logistics networks, inventory systems, and recommendation engines, BFS is a practical tool for solving real-world problems. Its 5 BFS questions out of 53 total in their interview question bank reflect its importance for modeling scenarios like finding the shortest path in a warehouse routing system, traversing a social connection graph for features like "followers you may know," or processing hierarchical data like product categories. Mastering BFS demonstrates you can think systematically about relationships and distances—a key skill for optimizing the systems that power a major e-commerce platform.

## What to Expect — Types of Problems

Coupang's BFS questions typically fall into a few predictable categories. You won't see abstract, purely academic graph theory. Instead, problems are often framed in familiar contexts.

1.  **Shortest Path in an Unweighted Grid or Matrix:** This is the most common pattern. You're given a 2D grid representing a map, warehouse layout, or game board, with obstacles (e.g., walls, unavailable inventory) and open cells. The goal is to find the minimum number of steps from a start point to a target. Variations include multiple start points, multiple targets, or conditional movement.
2.  **Level-Order Traversal in Trees:** While less frequent than grid problems, you may need to traverse a tree level-by-level. This is foundational for problems involving hierarchical data processing or serialization.
3.  **"Connected Components" in Implicit Graphs:** Problems where you must explore and label all connected regions in a grid, like identifying clusters of related products or contiguous service areas.
4.  **Word Ladder / Transformation Sequences:** Problems where you find the shortest sequence of transformations from a start state to an end state, each step changing one element. This models pathfinding in a state space.

## How to Prepare — Study Tips with One Code Example

Focus on the core BFS template. The algorithm is consistent; the challenge is applying it to a novel problem description. Key steps: 1) Use a queue, 2) Track visited nodes to avoid cycles, 3) Process nodes level by level, 4) Stop when the target is found (for shortest path).

Practice translating a problem's description into a graph. What are the "nodes"? What defines an "edge" (a valid move/transformation)? The most common pitfall is not marking a node as visited _the moment it is added to the queue_, which can lead to duplicate processing and memory issues.

Here is the essential BFS template for a shortest path in a grid, a pattern highly applicable to Coupang problems:

<div class="code-group">

```python
from collections import deque

def shortest_path(grid, start, target):
    if not grid:
        return -1

    rows, cols = len(grid), len(grid[0])
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    queue = deque([(start[0], start[1], 0)])  # (row, col, distance)
    visited = set([(start[0], start[1])])

    while queue:
        row, col, dist = queue.popleft()

        # Check if target is reached
        if (row, col) == (target[0], target[1]):
            return dist

        # Explore neighbors
        for dr, dc in directions:
            new_r, new_c = row + dr, col + dc
            # Check bounds, obstacle, and visited status
            if (0 <= new_r < rows and 0 <= new_c < cols and
                grid[new_r][new_c] != '#' and
                (new_r, new_c) not in visited):
                visited.add((new_r, new_c))
                queue.append((new_r, new_c, dist + 1))

    return -1  # Target not reachable
```

```javascript
function shortestPath(grid, start, target) {
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

    // Check if target is reached
    if (row === target[0] && col === target[1]) {
      return dist;
    }

    // Explore neighbors
    for (const [dr, dc] of directions) {
      const newR = row + dr;
      const newC = col + dc;
      const key = `${newR},${newC}`;

      // Check bounds, obstacle, and visited status
      if (
        newR >= 0 &&
        newR < rows &&
        newC >= 0 &&
        newC < cols &&
        grid[newR][newC] !== "#" &&
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

public class Solution {
    public int shortestPath(char[][] grid, int[] start, int[] target) {
        if (grid == null || grid.length == 0) return -1;

        int rows = grid.length, cols = grid[0].length;
        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
        Queue<int[]> queue = new LinkedList<>();
        boolean[][] visited = new boolean[rows][cols];

        queue.offer(new int[]{start[0], start[1], 0});
        visited[start[0]][start[1]] = true;

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0], col = current[1], dist = current[2];

            // Check if target is reached
            if (row == target[0] && col == target[1]) {
                return dist;
            }

            // Explore neighbors
            for (int[] dir : directions) {
                int newR = row + dir[0];
                int newC = col + dir[1];

                // Check bounds, obstacle, and visited status
                if (newR >= 0 && newR < rows && newC >= 0 && newC < cols &&
                    grid[newR][newC] != '#' && !visited[newR][newC]) {
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

Build proficiency incrementally. Start with pure BFS traversal on trees and simple adjacency list graphs. Then, move to the classic 2D grid shortest path problem (LeetCode 1926 is a good example). Practice problems with multiple start points by initializing the queue with all of them. Finally, tackle state-space search problems like Word Ladder. For each problem, first identify the nodes and edges, then apply the template. Time yourself.

[Practice Breadth-First Search at Coupang](/company/coupang/breadth-first-search)
