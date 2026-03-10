---
title: "How to Solve Transform to Chessboard — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Transform to Chessboard. Hard difficulty, 51.2% acceptance rate. Topics: Array, Math, Bit Manipulation, Matrix."
date: "2029-10-17"
category: "dsa-patterns"
tags: ["transform-to-chessboard", "array", "math", "bit-manipulation", "hard"]
---

# How to Solve Transform to Chessboard

You're given an n×n binary grid where you can swap entire rows or entire columns. Your goal is to transform it into a chessboard pattern (alternating 0s and 1s) using the minimum number of swaps, or return -1 if impossible. What makes this problem tricky is that you can't change individual cells—only entire rows or columns—and you need to determine both feasibility and optimal moves mathematically.

## Visual Walkthrough

Let's trace through a 3×3 example:

```
Input board:
1 0 1
1 0 1
0 1 0
```

**Step 1: Understanding chessboard constraints**
A chessboard has two key properties:

1. Every row must be the opposite of the row above/below it
2. Every column must be the opposite of the column left/right of it

This means there are only two possible row patterns in a valid chessboard, and they're complements of each other.

**Step 2: Row pattern analysis**
Our rows are: `101`, `101`, `010`

- Row 1: `101`
- Row 2: `101` (same as row 1)
- Row 3: `010` (complement of `101`)

For a chessboard, we need exactly half the rows to be one pattern and half to be the other (or n/2 if n is even, or (n+1)/2 and (n-1)/2 if n is odd).

**Step 3: Column pattern analysis**
Our columns are: `110`, `001`, `110`

- Column 1: `110`
- Column 2: `001` (complement of `110`)
- Column 3: `110` (same as column 1)

Again, we need the same distribution property for columns.

**Step 4: Counting moves**
If we arrange rows so alternating rows have patterns `101` and `010`, we might need 1 row swap. Similarly for columns. The total moves would be row swaps + column swaps.

**Step 5: Verification**
After checking all conditions (which we'll formalize in the solution), this board is transformable. The minimum moves calculation involves trying both possible starting patterns (starting with `101` or `010`) and choosing the fewer swaps.

## Brute Force Approach

A naive approach would try all possible row and column permutations:

1. Generate all permutations of rows (n! possibilities)
2. For each row permutation, generate all column permutations (another n! possibilities)
3. Check if the resulting board is a chessboard
4. Count the number of swaps needed to achieve that permutation
5. Track the minimum

This is O((n!)² × n²) time complexity—completely infeasible even for small n. The key insight is that we don't need to try all permutations because:

- Only two row patterns are valid in a chessboard
- Swapping rows/columns doesn't change the set of rows/columns, just their order
- We can analyze the existing rows/columns mathematically

## Optimized Approach

The optimal solution uses mathematical reasoning:

**Key Insight 1: Row and column constraints**
For a board to be transformable into a chessboard:

1. All rows must be identical to the first row OR its bitwise complement
2. All columns must be identical to the first column OR its bitwise complement
3. The number of rows matching the first row must be either ⌈n/2⌉ or ⌊n/2⌋
4. Same for columns

**Key Insight 2: Moves calculation**
Once we verify the board is transformable:

- For rows: Count how many rows are in wrong positions for both possible starting patterns (starting with pattern A or pattern B)
- For columns: Same calculation
- The minimum total moves = min(row swaps for pattern A) + min(col swaps for pattern A) OR min(row swaps for pattern B) + min(col swaps for pattern B)

**Key Insight 3: Efficient representation**
We can represent each row as an integer using bit manipulation, making comparisons O(1) instead of O(n).

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n)
def movesToChessboard(board):
    n = len(board)

    # Step 1: Validate that all rows are either identical to first row or its complement
    first_row = board[0]
    first_row_comp = [1 - x for x in first_row]

    row_pattern_count = {0: 0, 1: 0}  # 0 for same as first row, 1 for complement
    row_patterns = []

    for r in range(n):
        if board[r] == first_row:
            row_patterns.append(0)
            row_pattern_count[0] += 1
        elif board[r] == first_row_comp:
            row_patterns.append(1)
            row_pattern_count[1] += 1
        else:
            return -1  # Invalid row pattern

    # Step 2: Validate row count distribution
    # For even n: must have exactly n/2 of each pattern
    # For odd n: must have (n+1)/2 of one pattern and (n-1)/2 of the other
    if n % 2 == 0:
        if row_pattern_count[0] != row_pattern_count[1]:
            return -1
    else:
        if abs(row_pattern_count[0] - row_pattern_count[1]) != 1:
            return -1

    # Step 3: Validate columns similarly
    first_col = [board[r][0] for r in range(n)]
    first_col_comp = [1 - x for x in first_col]

    col_pattern_count = {0: 0, 1: 0}
    col_patterns = []

    for c in range(n):
        col = [board[r][c] for r in range(n)]
        if col == first_col:
            col_patterns.append(0)
            col_pattern_count[0] += 1
        elif col == first_col_comp:
            col_patterns.append(1)
            col_pattern_count[1] += 1
        else:
            return -1

    # Step 4: Validate column count distribution
    if n % 2 == 0:
        if col_pattern_count[0] != col_pattern_count[1]:
            return -1
    else:
        if abs(col_pattern_count[0] - col_pattern_count[1]) != 1:
            return -1

    # Step 5: Calculate minimum row swaps
    # Try two possibilities: pattern starts with 0 or starts with 1
    def min_swaps(patterns, n):
        # Count mismatches if pattern should start with 0
        mismatches_start_0 = 0
        for i in range(n):
            expected = 0 if i % 2 == 0 else 1
            if patterns[i] != expected:
                mismatches_start_0 += 1

        # Count mismatches if pattern should start with 1
        mismatches_start_1 = 0
        for i in range(n):
            expected = 1 if i % 2 == 0 else 0
            if patterns[i] != expected:
                mismatches_start_1 += 1

        # Each swap fixes 2 mismatches, so divide by 2
        # Also, we can only use valid starting pattern based on n parity
        if n % 2 == 0:
            # For even n, both patterns are valid, choose minimum
            return min(mismatches_start_0, mismatches_start_1) // 2
        else:
            # For odd n, starting pattern is determined by majority count
            # If pattern 0 is majority, must start with 0
            # If pattern 1 is majority, must start with 1
            total_0 = sum(1 for p in patterns if p == 0)
            if total_0 * 2 > n:  # More 0s than 1s
                return mismatches_start_0 // 2
            else:
                return mismatches_start_1 // 2

    # Step 6: Calculate total moves
    row_moves = min_swaps(row_patterns, n)
    col_moves = min_swaps(col_patterns, n)

    return row_moves + col_moves
```

```javascript
// Time: O(n^2) | Space: O(n)
function movesToChessboard(board) {
  const n = board.length;

  // Helper to compare arrays
  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  // Step 1: Validate rows
  const firstRow = board[0];
  const firstRowComp = firstRow.map((x) => 1 - x);

  const rowPatterns = new Array(n);
  const rowPatternCount = [0, 0]; // index 0 for same as first row, 1 for complement

  for (let r = 0; r < n; r++) {
    if (arraysEqual(board[r], firstRow)) {
      rowPatterns[r] = 0;
      rowPatternCount[0]++;
    } else if (arraysEqual(board[r], firstRowComp)) {
      rowPatterns[r] = 1;
      rowPatternCount[1]++;
    } else {
      return -1; // Invalid row pattern
    }
  }

  // Step 2: Validate row distribution
  if (n % 2 === 0) {
    if (rowPatternCount[0] !== rowPatternCount[1]) return -1;
  } else {
    if (Math.abs(rowPatternCount[0] - rowPatternCount[1]) !== 1) return -1;
  }

  // Step 3: Validate columns
  const firstCol = new Array(n);
  for (let r = 0; r < n; r++) firstCol[r] = board[r][0];
  const firstColComp = firstCol.map((x) => 1 - x);

  const colPatterns = new Array(n);
  const colPatternCount = [0, 0];

  for (let c = 0; c < n; c++) {
    const col = new Array(n);
    for (let r = 0; r < n; r++) col[r] = board[r][c];

    if (arraysEqual(col, firstCol)) {
      colPatterns[c] = 0;
      colPatternCount[0]++;
    } else if (arraysEqual(col, firstColComp)) {
      colPatterns[c] = 1;
      colPatternCount[1]++;
    } else {
      return -1;
    }
  }

  // Step 4: Validate column distribution
  if (n % 2 === 0) {
    if (colPatternCount[0] !== colPatternCount[1]) return -1;
  } else {
    if (Math.abs(colPatternCount[0] - colPatternCount[1]) !== 1) return -1;
  }

  // Step 5: Calculate minimum swaps
  function minSwaps(patterns, n) {
    // Count mismatches if pattern starts with 0
    let mismatchesStart0 = 0;
    for (let i = 0; i < n; i++) {
      const expected = i % 2 === 0 ? 0 : 1;
      if (patterns[i] !== expected) mismatchesStart0++;
    }

    // Count mismatches if pattern starts with 1
    let mismatchesStart1 = 0;
    for (let i = 0; i < n; i++) {
      const expected = i % 2 === 0 ? 1 : 0;
      if (patterns[i] !== expected) mismatchesStart1++;
    }

    if (n % 2 === 0) {
      // Even n: choose minimum
      return Math.min(mismatchesStart0, mismatchesStart1) / 2;
    } else {
      // Odd n: starting pattern determined by majority
      const total0 = patterns.filter((p) => p === 0).length;
      if (total0 * 2 > n) {
        return mismatchesStart0 / 2;
      } else {
        return mismatchesStart1 / 2;
      }
    }
  }

  // Step 6: Calculate total moves
  const rowMoves = minSwaps(rowPatterns, n);
  const colMoves = minSwaps(colPatterns, n);

  return rowMoves + colMoves;
}
```

```java
// Time: O(n^2) | Space: O(n)
class Solution {
    public int movesToChessboard(int[][] board) {
        int n = board.length;

        // Step 1: Validate rows
        int[] firstRow = board[0];
        int[] firstRowComp = complement(firstRow);

        int[] rowPatterns = new int[n];
        int[] rowPatternCount = new int[2]; // 0 for same as first row, 1 for complement

        for (int r = 0; r < n; r++) {
            if (arraysEqual(board[r], firstRow)) {
                rowPatterns[r] = 0;
                rowPatternCount[0]++;
            } else if (arraysEqual(board[r], firstRowComp)) {
                rowPatterns[r] = 1;
                rowPatternCount[1]++;
            } else {
                return -1;
            }
        }

        // Step 2: Validate row distribution
        if (n % 2 == 0) {
            if (rowPatternCount[0] != rowPatternCount[1]) return -1;
        } else {
            if (Math.abs(rowPatternCount[0] - rowPatternCount[1]) != 1) return -1;
        }

        // Step 3: Validate columns
        int[] firstCol = new int[n];
        for (int r = 0; r < n; r++) firstCol[r] = board[r][0];
        int[] firstColComp = complement(firstCol);

        int[] colPatterns = new int[n];
        int[] colPatternCount = new int[2];

        for (int c = 0; c < n; c++) {
            int[] col = new int[n];
            for (int r = 0; r < n; r++) col[r] = board[r][c];

            if (arraysEqual(col, firstCol)) {
                colPatterns[c] = 0;
                colPatternCount[0]++;
            } else if (arraysEqual(col, firstColComp)) {
                colPatterns[c] = 1;
                colPatternCount[1]++;
            } else {
                return -1;
            }
        }

        // Step 4: Validate column distribution
        if (n % 2 == 0) {
            if (colPatternCount[0] != colPatternCount[1]) return -1;
        } else {
            if (Math.abs(colPatternCount[0] - colPatternCount[1]) != 1) return -1;
        }

        // Step 5: Calculate minimum swaps
        int rowMoves = minSwaps(rowPatterns, n);
        int colMoves = minSwaps(colPatterns, n);

        return rowMoves + colMoves;
    }

    private int[] complement(int[] arr) {
        int[] comp = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            comp[i] = 1 - arr[i];
        }
        return comp;
    }

    private boolean arraysEqual(int[] a, int[] b) {
        if (a.length != b.length) return false;
        for (int i = 0; i < a.length; i++) {
            if (a[i] != b[i]) return false;
        }
        return true;
    }

    private int minSwaps(int[] patterns, int n) {
        // Count mismatches if pattern starts with 0
        int mismatchesStart0 = 0;
        for (int i = 0; i < n; i++) {
            int expected = (i % 2 == 0) ? 0 : 1;
            if (patterns[i] != expected) mismatchesStart0++;
        }

        // Count mismatches if pattern starts with 1
        int mismatchesStart1 = 0;
        for (int i = 0; i < n; i++) {
            int expected = (i % 2 == 0) ? 1 : 0;
            if (patterns[i] != expected) mismatchesStart1++;
        }

        if (n % 2 == 0) {
            // Even n: choose minimum
            return Math.min(mismatchesStart0, mismatchesStart1) / 2;
        } else {
            // Odd n: starting pattern determined by majority
            int total0 = 0;
            for (int p : patterns) if (p == 0) total0++;

            if (total0 * 2 > n) {
                return mismatchesStart0 / 2;
            } else {
                return mismatchesStart1 / 2;
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We examine each cell once when validating rows and columns: O(n²)
- The minSwaps function runs in O(n) for rows and O(n) for columns
- Total: O(n²) + O(n) + O(n) = O(n²)

**Space Complexity: O(n)**

- We store row patterns array of size n
- We store column patterns array of size n
- We store first row and its complement (each size n)
- We store first column and its complement (each size n)
- Total: O(n) space (not O(n²) because we don't copy the entire board)

## Common Mistakes

1. **Not checking both row and column validity**: Candidates often validate rows but forget columns, or vice versa. Remember that both must satisfy the pattern constraints.

2. **Incorrect swap counting**: Forgetting that each swap fixes 2 mismatches (swapping two misplaced items puts both in correct positions), so you need to divide by 2.

3. **Wrong parity handling for odd n**: When n is odd, the starting pattern is determined by which pattern appears more frequently. Many candidates try both patterns and take the minimum, which is incorrect for odd n.

4. **Inefficient array comparisons**: Comparing rows/columns element-by-element each time gives O(n³) complexity. While our solution does this for clarity, in interviews you might optimize by representing rows as integers using bit manipulation.

## When You'll See This Pattern

This problem combines several patterns:

1. **Matrix constraints validation**: Similar to "Valid Sudoku" (LeetCode 36) where you check row, column, and subgrid constraints.

2. **Pattern matching with parity**: Like "Minimum Domino Rotations" (LeetCode 1007) where you check if all elements can match one of two patterns.

3. **Swap counting problems**: Similar to "Minimum Swaps to Arrange a Binary Grid" (LeetCode 1536) where you count swaps needed to achieve a pattern.

The core technique is recognizing that only certain configurations are possible given the constraints, then mathematically determining feasibility and optimal moves rather than searching through all possibilities.

## Key Takeaways

1. **Constraint analysis first**: Before attempting to solve, analyze what constraints the operations impose. Swapping entire rows/columns preserves the multiset of rows/columns, only changing their order.

2. **Parity matters**: For chessboard patterns with odd dimensions, the starting pattern is forced by the majority count. This is a common pattern in alternating sequence problems.

3. **Divide and conquer validation**: Validate rows and columns separately. If either fails, the entire transformation is impossible. This decomposition simplifies complex validation.

Related problems: [Minimum Moves to Get a Peaceful Board](/problem/minimum-moves-to-get-a-peaceful-board)
