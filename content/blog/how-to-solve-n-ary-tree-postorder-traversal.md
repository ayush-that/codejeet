---
title: "How to Solve N-ary Tree Postorder Traversal — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode N-ary Tree Postorder Traversal. Easy difficulty, 81.0% acceptance rate. Topics: Stack, Tree, Depth-First Search."
date: "2027-07-10"
category: "dsa-patterns"
tags: ["n-ary-tree-postorder-traversal", "stack", "tree", "depth-first-search", "easy"]
---

# How to Solve N-ary Tree Postorder Traversal

Postorder traversal is a fundamental tree traversal pattern where we visit all children before visiting the parent node. In an n-ary tree (where nodes can have any number of children), this becomes slightly more interesting than in binary trees because we need to handle a variable number of children per node. The challenge lies in designing an efficient algorithm that works for trees of any shape and size while maintaining clean, readable code.

## Visual Walkthrough

Let's trace through a simple n-ary tree to understand postorder traversal:

```
        1
      / | \
     3  2  4
    / \
   5   6
```

**Postorder traversal visits children before parents, left to right:**

1. Start at root node 1
2. First child of 1 is 3, so we go to node 3
3. First child of 3 is 5 (leaf node) → add 5 to result
4. Next child of 3 is 6 (leaf node) → add 6 to result
5. All children of 3 visited → add 3 to result
6. Back to node 1, next child is 2 (leaf node) → add 2 to result
7. Next child of 1 is 4 (leaf node) → add 4 to result
8. All children of 1 visited → add 1 to result

**Final traversal order:** [5, 6, 3, 2, 4, 1]

The key insight is that we fully explore each subtree before adding its root to the result. This "children first, parent last" ordering is what defines postorder traversal.

## Brute Force Approach

For tree traversal problems, there's no true "brute force" in the sense of trying all possible orderings. However, a naive approach might involve:

1. Creating a copy of the tree structure
2. Marking nodes as visited to avoid cycles
3. Using a complex system of flags to track which children have been processed

This approach would be unnecessarily complex and error-prone. The real issue candidates face isn't algorithmic complexity (postorder traversal is O(n) by definition), but rather implementing it correctly with clean, maintainable code.

A common suboptimal approach is to use recursion without understanding the stack frame implications for very deep trees, or to use iteration with overly complex state tracking. Let's look at the optimal approaches instead.

## Optimal Solution

There are two optimal approaches to solve this problem, both with O(n) time complexity:

1. **Recursive approach** - Simple, intuitive, and mirrors the definition of postorder traversal
2. **Iterative approach** - More memory-efficient for deep trees and avoids recursion limits

### Recursive Solution

The recursive solution follows the natural definition: for each node, recursively traverse all children, then add the node's value to the result.

<div class="code-group">

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children
"""

# Time: O(n) where n is the number of nodes in the tree
# Space: O(h) where h is the height of the tree (recursion stack)
class Solution:
    def postorder(self, root: 'Node') -> List[int]:
        result = []

        def dfs(node):
            # Base case: if node is None, return immediately
            if not node:
                return

            # Recursively traverse all children first
            # This ensures children are processed before parent (postorder)
            if node.children:
                for child in node.children:
                    dfs(child)

            # After all children are processed, add current node's value
            result.append(node.val)

        # Start DFS from the root
        dfs(root)
        return result
```

```javascript
/**
 * // Definition for a Node.
 * function Node(val, children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

// Time: O(n) where n is the number of nodes in the tree
// Space: O(h) where h is the height of the tree (recursion stack)
/**
 * @param {Node|null} root
 * @return {number[]}
 */
var postorder = function (root) {
  const result = [];

  // Define recursive DFS function
  function dfs(node) {
    // Base case: if node is null, return immediately
    if (!node) return;

    // Recursively traverse all children first
    // This ensures children are visited before parent (postorder)
    if (node.children) {
      for (const child of node.children) {
        dfs(child);
      }
    }

    // After processing all children, add current node's value
    result.push(node.val);
  }

  // Start DFS from the root
  dfs(root);
  return result;
};
```

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> children;

    public Node() {}

    public Node(int _val) {
        val = _val;
    }

    public Node(int _val, List<Node> _children) {
        val = _val;
        children = _children;
    }
};
*/

// Time: O(n) where n is the number of nodes in the tree
// Space: O(h) where h is the height of the tree (recursion stack)
class Solution {
    public List<Integer> postorder(Node root) {
        List<Integer> result = new ArrayList<>();
        dfs(root, result);
        return result;
    }

    private void dfs(Node node, List<Integer> result) {
        // Base case: if node is null, return immediately
        if (node == null) return;

        // Recursively traverse all children first
        // This ensures children are visited before parent (postorder)
        if (node.children != null) {
            for (Node child : node.children) {
                dfs(child, result);
            }
        }

        // After processing all children, add current node's value
        result.add(node.val);
    }
}
```

</div>

### Iterative Solution

The iterative solution uses an explicit stack to simulate the recursion. This approach is useful for very deep trees where recursion might cause stack overflow.

<div class="code-group">

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children
"""

# Time: O(n) where n is the number of nodes in the tree
# Space: O(n) for the stack and result list
class Solution:
    def postorder(self, root: 'Node') -> List[int]:
        # Handle empty tree case
        if not root:
            return []

        result = []
        stack = [root]

        # We'll use a simple stack approach
        # Process nodes in reverse order to get postorder traversal
        while stack:
            node = stack.pop()
            # Add node value to result (we'll reverse at the end)
            result.append(node.val)

            # Add all children to stack
            # Since we're using a stack (LIFO), we add children in order
            # so they'll be processed in reverse order
            if node.children:
                for child in node.children:
                    stack.append(child)

        # Reverse the result to get proper postorder
        # The stack processes root, then children right-to-left
        # Reversing gives us children-left-to-right, then root
        return result[::-1]
```

```javascript
/**
 * // Definition for a Node.
 * function Node(val, children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

// Time: O(n) where n is the number of nodes in the tree
// Space: O(n) for the stack and result array
/**
 * @param {Node|null} root
 * @return {number[]}
 */
var postorder = function (root) {
  // Handle empty tree case
  if (!root) return [];

  const result = [];
  const stack = [root];

  // Process nodes using stack
  while (stack.length > 0) {
    const node = stack.pop();
    // Add node value to result (we'll reverse at the end)
    result.push(node.val);

    // Add all children to stack
    // Since stack is LIFO, we add children in order
    // so they'll be processed in reverse order
    if (node.children) {
      for (const child of node.children) {
        stack.push(child);
      }
    }
  }

  // Reverse the result to get proper postorder
  return result.reverse();
};
```

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> children;

    public Node() {}

    public Node(int _val) {
        val = _val;
    }

    public Node(int _val, List<Node> _children) {
        val = _val;
        children = _children;
    }
};
*/

// Time: O(n) where n is the number of nodes in the tree
// Space: O(n) for the stack and result list
class Solution {
    public List<Integer> postorder(Node root) {
        // Handle empty tree case
        if (root == null) return new ArrayList<>();

        List<Integer> result = new ArrayList<>();
        Deque<Node> stack = new ArrayDeque<>();
        stack.push(root);

        // Process nodes using stack
        while (!stack.isEmpty()) {
            Node node = stack.pop();
            // Add node value to result (we'll reverse at the end)
            result.add(node.val);

            // Add all children to stack
            // Since stack is LIFO, we add children in order
            // so they'll be processed in reverse order
            if (node.children != null) {
                for (Node child : node.children) {
                    stack.push(child);
                }
            }
        }

        // Reverse the result to get proper postorder
        Collections.reverse(result);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- Both recursive and iterative solutions visit each node exactly once
- For each node, we perform constant-time operations (checking children, adding to result)
- The iterative solution's final reversal is also O(n), but this doesn't change the overall O(n) complexity

**Space Complexity:**

- **Recursive:** O(h) where h is the height of the tree (maximum depth of recursion stack)
  - In the worst case (skewed tree), h = n, so O(n)
  - In the best case (balanced tree), h = logₖn where k is the average number of children
- **Iterative:** O(n) for the stack and result storage
  - The stack can hold up to n nodes in the worst case
  - The result list always stores n values

The iterative solution has slightly higher worst-case space complexity but avoids potential stack overflow for very deep trees.

## Common Mistakes

1. **Forgetting to handle the null/empty tree case**: Always check if `root` is `null` at the beginning. This is especially important in interviews where edge cases matter.

2. **Incorrect child traversal order**: In postorder traversal, we must visit all children before the parent. A common mistake is to add the parent's value before recursively processing children (which would be preorder, not postorder).

3. **Not reversing the result in iterative solution**: The iterative approach using a stack naturally produces a reverse postorder (root, then children right-to-left). Forgetting to reverse the result at the end is a frequent error.

4. **Assuming binary tree methods work directly**: N-ary trees have a list of children instead of left/right pointers. Don't write `node.left` and `node.right` - use `node.children` and iterate through it.

5. **Modifying the input tree**: Some candidates try to mark nodes as visited by modifying the tree structure. This is unnecessary and violates good practice unless explicitly allowed.

## When You'll See This Pattern

Postorder traversal appears in many tree problems where you need to process children before parents:

1. **Tree serialization/deserialization**: When serializing a tree, postorder can be useful for certain encoding schemes.

2. **Expression tree evaluation**: In expression trees, you typically evaluate children (operands) before applying the parent operator.

3. **Tree cleanup/deletion**: When deleting a tree, you need to delete children before deleting the parent to avoid orphaned nodes or memory leaks.

4. **Dependency resolution**: In dependency graphs (which can be represented as trees), you often need to process dependencies (children) before the dependent item (parent).

**Related problems:**

- **Binary Tree Postorder Traversal (Easy)**: The same concept but with only two children per node.
- **N-ary Tree Level Order Traversal (Medium)**: Uses BFS instead of DFS, but works with the same n-ary tree structure.
- **N-ary Tree Preorder Traversal (Easy)**: The counterpart to this problem, visiting parent before children.

## Key Takeaways

1. **Postorder = Children first, parent last**: This is the defining characteristic. In n-ary trees, process all children (usually left-to-right) before the parent node.

2. **Two implementation strategies**:
   - **Recursive**: More intuitive, follows mathematical definition directly
   - **Iterative**: Uses explicit stack, better for deep trees, requires final reversal

3. **N-ary vs Binary**: The core algorithm is the same, but instead of `left` and `right` pointers, you iterate through a `children` list. This pattern extends to any tree-like structure with variable branching.

4. **Tree traversal fundamentals**: Mastering postorder traversal helps with understanding more complex tree algorithms like topological sort, tree DP, and subtree analysis.

Remember: Practice recognizing when a problem requires processing dependencies (children) before the main item (parent). This "bottom-up" processing is the hallmark of postorder traversal.

Related problems: [Binary Tree Postorder Traversal](/problem/binary-tree-postorder-traversal), [N-ary Tree Level Order Traversal](/problem/n-ary-tree-level-order-traversal), [N-ary Tree Preorder Traversal](/problem/n-ary-tree-preorder-traversal)
