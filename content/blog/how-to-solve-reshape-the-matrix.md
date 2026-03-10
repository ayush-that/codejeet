---
title: "How to Solve Reshape the Matrix — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Reshape the Matrix. Easy difficulty, 64.7% acceptance rate. Topics: Array, Matrix, Simulation."
date: "2027-06-03"
category: "dsa-patterns"
tags: ["reshape-the-matrix", "array", "matrix", "simulation", "easy"]
---

# How to Solve Reshape the Matrix

Reshaping a matrix involves rearranging its elements into a new grid with different dimensions while preserving the original row-major order. The challenge lies in correctly mapping each element from the original matrix to its new position, especially when the total number of elements doesn't match—in which case we must return the original matrix. This problem tests your understanding of 2D array indexing and element traversal.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have:

- Original matrix: `mat = [[1, 2, 3], [4, 5, 6]]` (2×3, total 6 elements)
- Target dimensions: `r = 3`, `c = 2` (3×2, total 6 elements)

Since 2×3 = 6 and 3×2 = 6, reshaping is possible. We need to read elements in row-major order (left to right, top to bottom) from the original matrix and place them into the new matrix in the same order.

**Step-by-step mapping:**

1. Original order: 1, 2, 3, 4, 5, 6
2. New matrix construction:
   - Row 0, Col 0: 1
   - Row 0, Col 1: 2
   - Row 1, Col 0: 3
   - Row 1, Col 1: 4
   - Row 2, Col 0: 5
   - Row 2, Col 1: 6

Result: `[[1, 2], [3, 4], [5, 6]]`

Now consider an invalid case: `mat = [[1, 2], [3, 4]]` (2×2, total 4 elements) with `r = 1`, `c = 3` (1×3, total 3 elements). Since 4 ≠ 3, we cannot reshape and must return the original matrix.

## Brute Force Approach

A naive approach might involve creating an intermediate 1D array: first flatten the original matrix into a list, then build the new matrix by reading from this list. While this works, it uses extra O(m×n) space unnecessarily.

What makes this approach suboptimal? The problem can be solved with direct index mapping without creating an intermediate array. The brute force solution would:

1. Check if `m * n == r * c`
2. Flatten the matrix into a 1D array
3. Create an empty r×c matrix
4. Fill it by reading from the 1D array

The space complexity is O(m×n) for the intermediate array, but we can achieve O(1) extra space (excluding the output) by calculating positions directly.

## Optimal Solution

The optimal solution uses direct index calculation. Every element in a matrix has a unique position in row-major order. For an m×n matrix, the element at position `(i, j)` is at index `i * n + j` in the flattened representation. Conversely, given a flattened index `k`, we can find its position in an r×c matrix as `(k // c, k % c)`.

We iterate through all elements, calculate their flattened index, then map them to the new matrix. This avoids extra space and runs in linear time.

<div class="code-group">

```python
# Time: O(m * n) - we visit each element exactly once
# Space: O(r * c) for the output matrix, O(1) extra space
def matrixReshape(mat, r, c):
    """
    Reshapes mat to dimensions r x c if possible.

    Args:
        mat: List[List[int]] - original m x n matrix
        r: int - target rows
        c: int - target columns

    Returns:
        Reshaped matrix if possible, otherwise original matrix
    """
    m, n = len(mat), len(mat[0])

    # Step 1: Check if reshape is possible
    # Total elements must match between original and target
    if m * n != r * c:
        return mat  # Cannot reshape, return original

    # Step 2: Initialize result matrix with zeros
    # We'll fill this matrix with values from mat
    result = [[0] * c for _ in range(r)]

    # Step 3: Transfer elements using direct index mapping
    # We'll use a single index to represent position in flattened form
    for i in range(m):
        for j in range(n):
            # Calculate flattened index for current element
            # In row-major order: index = current_row * n + current_col
            flat_index = i * n + j

            # Map flattened index to new matrix coordinates
            # new_row = flat_index // c (integer division)
            # new_col = flat_index % c (remainder)
            new_row = flat_index // c
            new_col = flat_index % c

            # Place element in new matrix
            result[new_row][new_col] = mat[i][j]

    return result
```

```javascript
// Time: O(m * n) - we visit each element exactly once
// Space: O(r * c) for the output matrix, O(1) extra space
function matrixReshape(mat, r, c) {
  /**
   * Reshapes mat to dimensions r x c if possible.
   *
   * @param {number[][]} mat - original m x n matrix
   * @param {number} r - target rows
   * @param {number} c - target columns
   * @return {number[][]} reshaped matrix or original matrix
   */
  const m = mat.length;
  const n = mat[0].length;

  // Step 1: Check if reshape is possible
  // Total elements must match between original and target
  if (m * n !== r * c) {
    return mat; // Cannot reshape, return original
  }

  // Step 2: Initialize result matrix with zeros
  // We'll fill this matrix with values from mat
  const result = new Array(r);
  for (let i = 0; i < r; i++) {
    result[i] = new Array(c).fill(0);
  }

  // Step 3: Transfer elements using direct index mapping
  // We'll use a single index to represent position in flattened form
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Calculate flattened index for current element
      // In row-major order: index = current_row * n + current_col
      const flatIndex = i * n + j;

      // Map flattened index to new matrix coordinates
      // new_row = Math.floor(flatIndex / c) (integer division)
      // new_col = flatIndex % c (remainder)
      const newRow = Math.floor(flatIndex / c);
      const newCol = flatIndex % c;

      // Place element in new matrix
      result[newRow][newCol] = mat[i][j];
    }
  }

  return result;
}
```

```java
// Time: O(m * n) - we visit each element exactly once
// Space: O(r * c) for the output matrix, O(1) extra space
class Solution {
    public int[][] matrixReshape(int[][] mat, int r, int c) {
        /**
         * Reshapes mat to dimensions r x c if possible.
         *
         * @param mat original m x n matrix
         * @param r target rows
         * @param c target columns
         * @return reshaped matrix or original matrix
         */
        int m = mat.length;
        int n = mat[0].length;

        // Step 1: Check if reshape is possible
        // Total elements must match between original and target
        if (m * n != r * c) {
            return mat;  // Cannot reshape, return original
        }

        // Step 2: Initialize result matrix with zeros
        // We'll fill this matrix with values from mat
        int[][] result = new int[r][c];

        // Step 3: Transfer elements using direct index mapping
        // We'll use a single index to represent position in flattened form
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // Calculate flattened index for current element
                // In row-major order: index = current_row * n + current_col
                int flatIndex = i * n + j;

                // Map flattened index to new matrix coordinates
                // new_row = flatIndex / c (integer division)
                // new_col = flatIndex % c (remainder)
                int newRow = flatIndex / c;
                int newCol = flatIndex % c;

                // Place element in new matrix
                result[newRow][newCol] = mat[i][j];
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- We iterate through every element of the original matrix exactly once
- Each iteration performs constant-time operations (arithmetic and assignment)
- The total operations scale linearly with the number of elements

**Space Complexity:** O(r × c) for the output matrix, O(1) extra space

- We allocate a new r×c matrix for the result, which is required by the problem
- Beyond the output, we use only a few integer variables (m, n, flat_index, etc.)
- This is optimal since we must return a new matrix

## Common Mistakes

1. **Forgetting to check if reshaping is possible:** The most common error is proceeding with reshaping without verifying that `m * n == r * c`. Always check this first—if the totals don't match, return the original matrix immediately.

2. **Incorrect index calculation:** When mapping from flattened index to 2D coordinates, candidates sometimes mix up division and modulo operations. Remember: `row = index // columns`, `col = index % columns`. The divisor should always be the number of columns in the target matrix.

3. **Creating unnecessary intermediate arrays:** Some candidates first flatten the matrix into a 1D array, then build the result. This uses O(m×n) extra space unnecessarily. The direct index mapping approach is more space-efficient.

4. **Modifying the input matrix:** The problem doesn't specify whether we can modify the input. Always create a new matrix for the result unless instructed otherwise. This avoids side effects and follows good practice.

## When You'll See This Pattern

This row-major index mapping pattern appears in several matrix and array problems:

1. **Convert 1D Array Into 2D Array (LeetCode 2022):** Essentially the reverse operation—given a 1D array, create a 2D matrix. The same index calculation applies: for element at index `k` in the 1D array, place it at `(k // c, k % c)` in the 2D result.

2. **Transpose Matrix (LeetCode 867):** While not identical, it involves mapping elements from `(i, j)` to `(j, i)`. Understanding 2D index manipulation is key.

3. **Spiral Matrix (LeetCode 54):** More complex traversal, but builds on the fundamental understanding of matrix coordinates and boundaries.

The core technique—converting between 2D coordinates and a flattened 1D index—is fundamental to working with multidimensional arrays in linear memory layouts.

## Key Takeaways

1. **Row-major order is key:** In most programming contexts, 2D arrays are stored in row-major order (all elements of row 0, then row 1, etc.). The formula `index = row * columns + column` converts 2D coordinates to a 1D index.

2. **Direct mapping beats intermediate arrays:** When transforming data between different shapes, look for mathematical relationships between indices rather than creating intermediate data structures.

3. **Always validate dimensions first:** Before attempting any reshaping or transformation between data structures, verify that the total element counts match. This prevents runtime errors and wasted computation.

Related problems: [Convert 1D Array Into 2D Array](/problem/convert-1d-array-into-2d-array)
