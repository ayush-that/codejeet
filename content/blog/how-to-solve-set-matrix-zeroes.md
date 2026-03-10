---
title: "How to Solve Set Matrix Zeroes — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Set Matrix Zeroes. Medium difficulty, 62.5% acceptance rate. Topics: Array, Hash Table, Matrix."
date: "2026-04-22"
category: "dsa-patterns"
tags: ["set-matrix-zeroes", "array", "hash-table", "matrix", "medium"]
---

# How to Solve Set Matrix Zeroes

You're given an `m x n` matrix of integers. Whenever you find a `0`, you need to set its entire row and all columns to `0`. The catch? You must do this **in place** — meaning you can't create a brand new matrix to store the result. This problem is tricky because if you start modifying the matrix immediately as you find zeros, you'll create new zeros that then get processed, causing the entire matrix to become zero. The challenge is to mark which rows and columns need to be zeroed without using those same rows and columns for storage.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Input matrix:
[1, 1, 1]
[1, 0, 1]
[1, 1, 1]
```

**Step 1:** We find a `0` at position `(1, 1)` (0-indexed: row 1, column 1).

**Step 2:** We need to set all of row 1 to `0` and all of column 1 to `0`.

**The naive approach would be:** Start setting zeros immediately. But watch what happens:

1. Set row 1 to zeros: `[1, 0, 1]` becomes `[0, 0, 0]`
2. Set column 1 to zeros: The middle column becomes `[1, 0, 1]` → `[0, 0, 0]`

But wait — we just created new zeros at positions `(0, 1)` and `(2, 1)`! If we're still scanning the matrix, we might process these new zeros and set their rows/columns to zero too, potentially zeroing the entire matrix.

**The key insight:** We need to **mark** which rows and columns should be zeroed **first**, then apply those changes **after** we've finished scanning. Let's see how:

1. Scan the entire matrix and note: row 1 needs to be zeroed, column 1 needs to be zeroed
2. Apply: Zero all cells in row 1
3. Apply: Zero all cells in column 1

Result:

```
[1, 0, 1]
[0, 0, 0]
[1, 0, 1]
```

Perfect! Now let's formalize this approach.

## Brute Force Approach

The most straightforward approach would be to create a copy of the matrix, scan the original, and whenever we find a zero in the original, set the entire row and column to zero in the copy. This avoids the problem of creating new zeros that get reprocessed.

**Why this fails:** The problem requires an **in-place** solution. While the copy approach would work technically, it uses O(m × n) extra space, which violates the spirit of the problem. In an interview, you'd be expected to find a more space-efficient solution.

Even if we consider a modified brute force where we try to process zeros immediately while scanning, we run into the issue shown in our visual walkthrough: we create new zeros that then get processed, potentially zeroing the entire matrix.

## Optimized Approach

The optimal solution uses the matrix itself to store information about which rows and columns need to be zeroed. Here's the step-by-step reasoning:

1. **First pass:** Scan the entire matrix to identify which rows and columns contain zeros.
2. **Storage challenge:** We need to remember this information without using extra O(m + n) space. The clever trick: use the **first row** to mark which columns need zeroing, and the **first column** to mark which rows need zeroing.
3. **Special handling:** Since cell `(0, 0)` is in both the first row and first column, we need separate variables to track whether the first row and first column themselves need to be zeroed.
4. **Second pass:** Use our markers to zero out the appropriate cells.

Let's walk through the algorithm:

**Step 1:** Check if the first row needs to be zeroed (store this in `first_row_zero`)
**Step 2:** Check if the first column needs to be zeroed (store this in `first_col_zero`)
**Step 3:** For each cell `(i, j)` where `i > 0` and `j > 0`, if it's zero, mark `matrix[i][0] = 0` and `matrix[0][j] = 0`
**Step 4:** Zero out cells based on markers (excluding first row and column)
**Step 5:** Zero out first row if needed
**Step 6:** Zero out first column if needed

This approach uses only O(1) extra space (just two boolean variables) while achieving O(m × n) time complexity.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(m × n) - we traverse the matrix multiple times but each is O(m × n)
# Space: O(1) - we only use two boolean variables for tracking
def setZeroes(matrix):
    """
    Modifies the matrix in-place: for any cell with value 0,
    sets its entire row and column to 0.
    """
    m, n = len(matrix), len(matrix[0])

    # Step 1: Check if first row and first column need to be zeroed
    # We need separate flags because cell (0,0) is shared
    first_row_zero = any(matrix[0][j] == 0 for j in range(n))
    first_col_zero = any(matrix[i][0] == 0 for i in range(m))

    # Step 2: Use first row and column as markers
    # For each cell (excluding first row/col), if it's zero,
    # mark its corresponding first row and first column cells
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0  # Mark this row (using first column)
                matrix[0][j] = 0  # Mark this column (using first row)

    # Step 3: Zero out cells based on markers (excluding first row/col)
    # If either the row marker or column marker is zero, set cell to zero
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0

    # Step 4: Zero out first row if needed
    if first_row_zero:
        for j in range(n):
            matrix[0][j] = 0

    # Step 5: Zero out first column if needed
    if first_col_zero:
        for i in range(m):
            matrix[i][0] = 0
```

```javascript
// Time: O(m × n) - we traverse the matrix multiple times but each is O(m × n)
// Space: O(1) - we only use two boolean variables for tracking
function setZeroes(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;

  // Step 1: Check if first row and first column need to be zeroed
  let firstRowZero = false;
  let firstColZero = false;

  // Check first row
  for (let j = 0; j < n; j++) {
    if (matrix[0][j] === 0) {
      firstRowZero = true;
      break;
    }
  }

  // Check first column
  for (let i = 0; i < m; i++) {
    if (matrix[i][0] === 0) {
      firstColZero = true;
      break;
    }
  }

  // Step 2: Use first row and column as markers
  // Mark rows and columns that need to be zeroed
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0; // Mark this row
        matrix[0][j] = 0; // Mark this column
      }
    }
  }

  // Step 3: Zero out cells based on markers (excluding first row/col)
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  // Step 4: Zero out first row if needed
  if (firstRowZero) {
    for (let j = 0; j < n; j++) {
      matrix[0][j] = 0;
    }
  }

  // Step 5: Zero out first column if needed
  if (firstColZero) {
    for (let i = 0; i < m; i++) {
      matrix[i][0] = 0;
    }
  }
}
```

```java
// Time: O(m × n) - we traverse the matrix multiple times but each is O(m × n)
// Space: O(1) - we only use two boolean variables for tracking
public void setZeroes(int[][] matrix) {
    int m = matrix.length;
    int n = matrix[0].length;

    // Step 1: Check if first row and first column need to be zeroed
    boolean firstRowZero = false;
    boolean firstColZero = false;

    // Check first row
    for (int j = 0; j < n; j++) {
        if (matrix[0][j] == 0) {
            firstRowZero = true;
            break;
        }
    }

    // Check first column
    for (int i = 0; i < m; i++) {
        if (matrix[i][0] == 0) {
            firstColZero = true;
            break;
        }
    }

    // Step 2: Use first row and column as markers
    // Mark rows and columns that need to be zeroed
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            if (matrix[i][j] == 0) {
                matrix[i][0] = 0;  // Mark this row
                matrix[0][j] = 0;  // Mark this column
            }
        }
    }

    // Step 3: Zero out cells based on markers (excluding first row/col)
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                matrix[i][j] = 0;
            }
        }
    }

    // Step 4: Zero out first row if needed
    if (firstRowZero) {
        for (int j = 0; j < n; j++) {
            matrix[0][j] = 0;
        }
    }

    // Step 5: Zero out first column if needed
    if (firstColZero) {
        for (int i = 0; i < m; i++) {
            matrix[i][0] = 0;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- We make four passes through the matrix (or portions of it):
  1. Checking first row and column: O(m + n)
  2. Marking rows/columns: O((m-1) × (n-1)) ≈ O(m × n)
  3. Zeroing based on markers: O((m-1) × (n-1)) ≈ O(m × n)
  4. Zeroing first row if needed: O(n)
  5. Zeroing first column if needed: O(m)
- Overall, this simplifies to O(m × n) since the dominant term is the matrix traversal.

**Space Complexity:** O(1)

- We only use two boolean variables (`first_row_zero` and `first_col_zero`).
- We reuse the first row and first column of the matrix itself for storage, so no additional arrays are needed.

## Common Mistakes

1. **Modifying while scanning:** The most common mistake is to start setting zeros immediately when you find one. This creates new zeros that then get processed, potentially zeroing the entire matrix. Always mark first, apply later.

2. **Forgetting to handle the first row/column separately:** Since cell `(0, 0)` is shared between the first row and first column, if you use it to mark both, you'll lose information. You need separate boolean flags to track whether the first row and first column themselves need zeroing.

3. **Incorrect marker usage:** When using the first row/column as markers, make sure you start scanning from `(1, 1)` not `(0, 0)`. If you include the first row/column in your marker-setting loop, you might overwrite the original values before you've checked them.

4. **Wrong order of operations:** Apply the zeroing to the main body of the matrix (excluding first row/col) first, then handle the first row and column. If you do it in reverse, your markers might get overwritten before you use them.

## When You'll See This Pattern

The technique of using existing data structures to store metadata appears in several matrix problems:

1. **Game of Life (Medium):** Similar pattern where you need to update cells based on their neighbors' states, but can't update immediately. You often use special values to represent "was dead, will be alive" or "was alive, will be dead" before making final updates.

2. **Rotate Image (Medium):** While not exactly the same, it also requires in-place manipulation of a matrix by using temporary variables and careful swapping.

3. **Valid Sudoku (Medium):** Uses similar marking techniques to track which numbers appear in rows, columns, and sub-boxes without using extra space proportional to the board size.

The core pattern is: **When you need to track information about rows/columns/cells but have space constraints, consider using the data structure itself to store that information with special markers or encodings.**

## Key Takeaways

1. **Mark then apply:** When modifying a data structure based on its current state, avoid making changes immediately if those changes could affect future decisions. First collect all necessary information, then apply changes.

2. **Reuse existing space:** When asked for an in-place algorithm with O(1) space, look for ways to use the input structure itself to store intermediate information. The first row/column, diagonal, or specific sentinel values are common choices.

3. **Handle boundaries carefully:** When using parts of the data structure for metadata storage, pay special attention to boundary cases (like the first row/column) that might need separate handling.

Related problems: [Game of Life](/problem/game-of-life), [Number of Laser Beams in a Bank](/problem/number-of-laser-beams-in-a-bank), [Minimum Operations to Remove Adjacent Ones in Matrix](/problem/minimum-operations-to-remove-adjacent-ones-in-matrix)
