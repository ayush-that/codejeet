---
title: "How to Solve Image Smoother — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Image Smoother. Easy difficulty, 69.1% acceptance rate. Topics: Array, Matrix."
date: "2028-10-16"
category: "dsa-patterns"
tags: ["image-smoother", "array", "matrix", "easy"]
---

# How to Solve Image Smoother

The Image Smoother problem asks us to apply a 3×3 averaging filter to a 2D image matrix, where each pixel's new value becomes the floor of the average of itself and its valid neighbors. What makes this problem interesting is handling edge cases where pixels don't have all eight neighbors — we can only average the cells that actually exist in the matrix.

## Visual Walkthrough

Let's walk through a concrete example to build intuition. Consider this 3×3 image:

```
Input:
[[100, 200, 100],
 [200,  50, 200],
 [100, 200, 100]]
```

For the **center cell (1,1)** with value 50:

- It has all 8 neighbors: [100, 200, 100, 200, 200, 100, 200, 100]
- Sum = 100 + 200 + 100 + 200 + 50 + 200 + 100 + 200 + 100 = 1250
- Count = 9 cells
- Average = floor(1250 / 9) = floor(138.88...) = 138

For the **top-left corner (0,0)** with value 100:

- Valid neighbors: itself (100), right (200), bottom (200), bottom-right (50)
- Sum = 100 + 200 + 200 + 50 = 550
- Count = 4 cells
- Average = floor(550 / 4) = floor(137.5) = 137

For the **top-middle edge (0,1)** with value 200:

- Valid neighbors: left (100), itself (200), right (100), bottom-left (200), bottom (50), bottom-right (200)
- Sum = 100 + 200 + 100 + 200 + 50 + 200 = 850
- Count = 6 cells
- Average = floor(850 / 6) = floor(141.66...) = 141

The key insight is that for each cell, we need to check all positions within a 3×3 window centered on that cell, but only include positions that fall within the matrix boundaries.

## Brute Force Approach

The most straightforward approach is to create a new matrix of the same size, then for each cell:

1. Initialize sum = 0 and count = 0
2. Check all 9 positions in the 3×3 window (from row-1 to row+1, col-1 to col+1)
3. For each position, if it's within matrix bounds, add its value to sum and increment count
4. Set the new cell value to floor(sum / count)

This is actually the optimal approach for this problem! There's no clever optimization needed because we must examine each cell's neighborhood, and the 3×3 window is fixed size. A truly naive approach might try to handle edges with complex conditional logic or create a padded copy of the matrix, but the direct boundary-checking approach is clean and efficient.

## Optimal Solution

The optimal solution directly implements the brute force approach described above. We iterate through each cell, check its 3×3 neighborhood, and compute the average of valid cells.

<div class="code-group">

```python
# Time: O(m * n) where m = rows, n = cols | Space: O(m * n) for the result matrix
def imageSmoother(img):
    """
    Apply a 3x3 averaging filter to an image matrix.
    Each pixel becomes floor(average of itself and valid neighbors).
    """
    rows, cols = len(img), len(img[0])
    # Create result matrix with same dimensions
    result = [[0] * cols for _ in range(rows)]

    # Define all 8 possible neighbor directions plus (0,0) for self
    directions = [(-1, -1), (-1, 0), (-1, 1),
                  (0, -1),  (0, 0),  (0, 1),
                  (1, -1),  (1, 0),  (1, 1)]

    for r in range(rows):
        for c in range(cols):
            total = 0      # Sum of valid neighbor values
            count = 0      # Number of valid neighbors

            # Check all positions in the 3x3 window
            for dr, dc in directions:
                nr, nc = r + dr, c + dc  # Neighbor coordinates

                # Only include if neighbor is within bounds
                if 0 <= nr < rows and 0 <= nc < cols:
                    total += img[nr][nc]
                    count += 1

            # Compute floor of average (integer division in Python does floor division)
            result[r][c] = total // count

    return result
```

```javascript
// Time: O(m * n) where m = rows, n = cols | Space: O(m * n) for the result matrix
function imageSmoother(img) {
  const rows = img.length;
  const cols = img[0].length;
  // Create result matrix with same dimensions
  const result = new Array(rows);
  for (let i = 0; i < rows; i++) {
    result[i] = new Array(cols).fill(0);
  }

  // All 9 positions in the 3x3 window
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let total = 0; // Sum of valid neighbor values
      let count = 0; // Number of valid neighbors

      // Check each position in the 3x3 window
      for (const [dr, dc] of directions) {
        const nr = r + dr; // Neighbor row
        const nc = c + dc; // Neighbor column

        // Only include if within matrix bounds
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          total += img[nr][nc];
          count++;
        }
      }

      // Use Math.floor for integer division (floor of average)
      result[r][c] = Math.floor(total / count);
    }
  }

  return result;
}
```

```java
// Time: O(m * n) where m = rows, n = cols | Space: O(m * n) for the result matrix
public int[][] imageSmoother(int[][] img) {
    int rows = img.length;
    int cols = img[0].length;
    // Create result matrix with same dimensions
    int[][] result = new int[rows][cols];

    // All 9 positions in the 3x3 window
    int[][] directions = {
        {-1, -1}, {-1, 0}, {-1, 1},
        {0, -1},  {0, 0},  {0, 1},
        {1, -1},  {1, 0},  {1, 1}
    };

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            int total = 0;  // Sum of valid neighbor values
            int count = 0;  // Number of valid neighbors

            // Check each position in the 3x3 window
            for (int[] dir : directions) {
                int nr = r + dir[0];  // Neighbor row
                int nc = c + dir[1];  // Neighbor column

                // Only include if within matrix bounds
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    total += img[nr][nc];
                    count++;
                }
            }

            // Integer division automatically floors in Java
            result[r][c] = total / count;
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n × 9) = O(m × n)

- We visit each of the m × n cells exactly once
- For each cell, we check up to 9 positions (the 3×3 window)
- The constant factor 9 is dropped in Big O notation, leaving O(m × n)

**Space Complexity:** O(m × n)

- We create a new result matrix of size m × n
- The input matrix is not modified
- Additional space for variables is O(1), dominated by the result matrix

## Common Mistakes

1. **Forgetting to handle edge cases properly**: The most common mistake is not checking bounds when accessing neighbors. Attempting to access `img[-1][0]` or `img[rows][0]` will cause an index error. Always validate that `0 ≤ nr < rows` and `0 ≤ nc < cols` before accessing.

2. **Using floating-point division instead of integer floor division**: The problem specifies "rounding down" the average, which means we need floor division. In Python, `//` does this automatically. In JavaScript, use `Math.floor(total / count)`. In Java, integer division `/` automatically truncates toward zero (which for positive numbers is the same as floor).

3. **Modifying the input matrix in place**: The problem expects a new smoothed image, not a modified original. Creating a separate result matrix ensures we use original values when computing averages for neighboring cells. If you modify in place, later cells will use already-smoothed values from earlier cells.

4. **Incorrect neighbor iteration range**: Some candidates use nested loops from `max(0, r-1)` to `min(rows, r+2)` which is actually correct, but they might make off-by-one errors with the range endpoints. The directions array approach is more explicit and less error-prone.

## When You'll See This Pattern

This problem demonstrates the **convolution filter** pattern, commonly used in image processing and computer vision. You'll encounter similar patterns in:

1. **LeetCode 289: Game of Life** - Uses a similar 3×3 neighborhood to compute next state based on neighbor counts. The key difference is the rules for state transitions.

2. **LeetCode 733: Flood Fill** - While not exactly the same, it involves exploring neighboring cells in a grid, checking bounds, and potentially modifying values based on neighbors.

3. **LeetCode 130: Surrounded Regions** - Involves traversing a grid and checking neighbor relationships, though with different rules for propagation.

4. **Any grid-based simulation** - Problems where each cell's next state depends on its neighbors' current states often use this pattern of checking all positions in a fixed window around each cell.

## Key Takeaways

1. **Fixed-window convolution** is a fundamental pattern for grid problems where each cell's value depends on a local neighborhood. The 3×3 window is common, but the pattern extends to any fixed-size window.

2. **Boundary checking is critical** when working with grid neighborhoods. Always validate array indices before accessing elements, especially when dealing with edges and corners.

3. **Separate result storage** is important when new values depend on original neighbor values. Modifying in place can corrupt the computation for later cells.

4. **The directions array technique** provides a clean, readable way to express neighbor relationships and can be adapted for different neighborhood shapes (4-directional, 8-directional, etc.).

[Practice this problem on CodeJeet](/problem/image-smoother)
