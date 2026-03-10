---
title: "How to Solve Cells with Odd Values in a Matrix — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Cells with Odd Values in a Matrix. Easy difficulty, 79.7% acceptance rate. Topics: Array, Math, Simulation."
date: "2026-10-21"
category: "dsa-patterns"
tags: ["cells-with-odd-values-in-a-matrix", "array", "math", "simulation", "easy"]
---

# How to Solve Cells with Odd Values in a Matrix

This problem asks us to track how many cells in a matrix end up with odd values after performing a series of row and column increment operations. While it appears straightforward, the interesting challenge lies in finding an efficient approach that doesn't require actually building and modifying the full matrix when dimensions can be large.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** m = 2, n = 3, indices = [[0,1],[1,1]]

**Initial matrix (2×3):**

```
[0, 0, 0]
[0, 0, 0]
```

**Step 1:** Process indices[0] = [0,1]

- Increment all cells in row 0: `[1, 1, 1]`
- Increment all cells in column 1: `[1, 2, 1]` (first row, second column gets incremented twice)

**Matrix after step 1:**

```
[1, 2, 1]
[0, 1, 0]
```

**Step 2:** Process indices[1] = [1,1]

- Increment all cells in row 1: `[1, 2, 1]` (unchanged)
- Increment all cells in column 1: `[1, 3, 1]` (second row, second column gets incremented twice)

**Matrix after step 2:**

```
[1, 3, 1]
[1, 2, 1]
```

**Count odd values:**

- Row 0: 1 (odd), 3 (odd), 1 (odd) → 3 odds
- Row 1: 1 (odd), 2 (even), 1 (odd) → 2 odds
- **Total:** 5 odd cells

The key insight: A cell at position (r,c) will be odd if the sum of how many times its row was incremented plus how many times its column was incremented is odd. We don't need to track every cell individually!

## Brute Force Approach

The most straightforward approach is to simulate exactly what the problem describes:

1. Create an m×n matrix initialized with zeros
2. For each [ri, ci] in indices:
   - Increment all cells in row ri
   - Increment all cells in column ci
3. Count how many cells have odd values

While this approach is correct and easy to understand, it becomes inefficient for large matrices. Each operation requires O(m + n) time to update a row and column, and with k operations, the total time becomes O(k × (m + n)). For a 10,000×10,000 matrix with 1,000 operations, this would require updating 20 million cells per operation!

<div class="code-group">

```python
# Time: O(k × (m + n) + m × n) | Space: O(m × n)
def oddCellsBruteForce(m, n, indices):
    # Step 1: Initialize matrix with zeros
    matrix = [[0] * n for _ in range(m)]

    # Step 2: Process each operation
    for ri, ci in indices:
        # Increment entire row ri
        for col in range(n):
            matrix[ri][col] += 1

        # Increment entire column ci
        for row in range(m):
            matrix[row][ci] += 1

    # Step 3: Count odd values
    odd_count = 0
    for row in range(m):
        for col in range(n):
            if matrix[row][col] % 2 == 1:
                odd_count += 1

    return odd_count
```

```javascript
// Time: O(k × (m + n) + m × n) | Space: O(m × n)
function oddCellsBruteForce(m, n, indices) {
  // Step 1: Initialize matrix with zeros
  const matrix = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  // Step 2: Process each operation
  for (const [ri, ci] of indices) {
    // Increment entire row ri
    for (let col = 0; col < n; col++) {
      matrix[ri][col]++;
    }

    // Increment entire column ci
    for (let row = 0; row < m; row++) {
      matrix[row][ci]++;
    }
  }

  // Step 3: Count odd values
  let oddCount = 0;
  for (let row = 0; row < m; row++) {
    for (let col = 0; col < n; col++) {
      if (matrix[row][col] % 2 === 1) {
        oddCount++;
      }
    }
  }

  return oddCount;
}
```

```java
// Time: O(k × (m + n) + m × n) | Space: O(m × n)
public int oddCellsBruteForce(int m, int n, int[][] indices) {
    // Step 1: Initialize matrix with zeros
    int[][] matrix = new int[m][n];

    // Step 2: Process each operation
    for (int[] index : indices) {
        int ri = index[0];
        int ci = index[1];

        // Increment entire row ri
        for (int col = 0; col < n; col++) {
            matrix[ri][col]++;
        }

        // Increment entire column ci
        for (int row = 0; row < m; row++) {
            matrix[row][ci]++;
        }
    }

    // Step 3: Count odd values
    int oddCount = 0;
    for (int row = 0; row < m; row++) {
        for (int col = 0; col < n; col++) {
            if (matrix[row][col] % 2 == 1) {
                oddCount++;
            }
        }
    }

    return oddCount;
}
```

</div>

## Optimal Solution

The key optimization comes from recognizing that we don't need to track every cell's value. Instead, we can track:

1. How many times each row has been incremented
2. How many times each column has been incremented
3. A cell (r,c) will be odd if (row_increments[r] + col_increments[c]) is odd

This reduces our space from O(m×n) to O(m+n) and our time from O(k×(m+n) + m×n) to O(k + m×n).

<div class="code-group">

```python
# Time: O(k + m × n) | Space: O(m + n)
def oddCells(m, n, indices):
    """
    Counts how many cells in an m×n matrix end up with odd values
    after performing row and column increment operations.

    Args:
        m: Number of rows in the matrix
        n: Number of columns in the matrix
        indices: List of [row_index, column_index] operations

    Returns:
        Count of cells with odd values
    """
    # Step 1: Track how many times each row and column is incremented
    row_counts = [0] * m  # Tracks increment count for each row
    col_counts = [0] * n  # Tracks increment count for each column

    # Step 2: Process all operations
    # For each [ri, ci], increment the corresponding row and column counters
    for ri, ci in indices:
        row_counts[ri] += 1
        col_counts[ci] += 1

    # Step 3: Count odd cells
    odd_count = 0

    # For each cell (r,c), it's odd if (row_counts[r] + col_counts[c]) is odd
    for r in range(m):
        for c in range(n):
            # Check if sum is odd using bitwise AND for efficiency
            if (row_counts[r] + col_counts[c]) & 1:
                odd_count += 1

    return odd_count
```

```javascript
// Time: O(k + m × n) | Space: O(m + n)
function oddCells(m, n, indices) {
  /**
   * Counts how many cells in an m×n matrix end up with odd values
   * after performing row and column increment operations.
   *
   * @param {number} m - Number of rows in the matrix
   * @param {number} n - Number of columns in the matrix
   * @param {number[][]} indices - Array of [row_index, column_index] operations
   * @return {number} Count of cells with odd values
   */

  // Step 1: Track how many times each row and column is incremented
  const rowCounts = new Array(m).fill(0); // Tracks increment count for each row
  const colCounts = new Array(n).fill(0); // Tracks increment count for each column

  // Step 2: Process all operations
  // For each [ri, ci], increment the corresponding row and column counters
  for (const [ri, ci] of indices) {
    rowCounts[ri]++;
    colCounts[ci]++;
  }

  // Step 3: Count odd cells
  let oddCount = 0;

  // For each cell (r,c), it's odd if (rowCounts[r] + colCounts[c]) is odd
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      // Check if sum is odd using bitwise AND for efficiency
      if ((rowCounts[r] + colCounts[c]) & 1) {
        oddCount++;
      }
    }
  }

  return oddCount;
}
```

```java
// Time: O(k + m × n) | Space: O(m + n)
public int oddCells(int m, int n, int[][] indices) {
    /**
     * Counts how many cells in an m×n matrix end up with odd values
     * after performing row and column increment operations.
     *
     * @param m Number of rows in the matrix
     * @param n Number of columns in the matrix
     * @param indices Array of [row_index, column_index] operations
     * @return Count of cells with odd values
     */

    // Step 1: Track how many times each row and column is incremented
    int[] rowCounts = new int[m];  // Tracks increment count for each row
    int[] colCounts = new int[n];  // Tracks increment count for each column

    // Step 2: Process all operations
    // For each [ri, ci], increment the corresponding row and column counters
    for (int[] index : indices) {
        int ri = index[0];
        int ci = index[1];
        rowCounts[ri]++;
        colCounts[ci]++;
    }

    // Step 3: Count odd cells
    int oddCount = 0;

    // For each cell (r,c), it's odd if (rowCounts[r] + colCounts[c]) is odd
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            // Check if sum is odd using bitwise AND for efficiency
            if (((rowCounts[r] + colCounts[c]) & 1) == 1) {
                oddCount++;
            }
        }
    }

    return oddCount;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(k + m × n)

- O(k): We process each of the k operations once to update row and column counters
- O(m × n): We iterate through all m×n cells to count which ones are odd

**Space Complexity:** O(m + n)

- We maintain two arrays: one of size m for row increments and one of size n for column increments
- This is significantly better than O(m × n) which would be required to store the full matrix

## Common Mistakes

1. **Off-by-one errors with indices:** Remember that the matrix is 0-indexed. A common mistake is to create arrays of size m+1 or n+1, or to use 1-based indexing when accessing rows/columns.

2. **Forgetting that operations are cumulative:** Each operation increments BOTH a row AND a column. Some candidates mistakenly think they should choose one or the other.

3. **Inefficient matrix construction:** Building the full m×n matrix when m and n can be up to 50 (leading to 2500 cells) is acceptable, but for larger constraints, the counting approach is necessary.

4. **Misunderstanding odd/even logic:** Remember that a cell is odd if the TOTAL number of times it was incremented (from row operations + column operations) is odd. Some candidates check if EITHER the row count OR column count is odd, which is incorrect.

## When You'll See This Pattern

This problem teaches the important pattern of **separating dimensions** when dealing with grid operations. Instead of tracking each cell, we track operations along each axis independently. This pattern appears in:

1. **Range Sum Query 2D - Immutable (LeetCode 304):** Similar idea of precomputing prefix sums along rows and columns to answer submatrix sum queries efficiently.

2. **Battleships in a Board (LeetCode 419):** Counting ships by looking at the "start" of each ship (first cell) rather than tracking every ship cell.

3. **Projection Area of 3D Shapes (LeetCode 883):** Calculating projections by finding maximum values along each row and column separately.

The core insight is that when operations affect entire rows or columns, we can often decompose the problem into independent 1D problems.

## Key Takeaways

1. **Think about operations, not just states:** When you see operations that affect entire rows/columns, consider tracking the operations themselves rather than the resulting state of every cell.

2. **Decompose multidimensional problems:** Many 2D problems can be broken down into separate 1D problems. If a cell's value depends on its row and column independently, you can often process rows and columns separately.

3. **Look for mathematical properties:** The parity (odd/even) property here is key. Understanding that odd+even=odd, odd+odd=even, etc., helps simplify the counting.

Remember: Interviewers aren't just testing if you can solve the problem—they're testing if you can recognize patterns and optimize solutions. Always ask yourself: "Do I need to track everything, or can I track just what matters?"

[Practice this problem on CodeJeet](/problem/cells-with-odd-values-in-a-matrix)
