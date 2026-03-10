---
title: "How to Solve First Completely Painted Row or Column — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode First Completely Painted Row or Column. Medium difficulty, 63.9% acceptance rate. Topics: Array, Hash Table, Matrix."
date: "2026-07-29"
category: "dsa-patterns"
tags: ["first-completely-painted-row-or-column", "array", "hash-table", "matrix", "medium"]
---

# How to Solve First Completely Painted Row or Column

This problem asks us to simulate painting cells in a matrix based on a sequence of numbers, then determine the earliest point when an entire row or column becomes fully painted. The challenge lies in efficiently tracking which cells have been painted and quickly checking when rows/columns become complete. What makes this interesting is that we need to coordinate between two different data structures (array and matrix) while maintaining efficient row/column completion checks.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
arr = [1, 3, 4, 2]
mat = [[1, 2],
       [3, 4]]
m = 2, n = 2
```

We need to find the smallest index `i` where after painting `arr[i]`, either:

1. All cells in some row are painted
2. All cells in some column are painted

**Step 1:** `i = 0`, `arr[0] = 1`

- Find cell containing `1`: position (0, 0)
- Paint cell (0, 0)
- Row 0: 1 of 2 cells painted (not complete)
- Column 0: 1 of 2 cells painted (not complete)

**Step 2:** `i = 1`, `arr[1] = 3`

- Find cell containing `3`: position (1, 0)
- Paint cell (1, 0)
- Row 0: still 1/2 painted
- Row 1: 1/2 painted
- Column 0: 2/2 painted! ✅ Column 0 is complete

We found our answer at `i = 1`. The key insight is that we need to quickly:

1. Find which cell contains a given value
2. Track how many painted cells are in each row and column
3. Detect when a row or column reaches `n` or `m` painted cells

## Brute Force Approach

A naive approach would be:

1. For each value in `arr`, search through the entire matrix to find its position
2. Mark that cell as painted
3. After each paint operation, check all rows and columns to see if any are complete

Here's what that might look like:

<div class="code-group">

```python
# Time: O(k * m * n) where k = len(arr) = m*n
# Space: O(m * n) for the visited matrix
def bruteForce(arr, mat):
    m, n = len(mat), len(mat[0])
    visited = [[False] * n for _ in range(m)]

    for i, val in enumerate(arr):
        # Step 1: Find the cell containing val - O(m*n)
        found = False
        for r in range(m):
            for c in range(n):
                if mat[r][c] == val:
                    visited[r][c] = True
                    found = True
                    break
            if found:
                break

        # Step 2: Check all rows - O(m*n)
        for r in range(m):
            row_complete = True
            for c in range(n):
                if not visited[r][c]:
                    row_complete = False
                    break
            if row_complete:
                return i

        # Step 3: Check all columns - O(m*n)
        for c in range(n):
            col_complete = True
            for r in range(m):
                if not visited[r][c]:
                    col_complete = False
                    break
            if col_complete:
                return i

    return -1
```

</div>

**Why this is inefficient:**

- Finding each value takes O(m×n) time
- Checking all rows and columns after each paint takes O(m×n) time
- With k = m×n operations, total time is O((m×n)²), which is too slow for typical constraints

## Optimized Approach

The key insight is that we can use **hashing** to optimize both finding cells and tracking completion:

1. **Map values to positions**: Since all values from 1 to m×n appear exactly once in the matrix, we can create a dictionary mapping each value to its (row, col) position. This lets us find any cell in O(1) time.

2. **Track row/column counts**: Instead of checking entire rows/columns after each paint, maintain two arrays:
   - `rowCount[r]`: how many cells are painted in row r
   - `colCount[c]`: how many cells are painted in column c

   When we paint a cell at (r, c), increment both counters. A row is complete when `rowCount[r] == n`, and a column is complete when `colCount[c] == m`.

3. **Early termination**: We can return as soon as any row or column becomes complete.

This approach reduces the time complexity from O((m×n)²) to O(m×n), which is optimal since we need to process each value at least once.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(m * n) - we process each cell at most once
# Space: O(m * n) - for the position mapping
def firstCompleteIndex(arr, mat):
    m, n = len(mat), len(mat[0])

    # Step 1: Create a mapping from value to (row, col) position
    # This allows O(1) lookup for any value
    position = {}
    for r in range(m):
        for c in range(n):
            position[mat[r][c]] = (r, c)

    # Step 2: Initialize counters for rows and columns
    # rowCount[r] tracks how many cells are painted in row r
    # colCount[c] tracks how many cells are painted in column c
    rowCount = [0] * m
    colCount = [0] * n

    # Step 3: Process each value in arr in order
    for i, val in enumerate(arr):
        # Get the position of this value in the matrix
        r, c = position[val]

        # Mark this cell as painted by incrementing counters
        rowCount[r] += 1
        colCount[c] += 1

        # Check if this paint operation completed a row or column
        # A row is complete when all n cells in that row are painted
        # A column is complete when all m cells in that column are painted
        if rowCount[r] == n or colCount[c] == m:
            return i

    # According to problem constraints, we should always find an answer
    # But return -1 as a fallback
    return -1
```

```javascript
// Time: O(m * n) - we process each cell at most once
// Space: O(m * n) - for the position mapping
function firstCompleteIndex(arr, mat) {
  const m = mat.length;
  const n = mat[0].length;

  // Step 1: Create a mapping from value to [row, col] position
  // This allows O(1) lookup for any value
  const position = new Map();
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      position.set(mat[r][c], [r, c]);
    }
  }

  // Step 2: Initialize counters for rows and columns
  // rowCount[r] tracks how many cells are painted in row r
  // colCount[c] tracks how many cells are painted in column c
  const rowCount = new Array(m).fill(0);
  const colCount = new Array(n).fill(0);

  // Step 3: Process each value in arr in order
  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];
    // Get the position of this value in the matrix
    const [r, c] = position.get(val);

    // Mark this cell as painted by incrementing counters
    rowCount[r]++;
    colCount[c]++;

    // Check if this paint operation completed a row or column
    // A row is complete when all n cells in that row are painted
    // A column is complete when all m cells in that column are painted
    if (rowCount[r] === n || colCount[c] === m) {
      return i;
    }
  }

  // According to problem constraints, we should always find an answer
  // But return -1 as a fallback
  return -1;
}
```

```java
// Time: O(m * n) - we process each cell at most once
// Space: O(m * n) - for the position mapping
public int firstCompleteIndex(int[] arr, int[][] mat) {
    int m = mat.length;
    int n = mat[0].length;

    // Step 1: Create a mapping from value to position (row, col)
    // This allows O(1) lookup for any value
    Map<Integer, int[]> position = new HashMap<>();
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            // Store as int array with [row, col]
            position.put(mat[r][c], new int[]{r, c});
        }
    }

    // Step 2: Initialize counters for rows and columns
    // rowCount[r] tracks how many cells are painted in row r
    // colCount[c] tracks how many cells are painted in column c
    int[] rowCount = new int[m];
    int[] colCount = new int[n];

    // Step 3: Process each value in arr in order
    for (int i = 0; i < arr.length; i++) {
        int val = arr[i];
        // Get the position of this value in the matrix
        int[] pos = position.get(val);
        int r = pos[0];
        int c = pos[1];

        // Mark this cell as painted by incrementing counters
        rowCount[r]++;
        colCount[c]++;

        // Check if this paint operation completed a row or column
        // A row is complete when all n cells in that row are painted
        // A column is complete when all m cells in that column are painted
        if (rowCount[r] == n || colCount[c] == m) {
            return i;
        }
    }

    // According to problem constraints, we should always find an answer
    // But return -1 as a fallback
    return -1;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- Building the position map: O(m × n) - we visit each cell once
- Processing the array: O(m × n) - in worst case, we process all values
- Each operation (lookup, increment, check) is O(1)
- Total: O(m × n) + O(m × n) = O(m × n)

**Space Complexity: O(m × n)**

- Position map stores m × n entries
- Row and column counters use O(m + n) space
- Dominated by the position map: O(m × n)

This is optimal because we must at least look at each cell once to build the mapping.

## Common Mistakes

1. **Forgetting that arrays are 0-indexed**: The problem states "0-indexed" but it's easy to accidentally use 1-based indexing when checking completion conditions. Remember: a row with `n` columns is complete when `rowCount[r] == n`, not `n-1`.

2. **Checking completion too frequently**: Some candidates check all rows and columns after each paint operation (like the brute force). This adds an unnecessary O(m×n) factor. The optimized approach only checks the specific row and column affected by the current paint.

3. **Incorrect completion condition**: Mixing up when a row vs column is complete. A row with `n` columns needs `n` painted cells. A column with `m` rows needs `m` painted cells. These are different numbers!

4. **Not using the uniqueness guarantee**: The problem states all integers from 1 to m×n appear exactly once. This guarantees our position map will have unique keys and we won't have conflicts. Some candidates overcomplicate by handling duplicates.

## When You'll See This Pattern

This problem combines two common patterns:

1. **Value-to-position mapping**: When you need to quickly find where a value appears in a grid. Similar problems:
   - [Sudoku Solver](/problems/sudoku-solver) - mapping numbers to their positions for constraint checking
   - [Word Search](/problems/word-search) - though typically uses DFS, the concept of tracking positions is similar

2. **Row/column counting with early termination**: Tracking counts across dimensions to detect completion. Similar problems:
   - [Check if Every Row and Column Contains All Numbers](/problems/check-if-every-row-and-column-contains-all-numbers) - directly related, checks for completeness
   - [Valid Sudoku](/problems/valid-sudoku) - uses row, column, and subgrid tracking
   - [Projection Area of 3D Shapes](/problems/projection-area-of-3d-shapes) - aggregates row/column maximums

## Key Takeaways

1. **Preprocessing is powerful**: When you need to repeatedly find elements in a data structure, building a reverse mapping (value → position) upfront often turns O(n) searches into O(1) lookups.

2. **Track aggregates, not individual states**: Instead of checking if every cell in a row is painted (O(n) each time), track a counter and check when it reaches the threshold (O(1)).

3. **Leverage problem constraints**: The guarantee that all values from 1 to m×n appear exactly once tells us we can safely build a position map without worrying about collisions or missing values.

Related problems: [Check if Every Row and Column Contains All Numbers](/problem/check-if-every-row-and-column-contains-all-numbers), [Difference Between Ones and Zeros in Row and Column](/problem/difference-between-ones-and-zeros-in-row-and-column)
