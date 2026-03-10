---
title: "How to Solve Unique Paths III — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Unique Paths III. Hard difficulty, 82.8% acceptance rate. Topics: Array, Backtracking, Bit Manipulation, Matrix."
date: "2028-04-24"
category: "dsa-patterns"
tags: ["unique-paths-iii", "array", "backtracking", "bit-manipulation", "hard"]
---

# How to Solve Unique Paths III

This problem asks you to count all unique paths from a starting cell to an ending cell in a grid, where you must walk over every empty cell exactly once. What makes this problem tricky is that unlike simpler pathfinding problems, you must visit **every walkable cell** — not just find any path. This constraint transforms it from a simple BFS/DFS into a Hamiltonian path problem on a grid, requiring careful backtracking to explore all possibilities.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
[[1, 0, 0, 0],
 [0, 0, 0, 0],
 [0, 0, 2, -1]]
```

We have:

- Start at (0,0) with value 1
- End at (2,2) with value 2
- One obstacle at (2,3) with value -1
- 10 walkable cells total (start + end + 8 zeros)

We need to count all paths from start to end that visit all 10 walkable cells exactly once.

**Step-by-step exploration:**

1. From start (0,0), we can go down to (1,0) or right to (0,1)
2. If we go right to (0,1), we mark it visited and continue exploring
3. We continue until we either:
   - Reach the end before visiting all cells → invalid path
   - Visit all cells but not at the end → invalid path
   - Reach the end after visiting exactly all cells → valid path
4. We backtrack whenever we hit a dead end or complete a path

The key insight: we need to track both our position AND how many cells we've visited to know when we have a valid complete path.

## Brute Force Approach

A naive approach would be to generate all possible paths from start to end and count only those that visit all walkable cells. We could use DFS to explore all possible sequences of moves.

**Why this is problematic:**

- The number of possible paths grows exponentially with grid size
- Without pruning, we'd explore many paths that can't possibly visit all cells
- We'd waste time on paths that:
  - Hit obstacles
  - Revisit cells
  - Reach the end too early
  - Get stuck in dead ends before visiting all cells

Even for a modest 4×4 grid, the brute force approach becomes computationally infeasible. We need a way to prune invalid paths early.

## Optimized Approach

The key insight is that this is a **backtracking with pruning** problem. We can use DFS with backtracking, but we add intelligent pruning:

1. **Count total walkable cells** first (all 0s + start + end)
2. **Track visited cells** to avoid cycles
3. **Prune when**:
   - We hit an obstacle (-1)
   - We revisit a cell
   - We reach the end before visiting all cells
   - We've visited all cells but aren't at the end
4. **Only count as valid** when we're at the end AND have visited exactly the right number of cells

This approach is efficient because we stop exploring dead ends immediately, avoiding exponential blowup in many cases.

**Optimization details:**

- We can use a visited matrix or modify the grid in-place (marking visited cells as -1)
- We need to handle the start cell specially (it counts as visited from the beginning)
- The total walkable count includes start, end, and all zeros

## Optimal Solution

Here's the complete backtracking solution with pruning:

<div class="code-group">

```python
# Time: O(3^(m*n)) in worst case, but much better with pruning
# Space: O(m*n) for recursion stack and visited tracking
class Solution:
    def uniquePathsIII(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        start_x = start_y = 0
        walkable = 0

        # Step 1: Find start position and count total walkable cells
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 1:
                    start_x, start_y = i, j
                if grid[i][j] != -1:  # Count all non-obstacle cells
                    walkable += 1

        # Step 2: Start DFS from the starting position
        # We pass: current position, remaining walkable cells count
        return self.dfs(grid, start_x, start_y, walkable - 1, m, n)

    def dfs(self, grid, x, y, remaining, m, n):
        # Base case 1: Out of bounds
        if x < 0 or x >= m or y < 0 or y >= n:
            return 0

        # Base case 2: Hit obstacle or already visited
        if grid[x][y] == -1:
            return 0

        # Base case 3: Reached the end
        if grid[x][y] == 2:
            # Valid path only if we've visited all cells
            return 1 if remaining == 0 else 0

        # Mark current cell as visited by turning it into obstacle
        temp = grid[x][y]
        grid[x][y] = -1

        # Explore all 4 directions
        paths = 0
        for dx, dy in [(0,1), (0,-1), (1,0), (-1,0)]:
            paths += self.dfs(grid, x + dx, y + dy, remaining - 1, m, n)

        # Backtrack: restore cell to original value
        grid[x][y] = temp

        return paths
```

```javascript
// Time: O(3^(m*n)) in worst case, but much better with pruning
// Space: O(m*n) for recursion stack
var uniquePathsIII = function (grid) {
  const m = grid.length,
    n = grid[0].length;
  let startX = 0,
    startY = 0;
  let walkable = 0;

  // Step 1: Find start and count walkable cells
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        startX = i;
        startY = j;
      }
      if (grid[i][j] !== -1) {
        walkable++;
      }
    }
  }

  // Step 2: Start DFS from start position
  return dfs(grid, startX, startY, walkable - 1, m, n);
};

function dfs(grid, x, y, remaining, m, n) {
  // Base case 1: Out of bounds
  if (x < 0 || x >= m || y < 0 || y >= n) {
    return 0;
  }

  // Base case 2: Hit obstacle or already visited
  if (grid[x][y] === -1) {
    return 0;
  }

  // Base case 3: Reached the end
  if (grid[x][y] === 2) {
    // Valid only if visited all cells
    return remaining === 0 ? 1 : 0;
  }

  // Mark current cell as visited
  const temp = grid[x][y];
  grid[x][y] = -1;

  // Explore all 4 directions
  let paths = 0;
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  for (const [dx, dy] of directions) {
    paths += dfs(grid, x + dx, y + dy, remaining - 1, m, n);
  }

  // Backtrack: restore cell
  grid[x][y] = temp;

  return paths;
}
```

```java
// Time: O(3^(m*n)) in worst case, but much better with pruning
// Space: O(m*n) for recursion stack
class Solution {
    public int uniquePathsIII(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int startX = 0, startY = 0;
        int walkable = 0;

        // Step 1: Find start and count walkable cells
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    startX = i;
                    startY = j;
                }
                if (grid[i][j] != -1) {
                    walkable++;
                }
            }
        }

        // Step 2: Start DFS from start position
        return dfs(grid, startX, startY, walkable - 1, m, n);
    }

    private int dfs(int[][] grid, int x, int y, int remaining, int m, int n) {
        // Base case 1: Out of bounds
        if (x < 0 || x >= m || y < 0 || y >= n) {
            return 0;
        }

        // Base case 2: Hit obstacle or already visited
        if (grid[x][y] == -1) {
            return 0;
        }

        // Base case 3: Reached the end
        if (grid[x][y] == 2) {
            // Valid only if visited all cells
            return remaining == 0 ? 1 : 0;
        }

        // Mark current cell as visited
        int temp = grid[x][y];
        grid[x][y] = -1;

        // Explore all 4 directions
        int paths = 0;
        int[][] directions = {{0,1}, {0,-1}, {1,0}, {-1,0}};
        for (int[] dir : directions) {
            paths += dfs(grid, x + dir[0], y + dir[1], remaining - 1, m, n);
        }

        // Backtrack: restore cell
        grid[x][y] = temp;

        return paths;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(3^(m×n)) in the worst case, but practically much faster due to pruning. Here's why:

- At each cell, we have up to 3 choices (can't go back to the cell we just came from)
- With pruning, we stop early when hitting obstacles, revisiting cells, or reaching invalid states
- The actual runtime is proportional to the number of valid Hamiltonian paths, which is usually much smaller

**Space Complexity:** O(m×n) for:

- Recursion stack depth (up to m×n in worst case)
- In-place modification of grid (or O(m×n) for a separate visited matrix if not modifying in-place)

## Common Mistakes

1. **Forgetting to count start and end cells in walkable total**: Many candidates only count zeros, but the start (1) and end (2) cells must also be visited. This leads to off-by-one errors where valid paths are rejected.

2. **Not pruning when reaching end early**: If you reach the end cell before visiting all walkable cells, you must stop exploring further. Continuing would either revisit cells or exit the grid.

3. **Using BFS instead of DFS**: BFS is great for shortest path problems, but here we need to explore ALL possible paths. DFS with backtracking is the natural choice for exhaustive search problems.

4. **Not restoring the grid during backtracking**: If you mark cells as visited but don't restore them, you'll block other paths that need to go through those cells. Always clean up after recursive calls.

## When You'll See This Pattern

This backtracking-with-pruning pattern appears in many constraint satisfaction problems:

1. **Sudoku Solver (Hard)**: Similar backtracking where you try numbers 1-9, prune invalid placements, and backtrack when stuck.

2. **N-Queens (Hard)**: Place queens one row at a time, prune invalid placements, backtrack when no valid placement exists.

3. **Word Search II (Hard)**: Search for multiple words in a grid, using backtracking to explore paths and pruning when the current path can't form any remaining words.

The common thread: you need to explore a large search space but can prune branches early based on constraints, making exhaustive search feasible.

## Key Takeaways

1. **Backtracking + pruning is powerful for constraint satisfaction**: When you need to find all solutions that satisfy multiple constraints, DFS with backtracking and early pruning is often the right approach.

2. **Count constraints first**: Before starting search, compute any global constraints (like total walkable cells here). This lets you validate solutions efficiently.

3. **Modify in-place, restore during backtracking**: For grid problems, marking visited cells directly in the grid saves space, but you MUST restore the original values when backtracking.

Related problems: [Sudoku Solver](/problem/sudoku-solver), [Unique Paths II](/problem/unique-paths-ii), [Word Search II](/problem/word-search-ii)
