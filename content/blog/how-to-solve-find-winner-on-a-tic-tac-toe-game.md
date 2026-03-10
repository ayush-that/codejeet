---
title: "How to Solve Find Winner on a Tic Tac Toe Game — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Winner on a Tic Tac Toe Game. Easy difficulty, 54.5% acceptance rate. Topics: Array, Hash Table, Matrix, Simulation."
date: "2026-06-13"
category: "dsa-patterns"
tags: ["find-winner-on-a-tic-tac-toe-game", "array", "hash-table", "matrix", "easy"]
---

# How to Solve Find Winner on a Tic Tac Toe Game

Tic-tac-toe is a classic game where two players alternate placing their marks on a 3×3 grid, and the first to get three in a row wins. The challenge in this coding problem is efficiently determining the game state after each move without re-checking the entire board from scratch every time. What makes this problem interesting is that while the board is small (only 9 cells), we need to track game progress incrementally to avoid unnecessary computations.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider these moves:

```
moves = [[0,0],[2,0],[1,1],[2,1],[2,2]]
```

**Step-by-step simulation:**

1. **Move 1:** Player A places 'X' at [0,0] (top-left)

   ```
   X . .
   . . .
   . . .
   ```

2. **Move 2:** Player B places 'O' at [2,0] (bottom-left)

   ```
   X . .
   . . .
   O . .
   ```

3. **Move 3:** Player A places 'X' at [1,1] (center)

   ```
   X . .
   . X .
   O . .
   ```

4. **Move 4:** Player B places 'O' at [2,1] (bottom-middle)

   ```
   X . .
   . X .
   O O .
   ```

5. **Move 5:** Player A places 'X' at [2,2] (bottom-right)
   ```
   X . .
   . X .
   O O X
   ```

At this point, Player A has three X's in a diagonal from top-left to bottom-right, so Player A wins. The key insight is that we need to check for wins after each move, but we don't need to scan the entire 3×3 board every time—we can track counts incrementally.

## Brute Force Approach

A naive approach would be to reconstruct the entire board after each move and check all 8 possible winning lines (3 rows, 3 columns, 2 diagonals). After each move, we would:

1. Create a 3×3 board initialized with empty spaces
2. Fill it with moves up to the current point
3. Check all 8 lines to see if any contain three identical non-empty marks

**Why this is inefficient:**

- Reconstructing the board from scratch for each move takes O(n²) time where n is the number of moves
- Checking all 8 lines each time requires examining up to 24 cells
- For m moves, this becomes O(m × n²) which, while acceptable for small m, is conceptually wasteful

The brute force works but misses the opportunity for optimization through incremental tracking. In an interview, you might mention this approach first to show you understand the problem, then immediately explain how to optimize it.

## Optimal Solution

The optimal solution uses incremental tracking. Instead of checking the entire board after each move, we maintain counts for each row, column, and diagonal. For a 3×3 board:

- 3 rows (0, 1, 2)
- 3 columns (0, 1, 2)
- 2 diagonals (main diagonal and anti-diagonal)

We track separate counts for Player A and Player B. When a player places a mark at position [row, col]:

- Increment their count for that row
- Increment their count for that column
- If on the main diagonal (row == col), increment their main diagonal count
- If on the anti-diagonal (row + col == 2), increment their anti-diagonal count

A player wins if any of their counts reaches 3. We check this after each move.

<div class="code-group">

```python
# Time: O(m) where m is number of moves | Space: O(1) for fixed-size tracking arrays
def tictactoe(moves):
    """
    Determine the winner of a tic-tac-toe game given a sequence of moves.

    Args:
        moves: List of [row, col] positions where moves are made

    Returns:
        "A" if player A wins, "B" if player B wins,
        "Draw" if no winner after all moves, or "Pending" if game incomplete
    """
    # Initialize tracking arrays for rows, columns, and diagonals
    # We need separate counts for player A and B
    rows = [[0, 0] for _ in range(3)]  # rows[i] = [countA, countB] for row i
    cols = [[0, 0] for _ in range(3)]  # cols[i] = [countA, countB] for col i
    diag = [0, 0]  # [countA, countB] for main diagonal (row == col)
    anti_diag = [0, 0]  # [countA, countB] for anti-diagonal (row + col == 2)

    # Process each move
    for i, (row, col) in enumerate(moves):
        # Determine which player's turn it is (A for even indices, B for odd)
        player_idx = 0 if i % 2 == 0 else 1  # 0 for A, 1 for B

        # Update row count for this player
        rows[row][player_idx] += 1
        # Check if this row now has 3 for the current player
        if rows[row][player_idx] == 3:
            return "A" if player_idx == 0 else "B"

        # Update column count for this player
        cols[col][player_idx] += 1
        # Check if this column now has 3 for the current player
        if cols[col][player_idx] == 3:
            return "A" if player_idx == 0 else "B"

        # Update main diagonal if on it (row == col)
        if row == col:
            diag[player_idx] += 1
            if diag[player_idx] == 3:
                return "A" if player_idx == 0 else "B"

        # Update anti-diagonal if on it (row + col == 2)
        if row + col == 2:
            anti_diag[player_idx] += 1
            if anti_diag[player_idx] == 3:
                return "A" if player_idx == 0 else "B"

    # If we've processed all moves without a winner
    if len(moves) == 9:
        return "Draw"  # Board is full
    else:
        return "Pending"  # Game still in progress
```

```javascript
// Time: O(m) where m is number of moves | Space: O(1) for fixed-size tracking arrays
function tictactoe(moves) {
  /**
   * Determine the winner of a tic-tac-toe game given a sequence of moves.
   *
   * @param {number[][]} moves - Array of [row, col] positions where moves are made
   * @return {string} "A", "B", "Draw", or "Pending"
   */

  // Initialize tracking arrays for rows, columns, and diagonals
  // rows[i] = [countA, countB] for row i
  const rows = Array(3)
    .fill()
    .map(() => [0, 0]);
  // cols[i] = [countA, countB] for column i
  const cols = Array(3)
    .fill()
    .map(() => [0, 0]);
  // diag = [countA, countB] for main diagonal (row == col)
  const diag = [0, 0];
  // antiDiag = [countA, countB] for anti-diagonal (row + col == 2)
  const antiDiag = [0, 0];

  // Process each move
  for (let i = 0; i < moves.length; i++) {
    const [row, col] = moves[i];
    // Determine which player's turn it is (A for even indices, B for odd)
    const playerIdx = i % 2 === 0 ? 0 : 1; // 0 for A, 1 for B

    // Update row count for this player
    rows[row][playerIdx]++;
    // Check if this row now has 3 for the current player
    if (rows[row][playerIdx] === 3) {
      return playerIdx === 0 ? "A" : "B";
    }

    // Update column count for this player
    cols[col][playerIdx]++;
    // Check if this column now has 3 for the current player
    if (cols[col][playerIdx] === 3) {
      return playerIdx === 0 ? "A" : "B";
    }

    // Update main diagonal if on it (row == col)
    if (row === col) {
      diag[playerIdx]++;
      if (diag[playerIdx] === 3) {
        return playerIdx === 0 ? "A" : "B";
      }
    }

    // Update anti-diagonal if on it (row + col === 2)
    if (row + col === 2) {
      antiDiag[playerIdx]++;
      if (antiDiag[playerIdx] === 3) {
        return playerIdx === 0 ? "A" : "B";
      }
    }
  }

  // If we've processed all moves without a winner
  if (moves.length === 9) {
    return "Draw"; // Board is full
  } else {
    return "Pending"; // Game still in progress
  }
}
```

```java
// Time: O(m) where m is number of moves | Space: O(1) for fixed-size tracking arrays
class Solution {
    public String tictactoe(int[][] moves) {
        /**
         * Determine the winner of a tic-tac-toe game given a sequence of moves.
         *
         * @param moves Array of [row, col] positions where moves are made
         * @return "A", "B", "Draw", or "Pending"
         */

        // Initialize tracking arrays for rows, columns, and diagonals
        // rows[i][0] = count for player A in row i, rows[i][1] = count for player B
        int[][] rows = new int[3][2];
        // cols[i][0] = count for player A in column i, cols[i][1] = count for player B
        int[][] cols = new int[3][2];
        // diag[0] = count for player A on main diagonal, diag[1] = count for player B
        int[] diag = new int[2];
        // antiDiag[0] = count for player A on anti-diagonal, antiDiag[1] = count for player B
        int[] antiDiag = new int[2];

        // Process each move
        for (int i = 0; i < moves.length; i++) {
            int row = moves[i][0];
            int col = moves[i][1];
            // Determine which player's turn it is (A for even indices, B for odd)
            int playerIdx = i % 2 == 0 ? 0 : 1; // 0 for A, 1 for B

            // Update row count for this player
            rows[row][playerIdx]++;
            // Check if this row now has 3 for the current player
            if (rows[row][playerIdx] == 3) {
                return playerIdx == 0 ? "A" : "B";
            }

            // Update column count for this player
            cols[col][playerIdx]++;
            // Check if this column now has 3 for the current player
            if (cols[col][playerIdx] == 3) {
                return playerIdx == 0 ? "A" : "B";
            }

            // Update main diagonal if on it (row == col)
            if (row == col) {
                diag[playerIdx]++;
                if (diag[playerIdx] == 3) {
                    return playerIdx == 0 ? "A" : "B";
                }
            }

            // Update anti-diagonal if on it (row + col == 2)
            if (row + col == 2) {
                antiDiag[playerIdx]++;
                if (antiDiag[playerIdx] == 3) {
                    return playerIdx == 0 ? "A" : "B";
                }
            }
        }

        // If we've processed all moves without a winner
        if (moves.length == 9) {
            return "Draw"; // Board is full
        } else {
            return "Pending"; // Game still in progress
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m) where m is the number of moves

- We process each move exactly once
- For each move, we perform a constant number of operations (updating 2-4 counts and checking conditions)
- Even in the worst case (9 moves), this is O(9) = O(1), but we express it as O(m) for generality

**Space Complexity:** O(1)

- We use fixed-size data structures regardless of input size:
  - 3 rows × 2 players = 6 integers
  - 3 columns × 2 players = 6 integers
  - 2 diagonals × 2 players = 4 integers
  - Total: 16 integers, which is constant space
- No additional space grows with the number of moves

## Common Mistakes

1. **Forgetting to check diagonals:** Many candidates remember to check rows and columns but forget about the two diagonals. The anti-diagonal condition `row + col == 2` is particularly easy to miss.

2. **Incorrect player alternation:** Assuming player A is always at even indices (0, 2, 4...) and player B at odd indices (1, 3, 5...) is correct, but some candidates try to track this with a boolean that they forget to flip.

3. **Early return without checking all conditions:** After updating a row count and finding it equals 3, you might return immediately. This is correct, but make sure you've updated all relevant counts first. The order matters: update, then check.

4. **Misunderstanding the "Pending" case:** The problem states that if there are fewer than 9 moves and no winner, the game is "Pending." Some candidates return "Pending" only when moves < 9, forgetting that a player could win before the board is full.

## When You'll See This Pattern

This incremental counting pattern appears in many grid-based games and problems:

1. **N-Queens (LeetCode 51):** Similar diagonal tracking is used to check if a queen placement conflicts with existing queens.

2. **Valid Sudoku (LeetCode 36):** You track counts for rows, columns, and 3×3 sub-boxes to validate Sudoku boards efficiently.

3. **Design Tic-Tac-Toe (LeetCode 348):** This is essentially the same problem but generalized to n×n boards, using the exact same incremental counting approach.

The core pattern is: when you need to track line-based conditions in a grid, maintain separate counters for each line and update them incrementally rather than scanning the entire grid repeatedly.

## Key Takeaways

1. **Incremental updates beat full scans:** When checking conditions that build up over time, track counts incrementally rather than recomputing from scratch each time. This often turns O(n²) solutions into O(n).

2. **Fixed-size problems can have O(1) space:** Even though we're tracking game state, the space is constant because the board size is fixed (3×3). Always consider whether problem constraints allow for constant-space solutions.

3. **Grid diagonals have simple formulas:** For an n×n grid, the main diagonal has `row == col`, and the anti-diagonal has `row + col == n-1`. Memorizing these patterns helps with many grid problems.

Related problems: [Categorize Box According to Criteria](/problem/categorize-box-according-to-criteria)
