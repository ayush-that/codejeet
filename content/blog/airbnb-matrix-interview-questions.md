---
title: "Matrix Questions at Airbnb: What to Expect"
description: "Prepare for Matrix interview questions at Airbnb — patterns, difficulty breakdown, and study tips."
date: "2029-01-07"
category: "dsa-patterns"
tags: ["airbnb", "matrix", "interview prep"]
---

Matrix questions appear in about 11% of Airbnb's technical interview problems. For a company whose core business involves mapping listings, optimizing search rankings, and displaying calendar availability, two-dimensional data structures are a natural fit. Successfully navigating these problems demonstrates your ability to handle spatial data, implement efficient traversal, and manage complex state—skills directly applicable to features like the host calendar, search results grid, or map-based interfaces. A strong performance here signals you can think in the multi-dimensional terms often required for real-world product logic.

## What to Expect — Types of Problems

Airbnb's matrix problems typically fall into a few key categories. **Traversal and Search** questions are common, where you might be asked to walk through a grid in a spiral, perform a depth-first search (DFS) to find a region, or use breadth-first search (BFS) to find the shortest path. **Dynamic Programming on a Grid** is another frequent pattern, involving problems where you compute a minimum path sum or a maximal square. You may also encounter **Simulation** problems that require you to model a process over a grid, such as the "Game of Life," or **Modification-in-Place** challenges that ask you to transform a matrix according to specific rules without using extra space. The matrices are often not just numerical; they can represent maps (`'0'` for water, `'1'` for land), calendars, or other state-based systems.

## How to Prepare — Study Tips with One Code Example

Focus on mastering patterns, not memorizing problems. Start by ensuring you can flawlessly implement core traversals: DFS/BFS for islands, dynamic programming for path sums, and layer-by-layer processing for spirals. Practice writing these on a whiteboard or in a plain text editor. A critical skill is tracking visited cells—know when to use a separate `visited` matrix versus modifying the input in-place. Always clarify edge cases: empty matrices, 1xN rows, and single-cell grids.

A fundamental pattern is **Depth-First Search (DFS) on a Matrix**, used for problems like "Number of Islands." The key is to mark cells as visited as soon as you encounter them to avoid cycles and infinite recursion.

<div class="code-group">

```python
def num_islands(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '#'  # Mark as visited
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count
```

```javascript
function numIslands(grid) {
  if (!grid.length) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== "1") {
      return;
    }
    grid[r][c] = "#"; // Mark as visited
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}
```

```java
public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) {
        return 0;
    }

    int rows = grid.length;
    int cols = grid[0].length;
    int count = 0;

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1') {
                count++;
                dfs(grid, r, c);
            }
        }
    }
    return count;
}

private void dfs(char[][] grid, int r, int c) {
    int rows = grid.length;
    int cols = grid[0].length;

    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] != '1') {
        return;
    }

    grid[r][c] = '#'; // Mark as visited
    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}
```

</div>

## Recommended Practice Order

1.  **Master Traversal:** Start with "Number of Islands" (DFS/BFS) and "Spiral Matrix." These build intuition for moving through a grid.
2.  **Dynamic Programming:** Solve "Minimum Path Sum" and "Maximal Square." Learn to build a DP table from the grid.
3.  **Simulation & In-Place:** Attempt "Game of Life" and "Rotate Image." These test your ability to manage state and transform data within constraints.
4.  **Pathfinding & Advanced BFS:** Practice "Shortest Path in Binary Matrix" and "Walls and Gates." These combine traversal with distance tracking.

Consistently time yourself and verbalize your thought process as you practice. This mirrors the interview environment where communication is key.

[Practice Matrix at Airbnb](/company/airbnb/matrix)
