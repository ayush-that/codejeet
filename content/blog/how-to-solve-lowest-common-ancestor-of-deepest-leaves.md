---
title: "How to Solve Lowest Common Ancestor of Deepest Leaves — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Lowest Common Ancestor of Deepest Leaves. Medium difficulty, 79.4% acceptance rate. Topics: Hash Table, Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2028-05-11"
category: "dsa-patterns"
tags:
  ["lowest-common-ancestor-of-deepest-leaves", "hash-table", "tree", "depth-first-search", "medium"]
---

# How to Solve Lowest Common Ancestor of Deepest Leaves

This problem asks us to find the lowest common ancestor (LCA) of all the deepest leaves in a binary tree. What makes this interesting is that we're not looking for the LCA of two specific nodes, but rather the LCA of an entire set of nodes - specifically, all leaves at the maximum depth. This requires us to first identify which leaves are deepest, then find their common ancestor.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this tree:

```
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4
```

**Step 1: Identify deepest leaves**

- Depth 0: Node 3
- Depth 1: Nodes 5 and 1
- Depth 2: Nodes 6, 2, 0, 8
- Depth 3: Nodes 7 and 4

The deepest leaves are at depth 3: nodes 7 and 4.

**Step 2: Find their LCA**

- Path to node 7: 3 → 5 → 2 → 7
- Path to node 4: 3 → 5 → 2 → 4
- Common ancestors: 3, 5, 2
- Lowest common ancestor: 2

So for this tree, the answer is node 2. Notice that the LCA of deepest leaves isn't necessarily a leaf itself - it's node 2, which has children.

## Brute Force Approach

A naive approach would be:

1. Find all leaves and their depths using DFS
2. Identify which leaves have maximum depth
3. For each pair of deepest leaves, find their LCA
4. Find the common LCA of all deepest leaves

The problem with this approach is step 3-4. If there are k deepest leaves, we'd need to compute pairwise LCAs, which is O(k²) operations. Each LCA computation is O(n) in a binary tree, making this O(k²n) overall. In the worst case where all leaves are at the same depth, k could be O(n), making this O(n³) - far too slow.

Even a slightly better brute force would be to find paths to all deepest leaves and look for their longest common prefix. This would be O(n²) but still inefficient.

## Optimized Approach

The key insight is that we don't need to explicitly find all deepest leaves or compute pairwise LCAs. Instead, we can use a single DFS pass that returns two pieces of information from each node:

1. The maximum depth reachable from this node
2. The LCA of deepest leaves in this subtree

Here's the recursive logic:

- For a leaf node: depth = current depth, LCA = the node itself
- For an internal node:
  - Get left subtree's max depth and LCA
  - Get right subtree's max depth and LCA
  - If left and right have equal max depth: this node is the LCA for its subtree
  - If one side is deeper: propagate that side's LCA upward
  - If one side is null: just use the other side's result

This works because:

1. If both subtrees have leaves at the same maximum depth, the current node must be their LCA
2. If one subtree has deeper leaves, those leaves determine the answer for this subtree
3. The answer propagates upward naturally through the recursion

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) - we visit each node once
# Space: O(h) - recursion stack where h is tree height
class Solution:
    def lcaDeepestLeaves(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        # Helper function returns (depth, LCA_node) for subtree rooted at 'node'
        def dfs(node):
            if not node:
                return 0, None  # Depth 0, no LCA for empty subtree

            # Recursively process left and right subtrees
            left_depth, left_lca = dfs(node.left)
            right_depth, right_lca = dfs(node.right)

            # Case 1: Both subtrees have same max depth
            # Current node is LCA for deepest leaves in this subtree
            if left_depth == right_depth:
                return left_depth + 1, node

            # Case 2: Left subtree has deeper leaves
            # Propagate left's LCA upward, increment depth
            elif left_depth > right_depth:
                return left_depth + 1, left_lca

            # Case 3: Right subtree has deeper leaves
            # Propagate right's LCA upward, increment depth
            else:
                return right_depth + 1, right_lca

        # Start DFS from root, return only the LCA node
        _, result = dfs(root)
        return result
```

```javascript
// Time: O(n) - we visit each node once
// Space: O(h) - recursion stack where h is tree height
var lcaDeepestLeaves = function (root) {
  // Helper function returns [depth, LCA_node] for subtree rooted at 'node'
  const dfs = (node) => {
    if (!node) return [0, null]; // Depth 0, no LCA for empty subtree

    // Recursively process left and right subtrees
    const [leftDepth, leftLCA] = dfs(node.left);
    const [rightDepth, rightLCA] = dfs(node.right);

    // Case 1: Both subtrees have same max depth
    // Current node is LCA for deepest leaves in this subtree
    if (leftDepth === rightDepth) {
      return [leftDepth + 1, node];
    }

    // Case 2: Left subtree has deeper leaves
    // Propagate left's LCA upward, increment depth
    else if (leftDepth > rightDepth) {
      return [leftDepth + 1, leftLCA];
    }

    // Case 3: Right subtree has deeper leaves
    // Propagate right's LCA upward, increment depth
    else {
      return [rightDepth + 1, rightLCA];
    }
  };

  // Start DFS from root, return only the LCA node
  const [_, result] = dfs(root);
  return result;
};
```

```java
// Time: O(n) - we visit each node once
// Space: O(h) - recursion stack where h is tree height
class Solution {
    // Helper class to return both depth and LCA from DFS
    class Result {
        int depth;
        TreeNode lca;
        Result(int d, TreeNode n) {
            depth = d;
            lca = n;
        }
    }

    public TreeNode lcaDeepestLeaves(TreeNode root) {
        return dfs(root).lca;
    }

    private Result dfs(TreeNode node) {
        if (node == null) {
            return new Result(0, null);  // Depth 0, no LCA for empty subtree
        }

        // Recursively process left and right subtrees
        Result left = dfs(node.left);
        Result right = dfs(node.right);

        // Case 1: Both subtrees have same max depth
        // Current node is LCA for deepest leaves in this subtree
        if (left.depth == right.depth) {
            return new Result(left.depth + 1, node);
        }

        // Case 2: Left subtree has deeper leaves
        // Propagate left's LCA upward, increment depth
        else if (left.depth > right.depth) {
            return new Result(left.depth + 1, left.lca);
        }

        // Case 3: Right subtree has deeper leaves
        // Propagate right's LCA upward, increment depth
        else {
            return new Result(right.depth + 1, right.lca);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We perform a single DFS traversal of the entire tree
- Each node is visited exactly once
- At each node, we do O(1) work (comparisons and arithmetic)

**Space Complexity: O(h)** where h is the height of the tree

- This is the recursion stack space
- In the worst case (skewed tree), h = n, so O(n)
- In the best case (balanced tree), h = log n, so O(log n)
- The space used by our return values is also O(h) due to recursion

## Common Mistakes

1. **Forgetting to handle null children properly**: When a node has only one child, you must correctly propagate the result from the non-null child. The base case should return depth 0 for null nodes.

2. **Incorrect depth calculation**: Remember that depth increases as you go down the tree. When returning from recursion, you need to add 1 to the child's depth to account for the current node.

3. **Confusing depth with height**: Depth is measured from root (root depth = 0), while height is measured from leaves (leaf height = 0). Our solution uses depth, so we increment as we return up the call stack.

4. **Trying to store all deepest leaves**: Some candidates try to first find all deepest leaves, then find their LCA. This requires extra O(n) space and makes the logic more complex than necessary.

## When You'll See This Pattern

This "bottom-up DFS with tuple returns" pattern appears in many tree problems:

1. **Diameter of Binary Tree (LeetCode 543)**: Returns (height, diameter) from each subtree
2. **Binary Tree Maximum Path Sum (LeetCode 124)**: Returns (max path sum ending at node, max path sum in subtree)
3. **Largest BST Subtree (LeetCode 333)**: Returns (min, max, size, isBST) for each subtree

The pattern is useful when you need to compute a global property of a tree by combining information from both subtrees. You define what information each recursive call needs to return, then define how to combine left and right results at each node.

## Key Takeaways

1. **Bottom-up computation**: When a tree problem requires information from both children to compute a parent's value, think about what tuple of information you need to return from each recursive call.

2. **Single pass optimization**: Many tree problems that seem to require multiple passes can be solved in one DFS traversal by returning multiple values.

3. **LCA generalization**: Finding LCA of multiple nodes follows similar logic to finding LCA of two nodes - look for the point where paths diverge or where subtrees have equal depth properties.

Related problems: [Lowest Common Ancestor of a Binary Tree IV](/problem/lowest-common-ancestor-of-a-binary-tree-iv)
