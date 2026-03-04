---
title: "Depth-First Search Questions at Snapchat: What to Expect"
description: "Prepare for Depth-First Search interview questions at Snapchat — patterns, difficulty breakdown, and study tips."
date: "2028-07-17"
category: "dsa-patterns"
tags: ["snapchat", "depth-first-search", "interview prep"]
---

Depth-First Search (DFS) is a fundamental algorithm for exploring graphs and trees, and its prevalence at Snapchat is no accident. The company's core products—like Snap Map, Stories, and Lenses—rely heavily on graph-like data structures. Whether it's traversing a social graph to recommend friends, exploring a spatial map for location-based features, or processing nested visual effect trees, DFS provides the recursive, exploratory logic needed to navigate these interconnected systems efficiently. Mastering DFS is not just about passing an interview; it's about demonstrating you can think through the non-linear data traversal problems central to Snapchat's engineering challenges.

## What to Expect — Types of Problems

Snapchat's DFS questions typically fall into three categories, moving from straightforward to complex.

1.  **Classic Tree/Graph Traversal:** These are foundational. You might be asked to perform a pre-order, in-order, or post-order traversal on a tree, or to simply traverse all nodes in a graph. The goal is to confirm you understand the recursion/stack mechanics and can avoid cycles in graphs.
2.  **Pathfinding & Connectivity:** This is where most Snapchat questions land. Problems involve finding if a path exists between two points (e.g., "can user A reach user B's story?"), counting connected components in a grid (analogous to image segmentation for Lenses), or finding the longest path in a DAG. These test your ability to augment basic DFS with state tracking.
3.  **Complex State & Backtracking:** The most challenging tier. Here, DFS is used to explore a state space, such as generating all possible combinations of filters or solving a puzzle. You'll need to manage visited states, prune invalid paths (backtracking), and potentially combine DFS with other techniques like memoization.

## How to Prepare — Study Tips with One Code Example

Focus on understanding the pattern, not memorizing problems. The core pattern is: 1) Handle the base case, 2) Mark the current node as visited, 3) Recurse on all adjacent, unvisited nodes. Practice implementing it both recursively and iteratively using a stack.

A quintessential problem is **Number of Islands** (grid connectivity), which directly mirrors image region analysis. Given a 2D grid of '1's (land) and '0's (water), count the number of islands.

<div class="code-group">

```python
def numIslands(grid):
    if not grid:
        return 0

    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '#'  # Mark as visited
        # Explore all 4 directions
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
                dfs(grid, r, c);
                count++;
            }
        }
    }
    return count;
}

private void dfs(char[][] grid, int r, int c) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != '1') {
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

Build competence progressively. Start with basic tree traversals (Binary Tree Inorder Traversal). Move to standard graph traversal (Clone Graph). Then, practice the core grid/connectivity pattern (Number of Islands, Max Area of Island). Advance to pathfinding problems (All Paths From Source to Target). Finally, tackle backtracking (Subsets, Word Search). Always analyze time/space complexity.

[Practice Depth-First Search at Snapchat](/company/snapchat/depth-first-search)
