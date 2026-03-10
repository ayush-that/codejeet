---
title: "How to Solve Insert into a Binary Search Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Insert into a Binary Search Tree. Medium difficulty, 73.4% acceptance rate. Topics: Tree, Binary Search Tree, Binary Tree."
date: "2026-12-03"
category: "dsa-patterns"
tags: ["insert-into-a-binary-search-tree", "tree", "binary-search-tree", "binary-tree", "medium"]
---

# How to Solve Insert into a Binary Search Tree

You’re given the root of a binary search tree (BST) and a value to insert. You must return the root after inserting the new node. The tricky part is that you must maintain the BST property: for every node, all values in its left subtree are smaller, and all values in its right subtree are larger. The challenge is to find the correct empty spot efficiently while handling edge cases like an empty tree.

## Visual Walkthrough

Let’s walk through an example. Suppose we have this BST:

```
        4
       / \
      2   7
     / \
    1   3
```

We want to insert the value `5`.

**Step 1:** Start at the root (4). Compare 5 with 4. Since 5 > 4, we must go to the right subtree.

**Step 2:** Now at node 7. Compare 5 with 7. Since 5 < 7, we go to the left subtree.

**Step 3:** The left child of 7 is `null`. This is where we insert the new node with value 5.

The tree becomes:

```
        4
       / \
      2   7
     /   /
    1   5
     \
      3
```

Notice that we always traverse down the tree until we find a null pointer where the new value belongs according to the BST ordering rules. This guarantees the BST property is preserved.

## Brute Force Approach

A naive approach might be to ignore the BST structure and treat it like a regular binary tree. You could do a BFS or DFS to find any null child and insert there, but that would break the BST ordering. To maintain the BST property, you’d have to check all nodes to ensure the insertion point is valid, which is inefficient.

Another brute force idea: convert the BST to a sorted array, insert the value in the correct position, then rebuild the BST from the array. This would take O(n) time and O(n) space, which is unnecessary when we can insert directly in O(h) time (where h is the tree height).

The key insight is that a BST’s structure gives us a search path: at each node, we compare the value and go left or right, eliminating half the tree (in a balanced BST) from consideration.

## Optimized Approach

The optimal approach leverages the BST property directly:

1. **Traverse from the root** down to a leaf.
2. **At each node**, compare the new value with the node’s value:
   - If the new value is **greater**, go to the right child.
   - If the new value is **smaller**, go to the left child.
3. **When you reach a null pointer**, that’s the insertion point. Create a new node there.
4. **Return the root** (unchanged unless the tree was empty).

We can implement this either **iteratively** (with a while loop) or **recursively**. Both are O(h) time, where h is the tree height. The recursive solution is elegant but uses O(h) call stack space. The iterative solution uses O(1) extra space.

The guarantee that the new value doesn’t already exist simplifies things—we don’t need to handle duplicates.

## Optimal Solution

Here’s the complete solution in three languages. Both iterative and recursive approaches are shown.

<div class="code-group">

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    # Iterative solution
    # Time: O(h) where h is the height of the tree. O(log n) if balanced, O(n) if skewed.
    # Space: O(1) extra space.
    def insertIntoBST(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:
        # Edge case: if tree is empty, new node becomes the root
        if not root:
            return TreeNode(val)

        # Start traversal from the root
        current = root
        while current:
            # If val is greater than current node's value, go right
            if val > current.val:
                # If right child is null, insert here
                if not current.right:
                    current.right = TreeNode(val)
                    break
                # Otherwise, move to right child
                current = current.right
            else:
                # Val is smaller than current node's value, go left
                if not current.left:
                    current.left = TreeNode(val)
                    break
                # Otherwise, move to left child
                current = current.left

        return root

    # Recursive solution (alternative)
    # Time: O(h) | Space: O(h) for the recursion call stack
    def insertIntoBSTRecursive(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:
        # Base case: found insertion point
        if not root:
            return TreeNode(val)

        # Recursive cases: traverse left or right
        if val > root.val:
            # Insert into right subtree and update right pointer
            root.right = self.insertIntoBSTRecursive(root.right, val)
        else:
            # Insert into left subtree and update left pointer
            root.left = self.insertIntoBSTRecursive(root.left, val)

        return root
```

```javascript
// Definition for a binary tree node.
// function TreeNode(val, left, right) {
//     this.val = (val===undefined ? 0 : val)
//     this.left = (left===undefined ? null : left)
//     this.right = (right===undefined ? null : right)
// }

/**
 * @param {TreeNode} root
 * @param {number} val
 * @return {TreeNode}
 */

// Iterative solution
// Time: O(h) where h is the height of the tree. O(log n) if balanced, O(n) if skewed.
// Space: O(1) extra space.
var insertIntoBST = function (root, val) {
  // Edge case: empty tree
  if (!root) {
    return new TreeNode(val);
  }

  let current = root;
  while (current) {
    // If val is greater, go to the right subtree
    if (val > current.val) {
      // If right child is null, insert here
      if (!current.right) {
        current.right = new TreeNode(val);
        break;
      }
      current = current.right;
    } else {
      // Val is smaller, go to the left subtree
      if (!current.left) {
        current.left = new TreeNode(val);
        break;
      }
      current = current.left;
    }
  }

  return root;
};

// Recursive solution (alternative)
// Time: O(h) | Space: O(h) for the call stack
var insertIntoBSTRecursive = function (root, val) {
  // Base case: found where to insert
  if (!root) {
    return new TreeNode(val);
  }

  // Recursively traverse left or right
  if (val > root.val) {
    root.right = insertIntoBSTRecursive(root.right, val);
  } else {
    root.left = insertIntoBSTRecursive(root.left, val);
  }

  return root;
};
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
    // Iterative solution
    // Time: O(h) where h is the height of the tree. O(log n) if balanced, O(n) if skewed.
    // Space: O(1) extra space.
    public TreeNode insertIntoBST(TreeNode root, int val) {
        // Handle empty tree case
        if (root == null) {
            return new TreeNode(val);
        }

        TreeNode current = root;
        while (current != null) {
            // If val is greater, go right
            if (val > current.val) {
                // If right child is null, insert here
                if (current.right == null) {
                    current.right = new TreeNode(val);
                    break;
                }
                current = current.right;
            } else {
                // Val is smaller, go left
                if (current.left == null) {
                    current.left = new TreeNode(val);
                    break;
                }
                current = current.left;
            }
        }

        return root;
    }

    // Recursive solution (alternative)
    // Time: O(h) | Space: O(h) for recursion stack
    public TreeNode insertIntoBSTRecursive(TreeNode root, int val) {
        // Base case: found insertion point
        if (root == null) {
            return new TreeNode(val);
        }

        // Recursively traverse to the correct subtree
        if (val > root.val) {
            root.right = insertIntoBSTRecursive(root.right, val);
        } else {
            root.left = insertIntoBSTRecursive(root.left, val);
        }

        return root;
    }
}
```

</div>

## Complexity Analysis

- **Time complexity:** O(h), where h is the height of the tree.
  - In a balanced BST, h = O(log n), so insertion is logarithmic.
  - In the worst case (a skewed tree), h = O(n), making insertion linear.
  - We traverse exactly one path from root to a leaf.

- **Space complexity:**
  - **Iterative solution:** O(1) extra space (just a few pointers).
  - **Recursive solution:** O(h) for the call stack (could be O(n) in worst case).

## Common Mistakes

1. **Forgetting the empty tree case:** If the root is null, you must return a new node as the root. Many candidates start traversing without this check and get a null pointer error.

2. **Losing the parent reference:** In the iterative approach, you need to keep track of the current node and check its left/right child for null. A common mistake is to advance `current` to `current.right` without checking if it’s null first, then you’ve lost the parent and can’t attach the new node.

3. **Breaking the BST property by inserting in the wrong order:** Always compare the new value with the current node to decide left or right. Swapping the comparison (going left when you should go right) will break the BST ordering.

4. **Not handling the “already exists” case even though it’s guaranteed:** The problem says the value doesn’t exist, but in a real interview, you might be asked to handle duplicates. Typically, you’d decide a policy (e.g., insert in left subtree for duplicates) and state it.

## When You’ll See This Pattern

This “BST traversal with comparison” pattern appears whenever you need to search, insert, delete, or find boundaries in a BST:

- **Search in a Binary Search Tree (LeetCode 700):** Almost identical traversal logic, but you return the subtree rooted at the target value instead of inserting.
- **Delete Node in a BST (LeetCode 450):** Uses the same traversal to find the node, but deletion requires handling three cases (no child, one child, two children).
- **Validate Binary Search Tree (LeetCode 98):** Traverse while tracking allowable value ranges to ensure BST property holds everywhere.

These problems all rely on the fundamental BST property: left < root < right, which allows efficient divide-and-conquer traversal.

## Key Takeaways

1. **BST insertion is a one-path traversal:** You don’t need to explore the entire tree—just follow the comparison rules from root to leaf. This gives O(h) time.

2. **Iterative vs. recursive trade-offs:** Iterative uses less space; recursive is simpler to write. Know both for interviews.

3. **Edge cases matter:** Empty tree, single node, and skewed trees are common test cases. Always check for null roots and null children during traversal.

Related problems: [Search in a Binary Search Tree](/problem/search-in-a-binary-search-tree)
