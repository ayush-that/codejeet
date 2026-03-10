---
title: "How to Solve Row With Maximum Ones — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Row With Maximum Ones. Easy difficulty, 74.3% acceptance rate. Topics: Array, Matrix."
date: "2027-03-06"
category: "dsa-patterns"
tags: ["row-with-maximum-ones", "array", "matrix", "easy"]
---

# How to Solve Row With Maximum Ones

You're given a binary matrix (only 0s and 1s) and need to find which row has the most 1s. If multiple rows tie for the maximum, return the smallest row index. While this seems straightforward, the challenge lies in implementing it cleanly without unnecessary complexity, and handling edge cases properly.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
mat = [
    [0, 1, 1, 0],  # Row 0: 2 ones
    [1, 1, 1, 1],  # Row 1: 4 ones
    [0, 0, 1, 0],  # Row 2: 1 one
    [1, 0, 0, 1]   # Row 3: 2 ones
]
```

**Step-by-step process:**

1. **Row 0:** Count ones = 2. Current max = 2, row index = 0
2. **Row 1:** Count ones = 4. New max = 4, row index = 1 (4 > 2)
3. **Row 2:** Count ones = 1. Max stays 4, row index stays 1 (1 < 4)
4. **Row 3:** Count ones = 2. Max stays 4, row index stays 1 (2 < 4)

Result: Row 1 has 4 ones → return `[1, 4]`

The key insight: We need to count 1s in each row and track the maximum count along with the smallest row index when there's a tie.

## Brute Force Approach

The most straightforward approach is exactly what we visualized:

1. Initialize variables to track the maximum count and corresponding row index
2. For each row in the matrix:
   - Count the number of 1s in that row
   - If this count is greater than current maximum, update both max and row index
   - If equal to current maximum, keep the smaller row index (but since we process rows in order, we automatically get the smaller index when we encounter the first maximum)

This brute force approach is actually optimal for this problem! There's no way to avoid examining every element in the matrix since we need to count all the 1s. Any "optimization" would still require O(m×n) time in the worst case.

However, let's discuss what a naive candidate might get wrong:

- Trying to use binary search on each row (since it's sorted? The problem doesn't say rows are sorted!)
- Overcomplicating with hash maps or extra data structures
- Not handling the "smallest row index" tie-breaker correctly

## Optimal Solution

Since we must examine every element to count the 1s, our solution is already optimal. The key is to implement it cleanly and efficiently.

<div class="code-group">

```python
# Time: O(m * n) - We visit every cell in the m x n matrix
# Space: O(1) - We only use a few variables, no extra data structures
def rowAndMaximumOnes(mat):
    """
    Finds the row with the maximum number of 1s.

    Args:
        mat: List[List[int]] - Binary matrix of 0s and 1s

    Returns:
        List[int] - [row_index, max_count]
    """
    max_count = -1  # Initialize to -1 so any count (even 0) will be larger
    max_row = 0     # Track the row index with maximum ones

    # Iterate through each row with its index
    for i, row in enumerate(mat):
        # Count ones in current row using sum() since values are 0 or 1
        current_count = sum(row)

        # If current row has more ones than our current maximum
        if current_count > max_count:
            max_count = current_count
            max_row = i  # Update to current row index
        # Note: We don't need to handle equal case separately because
        # we process rows in order and only update when count is GREATER

    return [max_row, max_count]
```

```javascript
// Time: O(m * n) - We visit every cell in the m x n matrix
// Space: O(1) - We only use a few variables, no extra data structures
function rowAndMaximumOnes(mat) {
  /**
   * Finds the row with the maximum number of 1s.
   *
   * @param {number[][]} mat - Binary matrix of 0s and 1s
   * @return {number[]} - [row_index, max_count]
   */
  let maxCount = -1; // Initialize to -1 so any count (even 0) will be larger
  let maxRow = 0; // Track the row index with maximum ones

  // Iterate through each row with its index
  for (let i = 0; i < mat.length; i++) {
    const row = mat[i];
    let currentCount = 0;

    // Count ones in current row
    for (let j = 0; j < row.length; j++) {
      currentCount += row[j]; // Add 1 if cell is 1, 0 if cell is 0
    }

    // If current row has more ones than our current maximum
    if (currentCount > maxCount) {
      maxCount = currentCount;
      maxRow = i; // Update to current row index
    }
    // Note: We don't need to handle equal case separately because
    // we process rows in order and only update when count is GREATER
  }

  return [maxRow, maxCount];
}
```

```java
// Time: O(m * n) - We visit every cell in the m x n matrix
// Space: O(1) - We only use a few variables, no extra data structures
public int[] rowAndMaximumOnes(int[][] mat) {
    /**
     * Finds the row with the maximum number of 1s.
     *
     * @param mat - Binary matrix of 0s and 1s
     * @return int[] - [row_index, max_count]
     */
    int maxCount = -1;  // Initialize to -1 so any count (even 0) will be larger
    int maxRow = 0;     // Track the row index with maximum ones

    // Iterate through each row
    for (int i = 0; i < mat.length; i++) {
        int currentCount = 0;

        // Count ones in current row
        for (int j = 0; j < mat[i].length; j++) {
            currentCount += mat[i][j];  // Add 1 if cell is 1, 0 if cell is 0
        }

        // If current row has more ones than our current maximum
        if (currentCount > maxCount) {
            maxCount = currentCount;
            maxRow = i;  // Update to current row index
        }
        // Note: We don't need to handle equal case separately because
        // we process rows in order and only update when count is GREATER
    }

    return new int[]{maxRow, maxCount};
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We iterate through every row (m rows)
- For each row, we iterate through every column (n columns)
- In the worst case, we examine every cell in the matrix exactly once
- This is optimal because we must examine each element to count the 1s

**Space Complexity: O(1)**

- We only use a constant amount of extra space:
  - `max_count` and `max_row` variables (2 integers)
  - Loop counters (i, j)
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting the tie-breaker rule**: The problem states that if multiple rows have the same maximum count, return the smallest row index. Some candidates add an `else if (currentCount == maxCount)` condition and compare indices, but this is unnecessary if we only update when `currentCount > maxCount` and process rows in order from 0 upwards.

2. **Initializing max_count incorrectly**: If you initialize `max_count = 0`, you'll have issues with all-zero rows. A row with 0 ones should still be considered. Initialize to `-1` so any count (including 0) will be larger.

3. **Assuming rows are sorted**: The problem doesn't state that rows are sorted. Don't try to use binary search to find the first 1 in each row unless you verify the input guarantees sorted rows.

4. **Off-by-one errors in nested loops**: When accessing `mat[i][j]`, ensure `i` is within `[0, m-1]` and `j` is within `[0, n-1]`. Using `<=` instead of `<` is a common mistake.

## When You'll See This Pattern

This problem teaches the fundamental pattern of **iterating through a 2D array while tracking extremal values**. You'll see variations of this pattern in many matrix problems:

1. **Richest Customer Wealth (LeetCode 1672)** - Similar structure but sums rows instead of counting 1s.
2. **Toeplitz Matrix (LeetCode 766)** - Also involves iterating through a matrix with careful index management.
3. **Matrix Diagonal Sum (LeetCode 1572)** - Another matrix traversal problem with a different traversal pattern.
4. **K Weakest Rows in a Matrix (LeetCode 1337)** - A more complex version where you need to sort rows by their count of 1s.

The core technique of row-wise traversal with aggregation and comparison is fundamental to matrix problems.

## Key Takeaways

1. **When you need to examine every element, O(m×n) is optimal**: For problems requiring information from every cell, don't overthink optimization—sometimes the straightforward solution is optimal.

2. **Process data in the required order to simplify logic**: By processing rows from 0 to m-1 and only updating when we find a strictly larger count, we automatically handle the "smallest index" tie-breaker without extra conditions.

3. **Initialize tracking variables carefully**: Use `-1` instead of `0` when you need to handle the case where all values might be zero. Think about what makes sense for your specific problem constraints.

[Practice this problem on CodeJeet](/problem/row-with-maximum-ones)
