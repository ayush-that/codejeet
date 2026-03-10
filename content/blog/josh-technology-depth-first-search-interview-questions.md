---
title: "Depth-First Search Questions at Josh Technology: What to Expect"
description: "Prepare for Depth-First Search interview questions at Josh Technology — patterns, difficulty breakdown, and study tips."
date: "2030-05-06"
category: "dsa-patterns"
tags: ["josh-technology", "depth-first-search", "interview prep"]
---

If you're preparing for a coding interview at Josh Technology, you'll quickly notice a significant trend: **Depth-First Search (DFS)** is not just another topic; it's a cornerstone of their technical assessment. With 11 out of their 36 tagged problems on major platforms being DFS-related, that's over 30% of their public question bank. This isn't a coincidence. Josh Technology, known for its work in product engineering and digital transformation, frequently deals with problems involving hierarchical data (like UI component trees, file systems, or nested configurations), pathfinding in constrained environments, and state exploration—all domains where DFS shines. In real interviews, you are very likely to encounter at least one problem where a DFS approach, either recursive or iterative, is the optimal or a required path to the solution. Mastering it is non-negotiable.

## Specific Patterns Josh Technology Favors

Josh Technology's DFS questions tend to cluster around a few key patterns, emphasizing practical application over abstract graph theory. They heavily favor **tree-based DFS** and **DFS on implicit graphs** (like grids or matrices) that model real-world scenarios.

1.  **Pathfinding in Grids (Matrix Traversal):** This is their most common pattern. Problems involve navigating a 2D grid (like a maze, map, or image) with constraints (walls, visited cells, specific conditions). The classic "Number of Islands" (#200) is a quintessential example, but Josh Technology's variations often add twists like counting unique shapes, finding paths with specific properties, or modifying the grid in-place.
2.  **Tree Path & Property Validation:** Questions about binary trees where you need to track state along a path are frequent. This includes finding paths that sum to a target (Path Sum, #112), validating properties like being a Binary Search Tree (Validate Binary Search Tree, #98), or calculating diameter/height. The recursive nature of trees makes DFS the intuitive choice.
3.  **Backtracking (State-Space Search):** Problems that require exploring all possible configurations or sequences, such as generating permutations, subset sums, or solving puzzles (like Sudoku Solver #37 or N-Queens #51). This pattern tests your ability to manage state, apply constraints, and clean up (backtrack) efficiently.

You'll notice a distinct lean towards **recursive implementations**. While iterative DFS using a stack is perfectly valid and sometimes preferred for deep recursion avoidance, the recursive model often leads to cleaner, more readable code for tree and backtracking problems—a quality interviewers appreciate. Their questions are less about complex graph algorithms (like strongly connected components) and more about applying DFS as a fundamental traversal tool to solve a concrete problem.

## How to Prepare

The key is to internalize the DFS template and then learn how to adapt it. Let's look at the universal grid DFS pattern, which forms the basis for many Josh Technology problems.

<div class="code-group">

```python
def dfs_grid(grid, r, c):
    """Example DFS for a 2D grid. Modifies grid in-place to mark visited cells."""
    # 1. Check boundaries and validity (problem-specific condition)
    if (r < 0 or r >= len(grid) or
        c < 0 or c >= len(grid[0]) or
        grid[r][c] != '1'):  # Example condition: looking for '1's
        return

    # 2. Process the current cell (problem-specific)
    # For "Number of Islands", we might mark it as visited.
    grid[r][c] = '0'  # Mark as visited

    # 3. Explore all four directions (or eight, if diagonal)
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    for dr, dc in directions:
        dfs_grid(grid, r + dr, c + dc)

# Time Complexity: O(M * N) where M x N is the grid size. Each cell is processed once.
# Space Complexity: O(M * N) in the worst case for the recursion call stack (e.g., a grid full of '1's).
```

```javascript
function dfsGrid(grid, r, c) {
  // 1. Check boundaries and validity
  if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== "1") {
    return;
  }

  // 2. Process current cell
  grid[r][c] = "0";

  // 3. Explore neighbors
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (const [dr, dc] of directions) {
    dfsGrid(grid, r + dr, c + dc);
  }
}

// Time: O(M * N) | Space: O(M * N) worst-case recursion depth.
```

```java
public void dfsGrid(char[][] grid, int r, int c) {
    // 1. Check boundaries and validity
    if (r < 0 || r >= grid.length ||
        c < 0 || c >= grid[0].length ||
        grid[r][c] != '1') {
        return;
    }

    // 2. Process current cell
    grid[r][c] = '0';

    // 3. Explore neighbors
    int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
    for (int[] dir : directions) {
        dfsGrid(grid, r + dir[0], c + dir[1]);
    }
}

// Time: O(M * N) | Space: O(M * N) worst-case recursion depth.
```

</div>

For tree problems, the pattern shifts to traversing left and right subtrees. The crucial skill is passing down and bubbling up information.

<div class="code-group">

```python
def dfs_tree(node, path_state):
    """Example DFS for binary trees, tracking a path sum."""
    # 1. Base case: null node
    if not node:
        return 0

    # 2. Update state with current node (e.g., add to path sum)
    new_path_state = path_state + node.val

    # 3. Check for a condition (e.g., found a target sum at a leaf?)
    # if not node.left and not node.right and new_path_state == target:
    #     return 1  # or store result

    # 4. Recurse on children and process their results
    left_count = dfs_tree(node.left, new_path_state)
    right_count = dfs_tree(node.right, new_path_state)

    # 5. Return combined result to parent
    return left_count + right_count  # Example: return count of valid paths

# Time Complexity: O(N) where N is number of nodes.
# Space Complexity: O(H) where H is the tree height for recursion stack.
```

```javascript
function dfsTree(node, pathState) {
  // 1. Base case
  if (!node) return 0;

  // 2. Update state
  let newPathState = pathState + node.val;

  // 3. Check condition (e.g., at leaf with target sum)

  // 4. Recurse
  let leftCount = dfsTree(node.left, newPathState);
  let rightCount = dfsTree(node.right, newPathState);

  // 5. Combine and return
  return leftCount + rightCount;
}

// Time: O(N) | Space: O(H)
```

```java
public int dfsTree(TreeNode node, int pathState) {
    // 1. Base case
    if (node == null) return 0;

    // 2. Update state
    int newPathState = pathState + node.val;

    // 3. Check condition

    // 4. Recurse
    int leftCount = dfsTree(node.left, newPathState);
    int rightCount = dfsTree(node.right, newPathState);

    // 5. Combine and return
    return leftCount + rightCount;
}

// Time: O(N) | Space: O(H)
```

</div>

## How Josh Technology Tests Depth-First Search vs Other Companies

Compared to FAANG companies, Josh Technology's DFS questions often feel more _applied_ and less _theoretical_. At a company like Google, you might get a DFS problem disguised within a complex system design or requiring an advanced optimization (e.g., DFS with memoization for a game theory problem). At Josh Technology, the problems are more direct: "Here is a grid representing a warehouse layout with obstacles; find all reachable cells from the robot's start point." The difficulty is moderate, focusing on clean implementation, correct handling of edge cases, and explaining your traversal logic clearly.

What's unique is their emphasis on **transforming the input data structure in-place** as a visited marker (like turning `'1'` to `'0'` in the island problem). This tests your understanding of space optimization and your comfort with modifying inputs—always ask the interviewer if this is allowed. Their interviews also seem to blend DFS with simple dynamic programming concepts (like caching results in a "DFS with memoization" pattern) more frequently than at companies that treat DP as a wholly separate advanced topic.

## Study Order

Tackle DFS in this logical sequence to build a solid foundation:

1.  **Basic Tree Traversal:** Master pre-order, in-order, and post-order DFS on binary trees. This builds recursion intuition. (Problems: Binary Tree Inorder Traversal #94).
2.  **Simple Grid/Matrix DFS:** Learn the standard 4-directional flood fill. This introduces the boundary check pattern and in-place modification. (Problem: Number of Islands #200).
3.  **Path-Based Tree Problems:** Practice problems where you need to carry information root-to-leaf or calculate cross-tree properties. This teaches state management in recursion. (Problems: Path Sum #112, Diameter of Binary Tree #543).
4.  **Backtracking:** Learn the choose-explore-unchoose pattern. This is critical for combinatorial problems. (Problems: Subsets #78, Permutations #46).
5.  **DFS with Memoization:** Combine DFS with caching to solve overlapping subproblems. This bridges DFS and DP. (Problem: Longest Increasing Path in a Matrix #329).
6.  **Complex Grid Searches & Multi-source DFS:** Handle more complex constraints, multiple start points, or layered BFS/DFS hybrids. (Problem: Walls and Gates #286, Shortest Bridge #934).

This order works because it progresses from understanding the recursion mechanism (steps 1-2), to managing state within it (step 3), to controlling the recursion tree explicitly (step 4), and finally to optimizing it (step 5-6).

## Recommended Practice Order

Solve these Josh Technology-relevant problems in sequence:

1.  **Number of Islands (#200):** The absolute must-know. Practice both recursive and iterative (stack) versions.
2.  **Path Sum (#112):** Solidifies tree DFS and path state management.
3.  **Validate Binary Search Tree (#98):** Excellent for understanding how to pass valid ranges down the recursion.
4.  **Max Area of Island (#695):** A direct extension of #200, teaching you to aggregate values (count cells) during DFS.
5.  **Target Sum (#494):** A superb backtracking problem that feels like a path sum but on an implicit tree of decisions.
6.  **Longest Increasing Path in a Matrix (#329):** The classic DFS + memoization problem. If you can solve this, you've mastered the pattern.
7.  **Walls and Gates (#286):** Introduces the concept of multi-source DFS (or BFS), a common twist.

By following this focused path, you'll transform DFS from a generic algorithm into a sharp tool specifically calibrated for Josh Technology's interview style.

[Practice Depth-First Search at Josh Technology](/company/josh-technology/depth-first-search)
