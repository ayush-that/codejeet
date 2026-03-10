---
title: "How to Solve Smallest Subtree with all the Deepest Nodes — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Smallest Subtree with all the Deepest Nodes. Medium difficulty, 77.5% acceptance rate. Topics: Hash Table, Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2028-03-18"
category: "dsa-patterns"
tags:
  [
    "smallest-subtree-with-all-the-deepest-nodes",
    "hash-table",
    "tree",
    "depth-first-search",
    "medium",
  ]
---

# How to Solve Smallest Subtree with all the Deepest Nodes

You're given a binary tree and need to find the smallest subtree that contains all the deepest nodes (nodes at the maximum depth). The challenge is that you need to identify which nodes are deepest, then find their lowest common ancestor efficiently. This problem is interesting because it combines depth calculation with ancestor finding in a single traversal.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this tree:

```
       3
     /   \
    5     1
   / \   / \
  6   2 0   8
     / \
    7   4
```

**Step 1: Identify deepest nodes**

- Depth 0: Node 3
- Depth 1: Nodes 5, 1
- Depth 2: Nodes 6, 2, 0, 8
- Depth 3: Nodes 7, 4

The maximum depth is 3, so the deepest nodes are 7 and 4.

**Step 2: Find their common ancestors**

- Parent of 7 and 4 is node 2
- Node 2's parent is node 5
- Node 5's parent is node 3

**Step 3: Determine the smallest subtree**
The smallest subtree containing both 7 and 4 must be rooted at their lowest common ancestor, which is node 2. If we return the subtree rooted at 2, it contains all deepest nodes (7 and 4) and is the smallest possible.

The key insight: The smallest subtree containing all deepest nodes is rooted at the lowest common ancestor of all deepest nodes.

## Brute Force Approach

A naive approach would be:

1. Perform a BFS or DFS to find all deepest nodes and their depths
2. For each node in the tree, check if its subtree contains all deepest nodes
3. Return the node with the smallest subtree that still contains all deepest nodes

This requires checking every node's subtree against all deepest nodes, resulting in O(n²) time complexity in the worst case (when the tree is a linked list and all leaves are deepest). We can do much better with a single traversal.

## Optimized Approach

The optimal solution uses a single post-order DFS traversal. Here's the key reasoning:

1. **What information do we need from each node?**
   - The depth of the deepest node in its left subtree
   - The depth of the deepest node in its right subtree
   - Whether the deepest nodes are in its left, right, or both subtrees

2. **How do we determine if a node is the answer?**
   - If both left and right subtrees contain deepest nodes at the same maximum depth, then the current node is the lowest common ancestor of all deepest nodes.
   - If only one side has deepest nodes, we return that side's result.
   - If neither side has deepest nodes (but the current node itself is deepest), we return the current node.

3. **Why does post-order traversal work?**
   - We need information from children before we can make decisions at the parent
   - By the time we process a node, we know what's happening in its entire subtree

## Optimal Solution

We'll implement a DFS that returns both the node (potential answer) and the depth of the deepest node in that subtree.

<div class="code-group">

```python
# Time: O(n) | Space: O(h) where h is the tree height (recursion stack)
class Solution:
    def subtreeWithAllDeepest(self, root: TreeNode) -> TreeNode:
        # Helper function returns (node, depth) pair
        # where node is the answer for current subtree
        def dfs(node):
            if not node:
                return None, 0

            # Recursively process left and right subtrees
            left_node, left_depth = dfs(node.left)
            right_node, right_depth = dfs(node.right)

            # Case 1: Both sides have deepest nodes at same depth
            # Current node is the lowest common ancestor
            if left_depth == right_depth:
                return node, left_depth + 1

            # Case 2: Left subtree has deeper nodes
            # Answer comes from left side
            elif left_depth > right_depth:
                return left_node, left_depth + 1

            # Case 3: Right subtree has deeper nodes
            # Answer comes from right side
            else:
                return right_node, right_depth + 1

        # Start DFS from root, return only the node
        result, _ = dfs(root)
        return result
```

```javascript
// Time: O(n) | Space: O(h) where h is the tree height (recursion stack)
function subtreeWithAllDeepest(root) {
  // Helper function returns [node, depth] pair
  const dfs = (node) => {
    if (!node) return [null, 0];

    // Recursively process left and right subtrees
    const [leftNode, leftDepth] = dfs(node.left);
    const [rightNode, rightDepth] = dfs(node.right);

    // Case 1: Both sides have deepest nodes at same depth
    // Current node is the lowest common ancestor
    if (leftDepth === rightDepth) {
      return [node, leftDepth + 1];
    }

    // Case 2: Left subtree has deeper nodes
    // Answer comes from left side
    else if (leftDepth > rightDepth) {
      return [leftNode, leftDepth + 1];
    }

    // Case 3: Right subtree has deeper nodes
    // Answer comes from right side
    else {
      return [rightNode, rightDepth + 1];
    }
  };

  // Start DFS from root, return only the node
  const [result] = dfs(root);
  return result;
}
```

```java
// Time: O(n) | Space: O(h) where h is the tree height (recursion stack)
class Solution {
    public TreeNode subtreeWithAllDeepest(TreeNode root) {
        return dfs(root).node;
    }

    // Helper class to return both node and depth
    private class Result {
        TreeNode node;
        int depth;
        Result(TreeNode n, int d) {
            node = n;
            depth = d;
        }
    }

    private Result dfs(TreeNode node) {
        if (node == null) {
            return new Result(null, 0);
        }

        // Recursively process left and right subtrees
        Result left = dfs(node.left);
        Result right = dfs(node.right);

        // Case 1: Both sides have deepest nodes at same depth
        // Current node is the lowest common ancestor
        if (left.depth == right.depth) {
            return new Result(node, left.depth + 1);
        }

        // Case 2: Left subtree has deeper nodes
        // Answer comes from left side
        else if (left.depth > right.depth) {
            return new Result(left.node, left.depth + 1);
        }

        // Case 3: Right subtree has deeper nodes
        // Answer comes from right side
        else {
            return new Result(right.node, right.depth + 1);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once during the DFS traversal
- At each node, we perform O(1) operations (comparisons and arithmetic)

**Space Complexity: O(h)**

- The recursion stack uses space proportional to the tree height
- In the worst case (skewed tree), h = n, so O(n)
- In the best case (balanced tree), h = log n, so O(log n)
- The algorithm itself doesn't use additional data structures beyond the call stack

## Common Mistakes

1. **Forgetting to handle the case where a node itself is deepest**
   - When a node has no children but is at maximum depth, it should return itself
   - Our solution handles this because when both children return depth 0, we return the current node with depth 1

2. **Incorrect depth calculation**
   - Each level should add 1 to the maximum depth from children
   - Don't forget the "+ 1" when returning from a node
   - The depth of a null node is 0, leaf node is 1

3. **Trying to find all deepest nodes first, then their LCA separately**
   - This requires two passes: one to find deepest nodes, another to find LCA
   - Our single-pass approach is more efficient and elegant
   - However, the two-pass approach (find max depth, then find LCA of nodes at that depth) is also valid and has the same complexity

4. **Not understanding when a node is the answer**
   - The answer is NOT necessarily at the maximum depth
   - It's the lowest node where deepest nodes appear in both subtrees
   - If all deepest nodes are in one subtree, we need to go deeper into that subtree

## When You'll See This Pattern

This problem combines two fundamental tree patterns:

1. **Depth calculation with post-order traversal** - Similar to "Maximum Depth of Binary Tree" (LeetCode 104) but with additional information propagation

2. **Lowest Common Ancestor (LCA) finding** - The core logic resembles "Lowest Common Ancestor of a Binary Tree" (LeetCode 236), but instead of looking for two specific nodes, we're looking for the LCA of all deepest nodes

3. **Tree result propagation** - Other problems using this pattern:
   - "Maximum Path Sum" (LeetCode 124) - propagates maximum path sums upward
   - "Diameter of Binary Tree" (LeetCode 543) - calculates diameters while tracking heights
   - "Binary Tree Maximum Path Sum" - similar upward propagation of computed values

The key pattern is using post-order traversal to compute information from children, then combining it at the parent to make decisions.

## Key Takeaways

1. **Post-order traversal is powerful for bottom-up computation** - When you need information from entire subtrees to make decisions at a node, process children first (post-order).

2. **Return multiple values when needed** - Don't be afraid to return tuples/objects containing both a result node and computed metadata (like depth). This avoids redundant computations.

3. **The LCA of all deepest nodes is where deepest nodes diverge** - If deepest nodes appear in both subtrees of a node, that node is their LCA. If they're all in one subtree, we need to look deeper in that direction.

[Practice this problem on CodeJeet](/problem/smallest-subtree-with-all-the-deepest-nodes)
