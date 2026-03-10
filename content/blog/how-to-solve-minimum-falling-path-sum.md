---
title: "How to Solve Minimum Falling Path Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Falling Path Sum. Medium difficulty, 60.8% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2027-02-13"
category: "dsa-patterns"
tags: ["minimum-falling-path-sum", "array", "dynamic-programming", "matrix", "medium"]
---

# How to Solve Minimum Falling Path Sum

This problem asks us to find the minimum sum of any falling path through an n×n matrix, where a falling path starts at any element in the first row and moves to the next row by choosing an element directly below or diagonally left/right. What makes this problem interesting is that it's a classic dynamic programming problem disguised as a matrix traversal challenge—the optimal path to any cell depends on the optimal paths to cells in the previous row, creating overlapping subproblems that we can solve efficiently.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this 3×3 matrix:

```
matrix = [
    [2, 1, 3],
    [6, 5, 4],
    [7, 8, 9]
]
```

A falling path must start in the first row. Let's think about the minimum path sum to reach each cell:

**Row 0 (starting row):** The minimum sum to reach each cell in the first row is just the cell value itself:

- `(0,0)`: 2
- `(0,1)`: 1
- `(0,2)`: 3

**Row 1:** To reach cell `(1,0)`, we can come from:

- `(0,0)` (directly above): 2 + 6 = 8
- `(0,1)` (diagonally right above): 1 + 6 = 7
  Minimum is 7.

To reach cell `(1,1)`, we can come from:

- `(0,0)`: 2 + 5 = 7
- `(0,1)`: 1 + 5 = 6
- `(0,2)`: 3 + 5 = 8
  Minimum is 6.

To reach cell `(1,2)`, we can come from:

- `(0,1)`: 1 + 4 = 5
- `(0,2)`: 3 + 4 = 7
  Minimum is 5.

**Row 2:** Now we continue this process. To reach cell `(2,0)`:

- From `(1,0)`: 7 + 7 = 14
- From `(1,1)`: 6 + 7 = 13
  Minimum is 13.

To reach cell `(2,1)`:

- From `(1,0)`: 7 + 8 = 15
- From `(1,1)`: 6 + 8 = 14
- From `(1,2)`: 5 + 8 = 13
  Minimum is 13.

To reach cell `(2,2)`:

- From `(1,1)`: 6 + 9 = 15
- From `(1,2)`: 5 + 9 = 14
  Minimum is 14.

The minimum falling path sum is the minimum value in the last row: min(13, 13, 14) = 13. The path would be: 1 → 5 → 7 (starting at `(0,1)` with value 1, moving to `(1,1)` with value 5, then to `(2,0)` with value 7).

## Brute Force Approach

The brute force approach would be to explore all possible falling paths. Starting from each cell in the first row, we could use DFS/backtracking to try all possible moves to the next row. For an n×n matrix, each cell (except edge cells) has 3 possible moves to the next row, leading to approximately 3^n possible paths.

The problem with this approach is its exponential time complexity. For n=100, we'd have 3^100 possible paths—an astronomically large number that makes this approach completely impractical. Even for moderate n values (like n=20), this would be too slow.

## Optimized Approach

The key insight is that this problem has **optimal substructure**: the minimum path sum to reach cell `(i,j)` depends only on the minimum path sums to reach cells `(i-1,j-1)`, `(i-1,j)`, and `(i-1,j+1)` in the previous row. This means we can solve the problem using **dynamic programming**.

Here's the step-by-step reasoning:

1. **Define the DP state**: Let `dp[i][j]` represent the minimum falling path sum to reach cell `(i,j)`.

2. **Base case**: For the first row, `dp[0][j] = matrix[0][j]` because any path starting at row 0 must begin at that cell.

3. **Recurrence relation**: For any cell `(i,j)` where `i > 0`:
   - We can reach it from `(i-1,j-1)` (diagonally left above), `(i-1,j)` (directly above), or `(i-1,j+1)` (diagonally right above)
   - We need to handle edge cases: if `j=0`, we can't come from left; if `j=n-1`, we can't come from right
   - So: `dp[i][j] = matrix[i][j] + min(dp[i-1][j-1], dp[i-1][j], dp[i-1][j+1])` with bounds checking

4. **Final answer**: The minimum falling path sum is `min(dp[n-1][j])` for all j in the last row.

We can optimize space by noticing that we only need the previous row to compute the current row, so we can use O(n) space instead of O(n²).

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n) - optimized space version
def minFallingPathSum(matrix):
    """
    Returns the minimum sum of any falling path through the matrix.

    A falling path starts at any element in the first row and chooses
    an element in the next row that is either directly below or diagonally
    left/right.
    """
    n = len(matrix)

    # We only need to keep track of the previous row's dp values
    # Start with the first row as our initial "previous row"
    prev_row = matrix[0][:]

    # Process each row starting from the second row
    for i in range(1, n):
        # Create a new array for the current row's dp values
        curr_row = [0] * n

        for j in range(n):
            # Start with the value directly above
            min_prev = prev_row[j]

            # Check diagonally left (if not in first column)
            if j > 0:
                min_prev = min(min_prev, prev_row[j-1])

            # Check diagonally right (if not in last column)
            if j < n - 1:
                min_prev = min(min_prev, prev_row[j+1])

            # Current cell's minimum path sum = current value + minimum of possible previous cells
            curr_row[j] = matrix[i][j] + min_prev

        # Update previous row for next iteration
        prev_row = curr_row

    # The answer is the minimum value in the last row (now stored in prev_row)
    return min(prev_row)
```

```javascript
// Time: O(n²) | Space: O(n) - optimized space version
function minFallingPathSum(matrix) {
  /**
   * Returns the minimum sum of any falling path through the matrix.
   *
   * A falling path starts at any element in the first row and chooses
   * an element in the next row that is either directly below or diagonally
   * left/right.
   */
  const n = matrix.length;

  // We only need to keep track of the previous row's dp values
  // Start with the first row as our initial "previous row"
  let prevRow = [...matrix[0]];

  // Process each row starting from the second row
  for (let i = 1; i < n; i++) {
    // Create a new array for the current row's dp values
    const currRow = new Array(n).fill(0);

    for (let j = 0; j < n; j++) {
      // Start with the value directly above
      let minPrev = prevRow[j];

      // Check diagonally left (if not in first column)
      if (j > 0) {
        minPrev = Math.min(minPrev, prevRow[j - 1]);
      }

      // Check diagonally right (if not in last column)
      if (j < n - 1) {
        minPrev = Math.min(minPrev, prevRow[j + 1]);
      }

      // Current cell's minimum path sum = current value + minimum of possible previous cells
      currRow[j] = matrix[i][j] + minPrev;
    }

    // Update previous row for next iteration
    prevRow = currRow;
  }

  // The answer is the minimum value in the last row (now stored in prevRow)
  return Math.min(...prevRow);
}
```

```java
// Time: O(n²) | Space: O(n) - optimized space version
class Solution {
    public int minFallingPathSum(int[][] matrix) {
        /**
         * Returns the minimum sum of any falling path through the matrix.
         *
         * A falling path starts at any element in the first row and chooses
         * an element in the next row that is either directly below or diagonally
         * left/right.
         */
        int n = matrix.length;

        // We only need to keep track of the previous row's dp values
        // Start with the first row as our initial "previous row"
        int[] prevRow = matrix[0].clone();

        // Process each row starting from the second row
        for (int i = 1; i < n; i++) {
            // Create a new array for the current row's dp values
            int[] currRow = new int[n];

            for (int j = 0; j < n; j++) {
                // Start with the value directly above
                int minPrev = prevRow[j];

                // Check diagonally left (if not in first column)
                if (j > 0) {
                    minPrev = Math.min(minPrev, prevRow[j - 1]);
                }

                // Check diagonally right (if not in last column)
                if (j < n - 1) {
                    minPrev = Math.min(minPrev, prevRow[j + 1]);
                }

                // Current cell's minimum path sum = current value + minimum of possible previous cells
                currRow[j] = matrix[i][j] + minPrev;
            }

            // Update previous row for next iteration
            prevRow = currRow;
        }

        // The answer is the minimum value in the last row (now stored in prevRow)
        int minSum = Integer.MAX_VALUE;
        for (int num : prevRow) {
            minSum = Math.min(minSum, num);
        }
        return minSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We iterate through each of the n rows (except the first one)
- For each row, we iterate through all n columns
- Inside the inner loop, we perform constant-time operations (comparisons and additions)
- Total operations: (n-1) × n × O(1) = O(n²)

**Space Complexity: O(n)**

- We only store two arrays of size n: `prevRow` and `currRow`
- This is the space-optimized version. A simpler implementation would use O(n²) space by storing the entire dp table
- The input matrix itself is O(n²), but we're not counting that as extra space since it's given

## Common Mistakes

1. **Forgetting to handle edge columns**: When j=0, you can't check j-1; when j=n-1, you can't check j+1. Forgetting these bounds checks leads to index out of bounds errors.

2. **Using the wrong recurrence relation**: Some candidates mistakenly think you can only move directly down or to adjacent cells in the same row. Remember: you move to the next row, choosing from the cell directly below or diagonally left/right.

3. **Not optimizing space**: While using O(n²) space is acceptable, interviewers appreciate when you notice that you only need the previous row. Mentioning this optimization shows deeper understanding.

4. **Incorrect initialization**: The base case should be `dp[0][j] = matrix[0][j]`, not `dp[0][j] = 0`. The path sum starts with the value of the starting cell.

## When You'll See This Pattern

This is a classic **2D dynamic programming** problem with a **row-by-row dependency**. You'll see similar patterns in:

1. **Triangle (LeetCode 120)**: Find the minimum path sum from top to bottom of a triangle where you can move to adjacent numbers on the next row. The recurrence is very similar: `dp[i][j] = triangle[i][j] + min(dp[i-1][j-1], dp[i-1][j])`.

2. **Minimum Path Sum (LeetCode 64)**: Find the minimum path sum from top-left to bottom-right of a grid, moving only right or down. The recurrence is `dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`.

3. **Paint House (LeetCode 256)**: Given costs of painting houses with certain colors, find the minimum cost such that no two adjacent houses have the same color. The DP state tracks the minimum cost ending with each color.

## Key Takeaways

1. **Recognize optimal substructure**: When the optimal solution to a problem depends on optimal solutions to its subproblems, dynamic programming is often the right approach.

2. **Look for row/column dependencies**: In matrix DP problems, check if the value at `(i,j)` depends only on values in the previous row/column. This allows for space optimization.

3. **Boundary conditions matter**: Edge cases (first/last row/column) often require special handling in DP problems. Always test your solution with small edge cases.

Related problems: [Minimum Falling Path Sum II](/problem/minimum-falling-path-sum-ii)
