---
title: "How to Solve Escape a Large Maze — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Escape a Large Maze. Hard difficulty, 36.3% acceptance rate. Topics: Array, Hash Table, Depth-First Search, Breadth-First Search."
date: "2029-06-14"
category: "dsa-patterns"
tags: ["escape-a-large-maze", "array", "hash-table", "depth-first-search", "hard"]
---

# How to Solve Escape a Large Maze

You're given a massive 1,000,000 × 1,000,000 grid with blocked cells, a starting point, and a target. You need to determine if you can reach the target from the start without passing through blocked cells. The challenge is that the grid is too large to explore entirely, so you need a smarter approach than traditional BFS/DFS.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have:

- Grid: 10×10 (smaller for illustration)
- Start: (0, 0)
- Target: (9, 9)
- Blocked: [(1, 0), (0, 1), (1, 1)]

```
Grid (X marks blocked):
  0 1 2 3 4 5 6 7 8 9
0 S X . . . . . . . .
1 X X . . . . . . . .
2 . . . . . . . . . .
3 . . . . . . . . . .
4 . . . . . . . . . .
5 . . . . . . . . . .
6 . . . . . . . . . .
7 . . . . . . . . . .
8 . . . . . . . . . .
9 . . . . . . . . . T
```

The key insight: With only 200 blocked cells (the problem's maximum), they can only block a limited area. If you can explore enough cells from the start without hitting the target, you're either:

1. Completely surrounded by blocked cells (trapped)
2. Able to reach the target directly
3. Able to explore enough area to prove you're not trapped

The magic number: With 200 blocked cells, the maximum area they can completely enclose is a triangle with 199 cells on each side, giving about 199×199/2 ≈ 19,801 cells. So if we can explore 20,000 cells from the start without finding the target, we must be trapped. Similarly, if we can explore 20,000 cells from the target without finding the start, the target must be unreachable.

## Brute Force Approach

A naive approach would be standard BFS/DFS on the entire grid:

1. Mark all blocked cells as visited
2. Start BFS from source
3. If we reach target, return true
4. If queue empties, return false

**Why this fails:**

- The grid has 1 trillion cells (1,000,000 × 1,000,000)
- BFS would need to explore potentially billions of cells
- Time and memory would be astronomical
- Even with blocked cells limiting exploration, we can't store visited for all cells

The brute force teaches us we need to limit exploration somehow.

## Optimized Approach

The key insight is **bounded exploration with two-way search**:

1. **Blocking power is limited**: With only 200 blocked cells, they can only create a finite-sized enclosure. The maximum area they can completely surround is roughly 20,000 cells.

2. **Two-way BFS**: Search from both source and target simultaneously. If either search:
   - Reaches the other point → path exists
   - Explores more than 20,000 cells → not trapped by blocked cells
   - Gets stuck (queue empty) → trapped

3. **Early termination**: We stop searching when we've explored enough cells to prove we're not trapped (20,000) OR when we find the other point.

4. **Efficient storage**: Use hash sets for blocked cells and visited cells since coordinates are sparse.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(B^2) where B = 200 (max blocked cells)
# Space: O(B^2) for visited sets
class Solution:
    def isEscapePossible(self, blocked, source, target):
        """
        Main function to determine if escape is possible.
        Uses bounded BFS from both source and target.
        """
        if not blocked:
            return True  # No obstacles, always reachable

        blocked_set = set(map(tuple, blocked))

        def bfs(start, goal):
            """
            BFS with bounded exploration.
            Returns:
                True if goal is reached
                False if trapped by blocked cells
                None if explored enough area (not trapped)
            """
            from collections import deque

            # Maximum cells we need to explore to prove we're not trapped
            # Based on maximum area blocked cells can enclose
            MAX_VISITED = 20000

            queue = deque([start])
            visited = set([tuple(start)])

            while queue and len(visited) < MAX_VISITED:
                x, y = queue.popleft()

                # Check if we reached the goal (other point)
                if [x, y] == goal:
                    return True

                # Explore 4 directions
                for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                    nx, ny = x + dx, y + dy

                    # Check bounds (0 to 999999 inclusive)
                    if 0 <= nx < 1000000 and 0 <= ny < 1000000:
                        if (nx, ny) not in visited and (nx, ny) not in blocked_set:
                            visited.add((nx, ny))
                            queue.append((nx, ny))

            # If we explored enough cells, we're not trapped
            if len(visited) >= MAX_VISITED:
                return None  # Special value meaning "not trapped"

            # Queue empty but didn't explore enough cells → trapped
            return False

        # Search from source to target
        source_result = bfs(source, target)
        if source_result is True:
            return True  # Direct path found
        if source_result is False:
            return False  # Source is trapped

        # Search from target to source
        target_result = bfs(target, source)
        if target_result is False:
            return False  # Target is trapped

        # Both searches explored enough cells without finding each other
        # This means neither is trapped, so path must exist
        return True
```

```javascript
// Time: O(B^2) where B = 200 (max blocked cells)
// Space: O(B^2) for visited sets
/**
 * @param {number[][]} blocked
 * @param {number[]} source
 * @param {number[]} target
 * @return {boolean}
 */
var isEscapePossible = function (blocked, source, target) {
  // Early return if no blocked cells
  if (blocked.length === 0) return true;

  // Convert blocked array to Set for O(1) lookup
  const blockedSet = new Set();
  for (const [x, y] of blocked) {
    blockedSet.add(`${x},${y}`);
  }

  // BFS with bounded exploration
  const bfs = (start, goal) => {
    const MAX_VISITED = 20000; // Magic number based on max blocked area
    const queue = [[start[0], start[1]]];
    const visited = new Set();
    visited.add(`${start[0]},${start[1]}`);

    while (queue.length > 0 && visited.size < MAX_VISITED) {
      const [x, y] = queue.shift();

      // Check if we reached the goal
      if (x === goal[0] && y === goal[1]) {
        return true;
      }

      // Explore 4 directions
      const directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ];
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;

        // Check bounds
        if (nx >= 0 && nx < 1000000 && ny >= 0 && ny < 1000000) {
          const key = `${nx},${ny}`;
          if (!visited.has(key) && !blockedSet.has(key)) {
            visited.add(key);
            queue.push([nx, ny]);
          }
        }
      }
    }

    // If we explored enough cells, we're not trapped
    if (visited.size >= MAX_VISITED) {
      return null; // Special value meaning "not trapped"
    }

    // Queue empty but didn't explore enough → trapped
    return false;
  };

  // Search from source to target
  const sourceResult = bfs(source, target);
  if (sourceResult === true) return true;
  if (sourceResult === false) return false;

  // Search from target to source
  const targetResult = bfs(target, source);
  if (targetResult === false) return false;

  // Both searches explored enough area → path exists
  return true;
};
```

```java
// Time: O(B^2) where B = 200 (max blocked cells)
// Space: O(B^2) for visited sets
import java.util.*;

class Solution {
    // Maximum cells to explore before concluding we're not trapped
    private static final int MAX_VISITED = 20000;
    private static final int[][] DIRECTIONS = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};

    public boolean isEscapePossible(int[][] blocked, int[] source, int[] target) {
        // Early return if no blocked cells
        if (blocked.length == 0) return true;

        // Store blocked cells in HashSet for O(1) lookup
        Set<String> blockedSet = new HashSet<>();
        for (int[] cell : blocked) {
            blockedSet.add(cell[0] + "," + cell[1]);
        }

        // Search from source to target
        Boolean sourceResult = bfs(source, target, blockedSet);
        if (sourceResult != null) {
            return sourceResult;  // True if path found, false if trapped
        }

        // Search from target to source
        Boolean targetResult = bfs(target, source, blockedSet);
        if (targetResult != null && !targetResult) {
            return false;  // Target is trapped
        }

        // Both searches explored enough area → path exists
        return true;
    }

    private Boolean bfs(int[] start, int[] goal, Set<String> blockedSet) {
        Queue<int[]> queue = new LinkedList<>();
        Set<String> visited = new HashSet<>();

        queue.offer(start);
        visited.add(start[0] + "," + start[1]);

        while (!queue.isEmpty() && visited.size() < MAX_VISITED) {
            int[] curr = queue.poll();
            int x = curr[0], y = curr[1];

            // Check if we reached the goal
            if (x == goal[0] && y == goal[1]) {
                return true;
            }

            // Explore 4 directions
            for (int[] dir : DIRECTIONS) {
                int nx = x + dir[0];
                int ny = y + dir[1];

                // Check bounds
                if (nx >= 0 && nx < 1000000 && ny >= 0 && ny < 1000000) {
                    String key = nx + "," + ny;
                    if (!visited.contains(key) && !blockedSet.contains(key)) {
                        visited.add(key);
                        queue.offer(new int[]{nx, ny});
                    }
                }
            }
        }

        // If we explored enough cells, we're not trapped
        if (visited.size() >= MAX_VISITED) {
            return null;  // Special value meaning "not trapped"
        }

        // Queue empty but didn't explore enough → trapped
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(B²) where B = 200**

- We explore at most 20,000 cells from each point (source and target)
- 20,000 = B²/2 where B is max blocked cells (200)
- Each cell exploration is O(1) due to hash set lookups
- Total: O(40,000) = O(40,000) operations

**Space Complexity: O(B²)**

- We store visited cells for each BFS: up to 20,000 each
- Blocked set stores at most 200 cells
- Total: O(40,000 + 200) = O(40,200) = O(B²)

The key is that complexity depends on the number of blocked cells, not the grid size!

## Common Mistakes

1. **Forgetting the grid bounds**: The grid goes from 0 to 999,999 inclusive. Candidates often use ≤ 1,000,000 or forget to check bounds entirely.

2. **Using DFS instead of BFS**: DFS might explore deeply in one direction and miss the bounded area limit. BFS explores radially, which better detects enclosures.

3. **Not handling the "explored enough" case properly**: The three return states (true/false/not-trapped) need careful handling. Some candidates return true when they've explored enough cells, but that's incorrect—they should continue to check the other direction.

4. **Inefficient coordinate storage**: Using arrays or lists for visited cells is O(n) lookup. Always use hash sets with string or tuple keys for O(1) lookups.

## When You'll See This Pattern

This "bounded search" pattern appears in problems where:

- The search space is theoretically huge
- But constraints limit effective search area
- You need to prove reachability or connectivity

**Related problems:**

1. **Walls and Gates (LeetCode 286)**: Similar bounded BFS from multiple sources
2. **Shortest Path in Binary Matrix (LeetCode 1091)**: BFS with early termination
3. **Robot Room Cleaner (LeetCode 489)**: Limited visibility in infinite grid

The core technique is recognizing when exhaustive search is impossible and finding the mathematical bound that makes limited search sufficient.

## Key Takeaways

1. **Look for limiting constraints**: When faced with a huge search space, check if constraints (like max 200 blocked cells) create a bound on what needs to be explored.

2. **Two-way search is powerful**: Searching from both start and end can provide early termination and handle symmetric cases better.

3. **Mathematical bounds matter**: The 20,000 cell limit comes from the maximum area 200 blocked cells can enclose (roughly a triangle). Recognizing these combinatorial limits is key to optimization.

[Practice this problem on CodeJeet](/problem/escape-a-large-maze)
