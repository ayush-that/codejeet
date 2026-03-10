---
title: "How to Solve Binary Tree Postorder Traversal — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Binary Tree Postorder Traversal. Easy difficulty, 77.6% acceptance rate. Topics: Stack, Tree, Depth-First Search, Binary Tree."
date: "2026-06-03"
category: "dsa-patterns"
tags: ["binary-tree-postorder-traversal", "stack", "tree", "depth-first-search", "easy"]
---

# How to Solve Binary Tree Postorder Traversal

Postorder traversal is one of the three fundamental ways to traverse a binary tree, where you visit nodes in the order: left subtree → right subtree → root. While the recursive solution is straightforward, the iterative version requires careful stack manipulation that often trips up candidates. What makes this problem interesting is that the iterative solution isn't just "push nodes onto a stack" — you need to track whether you've processed a node's children before visiting it.

## Visual Walkthrough

Let's trace through a small binary tree to understand postorder traversal:

```
      1
     / \
    2   3
   / \
  4   5
```

Postorder traversal visits nodes in this order: **4 → 5 → 2 → 3 → 1**

Here's the step-by-step reasoning:

1. Start at root (1). Before visiting 1, we must visit its left subtree (rooted at 2)
2. At node 2, before visiting 2, we must visit its left subtree (rooted at 4)
3. Node 4 has no children, so we can visit it immediately → **4**
4. Back to node 2, now we need to visit its right subtree (rooted at 5)
5. Node 5 has no children, so we visit it → **5**
6. Now we've visited both children of node 2, so we can visit node 2 → **2**
7. Back to root (1), we need to visit its right subtree (rooted at 3)
8. Node 3 has no children, so we visit it → **3**
9. Finally, both children of root (1) have been visited, so we visit root → **1**

The key insight: you can't process a node until you've processed all nodes in both its left and right subtrees.

## Brute Force Approach

For tree traversal problems, the "brute force" is usually just the recursive solution. While recursion is perfectly valid and often acceptable in interviews, interviewers frequently ask for the iterative version to test your understanding of stack-based DFS and to avoid potential stack overflow with very deep trees.

The recursive approach is simple:

1. If the current node is null, return
2. Recursively traverse the left subtree
3. Recursively traverse the right subtree
4. Process the current node (add its value to the result)

However, the interviewer might consider this "too easy" and ask for the iterative version. More importantly, understanding the iterative solution helps you recognize patterns used in more complex tree problems.

## Optimal Solution

There are two optimal approaches: recursive (simple) and iterative (more challenging but often expected). Let's implement both.

### Recursive Solution

<div class="code-group">

```python
# Time: O(n) where n is number of nodes
# Space: O(h) where h is tree height (call stack)
class Solution:
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        result = []

        def dfs(node):
            if not node:
                return

            # Traverse left subtree first
            dfs(node.left)
            # Then traverse right subtree
            dfs(node.right)
            # Finally visit current node (post-order)
            result.append(node.val)

        dfs(root)
        return result
```

```javascript
// Time: O(n) where n is number of nodes
// Space: O(h) where h is tree height (call stack)
function postorderTraversal(root) {
  const result = [];

  function dfs(node) {
    if (!node) return;

    // Traverse left subtree first
    dfs(node.left);
    // Then traverse right subtree
    dfs(node.right);
    // Finally visit current node (post-order)
    result.push(node.val);
  }

  dfs(root);
  return result;
}
```

```java
// Time: O(n) where n is number of nodes
// Space: O(h) where h is tree height (call stack)
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        dfs(root, result);
        return result;
    }

    private void dfs(TreeNode node, List<Integer> result) {
        if (node == null) return;

        // Traverse left subtree first
        dfs(node.left, result);
        // Then traverse right subtree
        dfs(node.right, result);
        // Finally visit current node (post-order)
        result.add(node.val);
    }
}
```

</div>

### Iterative Solution (Two Stacks Method)

The most intuitive iterative approach uses two stacks. The first stack helps us traverse, and the second stack reverses the order to get postorder.

<div class="code-group">

```python
# Time: O(n) where n is number of nodes
# Space: O(n) for the two stacks
class Solution:
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []

        result = []
        stack1 = [root]  # Stack for traversal
        stack2 = []      # Stack for reversal

        # Process all nodes
        while stack1:
            node = stack1.pop()
            stack2.append(node)

            # Push left then right to stack1
            # This ensures right gets processed before left in stack2
            if node.left:
                stack1.append(node.left)
            if node.right:
                stack1.append(node.right)

        # Pop from stack2 to get postorder
        while stack2:
            result.append(stack2.pop().val)

        return result
```

```javascript
// Time: O(n) where n is number of nodes
// Space: O(n) for the two stacks
function postorderTraversal(root) {
  if (!root) return [];

  const result = [];
  const stack1 = [root]; // Stack for traversal
  const stack2 = []; // Stack for reversal

  // Process all nodes
  while (stack1.length > 0) {
    const node = stack1.pop();
    stack2.push(node);

    // Push left then right to stack1
    // This ensures right gets processed before left in stack2
    if (node.left) stack1.push(node.left);
    if (node.right) stack1.push(node.right);
  }

  // Pop from stack2 to get postorder
  while (stack2.length > 0) {
    result.push(stack2.pop().val);
  }

  return result;
}
```

```java
// Time: O(n) where n is number of nodes
// Space: O(n) for the two stacks
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;

        Stack<TreeNode> stack1 = new Stack<>();
        Stack<TreeNode> stack2 = new Stack<>();

        stack1.push(root);

        // Process all nodes
        while (!stack1.isEmpty()) {
            TreeNode node = stack1.pop();
            stack2.push(node);

            // Push left then right to stack1
            // This ensures right gets processed before left in stack2
            if (node.left != null) stack1.push(node.left);
            if (node.right != null) stack1.push(node.right);
        }

        // Pop from stack2 to get postorder
        while (!stack2.isEmpty()) {
            result.add(stack2.pop().val);
        }

        return result;
    }
}
```

</div>

### Iterative Solution (Single Stack Method)

A more space-efficient approach uses just one stack but requires tracking whether we've processed a node's children.

<div class="code-group">

```python
# Time: O(n) where n is number of nodes
# Space: O(h) where h is tree height
class Solution:
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []

        result = []
        stack = []
        current = root
        last_visited = None

        while stack or current:
            # Go to the leftmost node
            if current:
                stack.append(current)
                current = current.left
            else:
                # Check the top node without popping
                peek_node = stack[-1]

                # If right child exists and hasn't been visited
                if peek_node.right and peek_node.right != last_visited:
                    # Move to right subtree
                    current = peek_node.right
                else:
                    # Visit the node
                    result.append(peek_node.val)
                    last_visited = stack.pop()

        return result
```

```javascript
// Time: O(n) where n is number of nodes
// Space: O(h) where h is tree height
function postorderTraversal(root) {
  if (!root) return [];

  const result = [];
  const stack = [];
  let current = root;
  let lastVisited = null;

  while (stack.length > 0 || current) {
    // Go to the leftmost node
    if (current) {
      stack.push(current);
      current = current.left;
    } else {
      // Check the top node without popping
      const peekNode = stack[stack.length - 1];

      // If right child exists and hasn't been visited
      if (peekNode.right && peekNode.right !== lastVisited) {
        // Move to right subtree
        current = peekNode.right;
      } else {
        // Visit the node
        result.push(peekNode.val);
        lastVisited = stack.pop();
      }
    }
  }

  return result;
}
```

```java
// Time: O(n) where n is number of nodes
// Space: O(h) where h is tree height
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;

        Stack<TreeNode> stack = new Stack<>();
        TreeNode current = root;
        TreeNode lastVisited = null;

        while (!stack.isEmpty() || current != null) {
            // Go to the leftmost node
            if (current != null) {
                stack.push(current);
                current = current.left;
            } else {
                // Check the top node without popping
                TreeNode peekNode = stack.peek();

                // If right child exists and hasn't been visited
                if (peekNode.right != null && peekNode.right != lastVisited) {
                    // Move to right subtree
                    current = peekNode.right;
                } else {
                    // Visit the node
                    result.add(peekNode.val);
                    lastVisited = stack.pop();
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) for all approaches, where n is the number of nodes in the tree. Each node is visited exactly once.

**Space Complexity:**

- Recursive: O(h) where h is the height of the tree (call stack depth). In the worst case (skewed tree), h = n, giving O(n).
- Two-stack iterative: O(n) since we store all nodes in the second stack.
- Single-stack iterative: O(h) where h is the tree height, same as recursive but without recursion overhead.

The space complexity difference matters for very deep trees where recursion might cause stack overflow.

## Common Mistakes

1. **Forgetting the null check:** Always check if the root is null at the beginning. An empty tree should return an empty list, not throw an error.

2. **Wrong order in iterative two-stack approach:** When pushing children to the first stack, you must push left then right (not right then left). This ensures that when we reverse using the second stack, we get the correct postorder.

3. **Infinite loop in single-stack approach:** Forgetting to track `last_visited` can cause infinite loops when a node's right child has been processed but we keep revisiting it. The `last_visited` pointer prevents reprocessing.

4. **Confusing postorder with preorder or inorder:** Remember the order:
   - Preorder: root → left → right
   - Inorder: left → root → right
   - Postorder: left → right → root
     A mnemonic: "Post" means after, so you process the root **after** its children.

## When You'll See This Pattern

Postorder traversal appears in problems where you need information from children before processing a parent node:

1. **Tree serialization/deserialization:** Some serialization formats use postorder.
2. **Expression tree evaluation:** In expression trees, you evaluate operands (children) before applying the operator (parent).
3. **Tree deletion:** To delete a tree, you must delete children before deleting the parent (to avoid memory leaks).
4. **Calculating subtree properties:** Problems like "Maximum Path Sum" or "Diameter of Binary Tree" often use postorder to compute subtree results before combining them at the parent.

Specific LeetCode problems:

- **Binary Tree Maximum Path Sum (Hard):** Uses postorder to compute maximum path sums in subtrees before combining at each node.
- **Diameter of Binary Tree (Easy):** Calculates heights of subtrees (postorder) to compute diameters.
- **Lowest Common Ancestor (Medium):** Postorder helps find LCA by checking if current node is ancestor of both target nodes.

## Key Takeaways

1. **Postorder = children before parent:** Whenever you need to process child nodes before their parent, think postorder traversal. This pattern is essential for bottom-up tree computations.

2. **Iterative solutions teach stack discipline:** Mastering the iterative postorder solution (especially the single-stack version) teaches you how to simulate recursion with explicit stacks, a valuable skill for many tree/graph problems.

3. **Multiple valid approaches:** Know both recursive and iterative solutions. Recursive is simpler to write, but iterative shows deeper understanding and handles edge cases like very deep trees.

Remember: Postorder traversal isn't just an academic exercise—it's a fundamental pattern for solving tree problems where parent nodes depend on results from their children.

Related problems: [Binary Tree Inorder Traversal](/problem/binary-tree-inorder-traversal), [N-ary Tree Postorder Traversal](/problem/n-ary-tree-postorder-traversal), [Minimum Fuel Cost to Report to the Capital](/problem/minimum-fuel-cost-to-report-to-the-capital)
