---
title: "How to Solve Insufficient Nodes in Root to Leaf Paths — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Insufficient Nodes in Root to Leaf Paths. Medium difficulty, 54.9% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2028-07-25"
category: "dsa-patterns"
tags:
  [
    "insufficient-nodes-in-root-to-leaf-paths",
    "tree",
    "depth-first-search",
    "binary-tree",
    "medium",
  ]
---

# How to Solve Insufficient Nodes in Root to Leaf Paths

This problem asks us to remove nodes from a binary tree where every root-to-leaf path passing through that node sums to less than a given limit. The tricky part is that we need to determine insufficiency based on **all** paths through a node, not just one, and deletions can cascade—removing a node might make its parent insufficient too.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this tree with `limit = 8`:

```
        5
       / \
      4   8
     /   / \
    11  13  4
   /  \      \
  7    2      1
```

**Step 1: Process leaf nodes**

- Node 7: Path sum = 5 + 4 + 11 + 7 = 27 ≥ 8 → keep
- Node 2: Path sum = 5 + 4 + 11 + 2 = 22 ≥ 8 → keep
- Node 13: Path sum = 5 + 8 + 13 = 26 ≥ 8 → keep
- Node 1: Path sum = 5 + 8 + 4 + 1 = 18 ≥ 8 → keep

**Step 2: Process internal nodes bottom-up**

- Node 11: Both children (7 and 2) are kept → max child sum = max(27, 22) = 27 → node 11 sum = 5 + 4 + 11 + 27 = 47 ≥ 8 → keep
- Node 4 (right child of 8): Only child is 1 → node 4 sum = 5 + 8 + 4 + 18 = 35 ≥ 8 → keep
- Node 4 (left child of 5): Child is 11 → node 4 sum = 5 + 4 + 47 = 56 ≥ 8 → keep
- Node 8: Children are 13 and 4 → max child sum = max(26, 35) = 35 → node 8 sum = 5 + 8 + 35 = 48 ≥ 8 → keep
- Node 5: Children are 4 and 8 → max child sum = max(56, 48) = 56 → node 5 sum = 5 + 56 = 61 ≥ 8 → keep

All nodes are kept in this case. Now let's try `limit = 40` on the same tree:

**Step 1: Process leaves**

- Node 7: 27 < 40 → insufficient → delete
- Node 2: 22 < 40 → insufficient → delete
- Node 13: 26 < 40 → insufficient → delete
- Node 1: 18 < 40 → insufficient → delete

**Step 2: Process internal nodes**

- Node 11: Both children deleted → becomes leaf with value 11 → path sum = 5 + 4 + 11 = 20 < 40 → delete
- Node 4 (right of 8): Child deleted → becomes leaf with value 4 → path sum = 5 + 8 + 4 = 17 < 40 → delete
- Node 4 (left of 5): Child deleted → becomes leaf with value 4 → path sum = 5 + 4 = 9 < 40 → delete
- Node 8: Both children deleted → becomes leaf with value 8 → path sum = 5 + 8 = 13 < 40 → delete
- Node 5: Both children deleted → becomes leaf with value 5 → path sum = 5 < 40 → delete

The entire tree gets deleted, returning `null`.

The key insight: we need to process nodes **bottom-up** (post-order traversal) because whether a node is insufficient depends on whether **any** path through it reaches a leaf with sufficient sum.

## Brute Force Approach

A naive approach would be: for each node, find all root-to-leaf paths that include it, calculate each path's sum, and check if all are less than `limit`. This is extremely inefficient:

1. For each node, traverse the entire subtree to find all leaves
2. For each leaf, traverse back up to the root to calculate path sums
3. This results in O(n²) time complexity in the worst case (skewed tree)

The brute force fails because it recalculates the same path sums repeatedly. We need to compute information once and propagate it upward efficiently.

## Optimized Approach

The optimal solution uses **post-order DFS** with these key insights:

1. **Bottom-up processing**: We need to know about children before deciding about parents
2. **Path sums from current node**: Instead of tracking full path sums from root, we track the **maximum sum from current node to any leaf**
3. **Leaf transformation**: When both children are deleted, a node becomes a leaf itself
4. **Deletion criteria**: A node is insufficient if `node.val + max(left_sum, right_sum) < limit`

Here's the step-by-step reasoning:

1. Perform DFS post-order traversal (left → right → root)
2. For leaf nodes: if `node.val < limit`, delete it (return `null`); otherwise keep it
3. For internal nodes:
   - Recursively process left and right children
   - After processing children, if a child returns `null`, that subtree was deleted
   - Calculate `max_sum = max(left_sum, right_sum)` where each child sum is 0 if deleted
   - If `node.val + max_sum < limit`, the node is insufficient → return `null`
   - Otherwise, return the node (with potentially deleted children)

The critical realization: `max_sum` represents the **best possible path sum from this node to any leaf**. If even the best path through this node is insufficient, then **all** paths through it are insufficient.

## Optimal Solution

<div class="code-group">

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

# Time: O(n) - We visit each node exactly once
# Space: O(h) - Recursion stack height, where h is tree height (O(n) worst case for skewed tree)
class Solution:
    def sufficientSubset(self, root: Optional[TreeNode], limit: int) -> Optional[TreeNode]:
        # Helper function returns the maximum path sum from node to any leaf
        # If node is insufficient, returns None (indicating deletion)
        def dfs(node: Optional[TreeNode], current_sum: int) -> Optional[TreeNode]:
            # Base case: null node
            if not node:
                return None

            # Add current node's value to the running sum
            current_sum += node.val

            # If leaf node, check if path sum meets limit
            if not node.left and not node.right:
                # Keep leaf only if path sum >= limit
                return node if current_sum >= limit else None

            # Recursively process children (post-order traversal)
            # We need to know about children before deciding about current node
            node.left = dfs(node.left, current_sum)
            node.right = dfs(node.right, current_sum)

            # After processing children, check if current node became a leaf
            # (both children were deleted)
            if not node.left and not node.right:
                # Node is now a leaf - check if it meets limit
                return node if current_sum >= limit else None

            # Node has at least one child remaining - keep it
            return node

        # Start DFS from root with initial sum 0
        return dfs(root, 0)
```

```javascript
// Definition for a binary tree node.
// function TreeNode(val, left, right) {
//     this.val = (val===undefined ? 0 : val)
//     this.left = (left===undefined ? null : left)
//     this.right = (right===undefined ? null : right)
// }

// Time: O(n) - Visit each node once
// Space: O(h) - Recursion stack, where h is tree height
/**
 * @param {TreeNode} root
 * @param {number} limit
 * @return {TreeNode}
 */
var sufficientSubset = function (root, limit) {
  // DFS helper function
  // Returns the node if it should be kept, null if it should be deleted
  const dfs = (node, currentSum) => {
    // Base case: null node
    if (!node) {
      return null;
    }

    // Add current node's value to the path sum
    currentSum += node.val;

    // Check if this is a leaf node
    if (!node.left && !node.right) {
      // Leaf node: keep only if path sum meets limit
      return currentSum >= limit ? node : null;
    }

    // Process children first (post-order traversal)
    node.left = dfs(node.left, currentSum);
    node.right = dfs(node.right, currentSum);

    // After processing children, check if node became a leaf
    // (both children were deleted)
    if (!node.left && !node.right) {
      // Node is now effectively a leaf
      return currentSum >= limit ? node : null;
    }

    // Node has at least one child remaining
    return node;
  };

  // Start DFS from root
  return dfs(root, 0);
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

// Time: O(n) - Each node visited once
// Space: O(h) - Recursion stack, where h is tree height
class Solution {
    public TreeNode sufficientSubset(TreeNode root, int limit) {
        // Perform DFS and return the modified tree
        return dfs(root, 0, limit);
    }

    private TreeNode dfs(TreeNode node, int currentSum, int limit) {
        // Base case: null node
        if (node == null) {
            return null;
        }

        // Add current node's value to running sum
        currentSum += node.val;

        // Check if this is a leaf node
        if (node.left == null && node.right == null) {
            // Leaf node: keep only if path sum meets limit
            return currentSum >= limit ? node : null;
        }

        // Process children first (post-order traversal)
        node.left = dfs(node.left, currentSum, limit);
        node.right = dfs(node.right, currentSum, limit);

        // After processing children, check if node became a leaf
        if (node.left == null && node.right == null) {
            // Both children were deleted, node is now effectively a leaf
            return currentSum >= limit ? node : null;
        }

        // Node has at least one child remaining
        return node;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We perform a single DFS traversal of the tree
- Each node is visited exactly once
- At each node, we perform O(1) operations (value addition, comparisons, child checks)

**Space Complexity: O(h)**

- `h` is the height of the tree
- Space is used for the recursion call stack
- Worst case: O(n) for a skewed tree (linked list shape)
- Best case: O(log n) for a balanced tree

## Common Mistakes

1. **Top-down instead of bottom-up processing**: Trying to decide about nodes while going down the tree fails because you don't know about future paths. Always use post-order traversal for problems where parent decisions depend on children.

2. **Forgetting that deleted nodes create new leaves**: When both children are deleted, the parent becomes a leaf. Candidates often check leaf condition only at the start, not after processing children.

3. **Incorrect sum comparison**: Comparing `node.val < limit` instead of `current_sum >= limit` for leaves. The limit applies to the **entire path sum from root to leaf**, not just individual nodes.

4. **Not handling the return value properly**: The DFS should return `null` for deleted nodes and the node itself for kept nodes. Some candidates try to delete in-place without proper return values, causing parent references to point to deleted nodes.

## When You'll See This Pattern

This **post-order DFS with bottom-up computation** pattern appears in many tree problems:

1. **Binary Tree Maximum Path Sum (LeetCode 124)**: Similar bottom-up approach where each node computes the maximum path sum through it, combining information from both children.

2. **Diameter of Binary Tree (LeetCode 543)**: Compute diameter by tracking heights from bottom-up, where each node's potential diameter depends on children's heights.

3. **Count Nodes Equal to Average of Subtree (LeetCode 2265)**: Need subtree sums and counts computed from children upward to calculate averages.

The pattern is: when a node's property depends on its entire subtree (or paths through it), process children first, compute their results, then combine at the parent.

## Key Takeaways

1. **Post-order traversal is key for bottom-up computation**: When parent decisions depend on children results, always use left-right-root processing order.

2. **Transform internal nodes to leaves**: After deleting children, reassess the parent as if it were a leaf—this is a common pattern in tree pruning problems.

3. **Track "best possible" outcomes**: Instead of checking all paths, track the maximum (or minimum) achievable value from a node to determine if any path meets criteria.

Related problems: [Count Nodes Equal to Average of Subtree](/problem/count-nodes-equal-to-average-of-subtree)
