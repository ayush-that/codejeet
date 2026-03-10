---
title: "How to Solve Binary Tree Inorder Traversal — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Binary Tree Inorder Traversal. Easy difficulty, 79.7% acceptance rate. Topics: Stack, Tree, Depth-First Search, Binary Tree."
date: "2026-03-14"
category: "dsa-patterns"
tags: ["binary-tree-inorder-traversal", "stack", "tree", "depth-first-search", "easy"]
---

# How to Solve Binary Tree Inorder Traversal

Binary tree inorder traversal is a fundamental problem that tests your understanding of tree traversal algorithms and recursion. While the concept is simple—visit left subtree, then root, then right subtree—the implementation reveals important patterns used in more complex tree problems. What makes this problem interesting is that it has multiple valid approaches (recursive, iterative with stack, and Morris traversal), each teaching different concepts about tree manipulation and space optimization.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this binary tree:

```
      1
     / \
    2   3
   / \
  4   5
```

Inorder traversal means we visit nodes in this order: left subtree → root → right subtree.

Step-by-step traversal:

1. Start at root (1). Go to its left child (2)
2. At node 2, go to its left child (4)
3. Node 4 has no left child, so we "visit" node 4 (add to result)
4. Return to node 2, visit node 2
5. Go to node 2's right child (5)
6. Node 5 has no left child, so visit node 5
7. Return to node 1, visit node 1
8. Go to node 1's right child (3)
9. Node 3 has no left child, so visit node 3

Final traversal order: [4, 2, 5, 1, 3]

This "left-root-right" pattern is what defines inorder traversal. Notice how we always fully explore the left subtree before visiting the current node.

## Brute Force Approach

For tree traversal problems, there isn't really a "brute force" in the traditional sense since we must visit every node exactly once. However, a naive approach might try to store the entire tree in an array and then sort it—but this would only work if the tree were a binary search tree (where inorder traversal yields sorted order).

The truly naive approach would be to use recursion without understanding the stack space implications, or to attempt an iterative solution without properly managing the stack. Let's look at what a beginner might try:

A common incorrect iterative attempt might look like this (pseudocode):

```
result = []
stack = [root]
while stack not empty:
    node = stack.pop()
    result.append(node.val)
    if node.right: stack.append(node.right)
    if node.left: stack.append(node.left)
```

This is actually **preorder** traversal (root → left → right), not inorder! The mistake is visiting the node immediately instead of waiting until after processing the left subtree.

The key insight is that with inorder traversal, we need to defer visiting a node until we've processed its entire left subtree. This is why we need either recursion (which uses the call stack) or an explicit stack to track nodes we haven't visited yet.

## Optimal Solution

We'll present three optimal solutions: recursive (simplest), iterative with stack (most common interview answer), and Morris traversal (space-optimized). The iterative stack solution is usually what interviewers want to see, as it demonstrates understanding of how recursion works under the hood.

<div class="code-group">

```python
# Time: O(n) where n is number of nodes (we visit each node once)
# Space: O(n) for the result list, O(h) for recursion stack where h is tree height
# Recursive Solution
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        result = []

        def dfs(node):
            if not node:
                return

            # Inorder: left → root → right
            dfs(node.left)      # Step 1: Traverse left subtree
            result.append(node.val)  # Step 2: Visit current node
            dfs(node.right)     # Step 3: Traverse right subtree

        dfs(root)
        return result

# Time: O(n) where n is number of nodes
# Space: O(n) for the result list, O(h) for stack where h is tree height
# Iterative Solution with Stack
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        result = []
        stack = []
        current = root

        # We continue until we've processed all nodes
        while current or stack:
            # Step 1: Go as far left as possible, pushing nodes to stack
            while current:
                stack.append(current)
                current = current.left

            # Step 2: Pop from stack (this is the next node in inorder)
            current = stack.pop()
            result.append(current.val)  # Visit the node

            # Step 3: Move to right subtree
            current = current.right

        return result

# Time: O(n) where n is number of nodes
# Space: O(1) excluding result list (Morris traversal modifies tree temporarily)
# Morris Traversal (Threaded Binary Tree)
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        result = []
        current = root

        while current:
            if not current.left:
                # If no left child, visit current and go right
                result.append(current.val)
                current = current.right
            else:
                # Find the inorder predecessor (rightmost node in left subtree)
                predecessor = current.left
                while predecessor.right and predecessor.right != current:
                    predecessor = predecessor.right

                if not predecessor.right:
                    # Create a thread from predecessor to current
                    predecessor.right = current
                    current = current.left
                else:
                    # Thread already exists, break it and visit current
                    predecessor.right = None
                    result.append(current.val)
                    current = current.right

        return result
```

```javascript
// Time: O(n) where n is number of nodes
// Space: O(n) for result array, O(h) for recursion stack
// Recursive Solution
var inorderTraversal = function (root) {
  const result = [];

  function dfs(node) {
    if (!node) return;

    // Inorder: left → root → right
    dfs(node.left); // Step 1: Traverse left subtree
    result.push(node.val); // Step 2: Visit current node
    dfs(node.right); // Step 3: Traverse right subtree
  }

  dfs(root);
  return result;
};

// Time: O(n) where n is number of nodes
// Space: O(n) for result array, O(h) for stack
// Iterative Solution with Stack
var inorderTraversal = function (root) {
  const result = [];
  const stack = [];
  let current = root;

  // Continue until all nodes processed
  while (current || stack.length > 0) {
    // Step 1: Go as far left as possible
    while (current) {
      stack.push(current);
      current = current.left;
    }

    // Step 2: Pop from stack (next inorder node)
    current = stack.pop();
    result.push(current.val); // Visit the node

    // Step 3: Move to right subtree
    current = current.right;
  }

  return result;
};

// Time: O(n) where n is number of nodes
// Space: O(1) excluding result array
// Morris Traversal
var inorderTraversal = function (root) {
  const result = [];
  let current = root;

  while (current) {
    if (!current.left) {
      // No left child, visit current and go right
      result.push(current.val);
      current = current.right;
    } else {
      // Find inorder predecessor
      let predecessor = current.left;
      while (predecessor.right && predecessor.right !== current) {
        predecessor = predecessor.right;
      }

      if (!predecessor.right) {
        // Create thread from predecessor to current
        predecessor.right = current;
        current = current.left;
      } else {
        // Thread exists, break it and visit current
        predecessor.right = null;
        result.push(current.val);
        current = current.right;
      }
    }
  }

  return result;
};
```

```java
// Time: O(n) where n is number of nodes
// Space: O(n) for result list, O(h) for recursion stack
// Recursive Solution
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        dfs(root, result);
        return result;
    }

    private void dfs(TreeNode node, List<Integer> result) {
        if (node == null) return;

        // Inorder: left → root → right
        dfs(node.left, result);   // Step 1: Traverse left subtree
        result.add(node.val);     // Step 2: Visit current node
        dfs(node.right, result);  // Step 3: Traverse right subtree
    }
}

// Time: O(n) where n is number of nodes
// Space: O(n) for result list, O(h) for stack
// Iterative Solution with Stack
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode current = root;

        // Continue until all nodes processed
        while (current != null || !stack.isEmpty()) {
            // Step 1: Go as far left as possible
            while (current != null) {
                stack.push(current);
                current = current.left;
            }

            // Step 2: Pop from stack (next inorder node)
            current = stack.pop();
            result.add(current.val); // Visit the node

            // Step 3: Move to right subtree
            current = current.right;
        }

        return result;
    }
}

// Time: O(n) where n is number of nodes
// Space: O(1) excluding result list
// Morris Traversal
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        TreeNode current = root;

        while (current != null) {
            if (current.left == null) {
                // No left child, visit current and go right
                result.add(current.val);
                current = current.right;
            } else {
                // Find inorder predecessor
                TreeNode predecessor = current.left;
                while (predecessor.right != null && predecessor.right != current) {
                    predecessor = predecessor.right;
                }

                if (predecessor.right == null) {
                    // Create thread from predecessor to current
                    predecessor.right = current;
                    current = current.left;
                } else {
                    // Thread exists, break it and visit current
                    predecessor.right = null;
                    result.add(current.val);
                    current = current.right;
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Recursive Solution:**

- **Time Complexity:** O(n) - We visit each node exactly once
- **Space Complexity:** O(n) for the result list + O(h) for recursion stack, where h is the height of the tree. In worst case (skewed tree), h = n, so O(n). In balanced tree, h = log n.

**Iterative Stack Solution:**

- **Time Complexity:** O(n) - Each node is pushed and popped from stack exactly once
- **Space Complexity:** O(n) for result + O(h) for stack. Same as recursive but avoids recursion overhead.

**Morris Traversal:**

- **Time Complexity:** O(n) - Each edge is traversed at most twice
- **Space Complexity:** O(1) excluding result storage - This is the main advantage. We temporarily modify the tree by creating threads, then restore it.

The iterative stack solution is usually the best choice for interviews: it's efficient, demonstrates understanding of how recursion works, and is easy to explain.

## Common Mistakes

1. **Confusing traversal orders:** Mixing up inorder (left-root-right) with preorder (root-left-right) or postorder (left-right-root). Always verbalize the order before coding.
2. **Forgetting the base case in recursion:** Not checking if node is null before recursing, leading to null pointer exceptions. Always include: `if not node: return` or equivalent.

3. **Incorrect stack management in iterative solution:** A common error is visiting nodes immediately when pushing them onto the stack. Remember: in inorder traversal, we push nodes without visiting them, then visit when popping.

4. **Not handling empty tree:** Forgetting that root can be null. Both recursive and iterative solutions should handle this edge case gracefully.

5. **In Morris traversal, not breaking threads:** Forgetting to set `predecessor.right = null` after using the thread can leave the tree modified.

## When You'll See This Pattern

Inorder traversal appears in many tree-related problems:

1. **Validate Binary Search Tree (Medium)** - Inorder traversal of a BST yields sorted values. You can use inorder traversal to check if values are strictly increasing.

2. **Kth Smallest Element in a BST (Medium)** - Inorder traversal visits nodes in ascending order, so the kth visited node is the kth smallest.

3. **Recover Binary Search Tree (Hard)** - Two nodes are swapped in a BST. Inorder traversal helps identify which nodes are out of order.

4. **Binary Search Tree Iterator (Medium)** - Implementing `next()` and `hasNext()` efficiently often uses iterative inorder traversal with a stack.

The pattern of using a stack to simulate recursion or defer processing until later appears in many tree and graph problems. Whenever you need to traverse a tree in a specific order while maintaining state, consider this approach.

## Key Takeaways

1. **Inorder = Left → Root → Right** - This specific order is crucial for BST problems since it yields sorted values.

2. **Stack enables iterative tree traversal** - The stack lets us "pause" at a node while we explore its left subtree, then return to it later. This mimics the recursion call stack.

3. **Multiple valid approaches exist** - Recursive (simplest), iterative with stack (most common interview answer), and Morris traversal (space-optimized). Know when to use each based on constraints.

4. **Tree traversal is foundational** - Mastering inorder traversal helps with preorder, postorder, and level-order traversals, which all use similar patterns with slight modifications.

Remember: The iterative stack solution is what interviewers most want to see. Practice drawing the stack contents at each step to build intuition for how it works.

Related problems: [Validate Binary Search Tree](/problem/validate-binary-search-tree), [Binary Tree Preorder Traversal](/problem/binary-tree-preorder-traversal), [Binary Tree Postorder Traversal](/problem/binary-tree-postorder-traversal)
