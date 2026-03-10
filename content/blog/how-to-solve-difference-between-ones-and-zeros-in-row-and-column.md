---
title: "How to Solve Difference Between Ones and Zeros in Row and Column — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Difference Between Ones and Zeros in Row and Column. Medium difficulty, 84.4% acceptance rate. Topics: Array, Matrix, Simulation."
date: "2026-10-14"
category: "dsa-patterns"
tags:
  ["difference-between-ones-and-zeros-in-row-and-column", "array", "matrix", "simulation", "medium"]
---

# How to Solve Difference Between Ones and Zeros in Row and Column

This problem asks us to transform a binary matrix by calculating the difference between the number of ones and zeros for each cell's row and column. The tricky part is that each cell's value depends on global row and column statistics, not just local values. This creates an interesting optimization challenge: we need to efficiently compute row and column statistics once, then apply them to every cell without redundant calculations.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider this 2×3 binary matrix:

```
grid = [[1, 0, 1],
        [0, 0, 1]]
```

**Step 1: Calculate row statistics**

- Row 0: onesRow₀ = 2 (cells at [0,0] and [0,2] are 1), zerosRow₀ = 1 (cell at [0,1] is 0)
- Row 1: onesRow₁ = 1 (cell at [1,2] is 1), zerosRow₁ = 2 (cells at [1,0] and [1,1] are 0)

**Step 2: Calculate column statistics**

- Column 0: onesCol₀ = 1 (cell at [0,0] is 1), zerosCol₀ = 1 (cell at [1,0] is 0)
- Column 1: onesCol₁ = 0, zerosCol₁ = 2
- Column 2: onesCol₂ = 2, zerosCol₂ = 0

**Step 3: Apply formula to each cell**
The formula is: diff[i][j] = onesRowᵢ + onesColⱼ - zerosRowᵢ - zerosColⱼ

Let's calculate cell-by-cell:

- Cell [0,0]: 2 + 1 - 1 - 1 = 1
- Cell [0,1]: 2 + 0 - 1 - 2 = -1
- Cell [0,2]: 2 + 2 - 1 - 0 = 3
- Cell [1,0]: 1 + 1 - 2 - 1 = -1
- Cell [1,1]: 1 + 0 - 2 - 2 = -3
- Cell [1,2]: 1 + 2 - 2 - 0 = 1

So the result is:

```
diff = [[1, -1, 3],
        [-1, -3, 1]]
```

Notice how each cell's value combines information from its entire row and column. This suggests we should precompute row and column statistics.

## Brute Force Approach

A naive approach would be to calculate the difference for each cell by scanning its entire row and column every time:

1. For each cell (i, j):
2. Count ones in row i by scanning all m cells in that row
3. Count ones in column j by scanning all n cells in that column
4. Calculate zeros as (m - onesRow) and (n - onesCol)
5. Compute diff[i][j] = onesRow + onesCol - zerosRow - zerosCol

This approach has O(m × n × (m + n)) time complexity because for each of the m×n cells, we scan m cells for the row and n cells for the column. For a 1000×1000 matrix, that's 1000³ = 1 billion operations, which is far too slow.

The key insight is that we're doing redundant work: we count the ones in row i separately for each of the n cells in that row. We should count each row and column only once.

## Optimized Approach

The optimal solution uses **precomputation** of row and column statistics:

1. **First pass**: Count ones in each row and each column
   - Create arrays `rowOnes` of size m and `colOnes` of size n
   - Traverse the matrix once, adding to both the current row's count and current column's count

2. **Second pass**: Calculate the difference matrix
   - For each cell (i, j):
   - Row zeros = total columns - rowOnes[i]
   - Column zeros = total rows - colOnes[j]
   - diff[i][j] = rowOnes[i] + colOnes[j] - rowZeros - colZeros

This works because:

- The number of zeros in row i is simply (n - rowOnes[i]) since each cell is either 0 or 1
- The number of zeros in column j is (m - colOnes[j]) for the same reason
- We can compute these values once and reuse them for every cell

The formula simplifies to:
diff[i][j] = rowOnes[i] + colOnes[j] - (n - rowOnes[i]) - (m - colOnes[j])
= 2 × rowOnes[i] + 2 × colOnes[j] - n - m

But in code, we'll use the more intuitive version for clarity.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(m × n) | Space: O(m + n)
def onesMinusZeros(grid):
    """
    Calculate the difference matrix where each cell's value is:
    diff[i][j] = (ones in row i + ones in col j) -
                 (zeros in row i + zeros in col j)
    """
    m, n = len(grid), len(grid[0])

    # Step 1: Precompute ones count for each row and column
    row_ones = [0] * m  # ones count for each row
    col_ones = [0] * n  # ones count for each column

    # Traverse the matrix once to count ones
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                row_ones[i] += 1
                col_ones[j] += 1

    # Step 2: Create the difference matrix
    diff = [[0] * n for _ in range(m)]

    # Calculate each cell's value using precomputed counts
    for i in range(m):
        for j in range(n):
            # Zeros in row i = total columns - ones in row i
            row_zeros = n - row_ones[i]
            # Zeros in column j = total rows - ones in column j
            col_zeros = m - col_ones[j]
            # Apply the formula
            diff[i][j] = row_ones[i] + col_ones[j] - row_zeros - col_zeros

    return diff
```

```javascript
// Time: O(m × n) | Space: O(m + n)
function onesMinusZeros(grid) {
  /**
   * Calculate the difference matrix where each cell's value is:
   * diff[i][j] = (ones in row i + ones in col j) -
   *              (zeros in row i + zeros in col j)
   */
  const m = grid.length;
  const n = grid[0].length;

  // Step 1: Precompute ones count for each row and column
  const rowOnes = new Array(m).fill(0);
  const colOnes = new Array(n).fill(0);

  // Traverse the matrix once to count ones
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        rowOnes[i]++;
        colOnes[j]++;
      }
    }
  }

  // Step 2: Create the difference matrix
  const diff = new Array(m);
  for (let i = 0; i < m; i++) {
    diff[i] = new Array(n);
  }

  // Calculate each cell's value using precomputed counts
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Zeros in row i = total columns - ones in row i
      const rowZeros = n - rowOnes[i];
      // Zeros in column j = total rows - ones in column j
      const colZeros = m - colOnes[j];
      // Apply the formula
      diff[i][j] = rowOnes[i] + colOnes[j] - rowZeros - colZeros;
    }
  }

  return diff;
}
```

```java
// Time: O(m × n) | Space: O(m + n)
class Solution {
    public int[][] onesMinusZeros(int[][] grid) {
        /**
         * Calculate the difference matrix where each cell's value is:
         * diff[i][j] = (ones in row i + ones in col j) -
         *              (zeros in row i + zeros in col j)
         */
        int m = grid.length;
        int n = grid[0].length;

        // Step 1: Precompute ones count for each row and column
        int[] rowOnes = new int[m];
        int[] colOnes = new int[n];

        // Traverse the matrix once to count ones
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    rowOnes[i]++;
                    colOnes[j]++;
                }
            }
        }

        // Step 2: Create the difference matrix
        int[][] diff = new int[m][n];

        // Calculate each cell's value using precomputed counts
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // Zeros in row i = total columns - ones in row i
                int rowZeros = n - rowOnes[i];
                // Zeros in column j = total rows - ones in column j
                int colZeros = m - colOnes[j];
                // Apply the formula
                diff[i][j] = rowOnes[i] + colOnes[j] - rowZeros - colZeros;
            }
        }

        return diff;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We make two passes through the entire matrix
- First pass: O(m × n) to count ones in rows and columns
- Second pass: O(m × n) to compute the difference matrix
- Total: O(2 × m × n) = O(m × n)

**Space Complexity: O(m + n)**

- We store two arrays: `rowOnes` of size m and `colOnes` of size n
- The output matrix is not counted in auxiliary space as it's required by the problem
- Total auxiliary space: O(m + n)

## Common Mistakes

1. **Recalculating row/column counts for each cell**: This is the O(m × n × (m + n)) brute force approach. Always look for opportunities to precompute values that are reused.

2. **Forgetting that indices are 0-based**: The problem states it's 0-indexed, but some candidates might accidentally use 1-based indexing when calculating array sizes or loop bounds.

3. **Mixing up rows and columns in calculations**: When computing `rowZeros = n - rowOnes[i]`, remember that `n` is the number of columns (cells in a row), not the number of rows. Similarly for `colZeros = m - colOnes[j]`.

4. **Not handling empty matrix edge case**: While the constraints guarantee m, n ≥ 1, in interviews you should mention checking for empty input. A robust solution would handle `if not grid or not grid[0]: return []`.

## When You'll See This Pattern

This problem uses the **precomputation** or **prefix sum** pattern applied to 2D arrays. You'll see similar patterns in:

1. **01 Matrix (Medium)**: Calculate distances to nearest 0 for each cell. The optimal solution uses BFS from all zeros simultaneously, but a DP approach also uses precomputation in two passes.

2. **Special Positions in a Binary Matrix (Easy)**: Find positions where the value is 1 and it's the only 1 in its row and column. This requires counting ones in rows and columns, similar to our precomputation step.

3. **Range Sum Query 2D - Immutable (Medium)**: Precompute prefix sums to answer submatrix sum queries in O(1) time. The pattern of precomputing to avoid redundant calculations is identical.

## Key Takeaways

1. **When a calculation depends on aggregated data (like row/column sums), precompute the aggregates first**. Don't recalculate them for each element.

2. **For matrix problems, consider whether you need separate row and column statistics**. Often, you can compute both in a single pass by incrementing both the current row's and current column's counters.

3. **Simplify formulas when possible**. While we used the intuitive formula in our code, recognizing that diff[i][j] = 2×rowOnes[i] + 2×colOnes[j] - m - n could lead to slightly cleaner code, though the difference is minimal.

Related problems: [01 Matrix](/problem/01-matrix), [Special Positions in a Binary Matrix](/problem/special-positions-in-a-binary-matrix), [Remove All Ones With Row and Column Flips](/problem/remove-all-ones-with-row-and-column-flips)
