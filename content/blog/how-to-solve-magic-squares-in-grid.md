---
title: "How to Solve Magic Squares In Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Magic Squares In Grid. Medium difficulty, 55.1% acceptance rate. Topics: Array, Hash Table, Math, Matrix."
date: "2028-07-10"
category: "dsa-patterns"
tags: ["magic-squares-in-grid", "array", "hash-table", "math", "medium"]
---

# How to Solve Magic Squares In Grid

This problem asks us to count how many 3×3 subgrids in a given matrix form a "magic square" — a 3×3 grid containing distinct numbers from 1 to 9 where all rows, columns, and both diagonals sum to the same value. What makes this problem interesting is that while it seems straightforward to check each 3×3 subgrid, there are several subtle constraints that candidates often miss: the numbers must be exactly 1-9 (no other values), all distinct, and arranged in the specific magic square pattern.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
Grid: [[4,3,8,4],
       [9,5,1,9],
       [2,7,6,2]]
```

We need to check all possible 3×3 subgrids. For a grid with dimensions R×C, there are (R-2)×(C-2) such subgrids.

**First subgrid (top-left):**

```
[4,3,8]
[9,5,1]
[2,7,6]
```

Let's check if this is a magic square:

1. **Numbers 1-9 check**: Contains 4,3,8,9,5,1,2,7,6 → all numbers 1-9 are present exactly once ✓
2. **Row sums**:
   - Row 1: 4+3+8 = 15
   - Row 2: 9+5+1 = 15
   - Row 3: 2+7+6 = 15
3. **Column sums**:
   - Col 1: 4+9+2 = 15
   - Col 2: 3+5+7 = 15
   - Col 3: 8+1+6 = 15
4. **Diagonal sums**:
   - Main diagonal: 4+5+6 = 15
   - Anti-diagonal: 8+5+2 = 15

All checks pass! This is a valid magic square.

**Second subgrid (top-right):**

```
[3,8,4]
[5,1,9]
[7,6,2]
```

Check numbers: 3,8,4,5,1,9,7,6,2 → all 1-9 present ✓
Row sums: 3+8+4=15, 5+1+9=15, 7+6+2=15 ✓
Column sums: 3+5+7=15, 8+1+6=15, 4+9+2=15 ✓
Diagonals: 3+1+2=6 (fails!), 4+1+7=12 (fails)

This is NOT a magic square because the diagonals don't sum to 15.

So for this example, the answer is 1.

## Brute Force Approach

The most straightforward approach is to:

1. Iterate through all possible top-left corners of 3×3 subgrids
2. For each subgrid, extract all 9 numbers
3. Check if they contain exactly the numbers 1-9 (each exactly once)
4. Check if all rows, columns, and diagonals sum to the same value

The naive implementation would check all 8 sums (3 rows + 3 columns + 2 diagonals) separately. However, there's a mathematical property we can use: in a 3×3 magic square with numbers 1-9, the common sum must be 15. Why? The sum of numbers 1 through 9 is 45, and since there are 3 rows that each sum to the same value, that value must be 45/3 = 15.

So we can simplify: instead of checking if all sums are equal, we can check if each sum equals 15.

**Why brute force is acceptable here:**
For an R×C grid, we check (R-2)×(C-2) subgrids. Each check involves examining 9 numbers and computing up to 8 sums. Since the grid dimensions are limited (in practice, R and C are at most 10 in test cases), this O(R×C) approach with constant work per subgrid is efficient enough. There's no need for a more complex optimization.

However, many candidates try to over-optimize or make the checking logic more complex than necessary. The key is writing clean, correct validation code.

## Optimized Approach

While the brute force is already optimal in terms of time complexity (we must examine each subgrid), we can optimize the implementation:

1. **Early rejection**: Check the center cell first. In any 3×3 magic square with numbers 1-9, the center must be 5. This allows us to skip many subgrids quickly.

2. **Bound checking**: Since we need distinct numbers 1-9, if any cell contains a number outside 1-9, we can immediately reject the subgrid.

3. **Efficient sum checking**: Instead of computing all 8 sums separately, we can compute them in a structured way and check as we go.

4. **Set validation for distinct 1-9**: Use a boolean array or set to ensure all numbers 1-9 appear exactly once.

The mathematical insight that saves computation: Once we verify all numbers are 1-9 and distinct, we only need to check:

- The two diagonals sum to 15
- The middle row and middle column sum to 15

Why is this sufficient? If the center is 5 and all numbers are distinct 1-9, and the middle row/column and both diagonals sum to 15, then the remaining rows and columns must also sum to 15 due to the properties of magic squares.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(R*C) where R=rows, C=cols | Space: O(1)
def numMagicSquaresInside(grid):
    """
    Counts the number of 3x3 magic squares in the given grid.
    A 3x3 magic square contains all numbers 1-9 exactly once,
    with all rows, columns, and diagonals summing to 15.
    """
    R, C = len(grid), len(grid[0])
    count = 0

    # Iterate through all possible top-left corners of 3x3 subgrids
    for r in range(R - 2):
        for c in range(C - 2):
            # Check if this 3x3 subgrid is a magic square
            if isMagic(grid, r, c):
                count += 1

    return count

def isMagic(grid, r, c):
    """
    Checks if the 3x3 subgrid starting at (r,c) is a magic square.
    """
    # Create a boolean array to track which numbers 1-9 we've seen
    seen = [False] * 10  # index 0 is unused, indices 1-9 track numbers

    # Check all 9 cells in the 3x3 subgrid
    for i in range(3):
        for j in range(3):
            num = grid[r + i][c + j]

            # Number must be between 1 and 9 inclusive
            if num < 1 or num > 9:
                return False

            # Number must not repeat
            if seen[num]:
                return False
            seen[num] = True

    # All numbers 1-9 must appear exactly once
    # Check if any number 1-9 is missing (should all be True)
    for num in range(1, 10):
        if not seen[num]:
            return False

    # Check row sums (all must be 15)
    row1 = grid[r][c] + grid[r][c+1] + grid[r][c+2]
    row2 = grid[r+1][c] + grid[r+1][c+1] + grid[r+1][c+2]
    row3 = grid[r+2][c] + grid[r+2][c+1] + grid[r+2][c+2]

    if not (row1 == row2 == row3 == 15):
        return False

    # Check column sums (all must be 15)
    col1 = grid[r][c] + grid[r+1][c] + grid[r+2][c]
    col2 = grid[r][c+1] + grid[r+1][c+1] + grid[r+2][c+1]
    col3 = grid[r][c+2] + grid[r+1][c+2] + grid[r+2][c+2]

    if not (col1 == col2 == col3 == 15):
        return False

    # Check diagonal sums (both must be 15)
    diag1 = grid[r][c] + grid[r+1][c+1] + grid[r+2][c+2]
    diag2 = grid[r][c+2] + grid[r+1][c+1] + grid[r+2][c]

    return diag1 == 15 and diag2 == 15
```

```javascript
// Time: O(R*C) where R=rows, C=cols | Space: O(1)
/**
 * Counts the number of 3x3 magic squares in the given grid.
 * A 3x3 magic square contains all numbers 1-9 exactly once,
 * with all rows, columns, and diagonals summing to 15.
 */
function numMagicSquaresInside(grid) {
  const R = grid.length,
    C = grid[0].length;
  let count = 0;

  // Iterate through all possible top-left corners of 3x3 subgrids
  for (let r = 0; r < R - 2; r++) {
    for (let c = 0; c < C - 2; c++) {
      // Check if this 3x3 subgrid is a magic square
      if (isMagic(grid, r, c)) {
        count++;
      }
    }
  }

  return count;
}

/**
 * Checks if the 3x3 subgrid starting at (r,c) is a magic square.
 */
function isMagic(grid, r, c) {
  // Create a boolean array to track which numbers 1-9 we've seen
  const seen = new Array(10).fill(false); // index 0 unused

  // Check all 9 cells in the 3x3 subgrid
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const num = grid[r + i][c + j];

      // Number must be between 1 and 9 inclusive
      if (num < 1 || num > 9) {
        return false;
      }

      // Number must not repeat
      if (seen[num]) {
        return false;
      }
      seen[num] = true;
    }
  }

  // All numbers 1-9 must appear exactly once
  for (let num = 1; num <= 9; num++) {
    if (!seen[num]) {
      return false;
    }
  }

  // Check row sums (all must be 15)
  const row1 = grid[r][c] + grid[r][c + 1] + grid[r][c + 2];
  const row2 = grid[r + 1][c] + grid[r + 1][c + 1] + grid[r + 1][c + 2];
  const row3 = grid[r + 2][c] + grid[r + 2][c + 1] + grid[r + 2][c + 2];

  if (!(row1 === 15 && row2 === 15 && row3 === 15)) {
    return false;
  }

  // Check column sums (all must be 15)
  const col1 = grid[r][c] + grid[r + 1][c] + grid[r + 2][c];
  const col2 = grid[r][c + 1] + grid[r + 1][c + 1] + grid[r + 2][c + 1];
  const col3 = grid[r][c + 2] + grid[r + 1][c + 2] + grid[r + 2][c + 2];

  if (!(col1 === 15 && col2 === 15 && col3 === 15)) {
    return false;
  }

  // Check diagonal sums (both must be 15)
  const diag1 = grid[r][c] + grid[r + 1][c + 1] + grid[r + 2][c + 2];
  const diag2 = grid[r][c + 2] + grid[r + 1][c + 1] + grid[r + 2][c];

  return diag1 === 15 && diag2 === 15;
}
```

```java
// Time: O(R*C) where R=rows, C=cols | Space: O(1)
class Solution {
    /**
     * Counts the number of 3x3 magic squares in the given grid.
     * A 3x3 magic square contains all numbers 1-9 exactly once,
     * with all rows, columns, and diagonals summing to 15.
     */
    public int numMagicSquaresInside(int[][] grid) {
        int R = grid.length, C = grid[0].length;
        int count = 0;

        // Iterate through all possible top-left corners of 3x3 subgrids
        for (int r = 0; r < R - 2; r++) {
            for (int c = 0; c < C - 2; c++) {
                // Check if this 3x3 subgrid is a magic square
                if (isMagic(grid, r, c)) {
                    count++;
                }
            }
        }

        return count;
    }

    /**
     * Checks if the 3x3 subgrid starting at (r,c) is a magic square.
     */
    private boolean isMagic(int[][] grid, int r, int c) {
        // Create a boolean array to track which numbers 1-9 we've seen
        boolean[] seen = new boolean[10]; // index 0 is unused

        // Check all 9 cells in the 3x3 subgrid
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                int num = grid[r + i][c + j];

                // Number must be between 1 and 9 inclusive
                if (num < 1 || num > 9) {
                    return false;
                }

                // Number must not repeat
                if (seen[num]) {
                    return false;
                }
                seen[num] = true;
            }
        }

        // All numbers 1-9 must appear exactly once
        for (int num = 1; num <= 9; num++) {
            if (!seen[num]) {
                return false;
            }
        }

        // Check row sums (all must be 15)
        int row1 = grid[r][c] + grid[r][c+1] + grid[r][c+2];
        int row2 = grid[r+1][c] + grid[r+1][c+1] + grid[r+1][c+2];
        int row3 = grid[r+2][c] + grid[r+2][c+1] + grid[r+2][c+2];

        if (!(row1 == 15 && row2 == 15 && row3 == 15)) {
            return false;
        }

        // Check column sums (all must be 15)
        int col1 = grid[r][c] + grid[r+1][c] + grid[r+2][c];
        int col2 = grid[r][c+1] + grid[r+1][c+1] + grid[r+2][c+1];
        int col3 = grid[r][c+2] + grid[r+1][c+2] + grid[r+2][c+2];

        if (!(col1 == 15 && col2 == 15 && col3 == 15)) {
            return false;
        }

        // Check diagonal sums (both must be 15)
        int diag1 = grid[r][c] + grid[r+1][c+1] + grid[r+2][c+2];
        int diag2 = grid[r][c+2] + grid[r+1][c+1] + grid[r+2][c];

        return diag1 == 15 && diag2 == 15;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(R×C)**

- We iterate through (R-2)×(C-2) possible top-left corners
- For each subgrid, we perform O(1) work: checking 9 cells, validating they're 1-9 and distinct, and computing 8 sums
- Even though we have nested loops, the inner work is constant, so overall O(R×C)

**Space Complexity: O(1)**

- We use a fixed-size boolean array of size 10 (or a set with at most 9 elements)
- No additional data structures that scale with input size
- The input grid is not counted toward space complexity

## Common Mistakes

1. **Forgetting the "distinct numbers 1-9" constraint**: Many candidates only check the sums but forget that a valid magic square must contain exactly the numbers 1 through 9, each exactly once. A subgrid with all sums equal to 15 but containing duplicates or numbers outside 1-9 is not valid.

2. **Incorrect bounds for subgrid iteration**: When iterating through top-left corners, the valid range is `0 to R-3` and `0 to C-3` (or `R-2` and `C-2` in exclusive upper bounds). Going up to `R-1` and `C-1` causes index out of bounds errors when accessing the 3×3 subgrid.

3. **Assuming the sum can be anything**: Some candidates check if all sums are equal but don't verify they equal 15. While mathematically any 3×3 magic square with numbers 1-9 must sum to 15, explicitly checking for 15 catches invalid configurations faster.

4. **Not checking all required sums**: Candidates sometimes check only rows, or only rows and columns, forgetting the diagonals. Both diagonals must also sum to 15 for a valid magic square.

## When You'll See This Pattern

This problem combines several patterns commonly seen in matrix problems:

1. **Sliding window over matrix**: Similar to problems like "Max Sum of Rectangle No Larger Than K" or "Count Square Submatrices with All Ones", where you examine all fixed-size submatrices.

2. **Constraint validation with early exit**: Like "Valid Sudoku" where you validate multiple constraints (rows, columns, subgrids) and can exit early when a violation is found.

3. **Fixed-size pattern matching**: Similar to "Image Overlap" or "Toeplitz Matrix" where you're checking if a subregion matches a specific pattern.

**Related problems:**

- **Largest Magic Square**: A direct generalization where you find the largest magic square (any size) in a grid.
- **Valid Sudoku**: Similar constraint checking in a 9×9 grid with 3×3 subgrids.
- **Toeplitz Matrix**: Checking if each diagonal from top-left to bottom-right has the same elements.

## Key Takeaways

1. **Break complex validation into simple checks**: Instead of one complex condition, check constraints separately: numbers 1-9, all distinct, row sums, column sums, diagonal sums. This makes code easier to write and debug.

2. **Use mathematical properties to simplify**: Knowing that the sum must be 15 (because 1+2+...+9 = 45 and 45/3 = 15) simplifies the checking logic significantly.

3. **Early exits improve efficiency**: Check the cheapest conditions first (like number range and duplicates) before computing sums. This avoids unnecessary computation for invalid subgrids.

4. **Fixed-size submatrix iteration is O(R×C)**: When checking all k×k submatrices in an R×C grid, the time complexity is O(R×C) if k is constant, not O(R×C×k²).

Related problems: [Largest Magic Square](/problem/largest-magic-square)
