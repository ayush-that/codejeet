---
title: "How to Solve Find Valid Matrix Given Row and Column Sums — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Valid Matrix Given Row and Column Sums. Medium difficulty, 82.7% acceptance rate. Topics: Array, Greedy, Matrix."
date: "2026-07-18"
category: "dsa-patterns"
tags: ["find-valid-matrix-given-row-and-column-sums", "array", "greedy", "matrix", "medium"]
---

# How to Solve Find Valid Matrix Given Row and Column Sums

You're given the sums of each row and column of an unknown matrix, and you need to reconstruct any valid matrix that satisfies these sums. The challenge is that there are infinite possible matrices, but you need to find just one efficiently. This problem is interesting because it demonstrates how greedy algorithms can construct valid solutions even when the problem seems under-constrained.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `rowSum = [3, 8]` (two rows)
- `colSum = [4, 7]` (two columns)

We need to find a 2×2 matrix where:

- Row 0 sum = 3
- Row 1 sum = 8
- Column 0 sum = 4
- Column 1 sum = 7

**Step-by-step construction:**

1. Start with an empty 2×2 matrix: `[[0, 0], [0, 0]]`
2. Look at position (0,0): We can put the minimum of `rowSum[0]` (3) and `colSum[0]` (4), which is 3
   - Update matrix: `[[3, 0], [0, 0]]`
   - Subtract 3 from both `rowSum[0]` (now 0) and `colSum[0]` (now 1)
3. Move to position (0,1): `rowSum[0]` is now 0, so we put 0
   - Update matrix: `[[3, 0], [0, 0]]`
   - Subtract 0 from both `rowSum[0]` (now 0) and `colSum[1]` (still 7)
4. Move to position (1,0): Put minimum of `rowSum[1]` (8) and `colSum[0]` (1), which is 1
   - Update matrix: `[[3, 0], [1, 0]]`
   - Subtract 1 from both `rowSum[1]` (now 7) and `colSum[0]` (now 0)
5. Move to position (1,1): Put minimum of `rowSum[1]` (7) and `colSum[1]` (7), which is 7
   - Update matrix: `[[3, 0], [1, 7]]`
   - Subtract 7 from both `rowSum[1]` (now 0) and `colSum[1]` (now 0)

Final matrix: `[[3, 0], [1, 7]]`
Check: Row sums = [3, 8], Column sums = [4, 7] ✓

The key insight: At each cell, we put the maximum possible value (minimum of remaining row and column sums) without violating any constraints, then update the remaining sums.

## Brute Force Approach

A naive approach would try to enumerate all possible matrices. For an m×n matrix with row sums totaling S, we could try all ways to distribute S items into m×n cells. However, this is astronomically inefficient. Even with small constraints, the number of possibilities grows combinatorially.

Another brute force idea: Try to solve it as a system of linear equations. We have m + n equations (one for each row and column) and m×n variables. We could use linear algebra, but that's overkill and doesn't guarantee non-negative integer solutions.

The main issue with brute force is that it doesn't leverage the structure of the problem. We don't need to find all solutions or even the "best" one—we just need any valid solution.

## Optimized Approach

The optimal solution uses a **greedy algorithm** with these key insights:

1. **The problem is always solvable** if the total row sum equals total column sum (which is guaranteed by the problem constraints).

2. **Greedy choice**: At each cell (i, j), we can safely put `min(rowSum[i], colSum[j])`. This is the maximum value we can place without exceeding either the current row's or column's remaining sum.

3. **Inductive proof**: After placing this value and subtracting it from both `rowSum[i]` and `colSum[j]`, we're left with a smaller instance of the same problem. The remaining row and column sums still have equal totals.

4. **Process order**: We can process cells in any order, but row-major order (left to right, top to bottom) is simplest. After processing a cell, we either:
   - Exhaust the current row's sum (move to next row)
   - Exhaust the current column's sum (move to next column)
   - Or both

This greedy approach works because we're always making a locally optimal choice that doesn't prevent finding a valid solution later.

## Optimal Solution

Here's the complete implementation using the greedy approach:

<div class="code-group">

```python
# Time: O(m * n) where m = len(rowSum), n = len(colSum)
# Space: O(m * n) for the output matrix
def restoreMatrix(rowSum, colSum):
    """
    Reconstructs a matrix given its row and column sums.

    Args:
        rowSum: List of integers representing sum of each row
        colSum: List of integers representing sum of each column

    Returns:
        A 2D matrix (list of lists) that satisfies the given sums
    """
    m, n = len(rowSum), len(colSum)

    # Initialize matrix with zeros
    matrix = [[0] * n for _ in range(m)]

    # Process each cell in row-major order
    for i in range(m):
        for j in range(n):
            # The value we can place is limited by both the remaining
            # row sum and the remaining column sum
            val = min(rowSum[i], colSum[j])

            # Place the value in the matrix
            matrix[i][j] = val

            # Update the remaining sums
            # This ensures we don't exceed any row or column total
            rowSum[i] -= val
            colSum[j] -= val

    return matrix
```

```javascript
// Time: O(m * n) where m = rowSum.length, n = colSum.length
// Space: O(m * n) for the output matrix
function restoreMatrix(rowSum, colSum) {
  /**
   * Reconstructs a matrix given its row and column sums.
   *
   * @param {number[]} rowSum - Array representing sum of each row
   * @param {number[]} colSum - Array representing sum of each column
   * @return {number[][]} A 2D matrix that satisfies the given sums
   */
  const m = rowSum.length;
  const n = colSum.length;

  // Initialize matrix with zeros
  const matrix = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  // Process each cell in row-major order
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // The value we can place is limited by both the remaining
      // row sum and the remaining column sum
      const val = Math.min(rowSum[i], colSum[j]);

      // Place the value in the matrix
      matrix[i][j] = val;

      // Update the remaining sums
      // This ensures we don't exceed any row or column total
      rowSum[i] -= val;
      colSum[j] -= val;
    }
  }

  return matrix;
}
```

```java
// Time: O(m * n) where m = rowSum.length, n = colSum.length
// Space: O(m * n) for the output matrix
class Solution {
    public int[][] restoreMatrix(int[] rowSum, int[] colSum) {
        /**
         * Reconstructs a matrix given its row and column sums.
         *
         * @param rowSum Array representing sum of each row
         * @param colSum Array representing sum of each column
         * @return A 2D matrix that satisfies the given sums
         */
        int m = rowSum.length;
        int n = colSum.length;

        // Initialize matrix with zeros
        int[][] matrix = new int[m][n];

        // Process each cell in row-major order
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // The value we can place is limited by both the remaining
                // row sum and the remaining column sum
                int val = Math.min(rowSum[i], colSum[j]);

                // Place the value in the matrix
                matrix[i][j] = val;

                // Update the remaining sums
                // This ensures we don't exceed any row or column total
                rowSum[i] -= val;
                colSum[j] -= val;
            }
        }

        return matrix;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- We iterate through every cell of the m×n matrix exactly once
- At each cell, we perform constant-time operations: min(), subtraction, and assignment
- This is optimal since we need to fill every cell of the output matrix

**Space Complexity:** O(m × n)

- We need to store the output matrix of size m×n
- The input arrays are modified in-place, so no additional space is needed for them
- If we couldn't modify the input, we'd need O(m + n) extra space for copies

## Common Mistakes

1. **Forgetting to update both row and column sums**: After placing a value, you must subtract it from BOTH the current row's remaining sum AND the current column's remaining sum. Forgetting either will cause incorrect results.

2. **Using the wrong order of operations**: While any processing order works theoretically, sticking to a simple row-major order (nested loops with i then j) is safest. Trying to optimize by skipping zeros can introduce bugs.

3. **Assuming the matrix must be square**: The problem doesn't specify that m = n. Your code should handle rectangular matrices (m ≠ n) correctly.

4. **Not handling large values correctly**: The sums can be up to 10^8, but integers in all three languages can handle this. However, in some languages with fixed-width integers, you might need to use long integers.

5. **Modifying input arrays without permission**: In an interview, always ask if you can modify the input. If not, make copies of rowSum and colSum before starting.

## When You'll See This Pattern

This greedy "constructive" pattern appears in problems where you need to build a solution that satisfies multiple constraints:

1. **Reconstruct a 2-Row Binary Matrix (Medium)** - Similar constraints but with binary values (0 or 1). The greedy approach works with the modification that you can only place 0 or 1.

2. **Queue Reconstruction by Height (Medium)** - Another constructive problem where you build a queue satisfying both height and "people in front" constraints using a greedy approach.

3. **Candy (Hard)** - While not identical, it involves satisfying constraints from both directions (left and right neighbors) and updating values greedily.

The core pattern: When you have multiple constraints that must all be satisfied, and you can make locally optimal choices that don't violate future possibilities, a greedy approach often works.

## Key Takeaways

1. **Greedy can work for constructive problems**: When asked to construct any valid solution (not necessarily optimal), consider if a greedy approach that makes locally optimal choices will lead to a globally valid solution.

2. **Update all affected constraints**: When you make a choice that affects multiple constraints (like row and column sums), remember to update all of them to maintain consistency.

3. **Simple is often sufficient**: The straightforward row-major iteration works perfectly here. Don't overcomplicate with fancy skipping or optimization attempts unless necessary.

Related problems: [Reconstruct a 2-Row Binary Matrix](/problem/reconstruct-a-2-row-binary-model)
