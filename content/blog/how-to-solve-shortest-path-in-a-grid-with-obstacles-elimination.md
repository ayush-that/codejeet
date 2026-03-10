---
title: "How to Solve Shortest Path in a Grid with Obstacles Elimination — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Shortest Path in a Grid with Obstacles Elimination. Hard difficulty, 46.1% acceptance rate. Topics: Array, Breadth-First Search, Matrix."
date: "2028-03-21"
category: "dsa-patterns"
tags:
  [
    "shortest-path-in-a-grid-with-obstacles-elimination",
    "array",
    "breadth-first-search",
    "matrix",
    "hard",
  ]
---

# How to Solve Shortest Path in a Grid with Obstacles Elimination

This problem asks us to find the shortest path from the top-left to bottom-right corner of a grid, where we can eliminate up to `k` obstacles along the way. What makes this problem tricky is that we're not just finding a path—we're tracking how many obstacles we've removed while doing so. A standard BFS won't work because we might need to revisit cells if we reach them with a different number of obstacles eliminated, which could lead to a better overall path.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
[0, 1, 0]
[0, 1, 0]
[0, 0, 0]
k = 1
```

We start at (0,0) with 0 obstacles eliminated so far. Our goal is (2,2).

**Step 1:** From (0,0), we can go right to (0,1) or down to (1,0).

- Going right to (0,1) has an obstacle (1), so we'd use 1 elimination.
- Going down to (1,0) is empty (0), no elimination needed.

**Step 2:** Let's track both possibilities:

- Path A: (0,0) → (1,0) → (2,0) → (2,1) → (2,2) = 4 steps, 0 eliminations
- Path B: (0,0) → (0,1) → (0,2) → (1,2) → (2,2) = 4 steps, 1 elimination

Both reach the destination in 4 steps, but Path A is better since it uses fewer eliminations. However, if `k = 0`, only Path A would work. This shows why we need to track both position AND how many eliminations we've used.

## Brute Force Approach

A naive approach would be to try all possible paths from start to end, tracking obstacle eliminations. We could use DFS to explore all paths, but this would be extremely inefficient—potentially exploring every possible path in the grid, which is exponential in the number of cells.

Even with memoization, a simple DFS that only tracks visited cells (without tracking eliminations used) would fail because:

1. We might mark a cell as visited when we reach it with 2 eliminations used
2. Later, we might find a better path that reaches the same cell with only 1 elimination used
3. But we can't revisit it because it's marked as visited

The brute force would have time complexity of roughly O(4^(m\*n)) in the worst case, which is completely impractical for typical grid sizes.

## Optimized Approach

The key insight is that we need to track **three dimensions of state**:

1. Row position (r)
2. Column position (c)
3. Number of obstacles eliminated so far (eliminations)

This transforms the problem into a **3D BFS search** where each state is (r, c, eliminations). We can think of it as exploring a 3D space where the third dimension represents how many "obstacle credits" we have left.

Why BFS works:

- BFS explores nodes level by level, guaranteeing the first time we reach the destination is the shortest path
- By tracking eliminations as part of our state, we can revisit the same (r,c) position if we reach it with a different (and potentially better) number of eliminations
- We only continue exploring if we haven't exceeded k eliminations

The visited set needs to track all three dimensions: `visited[r][c][eliminations]`. If we try to visit a cell with the same or more eliminations than a previous visit, we skip it (since that path can't be better).

## Optimal Solution

We'll use BFS with a queue storing (row, col, eliminations_used). At each step, we check all four directions. If the neighbor is an obstacle, we increment eliminations_used (if we have eliminations left). We only add a state to the queue if we haven't visited that (row, col, eliminations) combination before.

<div class="code-group">

```python
# Time: O(m * n * k) | Space: O(m * n * k)
def shortestPath(grid, k):
    """
    Find shortest path from (0,0) to (m-1,n-1) with at most k obstacle eliminations.

    Args:
        grid: 2D list where 0 = empty, 1 = obstacle
        k: maximum obstacles that can be eliminated

    Returns:
        Minimum steps to reach destination, or -1 if impossible
    """
    m, n = len(grid), len(grid[0])

    # If we can eliminate enough obstacles to clear a straight path,
    # we can quickly check if the problem is trivially solvable
    if k >= m + n - 2:
        return m + n - 2

    # visited[r][c][elim] tracks if we've been to (r,c) with 'elim' obstacles eliminated
    visited = [[[False] * (k + 1) for _ in range(n)] for _ in range(m)]

    # Queue for BFS: (row, col, eliminations_used, steps)
    from collections import deque
    queue = deque()

    # Start at (0,0) with 0 eliminations used and 0 steps taken
    queue.append((0, 0, 0, 0))
    visited[0][0][0] = True

    # Directions: up, right, down, left
    directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]

    while queue:
        row, col, elim, steps = queue.popleft()

        # Check if we've reached the destination
        if row == m - 1 and col == n - 1:
            return steps

        # Explore all four neighbors
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            # Check if new position is within bounds
            if 0 <= new_row < m and 0 <= new_col < n:
                new_elim = elim

                # If the neighbor is an obstacle, we need to eliminate it
                if grid[new_row][new_col] == 1:
                    new_elim += 1

                # Only proceed if we haven't exceeded k eliminations
                # AND we haven't visited this state before
                if new_elim <= k and not visited[new_row][new_col][new_elim]:
                    visited[new_row][new_col][new_elim] = True
                    queue.append((new_row, new_col, new_elim, steps + 1))

    # If we exhaust the queue without reaching destination, return -1
    return -1
```

```javascript
// Time: O(m * n * k) | Space: O(m * n * k)
function shortestPath(grid, k) {
  /**
   * Find shortest path from (0,0) to (m-1,n-1) with at most k obstacle eliminations.
   *
   * @param {number[][]} grid - 2D array where 0 = empty, 1 = obstacle
   * @param {number} k - maximum obstacles that can be eliminated
   * @return {number} Minimum steps to reach destination, or -1 if impossible
   */
  const m = grid.length;
  const n = grid[0].length;

  // Quick check: if we can eliminate enough for a straight path
  if (k >= m + n - 2) {
    return m + n - 2;
  }

  // Create 3D visited array: visited[row][col][elim]
  const visited = Array(m);
  for (let i = 0; i < m; i++) {
    visited[i] = Array(n);
    for (let j = 0; j < n; j++) {
      visited[i][j] = Array(k + 1).fill(false);
    }
  }

  // Queue for BFS: [row, col, eliminations_used, steps]
  const queue = [];
  queue.push([0, 0, 0, 0]);
  visited[0][0][0] = true;

  // Directions: up, right, down, left
  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  while (queue.length > 0) {
    const [row, col, elim, steps] = queue.shift();

    // Check if we've reached the destination
    if (row === m - 1 && col === n - 1) {
      return steps;
    }

    // Explore all four neighbors
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if new position is within bounds
      if (newRow >= 0 && newRow < m && newCol >= 0 && newCol < n) {
        let newElim = elim;

        // If the neighbor is an obstacle, we need to eliminate it
        if (grid[newRow][newCol] === 1) {
          newElim++;
        }

        // Only proceed if we haven't exceeded k eliminations
        // AND we haven't visited this state before
        if (newElim <= k && !visited[newRow][newCol][newElim]) {
          visited[newRow][newCol][newElim] = true;
          queue.push([newRow, newCol, newElim, steps + 1]);
        }
      }
    }
  }

  // If we exhaust the queue without reaching destination, return -1
  return -1;
}
```

```java
// Time: O(m * n * k) | Space: O(m * n * k)
import java.util.LinkedList;
import java.util.Queue;

class Solution {
    public int shortestPath(int[][] grid, int k) {
        /**
         * Find shortest path from (0,0) to (m-1,n-1) with at most k obstacle eliminations.
         *
         * @param grid 2D array where 0 = empty, 1 = obstacle
         * @param k maximum obstacles that can be eliminated
         * @return Minimum steps to reach destination, or -1 if impossible
         */
        int m = grid.length;
        int n = grid[0].length;

        // Quick check: if we can eliminate enough for a straight path
        if (k >= m + n - 2) {
            return m + n - 2;
        }

        // visited[row][col][elim] tracks if we've been to (row,col) with 'elim' obstacles eliminated
        boolean[][][] visited = new boolean[m][n][k + 1];

        // Queue for BFS storing {row, col, eliminations_used, steps}
        Queue<int[]> queue = new LinkedList<>();

        // Start at (0,0) with 0 eliminations used and 0 steps taken
        queue.offer(new int[]{0, 0, 0, 0});
        visited[0][0][0] = true;

        // Directions: up, right, down, left
        int[][] directions = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0];
            int col = current[1];
            int elim = current[2];
            int steps = current[3];

            // Check if we've reached the destination
            if (row == m - 1 && col == n - 1) {
                return steps;
            }

            // Explore all four neighbors
            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                // Check if new position is within bounds
                if (newRow >= 0 && newRow < m && newCol >= 0 && newCol < n) {
                    int newElim = elim;

                    // If the neighbor is an obstacle, we need to eliminate it
                    if (grid[newRow][newCol] == 1) {
                        newElim++;
                    }

                    // Only proceed if we haven't exceeded k eliminations
                    // AND we haven't visited this state before
                    if (newElim <= k && !visited[newRow][newCol][newElim]) {
                        visited[newRow][newCol][newElim] = true;
                        queue.offer(new int[]{newRow, newCol, newElim, steps + 1});
                    }
                }
            }
        }

        // If we exhaust the queue without reaching destination, return -1
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n × k)

- We might visit each cell (m × n) with each possible elimination count (0 to k)
- In the worst case, we explore m × n × k states
- Each state processes 4 neighbors, but that's constant factor

**Space Complexity:** O(m × n × k)

- The visited array stores m × n × (k+1) boolean values
- The queue could store up to O(m × n × k) elements in the worst case
- This dominates the space usage

The k factor is crucial: if k is large (close to m×n), the complexity becomes O(m²n²), which is why the early return for k ≥ m+n-2 is important—it handles cases where we can just take a straight path.

## Common Mistakes

1. **Using 2D visited array instead of 3D:** This is the most common mistake. Candidates mark cells as visited without tracking how many eliminations were used to reach them. You might reach a cell with 2 eliminations, mark it visited, then later find a better path with only 1 elimination but can't take it because the cell is already marked.

2. **Not checking bounds properly:** When exploring neighbors, forgetting to check if newRow and newCol are within [0, m-1] and [0, n-1] ranges can cause index out of bounds errors.

3. **Incorrect elimination counting:** Adding to elimination count even when moving to empty cells, or not resetting the count correctly when branching. Remember: we only increment eliminations when the target cell has an obstacle (grid[newRow][newCol] == 1).

4. **Forgetting the early optimization:** Without the check `if k >= m + n - 2: return m + n - 2`, the solution can be much slower for large k values. This optimization recognizes that if you can eliminate enough obstacles for a straight path, that's always optimal.

## When You'll See This Pattern

This "BFS with state" pattern appears in problems where you need to find shortest paths while tracking additional constraints:

1. **Shortest Path to Get Food (Medium):** Similar BFS in a grid, but with different constraints (finding food cells).
2. **Minimum Obstacle Removal to Reach Corner (Hard):** Very similar concept—finding a path while minimizing obstacles removed.
3. **Find a Safe Walk Through a Grid (Medium):** Another grid pathfinding problem with constraints on which cells can be traversed.
4. **Cheapest Flights Within K Stops (Medium):** BFS/Dijkstra variant where you track number of stops as part of state.

The key insight is recognizing when you need to augment the standard BFS state with additional dimensions to track constraints like eliminations, stops, or other resources.

## Key Takeaways

1. **When standard BFS fails because you can revisit cells**, consider adding dimensions to your state. If visiting a cell with different "resources" (eliminations, time, money) could lead to a better overall path, you need to track those resources as part of your visited state.

2. **The "eliminations" dimension creates a 3D search space** where each (row, col, eliminations) combination is a unique state. This is why we need visited[row][col][eliminations] instead of just visited[row][col].

3. **Early optimizations matter:** The check for `k >= m + n - 2` isn't just an optimization—it's necessary to handle edge cases efficiently. Always look for mathematical insights that can simplify special cases.

Related problems: [Shortest Path to Get Food](/problem/shortest-path-to-get-food), [Minimum Obstacle Removal to Reach Corner](/problem/minimum-obstacle-removal-to-reach-corner), [Find a Safe Walk Through a Grid](/problem/find-a-safe-walk-through-a-grid)
