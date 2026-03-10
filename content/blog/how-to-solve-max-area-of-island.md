---
title: "How to Solve Max Area of Island — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Max Area of Island. Medium difficulty, 73.8% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Union-Find, Matrix."
date: "2026-09-01"
category: "dsa-patterns"
tags: ["max-area-of-island", "array", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Max Area of Island

You're given a grid where 1's represent land and 0's represent water. Islands are groups of connected 1's (horizontally or vertically), and you need to find the maximum area (number of cells) of any island in the grid. What makes this problem interesting is that it combines grid traversal with connected component analysis — you need to not just count islands, but measure their sizes and track the maximum.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [
  [1, 1, 0, 0, 0],
  [1, 1, 0, 0, 1],
  [0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1]
]
```

We'll scan the grid from top-left to bottom-right:

1. **Cell (0,0) = 1**: Found new island! Explore it:
   - From (0,0): Check neighbors → (0,1) is 1, (1,0) is 1
   - From (0,1): Check neighbors → (0,0) visited, (1,1) is 1
   - From (1,0): Check neighbors → (0,0) visited, (1,1) already found
   - From (1,1): Check neighbors → all visited
   - Total area = 4 cells

2. **Cell (0,2) = 0**: Skip (water)

3. **Cell (0,3) = 0**: Skip

4. **Cell (0,4) = 0**: Skip

5. **Cell (1,2) = 0**: Skip

6. **Cell (1,3) = 0**: Skip

7. **Cell (1,4) = 1**: Found new island! Explore it:
   - From (1,4): Check neighbors → (2,4) is 1
   - From (2,4): Check neighbors → (1,4) visited, (2,3) is 1, (3,4) is 1
   - From (2,3): Check neighbors → (2,4) visited, (3,3) is 1
   - From (3,4): Check neighbors → (2,4) visited, (3,3) already found
   - From (3,3): Check neighbors → (2,3) visited, (3,4) visited
   - Total area = 5 cells

8. **Continue scanning**: Remaining cells are either water or already visited

Maximum area = max(4, 5) = **5**

## Brute Force Approach

A naive approach might try to check every possible island starting point and measure its area without tracking visited cells. This would lead to exponential time complexity because:

1. You'd repeatedly explore the same cells
2. You'd need to somehow avoid double-counting
3. Without marking visited cells, you'd get stuck in infinite loops or incorrect counts

The brute force approach essentially doesn't work for this problem — you need a systematic way to track which cells you've already processed. Any solution that doesn't track visited cells will either be incorrect or extremely inefficient.

## Optimized Approach

The key insight is that this is a **connected components** problem on a grid. We need to:

1. Traverse the entire grid
2. When we find land (1), explore the entire island using DFS or BFS
3. Mark visited cells to avoid processing them multiple times
4. Track the size of each island and keep the maximum

**Why DFS/BFS works:**

- Both algorithms systematically explore connected regions
- They naturally avoid revisiting cells (through visited marking)
- They can count cells as they explore

**DFS vs BFS choice:**

- DFS uses recursion (call stack) which is simpler to implement
- BFS uses a queue which avoids potential stack overflow for very large islands
- Both have the same time complexity O(m×n)

**Optimization details:**

1. We can modify the grid in-place to mark visited cells (changing 1 to 0 or another value)
2. Alternatively, we can use a separate visited matrix (uses more memory)
3. The four-directional movement is handled by checking (r+1, c), (r-1, c), (r, c+1), (r, c-1)

## Optimal Solution

Here's the complete solution using DFS with in-place modification:

<div class="code-group">

```python
# Time: O(m × n) where m = rows, n = columns
# Space: O(m × n) in worst case for recursion stack (when entire grid is one island)
class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        # Edge case: empty grid
        if not grid or not grid[0]:
            return 0

        rows, cols = len(grid), len(grid[0])
        max_area = 0

        def dfs(r, c):
            # Base cases: out of bounds or water cell
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == 0:
                return 0

            # Mark current cell as visited by setting it to 0
            grid[r][c] = 0

            # Initialize area with current cell
            area = 1

            # Explore all four directions and accumulate their areas
            area += dfs(r + 1, c)  # Down
            area += dfs(r - 1, c)  # Up
            area += dfs(r, c + 1)  # Right
            area += dfs(r, c - 1)  # Left

            return area

        # Iterate through every cell in the grid
        for r in range(rows):
            for c in range(cols):
                # If we find land, explore the entire island
                if grid[r][c] == 1:
                    current_area = dfs(r, c)
                    # Update max_area if current island is larger
                    max_area = max(max_area, current_area)

        return max_area
```

```javascript
// Time: O(m × n) where m = rows, n = columns
// Space: O(m × n) in worst case for recursion stack
/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxAreaOfIsland = function (grid) {
  // Edge case: empty grid
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    return 0;
  }

  const rows = grid.length;
  const cols = grid[0].length;
  let maxArea = 0;

  // DFS helper function
  const dfs = (r, c) => {
    // Base cases: out of bounds or water cell
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === 0) {
      return 0;
    }

    // Mark current cell as visited by setting it to 0
    grid[r][c] = 0;

    // Start area count with current cell
    let area = 1;

    // Explore all four directions
    area += dfs(r + 1, c); // Down
    area += dfs(r - 1, c); // Up
    area += dfs(r, c + 1); // Right
    area += dfs(r, c - 1); // Left

    return area;
  };

  // Scan the entire grid
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // When we find land, explore the island
      if (grid[r][c] === 1) {
        const currentArea = dfs(r, c);
        // Update maximum area if needed
        maxArea = Math.max(maxArea, currentArea);
      }
    }
  }

  return maxArea;
};
```

```java
// Time: O(m × n) where m = rows, n = columns
// Space: O(m × n) in worst case for recursion stack
class Solution {
    public int maxAreaOfIsland(int[][] grid) {
        // Edge case: empty grid
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }

        int rows = grid.length;
        int cols = grid[0].length;
        int maxArea = 0;

        // Scan through every cell
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                // When we find land, explore it
                if (grid[r][c] == 1) {
                    int currentArea = dfs(grid, r, c, rows, cols);
                    maxArea = Math.max(maxArea, currentArea);
                }
            }
        }

        return maxArea;
    }

    private int dfs(int[][] grid, int r, int c, int rows, int cols) {
        // Base cases: out of bounds or water
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == 0) {
            return 0;
        }

        // Mark as visited
        grid[r][c] = 0;

        // Count current cell
        int area = 1;

        // Explore four directions
        area += dfs(grid, r + 1, c, rows, cols);  // Down
        area += dfs(grid, r - 1, c, rows, cols);  // Up
        area += dfs(grid, r, c + 1, rows, cols);  // Right
        area += dfs(grid, r, c - 1, rows, cols);  // Left

        return area;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We visit each cell at most once
- When we find land, we explore the entire island, but each cell is only processed once total
- The nested loops give us O(m × n), and DFS adds constant work per cell

**Space Complexity: O(m × n) in worst case**

- Recursion stack depth: In the worst case (entire grid is one island), we could have m×n recursive calls on the stack
- If we used a separate visited matrix instead of modifying in-place, that would also be O(m × n)
- BFS solution would have similar space complexity for the queue

**Why not O(1) space?**
While we modify the grid in-place, the recursion stack still uses memory proportional to the island size in the worst case.

## Common Mistakes

1. **Forgetting to mark cells as visited**: This causes infinite recursion and stack overflow. Always mark a cell as visited BEFORE recursing on its neighbors.

2. **Checking diagonal neighbors**: The problem specifies 4-directional connectivity (up, down, left, right), not 8-directional. Checking diagonals will incorrectly merge separate islands.

3. **Not handling empty grid edge case**: Always check if grid is null or empty at the beginning. An empty grid should return 0.

4. **Incorrect boundary checks in DFS**: When checking (r+1, c), you must verify r+1 < rows, not r+1 <= rows. Off-by-one errors here cause ArrayIndexOutOfBounds exceptions.

5. **Modifying the grid without permission**: In an interview, always ask if you can modify the input. If not, use a separate visited matrix.

## When You'll See This Pattern

This connected components pattern appears in many grid-based problems:

1. **Number of Islands (LeetCode 200)**: Almost identical, but instead of measuring area, you just count islands. The DFS/BFS approach is exactly the same.

2. **Island Perimeter (LeetCode 463)**: Here you need to calculate perimeter instead of area. You still use DFS/BFS to explore islands, but count edges adjacent to water.

3. **Battleships in a Board (LeetCode 419)**: Similar concept but with different connectivity rules (battleships are 1D).

4. **Flood Fill (LeetCode 733)**: The exact same DFS/BFS pattern but with color changing instead of area calculation.

The core pattern: When you need to explore connected regions in a grid, think DFS/BFS with visited tracking.

## Key Takeaways

1. **Grid DFS/BFS is a fundamental pattern**: For any problem involving connected components on a grid, DFS or BFS with visited marking is usually the right approach.

2. **In-place modification saves space**: When allowed, modifying the input grid to mark visited cells (e.g., changing 1 to 0) avoids extra O(m×n) memory for a visited matrix.

3. **Always define your directions explicitly**: For 4-directional movement, create a directions array like `[(1,0), (-1,0), (0,1), (0,-1)]` to avoid repetition and mistakes.

4. **Think about worst-case space complexity**: Even with in-place modification, DFS recursion depth can be O(m×n) in worst case. For extremely large grids, consider iterative BFS with a queue.

Related problems: [Number of Islands](/problem/number-of-islands), [Battleships in a Board](/problem/battleships-in-a-board), [Island Perimeter](/problem/island-perimeter)
