---
title: "Depth-First Search Questions at Uber: What to Expect"
description: "Prepare for Depth-First Search interview questions at Uber — patterns, difficulty breakdown, and study tips."
date: "2027-06-11"
category: "dsa-patterns"
tags: ["uber", "depth-first-search", "interview prep"]
---

Depth-First Search (DFS) is a fundamental algorithm for navigating graphs and trees, which are data structures that model Uber's core systems. Whether mapping city streets as a graph of intersections, managing ride dispatch trees, or analyzing network dependencies in backend services, the ability to traverse connected data is essential. With 50 specific DFS questions in their interview question bank, Uber clearly tests for this skill. Your ability to implement DFS recursively and iteratively, and to adapt it to solve complex problems, is a direct indicator of your competency in handling real-world spatial and hierarchical data at scale.

## What to Expect — Types of Problems

Uber's DFS questions typically extend beyond simple traversal. You will need to recognize how to model the problem as a graph search.

- **Pathfinding in Grids:** Classic matrix traversal problems, such as counting islands, finding a specific path, or evaluating reachable areas, directly model urban mapping and navigation challenges.
- **Tree Serialization/Deserialization:** Converting a tree (like a ride request hierarchy or a location tree) into a storable format and back is a common problem that tests your understanding of tree structure and DFS order.
- **Cycle Detection and Dependency Resolution:** In system design scenarios, you might need to detect circular dependencies in service calls or resolve task ordering, which uses a modified DFS for topological sorting.
- **Backtracking Problems:** These are DFS with state pruning. You'll encounter problems like generating valid combinations (e.g., possible ride routes under constraints) or puzzle-solving, where you explore choices and revert (backtrack) upon hitting a dead end.

## How to Prepare — Study Tips with One Code Example

Master the recursive template first, as it's the most intuitive for backtracking and path problems. Then, learn the iterative stack-based implementation to avoid recursion limits and for explicit control. Always clarify graph properties: is it a tree, a directed/undirected graph, and could there be cycles? Your algorithm must handle visited nodes to avoid infinite loops.

A key pattern is using DFS for **connected components in a grid**. This is the core of the "Number of Islands" problem. The algorithm marks each visited land cell ('1') to avoid double-counting and recursively explores all four adjacent directions.

<div class="code-group">

```python
def numIslands(grid):
    if not grid:
        return 0

    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '#'  # Mark as visited
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)

    rows, cols = len(grid), len(grid[0])
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                count += 1
    return count
```

```javascript
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;

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

  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        dfs(r, c);
        count++;
      }
    }
  }
  return count;
}
```

```java
public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;

    int rows = grid.length;
    int cols = grid[0].length;
    int count = 0;

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1') {
                dfs(grid, r, c, rows, cols);
                count++;
            }
        }
    }
    return count;
}

private void dfs(char[][] grid, int r, int c, int rows, int cols) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] != '1') {
        return;
    }
    grid[r][c] = '#'; // Mark as visited
    dfs(grid, r + 1, c, rows, cols);
    dfs(grid, r - 1, c, rows, cols);
    dfs(grid, r, c + 1, rows, cols);
    dfs(grid, r, c - 1, rows, cols);
}
```

</div>

## Recommended Practice Order

1.  Start with fundamental traversals on binary trees (pre-order, in-order, post-order).
2.  Move to classic grid-based DFS (Number of Islands, Word Search).
3.  Practice pathfinding and backtracking problems (All Paths From Source to Target, Subsets).
4.  Tackle cycle detection and topological sort problems (Course Schedule, Graph Valid Tree).
5.  Finally, solve Uber's tagged DFS questions to familiarize yourself with their specific problem style and difficulty curve.

[Practice Depth-First Search at Uber](/company/uber/depth-first-search)
