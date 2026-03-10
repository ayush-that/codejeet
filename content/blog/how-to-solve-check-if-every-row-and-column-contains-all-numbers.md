---
title: "How to Solve Check if Every Row and Column Contains All Numbers — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check if Every Row and Column Contains All Numbers. Easy difficulty, 53.9% acceptance rate. Topics: Array, Hash Table, Matrix."
date: "2027-03-22"
category: "dsa-patterns"
tags:
  ["check-if-every-row-and-column-contains-all-numbers", "array", "hash-table", "matrix", "easy"]
---

# How to Solve "Check if Every Row and Column Contains All Numbers"

This problem asks us to verify whether an `n x n` matrix contains all integers from 1 to `n` in every row and every column. While it sounds straightforward, the challenge lies in efficiently checking both dimensions without excessive memory usage. What makes this interesting is that it's essentially a simplified version of Valid Sudoku—we need to ensure each "unit" (row or column) contains a complete set of numbers without duplicates, but here the valid numbers are strictly 1 through `n`.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
matrix = [[1, 2, 3],
          [3, 1, 2],
          [2, 3, 1]]
```

Here `n = 3`, so valid numbers are {1, 2, 3}.

**Step 1: Check rows**

- Row 0: [1, 2, 3] → contains 1, 2, 3 ✓
- Row 1: [3, 1, 2] → contains 1, 2, 3 ✓
- Row 2: [2, 3, 1] → contains 1, 2, 3 ✓

**Step 2: Check columns**

- Column 0: [1, 3, 2] → contains 1, 2, 3 ✓
- Column 1: [2, 1, 3] → contains 1, 2, 3 ✓
- Column 2: [3, 2, 1] → contains 1, 2, 3 ✓

Since all rows and columns contain all numbers 1-3, this matrix is valid.

Now consider an invalid example:

```
matrix = [[1, 2, 2],
          [2, 3, 1],
          [3, 1, 3]]
```

- Row 0: [1, 2, 2] → missing 3, has duplicate 2 ✗
  We could stop here, but let's check columns too:
- Column 0: [1, 2, 3] ✓
- Column 1: [2, 3, 1] ✓
- Column 2: [2, 1, 3] ✓

Even though columns are valid, the matrix fails because row 0 is invalid.

## Brute Force Approach

A naive approach would be to check each row and column separately by sorting or using nested loops:

1. For each row, create a set of numbers in that row, check if the set size equals `n` and contains only numbers 1 through `n`
2. Repeat the same process for each column
3. Return true only if all checks pass

The problem with this approach is inefficiency: checking each row and column separately with nested loops gives us O(n³) time complexity if we're not careful. Even with sets, we'd need O(n²) space to store all row and column sets simultaneously, or O(n) space if we process them one at a time with O(n²) time.

Here's what the inefficient checking might look like:

```python
# Inefficient approach - O(n³) time
def checkValid(matrix):
    n = len(matrix)

    # Check rows
    for i in range(n):
        seen = set()
        for j in range(n):
            if matrix[i][j] < 1 or matrix[i][j] > n:
                return False
            seen.add(matrix[i][j])
        if len(seen) != n:
            return False

    # Check columns
    for j in range(n):
        seen = set()
        for i in range(n):
            if matrix[i][j] < 1 or matrix[i][j] > n:
                return False
            seen.add(matrix[i][j])
        if len(seen) != n:
            return False

    return True
```

While this works, we can optimize it by being more clever with our data structures.

## Optimal Solution

The optimal approach uses sets to track seen numbers in each row and column simultaneously. We can process the entire matrix in one pass, adding each element to its corresponding row set and column set. If at any point we encounter a duplicate (the number is already in that row's or column's set), or if the number is outside the valid range [1, n], we return false immediately.

The key insight is that we need `n` row sets and `n` column sets, each tracking which numbers have appeared in that particular row or column.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²)
def checkValid(matrix):
    """
    Check if every row and column contains all numbers from 1 to n.

    Args:
        matrix: List[List[int]] - n x n matrix to check

    Returns:
        bool: True if matrix is valid, False otherwise
    """
    n = len(matrix)

    # Create sets for each row and each column
    # We need n row sets and n column sets
    row_sets = [set() for _ in range(n)]
    col_sets = [set() for _ in range(n)]

    # Iterate through each element in the matrix
    for i in range(n):
        for j in range(n):
            num = matrix[i][j]

            # Check if number is within valid range [1, n]
            if num < 1 or num > n:
                return False

            # Check for duplicates in current row
            # If num already exists in row_sets[i], it's a duplicate
            if num in row_sets[i]:
                return False
            row_sets[i].add(num)

            # Check for duplicates in current column
            # If num already exists in col_sets[j], it's a duplicate
            if num in col_sets[j]:
                return False
            col_sets[j].add(num)

    # If we've made it here, all rows and columns are valid
    return True
```

```javascript
// Time: O(n²) | Space: O(n²)
/**
 * Check if every row and column contains all numbers from 1 to n.
 * @param {number[][]} matrix - n x n matrix to check
 * @return {boolean} True if matrix is valid, False otherwise
 */
function checkValid(matrix) {
  const n = matrix.length;

  // Create arrays of sets for rows and columns
  // Each row and column needs its own set to track seen numbers
  const rowSets = Array.from({ length: n }, () => new Set());
  const colSets = Array.from({ length: n }, () => new Set());

  // Iterate through each element in the matrix
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const num = matrix[i][j];

      // Check if number is within valid range [1, n]
      if (num < 1 || num > n) {
        return false;
      }

      // Check for duplicates in current row
      // If the row's set already contains num, it's a duplicate
      if (rowSets[i].has(num)) {
        return false;
      }
      rowSets[i].add(num);

      // Check for duplicates in current column
      // If the column's set already contains num, it's a duplicate
      if (colSets[j].has(num)) {
        return false;
      }
      colSets[j].add(num);
    }
  }

  // All checks passed
  return true;
}
```

```java
// Time: O(n²) | Space: O(n²)
import java.util.HashSet;
import java.util.Set;

class Solution {
    /**
     * Check if every row and column contains all numbers from 1 to n.
     * @param matrix n x n matrix to check
     * @return true if matrix is valid, false otherwise
     */
    public boolean checkValid(int[][] matrix) {
        int n = matrix.length;

        // Create arrays of sets for rows and columns
        // Each row and column needs its own HashSet to track seen numbers
        Set<Integer>[] rowSets = new HashSet[n];
        Set<Integer>[] colSets = new HashSet[n];

        // Initialize all sets
        for (int i = 0; i < n; i++) {
            rowSets[i] = new HashSet<>();
            colSets[i] = new HashSet<>();
        }

        // Iterate through each element in the matrix
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                int num = matrix[i][j];

                // Check if number is within valid range [1, n]
                if (num < 1 || num > n) {
                    return false;
                }

                // Check for duplicates in current row
                // If the row's set already contains num, it's a duplicate
                if (rowSets[i].contains(num)) {
                    return false;
                }
                rowSets[i].add(num);

                // Check for duplicates in current column
                // If the column's set already contains num, it's a duplicate
                if (colSets[j].contains(num)) {
                    return false;
                }
                colSets[j].add(num);
            }
        }

        // All checks passed
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We iterate through each of the n² elements exactly once
- For each element, we perform O(1) operations (set lookups and insertions)
- The early return on finding invalid elements doesn't change the worst-case complexity, but improves average case

**Space Complexity: O(n²)**

- We maintain n row sets and n column sets
- In the worst case, each set contains n elements
- Total space = 2 × n × n = O(n²)
- This is optimal for the general case since we need to track all numbers in all rows and columns

## Common Mistakes

1. **Forgetting to check the number range**: Candidates often only check for duplicates but forget that numbers must be between 1 and n inclusive. A matrix with 0 or n+1 would incorrectly pass duplicate checks but fail the range requirement.

2. **Using a single set for all rows/columns**: Some candidates try to reuse the same set for checking multiple rows or columns without clearing it. This causes numbers from previous rows to interfere with current row checks.

3. **Not checking both rows AND columns**: It's easy to validate rows correctly but forget to check columns, or vice versa. The problem explicitly requires both to be valid.

4. **Off-by-one errors with n**: When n=3, valid numbers are 1,2,3. Some candidates check `num <= n` instead of `num <= n && num >= 1`, or use 0-based indexing incorrectly when checking ranges.

## When You'll See This Pattern

This "per-unit validation with sets" pattern appears in several matrix/array validation problems:

1. **Valid Sudoku (Medium)**: The classic application. You need to check 9 rows, 9 columns, and 9 3x3 sub-boxes for duplicates 1-9. The pattern is identical but with three types of units instead of two.

2. **First Completely Painted Row or Column (Medium)**: While not exactly the same, it involves tracking completion status of rows and columns in a matrix, which uses similar row/column tracking structures.

3. **Matrix Diagonal Sum (Easy)**: Though simpler, it shares the pattern of processing matrix elements with attention to their positions (diagonals instead of rows/columns).

The core technique—maintaining separate data structures for different "dimensions" or "groupings" of elements—is widely applicable whenever you need to validate constraints across multiple axes or partitions of data.

## Key Takeaways

1. **Use dedicated tracking per dimension**: When validating constraints across rows, columns, or other partitions, maintain separate data structures (sets, arrays, etc.) for each unit you're checking.

2. **Early termination is your friend**: As soon as you find any violation (duplicate or out-of-range number), return false immediately. Don't waste time checking the rest of the matrix.

3. **Range checking matters**: Always validate that numbers fall within the expected range, not just that they're unique within their unit. Two different types of validation are often required.

Related problems: [Valid Sudoku](/problem/valid-sudoku), [Matrix Diagonal Sum](/problem/matrix-diagonal-sum), [First Completely Painted Row or Column](/problem/first-completely-painted-row-or-column)
