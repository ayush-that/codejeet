---
title: "Tree Traversal Patterns Every Candidate Should Know"
description: "Inorder, preorder, postorder, level-order — plus advanced patterns like Morris traversal and iterative approaches."
date: "2026-07-05"
category: "tips"
tags: ["trees", "binary trees", "BST", "traversal", "interview prep"]
---

Tree problems account for a significant portion of coding interview questions. Whether you are dealing with a BST, binary tree, or N-ary tree, the traversal patterns remain the same. Mastering them covers the majority of tree interview problems.

## The Four Standard Traversals

**Inorder (Left, Root, Right).** For a BST, this produces sorted order. Use it for problems requiring sorted processing: Validate Binary Search Tree, Kth Smallest Element in a BST, Convert BST to Greater Tree.

**Preorder (Root, Left, Right).** Processes the root before subtrees -- useful for serialization, tree copying, and reconstruction. Construct Binary Tree from Preorder and Inorder Traversal relies on this.

**Postorder (Left, Right, Root).** Processes children before parent -- the right choice when a node's answer depends on its subtrees. Maximum Depth of Binary Tree, Diameter of Binary Tree, and Balanced Binary Tree are all postorder.

**Level-Order (BFS).** Process nodes level by level using a queue. Use for anything involving levels: Binary Tree Level Order Traversal, Zigzag Level Order Traversal, Binary Tree Right Side View.

Let's look at the basic recursive implementations for these traversals.

<div class="code-group">

```python
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Traversals:
    def inorder(self, root):
        """Left, Root, Right"""
        result = []
        def dfs(node):
            if not node:
                return
            dfs(node.left)
            result.append(node.val)
            dfs(node.right)
        dfs(root)
        return result

    def preorder(self, root):
        """Root, Left, Right"""
        result = []
        def dfs(node):
            if not node:
                return
            result.append(node.val)
            dfs(node.left)
            dfs(node.right)
        dfs(root)
        return result

    def postorder(self, root):
        """Left, Right, Root"""
        result = []
        def dfs(node):
            if not node:
                return
            dfs(node.left)
            dfs(node.right)
            result.append(node.val)
        dfs(root)
        return result

    def levelorder(self, root):
        """BFS using a queue"""
        result = []
        if not root:
            return result
        from collections import deque
        queue = deque([root])
        while queue:
            level_size = len(queue)
            level = []
            for _ in range(level_size):
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            result.append(level)
        return result
```

```javascript
// Definition for a binary tree node.
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class Traversals {
  inorder(root) {
    /** Left, Root, Right */
    const result = [];
    function dfs(node) {
      if (!node) return;
      dfs(node.left);
      result.push(node.val);
      dfs(node.right);
    }
    dfs(root);
    return result;
  }

  preorder(root) {
    /** Root, Left, Right */
    const result = [];
    function dfs(node) {
      if (!node) return;
      result.push(node.val);
      dfs(node.left);
      dfs(node.right);
    }
    dfs(root);
    return result;
  }

  postorder(root) {
    /** Left, Right, Root */
    const result = [];
    function dfs(node) {
      if (!node) return;
      dfs(node.left);
      dfs(node.right);
      result.push(node.val);
    }
    dfs(root);
    return result;
  }

  levelorder(root) {
    /** BFS using a queue */
    const result = [];
    if (!root) return result;
    const queue = [root];
    while (queue.length > 0) {
      const levelSize = queue.length;
      const level = [];
      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift();
        level.push(node.val);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      result.push(level);
    }
    return result;
  }
}
```

```java
// Definition for a binary tree node.
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

import java.util.*;

class Traversals {
    // Inorder: Left, Root, Right
    public List<Integer> inorder(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        inorderHelper(root, result);
        return result;
    }
    private void inorderHelper(TreeNode node, List<Integer> result) {
        if (node == null) return;
        inorderHelper(node.left, result);
        result.add(node.val);
        inorderHelper(node.right, result);
    }

    // Preorder: Root, Left, Right
    public List<Integer> preorder(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        preorderHelper(root, result);
        return result;
    }
    private void preorderHelper(TreeNode node, List<Integer> result) {
        if (node == null) return;
        result.add(node.val);
        preorderHelper(node.left, result);
        preorderHelper(node.right, result);
    }

    // Postorder: Left, Right, Root
    public List<Integer> postorder(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        postorderHelper(root, result);
        return result;
    }
    private void postorderHelper(TreeNode node, List<Integer> result) {
        if (node == null) return;
        postorderHelper(node.left, result);
        postorderHelper(node.right, result);
        result.add(node.val);
    }

    // Level-order (BFS)
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            result.add(level);
        }
        return result;
    }
}
```

</div>

## Recursive vs Iterative

Recursive implementations are shorter and usually acceptable in interviews. Iterative implementations demonstrate deeper understanding.

**Iterative inorder:** Use a stack. Push all left children, pop and process, then move to the right child.

**Iterative preorder:** Push root to stack. Pop, process, push right then left child (so left is processed first).

**Iterative postorder:** The trickiest. One approach uses two stacks. Alternatively, use a single stack with a "last visited" pointer. If you struggle with this, implement recursive and mention the iterative trade-off.

Here are the iterative implementations for each traversal.

<div class="code-group">

```python
class IterativeTraversals:
    def inorder_iterative(self, root):
        """Iterative inorder using a stack."""
        result = []
        stack = []
        curr = root
        while curr or stack:
            # Go as far left as possible
            while curr:
                stack.append(curr)
                curr = curr.left
            # Process node
            curr = stack.pop()
            result.append(curr.val)
            # Move to right subtree
            curr = curr.right
        return result

    def preorder_iterative(self, root):
        """Iterative preorder using a stack."""
        result = []
        if not root:
            return result
        stack = [root]
        while stack:
            node = stack.pop()
            result.append(node.val)
            # Push right first, then left (so left is processed first)
            if node.right:
                stack.append(node.right)
            if node.left:
                stack.append(node.left)
        return result

    def postorder_iterative(self, root):
        """Iterative postorder using two stacks."""
        result = []
        if not root:
            return result
        stack1 = [root]
        stack2 = []
        while stack1:
            node = stack1.pop()
            stack2.append(node)
            # Push left then right to stack1
            if node.left:
                stack1.append(node.left)
            if node.right:
                stack1.append(node.right)
        # Process stack2 in reverse order
        while stack2:
            result.append(stack2.pop().val)
        return result

    def postorder_iterative_one_stack(self, root):
        """Iterative postorder using one stack and a last visited pointer."""
        result = []
        stack = []
        last_visited = None
        curr = root
        while curr or stack:
            if curr:
                stack.append(curr)
                curr = curr.left
            else:
                peek_node = stack[-1]
                # If right child exists and hasn't been visited, go right
                if peek_node.right and last_visited != peek_node.right:
                    curr = peek_node.right
                else:
                    # Process node
                    result.append(peek_node.val)
                    last_visited = stack.pop()
        return result
```

```javascript
class IterativeTraversals {
  inorderIterative(root) {
    /** Iterative inorder using a stack. */
    const result = [];
    const stack = [];
    let curr = root;
    while (curr || stack.length > 0) {
      // Go as far left as possible
      while (curr) {
        stack.push(curr);
        curr = curr.left;
      }
      // Process node
      curr = stack.pop();
      result.push(curr.val);
      // Move to right subtree
      curr = curr.right;
    }
    return result;
  }

  preorderIterative(root) {
    /** Iterative preorder using a stack. */
    const result = [];
    if (!root) return result;
    const stack = [root];
    while (stack.length > 0) {
      const node = stack.pop();
      result.push(node.val);
      // Push right first, then left (so left is processed first)
      if (node.right) stack.push(node.right);
      if (node.left) stack.push(node.left);
    }
    return result;
  }

  postorderIterative(root) {
    /** Iterative postorder using two stacks. */
    const result = [];
    if (!root) return result;
    const stack1 = [root];
    const stack2 = [];
    while (stack1.length > 0) {
      const node = stack1.pop();
      stack2.push(node);
      // Push left then right to stack1
      if (node.left) stack1.push(node.left);
      if (node.right) stack1.push(node.right);
    }
    // Process stack2 in reverse order
    while (stack2.length > 0) {
      result.push(stack2.pop().val);
    }
    return result;
  }

  postorderIterativeOneStack(root) {
    /** Iterative postorder using one stack and a last visited pointer. */
    const result = [];
    const stack = [];
    let lastVisited = null;
    let curr = root;
    while (curr || stack.length > 0) {
      if (curr) {
        stack.push(curr);
        curr = curr.left;
      } else {
        const peekNode = stack[stack.length - 1];
        // If right child exists and hasn't been visited, go right
        if (peekNode.right && lastVisited !== peekNode.right) {
          curr = peekNode.right;
        } else {
          // Process node
          result.push(peekNode.val);
          lastVisited = stack.pop();
        }
      }
    }
    return result;
  }
}
```

```java
import java.util.*;

class IterativeTraversals {
    // Iterative inorder using a stack
    public List<Integer> inorderIterative(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode curr = root;
        while (curr != null || !stack.isEmpty()) {
            // Go as far left as possible
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            // Process node
            curr = stack.pop();
            result.add(curr.val);
            // Move to right subtree
            curr = curr.right;
        }
        return result;
    }

    // Iterative preorder using a stack
    public List<Integer> preorderIterative(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            result.add(node.val);
            // Push right first, then left (so left is processed first)
            if (node.right != null) stack.push(node.right);
            if (node.left != null) stack.push(node.left);
        }
        return result;
    }

    // Iterative postorder using two stacks
    public List<Integer> postorderIterative(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        Stack<TreeNode> stack1 = new Stack<>();
        Stack<TreeNode> stack2 = new Stack<>();
        stack1.push(root);
        while (!stack1.isEmpty()) {
            TreeNode node = stack1.pop();
            stack2.push(node);
            // Push left then right to stack1
            if (node.left != null) stack1.push(node.left);
            if (node.right != null) stack1.push(node.right);
        }
        // Process stack2 in reverse order
        while (!stack2.isEmpty()) {
            result.add(stack2.pop().val);
        }
        return result;
    }

    // Iterative postorder using one stack and a last visited pointer
    public List<Integer> postorderIterativeOneStack(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode lastVisited = null;
        TreeNode curr = root;
        while (curr != null || !stack.isEmpty()) {
            if (curr != null) {
                stack.push(curr);
                curr = curr.left;
            } else {
                TreeNode peekNode = stack.peek();
                // If right child exists and hasn't been visited, go right
                if (peekNode.right != null && lastVisited != peekNode.right) {
                    curr = peekNode.right;
                } else {
                    // Process node
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

## Advanced Patterns

**Morris Traversal.** O(1) space by temporarily threading the tree. Rarely required but impressive to mention. Recover Binary Search Tree is one problem where it shines.

**DFS with state passing.** Many problems pass information downward (Path Sum passes a running total) or aggregate upward (Diameter of Binary Tree collects heights). Identifying the direction of information flow tells you whether to use preorder (downward) or postorder (upward).

**Binary Tree Maximum Path Sum** needs both directions: collect best single-branch paths from children (upward) while tracking the global maximum (combining both subtrees).

Let's examine a practical example of state passing with the "Path Sum" problem, which uses a preorder (top-down) approach, and the "Diameter of Binary Tree" problem, which uses a postorder (bottom-up) approach.

<div class="code-group">

```python
class AdvancedPatterns:
    # Path Sum: Preorder (top-down) state passing
    def hasPathSum(self, root, targetSum):
        """Returns true if the tree has a root-to-leaf path summing to targetSum."""
        def dfs(node, current_sum):
            if not node:
                return False
            current_sum += node.val
            # Check if it's a leaf node
            if not node.left and not node.right:
                return current_sum == targetSum
            # Recursively check left and right subtrees
            return dfs(node.left, current_sum) or dfs(node.right, current_sum)
        return dfs(root, 0)

    # Diameter of Binary Tree: Postorder (bottom-up) state passing
    def diameterOfBinaryTree(self, root):
        """Returns the length of the longest path between any two nodes."""
        self.diameter = 0
        def dfs(node):
            if not node:
                return 0
            # Get heights of left and right subtrees
            left_height = dfs(node.left)
            right_height = dfs(node.right)
            # Update diameter (path through current node)
            self.diameter = max(self.diameter, left_height + right_height)
            # Return height of current node
            return 1 + max(left_height, right_height)
        dfs(root)
        return self.diameter

    # Binary Tree Maximum Path Sum: Combines both directions
    def maxPathSum(self, root):
        """Returns the maximum path sum where a path can start and end at any node."""
        self.max_sum = float('-inf')
        def dfs(node):
            if not node:
                return 0
            # Get max single-branch sums from children (postorder)
            left_gain = max(dfs(node.left), 0)  # ignore negative branches
            right_gain = max(dfs(node.right), 0)
            # Update global max (path through current node)
            current_path_sum = node.val + left_gain + right_gain
            self.max_sum = max(self.max_sum, current_path_sum)
            # Return best single-branch contribution (upward)
            return node.val + max(left_gain, right_gain)
        dfs(root)
        return self.max_sum
```

```javascript
class AdvancedPatterns {
  // Path Sum: Preorder (top-down) state passing
  hasPathSum(root, targetSum) {
    /** Returns true if the tree has a root-to-leaf path summing to targetSum. */
    function dfs(node, currentSum) {
      if (!node) return false;
      currentSum += node.val;
      // Check if it's a leaf node
      if (!node.left && !node.right) {
        return currentSum === targetSum;
      }
      // Recursively check left and right subtrees
      return dfs(node.left, currentSum) || dfs(node.right, currentSum);
    }
    return dfs(root, 0);
  }

  // Diameter of Binary Tree: Postorder (bottom-up) state passing
  diameterOfBinaryTree(root) {
    /** Returns the length of the longest path between any two nodes. */
    let diameter = 0;
    function dfs(node) {
      if (!node) return 0;
      // Get heights of left and right subtrees
      const leftHeight = dfs(node.left);
      const rightHeight = dfs(node.right);
      // Update diameter (path through current node)
      diameter = Math.max(diameter, leftHeight + rightHeight);
      // Return height of current node
      return 1 + Math.max(leftHeight, rightHeight);
    }
    dfs(root);
    return diameter;
  }

  // Binary Tree Maximum Path Sum: Combines both directions
  maxPathSum(root) {
    /** Returns the maximum path sum where a path can start and end at any node. */
    let maxSum = -Infinity;
    function dfs(node) {
      if (!node) return 0;
      // Get max single-branch sums from children (postorder)
      const leftGain = Math.max(dfs(node.left), 0); // ignore negative branches
      const rightGain = Math.max(dfs(node.right), 0);
      // Update global max (path through current node)
      const currentPathSum = node.val + leftGain + rightGain;
      maxSum = Math.max(maxSum, currentPathSum);
      // Return best single-branch contribution (upward)
      return node.val + Math.max(leftGain, rightGain);
    }
    dfs(root);
    return maxSum;
  }
}
```

```java
class AdvancedPatterns {
    // Path Sum: Preorder (top-down) state passing
    public boolean hasPathSum(TreeNode root, int targetSum) {
        /** Returns true if the tree has a root-to-leaf path summing to targetSum. */
        return dfsPathSum(root, 0, targetSum);
    }
    private boolean dfsPathSum(TreeNode node, int currentSum, int targetSum) {
        if (node == null) return false;
        currentSum += node.val;
        // Check if it's a leaf node
        if (node.left == null && node.right == null) {
            return currentSum == targetSum;
        }
        // Recursively check left and right subtrees
        return dfsPathSum(node.left, currentSum, targetSum) ||
               dfsPathSum(node.right, currentSum, targetSum);
    }

    // Diameter of Binary Tree: Postorder (bottom-up) state passing
    private int diameter;
    public int diameterOfBinaryTree(TreeNode root) {
        /** Returns the length of the longest path between any two nodes. */
        diameter = 0;
        dfsDiameter(root);
        return diameter;
    }
    private int dfsDiameter(TreeNode node) {
        if (node == null) return 0;
        // Get heights of left and right subtrees
        int leftHeight = dfsDiameter(node.left);
        int rightHeight = dfsDiameter(node.right);
        // Update diameter (path through current node)
        diameter = Math.max(diameter, leftHeight + rightHeight);
        // Return height of current node
        return 1 + Math.max(leftHeight, rightHeight);
    }

    // Binary Tree Maximum Path Sum: Combines both directions
    private int maxSum;
    public int maxPathSum(TreeNode root) {
        /** Returns the maximum path sum where a path can start and end at any node. */
        maxSum = Integer.MIN_VALUE;
        dfsMaxPath(root);
        return maxSum;
    }
    private int dfsMaxPath(TreeNode node) {
        if (node == null) return 0;
        // Get max single-branch sums from children (postorder)
        int leftGain = Math.max(dfsMaxPath(node.left), 0); // ignore negative branches
        int rightGain = Math.max(dfsMaxPath(node.right), 0);
        // Update global max (path through current node)
        int currentPathSum = node.val + leftGain + rightGain;
        maxSum = Math.max(maxSum, currentPathSum);
        // Return best single-branch contribution (upward)
        return node.val + Math.max(leftGain, rightGain);
    }
}
```

</div>

## BST-Specific Patterns

The left < root < right property enables O(h) search, range-based validation (pass valid min/max ranges during traversal), and efficient LCA: if both targets are smaller than root, go left; if both larger, go right; otherwise, root is the LCA.

Let's implement key BST algorithms: validation, search, and finding the lowest common ancestor (LCA).

<div class="code-group">

```python
class BSTPatterns:
    # Validate BST using inorder traversal (iterative)
    def isValidBST(self, root):
        """Returns true if the tree is a valid BST."""
        stack = []
        prev = None
        curr = root
        while curr or stack:
            while curr:
                stack.append(curr)
                curr = curr.left
            curr = stack.pop()
            # Check inorder property
            if prev is not None and curr.val <= prev.val:
                return False
            prev = curr
            curr = curr.right
        return True

    # Validate BST using range-based DFS (recursive)
    def isValidBSTRange(self, root):
        """Alternative: pass valid min/max ranges."""
        def dfs(node, min_val, max_val):
            if not node:
                return True
            if not (min_val < node.val < max_val):
                return False
            return (dfs(node.left, min_val, node.val) and
                    dfs(node.right, node.val, max_val))
        return dfs(root, float('-inf'), float('inf'))

    # Search in a BST
    def searchBST(self, root, val):
        """Returns the subtree rooted at the node with value val."""
        curr = root
        while curr:
            if curr.val == val:
                return curr
            elif val < curr.val:
                curr = curr.left
            else:
                curr = curr.right
        return None

    # Lowest Common Ancestor in a BST
    def lowestCommonAncestor(self, root, p, q):
        """Returns the LCA of nodes p and q in a BST."""
        curr = root
        while curr:
            if p.val < curr.val and q.val < curr.val:
                curr = curr.left
            elif p.val > curr.val and q.val > curr.val:
                curr = curr.right
            else:
                return curr
        return None
```

```javascript
class BSTPatterns {
  // Validate BST using inorder traversal (iterative)
  isValidBST(root) {
    /** Returns true if the tree is a valid BST. */
    const stack = [];
    let prev = null;
    let curr = root;
    while (curr || stack.length > 0) {
      while (curr) {
        stack.push(curr);
        curr = curr.left;
      }
      curr = stack.pop();
      // Check inorder property
      if (prev !== null && curr.val <= prev.val) {
        return false;
      }
      prev = curr;
      curr = curr.right;
    }
    return true;
  }

  // Validate BST using range-based DFS (recursive)
  isValidBSTRange(root) {
    /** Alternative: pass valid min/max ranges. */
    function dfs(node, minVal, maxVal) {
      if (!node) return true;
      if (!(minVal < node.val && node.val < maxVal)) {
        return false;
      }
      return dfs(node.left, minVal, node.val) && dfs(node.right, node.val, maxVal);
    }
    return dfs(root, -Infinity, Infinity);
  }

  // Search in a BST
  searchBST(root, val) {
    /** Returns the subtree rooted at the node with value val. */
    let curr = root;
    while (curr) {
      if (curr.val === val) {
        return curr;
      } else if (val < curr.val) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }
    return null;
  }

  // Lowest Common Ancestor in a BST
  lowestCommonAncestor(root, p, q) {
    /** Returns the LCA of nodes p and q in a BST. */
    let curr = root;
    while (curr) {
      if (p.val < curr.val && q.val < curr.val) {
        curr = curr.left;
      } else if (p.val > curr.val && q.val > curr.val) {
        curr = curr.right;
      } else {
        return curr;
      }
    }
    return null;
  }
}
```

```java
class BSTPatterns {
    // Validate BST using inorder traversal (iterative)
    public boolean isValidBST(TreeNode root) {
        /** Returns true if the tree is a valid BST. */
        Stack<TreeNode> stack = new Stack<>();
        TreeNode prev = null;
        TreeNode curr = root;
        while (curr != null || !stack.isEmpty()) {
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            curr = stack.pop();
            // Check inorder property
            if (prev != null && curr.val <= prev.val) {
                return false;
            }
            prev = curr;
            curr = curr.right;
        }
        return true;
    }

    // Validate BST using range-based DFS (recursive)
    public boolean isValidBSTRange(TreeNode root) {
        /** Alternative: pass valid min/max ranges. */
        return dfsRange(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }
    private boolean dfsRange(TreeNode node, long minVal, long maxVal) {
        if (node == null) return true;
        if (!(minVal < node.val && node.val < maxVal)) {
            return false;
        }
        return dfsRange(node.left, minVal, node.val) &&
               dfsRange(node.right, node.val, maxVal);
    }

    // Search in a BST
    public TreeNode searchBST(TreeNode root, int val) {
        /** Returns the subtree rooted at the node with value val. */
        TreeNode curr = root;
        while (curr != null) {
            if (curr.val == val) {
                return curr;
            } else if (val < curr.val) {
                curr = curr.left;
            } else {
                curr = curr.right;
            }
        }
        return null;
    }

    // Lowest Common Ancestor in a BST
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        /** Returns the LCA of nodes p and q in a BST. */
        TreeNode curr = root;
        while (curr != null) {
            if (p.val < curr.val && q.val < curr.val) {
                curr = curr.left;
            } else if (p.val > curr.val && q.val > curr.val) {
                curr = curr.right;
            } else {
                return curr;
            }
        }
        return null;
    }
}
```

</div>

## Practice Problems

**Basic traversal:**

1. Binary Tree Inorder Traversal (recursive and iterative)
2. Binary Tree Level Order Traversal

**Depth and structure:** 3. Maximum Depth of Binary Tree 4. Balanced Binary Tree 5. Symmetric Tree

**Path problems:** 6. Path Sum 7. Binary Tree Maximum Path Sum 8. Diameter of Binary Tree

**BST problems:** 9. Validate Binary Search Tree 10. Kth Smallest Element in a BST 11. Lowest Common Ancestor of a BST

**Construction:** 12. Construct Binary Tree from Preorder and Inorder Traversal

To illustrate problem-solving, here's an implementation for "Construct Binary Tree from Preorder and Inorder Traversal," which combines preorder and inorder logic.

<div class="code-group">

```python
class TreeConstruction:
    def buildTree(self, preorder, inorder):
        """
        Constructs a binary tree from preorder and inorder traversal arrays.
        Preorder: Root, Left, Right
        Inorder: Left, Root, Right
        """
        # Map value to index in inorder for O(1) lookups
        inorder_index_map = {val: idx for idx, val in enumerate(inorder)}
        self.preorder_index = 0  # tracks current root in preorder

        def array_to_tree(left, right):
            if left > right:
                return None
            # Root is the next element in preorder
            root_val = preorder[self.preorder_index]
            root = TreeNode(root_val)
            self.preorder_index += 1
            # Split inorder array into left and right subtrees
            inorder_index = inorder_index_map[root_val]
            root.left = array_to_tree(left, inorder_index - 1)
            root.right = array_to_tree(inorder_index + 1, right)
            return root

        return array_to_tree(0, len(inorder) - 1)
```

```javascript
class TreeConstruction {
  buildTree(preorder, inorder) {
    /**
     * Constructs a binary tree from preorder and inorder traversal arrays.
     * Preorder: Root, Left, Right
     * Inorder: Left, Root, Right
     */
    // Map value to index in inorder for O(1) lookups
    const inorderIndexMap = {};
    inorder.forEach((val, idx) => (inorderIndexMap[val] = idx));
    let preorderIndex = 0; // tracks current root in preorder

    const arrayToTree = (left, right) => {
      if (left > right) return null;
      // Root is the next element in preorder
      const rootVal = preorder[preorderIndex];
      const root = new TreeNode(rootVal);
      preorderIndex++;
      // Split inorder array into left and right subtrees
      const inorderIndex = inorderIndexMap[rootVal];
      root.left = arrayToTree(left, inorderIndex - 1);
      root.right = arrayToTree(inorderIndex + 1, right);
      return root;
    };

    return arrayToTree(0, inorder.length - 1);
  }
}
```

```java
class TreeConstruction {
    private int preorderIndex;
    private Map<Integer, Integer> inorderIndexMap;
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        /**
         * Constructs a binary tree from preorder and inorder traversal arrays.
         * Preorder: Root, Left, Right
         * Inorder: Left, Root, Right
         */
        preorderIndex = 0;
        // Map value to index in inorder for O(1) lookups
        inorderIndexMap = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) {
            inorderIndexMap.put(inorder[i], i);
        }
        return arrayToTree(preorder, 0, inorder.length - 1);
    }
    private TreeNode arrayToTree(int[] preorder, int left, int right) {
        if (left > right) return null;
        // Root is the next element in preorder
        int rootVal = preorder[preorderIndex];
        TreeNode root = new TreeNode(rootVal);
        preorderIndex++;
        // Split inorder array into left and right subtrees
        int inorderIndex = inorderIndexMap.get(rootVal);
        root.left = arrayToTree(preorder, left, inorderIndex - 1);
        root.right = arrayToTree(preorder, inorderIndex + 1, right);
        return root;
    }
}
```

</div>

Check the [trees topic page](/topic/tree) on CodeJeet. Tree questions are favorites at [Google](/company/google), [Amazon](/company/amazon), and [Microsoft](/company/microsoft).

When you see a tree problem, ask: "Do I need info from children (postorder) or from the parent (preorder)? Is order relevant (inorder for BST)? Is it level-based (BFS)?" This question points you to the right traversal within seconds.
