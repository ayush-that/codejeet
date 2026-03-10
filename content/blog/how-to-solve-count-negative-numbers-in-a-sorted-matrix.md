---
title: "How to Solve Count Negative Numbers in a Sorted Matrix — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Negative Numbers in a Sorted Matrix. Easy difficulty, 79.5% acceptance rate. Topics: Array, Binary Search, Matrix."
date: "2027-02-08"
category: "dsa-patterns"
tags: ["count-negative-numbers-in-a-sorted-matrix", "array", "binary-search", "matrix", "easy"]
---

# How to Solve Count Negative Numbers in a Sorted Matrix

This problem asks us to count how many negative numbers appear in a matrix where each row is sorted in non-increasing order (descending) and each column is also sorted in non-increasing order. What makes this problem interesting is that the sorted structure allows us to do much better than checking every element—we can leverage the ordering to skip large sections of the matrix efficiently.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this 3×4 matrix:

```
[ 4,  3,  2, -1]
[ 3,  2,  1, -1]
[ 1,  1, -1, -2]
```

Notice that:

1. Each row is sorted left-to-right in descending order
2. Each column is sorted top-to-bottom in descending order

Because of this structure, once we find a negative number, all elements to its right in the same row must also be negative (since rows are descending). Similarly, all elements below it in the same column must also be negative (since columns are descending).

Let's count step-by-step:

- **Row 0**: Start from the right end (index 3). `-1` is negative, so all 4 elements in this row are negative? Wait, not exactly. We need to find the _first_ negative in each row.
  Actually, let's be systematic: In row 0, we scan from right to left. `-1` at index 3 is negative, `2` at index 2 is positive. So row 0 has 1 negative (just the last element).
- **Row 1**: `-1` at index 3 is negative, `1` at index 2 is positive. So row 1 has 1 negative.
- **Row 2**: `-2` at index 3 is negative, `-1` at index 2 is negative, `1` at index 1 is positive. So row 2 has 2 negatives.

Total: 1 + 1 + 2 = 4 negatives.

But we can do better! Notice that when we find the first negative in a row at column `j`, then in the next row, we don't need to start scanning from the rightmost column again—we can start from column `j` because if `grid[i][j]` is negative, then `grid[i+1][j]` must also be negative (columns are sorted). This gives us a more efficient algorithm.

## Brute Force Approach

The most straightforward solution is to iterate through every element in the matrix and count how many are negative. This is simple to implement but inefficient for large matrices.

<div class="code-group">

```python
# Time: O(m * n) | Space: O(1)
def countNegatives(grid):
    """
    Brute force: Check every element
    """
    count = 0
    m = len(grid)
    n = len(grid[0])

    for i in range(m):
        for j in range(n):
            if grid[i][j] < 0:
                count += 1

    return count
```

```javascript
// Time: O(m * n) | Space: O(1)
function countNegatives(grid) {
  /**
   * Brute force: Check every element
   */
  let count = 0;
  const m = grid.length;
  const n = grid[0].length;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] < 0) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(m * n) | Space: O(1)
public int countNegatives(int[][] grid) {
    /**
     * Brute force: Check every element
     */
    int count = 0;
    int m = grid.length;
    int n = grid[0].length;

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] < 0) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this is insufficient:** For an m × n matrix, this takes O(m × n) time. While this works for small matrices, it's inefficient when the matrix is large (say, 10,000 × 10,000). The sorted structure of the matrix gives us an opportunity to do much better.

## Optimal Solution

We can leverage the sorted structure to achieve O(m + n) time complexity. The key insight is that once we find the first negative in a row, we know exactly how many negatives are in that row, and we can use that information to skip ahead in the next row.

Here's the optimal approach:

1. Start from the top-right corner of the matrix
2. Move left while the current element is negative (counting all negatives in current row)
3. Move down to the next row, but don't reset the column pointer—since columns are sorted, if `grid[i][j]` is negative, then `grid[i+1][j]` must also be negative
4. Repeat until we've processed all rows

This is essentially walking a "staircase" from the top-right to the bottom-left.

<div class="code-group">

```python
# Time: O(m + n) | Space: O(1)
def countNegatives(grid):
    """
    Optimal solution using the sorted property.
    We traverse from top-right to bottom-left.
    """
    m = len(grid)      # Number of rows
    n = len(grid[0])   # Number of columns

    count = 0          # Total negative count
    row = 0            # Start from first row
    col = n - 1        # Start from last column (top-right corner)

    # Traverse the matrix in a staircase pattern
    while row < m and col >= 0:
        # If current element is negative
        if grid[row][col] < 0:
            # All elements to the right in this row are also negative
            # So we can add all of them to our count
            count += (m - row)  # (m - row) elements in this column from current row downward

            # Move left to check previous column
            col -= 1
        else:
            # Current element is non-negative
            # Move down to next row (elements in this column below might be negative)
            row += 1

    return count
```

```javascript
// Time: O(m + n) | Space: O(1)
function countNegatives(grid) {
  /**
   * Optimal solution using the sorted property.
   * We traverse from top-right to bottom-left.
   */
  const m = grid.length; // Number of rows
  const n = grid[0].length; // Number of columns

  let count = 0; // Total negative count
  let row = 0; // Start from first row
  let col = n - 1; // Start from last column (top-right corner)

  // Traverse the matrix in a staircase pattern
  while (row < m && col >= 0) {
    // If current element is negative
    if (grid[row][col] < 0) {
      // All elements to the right in this row are also negative
      // So we can add all of them to our count
      count += m - row; // (m - row) elements in this column from current row downward

      // Move left to check previous column
      col--;
    } else {
      // Current element is non-negative
      // Move down to next row (elements in this column below might be negative)
      row++;
    }
  }

  return count;
}
```

```java
// Time: O(m + n) | Space: O(1)
public int countNegatives(int[][] grid) {
    /**
     * Optimal solution using the sorted property.
     * We traverse from top-right to bottom-left.
     */
    int m = grid.length;      // Number of rows
    int n = grid[0].length;   // Number of columns

    int count = 0;            // Total negative count
    int row = 0;              // Start from first row
    int col = n - 1;          // Start from last column (top-right corner)

    // Traverse the matrix in a staircase pattern
    while (row < m && col >= 0) {
        // If current element is negative
        if (grid[row][col] < 0) {
            // All elements to the right in this row are also negative
            // So we can add all of them to our count
            count += (m - row);  // (m - row) elements in this column from current row downward

            // Move left to check previous column
            col--;
        } else {
            // Current element is non-negative
            // Move down to next row (elements in this column below might be negative)
            row++;
        }
    }

    return count;
}
```

</div>

**Alternative approach with binary search:** For each row, we can use binary search to find the first negative number. Since each row is sorted, we can find the first negative in O(log n) time per row, giving us O(m log n) total time. This is also efficient and might be easier to implement correctly under interview pressure.

<div class="code-group">

```python
# Time: O(m log n) | Space: O(1)
def countNegatives(grid):
    """
    Alternative: Binary search for each row.
    """
    def binary_search(row):
        """Find first index where row becomes negative."""
        left, right = 0, len(row) - 1
        while left <= right:
            mid = (left + right) // 2
            if row[mid] < 0:
                right = mid - 1  # Look for earlier negative
            else:
                left = mid + 1   # Look in right half
        return left

    count = 0
    for row in grid:
        # Find first negative index
        first_negative = binary_search(row)
        # All elements from first_negative to end are negative
        count += len(row) - first_negative

    return count
```

```javascript
// Time: O(m log n) | Space: O(1)
function countNegatives(grid) {
  /**
   * Alternative: Binary search for each row.
   */
  function binarySearch(row) {
    // Find first index where row becomes negative
    let left = 0,
      right = row.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (row[mid] < 0) {
        right = mid - 1; // Look for earlier negative
      } else {
        left = mid + 1; // Look in right half
      }
    }
    return left;
  }

  let count = 0;
  for (const row of grid) {
    // Find first negative index
    const firstNegative = binarySearch(row);
    // All elements from firstNegative to end are negative
    count += row.length - firstNegative;
  }

  return count;
}
```

```java
// Time: O(m log n) | Space: O(1)
public int countNegatives(int[][] grid) {
    /**
     * Alternative: Binary search for each row.
     */
    int count = 0;
    for (int[] row : grid) {
        // Find first negative using binary search
        int left = 0, right = row.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (row[mid] < 0) {
                right = mid - 1;  // Look for earlier negative
            } else {
                left = mid + 1;   // Look in right half
            }
        }
        // All elements from 'left' to end are negative
        count += row.length - left;
    }
    return count;
}
```

</div>

## Complexity Analysis

**O(m + n) approach:**

- **Time:** O(m + n) where m is the number of rows and n is the number of columns. In the worst case, we traverse each row once and each column once, but we never revisit cells we've already passed.
- **Space:** O(1) since we only use a few variables for counting and indices.

**O(m log n) binary search approach:**

- **Time:** O(m log n) where m is the number of rows and n is the number of columns. We perform binary search (O(log n)) for each of the m rows.
- **Space:** O(1) for the iterative binary search implementation.

Both approaches are efficient, but the O(m + n) approach is theoretically better when m and n are large and comparable in size. However, in practice, the binary search approach might be simpler to implement correctly under interview pressure.

## Common Mistakes

1. **Starting from the wrong corner:** Some candidates start from the top-left corner, but this doesn't leverage the sorted structure effectively. Starting from top-right (or bottom-left) is key because it allows us to make decisions based on whether we see a negative or positive number.

2. **Forgetting to check bounds:** In the O(m + n) approach, it's easy to forget the `while (row < m && col >= 0)` condition. Without proper bounds checking, you'll get index out of range errors.

3. **Incorrect counting logic:** When you find a negative at position (row, col), you need to count all elements in that column from the current row downward, not just the current element. The correct formula is `count += (m - row)`.

4. **Using the wrong comparison operator:** The problem says "non-increasing order," which means elements can be equal. Make sure to use `< 0` not `<= 0` when checking for negatives.

## When You'll See This Pattern

This "staircase traversal" pattern appears in several matrix problems where the matrix is sorted in some way:

1. **Search a 2D Matrix II (LeetCode 240):** Search for a target value in a matrix where each row and each column is sorted. The optimal solution uses the same top-right to bottom-left traversal.

2. **Kth Smallest Element in a Sorted Matrix (LeetCode 378):** While the optimal solution uses binary search and counting, the counting part can use a similar staircase traversal.

3. **Find Negative Numbers in Sorted Matrix (this problem):** The direct application of the pattern.

The key insight is that when you have sorting in both dimensions, you can eliminate entire rows or columns with a single comparison, similar to how binary search works in 1D arrays.

## Key Takeaways

1. **Leverage sorting in multiple dimensions:** When a matrix is sorted in both rows and columns, you can often achieve O(m + n) time by starting from a corner and making "staircase" moves.

2. **Choose the right starting point:** For descending order, start from top-right or bottom-left. For ascending order, start from top-left or bottom-right. The goal is to position yourself so that moving in one direction increases values and moving in the other decreases them.

3. **Consider binary search as an alternative:** When you need to find a boundary in a sorted array (like the first negative), binary search is a reliable O(log n) approach. Applying it to each row gives O(m log n), which is often acceptable.

Related problems: [Maximum Count of Positive Integer and Negative Integer](/problem/maximum-count-of-positive-integer-and-negative-integer)
