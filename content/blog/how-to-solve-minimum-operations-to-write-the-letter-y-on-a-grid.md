---
title: "How to Solve Minimum Operations to Write the Letter Y on a Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Write the Letter Y on a Grid. Medium difficulty, 64.3% acceptance rate. Topics: Array, Hash Table, Matrix, Counting."
date: "2029-01-26"
category: "dsa-patterns"
tags:
  ["minimum-operations-to-write-the-letter-y-on-a-grid", "array", "hash-table", "matrix", "medium"]
---

# How to Solve Minimum Operations to Write the Letter Y on a Grid

This problem asks us to transform a grid into a specific pattern — the letter Y — with minimal changes. What makes it interesting is that we're not just counting mismatches; we need to find the optimal color assignment for both Y and non-Y cells to minimize total operations. The challenge lies in efficiently determining which cells belong to the Y shape and then finding the best color combination.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider this 3×3 grid:

```
Grid:
0 1 2
1 0 1
2 2 0
```

**Step 1: Identify Y cells**
For a 3×3 grid (n=3, center at (1,1)):

- Left diagonal: (0,0), (1,1)
- Right diagonal: (0,2), (1,1)
- Vertical stem: (2,1)

Y cells: (0,0), (0,2), (1,1), (2,1)

**Step 2: Count current colors in Y vs non-Y cells**
Y cells: [0, 2, 0, 0] → Counts: {0:3, 2:1}
Non-Y cells: [1, 1, 1, 2, 0] → Counts: {0:1, 1:3, 2:1}

**Step 3: Try all color combinations**
We need to choose one color for Y cells and a different color for non-Y cells.

Option 1: Y=0, non-Y=1
Operations = (Y cells not 0) + (non-Y cells not 1)
= 1 + (1+1) = 3

Option 2: Y=0, non-Y=2
Operations = 1 + (3+1) = 5

Option 3: Y=1, non-Y=0
Operations = (3+1) + 3 = 7

Option 4: Y=1, non-Y=2
Operations = 4 + (3+1) = 8

Option 5: Y=2, non-Y=0
Operations = 3 + 3 = 6

Option 6: Y=2, non-Y=1
Operations = 3 + (1+1) = 5

Minimum is 3 operations (Y=0, non-Y=1).

## Brute Force Approach

A naive approach would be:

1. Identify all Y cells
2. For each possible color pair (Y_color, non_Y_color) where they're different
3. Count how many cells need to change
4. Track the minimum

The brute force code would look like this:

<div class="code-group">

```python
def minOperations(grid):
    n = len(grid)
    y_cells = set()
    center = n // 2

    # Left diagonal
    for i in range(center + 1):
        y_cells.add((i, i))

    # Right diagonal
    for i in range(center + 1):
        y_cells.add((i, n - 1 - i))

    # Vertical stem
    for i in range(center + 1, n):
        y_cells.add((i, center))

    # Count colors
    y_counts = {0: 0, 1: 0, 2: 0}
    non_y_counts = {0: 0, 1: 0, 2: 0}

    for r in range(n):
        for c in range(n):
            if (r, c) in y_cells:
                y_counts[grid[r][c]] += 1
            else:
                non_y_counts[grid[r][c]] += 1

    # Try all combinations
    min_ops = float('inf')
    for y_color in [0, 1, 2]:
        for non_y_color in [0, 1, 2]:
            if y_color == non_y_color:
                continue

            ops = 0
            # Count changes for Y cells
            for color in [0, 1, 2]:
                if color != y_color:
                    ops += y_counts[color]

            # Count changes for non-Y cells
            for color in [0, 1, 2]:
                if color != non_y_color:
                    ops += non_y_counts[color]

            min_ops = min(min_ops, ops)

    return min_ops
```

```javascript
function minOperations(grid) {
  const n = grid.length;
  const yCells = new Set();
  const center = Math.floor(n / 2);

  // Left diagonal
  for (let i = 0; i <= center; i++) {
    yCells.add(`${i},${i}`);
  }

  // Right diagonal
  for (let i = 0; i <= center; i++) {
    yCells.add(`${i},${n - 1 - i}`);
  }

  // Vertical stem
  for (let i = center + 1; i < n; i++) {
    yCells.add(`${i},${center}`);
  }

  // Count colors
  const yCounts = { 0: 0, 1: 0, 2: 0 };
  const nonYCounts = { 0: 0, 1: 0, 2: 0 };

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const key = `${r},${c}`;
      if (yCells.has(key)) {
        yCounts[grid[r][c]]++;
      } else {
        nonYCounts[grid[r][c]]++;
      }
    }
  }

  // Try all combinations
  let minOps = Infinity;
  const colors = [0, 1, 2];

  for (const yColor of colors) {
    for (const nonYColor of colors) {
      if (yColor === nonYColor) continue;

      let ops = 0;
      // Count changes for Y cells
      for (const color of colors) {
        if (color !== yColor) {
          ops += yCounts[color];
        }
      }

      // Count changes for non-Y cells
      for (const color of colors) {
        if (color !== nonYColor) {
          ops += nonYCounts[color];
        }
      }

      minOps = Math.min(minOps, ops);
    }
  }

  return minOps;
}
```

```java
public int minimumOperationsToWriteY(int[][] grid) {
    int n = grid.length;
    boolean[][] isY = new boolean[n][n];
    int center = n / 2;

    // Left diagonal
    for (int i = 0; i <= center; i++) {
        isY[i][i] = true;
    }

    // Right diagonal
    for (int i = 0; i <= center; i++) {
        isY[i][n - 1 - i] = true;
    }

    // Vertical stem
    for (int i = center + 1; i < n; i++) {
        isY[i][center] = true;
    }

    // Count colors
    int[] yCounts = new int[3];
    int[] nonYCounts = new int[3];

    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) {
            if (isY[r][c]) {
                yCounts[grid[r][c]]++;
            } else {
                nonYCounts[grid[r][c]]++;
            }
        }
    }

    // Try all combinations
    int minOps = Integer.MAX_VALUE;
    for (int yColor = 0; yColor < 3; yColor++) {
        for (int nonYColor = 0; nonYColor < 3; nonYColor++) {
            if (yColor == nonYColor) continue;

            int ops = 0;
            // Count changes for Y cells
            for (int color = 0; color < 3; color++) {
                if (color != yColor) {
                    ops += yCounts[color];
                }
            }

            // Count changes for non-Y cells
            for (int color = 0; color < 3; color++) {
                if (color != nonYColor) {
                    ops += nonYCounts[color];
                }
            }

            minOps = Math.min(minOps, ops);
        }
    }

    return minOps;
}
```

</div>

This brute force is actually optimal in terms of time complexity! The issue isn't that it's too slow — it's O(n²) which is fine for the constraints. The real challenge is implementing it correctly without bugs. Many candidates struggle with correctly identifying Y cells or efficiently counting operations.

## Optimized Approach

The key insight is that we don't need to store all Y cell positions. We can count colors directly while traversing the grid by checking if each cell belongs to the Y shape using mathematical conditions:

1. **Left diagonal**: Cells where row == column AND row ≤ center
2. **Right diagonal**: Cells where row + column == n-1 AND row ≤ center
3. **Vertical stem**: Cells where column == center AND row > center

This eliminates the need for a set/array to track Y cells, saving space.

Another optimization: Instead of summing all mismatches for each color combination, we can use the fact that:

- Operations for Y cells = total Y cells - yCounts[yColor]
- Operations for non-Y cells = total non-Y cells - nonYCounts[nonYColor]

This simplifies the calculation to a subtraction rather than summing mismatches.

## Optimal Solution

Here's the clean, optimized implementation:

<div class="code-group">

```python
def minimumOperationsToWriteY(grid):
    """
    Time: O(n²) - we traverse the grid once
    Space: O(1) - we only use fixed-size counters
    """
    n = len(grid)
    center = n // 2

    # Counters for colors 0, 1, 2 in Y and non-Y regions
    y_counts = [0, 0, 0]
    non_y_counts = [0, 0, 0]

    # Single pass through the grid
    for r in range(n):
        for c in range(n):
            # Check if cell belongs to Y shape
            is_y_cell = False

            # Left diagonal (top-left to center)
            if r == c and r <= center:
                is_y_cell = True
            # Right diagonal (top-right to center)
            elif r + c == n - 1 and r <= center:
                is_y_cell = True
            # Vertical stem (below center)
            elif c == center and r > center:
                is_y_cell = True

            # Update appropriate counter
            if is_y_cell:
                y_counts[grid[r][c]] += 1
            else:
                non_y_counts[grid[r][c]] += 1

    # Calculate totals
    total_y = sum(y_counts)
    total_non_y = sum(non_y_counts)

    min_operations = float('inf')

    # Try all valid color combinations
    for y_color in range(3):
        for non_y_color in range(3):
            if y_color == non_y_color:
                continue  # Colors must be different

            # Operations = cells that need to change
            # For Y cells: all that aren't y_color
            # For non-Y cells: all that aren't non_y_color
            operations = (total_y - y_counts[y_color]) + \
                         (total_non_y - non_y_counts[non_y_color])

            min_operations = min(min_operations, operations)

    return min_operations
```

```javascript
function minimumOperationsToWriteY(grid) {
  /**
   * Time: O(n²) - we traverse the grid once
   * Space: O(1) - we only use fixed-size counters
   */
  const n = grid.length;
  const center = Math.floor(n / 2);

  // Counters for colors 0, 1, 2 in Y and non-Y regions
  const yCounts = [0, 0, 0];
  const nonYCounts = [0, 0, 0];

  // Single pass through the grid
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      // Check if cell belongs to Y shape
      let isYCell = false;

      // Left diagonal (top-left to center)
      if (r === c && r <= center) {
        isYCell = true;
      }
      // Right diagonal (top-right to center)
      else if (r + c === n - 1 && r <= center) {
        isYCell = true;
      }
      // Vertical stem (below center)
      else if (c === center && r > center) {
        isYCell = true;
      }

      // Update appropriate counter
      if (isYCell) {
        yCounts[grid[r][c]]++;
      } else {
        nonYCounts[grid[r][c]]++;
      }
    }
  }

  // Calculate totals
  const totalY = yCounts.reduce((a, b) => a + b, 0);
  const totalNonY = nonYCounts.reduce((a, b) => a + b, 0);

  let minOperations = Infinity;

  // Try all valid color combinations
  for (let yColor = 0; yColor < 3; yColor++) {
    for (let nonYColor = 0; nonYColor < 3; nonYColor++) {
      if (yColor === nonYColor) continue; // Colors must be different

      // Operations = cells that need to change
      // For Y cells: all that aren't yColor
      // For non-Y cells: all that aren't nonYColor
      const operations = totalY - yCounts[yColor] + (totalNonY - nonYCounts[nonYColor]);

      minOperations = Math.min(minOperations, operations);
    }
  }

  return minOperations;
}
```

```java
public int minimumOperationsToWriteY(int[][] grid) {
    /**
     * Time: O(n²) - we traverse the grid once
     * Space: O(1) - we only use fixed-size counters
     */
    int n = grid.length;
    int center = n / 2;

    // Counters for colors 0, 1, 2 in Y and non-Y regions
    int[] yCounts = new int[3];
    int[] nonYCounts = new int[3];

    // Single pass through the grid
    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) {
            // Check if cell belongs to Y shape
            boolean isYCell = false;

            // Left diagonal (top-left to center)
            if (r == c && r <= center) {
                isYCell = true;
            }
            // Right diagonal (top-right to center)
            else if (r + c == n - 1 && r <= center) {
                isYCell = true;
            }
            // Vertical stem (below center)
            else if (c == center && r > center) {
                isYCell = true;
            }

            // Update appropriate counter
            if (isYCell) {
                yCounts[grid[r][c]]++;
            } else {
                nonYCounts[grid[r][c]]++;
            }
        }
    }

    // Calculate totals
    int totalY = yCounts[0] + yCounts[1] + yCounts[2];
    int totalNonY = nonYCounts[0] + nonYCounts[1] + nonYCounts[2];

    int minOperations = Integer.MAX_VALUE;

    // Try all valid color combinations
    for (int yColor = 0; yColor < 3; yColor++) {
        for (int nonYColor = 0; nonYColor < 3; nonYColor++) {
            if (yColor == nonYColor) continue;  // Colors must be different

            // Operations = cells that need to change
            // For Y cells: all that aren't yColor
            // For non-Y cells: all that aren't nonYColor
            int operations = (totalY - yCounts[yColor]) +
                            (totalNonY - nonYCounts[nonYColor]);

            minOperations = Math.min(minOperations, operations);
        }
    }

    return minOperations;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We make a single pass through all n×n cells to count colors: O(n²)
- We then check 3×3 = 9 color combinations (constant time)
- Total: O(n²) + O(1) = O(n²)

**Space Complexity: O(1)**

- We use fixed-size arrays for counting (6 integers for y_counts and non_y_counts)
- No additional data structures that grow with input size
- Even the grid is provided as input, so we don't count it toward our space usage

## Common Mistakes

1. **Incorrect Y cell identification**: The most common error is getting the Y shape wrong. Remember:
   - The diagonals go from corners to center (inclusive)
   - The vertical stem goes from below center to bottom (exclusive of center)
   - The center cell belongs to BOTH diagonals but should only be counted once

2. **Forgetting colors must be different**: Some candidates try all 3×3 combinations without checking y_color ≠ non_y_color. The problem states Y and non-Y cells must have different colors.

3. **Inefficient operation counting**: Instead of using `total - count[color]`, some candidates sum all mismatches, which works but is less elegant and more error-prone.

4. **Off-by-one errors with center**: Since n is odd, center = n//2 gives the exact middle index. But when checking `r <= center`, remember this includes the center cell itself.

## When You'll See This Pattern

This problem combines several common patterns:

1. **Grid traversal with conditional counting**: Similar to problems like "Island Perimeter" or "Battleships in a Board" where you traverse a grid and apply conditions to each cell.

2. **Minimizing operations by choosing optimal values**: Like "Minimum Domino Rotations For Equal Row" or "Minimum Changes To Make Alternating Binary String" where you try limited possibilities to find the minimum changes.

3. **Partition-based optimization**: The grid is divided into two regions (Y and non-Y), and we optimize each separately. This appears in problems like "Paint House" where you choose colors for different sections.

Specific related problems:

- **LeetCode 1139: Largest 1-Bordered Square** - Also involves checking geometric patterns in grids
- **LeetCode 1004: Max Consecutive Ones III** - Similar "minimum changes" thinking but for binary arrays
- **LeetCode 1578: Minimum Time to Make Rope Colorful** - Another "minimum changes" problem with adjacent constraints

## Key Takeaways

1. **When possibilities are limited, brute force through them**: With only 3 colors and 2 regions, trying all 6 valid combinations is perfectly fine. Don't overcomplicate!

2. **Count first, compute later**: Instead of tracking which cells to change, count how many cells have each color in each region. This transforms the problem from O(n²) comparisons to O(1) arithmetic.

3. **Geometric conditions beat coordinate storage**: Using mathematical conditions (`r == c`, `r + c == n-1`) to identify Y cells is cleaner and more space-efficient than storing coordinates in a set.

[Practice this problem on CodeJeet](/problem/minimum-operations-to-write-the-letter-y-on-a-grid)
