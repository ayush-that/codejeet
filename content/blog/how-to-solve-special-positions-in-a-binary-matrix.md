---
title: "How to Solve Special Positions in a Binary Matrix — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Special Positions in a Binary Matrix. Easy difficulty, 68.8% acceptance rate. Topics: Array, Matrix."
date: "2026-06-27"
category: "dsa-patterns"
tags: ["special-positions-in-a-binary-matrix", "array", "matrix", "easy"]
---

# How to Solve Special Positions in a Binary Matrix

This problem asks us to count positions in a binary matrix where a cell contains `1`, and that `1` is the _only_ `1` in its entire row and column. While the concept is straightforward, the challenge lies in checking both row and column constraints efficiently without repeatedly scanning the entire matrix. The interesting part is balancing simplicity with performance—a brute force check for each `1` would be too slow for large matrices, so we need a smarter counting approach.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

```
mat = [
    [1, 0, 0],
    [0, 0, 1],
    [1, 0, 0]
]
```

We need to check each position with a `1`:

1. **Position (0,0)**: Value is `1`
   - Check row 0: Has `[1, 0, 0]` → only one `1` ✓
   - Check column 0: Has `[1, 0, 1]` → two `1`s ✗ (fails column check)

2. **Position (1,2)**: Value is `1`
   - Check row 1: Has `[0, 0, 1]` → only one `1` ✓
   - Check column 2: Has `[0, 1, 0]` → only one `1` ✓
   - This is a special position!

3. **Position (2,0)**: Value is `1`
   - Check row 2: Has `[1, 0, 0]` → only one `1` ✓
   - Check column 0: Has `[1, 0, 1]` → two `1`s ✗ (fails column check)

So for this matrix, we have exactly **1** special position at `(1,2)`.

The key insight: A position is special if it's the _only_ `1` in its row AND the _only_ `1` in its column. We need to check both conditions efficiently.

## Brute Force Approach

The most straightforward approach is to check every cell that contains a `1`:

1. For each cell `(i, j)` where `mat[i][j] == 1`:
2. Scan the entire row `i` to count how many `1`s it contains
3. Scan the entire column `j` to count how many `1`s it contains
4. If both counts equal `1`, increment our answer

This approach is intuitive but inefficient. For an `m × n` matrix with `k` ones, we would:

- For each `1`, scan its entire row (O(n) time)
- For each `1`, scan its entire column (O(m) time)
- Total time complexity: O(k × (m + n))

In the worst case where the matrix is filled with `1`s (k = m × n), this becomes O(m × n × (m + n)), which is too slow for large matrices. We need a way to precompute row and column counts to avoid repeated scanning.

## Optimal Solution

The optimal solution precomputes the count of `1`s in each row and each column, then checks each `1` cell against these precomputed counts. This approach transforms an O(m × n × (m + n)) solution into O(m × n) with O(m + n) extra space.

**Algorithm:**

1. Create two arrays: `rowCount` of size m and `colCount` of size n
2. First pass: Count `1`s in each row and column
3. Second pass: For each cell with value `1`, check if `rowCount[i] == 1` and `colCount[j] == 1`

<div class="code-group">

```python
# Time: O(m × n) | Space: O(m + n)
def numSpecial(mat):
    """
    Counts special positions in a binary matrix.
    A position (i, j) is special if mat[i][j] == 1 and
    it's the only 1 in row i and column j.
    """
    m, n = len(mat), len(mat[0])

    # Step 1: Precompute counts of 1s in each row and column
    row_count = [0] * m  # Tracks number of 1s in each row
    col_count = [0] * n  # Tracks number of 1s in each column

    # Count 1s in each row and column simultaneously
    for i in range(m):
        for j in range(n):
            if mat[i][j] == 1:
                row_count[i] += 1
                col_count[j] += 1

    # Step 2: Check each 1 cell against precomputed counts
    special_count = 0
    for i in range(m):
        for j in range(n):
            # Only check cells that are 1
            if mat[i][j] == 1:
                # A cell is special if it's the only 1 in its row AND column
                if row_count[i] == 1 and col_count[j] == 1:
                    special_count += 1

    return special_count
```

```javascript
// Time: O(m × n) | Space: O(m + n)
function numSpecial(mat) {
  /**
   * Counts special positions in a binary matrix.
   * A position (i, j) is special if mat[i][j] == 1 and
   * it's the only 1 in row i and column j.
   */
  const m = mat.length;
  const n = mat[0].length;

  // Step 1: Precompute counts of 1s in each row and column
  const rowCount = new Array(m).fill(0); // Tracks number of 1s in each row
  const colCount = new Array(n).fill(0); // Tracks number of 1s in each column

  // Count 1s in each row and column simultaneously
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (mat[i][j] === 1) {
        rowCount[i]++;
        colCount[j]++;
      }
    }
  }

  // Step 2: Check each 1 cell against precomputed counts
  let specialCount = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Only check cells that are 1
      if (mat[i][j] === 1) {
        // A cell is special if it's the only 1 in its row AND column
        if (rowCount[i] === 1 && colCount[j] === 1) {
          specialCount++;
        }
      }
    }
  }

  return specialCount;
}
```

```java
// Time: O(m × n) | Space: O(m + n)
class Solution {
    public int numSpecial(int[][] mat) {
        /**
         * Counts special positions in a binary matrix.
         * A position (i, j) is special if mat[i][j] == 1 and
         * it's the only 1 in row i and column j.
         */
        int m = mat.length;
        int n = mat[0].length;

        // Step 1: Precompute counts of 1s in each row and column
        int[] rowCount = new int[m];  // Tracks number of 1s in each row
        int[] colCount = new int[n];  // Tracks number of 1s in each column

        // Count 1s in each row and column simultaneously
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (mat[i][j] == 1) {
                    rowCount[i]++;
                    colCount[j]++;
                }
            }
        }

        // Step 2: Check each 1 cell against precomputed counts
        int specialCount = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // Only check cells that are 1
                if (mat[i][j] == 1) {
                    // A cell is special if it's the only 1 in its row AND column
                    if (rowCount[i] == 1 && colCount[j] == 1) {
                        specialCount++;
                    }
                }
            }
        }

        return specialCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- We make two passes through the entire matrix
- First pass: O(m × n) to count row and column sums
- Second pass: O(m × n) to check each cell against precomputed counts
- Total: O(2 × m × n) = O(m × n)

**Space Complexity:** O(m + n)

- We need two arrays: `rowCount` of size m and `colCount` of size n
- No other significant extra space is used
- This is optimal since we need to store counts for each row and column

## Common Mistakes

1. **Checking only the row or only the column**: Some candidates forget that both conditions must be satisfied. A cell must be the only `1` in BOTH its row AND its column.

2. **Inefficient repeated scanning**: The most common mistake is scanning the entire row and column for each `1` cell, resulting in O(k × (m + n)) time. Always look for opportunities to precompute information to avoid repeated work.

3. **Off-by-one errors with array indices**: When working with 2D arrays, it's easy to mix up row and column indices or exceed array bounds. Remember: `mat[i][j]` means row `i`, column `j`.

4. **Not handling edge cases**: While the problem guarantees a non-empty matrix, in interviews you should mention considering:
   - Empty matrix (0 rows or 0 columns)
   - Matrix with all zeros (no special positions)
   - Matrix with a single cell (if it's 1, it's special)

## When You'll See This Pattern

This problem uses the **precomputation pattern**—storing intermediate results to avoid repeated calculations. You'll see this pattern in many matrix and array problems:

1. **Difference Between Ones and Zeros in Row and Column (Medium)**: This problem builds directly on the same concept—you need row and column counts of ones to compute the difference matrix efficiently.

2. **Set Matrix Zeroes (Medium)**: Uses a similar approach of first marking which rows and columns need to be zeroed before making changes.

3. **Valid Sudoku (Medium)**: Uses precomputed sets or arrays to track which numbers appear in each row, column, and subgrid.

The key insight is recognizing when you need to check multiple constraints (row AND column) and that precomputing these constraints separately can dramatically improve efficiency.

## Key Takeaways

1. **Precomputation is powerful**: When you need to check multiple constraints for each element, consider precomputing those constraints first. This often transforms O(n²) or worse solutions into O(n) or O(n log n).

2. **Matrix problems often reduce to row/column operations**: Many matrix problems can be solved by thinking about row-wise and column-wise aggregates. Always ask: "Can I compute something for each row? For each column?"

3. **Two-pass solutions are common**: Don't try to do everything in one pass if it makes the logic complex. Often, one pass to gather information and another to use it leads to cleaner, more efficient code.

Related problems: [Difference Between Ones and Zeros in Row and Column](/problem/difference-between-ones-and-zeros-in-row-and-column)
