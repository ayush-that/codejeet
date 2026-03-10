---
title: "How to Solve Find the Minimum Area to Cover All Ones I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Minimum Area to Cover All Ones I. Medium difficulty, 78.2% acceptance rate. Topics: Array, Matrix."
date: "2026-06-18"
category: "dsa-patterns"
tags: ["find-the-minimum-area-to-cover-all-ones-i", "array", "matrix", "medium"]
---

## How to Solve Find the Minimum Area to Cover All Ones I

You need to find the smallest axis-aligned rectangle that contains all the `1`s in a binary matrix. The challenge is to efficiently locate the boundaries of this rectangle without checking every possible rectangle. The problem is interesting because it looks like a geometry problem but reduces to a simple scanning task once you understand what defines the rectangle.

## Visual Walkthrough

Let's trace through a concrete example:

```
grid = [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0]
]
```

We need to find the rectangle that contains all three `1`s. The rectangle is defined by four boundaries:

- **Top**: The smallest row index containing a `1`
- **Bottom**: The largest row index containing a `1`
- **Left**: The smallest column index containing a `1`
- **Right**: The largest column index containing a `1`

Let's scan the grid:

- Row 1 (index 1): Has a `1` at column 1 → top = 1, bottom = 1, left = 1, right = 1
- Row 2 (index 2): Has a `1` at column 2 → bottom = 2, left = min(1, 2) = 1, right = max(1, 2) = 2
- Row 3 (index 3): Has a `1` at column 3 → bottom = 3, left = min(1, 3) = 1, right = max(2, 3) = 3

Final boundaries: top = 1, bottom = 3, left = 1, right = 3
Area = (bottom - top + 1) × (right - left + 1) = (3 - 1 + 1) × (3 - 1 + 1) = 3 × 3 = 9

The rectangle covers rows 1-3 and columns 1-3, which indeed contains all `1`s.

## Brute Force Approach

A naive approach would be to check every possible rectangle in the grid to see if it contains all `1`s, then find the smallest such rectangle. For an `m × n` grid, there are O(m²n²) possible rectangles. For each rectangle, we'd need to check if all `1`s are inside it, which takes O(mn) in the worst case. This gives us O(m³n³) time complexity, which is far too slow for typical constraints.

Even if we optimize by only considering rectangles that start and end at `1` positions, we'd still have O(k⁴) complexity where k is the number of `1`s, which could be up to m×n. This approach is impractical.

## Optimized Approach

The key insight is that the smallest rectangle containing all `1`s is simply defined by the extreme positions of the `1`s. We don't need to check every possible rectangle—we just need to find:

- The minimum and maximum row indices where `1`s appear
- The minimum and maximum column indices where `1`s appear

These four values define the rectangle boundaries. The area is then:

```
(height) × (width) = (bottom - top + 1) × (right - left + 1)
```

We can find these boundaries with a single pass through the grid:

1. Initialize boundaries to extreme values
2. For each cell that contains a `1`, update the boundaries if needed
3. Calculate the area from the final boundaries

This approach works because any rectangle containing all `1`s must at least cover from the topmost to bottommost `1` and from the leftmost to rightmost `1`. Conversely, the rectangle defined by these extremes will contain all `1`s.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m * n) | Space: O(1)
def minimumArea(grid):
    """
    Find the minimum area rectangle containing all 1's in a binary grid.

    The rectangle is defined by:
    - top: minimum row index with a 1
    - bottom: maximum row index with a 1
    - left: minimum column index with a 1
    - right: maximum column index with a 1

    Area = (bottom - top + 1) * (right - left + 1)
    """
    m, n = len(grid), len(grid[0])

    # Initialize boundaries to extreme values
    # We'll update these as we find 1's
    top, bottom = m, -1      # top > bottom initially (invalid state)
    left, right = n, -1      # left > right initially (invalid state)

    # Scan through every cell in the grid
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                # Update row boundaries
                top = min(top, i)
                bottom = max(bottom, i)

                # Update column boundaries
                left = min(left, j)
                right = max(right, j)

    # If no 1's were found, return 0
    if top > bottom or left > right:
        return 0

    # Calculate area: height * width
    height = bottom - top + 1
    width = right - left + 1
    return height * width
```

```javascript
// Time: O(m * n) | Space: O(1)
function minimumArea(grid) {
  /**
   * Find the minimum area rectangle containing all 1's in a binary grid.
   *
   * The rectangle is defined by:
   * - top: minimum row index with a 1
   * - bottom: maximum row index with a 1
   * - left: minimum column index with a 1
   * - right: maximum column index with a 1
   *
   * Area = (bottom - top + 1) * (right - left + 1)
   */
  const m = grid.length;
  const n = grid[0].length;

  // Initialize boundaries to extreme values
  // We'll update these as we find 1's
  let top = m,
    bottom = -1; // top > bottom initially (invalid state)
  let left = n,
    right = -1; // left > right initially (invalid state)

  // Scan through every cell in the grid
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        // Update row boundaries
        top = Math.min(top, i);
        bottom = Math.max(bottom, i);

        // Update column boundaries
        left = Math.min(left, j);
        right = Math.max(right, j);
      }
    }
  }

  // If no 1's were found, return 0
  if (top > bottom || left > right) {
    return 0;
  }

  // Calculate area: height * width
  const height = bottom - top + 1;
  const width = right - left + 1;
  return height * width;
}
```

```java
// Time: O(m * n) | Space: O(1)
class Solution {
    public int minimumArea(int[][] grid) {
        /**
         * Find the minimum area rectangle containing all 1's in a binary grid.
         *
         * The rectangle is defined by:
         * - top: minimum row index with a 1
         * - bottom: maximum row index with a 1
         * - left: minimum column index with a 1
         * - right: maximum column index with a 1
         *
         * Area = (bottom - top + 1) * (right - left + 1)
         */
        int m = grid.length;
        int n = grid[0].length;

        // Initialize boundaries to extreme values
        // We'll update these as we find 1's
        int top = m, bottom = -1;  // top > bottom initially (invalid state)
        int left = n, right = -1;  // left > right initially (invalid state)

        // Scan through every cell in the grid
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    // Update row boundaries
                    top = Math.min(top, i);
                    bottom = Math.max(bottom, i);

                    // Update column boundaries
                    left = Math.min(left, j);
                    right = Math.max(right, j);
                }
            }
        }

        // If no 1's were found, return 0
        if (top > bottom || left > right) {
            return 0;
        }

        // Calculate area: height * width
        int height = bottom - top + 1;
        int width = right - left + 1;
        return height * width;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- We iterate through every cell in the grid exactly once
- Each cell requires constant time operations (comparisons and updates)
- No nested loops beyond the grid traversal

**Space Complexity:** O(1)

- We only use a constant amount of extra space (four integer variables for boundaries)
- No additional data structures that scale with input size
- The input grid is not counted toward space complexity

## Common Mistakes

1. **Forgetting to handle the case with no 1's**: If the grid contains no `1`s, the boundaries remain in their initial invalid state (top > bottom or left > right). You must check for this and return 0. The code above handles this with the early return check.

2. **Off-by-one errors in area calculation**: The area formula is `(bottom - top + 1) × (right - left + 1)`, not `(bottom - top) × (right - left)`. Remember that if top = bottom = 2, the height is 1, not 0.

3. **Initializing boundaries incorrectly**: Some candidates initialize boundaries to 0, but this fails if all `1`s are in later rows/columns. Initialize top and left to large values (like m and n), and bottom and right to small values (like -1).

4. **Assuming the rectangle must be square**: The problem doesn't require the rectangle to be square—it can be any axis-aligned rectangle. Don't try to make height = width unless the problem specifically asks for it.

## When You'll See This Pattern

This "boundary scanning" pattern appears in problems where you need to find the extent of certain elements:

1. **Smallest Rectangle Enclosing Black Pixels (LeetCode 302)**: A harder version where you need to use binary search to find boundaries efficiently when you can only check if a pixel is black.

2. **Image Overlap (LeetCode 835)**: Finding the bounding box of non-zero elements is often a preprocessing step.

3. **Max Area of Island (LeetCode 695)**: While finding island areas, you might also need to find their bounding boxes.

4. **Range problems in general**: Any problem asking for "minimum range covering all X" follows similar logic—find the extremes.

## Key Takeaways

1. **Reduce geometry to extremes**: The smallest containing rectangle for a set of points is defined by their minimum and maximum coordinates in each dimension. This transforms a complex geometry problem into a simple scanning task.

2. **Initialize boundaries carefully**: When searching for min/max values, initialize min to a large value and max to a small value. This ensures the first valid element properly sets the boundaries.

3. **Check for empty cases**: Always consider what happens when there are no elements to contain. In this case, return 0 area.

Related problems: [Smallest Rectangle Enclosing Black Pixels](/problem/smallest-rectangle-enclosing-black-pixels)
