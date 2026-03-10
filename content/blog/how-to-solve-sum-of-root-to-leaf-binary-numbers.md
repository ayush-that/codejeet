---
title: "How to Solve Sum of Root To Leaf Binary Numbers — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sum of Root To Leaf Binary Numbers. Easy difficulty, 76.6% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2027-09-27"
category: "dsa-patterns"
tags: ["sum-of-root-to-leaf-binary-numbers", "tree", "depth-first-search", "binary-tree", "easy"]
---

# How to Solve Sum of Root To Leaf Binary Numbers

You're given a binary tree where each node contains either 0 or 1. Each root-to-leaf path forms a binary number, and you need to sum all these binary numbers. What makes this problem interesting is that you're essentially converting binary paths to decimal values while traversing the tree, which requires careful tracking of the current path's value as you navigate from root to leaves.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this tree:

```
        1
       / \
      0   1
     / \   \
    0   1   0
   /
  1
```

**Path 1: 1 → 0 → 0 → 1**

- Start at root (1): value = 1
- Move to left child (0): value = (1 << 1) | 0 = 2 | 0 = 2 (binary: 10)
- Move to left child (0): value = (2 << 1) | 0 = 4 | 0 = 4 (binary: 100)
- Move to left child (1): value = (4 << 1) | 1 = 8 | 1 = 9 (binary: 1001)
- Decimal: 9

**Path 2: 1 → 0 → 1**

- Start at root (1): value = 1
- Move to left child (0): value = (1 << 1) | 0 = 2 (binary: 10)
- Move to right child (1): value = (2 << 1) | 1 = 5 (binary: 101)
- Decimal: 5

**Path 3: 1 → 1 → 0**

- Start at root (1): value = 1
- Move to right child (1): value = (1 << 1) | 1 = 3 (binary: 11)
- Move to right child (0): value = (3 << 1) | 0 = 6 (binary: 110)
- Decimal: 6

**Total sum**: 9 + 5 + 6 = 20

Notice the pattern: at each step, we shift the current value left by 1 (multiply by 2) and add the current node's value. This is exactly how binary numbers are built!

## Brute Force Approach

A naive approach might be to:

1. Collect all root-to-leaf paths as strings or arrays
2. Convert each binary string to decimal
3. Sum all decimal values

While this approach works, it's inefficient because:

- It requires storing all paths, which uses O(n × h) space where h is the tree height
- Converting binary strings to decimal adds extra computation
- The problem can be solved in a single pass without storing all paths

The key insight is that we don't need to store complete paths—we just need to track the current path's value as we traverse and add to our total whenever we reach a leaf.

## Optimal Solution

We'll use DFS (Depth-First Search) to traverse the tree. At each node, we update the current path value using bit manipulation: `current_value = (current_value << 1) | node.val`. When we reach a leaf node (both children are null), we add the current value to our total sum.

<div class="code-group">

```python
# Time: O(n) where n is number of nodes | Space: O(h) where h is tree height (recursion stack)
class Solution:
    def sumRootToLeaf(self, root: Optional[TreeNode]) -> int:
        # Helper function for DFS traversal
        def dfs(node, current_sum):
            if not node:
                return 0

            # Update current binary number: shift left and add current bit
            # Equivalent to: current_sum = current_sum * 2 + node.val
            current_sum = (current_sum << 1) | node.val

            # If this is a leaf node, return the current binary number
            if not node.left and not node.right:
                return current_sum

            # Otherwise, continue DFS on both children and sum their results
            left_sum = dfs(node.left, current_sum)
            right_sum = dfs(node.right, current_sum)

            return left_sum + right_sum

        # Start DFS from root with initial sum of 0
        return dfs(root, 0)
```

```javascript
// Time: O(n) where n is number of nodes | Space: O(h) where h is tree height (recursion stack)
function sumRootToLeaf(root) {
  // Helper function for DFS traversal
  const dfs = (node, currentSum) => {
    if (!node) return 0;

    // Update current binary number: shift left and add current bit
    // Equivalent to: currentSum = currentSum * 2 + node.val
    currentSum = (currentSum << 1) | node.val;

    // If this is a leaf node, return the current binary number
    if (!node.left && !node.right) {
      return currentSum;
    }

    // Otherwise, continue DFS on both children and sum their results
    const leftSum = dfs(node.left, currentSum);
    const rightSum = dfs(node.right, currentSum);

    return leftSum + rightSum;
  };

  // Start DFS from root with initial sum of 0
  return dfs(root, 0);
}
```

```java
// Time: O(n) where n is number of nodes | Space: O(h) where h is tree height (recursion stack)
class Solution {
    public int sumRootToLeaf(TreeNode root) {
        return dfs(root, 0);
    }

    private int dfs(TreeNode node, int currentSum) {
        if (node == null) return 0;

        // Update current binary number: shift left and add current bit
        // Equivalent to: currentSum = currentSum * 2 + node.val
        currentSum = (currentSum << 1) | node.val;

        // If this is a leaf node, return the current binary number
        if (node.left == null && node.right == null) {
            return currentSum;
        }

        // Otherwise, continue DFS on both children and sum their results
        int leftSum = dfs(node.left, currentSum);
        int rightSum = dfs(node.right, currentSum);

        return leftSum + rightSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once during the DFS traversal
- At each node, we perform constant-time operations (bit shifting, addition, comparisons)

**Space Complexity: O(h)**

- The recursion stack depth equals the height of the tree
- In the worst case (skewed tree), h = n, so space is O(n)
- In the best case (balanced tree), h = log n, so space is O(log n)
- The space is used for the call stack, not for storing paths

## Common Mistakes

1. **Forgetting to handle null nodes properly**: When a node is null, we should return 0, not continue the calculation. This handles cases where a parent has only one child.

2. **Incorrect bit manipulation**: Using `current_sum * 2 + node.val` is mathematically equivalent to `(current_sum << 1) | node.val`, but some candidates try to use string concatenation or other inefficient methods.

3. **Not resetting current_sum when backtracking**: The current_sum parameter is passed by value in our recursive calls, so it automatically "resets" when we return from a branch. If you were using a global variable, you'd need to manually subtract the node's contribution when backtracking.

4. **Missing the leaf node check**: Some candidates try to add to the sum at every node instead of only at leaves. Remember: we only add the complete binary number when we reach a leaf (both children are null).

## When You'll See This Pattern

This problem combines tree traversal with path-based computation, a common pattern in tree problems:

1. **Binary Tree Paths (LeetCode 257)**: Similar pattern of tracking paths from root to leaves, though it stores string representations instead of computing values.

2. **Path Sum (LeetCode 112)**: Checks if there's a root-to-leaf path with a given sum. Uses the same DFS approach with cumulative sum tracking.

3. **Sum Root to Leaf Numbers (LeetCode 129)**: Almost identical problem but with decimal digits instead of binary bits. The solution approach is exactly the same—just multiply by 10 instead of 2.

The core pattern is: **DFS traversal with cumulative computation along paths, with action taken at leaf nodes**.

## Key Takeaways

1. **DFS with path accumulation**: When you need to compute something along root-to-leaf paths, DFS with a cumulative parameter is often the right approach. The parameter tracks the "state" of the path so far.

2. **Bit manipulation for binary numbers**: Remember that building a binary number digit by digit can be done with `(current << 1) | bit`. For decimal numbers, use `current * 10 + digit`.

3. **Leaf detection is crucial**: Many tree problems require different logic at leaf nodes vs. internal nodes. Always check `if not node.left and not node.right` for leaf detection in binary trees.

[Practice this problem on CodeJeet](/problem/sum-of-root-to-leaf-binary-numbers)
