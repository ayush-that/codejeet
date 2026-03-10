---
title: "How to Solve Maximal Square — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximal Square. Medium difficulty, 50.0% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2026-11-05"
category: "dsa-patterns"
tags: ["maximal-square", "array", "dynamic-programming", "matrix", "medium"]
---

# How to Solve Maximal Square

You're given an `m x n` binary matrix filled with `0`s and `1`s, and you need to find the largest square containing only `1`s, returning its area. What makes this problem interesting is that squares have a strict constraint—all four sides must be equal length, and every cell inside must be `1`. This is trickier than finding rectangles because a single `0` anywhere in a potential square invalidates the entire square.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Matrix:
1 0 1 0 0
1 0 1 1 1
1 1 1 1 1
1 0 0 1 0
```

We're looking for the largest square of all `1`s. Let's think about how we might check for squares:

1. **Starting at (0,0)**: The cell is `1`, so we could have a 1x1 square (area = 1)
2. **Starting at (0,2)**: Another 1x1 square
3. **Starting at (1,2)**: This is `1`, and if we check:
   - Right: (1,3) is `1`
   - Down: (2,2) is `1`
   - Diagonal: (2,3) is `1`
     This forms a 2x2 square! Area = 4
4. **Starting at (1,3)**: This is `1`, and checking:
   - Right: (1,4) is `1`
   - Down: (2,3) is `1`
   - Diagonal: (2,4) is `1`
     Another 2x2 square
5. **Starting at (2,1)**: This is `1`, and we can check for a 3x3:
   - Check all cells from (2,1) to (4,3) - but wait, (3,1) is `0`, so no 3x3 here

The largest square we found is 2x2 with area 4. But is there a better way than checking every possible starting point and size?

## Brute Force Approach

The most straightforward approach is to check every possible square in the matrix:

1. For each cell `(i, j)` that contains `1`
2. For each possible square size `k` starting from 1
3. Check if all cells in the `k x k` square starting at `(i, j)` are `1`
4. Keep track of the maximum `k` found

The checking step for a `k x k` square takes O(k²) time, and we have O(m × n) starting points with O(min(m, n)) possible sizes. This gives us O(m × n × min(m, n)³) time complexity, which is far too slow for typical constraints (m, n up to 300).

Even with a slightly optimized check that stops as soon as we find a `0`, we're still looking at O(m × n × min(m, n)²) worst-case time. We need a better approach.

## Optimized Approach

The key insight is that we can use **dynamic programming** to build up solutions from smaller subproblems. For each cell `(i, j)`, we ask: "What is the size of the largest square that ends at this cell (using this cell as the bottom-right corner)?"

Here's the crucial observation:

- If `matrix[i][j] = 0`, no square can end here, so `dp[i][j] = 0`
- If `matrix[i][j] = 1`, then the largest square ending at `(i, j)` is limited by:
  1. The square ending at `(i-1, j)` (above)
  2. The square ending at `(i, j-1)` (left)
  3. The square ending at `(i-1, j-1)` (diagonal)

Why? Because for `(i, j)` to be the bottom-right corner of a `k x k` square:

- `(i-1, j)` must be bottom-right of at least a `(k-1) x (k-1)` square
- `(i, j-1)` must be bottom-right of at least a `(k-1) x (k-1)` square
- `(i-1, j-1)` must be bottom-right of at least a `(k-1) x (k-1)` square

So `dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1`

This reduces our problem to filling a DP table where each cell depends only on three neighboring cells.

## Optimal Solution

Here's the complete dynamic programming solution with detailed comments:

<div class="code-group">

```python
# Time: O(m × n) | Space: O(m × n)
def maximalSquare(matrix):
    """
    Find the largest square containing only 1's in a binary matrix.

    Args:
        matrix: List[List[str]] - binary matrix with '0' and '1' characters

    Returns:
        int - area of the largest square
    """
    if not matrix or not matrix[0]:
        return 0

    m, n = len(matrix), len(matrix[0])

    # dp[i][j] will store the side length of the largest square
    # that ends at cell (i, j) (using it as bottom-right corner)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    max_side = 0  # Track the maximum side length found

    # Fill the DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            # Check if current cell in original matrix is '1'
            if matrix[i - 1][j - 1] == '1':
                # The size of square ending at (i, j) is limited by
                # the smallest square ending at its top, left, and top-left neighbors
                dp[i][j] = min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1

                # Update maximum side length
                max_side = max(max_side, dp[i][j])

    # Return area = side × side
    return max_side * max_side
```

```javascript
// Time: O(m × n) | Space: O(m × n)
function maximalSquare(matrix) {
  /**
   * Find the largest square containing only 1's in a binary matrix.
   *
   * @param {character[][]} matrix - binary matrix with '0' and '1' characters
   * @return {number} - area of the largest square
   */
  if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
    return 0;
  }

  const m = matrix.length;
  const n = matrix[0].length;

  // dp[i][j] will store the side length of the largest square
  // that ends at cell (i, j) (using it as bottom-right corner)
  // We use (m+1) x (n+1) to avoid boundary checks
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  let maxSide = 0; // Track the maximum side length found

  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // Check if current cell in original matrix is '1'
      if (matrix[i - 1][j - 1] === "1") {
        // The size of square ending at (i, j) is limited by
        // the smallest square ending at its top, left, and top-left neighbors
        dp[i][j] =
          Math.min(
            dp[i - 1][j], // cell above
            dp[i][j - 1], // cell to the left
            dp[i - 1][j - 1] // cell diagonally above-left
          ) + 1;

        // Update maximum side length
        maxSide = Math.max(maxSide, dp[i][j]);
      }
    }
  }

  // Return area = side × side
  return maxSide * maxSide;
}
```

```java
// Time: O(m × n) | Space: O(m × n)
class Solution {
    public int maximalSquare(char[][] matrix) {
        /**
         * Find the largest square containing only 1's in a binary matrix.
         *
         * @param matrix - binary matrix with '0' and '1' characters
         * @return area of the largest square
         */
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return 0;
        }

        int m = matrix.length;
        int n = matrix[0].length;

        // dp[i][j] will store the side length of the largest square
        // that ends at cell (i, j) (using it as bottom-right corner)
        // We use (m+1) x (n+1) to avoid boundary checks
        int[][] dp = new int[m + 1][n + 1];

        int maxSide = 0;  // Track the maximum side length found

        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                // Check if current cell in original matrix is '1'
                if (matrix[i - 1][j - 1] == '1') {
                    // The size of square ending at (i, j) is limited by
                    // the smallest square ending at its top, left, and top-left neighbors
                    dp[i][j] = Math.min(
                        Math.min(dp[i - 1][j],     // cell above
                                 dp[i][j - 1]),    // cell to the left
                        dp[i - 1][j - 1]           // cell diagonally above-left
                    ) + 1;

                    // Update maximum side length
                    maxSide = Math.max(maxSide, dp[i][j]);
                }
            }
        }

        // Return area = side × side
        return maxSide * maxSide;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We iterate through each cell of the matrix exactly once
- For each cell, we perform constant-time operations (min of three values and an addition)

**Space Complexity: O(m × n)**

- We create a DP table of size (m+1) × (n+1)
- Note: We could optimize to O(n) space by only keeping the current and previous rows, since each cell only needs values from the row above

## Common Mistakes

1. **Forgetting to handle empty matrix**: Always check if the input matrix is empty or has zero columns. This is an easy edge case to miss.

2. **Using the wrong DP recurrence**: Some candidates try `max()` instead of `min()`. Remember: a square is only as strong as its weakest link. If any of the three neighboring cells can't support a large square, the current cell can't either.

3. **Off-by-one errors with indices**: When using a DP table with dimensions (m+1) × (n+1), remember to access `matrix[i-1][j-1]` not `matrix[i][j]`. The extra row and column of zeros in the DP table handle boundary conditions.

4. **Returning side length instead of area**: The problem asks for area, not side length. Don't forget to square your result before returning.

## When You'll See This Pattern

This "2D dynamic programming with min of neighbors" pattern appears in several matrix problems:

1. **Maximal Rectangle (Hard)**: A more general version where you find the largest rectangle (not just square). The solution often involves treating each row as a histogram and finding the largest rectangle in it.

2. **Largest Plus Sign (Medium)**: Similar concept but extending in four directions (up, down, left, right) instead of just building squares.

3. **Count Square Submatrices with All Ones (Medium)**: Almost identical to this problem but asks you to count all squares instead of just finding the largest.

4. **01 Matrix (Medium)**: Finding distances to nearest zero uses a similar two-pass DP approach, updating based on neighbors.

The core idea is that when a problem asks for some maximal shape in a grid, and the shape has constraints that depend on adjacent cells, dynamic programming is often the right approach.

## Key Takeaways

1. **Think about ending points**: Instead of thinking "what square starts here?", think "what square ends here?" This reversal often simplifies DP formulations.

2. **Squares are limited by minimum neighbors**: For a cell to be the bottom-right corner of a k×k square, its top, left, and top-left neighbors must all be bottom-right corners of at least (k-1)×(k-1) squares. This gives us the `min(neighbors) + 1` recurrence.

3. **Add buffer rows/columns for cleaner code**: Using a DP table with dimensions (m+1)×(n+1) with the first row and column initialized to 0 eliminates special cases for boundary cells.

Related problems: [Maximal Rectangle](/problem/maximal-rectangle), [Largest Plus Sign](/problem/largest-plus-sign), [Count Artifacts That Can Be Extracted](/problem/count-artifacts-that-can-be-extracted)
