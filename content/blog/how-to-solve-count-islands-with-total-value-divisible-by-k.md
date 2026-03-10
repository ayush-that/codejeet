---
title: "How to Solve Count Islands With Total Value Divisible by K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Islands With Total Value Divisible by K. Medium difficulty, 56.3% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Union-Find, Matrix."
date: "2029-05-01"
category: "dsa-patterns"
tags:
  [
    "count-islands-with-total-value-divisible-by-k",
    "array",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Solve Count Islands With Total Value Divisible by K

This problem extends the classic "Number of Islands" by adding two twists: each cell has a positive integer value (not just 0 or 1), and we need to count only those islands whose total sum is divisible by a given integer `k`. The challenge lies in efficiently exploring connected components while tracking their cumulative sums and applying the divisibility check.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [[2, 1, 0],
        [1, 3, 0],
        [0, 0, 4]]
k = 3
```

We'll use Depth-First Search (DFS) to explore islands:

1. Start at (0,0) with value 2. This is land (positive), so begin exploring:
   - Visit (0,0): sum = 2
   - Check right (0,1): value 1 → add to sum = 3
   - From (0,1), check down (1,1): value 3 → add to sum = 6
   - From (1,1), check left (1,0): value 1 → add to sum = 7
   - No more connected land cells
   - Total sum = 7, 7 % 3 = 1 ≠ 0 → not divisible by k

2. Move to (0,2): value 0 (water) → skip

3. Move to (1,2): value 0 (water) → skip

4. Move to (2,0): value 0 (water) → skip

5. Move to (2,1): value 0 (water) → skip

6. Move to (2,2): value 4 (land) → new island:
   - Only cell (2,2) itself
   - Total sum = 4, 4 % 3 = 1 ≠ 0 → not divisible by k

Final count = 0 islands with sum divisible by 3.

## Brute Force Approach

A naive approach would be to:

1. Find all islands using BFS/DFS
2. For each island, calculate its total sum
3. Count how many have sums divisible by k

While this approach is conceptually simple, it's actually optimal for this problem! The "brute force" here isn't about inefficient algorithms but rather about inefficient implementations. Common mistakes in a naive implementation include:

- Recalculating sums multiple times for the same island
- Not properly marking visited cells, leading to infinite loops
- Using extra O(m×n) space unnecessarily

The core algorithm (DFS/BFS) is already optimal because we must visit every land cell at least once to calculate island sums. The optimization comes from implementing it efficiently with proper space management.

## Optimized Approach

The key insight is that we can solve this with a single pass through the grid using either DFS or BFS, tracking the sum as we explore each island. The algorithm works as follows:

1. **Iterate through all cells**: For each cell that's land (positive value) and not visited, start exploring its island.
2. **Explore connected components**: Use DFS/BFS to visit all connected land cells (4-directionally).
3. **Accumulate sum**: Add the value of each visited cell to a running total for that island.
4. **Mark visited cells**: Use a visited set/matrix or modify the grid in-place to avoid revisiting.
5. **Check divisibility**: After exploring the entire island, check if the total sum % k == 0.

The critical optimization is in the visited tracking. We can either:

- Use a separate `visited` matrix (O(m×n) space)
- Modify the grid in-place by setting visited cells to 0 (O(1) extra space but destroys input)

## Optimal Solution

Here's the complete solution using DFS with in-place modification:

<div class="code-group">

```python
# Time: O(m×n) | Space: O(min(m,n)) for recursion stack, O(1) extra
def countIslandsDivisibleByK(grid, k):
    """
    Count islands with total sum divisible by k.

    Args:
        grid: List[List[int]] - matrix with positive integers (land) and 0 (water)
        k: int - divisor to check against island sums

    Returns:
        int - number of islands with sum divisible by k
    """
    if not grid or not grid[0]:
        return 0

    m, n = len(grid), len(grid[0])
    count = 0

    def dfs(i, j):
        """Depth-first search to explore an island and return its total sum."""
        # Base case: out of bounds or water (0) or already visited (0)
        if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] == 0:
            return 0

        # Get current cell value and mark as visited by setting to 0
        cell_value = grid[i][j]
        grid[i][j] = 0

        # Initialize sum with current cell value
        total = cell_value

        # Explore all 4 directions: up, down, left, right
        directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
        for dx, dy in directions:
            total += dfs(i + dx, j + dy)

        return total

    # Iterate through every cell in the grid
    for i in range(m):
        for j in range(n):
            # If we find land (positive value), explore the island
            if grid[i][j] > 0:
                island_sum = dfs(i, j)
                # Check if the island's total sum is divisible by k
                if island_sum % k == 0:
                    count += 1

    return count
```

```javascript
// Time: O(m×n) | Space: O(min(m,n)) for recursion stack, O(1) extra
function countIslandsDivisibleByK(grid, k) {
  /**
   * Count islands with total sum divisible by k.
   *
   * @param {number[][]} grid - matrix with positive integers (land) and 0 (water)
   * @param {number} k - divisor to check against island sums
   * @return {number} - number of islands with sum divisible by k
   */
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    return 0;
  }

  const m = grid.length;
  const n = grid[0].length;
  let count = 0;

  /**
   * Depth-first search to explore an island and return its total sum.
   * @param {number} i - row index
   * @param {number} j - column index
   * @return {number} - sum of the island
   */
  function dfs(i, j) {
    // Base case: out of bounds or water (0) or already visited (0)
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] === 0) {
      return 0;
    }

    // Get current cell value and mark as visited by setting to 0
    const cellValue = grid[i][j];
    grid[i][j] = 0;

    // Initialize sum with current cell value
    let total = cellValue;

    // Explore all 4 directions: up, down, left, right
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    for (const [dx, dy] of directions) {
      total += dfs(i + dx, j + dy);
    }

    return total;
  }

  // Iterate through every cell in the grid
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // If we find land (positive value), explore the island
      if (grid[i][j] > 0) {
        const islandSum = dfs(i, j);
        // Check if the island's total sum is divisible by k
        if (islandSum % k === 0) {
          count++;
        }
      }
    }
  }

  return count;
}
```

```java
// Time: O(m×n) | Space: O(min(m,n)) for recursion stack, O(1) extra
class Solution {
    public int countIslandsDivisibleByK(int[][] grid, int k) {
        /**
         * Count islands with total sum divisible by k.
         *
         * @param grid - matrix with positive integers (land) and 0 (water)
         * @param k - divisor to check against island sums
         * @return number of islands with sum divisible by k
         */
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }

        int m = grid.length;
        int n = grid[0].length;
        int count = 0;

        // Iterate through every cell in the grid
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // If we find land (positive value), explore the island
                if (grid[i][j] > 0) {
                    int islandSum = dfs(grid, i, j, m, n);
                    // Check if the island's total sum is divisible by k
                    if (islandSum % k == 0) {
                        count++;
                    }
                }
            }
        }

        return count;
    }

    /**
     * Depth-first search to explore an island and return its total sum.
     * @param grid - the matrix (modified in-place to mark visited cells)
     * @param i - row index
     * @param j - column index
     * @param m - number of rows
     * @param n - number of columns
     * @return sum of the island
     */
    private int dfs(int[][] grid, int i, int j, int m, int n) {
        // Base case: out of bounds or water (0) or already visited (0)
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] == 0) {
            return 0;
        }

        // Get current cell value and mark as visited by setting to 0
        int cellValue = grid[i][j];
        grid[i][j] = 0;

        // Initialize sum with current cell value
        int total = cellValue;

        // Explore all 4 directions: up, down, left, right
        total += dfs(grid, i + 1, j, m, n); // down
        total += dfs(grid, i - 1, j, m, n); // up
        total += dfs(grid, i, j + 1, m, n); // right
        total += dfs(grid, i, j - 1, m, n); // left

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- We visit each cell at most once. Even though we have nested loops, the DFS only processes unvisited land cells, and each cell is visited exactly once when we either skip it (water/visited) or explore it (land).

**Space Complexity:** O(min(m, n)) for recursion stack, O(1) extra space

- The recursion depth is bounded by the maximum possible island size, which in the worst case could be the entire grid. For a DFS on a grid, the maximum recursion depth is O(min(m, n)) due to the nature of the call stack.
- We use O(1) extra space besides the recursion stack since we modify the grid in-place to mark visited cells. If we preserved the input, we'd need O(m × n) space for a visited matrix.

## Common Mistakes

1. **Forgetting to mark cells as visited**: This leads to infinite recursion or counting the same cell multiple times. Always mark a cell as visited immediately when you first encounter it in DFS/BFS.

2. **Incorrect boundary checks**: When checking adjacent cells, ensure you check both upper bounds (i < m, j < n) and lower bounds (i ≥ 0, j ≥ 0). Off-by-one errors here can cause index out of bounds exceptions.

3. **Misunderstanding the divisibility check**: Some candidates check `sum % k == 0` for each cell instead of the entire island sum. Remember we need the total sum of ALL cells in the island, not individual cells.

4. **Not handling k = 1**: When k = 1, all islands qualify since any integer % 1 = 0. Make sure your solution handles this edge case correctly (it should work automatically if you're using the modulo operator correctly).

## When You'll See This Pattern

This problem combines two fundamental patterns:

1. **Grid Traversal with DFS/BFS**: Used in many matrix problems where you need to find connected components.
   - [Number of Islands](https://leetcode.com/problems/number-of-islands/) - The classic version of this problem
   - [Max Area of Island](https://leetcode.com/problems/max-area-of-island/) - Similar but tracks maximum size instead of count
   - [Flood Fill](https://leetcode.com/problems/flood-fill/) - Simple connected component coloring

2. **Connected Component Analysis with Additional Constraints**: Many problems extend the basic island counting with extra requirements.
   - [Number of Distinct Islands](https://leetcode.com/problems/number-of-distinct-islands/) - Tracks island shapes
   - [Island Perimeter](https://leetcode.com/problems/island-perimeter/) - Calculates perimeter instead of area

## Key Takeaways

1. **DFS/BFS on grids follows a consistent pattern**: Mark visited, check boundaries, explore neighbors. Once you master this pattern, you can solve dozens of similar problems.

2. **In-place modification can save space**: When allowed to modify the input, setting visited cells to a sentinel value (like 0) avoids O(m×n) extra space for a visited matrix.

3. **Island problems often require tracking additional metrics**: Beyond just counting islands, you might need to track sum, max value, shape, or other properties. The exploration algorithm remains the same; you just accumulate different information.

Related problems: [Number of Islands](/problem/number-of-islands)
