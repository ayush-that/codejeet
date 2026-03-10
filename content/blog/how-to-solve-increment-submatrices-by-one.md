---
title: "How to Solve Increment Submatrices by One — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Increment Submatrices by One. Medium difficulty, 73.8% acceptance rate. Topics: Array, Matrix, Prefix Sum."
date: "2027-05-03"
category: "dsa-patterns"
tags: ["increment-submatrices-by-one", "array", "matrix", "prefix-sum", "medium"]
---

# How to Solve Increment Submatrices by One

You're given an n×n matrix initially filled with zeros and a list of queries where each query asks you to increment all elements in a rectangular submatrix by 1. The challenge is to process all queries efficiently without actually iterating through every cell in every submatrix, which would be too slow for large inputs. This problem is interesting because it requires a clever optimization using prefix sums to handle range updates efficiently.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have a 3×3 matrix (n=3) and one query: `[[1,1,2,2]]`. This means we need to increment the submatrix from (1,1) to (2,2):

**Initial matrix:**

```
0 0 0
0 0 0
0 0 0
```

**After processing the query:**

```
0 0 0
0 1 1
0 1 1
```

Now let's add a second query: `[[0,0,1,1]]`. The naive approach would iterate through all cells in both submatrices:

**After second query:**

```
1 1 0
1 2 1
0 1 1
```

The problem becomes clear: with k queries, each covering up to n² cells, the naive O(k·n²) approach is too slow for n=500 and k=10⁵. We need a smarter way.

## Brute Force Approach

The most straightforward solution is to literally follow the problem description: for each query, iterate through every cell in the specified submatrix and increment it by 1.

<div class="code-group">

```python
# Time: O(k * n²) | Space: O(n²)
def brute_force(n, queries):
    # Initialize matrix with zeros
    mat = [[0] * n for _ in range(n)]

    # Process each query
    for r1, c1, r2, c2 in queries:
        # Iterate through every cell in the submatrix
        for r in range(r1, r2 + 1):
            for c in range(c1, c2 + 1):
                mat[r][c] += 1

    return mat
```

```javascript
// Time: O(k * n²) | Space: O(n²)
function bruteForce(n, queries) {
  // Initialize matrix with zeros
  const mat = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  // Process each query
  for (const [r1, c1, r2, c2] of queries) {
    // Iterate through every cell in the submatrix
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        mat[r][c]++;
      }
    }
  }

  return mat;
}
```

```java
// Time: O(k * n²) | Space: O(n²)
public int[][] bruteForce(int n, int[][] queries) {
    // Initialize matrix with zeros
    int[][] mat = new int[n][n];

    // Process each query
    for (int[] query : queries) {
        int r1 = query[0], c1 = query[1], r2 = query[2], c2 = query[3];

        // Iterate through every cell in the submatrix
        for (int r = r1; r <= r2; r++) {
            for (int c = c1; c <= c2; c++) {
                mat[r][c]++;
            }
        }
    }

    return mat;
}
```

</div>

**Why this fails:** With n up to 500 and k up to 10⁵, the worst-case time complexity is O(500² × 10⁵) = 25 × 10⁹ operations, which is far too slow. We need to optimize by avoiding the nested loops inside each query.

## Optimized Approach

The key insight is that we don't need to update every cell for each query. Instead, we can use a **difference array** technique extended to 2D. Here's the step-by-step reasoning:

1. **1D analogy:** In 1D, if we want to add 1 to all elements between indices `l` and `r`, we can use a difference array: increment `diff[l]` by 1 and decrement `diff[r+1]` by 1. After processing all queries, we compute the prefix sum to get the final array.

2. **Extending to 2D:** For a 2D submatrix from (r1,c1) to (r2,c2), we can:
   - Add 1 at (r1, c1)
   - Subtract 1 at (r1, c2+1)
   - Subtract 1 at (r2+1, c1)
   - Add 1 at (r2+1, c2+1)

3. **Why this works:** These four updates create a "checkerboard" pattern of +1 and -1. When we compute the 2D prefix sum, the +1 at (r1,c1) propagates to the entire submatrix, but the -1s cancel out the propagation beyond the boundaries.

4. **Processing:** We create a difference matrix `diff` of size (n+1)×(n+1) to handle boundary cases. For each query, we apply the four updates in O(1) time. After all queries, we compute the 2D prefix sum to get the final matrix.

## Optimal Solution

Here's the complete implementation using the 2D difference array technique:

<div class="code-group">

```python
# Time: O(n² + k) | Space: O(n²)
def rangeAddQueries(n, queries):
    # Create difference matrix with extra row and column for boundaries
    diff = [[0] * (n + 1) for _ in range(n + 1)]

    # Process each query in O(1) time
    for r1, c1, r2, c2 in queries:
        # Top-left corner: +1
        diff[r1][c1] += 1
        # Top-right corner (just outside): -1
        diff[r1][c2 + 1] -= 1
        # Bottom-left corner (just outside): -1
        diff[r2 + 1][c1] -= 1
        # Bottom-right corner (just outside): +1 to cancel the double subtraction
        diff[r2 + 1][c2 + 1] += 1

    # Initialize result matrix
    result = [[0] * n for _ in range(n)]

    # Compute 2D prefix sum to get final values
    for i in range(n):
        for j in range(n):
            # Current cell value is the prefix sum up to this point
            # diff[i][j] already contains contributions from all queries
            result[i][j] = diff[i][j]

            # Add contributions from above and left, subtract diagonal
            if i > 0:
                result[i][j] += result[i - 1][j]
            if j > 0:
                result[i][j] += result[i][j - 1]
            if i > 0 and j > 0:
                result[i][j] -= result[i - 1][j - 1]

    return result
```

```javascript
// Time: O(n² + k) | Space: O(n²)
function rangeAddQueries(n, queries) {
  // Create difference matrix with extra row and column for boundaries
  const diff = Array(n + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  // Process each query in O(1) time
  for (const [r1, c1, r2, c2] of queries) {
    // Top-left corner: +1
    diff[r1][c1] += 1;
    // Top-right corner (just outside): -1
    diff[r1][c2 + 1] -= 1;
    // Bottom-left corner (just outside): -1
    diff[r2 + 1][c1] -= 1;
    // Bottom-right corner (just outside): +1 to cancel the double subtraction
    diff[r2 + 1][c2 + 1] += 1;
  }

  // Initialize result matrix
  const result = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  // Compute 2D prefix sum to get final values
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // Current cell value is the prefix sum up to this point
      result[i][j] = diff[i][j];

      // Add contributions from above and left, subtract diagonal
      if (i > 0) {
        result[i][j] += result[i - 1][j];
      }
      if (j > 0) {
        result[i][j] += result[i][j - 1];
      }
      if (i > 0 && j > 0) {
        result[i][j] -= result[i - 1][j - 1];
      }
    }
  }

  return result;
}
```

```java
// Time: O(n² + k) | Space: O(n²)
public int[][] rangeAddQueries(int n, int[][] queries) {
    // Create difference matrix with extra row and column for boundaries
    int[][] diff = new int[n + 1][n + 1];

    // Process each query in O(1) time
    for (int[] query : queries) {
        int r1 = query[0], c1 = query[1], r2 = query[2], c2 = query[3];

        // Top-left corner: +1
        diff[r1][c1] += 1;
        // Top-right corner (just outside): -1
        diff[r1][c2 + 1] -= 1;
        // Bottom-left corner (just outside): -1
        diff[r2 + 1][c1] -= 1;
        // Bottom-right corner (just outside): +1 to cancel the double subtraction
        diff[r2 + 1][c2 + 1] += 1;
    }

    // Initialize result matrix
    int[][] result = new int[n][n];

    // Compute 2D prefix sum to get final values
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            // Current cell value is the prefix sum up to this point
            result[i][j] = diff[i][j];

            // Add contributions from above and left, subtract diagonal
            if (i > 0) {
                result[i][j] += result[i - 1][j];
            }
            if (j > 0) {
                result[i][j] += result[i][j - 1];
            }
            if (i > 0 && j > 0) {
                result[i][j] -= result[i - 1][j - 1];
            }
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n² + k)**

- Processing k queries takes O(k) time since we only do 4 operations per query
- Computing the 2D prefix sum takes O(n²) time since we iterate through all n×n cells
- The total is dominated by O(n²) when n is large

**Space Complexity: O(n²)**

- We need O((n+1)×(n+1)) ≈ O(n²) space for the difference matrix
- The result matrix also takes O(n²) space
- Total space is O(n²)

## Common Mistakes

1. **Off-by-one errors with boundaries:** Forgetting the `+1` when accessing `c2+1` and `r2+1` is the most common mistake. Remember: we're marking the cell _just outside_ the submatrix to cancel the increment. Always check your indices against the example.

2. **Using n×n instead of (n+1)×(n+1) for diff:** If you use an n×n difference matrix, you'll get index out of bounds when `c2 = n-1` or `r2 = n-1`. The extra row and column handle these boundary cases.

3. **Incorrect prefix sum calculation:** The order matters! You must compute `result[i][j] = diff[i][j]` first, then add contributions from above and left, then subtract the diagonal. Getting this wrong leads to incorrect propagation.

4. **Not handling the double subtraction properly:** When we subtract at both `(r1, c2+1)` and `(r2+1, c1)`, we subtract twice from the region beyond both boundaries. The `+1` at `(r2+1, c2+1)` corrects this double subtraction.

## When You'll See This Pattern

This 2D difference array technique appears whenever you need to perform multiple range updates on a matrix and then query the final state. It's essentially a 2D extension of the prefix sum/difference array pattern.

**Related problems:**

1. **Range Sum Query 2D - Mutable (304):** While this problem uses a different approach (Binary Indexed Tree), it deals with the same core challenge of efficiently updating and querying submatrices.
2. **Count Positions on Street With Required Brightness (2237):** This uses the 1D version of the same technique - marking start and end points of ranges.
3. **Car Pooling (1094):** Another 1D difference array problem where you mark where passengers get on and off.

## Key Takeaways

1. **Difference arrays transform range updates into point updates:** Instead of updating O(area) cells for each query, we update only O(1) cells in a difference matrix, then compute the final result with a prefix sum.

2. **The pattern generalizes to any dimension:** The technique works for 1D arrays (mark l and r+1), 2D matrices (four corners), and can be extended to higher dimensions with 2^d corner updates.

3. **Look for this pattern when:** You have multiple range updates followed by queries about the final state (not intermediate states). If you need to query intermediate states, you might need a Fenwick Tree or Segment Tree instead.

Related problems: [Range Sum Query 2D - Mutable](/problem/range-sum-query-2d-mutable), [Count Positions on Street With Required Brightness](/problem/count-positions-on-street-with-required-brightness)
