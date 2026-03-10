---
title: "How to Solve Count Unguarded Cells in the Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Unguarded Cells in the Grid. Medium difficulty, 69.0% acceptance rate. Topics: Array, Matrix, Simulation."
date: "2028-09-16"
category: "dsa-patterns"
tags: ["count-unguarded-cells-in-the-grid", "array", "matrix", "simulation", "medium"]
---

# How to Solve Count Unguarded Cells in the Grid

This problem asks us to count how many cells in an m×n grid remain unguarded after placing guards (who can see in four cardinal directions until blocked by walls or grid edges) and walls (which block vision). The challenge lies in efficiently simulating guard vision across potentially large grids (up to 10⁵ cells) without repeatedly scanning the same cells.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- m = 4, n = 4
- guards = [[0,0],[1,1],[3,3]]
- walls = [[0,1],[1,0],[2,2]]

**Step-by-step visualization:**

1. **Initial grid (4×4):** All cells start as unguarded (U)

   ```
   U U U U
   U U U U
   U U U U
   U U U U
   ```

2. **Place walls (W):** Walls block vision and cannot be guarded

   ```
   W U U U
   W U U U
   U U W U
   U U U U
   ```

3. **Place guards (G):** Guards occupy cells and can see in 4 directions

   ```
   G W U U
   W G U U
   U U W U
   U U U G
   ```

4. **Simulate guard vision:**
   - Guard at (0,0): Can only see down (right blocked by wall at (0,1))
     - (1,0): Already a wall
     - (2,0): Mark as guarded ✓
     - (3,0): Mark as guarded ✓
   - Guard at (1,1): Can see in all directions until walls/grid edges
     - Up: (0,1) is wall (stop)
     - Down: (2,1) ✓, (3,1) ✓
     - Left: (1,0) is wall (stop)
     - Right: (1,2) ✓, (1,3) ✓
   - Guard at (3,3): Can see left and up
     - Up: (2,3) ✓, (1,3) already guarded ✓, (0,3) ✓
     - Left: (3,2) ✓, (3,1) already guarded ✓, (3,0) already guarded ✓

5. **Final grid:**

   ```
   G W ✓ ✓
   W G ✓ ✓
   ✓ ✓ W ✓
   ✓ ✓ ✓ G
   ```

6. **Count unguarded cells:** Only cells marked 'U' remain. In this case: **0 unguarded cells**.

## Brute Force Approach

A naive approach would be to simulate each guard's vision independently by scanning in all four directions until hitting obstacles. For each guard, we'd scan up to O(m+n) cells in each direction, leading to O(k×(m+n)) time where k is the number of guards.

**Why this is inefficient:**

- With up to m×n = 10⁵ cells and potentially many guards, we could repeatedly scan the same cells
- Worst case: All cells are guards except walls → O(m×n×(m+n)) operations
- Example: 100×100 grid with 5000 guards → ~5000×200 = 1M operations per guard direction

The brute force fails because it doesn't leverage the fact that once a cell is marked as guarded, we don't need to process it again from other guards in the same direction.

## Optimized Approach

The key insight is to **process each row and column separately** and **mark cells as guarded only until we hit obstacles**. We can use a 2D array to track:

1. Guard positions
2. Wall positions
3. Guarded cells

**Optimal strategy:**

1. Mark all guard and wall positions in the grid
2. For each row, scan left-to-right and right-to-left to mark cells visible to guards in that row
3. For each column, scan top-to-bottom and bottom-to-top to mark cells visible to guards in that column
4. Count cells that are neither guards, walls, nor guarded

**Why this works:**

- Each cell is visited at most 4 times (once per direction scan)
- We stop scanning when we hit walls or grid boundaries
- We only propagate guard vision when the current cell is a guard
- Time complexity becomes O(m×n) instead of O(k×(m+n))

## Optimal Solution

<div class="code-group">

```python
# Time: O(m × n) | Space: O(m × n)
def countUnguarded(m: int, n: int, guards: List[List[int]], walls: List[List[int]]) -> int:
    # Create grid with 0 = empty, 1 = guard, 2 = wall, 3 = guarded
    grid = [[0] * n for _ in range(m)]

    # Mark guards and walls
    for r, c in guards:
        grid[r][c] = 1
    for r, c in walls:
        grid[r][c] = 2

    # Helper function to mark guarded cells in a direction
    def mark_guarded(start_r, start_c, dr, dc):
        r, c = start_r + dr, start_c + dc
        # Continue while within bounds and not blocked by wall or guard
        while 0 <= r < m and 0 <= c < n and grid[r][c] < 2:
            grid[r][c] = 3  # Mark as guarded
            r += dr
            c += dc

    # Process each guard's vision in all 4 directions
    for r, c in guards:
        # Up (dr = -1, dc = 0)
        mark_guarded(r, c, -1, 0)
        # Down (dr = 1, dc = 0)
        mark_guarded(r, c, 1, 0)
        # Left (dr = 0, dc = -1)
        mark_guarded(r, c, 0, -1)
        # Right (dr = 0, dc = 1)
        mark_guarded(r, c, 0, 1)

    # Count unguarded cells (value = 0)
    unguarded_count = 0
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 0:
                unguarded_count += 1

    return unguarded_count
```

```javascript
// Time: O(m × n) | Space: O(m × n)
function countUnguarded(m, n, guards, walls) {
  // Create grid: 0 = empty, 1 = guard, 2 = wall, 3 = guarded
  const grid = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  // Mark guards
  for (const [r, c] of guards) {
    grid[r][c] = 1;
  }

  // Mark walls
  for (const [r, c] of walls) {
    grid[r][c] = 2;
  }

  // Helper function to mark guarded cells in a direction
  const markGuarded = (startR, startC, dr, dc) => {
    let r = startR + dr;
    let c = startC + dc;

    // Continue while within bounds and not blocked
    while (r >= 0 && r < m && c >= 0 && c < n && grid[r][c] < 2) {
      grid[r][c] = 3; // Mark as guarded
      r += dr;
      c += dc;
    }
  };

  // Process each guard's vision
  for (const [r, c] of guards) {
    // Up
    markGuarded(r, c, -1, 0);
    // Down
    markGuarded(r, c, 1, 0);
    // Left
    markGuarded(r, c, 0, -1);
    // Right
    markGuarded(r, c, 0, 1);
  }

  // Count unguarded cells
  let unguardedCount = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 0) {
        unguardedCount++;
      }
    }
  }

  return unguardedCount;
}
```

```java
// Time: O(m × n) | Space: O(m × n)
class Solution {
    public int countUnguarded(int m, int n, int[][] guards, int[][] walls) {
        // Grid values: 0 = empty, 1 = guard, 2 = wall, 3 = guarded
        int[][] grid = new int[m][n];

        // Mark guards
        for (int[] guard : guards) {
            grid[guard[0]][guard[1]] = 1;
        }

        // Mark walls
        for (int[] wall : walls) {
            grid[wall[0]][wall[1]] = 2;
        }

        // Process each guard's vision
        for (int[] guard : guards) {
            int r = guard[0];
            int c = guard[1];

            // Up
            markGuarded(grid, r, c, -1, 0);
            // Down
            markGuarded(grid, r, c, 1, 0);
            // Left
            markGuarded(grid, r, c, 0, -1);
            // Right
            markGuarded(grid, r, c, 0, 1);
        }

        // Count unguarded cells
        int unguardedCount = 0;
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 0) {
                    unguardedCount++;
                }
            }
        }

        return unguardedCount;
    }

    private void markGuarded(int[][] grid, int startR, int startC, int dr, int dc) {
        int r = startR + dr;
        int c = startC + dc;
        int m = grid.length;
        int n = grid[0].length;

        // Continue while within bounds and not blocked by wall or guard
        while (r >= 0 && r < m && c >= 0 && c < n && grid[r][c] < 2) {
            grid[r][c] = 3;  // Mark as guarded
            r += dr;
            c += dc;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- We iterate through all guards and walls once: O(g + w) where g = guards.length, w = walls.length
- Each guard processes up to 4 directions, but each cell in each direction is visited at most once
- The nested loops for counting unguarded cells: O(m × n)
- Overall: O(m × n) since g + w ≤ m × n

**Space Complexity:** O(m × n)

- We store the m × n grid to track cell states
- No additional significant data structures needed
- Auxiliary space for recursion/iteration is O(1)

## Common Mistakes

1. **Not stopping at walls correctly:** Some candidates continue scanning past walls. Remember: walls block guard vision completely. The condition `grid[r][c] < 2` ensures we stop at both walls (value 2) and guards (value 1).

2. **Forgetting that guards block vision:** Guards cannot see through other guards. If guard A is behind guard B in the same direction, guard A's vision is blocked. Our solution handles this because guards have value 1, which is < 2, so we continue, but we mark the cell as guarded (value 3) which doesn't block vision.

3. **Double-counting or incorrect state management:** Using boolean arrays for multiple states can lead to confusion. The integer encoding (0=empty, 1=guard, 2=wall, 3=guarded) makes state transitions clear and prevents overwriting guard/wall positions.

4. **Off-by-one errors in boundary checking:** When scanning directions, ensure you check `0 <= r < m` not `0 <= r <= m`. The loop should stop when r equals m or c equals n (out of bounds).

## When You'll See This Pattern

This "directional propagation until obstacle" pattern appears in several grid-based problems:

1. **Bomb Enemy (Medium):** Calculate how many enemies a bomb can kill in four directions until hitting walls. Almost identical propagation logic.

2. **Available Captures for Rook (Easy):** A rook in chess moves until hitting another piece. Count available captures in four directions.

3. **Robot Room Cleaner (Hard):** The robot moves until hitting obstacles, similar directional movement.

4. **Number of Islands variations:** Often involve scanning in directions until hitting water (obstacles).

The core technique is: **Scan in straight lines from source points, marking/processing cells until hitting stopping conditions (obstacles or boundaries).**

## Key Takeaways

1. **Directional propagation problems** often benefit from processing each direction separately with while loops that continue until hitting obstacles.

2. **State encoding** with integers (or enums) is cleaner than multiple boolean arrays when cells can have multiple mutually exclusive states.

3. **Think in terms of rays/beams** from sources rather than individual cell checks. Once a cell is marked in a direction, you don't need to reprocess it from other sources in that same direction scan.

4. **Grid problems with up to 10⁵ cells** typically need O(m×n) solutions. If your solution has higher complexity, look for ways to avoid repeated work.

Related problems: [Bomb Enemy](/problem/bomb-enemy), [Available Captures for Rook](/problem/available-captures-for-rook)
