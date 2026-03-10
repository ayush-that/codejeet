---
title: "How to Solve Count Complete Tree Nodes — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Complete Tree Nodes. Easy difficulty, 72.1% acceptance rate. Topics: Binary Search, Bit Manipulation, Tree, Binary Tree."
date: "2026-09-16"
category: "dsa-patterns"
tags: ["count-complete-tree-nodes", "binary-search", "bit-manipulation", "tree", "easy"]
---

# How to Solve Count Complete Tree Nodes

At first glance, counting nodes in a binary tree seems trivial: just traverse the entire tree and count. But here's the twist: we're told the tree is **complete**, which means every level except possibly the last is completely filled, and all nodes in the last level are as far left as possible. This special structure allows us to do much better than O(n) time complexity. The challenge is leveraging the completeness property to avoid visiting every single node.

## Visual Walkthrough

Let's trace through a complete binary tree with 6 nodes:

```
       1
     /   \
    2     3
   / \   /
  4   5 6
```

**Brute force approach:** We'd visit all 6 nodes (1→2→4→5→3→6) and count them. That's O(n).

**Optimized approach using completeness:**

1. First, check if the tree is a **perfect** binary tree (all levels completely filled)
   - Left subtree height: from node 1, go left to 2, then left to 4 → height = 3
   - Right subtree height: from node 1, go right to 3, then right → null → height = 2
   - Heights differ, so it's not perfect

2. Since it's not perfect, we know the last level is partially filled
   - Count nodes in left subtree (rooted at 2): It's perfect! Left height = 2, right height = 2
   - Perfect subtree with height 2 has 2² - 1 = 3 nodes
   - Count nodes in right subtree (rooted at 3): Recursively apply same logic

3. Total = 1 (root) + 3 (left perfect subtree) + [count in right subtree]

The key insight: for complete trees, either the left or right subtree will be perfect at each step, letting us skip counting many nodes directly.

## Brute Force Approach

The most straightforward solution is to perform any tree traversal (DFS or BFS) and count all nodes:

<div class="code-group">

```python
# Time: O(n) | Space: O(h) where h is tree height
def countNodes(root):
    if not root:
        return 0
    return 1 + countNodes(root.left) + countNodes(root.right)
```

```javascript
// Time: O(n) | Space: O(h) where h is tree height
function countNodes(root) {
  if (!root) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}
```

```java
// Time: O(n) | Space: O(h) where h is tree height
public int countNodes(TreeNode root) {
    if (root == null) return 0;
    return 1 + countNodes(root.left) + countNodes(root.right);
}
```

</div>

**Why this isn't optimal:** This approach visits every single node, taking O(n) time. For a complete binary tree with n nodes, the height is O(log n), but we're not leveraging the completeness property at all. We can do better by using the fact that complete trees have predictable structure.

## Optimal Solution

The optimal approach combines binary search with the completeness property. At each node, we calculate the height of the leftmost and rightmost paths. If they're equal, the subtree is perfect and we can compute its node count directly using the formula 2^h - 1. Otherwise, we recursively count the left and right subtrees.

<div class="code-group">

```python
# Time: O(log² n) | Space: O(log n)
def countNodes(root):
    """
    Count nodes in a complete binary tree efficiently.
    """
    if not root:
        return 0

    # Calculate left height by going all the way left
    left_height = 0
    node = root
    while node:
        left_height += 1
        node = node.left

    # Calculate right height by going all the way right
    right_height = 0
    node = root
    while node:
        right_height += 1
        node = node.right

    # If left and right heights are equal, this is a perfect subtree
    if left_height == right_height:
        # A perfect binary tree of height h has 2^h - 1 nodes
        return (1 << left_height) - 1  # Equivalent to 2^left_height - 1

    # Otherwise, recursively count left and right subtrees
    # One of them will be perfect at each recursive step
    return 1 + countNodes(root.left) + countNodes(root.right)
```

```javascript
// Time: O(log² n) | Space: O(log n)
function countNodes(root) {
  /**
   * Count nodes in a complete binary tree efficiently.
   */
  if (!root) return 0;

  // Calculate left height by traversing left child pointers
  let leftHeight = 0;
  let node = root;
  while (node) {
    leftHeight++;
    node = node.left;
  }

  // Calculate right height by traversing right child pointers
  let rightHeight = 0;
  node = root;
  while (node) {
    rightHeight++;
    node = node.right;
  }

  // If heights match, we have a perfect binary tree
  if (leftHeight === rightHeight) {
    // Perfect tree node count formula: 2^h - 1
    return Math.pow(2, leftHeight) - 1;
  }

  // Otherwise, count recursively (one subtree will be perfect)
  return 1 + countNodes(root.left) + countNodes(root.right);
}
```

```java
// Time: O(log² n) | Space: O(log n)
public int countNodes(TreeNode root) {
    /**
     * Count nodes in a complete binary tree efficiently.
     */
    if (root == null) return 0;

    // Find left subtree height
    int leftHeight = 0;
    TreeNode node = root;
    while (node != null) {
        leftHeight++;
        node = node.left;
    }

    // Find right subtree height
    int rightHeight = 0;
    node = root;
    while (node != null) {
        rightHeight++;
        node = node.right;
    }

    // If it's a perfect binary tree, use formula
    if (leftHeight == rightHeight) {
        // 2^leftHeight - 1 using bit shift for efficiency
        return (1 << leftHeight) - 1;
    }

    // Otherwise, count recursively
    return 1 + countNodes(root.left) + countNodes(root.right);
}
```

</div>

**How it works:** At each recursive call, we check if the current subtree is perfect by comparing the leftmost and rightmost path lengths. If perfect, we immediately know the count (2^h - 1). If not perfect, we know the last level is partially filled, so we recursively count the two child subtrees. The key insight is that in a complete tree, at least one of these child subtrees will be perfect at each step.

## Complexity Analysis

**Time Complexity: O(log² n)**

- At each recursive step, we compute two heights which takes O(log n) time each (tree height)
- We make O(log n) recursive calls because each call goes one level deeper
- Total: O(log n) × O(log n) = O(log² n)

**Space Complexity: O(log n)**

- This is the recursion stack depth, which equals the tree height
- For a complete binary tree with n nodes, height is O(log n)

**Why this beats O(n):** For n = 1,000,000 nodes:

- Brute force: ~1,000,000 operations
- Optimized: ~(log₂ 1,000,000)² ≈ (20)² = 400 operations

## Common Mistakes

1. **Forgetting the tree is complete:** Some candidates try to apply this algorithm to non-complete trees, which won't work. The algorithm relies on the property that in a complete tree, if the leftmost and rightmost heights differ, then the last level is partially filled only on the left side.

2. **Incorrect height calculation:** The height here is the number of nodes from root to leaf along a path, not the number of edges. If you count edges instead of nodes, your perfect tree calculation (2^h - 1) will be off by one.

3. **Not using bit shifting for powers of 2:** While `2**h` or `Math.pow(2, h)` works, using `1 << h` is more efficient and avoids floating-point issues for large h. This is especially important in Java where `Math.pow` returns a double.

4. **Missing the base case:** Always check for `root == null` first. An empty tree has 0 nodes, not 1.

## When You'll See This Pattern

This "height comparison + binary search" pattern appears in several tree problems:

1. **Check Completeness of a Binary Tree (LeetCode 958)** - Uses similar height and level-filling logic to verify if a tree is complete.

2. **Maximum Depth of Binary Tree (LeetCode 104)** - While simpler, it teaches the recursive height calculation that's foundational here.

3. **Balanced Binary Tree (LeetCode 110)** - Compares heights of left and right subtrees to check balance, similar to our height comparison step.

The core technique of using structural properties to avoid visiting all nodes appears in many optimized tree algorithms, especially when trees have special properties (BST, complete, perfect, etc.).

## Key Takeaways

1. **Leverage structural constraints:** When a problem gives you a special data structure property (like "complete binary tree"), look for ways to use that property to optimize beyond the generic solution.

2. **Perfect tree formula is powerful:** A perfect binary tree of height h has exactly 2^h - 1 nodes. This lets you compute counts in O(1) instead of O(n).

3. **Divide and conquer with early exits:** The algorithm recursively divides the problem, but with an early exit when it encounters a perfect subtree. This pattern of "check if simple case applies, otherwise divide" is common in optimization problems.

Remember: interviewers love when you start with the brute force solution, explain why it's insufficient, then derive the optimized solution by leveraging the problem's constraints.

Related problems: [Closest Binary Search Tree Value](/problem/closest-binary-search-tree-value)
