---
title: "How to Solve Game of Life — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Game of Life. Medium difficulty, 72.4% acceptance rate. Topics: Array, Matrix, Simulation."
date: "2027-02-25"
category: "dsa-patterns"
tags: ["game-of-life", "array", "matrix", "simulation", "medium"]
---

# How to Solve Game of Life

The Game of Life problem asks us to simulate one generation of Conway's cellular automaton given an `m x n` grid. Each cell transitions from live (1) to dead (0) or vice versa based on the state of its eight neighbors. The tricky part is that all updates must happen **simultaneously** — we cannot update cells one by one using the already-changed neighbors, as this would corrupt the simulation.

## Visual Walkthrough

Let's trace through a simple 3x3 example:

```
Initial state:
[0, 1, 0]
[0, 0, 1]
[1, 1, 1]
```

We need to examine each cell's eight neighbors (including diagonals). For cell (0,0) with value 0:

- Neighbors: (0,1)=1, (1,0)=0, (1,1)=0 → 1 live neighbor
- Rule: Dead cell with exactly 3 live neighbors becomes live → stays dead

For cell (0,1) with value 1:

- Neighbors: (0,0)=0, (0,2)=0, (1,0)=0, (1,1)=0, (1,2)=1 → 1 live neighbor
- Rule: Live cell with fewer than 2 live neighbors dies → becomes dead

For cell (1,1) with value 0:

- Neighbors: (0,0)=0, (0,1)=1, (0,2)=0, (1,0)=0, (1,2)=1, (2,0)=1, (2,1)=1, (2,2)=1 → 5 live neighbors
- Rule: Dead cell with exactly 3 live neighbors becomes live → stays dead (5 ≠ 3)

After checking all cells simultaneously, the next generation becomes:

```
[0, 0, 0]
[1, 0, 1]
[0, 1, 1]
```

Notice how cell (1,0) became live even though it was dead initially — it had exactly 3 live neighbors.

## Brute Force Approach

The most straightforward approach would be to create a copy of the board, examine each cell's neighbors in the original board, apply the rules, and write the new state to the copy. This works correctly but uses O(m×n) extra space.

Why this isn't optimal: While O(m×n) space might be acceptable, interviewers often look for an in-place solution that uses only O(1) extra space. The brute force approach doesn't demonstrate mastery of the constraint that all updates must be simultaneous, nor does it show clever use of the board itself to store intermediate states.

## Optimized Approach

The key insight is that we need to store both the **old state** and **new state** simultaneously in the same board. We can do this by encoding additional information in each cell:

- If a cell is currently dead and will become live, we can mark it with a special value (like 2)
- If a cell is currently live and will become dead, we can mark it with another special value (like -1)

This way, when we count neighbors, we check the original states (1 or 0), but we store the future states in the same cells. After processing all cells, we do a second pass to convert the special values back to 1s and 0s.

The encoding scheme:

- `0` → dead (remains dead)
- `1` → live (remains live)
- `2` → dead → live (was dead, will become live)
- `-1` → live → dead (was live, will become dead)

When counting neighbors, we check if the absolute value is 1 (original live state).

## Optimal Solution

Here's the complete in-place solution with detailed comments:

<div class="code-group">

```python
# Time: O(m×n) | Space: O(1)
class Solution:
    def gameOfLife(self, board: List[List[int]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        """
        m, n = len(board), len(board[0])

        # Define the 8 possible neighbor directions
        directions = [(-1, -1), (-1, 0), (-1, 1),
                      (0, -1),           (0, 1),
                      (1, -1),  (1, 0),  (1, 1)]

        # First pass: mark cells with their future states
        for i in range(m):
            for j in range(n):
                live_neighbors = 0

                # Count live neighbors (checking original states)
                for di, dj in directions:
                    ni, nj = i + di, j + dj
                    # Check bounds and if neighbor was originally live
                    if 0 <= ni < m and 0 <= nj < n and abs(board[ni][nj]) == 1:
                        live_neighbors += 1

                # Apply Game of Life rules
                # Rule 1 & 3: Live cell dies (under/over-population)
                if board[i][j] == 1 and (live_neighbors < 2 or live_neighbors > 3):
                    board[i][j] = -1  # Mark as live → dead
                # Rule 4: Dead cell becomes live (reproduction)
                elif board[i][j] == 0 and live_neighbors == 3:
                    board[i][j] = 2   # Mark as dead → live
                # Rule 2: Live cell with 2-3 neighbors stays live (no change needed)
                # Dead cell stays dead (no change needed)

        # Second pass: convert markers to final states
        for i in range(m):
            for j in range(n):
                if board[i][j] == -1:
                    board[i][j] = 0  # Was live, now dead
                elif board[i][j] == 2:
                    board[i][j] = 1  # Was dead, now live
                # Values 0 and 1 remain unchanged
```

```javascript
// Time: O(m×n) | Space: O(1)
/**
 * @param {number[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var gameOfLife = function (board) {
  const m = board.length,
    n = board[0].length;

  // Define the 8 possible neighbor directions
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  // First pass: mark cells with their future states
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let liveNeighbors = 0;

      // Count live neighbors (checking original states)
      for (const [di, dj] of directions) {
        const ni = i + di,
          nj = j + dj;
        // Check bounds and if neighbor was originally live
        if (ni >= 0 && ni < m && nj >= 0 && nj < n && Math.abs(board[ni][nj]) === 1) {
          liveNeighbors++;
        }
      }

      // Apply Game of Life rules
      // Rule 1 & 3: Live cell dies (under/over-population)
      if (board[i][j] === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
        board[i][j] = -1; // Mark as live → dead
      }
      // Rule 4: Dead cell becomes live (reproduction)
      else if (board[i][j] === 0 && liveNeighbors === 3) {
        board[i][j] = 2; // Mark as dead → live
      }
      // Rule 2: Live cell with 2-3 neighbors stays live (no change needed)
      // Dead cell stays dead (no change needed)
    }
  }

  // Second pass: convert markers to final states
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === -1) {
        board[i][j] = 0; // Was live, now dead
      } else if (board[i][j] === 2) {
        board[i][j] = 1; // Was dead, now live
      }
      // Values 0 and 1 remain unchanged
    }
  }
};
```

```java
// Time: O(m×n) | Space: O(1)
class Solution {
    public void gameOfLife(int[][] board) {
        int m = board.length, n = board[0].length;

        // Define the 8 possible neighbor directions
        int[][] directions = {
            {-1, -1}, {-1, 0}, {-1, 1},
            {0, -1},           {0, 1},
            {1, -1},  {1, 0},  {1, 1}
        };

        // First pass: mark cells with their future states
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int liveNeighbors = 0;

                // Count live neighbors (checking original states)
                for (int[] dir : directions) {
                    int ni = i + dir[0], nj = j + dir[1];
                    // Check bounds and if neighbor was originally live
                    if (ni >= 0 && ni < m && nj >= 0 && nj < n &&
                        Math.abs(board[ni][nj]) == 1) {
                        liveNeighbors++;
                    }
                }

                // Apply Game of Life rules
                // Rule 1 & 3: Live cell dies (under/over-population)
                if (board[i][j] == 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
                    board[i][j] = -1;  // Mark as live → dead
                }
                // Rule 4: Dead cell becomes live (reproduction)
                else if (board[i][j] == 0 && liveNeighbors == 3) {
                    board[i][j] = 2;   // Mark as dead → live
                }
                // Rule 2: Live cell with 2-3 neighbors stays live (no change needed)
                // Dead cell stays dead (no change needed)
            }
        }

        // Second pass: convert markers to final states
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == -1) {
                    board[i][j] = 0;  // Was live, now dead
                } else if (board[i][j] == 2) {
                    board[i][j] = 1;  // Was dead, now live
                }
                // Values 0 and 1 remain unchanged
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m×n) where m is the number of rows and n is the number of columns. We make two passes through the entire board, and for each cell in the first pass, we check up to 8 neighbors. Since 8 is a constant, this simplifies to O(m×n).

**Space Complexity:** O(1) extra space. We modify the board in-place using special markers that encode both current and future states. No additional data structures proportional to the input size are used.

## Common Mistakes

1. **Updating cells sequentially**: The most critical mistake is updating cells one by one using already-changed neighbors. This violates the "simultaneous update" requirement. Always use a two-pass approach or copy the board.

2. **Incorrect neighbor counting**: Forgetting to check array bounds when accessing neighbors, or missing diagonal neighbors. The Game of Life includes all 8 surrounding cells, not just the 4 cardinal directions.

3. **Wrong encoding values**: Using values that conflict with the original states. For example, if you use 3 to mean "dead → live," you must ensure that when counting neighbors, you don't count 3 as a live cell. That's why we use -1 and 2 — their absolute values distinguish them from original live cells.

4. **Forgetting the second pass**: After marking cells with intermediate values, it's easy to forget the final conversion pass. The board must end with only 0s and 1s.

## When You'll See This Pattern

This "in-place state encoding" pattern appears in problems where you need to update a matrix based on its current state, but all updates must happen simultaneously:

1. **Set Matrix Zeroes (Medium)** — Similar constraint: when you find a zero, you need to mark its entire row and column, but other zeros in those rows/columns shouldn't be overwritten prematurely. The solution often uses the first row and column as markers.

2. **Rotate Image (Medium)** — While not exactly the same, it also requires careful in-place manipulation where you need to store values temporarily during rotation.

3. **Surrounded Regions (Medium)** — You need to mark cells that shouldn't be flipped, which often involves using a special marker for temporary states.

The core technique is using the data structure itself to store intermediate information, then cleaning it up in a second pass.

## Key Takeaways

1. **Simultaneous updates require two-phase processing**: When all cells must update based on the original state of their neighbors, you cannot update in-place directly. Either use a copy or encode future states in the same structure.

2. **Clever encoding enables in-place modification**: By choosing marker values that don't conflict with the counting logic (using absolute values or bit manipulation), you can store both present and future states in the same space.

3. **Matrix neighbor problems follow a pattern**: For any problem involving cell neighbors in a grid, define a directions array to avoid repetitive code for each of the 8 possible neighbors.

Related problems: [Set Matrix Zeroes](/problem/set-matrix-zeroes)
