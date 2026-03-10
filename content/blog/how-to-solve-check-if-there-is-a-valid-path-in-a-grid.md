---
title: "How to Solve Check if There is a Valid Path in a Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Check if There is a Valid Path in a Grid. Medium difficulty, 50.1% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Union-Find, Matrix."
date: "2028-12-30"
category: "dsa-patterns"
tags:
  [
    "check-if-there-is-a-valid-path-in-a-grid",
    "array",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Solve "Check if There is a Valid Path in a Grid"

This problem asks us to determine if there's a valid path from the top-left corner (0,0) to the bottom-right corner (m-1,n-1) in a grid where each cell contains a street type (1-6) that dictates which neighboring cells it connects to. The challenge lies in modeling the connectivity constraints properly—you can't just move in any direction; you must ensure that both the current cell's street allows exiting in a particular direction **and** the neighboring cell's street allows entering from the opposite direction.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid: [[2,4,3],[6,5,2]]
```

We need to check if there's a path from (0,0) to (1,2).

**Step 1: Starting at (0,0) with street type 2**

- Type 2 connects up and down (vertical street)
- From (0,0), we can only go down to (1,0) since going up is out of bounds
- But we must check if (1,0) allows entry from above
- (1,0) has type 6, which connects left, right, and down. It **does not** connect up, so we cannot move from (0,0) to (1,0)

**Step 2: Alternative approach**
Wait, we started wrong! Actually, we need to systematically explore all valid paths. Let's think about what each street type means:

- Type 1: left ↔ right
- Type 2: up ↔ down
- Type 3: left ↔ down
- Type 4: right ↔ down
- Type 5: left ↔ up
- Type 6: right ↔ up

The key insight: For a move to be valid, the current cell must allow exiting in direction D, and the neighbor must allow entering from the opposite of D.

**Step 3: Let's try BFS from (0,0)**

- (0,0): type 2 → can go down to (1,0)
- Check if (1,0) accepts from above: type 6 accepts from below? No, type 6 accepts from left, right, and up (not from above which would be "down" direction)
- Actually, let's be precise: If we're at (0,0) going down, that's direction "down". The neighbor (1,0) needs to accept from "up" (opposite of down).
- Type 6 connects right, up, and left. Yes, it accepts from up! So we can move to (1,0).

**Step 4: Continue BFS**

- (1,0): type 6 → can go left, up, or right
  - Left: out of bounds
  - Up: back to (0,0) (visited)
  - Right: to (1,1)
- Check (1,1) accepts from left: type 5 accepts from left and up. Yes!
- Continue this process until we reach (1,2) or exhaust all possibilities.

This example shows why we need to carefully model the connectivity rules in both directions.

## Brute Force Approach

A naive brute force would try all possible paths through the grid. For each cell, based on its street type, we could try all possible exits, then recursively explore each path. We'd need to track visited cells to avoid cycles.

The problem with this approach is the exponential time complexity. In the worst case (with street types that allow many connections), we could explore a huge number of paths. For an m × n grid, the number of possible paths could be astronomical.

More fundamentally, the brute force isn't even correct if implemented naively because it might miss the need to check bidirectional compatibility. A candidate might try simple DFS without checking if the neighbor accepts the connection, which would give wrong answers.

## Optimized Approach

The key insight is that this is essentially a graph connectivity problem where:

1. Each cell is a node
2. Edges exist only if two adjacent cells' street types are compatible
3. We need to check if (0,0) and (m-1,n-1) are connected

We can solve this using either BFS or DFS. The optimal approach is to:

1. Define mapping of street types to allowed exit directions
2. Define mapping of street types to allowed entry directions
3. Perform BFS/DFS from (0,0), only moving to neighbors if:
   - Current cell allows exiting in that direction
   - Neighbor cell allows entering from the opposite direction
   - Neighbor is within bounds
4. Stop when we reach (m-1,n-1) or exhaust all reachable cells

The bidirectional compatibility check is crucial. For example, if we want to move right from cell A to cell B:

- Cell A's type must include "right" in its exits
- Cell B's type must include "left" in its entries (since we're entering B from the left)

## Optimal Solution

Here's the BFS solution with detailed comments:

<div class="code-group">

```python
# Time: O(m * n) | Space: O(m * n)
def hasValidPath(grid):
    """
    Check if there's a valid path from top-left to bottom-right in the grid.

    Approach: BFS with bidirectional compatibility checking.
    For each street type, we define which directions we can exit to,
    and which directions we can enter from.
    """
    m, n = len(grid), len(grid[0])

    # Define for each street type: which directions we can EXIT to
    # Directions: 0: up, 1: right, 2: down, 3: left
    exit_directions = {
        1: [1, 3],    # left, right
        2: [0, 2],    # up, down
        3: [2, 3],    # down, left
        4: [1, 2],    # right, down
        5: [0, 3],    # up, left
        6: [0, 1]     # up, right
    }

    # Define for each street type: which directions we can ENTER from
    # This is the opposite of exit directions for symmetric streets (1,2)
    # but needs careful handling for asymmetric streets (3,4,5,6)
    enter_directions = {
        1: [1, 3],    # can enter from left or right
        2: [0, 2],    # can enter from up or down
        3: [0, 1],    # can enter from up or right (opposite of exit: down->up, left->right)
        4: [0, 3],    # can enter from up or left
        5: [1, 2],    # can enter from right or down
        6: [2, 3]     # can enter from down or left
    }

    # Direction vectors: [up, right, down, left]
    dirs = [(-1, 0), (0, 1), (1, 0), (0, -1)]

    # BFS initialization
    from collections import deque
    queue = deque([(0, 0)])
    visited = [[False] * n for _ in range(m)]
    visited[0][0] = True

    while queue:
        r, c = queue.popleft()

        # If we reached the destination
        if r == m - 1 and c == n - 1:
            return True

        # Get current cell's street type
        street_type = grid[r][c]

        # Try all possible exit directions from current cell
        for exit_dir in exit_directions[street_type]:
            nr, nc = r + dirs[exit_dir][0], c + dirs[exit_dir][1]

            # Check if neighbor is within bounds
            if 0 <= nr < m and 0 <= nc < n and not visited[nr][nc]:
                neighbor_type = grid[nr][nc]

                # Calculate the direction from which we're entering the neighbor
                # Opposite direction: (exit_dir + 2) % 4
                enter_dir = (exit_dir + 2) % 4

                # Check if neighbor allows entry from this direction
                if enter_dir in enter_directions[neighbor_type]:
                    visited[nr][nc] = True
                    queue.append((nr, nc))

    return False
```

```javascript
// Time: O(m * n) | Space: O(m * n)
function hasValidPath(grid) {
  /**
   * Check if there's a valid path from top-left to bottom-right in the grid.
   *
   * Approach: BFS with bidirectional compatibility checking.
   * For each street type, we define which directions we can exit to,
   * and which directions we can enter from.
   */
  const m = grid.length,
    n = grid[0].length;

  // Define for each street type: which directions we can EXIT to
  // Directions: 0: up, 1: right, 2: down, 3: left
  const exitDirections = {
    1: [1, 3], // left, right
    2: [0, 2], // up, down
    3: [2, 3], // down, left
    4: [1, 2], // right, down
    5: [0, 3], // up, left
    6: [0, 1], // up, right
  };

  // Define for each street type: which directions we can ENTER from
  const enterDirections = {
    1: [1, 3], // can enter from left or right
    2: [0, 2], // can enter from up or down
    3: [0, 1], // can enter from up or right
    4: [0, 3], // can enter from up or left
    5: [1, 2], // can enter from right or down
    6: [2, 3], // can enter from down or left
  };

  // Direction vectors: [up, right, down, left]
  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  // BFS initialization
  const queue = [[0, 0]];
  const visited = Array.from({ length: m }, () => Array(n).fill(false));
  visited[0][0] = true;

  while (queue.length > 0) {
    const [r, c] = queue.shift();

    // If we reached the destination
    if (r === m - 1 && c === n - 1) {
      return true;
    }

    // Get current cell's street type
    const streetType = grid[r][c];

    // Try all possible exit directions from current cell
    for (const exitDir of exitDirections[streetType]) {
      const nr = r + dirs[exitDir][0];
      const nc = c + dirs[exitDir][1];

      // Check if neighbor is within bounds
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {
        const neighborType = grid[nr][nc];

        // Calculate the direction from which we're entering the neighbor
        // Opposite direction: (exitDir + 2) % 4
        const enterDir = (exitDir + 2) % 4;

        // Check if neighbor allows entry from this direction
        if (enterDirections[neighborType].includes(enterDir)) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
  }

  return false;
}
```

```java
// Time: O(m * n) | Space: O(m * n)
import java.util.*;

class Solution {
    public boolean hasValidPath(int[][] grid) {
        /**
         * Check if there's a valid path from top-left to bottom-right in the grid.
         *
         * Approach: BFS with bidirectional compatibility checking.
         * For each street type, we define which directions we can exit to,
         * and which directions we can enter from.
         */
        int m = grid.length, n = grid[0].length;

        // Define for each street type: which directions we can EXIT to
        // Directions: 0: up, 1: right, 2: down, 3: left
        Map<Integer, List<Integer>> exitDirections = new HashMap<>();
        exitDirections.put(1, Arrays.asList(1, 3));    // left, right
        exitDirections.put(2, Arrays.asList(0, 2));    // up, down
        exitDirections.put(3, Arrays.asList(2, 3));    // down, left
        exitDirections.put(4, Arrays.asList(1, 2));    // right, down
        exitDirections.put(5, Arrays.asList(0, 3));    // up, left
        exitDirections.put(6, Arrays.asList(0, 1));    // up, right

        // Define for each street type: which directions we can ENTER from
        Map<Integer, List<Integer>> enterDirections = new HashMap<>();
        enterDirections.put(1, Arrays.asList(1, 3));    // can enter from left or right
        enterDirections.put(2, Arrays.asList(0, 2));    // can enter from up or down
        enterDirections.put(3, Arrays.asList(0, 1));    // can enter from up or right
        enterDirections.put(4, Arrays.asList(0, 3));    // can enter from up or left
        enterDirections.put(5, Arrays.asList(1, 2));    // can enter from right or down
        enterDirections.put(6, Arrays.asList(2, 3));    // can enter from down or left

        // Direction vectors: [up, right, down, left]
        int[][] dirs = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};

        // BFS initialization
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0});
        boolean[][] visited = new boolean[m][n];
        visited[0][0] = true;

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1];

            // If we reached the destination
            if (r == m - 1 && c == n - 1) {
                return true;
            }

            // Get current cell's street type
            int streetType = grid[r][c];

            // Try all possible exit directions from current cell
            for (int exitDir : exitDirections.get(streetType)) {
                int nr = r + dirs[exitDir][0];
                int nc = c + dirs[exitDir][1];

                // Check if neighbor is within bounds
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {
                    int neighborType = grid[nr][nc];

                    // Calculate the direction from which we're entering the neighbor
                    // Opposite direction: (exitDir + 2) % 4
                    int enterDir = (exitDir + 2) % 4;

                    // Check if neighbor allows entry from this direction
                    if (enterDirections.get(neighborType).contains(enterDir)) {
                        visited[nr][nc] = true;
                        queue.offer(new int[]{nr, nc});
                    }
                }
            }
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- In the worst case, we visit each cell once during BFS/DFS traversal
- For each cell, we check at most 2 exit directions (each street type connects to exactly 2 neighbors)
- Total operations: O(2 × m × n) = O(m × n)

**Space Complexity:** O(m × n)

- We need O(m × n) for the visited array
- The BFS queue could hold up to O(m × n) cells in the worst case (though typically much less)
- Total space: O(m × n)

## Common Mistakes

1. **Forgetting bidirectional compatibility check**: The most common error is only checking if the current cell can exit in a direction, without checking if the neighbor can accept from the opposite direction. Remember: streets are one-way connections in terms of compatibility.

2. **Incorrect direction mapping for asymmetric streets**: For street types 3-6, the entry directions are NOT the same as exit directions. Candidates often use the same mapping for both, which fails for types like 3 (exits: down, left; entries: up, right).

3. **Off-by-one errors in direction arithmetic**: When computing the opposite direction using `(exit_dir + 2) % 4`, remember that directions are encoded as 0-3. Using wrong arithmetic leads to incorrect compatibility checks.

4. **Not handling the start and end cells properly**: Some candidates forget that the starting cell (0,0) doesn't need to check entry compatibility (we're starting there), and the ending cell (m-1,n-1) doesn't need to check exit compatibility (we're ending there). Our BFS handles this correctly by only checking compatibility when moving between cells.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Grid BFS/DFS with constraints**: Similar to problems like "Number of Islands" or "Rotting Oranges", but with additional movement constraints. The bidirectional compatibility check adds a layer of complexity seen in problems like "Check if There is a Valid Parentheses String Path".

2. **Graph connectivity with custom edge rules**: Problems where you need to model a graph with non-standard connectivity rules, like "Escape a Large Maze" or "Path With Minimum Effort".

3. **Stateful traversal problems**: Where the allowed moves depend on the current state or cell value, similar to "Robot Room Cleaner" or "Snakes and Ladders".

## Key Takeaways

1. **Always model bidirectional compatibility for connection problems**: When two nodes need to "agree" on a connection, check compatibility in both directions. This pattern appears in network problems, puzzle games, and graph traversal with constraints.

2. **Use direction encoding for grid problems**: Encoding directions as 0-3 with corresponding vectors simplifies direction arithmetic and opposite direction calculation. This is cleaner than using strings or separate variables.

3. **BFS is often preferable for shortest path or connectivity in grids**: While DFS would also work here, BFS naturally finds the shortest path and has the same time complexity. For pure connectivity checks, either works, but BFS avoids potential stack overflow for large grids.

Related problems: [Check if There Is a Valid Parentheses String Path](/problem/check-if-there-is-a-valid-parentheses-string-path)
