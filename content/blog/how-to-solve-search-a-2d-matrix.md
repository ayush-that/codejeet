---
title: "How to Solve Search a 2D Matrix — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Search a 2D Matrix. Medium difficulty, 53.6% acceptance rate. Topics: Array, Binary Search, Matrix."
date: "2026-04-11"
category: "dsa-patterns"
tags: ["search-a-2d-matrix", "array", "binary-search", "matrix", "medium"]
---

# How to Solve Search a 2D Matrix

This problem asks us to determine if a target value exists in a 2D matrix with two special properties: each row is sorted in non-decreasing order, and the first element of each row is greater than the last element of the previous row. What makes this problem interesting is that these two properties together mean the entire matrix can be treated as one long sorted array, allowing us to use a single binary search instead of searching row by row.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this matrix:

```
matrix = [
  [1,  3,  5,  7],
  [10, 11, 16, 20],
  [23, 30, 34, 60]
]
target = 3
```

Because of the matrix properties, if we flatten this matrix into a single array, we get:
`[1, 3, 5, 7, 10, 11, 16, 20, 23, 30, 34, 60]`

This is perfectly sorted! So we can use binary search on this "virtual" array without actually creating it.

**Step-by-step binary search:**

1. Total elements = 12, so left = 0, right = 11
2. Mid = (0 + 11) // 2 = 5
   - Convert index 5 to matrix coordinates: row = 5 // 4 = 1, col = 5 % 4 = 1
   - matrix[1][1] = 11, which is greater than target 3
   - So we search left half: right = mid - 1 = 4
3. New mid = (0 + 4) // 2 = 2
   - row = 2 // 4 = 0, col = 2 % 4 = 2
   - matrix[0][2] = 5, still greater than 3
   - right = 1
4. New mid = (0 + 1) // 2 = 0
   - row = 0 // 4 = 0, col = 0 % 4 = 0
   - matrix[0][0] = 1, less than 3
   - left = 1
5. New mid = (1 + 1) // 2 = 1
   - row = 1 // 4 = 0, col = 1 % 4 = 1
   - matrix[0][1] = 3, which equals our target!

We found the target in 5 steps instead of potentially checking all 12 elements.

## Brute Force Approach

The most straightforward approach is to check every element in the matrix:

<div class="code-group">

```python
# Time: O(m * n) | Space: O(1)
def searchMatrix(matrix, target):
    # Check every element in the matrix
    for row in matrix:
        for element in row:
            if element == target:
                return True
    return False
```

```javascript
// Time: O(m * n) | Space: O(1)
function searchMatrix(matrix, target) {
  // Check every element in the matrix
  for (let row of matrix) {
    for (let element of row) {
      if (element === target) {
        return true;
      }
    }
  }
  return false;
}
```

```java
// Time: O(m * n) | Space: O(1)
public boolean searchMatrix(int[][] matrix, int target) {
    // Check every element in the matrix
    for (int[] row : matrix) {
        for (int element : row) {
            if (element == target) {
                return true;
            }
        }
    }
    return false;
}
```

</div>

**Why this is insufficient:** With a time complexity of O(m × n), this approach doesn't take advantage of the sorted properties of the matrix. For a 1000×1000 matrix, we'd need to check up to 1,000,000 elements, while binary search would only need about 20 comparisons (log₂(1,000,000) ≈ 20).

## Optimized Approach

The key insight is that the two properties of the matrix mean it's essentially one long sorted array:

1. Each row being sorted means elements increase left to right within each row
2. The first element of each row being greater than the last element of the previous row means when we reach the end of a row, the next row continues with larger values

This gives us two optimization strategies:

**Strategy 1: Two binary searches**

1. First binary search to find which row might contain the target
2. Second binary search within that row to find the target

**Strategy 2: Single binary search (optimal)**
Treat the entire matrix as a 1D array and use a single binary search. We convert the 1D index to 2D coordinates using:

- Row index = 1D index // number of columns
- Column index = 1D index % number of columns

This approach is cleaner and has the same time complexity but with less code.

## Optimal Solution

Here's the single binary search approach:

<div class="code-group">

```python
# Time: O(log(m * n)) | Space: O(1)
def searchMatrix(matrix, target):
    # Handle edge case: empty matrix
    if not matrix or not matrix[0]:
        return False

    m, n = len(matrix), len(matrix[0])  # Get dimensions
    left, right = 0, m * n - 1  # Treat matrix as 1D array

    while left <= right:
        mid = (left + right) // 2  # Find middle index

        # Convert 1D index to 2D coordinates
        # row = index // number of columns
        # col = index % number of columns
        mid_element = matrix[mid // n][mid % n]

        if mid_element == target:
            return True  # Found the target
        elif mid_element < target:
            left = mid + 1  # Search right half
        else:
            right = mid - 1  # Search left half

    return False  # Target not found
```

```javascript
// Time: O(log(m * n)) | Space: O(1)
function searchMatrix(matrix, target) {
  // Handle edge case: empty matrix
  if (!matrix.length || !matrix[0].length) {
    return false;
  }

  const m = matrix.length; // Number of rows
  const n = matrix[0].length; // Number of columns
  let left = 0;
  let right = m * n - 1; // Treat matrix as 1D array

  while (left <= right) {
    const mid = Math.floor((left + right) / 2); // Find middle index

    // Convert 1D index to 2D coordinates
    // row = Math.floor(index / number of columns)
    // col = index % number of columns
    const midElement = matrix[Math.floor(mid / n)][mid % n];

    if (midElement === target) {
      return true; // Found the target
    } else if (midElement < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }

  return false; // Target not found
}
```

```java
// Time: O(log(m * n)) | Space: O(1)
public boolean searchMatrix(int[][] matrix, int target) {
    // Handle edge case: empty matrix
    if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
        return false;
    }

    int m = matrix.length;        // Number of rows
    int n = matrix[0].length;     // Number of columns
    int left = 0;
    int right = m * n - 1;        // Treat matrix as 1D array

    while (left <= right) {
        int mid = left + (right - left) / 2;  // Avoid potential overflow

        // Convert 1D index to 2D coordinates
        // row = index / number of columns
        // col = index % number of columns
        int midElement = matrix[mid / n][mid % n];

        if (midElement == target) {
            return true;          // Found the target
        } else if (midElement < target) {
            left = mid + 1;       // Search right half
        } else {
            right = mid - 1;      // Search left half
        }
    }

    return false;  // Target not found
}
```

</div>

**Key implementation details:**

1. We calculate `m` and `n` first to know the matrix dimensions
2. The right boundary is `m * n - 1`, which is the last index if we flatten the matrix
3. The conversion formula `matrix[mid // n][mid % n]` is crucial - it maps the 1D index back to 2D coordinates
4. We use standard binary search loop with `left <= right` to ensure we check all possibilities

## Complexity Analysis

**Time Complexity:** O(log(m × n))

- We perform binary search on what is effectively an array of size m × n
- Each iteration halves the search space
- The number of iterations is proportional to log₂(m × n)

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables (left, right, mid, etc.)
- No additional data structures are created

## Common Mistakes

1. **Forgetting to handle empty matrix:** Always check if the matrix is empty or if it has zero columns. This is a common edge case that interviewers test.

2. **Incorrect index conversion:** The most common error is mixing up rows and columns in the conversion formula. Remember:
   - Row = index // number of columns (integer division)
   - Column = index % number of columns (modulo)

3. **Binary search off-by-one errors:**
   - Using `while left < right` instead of `while left <= right` can miss the target when it's at the boundaries
   - Forgetting to update `left = mid + 1` or `right = mid - 1` can cause infinite loops

4. **Assuming the matrix is square:** The problem doesn't guarantee m = n. Always use `n` (number of columns) for the conversion, not `m`.

## When You'll See This Pattern

This "flattened binary search" pattern appears whenever you have a data structure that can be treated as a sorted 1D array:

1. **Search in Rotated Sorted Array (LeetCode 33):** Similar concept of treating a modified structure as searchable with binary search.

2. **Find Minimum in Rotated Sorted Array (LeetCode 153):** Uses binary search on a structure that's not perfectly sorted but has predictable patterns.

3. **Search a 2D Matrix II (LeetCode 240):** A variation where the matrix has different properties (each row and column sorted, but no guarantee about row relationships). This requires a different approach starting from the top-right corner.

The core pattern is recognizing when data that appears 2D can be treated as 1D for searching purposes, which happens when there's a consistent ordering across the entire structure.

## Key Takeaways

1. **Look for global ordering:** When a 2D structure has properties that create a global sorted order (like each row being sorted and rows being in order), you can often treat it as a 1D sorted array.

2. **Master index conversion:** The formula `row = index // cols` and `col = index % cols` is essential for many matrix problems. Practice it until it's second nature.

3. **Binary search works on virtual arrays:** You don't need to physically flatten an array to use binary search on it. You can calculate positions on the fly, which saves memory and is more elegant.

Related problems: [Search a 2D Matrix II](/problem/search-a-2d-matrix-ii), [Split Message Based on Limit](/problem/split-message-based-on-limit)
