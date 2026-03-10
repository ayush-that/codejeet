---
title: "How to Solve Spiral Matrix — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Spiral Matrix. Medium difficulty, 56.2% acceptance rate. Topics: Array, Matrix, Simulation."
date: "2026-05-09"
category: "dsa-patterns"
tags: ["spiral-matrix", "array", "matrix", "simulation", "medium"]
---

# How to Solve Spiral Matrix

The Spiral Matrix problem asks us to traverse a 2D matrix in clockwise spiral order, returning all elements in sequence. What makes this problem interesting is that it requires careful boundary management — we need to traverse the matrix layer by layer, constantly adjusting our boundaries as we move right, down, left, and up. The challenge lies in handling edge cases correctly without missing elements or visiting them twice.

## Visual Walkthrough

Let's trace through a 3×4 matrix to build intuition:

```
Input: [[1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12]]
```

We'll traverse this matrix in clockwise spiral order:

1. **Top row, left to right**: 1, 2, 3, 4
2. **Right column, top to bottom**: 8, 12 (skip 4 since we already visited it)
3. **Bottom row, right to left**: 11, 10, 9 (skip 12)
4. **Left column, bottom to top**: 5 (skip 9 and 1)
5. **Inner layer, top row**: 6, 7
6. **Inner layer, right column**: (none, since we've reached the boundary)
7. **Inner layer, bottom row**: (none)
8. **Inner layer, left column**: (none)

Final spiral order: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]

Notice how after each complete cycle (right→down→left→up), our boundaries shrink: the top moves down, right moves left, bottom moves up, and left moves right. This is the key insight for our solution.

## Brute Force Approach

A naive approach might try to simulate the spiral movement with complex conditional logic, checking visited cells to avoid duplicates. While this could work, it would require O(m×n) extra space to track visited cells and complex direction-changing logic that's prone to errors.

Here's what that might look like conceptually:

1. Start at (0, 0) moving right
2. At each step, check if the next cell is within bounds AND not visited
3. If it is, move there and add to result
4. If not, rotate direction clockwise (right→down→left→up)
5. Repeat until all cells are visited

The problem with this approach is the complexity of boundary checking and direction management. We need to constantly check if we're about to go out of bounds or hit a visited cell, which leads to messy code and subtle bugs.

## Optimized Approach

The optimal approach uses **boundary tracking** instead of visited markers. We maintain four variables representing our current boundaries:

- `top`: the topmost row we haven't processed
- `bottom`: the bottommost row we haven't processed
- `left`: the leftmost column we haven't processed
- `right`: the rightmost column we haven't processed

We process the matrix in layers, following this pattern:

1. Traverse from `left` to `right` along the `top` row, then increment `top`
2. Traverse from `top` to `bottom` along the `right` column, then decrement `right`
3. If `top ≤ bottom`, traverse from `right` to `left` along the `bottom` row, then decrement `bottom`
4. If `left ≤ right`, traverse from `bottom` to `top` along the `left` column, then increment `left`

We repeat until `top > bottom` or `left > right`, which means we've processed all layers.

The key insight is that after processing each edge, we adjust the corresponding boundary inward, effectively shrinking the remaining matrix. The conditional checks in steps 3 and 4 prevent us from traversing edges that no longer exist (important for single-row or single-column matrices).

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(m × n) - we visit each element exactly once
# Space: O(1) - excluding the output list, we use only constant extra space
def spiralOrder(matrix):
    # Handle empty matrix edge case
    if not matrix or not matrix[0]:
        return []

    # Initialize boundaries
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    result = []

    # Continue while there are still elements to process
    while top <= bottom and left <= right:
        # Traverse from left to right along the top row
        for col in range(left, right + 1):
            result.append(matrix[top][col])
        top += 1  # Move top boundary down

        # Traverse from top to bottom along the right column
        for row in range(top, bottom + 1):
            result.append(matrix[row][right])
        right -= 1  # Move right boundary left

        # Only traverse from right to left if we still have rows
        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])
            bottom -= 1  # Move bottom boundary up

        # Only traverse from bottom to top if we still have columns
        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])
            left += 1  # Move left boundary right

    return result
```

```javascript
// Time: O(m × n) - we visit each element exactly once
// Space: O(1) - excluding the output array, we use only constant extra space
function spiralOrder(matrix) {
  // Handle empty matrix edge case
  if (!matrix.length || !matrix[0].length) {
    return [];
  }

  // Initialize boundaries
  let top = 0,
    bottom = matrix.length - 1;
  let left = 0,
    right = matrix[0].length - 1;
  const result = [];

  // Continue while there are still elements to process
  while (top <= bottom && left <= right) {
    // Traverse from left to right along the top row
    for (let col = left; col <= right; col++) {
      result.push(matrix[top][col]);
    }
    top++; // Move top boundary down

    // Traverse from top to bottom along the right column
    for (let row = top; row <= bottom; row++) {
      result.push(matrix[row][right]);
    }
    right--; // Move right boundary left

    // Only traverse from right to left if we still have rows
    if (top <= bottom) {
      for (let col = right; col >= left; col--) {
        result.push(matrix[bottom][col]);
      }
      bottom--; // Move bottom boundary up
    }

    // Only traverse from bottom to top if we still have columns
    if (left <= right) {
      for (let row = bottom; row >= top; row--) {
        result.push(matrix[row][left]);
      }
      left++; // Move left boundary right
    }
  }

  return result;
}
```

```java
// Time: O(m × n) - we visit each element exactly once
// Space: O(1) - excluding the output list, we use only constant extra space
import java.util.ArrayList;
import java.util.List;

public List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> result = new ArrayList<>();

    // Handle empty matrix edge case
    if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
        return result;
    }

    // Initialize boundaries
    int top = 0, bottom = matrix.length - 1;
    int left = 0, right = matrix[0].length - 1;

    // Continue while there are still elements to process
    while (top <= bottom && left <= right) {
        // Traverse from left to right along the top row
        for (int col = left; col <= right; col++) {
            result.add(matrix[top][col]);
        }
        top++;  // Move top boundary down

        // Traverse from top to bottom along the right column
        for (int row = top; row <= bottom; row++) {
            result.add(matrix[row][right]);
        }
        right--;  // Move right boundary left

        // Only traverse from right to left if we still have rows
        if (top <= bottom) {
            for (int col = right; col >= left; col--) {
                result.add(matrix[bottom][col]);
            }
            bottom--;  // Move bottom boundary up
        }

        // Only traverse from bottom to top if we still have columns
        if (left <= right) {
            for (int row = bottom; row >= top; row--) {
                result.add(matrix[row][left]);
            }
            left++;  // Move left boundary right
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**  
We visit each element of the matrix exactly once. The while loop continues until we've processed all elements, and each iteration processes at least one row or column.

**Space Complexity: O(1)**  
If we don't count the output list (which is required by the problem), we use only constant extra space for the boundary variables. The algorithm modifies the matrix in-place conceptually (by adjusting boundaries) but doesn't actually modify the input matrix.

## Common Mistakes

1. **Forgetting to check `top ≤ bottom` and `left ≤ right` before the last two traversals**: This is crucial for handling single-row or single-column matrices. Without these checks, you'll process the same row or column twice.

2. **Off-by-one errors in loop ranges**: Common mistakes include using `range(left, right)` instead of `range(left, right + 1)` or forgetting the `-1` in reverse loops. Always test with a 1×1 matrix to catch these.

3. **Incorrect boundary updates**: Each boundary should be updated immediately after processing its corresponding edge. If you update boundaries at the wrong time, you might skip elements or process them twice.

4. **Not handling empty matrix**: Always check if the matrix is empty or has zero rows/columns at the beginning. This is a common interview requirement.

## When You'll See This Pattern

The boundary tracking pattern appears in various matrix traversal problems:

1. **Spiral Matrix II (Medium)**: Generate a square matrix with numbers in spiral order. Uses the same boundary approach but in reverse.

2. **Rotate Image (Medium)**: Rotate a matrix 90 degrees clockwise. While the algorithm differs, it requires similar careful index manipulation and layer-by-layer processing.

3. **Diagonal Traverse (Medium)**: Traverse a matrix diagonally. Though the movement pattern differs, it requires similar boundary awareness.

4. **Set Matrix Zeroes (Medium)**: While not about traversal, it requires careful consideration of matrix boundaries and often uses the first row/column as markers.

## Key Takeaways

1. **Boundary tracking is cleaner than visited markers**: For layer-by-layer matrix processing, maintaining and updating boundaries is more efficient and less error-prone than tracking visited cells.

2. **Always handle edge cases first**: Single-row, single-column, and empty matrices will break naive implementations. Test these cases early.

3. **The pattern generalizes**: Once you understand the boundary approach, you can adapt it to other spiral problems (like generating a spiral matrix) or other layer-by-layer matrix operations.

Related problems: [Spiral Matrix II](/problem/spiral-matrix-ii), [Spiral Matrix III](/problem/spiral-matrix-iii), [Spiral Matrix IV](/problem/spiral-matrix-iv)
