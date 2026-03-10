---
title: "How to Solve Grid Game — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Grid Game. Medium difficulty, 60.9% acceptance rate. Topics: Array, Matrix, Prefix Sum."
date: "2026-11-11"
category: "dsa-patterns"
tags: ["grid-game", "array", "matrix", "prefix-sum", "medium"]
---

# How to Solve Grid Game

This problem involves two robots moving through a 2×n grid where both robots start at (0,0) and must reach (1,n-1). The first robot moves first, collecting all points along its path, then the second robot moves, collecting points not already taken by the first robot. The goal is to **minimize the maximum points** the second robot can collect. What makes this problem interesting is that it's not about finding optimal paths for both robots, but rather about how the first robot's path affects the second robot's maximum possible collection.

## Visual Walkthrough

Let's trace through a concrete example: `grid = [[2,5,4],[1,5,1]]`

```
Grid:
Row 0: [2, 5, 4]
Row 1: [1, 5, 1]
```

The first robot must move from (0,0) to (1,2) following these rules:

1. Start at (0,0)
2. Move only right or down (never left or up)
3. Must end at (1,n-1) = (1,2)

The first robot's path determines which points are removed before the second robot moves. The second robot then takes the best possible path through the remaining points.

Let's consider two extreme cases:

**Case 1: First robot goes all the way right on top row, then down**

- Path: (0,0) → (0,1) → (0,2) → (1,2)
- Points collected: 2 + 5 + 4 + 1 = 12
- Remaining grid for second robot:
  ```
  Row 0: [0, 0, 0]  (all taken)
  Row 1: [1, 5, 0]  (only (1,2) taken)
  ```
- Second robot's best path: (0,0) → (1,0) → (1,1) → (1,2)
- Points collected: 0 + 1 + 5 + 0 = 6

**Case 2: First robot goes down immediately, then right on bottom row**

- Path: (0,0) → (1,0) → (1,1) → (1,2)
- Points collected: 2 + 1 + 5 + 1 = 9
- Remaining grid:
  ```
  Row 0: [0, 5, 4]  (only (0,0) taken)
  Row 1: [0, 0, 0]  (all taken)
  ```
- Second robot's best path: (0,0) → (0,1) → (0,2) → (1,2)
- Points collected: 0 + 5 + 4 + 0 = 9

The first robot wants to minimize the second robot's maximum, so between these two options, Case 1 (with second robot getting 6) is better than Case 2 (with second robot getting 9).

But there are actually `n` possible paths where the first robot switches from top to bottom at different columns. We need to find which switching point gives the smallest maximum for the second robot.

## Brute Force Approach

A naive approach would be to:

1. Generate all possible paths for the first robot (there are exactly `n` distinct paths since the robot can only switch from top to bottom once)
2. For each path, calculate the remaining points for the second robot
3. Find the second robot's maximum score through the remaining grid using another path search
4. Track the minimum of these maximums

This would be O(n²) because for each of the `n` first robot paths, we need to find the second robot's best path in O(n) time. While O(n²) might work for small `n`, the constraints (n up to 5×10⁴) make this too slow.

The key insight is that we don't need to recalculate the second robot's best path from scratch for each first robot path. We can use prefix sums to compute it in O(1) time.

## Optimized Approach

Let's think about the structure of the problem:

1. The first robot's path always looks like:
   - Go right on row 0 for some number of columns `k` (0 ≤ k < n)
   - Then go down to row 1 at column `k`
   - Then go right on row 1 to the end

2. When the first robot takes this path, it collects:
   - All points in row 0 from column 0 to column `k` (inclusive)
   - All points in row 1 from column `k` to column `n-1` (inclusive)

3. The second robot then gets the remaining points:
   - Row 0 from column `k+1` to `n-1`
   - Row 1 from column 0 to `k-1`

4. The second robot wants to maximize its collection, and it has two options:
   - Option A: Go right on row 0 from column `k+1` to end, then down
   - Option B: Go down immediately, then right on row 1 from column 0 to `k-1`

5. The second robot will choose the better of these two options, so its score will be:
   `max(sum(row0[k+1:]), sum(row1[0:k]))`

6. The first robot wants to minimize this maximum, so we need to find:
   `min over all k of max(sum(row0[k+1:]), sum(row1[0:k]))`

We can compute prefix sums for both rows to get these sums in O(1) time:

- `top_right = total_top - prefix_top[k+1]` (sum of row 0 from k+1 to end)
- `bottom_left = prefix_bottom[k]` (sum of row 1 from 0 to k-1)

Where `prefix_top[i]` is sum of first i elements of row 0, and `prefix_bottom[i]` is sum of first i elements of row 1.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def gridGame(self, grid):
    """
    Minimize the maximum points the second robot can collect.

    Approach:
    1. Calculate total points in top row
    2. Initialize prefix sum for bottom row
    3. For each possible switch point k:
       - Top remaining = total_top - prefix_top (points in top row after k)
       - Bottom remaining = prefix_bottom (points in bottom row before k)
       - Second robot takes max of these two
       - First robot wants to minimize this maximum
    """
    n = len(grid[0])

    # Calculate total points in top row
    top_total = sum(grid[0])

    # Initialize variables
    bottom_prefix = 0  # sum of bottom row from 0 to k-1
    result = float('inf')

    # Try all possible switch points k
    for k in range(n):
        # Points remaining for second robot:
        # Top row: everything from k+1 to end
        top_remaining = top_total - grid[0][k]

        # Bottom row: everything from 0 to k-1
        # (bottom_prefix currently contains sum from 0 to k-1)

        # Second robot chooses the better path
        second_robot_score = max(top_remaining, bottom_prefix)

        # First robot wants to minimize this maximum
        result = min(result, second_robot_score)

        # Update prefix sums for next iteration
        top_total -= grid[0][k]  # remove current top cell from total
        bottom_prefix += grid[1][k]  # add current bottom cell to prefix

    return result
```

```javascript
// Time: O(n) | Space: O(1)
function gridGame(grid) {
  /**
   * Minimize the maximum points the second robot can collect.
   *
   * Approach:
   * 1. Calculate total points in top row
   * 2. Track prefix sum for bottom row
   * 3. For each possible switch point k:
   *    - Top remaining = total_top - current top cell
   *    - Bottom remaining = prefix_bottom
   *    - Second robot takes max of these
   *    - First robot minimizes this maximum
   */
  const n = grid[0].length;

  // Calculate total points in top row
  let topTotal = grid[0].reduce((sum, val) => sum + val, 0);

  // Initialize variables
  let bottomPrefix = 0; // sum of bottom row from 0 to k-1
  let result = Infinity;

  // Try all possible switch points k
  for (let k = 0; k < n; k++) {
    // Points remaining for second robot:
    // Top row: everything from k+1 to end
    const topRemaining = topTotal - grid[0][k];

    // Bottom row: everything from 0 to k-1
    // (bottomPrefix currently contains sum from 0 to k-1)

    // Second robot chooses the better path
    const secondRobotScore = Math.max(topRemaining, bottomPrefix);

    // First robot wants to minimize this maximum
    result = Math.min(result, secondRobotScore);

    // Update for next iteration
    topTotal -= grid[0][k]; // remove current top cell
    bottomPrefix += grid[1][k]; // add current bottom cell to prefix
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1)
public long gridGame(int[][] grid) {
    /**
     * Minimize the maximum points the second robot can collect.
     *
     * Approach:
     * 1. Calculate total points in top row
     * 2. Track prefix sum for bottom row
     * 3. For each possible switch point k:
     *    - Top remaining = total_top - current top cell
     *    - Bottom remaining = prefix_bottom
     *    - Second robot takes max of these
     *    - First robot minimizes this maximum
     */
    int n = grid[0].length;

    // Calculate total points in top row (use long to avoid overflow)
    long topTotal = 0;
    for (int num : grid[0]) {
        topTotal += num;
    }

    // Initialize variables
    long bottomPrefix = 0;  // sum of bottom row from 0 to k-1
    long result = Long.MAX_VALUE;

    // Try all possible switch points k
    for (int k = 0; k < n; k++) {
        // Points remaining for second robot:
        // Top row: everything from k+1 to end
        long topRemaining = topTotal - grid[0][k];

        // Bottom row: everything from 0 to k-1
        // (bottomPrefix currently contains sum from 0 to k-1)

        // Second robot chooses the better path
        long secondRobotScore = Math.max(topRemaining, bottomPrefix);

        // First robot wants to minimize this maximum
        result = Math.min(result, secondRobotScore);

        // Update for next iteration
        topTotal -= grid[0][k];  // remove current top cell
        bottomPrefix += grid[1][k];  // add current bottom cell to prefix
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the grid columns
- Each iteration does O(1) work (comparisons and arithmetic)
- The initial sum calculation for the top row is also O(n)

**Space Complexity:** O(1)

- We only use a few variables to track running totals
- No additional data structures proportional to n

## Common Mistakes

1. **Incorrect boundary handling for k**: The robot can switch at any column from 0 to n-1. At k=0, the first robot goes down immediately (top_remaining = total_top - grid[0][0], bottom_prefix = 0). At k=n-1, the first robot goes all the way on top then down (top_remaining = 0, bottom_prefix = sum of all but last bottom cell).

2. **Forgetting that the first robot collects the point at the switch column**: When the first robot switches at column k, it collects both grid[0][k] (before going down) and grid[1][k] (after going down). That's why we subtract grid[0][k] from top_total but add grid[1][k] to bottom_prefix only after computing the current score.

3. **Using integer instead of long (Java specific)**: The points can sum up to large values (n × 10⁵ = 5×10⁹), which exceeds 32-bit integer range. Always use 64-bit integers for cumulative sums in such problems.

4. **Trying to actually simulate paths**: Some candidates waste time implementing BFS/DFS to find paths. The structure of the problem (2 rows, only right/down moves) means there are only n possible paths, and we can compute scores mathematically without simulation.

## When You'll See This Pattern

This problem uses **prefix sums with minimization of maximums**, a pattern that appears in several optimization problems:

1. **Minimum Penalty for a Shop (LeetCode 2483)**: Similar structure where you choose a point to minimize the maximum of two cumulative sums (early arrivals vs late departures).

2. **Best Time to Buy and Sell Stock (LeetCode 121)**: While simpler, it also involves tracking running minimums/maximums to optimize a decision.

3. **Trapping Rain Water (LeetCode 42)**: Uses prefix and suffix maximums to determine water capacity at each position.

4. **Product of Array Except Self (LeetCode 238)**: Uses prefix and suffix products, similar to how we use prefix and "suffix" sums here.

The core pattern is: when you need to make a decision that splits an array into two parts, and you need to compute some aggregate of each part, prefix/suffix sums (or similar running aggregates) can help avoid O(n²) recomputation.

## Key Takeaways

1. **Look for structural constraints**: The 2×n grid with only right/down movement creates exactly n possible paths. Recognizing this reduces the problem from exponential to linear search.

2. **Prefix sums optimize repeated range queries**: When you need to compute sums of prefixes/suffixes repeatedly, precomputing running totals gives O(1) queries instead of O(n).

3. **Minimax problems often have a "sweet spot"**: The optimal solution is usually where the two competing quantities are balanced. Here, we want the point where the top remaining and bottom remaining are as close as possible.

4. **Visualize the split point**: Thinking in terms of "where does the first robot switch from top to bottom?" transforms a path-finding problem into a simpler array traversal problem.

Related problems: [Minimum Penalty for a Shop](/problem/minimum-penalty-for-a-shop)
