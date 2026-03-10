---
title: "How to Solve Right Triangles — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Right Triangles. Medium difficulty, 48.4% acceptance rate. Topics: Array, Hash Table, Math, Combinatorics, Counting."
date: "2029-09-12"
category: "dsa-patterns"
tags: ["right-triangles", "array", "hash-table", "math", "medium"]
---

## How to Solve Right Triangles

You're given a 2D boolean matrix where `True` values represent points. A "right triangle" is formed by any three points where one point shares a row with a second point and shares a column with a third point. The challenge is counting all such triangles efficiently when the matrix can be large (up to 1000×1000). The tricky part is avoiding the O(n³) brute force approach by using combinatorics and preprocessing.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
[True,  True,  False]
[False, True,  True ]
[True,  False, False]
```

We'll mark True cells with coordinates:

- (0,0), (0,1), (1,1), (1,2), (2,0)

**Step-by-step counting:**
For each True cell, it can serve as the "right angle" vertex (the point that shares a row with one point and a column with another).

Take cell (0,0):

- Row 0 has 2 True cells total (including itself)
- Column 0 has 2 True cells total (including itself)
- Points in same row: (0,1)
- Points in same column: (2,0)
- Triangles with (0,0) as right angle: (row_count - 1) × (col_count - 1) = (2-1) × (2-1) = 1 × 1 = 1
- That triangle is: (0,0), (0,1), (2,0)

Take cell (0,1):

- Row 0: 2 True cells
- Column 1: 2 True cells (0,1) and (1,1)
- Triangles: (2-1) × (2-1) = 1
- Triangle: (0,1), (0,0), (1,1)

Take cell (1,1):

- Row 1: 2 True cells
- Column 1: 2 True cells
- Triangles: (2-1) × (2-1) = 1
- Triangle: (1,1), (1,2), (0,1)

Take cell (1,2):

- Row 1: 2 True cells
- Column 2: 1 True cell (only itself)
- Triangles: (2-1) × (1-1) = 1 × 0 = 0

Take cell (2,0):

- Row 2: 1 True cell
- Column 0: 2 True cells
- Triangles: (1-1) × (2-1) = 0 × 1 = 0

**Total triangles:** 1 + 1 + 1 + 0 + 0 = 3

## Brute Force Approach

The naive solution would check all combinations of three True cells:

1. Find all True coordinates
2. For each combination of 3 points, check if they form a right triangle
3. A triangle is valid if one point shares row with another AND column with the third

The check for three points (a,b,c) forming a right triangle:

- a shares row with b AND a shares column with c, OR
- a shares row with c AND a shares column with b, OR
- b shares row with a AND b shares column with c, etc.

This requires O(m³ × n³) operations where m,n are matrix dimensions - completely infeasible for 1000×1000 grids.

## Optimized Approach

The key insight is that **each True cell can serve as the right angle vertex**. For a cell at (r,c) to be the right angle:

1. It needs at least one other True cell in the same row
2. It needs at least one other True cell in the same column

If row r has `row_count[r]` True cells and column c has `col_count[c]` True cells:

- Other True cells in same row: `row_count[r] - 1` (excluding itself)
- Other True cells in same column: `col_count[c] - 1` (excluding itself)
- Number of triangles with (r,c) as right angle: `(row_count[r] - 1) × (col_count[c] - 1)`

We can precompute row and column counts in O(m×n) time, then sum this formula over all True cells.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m × n) | Space: O(m + n)
def numberOfRightTriangles(grid):
    """
    Counts all right triangles formed by True cells in the grid.
    A right triangle has one cell sharing a row with another
    and a column with a third cell.
    """
    m, n = len(grid), len(grid[0])

    # Step 1: Precompute row and column counts
    row_count = [0] * m
    col_count = [0] * n

    # Count True cells in each row and column
    for r in range(m):
        for c in range(n):
            if grid[r][c]:
                row_count[r] += 1
                col_count[c] += 1

    # Step 2: Count triangles using the formula
    total_triangles = 0

    # For each True cell, count triangles where it's the right angle
    for r in range(m):
        for c in range(n):
            if grid[r][c]:
                # Triangles = (others in same row) × (others in same column)
                triangles_from_cell = (row_count[r] - 1) * (col_count[c] - 1)
                total_triangles += triangles_from_cell

    return total_triangles
```

```javascript
// Time: O(m × n) | Space: O(m + n)
function numberOfRightTriangles(grid) {
  /**
   * Counts all right triangles formed by true cells in the grid.
   * A right triangle has one cell sharing a row with another
   * and a column with a third cell.
   */
  const m = grid.length;
  const n = grid[0].length;

  // Step 1: Precompute row and column counts
  const rowCount = new Array(m).fill(0);
  const colCount = new Array(n).fill(0);

  // Count true cells in each row and column
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c]) {
        rowCount[r]++;
        colCount[c]++;
      }
    }
  }

  // Step 2: Count triangles using the formula
  let totalTriangles = 0;

  // For each true cell, count triangles where it's the right angle
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c]) {
        // Triangles = (others in same row) × (others in same column)
        const trianglesFromCell = (rowCount[r] - 1) * (colCount[c] - 1);
        totalTriangles += trianglesFromCell;
      }
    }
  }

  return totalTriangles;
}
```

```java
// Time: O(m × n) | Space: O(m + n)
class Solution {
    public long numberOfRightTriangles(int[][] grid) {
        /**
         * Counts all right triangles formed by 1s in the grid.
         * A right triangle has one cell sharing a row with another
         * and a column with a third cell.
         */
        int m = grid.length;
        int n = grid[0].length;

        // Step 1: Precompute row and column counts
        int[] rowCount = new int[m];
        int[] colCount = new int[n];

        // Count 1s in each row and column
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 1) {
                    rowCount[r]++;
                    colCount[c]++;
                }
            }
        }

        // Step 2: Count triangles using the formula
        long totalTriangles = 0;

        // For each 1 cell, count triangles where it's the right angle
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 1) {
                    // Triangles = (others in same row) × (others in same column)
                    // Use long to prevent overflow for large counts
                    long trianglesFromCell = (long)(rowCount[r] - 1) * (colCount[c] - 1);
                    totalTriangles += trianglesFromCell;
                }
            }
        }

        return totalTriangles;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- We make two passes through the grid
- First pass: O(m × n) to count row and column frequencies
- Second pass: O(m × n) to calculate triangles for each True cell
- Total: O(2 × m × n) = O(m × n)

**Space Complexity:** O(m + n)

- We store two arrays: `row_count` of size m and `col_count` of size n
- No additional data structures needed
- This is optimal as we need to store at least row and column counts

## Common Mistakes

1. **Not subtracting 1 from counts**: Forgetting that the formula uses `(row_count[r] - 1) × (col_count[c] - 1)` instead of just `row_count[r] × col_count[c]`. The -1 excludes the current cell itself from the count of "other" cells in the same row/column.

2. **Integer overflow**: With large grids (1000×1000), the triangle count can exceed 2³¹. In Java, use `long` for the total. In Python, integers are arbitrary precision, but in JavaScript, use BigInt for very large counts or ensure the result fits in Number range.

3. **Double counting triangles**: Some candidates worry about counting the same triangle multiple times. Each triangle has exactly one right angle vertex (the point that shares row with one and column with another), so counting from each True cell's perspective gives unique triangles.

4. **Incorrect row/column counting**: When a cell is True, you must increment BOTH its row count AND its column count. A common error is to only increment one or the other.

## When You'll See This Pattern

This "precompute row/column counts then combine" pattern appears in several grid counting problems:

1. **Battleships in a Board (LeetCode 419)**: Count battleships by checking if each 'X' is the first in its row and column.

2. **Lonely Pixel I (LeetCode 531)**: Find black pixels that are the only one in their row and column - similar row/column counting approach.

3. **Range Sum Query 2D - Immutable (LeetCode 304)**: Uses prefix sums which are another form of precomputation for efficient queries.

The core technique is **precomputing aggregates** (sums, counts) along dimensions to answer queries in O(1) time instead of rescanning.

## Key Takeaways

1. **Think in terms of the "center" element**: For combinatorial counting problems, consider what role each element plays in the structure being counted. Here, each True cell can be the right angle vertex.

2. **Precomputation enables O(1) queries**: By counting row and column frequencies upfront, we avoid scanning rows/columns repeatedly for each cell, turning O(n³) into O(n²).

3. **Combinatorics beats enumeration**: Instead of checking all triples (O(n³)), use mathematical relationships. If you can derive a formula based on local information, you can often achieve linear or quadratic time.

[Practice this problem on CodeJeet](/problem/right-triangles)
