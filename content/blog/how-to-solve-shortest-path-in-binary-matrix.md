---
title: "How to Solve Shortest Path in Binary Matrix — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Shortest Path in Binary Matrix. Medium difficulty, 51.1% acceptance rate. Topics: Array, Breadth-First Search, Matrix."
date: "2026-12-08"
category: "dsa-patterns"
tags: ["shortest-path-in-binary-matrix", "array", "breadth-first-search", "matrix", "medium"]
---

# How to Solve Shortest Path in Binary Matrix

This problem asks us to find the shortest clear path from the top-left corner to the bottom-right corner of an n×n binary matrix, where a clear path can only go through cells with value 0, and movement is allowed in all 8 directions (up, down, left, right, and diagonals). The challenge lies in efficiently exploring all possible paths while avoiding obstacles (cells with value 1) and finding the minimum number of steps.

What makes this interesting: Unlike standard grid BFS with 4 directions, here we have 8 possible moves, which increases branching but also allows diagonal shortcuts. The "shortest path" requirement in an unweighted grid immediately suggests BFS, but careful implementation is needed to handle edge cases and avoid common pitfalls.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [[0,0,0],
        [1,1,0],
        [1,1,0]]
```

We start at (0,0) with distance 1 (counting the starting cell). From (0,0), we can move to:

- (0,1) - right
- (1,0) - down (blocked by 1)
- (1,1) - diagonal down-right (blocked by 1)

So we only reach (0,1) with distance 2. From (0,1), we can move to:

- (0,2) - right (distance 3)
- (1,1) - down (blocked by 1)
- (1,2) - diagonal down-right (distance 3)

Now we have (0,2) and (1,2) both at distance 3. From (0,2):

- (1,2) - down (already visited with same distance)
- (1,1) - diagonal down-left (blocked by 1)

From (1,2):

- (2,2) - down (distance 4, destination reached!)

The shortest path length is 4: (0,0) → (0,1) → (1,2) → (2,2)

## Brute Force Approach

A naive approach would be to try all possible paths using DFS/backtracking. We could recursively explore all 8 directions from each cell, keeping track of visited cells to avoid cycles. For each complete path reaching the destination, we'd track its length and keep the minimum.

Why this fails:

1. **Exponential time complexity**: With 8 choices at each step and up to n² cells, we could explore O(8^(n²)) paths in the worst case.
2. **Redundant computation**: We'd revisit the same cells multiple times with different path lengths.
3. **No early termination**: DFS doesn't guarantee the first found path is the shortest, so we'd need to explore all possibilities.

The brute force approach is impractical for even moderately sized grids (n > 5).

## Optimized Approach

The key insight: **In an unweighted grid, BFS finds the shortest path**. When we process nodes layer by layer (like a wavefront expanding from the start), the first time we reach the destination is guaranteed to be via the shortest path.

Why BFS works:

1. BFS explores all nodes at distance d before exploring nodes at distance d+1
2. When we first encounter the destination, we've found the minimum distance
3. We can stop immediately upon reaching the destination

Implementation details:

- Use a queue to process cells in FIFO order
- Track visited cells to avoid reprocessing (can modify grid in-place or use separate visited set)
- For each cell, explore all 8 possible neighbors
- Include the starting cell in the path length count
- Handle edge cases: start or end cell blocked, 1×1 grid

## Optimal Solution

Here's the complete BFS solution with detailed comments:

<div class="code-group">

```python
# Time: O(n²) - we visit each cell at most once
# Space: O(n²) - for the queue in worst case
from collections import deque

def shortestPathBinaryMatrix(grid):
    n = len(grid)

    # Edge case: if start or end is blocked, no path exists
    if grid[0][0] == 1 or grid[n-1][n-1] == 1:
        return -1

    # Special case: 1x1 grid with clear start
    if n == 1:
        return 1

    # Initialize BFS queue with (row, col, distance)
    # We use a deque for O(1) popleft operations
    queue = deque()
    queue.append((0, 0, 1))  # Start at (0,0) with distance 1

    # Mark start cell as visited by setting to 1
    grid[0][0] = 1

    # All 8 possible directions: (row_delta, col_delta)
    directions = [
        (-1, -1), (-1, 0), (-1, 1),  # Up-left, Up, Up-right
        (0, -1),           (0, 1),   # Left, Right
        (1, -1),  (1, 0),  (1, 1)    # Down-left, Down, Down-right
    ]

    while queue:
        row, col, dist = queue.popleft()

        # Explore all 8 neighbors
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            # Check if neighbor is within bounds
            if 0 <= new_row < n and 0 <= new_col < n:
                # Check if neighbor is clear and not visited
                if grid[new_row][new_col] == 0:
                    # If we reached the destination
                    if new_row == n-1 and new_col == n-1:
                        return dist + 1  # Include destination in path length

                    # Mark as visited and add to queue
                    grid[new_row][new_col] = 1
                    queue.append((new_row, new_col, dist + 1))

    # If we exhaust the queue without reaching destination
    return -1
```

```javascript
// Time: O(n²) - we visit each cell at most once
// Space: O(n²) - for the queue in worst case
function shortestPathBinaryMatrix(grid) {
  const n = grid.length;

  // Edge case: if start or end is blocked, no path exists
  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) {
    return -1;
  }

  // Special case: 1x1 grid with clear start
  if (n === 1) {
    return 1;
  }

  // Initialize BFS queue with [row, col, distance]
  const queue = [[0, 0, 1]]; // Start at (0,0) with distance 1

  // Mark start cell as visited by setting to 1
  grid[0][0] = 1;

  // All 8 possible directions: [row_delta, col_delta]
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1], // Up-left, Up, Up-right
    [0, -1],
    [0, 1], // Left, Right
    [1, -1],
    [1, 0],
    [1, 1], // Down-left, Down, Down-right
  ];

  while (queue.length > 0) {
    const [row, col, dist] = queue.shift(); // Dequeue

    // Explore all 8 neighbors
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if neighbor is within bounds
      if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n) {
        // Check if neighbor is clear and not visited
        if (grid[newRow][newCol] === 0) {
          // If we reached the destination
          if (newRow === n - 1 && newCol === n - 1) {
            return dist + 1; // Include destination in path length
          }

          // Mark as visited and add to queue
          grid[newRow][newCol] = 1;
          queue.push([newRow, newCol, dist + 1]);
        }
      }
    }
  }

  // If we exhaust the queue without reaching destination
  return -1;
}
```

```java
// Time: O(n²) - we visit each cell at most once
// Space: O(n²) - for the queue in worst case
import java.util.LinkedList;
import java.util.Queue;

public int shortestPathBinaryMatrix(int[][] grid) {
    int n = grid.length;

    // Edge case: if start or end is blocked, no path exists
    if (grid[0][0] == 1 || grid[n-1][n-1] == 1) {
        return -1;
    }

    // Special case: 1x1 grid with clear start
    if (n == 1) {
        return 1;
    }

    // Initialize BFS queue with row, col, and distance
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{0, 0, 1});  // Start at (0,0) with distance 1

    // Mark start cell as visited by setting to 1
    grid[0][0] = 1;

    // All 8 possible directions: {row_delta, col_delta}
    int[][] directions = {
        {-1, -1}, {-1, 0}, {-1, 1},  // Up-left, Up, Up-right
        {0, -1},           {0, 1},   // Left, Right
        {1, -1},  {1, 0},  {1, 1}    // Down-left, Down, Down-right
    };

    while (!queue.isEmpty()) {
        int[] current = queue.poll();
        int row = current[0];
        int col = current[1];
        int dist = current[2];

        // Explore all 8 neighbors
        for (int[] dir : directions) {
            int newRow = row + dir[0];
            int newCol = col + dir[1];

            // Check if neighbor is within bounds
            if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n) {
                // Check if neighbor is clear and not visited
                if (grid[newRow][newCol] == 0) {
                    // If we reached the destination
                    if (newRow == n-1 && newCol == n-1) {
                        return dist + 1;  // Include destination in path length
                    }

                    // Mark as visited and add to queue
                    grid[newRow][newCol] = 1;
                    queue.offer(new int[]{newRow, newCol, dist + 1});
                }
            }
        }
    }

    // If we exhaust the queue without reaching destination
    return -1;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- In the worst case, we visit every cell in the n×n grid exactly once
- Each cell is processed once when dequeued, and we check up to 8 neighbors
- Constant work per cell gives us O(n²) total operations

**Space Complexity: O(n²)**

- The queue can hold up to O(n²) cells in the worst case (e.g., when most cells are reachable)
- We modify the grid in-place to track visited cells, so no extra O(n²) visited array is needed
- If we couldn't modify the input, we'd need a separate visited array, still O(n²)

## Common Mistakes

1. **Forgetting to check start/end cells**: Many candidates jump straight into BFS without verifying that both (0,0) and (n-1,n-1) are 0. If either is 1, we should immediately return -1.

2. **Incorrect distance counting**: The path length includes both start and end cells. If you start counting from 0 or don't add 1 when reaching the destination, you'll be off by 1. Remember: distance = number of cells in the path.

3. **Using DFS instead of BFS**: DFS doesn't guarantee the shortest path in unweighted graphs. Candidates might implement DFS with pruning but still miss the optimal BFS approach.

4. **Missing diagonal directions**: The problem allows 8-direction movement, but some candidates only implement 4 directions (up, down, left, right), missing potentially shorter diagonal paths.

5. **Not handling the 1×1 edge case**: When n=1 and grid[0][0]=0, the answer should be 1 (just the starting cell), not 0 or -1.

## When You'll See This Pattern

This BFS-on-grid pattern appears in many shortest path problems:

1. **01 Matrix (LeetCode 542)**: Find distance of each cell to nearest 0. Uses multi-source BFS starting from all 0 cells.

2. **Rotting Oranges (LeetCode 994)**: Find minutes until all oranges rot. Uses BFS starting from all rotten oranges.

3. **Walls and Gates (LeetCode 286)**: Fill each empty room with distance to nearest gate. Another multi-source BFS problem.

4. **Number of Islands (LeetCode 200)**: Uses BFS/DFS to explore connected components, though not for shortest path.

The key pattern: When you need the shortest path in an unweighted grid (especially with obstacles), BFS is almost always the right approach.

## Key Takeaways

1. **BFS finds shortest paths in unweighted graphs**: When all moves have equal cost, BFS explores nodes in order of increasing distance from the start, guaranteeing the first time you reach the target is via the shortest path.

2. **Grid problems often have 4 or 8 directions**: Always check the problem statement carefully. Diagonal moves can create shorter paths but increase branching factor.

3. **Early validation saves computation**: Check edge cases (blocked start/end, 1×1 grid) before starting BFS to avoid unnecessary processing.

4. **In-place modification can save space**: When allowed, marking visited cells directly in the grid avoids extra O(n²) memory for a visited set/array.

Related problems: [Paths in Matrix Whose Sum Is Divisible by K](/problem/paths-in-matrix-whose-sum-is-divisible-by-k)
