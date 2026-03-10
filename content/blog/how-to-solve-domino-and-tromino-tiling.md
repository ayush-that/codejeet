---
title: "How to Solve Domino and Tromino Tiling — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Domino and Tromino Tiling. Medium difficulty, 51.4% acceptance rate. Topics: Dynamic Programming."
date: "2028-02-27"
category: "dsa-patterns"
tags: ["domino-and-tromino-tiling", "dynamic-programming", "medium"]
---

# How to Solve Domino and Tromino Tiling

This problem asks us to count the number of ways to tile a 2×n board using two types of tiles: dominoes (2×1 rectangles) and trominoes (L-shaped pieces that cover 3 squares). The tricky part is that both pieces can be rotated, creating complex arrangements where pieces interlock in non-obvious ways. This isn't a simple Fibonacci-style tiling problem—the trominoes introduce asymmetry that requires careful state tracking.

## Visual Walkthrough

Let's build intuition with small values of n:

**n = 1**: Only one way - place a vertical domino (since trominoes need at least 2 columns).

```
| |
```

**n = 2**: Several arrangements:

1. Two vertical dominoes

```
| |
| |
```

2. Two horizontal dominoes

```
_ _
_ _
```

3. Two trominoes forming a 2×2 square (one rotated 180°)

```
⌜ ⌝
⌞ ⌟
```

Total: 3 ways

**n = 3**: This gets more interesting. We can have:

- All vertical dominoes (1 way)
- Mixed vertical/horizontal arrangements
- Trominoes combined with dominoes

The key insight emerges: when we place a tromino, it creates a "gap" that must be filled by another tromino in a specific orientation. This creates dependencies between columns that simple recurrence relations can't capture directly.

## Brute Force Approach

A naive approach would try to generate all possible tilings using backtracking. We could:

1. Start with an empty 2×n grid
2. Try placing each possible tile (domino in 2 orientations, tromino in 4 orientations)
3. Recursively fill the remaining space
4. Count complete tilings

The problem? The branching factor is huge. For each empty cell, we might try 6 different tile placements. With n up to 1000, this is astronomically slow (roughly O(6^n)). Even memoization won't help much without a smarter state representation.

What candidates often miss: The board has only 2 rows, so we can represent the state by how many columns are filled and what the "profile" looks like at the current column boundary.

## Optimized Approach

The breakthrough comes from defining states that capture partial tilings. Let's define:

- `dp[n]`: Number of ways to completely fill a 2×n board
- `dp1[n]`: Number of ways to fill a 2×n board plus one extra square in the top row of column n+1
- `dp2[n]`: Number of ways to fill a 2×n board plus one extra square in the bottom row of column n+1

By symmetry, `dp1[n] = dp2[n]`. Now we can derive recurrences:

1. **For dp[n]** (complete filling):
   - Add a vertical domino: contributes `dp[n-1]`
   - Add two horizontal dominoes: contributes `dp[n-2]`
   - Add a tromino that leaves one square unfilled: contributes `2 * dp1[n-2]` (tromino can be oriented two ways)

2. **For dp1[n]** (one square missing):
   - Add a horizontal domino to cover the missing square and one more: contributes `dp[n-1]`
   - Add a tromino that leaves the other square missing: contributes `dp1[n-1]`

The base cases:

- `dp[0] = 1` (empty board is one way)
- `dp[1] = 1` (only vertical domino)
- `dp1[0] = 0` (can't have missing square with no columns)

This dynamic programming approach runs in O(n) time—a massive improvement over brute force.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def numTilings(n: int) -> int:
    MOD = 10**9 + 7

    # Base cases
    if n == 1:
        return 1
    if n == 2:
        return 2

    # dp[i]: ways to completely fill 2xi board
    # dp1[i]: ways to fill 2xi board with one extra square in top row of column i+1
    dp = [0] * (n + 1)
    dp1 = [0] * (n + 1)

    # Initialize base cases
    dp[0] = 1  # Empty board
    dp[1] = 1  # One vertical domino
    dp[2] = 2  # Two vertical or two horizontal dominoes

    dp1[0] = 0  # No columns, can't have missing square
    dp1[1] = 1  # One column with missing square in next column

    # Fill DP tables
    for i in range(3, n + 1):
        # For complete filling at column i:
        # 1. Add vertical domino to complete board at i-1
        # 2. Add two horizontal dominoes to complete board at i-2
        # 3. Add tromino (two orientations) that leaves one square
        dp[i] = (dp[i-1] + dp[i-2] + 2 * dp1[i-2]) % MOD

        # For partial filling (one square missing) at column i:
        # 1. Add horizontal domino to cover missing square
        # 2. Add tromino that leaves the other square missing
        dp1[i] = (dp[i-1] + dp1[i-1]) % MOD

    return dp[n] % MOD
```

```javascript
// Time: O(n) | Space: O(n)
function numTilings(n) {
  const MOD = 1_000_000_007;

  // Base cases
  if (n === 1) return 1;
  if (n === 2) return 2;

  // dp[i]: ways to completely fill 2xi board
  // dp1[i]: ways to fill 2xi board with one extra square in top row of column i+1
  const dp = new Array(n + 1).fill(0);
  const dp1 = new Array(n + 1).fill(0);

  // Initialize base cases
  dp[0] = 1; // Empty board
  dp[1] = 1; // One vertical domino
  dp[2] = 2; // Two vertical or two horizontal dominoes

  dp1[0] = 0; // No columns, can't have missing square
  dp1[1] = 1; // One column with missing square in next column

  // Fill DP tables
  for (let i = 3; i <= n; i++) {
    // For complete filling at column i:
    // 1. Add vertical domino to complete board at i-1
    // 2. Add two horizontal dominoes to complete board at i-2
    // 3. Add tromino (two orientations) that leaves one square
    dp[i] = (dp[i - 1] + dp[i - 2] + 2 * dp1[i - 2]) % MOD;

    // For partial filling (one square missing) at column i:
    // 1. Add horizontal domino to cover missing square
    // 2. Add tromino that leaves the other square missing
    dp1[i] = (dp[i - 1] + dp1[i - 1]) % MOD;
  }

  return dp[n] % MOD;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int numTilings(int n) {
        final int MOD = 1_000_000_007;

        // Base cases
        if (n == 1) return 1;
        if (n == 2) return 2;

        // dp[i]: ways to completely fill 2xi board
        // dp1[i]: ways to fill 2xi board with one extra square in top row of column i+1
        long[] dp = new long[n + 1];
        long[] dp1 = new long[n + 1];

        // Initialize base cases
        dp[0] = 1;  // Empty board
        dp[1] = 1;  // One vertical domino
        dp[2] = 2;  // Two vertical or two horizontal dominoes

        dp1[0] = 0;  // No columns, can't have missing square
        dp1[1] = 1;  // One column with missing square in next column

        // Fill DP tables
        for (int i = 3; i <= n; i++) {
            // For complete filling at column i:
            // 1. Add vertical domino to complete board at i-1
            // 2. Add two horizontal dominoes to complete board at i-2
            // 3. Add tromino (two orientations) that leaves one square
            dp[i] = (dp[i-1] + dp[i-2] + 2 * dp1[i-2]) % MOD;

            // For partial filling (one square missing) at column i:
            // 1. Add horizontal domino to cover missing square
            // 2. Add tromino that leaves the other square missing
            dp1[i] = (dp[i-1] + dp1[i-1]) % MOD;
        }

        return (int)(dp[n] % MOD);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate from 3 to n once, performing constant-time operations at each step
- Each iteration computes dp[i] and dp1[i] using previously computed values

**Space Complexity:** O(n)

- We maintain two arrays of size n+1
- Could be optimized to O(1) by only keeping the last 2-3 values, but O(n) is acceptable for n ≤ 1000

## Common Mistakes

1. **Forgetting the modulo operation**: The result grows extremely fast (exponential in n). Without modulo, you'll get integer overflow even with 64-bit integers. Always apply modulo after each addition/multiplication.

2. **Incorrect base cases**: Many candidates miss that dp[0] = 1 (the empty tiling counts as one way). Also, dp[2] = 2, not 3, because the tromino arrangement only works starting from n=3.

3. **Confusing state definitions**: The partial state dp1 represents a board with ONE extra square in the NEXT column, not the current column. Getting this wrong breaks the recurrence relations.

4. **Missing the factor of 2 for trominoes**: When adding a tromino to complete a board, there are two possible orientations (⌜ and ⌝ shapes). Forgetting to multiply by 2 gives half the correct answer.

## When You'll See This Pattern

This problem uses **stateful dynamic programming**, where you need to track multiple states to capture different "profiles" of partial solutions. Similar patterns appear in:

1. **Paint Fence (LeetCode 276)**: Count ways to paint n posts with k colors where no more than 2 adjacent posts have the same color. You track states for "last two same color" vs "last two different color."

2. **Decode Ways (LeetCode 91)**: Count ways to decode a digit string. You track states based on whether the last digit formed a valid 1-digit or 2-digit code.

3. **Knight Probability in Chessboard (LeetCode 688)**: Probability a knight remains on board after k moves. You track probability distributions across the board.

The common theme: When a simple 1D DP array isn't enough because decisions have "memory" or create asymmetries, you need to define multiple related DP states.

## Key Takeaways

1. **When simple recurrence fails, add states**: If you can't express f(n) purely in terms of f(n-1), f(n-2), etc., consider what additional information you need to track. Here, we needed to track boards with "missing" squares.

2. **Visualize the transition diagram**: Draw how each state can transition to others. For this problem, draw how complete boards and partially-filled boards transform when adding each tile type.

3. **Look for symmetry to reduce states**: We only needed dp1, not dp1 and dp2 separately, because the top and bottom rows are symmetric. Recognizing symmetry can cut your state space in half.

[Practice this problem on CodeJeet](/problem/domino-and-tromino-tiling)
