---
title: "How to Solve Lowest Common Ancestor of a Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Lowest Common Ancestor of a Binary Tree. Medium difficulty, 68.8% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2026-04-21"
category: "dsa-patterns"
tags:
  ["lowest-common-ancestor-of-a-binary-tree", "tree", "depth-first-search", "binary-tree", "medium"]
---

# How to Solve Lowest Common Ancestor of a Binary Tree

Finding the lowest common ancestor (LCA) in a binary tree is a classic interview problem that tests your understanding of tree traversal and recursion. What makes this problem interesting is that unlike in a binary search tree, we can't use node values to guide our search—we must traverse the entire tree while tracking ancestor relationships. The challenge lies in efficiently determining when we've found the "lowest" (deepest) node that's an ancestor to both target nodes.

## Visual Walkthrough

Let's trace through a concrete example. Consider this binary tree:

```
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4
```

We want to find the LCA of nodes 5 and 1.

**Step 1:** Start at root node 3. Check left subtree for nodes 5 and 1.
**Step 2:** In left subtree (rooted at 5), we find node 5 itself. The right subtree of 5 contains neither 5 nor 1.
**Step 3:** Back at root 3, check right subtree for nodes 5 and 1.
**Step 4:** In right subtree (rooted at 1), we find node 1 itself. The left subtree of 1 contains neither 5 nor 1.
**Step 5:** Since root 3 has one target (5) in its left subtree and the other target (1) in its right subtree, node 3 is the LCA.

Now let's find LCA of nodes 5 and 4:
**Step 1:** Start at root 3. Check left subtree.
**Step 2:** At node 5, we find one target (5 itself). Check its right subtree.
**Step 3:** At node 2, neither target is the node itself. Check left and right children.
**Step 4:** Left child 7 is neither target. Right child 4 is one target.
**Step 5:** Node 2 returns "found target 4" up to node 5.
**Step 6:** Node 5 sees it's one target and has found the other target in its subtree, so node 5 is the LCA.

The key insight: a node is the LCA if either (1) it's one of the targets and the other target is in its subtree, or (2) it has one target in its left subtree and the other in its right subtree.

## Brute Force Approach

A naive approach would be to first find the path from root to each target node, then compare the two paths to find their last common node. Here's how that would work:

1. Perform DFS to find path from root to node p
2. Perform DFS to find path from root to node q
3. Compare the two paths element by element
4. The last node that appears in both paths is the LCA

While this approach works, it requires O(n) time to find each path and O(n) space to store them. More importantly, it requires two full traversals of the tree. We can do better with a single traversal.

## Optimized Approach

The optimal solution uses a single post-order traversal with clever return values. The key insight is that we don't need to store entire paths—we just need to know when we've found both targets in the current node's subtrees.

Here's the recursive logic:

- If current node is null, return null (base case)
- If current node is either p or q, return current node (we found a target)
- Recursively search left and right subtrees
- If both left and right searches return non-null, current node is the LCA
- If only one side returns non-null, propagate that result upward
- If both sides return null, propagate null upward

This works because:

1. When we find p or q, we immediately return that node
2. The LCA will be the first node that receives non-null returns from both its left and right children
3. Nodes above the LCA will only receive one non-null return (the LCA itself)

## Optimal Solution

<div class="code-group">

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

# Time: O(n) - We visit each node at most once
# Space: O(h) - Recursion stack height, where h is tree height (worst case O(n) for skewed tree)
class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        # Base case: if root is None or we've found one of the target nodes
        if not root or root == p or root == q:
            return root

        # Recursively search in left and right subtrees
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)

        # If both left and right return non-null, current node is the LCA
        if left and right:
            return root

        # If only one side returns non-null, propagate that result upward
        # This handles cases where one node is descendant of the other
        return left if left else right
```

```javascript
// Definition for a binary tree node.
// function TreeNode(val) {
//     this.val = val;
//     this.left = this.right = null;
// }

// Time: O(n) - We visit each node at most once
// Space: O(h) - Recursion stack height, where h is tree height (worst case O(n) for skewed tree)
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
  // Base case: if root is null or we've found one of the target nodes
  if (!root || root === p || root === q) {
    return root;
  }

  // Recursively search in left and right subtrees
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  // If both left and right return non-null, current node is the LCA
  if (left && right) {
    return root;
  }

  // If only one side returns non-null, propagate that result upward
  // This handles cases where one node is descendant of the other
  return left ? left : right;
};
```

```java
// Definition for a binary tree node.
// public class TreeNode {
//     int val;
//     TreeNode left;
//     TreeNode right;
//     TreeNode(int x) { val = x; }
// }

// Time: O(n) - We visit each node at most once
// Space: O(h) - Recursion stack height, where h is tree height (worst case O(n) for skewed tree)
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Base case: if root is null or we've found one of the target nodes
        if (root == null || root == p || root == q) {
            return root;
        }

        // Recursively search in left and right subtrees
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);

        // If both left and right return non-null, current node is the LCA
        if (left != null && right != null) {
            return root;
        }

        // If only one side returns non-null, propagate that result upward
        // This handles cases where one node is descendant of the other
        return left != null ? left : right;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the tree. In the worst case, we might need to visit every node (e.g., when p and q are leaves at the deepest level). Each node is visited exactly once.

**Space Complexity:** O(h) where h is the height of the tree. This is the space used by the recursion stack. In the worst case of a skewed tree (like a linked list), h = n, so space complexity becomes O(n). In a balanced tree, h = log n.

The space complexity comes from:

- Recursion call stack depth equals the height of the tree
- No additional data structures are used beyond the recursion stack

## Common Mistakes

1. **Assuming nodes always exist in the tree:** The problem guarantees p and q exist, but in real interviews, you might need to handle the case where one or both nodes don't exist. Always clarify assumptions with your interviewer.

2. **Confusing node values with node references:** This problem gives you actual TreeNode objects, not values. Comparing node values instead of node references will fail if there are duplicate values in the tree.

3. **Not handling the case where one node is ancestor of the other:** The solution elegantly handles this case—when we find the ancestor node first, it gets returned immediately, and the recursion propagates it upward.

4. **Trying to use BST properties on a regular binary tree:** Candidates sometimes mistakenly try to compare values to decide whether to go left or right, but that only works for binary search trees. For regular binary trees, we must search both subtrees.

## When You'll See This Pattern

This "bottom-up propagation" pattern appears in many tree problems where you need to aggregate information from subtrees:

1. **Diameter of Binary Tree (LeetCode 543):** Similar bottom-up approach where each node computes the longest path through it based on heights from left and right subtrees.

2. **Maximum Path Sum (LeetCode 124):** Each node computes the maximum path sum that can be extended upward, similar to how we propagate LCA findings upward.

3. **Subtree of Another Tree (LeetCode 572):** Checking if one tree is a subtree of another uses similar recursive comparison logic.

The pattern is: solve the problem for left and right subtrees recursively, then combine those results at the current node to compute the answer.

## Key Takeaways

1. **Post-order traversal is powerful for bottom-up computation:** When you need information from both subtrees to compute something at the current node, post-order traversal (left, right, then process current) is often the right approach.

2. **Return values can carry multiple meanings:** In this solution, a non-null return means either "I found p/q" or "I found the LCA." This dual meaning makes the code concise but requires careful understanding.

3. **The LCA is the first node that "sees" both targets in its subtrees:** This mental model helps understand why the algorithm works—nodes below the LCA see at most one target, nodes above see the LCA itself as one target.

Related problems: [Lowest Common Ancestor of a Binary Search Tree](/problem/lowest-common-ancestor-of-a-binary-search-tree), [Smallest Common Region](/problem/smallest-common-region), [Find Players With Zero or One Losses](/problem/find-players-with-zero-or-one-losses)
