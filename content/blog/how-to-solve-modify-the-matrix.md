---
title: "How to Solve Modify the Matrix — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Modify the Matrix. Easy difficulty, 69.0% acceptance rate. Topics: Array, Matrix."
date: "2028-05-19"
category: "dsa-patterns"
tags: ["modify-the-matrix", "array", "matrix", "easy"]
---

# How to Solve Modify the Matrix

This problem asks us to create a modified version of a given matrix where all `-1` values are replaced with the maximum value from their respective columns. While conceptually straightforward, it requires careful handling of matrix traversal and column-wise maximum calculations. The main challenge is efficiently computing column maximums while avoiding unnecessary recomputation.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input matrix:**

```
[ [1, 2, -1],
  [4, -1, 6],
  [7, 8, 9] ]
```

**Step 1: Identify column maximums**

- Column 0: max(1, 4, 7) = 7
- Column 1: max(2, -1, 8) = 8
- Column 2: max(-1, 6, 9) = 9

**Step 2: Create answer matrix (copy of input)**

```
[ [1, 2, -1],
  [4, -1, 6],
  [7, 8, 9] ]
```

**Step 3: Replace -1 values with column maximums**

- Row 0, Col 2: -1 → 9 (column 2 max)
- Row 1, Col 1: -1 → 8 (column 1 max)

**Final answer:**

```
[ [1, 2, 9],
  [4, 8, 6],
  [7, 8, 9] ]
```

The key insight is that we need to compute column maximums first, then use them to replace the `-1` values.

## Brute Force Approach

A naive approach would be to process each `-1` value independently: for each `-1`, scan its entire column to find the maximum, then replace it. This leads to significant inefficiency.

**Why it's inefficient:**

- For each `-1` in a column, we're recomputing the same column maximum
- In the worst case (all values are `-1`), we'd scan each column `m` times (once per row)
- Time complexity: O(m² × n) where m = rows, n = columns
- This is wasteful because column maximums don't change between replacements

While this brute force would technically work, it's inefficient for larger matrices. The optimal approach precomputes column maximums once.

## Optimal Solution

The optimal solution has two clear phases:

1. **Precomputation phase:** Calculate the maximum value for each column
2. **Replacement phase:** Create the answer matrix and replace all `-1` values with their column's precomputed maximum

We need to be careful to exclude `-1` values when calculating column maximums, as the problem states we should replace `-1` with the maximum element in the column (which means the maximum among non-`-1` values).

<div class="code-group">

```python
# Time: O(m × n) | Space: O(n) for storing column maximums
def modifiedMatrix(matrix):
    """
    Replace all -1 values with the maximum value in their respective column.

    Args:
        matrix: List[List[int]] - input matrix

    Returns:
        List[List[int]] - modified matrix with -1 replaced by column maximum
    """
    m = len(matrix)      # Number of rows
    n = len(matrix[0])   # Number of columns

    # Step 1: Initialize column maximums with -infinity
    # We use -inf to handle cases where all values in a column might be -1
    col_max = [float('-inf')] * n

    # Step 2: Compute maximum for each column (excluding -1 values)
    for col in range(n):
        for row in range(m):
            # Only consider non-negative values for maximum calculation
            if matrix[row][col] != -1:
                col_max[col] = max(col_max[col], matrix[row][col])

    # Step 3: Create answer matrix and replace -1 values
    answer = [[0] * n for _ in range(m)]

    for row in range(m):
        for col in range(n):
            if matrix[row][col] == -1:
                # If all values in column were -1, keep -1 (edge case)
                answer[row][col] = col_max[col] if col_max[col] != float('-inf') else -1
            else:
                answer[row][col] = matrix[row][col]

    return answer
```

```javascript
// Time: O(m × n) | Space: O(n) for storing column maximums
/**
 * Replace all -1 values with the maximum value in their respective column.
 *
 * @param {number[][]} matrix - Input matrix
 * @return {number[][]} - Modified matrix with -1 replaced by column maximum
 */
function modifiedMatrix(matrix) {
  const m = matrix.length; // Number of rows
  const n = matrix[0].length; // Number of columns

  // Step 1: Initialize column maximums with -Infinity
  // We use -Infinity to handle cases where all values in a column might be -1
  const colMax = new Array(n).fill(-Infinity);

  // Step 2: Compute maximum for each column (excluding -1 values)
  for (let col = 0; col < n; col++) {
    for (let row = 0; row < m; row++) {
      // Only consider non-negative values for maximum calculation
      if (matrix[row][col] !== -1) {
        colMax[col] = Math.max(colMax[col], matrix[row][col]);
      }
    }
  }

  // Step 3: Create answer matrix and replace -1 values
  const answer = new Array(m);
  for (let row = 0; row < m; row++) {
    answer[row] = new Array(n);
    for (let col = 0; col < n; col++) {
      if (matrix[row][col] === -1) {
        // If all values in column were -1, keep -1 (edge case)
        answer[row][col] = colMax[col] !== -Infinity ? colMax[col] : -1;
      } else {
        answer[row][col] = matrix[row][col];
      }
    }
  }

  return answer;
}
```

```java
// Time: O(m × n) | Space: O(n) for storing column maximums
import java.util.Arrays;

class Solution {
    /**
     * Replace all -1 values with the maximum value in their respective column.
     *
     * @param matrix Input matrix
     * @return Modified matrix with -1 replaced by column maximum
     */
    public int[][] modifiedMatrix(int[][] matrix) {
        int m = matrix.length;      // Number of rows
        int n = matrix[0].length;   // Number of columns

        // Step 1: Initialize column maximums with minimum integer value
        // We use Integer.MIN_VALUE to handle cases where all values in a column might be -1
        int[] colMax = new int[n];
        Arrays.fill(colMax, Integer.MIN_VALUE);

        // Step 2: Compute maximum for each column (excluding -1 values)
        for (int col = 0; col < n; col++) {
            for (int row = 0; row < m; row++) {
                // Only consider non-negative values for maximum calculation
                if (matrix[row][col] != -1) {
                    colMax[col] = Math.max(colMax[col], matrix[row][col]);
                }
            }
        }

        // Step 3: Create answer matrix and replace -1 values
        int[][] answer = new int[m][n];

        for (int row = 0; row < m; row++) {
            for (int col = 0; col < n; col++) {
                if (matrix[row][col] == -1) {
                    // If all values in column were -1, keep -1 (edge case)
                    answer[row][col] = colMax[col] != Integer.MIN_VALUE ? colMax[col] : -1;
                } else {
                    answer[row][col] = matrix[row][col];
                }
            }
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We make two complete passes through the matrix
- First pass: O(m × n) to compute column maximums
- Second pass: O(m × n) to create the answer matrix and replace `-1` values
- Total: O(2 × m × n) = O(m × n)

**Space Complexity: O(n)**

- We store column maximums in an array of size `n`
- The answer matrix is required by the problem, so we don't count it toward auxiliary space
- If we modified the matrix in-place, we could achieve O(1) extra space, but the problem asks for a new matrix

## Common Mistakes

1. **Including -1 in maximum calculations:** The most common error is including `-1` when calculating column maximums. Remember: we need to find the maximum among non-`-1` values in each column, then use that to replace `-1` values.

2. **Not handling all-negative columns:** What if all values in a column are `-1`? Our maximum calculation would find no valid values. We need to handle this edge case by either keeping `-1` or using a default value. The solution above handles this by checking if the column maximum is still the initial value.

3. **Modifying the input matrix:** The problem asks us to return a new matrix `answer`, not modify the input. Some candidates modify the input directly, which could cause issues if the input needs to be preserved elsewhere.

4. **Incorrect indexing in nested loops:** When accessing `matrix[row][col]`, it's easy to accidentally swap row and column indices. Remember: the first index is the row (vertical position), the second is the column (horizontal position).

## When You'll See This Pattern

This problem demonstrates the **column-wise aggregation** pattern, which appears in many matrix problems:

1. **Transpose Matrix (LeetCode 867):** Requires understanding of row-column relationships when converting a matrix to its transpose.

2. **Rotate Image (LeetCode 48):** Involves careful manipulation of matrix elements based on their positions, often requiring column-wise operations.

3. **Set Matrix Zeroes (LeetCode 73):** Similar preprocessing approach where you first identify which rows and columns need to be zeroed, then apply the changes.

4. **Matrix Diagonal Sum (LeetCode 1572):** Requires traversing the matrix in specific patterns (diagonals) rather than rows or columns.

The core technique of precomputing column (or row) statistics before processing individual elements is useful whenever you need to make decisions based on aggregate information from an entire dimension.

## Key Takeaways

1. **Precomputation is powerful:** When you need to make the same calculation repeatedly (like finding column maximums), compute it once and store the results. This transforms O(m² × n) time to O(m × n).

2. **Separate concerns in algorithm design:** Break the problem into clear phases: data collection (find column maximums) and data transformation (replace -1 values). This makes the code cleaner and easier to debug.

3. **Watch for edge cases:** Always consider boundary conditions like empty matrices, single-row/column matrices, and special values (like all -1 in a column). Test with small, diverse examples before finalizing your solution.

[Practice this problem on CodeJeet](/problem/modify-the-matrix)
