---
title: "How to Solve Triangle — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Triangle. Medium difficulty, 59.9% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-08-23"
category: "dsa-patterns"
tags: ["triangle", "array", "dynamic-programming", "medium"]
---

# How to Solve Triangle

This problem asks us to find the minimum path sum from the top to the bottom of a triangle-shaped array, where you can only move to adjacent numbers on the row below. What makes this problem interesting is that while it appears to be about finding a path through a triangle, it's actually a classic dynamic programming problem in disguise. The "adjacent number" constraint creates overlapping subproblems that we can solve efficiently with careful computation.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
triangle = [
     [2],
    [3,4],
   [6,5,7],
  [4,1,8,3]
]
```

**Step 1: Start at the top**
We begin at `2` (row 0, position 0). Current path sum = 2.

**Step 2: Move to row 1**
From position 0 in row 0, we can move to:

- Position 0 in row 1 (value 3) → path sum = 2 + 3 = 5
- Position 1 in row 1 (value 4) → path sum = 2 + 4 = 6

**Step 3: Move to row 2**
Now we have two paths to consider. Let's track both:

From position 0 in row 1 (value 3, path sum 5):

- To position 0 in row 2 (value 6) → path sum = 5 + 6 = 11
- To position 1 in row 2 (value 5) → path sum = 5 + 5 = 10

From position 1 in row 1 (value 4, path sum 6):

- To position 1 in row 2 (value 5) → path sum = 6 + 5 = 11
- To position 2 in row 2 (value 7) → path sum = 6 + 7 = 13

Now we have 4 paths: [11, 10, 11, 13]

**Step 4: Move to row 3**
We need to continue all 4 paths, but notice something important: multiple paths can reach the same position with different sums. For example, position 1 in row 2 (value 5) can be reached with sum 10 or 11. For finding the minimum path, we only care about the smaller sum (10) when continuing from that position.

This observation is the key insight: at each position, we only need to track the **minimum sum** to reach that position, not all possible paths. This reduces our work dramatically.

## Brute Force Approach

The brute force approach would explore every possible path from top to bottom. For each position in the triangle, we recursively explore both possible moves to the next row. This creates a binary tree of possibilities.

The problem with this approach is its exponential time complexity. For a triangle with `n` rows, there are `2^(n-1)` possible paths to explore. For just 20 rows, that's over 500,000 paths! This quickly becomes infeasible.

Here's what the brute force recursion might look like:

```python
def minimumTotal(triangle):
    def dfs(row, col):
        if row == len(triangle) - 1:
            return triangle[row][col]

        left = dfs(row + 1, col)
        right = dfs(row + 1, col + 1)

        return triangle[row][col] + min(left, right)

    return dfs(0, 0)
```

This solution is correct but extremely inefficient for larger triangles because it recomputes the same subproblems many times. For example, the path to position `(row, col)` will be computed multiple times from different starting paths.

## Optimized Approach

The key insight is that this problem has **optimal substructure** and **overlapping subproblems** — the two hallmarks of dynamic programming.

**Optimal substructure**: The minimum path to reach a position `(row, col)` consists of the value at that position plus the minimum of the paths to the two positions above it that can reach it.

**Overlapping subproblems**: The same position will be reached by multiple paths, and we recompute its minimum path many times in the brute force approach.

We can solve this efficiently using **bottom-up dynamic programming**:

1. Start from the second-to-last row and work upward
2. For each position in the current row, update it to be its value plus the minimum of the two values below it that can reach it
3. Continue until we reach the top
4. The value at the top will be our minimum path sum

Alternatively, we can use **top-down dynamic programming with memoization**, but bottom-up is more elegant here since we're computing all values anyway.

## Optimal Solution

Here's the complete solution using bottom-up dynamic programming:

<div class="code-group">

```python
# Time: O(n²) where n is the number of rows
# Space: O(1) if we modify the input, O(n) if we use a separate dp array
def minimumTotal(triangle):
    """
    Calculate the minimum path sum from top to bottom of a triangle.

    Approach: Bottom-up dynamic programming starting from the second-to-last row.
    For each position, we update it to be its value plus the minimum of the
    two adjacent positions in the row below.
    """
    # Start from the second-to-last row and move upward
    for row in range(len(triangle) - 2, -1, -1):
        # For each position in the current row
        for col in range(len(triangle[row])):
            # Update current position to be its value plus the minimum
            # of the two positions below that can reach it
            triangle[row][col] += min(
                triangle[row + 1][col],      # Directly below
                triangle[row + 1][col + 1]   # Diagonally right below
            )

    # After processing all rows, the top element contains the minimum path sum
    return triangle[0][0]
```

```javascript
// Time: O(n²) where n is the number of rows
// Space: O(1) if we modify the input, O(n) if we use a separate dp array
function minimumTotal(triangle) {
  /**
   * Calculate the minimum path sum from top to bottom of a triangle.
   *
   * Approach: Bottom-up dynamic programming starting from the second-to-last row.
   * For each position, we update it to be its value plus the minimum of the
   * two adjacent positions in the row below.
   */

  // Start from the second-to-last row and move upward
  for (let row = triangle.length - 2; row >= 0; row--) {
    // For each position in the current row
    for (let col = 0; col < triangle[row].length; col++) {
      // Update current position to be its value plus the minimum
      // of the two positions below that can reach it
      triangle[row][col] += Math.min(
        triangle[row + 1][col], // Directly below
        triangle[row + 1][col + 1] // Diagonally right below
      );
    }
  }

  // After processing all rows, the top element contains the minimum path sum
  return triangle[0][0];
}
```

```java
// Time: O(n²) where n is the number of rows
// Space: O(1) if we modify the input, O(n) if we use a separate dp array
class Solution {
    public int minimumTotal(List<List<Integer>> triangle) {
        /**
         * Calculate the minimum path sum from top to bottom of a triangle.
         *
         * Approach: Bottom-up dynamic programming starting from the second-to-last row.
         * For each position, we update it to be its value plus the minimum of the
         * two adjacent positions in the row below.
         */

        // Start from the second-to-last row and move upward
        for (int row = triangle.size() - 2; row >= 0; row--) {
            // For each position in the current row
            for (int col = 0; col < triangle.get(row).size(); col++) {
                // Get the current value
                int current = triangle.get(row).get(col);

                // Calculate the minimum of the two positions below
                int minBelow = Math.min(
                    triangle.get(row + 1).get(col),      // Directly below
                    triangle.get(row + 1).get(col + 1)   // Diagonally right below
                );

                // Update the current position with the new minimum path sum
                triangle.get(row).set(col, current + minBelow);
            }
        }

        // After processing all rows, the top element contains the minimum path sum
        return triangle.get(0).get(0);
    }
}
```

</div>

**Alternative approach without modifying input:** If you're not allowed to modify the input triangle, you can use a separate DP array:

```python
def minimumTotal(triangle):
    # Create a DP array initialized with the last row
    dp = triangle[-1][:]

    # Process from second-to-last row upward
    for row in range(len(triangle) - 2, -1, -1):
        for col in range(len(triangle[row])):
            dp[col] = triangle[row][col] + min(dp[col], dp[col + 1])

    return dp[0]
```

## Complexity Analysis

**Time Complexity: O(n²)**

- We process each element in the triangle exactly once
- For a triangle with `n` rows, the total number of elements is `n(n+1)/2`, which is O(n²)
- Each element requires a constant amount of work (a comparison and addition)

**Space Complexity: O(1) or O(n)**

- **O(1)** if we modify the input triangle in place (as shown in the main solution)
- **O(n)** if we use a separate DP array (where n is the number of rows)
- The recursive call stack for a top-down approach would also be O(n) in the worst case

## Common Mistakes

1. **Starting from the top instead of the bottom**: Many candidates try to solve this top-down, which requires keeping track of multiple paths or using more complex logic. Bottom-up is cleaner because each position only needs to know about the row immediately below it.

2. **Incorrect index bounds**: When accessing `triangle[row + 1][col + 1]`, it's easy to go out of bounds if you're not careful about loop limits. Always verify that `col + 1` exists in the next row (which it always does in a valid triangle, but defensive programming is good).

3. **Forgetting that rows have different lengths**: Each row `i` has `i+1` elements. A common error is to use the same loop bound for all rows, which causes index errors.

4. **Modifying the input when not allowed**: Some interviewers may specify that you shouldn't modify the input. Always ask if you're unsure, or use a separate DP array to be safe.

## When You'll See This Pattern

This triangle path problem is a classic example of **2D dynamic programming** where the state depends on adjacent previous states. You'll see similar patterns in:

1. **Minimum Path Sum (LeetCode 64)**: Find the minimum path sum from top-left to bottom-right in a grid, where you can only move down or right. The recurrence relation is very similar: `dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`.

2. **Unique Paths (LeetCode 62)**: Count the number of unique paths from top-left to bottom-right in a grid. While it counts paths rather than sums, the DP structure is identical.

3. **Dungeon Game (LeetCode 174)**: Another grid DP problem that's best solved bottom-up, similar to our triangle problem.

The key pattern to recognize: when you need to find an optimal path through a grid or triangular structure, and movement is restricted to certain directions, dynamic programming is usually the right approach.

## Key Takeaways

1. **Bottom-up DP is often cleaner for grid/triangle problems**: Starting from the destination and working backward simplifies the logic because each position only needs information from the "next" step.

2. **Look for overlapping subproblems**: If you find yourself computing the same intermediate result multiple times in a recursive solution, dynamic programming can optimize it.

3. **The shape of the data structure matters**: In a triangle, row `i` has `i+1` elements. This affects loop bounds and index calculations. Always verify your indices match the data structure's shape.

[Practice this problem on CodeJeet](/problem/triangle)
