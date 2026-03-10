---
title: "How to Solve Increasing Order Search Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Increasing Order Search Tree. Easy difficulty, 78.9% acceptance rate. Topics: Stack, Tree, Depth-First Search, Binary Search Tree, Binary Tree."
date: "2027-10-31"
category: "dsa-patterns"
tags: ["increasing-order-search-tree", "stack", "tree", "depth-first-search", "easy"]
---

# How to Solve Increasing Order Search Tree

You're given a binary search tree (BST), and you need to rearrange it so that all nodes appear in increasing order, with each node having no left child and only a right child pointing to the next larger node. What makes this problem interesting is that you're essentially flattening a BST into a sorted linked list while maintaining the BST property, but you're doing it in-place without creating new nodes.

## Visual Walkthrough

Let's trace through a concrete example. Consider this BST:

```
      5
     / \
    3   6
   / \   \
  2   4   8
 /       / \
1       7   9
```

We need to rearrange it so that all nodes appear in increasing order with only right children:

```
1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9
```

Here's what happens step by step:

1. We traverse the tree in-order (left, root, right) because that gives us nodes in increasing order
2. As we visit each node:
   - We disconnect it from its left child
   - We connect it to the previous node's right pointer
   - We update the previous node to be the current node
3. The process starts with the leftmost node (1), which becomes the new root
4. Each subsequent node gets attached to the right of the previous node

The key insight is that in-order traversal naturally visits nodes in sorted order for a BST, so we can build our linked list as we traverse.

## Brute Force Approach

A naive approach would be:

1. Perform an in-order traversal to collect all node values in a list
2. Create a new tree where the first value is the root
3. For each subsequent value, create a new node and attach it to the right of the previous node

While this approach works, it's not optimal because:

- It uses O(n) extra space to store all the values
- It creates new nodes instead of rearranging the existing ones
- The problem doesn't explicitly forbid creating new nodes, but the optimal solution reuses existing nodes

The brute force would look something like this:

```python
def increasingBST_brute(root):
    values = []

    def inorder(node):
        if not node:
            return
        inorder(node.left)
        values.append(node.val)
        inorder(node.right)

    inorder(root)

    # Create new tree
    new_root = TreeNode(values[0])
    current = new_root
    for val in values[1:]:
        current.right = TreeNode(val)
        current = current.right

    return new_root
```

This uses O(n) extra space for the values list and O(n) extra space for the new nodes (if we consider the output as extra space).

## Optimal Solution

The optimal solution uses an in-order traversal with a "dummy" node to help us build the linked list. We traverse the tree in-order, and as we visit each node, we:

1. Disconnect it from its left child (set left to None)
2. Attach it to the right of the previous node
3. Update the previous node to be the current node

We use a dummy node at the beginning to simplify handling the first real node.

<div class="code-group">

```python
# Time: O(n) where n is the number of nodes in the tree
# Space: O(h) where h is the height of the tree (recursion stack)
#         O(n) in worst case (skewed tree), O(log n) in balanced tree

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def increasingBST(self, root: TreeNode) -> TreeNode:
        # Create a dummy node that will help us build the new tree
        # The dummy's right child will eventually point to the new root
        dummy = TreeNode(-1)
        # 'prev' will always point to the last node in our new linked list
        self.prev = dummy

        def inorder(node):
            if not node:
                return

            # Step 1: Traverse left subtree
            inorder(node.left)

            # Step 2: Process current node
            # Disconnect left child since we're building a right-only tree
            node.left = None
            # Attach current node to the right of previous node
            self.prev.right = node
            # Move prev pointer to current node
            self.prev = node

            # Step 3: Traverse right subtree
            inorder(node.right)

        # Start the in-order traversal from the original root
        inorder(root)

        # The dummy node's right child points to the first node (smallest value)
        return dummy.right
```

```javascript
// Time: O(n) where n is the number of nodes in the tree
// Space: O(h) where h is the height of the tree (recursion stack)
//         O(n) in worst case (skewed tree), O(log n) in balanced tree

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class Solution {
  increasingBST(root) {
    // Create a dummy node that will help us build the new tree
    // The dummy's right child will eventually point to the new root
    const dummy = new TreeNode(-1);
    // 'prev' will always point to the last node in our new linked list
    let prev = dummy;

    const inorder = (node) => {
      if (!node) return;

      // Step 1: Traverse left subtree
      inorder(node.left);

      // Step 2: Process current node
      // Disconnect left child since we're building a right-only tree
      node.left = null;
      // Attach current node to the right of previous node
      prev.right = node;
      // Move prev pointer to current node
      prev = node;

      // Step 3: Traverse right subtree
      inorder(node.right);
    };

    // Start the in-order traversal from the original root
    inorder(root);

    // The dummy node's right child points to the first node (smallest value)
    return dummy.right;
  }
}
```

```java
// Time: O(n) where n is the number of nodes in the tree
// Space: O(h) where h is the height of the tree (recursion stack)
//         O(n) in worst case (skewed tree), O(log n) in balanced tree

class TreeNode {
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

class Solution {
    // Use a class-level variable to track the previous node
    private TreeNode prev;

    public TreeNode increasingBST(TreeNode root) {
        // Create a dummy node that will help us build the new tree
        // The dummy's right child will eventually point to the new root
        TreeNode dummy = new TreeNode(-1);
        // 'prev' will always point to the last node in our new linked list
        prev = dummy;

        // Start the in-order traversal from the original root
        inorder(root);

        // The dummy node's right child points to the first node (smallest value)
        return dummy.right;
    }

    private void inorder(TreeNode node) {
        if (node == null) return;

        // Step 1: Traverse left subtree
        inorder(node.left);

        // Step 2: Process current node
        // Disconnect left child since we're building a right-only tree
        node.left = null;
        // Attach current node to the right of previous node
        prev.right = node;
        // Move prev pointer to current node
        prev = node;

        // Step 3: Traverse right subtree
        inorder(node.right);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once during the in-order traversal
- Each node is processed in constant time (disconnecting left child, attaching to previous node)
- Total time is proportional to the number of nodes in the tree

**Space Complexity: O(h)** where h is the height of the tree

- This is the space used by the recursion call stack
- In the worst case (a completely skewed tree), h = n, so O(n)
- In the best case (a balanced tree), h = log n, so O(log n)
- Note: Some might argue this is O(n) worst case, which is correct, but O(h) is more precise

## Common Mistakes

1. **Forgetting to disconnect the left child**: After attaching a node to the new linked list, you must set `node.left = null`. Otherwise, you'll have cycles or incorrect tree structure.

2. **Not using a dummy node**: Trying to handle the first node separately adds complexity. The dummy node pattern simplifies the code by providing a consistent starting point.

3. **Losing the right child during traversal**: When you modify `node.right` to attach it to the previous node, you might lose the original right subtree. That's why we traverse the right subtree BEFORE modifying the node's right pointer in some implementations. In our solution, we're careful to traverse the right subtree after processing the current node.

4. **Not handling empty tree**: Always check if the root is null at the beginning. While the problem constraints might guarantee a non-empty tree, it's good practice to handle edge cases.

## When You'll See This Pattern

This problem combines several important patterns:

1. **In-order traversal of BST**: Whenever you need to process BST nodes in sorted order, use in-order traversal. Related problems:
   - [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) - Uses in-order traversal to check if values are sorted
   - [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) - Uses in-order traversal to find the kth smallest element

2. **Tree to linked list conversion**: Flattening trees into linked lists is a common pattern. Related problems:
   - [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list/) - Similar concept but for general binary trees (pre-order instead of in-order)
   - [Convert Binary Search Tree to Sorted Doubly Linked List](https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list/) - Very similar to this problem but creates a circular doubly linked list

3. **Dummy node pattern**: Using a dummy node simplifies linked list manipulation by eliminating special cases for the head. This pattern appears in many linked list problems.

## Key Takeaways

1. **In-order traversal visits BST nodes in sorted order**: This is a fundamental property of binary search trees that you should have at your fingertips.

2. **The dummy node pattern simplifies edge cases**: When building linked lists, starting with a dummy node helps avoid special handling for the first node.

3. **You can modify tree structure during traversal**: You don't always need to collect data first and process it later. Sometimes you can transform the structure as you traverse, which can save space.

4. **Pay attention to pointer manipulation order**: When modifying pointers during traversal, be careful not to lose access to subtrees you still need to process.

[Practice this problem on CodeJeet](/problem/increasing-order-search-tree)
