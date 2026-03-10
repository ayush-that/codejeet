---
title: "How to Solve Path with Maximum Gold — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Path with Maximum Gold. Medium difficulty, 68.3% acceptance rate. Topics: Array, Backtracking, Matrix."
date: "2028-05-04"
category: "dsa-patterns"
tags: ["path-with-maximum-gold", "array", "backtracking", "matrix", "medium"]
---

# How to Solve Path with Maximum Gold

This problem asks us to find the maximum amount of gold we can collect in a grid, starting from any cell containing gold, moving only to adjacent cells (up, down, left, right) that also contain gold, and never revisiting a cell. The challenge is that we need to explore all possible paths from every starting point, which creates a combinatorial explosion that requires careful backtracking.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [
    [0, 6, 0],
    [5, 8, 7],
    [0, 9, 0]
]
```

We can start from any cell with gold (> 0). Let's see what happens if we start from the center cell (1,1) with value 8:

1. Start at (1,1): collect 8 gold, total = 8
2. Move to (1,2): collect 7, total = 15
3. Move to (0,2): can't (value 0)
4. Move to (2,2): can't (value 0)
5. Move to (1,0): collect 5, total = 20
6. Move to (0,0): can't (value 0)
7. Move to (2,0): can't (value 0)
8. Backtrack to (1,1), try other directions

Actually, from (1,1) we could go to (2,1) first: collect 9, total = 17, then to (1,2): collect 7, total = 24, then to (1,0): collect 5, total = 29. This path gives us 29 gold.

But wait, we could also start from (2,1) with value 9:

1. Start at (2,1): collect 9, total = 9
2. Move to (1,1): collect 8, total = 17
3. Move to (1,2): collect 7, total = 24
4. Move to (1,0): collect 5, total = 29

Same maximum! The key insight is we need to try starting from every gold cell and explore all possible paths from there.

## Brute Force Approach

A naive approach would be to generate all possible paths from every starting point. For each starting cell with gold, we could try all permutations of moves until we can't move anymore. However, even describing this algorithm is complex because the number of possible paths grows exponentially with grid size.

In an m × n grid, if all cells had gold, the number of possible paths starting from a given cell would be roughly O(4^(m×n)) in the worst case (though constrained by the grid boundaries). This is clearly infeasible for even moderately sized grids.

What makes this problem tractable is that we can use backtracking with pruning: we explore each path until we hit a dead end (all neighbors are 0 or visited), then backtrack to try different branches. This is essentially a depth-first search (DFS) with backtracking.

## Optimized Approach

The key insight is that this is a **backtracking/DFS problem** on a grid. We need to:

1. Try starting from every cell that contains gold
2. From each starting point, perform DFS to explore all possible paths
3. Keep track of the maximum gold collected along any path
4. Use backtracking to mark cells as visited/unvisited during exploration

The backtracking is crucial because:

- We mark a cell as visited when we enter it
- We explore all possible directions from that cell
- We unmark the cell when we backtrack so other paths can use it

This approach works because the grid is relatively small (m, n ≤ 15), so even though the worst-case time complexity is exponential, the constraints make it feasible.

## Optimal Solution

Here's the complete solution using backtracking/DFS:

<div class="code-group">

```python
# Time: O(4^k) where k is the number of cells with gold, but in practice much less due to constraints
# Space: O(m*n) for the recursion stack and visited tracking
class Solution:
    def getMaximumGold(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        max_gold = 0

        # Directions: up, down, left, right
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

        def dfs(row, col, current_gold):
            nonlocal max_gold

            # Add current cell's gold to our collection
            gold_in_cell = grid[row][col]
            current_gold += gold_in_cell

            # Update maximum if this path has more gold
            max_gold = max(max_gold, current_gold)

            # Save the original gold value and mark as visited by setting to 0
            original_gold = grid[row][col]
            grid[row][col] = 0  # Mark as visited

            # Explore all four possible directions
            for dr, dc in directions:
                new_row, new_col = row + dr, col + dc

                # Check if the new position is valid and has gold
                if (0 <= new_row < m and 0 <= new_col < n and
                    grid[new_row][new_col] > 0):
                    dfs(new_row, new_col, current_gold)

            # Backtrack: restore the original gold value
            grid[row][col] = original_gold

        # Try starting DFS from every cell that contains gold
        for i in range(m):
            for j in range(n):
                if grid[i][j] > 0:
                    dfs(i, j, 0)

        return max_gold
```

```javascript
// Time: O(4^k) where k is the number of cells with gold
// Space: O(m*n) for the recursion stack
/**
 * @param {number[][]} grid
 * @return {number}
 */
var getMaximumGold = function (grid) {
  const m = grid.length;
  const n = grid[0].length;
  let maxGold = 0;

  // Directions: up, down, left, right
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  /**
   * DFS function to explore all paths from current cell
   * @param {number} row - Current row index
   * @param {number} col - Current column index
   * @param {number} currentGold - Gold collected so far on this path
   */
  function dfs(row, col, currentGold) {
    // Add current cell's gold to our collection
    const goldInCell = grid[row][col];
    currentGold += goldInCell;

    // Update maximum if this path has more gold
    maxGold = Math.max(maxGold, currentGold);

    // Save the original gold value and mark as visited by setting to 0
    const originalGold = grid[row][col];
    grid[row][col] = 0; // Mark as visited

    // Explore all four possible directions
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if the new position is valid and has gold
      if (newRow >= 0 && newRow < m && newCol >= 0 && newCol < n && grid[newRow][newCol] > 0) {
        dfs(newRow, newCol, currentGold);
      }
    }

    // Backtrack: restore the original gold value
    grid[row][col] = originalGold;
  }

  // Try starting DFS from every cell that contains gold
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] > 0) {
        dfs(i, j, 0);
      }
    }
  }

  return maxGold;
};
```

```java
// Time: O(4^k) where k is the number of cells with gold
// Space: O(m*n) for the recursion stack
class Solution {
    private int[][] grid;
    private int m, n;
    private int maxGold;

    // Directions: up, down, left, right
    private final int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    public int getMaximumGold(int[][] grid) {
        this.grid = grid;
        this.m = grid.length;
        this.n = grid[0].length;
        this.maxGold = 0;

        // Try starting DFS from every cell that contains gold
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] > 0) {
                    dfs(i, j, 0);
                }
            }
        }

        return maxGold;
    }

    /**
     * DFS function to explore all paths from current cell
     * @param row - Current row index
     * @param col - Current column index
     * @param currentGold - Gold collected so far on this path
     */
    private void dfs(int row, int col, int currentGold) {
        // Add current cell's gold to our collection
        int goldInCell = grid[row][col];
        currentGold += goldInCell;

        // Update maximum if this path has more gold
        maxGold = Math.max(maxGold, currentGold);

        // Save the original gold value and mark as visited by setting to 0
        int originalGold = grid[row][col];
        grid[row][col] = 0;  // Mark as visited

        // Explore all four possible directions
        for (int[] dir : directions) {
            int newRow = row + dir[0];
            int newCol = col + dir[1];

            // Check if the new position is valid and has gold
            if (newRow >= 0 && newRow < m &&
                newCol >= 0 && newCol < n &&
                grid[newRow][newCol] > 0) {
                dfs(newRow, newCol, currentGold);
            }
        }

        // Backtrack: restore the original gold value
        grid[row][col] = originalGold;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** In the worst case, O(4^k) where k is the number of cells with gold. This is because from each gold cell, we can potentially move in 4 directions, and we explore all possible paths. However, in practice, this is much lower because:

1. We stop when we hit cells with 0 gold
2. We can't revisit cells
3. The grid size is limited (m, n ≤ 15)

**Space Complexity:** O(m × n) in the worst case for the recursion stack. This happens when we have a long path that visits most cells in the grid. The space is also used for the grid itself, but that's part of the input.

## Common Mistakes

1. **Forgetting to backtrack:** The most common mistake is not restoring the cell's value after DFS. If you don't set `grid[row][col] = originalGold` at the end of DFS, you'll block other paths from using that cell, leading to incorrect results.

2. **Not trying all starting points:** Some candidates only start DFS from the first gold cell they find. You must try starting from EVERY cell with gold, as the optimal path might begin from any of them.

3. **Incorrect boundary checks:** When checking new positions, you need to verify both that they're within grid bounds AND that they contain gold. Missing either check can cause index errors or infinite recursion.

4. **Using a separate visited array unnecessarily:** While using a separate boolean visited array works, it's more memory-efficient to mark visited cells directly in the grid by setting them to 0 (temporarily). Just remember to restore the original value!

## When You'll See This Pattern

This backtracking/DFS on grids pattern appears in many LeetCode problems:

1. **Word Search (LeetCode 79)** - Similar DFS on grid to find a word, with backtracking to mark cells as visited/unvisited.

2. **Number of Islands (LeetCode 200)** - Uses DFS/BFS to explore connected components, though without backtracking since cells don't need to be unvisited.

3. **Robot Room Cleaner (LeetCode 489)** - More complex backtracking on a grid where you need to explore all reachable cells.

4. **Sudoku Solver (LeetCode 37)** - Another classic backtracking problem, though not on a grid in the same way.

The pattern to recognize: when you need to explore all possible paths or configurations, and the search space is constrained enough that backtracking is feasible.

## Key Takeaways

1. **Backtracking is DFS with state restoration:** The core of backtracking is trying an option, exploring recursively, then undoing the change so you can try other options. In grid problems, this often means marking a cell as visited, exploring from it, then marking it as unvisited.

2. **Grid DFS often uses direction arrays:** The pattern of `directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]` is common for exploring up/down/left/right neighbors. Memorize this pattern.

3. **Try all valid starting points:** When a problem doesn't specify where to start, you often need to try starting from every valid position. Don't assume the optimal path starts from a corner or edge.

[Practice this problem on CodeJeet](/problem/path-with-maximum-gold)
