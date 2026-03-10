---
title: "Matrix Questions at Lyft: What to Expect"
description: "Prepare for Matrix interview questions at Lyft — patterns, difficulty breakdown, and study tips."
date: "2031-03-06"
category: "dsa-patterns"
tags: ["lyft", "matrix", "interview prep"]
---

Matrix questions at Lyft occupy a unique niche in their interview landscape. With 2 out of 25 total questions tagged as Matrix, it's not a dominant category like Arrays or Strings, but its appearance is significant. In real interviews, this translates to a moderate chance of encountering one, especially for roles involving mapping, routing, or any spatial data processing—core to Lyft's business of moving people and things through physical space. A matrix problem at Lyft is rarely just an academic exercise; it's often a simplified abstraction of a real-world grid-like system, such as city blocks, driver availability maps, or surge pricing zones. Treating it as a secondary topic is a mistake; it's a focused, high-signal area where strong performance demonstrates spatial reasoning and systematic traversal skills highly valued in their engineering problems.

## Specific Patterns Lyft Favors

Lyft's Matrix problems tend to cluster around a few key patterns that mirror practical constraints. They heavily favor **graph traversal on implicit grids** over complex matrix manipulation or linear algebra.

1.  **Breadth-First Search (BFS) for Shortest Paths:** This is the single most important pattern. Questions often involve finding the shortest path, distance, or number of steps from a point to a target or to all other points in a grid with obstacles. Think "minimum time for a driver to reach a rider" or "propagation of surge pricing." Recursive DFS is less common here because BFS naturally finds the shortest path in unweighted grids.
2.  **Flood Fill via DFS/BFS:** Classic "island" or "region" counting problems, often with a twist. Instead of just counting, you might need to modify the matrix in-place (like marking visited cells) or calculate a property of the region (size, perimeter). This tests your ability to navigate connected components.
3.  **Dynamic Programming on Grids:** When they appear, DP problems are usually straightforward iterative 2D DP, not complex recursive memoization. Think "unique paths" or "minimum path sum" where you build the solution row by row, which is analogous to computing optimal routes or costs across a network.

You are very unlikely to see advanced graph theory (Dijkstra on a matrix is rare), complex rotations, or sparse matrix multiplication. The focus is on clean, efficient traversal.

For example, **Number of Islands (#200)** is a classic flood fill candidate. **Rotting Oranges (#994)** is a perfect example of multi-source BFS for propagation time. **Unique Paths (#62)** represents the simpler end of their DP spectrum.

## How to Prepare

Master the two core techniques: BFS for shortest path and DFS/BFS for flood fill. The key is to write the boilerplate code for these patterns flawlessly and then adapt it to the problem's constraints.

**Pattern 1: Multi-Source BFS for Shortest Path/Propagation**
This pattern is crucial for problems like "time to infect all cells" or "distance from multiple gates." You initialize the queue with _all_ starting points (sources) simultaneously.

<div class="code-group">

```python
from collections import deque
from typing import List

def multi_source_bfs(grid: List[List[int]]) -> int:
    if not grid:
        return -1

    rows, cols = len(grid), len(grid[0])
    queue = deque()
    # Step 1: Initialize queue with all sources and count fresh cells
    fresh_count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:  # Source (e.g., rotten orange, gate)
                queue.append((r, c))
            elif grid[r][c] == 1:  # Target to be reached (e.g., fresh orange)
                fresh_count += 1

    if fresh_count == 0:
        return 0

    # Step 2: Standard BFS with level tracking
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    minutes = 0

    while queue:
        # Process all nodes at the current minute/distance level
        for _ in range(len(queue)):
            r, c = queue.popleft()

            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                # Check bounds and if it's a "fresh" cell
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2  # Mark as visited/processed
                    queue.append((nr, nc))
                    fresh_count -= 1

        minutes += 1
        # Important: Only increment time if we processed new cells in this level
        # This avoids counting the final level where no new cells are added
        if not queue:
            minutes -= 1

    return minutes if fresh_count == 0 else -1

# Time: O(rows * cols) | Space: O(rows * cols) in worst-case for queue
```

```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
function multiSourceBFS(grid) {
  if (!grid || grid.length === 0) return -1;

  const rows = grid.length,
    cols = grid[0].length;
  const queue = [];
  let freshCount = 0;

  // Step 1: Initialize
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        queue.push([r, c]);
      } else if (grid[r][c] === 1) {
        freshCount++;
      }
    }
  }

  if (freshCount === 0) return 0;

  // Step 2: BFS
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let minutes = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of directions) {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          queue.push([nr, nc]);
          freshCount--;
        }
      }
    }
    minutes++;
    if (queue.length === 0) minutes--; // Adjust for final level
  }

  return freshCount === 0 ? minutes : -1;
}
// Time: O(rows * cols) | Space: O(rows * cols)
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class Solution {
    public int multiSourceBFS(int[][] grid) {
        if (grid == null || grid.length == 0) return -1;

        int rows = grid.length, cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshCount = 0;

        // Step 1: Initialize
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 2) {
                    queue.offer(new int[]{r, c});
                } else if (grid[r][c] == 1) {
                    freshCount++;
                }
            }
        }

        if (freshCount == 0) return 0;

        // Step 2: BFS
        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
        int minutes = 0;

        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            for (int i = 0; i < levelSize; i++) {
                int[] cell = queue.poll();
                int r = cell[0], c = cell[1];

                for (int[] dir : directions) {
                    int nr = r + dir[0], nc = c + dir[1];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        queue.offer(new int[]{nr, nc});
                        freshCount--;
                    }
                }
            }
            minutes++;
            if (queue.isEmpty()) minutes--; // Adjust for final level
        }

        return freshCount == 0 ? minutes : -1;
    }
}
// Time: O(rows * cols) | Space: O(rows * cols)
```

</div>

**Pattern 2: Flood Fill (DFS for Simplicity)**
For counting or marking connected components, DFS is often simpler to write.

<div class="code-group">

```python
from typing import List

def flood_fill_dfs(grid: List[List[str]], r: int, c: int, target: str, replacement: str):
    """Flood fill from (r, c) replacing 'target' with 'replacement'."""
    if not grid or grid[r][c] != target:
        return

    rows, cols = len(grid), len(grid[0])

    def dfs(row, col):
        # Base case: out of bounds or not the target cell
        if row < 0 or row >= rows or col < 0 or col >= cols or grid[row][col] != target:
            return

        # Process cell
        grid[row][col] = replacement

        # Recurse in 4 directions
        dfs(row + 1, col)
        dfs(row - 1, col)
        dfs(row, col + 1)
        dfs(row, col - 1)

    dfs(r, c)

# Time: O(rows * cols) | Space: O(rows * cols) for recursion stack in worst-case
```

```javascript
/**
 * @param {character[][]} grid
 * @param {number} r
 * @param {number} c
 * @param {string} target
 * @param {string} replacement
 * @return {void}
 */
function floodFillDFS(grid, r, c, target, replacement) {
  if (!grid || grid[r][c] !== target) return;

  const rows = grid.length,
    cols = grid[0].length;

  function dfs(row, col) {
    if (row < 0 || row >= rows || col < 0 || col >= cols || grid[row][col] !== target) {
      return;
    }

    grid[row][col] = replacement;

    dfs(row + 1, col);
    dfs(row - 1, col);
    dfs(row, col + 1);
    dfs(row, col - 1);
  }

  dfs(r, c);
}
// Time: O(rows * cols) | Space: O(rows * cols)
```

```java
public class Solution {
    public void floodFillDFS(char[][] grid, int r, int c, char target, char replacement) {
        if (grid == null || grid[r][c] != target) return;

        int rows = grid.length, cols = grid[0].length;
        dfs(grid, r, c, rows, cols, target, replacement);
    }

    private void dfs(char[][] grid, int row, int col, int rows, int cols, char target, char replacement) {
        if (row < 0 || row >= rows || col < 0 || col >= cols || grid[row][col] != target) {
            return;
        }

        grid[row][col] = replacement;

        dfs(grid, row + 1, col, rows, cols, target, replacement);
        dfs(grid, row - 1, col, rows, cols, target, replacement);
        dfs(grid, row, col + 1, rows, cols, target, replacement);
        dfs(grid, row, col - 1, rows, cols, target, replacement);
    }
}
// Time: O(rows * cols) | Space: O(rows * cols)
```

</div>

## How Lyft Tests Matrix vs Other Companies

Lyft's Matrix questions are typically **applied and of medium difficulty**. Compare this to other companies:

- **Google/Amazon:** Might ask more complex DP (e.g., "Cherry Pickup") or combine matrices with other data structures. Difficulty can be higher.
- **Meta:** Heavily favors recursion/backtracking on matrices (e.g., "Word Search"), testing your ability to handle complex state.
- **Lyft:** The twist is usually in the problem _scenario_ (e.g., time to rot all oranges, distance from gates) rather than in the algorithmic complexity. The core algorithm (BFS/DFS) remains standard. They test if you can recognize the underlying grid traversal pattern in a slightly novel context and implement it cleanly with correct edge cases (e.g., what if all cells are already "rotten"?). Efficiency is important, but clever optimizations are less critical than a complete, bug-free solution.

## Study Order

Tackle these sub-topics in this logical progression to build a solid foundation:

1.  **Basic Traversal & Flood Fill:** Start with DFS/BFS to simply visit all cells in a region. This teaches you the fundamental movement logic (directions array, bounds checking) and marking visited cells. Practice on **Number of Islands (#200)**.
2.  **BFS for Shortest Path:** Once comfortable visiting cells, learn to use BFS to find the _minimum_ steps. Understand why BFS is used over DFS here. Practice on **Rotting Oranges (#994)**.
3.  **Multi-Source BFS:** This is a key extension. Learn to initialize the queue with multiple starting points. Practice on **Walls and Gates (#286)** or **01 Matrix (#542)**.
4.  **Simple Dynamic Programming on Grids:** Finally, tackle DP problems where the state is your position in the grid. This builds on the idea of systematically moving through the matrix. Practice on **Unique Paths (#62)** and **Minimum Path Sum (#64)**.

This order works because each step uses skills from the previous one. You can't efficiently solve a shortest path problem if you're shaky on basic traversal.

## Recommended Practice Order

Solve these problems in sequence. Each introduces a new concept or slight twist on the previous pattern.

1.  **Number of Islands (#200)** - Master flood fill DFS/BFS.
2.  **Max Area of Island (#695)** - Adds the concept of counting within a region.
3.  **Rotting Oranges (#994)** - Introduces BFS for propagation/time with multiple sources.
4.  **01 Matrix (#542)** - Multi-source BFS from _two_ types of sources (0s). Great for solidifying the pattern.
5.  **Walls and Gates (#286)** - Classic multi-source BFS in a slightly different framing.
6.  **Unique Paths (#62)** - Introduces basic 2D DP.
7.  **Minimum Path Sum (#64)** - Applies the DP pattern with a cost function.

After this core set, if you have time, try **Surrounded Regions (#130)** for a tricky application of flood fill from the borders.

Remember, at Lyft, the goal is to demonstrate you can translate a real-world spatial problem into a clean grid traversal algorithm. Focus on pattern recognition and robust implementation over esoteric solutions.

[Practice Matrix at Lyft](/company/lyft/matrix)
