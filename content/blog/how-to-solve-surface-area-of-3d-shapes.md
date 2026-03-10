---
title: "How to Solve Surface Area of 3D Shapes — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Surface Area of 3D Shapes. Easy difficulty, 70.4% acceptance rate. Topics: Array, Math, Geometry, Matrix."
date: "2028-05-28"
category: "dsa-patterns"
tags: ["surface-area-of-3d-shapes", "array", "math", "geometry", "easy"]
---

# How to Solve Surface Area of 3D Shapes

This problem asks you to calculate the total surface area of a 3D shape formed by stacking cubes on a grid. While it's categorized as "Easy," the challenge lies in avoiding double-counting or missing surfaces when cubes are adjacent. The key insight is that each cube contributes 6 faces, but adjacent cubes hide surfaces from each other.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this 2×2 grid:

```
grid = [[1,2],
        [3,4]]
```

We have cubes stacked as follows:

- Cell (0,0): 1 cube
- Cell (0,1): 2 cubes stacked
- Cell (1,0): 3 cubes stacked
- Cell (1,1): 4 cubes stacked

**Step-by-step calculation:**

1. **Total faces without considering adjacency:**  
   Each cube has 6 faces. Total cubes = 1+2+3+4 = 10 cubes.  
   Initial total faces = 10 × 6 = 60.

2. **Subtract hidden faces between adjacent cubes in the same stack:**  
   In each stack, cubes are stacked vertically. For `v` cubes in a stack, there are `(v-1)` vertical adjacencies, each hiding 2 faces (one from each cube).
   - Cell (0,0): 1 cube → 0 hidden vertical faces
   - Cell (0,1): 2 cubes → 1 adjacency hiding 2 faces
   - Cell (1,0): 3 cubes → 2 adjacencies hiding 4 faces
   - Cell (1,1): 4 cubes → 3 adjacencies hiding 6 faces  
     Total hidden vertical faces = 0+2+4+6 = 12.

3. **Subtract hidden faces between adjacent stacks horizontally:**  
   Compare each cell with its right neighbor (if exists). The hidden faces = 2 × min(height1, height2).
   - Between (0,0)[1] and (0,1)[2]: min(1,2)=1 → 2 hidden faces
   - Between (1,0)[3] and (1,1)[4]: min(3,4)=3 → 6 hidden faces  
     Total horizontal hidden faces = 2+6 = 8.

4. **Subtract hidden faces between adjacent stacks vertically:**  
   Compare each cell with its bottom neighbor (if exists).
   - Between (0,0)[1] and (1,0)[3]: min(1,3)=1 → 2 hidden faces
   - Between (0,1)[2] and (1,1)[4]: min(2,4)=2 → 4 hidden faces  
     Total vertical hidden faces = 2+4 = 6.

5. **Final calculation:**  
   Surface area = 60 - 12 - 8 - 6 = 34.

We can verify this matches the formula: For each cell, add `4*v + 2` (side faces + top/bottom), then subtract hidden faces with neighbors.

## Brute Force Approach

A naive approach might try to model each cube individually in 3D space, but with up to 50×50 grid and up to 50 cubes per cell, that's 125,000 cubes — too many to process individually efficiently.

Another brute force approach would be: For each cell `(i,j)` with height `v`, calculate its contribution as `6*v`, then for each of its 4 neighbors, subtract the overlapping faces. This is actually close to optimal, but we need to be careful not to double-subtract. The challenge is implementing this correctly without complex data structures.

The real "brute force" mistake would be trying to store all cubes in a 3D array or using BFS/DFS in 3D space, which would be O(n³) in space and time.

## Optimal Solution

The optimal solution calculates surface area by examining each cell once and checking its neighbors. For each cell `(i,j)` with height `v`:

- Start with `4*v + 2` (all side faces plus top and bottom)
- For each adjacent cell (right and down neighbors only to avoid double-counting), subtract `2 * min(v, neighbor_height)` for the hidden faces

This works because:

1. Each cube has 6 faces, so `v` cubes have `6*v` faces total
2. Within a stack, `(v-1)` adjacencies hide `2*(v-1)` faces, leaving `6v - 2(v-1) = 4v + 2` exposed faces per stack
3. Between stacks, we subtract `2 * min(v1, v2)` for each adjacency

By only checking right and down neighbors, we count each adjacency exactly once.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def surfaceArea(grid):
    """
    Calculate total surface area of 3D shapes formed by stacking cubes.

    Args:
        grid: List[List[int]] - n x n matrix where grid[i][j] = height of cubes at (i,j)

    Returns:
        int - total surface area
    """
    n = len(grid)
    total_area = 0

    # Directions for checking neighbors: right and down only
    # We only check these two directions to avoid double-counting adjacencies
    directions = [(0, 1), (1, 0)]

    for i in range(n):
        for j in range(n):
            height = grid[i][j]
            if height == 0:
                continue  # No cubes, no surface area contribution

            # Each stack of height 'height' contributes:
            # - Top and bottom faces: 2
            # - 4 side faces: 4 * height
            # Total for isolated stack: 4*height + 2
            total_area += 4 * height + 2

            # Check neighbors to subtract hidden faces
            for di, dj in directions:
                ni, nj = i + di, j + dj

                # If neighbor is within bounds
                if 0 <= ni < n and 0 <= nj < n:
                    neighbor_height = grid[ni][nj]

                    # Two adjacent stacks hide faces from each other
                    # The number of hidden faces is 2 * min(height, neighbor_height)
                    # (Each pair of adjacent cubes hides 2 faces: one from each cube)
                    hidden_faces = 2 * min(height, neighbor_height)
                    total_area -= hidden_faces

    return total_area
```

```javascript
// Time: O(n²) | Space: O(1)
/**
 * Calculate total surface area of 3D shapes formed by stacking cubes.
 *
 * @param {number[][]} grid - n x n matrix where grid[i][j] = height of cubes at (i,j)
 * @return {number} - total surface area
 */
function surfaceArea(grid) {
  const n = grid.length;
  let totalArea = 0;

  // Directions for checking neighbors: right and down only
  // We only check these two directions to avoid double-counting adjacencies
  const directions = [
    [0, 1],
    [1, 0],
  ];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const height = grid[i][j];
      if (height === 0) {
        continue; // No cubes, no surface area contribution
      }

      // Each stack of height 'height' contributes:
      // - Top and bottom faces: 2
      // - 4 side faces: 4 * height
      // Total for isolated stack: 4*height + 2
      totalArea += 4 * height + 2;

      // Check neighbors to subtract hidden faces
      for (const [di, dj] of directions) {
        const ni = i + di;
        const nj = j + dj;

        // If neighbor is within bounds
        if (ni >= 0 && ni < n && nj >= 0 && nj < n) {
          const neighborHeight = grid[ni][nj];

          // Two adjacent stacks hide faces from each other
          // The number of hidden faces is 2 * min(height, neighborHeight)
          // (Each pair of adjacent cubes hides 2 faces: one from each cube)
          const hiddenFaces = 2 * Math.min(height, neighborHeight);
          totalArea -= hiddenFaces;
        }
      }
    }
  }

  return totalArea;
}
```

```java
// Time: O(n²) | Space: O(1)
class Solution {
    /**
     * Calculate total surface area of 3D shapes formed by stacking cubes.
     *
     * @param grid - n x n matrix where grid[i][j] = height of cubes at (i,j)
     * @return total surface area
     */
    public int surfaceArea(int[][] grid) {
        int n = grid.length;
        int totalArea = 0;

        // Directions for checking neighbors: right and down only
        // We only check these two directions to avoid double-counting adjacencies
        int[][] directions = {{0, 1}, {1, 0}};

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                int height = grid[i][j];
                if (height == 0) {
                    continue;  // No cubes, no surface area contribution
                }

                // Each stack of height 'height' contributes:
                // - Top and bottom faces: 2
                // - 4 side faces: 4 * height
                // Total for isolated stack: 4*height + 2
                totalArea += 4 * height + 2;

                // Check neighbors to subtract hidden faces
                for (int[] dir : directions) {
                    int ni = i + dir[0];
                    int nj = j + dir[1];

                    // If neighbor is within bounds
                    if (ni >= 0 && ni < n && nj >= 0 && nj < n) {
                        int neighborHeight = grid[ni][nj];

                        // Two adjacent stacks hide faces from each other
                        // The number of hidden faces is 2 * min(height, neighborHeight)
                        // (Each pair of adjacent cubes hides 2 faces: one from each cube)
                        int hiddenFaces = 2 * Math.min(height, neighborHeight);
                        totalArea -= hiddenFaces;
                    }
                }
            }
        }

        return totalArea;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)  
We iterate through each cell in the n×n grid exactly once. For each cell, we perform a constant amount of work: checking up to 2 neighbors (right and down). This gives us O(n²) total operations.

**Space Complexity:** O(1)  
We only use a few variables to track the total area and loop indices. No additional data structures that scale with input size are needed.

## Common Mistakes

1. **Double-counting or missing adjacencies:** Checking all 4 neighbors (up, down, left, right) and subtracting hidden faces for each will double-count. Each adjacency should be counted exactly once. Solution: Only check right and down neighbors (or left and up).

2. **Forgetting to handle zero-height cells:** Cells with height 0 contribute no surface area, but they still affect neighbors. If you skip zero-height cells entirely, you might miss subtracting hidden faces from adjacent non-zero cells. Solution: Include all cells in the loop, but skip the `4*height + 2` contribution when height is 0.

3. **Incorrect hidden face calculation:** Subtracting `height + neighbor_height` instead of `2 * min(height, neighbor_height)`. Each pair of adjacent cubes at the same level hides 2 faces total (one from each cube), and only up to the minimum height matters. Solution: Use `2 * min(height, neighbor_height)`.

4. **Off-by-one in stack contribution:** Using `6*height` instead of `4*height + 2`. Within a stack, adjacent cubes hide vertical faces. Solution: Remember that `v` cubes have `v-1` vertical adjacencies, each hiding 2 faces, so exposed faces = `6v - 2(v-1) = 4v + 2`.

## When You'll See This Pattern

This problem uses **neighbor comparison in a grid** pattern, which appears in many matrix problems:

1. **Island Perimeter (LeetCode 463)** - Similar logic: count edges, subtract shared edges between adjacent land cells. Instead of 3D cubes, it's 2D cells, but the adjacency subtraction concept is identical.

2. **Max Area of Island (LeetCode 695)** - Uses DFS/BFS to explore connected components in a grid, checking all 4 neighbors to determine connectivity.

3. **Rotting Oranges (LeetCode 994)** - Multi-source BFS propagating through grid neighbors, checking all 4 directions.

The core pattern: When working with grid problems where cells interact with their neighbors, systematically check adjacent cells (usually in 4 directions) and apply some logic based on both cells' values.

## Key Takeaways

1. **Grid neighbor problems often require checking in only 2 directions** to avoid double-counting when the relationship is symmetric (like shared edges or faces).

2. **Break down 3D problems into 2D projections** - Instead of thinking about individual cubes, think about stacks and their interactions. This reduces complexity from O(n³) to O(n²).

3. **Derive formulas from simple cases** - Start with one stack: `4v + 2`. Add a neighbor: subtract `2*min(v1, v2)`. Building up from simple cases helps avoid off-by-one errors.

[Practice this problem on CodeJeet](/problem/surface-area-of-3d-shapes)
