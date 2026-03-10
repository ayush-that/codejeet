---
title: "How to Solve Knight Probability in Chessboard — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Knight Probability in Chessboard. Medium difficulty, 56.9% acceptance rate. Topics: Dynamic Programming."
date: "2026-03-21"
category: "dsa-patterns"
tags: ["knight-probability-in-chessboard", "dynamic-programming", "medium"]
---

# How to Solve Knight Probability in Chessboard

You're given an `n x n` chessboard, a starting position `(row, column)`, and `k` moves to make. The knight moves in its standard L-shaped pattern. After exactly `k` moves, you need to find the probability that the knight remains on the board. The tricky part is that `k` can be up to 100, and `n` up to 25, making brute force exploration of all paths impossible (8^k possibilities). This is a classic dynamic programming problem where we track probabilities rather than just reachability.

## Visual Walkthrough

Let's trace through a small example: `n = 3, k = 2, row = 0, column = 0`

**Step 1: Initial position (k = 0)**

- Knight starts at (0,0) with probability 1.0
- All other cells have probability 0.0

**Step 2: After 1 move (k = 1)**
From (0,0), the knight can move to:

- (2,1) - valid (on board)
- (1,2) - valid (on board)
- Other 6 moves go off-board

Each valid move has probability = 1/8 (since 8 possible moves)
So after 1 move:

- (2,1): probability = 1/8
- (1,2): probability = 1/8
- All other cells: 0

**Step 3: After 2 moves (k = 2)**
From (2,1):

- Possible moves: (0,0), (0,2), (1,3), (3,3), (4,2), (4,0), (3,-1), (1,-1)
- Only (0,0) and (0,2) are on 3x3 board
- Each gets probability contribution: (1/8) × (1/8) = 1/64

From (1,2):

- Possible moves: (-1,0), (-1,4), (0,3), (2,3), (3,2), (3,0), (2,-1), (0,-1)
- Only (0,0) is on board
- Contribution: (1/8) × (1/8) = 1/64

**Final probability:**

- (0,0): 1/64 + 1/64 = 2/64 = 0.03125
- (0,2): 1/64 = 0.015625
- Sum of all on-board probabilities = 3/64 = 0.046875

The answer is 0.046875, which matches 3/64.

## Brute Force Approach

The brute force approach would be to simulate all possible sequences of `k` moves using DFS or BFS. For each position, we'd recursively try all 8 moves, counting how many sequences keep the knight on the board after `k` moves.

**Why this fails:**

- Time complexity: O(8^k) - exponential explosion
- For k = 100, that's 8^100 ≈ 2 × 10^90 operations (impossible)
- Even with memoization of positions, we still have n² × k states to compute

The key insight is that we don't need to track individual paths, just probabilities. Many paths lead to the same intermediate positions, and we can combine their probabilities.

## Optimized Approach

The optimal solution uses **Dynamic Programming** with a clever state definition:

**Key Insight:** Instead of tracking whether we _can_ reach a cell, track the _probability_ of being at that cell after a certain number of moves.

**DP State:** `dp[moves][r][c]` = probability of being at cell (r,c) after exactly `moves` moves

**Transition:** To compute `dp[moves][r][c]`, we look at all 8 possible previous positions that could have moved to (r,c) in one step:

```
dp[moves][r][c] = sum(dp[moves-1][prev_r][prev_c] / 8)
```

for all valid (prev_r, prev_c) that can reach (r,c) in one knight move.

**Base Case:** `dp[0][row][column] = 1.0` (starting position)

**Answer:** Sum of `dp[k][r][c]` for all valid (r,c) on the board

**Space Optimization:** We only need the previous move's probabilities to compute the current move's probabilities, so we can use two 2D arrays instead of a 3D array.

## Optimal Solution

<div class="code-group">

```python
# Time: O(k * n^2) | Space: O(n^2)
def knightProbability(n: int, k: int, row: int, column: int) -> float:
    """
    Calculate the probability that a knight remains on an n x n chessboard
    after making exactly k moves starting from (row, column).
    """
    # All 8 possible knight moves
    moves = [
        (2, 1), (2, -1), (-2, 1), (-2, -1),
        (1, 2), (1, -2), (-1, 2), (-1, -2)
    ]

    # dp[r][c] represents probability of being at (r,c) after current number of moves
    dp = [[0.0] * n for _ in range(n)]
    dp[row][column] = 1.0  # Starting position has probability 1

    # For each move from 1 to k
    for move in range(1, k + 1):
        # Create new dp for current move (probabilities after this move)
        new_dp = [[0.0] * n for _ in range(n)]

        # Iterate through all cells on the board
        for r in range(n):
            for c in range(n):
                # If probability from previous move is 0, skip
                if dp[r][c] == 0:
                    continue

                # Try all 8 possible knight moves from (r,c)
                for dr, dc in moves:
                    nr, nc = r + dr, c + dc

                    # Check if new position is within board boundaries
                    if 0 <= nr < n and 0 <= nc < n:
                        # Add probability contribution: previous prob divided by 8
                        new_dp[nr][nc] += dp[r][c] / 8.0

        # Update dp to be the probabilities after this move
        dp = new_dp

    # Sum all probabilities in final dp (all positions still on board)
    total_probability = 0.0
    for r in range(n):
        for c in range(n):
            total_probability += dp[r][c]

    return total_probability
```

```javascript
// Time: O(k * n^2) | Space: O(n^2)
/**
 * Calculate the probability that a knight remains on an n x n chessboard
 * after making exactly k moves starting from (row, column).
 */
function knightProbability(n, k, row, column) {
  // All 8 possible knight moves
  const moves = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
  ];

  // dp[r][c] represents probability of being at (r,c) after current number of moves
  let dp = Array.from({ length: n }, () => new Array(n).fill(0));
  dp[row][column] = 1.0; // Starting position has probability 1

  // For each move from 1 to k
  for (let move = 1; move <= k; move++) {
    // Create new dp for current move (probabilities after this move)
    let newDp = Array.from({ length: n }, () => new Array(n).fill(0));

    // Iterate through all cells on the board
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        // If probability from previous move is 0, skip
        if (dp[r][c] === 0) continue;

        // Try all 8 possible knight moves from (r,c)
        for (const [dr, dc] of moves) {
          const nr = r + dr;
          const nc = c + dc;

          // Check if new position is within board boundaries
          if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
            // Add probability contribution: previous prob divided by 8
            newDp[nr][nc] += dp[r][c] / 8.0;
          }
        }
      }
    }

    // Update dp to be the probabilities after this move
    dp = newDp;
  }

  // Sum all probabilities in final dp (all positions still on board)
  let totalProbability = 0.0;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      totalProbability += dp[r][c];
    }
  }

  return totalProbability;
}
```

```java
// Time: O(k * n^2) | Space: O(n^2)
class Solution {
    public double knightProbability(int n, int k, int row, int column) {
        // All 8 possible knight moves
        int[][] moves = {
            {2, 1}, {2, -1}, {-2, 1}, {-2, -1},
            {1, 2}, {1, -2}, {-1, 2}, {-1, -2}
        };

        // dp[r][c] represents probability of being at (r,c) after current number of moves
        double[][] dp = new double[n][n];
        dp[row][column] = 1.0;  // Starting position has probability 1

        // For each move from 1 to k
        for (int move = 1; move <= k; move++) {
            // Create new dp for current move (probabilities after this move)
            double[][] newDp = new double[n][n];

            // Iterate through all cells on the board
            for (int r = 0; r < n; r++) {
                for (int c = 0; c < n; c++) {
                    // If probability from previous move is 0, skip
                    if (dp[r][c] == 0) continue;

                    // Try all 8 possible knight moves from (r,c)
                    for (int[] m : moves) {
                        int nr = r + m[0];
                        int nc = c + m[1];

                        // Check if new position is within board boundaries
                        if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
                            // Add probability contribution: previous prob divided by 8
                            newDp[nr][nc] += dp[r][c] / 8.0;
                        }
                    }
                }
            }

            // Update dp to be the probabilities after this move
            dp = newDp;
        }

        // Sum all probabilities in final dp (all positions still on board)
        double totalProbability = 0.0;
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                totalProbability += dp[r][c];
            }
        }

        return totalProbability;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(k × n²)

- We iterate through `k` moves
- For each move, we process all n² cells
- For each cell, we check 8 possible moves (constant)
- Total: O(k × n² × 8) = O(k × n²)

**Space Complexity:** O(n²)

- We maintain two n×n arrays (`dp` and `new_dp`)
- Each stores probabilities for all cells
- We could optimize to O(n) by only storing current and next rows if we process in a specific order, but O(n²) is simpler and sufficient

## Common Mistakes

1. **Using integer division instead of float division:** When dividing by 8, use `8.0` or cast to float. Integer division would give 0 for probabilities less than 1.

2. **Not resetting the dp array each move:** You must create a fresh `new_dp` array for each move. If you modify `dp` in-place, you'll mix probabilities from different move counts.

3. **Incorrect boundary checking:** Remember knight moves can go negative or beyond n-1. Always check `0 <= nr < n` and `0 <= nc < n`.

4. **Forgetting to handle k = 0 case:** When k = 0, the knight doesn't move, so probability is 1.0 if starting position is valid. Our code handles this correctly since we return `dp` after 0 moves.

5. **Using DFS/BFS without memoization:** This leads to exponential time. Even with memoization, you need to track both position AND remaining moves as state.

## When You'll See This Pattern

This "probability DP on a grid" pattern appears in several LeetCode problems:

1. **Out of Boundary Paths (Medium)** - Similar concept: find number of paths that stay within bounds for exactly k moves. Instead of probability, count paths, but same DP structure.

2. **Maximum Number of Moves to Kill All Pawns (Hard)** - More complex variant with multiple pieces and different movement rules, but same grid-based DP approach.

3. **Unique Paths II (Medium)** - Simpler grid DP without the "exactly k moves" constraint, but similar state transitions.

The pattern is: When you have an agent moving on a grid with a fixed number of moves/steps, and you need to compute reachability or probability, think about DP where state = (position, moves_used).

## Key Takeaways

1. **Probability DP vs Count DP:** When moves have equal probability, you can convert a counting problem to a probability problem by dividing by the number of choices at each step.

2. **State compression:** For "exactly k moves" problems, you only need to store the previous move's probabilities to compute the current move's probabilities.

3. **Grid movement problems:** When an agent moves on a grid with fixed movement patterns, DP with state (position, time) is often the solution. The time dimension can often be optimized to O(1) extra space.

4. **Boundary conditions matter:** Always validate moves stay within bounds. For knight moves specifically, check all 8 L-shaped patterns.

Related problems: [Out of Boundary Paths](/problem/out-of-boundary-paths), [Maximum Number of Moves to Kill All Pawns](/problem/maximum-number-of-moves-to-kill-all-pawns)
