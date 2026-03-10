---
title: "How to Solve Find a Peak Element II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find a Peak Element II. Medium difficulty, 54.4% acceptance rate. Topics: Array, Binary Search, Matrix."
date: "2026-05-13"
category: "dsa-patterns"
tags: ["find-a-peak-element-ii", "array", "binary-search", "matrix", "medium"]
---

# How to Solve Find a Peak Element II

This problem asks us to find any peak element in a 2D matrix, where a peak is strictly greater than all four adjacent neighbors (left, right, top, bottom). The challenge is that we need to do this efficiently for potentially large matrices. What makes this interesting is that while the 1D version can be solved with a simple binary search, extending this to 2D requires clever adaptation of the binary search concept to work with rows and columns.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
Matrix:
1  4  3  1
3  2  6  4
5  1  2  3
```

We need to find any element where it's greater than all adjacent cells. Let's think about how we might approach this:

1. Start by looking at the middle column (column 2 in 0-indexed, which is the third column: [3, 6, 2])
2. Find the maximum element in this column: that's 6 at position (1, 2)
3. Compare 6 with its left neighbor (2) and right neighbor (4):
   - 6 > 2 ✓
   - 6 > 4 ✓
4. Now check the top and bottom neighbors:
   - Top neighbor is 4 (at position 0, 2): 6 > 4 ✓
   - Bottom neighbor is 2 (at position 2, 2): 6 > 2 ✓
5. Since 6 is greater than all four neighbors, we found a peak!

The key insight is that by finding the maximum in a column and comparing it with its horizontal neighbors, we can eliminate half of the search space. If the maximum element in a column is not a peak, then one of its horizontal neighbors must be larger, guiding us to search in that direction.

## Brute Force Approach

The most straightforward approach is to check every element in the matrix:

1. For each cell (i, j), check all four neighbors (if they exist)
2. If the current cell is greater than all its existing neighbors, return it as a peak

This approach would work, but it's inefficient. For an m × n matrix, we'd need to check up to 4 comparisons for each of the m × n cells, giving us O(m × n) time complexity. While this might be acceptable for small matrices, it becomes problematic for large ones (e.g., 1000 × 1000 = 1 million checks).

The brute force also doesn't take advantage of the problem's structure. Since we only need to find **any** peak (not all peaks), we can be smarter about which cells we examine.

## Optimized Approach

The optimal solution adapts binary search to work in 2D. Here's the step-by-step reasoning:

1. **Binary Search on Columns**: Instead of searching the entire matrix, we perform binary search on the columns. We maintain `left` and `right` pointers for column indices.

2. **Find Column Maximum**: For the middle column `mid`, we find the maximum element in that entire column. This gives us a candidate element at position `(maxRow, mid)`.

3. **Compare with Horizontal Neighbors**: Check if this candidate is greater than its left and right neighbors:
   - If it's greater than both, check vertical neighbors. If it's also greater than top and bottom neighbors, we found a peak!
   - If the left neighbor is greater, then there must be a peak in the left half of columns (because the maximum in column `mid` has a larger neighbor to the left)
   - If the right neighbor is greater, then there must be a peak in the right half of columns

4. **Eliminate Half the Search Space**: This is the key - by comparing with horizontal neighbors, we can eliminate either the left or right half of columns from consideration, just like in binary search.

5. **Why This Works**: The algorithm works because:
   - Finding the maximum in a column ensures we have the best candidate from that column
   - If this maximum isn't a peak horizontally, the larger neighbor must lead us toward a peak
   - We're guaranteed to find a peak because the matrix has no equal adjacent elements

This approach reduces the time complexity from O(m × n) to O(n log m) or O(m log n), depending on whether we search by rows or columns.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log m) where m = rows, n = columns
# Space: O(1) - we only use a few variables
def findPeakGrid(mat):
    """
    Find any peak element in a 2D matrix.
    A peak is greater than all four adjacent neighbors.
    """
    rows = len(mat)
    cols = len(mat[0])

    # Binary search on columns
    left, right = 0, cols - 1

    while left <= right:
        # Find the middle column
        mid_col = (left + right) // 2

        # Find the maximum element in this column
        max_row = 0
        for i in range(rows):
            if mat[i][mid_col] > mat[max_row][mid_col]:
                max_row = i

        # Check left neighbor (if it exists)
        left_neighbor = mat[max_row][mid_col - 1] if mid_col > 0 else -1

        # Check right neighbor (if it exists)
        right_neighbor = mat[max_row][mid_col + 1] if mid_col < cols - 1 else -1

        # Current element
        current = mat[max_row][mid_col]

        # Check if current is a peak
        if current > left_neighbor and current > right_neighbor:
            # Found a peak horizontally, return its position
            return [max_row, mid_col]
        elif left_neighbor > current:
            # Peak is in the left half
            right = mid_col - 1
        else:
            # Peak is in the right half
            left = mid_col + 1

    # This line should never be reached given the problem constraints
    return [-1, -1]
```

```javascript
// Time: O(n log m) where m = rows, n = columns
// Space: O(1) - we only use a few variables
function findPeakGrid(mat) {
  const rows = mat.length;
  const cols = mat[0].length;

  // Binary search on columns
  let left = 0;
  let right = cols - 1;

  while (left <= right) {
    // Find the middle column
    const midCol = Math.floor((left + right) / 2);

    // Find the maximum element in this column
    let maxRow = 0;
    for (let i = 0; i < rows; i++) {
      if (mat[i][midCol] > mat[maxRow][midCol]) {
        maxRow = i;
      }
    }

    // Check left neighbor (if it exists)
    const leftNeighbor = midCol > 0 ? mat[maxRow][midCol - 1] : -1;

    // Check right neighbor (if it exists)
    const rightNeighbor = midCol < cols - 1 ? mat[maxRow][midCol + 1] : -1;

    // Current element
    const current = mat[maxRow][midCol];

    // Check if current is a peak
    if (current > leftNeighbor && current > rightNeighbor) {
      // Found a peak horizontally, return its position
      return [maxRow, midCol];
    } else if (leftNeighbor > current) {
      // Peak is in the left half
      right = midCol - 1;
    } else {
      // Peak is in the right half
      left = midCol + 1;
    }
  }

  // This line should never be reached given the problem constraints
  return [-1, -1];
}
```

```java
// Time: O(n log m) where m = rows, n = columns
// Space: O(1) - we only use a few variables
public int[] findPeakGrid(int[][] mat) {
    int rows = mat.length;
    int cols = mat[0].length;

    // Binary search on columns
    int left = 0;
    int right = cols - 1;

    while (left <= right) {
        // Find the middle column
        int midCol = left + (right - left) / 2;

        // Find the maximum element in this column
        int maxRow = 0;
        for (int i = 0; i < rows; i++) {
            if (mat[i][midCol] > mat[maxRow][midCol]) {
                maxRow = i;
            }
        }

        // Check left neighbor (if it exists)
        int leftNeighbor = midCol > 0 ? mat[maxRow][midCol - 1] : -1;

        // Check right neighbor (if it exists)
        int rightNeighbor = midCol < cols - 1 ? mat[maxRow][midCol + 1] : -1;

        // Current element
        int current = mat[maxRow][midCol];

        // Check if current is a peak
        if (current > leftNeighbor && current > rightNeighbor) {
            // Found a peak horizontally, return its position
            return new int[]{maxRow, midCol};
        } else if (leftNeighbor > current) {
            // Peak is in the left half
            right = midCol - 1;
        } else {
            // Peak is in the right half
            left = midCol + 1;
        }
    }

    // This line should never be reached given the problem constraints
    return new int[]{-1, -1};
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log m) or O(m log n)**

- We perform binary search on columns (or rows), which gives us O(log n) iterations
- In each iteration, we scan an entire column to find the maximum, which takes O(m) time
- Total: O(m log n) if we search by columns, or O(n log m) if we search by rows
- This is significantly better than the O(m × n) brute force approach

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables like `left`, `right`, `midCol`, `maxRow`, etc.
- No additional data structures are created that scale with input size

## Common Mistakes

1. **Forgetting to handle edge columns**: When checking left and right neighbors, candidates in the first or last column won't have both neighbors. Always check if `midCol > 0` and `midCol < cols - 1` before accessing neighbors.

2. **Incorrect binary search termination**: Using `while left < right` instead of `while left <= right` can cause the algorithm to miss peaks at the boundaries. The inclusive condition ensures we check all possible columns.

3. **Not finding the global maximum in the column**: Some candidates try to use the first element or a random element from the column instead of finding the maximum. The algorithm relies on comparing the column's maximum with its horizontal neighbors to guarantee correctness.

4. **Confusing row and column indices**: When returning the result `[maxRow, midCol]`, it's easy to swap these. Remember that matrix indices are typically `[row, column]`.

## When You'll See This Pattern

This "binary search on a sorted property" pattern appears in several problems:

1. **Find Peak Element (LeetCode 162)**: The 1D version of this problem uses similar logic - compare middle element with neighbors and eliminate half the search space.

2. **Search in a 2D Matrix (LeetCode 74)**: While not identical, it also uses the property that rows and columns are sorted to perform efficient search.

3. **Kth Smallest Element in a Sorted Matrix (LeetCode 378)**: Uses binary search on the value range rather than indices, but shares the concept of eliminating search space based on comparisons.

The key insight is recognizing when you can make decisions that eliminate half (or a significant portion) of the search space, even in multi-dimensional problems.

## Key Takeaways

1. **Binary search can work in multiple dimensions**: You don't need a fully sorted structure to use binary search. If you can make a decision that eliminates half the search space at each step, binary search can be adapted.

2. **Find extremum in one dimension to simplify**: By finding the maximum in a column (or row), you reduce a 2D problem to comparing just two neighbors instead of four.

3. **Edge cases matter in matrix problems**: Always check boundary conditions when accessing neighbors. The first/last row/column require special handling.

Remember: The problem guarantees no two adjacent cells are equal, which ensures our comparisons are always strict and the algorithm always progresses toward a solution.

Related problems: [Find Peak Element](/problem/find-peak-element), [Find the Peaks](/problem/find-the-peaks)
