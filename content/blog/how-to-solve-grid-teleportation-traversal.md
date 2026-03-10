---
title: "How to Solve Grid Teleportation Traversal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Grid Teleportation Traversal. Medium difficulty, 23.2% acceptance rate. Topics: Array, Hash Table, Breadth-First Search, Matrix."
date: "2026-03-18"
category: "dsa-patterns"
tags: ["grid-teleportation-traversal", "array", "hash-table", "breadth-first-search", "medium"]
---

# How to Solve Grid Teleportation Traversal

This problem presents a unique twist on classic grid traversal: you're given a 2D grid where certain cells contain teleportation portals that instantly transport you to other cells with the same letter. The challenge is finding the shortest path from the top-left to bottom-right corner, navigating around obstacles while strategically using teleportation portals. What makes this problem interesting is that teleportation creates non-local connections in the grid, meaning you can't simply use standard BFS without accounting for these instant jumps.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
S . a .
. # . .
. . b .
. a . E

S = start (0,0), E = end (3,3)
'a' at (0,2) and (3,1) are connected portals
'b' at (2,2) has no pair (so it's just an obstacle)
```

**Step 1:** Start at (0,0). Queue: [(0,0,0)] (row, col, distance)

**Step 2:** From (0,0), we can move to (0,1) and (1,0). Queue: [(0,1,1), (1,0,1)]

**Step 3:** Process (0,1). It's empty, so we can move to (0,2), (0,0), (1,1). But (0,0) is visited, (1,1) is '#', so only (0,2). Queue: [(1,0,1), (0,2,2)]

**Step 4:** Process (1,0). It's empty, moves to (0,0), (2,0), (1,1). (0,0) visited, (1,1) is '#', so only (2,0). Queue: [(0,2,2), (2,0,2)]

**Step 5:** Process (0,2). This is an 'a' portal! We can:

- Move normally to adjacent cells: (0,1), (0,3), (1,2)
- Teleport to all other 'a' cells: (3,1)

Queue now contains: [(2,0,2), (0,1,3), (0,3,3), (1,2,3), (3,1,3)]

**Step 6:** Process (2,0). Empty cell, moves to (1,0), (3,0), (2,1). (1,0) visited, others added. Queue: [(0,1,3), (0,3,3), (1,2,3), (3,1,3), (3,0,3), (2,1,3)]

**Step 7:** Process (0,1) - already visited, skip.

**Step 8:** Process (0,3). Empty cell, moves to (0,2), (1,3). (0,2) visited, (1,3) added. Queue: [(1,2,3), (3,1,3), (3,0,3), (2,1,3), (1,3,4)]

**Step 9:** Process (1,2). Empty cell, moves to (0,2), (2,2), (1,1), (1,3). (0,2) visited, (2,2) is 'b' (obstacle), (1,1) is '#', (1,3) already in queue. Queue unchanged.

**Step 10:** Process (3,1). This is also an 'a' portal! We can teleport back to (0,2), but it's visited. Normal moves: (3,0), (3,2), (2,1). (3,0) in queue, (2,1) in queue, (3,2) added. Queue: [(3,0,3), (2,1,3), (1,3,4), (3,2,4)]

**Step 11:** Process (3,0). Empty cell, moves to (2,0), (3,1). Both visited.

**Step 12:** Process (2,1). Empty cell, moves to (2,0), (2,2), (1,1), (3,1). All visited or obstacles.

**Step 13:** Process (1,3). Empty cell, moves to (0,3), (2,3), (1,2). (0,3) visited, (1,2) visited, (2,3) added. Queue: [(3,2,4), (2,3,5)]

**Step 14:** Process (3,2). Empty cell, moves to (3,1), (3,3), (2,2). (3,1) visited, (2,2) is obstacle, (3,3) is the END! Found with distance 5.

The shortest path uses teleportation: (0,0)→(0,1)→(0,2)→[teleport]→(3,1)→(3,2)→(3,3)

## Brute Force Approach

A naive approach might try to explore all possible paths using DFS, but this would be extremely inefficient. With teleportation portals, the branching factor increases dramatically. For a grid with `k` portal pairs, at each portal cell you have up to 4 normal moves plus teleportation to all other cells with the same letter.

The brute force DFS would have exponential time complexity, roughly O(4^(m*n) * k!) in the worst case, which is completely infeasible for even moderately sized grids. We need a smarter approach that avoids re-exploring the same states.

## Optimized Approach

The key insight is that this is a **shortest path problem in an unweighted graph**, which naturally calls for **Breadth-First Search (BFS)**. However, we need to adapt standard grid BFS to handle teleportation:

1. **Graph Representation**: Each cell is a node. Edges exist between:
   - Adjacent cells (if not obstacles)
   - All cells with the same letter (teleportation edges)

2. **Optimization**: Instead of adding edges from each portal to all other same-letter portals (which could be O(k²) edges), we can process teleportation lazily:
   - When we reach a portal for the **first time**, we add all other same-letter portals to the queue
   - Then we "deactivate" that portal letter so we don't re-process teleportation for the same letter

3. **State Tracking**: We need to track visited cells to avoid cycles. A 2D boolean array works for this.

4. **Portal Mapping**: Preprocess the grid to build a dictionary mapping letters to lists of coordinates. This allows O(1) access to all portals of a given letter.

The BFS guarantees we find the shortest path because it explores all nodes at distance d before moving to distance d+1.

## Optimal Solution

Here's the complete solution using BFS with optimized teleportation handling:

<div class="code-group">

```python
# Time: O(m * n) - each cell visited at most once
# Space: O(m * n) - for visited array and portal mapping
from collections import deque
from typing import List

def shortestPath(grid: List[str]) -> int:
    # If start or end is blocked, no path exists
    if not grid or not grid[0] or grid[0][0] == '#' or grid[-1][-1] == '#':
        return -1

    m, n = len(grid), len(grid[0])

    # Build portal mapping: letter -> list of (row, col)
    portals = {}
    for i in range(m):
        for j in range(n):
            cell = grid[i][j]
            if 'a' <= cell <= 'z':  # It's a portal
                if cell not in portals:
                    portals[cell] = []
                portals[cell].append((i, j))

    # BFS initialization
    queue = deque()
    queue.append((0, 0, 0))  # (row, col, distance)
    visited = [[False] * n for _ in range(m)]
    visited[0][0] = True

    # Directions: down, up, right, left
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while queue:
        row, col, dist = queue.popleft()

        # Check if we reached the destination
        if row == m - 1 and col == n - 1:
            return dist

        # Explore normal adjacent moves
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            # Check bounds and accessibility
            if 0 <= new_row < m and 0 <= new_col < n:
                if not visited[new_row][new_col] and grid[new_row][new_col] != '#':
                    visited[new_row][new_col] = True
                    queue.append((new_row, new_col, dist + 1))

        # Handle teleportation if current cell is a portal
        cell = grid[row][col]
        if 'a' <= cell <= 'z':
            # Get all portals with the same letter
            if cell in portals:
                for portal_row, portal_col in portals[cell]:
                    if not visited[portal_row][portal_col]:
                        visited[portal_row][portal_col] = True
                        queue.append((portal_row, portal_col, dist + 1))

                # Crucial optimization: remove this portal letter
                # to avoid re-processing teleportation for the same letter
                del portals[cell]

    # If BFS completes without finding the destination
    return -1
```

```javascript
// Time: O(m * n) - each cell visited at most once
// Space: O(m * n) - for visited array and portal mapping
function shortestPath(grid) {
  // If grid is empty or start/end is blocked
  if (
    !grid ||
    !grid.length ||
    !grid[0] ||
    grid[0][0] === "#" ||
    grid[grid.length - 1][grid[0].length - 1] === "#"
  ) {
    return -1;
  }

  const m = grid.length;
  const n = grid[0].length;

  // Build portal mapping
  const portals = new Map();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const cell = grid[i][j];
      if (cell >= "a" && cell <= "z") {
        if (!portals.has(cell)) {
          portals.set(cell, []);
        }
        portals.get(cell).push([i, j]);
      }
    }
  }

  // BFS initialization
  const queue = [[0, 0, 0]]; // [row, col, distance]
  const visited = Array.from({ length: m }, () => Array(n).fill(false));
  visited[0][0] = true;

  // Directions: down, up, right, left
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length > 0) {
    const [row, col, dist] = queue.shift();

    // Check if reached destination
    if (row === m - 1 && col === n - 1) {
      return dist;
    }

    // Explore normal adjacent moves
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check bounds and accessibility
      if (newRow >= 0 && newRow < m && newCol >= 0 && newCol < n) {
        if (!visited[newRow][newCol] && grid[newRow][newCol] !== "#") {
          visited[newRow][newCol] = true;
          queue.push([newRow, newCol, dist + 1]);
        }
      }
    }

    // Handle teleportation if current cell is a portal
    const cell = grid[row][col];
    if (cell >= "a" && cell <= "z") {
      const portalList = portals.get(cell);
      if (portalList) {
        for (const [portalRow, portalCol] of portalList) {
          if (!visited[portalRow][portalCol]) {
            visited[portalRow][portalCol] = true;
            queue.push([portalRow, portalCol, dist + 1]);
          }
        }

        // Crucial optimization: remove portal letter to avoid re-processing
        portals.delete(cell);
      }
    }
  }

  // No path found
  return -1;
}
```

```java
// Time: O(m * n) - each cell visited at most once
// Space: O(m * n) - for visited array and portal mapping
import java.util.*;

class Solution {
    public int shortestPath(String[] grid) {
        // Check if grid is valid
        if (grid == null || grid.length == 0 || grid[0].length() == 0) {
            return -1;
        }

        int m = grid.length;
        int n = grid[0].length();

        // Check if start or end is blocked
        if (grid[0].charAt(0) == '#' || grid[m-1].charAt(n-1) == '#') {
            return -1;
        }

        // Build portal mapping
        Map<Character, List<int[]>> portals = new HashMap<>();
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                char cell = grid[i].charAt(j);
                if (cell >= 'a' && cell <= 'z') {
                    portals.putIfAbsent(cell, new ArrayList<>());
                    portals.get(cell).add(new int[]{i, j});
                }
            }
        }

        // BFS initialization
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0, 0});  // {row, col, distance}
        boolean[][] visited = new boolean[m][n];
        visited[0][0] = true;

        // Directions: down, up, right, left
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0];
            int col = current[1];
            int dist = current[2];

            // Check if reached destination
            if (row == m - 1 && col == n - 1) {
                return dist;
            }

            // Explore normal adjacent moves
            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                // Check bounds and accessibility
                if (newRow >= 0 && newRow < m && newCol >= 0 && newCol < n) {
                    if (!visited[newRow][newCol] && grid[newRow].charAt(newCol) != '#') {
                        visited[newRow][newCol] = true;
                        queue.offer(new int[]{newRow, newCol, dist + 1});
                    }
                }
            }

            // Handle teleportation if current cell is a portal
            char cell = grid[row].charAt(col);
            if (cell >= 'a' && cell <= 'z') {
                List<int[]> portalList = portals.get(cell);
                if (portalList != null) {
                    for (int[] portal : portalList) {
                        int portalRow = portal[0];
                        int portalCol = portal[1];

                        if (!visited[portalRow][portalCol]) {
                            visited[portalRow][portalCol] = true;
                            queue.offer(new int[]{portalRow, portalCol, dist + 1});
                        }
                    }

                    // Crucial optimization: remove portal letter to avoid re-processing
                    portals.remove(cell);
                }
            }
        }

        // No path found
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- Each cell is added to the queue at most once (when first visited)
- For each cell, we check up to 4 adjacent cells (O(1) operation)
- Teleportation edges are processed only once per portal letter due to the optimization of deleting the portal from our map after first use
- Building the portal mapping takes O(m × n) time

**Space Complexity: O(m × n)**

- Visited array: O(m × n)
- Portal mapping: In worst case, all cells could be portals, so O(m × n)
- BFS queue: In worst case, could hold O(m × n) elements (e.g., when most cells are reachable at the same distance level)

## Common Mistakes

1. **Forgetting to handle single portals**: A portal with no matching pair (like 'b' in our example) should be treated as an obstacle for teleportation purposes, but candidates might try to teleport from it or to it. Our solution handles this correctly by only processing teleportation if the portal exists in our mapping.

2. **Not optimizing teleportation processing**: A naive approach would add teleportation edges from every portal to every other same-letter portal each time we visit any portal. This creates O(k²) edges where k is the number of portals. The key optimization is to process each portal letter only once by deleting it from the map after first use.

3. **Incorrect BFS distance tracking**: Some candidates increment distance incorrectly when teleporting. Remember: teleportation counts as one move, just like moving to an adjacent cell. Both should increment distance by 1.

4. **Missing start/end validation**: Always check if the start or end cell is blocked by an obstacle ('#'). If either is blocked, return -1 immediately.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Grid BFS with twists**: Similar to LeetCode 1091 "Shortest Path in Binary Matrix" but with added complexity of teleportation. The core BFS approach remains the same.

2. **Graphs with special edges**: Like LeetCode 127 "Word Ladder" where you can jump between words that differ by one letter. Both problems involve navigating a graph with non-local connections.

3. **State space search with optimizations**: Comparable to LeetCode 864 "Shortest Path to Get All Keys" where you need to track additional state (keys collected). Here, the optimization is tracking which portal letters have been used.

## Key Takeaways

1. **BFS is optimal for unweighted shortest path problems**: When you need the shortest path in an unweighted graph (or grid), BFS is almost always the right approach because it explores all nodes at distance d before moving to d+1.

2. **Lazy evaluation of special edges**: When you have special connections (like teleportation), process them only when needed and mark them as "used" to avoid exponential blowup. This is a common optimization pattern.

3. **Preprocessing is your friend**: Building the portal mapping upfront saves time during BFS and makes the code cleaner. Always look for opportunities to preprocess data into efficient structures.

[Practice this problem on CodeJeet](/problem/grid-teleportation-traversal)
