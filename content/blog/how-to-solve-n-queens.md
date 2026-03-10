---
title: "How to Solve N-Queens — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode N-Queens. Hard difficulty, 75.0% acceptance rate. Topics: Array, Backtracking."
date: "2026-08-30"
category: "dsa-patterns"
tags: ["n-queens", "array", "backtracking", "hard"]
---

# How to Solve N-Queens

The N-Queens problem asks us to place N queens on an N×N chessboard so that no two queens attack each other. Queens can attack horizontally, vertically, and diagonally. What makes this problem challenging is that we need to find **all possible valid configurations**, not just one. With N queens and N² positions, the search space grows exponentially, making brute force enumeration impossible for even moderate N. The key insight is that we can place queens row by row while tracking which columns and diagonals are already threatened.

## Visual Walkthrough

Let's trace through N=4 step by step to build intuition:

**Step 1:** Start with an empty 4×4 board. We'll place queens row by row.

**Step 2:** Row 0 - Try column 0:

```
Q . . .
. . . .
. . . .
. . . .
```

This threatens column 0 and both diagonals through (0,0).

**Step 3:** Row 1 - Can't use column 0 (same column). Try column 1:

```
Q . . .
. Q . .
. . . .
. . . .
```

Check diagonals: (1,1) is on diagonal (row-col = 0) which is already threatened by queen at (0,0). Invalid! Try column 2:

```
Q . . .
. . Q .
. . . .
. . . .
```

Check: row-col = 1-2 = -1, row+col = 1+2 = 3. Neither is threatened. Valid!

**Step 4:** Row 2 - Try columns sequentially:

- Column 0: Threatened by queen at (0,0)
- Column 1: row-col = 2-1 = 1, row+col = 3. Neither threatened? Wait, check carefully: (2,1) is on diagonal with (1,2)? No, different diagonals. Actually valid!
- Column 2: Threatened by queen at (1,2)
- Column 3: row-col = -1, row+col = 5. Valid? But wait, (2,3) is on same diagonal as (0,1)? Let's check: 0+1=1, 2+3=5. Different. Actually valid!

Let's choose column 1:

```
Q . . .
. . Q .
. Q . .
. . . .
```

Now we have queens at (0,0), (1,2), (2,1). Check diagonals: (2,1) has row-col=1 (threatened by (1,2)? 1-2=-1, different). Actually valid so far.

**Step 5:** Row 3 - Try all columns:

- Column 0: Threatened by (0,0)
- Column 1: Threatened by (2,1)
- Column 2: Threatened by (1,2)
- Column 3: Check diagonals: row-col=0 (threatened by (0,0)), row+col=6. Invalid!

No valid position in row 3. We need to backtrack to row 2 and try the next option (column 3).

This process continues until we find all valid configurations. For N=4, there are 2 solutions.

## Brute Force Approach

A truly naive brute force would try placing queens in all possible combinations of N positions on an N×N board. That's C(N², N) combinations, which grows astronomically. For N=8, that's C(64,8) ≈ 4.4 billion combinations to check.

Even a slightly smarter brute force would place one queen per row (since two queens in the same row would attack each other). This gives N choices for the first row, N for the second, etc., resulting in N^N possibilities. For N=8, that's 8⁸ = 16,777,216 combinations. We'd need to check each configuration for validity, which takes O(N²) time per configuration, giving O(N^(N+2)) total time.

This is still far too slow. The key observation is that we can **prune** invalid configurations early using backtracking.

## Optimized Approach

The optimized approach uses **backtracking with pruning**:

1. **Place queens row by row**: Since queens attack horizontally, we know we can only place one queen per row.

2. **Track threatened columns**: Use a set or boolean array to track which columns already have queens.

3. **Track threatened diagonals**: A queen at (r,c) threatens two diagonals:
   - **Positive diagonal** (top-left to bottom-right): cells where (row - col) is constant
   - **Negative diagonal** (top-right to bottom-left): cells where (row + col) is constant

   We can use sets to track these constant values.

4. **Backtrack when stuck**: If we reach a row where no column is valid, backtrack to the previous row and try the next column.

5. **Record complete solutions**: When we successfully place N queens, convert the column placements to a board representation.

This approach prunes the search space dramatically because we abandon partial placements as soon as they become invalid.

## Optimal Solution

Here's the complete backtracking solution with detailed comments:

<div class="code-group">

```python
# Time: O(N!) | Space: O(N^2) for output, O(N) for recursion stack
def solveNQueens(n):
    """
    Returns all distinct solutions to the n-queens puzzle.
    Each solution is represented as a list of strings, where each string
    represents a row of the board with 'Q' for queen and '.' for empty.
    """
    solutions = []

    # These sets track threatened positions:
    cols = set()          # Columns that already have queens
    pos_diag = set()      # Positive diagonals (row - col)
    neg_diag = set()      # Negative diagonals (row + col)

    # Board representation: list where board[r] = c means queen at (r,c)
    board = [-1] * n

    def backtrack(row):
        """
        Try to place a queen in the given row.
        If successful and we've placed all N queens, record the solution.
        """
        # Base case: all queens placed
        if row == n:
            solutions.append(format_board(board))
            return

        # Try each column in the current row
        for col in range(n):
            # Check if (row, col) is threatened
            if col in cols or (row - col) in pos_diag or (row + col) in neg_diag:
                continue  # Square is threatened, skip

            # Place queen at (row, col)
            board[row] = col
            cols.add(col)
            pos_diag.add(row - col)
            neg_diag.add(row + col)

            # Recurse to next row
            backtrack(row + 1)

            # Backtrack: remove queen from (row, col)
            cols.remove(col)
            pos_diag.remove(row - col)
            neg_diag.remove(row + col)
            board[row] = -1

    def format_board(board):
        """Convert column placements to the required string format."""
        formatted = []
        for col in board:
            row_str = ['.'] * n
            row_str[col] = 'Q'
            formatted.append(''.join(row_str))
        return formatted

    backtrack(0)
    return solutions
```

```javascript
// Time: O(N!) | Space: O(N^2) for output, O(N) for recursion stack
function solveNQueens(n) {
  const solutions = [];

  // Track threatened positions
  const cols = new Set(); // Columns with queens
  const posDiag = new Set(); // Positive diagonals (row - col)
  const negDiag = new Set(); // Negative diagonals (row + col)

  // Board representation: board[row] = column of queen in that row
  const board = new Array(n).fill(-1);

  function backtrack(row) {
    // Base case: all queens placed successfully
    if (row === n) {
      solutions.push(formatBoard(board));
      return;
    }

    // Try placing queen in each column of current row
    for (let col = 0; col < n; col++) {
      // Check if this square is threatened
      if (cols.has(col) || posDiag.has(row - col) || negDiag.has(row + col)) {
        continue; // Square is threatened, try next column
      }

      // Place queen at (row, col)
      board[row] = col;
      cols.add(col);
      posDiag.add(row - col);
      negDiag.add(row + col);

      // Recurse to next row
      backtrack(row + 1);

      // Backtrack: remove queen
      cols.delete(col);
      posDiag.delete(row - col);
      negDiag.delete(row + col);
      board[row] = -1;
    }
  }

  function formatBoard(board) {
    // Convert column placements to array of strings
    const formatted = [];
    for (let col of board) {
      const rowChars = new Array(n).fill(".");
      rowChars[col] = "Q";
      formatted.push(rowChars.join(""));
    }
    return formatted;
  }

  backtrack(0);
  return solutions;
}
```

```java
// Time: O(N!) | Space: O(N^2) for output, O(N) for recursion stack
import java.util.*;

class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> solutions = new ArrayList<>();

        // Track threatened positions
        Set<Integer> cols = new HashSet<>();      // Columns with queens
        Set<Integer> posDiag = new HashSet<>();   // Positive diagonals (row - col)
        Set<Integer> negDiag = new HashSet<>();   // Negative diagonals (row + col)

        // Board representation: board[row] = column of queen in that row
        int[] board = new int[n];
        Arrays.fill(board, -1);

        backtrack(0, n, board, cols, posDiag, negDiag, solutions);
        return solutions;
    }

    private void backtrack(int row, int n, int[] board,
                          Set<Integer> cols, Set<Integer> posDiag,
                          Set<Integer> negDiag, List<List<String>> solutions) {
        // Base case: all queens placed successfully
        if (row == n) {
            solutions.add(formatBoard(board, n));
            return;
        }

        // Try placing queen in each column of current row
        for (int col = 0; col < n; col++) {
            // Check if this square is threatened
            if (cols.contains(col) ||
                posDiag.contains(row - col) ||
                negDiag.contains(row + col)) {
                continue;  // Square is threatened, try next column
            }

            // Place queen at (row, col)
            board[row] = col;
            cols.add(col);
            posDiag.add(row - col);
            negDiag.add(row + col);

            // Recurse to next row
            backtrack(row + 1, n, board, cols, posDiag, negDiag, solutions);

            // Backtrack: remove queen
            cols.remove(col);
            posDiag.remove(row - col);
            negDiag.remove(row + col);
            board[row] = -1;
        }
    }

    private List<String> formatBoard(int[] board, int n) {
        // Convert column placements to list of strings
        List<String> formatted = new ArrayList<>();
        for (int col : board) {
            char[] rowChars = new char[n];
            Arrays.fill(rowChars, '.');
            rowChars[col] = 'Q';
            formatted.add(new String(rowChars));
        }
        return formatted;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(N!)**

- In the first row, we have N choices
- In the second row, at most N-1 choices (one column eliminated by the first queen's column and diagonals)
- In the third row, at most N-2 choices, and so on
- This gives N × (N-1) × (N-2) × ... × 1 = N! possibilities in the worst case
- However, pruning reduces this significantly in practice. The exact number of solutions grows roughly as O(N!/c^N) for some constant c

**Space Complexity: O(N²) for output + O(N) for recursion**

- Output storage: Each solution requires N strings of length N, and there are S solutions. In worst case, S can be large, giving O(N² × S)
- Recursion stack: O(N) depth for the backtracking recursion
- Sets for tracking threatened positions: O(N) each

## Common Mistakes

1. **Forgetting to track both diagonals**: Many candidates remember to track columns but forget one of the diagonal directions. Remember: queens threaten along both (row-col) and (row+col) diagonals.

2. **Inefficient validity checking**: Some candidates check validity by scanning the entire board O(N²) for each placement. Using sets for O(1) lookup is crucial for performance.

3. **Not resetting state during backtracking**: When you remove a queen, you must remove it from ALL tracking structures (cols, pos_diag, neg_diag). Forgetting any one will cause incorrect pruning.

4. **Confusing row and column indices**: When converting column placements to board strings, remember board[row] = col means the queen is in that column of that row. The formatting step often trips people up.

## When You'll See This Pattern

The backtracking with pruning pattern appears in many constraint satisfaction problems:

1. **Sudoku Solver (LeetCode 37)**: Similar to N-Queens but with more constraints (rows, columns, and 3×3 boxes).

2. **Permutations (LeetCode 46)**: Backtracking through all permutations of a list, though without the complex constraints of N-Queens.

3. **Word Search II (LeetCode 212)**: Uses backtracking with pruning via a trie data structure to find words in a grid.

4. **Combination Sum (LeetCode 39)**: Backtracking through combinations with a target sum constraint.

The key signature is: "Find all valid configurations" + "Exponential search space" + "Constraints that allow pruning".

## Key Takeaways

1. **Backtracking is DFS on a decision tree**: Each node represents a partial solution, and we explore children until we hit a dead end or complete solution, then backtrack.

2. **Prune early, prune often**: The power of backtracking comes from abandoning invalid partial solutions as soon as possible. Use efficient data structures (sets/hash tables) for constraint checking.

3. **Symmetry can reduce search space**: For N-Queens, you could exploit symmetry to check only unique solutions, though the standard solution doesn't require this optimization.

4. **Template for backtracking problems**:
   - Define state representation
   - Define base case (complete solution)
   - Define choice exploration with pruning
   - Update state, recurse, restore state

Related problems: [N-Queens II](/problem/n-queens-ii), [Grid Illumination](/problem/grid-illumination)
