---
title: "Depth-First Search Questions at Amazon: What to Expect"
description: "Prepare for Depth-First Search interview questions at Amazon — patterns, difficulty breakdown, and study tips."
date: "2027-03-05"
category: "dsa-patterns"
tags: ["amazon", "depth-first-search", "interview prep"]
---

Depth-First Search (DFS) is a fundamental algorithm for exploring graphs and trees, making it essential for solving problems involving hierarchical data, connected components, and pathfinding. At Amazon, with 185 specific DFS questions in their problem bank, mastery of this technique is non-negotiable. It matters because Amazon's technical domains—from mapping dependencies in microservice architectures and traversing file systems in AWS S3 to analyzing nested product categories and user behavior paths—are often modeled as trees or graphs. Your ability to cleanly implement DFS signals you can handle recursive exploration and backtracking, which are core to system design and data processing at scale.

## What to Expect — Types of Problems

Amazon's DFS questions typically fall into three categories. You must recognize which variant is required.

**Tree Traversal & Modification:** This is the most common type. Expect problems involving binary trees, n-ary trees, or generic tree structures. Tasks include finding a node, calculating sums or depths, serializing/deserializing, or modifying the tree in-place (e.g., flattening a tree to a linked list). These often use a simple recursive DFS.

**Graph Traversal & Connectivity:** Here, you'll work with adjacency lists or matrices. Problems focus on finding connected components, detecting cycles, or checking if a path exists between nodes (relevant for networking or dependency resolution). You must handle visited states to avoid infinite loops.

**Backtracking & Pathfinding:** These are advanced DFS applications. You are asked to explore all possible states or configurations, such as generating permutations, solving puzzles, or finding all paths in a grid that meet certain constraints. This requires adding and removing elements from the current path (backtracking).

## How to Prepare — Study Tips with One Code Example

Focus on understanding the recursive stack and state management. Start by memorizing the basic recursive and iterative (stack-based) templates. Then, practice identifying the "state" you need to pass to each recursive call: typically the current node and any accumulated data. For backtracking, practice the precise pattern of add-explore-remove.

A key pattern is the **DFS skeleton for a binary tree**. This template is the foundation for most tree problems.

<div class="code-group">

```python
def dfs(node):
    # Base case: if node is None, return
    if not node:
        return

    # Pre-order processing (visit node before children)
    # process(node.val)

    # Recursive exploration
    dfs(node.left)
    # In-order processing would go here for BST
    dfs(node.right)

    # Post-order processing (visit node after children)
    # process(node.val)
```

```javascript
function dfs(node) {
  // Base case
  if (node === null) return;

  // Pre-order processing
  // process(node.val);

  // Recursive exploration
  dfs(node.left);
  // In-order processing
  dfs(node.right);

  // Post-order processing
}
```

```java
public void dfs(TreeNode node) {
    // Base case
    if (node == null) return;

    // Pre-order processing
    // process(node.val);

    // Recursive exploration
    dfs(node.left);
    // In-order processing
    dfs(node.right);

    // Post-order processing
}
```

</div>

## Recommended Practice Order

Build competence sequentially. First, master standard binary tree traversals (pre-order, in-order, post-order). Second, solve problems that require returning a value from the DFS, like finding maximum depth or checking for symmetry. Third, tackle graph traversal on small adjacency lists, ensuring you implement a visited set. Fourth, move to path-based problems on grids (2D arrays). Finally, concentrate on full backtracking scenarios, such as generating all subsets or permutations. This order builds from simple recursion to complex state management.

[Practice Depth-First Search at Amazon](/company/amazon/depth-first-search)
