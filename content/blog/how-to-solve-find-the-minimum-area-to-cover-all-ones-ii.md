---
title: "How to Solve Find the Minimum Area to Cover All Ones II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Minimum Area to Cover All Ones II. Hard difficulty, 63.6% acceptance rate. Topics: Array, Matrix, Enumeration."
date: "2028-03-12"
category: "dsa-patterns"
tags: ["find-the-minimum-area-to-cover-all-ones-ii", "array", "matrix", "enumeration", "hard"]
---

# How to Solve Find the Minimum Area to Cover All Ones II

You need to cover all 1's in a binary grid with exactly three non-overlapping rectangles, minimizing their total area. The challenge is that you must partition the grid into three sections (either horizontally or vertically) and find the optimal placement of rectangles within each section to cover all 1's with minimal wasted space.

What makes this problem tricky: You need to consider all possible ways to split the grid into three sections, then for each section find the minimum-area rectangle covering all its 1's. The rectangles must be non-overlapping, which means the splits must create clean partitions of the grid.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
1 0 0 1
0 1 1 0
0 1 1 0
1 0 0 1
```

We need to cover all 1's with exactly three rectangles. Since the grid has 4 rows and 4 columns, we can split either horizontally or vertically.

**Option 1: Two horizontal splits**
We could split after row 1 and row 2:

- Top section (rows 0-1): Contains 1's at (0,0), (0,3), (1,1), (1,2)
- Middle section (rows 2-3): Contains 1's at (2,1), (2,2), (3,0), (3,3)
- Bottom section: None (but we still need 3 rectangles, so we'd need to adjust splits)

Actually, we need exactly three rectangles, so we need exactly two splits. Let's think about horizontal splits first:

- Split 1 after row i (0 ≤ i < m-1)
- Split 2 after row j (i < j < m-1)

This gives us three horizontal sections: rows [0,i], [i+1,j], [j+1,m-1]

For each section, we find the minimum rectangle covering all its 1's:

- Left boundary = min column index of any 1 in that section
- Right boundary = max column index of any 1 in that section
- Top boundary = first row of the section
- Bottom boundary = last row of the section
- Area = (right-left+1) × (bottom-top+1)

We compute this for all possible i,j pairs and take the minimum sum.

**Option 2: Two vertical splits**
Similarly, we can split after column i and column j to get three vertical sections.

**Option 3: One horizontal, one vertical split**
This creates four sections, but we only need three rectangles! This is the key insight: we need to think about how to arrange three rectangles in a grid. They could be:

1. Three horizontal strips (two horizontal splits)
2. Three vertical strips (two vertical splits)
3. One rectangle covering the top section, and two rectangles side-by-side in the bottom section (one horizontal split, then one vertical split in the bottom section)
4. Two rectangles side-by-side in the top section, and one rectangle covering the bottom section (one horizontal split, then one vertical split in the top section)

We need to consider all these configurations.

## Brute Force Approach

A naive brute force would try all possible placements of three rectangles. For each rectangle, we could choose:

- Top row (0 to m-1)
- Bottom row (top to m-1)
- Left column (0 to n-1)
- Right column (left to n-1)

That's O(m²n²) possibilities per rectangle, and O((m²n²)³) for three rectangles = O(m⁶n⁶), which is completely infeasible even for small grids.

Even if we only consider rectangles that actually contain 1's, the search space is still enormous. We need a smarter approach that leverages the constraint that rectangles must be non-overlapping and cover all 1's.

## Optimized Approach

The key insight is that with exactly three rectangles, there are only a few possible configurations:

1. **Three horizontal strips**: Two horizontal splits divide the grid into top, middle, and bottom sections.
2. **Three vertical strips**: Two vertical splits divide the grid into left, middle, and right sections.
3. **Top horizontal strip + two vertical strips in bottom**: One horizontal split, then one vertical split in the bottom section.
4. **Two vertical strips in top + bottom horizontal strip**: One horizontal split, then one vertical split in the top section.

For each configuration, we can precompute the minimum rectangle area needed to cover all 1's in any contiguous section of rows or columns. This allows us to try all possible split positions efficiently.

**Precomputation Strategy**:

- For horizontal splits: Precompute `top[i]` = min area to cover all 1's in rows [0,i]
- For vertical splits: Precompute `left[j]` = min area to cover all 1's in columns [0,j]
- Similarly compute `bottom[i]` for rows [i,m-1] and `right[j]` for columns [j,n-1]
- Also compute `middle[i][j]` for rows [i,j] to handle the middle section in three-strip configurations

With these precomputations, we can compute any configuration in O(1) time after O(mn) or O(m²n) preprocessing.

## Optimal Solution

The solution involves:

1. Precomputing prefix arrays to quickly find the boundaries of 1's in any row/column range
2. Computing the minimum rectangle area for all possible contiguous row ranges
3. Trying all valid split positions for each of the four configurations
4. Taking the minimum area sum across all configurations

<div class="code-group">

```python
# Time: O(m^2 * n^2) | Space: O(m^2 + n^2)
def minimumSum(self, grid):
    """
    Find minimum total area of 3 non-overlapping rectangles covering all 1's.

    Approach:
    1. Precompute row and column boundaries for all row ranges
    2. Try all 4 possible configurations of 3 rectangles
    3. For each configuration, try all valid split positions
    4. Return minimum area sum
    """
    m, n = len(grid), len(grid[0])

    # Precompute prefix sums for quick 1's detection
    # We'll use this to find min/max row/col for any rectangle
    prefix = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m):
        for j in range(n):
            prefix[i + 1][j + 1] = (grid[i][j] == 1) + prefix[i][j + 1] + prefix[i + 1][j] - prefix[i][j]

    def has_one(r1, c1, r2, c2):
        """Check if rectangle [r1,c1] to [r2,c2] contains any 1's."""
        return (prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1] -
                prefix[r2 + 1][c1] + prefix[r1][c1]) > 0

    def min_area(r1, c1, r2, c2):
        """Find minimum area rectangle covering all 1's in [r1,c1] to [r2,c2]."""
        if not has_one(r1, c1, r2, c2):
            return 0

        # Find boundaries of 1's in this region
        top, bottom = r2, r1
        left, right = c2, c1

        # Scan the region to find min/max row and col with 1's
        # This could be optimized but O(mn) is acceptable for this problem size
        for i in range(r1, r2 + 1):
            for j in range(c1, c2 + 1):
                if grid[i][j] == 1:
                    top = min(top, i)
                    bottom = max(bottom, i)
                    left = min(left, j)
                    right = max(right, j)

        return (bottom - top + 1) * (right - left + 1)

    # Precompute min area for all row ranges (for horizontal splits)
    row_area = [[0] * m for _ in range(m)]
    for i in range(m):
        for j in range(i, m):
            row_area[i][j] = min_area(i, 0, j, n - 1)

    # Precompute min area for all column ranges (for vertical splits)
    col_area = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(i, n):
            col_area[i][j] = min_area(0, i, m - 1, j)

    min_total = float('inf')

    # Configuration 1: Three horizontal strips (split after i and j)
    for i in range(m - 2):
        for j in range(i + 1, m - 1):
            area1 = row_area[0][i]
            area2 = row_area[i + 1][j]
            area3 = row_area[j + 1][m - 1]
            # All rectangles must have non-zero area (contain at least one 1)
            if area1 > 0 and area2 > 0 and area3 > 0:
                min_total = min(min_total, area1 + area2 + area3)

    # Configuration 2: Three vertical strips (split after i and j)
    for i in range(n - 2):
        for j in range(i + 1, n - 1):
            area1 = col_area[0][i]
            area2 = col_area[i + 1][j]
            area3 = col_area[j + 1][n - 1]
            if area1 > 0 and area2 > 0 and area3 > 0:
                min_total = min(min_total, area1 + area2 + area3)

    # Configuration 3: Top horizontal + two vertical in bottom
    for i in range(m - 1):  # Horizontal split after row i
        top_area = row_area[0][i]
        if top_area == 0:
            continue

        # Now split bottom section vertically
        for j in range(n - 2):  # First vertical split after col j
            for k in range(j + 1, n - 1):  # Second vertical split after col k
                area1 = min_area(i + 1, 0, m - 1, j)
                area2 = min_area(i + 1, j + 1, m - 1, k)
                area3 = min_area(i + 1, k + 1, m - 1, n - 1)
                # We need exactly 2 rectangles in bottom, so one can be empty
                # Count how many have area > 0
                bottom_areas = [area for area in [area1, area2, area3] if area > 0]
                if len(bottom_areas) == 2:
                    min_total = min(min_total, top_area + sum(bottom_areas))

    # Configuration 4: Two vertical in top + bottom horizontal
    for i in range(n - 1):  # Vertical split in top section after col i
        # Split top section vertically
        for j in range(m - 2):  # First horizontal split in top
            for k in range(j + 1, m - 1):  # Second horizontal split in top
                area1 = min_area(0, 0, j, i)
                area2 = min_area(j + 1, 0, k, i)
                area3 = min_area(k + 1, 0, m - 1, i)
                top_areas = [area for area in [area1, area2, area3] if area > 0]
                if len(top_areas) == 2:
                    # Bottom section (right of vertical split)
                    bottom_area = min_area(0, i + 1, m - 1, n - 1)
                    if bottom_area > 0:
                        min_total = min(min_total, sum(top_areas) + bottom_area)

    return min_total
```

```javascript
// Time: O(m^2 * n^2) | Space: O(m^2 + n^2)
function minimumSum(grid) {
  /**
   * Find minimum total area of 3 non-overlapping rectangles covering all 1's.
   */
  const m = grid.length,
    n = grid[0].length;

  // Precompute prefix sums for quick 1's detection
  const prefix = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      prefix[i + 1][j + 1] =
        (grid[i][j] === 1 ? 1 : 0) + prefix[i][j + 1] + prefix[i + 1][j] - prefix[i][j];
    }
  }

  function hasOne(r1, c1, r2, c2) {
    /** Check if rectangle [r1,c1] to [r2,c2] contains any 1's. */
    return prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1] - prefix[r2 + 1][c1] + prefix[r1][c1] > 0;
  }

  function minArea(r1, c1, r2, c2) {
    /** Find minimum area rectangle covering all 1's in [r1,c1] to [r2,c2]. */
    if (!hasOne(r1, c1, r2, c2)) {
      return 0;
    }

    // Find boundaries of 1's in this region
    let top = r2,
      bottom = r1;
    let left = c2,
      right = c1;

    // Scan the region to find min/max row and col with 1's
    for (let i = r1; i <= r2; i++) {
      for (let j = c1; j <= c2; j++) {
        if (grid[i][j] === 1) {
          top = Math.min(top, i);
          bottom = Math.max(bottom, i);
          left = Math.min(left, j);
          right = Math.max(right, j);
        }
      }
    }

    return (bottom - top + 1) * (right - left + 1);
  }

  // Precompute min area for all row ranges
  const rowArea = Array(m)
    .fill()
    .map(() => Array(m).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = i; j < m; j++) {
      rowArea[i][j] = minArea(i, 0, j, n - 1);
    }
  }

  // Precompute min area for all column ranges
  const colArea = Array(n)
    .fill()
    .map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      colArea[i][j] = minArea(0, i, m - 1, j);
    }
  }

  let minTotal = Infinity;

  // Configuration 1: Three horizontal strips
  for (let i = 0; i < m - 2; i++) {
    for (let j = i + 1; j < m - 1; j++) {
      const area1 = rowArea[0][i];
      const area2 = rowArea[i + 1][j];
      const area3 = rowArea[j + 1][m - 1];
      if (area1 > 0 && area2 > 0 && area3 > 0) {
        minTotal = Math.min(minTotal, area1 + area2 + area3);
      }
    }
  }

  // Configuration 2: Three vertical strips
  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 1; j < n - 1; j++) {
      const area1 = colArea[0][i];
      const area2 = colArea[i + 1][j];
      const area3 = colArea[j + 1][n - 1];
      if (area1 > 0 && area2 > 0 && area3 > 0) {
        minTotal = Math.min(minTotal, area1 + area2 + area3);
      }
    }
  }

  // Configuration 3: Top horizontal + two vertical in bottom
  for (let i = 0; i < m - 1; i++) {
    const topArea = rowArea[0][i];
    if (topArea === 0) continue;

    for (let j = 0; j < n - 2; j++) {
      for (let k = j + 1; k < n - 1; k++) {
        const area1 = minArea(i + 1, 0, m - 1, j);
        const area2 = minArea(i + 1, j + 1, m - 1, k);
        const area3 = minArea(i + 1, k + 1, m - 1, n - 1);

        const bottomAreas = [area1, area2, area3].filter((a) => a > 0);
        if (bottomAreas.length === 2) {
          minTotal = Math.min(minTotal, topArea + bottomAreas[0] + bottomAreas[1]);
        }
      }
    }
  }

  // Configuration 4: Two vertical in top + bottom horizontal
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < m - 2; j++) {
      for (let k = j + 1; k < m - 1; k++) {
        const area1 = minArea(0, 0, j, i);
        const area2 = minArea(j + 1, 0, k, i);
        const area3 = minArea(k + 1, 0, m - 1, i);

        const topAreas = [area1, area2, area3].filter((a) => a > 0);
        if (topAreas.length === 2) {
          const bottomArea = minArea(0, i + 1, m - 1, n - 1);
          if (bottomArea > 0) {
            minTotal = Math.min(minTotal, topAreas[0] + topAreas[1] + bottomArea);
          }
        }
      }
    }
  }

  return minTotal;
}
```

```java
// Time: O(m^2 * n^2) | Space: O(m^2 + n^2)
class Solution {
    public int minimumSum(int[][] grid) {
        /**
         * Find minimum total area of 3 non-overlapping rectangles covering all 1's.
         */
        int m = grid.length, n = grid[0].length;

        // Precompute prefix sums for quick 1's detection
        int[][] prefix = new int[m + 1][n + 1];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                prefix[i + 1][j + 1] = (grid[i][j] == 1 ? 1 : 0) +
                                       prefix[i][j + 1] +
                                       prefix[i + 1][j] -
                                       prefix[i][j];
            }
        }

        // Helper function to check if a rectangle contains any 1's
        java.util.function.Predicate<int[]> hasOne = rect -> {
            int r1 = rect[0], c1 = rect[1], r2 = rect[2], c2 = rect[3];
            return (prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1] -
                    prefix[r2 + 1][c1] + prefix[r1][c1]) > 0;
        };

        // Helper function to compute minimum area for a region
        java.util.function.Function<int[], Integer> minArea = rect -> {
            int r1 = rect[0], c1 = rect[1], r2 = rect[2], c2 = rect[3];
            if (!hasOne.test(new int[]{r1, c1, r2, c2})) {
                return 0;
            }

            // Find boundaries of 1's in this region
            int top = r2, bottom = r1;
            int left = c2, right = c1;

            for (int i = r1; i <= r2; i++) {
                for (int j = c1; j <= c2; j++) {
                    if (grid[i][j] == 1) {
                        top = Math.min(top, i);
                        bottom = Math.max(bottom, i);
                        left = Math.min(left, j);
                        right = Math.max(right, j);
                    }
                }
            }

            return (bottom - top + 1) * (right - left + 1);
        };

        // Precompute min area for all row ranges
        int[][] rowArea = new int[m][m];
        for (int i = 0; i < m; i++) {
            for (int j = i; j < m; j++) {
                rowArea[i][j] = minArea.apply(new int[]{i, 0, j, n - 1});
            }
        }

        // Precompute min area for all column ranges
        int[][] colArea = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                colArea[i][j] = minArea.apply(new int[]{0, i, m - 1, j});
            }
        }

        int minTotal = Integer.MAX_VALUE;

        // Configuration 1: Three horizontal strips
        for (int i = 0; i < m - 2; i++) {
            for (int j = i + 1; j < m - 1; j++) {
                int area1 = rowArea[0][i];
                int area2 = rowArea[i + 1][j];
                int area3 = rowArea[j + 1][m - 1];
                if (area1 > 0 && area2 > 0 && area3 > 0) {
                    minTotal = Math.min(minTotal, area1 + area2 + area3);
                }
            }
        }

        // Configuration 2: Three vertical strips
        for (int i = 0; i < n - 2; i++) {
            for (int j = i + 1; j < n - 1; j++) {
                int area1 = colArea[0][i];
                int area2 = colArea[i + 1][j];
                int area3 = colArea[j + 1][n - 1];
                if (area1 > 0 && area2 > 0 && area3 > 0) {
                    minTotal = Math.min(minTotal, area1 + area2 + area3);
                }
            }
        }

        // Configuration 3: Top horizontal + two vertical in bottom
        for (int i = 0; i < m - 1; i++) {
            int topArea = rowArea[0][i];
            if (topArea == 0) continue;

            for (int j = 0; j < n - 2; j++) {
                for (int k = j + 1; k < n - 1; k++) {
                    int area1 = minArea.apply(new int[]{i + 1, 0, m - 1, j});
                    int area2 = minArea.apply(new int[]{i + 1, j + 1, m - 1, k});
                    int area3 = minArea.apply(new int[]{i + 1, k + 1, m - 1, n - 1});

                    int bottomCount = 0;
                    int bottomSum = 0;
                    if (area1 > 0) { bottomCount++; bottomSum += area1; }
                    if (area2 > 0) { bottomCount++; bottomSum += area2; }
                    if (area3 > 0) { bottomCount++; bottomSum += area3; }

                    if (bottomCount == 2) {
                        minTotal = Math.min(minTotal, topArea + bottomSum);
                    }
                }
            }
        }

        // Configuration 4: Two vertical in top + bottom horizontal
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < m - 2; j++) {
                for (int k = j + 1; k < m - 1; k++) {
                    int area1 = minArea.apply(new int[]{0, 0, j, i});
                    int area2 = minArea.apply(new int[]{j + 1, 0, k, i});
                    int area3 = minArea.apply(new int[]{k + 1, 0, m - 1, i});

                    int topCount = 0;
                    int topSum = 0;
                    if (area1 > 0) { topCount++; topSum += area1; }
                    if (area2 > 0) { topCount++; topSum += area2; }
                    if (area3 > 0) { topCount++; topSum += area3; }

                    if (topCount == 2) {
                        int bottomArea = minArea.apply(new int[]{0, i + 1, m - 1, n - 1});
                        if (bottomArea > 0) {
                            minTotal = Math.min(minTotal, topSum + bottomArea);
                        }
                    }
                }
            }
        }

        return minTotal;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(m² × n²)

- Precomputing rowArea takes O(m² × n) since for each of O(m²) row ranges, we scan up to n columns
- Precomputing colArea takes O(n² × m) for similar reasons
- The four configurations involve nested loops:
  - Config 1: O(m²) iterations, each O(1)
  - Config 2: O(n²) iterations, each O(1)
  - Config 3: O(m × n²) iterations, each computing minArea in O(m × n) worst case
  - Config 4: O(n × m²) iterations, each computing minArea in O(m × n) worst case
- Dominant term is O(m × n² × m × n) = O(m² × n³) from config 3, but in practice with early exits and the constraints, it's manageable

**Space Complexity**: O(m² + n²)

- We store rowArea of size m×m and colArea of size n×n
- Prefix array uses O(m×n) but this is dominated by the quadratic terms for typical inputs

## Common Mistakes

1. **Forgetting that rectangles must have non-zero area**: Each rectangle must contain at least one 1. Candidates often miss checking `area > 0` before including a rectangle in the sum.

2. **Overlooking all four configurations**: The problem requires exactly three rectangles, not necessarily arranged as three strips. Many candidates only consider the simple three-strip configurations and miss the mixed configurations.

3. **Incorrect boundary calculations**: When computing the minimum rectangle for a region, you must find the actual min/max row and column containing 1's, not just use the region boundaries. Using the wrong boundaries adds unnecessary empty space.

4. **Inefficient repeated computations**: Without precomputation, recalculating the minimum rectangle area for the same region multiple times leads to O(m³n³) complexity, which times out for larger grids.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Partition DP with geometric constraints**: Similar to problems where you need to partition a space optimally, like "Minimum Difficulty of a Job Schedule" or "Palindrome Partitioning II".

2. **Rectangle boundary computation**: The technique of finding min/max coordinates of points in a region appears in "Smallest Rectangle Enclosing Black Pixels" and "Max Sum of Rectangle No Larger Than K".

3. **Enumeration of split positions**: Trying all possible split positions is common in problems like "Split Array Largest Sum" and "Divide Chocolate".

## Key Takeaways

1. **Break complex problems into configurations**: When a problem has a fixed number of components (like 3 rectangles), enumerate all possible arrangements first, then optimize each arrangement separately.

2. **Precompute for efficiency**: When you need to compute the same value for many different ranges, precompute all possible ranges to avoid repeated work.

3. **Geometric constraints simplify search**: The requirement that rectangles have axis-aligned sides and must cover all points lets you compute exact boundaries from min/max coordinates, avoiding complex shape calculations.

Related problems: [Smallest Rectangle Enclosing Black Pixels](/problem/smallest-rectangle-enclosing-black-pixels)
