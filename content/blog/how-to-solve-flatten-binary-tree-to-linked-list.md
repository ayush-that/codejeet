---
title: "How to Solve Flatten Binary Tree to Linked List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Flatten Binary Tree to Linked List. Medium difficulty, 70.2% acceptance rate. Topics: Linked List, Stack, Tree, Depth-First Search, Binary Tree."
date: "2026-07-31"
category: "dsa-patterns"
tags: ["flatten-binary-tree-to-linked-list", "linked-list", "stack", "tree", "medium"]
---

# How to Solve Flatten Binary Tree to Linked List

This problem asks us to transform a binary tree into a right-skewed linked list in place, where the linked list follows the same order as a preorder traversal of the original tree. The tricky part is that we must modify the tree structure completely while preserving the correct node order — we can't just create a new list. This requires careful pointer manipulation to avoid losing track of subtrees.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this binary tree:

```
      1
     / \
    2   5
   / \   \
  3   4   6
```

We want to flatten it to: `1 → 2 → 3 → 4 → 5 → 6 → null`

**Step-by-step transformation:**

1. **Start at root (1):** In preorder, we process root, then left subtree, then right subtree.
2. **Process left subtree (2):** The entire left subtree (2, 3, 4) needs to be inserted between 1 and 5.
3. **Find the rightmost node of left subtree:** That's node 4. We'll attach node 5 (the original right child of 1) to the right of node 4.
4. **Move left subtree to right:** Set node 1's right pointer to node 2 (its left child), and set node 1's left pointer to null.
5. **Repeat process at node 2:** Now node 2 has left child 3 and right child 4. We need to insert the left subtree (3) between 2 and 4.
6. **Continue recursively:** This pattern continues until the entire tree becomes a right-skewed chain.

The key insight: For each node, we need to:

1. Take its left subtree
2. Find the rightmost node of that left subtree
3. Attach the node's original right subtree to that rightmost node
4. Move the left subtree to the right side
5. Set left pointer to null

## Brute Force Approach

A naive approach would be to perform a preorder traversal, store all nodes in a list, then rebuild the tree as a linked list:

1. Perform preorder traversal, collecting nodes in order
2. Iterate through the list, setting each node's left to null and right to the next node

While this approach is conceptually simple and correct, it violates the "in-place" requirement if we interpret it strictly — we're using O(n) extra space for the list. Even if we consider it acceptable, the problem description strongly implies we should modify the tree structure directly without storing all nodes separately.

**Why this isn't optimal:** The O(n) space usage is unnecessary. We can achieve the same result with O(1) extra space (or O(h) for recursive stack) by clever pointer manipulation within the existing tree structure.

## Optimized Approach

The optimal solution uses a modified reverse preorder traversal (right-to-left preorder) or an iterative approach with a stack. The key insight is that we can process nodes in reverse preorder (right, left, root) and maintain a "previous" pointer to build the linked list backwards:

**Reverse preorder approach:**

1. Traverse right subtree first
2. Then traverse left subtree
3. Finally process current node
4. Keep track of the last node processed (which will be the next node in the final list)

**Why this works:** When we process nodes in reverse preorder, the "previous" node is always the next node in the final flattened list. By setting current.right = previous and current.left = null, we build the list from the end to the beginning.

**Alternative iterative approach:** We can also use a stack to simulate the traversal:

1. Push root to stack
2. While stack is not empty:
   - Pop current node
   - Push right child then left child (so left gets processed next)
   - Link current node to next node in stack

Both approaches achieve O(n) time complexity. The reverse preorder uses O(h) recursion stack space, while the iterative approach can use O(n) stack space in worst case (skewed tree).

## Optimal Solution

Here's the complete solution using the reverse preorder traversal approach, which is elegant and efficient:

<div class="code-group">

```python
# Time: O(n) - We visit each node exactly once
# Space: O(h) - Recursion stack where h is tree height (O(n) worst case for skewed tree)
class Solution:
    def flatten(self, root: Optional[TreeNode]) -> None:
        """
        Flatten binary tree to linked list in-place using reverse preorder traversal.
        The key insight: process nodes in order (right, left, root) and maintain
        a 'prev' pointer that points to the last processed node.
        """
        # Initialize prev as None (will point to last node in flattened list)
        self.prev = None

        def reverse_preorder(node):
            """
            Helper function that performs reverse preorder traversal:
            1. Process right subtree first
            2. Then process left subtree
            3. Finally process current node
            """
            if not node:
                return

            # 1. Process right subtree first (go deep right first)
            reverse_preorder(node.right)

            # 2. Process left subtree
            reverse_preorder(node.left)

            # 3. Process current node
            # Set current node's right to prev (the next node in flattened list)
            node.right = self.prev
            # Set current node's left to None (required by problem)
            node.left = None
            # Update prev to current node for next iteration
            self.prev = node

        # Start the reverse preorder traversal from root
        reverse_preorder(root)
```

```javascript
// Time: O(n) - We visit each node exactly once
// Space: O(h) - Recursion stack where h is tree height (O(n) worst case for skewed tree)
/**
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function (root) {
  /**
   * Flatten binary tree to linked list in-place using reverse preorder traversal.
   * The key insight: process nodes in order (right, left, root) and maintain
   * a 'prev' pointer that points to the last processed node.
   */

  let prev = null; // Will point to last node in flattened list

  const reversePreorder = (node) => {
    /**
     * Helper function that performs reverse preorder traversal:
     * 1. Process right subtree first
     * 2. Then process left subtree
     * 3. Finally process current node
     */
    if (!node) return;

    // 1. Process right subtree first (go deep right first)
    reversePreorder(node.right);

    // 2. Process left subtree
    reversePreorder(node.left);

    // 3. Process current node
    // Set current node's right to prev (the next node in flattened list)
    node.right = prev;
    // Set current node's left to null (required by problem)
    node.left = null;
    // Update prev to current node for next iteration
    prev = node;
  };

  // Start the reverse preorder traversal from root
  reversePreorder(root);
};
```

```java
// Time: O(n) - We visit each node exactly once
// Space: O(h) - Recursion stack where h is tree height (O(n) worst case for skewed tree)
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
    // prev will point to last node in flattened list
    private TreeNode prev = null;

    public void flatten(TreeNode root) {
        /**
         * Flatten binary tree to linked list in-place using reverse preorder traversal.
         * The key insight: process nodes in order (right, left, root) and maintain
         * a 'prev' pointer that points to the last processed node.
         */
        reversePreorder(root);
    }

    private void reversePreorder(TreeNode node) {
        /**
         * Helper function that performs reverse preorder traversal:
         * 1. Process right subtree first
         * 2. Then process left subtree
         * 3. Finally process current node
         */
        if (node == null) return;

        // 1. Process right subtree first (go deep right first)
        reversePreorder(node.right);

        // 2. Process left subtree
        reversePreorder(node.left);

        // 3. Process current node
        // Set current node's right to prev (the next node in flattened list)
        node.right = prev;
        // Set current node's left to null (required by problem)
        node.left = null;
        // Update prev to current node for next iteration
        prev = node;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the tree. We visit each node exactly once during the reverse preorder traversal.

**Space Complexity:** O(h) where h is the height of the tree, due to the recursion stack. In the worst case (completely skewed tree), h = n, so space complexity becomes O(n). In the best case (balanced tree), h = log n.

**Why these complexities:**

- We traverse each node once to restructure pointers → O(n) time
- Recursion depth equals tree height → O(h) space
- The algorithm modifies the tree in-place, so no additional O(n) storage is needed beyond the recursion stack

## Common Mistakes

1. **Forgetting to set left pointers to null:** The problem explicitly requires left pointers to be null in the flattened list. Candidates often focus only on connecting right pointers correctly but forget to clear left pointers.

2. **Losing reference to right subtree:** When moving a left subtree to the right side, it's crucial to first find the rightmost node of the left subtree before attaching the original right subtree. A common mistake is: `node.right = node.left` followed by `node.left = null`, which loses the original right subtree.

3. **Using regular preorder instead of reverse preorder:** With regular preorder (root, left, right), by the time we process a node, we've already lost access to its original right child if we modified pointers earlier. Reverse preorder ensures we process children before modifying parent pointers.

4. **Not handling empty tree:** Always check if root is null at the beginning. While the recursive approach handles this naturally in the base case, iterative approaches might need explicit null checks.

## When You'll See This Pattern

This "tree flattening" pattern appears in several variations:

1. **Flatten a Multilevel Doubly Linked List (LeetCode 430):** Similar concept but with doubly linked lists and child pointers instead of binary tree left/right pointers. The same "process child then next" pattern applies.

2. **Correct a Binary Tree (LeetCode 1660):** While not exactly flattening, it involves traversing and modifying tree structure based on specific rules.

3. **Binary Tree to Linked List problems in general:** Any problem requiring in-place transformation of tree structure while preserving traversal order uses similar pointer manipulation techniques.

The core pattern is: **When you need to restructure a tree in-place while preserving some traversal order, consider processing nodes in reverse order of that traversal to avoid losing references.**

## Key Takeaways

1. **Reverse traversal preserves references:** When modifying tree structure in-place, processing nodes in reverse order of the desired output often lets you build the structure without losing track of subtrees.

2. **Pointer manipulation requires careful sequencing:** Always think about what references you'll need later before modifying any pointers. Draw the pointer changes step-by-step for small examples.

3. **Recursive solutions can be elegant for tree problems:** While iterative solutions with stacks are valid, recursive solutions often provide cleaner code for tree transformations, as long as you're mindful of stack space limitations.

Related problems: [Flatten a Multilevel Doubly Linked List](/problem/flatten-a-multilevel-doubly-linked-list), [Correct a Binary Tree](/problem/correct-a-binary-tree)
