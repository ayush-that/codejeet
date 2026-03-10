---
title: "How to Solve House Robber III — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode House Robber III. Medium difficulty, 55.6% acceptance rate. Topics: Dynamic Programming, Tree, Depth-First Search, Binary Tree."
date: "2027-05-13"
category: "dsa-patterns"
tags: ["house-robber-iii", "dynamic-programming", "tree", "depth-first-search", "medium"]
---

# How to Solve House Robber III

The House Robber III problem presents a classic dynamic programming challenge applied to binary trees. You're given a binary tree where each node represents a house with a certain amount of money, and you need to determine the maximum amount you can steal without robbing two directly connected houses (parent and child). What makes this problem interesting is that we need to apply the "no adjacent" constraint from the original House Robber problem to a tree structure rather than a linear array.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
Tree structure:
     3
    / \
   2   3
    \   \
     3   1

Amounts at each node: [3,2,3,null,3,null,1]
```

We need to find the maximum sum we can get without robbing two directly connected nodes.

**Step-by-step reasoning:**

1. At the root (3), we have two choices:
   - Rob the root: We get 3 + whatever we can get from the grandchildren (since we can't rob the children)
   - Don't rob the root: We get whatever we can get from the children

2. Let's work from the bottom up:
   - Rightmost leaf (1): If we rob it, we get 1. If we don't, we get 0.
   - Middle right node (3): If we rob it, we get 3 + max from grandchildren (none, so 0) = 3. If we don't, we get max from children (1) = 1.
   - Bottom left leaf (3): If we rob it, we get 3. If we don't, we get 0.
   - Middle left node (2): If we rob it, we get 2 + max from grandchildren (3) = 5. If we don't, we get max from children (3) = 3.
   - Root (3): If we rob it, we get 3 + max from grandchildren (3 from left grandchild + 1 from right grandchild) = 7. If we don't, we get max from children (5 from left + 3 from right) = 8.

The maximum is max(7, 8) = 8. So we should NOT rob the root, but instead rob the middle left node (2) and rightmost node (1), plus the bottom left leaf (3).

## Brute Force Approach

A naive approach would be to recursively explore all possible combinations of robbing or not robbing each node. For each node, we would:

1. Calculate the maximum if we rob this node (node's value + maximum from grandchildren)
2. Calculate the maximum if we don't rob this node (maximum from children)
3. Return the maximum of these two options

The problem with this approach is that we're doing redundant work. Each node gets visited multiple times because when we calculate results for a parent, we need results from its children and grandchildren, and those children will be recalculated when their own parents need them.

Here's what the brute force code would look like:

<div class="code-group">

```python
# Time: O(2^n) | Space: O(h) where h is height of tree
def rob_brute_force(root):
    if not root:
        return 0

    # Option 1: Rob current node
    rob_current = root.val
    if root.left:
        rob_current += rob_brute_force(root.left.left) + rob_brute_force(root.left.right)
    if root.right:
        rob_current += rob_brute_force(root.right.left) + rob_brute_force(root.right.right)

    # Option 2: Don't rob current node
    skip_current = rob_brute_force(root.left) + rob_brute_force(root.right)

    return max(rob_current, skip_current)
```

```javascript
// Time: O(2^n) | Space: O(h) where h is height of tree
function robBruteForce(root) {
  if (!root) return 0;

  // Option 1: Rob current node
  let robCurrent = root.val;
  if (root.left) {
    robCurrent += robBruteForce(root.left.left) + robBruteForce(root.left.right);
  }
  if (root.right) {
    robCurrent += robBruteForce(root.right.left) + robBruteForce(root.right.right);
  }

  // Option 2: Don't rob current node
  let skipCurrent = robBruteForce(root.left) + robBruteForce(root.right);

  return Math.max(robCurrent, skipCurrent);
}
```

```java
// Time: O(2^n) | Space: O(h) where h is height of tree
public int robBruteForce(TreeNode root) {
    if (root == null) return 0;

    // Option 1: Rob current node
    int robCurrent = root.val;
    if (root.left != null) {
        robCurrent += robBruteForce(root.left.left) + robBruteForce(root.left.right);
    }
    if (root.right != null) {
        robCurrent += robBruteForce(root.right.left) + robBruteForce(root.right.right);
    }

    // Option 2: Don't rob current node
    int skipCurrent = robBruteForce(root.left) + robBruteForce(root.right);

    return Math.max(robCurrent, skipCurrent);
}
```

</div>

This brute force solution has exponential time complexity O(2^n) because for each node, we're making recursive calls to its children and grandchildren, leading to massive recomputation. For a tree with n nodes, this becomes impractical for even moderately sized trees.

## Optimized Approach

The key insight is that we can use memoization (top-down dynamic programming) or a bottom-up approach to avoid redundant calculations. For each node, we need to know two things:

1. The maximum amount we can get if we rob this node
2. The maximum amount we can get if we don't rob this node

Instead of returning just a single value from our recursive function, we can return a pair of values: `[rob, skip]`, where:

- `rob` = maximum amount if we rob this node
- `skip` = maximum amount if we skip this node

For any node:

- If we rob it: `rob = node.val + left.skip + right.skip`
- If we skip it: `skip = max(left.rob, left.skip) + max(right.rob, right.skip)`

This way, we only need to traverse the tree once, and for each node, we compute both values based on the results from its children.

## Optimal Solution

Here's the optimal solution using post-order traversal (DFS) with memoization:

<div class="code-group">

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

# Time: O(n) | Space: O(h) where h is height of tree (recursion stack)
class Solution:
    def rob(self, root: Optional[TreeNode]) -> int:
        # Helper function that returns [rob, skip] for a given node
        def dfs(node):
            # Base case: if node is None, return [0, 0]
            if not node:
                return [0, 0]

            # Recursively get results for left and right children
            left = dfs(node.left)
            right = dfs(node.right)

            # If we rob current node, we cannot rob its children
            # So we take node's value + what we get from skipping children
            rob_current = node.val + left[1] + right[1]

            # If we skip current node, we can choose to rob or skip children
            # We take the maximum from each child's options
            skip_current = max(left[0], left[1]) + max(right[0], right[1])

            # Return both possibilities for the parent to use
            return [rob_current, skip_current]

        # Start DFS from root and return maximum of rob or skip
        result = dfs(root)
        return max(result[0], result[1])
```

```javascript
// Definition for a binary tree node.
// function TreeNode(val, left, right) {
//     this.val = (val===undefined ? 0 : val)
//     this.left = (left===undefined ? null : left)
//     this.right = (right===undefined ? null : right)
// }

// Time: O(n) | Space: O(h) where h is height of tree (recursion stack)
/**
 * @param {TreeNode} root
 * @return {number}
 */
var rob = function (root) {
  // Helper function that returns [rob, skip] for a given node
  const dfs = (node) => {
    // Base case: if node is null, return [0, 0]
    if (!node) {
      return [0, 0];
    }

    // Recursively get results for left and right children
    const left = dfs(node.left);
    const right = dfs(node.right);

    // If we rob current node, we cannot rob its children
    // So we take node's value + what we get from skipping children
    const robCurrent = node.val + left[1] + right[1];

    // If we skip current node, we can choose to rob or skip children
    // We take the maximum from each child's options
    const skipCurrent = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);

    // Return both possibilities for the parent to use
    return [robCurrent, skipCurrent];
  };

  // Start DFS from root and return maximum of rob or skip
  const result = dfs(root);
  return Math.max(result[0], result[1]);
};
```

```java
// Definition for a binary tree node.
// public class TreeNode {
//     int val;
//     TreeNode left;
//     TreeNode right;
//     TreeNode() {}
//     TreeNode(int val) { this.val = val; }
//     TreeNode(int val, TreeNode left, TreeNode right) {
//         this.val = val;
//         this.left = left;
//         this.right = right;
//     }
// }

// Time: O(n) | Space: O(h) where h is height of tree (recursion stack)
class Solution {
    public int rob(TreeNode root) {
        // Helper function that returns [rob, skip] for a given node
        int[] result = dfs(root);
        // Return maximum of rob or skip
        return Math.max(result[0], result[1]);
    }

    private int[] dfs(TreeNode node) {
        // Base case: if node is null, return [0, 0]
        if (node == null) {
            return new int[]{0, 0};
        }

        // Recursively get results for left and right children
        int[] left = dfs(node.left);
        int[] right = dfs(node.right);

        // If we rob current node, we cannot rob its children
        // So we take node's value + what we get from skipping children
        int robCurrent = node.val + left[1] + right[1];

        // If we skip current node, we can choose to rob or skip children
        // We take the maximum from each child's options
        int skipCurrent = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);

        // Return both possibilities for the parent to use
        return new int[]{robCurrent, skipCurrent};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We visit each node exactly once during the DFS traversal
- For each node, we perform constant-time operations (addition, comparison)
- Total operations scale linearly with the number of nodes

**Space Complexity:** O(h) where h is the height of the tree

- The recursion stack uses space proportional to the height of the tree
- In the worst case (skewed tree), h = n, so O(n)
- In the best case (balanced tree), h = log n, so O(log n)
- We don't use any additional data structures that scale with n

## Common Mistakes

1. **Returning only one value from the recursive function:** Many candidates try to return just the maximum amount for a subtree, but this loses information about whether the root of that subtree was robbed or not. The parent needs to know both possibilities to make its own decision.

2. **Forgetting to consider all four combinations when skipping a node:** When we skip a node, we need to consider both possibilities for each child (rob or skip) and take the maximum for each. The mistake is to only consider robbing both children or skipping both children, when the optimal might be to rob one child and skip the other.

3. **Incorrect base case handling:** For null nodes, we need to return [0, 0], not 0. This ensures the parent can correctly add these values regardless of whether it's robbing or skipping.

4. **Trying to use a greedy approach:** Some candidates try to rob nodes with higher values first, but this doesn't work because robbing a high-value node might prevent you from robbing multiple medium-value nodes that together are worth more.

## When You'll See This Pattern

This problem combines tree traversal with dynamic programming, a pattern that appears in many tree problems:

1. **Binary Tree Maximum Path Sum (LeetCode 124):** Similar concept of returning multiple values from subtrees (the maximum path sum including the current node, and the maximum path sum in the subtree).

2. **Diameter of Binary Tree (LeetCode 543):** Uses a similar approach of returning height information from subtrees while computing a global maximum.

3. **Longest Univalue Path (LeetCode 687):** Another tree DP problem where you return the longest path extending from a node while tracking a global maximum.

The core pattern is: when you need to make decisions at each node that depend on decisions made in subtrees, consider returning multiple pieces of information from your recursive function.

## Key Takeaways

1. **Tree + DP often requires returning multiple values:** When solving tree problems with dynamic programming, you frequently need to return more than just a single optimal value from your recursive function. Return enough information for parent nodes to make optimal decisions.

2. **Post-order traversal is natural for bottom-up DP on trees:** Since child results are needed before parent calculations, post-order (left-right-root) traversal aligns perfectly with the computation flow.

3. **Think in terms of states:** For each node, define what states are possible (e.g., "robbed" or "not robbed") and how the optimal value for each state depends on children's states. This state-based thinking is key to many DP problems.

Related problems: [House Robber](/problem/house-robber), [House Robber II](/problem/house-robber-ii)
