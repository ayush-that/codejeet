---
title: "How to Solve Kth Smallest Element in a Sorted Matrix — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Kth Smallest Element in a Sorted Matrix. Medium difficulty, 64.4% acceptance rate. Topics: Array, Binary Search, Sorting, Heap (Priority Queue), Matrix."
date: "2026-12-17"
category: "dsa-patterns"
tags: ["kth-smallest-element-in-a-sorted-matrix", "array", "binary-search", "sorting", "medium"]
---

# How to Solve Kth Smallest Element in a Sorted Matrix

You're given an n x n matrix where each row and column is sorted in ascending order, and you need to find the kth smallest element. The challenge is that the matrix isn't fully sorted—it's only sorted row-wise and column-wise. This means you can't simply flatten and sort (that would be O(n² log n²)), but you need to leverage the sorted properties to find the answer efficiently.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
matrix = [
  [ 1,  5,  9],
  [10, 11, 13],
  [12, 13, 15]
]
k = 8
```

We need the 8th smallest element. The sorted elements would be: [1, 5, 9, 10, 11, 12, 13, 13, 15], so the answer should be 13.

**Key insight**: The smallest element is always at the top-left (matrix[0][0] = 1), and the largest is at bottom-right (matrix[2][2] = 15). If we think about it, for any value `mid`, we can count how many elements in the matrix are ≤ `mid` by starting from the top-right corner and moving down/left.

Let's test with `mid = 13`:

- Start at top-right (row=0, col=2, value=9). Since 9 ≤ 13, all 3 elements in row 0 are ≤ 13.
- Move down to row=1, col=2 (value=13). Since 13 ≤ 13, all 3 elements in row 1 are ≤ 13.
- Move down to row=2, col=2 (value=15). Since 15 > 13, move left to col=1 (value=13). Since 13 ≤ 13, the first 2 elements in row 2 are ≤ 13.

Total count = 3 + 3 + 2 = 8 elements ≤ 13. Since k=8, 13 could be our answer. We'll use this counting technique with binary search.

## Brute Force Approach

The most straightforward approach is to flatten the matrix into a 1D array, sort it, and return the kth element:

<div class="code-group">

```python
# Time: O(n² log n²) | Space: O(n²)
def kthSmallest_brute(matrix, k):
    # Flatten the matrix into a 1D list
    flat = []
    for row in matrix:
        flat.extend(row)

    # Sort the flattened list
    flat.sort()

    # Return the kth smallest (1-indexed, so k-1)
    return flat[k-1]
```

```javascript
// Time: O(n² log n²) | Space: O(n²)
function kthSmallestBrute(matrix, k) {
  // Flatten the matrix into a 1D array
  const flat = [];
  for (let row of matrix) {
    flat.push(...row);
  }

  // Sort the flattened array
  flat.sort((a, b) => a - b);

  // Return the kth smallest (1-indexed, so k-1)
  return flat[k - 1];
}
```

```java
// Time: O(n² log n²) | Space: O(n²)
public int kthSmallestBrute(int[][] matrix, int k) {
    int n = matrix.length;
    // Flatten the matrix into a 1D array
    int[] flat = new int[n * n];
    int idx = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            flat[idx++] = matrix[i][j];
        }
    }

    // Sort the flattened array
    Arrays.sort(flat);

    // Return the kth smallest (1-indexed, so k-1)
    return flat[k - 1];
}
```

</div>

**Why this isn't optimal**: With n x n matrix, we have n² elements. Sorting takes O(n² log n²) time and O(n²) space. For a 1000x1000 matrix, that's 1,000,000 elements—sorting would be very slow. We need to leverage the sorted properties to do better.

## Optimized Approach

We can solve this in O(n log maxVal) time using **binary search on the value range** combined with a **clever counting technique**.

**Key insight**: The smallest possible value is matrix[0][0] and the largest is matrix[n-1][n-1]. We can binary search within this range. For any candidate value `mid`, we can count how many elements are ≤ `mid` in O(n) time using the sorted properties.

**Counting technique**: Start from the top-right corner (row 0, col n-1):

- If matrix[row][col] ≤ mid, then ALL elements in that row up to col are ≤ mid (since rows are sorted). Add (col + 1) to count and move down to next row.
- If matrix[row][col] > mid, then move left to a smaller value in the same row.

This works because:

1. Rows are sorted left to right → if matrix[row][col] ≤ mid, everything left of it is also ≤ mid
2. Columns are sorted top to bottom → if we move down, values increase, so we maintain the property that we're checking the rightmost element that might be ≤ mid

We binary search until we find the smallest value where count(mid) ≥ k. That value is our answer.

## Optimal Solution

Here's the complete implementation using binary search with the counting technique:

<div class="code-group">

```python
# Time: O(n log(max-min)) | Space: O(1)
def kthSmallest(matrix, k):
    n = len(matrix)

    # Binary search on the value range
    left, right = matrix[0][0], matrix[n-1][n-1]

    while left < right:
        mid = left + (right - left) // 2

        # Count how many elements are <= mid
        count = 0
        col = n - 1  # Start from top-right corner

        # For each row, find how many elements are <= mid
        for row in range(n):
            # Move left while current element > mid
            while col >= 0 and matrix[row][col] > mid:
                col -= 1
            # All elements from col..0 in this row are <= mid
            count += (col + 1)

        # Adjust binary search bounds
        if count < k:
            # Need more elements, so mid is too small
            left = mid + 1
        else:
            # We have enough elements, try smaller values
            right = mid

    return left
```

```javascript
// Time: O(n log(max-min)) | Space: O(1)
function kthSmallest(matrix, k) {
  const n = matrix.length;

  // Binary search on the value range
  let left = matrix[0][0];
  let right = matrix[n - 1][n - 1];

  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);

    // Count how many elements are <= mid
    let count = 0;
    let col = n - 1; // Start from top-right corner

    // For each row, find how many elements are <= mid
    for (let row = 0; row < n; row++) {
      // Move left while current element > mid
      while (col >= 0 && matrix[row][col] > mid) {
        col--;
      }
      // All elements from col..0 in this row are <= mid
      count += col + 1;
    }

    // Adjust binary search bounds
    if (count < k) {
      // Need more elements, so mid is too small
      left = mid + 1;
    } else {
      // We have enough elements, try smaller values
      right = mid;
    }
  }

  return left;
}
```

```java
// Time: O(n log(max-min)) | Space: O(1)
public int kthSmallest(int[][] matrix, int k) {
    int n = matrix.length;

    // Binary search on the value range
    int left = matrix[0][0];
    int right = matrix[n-1][n-1];

    while (left < right) {
        int mid = left + (right - left) / 2;

        // Count how many elements are <= mid
        int count = 0;
        int col = n - 1;  // Start from top-right corner

        // For each row, find how many elements are <= mid
        for (int row = 0; row < n; row++) {
            // Move left while current element > mid
            while (col >= 0 && matrix[row][col] > mid) {
                col--;
            }
            // All elements from col..0 in this row are <= mid
            count += (col + 1);
        }

        // Adjust binary search bounds
        if (count < k) {
            // Need more elements, so mid is too small
            left = mid + 1;
        } else {
            // We have enough elements, try smaller values
            right = mid;
        }
    }

    return left;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n log(max-min))

- Binary search runs O(log(max-min)) times, where max-min is the range of values in the matrix
- Each binary search iteration counts elements in O(n) time using the top-right traversal
- Total: O(n log(max-min))

**Space Complexity**: O(1)

- We only use a few variables (left, right, mid, count, col, row)
- No additional data structures proportional to input size

**Why this is efficient**: For a 1000x1000 matrix with values from 1 to 10^9, binary search would do about 30 iterations (log₂(10^9) ≈ 30), and each iteration takes O(1000) operations. That's 30,000 operations vs. 1,000,000 log(1,000,000) ≈ 20,000,000 for the brute force approach.

## Common Mistakes

1. **Off-by-one in binary search**: Using `while (left <= right)` instead of `while (left < right)` can cause infinite loops. The correct condition ensures convergence.
   - **Fix**: Use `while (left < right)` and update `left = mid + 1` or `right = mid`.

2. **Incorrect counting logic**: Starting counting from bottom-left instead of top-right makes the algorithm O(n²) instead of O(n).
   - **Fix**: Always start from top-right and move down/left as shown.

3. **Forgetting that k is 1-indexed**: Returning `flat[k]` instead of `flat[k-1]` in brute force, or similar off-by-one in binary search condition.
   - **Fix**: Remember k=1 means the smallest element.

4. **Integer overflow in mid calculation**: Using `(left + right) / 2` can overflow for large values.
   - **Fix**: Use `left + (right - left) / 2`.

## When You'll See This Pattern

This "binary search on answer space with counting function" pattern appears in several LeetCode problems:

1. **Find K Pairs with Smallest Sums** (Medium): Instead of a matrix, you have two arrays. You binary search on the sum value and count how many pairs have sum ≤ mid.

2. **Kth Smallest Number in Multiplication Table** (Hard): Similar structure—table where cell (i,j) = i\*j. Binary search on the product value and count how many cells have value ≤ mid.

3. **Find K-th Smallest Pair Distance** (Hard): Given an array, find the kth smallest distance between pairs. Binary search on the distance and count how many pairs have distance ≤ mid.

The pattern is: when you need to find the kth smallest/largest element and you can efficiently count how many elements are ≤ some value, binary search on the value range is often optimal.

## Key Takeaways

1. **When to use binary search on values**: If you can define a monotonic condition (like "count of elements ≤ x") and compute it efficiently, binary search on the value range can beat sorting-based approaches.

2. **Leverage sorted properties**: The O(n) counting works because rows and columns are sorted. Always look for ways to use sortedness to avoid checking every element.

3. **Think beyond array indices**: Binary search doesn't always have to be on array indices—it can be on the range of possible values when you have a way to test candidates.

Related problems: [Find K Pairs with Smallest Sums](/problem/find-k-pairs-with-smallest-sums), [Kth Smallest Number in Multiplication Table](/problem/kth-smallest-number-in-multiplication-table), [Find K-th Smallest Pair Distance](/problem/find-k-th-smallest-pair-distance)
