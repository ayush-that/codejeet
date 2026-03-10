---
title: "How to Solve Spiral Matrix II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Spiral Matrix II. Medium difficulty, 74.7% acceptance rate. Topics: Array, Matrix, Simulation."
date: "2026-12-20"
category: "dsa-patterns"
tags: ["spiral-matrix-ii", "array", "matrix", "simulation", "medium"]
---

# How to Solve Spiral Matrix II

Given a positive integer `n`, you need to generate an `n x n` matrix filled with numbers from 1 to n² in spiral order, starting from the top-left corner and moving clockwise. This problem is interesting because it tests your ability to simulate traversal patterns in a 2D grid while carefully managing boundaries and direction changes—a common pattern in matrix manipulation problems.

## Visual Walkthrough

Let's trace through `n = 4` to build intuition:

We need to fill a 4×4 matrix with numbers 1 through 16 in this spiral pattern:

```
1   2   3   4
12  13  14  5
11  16  15  6
10  9   8   7
```

Here's how we fill it step by step:

1. **Top row left to right**: Fill row 0, columns 0-3 with 1,2,3,4
2. **Right column top to bottom**: Fill column 3, rows 1-3 with 5,6,7
3. **Bottom row right to left**: Fill row 3, columns 2-0 with 8,9,10
4. **Left column bottom to top**: Fill column 0, rows 2-1 with 11,12
5. **Inner top row left to right**: Fill row 1, columns 1-2 with 13,14
6. **Inner right column top to bottom**: Fill column 2, rows 2-2 with 15
7. **Inner bottom row right to left**: Fill row 2, columns 1-1 with 16

Notice the pattern: we process the matrix layer by layer, moving in four directions (right, down, left, up) until we've filled all cells.

## Brute Force Approach

There isn't really a "brute force" alternative for this problem since any solution must visit each cell exactly once. However, a naive approach might try to simulate the spiral by checking boundaries at each step without a clear systematic method, which often leads to messy code with many edge cases.

The challenge is that without a structured approach, you might:

- Lose track of which direction you're moving
- Forget to update boundaries after completing a row/column
- Handle even vs odd `n` values incorrectly
- Create infinite loops by not properly terminating

Instead of an unstructured simulation, we need a systematic approach that clearly defines boundaries and direction changes.

## Optimized Approach

The key insight is to treat the matrix as a series of concentric layers or shells. For an `n x n` matrix, there are `ceil(n/2)` layers to process. Within each layer, we fill four sides in order:

1. **Top side**: left to right
2. **Right side**: top to bottom
3. **Bottom side**: right to left
4. **Left side**: bottom to top

We maintain four boundary variables:

- `top`: the topmost row of the current layer
- `bottom`: the bottommost row of the current layer
- `left`: the leftmost column of the current layer
- `right`: the rightmost column of the current layer

After filling each side, we adjust the corresponding boundary inward. We continue until `num` reaches n², or equivalently, until `top > bottom` or `left > right`.

This approach is efficient because:

- Each cell is visited exactly once
- Boundary updates are simple and systematic
- The code is clean and easy to understand
- It handles both even and odd `n` correctly

## Optimal Solution

Here's the complete implementation using the boundary simulation approach:

<div class="code-group">

```python
# Time: O(n²) - We visit each cell exactly once
# Space: O(1) - Excluding the output matrix, we use only constant extra space
def generateMatrix(n):
    # Initialize an n x n matrix with zeros
    matrix = [[0] * n for _ in range(n)]

    # Define boundaries of the current layer
    top, bottom = 0, n - 1
    left, right = 0, n - 1

    # Start filling with number 1
    num = 1

    # Continue until we've filled all cells
    while top <= bottom and left <= right:
        # Fill top row from left to right
        for col in range(left, right + 1):
            matrix[top][col] = num
            num += 1
        top += 1  # Move top boundary down

        # Fill right column from top to bottom
        for row in range(top, bottom + 1):
            matrix[row][right] = num
            num += 1
        right -= 1  # Move right boundary left

        # Fill bottom row from right to left (if still within bounds)
        if top <= bottom:
            for col in range(right, left - 1, -1):
                matrix[bottom][col] = num
                num += 1
            bottom -= 1  # Move bottom boundary up

        # Fill left column from bottom to top (if still within bounds)
        if left <= right:
            for row in range(bottom, top - 1, -1):
                matrix[row][left] = num
                num += 1
            left += 1  # Move left boundary right

    return matrix
```

```javascript
// Time: O(n²) - We visit each cell exactly once
// Space: O(1) - Excluding the output matrix, we use only constant extra space
function generateMatrix(n) {
  // Initialize an n x n matrix with zeros
  const matrix = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  // Define boundaries of the current layer
  let top = 0,
    bottom = n - 1;
  let left = 0,
    right = n - 1;

  // Start filling with number 1
  let num = 1;

  // Continue until we've filled all cells
  while (top <= bottom && left <= right) {
    // Fill top row from left to right
    for (let col = left; col <= right; col++) {
      matrix[top][col] = num;
      num++;
    }
    top++; // Move top boundary down

    // Fill right column from top to bottom
    for (let row = top; row <= bottom; row++) {
      matrix[row][right] = num;
      num++;
    }
    right--; // Move right boundary left

    // Fill bottom row from right to left (if still within bounds)
    if (top <= bottom) {
      for (let col = right; col >= left; col--) {
        matrix[bottom][col] = num;
        num++;
      }
      bottom--; // Move bottom boundary up
    }

    // Fill left column from bottom to top (if still within bounds)
    if (left <= right) {
      for (let row = bottom; row >= top; row--) {
        matrix[row][left] = num;
        num++;
      }
      left++; // Move left boundary right
    }
  }

  return matrix;
}
```

```java
// Time: O(n²) - We visit each cell exactly once
// Space: O(1) - Excluding the output matrix, we use only constant extra space
public int[][] generateMatrix(int n) {
    // Initialize an n x n matrix
    int[][] matrix = new int[n][n];

    // Define boundaries of the current layer
    int top = 0, bottom = n - 1;
    int left = 0, right = n - 1;

    // Start filling with number 1
    int num = 1;

    // Continue until we've filled all cells
    while (top <= bottom && left <= right) {
        // Fill top row from left to right
        for (int col = left; col <= right; col++) {
            matrix[top][col] = num;
            num++;
        }
        top++;  // Move top boundary down

        // Fill right column from top to bottom
        for (int row = top; row <= bottom; row++) {
            matrix[row][right] = num;
            num++;
        }
        right--;  // Move right boundary left

        // Fill bottom row from right to left (if still within bounds)
        if (top <= bottom) {
            for (int col = right; col >= left; col--) {
                matrix[bottom][col] = num;
                num++;
            }
            bottom--;  // Move bottom boundary up
        }

        // Fill left column from bottom to top (if still within bounds)
        if (left <= right) {
            for (int row = bottom; row >= top; row--) {
                matrix[row][left] = num;
                num++;
            }
            left++;  // Move left boundary right
        }
    }

    return matrix;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)  
We visit each of the n² cells exactly once to assign a value. Each assignment is O(1), so total time is proportional to the number of cells.

**Space Complexity:** O(1) auxiliary space  
If we exclude the output matrix (which is required by the problem), we only use a constant amount of extra space for the boundary variables and the counter. The output matrix itself takes O(n²) space, but this is not counted as extra space in most interview contexts since it's the required output.

## Common Mistakes

1. **Off-by-one errors in loop boundaries**: Forgetting the `+1` in `range(left, right + 1)` or using `<=` vs `<` incorrectly. Always test with small cases like `n=1` and `n=2`.

2. **Not checking bounds after updating boundaries**: After filling the top row and right column, we must check `if (top <= bottom)` before filling the bottom row, and `if (left <= right)` before filling the left column. Without these checks, we might fill the same row/column twice when processing the innermost layer.

3. **Incorrect direction for inner loops**: When filling bottom row (right to left) or left column (bottom to top), the loop must decrement. Mixing up increment/decrement leads to incorrect spiral order.

4. **Forgetting to handle n=1 case**: With `n=1`, we should just place `1` in the single cell. The boundary approach handles this correctly because the while loop runs once, and the inner loops execute properly.

## When You'll See This Pattern

The spiral traversal pattern appears in various matrix problems:

1. **Spiral Matrix (LeetCode 54)**: The inverse problem—reading a matrix in spiral order instead of writing to it. The same boundary simulation technique applies.

2. **Spiral Matrix III (LeetCode 885)**: A more complex variant where you generate coordinates in spiral order starting from a given point. The directional approach is similar but with expanding radius.

3. **Rotate Image (LeetCode 48)**: While not exactly the same, rotating a matrix often involves processing it layer by layer, similar to the spiral approach.

4. **Diagonal Traverse (LeetCode 498)**: Another matrix traversal pattern, though with different movement rules.

The core technique of maintaining boundaries and processing layers is useful whenever you need to traverse a matrix in a non-trivial pattern.

## Key Takeaways

1. **Boundary simulation is cleaner than coordinate tracking**: Instead of trying to track current position and direction with complex conditionals, define clear boundaries (top, bottom, left, right) and update them systematically.

2. **Matrix problems often have layer-based solutions**: When you need to process the perimeter and move inward, think in terms of layers or shells. This simplifies edge case handling.

3. **Always test with small cases**: Test with `n=1`, `n=2`, `n=3`, and `n=4` to catch off-by-one errors. These small cases are quick to verify manually and reveal most common bugs.

Related problems: [Spiral Matrix](/problem/spiral-matrix), [Spiral Matrix III](/problem/spiral-matrix-iii), [Spiral Matrix IV](/problem/spiral-matrix-iv)
