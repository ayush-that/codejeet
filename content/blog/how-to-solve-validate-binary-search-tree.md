---
title: "How to Solve Validate Binary Search Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Validate Binary Search Tree. Medium difficulty, 35.4% acceptance rate. Topics: Tree, Depth-First Search, Binary Search Tree, Binary Tree."
date: "2026-03-24"
category: "dsa-patterns"
tags: ["validate-binary-search-tree", "tree", "depth-first-search", "binary-search-tree", "medium"]
---

# How to Solve Validate Binary Search Tree

This problem asks us to verify whether a given binary tree satisfies the properties of a Binary Search Tree (BST). The tricky part is that a valid BST requires **all** nodes in the left subtree to be less than the current node's value, and **all** nodes in the right subtree to be greater — not just the immediate children. This global constraint means we can't simply check each node against its direct children; we need to track valid value ranges as we traverse the tree.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this tree:

```
    5
   / \
  3   7
 / \   \
1   4   8
```

A valid BST requires:

- All left subtree nodes < current node
- All right subtree nodes > current node

**Step-by-step validation:**

1. **Root (5):** Valid range is (-∞, ∞). 5 is within bounds.
2. **Left child (3):** Must be < 5. New range: (-∞, 5). 3 is within bounds.
3. **Left child of 3 (1):** Must be < 3. New range: (-∞, 3). 1 is within bounds.
4. **Right child of 3 (4):** Must be > 3 but < 5. New range: (3, 5). 4 is within bounds.
5. **Right child of 5 (7):** Must be > 5. New range: (5, ∞). 7 is within bounds.
6. **Right child of 7 (8):** Must be > 7. New range: (7, ∞). 8 is within bounds.

All nodes satisfy their respective ranges, so this is a valid BST.

Now consider an invalid example:

```
    5
   / \
  3   7
 / \   \
1   6   8
```

Here, node 6 violates the BST property. It's in the left subtree of 5 (so must be < 5) but also in the right subtree of 3 (so must be > 3). While 6 > 3, it's not < 5 — it's actually greater than 5! This shows why we need to track both upper and lower bounds.

## Brute Force Approach

A naive approach would be to check for each node whether all nodes in its left subtree are smaller and all nodes in its right subtree are larger. This leads to repeatedly traversing subtrees:

**Algorithm:**

1. For each node, check if all values in its left subtree are < node.val
2. Check if all values in its right subtree are > node.val
3. Recursively apply the same check to left and right children

**Why it's inefficient:**

- For each node, we traverse its entire subtree to find min/max values
- This results in O(n²) time complexity in the worst case (skewed tree)
- We're doing redundant work — traversing the same subtrees multiple times

**What candidates might try:**
Some candidates might only check that each node's value is greater than its left child and less than its right child. This fails for cases like:

```
    5
   / \
  3   7
     / \
    4   8
```

Here, 4 is less than 5 (its grandparent) but in the right subtree where all values should be > 5.

## Optimized Approach

The key insight is that we can validate the BST property by performing a **depth-first traversal** while maintaining the valid range (min, max) for each node's value.

**Step-by-step reasoning:**

1. **Root node:** Can have any value, so initial range is (-∞, ∞)
2. **When moving left:** Update the upper bound to the current node's value (all left descendants must be less than current node)
3. **When moving right:** Update the lower bound to the current node's value (all right descendants must be greater than current node)
4. **At each node:** Check if the node's value is within the current valid range
5. **Recursively** apply the same logic to left and right children with updated ranges

**Why this works:**

- We're effectively performing a single pass through the tree (O(n) time)
- We carry the "context" of what values are valid for each subtree
- The range constraints ensure the BST property holds globally, not just locally

**Alternative approach:** We could also perform an **inorder traversal** of a BST, which should yield values in strictly increasing order. If any value is not greater than the previous value, the tree is invalid.

## Optimal Solution

Here's the complete solution using the range-checking approach:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes (we visit each node once)
# Space: O(h) where h is tree height (recursion stack, O(n) worst case for skewed tree)
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        # Helper function for DFS traversal with range checking
        def validate(node, min_val, max_val):
            # Base case: empty node is valid
            if not node:
                return True

            # Check if current node's value violates BST property
            # Must be strictly greater than min_val and strictly less than max_val
            if node.val <= min_val or node.val >= max_val:
                return False

            # Recursively validate left and right subtrees with updated ranges
            # Left subtree: all values must be < current node's value
            # Right subtree: all values must be > current node's value
            return (validate(node.left, min_val, node.val) and
                    validate(node.right, node.val, max_val))

        # Start with root node and infinite bounds
        # Use float('-inf') and float('inf') to represent no initial bounds
        return validate(root, float('-inf'), float('inf'))
```

```javascript
// Time: O(n) where n is number of nodes (we visit each node once)
// Space: O(h) where h is tree height (recursion stack, O(n) worst case for skewed tree)
function isValidBST(root) {
  // Helper function for DFS traversal with range checking
  function validate(node, minVal, maxVal) {
    // Base case: empty node is valid
    if (node === null) {
      return true;
    }

    // Check if current node's value violates BST property
    // Must be strictly greater than minVal and strictly less than maxVal
    if (node.val <= minVal || node.val >= maxVal) {
      return false;
    }

    // Recursively validate left and right subtrees with updated ranges
    // Left subtree: all values must be < current node's value
    // Right subtree: all values must be > current node's value
    return validate(node.left, minVal, node.val) && validate(node.right, node.val, maxVal);
  }

  // Start with root node and infinite bounds
  // Use -Infinity and Infinity to represent no initial bounds
  return validate(root, -Infinity, Infinity);
}
```

```java
// Time: O(n) where n is number of nodes (we visit each node once)
// Space: O(h) where h is tree height (recursion stack, O(n) worst case for skewed tree)
class Solution {
    public boolean isValidBST(TreeNode root) {
        // Use Long.MIN_VALUE and Long.MAX_VALUE to handle edge cases with Integer bounds
        return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private boolean validate(TreeNode node, long minVal, long maxVal) {
        // Base case: empty node is valid
        if (node == null) {
            return true;
        }

        // Check if current node's value violates BST property
        // Must be strictly greater than minVal and strictly less than maxVal
        if (node.val <= minVal || node.val >= maxVal) {
            return false;
        }

        // Recursively validate left and right subtrees with updated ranges
        // Left subtree: all values must be < current node's value
        // Right subtree: all values must be > current node's value
        return validate(node.left, minVal, node.val) &&
               validate(node.right, node.val, maxVal);
    }
}
```

</div>

**Inorder traversal alternative:**

<div class="code-group">

```python
# Time: O(n) | Space: O(h) for recursion stack
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        self.prev = None

        def inorder(node):
            if not node:
                return True

            # Check left subtree
            if not inorder(node.left):
                return False

            # Check current node (must be > previous in inorder traversal)
            if self.prev is not None and node.val <= self.prev:
                return False
            self.prev = node.val

            # Check right subtree
            return inorder(node.right)

        return inorder(root)
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once in the worst case
- Each node visit involves constant-time operations (value comparisons)
- Even if we find an invalid node early, worst-case is still O(n)

**Space Complexity: O(h)** where h is the height of the tree

- This is the maximum depth of the recursion stack
- Best case (balanced tree): O(log n)
- Worst case (skewed tree): O(n)
- For the iterative version using a stack, space complexity is also O(h)

## Common Mistakes

1. **Only checking immediate children:** The most common mistake is checking only that `node.left.val < node.val` and `node.right.val > node.val`. This misses violations deeper in the subtree. Always remember: ALL nodes in left subtree must be less, ALL nodes in right subtree must be greater.

2. **Using inclusive bounds:** The problem states "strictly less than" and "strictly greater than." Using `<=` or `>=` instead of `<` and `>` will fail for trees with duplicate values. Always use strict inequalities.

3. **Integer overflow in bounds:** When using the initial bounds of `Integer.MIN_VALUE` and `Integer.MAX_VALUE` in Java, a node with value `Integer.MIN_VALUE` or `Integer.MAX_VALUE` could cause issues. Use `Long.MIN_VALUE` and `Long.MAX_VALUE` or `null` to represent unbounded ranges.

4. **Forgetting to update both bounds:** When moving to the left child, you must update only the upper bound; when moving to the right child, update only the lower bound. Some candidates mistakenly update both bounds.

## When You'll See This Pattern

The "carry context during traversal" pattern appears in many tree problems:

1. **Binary Tree Maximum Path Sum (Hard):** Similar to carrying range bounds, here we carry path sums upward while tracking the global maximum.

2. **Lowest Common Ancestor of a Binary Search Tree (Easy):** Use BST properties to navigate — if both nodes are on one side of current node, move in that direction; otherwise current node is LCA.

3. **Recover Binary Search Tree (Medium):** Uses inorder traversal to detect swapped nodes, similar to the inorder validation approach.

4. **Trim a Binary Search Tree (Medium):** Recursively trim based on value ranges, very similar to the range-checking logic here.

## Key Takeaways

1. **BST validation requires global constraints:** You can't validate locally (parent-child only). You must track what values are valid for entire subtrees using min/max bounds.

2. **DFS with carried context is powerful:** Many tree problems become simpler when you pass additional information (like value ranges) down the recursion stack rather than trying to compute everything on the way up.

3. **Inorder traversal of BST yields sorted order:** This property is useful not just for validation but for many BST problems where you need to process nodes in sorted order.

**Related problems:** [Binary Tree Inorder Traversal](/problem/binary-tree-inorder-traversal), [Find Mode in Binary Search Tree](/problem/find-mode-in-binary-search-tree)
