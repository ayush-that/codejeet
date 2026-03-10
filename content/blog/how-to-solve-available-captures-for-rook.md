---
title: "How to Solve Available Captures for Rook — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Available Captures for Rook. Easy difficulty, 71.5% acceptance rate. Topics: Array, Matrix, Simulation."
date: "2027-09-03"
category: "dsa-patterns"
tags: ["available-captures-for-rook", "array", "matrix", "simulation", "easy"]
---

# How to Solve Available Captures for Rook

This problem asks you to count how many black pawns a white rook can capture on a chessboard, given that bishops block the rook's path. While the problem is straightforward, it's interesting because it requires careful simulation of movement in four directions while handling blocking pieces correctly. The key challenge is implementing the movement logic without going out of bounds and stopping at the first piece encountered in each direction.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this 4×4 board (simplified from 8×8 for clarity):

```
. . . .
. p B .
. R . .
. . p .
```

1. **Find the rook's position**: The rook 'R' is at row 2, column 1 (0-indexed: row 1, col 1)
2. **Check four directions**:
   - **Up** (row decreases, col stays same): From (1,1) → (0,1) is '.', continue → (-1,1) is out of bounds, so no capture up
   - **Down** (row increases, col stays same): From (1,1) → (2,1) is '.', continue → (3,1) is 'p' (black pawn) → CAPTURE! Stop checking down
   - **Left** (row stays same, col decreases): From (1,1) → (1,0) is 'p' (black pawn) → CAPTURE! Stop checking left
   - **Right** (row stays same, col increases): From (1,1) → (1,2) is 'B' (white bishop) → Blocked by friendly piece, stop checking right

Total captures: 2 (down and left)

The key insight: we must stop checking in each direction as soon as we encounter ANY piece (friendly or enemy), and only count it as a capture if that piece is a black pawn.

## Brute Force Approach

A naive approach might be to check every square the rook could theoretically reach, but this would be inefficient and complicated. Actually, for this problem, there's only one reasonable approach: find the rook, then simulate movement in four directions until we hit a piece or the board edge.

The "brute force" thinking here would be to check ALL possible moves the rook could make (up to 14 squares in each direction on an 8×8 board), but we can optimize by stopping early when we hit any piece. Since the board is fixed at 8×8 and we stop at the first piece in each direction, our solution is already optimal.

What makes a candidate solution suboptimal would be:

1. Not stopping when hitting a bishop (continuing past it)
2. Checking all squares in each direction even when unnecessary
3. Using complex data structures when simple simulation suffices

Our optimal solution addresses these by implementing clean directional simulation with early termination.

## Optimal Solution

We'll implement a clean solution that:

1. First finds the rook's position by scanning the board
2. Then checks four directions (up, down, left, right) from the rook
3. For each direction, moves one step at a time until hitting a piece or going out of bounds
4. Counts a capture only if the first piece encountered is a black pawn 'p'

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
# Since board is fixed 8×8, all operations are constant time
def numRookCaptures(board):
    """
    Counts how many black pawns the white rook can capture.

    Approach:
    1. Find the rook's position by scanning the 8×8 board
    2. Check four directions (up, down, left, right)
    3. In each direction, move until hitting a piece or board edge
    4. Count only if first piece encountered is a black pawn 'p'
    """
    # Directions: up, down, left, right
    # Each direction is (row_change, col_change)
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    # Step 1: Find the rook's position
    rook_row, rook_col = -1, -1
    for i in range(8):
        for j in range(8):
            if board[i][j] == 'R':
                rook_row, rook_col = i, j
                break
        if rook_row != -1:  # Found the rook
            break

    captures = 0

    # Step 2: Check each of the four directions
    for dr, dc in directions:
        # Start from the rook's position
        r, c = rook_row, rook_col

        # Step 3: Move in current direction until we hit something
        while True:
            # Move one step in current direction
            r += dr
            c += dc

            # Check if we've gone out of bounds
            if r < 0 or r >= 8 or c < 0 or c >= 8:
                break

            # Get what's at the current position
            cell = board[r][c]

            # If it's empty, continue moving
            if cell == '.':
                continue

            # Step 4: We've hit a piece
            # If it's a black pawn, count it as a capture
            if cell == 'p':
                captures += 1

            # Stop in this direction whether we captured or not
            # (bishops block the path, friendly pieces don't count)
            break

    return captures
```

```javascript
// Time: O(1) | Space: O(1)
// Since board is fixed 8×8, all operations are constant time
function numRookCaptures(board) {
  /**
   * Counts how many black pawns the white rook can capture.
   *
   * Approach:
   * 1. Find the rook's position by scanning the 8×8 board
   * 2. Check four directions (up, down, left, right)
   * 3. In each direction, move until hitting a piece or board edge
   * 4. Count only if first piece encountered is a black pawn 'p'
   */

  // Directions: up, down, left, right
  // Each direction is [row_change, col_change]
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // Step 1: Find the rook's position
  let rookRow = -1,
    rookCol = -1;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === "R") {
        rookRow = i;
        rookCol = j;
        break;
      }
    }
    if (rookRow !== -1) {
      // Found the rook
      break;
    }
  }

  let captures = 0;

  // Step 2: Check each of the four directions
  for (const [dr, dc] of directions) {
    // Start from the rook's position
    let r = rookRow,
      c = rookCol;

    // Step 3: Move in current direction until we hit something
    while (true) {
      // Move one step in current direction
      r += dr;
      c += dc;

      // Check if we've gone out of bounds
      if (r < 0 || r >= 8 || c < 0 || c >= 8) {
        break;
      }

      // Get what's at the current position
      const cell = board[r][c];

      // If it's empty, continue moving
      if (cell === ".") {
        continue;
      }

      // Step 4: We've hit a piece
      // If it's a black pawn, count it as a capture
      if (cell === "p") {
        captures++;
      }

      // Stop in this direction whether we captured or not
      // (bishops block the path, friendly pieces don't count)
      break;
    }
  }

  return captures;
}
```

```java
// Time: O(1) | Space: O(1)
// Since board is fixed 8×8, all operations are constant time
class Solution {
    public int numRookCaptures(char[][] board) {
        /**
         * Counts how many black pawns the white rook can capture.
         *
         * Approach:
         * 1. Find the rook's position by scanning the 8×8 board
         * 2. Check four directions (up, down, left, right)
         * 3. In each direction, move until hitting a piece or board edge
         * 4. Count only if first piece encountered is a black pawn 'p'
         */

        // Directions: up, down, left, right
        // Each direction is {row_change, col_change}
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        // Step 1: Find the rook's position
        int rookRow = -1, rookCol = -1;
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                if (board[i][j] == 'R') {
                    rookRow = i;
                    rookCol = j;
                    break;
                }
            }
            if (rookRow != -1) {  // Found the rook
                break;
            }
        }

        int captures = 0;

        // Step 2: Check each of the four directions
        for (int[] dir : directions) {
            int dr = dir[0], dc = dir[1];

            // Start from the rook's position
            int r = rookRow, c = rookCol;

            // Step 3: Move in current direction until we hit something
            while (true) {
                // Move one step in current direction
                r += dr;
                c += dc;

                // Check if we've gone out of bounds
                if (r < 0 || r >= 8 || c < 0 || c >= 8) {
                    break;
                }

                // Get what's at the current position
                char cell = board[r][c];

                // If it's empty, continue moving
                if (cell == '.') {
                    continue;
                }

                // Step 4: We've hit a piece
                // If it's a black pawn, count it as a capture
                if (cell == 'p') {
                    captures++;
                }

                // Stop in this direction whether we captured or not
                // (bishops block the path, friendly pieces don't count)
                break;
            }
        }

        return captures;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- Finding the rook: At most 64 checks (8×8 board)
- Checking four directions: In each direction, we check at most 7 squares (rook to edge of board)
- Total operations: 64 + 4×7 = 92 operations maximum, which is constant
- Even though we write O(n²) for an n×n board conceptually, since n=8 is fixed, it's O(1)

**Space Complexity: O(1)**

- We only use a few variables for positions, directions, and counters
- No additional data structures that grow with input size
- The input board is given and not counted toward our space usage

## Common Mistakes

1. **Not stopping at bishops**: The most common error is continuing to check past a bishop. Remember: bishops block the rook's path completely. Once you hit any piece (friendly or enemy), you must stop checking in that direction.

2. **Counting friendly pieces as captures**: Some candidates count 'B' (white bishops) as captures. Only black pawns 'p' count as captures. White pieces block but don't count.

3. **Off-by-one errors in bounds checking**: When moving in a direction, it's easy to check `r > 8` instead of `r >= 8`. Remember arrays are 0-indexed, so valid indices are 0-7 inclusive.

4. **Forgetting to break after finding the rook**: When scanning for the rook, you need to break out of both loops once found. A cleaner approach is to use a flag or return early if possible.

5. **Incorrect direction vectors**: Mixing up row and column increments. Up is (-1, 0) not (0, -1). Always test with a simple example to verify your direction vectors.

## When You'll See This Pattern

This problem uses **grid traversal with directional movement**, a common pattern in matrix problems. You'll see similar patterns in:

1. **Robot Room Cleaner (Hard)**: Simulating movement in a grid with obstacles, though with more complex state management.

2. **Number of Islands (Medium)**: While this uses DFS/BFS, the core idea of exploring connected components in a grid is similar.

3. **Word Search (Medium)**: Searching for paths in a grid with directional movement and backtracking.

4. **Count Unguarded Cells in the Grid (Medium)**: Directly related - it involves simulating guards that can see in multiple directions, similar to how our rook "sees" in four directions.

The key pattern is: **start from a position, explore in defined directions until hitting a boundary or obstacle, and process what you find along the way.**

## Key Takeaways

1. **Grid simulation problems often involve exploring in fixed directions** (up, down, left, right, or diagonals). Having clean direction arrays makes the code more readable and less error-prone.

2. **Early termination is crucial for efficiency** even in small grids. Always stop exploring a direction when you hit any obstacle or boundary.

3. **Board games and grid problems often have simple simulation solutions**. Don't overcomplicate - sometimes the straightforward approach of "find, then explore" is optimal, especially with fixed-size boards.

4. **Test with small examples** to catch edge cases. What if the rook is at the edge? What if a pawn is right next to the rook? What if a bishop is between the rook and a pawn?

Related problems: [Count Unguarded Cells in the Grid](/problem/count-unguarded-cells-in-the-grid), [Minimum Moves to Capture The Queen](/problem/minimum-moves-to-capture-the-queen), [Maximum Value Sum by Placing Three Rooks II](/problem/maximum-value-sum-by-placing-three-rooks-ii)
