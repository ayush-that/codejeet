---
title: "How to Solve Maximum Depth of Binary Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Depth of Binary Tree. Easy difficulty, 77.9% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2026-02-25"
category: "dsa-patterns"
tags: ["maximum-depth-of-binary-tree", "tree", "depth-first-search", "breadth-first-search", "easy"]
---

# How to Solve Maximum Depth of Binary Tree

Finding the maximum depth of a binary tree is a foundational tree traversal problem that tests your understanding of recursion, depth-first search, and breadth-first search. While conceptually simple, it's tricky because you need to correctly handle the recursive nature of trees and understand how to propagate depth information back up the tree. This problem appears in interviews frequently because it's a gateway to more complex tree problems.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this binary tree:

```
        3
       / \
      9   20
         /  \
        15   7
```

We want to find the longest path from root to leaf. Let's trace the recursive approach:

1. **Root node (3)**: We need the maximum depth of its left and right subtrees
2. **Left child (9)**: This is a leaf node (no children), so its depth is 1
3. **Right child (20)**: Not a leaf - we need depths of its children
4. **Left child of 20 (15)**: Leaf node, depth = 1
5. **Right child of 20 (7)**: Leaf node, depth = 1
6. **Back to node 20**: max(1, 1) + 1 = 2
7. **Back to root (3)**: max(1, 2) + 1 = 3

The maximum depth is 3, which corresponds to the path 3 → 20 → 7 (or 3 → 20 → 15).

## Brute Force Approach

For tree problems, there's rarely a true "brute force" in the sense of trying all possible combinations, since trees have a natural recursive structure. However, a naive approach might involve:

1. Generating all possible paths from root to leaves
2. Counting the nodes in each path
3. Returning the maximum count

This approach would require exploring every path anyway, which is exactly what we need to do for the optimal solution. The real "brute force" thinking here would be to use an inefficient implementation, like:

- Using extra data structures unnecessarily
- Making multiple passes over the tree
- Not using recursion properly

The key insight is that we must visit every node at least once to determine the maximum depth, so any optimal solution will be O(n) time complexity.

## Optimal Solution

We have two optimal approaches: Depth-First Search (DFS) using recursion, and Breadth-First Search (BFS) using iteration with a queue.

### Approach 1: Recursive DFS (Most Elegant)

The recursive solution leverages the definition of maximum depth: the depth of a node is 1 plus the maximum depth of its left and right subtrees. The base case is when we reach a null node (depth 0).

<div class="code-group">

```python
# Time: O(n) where n is number of nodes - we visit each node once
# Space: O(h) where h is tree height - recursion stack uses space proportional to height
def maxDepth(root):
    """
    Calculate maximum depth of binary tree using recursive DFS.

    Args:
        root: TreeNode - root of the binary tree

    Returns:
        int: maximum depth of the tree
    """
    # Base case: if node is None, depth is 0
    if root is None:
        return 0

    # Recursively find depth of left subtree
    left_depth = maxDepth(root.left)

    # Recursively find depth of right subtree
    right_depth = maxDepth(root.right)

    # Depth of current node is 1 + max of children's depths
    return 1 + max(left_depth, right_depth)
```

```javascript
// Time: O(n) where n is number of nodes - we visit each node once
// Space: O(h) where h is tree height - recursion stack uses space proportional to height
function maxDepth(root) {
  /**
   * Calculate maximum depth of binary tree using recursive DFS.
   *
   * @param {TreeNode} root - root of the binary tree
   * @return {number} maximum depth of the tree
   */
  // Base case: if node is null, depth is 0
  if (root === null) {
    return 0;
  }

  // Recursively find depth of left subtree
  const leftDepth = maxDepth(root.left);

  // Recursively find depth of right subtree
  const rightDepth = maxDepth(root.right);

  // Depth of current node is 1 + max of children's depths
  return 1 + Math.max(leftDepth, rightDepth);
}
```

```java
// Time: O(n) where n is number of nodes - we visit each node once
// Space: O(h) where h is tree height - recursion stack uses space proportional to height
public int maxDepth(TreeNode root) {
    /**
     * Calculate maximum depth of binary tree using recursive DFS.
     *
     * @param root - root of the binary tree
     * @return maximum depth of the tree
     */
    // Base case: if node is null, depth is 0
    if (root == null) {
        return 0;
    }

    // Recursively find depth of left subtree
    int leftDepth = maxDepth(root.left);

    // Recursively find depth of right subtree
    int rightDepth = maxDepth(root.right);

    // Depth of current node is 1 + max of children's depths
    return 1 + Math.max(leftDepth, rightDepth);
}
```

</div>

### Approach 2: Iterative BFS (Level Order Traversal)

We can also solve this using BFS by counting how many levels we traverse. Each level corresponds to one unit of depth.

<div class="code-group">

```python
# Time: O(n) where n is number of nodes - we visit each node once
# Space: O(w) where w is maximum width of tree - queue stores nodes at each level
def maxDepthBFS(root):
    """
    Calculate maximum depth using iterative BFS (level order traversal).

    Args:
        root: TreeNode - root of the binary tree

    Returns:
        int: maximum depth of the tree
    """
    # Handle empty tree
    if root is None:
        return 0

    depth = 0
    queue = [root]  # Initialize queue with root node

    while queue:
        # Increment depth for current level
        depth += 1

        # Process all nodes at current level
        level_size = len(queue)
        for _ in range(level_size):
            # Remove node from front of queue
            node = queue.pop(0)

            # Add children to queue for next level
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

    return depth
```

```javascript
// Time: O(n) where n is number of nodes - we visit each node once
// Space: O(w) where w is maximum width of tree - queue stores nodes at each level
function maxDepthBFS(root) {
  /**
   * Calculate maximum depth using iterative BFS (level order traversal).
   *
   * @param {TreeNode} root - root of the binary tree
   * @return {number} maximum depth of the tree
   */
  // Handle empty tree
  if (root === null) {
    return 0;
  }

  let depth = 0;
  const queue = [root]; // Initialize queue with root node

  while (queue.length > 0) {
    // Increment depth for current level
    depth++;

    // Process all nodes at current level
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      // Remove node from front of queue
      const node = queue.shift();

      // Add children to queue for next level
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
  }

  return depth;
}
```

```java
// Time: O(n) where n is number of nodes - we visit each node once
// Space: O(w) where w is maximum width of tree - queue stores nodes at each level
public int maxDepthBFS(TreeNode root) {
    /**
     * Calculate maximum depth using iterative BFS (level order traversal).
     *
     * @param root - root of the binary tree
     * @return maximum depth of the tree
     */
    // Handle empty tree
    if (root == null) {
        return 0;
    }

    int depth = 0;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);  // Initialize queue with root node

    while (!queue.isEmpty()) {
        // Increment depth for current level
        depth++;

        // Process all nodes at current level
        int levelSize = queue.size();
        for (int i = 0; i < levelSize; i++) {
            // Remove node from front of queue
            TreeNode node = queue.poll();

            // Add children to queue for next level
            if (node.left != null) {
                queue.offer(node.left);
            }
            if (node.right != null) {
                queue.offer(node.right);
            }
        }
    }

    return depth;
}
```

</div>

## Complexity Analysis

### Recursive DFS Solution:

- **Time Complexity**: O(n) where n is the number of nodes. We visit each node exactly once.
- **Space Complexity**: O(h) where h is the height of the tree. In the worst case (skewed tree), h = n, so O(n). In the best case (balanced tree), h = log(n), so O(log n). This space is used by the recursion call stack.

### Iterative BFS Solution:

- **Time Complexity**: O(n) where n is the number of nodes. We visit each node exactly once.
- **Space Complexity**: O(w) where w is the maximum width of the tree (maximum number of nodes at any level). In the worst case (complete binary tree), the last level has ~n/2 nodes, so O(n). In the best case (skewed tree), w = 1, so O(1).

Both approaches have the same time complexity but different space characteristics. DFS is generally preferred for this problem due to its simplicity, unless the tree is very deep and could cause stack overflow.

## Common Mistakes

1. **Forgetting the base case for null nodes**: Many candidates forget to handle the case where `root` is `None`/`null`. This causes null pointer exceptions or incorrect results. Always check for empty tree first.

2. **Adding 1 in the wrong place**: Some candidates write `max(1 + leftDepth, 1 + rightDepth)` instead of `1 + max(leftDepth, rightDepth)`. While mathematically equivalent, the former is less clear and could lead to off-by-one errors in more complex variations.

3. **Confusing depth definitions**: The problem defines depth as "number of nodes along the path." Some candidates count edges instead of nodes. For a single node tree, depth should be 1 (not 0). Always verify with the example: a tree with only root has depth 1.

4. **Inefficient BFS implementation**: In the BFS approach, candidates sometimes forget to track level boundaries, leading to incorrect depth counting. Always use the `levelSize` pattern to process one level at a time.

## When You'll See This Pattern

The recursive DFS pattern used here appears in many tree problems:

1. **Balanced Binary Tree (LeetCode 110)**: Uses the same depth calculation but adds a balance check at each node. You need to compare depths of left and right subtrees.

2. **Diameter of Binary Tree (LeetCode 543)**: Builds on depth calculation - the diameter at a node is the sum of left and right depths. You calculate depth while tracking maximum diameter.

3. **Maximum Depth of N-ary Tree (LeetCode 559)**: Same concept but generalized to trees where nodes can have more than 2 children. Instead of `max(left, right)`, you take `max` over all children.

4. **Minimum Depth of Binary Tree (LeetCode 111)**: Similar structure but with a twist - you need to handle cases where one subtree is empty differently.

The pattern is: for tree problems where the solution for a node depends on solutions for its children, think recursion with a base case at null/leaf nodes.

## Key Takeaways

1. **Tree problems often have natural recursive solutions**: When a problem asks about tree properties (depth, height, balance), think about defining the property recursively in terms of children.

2. **DFS vs BFS trade-offs**: DFS (recursive) is simpler for depth-related problems and uses O(h) space. BFS (iterative) is better for level-related operations and uses O(w) space. Know when to use each.

3. **Base cases matter**: Always handle empty trees (null root) and leaf nodes properly. Test your solution on edge cases: empty tree, single node, skewed tree.

4. **This is a building block**: Maximum depth is a fundamental operation that appears as a subroutine in more complex tree algorithms. Master it thoroughly.

Related problems: [Balanced Binary Tree](/problem/balanced-binary-tree), [Minimum Depth of Binary Tree](/problem/minimum-depth-of-binary-tree), [Maximum Depth of N-ary Tree](/problem/maximum-depth-of-n-ary-tree)
