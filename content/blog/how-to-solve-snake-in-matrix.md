---
title: "How to Solve Snake in Matrix — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Snake in Matrix. Easy difficulty, 82.4% acceptance rate. Topics: Array, String, Simulation."
date: "2027-12-22"
category: "dsa-patterns"
tags: ["snake-in-matrix", "array", "string", "simulation", "easy"]
---

# How to Solve Snake in Matrix

This problem simulates a snake moving through an n×n matrix following a sequence of commands. While conceptually straightforward, it requires careful handling of boundary conditions and coordinate transformations. The challenge lies in correctly mapping the snake's position between the linear command sequence and the 2D matrix coordinates, then ensuring the snake stays within bounds.

## Visual Walkthrough

Let's trace through an example with `n = 3` and commands `"RDD"`:

**Initial Setup:**

- Matrix is 3×3, so cells are numbered 0 through 8
- Snake starts at cell 0, which corresponds to position (0, 0)
- Commands: "R" (right), "D" (down), "D" (down)

**Step 1: Command "R" (right)**

- Current position: (0, 0)
- Move right: (0, 1)
- Check bounds: 0 ≤ 0 < 3 and 0 ≤ 1 < 3 ✓
- New position: (0, 1) which is cell 1

**Step 2: Command "D" (down)**

- Current position: (0, 1)
- Move down: (1, 1)
- Check bounds: 0 ≤ 1 < 3 and 0 ≤ 1 < 3 ✓
- New position: (1, 1) which is cell 4

**Step 3: Command "D" (down)**

- Current position: (1, 1)
- Move down: (2, 1)
- Check bounds: 0 ≤ 2 < 3 and 0 ≤ 1 < 3 ✓
- New position: (2, 1) which is cell 7

**Final result:** The snake ends at cell 7.

Now let's consider what happens if the snake tries to move out of bounds. If we had command "U" (up) from position (0, 0), we'd check if (0-1, 0) = (-1, 0) is within bounds. Since -1 < 0, we'd stay at (0, 0).

## Brute Force Approach

For this problem, there's really only one reasonable approach: simulate the snake's movement step by step. A true "brute force" alternative doesn't exist since we must process each command sequentially to determine the final position.

However, some candidates might try to:

1. **Precompute all positions without bounds checking** - This would fail when the snake tries to move out of bounds
2. **Use complex mathematical formulas** - Trying to calculate the final position directly without simulation would be error-prone and miss the bounds checking requirement

The simulation approach is already optimal for this problem since we must process each command at least once to check bounds at each step.

## Optimal Solution

We'll simulate the snake's movement by:

1. Starting at position (0, 0) corresponding to cell 0
2. For each command, calculate the new position
3. Check if the new position is within the n×n grid
4. If valid, update position; otherwise, stay in current position
5. Convert final (row, col) back to cell number

<div class="code-group">

```python
# Time: O(m) where m is length of commands | Space: O(1)
def snakeInMatrix(n, commands):
    """
    Simulates snake movement in an n x n matrix.

    Args:
        n: Size of the matrix (n x n)
        commands: String of movement commands ('U', 'D', 'L', 'R')

    Returns:
        Integer representing the final cell number
    """
    # Start at cell 0, which corresponds to (0, 0)
    row, col = 0, 0

    # Process each command sequentially
    for cmd in commands:
        # Calculate potential new position based on command
        if cmd == 'U':
            new_row, new_col = row - 1, col
        elif cmd == 'D':
            new_row, new_col = row + 1, col
        elif cmd == 'L':
            new_row, new_col = row, col - 1
        elif cmd == 'R':
            new_row, new_col = row, col + 1

        # Check if new position is within bounds
        # Must satisfy: 0 <= row < n AND 0 <= col < n
        if 0 <= new_row < n and 0 <= new_col < n:
            # Move to valid position
            row, col = new_row, new_col
        # If out of bounds, stay at current position (do nothing)

    # Convert final (row, col) back to cell number
    # Formula: cell = (row * n) + col
    return (row * n) + col
```

```javascript
// Time: O(m) where m is length of commands | Space: O(1)
function snakeInMatrix(n, commands) {
  /**
   * Simulates snake movement in an n x n matrix.
   *
   * @param {number} n - Size of the matrix (n x n)
   * @param {string} commands - String of movement commands ('U', 'D', 'L', 'R')
   * @return {number} - Final cell number
   */

  // Start at cell 0, which corresponds to (0, 0)
  let row = 0,
    col = 0;

  // Process each command sequentially
  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];
    let newRow = row,
      newCol = col;

    // Calculate potential new position based on command
    switch (cmd) {
      case "U":
        newRow = row - 1;
        break;
      case "D":
        newRow = row + 1;
        break;
      case "L":
        newCol = col - 1;
        break;
      case "R":
        newCol = col + 1;
        break;
    }

    // Check if new position is within bounds
    // Must satisfy: 0 <= row < n AND 0 <= col < n
    if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n) {
      // Move to valid position
      row = newRow;
      col = newCol;
    }
    // If out of bounds, stay at current position (do nothing)
  }

  // Convert final (row, col) back to cell number
  // Formula: cell = (row * n) + col
  return row * n + col;
}
```

```java
// Time: O(m) where m is length of commands | Space: O(1)
class Solution {
    public int snakeInMatrix(int n, String commands) {
        /**
         * Simulates snake movement in an n x n matrix.
         *
         * @param n - Size of the matrix (n x n)
         * @param commands - String of movement commands ('U', 'D', 'L', 'R')
         * @return - Final cell number
         */

        // Start at cell 0, which corresponds to (0, 0)
        int row = 0, col = 0;

        // Process each command sequentially
        for (int i = 0; i < commands.length(); i++) {
            char cmd = commands.charAt(i);
            int newRow = row, newCol = col;

            // Calculate potential new position based on command
            switch (cmd) {
                case 'U':
                    newRow = row - 1;
                    break;
                case 'D':
                    newRow = row + 1;
                    break;
                case 'L':
                    newCol = col - 1;
                    break;
                case 'R':
                    newCol = col + 1;
                    break;
            }

            // Check if new position is within bounds
            // Must satisfy: 0 <= row < n AND 0 <= col < n
            if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n) {
                // Move to valid position
                row = newRow;
                col = newCol;
            }
            // If out of bounds, stay at current position (do nothing)
        }

        // Convert final (row, col) back to cell number
        // Formula: cell = (row * n) + col
        return (row * n) + col;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m)**

- We process each command exactly once, where `m` is the length of the commands string
- Each command requires O(1) operations: checking the command, calculating new position, and bounds checking
- No nested loops or recursive calls, so linear time complexity

**Space Complexity: O(1)**

- We only use a constant amount of extra space regardless of input size
- Variables: `row`, `col`, `newRow`, `newCol`, loop counter
- No additional data structures that grow with input size

## Common Mistakes

1. **Incorrect bounds checking**: The most common error is using `<= n` instead of `< n` for bounds checking. Remember: if `n = 3`, valid indices are 0, 1, 2. Using `row <= n` would allow row = 3, which is out of bounds.

2. **Forgetting to handle invalid moves**: Some candidates update position without checking bounds first. Always check if the new position is valid before updating current position.

3. **Wrong coordinate to cell conversion**: Using `(row + col)` instead of `(row * n + col)` to convert back to cell number. Remember the formula given in the problem: `grid[i][j] = (i * n) + j`.

4. **Not starting at position (0, 0)**: The snake starts at cell 0, which is `(0, 0)`, not `(1, 1)` or any other position. This is a common off-by-one error.

## When You'll See This Pattern

This simulation pattern appears in many grid-based movement problems:

1. **Robot Bounded In Circle (LeetCode 1041)**: Similar movement simulation with commands that repeat, requiring detection of cycles.

2. **Walking Robot Simulation (LeetCode 874)**: More complex version with obstacles and different command structure.

3. **Spiral Matrix (LeetCode 54)**: While not command-based, it involves systematic movement through a grid with direction changes.

The core technique of maintaining a current position, processing movement commands, and checking constraints applies to all these problems. The key insight is representing position as (row, col) coordinates and updating them based on movement rules.

## Key Takeaways

1. **Grid simulation problems often follow a simple pattern**: Initialize position, process commands/instructions, check constraints at each step, update position if valid.

2. **Coordinate transformations are crucial**: Know how to convert between linear indices and 2D coordinates. The formula `cell = row * n + col` and its inverse `row = cell // n`, `col = cell % n` are fundamental.

3. **Always validate moves before executing them**: In any movement simulation, check boundaries, obstacles, or other constraints before updating the current position.

4. **Start simple with concrete examples**: When stuck, trace through a small example step by step. This often reveals edge cases and logic errors.

[Practice this problem on CodeJeet](/problem/snake-in-matrix)
