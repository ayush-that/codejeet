---
title: "How to Solve Out of Boundary Paths — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Out of Boundary Paths. Medium difficulty, 48.4% acceptance rate. Topics: Dynamic Programming."
date: "2028-07-07"
category: "dsa-patterns"
tags: ["out-of-boundary-paths", "dynamic-programming", "medium"]
---

# How to Solve Out of Boundary Paths

You're given an `m x n` grid with a ball at position `[startRow, startColumn]`. You can move the ball up, down, left, or right, but you only have `maxMove` moves. The challenge: count how many ways the ball can move out of the grid within those moves. The tricky part is that moves can lead back inside the grid before eventually exiting, and we need to count all possible sequences that result in an exit within the move limit.

## Visual Walkthrough

Let's trace through a small example: `m = 2, n = 2, maxMove = 2, startRow = 0, startColumn = 0`

We start at position (0,0) with 2 moves remaining:

**Move 1:**

- Move right to (0,1) → still inside, 1 move left
- Move down to (1,0) → still inside, 1 move left
- Move left to (0,-1) → OUT! Count this path
- Move up to (-1,0) → OUT! Count this path

**From (0,1) after move 1:**

- Move right to (0,2) → OUT! Count this path
- Move down to (1,1) → still inside, 0 moves left (can't exit)
- Move left to (0,0) → still inside, 0 moves left (can't exit)
- Move up to (-1,1) → OUT! Count this path

**From (1,0) after move 1:**

- Move right to (1,1) → still inside, 0 moves left (can't exit)
- Move down to (2,0) → OUT! Count this path
- Move left to (1,-1) → OUT! Count this path
- Move up to (0,0) → still inside, 0 moves left (can't exit)

Total paths: 6

Notice how we need to track both position AND remaining moves. Some positions with 0 moves left can't contribute to the count even if they're on the boundary.

## Brute Force Approach

The most straightforward approach is DFS recursion: from each position, try all 4 moves, decrement moves remaining, and count when we exit the grid. If moves reach 0, we stop.

<div class="code-group">

```python
# Time: O(4^maxMove) | Space: O(maxMove) for recursion depth
def findPaths(m, n, maxMove, startRow, startColumn):
    MOD = 10**9 + 7

    def dfs(row, col, moves_left):
        # Base case: if we're out of bounds, count this path
        if row < 0 or row >= m or col < 0 or col >= n:
            return 1

        # Base case: no moves left but still inside grid
        if moves_left == 0:
            return 0

        # Try all 4 directions
        total = 0
        for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
            total = (total + dfs(row + dr, col + dc, moves_left - 1)) % MOD

        return total

    return dfs(startRow, startColumn, maxMove)
```

```javascript
// Time: O(4^maxMove) | Space: O(maxMove) for recursion depth
function findPaths(m, n, maxMove, startRow, startColumn) {
  const MOD = 10 ** 9 + 7;

  function dfs(row, col, movesLeft) {
    // Base case: if we're out of bounds, count this path
    if (row < 0 || row >= m || col < 0 || col >= n) {
      return 1;
    }

    // Base case: no moves left but still inside grid
    if (movesLeft === 0) {
      return 0;
    }

    // Try all 4 directions
    let total = 0;
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (const [dr, dc] of directions) {
      total = (total + dfs(row + dr, col + dc, movesLeft - 1)) % MOD;
    }

    return total;
  }

  return dfs(startRow, startColumn, maxMove);
}
```

```java
// Time: O(4^maxMove) | Space: O(maxMove) for recursion depth
class Solution {
    private static final int MOD = 1000000007;

    public int findPaths(int m, int n, int maxMove, int startRow, int startColumn) {
        return dfs(m, n, startRow, startColumn, maxMove);
    }

    private int dfs(int m, int n, int row, int col, int movesLeft) {
        // Base case: if we're out of bounds, count this path
        if (row < 0 || row >= m || col < 0 || col >= n) {
            return 1;
        }

        // Base case: no moves left but still inside grid
        if (movesLeft == 0) {
            return 0;
        }

        // Try all 4 directions
        int total = 0;
        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
        for (int[] dir : directions) {
            total = (total + dfs(m, n, row + dir[0], col + dir[1], movesLeft - 1)) % MOD;
        }

        return total;
    }
}
```

</div>

**Why this fails:** The time complexity is O(4^maxMove) which is exponential. For maxMove = 50, that's 4^50 ≈ 1.27e30 operations - completely infeasible. The problem is we're recomputing the same subproblems many times. For example, from position (i,j) with k moves left, we'll compute the same result multiple times if we reach that state through different paths.

## Optimized Approach

The key insight is **dynamic programming with memoization**. Notice that the number of ways to exit from position (i,j) with k moves left depends only on:

1. The current position (i,j)
2. The number of moves left (k)

This is a perfect candidate for memoization or bottom-up DP. We can store results in a 3D array `dp[moves][row][col]` where `dp[k][i][j]` = number of ways to exit starting from (i,j) with exactly k moves.

**Transition formula:**

- If we're already out of bounds: `dp[k][i][j] = 1` (but we handle this in base case)
- Otherwise: `dp[k][i][j] = sum(dp[k-1][neighbors])` where neighbors are the 4 adjacent positions

We need to be careful: when checking neighbors, if a neighbor is out of bounds, it contributes 1 to the sum (not a recursive call to dp).

**Two approaches:**

1. **Top-down with memoization:** Start from (startRow, startColumn) with maxMove moves, recursively compute with memoization
2. **Bottom-up DP:** Build from 0 moves up to maxMove

The bottom-up approach is often cleaner: we initialize `dp[0][i][j] = 0` for all positions inside grid (with 0 moves, we can't exit). Then for each move count k from 1 to maxMove, we compute `dp[k][i][j]` based on `dp[k-1][neighbors]`.

## Optimal Solution

Here's the bottom-up DP solution. We use a 2D array for the current and previous move counts to save space (since we only need dp[k-1] to compute dp[k]).

<div class="code-group">

```python
# Time: O(maxMove * m * n) | Space: O(m * n)
def findPaths(m, n, maxMove, startRow, startColumn):
    MOD = 10**9 + 7

    # dp will store number of ways to exit from each position
    # We only need two layers: current and previous move count
    dp = [[0] * n for _ in range(m)]

    # Directions: down, up, right, left
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    result = 0

    # Iterate for each move count from 1 to maxMove
    for move in range(1, maxMove + 1):
        # Create new dp for current move count
        new_dp = [[0] * n for _ in range(m)]

        for i in range(m):
            for j in range(n):
                # Check all 4 directions
                for dr, dc in directions:
                    ni, nj = i + dr, j + dc

                    # If neighbor is out of bounds, we can exit in 1 way
                    if ni < 0 or ni >= m or nj < 0 or nj >= n:
                        new_dp[i][j] = (new_dp[i][j] + 1) % MOD
                    else:
                        # Otherwise, add ways from neighbor with move-1
                        new_dp[i][j] = (new_dp[i][j] + dp[ni][nj]) % MOD

        # Update dp for next iteration
        dp = new_dp

        # Add paths from starting position with exactly 'move' moves
        result = (result + dp[startRow][startColumn]) % MOD

    return result
```

```javascript
// Time: O(maxMove * m * n) | Space: O(m * n)
function findPaths(m, n, maxMove, startRow, startColumn) {
  const MOD = 10 ** 9 + 7;

  // dp will store number of ways to exit from each position
  // We only need two layers: current and previous move count
  let dp = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  // Directions: down, up, right, left
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  let result = 0;

  // Iterate for each move count from 1 to maxMove
  for (let move = 1; move <= maxMove; move++) {
    // Create new dp for current move count
    const newDp = Array(m)
      .fill()
      .map(() => Array(n).fill(0));

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        // Check all 4 directions
        for (const [dr, dc] of directions) {
          const ni = i + dr;
          const nj = j + dc;

          // If neighbor is out of bounds, we can exit in 1 way
          if (ni < 0 || ni >= m || nj < 0 || nj >= n) {
            newDp[i][j] = (newDp[i][j] + 1) % MOD;
          } else {
            // Otherwise, add ways from neighbor with move-1
            newDp[i][j] = (newDp[i][j] + dp[ni][nj]) % MOD;
          }
        }
      }
    }

    // Update dp for next iteration
    dp = newDp;

    // Add paths from starting position with exactly 'move' moves
    result = (result + dp[startRow][startColumn]) % MOD;
  }

  return result;
}
```

```java
// Time: O(maxMove * m * n) | Space: O(m * n)
class Solution {
    public int findPaths(int m, int n, int maxMove, int startRow, int startColumn) {
        final int MOD = 1000000007;

        // dp will store number of ways to exit from each position
        // We only need two layers: current and previous move count
        int[][] dp = new int[m][n];

        // Directions: down, up, right, left
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        int result = 0;

        // Iterate for each move count from 1 to maxMove
        for (int move = 1; move <= maxMove; move++) {
            // Create new dp for current move count
            int[][] newDp = new int[m][n];

            for (int i = 0; i < m; i++) {
                for (int j = 0; j < n; j++) {
                    // Check all 4 directions
                    for (int[] dir : directions) {
                        int ni = i + dir[0];
                        int nj = j + dir[1];

                        // If neighbor is out of bounds, we can exit in 1 way
                        if (ni < 0 || ni >= m || nj < 0 || nj >= n) {
                            newDp[i][j] = (newDp[i][j] + 1) % MOD;
                        } else {
                            // Otherwise, add ways from neighbor with move-1
                            newDp[i][j] = (newDp[i][j] + dp[ni][nj]) % MOD;
                        }
                    }
                }
            }

            // Update dp for next iteration
            dp = newDp;

            // Add paths from starting position with exactly 'move' moves
            result = (result + dp[startRow][startColumn]) % MOD;
        }

        return result;
    }
}
```

</div>

**Alternative top-down memoization solution** (often easier to understand):

<div class="code-group">

```python
# Time: O(maxMove * m * n) | Space: O(maxMove * m * n)
def findPaths(m, n, maxMove, startRow, startColumn):
    MOD = 10**9 + 7
    memo = {}

    def dfs(row, col, moves_left):
        # If out of bounds, we found a valid path
        if row < 0 or row >= m or col < 0 or col >= n:
            return 1

        # If no moves left, we're stuck inside
        if moves_left == 0:
            return 0

        # Check memoization
        if (row, col, moves_left) in memo:
            return memo[(row, col, moves_left)]

        # Try all 4 directions
        total = 0
        for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
            total = (total + dfs(row + dr, col + dc, moves_left - 1)) % MOD

        memo[(row, col, moves_left)] = total
        return total

    return dfs(startRow, startColumn, maxMove)
```

</div>

## Complexity Analysis

**Time Complexity:** O(maxMove × m × n)

- We iterate through all moves from 1 to maxMove: O(maxMove)
- For each move, we process all m × n grid cells: O(m × n)
- For each cell, we check 4 directions: O(1) per cell
- Total: O(maxMove × m × n)

**Space Complexity:** O(m × n)

- We maintain two 2D arrays (current and previous dp states)
- Each array has m × n elements
- The memoization approach would use O(maxMove × m × n) space

## Common Mistakes

1. **Forgetting the modulo operation:** The result can be huge (up to 4^maxMove), so we need to apply modulo 10^9+7 at every addition, not just at the end. Otherwise, you'll get integer overflow.

2. **Incorrect base case handling:** When a move takes the ball out of bounds, that counts as 1 path. But if we're already out of bounds with moves left, we should stop (not continue moving). The base case should check bounds first, then moves.

3. **Using 3D array unnecessarily:** While a 3D array dp[move][row][col] is conceptually clear, it uses O(maxMove × m × n) space. We can optimize to O(m × n) by noticing we only need the previous move count to compute the current one.

4. **Off-by-one errors with move counting:** If you have maxMove moves, you can make exactly maxMove moves (not maxMove-1). The ball exits ON the move that takes it out of bounds.

## When You'll See This Pattern

This "grid walk with constraints" pattern appears in many DP problems:

1. **Knight Probability in Chessboard (Medium):** Similar concept - knight moves on chessboard, probability of staying after k moves. Instead of counting exit paths, we count stay paths.

2. **Execution of All Suffix Instructions Staying in a Grid (Medium):** Robot moving in grid with limited moves, counting how many moves it can make before exiting.

3. **Unique Paths II (Medium):** Simpler version - counting paths from top-left to bottom-right with obstacles.

4. **Cherry Pickup II (Hard):** More complex grid traversal with two agents moving simultaneously.

The core pattern: when you have a state defined by position + some resource (moves, time, etc.), and transitions depend only on the current state, DP is the solution.

## Key Takeaways

1. **Recognize state-based counting problems:** When you need to count paths/ways and the decision at each step depends on both position and remaining resources (moves, time, etc.), think DP.

2. **Dimension reduction trick:** If your DP state has multiple dimensions but one dimension (like move count) is processed sequentially, you can often reduce space by keeping only the previous state.

3. **Boundary conditions matter:** In grid exit problems, carefully handle when to count an exit (immediately when crossing boundary) vs. when to continue (still inside with moves left).

Related problems: [Knight Probability in Chessboard](/problem/knight-probability-in-chessboard), [Execution of All Suffix Instructions Staying in a Grid](/problem/execution-of-all-suffix-instructions-staying-in-a-grid)
