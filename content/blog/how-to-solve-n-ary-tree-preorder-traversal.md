---
title: "How to Solve N-ary Tree Preorder Traversal — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode N-ary Tree Preorder Traversal. Easy difficulty, 76.7% acceptance rate. Topics: Stack, Tree, Depth-First Search."
date: "2027-05-14"
category: "dsa-patterns"
tags: ["n-ary-tree-preorder-traversal", "stack", "tree", "depth-first-search", "easy"]
---

# How to Solve N-ary Tree Preorder Traversal

This problem asks us to traverse an N-ary tree in preorder sequence, which means we visit the root node first, then recursively traverse each child from left to right. While this seems straightforward for binary trees, N-ary trees can have any number of children per node, which requires careful handling of the recursion or iteration. The interesting challenge here is adapting binary tree traversal techniques to handle a variable number of children efficiently.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this N-ary tree:

```
        1
     /  |  \
    3   2   4
   / \
  5   6
```

The preorder traversal should visit nodes in this order: `[1, 3, 5, 6, 2, 4]`.

Here's how the recursive approach would work step by step:

1. **Start at root (1)**: Add `1` to result
2. **Process first child (3)**:
   - Add `3` to result
   - Process its first child (5): Add `5` to result (no children, so return)
   - Process its second child (6): Add `6` to result (no children, so return)
3. **Process second child (2)**: Add `2` to result (no children, so return)
4. **Process third child (4)**: Add `4` to result (no children, so return)

The iterative approach using a stack would work like this:

1. Push root `1` to stack: `stack = [1]`
2. Pop `1`, add to result, push children in reverse order: `stack = [4, 2, 3]`
3. Pop `3`, add to result, push children in reverse order: `stack = [4, 2, 6, 5]`
4. Pop `5`, add to result (no children): `stack = [4, 2, 6]`
5. Pop `6`, add to result (no children): `stack = [4, 2]`
6. Pop `2`, add to result (no children): `stack = [4]`
7. Pop `4`, add to result (no children): `stack = []`

Both approaches give us the same result: `[1, 3, 5, 6, 2, 4]`.

## Brute Force Approach

For tree traversal problems, there isn't really a "brute force" in the traditional sense since we must visit every node exactly once. However, a naive approach might involve unnecessary complexity like:

1. **Using BFS instead of DFS**: While BFS (level-order) would still visit all nodes, it wouldn't produce the correct preorder sequence. The output would be `[1, 3, 2, 4, 5, 6]` instead of `[1, 3, 5, 6, 2, 4]`.

2. **Inefficient recursion without base case**: Forgetting to handle the base case (when node is null) would lead to infinite recursion or null pointer exceptions.

3. **Wrong child processing order**: Processing children from right to left instead of left to right would give incorrect preorder traversal.

The key insight is that preorder traversal has a natural recursive definition: visit root, then recursively visit each child in order. This leads directly to our optimal solutions.

## Optimal Solution

We have two optimal approaches: recursive (DFS) and iterative (using a stack). Both have O(n) time complexity where n is the number of nodes, since we visit each node exactly once.

### Recursive Solution (DFS)

The recursive approach is the most intuitive: visit the root, then recursively traverse each child from left to right.

<div class="code-group">

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children
"""

# Time: O(n) - We visit each node exactly once
# Space: O(h) - Recursion stack uses space proportional to tree height (worst case O(n) for skewed tree)
class Solution:
    def preorder(self, root: 'Node') -> List[int]:
        # Initialize result list to store traversal order
        result = []

        # Define recursive helper function
        def dfs(node):
            # Base case: if node is None, return immediately
            if not node:
                return

            # Preorder: process root first
            result.append(node.val)

            # Then recursively process all children from left to right
            # If children is None, the loop won't execute (handles leaf nodes)
            for child in node.children or []:
                dfs(child)

        # Start DFS from the root
        dfs(root)

        # Return the complete traversal
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

// Time: O(n) - We visit each node exactly once
// Space: O(h) - Recursion stack uses space proportional to tree height (worst case O(n) for skewed tree)
/**
 * @param {Node|null} root
 * @return {number[]}
 */
var preorder = function (root) {
  // Initialize result array to store traversal order
  const result = [];

  // Define recursive DFS function
  const dfs = (node) => {
    // Base case: if node is null, return immediately
    if (!node) return;

    // Preorder: process root first
    result.push(node.val);

    // Then recursively process all children from left to right
    // Handle case where children might be null or undefined
    if (node.children) {
      for (const child of node.children) {
        dfs(child);
      }
    }
  };

  // Start DFS from the root
  dfs(root);

  // Return the complete traversal
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

// Time: O(n) - We visit each node exactly once
// Space: O(h) - Recursion stack uses space proportional to tree height (worst case O(n) for skewed tree)
class Solution {
    public List<Integer> preorder(Node root) {
        // Initialize result list to store traversal order
        List<Integer> result = new ArrayList<>();

        // Start DFS from the root
        dfs(root, result);

        // Return the complete traversal
        return result;
    }

    private void dfs(Node node, List<Integer> result) {
        // Base case: if node is null, return immediately
        if (node == null) {
            return;
        }

        // Preorder: process root first
        result.add(node.val);

        // Then recursively process all children from left to right
        // Handle case where children might be null
        if (node.children != null) {
            for (Node child : node.children) {
                dfs(child, result);
            }
        }
    }
}
```

</div>

### Iterative Solution (Using Stack)

The iterative approach uses an explicit stack to simulate the recursion. We push children in reverse order so they're processed left-to-right when popped.

<div class="code-group">

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children
"""

# Time: O(n) - We visit each node exactly once
# Space: O(n) - Stack can hold up to n nodes in worst case
class Solution:
    def preorder(self, root: 'Node') -> List[int]:
        # Handle edge case: empty tree
        if not root:
            return []

        # Initialize result list and stack
        result = []
        stack = [root]

        # Process nodes while stack is not empty
        while stack:
            # Pop the top node from stack
            node = stack.pop()

            # Process current node (root of current subtree)
            result.append(node.val)

            # Push children to stack in REVERSE order
            # This ensures leftmost child is processed next (LIFO behavior)
            # If children is None, reversed() returns empty iterator
            for child in reversed(node.children or []):
                stack.append(child)

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

// Time: O(n) - We visit each node exactly once
// Space: O(n) - Stack can hold up to n nodes in worst case
/**
 * @param {Node|null} root
 * @return {number[]}
 */
var preorder = function (root) {
  // Handle edge case: empty tree
  if (!root) return [];

  // Initialize result array and stack
  const result = [];
  const stack = [root];

  // Process nodes while stack is not empty
  while (stack.length > 0) {
    // Pop the top node from stack
    const node = stack.pop();

    // Process current node (root of current subtree)
    result.push(node.val);

    // Push children to stack in REVERSE order
    // This ensures leftmost child is processed next (LIFO behavior)
    // Handle case where children might be null or undefined
    if (node.children) {
      // Iterate from last child to first
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i]);
      }
    }
  }

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

// Time: O(n) - We visit each node exactly once
// Space: O(n) - Stack can hold up to n nodes in worst case
class Solution {
    public List<Integer> preorder(Node root) {
        // Handle edge case: empty tree
        if (root == null) {
            return new ArrayList<>();
        }

        // Initialize result list and stack
        List<Integer> result = new ArrayList<>();
        Stack<Node> stack = new Stack<>();
        stack.push(root);

        // Process nodes while stack is not empty
        while (!stack.isEmpty()) {
            // Pop the top node from stack
            Node node = stack.pop();

            // Process current node (root of current subtree)
            result.add(node.val);

            // Push children to stack in REVERSE order
            // This ensures leftmost child is processed next (LIFO behavior)
            // Handle case where children might be null
            if (node.children != null) {
                // Iterate from last child to first
                for (int i = node.children.size() - 1; i >= 0; i--) {
                    stack.push(node.children.get(i));
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Both recursive and iterative approaches visit each node exactly once
- For each node, we perform constant-time operations: adding value to result and pushing/popping from stack
- Total operations scale linearly with number of nodes n

**Space Complexity:**

- **Recursive approach: O(h)** where h is the height of the tree
  - Maximum recursion depth equals tree height
  - Worst case (skewed tree): O(n) when tree degenerates to linked list
  - Best case (balanced tree): O(log n) when tree is roughly balanced

- **Iterative approach: O(n)**
  - Stack can contain all nodes in worst case (e.g., root with many children)
  - In practice, usually better than worst case but we use O(n) for conservative analysis

## Common Mistakes

1. **Forgetting to handle null/empty tree**: Always check if root is null at the beginning. Without this check, you'll get null pointer exceptions when trying to access root.val or root.children.

2. **Wrong child processing order in iterative solution**:
   - **Mistake**: Pushing children in natural order (left-to-right) to stack
   - **Why it fails**: Stack is LIFO (Last-In-First-Out), so pushing left child first means right child gets processed first
   - **Fix**: Push children in reverse order (right-to-left) so left child is on top

3. **Infinite recursion without base case**:
   - **Mistake**: Not checking if node is null before recursive call
   - **Why it fails**: Recursion never terminates, leads to stack overflow
   - **Fix**: Always include base case `if not node: return`

4. **Assuming children list is never null**:
   - **Mistake**: Directly iterating over `node.children` without null check
   - **Why it fails**: Leaf nodes might have `children = null` or empty list
   - **Fix**: Use `node.children or []` (Python), `if (node.children)` (JS/Java) before iteration

## When You'll See This Pattern

The preorder traversal pattern appears in many tree problems:

1. **Binary Tree Preorder Traversal (LeetCode 144)**: Same concept but with exactly 2 children per node. The N-ary solution generalizes this pattern.

2. **Serialize and Deserialize N-ary Tree (LeetCode 428)**: Preorder traversal is often used for serialization because it naturally preserves the tree structure when paired with child counts.

3. **Clone N-ary Tree (LeetCode 1490)**: Preorder traversal helps visit each node exactly once while creating copies.

4. **Maximum Depth of N-ary Tree (LeetCode 559)**: While often solved with BFS, DFS (preorder) works too by tracking depth during traversal.

The core pattern is: **process root, then recursively process all children**. This "root-first, children-after" ordering is the hallmark of preorder traversal.

## Key Takeaways

1. **Preorder = Root → Children**: Remember that preorder traversal always processes the root node before any of its children. This is different from postorder (children first) or inorder (left, root, right for binary trees).

2. **Stack reversal trick**: In iterative solutions, push children to stack in reverse order to maintain correct left-to-right processing due to LIFO stack behavior.

3. **Generalization from binary to N-ary**: If you know binary tree traversal, N-ary is just replacing "left/right" with "for each child in children". The recursive structure is identical.

4. **Always handle edge cases**: Empty tree (null root) and leaf nodes (null/empty children list) are common pitfalls that separate working from broken solutions.

Related problems: [Binary Tree Preorder Traversal](/problem/binary-tree-preorder-traversal), [N-ary Tree Level Order Traversal](/problem/n-ary-tree-level-order-traversal), [N-ary Tree Postorder Traversal](/problem/n-ary-tree-postorder-traversal)
