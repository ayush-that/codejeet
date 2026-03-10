---
title: "How to Solve Projection Area of 3D Shapes — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Projection Area of 3D Shapes. Easy difficulty, 75.6% acceptance rate. Topics: Array, Math, Geometry, Matrix."
date: "2027-12-21"
category: "dsa-patterns"
tags: ["projection-area-of-3d-shapes", "array", "math", "geometry", "easy"]
---

# How to Solve Projection Area of 3D Shapes

This problem asks us to calculate the total projection area of 3D cubes arranged on a grid when viewed from three orthogonal directions (top, front, and side). While the problem is categorized as "Easy," it's interesting because it requires translating a 3D geometric concept into simple 2D array operations. The tricky part isn't algorithmic complexity but rather understanding what each projection represents mathematically.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this 2×2 grid:

```
grid = [[1,2],
        [3,4]]
```

We have cubes stacked on four cells:

- Cell (0,0): 1 cube
- Cell (0,1): 2 cubes
- Cell (1,0): 3 cubes
- Cell (1,1): 4 cubes

**XY-plane (top view) projection**: Looking straight down from above, we see the "footprint" of the cubes. Each cell with at least one cube contributes 1 unit of area, regardless of how tall the tower is. So we count all non-zero cells:

- (0,0): contributes 1
- (0,1): contributes 1
- (1,0): contributes 1
- (1,1): contributes 1
  Total: 4

**YZ-plane (front view) projection**: Looking from the front (along the x-axis), we see the maximum height in each column. For column 0: max(grid[0][0], grid[1][0]) = max(1,3) = 3
For column 1: max(grid[0][1], grid[1][1]) = max(2,4) = 4
Total: 3 + 4 = 7

**ZX-plane (side view) projection**: Looking from the side (along the y-axis), we see the maximum height in each row. For row 0: max(grid[0][0], grid[0][1]) = max(1,2) = 2
For row 1: max(grid[1][0], grid[1][1]) = max(3,4) = 4
Total: 2 + 4 = 6

**Final answer**: 4 + 7 + 6 = 17

## Brute Force Approach

For this problem, there's no "brute force" in the traditional sense of trying all possibilities, since we're just calculating projections. However, a naive approach might involve:

1. Creating separate data structures to track each projection
2. Using nested loops without optimizing the calculations
3. Missing the mathematical insight that each projection is simply a different aggregation of the same data

The key insight is recognizing that:

- XY projection = count of non-zero cells
- YZ projection = sum of maximum values in each column
- ZX projection = sum of maximum values in each row

Any solution that doesn't recognize these relationships would be unnecessarily complex, though not necessarily slower in terms of time complexity.

## Optimal Solution

The optimal solution directly implements the mathematical insights we discovered. We iterate through the grid once, tracking:

1. Non-zero cells for the top view
2. Maximum value in each row for the side view
3. Maximum value in each column for the front view

<div class="code-group">

```python
# Time: O(n²) where n is grid dimension | Space: O(n) for storing column maximums
def projectionArea(grid):
    """
    Calculate total projection area of 3D cubes on a grid.

    Args:
        grid: List[List[int]] - 2D array where grid[i][j] = height of cubes at (i,j)

    Returns:
        int - Total projection area
    """
    n = len(grid)
    total_area = 0

    # Arrays to track maximum heights for columns (front view)
    col_max = [0] * n

    # Process each row
    for i in range(n):
        row_max = 0  # Track maximum in current row (side view)

        for j in range(n):
            height = grid[i][j]

            # XY-plane (top view): count if there are any cubes
            if height > 0:
                total_area += 1

            # Update row maximum for ZX-plane (side view)
            row_max = max(row_max, height)

            # Update column maximum for YZ-plane (front view)
            col_max[j] = max(col_max[j], height)

        # Add row maximum to total area (side view contribution)
        total_area += row_max

    # Add all column maximums to total area (front view contribution)
    total_area += sum(col_max)

    return total_area
```

```javascript
// Time: O(n²) where n is grid dimension | Space: O(n) for storing column maximums
/**
 * Calculate total projection area of 3D cubes on a grid.
 *
 * @param {number[][]} grid - 2D array where grid[i][j] = height of cubes at (i,j)
 * @return {number} - Total projection area
 */
function projectionArea(grid) {
  const n = grid.length;
  let totalArea = 0;

  // Array to track maximum heights for columns (front view)
  const colMax = new Array(n).fill(0);

  // Process each row
  for (let i = 0; i < n; i++) {
    let rowMax = 0; // Track maximum in current row (side view)

    for (let j = 0; j < n; j++) {
      const height = grid[i][j];

      // XY-plane (top view): count if there are any cubes
      if (height > 0) {
        totalArea++;
      }

      // Update row maximum for ZX-plane (side view)
      rowMax = Math.max(rowMax, height);

      // Update column maximum for YZ-plane (front view)
      colMax[j] = Math.max(colMax[j], height);
    }

    // Add row maximum to total area (side view contribution)
    totalArea += rowMax;
  }

  // Add all column maximums to total area (front view contribution)
  for (let j = 0; j < n; j++) {
    totalArea += colMax[j];
  }

  return totalArea;
}
```

```java
// Time: O(n²) where n is grid dimension | Space: O(n) for storing column maximums
class Solution {
    /**
     * Calculate total projection area of 3D cubes on a grid.
     *
     * @param grid - 2D array where grid[i][j] = height of cubes at (i,j)
     * @return Total projection area
     */
    public int projectionArea(int[][] grid) {
        int n = grid.length;
        int totalArea = 0;

        // Array to track maximum heights for columns (front view)
        int[] colMax = new int[n];

        // Process each row
        for (int i = 0; i < n; i++) {
            int rowMax = 0;  // Track maximum in current row (side view)

            for (int j = 0; j < n; j++) {
                int height = grid[i][j];

                // XY-plane (top view): count if there are any cubes
                if (height > 0) {
                    totalArea++;
                }

                // Update row maximum for ZX-plane (side view)
                rowMax = Math.max(rowMax, height);

                // Update column maximum for YZ-plane (front view)
                colMax[j] = Math.max(colMax[j], height);
            }

            // Add row maximum to total area (side view contribution)
            totalArea += rowMax;
        }

        // Add all column maximums to total area (front view contribution)
        for (int j = 0; j < n; j++) {
            totalArea += colMax[j];
        }

        return totalArea;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n²) where n is the dimension of the grid. We iterate through each cell exactly once in the nested loops. For each cell, we perform constant-time operations (comparisons, additions, and updates).

**Space Complexity**: O(n) for storing the column maximums array. We could optimize this to O(1) by calculating column maximums in a separate pass, but that would require two passes through the grid. The O(n) approach is typically preferred as it's cleaner and n is usually small for this problem.

## Common Mistakes

1. **Forgetting to check for zero heights in top view**: Some candidates assume every cell has cubes and add 1 for every cell. Remember: the top view only shows cells that actually have cubes (height > 0).

2. **Confusing rows and columns for front/side views**: The front view (YZ-plane) looks along the x-axis, so we see columns. The side view (ZX-plane) looks along the y-axis, so we see rows. Mixing these up gives incorrect results.

3. **Not handling empty grid or single cell**: While the problem guarantees n ≥ 1, candidates sometimes forget to initialize arrays properly or handle edge cases in their loops.

4. **Double-counting areas**: A subtle mistake is to add the row/column maximums inside the inner loop, which would add them multiple times. These should be added once per row/column, not once per cell.

## When You'll See This Pattern

This problem teaches pattern recognition for **2D array aggregation problems** where you need to extract different views or summaries of the data. Similar patterns appear in:

1. **883. Projection Area of 3D Shapes** (this problem) - The exact same concept
2. **807. Max Increase to Keep City Skyline** - Uses the same "row maximum and column maximum" concept to determine how much you can increase building heights without changing the skyline
3. **566. Reshape the Matrix** - While not identical, it involves thinking about different views of 2D data
4. **1572. Matrix Diagonal Sum** - Another problem that requires aggregating matrix data in specific patterns

The core technique of calculating row-wise and column-wise aggregates is fundamental to many matrix problems.

## Key Takeaways

1. **Geometric problems often reduce to simple array operations**: Don't get intimidated by 3D geometry descriptions. Break them down into what you actually need to compute.

2. **Different views = different aggregations**: When a problem asks for multiple "views" or "projections" of data, think about what each view represents mathematically. Often it's just max, min, sum, or count along different dimensions.

3. **Optimize by combining passes**: We calculated all three projections in a single pass through the grid by tracking row maximums and column maximums simultaneously. This is more efficient than making separate passes for each projection.

[Practice this problem on CodeJeet](/problem/projection-area-of-3d-shapes)
