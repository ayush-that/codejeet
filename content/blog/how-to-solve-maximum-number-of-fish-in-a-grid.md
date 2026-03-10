---
title: "How to Solve Maximum Number of Fish in a Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Fish in a Grid. Medium difficulty, 70.5% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Union-Find, Matrix."
date: "2026-07-14"
category: "dsa-patterns"
tags:
  [
    "maximum-number-of-fish-in-a-grid",
    "array",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Solve Maximum Number of Fish in a Grid

You're given a 2D grid where each cell is either land (0) or water with some number of fish (>0). You can start fishing at any water cell and can move to adjacent water cells (up, down, left, right) to catch all fish in connected water regions. The goal is to find the maximum total fish you can catch from any single connected water region. What makes this problem interesting is that it's essentially finding the maximum sum of values in connected components of a graph, but with the twist that you can start anywhere in the component and catch all fish in that component.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [
    [0, 2, 0],
    [8, 6, 0],
    [0, 5, 1]
]
```

We need to find all connected water regions (adjacent cells with values > 0) and calculate their total fish:

1. **Region 1**: Cell (0,1) has 2 fish. It has no adjacent water cells (up is out of bounds, down is 8 but that's not adjacent in the grid sense - actually down is (1,1) with 6, so they ARE connected!). Let me correct: Actually, (0,1) is adjacent to (1,1) which has 6 fish, so they're in the same region.

2. Let's trace properly:
   - Start at (0,1): value = 2
   - Check neighbors: (1,1) = 6 (water), (0,0) = 0 (land), (0,2) = 0 (land), (-1,1) out of bounds
   - So (0,1) connects to (1,1)
   - From (1,1): value = 6
   - Check neighbors: (0,1) already visited, (2,1) = 5 (water), (1,0) = 8 (water), (1,2) = 0 (land)
   - So (1,1) connects to (2,1) and (1,0)
   - From (1,0): value = 8
   - Check neighbors: (0,0) = 0, (2,0) = 0, (1,1) already visited
   - From (2,1): value = 5
   - Check neighbors: (1,1) already visited, (2,2) = 1 (water), (2,0) = 0, (3,1) out of bounds
   - From (2,2): value = 1
   - Check neighbors: (2,1) already visited, (1,2) = 0

3. **Total for this region**: 2 + 6 + 8 + 5 + 1 = 22

4. There are no other water cells, so the maximum is 22.

The key insight: We need to find all connected components of water cells and sum their values, then return the maximum sum.

## Brute Force Approach

A naive approach might try to start from every water cell and explore all possible paths. However, this would be extremely inefficient because:

1. You'd repeatedly explore the same connected component from different starting points
2. You'd need to track visited cells to avoid infinite loops
3. The complexity would be astronomical for larger grids

Even if we implemented this carefully, we'd end up essentially doing what the optimal solution does but with redundant work. The brute force would have exponential time complexity in the worst case.

## Optimized Approach

The key insight is that this is a **connected components in a grid** problem. We need to:

1. Traverse the grid
2. Whenever we find an unvisited water cell, perform DFS/BFS to explore the entire connected water region
3. Sum all fish in that region
4. Track the maximum sum across all regions

This is similar to "Number of Islands" and "Max Area of Island", but instead of counting cells or area, we're summing values.

Why DFS/BFS works:

- Water cells form connected components (regions)
- From any cell in a region, you can reach all other cells in that region
- Different regions are separated by land cells (value = 0)
- We can use visited marking to avoid reprocessing cells

## Optimal Solution

We'll use DFS to explore each connected water region. The algorithm:

1. Initialize a visited matrix to track processed cells
2. Iterate through all cells in the grid
3. When we find an unvisited water cell, start DFS from it
4. In DFS: mark as visited, add fish count to current sum, recursively explore all 4-direction neighbors that are water and unvisited
5. Track the maximum sum across all regions

<div class="code-group">

```python
# Time: O(m * n) - we visit each cell at most once
# Space: O(m * n) - for visited matrix and recursion stack in worst case
def findMaxFish(grid):
    m, n = len(grid), len(grid[0])
    visited = [[False] * n for _ in range(m)]
    max_fish = 0

    # Directions: up, down, left, right
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    def dfs(r, c):
        """DFS to explore connected water cells starting from (r, c)."""
        # Base case: out of bounds, land cell, or already visited
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] == 0 or visited[r][c]:
            return 0

        # Mark current cell as visited
        visited[r][c] = True
        # Start with fish in current cell
        total_fish = grid[r][c]

        # Explore all 4 neighbors
        for dr, dc in directions:
            total_fish += dfs(r + dr, c + dc)

        return total_fish

    # Iterate through all cells in the grid
    for r in range(m):
        for c in range(n):
            # Only start DFS from unvisited water cells
            if grid[r][c] > 0 and not visited[r][c]:
                current_fish = dfs(r, c)
                max_fish = max(max_fish, current_fish)

    return max_fish
```

```javascript
// Time: O(m * n) - we visit each cell at most once
// Space: O(m * n) - for visited matrix and recursion stack in worst case
function findMaxFish(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const visited = Array.from({ length: m }, () => Array(n).fill(false));
  let maxFish = 0;

  // Directions: up, down, left, right
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  function dfs(r, c) {
    // Base case: out of bounds, land cell, or already visited
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] === 0 || visited[r][c]) {
      return 0;
    }

    // Mark current cell as visited
    visited[r][c] = true;
    // Start with fish in current cell
    let totalFish = grid[r][c];

    // Explore all 4 neighbors
    for (const [dr, dc] of directions) {
      totalFish += dfs(r + dr, c + dc);
    }

    return totalFish;
  }

  // Iterate through all cells in the grid
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      // Only start DFS from unvisited water cells
      if (grid[r][c] > 0 && !visited[r][c]) {
        const currentFish = dfs(r, c);
        maxFish = Math.max(maxFish, currentFish);
      }
    }
  }

  return maxFish;
}
```

```java
// Time: O(m * n) - we visit each cell at most once
// Space: O(m * n) - for visited matrix and recursion stack in worst case
class Solution {
    public int findMaxFish(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;
        boolean[][] visited = new boolean[m][n];
        int maxFish = 0;

        // Directions: up, down, left, right
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        // Iterate through all cells in the grid
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                // Only start DFS from unvisited water cells
                if (grid[r][c] > 0 && !visited[r][c]) {
                    int currentFish = dfs(grid, r, c, visited, directions);
                    maxFish = Math.max(maxFish, currentFish);
                }
            }
        }

        return maxFish;
    }

    private int dfs(int[][] grid, int r, int c, boolean[][] visited, int[][] directions) {
        int m = grid.length;
        int n = grid[0].length;

        // Base case: out of bounds, land cell, or already visited
        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] == 0 || visited[r][c]) {
            return 0;
        }

        // Mark current cell as visited
        visited[r][c] = true;
        // Start with fish in current cell
        int totalFish = grid[r][c];

        // Explore all 4 neighbors
        for (int[] dir : directions) {
            int nr = r + dir[0];
            int nc = c + dir[1];
            totalFish += dfs(grid, nr, nc, visited, directions);
        }

        return totalFish;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We visit each cell in the grid exactly once
- Each cell is processed at most once (when we mark it as visited)
- The DFS explores each connected component fully before moving on

**Space Complexity: O(m × n)**

- We need a visited matrix of size m × n to track processed cells
- In the worst case (all cells are water), the recursion stack could go as deep as m × n (though in practice it's limited by the grid dimensions)
- Alternative: We could modify the grid in-place by setting visited water cells to 0, which would give O(1) extra space (excluding recursion stack)

## Common Mistakes

1. **Forgetting to mark cells as visited**: This leads to infinite recursion or counting the same fish multiple times. Always mark a cell as visited before exploring its neighbors.

2. **Incorrect boundary checks**: When checking grid[r][c] == 0, do this AFTER checking bounds. If you check grid[r][c] first with invalid indices, you'll get an IndexError. The order should be: bounds check → land/water check → visited check.

3. **Missing the "start anywhere" requirement**: Some candidates try to find the maximum sum path, but the problem allows you to catch ALL fish in a connected region. You don't need to find a path - you automatically get all fish in the region once you enter it.

4. **Not handling empty grid or all-land grid**: If there are no water cells, the answer should be 0. Make sure your code handles this edge case correctly.

## When You'll See This Pattern

This connected components pattern appears in many grid-based problems:

1. **Number of Islands (LeetCode 200)**: Count connected regions of '1's instead of summing values.
2. **Max Area of Island (LeetCode 695)**: Find the largest connected region by cell count instead of sum of values.
3. **Surrounded Regions (LeetCode 130)**: Mark connected components that touch the border.
4. **Walls and Gates (LeetCode 286)**: BFS from multiple starting points.

The pattern: When you need to process all connected cells meeting some condition in a grid, think DFS/BFS with visited tracking. The differences are usually just what you do when you visit a cell (count it, sum its value, modify it, etc.).

## Key Takeaways

1. **Grid connectivity problems often reduce to finding connected components**: Use DFS/BFS to explore regions, marking visited cells to avoid reprocessing.

2. **The visited tracking is crucial**: Without it, you'll either miss cells or process them multiple times. You can use a separate visited matrix or modify the grid in-place.

3. **Order of checks matters**: Always check bounds first, then cell content, then visited status. Getting this wrong causes runtime errors.

4. **Think about what defines a "component"**: Here it's adjacent water cells. In other problems, it might be same-colored pixels, reachable rooms, etc.

Related problems: [Number of Islands](/problem/number-of-islands), [Max Area of Island](/problem/max-area-of-island)
