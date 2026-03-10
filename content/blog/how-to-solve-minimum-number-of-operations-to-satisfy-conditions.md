---
title: "How to Solve Minimum Number of Operations to Satisfy Conditions — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Operations to Satisfy Conditions. Medium difficulty, 41.7% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2029-12-07"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-operations-to-satisfy-conditions",
    "array",
    "dynamic-programming",
    "matrix",
    "medium",
  ]
---

# Solving Minimum Number of Operations to Satisfy Conditions

You're given an `m x n` matrix where you can change any cell to any non-negative integer. Your goal is to make every cell equal to the cell directly below it (for all rows except the last) and every cell equal to the cell to its right (for all columns except the last), using the minimum number of operations. This problem is tricky because the constraints create a domino effect - changing one cell affects what values you can choose for others, and you need to find the optimal pattern that minimizes total changes.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [[1, 2, 3],
        [1, 3, 3]]
```

**Step 1: Understanding the constraints**

- Row constraint: `grid[0][j] == grid[1][j]` for all columns j
- Column constraint: `grid[i][0] == grid[i][1]` and `grid[i][1] == grid[i][2]` for all rows i

**Step 2: What does this mean practically?**
Looking at the row constraint first: For each column, both rows must have the same value. So column 0 must have the same value in both rows, column 1 must have the same value in both rows, etc.

Looking at the column constraint: For each row, all cells in that row must have the same value. So row 0 must have all cells equal, row 1 must have all cells equal.

**Step 3: Combining the constraints**
If all cells in row 0 must be equal (column constraint), and all cells in row 1 must be equal (column constraint), AND for each column the two rows must be equal (row constraint), then ALL cells in the entire matrix must be equal to the same value!

**Step 4: Finding the optimal value**
We need to choose a single value that minimizes the number of changes. Looking at our example:

- Current values: [1, 2, 3, 1, 3, 3]
- If we choose value 1: Need to change 2→1, 3→1, 3→1, 3→1 = 4 changes
- If we choose value 2: Need to change 1→2, 3→2, 1→2, 3→2, 3→2 = 5 changes
- If we choose value 3: Need to change 1→3, 2→3, 1→3 = 3 changes

So the optimal solution is to make all cells equal to 3, requiring 3 operations.

## Brute Force Approach

A naive approach might try to consider all possible assignments to the matrix. Since each cell can be any non-negative integer, there are infinite possibilities! Even if we limit ourselves to values that appear in the matrix, we'd need to try every combination of values for the pattern that emerges from the constraints.

Actually, from our visual walkthrough, we can see the key insight: **All cells must be equal to the same value**. Let's prove this more formally:

1. Column constraint says: `grid[i][j] == grid[i][j+1]` for all valid j
   This means within each row, all cells are equal.
   So row i has value `r_i` for all its cells.

2. Row constraint says: `grid[i][j] == grid[i+1][j]` for all valid i
   This means for each column j, all rows have the same value.
   But from step 1, row i has value `r_i` for all columns.
   So `r_i == r_{i+1}` for all i.

3. Therefore, `r_0 == r_1 == ... == r_{m-1}`.
   All rows have the same value, so ALL cells in the matrix must be equal.

Thus the brute force would be: For each possible value (from 0 to some maximum), count how many cells need to be changed to that value, and take the minimum. But what's the maximum value we need to consider? We only need to consider values that appear in the matrix, plus potentially 0 if it doesn't appear (since 0 is a valid non-negative integer).

## Optimized Approach

The key insight is that all cells must be equal, so we need to find the single value that minimizes the number of changes. This becomes a frequency counting problem:

1. **Flatten the matrix** into a list of all values
2. **Count frequencies** of each value
3. **Find the value with maximum frequency** - changing all cells to this value requires the fewest operations
4. **Calculate operations**: total cells minus frequency of most common value

Wait, there's a subtlety: We need to consider ALL non-negative integers, not just those in the matrix. What if choosing a value NOT in the matrix gives fewer operations? Let's think...

If we choose a value V not in the matrix:

- We need to change ALL cells to V: m × n operations
- If we choose a value W that appears k times in the matrix:
  - We need to change (m × n - k) cells to W

Since k ≥ 1 for any value in the matrix, and m × n - k ≤ m × n - 1 < m × n, choosing a value from the matrix is always better than choosing one not in the matrix.

So our algorithm is:

1. Count frequency of each value in the matrix
2. Find the value with maximum frequency
3. Minimum operations = total cells - max frequency

## Optimal Solution

<div class="code-group">

```python
# Time: O(m * n) | Space: O(m * n) for storing frequency counts
def minOperations(grid):
    """
    Calculate minimum operations to make all cells equal given the constraints.

    Args:
        grid: 2D list of integers

    Returns:
        Minimum number of cell changes needed
    """
    m, n = len(grid), len(grid[0])

    # Step 1: Count frequency of each value in the matrix
    freq = {}
    for i in range(m):
        for j in range(n):
            val = grid[i][j]
            freq[val] = freq.get(val, 0) + 1

    # Step 2: Find the maximum frequency
    # If no values (empty matrix), return 0
    if not freq:
        return 0

    max_freq = max(freq.values())

    # Step 3: Minimum operations = total cells - cells that already have the most common value
    # We need to change all cells except those already equal to the optimal value
    return m * n - max_freq
```

```javascript
// Time: O(m * n) | Space: O(m * n) for storing frequency counts
function minOperations(grid) {
  /**
   * Calculate minimum operations to make all cells equal given the constraints.
   *
   * @param {number[][]} grid - 2D array of integers
   * @return {number} Minimum number of cell changes needed
   */
  const m = grid.length;
  const n = grid[0].length;

  // Step 1: Count frequency of each value in the matrix
  const freq = new Map();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const val = grid[i][j];
      freq.set(val, (freq.get(val) || 0) + 1);
    }
  }

  // Step 2: Find the maximum frequency
  // If no values (empty matrix), return 0
  if (freq.size === 0) {
    return 0;
  }

  let maxFreq = 0;
  for (const count of freq.values()) {
    maxFreq = Math.max(maxFreq, count);
  }

  // Step 3: Minimum operations = total cells - cells that already have the most common value
  // We need to change all cells except those already equal to the optimal value
  return m * n - maxFreq;
}
```

```java
// Time: O(m * n) | Space: O(m * n) for storing frequency counts
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int minOperations(int[][] grid) {
        /**
         * Calculate minimum operations to make all cells equal given the constraints.
         *
         * @param grid 2D array of integers
         * @return Minimum number of cell changes needed
         */
        int m = grid.length;
        int n = grid[0].length;

        // Step 1: Count frequency of each value in the matrix
        Map<Integer, Integer> freq = new HashMap<>();
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int val = grid[i][j];
                freq.put(val, freq.getOrDefault(val, 0) + 1);
            }
        }

        // Step 2: Find the maximum frequency
        // If no values (empty matrix), return 0
        if (freq.isEmpty()) {
            return 0;
        }

        int maxFreq = 0;
        for (int count : freq.values()) {
            maxFreq = Math.max(maxFreq, count);
        }

        // Step 3: Minimum operations = total cells - cells that already have the most common value
        // We need to change all cells except those already equal to the optimal value
        return m * n - maxFreq;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We iterate through every cell in the m × n matrix once to count frequencies
- Finding the maximum frequency takes O(k) where k is the number of distinct values, which is at most m × n
- Total: O(m × n) + O(k) = O(m × n)

**Space Complexity: O(m × n) in the worst case**

- In the worst case, every cell has a unique value, so our frequency map stores m × n entries
- In practice, if values repeat, space complexity is O(k) where k is the number of distinct values
- The input grid itself is O(m × n) but we don't count that as extra space

## Common Mistakes

1. **Not realizing all cells must be equal**: The most common mistake is trying to solve this as a complex constraint satisfaction problem without recognizing that the constraints force all cells to the same value. Always look for implications of combined constraints.

2. **Considering values not in the matrix**: Some candidates waste time considering whether a value not in the matrix could be optimal. As we proved, if a value appears k times, changing to it requires m×n-k operations, while a new value requires m×n operations. Since k ≥ 1, existing values are always better.

3. **Forgetting about the 0 value**: The problem says "any non-negative number," which includes 0. If 0 appears in the matrix, it should be considered. But as we established, we only need to consider values that actually appear.

4. **Edge case: empty matrix**: Always check for edge cases. If m=0 or n=0, we have an empty matrix and need 0 operations. Our code handles this since m×n would be 0.

## When You'll See This Pattern

This problem combines **constraint analysis** with **frequency counting optimization**:

1. **Constraint Propagation Problems**: Similar to problems where constraints force certain relationships, like [Candy](/problem/candy) where ratings constraints force minimum candies. The key is to deduce what the constraints imply about the solution structure.

2. **Majority Element Problems**: Once we deduce all cells must be equal, this becomes similar to finding the majority element that minimizes changes, like in problems where you want to make all elements equal with minimal operations.

3. **Matrix Constraint Problems**: Problems with row and column constraints often have hidden simplifications. For example, some Sudoku-style constraints can be analyzed to reduce search space.

## Key Takeaways

1. **Always analyze constraint implications first**: Before writing code, spend time understanding what the constraints actually mean. Combined constraints often simplify the problem dramatically.

2. **Frequency counting is powerful for minimization**: When you need to choose a value that minimizes changes, finding the most frequent value is often the answer.

3. **Prove your assumptions**: Don't just assume choosing from existing values is optimal - prove it mathematically. This shows deeper understanding and catches edge cases.

Related problems: [Candy](/problem/candy), [Distribute Candies](/problem/distribute-candies), [Minimum Cost of Buying Candies With Discount](/problem/minimum-cost-of-buying-candies-with-discount)
