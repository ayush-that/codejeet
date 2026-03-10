---
title: "How to Solve Toeplitz Matrix — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Toeplitz Matrix. Easy difficulty, 69.7% acceptance rate. Topics: Array, Matrix."
date: "2027-06-12"
category: "dsa-patterns"
tags: ["toeplitz-matrix", "array", "matrix", "easy"]
---

# How to Solve Toeplitz Matrix

A Toeplitz matrix requires that every diagonal from top-left to bottom-right contains the same element. While this problem seems straightforward, the challenge lies in efficiently checking all diagonals without redundant comparisons or complex indexing errors. The interesting part is recognizing that we only need to compare each element with its top-left neighbor—a simple insight that leads to an elegant O(mn) time, O(1) space solution.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
matrix = [
  [1, 2, 3, 4],
  [5, 1, 2, 3],
  [9, 5, 1, 2]
]
```

A Toeplitz matrix requires that every diagonal has identical elements. Let's examine the diagonals:

1. Main diagonal (top-left to bottom-right): `[1, 1, 1]` ✓ All equal
2. Next diagonal: `[2, 2, 2]` ✓ All equal
3. Next diagonal: `[3, 3]` ✓ All equal
4. Next diagonal: `[4]` ✓ (single element)
5. Below main diagonal: `[5, 5]` ✓ All equal
6. Below that: `[9]` ✓ (single element)

The key insight: For any element at position `(i, j)`, it should equal the element at `(i-1, j-1)` (if both exist). Let's verify:

- Element at `(1, 1)` = 1 should equal element at `(0, 0)` = 1 ✓
- Element at `(1, 2)` = 2 should equal element at `(0, 1)` = 2 ✓
- Element at `(1, 3)` = 3 should equal element at `(0, 2)` = 3 ✓
- Element at `(2, 1)` = 5 should equal element at `(1, 0)` = 5 ✓
- Element at `(2, 2)` = 1 should equal element at `(1, 1)` = 1 ✓
- Element at `(2, 3)` = 2 should equal element at `(1, 2)` = 2 ✓

This pattern holds for all elements except those in the first row or first column (which have no top-left neighbor to compare with). Therefore, we only need to check elements starting from the second row and second column.

## Brute Force Approach

A naive approach would be to explicitly check each diagonal separately. For an `m x n` matrix, there are `m + n - 1` diagonals. For each diagonal, we could collect all its elements and verify they're all equal.

Why this is inefficient:

1. **Redundant comparisons**: Elements get compared multiple times
2. **Complex indexing**: Calculating diagonal coordinates is error-prone
3. **Extra space**: We need to store elements of each diagonal to compare them
4. **Time complexity**: O(m × n × min(m, n)) in worst case if implemented poorly

While this brute force would technically work, it's unnecessarily complex and less efficient than the optimal solution. Interviewers expect you to recognize the simpler pattern.

## Optimal Solution

The optimal solution leverages the observation that each element should equal its top-left neighbor. We iterate through the matrix starting from the second row and second column, comparing each element with the one diagonally above-left. If any comparison fails, the matrix isn't Toeplitz.

<div class="code-group">

```python
# Time: O(m × n) | Space: O(1)
def isToeplitzMatrix(matrix):
    """
    Check if a matrix is Toeplitz (all diagonals have same elements).

    Args:
        matrix: List of lists representing the matrix

    Returns:
        bool: True if matrix is Toeplitz, False otherwise
    """
    # Get dimensions of the matrix
    rows = len(matrix)
    cols = len(matrix[0])

    # Iterate through all elements except those in first row and first column
    for i in range(1, rows):
        for j in range(1, cols):
            # Compare current element with its top-left neighbor
            if matrix[i][j] != matrix[i-1][j-1]:
                return False

    # All comparisons passed, matrix is Toeplitz
    return True
```

```javascript
// Time: O(m × n) | Space: O(1)
function isToeplitzMatrix(matrix) {
  /**
   * Check if a matrix is Toeplitz (all diagonals have same elements).
   *
   * @param {number[][]} matrix - The matrix to check
   * @return {boolean} True if matrix is Toeplitz, False otherwise
   */
  // Get dimensions of the matrix
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Iterate through all elements except those in first row and first column
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      // Compare current element with its top-left neighbor
      if (matrix[i][j] !== matrix[i - 1][j - 1]) {
        return false;
      }
    }
  }

  // All comparisons passed, matrix is Toeplitz
  return true;
}
```

```java
// Time: O(m × n) | Space: O(1)
class Solution {
    public boolean isToeplitzMatrix(int[][] matrix) {
        /**
         * Check if a matrix is Toeplitz (all diagonals have same elements).
         *
         * @param matrix The matrix to check
         * @return True if matrix is Toeplitz, False otherwise
         */
        // Get dimensions of the matrix
        int rows = matrix.length;
        int cols = matrix[0].length;

        // Iterate through all elements except those in first row and first column
        for (int i = 1; i < rows; i++) {
            for (int j = 1; j < cols; j++) {
                // Compare current element with its top-left neighbor
                if (matrix[i][j] != matrix[i-1][j-1]) {
                    return false;
                }
            }
        }

        // All comparisons passed, matrix is Toeplitz
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We iterate through each element of the matrix exactly once (except the first row and first column)
- For an `m × n` matrix, we perform `(m-1) × (n-1)` comparisons
- In big O notation, this simplifies to O(m × n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space
- No additional data structures are created
- The space used doesn't grow with input size

This is optimal because we must examine every element at least once to verify the Toeplitz property, giving us a lower bound of Ω(m × n) time.

## Common Mistakes

1. **Starting from the wrong indices**: Beginners often start loops from `i = 0` and `j = 0`, then try to access `matrix[i-1][j-1]` which causes index out of bounds errors. Remember: we can only compare with top-left neighbor when both `i > 0` AND `j > 0`.

2. **Incorrect loop boundaries**: Using `i <= rows` instead of `i < rows` is a classic off-by-one error. Python and JavaScript use 0-based indexing, so valid indices are `0` to `rows-1`.

3. **Not handling edge cases**:
   - Single row matrix: Should return `True` (all elements are on their own diagonals)
   - Single column matrix: Should return `True` (same reasoning)
   - Empty matrix: Check if this is a valid input based on problem constraints

4. **Comparing wrong elements**: Some candidates compare `matrix[i][j]` with `matrix[i+1][j+1]` (bottom-right neighbor) instead of top-left. This works but requires different loop boundaries and is less intuitive.

## When You'll See This Pattern

The "compare with neighbor" pattern appears in many matrix problems:

1. **Valid Sudoku (Medium)**: Check rows, columns, and 3x3 sub-boxes for duplicates. Similar neighbor-checking logic within constraints.

2. **Game of Life (Medium)**: Each cell's next state depends on its eight neighbors. Requires careful boundary handling when checking neighboring cells.

3. **Island Perimeter (Easy)**: Calculate perimeter by checking each land cell's neighbors to determine how many sides are exposed to water.

The common thread is using relative positions (offsets like `[-1, -1]`, `[0, -1]`, `[1, 0]`, etc.) to examine relationships between matrix elements without complex coordinate calculations.

## Key Takeaways

1. **Look for local relationships**: Many matrix problems can be solved by examining how each element relates to its immediate neighbors rather than processing entire rows, columns, or diagonals separately.

2. **Boundary awareness is critical**: When checking neighbors, always verify indices are within bounds before accessing. Starting loops from `1` instead of `0` is a clean way to avoid negative indices.

3. **Simple is often optimal**: The most elegant solution (comparing each element with its top-left neighbor) emerged from understanding the problem's core property rather than implementing the most obvious algorithm.

Related problems: [Valid Word Square](/problem/valid-word-square)
