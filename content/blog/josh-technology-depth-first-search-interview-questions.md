---
title: "Depth-First Search Questions at Josh Technology: What to Expect"
description: "Prepare for Depth-First Search interview questions at Josh Technology — patterns, difficulty breakdown, and study tips."
date: "2030-05-14"
category: "dsa-patterns"
tags: ["josh-technology", "depth-first-search", "interview prep"]
---

Depth-First Search (DFS) is a core algorithmic technique for exploring graphs and trees, and its prevalence at Josh Technology is significant. With 11 out of their 36 total coding problems involving DFS, it accounts for roughly 30% of their algorithmic focus. This emphasis indicates they prioritize candidates who can think recursively and systematically navigate connected data structures, which is fundamental for problems involving hierarchical data, pathfinding, state exploration, and backtracking. Mastering DFS is not just about solving tree problems; it's about developing a mindset to decompose complex problems into smaller, traversable states.

## What to Expect — Types of Problems

Josh Technology's DFS questions typically fall into a few key categories. Expect standard traversals on binary trees, where you might need to find a path, calculate a sum, or validate properties. A major theme is **pathfinding in grids or matrices**, such as counting islands, finding a specific path, or navigating a maze with constraints. Problems often involve **modification of the input** (like marking visited cells) rather than using extra space for a separate visited set. Another common type is **backtracking**, which is essentially DFS with pruning—used in problems like generating permutations, subsets, or solving puzzles. The constraints usually require an optimal or exhaustive search, not just a simple traversal.

## How to Prepare — Study Tips with One Code Example

Start by internalizing the recursive DFS template. The core pattern involves a base case (to stop recursion) and a recursive case (to explore further). Practice writing it iteratively using a stack as well. Always clarify the problem's state: what represents a "node," and what are the valid "neighbors" to visit? For grid problems, the standard movement pattern (up, down, left, right) is crucial. A key tip is to perform the "visited" check immediately upon entering the DFS function to avoid redundant cycles.

Below is a fundamental DFS template for counting connected components in a 2D grid (the "Number of Islands" pattern). This pattern is directly applicable to many Josh Technology problems.

<div class="code-group">

```python
def dfs(grid, i, j):
    # Base case: out of bounds or not land
    if i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]) or grid[i][j] != '1':
        return
    # Mark as visited
    grid[i][j] = '0'
    # Explore neighbors (down, up, right, left)
    dfs(grid, i + 1, j)
    dfs(grid, i - 1, j)
    dfs(grid, i, j + 1)
    dfs(grid, i, j - 1)

def numIslands(grid):
    if not grid:
        return 0
    count = 0
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == '1':
                dfs(grid, i, j)
                count += 1
    return count
```

```javascript
function dfs(grid, i, j) {
  // Base case: out of bounds or not land
  if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] !== "1") {
    return;
  }
  // Mark as visited
  grid[i][j] = "0";
  // Explore neighbors (down, up, right, left)
  dfs(grid, i + 1, j);
  dfs(grid, i - 1, j);
  dfs(grid, i, j + 1);
  dfs(grid, i, j - 1);
}

function numIslands(grid) {
  if (!grid || grid.length === 0) {
    return 0;
  }
  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "1") {
        dfs(grid, i, j);
        count++;
      }
    }
  }
  return count;
}
```

```java
public void dfs(char[][] grid, int i, int j) {
    // Base case: out of bounds or not land
    if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] != '1') {
        return;
    }
    // Mark as visited
    grid[i][j] = '0';
    // Explore neighbors (down, up, right, left)
    dfs(grid, i + 1, j);
    dfs(grid, i - 1, j);
    dfs(grid, i, j + 1);
    dfs(grid, i, j - 1);
}

public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) {
        return 0;
    }
    int count = 0;
    for (int i = 0; i < grid.length; i++) {
        for (int j = 0; j < grid[0].length; j++) {
            if (grid[i][j] == '1') {
                dfs(grid, i, j);
                count++;
            }
        }
    }
    return count;
}
```

</div>

## Recommended Practice Order

Build your skills progressively. First, master **binary tree DFS** (pre-order, in-order, post-order). Then, move to **grid-based DFS** using the island counting pattern shown above. Next, tackle **backtracking** problems (permutations, combinations). Finally, solve **application-specific problems** like word search or maze solving that combine these concepts. For each problem, analyze time and space complexity, focusing on the recursion depth. Practice on Josh Technology's tagged problems to familiarize yourself with their style and constraints.

[Practice Depth-First Search at Josh Technology](/company/josh-technology/depth-first-search)
