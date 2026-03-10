---
title: "How to Solve Minimum Number of Days to Disconnect Island — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Number of Days to Disconnect Island. Hard difficulty, 58.8% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Matrix, Strongly Connected Component."
date: "2027-06-30"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-days-to-disconnect-island",
    "array",
    "depth-first-search",
    "breadth-first-search",
    "hard",
  ]
---

# How to Solve Minimum Number of Days to Disconnect Island

You're given a binary grid where land cells (1) form islands through 4-directional connections. The problem asks: what's the minimum number of land cells you need to convert to water (0) so the grid becomes disconnected (has either 0 islands or more than 1 island)? This is tricky because islands can be disconnected in multiple ways—by splitting one island into two, or by completely removing an island—and we need to find the absolute minimum number of cell changes.

What makes this problem interesting is that the answer is surprisingly small: it's always at most 2. The real challenge is determining whether the answer is 0, 1, or 2 through careful analysis of the grid's connectivity structure.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
Grid:
1 1 1
1 1 1
1 1 1
```

This is a single 3×3 island. Is it already disconnected? No—it's one connected island. Can we disconnect it in 0 days? No, because it's currently connected.

What about 1 day? Let's test removing the center cell:

```
1 1 1
1 0 1
1 1 1
```

The land cells still form a ring—they're all connected through the perimeter. The grid still has exactly one island. What about removing a corner?

```
0 1 1
1 1 1
1 1 1
```

The remaining land cells are still connected. In fact, for this solid block, removing any single cell leaves the rest connected. So 1 day isn't enough.

What about 2 days? Remove two adjacent cells:

```
0 0 1
1 1 1
1 1 1
```

Now the top-right cell is isolated from the rest! We have two separate islands. So for this grid, the answer is 2.

Now consider a grid with a "bridge" structure:

```
1 1 0
0 1 1
0 0 1
```

Here, the middle cell (row 1, col 1) connects three arms. Removing just that cell would disconnect the grid into three pieces! So for this grid, the answer is 1.

## Brute Force Approach

A naive approach would be to try removing every possible combination of k cells (starting with k=0, then k=1, then k=2) until we find a configuration that disconnects the grid. For each k, we'd need to:

1. Generate all combinations of k land cells to remove
2. For each combination, create a modified grid with those cells set to water
3. Count the number of islands using DFS/BFS
4. Check if we have 0 or ≥2 islands

The problem with this approach is combinatorial explosion. For an m×n grid with L land cells, trying k removals requires checking C(L, k) combinations. Even for k=2 with moderate-sized grids, this becomes impractical (O(L²) combinations, each requiring O(mn) time for island counting).

More importantly, we don't need to check beyond k=2! The key insight (which we'll prove in the optimized approach) is that the answer never exceeds 2. So our brute force would need to check at most C(L, 0) + C(L, 1) + C(L, 2) combinations, which is O(L²). While this might work for small grids, it's inefficient for the problem constraints.

## Optimized Approach

The optimized solution relies on these critical observations:

1. **Answer bounds**: The answer is always 0, 1, or 2.
   - 0 if the grid is already disconnected (0 or ≥2 islands)
   - 1 if there exists a single cell whose removal disconnects the grid
   - 2 otherwise

2. **Why at most 2?** In the worst case, we can remove two adjacent cells from any island to disconnect it. This works because:
   - Any island has at least one cell with degree ≤ 2 (a corner or edge cell)
   - Removing that cell and one of its neighbors will separate it from the rest
   - This is essentially finding an "articulation point" in the grid graph

3. **Checking for answer = 1**: We need to determine if there's a **cut vertex**—a land cell whose removal increases the number of islands. We can test each land cell by:
   - Temporarily setting it to water
   - Counting islands in the modified grid
   - If islands ≠ 1 (either 0 or ≥2), then this cell is a cut vertex

4. **Optimization**: We don't need to check all land cells exhaustively. If the initial grid has 0 or ≥2 islands, answer is 0. Otherwise, we check if answer is 1 by looking for cut vertices. If none exist, answer is 2.

The step-by-step reasoning:

1. Count initial islands. If not exactly 1, return 0.
2. Check if removing any single land cell creates ≠1 island.
3. If found, return 1.
4. Otherwise, return 2.

## Optimal Solution

<div class="code-group">

```python
# Time: O((m*n)^2) in worst case, but typically much faster due to early termination
# Space: O(m*n) for DFS/BFS recursion stack
class Solution:
    def minDays(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])

        # Helper function to count islands using DFS
        def count_islands(modified_grid):
            visited = [[False] * n for _ in range(m)]
            island_count = 0

            def dfs(r, c):
                if (r < 0 or r >= m or c < 0 or c >= n or
                    modified_grid[r][c] == 0 or visited[r][c]):
                    return
                visited[r][c] = True
                # Explore 4-directional neighbors
                for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
                    dfs(r + dr, c + dc)

            for i in range(m):
                for j in range(n):
                    if modified_grid[i][j] == 1 and not visited[i][j]:
                        island_count += 1
                        dfs(i, j)

            return island_count

        # Step 1: Check if already disconnected
        initial_islands = count_islands(grid)
        if initial_islands != 1:
            return 0  # Already disconnected (0 or multiple islands)

        # Step 2: Check if removing any single cell disconnects the grid
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 1:
                    # Create a copy with this cell removed
                    modified = [row[:] for row in grid]
                    modified[i][j] = 0

                    islands_after_removal = count_islands(modified)
                    if islands_after_removal != 1:
                        return 1  # Found a cut vertex

        # Step 3: If no single cell works, answer is 2
        return 2
```

```javascript
// Time: O((m*n)^2) in worst case, but typically much faster due to early termination
// Space: O(m*n) for DFS/BFS recursion stack
var minDays = function (grid) {
  const m = grid.length,
    n = grid[0].length;

  // Helper function to count islands using DFS
  const countIslands = (modifiedGrid) => {
    const visited = Array(m)
      .fill()
      .map(() => Array(n).fill(false));
    let islandCount = 0;

    const dfs = (r, c) => {
      if (r < 0 || r >= m || c < 0 || c >= n || modifiedGrid[r][c] === 0 || visited[r][c]) {
        return;
      }
      visited[r][c] = true;
      // Explore 4-directional neighbors
      const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];
      for (const [dr, dc] of directions) {
        dfs(r + dr, c + dc);
      }
    };

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (modifiedGrid[i][j] === 1 && !visited[i][j]) {
          islandCount++;
          dfs(i, j);
        }
      }
    }

    return islandCount;
  };

  // Step 1: Check if already disconnected
  const initialIslands = countIslands(grid);
  if (initialIslands !== 1) {
    return 0; // Already disconnected (0 or multiple islands)
  }

  // Step 2: Check if removing any single cell disconnects the grid
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        // Create a copy with this cell removed
        const modified = grid.map((row) => [...row]);
        modified[i][j] = 0;

        const islandsAfterRemoval = countIslands(modified);
        if (islandsAfterRemoval !== 1) {
          return 1; // Found a cut vertex
        }
      }
    }
  }

  // Step 3: If no single cell works, answer is 2
  return 2;
};
```

```java
// Time: O((m*n)^2) in worst case, but typically much faster due to early termination
// Space: O(m*n) for DFS/BFS recursion stack
class Solution {
    public int minDays(int[][] grid) {
        int m = grid.length, n = grid[0].length;

        // Step 1: Check if already disconnected
        int initialIslands = countIslands(grid);
        if (initialIslands != 1) {
            return 0;  // Already disconnected (0 or multiple islands)
        }

        // Step 2: Check if removing any single cell disconnects the grid
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    // Create a copy with this cell removed
                    int[][] modified = new int[m][n];
                    for (int r = 0; r < m; r++) {
                        System.arraycopy(grid[r], 0, modified[r], 0, n);
                    }
                    modified[i][j] = 0;

                    int islandsAfterRemoval = countIslands(modified);
                    if (islandsAfterRemoval != 1) {
                        return 1;  // Found a cut vertex
                    }
                }
            }
        }

        // Step 3: If no single cell works, answer is 2
        return 2;
    }

    // Helper function to count islands using DFS
    private int countIslands(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        boolean[][] visited = new boolean[m][n];
        int islandCount = 0;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1 && !visited[i][j]) {
                    islandCount++;
                    dfs(grid, visited, i, j);
                }
            }
        }

        return islandCount;
    }

    private void dfs(int[][] grid, boolean[][] visited, int r, int c) {
        int m = grid.length, n = grid[0].length;
        if (r < 0 || r >= m || c < 0 || c >= n ||
            grid[r][c] == 0 || visited[r][c]) {
            return;
        }

        visited[r][c] = true;
        // Explore 4-directional neighbors
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int[] dir : directions) {
            dfs(grid, visited, r + dir[0], c + dir[1]);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**:

- In the worst case: O((m×n)²) because we might check every land cell (O(m×n)) and for each check, we run DFS/BFS (O(m×n)).
- However, in practice it's often faster because:
  1. We return immediately if initial islands ≠ 1 (O(m×n))
  2. We return as soon as we find a cut vertex
  3. The DFS for counting islands visits each cell at most once per check

**Space Complexity**: O(m×n) for:

- The visited array in DFS/BFS (O(m×n))
- The recursion stack in DFS (O(m×n) in worst case for a completely connected island)
- The grid copy when testing cell removal (O(m×n))

## Common Mistakes

1. **Not checking the initial state**: Candidates often jump straight to looking for cut vertices without first checking if the grid is already disconnected. Always count initial islands first!

2. **Incorrect island counting**: Forgetting to mark cells as visited during DFS/BFS leads to infinite recursion or incorrect counts. Always use a visited array/set.

3. **Modifying the original grid**: When testing cell removal, you must work on a copy. Modifying the original grid affects subsequent tests.

4. **Misunderstanding "disconnected"**: Disconnected means either 0 islands OR more than 1 island. Some candidates only check for >1 island and miss the case where removing all land results in 0 islands.

5. **Overcomplicating with Tarjan's algorithm**: While Tarjan's algorithm finds articulation points in O(V+E) time, implementing it correctly under interview pressure is error-prone. The simpler O((m×n)²) approach is usually acceptable and safer.

## When You'll See This Pattern

This problem combines **grid traversal** (DFS/BFS) with **connectivity analysis** (finding cut vertices). You'll see similar patterns in:

1. **Critical Connections in a Network (LeetCode 1192)**: Finds bridges (edges whose removal disconnects the graph) rather than articulation points. Uses Tarjan's algorithm for O(V+E) solution.

2. **Number of Islands (LeetCode 200)**: The basic island counting problem that forms the foundation for this one. Uses the same DFS/BFS approach.

3. **Regions Cut By Slashes (LeetCode 959)**: Another grid connectivity problem where you need to determine connectivity through clever graph modeling.

4. **Disconnect Path in a Binary Matrix by at Most One Flip (LeetCode 2556)**: Very similar concept—checking if removing/disconnecting a single element changes connectivity.

## Key Takeaways

1. **The answer is bounded**: For grid connectivity problems, always check if the answer has known bounds (0, 1, 2 in this case). This can dramatically simplify the solution.

2. **Test incremental removal**: When looking for minimum removals to disconnect, test from smallest to largest (0, then 1, then 2...).

3. **Copy before modifying**: When testing "what if" scenarios (like removing a cell), always work on copies to avoid affecting subsequent tests.

4. **Simple often beats optimal**: An O((m×n)²) solution that's correct and understandable is better than an O(m×n) solution with bugs. Know when to prioritize correctness over optimality.

Related problems: [Disconnect Path in a Binary Matrix by at Most One Flip](/problem/disconnect-path-in-a-binary-matrix-by-at-most-one-flip), [Minimum Runes to Add to Cast Spell](/problem/minimum-runes-to-add-to-cast-spell)
