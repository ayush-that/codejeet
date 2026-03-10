---
title: "How to Solve Coloring A Border — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Coloring A Border. Medium difficulty, 51.1% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Matrix."
date: "2028-08-01"
category: "dsa-patterns"
tags: ["coloring-a-border", "array", "depth-first-search", "breadth-first-search", "medium"]
---

## Brief Problem Restatement

You're given a grid where each cell has a color, a starting cell (row, col), and a target color. You need to identify all cells in the connected component of the starting cell that are on the border of that component, and color only those border cells with the target color. The tricky part is distinguishing between interior cells (which should keep their original color) and border cells (which should be recolored) within the same connected component.

## Visual Walkthrough

Let's walk through a concrete example:

```
Grid:
1 1 1
1 1 1
1 1 1

Start: (0, 0) with target color = 2
Original color at (0, 0) = 1
```

**Step 1:** Identify the connected component of color 1 starting from (0, 0). All 9 cells form one connected component since they all have color 1 and are adjacent.

**Step 2:** Determine which cells are borders:

- A cell is a border if it's on the grid boundary OR has at least one neighbor with a different color
- Since all cells have color 1, only cells on the grid boundary qualify:
  - (0,0), (0,1), (0,2) - top row
  - (1,0), (1,2) - left and right edges of middle row
  - (2,0), (2,1), (2,2) - bottom row

**Step 3:** Color only these border cells with color 2:

```
Result:
2 2 2
2 1 2
2 2 2
```

Notice that (1,1) remains color 1 because it's not a border cell - all its neighbors have the same original color.

## Brute Force Approach

A naive approach might be:

1. Find all cells in the connected component using BFS/DFS
2. For each cell in the component, check if it's a border cell
3. Color the border cells

However, the challenge is that we can't simply mark cells as we find them because we need to know which cells are borders, which requires checking neighbors. A truly brute force approach might involve:

- Creating a copy of the grid
- For each cell, checking all 4 neighbors to see if it's a border
- But this would process the entire grid unnecessarily when we only care about one connected component

The key insight is that we need to identify border cells _during_ the traversal, not after.

## Optimized Approach

The optimal approach uses DFS or BFS with a clever observation:

1. **Traverse the connected component** starting from (row, col)
2. **Identify border cells during traversal**: A cell is a border if:
   - It's on the edge of the grid, OR
   - It has at least one neighbor (up, down, left, right) that is NOT part of the same connected component
3. **Mark border cells for recoloring**: We can't recolor immediately during traversal because that would change the color and confuse neighbor checks
4. **Recolor after identification**: Once we've identified all border cells, apply the target color to them

We need to track:

- Which cells we've visited (to avoid infinite loops)
- Which cells are border cells
- The original color for comparison

## Optimal Solution

<div class="code-group">

```python
# Time: O(m * n) - we might visit every cell in the worst case
# Space: O(m * n) - for the visited set and recursion stack in worst case
def colorBorder(grid, row, col, color):
    """
    Colors the border of the connected component containing grid[row][col].

    Args:
        grid: List[List[int]] - the input grid
        row: int - starting row
        col: int - starting column
        color: int - target color for the border

    Returns:
        List[List[int]] - modified grid with border colored
    """
    m, n = len(grid), len(grid[0])
    original_color = grid[row][col]
    visited = set()
    border_cells = []

    # Directions: up, down, left, right
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    def dfs(r, c):
        """
        Depth-first search to identify border cells in the connected component.
        """
        # Mark current cell as visited
        visited.add((r, c))

        # Check if current cell is a border cell
        is_border = False

        # Check all 4 neighbors
        for dr, dc in directions:
            nr, nc = r + dr, c + dc

            # Condition 1: If neighbor is out of bounds, current cell is a border
            if nr < 0 or nr >= m or nc < 0 or nc >= n:
                is_border = True
            # Condition 2: If neighbor has different color, current cell is a border
            elif (nr, nc) not in visited and grid[nr][nc] != original_color:
                is_border = True
            # Condition 3: If neighbor hasn't been visited but has same color, explore it
            elif (nr, nc) not in visited and grid[nr][nc] == original_color:
                dfs(nr, nc)

        # If cell is a border, add it to the list for recoloring
        if is_border:
            border_cells.append((r, c))

    # Start DFS from the given cell
    dfs(row, col)

    # Color all identified border cells
    for r, c in border_cells:
        grid[r][c] = color

    return grid
```

```javascript
// Time: O(m * n) - we might visit every cell in the worst case
// Space: O(m * n) - for the visited set and recursion stack in worst case
function colorBorder(grid, row, col, color) {
  /**
   * Colors the border of the connected component containing grid[row][col].
   *
   * @param {number[][]} grid - the input grid
   * @param {number} row - starting row
   * @param {number} col - starting column
   * @param {number} color - target color for the border
   * @return {number[][]} - modified grid with border colored
   */
  const m = grid.length;
  const n = grid[0].length;
  const originalColor = grid[row][col];
  const visited = new Set();
  const borderCells = [];

  // Directions: up, down, left, right
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  function dfs(r, c) {
    /**
     * Depth-first search to identify border cells in the connected component.
     */
    // Mark current cell as visited
    visited.add(`${r},${c}`);

    // Check if current cell is a border cell
    let isBorder = false;

    // Check all 4 neighbors
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      // Condition 1: If neighbor is out of bounds, current cell is a border
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) {
        isBorder = true;
      }
      // Condition 2: If neighbor has different color, current cell is a border
      else if (!visited.has(`${nr},${nc}`) && grid[nr][nc] !== originalColor) {
        isBorder = true;
      }
      // Condition 3: If neighbor hasn't been visited but has same color, explore it
      else if (!visited.has(`${nr},${nc}`) && grid[nr][nc] === originalColor) {
        dfs(nr, nc);
      }
    }

    // If cell is a border, add it to the list for recoloring
    if (isBorder) {
      borderCells.push([r, c]);
    }
  }

  // Start DFS from the given cell
  dfs(row, col);

  // Color all identified border cells
  for (const [r, c] of borderCells) {
    grid[r][c] = color;
  }

  return grid;
}
```

```java
// Time: O(m * n) - we might visit every cell in the worst case
// Space: O(m * n) - for the visited set and recursion stack in worst case
class Solution {
    public int[][] colorBorder(int[][] grid, int row, int col, int color) {
        /**
         * Colors the border of the connected component containing grid[row][col].
         *
         * @param grid - the input grid
         * @param row - starting row
         * @param col - starting column
         * @param color - target color for the border
         * @return - modified grid with border colored
         */
        int m = grid.length;
        int n = grid[0].length;
        int originalColor = grid[row][col];
        boolean[][] visited = new boolean[m][n];
        List<int[]> borderCells = new ArrayList<>();

        // Directions: up, down, left, right
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        // DFS to identify border cells
        dfs(grid, row, col, originalColor, visited, borderCells, directions, m, n);

        // Color all identified border cells
        for (int[] cell : borderCells) {
            grid[cell[0]][cell[1]] = color;
        }

        return grid;
    }

    private void dfs(int[][] grid, int r, int c, int originalColor,
                     boolean[][] visited, List<int[]> borderCells,
                     int[][] directions, int m, int n) {
        /**
         * Depth-first search to identify border cells in the connected component.
         */
        // Mark current cell as visited
        visited[r][c] = true;

        // Check if current cell is a border cell
        boolean isBorder = false;

        // Check all 4 neighbors
        for (int[] dir : directions) {
            int nr = r + dir[0];
            int nc = c + dir[1];

            // Condition 1: If neighbor is out of bounds, current cell is a border
            if (nr < 0 || nr >= m || nc < 0 || nc >= n) {
                isBorder = true;
            }
            // Condition 2: If neighbor has different color, current cell is a border
            else if (!visited[nr][nc] && grid[nr][nc] != originalColor) {
                isBorder = true;
            }
            // Condition 3: If neighbor hasn't been visited but has same color, explore it
            else if (!visited[nr][nc] && grid[nr][nc] == originalColor) {
                dfs(grid, nr, nc, originalColor, visited, borderCells, directions, m, n);
            }
        }

        // If cell is a border, add it to the list for recoloring
        if (isBorder) {
            borderCells.add(new int[]{r, c});
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n) in the worst case, where m is the number of rows and n is the number of columns. We might need to visit every cell in the grid if the entire grid forms one connected component starting from the given cell.

**Space Complexity:** O(m × n) in the worst case. This comes from:

1. The visited set/array which tracks all visited cells
2. The recursion stack in DFS (which could be O(m × n) in the worst case for a grid that's one long connected component)
3. The borderCells list which could contain up to O(m × n) cells

## Common Mistakes

1. **Recoloring during traversal**: If you change the color of a cell while still traversing, it can confuse the neighbor checks for other cells. Always identify all border cells first, then recolor them.

2. **Forgetting to check visited neighbors**: When checking if a cell is a border, you need to check if a neighbor has a different color. But if that neighbor has already been visited and recolored, it might appear to have a different color even though it was originally part of the same component. That's why we store the original color and compare against it.

3. **Incorrect border detection logic**: A cell is a border if EITHER it's on the grid boundary OR it has a neighbor with a different original color. Some candidates only check one of these conditions.

4. **Not handling the case where target color equals original color**: If the target color is the same as the original color, we should still identify and "recolor" the border (even though it won't change visually). The algorithm handles this correctly.

## When You'll See This Pattern

This problem combines two common patterns:

1. **Grid traversal with DFS/BFS** - used to find connected components
2. **Border/edge detection** - determining which elements are on the boundary of a region

Similar problems include:

- **Island Perimeter (LeetCode 463)** - Counts the perimeter of an island, which is essentially counting border edges rather than border cells.
- **Flood Fill (LeetCode 733)** - Colors an entire connected component, not just its border.
- **Number of Islands (LeetCode 200)** - Counts connected components in a grid.

The key difference here is that we're not coloring the entire component, nor just counting its perimeter, but specifically identifying and coloring its border cells.

## Key Takeaways

1. **Separate identification from modification**: When you need to identify elements based on relationships with other elements (like neighbors), it's often best to identify all elements first, then modify them. This prevents the modifications from interfering with the identification logic.

2. **Border detection requires neighbor checking**: To determine if a cell is on the border of a region, you need to check its relationship with all adjacent cells. This is a common pattern in grid problems.

3. **DFS/BFS for connected components**: Whenever you need to process all cells connected to a starting point with the same property (like color), DFS or BFS is the right tool. The choice between them depends on whether you want depth-first or breadth-first exploration, but both work for this problem.

Related problems: [Island Perimeter](/problem/island-perimeter)
