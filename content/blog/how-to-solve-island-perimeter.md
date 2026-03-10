---
title: "How to Solve Island Perimeter — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Island Perimeter. Easy difficulty, 74.3% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Matrix."
date: "2026-12-12"
category: "dsa-patterns"
tags: ["island-perimeter", "array", "depth-first-search", "breadth-first-search", "easy"]
---

# How to Solve Island Perimeter

The Island Perimeter problem asks you to calculate the perimeter of a single island in a grid where land cells are represented by 1 and water by 0. The tricky part is that each land cell contributes 4 sides to the perimeter, but adjacent land cells share edges that don't count as perimeter. The challenge is efficiently counting only the exposed edges.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [
  [0,1,0,0],
  [1,1,1,0],
  [0,1,0,0],
  [1,1,0,0]
]
```

We need to count the perimeter of the island (all connected 1's). Let's think about how to approach this:

1. **Cell (0,1)**: This land cell has:
   - Top edge: adjacent to water (counts as perimeter)
   - Right edge: adjacent to water (counts)
   - Bottom edge: adjacent to land at (1,1) (doesn't count)
   - Left edge: adjacent to water (counts)
     Total contribution: 3

2. **Cell (1,0)**:
   - Top: water (counts)
   - Right: land at (1,1) (doesn't count)
   - Bottom: water (counts)
   - Left: water (counts)
     Total: 3

3. **Cell (1,1)**:
   - Top: land at (0,1) (doesn't count)
   - Right: land at (1,2) (doesn't count)
   - Bottom: land at (2,1) (doesn't count)
   - Left: land at (1,0) (doesn't count)
     Total: 0

4. **Cell (1,2)**:
   - Top: water (counts)
   - Right: water (counts)
   - Bottom: water (counts)
   - Left: land at (1,1) (doesn't count)
     Total: 3

Continuing this process for all land cells and summing their contributions gives us the total perimeter. The key insight is that for each land cell, we add 4 to the perimeter, then subtract 1 for each adjacent land cell (since shared edges aren't part of the perimeter).

## Brute Force Approach

A naive approach might be to use DFS or BFS to traverse the island and manually count edges. While this would work, we can optimize by realizing we don't actually need to traverse the island - we can simply iterate through every cell and apply our counting logic.

What some candidates try (and why it fails):

- Trying to track visited cells with DFS when a simple iteration suffices
- Overcomplicating by trying to find the island first instead of just checking every cell
- Forgetting that we need to check adjacency in both directions to avoid double counting

The brute force would be O(n²) anyway (since we must check every cell), but we can make it more efficient by avoiding unnecessary data structures and traversal overhead.

## Optimal Solution

The optimal solution is surprisingly simple: iterate through every cell in the grid. For each land cell (grid[i][j] == 1), add 4 to the perimeter count. Then, check if the cell to the right (if it exists) is also land - if so, subtract 2 (one shared edge counted twice). Similarly, check if the cell below (if it exists) is land - if so, subtract 2.

Why subtract 2? Because when two land cells are adjacent, they share an edge. Each cell initially counts that edge as part of its perimeter (adding 4 each), but that shared edge shouldn't be counted at all. So we need to subtract it twice - once for each cell.

<div class="code-group">

```python
# Time: O(m*n) where m = rows, n = cols
# Space: O(1) - we only use a few variables
def islandPerimeter(grid):
    """
    Calculate the perimeter of the island in the grid.

    Approach: For each land cell, add 4 to perimeter.
    Then subtract 2 for each adjacent land cell (right and down only
    to avoid double counting).
    """
    rows = len(grid)
    cols = len(grid[0])
    perimeter = 0

    # Iterate through every cell in the grid
    for i in range(rows):
        for j in range(cols):
            # Only process land cells
            if grid[i][j] == 1:
                # Start by assuming all 4 sides are exposed
                perimeter += 4

                # Check right neighbor (if it exists)
                # If right neighbor is also land, they share an edge
                # Subtract 2 because we counted this edge twice
                if j + 1 < cols and grid[i][j + 1] == 1:
                    perimeter -= 2

                # Check bottom neighbor (if it exists)
                # If bottom neighbor is also land, they share an edge
                # Subtract 2 because we counted this edge twice
                if i + 1 < rows and grid[i + 1][j] == 1:
                    perimeter -= 2

    return perimeter
```

```javascript
// Time: O(m*n) where m = rows, n = cols
// Space: O(1) - we only use a few variables
function islandPerimeter(grid) {
  /**
   * Calculate the perimeter of the island in the grid.
   *
   * Approach: For each land cell, add 4 to perimeter.
   * Then subtract 2 for each adjacent land cell (right and down only
   * to avoid double counting).
   */
  const rows = grid.length;
  const cols = grid[0].length;
  let perimeter = 0;

  // Iterate through every cell in the grid
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Only process land cells
      if (grid[i][j] === 1) {
        // Start by assuming all 4 sides are exposed
        perimeter += 4;

        // Check right neighbor (if it exists)
        // If right neighbor is also land, they share an edge
        // Subtract 2 because we counted this edge twice
        if (j + 1 < cols && grid[i][j + 1] === 1) {
          perimeter -= 2;
        }

        // Check bottom neighbor (if it exists)
        // If bottom neighbor is also land, they share an edge
        // Subtract 2 because we counted this edge twice
        if (i + 1 < rows && grid[i + 1][j] === 1) {
          perimeter -= 2;
        }
      }
    }
  }

  return perimeter;
}
```

```java
// Time: O(m*n) where m = rows, n = cols
// Space: O(1) - we only use a few variables
public int islandPerimeter(int[][] grid) {
    /**
     * Calculate the perimeter of the island in the grid.
     *
     * Approach: For each land cell, add 4 to perimeter.
     * Then subtract 2 for each adjacent land cell (right and down only
     * to avoid double counting).
     */
    int rows = grid.length;
    int cols = grid[0].length;
    int perimeter = 0;

    // Iterate through every cell in the grid
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            // Only process land cells
            if (grid[i][j] == 1) {
                // Start by assuming all 4 sides are exposed
                perimeter += 4;

                // Check right neighbor (if it exists)
                // If right neighbor is also land, they share an edge
                // Subtract 2 because we counted this edge twice
                if (j + 1 < cols && grid[i][j + 1] == 1) {
                    perimeter -= 2;
                }

                // Check bottom neighbor (if it exists)
                // If bottom neighbor is also land, they share an edge
                // Subtract 2 because we counted this edge twice
                if (i + 1 < rows && grid[i + 1][j] == 1) {
                    perimeter -= 2;
                }
            }
        }
    }

    return perimeter;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n) where m is the number of rows and n is the number of columns. We must visit every cell in the grid exactly once. Each cell requires constant-time operations (checking the cell value and up to 2 neighbors).

**Space Complexity:** O(1). We only use a few integer variables (perimeter, rows, cols, loop counters). No additional data structures are needed that scale with input size.

The algorithm is optimal because we must examine every cell to know if it's land or water, giving us a lower bound of Ω(m × n). Our solution achieves this lower bound.

## Common Mistakes

1. **Checking all four neighbors and double counting**: If you check left/up neighbors in addition to right/down, you'll subtract the same edge twice. For example, if cell A checks its right neighbor B, and cell B checks its left neighbor A, you'd subtract 2 for the same edge twice. Always check only right and down (or left and up) to avoid this.

2. **Forgetting boundary checks**: When checking adjacent cells, you must verify the indices are within bounds before accessing the grid. Attempting to access grid[-1][0] or grid[i][cols] will cause index errors.

3. **Overcomplicating with DFS/BFS**: While DFS/BFS would work, they require additional space for visited sets/queues and are unnecessary here. The simple iteration approach is cleaner and more efficient.

4. **Misunderstanding the subtraction amount**: Some candidates subtract 1 instead of 2 when finding adjacent land cells. Remember: each cell starts with 4 sides counted. When two cells are adjacent, we've counted their shared edge twice (once for each cell), so we need to subtract it twice - that's why we subtract 2.

## When You'll See This Pattern

This "count and adjust for adjacency" pattern appears in many grid problems:

1. **Max Area of Island (Medium)**: Instead of counting perimeter, you count connected land cells. The adjacency checking logic is similar, but you use DFS/BFS to traverse connected components.

2. **Flood Fill (Easy)**: You need to propagate changes to adjacent cells of the same color. The concept of checking neighbors in four directions is identical.

3. **Coloring A Border (Medium)**: You need to identify which cells are on the border of a connected component - this requires checking if a cell has any neighbor that's not part of the component, similar to how we check for water neighbors here.

The core pattern is: when processing grid cells, you often need to check orthogonal neighbors (up, down, left, right) and take different actions based on whether those neighbors meet certain conditions.

## Key Takeaways

1. **Think in terms of contributions and adjustments**: Each land cell contributes 4 to the perimeter, but shared edges need adjustment. This "count then adjust" pattern is cleaner than trying to count exposed edges directly.

2. **Check neighbors strategically to avoid double counting**: When checking adjacency between cells, only check in one direction (e.g., right and down) to ensure each shared edge is processed exactly once.

3. **Simple iteration often beats traversal for counting problems**: When you need to compute a property that depends only on individual cells and their immediate neighbors, a simple nested loop is usually simpler and more efficient than DFS/BFS.

Related problems: [Max Area of Island](/problem/max-area-of-island), [Flood Fill](/problem/flood-fill), [Coloring A Border](/problem/coloring-a-border)
