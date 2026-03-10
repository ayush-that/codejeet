---
title: "How to Solve Valid Sudoku — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Valid Sudoku. Medium difficulty, 64.2% acceptance rate. Topics: Array, Hash Table, Matrix."
date: "2026-04-27"
category: "dsa-patterns"
tags: ["valid-sudoku", "array", "hash-table", "matrix", "medium"]
---

# How to Solve Valid Sudoku

The problem asks us to validate a 9×9 Sudoku board according to the standard Sudoku rules: each row, column, and 3×3 sub-box must contain digits 1-9 without repetition. Empty cells (marked '.') are ignored. What makes this problem interesting is that we need to check three different constraints simultaneously without solving the puzzle — we're only validating the current state. The challenge lies in efficiently tracking seen digits across rows, columns, and sub-boxes.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this partial board:

```
5 3 . | . 7 . | . . .
6 . . | 1 9 5 | . . .
. 9 8 | . . . | . 6 .
------+-------+------
8 . . | . 6 . | . . 3
4 . . | 8 . 3 | . . 1
7 . . | . 2 . | . . 6
------+-------+------
. 6 . | . . . | 2 8 .
. . . | 4 1 9 | . . 5
. . . | . 8 . | . 7 9
```

We need to check three things for each non-empty cell:

1. **Row check**: Has this digit appeared before in the same row?
2. **Column check**: Has this digit appeared before in the same column?
3. **Sub-box check**: Has this digit appeared before in the same 3×3 box?

Let's check cell (0,0) with value '5':

- Row 0: No other '5' in row 0 yet ✓
- Column 0: No other '5' in column 0 yet ✓
- Sub-box (0,0): The top-left 3×3 box contains cells (0,0)-(2,2). No other '5' in this box yet ✓

Now check cell (0,4) with value '7':

- Row 0: No other '7' in row 0 ✓
- Column 4: No other '7' in column 4 ✓
- Sub-box (0,1): This is the top-middle box. Need to calculate box index: `(row//3, col//3) = (0//3, 4//3) = (0,1)` ✓

The tricky part is efficiently tracking what we've seen. We could use three separate sets for each constraint type, but we need 9 sets for rows, 9 for columns, and 9 for boxes — that's 27 sets total.

## Brute Force Approach

A naive approach would be to check each constraint separately:

1. For each row, collect non-empty digits and check for duplicates
2. For each column, collect non-empty digits and check for duplicates
3. For each 3×3 box, collect non-empty digits and check for duplicates

This requires three separate passes through the board, each with nested loops. While this approach is conceptually simple and correct, it's inefficient because we're traversing the board three times (O(3×81) operations) and creating temporary collections for each check.

The brute force code would look like this in Python:

```python
def isValidSudoku(board):
    # Check rows
    for r in range(9):
        seen = set()
        for c in range(9):
            if board[r][c] != '.':
                if board[r][c] in seen:
                    return False
                seen.add(board[r][c])

    # Check columns
    for c in range(9):
        seen = set()
        for r in range(9):
            if board[r][c] != '.':
                if board[r][c] in seen:
                    return False
                seen.add(board[r][c])

    # Check 3x3 boxes
    for box_r in range(0, 9, 3):
        for box_c in range(0, 9, 3):
            seen = set()
            for r in range(box_r, box_r + 3):
                for c in range(box_c, box_c + 3):
                    if board[r][c] != '.':
                        if board[r][c] in seen:
                            return False
                        seen.add(board[r][c])

    return True
```

This works but is inefficient. We can do better with a single pass.

## Optimized Approach

The key insight is that we can check all three constraints in a single pass through the board. For each cell with a digit, we need to record that we've seen this digit in:

- The current row
- The current column
- The current 3×3 box

We need a way to uniquely identify each of these 27 "containers" (9 rows + 9 columns + 9 boxes). The clever part is how we identify boxes. Each 3×3 box can be indexed by `(row // 3, col // 3)`, but we need a single integer index. We can use: `box_index = (row // 3) * 3 + (col // 3)`.

For example:

- Cell (0,0): `(0//3)*3 + (0//3) = 0*3 + 0 = 0` (top-left box)
- Cell (0,4): `(0//3)*3 + (4//3) = 0*3 + 1 = 1` (top-middle box)
- Cell (4,0): `(4//3)*3 + (0//3) = 1*3 + 0 = 3` (middle-left box)
- Cell (8,8): `(8//3)*3 + (8//3) = 2*3 + 2 = 8` (bottom-right box)

Now we can use three arrays of sets (or arrays of boolean flags) to track seen digits:

- `rows[i]` tracks digits seen in row i
- `cols[j]` tracks digits seen in column j
- `boxes[k]` tracks digits seen in box k

For each cell `(i, j)` with digit `d`:

- If `d` is in `rows[i]`, return False (duplicate in row)
- If `d` is in `cols[j]`, return False (duplicate in column)
- If `d` is in `boxes[box_index]`, return False (duplicate in box)
- Otherwise, add `d` to all three sets

This approach visits each cell once and performs constant-time operations for each non-empty cell.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(1) - fixed 81 cells, but technically O(n²) for n×n board
# Space: O(1) - fixed 27 sets of max 9 elements each
def isValidSudoku(board):
    # Initialize 9 sets for rows, 9 for columns, and 9 for 3x3 boxes
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]

    # Iterate through every cell in the 9x9 board
    for i in range(9):
        for j in range(9):
            val = board[i][j]

            # Skip empty cells (marked with '.')
            if val == '.':
                continue

            # Calculate which 3x3 box this cell belongs to
            # (i//3) gives row index of box (0, 1, or 2)
            # (j//3) gives column index of box (0, 1, or 2)
            # Multiply row index by 3 to get box number: 0-2 become 0-6, 3-5 become 3-6, etc.
            box_index = (i // 3) * 3 + (j // 3)

            # Check if this value already exists in current row
            if val in rows[i]:
                return False
            # Check if this value already exists in current column
            if val in cols[j]:
                return False
            # Check if this value already exists in current 3x3 box
            if val in boxes[box_index]:
                return False

            # If all checks pass, add value to all three tracking sets
            rows[i].add(val)
            cols[j].add(val)
            boxes[box_index].add(val)

    # If we've checked all cells without finding duplicates, board is valid
    return True
```

```javascript
// Time: O(1) - fixed 81 cells, but technically O(n²) for n×n board
// Space: O(1) - fixed 27 sets of max 9 elements each
function isValidSudoku(board) {
  // Initialize 9 sets for rows, 9 for columns, and 9 for 3x3 boxes
  const rows = Array(9)
    .fill()
    .map(() => new Set());
  const cols = Array(9)
    .fill()
    .map(() => new Set());
  const boxes = Array(9)
    .fill()
    .map(() => new Set());

  // Iterate through every cell in the 9x9 board
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const val = board[i][j];

      // Skip empty cells (marked with '.')
      if (val === ".") {
        continue;
      }

      // Calculate which 3x3 box this cell belongs to
      // Math.floor(i/3) gives row index of box (0, 1, or 2)
      // Math.floor(j/3) gives column index of box (0, 1, or 2)
      // Multiply row index by 3 to get box number
      const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);

      // Check if this value already exists in current row
      if (rows[i].has(val)) {
        return false;
      }
      // Check if this value already exists in current column
      if (cols[j].has(val)) {
        return false;
      }
      // Check if this value already exists in current 3x3 box
      if (boxes[boxIndex].has(val)) {
        return false;
      }

      // If all checks pass, add value to all three tracking sets
      rows[i].add(val);
      cols[j].add(val);
      boxes[boxIndex].add(val);
    }
  }

  // If we've checked all cells without finding duplicates, board is valid
  return true;
}
```

```java
// Time: O(1) - fixed 81 cells, but technically O(n²) for n×n board
// Space: O(1) - fixed 27 sets of max 9 elements each
public boolean isValidSudoku(char[][] board) {
    // Initialize 9 sets for rows, 9 for columns, and 9 for 3x3 boxes
    Set<Character>[] rows = new HashSet[9];
    Set<Character>[] cols = new HashSet[9];
    Set<Character>[] boxes = new HashSet[9];

    for (int i = 0; i < 9; i++) {
        rows[i] = new HashSet<>();
        cols[i] = new HashSet<>();
        boxes[i] = new HashSet<>();
    }

    // Iterate through every cell in the 9x9 board
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            char val = board[i][j];

            // Skip empty cells (marked with '.')
            if (val == '.') {
                continue;
            }

            // Calculate which 3x3 box this cell belongs to
            // (i/3) gives row index of box (0, 1, or 2)
            // (j/3) gives column index of box (0, 1, or 2)
            // Multiply row index by 3 to get box number
            int boxIndex = (i / 3) * 3 + (j / 3);

            // Check if this value already exists in current row
            if (rows[i].contains(val)) {
                return false;
            }
            // Check if this value already exists in current column
            if (cols[j].contains(val)) {
                return false;
            }
            // Check if this value already exists in current 3x3 box
            if (boxes[boxIndex].contains(val)) {
                return false;
            }

            // If all checks pass, add value to all three tracking sets
            rows[i].add(val);
            cols[j].add(val);
            boxes[boxIndex].add(val);
        }
    }

    // If we've checked all cells without finding duplicates, board is valid
    return true;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1) for a 9×9 board since we always examine exactly 81 cells. More generally, for an n×n Sudoku board, it would be O(n²) because we visit each cell once.

**Space Complexity:** O(1) for fixed-size board. We use:

- 9 sets for rows, each holding at most 9 elements → 81 elements max
- 9 sets for columns → 81 elements max
- 9 sets for boxes → 81 elements max
  Total: O(3×81) = O(243) which is constant. For an n×n board, it would be O(n²) to store all the sets.

The constant factors are small because Sudoku has fixed size, but the algorithm scales quadratically with board size in the general case.

## Common Mistakes

1. **Incorrect box index calculation**: The most common error is using `(i % 3) * 3 + (j % 3)` instead of `(i // 3) * 3 + (j // 3)`. Remember: `//` gives which box, `%` gives position within box.

2. **Forgetting to skip empty cells**: Candidates sometimes try to add '.' to the sets, which causes incorrect duplicate detection or type errors. Always check for '.' before processing.

3. **Using arrays instead of sets for tracking**: While you could use boolean arrays `rows[i][digit]`, sets are cleaner. If using arrays, remember to convert char digit to int index: `int idx = val - '1'` (not `val - '0'` since digits are '1'-'9').

4. **Checking digits outside 1-9**: The problem guarantees input contains only digits 1-9 or '.', but in interviews, it's good to mention you'd validate this in production code.

## When You'll See This Pattern

This "multiple constraint tracking" pattern appears whenever you need to validate or enforce multiple simultaneous constraints on elements:

1. **Sudoku Solver (Hard)**: The validation function is a crucial component of the backtracking solver. You'll use the same validation logic repeatedly.

2. **N-Queens (Hard)**: Similar concept — need to track which rows, columns, and diagonals are occupied by queens. Instead of 3×3 boxes, you track two diagonal directions.

3. **Valid Anagram (Easy)**: While simpler, it uses the same "frequency counting" approach. For Sudoku, we're just checking boolean presence (seen/not seen) rather than counts.

4. **Word Search (Medium)**: When tracking visited cells during DFS, you're enforcing the constraint that each cell can only be used once in the current path — similar to "no repetition" rule.

## Key Takeaways

1. **Single-pass validation**: When checking multiple constraints, see if you can validate them all in one pass by maintaining parallel tracking structures. This often turns O(kn) into O(n) where k is the number of constraint types.

2. **Index transformation trick**: The `box_index = (row//3)*3 + (col//3)` formula is worth memorizing. Similar transformations appear in problems involving grid partitioning or mapping 2D coordinates to 1D indices.

3. **Set vs array trade-off**: Sets provide clean "contains" checks, but boolean arrays can be more memory-efficient for fixed, small domains (like digits 1-9). Know both approaches.

Related problems: [Sudoku Solver](/problem/sudoku-solver), [Check if Every Row and Column Contains All Numbers](/problem/check-if-every-row-and-column-contains-all-numbers)
