---
title: "Depth-First Search Questions at Netflix: What to Expect"
description: "Prepare for Depth-First Search interview questions at Netflix — patterns, difficulty breakdown, and study tips."
date: "2030-09-23"
category: "dsa-patterns"
tags: ["netflix", "depth-first-search", "interview prep"]
---

# Depth-First Search Questions at Netflix: What to Expect

Netflix’s coding interviews are known for being practical and domain‑relevant. With 5 out of their 30 most‑asked questions being Depth‑First Search (DFS) problems, DFS isn’t just a random topic—it’s a deliberate focus. Why? Because Netflix’s core systems—content recommendation, social‑graph traversal, UI component rendering, and even their internal infrastructure tools—often model problems as trees or graphs. DFS is the natural tool for exploring hierarchical data, checking connectivity, and solving backtracking puzzles. In real interviews, you’re likely to see at least one DFS‑style question, especially if your role touches backend services, data engineering, or full‑stack development.

## Specific Patterns Netflix Favors

Netflix’s DFS questions tend to cluster around three patterns:

1. **Tree/Graph Traversal with State** – They love problems where you traverse a tree or graph while carrying extra information (e.g., path sum, node counts, visited nodes). This mirrors real‑world scenarios like traversing a directory of video assets or walking a user‑interest graph.
2. **Backtracking / Combinatorial Search** – Problems that ask for all possible configurations (paths, subsets, permutations) appear frequently. This pattern is used in A/B testing configuration generation and content‑personalization algorithms.
3. **Cycle Detection / Connectivity** – Determining if a graph is acyclic or if all nodes are reachable is a classic infrastructure‑interview staple.

For example, **Number of Islands (#200)** is a staple because it’s a clean representation of finding connected components in a 2D grid—think of it as finding clusters of similar user profiles or content categories. **Course Schedule (#207)** is another favorite; it’s essentially cycle detection in a directed graph, which models dependency resolution (e.g., video‑processing pipelines or microservice dependencies). Netflix also asks **Binary Tree Maximum Path Sum (#124)** because it requires tracking both local and global state during a DFS—a pattern that comes up when optimizing recommendation pathways.

Notice that Netflix rarely asks “vanilla” DFS on a simple binary tree. Instead, they embed DFS within a larger problem that requires you to manage additional state or combine it with other techniques (like memoization).

## How to Prepare

The key is to master the recursive DFS template and then learn how to extend it with parameters that carry problem‑specific state. Let’s look at the most common variation: DFS with a return value and side‑effect state.

<div class="code-group">

```python
# Time: O(n) | Space: O(h) for recursion stack, where h is tree height
def max_path_sum(root):
    def dfs(node):
        if not node:
            return 0

        # Post-order traversal: solve left and right first
        left_max = max(dfs(node.left), 0)   # ignore negative contributions
        right_max = max(dfs(node.right), 0)

        # Update global maximum with path through current node
        nonlocal max_sum
        max_sum = max(max_sum, node.val + left_max + right_max)

        # Return the maximum gain if we take this node upward
        return node.val + max(left_max, right_max)

    max_sum = float('-inf')
    dfs(root)
    return max_sum
```

```javascript
// Time: O(n) | Space: O(h) for recursion stack, where h is tree height
function maxPathSum(root) {
  let maxSum = -Infinity;

  function dfs(node) {
    if (!node) return 0;

    // Post-order traversal
    const leftMax = Math.max(dfs(node.left), 0);
    const rightMax = Math.max(dfs(node.right), 0);

    // Update global maximum
    maxSum = Math.max(maxSum, node.val + leftMax + rightMax);

    // Return maximum upward contribution
    return node.val + Math.max(leftMax, rightMax);
  }

  dfs(root);
  return maxSum;
}
```

```java
// Time: O(n) | Space: O(h) for recursion stack, where h is tree height
class Solution {
    private int maxSum = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        dfs(root);
        return maxSum;
    }

    private int dfs(TreeNode node) {
        if (node == null) return 0;

        // Post-order traversal
        int leftMax = Math.max(dfs(node.left), 0);
        int rightMax = Math.max(dfs(node.right), 0);

        // Update global maximum
        maxSum = Math.max(maxSum, node.val + leftMax + rightMax);

        // Return maximum upward contribution
        return node.val + Math.max(leftMax, rightMax);
    }
}
```

</div>

This pattern—where the recursive function returns one value (the best “upward” contribution) while updating a global or non‑local maximum—is exactly what Netflix interviewers look for. Practice writing it from scratch until you can do it in under 3 minutes.

## How Netflix Tests Depth-First Search vs Other Companies

At Netflix, DFS questions are often presented in a **domain‑wrapped** form. Instead of “find the maximum path sum in a binary tree,” you might hear “find the most engaging content pathway given a user’s watch history graph.” The underlying algorithm is the same, but they’re testing your ability to map a real‑world problem to a known pattern.

Contrast this with Google, where DFS problems are often more algorithmic and abstract (e.g., generate all permutations with constraints). At Amazon, DFS questions frequently involve file‑system traversal or serialization/deserialization—directly applicable to their storage services. Netflix sits in the middle: they want to see that you can handle the abstraction, but they also care that you can articulate how the algorithm applies to their domain.

Difficulty‑wise, Netflix’s DFS questions are typically **medium** on LeetCode’s scale. You’re unlikely to see a “hard” DFS‑only problem, but you might encounter a medium‑hard problem that combines DFS with another concept (e.g., DFS + memoization for a dynamic‑programming‑like optimization).

## Study Order

1. **Basic Tree Traversals** – Start with pre‑order, in‑order, and post‑order DFS on binary trees. This builds muscle memory for recursion.
2. **Path‑Based Problems** – Move to problems where you track paths or sums from root to leaf (e.g., Path Sum #112). This teaches you to carry state downward.
3. **Global‑State Problems** – Practice problems that require updating a global answer (like Maximum Path Sum #124). This is where you learn to combine return values with side effects.
4. **Graph Traversal** – Extend DFS to adjacency‑list graphs (Number of Islands #200, Course Schedule #207). Focus on visited‑set management and cycle detection.
5. **Backtracking** – Finally, tackle combinatorial search (Subsets #78, Permutations #46). This reinforces recursion with explicit state mutation and undo steps.

This order works because each step introduces one new complexity layer. You first learn the recursion mechanics, then state management, then graph‑specific nuances, and finally the full “choose‑explore‑unchoose” pattern of backtracking.

## Recommended Practice Order

Solve these problems in sequence—each builds on the previous:

1. **Maximum Depth of Binary Tree (#104)** – The simplest DFS return‑value pattern.
2. **Path Sum (#112)** – Introduces carrying a target downward.
3. **Binary Tree Maximum Path Sum (#124)** – The classic global‑state problem.
4. **Number of Islands (#200)** – Graph DFS on a grid.
5. **Course Schedule (#207)** – DFS with cycle detection and topological sorting.
6. **Subsets (#78)** – Backtracking foundation.
7. **Alien Dictionary (#269)** – A harder graph‑DFS problem that Netflix sometimes asks for senior roles.

After you’re comfortable with these, mix in **Clone Graph (#133)** and **Word Search (#79)** to cover adjacency‑list traversal and 2D‑backtracking variations.

[Practice Depth-First Search at Netflix](/company/netflix/depth-first-search)
