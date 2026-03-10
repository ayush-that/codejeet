---
title: "Matrix Questions at DocuSign: What to Expect"
description: "Prepare for Matrix interview questions at DocuSign — patterns, difficulty breakdown, and study tips."
date: "2030-06-25"
category: "dsa-patterns"
tags: ["docusign", "matrix", "interview prep"]
---

If you're preparing for a DocuSign interview, you've probably noticed their question distribution: 5 out of 34 total questions are tagged as Matrix problems. That's nearly 15% of their technical question bank. This isn't a coincidence—it's a deliberate signal about what they value. DocuSign's core product revolves around document workflows, agreements, and digital transaction management. At scale, these systems often model data in grid-like structures: user permission matrices, document template layouts, routing workflows, or even visual signature placement coordinates. While you won't be implementing a digital signature algorithm in 45 minutes, you will be tested on your ability to navigate, transform, and reason about 2D data structures efficiently.

## Specific Patterns DocuSign Favors

DocuSign's Matrix questions lean heavily toward **graph traversal disguised as a grid**. They rarely ask pure mathematical matrix multiplication problems. Instead, they favor problems where each cell is a node, and movement between adjacent cells (up, down, left, right, sometimes diagonally) represents edges. The most common patterns are:

1. **Breadth-First Search (BFS) for shortest path or propagation problems** – Think "rotting oranges" or "gates and walls" scenarios.
2. **Depth-First Search (DFS) for connected components or area calculation** – Flood fill, island counting, or region exploration.
3. **In-place modification or rotation** – Less frequent, but appears in problems about rotating images or setting matrix zeroes.

A telltale sign of a DocuSign-style problem is the presence of a **"source" or "trigger" cell** that propagates outward. For example, in **Rotting Oranges (LeetCode #994)**, rotten oranges rot adjacent fresh ones each minute—this is a classic multi-source BFS problem. In **Walls and Gates (LeetCode #286)**, you fill each empty room with the distance to the nearest gate, which is essentially BFS from all gates simultaneously. These mirror real-world scenarios like permission propagation or workflow state changes.

## How to Prepare

The key is to master the multi-source BFS pattern. Single-source BFS (like from one gate) is straightforward, but DocuSign often uses the multi-source variant. Here's the template you must internalize:

<div class="code-group">

```python
from collections import deque
from typing import List

def multi_source_bfs(grid: List[List[int]]) -> int:
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    queue = deque()
    # Step 1: Initialize queue with all sources and track fresh count
    fresh_count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:  # Source (e.g., rotten orange)
                queue.append((r, c))
            elif grid[r][c] == 1:  # Target to be affected (e.g., fresh orange)
                fresh_count += 1

    if fresh_count == 0:
        return 0

    # Step 2: BFS layers
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    minutes = 0

    while queue and fresh_count > 0:
        # Process one complete layer (all nodes at current distance)
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2  # Mark as visited/affected
                    queue.append((nr, nc))
                    fresh_count -= 1
        minutes += 1

    return minutes if fresh_count == 0 else -1

# Time: O(rows * cols) – each cell visited at most once
# Space: O(rows * cols) – queue could hold all cells in worst case
```

```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
function multiSourceBFS(grid) {
  if (!grid.length) return 0;

  const rows = grid.length,
    cols = grid[0].length;
  const queue = [];
  let freshCount = 0;

  // Initialize
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
  let minutes = 0;

  while (queue.length > 0 && freshCount > 0) {
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
        if (grid == null || grid.length == 0) return 0;

        int rows = grid.length, cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshCount = 0;

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
        int minutes = 0;

        while (!queue.isEmpty() && freshCount > 0) {
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
        }

        return freshCount == 0 ? minutes : -1;
    }
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

</div>

The second pattern to master is DFS for connected components. DocuSign sometimes asks problems like **Number of Islands (LeetCode #200)** or **Max Area of Island (LeetCode #695)**. The twist they add is often a small constraint modification, like counting closed islands or islands with a specific shape.

## How DocuSign Tests Matrix vs Other Companies

Compared to other companies, DocuSign's Matrix questions have a distinct flavor:

- **Google** might ask more complex graph theory problems on grids (A\* search, union-find with path compression).
- **Meta** often mixes matrices with recursion or backtracking (word search, sudoku solver).
- **DocuSign** stays closer to **applied traversal problems**. They're less about clever algorithms and more about clean, bug-free implementation of BFS/DFS with correct edge case handling.

What's unique is their focus on **state propagation**—something changing over time across the grid. This directly mirrors their domain: a signed document triggers notifications, a workflow approval updates multiple dependent steps, etc. They want to see if you can model that progression in code.

## Study Order

1. **Basic Grid Traversal** – Learn to navigate a matrix with loops before anything else. Understand row/column boundaries.
2. **Depth-First Search (DFS) on Grid** – Start with recursive "flood fill" to get comfortable with marking visited cells. This builds intuition for connected components.
3. **Breadth-First Search (BFS) on Grid** – Learn single-source shortest path in unweighted grid. Understand why BFS gives the shortest path here.
4. **Multi-Source BFS** – This is the DocuSign specialty. Practice starting BFS from multiple points simultaneously.
5. **In-Place Modifications** – Learn to use the matrix itself to track state (like using a special value for "visited") to save space.
6. **Optimization Tweaks** – Sometimes you can early exit or use bidirectional BFS, but these are rare at DocuSign.

This order works because each step builds on the previous. You can't debug a multi-source BFS if you're shaky on basic BFS. You'll waste time on visited cell tracking if you haven't practiced DFS.

## Recommended Practice Order

Solve these problems in sequence:

1. **Number of Islands (LeetCode #200)** – Master DFS on grid.
2. **Rotting Oranges (LeetCode #994)** – The quintessential DocuSign pattern (multi-source BFS).
3. **Walls and Gates (LeetCode #286)** – Another multi-source BFS, but with a twist (you update distances).
4. **Max Area of Island (LeetCode #695)** – DFS with area calculation.
5. **01 Matrix (LeetCode #542)** – Multi-source BFS from zeros to find distance to nearest zero.
6. **Surrounded Regions (LeetCode #130)** – Combines traversal with in-place modification.

After these six, you'll have covered 90% of what DocuSign asks. If you have extra time, practice **Spiral Matrix (LeetCode #54)** for in-place iteration control, but prioritize the traversal problems.

Remember: DocuSign interviewers care about clean, maintainable code. They're evaluating whether you can write code that a teammate could understand and modify six months later. Comment your approach, name variables clearly (`minutes` not `m`, `freshCount` not `fc`), and verbally walk through your BFS layer logic. They'd rather see a perfectly implemented BFS than a buggy attempt at a fancy algorithm.

[Practice Matrix at DocuSign](/company/docusign/matrix)
