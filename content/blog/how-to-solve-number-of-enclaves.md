---
title: "How to Solve Number of Enclaves — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Enclaves. Medium difficulty, 71.5% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Union-Find, Matrix."
date: "2027-08-01"
category: "dsa-patterns"
tags: ["number-of-enclaves", "array", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Number of Enclaves

This problem asks us to count land cells (1's) in a grid that cannot reach the boundary through adjacent land cells. The tricky part is that we need to identify which land cells are "trapped" versus which can "escape" to the edge. It's essentially a connectivity problem where we need to find connected components of land that are completely surrounded by water or grid boundaries.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
1 1 1 0
1 0 1 0
1 1 1 0
0 0 0 0
```

**Step 1:** We look at boundary cells. Any land cell (1) on the boundary can "escape" to the edge, and all land cells connected to it can also escape.

**Step 2:** Mark all boundary-connected land cells:

- Top row: (0,0), (0,1), (0,2) are all connected and on boundary → mark as "can escape"
- Left column: (1,0), (2,0) are connected to boundary land → mark as "can escape"
- Right column: No land on right boundary
- Bottom row: No land on bottom boundary

**Step 3:** After marking all boundary-connected land, we have:

```
E E E 0
E 0 E 0
E E E 0
0 0 0 0
```

(E = can escape, 0 = water)

**Step 4:** Count remaining unmarked land cells (enclaves):

- Only cell (1,1) is water
- No land cells remain unmarked

**Result:** 0 enclaves

Now consider another example:

```
1 0 0 0
1 0 1 0
1 1 1 0
0 0 0 0
```

After marking boundary-connected land:

```
E 0 0 0
E 0 1 0  ← This 1 is NOT connected to boundary!
E E E 0
0 0 0 0
```

The land cell at (1,2) is surrounded by water and cannot reach the boundary → it's an enclave.

**Result:** 1 enclave

## Brute Force Approach

A naive approach would be to check every land cell and see if it can reach the boundary through adjacent land cells. For each land cell, we could perform DFS/BFS to try to find a path to the boundary.

**Why this fails:**

1. **Extreme inefficiency:** We'd be doing O(m×n) searches, each potentially visiting O(m×n) cells → O((m×n)²) time complexity.
2. **Redundant work:** We'd be exploring the same cells repeatedly for different starting points.
3. **No early pruning:** We can't easily determine if a cell is part of an enclave without exploring its entire connected component.

The brute force approach quickly becomes impractical for even moderately sized grids (100×100 would be 10⁸ operations).

## Optimized Approach

The key insight is to **work backwards**: instead of checking which land cells can't escape, identify which land cells CAN escape (those connected to the boundary), then count the ones that can't.

**Step-by-step reasoning:**

1. **Boundary-first approach:** Start from all land cells on the grid's boundary. These are guaranteed to not be enclaves since they're already at the edge.
2. **Flood fill from boundary:** Use DFS or BFS to mark all land cells connected to boundary land cells as "non-enclave."
3. **Count remaining land:** After marking, any unmarked land cells must be enclaves since they're not connected to the boundary.
4. **In-place marking:** We can mark cells by changing their value (e.g., from 1 to 0 or to a special marker) to avoid extra space.

This approach is efficient because:

- We only traverse each cell at most twice (once for boundary marking, once for counting)
- We leverage the grid itself for marking, minimizing space usage
- The boundary cells give us natural starting points for our search

## Optimal Solution

The optimal solution uses DFS/BFS from boundary land cells to mark all reachable land, then counts the remaining unmarked land cells.

<div class="code-group">

```python
# Time: O(m×n) | Space: O(m×n) for recursion stack in worst case
class Solution:
    def numEnclaves(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])

        # DFS function to mark all land cells connected to (i,j) as visited
        def dfs(i, j):
            # Base cases: out of bounds or not land
            if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] != 1:
                return

            # Mark this cell as visited by changing it to 0
            grid[i][j] = 0

            # Explore all 4 directions
            dfs(i+1, j)  # down
            dfs(i-1, j)  # up
            dfs(i, j+1)  # right
            dfs(i, j-1)  # left

        # Step 1: Mark all boundary-connected land cells
        # Check first and last row
        for j in range(n):
            if grid[0][j] == 1:  # top row
                dfs(0, j)
            if grid[m-1][j] == 1:  # bottom row
                dfs(m-1, j)

        # Check first and last column (skip corners to avoid redundant checks)
        for i in range(m):
            if grid[i][0] == 1:  # left column
                dfs(i, 0)
            if grid[i][n-1] == 1:  # right column
                dfs(i, n-1)

        # Step 2: Count remaining land cells (enclaves)
        enclaves = 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 1:
                    enclaves += 1

        return enclaves
```

```javascript
// Time: O(m×n) | Space: O(m×n) for recursion stack in worst case
function numEnclaves(grid) {
  const m = grid.length;
  const n = grid[0].length;

  // DFS function to mark all connected land cells
  const dfs = (i, j) => {
    // Base cases: out of bounds or not land
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== 1) {
      return;
    }

    // Mark as visited by setting to 0
    grid[i][j] = 0;

    // Explore all 4 directions
    dfs(i + 1, j); // down
    dfs(i - 1, j); // up
    dfs(i, j + 1); // right
    dfs(i, j - 1); // left
  };

  // Step 1: Mark boundary-connected land cells
  // Check top and bottom rows
  for (let j = 0; j < n; j++) {
    if (grid[0][j] === 1) {
      dfs(0, j);
    }
    if (grid[m - 1][j] === 1) {
      dfs(m - 1, j);
    }
  }

  // Check left and right columns (skip corners already checked)
  for (let i = 0; i < m; i++) {
    if (grid[i][0] === 1) {
      dfs(i, 0);
    }
    if (grid[i][n - 1] === 1) {
      dfs(i, n - 1);
    }
  }

  // Step 2: Count remaining land cells (enclaves)
  let enclaves = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        enclaves++;
      }
    }
  }

  return enclaves;
}
```

```java
// Time: O(m×n) | Space: O(m×n) for recursion stack in worst case
class Solution {
    public int numEnclaves(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        // Step 1: Mark all boundary-connected land cells
        // Check first and last row
        for (int j = 0; j < n; j++) {
            if (grid[0][j] == 1) {
                dfs(grid, 0, j, m, n);
            }
            if (grid[m-1][j] == 1) {
                dfs(grid, m-1, j, m, n);
            }
        }

        // Check first and last column
        for (int i = 0; i < m; i++) {
            if (grid[i][0] == 1) {
                dfs(grid, i, 0, m, n);
            }
            if (grid[i][n-1] == 1) {
                dfs(grid, i, n-1, m, n);
            }
        }

        // Step 2: Count remaining land cells (enclaves)
        int enclaves = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    enclaves++;
                }
            }
        }

        return enclaves;
    }

    private void dfs(int[][] grid, int i, int j, int m, int n) {
        // Base cases: out of bounds or not land
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] != 1) {
            return;
        }

        // Mark as visited by setting to 0
        grid[i][j] = 0;

        // Explore all 4 directions
        dfs(grid, i+1, j, m, n);  // down
        dfs(grid, i-1, j, m, n);  // up
        dfs(grid, i, j+1, m, n);  // right
        dfs(grid, i, j-1, m, n);  // left
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m×n)

- We visit each cell at most twice: once during boundary DFS/BFS, once during counting.
- In the worst case (all cells are land), DFS will visit every cell once from the boundary.
- Each cell's processing is O(1) after it's marked.

**Space Complexity:** O(m×n) in worst case

- For DFS recursion stack: In the worst case (a large connected land mass), the recursion depth could be m×n.
- For BFS queue: Would also be O(m×n) in worst case.
- We could optimize to O(min(m,n)) using BFS with iterative queue, but DFS is simpler to implement.

**Note:** The space complexity is for the recursion stack/queue. We're modifying the input grid in-place, so no additional O(m×n) storage is needed beyond the recursion.

## Common Mistakes

1. **Forgetting to check all four boundaries:** Candidates often check only two sides or miss corners. Remember to check top, bottom, left, AND right boundaries.

2. **Modifying the grid incorrectly:** Some candidates create a separate visited array, which uses extra O(m×n) space. The optimal solution modifies the grid in-place by changing boundary-connected land to 0 or another marker.

3. **Incorrect base cases in DFS:** Forgetting to check `grid[i][j] != 1` before recursing can cause infinite recursion or incorrect marking.

4. **Counting before marking:** Doing the count first, then trying to subtract boundary-connected cells is error-prone. It's cleaner to mark first, then count what's left.

5. **Using the wrong traversal order:** BFS and DFS both work, but DFS recursion can hit stack limits for large grids. For very large grids, iterative BFS or DFS with an explicit stack is safer.

## When You'll See This Pattern

This "boundary flood fill" or "reverse thinking" pattern appears in several grid problems:

1. **Number of Islands (LeetCode 200)** - Similar connectivity problem, but here we count all connected components instead of boundary-connected ones.

2. **Surrounded Regions (LeetCode 130)** - Almost identical problem! Instead of counting enclaves, you mark surrounded 'O's as 'X's. The solution approach is exactly the same: mark boundary-connected 'O's first, then convert remaining 'O's.

3. **Pacific Atlantic Water Flow (LeetCode 417)** - Uses the same boundary-first approach but from two different boundaries, then finds intersections.

4. **Walls and Gates (LeetCode 286)** - Multi-source BFS starting from all gates (boundary-like positions).

The core pattern: When you need to find elements that are "trapped" or "isolated" from boundaries, start from the boundaries and mark everything reachable, then examine what's left.

## Key Takeaways

1. **Think backwards:** Instead of finding what's trapped, find what can escape and see what's left. This boundary-first approach is often more efficient for enclosure problems.

2. **In-place modification:** When allowed, use the input grid itself to mark visited cells (changing 1 to 0 or another value) to save space.

3. **Multi-source traversal:** Starting DFS/BFS from multiple boundary points simultaneously is efficient and natural for this problem type.

4. **Recognize the pattern:** Any problem asking for "enclosed" or "surrounded" regions in a grid likely uses this boundary flood fill technique.

[Practice this problem on CodeJeet](/problem/number-of-enclaves)
