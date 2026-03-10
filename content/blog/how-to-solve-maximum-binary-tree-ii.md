---
title: "How to Solve Maximum Binary Tree II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Binary Tree II. Medium difficulty, 70.3% acceptance rate. Topics: Tree, Binary Tree."
date: "2028-09-15"
category: "dsa-patterns"
tags: ["maximum-binary-tree-ii", "tree", "binary-tree", "medium"]
---

# How to Solve Maximum Binary Tree II

This problem asks us to insert a new value into an existing maximum binary tree while maintaining the maximum tree property. The tricky part is that we can't just rebuild the entire tree from scratch — we need to insert efficiently by understanding how maximum trees are constructed and how the new value affects the existing structure.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have this maximum tree:

```
       6
      / \
     3   5
    /   /
   2   0
```

And we want to insert `val = 4`.

**Step 1:** Start at the root (6). Since 4 < 6, we need to go to the right subtree (because in the original construction, smaller values go to the right of larger values).

**Step 2:** At node 5, 4 < 5, so we go to the right subtree again.

**Step 3:** At node 0, 4 > 0. This is our insertion point! In the original maximum tree construction, when we encounter a value smaller than our new value, the new value becomes the parent and the smaller value becomes the left child.

**Step 4:** Create a new node with value 4, make the current node (0) its left child, and return this new node to be attached as the right child of node 5.

Final result:

```
       6
      / \
     3   5
    /   /
   2   4
      /
     0
```

The key insight: we traverse right until we find a node smaller than `val`, then `val` becomes the new parent with the smaller node as its left child.

## Brute Force Approach

A naive approach would be to:

1. Perform an inorder traversal to extract all values from the tree
2. Append the new value to the list
3. Rebuild the entire maximum tree from scratch using the algorithm from the original problem

This approach has several problems:

- It's inefficient: O(n) time to traverse, O(n) space to store values, and O(n²) worst-case to rebuild
- It doesn't leverage the fact that we already have a valid maximum tree
- It ignores the structural properties we can use for efficient insertion

While this would technically work, it's not what interviewers are looking for — they want to see you understand the tree's structure and can insert efficiently.

## Optimized Approach

The key insight comes from understanding how maximum trees are constructed in the original problem:

1. The root is always the maximum value in the array
2. The left subtree is built from elements to the left of the maximum
3. The right subtree is built from elements to the right of the maximum

When inserting a new value:

- If `val` is greater than the root, it becomes the new root with the old tree as its left child
- Otherwise, we traverse down the right spine (always going right) until we find a node smaller than `val`
- When we find such a node, `val` becomes the new parent, and the smaller node becomes `val`'s left child

Why always go right? Because in the original construction, values to the right of the maximum become the right subtree. Since we're adding to the end (conceptually appending to the array), we're always dealing with the rightmost part of the tree.

## Optimal Solution

Here's the efficient recursive solution that leverages the maximum tree properties:

<div class="code-group">

```python
# Time: O(h) where h is the height of the tree, O(n) worst case for skewed tree
# Space: O(h) for recursion stack, O(n) worst case
class Solution:
    def insertIntoMaxTree(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:
        """
        Insert a new value into a maximum binary tree while maintaining
        the maximum tree property.

        Args:
            root: Root of the existing maximum tree
            val: Value to insert

        Returns:
            Root of the new maximum tree
        """
        # Base case: if we've reached a null node, create a new node with val
        # This happens when val is the smallest value encountered so far
        if not root:
            return TreeNode(val)

        # If val is greater than the current root, it should become the new root
        # The entire existing tree becomes the left child of the new node
        # This follows the maximum tree construction rule
        if val > root.val:
            new_node = TreeNode(val)
            new_node.left = root
            return new_node

        # Otherwise, val is smaller than the current root
        # We need to insert it into the right subtree
        # This is because in the original construction, smaller values
        # to the right of a maximum become the right subtree
        root.right = self.insertIntoMaxTree(root.right, val)

        # Return the root (unchanged at this level)
        return root
```

```javascript
// Time: O(h) where h is the height of the tree, O(n) worst case for skewed tree
// Space: O(h) for recursion stack, O(n) worst case
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} val
 * @return {TreeNode}
 */
var insertIntoMaxTree = function (root, val) {
  // Base case: if we've reached a null node, create a new node with val
  // This happens when val is the smallest value encountered so far
  if (!root) {
    return new TreeNode(val);
  }

  // If val is greater than the current root, it should become the new root
  // The entire existing tree becomes the left child of the new node
  // This follows the maximum tree construction rule
  if (val > root.val) {
    const newNode = new TreeNode(val);
    newNode.left = root;
    return newNode;
  }

  // Otherwise, val is smaller than the current root
  // We need to insert it into the right subtree
  // This is because in the original construction, smaller values
  // to the right of a maximum become the right subtree
  root.right = insertIntoMaxTree(root.right, val);

  // Return the root (unchanged at this level)
  return root;
};
```

```java
// Time: O(h) where h is the height of the tree, O(n) worst case for skewed tree
// Space: O(h) for recursion stack, O(n) worst case
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public TreeNode insertIntoMaxTree(TreeNode root, int val) {
        // Base case: if we've reached a null node, create a new node with val
        // This happens when val is the smallest value encountered so far
        if (root == null) {
            return new TreeNode(val);
        }

        // If val is greater than the current root, it should become the new root
        // The entire existing tree becomes the left child of the new node
        // This follows the maximum tree construction rule
        if (val > root.val) {
            TreeNode newNode = new TreeNode(val);
            newNode.left = root;
            return newNode;
        }

        // Otherwise, val is smaller than the current root
        // We need to insert it into the right subtree
        // This is because in the original construction, smaller values
        // to the right of a maximum become the right subtree
        root.right = insertIntoMaxTree(root.right, val);

        // Return the root (unchanged at this level)
        return root;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(h) where h is the height of the tree

- In the best case (balanced tree): O(log n)
- In the worst case (right-skewed tree): O(n)
- We traverse down the right spine of the tree until we find the insertion point

**Space Complexity:** O(h) for the recursion stack

- Same as time complexity: O(log n) for balanced trees, O(n) for skewed trees
- This could be optimized to O(1) using an iterative approach, but the recursive solution is more intuitive

## Common Mistakes

1. **Traversing the wrong direction:** Some candidates try to go left when the value is smaller, but we must always go right because we're conceptually appending to the end of the original array.

2. **Forgetting to handle the case when val > root:** This is crucial! When the new value is larger than the current root, it becomes the new root with the entire existing tree as its left child.

3. **Not understanding the base case:** The base case isn't just when we reach a leaf — it's when we reach a null node. This handles the case where val is smaller than all nodes on the right spine.

4. **Trying to rebuild the entire tree:** While this works, it's inefficient and misses the point of the problem. Interviewers want to see you leverage the existing structure.

## When You'll See This Pattern

This problem teaches the pattern of **right-spine traversal in binary trees**, which appears in several contexts:

1. **Binary Search Tree insertion** (LeetCode 701): Similar rightward traversal when inserting larger values, though the logic differs because BSTs have different ordering properties.

2. **Flatten Binary Tree to Linked List** (LeetCode 114): Also involves right-spine manipulation to transform a tree into a right-skewed structure.

3. **Convert BST to Greater Tree** (LeetCode 538): Uses reverse inorder traversal (right-root-left) to accumulate sums, which is another form of right-first traversal.

The common thread is understanding how to manipulate tree structure by following specific traversal patterns based on the problem's constraints.

## Key Takeaways

1. **Maximum trees have predictable structure:** The maximum value is always at the root, with left and right subtrees built from elements to the left and right of the maximum in the original array.

2. **Insertion follows the construction rules:** When inserting a new value at the "end" (right side), we traverse right until we find a smaller value, then make the new value the parent.

3. **Recursive tree manipulation is often cleaner:** While iterative solutions exist, recursive approaches naturally express the "go right, then insert" logic and are easier to reason about during interviews.

Related problems: [Maximum Binary Tree](/problem/maximum-binary-tree)
