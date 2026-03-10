---
title: "How to Solve Minimum Moves to Move a Box to Their Target Location — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Moves to Move a Box to Their Target Location. Hard difficulty, 49.5% acceptance rate. Topics: Array, Breadth-First Search, Heap (Priority Queue), Matrix."
date: "2029-04-04"
category: "dsa-patterns"
tags:
  [
    "minimum-moves-to-move-a-box-to-their-target-location",
    "array",
    "breadth-first-search",
    "heap-(priority-queue)",
    "hard",
  ]
---

# How to Solve Minimum Moves to Move a Box to Their Target Location

This problem asks us to find the minimum number of pushes required to move a box from its starting position to a target cell in a grid, where the player can walk freely on floor cells but must push the box from adjacent positions. The tricky part is that both the box's position **and** the player's position matter—the player must be able to reach the opposite side of the box to push it in a given direction.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
S . .
. B .
T . .
```

Where `S` is the player start, `B` is the box, `T` is the target, and `.` are floor cells.

**Step 1:** Initial state: Player at (0,0), Box at (1,1). Player can move to (0,1) or (1,0).

**Step 2:** Player moves to (0,1). Now player is north of the box. To push the box south, player would need to be at (2,1) after the push, which is outside the grid. So this push is invalid.

**Step 3:** Player moves to (1,0). Now player is west of the box. To push the box east, player would push from (1,0) to (1,1), moving the box to (1,2). But (1,2) is a valid floor cell, so this push is possible.

**Step 4:** After push: Box at (1,2), Player at (1,1). Now player is west of the box again. To push the box east to (1,3) is impossible since grid only goes to column 2.

**Step 5:** Player moves around to (0,2) or (2,2) to get into position to push the box west or south.

This example shows why we need to track both positions—the player's accessibility determines which pushes are possible.

## Brute Force Approach

A naive brute force would try all possible sequences of moves:

1. From current state (player position, box position)
2. For each of the 4 directions
3. Check if player can reach the pushing position
4. If yes, push the box and continue

The problem with this approach is exponential branching. Each state can lead to up to 4 new states, and with an m×n grid, there are O((m×n)²) possible (player, box) pairs. Exploring all sequences would be O(4^k) where k is the path length—completely infeasible for typical grid sizes.

Even with memoization of visited states, we'd still need to explore states in the right order to guarantee finding the minimum moves. This is where BFS becomes essential.

## Optimized Approach

The key insight is that this is a **state space search problem** where each state is defined by:

- Box position (r, c)
- Player position relative to the box (or absolute position)

We need to find the shortest path in this state space, which naturally suggests **Breadth-First Search (BFS)**.

**Why BFS works:**

1. Each "push" costs 1 move, so BFS finds the minimum number of pushes
2. We need to explore all reachable (player, box) configurations
3. BFS explores states in order of increasing moves

**State representation:**
We can represent state as `(box_r, box_c, player_r, player_c)` but this is redundant since the player must be adjacent to the box after a push. However, between pushes, the player can move arbitrarily, so we need the full position.

**Algorithm outline:**

1. Find initial positions of player (S), box (B), and target (T)
2. Use BFS where each state is `(box_r, box_c, player_r, player_c)`
3. For each state:
   - If box is at target, return current moves
   - For each direction:
     - Calculate new box position if pushed
     - Check if new box position is valid (not wall, in bounds)
     - Check if player can reach the pushing position from current player position
     - If both valid, add new state to BFS queue

**Optimization:** Instead of running BFS/DFS each time to check if player can reach pushing position, we can precompute or use a more efficient reachability check since the player can only move through floor cells (not through the box's current position).

## Optimal Solution

The optimal solution uses BFS over states of `(box position, player position)`. We maintain a queue of states and a visited set to avoid cycles. For each state, we check all possible pushes by verifying if the player can reach the required pushing position.

<div class="code-group">

```python
# Time: O(m² * n²) - In worst case, we visit all (box, player) pairs
# Space: O(m² * n²) - For the visited set and queue
from collections import deque
from typing import List

class Solution:
    def minPushBox(self, grid: List[List[str]]) -> int:
        m, n = len(grid), len(grid[0])

        # Find initial positions
        player = box = target = None
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 'S':
                    player = (i, j)
                elif grid[i][j] == 'B':
                    box = (i, j)
                elif grid[i][j] == 'T':
                    target = (i, j)

        # Directions: up, right, down, left
        dirs = [(-1, 0), (0, 1), (1, 0), (0, -1)]

        # Helper function to check if player can move from start to end
        # without passing through the box (at box_pos)
        def can_reach(start, end, box_pos):
            if start == end:
                return True
            queue = deque([start])
            visited = set([start])
            while queue:
                r, c = queue.popleft()
                for dr, dc in dirs:
                    nr, nc = r + dr, c + dc
                    # Check bounds and validity
                    if 0 <= nr < m and 0 <= nc < n:
                        # Can't walk through walls or current box position
                        if grid[nr][nc] != '#' and (nr, nc) != box_pos:
                            if (nr, nc) == end:
                                return True
                            if (nr, nc) not in visited:
                                visited.add((nr, nc))
                                queue.append((nr, nc))
            return False

        # BFS over states: (box_r, box_c, player_r, player_c)
        start_state = (box[0], box[1], player[0], player[1])
        queue = deque([(box[0], box[1], player[0], player[1], 0)])  # last element is pushes count
        visited = set([start_state])

        while queue:
            br, bc, pr, pc, pushes = queue.popleft()

            # Check if box is at target
            if (br, bc) == target:
                return pushes

            # Try pushing in all 4 directions
            for dr, dc in dirs:
                # New box position after push
                new_br, new_bc = br + dr, bc + dc
                # Player needs to be opposite the push direction to push
                player_push_from = (br - dr, bc - dc)

                # Check if new box position is valid
                if not (0 <= new_br < m and 0 <= new_bc < n):
                    continue
                if grid[new_br][new_bc] == '#':
                    continue

                # Check if player can reach the pushing position
                if not can_reach((pr, pc), player_push_from, (br, bc)):
                    continue

                # Valid push - create new state
                new_state = (new_br, new_bc, br, bc)  # Player ends up at old box position
                if new_state not in visited:
                    visited.add(new_state)
                    queue.append((new_br, new_bc, br, bc, pushes + 1))

        return -1  # No solution found
```

```javascript
// Time: O(m² * n²) - In worst case, we visit all (box, player) pairs
// Space: O(m² * n²) - For the visited set and queue
/**
 * @param {character[][]} grid
 * @return {number}
 */
var minPushBox = function (grid) {
  const m = grid.length,
    n = grid[0].length;
  let player = null,
    box = null,
    target = null;

  // Find initial positions
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === "S") player = [i, j];
      else if (grid[i][j] === "B") box = [i, j];
      else if (grid[i][j] === "T") target = [i, j];
    }
  }

  // Directions: up, right, down, left
  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  // Helper to check if player can reach end from start without passing through box
  const canReach = (start, end, boxPos) => {
    if (start[0] === end[0] && start[1] === end[1]) return true;

    const queue = [[start[0], start[1]]];
    const visited = new Set();
    visited.add(`${start[0]},${start[1]}`);

    while (queue.length > 0) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;

        // Check bounds and validity
        if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
          // Can't walk through walls or current box position
          if (grid[nr][nc] !== "#" && !(nr === boxPos[0] && nc === boxPos[1])) {
            if (nr === end[0] && nc === end[1]) return true;

            const key = `${nr},${nc}`;
            if (!visited.has(key)) {
              visited.add(key);
              queue.push([nr, nc]);
            }
          }
        }
      }
    }
    return false;
  };

  // BFS over states
  const startState = `${box[0]},${box[1]},${player[0]},${player[1]}`;
  const queue = [[box[0], box[1], player[0], player[1], 0]]; // last is push count
  const visited = new Set([startState]);

  while (queue.length > 0) {
    const [br, bc, pr, pc, pushes] = queue.shift();

    // Check if box reached target
    if (br === target[0] && bc === target[1]) {
      return pushes;
    }

    // Try all 4 push directions
    for (const [dr, dc] of dirs) {
      const newBr = br + dr,
        newBc = bc + dc;
      // Player needs to be opposite the push direction
      const playerPushFrom = [br - dr, bc - dc];

      // Check if new box position is valid
      if (newBr < 0 || newBr >= m || newBc < 0 || newBc >= n) continue;
      if (grid[newBr][newBc] === "#") continue;

      // Check if player can reach pushing position
      if (!canReach([pr, pc], playerPushFrom, [br, bc])) continue;

      // Valid push - create new state
      const newState = `${newBr},${newBc},${br},${bc}`;
      if (!visited.has(newState)) {
        visited.add(newState);
        queue.push([newBr, newBc, br, bc, pushes + 1]);
      }
    }
  }

  return -1; // No solution
};
```

```java
// Time: O(m² * n²) - In worst case, we visit all (box, player) pairs
// Space: O(m² * n²) - For the visited set and queue
import java.util.*;

class Solution {
    public int minPushBox(char[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[] player = null, box = null, target = null;

        // Find initial positions
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 'S') player = new int[]{i, j};
                else if (grid[i][j] == 'B') box = new int[]{i, j};
                else if (grid[i][j] == 'T') target = new int[]{i, j};
            }
        }

        // Directions: up, right, down, left
        int[][] dirs = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};

        // BFS queue: stores [box_r, box_c, player_r, player_c, pushes]
        Queue<int[]> queue = new LinkedList<>();
        String startState = box[0] + "," + box[1] + "," + player[0] + "," + player[1];
        queue.offer(new int[]{box[0], box[1], player[0], player[1], 0});
        Set<String> visited = new HashSet<>();
        visited.add(startState);

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int br = curr[0], bc = curr[1], pr = curr[2], pc = curr[3], pushes = curr[4];

            // Check if box reached target
            if (br == target[0] && bc == target[1]) {
                return pushes;
            }

            // Try pushing in all 4 directions
            for (int[] dir : dirs) {
                int dr = dir[0], dc = dir[1];
                int newBr = br + dr, newBc = bc + dc;
                // Player needs to be opposite the push direction
                int[] playerPushFrom = new int[]{br - dr, bc - dc};

                // Check if new box position is valid
                if (newBr < 0 || newBr >= m || newBc < 0 || newBc >= n) continue;
                if (grid[newBr][newBc] == '#') continue;

                // Check if player can reach pushing position
                if (!canReach(grid, new int[]{pr, pc}, playerPushFrom, new int[]{br, bc})) {
                    continue;
                }

                // Valid push - create new state
                String newState = newBr + "," + newBc + "," + br + "," + bc;
                if (!visited.contains(newState)) {
                    visited.add(newState);
                    queue.offer(new int[]{newBr, newBc, br, bc, pushes + 1});
                }
            }
        }

        return -1; // No solution
    }

    // Helper to check if player can reach end from start without passing through box
    private boolean canReach(char[][] grid, int[] start, int[] end, int[] boxPos) {
        if (start[0] == end[0] && start[1] == end[1]) return true;

        int m = grid.length, n = grid[0].length;
        int[][] dirs = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(start);
        boolean[][] visited = new boolean[m][n];
        visited[start[0]][start[1]] = true;

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1];

            for (int[] dir : dirs) {
                int nr = r + dir[0], nc = c + dir[1];

                // Check bounds and validity
                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                    // Can't walk through walls or current box position
                    if (grid[nr][nc] != '#' && !(nr == boxPos[0] && nc == boxPos[1])) {
                        if (nr == end[0] && nc == end[1]) return true;

                        if (!visited[nr][nc]) {
                            visited[nr][nc] = true;
                            queue.offer(new int[]{nr, nc});
                        }
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

**Time Complexity:** O(m² × n²)

- In the worst case, we might visit all possible (box, player) state combinations
- There are O(m × n) possible box positions and O(m × n) possible player positions
- For each state, we check 4 directions, and each direction check involves a BFS that could take O(m × n) in worst case
- However, in practice, the player reachability check is limited to the area around the box

**Space Complexity:** O(m² × n²)

- We store visited states for all (box, player) pairs: O(m² × n²)
- The BFS queue could store up to O(m² × n²) states in worst case
- The auxiliary BFS for player reachability uses O(m × n) space

## Common Mistakes

1. **Forgetting that the player can't walk through the box:** When checking if the player can reach the pushing position, you must exclude the box's current position from walkable cells. This is a subtle but critical detail.

2. **Using DFS instead of BFS:** Since we need the minimum number of pushes, BFS is essential. DFS might find a solution but not necessarily the shortest one.

3. **Not tracking both player and box positions:** Some candidates try to track only the box position, but the player's position determines which pushes are possible. You need the full state.

4. **Inefficient player reachability checks:** Running a full BFS for each push direction is correct but can be optimized. However, premature optimization might introduce bugs—get the correct solution first, then optimize if needed.

## When You'll See This Pattern

This problem combines BFS with state space search, a pattern seen in several hard grid problems:

1. **Sliding Puzzle (LeetCode 773)** - Similar state space search where you track the position of the empty slot and tiles.
2. **Shortest Path in a Grid with Obstacles Elimination (LeetCode 1293)** - BFS over states of (position, obstacles removed).
3. **Bus Routes (LeetCode 815)** - BFS over bus stops with route information as part of the state.

The common theme is when the "state" of the problem involves more than just position—additional information like player position, keys collected, or obstacles removed—and you need the shortest path in this expanded state space.

## Key Takeaways

1. **When you need shortest path with additional constraints**, consider BFS over an expanded state space where the state includes all relevant information.

2. **Grid problems with movable objects and a controller** often require tracking both the object and controller positions. Think about what determines valid moves.

3. **BFS guarantees shortest path** when each move has equal cost. If moves have different costs, you'd need Dijkstra's algorithm instead.

[Practice this problem on CodeJeet](/problem/minimum-moves-to-move-a-box-to-their-target-location)
