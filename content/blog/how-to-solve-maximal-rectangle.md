---
title: "How to Solve Maximal Rectangle — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximal Rectangle. Hard difficulty, 58.1% acceptance rate. Topics: Array, Dynamic Programming, Stack, Matrix, Monotonic Stack."
date: "2026-12-25"
category: "dsa-patterns"
tags: ["maximal-rectangle", "array", "dynamic-programming", "stack", "hard"]
---

# How to Solve Maximal Rectangle

This problem asks us to find the largest rectangle containing only 1's in a binary matrix. What makes this problem challenging is that rectangles can have arbitrary dimensions - they're not limited to squares like in the "Maximal Square" problem. The rectangle must be axis-aligned and contain only 1's, but finding the maximum area rectangle efficiently requires clever reduction to a subproblem we already know how to solve.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Matrix:
1 0 1 0 0
1 0 1 1 1
1 1 1 1 1
1 0 0 1 0
```

The key insight is that we can treat each row as the base of a histogram. For each cell in a row, we calculate the height of consecutive 1's above it (including the current row). Let's build these histograms row by row:

**Row 0:** `[1, 0, 1, 0, 0]` (directly from the matrix)

**Row 1:** For each column, if the current cell is 1, add 1 to the height from the previous row:

- Column 0: 1 + 1 = 2
- Column 1: 0 (cell is 0, so reset to 0)
- Column 2: 1 + 1 = 2
- Column 3: 1 + 0 = 1
- Column 4: 1 + 0 = 1
  Result: `[2, 0, 2, 1, 1]`

**Row 2:** Continue the same process:

- Column 0: 1 + 2 = 3
- Column 1: 1 + 0 = 1 (cell is 1, but previous was 0)
- Column 2: 1 + 2 = 3
- Column 3: 1 + 1 = 2
- Column 4: 1 + 1 = 2
  Result: `[3, 1, 3, 2, 2]`

**Row 3:**

- Column 0: 1 + 3 = 4
- Column 1: 0 (cell is 0, reset)
- Column 2: 0 (cell is 0, reset)
- Column 3: 1 + 2 = 3
- Column 4: 0 (cell is 0, reset)
  Result: `[4, 0, 0, 3, 0]`

Now, for each histogram, we can find the largest rectangle area using the "Largest Rectangle in Histogram" algorithm (which uses a monotonic stack). The maximum area across all histograms gives us our answer.

## Brute Force Approach

A naive approach would be to check every possible rectangle in the matrix. For each cell `(i, j)` as the top-left corner, we could try all possible bottom-right corners `(k, l)` where `k ≥ i` and `l ≥ j`. For each rectangle, we would need to check if all cells contain 1's.

The brute force algorithm would look like:

1. For every cell `(i, j)` as top-left corner
2. For every cell `(k, l)` as bottom-right corner (where `k ≥ i`, `l ≥ j`)
3. Check if all cells in this rectangle are 1's
4. Track the maximum area found

This approach has O((m×n)³) time complexity for an m×n matrix, which is far too slow for typical constraints. Even with some optimizations (like stopping when we encounter a 0), it's still O((m×n)²) in the worst case.

## Optimized Approach

The key insight is that we can **reduce this 2D problem to multiple 1D problems** that we already know how to solve efficiently. Here's the step-by-step reasoning:

1. **Histogram Transformation**: For each row, we can compute the "height" of bars in a histogram. The height at column `j` for row `i` is the number of consecutive 1's from the current row upward (including the current row).

2. **Problem Reduction**: Once we have a histogram for a given row, finding the largest rectangle with that row as the base is exactly the "Largest Rectangle in Histogram" problem.

3. **Monotonic Stack Solution**: For each histogram, we can find the maximum rectangle area in O(n) time using a monotonic increasing stack. The stack helps us efficiently find the left and right boundaries for each bar.

4. **Iterate Through Rows**: We compute the histogram for each row (updating heights as we go) and apply the histogram algorithm to find the maximum rectangle area for that base row.

This approach transforms an O((m×n)²) brute force into an O(m×n) solution, where m is the number of rows and n is the number of columns.

## Optimal Solution

Here's the complete solution using the histogram reduction approach with monotonic stack:

<div class="code-group">

```python
# Time: O(m×n) where m = rows, n = cols
# Space: O(n) for the heights array and stack
def maximalRectangle(matrix):
    if not matrix or not matrix[0]:
        return 0

    rows, cols = len(matrix), len(matrix[0])
    # heights array stores the histogram heights for current row
    heights = [0] * cols
    max_area = 0

    for i in range(rows):
        # Update heights for current row
        for j in range(cols):
            # If current cell is '1', add 1 to height from previous row
            # If current cell is '0', reset height to 0
            if matrix[i][j] == '1':
                heights[j] += 1
            else:
                heights[j] = 0

        # Find largest rectangle in current histogram
        max_area = max(max_area, largestRectangleArea(heights))

    return max_area

def largestRectangleArea(heights):
    """Helper function to find largest rectangle in histogram"""
    stack = []  # monotonic increasing stack storing indices
    max_area = 0
    n = len(heights)

    for i in range(n + 1):
        # Use i == n to trigger processing of remaining bars
        # When i == n, use height 0 to force all bars out of stack
        current_height = heights[i] if i < n else 0

        # While stack is not empty and current height is less than stack top
        while stack and current_height < heights[stack[-1]]:
            # Pop the top bar from stack
            height = heights[stack.pop()]
            # Width extends from the new top of stack to current index
            # If stack is empty, width is from beginning to current index
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)

        # Push current index to stack
        stack.append(i)

    return max_area
```

```javascript
// Time: O(m×n) where m = rows, n = cols
// Space: O(n) for the heights array and stack
function maximalRectangle(matrix) {
  if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
    return 0;
  }

  const rows = matrix.length;
  const cols = matrix[0].length;
  // heights array stores the histogram heights for current row
  const heights = new Array(cols).fill(0);
  let maxArea = 0;

  for (let i = 0; i < rows; i++) {
    // Update heights for current row
    for (let j = 0; j < cols; j++) {
      // If current cell is '1', add 1 to height from previous row
      // If current cell is '0', reset height to 0
      if (matrix[i][j] === "1") {
        heights[j] += 1;
      } else {
        heights[j] = 0;
      }
    }

    // Find largest rectangle in current histogram
    maxArea = Math.max(maxArea, largestRectangleArea(heights));
  }

  return maxArea;
}

function largestRectangleArea(heights) {
  /** Helper function to find largest rectangle in histogram */
  const stack = []; // monotonic increasing stack storing indices
  let maxArea = 0;
  const n = heights.length;

  for (let i = 0; i <= n; i++) {
    // Use i === n to trigger processing of remaining bars
    // When i === n, use height 0 to force all bars out of stack
    const currentHeight = i < n ? heights[i] : 0;

    // While stack is not empty and current height is less than stack top
    while (stack.length > 0 && currentHeight < heights[stack[stack.length - 1]]) {
      // Pop the top bar from stack
      const height = heights[stack.pop()];
      // Width extends from the new top of stack to current index
      // If stack is empty, width is from beginning to current index
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, height * width);
    }

    // Push current index to stack
    stack.push(i);
  }

  return maxArea;
}
```

```java
// Time: O(m×n) where m = rows, n = cols
// Space: O(n) for the heights array and stack
class Solution {
    public int maximalRectangle(char[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return 0;
        }

        int rows = matrix.length;
        int cols = matrix[0].length;
        // heights array stores the histogram heights for current row
        int[] heights = new int[cols];
        int maxArea = 0;

        for (int i = 0; i < rows; i++) {
            // Update heights for current row
            for (int j = 0; j < cols; j++) {
                // If current cell is '1', add 1 to height from previous row
                // If current cell is '0', reset height to 0
                if (matrix[i][j] == '1') {
                    heights[j] += 1;
                } else {
                    heights[j] = 0;
                }
            }

            // Find largest rectangle in current histogram
            maxArea = Math.max(maxArea, largestRectangleArea(heights));
        }

        return maxArea;
    }

    private int largestRectangleArea(int[] heights) {
        /** Helper function to find largest rectangle in histogram */
        Stack<Integer> stack = new Stack<>();  // monotonic increasing stack storing indices
        int maxArea = 0;
        int n = heights.length;

        for (int i = 0; i <= n; i++) {
            // Use i == n to trigger processing of remaining bars
            // When i == n, use height 0 to force all bars out of stack
            int currentHeight = (i < n) ? heights[i] : 0;

            // While stack is not empty and current height is less than stack top
            while (!stack.isEmpty() && currentHeight < heights[stack.peek()]) {
                // Pop the top bar from stack
                int height = heights[stack.pop()];
                // Width extends from the new top of stack to current index
                // If stack is empty, width is from beginning to current index
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }

            // Push current index to stack
            stack.push(i);
        }

        return maxArea;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n)**

- We iterate through each of the m rows
- For each row, we update the heights array in O(n) time
- For each row, we run the histogram algorithm which takes O(n) time using the monotonic stack
- Total: O(m × (n + n)) = O(2mn) = O(mn)

**Space Complexity: O(n)**

- We maintain a heights array of size n (number of columns)
- The monotonic stack can grow up to size n in the worst case
- Total: O(n) additional space beyond the input matrix

## Common Mistakes

1. **Forgetting to reset heights when encountering a '0'**: When building the histogram for a new row, if the current cell is '0', the height must be reset to 0, not just not incremented. This is because a '0' breaks the continuity of 1's from above.

2. **Incorrect width calculation in histogram algorithm**: When calculating the width for a popped bar, the width extends from the new top of stack (or beginning if stack is empty) to the current index. A common mistake is using `i - stack.peek()` instead of `i - stack.peek() - 1`.

3. **Not handling empty matrix or edge cases**: Always check if the matrix is null or empty at the beginning. Also, in the histogram function, we need to process all bars by adding a sentinel height of 0 at the end (when `i == n`).

4. **Using character '1' vs integer 1**: The input matrix typically contains characters '0' and '1', not integers. Make sure to compare with the correct type in your language.

## When You'll See This Pattern

This "histogram reduction" pattern appears in several matrix problems:

1. **Largest Rectangle in Histogram (LeetCode 84)**: This is the core subproblem we reduce to. Mastering this is essential for solving the maximal rectangle problem.

2. **Maximal Square (LeetCode 221)**: Similar concept but restricted to squares. The DP approach for that problem also builds upon previous rows.

3. **Count Submatrices With All Ones (LeetCode 1504)**: Another variation where you count all rectangles of 1's instead of finding the maximum area.

The pattern to recognize: when you need to find rectangles (or squares) in a binary matrix, consider building up information row by row and reducing to a 1D problem that you can solve efficiently.

## Key Takeaways

1. **Reduce 2D to 1D**: Many matrix problems can be solved by reducing them to a series of 1D problems. In this case, we reduce finding maximal rectangles to finding maximal rectangles in histograms for each row.

2. **Monotonic stacks are powerful**: They efficiently solve problems where you need to find the next smaller/larger element or calculate areas based on boundaries. The histogram rectangle problem is a classic application.

3. **Build incrementally**: By processing the matrix row by row and maintaining state (heights array), we avoid recomputing information and achieve optimal time complexity.

Remember: If you encounter a binary matrix problem asking for rectangles of 1's, think about whether you can build histograms row by row and apply the "Largest Rectangle in Histogram" algorithm.

Related problems: [Largest Rectangle in Histogram](/problem/largest-rectangle-in-histogram), [Maximal Square](/problem/maximal-square), [Find Sorted Submatrices With Maximum Element at Most K](/problem/find-sorted-submatrices-with-maximum-element-at-most-k)
