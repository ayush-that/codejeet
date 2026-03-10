---
title: "Breadth-First Search Questions at Yelp: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Yelp — patterns, difficulty breakdown, and study tips."
date: "2031-01-07"
category: "dsa-patterns"
tags: ["yelp", "breadth-first-search", "interview prep"]
---

Yelp’s engineering interviews are heavily weighted toward practical, real-world problems that map to their core services: location-based search, user reviews, business listings, and mapping features. Breadth-First Search (BFS) appears in about 11% of their tagged questions (3 out of 27), which is a significant concentration. This isn’t a coincidence. BFS is the fundamental algorithm for finding the shortest path in unweighted graphs, making it directly applicable to problems like finding the minimum steps between users and businesses, calculating distances in grid-based maps, or traversing social connections. At Yelp, BFS isn’t just an academic exercise—it’s a tool they use. In interviews, you’re likely to see it disguised as a “minimum steps” or “level-order” problem that mirrors their domain.

## Specific Patterns Yelp Favors

Yelp’s BFS questions tend to avoid abstract, complex graph theory. Instead, they focus on **grid traversal** and **shortest path in unweighted graphs**—problems that feel like mapping or navigation. You’ll often be given a matrix (like a city grid or a floor plan) where some cells are blocked, and you need to find the shortest path from a start to a target. The constraints usually involve simple movement (up/down/left/right), but sometimes include multi-state BFS where you track an additional condition, like having a key to pass a lock.

A classic example is **LeetCode 994: Rotting Oranges**. This is a multi-source BFS problem where you track the time it takes for rot to spread through a grid—analogous to how a feature might propagate through Yelp’s network. Another is **LeetCode 286: Walls and Gates**, where you find the shortest distance from each empty room to a gate, which maps directly to finding the nearest business of a certain type.

Yelp also favors **level-order traversal of trees** (LeetCode 102: Binary Tree Level Order Traversal) because it tests your ability to process data in layers, similar to how they might batch process reviews or listings. The pattern is consistent: start with a queue, process nodes level by level, and track depth or distance.

## How to Prepare

Master the standard BFS template, but be ready to adapt it for Yelp’s style. The core template uses a queue to explore neighbors level by level. For grid problems, you’ll need a directions array and bounds checking. The key variation Yelp tests is **multi-source BFS**—starting BFS from multiple points simultaneously. This is more efficient than running BFS from each source individually.

Here’s the multi-source BFS pattern for a grid, using the “rotting oranges” scenario:

<div class="code-group">

```python
from collections import deque

def orangesRotting(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0
    # Multi-source initialization: all rotten oranges at depth 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c, 0))  # (row, col, depth)
            elif grid[r][c] == 1:
                fresh_count += 1

    if fresh_count == 0:
        return 0

    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    max_depth = 0

    while queue:
        r, c, depth = queue.popleft()
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2  # Mark as rotten
                fresh_count -= 1
                queue.append((nr, nc, depth + 1))
                max_depth = max(max_depth, depth + 1)

    return max_depth if fresh_count == 0 else -1

# Time: O(rows * cols) | Space: O(rows * cols) for the queue in worst case
```

```javascript
function orangesRotting(grid) {
  const rows = grid.length,
    cols = grid[0].length;
  const queue = [];
  let freshCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        queue.push([r, c, 0]); // [row, col, depth]
      } else if (grid[r][c] === 1) {
        freshCount++;
      }
    }
  }

  if (freshCount === 0) return 0;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let maxDepth = 0;

  while (queue.length) {
    const [r, c, depth] = queue.shift();
    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
        grid[nr][nc] = 2;
        freshCount--;
        queue.push([nr, nc, depth + 1]);
        maxDepth = Math.max(maxDepth, depth + 1);
      }
    }
  }

  return freshCount === 0 ? maxDepth : -1;
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

```java
import java.util.LinkedList;
import java.util.Queue;

public int orangesRotting(int[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    Queue<int[]> queue = new LinkedList<>();
    int freshCount = 0;

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 2) {
                queue.offer(new int[]{r, c, 0}); // {row, col, depth}
            } else if (grid[r][c] == 1) {
                freshCount++;
            }
        }
    }

    if (freshCount == 0) return 0;

    int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
    int maxDepth = 0;

    while (!queue.isEmpty()) {
        int[] current = queue.poll();
        int r = current[0], c = current[1], depth = current[2];
        for (int[] dir : directions) {
            int nr = r + dir[0], nc = c + dir[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                grid[nr][nc] = 2;
                freshCount--;
                queue.offer(new int[]{nr, nc, depth + 1});
                maxDepth = Math.max(maxDepth, depth + 1);
            }
        }
    }

    return freshCount == 0 ? maxDepth : -1;
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

</div>

Another pattern is **BFS with state tracking**, like having a key to unlock doors. This requires a 3D visited set: `visited[row][col][keyState]`. Yelp might use this to model access levels in their systems.

## How Yelp Tests Breadth-First Search vs Other Companies

At companies like Google or Meta, BFS problems can be deeply nested in complex graph structures or combined with other algorithms (like Dijkstra’s for weighted edges). Yelp keeps it more grounded. Their problems are often directly solvable with standard BFS, but with a twist that requires careful state management. The difficulty is usually medium—hard enough to test your coding clarity and edge-case handling, but not so abstract that it feels like a competitive programming puzzle.

What’s unique is the **domain relevance**. A problem about finding the shortest path in a grid with obstacles might be framed as “finding the closest sushi restaurant while avoiding construction zones.” This contextual framing is a Yelp hallmark. They want to see if you can translate a real-world scenario into a clean BFS implementation.

## Study Order

1.  **Basic BFS on Trees:** Start with level-order traversal (LeetCode 102). This ingrains the queue-based, level-by-level processing pattern without the complexity of cycles or grids.
2.  **BFS on Graphs with Adjacency Lists:** Practice on simple undirected graphs (LeetCode 133: Clone Graph) to understand handling visited sets and neighbor iteration.
3.  **Grid Traversal:** Move to matrix-based BFS (LeetCode 200: Number of Islands). This adds directions arrays and bounds checking—the core of many Yelp problems.
4.  **Shortest Path in Unweighted Grids:** Solve problems like LeetCode 1091: Shortest Path in Binary Matrix. This combines grid traversal with explicit shortest-path finding.
5.  **Multi-Source BFS:** Learn to initialize the queue with multiple sources (LeetCode 994: Rotting Oranges). This is a high-yield pattern for Yelp.
6.  **BFS with State:** Finally, tackle problems that require tracking an additional state through the BFS, like LeetCode 864: Shortest Path to Get All Keys. This is the most advanced pattern they might touch.

This order builds from simple to complex, ensuring you solidify the foundational queue mechanics before adding layers like grid movement, multiple sources, or state tracking.

## Recommended Practice Order

Solve these problems in sequence to build the specific skills Yelp tests:

1.  **LeetCode 102: Binary Tree Level Order Traversal** – Master the basic BFS template.
2.  **LeetCode 200: Number of Islands** – Adapt BFS to a grid; practice marking visited cells.
3.  **LeetCode 286: Walls and Gates** – Classic shortest distance in a grid; very Yelp-relevant.
4.  **LeetCode 994: Rotting Oranges** – Multi-source BFS; understand time/depth propagation.
5.  **LeetCode 1091: Shortest Path in Binary Matrix** – Explicit shortest path in a grid with obstacles.
6.  **LeetCode 1293: Shortest Path in a Grid with Obstacles Elimination** – BFS with state (if you have time for a harder challenge).

Focus on writing clean, bug-free code for the first five. For each, articulate the time and space complexity—Yelp interviewers appreciate that clarity. Remember, they’re evaluating how you’d write production code to solve a business problem, not just if you get the right answer.

[Practice Breadth-First Search at Yelp](/company/yelp/breadth-first-search)
