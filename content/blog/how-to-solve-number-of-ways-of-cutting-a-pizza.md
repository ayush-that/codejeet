---
title: "How to Solve Number of Ways of Cutting a Pizza — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Ways of Cutting a Pizza. Hard difficulty, 61.6% acceptance rate. Topics: Array, Dynamic Programming, Memoization, Matrix, Prefix Sum."
date: "2027-12-09"
category: "dsa-patterns"
tags: ["number-of-ways-of-cutting-a-pizza", "array", "dynamic-programming", "memoization", "hard"]
---

# How to Solve Number of Ways of Cutting a Pizza

This problem asks us to count how many ways we can cut a rectangular pizza (represented as a matrix with apples and empty cells) into exactly `k` pieces using `k-1` cuts. The tricky part is that **every piece must contain at least one apple** after each cut, which creates a complex dependency between cuts. This constraint makes brute force enumeration impossible for larger inputs, requiring dynamic programming with memoization and prefix sums for efficient computation.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider this 2×3 pizza:

```
A . A
. A .
```

We want to cut it into `k = 3` pieces. The rules are:

1. Each cut must be either horizontal or vertical
2. After each cut, we continue cutting the remaining piece
3. Every final piece must have at least one apple

Let's trace one valid sequence of cuts:

**Step 1:** Start with the whole pizza. It has 3 apples, so it's valid to cut.

**Step 2:** Make a vertical cut between columns 1 and 2 (0-indexed):

- Left piece: `[A .]` and `[. A]` → contains 2 apples ✓
- Right piece: `[A]` and `[.]` → contains 1 apple ✓

**Step 3:** Now we need 2 more pieces total. We can cut the left piece horizontally between rows 0 and 1:

- Top-left: `[A .]` → contains 1 apple ✓
- Bottom-left: `[. A]` → contains 1 apple ✓

We now have 3 pieces total, each with at least one apple. This is one valid way.

The challenge is counting **all** such valid sequences efficiently.

## Brute Force Approach

A naive approach would try all possible sequences of cuts:

1. For the current pizza rectangle, try every possible horizontal cut (between any two rows)
2. For each valid horizontal cut (where both resulting pieces have apples), recursively cut both pieces
3. Similarly try every possible vertical cut
4. Count all sequences that result in exactly `k` pieces

The problem with this approach is **exponential complexity**. For an `m × n` pizza, there are `O(m + n)` possible cuts at each step, and we have `k-1` cuts. The branching factor leads to `O((m+n)^k)` time complexity, which is infeasible for typical constraints.

Even worse, we'd need to repeatedly check if a rectangle contains apples, which would be `O(m×n)` per check without optimization.

## Optimized Approach

The key insights for an efficient solution are:

1. **Dynamic Programming with Memoization**: The problem has overlapping subproblems. When we cut a pizza, we're left with smaller rectangles to cut further. We can memoize `dp[r][c][k]` = number of ways to cut the rectangle from `(r,c)` to bottom-right into `k` pieces.

2. **Prefix Sum for Apple Counting**: To quickly check if a rectangle contains apples, we precompute a 2D prefix sum `apples[r][c]` = number of apples in rectangle from `(r,c)` to bottom-right. Then checking if rectangle `(r1,c1)` to `(r2,c2)` has apples is `O(1)`.

3. **Cut Validity Check**: Before making a cut at position `i`, we check if both resulting pieces have at least one apple using the prefix sum.

4. **State Transition**: For a rectangle starting at `(r,c)` needing `k` pieces:
   - If `k = 1`, just check if the rectangle has apples
   - Otherwise, try all horizontal cuts (between rows) and vertical cuts (between columns)
   - For each valid cut, recursively compute ways for both pieces and multiply

The recurrence relation:

```
dp(r,c,k) = sum over all valid horizontal cuts i:
              dp(r,c,k') * dp(i+1,c,k-k')
           + sum over all valid vertical cuts j:
              dp(r,c,k') * dp(r,j+1,k-k')
```

where `k'` ranges from 1 to `k-1`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m*n*k*(m+n)) | Space: O(m*n*k)
class Solution:
    def ways(self, pizza: List[str], k: int) -> int:
        MOD = 10**9 + 7
        rows, cols = len(pizza), len(pizza[0])

        # Step 1: Precompute prefix sum of apples
        # apples[r][c] = number of apples in rectangle from (r,c) to bottom-right
        apples = [[0] * (cols + 1) for _ in range(rows + 1)]
        for r in range(rows - 1, -1, -1):
            for c in range(cols - 1, -1, -1):
                # Count current cell + right + down - double counted bottom-right
                apples[r][c] = (
                    (1 if pizza[r][c] == 'A' else 0) +
                    apples[r + 1][c] +
                    apples[r][c + 1] -
                    apples[r + 1][c + 1]
                )

        # Memoization table: dp[r][c][pieces] = ways to cut rectangle (r,c) to end
        dp = [[[-1] * (k + 1) for _ in range(cols)] for _ in range(rows)]

        # Helper function to check if rectangle has at least one apple
        def has_apple(r1, c1, r2, c2):
            # Using inclusion-exclusion with prefix sum
            total = apples[r1][c1]
            right = apples[r1][c2 + 1] if c2 + 1 <= cols else 0
            down = apples[r2 + 1][c1] if r2 + 1 <= rows else 0
            corner = apples[r2 + 1][c2 + 1] if r2 + 1 <= rows and c2 + 1 <= cols else 0
            return (total - right - down + corner) > 0

        # Recursive DP function with memoization
        def dfs(r, c, pieces):
            # Base case: if already computed, return cached result
            if dp[r][c][pieces] != -1:
                return dp[r][c][pieces]

            # Base case: if we need 1 piece, check if current rectangle has apples
            if pieces == 1:
                dp[r][c][pieces] = 1 if has_apple(r, c, rows - 1, cols - 1) else 0
                return dp[r][c][pieces]

            ways = 0

            # Try all horizontal cuts (between rows)
            for cut_row in range(r, rows - 1):
                # Check if top piece (r to cut_row) has apples
                if has_apple(r, c, cut_row, cols - 1):
                    # If top piece has apples, recursively cut bottom piece
                    ways = (ways + dfs(cut_row + 1, c, pieces - 1)) % MOD

            # Try all vertical cuts (between columns)
            for cut_col in range(c, cols - 1):
                # Check if left piece (c to cut_col) has apples
                if has_apple(r, c, rows - 1, cut_col):
                    # If left piece has apples, recursively cut right piece
                    ways = (ways + dfs(r, cut_col + 1, pieces - 1)) % MOD

            dp[r][c][pieces] = ways
            return ways

        return dfs(0, 0, k)
```

```javascript
// Time: O(m*n*k*(m+n)) | Space: O(m*n*k)
var ways = function (pizza, k) {
  const MOD = 1e9 + 7;
  const rows = pizza.length;
  const cols = pizza[0].length;

  // Step 1: Precompute prefix sum of apples
  // apples[r][c] = number of apples in rectangle from (r,c) to bottom-right
  const apples = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(0));
  for (let r = rows - 1; r >= 0; r--) {
    for (let c = cols - 1; c >= 0; c--) {
      // Count current cell + right + down - double counted bottom-right
      apples[r][c] =
        (pizza[r][c] === "A" ? 1 : 0) + apples[r + 1][c] + apples[r][c + 1] - apples[r + 1][c + 1];
    }
  }

  // Memoization table: dp[r][c][pieces] = ways to cut rectangle (r,c) to end
  const dp = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Array(k + 1).fill(-1))
  );

  // Helper function to check if rectangle has at least one apple
  const hasApple = (r1, c1, r2, c2) => {
    // Using inclusion-exclusion with prefix sum
    const total = apples[r1][c1];
    const right = c2 + 1 <= cols ? apples[r1][c2 + 1] : 0;
    const down = r2 + 1 <= rows ? apples[r2 + 1][c1] : 0;
    const corner = r2 + 1 <= rows && c2 + 1 <= cols ? apples[r2 + 1][c2 + 1] : 0;
    return total - right - down + corner > 0;
  };

  // Recursive DP function with memoization
  const dfs = (r, c, pieces) => {
    // Base case: if already computed, return cached result
    if (dp[r][c][pieces] !== -1) {
      return dp[r][c][pieces];
    }

    // Base case: if we need 1 piece, check if current rectangle has apples
    if (pieces === 1) {
      dp[r][c][pieces] = hasApple(r, c, rows - 1, cols - 1) ? 1 : 0;
      return dp[r][c][pieces];
    }

    let ways = 0;

    // Try all horizontal cuts (between rows)
    for (let cutRow = r; cutRow < rows - 1; cutRow++) {
      // Check if top piece (r to cutRow) has apples
      if (hasApple(r, c, cutRow, cols - 1)) {
        // If top piece has apples, recursively cut bottom piece
        ways = (ways + dfs(cutRow + 1, c, pieces - 1)) % MOD;
      }
    }

    // Try all vertical cuts (between columns)
    for (let cutCol = c; cutCol < cols - 1; cutCol++) {
      // Check if left piece (c to cutCol) has apples
      if (hasApple(r, c, rows - 1, cutCol)) {
        // If left piece has apples, recursively cut right piece
        ways = (ways + dfs(r, cutCol + 1, pieces - 1)) % MOD;
      }
    }

    dp[r][c][pieces] = ways;
    return ways;
  };

  return dfs(0, 0, k);
};
```

```java
// Time: O(m*n*k*(m+n)) | Space: O(m*n*k)
class Solution {
    private static final int MOD = 1000000007;
    private int[][][] dp;
    private int[][] apples;

    public int ways(String[] pizza, int k) {
        int rows = pizza.length;
        int cols = pizza[0].length();

        // Step 1: Precompute prefix sum of apples
        // apples[r][c] = number of apples in rectangle from (r,c) to bottom-right
        apples = new int[rows + 1][cols + 1];
        for (int r = rows - 1; r >= 0; r--) {
            for (int c = cols - 1; c >= 0; c--) {
                // Count current cell + right + down - double counted bottom-right
                apples[r][c] =
                    (pizza[r].charAt(c) == 'A' ? 1 : 0) +
                    apples[r + 1][c] +
                    apples[r][c + 1] -
                    apples[r + 1][c + 1];
            }
        }

        // Memoization table: dp[r][c][pieces] = ways to cut rectangle (r,c) to end
        dp = new int[rows][cols][k + 1];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                Arrays.fill(dp[r][c], -1);
            }
        }

        return dfs(0, 0, k, rows, cols);
    }

    // Helper function to check if rectangle has at least one apple
    private boolean hasApple(int r1, int c1, int r2, int c2, int rows, int cols) {
        // Using inclusion-exclusion with prefix sum
        int total = apples[r1][c1];
        int right = c2 + 1 <= cols ? apples[r1][c2 + 1] : 0;
        int down = r2 + 1 <= rows ? apples[r2 + 1][c1] : 0;
        int corner = (r2 + 1 <= rows && c2 + 1 <= cols) ? apples[r2 + 1][c2 + 1] : 0;
        return (total - right - down + corner) > 0;
    }

    // Recursive DP function with memoization
    private int dfs(int r, int c, int pieces, int rows, int cols) {
        // Base case: if already computed, return cached result
        if (dp[r][c][pieces] != -1) {
            return dp[r][c][pieces];
        }

        // Base case: if we need 1 piece, check if current rectangle has apples
        if (pieces == 1) {
            dp[r][c][pieces] = hasApple(r, c, rows - 1, cols - 1, rows, cols) ? 1 : 0;
            return dp[r][c][pieces];
        }

        long ways = 0;

        // Try all horizontal cuts (between rows)
        for (int cutRow = r; cutRow < rows - 1; cutRow++) {
            // Check if top piece (r to cutRow) has apples
            if (hasApple(r, c, cutRow, cols - 1, rows, cols)) {
                // If top piece has apples, recursively cut bottom piece
                ways = (ways + dfs(cutRow + 1, c, pieces - 1, rows, cols)) % MOD;
            }
        }

        // Try all vertical cuts (between columns)
        for (int cutCol = c; cutCol < cols - 1; cutCol++) {
            // Check if left piece (c to cutCol) has apples
            if (hasApple(r, c, rows - 1, cutCol, rows, cols)) {
                // If left piece has apples, recursively cut right piece
                ways = (ways + dfs(r, cutCol + 1, pieces - 1, rows, cols)) % MOD;
            }
        }

        dp[r][c][pieces] = (int) ways;
        return dp[r][c][pieces];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(m * n * k * (m + n))`

- We have `m * n * k` states in our DP table
- For each state, we iterate through `O(m + n)` possible cuts
- Each cut validity check is `O(1)` using prefix sums
- Total: `O(m * n * k * (m + n))`

**Space Complexity:** `O(m * n * k)`

- `apples` prefix sum array: `O(m * n)`
- `dp` memoization table: `O(m * n * k)`
- Recursion stack depth: `O(k)` (worst case)

## Common Mistakes

1. **Forgetting the "every piece must have apples" constraint**: This is easy to miss but crucial. Always check both pieces after a cut have apples before proceeding.

2. **Incorrect prefix sum calculation**: The backward accumulation (`from bottom-right to top-left`) is counterintuitive but necessary for `O(1)` rectangle sum queries. A common error is building prefix sums from top-left.

3. **Off-by-one errors in cut positions**: When cutting between row `i` and `i+1`, the resulting pieces are `[0..i]` and `[i+1..end]`. Similarly for columns. Getting these indices wrong leads to incorrect counts.

4. **Not using modulo operations early**: The number of ways can grow very large. Apply modulo `(10^9 + 7)` after each addition to prevent integer overflow.

## When You'll See This Pattern

This problem combines several important patterns:

1. **2D Prefix Sum**: Used in problems like "Range Sum Query 2D - Immutable" (LeetCode 304) where you need fast rectangle sum queries.

2. **DP with Memoization on Subproblems**: Similar to "Selling Pieces of Wood" (LeetCode 2312), which also involves cutting rectangles with value constraints.

3. **Partition DP**: Like "Palindrome Partitioning II" (LeetCode 132) where you partition a sequence with constraints, though here it's 2D.

The core pattern is: when you need to count ways to partition something with constraints, and subproblems overlap, think DP + memoization + prefix sums for fast constraint checking.

## Key Takeaways

1. **Prefix sums enable O(1) rectangle queries**: When you need to repeatedly check sums or counts in subrectangles, 2D prefix sums are your go-to tool.

2. **DP on subrectangles is natural for cutting problems**: The state `(top-left, pieces)` captures all necessary information. Memoization avoids exponential recomputation.

3. **Constraint propagation matters**: The "every piece must have apples" constraint affects which cuts are valid at each step. Always verify constraints before recursing.

Related problems: [Selling Pieces of Wood](/problem/selling-pieces-of-wood)
