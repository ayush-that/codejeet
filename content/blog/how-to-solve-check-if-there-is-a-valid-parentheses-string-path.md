---
title: "How to Solve  Check if There Is a Valid Parentheses String Path — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode  Check if There Is a Valid Parentheses String Path. Hard difficulty, 40.1% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2029-11-13"
category: "dsa-patterns"
tags:
  [
    "check-if-there-is-a-valid-parentheses-string-path",
    "array",
    "dynamic-programming",
    "matrix",
    "hard",
  ]
---

# How to Solve "Check if There Is a Valid Parentheses String Path"

This problem asks us to determine if there exists a path from the top-left to bottom-right corner of an m×n grid, where each cell contains either '(' or ')', such that the sequence of parentheses along the path forms a valid parentheses string. The twist is that we're not just checking a single string—we need to find if any path through the grid creates a valid sequence. This combines grid traversal with parentheses validation, making it a challenging dynamic programming problem.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this 2×2 grid:

```
( )
) (
```

We need to find a path from (0,0) to (1,1) where the parentheses sequence is valid. Let's explore possible paths:

**Path 1: (0,0) → (0,1) → (1,1)**

- Start at (0,0): '(' → count = 1
- Move right to (0,1): ')' → count = 0
- Move down to (1,1): '(' → count = 1
- Final count = 1 (not zero) → INVALID

**Path 2: (0,0) → (1,0) → (1,1)**

- Start at (0,0): '(' → count = 1
- Move down to (1,0): ')' → count = 0
- Move right to (1,1): '(' → count = 1
- Final count = 1 (not zero) → INVALID

No valid path exists. Notice that for a path to be valid:

1. The count (open minus close) must never drop below 0 at any point
2. The final count must be exactly 0

Now consider a grid where a valid path exists:

```
( (
) )
```

**Path: (0,0) → (0,1) → (1,1)**

- Start: '(' → count = 1
- Right: '(' → count = 2
- Down: ')' → count = 1
- Final count = 1 → INVALID

**Path: (0,0) → (1,0) → (1,1)**

- Start: '(' → count = 1
- Down: ')' → count = 0
- Right: ')' → count = -1 → INVALID (dropped below 0)

Actually, this grid has no valid path either. The key insight is we need to track both position in grid AND current balance count.

## Brute Force Approach

The brute force solution would explore all possible paths from (0,0) to (m-1,n-1). For an m×n grid, there are C(m+n-2, m-1) possible paths (choose which steps are down moves). This grows exponentially with grid size.

A naive DFS implementation would:

1. Start at (0,0) with count = 0
2. At each step, move right or down if within bounds
3. Update count: +1 for '(', -1 for ')'
4. Reject if count < 0 (invalid prefix)
5. Accept if at (m-1,n-1) with count = 0

```python
# Brute force DFS - too slow for large grids
def hasValidPath_brute(grid):
    m, n = len(grid), len(grid[0])

    def dfs(i, j, count):
        # Update count based on current cell
        if grid[i][j] == '(':
            count += 1
        else:
            count -= 1

        # Invalid if count goes negative
        if count < 0:
            return False

        # Reached destination
        if i == m-1 and j == n-1:
            return count == 0

        # Try moving right and down
        result = False
        if i + 1 < m:
            result = result or dfs(i+1, j, count)
        if j + 1 < n:
            result = result or dfs(i, j+1, count)

        return result

    return dfs(0, 0, 0)
```

This approach has exponential time complexity O(2^(m+n)) and will time out even for moderate grid sizes (like 100×100). We need to optimize using dynamic programming.

## Optimized Approach

The key insight is that many paths will reach the same cell with the same balance count. We can use dynamic programming to avoid recomputation:

1. **State definition**: Let dp[i][j][k] = whether we can reach cell (i,j) with balance count k
2. **State transition**:
   - From (i-1,j) or (i,j-1) with count k_prev
   - Update count: k = k_prev + 1 if grid[i][j] == '(', else k_prev - 1
   - Only valid if k ≥ 0
3. **Initial state**: dp[0][0][1] = True if grid[0][0] == '(', else impossible
4. **Answer**: dp[m-1][n-1][0] (reached bottom-right with balance 0)

We need to bound k: maximum possible balance is m+n-1 (if all cells are '('), minimum is 0 (can't go negative).

## Optimal Solution

We'll implement a bottom-up DP solution. Since we only need the previous row and column, we can optimize space, but for clarity we'll show the full 3D DP first.

<div class="code-group">

```python
# Time: O(m*n*(m+n)) | Space: O(m*n*(m+n))
def hasValidPath(grid):
    m, n = len(grid), len(grid[0])

    # Maximum possible balance is m+n-1 (all '(')
    max_balance = m + n

    # dp[i][j][k] = can we reach (i,j) with balance k?
    dp = [[[False] * (max_balance + 1) for _ in range(n)] for _ in range(m)]

    # Initialize starting cell
    if grid[0][0] == '(':
        dp[0][0][1] = True
    else:
        # First cell must be '(' for any valid path
        return False

    for i in range(m):
        for j in range(n):
            for k in range(max_balance + 1):
                if not dp[i][j][k]:
                    continue

                # Update count based on current cell (already accounted in initialization)
                current_k = k

                # Try moving down
                if i + 1 < m:
                    next_k = current_k + (1 if grid[i+1][j] == '(' else -1)
                    if 0 <= next_k <= max_balance:
                        dp[i+1][j][next_k] = True

                # Try moving right
                if j + 1 < n:
                    next_k = current_k + (1 if grid[i][j+1] == '(' else -1)
                    if 0 <= next_k <= max_balance:
                        dp[i][j+1][next_k] = True

    # Check if we reached bottom-right with balance 0
    return dp[m-1][n-1][0]
```

```javascript
// Time: O(m*n*(m+n)) | Space: O(m*n*(m+n))
function hasValidPath(grid) {
  const m = grid.length,
    n = grid[0].length;
  const maxBalance = m + n;

  // Create 3D DP array
  const dp = new Array(m);
  for (let i = 0; i < m; i++) {
    dp[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      dp[i][j] = new Array(maxBalance + 1).fill(false);
    }
  }

  // Initialize starting cell
  if (grid[0][0] === "(") {
    dp[0][0][1] = true;
  } else {
    return false; // First cell must be '('
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k <= maxBalance; k++) {
        if (!dp[i][j][k]) continue;

        // Try moving down
        if (i + 1 < m) {
          const nextK = k + (grid[i + 1][j] === "(" ? 1 : -1);
          if (nextK >= 0 && nextK <= maxBalance) {
            dp[i + 1][j][nextK] = true;
          }
        }

        // Try moving right
        if (j + 1 < n) {
          const nextK = k + (grid[i][j + 1] === "(" ? 1 : -1);
          if (nextK >= 0 && nextK <= maxBalance) {
            dp[i][j + 1][nextK] = true;
          }
        }
      }
    }
  }

  return dp[m - 1][n - 1][0];
}
```

```java
// Time: O(m*n*(m+n)) | Space: O(m*n*(m+n))
class Solution {
    public boolean hasValidPath(char[][] grid) {
        int m = grid.length, n = grid[0].length;
        int maxBalance = m + n;

        // dp[i][j][k] = can we reach (i,j) with balance k?
        boolean[][][] dp = new boolean[m][n][maxBalance + 1];

        // Initialize starting cell
        if (grid[0][0] == '(') {
            dp[0][0][1] = true;
        } else {
            return false; // First cell must be '('
        }

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                for (int k = 0; k <= maxBalance; k++) {
                    if (!dp[i][j][k]) continue;

                    // Try moving down
                    if (i + 1 < m) {
                        int nextK = k + (grid[i+1][j] == '(' ? 1 : -1);
                        if (nextK >= 0 && nextK <= maxBalance) {
                            dp[i+1][j][nextK] = true;
                        }
                    }

                    // Try moving right
                    if (j + 1 < n) {
                        int nextK = k + (grid[i][j+1] == '(' ? 1 : -1);
                        if (nextK >= 0 && nextK <= maxBalance) {
                            dp[i][j+1][nextK] = true;
                        }
                    }
                }
            }
        }

        return dp[m-1][n-1][0];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(m × n × (m+n))

- We iterate through all m×n cells
- For each cell, we iterate through all possible balance values (0 to m+n)
- Total operations: m × n × (m+n)

**Space Complexity**: O(m × n × (m+n))

- We store a 3D DP array of size m × n × (m+n)
- Can be optimized to O(n × (m+n)) by only storing current and previous rows

The (m+n) factor comes from the maximum possible balance. Since we can have at most m+n-1 opening parentheses in any path (the path length is m+n-1), the balance ranges from 0 to m+n-1.

## Common Mistakes

1. **Not checking balance stays non-negative**: Forgetting to ensure count ≥ 0 at every step. A valid parentheses string never has more closing than opening parentheses at any prefix.

2. **Incorrect balance bounds**: Using wrong upper bound for balance array. Maximum balance is path length (m+n-1), not grid size.

3. **Missing start cell check**: Not verifying grid[0][0] == '('. If the first cell is ')', no valid path exists since count would immediately become negative.

4. **Off-by-one in array indices**: When accessing dp[i+1][j] or dp[i][j+1], forgetting to check bounds or using wrong indices for balance updates.

5. **Using DFS without memoization**: Attempting pure DFS which explores all paths exponentially. Even with pruning (count < 0), this is too slow for 100×100 grids.

## When You'll See This Pattern

This problem combines two classic patterns:

1. **Grid DP with path counting**: Similar to "Unique Paths" but with additional state. Other problems:
   - [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/) - track path sum instead of balance
   - [Dungeon Game](https://leetcode.com/problems/dungeon-game/) - track health with constraints

2. **Parentheses validation with DP**: Tracking balance count as state. Other problems:
   - [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses/) - uses stack/DP with balance tracking
   - [Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) - uses backtracking with balance count

3. **DP with additional dimension**: When simple 2D DP isn't enough, add a third dimension for additional state. Other problems:
   - [Best Time to Buy and Sell Stock III](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/) - track transaction count
   - [Cherry Pickup](https://leetcode.com/problems/cherry-pickup/) - track two paths simultaneously

## Key Takeaways

1. **When to add DP dimensions**: If the decision at each step depends not just on position but also on some accumulated state (like balance count), add that state as an additional dimension to your DP array.

2. **Prune invalid states early**: In parentheses problems, immediately reject any path where count goes negative. This pruning significantly reduces the state space.

3. **Analyze state space bounds**: Determine reasonable bounds for additional dimensions. Here, balance ranges from 0 to m+n-1, not infinite.

4. **Grid DP order matters**: Process cells in increasing order of (i+j) to ensure dependencies are resolved, or use BFS-like propagation as shown.

Related problems: [Check if There is a Valid Path in a Grid](/problem/check-if-there-is-a-valid-path-in-a-grid), [Check if a Parentheses String Can Be Valid](/problem/check-if-a-parentheses-string-can-be-valid)
