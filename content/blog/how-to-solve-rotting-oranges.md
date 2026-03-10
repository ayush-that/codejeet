---
title: "How to Solve Rotting Oranges — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Rotting Oranges. Medium difficulty, 58.2% acceptance rate. Topics: Array, Breadth-First Search, Matrix."
date: "2026-07-08"
category: "dsa-patterns"
tags: ["rotting-oranges", "array", "breadth-first-search", "matrix", "medium"]
---

# How to Solve Rotting Oranges

You're given a grid representing oranges, where 0=empty, 1=fresh, and 2=rotten. Every minute, rotten oranges infect adjacent fresh oranges. You need to find the minimum minutes until no fresh oranges remain, or return -1 if some will never rot. The challenge is modeling this spreading infection efficiently across the grid.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:     Minute 0:    Minute 1:    Minute 2:
2 1 1     2 1 1        2 2 1        2 2 2
1 1 0     1 1 0        2 1 0        2 2 0
0 1 1     0 1 1        0 2 1        0 2 2
```

**Minute 0:** We start with rotten oranges at (0,0), (1,0), and (2,1). These are our initial "sources" of infection.

**Minute 1:** Each rotten orange infects its 4-directional neighbors:

- (0,0) infects (0,1) and (1,0) → but (1,0) is already rotten
- (1,0) infects (0,0), (2,0), (1,1) → (0,0) already rotten, (2,0) is empty, so only (1,1) becomes rotten
- (2,1) infects (1,1), (2,0), (2,2), (3,1) → (1,1) already becoming rotten, (2,0) empty, (3,1) out of bounds, so (2,2) becomes rotten

**Minute 2:** The new rotten oranges continue spreading until all fresh oranges are infected.

The key insight: This is a **multi-source BFS** problem. We need to track all rotten oranges simultaneously and process them in "waves" (minutes).

## Brute Force Approach

A naive approach might be to simulate minute-by-minute:

1. Scan the grid to find rotten oranges
2. For each rotten orange, mark adjacent fresh oranges as rotten
3. Repeat until no changes occur
4. Check if any fresh oranges remain

The problem with this approach is **inefficiency**. Each minute requires a full grid scan (O(m×n)), and we might need up to O(m×n) minutes in the worst case (like a single rotten orange at one corner infecting oranges across the entire grid). This gives us O((m×n)²) time complexity.

Even worse, we might get stuck in infinite loops if we're not careful about tracking which oranges became rotten in the current minute versus previous minutes.

## Optimized Approach

The optimal solution uses **Breadth-First Search (BFS)** with multiple starting points:

**Key Insight:** The infection spreads uniformly in all directions from all rotten oranges simultaneously. BFS processes nodes level by level, which perfectly matches our "minute by minute" requirement.

**Step-by-step reasoning:**

1. **Initialization:** Count fresh oranges and collect all initially rotten oranges into a queue
2. **BFS Traversal:** Process the queue level by level (each level = one minute)
   - For each rotten orange in the current level, check its 4 neighbors
   - If a neighbor is fresh, mark it as rotten, decrement fresh count, and add it to the queue for the next level
3. **Termination:** When the queue is empty, check if any fresh oranges remain
4. **Result:** The number of levels processed equals the minutes needed

**Why BFS works better than DFS:**

- BFS guarantees we find the shortest time (minimum minutes)
- DFS would explore one path deeply before others, potentially overcounting minutes
- BFS naturally processes all oranges that rot at the same time together

## Optimal Solution

<div class="code-group">

```python
# Time: O(m × n) | Space: O(m × n)
def orangesRotting(grid):
    """
    Calculate minimum minutes until all oranges rot using multi-source BFS.

    Args:
        grid: 2D list with values 0 (empty), 1 (fresh), 2 (rotten)

    Returns:
        Minimum minutes or -1 if some oranges never rot
    """
    if not grid or not grid[0]:
        return 0

    rows, cols = len(grid), len(grid[0])
    fresh_count = 0
    queue = []

    # Step 1: Initialize - count fresh oranges and collect rotten ones
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                fresh_count += 1
            elif grid[r][c] == 2:
                queue.append((r, c))  # Add initial rotten oranges

    # Step 2: BFS traversal - process level by level
    minutes = 0
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    # Continue BFS while there are rotten oranges to process AND fresh oranges remain
    while queue and fresh_count > 0:
        # Process all oranges that rot in the current minute
        minutes += 1
        # Store current level size to process this minute's oranges
        level_size = len(queue)

        for _ in range(level_size):
            r, c = queue.pop(0)  # Get next rotten orange

            # Check all 4 directions
            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                # Check bounds and if orange is fresh
                if (0 <= nr < rows and 0 <= nc < cols and
                    grid[nr][nc] == 1):
                    # Mark as rotten and add to queue for next minute
                    grid[nr][nc] = 2
                    fresh_count -= 1
                    queue.append((nr, nc))

    # Step 3: Check if any fresh oranges remain
    return -1 if fresh_count > 0 else minutes
```

```javascript
// Time: O(m × n) | Space: O(m × n)
function orangesRotting(grid) {
  /**
   * Calculate minimum minutes until all oranges rot using multi-source BFS.
   *
   * @param {number[][]} grid - 2D array with values 0 (empty), 1 (fresh), 2 (rotten)
   * @return {number} Minimum minutes or -1 if some oranges never rot
   */
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    return 0;
  }

  const rows = grid.length;
  const cols = grid[0].length;
  let freshCount = 0;
  const queue = [];

  // Step 1: Initialize - count fresh oranges and collect rotten ones
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        freshCount++;
      } else if (grid[r][c] === 2) {
        queue.push([r, c]); // Add initial rotten oranges
      }
    }
  }

  // Step 2: BFS traversal - process level by level
  let minutes = 0;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // Continue BFS while there are rotten oranges to process AND fresh oranges remain
  while (queue.length > 0 && freshCount > 0) {
    // Process all oranges that rot in the current minute
    minutes++;
    // Store current level size to process this minute's oranges
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift(); // Get next rotten orange

      // Check all 4 directions
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        // Check bounds and if orange is fresh
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          // Mark as rotten and add to queue for next minute
          grid[nr][nc] = 2;
          freshCount--;
          queue.push([nr, nc]);
        }
      }
    }
  }

  // Step 3: Check if any fresh oranges remain
  return freshCount > 0 ? -1 : minutes;
}
```

```java
// Time: O(m × n) | Space: O(m × n)
import java.util.LinkedList;
import java.util.Queue;

class Solution {
    public int orangesRotting(int[][] grid) {
        /**
         * Calculate minimum minutes until all oranges rot using multi-source BFS.
         *
         * @param grid 2D array with values 0 (empty), 1 (fresh), 2 (rotten)
         * @return Minimum minutes or -1 if some oranges never rot
         */
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }

        int rows = grid.length;
        int cols = grid[0].length;
        int freshCount = 0;
        Queue<int[]> queue = new LinkedList<>();

        // Step 1: Initialize - count fresh oranges and collect rotten ones
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 1) {
                    freshCount++;
                } else if (grid[r][c] == 2) {
                    queue.offer(new int[]{r, c});  // Add initial rotten oranges
                }
            }
        }

        // Step 2: BFS traversal - process level by level
        int minutes = 0;
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        // Continue BFS while there are rotten oranges to process AND fresh oranges remain
        while (!queue.isEmpty() && freshCount > 0) {
            // Process all oranges that rot in the current minute
            minutes++;
            // Store current level size to process this minute's oranges
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int[] current = queue.poll();
                int r = current[0];
                int c = current[1];

                // Check all 4 directions
                for (int[] dir : directions) {
                    int nr = r + dir[0];
                    int nc = c + dir[1];

                    // Check bounds and if orange is fresh
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                        grid[nr][nc] == 1) {
                        // Mark as rotten and add to queue for next minute
                        grid[nr][nc] = 2;
                        freshCount--;
                        queue.offer(new int[]{nr, nc});
                    }
                }
            }
        }

        // Step 3: Check if any fresh oranges remain
        return freshCount > 0 ? -1 : minutes;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We visit each cell at most twice: once during initialization and once when it becomes rotten
- Each cell's neighbors are checked at most once when it becomes rotten
- The BFS processes each rotten orange exactly once

**Space Complexity: O(m × n)**

- In the worst case, the queue might contain all cells (if all are rotten initially)
- However, typically it's much less since we only store rotten oranges
- The grid itself is O(m × n) but that's input space, not additional space

## Common Mistakes

1. **Not tracking level boundaries in BFS:** If you don't track level sizes with `levelSize = len(queue)`, you'll incorrectly calculate minutes. Each minute should process ALL oranges that became rotten in the previous minute.

2. **Forgetting to check if fresh oranges remain:** The problem requires returning -1 if some oranges never rot. Always check `freshCount > 0` at the end.

3. **Modifying the grid while iterating:** If you try to mark oranges as rotten during the same iteration you're checking them, you might process newly rotten oranges in the same minute. Always add new rotten oranges to the queue for the NEXT iteration.

4. **Not handling edge cases:**
   - Empty grid: return 0
   - No fresh oranges initially: return 0
   - No rotten oranges initially but fresh oranges exist: return -1 (can't start rotting)

## When You'll See This Pattern

This **multi-source BFS** pattern appears whenever you need to find the shortest distance from multiple starting points simultaneously:

1. **Walls and Gates (LeetCode 286):** Fill each empty room with the distance to the nearest gate. Gates are multiple starting points, just like rotten oranges.

2. **01 Matrix (LeetCode 542):** Find the distance of each cell to the nearest 0. All zeros are starting points for BFS.

3. **Shortest Bridge (LeetCode 934):** Find the shortest distance between two islands. One island serves as multiple starting points for BFS to reach the other.

The pattern: When you need to propagate something from multiple sources with uniform speed, and you need the minimum distance/time, think multi-source BFS.

## Key Takeaways

1. **Multi-source BFS** is the go-to approach for problems involving simultaneous propagation from multiple starting points with uniform speed.

2. **Level tracking is crucial** when you need to count "steps" or "minutes" in BFS. Always process each level completely before incrementing your step counter.

3. **Grid problems often reduce to graph problems:** Each cell is a node, adjacent cells are edges. BFS/DFS on grids follows the same principles as on graphs.

Related problems: [Walls and Gates](/problem/walls-and-gates), [Battleships in a Board](/problem/battleships-in-a-board), [Detonate the Maximum Bombs](/problem/detonate-the-maximum-bombs)
