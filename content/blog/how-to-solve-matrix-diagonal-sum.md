---
title: "How to Solve Matrix Diagonal Sum — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Matrix Diagonal Sum. Easy difficulty, 84.2% acceptance rate. Topics: Array, Matrix."
date: "2027-05-04"
category: "dsa-patterns"
tags: ["matrix-diagonal-sum", "array", "matrix", "easy"]
---

# How to Solve Matrix Diagonal Sum

You're given a square matrix and need to return the sum of both diagonals, but without double-counting the center element when the matrix has odd dimensions. While this problem seems straightforward, the subtlety lies in correctly handling the overlap between the primary and secondary diagonals when the matrix has an odd number of rows/columns. This is a classic example of a problem where careful index manipulation matters more than algorithmic complexity.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this 3×3 matrix:

```
mat = [[1, 2, 3],
       [4, 5, 6],
       [7, 8, 9]]
```

**Primary diagonal**: Elements where row index equals column index

- (0,0) = 1
- (1,1) = 5
- (2,2) = 9
  Sum = 1 + 5 + 9 = 15

**Secondary diagonal**: Elements where row index + column index = n-1 (where n is matrix size)

- (0,2) = 3
- (1,1) = 5 (already counted in primary diagonal!)
- (2,0) = 7
  Sum = 3 + 7 = 10 (excluding the center 5)

**Total**: 15 + 10 = 25

Notice the problem: when the matrix has odd dimensions (3×3, 5×5, etc.), the center element lies on both diagonals. The problem statement explicitly says: "Only include the sum of all the elements on the primary diagonal and all the elements on the secondary diagonal that are not part of the primary diagonal." So we must subtract the center element once if we've counted it twice.

For an even-sized matrix like 4×4, there's no overlap, so we can simply sum both diagonals without adjustment.

## Brute Force Approach

A naive approach would be to iterate through the entire matrix and check for each element whether it belongs to either diagonal:

1. Initialize `total = 0`
2. For each element `mat[i][j]`:
   - If `i == j` (primary diagonal), add to total
   - If `i + j == n-1` (secondary diagonal), add to total
3. Return `total`

However, this approach has a critical flaw: it double-counts the center element in odd-sized matrices. We could fix this by subtracting the center element when we detect an odd-sized matrix, but this approach is still inefficient because we're examining every element in the matrix when we only need to look at the diagonal elements.

The brute force approach visits all n² elements, giving us O(n²) time complexity when we can solve this in O(n) time by only visiting the diagonal elements directly.

## Optimal Solution

The optimal approach visits only the necessary elements: we iterate through each row once, picking the two diagonal elements from that row. For the primary diagonal, element at position `(i, i)`. For the secondary diagonal, element at position `(i, n-1-i)`. We sum both, then subtract the center element if we double-counted it (when `n` is odd and `i == n-1-i`, which happens at the middle row).

<div class="code-group">

```python
# Time: O(n) where n is the number of rows/columns
# Space: O(1) - we only use a few variables
def diagonalSum(mat):
    """
    Calculate the sum of both diagonals of a square matrix.

    Args:
        mat: List[List[int]] - square matrix

    Returns:
        int - sum of primary and secondary diagonals
    """
    n = len(mat)  # Get matrix size (n x n)
    total = 0

    # Iterate through each row
    for i in range(n):
        # Add element from primary diagonal (row i, column i)
        total += mat[i][i]

        # Add element from secondary diagonal (row i, column n-1-i)
        total += mat[i][n - 1 - i]

    # If matrix has odd size, we double-counted the center element
    # Center element is at position (mid, mid) where mid = n // 2
    if n % 2 == 1:
        mid = n // 2
        total -= mat[mid][mid]  # Subtract the center element once

    return total
```

```javascript
// Time: O(n) where n is the number of rows/columns
// Space: O(1) - we only use a few variables
function diagonalSum(mat) {
  /**
   * Calculate the sum of both diagonals of a square matrix.
   *
   * @param {number[][]} mat - square matrix
   * @return {number} - sum of primary and secondary diagonals
   */
  const n = mat.length; // Get matrix size (n x n)
  let total = 0;

  // Iterate through each row
  for (let i = 0; i < n; i++) {
    // Add element from primary diagonal (row i, column i)
    total += mat[i][i];

    // Add element from secondary diagonal (row i, column n-1-i)
    total += mat[i][n - 1 - i];
  }

  // If matrix has odd size, we double-counted the center element
  // Center element is at position (mid, mid) where mid = Math.floor(n / 2)
  if (n % 2 === 1) {
    const mid = Math.floor(n / 2);
    total -= mat[mid][mid]; // Subtract the center element once
  }

  return total;
}
```

```java
// Time: O(n) where n is the number of rows/columns
// Space: O(1) - we only use a few variables
class Solution {
    public int diagonalSum(int[][] mat) {
        /**
         * Calculate the sum of both diagonals of a square matrix.
         *
         * @param mat - square matrix
         * @return sum of primary and secondary diagonals
         */
        int n = mat.length;  // Get matrix size (n x n)
        int total = 0;

        // Iterate through each row
        for (int i = 0; i < n; i++) {
            // Add element from primary diagonal (row i, column i)
            total += mat[i][i];

            // Add element from secondary diagonal (row i, column n-1-i)
            total += mat[i][n - 1 - i];
        }

        // If matrix has odd size, we double-counted the center element
        // Center element is at position (mid, mid) where mid = n / 2
        if (n % 2 == 1) {
            int mid = n / 2;
            total -= mat[mid][mid];  // Subtract the center element once
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n), where n is the number of rows (and columns) in the square matrix. We iterate through each row exactly once, performing constant-time operations for each row.

**Space Complexity**: O(1). We only use a fixed number of variables (`n`, `total`, `mid`, `i`) regardless of the input size. The input matrix is given and not counted toward our space usage.

The key insight is that we don't need to examine every element in the matrix—we can directly access the diagonal elements using their index relationships.

## Common Mistakes

1. **Forgetting to handle the center element in odd-sized matrices**: This is the most common mistake. Candidates sum both diagonals without realizing they've counted the center element twice. Always check if `n % 2 == 1` and subtract `mat[mid][mid]` once.

2. **Incorrect index calculation for secondary diagonal**: The secondary diagonal element in row `i` is at column `n-1-i`, not `n-i`. The `-1` is crucial because array indices are 0-based. For a 3×3 matrix, when `i=0`, we want column 2, which is `3-1-0 = 2`, not `3-0 = 3` (which would be out of bounds).

3. **Using nested loops unnecessarily**: Some candidates use nested `for` loops to iterate through all elements and check `if i == j or i + j == n-1`. This works but is less efficient (O(n²) vs O(n)) and more verbose than necessary.

4. **Assuming the matrix is always square**: While the problem states the input is a square matrix, in an interview you might want to mention this assumption or add a check: `if len(mat) != len(mat[0]): return -1` or similar error handling.

## When You'll See This Pattern

This diagonal traversal pattern appears in several matrix problems:

1. **Check if Matrix Is X-Matrix (LeetCode 2319)**: Requires checking if all elements on both diagonals are non-zero and all other elements are zero. The same diagonal index logic applies.

2. **Toeplitz Matrix (LeetCode 766)**: While not exactly the same, it involves checking diagonal relationships in a matrix (elements on the same diagonal have the same value).

3. **Diagonal Traverse (LeetCode 498)**: A more complex version where you need to traverse all diagonals of a matrix in zigzag order.

4. **Matrix Diagonal Sum variations**: Problems that ask for products of diagonals, differences between diagonals, or checking diagonal properties all use similar index arithmetic.

The core pattern is recognizing that for an n×n matrix:

- Primary diagonal: `(i, i)` for `i` from 0 to n-1
- Secondary diagonal: `(i, n-1-i)` for `i` from 0 to n-1
- They intersect when `i == n-1-i`, which simplifies to `i == (n-1)/2`, occurring only when n is odd.

## Key Takeaways

1. **Leverage index relationships**: In matrix problems, look for patterns in how indices relate. For diagonals, the relationship is simple arithmetic: `row == col` for primary, `row + col == n-1` for secondary.

2. **Handle edge cases systematically**: The center element overlap in odd-sized matrices is a classic edge case. Always test with both even and odd dimensions to catch this.

3. **Direct access beats conditional checking**: Instead of iterating through all elements and checking if they're on the diagonal, directly calculate and access diagonal elements using their index formulas. This reduces time complexity from O(n²) to O(n).

Related problems: [Check if Every Row and Column Contains All Numbers](/problem/check-if-every-row-and-column-contains-all-numbers), [Check if Matrix Is X-Matrix](/problem/check-if-matrix-is-x-matrix)
