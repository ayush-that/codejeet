---
title: "Medium Walmart Labs Interview Questions: Strategy Guide"
description: "How to tackle 105 medium difficulty questions from Walmart Labs — patterns, time targets, and practice tips."
date: "2032-03-18"
category: "tips"
tags: ["walmart-labs", "medium", "interview prep"]
---

Walmart Labs interviews have a distinct flavor. Their Medium questions aren't just about algorithmic complexity; they're often practical, data-heavy problems that test your ability to model real-world systems and manipulate complex data structures efficiently. While Easy problems might ask you to traverse a tree, Medium problems will ask you to design a system to track inventory across warehouses (modeled as a graph) and find the optimal restocking path. The jump in difficulty isn't just about a more complex algorithm—it's about integrating multiple concepts under time pressure.

## Common Patterns and Templates

Walmart Labs Medium problems heavily favor **Graphs** (especially BFS/DFS for traversal and shortest path), **Dynamic Programming** for optimization (like inventory cost minimization), and **Design problems** that mimic backend systems (e.g., designing a parking lot or order tracker). A recurring theme is transforming a word problem into a known graph or DP pattern.

The most common template you'll need is **Breadth-First Search on a grid or implicit graph**. Many problems about "minimum steps," "shortest path," or "spread" in a 2D matrix (representing a warehouse map, pixel grid, or game board) boil down to this.

<div class="code-group">

```python
from collections import deque
from typing import List

def bfs_grid_template(grid: List[List[int]], start: tuple) -> int:
    """
    Template for BFS on a 2D grid to find shortest path/level.
    Assumes grid contains obstacles (e.g., 1 = blocked, 0 = free).
    Returns -1 if target unreachable.
    """
    if not grid or not grid[0]:
        return -1

    rows, cols = len(grid), len(grid[0])
    # Directions: up, down, left, right
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    # Queue holds (row, col, distance)
    queue = deque([(start[0], start[1], 0)])
    # Visited set to avoid cycles
    visited = set([(start[0], start[1])])

    while queue:
        r, c, dist = queue.popleft()

        # Check if we reached a target condition (problem-specific)
        # Example: if grid[r][c] == TARGET: return dist

        # Explore neighbors
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            # Check bounds, passability, and visited status
            if (0 <= nr < rows and 0 <= nc < cols and
                grid[nr][nc] != 1 and
                (nr, nc) not in visited):
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))

    return -1  # Target not found

# Time: O(R * C) | Space: O(R * C) in worst case for visited/queue.
```

```javascript
function bfsGridTemplate(grid, start) {
  // Template for BFS on a 2D grid to find shortest path/level.
  if (!grid || grid.length === 0 || grid[0].length === 0) return -1;

  const rows = grid.length,
    cols = grid[0].length;
  // Directions: down, up, right, left
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const queue = [[start[0], start[1], 0]];
  const visited = new Set();
  visited.add(`${start[0]},${start[1]}`);

  while (queue.length > 0) {
    const [r, c, dist] = queue.shift();

    // Check target condition (problem-specific)
    // if (grid[r][c] === TARGET) return dist;

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      const key = `${nr},${nc}`;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== 1 && !visited.has(key)) {
        visited.add(key);
        queue.push([nr, nc, dist + 1]);
      }
    }
  }
  return -1;
}
// Time: O(R * C) | Space: O(R * C)
```

```java
import java.util.*;

public class BfsGridTemplate {
    public int bfsGridTemplate(int[][] grid, int[] start) {
        // Template for BFS on a 2D grid to find shortest path/level.
        if (grid == null || grid.length == 0 || grid[0].length == 0) return -1;

        int rows = grid.length, cols = grid[0].length;
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{start[0], start[1], 0});
        boolean[][] visited = new boolean[rows][cols];
        visited[start[0]][start[1]] = true;

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int r = current[0], c = current[1], dist = current[2];

            // Check target condition (problem-specific)
            // if (grid[r][c] == TARGET) return dist;

            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                    grid[nr][nc] != 1 && !visited[nr][nc]) {
                    visited[nr][nc] = true;
                    queue.offer(new int[]{nr, nc, dist + 1});
                }
            }
        }
        return -1;
    }
}
// Time: O(R * C) | Space: O(R * C)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a 45-minute interview slot, you have about 30-35 minutes for the coding portion. A Medium problem should be **solved and fully discussed within 25 minutes**. This breaks down to: 5 minutes for clarifying questions and edge cases, 15 minutes for coding and explaining your approach, and 5 minutes for testing with examples and discussing optimizations.

Beyond a correct answer, Walmart Labs interviewers are watching for:

1.  **Problem Translation:** Can you map their business scenario (e.g., "finding the closest fulfillment center") to a computer science concept (BFS on a graph)? Verbally narrate this mapping.
2.  **Trade-off Awareness:** When you choose a data structure, be prepared to justify it. "I'm using a HashSet for O(1) lookups, accepting O(N) space to reduce time complexity."
3.  **Production-Ready Code:** Use descriptive variable names (`neighborRow` not `nr`), handle edge cases (empty input, null values), and write modular, readable code. They're evaluating you as a future colleague who will write maintainable systems code.

## Key Differences from Easy Problems

Easy problems test a single concept in isolation. A Medium problem requires you to **chain concepts together**. The core skill shift is from _recognition_ to _integration_.

- **New Techniques:** You must now combine BFS with a visited set that tracks additional state (e.g., keys collected in "Shortest Path to Get All Keys" #864). You'll use a **priority queue (heap)** for Dijkstra's algorithm instead of a simple queue for BFS when edge weights vary (e.g., path cost based on terrain).
- **Mindset Shift:** You can no longer jump straight into code. You must spend 2-3 minutes designing. Ask: "Is this a graph? What are the nodes and edges? Is this an optimization problem that suggests DP? What is the state?" The initial design phase is non-negotiable for Medium.

## Specific Patterns for Medium

1.  **Multi-Source BFS:** Instead of one starting point, you initialize the queue with multiple sources. This is perfect for problems like "rotting oranges" or calculating distance from multiple servers. The template change is simple: initialize `queue` and `visited` with all starting points at distance 0.

2.  **Topological Sort for Task Scheduling:** Many design problems involve ordering tasks with dependencies. This is a direct application of Kahn's Algorithm (BFS on a DAG).

    ```python
    # Kahn's Algorithm Skeleton
    from collections import deque, defaultdict
    def findOrder(numTasks, prerequisites):
        graph = defaultdict(list)
        indegree = [0] * numTasks
        for course, pre in prerequisites:
            graph[pre].append(course)
            indegree[course] += 1

        queue = deque([i for i in range(numTasks) if indegree[i] == 0])
        order = []
        while queue:
            node = queue.popleft()
            order.append(node)
            for neighbor in graph[node]:
                indegree[neighbor] -= 1
                if indegree[neighbor] == 0:
                    queue.append(neighbor)
        return order if len(order) == numTasks else []
    # Time: O(V + E) | Space: O(V + E)
    ```

3.  **DP with Memoization (Top-Down):** For problems like "Number of Dice Rolls With Target Sum" (#1155), the recursive relation is easier to derive, but you must add memoization to avoid exponential time. The pattern is: 1) Define state (e.g., `(dice_remaining, target_remaining)`), 2) Write base cases, 3) Check memo, 4) Recurse and store result.

## Practice Strategy

Don't just solve problems; solve them under interview conditions. Here’s a 3-week plan:

- **Week 1 (Pattern Recognition):** Group problems by the patterns above. Solve 2 Graph/BFS, 1 DP, and 1 Design problem daily. Don't time yourself yet. Focus on deeply understanding why the pattern fits. Recommended starters: "Number of Islands" (#200), "Course Schedule" (#207), "Coin Change" (#322).
- **Week 2 (Timed Integration):** Set a 25-minute timer. Mix problems from different categories. After solving, analyze: Where did you lose time? Was it in design, coding, or debugging? Practice verbalizing your thought process out loud.
- **Week 3 (Walmart Specifics):** Focus on the 105 Medium problems in their tagged list. These often have a "data processing" twist. Pay special attention to problems involving strings, hash maps, and custom comparators for sorting—these simulate real data manipulation tasks.

Aim for consistency over volume. Solving 15 problems thoroughly with the patterns internalized is far better than skimming 50. Always analyze time and space complexity for every solution you write or read.

[Practice Medium Walmart Labs questions](/company/walmart-labs/medium)
