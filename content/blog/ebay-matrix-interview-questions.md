---
title: "Matrix Questions at eBay: What to Expect"
description: "Prepare for Matrix interview questions at eBay — patterns, difficulty breakdown, and study tips."
date: "2029-03-20"
category: "dsa-patterns"
tags: ["ebay", "matrix", "interview prep"]
---

Matrix questions appear in about 13% of eBay's technical interview problems. For a company managing vast inventories, user data, and real-time bidding systems, matrices are a natural structure for representing grids of data, image processing tasks, game boards, or adjacency in graphs. Success here demonstrates you can navigate 2D data efficiently—a core skill for backend and data-intensive roles.

## What to Expect — Types of Problems

eBay's matrix problems typically focus on traversal and transformation. You won't see overly complex mathematical puzzles; instead, expect practical, algorithmic challenges.

- **Traversal:** The most common type. This includes standard searches (DFS, BFS), spiral order traversal, or walking a matrix in a zigzag pattern. These test your ability to systematically visit every cell while managing boundaries and direction changes.
- **Dynamic Programming in Grids:** Problems where you find a minimum cost path, count unique paths from top-left to bottom-right, or solve similar optimization problems on a grid. These assess your ability to break down problems into overlapping subproblems.
- **Modification In-Place:** Tasks like rotating an image (matrix) 90 degrees, setting matrix cells to zero based on certain conditions, or applying a simple transformation without using extra space. These evaluate your understanding of index manipulation and space efficiency.
- **Search in Sorted Matrix:** Given a matrix where rows and columns are sorted, efficiently locate a target value. This tests your ability to leverage sorted properties to reduce time complexity.

## How to Prepare — Study Tips with One Code Example

Master a handful of core patterns. Practice writing clean, bug-free code for these without an IDE. Focus on perfecting your traversal logic and index math. Always clarify edge cases (empty matrix, 1x1 matrix) upfront.

A fundamental pattern is **Depth-First Search (DFS) traversal** for problems like "Number of Islands" or "Flood Fill." The key is to mark visited cells to avoid cycles and recursively explore all four directions.

<div class="code-group">

```python
def dfs(matrix, r, c, visited):
    # Check bounds and whether cell is valid/unvisited
    if (r < 0 or r >= len(matrix) or
        c < 0 or c >= len(matrix[0]) or
        matrix[r][c] == '0' or visited[r][c]):
        return

    visited[r][c] = True
    # Explore neighbors: down, up, right, left
    dfs(matrix, r + 1, c, visited)
    dfs(matrix, r - 1, c, visited)
    dfs(matrix, r, c + 1, visited)
    dfs(matrix, r, c - 1, visited)

# Example usage for counting islands
def numIslands(grid):
    if not grid:
        return 0
    count = 0
    visited = [[False] * len(grid[0]) for _ in range(len(grid))]
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == '1' and not visited[i][j]:
                dfs(grid, i, j, visited)
                count += 1
    return count
```

```javascript
function dfs(matrix, r, c, visited) {
  if (
    r < 0 ||
    r >= matrix.length ||
    c < 0 ||
    c >= matrix[0].length ||
    matrix[r][c] === "0" ||
    visited[r][c]
  ) {
    return;
  }
  visited[r][c] = true;
  // Explore neighbors: down, up, right, left
  dfs(matrix, r + 1, c, visited);
  dfs(matrix, r - 1, c, visited);
  dfs(matrix, r, c + 1, visited);
  dfs(matrix, r, c - 1, visited);
}

// Example usage for counting islands
function numIslands(grid) {
  if (!grid.length) return 0;
  let count = 0;
  const visited = Array.from({ length: grid.length }, () => new Array(grid[0].length).fill(false));
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "1" && !visited[i][j]) {
        dfs(grid, i, j, visited);
        count++;
      }
    }
  }
  return count;
}
```

```java
public void dfs(char[][] matrix, int r, int c, boolean[][] visited) {
    if (r < 0 || r >= matrix.length ||
        c < 0 || c >= matrix[0].length ||
        matrix[r][c] == '0' || visited[r][c]) {
        return;
    }
    visited[r][c] = true;
    // Explore neighbors: down, up, right, left
    dfs(matrix, r + 1, c, visited);
    dfs(matrix, r - 1, c, visited);
    dfs(matrix, r, c + 1, visited);
    dfs(matrix, r, c - 1, visited);
}

// Example usage for counting islands
public int numIslands(char[][] grid) {
    if (grid.length == 0) return 0;
    int count = 0;
    boolean[][] visited = new boolean[grid.length][grid[0].length];
    for (int i = 0; i < grid.length; i++) {
        for (int j = 0; j < grid[0].length; j++) {
            if (grid[i][j] == '1' && !visited[i][j]) {
                dfs(grid, i, j, visited);
                count++;
            }
        }
    }
    return count;
}
```

</div>

## Recommended Practice Order

1.  **Master Traversal:** Start with problems like "Number of Islands" (DFS/BFS) and "Spiral Matrix." These build foundational skills.
2.  **Learn Dynamic Programming on Grids:** Practice "Unique Paths" and "Minimum Path Sum." Understand how to build a DP table.
3.  **Tackle In-Place Operations:** Solve "Rotate Image" and "Set Matrix Zeroes." Practice index mapping.
4.  **Handle Sorted Searches:** Solve "Search a 2D Matrix II." Learn the "step-wise" linear search from the top-right corner.

[Practice Matrix at eBay](/company/ebay/matrix)
