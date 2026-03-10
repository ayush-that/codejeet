---
title: "Hard Amazon Interview Questions: Strategy Guide"
description: "How to tackle 351 hard difficulty questions from Amazon — patterns, time targets, and practice tips."
date: "2031-12-15"
category: "tips"
tags: ["amazon", "hard", "interview prep"]
---

# Hard Amazon Interview Questions: Strategy Guide

Amazon has 351 Hard questions out of 1938 total. That's about 18% of their problem set, but in practice, you're more likely to encounter a Hard problem in later interview rounds than that percentage suggests. What separates Amazon's Hard problems from Medium ones isn't just algorithmic complexity—it's the combination of multiple patterns, nuanced constraints, and real-world system design implications. While Medium problems often test one core algorithm, Hard problems at Amazon typically require you to orchestrate several techniques while maintaining optimal performance under specific constraints that mirror actual Amazon engineering challenges.

## Common Patterns and Templates

Amazon's Hard problems heavily favor graph algorithms, dynamic programming with tricky state definitions, and data structure combinations. The most common pattern I've seen across dozens of interviews is **graph traversal with multiple constraints**—think BFS/DFS but with additional state tracking. This appears in problems about warehouse routing, delivery optimization, and dependency resolution.

Here's the template for BFS with multiple constraints, which solves problems like "Shortest Path in a Grid with Obstacles Elimination":

<div class="code-group">

```python
from collections import deque
from typing import List

def constrained_bfs(grid: List[List[int]], k: int) -> int:
    """
    Template for BFS with multiple constraints (e.g., obstacles you can remove).
    Solves problems like LeetCode 1293: Shortest Path in a Grid with Obstacles Elimination.
    """
    m, n = len(grid), len(grid[0])

    # Visited tracking with state: (row, col, obstacles_removed)
    # Using a 3D visited array or set of tuples
    visited = [[[False] * (k + 1) for _ in range(n)] for _ in range(m)]

    # Queue elements: (row, col, obstacles_removed, steps)
    queue = deque([(0, 0, 0, 0)])  # Start with 0 obstacles removed, 0 steps
    visited[0][0][0] = True

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while queue:
        row, col, obstacles_removed, steps = queue.popleft()

        # Check if reached destination (bottom-right corner)
        if row == m - 1 and col == n - 1:
            return steps

        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            # Check bounds
            if 0 <= new_row < m and 0 <= new_col < n:
                new_obstacles = obstacles_removed + grid[new_row][new_col]

                # Check constraint: can't remove more obstacles than allowed
                if new_obstacles <= k and not visited[new_row][new_col][new_obstacles]:
                    visited[new_row][new_col][new_obstacles] = True
                    queue.append((new_row, new_col, new_obstacles, steps + 1))

    return -1  # No path found

# Time: O(m * n * k) where k is constraint limit
# Space: O(m * n * k) for visited tracking
```

```javascript
/**
 * Template for BFS with multiple constraints.
 * Solves problems like LeetCode 1293: Shortest Path in a Grid with Obstacles Elimination.
 */
function constrainedBFS(grid, k) {
  const m = grid.length,
    n = grid[0].length;

  // 3D visited array: visited[row][col][obstaclesRemoved]
  const visited = Array.from({ length: m }, () =>
    Array.from({ length: n }, () => new Array(k + 1).fill(false))
  );

  // Queue: [row, col, obstaclesRemoved, steps]
  const queue = [[0, 0, 0, 0]];
  visited[0][0][0] = true;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length > 0) {
    const [row, col, obstaclesRemoved, steps] = queue.shift();

    if (row === m - 1 && col === n - 1) {
      return steps;
    }

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < m && newCol >= 0 && newCol < n) {
        const newObstacles = obstaclesRemoved + grid[newRow][newCol];

        if (newObstacles <= k && !visited[newRow][newCol][newObstacles]) {
          visited[newRow][newCol][newObstacles] = true;
          queue.push([newRow, newCol, newObstacles, steps + 1]);
        }
      }
    }
  }

  return -1;
}

// Time: O(m * n * k) where k is constraint limit
// Space: O(m * n * k) for visited tracking
```

```java
import java.util.*;

public class ConstrainedBFS {
    /**
     * Template for BFS with multiple constraints.
     * Solves problems like LeetCode 1293: Shortest Path in a Grid with Obstacles Elimination.
     */
    public int shortestPath(int[][] grid, int k) {
        int m = grid.length, n = grid[0].length;

        // 3D visited array: visited[row][col][obstaclesRemoved]
        boolean[][][] visited = new boolean[m][n][k + 1];

        // Queue elements: row, col, obstaclesRemoved, steps
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0, 0, 0});
        visited[0][0][0] = true;

        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0], col = current[1];
            int obstaclesRemoved = current[2], steps = current[3];

            if (row == m - 1 && col == n - 1) {
                return steps;
            }

            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                if (newRow >= 0 && newRow < m && newCol >= 0 && newCol < n) {
                    int newObstacles = obstaclesRemoved + grid[newRow][newCol];

                    if (newObstacles <= k && !visited[newRow][newCol][newObstacles]) {
                        visited[newRow][newCol][newObstacles] = true;
                        queue.offer(new int[]{newRow, newCol, newObstacles, steps + 1});
                    }
                }
            }
        }

        return -1;
    }
}

// Time: O(m * n * k) where k is constraint limit
// Space: O(m * n * k) for visited tracking
```

</div>

## Time Benchmarks and What Interviewers Look For

For a 45-minute Amazon interview slot, you should aim to solve a Hard problem in 25-30 minutes, leaving 10-15 minutes for discussion and follow-ups. The actual solving time breakdown looks like: 5 minutes to understand and ask clarifying questions, 10 minutes to develop the approach, 10 minutes to code, and 5 minutes to test with examples.

Beyond correctness, Amazon interviewers watch for specific signals:

1. **Trade-off awareness**: Can you explain why you chose BFS over DFS, or a hash map over an array? Amazon engineers constantly make these decisions.
2. **Constraint handling**: Do you check edge cases like empty inputs, large values, or memory limits? This reflects production code quality.
3. **Communication clarity**: Are you thinking aloud, explaining your reasoning before coding? Amazon's Leadership Principle "Earn Trust" applies here.
4. **Testability**: Do you naturally walk through test cases, including the tricky ones? This shows you think about correctness systematically.

## Upgrading from Medium to Hard

The jump from Medium to Hard at Amazon requires three specific skill upgrades:

1. **Multi-dimensional state tracking**: Medium DP problems might use 1D or 2D arrays. Hard problems often need 3D or even 4D state (like the BFS template above with row, column, and obstacle count). You need to identify what additional dimensions are necessary.

2. **Algorithm composition**: While Medium problems typically test one algorithm, Hard problems combine them. For example, "LRU Cache" (#146) combines hash maps and linked lists; "Find Median from Data Stream" (#295) combines two heaps. You need to recognize which components work together.

3. **Optimization awareness**: Medium problems often have obvious optimal solutions. Hard problems require you to prove why your solution is optimal or discuss trade-offs between time and space complexity.

The mindset shift is from "find the algorithm" to "design the system." You're not just implementing Dijkstra's algorithm—you're designing a delivery route optimizer that handles real-world constraints.

## Specific Patterns for Hard

**Pattern 1: Trie with DFS for word search problems**
Amazon loves word search variations (like "Word Search II" #212) because they relate to search functionality. The pattern combines a trie for efficient prefix checking with DFS for grid exploration.

**Pattern 2: Segment Trees for range queries**
Problems involving frequent range queries on mutable arrays appear in inventory management scenarios. The segment tree pattern provides O(log n) updates and queries, beating the O(n) naive approach.

**Pattern 3: Union-Find with additional state**
Beyond basic connectivity, Amazon problems often require tracking component size, checking bipartiteness, or maintaining other properties across unions. This appears in network reliability and social connection problems.

## Practice Strategy

Don't just solve all 351 Hard problems—that's inefficient. Instead:

1. **Start with frequency-sorted problems**: Use LeetCode's Amazon frequency list. The top 50 Hard problems cover 80% of interview patterns.

2. **Practice in thematic batches**: Group 5-7 problems by pattern (all graph problems, all DP problems) to reinforce recognition.

3. **Time yourself strictly**: 30 minutes per problem, no exceptions. If you can't solve it, study the solution, then re-attempt it 3 days later.

4. **Daily target**: 2 Hard problems per day, with 1 being a new pattern and 1 being a review of a previously challenging problem.

5. **Mock interview weekly**: Get someone to watch you solve a Hard problem in 30 minutes with live discussion.

The key isn't memorizing solutions—it's developing pattern recognition speed and the ability to combine techniques under time pressure.

[Practice Hard Amazon questions](/company/amazon/hard)
