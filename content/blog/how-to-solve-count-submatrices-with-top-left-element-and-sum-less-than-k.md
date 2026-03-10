---
title: "How to Solve Count Submatrices with Top-Left Element and Sum Less Than k — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Submatrices with Top-Left Element and Sum Less Than k. Medium difficulty, 58.3% acceptance rate. Topics: Array, Matrix, Prefix Sum."
date: "2029-04-14"
category: "dsa-patterns"
tags:
  [
    "count-submatrices-with-top-left-element-and-sum-less-than-k",
    "array",
    "matrix",
    "prefix-sum",
    "medium",
  ]
---

# How to Solve Count Submatrices with Top-Left Element and Sum Less Than k

You're given a matrix `grid` and an integer `k`. Your task is to count all submatrices that **must include the top-left element** (grid[0][0]) and have a sum ≤ k. This constraint makes the problem interesting: instead of counting all possible submatrices in the entire grid, we only count those anchored at (0,0). This means every valid submatrix starts at the top-left corner and extends to some bottom-right position (r,c).

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
grid = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]]
k = 12
```

We need to count all submatrices containing grid[0][0] = 1 with sum ≤ 12.

**Step 1: Understand what "contain the top-left element" means**
Every valid submatrix must start at (0,0). So we're essentially counting all rectangles where:

- Top-left corner is fixed at (0,0)
- Bottom-right corner can be any (r,c) where 0 ≤ r < rows, 0 ≤ c < cols

**Step 2: List all possible submatrices**
For our 3×3 grid:

- 1×1: [[1]] → sum = 1 ≤ 12 ✓
- 1×2: [[1,2]] → sum = 3 ≤ 12 ✓
- 1×3: [[1,2,3]] → sum = 6 ≤ 12 ✓
- 2×1: [[1],[4]] → sum = 5 ≤ 12 ✓
- 2×2: [[1,2],[4,5]] → sum = 12 ≤ 12 ✓
- 2×3: [[1,2,3],[4,5,6]] → sum = 21 > 12 ✗
- 3×1: [[1],[4],[7]] → sum = 12 ≤ 12 ✓
- 3×2: [[1,2],[4,5],[7,8]] → sum = 27 > 12 ✗
- 3×3: [[1,2,3],[4,5,6],[7,8,9]] → sum = 45 > 12 ✗

**Step 3: Count valid ones**
We found 6 valid submatrices. The challenge is computing this efficiently for larger grids without explicitly checking every possible rectangle.

## Brute Force Approach

The most straightforward approach is to:

1. Iterate through all possible bottom-right corners (r,c)
2. For each, compute the sum of the submatrix from (0,0) to (r,c)
3. Count it if sum ≤ k

To compute each sum, we could:

- Option A: Sum all elements in the rectangle each time → O(rows×cols) per rectangle
- Option B: Use cumulative sums to compute each rectangle sum in O(1)

Even with Option B, we'd still need to check O(rows×cols) rectangles. For each rectangle of size m×n, the brute force sum would take O(m×n) time, leading to O((rows×cols)³) total time in worst case.

Here's what the inefficient brute force looks like:

<div class="code-group">

```python
# Time: O((rows*cols)^3) | Space: O(1)
def countSubmatrices_brute(grid, k):
    rows, cols = len(grid), len(grid[0])
    count = 0

    # Try every possible bottom-right corner
    for r in range(rows):
        for c in range(cols):
            # Compute sum from (0,0) to (r,c)
            total = 0
            for i in range(r + 1):
                for j in range(c + 1):
                    total += grid[i][j]

            # Check if sum is within limit
            if total <= k:
                count += 1

    return count
```

```javascript
// Time: O((rows*cols)^3) | Space: O(1)
function countSubmatricesBrute(grid, k) {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  // Try every possible bottom-right corner
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Compute sum from (0,0) to (r,c)
      let total = 0;
      for (let i = 0; i <= r; i++) {
        for (let j = 0; j <= c; j++) {
          total += grid[i][j];
        }
      }

      // Check if sum is within limit
      if (total <= k) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O((rows*cols)^3) | Space: O(1)
public int countSubmatricesBrute(int[][] grid, int k) {
    int rows = grid.length;
    int cols = grid[0].length;
    int count = 0;

    // Try every possible bottom-right corner
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            // Compute sum from (0,0) to (r,c)
            int total = 0;
            for (int i = 0; i <= r; i++) {
                for (int j = 0; j <= c; j++) {
                    total += grid[i][j];
                }
            }

            // Check if sum is within limit
            if (total <= k) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

This brute force is too slow because for an n×n grid, it takes O(n⁶) time. We need a better approach.

## Optimized Approach

The key insight is that we can compute all submatrix sums efficiently using **prefix sums**. Here's the step-by-step reasoning:

1. **Prefix Sum Matrix**: Create a 2D prefix sum array where `prefix[r][c]` = sum of all elements from (0,0) to (r,c). This lets us compute any submatrix sum in O(1) time.

2. **Formula for rectangle sum**: For a rectangle from (0,0) to (r,c), the sum is simply `prefix[r][c]`.

3. **Building prefix sums efficiently**:
   - First row: `prefix[0][c] = prefix[0][c-1] + grid[0][c]`
   - First col: `prefix[r][0] = prefix[r-1][0] + grid[r][0]`
   - General case: `prefix[r][c] = grid[r][c] + prefix[r-1][c] + prefix[r][c-1] - prefix[r-1][c-1]`

4. **Counting valid submatrices**: Once we have prefix sums, we iterate through all possible bottom-right corners (r,c) and check if `prefix[r][c] ≤ k`. Each check is O(1).

This reduces the time complexity from O(n⁶) to O(rows×cols).

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(rows * cols) | Space: O(rows * cols)
def countSubmatrices(grid, k):
    """
    Count all submatrices containing grid[0][0] with sum <= k.

    Args:
        grid: 2D list of integers
        k: maximum allowed sum

    Returns:
        Number of valid submatrices
    """
    rows, cols = len(grid), len(grid[0])

    # Create prefix sum matrix with same dimensions as grid
    prefix = [[0] * cols for _ in range(rows)]

    # Initialize count of valid submatrices
    count = 0

    # Build prefix sum matrix and count valid submatrices in one pass
    for r in range(rows):
        for c in range(cols):
            # Current cell value
            current = grid[r][c]

            # Add sum from top rectangle (if exists)
            if r > 0:
                current += prefix[r-1][c]

            # Add sum from left rectangle (if exists)
            if c > 0:
                current += prefix[r][c-1]

            # Subtract overlapping area (if both top and left exist)
            if r > 0 and c > 0:
                current -= prefix[r-1][c-1]

            # Store computed prefix sum
            prefix[r][c] = current

            # Check if this submatrix (from (0,0) to (r,c)) is valid
            if current <= k:
                count += 1

    return count
```

```javascript
// Time: O(rows * cols) | Space: O(rows * cols)
function countSubmatrices(grid, k) {
  /**
   * Count all submatrices containing grid[0][0] with sum <= k.
   *
   * @param {number[][]} grid - 2D array of integers
   * @param {number} k - maximum allowed sum
   * @return {number} - Number of valid submatrices
   */
  const rows = grid.length;
  const cols = grid[0].length;

  // Create prefix sum matrix with same dimensions as grid
  const prefix = Array.from({ length: rows }, () => new Array(cols).fill(0));

  // Initialize count of valid submatrices
  let count = 0;

  // Build prefix sum matrix and count valid submatrices in one pass
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Current cell value
      let current = grid[r][c];

      // Add sum from top rectangle (if exists)
      if (r > 0) {
        current += prefix[r - 1][c];
      }

      // Add sum from left rectangle (if exists)
      if (c > 0) {
        current += prefix[r][c - 1];
      }

      // Subtract overlapping area (if both top and left exist)
      if (r > 0 && c > 0) {
        current -= prefix[r - 1][c - 1];
      }

      // Store computed prefix sum
      prefix[r][c] = current;

      // Check if this submatrix (from (0,0) to (r,c)) is valid
      if (current <= k) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(rows * cols) | Space: O(rows * cols)
public int countSubmatrices(int[][] grid, int k) {
    /**
     * Count all submatrices containing grid[0][0] with sum <= k.
     *
     * @param grid - 2D array of integers
     * @param k - maximum allowed sum
     * @return Number of valid submatrices
     */
    int rows = grid.length;
    int cols = grid[0].length;

    // Create prefix sum matrix with same dimensions as grid
    int[][] prefix = new int[rows][cols];

    // Initialize count of valid submatrices
    int count = 0;

    // Build prefix sum matrix and count valid submatrices in one pass
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            // Current cell value
            int current = grid[r][c];

            // Add sum from top rectangle (if exists)
            if (r > 0) {
                current += prefix[r-1][c];
            }

            // Add sum from left rectangle (if exists)
            if (c > 0) {
                current += prefix[r][c-1];
            }

            // Subtract overlapping area (if both top and left exist)
            if (r > 0 && c > 0) {
                current -= prefix[r-1][c-1];
            }

            // Store computed prefix sum
            prefix[r][c] = current;

            // Check if this submatrix (from (0,0) to (r,c)) is valid
            if (current <= k) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(rows × cols)**

- We iterate through each cell exactly once
- For each cell, we perform O(1) operations (addition, subtraction, comparison)
- This is optimal since we must at least examine each element once

**Space Complexity: O(rows × cols)**

- We create a prefix sum matrix of the same size as the input
- Could be optimized to O(cols) by processing row by row and keeping only the current and previous row's prefix sums, but the problem constraints usually allow the simpler O(rows×cols) approach

## Common Mistakes

1. **Forgetting the overlap subtraction**: When computing `prefix[r][c] = grid[r][c] + prefix[r-1][c] + prefix[r][c-1]`, you must subtract `prefix[r-1][c-1]` because it was added twice. This is the most common error in 2D prefix sum problems.

2. **Index out of bounds**: Not checking `r > 0` and `c > 0` before accessing `prefix[r-1][c]`, `prefix[r][c-1]`, or `prefix[r-1][c-1]`. Always handle the first row and first column as special cases.

3. **Misunderstanding the problem constraints**: Some candidates try to count ALL submatrices in the grid, not just those containing the top-left element. Read the problem carefully: "contain the top-left element" means every valid submatrix must start at (0,0).

4. **Integer overflow**: With large grids and values, the prefix sums could exceed 32-bit integer limits. Use 64-bit integers (long in Java/C++, int64 in Python) if constraints suggest large sums.

## When You'll See This Pattern

The 2D prefix sum technique appears in many matrix problems:

1. **Range Sum Query 2D - Immutable (LeetCode 304)**: Similar prefix sum concept for answering multiple submatrix sum queries.

2. **Max Sum of Rectangle No Larger Than K (LeetCode 363)**: A harder problem that combines 2D prefix sums with optimization techniques.

3. **Number of Submatrices That Sum to Target (LeetCode 1074)**: Uses prefix sums to efficiently count submatrices with a specific sum.

The pattern to recognize: when you need to compute sums of many overlapping rectangles/submatrices, prefix sums let you answer each query in O(1) after O(rows×cols) preprocessing.

## Key Takeaways

1. **2D Prefix Sums are your friend for rectangle sum problems**: Memorize the formula: `sum = prefix[r2][c2] - prefix[r1-1][c2] - prefix[r2][c1-1] + prefix[r1-1][c1-1]` for rectangle from (r1,c1) to (r2,c2).

2. **Anchor points simplify counting**: When submatrices must include a specific point (like (0,0)), you only need to iterate through possible opposite corners, reducing the problem complexity.

3. **Build and query in one pass when possible**: In this problem, we could check the condition `prefix[r][c] ≤ k` immediately after computing each prefix sum, avoiding a second pass through the matrix.

[Practice this problem on CodeJeet](/problem/count-submatrices-with-top-left-element-and-sum-less-than-k)
