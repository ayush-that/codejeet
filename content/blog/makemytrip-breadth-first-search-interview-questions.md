---
title: "Breadth-First Search Questions at MakeMyTrip: What to Expect"
description: "Prepare for Breadth-First Search interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-11"
category: "dsa-patterns"
tags: ["makemytrip", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at MakeMyTrip: What to Expect

MakeMyTrip, as one of India's largest online travel companies, has a unique technical interview profile. Their coding questions frequently involve graph traversal and pathfinding problems — logical when you consider their core business of connecting destinations, finding optimal routes, and navigating complex travel networks. Out of their 24 most frequently asked coding problems, 4 are Breadth-First Search (BFS) based. That's 17% of their question bank, making BFS a significant focus area rather than a secondary topic.

In real interviews, you're likely to encounter at least one BFS problem if you're interviewing for a backend, full-stack, or data engineering role. The travel domain naturally maps to graph problems: cities are nodes, flights/trains are edges, and finding connections or shortest routes is literally their business. What's interesting is that MakeMyTrip's BFS questions tend to be more _applied_ than theoretical — you'll rarely get abstract graph theory. Instead, you'll get problems that feel like real travel platform challenges.

## Specific Patterns MakeMyTrip Favors

MakeMyTrip's BFS problems cluster around three specific patterns:

1. **Grid-based shortest path problems** — These simulate navigation through obstacles (like flight restrictions or unavailable routes). Think "shortest path in a binary matrix" or "minimum steps to reach target."
2. **Level-order traversal with a twist** — They love problems where you need to process nodes level by level but track additional state (like time, cost, or intermediate stops).
3. **Multi-source BFS** — Problems where you start from multiple points simultaneously, perfect for modeling scenarios like "find nearest available hotel from multiple tourist spots."

They particularly favor iterative BFS over recursive approaches because of the explicit queue control and easier state tracking. You'll notice they avoid pure graph theory problems (like topological sort or cycle detection) and instead focus on traversal with constraints.

A classic example is **LeetCode 1091. Shortest Path in Binary Matrix** — a grid-based BFS where you navigate through 0s and 1s. Another favorite is **LeetCode 994. Rotting Oranges**, which uses multi-source BFS to model contamination spread (similar to travel delay propagation). **LeetCode 127. Word Ladder** also appears frequently, representing the journey from one word to another through valid transformations — a direct analogy to finding connecting flights with layovers.

## How to Prepare

The key to acing MakeMyTrip's BFS questions is mastering the queue-based iterative pattern with state tracking. Let's look at the core template you need internalized:

<div class="code-group">

```python
from collections import deque

def bfs_shortest_path(grid):
    """Template for grid-based shortest path BFS."""
    if not grid or not grid[0]:
        return -1

    rows, cols = len(grid), len(grid[0])
    # If start or end is blocked
    if grid[0][0] == 1 or grid[rows-1][cols-1] == 1:
        return -1

    # Queue stores (row, col, distance)
    queue = deque([(0, 0, 1)])  # Start with distance 1
    visited = [[False] * cols for _ in range(rows)]
    visited[0][0] = True

    # 8 directions for knight moves or all adjacent cells
    directions = [(-1, -1), (-1, 0), (-1, 1),
                  (0, -1),          (0, 1),
                  (1, -1),  (1, 0),  (1, 1)]

    while queue:
        row, col, dist = queue.popleft()

        # Check if we reached destination
        if row == rows-1 and col == cols-1:
            return dist

        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            # Check bounds, accessibility, and visited status
            if (0 <= new_row < rows and 0 <= new_col < cols and
                grid[new_row][new_col] == 0 and not visited[new_row][new_col]):
                visited[new_row][new_col] = True
                queue.append((new_row, new_col, dist + 1))

    return -1  # No path found

# Time: O(rows * cols) — each cell visited at most once
# Space: O(rows * cols) — for visited matrix and queue in worst case
```

```javascript
function bfsShortestPath(grid) {
  if (!grid || grid.length === 0 || grid[0].length === 0) return -1;

  const rows = grid.length;
  const cols = grid[0].length;
  if (grid[0][0] === 1 || grid[rows - 1][cols - 1] === 1) return -1;

  // Queue stores [row, col, distance]
  const queue = [[0, 0, 1]];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  visited[0][0] = true;

  // 8 directions
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  while (queue.length > 0) {
    const [row, col, dist] = queue.shift();

    if (row === rows - 1 && col === cols - 1) {
      return dist;
    }

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol] === 0 &&
        !visited[newRow][newCol]
      ) {
        visited[newRow][newCol] = true;
        queue.push([newRow, newCol, dist + 1]);
      }
    }
  }

  return -1;
}

// Time: O(rows * cols) — each cell visited at most once
// Space: O(rows * cols) — for visited matrix and queue in worst case
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class BFSTemplate {
    public int bfsShortestPath(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) return -1;

        int rows = grid.length;
        int cols = grid[0].length;
        if (grid[0][0] == 1 || grid[rows-1][cols-1] == 1) return -1;

        // Queue stores arrays of {row, col, distance}
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0, 1});
        boolean[][] visited = new boolean[rows][cols];
        visited[0][0] = true;

        // 8 directions
        int[][] directions = {
            {-1, -1}, {-1, 0}, {-1, 1},
            {0, -1},           {0, 1},
            {1, -1},  {1, 0},  {1, 1}
        };

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0];
            int col = current[1];
            int dist = current[2];

            if (row == rows-1 && col == cols-1) {
                return dist;
            }

            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                if (newRow >= 0 && newRow < rows &&
                    newCol >= 0 && newCol < cols &&
                    grid[newRow][newCol] == 0 &&
                    !visited[newRow][newCol]) {
                    visited[newRow][newCol] = true;
                    queue.offer(new int[]{newRow, newCol, dist + 1});
                }
            }
        }

        return -1;
    }
}

// Time: O(rows * cols) — each cell visited at most once
// Space: O(rows * cols) — for visited matrix and queue in worst case
```

</div>

For multi-source BFS (like Rotting Oranges), the pattern changes slightly — you initialize the queue with all starting points:

<div class="code-group">

```python
from collections import deque

def multi_source_bfs(grid):
    """Template for multi-source BFS like Rotting Oranges."""
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0

    # Initialize queue with all rotten oranges
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c, 0))  # (row, col, time)
            elif grid[r][c] == 1:
                fresh_count += 1

    if fresh_count == 0:
        return 0

    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    max_time = 0

    while queue:
        row, col, time = queue.popleft()
        max_time = max(max_time, time)

        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            if (0 <= new_row < rows and 0 <= new_col < cols and
                grid[new_row][new_col] == 1):
                grid[new_row][new_col] = 2  # Mark as rotten
                fresh_count -= 1
                queue.append((new_row, new_col, time + 1))

    return max_time if fresh_count == 0 else -1

# Time: O(rows * cols) — each cell processed once
# Space: O(rows * cols) — queue in worst case
```

```javascript
function multiSourceBFS(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;

  // Initialize queue with all rotten oranges
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        queue.push([r, c, 0]); // [row, col, time]
      } else if (grid[r][c] === 1) {
        freshCount++;
      }
    }
  }

  if (freshCount === 0) return 0;

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  let maxTime = 0;

  while (queue.length > 0) {
    const [row, col, time] = queue.shift();
    maxTime = Math.max(maxTime, time);

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol] === 1
      ) {
        grid[newRow][newCol] = 2;
        freshCount--;
        queue.push([newRow, newCol, time + 1]);
      }
    }
  }

  return freshCount === 0 ? maxTime : -1;
}

// Time: O(rows * cols) — each cell processed once
// Space: O(rows * cols) — queue in worst case
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class MultiSourceBFS {
    public int orangesRotting(int[][] grid) {
        int rows = grid.length;
        int cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshCount = 0;

        // Initialize queue with all rotten oranges
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 2) {
                    queue.offer(new int[]{r, c, 0});
                } else if (grid[r][c] == 1) {
                    freshCount++;
                }
            }
        }

        if (freshCount == 0) return 0;

        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        int maxTime = 0;

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0];
            int col = current[1];
            int time = current[2];
            maxTime = Math.max(maxTime, time);

            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                if (newRow >= 0 && newRow < rows &&
                    newCol >= 0 && newCol < cols &&
                    grid[newRow][newCol] == 1) {
                    grid[newRow][newCol] = 2;
                    freshCount--;
                    queue.offer(new int[]{newRow, newCol, time + 1});
                }
            }
        }

        return freshCount == 0 ? maxTime : -1;
    }
}

// Time: O(rows * cols) — each cell processed once
// Space: O(rows * cols) — queue in worst case
```

</div>

## How MakeMyTrip Tests Breadth-First Search vs Other Companies

MakeMyTrip's BFS questions differ from other companies in several key ways:

**Compared to FAANG companies:** FAANG BFS problems are often more abstract and algorithmic. Amazon might ask you to find the shortest path in an unweighted graph (LeetCode 127), but MakeMyTrip will add travel-specific constraints like "maximum one layover" or "only certain connection times." Google's BFS problems tend to be more mathematically complex, while MakeMyTrip's are more domain-applicable.

**Compared to other travel companies:** Booking.com or Expedia might focus more on weighted graphs (Dijkstra) for actual pricing optimization. MakeMyTrip leans toward unweighted BFS for connectivity and availability problems.

**Unique aspects:** MakeMyTrip interviewers often expect you to _explain_ how your BFS solution maps to a real travel scenario. They might say: "Imagine this grid represents airport terminals, and 1s are closed gates..." — they want to see you understand the business context. Their problems also frequently include _state tracking_ beyond just position, like tracking remaining budget, time of day, or number of stops.

## Study Order

1. **Basic BFS traversal on trees** — Understand the queue mechanics without distractions. Practice level-order traversal (LeetCode 102).
2. **Grid-based BFS with obstacles** — Learn to navigate 2D arrays with movement constraints (LeetCode 1091).
3. **Shortest path in unweighted graphs** — Master the classic BFS shortest path guarantee (LeetCode 127).
4. **Multi-source BFS** — Handle multiple starting points efficiently (LeetCode 994).
5. **BFS with additional state** — Track extra information like time, cost, or remaining moves (LeetCode 1293).
6. **Bidirectional BFS** — Optimize for problems where start and end are known (LeetCode 127 optimized version).

This order works because it builds from simple traversal to complex state management. Each step introduces exactly one new concept while reinforcing the core queue-based pattern.

## Recommended Practice Order

1. **LeetCode 102. Binary Tree Level Order Traversal** — Pure BFS mechanics
2. **LeetCode 200. Number of Islands** — BFS for connected components (DFS also works, but practice BFS)
3. **LeetCode 1091. Shortest Path in Binary Matrix** — MakeMyTrip's favorite pattern
4. **LeetCode 994. Rotting Oranges** — Multi-source BFS
5. **LeetCode 127. Word Ladder** — Graph BFS with string nodes
6. **LeetCode 1293. Shortest Path in a Grid with Obstacles Elimination** — BFS with state tracking
7. **LeetCode 815. Bus Routes** — Advanced BFS with preprocessing (appears in senior interviews)

Solve these in sequence, and after each problem, ask yourself: "How would this apply to travel routing?" That mindset shift is what separates candidates who just solve algorithms from those who impress MakeMyTrip interviewers.

[Practice Breadth-First Search at MakeMyTrip](/company/makemytrip/breadth-first-search)
