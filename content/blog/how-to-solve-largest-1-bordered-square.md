---
title: "How to Solve Largest 1-Bordered Square — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Largest 1-Bordered Square. Medium difficulty, 52.0% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2029-03-15"
category: "dsa-patterns"
tags: ["largest-1-bordered-square", "array", "dynamic-programming", "matrix", "medium"]
---

# How to Solve Largest 1-Bordered Square

This problem asks us to find the largest square subgrid where all cells on its border are 1s (the interior can be anything). What makes this tricky is that we're not looking for a solid square of 1s, but specifically a square border. This means we need to efficiently check if all four sides of a potential square are composed entirely of 1s.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
1 1 1
1 1 1
1 1 1
```

For this 3×3 grid, we want to find the largest square with a border of 1s. Let's think about how we'd check:

1. **Size 3 square** (top-left at (0,0), bottom-right at (2,2)):
   - Top border: positions (0,0), (0,1), (0,2) → all 1s ✓
   - Bottom border: positions (2,0), (2,1), (2,2) → all 1s ✓
   - Left border: positions (0,0), (1,0), (2,0) → all 1s ✓
   - Right border: positions (0,2), (1,2), (2,2) → all 1s ✓
     This is valid! Area = 9.

2. **Size 2 squares**: There are several. Check top-left at (0,0), bottom-right at (1,1):
   - Top: (0,0), (0,1) → 1s ✓
   - Bottom: (1,0), (1,1) → 1s ✓
   - Left: (0,0), (1,0) → 1s ✓
   - Right: (0,1), (1,1) → 1s ✓
     Valid, but smaller than size 3.

Now consider a more interesting grid:

```
1 1 0
1 1 1
1 1 1
```

Here, the top-right corner is 0. The 3×3 square starting at (0,0) fails because its top border includes (0,2) which is 0. But a 2×2 square starting at (0,0) works. The key insight: to check if a square has a border of 1s, we need to verify four continuous runs of 1s.

## Brute Force Approach

The brute force approach would be:

1. For every possible top-left corner (i,j)
2. For every possible square size k (from 1 up to what fits in the grid)
3. Check all cells on the four borders of that k×k square

The checking step for a square of size k requires examining 4×(k-1) cells (since corners are shared). In the worst case, this gives us O(m×n×min(m,n)×min(m,n)) = O(m×n×min(m,n)²) time complexity, which is O(n⁴) for an n×n grid. This is too slow for typical constraints.

Here's what the brute force code might look like:

<div class="code-group">

```python
# Time: O(m*n*min(m,n)²) | Space: O(1)
def largest1BorderedSquare_brute(grid):
    m, n = len(grid), len(grid[0])
    max_size = 0

    # Try every possible top-left corner
    for i in range(m):
        for j in range(n):
            # Try every possible square size
            max_possible = min(m - i, n - j)
            for k in range(1, max_possible + 1):
                valid = True

                # Check top border
                for col in range(j, j + k):
                    if grid[i][col] == 0:
                        valid = False
                        break
                if not valid:
                    continue

                # Check bottom border
                for col in range(j, j + k):
                    if grid[i + k - 1][col] == 0:
                        valid = False
                        break
                if not valid:
                    continue

                # Check left border
                for row in range(i, i + k):
                    if grid[row][j] == 0:
                        valid = False
                        break
                if not valid:
                    continue

                # Check right border
                for row in range(i, i + k):
                    if grid[row][j + k - 1] == 0:
                        valid = False
                        break

                if valid:
                    max_size = max(max_size, k)

    return max_size * max_size  # Return area
```

```javascript
// Time: O(m*n*min(m,n)²) | Space: O(1)
function largest1BorderedSquareBrute(grid) {
  const m = grid.length,
    n = grid[0].length;
  let maxSize = 0;

  // Try every possible top-left corner
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Try every possible square size
      const maxPossible = Math.min(m - i, n - j);
      for (let k = 1; k <= maxPossible; k++) {
        let valid = true;

        // Check top border
        for (let col = j; col < j + k; col++) {
          if (grid[i][col] === 0) {
            valid = false;
            break;
          }
        }
        if (!valid) continue;

        // Check bottom border
        for (let col = j; col < j + k; col++) {
          if (grid[i + k - 1][col] === 0) {
            valid = false;
            break;
          }
        }
        if (!valid) continue;

        // Check left border
        for (let row = i; row < i + k; row++) {
          if (grid[row][j] === 0) {
            valid = false;
            break;
          }
        }
        if (!valid) continue;

        // Check right border
        for (let row = i; row < i + k; row++) {
          if (grid[row][j + k - 1] === 0) {
            valid = false;
            break;
          }
        }

        if (valid) {
          maxSize = Math.max(maxSize, k);
        }
      }
    }
  }

  return maxSize * maxSize; // Return area
}
```

```java
// Time: O(m*n*min(m,n)²) | Space: O(1)
public int largest1BorderedSquareBrute(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int maxSize = 0;

    // Try every possible top-left corner
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            // Try every possible square size
            int maxPossible = Math.min(m - i, n - j);
            for (int k = 1; k <= maxPossible; k++) {
                boolean valid = true;

                // Check top border
                for (int col = j; col < j + k; col++) {
                    if (grid[i][col] == 0) {
                        valid = false;
                        break;
                    }
                }
                if (!valid) continue;

                // Check bottom border
                for (int col = j; col < j + k; col++) {
                    if (grid[i + k - 1][col] == 0) {
                        valid = false;
                        break;
                    }
                }
                if (!valid) continue;

                // Check left border
                for (int row = i; row < i + k; row++) {
                    if (grid[row][j] == 0) {
                        valid = false;
                        break;
                    }
                }
                if (!valid) continue;

                // Check right border
                for (int row = i; row < i + k; row++) {
                    if (grid[row][j + k - 1] == 0) {
                        valid = false;
                        break;
                    }
                }

                if (valid) {
                    maxSize = Math.max(maxSize, k);
                }
            }
        }
    }

    return maxSize * maxSize;  // Return area
}
```

</div>

The problem with this approach is the repeated work. For each potential square, we're checking the same cells over and over. If we want to check if a square of size k has a border of 1s, we need to know: "Starting from cell (i,j), how many consecutive 1s are there to the right?" and "Starting from cell (i,j), how many consecutive 1s are there going down?"

## Optimized Approach

The key insight is to **precompute prefix sums** of consecutive 1s in both horizontal and vertical directions. This allows us to check if a border is valid in O(1) time instead of O(k) time.

Here's the step-by-step reasoning:

1. **Precomputation**: Create two auxiliary matrices:
   - `hor[i][j]`: Number of consecutive 1s ending at (i,j) in the horizontal direction (left to right)
   - `ver[i][j]`: Number of consecutive 1s ending at (i,j) in the vertical direction (top to bottom)

2. **Building the precomputed tables**:
   - For `hor`: If `grid[i][j] == 1`, then `hor[i][j] = hor[i][j-1] + 1`, else `hor[i][j] = 0`
   - For `ver`: If `grid[i][j] == 1`, then `ver[i][j] = ver[i-1][j] + 1`, else `ver[i][j] = 0`

3. **Checking squares efficiently**: For a potential square with top-left at (i,j) and size k:
   - Top border valid if: `hor[i][j+k-1] >= k` (enough consecutive 1s to the right from (i,j))
   - Left border valid if: `ver[i+k-1][j] >= k` (enough consecutive 1s downward from (i,j))
   - Bottom border valid if: `hor[i+k-1][j+k-1] - hor[i+k-1][j-1] >= k` (or check directly with precomputed values)
   - Right border valid if: `ver[i+k-1][j+k-1] - ver[i-1][j+k-1] >= k` (or check directly)

Actually, there's an even cleaner way: once we have `hor` and `ver`, for a square of size k with top-left at (i,j):

- Check if the minimum of these four values is at least k:
  1. `hor[i][j+k-1]` (top border)
  2. `ver[i+k-1][j]` (left border)
  3. `hor[i+k-1][j+k-1]` (bottom border)
  4. `ver[i+k-1][j+k-1]` (right border)

But wait, that's not quite right because `hor[i+k-1][j+k-1]` tells us about consecutive 1s ending at the bottom-right corner, not specifically the bottom border. We need to check if there are k consecutive 1s ending at (i+k-1, j+k-1) that start at or before column j.

The correct check: For a square with top-left (i,j) and size k to be valid:

1. There must be at least k consecutive 1s to the right starting from (i,j) → `hor[i][j+k-1] >= k`
2. There must be at least k consecutive 1s downward starting from (i,j) → `ver[i+k-1][j] >= k`
3. There must be at least k consecutive 1s to the right starting from (i+k-1,j) → `hor[i+k-1][j+k-1] >= k`
4. There must be at least k consecutive 1s downward starting from (i,j+k-1) → `ver[i+k-1][j+k-1] >= k`

This gives us O(1) border checking after O(m×n) precomputation!

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(m*n*min(m,n)) | Space: O(m*n)
def largest1BorderedSquare(grid):
    """
    Find the area of the largest square subgrid with all 1s on its border.

    Approach:
    1. Precompute horizontal and vertical prefix sums of consecutive 1s
    2. For each cell as potential top-left corner, try all possible square sizes
    3. Use precomputed values to check borders in O(1) time
    """
    m, n = len(grid), len(grid[0])

    # Step 1: Precompute horizontal and vertical consecutive 1s
    # hor[i][j] = number of consecutive 1s ending at (i,j) horizontally
    # ver[i][j] = number of consecutive 1s ending at (i,j) vertically
    hor = [[0] * n for _ in range(m)]
    ver = [[0] * n for _ in range(m)]

    # Fill the precomputation tables
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                # Horizontal: if first column, start fresh, else continue from left
                hor[i][j] = 1 if j == 0 else hor[i][j-1] + 1
                # Vertical: if first row, start fresh, else continue from above
                ver[i][j] = 1 if i == 0 else ver[i-1][j] + 1
            else:
                # Cell is 0, so no consecutive 1s end here
                hor[i][j] = 0
                ver[i][j] = 0

    # Step 2: Find the largest valid square
    max_size = 0

    # Try every cell as potential top-left corner of a square
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 0:
                continue  # Can't start a square with border of 1s from a 0

            # The maximum possible square size starting at (i,j)
            # is limited by both remaining rows and columns
            max_possible = min(m - i, n - j)

            # Try all possible square sizes, starting from largest to smallest
            # for optimization (we can break early if we find a valid square)
            for k in range(max_possible, 0, -1):
                # Optimization: If we already found a square larger than
                # current k, we can stop checking smaller sizes
                if k <= max_size:
                    break

                # Check if square of size k with top-left at (i,j) is valid
                # We need to check all four borders have at least k consecutive 1s

                # Check top border: enough consecutive 1s to the right from (i,j)?
                if hor[i][j + k - 1] < k:
                    continue  # Top border not valid

                # Check left border: enough consecutive 1s downward from (i,j)?
                if ver[i + k - 1][j] < k:
                    continue  # Left border not valid

                # Check bottom border: enough consecutive 1s to the right from (i+k-1,j)?
                if hor[i + k - 1][j + k - 1] < k:
                    continue  # Bottom border not valid

                # Check right border: enough consecutive 1s downward from (i,j+k-1)?
                if ver[i + k - 1][j + k - 1] < k:
                    continue  # Right border not valid

                # All borders are valid!
                max_size = max(max_size, k)
                break  # No need to check smaller squares for this (i,j)

    # Return area of the largest square found
    return max_size * max_size
```

```javascript
// Time: O(m*n*min(m,n)) | Space: O(m*n)
function largest1BorderedSquare(grid) {
  /**
   * Find the area of the largest square subgrid with all 1s on its border.
   *
   * Approach:
   * 1. Precompute horizontal and vertical prefix sums of consecutive 1s
   * 2. For each cell as potential top-left corner, try all possible square sizes
   * 3. Use precomputed values to check borders in O(1) time
   */
  const m = grid.length,
    n = grid[0].length;

  // Step 1: Precompute horizontal and vertical consecutive 1s
  // hor[i][j] = number of consecutive 1s ending at (i,j) horizontally
  // ver[i][j] = number of consecutive 1s ending at (i,j) vertically
  const hor = Array(m)
    .fill()
    .map(() => Array(n).fill(0));
  const ver = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  // Fill the precomputation tables
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        // Horizontal: if first column, start fresh, else continue from left
        hor[i][j] = j === 0 ? 1 : hor[i][j - 1] + 1;
        // Vertical: if first row, start fresh, else continue from above
        ver[i][j] = i === 0 ? 1 : ver[i - 1][j] + 1;
      } else {
        // Cell is 0, so no consecutive 1s end here
        hor[i][j] = 0;
        ver[i][j] = 0;
      }
    }
  }

  // Step 2: Find the largest valid square
  let maxSize = 0;

  // Try every cell as potential top-left corner of a square
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 0) {
        continue; // Can't start a square with border of 1s from a 0
      }

      // The maximum possible square size starting at (i,j)
      // is limited by both remaining rows and columns
      const maxPossible = Math.min(m - i, n - j);

      // Try all possible square sizes, starting from largest to smallest
      // for optimization (we can break early if we find a valid square)
      for (let k = maxPossible; k > 0; k--) {
        // Optimization: If we already found a square larger than
        // current k, we can stop checking smaller sizes
        if (k <= maxSize) {
          break;
        }

        // Check if square of size k with top-left at (i,j) is valid
        // We need to check all four borders have at least k consecutive 1s

        // Check top border: enough consecutive 1s to the right from (i,j)?
        if (hor[i][j + k - 1] < k) {
          continue; // Top border not valid
        }

        // Check left border: enough consecutive 1s downward from (i,j)?
        if (ver[i + k - 1][j] < k) {
          continue; // Left border not valid
        }

        // Check bottom border: enough consecutive 1s to the right from (i+k-1,j)?
        if (hor[i + k - 1][j + k - 1] < k) {
          continue; // Bottom border not valid
        }

        // Check right border: enough consecutive 1s downward from (i,j+k-1)?
        if (ver[i + k - 1][j + k - 1] < k) {
          continue; // Right border not valid
        }

        // All borders are valid!
        maxSize = Math.max(maxSize, k);
        break; // No need to check smaller squares for this (i,j)
      }
    }
  }

  // Return area of the largest square found
  return maxSize * maxSize;
}
```

```java
// Time: O(m*n*min(m,n)) | Space: O(m*n)
public int largest1BorderedSquare(int[][] grid) {
    /**
     * Find the area of the largest square subgrid with all 1s on its border.
     *
     * Approach:
     * 1. Precompute horizontal and vertical prefix sums of consecutive 1s
     * 2. For each cell as potential top-left corner, try all possible square sizes
     * 3. Use precomputed values to check borders in O(1) time
     */
    int m = grid.length, n = grid[0].length;

    // Step 1: Precompute horizontal and vertical consecutive 1s
    // hor[i][j] = number of consecutive 1s ending at (i,j) horizontally
    // ver[i][j] = number of consecutive 1s ending at (i,j) vertically
    int[][] hor = new int[m][n];
    int[][] ver = new int[m][n];

    // Fill the precomputation tables
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == 1) {
                // Horizontal: if first column, start fresh, else continue from left
                hor[i][j] = (j == 0) ? 1 : hor[i][j-1] + 1;
                // Vertical: if first row, start fresh, else continue from above
                ver[i][j] = (i == 0) ? 1 : ver[i-1][j] + 1;
            } else {
                // Cell is 0, so no consecutive 1s end here
                hor[i][j] = 0;
                ver[i][j] = 0;
            }
        }
    }

    // Step 2: Find the largest valid square
    int maxSize = 0;

    // Try every cell as potential top-left corner of a square
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == 0) {
                continue;  // Can't start a square with border of 1s from a 0
            }

            // The maximum possible square size starting at (i,j)
            // is limited by both remaining rows and columns
            int maxPossible = Math.min(m - i, n - j);

            // Try all possible square sizes, starting from largest to smallest
            // for optimization (we can break early if we find a valid square)
            for (int k = maxPossible; k > 0; k--) {
                // Optimization: If we already found a square larger than
                // current k, we can stop checking smaller sizes
                if (k <= maxSize) {
                    break;
                }

                // Check if square of size k with top-left at (i,j) is valid
                // We need to check all four borders have at least k consecutive 1s

                // Check top border: enough consecutive 1s to the right from (i,j)?
                if (hor[i][j + k - 1] < k) {
                    continue;  // Top border not valid
                }

                // Check left border: enough consecutive 1s downward from (i,j)?
                if (ver[i + k - 1][j] < k) {
                    continue;  // Left border not valid
                }

                // Check bottom border: enough consecutive 1s to the right from (i+k-1,j)?
                if (hor[i + k - 1][j + k - 1] < k) {
                    continue;  // Bottom border not valid
                }

                // Check right border: enough consecutive 1s downward from (i,j+k-1)?
                if (ver[i + k - 1][j + k - 1] < k) {
                    continue;  // Right border not valid
                }

                // All borders are valid!
                maxSize = Math.max(maxSize, k);
                break;  // No need to check smaller squares for this (i,j)
            }
        }
    }

    // Return area of the largest square found
    return maxSize * maxSize;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(m × n × min(m,n))

- Precomputation of `hor` and `ver` tables: O(m × n)
- For each of the m × n cells as potential top-left corner, we try up to min(m,n) possible square sizes
- Each border check is O(1) using the precomputed values
- Total: O(m × n × min(m,n))

**Space Complexity**: O(m × n)

- We store two auxiliary matrices `hor` and `ver`, each of size m × n
- This is the price we pay for O(1) border checks

## Common Mistakes

1. **Off-by-one errors in border checking**: The most common mistake is getting the indices wrong when checking borders. Remember that for a square of size k starting at (i,j), the bottom-right corner is at (i+k-1, j+k-1), not (i+k, j+k). Always test with small examples.

2. **Forgetting to check all four borders**: Some candidates check only two opposite borders, forgetting that a square needs all four sides to be valid. The interior can be anything, but every cell on the border must be 1.

3. **Inefficient square size iteration**: Starting from size 1 and going up means you'll check many small squares even after finding a large valid one. Starting from the largest possible size and going downward allows early breaking, which significantly optimizes the solution.

4. **Not handling edge cases properly**: Empty grid, all zeros, single row/column grids. The solution should handle these gracefully (return 0 for no valid square).

## When You'll See This Pattern

This problem uses **prefix sums in 2D** and **dynamic programming for precomputation**, which are common patterns in matrix problems:

1. **Maximal Square** (LeetCode 221): Find the largest square containing only 1s. Uses a similar DP approach but checks the entire square, not just the border.

2. **Count Square Submatrices with All Ones** (LeetCode 1277): Count all square submatrices with all 1s. Builds on the maximal square approach.

3. **Largest Plus Sign** (LeetCode 764): Find the largest axis-aligned plus sign of 1s. Uses similar precomputation of consecutive 1s in four directions.

The core technique is precomputing some property (consecutive 1s, sums, etc.) to enable O(1) queries about submatrices.

## Key Takeaways

1. **Precomputation is powerful for matrix problems**: When you need to repeatedly query properties of submatrices, precomputing prefix sums or consecutive counts can turn O(k) checks into O(1) checks.

2. **Think about what information you need to check efficiently**: For border checking, we need to know "how many consecutive 1s are there starting from this cell going right/down?" This insight leads to the `hor` and `ver` tables.

3. **Optimize iteration order**: When searching for the "largest" something, try sizes from largest to smallest to enable early breaking. This simple optimization can significantly improve practical performance.

[Practice this problem on CodeJeet](/problem/largest-1-bordered-square)
