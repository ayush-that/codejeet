---
title: "How to Solve Range Sum Query 2D - Immutable — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Range Sum Query 2D - Immutable. Medium difficulty, 57.9% acceptance rate. Topics: Array, Design, Matrix, Prefix Sum."
date: "2027-05-29"
category: "dsa-patterns"
tags: ["range-sum-query-2d-immutable", "array", "design", "matrix", "medium"]
---

# How to Solve Range Sum Query 2D - Immutable

This problem asks us to design a class that can efficiently answer multiple queries about the sum of elements within any rectangular region of a 2D matrix. The challenge is that we need to handle many queries quickly—a brute force approach would be too slow for large matrices or many queries. The key insight is to precompute prefix sums, a technique that transforms an expensive O(k) query into an O(1) lookup.

## Visual Walkthrough

Let's work through a concrete example to build intuition. Consider this 3×4 matrix:

```
matrix = [
    [3, 0, 1, 4],
    [5, 6, 3, 2],
    [1, 2, 0, 1]
]
```

We want to answer queries like `sumRegion(1, 1, 2, 2)` which asks for the sum of elements from row 1, column 1 to row 2, column 2 (inclusive). That region contains:

- `matrix[1][1] = 6`
- `matrix[1][2] = 3`
- `matrix[2][1] = 2`
- `matrix[2][2] = 0`

The sum is `6 + 3 + 2 + 0 = 11`.

The naive approach would iterate through all 4 cells for each query. But what if we had 10,000 queries? We'd be doing 40,000 operations. Instead, we can precompute a **prefix sum matrix** where `prefix[i][j]` contains the sum of all elements from `(0,0)` to `(i-1,j-1)`.

For our example, the prefix sum matrix would be:

```
prefix = [
    [0, 0, 0, 0, 0],
    [0, 3, 3, 4, 8],
    [0, 8, 14, 18, 24],
    [0, 9, 17, 21, 28]
]
```

Notice we add an extra row and column of zeros to handle edge cases. Now to compute `sumRegion(1, 1, 2, 2)`:

1. Find the sum from origin to bottom-right: `prefix[3][3] = 21`
2. Subtract the left region: `prefix[3][1] = 9`
3. Subtract the top region: `prefix[1][3] = 4`
4. Add back the top-left region (subtracted twice): `prefix[1][1] = 3`

Result: `21 - 9 - 4 + 3 = 11`. This works because we're using the inclusion-exclusion principle on rectangular regions.

## Brute Force Approach

The most straightforward solution is to compute each query by iterating through every cell in the requested rectangle:

<div class="code-group">

```python
class NumMatrix:
    def __init__(self, matrix: List[List[int]]):
        # Simply store the matrix
        self.matrix = matrix

    def sumRegion(self, row1: int, col1: int, row2: int, col2: int) -> int:
        total = 0
        # Iterate through every cell in the rectangle
        for r in range(row1, row2 + 1):
            for c in range(col1, col2 + 1):
                total += self.matrix[r][c]
        return total
```

```javascript
class NumMatrix {
  constructor(matrix) {
    // Simply store the matrix
    this.matrix = matrix;
  }

  sumRegion(row1, col1, row2, col2) {
    let total = 0;
    // Iterate through every cell in the rectangle
    for (let r = row1; r <= row2; r++) {
      for (let c = col1; c <= col2; c++) {
        total += this.matrix[r][c];
      }
    }
    return total;
  }
}
```

```java
class NumMatrix {
    private int[][] matrix;

    public NumMatrix(int[][] matrix) {
        // Simply store the matrix
        this.matrix = matrix;
    }

    public int sumRegion(int row1, int col1, int row2, int col2) {
        int total = 0;
        // Iterate through every cell in the rectangle
        for (int r = row1; r <= row2; r++) {
            for (int c = col1; c <= col2; c++) {
                total += matrix[r][c];
            }
        }
        return total;
    }
}
```

</div>

**Why this fails:** Each query takes O(k) time where k is the number of cells in the rectangle. For an m×n matrix with q queries, worst-case time is O(q×m×n). If we have a 1000×1000 matrix and 10,000 queries, that's 10 billion operations—far too slow. We need to optimize query time to O(1) by doing more work upfront during initialization.

## Optimized Approach

The key insight is the **2D prefix sum** technique, also known as an **integral image**. We precompute a matrix where each cell `(i,j)` stores the sum of all elements from `(0,0)` to `(i-1,j-1)`. This allows us to compute any rectangular sum in O(1) time using the inclusion-exclusion principle.

Here's the step-by-step reasoning:

1. **Precomputation (O(m×n) time and space):**
   - Create a prefix sum matrix with dimensions `(m+1)×(n+1)` with an extra row and column of zeros
   - For each cell `(i,j)` in the original matrix, compute:
     ```
     prefix[i+1][j+1] = matrix[i][j] + prefix[i][j+1] + prefix[i+1][j] - prefix[i][j]
     ```
   - This formula says: current sum = current cell value + sum from top + sum from left - sum from top-left (which was counted twice)

2. **Query computation (O(1) time):**
   - Given rectangle `(row1, col1, row2, col2)`, we can compute:
     ```
     sum = prefix[row2+1][col2+1] - prefix[row1][col2+1] - prefix[row2+1][col1] + prefix[row1][col1]
     ```
   - Visual explanation: We take the sum to the bottom-right corner, subtract the left strip, subtract the top strip, then add back the top-left corner (which was subtracted twice)

The extra row and column of zeros handles edge cases cleanly—when `row1=0` or `col1=0`, we're subtracting zero from the prefix sums.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(m×n) for initialization, O(1) per query
# Space: O(m×n) for the prefix sum matrix
class NumMatrix:
    def __init__(self, matrix: List[List[int]]):
        if not matrix or not matrix[0]:
            # Handle empty matrix case
            self.prefix = [[0]]
            return

        m, n = len(matrix), len(matrix[0])
        # Create prefix sum matrix with extra row and column of zeros
        # prefix[i][j] = sum of all elements from matrix[0][0] to matrix[i-1][j-1]
        self.prefix = [[0] * (n + 1) for _ in range(m + 1)]

        # Build the prefix sum matrix
        for i in range(m):
            for j in range(n):
                # Current prefix sum = current cell value + sum from top + sum from left - sum from top-left
                # The - prefix[i][j] corrects for double counting
                self.prefix[i + 1][j + 1] = (
                    matrix[i][j] +
                    self.prefix[i][j + 1] +
                    self.prefix[i + 1][j] -
                    self.prefix[i][j]
                )

    def sumRegion(self, row1: int, col1: int, row2: int, col2: int) -> int:
        # Use inclusion-exclusion principle to compute rectangular sum
        # Bottom-right sum - left strip - top strip + top-left corner
        return (
            self.prefix[row2 + 1][col2 + 1] -
            self.prefix[row1][col2 + 1] -
            self.prefix[row2 + 1][col1] +
            self.prefix[row1][col1]
        )
```

```javascript
// Time: O(m×n) for initialization, O(1) per query
// Space: O(m×n) for the prefix sum matrix
class NumMatrix {
  constructor(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
      // Handle empty matrix case
      this.prefix = [[0]];
      return;
    }

    const m = matrix.length,
      n = matrix[0].length;
    // Create prefix sum matrix with extra row and column of zeros
    // prefix[i][j] = sum of all elements from matrix[0][0] to matrix[i-1][j-1]
    this.prefix = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    // Build the prefix sum matrix
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        // Current prefix sum = current cell value + sum from top + sum from left - sum from top-left
        // The - prefix[i][j] corrects for double counting
        this.prefix[i + 1][j + 1] =
          matrix[i][j] + this.prefix[i][j + 1] + this.prefix[i + 1][j] - this.prefix[i][j];
      }
    }
  }

  sumRegion(row1, col1, row2, col2) {
    // Use inclusion-exclusion principle to compute rectangular sum
    // Bottom-right sum - left strip - top strip + top-left corner
    return (
      this.prefix[row2 + 1][col2 + 1] -
      this.prefix[row1][col2 + 1] -
      this.prefix[row2 + 1][col1] +
      this.prefix[row1][col1]
    );
  }
}
```

```java
// Time: O(m×n) for initialization, O(1) per query
// Space: O(m×n) for the prefix sum matrix
class NumMatrix {
    private int[][] prefix;

    public NumMatrix(int[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            // Handle empty matrix case
            prefix = new int[][]{{0}};
            return;
        }

        int m = matrix.length, n = matrix[0].length;
        // Create prefix sum matrix with extra row and column of zeros
        // prefix[i][j] = sum of all elements from matrix[0][0] to matrix[i-1][j-1]
        prefix = new int[m + 1][n + 1];

        // Build the prefix sum matrix
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // Current prefix sum = current cell value + sum from top + sum from left - sum from top-left
                // The - prefix[i][j] corrects for double counting
                prefix[i + 1][j + 1] =
                    matrix[i][j] +
                    prefix[i][j + 1] +
                    prefix[i + 1][j] -
                    prefix[i][j];
            }
        }
    }

    public int sumRegion(int row1, int col1, int row2, int col2) {
        // Use inclusion-exclusion principle to compute rectangular sum
        // Bottom-right sum - left strip - top strip + top-left corner
        return
            prefix[row2 + 1][col2 + 1] -
            prefix[row1][col2 + 1] -
            prefix[row2 + 1][col1] +
            prefix[row1][col1];
    }
}
```

</div>

## Complexity Analysis

- **Time Complexity:**
  - **Initialization:** O(m×n) where m is the number of rows and n is the number of columns. We need to compute prefix sums for every cell.
  - **Each Query:** O(1) since we just perform 4 array lookups and 3 arithmetic operations.

- **Space Complexity:** O(m×n) for storing the prefix sum matrix. We need an (m+1)×(n+1) grid.

This is optimal because we must at least look at each element once during initialization (Ω(m×n)), and we can't answer queries faster than O(1) if we want to support arbitrary rectangular regions.

## Common Mistakes

1. **Off-by-one errors with indices:** The most common mistake is forgetting the extra row and column of zeros. Remember that `prefix[i][j]` represents the sum from `(0,0)` to `(i-1,j-1)`, not `(i,j)`. When computing queries, use `row2+1` and `col2+1` for the bottom-right corner.

2. **Not handling empty matrix:** If the input matrix is empty or has zero dimensions, your code should handle this gracefully. The solution above checks for this case and creates a minimal prefix matrix.

3. **Incorrect inclusion-exclusion formula:** Mixing up the addition and subtraction in the query formula. Remember the pattern: bottom-right minus left minus top plus top-left. A good mnemonic: "Add what you subtract twice."

4. **Using the original matrix dimensions for prefix:** Creating a prefix matrix of size m×n instead of (m+1)×(n+1) makes edge cases (queries starting at row 0 or column 0) much harder to handle.

## When You'll See This Pattern

The prefix sum (or cumulative sum) pattern appears whenever you need to answer many range queries on an array or matrix. It's a classic space-time tradeoff: spend more memory upfront to make queries faster.

Related problems that use similar techniques:

1. **Range Sum Query - Immutable (LeetCode 303):** The 1D version of this problem. Instead of a 2D prefix sum matrix, you use a 1D prefix sum array.

2. **Range Sum Query 2D - Mutable (LeetCode 308):** A harder version where the matrix can be updated. This requires more advanced data structures like Binary Indexed Trees (Fenwick Trees) or Segment Trees.

3. **Find the Grid of Region Average (LeetCode 3171):** Requires computing sums of rectangular regions to find averages, making prefix sums essential for efficiency.

4. **Maximum Side Length of a Square with Sum Less than or Equal to Threshold (LeetCode 1292):** Uses 2D prefix sums to quickly compute the sum of any square submatrix.

## Key Takeaways

1. **Prefix sums transform O(k) range queries into O(1) lookups** by precomputing cumulative sums. This is valuable when you have many queries on static data.

2. **The inclusion-exclusion principle** is key to extracting rectangular sums from prefix sums: `sum = bottomRight - left - top + topLeft`.

3. **Add buffer rows/columns of zeros** to handle edge cases cleanly. This small memory overhead simplifies the logic significantly.

4. **Recognize this pattern when:** You need to answer many range sum queries on an array/matrix, the data doesn't change between queries, and brute force would be too slow.

Related problems: [Range Sum Query - Immutable](/problem/range-sum-query-immutable), [Range Sum Query 2D - Mutable](/problem/range-sum-query-2d-mutable), [Find the Grid of Region Average](/problem/find-the-grid-of-region-average)
