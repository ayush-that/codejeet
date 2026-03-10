---
title: "How to Solve Score After Flipping Matrix — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Score After Flipping Matrix. Medium difficulty, 80.3% acceptance rate. Topics: Array, Greedy, Bit Manipulation, Matrix."
date: "2026-06-19"
category: "dsa-patterns"
tags: ["score-after-flipping-matrix", "array", "greedy", "bit-manipulation", "medium"]
---

# How to Solve Score After Flipping Matrix

You're given a binary matrix where you can flip entire rows or columns, and your goal is to maximize the sum of the binary numbers represented by each row. The challenge lies in understanding that flipping operations are interdependent—changing a column affects all rows—and finding a greedy strategy that works despite this complexity.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this 3×4 matrix:

```
Initial matrix:
[0,0,1,1]
[1,0,1,0]
[1,1,0,0]
```

**Step 1: Ensure the leftmost column is all 1s**  
The leftmost bit (most significant bit) contributes the most to each row's value. We should flip any row where the first element is 0:

- Row 0 starts with 0 → flip it: `[1,1,0,0]`
- Row 1 starts with 1 → keep it: `[1,0,1,0]`
- Row 2 starts with 1 → keep it: `[1,1,0,0]`

Matrix after row flips:

```
[1,1,0,0]
[1,0,1,0]
[1,1,0,0]
```

**Step 2: Optimize each column (except the first)**  
For each remaining column, we want more 1s than 0s. We can flip columns but not rows (since that would break our first column optimization).

- Column 1: Has `[1,0,1]` → 2 ones, 1 zero → keep it
- Column 2: Has `[0,1,0]` → 1 one, 2 zeros → flip it: `[1,0,1]`
- Column 3: Has `[0,0,0]` → 0 ones, 3 zeros → flip it: `[1,1,1]`

Final matrix:

```
[1,1,1,1]
[1,0,0,1]
[1,1,1,1]
```

**Step 3: Calculate the score**  
Row 0: `1111` = 15  
Row 1: `1001` = 9  
Row 2: `1111` = 15  
Total score = 15 + 9 + 15 = 39

This step-by-step process reveals the greedy insight: maximize the most significant bits first, then independently optimize each remaining column.

## Brute Force Approach

A naive approach would try all possible combinations of row and column flips. For an m×n matrix:

- There are 2^m possible row flip combinations (each row can be flipped or not)
- For each row combination, there are 2^n possible column flip combinations
- Total: O(2^(m+n)) possibilities to check

We'd need to:

1. Generate all row flip combinations
2. For each, generate all column flip combinations
3. Apply the flips and calculate the score
4. Track the maximum score found

This exponential approach becomes impossible for even moderately sized matrices (20×20 would have over 1 trillion combinations).

## Optimized Approach

The key insight is that we can separate the problem into two independent optimizations:

1. **Row optimization for the first column**: The leftmost bit contributes 2^(n-1) to each row's value. We should ensure every row starts with 1 by flipping rows where grid[i][0] = 0.

2. **Column optimization for remaining columns**: For columns 1 through n-1, we want to maximize the number of 1s in that column. Since flipping a row would break our first column optimization, we can only flip columns. For each column j, count how many rows have 1 in that position. If fewer than half the rows have 1, flip the column.

Why this greedy approach works:

- The first column decision is independent and optimal because those bits have the highest weight
- Once we fix the rows, each column decision becomes independent because flipping a column doesn't affect other columns
- For each column, we make the locally optimal choice (maximize 1s), which leads to the globally optimal solution

## Optimal Solution

<div class="code-group">

```python
# Time: O(m * n) | Space: O(1)
def matrixScore(grid):
    """
    Maximize the binary sum of rows by flipping rows and columns.

    Strategy:
    1. Ensure first column is all 1s by flipping rows where needed
    2. For each remaining column, flip if it would give more 1s than 0s
    3. Calculate the final score

    Args:
        grid: List[List[int]] - binary matrix

    Returns:
        int - maximum possible score
    """
    m, n = len(grid), len(grid[0])

    # Step 1: Flip rows to make first column all 1s
    # This maximizes the most significant bit of each row
    for i in range(m):
        if grid[i][0] == 0:
            # Flip the entire row
            for j in range(n):
                grid[i][j] ^= 1  # XOR with 1 toggles 0↔1

    # Step 2: Optimize each remaining column
    # For each column, count how many rows have 1 in that position
    # If less than half, flip the column
    for j in range(1, n):
        count_ones = 0
        # Count ones in current column
        for i in range(m):
            count_ones += grid[i][j]

        # If we have more zeros than ones, flip the column
        # Note: We flip if count_ones < m/2, but since m could be odd,
        # we check count_ones * 2 < m to avoid floating point
        if count_ones * 2 < m:
            # Flip the entire column
            for i in range(m):
                grid[i][j] ^= 1

    # Step 3: Calculate the final score
    score = 0
    for i in range(m):
        # Convert binary row to decimal
        row_value = 0
        for j in range(n):
            # Left shift and add current bit
            row_value = (row_value << 1) | grid[i][j]
        score += row_value

    return score
```

```javascript
// Time: O(m * n) | Space: O(1)
/**
 * Maximize the binary sum of rows by flipping rows and columns.
 *
 * Strategy:
 * 1. Ensure first column is all 1s by flipping rows where needed
 * 2. For each remaining column, flip if it would give more 1s than 0s
 * 3. Calculate the final score
 *
 * @param {number[][]} grid - binary matrix
 * @return {number} maximum possible score
 */
function matrixScore(grid) {
  const m = grid.length;
  const n = grid[0].length;

  // Step 1: Flip rows to make first column all 1s
  // This maximizes the most significant bit of each row
  for (let i = 0; i < m; i++) {
    if (grid[i][0] === 0) {
      // Flip the entire row
      for (let j = 0; j < n; j++) {
        // XOR with 1 toggles 0↔1
        grid[i][j] ^= 1;
      }
    }
  }

  // Step 2: Optimize each remaining column
  // For each column, count how many rows have 1 in that position
  // If less than half, flip the column
  for (let j = 1; j < n; j++) {
    let countOnes = 0;
    // Count ones in current column
    for (let i = 0; i < m; i++) {
      countOnes += grid[i][j];
    }

    // If we have more zeros than ones, flip the column
    // We check countOnes * 2 < m to avoid floating point
    if (countOnes * 2 < m) {
      // Flip the entire column
      for (let i = 0; i < m; i++) {
        grid[i][j] ^= 1;
      }
    }
  }

  // Step 3: Calculate the final score
  let score = 0;
  for (let i = 0; i < m; i++) {
    // Convert binary row to decimal
    let rowValue = 0;
    for (let j = 0; j < n; j++) {
      // Left shift and add current bit
      rowValue = (rowValue << 1) | grid[i][j];
    }
    score += rowValue;
  }

  return score;
}
```

```java
// Time: O(m * n) | Space: O(1)
class Solution {
    /**
     * Maximize the binary sum of rows by flipping rows and columns.
     *
     * Strategy:
     * 1. Ensure first column is all 1s by flipping rows where needed
     * 2. For each remaining column, flip if it would give more 1s than 0s
     * 3. Calculate the final score
     *
     * @param grid binary matrix
     * @return maximum possible score
     */
    public int matrixScore(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        // Step 1: Flip rows to make first column all 1s
        // This maximizes the most significant bit of each row
        for (int i = 0; i < m; i++) {
            if (grid[i][0] == 0) {
                // Flip the entire row
                for (int j = 0; j < n; j++) {
                    // XOR with 1 toggles 0↔1
                    grid[i][j] ^= 1;
                }
            }
        }

        // Step 2: Optimize each remaining column
        // For each column, count how many rows have 1 in that position
        // If less than half, flip the column
        for (int j = 1; j < n; j++) {
            int countOnes = 0;
            // Count ones in current column
            for (int i = 0; i < m; i++) {
                countOnes += grid[i][j];
            }

            // If we have more zeros than ones, flip the column
            // We check countOnes * 2 < m to avoid floating point
            if (countOnes * 2 < m) {
                // Flip the entire column
                for (int i = 0; i < m; i++) {
                    grid[i][j] ^= 1;
                }
            }
        }

        // Step 3: Calculate the final score
        int score = 0;
        for (int i = 0; i < m; i++) {
            // Convert binary row to decimal
            int rowValue = 0;
            for (int j = 0; j < n; j++) {
                // Left shift and add current bit
                rowValue = (rowValue << 1) | grid[i][j];
            }
            score += rowValue;
        }

        return score;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- First pass over rows to flip if needed: O(m × n) in worst case (all rows need flipping)
- Second pass over columns to count ones and potentially flip: O(m × n)
- Final pass to calculate score: O(m × n)
- Total: O(3 × m × n) = O(m × n)

**Space Complexity: O(1)**

- We modify the input matrix in place
- Only use a few integer variables for counting
- No additional data structures proportional to input size

## Common Mistakes

1. **Flipping rows after optimizing columns**: Once we optimize the first column by flipping rows, we cannot flip rows again without breaking that optimization. Some candidates try to re-flip rows later, which destroys the most significant bits.

2. **Incorrect column flip condition**: Using `count_ones < m/2` with integer division can give wrong results for odd m. For m=3, m/2=1 in integer division, but we should flip when count_ones=1 (since 1 < 1.5). The correct check is `count_ones * 2 < m`.

3. **Not understanding bit weights**: Each column contributes differently to the final score. The leftmost column contributes 2^(n-1) per row, while the rightmost contributes only 1. Some candidates treat all columns equally.

4. **Modifying the matrix while counting**: If you flip columns while counting ones in subsequent columns, your counts will be wrong. Always complete counting for a column before deciding whether to flip it.

## When You'll See This Pattern

This problem combines greedy optimization with bit manipulation. You'll see similar patterns in:

1. **Remove All Ones With Row and Column Flips (Medium)**: Also involves flipping rows and columns to achieve a target pattern. The key insight is similar—operations are commutative and can be reordered.

2. **Bulb Switcher (Medium)**: Involves toggling states in a systematic way to reach a target configuration. The pattern of making locally optimal decisions applies here too.

3. **Minimum Operations to Make the Array Alternating (Medium)**: Requires making changes to optimize a pattern, with decisions that affect multiple elements.

The core technique is recognizing when a problem can be decomposed into independent subproblems, and when greedy local optimizations lead to a global optimum.

## Key Takeaways

1. **Prioritize by significance**: When dealing with weighted values (like binary numbers), always optimize the highest-weight elements first. The leftmost bit contributes the most, so ensure it's maximized before considering less significant bits.

2. **Look for independence in operations**: Even though row and column flips seem interdependent, we found a sequence (rows first, then columns) that makes decisions independent. This decomposition is a powerful problem-solving technique.

3. **Greedy can work when local optima align**: This problem demonstrates that sometimes making the best local decision at each step (maximize 1s in each column) leads to the global optimum, especially when decisions don't interfere with each other.

Related problems: [Remove All Ones With Row and Column Flips](/problem/remove-all-ones-with-row-and-column-flips)
