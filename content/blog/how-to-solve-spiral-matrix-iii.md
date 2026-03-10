---
title: "How to Solve Spiral Matrix III — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Spiral Matrix III. Medium difficulty, 84.5% acceptance rate. Topics: Array, Matrix, Simulation."
date: "2026-05-08"
category: "dsa-patterns"
tags: ["spiral-matrix-iii", "array", "matrix", "simulation", "medium"]
---

# How to Solve Spiral Matrix III

This problem asks you to simulate walking through a grid in a clockwise spiral pattern starting from a given position, but with a twist: you must continue walking even when outside the grid boundaries. The challenge is generating the correct spiral movement pattern while tracking which positions are actually within the grid bounds. Unlike the classic Spiral Matrix problem where you stay within bounds, here you simulate the full spiral path and filter valid positions.

## Visual Walkthrough

Let's trace through a small example: `rows = 3`, `cols = 4`, `rStart = 0`, `cStart = 0`

We start at (0,0) facing east. The spiral pattern follows this movement sequence:

1. Move 1 step east
2. Move 1 step south
3. Move 2 steps west
4. Move 2 steps north
5. Move 3 steps east
6. Move 3 steps south
   ... and so on

Notice the pattern: we move `k` steps in one direction, then `k` steps in the next direction, then `k+1` steps, then `k+1` steps, and so on. The step count increases every two direction changes.

Let's walk through the first few moves:

- Start at (0,0) - within grid ✓
- Move 1 east: (0,1) - within grid ✓
- Move 1 south: (1,1) - within grid ✓
- Move 2 west: (1,0) ✓, (1,-1) ✗ (outside)
- Move 2 north: (0,-1) ✗, (-1,-1) ✗
- Move 3 east: (-1,0) ✗, (-1,1) ✗, (-1,2) ✗
- Move 3 south: (0,2) ✓, (1,2) ✓, (2,2) ✓

We continue until we've visited all 12 positions (3×4 grid). The key insight is that we simulate the full spiral path, checking at each step if the current position is within bounds.

## Brute Force Approach

A naive approach might try to generate all positions in the grid first, then sort them in spiral order. However, this doesn't work because:

1. We need to generate positions in the exact spiral walking order
2. We need to include positions outside the grid during simulation
3. The spiral pattern depends on our starting position and direction

Another brute force approach would be to simulate walking until we've visited all `rows × cols` positions. We could use a while loop that continues until our result list contains all positions. The challenge is determining when to change direction and how many steps to take in each direction.

The naive simulation approach would work but might be inefficient if implemented poorly (e.g., checking all four directions at each step). However, the real issue with a naive implementation is getting the spiral movement pattern wrong - specifically, not recognizing that step counts follow the pattern: 1,1,2,2,3,3,4,4,...

## Optimized Approach

The key insight is recognizing the spiral movement pattern:

- We always move in this sequence of directions: east → south → west → north → east → ...
- The number of steps increases every two direction changes: 1,1,2,2,3,3,4,4,...

Here's the step-by-step reasoning:

1. We need to visit `rows × cols` positions total
2. We start at the given position facing east
3. We'll maintain variables for:
   - Current position (row, col)
   - Current direction (using direction vectors)
   - Current step length
   - Number of steps taken in current direction
4. We alternate between moving horizontally and vertically
5. After completing two direction changes (east+south or west+north), we increment the step length
6. At each step, we check if the current position is within grid bounds
7. We continue until we've collected all positions

The direction order is crucial: east (0,1), south (1,0), west (0,-1), north (-1,0). After north, we cycle back to east.

## Optimal Solution

The optimal solution simulates the spiral walk using the step pattern described above. We use direction vectors to handle movement cleanly and a while loop that continues until we've visited all positions.

<div class="code-group">

```python
# Time: O(max(rows, cols)^2) - in worst case we simulate the full spiral
# Space: O(rows * cols) for the output list
def spiralMatrixIII(rows, cols, rStart, cStart):
    """
    Simulate walking in a clockwise spiral starting from (rStart, cStart).
    We continue walking even outside grid bounds, only adding positions
    that are within the grid to our result.
    """
    # All positions we need to visit
    total_cells = rows * cols
    result = []

    # Starting position
    row, col = rStart, cStart

    # Direction vectors in order: east, south, west, north
    # This order gives us clockwise movement
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    dir_idx = 0  # Start facing east

    # Step length starts at 1, increases every 2 direction changes
    step_length = 1
    steps_taken = 0  # Steps taken in current direction

    # Continue until we've visited all cells
    while len(result) < total_cells:
        # Check if current position is within grid bounds
        if 0 <= row < rows and 0 <= col < cols:
            result.append([row, col])

        # Move one step in current direction
        row += directions[dir_idx][0]
        col += directions[dir_idx][1]
        steps_taken += 1

        # If we've taken all steps in current direction, change direction
        if steps_taken == step_length:
            steps_taken = 0
            dir_idx = (dir_idx + 1) % 4  # Cycle through directions

            # After every 2 direction changes, increase step length
            # When dir_idx is 0 (east) or 2 (west), we just changed to a horizontal direction
            # We increase step length after changing to east or west
            if dir_idx == 0 or dir_idx == 2:
                step_length += 1

    return result
```

```javascript
// Time: O(max(rows, cols)^2) - in worst case we simulate the full spiral
// Space: O(rows * cols) for the output array
function spiralMatrixIII(rows, cols, rStart, cStart) {
  /**
   * Simulate walking in a clockwise spiral starting from (rStart, cStart).
   * We continue walking even outside grid bounds, only adding positions
   * that are within the grid to our result.
   */
  // All positions we need to visit
  const totalCells = rows * cols;
  const result = [];

  // Starting position
  let row = rStart,
    col = cStart;

  // Direction vectors in order: east, south, west, north
  // This order gives us clockwise movement
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  let dirIdx = 0; // Start facing east

  // Step length starts at 1, increases every 2 direction changes
  let stepLength = 1;
  let stepsTaken = 0; // Steps taken in current direction

  // Continue until we've visited all cells
  while (result.length < totalCells) {
    // Check if current position is within grid bounds
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      result.push([row, col]);
    }

    // Move one step in current direction
    row += directions[dirIdx][0];
    col += directions[dirIdx][1];
    stepsTaken++;

    // If we've taken all steps in current direction, change direction
    if (stepsTaken === stepLength) {
      stepsTaken = 0;
      dirIdx = (dirIdx + 1) % 4; // Cycle through directions

      // After every 2 direction changes, increase step length
      // When dirIdx is 0 (east) or 2 (west), we just changed to a horizontal direction
      // We increase step length after changing to east or west
      if (dirIdx === 0 || dirIdx === 2) {
        stepLength++;
      }
    }
  }

  return result;
}
```

```java
// Time: O(max(rows, cols)^2) - in worst case we simulate the full spiral
// Space: O(rows * cols) for the output list
public int[][] spiralMatrixIII(int rows, int cols, int rStart, int cStart) {
    /**
     * Simulate walking in a clockwise spiral starting from (rStart, cStart).
     * We continue walking even outside grid bounds, only adding positions
     * that are within the grid to our result.
     */
    // All positions we need to visit
    int totalCells = rows * cols;
    int[][] result = new int[totalCells][2];
    int resultIdx = 0;

    // Starting position
    int row = rStart, col = cStart;

    // Direction vectors in order: east, south, west, north
    // This order gives us clockwise movement
    int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
    int dirIdx = 0;  // Start facing east

    // Step length starts at 1, increases every 2 direction changes
    int stepLength = 1;
    int stepsTaken = 0;  // Steps taken in current direction

    // Continue until we've visited all cells
    while (resultIdx < totalCells) {
        // Check if current position is within grid bounds
        if (row >= 0 && row < rows && col >= 0 && col < cols) {
            result[resultIdx][0] = row;
            result[resultIdx][1] = col;
            resultIdx++;
        }

        // Move one step in current direction
        row += directions[dirIdx][0];
        col += directions[dirIdx][1];
        stepsTaken++;

        // If we've taken all steps in current direction, change direction
        if (stepsTaken == stepLength) {
            stepsTaken = 0;
            dirIdx = (dirIdx + 1) % 4;  // Cycle through directions

            // After every 2 direction changes, increase step length
            // When dirIdx is 0 (east) or 2 (west), we just changed to a horizontal direction
            // We increase step length after changing to east or west
            if (dirIdx == 0 || dirIdx == 2) {
                stepLength++;
            }
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(max(rows, cols)²) in the worst case. Why? In the worst case (starting at a corner), we need to simulate a spiral large enough to cover the entire grid. The spiral will have a "radius" approximately equal to max(rows, cols), and the number of steps in the spiral grows quadratically with this radius. More precisely, if we need to take N steps to cover the grid, N is proportional to (max dimension)².

**Space Complexity:** O(rows × cols) for the output list. We only use a constant amount of extra space for variables (row, col, directions, etc.), but we must store all positions in the result.

## Common Mistakes

1. **Incorrect step pattern:** The most common mistake is not recognizing that step lengths increase every two direction changes (1,1,2,2,3,3,...). Some candidates try to use a fixed pattern or increase step length after every direction change.

2. **Boundary checking timing:** Checking bounds before moving instead of after moving, or vice versa. We need to check the current position at the beginning of each iteration, before we move to the next position.

3. **Infinite loops:** Forgetting to increment the step length or not properly tracking when to change direction can lead to infinite loops. Always test with small examples to verify the spiral pattern.

4. **Direction order confusion:** Using the wrong order of directions (not clockwise) or not cycling properly through directions. Remember: east → south → west → north → east...

## When You'll See This Pattern

This spiral simulation pattern appears in several matrix traversal problems:

1. **Spiral Matrix (LeetCode 54):** Traverse a matrix in spiral order, but stay within bounds. The movement pattern is similar but simpler since you don't continue outside the grid.

2. **Spiral Matrix II (LeetCode 59):** Generate a matrix filled with numbers in spiral order. Uses similar directional movement but focuses on writing values rather than tracking positions.

3. **Robot Bounded In Circle (LeetCode 1041):** Uses directional movement and cycling through directions to determine if a robot returns to the origin.

The core technique of using direction vectors and step patterns is useful for any grid-based simulation or traversal problem where movement follows a predictable pattern.

## Key Takeaways

1. **Direction vectors simplify movement:** Using arrays like `[(0,1), (1,0), (0,-1), (-1,0)]` makes it easy to change directions by just updating an index, rather than writing complex if-else statements for each direction.

2. **Pattern recognition is key:** Many matrix problems have hidden patterns in movement or traversal. Look for sequences in step counts, direction changes, or boundary conditions.

3. **Simulate, then optimize:** For simulation problems, first get the simulation working correctly with clear, readable code. Only optimize if performance is an issue (which it usually isn't in interview settings if you have the right algorithm).

Related problems: [Spiral Matrix](/problem/spiral-matrix), [Spiral Matrix II](/problem/spiral-matrix-ii), [Spiral Matrix IV](/problem/spiral-matrix-iv)
