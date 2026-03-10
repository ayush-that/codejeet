---
title: "How to Solve Number of Islands — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Islands. Medium difficulty, 63.8% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Union-Find, Matrix."
date: "2026-03-06"
category: "dsa-patterns"
tags: ["number-of-islands", "array", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Number of Islands

The Number of Islands problem asks us to count distinct connected components of land (`'1'`) in a 2D grid, where connectivity is defined by horizontal and vertical adjacency. What makes this problem interesting is that it's a classic graph traversal problem disguised as a grid problem—each cell is a node, and edges exist between adjacent land cells. The challenge lies in efficiently exploring each island exactly once without double-counting.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
```

**Step 1:** Start at (0,0) - it's land ("1"). This is a new island, so we increment count to 1. We need to explore all connected land cells to mark this entire island as visited. Using DFS or BFS, we'd visit (0,1), (1,0), and (1,1) - all connected land cells. We mark them as visited (or change them to "0" to avoid revisiting).

**Step 2:** Continue scanning. (0,2) is water ("0") - skip. (0,3) water - skip. (0,4) water - skip.

**Step 3:** Move to row 1. Cells (1,0) and (1,1) are already visited (marked as "0") from our first island exploration - skip.

**Step 4:** Continue scanning. (2,2) is land ("1") - this is a new island! Increment count to 2. Explore connected cells: there are no adjacent land cells, so we just mark (2,2) as visited.

**Step 5:** Continue scanning. (3,3) is land ("1") - another new island! Increment count to 3. Explore connected cells: (3,4) is also land, so we mark both as visited.

**Final count:** 3 islands.

The key insight: whenever we encounter an unvisited land cell, we've found a new island. We then need to explore and mark all connected land cells to avoid counting them again later.

## Brute Force Approach

A naive approach might try to track visited cells in a separate data structure while scanning the grid. However, the real "brute force" thinking here would be to treat each land cell as potentially its own island and then somehow check connectivity—but this quickly becomes complex.

The inefficient approach candidates sometimes attempt is to use a nested loop that checks every cell and then recursively checks neighbors without any visited tracking, leading to infinite recursion or exponential time complexity. Another naive approach might try to use a complex union-find without path compression or union by rank, which would work but be less efficient than the optimized version.

The core issue with any unoptimized approach is either:

1. Revisiting the same cell multiple times (exponential time)
2. Using excessive space by storing full copies of the grid
3. Implementing graph traversal incorrectly (stack overflow, infinite loops)

## Optimized Approach

The optimal solution uses one of three patterns:

1. **DFS (Depth-First Search):** When we find land, we recursively explore all connected land cells, marking them as visited (usually by changing "1" to "0" or using a separate visited set).

2. **BFS (Breadth-First Search):** Same concept as DFS but using a queue instead of recursion. This avoids potential stack overflow for very large islands.

3. **Union-Find (Disjoint Set Union):** Treat each land cell as its own set, then union adjacent land cells. The number of distinct sets equals the number of islands.

The key insight for all approaches: **modify the grid in-place or track visited cells to avoid re-processing**. By changing "1" to "0" when we visit land, we use the grid itself as our visited tracker with O(1) extra space.

DFS is often the most intuitive: when we find land, we "sink" the entire island by changing all connected "1"s to "0"s. This ensures we only count each island once.

## Optimal Solution

Here's the DFS solution with in-place modification:

<div class="code-group">

```python
# Time: O(m * n) where m = rows, n = columns
# Space: O(min(m, n)) for recursion stack in worst case, or O(m * n) if grid is all land
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        # Edge case: empty grid
        if not grid or not grid[0]:
            return 0

        rows, cols = len(grid), len(grid[0])
        islands = 0

        def dfs(r, c):
            """Depth-first search to mark entire island as visited."""
            # Base cases: out of bounds or not land
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
                return

            # Mark current cell as visited by changing '1' to '0'
            grid[r][c] = '0'

            # Recursively visit all adjacent cells (up, down, left, right)
            dfs(r + 1, c)  # down
            dfs(r - 1, c)  # up
            dfs(r, c + 1)  # right
            dfs(r, c - 1)  # left

        # Iterate through every cell in the grid
        for r in range(rows):
            for c in range(cols):
                # If we find unvisited land, we've discovered a new island
                if grid[r][c] == '1':
                    islands += 1
                    # Sink the entire island by marking all connected land as visited
                    dfs(r, c)

        return islands
```

```javascript
// Time: O(m * n) where m = rows, n = columns
// Space: O(min(m, n)) for recursion stack in worst case, or O(m * n) if grid is all land
function numIslands(grid) {
  // Edge case: empty grid
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    return 0;
  }

  const rows = grid.length;
  const cols = grid[0].length;
  let islands = 0;

  // Depth-first search helper function
  const dfs = (r, c) => {
    // Base cases: out of bounds or not land
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== "1") {
      return;
    }

    // Mark current cell as visited by changing '1' to '0'
    grid[r][c] = "0";

    // Recursively visit all adjacent cells
    dfs(r + 1, c); // down
    dfs(r - 1, c); // up
    dfs(r, c + 1); // right
    dfs(r, c - 1); // left
  };

  // Iterate through every cell in the grid
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // If we find unvisited land, we've discovered a new island
      if (grid[r][c] === "1") {
        islands++;
        // Sink the entire island by marking all connected land as visited
        dfs(r, c);
      }
    }
  }

  return islands;
}
```

```java
// Time: O(m * n) where m = rows, n = columns
// Space: O(min(m, n)) for recursion stack in worst case, or O(m * n) if grid is all land
class Solution {
    public int numIslands(char[][] grid) {
        // Edge case: empty grid
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }

        int rows = grid.length;
        int cols = grid[0].length;
        int islands = 0;

        // Iterate through every cell in the grid
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                // If we find unvisited land, we've discovered a new island
                if (grid[r][c] == '1') {
                    islands++;
                    // Sink the entire island by marking all connected land as visited
                    dfs(grid, r, c, rows, cols);
                }
            }
        }

        return islands;
    }

    private void dfs(char[][] grid, int r, int c, int rows, int cols) {
        // Base cases: out of bounds or not land
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1') {
            return;
        }

        // Mark current cell as visited by changing '1' to '0'
        grid[r][c] = '0';

        // Recursively visit all adjacent cells
        dfs(grid, r + 1, c, rows, cols);  // down
        dfs(grid, r - 1, c, rows, cols);  // up
        dfs(grid, r, c + 1, rows, cols);  // right
        dfs(grid, r, c - 1, rows, cols);  // left
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n) where m is the number of rows and n is the number of columns. We visit each cell at most twice: once during the main scan, and potentially once during DFS/BFS. Even with recursion, each cell's processing is constant time.

**Space Complexity:**

- For DFS with recursion: O(min(m, n)) in the worst case due to recursion stack depth. The worst-case recursion depth happens with a snaking island (like a diagonal line), where the maximum depth is min(m, n).
- For BFS with queue: O(min(m, n)) for the queue in worst case.
- If we used a separate visited matrix instead of modifying in-place: O(m × n) additional space.
- If the entire grid is land and we use DFS: O(m × n) recursion depth in worst case (though this is extreme and unlikely in practice).

The in-place modification (changing "1" to "0") is key to achieving O(1) extra space beyond the recursion/queue.

## Common Mistakes

1. **Forgetting to check grid boundaries in DFS/BFS:** This leads to ArrayIndexOutOfBounds exceptions. Always check `r >= 0 && r < rows && c >= 0 && c < cols` before accessing `grid[r][c]`.

2. **Not handling empty input:** If the grid is null or empty, return 0 immediately. Candidates often jump straight into accessing `grid[0].length` without checking if the grid has any rows.

3. **Using the wrong comparison for land:** The problem specifies characters `'1'` and `'0'`, not integers 1 and 0. Comparing with the wrong type (`grid[r][c] == 1` instead of `grid[r][c] == '1'`) causes logic errors.

4. **Double-counting islands:** Without proper visited tracking, the same land cell might trigger multiple island counts. The DFS/BFS must mark all connected land as visited before continuing the scan.

5. **Stack overflow with DFS on large grids:** For very large islands, recursion depth might exceed stack limits. In such cases, BFS with a queue is safer, or you can implement iterative DFS with a stack.

## When You'll See This Pattern

This connected components pattern appears in many grid-based problems:

1. **Surrounded Regions (Medium):** Similar DFS/BFS traversal to mark regions, but with the additional constraint of only flipping regions not connected to the border.

2. **Walls and Gates (Medium):** Multi-source BFS from all gates simultaneously to compute distances to nearest gate for each empty room.

3. **Max Area of Island (Easy):** Almost identical to Number of Islands, but instead of counting islands, you find the maximum size of any island.

4. **Number of Islands II (Hard):** Dynamic version where land cells are added one by one, requiring Union-Find to efficiently handle incremental connectivity queries.

The pattern is: "When you need to find connected regions in a grid, think DFS/BFS to explore each region fully before moving to the next."

## Key Takeaways

1. **Grid problems are often graph problems in disguise:** Each cell is a node, with edges to adjacent cells. Recognizing this lets you apply standard graph algorithms.

2. **In-place modification can reduce space complexity:** By changing visited land from "1" to "0", we avoid needing a separate visited matrix, achieving optimal O(1) extra space (beyond recursion stack).

3. **DFS vs BFS choice matters:** DFS is simpler to implement recursively but risks stack overflow. BFS uses a queue and is more memory-efficient for wide islands. Both have the same time complexity.

4. **Always handle the four directions systematically:** Up, down, left, right. Missing a direction means you won't explore the entire island.

Related problems: [Surrounded Regions](/problem/surrounded-regions), [Walls and Gates](/problem/walls-and-gates), [Number of Islands II](/problem/number-of-islands-ii)
