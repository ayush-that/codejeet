---
title: "How to Solve Largest Magic Square — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Largest Magic Square. Medium difficulty, 75.3% acceptance rate. Topics: Array, Matrix, Prefix Sum."
date: "2027-09-02"
category: "dsa-patterns"
tags: ["largest-magic-square", "array", "matrix", "prefix-sum", "medium"]
---

# How to Solve Largest Magic Square

Finding the largest magic square within a given grid is a matrix validation problem with a twist: instead of checking if the entire grid is magic, we need to find the largest possible square subgrid that satisfies magic square properties. The challenge comes from efficiently checking all possible square sizes while computing multiple sums (rows, columns, diagonals) for each candidate square. A naive approach would be prohibitively slow, making this an excellent exercise in optimization through prefix sums.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this 3×4 grid:

```
[ [7, 1, 4, 5],
  [6, 7, 2, 3],
  [8, 3, 1, 6] ]
```

We need to find the largest k×k magic square within this grid. Let's check possible squares:

**k = 3** (3×3 squares): Only one possible square starting at (0,0):

- Top-left: (0,0) to (2,2)
- Rows: [7,1,4]=12, [6,7,2]=15, [8,3,1]=12 → Not equal
- Already fails, so not magic

**k = 2** (2×2 squares): Check square starting at (0,0):

- Top-left: (0,0) to (1,1)
- Rows: [7,1]=8, [6,7]=13 → Not equal
- Already fails

Check square starting at (0,1):

- Top-left: (0,1) to (1,2)
- Rows: [1,4]=5, [7,2]=9 → Not equal

Check square starting at (0,2):

- Top-left: (0,2) to (1,3)
- Rows: [4,5]=9, [2,3]=5 → Not equal

Check square starting at (1,0):

- Top-left: (1,0) to (2,1)
- Rows: [6,7]=13, [8,3]=11 → Not equal

Check square starting at (1,1):

- Top-left: (1,1) to (2,2)
- Rows: [7,2]=9, [3,1]=4 → Not equal

Check square starting at (1,2):

- Top-left: (1,2) to (2,3)
- Rows: [2,3]=5, [1,6]=7 → Not equal

**k = 1**: Every 1×1 cell is trivially a magic square, so the largest magic square has size 1.

The key insight is that checking each candidate square requires computing up to 2k+2 sums (k rows, k columns, 2 diagonals). Doing this from scratch for each square would be extremely inefficient. We need a way to compute these sums quickly.

## Brute Force Approach

The most straightforward approach is to:

1. Try every possible square size k from min(m,n) down to 1
2. For each k, try every possible top-left position (i,j) where i+k ≤ m and j+k ≤ n
3. For each candidate square, compute all row sums, column sums, and diagonal sums from scratch
4. Check if all these sums are equal

The problem with this approach is the repeated work. For a k×k square, computing all sums from scratch takes O(k²) time. With O(m×n) possible starting positions and O(min(m,n)) possible sizes, the total time becomes O(m×n×min(m,n)³), which is far too slow for typical constraints (m,n up to 50 would give ~50⁴ = 6.25M operations, but actually worse due to the cubic k factor).

Even if we optimize slightly by computing sums incrementally, the brute force approach lacks the systematic reuse of computations that makes the optimal solution efficient.

## Optimized Approach

The key optimization is using **prefix sums** to compute any subarray sum in O(1) time. We can build two prefix sum arrays:

1. **Row-wise prefix sums**: `rowPrefix[i][j]` = sum of first j elements in row i
2. **Column-wise prefix sums**: `colPrefix[i][j]` = sum of first i elements in column j

With these, we can compute:

- Sum of row i from column j to j+k-1: `rowPrefix[i][j+k] - rowPrefix[i][j]`
- Sum of column j from row i to i+k-1: `colPrefix[i+k][j] - colPrefix[i][j]`

For diagonals, we need additional prefix sums: 3. **Main diagonal prefix sums**: `diagPrefix[i][j]` = sum along main diagonal ending at (i,j) 4. **Anti-diagonal prefix sums**: `antiPrefix[i][j]` = sum along anti-diagonal ending at (i,j)

The main diagonal sum for square (i,j) to (i+k-1,j+k-1) is: `diagPrefix[i+k][j+k] - diagPrefix[i][j]`
The anti-diagonal sum for the same square is: `antiPrefix[i+k][j-1] - antiPrefix[i][j+k-1]` (with careful boundary checks)

With these O(1) sum queries, checking a k×k square takes O(k) time (we need to check k rows, k columns, and 2 diagonals). This reduces the overall complexity to O(m×n×min(m,n)²), which is acceptable for m,n ≤ 50.

## Optimal Solution

Here's the complete implementation using prefix sums:

<div class="code-group">

```python
# Time: O(m*n*min(m,n)²) | Space: O(m*n)
def largestMagicSquare(grid):
    """
    Find the largest magic square in the given grid.

    Approach: Use prefix sums to compute row, column, and diagonal
    sums in O(1) time, then check all possible squares efficiently.
    """
    m, n = len(grid), len(grid[0])

    # Build prefix sum arrays
    # rowPrefix[i][j] = sum of first j elements in row i
    rowPrefix = [[0] * (n + 1) for _ in range(m)]
    for i in range(m):
        for j in range(n):
            rowPrefix[i][j + 1] = rowPrefix[i][j] + grid[i][j]

    # colPrefix[i][j] = sum of first i elements in column j
    colPrefix = [[0] * n for _ in range(m + 1)]
    for j in range(n):
        for i in range(m):
            colPrefix[i + 1][j] = colPrefix[i][j] + grid[i][j]

    # diagPrefix[i][j] = sum along main diagonal ending at (i-1, j-1)
    diagPrefix = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m):
        for j in range(n):
            diagPrefix[i + 1][j + 1] = diagPrefix[i][j] + grid[i][j]

    # antiPrefix[i][j] = sum along anti-diagonal ending at (i-1, j)
    antiPrefix = [[0] * (n + 2) for _ in range(m + 1)]
    for i in range(m):
        for j in range(n):
            antiPrefix[i + 1][j + 1] = antiPrefix[i][j + 2] + grid[i][j]

    # Helper function to check if a square is magic
    def isMagic(i, j, k):
        """
        Check if square with top-left at (i,j) and size k is magic.
        Returns True if all rows, columns, and diagonals have equal sum.
        """
        # Get the main diagonal sum
        diag_sum = diagPrefix[i + k][j + k] - diagPrefix[i][j]

        # Get the anti-diagonal sum
        anti_sum = antiPrefix[i + k][j + 1] - antiPrefix[i][j + k + 1]

        # Diagonals must be equal
        if diag_sum != anti_sum:
            return False

        target = diag_sum  # The magic constant

        # Check all rows
        for r in range(i, i + k):
            row_sum = rowPrefix[r][j + k] - rowPrefix[r][j]
            if row_sum != target:
                return False

        # Check all columns
        for c in range(j, j + k):
            col_sum = colPrefix[i + k][c] - colPrefix[i][c]
            if col_sum != target:
                return False

        return True

    # Try all possible square sizes from largest to smallest
    for k in range(min(m, n), 0, -1):
        # Try all possible top-left positions
        for i in range(m - k + 1):
            for j in range(n - k + 1):
                if isMagic(i, j, k):
                    return k

    return 1  # At least 1x1 squares are always magic
```

```javascript
// Time: O(m*n*min(m,n)²) | Space: O(m*n)
function largestMagicSquare(grid) {
  /**
   * Find the largest magic square in the given grid.
   *
   * Approach: Use prefix sums to compute row, column, and diagonal
   * sums in O(1) time, then check all possible squares efficiently.
   */
  const m = grid.length;
  const n = grid[0].length;

  // Build prefix sum arrays
  // rowPrefix[i][j] = sum of first j elements in row i
  const rowPrefix = Array(m)
    .fill()
    .map(() => Array(n + 1).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      rowPrefix[i][j + 1] = rowPrefix[i][j] + grid[i][j];
    }
  }

  // colPrefix[i][j] = sum of first i elements in column j
  const colPrefix = Array(m + 1)
    .fill()
    .map(() => Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) {
      colPrefix[i + 1][j] = colPrefix[i][j] + grid[i][j];
    }
  }

  // diagPrefix[i][j] = sum along main diagonal ending at (i-1, j-1)
  const diagPrefix = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      diagPrefix[i + 1][j + 1] = diagPrefix[i][j] + grid[i][j];
    }
  }

  // antiPrefix[i][j] = sum along anti-diagonal ending at (i-1, j)
  const antiPrefix = Array(m + 1)
    .fill()
    .map(() => Array(n + 2).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      antiPrefix[i + 1][j + 1] = antiPrefix[i][j + 2] + grid[i][j];
    }
  }

  // Helper function to check if a square is magic
  function isMagic(i, j, k) {
    /**
     * Check if square with top-left at (i,j) and size k is magic.
     * Returns true if all rows, columns, and diagonals have equal sum.
     */
    // Get the main diagonal sum
    const diagSum = diagPrefix[i + k][j + k] - diagPrefix[i][j];

    // Get the anti-diagonal sum
    const antiSum = antiPrefix[i + k][j + 1] - antiPrefix[i][j + k + 1];

    // Diagonals must be equal
    if (diagSum !== antiSum) {
      return false;
    }

    const target = diagSum; // The magic constant

    // Check all rows
    for (let r = i; r < i + k; r++) {
      const rowSum = rowPrefix[r][j + k] - rowPrefix[r][j];
      if (rowSum !== target) {
        return false;
      }
    }

    // Check all columns
    for (let c = j; c < j + k; c++) {
      const colSum = colPrefix[i + k][c] - colPrefix[i][c];
      if (colSum !== target) {
        return false;
      }
    }

    return true;
  }

  // Try all possible square sizes from largest to smallest
  for (let k = Math.min(m, n); k >= 1; k--) {
    // Try all possible top-left positions
    for (let i = 0; i <= m - k; i++) {
      for (let j = 0; j <= n - k; j++) {
        if (isMagic(i, j, k)) {
          return k;
        }
      }
    }
  }

  return 1; // At least 1x1 squares are always magic
}
```

```java
// Time: O(m*n*min(m,n)²) | Space: O(m*n)
class Solution {
    public int largestMagicSquare(int[][] grid) {
        /**
         * Find the largest magic square in the given grid.
         *
         * Approach: Use prefix sums to compute row, column, and diagonal
         * sums in O(1) time, then check all possible squares efficiently.
         */
        int m = grid.length;
        int n = grid[0].length;

        // Build prefix sum arrays
        // rowPrefix[i][j] = sum of first j elements in row i
        int[][] rowPrefix = new int[m][n + 1];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                rowPrefix[i][j + 1] = rowPrefix[i][j] + grid[i][j];
            }
        }

        // colPrefix[i][j] = sum of first i elements in column j
        int[][] colPrefix = new int[m + 1][n];
        for (int j = 0; j < n; j++) {
            for (int i = 0; i < m; i++) {
                colPrefix[i + 1][j] = colPrefix[i][j] + grid[i][j];
            }
        }

        // diagPrefix[i][j] = sum along main diagonal ending at (i-1, j-1)
        int[][] diagPrefix = new int[m + 1][n + 1];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                diagPrefix[i + 1][j + 1] = diagPrefix[i][j] + grid[i][j];
            }
        }

        // antiPrefix[i][j] = sum along anti-diagonal ending at (i-1, j)
        int[][] antiPrefix = new int[m + 1][n + 2];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                antiPrefix[i + 1][j + 1] = antiPrefix[i][j + 2] + grid[i][j];
            }
        }

        // Try all possible square sizes from largest to smallest
        for (int k = Math.min(m, n); k >= 1; k--) {
            // Try all possible top-left positions
            for (int i = 0; i <= m - k; i++) {
                for (int j = 0; j <= n - k; j++) {
                    if (isMagic(grid, i, j, k, rowPrefix, colPrefix, diagPrefix, antiPrefix)) {
                        return k;
                    }
                }
            }
        }

        return 1;  // At least 1x1 squares are always magic
    }

    private boolean isMagic(int[][] grid, int i, int j, int k,
                           int[][] rowPrefix, int[][] colPrefix,
                           int[][] diagPrefix, int[][] antiPrefix) {
        /**
         * Check if square with top-left at (i,j) and size k is magic.
         * Returns true if all rows, columns, and diagonals have equal sum.
         */
        // Get the main diagonal sum
        int diagSum = diagPrefix[i + k][j + k] - diagPrefix[i][j];

        // Get the anti-diagonal sum
        int antiSum = antiPrefix[i + k][j + 1] - antiPrefix[i][j + k + 1];

        // Diagonals must be equal
        if (diagSum != antiSum) {
            return false;
        }

        int target = diagSum;  // The magic constant

        // Check all rows
        for (int r = i; r < i + k; r++) {
            int rowSum = rowPrefix[r][j + k] - rowPrefix[r][j];
            if (rowSum != target) {
                return false;
            }
        }

        // Check all columns
        for (int c = j; c < j + k; c++) {
            int colSum = colPrefix[i + k][c] - colPrefix[i][c];
            if (colSum != target) {
                return false;
            }
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n × min(m,n)²)

- Building prefix sums: O(m × n) for each of the 4 prefix arrays
- Checking squares: We try O(min(m,n)) sizes, each with O(m × n) possible positions, and checking each k×k square takes O(k) time with our prefix sums
- Total: O(m × n × min(m,n)²) dominates for typical inputs

**Space Complexity:** O(m × n)

- We store 4 prefix sum arrays, each requiring O(m × n) space
- The rowPrefix and colPrefix arrays are m×(n+1) and (m+1)×n respectively
- The diagonal prefix arrays are (m+1)×(n+1) and (m+1)×(n+2)
- All are proportional to m × n

## Common Mistakes

1. **Off-by-one errors in prefix sum indices**: The most common mistake is incorrect indexing when building or querying prefix sums. Remember that prefix[i] typically represents the sum of elements up to but not including position i. Always test with small examples to verify your indexing logic.

2. **Forgetting to check both diagonals**: Some candidates only check the main diagonal. A magic square requires both diagonals to have the same sum as the rows and columns.

3. **Inefficient diagonal sum computation**: Computing diagonal sums by iterating through the diagonal takes O(k) time. Using prefix sums reduces this to O(1). The anti-diagonal prefix sum is particularly tricky because it goes in the opposite direction of typical array traversal.

4. **Starting from size 1 instead of min(m,n)**: While starting small and working up is more intuitive, starting from the largest possible size and returning early when we find a magic square is more efficient in practice, since we're looking for the largest magic square.

## When You'll See This Pattern

The prefix sum technique for efficient submatrix sum queries appears in several matrix problems:

1. **Range Sum Query 2D - Immutable (LeetCode 304)**: Direct application of 2D prefix sums to answer submatrix sum queries.

2. **Maximum Side Length of a Square with Sum Less Than or Equal to Threshold (LeetCode 1292)**: Uses prefix sums to efficiently compute square sums while searching for the largest square satisfying a condition.

3. **Count Square Submatrices with All Ones (LeetCode 1277)**: While often solved with dynamic programming, prefix sums can provide an alternative approach for checking square regions.

The pattern to recognize: when you need to repeatedly compute sums of submatrices or subsquares, prefix sums can reduce the computation from O(k²) to O(1) per query after O(m×n) preprocessing.

## Key Takeaways

1. **Prefix sums transform repeated sum queries into O(1) operations**: By precomputing cumulative sums, you can compute any subarray sum as the difference of two prefix sums. This is especially powerful in 2D problems.

2. **Consider all directions when working with matrices**: For magic squares, we need row, column, and both diagonal sums. Each requires its own prefix sum array with careful indexing.

3. **Start from the largest possible solution when searching for maximum size**: If you're looking for the largest X, try sizes from largest to smallest and return early when you find a valid solution. This is often more efficient than building up from small sizes.

Related problems: [Magic Squares In Grid](/problem/magic-squares-in-grid)
