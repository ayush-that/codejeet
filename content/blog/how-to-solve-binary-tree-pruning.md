---
title: "How to Solve Binary Tree Pruning — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Binary Tree Pruning. Medium difficulty, 72.5% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2028-02-11"
category: "dsa-patterns"
tags: ["binary-tree-pruning", "tree", "depth-first-search", "binary-tree", "medium"]
---

# How to Solve Binary Tree Pruning

This problem asks us to remove all subtrees from a binary tree that don't contain the value `1`. The tricky part is that we need to make decisions about whether to keep or remove nodes based on what's in their entire subtree, not just the node itself. This means we can't decide to keep a node just by looking at its own value - we need to examine everything below it first.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
Input tree:
     1
    / \
   0   1
  / \ / \
 0  0 0  1
```

**Step-by-step reasoning:**

1. **Start at the bottom-left leaf (value 0):** This node has no children, and its value is 0. Since it doesn't contain 1 and has no descendants that could contain 1, we should remove it.

2. **Next leaf (left-middle, value 0):** Same situation - no children, value 0, so remove it.

3. **Now look at the node with value 0 (left child of root):** We've already determined both its children should be removed. This node's value is 0, and its entire subtree (just itself now) contains no 1s, so we should remove it too.

4. **Bottom-right leaf (value 1):** This node has value 1, so we keep it regardless of what's below (nothing in this case).

5. **Node above it (right child of root's right child, value 0):** This node has a child with value 1, so even though this node's value is 0, its subtree contains a 1. We keep it.

6. **Root's right child (value 1):** This node has value 1, so we definitely keep it.

7. **Root (value 1):** This node has value 1, so we keep it.

After pruning, the tree becomes:

```
     1
      \
       1
      / \
     0   1
```

The left subtree was completely removed because it contained no 1s anywhere.

The key insight: **We need to process nodes from the bottom up** (post-order traversal) because we can only decide whether to keep a node after we know what's in its entire subtree.

## Brute Force Approach

A naive approach might try to work top-down:

1. Check if the current node's subtree contains any 1s
2. If not, remove the entire subtree
3. Move to the next node

The problem with this approach is efficiency. For each node, we'd need to traverse its entire subtree to check for 1s. This leads to O(n²) time complexity in the worst case (like a skewed tree), since we're repeatedly traversing the same nodes.

Even worse, if we try to remove nodes while traversing top-down, we might remove a node that's needed by its parent. We need the complete information about a node's descendants before making a decision about the node itself.

## Optimized Approach

The optimal solution uses **post-order depth-first search (DFS)**:

1. **Process children first:** For each node, recursively process its left and right children. This gives us information about what's in the subtrees before we make decisions about the current node.

2. **Make decisions bottom-up:** After processing both children, we know:
   - Whether the left subtree contains any 1s
   - Whether the right subtree contains any 1s
   - The current node's own value

3. **Decision rule:** A node should be kept if:
   - Its value is 1, OR
   - Its left subtree contains 1s, OR
   - Its right subtree contains 1s

4. **Pruning action:** If a child subtree doesn't contain 1s, we set that child pointer to `null` (effectively removing the entire subtree).

5. **Return information upward:** Each recursive call returns whether its subtree contains any 1s. This allows parent nodes to make their decisions.

This approach visits each node exactly once, giving us O(n) time complexity.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the number of nodes in the tree
# Space: O(h) where h is the height of the tree (recursion stack)
class Solution:
    def pruneTree(self, root):
        """
        Prunes the binary tree by removing all subtrees that don't contain a 1.
        Returns the pruned tree's root.
        """
        # Helper function that returns True if the subtree contains a 1
        def contains_one(node):
            # Base case: empty node doesn't contain 1
            if not node:
                return False

            # Process left subtree first (post-order traversal)
            left_has_one = contains_one(node.left)
            right_has_one = contains_one(node.right)

            # If left subtree doesn't contain 1, prune it
            if not left_has_one:
                node.left = None
            # If right subtree doesn't contain 1, prune it
            if not right_has_one:
                node.right = None

            # Return True if current node is 1 OR left has 1 OR right has 1
            # This tells our parent whether this subtree contains any 1s
            return node.val == 1 or left_has_one or right_has_one

        # Start the pruning process from the root
        # If the entire tree doesn't contain 1, return None (empty tree)
        return root if contains_one(root) else None
```

```javascript
// Time: O(n) where n is the number of nodes in the tree
// Space: O(h) where h is the height of the tree (recursion stack)
function pruneTree(root) {
  /**
   * Prunes the binary tree by removing all subtrees that don't contain a 1.
   * Returns the pruned tree's root.
   */

  // Helper function that returns true if the subtree contains a 1
  function containsOne(node) {
    // Base case: null node doesn't contain 1
    if (node === null) {
      return false;
    }

    // Process left subtree first (post-order traversal)
    const leftHasOne = containsOne(node.left);
    const rightHasOne = containsOne(node.right);

    // If left subtree doesn't contain 1, prune it
    if (!leftHasOne) {
      node.left = null;
    }
    // If right subtree doesn't contain 1, prune it
    if (!rightHasOne) {
      node.right = null;
    }

    // Return true if current node is 1 OR left has 1 OR right has 1
    // This tells our parent whether this subtree contains any 1s
    return node.val === 1 || leftHasOne || rightHasOne;
  }

  // Start the pruning process from the root
  // If the entire tree doesn't contain 1, return null (empty tree)
  return containsOne(root) ? root : null;
}
```

```java
// Time: O(n) where n is the number of nodes in the tree
// Space: O(h) where h is the height of the tree (recursion stack)
class Solution {
    public TreeNode pruneTree(TreeNode root) {
        /**
         * Prunes the binary tree by removing all subtrees that don't contain a 1.
         * Returns the pruned tree's root.
         */

        // Start the pruning process from the root
        // If the entire tree doesn't contain 1, return null (empty tree)
        return containsOne(root) ? root : null;
    }

    // Helper function that returns true if the subtree contains a 1
    private boolean containsOne(TreeNode node) {
        // Base case: null node doesn't contain 1
        if (node == null) {
            return false;
        }

        // Process left subtree first (post-order traversal)
        boolean leftHasOne = containsOne(node.left);
        boolean rightHasOne = containsOne(node.right);

        // If left subtree doesn't contain 1, prune it
        if (!leftHasOne) {
            node.left = null;
        }
        // If right subtree doesn't contain 1, prune it
        if (!rightHasOne) {
            node.right = null;
        }

        // Return true if current node is 1 OR left has 1 OR right has 1
        // This tells our parent whether this subtree contains any 1s
        return node.val == 1 || leftHasOne || rightHasOne;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once during the post-order traversal
- Each node is processed in constant time (checking value and child pointers)
- Total time is proportional to the number of nodes in the tree

**Space Complexity: O(h)**

- The recursion stack depth equals the height of the tree
- In the worst case (skewed tree), this is O(n)
- In the best case (balanced tree), this is O(log n)
- We don't use any additional data structures beyond the recursion stack

## Common Mistakes

1. **Trying to prune top-down:** This is the most common mistake. Candidates often try to check if a node should be removed by looking at its value alone, then recursively prune its children. The problem is that a node with value 0 might need to be kept if its descendants contain 1s. Always process children first (post-order).

2. **Forgetting to handle the case where the entire tree gets pruned:** If the root's entire subtree contains no 1s, we should return `null`. Some solutions forget to check this and return the original root instead.

3. **Not actually removing the nodes:** Some solutions correctly identify which subtrees should be removed but forget to set the child pointers to `null`. Remember: pruning means disconnecting the subtree from its parent.

4. **Using pre-order or in-order traversal:** These traversals don't give us the information we need at the right time. We need to know about both children before deciding about the current node, which is exactly what post-order provides.

## When You'll See This Pattern

This "bottom-up decision making with post-order traversal" pattern appears in many tree problems:

1. **Binary Tree Maximum Path Sum (LeetCode 124):** Similar post-order approach where each node needs information from both children to compute the maximum path sum through that node.

2. **Diameter of Binary Tree (LeetCode 543):** Requires computing the height of each node's subtrees (bottom-up) to find the longest path between any two nodes.

3. **Lowest Common Ancestor (LeetCode 236):** Uses post-order traversal to propagate information about found nodes upward through the tree.

The common theme: when a node's decision depends on aggregated information from its entire subtree, post-order traversal is usually the right approach.

## Key Takeaways

1. **Post-order traversal is essential for bottom-up decision making:** When you need to make decisions about a node based on information from its entire subtree, process the children first, then the node.

2. **Return information upward in recursive tree problems:** Each recursive call should return enough information for its parent to make decisions. Here, we return whether the subtree contains a 1.

3. **Tree modification happens at the parent level:** To remove a subtree, you don't delete the subtree's nodes directly; you set the parent's child pointer to `null`. The garbage collector handles the rest.

[Practice this problem on CodeJeet](/problem/binary-tree-pruning)
