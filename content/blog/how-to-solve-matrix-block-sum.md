---
title: "How to Solve Matrix Block Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Matrix Block Sum. Medium difficulty, 76.4% acceptance rate. Topics: Array, Matrix, Prefix Sum."
date: "2027-04-20"
category: "dsa-patterns"
tags: ["matrix-block-sum", "array", "matrix", "prefix-sum", "medium"]
---

# How to Solve Matrix Block Sum

Matrix Block Sum asks us to compute, for each cell in a matrix, the sum of all elements within a square "block" centered at that cell. The block extends `k` cells in all four directions, but must stay within the matrix bounds. What makes this problem interesting is that computing each sum independently would be extremely inefficient — we need a way to reuse computations across overlapping blocks. This is a classic application of **prefix sums in 2D**, a pattern that transforms O(k²) per-cell calculations into O(1) lookups.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider this 3×3 matrix with `k = 1`:

```
mat = [[1, 2, 3],
       [4, 5, 6],
       [7, 8, 9]]
```

For cell `(1,1)` (value 5, using 0-based indexing), we need the sum of all elements where:

- `r` ranges from `max(0, 1-1) = 0` to `min(2, 1+1) = 2`
- `c` ranges from `max(0, 1-1) = 0` to `min(2, 1+1) = 2`

This gives us the entire matrix! Sum = 1+2+3+4+5+6+7+8+9 = 45.

For cell `(0,0)` (value 1):

- `r` ranges from `max(0, 0-1) = 0` to `min(2, 0+1) = 1`
- `c` ranges from `max(0, 0-1) = 0` to `min(2, 0+1) = 1`

This gives us the top-left 2×2 block: 1+2+4+5 = 12.

Notice how these blocks overlap. The top-left 2×2 block is completely contained within the 3×3 block. If we computed sums independently, we'd be adding the same numbers multiple times. This observation leads us to prefix sums.

## Brute Force Approach

The most straightforward solution is to compute each answer cell independently by iterating through its k×k neighborhood:

For each cell `(i,j)` in the answer matrix:

1. Determine the valid bounds: `r1 = max(0, i-k)`, `r2 = min(m-1, i+k)`, `c1 = max(0, j-k)`, `c2 = min(n-1, j+k)`
2. Sum all elements from `mat[r1][c1]` to `mat[r2][c2]` by iterating through that submatrix

This approach is simple but inefficient. With `m` rows and `n` columns, we have `m×n` cells to compute. For each cell, we might iterate through up to `(2k+1)²` elements in the worst case. This gives us **O(m×n×k²)** time complexity, which becomes impractical for larger matrices or larger `k` values.

<div class="code-group">

```python
# Time: O(m * n * k²) | Space: O(1) excluding output
def matrixBlockSumBrute(mat, k):
    m, n = len(mat), len(mat[0])
    answer = [[0] * n for _ in range(m)]

    for i in range(m):
        for j in range(n):
            # Calculate bounds for the block
            r1 = max(0, i - k)
            r2 = min(m - 1, i + k)
            c1 = max(0, j - k)
            c2 = min(n - 1, j + k)

            # Sum all elements in the block
            total = 0
            for r in range(r1, r2 + 1):
                for c in range(c1, c2 + 1):
                    total += mat[r][c]

            answer[i][j] = total

    return answer
```

```javascript
// Time: O(m * n * k²) | Space: O(1) excluding output
function matrixBlockSumBrute(mat, k) {
  const m = mat.length,
    n = mat[0].length;
  const answer = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Calculate bounds for the block
      const r1 = Math.max(0, i - k);
      const r2 = Math.min(m - 1, i + k);
      const c1 = Math.max(0, j - k);
      const c2 = Math.min(n - 1, j + k);

      // Sum all elements in the block
      let total = 0;
      for (let r = r1; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
          total += mat[r][c];
        }
      }

      answer[i][j] = total;
    }
  }

  return answer;
}
```

```java
// Time: O(m * n * k²) | Space: O(1) excluding output
public int[][] matrixBlockSumBrute(int[][] mat, int k) {
    int m = mat.length, n = mat[0].length;
    int[][] answer = new int[m][n];

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            // Calculate bounds for the block
            int r1 = Math.max(0, i - k);
            int r2 = Math.min(m - 1, i + k);
            int c1 = Math.max(0, j - k);
            int c2 = Math.min(n - 1, j + k);

            // Sum all elements in the block
            int total = 0;
            for (int r = r1; r <= r2; r++) {
                for (int c = c1; c <= c2; c++) {
                    total += mat[r][c];
                }
            }

            answer[i][j] = total;
        }
    }

    return answer;
}
```

</div>

## Optimized Approach

The key insight is that we can precompute **2D prefix sums** to answer any rectangular sum query in O(1) time. Here's how it works:

1. **Prefix Sum Matrix**: Create a matrix `prefix` where `prefix[i][j]` represents the sum of all elements in the rectangle from `(0,0)` to `(i-1,j-1)`. We use `i-1` and `j-1` to handle boundaries more easily.

2. **Sum Query Formula**: The sum of elements in rectangle from `(r1,c1)` to `(r2,c2)` (inclusive) can be computed as:

   ```
   sum = prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1]
   ```

   This is the 2D equivalent of the 1D prefix sum formula: total - left - top + top-left (which was subtracted twice).

3. **Applying to Our Problem**: For each cell `(i,j)`, we compute:
   - `r1 = max(0, i-k)`
   - `r2 = min(m-1, i+k)`
   - `c1 = max(0, j-k)`
   - `c2 = min(n-1, j+k)`
     Then use the prefix sum formula to get the answer in O(1) time.

This approach transforms our solution from O(m×n×k²) to O(m×n) — we only need to build the prefix matrix once (O(m×n)) and then compute each answer in constant time.

## Optimal Solution

Here's the complete implementation using 2D prefix sums:

<div class="code-group">

```python
# Time: O(m * n) | Space: O(m * n)
def matrixBlockSum(mat, k):
    m, n = len(mat), len(mat[0])

    # Step 1: Create prefix sum matrix with extra row and column of zeros
    # prefix[i+1][j+1] = sum of mat[0..i][0..j]
    prefix = [[0] * (n + 1) for _ in range(m + 1)]

    # Build the prefix sum matrix
    for i in range(m):
        for j in range(n):
            # Current prefix = value at current cell + prefix above + prefix left - prefix diagonal (added twice)
            prefix[i + 1][j + 1] = mat[i][j] + prefix[i][j + 1] + prefix[i + 1][j] - prefix[i][j]

    # Step 2: Initialize answer matrix
    answer = [[0] * n for _ in range(m)]

    # Step 3: Compute each answer using prefix sums
    for i in range(m):
        for j in range(n):
            # Calculate bounds for the block, ensuring they stay within matrix
            r1 = max(0, i - k)
            r2 = min(m - 1, i + k)
            c1 = max(0, j - k)
            c2 = min(n - 1, j + k)

            # Use prefix sums to compute block sum in O(1)
            # Note: Add 1 to indices because prefix has an extra row/column
            total = (prefix[r2 + 1][c2 + 1] -  # Full rectangle from (0,0) to (r2,c2)
                     prefix[r1][c2 + 1] -       # Subtract rectangle above
                     prefix[r2 + 1][c1] +       # Subtract rectangle to the left
                     prefix[r1][c1])            # Add back top-left (subtracted twice)

            answer[i][j] = total

    return answer
```

```javascript
// Time: O(m * n) | Space: O(m * n)
function matrixBlockSum(mat, k) {
  const m = mat.length,
    n = mat[0].length;

  // Step 1: Create prefix sum matrix with extra row and column of zeros
  // prefix[i+1][j+1] = sum of mat[0..i][0..j]
  const prefix = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  // Build the prefix sum matrix
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Current prefix = value at current cell + prefix above + prefix left - prefix diagonal
      prefix[i + 1][j + 1] = mat[i][j] + prefix[i][j + 1] + prefix[i + 1][j] - prefix[i][j];
    }
  }

  // Step 2: Initialize answer matrix
  const answer = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  // Step 3: Compute each answer using prefix sums
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Calculate bounds for the block, ensuring they stay within matrix
      const r1 = Math.max(0, i - k);
      const r2 = Math.min(m - 1, i + k);
      const c1 = Math.max(0, j - k);
      const c2 = Math.min(n - 1, j + k);

      // Use prefix sums to compute block sum in O(1)
      // Note: Add 1 to indices because prefix has an extra row/column
      const total =
        prefix[r2 + 1][c2 + 1] - // Full rectangle from (0,0) to (r2,c2)
        prefix[r1][c2 + 1] - // Subtract rectangle above
        prefix[r2 + 1][c1] + // Subtract rectangle to the left
        prefix[r1][c1]; // Add back top-left (subtracted twice)

      answer[i][j] = total;
    }
  }

  return answer;
}
```

```java
// Time: O(m * n) | Space: O(m * n)
public int[][] matrixBlockSum(int[][] mat, int k) {
    int m = mat.length, n = mat[0].length;

    // Step 1: Create prefix sum matrix with extra row and column of zeros
    // prefix[i+1][j+1] = sum of mat[0..i][0..j]
    int[][] prefix = new int[m + 1][n + 1];

    // Build the prefix sum matrix
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            // Current prefix = value at current cell + prefix above + prefix left - prefix diagonal
            prefix[i + 1][j + 1] = mat[i][j] + prefix[i][j + 1] + prefix[i + 1][j] - prefix[i][j];
        }
    }

    // Step 2: Initialize answer matrix
    int[][] answer = new int[m][n];

    // Step 3: Compute each answer using prefix sums
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            // Calculate bounds for the block, ensuring they stay within matrix
            int r1 = Math.max(0, i - k);
            int r2 = Math.min(m - 1, i + k);
            int c1 = Math.max(0, j - k);
            int c2 = Math.min(n - 1, j + k);

            // Use prefix sums to compute block sum in O(1)
            // Note: Add 1 to indices because prefix has an extra row/column
            int total = prefix[r2 + 1][c2 + 1] -  // Full rectangle from (0,0) to (r2,c2)
                        prefix[r1][c2 + 1] -      // Subtract rectangle above
                        prefix[r2 + 1][c1] +      // Subtract rectangle to the left
                        prefix[r1][c1];           // Add back top-left (subtracted twice)

            answer[i][j] = total;
        }
    }

    return answer;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n)**

- Building the prefix sum matrix requires iterating through all `m×n` cells once: O(m×n)
- Computing each answer cell requires O(1) time using the prefix sums, and we have `m×n` cells: O(m×n)
- Total: O(m×n) + O(m×n) = O(m×n)

**Space Complexity: O(m×n)**

- We store the prefix sum matrix of size `(m+1)×(n+1)`: O(m×n)
- The output matrix is required by the problem: O(m×n)
- If we don't count the output (as is common in complexity analysis), the extra space is O(m×n) for the prefix matrix

## Common Mistakes

1. **Off-by-one errors in prefix sum indices**: The most common mistake is forgetting that `prefix[i][j]` represents the sum up to `(i-1, j-1)`. When computing rectangle sums, you need to add 1 to the bottom-right coordinates. Always test with a small example to verify your indices.

2. **Forgetting to handle matrix boundaries**: When computing `r1, r2, c1, c2`, candidates sometimes forget to use `max()` and `min()` to clamp values within `[0, m-1]` and `[0, n-1]`. This leads to index out of bounds errors.

3. **Incorrect prefix sum formula**: The formula `prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1]` must be memorized or derived correctly. A common error is subtracting `prefix[r1][c1]` instead of adding it back (remember: it was subtracted twice).

4. **Using the wrong size for prefix matrix**: The prefix matrix needs an extra row and column of zeros at the top and left. Creating it as `m×n` instead of `(m+1)×(n+1)` will cause index errors when `r1=0` or `c1=0`.

## When You'll See This Pattern

The 2D prefix sum technique appears whenever you need to compute sums of rectangular submatrices efficiently. Look for these clues in problems:

1. **Multiple rectangular sum queries**: When a problem asks for sums of many different rectangles in the same matrix.
2. **Fixed-size sliding windows in 2D**: Problems involving sums of fixed-size blocks or neighborhoods.
3. **Optimization problems**: Where you need to find maximum/minimum sum rectangles.

Related problems that use similar techniques:

- **Range Sum Query 2D - Immutable (LeetCode 304)**: Direct application of 2D prefix sums.
- **Max Sum of Rectangle No Larger Than K (LeetCode 363)**: Uses prefix sums combined with other techniques.
- **Count Square Submatrices with All Ones (LeetCode 1277)**: Can be solved with dynamic programming that has similarities to prefix sums.

## Key Takeaways

1. **2D prefix sums enable O(1) rectangular sum queries** after O(m×n) preprocessing. The formula `sum = prefix[br+1][bc+1] - prefix[tr][bc+1] - prefix[br+1][tc] + prefix[tr][tc]` (where (tr,tc) is top-left and (br,bc) is bottom-right) is essential to memorize.

2. **When you need sums of overlapping regions**, think prefix sums. If you find yourself computing sums that share many elements, prefix sums will likely optimize your solution.

3. **Always include an extra row and column of zeros** in your prefix matrix to handle boundary cases cleanly. This makes the formulas work consistently even when querying rectangles that start at row 0 or column 0.

Related problems: [Stamping the Grid](/problem/stamping-the-grid), [Maximum Sum of an Hourglass](/problem/maximum-sum-of-an-hourglass), [Design Neighbor Sum Service](/problem/design-neighbor-sum-service)
