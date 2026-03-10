---
title: "How to Solve Check if Move is Legal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Check if Move is Legal. Medium difficulty, 50.0% acceptance rate. Topics: Array, Matrix, Enumeration."
date: "2029-12-29"
category: "dsa-patterns"
tags: ["check-if-move-is-legal", "array", "matrix", "enumeration", "medium"]
---

# How to Solve "Check if Move is Legal"

This problem asks us to determine if placing a chess piece on a specific empty cell would create a legal move in a simplified board game. The challenge lies in checking eight possible directions from the placed piece to see if we can find a valid "sandwich" pattern: our piece, followed by one or more opponent pieces, ending with another of our pieces. What makes this interesting is that we need to systematically explore all directions while handling boundary conditions carefully.

## Visual Walkthrough

Let's walk through a small example. Suppose we have this 3×3 board (simplified from 8×8 for clarity):

```
W . B
. . .
B . W
```

We want to check if placing a black piece `'B'` at position `(1, 1)` (center) is legal. The current player is black (`color = 'B'`).

**Step 1: Check all 8 directions from (1, 1)**

- **North (up)**: (0, 1) contains `'.'` → not valid
- **North-East**: (0, 2) contains `'B'` → immediate same color, not valid
- **East (right)**: (1, 2) contains `'.'` → not valid
- **South-East**: (2, 2) contains `'W'` → opponent piece! Continue...
  - Move further SE: (3, 3) is out of bounds → not valid
- **South (down)**: (2, 1) contains `'.'` → not valid
- **South-West**: (2, 0) contains `'B'` → immediate same color, not valid
- **West (left)**: (1, 0) contains `'.'` → not valid
- **North-West**: (0, 0) contains `'W'` → opponent piece! Continue...
  - Move further NW: (-1, -1) is out of bounds → not valid

No direction yields a valid sandwich, so this move is **not legal**.

Now let's modify the board slightly:

```
W . B
. . W
B . W
```

Checking the same move `(1, 1)` for black:

- **North-East**: (0, 2) is `'B'` → immediate same color, skip
- **East**: (1, 2) is `'W'` → opponent! Continue east...
  - (1, 3) is out of bounds → not valid
- **South-East**: (2, 2) is `'W'` → opponent! Continue SE...
  - (3, 3) out of bounds → not valid
- **South**: (2, 1) is `'.'` → not valid
- **South-West**: (2, 0) is `'B'` → immediate same color, skip
- **West**: (1, 0) is `'.'` → not valid
- **North-West**: (0, 0) is `'W'` → opponent! Continue NW...
  - (-1, -1) out of bounds → not valid
- **North**: (0, 1) is `'.'` → not valid

Still no valid direction. But wait — we missed something! Let's check a clearer example:

```
. . . . .
. W B . .
. . . . .
. . . . .
. . . . .
```

Placing `'B'` at `(2, 2)` (center of this 5×5 view) when `(1, 2)` is `'B'` and `(0, 2)` is `'W'`:

- **North**: `(1, 2)` = `'B'` → immediate same color, not valid
- But what if we place `'W'` at `(2, 2)` instead?
  - **North**: `(1, 2)` = `'B'` (opponent for white!) → continue north
  - `(0, 2)` = `'W'` (same color as placed piece) → valid sandwich!

This shows the pattern: we need at least one opponent piece between our starting and ending positions.

## Brute Force Approach

A naive approach would be to simulate the entire game: actually place the piece, then check all lines through that piece to see if any opponent pieces get captured. However, this would require modifying the board and then checking complex capture rules.

An even simpler brute force would be: for each direction, walk until we hit a boundary or empty cell, collecting all pieces along the way. Then check if the sequence matches the pattern: our piece, then one or more opponent pieces, then our piece again.

The problem with this "collect then check" approach is unnecessary memory usage. We don't need to store the entire sequence — we can check as we go. But even the basic directional checking is already optimal for this problem since we must check all 8 directions anyway.

Actually, there's no true "brute force vs. optimized" distinction here because the problem naturally requires checking all directions. The key insight isn't about algorithmic complexity but about implementation correctness.

## Optimized Approach

The optimal approach is straightforward but requires careful implementation:

1. **Define the 8 possible directions** as `(dr, dc)` pairs where `dr` and `dc` can be -1, 0, or 1, but not both 0.
2. **For each direction**, take a step from the starting position.
3. **Check the first cell in that direction**:
   - If it's empty (`.`) or out of bounds → this direction is invalid
   - If it's our own color → this direction is invalid (no opponent in between)
   - If it's the opponent's color → continue in that direction
4. **Continue moving in that direction** as long as we see opponent pieces.
5. **Stop when** we hit:
   - Out of bounds → invalid direction
   - Empty cell → invalid direction
   - Our own color → valid direction! Return true immediately.
6. **If all directions are checked** without finding a valid one, return false.

The key insight is that we need **at least one opponent piece** between two of our pieces. We can't just check adjacent cells — we must keep moving until we find our color again.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
# Since board is fixed 8x8 and we check at most 8 directions with max 7 steps each
class Solution:
    def checkMove(self, board: List[List[str]], rMove: int, cMove: int, color: str) -> bool:
        # Define all 8 possible directions: (row_change, col_change)
        directions = [
            (-1, -1), (-1, 0), (-1, 1),  # Up-left, Up, Up-right
            (0, -1),           (0, 1),   # Left,       Right
            (1, -1),  (1, 0),  (1, 1)    # Down-left, Down, Down-right
        ]

        # The opponent's color is the opposite of our color
        opponent = 'B' if color == 'W' else 'W'

        # Check each direction from the placed piece
        for dr, dc in directions:
            # Start from the first cell in this direction
            r, c = rMove + dr, cMove + dc
            found_opponent = False

            # Continue while we're within bounds
            while 0 <= r < 8 and 0 <= c < 8:
                cell = board[r][c]

                if cell == opponent:
                    # Found at least one opponent piece - continue searching
                    found_opponent = True
                    r += dr
                    c += dc
                elif cell == color:
                    # Found our own color again
                    if found_opponent:
                        # Valid sandwich: our piece -> opponent(s) -> our piece
                        return True
                    else:
                        # Immediate same color, not a valid capture
                        break
                else:
                    # Empty cell ('.') - cannot form a valid line
                    break

            # If we exited the loop without returning True, this direction is invalid

        # No valid direction found
        return False
```

```javascript
// Time: O(1) | Space: O(1)
// Board is fixed 8x8, checking 8 directions with max 7 steps each
/**
 * @param {character[][]} board
 * @param {number} rMove
 * @param {number} cMove
 * @param {character} color
 * @return {boolean}
 */
var checkMove = function (board, rMove, cMove, color) {
  // All 8 possible directions
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1], // Up-left, Up, Up-right
    [0, -1],
    [0, 1], // Left,       Right
    [1, -1],
    [1, 0],
    [1, 1], // Down-left, Down, Down-right
  ];

  // Determine opponent's color
  const opponent = color === "B" ? "W" : "B";

  // Check each direction
  for (const [dr, dc] of directions) {
    // Start from the first cell in current direction
    let r = rMove + dr;
    let c = cMove + dc;
    let foundOpponent = false;

    // Continue while within board boundaries
    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const cell = board[r][c];

      if (cell === opponent) {
        // Found opponent piece - continue in this direction
        foundOpponent = true;
        r += dr;
        c += dc;
      } else if (cell === color) {
        // Found our color again
        if (foundOpponent) {
          // Valid pattern: our -> opponent(s) -> our
          return true;
        } else {
          // Immediate same color, invalid
          break;
        }
      } else {
        // Empty cell, cannot form valid line
        break;
      }
    }
    // If loop completes without returning, this direction is invalid
  }

  // No valid direction found
  return false;
};
```

```java
// Time: O(1) | Space: O(1)
// Fixed 8x8 board, 8 directions, max 7 steps per direction
class Solution {
    public boolean checkMove(char[][] board, int rMove, int cMove, char color) {
        // All 8 possible directions: {row_change, col_change}
        int[][] directions = {
            {-1, -1}, {-1, 0}, {-1, 1},  // Up-left, Up, Up-right
            {0, -1},           {0, 1},   // Left,       Right
            {1, -1},  {1, 0},  {1, 1}    // Down-left, Down, Down-right
        };

        // Determine opponent's color
        char opponent = (color == 'B') ? 'W' : 'B';

        // Check each direction
        for (int[] dir : directions) {
            int dr = dir[0];
            int dc = dir[1];

            // Start from adjacent cell in current direction
            int r = rMove + dr;
            int c = cMove + dc;
            boolean foundOpponent = false;

            // Continue while within board boundaries
            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                char cell = board[r][c];

                if (cell == opponent) {
                    // Found opponent piece - continue searching
                    foundOpponent = true;
                    r += dr;
                    c += dc;
                } else if (cell == color) {
                    // Found our color again
                    if (foundOpponent) {
                        // Valid pattern: our piece -> opponent(s) -> our piece
                        return true;
                    } else {
                        // Immediate same color, not valid
                        break;
                    }
                } else {
                    // Empty cell ('.'), cannot form valid line
                    break;
                }
            }
            // If we exit loop without returning, this direction is invalid
        }

        // No valid direction found
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- The board is fixed at 8×8 cells
- We check 8 directions maximum
- In each direction, we take at most 7 steps (from one edge to the opposite edge)
- Total operations: 8 directions × 7 steps = 56 operations, which is constant

**Space Complexity: O(1)**

- We only use a fixed amount of extra space for variables
- The directions array has fixed size 8
- No additional data structures that scale with input size

Even if the board were n×n, the time complexity would be O(n) since in the worst case we might traverse nearly the entire length of the board in one direction.

## Common Mistakes

1. **Not checking for at least one opponent piece**: Some candidates check if the next cell is opponent and the cell after that is same color, but forget that there could be multiple opponent pieces in between. The correct approach is to continue moving while seeing opponent pieces.

2. **Incorrect boundary checking**: Forgetting to check bounds before accessing `board[r][c]` leads to index out of range errors. Always check `0 <= r < 8 and 0 <= c < 8` before accessing.

3. **Stopping too early**: When seeing an opponent piece, some candidates check just the next cell instead of continuing in that direction. Remember: we need to keep going until we hit our color, an empty cell, or a boundary.

4. **Confusing the color logic**: Mixing up when to check for opponent vs. own color. The pattern is: start from placed piece, first cell must be opponent, then any number of opponents, finally our color.

## When You'll See This Pattern

This type of multi-directional grid traversal appears in many board game problems:

1. **Word Search (LeetCode 79)**: Similar directional checking but for word matching instead of piece capturing.

2. **Game of Life (LeetCode 289)**: Checking all 8 neighbors around each cell to apply rules.

3. **Minesweeper (LeetCode 529)**: Revealing cells in all directions based on adjacent mines.

4. **N-Queens (LeetCode 51)**: Checking diagonals in multiple directions for queen attacks.

The common pattern is: define direction vectors, iterate through them, and traverse until a condition is met. This is essentially a constrained depth-first search along straight lines.

## Key Takeaways

1. **Direction vectors simplify multi-directional traversal**: Using `(dr, dc)` pairs makes code cleaner than writing 8 separate logic blocks for each direction.

2. **Check-as-you-go beats collect-then-check**: For validation problems, it's more efficient to validate conditions during traversal rather than storing everything and checking later.

3. **Boundary checking is critical in grid problems**: Always verify array indices are valid before accessing elements to avoid runtime errors.

4. **State tracking matters**: The `found_opponent` boolean is crucial for ensuring we have at least one opponent piece between our pieces.

[Practice this problem on CodeJeet](/problem/check-if-move-is-legal)
