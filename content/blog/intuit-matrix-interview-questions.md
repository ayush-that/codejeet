---
title: "Matrix Questions at Intuit: What to Expect"
description: "Prepare for Matrix interview questions at Intuit — patterns, difficulty breakdown, and study tips."
date: "2028-10-31"
category: "dsa-patterns"
tags: ["intuit", "matrix", "interview prep"]
---

Matrix problems at Intuit aren't just another topic on a list—they're a direct reflection of the company's core business. Intuit builds financial and tax software (QuickBooks, TurboTax, Mint) that fundamentally deals with structured, tabular data: spreadsheets of transactions, grids of tax form fields, calendars of deadlines, and networks of financial relationships. When Intuit asks a matrix question in an interview, they're testing your ability to manipulate the kind of 2D data structures that power their products. With 8 dedicated matrix problems in their tagged LeetCode list (out of 71 total), it's a significant, focused area. In real interviews, especially for backend, data, or full-stack roles, you have a high probability of encountering at least one matrix problem, often in the second technical round.

## Specific Patterns Intuit Favors

Intuit's matrix problems tend to cluster around a few practical patterns rather than abstract graph theory. You won't often see complex dynamic programming on grids here. Instead, they favor **iterative traversal and state modification** that mirrors real data processing tasks.

The most common pattern by far is **Breadth-First Search (BFS) on a grid** for problems involving propagation or shortest path in an unweighted grid. Think "rotten oranges" or "flood fill" scenarios. A close second is **simulation and in-place modification**, where you traverse the matrix following specific rules to transform it, often requiring careful index management to avoid overwriting data you still need. Depth-First Search (DFS) appears, but usually in its iterative stack form for problems like "number of islands," as recursion depth can be a concern with large tax-form-sized grids.

Here are two LeetCode problems highly representative of Intuit's style:

1.  **Rotting Oranges (LeetCode #994)**: Classic BFS from multiple sources. Models a process spreading through a system—like a software update propagating through servers or an error state spreading through calculations.
2.  **Set Matrix Zeroes (LeetCode #73)**: A perfect example of in-place simulation with a constraint. It tests your ability to mark state without extra space, akin to batch-updating fields in a form.

## How to Prepare

Master the BFS queue pattern for grids. The key is to use a queue to process cells layer by layer, which guarantees the shortest path or propagation time in an unweighted grid. Always separate levels if you need to track "minutes" or "steps."

<div class="code-group">

```python
from collections import deque
from typing import List

def orangesRotting(grid: List[List[int]]) -> int:
    """
    LeetCode #994. Time: O(m*n), Space: O(m*n) in worst case.
    """
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0
    minutes = 0

    # Initialize: find all rotten oranges (sources) and count fresh ones.
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh_count += 1

    # If no fresh oranges, process took 0 minutes.
    if fresh_count == 0:
        return 0

    # Directions: up, down, left, right.
    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    # BFS by levels.
    while queue and fresh_count > 0:
        # Process all oranges at the current minute.
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                # If adjacent cell is fresh, rot it and add to queue.
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh_count -= 1
                    queue.append((nr, nc))
        minutes += 1

    return minutes if fresh_count == 0 else -1
```

```javascript
/**
 * LeetCode #994. Time: O(m*n), Space: O(m*n) in worst case.
 */
function orangesRotting(grid) {
  const rows = grid.length,
    cols = grid[0].length;
  const queue = [];
  let freshCount = 0;
  let minutes = 0;

  // Initialize queue and count fresh oranges.
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

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length > 0 && freshCount > 0) {
    // Process one level (all nodes at current minute).
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift();
      for (const [dr, dc] of directions) {
        const nr = r + dr,
          nc = c + dc;
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

// LeetCode #994. Time: O(m*n), Space: O(m*n) in worst case.
public class Solution {
    public int orangesRotting(int[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshCount = 0;
        int minutes = 0;

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

        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};

        while (!queue.isEmpty() && freshCount > 0) {
            int levelSize = queue.size();
            for (int i = 0; i < levelSize; i++) {
                int[] cell = queue.poll();
                int r = cell[0], c = cell[1];
                for (int[] dir : directions) {
                    int nr = r + dir[0], nc = c + dir[1];
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

For in-place simulation, the trick is to use the matrix itself for state marking. For "Set Matrix Zeroes," the optimal O(1) space solution uses the first row and first column as markers, but you must handle the first row/column's own status separately.

## How Intuit Tests Matrix vs Other Companies

Compared to other companies, Intuit's matrix questions are less about clever algorithmic tricks and more about **robust, bug-free implementation of a clear process**. At Google or Meta, you might get a matrix problem that's a thin disguise for a complex graph algorithm (e.g., "Word Search II" using a Trie). At Intuit, the problem statement usually describes a concrete, step-by-step transformation—like clearing rows and columns or calculating a rolling average from adjacent cells.

The difficulty is typically in the **medium** range on LeetCode. The challenge isn't deriving a novel algorithm; it's writing clean, efficient code that handles edge cases (empty matrices, single rows, all zeros, all ones) without errors. They care about code quality and maintainability, reflecting their focus on building reliable, long-lived financial software.

## Study Order

1.  **Basic Traversal:** Learn to iterate through a matrix with nested loops. Understand row-major vs. column-major order. This is foundational.
2.  **DFS on a Grid (Iterative):** Practice "Number of Islands" using a stack. Master the direction array pattern and visited marking. This teaches you to explore connected components, a core concept.
3.  **BFS on a Grid:** Move to queue-based traversal. This is crucial for shortest path and propagation problems, which are Intuit favorites. Understand why BFS is used over DFS here.
4.  **In-Place Modification:** Learn techniques to use the matrix itself for state, like the marker method in "Set Matrix Zeroes." This tests your ability to work within space constraints.
5.  **Simulation / Game of Life Type:** Practice problems where you apply rules to every cell based on its neighbors, often requiring a copy of the original state. This combines traversal with careful state management.

This order builds from simple access to exploration (DFS), then to layered exploration (BFS), and finally to stateful transformation—each step using skills from the previous one.

## Recommended Practice Order

Solve these problems in sequence to build the specific competency Intuit looks for:

1.  **Number of Islands (LeetCode #200):** Master iterative DFS/ BFS for component counting.
2.  **Rotting Oranges (LeetCode #994):** Solidify multi-source BFS and level tracking.
3.  **Set Matrix Zeroes (LeetCode #73):** Implement the O(1) space marking solution. This is a classic.
4.  **Game of Life (LeetCode #289):** Excellent practice for simulation with neighbor checks and in-place updating using bit masking.
5.  **Word Search (LeetCode #79):** A slight step up, combining DFS backtracking with a matrix. Tests your recursive thinking within bounds.
6.  **Spiral Matrix (LeetCode #54):** Practice precise index boundary management—a common need when processing tabular data.

This sequence takes you from core traversal to the simulation and state-management problems that are Intuit's sweet spot.

[Practice Matrix at Intuit](/company/intuit/matrix)
