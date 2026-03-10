---
title: "How to Solve Number of Submatrices That Sum to Target — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Submatrices That Sum to Target. Hard difficulty, 74.6% acceptance rate. Topics: Array, Hash Table, Matrix, Prefix Sum."
date: "2026-05-20"
category: "dsa-patterns"
tags: ["number-of-submatrices-that-sum-to-target", "array", "hash-table", "matrix", "hard"]
---

# How to Solve Number of Submatrices That Sum to Target

This problem asks us to count all non-empty submatrices in a given 2D matrix whose sum equals a target value. What makes this problem challenging is that a brute force approach would need to check O(n²m²) submatrices, which is far too slow for typical constraints. The key insight is adapting the "subarray sum equals k" technique to two dimensions using prefix sums and hash maps.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this 2×3 matrix with target = 0:

```
matrix = [[0, 1, 0],
          [1, 1, 1]]
```

We want to count all submatrices with sum 0. Let's think about how we can systematically check them:

1. **Single cells**: (0,0)=0, (0,1)=1, (0,2)=0, (1,0)=1, (1,1)=1, (1,2)=1 → 2 submatrices
2. **1×2 horizontal**: (0,0-1)=1, (0,1-2)=1, (1,0-1)=2, (1,1-2)=2 → 0 submatrices
3. **2×1 vertical**: (0-1,0)=1, (0-1,1)=2, (0-1,2)=1 → 0 submatrices
4. **2×2**: (0-1,0-1)=3, (0-1,1-2)=3 → 0 submatrices
5. **2×3**: (0-1,0-2)=4 → 0 submatrices

Total: 2 submatrices. But checking all these manually is exactly what we need to avoid in code! The key insight is that we can fix the top and bottom rows, then treat the columns as a 1D array problem.

For example, if we fix top=0 and bottom=0 (just the first row), we have the 1D array [0, 1, 0]. Using the "subarray sum equals k" technique with k=0:

- Prefix sums: [0, 1, 1]
- We look for prefix_sum[j] - prefix_sum[i] = 0 → prefix_sum[j] = prefix_sum[i]
- This gives us subarrays [0] at position 0 and [0] at position 2

Now if we fix top=0 and bottom=1 (both rows), we sum vertically to get [1, 2, 1]. With k=0:

- Prefix sums: [1, 3, 4]
- No equal prefix sums → no subarrays sum to 0

This approach lets us check all submatrices efficiently!

## Brute Force Approach

The most straightforward solution checks every possible submatrix by iterating through all possible top-left and bottom-right corners:

1. For every possible (r1, c1) as top-left corner
2. For every possible (r2, c2) as bottom-right corner where r2 ≥ r1 and c2 ≥ c1
3. Sum all elements in that rectangle
4. If sum equals target, increment count

The problem is the time complexity: O(m²n²) for the four nested loops, plus O(mn) to sum each submatrix, giving O(m³n³) total. For a 100×100 matrix, that's about 10¹² operations — completely infeasible.

<div class="code-group">

```python
# Time: O(m³n³) | Space: O(1)
def numSubmatrixSumTarget_brute(matrix, target):
    rows, cols = len(matrix), len(matrix[0])
    count = 0

    # Try every possible top-left corner
    for r1 in range(rows):
        for c1 in range(cols):
            # Try every possible bottom-right corner
            for r2 in range(r1, rows):
                for c2 in range(c1, cols):
                    # Sum the submatrix
                    submatrix_sum = 0
                    for i in range(r1, r2 + 1):
                        for j in range(c1, c2 + 1):
                            submatrix_sum += matrix[i][j]

                    # Check if sum equals target
                    if submatrix_sum == target:
                        count += 1

    return count
```

```javascript
// Time: O(m³n³) | Space: O(1)
function numSubmatrixSumTargetBrute(matrix, target) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let count = 0;

  // Try every possible top-left corner
  for (let r1 = 0; r1 < rows; r1++) {
    for (let c1 = 0; c1 < cols; c1++) {
      // Try every possible bottom-right corner
      for (let r2 = r1; r2 < rows; r2++) {
        for (let c2 = c1; c2 < cols; c2++) {
          // Sum the submatrix
          let submatrixSum = 0;
          for (let i = r1; i <= r2; i++) {
            for (let j = c1; j <= c2; j++) {
              submatrixSum += matrix[i][j];
            }
          }

          // Check if sum equals target
          if (submatrixSum === target) {
            count++;
          }
        }
      }
    }
  }

  return count;
}
```

```java
// Time: O(m³n³) | Space: O(1)
public int numSubmatrixSumTargetBrute(int[][] matrix, int target) {
    int rows = matrix.length;
    int cols = matrix[0].length;
    int count = 0;

    // Try every possible top-left corner
    for (int r1 = 0; r1 < rows; r1++) {
        for (int c1 = 0; c1 < cols; c1++) {
            // Try every possible bottom-right corner
            for (int r2 = r1; r2 < rows; r2++) {
                for (int c2 = c1; c2 < cols; c2++) {
                    // Sum the submatrix
                    int submatrixSum = 0;
                    for (int i = r1; i <= r2; i++) {
                        for (int j = c1; j <= c2; j++) {
                            submatrixSum += matrix[i][j];
                        }
                    }

                    // Check if sum equals target
                    if (submatrixSum == target) {
                        count++;
                    }
                }
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key optimization comes from two insights:

1. **Prefix sums in 2D**: We can precompute prefix sums so that getting the sum of any submatrix takes O(1) time instead of O(mn). The prefix sum at position (i, j) represents the sum of the rectangle from (0,0) to (i,j).

2. **Reducing to 1D problem**: For any fixed top and bottom rows, we can collapse the matrix into a 1D array where each element is the sum of that column between the top and bottom rows. Then the problem becomes: "How many subarrays in this 1D array sum to target?" This is a classic problem solvable in O(n) time using a hash map.

The algorithm works as follows:

1. Precompute column-wise prefix sums for efficient vertical summation
2. Fix the top row (r1) and bottom row (r2)
3. For each column, compute the sum from r1 to r2 using prefix sums
4. Now we have a 1D array of column sums
5. Use the hash map technique to count subarrays in this 1D array that sum to target
6. Repeat for all pairs of top and bottom rows

The hash map technique for 1D arrays works by tracking prefix sums. If current prefix sum is `curr_sum`, and we've seen `curr_sum - target` before, then there exists a subarray ending at current position that sums to target.

## Optimal Solution

Here's the complete optimal solution with detailed comments:

<div class="code-group">

```python
# Time: O(m² * n) | Space: O(n)
def numSubmatrixSumTarget(matrix, target):
    """
    Counts the number of submatrices that sum to target.

    The key insight is to fix top and bottom rows, then treat columns
    as a 1D array and use the "subarray sum equals k" technique.
    """
    rows, cols = len(matrix), len(matrix[0])
    count = 0

    # Step 1: Precompute column-wise prefix sums
    # prefix[i][j] = sum of matrix[0][j] + matrix[1][j] + ... + matrix[i][j]
    prefix = [[0] * cols for _ in range(rows)]

    # First row is just the matrix values
    for j in range(cols):
        prefix[0][j] = matrix[0][j]

    # Build prefix sums for remaining rows
    for i in range(1, rows):
        for j in range(cols):
            prefix[i][j] = prefix[i-1][j] + matrix[i][j]

    # Step 2: Fix top and bottom rows
    for top in range(rows):
        for bottom in range(top, rows):
            # Step 3: Create a 1D array of column sums between top and bottom
            col_sums = [0] * cols
            for j in range(cols):
                # Sum of column j from top to bottom
                if top == 0:
                    col_sums[j] = prefix[bottom][j]
                else:
                    col_sums[j] = prefix[bottom][j] - prefix[top-1][j]

            # Step 4: Use hash map to count subarrays in col_sums that sum to target
            prefix_sum_count = {0: 1}  # Initialize with prefix sum 0 seen once
            current_sum = 0

            for col_sum in col_sums:
                current_sum += col_sum

                # If (current_sum - target) exists in our map, we found subarrays
                # that sum to target ending at current position
                needed = current_sum - target
                if needed in prefix_sum_count:
                    count += prefix_sum_count[needed]

                # Update the count of current prefix sum
                prefix_sum_count[current_sum] = prefix_sum_count.get(current_sum, 0) + 1

    return count
```

```javascript
// Time: O(m² * n) | Space: O(n)
function numSubmatrixSumTarget(matrix, target) {
  /**
   * Counts the number of submatrices that sum to target.
   *
   * The key insight is to fix top and bottom rows, then treat columns
   * as a 1D array and use the "subarray sum equals k" technique.
   */
  const rows = matrix.length;
  const cols = matrix[0].length;
  let count = 0;

  // Step 1: Precompute column-wise prefix sums
  // prefix[i][j] = sum of matrix[0][j] + matrix[1][j] + ... + matrix[i][j]
  const prefix = new Array(rows);
  for (let i = 0; i < rows; i++) {
    prefix[i] = new Array(cols).fill(0);
  }

  // First row is just the matrix values
  for (let j = 0; j < cols; j++) {
    prefix[0][j] = matrix[0][j];
  }

  // Build prefix sums for remaining rows
  for (let i = 1; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      prefix[i][j] = prefix[i - 1][j] + matrix[i][j];
    }
  }

  // Step 2: Fix top and bottom rows
  for (let top = 0; top < rows; top++) {
    for (let bottom = top; bottom < rows; bottom++) {
      // Step 3: Create a 1D array of column sums between top and bottom
      const colSums = new Array(cols).fill(0);
      for (let j = 0; j < cols; j++) {
        // Sum of column j from top to bottom
        if (top === 0) {
          colSums[j] = prefix[bottom][j];
        } else {
          colSums[j] = prefix[bottom][j] - prefix[top - 1][j];
        }
      }

      // Step 4: Use hash map to count subarrays in colSums that sum to target
      const prefixSumCount = new Map();
      prefixSumCount.set(0, 1); // Initialize with prefix sum 0 seen once
      let currentSum = 0;

      for (const colSum of colSums) {
        currentSum += colSum;

        // If (currentSum - target) exists in our map, we found subarrays
        // that sum to target ending at current position
        const needed = currentSum - target;
        if (prefixSumCount.has(needed)) {
          count += prefixSumCount.get(needed);
        }

        // Update the count of current prefix sum
        prefixSumCount.set(currentSum, (prefixSumCount.get(currentSum) || 0) + 1);
      }
    }
  }

  return count;
}
```

```java
// Time: O(m² * n) | Space: O(n)
public int numSubmatrixSumTarget(int[][] matrix, int target) {
    /**
     * Counts the number of submatrices that sum to target.
     *
     * The key insight is to fix top and bottom rows, then treat columns
     * as a 1D array and use the "subarray sum equals k" technique.
     */
    int rows = matrix.length;
    int cols = matrix[0].length;
    int count = 0;

    // Step 1: Precompute column-wise prefix sums
    // prefix[i][j] = sum of matrix[0][j] + matrix[1][j] + ... + matrix[i][j]
    int[][] prefix = new int[rows][cols];

    // First row is just the matrix values
    for (int j = 0; j < cols; j++) {
        prefix[0][j] = matrix[0][j];
    }

    // Build prefix sums for remaining rows
    for (int i = 1; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            prefix[i][j] = prefix[i-1][j] + matrix[i][j];
        }
    }

    // Step 2: Fix top and bottom rows
    for (int top = 0; top < rows; top++) {
        for (int bottom = top; bottom < rows; bottom++) {
            // Step 3: Create a 1D array of column sums between top and bottom
            int[] colSums = new int[cols];
            for (int j = 0; j < cols; j++) {
                // Sum of column j from top to bottom
                if (top == 0) {
                    colSums[j] = prefix[bottom][j];
                } else {
                    colSums[j] = prefix[bottom][j] - prefix[top-1][j];
                }
            }

            // Step 4: Use hash map to count subarrays in colSums that sum to target
            Map<Integer, Integer> prefixSumCount = new HashMap<>();
            prefixSumCount.put(0, 1);  // Initialize with prefix sum 0 seen once
            int currentSum = 0;

            for (int colSum : colSums) {
                currentSum += colSum;

                // If (currentSum - target) exists in our map, we found subarrays
                // that sum to target ending at current position
                int needed = currentSum - target;
                if (prefixSumCount.containsKey(needed)) {
                    count += prefixSumCount.get(needed);
                }

                // Update the count of current prefix sum
                prefixSumCount.put(currentSum, prefixSumCount.getOrDefault(currentSum, 0) + 1);
            }
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m² × n)**

- We have O(m²) pairs of top and bottom rows (since bottom ≥ top)
- For each pair, we process n columns in O(n) time using the hash map technique
- The prefix sum precomputation takes O(m × n) time, which is dominated by O(m² × n)

**Space Complexity: O(n)**

- We store O(m × n) for the prefix sums
- The hash map uses O(n) space for tracking prefix sums of the 1D array
- In practice, we could optimize to O(n) total space by computing column sums on the fly without storing the entire prefix matrix

Why is this efficient? For a 100×100 matrix:

- Brute force: ~10¹² operations
- Our solution: ~10⁶ operations (100² × 100 = 1,000,000)

## Common Mistakes

1. **Forgetting to initialize the hash map with {0: 1}**: This accounts for subarrays that start at the beginning. If your current sum equals target, you need to count it, which requires having seen prefix sum 0.

2. **Incorrect column sum calculation**: When top > 0, you must subtract prefix[top-1][j] from prefix[bottom][j]. A common error is using prefix[top][j] instead of prefix[top-1][j], which excludes the top row from the sum.

3. **Using the wrong loop bounds**: The bottom row must be ≥ top row, so the inner loop should start from `top`, not from 0. Similarly, when iterating through columns in the 1D phase, you must include all columns.

4. **Not handling empty matrix or single row/column edge cases**: While the problem guarantees non-empty matrix, it's good practice to consider these. Our solution handles them correctly since the loops will still execute properly.

## When You'll See This Pattern

This "fix boundaries in one dimension, reduce to 1D problem" pattern appears in several matrix problems:

1. **Maximum Sum Rectangle in a 2D Matrix**: Find the submatrix with the maximum sum. The solution fixes top and bottom rows, then uses Kadane's algorithm on the column sums.

2. **Count Submatrices With All Ones**: Given a binary matrix, count submatrices with all 1's. You can fix the bottom row and use a histogram approach.

3. **Range Sum Query 2D - Immutable**: Precomputing prefix sums for O(1) rectangle sum queries uses similar 2D prefix sum logic.

The core technique of reducing a 2D problem to 1D by fixing one dimension is powerful and worth memorizing. Whenever you see "submatrix" problems, consider if you can fix rows or columns and apply 1D techniques.

## Key Takeaways

1. **Dimension reduction is key**: Many 2D matrix problems can be solved by fixing one dimension (rows or columns) and solving a 1D problem on the other dimension. This often turns O(n⁴) problems into O(n³) or better.

2. **Prefix sums enable efficient range queries**: Whether in 1D or 2D, prefix sums let you compute range sums in O(1) time after O(n) or O(n²) preprocessing.

3. **Hash maps track prefix sums for target matching**: The technique of using a hash map to find subarrays summing to k (by looking for `current_sum - k`) is fundamental and appears in many problems.

Remember: When you see "count submatrices/subarrays that sum to target," think: "Can I use prefix sums and a hash map?"

Related problems: [Disconnect Path in a Binary Matrix by at Most One Flip](/problem/disconnect-path-in-a-binary-matrix-by-at-most-one-flip)
