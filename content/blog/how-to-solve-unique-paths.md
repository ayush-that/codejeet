---
title: "How to Solve Unique Paths — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Unique Paths. Medium difficulty, 66.6% acceptance rate. Topics: Math, Dynamic Programming, Combinatorics."
date: "2026-04-14"
category: "dsa-patterns"
tags: ["unique-paths", "math", "dynamic-programming", "combinatorics", "medium"]
---

# How to Solve Unique Paths

You're given an `m x n` grid and need to count all possible paths from the top-left corner to the bottom-right corner, moving only down or right. What makes this problem interesting is that it appears simple but has multiple solution approaches with dramatically different efficiencies. The naive recursive approach explodes exponentially, while the optimal solution runs in linear time.

## Visual Walkthrough

Let's trace through a 3×2 grid (m=3, n=2):

```
Start → (0,0)
        ↓
       (1,0) → (1,1) → End
        ↓
       (2,0) → (2,1) → End
```

From (0,0), we can go:

- Right to (0,1), then down twice to reach (2,1)
- Down to (1,0), then:
  - Right to (1,1), then down to (2,1)
  - Down to (2,0), then right to (2,1)

That's 3 total paths. Notice that to reach any cell (i,j), you must come from either above (i-1,j) or from the left (i,j-1). This observation is key: the number of ways to reach (i,j) equals the sum of ways to reach (i-1,j) and (i,j-1).

## Brute Force Approach

The most intuitive solution is recursion: at each cell, try moving right and try moving down, counting successful paths that reach the destination.

<div class="code-group">

```python
# Time: O(2^(m+n)) | Space: O(m+n) for recursion stack
def uniquePathsBrute(m, n):
    def dfs(i, j):
        # Base case: reached destination
        if i == m - 1 and j == n - 1:
            return 1
        # Out of bounds
        if i >= m or j >= n:
            return 0
        # Try moving down + try moving right
        return dfs(i + 1, j) + dfs(i, j + 1)

    return dfs(0, 0)
```

```javascript
// Time: O(2^(m+n)) | Space: O(m+n) for recursion stack
function uniquePathsBrute(m, n) {
  function dfs(i, j) {
    // Base case: reached destination
    if (i === m - 1 && j === n - 1) return 1;
    // Out of bounds
    if (i >= m || j >= n) return 0;
    // Try moving down + try moving right
    return dfs(i + 1, j) + dfs(i, j + 1);
  }

  return dfs(0, 0);
}
```

```java
// Time: O(2^(m+n)) | Space: O(m+n) for recursion stack
public int uniquePathsBrute(int m, int n) {
    return dfs(0, 0, m, n);
}

private int dfs(int i, int j, int m, int n) {
    // Base case: reached destination
    if (i == m - 1 && j == n - 1) return 1;
    // Out of bounds
    if (i >= m || j >= n) return 0;
    // Try moving down + try moving right
    return dfs(i + 1, j, m, n) + dfs(i, j + 1, m, n);
}
```

</div>

**Why it's too slow:** This approach has exponential time complexity O(2^(m+n)) because each recursive call branches into two more calls. For a 10×10 grid, that's over a million operations. The problem is we're recomputing the same subproblems repeatedly — for example, the number of ways to reach cell (1,1) gets computed many times from different paths.

## Optimized Approach

The key insight is **dynamic programming (DP)**: store results of subproblems to avoid recomputation. Since each cell's value depends only on the cell above and to the left, we can fill a 2D DP table row by row.

**DP formulation:**

- `dp[i][j]` = number of ways to reach cell (i,j)
- Base cases: `dp[0][j] = 1` (only way is moving right along top row) and `dp[i][0] = 1` (only way is moving down along left column)
- Recurrence: `dp[i][j] = dp[i-1][j] + dp[i][j-1]` for i>0 and j>0

**Space optimization:** Notice we only need the previous row to compute the current row, so we can reduce space from O(m×n) to O(n).

**Mathematical approach:** This is actually a combinatorics problem! To go from (0,0) to (m-1,n-1), you need exactly (m-1) down moves and (n-1) right moves in any order. The number of ways is the binomial coefficient: `C((m-1)+(n-1), (m-1)) = C(m+n-2, m-1)`. This gives us an O(min(m,n)) time, O(1) space solution.

## Optimal Solution

Here are three implementations: DP with O(m×n) space, DP with O(n) space, and the mathematical combinatorics solution.

<div class="code-group">

```python
# Solution 1: DP with O(m×n) space (most intuitive)
# Time: O(m×n) | Space: O(m×n)
def uniquePathsDP(m, n):
    # Create DP table with all 1s (base cases for first row/col)
    dp = [[1] * n for _ in range(m)]

    # Fill the table row by row
    for i in range(1, m):
        for j in range(1, n):
            # Ways to reach (i,j) = ways from above + ways from left
            dp[i][j] = dp[i-1][j] + dp[i][j-1]

    return dp[m-1][n-1]

# Solution 2: DP with O(n) space (space optimized)
# Time: O(m×n) | Space: O(n)
def uniquePathsOptimized(m, n):
    # dp[j] represents number of ways to reach current row's j-th column
    dp = [1] * n

    # For each row (skip first row since it's all 1s)
    for i in range(1, m):
        # For each column in current row (skip first column)
        for j in range(1, n):
            # dp[j] = old dp[j] (ways from above) + dp[j-1] (ways from left)
            dp[j] += dp[j-1]

    return dp[n-1]

# Solution 3: Combinatorics (most efficient)
# Time: O(min(m,n)) | Space: O(1)
def uniquePathsMath(m, n):
    # Total moves needed: (m-1) down + (n-1) right = m+n-2 moves
    # Choose (m-1) positions for down moves (or (n-1) for right moves)
    total_moves = m + n - 2
    down_moves = m - 1

    # Compute binomial coefficient C(total_moves, down_moves)
    # Using multiplicative formula to avoid overflow
    result = 1
    # Compute C(N, K) where K = min(K, N-K)
    for i in range(1, down_moves + 1):
        result = result * (total_moves - down_moves + i) // i

    return result
```

```javascript
// Solution 1: DP with O(m×n) space (most intuitive)
// Time: O(m×n) | Space: O(m×n)
function uniquePathsDP(m, n) {
  // Create DP table with all 1s (base cases for first row/col)
  const dp = Array(m)
    .fill()
    .map(() => Array(n).fill(1));

  // Fill the table row by row
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      // Ways to reach (i,j) = ways from above + ways from left
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }

  return dp[m - 1][n - 1];
}

// Solution 2: DP with O(n) space (space optimized)
// Time: O(m×n) | Space: O(n)
function uniquePathsOptimized(m, n) {
  // dp[j] represents number of ways to reach current row's j-th column
  let dp = Array(n).fill(1);

  // For each row (skip first row since it's all 1s)
  for (let i = 1; i < m; i++) {
    // For each column in current row (skip first column)
    for (let j = 1; j < n; j++) {
      // dp[j] = old dp[j] (ways from above) + dp[j-1] (ways from left)
      dp[j] += dp[j - 1];
    }
  }

  return dp[n - 1];
}

// Solution 3: Combinatorics (most efficient)
// Time: O(min(m,n)) | Space: O(1)
function uniquePathsMath(m, n) {
  // Total moves needed: (m-1) down + (n-1) right = m+n-2 moves
  // Choose (m-1) positions for down moves (or (n-1) for right moves)
  const totalMoves = m + n - 2;
  const downMoves = m - 1;

  // Compute binomial coefficient C(totalMoves, downMoves)
  // Using multiplicative formula to avoid overflow
  let result = 1;
  // Compute C(N, K) where K = min(K, N-K)
  for (let i = 1; i <= downMoves; i++) {
    result = (result * (totalMoves - downMoves + i)) / i;
  }

  return Math.round(result); // Round to handle floating point
}
```

```java
// Solution 1: DP with O(m×n) space (most intuitive)
// Time: O(m×n) | Space: O(m×n)
public int uniquePathsDP(int m, int n) {
    // Create DP table with all 1s (base cases for first row/col)
    int[][] dp = new int[m][n];

    // Initialize first row and column to 1
    for (int i = 0; i < m; i++) dp[i][0] = 1;
    for (int j = 0; j < n; j++) dp[0][j] = 1;

    // Fill the table row by row
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            // Ways to reach (i,j) = ways from above + ways from left
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }

    return dp[m-1][n-1];
}

// Solution 2: DP with O(n) space (space optimized)
// Time: O(m×n) | Space: O(n)
public int uniquePathsOptimized(int m, int n) {
    // dp[j] represents number of ways to reach current row's j-th column
    int[] dp = new int[n];
    Arrays.fill(dp, 1);

    // For each row (skip first row since it's all 1s)
    for (int i = 1; i < m; i++) {
        // For each column in current row (skip first column)
        for (int j = 1; j < n; j++) {
            // dp[j] = old dp[j] (ways from above) + dp[j-1] (ways from left)
            dp[j] += dp[j-1];
        }
    }

    return dp[n-1];
}

// Solution 3: Combinatorics (most efficient)
// Time: O(min(m,n)) | Space: O(1)
public int uniquePathsMath(int m, int n) {
    // Total moves needed: (m-1) down + (n-1) right = m+n-2 moves
    // Choose (m-1) positions for down moves (or (n-1) for right moves)
    int totalMoves = m + n - 2;
    int downMoves = m - 1;

    // Compute binomial coefficient C(totalMoves, downMoves)
    // Using long to avoid integer overflow
    long result = 1;
    // Compute C(N, K) where K = min(K, N-K)
    for (int i = 1; i <= downMoves; i++) {
        result = result * (totalMoves - downMoves + i) / i;
    }

    return (int) result;
}
```

</div>

## Complexity Analysis

**DP with O(m×n) space:**

- Time: O(m×n) — we compute each cell exactly once
- Space: O(m×n) — we store the entire DP table

**DP with O(n) space:**

- Time: O(m×n) — same number of computations
- Space: O(n) — we only keep one row at a time

**Combinatorics solution:**

- Time: O(min(m,n)) — we loop min(m,n) times to compute binomial coefficient
- Space: O(1) — only a few variables

## Common Mistakes

1. **Off-by-one errors with indices:** Remember the grid is m×n but indices go from 0 to m-1 and 0 to n-1. A common mistake is using `dp[m][n]` instead of `dp[m-1][n-1]` for the answer.

2. **Integer overflow in combinatorics solution:** When computing binomial coefficients for large m,n (like 100×100), the intermediate values can exceed 32-bit integer limits. Always use 64-bit integers (long in Java, BigInt if needed in JS).

3. **Forgetting base cases in DP:** The first row and first column should all be 1s because there's only one straight path along the edge. If you initialize everything to 0, you'll get 0 as the answer.

4. **Incorrect space optimization:** When optimizing to O(n) space, remember that `dp[j]` represents the current row, and you're updating it in-place. The update order matters — left to right works because `dp[j-1]` is already updated for the current row.

## When You'll See This Pattern

This "grid path counting" pattern appears in many DP problems:

1. **Unique Paths II** — Same problem but with obstacles in the grid. The recurrence changes: if cell has obstacle, `dp[i][j] = 0`, otherwise same formula.

2. **Minimum Path Sum** — Instead of counting paths, find the path with minimum sum of values. Recurrence becomes: `dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`.

3. **Dungeon Game** — More complex version where you need to ensure the knight never drops below 1 health. Requires thinking backwards from destination to start.

The core pattern is: when a problem asks for optimal paths/counts in a grid where movement has restrictions (usually down/right), think 2D DP with recurrence based on neighboring cells.

## Key Takeaways

1. **Grid DP problems often have overlapping subproblems** — the number of ways to reach a cell depends only on cells above and to the left, making DP a natural fit.

2. **Space optimization is possible when you only need previous row/column** — many 2D DP problems can be reduced to 1D DP, cutting space from O(m×n) to O(min(m,n)).

3. **Combinatorics can provide O(1) space solutions** for counting problems — recognize when you're counting arrangements/combinations rather than finding optimal values.

Related problems: [Unique Paths II](/problem/unique-paths-ii), [Minimum Path Sum](/problem/minimum-path-sum), [Dungeon Game](/problem/dungeon-game)
