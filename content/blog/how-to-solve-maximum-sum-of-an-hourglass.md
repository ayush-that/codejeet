---
title: "How to Solve Maximum Sum of an Hourglass — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Sum of an Hourglass. Medium difficulty, 76.4% acceptance rate. Topics: Array, Matrix, Prefix Sum."
date: "2028-06-20"
category: "dsa-patterns"
tags: ["maximum-sum-of-an-hourglass", "array", "matrix", "prefix-sum", "medium"]
---

# How to Solve Maximum Sum of an Hourglass

This problem asks us to find the maximum sum of elements in an hourglass-shaped pattern within a 2D matrix. An hourglass consists of 7 cells: the top row (3 cells), the middle cell, and the bottom row (3 cells). The challenge is efficiently scanning all possible hourglass positions in the matrix without redundant calculations.

What makes this problem interesting is that while it appears straightforward, it tests your ability to work with 2D array indices carefully and recognize when a brute force approach is actually optimal. Many candidates overcomplicate this problem by trying to use prefix sums when simple iteration is sufficient.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:  1  2  3  4
       5  6  7  8
       9 10 11 12
```

An hourglass needs 3 columns and 3 rows, so valid starting positions are limited:

- Starting at (0,0): Top row: 1+2+3 = 6, Middle: 6 = 6, Bottom: 9+10+11 = 30, Total = 42
- Starting at (0,1): Top: 2+3+4 = 9, Middle: 7 = 7, Bottom: 10+11+12 = 33, Total = 49

Since we have 2 possible rows (0,1) and 2 possible columns (0,1), we need to check 4 hourglasses total. The maximum sum is 49.

The key insight: For an m×n grid, hourglasses can only start at positions where row ≤ m-3 and column ≤ n-3, giving us (m-2)×(n-2) possible hourglasses to check.

## Brute Force Approach

The most straightforward solution is to iterate through all possible starting positions for hourglasses and calculate each sum from scratch. For each valid starting position (i,j), we sum:

- grid[i][j] + grid[i][j+1] + grid[i][j+2] (top row)
- grid[i+1][j+1] (middle)
- grid[i+2][j] + grid[i+2][j+1] + grid[i+2][j+2] (bottom row)

This approach is actually optimal for this problem! The "brute force" here is reasonable because:

1. Each hourglass has only 7 elements, so calculating each sum is O(1)
2. There are only (m-2)×(n-2) hourglasses to check
3. The total time complexity is O(m×n), which is the best we can do since we need to examine the matrix

Some candidates might try to over-optimize with prefix sums, but that would actually be slower in practice due to the overhead and the fact that we're dealing with small, fixed-size windows.

## Optimized Approach

Since the brute force is already optimal, let's focus on writing clean, correct code with careful boundary handling. The key steps are:

1. **Validate input**: Check if the grid is too small to contain any hourglass (m < 3 or n < 3)
2. **Iterate through valid starting positions**: For i from 0 to m-3, for j from 0 to n-3
3. **Calculate hourglass sum**: Sum the 7 elements in the hourglass pattern
4. **Track maximum**: Keep updating the maximum sum found

The main challenge is getting the indices right and handling edge cases properly.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(m*n) | Space: O(1)
def maxSum(grid):
    """
    Find the maximum hourglass sum in the grid.

    Args:
        grid: List[List[int]] - 2D matrix of integers

    Returns:
        int - Maximum hourglass sum, or 0 if no hourglass exists
    """
    m = len(grid)      # Number of rows
    n = len(grid[0])   # Number of columns

    # Edge case: grid is too small to contain any hourglass
    # Hourglass needs at least 3 rows and 3 columns
    if m < 3 or n < 3:
        return 0

    max_sum = float('-inf')  # Initialize with negative infinity to handle negative values

    # Iterate through all possible top-left positions of hourglasses
    # Last valid starting row is m-3 (need 2 more rows below)
    # Last valid starting column is n-3 (need 2 more columns to the right)
    for i in range(m - 2):
        for j in range(n - 2):
            # Calculate sum of current hourglass
            # Top row: grid[i][j] + grid[i][j+1] + grid[i][j+2]
            # Middle: grid[i+1][j+1]
            # Bottom row: grid[i+2][j] + grid[i+2][j+1] + grid[i+2][j+2]
            current_sum = (
                grid[i][j] + grid[i][j+1] + grid[i][j+2] +  # Top row
                grid[i+1][j+1] +                            # Middle
                grid[i+2][j] + grid[i+2][j+1] + grid[i+2][j+2]  # Bottom row
            )

            # Update maximum sum if current is larger
            max_sum = max(max_sum, current_sum)

    return max_sum
```

```javascript
// Time: O(m*n) | Space: O(1)
/**
 * Find the maximum hourglass sum in the grid.
 *
 * @param {number[][]} grid - 2D matrix of integers
 * @return {number} - Maximum hourglass sum, or 0 if no hourglass exists
 */
function maxSum(grid) {
  const m = grid.length; // Number of rows
  const n = grid[0].length; // Number of columns

  // Edge case: grid is too small to contain any hourglass
  // Hourglass needs at least 3 rows and 3 columns
  if (m < 3 || n < 3) {
    return 0;
  }

  let maxSum = -Infinity; // Initialize with negative infinity to handle negative values

  // Iterate through all possible top-left positions of hourglasses
  // Last valid starting row is m-3 (need 2 more rows below)
  // Last valid starting column is n-3 (need 2 more columns to the right)
  for (let i = 0; i <= m - 3; i++) {
    for (let j = 0; j <= n - 3; j++) {
      // Calculate sum of current hourglass
      // Top row: grid[i][j] + grid[i][j+1] + grid[i][j+2]
      // Middle: grid[i+1][j+1]
      // Bottom row: grid[i+2][j] + grid[i+2][j+1] + grid[i+2][j+2]
      const currentSum =
        grid[i][j] +
        grid[i][j + 1] +
        grid[i][j + 2] + // Top row
        grid[i + 1][j + 1] + // Middle
        grid[i + 2][j] +
        grid[i + 2][j + 1] +
        grid[i + 2][j + 2]; // Bottom row

      // Update maximum sum if current is larger
      maxSum = Math.max(maxSum, currentSum);
    }
  }

  return maxSum;
}
```

```java
// Time: O(m*n) | Space: O(1)
class Solution {
    /**
     * Find the maximum hourglass sum in the grid.
     *
     * @param grid - 2D matrix of integers
     * @return Maximum hourglass sum, or 0 if no hourglass exists
     */
    public int maxSum(int[][] grid) {
        int m = grid.length;      // Number of rows
        int n = grid[0].length;   // Number of columns

        // Edge case: grid is too small to contain any hourglass
        // Hourglass needs at least 3 rows and 3 columns
        if (m < 3 || n < 3) {
            return 0;
        }

        int maxSum = Integer.MIN_VALUE;  // Initialize with minimum value to handle negatives

        // Iterate through all possible top-left positions of hourglasses
        // Last valid starting row is m-3 (need 2 more rows below)
        // Last valid starting column is n-3 (need 2 more columns to the right)
        for (int i = 0; i <= m - 3; i++) {
            for (int j = 0; j <= n - 3; j++) {
                // Calculate sum of current hourglass
                // Top row: grid[i][j] + grid[i][j+1] + grid[i][j+2]
                // Middle: grid[i+1][j+1]
                // Bottom row: grid[i+2][j] + grid[i+2][j+1] + grid[i+2][j+2]
                int currentSum =
                    grid[i][j] + grid[i][j+1] + grid[i][j+2] +     // Top row
                    grid[i+1][j+1] +                               // Middle
                    grid[i+2][j] + grid[i+2][j+1] + grid[i+2][j+2]; // Bottom row

                // Update maximum sum if current is larger
                maxSum = Math.max(maxSum, currentSum);
            }
        }

        return maxSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n)**

- We iterate through (m-2)×(n-2) possible hourglass starting positions
- For each position, we perform O(1) operations (summing 7 elements)
- In the worst case where m and n are large, (m-2)×(n-2) ≈ m×n
- Therefore, time complexity is O(m×n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space (variables for m, n, max_sum, current_sum, loop indices)
- No additional data structures are created that scale with input size

## Common Mistakes

1. **Off-by-one errors in loop boundaries**: The most common mistake is using `range(m-2)` instead of `range(m-2)` (Python) or `i < m-2` instead of `i <= m-3` (Java/JavaScript). Remember: if you start at row i, you need rows i, i+1, and i+2, so i can be at most m-3.

2. **Not handling small grids**: Forgetting to check if m < 3 or n < 3 will cause index out of bounds errors when trying to access grid[i+2][j+2].

3. **Initializing max_sum to 0**: If all values in the grid are negative, the maximum hourglass sum will be negative. Initializing max_sum to 0 would incorrectly return 0 instead of the actual maximum (negative) sum. Always initialize to negative infinity (or Integer.MIN_VALUE in Java).

4. **Incorrect hourglass pattern**: Mixing up the indices for the middle element (should be grid[i+1][j+1]) or the bottom row elements is easy to do. Double-check your indices against the diagram.

## When You'll See This Pattern

This problem uses a **fixed-size sliding window** pattern in 2D. You'll see similar patterns in:

1. **Matrix Block Sum (LeetCode 1314)**: Instead of a fixed hourglass shape, you sum variable-sized rectangular blocks. The solution often uses prefix sums for efficiency with larger windows.

2. **Image Smoother (LeetCode 661)**: Apply a 3x3 kernel to each pixel in an image, similar to how we examine 3x3 regions here.

3. **Max Consecutive Ones III (LeetCode 1004)**: While 1D, it uses a similar sliding window concept where you maintain a window that satisfies certain constraints.

The key insight is recognizing when a problem involves examining all possible fixed-size submatrices or windows within a larger matrix.

## Key Takeaways

1. **Not every problem needs fancy data structures**: Sometimes simple iteration with careful index management is the optimal solution. Don't overcomplicate problems that have straightforward O(m×n) solutions.

2. **Fixed-size window problems in 2D**: When you need to examine all possible fixed-size submatrices, the number of such submatrices is (m-h+1)×(n-w+1) for an h×w window.

3. **Always handle edge cases first**: Check for minimum size requirements before starting your main logic to avoid index errors.

4. **Visualize indices**: For 2D array problems, draw a small example and trace through your indices to avoid off-by-one errors.

Related problems: [Matrix Block Sum](/problem/matrix-block-sum)
