---
title: "Depth-First Search Questions at Grammarly: What to Expect"
description: "Prepare for Depth-First Search interview questions at Grammarly — patterns, difficulty breakdown, and study tips."
date: "2031-01-23"
category: "dsa-patterns"
tags: ["grammarly", "depth-first-search", "interview prep"]
---

If you're preparing for a technical interview at Grammarly, you've likely seen their question breakdown: 4 Depth-First Search (DFS) questions out of 26 total. That's roughly 15% of their problem pool, making it a significant, recurring theme. But here's the critical insight: at Grammarly, DFS isn't just about traversing trees. It's a fundamental tool for solving problems related to their core domain—language, structure, and validation. Think about it: checking nested syntax, validating document outlines, parsing user-defined rules, or exploring state spaces for autocorrect suggestions. These are all graph or tree problems in disguise, and DFS is the natural, recursive way to model them. In real interviews, you're more likely to encounter a DFS problem here than at a company like Google, where array and string manipulation dominate.

## Specific Patterns Grammarly Favors

Grammarly's DFS questions tend to cluster around two specific patterns: **Pathfinding in Constrained Grids** and **Recursive Validation of Hierarchical Structures**. They rarely ask about complex graph theory (like network flow or strongly connected components). Instead, they focus on applied DFS where the state space is clear and the constraints are logical.

1.  **Pathfinding in a Grid (Matrix Traversal):** This is their most common pattern. You're given a 2D grid (like a board of characters or a map of states) and asked to find a path, count valid regions, or determine reachability. The twist is usually in the constraints: you can only move in certain directions, or you must track a secondary condition (like a remaining resource). This directly mirrors checking character adjacency in a document or exploring possible corrections.
    - **Example LeetCode Analog:** Number of Islands (#200) is the foundational problem. Grammarly's versions often add a layer, like "Word Search" (#79) where you track a constructed string, or "Max Area of Island" (#695) where you aggregate a value.

2.  **Validation of Nested Structures (Tree/Graph Traversal):** This pattern involves traversing a tree (like a DOM tree for a document, a syntax tree, or a nested list) to validate a property or collect information. The recursion elegantly handles the "nesting." Grammarly problems here often feel like you're writing a small interpreter or linter.
    - **Example LeetCode Analog:** Validate Binary Search Tree (#98) is a classic test of in-order DFS with state passing. For a more Grammarly-flavored take, "Evaluate Boolean Binary Tree" (#2331) requires evaluating a tree based on its node values, similar to evaluating a nested conditional rule.

Notably, Grammarly seems to prefer **recursive DFS** implementations in their problems. The recursive call stack models the problem's logic cleanly, which is important when the interview is assessing your ability to decompose a problem. While you should know iterative (stack-based) DFS, be ready to think recursively.

## How to Prepare

Mastering DFS for Grammarly means internalizing the recursive template and knowing how to adapt it for their two favorite patterns. Let's look at the universal recursive DFS skeleton and then adapt it for a grid problem.

<div class="code-group">

```python
# Universal Recursive DFS Skeleton
def dfs(node, state):
    # 1. Base Case: Stop condition (e.g., null node, out of bounds, goal met)
    if not node:
        return

    # 2. Process the current node (e.g., mark visited, add to path, check condition)
    process(node)

    # 3. Recursively explore all neighbors/children
    for neighbor in get_neighbors(node):
        # 4. (Optional) Pruning: Skip invalid or visited states
        if not is_valid(neighbor):
            continue
        dfs(neighbor, state)

    # 5. (Optional) Backtrack: Undo changes for pathfinding problems
    backtrack(node)
```

```javascript
// Universal Recursive DFS Skeleton
function dfs(node, state) {
  // 1. Base Case
  if (!node) return;

  // 2. Process Current Node
  process(node);

  // 3. Recursively Explore Neighbors
  for (let neighbor of getNeighbors(node)) {
    // 4. Pruning
    if (!isValid(neighbor)) continue;
    dfs(neighbor, state);
  }

  // 5. Backtrack
  backtrack(node);
}
```

```java
// Universal Recursive DFS Skeleton
public void dfs(Node node, State state) {
    // 1. Base Case
    if (node == null) return;

    // 2. Process Current Node
    process(node);

    // 3. Recursively Explore Neighbors
    for (Node neighbor : getNeighbors(node)) {
        // 4. Pruning
        if (!isValid(neighbor)) continue;
        dfs(neighbor, state);
    }

    // 5. Backtrack
    backtrack(node);
}
```

</div>

Now, let's apply this to Grammarly's common grid pattern with a "Number of Islands" variant.

<div class="code-group">

```python
# Grammarly-style Grid DFS: Count Islands
# Time: O(R * C) | Space: O(R * C) in worst case (call stack for full grid)
def numIslands(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    island_count = 0

    def dfs(r, c):
        # Base Case: Out of bounds or not land
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return

        # Process: Mark as visited by changing to '0'
        grid[r][c] = '0'

        # Recursively explore 4-directional neighbors
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            # Found a new island
            if grid[r][c] == '1':
                island_count += 1
                dfs(r, c) # Sink the entire island

    return island_count
```

```javascript
// Grammarly-style Grid DFS: Count Islands
// Time: O(R * C) | Space: O(R * C) in worst case
function numIslands(grid) {
  if (!grid.length) return 0;

  const rows = grid.length,
    cols = grid[0].length;
  let islandCount = 0;

  const dfs = (r, c) => {
    // Base Case
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== "1") return;

    // Process
    grid[r][c] = "0";

    // Explore neighbors
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        islandCount++;
        dfs(r, c);
      }
    }
  }

  return islandCount;
}
```

```java
// Grammarly-style Grid DFS: Count Islands
// Time: O(R * C) | Space: O(R * C)
public class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;

        int rows = grid.length, cols = grid[0].length;
        int islandCount = 0;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    islandCount++;
                    dfs(grid, r, c, rows, cols);
                }
            }
        }
        return islandCount;
    }

    private void dfs(char[][] grid, int r, int c, int rows, int cols) {
        // Base Case
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1') return;

        // Process
        grid[r][c] = '0';

        // Explore neighbors
        dfs(grid, r + 1, c, rows, cols);
        dfs(grid, r - 1, c, rows, cols);
        dfs(grid, r, c + 1, rows, cols);
        dfs(grid, r, c - 1, rows, cols);
    }
}
```

</div>

## How Grammarly Tests Depth-First Search vs Other Companies

At large tech giants (FAANG), DFS problems are often one part of a multi-step, complex problem. You might need to combine DFS with memoization for DP, or use it to build a graph for a later shortest-path algorithm. The focus is on algorithmic optimization and handling scale.

At Grammarly, the DFS problems are more self-contained and applied. The difficulty isn't in ultra-optimization (though you must know time/space complexity), but in **correctly modeling the problem state and constraints**. Interviewers will watch closely to see if your recursion correctly handles edge cases that mimic "edge cases in a document"—empty input, deeply nested structures, or circular references. They care about clean, readable, and logically sound code that demonstrates you can translate a real-world language problem into a traversal algorithm.

## Study Order

Don't jump into Grammarly's problem list immediately. Build your foundation in this logical order:

1.  **Basic Tree Traversal (Pre/In/Post-order):** Understand the recursion stack. Practice on binary trees first. This is non-negotiable.
2.  **Simple Grid Traversal (Number of Islands):** Learn to convert a 2D grid into a graph (4-directional, then 8-directional). Master the "mark as visited" pattern.
3.  **Pathfinding in a Grid with State (Word Search):** Add a temporary state (like a current word prefix) that you pass down and backtrack. This is a core Grammarly pattern.
4.  **Validation Traversals (Validate BST):** Practice DFS that carries minimum/maximum bounds down the recursion, or that returns aggregate values (like height) up the call stack.
5.  **DFS on Implicit Graphs (Accounts Merge #721):** Some Grammarly problems involve building a graph from data first, then running DFS. This is the final, most complex step.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous one, adding a layer of complexity relevant to Grammarly's question style.

1.  **Binary Tree Inorder Traversal (#94):** Pure recursion practice.
2.  **Number of Islands (#200):** Foundational grid DFS.
3.  **Max Area of Island (#695):** Adds aggregation during DFS.
4.  **Word Search (#79):** Adds path state and backtracking—a **must-do** for Grammarly.
5.  **Validate Binary Search Tree (#98):** Classic validation via DFS with state passing.
6.  **Clone Graph (#133):** DFS on an explicit graph, handling cycles (a common document reference issue).
7.  **Accounts Merge (#721):** Builds a graph from data, then uses DFS to connect components. This is near the top of Grammarly's difficulty curve.

By following this progression, you'll develop the specific muscle memory for the kinds of nested, constrained traversal problems Grammarly loves to ask. Remember, they're testing if you can think recursively about structure—a skill directly applicable to their work on language and documents.

[Practice Depth-First Search at Grammarly](/company/grammarly/depth-first-search)
