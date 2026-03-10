---
title: "How to Solve Battleships in a Board — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Battleships in a Board. Medium difficulty, 77.4% acceptance rate. Topics: Array, Depth-First Search, Matrix."
date: "2028-02-28"
category: "dsa-patterns"
tags: ["battleships-in-a-board", "array", "depth-first-search", "matrix", "medium"]
---

# How to Solve Battleships in a Board

This problem asks us to count the number of battleships on a board where battleships are placed either horizontally or vertically, and they don't touch each other (even diagonally). The tricky part is that we need to count each battleship only once, even though a single battleship occupies multiple adjacent cells. This is essentially a connected components problem where we need to identify and count distinct groups of 'X's that are connected horizontally or vertically.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Board:
X . . X
. . . X
. . . X
. . . .
```

We need to count how many battleships are here. Let's walk through the board cell by cell:

1. **Cell (0,0) = 'X'**: This is the start of a battleship. Is it connected to anything? Check left: no cell. Check above: no cell. This must be the **first cell** of a new battleship. Count = 1.

2. **Cell (0,1) = '.'**: Skip.

3. **Cell (0,2) = '.'**: Skip.

4. **Cell (0,3) = 'X'**: Check left: cell (0,2) is '.', so not connected horizontally. Check above: no cell. This is the **first cell** of a new battleship. Count = 2.

5. **Cell (1,3) = 'X'**: Check left: cell (1,2) is '.', so not connected horizontally. Check above: cell (0,3) is 'X', so this is **connected vertically** to an existing battleship. Don't count it as new.

6. **Cell (2,3) = 'X'**: Check left: cell (2,2) is '.'. Check above: cell (1,3) is 'X', so connected vertically to existing battleship. Don't count.

7. **Cell (3,3) = '.'**: Skip.

Final count: **2 battleships**. This matches what we see: one horizontal battleship of length 2 starting at (0,0), and one vertical battleship of length 3 starting at (0,3).

The key insight: We only count the **first cell** of each battleship. For horizontal battleships, the first cell has no 'X' to its left. For vertical battleships, the first cell has no 'X' above it.

## Brute Force Approach

A naive approach would be to use DFS or BFS to find all connected components of 'X's, similar to "Number of Islands". We would:

1. Create a visited matrix to track which cells we've processed
2. Iterate through every cell
3. When we find an unvisited 'X', increment count and perform DFS/BFS to mark all connected 'X's as visited

While this approach works and is correct, it requires O(m×n) extra space for the visited matrix and modifies the board (if we mark visited cells directly). More importantly, it's more complex than necessary since we don't actually need to explore the entire battleship - we just need to identify its starting point.

## Optimized Approach

The optimal solution uses a single-pass counting strategy with O(1) extra space (excluding the input). The key insight is that **we only need to count the first cell of each battleship**.

For any cell (i,j) with 'X':

- If there's an 'X' to the left (board[i][j-1] == 'X'), then this cell is part of a horizontal battleship that started earlier
- If there's an 'X' above (board[i-1][j] == 'X'), then this cell is part of a vertical battleship that started earlier
- If neither is true, then this is the first cell of a new battleship

This works because battleships don't touch each other (even diagonally), so we don't have to worry about ambiguous cases. The problem guarantees valid board placement.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(m×n) where m=rows, n=cols | Space: O(1) excluding input
def countBattleships(board):
    """
    Count battleships on the board by identifying the first cell of each ship.
    A cell is the first cell if it's an 'X' and has no 'X' to its left or above.
    """
    if not board or not board[0]:
        return 0

    rows, cols = len(board), len(board[0])
    count = 0

    for i in range(rows):
        for j in range(cols):
            # Skip empty cells
            if board[i][j] != 'X':
                continue

            # Check if this is the first cell of a battleship
            # For horizontal ships: no 'X' to the left
            # For vertical ships: no 'X' above
            is_first_cell = True

            # Check left neighbor (if exists)
            if j > 0 and board[i][j-1] == 'X':
                is_first_cell = False

            # Check top neighbor (if exists)
            if i > 0 and board[i-1][j] == 'X':
                is_first_cell = False

            # If this is the first cell, increment count
            if is_first_cell:
                count += 1

    return count
```

```javascript
// Time: O(m×n) where m=rows, n=cols | Space: O(1) excluding input
function countBattleships(board) {
  /**
   * Count battleships on the board by identifying the first cell of each ship.
   * A cell is the first cell if it's an 'X' and has no 'X' to its left or above.
   */
  if (!board || board.length === 0 || board[0].length === 0) {
    return 0;
  }

  const rows = board.length;
  const cols = board[0].length;
  let count = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Skip empty cells
      if (board[i][j] !== "X") {
        continue;
      }

      // Check if this is the first cell of a battleship
      // For horizontal ships: no 'X' to the left
      // For vertical ships: no 'X' above
      let isFirstCell = true;

      // Check left neighbor (if exists)
      if (j > 0 && board[i][j - 1] === "X") {
        isFirstCell = false;
      }

      // Check top neighbor (if exists)
      if (i > 0 && board[i - 1][j] === "X") {
        isFirstCell = false;
      }

      // If this is the first cell, increment count
      if (isFirstCell) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(m×n) where m=rows, n=cols | Space: O(1) excluding input
class Solution {
    public int countBattleships(char[][] board) {
        /**
         * Count battleships on the board by identifying the first cell of each ship.
         * A cell is the first cell if it's an 'X' and has no 'X' to its left or above.
         */
        if (board == null || board.length == 0 || board[0].length == 0) {
            return 0;
        }

        int rows = board.length;
        int cols = board[0].length;
        int count = 0;

        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                // Skip empty cells
                if (board[i][j] != 'X') {
                    continue;
                }

                // Check if this is the first cell of a battleship
                // For horizontal ships: no 'X' to the left
                // For vertical ships: no 'X' above
                boolean isFirstCell = true;

                // Check left neighbor (if exists)
                if (j > 0 && board[i][j-1] == 'X') {
                    isFirstCell = false;
                }

                // Check top neighbor (if exists)
                if (i > 0 && board[i-1][j] == 'X') {
                    isFirstCell = false;
                }

                // If this is the first cell, increment count
                if (isFirstCell) {
                    count++;
                }
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m×n) where m is the number of rows and n is the number of columns. We visit each cell exactly once and perform constant-time checks for each.

**Space Complexity:** O(1) extra space (excluding the input board). We only use a few variables (count, loop indices, and a boolean flag). This is the key advantage over DFS/BFS approaches that require O(m×n) space for visited tracking or recursion stack.

## Common Mistakes

1. **Checking both neighbors incorrectly**: Some candidates check `board[i][j+1]` or `board[i+1][j]` (right and below) instead of left and above. This would count the last cell of each battleship instead of the first. Always check left and above to identify starting cells.

2. **Forgetting boundary checks**: When checking `board[i][j-1]`, you must ensure `j > 0` to avoid index out of bounds. Similarly for `board[i-1][j]`, check `i > 0`. Missing these checks is a common off-by-one error.

3. **Overcomplicating with DFS/BFS**: Many candidates immediately jump to DFS/BFS because this looks like a connected components problem. While that approach works, it's less efficient in both time (multiple passes) and space (visited matrix). Always look for opportunities to solve in a single pass if possible.

4. **Misunderstanding the problem constraints**: The problem states battleships don't touch each other, even diagonally. Some candidates worry about diagonal connections or ships that are L-shaped. Remember: ships are strictly horizontal or vertical 1×k shapes.

## When You'll See This Pattern

This "first cell identification" pattern appears in several grid traversal problems where you need to count connected components but can identify them by checking only specific neighbors:

1. **Number of Islands (Medium)**: Similar concept but requires DFS/BFS because islands can have arbitrary shapes and may touch diagonally (depending on problem definition).

2. **Max Area of Island (Medium)**: Requires exploring entire connected components to calculate area, so DFS/BFS is necessary.

3. **Walls and Gates (Medium)**: Uses BFS to propagate distances from gates to empty rooms.

The key difference with Battleships is the constraint that components don't touch diagonally and are strictly horizontal or vertical, which enables the O(1) space single-pass solution.

## Key Takeaways

1. **Look for constraints that simplify the problem**: The fact that battleships are strictly horizontal/vertical and don't touch diagonally enables the elegant "first cell" counting approach. Always read problem constraints carefully.

2. **Sometimes you don't need to traverse the entire component**: For counting problems, if you can identify unique starting points without exploring the entire component, you can achieve better space complexity.

3. **Boundary checks are critical in grid problems**: Always check array bounds before accessing neighbors. This is a common interview pitfall that separates careful candidates from rushed ones.

Related problems: [Number of Islands](/problem/number-of-islands), [Walls and Gates](/problem/walls-and-gates), [Max Area of Island](/problem/max-area-of-island)
