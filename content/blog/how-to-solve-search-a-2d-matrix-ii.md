---
title: "How to Solve Search a 2D Matrix II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Search a 2D Matrix II. Medium difficulty, 56.9% acceptance rate. Topics: Array, Binary Search, Divide and Conquer, Matrix."
date: "2026-08-09"
category: "dsa-patterns"
tags: ["search-a-2d-matrix-ii", "array", "binary-search", "divide-and-conquer", "medium"]
---

# How to Solve Search a 2D Matrix II

You’re given an `m x n` matrix where each row is sorted left-to-right and each column is sorted top-to-bottom. Your task is to determine whether a target value exists in the matrix. The tricky part is that the matrix isn’t fully sorted like in the classic “Search a 2D Matrix” problem — you can’t just treat it as one sorted array. However, the sorted rows and columns give us a powerful structure to exploit for an efficient search.

## Visual Walkthrough

Let’s trace through a concrete example to build intuition. Consider this matrix:

```
[ [1,  4,  7, 11, 15],
  [2,  5,  8, 12, 19],
  [3,  6,  9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30] ]
```

We want to search for `target = 5`.

A naive approach would check every cell, but we can do better. Notice that if we start at the top-right corner (15), we have a useful property:

- Moving **left** decreases the value (since rows are sorted left-to-right).
- Moving **down** increases the value (since columns are sorted top-to-bottom).

This gives us a “search path” we can follow:

1. Start at `matrix[0][4] = 15`. Since `15 > 5`, we know 5 can’t be in the same column (all values below 15 are ≥15). So we move **left** to `11`.
2. `11 > 5`, so move **left** to `7`.
3. `7 > 5`, move **left** to `4`.
4. `4 < 5`, so 5 can’t be in the same row (all values left of 4 are ≤4). Move **down** to `5`.
5. `5 == 5` → found! Return true.

If we reach the matrix boundaries without finding the target, it doesn’t exist. This “staircase” walk from the top-right (or bottom-left) corner lets us eliminate an entire row or column at each step.

## Brute Force Approach

The brute force solution is straightforward: iterate through every cell in the matrix and check if it equals the target.

<div class="code-group">

```python
# Time: O(m * n) | Space: O(1)
def searchMatrixBruteForce(matrix, target):
    # Check every cell
    for row in range(len(matrix)):
        for col in range(len(matrix[0])):
            if matrix[row][col] == target:
                return True
    return False
```

```javascript
// Time: O(m * n) | Space: O(1)
function searchMatrixBruteForce(matrix, target) {
  // Check every cell
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      if (matrix[row][col] === target) {
        return true;
      }
    }
  }
  return false;
}
```

```java
// Time: O(m * n) | Space: O(1)
public boolean searchMatrixBruteForce(int[][] matrix, int target) {
    // Check every cell
    for (int row = 0; row < matrix.length; row++) {
        for (int col = 0; col < matrix[0].length; col++) {
            if (matrix[row][col] == target) {
                return true;
            }
        }
    }
    return false;
}
```

</div>

**Why it’s insufficient:** With `m` rows and `n` columns, this takes O(m × n) time. For a large matrix (e.g., 10,000 × 10,000), that’s 100 million operations — far too slow. We need to leverage the sorted properties to eliminate many cells without checking them.

## Optimized Approach

The key insight is that starting from **either the top-right corner or bottom-left corner** gives us a “decision point” where we can eliminate an entire row or column with each comparison.

Why these corners work:

- **Top-right corner**:
  - Moving left → values decrease.
  - Moving down → values increase.
- **Bottom-left corner**:
  - Moving right → values increase.
  - Moving up → values decrease.

At each step, we compare the current cell with the target:

- If `current == target`: found it!
- If `current > target`: all cells below/right (depending on starting corner) are too large → eliminate current column (if starting top-right) or row (if starting bottom-left).
- If `current < target`: all cells above/left are too small → eliminate current row (if starting top-right) or column (if starting bottom-left).

This creates a staircase path through the matrix. In the worst case, we traverse from one corner to the opposite corner, visiting at most `m + n` cells instead of `m × n`.

## Optimal Solution

Here’s the implementation starting from the top-right corner:

<div class="code-group">

```python
# Time: O(m + n) | Space: O(1)
def searchMatrix(matrix, target):
    # Handle empty matrix edge case
    if not matrix or not matrix[0]:
        return False

    # Start from the top-right corner
    row, col = 0, len(matrix[0]) - 1

    # Walk through the matrix until we go out of bounds
    while row < len(matrix) and col >= 0:
        current = matrix[row][col]

        if current == target:
            return True  # Found the target
        elif current > target:
            # Current value is too large, eliminate entire column
            # by moving left to smaller values
            col -= 1
        else:
            # Current value is too small, eliminate entire row
            # by moving down to larger values
            row += 1

    # If we exit the loop, target is not in matrix
    return False
```

```javascript
// Time: O(m + n) | Space: O(1)
function searchMatrix(matrix, target) {
  // Handle empty matrix edge case
  if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
    return false;
  }

  // Start from the top-right corner
  let row = 0;
  let col = matrix[0].length - 1;

  // Walk through the matrix until we go out of bounds
  while (row < matrix.length && col >= 0) {
    const current = matrix[row][col];

    if (current === target) {
      return true; // Found the target
    } else if (current > target) {
      // Current value is too large, eliminate entire column
      // by moving left to smaller values
      col--;
    } else {
      // Current value is too small, eliminate entire row
      // by moving down to larger values
      row++;
    }
  }

  // If we exit the loop, target is not in matrix
  return false;
}
```

```java
// Time: O(m + n) | Space: O(1)
public boolean searchMatrix(int[][] matrix, int target) {
    // Handle empty matrix edge case
    if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
        return false;
    }

    // Start from the top-right corner
    int row = 0;
    int col = matrix[0].length - 1;

    // Walk through the matrix until we go out of bounds
    while (row < matrix.length && col >= 0) {
        int current = matrix[row][col];

        if (current == target) {
            return true;  // Found the target
        } else if (current > target) {
            // Current value is too large, eliminate entire column
            // by moving left to smaller values
            col--;
        } else {
            // Current value is too small, eliminate entire row
            // by moving down to larger values
            row++;
        }
    }

    // If we exit the loop, target is not in matrix
    return false;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m + n)

- In the worst case, we start at the top-right corner and walk to the bottom-left corner.
- This requires moving through at most `m` rows (down moves) and `n` columns (left moves), totaling `m + n` steps.
- Each step does constant work (one comparison and pointer update).

**Space Complexity:** O(1)

- We only use a constant amount of extra space for the `row` and `col` pointers.
- No additional data structures are created.

## Common Mistakes

1. **Starting from the wrong corner**  
   Starting from top-left or bottom-right doesn’t work because both moves (right/down from top-left or left/up from bottom-right) go in the same direction (increasing or decreasing). You need one move that increases and one that decreases values.

2. **Forgetting to handle empty matrix**  
   Always check if `matrix` is `None`/`null` or empty before accessing `matrix[0]`. Otherwise, you’ll get an index error.

3. **Incorrect boundary conditions in the while loop**  
   The loop should continue while `row < m` AND `col >= 0`. If you use `or` instead of `and`, you might access out-of-bounds indices.

4. **Trying to apply standard binary search**  
   You can’t treat the entire matrix as one sorted array because it’s only sorted row-wise and column-wise, not globally. A binary search on the flattened array would be O(log(mn)), but that only works for the related problem “Search a 2D Matrix” where the matrix is fully sorted.

## When You'll See This Pattern

This “staircase search” pattern appears in problems where you have a 2D structure with sorted rows and columns, and you need to search efficiently. It’s essentially a 2D version of the two-pointer technique.

Related problems:

1. **[Search a 2D Matrix](/problem/search-a-2d-matrix)** (Medium)  
   In this variant, the entire matrix is fully sorted (first integer of each row > last integer of previous row). You can solve it by treating the matrix as one sorted array and using binary search.

2. **Kth Smallest Element in a Sorted Matrix** (Medium)  
   While the optimal solution uses binary search on the value range with count verification, the staircase walk can be used to count how many elements are ≤ a given value.

3. **Find Peak Element II** (Hard)  
   A similar row/column elimination strategy can help find a peak in a 2D matrix efficiently.

## Key Takeaways

1. **Look for elimination patterns in sorted 2D structures**  
   When rows and columns are sorted, starting from corners lets you eliminate entire rows or columns with each comparison.

2. **The top-right and bottom-left corners are special**  
   These corners give you one move that increases values and one that decreases values, creating a controlled search path.

3. **O(m + n) is often optimal for this matrix type**  
   You can’t do better than linear in the sum of dimensions without additional constraints because in the worst case you might need to check most cells along a diagonal.

Related problems: [Search a 2D Matrix](/problem/search-a-2d-matrix)
