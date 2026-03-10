---
title: "How to Solve Delete Greatest Value in Each Row — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Delete Greatest Value in Each Row. Easy difficulty, 79.8% acceptance rate. Topics: Array, Sorting, Heap (Priority Queue), Matrix, Simulation."
date: "2027-08-16"
category: "dsa-patterns"
tags: ["delete-greatest-value-in-each-row", "array", "sorting", "heap-(priority-queue)", "easy"]
---

# How to Solve Delete Greatest Value in Each Row

This problem asks us to repeatedly remove the largest element from each row of a matrix, sum the maximum of these removed elements each round, and continue until the matrix is empty. What makes this interesting is that we need to track the maximum per row efficiently while ensuring we don't accidentally reuse elements from previous deletions. The core challenge is organizing the data so we can quickly find and remove row maximums.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
grid = [[1, 2, 4],
        [3, 3, 1]]
```

**Step 1: First deletion round**

- Row 0: Largest value is 4
- Row 1: Largest value is 3
- Maximum of deleted values: max(4, 3) = 4
- Remove these elements: Row 0 becomes [1, 2], Row 1 becomes [3, 1]
- Answer so far: 4

**Step 2: Second deletion round**

- Row 0: Largest value is 2
- Row 1: Largest value is 3
- Maximum of deleted values: max(2, 3) = 3
- Remove these elements: Row 0 becomes [1], Row 1 becomes [1]
- Answer so far: 4 + 3 = 7

**Step 3: Third deletion round**

- Row 0: Largest value is 1
- Row 1: Largest value is 1
- Maximum of deleted values: max(1, 1) = 1
- Remove these elements: Both rows become empty
- Final answer: 7 + 1 = 8

Notice that we're essentially comparing the largest remaining elements from each row in each round. This suggests that if we sort each row in descending order, we can simply compare elements at the same column position across rows!

Looking at our sorted rows:

- Row 0 sorted: [4, 2, 1]
- Row 1 sorted: [3, 3, 1]

Now each column represents one deletion round:

- Column 0: max(4, 3) = 4
- Column 1: max(2, 3) = 3
- Column 2: max(1, 1) = 1
- Total: 4 + 3 + 1 = 8

This insight gives us a much cleaner approach than simulating deletions.

## Brute Force Approach

A naive approach would literally simulate the process described:

1. While the matrix has elements:
   - For each row, find the maximum value
   - Track the maximum of these row maximums
   - Remove one instance of each row's maximum
   - Add the tracked maximum to the answer

The problem with this approach is efficiency. Finding the maximum in each row takes O(n) per row, and we need to do this for m rows. Since we have to do this for each column (n times), the total time becomes O(m × n²). Additionally, removing elements from arrays is expensive—either O(n) for shifting elements or O(n) for searching if we mark elements as deleted.

While this brute force approach would technically work for small inputs, it's inefficient and shows poor algorithmic thinking. Interviewers expect candidates to recognize that sorting each row once allows us to process all rounds efficiently.

## Optimal Solution

The key insight is that we don't need to simulate deletions at all. Since we always remove the maximum from each row, and we sum the maximum of these removed values each round, we can:

1. Sort each row in descending order
2. For each column position, find the maximum value across all rows at that position
3. Sum these column maximums

This works because after sorting, the first element of each row is what we'd remove in the first round, the second element is what we'd remove in the second round, and so on.

<div class="code-group">

```python
# Time: O(m × n log n) | Space: O(1) if we modify input, O(m × n) if we don't
def deleteGreatestValue(grid):
    """
    Calculate the sum of maximum values from each deletion round.

    Steps:
    1. Sort each row in descending order
    2. For each column, find the maximum value across all rows
    3. Sum these column maximums
    """
    m = len(grid)      # Number of rows
    n = len(grid[0])   # Number of columns

    # Step 1: Sort each row in descending order
    # This organizes elements so column i contains the i-th largest
    # element from each row, which corresponds to round i deletions
    for row in grid:
        row.sort(reverse=True)

    result = 0

    # Step 2: Process each column (each deletion round)
    # We iterate column by column because each column represents
    # one complete deletion round across all rows
    for col in range(n):
        # Track the maximum value in current column across all rows
        # This is the value we add to result for this round
        max_in_col = 0

        # Step 3: Check each row's value at current column position
        for row in range(m):
            # Update max_in_col if current value is larger
            max_in_col = max(max_in_col, grid[row][col])

        # Step 4: Add column maximum to result
        result += max_in_col

    return result
```

```javascript
// Time: O(m × n log n) | Space: O(1) if we modify input, O(m × n) if we don't
function deleteGreatestValue(grid) {
  /**
   * Calculate the sum of maximum values from each deletion round.
   *
   * Steps:
   * 1. Sort each row in descending order
   * 2. For each column, find the maximum value across all rows
   * 3. Sum these column maximums
   */
  const m = grid.length; // Number of rows
  const n = grid[0].length; // Number of columns

  // Step 1: Sort each row in descending order
  // This organizes elements so column i contains the i-th largest
  // element from each row, which corresponds to round i deletions
  for (let row of grid) {
    row.sort((a, b) => b - a); // Descending order
  }

  let result = 0;

  // Step 2: Process each column (each deletion round)
  // We iterate column by column because each column represents
  // one complete deletion round across all rows
  for (let col = 0; col < n; col++) {
    // Track the maximum value in current column across all rows
    // This is the value we add to result for this round
    let maxInCol = 0;

    // Step 3: Check each row's value at current column position
    for (let row = 0; row < m; row++) {
      // Update maxInCol if current value is larger
      maxInCol = Math.max(maxInCol, grid[row][col]);
    }

    // Step 4: Add column maximum to result
    result += maxInCol;
  }

  return result;
}
```

```java
// Time: O(m × n log n) | Space: O(1) if we modify input, O(m × n) if we don't
import java.util.Arrays;

class Solution {
    public int deleteGreatestValue(int[][] grid) {
        /**
         * Calculate the sum of maximum values from each deletion round.
         *
         * Steps:
         * 1. Sort each row in descending order
         * 2. For each column, find the maximum value across all rows
         * 3. Sum these column maximums
         */
        int m = grid.length;      // Number of rows
        int n = grid[0].length;   // Number of columns

        // Step 1: Sort each row in descending order
        // This organizes elements so column i contains the i-th largest
        // element from each row, which corresponds to round i deletions
        for (int[] row : grid) {
            // Sort in ascending order first
            Arrays.sort(row);
            // Then reverse to get descending order
            for (int i = 0; i < n / 2; i++) {
                int temp = row[i];
                row[i] = row[n - 1 - i];
                row[n - 1 - i] = temp;
            }
        }

        int result = 0;

        // Step 2: Process each column (each deletion round)
        // We iterate column by column because each column represents
        // one complete deletion round across all rows
        for (int col = 0; col < n; col++) {
            // Track the maximum value in current column across all rows
            // This is the value we add to result for this round
            int maxInCol = 0;

            // Step 3: Check each row's value at current column position
            for (int row = 0; row < m; row++) {
                // Update maxInCol if current value is larger
                maxInCol = Math.max(maxInCol, grid[row][col]);
            }

            // Step 4: Add column maximum to result
            result += maxInCol;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n log n)**

- Sorting each row takes O(n log n) time
- We have m rows, so total sorting time is O(m × n log n)
- Finding column maximums takes O(m × n) time (m rows × n columns)
- The O(m × n log n) term dominates, giving us O(m × n log n) overall

**Space Complexity:**

- If we modify the input matrix in-place: O(1) additional space
- If we create new sorted rows: O(m × n) space to store the sorted matrix
- The sorting algorithm itself may use O(log n) stack space for recursion (for some languages' built-in sort)

The space complexity is optimal since we need at least O(m × n) space to store the input anyway.

## Common Mistakes

1. **Forgetting to sort in descending order**: Sorting in ascending order and then taking elements from the end is correct but less intuitive. More importantly, some candidates forget to sort at all and try to find maximums dynamically, which leads to incorrect results when the same row has multiple large values.

2. **Incorrect column iteration bounds**: Since we process columns, we need to iterate `n` times (once per column). A common mistake is to iterate `m` times (once per row) or use the wrong variable in loop conditions.

3. **Not handling rows of different lengths**: While the problem states all rows have the same length, some candidates worry about this edge case unnecessarily. The problem constraints guarantee `grid[i].length == n` for all rows.

4. **Overcomplicating with priority queues**: Some candidates try to use heaps for each row to dynamically track maximums. While this would work (O(m × n log n) time with O(m × n) space), it's more complex than simply sorting. The heap approach would involve maintaining m heaps and repeatedly extracting maxes, which is harder to implement correctly under interview pressure.

## When You'll See This Pattern

This problem teaches the pattern of **"preprocessing for efficient repeated queries"**. By sorting data once, we can answer many subsequent queries efficiently. You'll see this pattern in:

1. **Meeting Rooms II (LeetCode 253)**: Sort meeting start and end times to efficiently track room usage.
2. **Merge Intervals (LeetCode 56)**: Sort intervals by start time to efficiently merge overlapping ones.
3. **Two Sum (when sorted input is allowed)**: Sort the array first to use two pointers for O(n) solution instead of O(n²) brute force.

The key insight is recognizing when an expensive operation (like finding maximums) will be repeated many times, and whether preprocessing (like sorting) can reduce the per-operation cost.

## Key Takeaways

1. **Sorting transforms repeated queries into single passes**: When you need to repeatedly find maximums/minimums, consider if sorting once can help. After sorting, maximums become trivial to access.

2. **Look for mathematical equivalences**: The simulation approach seemed natural, but the sorted-columns approach is mathematically equivalent and more efficient. Always ask: "Is there a simpler way to compute the same result?"

3. **Matrix problems often reduce to row/column operations**: When working with matrices, consider whether operating on rows independently (like sorting each row) followed by column operations can simplify the problem.

Related problems: [Equal Row and Column Pairs](/problem/equal-row-and-column-pairs)
