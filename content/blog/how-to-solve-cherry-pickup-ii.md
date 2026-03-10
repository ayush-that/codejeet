---
title: "How to Solve Cherry Pickup II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Cherry Pickup II. Hard difficulty, 72.3% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2028-07-04"
category: "dsa-patterns"
tags: ["cherry-pickup-ii", "array", "dynamic-programming", "matrix", "hard"]
---

# How to Solve Cherry Pickup II

Cherry Pickup II is a challenging 3D dynamic programming problem where two robots move simultaneously through a grid collecting cherries. What makes this problem tricky is that both robots move at the same time (one row per step), and they can't occupy the same cell when collecting cherries. The goal is to maximize the total cherries collected by both robots as they move from the top to the bottom of the grid.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [
    [3, 1, 1],
    [2, 5, 1],
    [1, 5, 5],
    [2, 1, 1]
]
```

We have two robots starting at positions (0,0) and (0,2). At each step, both robots move down one row, but each can choose to stay in the same column, move left, or move right (within bounds).

**Step 1 (row 0):**

- Robot1 at (0,0) collects 3 cherries
- Robot2 at (0,2) collects 1 cherry
- Total: 4 cherries

**Step 2 (row 1):**

- Robot1 can move to (1,0), (1,1)
- Robot2 can move to (1,1), (1,2)
- If Robot1 goes to (1,1) and Robot2 goes to (1,2):
  - Robot1 collects 5 cherries
  - Robot2 collects 1 cherry
  - Total: 5 + 1 = 6 cherries
- Running total: 4 + 6 = 10 cherries

**Step 3 (row 2):**

- From previous positions, continue exploring...
- The optimal path continues similarly

The key insight is that at each row, we need to consider all possible column positions for both robots and choose the combination that maximizes cherries collected.

## Brute Force Approach

A naive approach would be to explore all possible paths for both robots using DFS/backtracking. At each row `r`, Robot1 has up to 3 choices (stay, left, right) and Robot2 has up to 3 choices, giving us 9 combinations to explore at each step.

For a grid with `R` rows and `C` columns, this results in approximately `O(9^R)` time complexity, which is exponential and impractical for typical constraints (R up to 70, C up to 70).

Even with memoization, the state space would be `R × C × C` (row position and both column positions), which is manageable at `70 × 70 × 70 = 343,000` states. However, the brute force DFS without memoization is what we need to optimize.

## Optimized Approach

The key insight is that this is a **3D dynamic programming** problem. We can define `dp[r][c1][c2]` as the maximum cherries collected when Robot1 is at column `c1` and Robot2 is at column `c2` in row `r`.

**State Transition:**
From state `(r, c1, c2)`, both robots move to the next row `r+1`. Robot1 can move to `c1-1`, `c1`, or `c1+1`, and Robot2 can move to `c2-1`, `c2`, or `c2+1`. This gives us 3 × 3 = 9 possible next states.

**Cherry Calculation:**
The cherries collected at step `r` are:

- `grid[r][c1] + grid[r][c2]` if `c1 ≠ c2`
- `grid[r][c1]` if `c1 = c2` (robots can't both collect from the same cell)

**Base Case:**
At the last row, no more cherries can be collected.

**Optimal Substructure:**
The maximum cherries from `(r, c1, c2)` equals the cherries collected at current position plus the maximum cherries from all valid next positions.

We can solve this with either top-down memoization or bottom-up DP. Top-down is often more intuitive for this problem.

## Optimal Solution

Here's the complete solution using top-down memoization:

<div class="code-group">

```python
# Time: O(R * C^2) | Space: O(R * C^2)
class Solution:
    def cherryPickup(self, grid: List[List[int]]) -> int:
        R, C = len(grid), len(grid[0])

        # Memoization dictionary: (row, col1, col2) -> max cherries
        memo = {}

        def dfs(row, col1, col2):
            # Base case: if we're out of bounds or at the bottom row
            if row == R:
                return 0

            # Check if we've already computed this state
            if (row, col1, col2) in memo:
                return memo[(row, col1, col2)]

            # Current cherries collected at this row
            # If both robots are in the same cell, only count cherries once
            current_cherries = grid[row][col1]
            if col1 != col2:
                current_cherries += grid[row][col2]

            # Explore all possible moves for the next row
            max_future = 0
            # Robot1 can move to col1-1, col1, or col1+1
            for next_col1 in (col1 - 1, col1, col1 + 1):
                # Robot2 can move to col2-1, col2, or col2+1
                for next_col2 in (col2 - 1, col2, col2 + 1):
                    # Check if both next positions are within bounds
                    if 0 <= next_col1 < C and 0 <= next_col2 < C:
                        # Recursively compute maximum from next state
                        max_future = max(max_future, dfs(row + 1, next_col1, next_col2))

            # Total cherries from this state = current + best future
            result = current_cherries + max_future
            memo[(row, col1, col2)] = result
            return result

        # Start from top row with Robot1 at column 0 and Robot2 at column C-1
        return dfs(0, 0, C - 1)
```

```javascript
// Time: O(R * C^2) | Space: O(R * C^2)
/**
 * @param {number[][]} grid
 * @return {number}
 */
var cherryPickup = function (grid) {
  const R = grid.length;
  const C = grid[0].length;

  // Memoization map: key = "row,col1,col2", value = max cherries
  const memo = new Map();

  const dfs = (row, col1, col2) => {
    // Base case: reached bottom of grid
    if (row === R) {
      return 0;
    }

    // Create memo key
    const key = `${row},${col1},${col2}`;

    // Return cached result if available
    if (memo.has(key)) {
      return memo.get(key);
    }

    // Calculate cherries collected at current position
    let currentCherries = grid[row][col1];
    if (col1 !== col2) {
      currentCherries += grid[row][col2];
    }

    // Explore all possible moves for next row
    let maxFuture = 0;

    // Robot1's possible next columns
    const nextCols1 = [col1 - 1, col1, col1 + 1];
    // Robot2's possible next columns
    const nextCols2 = [col2 - 1, col2, col2 + 1];

    for (const nextCol1 of nextCols1) {
      for (const nextCol2 of nextCols2) {
        // Check if both next positions are valid
        if (nextCol1 >= 0 && nextCol1 < C && nextCol2 >= 0 && nextCol2 < C) {
          // Recursively get maximum from next state
          maxFuture = Math.max(maxFuture, dfs(row + 1, nextCol1, nextCol2));
        }
      }
    }

    // Total cherries = current + best future
    const result = currentCherries + maxFuture;
    memo.set(key, result);
    return result;
  };

  // Start from top with robots at opposite corners
  return dfs(0, 0, C - 1);
};
```

```java
// Time: O(R * C^2) | Space: O(R * C^2)
class Solution {
    public int cherryPickup(int[][] grid) {
        int R = grid.length;
        int C = grid[0].length;

        // Memoization array: dp[row][col1][col2]
        Integer[][][] memo = new Integer[R][C][C];

        return dfs(grid, 0, 0, C - 1, memo);
    }

    private int dfs(int[][] grid, int row, int col1, int col2, Integer[][][] memo) {
        int R = grid.length;
        int C = grid[0].length;

        // Base case: reached bottom of grid
        if (row == R) {
            return 0;
        }

        // Return cached result if available
        if (memo[row][col1][col2] != null) {
            return memo[row][col1][col2];
        }

        // Calculate cherries collected at current position
        int currentCherries = grid[row][col1];
        if (col1 != col2) {
            currentCherries += grid[row][col2];
        }

        // Explore all possible moves for next row
        int maxFuture = 0;

        // Robot1's possible moves: -1, 0, +1
        for (int d1 = -1; d1 <= 1; d1++) {
            // Robot2's possible moves: -1, 0, +1
            for (int d2 = -1; d2 <= 1; d2++) {
                int nextCol1 = col1 + d1;
                int nextCol2 = col2 + d2;

                // Check if both next positions are valid
                if (nextCol1 >= 0 && nextCol1 < C &&
                    nextCol2 >= 0 && nextCol2 < C) {
                    // Recursively get maximum from next state
                    maxFuture = Math.max(maxFuture,
                                        dfs(grid, row + 1, nextCol1, nextCol2, memo));
                }
            }
        }

        // Total cherries = current + best future
        int result = currentCherries + maxFuture;
        memo[row][col1][col2] = result;
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(R × C²)`

- We have `R × C × C` possible states (row, col1, col2)
- For each state, we explore 9 possible next moves (constant time)
- Total operations: `R × C × C × 9 = O(R × C²)`

**Space Complexity:** `O(R × C²)`

- The memoization table stores results for all `R × C × C` states
- The recursion depth is at most `R`, which is `O(R)` for the call stack
- Total space: `O(R × C²)` for memoization + `O(R)` for recursion = `O(R × C²)`

**Optimization Note:** We can reduce space to `O(C²)` by using only two rows at a time (current and next) since we only need information from the next row to compute the current row. This is a common DP space optimization technique.

## Common Mistakes

1. **Double-counting cherries when robots are in the same cell**: This is the most common mistake. Remember that if both robots land on the same cell, they can't both collect cherries from it. You must only count those cherries once.

2. **Not checking bounds properly**: When robots move left/right, they might go out of bounds. Always validate that `0 ≤ next_col < C` for both robots before making recursive calls.

3. **Using the wrong starting positions**: Robot1 starts at column 0, but Robot2 starts at column `C-1` (last column), not column 0. Starting both at column 0 would mean they're in the same starting cell.

4. **Forgetting to memoize**: Without memoization, the solution becomes exponential. Always check if a state has been computed before recomputing it.

## When You'll See This Pattern

This 3D DP pattern appears in problems where you need to track multiple moving agents or make multiple simultaneous decisions:

1. **Cherry Pickup (741)**: The original Cherry Pickup problem where one robot makes two passes. Similar state representation but with different movement constraints.

2. **Minimum Path Sum with Two Paths**: Problems where you need to find two optimal paths that don't interfere with each other.

3. **Maximum Points You Can Obtain from Cards (1423)**: While not exactly the same, it involves making optimal choices from both ends simultaneously.

The key pattern is when you have multiple decision-makers moving through a space, and their positions are interdependent (they can't occupy the same cell when collecting rewards).

## Key Takeaways

1. **3D DP for multiple agents**: When you have two entities moving through a grid, consider a 3D DP state `(position1, position2)` or `(row, col1, col2)` if they move row-by-row together.

2. **Simultaneous movement simplification**: When both agents move synchronously (same row advancement), you only need to track their column positions at each row, reducing state complexity.

3. **Avoid double-counting**: When multiple agents can occupy the same cell, carefully define how rewards are collected to avoid counting them multiple times.

[Practice this problem on CodeJeet](/problem/cherry-pickup-ii)
