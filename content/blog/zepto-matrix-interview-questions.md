---
title: "Matrix Questions at Zepto: What to Expect"
description: "Prepare for Matrix interview questions at Zepto — patterns, difficulty breakdown, and study tips."
date: "2030-12-04"
category: "dsa-patterns"
tags: ["zepto", "matrix", "interview prep"]
---

If you're preparing for Zepto interviews, you've likely seen the data: **4 out of their 28 tagged LeetCode problems are Matrix-based.** That's over 14% of their public problem set, a significant concentration that demands your attention. But what does this actually mean for your interview? Is it a core focus, or just a quirk of their question bank? Based on patterns from candidates and the nature of Zepto's business—a rapid grocery delivery service built on hyperlocal warehousing and logistics—the answer is clear: **Matrix problems are a primary screening tool because they directly model real-world operational grids.** Think warehouse shelf layouts (2D inventory arrays), delivery route maps (grid-based pathfinding), and catchment area optimizations (flood-fill style region analysis). They don't just ask these questions because they're hard; they ask them because they're relevant.

## Specific Patterns Zepto Favors

Zepto's matrix problems aren't about obscure mathematical transformations. They lean heavily on **applied graph traversal on a grid**, treating the matrix as an implicit graph where each cell is a node connected to its four (sometimes eight) neighbors. The focus is on **breadth-first search (BFS) for shortest path problems** and **depth-first search (DFS) or union-find for connected component analysis**.

You will rarely see complex dynamic programming on matrices (like maximal square) in early rounds. Instead, expect:

1.  **Multi-Source BFS:** Perfect for modeling multiple delivery drivers starting from several dark stores (warehouses) simultaneously. This is a classic Zepto pattern.
2.  **DFS with State Tracking:** For problems like checking a word exists on a board (LeetCode #79 "Word Search"), which mimics searching for a product SKU across a warehouse layout.
3.  **Iterative, Layer-by-Layer Traversal:** Problems requiring spiral order or diagonal traversal test your ability to navigate a grid systematically—a key skill for automated retrieval systems.

For example, **LeetCode #994 "Rotting Oranges"** is a quintessential multi-source BFS problem and a direct analogue. It models fresh produce (fresh oranges) becoming unavailable (rotting) over time, starting from multiple spoiled points, which mirrors inventory quality propagation from a few bad items.

<div class="code-group">

```python
from collections import deque
from typing import List

def orangesRotting(grid: List[List[int]]) -> int:
    """
    Multi-Source BFS to find minutes until all oranges are rotten.
    Time: O(m * n) | Space: O(m * n) for the queue in worst case.
    """
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0
    minutes = 0

    # Initialize: find all rotten oranges (multi-sources) and count fresh ones.
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh_count += 1

    # If no fresh oranges, no time is needed.
    if fresh_count == 0:
        return 0

    # Directions: up, down, left, right.
    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    # BFS in layers. Each layer represents one minute.
    while queue and fresh_count > 0:
        # Process all oranges that became rotten at the same time (current minute).
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                # If neighbor is a fresh orange, rot it and add to queue.
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh_count -= 1
                    queue.append((nr, nc))
        minutes += 1

    # If fresh oranges remain, return -1 (impossible).
    return minutes if fresh_count == 0 else -1
```

```javascript
/**
 * Multi-Source BFS to find minutes until all oranges are rotten.
 * Time: O(m * n) | Space: O(m * n) for the queue in worst case.
 */
function orangesRotting(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;
  let minutes = 0;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // Initialize queue with all rotten oranges and count fresh ones.
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

  while (queue.length > 0 && freshCount > 0) {
    // Process one full layer (all oranges rotten at the current minute).
    const layerSize = queue.length;
    for (let i = 0; i < layerSize; i++) {
      const [r, c] = queue.shift();
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          freshCount--;
          queue.push([nr, nc]);
        }
      }
    }
    minutes++;
  }

  return freshCount === 0 ? minutes : -1;
}
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class Solution {
    /**
     * Multi-Source BFS to find minutes until all oranges are rotten.
     * Time: O(m * n) | Space: O(m * n) for the queue in worst case.
     */
    public int orangesRotting(int[][] grid) {
        int rows = grid.length;
        int cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshCount = 0;
        int minutes = 0;
        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};

        // Initialize: find all rotten oranges and count fresh ones.
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

        while (!queue.isEmpty() && freshCount > 0) {
            int layerSize = queue.size();
            for (int i = 0; i < layerSize; i++) {
                int[] cell = queue.poll();
                int r = cell[0], c = cell[1];
                for (int[] dir : directions) {
                    int nr = r + dir[0];
                    int nc = c + dir[1];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        freshCount--;
                        queue.offer(new int[]{nr, nc});
                    }
                }
            }
            minutes++;
        }

        return freshCount == 0 ? minutes : -1;
    }
}
```

</div>

## How to Prepare

Your preparation should mirror the patterns above. Start by mastering the fundamental grid traversal techniques. The key is to write **clean, bug-free BFS/DFS without hesitation**. Use a standard direction vector `[(1,0), (-1,0), (0,1), (0,-1)]` and internalize the boundary checks. For BFS, remember to track layers when you need to measure distance or time, as shown in the "Rotting Oranges" solution.

When practicing DFS, as in **LeetCode #200 "Number of Islands"**, focus on the in-place modification pattern (marking visited cells by changing '1' to '0' or using a separate visited set). This is a building block for more complex problems.

<div class="code-group">

```python
from typing import List

def numIslands(grid: List[List[str]]) -> int:
    """
    DFS to count connected components of '1's.
    Time: O(m * n) | Space: O(m * n) in worst-case recursion depth.
    """
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    island_count = 0

    def dfs(r, c):
        # Base case: out of bounds or not land.
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        # Mark as visited by sinking the land.
        grid[r][c] = '0'
        # Explore all four neighbors.
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                island_count += 1
                dfs(r, c)

    return island_count
```

```javascript
/**
 * DFS to count connected components of '1's.
 * Time: O(m * n) | Space: O(m * n) in worst-case recursion depth.
 */
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let islandCount = 0;

  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== "1") {
      return;
    }
    grid[r][c] = "0"; // Mark as visited
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        islandCount++;
        dfs(r, c);
      }
    }
  }

  return islandCount;
}
```

```java
public class Solution {
    /**
     * DFS to count connected components of '1's.
     * Time: O(m * n) | Space: O(m * n) in worst-case recursion depth.
     */
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;

        int rows = grid.length;
        int cols = grid[0].length;
        int islandCount = 0;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    islandCount++;
                    dfs(grid, r, c, rows, cols);
                }
            }
        }
        return islandCount;
    }

    private void dfs(char[][] grid, int r, int c, int rows, int cols) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1') {
            return;
        }
        grid[r][c] = '0'; // Mark as visited
        dfs(grid, r + 1, c, rows, cols);
        dfs(grid, r - 1, c, rows, cols);
        dfs(grid, r, c + 1, rows, cols);
        dfs(grid, r, c - 1, rows, cols);
    }
}
```

</div>

## How Zepto Tests Matrix vs Other Companies

At large, established tech companies (FAANG), matrix problems often serve as a canvas for complex DP, advanced graph algorithms (like A\* search), or meticulous implementation challenges. At Zepto, the emphasis is different: **practicality and correctness under time pressure.** Their questions are more likely to be direct applications of BFS/DFS without many twists. The difficulty is not in the algorithm itself, but in executing it flawlessly while clearly communicating your thought process. They want to see if you can translate a real-world logistics problem into a clean grid traversal. The uniqueness is in this **applied, operational context**—you're not just finding a path, you're optimizing a delivery route or containing inventory spoilage.

## Study Order

Follow this progression to build a solid foundation:

1.  **Basic Traversal:** Learn to iterate through a matrix row/column, understanding indices. Practice problems that require simple conditional checks.
2.  **DFS on Grid:** Master the recursive "sink" pattern for connected components (Number of Islands). This teaches you to modify the grid in-place to track state.
3.  **BFS on Grid:** Understand queue-based layer-by-layer exploration. Start with single-source shortest path, then move to multi-source.
4.  **Pathfinding with Obstacles:** Apply BFS/DFS to grids with walls (0s and 1s). This adds a layer of conditional logic.
5.  **Optimization & Variations:** Tackle problems that require tracking additional state during traversal (e.g., using a separate matrix to store distances or a visited set with keys).

This order works because each step uses skills from the previous one. You can't efficiently implement multi-source BFS if you're still shaky on basic BFS mechanics.

## Recommended Practice Order

Solve these problems in sequence to build competency:

1.  **LeetCode #733 "Flood Fill"** - The simplest DFS. Perfect for getting comfortable with the recursion pattern.
2.  **LeetCode #200 "Number of Islands"** - The foundational connected components problem.
3.  **LeetCode #695 "Max Area of Island"** - A slight variation on #200 that requires counting during DFS.
4.  **LeetCode #542 "01 Matrix"** - An excellent introduction to **multi-source BFS**. This is a must-solve.
5.  **LeetCode #994 "Rotting Oranges"** - The canonical Zepto-style problem. Apply your multi-source BFS knowledge.
6.  **LeetCode #1091 "Shortest Path in Binary Matrix"** - A standard BFS shortest path problem on a grid, good for final reinforcement.

By following this path, you'll encounter the core patterns Zepto uses. Remember, their goal is to assess your fundamental problem-solving and coding skills in a context that mirrors their business. Your ability to write robust, clean grid traversal code will speak volumes.

[Practice Matrix at Zepto](/company/zepto/matrix)
