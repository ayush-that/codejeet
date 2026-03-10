---
title: "How to Solve Check if Matrix Is X-Matrix — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check if Matrix Is X-Matrix. Easy difficulty, 66.4% acceptance rate. Topics: Array, Matrix."
date: "2028-01-03"
category: "dsa-patterns"
tags: ["check-if-matrix-is-x-matrix", "array", "matrix", "easy"]
---

# How to Solve "Check if Matrix Is X-Matrix"

This problem asks us to verify whether a square matrix follows the X-Matrix pattern: all diagonal elements must be non-zero, and all other elements must be zero. While conceptually straightforward, this problem tests your ability to navigate matrix indices correctly and handle boundary conditions efficiently. The challenge lies in identifying diagonal positions without overcomplicating the logic.

## Visual Walkthrough

Let's trace through a 3×3 example to build intuition:

```
Grid: [[2, 0, 1],
       [0, 4, 0],
       [7, 0, 6]]
```

For an X-Matrix:

1. **Main diagonal**: positions where row = column
   - (0,0) = 2 ✓ (non-zero)
   - (1,1) = 4 ✓ (non-zero)
   - (2,2) = 6 ✓ (non-zero)

2. **Anti-diagonal**: positions where row + column = n-1
   - (0,2) = 1 ✓ (non-zero)
   - (1,1) = 4 ✓ (already checked)
   - (2,0) = 7 ✓ (non-zero)

3. **All other positions** must be zero:
   - (0,1) = 0 ✓
   - (1,0) = 0 ✓
   - (1,2) = 0 ✓
   - (2,1) = 0 ✓

Since all diagonal elements are non-zero and all other elements are zero, this is a valid X-Matrix.

The key insight: for each cell (i, j), check if it's on either diagonal. If yes, verify it's non-zero. If no, verify it's zero.

## Brute Force Approach

A naive approach would be to first collect all diagonal positions, then verify them separately from non-diagonal positions. This requires:

1. Creating a set of diagonal coordinates
2. Iterating through the matrix twice: once for diagonal validation, once for non-diagonal validation

While this works, it's inefficient in both time and space. We need O(n²) time to iterate and O(n) space to store diagonal positions. More importantly, this approach overcomplicates a problem that can be solved with a single pass.

What some candidates might try (and fail with):

- Checking only the main diagonal, forgetting the anti-diagonal
- Using incorrect index calculations for the anti-diagonal
- Creating complex conditional logic that's hard to debug

## Optimal Solution

The optimal solution uses a single pass through the matrix. For each cell, we determine if it's on a diagonal using simple index arithmetic, then check the appropriate condition. This approach is O(n²) time and O(1) space.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def checkXMatrix(grid):
    """
    Check if a square matrix is an X-Matrix.
    Diagonal elements must be non-zero, all others must be zero.
    """
    n = len(grid)  # Get matrix size

    # Iterate through all rows
    for i in range(n):
        # Iterate through all columns in current row
        for j in range(n):
            # Check if current position is on either diagonal
            # Main diagonal: i == j
            # Anti-diagonal: i + j == n - 1
            if i == j or i + j == n - 1:
                # On diagonal: must be non-zero
                if grid[i][j] == 0:
                    return False
            else:
                # Not on diagonal: must be zero
                if grid[i][j] != 0:
                    return False

    # All checks passed
    return True
```

```javascript
// Time: O(n²) | Space: O(1)
function checkXMatrix(grid) {
  /**
   * Check if a square matrix is an X-Matrix.
   * Diagonal elements must be non-zero, all others must be zero.
   */
  const n = grid.length; // Get matrix size

  // Iterate through all rows
  for (let i = 0; i < n; i++) {
    // Iterate through all columns in current row
    for (let j = 0; j < n; j++) {
      // Check if current position is on either diagonal
      // Main diagonal: i === j
      // Anti-diagonal: i + j === n - 1
      if (i === j || i + j === n - 1) {
        // On diagonal: must be non-zero
        if (grid[i][j] === 0) {
          return false;
        }
      } else {
        // Not on diagonal: must be zero
        if (grid[i][j] !== 0) {
          return false;
        }
      }
    }
  }

  // All checks passed
  return true;
}
```

```java
// Time: O(n²) | Space: O(1)
class Solution {
    public boolean checkXMatrix(int[][] grid) {
        /**
         * Check if a square matrix is an X-Matrix.
         * Diagonal elements must be non-zero, all others must be zero.
         */
        int n = grid.length;  // Get matrix size

        // Iterate through all rows
        for (int i = 0; i < n; i++) {
            // Iterate through all columns in current row
            for (int j = 0; j < n; j++) {
                // Check if current position is on either diagonal
                // Main diagonal: i == j
                // Anti-diagonal: i + j == n - 1
                if (i == j || i + j == n - 1) {
                    // On diagonal: must be non-zero
                    if (grid[i][j] == 0) {
                        return false;
                    }
                } else {
                    // Not on diagonal: must be zero
                    if (grid[i][j] != 0) {
                        return false;
                    }
                }
            }
        }

        // All checks passed
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We iterate through every cell in the n×n matrix exactly once
- Each iteration performs constant-time operations (comparisons and arithmetic)
- Total operations: n × n = n²

**Space Complexity: O(1)**

- We only use a few integer variables (n, i, j)
- No additional data structures that scale with input size
- The input matrix itself is not counted toward space complexity

## Common Mistakes

1. **Forgetting the center element in odd-sized matrices**: In matrices with odd dimensions (like 3×3 or 5×5), the center element belongs to both diagonals. Some candidates might check it twice or implement logic that excludes it from one diagonal. Our solution handles this correctly because the condition `i == j or i + j == n - 1` includes the center element in both cases.

2. **Incorrect anti-diagonal calculation**: The anti-diagonal condition is `i + j == n - 1`, not `i + j == n` or `j == n - i - 1` (though the last one is mathematically equivalent but less intuitive). A good way to verify: for a 3×3 matrix, positions (0,2), (1,1), and (2,0) should satisfy the condition.

3. **Early return on success**: Some candidates might return `True` as soon as they find a valid diagonal element, but we need to check ALL elements. We only return early when we find a violation.

4. **Not handling the "both diagonals" requirement**: The problem states "elements in the diagonals" (plural), meaning both main and anti-diagonals. Some candidates check only one diagonal.

## When You'll See This Pattern

This matrix traversal pattern appears in several common interview problems:

1. **Matrix Diagonal Sum (LeetCode 1572)**: Very similar problem where you sum diagonal elements, requiring the same diagonal identification logic.

2. **Toeplitz Matrix (LeetCode 766)**: Checks if every diagonal from top-left to bottom-right has the same elements, requiring diagonal traversal but with different comparison logic.

3. **Rotate Image (LeetCode 48)**: While more complex, it also requires understanding matrix indices and how elements relate to diagonals during rotation.

The core pattern is **matrix index arithmetic** - using row and column indices to identify specific patterns or relationships within a matrix. This skill is fundamental for any matrix manipulation problem.

## Key Takeaways

1. **Diagonal identification is about index relationships**: Main diagonal = same indices, anti-diagonal = indices summing to n-1. This simple pattern works for any square matrix.

2. **Single-pass validation is often optimal**: When checking conditions on all elements, you can usually validate as you go rather than collecting data first. This saves both time and space.

3. **Matrix problems often test attention to detail**: Small errors in index calculations or boundary conditions can cause complete failure. Always test with small examples (1×1, 2×2, 3×3) to verify edge cases.

Related problems: [Matrix Diagonal Sum](/problem/matrix-diagonal-sum)
