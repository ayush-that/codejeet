---
title: "How to Solve Count Submatrices With Equal Frequency of X and Y — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Submatrices With Equal Frequency of X and Y. Medium difficulty, 51.5% acceptance rate. Topics: Array, Matrix, Prefix Sum."
date: "2029-07-02"
category: "dsa-patterns"
tags:
  ["count-submatrices-with-equal-frequency-of-x-and-y", "array", "matrix", "prefix-sum", "medium"]
---

# How to Solve Count Submatrices With Equal Frequency of X and Y

This problem asks us to count all submatrices that start at the top-left corner `(0, 0)` and contain an equal number of `'X'` and `'Y'` characters, with at least one `'X'`. The tricky part is that we need to efficiently count all possible submatrices ending at various positions, which could be O(n⁴) if done naively. The key insight is transforming this into a prefix sum problem where we track the difference between X and Y counts.

## Visual Walkthrough

Let's walk through a small example to build intuition:

```
Grid:
X . Y
Y X .
```

We're only counting submatrices that start at `(0, 0)`. Let's list them:

1. Single cell `(0,0)`: Contains 1 X, 0 Y → doesn't satisfy (needs equal counts)
2. First row `(0,0)-(0,1)`: 1 X, 0 Y → doesn't satisfy
3. First row `(0,0)-(0,2)`: 1 X, 1 Y → satisfies! (equal counts and has at least one X)
4. First column `(0,0)-(1,0)`: 1 X, 1 Y → satisfies!
5. `(0,0)-(1,1)`: 2 X, 1 Y → doesn't satisfy
6. `(0,0)-(1,2)`: 2 X, 2 Y → satisfies!

Total: 3 valid submatrices.

The challenge is counting these efficiently for larger grids. Notice that for any submatrix ending at `(r, c)`, the condition "equal X and Y" means: `(total X) - (total Y) = 0`. If we compute prefix sums of `(X_count - Y_count)` from `(0,0)` to each position, we can check this difference.

## Brute Force Approach

The brute force approach would check every possible submatrix starting at `(0,0)`:

1. For every possible ending row `r` (0 to m-1)
2. For every possible ending column `c` (0 to n-1)
3. Count X and Y in the submatrix `(0,0)` to `(r,c)`
4. If X == Y and X > 0, count it

This requires O(m²n²) time because for each `(r,c)`, we might recount the entire submatrix. For a 100×100 grid, that's 100 million operations - too slow.

<div class="code-group">

```python
# Time: O(m²n²) | Space: O(1)
def brute_force(grid):
    m, n = len(grid), len(grid[0])
    count = 0

    # Try all possible ending positions
    for r_end in range(m):
        for c_end in range(n):
            x_count = 0
            y_count = 0

            # Count X and Y in submatrix (0,0) to (r_end, c_end)
            for i in range(r_end + 1):
                for j in range(c_end + 1):
                    if grid[i][j] == 'X':
                        x_count += 1
                    elif grid[i][j] == 'Y':
                        y_count += 1

            # Check conditions
            if x_count == y_count and x_count > 0:
                count += 1

    return count
```

```javascript
// Time: O(m²n²) | Space: O(1)
function bruteForce(grid) {
  const m = grid.length,
    n = grid[0].length;
  let count = 0;

  // Try all possible ending positions
  for (let rEnd = 0; rEnd < m; rEnd++) {
    for (let cEnd = 0; cEnd < n; cEnd++) {
      let xCount = 0,
        yCount = 0;

      // Count X and Y in submatrix (0,0) to (rEnd, cEnd)
      for (let i = 0; i <= rEnd; i++) {
        for (let j = 0; j <= cEnd; j++) {
          if (grid[i][j] === "X") xCount++;
          else if (grid[i][j] === "Y") yCount++;
        }
      }

      // Check conditions
      if (xCount === yCount && xCount > 0) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(m²n²) | Space: O(1)
public int bruteForce(char[][] grid) {
    int m = grid.length, n = grid[0].length;
    int count = 0;

    // Try all possible ending positions
    for (int rEnd = 0; rEnd < m; rEnd++) {
        for (int cEnd = 0; cEnd < n; cEnd++) {
            int xCount = 0, yCount = 0;

            // Count X and Y in submatrix (0,0) to (rEnd, cEnd)
            for (int i = 0; i <= rEnd; i++) {
                for (int j = 0; j <= cEnd; j++) {
                    if (grid[i][j] == 'X') xCount++;
                    else if (grid[i][j] == 'Y') yCount++;
                }
            }

            // Check conditions
            if (xCount == yCount && xCount > 0) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is to use **prefix sums** and transform the problem into finding equal differences. Here's the step-by-step reasoning:

1. **Define a value for each cell**: Let's assign `+1` for `'X'`, `-1` for `'Y'`, and `0` for `'.'`. This way, the sum of values in a submatrix equals `(X_count - Y_count)`.

2. **Compute 2D prefix sums**: Let `prefix[r][c]` be the sum of values from `(0,0)` to `(r,c)`. We can compute this efficiently using:

   ```
   prefix[r][c] = value(r,c) + prefix[r-1][c] + prefix[r][c-1] - prefix[r-1][c-1]
   ```

3. **The condition transforms**: For a submatrix ending at `(r,c)`, we need `prefix[r][c] = 0` (equal X and Y) and we need at least one X somewhere in the submatrix.

4. **Handling "at least one X"**: We need to ensure the submatrix contains at least one X. This is trickier because prefix sums only tell us the difference, not the actual presence of X. We'll handle this by tracking the minimum X count in each column.

5. **Column-by-column approach**: For each pair of rows `(top, bottom)`, we process columns from left to right:
   - Maintain a running difference for the current column slice
   - Use a hashmap to count how many times we've seen each difference value
   - For column `c`, the difference `diff = prefix[bottom][c] - prefix[top-1][c]` (adjusted for top row)
   - If `diff` appears in the hashmap, those represent submatrices with equal X and Y
   - But we must ensure at least one X exists between `top` and `bottom` in column `c`

6. **Tracking X presence**: We precompute for each column, the cumulative count of X's from top to each row. Then for any row range `(top, bottom)`, we can check if column `c` contains at least one X in that range.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(m² * n) | Space: O(m * n)
def countSubmatrices(grid):
    m, n = len(grid), len(grid[0])

    # Step 1: Create prefix sum array for (X_count - Y_count)
    # Assign +1 for X, -1 for Y, 0 for .
    prefix = [[0] * n for _ in range(m)]

    # Also create prefix count of X's for each column
    # to check "at least one X" condition efficiently
    col_x_prefix = [[0] * n for _ in range(m)]

    # Fill first cell
    if grid[0][0] == 'X':
        prefix[0][0] = 1
        col_x_prefix[0][0] = 1
    elif grid[0][0] == 'Y':
        prefix[0][0] = -1

    # Fill first row
    for c in range(1, n):
        prefix[0][c] = prefix[0][c-1]
        col_x_prefix[0][c] = col_x_prefix[0][c-1]
        if grid[0][c] == 'X':
            prefix[0][c] += 1
            col_x_prefix[0][c] += 1
        elif grid[0][c] == 'Y':
            prefix[0][c] -= 1

    # Fill first column
    for r in range(1, m):
        prefix[r][0] = prefix[r-1][0]
        if grid[r][0] == 'X':
            prefix[r][0] += 1
            col_x_prefix[r][0] = col_x_prefix[r-1][0] + 1
        elif grid[r][0] == 'Y':
            prefix[r][0] -= 1
            col_x_prefix[r][0] = col_x_prefix[r-1][0]
        else:
            col_x_prefix[r][0] = col_x_prefix[r-1][0]

    # Fill rest of the grid
    for r in range(1, m):
        for c in range(1, n):
            # Current cell value
            val = 0
            if grid[r][c] == 'X':
                val = 1
            elif grid[r][c] == 'Y':
                val = -1

            # Prefix sum formula: current + top + left - top-left
            prefix[r][c] = val + prefix[r-1][c] + prefix[r][c-1] - prefix[r-1][c-1]

            # X count prefix for this column
            col_x_prefix[r][c] = col_x_prefix[r-1][c]
            if grid[r][c] == 'X':
                col_x_prefix[r][c] += 1

    total_count = 0

    # Step 2: Count valid submatrices
    # For each pair of rows (top, bottom)
    for top in range(m):
        for bottom in range(top, m):
            # Map to store frequency of difference values
            diff_count = {}
            # Initialize with difference 0 for empty prefix
            diff_count[0] = 1

            # Process columns from left to right
            for c in range(n):
                # Calculate difference for current column slice
                # diff = sum from (top,0) to (bottom,c)
                if top == 0:
                    current_diff = prefix[bottom][c]
                else:
                    current_diff = prefix[bottom][c] - prefix[top-1][c]

                # Check if this column contains at least one X between top and bottom
                has_x = False
                if top == 0:
                    has_x = (col_x_prefix[bottom][c] > 0)
                else:
                    has_x = (col_x_prefix[bottom][c] - col_x_prefix[top-1][c] > 0)

                # If we have at least one X in this column,
                # we can count submatrices ending here
                if has_x:
                    # Look for previous columns with same difference
                    # If diff appeared k times before, we have k submatrices
                    # ending at column c with equal X and Y
                    if current_diff in diff_count:
                        total_count += diff_count[current_diff]

                # Update the frequency map for next column
                diff_count[current_diff] = diff_count.get(current_diff, 0) + 1

    return total_count
```

```javascript
// Time: O(m² * n) | Space: O(m * n)
function countSubmatrices(grid) {
  const m = grid.length,
    n = grid[0].length;

  // Step 1: Create prefix sum array for (X_count - Y_count)
  const prefix = Array(m)
    .fill()
    .map(() => Array(n).fill(0));
  const colXPrefix = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  // Fill first cell
  if (grid[0][0] === "X") {
    prefix[0][0] = 1;
    colXPrefix[0][0] = 1;
  } else if (grid[0][0] === "Y") {
    prefix[0][0] = -1;
  }

  // Fill first row
  for (let c = 1; c < n; c++) {
    prefix[0][c] = prefix[0][c - 1];
    colXPrefix[0][c] = colXPrefix[0][c - 1];
    if (grid[0][c] === "X") {
      prefix[0][c] += 1;
      colXPrefix[0][c] += 1;
    } else if (grid[0][c] === "Y") {
      prefix[0][c] -= 1;
    }
  }

  // Fill first column
  for (let r = 1; r < m; r++) {
    prefix[r][0] = prefix[r - 1][0];
    if (grid[r][0] === "X") {
      prefix[r][0] += 1;
      colXPrefix[r][0] = colXPrefix[r - 1][0] + 1;
    } else if (grid[r][0] === "Y") {
      prefix[r][0] -= 1;
      colXPrefix[r][0] = colXPrefix[r - 1][0];
    } else {
      colXPrefix[r][0] = colXPrefix[r - 1][0];
    }
  }

  // Fill rest of the grid
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      // Current cell value
      let val = 0;
      if (grid[r][c] === "X") {
        val = 1;
      } else if (grid[r][c] === "Y") {
        val = -1;
      }

      // Prefix sum formula
      prefix[r][c] = val + prefix[r - 1][c] + prefix[r][c - 1] - prefix[r - 1][c - 1];

      // X count prefix for this column
      colXPrefix[r][c] = colXPrefix[r - 1][c];
      if (grid[r][c] === "X") {
        colXPrefix[r][c] += 1;
      }
    }
  }

  let totalCount = 0;

  // Step 2: Count valid submatrices
  for (let top = 0; top < m; top++) {
    for (let bottom = top; bottom < m; bottom++) {
      // Map to store frequency of difference values
      const diffCount = new Map();
      // Initialize with difference 0 for empty prefix
      diffCount.set(0, 1);

      // Process columns from left to right
      for (let c = 0; c < n; c++) {
        // Calculate difference for current column slice
        let currentDiff;
        if (top === 0) {
          currentDiff = prefix[bottom][c];
        } else {
          currentDiff = prefix[bottom][c] - prefix[top - 1][c];
        }

        // Check if this column contains at least one X
        let hasX = false;
        if (top === 0) {
          hasX = colXPrefix[bottom][c] > 0;
        } else {
          hasX = colXPrefix[bottom][c] - colXPrefix[top - 1][c] > 0;
        }

        // If we have at least one X, count valid submatrices
        if (hasX) {
          if (diffCount.has(currentDiff)) {
            totalCount += diffCount.get(currentDiff);
          }
        }

        // Update frequency map
        diffCount.set(currentDiff, (diffCount.get(currentDiff) || 0) + 1);
      }
    }
  }

  return totalCount;
}
```

```java
// Time: O(m² * n) | Space: O(m * n)
public int countSubmatrices(char[][] grid) {
    int m = grid.length, n = grid[0].length;

    // Step 1: Create prefix sum arrays
    int[][] prefix = new int[m][n];
    int[][] colXPrefix = new int[m][n];

    // Fill first cell
    if (grid[0][0] == 'X') {
        prefix[0][0] = 1;
        colXPrefix[0][0] = 1;
    } else if (grid[0][0] == 'Y') {
        prefix[0][0] = -1;
    }

    // Fill first row
    for (int c = 1; c < n; c++) {
        prefix[0][c] = prefix[0][c-1];
        colXPrefix[0][c] = colXPrefix[0][c-1];
        if (grid[0][c] == 'X') {
            prefix[0][c] += 1;
            colXPrefix[0][c] += 1;
        } else if (grid[0][c] == 'Y') {
            prefix[0][c] -= 1;
        }
    }

    // Fill first column
    for (int r = 1; r < m; r++) {
        prefix[r][0] = prefix[r-1][0];
        if (grid[r][0] == 'X') {
            prefix[r][0] += 1;
            colXPrefix[r][0] = colXPrefix[r-1][0] + 1;
        } else if (grid[r][0] == 'Y') {
            prefix[r][0] -= 1;
            colXPrefix[r][0] = colXPrefix[r-1][0];
        } else {
            colXPrefix[r][0] = colXPrefix[r-1][0];
        }
    }

    // Fill rest of the grid
    for (int r = 1; r < m; r++) {
        for (int c = 1; c < n; c++) {
            // Current cell value
            int val = 0;
            if (grid[r][c] == 'X') {
                val = 1;
            } else if (grid[r][c] == 'Y') {
                val = -1;
            }

            // Prefix sum formula
            prefix[r][c] = val + prefix[r-1][c] + prefix[r][c-1] - prefix[r-1][c-1];

            // X count prefix for this column
            colXPrefix[r][c] = colXPrefix[r-1][c];
            if (grid[r][c] == 'X') {
                colXPrefix[r][c] += 1;
            }
        }
    }

    int totalCount = 0;

    // Step 2: Count valid submatrices
    for (int top = 0; top < m; top++) {
        for (int bottom = top; bottom < m; bottom++) {
            // Map to store frequency of difference values
            Map<Integer, Integer> diffCount = new HashMap<>();
            // Initialize with difference 0 for empty prefix
            diffCount.put(0, 1);

            // Process columns from left to right
            for (int c = 0; c < n; c++) {
                // Calculate difference for current column slice
                int currentDiff;
                if (top == 0) {
                    currentDiff = prefix[bottom][c];
                } else {
                    currentDiff = prefix[bottom][c] - prefix[top-1][c];
                }

                // Check if this column contains at least one X
                boolean hasX;
                if (top == 0) {
                    hasX = colXPrefix[bottom][c] > 0;
                } else {
                    hasX = (colXPrefix[bottom][c] - colXPrefix[top-1][c]) > 0;
                }

                // If we have at least one X, count valid submatrices
                if (hasX) {
                    totalCount += diffCount.getOrDefault(currentDiff, 0);
                }

                // Update frequency map
                diffCount.put(currentDiff, diffCount.getOrDefault(currentDiff, 0) + 1);
            }
        }
    }

    return totalCount;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m² × n)**

- Building the prefix arrays takes O(m × n)
- The main counting loop has three nested loops:
  - Outer: m iterations for `top`
  - Middle: average m/2 iterations for `bottom` (but we'll say O(m))
  - Inner: n iterations for columns
  - Total: O(m² × n)

**Space Complexity: O(m × n)**

- We store two prefix arrays of size m × n
- The hashmap in the inner loop uses O(n) space at most, which is dominated by the prefix arrays

## Common Mistakes

1. **Forgetting the "at least one X" condition**: Many candidates correctly count submatrices with equal X and Y but forget to ensure there's at least one X. Remember: equal counts could be 0 X and 0 Y, which is invalid.

2. **Incorrect prefix sum formula**: When computing 2D prefix sums, the formula is `current + top + left - top-left`. A common mistake is forgetting to subtract the top-left cell, which gets counted twice.

3. **Off-by-one errors in row/column indices**: When accessing `prefix[top-1][c]`, ensure `top > 0`. We handle this with conditionals in the code.

4. **Not initializing the hashmap properly**: We need to start with `diffCount[0] = 1` to account for the empty prefix (submatrices starting at column 0).

## When You'll See This Pattern

This problem combines several important patterns:

1. **2D Prefix Sums**: Used in problems like "Count Submatrices With All Ones" (LeetCode 1504) and "Range Sum Query 2D - Immutable" (LeetCode 304).

2. **Difference Counting with Hashmaps**: Similar to "Subarray Sum Equals K" (LeetCode 560) but extended to 2D. The idea of tracking frequency of differences appears in many subarray/submatrix counting problems.

3. **Column-wise Compression**: Reducing a 2D problem to 1D by fixing rows and processing columns is a common optimization, seen in "Max Sum of Rectangle No Larger Than K" (LeetCode 363).

## Key Takeaways

1. **Transform equality conditions into difference tracking**: When you need to count subarrays/submatrices with equal counts of two things, assign them opposite weights (+1/-1) and look for zero-sum subarrays.

2. **Use prefix sums to avoid recomputation**: For problems involving sums over rectangular regions, 2D prefix sums let you compute any submatrix sum in O(1) time after O(mn) preprocessing.

3. **Compress dimensions when possible**: By fixing two rows and processing columns, we reduce a 2D counting problem to a 1D problem that can be solved with a hashmap.

Related problems: [Maximum Equal Frequency](/problem/maximum-equal-frequency), [Count Submatrices With All Ones](/problem/count-submatrices-with-all-ones)
