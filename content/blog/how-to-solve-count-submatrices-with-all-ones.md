---
title: "How to Solve Count Submatrices With All Ones — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Submatrices With All Ones. Medium difficulty, 71.1% acceptance rate. Topics: Array, Dynamic Programming, Stack, Matrix, Monotonic Stack."
date: "2026-09-29"
category: "dsa-patterns"
tags: ["count-submatrices-with-all-ones", "array", "dynamic-programming", "stack", "medium"]
---

# How to Solve Count Submatrices With All Ones

This problem asks us to count all rectangular submatrices within a binary matrix that contain only 1's. What makes this challenging is that a brute force approach would need to check every possible rectangle (O(m³n³) time), which is completely infeasible for typical constraints. The key insight is that we can build upon smaller rectangles to count larger ones efficiently using dynamic programming and histogram techniques.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
mat = [[1,0,1],
       [1,1,0],
       [1,1,0]]
```

We want to count all submatrices containing only 1's. Let's think row by row:

**Row 0:** We have single-cell submatrices at (0,0) and (0,2). That's 2 submatrices.

**Row 1:** Now it gets interesting. At position (1,0), we have a 1. We can form:

- A 1x1 submatrix at (1,0)
- A 2x1 submatrix combining (0,0) and (1,0)

At position (1,1), we have a 1. We can form:

- A 1x1 submatrix at (1,1)
- A 2x1 submatrix combining (0,1) and (1,1) - but wait, (0,1) is 0, so this isn't valid!

This reveals a pattern: when we encounter a 0, it "breaks" vertical continuity. We can think of each column as having a "height" of consecutive 1's from the current row upward. For row 1:

- Column 0: height = 2 (from rows 0 and 1)
- Column 1: height = 1 (only row 1, since row 0 has 0)
- Column 2: height = 0 (row 1 has 0)

Now, for each row, we need to count all rectangles that end at that row. This becomes: "For each position, how many rectangles end here with their bottom-right corner at this cell?"

## Brute Force Approach

The most straightforward approach is to check every possible submatrix:

1. For every possible top-left corner (i,j)
2. For every possible bottom-right corner (k,l) where k ≥ i and l ≥ j
3. Check if all cells in this rectangle are 1's

This requires O(m²n²) rectangles to check, and checking each rectangle takes O(mn) time in the worst case, giving us O(m³n³) time complexity. Even for a modest 100×100 matrix, this is completely infeasible (10¹² operations).

<div class="code-group">

```python
# Brute Force - Too Slow for Practical Use
# Time: O(m³n³) | Space: O(1)
def numSubmatBruteForce(mat):
    m, n = len(mat), len(mat[0])
    count = 0

    # Check all possible rectangles
    for top in range(m):
        for left in range(n):
            for bottom in range(top, m):
                for right in range(left, n):
                    # Check if this rectangle contains all 1's
                    valid = True
                    for i in range(top, bottom + 1):
                        for j in range(left, right + 1):
                            if mat[i][j] == 0:
                                valid = False
                                break
                        if not valid:
                            break

                    if valid:
                        count += 1

    return count
```

```javascript
// Brute Force - Too Slow for Practical Use
// Time: O(m³n³) | Space: O(1)
function numSubmatBruteForce(mat) {
  const m = mat.length,
    n = mat[0].length;
  let count = 0;

  // Check all possible rectangles
  for (let top = 0; top < m; top++) {
    for (let left = 0; left < n; left++) {
      for (let bottom = top; bottom < m; bottom++) {
        for (let right = left; right < n; right++) {
          // Check if this rectangle contains all 1's
          let valid = true;
          for (let i = top; i <= bottom && valid; i++) {
            for (let j = left; j <= right && valid; j++) {
              if (mat[i][j] === 0) {
                valid = false;
              }
            }
          }

          if (valid) {
            count++;
          }
        }
      }
    }
  }

  return count;
}
```

```java
// Brute Force - Too Slow for Practical Use
// Time: O(m³n³) | Space: O(1)
public int numSubmatBruteForce(int[][] mat) {
    int m = mat.length, n = mat[0].length;
    int count = 0;

    // Check all possible rectangles
    for (int top = 0; top < m; top++) {
        for (int left = 0; left < n; left++) {
            for (int bottom = top; bottom < m; bottom++) {
                for (int right = left; right < n; right++) {
                    // Check if this rectangle contains all 1's
                    boolean valid = true;
                    for (int i = top; i <= bottom && valid; i++) {
                        for (int j = left; j <= right && valid; j++) {
                            if (mat[i][j] == 0) {
                                valid = false;
                            }
                        }
                    }

                    if (valid) {
                        count++;
                    }
                }
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we can process the matrix row by row, treating each row as the base of rectangles. For each cell, we maintain the height of consecutive 1's from that cell upward. Then, for each row, we need to count all rectangles that end at that row.

Consider this: if we know the heights of consecutive 1's for each column at the current row, we have a histogram. The problem reduces to: "For each position in the histogram, how many subrectangles end here with their bottom at the current row?"

For example, with heights = [2, 1, 0, 3, 2]:

- At column 0 (height 2): We can form rectangles of width 1 with heights 1 and 2
- At column 1 (height 1): We can form rectangles of width 1 with height 1, and rectangles of width 2 with height 1 (since the minimum height in columns 0-1 is 1)
- At column 3 (height 3): We can form rectangles of various widths, but we need to consider the minimum height in each width

The efficient way to compute this is using a monotonic stack. For each position, we maintain a stack of (height, width) pairs where heights are non-decreasing. When we encounter a smaller height, we pop from the stack and add the rectangles that were formed with the popped height.

## Optimal Solution

We'll use dynamic programming to compute heights of consecutive 1's and a monotonic stack to count rectangles efficiently for each row.

<div class="code-group">

```python
# Optimal Solution using Dynamic Programming and Monotonic Stack
# Time: O(m*n) | Space: O(n)
def numSubmat(mat):
    m, n = len(mat), len(mat[0])
    total = 0

    # heights array stores the number of consecutive 1's above (including current row)
    heights = [0] * n

    for i in range(m):
        # Update heights for current row
        for j in range(n):
            if mat[i][j] == 1:
                heights[j] += 1  # Extend the consecutive 1's streak
            else:
                heights[j] = 0   # Reset to 0 when we encounter a 0

        # Now count all rectangles ending at row i
        stack = []  # Monotonic stack storing (height, count) pairs
        row_count = 0

        for j in range(n):
            width = 1  # Width of rectangles ending at column j

            # Maintain monotonic stack (non-decreasing heights)
            while stack and stack[-1][0] > heights[j]:
                # Pop elements with greater height
                prev_height, prev_width = stack.pop()
                # Remove rectangles that can't extend to current column
                row_count -= prev_width * (prev_height - heights[j])
                width += prev_width

            # Push current height with accumulated width
            stack.append((heights[j], width))
            # Add rectangles ending at current column
            row_count += heights[j]
            total += row_count

    return total
```

```javascript
// Optimal Solution using Dynamic Programming and Monotonic Stack
// Time: O(m*n) | Space: O(n)
function numSubmat(mat) {
  const m = mat.length,
    n = mat[0].length;
  let total = 0;

  // heights array stores the number of consecutive 1's above (including current row)
  let heights = new Array(n).fill(0);

  for (let i = 0; i < m; i++) {
    // Update heights for current row
    for (let j = 0; j < n; j++) {
      if (mat[i][j] === 1) {
        heights[j] += 1; // Extend the consecutive 1's streak
      } else {
        heights[j] = 0; // Reset to 0 when we encounter a 0
      }
    }

    // Now count all rectangles ending at row i
    let stack = []; // Monotonic stack storing [height, count] pairs
    let rowCount = 0;

    for (let j = 0; j < n; j++) {
      let width = 1; // Width of rectangles ending at column j

      // Maintain monotonic stack (non-decreasing heights)
      while (stack.length > 0 && stack[stack.length - 1][0] > heights[j]) {
        // Pop elements with greater height
        const [prevHeight, prevWidth] = stack.pop();
        // Remove rectangles that can't extend to current column
        rowCount -= prevWidth * (prevHeight - heights[j]);
        width += prevWidth;
      }

      // Push current height with accumulated width
      stack.push([heights[j], width]);
      // Add rectangles ending at current column
      rowCount += heights[j];
      total += rowCount;
    }
  }

  return total;
}
```

```java
// Optimal Solution using Dynamic Programming and Monotonic Stack
// Time: O(m*n) | Space: O(n)
public int numSubmat(int[][] mat) {
    int m = mat.length, n = mat[0].length;
    int total = 0;

    // heights array stores the number of consecutive 1's above (including current row)
    int[] heights = new int[n];

    for (int i = 0; i < m; i++) {
        // Update heights for current row
        for (int j = 0; j < n; j++) {
            if (mat[i][j] == 1) {
                heights[j] += 1;  // Extend the consecutive 1's streak
            } else {
                heights[j] = 0;   // Reset to 0 when we encounter a 0
            }
        }

        // Now count all rectangles ending at row i
        Stack<int[]> stack = new Stack<>();  // Monotonic stack storing [height, count] pairs
        int rowCount = 0;

        for (int j = 0; j < n; j++) {
            int width = 1;  // Width of rectangles ending at column j

            // Maintain monotonic stack (non-decreasing heights)
            while (!stack.isEmpty() && stack.peek()[0] > heights[j]) {
                // Pop elements with greater height
                int[] prev = stack.pop();
                int prevHeight = prev[0];
                int prevWidth = prev[1];
                // Remove rectangles that can't extend to current column
                rowCount -= prevWidth * (prevHeight - heights[j]);
                width += prevWidth;
            }

            // Push current height with accumulated width
            stack.push(new int[]{heights[j], width});
            // Add rectangles ending at current column
            rowCount += heights[j];
            total += rowCount;
        }
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n)**

- We iterate through each cell once to update the heights array: O(m×n)
- For each row, we process each column once with the monotonic stack: O(m×n)
- Each column is pushed and popped from the stack at most once, so the amortized cost is O(n) per row
- Total: O(m×n + m×n) = O(m×n)

**Space Complexity: O(n)**

- We maintain a heights array of size n
- We use a stack that can grow up to size n in the worst case
- Total: O(n) extra space

## Common Mistakes

1. **Forgetting to reset heights when encountering a 0**: When mat[i][j] = 0, you must set heights[j] = 0, not just skip updating it. A 0 breaks the vertical continuity of 1's.

2. **Incorrect stack maintenance**: The stack should maintain non-decreasing heights. When popping, you need to properly adjust the count of rectangles and accumulate widths.

3. **Double-counting rectangles**: Make sure you're counting rectangles that end at each position (bottom-right corner), not starting at each position. This ensures each rectangle is counted exactly once.

4. **Not understanding the width accumulation**: When you pop from the stack, you need to add the popped width to the current width because all those columns can form rectangles with the current (lower) height.

## When You'll See This Pattern

This histogram + monotonic stack pattern appears in several matrix and array problems:

1. **Largest Rectangle in Histogram (LeetCode 84)**: The core technique of using a monotonic stack to find maximum area in a histogram is directly applicable here.

2. **Maximal Rectangle (LeetCode 85)**: This problem extends the histogram concept to 2D matrices - you convert each row to a histogram and find the largest rectangle.

3. **Trapping Rain Water (LeetCode 42)**: Uses a similar monotonic stack approach to calculate how much water can be trapped between bars.

The pattern is: when you need to process elements while maintaining information about previous elements in a way that depends on relative values (greater/less than), a monotonic stack is often the right tool.

## Key Takeaways

1. **Convert 2D problems to 1D**: By processing the matrix row by row and maintaining column heights, we reduce a 2D problem to a series of 1D histogram problems.

2. **Monotonic stacks efficiently track boundaries**: When you need to find the nearest smaller element on either side, or maintain running minimums/maximums, monotonic stacks provide O(n) solutions.

3. **Count by endpoint**: Counting submatrices (or subarrays) by their ending position ensures each is counted exactly once and often leads to more efficient solutions.

Related problems: [Count Submatrices With Equal Frequency of X and Y](/problem/count-submatrices-with-equal-frequency-of-x-and-y)
