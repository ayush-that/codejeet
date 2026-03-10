---
title: "How to Solve Sum of Nodes with Even-Valued Grandparent — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sum of Nodes with Even-Valued Grandparent. Medium difficulty, 85.9% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2026-03-24"
category: "dsa-patterns"
tags:
  [
    "sum-of-nodes-with-even-valued-grandparent",
    "tree",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Solve Sum of Nodes with Even-Valued Grandparent

This problem asks us to sum the values of nodes in a binary tree that have a grandparent with an even value. The challenge lies in efficiently tracking the grandparent relationship while traversing the tree, since we need to know not just the current node's parent, but also its grandparent's value to make decisions.

## Visual Walkthrough

Let's walk through a concrete example to build intuition. Consider this binary tree:

```
        6
       / \
      7   8
     / \   \
    2   7   1
   /   / \
  9   1   4
```

We need to find all nodes with an even-valued grandparent and sum their values.

**Step-by-step reasoning:**

1. Start at root (6, even). Its children (7 and 8) don't have grandparents, so skip.
2. Move to node 7 (left child of 6). Its children (2 and 7) have grandparent 6 (even), so both qualify. Add 2 + 7 = 9 to our sum.
3. Move to node 8 (right child of 6, even). Its child 1 has grandparent 6 (even), so add 1 to sum. Total: 10.
4. Move to node 2 (left child of 7). Its child 9 has grandparent 7 (odd), so doesn't qualify.
5. Move to node 7 (right child of 7). Its children (1 and 4) have grandparent 7 (odd), so don't qualify.
6. Final sum = 2 + 7 + 1 = 10.

The key insight: we need to pass down grandparent information as we traverse the tree. When we're at a node, we need to know its parent and grandparent to determine if its children should be included in the sum.

## Brute Force Approach

A naive approach would be to first find all even-valued nodes, then for each even node, find all its grandchildren, and sum their values. This requires:

1. Traversing the tree once to find all even-valued nodes: O(n)
2. For each even node, finding all grandchildren: potentially O(n) per node in worst case
3. Total complexity: O(n²) in worst case (when tree is skewed and all nodes are even)

This approach is inefficient because we're doing redundant work - we traverse the tree multiple times and repeatedly visit the same nodes. Additionally, we need to handle the complexity of finding grandchildren from a given node, which requires careful navigation through the tree structure.

The main issue with the brute force approach is that it doesn't leverage the natural recursive structure of tree traversal. We're treating the tree as a static structure to query repeatedly rather than flowing information naturally from ancestors to descendants.

## Optimized Approach

The optimal solution uses DFS (Depth-First Search) with state passing. As we traverse the tree recursively, we pass down information about the current node's parent and grandparent. This way, when we reach a node, we can immediately check if its grandparent (two levels up) is even.

**Key insight:** In tree traversal problems where we need information from ancestors, we can pass that information as parameters in our recursive function. For this problem, we need to know:

- The current node
- Its parent (to serve as grandparent for its children)
- Its grandparent (to check if even for the current node)

**Step-by-step reasoning:**

1. Start DFS from the root with `parent = None` and `grandparent = None`
2. At each node:
   - If `grandparent` exists and is even, add current node's value to sum
   - Recursively process left and right children, passing current node as the new parent, and current node's parent as the new grandparent
3. This ensures each node knows about its grandparent when it's processed

This approach visits each node exactly once and uses O(h) space for the recursion stack, where h is the height of the tree.

## Optimal Solution

Here's the complete solution using DFS with state passing:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes in the tree
# Space: O(h) where h is the height of the tree (recursion stack)
class Solution:
    def sumEvenGrandparent(self, root: TreeNode) -> int:
        # Helper function for DFS traversal
        # node: current node being processed
        # parent: parent of current node (None for root)
        # grandparent: grandparent of current node (None for root and its children)
        def dfs(node, parent, grandparent):
            # Base case: if node is None, return 0
            if not node:
                return 0

            # Initialize sum for this subtree
            total = 0

            # Check if grandparent exists and has even value
            # If yes, add current node's value to total
            if grandparent and grandparent.val % 2 == 0:
                total += node.val

            # Recursively process left subtree
            # Current node becomes parent for left child
            # Current node's parent becomes grandparent for left child
            total += dfs(node.left, node, parent)

            # Recursively process right subtree
            total += dfs(node.right, node, parent)

            return total

        # Start DFS from root with no parent or grandparent
        return dfs(root, None, None)
```

```javascript
// Time: O(n) where n is number of nodes in the tree
// Space: O(h) where h is the height of the tree (recursion stack)
function sumEvenGrandparent(root) {
  // Helper function for DFS traversal
  // node: current node being processed
  // parent: parent of current node (null for root)
  // grandparent: grandparent of current node (null for root and its children)
  function dfs(node, parent, grandparent) {
    // Base case: if node is null, return 0
    if (!node) {
      return 0;
    }

    let total = 0;

    // Check if grandparent exists and has even value
    // If yes, add current node's value to total
    if (grandparent && grandparent.val % 2 === 0) {
      total += node.val;
    }

    // Recursively process left subtree
    // Current node becomes parent for left child
    // Current node's parent becomes grandparent for left child
    total += dfs(node.left, node, parent);

    // Recursively process right subtree
    total += dfs(node.right, node, parent);

    return total;
  }

  // Start DFS from root with no parent or grandparent
  return dfs(root, null, null);
}
```

```java
// Time: O(n) where n is number of nodes in the tree
// Space: O(h) where h is the height of the tree (recursion stack)
class Solution {
    public int sumEvenGrandparent(TreeNode root) {
        // Start DFS from root with no parent or grandparent
        return dfs(root, null, null);
    }

    // Helper function for DFS traversal
    // node: current node being processed
    // parent: parent of current node (null for root)
    // grandparent: grandparent of current node (null for root and its children)
    private int dfs(TreeNode node, TreeNode parent, TreeNode grandparent) {
        // Base case: if node is null, return 0
        if (node == null) {
            return 0;
        }

        int total = 0;

        // Check if grandparent exists and has even value
        // If yes, add current node's value to total
        if (grandparent != null && grandparent.val % 2 == 0) {
            total += node.val;
        }

        // Recursively process left subtree
        // Current node becomes parent for left child
        // Current node's parent becomes grandparent for left child
        total += dfs(node.left, node, parent);

        // Recursively process right subtree
        total += dfs(node.right, node, parent);

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We visit each node exactly once during the DFS traversal
- At each node, we perform O(1) operations: checking grandparent condition and making recursive calls
- Total operations scale linearly with the number of nodes

**Space Complexity:** O(h) where h is the height of the tree

- This is the space used by the recursion stack
- In the worst case (skewed tree), h = n, so O(n)
- In the best case (balanced tree), h = log n, so O(log n)
- The space complexity does not include the space used by the tree itself, only the auxiliary space for the recursion

## Common Mistakes

1. **Forgetting to handle null nodes:** When traversing a binary tree, always check if the current node is null before accessing its properties. This is especially important for leaf nodes where left and right children are null.

2. **Incorrect state passing in recursion:** A common error is passing the wrong nodes as parent/grandparent parameters. Remember: for a child node, the current node becomes its parent, and the current node's parent becomes its grandparent.

3. **Checking grandparent at the wrong level:** Some candidates check if the current node's parent is even (instead of grandparent), or they check the condition when processing children rather than when processing the node itself. The rule is: "nodes with an even-valued grandparent" means we check the grandparent when processing the node.

4. **Not handling the root and its children correctly:** The root has no parent or grandparent, so it should never be included in the sum. The root's children have no grandparent, so they should also not be included. Make sure your base cases handle this correctly.

## When You'll See This Pattern

This pattern of passing ancestor information during tree traversal appears in several tree problems:

1. **Binary Tree Maximum Path Sum (LeetCode 124):** Similar state passing is needed to track the maximum path sum through each node while considering contributions from left and right subtrees.

2. **Lowest Common Ancestor of a Binary Tree (LeetCode 236):** While often solved differently, one approach involves passing up information about found nodes from children to parents.

3. **Path Sum problems (LeetCode 112, 113, 437):** These problems require tracking the sum from root to current node, which is similar to tracking ancestor information.

The core technique is **DFS with state propagation** - passing information down from ancestors to descendants (or up from descendants to ancestors) during traversal. This is more efficient than repeatedly querying the tree structure.

## Key Takeaways

1. **When you need ancestor information at a node, pass it as parameters** in your recursive function rather than trying to compute it from scratch at each node. This transforms an O(n²) problem into O(n).

2. **Tree traversal with state is a powerful pattern** for problems involving relationships between nodes at different levels (parent-child, grandparent-grandchild, etc.).

3. **Always define what each parameter represents clearly** - in this case, `parent` and `grandparent` parameters track exactly two levels of ancestry for the current node being processed.

[Practice this problem on CodeJeet](/problem/sum-of-nodes-with-even-valued-grandparent)
