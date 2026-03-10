---
title: "How to Solve Construct Binary Search Tree from Preorder Traversal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Construct Binary Search Tree from Preorder Traversal. Medium difficulty, 84.1% acceptance rate. Topics: Array, Stack, Tree, Binary Search Tree, Monotonic Stack."
date: "2027-04-19"
category: "dsa-patterns"
tags: ["construct-binary-search-tree-from-preorder-traversal", "array", "stack", "tree", "medium"]
---

# How to Solve Construct Binary Search Tree from Preorder Traversal

Given an array representing the preorder traversal of a binary search tree (BST), we need to reconstruct the original BST. The challenge is that preorder traversal alone doesn't uniquely define a tree structure, but the BST property (left < root < right) gives us enough constraints to uniquely reconstruct it. This problem tests your understanding of both BST properties and tree construction algorithms.

## Visual Walkthrough

Let's trace through the example `preorder = [8,5,1,7,10,12]`:

**Step 1:** The first element `8` is always the root (preorder: root → left → right).

**Step 2:** Next element `5` is less than `8`, so it goes to the left subtree.

**Step 3:** Next element `1` is less than `8` and less than `5`, so it goes to the left of `5`.

**Step 4:** Next element `7` is less than `8` but greater than `5`, so it goes to the right of `5`.

**Step 5:** Next element `10` is greater than `8`, so it goes to the right subtree.

**Step 6:** Next element `12` is greater than `8` and greater than `10`, so it goes to the right of `10`.

The resulting BST:

```
        8
       / \
      5   10
     / \    \
    1   7    12
```

The key insight: In preorder traversal, after the root, all elements less than the root form the left subtree, and all elements greater than the root form the right subtree. This recursive property allows us to reconstruct the tree.

## Brute Force Approach

A naive approach would be to take the first element as root, then scan the array to find the first element greater than the root (which marks the start of the right subtree). Everything between the root and this point becomes the left subtree, and everything after becomes the right subtree. We then recursively apply this to both subtrees.

**Why it's inefficient:** For each node, we scan potentially O(n) elements to find the split point between left and right subtrees. In the worst case (skewed tree), this leads to O(n²) time complexity. While this would work for small inputs, it's not optimal.

## Optimized Approach

The key optimization is to use the BST property more efficiently. We can use a **recursive approach with bounds** or a **stack-based iterative approach**. Both achieve O(n) time complexity.

**Recursive with bounds approach:** We maintain an index pointer that moves through the preorder array. For each node, we check if the current value falls within valid bounds (lower and upper limits). If it does, we create a node and recursively process left and right subtrees with updated bounds.

**Stack-based approach:** We use a monotonic stack to maintain nodes in decreasing order (as we go deeper in the left subtree). When we encounter a value greater than the stack's top, we pop nodes until we find the correct parent for the current value.

Both approaches are O(n) time and O(n) space. The recursive approach is more intuitive for those familiar with BST properties, while the stack approach is elegant and avoids recursion overhead.

## Optimal Solution

Here's the recursive solution with bounds checking, which is clean and demonstrates the BST property well:

<div class="code-group">

```python
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Time: O(n) - We process each element exactly once
# Space: O(n) - Recursion stack in worst case (skewed tree)
class Solution:
    def bstFromPreorder(self, preorder: List[int]) -> Optional[TreeNode]:
        # Initialize index to track our position in preorder array
        self.idx = 0

        # Helper function that builds tree within given bounds
        def build_tree(lower_bound, upper_bound):
            # Base case: if we've processed all elements or current value is out of bounds
            if self.idx >= len(preorder):
                return None

            current_val = preorder[self.idx]

            # If current value doesn't belong in this subtree (violates BST property)
            if current_val < lower_bound or current_val > upper_bound:
                return None

            # Create node for current value and move to next element
            node = TreeNode(current_val)
            self.idx += 1

            # Recursively build left subtree with updated bounds
            # Left subtree values must be less than current node value
            node.left = build_tree(lower_bound, current_val)

            # Recursively build right subtree with updated bounds
            # Right subtree values must be greater than current node value
            node.right = build_tree(current_val, upper_bound)

            return node

        # Start building tree with full integer range as bounds
        return build_tree(float('-inf'), float('inf'))
```

```javascript
// Definition for a binary tree node.
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

// Time: O(n) - We process each element exactly once
// Space: O(n) - Recursion stack in worst case (skewed tree)
var bstFromPreorder = function (preorder) {
  let idx = 0; // Track position in preorder array

  // Helper function to build tree within bounds
  const buildTree = (lower, upper) => {
    // Base case: processed all elements or value out of bounds
    if (idx >= preorder.length) return null;

    const currentVal = preorder[idx];

    // If current value violates BST property for this position
    if (currentVal < lower || currentVal > upper) return null;

    // Create node and move to next element
    const node = new TreeNode(currentVal);
    idx++;

    // Build left subtree: values must be less than current node
    node.left = buildTree(lower, currentVal);

    // Build right subtree: values must be greater than current node
    node.right = buildTree(currentVal, upper);

    return node;
  };

  // Start with full range as bounds
  return buildTree(-Infinity, Infinity);
};
```

```java
// Definition for a binary tree node.
public class TreeNode {
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

// Time: O(n) - We process each element exactly once
// Space: O(n) - Recursion stack in worst case (skewed tree)
class Solution {
    private int idx = 0;  // Track position in preorder array
    private int[] preorder;

    public TreeNode bstFromPreorder(int[] preorder) {
        this.preorder = preorder;
        // Start building tree with full integer range as bounds
        return buildTree(Integer.MIN_VALUE, Integer.MAX_VALUE);
    }

    private TreeNode buildTree(int lower, int upper) {
        // Base case: processed all elements or value out of bounds
        if (idx >= preorder.length) return null;

        int currentVal = preorder[idx];

        // If current value violates BST property for this position
        if (currentVal < lower || currentVal > upper) return null;

        // Create node and move to next element
        TreeNode node = new TreeNode(currentVal);
        idx++;

        // Build left subtree: values must be less than current node
        node.left = buildTree(lower, currentVal);

        // Build right subtree: values must be greater than current node
        node.right = buildTree(currentVal, upper);

        return node;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** - Each element in the preorder array is processed exactly once. The recursive function is called for each node, and each node is created only when its value is within the valid bounds.

**Space Complexity: O(n)** - In the worst case (a completely skewed tree), the recursion stack will have n frames. In the average case (balanced tree), it's O(log n). The output tree itself requires O(n) space to store all nodes, but this is typically not counted in space complexity analysis unless specified.

## Common Mistakes

1. **Forgetting to update the index/pointer correctly**: In the recursive solution, it's crucial to use a shared index variable (or pass it by reference) rather than creating copies. If you pass the index by value, you'll process the same elements multiple times.

2. **Incorrect bound checking**: The bounds must be exclusive. When building the left subtree, the upper bound should be the parent's value (not parent's value - 1). Similarly, for the right subtree, the lower bound should be the parent's value.

3. **Assuming the array represents a balanced BST**: The problem doesn't guarantee a balanced tree. Your solution must handle skewed trees (all left children or all right children) efficiently.

4. **Not handling duplicate values**: While the problem statement doesn't explicitly mention duplicates, BSTs typically don't allow duplicate values. If duplicates were allowed, you'd need to decide whether to put them in left or right subtree (usually left ≤ root < right or left < root ≤ right).

## When You'll See This Pattern

This pattern of reconstructing trees from traversal sequences appears in several variations:

1. **Construct Binary Tree from Preorder and Inorder Traversal (LeetCode 105)** - Similar concept but uses two arrays instead of one. The preorder gives you roots, and the inorder helps determine left/right splits.

2. **Validate Binary Search Tree (LeetCode 98)** - Uses the same bounds-checking technique to ensure all nodes satisfy BST properties.

3. **Serialize and Deserialize BST (LeetCode 449)** - Often uses preorder traversal for serialization, and the deserialization is essentially this problem.

The core technique of using bounds to validate node placement in BSTs is widely applicable to any problem involving BST construction or validation.

## Key Takeaways

1. **Preorder traversal's first element is always the root** - This is the starting point for any tree reconstruction from preorder.

2. **BST property enables efficient reconstruction** - The property that left < root < right allows us to determine subtree boundaries without needing additional traversal information.

3. **Bounds checking is powerful** - Maintaining lower and upper bounds while traversing is an elegant way to ensure BST properties are satisfied during construction.

[Practice this problem on CodeJeet](/problem/construct-binary-search-tree-from-preorder-traversal)
