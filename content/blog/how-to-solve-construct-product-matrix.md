---
title: "How to Solve Construct Product Matrix — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Construct Product Matrix. Medium difficulty, 32.1% acceptance rate. Topics: Array, Matrix, Prefix Sum."
date: "2030-01-20"
category: "dsa-patterns"
tags: ["construct-product-matrix", "array", "matrix", "prefix-sum", "medium"]
---

# How to Solve Construct Product Matrix

This problem asks us to create a product matrix where each element `p[i][j]` equals the product of all elements in the original matrix except `grid[i][j]`. The challenge is that we need to compute this efficiently for potentially large matrices (up to 10⁵ total elements) without using division operations. This is essentially the 2D version of the classic "Product of Array Except Self" problem.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this 2×3 matrix:

```
grid = [[1, 2, 3],
        [4, 5, 6]]
```

We need to compute `p[i][j]` as the product of all elements except `grid[i][j]`. For example:

- `p[0][0]` = product of all elements except `grid[0][0]` (which is 1) = 2 × 3 × 4 × 5 × 6 = 720
- `p[0][1]` = product of all elements except `grid[0][1]` (which is 2) = 1 × 3 × 4 × 5 × 6 = 360
- `p[1][2]` = product of all elements except `grid[1][2]` (which is 6) = 1 × 2 × 3 × 4 × 5 = 120

The brute force approach would compute each product independently, but that's O(n²m²) time. The key insight is that we can compute the total product once, then for each cell, divide by that cell's value. However, the problem explicitly states we cannot use division (and division by zero would be problematic anyway).

Instead, we can adapt the prefix/suffix product technique from the 1D version. In 1D, for an array `[a, b, c, d]`, we compute:

- Prefix products: `[1, a, a×b, a×b×c]`
- Suffix products: `[b×c×d, c×d, d, 1]`
- Result: `[b×c×d, a×c×d, a×b×d, a×b×c]`

For 2D, we can flatten the matrix and apply the same technique, but we need to be careful with modulo operations since products can get very large.

## Brute Force Approach

The most straightforward approach is to compute each product independently:

For each cell `(i, j)`:

1. Initialize `product = 1`
2. Iterate through all cells `(x, y)` in the matrix
3. If `(x, y) != (i, j)`, multiply `product` by `grid[x][y]`
4. Store `product % 12345` in `p[i][j]`

This approach has O((n×m)²) time complexity, which is far too slow for the constraints (n×m up to 10⁵ would mean up to 10¹⁰ operations).

<div class="code-group">

```python
# Time: O((n*m)^2) | Space: O(1) excluding output
def constructProductMatrix_brute(grid):
    n = len(grid)
    m = len(grid[0])
    MOD = 12345

    # Initialize result matrix
    p = [[0] * m for _ in range(n)]

    for i in range(n):
        for j in range(m):
            product = 1
            # Compute product of all elements except grid[i][j]
            for x in range(n):
                for y in range(m):
                    if x == i and y == j:
                        continue
                    product = (product * grid[x][y]) % MOD
            p[i][j] = product

    return p
```

```javascript
// Time: O((n*m)^2) | Space: O(1) excluding output
function constructProductMatrixBrute(grid) {
  const n = grid.length;
  const m = grid[0].length;
  const MOD = 12345;

  // Initialize result matrix
  const p = new Array(n);
  for (let i = 0; i < n; i++) {
    p[i] = new Array(m).fill(0);
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      let product = 1;
      // Compute product of all elements except grid[i][j]
      for (let x = 0; x < n; x++) {
        for (let y = 0; y < m; y++) {
          if (x === i && y === j) continue;
          product = (product * grid[x][y]) % MOD;
        }
      }
      p[i][j] = product;
    }
  }

  return p;
}
```

```java
// Time: O((n*m)^2) | Space: O(1) excluding output
public int[][] constructProductMatrixBrute(int[][] grid) {
    int n = grid.length;
    int m = grid[0].length;
    final int MOD = 12345;

    // Initialize result matrix
    int[][] p = new int[n][m];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            long product = 1;  // Use long to avoid overflow
            // Compute product of all elements except grid[i][j]
            for (int x = 0; x < n; x++) {
                for (int y = 0; y < m; y++) {
                    if (x == i && y == j) continue;
                    product = (product * grid[x][y]) % MOD;
                }
            }
            p[i][j] = (int) product;
        }
    }

    return p;
}
```

</div>

## Optimized Approach

The key insight is that we can compute the total product of all elements, then for each cell, compute the product of all elements except that cell by dividing the total product by the cell's value. However, since we cannot use division (and division modulo a non-prime number is tricky), we need a different approach.

We can adapt the prefix/suffix product technique from the 1D "Product of Array Except Self" problem to 2D by treating the matrix as a flattened array. Here's the step-by-step reasoning:

1. **Flatten the matrix**: Convert the 2D matrix to a 1D array. This allows us to apply the 1D technique directly.
2. **Compute prefix products**: For each position `k` in the flattened array, compute the product of all elements before position `k`.
3. **Compute suffix products**: For each position `k`, compute the product of all elements after position `k`.
4. **Combine results**: For each position `k`, the product except self is `prefix[k] * suffix[k]`.
5. **Map back to 2D**: Convert the 1D result array back to a 2D matrix.

The time complexity becomes O(n×m) instead of O((n×m)²), which is efficient enough for the constraints.

## Optimal Solution

Here's the complete implementation using the prefix/suffix product technique:

<div class="code-group">

```python
# Time: O(n*m) | Space: O(n*m)
def constructProductMatrix(grid):
    n = len(grid)
    m = len(grid[0])
    MOD = 12345

    # Flatten the matrix to 1D array
    flat = []
    for i in range(n):
        for j in range(m):
            flat.append(grid[i][j] % MOD)  # Apply modulo early to avoid large numbers

    total = len(flat)

    # Step 1: Compute prefix products
    # prefix[i] = product of all elements before index i
    prefix = [1] * (total + 1)  # +1 for easier indexing
    for i in range(total):
        prefix[i + 1] = (prefix[i] * flat[i]) % MOD

    # Step 2: Compute suffix products
    # suffix[i] = product of all elements after index i
    suffix = [1] * (total + 1)
    for i in range(total - 1, -1, -1):
        suffix[i] = (suffix[i + 1] * flat[i]) % MOD

    # Step 3: Compute result for each position
    # result[i] = prefix[i] * suffix[i+1] (product before i * product after i)
    result_flat = [0] * total
    for i in range(total):
        # prefix[i] gives product of elements before i
        # suffix[i+1] gives product of elements after i
        result_flat[i] = (prefix[i] * suffix[i + 1]) % MOD

    # Step 4: Convert back to 2D matrix
    p = [[0] * m for _ in range(n)]
    for i in range(n):
        for j in range(m):
            idx = i * m + j  # Convert 2D index to 1D index
            p[i][j] = result_flat[idx]

    return p
```

```javascript
// Time: O(n*m) | Space: O(n*m)
function constructProductMatrix(grid) {
  const n = grid.length;
  const m = grid[0].length;
  const MOD = 12345;

  // Flatten the matrix to 1D array
  const flat = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      flat.push(grid[i][j] % MOD); // Apply modulo early
    }
  }

  const total = flat.length;

  // Step 1: Compute prefix products
  // prefix[i] = product of all elements before index i
  const prefix = new Array(total + 1).fill(1); // +1 for easier indexing
  for (let i = 0; i < total; i++) {
    prefix[i + 1] = (prefix[i] * flat[i]) % MOD;
  }

  // Step 2: Compute suffix products
  // suffix[i] = product of all elements after index i
  const suffix = new Array(total + 1).fill(1);
  for (let i = total - 1; i >= 0; i--) {
    suffix[i] = (suffix[i + 1] * flat[i]) % MOD;
  }

  // Step 3: Compute result for each position
  // result[i] = prefix[i] * suffix[i+1] (product before i * product after i)
  const resultFlat = new Array(total);
  for (let i = 0; i < total; i++) {
    // prefix[i] gives product of elements before i
    // suffix[i+1] gives product of elements after i
    resultFlat[i] = (prefix[i] * suffix[i + 1]) % MOD;
  }

  // Step 4: Convert back to 2D matrix
  const p = new Array(n);
  for (let i = 0; i < n; i++) {
    p[i] = new Array(m);
    for (let j = 0; j < m; j++) {
      const idx = i * m + j; // Convert 2D index to 1D index
      p[i][j] = resultFlat[idx];
    }
  }

  return p;
}
```

```java
// Time: O(n*m) | Space: O(n*m)
public int[][] constructProductMatrix(int[][] grid) {
    int n = grid.length;
    int m = grid[0].length;
    final int MOD = 12345;

    // Flatten the matrix to 1D array
    int total = n * m;
    int[] flat = new int[total];
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            flat[i * m + j] = grid[i][j] % MOD;  // Apply modulo early
        }
    }

    // Step 1: Compute prefix products
    // prefix[i] = product of all elements before index i
    long[] prefix = new long[total + 1];  // Use long to avoid overflow
    prefix[0] = 1;
    for (int i = 0; i < total; i++) {
        prefix[i + 1] = (prefix[i] * flat[i]) % MOD;
    }

    // Step 2: Compute suffix products
    // suffix[i] = product of all elements after index i
    long[] suffix = new long[total + 1];
    suffix[total] = 1;
    for (int i = total - 1; i >= 0; i--) {
        suffix[i] = (suffix[i + 1] * flat[i]) % MOD;
    }

    // Step 3: Compute result for each position
    // result[i] = prefix[i] * suffix[i+1] (product before i * product after i)
    int[] resultFlat = new int[total];
    for (int i = 0; i < total; i++) {
        // prefix[i] gives product of elements before i
        // suffix[i+1] gives product of elements after i
        resultFlat[i] = (int)((prefix[i] * suffix[i + 1]) % MOD);
    }

    // Step 4: Convert back to 2D matrix
    int[][] p = new int[n][m];
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            int idx = i * m + j;  // Convert 2D index to 1D index
            p[i][j] = resultFlat[idx];
        }
    }

    return p;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n×m)**

- Flattening the matrix: O(n×m)
- Computing prefix products: O(n×m)
- Computing suffix products: O(n×m)
- Computing results and converting back: O(n×m)
- Total: O(4 × n×m) = O(n×m)

**Space Complexity: O(n×m)**

- We store the flattened array: O(n×m)
- We store prefix and suffix arrays: O(2 × (n×m + 1)) = O(n×m)
- We store the result array: O(n×m)
- Total: O(n×m)

Note that we could optimize space further by computing results directly without storing intermediate arrays, but the current approach is clearer and still within constraints.

## Common Mistakes

1. **Forgetting to apply modulo at each multiplication step**: If you only apply modulo at the end, intermediate products can overflow even 64-bit integers. Always apply modulo after each multiplication.

2. **Incorrect index mapping between 2D and 1D**: The formula `idx = i * m + j` assumes row-major order. A common mistake is using `i * n + j` or `j * n + i`. Remember: `i` is row index, `j` is column index, `m` is number of columns.

3. **Off-by-one errors in prefix/suffix arrays**: Using arrays of size `total` instead of `total + 1` makes indexing tricky. With size `total + 1`, we have `prefix[i]` = product of elements before index `i`, and `suffix[i]` = product of elements from index `i` onward.

4. **Attempting to use division**: Some candidates try to compute total product then divide by each element. This doesn't work because:
   - Division modulo a non-prime number is not straightforward
   - The problem explicitly states not to use division
   - If any element is 0, division would fail or give incorrect results

## When You'll See This Pattern

The prefix/suffix product technique appears in several problems:

1. **Product of Array Except Self (LeetCode 238)**: The 1D version of this exact problem. Mastering that problem makes this 2D version much easier.

2. **Trapping Rain Water (LeetCode 42)**: Uses prefix/suffix maximums instead of products to determine how much water can be trapped at each position.

3. **Maximum Product Subarray (LeetCode 152)**: Uses a similar idea of tracking prefix/suffix products to handle negative numbers.

The core pattern is: when you need to compute something for each position based on all other positions, consider computing prefix and suffix accumulations separately, then combine them.

## Key Takeaways

1. **Flatten 2D to 1D when possible**: Many 2D problems can be solved by first converting to 1D, applying a known 1D technique, then converting back.

2. **Prefix/suffix accumulation is powerful**: When you need "all except current", compute "everything before" and "everything after" separately, then combine.

3. **Modulo arithmetic requires care**: Apply modulo after each operation, not just at the end, to prevent overflow. Remember that `(a * b) % MOD = ((a % MOD) * (b % MOD)) % MOD`.

Related problems: [Product of Array Except Self](/problem/product-of-array-except-self)
