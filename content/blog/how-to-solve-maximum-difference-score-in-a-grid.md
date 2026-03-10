---
title: "How to Solve Maximum Difference Score in a Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Difference Score in a Grid. Medium difficulty, 47.7% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2029-09-15"
category: "dsa-patterns"
tags: ["maximum-difference-score-in-a-grid", "array", "dynamic-programming", "matrix", "medium"]
---

# How to Solve Maximum Difference Score in a Grid

You're given an `m x n` matrix of positive integers where you can move from any cell to any cell below or to the right (not necessarily adjacent), and your goal is to find the maximum possible score where moving from cell `c1` to `c2` gives you `c2 - c1`. The challenge is that you need to consider all possible pairs of cells where the second cell is reachable from the first, which creates a combinatorial explosion if approached naively.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
```

We need to find the maximum `grid[r2][c2] - grid[r1][c1]` where `r2 ≥ r1` and `c2 ≥ c1` (and they're not the same cell).

Let's think about this systematically:

- Starting from cell (0,0) with value 1: We can move to any cell below or right
  - Best destination: (2,2) with value 9 → score = 9 - 1 = 8
- Starting from cell (0,1) with value 2:
  - Best destination: (2,2) with value 9 → score = 9 - 2 = 7
- Starting from cell (0,2) with value 3:
  - Best destination: (2,2) with value 9 → score = 9 - 3 = 6
- Starting from cell (1,0) with value 4:
  - Best destination: (2,2) with value 9 → score = 9 - 4 = 5
- ... and so on

The maximum we find is 8 (from 1 to 9).

But here's the key insight: For each cell we consider as a destination, the best starting cell is the smallest value we've seen so far in cells that are above and to the left of it. This suggests we should process cells in a way that tracks the minimum value encountered in the "available" region.

## Brute Force Approach

The most straightforward approach is to check every possible pair of cells where the destination is reachable from the start:

1. For every cell `(r1, c1)` as starting point
2. For every cell `(r2, c2)` where `r2 ≥ r1` and `c2 ≥ c1` and they're not the same cell
3. Calculate `grid[r2][c2] - grid[r1][c1]` and track the maximum

<div class="code-group">

```python
# Time: O(m²n²) | Space: O(1)
def maxScoreBruteForce(grid):
    m, n = len(grid), len(grid[0])
    max_score = float('-inf')

    for r1 in range(m):
        for c1 in range(n):
            for r2 in range(r1, m):
                for c2 in range(c1, n):
                    if r1 == r2 and c1 == c2:
                        continue
                    score = grid[r2][c2] - grid[r1][c1]
                    max_score = max(max_score, score)

    return max_score
```

```javascript
// Time: O(m²n²) | Space: O(1)
function maxScoreBruteForce(grid) {
  const m = grid.length,
    n = grid[0].length;
  let maxScore = -Infinity;

  for (let r1 = 0; r1 < m; r1++) {
    for (let c1 = 0; c1 < n; c1++) {
      for (let r2 = r1; r2 < m; r2++) {
        for (let c2 = c1; c2 < n; c2++) {
          if (r1 === r2 && c1 === c2) continue;
          const score = grid[r2][c2] - grid[r1][c1];
          maxScore = Math.max(maxScore, score);
        }
      }
    }
  }

  return maxScore;
}
```

```java
// Time: O(m²n²) | Space: O(1)
public int maxScoreBruteForce(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int maxScore = Integer.MIN_VALUE;

    for (int r1 = 0; r1 < m; r1++) {
        for (int c1 = 0; c1 < n; c1++) {
            for (int r2 = r1; r2 < m; r2++) {
                for (int c2 = c1; c2 < n; c2++) {
                    if (r1 == r2 && c1 == c2) continue;
                    int score = grid[r2][c2] - grid[r1][c1];
                    maxScore = Math.max(maxScore, score);
                }
            }
        }
    }

    return maxScore;
}
```

</div>

**Why this fails:** With `m` and `n` up to 1000, this O(m²n²) approach would require up to 10¹² operations, which is far too slow. We need something closer to O(mn).

## Optimized Approach

The key insight is that for each cell `(i, j)` we consider as a potential destination, the best starting cell is the **minimum value** among all cells that are above and to the left of it. However, we can't just track the global minimum because that cell might not be reachable (it might be to the right or below our current position).

Here's the optimal strategy:

1. Process cells from top-left to bottom-right
2. For each cell `(i, j)`, we want to know the minimum value in the region `[0..i-1][0..j-1]`
3. But we need to be careful: we can only use cells that are strictly above OR strictly to the left
4. The trick: maintain two arrays:
   - `minAbove[i][j]`: minimum value in column `j` from rows `0` to `i-1`
   - `minLeft[i][j]`: minimum value in row `i` from columns `0` to `j-1`
5. For cell `(i, j)`, the best starting point is `min(minAbove[i][j], minLeft[i][j])`
6. Update our answer with `grid[i][j] - min(minAbove[i][j], minLeft[i][j])`
7. Update `minAbove` and `minLeft` for future cells

Wait, there's an even cleaner approach: We can track just one minimum value as we traverse. For each cell `(i, j)`:

- The minimum value we can use as a starting point is the minimum of:
  - The minimum value in the entire region above and left of `(i, j)`
  - But we need to ensure we don't use `(i, j)` itself as both start and end
- Solution: Process cells and track the minimum value seen so far
- For cell `(i, j)`, calculate `grid[i][j] - minSoFar`
- Update `minSoFar` with `grid[i][j]` **after** calculating the score
- But careful: `minSoFar` must come from a cell that's strictly above or left

Actually, the cleanest approach is to process cells and maintain the minimum value in the current row up to the previous column, and the minimum value in the current column up to the previous row. We take the minimum of these two as our potential starting point.

## Optimal Solution

Here's the optimal dynamic programming solution that runs in O(mn) time:

<div class="code-group">

```python
# Time: O(mn) | Space: O(mn)
def maxScore(grid):
    m, n = len(grid), len(grid[0])

    # Initialize DP arrays
    # minAbove[i][j] = minimum value in column j from rows 0 to i-1
    # minLeft[i][j] = minimum value in row i from columns 0 to j-1
    minAbove = [[float('inf')] * n for _ in range(m)]
    minLeft = [[float('inf')] * n for _ in range(m)]

    max_score = float('-inf')

    for i in range(m):
        for j in range(n):
            # Find the minimum value we can subtract from grid[i][j]
            # It must come from either above or left, not from current cell
            min_val = float('inf')

            if i > 0:
                # Check minimum from above (previous rows in same column)
                min_val = min(min_val, minAbove[i][j])
            if j > 0:
                # Check minimum from left (previous columns in same row)
                min_val = min(min_val, minLeft[i][j])

            # If we found a valid starting cell (not current cell)
            if min_val != float('inf'):
                max_score = max(max_score, grid[i][j] - min_val)

            # Update minAbove for next row in same column
            if i == 0:
                minAbove[i][j] = grid[i][j]
            else:
                minAbove[i][j] = min(minAbove[i-1][j], grid[i][j])

            # Update minLeft for next column in same row
            if j == 0:
                minLeft[i][j] = grid[i][j]
            else:
                minLeft[i][j] = min(minLeft[i][j-1], grid[i][j])

    return max_score
```

```javascript
// Time: O(mn) | Space: O(mn)
function maxScore(grid) {
  const m = grid.length,
    n = grid[0].length;

  // Initialize DP arrays
  // minAbove[i][j] = minimum value in column j from rows 0 to i-1
  // minLeft[i][j] = minimum value in row i from columns 0 to j-1
  const minAbove = Array(m)
    .fill()
    .map(() => Array(n).fill(Infinity));
  const minLeft = Array(m)
    .fill()
    .map(() => Array(n).fill(Infinity));

  let maxScore = -Infinity;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Find the minimum value we can subtract from grid[i][j]
      // It must come from either above or left, not from current cell
      let minVal = Infinity;

      if (i > 0) {
        // Check minimum from above (previous rows in same column)
        minVal = Math.min(minVal, minAbove[i][j]);
      }
      if (j > 0) {
        // Check minimum from left (previous columns in same row)
        minVal = Math.min(minVal, minLeft[i][j]);
      }

      // If we found a valid starting cell (not current cell)
      if (minVal !== Infinity) {
        maxScore = Math.max(maxScore, grid[i][j] - minVal);
      }

      // Update minAbove for next row in same column
      if (i === 0) {
        minAbove[i][j] = grid[i][j];
      } else {
        minAbove[i][j] = Math.min(minAbove[i - 1][j], grid[i][j]);
      }

      // Update minLeft for next column in same row
      if (j === 0) {
        minLeft[i][j] = grid[i][j];
      } else {
        minLeft[i][j] = Math.min(minLeft[i][j - 1], grid[i][j]);
      }
    }
  }

  return maxScore;
}
```

```java
// Time: O(mn) | Space: O(mn)
public int maxScore(int[][] grid) {
    int m = grid.length, n = grid[0].length;

    // Initialize DP arrays
    // minAbove[i][j] = minimum value in column j from rows 0 to i-1
    // minLeft[i][j] = minimum value in row i from columns 0 to j-1
    int[][] minAbove = new int[m][n];
    int[][] minLeft = new int[m][n];

    // Fill with maximum values initially
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            minAbove[i][j] = Integer.MAX_VALUE;
            minLeft[i][j] = Integer.MAX_VALUE;
        }
    }

    int maxScore = Integer.MIN_VALUE;

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            // Find the minimum value we can subtract from grid[i][j]
            // It must come from either above or left, not from current cell
            int minVal = Integer.MAX_VALUE;

            if (i > 0) {
                // Check minimum from above (previous rows in same column)
                minVal = Math.min(minVal, minAbove[i][j]);
            }
            if (j > 0) {
                // Check minimum from left (previous columns in same row)
                minVal = Math.min(minVal, minLeft[i][j]);
            }

            // If we found a valid starting cell (not current cell)
            if (minVal != Integer.MAX_VALUE) {
                maxScore = Math.max(maxScore, grid[i][j] - minVal);
            }

            // Update minAbove for next row in same column
            if (i == 0) {
                minAbove[i][j] = grid[i][j];
            } else {
                minAbove[i][j] = Math.min(minAbove[i-1][j], grid[i][j]);
            }

            // Update minLeft for next column in same row
            if (j == 0) {
                minLeft[i][j] = grid[i][j];
            } else {
                minLeft[i][j] = Math.min(minLeft[i][j-1], grid[i][j]);
            }
        }
    }

    return maxScore;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(mn)

- We iterate through each cell of the m × n grid exactly once
- For each cell, we perform constant-time operations: comparisons, updates, and arithmetic
- The nested loops give us m × n iterations

**Space Complexity:** O(mn)

- We maintain two m × n arrays: `minAbove` and `minLeft`
- Each stores the minimum values for their respective directions
- We could optimize to O(min(m, n)) by being clever with traversal order, but O(mn) is acceptable for the problem constraints

## Common Mistakes

1. **Using the current cell as both start and end:** The most common error is calculating `grid[i][j] - min(grid[i][j], ...)` which could give 0 incorrectly. Always ensure your minimum value comes from a different cell.

2. **Not handling the first row/column correctly:** When `i = 0` or `j = 0`, there are no cells above or to the left respectively. You need special cases for these boundary conditions.

3. **Confusing the direction constraints:** Remember you can only move down or right, so your starting cell must be above AND/OR to the left of your ending cell. A cell directly to the right but in a higher row is not reachable.

4. **Initializing with wrong values:** Using 0 instead of infinity for minimum trackers can give wrong results since all values are positive. If you initialize with 0, `grid[i][j] - 0` might look like a good score even when no valid starting cell exists.

## When You'll See This Pattern

This problem uses a **prefix minimum** pattern in two dimensions, which appears in various grid problems:

1. **Maximum Subarray/Minimum Prefix Sum (LeetCode 53/121):** The 1D version where you track the minimum prefix sum seen so far to maximize current sum minus minimum.

2. **Best Time to Buy and Sell Stock (LeetCode 121):** Exactly the 1D version of this problem - track minimum price seen so far to maximize current price minus minimum.

3. **Maximum Difference Between Increasing Elements (LeetCode 2016):** Similar 1D concept of tracking minimum for future differences.

4. **Grid problems with monotonic movement:** Any problem where you can only move down/right and need to optimize some difference or ratio between start and end points.

## Key Takeaways

1. **When you need max difference with ordering constraints**, think about tracking the minimum value seen so far in the valid region. The best pair is often (current value) - (minimum valid previous value).

2. **For 2D movement constraints**, you often need to maintain separate trackers for different directions (like `minAbove` and `minLeft` here) because the valid region isn't simply "all previous cells."

3. **Process cells in natural order** (top-left to bottom-right) when movement is restricted to down/right. This ensures when you're at cell `(i, j)`, all valid starting cells have already been processed.

Related problems: [Maximum Score From Grid Operations](/problem/maximum-score-from-grid-operations)
