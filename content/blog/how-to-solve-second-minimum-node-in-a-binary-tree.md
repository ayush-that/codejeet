---
title: "How to Solve Second Minimum Node In a Binary Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Second Minimum Node In a Binary Tree. Easy difficulty, 46.0% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2028-06-01"
category: "dsa-patterns"
tags: ["second-minimum-node-in-a-binary-tree", "tree", "depth-first-search", "binary-tree", "easy"]
---

# How to Solve Second Minimum Node In a Binary Tree

This problem asks us to find the second smallest value in a special binary tree where each non-leaf node's value equals the minimum of its two children's values. The tricky part is that the tree structure guarantees the root is the smallest value, but the second smallest could be anywhere in the tree — and there might not even be a second distinct value at all.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this tree:

```
      2
     / \
    2   5
       / \
      5   7
```

**Step 1:** Start at root (2). Since root = min(left, right), we know 2 is the smallest value.

**Step 2:** Check left child (2). It's equal to root, so the second minimum might be in the right subtree.

**Step 3:** Check right child (5). This is greater than root, so it's a candidate for second minimum.

**Step 4:** Explore the right subtree (node 5). Its left child is 5 (equal to parent), right child is 7 (greater than parent).

**Step 5:** Track candidates: We've seen 2 (root), 5 (right child of root), and 7. The second smallest distinct value is 5.

The key insight: When a node's value equals the root's value, we must explore both children because the second minimum could be deeper in that subtree. When a node's value is greater than root, we don't need to explore its children — we just track it as a candidate.

## Brute Force Approach

A naive approach would be to traverse the entire tree, collect all values in a set, sort them, and return the second smallest. While this works, it's inefficient because:

1. We're exploring nodes we don't need to (nodes with values greater than current candidates)
2. We're doing extra work with sorting when we only need the second smallest

The brute force would have O(n) time and O(n) space for storing all values, which isn't terrible but misses the opportunity to use the tree's special property for early pruning.

## Optimal Solution

The optimal solution uses DFS with pruning. We know the root is the smallest value. As we traverse:

- If a node's value > root's value, it's a candidate for second minimum
- If a node's value = root's value, we need to explore its children
- We stop exploring a subtree when all nodes in it are ≥ current second minimum candidate

<div class="code-group">

```python
# Time: O(n) | Space: O(h) where h is tree height
class Solution:
    def findSecondMinimumValue(self, root: Optional[TreeNode]) -> int:
        # The root is guaranteed to be the minimum value in the tree
        # because of the tree's special property
        self.min_val = root.val
        self.second_min = float('inf')

        def dfs(node):
            if not node:
                return

            # If current node's value is greater than min_val but smaller
            # than our current second_min candidate, update second_min
            if self.min_val < node.val < self.second_min:
                self.second_min = node.val
                # No need to explore children - they'll be >= node.val
                return

            # Only explore children if node.val equals min_val
            # This is the key optimization - we prune branches where
            # node.val > min_val since they can't contain smaller values
            if node.val == self.min_val:
                dfs(node.left)
                dfs(node.right)

        dfs(root)

        # Return -1 if no second minimum was found (all values equal)
        return self.second_min if self.second_min != float('inf') else -1
```

```javascript
// Time: O(n) | Space: O(h) where h is tree height
function findSecondMinimumValue(root) {
  // Store the minimum value (root's value)
  let minVal = root.val;
  // Initialize second minimum to Infinity (largest possible number)
  let secondMin = Infinity;

  function dfs(node) {
    if (!node) return;

    // If current node value is between minVal and secondMin,
    // update secondMin and stop exploring this branch
    if (minVal < node.val && node.val < secondMin) {
      secondMin = node.val;
      // Children will have values >= node.val, so no need to explore
      return;
    }

    // Only explore children if node value equals minVal
    // This is crucial for pruning unnecessary branches
    if (node.val === minVal) {
      dfs(node.left);
      dfs(node.right);
    }
  }

  dfs(root);

  // Return -1 if secondMin wasn't updated (all values equal)
  return secondMin !== Infinity ? secondMin : -1;
}
```

```java
// Time: O(n) | Space: O(h) where h is tree height
class Solution {
    private int minVal;
    private long secondMin; // Use long to handle Integer.MAX_VALUE case

    public int findSecondMinimumValue(TreeNode root) {
        // Root value is guaranteed to be the minimum
        minVal = root.val;
        // Initialize to Long.MAX_VALUE to handle any int value
        secondMin = Long.MAX_VALUE;

        dfs(root);

        // Return -1 if no second minimum found, otherwise cast to int
        return secondMin == Long.MAX_VALUE ? -1 : (int) secondMin;
    }

    private void dfs(TreeNode node) {
        if (node == null) return;

        // If current value is between minVal and secondMin,
        // update secondMin and prune this branch
        if (minVal < node.val && node.val < secondMin) {
            secondMin = node.val;
            // No need to check children - they'll be >= node.val
            return;
        }

        // Only recurse if node value equals minVal
        // This prevents unnecessary exploration of already-large values
        if (node.val == minVal) {
            dfs(node.left);
            dfs(node.right);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) in the worst case when all nodes have the same value (we must visit every node). However, with pruning, average case is often better. The worst case occurs when the tree is a "staircase" of equal values until the last leaf.

**Space Complexity:** O(h) where h is the height of the tree, due to the recursion stack. In a balanced tree, this is O(log n); in a skewed tree, it's O(n).

## Common Mistakes

1. **Not handling the "no second minimum" case**: Forgetting that all nodes might have the same value and returning that value instead of -1. Always check if your second minimum candidate was actually updated.

2. **Incorrect pruning logic**: Exploring nodes with values greater than the current second minimum candidate. Remember: if node.val ≥ secondMin, its children will be ≥ node.val, so they can't improve our answer.

3. **Using Integer.MAX_VALUE incorrectly**: In Java, if the actual second minimum is Integer.MAX_VALUE, you need to use a larger type (like long) to distinguish between "not found" and "found Integer.MAX_VALUE".

4. **Assuming the second minimum is always a direct child of the root**: This is false! The second minimum could be deep in the tree, like in a path where all nodes equal the root until the last leaf.

## When You'll See This Pattern

This problem combines tree traversal with pruning optimization, a pattern seen in:

1. **Kth Smallest Element in a BST**: Similar pruning concept where you stop searching once you find the kth element, though BSTs have different structural properties.

2. **Binary Tree Maximum Path Sum**: Uses DFS with pruning to avoid unnecessary calculations, though the pruning logic is based on sum values rather than comparisons.

3. **Lowest Common Ancestor of a Binary Tree**: Uses DFS that returns early when both nodes are found, similar to our pruning when we find a candidate.

The core pattern is: traverse a tree, but stop exploring branches that cannot possibly improve your answer given what you already know.

## Key Takeaways

- **Use problem constraints to optimize**: The special property (root.val = min(left, right)) tells us the root is the minimum, letting us prune branches where node.val > minVal.

- **Prune aggressively**: When searching for extreme values (min, max, kth), stop exploring branches that cannot contain better candidates than what you've already found.

- **Handle edge cases explicitly**: Always consider what happens when all values are equal, when the tree has only one node, or when the second minimum is Integer.MAX_VALUE.

Related problems: [Kth Smallest Element in a BST](/problem/kth-smallest-element-in-a-bst)
