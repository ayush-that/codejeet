---
title: "Matrix Questions at Zomato: What to Expect"
description: "Prepare for Matrix interview questions at Zomato — patterns, difficulty breakdown, and study tips."
date: "2030-11-20"
category: "dsa-patterns"
tags: ["zomato", "matrix", "interview prep"]
---

Matrix questions appear in roughly 14% of Zomato's technical interviews (4 out of 29 total problems). For a company managing real-time data on restaurants, delivery logistics, and geospatial mapping, matrices are a natural structure for representing grids, maps, and tabular data. Success here demonstrates your ability to handle multi-dimensional data traversal and transformation—core skills for optimizing delivery routes, analyzing zone-based data, or processing image grids for menu scans.

## What to Expect — Types of Problems

Zomato's matrix problems typically focus on practical applications rather than abstract puzzles. Expect these categories:

- **Grid Traversal & Pathfinding:** Problems involving moving through a grid (representing a map or delivery area) to find a path, often with constraints. Examples include counting paths from a delivery hub to a location, or navigating around obstacles ("closed restaurants").
- **Matrix Transformation:** Modifying a matrix in-place, such as rotating an image of a food item or menu, or updating values based on neighboring cells. These test your understanding of index manipulation and space complexity.
- **Search in Sorted Matrix:** Searching for a target (like a specific restaurant ID or price point) in a matrix where rows and columns are sorted—a common pattern for efficient data lookup.
- **Connected Components:** Using Depth-First Search (DFS) or Breadth-First Search (BFS) on a matrix to find connected regions, akin to identifying contiguous delivery zones or clusters of restaurants.

The emphasis is on clean, efficient code that handles edge cases, as real-world data is often imperfect.

## How to Prepare — Study Tips with One Code Example

Master a few fundamental patterns rather than memorizing problems. Practice writing bug-free traversal code and performing in-place operations. Always clarify problem constraints (e.g., can the matrix be modified?) and walk through edge cases like empty matrices or 1x1 grids.

A critical pattern is **Depth-First Search (DFS) on a matrix** for problems involving connected cells, such as "counting islands" of deliverable areas. The core idea is to mark visited cells to avoid re-processing.

<div class="code-group">

```python
def dfs(matrix, i, j, visited):
    # Check boundaries and if cell is valid/not visited
    if (i < 0 or i >= len(matrix) or
        j < 0 or j >= len(matrix[0]) or
        matrix[i][j] == 0 or visited[i][j]):
        return
    visited[i][j] = True
    # Explore 4-directionally
    dfs(matrix, i+1, j, visited)
    dfs(matrix, i-1, j, visited)
    dfs(matrix, i, j+1, visited)
    dfs(matrix, i, j-1, visited)

def count_areas(matrix):
    if not matrix:
        return 0
    rows, cols = len(matrix), len(matrix[0])
    visited = [[False] * cols for _ in range(rows)]
    count = 0
    for i in range(rows):
        for j in range(cols):
            if matrix[i][j] == 1 and not visited[i][j]:
                dfs(matrix, i, j, visited)
                count += 1
    return count
```

```javascript
function dfs(matrix, i, j, visited) {
  if (
    i < 0 ||
    i >= matrix.length ||
    j < 0 ||
    j >= matrix[0].length ||
    matrix[i][j] === 0 ||
    visited[i][j]
  ) {
    return;
  }
  visited[i][j] = true;
  dfs(matrix, i + 1, j, visited);
  dfs(matrix, i - 1, j, visited);
  dfs(matrix, i, j + 1, visited);
  dfs(matrix, i, j - 1, visited);
}

function countAreas(matrix) {
  if (!matrix.length) return 0;
  const rows = matrix.length,
    cols = matrix[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  let count = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === 1 && !visited[i][j]) {
        dfs(matrix, i, j, visited);
        count++;
      }
    }
  }
  return count;
}
```

```java
public class MatrixDFS {
    public void dfs(int[][] matrix, int i, int j, boolean[][] visited) {
        if (i < 0 || i >= matrix.length ||
            j < 0 || j >= matrix[0].length ||
            matrix[i][j] == 0 || visited[i][j]) {
            return;
        }
        visited[i][j] = true;
        dfs(matrix, i+1, j, visited);
        dfs(matrix, i-1, j, visited);
        dfs(matrix, i, j+1, visited);
        dfs(matrix, i, j-1, visited);
    }

    public int countAreas(int[][] matrix) {
        if (matrix.length == 0) return 0;
        int rows = matrix.length, cols = matrix[0].length;
        boolean[][] visited = new boolean[rows][cols];
        int count = 0;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (matrix[i][j] == 1 && !visited[i][j]) {
                    dfs(matrix, i, j, visited);
                    count++;
                }
            }
        }
        return count;
    }
}
```

</div>

## Recommended Practice Order

Build competency in this sequence:

1.  **Basic Traversal:** Start with problems that require simple row/column iteration.
2.  **In-place Operations:** Practice rotating and transposing matrices without extra space.
3.  **Pathfinding:** Tackle BFS/DFS for shortest path or path count problems.
4.  **Search in Sorted Matrix:** Implement efficient binary-search inspired approaches.
5.  **Complex DFS/BFS:** Solve connected components and more advanced flood-fill variations.

Focus on writing correct, compilable code on your first try during practice to simulate interview conditions.

[Practice Matrix at Zomato](/company/zomato/matrix)
