---
title: "How to Solve Trim a Binary Search Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Trim a Binary Search Tree. Medium difficulty, 66.6% acceptance rate. Topics: Tree, Depth-First Search, Binary Search Tree, Binary Tree."
date: "2027-10-18"
category: "dsa-patterns"
tags: ["trim-a-binary-search-tree", "tree", "depth-first-search", "binary-search-tree", "medium"]
---

# How to Solve Trim a Binary Search Tree

This problem asks us to trim a binary search tree so that all node values fall within a given range `[low, high]`. The tricky part is that we must maintain the BST structure — we can't just delete nodes and rebuild the tree. When a node is outside the range, we need to replace it with an appropriate subtree while preserving BST properties.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this BST:

```
      3
     / \
    0   4
     \
      2
     /
    1
```

Given `low = 1` and `high = 3`, we need to trim nodes outside [1,3].

**Step 1:** Start at root (3). 3 is within [1,3], so we keep it and recursively trim both subtrees.

**Step 2:** Left child of 3 is 0. 0 < 1, so it's outside the range. In a BST, if a node is too small, ALL nodes in its left subtree will also be too small (BST property). But its right subtree might contain valid nodes. So we discard node 0 and return the trimmed version of its right subtree.

**Step 3:** Right child of 0 is 2. 2 is within [1,3], so we keep it and recursively trim its subtrees.

**Step 4:** Left child of 2 is 1. 1 is within [1,3], and it has no children, so it stays.

**Step 5:** Right child of 3 is 4. 4 > 3, so it's outside the range. If a node is too large, ALL nodes in its right subtree will also be too large. But its left subtree might contain valid nodes. So we discard node 4 and return the trimmed version of its left subtree (which is null).

Final trimmed tree:

```
      3
     /
    2
   /
  1
```

Notice how the BST structure is preserved: 1 < 2 < 3.

## Brute Force Approach

A naive approach might be:

1. Traverse the tree and collect all values within [low, high]
2. Rebuild a new BST from these values

However, this violates the requirement to preserve the relative structure. The resulting tree might be balanced differently, and we lose the original parent-child relationships. For example, if the original tree had node A as parent of node B, our rebuilt tree might not maintain this relationship.

Even if we tried to delete nodes and reconnect subtrees without proper logic, we'd likely break BST properties or create incorrect tree structures. The brute force approach shows why we need to think carefully about BST properties when trimming.

## Optimized Approach

The key insight comes from understanding BST properties:

- Left subtree contains values **less than** current node
- Right subtree contains values **greater than** current node

This leads to a clean recursive solution:

1. **If current node is null**: Return null (base case)
2. **If current node value < low**: The entire left subtree will be < low (BST property), so we discard current node and left subtree. Return the trimmed right subtree.
3. **If current node value > high**: The entire right subtree will be > high, so we discard current node and right subtree. Return the trimmed left subtree.
4. **If current node is within range**: Keep the node, recursively trim both subtrees, and update pointers.

The elegance is that we never need to rearrange nodes beyond simple subtree replacements. Each recursive call returns the "root" of the trimmed subtree, which gets connected appropriately by its parent.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes in tree
# Space: O(h) where h is height of tree (recursion stack)
class Solution:
    def trimBST(self, root: Optional[TreeNode], low: int, high: int) -> Optional[TreeNode]:
        """
        Trim a BST to only include nodes with values in [low, high].
        Returns the root of the trimmed BST.
        """
        # Base case: empty tree
        if not root:
            return None

        # If current node's value is less than low, then ALL nodes in left subtree
        # will also be less than low (BST property). So we discard current node
        # and left subtree, and only keep the trimmed right subtree.
        if root.val < low:
            return self.trimBST(root.right, low, high)

        # If current node's value is greater than high, then ALL nodes in right subtree
        # will also be greater than high. So we discard current node and right subtree,
        # and only keep the trimmed left subtree.
        if root.val > high:
            return self.trimBST(root.left, low, high)

        # Current node is within range [low, high]
        # Recursively trim both subtrees and update pointers
        root.left = self.trimBST(root.left, low, high)
        root.right = self.trimBST(root.right, low, high)

        return root
```

```javascript
// Time: O(n) where n is number of nodes in tree
// Space: O(h) where h is height of tree (recursion stack)
/**
 * @param {TreeNode} root
 * @param {number} low
 * @param {number} high
 * @return {TreeNode}
 */
var trimBST = function (root, low, high) {
  // Base case: empty tree
  if (root === null) {
    return null;
  }

  // If current node's value is less than low, discard current node
  // and left subtree, keep only trimmed right subtree
  if (root.val < low) {
    return trimBST(root.right, low, high);
  }

  // If current node's value is greater than high, discard current node
  // and right subtree, keep only trimmed left subtree
  if (root.val > high) {
    return trimBST(root.left, low, high);
  }

  // Current node is within range [low, high]
  // Recursively trim both subtrees and update pointers
  root.left = trimBST(root.left, low, high);
  root.right = trimBST(root.right, low, high);

  return root;
};
```

```java
// Time: O(n) where n is number of nodes in tree
// Space: O(h) where h is height of tree (recursion stack)
class Solution {
    public TreeNode trimBST(TreeNode root, int low, int high) {
        // Base case: empty tree
        if (root == null) {
            return null;
        }

        // If current node's value is less than low, discard current node
        // and left subtree, keep only trimmed right subtree
        if (root.val < low) {
            return trimBST(root.right, low, high);
        }

        // If current node's value is greater than high, discard current node
        // and right subtree, keep only trimmed left subtree
        if (root.val > high) {
            return trimBST(root.left, low, high);
        }

        // Current node is within range [low, high]
        // Recursively trim both subtrees and update pointers
        root.left = trimBST(root.left, low, high);
        root.right = trimBST(root.right, low, high);

        return root;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**  
In the worst case, we visit every node once. Even though we skip some subtrees when `root.val < low` or `root.val > high`, we still might visit all nodes if the entire tree is within the range or if nodes are scattered such that we need to check both subtrees.

**Space Complexity: O(h)** where h is the height of the tree  
This is the recursion stack space. In the worst case (skewed tree), h = n, giving O(n) space. In a balanced tree, h = log n, giving O(log n) space.

The iterative version would use O(1) extra space, but recursion is more natural for tree problems and the O(h) space is acceptable for most interviews.

## Common Mistakes

1. **Forgetting to update child pointers after recursive calls**  
   When a node is within range, you must update `root.left` and `root.right` with the trimmed versions. Forgetting this means you're returning the original untrimmed subtrees.

2. **Not understanding BST properties when trimming**  
   Some candidates try to check both subtrees even when `root.val < low` or `root.val > high`. Remember: if `root.val < low`, ALL left subtree values are also `< low` (BST property), so we can safely discard the entire left subtree without examining it.

3. **Creating new nodes instead of reusing existing ones**  
   The problem asks to modify the tree in-place. Don't create new TreeNode objects — just rearrange the existing pointers.

4. **Missing the base case for null root**  
   Always check if `root` is null at the beginning. This handles empty trees and serves as the termination condition for leaf nodes.

## When You'll See This Pattern

This "conditional tree traversal with subtree replacement" pattern appears in several BST problems:

1. **Delete Node in a BST (LeetCode 450)** - Similar logic: when deleting a node, you need to find an appropriate replacement from subtrees while maintaining BST properties.

2. **Insert into a Binary Search Tree (LeetCode 701)** - While simpler, it uses the same recursive descent to find the correct position based on BST ordering.

3. **Convert BST to Greater Tree (LeetCode 538)** - Uses reverse in-order traversal to accumulate sums, similar to how we traverse with conditions here.

The core pattern is: use BST properties to make decisions about which subtrees to explore, and use recursion to build the result from the bottom up.

## Key Takeaways

1. **BST properties are your best friend** - When `node.val < low`, you know everything in the left subtree is also `< low`. This allows pruning without checking every node.

2. **Think in terms of subtree replacement** - Instead of deleting individual nodes, think about which entire subtree should replace the current node when it's out of range.

3. **Post-order style works well** - Process children first, then decide what to return to parent. The recursive calls return trimmed subtrees that we connect appropriately.

Remember: the solution is elegant because it leverages BST properties to avoid unnecessary work while maintaining the tree structure.

[Practice this problem on CodeJeet](/problem/trim-a-binary-search-tree)
