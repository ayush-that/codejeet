---
title: "How to Solve Disconnect Path in a Binary Matrix by at Most One Flip — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Disconnect Path in a Binary Matrix by at Most One Flip. Medium difficulty, 27.8% acceptance rate. Topics: Array, Dynamic Programming, Depth-First Search, Breadth-First Search, Matrix."
date: "2029-12-17"
category: "dsa-patterns"
tags:
  [
    "disconnect-path-in-a-binary-matrix-by-at-most-one-flip",
    "array",
    "dynamic-programming",
    "depth-first-search",
    "medium",
  ]
---

# How to Solve Disconnect Path in a Binary Matrix by at Most One Flip

This problem asks us to determine if a binary matrix can be disconnected (making it impossible to travel from top-left to bottom-right) by flipping at most one cell from 1 to 0. The tricky part is that we need to check if there exists a _critical cell_ whose removal breaks all possible paths, not just one specific path.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
]
```

In this all-ones matrix, there are many paths from (0,0) to (2,2). If we flip any single cell to 0, there will still be alternative paths around it. For example, flipping (1,1) to 0 still leaves paths like:

- (0,0)→(0,1)→(0,2)→(1,2)→(2,2)
- (0,0)→(1,0)→(2,0)→(2,1)→(2,2)

So this matrix cannot be disconnected by flipping just one cell.

Now consider:

```
grid = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
]
```

Here (1,1) is already 0, so we can't flip it. But if we flip (1,0) to 0, we might disconnect the matrix. Let's check: The only path through (1,0) is now blocked, but are there alternatives? Yes, we can go (0,0)→(0,1)→(0,2)→(1,2)→(2,2). So flipping (1,0) doesn't disconnect it either.

The key insight: We need to find if there exists a cell that lies on _every possible path_ from start to end. If such a cell exists, flipping it will disconnect the matrix.

## Brute Force Approach

A naive approach would be:

1. Check if there's already no path from (0,0) to (m-1,n-1) → return true immediately
2. For each cell (i,j) that's currently 1:
   - Temporarily flip it to 0
   - Check if a path still exists
   - If no path exists, return true
3. If we check all cells and flipping any single one doesn't disconnect, return false

This approach has several problems:

- Time complexity is O(m×n × (m×n)) = O((m×n)²) in worst case
- We're doing BFS/DFS for each cell, which is very inefficient
- We need to be careful about the starting and ending cells (can't flip them since they must be 1 for any path to exist)

The brute force is too slow for typical constraints (m,n up to 1000 would mean ~10¹² operations).

## Optimized Approach

The key insight is that we're looking for a _cut vertex_ or _articulation point_ in the directed grid graph. However, since we can only move right and down, we can use a simpler approach:

1. Find _any_ valid path from (0,0) to (m-1,n-1) using DFS/BFS
2. Mark all cells on this path
3. Try to find a _second_ path that doesn't use any cells from the first path
4. If we can find a second path, then no single cell can disconnect the matrix (because we have two disjoint paths)
5. If we cannot find a second path, then the cells in the first path form a "bottleneck" - one of them must be critical

But wait, there's a subtlety: Even if we can't find a second path that's completely disjoint from the first, there might still be multiple paths that all share the same critical cell. So we need to check each cell on the first path individually.

The optimal approach:

1. Find the first path using DFS/BFS
2. For each cell on this path (except start and end):
   - Temporarily block it
   - Try to find an alternative path that avoids this cell
   - If no alternative path exists, this cell is critical → return true
3. If no critical cell found, return false

This is O(m×n) since we do at most m+n BFS/DFS operations (one for each cell on the first path, and there are at most m+n-1 cells on any path from top-left to bottom-right).

## Optimal Solution

The solution uses two BFS/DFS searches:

1. First BFS to find any path from start to end
2. For each cell on that path (except start and end), temporarily mark it as blocked and try to find an alternative path

<div class="code-group">

```python
# Time: O(m*n) | Space: O(m*n)
def isPossibleToCutPath(self, grid):
    """
    Returns True if we can disconnect the matrix by flipping at most one cell.

    Approach:
    1. First check if there's any path at all (if not, already disconnected)
    2. Find one path using DFS/BFS
    3. For each cell on that path (except start and end), check if removing it
       breaks all paths
    """
    m, n = len(grid), len(grid[0])

    # Helper function for BFS to check if path exists
    def path_exists(blocked_cell=None):
        """Check if a path exists from (0,0) to (m-1,n-1) avoiding blocked_cell."""
        from collections import deque

        # If start or end is 0, no path exists
        if grid[0][0] == 0 or grid[m-1][n-1] == 0:
            return False

        # Initialize BFS
        queue = deque([(0, 0)])
        visited = [[False] * n for _ in range(m)]
        visited[0][0] = True

        # Directions: only right and down
        directions = [(0, 1), (1, 0)]

        while queue:
            r, c = queue.popleft()

            # Reached destination
            if r == m-1 and c == n-1:
                return True

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                # Check bounds, cell value, and not visited
                if (0 <= nr < m and 0 <= nc < n and
                    grid[nr][nc] == 1 and
                    not visited[nr][nc]):

                    # Skip if this is the blocked cell
                    if blocked_cell and (nr, nc) == blocked_cell:
                        continue

                    visited[nr][nc] = True
                    queue.append((nr, nc))

        return False

    # Step 1: Check if any path exists initially
    if not path_exists():
        return True  # Already disconnected

    # Step 2: Find one path and record its cells
    # We'll use DFS to find a path and store it
    path_cells = []
    stack = [(0, 0)]
    visited = [[False] * n for _ in range(m)]
    parent = {}  # To reconstruct path

    while stack:
        r, c = stack.pop()

        if visited[r][c]:
            continue

        visited[r][c] = True

        if r == m-1 and c == n-1:
            # Reconstruct path from end to start
            curr = (r, c)
            while curr != (0, 0):
                path_cells.append(curr)
                curr = parent.get(curr, (0, 0))
            path_cells.append((0, 0))
            path_cells.reverse()
            break

        # Try right then down (order matters for which path we find)
        for dr, dc in [(0, 1), (1, 0)]:
            nr, nc = r + dr, c + dc
            if (0 <= nr < m and 0 <= nc < n and
                grid[nr][nc] == 1 and not visited[nr][nc]):
                parent[(nr, nc)] = (r, c)
                stack.append((nr, nc))

    # Step 3: Check each cell on the path (except start and end)
    # If removing any cell breaks all paths, we can disconnect with one flip
    for i in range(1, len(path_cells) - 1):  # Skip first and last
        r, c = path_cells[i]
        if not path_exists((r, c)):
            return True

    return False
```

```javascript
// Time: O(m*n) | Space: O(m*n)
/**
 * @param {number[][]} grid
 * @return {boolean}
 */
var isPossibleToCutPath = function (grid) {
  const m = grid.length;
  const n = grid[0].length;

  // Helper function to check if path exists avoiding a specific cell
  const pathExists = (blockedCell = null) => {
    // If start or end is 0, no path exists
    if (grid[0][0] === 0 || grid[m - 1][n - 1] === 0) {
      return false;
    }

    // BFS initialization
    const queue = [[0, 0]];
    const visited = Array(m)
      .fill()
      .map(() => Array(n).fill(false));
    visited[0][0] = true;

    // Directions: only right and down
    const directions = [
      [0, 1],
      [1, 0],
    ];

    while (queue.length > 0) {
      const [r, c] = queue.shift();

      // Reached destination
      if (r === m - 1 && c === n - 1) {
        return true;
      }

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        // Check bounds, cell value, and not visited
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1 && !visited[nr][nc]) {
          // Skip if this is the blocked cell
          if (blockedCell && nr === blockedCell[0] && nc === blockedCell[1]) {
            continue;
          }

          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }

    return false;
  };

  // Step 1: Check if any path exists initially
  if (!pathExists()) {
    return true; // Already disconnected
  }

  // Step 2: Find one path and record its cells
  const pathCells = [];
  const stack = [[0, 0]];
  const visited = Array(m)
    .fill()
    .map(() => Array(n).fill(false));
  const parent = new Map(); // To reconstruct path

  while (stack.length > 0) {
    const [r, c] = stack.pop();

    if (visited[r][c]) {
      continue;
    }

    visited[r][c] = true;

    if (r === m - 1 && c === n - 1) {
      // Reconstruct path from end to start
      let curr = [r, c];
      while (!(curr[0] === 0 && curr[1] === 0)) {
        pathCells.push(curr);
        curr = parent.get(curr.join(",")) || [0, 0];
      }
      pathCells.push([0, 0]);
      pathCells.reverse();
      break;
    }

    // Try right then down (order matters for which path we find)
    const directions = [
      [0, 1],
      [1, 0],
    ];
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1 && !visited[nr][nc]) {
        parent.set([nr, nc].join(","), [r, c]);
        stack.push([nr, nc]);
      }
    }
  }

  // Step 3: Check each cell on the path (except start and end)
  // If removing any cell breaks all paths, we can disconnect with one flip
  for (let i = 1; i < pathCells.length - 1; i++) {
    // Skip first and last
    const [r, c] = pathCells[i];
    if (!pathExists([r, c])) {
      return true;
    }
  }

  return false;
};
```

```java
// Time: O(m*n) | Space: O(m*n)
class Solution {
    public boolean isPossibleToCutPath(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        // Step 1: Check if any path exists initially
        if (!pathExists(grid, null)) {
            return true;  // Already disconnected
        }

        // Step 2: Find one path and record its cells
        List<int[]> pathCells = findPath(grid);

        // Step 3: Check each cell on the path (except start and end)
        for (int i = 1; i < pathCells.size() - 1; i++) {  // Skip first and last
            int[] cell = pathCells.get(i);
            if (!pathExists(grid, cell)) {
                return true;
            }
        }

        return false;
    }

    // Helper method to check if path exists avoiding a specific cell
    private boolean pathExists(int[][] grid, int[] blockedCell) {
        int m = grid.length;
        int n = grid[0].length;

        // If start or end is 0, no path exists
        if (grid[0][0] == 0 || grid[m-1][n-1] == 0) {
            return false;
        }

        // BFS initialization
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0});
        boolean[][] visited = new boolean[m][n];
        visited[0][0] = true;

        // Directions: only right and down
        int[][] directions = {{0, 1}, {1, 0}};

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0];
            int c = curr[1];

            // Reached destination
            if (r == m-1 && c == n-1) {
                return true;
            }

            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];

                // Check bounds, cell value, and not visited
                if (nr >= 0 && nr < m && nc >= 0 && nc < n &&
                    grid[nr][nc] == 1 && !visited[nr][nc]) {

                    // Skip if this is the blocked cell
                    if (blockedCell != null && nr == blockedCell[0] && nc == blockedCell[1]) {
                        continue;
                    }

                    visited[nr][nc] = true;
                    queue.offer(new int[]{nr, nc});
                }
            }
        }

        return false;
    }

    // Helper method to find one path from start to end
    private List<int[]> findPath(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        List<int[]> path = new ArrayList<>();
        Stack<int[]> stack = new Stack<>();
        stack.push(new int[]{0, 0});
        boolean[][] visited = new boolean[m][n];
        Map<String, int[]> parent = new HashMap<>();

        while (!stack.isEmpty()) {
            int[] curr = stack.pop();
            int r = curr[0];
            int c = curr[1];

            if (visited[r][c]) {
                continue;
            }

            visited[r][c] = true;

            if (r == m-1 && c == n-1) {
                // Reconstruct path from end to start
                int[] node = new int[]{r, c};
                while (!(node[0] == 0 && node[1] == 0)) {
                    path.add(node);
                    node = parent.get(node[0] + "," + node[1]);
                }
                path.add(new int[]{0, 0});
                Collections.reverse(path);
                return path;
            }

            // Try right then down (order matters for which path we find)
            int[][] directions = {{0, 1}, {1, 0}};
            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n &&
                    grid[nr][nc] == 1 && !visited[nr][nc]) {
                    parent.put(nr + "," + nc, new int[]{r, c});
                    stack.push(new int[]{nr, nc});
                }
            }
        }

        return path;  // Empty if no path found
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m×n)

- The initial path check takes O(m×n)
- Finding the first path takes O(m×n)
- For each of the O(m+n) cells on the first path (at most m+n-1 cells in any monotonic path), we do a BFS that takes O(m×n)
- Total: O(m×n) + O(m×n) + O((m+n)×(m×n)) = O((m+n)×(m×n))
- But wait, m+n ≤ 2×max(m,n), and m×n is the grid size, so this is O((m+n)×(m×n)) = O(max(m,n)×(m×n))
- In the worst case where m ≈ n, this is O(n³), not O(m×n) as claimed earlier

Actually, let's correct this: The solution above does BFS for each cell on the path, and there can be O(m+n) cells on a path. So worst-case time is O((m+n) × m×n). For a square grid (m=n), this is O(n³).

There's a more efficient O(m×n) solution using two DFS/BFS passes that check if there are two vertex-disjoint paths, but the solution above is easier to understand and implement in an interview setting.

**Space Complexity:** O(m×n)

- We store visited arrays of size m×n
- The BFS/DFS queue/stack can hold up to O(m×n) elements in worst case
- The path storage takes O(m+n) space

## Common Mistakes

1. **Forgetting to check start and end cells**: The starting cell (0,0) and ending cell (m-1,n-1) must be 1 for any path to exist. If they're 0, the matrix is already disconnected.

2. **Not handling the case where no initial path exists**: If there's no path from start to end initially, we should return true immediately since the matrix is already disconnected.

3. **Incorrectly checking all cells instead of just path cells**: Checking every cell in the grid (not just those on a path) leads to O((m×n)²) time complexity, which is too slow for large grids.

4. **Using the wrong movement directions**: The problem only allows moving right or down. Using up/left movements will find invalid paths.

5. **Not considering that flipping a cell from 0 to 1 is not allowed**: We can only flip 1s to 0s, not 0s to 1s. Some candidates mistakenly think they can flip any cell.

## When You'll See This Pattern

This problem uses the concept of finding _critical nodes_ in a graph - nodes whose removal disconnects the graph. Similar patterns appear in:

1. **Articulation Points in Graphs** (LeetCode 1192): Finding critical connections in a network where removing an edge disconnects the graph.

2. **Minimum Number of Days to Disconnect Island** (LeetCode 1568): Determining how many land cells need to be removed to disconnect an island in a grid.

3. **Minimum Cost to Make at Least One Valid Path in a Grid** (LeetCode 1368): Finding the minimum modifications needed to ensure a path exists, which involves analyzing path dependencies.

The core technique of finding a path, then testing the importance of each element on that path, appears in many network flow and connectivity problems.

## Key Takeaways

1. **Look for bottlenecks**: When asked if removing one element disconnects a system, you're looking for elements that appear in every possible path between two points.

2. **Find one path first, then analyze it**: Often easier than analyzing all possible paths simultaneously. The first path gives you candidates to test.

3. **Monotonic paths have limited length**: In grids where you can only move right/down, any path has at most m+n-1 cells, which limits the number of candidates to test.

4. **Start and end points are special**: They cannot be "flipped" if you want any path to exist at all.

Related problems: [Number of Submatrices That Sum to Target](/problem/number-of-submatrices-that-sum-to-target), [Minimum Cost to Make at Least One Valid Path in a Grid](/problem/minimum-cost-to-make-at-least-one-valid-path-in-a-grid), [Minimum Number of Days to Disconnect Island](/problem/minimum-number-of-days-to-disconnect-island)
