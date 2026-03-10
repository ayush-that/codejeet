---
title: "How to Solve Minimum Falling Path Sum II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Falling Path Sum II. Hard difficulty, 63.2% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2026-07-03"
category: "dsa-patterns"
tags: ["minimum-falling-path-sum-ii", "array", "dynamic-programming", "matrix", "hard"]
---

# How to Solve Minimum Falling Path Sum II

You're given an `n x n` matrix and need to find the minimum sum of a path that picks exactly one element from each row, with the constraint that you cannot pick from the same column in consecutive rows. This is tricky because at each row, you have `n-1` valid choices (all columns except the one chosen in the previous row), leading to exponential possibilities if approached naively.

## Visual Walkthrough

Let's trace through a 3×3 example to build intuition:

```
grid = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
```

**Row 0:** We can start from any column. The minimum values are:

- Start at column 0: path sum = 1
- Start at column 1: path sum = 2
- Start at column 2: path sum = 3

**Row 1:** For each starting point, we need the minimum from the other columns:

- If we came from column 0, we can choose from columns 1 or 2: min(5, 6) = 5
- If we came from column 1, we can choose from columns 0 or 2: min(4, 6) = 4
- If we came from column 2, we can choose from columns 0 or 1: min(4, 5) = 4

Updated path sums:

- From col 0: 1 + 5 = 6
- From col 1: 2 + 4 = 6
- From col 2: 3 + 4 = 7

**Row 2:** Same logic:

- From col 0: min(8, 9) = 8 → total = 6 + 8 = 14
- From col 1: min(7, 9) = 7 → total = 6 + 7 = 13
- From col 2: min(7, 8) = 7 → total = 7 + 7 = 14

The minimum is 13. Notice we repeatedly needed to find the minimum value in the next row excluding the current column. This suggests we need an efficient way to find the minimum and second minimum values for each row.

## Brute Force Approach

The brute force solution uses recursion to explore all possible paths. For each row, we try every column except the one chosen in the previous row. This creates a branching factor of `n-1` at each level, leading to `(n-1)^(n-1)` possibilities for an `n x n` matrix.

```python
def minFallingPathSum(grid):
    n = len(grid)

    def dfs(row, prev_col):
        if row == n:
            return 0

        min_sum = float('inf')
        for col in range(n):
            if col != prev_col:
                min_sum = min(min_sum, grid[row][col] + dfs(row + 1, col))

        return min_sum

    return dfs(0, -1)
```

**Why it's too slow:** With `n` up to 200, the exponential time complexity `O(n^n)` is completely infeasible. Even with memoization (caching `(row, prev_col)` results), we'd have `O(n²)` states and `O(n)` transitions per state, giving `O(n³)` time, which is still too slow for `n=200`.

## Optimized Approach

The key insight is that for each row, we don't need to check all `n-1` possibilities individually. Instead, we can track the minimum and second minimum values from the previous row. Why?

When moving from row `i-1` to row `i`:

- If the minimum value from the previous row didn't come from the current column, we can use it
- If the minimum value did come from the current column, we must use the second minimum (since we can't pick the same column)

This reduces the work at each row from `O(n²)` to `O(n)`.

**Step-by-step reasoning:**

1. Start with the first row as our base case
2. For each subsequent row:
   - Find the minimum and second minimum values from the previous row's DP results
   - For each column in the current row, calculate:
     - If the previous minimum isn't from this column: `grid[i][j] + prev_min`
     - Otherwise: `grid[i][j] + prev_second_min`
3. Continue until the last row, then return the minimum value

## Optimal Solution

Here's the dynamic programming solution with `O(n²)` time and `O(1)` extra space:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1) extra space (modifies input, otherwise O(n))
def minFallingPathSum(grid):
    n = len(grid)

    # We'll modify grid in-place to store DP values
    # Each grid[i][j] will represent the minimum falling path sum ending at (i, j)

    for i in range(1, n):
        # Find the minimum and second minimum values from the previous row
        min1 = min2 = float('inf')
        min1_idx = -1

        # First pass: find minimum and its index
        for j in range(n):
            if grid[i-1][j] < min1:
                min2 = min1
                min1 = grid[i-1][j]
                min1_idx = j
            elif grid[i-1][j] < min2:
                min2 = grid[i-1][j]

        # Second pass: update current row using min1 and min2
        for j in range(n):
            if j != min1_idx:
                # If current column is different from min1's column, use min1
                grid[i][j] += min1
            else:
                # Otherwise, we must use second minimum (can't use same column)
                grid[i][j] += min2

    # The answer is the minimum value in the last row
    return min(grid[-1])
```

```javascript
// Time: O(n²) | Space: O(1) extra space (modifies input, otherwise O(n))
function minFallingPathSum(grid) {
  const n = grid.length;

  for (let i = 1; i < n; i++) {
    // Find minimum and second minimum from previous row
    let min1 = Infinity,
      min2 = Infinity;
    let min1Idx = -1;

    // First pass: find minimum and its index
    for (let j = 0; j < n; j++) {
      if (grid[i - 1][j] < min1) {
        min2 = min1;
        min1 = grid[i - 1][j];
        min1Idx = j;
      } else if (grid[i - 1][j] < min2) {
        min2 = grid[i - 1][j];
      }
    }

    // Second pass: update current row
    for (let j = 0; j < n; j++) {
      if (j !== min1Idx) {
        // Can use minimum from previous row
        grid[i][j] += min1;
      } else {
        // Must use second minimum (different column)
        grid[i][j] += min2;
      }
    }
  }

  // Find minimum in last row
  return Math.min(...grid[n - 1]);
}
```

```java
// Time: O(n²) | Space: O(1) extra space (modifies input, otherwise O(n))
public int minFallingPathSum(int[][] grid) {
    int n = grid.length;

    for (int i = 1; i < n; i++) {
        // Find minimum and second minimum from previous row
        int min1 = Integer.MAX_VALUE, min2 = Integer.MAX_VALUE;
        int min1Idx = -1;

        // First pass: find minimum and its index
        for (int j = 0; j < n; j++) {
            if (grid[i-1][j] < min1) {
                min2 = min1;
                min1 = grid[i-1][j];
                min1Idx = j;
            } else if (grid[i-1][j] < min2) {
                min2 = grid[i-1][j];
            }
        }

        // Second pass: update current row
        for (int j = 0; j < n; j++) {
            if (j != min1Idx) {
                // Can use minimum from previous row
                grid[i][j] += min1;
            } else {
                // Must use second minimum (different column)
                grid[i][j] += min2;
            }
        }
    }

    // Find minimum in last row
    int result = Integer.MAX_VALUE;
    for (int j = 0; j < n; j++) {
        result = Math.min(result, grid[n-1][j]);
    }
    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n²)`  
We make two passes through each row (except the first): one to find min/second-min, and another to update values. For an `n x n` matrix, this is `O(2n²) = O(n²)`.

**Space Complexity:** `O(1)` extra space  
We modify the input matrix in place to store DP values. If we can't modify the input, we'd need `O(n)` space for a DP array of the current row.

## Common Mistakes

1. **Forgetting to track the column index of the minimum:** If you only track the minimum value without knowing which column it came from, you can't determine when to use the second minimum. Always track `min1_idx` along with `min1` and `min2`.

2. **Incorrect initialization of min1 and min2:** Using `0` instead of `infinity` can cause issues if all values are positive. Always initialize to a very large number (`Infinity` in JS/Python, `Integer.MAX_VALUE` in Java).

3. **Not handling n=1 edge case:** When the matrix is 1×1, the answer is simply that single element. Our code handles this correctly since we skip the loop when `n=1` and return `min(grid[-1])`.

4. **Confusing rows and columns in the update step:** Remember that `grid[i][j]` refers to row `i`, column `j`. When updating, we add values from the previous row (`i-1`) to the current row (`i`).

## When You'll See This Pattern

This "minimum with exclusion" pattern appears in several DP problems:

1. **House Robber II (LeetCode 213):** Similar constraint where you can't rob adjacent houses in a circle. The solution tracks whether the first house was robbed to determine valid choices.

2. **Paint House II (LeetCode 265):** Almost identical structure - minimize cost of painting houses with no two adjacent houses having the same color. The optimal solution uses the same min/second-min technique.

3. **Minimum Falling Path Sum (LeetCode 931):** The easier version where you can only move to adjacent columns (difference of at most 1). This problem is a generalization with stricter constraints.

## Key Takeaways

1. **When you need the minimum value excluding one element, track both the minimum and second minimum.** This lets you handle the exclusion case in O(1) time instead of O(n).

2. **DP on matrices often benefits from space optimization.** We modified the input in place, but you could also use two 1D arrays (previous and current row) if you need to preserve the input.

3. **Break complex constraints into simple rules.** The "no same column in adjacent rows" constraint simplifies to: "for each column, use the previous minimum unless it came from this column, then use the second minimum."

Related problems: [Minimum Falling Path Sum](/problem/minimum-falling-path-sum)
