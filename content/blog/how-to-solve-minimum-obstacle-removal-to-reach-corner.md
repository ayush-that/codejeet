---
title: "How to Solve Minimum Obstacle Removal to Reach Corner — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Obstacle Removal to Reach Corner. Hard difficulty, 70.5% acceptance rate. Topics: Array, Breadth-First Search, Graph Theory, Heap (Priority Queue), Matrix."
date: "2027-02-07"
category: "dsa-patterns"
tags:
  [
    "minimum-obstacle-removal-to-reach-corner",
    "array",
    "breadth-first-search",
    "graph-theory",
    "hard",
  ]
---

# How to Solve Minimum Obstacle Removal to Reach Corner

You're given a grid where cells are either empty (0) or obstacles (1). You can move in four directions, but you can only move to empty cells unless you remove obstacles. The goal is to reach the bottom-right corner from the top-left corner while removing the minimum number of obstacles. What makes this problem interesting is that it's not just about finding any path—it's about finding the path that minimizes obstacle removal, which requires careful consideration of when to "pay" to remove obstacles versus taking longer paths around them.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 0]
]
```

We start at (0,0) which is empty (0). Our goal is to reach (2,2).

**Step 1:** From (0,0), we can move right to (0,1) or down to (1,0).

- (0,1) is an obstacle (1), so we'd need to remove it (cost = 1)
- (1,0) is empty (0), so we can move there for free (cost = 0)

**Step 2:** Let's explore the cheaper path first. From (1,0), we can move:

- Right to (1,1) - obstacle (cost = 1)
- Down to (2,0) - empty (cost = 0)

**Step 3:** From (2,0), we can move:

- Right to (2,1) - empty (cost = 0)
- Up to (1,0) - already visited

**Step 4:** From (2,1), we can move:

- Right to (2,2) - empty (cost = 0) - GOAL REACHED!

Total obstacles removed: 0. We found a path that avoids all obstacles.

Now consider a trickier example:

```
grid = [
    [0, 1, 1],
    [1, 1, 0],
    [1, 1, 0]
]
```

Here, any path to the corner will require removing at least 2 obstacles. The optimal path might be: (0,0) → (0,1) [remove 1] → (0,2) [remove 1] → (1,2) → (2,2). Total cost = 2.

The key insight: This is essentially a shortest path problem where moving to an empty cell has weight 0, and moving to an obstacle has weight 1 (the cost to remove it).

## Brute Force Approach

A naive approach would be to try all possible paths from start to end, tracking the number of obstacles removed along each path, and return the minimum. We could use DFS to explore all paths:

1. Start at (0,0) with cost = 0
2. For each neighboring cell:
   - If it's empty, add 0 to cost
   - If it's an obstacle, add 1 to cost
3. Continue until we reach (m-1, n-1)
4. Track the minimum cost across all paths

The problem with this approach is exponential time complexity. In the worst case, we might explore every possible path through the grid, which is O(4^(m\*n)) since at each cell we have up to 4 choices. For a 100×100 grid, this is completely infeasible.

Even with memoization (remembering the minimum cost to reach each cell), we still face issues because the optimal path to a cell might not be the one with the fewest steps, but the one with the fewest obstacles removed. A standard BFS won't work either because it assumes all edges have equal weight, but here we have edges with weights 0 and 1.

## Optimized Approach

The key insight is that this is a **0-1 BFS** problem (also known as a deque BFS or double-ended queue BFS). Here's why:

1. **Graph Representation**: Each cell is a node. There's an edge between adjacent cells (up, down, left, right).
2. **Edge Weights**: Moving to an empty cell has weight 0. Moving to an obstacle has weight 1 (the cost to remove it).
3. **Goal**: Find the path from (0,0) to (m-1, n-1) with minimum total weight.

When we have a graph with edge weights of only 0 or 1, we can use 0-1 BFS, which is more efficient than Dijkstra's algorithm for this special case. The algorithm works like this:

- Use a double-ended queue (deque) instead of a regular queue
- When we encounter an edge with weight 0, we add the neighbor to the **front** of the deque (like BFS)
- When we encounter an edge with weight 1, we add the neighbor to the **back** of the deque
- This ensures we always process nodes in order of increasing distance (like Dijkstra's algorithm) but with O(1) operations instead of O(log n) heap operations

Why does this work? Think of it as a modified BFS where we process "free" moves (weight 0) immediately, while "costly" moves (weight 1) wait in line. This guarantees that when we first reach a cell, we've found the minimum cost to reach it.

## Optimal Solution

Here's the complete solution using 0-1 BFS:

<div class="code-group">

```python
# Time: O(m*n) - each cell processed at most once
# Space: O(m*n) - for the distance array and deque
from collections import deque

def minimumObstacles(grid):
    m, n = len(grid), len(grid[0])

    # Distance array: minimum obstacles removed to reach each cell
    # Initialize with infinity
    dist = [[float('inf')] * n for _ in range(m)]
    dist[0][0] = 0  # Start cell has cost 0

    # Deque for 0-1 BFS: stores (row, col) tuples
    dq = deque()
    dq.append((0, 0))

    # Directions: up, down, left, right
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    while dq:
        r, c = dq.popleft()

        # If we reached the bottom-right corner, we can return early
        # because 0-1 BFS processes nodes in increasing distance order
        if r == m - 1 and c == n - 1:
            return dist[r][c]

        # Explore all four neighbors
        for dr, dc in directions:
            nr, nc = r + dr, c + dc

            # Check if neighbor is within bounds
            if 0 <= nr < m and 0 <= nc < n:
                # Calculate new cost: current cost + (1 if obstacle, 0 if empty)
                new_cost = dist[r][c] + grid[nr][nc]

                # If we found a better path to this neighbor
                if new_cost < dist[nr][nc]:
                    dist[nr][nc] = new_cost

                    # 0-1 BFS: add to front if weight 0, back if weight 1
                    if grid[nr][nc] == 0:
                        dq.appendleft((nr, nc))  # Free move, process immediately
                    else:
                        dq.append((nr, nc))  # Costly move, process later

    return dist[m-1][n-1]  # Return cost to reach bottom-right corner
```

```javascript
// Time: O(m*n) - each cell processed at most once
// Space: O(m*n) - for the distance array and deque
function minimumObstacles(grid) {
  const m = grid.length;
  const n = grid[0].length;

  // Distance array: minimum obstacles removed to reach each cell
  // Initialize with Infinity
  const dist = Array(m)
    .fill()
    .map(() => Array(n).fill(Infinity));
  dist[0][0] = 0; // Start cell has cost 0

  // Deque for 0-1 BFS: using array as deque
  const dq = [[0, 0]];

  // Directions: up, down, left, right
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (dq.length > 0) {
    // Using shift() for popleft() - O(n) but acceptable for this problem size
    // For better performance, we could use a proper deque implementation
    const [r, c] = dq.shift();

    // If we reached the bottom-right corner, return early
    if (r === m - 1 && c === n - 1) {
      return dist[r][c];
    }

    // Explore all four neighbors
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      // Check if neighbor is within bounds
      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
        // Calculate new cost: current cost + (1 if obstacle, 0 if empty)
        const newCost = dist[r][c] + grid[nr][nc];

        // If we found a better path to this neighbor
        if (newCost < dist[nr][nc]) {
          dist[nr][nc] = newCost;

          // 0-1 BFS: add to front if weight 0, back if weight 1
          if (grid[nr][nc] === 0) {
            dq.unshift([nr, nc]); // Free move, process immediately
          } else {
            dq.push([nr, nc]); // Costly move, process later
          }
        }
      }
    }
  }

  return dist[m - 1][n - 1]; // Return cost to reach bottom-right corner
}
```

```java
// Time: O(m*n) - each cell processed at most once
// Space: O(m*n) - for the distance array and deque
import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public int minimumObstacles(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        // Distance array: minimum obstacles removed to reach each cell
        // Initialize with max value
        int[][] dist = new int[m][n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                dist[i][j] = Integer.MAX_VALUE;
            }
        }
        dist[0][0] = 0;  // Start cell has cost 0

        // Deque for 0-1 BFS: stores arrays of [row, col]
        Deque<int[]> dq = new ArrayDeque<>();
        dq.offer(new int[]{0, 0});

        // Directions: up, down, left, right
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        while (!dq.isEmpty()) {
            int[] curr = dq.poll();
            int r = curr[0];
            int c = curr[1];

            // If we reached the bottom-right corner, return early
            if (r == m - 1 && c == n - 1) {
                return dist[r][c];
            }

            // Explore all four neighbors
            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];

                // Check if neighbor is within bounds
                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                    // Calculate new cost: current cost + (1 if obstacle, 0 if empty)
                    int newCost = dist[r][c] + grid[nr][nc];

                    // If we found a better path to this neighbor
                    if (newCost < dist[nr][nc]) {
                        dist[nr][nc] = newCost;

                        // 0-1 BFS: add to front if weight 0, back if weight 1
                        if (grid[nr][nc] == 0) {
                            dq.offerFirst(new int[]{nr, nc});  // Free move, process immediately
                        } else {
                            dq.offerLast(new int[]{nr, nc});  // Costly move, process later
                        }
                    }
                }
            }
        }

        return dist[m-1][n-1];  // Return cost to reach bottom-right corner
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n)**

- Each cell is added to the deque at most once (when we find a better path to it)
- For each cell, we process its 4 neighbors, so total operations are proportional to 4×m×n = O(m×n)
- The 0-1 BFS ensures we process cells in increasing order of distance, so we never revisit a cell with a higher cost

**Space Complexity: O(m×n)**

- We store a distance array of size m×n
- The deque can hold up to O(m×n) elements in the worst case
- Total space is dominated by these two data structures

## Common Mistakes

1. **Using regular BFS instead of 0-1 BFS**: A common mistake is to treat all moves equally and use a regular queue. This doesn't work because moving through an obstacle (cost 1) should be prioritized after free moves (cost 0). Regular BFS would find the shortest path in terms of steps, not minimum obstacle removal.

2. **Forgetting to check bounds**: When exploring neighbors, it's easy to forget to check if (nr, nc) is within the grid boundaries. Always validate indices before accessing the grid.

3. **Not using early termination**: Since 0-1 BFS processes nodes in increasing distance order, the first time we reach the bottom-right corner, we've found the minimum cost. You can return immediately instead of continuing to process the entire deque.

4. **Incorrect deque operations**: In 0-1 BFS, weight-0 edges go to the front of the deque, weight-1 edges go to the back. Mixing this up will give incorrect results. Remember: "0 to the front, 1 to the back."

## When You'll See This Pattern

The 0-1 BFS pattern appears in problems where you have a graph with edge weights of only 0 or 1, and you need to find the shortest path. It's more efficient than Dijkstra's algorithm for these special cases because it uses O(1) deque operations instead of O(log n) heap operations.

Related problems that use similar techniques:

1. **Shortest Path in a Grid with Obstacles Elimination (LeetCode 1293)**: Very similar to this problem but with a limit on how many obstacles you can remove. This requires BFS with an additional state dimension.

2. **Cheapest Flights Within K Stops (LeetCode 787)**: While not exactly 0-1 BFS, it involves finding shortest paths with constraints, often solved with modified BFS or Dijkstra's algorithm.

3. **Minimum Cost to Make at Least One Valid Path in a Grid (LeetCode 1368)**: Another 0-1 BFS problem where changing direction has cost 1 and not changing has cost 0.

## Key Takeaways

1. **Recognize 0-1 weight graphs**: When you see a problem where moves have costs of 0 or 1 (free vs. costly moves), think of 0-1 BFS as an optimization over Dijkstra's algorithm.

2. **Deque is key**: The double-ended queue allows us to add weight-0 edges to the front (for immediate processing) and weight-1 edges to the back (for later processing), maintaining the BFS property of processing nodes in order of increasing distance.

3. **Early termination**: With 0-1 BFS, the first time you reach the target, you've found the minimum cost path, so you can return immediately.

Related problems: [Shortest Path in a Grid with Obstacles Elimination](/problem/shortest-path-in-a-grid-with-obstacles-elimination)
