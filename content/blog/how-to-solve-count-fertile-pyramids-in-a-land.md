---
title: "How to Solve Count Fertile Pyramids in a Land — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Fertile Pyramids in a Land. Hard difficulty, 66.3% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2026-03-23"
category: "dsa-patterns"
tags: ["count-fertile-pyramids-in-a-land", "array", "dynamic-programming", "matrix", "hard"]
---

# How to Solve Count Fertile Pyramids in a Land

You're given a grid where each cell is either fertile (1) or barren (0). A pyramidal plot is a set of fertile cells arranged in a pyramid shape: a cell at position `(r, c)` can be the apex of a pyramid of height `h` if there are fertile cells forming an inverted pyramid below it. The challenge is to count **all** possible pyramidal plots in the grid. What makes this problem tricky is that pyramids can overlap, and we need to efficiently count all possible pyramids of all possible sizes without resorting to exponential checks.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
1 1 1
1 1 1
1 1 1
```

For a **regular pyramid** (pointing downward), a cell at `(r, c)` can be the apex of a pyramid of height `h` if:

- The cell itself is fertile (1)
- The cells at `(r+1, c-1)`, `(r+1, c)`, and `(r+1, c+1)` form the base of a smaller pyramid of height `h-1`

For an **inverted pyramid** (pointing upward), a cell at `(r, c)` can be the apex if:

- The cell itself is fertile (1)
- The cells at `(r-1, c-1)`, `(r-1, c)`, and `(r-1, c+1)` form the base of a smaller inverted pyramid of height `h-1`

Let's manually check cell `(1, 1)` (0-indexed, middle cell) in our 3x3 grid:

**Regular pyramids from (1, 1):**

- Height 1: Just cell (1, 1) itself ✓
- Height 2: Needs cells (2, 0), (2, 1), (2, 2) to be fertile ✓
- Height 3: Would need cells outside grid ✗

So cell (1, 1) contributes 2 regular pyramids (heights 1 and 2).

**Inverted pyramids from (1, 1):**

- Height 1: Just cell (1, 1) itself ✓
- Height 2: Needs cells (0, 0), (0, 1), (0, 2) to be fertile ✓
- Height 3: Would need cells outside grid ✗

So cell (1, 1) contributes 2 inverted pyramids (heights 1 and 2).

The key insight is that we can compute this efficiently using dynamic programming instead of checking every possible pyramid size for every cell.

## Brute Force Approach

A naive approach would be: for each fertile cell, try to build pyramids of increasing size until we can't. For a cell at `(r, c)` to be the apex of a pyramid of height `h`:

1. Check if all cells in the pyramid base are fertile
2. For regular pyramids: check cells at positions forming a triangle below
3. For inverted pyramids: check cells at positions forming a triangle above

The brute force code would look like this:

<div class="code-group">

```python
def countPyramids_brute(grid):
    m, n = len(grid), len(grid[0])
    count = 0

    # Check regular pyramids
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 1:
                height = 1
                while True:
                    # Check if we can build pyramid of current height
                    valid = True
                    # For height h, we need to check h-1 rows below
                    for dr in range(1, height):
                        # At row r+dr, we need to check columns from c-dr to c+dr
                        for dc in range(-dr, dr+1):
                            nr, nc = r + dr, c + dc
                            if nr >= m or nc < 0 or nc >= n or grid[nr][nc] == 0:
                                valid = False
                                break
                        if not valid:
                            break
                    if valid:
                        count += 1
                        height += 1
                    else:
                        break

    # Check inverted pyramids (similar but checking rows above)
    # ... similar code with reversed direction

    return count
```

```javascript
function countPyramidsBrute(grid) {
  const m = grid.length,
    n = grid[0].length;
  let count = 0;

  // Check regular pyramids
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 1) {
        let height = 1;
        while (true) {
          let valid = true;
          // For height h, check h-1 rows below
          for (let dr = 1; dr < height; dr++) {
            // At row r+dr, check columns from c-dr to c+dr
            for (let dc = -dr; dc <= dr; dc++) {
              const nr = r + dr,
                nc = c + dc;
              if (nr >= m || nc < 0 || nc >= n || grid[nr][nc] === 0) {
                valid = false;
                break;
              }
            }
            if (!valid) break;
          }
          if (valid) {
            count++;
            height++;
          } else {
            break;
          }
        }
      }
    }
  }

  // Similar code for inverted pyramids...
  return count;
}
```

```java
public int countPyramidsBrute(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int count = 0;

    // Check regular pyramids
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == 1) {
                int height = 1;
                while (true) {
                    boolean valid = true;
                    // For height h, check h-1 rows below
                    for (int dr = 1; dr < height; dr++) {
                        // At row r+dr, check columns from c-dr to c+dr
                        for (int dc = -dr; dc <= dr; dc++) {
                            int nr = r + dr, nc = c + dc;
                            if (nr >= m || nc < 0 || nc >= n || grid[nr][nc] == 0) {
                                valid = false;
                                break;
                            }
                        }
                        if (!valid) break;
                    }
                    if (valid) {
                        count++;
                        height++;
                    } else {
                        break;
                    }
                }
            }
        }
    }

    // Similar code for inverted pyramids...
    return count;
}
```

</div>

**Why this is too slow:** For each cell, we might check up to O(min(m, n)) pyramid heights. For each height `h`, we check O(h²) cells. In the worst case (all 1s in a large grid), this becomes O(m × n × min(m, n)³), which is far too slow for typical constraints (m, n ≤ 1000 would be impossible).

## Optimized Approach

The key insight is that we can use **dynamic programming** to build pyramids incrementally. For regular pyramids:

Let `dp[r][c]` = maximum height of a regular pyramid with apex at `(r, c)`.

The recurrence relation is:

- If `grid[r][c] == 0`: `dp[r][c] = 0` (no pyramid can start here)
- If `grid[r][c] == 1`:
  - Base case: `dp[r][c] = 1` (pyramid of height 1)
  - If we're not at the bottom row: `dp[r][c] = 1 + min(dp[r+1][c-1], dp[r+1][c], dp[r+1][c+1])`
  - This works because a pyramid of height `h` needs pyramids of height at least `h-1` at the three cells below it

For inverted pyramids, we process from bottom to top with a similar relation.

The total number of pyramids = sum of `(dp[r][c] - 1)` for all cells (since height 1 pyramid counts as 0 additional pyramids beyond the cell itself).

## Optimal Solution

Here's the complete optimized solution using dynamic programming:

<div class="code-group">

```python
# Time: O(m × n) | Space: O(m × n)
def countPyramids(grid):
    m, n = len(grid), len(grid[0])

    # Create a copy of grid for DP (we'll modify it in place)
    dp = [row[:] for row in grid]
    total = 0

    # Count regular pyramids (pointing downward)
    # Process from bottom to top since pyramids depend on cells below
    for r in range(m - 2, -1, -1):  # Start from second last row, go upward
        for c in range(1, n - 1):   # Skip first and last columns (need left/right neighbors)
            if dp[r][c] == 1:  # Only fertile cells can be pyramid apex
                # The height of pyramid at (r,c) is 1 + min of three cells below it
                # This ensures all cells in the pyramid base are fertile
                dp[r][c] = 1 + min(dp[r + 1][c - 1], dp[r + 1][c], dp[r + 1][c + 1])
                # Add all pyramids with apex at (r,c): heights from 2 to dp[r][c]
                # A pyramid of height h counts as (h-1) pyramids (excluding height 1)
                total += dp[r][c] - 1

    # Reset dp for inverted pyramids
    dp = [row[:] for row in grid]

    # Count inverted pyramids (pointing upward)
    # Process from top to bottom since inverted pyramids depend on cells above
    for r in range(1, m):  # Start from second row, go downward
        for c in range(1, n - 1):  # Skip first and last columns
            if dp[r][c] == 1:  # Only fertile cells can be pyramid apex
                # For inverted pyramid, check cells above current position
                dp[r][c] = 1 + min(dp[r - 1][c - 1], dp[r - 1][c], dp[r - 1][c + 1])
                # Add all inverted pyramids with apex at (r,c)
                total += dp[r][c] - 1

    return total
```

```javascript
// Time: O(m × n) | Space: O(m × n)
function countPyramids(grid) {
  const m = grid.length,
    n = grid[0].length;

  // Create a copy of grid for DP
  let dp = grid.map((row) => [...row]);
  let total = 0;

  // Count regular pyramids (pointing downward)
  // Process from bottom to top
  for (let r = m - 2; r >= 0; r--) {
    for (let c = 1; c < n - 1; c++) {
      if (dp[r][c] === 1) {
        // Height = 1 + min of three cells directly below
        dp[r][c] = 1 + Math.min(dp[r + 1][c - 1], dp[r + 1][c], dp[r + 1][c + 1]);
        // Add all pyramids with apex at (r,c): heights 2 to dp[r][c]
        total += dp[r][c] - 1;
      }
    }
  }

  // Reset for inverted pyramids
  dp = grid.map((row) => [...row]);

  // Count inverted pyramids (pointing upward)
  // Process from top to bottom
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n - 1; c++) {
      if (dp[r][c] === 1) {
        // For inverted pyramid, check cells above
        dp[r][c] = 1 + Math.min(dp[r - 1][c - 1], dp[r - 1][c], dp[r - 1][c + 1]);
        // Add all inverted pyramids with apex at (r,c)
        total += dp[r][c] - 1;
      }
    }
  }

  return total;
}
```

```java
// Time: O(m × n) | Space: O(m × n)
public int countPyramids(int[][] grid) {
    int m = grid.length, n = grid[0].length;

    // Create a copy of grid for DP
    int[][] dp = new int[m][n];
    for (int i = 0; i < m; i++) {
        dp[i] = grid[i].clone();
    }

    int total = 0;

    // Count regular pyramids (pointing downward)
    // Process from bottom to top
    for (int r = m - 2; r >= 0; r--) {
        for (int c = 1; c < n - 1; c++) {
            if (dp[r][c] == 1) {
                // Height = 1 + minimum of three cells below
                dp[r][c] = 1 + Math.min(
                    Math.min(dp[r + 1][c - 1], dp[r + 1][c]),
                    dp[r + 1][c + 1]
                );
                // Add pyramids of heights 2 to dp[r][c]
                total += dp[r][c] - 1;
            }
        }
    }

    // Reset for inverted pyramids
    for (int i = 0; i < m; i++) {
        dp[i] = grid[i].clone();
    }

    // Count inverted pyramids (pointing upward)
    // Process from top to bottom
    for (int r = 1; r < m; r++) {
        for (int c = 1; c < n - 1; c++) {
            if (dp[r][c] == 1) {
                // For inverted pyramid, check cells above
                dp[r][c] = 1 + Math.min(
                    Math.min(dp[r - 1][c - 1], dp[r - 1][c]),
                    dp[r - 1][c + 1]
                );
                // Add inverted pyramids of heights 2 to dp[r][c]
                total += dp[r][c] - 1;
            }
        }
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- We make two passes over the grid: one for regular pyramids and one for inverted pyramids
- Each pass visits each cell once and performs O(1) operations (min of three values)
- Total: O(2 × m × n) = O(m × n)

**Space Complexity:** O(m × n)

- We create a DP array of size m × n to store pyramid heights
- We could optimize to O(n) by only keeping the previous row, but the code is clearer with full DP array

## Common Mistakes

1. **Off-by-one errors in loop boundaries:** When processing from bottom to top for regular pyramids, starting at `m-1` instead of `m-2` will cause index errors when accessing `r+1`. Similarly, column loops should start at 1 and end at `n-2` to safely access `c-1` and `c+1`.

2. **Forgetting to handle edge cells properly:** Cells in the first/last row or column cannot be apex of pyramids (except height 1). The code handles this by limiting column range to `[1, n-2]` and row ranges appropriately.

3. **Not resetting DP array between regular and inverted pyramids:** The DP values for regular pyramids don't apply to inverted pyramids. You need fresh DP arrays or reset the existing one.

4. **Incorrect recurrence relation:** Using `max` instead of `min` is a critical error. A pyramid of height `h` requires **all three** cells below to support pyramids of height at least `h-1`, so we take the minimum.

## When You'll See This Pattern

This problem uses a **2D dynamic programming** pattern with **dependency on neighboring cells**. Similar problems include:

1. **Count Square Submatrices with All Ones (LeetCode 1277):** Uses almost identical DP where `dp[i][j]` represents the size of the largest square ending at `(i,j)`. The recurrence is `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`.

2. **Largest Plus Sign (LeetCode 764):** Requires computing the minimum extension in four directions, similar to how we compute pyramid height based on three directions.

3. **Maximal Square (LeetCode 221):** Another 2D DP problem where the value at each cell depends on its neighbors.

The core pattern is: when a structure's size at a position depends on the size of adjacent structures, think about dynamic programming with a recurrence relation based on neighboring values.

## Key Takeaways

1. **Pyramid counting reduces to height computation:** Instead of counting each pyramid separately, compute the maximum pyramid height for each cell. The number of pyramids with that cell as apex is simply `height - 1`.

2. **Direction matters in DP traversal:** For regular pyramids (pointing down), process from bottom to top since pyramids depend on cells below. For inverted pyramids, process from top to bottom. Always traverse in the direction of dependency.

3. **The min() operation ensures structural integrity:** When a structure requires multiple supporting elements, the limiting factor determines the maximum size. This "weakest link" principle appears in many DP problems involving geometric shapes.

Related problems: [Count Square Submatrices with All Ones](/problem/count-square-submatrices-with-all-ones), [Get Biggest Three Rhombus Sums in a Grid](/problem/get-biggest-three-rhombus-sums-in-a-grid)
