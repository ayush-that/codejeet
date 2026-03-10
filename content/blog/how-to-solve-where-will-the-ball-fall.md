---
title: "How to Solve Where Will the Ball Fall — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Where Will the Ball Fall. Medium difficulty, 72.3% acceptance rate. Topics: Array, Matrix, Simulation."
date: "2026-09-17"
category: "dsa-patterns"
tags: ["where-will-the-ball-fall", "array", "matrix", "simulation", "medium"]
---

# How to Solve Where Will the Ball Fall

This problem presents a 2D grid where diagonal boards in each cell redirect a ball either right or left. Starting with `n` balls at the top, we need to determine where each ball exits at the bottom, or if it gets stuck. The challenge lies in efficiently simulating each ball's path through the grid while handling the board interactions that can trap balls.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this 3x6 grid:

```
grid = [
    [1,  1,  1, -1, -1, -1],
    [1,  1,  1, -1, -1, -1],
    [-1, -1, -1,  1,  1,  1],
    [1,  1,  1, -1, -1, -1],
    [-1, -1, -1,  1,  1,  1]
]
```

**Ball 0 (starting at column 0):**

- Row 0, Col 0: Value = 1 (redirects right). Ball moves to (0, 1)
- Row 0, Col 1: Value = 1 (redirects right). Ball moves to (0, 2)
- Row 0, Col 2: Value = 1 (redirects right). Ball moves to (0, 3)
- Row 0, Col 3: Value = -1 (redirects left). Ball moves to (0, 2)
- **STUCK**: Ball at (0,3) with -1 wants to go left to (0,2), but (0,2) has 1 which wants to go right. The V-shape traps the ball.

**Ball 1 (starting at column 1):**

- Row 0, Col 1: Value = 1 → (0, 2)
- Row 0, Col 2: Value = 1 → (0, 3)
- Row 0, Col 3: Value = -1 → (0, 2) ← Stuck (same V-shape as Ball 0)

**Ball 2 (starting at column 2):**

- Row 0, Col 2: Value = 1 → (0, 3)
- Row 0, Col 3: Value = -1 → (0, 2) ← Stuck immediately

**Ball 3 (starting at column 3):**

- Row 0, Col 3: Value = -1 → (0, 2)
- Row 0, Col 2: Value = 1 → (0, 3) ← Stuck (V-shape)

**Ball 4 (starting at column 4):**

- Row 0, Col 4: Value = -1 → (0, 3)
- Row 0, Col 3: Value = -1 → (0, 2)
- Row 0, Col 2: Value = 1 → (0, 3) ← Stuck

**Ball 5 (starting at column 5):**

- Row 0, Col 5: Value = -1 → (0, 4)
- Row 0, Col 4: Value = -1 → (0, 3)
- Row 0, Col 3: Value = -1 → (0, 2)
- Row 0, Col 2: Value = 1 → (0, 3) ← Stuck

All balls get stuck! The output would be `[-1, -1, -1, -1, -1, -1]`.

This visualization shows us two key insights:

1. A ball gets stuck when it encounters a "V" shape (1 next to -1) or a "-1 next to 1")
2. We need to track each ball's column position as it moves through rows

## Brute Force Approach

The most straightforward approach is to simulate each ball independently. For each starting column, we would:

1. Initialize the ball's current column position
2. For each row from top to bottom:
   - Check the current cell's value (1 or -1)
   - Determine the next column based on the direction
   - Check if the ball would get stuck (either hitting a wall or encountering a V-shape)
3. Record the final column if the ball reaches the bottom, or -1 if it gets stuck

While this approach is conceptually simple, it has a major inefficiency: we're processing each ball separately, potentially re-traversing the same paths multiple times. For an m×n grid with n balls, this gives us O(m×n²) time complexity since each of n balls might traverse up to m rows, and at each step we might check adjacent cells.

However, the problem constraints (m, n up to 100) make even this brute force approach acceptable in practice. But we can do better with a more elegant solution that avoids redundant checks.

## Optimized Approach

The key insight is that we can simulate all balls simultaneously using a single pass through the grid. Instead of tracking each ball separately, we track what column each ball would be in after processing each row.

Here's the step-by-step reasoning:

1. **Initialization**: Start with an array where `result[i] = i` - each ball begins in its own column.

2. **Row-by-row processing**: For each row in the grid:
   - Create a new array to track where balls will be after this row
   - Initialize it with -1 (indicating balls that get stuck)
   - For each column in the current row:
     - If a ball is currently in this column (not -1 in the previous result):
       - Determine the next column based on the board direction
       - Check if the move is valid (not hitting a wall or V-shape)
       - If valid, update the ball's new position

3. **Valid move check**: A move is valid if:
   - The ball doesn't go out of bounds (0 ≤ next_col < n)
   - The adjacent cell in the same direction has the same board orientation (no V-shape)

4. **Termination**: After processing all rows, the result array contains the final column for each ball (or -1 if stuck).

This approach is optimal because we process each cell exactly once while tracking all balls simultaneously, giving us O(m×n) time complexity.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(m * n) | Space: O(n)
def findBall(grid):
    """
    Simulates the path of each ball through the grid.

    Args:
        grid: 2D list of integers where 1 means board redirects right,
              -1 means board redirects left

    Returns:
        List of integers where each element is the final column
        for the ball starting at that column, or -1 if stuck
    """
    m, n = len(grid), len(grid[0])
    # Initialize result: ball i starts at column i
    result = list(range(n))

    # Process each row from top to bottom
    for row in range(m):
        # Create new array for balls' positions after this row
        new_result = [-1] * n

        for col in range(n):
            # If no ball in this column from previous row, skip
            if result[col] == -1:
                continue

            # Current ball's position
            current_col = result[col]

            # Determine next column based on board direction
            next_col = current_col + grid[row][current_col]

            # Check if move is valid:
            # 1. Next column must be within bounds
            # 2. Adjacent cell must have same direction to avoid V-shape
            if (0 <= next_col < n and
                grid[row][current_col] == grid[row][next_col]):
                # Valid move - ball continues to next column
                new_result[col] = next_col
            else:
                # Ball gets stuck - remains -1
                new_result[col] = -1

        # Update result for next row
        result = new_result

    return result
```

```javascript
// Time: O(m * n) | Space: O(n)
/**
 * Simulates the path of each ball through the grid.
 *
 * @param {number[][]} grid - 2D array where 1 means board redirects right,
 *                            -1 means board redirects left
 * @return {number[]} - Array where each element is the final column
 *                      for the ball starting at that column, or -1 if stuck
 */
function findBall(grid) {
  const m = grid.length;
  const n = grid[0].length;

  // Initialize result: ball i starts at column i
  let result = Array.from({ length: n }, (_, i) => i);

  // Process each row from top to bottom
  for (let row = 0; row < m; row++) {
    // Create new array for balls' positions after this row
    const newResult = new Array(n).fill(-1);

    for (let col = 0; col < n; col++) {
      // If no ball in this column from previous row, skip
      if (result[col] === -1) {
        continue;
      }

      // Current ball's position
      const currentCol = result[col];

      // Determine next column based on board direction
      const nextCol = currentCol + grid[row][currentCol];

      // Check if move is valid:
      // 1. Next column must be within bounds
      // 2. Adjacent cell must have same direction to avoid V-shape
      if (nextCol >= 0 && nextCol < n && grid[row][currentCol] === grid[row][nextCol]) {
        // Valid move - ball continues to next column
        newResult[col] = nextCol;
      } else {
        // Ball gets stuck - remains -1
        newResult[col] = -1;
      }
    }

    // Update result for next row
    result = newResult;
  }

  return result;
}
```

```java
// Time: O(m * n) | Space: O(n)
class Solution {
    /**
     * Simulates the path of each ball through the grid.
     *
     * @param grid 2D array where 1 means board redirects right,
     *             -1 means board redirects left
     * @return Array where each element is the final column
     *         for the ball starting at that column, or -1 if stuck
     */
    public int[] findBall(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        // Initialize result: ball i starts at column i
        int[] result = new int[n];
        for (int i = 0; i < n; i++) {
            result[i] = i;
        }

        // Process each row from top to bottom
        for (int row = 0; row < m; row++) {
            // Create new array for balls' positions after this row
            int[] newResult = new int[n];
            Arrays.fill(newResult, -1);

            for (int col = 0; col < n; col++) {
                // If no ball in this column from previous row, skip
                if (result[col] == -1) {
                    continue;
                }

                // Current ball's position
                int currentCol = result[col];

                // Determine next column based on board direction
                int nextCol = currentCol + grid[row][currentCol];

                // Check if move is valid:
                // 1. Next column must be within bounds
                // 2. Adjacent cell must have same direction to avoid V-shape
                if (nextCol >= 0 &&
                    nextCol < n &&
                    grid[row][currentCol] == grid[row][nextCol]) {
                    // Valid move - ball continues to next column
                    newResult[col] = nextCol;
                } else {
                    // Ball gets stuck - remains -1
                    newResult[col] = -1;
                }
            }

            // Update result for next row
            result = newResult;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We iterate through each row (m iterations)
- For each row, we iterate through each column (n iterations)
- Each iteration performs constant-time operations (addition, comparison, array access)
- Total operations: m × n

**Space Complexity: O(n)**

- We maintain two arrays of size n: `result` and `newResult`
- The input grid uses O(m × n) space, but this is not counted toward auxiliary space
- No recursion or additional data structures are used

This is optimal since we must examine each cell at least once to determine ball paths.

## Common Mistakes

1. **Incorrect V-shape detection**: The most common error is only checking if `next_col` is within bounds without verifying the adjacent cell has the same direction. Remember: a ball gets stuck not just at walls, but also when adjacent cells form a V-shape (1 next to -1).

2. **Modifying result array in-place**: If you update the `result` array while still reading from it in the same row, you'll use partially updated values. Always create a new array for each row's results.

3. **Wrong starting position initialization**: Some candidates initialize all balls to start at column 0. Remember: ball i starts at column i, so initial positions should be `[0, 1, 2, ..., n-1]`.

4. **Forgetting to handle already-stuck balls**: Once a ball is marked as -1 (stuck), it should remain -1 for all subsequent rows. The `continue` statement in the loop handles this.

## When You'll See This Pattern

This problem uses **state transition simulation** - tracking how entities move through a system over time. Similar patterns appear in:

1. **Robot Bounded In Circle (LeetCode 1041)**: Simulating robot movements to detect cycles. Like tracking ball positions, you track robot state (position + direction) through command sequences.

2. **Snakes and Ladders (LeetCode 909)**: Modeling piece movement on a board with special transitions (ladders and snakes). Both involve tracking position changes with special rules.

3. **Pacific Atlantic Water Flow (LeetCode 417)**: Simulating flow from multiple starting points simultaneously. Like tracking multiple balls, you track water from all ocean-adjacent cells.

The core technique is maintaining a state array that gets updated iteratively based on transition rules.

## Key Takeaways

1. **Batch simulation is efficient**: When simulating multiple entities through the same system, process them simultaneously rather than individually to avoid redundant work.

2. **State transition arrays are powerful**: Using an array to track the state of each entity after each step makes the logic clean and efficient.

3. **Boundary and adjacency checks are critical**: In grid simulation problems, carefully check both out-of-bounds conditions and interactions between adjacent cells.

[Practice this problem on CodeJeet](/problem/where-will-the-ball-fall)
