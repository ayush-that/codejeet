---
title: "How to Solve Diagonal Traverse — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Diagonal Traverse. Medium difficulty, 67.0% acceptance rate. Topics: Array, Matrix, Simulation."
date: "2027-04-05"
category: "dsa-patterns"
tags: ["diagonal-traverse", "array", "matrix", "simulation", "medium"]
---

# How to Solve Diagonal Traverse

Given an `m x n` matrix, we need to return all elements in diagonal order. The tricky part is that diagonals alternate direction: the first diagonal goes upward, the second downward, and so on. This requires careful tracking of both position and direction while handling boundary conditions when we reach the edges of the matrix.

## Visual Walkthrough

Let's trace through a 3×4 matrix to build intuition:

```
mat = [[1, 2, 3, 4],
       [5, 6, 7, 8],
       [9,10,11,12]]
```

Diagonal traversal order:

1. Start at (0,0): `[1]` (upward direction)
2. Move to (0,1): `[2,5]` (downward direction)
3. Move to (1,0): `[9,6,3]` (upward direction)
4. Move to (2,1): `[4,7,10]` (downward direction)
5. Move to (1,2): `[11,8]` (upward direction)
6. Move to (2,3): `[12]` (downward direction)

Final result: `[1,2,5,9,6,3,4,7,10,11,8,12]`

Key observations:

- When moving upward: row decreases, column increases
- When moving downward: row increases, column decreases
- We change direction when we hit matrix boundaries
- The total number of diagonals = m + n - 1

## Brute Force Approach

A naive approach might try to collect all diagonals first, then reverse alternate ones. Here's how that would work:

1. Collect all diagonals starting from first row and last column
2. Store each diagonal in an array
3. Reverse every other diagonal
4. Flatten the result

While this works, it's inefficient because:

- We traverse the matrix multiple times
- We create many intermediate arrays
- The logic for collecting diagonals is still complex
- We need to handle direction changes manually

The time complexity would be O(m × n) with O(m × n) extra space for storing all diagonals separately. While this has the same asymptotic complexity as the optimal solution, it's more complex to implement and uses more memory.

## Optimized Approach

The key insight is that we can traverse the matrix in a single pass if we carefully track:

1. Current position (row, column)
2. Current direction (upward or downward)
3. What to do when we hit boundaries

When moving upward and we hit a boundary:

- If we hit the top row (row == 0) but not the rightmost column, move right and change direction
- If we hit the rightmost column, move down and change direction

When moving downward and we hit a boundary:

- If we hit the left column (col == 0) but not the bottom row, move down and change direction
- If we hit the bottom row, move right and change direction

This approach processes each element exactly once and uses minimal extra space.

## Optimal Solution

Here's the single-pass simulation approach with detailed comments:

<div class="code-group">

```python
# Time: O(m × n) - we visit each element exactly once
# Space: O(1) - excluding the output array, we use constant extra space
def findDiagonalOrder(mat):
    # Handle edge case: empty matrix
    if not mat or not mat[0]:
        return []

    m, n = len(mat), len(mat[0])
    result = []
    row, col = 0, 0
    direction_up = True  # Start moving upward

    # We need to process all m × n elements
    for _ in range(m * n):
        # Add current element to result
        result.append(mat[row][col])

        if direction_up:
            # When moving upward: row decreases, column increases
            if col == n - 1:
                # Hit right boundary: move down and change direction
                row += 1
                direction_up = False
            elif row == 0:
                # Hit top boundary: move right and change direction
                col += 1
                direction_up = False
            else:
                # Continue moving upward
                row -= 1
                col += 1
        else:
            # When moving downward: row increases, column decreases
            if row == m - 1:
                # Hit bottom boundary: move right and change direction
                col += 1
                direction_up = True
            elif col == 0:
                # Hit left boundary: move down and change direction
                row += 1
                direction_up = True
            else:
                # Continue moving downward
                row += 1
                col -= 1

    return result
```

```javascript
// Time: O(m × n) - we visit each element exactly once
// Space: O(1) - excluding the output array, we use constant extra space
function findDiagonalOrder(mat) {
  // Handle edge case: empty matrix
  if (!mat || mat.length === 0 || mat[0].length === 0) {
    return [];
  }

  const m = mat.length;
  const n = mat[0].length;
  const result = [];
  let row = 0,
    col = 0;
  let directionUp = true; // Start moving upward

  // We need to process all m × n elements
  for (let i = 0; i < m * n; i++) {
    // Add current element to result
    result.push(mat[row][col]);

    if (directionUp) {
      // When moving upward: row decreases, column increases
      if (col === n - 1) {
        // Hit right boundary: move down and change direction
        row++;
        directionUp = false;
      } else if (row === 0) {
        // Hit top boundary: move right and change direction
        col++;
        directionUp = false;
      } else {
        // Continue moving upward
        row--;
        col++;
      }
    } else {
      // When moving downward: row increases, column decreases
      if (row === m - 1) {
        // Hit bottom boundary: move right and change direction
        col++;
        directionUp = true;
      } else if (col === 0) {
        // Hit left boundary: move down and change direction
        row++;
        directionUp = true;
      } else {
        // Continue moving downward
        row++;
        col--;
      }
    }
  }

  return result;
}
```

```java
// Time: O(m × n) - we visit each element exactly once
// Space: O(1) - excluding the output array, we use constant extra space
public int[] findDiagonalOrder(int[][] mat) {
    // Handle edge case: empty matrix
    if (mat == null || mat.length == 0 || mat[0].length == 0) {
        return new int[0];
    }

    int m = mat.length;
    int n = mat[0].length;
    int[] result = new int[m * n];
    int row = 0, col = 0;
    boolean directionUp = true;  // Start moving upward

    // We need to process all m × n elements
    for (int i = 0; i < m * n; i++) {
        // Add current element to result
        result[i] = mat[row][col];

        if (directionUp) {
            // When moving upward: row decreases, column increases
            if (col == n - 1) {
                // Hit right boundary: move down and change direction
                row++;
                directionUp = false;
            } else if (row == 0) {
                // Hit top boundary: move right and change direction
                col++;
                directionUp = false;
            } else {
                // Continue moving upward
                row--;
                col++;
            }
        } else {
            // When moving downward: row increases, column decreases
            if (row == m - 1) {
                // Hit bottom boundary: move right and change direction
                col++;
                directionUp = true;
            } else if (col == 0) {
                // Hit left boundary: move down and change direction
                row++;
                directionUp = true;
            } else {
                // Continue moving downward
                row++;
                col--;
            }
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We iterate through each element of the matrix exactly once
- The loop runs m × n times, where m is the number of rows and n is the number of columns
- Each iteration performs constant-time operations (comparisons and arithmetic)

**Space Complexity: O(1) auxiliary space, O(m × n) for output**

- We only use a few variables (row, col, direction flag) regardless of input size
- The output array necessarily stores all m × n elements, but this is required by the problem
- No additional data structures are created during traversal

## Common Mistakes

1. **Incorrect boundary handling order**: When moving upward and hitting both top and right boundaries simultaneously (at top-right corner), you must check for right boundary first. If you check top boundary first, you'll try to move right when you're already at the right edge, causing an index out of bounds error.

2. **Forgetting to handle 1×n or m×1 matrices**: These edge cases need special attention. For example, in a 1×n matrix, you're always moving "right" regardless of direction. Test with `[[1,2,3]]` and `[[1],[2],[3]]`.

3. **Off-by-one errors in boundary checks**: Using `>` instead of `>=` or vice versa when checking if you've reached the last row/column. Remember that indices are 0-based, so the last row is `m-1` and last column is `n-1`.

4. **Not resetting direction properly**: Forgetting to flip the direction flag when changing direction, or flipping it at the wrong time. The direction should change immediately after hitting a boundary, not before processing the next element.

## When You'll See This Pattern

This diagonal traversal pattern appears in several matrix problems:

1. **Spiral Matrix (LeetCode 54)**: Similar boundary-following logic but with four directions instead of two. Both require careful tracking of current position and direction changes at boundaries.

2. **Zigzag Conversion (LeetCode 6)**: While not a matrix problem, it uses similar alternating direction logic when filling characters in rows.

3. **Toeplitz Matrix (LeetCode 766)**: Requires checking elements along diagonals, though in a simpler pattern without direction changes.

4. **Decode the Slanted Ciphertext (LeetCode 2075)**: Directly uses diagonal traversal to decode messages written in diagonal patterns.

The core technique of simulating movement with direction changes and boundary handling is valuable for any grid/matrix traversal problem.

## Key Takeaways

1. **Direction flags simplify alternating patterns**: Using a boolean flag to track direction (up/down, left/right) is cleaner than trying to calculate direction from position.

2. **Boundary checks require careful ordering**: When multiple boundaries could be hit simultaneously (like top-right corner), the order of checks matters. Always handle the most restrictive boundary first.

3. **Single-pass simulation is often optimal**: For traversal problems, simulating the exact path with careful boundary handling usually gives optimal time and space complexity.

4. **Visualize with small examples**: Drawing out a 3×3 or 3×4 matrix and tracing the path helps identify all edge cases before coding.

Related problems: [Decode the Slanted Ciphertext](/problem/decode-the-slanted-ciphertext)
