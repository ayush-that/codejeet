---
title: "How to Solve Rotate Image — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Rotate Image. Medium difficulty, 79.4% acceptance rate. Topics: Array, Math, Matrix."
date: "2026-04-15"
category: "dsa-patterns"
tags: ["rotate-image", "array", "math", "matrix", "medium"]
---

# How to Solve Rotate Image

You're given an `n x n` matrix representing an image, and you need to rotate it 90 degrees clockwise **in-place** without allocating another 2D matrix. The challenge lies in performing this rotation efficiently while carefully managing element swaps to avoid overwriting values you'll need later.

## Visual Walkthrough

Let's trace through a 3x3 example to build intuition:

```
Original matrix:
[1, 2, 3]
[4, 5, 6]
[7, 8, 9]
```

After 90° clockwise rotation:

```
[7, 4, 1]
[8, 5, 2]
[9, 6, 3]
```

Notice the pattern:

- Top row `[1,2,3]` becomes the right column `[3,6,9]` (but reversed order)
- Right column `[3,6,9]` becomes the bottom row `[9,8,7]` (reversed)
- Bottom row `[7,8,9]` becomes the left column `[7,4,1]` (reversed)
- Left column `[1,4,7]` becomes the top row `[1,2,3]` (reversed)

The key insight: each element moves to a new position based on a consistent transformation rule. If we try to swap elements directly, we'll overwrite values we need later unless we're careful about the order of operations.

## Brute Force Approach

The most straightforward approach would be to create a new matrix of the same size, copy elements to their rotated positions, then copy back to the original matrix. However, the problem explicitly forbids allocating another 2D matrix and requires in-place modification.

A naive in-place attempt might try to rotate elements one by one, but without careful planning, you'll quickly overwrite elements you need. For example, if you start with the top-left corner `(0,0)` and try to move it to `(0,2)` (in a 3x3 matrix), you've lost the original value at `(0,2)` that needs to move elsewhere.

This demonstrates why we need a systematic approach: we must either use a temporary variable to hold one element while we perform a chain of swaps, or find a mathematical transformation that allows us to rotate in groups.

## Optimized Approach

The optimal solution uses a two-step process:

1. **Transpose the matrix** (swap elements across the main diagonal)
2. **Reverse each row**

Let's see why this works with our 3x3 example:

**Step 1 - Transpose** (swap `matrix[i][j]` with `matrix[j][i]`):

```
[1, 4, 7]
[2, 5, 8]
[3, 6, 9]
```

**Step 2 - Reverse each row**:

```
[7, 4, 1]
[8, 5, 2]
[9, 6, 3]
```

That's exactly our desired 90° clockwise rotation!

**Why this works mathematically:**

- A 90° clockwise rotation is equivalent to transposing followed by horizontal reflection (reversing each row)
- Alternatively, it's also equivalent to vertical reflection followed by transposing

The transpose operation flips the matrix over its main diagonal, and reversing each row completes the rotation. This approach requires only O(1) extra space (for temporary variables during swaps) and runs in O(n²) time, which is optimal since we must touch every element at least once.

## Optimal Solution

Here's the complete implementation using the transpose-and-reverse approach:

<div class="code-group">

```python
# Time: O(n²) - we visit each cell once during transpose, once during reversal
# Space: O(1) - we modify the matrix in-place using only constant extra space
def rotate(matrix):
    """
    Rotate the matrix 90 degrees clockwise in-place.

    Approach:
    1. Transpose the matrix (swap elements across the main diagonal)
    2. Reverse each row to complete the 90-degree clockwise rotation
    """
    n = len(matrix)

    # Step 1: Transpose the matrix
    # We only need to iterate through the upper triangle (i < j)
    # to avoid swapping elements twice
    for i in range(n):
        for j in range(i + 1, n):
            # Swap matrix[i][j] with matrix[j][i]
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

    # Step 2: Reverse each row
    for i in range(n):
        # Use two pointers: left starts at beginning, right at end of row
        left, right = 0, n - 1
        while left < right:
            # Swap elements symmetrically from both ends
            matrix[i][left], matrix[i][right] = matrix[i][right], matrix[i][left]
            left += 1
            right -= 1

# Alternative approach using Python's built-in reverse for cleaner code:
def rotate_alternative(matrix):
    n = len(matrix)

    # Transpose
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

    # Reverse each row using built-in reverse
    for i in range(n):
        matrix[i].reverse()
```

```javascript
// Time: O(n²) - we visit each cell once during transpose, once during reversal
// Space: O(1) - we modify the matrix in-place using only constant extra space
function rotate(matrix) {
  /**
   * Rotate the matrix 90 degrees clockwise in-place.
   *
   * Approach:
   * 1. Transpose the matrix (swap elements across the main diagonal)
   * 2. Reverse each row to complete the 90-degree clockwise rotation
   */
  const n = matrix.length;

  // Step 1: Transpose the matrix
  // We only need to iterate through the upper triangle (i < j)
  // to avoid swapping elements twice
  for (let i = 0; i < n; i++) {
    // Start j from i+1 to only process upper triangle
    for (let j = i + 1; j < n; j++) {
      // Swap matrix[i][j] with matrix[j][i]
      const temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }

  // Step 2: Reverse each row
  for (let i = 0; i < n; i++) {
    // Use two pointers: left starts at beginning, right at end of row
    let left = 0;
    let right = n - 1;

    while (left < right) {
      // Swap elements symmetrically from both ends
      const temp = matrix[i][left];
      matrix[i][left] = matrix[i][right];
      matrix[i][right] = temp;

      left++;
      right--;
    }
  }
}

// Alternative approach using built-in reverse method:
function rotateAlternative(matrix) {
  const n = matrix.length;

  // Transpose
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }

  // Reverse each row using built-in reverse
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
}
```

```java
// Time: O(n²) - we visit each cell once during transpose, once during reversal
// Space: O(1) - we modify the matrix in-place using only constant extra space
class Solution {
    public void rotate(int[][] matrix) {
        /**
         * Rotate the matrix 90 degrees clockwise in-place.
         *
         * Approach:
         * 1. Transpose the matrix (swap elements across the main diagonal)
         * 2. Reverse each row to complete the 90-degree clockwise rotation
         */
        int n = matrix.length;

        // Step 1: Transpose the matrix
        // We only need to iterate through the upper triangle (i < j)
        // to avoid swapping elements twice
        for (int i = 0; i < n; i++) {
            // Start j from i+1 to only process upper triangle
            for (int j = i + 1; j < n; j++) {
                // Swap matrix[i][j] with matrix[j][i]
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }

        // Step 2: Reverse each row
        for (int i = 0; i < n; i++) {
            // Use two pointers: left starts at beginning, right at end of row
            int left = 0;
            int right = n - 1;

            while (left < right) {
                // Swap elements symmetrically from both ends
                int temp = matrix[i][left];
                matrix[i][left] = matrix[i][right];
                matrix[i][right] = temp;

                left++;
                right--;
            }
        }
    }
}

// Alternative approach using a helper method for reversal:
class SolutionAlternative {
    public void rotate(int[][] matrix) {
        int n = matrix.length;

        // Transpose
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }

        // Reverse each row
        for (int i = 0; i < n; i++) {
            reverseRow(matrix[i]);
        }
    }

    private void reverseRow(int[] row) {
        int left = 0, right = row.length - 1;
        while (left < right) {
            int temp = row[left];
            row[left] = row[right];
            row[right] = temp;
            left++;
            right--;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Transpose step: We iterate through approximately half of the n² elements (the upper triangle), which is O(n²/2) = O(n²)
- Reverse step: For each of n rows, we perform n/2 swaps, which is O(n × n/2) = O(n²)
- Total: O(n²) + O(n²) = O(n²)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for temporary variables during swaps
- The matrix is modified in-place as required

This is optimal because we must at least look at each of the n² elements once to know where to move them.

## Common Mistakes

1. **Swapping elements twice during transpose**: If you iterate through all i and j from 0 to n-1, you'll swap each pair twice, ending up back where you started. Always start the inner loop from `i+1` to only process the upper triangle.

2. **Incorrect reversal boundaries**: When reversing rows, make sure your two-pointer approach correctly handles both even and odd row lengths. The condition should be `left < right`, not `left <= right`, to avoid swapping the middle element with itself when n is odd.

3. **Confusing clockwise with counterclockwise rotation**: For 90° counterclockwise rotation, you would transpose first, then reverse each **column** (not row), or reverse each row first, then transpose.

4. **Assuming rectangular matrices**: This problem specifically states n x n (square matrix). The transpose-and-reverse approach only works cleanly for square matrices. For rectangular matrices, you'd need a different approach.

## When You'll See This Pattern

The transpose-and-reverse pattern appears in various matrix manipulation problems:

1. **Determine Whether Matrix Can Be Obtained By Rotation (LeetCode 1886)**: This problem directly extends the rotate image concept by checking if one matrix can be rotated to match another.

2. **Spiral Matrix (LeetCode 54)**: While not identical, both problems require careful tracking of matrix boundaries and systematic traversal.

3. **Set Matrix Zeroes (LeetCode 73)**: Another in-place matrix modification problem that requires careful planning to avoid overwriting information you need later.

4. **Game of Life (LeetCode 289)**: Uses a similar concept of in-place modification with encoded states to avoid extra space.

The core technique of using mathematical transformations (transpose, reverse) instead of element-by-element rotation is a valuable pattern for any matrix rotation problem.

## Key Takeaways

1. **90° rotation = transpose + reverse rows**: This is the most important insight. Memorize that clockwise rotation can be decomposed into these two simpler operations.

2. **In-place operations require careful swap ordering**: When modifying data structures in-place, always think about whether you're overwriting data you'll need later. Using intermediate transformations (like transpose) can simplify this.

3. **Visualize with small examples**: Before coding, work through a 2x2 or 3x3 example on paper. This helps you discover patterns and catch boundary cases.

4. **Square matrices have special properties**: Many matrix problems become simpler when you know the matrix is square (n x n). The main diagonal and symmetry properties can be exploited.

Related problems: [Determine Whether Matrix Can Be Obtained By Rotation](/problem/determine-whether-matrix-can-be-obtained-by-rotation)
