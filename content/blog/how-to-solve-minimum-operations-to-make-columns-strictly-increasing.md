---
title: "How to Solve Minimum Operations to Make Columns Strictly Increasing — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Make Columns Strictly Increasing. Easy difficulty, 72.6% acceptance rate. Topics: Array, Greedy, Matrix."
date: "2029-01-04"
category: "dsa-patterns"
tags:
  ["minimum-operations-to-make-columns-strictly-increasing", "array", "greedy", "matrix", "easy"]
---

# How to Solve Minimum Operations to Make Columns Strictly Increasing

This problem asks us to transform a matrix so that every column becomes strictly increasing from top to bottom, where we can only increase cell values. The challenge lies in efficiently determining the minimum increments needed while ensuring each column maintains the strictly increasing property. What makes this interesting is that changes in one row affect the requirements for the next row in the same column, creating a chain of dependencies.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
Input grid:
[[3, 2, 1],
 [2, 1, 0],
 [1, 3, 2]]
```

We need to make each column strictly increasing from top to bottom. Let's process column by column:

**Column 0:** [3, 2, 1]

- Row 0: 3 (stays as is)
- Row 1: 2 needs to be > 3, so we increase it to 4 (2 operations)
- Row 2: 1 needs to be > 4, so we increase it to 5 (4 operations)
  Total operations for column 0: 0 + 2 + 4 = 6

**Column 1:** [2, 1, 3]

- Row 0: 2 (stays as is)
- Row 1: 1 needs to be > 2, so we increase it to 3 (2 operations)
- Row 2: 3 is already > 3, so it stays (0 operations)
  Total operations for column 1: 0 + 2 + 0 = 2

**Column 2:** [1, 0, 2]

- Row 0: 1 (stays as is)
- Row 1: 0 needs to be > 1, so we increase it to 2 (2 operations)
- Row 2: 2 needs to be > 2, so we increase it to 3 (1 operation)
  Total operations for column 2: 0 + 2 + 1 = 3

**Total operations:** 6 + 2 + 3 = 11

The key insight: For each column, we process rows from top to bottom. At each row, we ensure the current value is strictly greater than the previous row's value in that column. If it's not, we increase it to exactly one more than the previous value (the minimum needed to satisfy the strictly increasing condition).

## Brute Force Approach

A naive approach might try to consider all possible increment combinations, but that's exponential and impractical. Another naive approach would be to process each column independently but fail to recognize that we should only increase values when necessary, and when we do increase, we should increase to the minimum value that satisfies the condition.

The brute force approach would be to repeatedly scan each column and make adjustments until all columns are strictly increasing. This could work but would be inefficient with O(m²n) time complexity in the worst case, where we might need to make adjustments that cascade through the entire column.

## Optimal Solution

The optimal solution processes each column independently from top to bottom. For each cell, we compare it with the cell above in the same column. If the current cell is not strictly greater than the one above, we calculate how much we need to increase it and update it. This greedy approach works because:

1. We can only increase values, never decrease them
2. Making the minimum necessary increase at each step doesn't hurt future rows
3. Each decision is locally optimal and leads to a globally optimal solution

<div class="code-group">

```python
# Time: O(m * n) | Space: O(1) - modifying grid in place
def minOperations(self, grid):
    """
    Calculate minimum operations to make all columns strictly increasing.

    Args:
        grid: List[List[int]] - input matrix

    Returns:
        int - minimum number of operations
    """
    operations = 0
    rows = len(grid)
    cols = len(grid[0])

    # Process each column independently
    for col in range(cols):
        # Process rows from top to bottom (1 to rows-1)
        for row in range(1, rows):
            # Get current and previous values in this column
            current = grid[row][col]
            previous = grid[row - 1][col]

            # If current value is not strictly greater than previous
            if current <= previous:
                # Calculate the minimum value needed for current cell
                # It must be at least (previous + 1) to be strictly increasing
                needed_value = previous + 1

                # Calculate how many operations needed for this cell
                ops_needed = needed_value - current

                # Apply the operations
                grid[row][col] = needed_value
                operations += ops_needed

    return operations
```

```javascript
// Time: O(m * n) | Space: O(1) - modifying grid in place
function minOperations(grid) {
  let operations = 0;
  const rows = grid.length;
  const cols = grid[0].length;

  // Process each column independently
  for (let col = 0; col < cols; col++) {
    // Process rows from top to bottom (1 to rows-1)
    for (let row = 1; row < rows; row++) {
      // Get current and previous values in this column
      const current = grid[row][col];
      const previous = grid[row - 1][col];

      // If current value is not strictly greater than previous
      if (current <= previous) {
        // Calculate the minimum value needed for current cell
        // It must be at least (previous + 1) to be strictly increasing
        const neededValue = previous + 1;

        // Calculate how many operations needed for this cell
        const opsNeeded = neededValue - current;

        // Apply the operations
        grid[row][col] = neededValue;
        operations += opsNeeded;
      }
    }
  }

  return operations;
}
```

```java
// Time: O(m * n) | Space: O(1) - modifying grid in place
public int minOperations(int[][] grid) {
    int operations = 0;
    int rows = grid.length;
    int cols = grid[0].length;

    // Process each column independently
    for (int col = 0; col < cols; col++) {
        // Process rows from top to bottom (1 to rows-1)
        for (int row = 1; row < rows; row++) {
            // Get current and previous values in this column
            int current = grid[row][col];
            int previous = grid[row - 1][col];

            // If current value is not strictly greater than previous
            if (current <= previous) {
                // Calculate the minimum value needed for current cell
                // It must be at least (previous + 1) to be strictly increasing
                int neededValue = previous + 1;

                // Calculate how many operations needed for this cell
                int opsNeeded = neededValue - current;

                // Apply the operations
                grid[row][col] = neededValue;
                operations += opsNeeded;
            }
        }
    }

    return operations;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n) where m is the number of rows and n is the number of columns. We iterate through each cell exactly once (except the first row of each column, which we access as the previous value).

**Space Complexity:** O(1) additional space if we modify the input grid in place. We only use a constant amount of extra space for the operations counter and loop variables. If we cannot modify the input, we would need O(m × n) space to create a copy, but the problem doesn't prohibit modification.

The efficiency comes from:

1. Processing each column independently
2. Making only necessary adjustments
3. Each cell is visited exactly once during the main processing loop

## Common Mistakes

1. **Forgetting to update the grid after increasing a value**: If you calculate that grid[row][col] needs to be increased but don't actually update it, the next row will compare against the old (smaller) value, leading to incorrect results. Always update the grid value after calculating the needed increase.

2. **Using the wrong comparison operator**: The problem requires "strictly increasing" (current > previous), not "non-decreasing" (current ≥ previous). Using `current < previous` instead of `current <= previous` is a subtle but critical error.

3. **Starting from row 0 instead of row 1**: The first row has no previous row to compare with, so we should start processing from row 1. Starting from row 0 would cause an index out of bounds error or require special handling.

4. **Not considering integer overflow**: While the problem states non-negative integers, in some languages with very large values, `previous + 1` could overflow. However, given the constraints, this is unlikely to be an issue in practice.

## When You'll See This Pattern

This greedy "make minimum adjustments" pattern appears in several problems where you need to transform a sequence to meet certain ordering constraints with minimal operations:

1. **Minimum Operations to Make the Array Increasing (LeetCode 1827)** - Almost identical problem but for a 1D array instead of a 2D matrix. The solution approach is exactly the same: process elements sequentially and make the minimum necessary increases.

2. **Candy (LeetCode 135)** - While more complex, it uses a similar two-pass approach to ensure constraints are met with minimal resources.

3. **Minimum Number of Increments on Subarrays to Form a Target Array (LeetCode 1526)** - Another problem where you make minimal adjustments to reach a target state, though with different constraints.

The core pattern is: when you need to transform a sequence to meet ordering constraints and can only increase values, process elements in order and make the minimum necessary adjustment at each step.

## Key Takeaways

1. **Greedy works for monotonic transformations**: When you can only increase values and need to achieve a strictly increasing sequence, the greedy approach of making the minimum necessary adjustment at each step yields the optimal solution.

2. **Process dependencies in order**: For problems where each element depends on the previous one, process them in the natural order of dependency (top to bottom for columns, left to right for rows).

3. **Column-wise vs row-wise processing**: For matrix problems, always consider whether you should process by rows or columns. In this case, columns are independent, so we process each column separately.

4. **Update state as you go**: When you make a change that affects future decisions (like updating a cell value), make sure to actually update the data structure so subsequent calculations use the correct values.

Related problems: [Minimum Operations to Make the Array Increasing](/problem/minimum-operations-to-make-the-array-increasing)
