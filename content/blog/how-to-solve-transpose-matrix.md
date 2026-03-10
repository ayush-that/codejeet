---
title: "How to Solve Transpose Matrix — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Transpose Matrix. Easy difficulty, 75.9% acceptance rate. Topics: Array, Matrix, Simulation."
date: "2027-03-15"
category: "dsa-patterns"
tags: ["transpose-matrix", "array", "matrix", "simulation", "easy"]
---

# How to Solve Transpose Matrix

Transposing a matrix is a fundamental operation in linear algebra where we flip a matrix over its main diagonal, effectively swapping its rows and columns. While conceptually simple, this problem tests your ability to work with 2D arrays, handle dimensions correctly, and avoid common indexing pitfalls. The challenge lies in correctly mapping elements from position `[i][j]` to position `[j][i]` while creating a new matrix with swapped dimensions.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider the matrix:

```
Input: matrix = [[1, 2, 3],
                 [4, 5, 6],
                 [7, 8, 9]]
```

This is a 3×3 matrix (3 rows, 3 columns). The transpose operation flips the matrix over its main diagonal (top-left to bottom-right). Visually:

1. Element at position `[0][0]` (value 1) stays at `[0][0]` (on the diagonal)
2. Element at position `[0][1]` (value 2) moves to position `[1][0]`
3. Element at position `[0][2]` (value 3) moves to position `[2][0]`
4. Element at position `[1][0]` (value 4) moves to position `[0][1]`
5. And so on...

The resulting transposed matrix will be:

```
Output: [[1, 4, 7],
         [2, 5, 8],
         [3, 6, 9]]
```

Notice that the dimensions have swapped: the original 3×3 matrix becomes another 3×3 matrix. For a non-square matrix, the dimension change is more apparent:

```
Input: matrix = [[1, 2, 3],
                 [4, 5, 6]]  (2 rows × 3 columns)

Output: [[1, 4],
         [2, 5],
         [3, 6]]  (3 rows × 2 columns)
```

The key insight: if the original matrix has dimensions `m × n` (m rows, n columns), the transposed matrix will have dimensions `n × m` (n rows, m columns).

## Brute Force Approach

The most straightforward approach is to create a new matrix with swapped dimensions and copy each element from the original position `[i][j]` to the new position `[j][i]`. While this is actually the optimal solution for this problem (since we must examine every element at least once), let's think about what a truly naive approach might look like.

A candidate might try to perform the transpose in-place (without creating a new matrix) for a square matrix by swapping elements across the diagonal. However, this approach fails for rectangular matrices (non-square matrices) because the dimensions change. Even for square matrices, you must be careful to only swap each pair once (not twice), which means only processing elements above or below the diagonal.

The brute force approach that works for all cases is simply:

1. Determine the dimensions of the input matrix
2. Create a new matrix with swapped dimensions
3. Iterate through each element and place it in the transposed position

This approach is actually optimal because we must visit every element at least once to read its value, and we need to create a new matrix to store the result (unless we're allowed to modify the input, which we're not in this problem).

## Optimal Solution

The optimal solution follows the brute force approach described above. We create a new matrix where the number of rows equals the number of columns in the original, and the number of columns equals the number of rows in the original. Then we iterate through each element of the original matrix and place it at the transposed position in the new matrix.

<div class="code-group">

```python
# Time: O(m * n) where m = rows, n = columns
# Space: O(m * n) for the output matrix
def transpose(matrix):
    # Get dimensions of the input matrix
    rows = len(matrix)      # Number of rows in original
    cols = len(matrix[0])   # Number of columns in original

    # Create result matrix with swapped dimensions
    # Original: rows × cols → Transposed: cols × rows
    result = [[0] * rows for _ in range(cols)]

    # Iterate through each element in the original matrix
    for i in range(rows):
        for j in range(cols):
            # Place element at [i][j] to position [j][i] in result
            result[j][i] = matrix[i][j]

    return result
```

```javascript
// Time: O(m * n) where m = rows, n = columns
// Space: O(m * n) for the output matrix
function transpose(matrix) {
  // Get dimensions of the input matrix
  const rows = matrix.length; // Number of rows in original
  const cols = matrix[0].length; // Number of columns in original

  // Create result matrix with swapped dimensions
  // Original: rows × cols → Transposed: cols × rows
  const result = new Array(cols);
  for (let i = 0; i < cols; i++) {
    result[i] = new Array(rows);
  }

  // Iterate through each element in the original matrix
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Place element at [i][j] to position [j][i] in result
      result[j][i] = matrix[i][j];
    }
  }

  return result;
}
```

```java
// Time: O(m * n) where m = rows, n = columns
// Space: O(m * n) for the output matrix
public int[][] transpose(int[][] matrix) {
    // Get dimensions of the input matrix
    int rows = matrix.length;      // Number of rows in original
    int cols = matrix[0].length;   // Number of columns in original

    // Create result matrix with swapped dimensions
    // Original: rows × cols → Transposed: cols × rows
    int[][] result = new int[cols][rows];

    // Iterate through each element in the original matrix
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            // Place element at [i][j] to position [j][i] in result
            result[j][i] = matrix[i][j];
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n), where m is the number of rows and n is the number of columns in the input matrix. We must visit every element exactly once to read its value and write it to the new matrix. This is optimal because any algorithm must at least read all elements.

**Space Complexity:** O(m × n) for the output matrix. We create a new matrix with dimensions n × m to store the result. The space used by the input matrix doesn't count toward our space complexity (unless we're doing an in-place operation, which we're not). We use only O(1) additional space beyond the output.

## Common Mistakes

1. **Incorrect dimension calculation for the result matrix:** The most common mistake is creating a result matrix with the same dimensions as the input. Remember: if the input is m × n, the output should be n × m. Always double-check that you're using `cols` as the number of rows and `rows` as the number of columns in the result.

2. **Index out of bounds errors:** When accessing `matrix[i][j]` and assigning to `result[j][i]`, it's easy to reverse the indices accidentally. A good sanity check: the first index should always be less than the length of that dimension. If `i` goes from 0 to `rows-1`, then `i` can only be the first index of `matrix` (which has `rows` elements) and the second index of `result` (which has `rows` columns).

3. **Assuming square matrices:** Many candidates practice only with square matrices and then fail when presented with rectangular ones. Always test your solution with both square (e.g., 3×3) and non-square (e.g., 2×4 or 5×2) matrices.

4. **Forgetting to handle empty matrix:** While the problem constraints typically guarantee at least one row and column, it's good practice to check for edge cases. What if `matrix = []` or `matrix = [[]]`? A robust solution would handle these cases gracefully.

## When You'll See This Pattern

The transpose operation and similar 2D array manipulation patterns appear in several types of problems:

1. **Matrix rotation problems:** Problems like [Rotate Image](https://leetcode.com/problems/rotate-image/) often involve transposition as one step in the rotation process. For example, rotating a matrix 90 degrees clockwise can be achieved by transposing and then reversing each row.

2. **Grid-based algorithms:** In problems like [Valid Sudoku](https://leetcode.com/problems/valid-sudoku/) or [Game of Life](https://leetcode.com/problems/game-of-life/), you often need to process columns as if they were rows. The transpose pattern helps you think about accessing data in different orientations.

3. **Linear algebra operations:** Any problem involving matrix multiplication, determinants, or other linear algebra concepts may require transposition. For instance, when multiplying matrices A and B, you might need to access columns of B as rows.

4. **String/character grid problems:** Problems that involve searching for words in a grid or comparing rows and columns often benefit from thinking about transposed representations.

## Key Takeaways

1. **Dimension swapping is the core concept:** When transposing a matrix, the number of rows becomes the number of columns and vice versa. Always create your result matrix with dimensions `[cols][rows]` for an input of `[rows][cols]`.

2. **The mapping is consistent:** Every element at position `[i][j]` in the original moves to position `[j][i]` in the result. This simple rule works for all matrices, square or rectangular.

3. **Practice with different shapes:** Don't just test with square matrices. Try 2×3, 3×2, 1×5, and 4×1 matrices to ensure your solution handles all cases correctly.

4. **This is a building block:** Matrix transposition is rarely an end goal but often a step in more complex algorithms. Understanding it thoroughly will help you solve more advanced matrix manipulation problems.

[Practice this problem on CodeJeet](/problem/transpose-matrix)
