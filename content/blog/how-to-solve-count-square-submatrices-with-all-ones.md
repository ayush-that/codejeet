---
title: "How to Solve Count Square Submatrices with All Ones — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Square Submatrices with All Ones. Medium difficulty, 80.7% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2027-05-27"
category: "dsa-patterns"
tags: ["count-square-submatrices-with-all-ones", "array", "dynamic-programming", "matrix", "medium"]
---

# How to Solve Count Square Submatrices with All Ones

You're given an `m x n` matrix filled with 0s and 1s, and you need to count all square submatrices that contain only 1s. This problem is interesting because while a brute force approach seems straightforward, it's too slow for typical constraints. The optimal solution requires a clever dynamic programming insight: each cell can tell you the size of the largest square ending at that cell, and that information directly gives you the count of squares ending there.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this 3x3 matrix:

```
1 1 1
1 1 1
1 1 1
```

We want to count all square submatrices with all ones. Let's think about what squares end at position (2,2) - the bottom-right corner:

1. **1x1 square**: Just the cell (2,2) itself → 1 square
2. **2x2 square**: Cells (1,1), (1,2), (2,1), (2,2) → 1 square
3. **3x3 square**: The entire matrix → 1 square

So position (2,2) contributes 3 squares. But wait - we can't just count these independently for each cell because squares overlap. The key insight is: if we know the largest square ending at (2,2) is size 3, then there are exactly 3 squares ending there (sizes 1, 2, and 3).

Let's look at a more interesting example:

```
1 0 1
1 1 0
1 1 0
```

At position (2,2):

- Cell (2,2) is 1 → contributes 1x1 square
- Check neighbors: (1,1)=1, (1,2)=1, (2,1)=1 → can form 2x2 square
- So largest square ending at (2,2) is size 2 → contributes 2 squares (1x1 and 2x2)

This pattern gives us a dynamic programming approach: `dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1` when `matrix[i][j] = 1`.

## Brute Force Approach

The brute force solution checks every possible square submatrix. For each cell `(i,j)` as the top-left corner, we try all possible square sizes `k` from 1 up to `min(m-i, n-j)`. For each size, we check if all cells in the `k x k` square are 1s.

<div class="code-group">

```python
# Time: O(m * n * min(m,n)³) | Space: O(1)
def countSquaresBruteForce(matrix):
    m, n = len(matrix), len(matrix[0])
    count = 0

    # Try every possible top-left corner
    for i in range(m):
        for j in range(n):
            # Try every possible square size
            max_size = min(m - i, n - j)
            for size in range(1, max_size + 1):
                # Check if this size x size square has all ones
                valid = True
                for x in range(i, i + size):
                    for y in range(j, j + size):
                        if matrix[x][y] == 0:
                            valid = False
                            break
                    if not valid:
                        break

                if valid:
                    count += 1
                else:
                    # If this size fails, larger sizes will also fail
                    break

    return count
```

```javascript
// Time: O(m * n * min(m,n)³) | Space: O(1)
function countSquaresBruteForce(matrix) {
  const m = matrix.length,
    n = matrix[0].length;
  let count = 0;

  // Try every possible top-left corner
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Try every possible square size
      const maxSize = Math.min(m - i, n - j);
      for (let size = 1; size <= maxSize; size++) {
        // Check if this size x size square has all ones
        let valid = true;
        for (let x = i; x < i + size; x++) {
          for (let y = j; y < j + size; y++) {
            if (matrix[x][y] === 0) {
              valid = false;
              break;
            }
          }
          if (!valid) break;
        }

        if (valid) {
          count++;
        } else {
          // If this size fails, larger sizes will also fail
          break;
        }
      }
    }
  }

  return count;
}
```

```java
// Time: O(m * n * min(m,n)³) | Space: O(1)
public int countSquaresBruteForce(int[][] matrix) {
    int m = matrix.length, n = matrix[0].length;
    int count = 0;

    // Try every possible top-left corner
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            // Try every possible square size
            int maxSize = Math.min(m - i, n - j);
            for (int size = 1; size <= maxSize; size++) {
                // Check if this size x size square has all ones
                boolean valid = true;
                for (int x = i; x < i + size; x++) {
                    for (int y = j; y < j + size; y++) {
                        if (matrix[x][y] == 0) {
                            valid = false;
                            break;
                        }
                    }
                    if (!valid) break;
                }

                if (valid) {
                    count++;
                } else {
                    // If this size fails, larger sizes will also fail
                    break;
                }
            }
        }
    }

    return count;
}
```

</div>

**Why it's too slow**: With four nested loops, the time complexity is roughly O(m × n × min(m,n)³). For a 100×100 matrix, that's about 100×100×100³ = 10¹⁰ operations, which is far too slow. We need a more efficient approach.

## Optimized Approach

The key insight is dynamic programming. For each cell `(i,j)`, we want to know: "What is the size of the largest square that ends at this cell (using this cell as the bottom-right corner)?"

If `matrix[i][j] = 0`, then no square can end here, so `dp[i][j] = 0`.

If `matrix[i][j] = 1`, then:

- It can form a 1×1 square by itself
- It can form a larger square only if all three neighboring cells (above, left, and diagonal above-left) can also form squares

The recurrence relation is:

```
dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
```

Why the minimum? Because a square ending at `(i,j)` can only be as large as the smallest square ending at its neighbors. Think of it like this: if your neighbors can form squares of sizes 2, 3, and 2, then you can only form a square of size 2+1=3 (the minimum plus one).

The beautiful part: `dp[i][j]` not only gives us the largest square ending at `(i,j)`, but also the COUNT of squares ending there! If the largest square is size `k`, then there are exactly `k` squares ending at `(i,j)` (sizes 1 through `k`).

## Optimal Solution

Here's the complete dynamic programming solution:

<div class="code-group">

```python
# Time: O(m * n) | Space: O(m * n) [can be optimized to O(n)]
def countSquares(matrix):
    """
    Count all square submatrices with all ones.

    Args:
        matrix: List[List[int]] - binary matrix with 0s and 1s

    Returns:
        int - total count of square submatrices with all ones
    """
    m, n = len(matrix), len(matrix[0])

    # Create DP table with same dimensions as matrix
    # dp[i][j] = size of largest square ending at (i,j)
    dp = [[0] * n for _ in range(m)]

    total_squares = 0

    # Fill DP table
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == 1:
                # For first row or first column, largest square is just 1
                if i == 0 or j == 0:
                    dp[i][j] = 1
                else:
                    # Recurrence relation: check three neighbors
                    dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1

                # Add to total count (dp[i][j] equals count of squares ending here)
                total_squares += dp[i][j]

    return total_squares


# Space-optimized version using only 2 rows
def countSquaresOptimized(matrix):
    """Space-optimized version using O(n) space."""
    m, n = len(matrix), len(matrix[0])

    # Use only 2 rows: current and previous
    prev = [0] * n
    curr = [0] * n

    total_squares = 0

    for i in range(m):
        for j in range(n):
            if matrix[i][j] == 1:
                if i == 0 or j == 0:
                    curr[j] = 1
                else:
                    # min(above, left, diagonal)
                    curr[j] = min(prev[j], curr[j-1], prev[j-1]) + 1

                total_squares += curr[j]
            else:
                curr[j] = 0

        # Move to next row: current becomes previous
        prev, curr = curr, prev
        # Reset current row for next iteration
        curr = [0] * n

    return total_squares
```

```javascript
// Time: O(m * n) | Space: O(m * n) [can be optimized to O(n)]
function countSquares(matrix) {
  /**
   * Count all square submatrices with all ones.
   *
   * @param {number[][]} matrix - binary matrix with 0s and 1s
   * @return {number} - total count of square submatrices with all ones
   */
  const m = matrix.length,
    n = matrix[0].length;

  // Create DP table with same dimensions as matrix
  // dp[i][j] = size of largest square ending at (i,j)
  const dp = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  let totalSquares = 0;

  // Fill DP table
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 1) {
        // For first row or first column, largest square is just 1
        if (i === 0 || j === 0) {
          dp[i][j] = 1;
        } else {
          // Recurrence relation: check three neighbors
          dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
        }

        // Add to total count (dp[i][j] equals count of squares ending here)
        totalSquares += dp[i][j];
      }
      // dp[i][j] remains 0 if matrix[i][j] === 0
    }
  }

  return totalSquares;
}

// Space-optimized version using only 2 rows
function countSquaresOptimized(matrix) {
  /** Space-optimized version using O(n) space. */
  const m = matrix.length,
    n = matrix[0].length;

  // Use only 2 rows: previous and current
  let prev = new Array(n).fill(0);
  let curr = new Array(n).fill(0);

  let totalSquares = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 1) {
        if (i === 0 || j === 0) {
          curr[j] = 1;
        } else {
          // min(above, left, diagonal)
          curr[j] = Math.min(prev[j], curr[j - 1], prev[j - 1]) + 1;
        }

        totalSquares += curr[j];
      } else {
        curr[j] = 0;
      }
    }

    // Move to next row: current becomes previous
    [prev, curr] = [curr, prev];
    // Reset current row for next iteration
    curr = new Array(n).fill(0);
  }

  return totalSquares;
}
```

```java
// Time: O(m * n) | Space: O(m * n) [can be optimized to O(n)]
class Solution {
    public int countSquares(int[][] matrix) {
        /**
         * Count all square submatrices with all ones.
         *
         * @param matrix - binary matrix with 0s and 1s
         * @return total count of square submatrices with all ones
         */
        int m = matrix.length, n = matrix[0].length;

        // Create DP table with same dimensions as matrix
        // dp[i][j] = size of largest square ending at (i,j)
        int[][] dp = new int[m][n];

        int totalSquares = 0;

        // Fill DP table
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 1) {
                    // For first row or first column, largest square is just 1
                    if (i == 0 || j == 0) {
                        dp[i][j] = 1;
                    } else {
                        // Recurrence relation: check three neighbors
                        dp[i][j] = Math.min(Math.min(dp[i-1][j], dp[i][j-1]), dp[i-1][j-1]) + 1;
                    }

                    // Add to total count (dp[i][j] equals count of squares ending here)
                    totalSquares += dp[i][j];
                }
                // dp[i][j] remains 0 if matrix[i][j] == 0
            }
        }

        return totalSquares;
    }
}


// Space-optimized version using only 2 rows
class SolutionOptimized {
    public int countSquares(int[][] matrix) {
        /** Space-optimized version using O(n) space. */
        int m = matrix.length, n = matrix[0].length;

        // Use only 2 rows: previous and current
        int[] prev = new int[n];
        int[] curr = new int[n];

        int totalSquares = 0;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 1) {
                    if (i == 0 || j == 0) {
                        curr[j] = 1;
                    } else {
                        // min(above, left, diagonal)
                        curr[j] = Math.min(Math.min(prev[j], curr[j-1]), prev[j-1]) + 1;
                    }

                    totalSquares += curr[j];
                } else {
                    curr[j] = 0;
                }
            }

            // Move to next row: current becomes previous
            int[] temp = prev;
            prev = curr;
            curr = temp;
            // Reset current row for next iteration
            Arrays.fill(curr, 0);
        }

        return totalSquares;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(m × n)

- We iterate through each cell of the m × n matrix exactly once
- For each cell, we do constant-time operations (comparisons and addition)

**Space Complexity**:

- Basic DP solution: O(m × n) for the DP table
- Optimized version: O(n) by keeping only two rows at a time
- Can be further optimized to O(1) by modifying the input matrix in-place (if allowed)

The O(m × n) time is optimal because we must examine each cell at least once to determine if it contributes to any squares.

## Common Mistakes

1. **Forgetting the base cases (first row/first column)**: When `i == 0` or `j == 0`, we can't check all three neighbors because they don't exist. The largest (and only) square ending there is size 1 if the cell contains 1.

2. **Incorrect recurrence relation**: Using `max` instead of `min` is a common error. Remember: a square can only extend if ALL three neighboring positions can support it. The limiting factor is the smallest square among neighbors.

3. **Not understanding why dp[i][j] gives the count**: Some candidates try to track counts separately. The insight is that if the largest square ending at (i,j) has size k, then there are exactly k squares ending there (sizes 1 through k).

4. **Off-by-one errors in indices**: When accessing `dp[i-1][j-1]`, ensure i > 0 and j > 0. This is why we handle the first row and column as special cases.

## When You'll See This Pattern

This "min of neighbors + 1" pattern appears in several grid-based DP problems:

1. **Maximal Square** (LeetCode 221): Almost identical problem - instead of counting all squares, find the area of the largest square. Uses the exact same DP recurrence.

2. **Largest Plus Sign** (LeetCode 764): Similar concept but in four directions instead of squares. You track the minimum extension in each direction.

3. **Count Submatrices With All Ones** (LeetCode 1504): A harder variation that counts all rectangular submatrices, not just squares. Requires a different approach with histogram method.

The core pattern is: when a cell's value depends on its neighbors in multiple directions, think about dynamic programming with a recurrence relation that combines information from those neighbors.

## Key Takeaways

1. **DP for grid problems**: When a problem involves finding patterns in a grid (squares, rectangles, paths), dynamic programming is often the key. Each cell's value depends on its neighbors.

2. **The min trick for squares**: For square-related problems, the recurrence `dp[i][j] = min(neighbors) + 1` is powerful. It works because a square can only be as strong as its weakest corner.

3. **Count vs size**: Remember that if the largest square ending at a cell has size k, then there are k squares ending there. This lets you compute counts directly from sizes without extra work.

Related problems: [Minimum Cost Homecoming of a Robot in a Grid](/problem/minimum-cost-homecoming-of-a-robot-in-a-grid), [Count Fertile Pyramids in a Land](/problem/count-fertile-pyramids-in-a-land)
