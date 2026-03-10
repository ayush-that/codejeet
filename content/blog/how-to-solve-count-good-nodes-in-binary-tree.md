---
title: "How to Solve Count Good Nodes in Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Good Nodes in Binary Tree. Medium difficulty, 73.8% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2026-11-22"
category: "dsa-patterns"
tags:
  [
    "count-good-nodes-in-binary-tree",
    "tree",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Solve Count Good Nodes in Binary Tree

This problem asks us to count nodes in a binary tree where no ancestor has a value greater than the node's own value. What makes this interesting is that we need to track information along a path from root to each node, not just compare a node with its immediate parent. A node could have a small parent but a large grandparent that makes it "bad," so we need to carry the maximum value seen so far down the tree.

## Visual Walkthrough

Let's trace through a concrete example:

```
        3
       / \
      1   4
     /   / \
    3   1   5
```

We'll count good nodes (marked with ✓):

1. **Root (3)**: No ancestors, so max so far = 3. Node value = 3. Since 3 ≥ 3, it's good. ✓
2. **Left child (1)**: Max so far = max(3, 1) = 3. Node value = 1. Since 1 < 3, it's not good.
3. **Left child's left child (3)**: Max so far = max(3, 1, 3) = 3. Node value = 3. Since 3 ≥ 3, it's good. ✓
4. **Right child (4)**: Max so far = max(3, 4) = 4. Node value = 4. Since 4 ≥ 4, it's good. ✓
5. **Right child's left child (1)**: Max so far = max(3, 4, 1) = 4. Node value = 1. Since 1 < 4, it's not good.
6. **Right child's right child (5)**: Max so far = max(3, 4, 5) = 5. Node value = 5. Since 5 ≥ 5, it's good. ✓

Total good nodes: 4 (nodes with values 3, 3, 4, and 5).

Notice how we need to pass the current maximum value down to each child, updating it if we find a larger node value.

## Brute Force Approach

A naive approach would be to store all paths from root to each node, then check each path for nodes greater than the current node. For each node:

1. Find the path from root to that node (O(n) time per node)
2. Check if any node in that path (excluding the current node) has value > current node value
3. If none do, increment count

This would be O(n²) time in the worst case (skewed tree) and O(n²) space to store all paths. For a tree with 10,000 nodes, this becomes 100 million operations - far too slow.

Even storing paths efficiently doesn't help much because we'd still need to check each ancestor for every node. The key insight is that we don't need to store the entire path - we just need to know the maximum value seen so far.

## Optimized Approach

The optimal solution uses DFS (Depth-First Search) with path tracking. Here's the reasoning:

1. **What information do we need at each node?** We need to know the maximum value encountered on the path from root to the current node's parent.

2. **How do we pass this information?** We pass it as a parameter in our recursive DFS function. When we visit a node, we compare its value with the current maximum.

3. **When is a node "good"?** A node is good if its value is greater than or equal to the maximum value seen so far in its path.

4. **How do we update for children?** For each child, we pass `max(current_max, node.val)` as the new maximum.

5. **Base case:** If node is null, return 0 (no nodes to count).

This approach visits each node exactly once and uses O(h) space for the recursion stack, where h is the tree height.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is number of nodes - we visit each node once
# Space: O(h) where h is tree height - recursion stack space
class Solution:
    def goodNodes(self, root: TreeNode) -> int:
        # Helper function to perform DFS
        def dfs(node, current_max):
            # Base case: if node is None, return 0
            if not node:
                return 0

            # Count current node if it's good
            # A node is good if its value >= current_max
            count = 1 if node.val >= current_max else 0

            # Update current_max for children
            # We need to pass the maximum value seen so far
            new_max = max(current_max, node.val)

            # Recursively count good nodes in left and right subtrees
            # Sum counts from both subtrees with current node's count
            return count + dfs(node.left, new_max) + dfs(node.right, new_max)

        # Start DFS from root with initial maximum as negative infinity
        # Using -inf ensures root is always counted as good
        return dfs(root, float('-inf'))
```

```javascript
// Time: O(n) where n is number of nodes - we visit each node once
// Space: O(h) where h is tree height - recursion stack space
var goodNodes = function (root) {
  // Helper function to perform DFS
  const dfs = (node, currentMax) => {
    // Base case: if node is null, return 0
    if (!node) return 0;

    // Count current node if it's good
    // A node is good if its value >= currentMax
    let count = node.val >= currentMax ? 1 : 0;

    // Update currentMax for children
    // We need to pass the maximum value seen so far
    const newMax = Math.max(currentMax, node.val);

    // Recursively count good nodes in left and right subtrees
    // Sum counts from both subtrees with current node's count
    return count + dfs(node.left, newMax) + dfs(node.right, newMax);
  };

  // Start DFS from root with initial maximum as negative infinity
  // Using -Infinity ensures root is always counted as good
  return dfs(root, -Infinity);
};
```

```java
// Time: O(n) where n is number of nodes - we visit each node once
// Space: O(h) where h is tree height - recursion stack space
class Solution {
    public int goodNodes(TreeNode root) {
        // Start DFS from root with initial maximum as minimum integer value
        // Using Integer.MIN_VALUE ensures root is always counted as good
        return dfs(root, Integer.MIN_VALUE);
    }

    private int dfs(TreeNode node, int currentMax) {
        // Base case: if node is null, return 0
        if (node == null) return 0;

        // Count current node if it's good
        // A node is good if its value >= currentMax
        int count = node.val >= currentMax ? 1 : 0;

        // Update currentMax for children
        // We need to pass the maximum value seen so far
        int newMax = Math.max(currentMax, node.val);

        // Recursively count good nodes in left and right subtrees
        // Sum counts from both subtrees with current node's count
        return count + dfs(node.left, newMax) + dfs(node.right, newMax);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the tree. We visit each node exactly once, performing constant-time operations (comparisons and updates) at each node.

**Space Complexity:** O(h) where h is the height of the tree. This is the space used by the recursion stack. In the worst case (a skewed tree), h = n, so space complexity becomes O(n). In the best case (balanced tree), h = log n.

The space complexity comes from:

1. Recursion call stack: O(h)
2. No additional data structures needed beyond function parameters

## Common Mistakes

1. **Forgetting to update the maximum correctly for siblings**: Some candidates update the maximum globally instead of passing it down. Remember that each path from root to leaf is independent - siblings don't share the same maximum after they diverge.

2. **Using parent comparison instead of path maximum**: A node isn't just good if it's ≥ its parent. It must be ≥ ALL ancestors. The example tree above shows this: the node with value 3 under node 1 is good even though 1 < 3, because the root (3) is the actual maximum.

3. **Incorrect initial maximum value**: Starting with 0 or root.val can fail if the tree contains negative values or if the root itself isn't good (though by definition the root is always good). Using negative infinity (or Integer.MIN_VALUE in Java) is safest.

4. **Not handling null/empty tree**: Always check if root is null at the beginning. While the problem guarantees at least one node, it's good practice to handle edge cases.

## When You'll See This Pattern

This "path maximum" pattern appears in several tree problems:

1. **Binary Tree Maximum Path Sum (LeetCode 124)**: Similar concept of tracking values along paths, though more complex because paths don't have to go through root.

2. **Longest Univalue Path (LeetCode 687)**: Tracking consecutive equal values along paths in a tree.

3. **Path Sum problems (LeetCode 112, 113, 437)**: All involve tracking cumulative sums along paths from root to leaves.

The core pattern is **DFS with state propagation** - passing information down the recursion that represents some property of the path from root to current node. When you need to make decisions based on the entire path (not just parent-child relationship), think about what minimal state you need to pass down.

## Key Takeaways

1. **DFS with path state**: When you need information about the entire path from root to current node, pass that information as a parameter in your recursive function. Don't store entire paths - store only the essential information (like maximum, sum, count, etc.).

2. **Root is always good**: By definition, a node with no ancestors (the root) is always good. This simplifies initialization.

3. **Think about what children need**: At each node, ask: "What information do my children need to determine if they're good?" Then compute that information and pass it down.

[Practice this problem on CodeJeet](/problem/count-good-nodes-in-binary-tree)
