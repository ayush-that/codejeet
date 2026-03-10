---
title: "How to Solve Maximum Non Negative Product in a Matrix — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Non Negative Product in a Matrix. Medium difficulty, 35.7% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2029-03-30"
category: "dsa-patterns"
tags:
  ["maximum-non-negative-product-in-a-matrix", "array", "dynamic-programming", "matrix", "medium"]
---

# How to Solve Maximum Non Negative Product in a Matrix

You're given a matrix where you can only move right or down, starting from the top-left to bottom-right. The goal is to find the maximum non-negative product of all numbers along any path. What makes this tricky is that negative numbers can flip signs, so you need to track both maximum and minimum products at each cell to handle cases where a negative minimum could become a positive maximum when multiplied by another negative number.

## Visual Walkthrough

Let's trace through a 2×3 example to build intuition:

```
grid = [
  [1, -2, 1],
  [1, 1, 3]
]
```

We need to find the path from (0,0) to (1,2) with maximum non-negative product.

**Step-by-step reasoning:**

1. **Starting point (0,0):** Product = 1
   - Max product so far: 1
   - Min product so far: 1 (same as max initially)

2. **Cell (0,1):** Value = -2
   - From left (0,0): max = 1 × (-2) = -2, min = 1 × (-2) = -2
   - From above: no cell above (out of bounds)
   - So max = -2, min = -2

3. **Cell (0,2):** Value = 1
   - From left (0,1): max = -2 × 1 = -2, min = -2 × 1 = -2
   - From above: no cell above
   - So max = -2, min = -2

4. **Cell (1,0):** Value = 1
   - From above (0,0): max = 1 × 1 = 1, min = 1 × 1 = 1
   - From left: no cell left
   - So max = 1, min = 1

5. **Cell (1,1):** Value = 1
   - From above (0,1): max = -2 × 1 = -2, min = -2 × 1 = -2
   - From left (1,0): max = 1 × 1 = 1, min = 1 × 1 = 1
   - We take the best max (1) and best min (-2)
   - So max = 1, min = -2

6. **Cell (1,2):** Value = 3
   - From above (0,2): max = -2 × 3 = -6, min = -2 × 3 = -6
   - From left (1,1):
     - Using max (1): 1 × 3 = 3
     - Using min (-2): -2 × 3 = -6
   - So max = 3, min = -6

The maximum non-negative product at the destination is 3. The path achieving this is: (0,0) → (1,0) → (1,1) → (1,2) with product: 1 × 1 × 1 × 3 = 3.

## Brute Force Approach

The brute force approach would explore all possible paths from top-left to bottom-right. In an m×n grid, you need to make exactly (m-1) down moves and (n-1) right moves, for a total of (m+n-2) moves. The number of possible paths is the binomial coefficient C(m+n-2, m-1), which grows exponentially.

**Why this fails:**

- For a 15×15 grid, there are over 40 million paths
- The time complexity is O(2^(m+n)), which is completely impractical
- We need to avoid recomputing the same subproblems

A naive candidate might try DFS or BFS to explore all paths, but this would time out even for moderately sized grids (like 10×10).

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with a twist. In standard path problems, you'd track only the maximum sum or product. However, with negative numbers:

1. A large negative product × a negative number = large positive product
2. A small positive product × a negative number = negative product

Therefore, at each cell, we need to track **both**:

- `maxDP[i][j]`: Maximum product achievable to reach cell (i,j)
- `minDP[i][j]`: Minimum product achievable to reach cell (i,j)

**Transition logic:**

- For cell (i,j), we can come from above (i-1,j) or left (i,j-1)
- We compute four possible products:
  1. `maxDP[i-1][j] × grid[i][j]`
  2. `minDP[i-1][j] × grid[i][j]`
  3. `maxDP[i][j-1] × grid[i][j]`
  4. `minDP[i][j-1] × grid[i][j]`
- The new `maxDP[i][j]` is the maximum of these four values
- The new `minDP[i][j]` is the minimum of these four values

**Base cases:**

- Starting cell (0,0): `maxDP[0][0] = minDP[0][0] = grid[0][0]`
- First row (only left moves): `maxDP[0][j] = minDP[0][j] = maxDP[0][j-1] × grid[0][j]`
- First column (only above moves): `maxDP[i][0] = minDP[i][0] = maxDP[i-1][0] × grid[i][0]`

**Final answer:**

- If `maxDP[m-1][n-1] >= 0`, return it modulo 10^9+7
- Otherwise, return -1 (no non-negative product path exists)

## Optimal Solution

<div class="code-group">

```python
# Time: O(m*n) | Space: O(m*n)
def maxProductPath(grid):
    """
    Find the maximum non-negative product from top-left to bottom-right.
    Only right and down moves are allowed.
    """
    MOD = 10**9 + 7
    m, n = len(grid), len(grid[0])

    # Create DP tables for max and min products
    max_dp = [[0] * n for _ in range(m)]
    min_dp = [[0] * n for _ in range(m)]

    # Initialize starting cell
    max_dp[0][0] = min_dp[0][0] = grid[0][0]

    # Initialize first column (only down moves possible)
    for i in range(1, m):
        # For first column, only one possible path (from above)
        product = max_dp[i-1][0] * grid[i][0]
        max_dp[i][0] = min_dp[i][0] = product

    # Initialize first row (only right moves possible)
    for j in range(1, n):
        # For first row, only one possible path (from left)
        product = max_dp[0][j-1] * grid[0][j]
        max_dp[0][j] = min_dp[0][j] = product

    # Fill the rest of the DP tables
    for i in range(1, m):
        for j in range(1, n):
            current = grid[i][j]

            # Products coming from above cell (i-1, j)
            from_above_max = max_dp[i-1][j] * current
            from_above_min = min_dp[i-1][j] * current

            # Products coming from left cell (i, j-1)
            from_left_max = max_dp[i][j-1] * current
            from_left_min = min_dp[i][j-1] * current

            # Take maximum of all four possibilities for max_dp
            max_dp[i][j] = max(from_above_max, from_above_min,
                              from_left_max, from_left_min)

            # Take minimum of all four possibilities for min_dp
            min_dp[i][j] = min(from_above_max, from_above_min,
                              from_left_max, from_left_min)

    # Check if we have a non-negative product at destination
    result = max_dp[m-1][n-1]

    # Return result modulo MOD if non-negative, otherwise -1
    return result % MOD if result >= 0 else -1
```

```javascript
// Time: O(m*n) | Space: O(m*n)
function maxProductPath(grid) {
  const MOD = 1e9 + 7;
  const m = grid.length;
  const n = grid[0].length;

  // Create DP tables for max and min products
  const maxDP = Array(m)
    .fill()
    .map(() => Array(n).fill(0));
  const minDP = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  // Initialize starting cell
  maxDP[0][0] = minDP[0][0] = grid[0][0];

  // Initialize first column (only down moves possible)
  for (let i = 1; i < m; i++) {
    // For first column, only one possible path (from above)
    const product = maxDP[i - 1][0] * grid[i][0];
    maxDP[i][0] = minDP[i][0] = product;
  }

  // Initialize first row (only right moves possible)
  for (let j = 1; j < n; j++) {
    // For first row, only one possible path (from left)
    const product = maxDP[0][j - 1] * grid[0][j];
    maxDP[0][j] = minDP[0][j] = product;
  }

  // Fill the rest of the DP tables
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      const current = grid[i][j];

      // Products coming from above cell (i-1, j)
      const fromAboveMax = maxDP[i - 1][j] * current;
      const fromAboveMin = minDP[i - 1][j] * current;

      // Products coming from left cell (i, j-1)
      const fromLeftMax = maxDP[i][j - 1] * current;
      const fromLeftMin = minDP[i][j - 1] * current;

      // Take maximum of all four possibilities for maxDP
      maxDP[i][j] = Math.max(fromAboveMax, fromAboveMin, fromLeftMax, fromLeftMin);

      // Take minimum of all four possibilities for minDP
      minDP[i][j] = Math.min(fromAboveMax, fromAboveMin, fromLeftMax, fromLeftMin);
    }
  }

  // Check if we have a non-negative product at destination
  const result = maxDP[m - 1][n - 1];

  // Return result modulo MOD if non-negative, otherwise -1
  return result >= 0 ? result % MOD : -1;
}
```

```java
// Time: O(m*n) | Space: O(m*n)
class Solution {
    public int maxProductPath(int[][] grid) {
        final int MOD = 1_000_000_007;
        int m = grid.length;
        int n = grid[0].length;

        // Create DP tables for max and min products
        long[][] maxDP = new long[m][n];
        long[][] minDP = new long[m][n];

        // Initialize starting cell
        maxDP[0][0] = minDP[0][0] = grid[0][0];

        // Initialize first column (only down moves possible)
        for (int i = 1; i < m; i++) {
            // For first column, only one possible path (from above)
            long product = maxDP[i-1][0] * grid[i][0];
            maxDP[i][0] = minDP[i][0] = product;
        }

        // Initialize first row (only right moves possible)
        for (int j = 1; j < n; j++) {
            // For first row, only one possible path (from left)
            long product = maxDP[0][j-1] * grid[0][j];
            maxDP[0][j] = minDP[0][j] = product;
        }

        // Fill the rest of the DP tables
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                long current = grid[i][j];

                // Products coming from above cell (i-1, j)
                long fromAboveMax = maxDP[i-1][j] * current;
                long fromAboveMin = minDP[i-1][j] * current;

                // Products coming from left cell (i, j-1)
                long fromLeftMax = maxDP[i][j-1] * current;
                long fromLeftMin = minDP[i][j-1] * current;

                // Take maximum of all four possibilities for maxDP
                maxDP[i][j] = Math.max(Math.max(fromAboveMax, fromAboveMin),
                                      Math.max(fromLeftMax, fromLeftMin));

                // Take minimum of all four possibilities for minDP
                minDP[i][j] = Math.min(Math.min(fromAboveMax, fromAboveMin),
                                      Math.min(fromLeftMax, fromLeftMin));
            }
        }

        // Check if we have a non-negative product at destination
        long result = maxDP[m-1][n-1];

        // Return result modulo MOD if non-negative, otherwise -1
        return result >= 0 ? (int)(result % MOD) : -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n)**

- We iterate through each cell of the m×n grid exactly once
- For each cell, we perform constant-time operations (4 multiplications, max/min comparisons)
- Total operations: m × n × O(1) = O(m×n)

**Space Complexity: O(m×n)**

- We maintain two DP tables of size m×n each
- Total space: 2 × m × n = O(m×n)
- _Optimization note:_ We could reduce this to O(n) by only keeping the current and previous rows, but the code becomes more complex

## Common Mistakes

1. **Only tracking maximum product:** This is the most common mistake. Candidates forget that a negative minimum multiplied by a negative number can become a positive maximum. Always track both max and min when dealing with products and negative numbers.

2. **Integer overflow:** The product can grow very large (up to 100^15 for a 15×15 grid with max values). Use 64-bit integers (long in Java, BigInt if needed in JavaScript). The modulo operation should only be applied at the end, not during intermediate calculations.

3. **Incorrect base case initialization:** For the first row and column, there's only one possible path (from left or above respectively). Some candidates incorrectly apply the full min/max logic to these boundary cells.

4. **Forgetting the modulo requirement:** The problem asks for the result modulo 10^9+7. Apply modulo only to the final result, not during DP calculations, as it could affect the sign comparisons.

## When You'll See This Pattern

This "dual DP" pattern (tracking both max and min) appears in problems where:

1. You're computing products (or other operations where signs matter)
2. Negative values can flip the optimal solution

**Related LeetCode problems:**

1. **Maximum Product Subarray (152):** Similar concept of tracking max/min when multiplying, but in 1D array instead of 2D grid.

2. **Dungeon Game (174):** Another grid DP where you need to track minimum health, with similar "coming from left or above" movement.

3. **Minimum Path Sum (64):** The simpler version without negative number complications - only tracking minimum sum.

4. **Cherry Pickup II (1463):** More complex grid DP with multiple states to track.

## Key Takeaways

1. **When dealing with products and negative numbers, always track both maximum and minimum values.** A current minimum could become the future maximum when multiplied by a negative number.

2. **Grid DP problems with only right/down movement have a standard pattern:** Process cells row by row, and for each cell consider contributions from the cell above and to the left.

3. **Boundary conditions matter:** First row and first column have only one possible incoming direction. Handle these separately to avoid index errors.

[Practice this problem on CodeJeet](/problem/maximum-non-negative-product-in-a-matrix)
