---
title: "How to Solve Binary Tree Preorder Traversal — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Binary Tree Preorder Traversal. Easy difficulty, 75.2% acceptance rate. Topics: Stack, Tree, Depth-First Search, Binary Tree."
date: "2026-05-01"
category: "dsa-patterns"
tags: ["binary-tree-preorder-traversal", "stack", "tree", "depth-first-search", "easy"]
---

# How to Solve Binary Tree Preorder Traversal

Binary tree preorder traversal is a fundamental tree traversal pattern where you visit nodes in the order: **root → left subtree → right subtree**. While this seems straightforward conceptually, implementing it correctly—especially the iterative version—requires careful handling of node visitation order and stack operations. What makes this problem interesting is that the recursive solution is trivial, but the iterative solution teaches you how to simulate recursion using a stack, which is a crucial skill for tree problems.

## Visual Walkthrough

Let's trace through a small binary tree example to build intuition:

```
    1
   / \
  2   3
 / \
4   5
```

**Preorder traversal order:** Root → Left → Right

Step-by-step visitation:

1. Start at root **1** → add to result: `[1]`
2. Go to left child **2** → add: `[1, 2]`
3. Go to left child **4** → add: `[1, 2, 4]`
4. **4** has no children, backtrack to **2**
5. Go to right child **5** → add: `[1, 2, 4, 5]`
6. Backtrack to **1**
7. Go to right child **3** → add: `[1, 2, 4, 5, 3]`

Final result: `[1, 2, 4, 5, 3]`

The key insight: we always process the current node first, then explore its left subtree completely before moving to the right subtree. In the iterative approach, we need to use a stack to remember where to go after finishing a subtree.

## Brute Force Approach

For tree traversal problems, there isn't really a "brute force" in the traditional sense since we must visit every node exactly once. However, a naive candidate might try to:

1. **Store all nodes in a list first, then reorder them** - This doesn't work because you need the tree structure to determine traversal order
2. **Use recursion without considering stack overflow** - For extremely deep trees (like a linked list disguised as a tree), recursion could cause stack overflow
3. **Attempt to modify the tree structure** - Some candidates try to change pointers during traversal, which destroys the original tree

The only reasonable approaches are:

- **Recursive DFS** (simple but uses implicit call stack)
- **Iterative with stack** (explicit stack, more control)
- **Morris traversal** (constant space but modifies tree temporarily)

Since recursion is the most intuitive, let's start there, but we'll focus on the iterative solution as it's what interviewers often want to see.

## Optimal Solution

The optimal solution uses an explicit stack to simulate the recursion call stack. Here's the thought process:

1. We need to visit nodes in root → left → right order
2. When we visit a node, we should process it immediately, then explore left, then right
3. Since we need to come back to the right child after finishing the left subtree, we must store the right child on a stack
4. Actually, it's cleaner to push the right child first, then the left child, so the left gets processed next (LIFO)

<div class="code-group">

```python
# Time: O(n) where n is number of nodes | Space: O(h) where h is tree height
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def preorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        # Handle empty tree case
        if not root:
            return []

        result = []  # Store traversal order
        stack = [root]  # Initialize stack with root node

        # Continue until stack is empty (all nodes processed)
        while stack:
            # Pop the top node from stack (current node to process)
            node = stack.pop()

            # Process current node (root) - add to result
            result.append(node.val)

            # Push right child first, then left child
            # This ensures left child is processed next (LIFO: last in, first out)
            if node.right:
                stack.append(node.right)
            if node.left:
                stack.append(node.left)

        return result
```

```javascript
// Time: O(n) where n is number of nodes | Space: O(h) where h is tree height
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
 * @return {number[]}
 */
var preorderTraversal = function (root) {
  // Handle empty tree case
  if (!root) {
    return [];
  }

  const result = []; // Store traversal order
  const stack = [root]; // Initialize stack with root node

  // Continue until stack is empty (all nodes processed)
  while (stack.length > 0) {
    // Pop the top node from stack (current node to process)
    const node = stack.pop();

    // Process current node (root) - add to result
    result.push(node.val);

    // Push right child first, then left child
    // This ensures left child is processed next (LIFO: last in, first out)
    if (node.right) {
      stack.push(node.right);
    }
    if (node.left) {
      stack.push(node.left);
    }
  }

  return result;
};
```

```java
// Time: O(n) where n is number of nodes | Space: O(h) where h is tree height
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
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();

        // Handle empty tree case
        if (root == null) {
            return result;
        }

        // Initialize stack with root node
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);

        // Continue until stack is empty (all nodes processed)
        while (!stack.isEmpty()) {
            // Pop the top node from stack (current node to process)
            TreeNode node = stack.pop();

            // Process current node (root) - add to result
            result.add(node.val);

            // Push right child first, then left child
            // This ensures left child is processed next (LIFO: last in, first out)
            if (node.right != null) {
                stack.push(node.right);
            }
            if (node.left != null) {
                stack.push(node.left);
            }
        }

        return result;
    }
}
```

</div>

**Why this order works:** The stack follows LIFO (Last In, First Out). By pushing the right child before the left child, we ensure that when we pop from the stack, we get the left child first (which was pushed last). This gives us the correct preorder: root → left → right.

## Complexity Analysis

**Time Complexity:** O(n)

- We visit each node exactly once
- Each node is pushed onto and popped from the stack exactly once
- Constant time operations per node

**Space Complexity:** O(h) where h is the height of the tree

- In the worst case (skewed tree), h = n, so O(n)
- In the best case (balanced tree), h = log n, so O(log n)
- The stack stores at most the path from root to current node
- This is better than recursion's implicit call stack which also uses O(h) space

## Common Mistakes

1. **Forgetting to handle the empty tree case** - Always check if `root is None/null` at the beginning. Without this check, you'll get null pointer errors when trying to access `root.val` or `root.left`.

2. **Wrong order of pushing children to stack** - If you push left then right, you'll get root → right → left (reverse of preorder). Remember: preorder is root → left → right, so push right first, then left.

3. **Using a queue instead of a stack** - A queue (FIFO) gives you level-order traversal (BFS), not preorder (DFS). Preorder requires LIFO behavior.

4. **Not popping from stack before processing** - Some candidates peek at the stack top but forget to pop it, causing infinite loops. Always pop, process, then push children.

5. **Modifying the tree during traversal** - Avoid changing node pointers or values unless the problem specifically allows it (like in Morris traversal).

## When You'll See This Pattern

The stack-based DFS pattern appears in many tree problems:

1. **Binary Tree Inorder Traversal (LeetCode 94)** - Similar stack approach but with different node processing order. You need to traverse left, process node, then traverse right.

2. **Binary Tree Postorder Traversal (LeetCode 145)** - Another variation where you process children before the root. Can be done with two stacks or by reversing a modified preorder.

3. **Validate Binary Search Tree (LeetCode 98)** - Inorder traversal of a BST gives sorted order, which can be verified using iterative traversal.

4. **Kth Smallest Element in a BST (LeetCode 230)** - Use inorder traversal and stop at the kth element.

The key insight: whenever you need to traverse a tree in a specific order (preorder, inorder, postorder) without recursion, think "stack."

## Key Takeaways

1. **Preorder = Root → Left → Right** - Remember this visitation order. The iterative stack solution processes the root immediately, then ensures left is processed before right by pushing right child first.

2. **Stack simulates recursion** - Any recursive DFS can be converted to iterative using a stack. The stack stores "work to do later" (nodes to visit).

3. **Space complexity depends on tree height** - For balanced trees, it's O(log n); for skewed trees, it's O(n). This is true for both recursive and iterative approaches.

4. **Test with edge cases** - Always test: empty tree, single node, left-skewed tree, right-skewed tree, and a small balanced tree.

Mastering this pattern will help you with dozens of tree problems, as tree traversal is the foundation for most tree algorithms.

**Related problems:** [Binary Tree Inorder Traversal](/problem/binary-tree-inorder-traversal), [Verify Preorder Sequence in Binary Search Tree](/problem/verify-preorder-sequence-in-binary-search-tree), [N-ary Tree Preorder Traversal](/problem/n-ary-tree-preorder-traversal)
