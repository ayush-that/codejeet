---
title: "How to Solve Shortest Bridge — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Shortest Bridge. Medium difficulty, 59.3% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Matrix."
date: "2028-03-11"
category: "dsa-patterns"
tags: ["shortest-bridge", "array", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Shortest Bridge

You're given an `n x n` grid with exactly two islands (connected groups of 1's), and you need to find the minimum number of 0's to flip to 1's to connect them. This problem is interesting because it combines graph traversal techniques (DFS and BFS) in a clever way to efficiently find the shortest distance between two components in a grid.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [
    [1,1,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,1],
    [0,0,0,1,1],
    [0,0,0,1,1]
]
```

**Step 1: Identify the first island**
We start DFS from the first `1` we find (at `(0,0)`). This marks all connected `1`s as belonging to island 1:

- `(0,0)`, `(0,1)`, `(1,0)`, `(2,0)` are all connected

**Step 2: Initialize BFS queue**
We add all water cells (`0`s) adjacent to island 1 to our BFS queue:

- `(0,2)` is adjacent to `(0,1)`
- `(1,1)` is adjacent to `(0,1)` and `(1,0)`
- `(2,1)` is adjacent to `(2,0)`
- `(3,0)` is adjacent to `(2,0)`

**Step 3: BFS expansion**
We perform BFS from these starting points:

- Level 1: Explore all adjacent water cells, marking distance 1
- Level 2: Continue expanding
- Level 3: When we reach `(2,2)`, we're adjacent to island 2 at `(2,4)`

**Step 4: Find connection**
The shortest path requires flipping 3 zeros: `(2,1)` → `(2,2)` → `(2,3)` → `(2,4)`

## Brute Force Approach

A naive approach might try to:

1. Find all cells in both islands
2. For each cell in island 1, calculate distance to each cell in island 2
3. Return the minimum Manhattan distance minus 1

This would be O(n⁴) in the worst case (when islands are large), which is far too slow for n up to 100. The key insight we need is that we don't need to check every pair of cells between islands.

## Optimized Approach

The optimal solution uses a two-phase approach:

**Phase 1: DFS to identify and mark the first island**

- Start from the first `1` we encounter
- Use DFS to find all connected `1`s
- Mark these cells as visited and add their coordinates to a queue
- This queue will serve as the starting points for our BFS

**Phase 2: Multi-source BFS to find the shortest path**

- Initialize BFS with all water cells adjacent to the first island
- Expand outward level by level
- When we encounter a `1` that's not part of the first island, we've found the shortest bridge
- The number of BFS levels traversed equals the minimum number of flips needed

**Why this works:**

- BFS guarantees we find the shortest path
- Starting BFS from all border cells of island 1 simultaneously (multi-source BFS) is efficient
- We only need to find one island completely; the first `1` we encounter from the other island during BFS gives us our answer

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²)
def shortestBridge(grid):
    """
    Find the shortest bridge between two islands in a binary grid.

    Approach:
    1. Use DFS to find and mark all cells of the first island
    2. Use multi-source BFS from the first island's border to find the second island
    3. The BFS level when we first encounter the second island is our answer
    """
    n = len(grid)
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]

    # Step 1: Find the first island using DFS
    def dfs(r, c):
        """Depth-first search to mark all cells of the first island."""
        # Check bounds and if cell is land (1) and not visited
        if r < 0 or r >= n or c < 0 or c >= n or grid[r][c] != 1:
            return

        # Mark this cell as part of first island by changing to 2
        grid[r][c] = 2
        # Add to queue for BFS later (we'll use it as starting point)
        queue.append((r, c))

        # Explore all 4 directions
        for dr, dc in directions:
            dfs(r + dr, c + dc)

    # Initialize BFS queue
    queue = []

    # Find the first 1 to start DFS
    found_first_island = False
    for i in range(n):
        if found_first_island:
            break
        for j in range(n):
            if grid[i][j] == 1:
                dfs(i, j)
                found_first_island = True
                break

    # Step 2: Multi-source BFS from the first island
    distance = 0
    while queue:
        # Process all nodes at current distance level
        level_size = len(queue)
        for _ in range(level_size):
            r, c = queue.pop(0)

            # Check all 4 neighbors
            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                # Check bounds
                if nr < 0 or nr >= n or nc < 0 or nc >= n:
                    continue

                # If we found the second island (a 1 that's not marked as 2)
                if grid[nr][nc] == 1:
                    return distance

                # If it's water (0), mark it and add to queue
                if grid[nr][nc] == 0:
                    # Mark as visited by changing to 2
                    grid[nr][nc] = 2
                    queue.append((nr, nc))

        # Move to next distance level
        distance += 1

    return distance
```

```javascript
// Time: O(n²) | Space: O(n²)
function shortestBridge(grid) {
  /**
   * Find the shortest bridge between two islands in a binary grid.
   *
   * Approach:
   * 1. Use DFS to find and mark all cells of the first island
   * 2. Use multi-source BFS from the first island's border to find the second island
   * 3. The BFS level when we first encounter the second island is our answer
   */
  const n = grid.length;
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const queue = [];

  // Step 1: DFS to find and mark the first island
  function dfs(r, c) {
    // Check bounds and if cell is land (1) and not visited
    if (r < 0 || r >= n || c < 0 || c >= n || grid[r][c] !== 1) {
      return;
    }

    // Mark this cell as part of first island by changing to 2
    grid[r][c] = 2;
    // Add to queue for BFS later
    queue.push([r, c]);

    // Explore all 4 directions
    for (const [dr, dc] of directions) {
      dfs(r + dr, c + dc);
    }
  }

  // Find the first 1 to start DFS
  let foundFirstIsland = false;
  for (let i = 0; i < n && !foundFirstIsland; i++) {
    for (let j = 0; j < n && !foundFirstIsland; j++) {
      if (grid[i][j] === 1) {
        dfs(i, j);
        foundFirstIsland = true;
      }
    }
  }

  // Step 2: Multi-source BFS from the first island
  let distance = 0;
  while (queue.length > 0) {
    // Process all nodes at current distance level
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift();

      // Check all 4 neighbors
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        // Check bounds
        if (nr < 0 || nr >= n || nc < 0 || nc >= n) {
          continue;
        }

        // If we found the second island (a 1 that's not marked as 2)
        if (grid[nr][nc] === 1) {
          return distance;
        }

        // If it's water (0), mark it and add to queue
        if (grid[nr][nc] === 0) {
          // Mark as visited by changing to 2
          grid[nr][nc] = 2;
          queue.push([nr, nc]);
        }
      }
    }

    // Move to next distance level
    distance++;
  }

  return distance;
}
```

```java
// Time: O(n²) | Space: O(n²)
import java.util.LinkedList;
import java.util.Queue;

class Solution {
    public int shortestBridge(int[][] grid) {
        /**
         * Find the shortest bridge between two islands in a binary grid.
         *
         * Approach:
         * 1. Use DFS to find and mark all cells of the first island
         * 2. Use multi-source BFS from the first island's border to find the second island
         * 3. The BFS level when we first encounter the second island is our answer
         */
        int n = grid.length;
        int[][] directions = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
        Queue<int[]> queue = new LinkedList<>();
        boolean foundFirstIsland = false;

        // Step 1: DFS to find and mark the first island
        for (int i = 0; i < n && !foundFirstIsland; i++) {
            for (int j = 0; j < n && !foundFirstIsland; j++) {
                if (grid[i][j] == 1) {
                    dfs(grid, i, j, queue);
                    foundFirstIsland = true;
                }
            }
        }

        // Step 2: Multi-source BFS from the first island
        int distance = 0;
        while (!queue.isEmpty()) {
            // Process all nodes at current distance level
            int levelSize = queue.size();
            for (int i = 0; i < levelSize; i++) {
                int[] cell = queue.poll();
                int r = cell[0];
                int c = cell[1];

                // Check all 4 neighbors
                for (int[] dir : directions) {
                    int nr = r + dir[0];
                    int nc = c + dir[1];

                    // Check bounds
                    if (nr < 0 || nr >= n || nc < 0 || nc >= n) {
                        continue;
                    }

                    // If we found the second island (a 1 that's not marked as 2)
                    if (grid[nr][nc] == 1) {
                        return distance;
                    }

                    // If it's water (0), mark it and add to queue
                    if (grid[nr][nc] == 0) {
                        // Mark as visited by changing to 2
                        grid[nr][nc] = 2;
                        queue.offer(new int[]{nr, nc});
                    }
                }
            }

            // Move to next distance level
            distance++;
        }

        return distance;
    }

    private void dfs(int[][] grid, int r, int c, Queue<int[]> queue) {
        int n = grid.length;

        // Check bounds and if cell is land (1) and not visited
        if (r < 0 || r >= n || c < 0 || c >= n || grid[r][c] != 1) {
            return;
        }

        // Mark this cell as part of first island by changing to 2
        grid[r][c] = 2;
        // Add to queue for BFS later
        queue.offer(new int[]{r, c});

        // Explore all 4 directions
        dfs(grid, r + 1, c, queue);
        dfs(grid, r - 1, c, queue);
        dfs(grid, r, c + 1, queue);
        dfs(grid, r, c - 1, queue);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- DFS visits each cell of the first island once: O(n²) in worst case
- BFS visits each cell at most once: O(n²) in worst case
- Total: O(n²) where n is the grid dimension

**Space Complexity: O(n²)**

- DFS recursion stack could be O(n²) in worst case (if the entire grid is one island)
- BFS queue could contain O(n²) cells in worst case
- We modify the grid in-place, so no additional space for visited set

## Common Mistakes

1. **Forgetting to mark visited cells during BFS**: If you don't mark water cells as visited when adding them to the queue, you'll get infinite loops or incorrect distances.

2. **Using single-source BFS instead of multi-source**: Starting BFS from just one cell of the first island is inefficient. You need to start from ALL border cells simultaneously to find the shortest path.

3. **Not handling the BFS level counting correctly**: Candidates often return `distance + 1` or `distance - 1`. Remember: when you first encounter a `1` from the second island, the current `distance` value is exactly the number of water cells you need to flip.

4. **Confusing when to stop DFS**: Some candidates continue DFS until they find both islands, but we only need to fully explore one island. The BFS will naturally find the second one.

## When You'll See This Pattern

This "DFS + multi-source BFS" pattern appears in problems where you need to find the shortest distance between connected components:

1. **01 Matrix (LeetCode 542)**: Find distance of each cell to nearest 0 using multi-source BFS from all zeros.
2. **Rotting Oranges (LeetCode 994)**: Multi-source BFS from all rotten oranges to find time to rot all fresh oranges.
3. **Walls and Gates (LeetCode 286)**: Similar to 01 Matrix but with gates instead of zeros.

The key insight is recognizing when you have multiple starting points that should be explored simultaneously to find the shortest path.

## Key Takeaways

1. **Combine DFS and BFS strategically**: Use DFS to identify a connected component, then use BFS from its boundary to find the shortest path to another component.

2. **Multi-source BFS is powerful**: When you need the shortest path from any point in set A to any point in set B, starting BFS from all points in A simultaneously is optimal.

3. **In-place modification can save space**: By marking visited cells directly in the grid (changing 0s to 2s), we avoid needing a separate visited data structure.

Related problems: [Minimum Number of Operations to Make X and Y Equal](/problem/minimum-number-of-operations-to-make-x-and-y-equal)
