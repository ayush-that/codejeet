---
title: "Depth-First Search Questions at Citadel: What to Expect"
description: "Prepare for Depth-First Search interview questions at Citadel — patterns, difficulty breakdown, and study tips."
date: "2028-08-08"
category: "dsa-patterns"
tags: ["citadel", "depth-first-search", "interview prep"]
---

Depth-First Search (DFS) is a fundamental algorithm you must master for Citadel interviews. With 12 out of their 96 total tagged questions, DFS appears in roughly one-eighth of their problem set, indicating a clear focus on evaluating your ability to navigate and reason about complex data structures like graphs and trees. At a firm that builds high-performance trading systems, this skill is not academic. It translates directly to solving problems involving dependency resolution, state space exploration, network analysis, and efficient backtracking—all common in quantitative and systems engineering roles. Demonstrating fluent, bug-free DFS implementation shows you can think recursively, manage state, and handle edge cases, which are critical for writing robust, low-latency code.

## What to Expect — Types of Problems

Citadel's DFS questions typically fall into three categories. You will rarely see a straightforward "traverse this tree" problem. Instead, expect applied scenarios.

1.  **Graph Traversal and Connectivity:** Problems involving finding paths, detecting cycles, or exploring connected components in a 2D grid (like a game board or matrix) or an adjacency list. Examples include navigating a maze, evaluating spread in a network, or checking if a circuit of dependencies is valid.
2.  **Backtracking and Combinatorial Search:** These are DFS problems where you build candidates incrementally and abandon paths that fail constraints (pruning). Think generating permutations, subset sums, or placing pieces on a board (N-Queens). Citadel uses these to test your systematic problem-solving and optimization intuition.
3.  **Tree Manipulation and Analysis:** Beyond simple traversal, you'll modify tree structure (like inverting a binary tree) or compute aggregate properties (like diameter or maximum path sum). These test your understanding of recursion and state passing.

The common thread is the need to model the problem as a graph or tree, then apply DFS while tracking visited nodes and managing a path or accumulated result.

## How to Prepare — Study Tips with One Code Example

Start by internalizing the two core implementation patterns: recursive and iterative (using a stack). For interviews, the recursive version is often clearer for tree problems, while the iterative stack approach can be safer for deep graphs to avoid recursion limits. Practice drawing the recursion tree or call stack for small examples. Always clarify the graph's representation (adjacency list, matrix, implicit grid) and corner cases like empty input, cycles, or disconnected components.

The most critical pattern to master is **DFS on an implicit graph**, such as a 2D grid. This is the foundation for many matrix problems.

<div class="code-group">

```python
def dfs_grid(grid, r, c):
    """DFS to mark all connected land cells as visited."""
    if (r < 0 or r >= len(grid) or
        c < 0 or c >= len(grid[0]) or
        grid[r][c] != '1'):
        return

    grid[r][c] = '#'  # Mark as visited
    # Explore 4-directionally
    dfs_grid(grid, r + 1, c)
    dfs_grid(grid, r - 1, c)
    dfs_grid(grid, r, c + 1)
    dfs_grid(grid, r, c - 1)

# Example: Count islands in a binary matrix
def numIslands(grid):
    if not grid:
        return 0
    count = 0
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == '1':
                dfs_grid(grid, i, j)
                count += 1
    return count
```

```javascript
function dfsGrid(grid, r, c) {
  // DFS to mark all connected land cells as visited.
  if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== "1") {
    return;
  }

  grid[r][c] = "#"; // Mark as visited
  // Explore 4-directionally
  dfsGrid(grid, r + 1, c);
  dfsGrid(grid, r - 1, c);
  dfsGrid(grid, r, c + 1);
  dfsGrid(grid, r, c - 1);
}

// Example: Count islands in a binary matrix
function numIslands(grid) {
  if (!grid.length) return 0;
  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "1") {
        dfsGrid(grid, i, j);
        count++;
      }
    }
  }
  return count;
}
```

```java
public void dfsGrid(char[][] grid, int r, int c) {
    // DFS to mark all connected land cells as visited.
    if (r < 0 || r >= grid.length ||
        c < 0 || c >= grid[0].length ||
        grid[r][c] != '1') {
        return;
    }

    grid[r][c] = '#'; // Mark as visited
    // Explore 4-directionally
    dfsGrid(grid, r + 1, c);
    dfsGrid(grid, r - 1, c);
    dfsGrid(grid, r, c + 1);
    dfsGrid(grid, r, c - 1);
}

// Example: Count islands in a binary matrix
public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;
    int count = 0;
    for (int i = 0; i < grid.length; i++) {
        for (int j = 0; j < grid[0].length; j++) {
            if (grid[i][j] == '1') {
                dfsGrid(grid, i, j);
                count++;
            }
        }
    }
    return count;
}
```

</div>

## Recommended Practice Order

Build competence progressively. First, master classic tree traversals (pre-order, in-order, post-order) and basic graph DFS. Then, move to applied problems in this sequence:

1.  **Fundamentals:** Binary Tree Paths, Invert Binary Tree.
2.  **Grid DFS:** Number of Islands, Flood Fill.
3.  **Backtracking:** Subsets, Permutations, N-Queens.
4.  **Advanced Graph DFS:** Course Schedule (cycle detection), Clone Graph.
5.  **Citadel-Specific:** Finally, tackle the 12 DFS questions tagged for Citadel on platforms like LeetCode. This ensures you see their preferred problem framing and difficulty level.

Time yourself. Aim to implement a working solution, like the island count above, in under 10 minutes. Explain your choice of recursion vs. iteration and your visited-state management.

[Practice Depth-First Search at Citadel](/company/citadel/depth-first-search)
