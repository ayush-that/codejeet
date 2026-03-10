---
title: "How to Solve Merge Two Binary Trees — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Merge Two Binary Trees. Easy difficulty, 79.0% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2026-11-12"
category: "dsa-patterns"
tags: ["merge-two-binary-trees", "tree", "depth-first-search", "breadth-first-search", "easy"]
---

# How to Solve Merge Two Binary Trees

You're given two binary trees and need to merge them into a new tree where overlapping nodes have their values summed. What makes this problem interesting is that it's a great introduction to tree recursion and teaches you how to traverse two trees simultaneously while handling different structural cases.

## Visual Walkthrough

Let's trace through a concrete example:

**Tree 1:**

```
     1
   /   \
  3     2
 /       \
5         4
```

**Tree 2:**

```
     2
   /   \
  1     3
   \     \
    4     7
```

**Step-by-step merging:**

1. **Root nodes (1 + 2 = 3):** Both exist, so we create a new node with value 3.

2. **Left child of root:**
   - Tree 1 has node 3, Tree 2 has node 1 → sum = 4
   - Recursively merge their children:
     - Left child: Tree 1 has 5, Tree 2 is null → result is 5
     - Right child: Tree 1 is null, Tree 2 has 4 → result is 4

3. **Right child of root:**
   - Tree 1 has 2, Tree 2 has 3 → sum = 5
   - Recursively merge their children:
     - Left child: Both null → result is null
     - Right child: Tree 1 has 4, Tree 2 has 7 → sum = 11

**Final merged tree:**

```
     3
   /   \
  4     5
 / \     \
5   4    11
```

## Brute Force Approach

For tree problems, there's rarely a true "brute force" in the traditional sense, but a naive approach might be:

1. Convert both trees to arrays using level-order traversal
2. Try to merge the arrays element by element
3. Reconstruct a tree from the merged array

**Why this fails:**

- Binary trees aren't necessarily complete (missing nodes create gaps)
- Array representation wastes space for null nodes
- The reconstruction step is complex and error-prone
- Time complexity becomes O(n + m) for conversion plus O(n + m) for reconstruction

The key insight is that we need to traverse both trees simultaneously, not convert them to another structure first.

## Optimal Solution

The optimal solution uses depth-first recursion to traverse both trees simultaneously. At each step:

1. If both nodes exist → create new node with summed value, then recursively merge left and right children
2. If only one node exists → return that node (no need to create new node, can reuse existing structure)
3. If both nodes are null → return null

<div class="code-group">

```python
# Time: O(min(n, m)) where n,m are nodes in each tree
# Space: O(min(h1, h2)) for recursion stack
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def mergeTrees(root1, root2):
    """
    Merge two binary trees by summing overlapping nodes.

    Args:
        root1: Root of first binary tree
        root2: Root of second binary tree

    Returns:
        Root of merged binary tree
    """
    # Base case 1: Both nodes are None
    if not root1 and not root2:
        return None

    # Base case 2: Only root1 exists, return root1
    if not root2:
        return root1

    # Base case 3: Only root2 exists, return root2
    if not root1:
        return root2

    # Both nodes exist - create new node with summed value
    merged_node = TreeNode(root1.val + root2.val)

    # Recursively merge left subtrees
    merged_node.left = mergeTrees(root1.left, root2.left)

    # Recursively merge right subtrees
    merged_node.right = mergeTrees(root1.right, root2.right)

    return merged_node
```

```javascript
// Time: O(min(n, m)) where n,m are nodes in each tree
// Space: O(min(h1, h2)) for recursion stack
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function mergeTrees(root1, root2) {
  /**
   * Merge two binary trees by summing overlapping nodes.
   *
   * @param {TreeNode} root1 - Root of first binary tree
   * @param {TreeNode} root2 - Root of second binary tree
   * @return {TreeNode} Root of merged binary tree
   */

  // Base case 1: Both nodes are null
  if (!root1 && !root2) {
    return null;
  }

  // Base case 2: Only root1 exists, return root1
  if (!root2) {
    return root1;
  }

  // Base case 3: Only root2 exists, return root2
  if (!root1) {
    return root2;
  }

  // Both nodes exist - create new node with summed value
  const mergedNode = new TreeNode(root1.val + root2.val);

  // Recursively merge left subtrees
  mergedNode.left = mergeTrees(root1.left, root2.left);

  // Recursively merge right subtrees
  mergedNode.right = mergeTrees(root1.right, root2.right);

  return mergedNode;
}
```

```java
// Time: O(min(n, m)) where n,m are nodes in each tree
// Space: O(min(h1, h2)) for recursion stack
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    public TreeNode mergeTrees(TreeNode root1, TreeNode root2) {
        /**
         * Merge two binary trees by summing overlapping nodes.
         *
         * @param root1 Root of first binary tree
         * @param root2 Root of second binary tree
         * @return Root of merged binary tree
         */

        // Base case 1: Both nodes are null
        if (root1 == null && root2 == null) {
            return null;
        }

        // Base case 2: Only root1 exists, return root1
        if (root2 == null) {
            return root1;
        }

        // Base case 3: Only root2 exists, return root2
        if (root1 == null) {
            return root2;
        }

        // Both nodes exist - create new node with summed value
        TreeNode mergedNode = new TreeNode(root1.val + root2.val);

        // Recursively merge left subtrees
        mergedNode.left = mergeTrees(root1.left, root2.left);

        // Recursively merge right subtrees
        mergedNode.right = mergeTrees(root1.right, root2.right);

        return mergedNode;
    }
}
```

</div>

**Alternative Iterative Solution (BFS):**
You could also solve this using a queue for breadth-first traversal. The iterative approach:

1. Use a queue to store pairs of nodes from both trees
2. Process level by level, summing values when both exist
3. Handle children by enqueuing appropriate pairs

However, the recursive solution is cleaner and more intuitive for this problem.

## Complexity Analysis

**Time Complexity: O(min(n, m))**

- We only traverse nodes that exist in both trees
- When one tree has a null node where the other has a node, we stop traversing that branch
- In worst case (both trees have same structure), we visit all nodes: O(n + m)

**Space Complexity: O(min(h1, h2))**

- Recursion stack depth equals the minimum height of the two trees
- In worst case (skewed trees), O(min(n, m))
- In best case (balanced trees), O(log(min(n, m)))

## Common Mistakes

1. **Creating unnecessary nodes:** Some candidates create new nodes even when only one tree has a node at that position. Remember: if only one tree has a node, you can reuse it directly.

2. **Incorrect base case order:** The order of base cases matters! Check `if not root1 and not root2` first, then handle the single-node cases. Reversing the order can cause errors.

3. **Modifying input trees:** The problem doesn't specify whether you can modify the input trees. While some solutions modify tree1 in-place, it's safer to create a new tree unless the problem explicitly allows modification.

4. **Forgetting to handle null children:** When recursively calling `mergeTrees`, you must pass the children even if they're null. The base cases will handle these null values correctly.

5. **Stack overflow on deep trees:** For very deep trees, recursion might cause stack overflow. In interviews, mention that an iterative BFS solution would avoid this issue.

## When You'll See This Pattern

This "simultaneous tree traversal" pattern appears in many tree comparison and combination problems:

1. **Same Tree (LeetCode 100)** - Compare two trees node by node
2. **Symmetric Tree (LeetCode 101)** - Compare left and right subtrees
3. **Merge Two Binary Search Trees** - Similar concept but with BST properties
4. **Add One Row to Tree (LeetCode 623)** - Traverse to specific depth and modify

The core pattern is: traverse two (or more) trees simultaneously, making decisions at each node based on the values/structure of all trees at that position.

## Key Takeaways

1. **Tree recursion with multiple inputs:** When working with multiple trees, extend the standard single-tree recursion to handle base cases for all input combinations.

2. **Structural vs. value operations:** This problem combines both - we care about tree structure (where nodes exist) and node values (summing them).

3. **Space optimization through reuse:** When one tree is missing a subtree, you can attach the other tree's subtree directly without creating new nodes.

4. **Think about traversal order:** For this problem, any traversal (pre-order, in-order, post-order) works since we need to process all nodes. But for other problems, the order might matter.

[Practice this problem on CodeJeet](/problem/merge-two-binary-trees)
