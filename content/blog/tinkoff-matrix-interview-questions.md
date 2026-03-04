---
title: "Matrix Questions at Tinkoff: What to Expect"
description: "Prepare for Matrix interview questions at Tinkoff — patterns, difficulty breakdown, and study tips."
date: "2030-12-30"
category: "dsa-patterns"
tags: ["tinkoff", "matrix", "interview prep"]
---

Matrix questions appear in nearly 20% of Tinkoff's technical interview problem set (5 out of 27 total). For a financial technology company that handles massive volumes of transactional and grid-based data, matrices are not an academic exercise—they are a direct reflection of real-world systems. Success here demonstrates you can manipulate structured data efficiently, a core skill for backend, data, and quantitative engineering roles at Tinkoff.

## What to Expect — Types of Problems

Tinkoff's matrix problems typically focus on practical applications over obscure mathematical tricks. Expect these core patterns:

1.  **Traversal & Pathfinding:** Modifying standard BFS/DFS to navigate a 2D grid, often with constraints (obstacles, cost limits). Problems may involve finding the shortest path or counting unique paths.
2.  **Dynamic Programming on Grids:** Using a 2D DP table to solve problems like minimum path sum, maximal square, or unique paths with obstacles.
3.  **In-place Modification:** Rotating or transposing a matrix without using extra space, reflecting Tinkoff's focus on memory-efficient solutions for large datasets.
4.  **Search in Sorted Matrix:** Searching for a target value in a matrix where rows and columns are sorted, testing your ability to optimize beyond a brute-force O(m\*n) check.
5.  **Simulation & State Change:** Modeling processes that evolve over discrete steps across a grid, such as game-of-life scenarios or infection spread models.

## How to Prepare — Study Tips with One Code Example

Master a systematic traversal approach first. For any matrix problem, immediately clarify: the dimensions (rows `m`, columns `n`), the movement directions (usually 4-directional or 8-directional), and what constitutes a valid cell. Practice writing clean, bug-free loops for iteration.

A fundamental pattern is **Depth-First Search (DFS) for island counting** or region exploration. The key is to mark visited cells _in-place_ to avoid using a separate visited matrix.

<div class="code-group">

```python
def num_islands(grid):
    if not grid:
        return 0
    count = 0
    rows, cols = len(grid), len(grid[0])

    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '#'  # Mark as visited
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count
```

```javascript
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  let count = 0;
  const rows = grid.length,
    cols = grid[0].length;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== "1") return;
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
    if (grid == null || grid.length == 0) return 0;
    int count = 0;
    int rows = grid.length, cols = grid[0].length;

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
    int rows = grid.length, cols = grid[0].length;
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] != '1') return;
    grid[r][c] = '#'; // Mark as visited
    dfs(grid, r+1, c);
    dfs(grid, r-1, c);
    dfs(grid, r, c+1);
    dfs(grid, r, c-1);
}
```

</div>

## Recommended Practice Order

1.  Start with basic traversal and modification (rotate image, set matrix zeroes).
2.  Move to DFS/BFS applications (number of islands, flood fill).
3.  Tackle dynamic programming on grids (minimum path sum, unique paths).
4.  Practice search in sorted matrices.
5.  Finally, combine patterns in simulation problems.

Build fluency by timing yourself and explaining your solution aloud as you would in an interview.

[Practice Matrix at Tinkoff](/company/tinkoff/matrix)
