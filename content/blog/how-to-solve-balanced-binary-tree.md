---
title: "How to Solve Balanced Binary Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Balanced Binary Tree. Easy difficulty, 57.9% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2026-04-30"
category: "dsa-patterns"
tags: ["balanced-binary-tree", "tree", "depth-first-search", "binary-tree", "easy"]
---

# How to Solve Balanced Binary Tree

A balanced binary tree is one where the heights of the two child subtrees of every node differ by no more than one. While the definition is simple, the challenge lies in efficiently checking this property for every node in the tree without redundant calculations. This problem is interesting because it requires combining tree traversal with state propagation—a pattern that appears in many tree problems.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this tree:

```
        1
       / \
      2   3
     / \
    4   5
```

We need to check if every node's left and right subtree heights differ by ≤ 1.

**Step 1:** Start at node 4 (leaf). Its left and right heights are both 0 (or -1 depending on convention). Difference = 0. Balanced.

**Step 2:** Node 5 (leaf). Same as node 4. Balanced.

**Step 3:** Node 2. Left subtree (node 4) height = 1, right subtree (node 5) height = 1. Difference = 0. Balanced.

**Step 4:** Node 3 (leaf). Balanced.

**Step 5:** Root node 1. Left subtree (rooted at 2) height = 2, right subtree (rooted at 3) height = 1. Difference = 1. Balanced.

Since all nodes are balanced, the entire tree is balanced.

Now consider an unbalanced tree:

```
        1
       / \
      2   3
     / \
    4   5
   /
  6
```

**Step 1-4:** Same as before for nodes 4, 5, 2, 3.

**Step 5:** Node 4 now has left child 6. Node 6 is a leaf (balanced).

**Step 6:** Recalculate node 4: left height = 1, right height = 0. Difference = 1. Still balanced.

**Step 7:** Recalculate node 2: left height = 2 (node 4's subtree), right height = 1 (node 5). Difference = 1. Still balanced.

**Step 8:** Root node 1: left height = 3, right height = 1. Difference = 2. **Unbalanced!**

The key insight: we need both the height information AND the balanced status from each subtree to make decisions at parent nodes.

## Brute Force Approach

A naive approach would be to write a `height()` function that calculates the height of a subtree, then check at each node:

1. Calculate left subtree height
2. Calculate right subtree height
3. Check if difference ≤ 1
4. Recursively check if left and right subtrees are balanced

The problem? This leads to O(n²) time complexity in the worst case (like a skewed tree). For each node, we're calculating heights repeatedly by traversing its entire subtree. Here's what that looks like:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n) for recursion stack
def isBalanced(root):
    if not root:
        return True

    # Calculate heights from scratch each time
    left_height = height(root.left)
    right_height = height(root.right)

    # Check current node and recurse
    return (abs(left_height - right_height) <= 1 and
            isBalanced(root.left) and
            isBalanced(root.right))

def height(node):
    if not node:
        return 0
    return 1 + max(height(node.left), height(node.right))
```

```javascript
// Time: O(n²) | Space: O(n) for recursion stack
function isBalanced(root) {
  if (!root) return true;

  // Calculate heights from scratch each time
  const leftHeight = height(root.left);
  const rightHeight = height(root.right);

  // Check current node and recurse
  return Math.abs(leftHeight - rightHeight) <= 1 && isBalanced(root.left) && isBalanced(root.right);
}

function height(node) {
  if (!node) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}
```

```java
// Time: O(n²) | Space: O(n) for recursion stack
public boolean isBalanced(TreeNode root) {
    if (root == null) return true;

    // Calculate heights from scratch each time
    int leftHeight = height(root.left);
    int rightHeight = height(root.right);

    // Check current node and recurse
    return Math.abs(leftHeight - rightHeight) <= 1 &&
           isBalanced(root.left) &&
           isBalanced(root.right);
}

private int height(TreeNode node) {
    if (node == null) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
}
```

</div>

This brute force approach is inefficient because `height()` is called repeatedly on the same nodes. For example, when checking the root, we calculate the height of the entire left subtree. Then when checking the left child, we recalculate the height of parts of that same subtree again.

## Optimal Solution

The optimal solution uses a single post-order traversal (bottom-up) that returns both the height and balanced status. We can use a special sentinel value (like -1) to indicate an unbalanced subtree, which allows us to propagate the failure upward immediately.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for recursion stack (worst case skewed tree)
def isBalanced(root):
    """
    Main function that checks if the entire tree is balanced.
    """
    # The helper returns height if balanced, -1 if unbalanced
    return checkHeight(root) != -1

def checkHeight(node):
    """
    Returns the height of the subtree if balanced, otherwise -1.
    This combines height calculation with balance checking.
    """
    # Base case: empty node has height 0
    if not node:
        return 0

    # Recursively check left subtree
    left_height = checkHeight(node.left)
    # If left subtree is unbalanced, propagate -1 upward immediately
    if left_height == -1:
        return -1

    # Recursively check right subtree
    right_height = checkHeight(node.right)
    # If right subtree is unbalanced, propagate -1 upward immediately
    if right_height == -1:
        return -1

    # Check if current node is balanced
    # If height difference > 1, this subtree is unbalanced
    if abs(left_height - right_height) > 1:
        return -1

    # Current node is balanced, return its height
    # Height = 1 + max of child heights
    return 1 + max(left_height, right_height)
```

```javascript
// Time: O(n) | Space: O(n) for recursion stack (worst case skewed tree)
function isBalanced(root) {
  /**
   * Main function that checks if the entire tree is balanced.
   */
  // The helper returns height if balanced, -1 if unbalanced
  return checkHeight(root) !== -1;
}

function checkHeight(node) {
  /**
   * Returns the height of the subtree if balanced, otherwise -1.
   * This combines height calculation with balance checking.
   */
  // Base case: empty node has height 0
  if (!node) return 0;

  // Recursively check left subtree
  const leftHeight = checkHeight(node.left);
  // If left subtree is unbalanced, propagate -1 upward immediately
  if (leftHeight === -1) return -1;

  // Recursively check right subtree
  const rightHeight = checkHeight(node.right);
  // If right subtree is unbalanced, propagate -1 upward immediately
  if (rightHeight === -1) return -1;

  // Check if current node is balanced
  // If height difference > 1, this subtree is unbalanced
  if (Math.abs(leftHeight - rightHeight) > 1) return -1;

  // Current node is balanced, return its height
  // Height = 1 + max of child heights
  return 1 + Math.max(leftHeight, rightHeight);
}
```

```java
// Time: O(n) | Space: O(n) for recursion stack (worst case skewed tree)
public boolean isBalanced(TreeNode root) {
    /**
     * Main function that checks if the entire tree is balanced.
     */
    // The helper returns height if balanced, -1 if unbalanced
    return checkHeight(root) != -1;
}

private int checkHeight(TreeNode node) {
    /**
     * Returns the height of the subtree if balanced, otherwise -1.
     * This combines height calculation with balance checking.
     */
    // Base case: empty node has height 0
    if (node == null) return 0;

    // Recursively check left subtree
    int leftHeight = checkHeight(node.left);
    // If left subtree is unbalanced, propagate -1 upward immediately
    if (leftHeight == -1) return -1;

    // Recursively check right subtree
    int rightHeight = checkHeight(node.right);
    // If right subtree is unbalanced, propagate -1 upward immediately
    if (rightHeight == -1) return -1;

    // Check if current node is balanced
    // If height difference > 1, this subtree is unbalanced
    if (Math.abs(leftHeight - rightHeight) > 1) return -1;

    // Current node is balanced, return its height
    // Height = 1 + max of child heights
    return 1 + Math.max(leftHeight, rightHeight);
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the tree. Each node is visited exactly once in the post-order traversal. The early return when an unbalanced subtree is found doesn't improve the worst-case (when the tree is balanced), but it does optimize the best-case (when imbalance is near the top).

**Space Complexity:** O(n) in the worst case for the recursion stack. This occurs when the tree is completely skewed (like a linked list). In a balanced tree, the space complexity would be O(log n) due to the height of the recursion stack.

## Common Mistakes

1. **Only checking the root node's balance:** Some candidates check if the root's left and right subtrees have similar heights, but forget to verify that every subtree is also balanced. A tree can have a balanced root but unbalanced subtrees deeper down.

2. **Using the brute force O(n²) approach:** This is the most common mistake. Candidates separate height calculation from balance checking, leading to repeated traversals. Always look for ways to combine computations in a single traversal.

3. **Incorrect height calculation for empty trees:** There are two conventions: height of an empty tree can be 0 or -1. Using -1 makes the math work nicely (height = 1 + max(left, right)), but using 0 is more intuitive. Be consistent and adjust the balance check accordingly.

4. **Forgetting to propagate unbalanced status upward:** When you detect an unbalanced subtree, you must immediately return a failure indicator (-1 in our solution). If you continue checking other nodes, you waste computation and might miss the early exit optimization.

## When You'll See This Pattern

This "bottom-up with state propagation" pattern appears in many tree problems where you need to compute something that depends on child results:

1. **Maximum Depth of Binary Tree (Easy):** Very similar—you return the height from children and compute 1 + max(left, right). This is actually a simpler version of our problem.

2. **Diameter of Binary Tree (Easy):** Requires tracking both height and diameter. You compute heights bottom-up while calculating the diameter as left_height + right_height at each node.

3. **Validate Binary Search Tree (Medium):** Requires passing min/max constraints downward and validation results upward. Similar state propagation but with constraints flowing downward instead of upward.

4. **Binary Tree Maximum Path Sum (Hard):** Requires tracking both the best path through a node and the best single branch from a node—another example of returning multiple pieces of information from recursion.

## Key Takeaways

1. **Combine related computations:** When you need to compute multiple related properties (like height and balance status), do them in a single traversal rather than separate ones. This often turns O(n²) into O(n).

2. **Use sentinel values for early termination:** Returning a special value (like -1) to indicate failure allows you to propagate problems upward immediately, avoiding unnecessary computation.

3. **Post-order traversal is natural for bottom-up computation:** When you need information from children to compute something at the parent, post-order (left, right, process) is usually the right approach.

Related problems: [Maximum Depth of Binary Tree](/problem/maximum-depth-of-binary-tree), [K-th Largest Perfect Subtree Size in Binary Tree](/problem/k-th-largest-perfect-subtree-size-in-binary-tree), [Check Balanced String](/problem/check-balanced-string)
