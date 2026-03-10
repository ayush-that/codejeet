---
title: "How to Solve Rotating the Box — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Rotating the Box. Medium difficulty, 79.2% acceptance rate. Topics: Array, Two Pointers, Matrix."
date: "2026-05-28"
category: "dsa-patterns"
tags: ["rotating-the-box", "array", "two-pointers", "matrix", "medium"]
---

# How to Solve Rotating the Box

This problem asks us to simulate what happens when a box containing stones (`'#'`), obstacles (`'*'`), and empty spaces (`'.'`) is rotated 90 degrees clockwise, with stones falling due to gravity after the rotation. The tricky part is that we need to handle both the rotation transformation and the gravity simulation efficiently, without actually creating a rotated matrix first and then applying gravity separately.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
[["#",".","*","."],
 ["#","#","*","."]]
```

**Step 1 - Understanding the rotation:**  
When rotated 90° clockwise, what was the last column becomes the first row, the second-to-last column becomes the second row, and so on. But instead of actually rotating, we can think about processing each column from bottom to top.

**Step 2 - Applying gravity in the rotated view:**  
After rotation, gravity pulls stones "down" (which was originally "right" in the unrotated box). So in the rotated view, stones fall to the right until they hit an obstacle or the wall.

**Step 3 - Processing a column example:**  
Take the first column `["#", "#"]`. In the rotated view, this becomes part of a row. The stones need to fall rightward. We can process from right to left in each row of the original box to simulate where stones land after rotation.

**Step 4 - Final result:**  
For our example, the output should be:

```
[[".","#","*","."],
 [".","#","*","#"]]
```

## Brute Force Approach

A naive approach would be:

1. Create a new matrix rotated 90° clockwise
2. For each row in the rotated matrix, simulate gravity by moving stones rightward until they hit obstacles or boundaries
3. Rotate the result back 90° counterclockwise

This approach has several issues:

- It requires O(m×n) extra space for the rotated matrix
- Multiple passes over the data
- The back-and-forth rotation is unnecessary

The key insight is that we can process the original matrix in a way that directly produces the final result without explicit rotation.

## Optimized Approach

The optimal approach uses **two pointers within each row**:

1. **Process each row independently** from right to left
2. **Track the next available position** where a stone can fall
3. **Handle obstacles as fixed points** that reset the available position

**Key insight:** After 90° clockwise rotation, what was the bottom of a column becomes the right end of a row. So processing from right to left in the original matrix corresponds to processing from bottom to top in the rotated view.

**Step-by-step reasoning:**

- Start from the rightmost column and move leftward
- Keep track of the next empty position where a stone can fall
- When you encounter a stone, move it to the empty position and mark its original position as empty
- When you encounter an obstacle, reset the empty position tracker to just left of the obstacle
- Empty spaces don't affect the tracker

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(m * n) | Space: O(1) excluding output
def rotateTheBox(boxGrid):
    """
    Simulates rotating a box 90° clockwise with gravity.

    Args:
        boxGrid: List[List[str]] - The box representation

    Returns:
        List[List[str]] - The box after rotation with gravity applied
    """
    m, n = len(boxGrid), len(boxGrid[0])

    # Process each row independently
    for row in range(m):
        # We'll process from right to left
        # empty_pos tracks the next available position for a stone
        empty_pos = n - 1

        for col in range(n - 1, -1, -1):
            if boxGrid[row][col] == '*':
                # Obstacle: reset empty position to left of obstacle
                empty_pos = col - 1
            elif boxGrid[row][col] == '#':
                # Stone: move it to empty_pos if possible
                if empty_pos > col:
                    # Move stone to empty position
                    boxGrid[row][empty_pos] = '#'
                    boxGrid[row][col] = '.'
                    empty_pos -= 1
                elif empty_pos == col:
                    # Stone is already at the rightmost possible position
                    empty_pos = col - 1
                # If empty_pos < col, stone cannot move (blocked by obstacles)
            # For empty cells ('.'), we don't need to do anything

    # Now rotate the result 90° clockwise
    # After processing, the stones have settled in their final positions
    # Rotating is straightforward: last column becomes first row, etc.

    # Create result matrix with swapped dimensions
    result = [['.' for _ in range(m)] for _ in range(n)]

    # Perform 90° clockwise rotation
    for i in range(m):
        for j in range(n):
            result[j][m - 1 - i] = boxGrid[i][j]

    return result
```

```javascript
// Time: O(m * n) | Space: O(1) excluding output
function rotateTheBox(boxGrid) {
  /**
   * Simulates rotating a box 90° clockwise with gravity.
   *
   * @param {character[][]} boxGrid - The box representation
   * @return {character[][]} - The box after rotation with gravity applied
   */
  const m = boxGrid.length;
  const n = boxGrid[0].length;

  // Process each row independently
  for (let row = 0; row < m; row++) {
    // Process from right to left
    // emptyPos tracks the next available position for a stone
    let emptyPos = n - 1;

    for (let col = n - 1; col >= 0; col--) {
      if (boxGrid[row][col] === "*") {
        // Obstacle: reset empty position to left of obstacle
        emptyPos = col - 1;
      } else if (boxGrid[row][col] === "#") {
        // Stone: move it to emptyPos if possible
        if (emptyPos > col) {
          // Move stone to empty position
          boxGrid[row][emptyPos] = "#";
          boxGrid[row][col] = ".";
          emptyPos--;
        } else if (emptyPos === col) {
          // Stone is already at the rightmost possible position
          emptyPos = col - 1;
        }
        // If emptyPos < col, stone cannot move (blocked by obstacles)
      }
      // For empty cells ('.'), we don't need to do anything
    }
  }

  // Now rotate the result 90° clockwise
  // Create result matrix with swapped dimensions
  const result = Array(n)
    .fill()
    .map(() => Array(m).fill("."));

  // Perform 90° clockwise rotation
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      result[j][m - 1 - i] = boxGrid[i][j];
    }
  }

  return result;
}
```

```java
// Time: O(m * n) | Space: O(1) excluding output
class Solution {
    public char[][] rotateTheBox(char[][] boxGrid) {
        /**
         * Simulates rotating a box 90° clockwise with gravity.
         *
         * @param boxGrid - The box representation
         * @return The box after rotation with gravity applied
         */
        int m = boxGrid.length;
        int n = boxGrid[0].length;

        // Process each row independently
        for (int row = 0; row < m; row++) {
            // Process from right to left
            // emptyPos tracks the next available position for a stone
            int emptyPos = n - 1;

            for (int col = n - 1; col >= 0; col--) {
                if (boxGrid[row][col] == '*') {
                    // Obstacle: reset empty position to left of obstacle
                    emptyPos = col - 1;
                } else if (boxGrid[row][col] == '#') {
                    // Stone: move it to emptyPos if possible
                    if (emptyPos > col) {
                        // Move stone to empty position
                        boxGrid[row][emptyPos] = '#';
                        boxGrid[row][col] = '.';
                        emptyPos--;
                    } else if (emptyPos == col) {
                        // Stone is already at the rightmost possible position
                        emptyPos = col - 1;
                    }
                    // If emptyPos < col, stone cannot move (blocked by obstacles)
                }
                // For empty cells ('.'), we don't need to do anything
            }
        }

        // Now rotate the result 90° clockwise
        // Create result matrix with swapped dimensions
        char[][] result = new char[n][m];

        // Initialize with empty cells
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                result[i][j] = '.';
            }
        }

        // Perform 90° clockwise rotation
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                result[j][m - 1 - i] = boxGrid[i][j];
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- We process each cell exactly twice: once for gravity simulation (O(m × n)) and once for rotation (O(m × n))
- This simplifies to O(m × n) overall

**Space Complexity:** O(1) excluding the output space

- We modify the input matrix in-place for the gravity simulation
- The rotation requires O(m × n) space for the output, but this is required by the problem specification
- If we consider only auxiliary space, it's O(1) since we only use a few variables

## Common Mistakes

1. **Processing left to right instead of right to left:**  
   Stones need to fall to the right after rotation, so we must process from right to left to ensure we always know the next available position.

2. **Forgetting to handle the case when emptyPos == col:**  
   When a stone is already at the rightmost possible position, we need to update emptyPos to continue processing other stones correctly.

3. **Not resetting emptyPos at obstacles:**  
   Obstacles block stone movement, so emptyPos must be reset to the position immediately left of any obstacle.

4. **Incorrect rotation indices:**  
   The rotation formula `result[j][m - 1 - i] = boxGrid[i][j]` is easy to get wrong. Remember that after rotation, dimensions swap and rows become reversed columns.

## When You'll See This Pattern

This problem combines **two-pointer technique** with **matrix transformation**. You'll see similar patterns in:

1. **Move Zeroes (LeetCode 283)** - Uses similar two-pointer approach to move elements to the end
2. **Trapping Rain Water (LeetCode 42)** - Uses two pointers to track boundaries while processing
3. **Rotate Image (LeetCode 48)** - Involves 90° matrix rotation without additional elements falling
4. **Candy Crush (LeetCode 723)** - Similar gravity simulation with falling elements

The core pattern is using pointers to track available positions while processing in a specific direction to simulate gravity or compaction.

## Key Takeaways

1. **Process in the direction of movement:** When simulating gravity, always process in the opposite direction of the fall to know where elements should land.

2. **Two pointers for compaction:** Use one pointer to track the next available position and another to scan for elements to move.

3. **Combine transformations:** Sometimes you can combine multiple operations (rotation + gravity) by understanding how they interact, rather than performing them sequentially.

[Practice this problem on CodeJeet](/problem/rotating-the-box)
