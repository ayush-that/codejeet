---
title: "Depth-First Search Questions at Tinkoff: What to Expect"
description: "Prepare for Depth-First Search interview questions at Tinkoff — patterns, difficulty breakdown, and study tips."
date: "2030-12-28"
category: "dsa-patterns"
tags: ["tinkoff", "depth-first-search", "interview prep"]
---

Depth-First Search (DFS) is a fundamental algorithm that Tinkoff interviewers use to assess your grasp of recursion, tree/graph traversal, and systematic problem-solving. With 3 out of their 27 total coding problems tagged as DFS, it's a clearly defined area of focus. Success here demonstrates you can handle the recursive and backtracking logic common in real-world financial and data processing tasks, such as evaluating decision trees, parsing hierarchical data, or exploring state spaces—all relevant to a tech-driven bank.

## What to Expect — Types of Problems

Tinkoff's DFS problems typically fall into two categories. First, **classic tree traversals**: you'll be asked to navigate binary trees or n-ary trees to find paths, calculate sums, or validate properties. These questions test your basic recursive implementation. Second, **matrix/grid traversal**: these problems involve exploring a 2D grid (like a maze or island map) where DFS is used to mark connected components. This pattern is common in problems about counting regions, finding paths, or modifying cells based on adjacency. Expect the problems to have constraints that make DFS the optimal approach, often involving implicit graphs or recursive exploration without cycles.

## How to Prepare — Study Tips with One Code Example

Master the recursive template for DFS and understand its iterative stack-based alternative. Focus on handling base cases, avoiding cycles with visited sets, and returning the correct aggregate value (like a sum, boolean, or list). Practice converting problems into graph traversal—many tree and grid problems are just graphs in disguise.

A key pattern is the **DFS skeleton for a binary tree**. This template is the foundation for most tree problems.

<div class="code-group">

```python
def dfs_tree(node):
    if not node:
        return
    # Pre-order processing here
    dfs_tree(node.left)
    # In-order processing here (for BST)
    dfs_tree(node.right)
    # Post-order processing here
```

```javascript
function dfsTree(node) {
  if (node === null) return;
  // Pre-order processing here
  dfsTree(node.left);
  // In-order processing here (for BST)
  dfsTree(node.right);
  // Post-order processing here
}
```

```java
public void dfsTree(TreeNode node) {
    if (node == null) return;
    // Pre-order processing here
    dfsTree(node.left);
    // In-order processing here (for BST)
    dfsTree(node.right);
    // Post-order processing here
}
```

</div>

For grid DFS, modify this to track visited cells and explore four directions. Always practice writing this from memory.

## Recommended Practice Order

Start with basic tree traversal (pre-order, in-order, post-order) to build recursive intuition. Move to simple path-sum problems in trees. Then, tackle grid-based DFS (number of islands, flood fill). Finally, practice backtracking problems (like pathfinding or permutations) which are DFS with state resetting. This order builds complexity gradually, ensuring you internalize the pattern before adding layers like memoization or pruning.

[Practice Depth-First Search at Tinkoff](/company/tinkoff/depth-first-search)
