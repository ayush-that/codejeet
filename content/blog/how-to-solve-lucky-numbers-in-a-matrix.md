---
title: "How to Solve Lucky Numbers in a Matrix — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Lucky Numbers in a Matrix. Easy difficulty, 80.0% acceptance rate. Topics: Array, Matrix."
date: "2028-01-24"
category: "dsa-patterns"
tags: ["lucky-numbers-in-a-matrix", "array", "matrix", "easy"]
---

# How to Solve Lucky Numbers in a Matrix

This problem asks us to find "lucky numbers" in a matrix — elements that are both the minimum in their row and the maximum in their column. While the concept is straightforward, the challenge lies in efficiently checking both conditions without redundant work. The key insight is that we don't need to check every element against every other element; we can precompute the minimums and maximums first.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Matrix:**

```
[3, 7, 8]
[9, 11, 13]
[15, 16, 17]
```

**Step 1: Find minimum in each row**

- Row 0: min = 3 (at position [0,0])
- Row 1: min = 9 (at position [1,0])
- Row 2: min = 15 (at position [2,0])

**Step 2: Find maximum in each column**

- Column 0: max = 15 (at position [2,0])
- Column 1: max = 16 (at position [2,1])
- Column 2: max = 17 (at position [2,2])

**Step 3: Check for intersections**
We need elements that are both a row minimum AND a column maximum:

- 3: Row minimum ✓, Column maximum ✗ (column 0 max is 15)
- 9: Row minimum ✓, Column maximum ✗ (column 0 max is 15)
- 15: Row minimum ✓, Column maximum ✓ (column 0 max is 15)

**Result:** [15]

Notice how 15 appears in both our row minimums list and column maximums list. This gives us our efficient approach: find all row minimums, find all column maximums, then return their intersection.

## Brute Force Approach

A naive approach would check each element against all elements in its row and column:

For each element `matrix[i][j]`:

1. Check if it's the minimum in row `i` (compare with all `matrix[i][k]`)
2. Check if it's the maximum in column `j` (compare with all `matrix[k][j]`)

This approach has O(m × n × (m + n)) time complexity because for each of the m×n elements, we compare with m elements in its row and n elements in its column. For a 100×100 matrix, that's 100×100×(100+100) = 2,000,000 comparisons!

The brute force is inefficient because we're doing redundant work — we check the same row minimum condition multiple times for elements in the same row.

## Optimal Solution

The efficient solution precomputes row minimums and column maximums, then finds their intersection. This reduces the problem to O(m × n) time with O(m + n) space.

<div class="code-group">

```python
# Time: O(m × n) | Space: O(m + n)
def luckyNumbers(matrix):
    """
    Find all lucky numbers in the matrix.
    A lucky number is minimum in its row and maximum in its column.
    """
    # Step 1: Find minimum element in each row
    # We'll store these in a set for O(1) lookup later
    row_mins = set()

    for row in matrix:
        # min() finds the smallest element in the row
        min_val = min(row)
        row_mins.add(min_val)

    # Step 2: Find maximum element in each column
    # We need to iterate through columns, not rows
    col_maxs = set()

    # Iterate through each column index
    for col in range(len(matrix[0])):
        # Initialize with the first element in the column
        max_val = matrix[0][col]

        # Check all rows in this column
        for row in range(1, len(matrix)):
            if matrix[row][col] > max_val:
                max_val = matrix[row][col]

        col_maxs.add(max_val)

    # Step 3: Find intersection - elements that are both row min AND col max
    # Set intersection gives us O(min(m, n)) time
    lucky_nums = list(row_mins.intersection(col_maxs))

    return lucky_nums
```

```javascript
// Time: O(m × n) | Space: O(m + n)
function luckyNumbers(matrix) {
  /**
   * Find all lucky numbers in the matrix.
   * A lucky number is minimum in its row and maximum in its column.
   */
  // Step 1: Find minimum element in each row
  const rowMins = new Set();

  for (const row of matrix) {
    // Math.min with spread operator finds row minimum
    const minVal = Math.min(...row);
    rowMins.add(minVal);
  }

  // Step 2: Find maximum element in each column
  const colMaxs = new Set();

  // Iterate through each column index
  for (let col = 0; col < matrix[0].length; col++) {
    // Initialize with the first element in the column
    let maxVal = matrix[0][col];

    // Check all rows in this column
    for (let row = 1; row < matrix.length; row++) {
      if (matrix[row][col] > maxVal) {
        maxVal = matrix[row][col];
      }
    }

    colMaxs.add(maxVal);
  }

  // Step 3: Find intersection - elements that are both row min AND col max
  // Convert to array and filter for elements in both sets
  const luckyNums = [...rowMins].filter((num) => colMaxs.has(num));

  return luckyNums;
}
```

```java
// Time: O(m × n) | Space: O(m + n)
import java.util.*;

class Solution {
    public List<Integer> luckyNumbers(int[][] matrix) {
        /**
         * Find all lucky numbers in the matrix.
         * A lucky number is minimum in its row and maximum in its column.
         */
        // Step 1: Find minimum element in each row
        Set<Integer> rowMins = new HashSet<>();

        for (int[] row : matrix) {
            // Find minimum in current row
            int minVal = Integer.MAX_VALUE;
            for (int num : row) {
                if (num < minVal) {
                    minVal = num;
                }
            }
            rowMins.add(minVal);
        }

        // Step 2: Find maximum element in each column
        Set<Integer> colMaxs = new HashSet<>();

        // Iterate through each column index
        for (int col = 0; col < matrix[0].length; col++) {
            // Initialize with the first element in the column
            int maxVal = matrix[0][col];

            // Check all rows in this column
            for (int row = 1; row < matrix.length; row++) {
                if (matrix[row][col] > maxVal) {
                    maxVal = matrix[row][col];
                }
            }

            colMaxs.add(maxVal);
        }

        // Step 3: Find intersection - elements that are both row min AND col max
        List<Integer> luckyNums = new ArrayList<>();

        // Check which row minimums are also column maximums
        for (int num : rowMins) {
            if (colMaxs.contains(num)) {
                luckyNums.add(num);
            }
        }

        return luckyNums;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- Finding row minimums: O(m × n) — we examine each element once while finding row minimums
- Finding column maximums: O(m × n) — we examine each element once while finding column maximums
- Finding intersection: O(min(m, n)) — set intersection is linear in the size of the smaller set
- Total: O(m × n) dominates

**Space Complexity: O(m + n)**

- We store at most m row minimums (one per row)
- We store at most n column maximums (one per column)
- Total: O(m + n) additional space

## Common Mistakes

1. **Forgetting to handle empty matrix**: Always check if the matrix is empty or has zero rows/columns. While the problem guarantees m, n ≥ 1, it's good practice to handle edge cases.

2. **Incorrect column iteration**: When finding column maximums, beginners often try to iterate columns the same way as rows. Remember: `matrix[i][j]` where `i` is row index and `j` is column index. To iterate columns, fix `j` and vary `i`.

3. **Assuming only one lucky number**: The problem says "return all lucky numbers," not just one. Some candidates stop after finding the first match.

4. **Not using sets for efficient lookup**: Checking if each row minimum exists in the column maximums list using linear search would be O(m × n) instead of O(min(m, n)). Sets give us O(1) lookups.

## When You'll See This Pattern

This "precompute and intersect" pattern appears in many matrix problems:

1. **Set Matrix Zeroes (LeetCode 73)**: Track which rows and columns need to be zeroed, then apply changes.

2. **Valid Sudoku (LeetCode 36)**: Check rows, columns, and sub-boxes separately for duplicates.

3. **Toeplitz Matrix (LeetCode 766)**: Check elements along diagonals by comparing `matrix[i][j]` with `matrix[i-1][j-1]`.

The common theme is breaking down a 2D condition (row AND column) into separate 1D computations that can be combined efficiently.

## Key Takeaways

1. **Separate orthogonal conditions**: When a problem requires checking conditions along different dimensions (rows AND columns), consider checking them separately and combining results.

2. **Precomputation is powerful**: Instead of checking conditions repeatedly for each element, compute summaries (min, max, sum, etc.) once and reuse them.

3. **Use appropriate data structures**: Sets provide O(1) lookups for membership tests. When you need to check "is this element in that collection," sets are often the right choice.

[Practice this problem on CodeJeet](/problem/lucky-numbers-in-a-matrix)
