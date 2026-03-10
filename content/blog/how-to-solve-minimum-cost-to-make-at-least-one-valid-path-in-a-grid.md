---
title: "How to Solve Minimum Cost to Make at Least One Valid Path in a Grid — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Make at Least One Valid Path in a Grid. Hard difficulty, 70.9% acceptance rate. Topics: Array, Breadth-First Search, Graph Theory, Heap (Priority Queue), Matrix."
date: "2026-06-29"
category: "dsa-patterns"
tags:
  [
    "minimum-cost-to-make-at-least-one-valid-path-in-a-grid",
    "array",
    "breadth-first-search",
    "graph-theory",
    "hard",
  ]
---

# How to Solve Minimum Cost to Make at Least One Valid Path in a Grid

This problem asks us to find the minimum number of sign changes needed to create a valid path from the top-left to bottom-right of a grid, where each cell points to a neighboring cell. What makes this problem interesting is that it transforms a grid navigation problem into a shortest path problem with zero-cost and unit-cost edges—a classic 0-1 BFS scenario.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
[1, 1, 1]
[2, 2, 2]
[1, 1, 2]
```

We start at (0,0) which points right (value 1). Following the arrows without changes:

- (0,0) → (0,1) → (0,2) (all point right)
- (0,2) points right but we're at the boundary, so we need to change it
- If we change (0,2) to point down (value 2), we go to (1,2)
- (1,2) points down (value 2) → (2,2) which is our destination

This path requires 1 change. But is this optimal? Let's think about alternatives:

- What if we change (0,0) to point down immediately? That would be 1 change
- (0,0) → (1,0) → (1,1) → (1,2) → (2,2) with no more changes

So the minimum cost is 1. The key insight: moving in the direction a cell points to costs 0, while moving in any other direction costs 1 (because we'd need to change the sign).

## Brute Force Approach

A naive approach would be to try all possible combinations of sign changes. For an m×n grid, each cell can point in 4 directions, so there are 4^(m×n) possible configurations. For each configuration, we'd need to check if a valid path exists from (0,0) to (m-1,n-1).

Even for a small 3×3 grid, that's 4^9 = 262,144 configurations to check. For each configuration, we'd need to traverse the grid to check connectivity. This is clearly infeasible for typical constraints (m,n ≤ 100).

The brute force fails because it doesn't leverage the structure of the problem—we don't need to consider all possible sign configurations, only the optimal sequence of moves from start to finish.

## Optimized Approach

The key insight is to model this as a graph shortest path problem:

- Each cell is a node
- Moving in the direction the cell points to has cost 0 (no sign change needed)
- Moving in any other direction has cost 1 (sign change needed)

This gives us a graph with edges of weight 0 or 1. For such graphs, we can use **0-1 BFS** (also called Dial's algorithm or deque BFS), which is more efficient than Dijkstra's algorithm for this special case.

Why 0-1 BFS works:

1. When we encounter a zero-cost edge, we add the neighbor to the front of the deque (like BFS)
2. When we encounter a one-cost edge, we add the neighbor to the back of the deque
3. This ensures we always process nodes in increasing order of cost, similar to Dijkstra but with O(1) operations instead of O(log n)

The algorithm:

1. Initialize a 2D array `dist` with infinity, set `dist[0][0] = 0`
2. Use a deque to store (row, col) pairs
3. While deque is not empty:
   - Pop from front (lowest cost node)
   - For each of the 4 directions:
     - Calculate cost: 0 if direction matches cell's arrow, else 1
     - If new cost < existing cost at neighbor, update and push to front (if cost=0) or back (if cost=1)
4. Return `dist[m-1][n-1]`

## Optimal Solution

Here's the complete implementation using 0-1 BFS:

<div class="code-group">

```python
# Time: O(m*n) - each cell processed at most 4 times
# Space: O(m*n) for distance array and deque
from collections import deque

def minCost(grid):
    m, n = len(grid), len(grid[0])

    # Directions: right, left, down, up (matching values 1,2,3,4 in problem)
    # Note: problem uses 1=right, 2=left, 3=down, 4=up
    dirs = [(0, 1), (0, -1), (1, 0), (-1, 0)]

    # Distance array initialized to infinity
    dist = [[float('inf')] * n for _ in range(m)]
    dist[0][0] = 0  # Start cell has cost 0

    # Deque for 0-1 BFS: stores (row, col)
    dq = deque()
    dq.append((0, 0))

    while dq:
        r, c = dq.popleft()

        # Check all 4 possible directions
        for i, (dr, dc) in enumerate(dirs):
            nr, nc = r + dr, c + dc

            # Check if neighbor is within bounds
            if 0 <= nr < m and 0 <= nc < n:
                # Cost is 0 if direction matches grid[r][c], else 1
                # Note: i+1 because directions are 1-indexed in problem
                cost = 0 if grid[r][c] == i + 1 else 1
                new_cost = dist[r][c] + cost

                # If we found a cheaper path to neighbor
                if new_cost < dist[nr][nc]:
                    dist[nr][nc] = new_cost

                    # Add to front if zero-cost, back if one-cost
                    if cost == 0:
                        dq.appendleft((nr, nc))
                    else:
                        dq.append((nr, nc))

    return dist[m-1][n-1]
```

```javascript
// Time: O(m*n) - each cell processed at most 4 times
// Space: O(m*n) for distance array and deque
function minCost(grid) {
  const m = grid.length,
    n = grid[0].length;

  // Directions: right, left, down, up (matching values 1,2,3,4)
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // Distance array initialized to Infinity
  const dist = Array(m)
    .fill()
    .map(() => Array(n).fill(Infinity));
  dist[0][0] = 0;

  // Deque for 0-1 BFS using array as deque
  const dq = [[0, 0]];

  while (dq.length > 0) {
    const [r, c] = dq.shift(); // pop from front

    // Check all 4 possible directions
    for (let i = 0; i < 4; i++) {
      const [dr, dc] = dirs[i];
      const nr = r + dr,
        nc = c + dc;

      // Check if neighbor is within bounds
      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
        // Cost is 0 if direction matches grid[r][c], else 1
        // i+1 because directions are 1-indexed in problem
        const cost = grid[r][c] === i + 1 ? 0 : 1;
        const newCost = dist[r][c] + cost;

        // If we found a cheaper path to neighbor
        if (newCost < dist[nr][nc]) {
          dist[nr][nc] = newCost;

          // Add to front if zero-cost, back if one-cost
          if (cost === 0) {
            dq.unshift([nr, nc]); // add to front
          } else {
            dq.push([nr, nc]); // add to back
          }
        }
      }
    }
  }

  return dist[m - 1][n - 1];
}
```

```java
// Time: O(m*n) - each cell processed at most 4 times
// Space: O(m*n) for distance array and deque
import java.util.ArrayDeque;
import java.util.Deque;

public int minCost(int[][] grid) {
    int m = grid.length, n = grid[0].length;

    // Directions: right, left, down, up (matching values 1,2,3,4)
    int[][] dirs = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};

    // Distance array initialized to max value
    int[][] dist = new int[m][n];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            dist[i][j] = Integer.MAX_VALUE;
        }
    }
    dist[0][0] = 0;

    // Deque for 0-1 BFS
    Deque<int[]> dq = new ArrayDeque<>();
    dq.offerFirst(new int[]{0, 0});

    while (!dq.isEmpty()) {
        int[] curr = dq.pollFirst();
        int r = curr[0], c = curr[1];

        // Check all 4 possible directions
        for (int i = 0; i < 4; i++) {
            int nr = r + dirs[i][0];
            int nc = c + dirs[i][1];

            // Check if neighbor is within bounds
            if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                // Cost is 0 if direction matches grid[r][c], else 1
                // i+1 because directions are 1-indexed in problem
                int cost = grid[r][c] == i + 1 ? 0 : 1;
                int newCost = dist[r][c] + cost;

                // If we found a cheaper path to neighbor
                if (newCost < dist[nr][nc]) {
                    dist[nr][nc] = newCost;

                    // Add to front if zero-cost, back if one-cost
                    if (cost == 0) {
                        dq.offerFirst(new int[]{nr, nc});
                    } else {
                        dq.offerLast(new int[]{nr, nc});
                    }
                }
            }
        }
    }

    return dist[m-1][n-1];
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- Each cell is added to the deque at most 4 times (once for each direction we could come from it)
- Each pop operation is O(1)
- Total operations proportional to number of edges = 4 × m × n

**Space Complexity:** O(m × n)

- Distance array: m × n integers
- Deque: in worst case could hold O(m × n) elements
- Total space: O(m × n)

The 0-1 BFS is optimal here because:

1. Dijkstra would give O(m × n log(m × n)) due to heap operations
2. Regular BFS wouldn't work because edges have different weights
3. 0-1 BFS gives us Dijkstra-like correctness with BFS-like efficiency

## Common Mistakes

1. **Using regular BFS instead of 0-1 BFS**: Candidates often try to use regular BFS, but this fails because it assumes all edges have equal weight. In our case, some edges cost 0 and some cost 1, so we need to process nodes in order of increasing total cost.

2. **Incorrect direction mapping**: The problem defines 1=right, 2=left, 3=down, 4=up. A common mistake is to use a different ordering or forget the 1-based indexing. Always double-check: `i+1` matches direction `i` in your `dirs` array.

3. **Forgetting to check bounds**: When exploring neighbors, it's easy to forget to check if `nr` and `nc` are within `[0, m-1]` and `[0, n-1]`. This leads to ArrayIndexOutOfBounds exceptions.

4. **Not using a deque properly in 0-1 BFS**: The key to 0-1 BFS is adding zero-cost edges to the front and one-cost edges to the back. Mixing this up (or using a queue/stack instead of deque) breaks the algorithm's correctness.

## When You'll See This Pattern

The 0-1 BFS pattern appears in problems where:

- You have a graph with edge weights of only 0 or 1
- You need the shortest path in terms of "cost" or "changes"
- The graph is implicit (like a grid) rather than explicit

Related problems:

1. **Cheapest Flights Within K Stops** - Similar concept of minimizing cost with constraints
2. **Network Delay Time** - Shortest path with weighted edges
3. **Shortest Path in Binary Matrix** - BFS on grid with uniform cost
4. **Path With Minimum Effort** - Finding path with minimum maximum difference

The core technique of transforming a problem into a graph with 0/1 weights is powerful. Whenever you see "minimum changes" or "minimum modifications" to achieve a path, consider if you can model moves as 0-cost (no change needed) and 1-cost (change needed).

## Key Takeaways

1. **0-1 BFS is optimal for graphs with 0/1 edge weights**: It gives Dijkstra-like correctness with O(1) operations per edge instead of O(log n). Remember: zero-cost edges go to the front of the deque, one-cost edges go to the back.

2. **Grid problems are often graph problems in disguise**: When each cell has transition rules, you're working with an implicit graph. Define nodes (cells), edges (possible moves), and weights (cost of moves).

3. **The "minimum changes" pattern**: Many problems ask for minimum modifications to achieve a property. Often, you can model this as a shortest path where "no change" moves cost 0 and "change" moves cost 1.

Related problems: [Minimum Weighted Subgraph With the Required Paths](/problem/minimum-weighted-subgraph-with-the-required-paths), [Disconnect Path in a Binary Matrix by at Most One Flip](/problem/disconnect-path-in-a-binary-matrix-by-at-most-one-flip)
