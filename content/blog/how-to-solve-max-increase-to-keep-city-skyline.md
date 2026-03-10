---
title: "How to Solve Max Increase to Keep City Skyline — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Max Increase to Keep City Skyline. Medium difficulty, 86.4% acceptance rate. Topics: Array, Greedy, Matrix."
date: "2026-03-03"
category: "dsa-patterns"
tags: ["max-increase-to-keep-city-skyline", "array", "greedy", "matrix", "medium"]
---

# How to Solve Max Increase to Keep City Skyline

This problem asks us to calculate the maximum total height we can add to buildings in a city while preserving the skyline from all four directions. The tricky part is that each building's maximum allowed height is constrained by **two** values: the tallest building in its row (when viewed from east/west) and the tallest building in its column (when viewed from north/south). The actual solution is simpler than it initially appears once you understand this dual constraint.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this 3×3 grid:

```
Original grid:
[3, 0, 8, 4]
[2, 4, 5, 7]
[9, 2, 6, 3]
[0, 3, 1, 0]
```

**Step 1: Find the skyline from each direction**

From the north (looking at columns): The tallest building in each column determines what can be seen from the north.

- Column 0: max(3, 2, 9, 0) = 9
- Column 1: max(0, 4, 2, 3) = 4
- Column 2: max(8, 5, 6, 1) = 8
- Column 3: max(4, 7, 3, 0) = 7
  North skyline: [9, 4, 8, 7]

From the west (looking at rows): The tallest building in each row determines what can be seen from the west.

- Row 0: max(3, 0, 8, 4) = 8
- Row 1: max(2, 4, 5, 7) = 7
- Row 2: max(9, 2, 6, 3) = 9
- Row 3: max(0, 3, 1, 0) = 3
  West skyline: [8, 7, 9, 3]

**Step 2: Determine maximum allowed height for each building**

Each building at (r, c) can only be raised to the **minimum** of:

- The maximum height in its row (west skyline[r])
- The maximum height in its column (north skyline[c])

For example, building at (0, 0):

- Row 0 max = 8
- Column 0 max = 9
- Minimum = min(8, 9) = 8
- Original height = 3
- Can increase by: 8 - 3 = 5

**Step 3: Calculate total increase**

Repeat this for every building:

- (0,0): min(8,9)=8 → increase 5
- (0,1): min(8,4)=4 → increase 4
- (0,2): min(8,8)=8 → increase 0
- (0,3): min(8,7)=7 → increase 3
- (1,0): min(7,9)=7 → increase 5
- (1,1): min(7,4)=4 → increase 0
- (1,2): min(7,8)=7 → increase 2
- (1,3): min(7,7)=7 → increase 0
- (2,0): min(9,9)=9 → increase 0
- (2,1): min(9,4)=4 → increase 2
- (2,2): min(9,8)=8 → increase 2
- (2,3): min(9,7)=7 → increase 4
- (3,0): min(3,9)=3 → increase 3
- (3,1): min(3,4)=3 → increase 0
- (3,2): min(3,8)=3 → increase 2
- (3,3): min(3,7)=3 → increase 3

Total increase = 5+4+0+3+5+0+2+0+0+2+2+4+3+0+2+3 = 35

## Brute Force Approach

A naive approach might try to simulate the process of raising buildings one by one while constantly checking if we've broken the skyline. For each building, we could:

1. Try to raise it as much as possible
2. Check all four directions to see if the skyline changed
3. If it changed, lower it back

This approach is problematic because:

- It's O(n⁴) in the worst case (checking n² buildings, each requiring O(n) checks in two directions)
- The interactions between buildings make it complex
- We might need multiple passes to find the optimal solution

The key insight we're missing is that **each building's constraint is independent** once we know the row and column maximums. We don't need to simulate raising buildings; we can calculate the maximum allowed height directly.

## Optimized Approach

The optimal solution comes from recognizing that:

1. The skyline from north/south is determined by the maximum in each **column**
2. The skyline from east/west is determined by the maximum in each **row**
3. Each building at position (r, c) can be raised to at most `min(rowMax[r], colMax[c])`
4. The increase for that building is `min(rowMax[r], colMax[c]) - grid[r][c]`

This gives us a clear two-step algorithm:

1. **Precompute constraints**: Calculate the maximum height for each row and each column
2. **Calculate total increase**: For each building, find how much it can be raised given both constraints

This approach works because:

- The row maximum ensures the east/west skyline is preserved
- The column maximum ensures the north/south skyline is preserved
- Taking the minimum ensures we satisfy both constraints
- Each calculation is independent, so we can process buildings in any order

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def maxIncreaseKeepingSkyline(grid):
    """
    Calculate the maximum total height that can be added to buildings
    while preserving the skyline from all four directions.

    Args:
        grid: 2D list of integers representing building heights

    Returns:
        Total height increase possible
    """
    n = len(grid)  # Grid is n x n

    # Step 1: Find maximum height for each row and column
    # These represent the skyline constraints
    row_max = [0] * n  # Maximum height in each row (west/east skyline)
    col_max = [0] * n  # Maximum height in each column (north/south skyline)

    # Traverse the grid to find row and column maximums
    for r in range(n):
        for c in range(n):
            # Update row maximum for current row
            row_max[r] = max(row_max[r], grid[r][c])
            # Update column maximum for current column
            col_max[c] = max(col_max[c], grid[r][c])

    # Step 2: Calculate total increase
    total_increase = 0

    # For each building, determine maximum allowed height
    for r in range(n):
        for c in range(n):
            # The building can be raised to at most the minimum of:
            # - The tallest building in its row (row constraint)
            # - The tallest building in its column (column constraint)
            max_allowed = min(row_max[r], col_max[c])

            # Add the difference between allowed height and current height
            total_increase += max_allowed - grid[r][c]

    return total_increase
```

```javascript
// Time: O(n²) | Space: O(n)
function maxIncreaseKeepingSkyline(grid) {
  /**
   * Calculate the maximum total height that can be added to buildings
   * while preserving the skyline from all four directions.
   *
   * @param {number[][]} grid - 2D array representing building heights
   * @return {number} Total height increase possible
   */
  const n = grid.length; // Grid is n x n

  // Step 1: Find maximum height for each row and column
  // These represent the skyline constraints
  const rowMax = new Array(n).fill(0); // Maximum height in each row
  const colMax = new Array(n).fill(0); // Maximum height in each column

  // Traverse the grid to find row and column maximums
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      // Update row maximum for current row
      rowMax[r] = Math.max(rowMax[r], grid[r][c]);
      // Update column maximum for current column
      colMax[c] = Math.max(colMax[c], grid[r][c]);
    }
  }

  // Step 2: Calculate total increase
  let totalIncrease = 0;

  // For each building, determine maximum allowed height
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      // The building can be raised to at most the minimum of:
      // - The tallest building in its row (row constraint)
      // - The tallest building in its column (column constraint)
      const maxAllowed = Math.min(rowMax[r], colMax[c]);

      // Add the difference between allowed height and current height
      totalIncrease += maxAllowed - grid[r][c];
    }
  }

  return totalIncrease;
}
```

```java
// Time: O(n²) | Space: O(n)
class Solution {
    public int maxIncreaseKeepingSkyline(int[][] grid) {
        /**
         * Calculate the maximum total height that can be added to buildings
         * while preserving the skyline from all four directions.
         *
         * @param grid 2D array representing building heights
         * @return Total height increase possible
         */
        int n = grid.length;  // Grid is n x n

        // Step 1: Find maximum height for each row and column
        // These represent the skyline constraints
        int[] rowMax = new int[n];  // Maximum height in each row
        int[] colMax = new int[n];  // Maximum height in each column

        // Initialize arrays (Java arrays default to 0, but being explicit)
        for (int i = 0; i < n; i++) {
            rowMax[i] = 0;
            colMax[i] = 0;
        }

        // Traverse the grid to find row and column maximums
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                // Update row maximum for current row
                if (grid[r][c] > rowMax[r]) {
                    rowMax[r] = grid[r][c];
                }
                // Update column maximum for current column
                if (grid[r][c] > colMax[c]) {
                    colMax[c] = grid[r][c];
                }
            }
        }

        // Step 2: Calculate total increase
        int totalIncrease = 0;

        // For each building, determine maximum allowed height
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                // The building can be raised to at most the minimum of:
                // - The tallest building in its row (row constraint)
                // - The tallest building in its column (column constraint)
                int maxAllowed = Math.min(rowMax[r], colMax[c]);

                // Add the difference between allowed height and current height
                totalIncrease += maxAllowed - grid[r][c];
            }
        }

        return totalIncrease;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We make two passes through the n×n grid
- First pass: O(n²) to compute row and column maximums
- Second pass: O(n²) to calculate the total increase
- Total: O(2n²) = O(n²)

**Space Complexity: O(n)**

- We store two arrays of size n: `rowMax` and `colMax`
- Each array requires O(n) space
- Total: O(2n) = O(n)
- Note: We don't count the input grid in space complexity analysis

## Common Mistakes

1. **Forgetting that constraints come from both directions**: Some candidates only consider row maximums or only column maximums. Remember that each building is constrained by BOTH the tallest building in its row AND the tallest building in its column.

2. **Using the wrong minimum/maximum**: The key operation is `min(rowMax, colMax)` to find the maximum allowed height. Using `max` instead would break one of the skylines.

3. **Off-by-one errors with 0-indexing**: The problem states it's 0-indexed, but some candidates get confused when the example uses 1-based thinking. Always stick to the indexing specified in the problem.

4. **Not initializing arrays properly**: In languages like Java, you need to explicitly initialize arrays if you're not using a helper function. Forgetting to initialize can lead to incorrect results.

5. **Overcomplicating with simulation**: Some candidates try to simulate raising buildings incrementally or use complex data structures. The beauty of this problem is its simplicity once you recognize the dual constraint pattern.

## When You'll See This Pattern

This problem teaches the **constraint propagation** pattern, where each element is limited by multiple independent constraints. You'll see similar patterns in:

1. **Candy (LeetCode 135)**: Each child's candy is constrained by neighbors on both sides. Like our building height being constrained by row and column maximums.

2. **Trapping Rain Water (LeetCode 42)**: The water at each position is constrained by the maximum height to its left AND right. This is essentially a 1D version of our 2D constraint problem.

3. **Container With Most Water (LeetCode 11)**: The water height is constrained by the shorter of the two sides, similar to how our building height is constrained by the minimum of row and column maximums.

4. **Matrix-related problems with row/column constraints**: Any problem where you need to transform a matrix while preserving certain row and column properties will use similar logic.

## Key Takeaways

1. **Look for independent constraints**: When an element is constrained by multiple factors that don't interact directly (like row and column constraints), you can often precompute each constraint separately.

2. **The minimum of constraints is key**: When you have multiple upper bounds, the actual limit is the smallest one. This "weakest link" principle appears in many optimization problems.

3. **Precomputation saves time**: By calculating row and column maximums upfront (O(n²)), we avoid recalculating them for each building, which would be O(n³).

4. **Visualize the problem**: Drawing the grid and tracing through a small example helps reveal the pattern that each building's limit is `min(rowMax, colMax)`.

[Practice this problem on CodeJeet](/problem/max-increase-to-keep-city-skyline)
