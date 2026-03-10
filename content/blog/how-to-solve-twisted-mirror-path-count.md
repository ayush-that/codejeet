---
title: "How to Solve Twisted Mirror Path Count — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Twisted Mirror Path Count. Medium difficulty, 48.1% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2026-02-07"
category: "dsa-patterns"
tags: ["twisted-mirror-path-count", "array", "dynamic-programming", "matrix", "medium"]
---

# How to Solve Twisted Mirror Path Count

This problem asks us to count the number of unique paths a robot can take from the top-left to bottom-right corner of a binary grid, moving only right or down, while accounting for "mirrors" that twist the path. The twist is that when the robot encounters a mirror (grid[i][j] == 1), it must change direction in a specific way that affects subsequent moves. This adds a layer of complexity beyond standard grid path problems.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this 2×3 grid:

```
grid = [
    [0, 1, 0],
    [0, 0, 0]
]
```

The robot starts at (0,0) with an empty cell (0). It can move right to (0,1) or down to (1,0). Let's trace both possibilities:

**Path 1: Right then Down**

1. Start at (0,0) → move right to (0,1)
2. (0,1) has a mirror (1) → this twists the path
3. From a mirror, the robot must move down to (1,1)
4. (1,1) is empty (0) → can move right to (1,2) (destination reached)

**Path 2: Down then Right**

1. Start at (0,0) → move down to (1,0)
2. (1,0) is empty (0) → can move right to (1,1)
3. (1,1) is empty (0) → can move right to (1,2) (destination reached)

So we have 2 valid paths. Notice how the mirror at (0,1) forced a specific move (downward) when encountered. This directional constraint is what makes the problem interesting—we can't simply count all right/down combinations.

## Brute Force Approach

A naive approach would be to explore all possible paths using DFS or BFS. At each cell, we'd check:

- If it's a mirror (1), we must move in the twisted direction
- If it's empty (0), we can try both right and down moves

The brute force code would recursively explore all paths:

<div class="code-group">

```python
# Brute Force - Time: O(2^(m+n)) | Space: O(m+n) for recursion stack
def countPathsBrute(grid):
    m, n = len(grid), len(grid[0])

    def dfs(i, j):
        # Base case: reached destination
        if i == m-1 and j == n-1:
            return 1

        # If out of bounds
        if i >= m or j >= n:
            return 0

        total = 0

        # If current cell is a mirror
        if grid[i][j] == 1:
            # Mirror forces move down
            total += dfs(i+1, j)
        else:
            # Empty cell: can move right or down
            total += dfs(i, j+1)  # Move right
            total += dfs(i+1, j)  # Move down

        return total

    return dfs(0, 0)
```

```javascript
// Brute Force - Time: O(2^(m+n)) | Space: O(m+n) for recursion stack
function countPathsBrute(grid) {
  const m = grid.length,
    n = grid[0].length;

  function dfs(i, j) {
    // Base case: reached destination
    if (i === m - 1 && j === n - 1) return 1;

    // If out of bounds
    if (i >= m || j >= n) return 0;

    let total = 0;

    // If current cell is a mirror
    if (grid[i][j] === 1) {
      // Mirror forces move down
      total += dfs(i + 1, j);
    } else {
      // Empty cell: can move right or down
      total += dfs(i, j + 1); // Move right
      total += dfs(i + 1, j); // Move down
    }

    return total;
  }

  return dfs(0, 0);
}
```

```java
// Brute Force - Time: O(2^(m+n)) | Space: O(m+n) for recursion stack
public int countPathsBrute(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    return dfs(0, 0, grid, m, n);
}

private int dfs(int i, int j, int[][] grid, int m, int n) {
    // Base case: reached destination
    if (i == m-1 && j == n-1) return 1;

    // If out of bounds
    if (i >= m || j >= n) return 0;

    int total = 0;

    // If current cell is a mirror
    if (grid[i][j] == 1) {
        // Mirror forces move down
        total += dfs(i+1, j, grid, m, n);
    } else {
        // Empty cell: can move right or down
        total += dfs(i, j+1, grid, m, n);  // Move right
        total += dfs(i+1, j, grid, m, n);  // Move down
    }

    return total;
}
```

</div>

**Why this is inefficient:** The time complexity is O(2^(m+n)) in the worst case because we're exploring an exponential number of paths. For a 20×20 grid, that's over 1 million operations. We need a more efficient approach.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem. Notice two important properties:

1. **Optimal substructure**: The number of paths to (i,j) depends only on cells above and to the left
2. **Overlapping subproblems**: We compute the same subproblems repeatedly in the brute force approach

We can use a DP table `dp[i][j]` to store the number of ways to reach cell (i,j). The recurrence relation depends on whether the cell is a mirror or not:

- If `grid[i][j] == 1` (mirror): The robot must come from above (since mirrors force downward movement for the next step, but for reaching this cell, it could only come from left or above based on previous moves)
- Wait, let's think carefully: The mirror affects movement FROM the cell, not TO the cell. So when we're at cell (i,j):
  - If it's a mirror: We can only move down from here, so paths to (i,j) can come from left OR above
  - If it's empty: We can move right or down from here, so paths to (i,j) can come from left OR above

Actually, the mirror affects the NEXT move, not how we got here. So the recurrence is simpler:

- `dp[i][j] = dp[i-1][j] + dp[i][j-1]` with boundary checks
- But wait, we need to consider that if the previous cell was a mirror, it might have forced the move to this cell

Let me reconsider: The problem says when the robot is ON a mirror cell, it must move down. So if we're at (i,j), how did we get here?

1. From above (i-1,j): This is valid if (i-1,j) was NOT a mirror (since mirrors force down moves)
2. From left (i,j-1): This is always valid

So the recurrence becomes:

- `dp[i][j] = (isValidFromAbove ? dp[i-1][j] : 0) + dp[i][j-1]`
- Where `isValidFromAbove = (i-1 < 0) ? false : (grid[i-1][j] == 0)`

But actually, if (i-1,j) is a mirror, the robot at (i-1,j) MUST move down to (i,j), so coming from above IS valid if (i-1,j) is a mirror! The mirror forces the move to (i,j).

So the correct recurrence is simply: `dp[i][j] = dp[i-1][j] + dp[i][j-1]` with the understanding that we're counting paths TO each cell, and mirrors only affect moves FROM cells.

## Optimal Solution

Here's the DP solution with careful handling of boundaries and the starting cell:

<div class="code-group">

```python
# Optimal DP Solution - Time: O(m*n) | Space: O(m*n)
def countPaths(grid):
    m, n = len(grid), len(grid[0])

    # Create DP table with same dimensions as grid
    # dp[i][j] = number of ways to reach cell (i,j)
    dp = [[0] * n for _ in range(m)]

    # Base case: starting cell
    dp[0][0] = 1

    # Fill the DP table
    for i in range(m):
        for j in range(n):
            # Skip the starting cell (already initialized)
            if i == 0 and j == 0:
                continue

            # Paths coming from above (if not out of bounds)
            from_above = 0
            if i > 0:
                # We can come from above if the cell above exists
                # The mirror at (i-1,j) doesn't prevent coming to (i,j)
                # because if (i-1,j) is a mirror, it forces move down to (i,j)
                from_above = dp[i-1][j]

            # Paths coming from left (if not out of bounds)
            from_left = 0
            if j > 0:
                # We can come from left if the cell to left exists
                # The mirror at (i,j-1) doesn't prevent coming to (i,j)
                # because if (i,j-1) is a mirror, it would force move down,
                # not right, so actually we CAN'T come from left if (i,j-1) is a mirror!
                # Wait, this is the tricky part!

                # Actually, if (i,j-1) is a mirror, the robot at (i,j-1) must move DOWN,
                # not right. So it cannot move right to reach (i,j).
                # Therefore, we can only come from left if (i,j-1) is NOT a mirror.
                if grid[i][j-1] == 0:  # Cell to left is empty
                    from_left = dp[i][j-1]
                # else: from_left remains 0

            # Wait, we also need to check the mirror at (i-1,j) for vertical moves!
            # If (i-1,j) is a mirror, the robot at (i-1,j) MUST move down to (i,j),
            # so coming from above IS valid.
            # Actually no correction needed for vertical moves.

            dp[i][j] = from_above + from_left

    return dp[m-1][n-1]
```

```javascript
// Optimal DP Solution - Time: O(m*n) | Space: O(m*n)
function countPaths(grid) {
  const m = grid.length,
    n = grid[0].length;

  // Create DP table with same dimensions as grid
  // dp[i][j] = number of ways to reach cell (i,j)
  const dp = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  // Base case: starting cell
  dp[0][0] = 1;

  // Fill the DP table
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Skip the starting cell (already initialized)
      if (i === 0 && j === 0) continue;

      let fromAbove = 0;
      let fromLeft = 0;

      // Paths coming from above (if not out of bounds)
      if (i > 0) {
        // Can come from above regardless of whether (i-1,j) is a mirror
        // because if it's a mirror, it forces move down to (i,j)
        fromAbove = dp[i - 1][j];
      }

      // Paths coming from left (if not out of bounds)
      if (j > 0) {
        // Can only come from left if (i,j-1) is NOT a mirror
        // because mirrors force down moves, not right moves
        if (grid[i][j - 1] === 0) {
          fromLeft = dp[i][j - 1];
        }
      }

      dp[i][j] = fromAbove + fromLeft;
    }
  }

  return dp[m - 1][n - 1];
}
```

```java
// Optimal DP Solution - Time: O(m*n) | Space: O(m*n)
public int countPaths(int[][] grid) {
    int m = grid.length, n = grid[0].length;

    // Create DP table with same dimensions as grid
    // dp[i][j] = number of ways to reach cell (i,j)
    int[][] dp = new int[m][n];

    // Base case: starting cell
    dp[0][0] = 1;

    // Fill the DP table
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            // Skip the starting cell (already initialized)
            if (i == 0 && j == 0) continue;

            int fromAbove = 0;
            int fromLeft = 0;

            // Paths coming from above (if not out of bounds)
            if (i > 0) {
                // Can come from above regardless of whether (i-1,j) is a mirror
                // because if it's a mirror, it forces move down to (i,j)
                fromAbove = dp[i-1][j];
            }

            // Paths coming from left (if not out of bounds)
            if (j > 0) {
                // Can only come from left if (i,j-1) is NOT a mirror
                // because mirrors force down moves, not right moves
                if (grid[i][j-1] == 0) {
                    fromLeft = dp[i][j-1];
                }
            }

            dp[i][j] = fromAbove + fromLeft;
        }
    }

    return dp[m-1][n-1];
}
```

</div>

Actually, I need to correct the logic. Let me trace through the example again with this logic. For the 2×3 example:

- At (0,1): fromAbove = 0 (i=0), fromLeft = 1 (j>0 and grid[0,0]=0) → dp[0,1] = 1 ✓
- At (0,2): fromAbove = 0, fromLeft = 0 (j>0 but grid[0,1]=1, so fromLeft=0) → dp[0,2] = 0 ✓
- At (1,0): fromAbove = 1 (i>0), fromLeft = 0 → dp[1,0] = 1 ✓
- At (1,1): fromAbove = 1 (dp[0,1]=1), fromLeft = 1 (j>0 and grid[1,0]=0) → dp[1,1] = 2 ✓
- At (1,2): fromAbove = 0 (dp[0,2]=0), fromLeft = 2 (j>0 and grid[1,1]=0) → dp[1,2] = 2 ✓

This gives the correct answer of 2! The logic works.

## Complexity Analysis

**Time Complexity:** O(m × n)

- We iterate through each cell of the m × n grid exactly once
- For each cell, we perform O(1) operations (checking boundaries and adjacent cells)
- This is optimal since we must examine each cell at least once

**Space Complexity:** O(m × n)

- We maintain a DP table of size m × n
- We could optimize to O(n) by only keeping the current and previous rows, but the problem doesn't require it and the code is clearer with the full table

## Common Mistakes

1. **Incorrect mirror logic**: The most common mistake is misunderstanding how mirrors affect movement. Remember: mirrors affect moves FROM a cell, not TO a cell. When at a mirror, the next move MUST be down.

2. **Boundary condition errors**: Forgetting to check `i > 0` before accessing `dp[i-1][j]` or `j > 0` before accessing `dp[i][j-1]` will cause index out of bounds errors.

3. **Starting cell initialization**: Forgetting to set `dp[0][0] = 1` or incorrectly initializing it based on whether it's a mirror (the starting cell's value doesn't matter for the initial count).

4. **Modulo operation omission**: Some versions of this problem require returning the answer modulo 10^9+7. Always check the problem statement for this requirement.

## When You'll See This Pattern

This problem combines two classic patterns:

1. **Grid DP (Unique Paths)**: Similar to LeetCode 62 "Unique Paths" and 63 "Unique Paths II", but with a twist on movement constraints.

2. **State-dependent transitions**: Like LeetCode 576 "Out of Boundary Paths" or 688 "Knight Probability in Chessboard", where the next move depends on current state/position.

3. **Obstacle handling**: The mirrors act like conditional obstacles that restrict certain moves, similar to "Unique Paths II" but with more complex rules.

## Key Takeaways

1. **DP for grid path counting**: When asked to count paths in a grid with constraints, dynamic programming is usually the right approach. The recurrence typically relates `dp[i][j]` to `dp[i-1][j]` and `dp[i][j-1]`.

2. **Carefully model constraints**: The tricky part is correctly translating movement rules into DP transitions. Draw small examples and trace through them to verify your logic.

3. **Mirrors affect outgoing edges**: In this problem, the mirror value at cell (i,j) affects whether we can go FROM (i,j) to (i,j+1), not whether we can come TO (i,j) from (i,j-1). This distinction is crucial.

[Practice this problem on CodeJeet](/problem/twisted-mirror-path-count)
