---
title: "Depth-First Search Questions at Wix: What to Expect"
description: "Prepare for Depth-First Search interview questions at Wix — patterns, difficulty breakdown, and study tips."
date: "2029-05-21"
category: "dsa-patterns"
tags: ["wix", "depth-first-search", "interview prep"]
---

If you're preparing for a software engineering interview at Wix, you've likely seen the statistic: they have 10 Depth-First Search (DFS) questions out of their 56-tagged total on LeetCode. That's nearly 18% of their catalog. This isn't a coincidence. Wix, as a platform empowering users to create complex web applications, sites, and digital experiences, fundamentally deals with hierarchical and graph-like data structures daily—think site navigation trees, component hierarchies in their Editor, dependency graphs between apps and widgets, or permission structures for collaborative workspaces. DFS isn't just an algorithmic curiosity for them; it's a practical tool for traversing these real-world models. In interviews, you can expect DFS to appear not as a trick question, but as a core component of solving problems related to trees, graphs, and combinatorial search. It's a primary focus area, not secondary.

## Specific Patterns Wix Favors

Wix's DFS problems tend to cluster around two main themes, with a distinct practical flavor.

1.  **Tree Traversal with State Accumulation:** This is their most common pattern. The problem isn't just about visiting nodes, but about calculating a global property by accumulating information as you traverse. Think finding the diameter of a tree, the maximum path sum, or the longest consecutive sequence path. These directly mirror tasks like calculating the depth of a nested component structure or finding the most "expensive" render path in a UI tree.
    - **Example:** **Binary Tree Maximum Path Sum (#124)** is a quintessential Wix-style problem. It requires a post-order DFS to compute the best path contribution from each subtree while updating a global maximum.

2.  **Graph Traversal for Connectivity and Search:** The second theme involves standard undirected or directed graph traversal to answer questions about connectivity, component counting, or path existence. These problems often model scenarios like checking if features are connected in a site, or if a user has permission to access a resource through a role hierarchy.
    - **Example:** **Number of Islands (#200)** is a classic. While simple, it tests your ability to apply DFS to modify a grid in-place, a skill relevant to processing canvas-like data or image regions in their design tools.

You'll notice a relative lack of highly abstract graph theory problems (like Eulerian paths) or complex iterative DP with memoization disguised as DFS. Wix's questions are more applied. They also show a slight preference for **recursive implementations** in their problem discussions, as recursion often leads to cleaner, more intuitive code for tree problems, which is a priority for maintainable front-end and back-end code.

## How to Prepare

Master the recursive template and learn how to adapt it for state. The core of DFS is simple, but the interview challenge is in managing the extra parameters and return values.

Here is the adaptable recursive DFS template for a binary tree:

<div class="code-group">

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def dfs_template(self, root):
        # A mutable container or a nonlocal variable to hold the global result.
        # For problems like max path sum, this is essential.
        self.result = float('-inf')

        def dfs(node):
            # 1. Base Case: If node is None, return the identity value.
            # For path sum, identity is 0. For depth, identity is 0.
            if not node:
                return 0

            # 2. Recursively get information from children.
            left_info = dfs(node.left)
            right_info = dfs(node.right)

            # 3. **CORE LOGIC**: Compute the value for THIS node.
            # This often involves combining node.val with child info.
            # Example for max path sum: path through this node.
            local_path_sum = node.val + left_info + right_info

            # 4. Update the global result if this node's scenario is better.
            self.result = max(self.result, local_path_sum)

            # 5. Decide what to return to the parent.
            # You CANNOT return `local_path_sum` if it uses both children.
            # You must return the best single-branch contribution.
            return max(node.val + max(left_info, right_info), 0)

        dfs(root)
        return self.result

# Time Complexity: O(N), where N is the number of nodes. Each node is visited once.
# Space Complexity: O(H), where H is the tree height, for the recursion call stack. O(N) in worst case (skewed tree).
```

```javascript
// Definition for a binary tree node.
// function TreeNode(val, left, right) {
//     this.val = (val===undefined ? 0 : val)
//     this.left = (left===undefined ? null : left)
//     this.right = (right===undefined ? null : right)
// }

class Solution {
  dfsTemplate(root) {
    // Use a variable in the closure to hold the global result.
    let result = -Infinity;

    const dfs = (node) => {
      // 1. Base Case
      if (node === null) return 0;

      // 2. Recurse on children
      const leftInfo = dfs(node.left);
      const rightInfo = dfs(node.right);

      // 3. Core Logic for this node
      const localPathSum = node.val + leftInfo + rightInfo;

      // 4. Update global result
      result = Math.max(result, localPathSum);

      // 5. Return single-branch contribution to parent
      return Math.max(node.val + Math.max(leftInfo, rightInfo), 0);
    };

    dfs(root);
    return result;
  }
}
// Time: O(N) | Space: O(H)
```

```java
// Definition for a binary tree node.
// public class TreeNode {
//     int val;
//     TreeNode left;
//     TreeNode right;
//     TreeNode() {}
//     TreeNode(int val) { this.val = val; }
//     TreeNode(int val, TreeNode left, TreeNode right) {
//         this.val = val;
//         this.left = left;
//         this.right = right;
//     }
// }

class Solution {
    private int result; // Mutable global state

    public int dfsTemplate(TreeNode root) {
        result = Integer.MIN_VALUE;
        dfsHelper(root);
        return result;
    }

    private int dfsHelper(TreeNode node) {
        // 1. Base Case
        if (node == null) return 0;

        // 2. Recurse
        int leftInfo = dfsHelper(node.left);
        int rightInfo = dfsHelper(node.right);

        // 3. Core Logic
        int localPathSum = node.val + leftInfo + rightInfo;

        // 4. Update Global
        result = Math.max(result, localPathSum);

        // 5. Return to parent
        return Math.max(node.val + Math.max(leftInfo, rightInfo), 0);
    }
}
// Time: O(N) | Space: O(H)
```

</div>

For graph problems, the pattern shifts to tracking visited nodes and iterating over neighbors. The key is knowing when to use an adjacency list and how to avoid revisiting nodes.

<div class="code-group">

```python
# Graph DFS template for an adjacency list
def graph_dfs_template(n, edges):
    # 1. Build adjacency list
    graph = {i: [] for i in range(n)}
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u) # if undirected

    visited = set()
    component_count = 0

    def dfs(node):
        # Process node (e.g., mark visited, add to component list)
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)

    # 2. Iterate over all nodes to find connected components
    for i in range(n):
        if i not in visited:
            component_count += 1
            dfs(i)

    return component_count

# Time Complexity: O(V + E) for building graph and traversal.
# Space Complexity: O(V + E) for the adjacency list and O(V) for the visited set/recursion stack.
```

```javascript
function graphDfsTemplate(n, edges) {
  // Build adjacency list
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u); // if undirected
  }

  const visited = new Set();
  let componentCount = 0;

  function dfs(node) {
    visited.add(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      componentCount++;
      dfs(i);
    }
  }
  return componentCount;
}
// Time: O(V + E) | Space: O(V + E)
```

```java
public int graphDfsTemplate(int n, int[][] edges) {
    // Build adjacency list
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
    for (int[] edge : edges) {
        int u = edge[0], v = edge[1];
        graph.get(u).add(v);
        graph.get(v).add(u); // if undirected
    }

    boolean[] visited = new boolean[n];
    int componentCount = 0;

    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            componentCount++;
            dfs(i, graph, visited);
        }
    }
    return componentCount;
}

private void dfs(int node, List<List<Integer>> graph, boolean[] visited) {
    visited[node] = true;
    for (int neighbor : graph.get(node)) {
        if (!visited[neighbor]) {
            dfs(neighbor, graph, visited);
        }
    }
}
// Time: O(V + E) | Space: O(V + E)
```

</div>

## How Wix Tests Depth-First Search vs Other Companies

Compared to other companies, Wix's DFS questions are **pragmatic and of medium difficulty**. They rarely dive into the extreme optimization puzzles favored by some quant firms or the highly theoretical graph algorithms sometimes seen at Google. Unlike Meta, which might heavily weight graph DFS for social network problems, or Amazon, which might tie it to directory traversal, Wix's problems feel grounded in their product domain: trees and components.

The unique aspect is the **emphasis on clean, correct, and maintainable code**. You're not just finding _an_ answer; you're writing code a colleague might need to understand later. Expect follow-up questions about edge cases (null roots, single-node trees, cycles in graphs if not precluded) and possibly a discussion about iterative vs. recursive approaches and their trade-offs (stack overflow risk vs. readability).

## Study Order

1.  **Basic Tree Traversal (Pre-order, In-order, Post-order):** You must be able to traverse a tree in your sleep. This is the foundation. Understand what computation happens when (before children, between, or after).
2.  **Simple Recursive Tree Properties:** Problems like **Maximum Depth of Binary Tree (#104)** and **Balanced Binary Tree (#110)**. These teach you how to return a value from a subtree.
3.  **Path-Based Problems in Trees:** This is the core of Wix's focus. Practice **Binary Tree Maximum Path Sum (#124)**, **Diameter of Binary Tree (#543)**, and **Longest Univalue Path (#687)**. They all use the "global variable + post-order return" pattern.
4.  **Basic Graph Traversal (Adjacency List & Grid):** Learn to build a graph from edges and perform DFS to mark components. **Number of Islands (#200)** and **Clone Graph (#133)** are perfect.
5.  **Combination of DFS with Other Concepts:** Finally, tackle problems where DFS is part of the solution, like backtracking (**Word Search (#79)**) or DFS with memoization for DP on trees (**House Robber III (#337)**).

## Recommended Practice Order

Solve these problems in sequence to build the skills Wix tests:

1.  **Maximum Depth of Binary Tree (#104)** - The absolute baseline.
2.  **Diameter of Binary Tree (#543)** - Introduces the global accumulator pattern.
3.  **Binary Tree Maximum Path Sum (#124)** - Masters the global accumulator pattern. This is a must-solve.
4.  **Number of Islands (#200)** - Applies DFS to a grid (implicit graph).
5.  **Clone Graph (#133)** - Applies DFS to an explicit adjacency list graph.
6.  **Longest Consecutive Sequence (in a Binary Tree) (#298)** - A good "state passing" variation.
7.  **Path Sum III (#437)** - A slightly more complex tree path problem that may involve prefix sums.
8.  **Course Schedule (#207)** - Introduces DFS for cycle detection (topological sort), a useful advanced pattern.

This progression takes you from the fundamentals to the nuanced patterns Wix employs, ensuring you're not just memorizing solutions but internalizing the flexible DFS template that can adapt to their questions.

[Practice Depth-First Search at Wix](/company/wix/depth-first-search)
