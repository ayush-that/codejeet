---
title: "How to Solve Largest Local Values in a Matrix — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Largest Local Values in a Matrix. Easy difficulty, 87.7% acceptance rate. Topics: Array, Matrix."
date: "2028-10-21"
category: "dsa-patterns"
tags: ["largest-local-values-in-a-matrix", "array", "matrix", "easy"]
---

# How to Solve Largest Local Values in a Matrix

This problem asks us to generate a new matrix where each cell contains the maximum value from a 3×3 submatrix in the original grid. While conceptually straightforward, it requires careful handling of indices and boundary conditions when sliding the window across the matrix. The challenge lies in correctly mapping between the original grid coordinates and the output matrix positions without off-by-one errors.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this 4×4 grid:

```
grid = [
    [9, 2, 3, 4],
    [5, 6, 7, 8],
    [1, 2, 3, 4],
    [5, 6, 7, 8]
]
```

We need to create a `(4-2) × (4-2) = 2×2` output matrix. Let's find each value step by step:

1. **Top-left 3×3 submatrix** (centered at row 1, column 1):

   ```
   9 2 3
   5 6 7
   1 2 3
   ```

   Maximum value = 9 → `maxLocal[0][0] = 9`

2. **Top-right 3×3 submatrix** (centered at row 1, column 2):

   ```
   2 3 4
   6 7 8
   2 3 4
   ```

   Maximum value = 8 → `maxLocal[0][1] = 8`

3. **Bottom-left 3×3 submatrix** (centered at row 2, column 1):

   ```
   5 6 7
   1 2 3
   5 6 7
   ```

   Maximum value = 7 → `maxLocal[1][0] = 7`

4. **Bottom-right 3×3 submatrix** (centered at row 2, column 2):
   ```
   6 7 8
   2 3 4
   6 7 8
   ```
   Maximum value = 8 → `maxLocal[1][1] = 8`

Final output: `[[9, 8], [7, 8]]`

Notice that for an `n×n` grid, we have `(n-2)×(n-2)` possible 3×3 submatrices. The submatrix starting at position `(i, j)` in the original grid corresponds to position `(i, j)` in the output matrix.

## Brute Force Approach

The most straightforward approach is to iterate through all possible starting positions for 3×3 submatrices and find the maximum value in each. For each position `(i, j)` in the output matrix (where `0 ≤ i, j < n-2`), we examine the 3×3 block in the original grid starting at `(i, j)`.

While this is actually the optimal approach for this problem (since we must examine every element in every 3×3 submatrix), some candidates might try to optimize prematurely or make the implementation more complex than necessary. The key insight is that we need to check all 9 elements for each of the `(n-2)×(n-2)` positions, giving us `O(n²)` time complexity.

## Optimal Solution

The optimal solution directly implements the brute force approach with careful index management. We create an `(n-2)×(n-2)` output matrix, then for each cell in this output, we find the maximum value in the corresponding 3×3 submatrix of the original grid.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²) for the output matrix
def largestLocal(grid):
    """
    Find the largest value in each 3x3 submatrix of the grid.

    Args:
        grid: List[List[int]] - n x n matrix

    Returns:
        List[List[int]] - (n-2) x (n-2) matrix of local maxima
    """
    n = len(grid)
    # Initialize the result matrix with dimensions (n-2) x (n-2)
    maxLocal = [[0] * (n - 2) for _ in range(n - 2)]

    # Iterate through all possible starting positions for 3x3 submatrices
    # i and j represent the top-left corner of the current 3x3 window
    for i in range(n - 2):
        for j in range(n - 2):
            # Initialize max value for current 3x3 window
            current_max = 0

            # Check all 9 cells in the 3x3 submatrix
            for x in range(3):
                for y in range(3):
                    # Update current_max if we find a larger value
                    # grid[i + x][j + y] accesses the cell in the original grid
                    current_max = max(current_max, grid[i + x][j + y])

            # Store the maximum value for this window in the result matrix
            maxLocal[i][j] = current_max

    return maxLocal
```

```javascript
// Time: O(n²) | Space: O(n²) for the output matrix
function largestLocal(grid) {
  /**
   * Find the largest value in each 3x3 submatrix of the grid.
   *
   * @param {number[][]} grid - n x n matrix
   * @return {number[][]} - (n-2) x (n-2) matrix of local maxima
   */
  const n = grid.length;
  // Initialize the result matrix with dimensions (n-2) x (n-2)
  const maxLocal = Array.from({ length: n - 2 }, () => new Array(n - 2).fill(0));

  // Iterate through all possible starting positions for 3x3 submatrices
  // i and j represent the top-left corner of the current 3x3 window
  for (let i = 0; i < n - 2; i++) {
    for (let j = 0; j < n - 2; j++) {
      // Initialize max value for current 3x3 window
      let currentMax = 0;

      // Check all 9 cells in the 3x3 submatrix
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          // Update currentMax if we find a larger value
          // grid[i + x][j + y] accesses the cell in the original grid
          currentMax = Math.max(currentMax, grid[i + x][j + y]);
        }
      }

      // Store the maximum value for this window in the result matrix
      maxLocal[i][j] = currentMax;
    }
  }

  return maxLocal;
}
```

```java
// Time: O(n²) | Space: O(n²) for the output matrix
class Solution {
    public int[][] largestLocal(int[][] grid) {
        /**
         * Find the largest value in each 3x3 submatrix of the grid.
         *
         * @param grid - n x n matrix
         * @return - (n-2) x (n-2) matrix of local maxima
         */
        int n = grid.length;
        // Initialize the result matrix with dimensions (n-2) x (n-2)
        int[][] maxLocal = new int[n - 2][n - 2];

        // Iterate through all possible starting positions for 3x3 submatrices
        // i and j represent the top-left corner of the current 3x3 window
        for (int i = 0; i < n - 2; i++) {
            for (int j = 0; j < n - 2; j++) {
                // Initialize max value for current 3x3 window
                int currentMax = 0;

                // Check all 9 cells in the 3x3 submatrix
                for (int x = 0; x < 3; x++) {
                    for (int y = 0; y < 3; y++) {
                        // Update currentMax if we find a larger value
                        // grid[i + x][j + y] accesses the cell in the original grid
                        currentMax = Math.max(currentMax, grid[i + x][j + y]);
                    }
                }

                // Store the maximum value for this window in the result matrix
                maxLocal[i][j] = currentMax;
            }
        }

        return maxLocal;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)  
We iterate through `(n-2)×(n-2)` positions in the output matrix. For each position, we examine 9 cells (constant time). This gives us `O((n-2)² × 9) = O(n²)` time complexity.

**Space Complexity:** O(n²)  
We need to store the output matrix of size `(n-2)×(n-2)`, which is `O(n²)` space. The algorithm itself uses only constant extra space beyond the output.

## Common Mistakes

1. **Off-by-one errors in loop boundaries:** The most common mistake is using `n` instead of `n-2` for the outer loops. Remember: for an `n×n` grid, there are only `n-2` possible starting positions for 3×3 windows in each dimension.

2. **Incorrect index mapping between input and output:** Some candidates try to use `i+1` and `j+1` as described in the problem statement ("centered around row i+1 and column j+1"), but this is unnecessary. The simpler approach is to treat `(i, j)` as the top-left corner of the 3×3 window.

3. **Forgetting to initialize the maximum value properly:** If you initialize `current_max` to 0 and the grid contains only negative numbers, you'll get incorrect results. A safer approach is to initialize with `grid[i][j]` or `Integer.MIN_VALUE`. However, since the problem constraints don't specify value ranges, initializing to 0 works for the given test cases.

4. **Creating the output matrix with wrong dimensions:** Using `[[0] * (n - 2)] * (n - 2)` in Python creates shallow copies that reference the same list. Always use list comprehension: `[[0] * (n - 2) for _ in range(n - 2)]`.

## When You'll See This Pattern

This problem demonstrates the **sliding window over a 2D grid** pattern, which appears in various forms:

1. **Image Processing Filters:** Many image processing operations (blur, edge detection, sharpening) apply a kernel (small matrix) to every position in an image, similar to how we apply a 3×3 window here.

2. **Convolution in Neural Networks:** Convolutional layers in CNNs slide filters across input matrices, computing dot products at each position.

3. **Related LeetCode Problems:**
   - **#661 Image Smoother**: Instead of finding the maximum, you find the average of each 3×3 window.
   - **#48 Rotate Image**: Involves careful index manipulation in a matrix.
   - **#73 Set Matrix Zeroes**: Requires traversing and modifying a matrix based on certain conditions.

## Key Takeaways

1. **Sliding window in 2D:** When you need to apply an operation to every possible submatrix of fixed size, use nested loops where the outer loops control the starting position and inner loops iterate through the submatrix.

2. **Index mapping is key:** Pay close attention to how indices map between the original grid and the output. Drawing a small example on paper helps avoid off-by-one errors.

3. **Constant-size windows simplify complexity:** When the window size is fixed (like 3×3), the time complexity for processing each window is O(1), making the overall complexity O(n²) for an n×n grid.

[Practice this problem on CodeJeet](/problem/largest-local-values-in-a-matrix)
