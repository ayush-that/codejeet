---
title: "How to Solve Zigzag Grid Traversal With Skip — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Zigzag Grid Traversal With Skip. Easy difficulty, 64.9% acceptance rate. Topics: Array, Matrix, Simulation."
date: "2028-12-21"
category: "dsa-patterns"
tags: ["zigzag-grid-traversal-with-skip", "array", "matrix", "simulation", "easy"]
---

# How to Solve Zigzag Grid Traversal With Skip

This problem asks us to traverse a 2D grid in a zigzag pattern while skipping every alternate cell. While the concept is straightforward, the challenge lies in carefully managing direction changes, boundary conditions, and the skipping logic. What makes this problem interesting is that it combines simple traversal with pattern-based skipping, requiring precise control over indices and state.

## Visual Walkthrough

Let's trace through a 3×4 grid to build intuition:

```
Grid:
[1,  2,  3,  4]
[5,  6,  7,  8]
[9, 10, 11, 12]
```

**Step-by-step traversal with skipping:**

1. Start at (0,0) → value 1 (collected)
2. Move right to (0,1) → value 2 (skipped - alternate cell)
3. Move right to (0,2) → value 3 (collected)
4. Move right to (0,3) → value 4 (skipped - alternate cell)
5. Move down to (1,3) → value 8 (collected) _Note: direction changes at right edge_
6. Move left to (1,2) → value 7 (skipped - alternate cell)
7. Move left to (1,1) → value 6 (collected)
8. Move left to (1,0) → value 5 (skipped - alternate cell)
9. Move down to (2,0) → value 9 (collected) _Note: direction changes at left edge_
10. Move right to (2,1) → value 10 (skipped - alternate cell)
11. Move right to (2,2) → value 11 (collected)
12. Move right to (2,3) → value 12 (skipped - alternate cell)

**Result:** [1, 3, 8, 6, 9, 11]

Key observations:

- We move right on even rows (0-indexed) and left on odd rows
- We change direction when we hit the grid boundaries
- We collect every other cell (starting with the first cell as collected)

## Brute Force Approach

A naive approach might involve:

1. Creating a list of all cells in traversal order
2. Filtering out every other cell
3. Extracting values from the remaining cells

However, this approach is inefficient because:

- It requires storing all positions before filtering
- It doesn't leverage the predictable pattern of the traversal
- It's more complex than necessary for what is essentially a simple simulation

The optimal approach is to simulate the traversal directly while tracking whether we should collect or skip each cell.

## Optimal Solution

The optimal solution simulates the zigzag traversal directly. We maintain:

- Current position (row, col)
- Direction (right or left)
- A counter to track whether to collect or skip the current cell

We iterate through all cells in the grid, moving in the current direction until we hit a boundary, then moving down and reversing direction.

<div class="code-group">

```python
# Time: O(m * n) | Space: O(1) excluding output
def zigzagTraversal(grid):
    """
    Traverse grid in zigzag pattern, skipping every alternate cell.

    Args:
        grid: 2D list of positive integers

    Returns:
        List of values collected during traversal
    """
    if not grid or not grid[0]:
        return []

    m, n = len(grid), len(grid[0])
    result = []

    # Start at top-left corner
    row, col = 0, 0
    # Start moving right (True = right, False = left)
    move_right = True
    # Track whether to collect current cell (start with collect)
    collect = True

    # Traverse all cells
    for _ in range(m * n):
        # Collect current cell if it's a collection step
        if collect:
            result.append(grid[row][col])

        # Toggle collect flag for next cell
        collect = not collect

        # Check if we can move in current direction
        if move_right:
            # Moving right - check if next column is within bounds
            if col + 1 < n:
                col += 1
            else:
                # Hit right boundary - move down and reverse direction
                row += 1
                move_right = False
        else:
            # Moving left - check if next column is within bounds
            if col - 1 >= 0:
                col -= 1
            else:
                # Hit left boundary - move down and reverse direction
                row += 1
                move_right = True

    return result
```

```javascript
// Time: O(m * n) | Space: O(1) excluding output
function zigzagTraversal(grid) {
  /**
   * Traverse grid in zigzag pattern, skipping every alternate cell.
   *
   * @param {number[][]} grid - 2D array of positive integers
   * @return {number[]} - Values collected during traversal
   */
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    return [];
  }

  const m = grid.length;
  const n = grid[0].length;
  const result = [];

  // Start at top-left corner
  let row = 0,
    col = 0;
  // Start moving right (true = right, false = left)
  let moveRight = true;
  // Track whether to collect current cell (start with collect)
  let collect = true;

  // Traverse all cells
  for (let i = 0; i < m * n; i++) {
    // Collect current cell if it's a collection step
    if (collect) {
      result.push(grid[row][col]);
    }

    // Toggle collect flag for next cell
    collect = !collect;

    // Check if we can move in current direction
    if (moveRight) {
      // Moving right - check if next column is within bounds
      if (col + 1 < n) {
        col++;
      } else {
        // Hit right boundary - move down and reverse direction
        row++;
        moveRight = false;
      }
    } else {
      // Moving left - check if next column is within bounds
      if (col - 1 >= 0) {
        col--;
      } else {
        // Hit left boundary - move down and reverse direction
        row++;
        moveRight = true;
      }
    }
  }

  return result;
}
```

```java
// Time: O(m * n) | Space: O(1) excluding output
import java.util.ArrayList;
import java.util.List;

public class Solution {
    public List<Integer> zigzagTraversal(int[][] grid) {
        /**
         * Traverse grid in zigzag pattern, skipping every alternate cell.
         *
         * @param grid - 2D array of positive integers
         * @return List of values collected during traversal
         */
        List<Integer> result = new ArrayList<>();

        // Handle empty grid cases
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return result;
        }

        int m = grid.length;
        int n = grid[0].length;

        // Start at top-left corner
        int row = 0, col = 0;
        // Start moving right (true = right, false = left)
        boolean moveRight = true;
        // Track whether to collect current cell (start with collect)
        boolean collect = true;

        // Traverse all cells
        for (int i = 0; i < m * n; i++) {
            // Collect current cell if it's a collection step
            if (collect) {
                result.add(grid[row][col]);
            }

            // Toggle collect flag for next cell
            collect = !collect;

            // Check if we can move in current direction
            if (moveRight) {
                // Moving right - check if next column is within bounds
                if (col + 1 < n) {
                    col++;
                } else {
                    // Hit right boundary - move down and reverse direction
                    row++;
                    moveRight = false;
                }
            } else {
                // Moving left - check if next column is within bounds
                if (col - 1 >= 0) {
                    col--;
                } else {
                    // Hit left boundary - move down and reverse direction
                    row++;
                    moveRight = true;
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- We visit each cell exactly once in the grid
- For each cell, we perform constant-time operations (check boundaries, update flags, potentially add to result)
- The loop runs exactly m × n times

**Space Complexity:** O(1) excluding the output array

- We use only a constant amount of extra space for variables (row, col, flags)
- The result array is required by the problem and doesn't count toward space complexity
- If we count the output, space complexity is O(m × n) in the worst case (when collecting all cells)

## Common Mistakes

1. **Off-by-one errors in boundary checking:** Forgetting that array indices are 0-based can lead to accessing grid[n] instead of grid[n-1]. Always check `col + 1 < n` (not `≤ n`) when moving right and `col - 1 ≥ 0` (not `> 0`) when moving left.

2. **Incorrect direction switching:** Some candidates reverse direction after every row instead of only when hitting boundaries. Remember: we only change direction when we can't move further in the current direction, not automatically after each row.

3. **Skipping logic errors:** The problem says to skip every "alternate" cell, which means we toggle between collect and skip states. A common mistake is to skip based on position (e.g., skip even columns) rather than based on the sequence of visited cells.

4. **Not handling edge cases:** Forgetting to check for empty grids (m=0 or n=0) can lead to index errors. Always validate input dimensions at the beginning.

## When You'll See This Pattern

This type of grid traversal pattern appears in several problems:

1. **Spiral Matrix (LeetCode 54):** Similar boundary-following logic but with four directions instead of two. Both problems require careful tracking of boundaries and direction changes.

2. **Diagonal Traverse (LeetCode 498):** Another pattern-based traversal that alternates direction, though along diagonals rather than rows.

3. **Robot Bounded In Circle (LeetCode 1041):** Involves tracking position and direction with boundary/wrapping logic, though in a different context.

The core pattern is **stateful traversal** - maintaining current position, direction, and other state variables while systematically visiting all elements according to specific rules.

## Key Takeaways

1. **Simulation problems** often require tracking multiple pieces of state (position, direction, flags). Keep these variables minimal and clearly named.

2. **Boundary handling** is critical in grid traversal. Always check bounds before moving, and have a clear plan for what happens at edges.

3. **Pattern-based skipping/selection** can often be implemented with a simple boolean flag that toggles each iteration, rather than complex mathematical formulas.

This problem teaches how to break down a complex-sounding traversal into simple, manageable steps by maintaining clear state and following the rules systematically.

Related problems: [Binary Tree Zigzag Level Order Traversal](/problem/binary-tree-zigzag-level-order-traversal), [Longest ZigZag Path in a Binary Tree](/problem/longest-zigzag-path-in-a-binary-tree)
