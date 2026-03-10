---
title: "How to Solve Count Sub Islands — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Sub Islands. Medium difficulty, 73.0% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Union-Find, Matrix."
date: "2028-07-30"
category: "dsa-patterns"
tags: ["count-sub-islands", "array", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Count Sub Islands

You're given two binary matrices representing islands, and you need to count how many islands in the second grid are completely contained within islands in the first grid. The tricky part is that an island in `grid2` must have **every** one of its land cells also be land in `grid1` to count as a sub-island. This isn't just about checking individual cells—it's about verifying entire connected components.

## Visual Walkthrough

Let's walk through a small example to build intuition:

```
grid1:        grid2:
1 1 0 0       1 1 0 0
1 1 0 0       0 1 0 0
0 0 1 0       0 0 1 0
0 0 0 1       0 0 1 1
```

**Step 1:** Identify islands in `grid2` using DFS/BFS:

- Island A: cells (0,0), (0,1), (1,1) - top-left L-shape
- Island B: cells (2,2), (3,2), (3,3) - vertical line with tail

**Step 2:** Check if Island A is a sub-island:

- Cell (0,0): `grid1[0][0] = 1` ✓
- Cell (0,1): `grid1[0][1] = 1` ✓
- Cell (1,1): `grid1[1][1] = 1` ✓
  All cells are land in `grid1`, so Island A is a sub-island.

**Step 3:** Check if Island B is a sub-island:

- Cell (2,2): `grid1[2][2] = 1` ✓
- Cell (3,2): `grid1[3][2] = 0` ✗
  Found a cell that's water in `grid1`, so Island B is NOT a sub-island.

**Result:** 1 sub-island.

The key insight: We need to explore entire islands in `grid2`, but we can't just check individual cells—we must verify the entire connected component.

## Brute Force Approach

A naive approach might be:

1. Find all islands in `grid2`
2. For each island, check if every cell is land in `grid1`

The problem with this approach is implementation complexity. We'd need to:

- Store coordinates of each island
- Maintain visited sets separately
- Handle multiple passes through the grid

While this would technically work with O(m×n) time and space, it's more complex than necessary. The real issue candidates face isn't algorithmic complexity but correctly implementing the verification logic during traversal.

## Optimized Approach

The optimal insight: **Perform DFS/BFS on `grid2`, but during traversal, track whether we encounter any cell that's water in `grid1`.**

Here's the step-by-step reasoning:

1. We need to explore all islands in `grid2` anyway (like "Number of Islands")
2. While exploring an island in `grid2`, we can simultaneously check if it's a sub-island
3. If ANY cell in the current `grid2` island is water in `grid1`, the entire island fails
4. We can do this in a single pass by modifying the DFS/BFS to return a boolean indicating whether the current island is valid

The algorithm:

- Iterate through all cells in `grid2`
- When we find land (`grid2[r][c] == 1`), start DFS/BFS
- During traversal, mark visited cells (set to 0 or use separate visited set)
- Track a boolean: initially `true`, set to `false` if we find `grid1[r][c] == 0`
- After traversal completes, if boolean is still `true`, increment count

This approach is efficient because:

- Single pass through the grid
- No extra data structures needed beyond recursion stack/queue
- Early termination within an island if we find invalid cell

## Optimal Solution

<div class="code-group">

```python
# Time: O(m×n) | Space: O(m×n) for recursion stack, O(1) if we modify grid in-place
class Solution:
    def countSubIslands(self, grid1: List[List[int]], grid2: List[List[int]]) -> int:
        m, n = len(grid2), len(grid2[0])

        def dfs(r, c):
            # If out of bounds or water in grid2, return True (base case)
            if r < 0 or r >= m or c < 0 or c >= n or grid2[r][c] == 0:
                return True

            # Mark as visited by setting to 0
            grid2[r][c] = 0

            # Initialize result for this island component
            # If current cell is water in grid1, this island fails
            is_valid = grid1[r][c] == 1

            # Explore all 4 directions
            # Use AND because ALL cells must be valid for island to be valid
            is_valid = dfs(r+1, c) and is_valid
            is_valid = dfs(r-1, c) and is_valid
            is_valid = dfs(r, c+1) and is_valid
            is_valid = dfs(r, c-1) and is_valid

            return is_valid

        count = 0
        for r in range(m):
            for c in range(n):
                # Found a new island in grid2
                if grid2[r][c] == 1:
                    # If DFS returns True, entire island is valid
                    if dfs(r, c):
                        count += 1

        return count
```

```javascript
// Time: O(m×n) | Space: O(m×n) for recursion stack
/**
 * @param {number[][]} grid1
 * @param {number[][]} grid2
 * @return {number}
 */
var countSubIslands = function (grid1, grid2) {
  const m = grid2.length,
    n = grid2[0].length;

  const dfs = (r, c) => {
    // Base case: out of bounds or water in grid2
    if (r < 0 || r >= m || c < 0 || c >= n || grid2[r][c] === 0) {
      return true;
    }

    // Mark as visited
    grid2[r][c] = 0;

    // Check if current cell is valid (land in grid1)
    let isValid = grid1[r][c] === 1;

    // Explore all 4 directions
    // All must return true for island to be valid
    isValid = dfs(r + 1, c) && isValid;
    isValid = dfs(r - 1, c) && isValid;
    isValid = dfs(r, c + 1) && isValid;
    isValid = dfs(r, c - 1) && isValid;

    return isValid;
  };

  let count = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      // Start DFS from unvisited land in grid2
      if (grid2[r][c] === 1) {
        if (dfs(r, c)) {
          count++;
        }
      }
    }
  }

  return count;
};
```

```java
// Time: O(m×n) | Space: O(m×n) for recursion stack
class Solution {
    public int countSubIslands(int[][] grid1, int[][] grid2) {
        int m = grid2.length, n = grid2[0].length;
        int count = 0;

        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                // Found unvisited land in grid2
                if (grid2[r][c] == 1) {
                    // If DFS returns true, island is valid
                    if (dfs(grid1, grid2, r, c)) {
                        count++;
                    }
                }
            }
        }

        return count;
    }

    private boolean dfs(int[][] grid1, int[][] grid2, int r, int c) {
        int m = grid2.length, n = grid2[0].length;

        // Base case: out of bounds or water in grid2
        if (r < 0 || r >= m || c < 0 || c >= n || grid2[r][c] == 0) {
            return true;
        }

        // Mark as visited
        grid2[r][c] = 0;

        // Check if current cell is land in grid1
        boolean isValid = grid1[r][c] == 1;

        // Explore all 4 directions
        // All must be true for island to be valid
        isValid = dfs(grid1, grid2, r + 1, c) && isValid;
        isValid = dfs(grid1, grid2, r - 1, c) && isValid;
        isValid = dfs(grid1, grid2, r, c + 1) && isValid;
        isValid = dfs(grid1, grid2, r, c - 1) && isValid;

        return isValid;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m×n)

- We visit each cell at most once
- Each cell triggers at most one DFS call
- Within DFS, we check 4 neighbors, but each neighbor is processed only once

**Space Complexity:** O(m×n) in worst case

- Recursion stack depth could be m×n in worst case (a single large island)
- If we use BFS with a queue instead, space would be O(min(m,n)) for the queue
- We modify `grid2` in-place to mark visited cells, avoiding extra visited matrix

The recursion stack depth is the main space concern. For very large grids, consider:

1. Using BFS with a queue (space O(min(m,n)))
2. Using iterative DFS with a stack
3. Using union-find (though more complex for this problem)

## Common Mistakes

1. **Checking cells individually instead of whole islands**: Candidates might check `grid1[r][c] == 1` for each `grid2` land cell and count matches. This fails because islands are connected components—all cells in a `grid2` island must be land in `grid1`.

2. **Forgetting to mark visited cells**: Without proper visited tracking, you'll get infinite recursion or incorrect counts. Either modify the grid in-place or maintain a separate visited matrix.

3. **Incorrect boolean logic in DFS**: The key is using AND (`&&`) not OR (`||`). All cells must satisfy the condition: `isValid = dfs(neighbor) && isValid`. With OR, you'd count islands where ANY cell is valid, not ALL cells.

4. **Not handling the return value correctly**: The DFS should return whether the current component is valid. Some candidates try to use a global variable or class field, which gets messy with multiple islands.

## When You'll See This Pattern

This problem combines two classic patterns:

1. **Connected Components (DFS/BFS)**: Like "Number of Islands", you traverse all connected land cells. This pattern appears whenever you need to find groups in a grid/graph.

2. **Conditional Traversal**: The twist is adding a condition during traversal. Similar patterns appear in:
   - "Max Area of Island": Track size during DFS
   - "Number of Enclaves": Check if island touches boundary
   - "Surrounded Regions": Mark regions based on boundary contact

3. **Multi-grid Comparison**: Comparing structures across multiple grids/graphs. Related to:
   - "Image Overlap": Compare two binary matrices
   - "Word Search": Compare grid against word pattern

## Key Takeaways

1. **Modify traversal to track additional information**: When doing DFS/BFS on grids, you can modify the traversal to collect information (size, validity, shape) about the connected component.

2. **Use AND for "all must be true" conditions**: When checking if all elements in a component satisfy a condition, propagate the result with AND operations during recursion.

3. **Single-pass optimization**: Often you can check conditions during the initial traversal rather than doing multiple passes. This saves time and simplifies code.

Related problems: [Number of Islands](/problem/number-of-islands), [Number of Distinct Islands](/problem/number-of-distinct-islands), [Find All Groups of Farmland](/problem/find-all-groups-of-farmland)
