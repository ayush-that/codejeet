---
title: "How to Solve Paths in Matrix Whose Sum Is Divisible by K — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Paths in Matrix Whose Sum Is Divisible by K. Hard difficulty, 58.7% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2027-05-30"
category: "dsa-patterns"
tags:
  ["paths-in-matrix-whose-sum-is-divisible-by-k", "array", "dynamic-programming", "matrix", "hard"]
---

# How to Solve Paths in Matrix Whose Sum Is Divisible by K

You're given an m×n matrix and need to count paths from top-left to bottom-right (moving only down or right) where the sum of elements along the path is divisible by k. What makes this problem tricky is that we can't just count paths—we need to track path sums modulo k, which creates a combinatorial explosion if handled naively.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [[1,2,3],
        [4,5,6]]
k = 3
```

We need paths from (0,0) to (1,2) where the sum is divisible by 3.

**Step 1: Initialize at (0,0)**

- Starting sum = 1
- 1 % 3 = 1
- So at position (0,0), we have 1 path with remainder 1

**Step 2: Process (0,1)**
We can only come from the left (0,0):

- From (0,0) with remainder 1: new sum = 1 + 2 = 3
- 3 % 3 = 0
- So at (0,1), we have 1 path with remainder 0

**Step 3: Process (0,2)**
From (0,1) with remainder 0:

- New sum = (0 + 3) = 3 (but actually 0 + 3 = 3)
- 3 % 3 = 0
- So at (0,2), we have 1 path with remainder 0

**Step 4: Process (1,0)**
From (0,0) with remainder 1:

- New sum = 1 + 4 = 5
- 5 % 3 = 2
- So at (1,0), we have 1 path with remainder 2

**Step 5: Process (1,1)**
Can come from (0,1) or (1,0):

- From (0,1) with remainder 0: 0 + 5 = 5 → 5 % 3 = 2
- From (1,0) with remainder 2: 2 + 5 = 7 → 7 % 3 = 1
- So at (1,1): 1 path with remainder 2, 1 path with remainder 1

**Step 6: Process (1,2) - our target**
Can come from (0,2) or (1,1):

- From (0,2) with remainder 0: 0 + 6 = 6 → 6 % 3 = 0
- From (1,1) with remainder 2: 2 + 6 = 8 → 8 % 3 = 2
- From (1,1) with remainder 1: 1 + 6 = 7 → 7 % 3 = 1
- Only the path from (0,2) gives remainder 0 (divisible by 3)

So there's **1 valid path**: (0,0)→(0,1)→(0,2)→(1,2) with sum 1+2+3+6=12 (divisible by 3).

The key insight: we don't need to track actual sums, just remainders modulo k!

## Brute Force Approach

The brute force solution would explore all possible paths using DFS or BFS, calculating the sum for each complete path, and checking if it's divisible by k.

```python
def brute_force(grid, k):
    m, n = len(grid), len(grid[0])
    count = 0

    def dfs(i, j, current_sum):
        nonlocal count
        if i == m-1 and j == n-1:
            if current_sum % k == 0:
                count += 1
            return

        # Move down
        if i + 1 < m:
            dfs(i+1, j, current_sum + grid[i+1][j])
        # Move right
        if j + 1 < n:
            dfs(i, j+1, current_sum + grid[i][j+1])

    dfs(0, 0, grid[0][0])
    return count
```

**Why this fails:**

- Time complexity: O(2^(m+n)) since at each cell we have 2 choices (down or right)
- For a 100×100 grid, that's ~2^200 operations—impossible!
- We're recalculating the same subproblems repeatedly

## Optimized Approach

The key insight is **dynamic programming with remainder tracking**. Instead of tracking all possible sums (which could be huge), we track counts of paths ending at each cell with each possible remainder modulo k.

**Why modulo k works:**

- If two paths reach the same cell with sums that have the same remainder modulo k, then adding the same future path elements will keep them congruent modulo k
- So we only need to track k different states per cell, not all possible sums

**DP State Definition:**
Let `dp[i][j][r]` = number of paths to cell (i,j) where the sum modulo k equals r

**Transition Formula:**
To reach (i,j) with remainder r, we can come from:

1. Above (i-1,j) with remainder `(r - grid[i][j]) % k`
2. Left (i,j-1) with remainder `(r - grid[i][j]) % k`

So: `dp[i][j][r] = dp[i-1][j][(r - grid[i][j]) % k] + dp[i][j-1][(r - grid[i][j]) % k]`

**Base Case:**
At (0,0): `dp[0][0][grid[0][0] % k] = 1`

**Answer:**
`dp[m-1][n-1][0]` (paths to bottom-right with remainder 0)

## Optimal Solution

<div class="code-group">

```python
# Time: O(m * n * k) | Space: O(m * n * k) (can be optimized to O(n * k))
def numberOfPaths(grid, k):
    """
    Count paths from top-left to bottom-right where path sum is divisible by k.

    Args:
        grid: 2D list of integers
        k: integer divisor

    Returns:
        Number of valid paths modulo 10^9+7
    """
    MOD = 10**9 + 7
    m, n = len(grid), len(grid[0])

    # dp[i][j][r] = paths to (i,j) with sum % k == r
    dp = [[[0] * k for _ in range(n)] for _ in range(m)]

    # Base case: starting cell
    dp[0][0][grid[0][0] % k] = 1

    for i in range(m):
        for j in range(n):
            # Skip the base case we already handled
            if i == 0 and j == 0:
                continue

            current_val = grid[i][j]

            # For each possible remainder
            for r in range(k):
                # Calculate what remainder we needed from previous cells
                needed_remainder = (r - current_val) % k

                # Count paths from above (if exists)
                from_above = 0
                if i > 0:
                    from_above = dp[i-1][j][needed_remainder]

                # Count paths from left (if exists)
                from_left = 0
                if j > 0:
                    from_left = dp[i][j-1][needed_remainder]

                # Total paths to (i,j) with remainder r
                dp[i][j][r] = (from_above + from_left) % MOD

    # Answer: paths to bottom-right with remainder 0
    return dp[m-1][n-1][0] % MOD
```

```javascript
// Time: O(m * n * k) | Space: O(m * n * k) (can be optimized to O(n * k))
function numberOfPaths(grid, k) {
  /**
   * Count paths from top-left to bottom-right where path sum is divisible by k.
   *
   * @param {number[][]} grid - 2D array of integers
   * @param {number} k - integer divisor
   * @return {number} - Number of valid paths modulo 10^9+7
   */
  const MOD = 10 ** 9 + 7;
  const m = grid.length,
    n = grid[0].length;

  // dp[i][j][r] = paths to (i,j) with sum % k == r
  const dp = Array(m)
    .fill()
    .map(() =>
      Array(n)
        .fill()
        .map(() => Array(k).fill(0))
    );

  // Base case: starting cell
  dp[0][0][grid[0][0] % k] = 1;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Skip the base case we already handled
      if (i === 0 && j === 0) continue;

      const currentVal = grid[i][j];

      // For each possible remainder
      for (let r = 0; r < k; r++) {
        // Calculate what remainder we needed from previous cells
        const neededRemainder = (r - currentVal) % k;
        // Handle negative modulo in JavaScript
        const adjustedNeeded = (neededRemainder + k) % k;

        // Count paths from above (if exists)
        let fromAbove = 0;
        if (i > 0) {
          fromAbove = dp[i - 1][j][adjustedNeeded];
        }

        // Count paths from left (if exists)
        let fromLeft = 0;
        if (j > 0) {
          fromLeft = dp[i][j - 1][adjustedNeeded];
        }

        // Total paths to (i,j) with remainder r
        dp[i][j][r] = (fromAbove + fromLeft) % MOD;
      }
    }
  }

  // Answer: paths to bottom-right with remainder 0
  return dp[m - 1][n - 1][0] % MOD;
}
```

```java
// Time: O(m * n * k) | Space: O(m * n * k) (can be optimized to O(n * k))
class Solution {
    public int numberOfPaths(int[][] grid, int k) {
        /**
         * Count paths from top-left to bottom-right where path sum is divisible by k.
         *
         * @param grid - 2D array of integers
         * @param k - integer divisor
         * @return Number of valid paths modulo 10^9+7
         */
        final int MOD = 1_000_000_007;
        int m = grid.length, n = grid[0].length;

        // dp[i][j][r] = paths to (i,j) with sum % k == r
        int[][][] dp = new int[m][n][k];

        // Base case: starting cell
        dp[0][0][grid[0][0] % k] = 1;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // Skip the base case we already handled
                if (i == 0 && j == 0) continue;

                int currentVal = grid[i][j];

                // For each possible remainder
                for (int r = 0; r < k; r++) {
                    // Calculate what remainder we needed from previous cells
                    int neededRemainder = (r - currentVal) % k;
                    // Handle negative modulo
                    if (neededRemainder < 0) neededRemainder += k;

                    // Count paths from above (if exists)
                    int fromAbove = 0;
                    if (i > 0) {
                        fromAbove = dp[i-1][j][neededRemainder];
                    }

                    // Count paths from left (if exists)
                    int fromLeft = 0;
                    if (j > 0) {
                        fromLeft = dp[i][j-1][neededRemainder];
                    }

                    // Total paths to (i,j) with remainder r
                    dp[i][j][r] = (fromAbove + fromLeft) % MOD;
                }
            }
        }

        // Answer: paths to bottom-right with remainder 0
        return dp[m-1][n-1][0] % MOD;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n × k)

- We iterate through all m × n cells
- For each cell, we iterate through k possible remainders
- Each remainder calculation is O(1)

**Space Complexity:** O(m × n × k) for the 3D DP array

- **Optimization:** We can reduce to O(n × k) by only keeping the current and previous rows since we only need dp[i-1][j] (above) and dp[i][j-1] (left, which is in current row)
- The optimized version would use 2 rows of size n × k each

## Common Mistakes

1. **Forgetting modulo arithmetic with negative numbers:**
   - In Python: `-3 % 5 = 2` (automatically positive)
   - In Java/JavaScript: `-3 % 5 = -3` (can be negative)
   - Always use `(x % k + k) % k` in Java/JS to ensure positive remainder

2. **Not taking modulo 10^9+7 at each addition:**
   - Path counts can grow exponentially
   - Intermediate values might overflow 32-bit integers
   - Always apply modulo after each addition operation

3. **Incorrect base case initialization:**
   - Starting at (0,0) with value `grid[0][0]`
   - Should set `dp[0][0][grid[0][0] % k] = 1`, not `dp[0][0][0] = 1`
   - The starting cell's value contributes to the sum!

4. **Confusing remainder calculation in transition:**
   - To get to remainder r at (i,j), we need remainder `(r - grid[i][j]) % k` from previous cells
   - Not `(r + grid[i][j]) % k` (that would be for going forward)
   - Think: "What remainder did I need before adding current cell's value?"

## When You'll See This Pattern

This "DP with modulo states" pattern appears in problems where:

1. You need to count paths/sequences satisfying a divisibility condition
2. The constraint involves modulo arithmetic
3. Direct counting is infeasible due to large state space

**Related Problems:**

1. **Make Sum Divisible by P (LeetCode 1590)** - Find smallest subarray to remove to make sum divisible by p
2. **Continuous Subarray Sum (LeetCode 523)** - Check if array has continuous subarray sum divisible by k
3. **Subarray Sums Divisible by K (LeetCode 974)** - Count subarrays with sum divisible by k
4. **Coin Change II (LeetCode 518)** - Count ways to make amount (similar DP with amount as state)

## Key Takeaways

1. **Modulo compression:** When dealing with divisibility by k, track remainders modulo k instead of actual values. This reduces state space from potentially huge sums to just k possibilities.

2. **DP state design:** The state often needs extra dimensions beyond just position. Here we added a remainder dimension: `dp[i][j][r]`. Always ask: "What information do I need to carry forward?"

3. **Transition thinking:** Work backwards from desired state. To have remainder r at current cell, what remainder did I need before adding current value? Use `(r - current) % k` not `(r + current) % k`.

**Related problems:** [Unique Paths](/problem/unique-paths), [Unique Paths II](/problem/unique-paths-ii), [Minimum Path Sum](/problem/minimum-path-sum)
