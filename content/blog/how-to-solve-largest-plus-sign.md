---
title: "How to Solve Largest Plus Sign — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Largest Plus Sign. Medium difficulty, 49.1% acceptance rate. Topics: Array, Dynamic Programming."
date: "2028-02-05"
category: "dsa-patterns"
tags: ["largest-plus-sign", "array", "dynamic-programming", "medium"]
---

# How to Solve Largest Plus Sign

You're given an `n x n` grid initially filled with 1's, except for certain positions marked as 0's (mines). You need to find the largest "plus sign" centered anywhere in the grid, where a plus sign of order `k` consists of a central cell with four arms extending up, down, left, and right for `k` cells each (all containing 1's). The tricky part is that the plus sign must be axis-aligned, and mines (0's) break the continuity of the arms.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose `n = 5` and `mines = [[3, 0], [3, 3], [1, 1]]`.

Our grid looks like this (1's everywhere except mines):

```
1 1 1 1 1
1 0 1 1 1
1 1 1 1 1
0 1 1 0 1
1 1 1 1 1
```

Now let's think about finding the largest plus sign. Consider position `(2, 2)` (center of grid):

- Up arm: Check positions `(1, 2)`, `(0, 2)` → both 1's, so arm length = 2
- Down arm: Check `(3, 2)`, `(4, 2)` → `(3, 2)` is 1, `(4, 2)` is 1, so arm length = 2
- Left arm: Check `(2, 1)`, `(2, 0)` → both 1's, so arm length = 2
- Right arm: Check `(2, 3)`, `(2, 4)` → `(2, 3)` is 1, `(2, 4)` is 1, so arm length = 2

The limiting factor is the minimum of these four arms: `min(2, 2, 2, 2) = 2`. So the order of the plus sign at `(2, 2)` is 2 (which means a plus sign extending 2 cells in each direction).

But wait — a plus sign of order `k` actually has `k` cells in each direction PLUS the center. So if we can extend 2 cells in each direction, that's a plus sign of order 3 total (center + 2 cells each way). The problem defines "order" as `k` where we have `k` consecutive 1's in each direction, so our calculation is correct.

The largest plus sign in this grid is actually at position `(2, 2)` with order 2.

## Brute Force Approach

The most straightforward approach is to check every cell as a potential center. For each cell `(i, j)`:

1. Check how far you can extend up until hitting a mine or boundary
2. Check how far you can extend down
3. Check how far you can extend left
4. Check how far you can extend right
5. Take the minimum of these four distances
6. Track the maximum minimum across all cells

This brute force solution would have time complexity O(n³) because:

- O(n²) cells to check
- For each cell, in worst case we check O(n) cells in each direction (though we stop at first mine)

While this might work for small `n`, it's inefficient for larger grids. The problem constraints can go up to `n = 500`, making O(n³) operations (125 million) too slow.

## Optimized Approach

The key insight is that we can **precompute** how far we can extend in each direction from every cell. This is a classic dynamic programming approach where we compute four separate tables:

1. **Left table**: For each cell `(i, j)`, how many consecutive 1's to the left (including itself)
2. **Right table**: How many consecutive 1's to the right (including itself)
3. **Up table**: How many consecutive 1's above (including itself)
4. **Down table**: How many consecutive 1's below (including itself)

We compute these tables in four separate passes:

- **Left to right**: If cell is 1, `left[i][j] = left[i][j-1] + 1`, else 0
- **Right to left**: If cell is 1, `right[i][j] = right[i][j+1] + 1`, else 0
- **Top to bottom**: If cell is 1, `up[i][j] = up[i-1][j] + 1`, else 0
- **Bottom to top**: If cell is 1, `down[i][j] = down[i+1][j] + 1`, else 0

Then for each cell, the largest plus sign centered there is `min(left[i][j], right[i][j], up[i][j], down[i][j])`.

Why does this work? Because `left[i][j]` tells us how many consecutive 1's are to the left INCLUDING the current cell. So if `left[i][j] = 3`, that means we have 3 consecutive 1's ending at `(i, j)` (cells `(i, j-2)`, `(i, j-1)`, `(i, j)`). This is exactly the length of the left arm if we center at `(i, j)`.

## Optimal Solution

Here's the complete implementation using dynamic programming:

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n^2)
def orderOfLargestPlusSign(n, mines):
    """
    Find the largest plus sign in an n x n grid with mines at given positions.

    Args:
        n: Size of the grid (n x n)
        mines: List of [row, col] positions where mines are located

    Returns:
        Order (k) of the largest plus sign
    """
    # Step 1: Create the grid initialized with 1's
    grid = [[1] * n for _ in range(n)]

    # Step 2: Mark mines as 0
    for row, col in mines:
        grid[row][col] = 0

    # Step 3: Initialize DP tables
    left = [[0] * n for _ in range(n)]
    right = [[0] * n for _ in range(n)]
    up = [[0] * n for _ in range(n)]
    down = [[0] * n for _ in range(n)]

    # Step 4: Compute left table (left to right)
    for i in range(n):
        for j in range(n):
            if grid[i][j] == 1:
                # If we're at the left edge, we can only extend 1 cell
                if j == 0:
                    left[i][j] = 1
                else:
                    left[i][j] = left[i][j-1] + 1

    # Step 5: Compute right table (right to left)
    for i in range(n):
        for j in range(n-1, -1, -1):
            if grid[i][j] == 1:
                # If we're at the right edge, we can only extend 1 cell
                if j == n-1:
                    right[i][j] = 1
                else:
                    right[i][j] = right[i][j+1] + 1

    # Step 6: Compute up table (top to bottom)
    for i in range(n):
        for j in range(n):
            if grid[i][j] == 1:
                # If we're at the top edge, we can only extend 1 cell
                if i == 0:
                    up[i][j] = 1
                else:
                    up[i][j] = up[i-1][j] + 1

    # Step 7: Compute down table (bottom to top)
    for i in range(n-1, -1, -1):
        for j in range(n):
            if grid[i][j] == 1:
                # If we're at the bottom edge, we can only extend 1 cell
                if i == n-1:
                    down[i][j] = 1
                else:
                    down[i][j] = down[i+1][j] + 1

    # Step 8: Find the maximum plus sign order
    max_order = 0
    for i in range(n):
        for j in range(n):
            # The order is limited by the shortest arm
            order = min(left[i][j], right[i][j], up[i][j], down[i][j])
            max_order = max(max_order, order)

    return max_order
```

```javascript
// Time: O(n^2) | Space: O(n^2)
function orderOfLargestPlusSign(n, mines) {
  // Step 1: Create the grid initialized with 1's
  const grid = Array(n)
    .fill()
    .map(() => Array(n).fill(1));

  // Step 2: Mark mines as 0
  for (const [row, col] of mines) {
    grid[row][col] = 0;
  }

  // Step 3: Initialize DP tables
  const left = Array(n)
    .fill()
    .map(() => Array(n).fill(0));
  const right = Array(n)
    .fill()
    .map(() => Array(n).fill(0));
  const up = Array(n)
    .fill()
    .map(() => Array(n).fill(0));
  const down = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  // Step 4: Compute left table (left to right)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        // If we're at the left edge, we can only extend 1 cell
        if (j === 0) {
          left[i][j] = 1;
        } else {
          left[i][j] = left[i][j - 1] + 1;
        }
      }
    }
  }

  // Step 5: Compute right table (right to left)
  for (let i = 0; i < n; i++) {
    for (let j = n - 1; j >= 0; j--) {
      if (grid[i][j] === 1) {
        // If we're at the right edge, we can only extend 1 cell
        if (j === n - 1) {
          right[i][j] = 1;
        } else {
          right[i][j] = right[i][j + 1] + 1;
        }
      }
    }
  }

  // Step 6: Compute up table (top to bottom)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        // If we're at the top edge, we can only extend 1 cell
        if (i === 0) {
          up[i][j] = 1;
        } else {
          up[i][j] = up[i - 1][j] + 1;
        }
      }
    }
  }

  // Step 7: Compute down table (bottom to top)
  for (let i = n - 1; i >= 0; i--) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        // If we're at the bottom edge, we can only extend 1 cell
        if (i === n - 1) {
          down[i][j] = 1;
        } else {
          down[i][j] = down[i + 1][j] + 1;
        }
      }
    }
  }

  // Step 8: Find the maximum plus sign order
  let maxOrder = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // The order is limited by the shortest arm
      const order = Math.min(left[i][j], right[i][j], up[i][j], down[i][j]);
      maxOrder = Math.max(maxOrder, order);
    }
  }

  return maxOrder;
}
```

```java
// Time: O(n^2) | Space: O(n^2)
class Solution {
    public int orderOfLargestPlusSign(int n, int[][] mines) {
        // Step 1: Create the grid initialized with 1's
        int[][] grid = new int[n][n];
        for (int i = 0; i < n; i++) {
            Arrays.fill(grid[i], 1);
        }

        // Step 2: Mark mines as 0
        for (int[] mine : mines) {
            grid[mine[0]][mine[1]] = 0;
        }

        // Step 3: Initialize DP tables
        int[][] left = new int[n][n];
        int[][] right = new int[n][n];
        int[][] up = new int[n][n];
        int[][] down = new int[n][n];

        // Step 4: Compute left table (left to right)
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    // If we're at the left edge, we can only extend 1 cell
                    if (j == 0) {
                        left[i][j] = 1;
                    } else {
                        left[i][j] = left[i][j-1] + 1;
                    }
                }
            }
        }

        // Step 5: Compute right table (right to left)
        for (int i = 0; i < n; i++) {
            for (int j = n-1; j >= 0; j--) {
                if (grid[i][j] == 1) {
                    // If we're at the right edge, we can only extend 1 cell
                    if (j == n-1) {
                        right[i][j] = 1;
                    } else {
                        right[i][j] = right[i][j+1] + 1;
                    }
                }
            }
        }

        // Step 6: Compute up table (top to bottom)
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    // If we're at the top edge, we can only extend 1 cell
                    if (i == 0) {
                        up[i][j] = 1;
                    } else {
                        up[i][j] = up[i-1][j] + 1;
                    }
                }
            }
        }

        // Step 7: Compute down table (bottom to top)
        for (int i = n-1; i >= 0; i--) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    // If we're at the bottom edge, we can only extend 1 cell
                    if (i == n-1) {
                        down[i][j] = 1;
                    } else {
                        down[i][j] = down[i+1][j] + 1;
                    }
                }
            }
        }

        // Step 8: Find the maximum plus sign order
        int maxOrder = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                // The order is limited by the shortest arm
                int order = Math.min(
                    Math.min(left[i][j], right[i][j]),
                    Math.min(up[i][j], down[i][j])
                );
                maxOrder = Math.max(maxOrder, order);
            }
        }

        return maxOrder;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We make 4 passes over the n x n grid to compute the DP tables: O(4n²) = O(n²)
- We make 1 final pass to compute the minimum for each cell: O(n²)
- Total: O(5n²) = O(n²)

**Space Complexity: O(n²)**

- We store the original grid: O(n²)
- We store 4 DP tables (left, right, up, down): O(4n²) = O(n²)
- Total: O(5n²) = O(n²)

We could optimize space by using only one DP table and updating it in place, but the O(n²) space is acceptable given typical constraints.

## Common Mistakes

1. **Off-by-one errors in DP table initialization**: When at grid edges, the arm length should be 1 (just the cell itself), not 0. Forgetting to handle edge cases leads to underestimating plus signs near boundaries.

2. **Confusing "order" with "arm length"**: The problem defines order as `k` where there are `k` consecutive 1's in each direction. Some candidates think order `k` means a plus sign with total size `k`, but it's actually the number of consecutive 1's in each direction.

3. **Not considering mines properly**: When computing consecutive 1's, we must reset the count to 0 when we encounter a mine (0). Forgetting this leads to overestimating arm lengths.

4. **Inefficient brute force**: Trying to expand from each center by checking cells one by one in real-time leads to O(n³) time complexity, which times out for n=500.

## When You'll See This Pattern

This problem uses a **multi-directional dynamic programming** pattern where we compute information propagating in different directions. You'll see similar patterns in:

1. **Maximal Square (LeetCode 221)**: Find the largest square containing only 1's in a binary matrix. Uses DP where each cell looks at its top, left, and top-left neighbors.

2. **Largest Rectangle in Histogram (LeetCode 84)**: Find the largest rectangle in a histogram. Uses the concept of extending left and right until hitting smaller bars.

3. **Trapping Rain Water (LeetCode 42)**: Calculate how much water can be trapped. Uses left and right maximum arrays to determine water height at each position.

The key insight is that when you need to consider constraints from multiple directions, precomputing information in each direction separately can transform an O(n³) problem into O(n²).

## Key Takeaways

1. **Precomputation is powerful**: When you need to repeatedly answer "how far can I go in this direction?" for many positions, precomputing the answers in separate passes is more efficient than computing on the fly.

2. **Think in terms of constraints**: The plus sign is limited by its shortest arm. This "minimum of constraints" pattern appears in many optimization problems.

3. **Directional DP**: When a problem involves propagation or continuity in multiple directions, consider computing separate DP tables for each direction, then combining them.

Related problems: [Maximal Square](/problem/maximal-square)
