---
title: "Matrix Questions at Goldman Sachs: What to Expect"
description: "Prepare for Matrix interview questions at Goldman Sachs — patterns, difficulty breakdown, and study tips."
date: "2027-08-02"
category: "dsa-patterns"
tags: ["goldman-sachs", "matrix", "interview prep"]
---

If you're preparing for Goldman Sachs interviews, you'll quickly notice they have a significant number of matrix problems in their question bank. With 27 out of 270 total questions, matrices make up a full 10% of their catalog. This isn't a coincidence—it's a deliberate focus area. In finance, matrices model everything from risk grids and trading positions to time-series data and correlation tables. At Goldman Sachs, you're not just solving abstract puzzles; you're practicing skills that directly translate to financial modeling and quantitative analysis.

The key insight is this: Goldman Sachs uses matrix problems as a proxy for assessing structured problem-solving with multi-dimensional data. They want to see if you can navigate complex state spaces efficiently—exactly what you'd do when analyzing market movements or portfolio exposures. In real interviews, you're more likely to encounter a matrix problem in the first or second technical round than at other companies where arrays and strings dominate.

## Specific Patterns Goldman Sachs Favors

Goldman Sachs matrix problems cluster around three distinct patterns, each testing a different cognitive skill.

**1. Modified BFS/DFS for Path Finding**
These aren't your standard "count islands" problems. Goldman Sachs prefers variations where the traversal rules change based on state. Think "minimum steps to reach target with obstacles you can break" (LeetCode #1293) or "collect all keys in a grid" (LeetCode #864). The twist is always in the state representation—you're not just tracking visited cells, but visited cells under specific conditions (keys collected, obstacles remaining, direction faced).

**2. In-Place Matrix Transformation**
This pattern tests your ability to operate under memory constraints while maintaining data integrity. Problems like "rotate image" (LeetCode #48) and "set matrix zeroes" (LeetCode #73) appear frequently. What Goldman Sachs looks for is your awareness of the trade-off between time and space, and your skill at manipulating multiple elements simultaneously without losing reference data.

**3. Dynamic Programming on Grids**
Here they lean toward classic iterative DP rather than recursive approaches. The favorite is the "minimum path sum" (LeetCode #64) problem and its variations where obstacles are introduced (LeetCode #63). The evaluation focuses on your ability to derive the recurrence relation and implement it with clean, efficient iteration.

<div class="code-group">

```python
# Pattern: Modified BFS with State (Shortest Path in a Grid with Obstacles Elimination - LeetCode #1293)
# Time: O(m * n * k) where k is the number of obstacles we can remove | Space: O(m * n * k)
from collections import deque

def shortestPath(grid, k):
    rows, cols = len(grid), len(grid[0])
    # State: (row, col, obstacles_removed)
    # Visited tracks the minimum obstacles removed to reach a cell
    visited = [[[float('inf')] * (k + 1) for _ in range(cols)] for _ in range(rows)]
    queue = deque([(0, 0, 0)])  # (r, c, obstacles_removed_so_far)
    visited[0][0][0] = 0
    steps = 0

    while queue:
        for _ in range(len(queue)):
            r, c, removed = queue.popleft()
            if r == rows - 1 and c == cols - 1:
                return steps

            for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    new_removed = removed + grid[nr][nc]
                    if new_removed <= k and visited[nr][nc][new_removed] > new_removed:
                        visited[nr][nc][new_removed] = new_removed
                        queue.append((nr, nc, new_removed))
        steps += 1
    return -1
```

```javascript
// Pattern: Modified BFS with State (Shortest Path in a Grid with Obstacles Elimination - LeetCode #1293)
// Time: O(m * n * k) | Space: O(m * n * k)
function shortestPath(grid, k) {
  const rows = grid.length,
    cols = grid[0].length;
  // visited[r][c][obstaclesRemoved] = min obstacles removed to reach (r,c)
  const visited = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => new Array(k + 1).fill(Infinity))
  );
  const queue = [[0, 0, 0]]; // [r, c, obstaclesRemoved]
  visited[0][0][0] = 0;
  let steps = 0;

  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c, removed] = queue.shift();
      if (r === rows - 1 && c === cols - 1) return steps;

      const directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ];
      for (const [dr, dc] of directions) {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const newRemoved = removed + grid[nr][nc];
          if (newRemoved <= k && visited[nr][nc][newRemoved] > newRemoved) {
            visited[nr][nc][newRemoved] = newRemoved;
            queue.push([nr, nc, newRemoved]);
          }
        }
      }
    }
    steps++;
  }
  return -1;
}
```

```java
// Pattern: Modified BFS with State (Shortest Path in a Grid with Obstacles Elimination - LeetCode #1293)
// Time: O(m * n * k) | Space: O(m * n * k)
import java.util.*;

public class Solution {
    public int shortestPath(int[][] grid, int k) {
        int rows = grid.length, cols = grid[0].length;
        // visited[r][c][obstaclesRemoved] = min obstacles removed to reach (r,c)
        int[][][] visited = new int[rows][cols][k + 1];
        for (int[][] matrix : visited) {
            for (int[] row : matrix) {
                Arrays.fill(row, Integer.MAX_VALUE);
            }
        }
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0, 0}); // {r, c, obstaclesRemoved}
        visited[0][0][0] = 0;
        int steps = 0;

        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int[] curr = queue.poll();
                int r = curr[0], c = curr[1], removed = curr[2];
                if (r == rows - 1 && c == cols - 1) return steps;

                int[][] directions = {{0,1},{0,-1},{1,0},{-1,0}};
                for (int[] dir : directions) {
                    int nr = r + dir[0], nc = c + dir[1];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        int newRemoved = removed + grid[nr][nc];
                        if (newRemoved <= k && visited[nr][nc][newRemoved] > newRemoved) {
                            visited[nr][nc][newRemoved] = newRemoved;
                            queue.offer(new int[]{nr, nc, newRemoved});
                        }
                    }
                }
            }
            steps++;
        }
        return -1;
    }
}
```

</div>

## How to Prepare

Master the state-space expansion technique shown above. When you encounter any matrix problem at Goldman Sachs, ask yourself: "What additional dimension(s) do I need to track beyond row and column?" This could be:

- Number of obstacles removed/remaining
- Keys collected (as a bitmask)
- Direction currently facing
- Remaining fuel or steps

Practice implementing BFS with a 3D/4D visited array until it becomes mechanical. Then focus on in-place operations—learn the layer-by-layer rotation approach and the two-pass technique for setting matrix zeroes.

## How Goldman Sachs Tests Matrix vs Other Companies

At FAANG companies, matrix problems often test raw algorithmic cleverness—think "word search" with backtracking or complex union-find applications. At Goldman Sachs, the emphasis is different: they prioritize **correctness under constraints** and **efficient state management**.

Their problems tend to have clearer business analogs. A "minimum path sum" isn't just an algorithm exercise; it's portfolio optimization. "Rotate image" isn't just a trick question; it's data transformation for reporting. The difficulty is often in the implementation details rather than the algorithmic insight—they want to see you handle edge cases and optimize space usage.

What's unique is their focus on **deterministic state transitions**. Unlike Google's love for probability-based matrix problems or Meta's preference for social network graph representations, Goldman Sachs problems have clear rules and measurable outcomes.

## Study Order

Follow this progression to build competence systematically:

1. **Basic Traversal (BFS/DFS)** - Start with standard flood fill and island counting. You need the muscle memory for moving through grids before adding complexity.
2. **In-Place Operations** - Learn to rotate and transpose without extra space. This teaches you to think about multiple simultaneous operations.
3. **Simple DP on Grids** - Practice minimum path sum and unique paths. Understand how to build solutions from subproblems.
4. **BFS/DFS with State** - This is the Goldman Sachs specialty. Start with one additional state (like "keys collected"), then move to multiple states.
5. **Complex DP with State Compression** - Some problems require tracking patterns across rows (like "maximal rectangle"). These are advanced but appear in senior roles.

## Recommended Practice Order

Solve these problems in sequence:

1. **Number of Islands (LeetCode #200)** - Standard BFS/DFS warm-up
2. **Rotate Image (LeetCode #48)** - Master in-place transformation
3. **Set Matrix Zeroes (LeetCode #73)** - Learn the two-pass technique
4. **Minimum Path Sum (LeetCode #64)** - Foundational DP
5. **Unique Paths II (LeetCode #63)** - DP with obstacles
6. **Walls and Gates (LeetCode #286)** - Multi-source BFS
7. **Shortest Path in a Grid with Obstacles Elimination (LeetCode #1293)** - The quintessential Goldman Sachs problem
8. **Shortest Path to Get All Keys (LeetCode #864)** - Advanced state BFS
9. **Max Area of Island (LeetCode #695)** - Variation with optimization
10. **Robot Room Cleaner (LeetCode #489)** - If you have time, this tests stateful traversal (less common but good practice)

The through-line in all these problems is managing complexity through careful state representation. At Goldman Sachs, they're not just testing if you can solve the problem—they're evaluating how you model real-world constraints in a computational framework.

[Practice Matrix at Goldman Sachs](/company/goldman-sachs/matrix)
