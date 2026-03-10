---
title: "How to Solve Detect Cycles in 2D Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Detect Cycles in 2D Grid. Medium difficulty, 52.5% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Union-Find, Matrix."
date: "2028-03-01"
category: "dsa-patterns"
tags: ["detect-cycles-in-2d-grid", "array", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Detect Cycles in 2D Grid

This problem asks us to detect cycles of length 4 or more in a 2D grid where all cells in the cycle contain the same character. The tricky part is distinguishing between actual cycles and just adjacent cells with the same value—we need to find paths that return to a previously visited cell without immediately backtracking.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
A A A
A B A
A A A
```

We're looking for cycles of the same character. The 'A's form a border around the center 'B'. Starting from position (0,0) with value 'A', we can explore:

1. From (0,0) → (0,1) → (0,2) → (1,2) → (2,2) → (2,1) → (2,0) → (1,0) → back to (0,0)

This forms a cycle of length 8 (all 'A's), which is valid since it's length ≥ 4 and starts/ends at the same cell.

The key insight: When doing DFS, if we encounter a cell that we've visited before AND it's not our immediate parent (the cell we just came from), then we've found a cycle. But we must also ensure the cycle length is at least 4.

## Brute Force Approach

A naive approach might try to:

1. For each cell, try all possible paths of length ≥ 4
2. Check if any path returns to the starting cell
3. Track visited cells to avoid infinite loops

This would be extremely inefficient—potentially O(4^L) where L is the minimum cycle length (4). For an m×n grid, this could be O(4^(m×n)) in worst case, which is completely impractical.

Even a slightly better brute force would still be too slow: we could try BFS/DFS from each cell, but without careful tracking of parent relationships, we might incorrectly identify adjacent same-value cells as cycles.

## Optimized Approach

The optimal solution uses DFS with parent tracking:

**Key Insight**: During DFS traversal of same-value cells, if we encounter a previously visited cell that is NOT our immediate parent (the cell we just came from), we've found a cycle. Since DFS explores all reachable cells, we'll detect any cycle.

**Why this works**:

- DFS naturally explores all connected cells of the same value
- By tracking the "parent" cell (where we came from), we distinguish between:
  - Legitimate cycles (visited cell ≠ parent)
  - Just backtracking (visited cell = parent, which is allowed)
- We don't need to explicitly check cycle length ≥ 4 because in a grid, any cycle that's not immediate backtracking will automatically have length ≥ 4 due to grid constraints

**Step-by-step reasoning**:

1. Iterate through all cells in the grid
2. For each unvisited cell, start DFS to find cycles
3. In DFS:
   - Mark current cell as visited
   - Explore all 4 neighbors
   - Skip neighbors that:
     - Are out of bounds
     - Have different values than current cell
     - Are our immediate parent (where we just came from)
   - If neighbor is already visited AND not our parent → cycle found!
   - If neighbor is unvisited, recurse with current cell as parent
4. Return true if any DFS call finds a cycle

## Optimal Solution

<div class="code-group">

```python
# Time: O(m * n) - We visit each cell once
# Space: O(m * n) - For the visited matrix and recursion stack in worst case
def containsCycle(grid):
    """
    Detects if there exists a cycle of length >= 4
    consisting of cells with the same value.
    """
    m, n = len(grid), len(grid[0])
    visited = [[False] * n for _ in range(m)]

    def dfs(row, col, parent_row, parent_col):
        """
        DFS helper to detect cycles.

        Args:
            row, col: Current cell coordinates
            parent_row, parent_col: Coordinates of the cell we came from
        Returns:
            True if a cycle is found from this exploration
        """
        # Mark current cell as visited
        visited[row][col] = True

        # Directions: up, right, down, left
        directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]

        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            # Check if neighbor is within bounds
            if 0 <= new_row < m and 0 <= new_col < n:
                # Skip if neighbor has different value
                if grid[new_row][new_col] != grid[row][col]:
                    continue

                # If neighbor is our parent (where we came from), skip it
                # This prevents counting immediate backtracking as a cycle
                if new_row == parent_row and new_col == parent_col:
                    continue

                # If neighbor is already visited, we found a cycle!
                # Because it's not our parent, but has same value and is visited
                if visited[new_row][new_col]:
                    return True

                # Otherwise, explore this neighbor recursively
                # Current cell becomes the parent for the next call
                if dfs(new_row, new_col, row, col):
                    return True

        # No cycle found from this path
        return False

    # Try DFS from every unvisited cell
    for i in range(m):
        for j in range(n):
            if not visited[i][j]:
                # Start DFS with (-1, -1) as parent (no parent for starting cell)
                if dfs(i, j, -1, -1):
                    return True

    # No cycles found in entire grid
    return False
```

```javascript
// Time: O(m * n) - We visit each cell once
// Space: O(m * n) - For the visited matrix and recursion stack in worst case
function containsCycle(grid) {
  const m = grid.length;
  const n = grid[0].length;

  // Create visited matrix initialized to false
  const visited = Array(m)
    .fill()
    .map(() => Array(n).fill(false));

  // DFS helper function
  const dfs = (row, col, parentRow, parentCol) => {
    // Mark current cell as visited
    visited[row][col] = true;

    // Directions: up, right, down, left
    const directions = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if neighbor is within bounds
      if (newRow >= 0 && newRow < m && newCol >= 0 && newCol < n) {
        // Skip if neighbor has different value
        if (grid[newRow][newCol] !== grid[row][col]) {
          continue;
        }

        // If neighbor is our parent (where we came from), skip it
        // This prevents counting immediate backtracking as a cycle
        if (newRow === parentRow && newCol === parentCol) {
          continue;
        }

        // If neighbor is already visited, we found a cycle!
        // Because it's not our parent, but has same value and is visited
        if (visited[newRow][newCol]) {
          return true;
        }

        // Otherwise, explore this neighbor recursively
        // Current cell becomes the parent for the next call
        if (dfs(newRow, newCol, row, col)) {
          return true;
        }
      }
    }

    // No cycle found from this path
    return false;
  };

  // Try DFS from every unvisited cell
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (!visited[i][j]) {
        // Start DFS with (-1, -1) as parent (no parent for starting cell)
        if (dfs(i, j, -1, -1)) {
          return true;
        }
      }
    }
  }

  // No cycles found in entire grid
  return false;
}
```

```java
// Time: O(m * n) - We visit each cell once
// Space: O(m * n) - For the visited matrix and recursion stack in worst case
class Solution {
    public boolean containsCycle(char[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        // visited matrix to track explored cells
        boolean[][] visited = new boolean[m][n];

        // Try DFS from every unvisited cell
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (!visited[i][j]) {
                    // Start DFS with (-1, -1) as parent (no parent for starting cell)
                    if (dfs(grid, visited, i, j, -1, -1)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    private boolean dfs(char[][] grid, boolean[][] visited,
                        int row, int col, int parentRow, int parentCol) {
        // Mark current cell as visited
        visited[row][col] = true;

        // Directions: up, right, down, left
        int[][] directions = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};

        for (int[] dir : directions) {
            int newRow = row + dir[0];
            int newCol = col + dir[1];

            // Check if neighbor is within bounds
            if (newRow >= 0 && newRow < grid.length &&
                newCol >= 0 && newCol < grid[0].length) {

                // Skip if neighbor has different value
                if (grid[newRow][newCol] != grid[row][col]) {
                    continue;
                }

                // If neighbor is our parent (where we came from), skip it
                // This prevents counting immediate backtracking as a cycle
                if (newRow == parentRow && newCol == parentCol) {
                    continue;
                }

                // If neighbor is already visited, we found a cycle!
                // Because it's not our parent, but has same value and is visited
                if (visited[newRow][newCol]) {
                    return true;
                }

                // Otherwise, explore this neighbor recursively
                // Current cell becomes the parent for the next call
                if (dfs(grid, visited, newRow, newCol, row, col)) {
                    return true;
                }
            }
        }

        // No cycle found from this path
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(m × n)

- We visit each cell exactly once in the main loop
- Each cell is processed by DFS at most once
- For each cell, we check up to 4 neighbors (constant time)
- Total: O(4 × m × n) = O(m × n)

**Space Complexity**: O(m × n)

- We store a visited matrix of size m × n
- The recursion stack in worst case could be O(m × n) if the entire grid is one connected component (e.g., all same character in a snake-like path)
- In practice, recursion depth is limited by the longest path without cycles

## Common Mistakes

1. **Forgetting to track parent**: Without tracking the parent cell, DFS will immediately detect its previous cell as a "cycle" and return true incorrectly. Always pass parent coordinates.

2. **Not checking bounds properly**: When accessing grid[row][col], ensure both row and col are within [0, m-1] and [0, n-1] respectively. Off-by-one errors here can cause ArrayIndexOutOfBounds exceptions.

3. **Starting DFS from visited cells**: The main loop should only start DFS from unvisited cells. Starting from already visited cells wastes time and could cause incorrect results in some implementations.

4. **Confusing cycle length requirement**: Some candidates try to explicitly track path length, but this isn't needed. In a grid, any cycle that's not immediate backtracking will automatically have length ≥ 4 due to Manhattan distance constraints.

## When You'll See This Pattern

This "DFS with parent tracking to detect cycles" pattern appears in several graph problems:

1. **Number of Islands (LeetCode 200)**: Similar grid traversal, but without cycle detection—just connected component counting.

2. **Course Schedule (LeetCode 207)**: Cycle detection in directed graphs using DFS with state tracking (unvisited, visiting, visited).

3. **Redundant Connection (LeetCode 684)**: Finding cycles in undirected graphs using Union-Find, which is an alternative approach to this problem.

4. **Longest Increasing Path in a Matrix (LeetCode 329)**: Grid traversal with memoization to avoid recomputation, similar visited tracking.

The core pattern is: when traversing graphs/grids, use additional state (parent info, visit states) to distinguish between valid cycles and simple adjacency.

## Key Takeaways

1. **Cycle detection in undirected graphs/grids requires parent tracking**: When doing DFS, you must know where you came from to avoid mistaking backtracking for a cycle.

2. **Grid problems often simplify graph concepts**: The 4-direction movement constraint and grid structure often lead to simpler implementations than general graph problems.

3. **DFS is often cleaner than BFS for cycle detection**: With DFS, the recursion stack naturally maintains the path, making it easier to detect when we return to a visited node.

[Practice this problem on CodeJeet](/problem/detect-cycles-in-2d-grid)
