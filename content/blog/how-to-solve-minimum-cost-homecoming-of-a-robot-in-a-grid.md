---
title: "How to Solve Minimum Cost Homecoming of a Robot in a Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Cost Homecoming of a Robot in a Grid. Medium difficulty, 51.6% acceptance rate. Topics: Array, Greedy."
date: "2029-07-12"
category: "dsa-patterns"
tags: ["minimum-cost-homecoming-of-a-robot-in-a-grid", "array", "greedy", "medium"]
---

# How to Solve Minimum Cost Homecoming of a Robot in a Grid

You're given a robot starting at a specific position in a grid, and you need to move it to the home position at `(m-1, n-1)` using only right and down moves. The twist: moving right has a cost `colCosts[col]` for the column you're moving into, and moving down has a cost `rowCosts[row]` for the row you're moving into. The problem is interesting because it looks like a dynamic programming problem at first glance, but has a greedy solution that's much more efficient.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- Grid size: m=3, n=4 (3 rows, 4 columns)
- Start position: startPos = [1, 2] (row 1, column 2)
- Row costs: rowCosts = [5, 4, 3]
- Column costs: colCosts = [8, 3, 0, 1]

**Step-by-step reasoning:**

1. **Current position:** (1, 2)
2. **Target position:** (2, 3) - bottom-right corner
3. **We need to move:** Down 1 row (from row 1 to row 2) and Right 1 column (from column 2 to column 3)

**Cost calculation:**

- Moving down from row 1 to row 2: cost = rowCosts[2] = 3
- Moving right from column 2 to column 3: cost = colCosts[3] = 1
- **Total cost:** 3 + 1 = 4

But wait - what if we need to move multiple steps? Let's try another example where startPos = [0, 0]:

**Input:**

- Start position: [0, 0]
- Same rowCosts and colCosts as above

**We need to move:** Down 2 rows and Right 3 columns

**Cost calculation:**

- Moving down from row 0 to row 1: cost = rowCosts[1] = 4
- Moving down from row 1 to row 2: cost = rowCosts[2] = 3
- Moving right from column 0 to column 1: cost = colCosts[1] = 3
- Moving right from column 1 to column 2: cost = colCosts[2] = 0
- Moving right from column 2 to column 3: cost = colCosts[3] = 1
- **Total cost:** 4 + 3 + 3 + 0 + 1 = 11

Notice something important: when moving multiple steps in the same direction, we pay the cost of **each intermediate position we pass through**, not just the final position. This is the key insight!

## Brute Force Approach

A naive approach might try to explore all possible paths from start to home. Since we can only move right or down, the number of paths would be the binomial coefficient C((m-1-startRow)+(n-1-startCol), (m-1-startRow)), which grows exponentially. For each path, we'd sum up the costs of all moves.

The brute force would involve:

1. Generate all possible sequences of "right" and "down" moves
2. For each sequence, simulate the robot's movement
3. Sum the costs of each move based on the row/column being entered
4. Track the minimum cost

This approach is clearly inefficient. For a 10×10 grid starting at (0,0), there are C(18,9) = 48,620 possible paths. For larger grids, this becomes computationally infeasible.

## Optimized Approach

The key insight is that **the order of moves doesn't matter** for the total cost! Let's think about why:

1. **Moving right:** When you move right from column `c` to column `c+1`, you pay `colCosts[c+1]`. If you need to move from column `startCol` to column `n-1`, you'll pay the sum of `colCosts[startCol+1]` through `colCosts[n-1]`.

2. **Moving down:** When you move down from row `r` to row `r+1`, you pay `rowCosts[r+1]`. If you need to move from row `startRow` to row `m-1`, you'll pay the sum of `rowCosts[startRow+1]` through `rowCosts[m-1]`.

3. **Independence:** The row moves only depend on row costs, and column moves only depend on column costs. They don't interact with each other!

Therefore, the optimal solution is simply:

- Sum all row costs from `startRow+1` to `m-1` (inclusive)
- Sum all column costs from `startCol+1` to `n-1` (inclusive)
- Add these two sums together

This works because regardless of whether you move right-then-down or down-then-right, you'll always pass through the same intermediate rows and columns.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m + n) | Space: O(1)
def minCost(self, startPos, homePos, rowCosts, colCosts):
    """
    Calculate the minimum cost for a robot to move from startPos to homePos.

    Args:
        startPos: List[int] - starting position [row, col]
        homePos: List[int] - home position [row, col]
        rowCosts: List[int] - cost to move into each row
        colCosts: List[int] - cost to move into each column

    Returns:
        int: minimum total cost
    """
    total_cost = 0

    # Extract starting and target positions
    start_row, start_col = startPos
    home_row, home_col = homePos

    # Calculate cost for vertical movement (row changes)
    # We need to move from start_row to home_row
    if start_row < home_row:
        # Moving down: pay cost for each row we enter
        # We enter rows start_row+1 through home_row
        for row in range(start_row + 1, home_row + 1):
            total_cost += rowCosts[row]
    elif start_row > home_row:
        # Moving up: pay cost for each row we enter
        # We enter rows start_row-1 down to home_row
        for row in range(start_row - 1, home_row - 1, -1):
            total_cost += rowCosts[row]
    # If start_row == home_row, no vertical movement needed

    # Calculate cost for horizontal movement (column changes)
    # We need to move from start_col to home_col
    if start_col < home_col:
        # Moving right: pay cost for each column we enter
        # We enter columns start_col+1 through home_col
        for col in range(start_col + 1, home_col + 1):
            total_cost += colCosts[col]
    elif start_col > home_col:
        # Moving left: pay cost for each column we enter
        # We enter columns start_col-1 down to home_col
        for col in range(start_col - 1, home_col - 1, -1):
            total_cost += colCosts[col]
    # If start_col == home_col, no horizontal movement needed

    return total_cost
```

```javascript
// Time: O(m + n) | Space: O(1)
/**
 * Calculate the minimum cost for a robot to move from startPos to homePos.
 *
 * @param {number[]} startPos - starting position [row, col]
 * @param {number[]} homePos - home position [row, col]
 * @param {number[]} rowCosts - cost to move into each row
 * @param {number[]} colCosts - cost to move into each column
 * @return {number} minimum total cost
 */
var minCost = function (startPos, homePos, rowCosts, colCosts) {
  let totalCost = 0;

  // Extract starting and target positions
  const [startRow, startCol] = startPos;
  const [homeRow, homeCol] = homePos;

  // Calculate cost for vertical movement (row changes)
  if (startRow < homeRow) {
    // Moving down: pay cost for each row we enter
    // We enter rows startRow+1 through homeRow
    for (let row = startRow + 1; row <= homeRow; row++) {
      totalCost += rowCosts[row];
    }
  } else if (startRow > homeRow) {
    // Moving up: pay cost for each row we enter
    // We enter rows startRow-1 down to homeRow
    for (let row = startRow - 1; row >= homeRow; row--) {
      totalCost += rowCosts[row];
    }
  }
  // If startRow === homeRow, no vertical movement needed

  // Calculate cost for horizontal movement (column changes)
  if (startCol < homeCol) {
    // Moving right: pay cost for each column we enter
    // We enter columns startCol+1 through homeCol
    for (let col = startCol + 1; col <= homeCol; col++) {
      totalCost += colCosts[col];
    }
  } else if (startCol > homeCol) {
    // Moving left: pay cost for each column we enter
    // We enter columns startCol-1 down to homeCol
    for (let col = startCol - 1; col >= homeCol; col--) {
      totalCost += colCosts[col];
    }
  }
  // If startCol === homeCol, no horizontal movement needed

  return totalCost;
};
```

```java
// Time: O(m + n) | Space: O(1)
class Solution {
    /**
     * Calculate the minimum cost for a robot to move from startPos to homePos.
     *
     * @param startPos starting position [row, col]
     * @param homePos home position [row, col]
     * @param rowCosts cost to move into each row
     * @param colCosts cost to move into each column
     * @return minimum total cost
     */
    public int minCost(int[] startPos, int[] homePos, int[] rowCosts, int[] colCosts) {
        int totalCost = 0;

        // Extract starting and target positions
        int startRow = startPos[0];
        int startCol = startPos[1];
        int homeRow = homePos[0];
        int homeCol = homePos[1];

        // Calculate cost for vertical movement (row changes)
        if (startRow < homeRow) {
            // Moving down: pay cost for each row we enter
            // We enter rows startRow+1 through homeRow
            for (int row = startRow + 1; row <= homeRow; row++) {
                totalCost += rowCosts[row];
            }
        } else if (startRow > homeRow) {
            // Moving up: pay cost for each row we enter
            // We enter rows startRow-1 down to homeRow
            for (int row = startRow - 1; row >= homeRow; row--) {
                totalCost += rowCosts[row];
            }
        }
        // If startRow == homeRow, no vertical movement needed

        // Calculate cost for horizontal movement (column changes)
        if (startCol < homeCol) {
            // Moving right: pay cost for each column we enter
            // We enter columns startCol+1 through homeCol
            for (int col = startCol + 1; col <= homeCol; col++) {
                totalCost += colCosts[col];
            }
        } else if (startCol > homeCol) {
            // Moving left: pay cost for each column we enter
            // We enter columns startCol-1 down to homeCol
            for (int col = startCol - 1; col >= homeCol; col--) {
                totalCost += colCosts[col];
            }
        }
        // If startCol == homeCol, no horizontal movement needed

        return totalCost;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m + n)

- We iterate through rows from `startRow` to `homeRow`: at most O(m) iterations
- We iterate through columns from `startCol` to `homeCol`: at most O(n) iterations
- Each iteration does constant work (addition)

**Space Complexity:** O(1)

- We only use a few integer variables (`total_cost`, indices for loops)
- No additional data structures are needed

## Common Mistakes

1. **Including the starting position cost:** The problem states you pay the cost of the row/column you're moving **into**, not the one you're leaving. So if you start at row `r`, you don't pay `rowCosts[r]` for your first move.

2. **Wrong loop boundaries:** When moving right/down, you need to include the home position cost. When moving left/up, you need to include the home position cost but go in reverse order. For example, moving from column 3 to column 1 means paying `colCosts[2] + colCosts[1]`.

3. **Overcomplicating with DP:** Many candidates try to use dynamic programming because the problem looks similar to "Minimum Path Sum." However, the costs are independent of path, making DP unnecessary and inefficient.

4. **Not handling both movement directions:** The robot can move in all four directions (though the problem only allows right/down to reach home from start if home is at bottom-right). Actually, the home could be anywhere relative to start, so we need to handle both increasing and decreasing indices.

## When You'll See This Pattern

This problem teaches the **independence of dimensions** pattern, where movement costs in orthogonal directions don't interact. You'll see similar patterns in:

1. **Unique Paths (LeetCode 62):** The number of paths from top-left to bottom-right in a grid. The solution uses combinatorics because moving right and down are independent operations.

2. **Minimum Path Sum (LeetCode 64):** While this does require DP, it shares the grid navigation aspect. The key difference is that in Minimum Path Sum, the cost is associated with being _on_ a cell, not moving _into_ it.

3. **Bomb Enemy (LeetCode 361):** This problem also involves scanning rows and columns independently to optimize from O(m²n²) to O(mn).

## Key Takeaways

1. **Look for independence:** When a problem involves movement in orthogonal directions (like rows and columns), check if the costs/constraints for each direction are independent. If they are, you can solve for each dimension separately.

2. **Understand what you're paying for:** Carefully read whether costs apply to positions you occupy, positions you move through, or positions you move into. This subtle difference changes the entire solution approach.

3. **Don't jump to DP for grid problems:** While many grid problems use dynamic programming, always check if there's a simpler pattern first. If movement in different dimensions doesn't affect each other, there's often a greedy or mathematical solution.

Related problems: [Unique Paths](/problem/unique-paths), [Minimum Path Sum](/problem/minimum-path-sum), [Bomb Enemy](/problem/bomb-enemy)
