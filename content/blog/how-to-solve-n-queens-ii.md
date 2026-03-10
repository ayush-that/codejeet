---
title: "How to Solve N-Queens II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode N-Queens II. Hard difficulty, 78.2% acceptance rate. Topics: Backtracking."
date: "2027-03-16"
category: "dsa-patterns"
tags: ["n-queens-ii", "backtracking", "hard"]
---

# How to Solve N-Queens II

The N-Queens II problem asks us to count how many distinct ways we can place N queens on an N×N chessboard so that no two queens attack each other. While this sounds similar to the standard N-Queens problem, the twist here is that we only need to count the solutions, not generate the actual board configurations. This makes it an interesting optimization challenge—we can potentially use more efficient data structures and pruning techniques since we don't need to store the full board states.

## Visual Walkthrough

Let's trace through a small example with n=4 to build intuition:

We need to place 4 queens on a 4×4 board. Queens attack along rows, columns, and diagonals, so each queen must be in a unique row, unique column, and unique diagonal.

**Step-by-step placement:**

1. **Row 0**: Place queen at column 0
   - Board: Q at (0,0)
   - Blocked: Column 0, diagonal (row-col=0), anti-diagonal (row+col=0)

2. **Row 1**: Try columns from left to right
   - Column 0: Blocked (same column as row 0)
   - Column 1: Blocked (diagonal: 1-1=0, same as row 0's 0-0=0)
   - Column 2: Valid! Place queen at (1,2)
   - Blocked: Column 2, diagonal (1-2=-1), anti-diagonal (1+2=3)

3. **Row 2**: Try columns
   - Column 0: Blocked (same column as row 0)
   - Column 1: Valid! Place queen at (2,1)
   - Blocked: Column 1, diagonal (2-1=1), anti-diagonal (2+1=3)

4. **Row 3**: Try columns
   - Column 0: Blocked (same column as row 0)
   - Column 1: Blocked (same column as row 2)
   - Column 2: Blocked (same column as row 1)
   - Column 3: Check diagonals...
     - Diagonal: 3-3=0 (blocked by row 0's diagonal 0)
     - No valid position in row 3!

We need to backtrack to row 2 and try other options. This process continues until we explore all possibilities. For n=4, there are exactly 2 valid solutions.

## Brute Force Approach

A truly brute force approach would try all possible placements of n queens on an n×n board and check if each is valid. There are C(n², n) possible placements (choosing n squares out of n²), which grows astronomically. For n=8, that's C(64, 8) ≈ 4.4 billion combinations to check!

A slightly smarter brute force would place one queen per row (since queens in the same row would attack each other). This gives us n choices for the first row, n for the second, and so on—resulting in n^n possibilities. For n=8, that's 8^8 = 16,777,216 combinations, which is still far too many.

The problem with brute force is that it doesn't prune invalid paths early. We waste time exploring placements that are clearly impossible, like placing two queens in the same column or diagonal.

## Optimized Approach

The key insight is to use **backtracking with pruning**:

1. Place queens row by row (ensuring no two queens share a row)
2. Track which columns are already occupied
3. Track which diagonals are already occupied
4. When we place a queen, mark its column and diagonals as occupied
5. Backtrack immediately when no valid position exists in the current row

**Why this works:**

- By placing queens row by row, we ensure no two queens share a row
- By tracking occupied columns, we ensure no two queens share a column
- By tracking diagonals, we ensure no two queens share a diagonal

**Diagonal tracking trick:**

- For an n×n board, there are 2n-1 diagonals in each direction
- For a queen at position (r, c):
  - Main diagonal (top-left to bottom-right): r - c gives a unique value from -(n-1) to (n-1)
  - Anti-diagonal (top-right to bottom-left): r + c gives a unique value from 0 to 2n-2

We can use boolean arrays or bitmasks to track these efficiently.

## Optimal Solution

Here's the complete backtracking solution with diagonal tracking:

<div class="code-group">

```python
# Time: O(n!) | Space: O(n)
class Solution:
    def totalNQueens(self, n: int) -> int:
        """
        Count the number of distinct solutions to the n-queens puzzle.
        Uses backtracking with sets to track occupied columns and diagonals.
        """
        def backtrack(row, cols, diag1, diag2):
            """
            Recursive backtracking function.

            Args:
                row: Current row we're placing a queen in
                cols: Set of occupied columns
                diag1: Set of occupied main diagonals (r - c)
                diag2: Set of occupied anti-diagonals (r + c)

            Returns:
                Number of valid placements starting from this state
            """
            # Base case: all queens placed successfully
            if row == n:
                return 1

            count = 0
            # Try placing queen in each column of current row
            for col in range(n):
                # Calculate diagonal identifiers
                d1 = row - col  # Main diagonal
                d2 = row + col  # Anti-diagonal

                # Check if position is valid
                if col in cols or d1 in diag1 or d2 in diag2:
                    continue  # Position is attacked, skip

                # Place queen: mark column and diagonals as occupied
                cols.add(col)
                diag1.add(d1)
                diag2.add(d2)

                # Recurse to next row
                count += backtrack(row + 1, cols, diag1, diag2)

                # Backtrack: remove queen to try other positions
                cols.remove(col)
                diag1.remove(d1)
                diag2.remove(d2)

            return count

        # Start backtracking from row 0 with empty board
        return backtrack(0, set(), set(), set())
```

```javascript
// Time: O(n!) | Space: O(n)
/**
 * @param {number} n
 * @return {number}
 */
var totalNQueens = function (n) {
  /**
   * Count the number of distinct solutions to the n-queens puzzle.
   * Uses backtracking with sets to track occupied columns and diagonals.
   */

  /**
   * Recursive backtracking function.
   * @param {number} row - Current row we're placing a queen in
   * @param {Set} cols - Set of occupied columns
   * @param {Set} diag1 - Set of occupied main diagonals (r - c)
   * @param {Set} diag2 - Set of occupied anti-diagonals (r + c)
   * @returns {number} - Number of valid placements starting from this state
   */
  const backtrack = (row, cols, diag1, diag2) => {
    // Base case: all queens placed successfully
    if (row === n) {
      return 1;
    }

    let count = 0;
    // Try placing queen in each column of current row
    for (let col = 0; col < n; col++) {
      // Calculate diagonal identifiers
      const d1 = row - col; // Main diagonal
      const d2 = row + col; // Anti-diagonal

      // Check if position is valid
      if (cols.has(col) || diag1.has(d1) || diag2.has(d2)) {
        continue; // Position is attacked, skip
      }

      // Place queen: mark column and diagonals as occupied
      cols.add(col);
      diag1.add(d1);
      diag2.add(d2);

      // Recurse to next row
      count += backtrack(row + 1, cols, diag1, diag2);

      // Backtrack: remove queen to try other positions
      cols.delete(col);
      diag1.delete(d1);
      diag2.delete(d2);
    }

    return count;
  };

  // Start backtracking from row 0 with empty board
  return backtrack(0, new Set(), new Set(), new Set());
};
```

```java
// Time: O(n!) | Space: O(n)
class Solution {
    /**
     * Count the number of distinct solutions to the n-queens puzzle.
     * Uses backtracking with boolean arrays to track occupied columns and diagonals.
     */
    public int totalNQueens(int n) {
        // Boolean arrays to track occupied positions
        boolean[] cols = new boolean[n];          // Occupied columns
        boolean[] diag1 = new boolean[2 * n - 1]; // Main diagonals (r - c + n - 1)
        boolean[] diag2 = new boolean[2 * n - 1]; // Anti-diagonals (r + c)

        return backtrack(0, cols, diag1, diag2, n);
    }

    /**
     * Recursive backtracking function.
     * @param row Current row we're placing a queen in
     * @param cols Boolean array tracking occupied columns
     * @param diag1 Boolean array tracking occupied main diagonals
     * @param diag2 Boolean array tracking occupied anti-diagonals
     * @param n Board size
     * @return Number of valid placements starting from this state
     */
    private int backtrack(int row, boolean[] cols, boolean[] diag1, boolean[] diag2, int n) {
        // Base case: all queens placed successfully
        if (row == n) {
            return 1;
        }

        int count = 0;
        // Try placing queen in each column of current row
        for (int col = 0; col < n; col++) {
            // Calculate diagonal indices
            // For main diagonal: r - c ranges from -(n-1) to (n-1)
            // Add n-1 to shift to 0-based index: (r - c + n - 1)
            int d1 = row - col + n - 1;
            // For anti-diagonal: r + c ranges from 0 to 2n-2
            int d2 = row + col;

            // Check if position is valid
            if (cols[col] || diag1[d1] || diag2[d2]) {
                continue;  // Position is attacked, skip
            }

            // Place queen: mark column and diagonals as occupied
            cols[col] = true;
            diag1[d1] = true;
            diag2[d2] = true;

            // Recurse to next row
            count += backtrack(row + 1, cols, diag1, diag2, n);

            // Backtrack: remove queen to try other positions
            cols[col] = false;
            diag1[d1] = false;
            diag2[d2] = false;
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n!)**

- In the first row, we have n choices
- In the second row, at most n-1 choices (excluding the column of the first queen)
- In the third row, at most n-2 choices, and so on
- This gives us n × (n-1) × (n-2) × ... × 1 = n! possibilities in the worst case
- However, diagonal constraints prune many branches, so actual runtime is better than n! but still exponential

**Space Complexity: O(n)**

- The recursion depth goes up to n (one call per row)
- We store 3 tracking structures:
  - Columns: O(n)
  - Diagonals: O(2n-1) ≈ O(n) each
- Total: O(n) for recursion stack + O(n) for tracking = O(n)

## Common Mistakes

1. **Forgetting to track both diagonals**: Many candidates remember to track columns but forget that queens attack along both diagonals. Remember: main diagonal uses `row - col`, anti-diagonal uses `row + col`.

2. **Incorrect diagonal indexing in Java/C++**: When using arrays (not sets), you need to shift the diagonal indices to be non-negative. For `row - col`, add `n-1` to get a valid array index.

3. **Not backtracking properly**: After the recursive call, you must undo your changes (remove from sets or set boolean arrays back to false). Otherwise, you'll carry invalid state into the next iteration.

4. **Using O(n²) space for the board**: Since we only need to count solutions, not generate board states, we don't need to store the full n×n board. Using sets or boolean arrays is more space-efficient.

## When You'll See This Pattern

The backtracking-with-pruning pattern appears in many constraint satisfaction problems:

1. **Sudoku Solver (Hard)**: Similar to N-Queens but with more constraints (rows, columns, and 3×3 boxes).

2. **Permutations (Medium)**: Generating all permutations uses similar backtracking, but without the diagonal constraints.

3. **Word Search II (Hard)**: Uses backtracking on a grid with pruning via a trie data structure.

4. **Combination Sum (Medium)**: Backtracking to find combinations that sum to a target, with pruning when the sum exceeds the target.

The key pattern is: when you need to explore all possibilities but can prune invalid paths early, backtracking is often the right approach.

## Key Takeaways

1. **Backtracking is ideal for constraint satisfaction problems**: When you need to explore a solution space with constraints, backtracking lets you prune invalid paths early, saving exponential time.

2. **Track constraints efficiently**: Use sets or boolean arrays to track which positions are invalid in O(1) time. For N-Queens, the diagonal tracking trick (`row ± col`) is crucial.

3. **Optimize for counting vs. generating**: When you only need to count solutions (not generate them), you can often use more memory-efficient data structures and avoid storing intermediate states.

Related problems: [N-Queens](/problem/n-queens)
