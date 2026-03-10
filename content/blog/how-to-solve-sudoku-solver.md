---
title: "How to Solve Sudoku Solver — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Sudoku Solver. Hard difficulty, 65.4% acceptance rate. Topics: Array, Hash Table, Backtracking, Matrix."
date: "2026-10-19"
category: "dsa-patterns"
tags: ["sudoku-solver", "array", "hash-table", "backtracking", "hard"]
---

# How to Solve Sudoku Solver

Sudoku Solver is a classic backtracking problem where you're given a 9×9 Sudoku board with some cells pre-filled and need to fill the remaining empty cells while satisfying all Sudoku rules. What makes this problem interesting is that it combines constraint satisfaction with systematic search — you need to check three different constraints (row, column, and 3×3 sub-box) for every placement, and backtrack when you hit a dead end.

## Visual Walkthrough

Let's trace through a simplified example to build intuition. Consider this partial board:

```
5 3 . | . 7 . | . . .
6 . . | 1 9 5 | . . .
. 9 8 | . . . | . 6 .
------+-------+------
8 . . | . 6 . | . . 3
4 . . | 8 . 3 | . . 1
7 . . | . 2 . | . . 6
. 6 . | . . . | 2 8 .
. . . | 4 1 9 | . . 5
. . . | . 8 . | . 7 9
```

We'll focus on the first empty cell at position (0,2) [row 0, column 2]:

1. **Check what numbers are valid**: We need to check row 0, column 2, and the top-left 3×3 box
   - Row 0 contains: 5, 3, 7 → cannot use 1, 2, 4, 6, 8, 9
   - Column 2 contains: 8 → cannot use 8
   - Box (0,0) contains: 5, 3, 6, 9, 8 → cannot use 1, 2, 4, 7

2. **Try valid numbers**: The only number not excluded is 1. So we place 1 at (0,2).

3. **Move to next empty cell**: Continue this process. If we ever reach a cell where no numbers 1-9 are valid, we must backtrack to the previous decision and try a different number.

The key insight is that we need to systematically try all possibilities but prune branches early when constraints are violated.

## Brute Force Approach

A truly naive brute force would try every possible number (1-9) in every empty cell without checking constraints until the end, then verify the complete board. This is astronomically inefficient — for 81 cells with an average of 50 empty cells, that's 9⁵⁰ possibilities (approximately 5×10⁴⁷).

A slightly better but still inefficient brute force would check constraints as we go but use no optimization in choosing which cell to fill next. It would simply iterate through the board left-to-right, top-to-bottom, trying numbers 1-9 at each empty cell, backtracking when stuck.

The problem with this approach is it doesn't prioritize cells with fewer possibilities. In Sudoku, filling a cell with only one valid option immediately reduces uncertainty, while guessing at a cell with many options increases the search space dramatically.

## Optimized Approach

The optimal approach uses **backtracking with constraint propagation** and **most-constrained variable ordering** (though we'll implement a simpler version that's still efficient enough).

Key insights:

1. **Backtracking framework**: We recursively try to fill empty cells. When we place a number, we check if it violates any constraints. If it does, we try the next number. If all numbers fail, we backtrack.
2. **Constraint checking**: For each placement, we must check three constraints:
   - No duplicate in the same row
   - No duplicate in the same column
   - No duplicate in the same 3×3 sub-box
3. **Efficient validation**: We can precompute which numbers are already used in each row, column, and box to make validation O(1) instead of O(9).
4. **Cell selection optimization**: While not strictly necessary for the basic solution, choosing the cell with the fewest valid options first (most-constrained variable) dramatically reduces the search tree.

The backtracking algorithm works like this:

1. Find an empty cell
2. Try numbers 1-9 that don't violate constraints
3. Place a valid number and recursively try to solve the rest
4. If recursion succeeds, we're done
5. If recursion fails, remove the number (backtrack) and try the next valid number
6. If all numbers fail, return false to trigger backtracking at a higher level

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(9^(n)) where n is number of empty cells, but pruning reduces this dramatically
# Space: O(n) for recursion stack, where n is number of empty cells (max 81)
class Solution:
    def solveSudoku(self, board: List[List[str]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        """
        # Helper function to check if placing num at (row, col) is valid
        def is_valid(row, col, num):
            # Check row
            for j in range(9):
                if board[row][j] == num:
                    return False

            # Check column
            for i in range(9):
                if board[i][col] == num:
                    return False

            # Check 3x3 sub-box
            # Find top-left corner of the sub-box containing (row, col)
            box_row = (row // 3) * 3
            box_col = (col // 3) * 3
            for i in range(box_row, box_row + 3):
                for j in range(box_col, box_col + 3):
                    if board[i][j] == num:
                        return False

            return True

        def backtrack():
            # Try to find an empty cell
            for i in range(9):
                for j in range(9):
                    if board[i][j] == '.':
                        # Try numbers 1 through 9
                        for num in map(str, range(1, 10)):
                            if is_valid(i, j, num):
                                # Place the number
                                board[i][j] = num

                                # Recursively try to solve the rest
                                if backtrack():
                                    return True

                                # If we reach here, the placement didn't lead to a solution
                                # Backtrack by removing the number
                                board[i][j] = '.'

                        # If no number works for this cell, trigger backtracking
                        return False

            # If we've filled all cells, we've found a solution
            return True

        # Start the backtracking process
        backtrack()
```

```javascript
// Time: O(9^(n)) where n is number of empty cells, but pruning reduces this dramatically
// Space: O(n) for recursion stack, where n is number of empty cells (max 81)
/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function (board) {
  // Helper function to check if placing num at (row, col) is valid
  const isValid = (row, col, num) => {
    // Check row
    for (let j = 0; j < 9; j++) {
      if (board[row][j] === num) {
        return false;
      }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) {
        return false;
      }
    }

    // Check 3x3 sub-box
    // Find top-left corner of the sub-box containing (row, col)
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (board[i][j] === num) {
          return false;
        }
      }
    }

    return true;
  };

  const backtrack = () => {
    // Try to find an empty cell
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === ".") {
          // Try numbers 1 through 9
          for (let num = 1; num <= 9; num++) {
            const numStr = num.toString();
            if (isValid(i, j, numStr)) {
              // Place the number
              board[i][j] = numStr;

              // Recursively try to solve the rest
              if (backtrack()) {
                return true;
              }

              // If we reach here, the placement didn't lead to a solution
              // Backtrack by removing the number
              board[i][j] = ".";
            }
          }

          // If no number works for this cell, trigger backtracking
          return false;
        }
      }
    }

    // If we've filled all cells, we've found a solution
    return true;
  };

  // Start the backtracking process
  backtrack();
};
```

```java
// Time: O(9^(n)) where n is number of empty cells, but pruning reduces this dramatically
// Space: O(n) for recursion stack, where n is number of empty cells (max 81)
class Solution {
    public void solveSudoku(char[][] board) {
        backtrack(board);
    }

    private boolean backtrack(char[][] board) {
        // Try to find an empty cell
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] == '.') {
                    // Try numbers 1 through 9
                    for (char num = '1'; num <= '9'; num++) {
                        if (isValid(board, i, j, num)) {
                            // Place the number
                            board[i][j] = num;

                            // Recursively try to solve the rest
                            if (backtrack(board)) {
                                return true;
                            }

                            // If we reach here, the placement didn't lead to a solution
                            // Backtrack by removing the number
                            board[i][j] = '.';
                        }
                    }

                    // If no number works for this cell, trigger backtracking
                    return false;
                }
            }
        }

        // If we've filled all cells, we've found a solution
        return true;
    }

    private boolean isValid(char[][] board, int row, int col, char num) {
        // Check row
        for (int j = 0; j < 9; j++) {
            if (board[row][j] == num) {
                return false;
            }
        }

        // Check column
        for (int i = 0; i < 9; i++) {
            if (board[i][col] == num) {
                return false;
            }
        }

        // Check 3x3 sub-box
        // Find top-left corner of the sub-box containing (row, col)
        int boxRow = (row / 3) * 3;
        int boxCol = (col / 3) * 3;
        for (int i = boxRow; i < boxRow + 3; i++) {
            for (int j = boxCol; j < boxCol + 3; j++) {
                if (board[i][j] == num) {
                    return false;
                }
            }
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: In theory, O(9ⁿ) where n is the number of empty cells (up to 81). However, in practice, constraint checking prunes the search tree dramatically. For a standard Sudoku puzzle with a unique solution, the algorithm typically runs in milliseconds because each constraint check eliminates many possibilities early.

**Space Complexity**: O(n) for the recursion stack, where n is the number of empty cells. In the worst case (completely empty board), this is O(81) = O(1) constant space. We modify the board in-place, so no additional data structures are needed beyond the recursion stack.

## Common Mistakes

1. **Forgetting to backtrack properly**: The most common error is not resetting the cell to '.' when backtracking. This leaves incorrect numbers on the board that poison subsequent attempts.

2. **Incorrect sub-box calculation**: Many candidates miscalculate the 3×3 sub-box boundaries. Remember: `box_row = (row // 3) * 3` gives the top row of the containing box, not `row // 3` alone.

3. **Using the wrong data types**: In some languages, numbers and characters need conversion. For example, in Python, we need `str(num)` or `map(str, range(1, 10))` since the board stores characters, not integers.

4. **Not checking all three constraints**: Some candidates forget one of the three constraints (usually the sub-box check), which leads to invalid solutions that pass their validation.

5. **Infinite recursion**: Without the base case (returning true when all cells are filled), the recursion would continue indefinitely or cause a stack overflow.

## When You'll See This Pattern

The backtracking pattern in Sudoku Solver appears in many constraint satisfaction problems:

1. **N-Queens**: Place N queens on an N×N chessboard so that no two queens threaten each other. Like Sudoku, you place queens one by one, checking constraints, and backtrack when you hit a conflict.

2. **Word Search II**: Find all words from a dictionary in a 2D board. You backtrack through the board, trying to form words, and prune when the current path can't form any valid word.

3. **Permutations/Combinations problems**: Generating all permutations or combinations often uses backtracking to build solutions incrementally and backtrack when a partial solution can't be completed.

The common thread is: you're building a solution incrementally, have constraints to satisfy at each step, and need to explore multiple possibilities systematically.

## Key Takeaways

1. **Backtracking is systematic trial-and-error**: When you need to explore all possibilities but want to prune invalid branches early, backtracking is your tool. It's essentially DFS on a decision tree.

2. **Constraint checking enables pruning**: The earlier you can detect a violation, the more of the search space you can eliminate. Always check constraints as soon as possible.

3. **The backtracking template is reusable**: Find an empty slot → try all valid options → recursively solve the rest → backtrack if recursion fails. This pattern works for many problems beyond Sudoku.

4. **Modify in-place, restore when backtracking**: A clean backtracking implementation modifies the data structure in place and carefully restores it to its previous state when backtracking.

Related problems: [Valid Sudoku](/problem/valid-sudoku), [Unique Paths III](/problem/unique-paths-iii)
