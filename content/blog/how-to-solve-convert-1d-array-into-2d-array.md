---
title: "How to Solve Convert 1D Array Into 2D Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Convert 1D Array Into 2D Array. Easy difficulty, 72.1% acceptance rate. Topics: Array, Matrix, Simulation."
date: "2028-02-02"
category: "dsa-patterns"
tags: ["convert-1d-array-into-2d-array", "array", "matrix", "simulation", "easy"]
---

# How to Solve Convert 1D Array Into 2D Array

This problem asks you to reshape a 1D array into a 2D matrix with `m` rows and `n` columns, using all elements from the original array in order. The interesting part is that it's not just about creating a 2D structure—you must validate that the transformation is possible given the total number of elements. If the total elements don't match `m * n`, you return an empty array.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** `original = [1, 2, 3, 4, 5, 6]`, `m = 2`, `n = 3`

**Step 1: Validate dimensions**

- Total elements in original: 6
- Required elements for m×n matrix: 2 × 3 = 6
- Since 6 = 6, we can proceed

**Step 2: Fill the 2D array row by row**
We'll create a 2×3 matrix (2 rows, 3 columns):

Row 0: Take elements 0-2 from original

- Column 0: original[0] = 1
- Column 1: original[1] = 2
- Column 2: original[2] = 3

Row 1: Take elements 3-5 from original

- Column 0: original[3] = 4
- Column 1: original[4] = 5
- Column 2: original[5] = 6

**Result:** `[[1, 2, 3], [4, 5, 6]]`

**What if dimensions don't match?**
Example: `original = [1, 2, 3]`, `m = 2`, `n = 2`

- Total elements: 3
- Required: 2 × 2 = 4
- Since 3 ≠ 4, return empty array: `[]`

## Brute Force Approach

The brute force approach would be to simply iterate through the original array and manually assign each element to its correct position in the 2D array. However, there's really only one reasonable approach here since the problem is straightforward. A "naive" version might involve unnecessary complexity like:

1. Creating an empty 2D array
2. Using nested loops with complex index calculations
3. Forgetting to check the dimension compatibility first

The key insight is that we need to validate the dimensions first, then use a simple mapping from 1D index to 2D coordinates.

## Optimal Solution

The optimal solution has three clear steps:

1. Check if the total number of elements matches m × n
2. Create an empty 2D array with m rows
3. Fill each row by taking slices of n elements from the original array

The mathematical relationship is simple: element at position `i` in the 1D array goes to row `i // n` and column `i % n` in the 2D array.

<div class="code-group">

```python
# Time: O(m * n) | Space: O(m * n) for the output matrix
def construct2DArray(original, m, n):
    """
    Convert a 1D array to a 2D array with m rows and n columns.

    Args:
        original: List[int] - The 1D array to convert
        m: int - Number of rows in the output matrix
        n: int - Number of columns in the output matrix

    Returns:
        List[List[int]] - The 2D array, or empty list if dimensions don't match
    """
    # Step 1: Check if transformation is possible
    # Total elements in original must equal m * n
    if len(original) != m * n:
        return []

    # Step 2: Initialize the 2D array with m rows
    result = []

    # Step 3: Fill the 2D array row by row
    # For each row i from 0 to m-1
    for i in range(m):
        # Calculate start and end indices for this row in the original array
        # Row i contains elements from index i*n to (i+1)*n
        start_idx = i * n
        end_idx = (i + 1) * n

        # Extract n elements for this row and append to result
        row = original[start_idx:end_idx]
        result.append(row)

    return result
```

```javascript
// Time: O(m * n) | Space: O(m * n) for the output matrix
function construct2DArray(original, m, n) {
  /**
   * Convert a 1D array to a 2D array with m rows and n columns.
   *
   * @param {number[]} original - The 1D array to convert
   * @param {number} m - Number of rows in the output matrix
   * @param {number} n - Number of columns in the output matrix
   * @return {number[][]} - The 2D array, or empty array if dimensions don't match
   */

  // Step 1: Check if transformation is possible
  // Total elements in original must equal m * n
  if (original.length !== m * n) {
    return [];
  }

  // Step 2: Initialize the 2D array
  const result = [];

  // Step 3: Fill the 2D array row by row
  // For each row i from 0 to m-1
  for (let i = 0; i < m; i++) {
    // Calculate start index for this row in the original array
    // Row i contains elements starting from index i*n
    const startIdx = i * n;

    // Extract n elements for this row using slice
    // slice(startIdx, startIdx + n) gets elements from startIdx to startIdx+n-1
    const row = original.slice(startIdx, startIdx + n);

    // Add this row to the result
    result.push(row);
  }

  return result;
}
```

```java
// Time: O(m * n) | Space: O(m * n) for the output matrix
class Solution {
    public int[][] construct2DArray(int[] original, int m, int n) {
        /**
         * Convert a 1D array to a 2D array with m rows and n columns.
         *
         * @param original - The 1D array to convert
         * @param m - Number of rows in the output matrix
         * @param n - Number of columns in the output matrix
         * @return int[][] - The 2D array, or empty array if dimensions don't match
         */

        // Step 1: Check if transformation is possible
        // Total elements in original must equal m * n
        if (original.length != m * n) {
            return new int[0][0]; // Return empty 2D array
        }

        // Step 2: Initialize the 2D array with m rows and n columns
        int[][] result = new int[m][n];

        // Step 3: Fill the 2D array row by row
        // We can use a single index for the original array
        int idx = 0;

        // For each row i from 0 to m-1
        for (int i = 0; i < m; i++) {
            // For each column j from 0 to n-1
            for (int j = 0; j < n; j++) {
                // Assign current element from original to position (i, j)
                result[i][j] = original[idx];
                idx++; // Move to next element in original
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- We need to process every element from the original array exactly once
- Each element is copied to its position in the 2D array
- Even though we use slicing in Python/JavaScript, internally it still processes n elements for each of m rows

**Space Complexity:** O(m × n)

- We're creating a new 2D array with m rows and n columns
- This requires storing m × n integers
- The space is for the output only; we don't use additional data structures

Note: Some languages might have slightly different space characteristics due to how they handle arrays internally, but the asymptotic complexity remains O(m × n).

## Common Mistakes

1. **Forgetting to check dimension compatibility first**
   - Mistake: Start filling the matrix without checking if `len(original) == m * n`
   - Consequence: Index out of bounds error or incorrect partial matrix
   - Fix: Always validate dimensions at the beginning

2. **Off-by-one errors in index calculations**
   - Mistake: Using `i * n + 1` instead of `i * n` for start index
   - Mistake: Using `(i + 1) * n - 1` instead of `(i + 1) * n` for end index
   - Fix: Remember that slice indices are exclusive at the end in most languages

3. **Incorrect empty array return for invalid dimensions**
   - Mistake: Returning `null` or `None` instead of empty array
   - Mistake: Returning `[[]]` instead of `[]`
   - Fix: Check the problem requirements—it specifies returning an empty array

4. **Using the wrong loop structure**
   - Mistake: Nested loops that iterate over original array instead of matrix dimensions
   - Consequence: Harder to read and more error-prone
   - Fix: Iterate by rows (m) and columns (n) for clarity

## When You'll See This Pattern

This pattern of reshaping data structures appears in several contexts:

1. **Matrix Manipulation Problems**
   - **Reshape the Matrix (LeetCode 566)** - Almost identical problem
   - **Spiral Matrix (LeetCode 54)** - Requires understanding of 2D index mapping
   - **Toeplitz Matrix (LeetCode 766)** - Involves comparing elements at specific relative positions

2. **Image Processing**
   - Converting between 1D pixel arrays and 2D image matrices
   - Applying filters or transformations that require neighborhood access

3. **Game Development**
   - Representing game boards (chess, tic-tac-toe) as 2D arrays
   - Converting between linear storage and grid-based representations

The core technique—mapping 1D indices to 2D coordinates using `row = i // n` and `col = i % n`—is fundamental to many array manipulation problems.

## Key Takeaways

1. **Always validate constraints first** - Check if the transformation is possible before attempting it. This prevents runtime errors and shows defensive programming.

2. **Understand index mapping** - The formula `row = i // n, col = i % n` converts a 1D index `i` to 2D coordinates in an m×n matrix. This is a fundamental pattern worth memorizing.

3. **Choose the right iteration strategy** - When filling a matrix, iterating by rows and columns is usually clearer than trying to compute complex index mappings in a single loop.

**Related problems:** [Reshape the Matrix](/problem/reshape-the-matrix)
