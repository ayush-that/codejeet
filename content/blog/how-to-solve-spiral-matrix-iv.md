---
title: "How to Solve Spiral Matrix IV — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Spiral Matrix IV. Medium difficulty, 82.3% acceptance rate. Topics: Array, Linked List, Matrix, Simulation."
date: "2026-04-01"
category: "dsa-patterns"
tags: ["spiral-matrix-iv", "array", "linked-list", "matrix", "medium"]
---

# How to Solve Spiral Matrix IV

This problem asks you to fill an `m x n` matrix in clockwise spiral order using values from a linked list, starting from the top-left corner. What makes this interesting is that it combines linked list traversal with matrix simulation—you need to carefully manage boundaries while consuming nodes from the linked list. Unlike previous spiral matrix problems where you're reading from or generating values, here you're pulling values from an external data structure.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have:

- `m = 3`, `n = 4` (3 rows, 4 columns)
- Linked list: `[3, 0, 2, 6, 8, 1, 7, 9, 4, 2, 5, 5]`

We need to fill a 3×4 matrix in spiral order:

1. **Top row left to right**: Fill (0,0)=3, (0,1)=0, (0,2)=2, (0,3)=6
2. **Right column top to bottom**: Fill (1,3)=8, (2,3)=1
3. **Bottom row right to left**: Fill (2,2)=7, (2,1)=9, (2,0)=4
4. **Left column bottom to top**: Fill (1,0)=2
5. **Inner top row left to right**: Fill (1,1)=5, (1,2)=5

The matrix becomes:

```
[3, 0, 2, 6]
[2, 5, 5, 8]
[4, 9, 7, 1]
```

Notice how we need to track four boundaries: `top`, `bottom`, `left`, and `right`. After completing each direction, we adjust the corresponding boundary inward. We continue until either the linked list is exhausted or the matrix is completely filled.

## Brute Force Approach

There's no true "brute force" alternative for this problem since any solution must traverse the matrix in spiral order. However, a naive approach might try to fill the matrix row-by-row or column-by-column, which wouldn't satisfy the spiral requirement. Another suboptimal approach might involve creating an array from the linked list first, then filling the matrix—this uses extra O(m×n) space unnecessarily.

The key insight is that we must simulate the spiral traversal directly while consuming nodes from the linked list. Any attempt to avoid the boundary management will fail to produce the correct spiral pattern.

## Optimized Approach

The optimal approach uses **boundary simulation** with four pointers:

- `top`: current top row index
- `bottom`: current bottom row index
- `left`: current left column index
- `right`: current right column index

We iterate in four directions repeatedly:

1. **Left to right** across the top row, then increment `top`
2. **Top to bottom** down the right column, then decrement `right`
3. **Right to left** across the bottom row, then decrement `bottom`
4. **Bottom to top** up the left column, then increment `left`

We continue until either:

- The linked list is exhausted (all values placed)
- The boundaries cross (`top > bottom` or `left > right`)

The trick is checking the linked list pointer after each insertion to see if we've run out of values. If we do, we break early—remaining cells stay at their initialized value (typically 0).

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(m * n) - we visit each cell at most once
# Space: O(1) - excluding the output matrix, we use only constant extra space
class Solution:
    def spiralMatrix(self, m: int, n: int, head: Optional[ListNode]) -> List[List[int]]:
        # Initialize matrix with -1 (or any value to indicate unfilled cells)
        matrix = [[-1] * n for _ in range(m)]

        # Define boundaries for spiral traversal
        top, bottom = 0, m - 1
        left, right = 0, n - 1

        # Start with the head of the linked list
        current = head

        # Continue while we have cells to fill AND nodes in the list
        while top <= bottom and left <= right and current:
            # Fill top row from left to right
            for col in range(left, right + 1):
                if not current:
                    break
                matrix[top][col] = current.val
                current = current.next
            top += 1  # Move top boundary down

            # Fill right column from top to bottom
            for row in range(top, bottom + 1):
                if not current:
                    break
                matrix[row][right] = current.val
                current = current.next
            right -= 1  # Move right boundary left

            # Fill bottom row from right to left (if still within bounds)
            if top <= bottom:
                for col in range(right, left - 1, -1):
                    if not current:
                        break
                    matrix[bottom][col] = current.val
                    current = current.next
                bottom -= 1  # Move bottom boundary up

            # Fill left column from bottom to top (if still within bounds)
            if left <= right:
                for row in range(bottom, top - 1, -1):
                    if not current:
                        break
                    matrix[row][left] = current.val
                    current = current.next
                left += 1  # Move left boundary right

        # Replace any remaining -1 values with -1 (or keep as -1 per problem statement)
        # The problem says to use -1 for unfilled cells
        return matrix
```

```javascript
// Time: O(m * n) - we visit each cell at most once
// Space: O(1) - excluding the output matrix, we use only constant extra space
var spiralMatrix = function (m, n, head) {
  // Initialize matrix with -1 for unfilled cells
  const matrix = Array(m)
    .fill()
    .map(() => Array(n).fill(-1));

  // Define boundaries for spiral traversal
  let top = 0,
    bottom = m - 1;
  let left = 0,
    right = n - 1;

  let current = head;

  // Continue while we have cells to fill AND nodes in the list
  while (top <= bottom && left <= right && current) {
    // Fill top row from left to right
    for (let col = left; col <= right && current; col++) {
      matrix[top][col] = current.val;
      current = current.next;
    }
    top++; // Move top boundary down

    // Fill right column from top to bottom
    for (let row = top; row <= bottom && current; row++) {
      matrix[row][right] = current.val;
      current = current.next;
    }
    right--; // Move right boundary left

    // Fill bottom row from right to left (if still within bounds)
    if (top <= bottom) {
      for (let col = right; col >= left && current; col--) {
        matrix[bottom][col] = current.val;
        current = current.next;
      }
      bottom--; // Move bottom boundary up
    }

    // Fill left column from bottom to top (if still within bounds)
    if (left <= right) {
      for (let row = bottom; row >= top && current; row--) {
        matrix[row][left] = current.val;
        current = current.next;
      }
      left++; // Move left boundary right
    }
  }

  return matrix;
};
```

```java
// Time: O(m * n) - we visit each cell at most once
// Space: O(1) - excluding the output matrix, we use only constant extra space
class Solution {
    public int[][] spiralMatrix(int m, int n, ListNode head) {
        // Initialize matrix with -1 for unfilled cells
        int[][] matrix = new int[m][n];
        for (int i = 0; i < m; i++) {
            Arrays.fill(matrix[i], -1);
        }

        // Define boundaries for spiral traversal
        int top = 0, bottom = m - 1;
        int left = 0, right = n - 1;

        ListNode current = head;

        // Continue while we have cells to fill AND nodes in the list
        while (top <= bottom && left <= right && current != null) {
            // Fill top row from left to right
            for (int col = left; col <= right && current != null; col++) {
                matrix[top][col] = current.val;
                current = current.next;
            }
            top++;  // Move top boundary down

            // Fill right column from top to bottom
            for (int row = top; row <= bottom && current != null; row++) {
                matrix[row][right] = current.val;
                current = current.next;
            }
            right--;  // Move right boundary left

            // Fill bottom row from right to left (if still within bounds)
            if (top <= bottom) {
                for (int col = right; col >= left && current != null; col--) {
                    matrix[bottom][col] = current.val;
                    current = current.next;
                }
                bottom--;  // Move bottom boundary up
            }

            // Fill left column from bottom to top (if still within bounds)
            if (left <= right) {
                for (int row = bottom; row >= top && current != null; row--) {
                    matrix[row][left] = current.val;
                    current = current.next;
                }
                left++;  // Move left boundary right
            }
        }

        return matrix;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We iterate through each cell of the matrix at most once
- Each cell assignment takes constant time
- Linked list traversal also takes O(m × n) time in the worst case when the list has enough nodes

**Space Complexity: O(1) auxiliary space**

- We only use a few integer variables for boundaries and a pointer to the current node
- The output matrix is not counted in auxiliary space complexity (it's required by the problem)
- If we counted the output matrix, it would be O(m × n)

## Common Mistakes

1. **Forgetting to check if the linked list is exhausted mid-traversal**: After each insertion, you must check if `current` has become `null`. If you don't, you'll get a null pointer error when trying to access `current.val` or `current.next`.

2. **Incorrect boundary updates**: A common error is updating boundaries in the wrong order or forgetting the conditional checks before the bottom and left traversals. Remember:
   - After top row: `top++`
   - After right column: `right--`
   - Before bottom row: check `if (top <= bottom)`
   - Before left column: check `if (left <= right)`

3. **Off-by-one errors in loop ranges**: When filling the bottom row right-to-left, the range should be `right` down to `left` (inclusive). Similarly for the left column bottom-to-top. Using exclusive ranges will skip cells.

4. **Not handling the case where linked list has fewer nodes than matrix cells**: The problem states to use `-1` for unfilled cells. You must initialize the matrix with `-1` and break early when the list is exhausted.

## When You'll See This Pattern

The spiral traversal pattern appears in several matrix problems:

1. **Spiral Matrix (LeetCode 54)**: Read a matrix in spiral order (the inverse of this problem)
2. **Spiral Matrix II (LeetCode 59)**: Generate a matrix with numbers in spiral order
3. **Spiral Matrix III (LeetCode 885)**: Generate coordinates in spiral order from a starting point
4. **Rotate Image (LeetCode 48)**: While not exactly spiral, it uses similar boundary manipulation for matrix layers

These problems all share the core technique of managing four boundaries (`top`, `bottom`, `left`, `right`) and iterating in four directions. Once you master this pattern, you can solve any variation.

## Key Takeaways

1. **Spiral traversal uses four boundary pointers**: `top`, `bottom`, `left`, `right`. Update them after completing each direction's traversal.

2. **Always check bounds before inner traversals**: After the first two directions (top row and right column), check if `top <= bottom` before the bottom row traversal, and `left <= right` before the left column traversal.

3. **Combine traversal with external data sources carefully**: When pulling values from a linked list (or any iterator), check for exhaustion after each insertion and break early if needed.

Related problems: [Spiral Matrix](/problem/spiral-matrix), [Spiral Matrix II](/problem/spiral-matrix-ii), [Spiral Matrix III](/problem/spiral-matrix-iii)
