---
title: "How to Solve Path Sum — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Path Sum. Easy difficulty, 54.5% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2026-05-24"
category: "dsa-patterns"
tags: ["path-sum", "tree", "depth-first-search", "breadth-first-search", "easy"]
---

# How to Solve Path Sum

Given a binary tree and a target sum, determine if there exists a root-to-leaf path where the sum of node values equals the target. The key challenge is recognizing that we must check **complete paths** from root to leaf—not partial paths—and that we need to traverse the tree efficiently while tracking the running sum.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this tree:

```
      5
     / \
    4   8
   /   / \
  11  13  4
 /  \      \
7    2      1
```

**Target sum: 22**

We need to check if any path from root to leaf sums to 22. Let's follow the DFS approach:

1. **Start at root (5)**: Current sum = 5
2. **Go left to 4**: Current sum = 5 + 4 = 9
3. **Go left to 11**: Current sum = 9 + 11 = 20
4. **Go left to 7 (leaf)**: Current sum = 20 + 7 = 27 ≠ 22
5. **Backtrack to 11**, then **go right to 2 (leaf)**: Current sum = 20 + 2 = 22 ✓ Found!

The path is 5 → 4 → 11 → 2, which sums to 22. Notice we only check at leaf nodes—intermediate nodes don't count as complete paths.

## Brute Force Approach

A truly brute force approach would be to generate all root-to-leaf paths, sum each one, and check if any equals the target. While this would work, it's inefficient because we'd store all paths before checking them.

What candidates often try (and fail with) is checking partial paths at every node, not just leaves. For example, they might return `true` when reaching node 11 with sum 20, thinking they've found a valid path, but 11 isn't a leaf! The problem specifically requires **root-to-leaf** paths.

The correct approach is DFS with backtracking: traverse while maintaining a running sum, and only check for success when we reach a leaf node.

## Optimal Solution

We use DFS (Depth-First Search) with recursion. At each node:

1. Subtract the node's value from the remaining target sum
2. If we're at a leaf node (both children are null), check if remaining sum equals 0
3. Otherwise, recursively check left and right subtrees

The key insight: we pass down the **remaining** sum rather than accumulating upward, which simplifies the logic.

<div class="code-group">

```python
# Time: O(n) where n is number of nodes
# Space: O(h) where h is tree height (recursion stack)
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def hasPathSum(self, root: TreeNode, targetSum: int) -> bool:
        # Base case: empty tree
        if not root:
            return False

        # Subtract current node's value from target
        remaining = targetSum - root.val

        # Check if we're at a leaf node
        if not root.left and not root.right:
            # Leaf node: check if remaining sum is zero
            return remaining == 0

        # Not a leaf: recursively check left and right subtrees
        # Return true if either subtree has a valid path
        return (self.hasPathSum(root.left, remaining) or
                self.hasPathSum(root.right, remaining))
```

```javascript
// Time: O(n) where n is number of nodes
// Space: O(h) where h is tree height (recursion stack)
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {boolean}
 */
var hasPathSum = function (root, targetSum) {
  // Base case: empty tree
  if (root === null) {
    return false;
  }

  // Subtract current node's value from target
  const remaining = targetSum - root.val;

  // Check if we're at a leaf node
  if (root.left === null && root.right === null) {
    // Leaf node: check if remaining sum is zero
    return remaining === 0;
  }

  // Not a leaf: recursively check left and right subtrees
  // Return true if either subtree has a valid path
  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
};
```

```java
// Time: O(n) where n is number of nodes
// Space: O(h) where h is tree height (recursion stack)
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

class Solution {
    public boolean hasPathSum(TreeNode root, int targetSum) {
        // Base case: empty tree
        if (root == null) {
            return false;
        }

        // Subtract current node's value from target
        int remaining = targetSum - root.val;

        // Check if we're at a leaf node
        if (root.left == null && root.right == null) {
            // Leaf node: check if remaining sum is zero
            return remaining == 0;
        }

        // Not a leaf: recursively check left and right subtrees
        // Return true if either subtree has a valid path
        return hasPathSum(root.left, remaining) ||
               hasPathSum(root.right, remaining);
    }
}
```

</div>

**Alternative BFS approach**: We can also solve this with BFS using a queue that stores pairs of (node, remaining sum). This avoids recursion but uses similar logic.

## Complexity Analysis

**Time Complexity: O(n)**

- In the worst case, we visit every node once
- Each node is processed exactly once
- Even if we find the path early, worst case is still O(n) for trees where no path exists

**Space Complexity: O(h)** where h is the height of the tree

- For recursion: maximum depth of recursion stack equals tree height
- For balanced trees: O(log n)
- For skewed trees (like a linked list): O(n)
- BFS approach would use O(w) where w is maximum width of tree

## Common Mistakes

1. **Checking at non-leaf nodes**: The most common error is returning `true` when the running sum equals target at an internal node. Remember: the path must end at a leaf. Always check `if not root.left and not root.right` before validating the sum.

2. **Not handling empty tree correctly**: When `root` is `null`, return `false` (not `true` even if target is 0). An empty tree has no paths at all.

3. **Accumulating sum incorrectly**: Passing the accumulated sum upward (adding as we return) is more complex than passing remaining sum downward (subtracting as we recurse). The downward approach is cleaner.

4. **Forgetting short-circuit evaluation**: When checking left and right subtrees, use `or` to stop early when a valid path is found. Don't evaluate both sides unnecessarily.

## When You'll See This Pattern

This DFS-with-backtracking pattern appears in many tree path problems:

1. **Path Sum II (Medium)**: Same problem but return all paths instead of just checking existence. You'll need to track the actual path values.

2. **Sum Root to Leaf Numbers (Medium)**: Instead of summing values, concatenate digits along paths to form numbers, then sum all root-to-leaf numbers.

3. **Binary Tree Maximum Path Sum (Hard)**: More complex—paths don't have to go through root or be root-to-leaf. Requires tracking both through-root and subtree-only paths.

The core pattern is: traverse tree while maintaining some accumulated state (sum, path, etc.), and process results at leaf nodes or according to specific path rules.

## Key Takeaways

1. **DFS with state passing** is the go-to approach for root-to-leaf path problems. Pass the remaining requirement (sum, product, etc.) down the recursion rather than accumulating on the way back up.

2. **Leaf check is critical**: Always verify you're at a leaf node (`left == null && right == null`) before validating path conditions in root-to-leaf problems.

3. **Early termination**: Use short-circuit evaluation (`or`/`||`) when searching for existence to avoid unnecessary traversal once a solution is found.

This problem teaches fundamental tree traversal with state management—a pattern that extends to countless other tree problems.

Related problems: [Path Sum II](/problem/path-sum-ii), [Binary Tree Maximum Path Sum](/problem/binary-tree-maximum-path-sum), [Sum Root to Leaf Numbers](/problem/sum-root-to-leaf-numbers)
