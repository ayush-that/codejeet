---
title: "How to Solve Find a Corresponding Node of a Binary Tree in a Clone of That Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find a Corresponding Node of a Binary Tree in a Clone of That Tree. Easy difficulty, 85.8% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2028-04-06"
category: "dsa-patterns"
tags:
  [
    "find-a-corresponding-node-of-a-binary-tree-in-a-clone-of-that-tree",
    "tree",
    "depth-first-search",
    "breadth-first-search",
    "easy",
  ]
---

# How to Find a Corresponding Node in a Cloned Binary Tree

You’re given two identical binary trees—the original and its clone—and a reference to a node in the original tree. Your task is to find and return the corresponding node in the cloned tree. The challenge is that you can’t modify either tree, and you need to navigate both trees simultaneously to locate the matching node.

What makes this problem interesting is that you’re not searching by value (since duplicate values could exist), but by **structural identity**. You need to follow the exact same path in both trees to guarantee you find the correct node.

## Visual Walkthrough

Let’s trace through an example:

**Original Tree:**

```
       7
     /   \
    4     3
         / \
        6   19
```

**Cloned Tree:** (identical structure)

```
       7
     /   \
    4     3
         / \
        6   19
```

**Target:** The node with value `6` in the original tree.

**Step-by-step traversal:**

1. Start at root of both trees (original=7, cloned=7)
2. Target `6` is not at root, so we need to search deeper
3. Compare target with left child of root (4): not equal
4. Compare target with right child of root (3): not equal
5. Since target must be in one of the subtrees, we search recursively:
   - Left subtree (4) doesn't contain target (4 has no children)
   - Right subtree (3) contains target
6. Move to right child: original=3, cloned=3
7. Check left child of 3: original=6, cloned=6 ← Found target!
8. Return the cloned node with value 6

The key insight: we traverse both trees **in parallel**, following the same path. When we find the target in the original tree, we return the node at the same position in the cloned tree.

## Brute Force Approach

A naive approach might be to traverse the cloned tree looking for a node with the same value as the target. However, this fails because **binary trees can have duplicate values**. Consider this tree:

```
       5
     /   \
    5     5
   /     / \
  5     5   5
```

If the target is one of the many `5` nodes, searching by value alone would return the wrong node. We need to match the exact position, not just the value.

Another brute force idea: collect all nodes from the original tree in a list, find the index of the target, then get the node at the same index from a list of cloned nodes collected in the same order. This would work but requires O(n) extra space and two full traversals.

## Optimal Solution

The optimal approach uses **simultaneous traversal** of both trees. We perform DFS (or BFS) on both trees at the same time, following identical paths. When we find the target node in the original tree, we return the current node in the cloned tree.

<div class="code-group">

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def getTargetCopy(self, original: TreeNode, cloned: TreeNode, target: TreeNode) -> TreeNode:
        """
        Time: O(n) - We may visit all n nodes in worst case
        Space: O(h) - Recursion stack depth equals tree height (h)
                     O(n) in worst case for skewed tree, O(log n) for balanced tree
        """

        # Base case: if original node is None, return None
        # This handles empty trees and leaf node children
        if original is None:
            return None

        # Check if current original node is the target
        # If yes, return the corresponding cloned node
        if original == target:
            return cloned

        # Recursively search in left subtree
        # We search both trees in parallel - same path, same time
        left_result = self.getTargetCopy(original.left, cloned.left, target)

        # If found in left subtree, return the result immediately
        # This avoids unnecessary right subtree search
        if left_result is not None:
            return left_result

        # If not found in left subtree, search right subtree
        # Again, both trees are traversed in parallel
        right_result = self.getTargetCopy(original.right, cloned.right, target)

        # Return whatever we found in right subtree (could be None or the target)
        return right_result
```

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * @param {TreeNode} original
 * @param {TreeNode} cloned
 * @param {TreeNode} target
 * @return {TreeNode}
 */
var getTargetCopy = function (original, cloned, target) {
  /**
   * Time: O(n) - May visit all n nodes in worst case
   * Space: O(h) - Recursion stack depth equals tree height
   *             O(n) worst case for skewed tree, O(log n) for balanced tree
   */

  // Base case: if we've reached a null node, return null
  if (original === null) {
    return null;
  }

  // Check if current original node is the target
  // If yes, return the corresponding cloned node
  if (original === target) {
    return cloned;
  }

  // Search in the left subtree first
  // Both trees are traversed simultaneously
  const leftResult = getTargetCopy(original.left, cloned.left, target);

  // If found in left subtree, return immediately
  // This is an optimization to avoid unnecessary right subtree search
  if (leftResult !== null) {
    return leftResult;
  }

  // If not found in left, search right subtree
  // Continue simultaneous traversal of both trees
  const rightResult = getTargetCopy(original.right, cloned.right, target);

  // Return result from right subtree (could be null or the target node)
  return rightResult;
};
```

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */

class Solution {
    public final TreeNode getTargetCopy(final TreeNode original, final TreeNode cloned, final TreeNode target) {
        /**
         * Time: O(n) - May visit all n nodes in worst case
         * Space: O(h) - Recursion stack depth equals tree height
         *             O(n) worst case for skewed tree, O(log n) for balanced tree
         */

        // Base case: if original node is null, return null
        // Handles empty trees and leaf node children
        if (original == null) {
            return null;
        }

        // Check if current original node is the target
        // Use reference equality (==), not value equality
        if (original == target) {
            return cloned;
        }

        // Recursively search left subtree
        // Both trees are traversed in parallel
        TreeNode leftResult = getTargetCopy(original.left, cloned.left, target);

        // If found in left subtree, return immediately
        // This optimization stops unnecessary right subtree traversal
        if (leftResult != null) {
            return leftResult;
        }

        // If not found in left, search right subtree
        // Continue simultaneous traversal
        TreeNode rightResult = getTargetCopy(original.right, cloned.right, target);

        // Return result from right subtree
        return rightResult;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- In the worst case, we might need to visit every node in the tree (if the target is the last node we check or doesn't exist)
- Each node is visited exactly once
- The early return when we find the target helps in average cases, but doesn't change the worst-case complexity

**Space Complexity: O(h)**

- Where `h` is the height of the tree
- This is the space used by the recursion call stack
- Best case (balanced tree): O(log n)
- Worst case (skewed tree): O(n)
- For BFS implementation (not shown), space would be O(w) where w is the maximum width of the tree

## Common Mistakes

1. **Comparing node values instead of references**: This is the most common mistake. Candidates often write `if (original.val == target.val)` instead of `if (original == target)`. With duplicate values in the tree, this returns the wrong node. Always compare node references, not values.

2. **Not traversing both trees simultaneously**: Some candidates traverse the original tree to find the target, record the path, then traverse the cloned tree following that path. While this works, it's less efficient and more complex than simultaneous traversal.

3. **Forgetting the early return optimization**: After finding the target in the left subtree, you should return immediately. Otherwise, you'll unnecessarily search the right subtree. The code should be: `if (leftResult) return leftResult`.

4. **Not handling null nodes properly**: Always check for `null` at the beginning of the recursive function. If `original` is `null`, return `null` immediately. This handles empty trees and prevents null pointer exceptions.

## When You'll See This Pattern

The "simultaneous traversal" pattern appears in several tree problems:

1. **Same Tree (LeetCode 100)**: Check if two trees are identical by traversing both simultaneously and comparing nodes at each position.

2. **Symmetric Tree (LeetCode 101)**: Check if a tree is symmetric by traversing left and right subtrees simultaneously in mirrored order.

3. **Subtree of Another Tree (LeetCode 572)**: Check if one tree is a subtree of another by comparing trees at each node using simultaneous traversal.

4. **Merge Two Binary Trees (LeetCode 617)**: Merge two trees by traversing both simultaneously and creating new nodes based on both inputs.

The core idea is always the same: when you need to compare or relate nodes in two trees positionally, traverse both trees in sync, following the same path.

## Key Takeaways

1. **Simultaneous traversal solves positional matching**: When you need to find corresponding nodes in two identical structures, traverse both at the same time following the same path. This guarantees you'll find the correct positional match.

2. **Compare references, not values**: In tree problems where nodes might have duplicate values, always compare node references (`node1 == node2`) rather than values (`node1.val == node2.val`) when looking for a specific node instance.

3. **DFS with early return is optimal**: For tree search problems where you're looking for a specific node, DFS with immediate return when found is often the cleanest solution. The recursion naturally handles the tree structure and early termination.

[Practice this problem on CodeJeet](/problem/find-a-corresponding-node-of-a-binary-tree-in-a-clone-of-that-tree)
