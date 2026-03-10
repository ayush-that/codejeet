---
title: "How to Solve Valid Tic-Tac-Toe State — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Valid Tic-Tac-Toe State. Medium difficulty, 34.7% acceptance rate. Topics: Array, Matrix."
date: "2028-02-20"
category: "dsa-patterns"
tags: ["valid-tic-tac-toe-state", "array", "matrix", "medium"]
---

# How to Solve Valid Tic-Tac-Toe State

This problem asks us to determine if a given Tic-Tac-Toe board configuration could have occurred during a valid game. The tricky part is that we need to check multiple constraints simultaneously: turn order, win conditions, and board state consistency. A board is valid only if it follows all the rules of Tic-Tac-Toe, not just whether someone has won.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this board:

```
X O X
O X O
X   O
```

We need to check several things:

1. **Count of X's and O's**: In Tic-Tac-Toe, X always goes first, so X must have either the same number of pieces as O, or exactly one more. Let's count:
   - X's: 5
   - O's: 4
   - Difference: 1 (valid, since X goes first)

2. **Win conditions**: Check if both players have winning lines:
   - X has a diagonal win (top-left to bottom-right)
   - O has no winning lines
   - Since X has won, the game should have ended. But X has 5 pieces and O has 4, meaning O just moved. This is impossible because if X won on their last move, the game would have ended immediately, and O wouldn't have gotten another turn.

3. **Conclusion**: This board is invalid because X won but O has the same number of turns as if the game continued after X's win.

Now let's formalize the rules we need to check.

## Brute Force Approach

A naive approach might try to simulate all possible games to see if this board could occur, but that's impractical. There are 9! (362,880) possible move sequences in Tic-Tac-Toe, and checking all of them would be O(9!) time complexity.

What a candidate might try instead is checking rules piecemeal without considering their interactions:

1. Count X's and O's - check if difference is 0 or 1
2. Check if X has a winning line
3. Check if O has a winning line

But this misses crucial interactions between these conditions. For example:

- If both X and O have winning lines, it's always invalid (a board can't have two winners)
- If X wins, X must have exactly one more piece than O (game ends immediately after winning move)
- If O wins, X and O must have equal counts (O just moved and won)

The brute force of checking all game sequences is too slow, and checking rules independently leads to incorrect solutions.

## Optimized Approach

The key insight is that we can validate a board by checking a few specific conditions that capture all the rules of Tic-Tac-Toe:

1. **Turn Order Constraint**: Since X always goes first:
   - countX must be either equal to countO or exactly one more than countO
   - Mathematically: countO ≤ countX ≤ countO + 1

2. **Win Condition Constraints**:
   - Both players cannot win simultaneously
   - If X wins, X must have exactly one more piece than O (X just won on their turn)
   - If O wins, X and O must have equal counts (O just won on their turn)

3. **Implementation Strategy**:
   - First count X's and O's and check the turn order constraint
   - Then check all 8 possible winning lines (3 rows, 3 columns, 2 diagonals)
   - Finally apply the win condition constraints

The clever part is recognizing that we need to check these conditions in the right order and that they interact with each other. We can't just check them independently.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
# Since board is always 3x3, all operations are constant time
def validTicTacToe(board):
    """
    Determines if a Tic-Tac-Toe board state is valid.

    A board is valid if:
    1. X count is either equal to O count or exactly one more
    2. Not both players have winning lines
    3. If X wins, X count must be O count + 1
    4. If O wins, X count must equal O count
    """

    # Step 1: Count X's and O's
    x_count = o_count = 0
    for row in board:
        for cell in row:
            if cell == 'X':
                x_count += 1
            elif cell == 'O':
                o_count += 1

    # Check turn order: X goes first, so x_count must be o_count or o_count + 1
    if not (o_count <= x_count <= o_count + 1):
        return False

    # Step 2: Check for winning lines
    def has_winner(player):
        """Check if the given player has any winning line."""
        # Check rows
        for i in range(3):
            if all(board[i][j] == player for j in range(3)):
                return True

        # Check columns
        for j in range(3):
            if all(board[i][j] == player for i in range(3)):
                return True

        # Check diagonals
        if all(board[i][i] == player for i in range(3)):
            return True
        if all(board[i][2-i] == player for i in range(3)):
            return True

        return False

    x_wins = has_winner('X')
    o_wins = has_winner('O')

    # Step 3: Apply win condition constraints

    # Both players cannot win
    if x_wins and o_wins:
        return False

    # If X wins, X must have just moved, so x_count = o_count + 1
    if x_wins and x_count != o_count + 1:
        return False

    # If O wins, O must have just moved, so x_count = o_count
    if o_wins and x_count != o_count:
        return False

    # All checks passed
    return True
```

```javascript
// Time: O(1) | Space: O(1)
// Board is always 3x3, so constant time operations
/**
 * Determines if a Tic-Tac-Toe board state is valid.
 *
 * A board is valid if:
 * 1. X count is either equal to O count or exactly one more
 * 2. Not both players have winning lines
 * 3. If X wins, X count must be O count + 1
 * 4. If O wins, X count must equal O count
 */
function validTicTacToe(board) {
  // Step 1: Count X's and O's
  let xCount = 0,
    oCount = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "X") {
        xCount++;
      } else if (board[i][j] === "O") {
        oCount++;
      }
    }
  }

  // Check turn order: X goes first, so xCount must be oCount or oCount + 1
  if (!(oCount <= xCount && xCount <= oCount + 1)) {
    return false;
  }

  // Step 2: Check for winning lines
  const hasWinner = (player) => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
        return true;
      }
    }

    // Check columns
    for (let j = 0; j < 3; j++) {
      if (board[0][j] === player && board[1][j] === player && board[2][j] === player) {
        return true;
      }
    }

    // Check diagonals
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
      return true;
    }
    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
      return true;
    }

    return false;
  };

  const xWins = hasWinner("X");
  const oWins = hasWinner("O");

  // Step 3: Apply win condition constraints

  // Both players cannot win
  if (xWins && oWins) {
    return false;
  }

  // If X wins, X must have just moved, so xCount = oCount + 1
  if (xWins && xCount !== oCount + 1) {
    return false;
  }

  // If O wins, O must have just moved, so xCount = oCount
  if (oWins && xCount !== oCount) {
    return false;
  }

  // All checks passed
  return true;
}
```

```java
// Time: O(1) | Space: O(1)
// Board is always 3x3, so constant time operations
class Solution {
    /**
     * Determines if a Tic-Tac-Toe board state is valid.
     *
     * A board is valid if:
     * 1. X count is either equal to O count or exactly one more
     * 2. Not both players have winning lines
     * 3. If X wins, X count must be O count + 1
     * 4. If O wins, X count must equal O count
     */
    public boolean validTicTacToe(String[] board) {
        // Step 1: Count X's and O's
        int xCount = 0, oCount = 0;
        for (String row : board) {
            for (char c : row.toCharArray()) {
                if (c == 'X') {
                    xCount++;
                } else if (c == 'O') {
                    oCount++;
                }
            }
        }

        // Check turn order: X goes first, so xCount must be oCount or oCount + 1
        if (!(oCount <= xCount && xCount <= oCount + 1)) {
            return false;
        }

        // Step 2: Check for winning lines
        boolean xWins = hasWinner(board, 'X');
        boolean oWins = hasWinner(board, 'O');

        // Step 3: Apply win condition constraints

        // Both players cannot win
        if (xWins && oWins) {
            return false;
        }

        // If X wins, X must have just moved, so xCount = oCount + 1
        if (xWins && xCount != oCount + 1) {
            return false;
        }

        // If O wins, O must have just moved, so xCount = oCount
        if (oWins && xCount != oCount) {
            return false;
        }

        // All checks passed
        return true;
    }

    private boolean hasWinner(String[] board, char player) {
        // Check rows
        for (int i = 0; i < 3; i++) {
            if (board[i].charAt(0) == player &&
                board[i].charAt(1) == player &&
                board[i].charAt(2) == player) {
                return true;
            }
        }

        // Check columns
        for (int j = 0; j < 3; j++) {
            if (board[0].charAt(j) == player &&
                board[1].charAt(j) == player &&
                board[2].charAt(j) == player) {
                return true;
            }
        }

        // Check diagonals
        if (board[0].charAt(0) == player &&
            board[1].charAt(1) == player &&
            board[2].charAt(2) == player) {
            return true;
        }
        if (board[0].charAt(2) == player &&
            board[1].charAt(1) == player &&
            board[2].charAt(0) == player) {
            return true;
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We always have a 3x3 board, so counting pieces takes 9 iterations
- Checking winning lines involves checking 8 lines of 3 cells each (24 checks)
- All operations are constant regardless of input size

**Space Complexity:** O(1)

- We only use a few integer variables and booleans
- No additional data structures that scale with input size
- The helper function uses constant stack space

## Common Mistakes

1. **Forgetting that both players can't win simultaneously**: This seems obvious but candidates often check X's win and O's win independently without considering that if both have winning lines, the board is impossible.

2. **Not connecting win conditions with turn counts**: The most subtle part is realizing that if X wins, X must have exactly one more piece than O (not just "more pieces"). Similarly, if O wins, the counts must be equal. Candidates often check turn counts and win conditions separately.

3. **Incorrect turn order check**: Some candidates check `x_count == o_count or x_count == o_count + 1` but forget that `x_count` could be less than `o_count`, which should return false. The proper check is `o_count ≤ x_count ≤ o_count + 1`.

4. **Overcomplicating the solution**: Some candidates try to simulate games or use complex state machines. The elegant solution is just checking these four simple rules.

## When You'll See This Pattern

This problem teaches the pattern of **validating state against multiple constraints**. You'll see similar patterns in:

1. **Valid Sudoku (LeetCode 36)**: Check if a Sudoku board is valid by verifying rows, columns, and sub-boxes don't have duplicates. Like our problem, it involves checking multiple constraints on a fixed-size grid.

2. **Design Tic-Tac-Toe (LeetCode 348)**: While this is a design problem, it uses similar win-checking logic. Understanding how to efficiently check for wins in Tic-Tac-Toe helps with both problems.

3. **Valid Parentheses (LeetCode 20)**: Different domain but similar concept - checking if a sequence is valid by applying rules about order and pairing.

The core pattern is: when you need to validate something against multiple rules, break down each rule, implement checks for them, and most importantly, check how the rules interact with each other.

## Key Takeaways

1. **Break complex validation into simple rules**: Instead of trying to simulate the entire game, identify the fundamental rules that must hold for any valid board state.

2. **Check rule interactions**: The hardest part is usually how rules affect each other. If X wins, it affects the turn count rule. Always ask: "If condition A is true, how does it affect condition B?"

3. **Look for constant-time solutions on fixed-size inputs**: When input size is fixed (like 3x3 board), you can often find O(1) solutions that would be impossible with variable-sized inputs.

Related problems: [Design Tic-Tac-Toe](/problem/design-tic-tac-toe)
