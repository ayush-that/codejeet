---
title: "Matrix Questions at Flipkart: What to Expect"
description: "Prepare for Matrix interview questions at Flipkart — patterns, difficulty breakdown, and study tips."
date: "2028-05-02"
category: "dsa-patterns"
tags: ["flipkart", "matrix", "interview prep"]
---

Matrix questions appear in roughly 14% of Flipkart's technical interview problems. For a company managing massive logistics, inventory grids, and recommendation systems, matrices are a direct representation of real-world data structures. Your ability to traverse, transform, and analyze 2D arrays efficiently is a strong signal of how you might handle data at scale. Expect these problems to test not just your algorithmic skills, but also your capacity to translate a business scenario—like warehouse slot management or user-item preference grids—into clean, optimized code.

## What to Expect — Types of Problems

Flipkart's matrix problems typically fall into three categories. First, **classical traversal and search**: these include problems like searching in a row-wise and column-wise sorted matrix, or spiral traversal, which test your fundamental loop control and index manipulation. Second, **dynamic programming on grids**: questions like finding unique paths, minimum path sums, or largest square submatrices are common, assessing your ability to break down complex problems into overlapping subproblems. Finally, **graph representations**: many matrix problems are essentially graph problems in disguise, where each cell is a node and adjacent moves are edges. This includes number of islands, rotten oranges, or shortest paths in a binary maze. Recognizing this underlying pattern is crucial.

## How to Prepare — Study Tips with One Code Example

Focus on mastering patterns, not memorizing solutions. Start by ensuring you can flawlessly write BFS/DFS for matrix traversal. Then, practice applying dynamic programming to grids. Always clarify edge cases like empty matrices or single-row inputs. A key pattern is **modifying the matrix in-place to mark visited cells**, often by temporarily changing values to avoid using extra space for a separate visited structure.

Here is a classic example: Rotting Oranges (BFS on a matrix). The goal is to find the minimum time for all fresh oranges to rot, where rotten oranges rot adjacent fresh ones each minute.

<div class="code-group">

```python
from collections import deque

def orangesRotting(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0
    minutes = 0

    # Initialize queue with all initially rotten oranges
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh_count += 1

    # Directions for 4 adjacent cells
    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    # BFS
    while queue and fresh_count > 0:
        minutes += 1
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2  # Mark as rotten
                    fresh_count -= 1
                    queue.append((nr, nc))

    return minutes if fresh_count == 0 else -1
```

```javascript
function orangesRotting(grid) {
  if (!grid.length) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;
  let minutes = 0;

  // Initialize queue and count fresh oranges
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        queue.push([r, c]);
      } else if (grid[r][c] === 1) {
        freshCount++;
      }
    }
  }

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // BFS
  while (queue.length > 0 && freshCount > 0) {
    minutes++;
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
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
  }

  return freshCount === 0 ? minutes : -1;
}
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class Solution {
    public int orangesRotting(int[][] grid) {
        if (grid == null || grid.length == 0) return 0;

        int rows = grid.length;
        int cols = grid[0].length;
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

        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};

        while (!queue.isEmpty() && freshCount > 0) {
            minutes++;
            int levelSize = queue.size();
            for (int i = 0; i < levelSize; i++) {
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
        }

        return freshCount == 0 ? minutes : -1;
    }
}
```

</div>

## Recommended Practice Order

1.  **Traversal Fundamentals**: Practice spiral matrix, diagonal traversal, and search in a sorted matrix.
2.  **BFS/DFS Applications**: Solve number of islands, rotten oranges, and shortest path in binary maze.
3.  **Dynamic Programming**: Work on unique paths, minimum path sum, and maximal square.
4.  **Advanced Patterns**: Tackle problems like matrix rotation, set matrix zeroes (in-place), and word search.

This progression builds from basic control flow to complex optimization, covering the core patterns Flipkart assesses.

[Practice Matrix at Flipkart](/company/flipkart/matrix)
