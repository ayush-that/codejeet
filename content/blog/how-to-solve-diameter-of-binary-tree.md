---
title: "How to Solve Diameter of Binary Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Diameter of Binary Tree. Easy difficulty, 65.1% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2026-04-28"
category: "dsa-patterns"
tags: ["diameter-of-binary-tree", "tree", "depth-first-search", "binary-tree", "easy"]
---

# How to Solve Diameter of Binary Tree

The diameter of a binary tree is the length of the longest path between any two nodes. What makes this problem interesting is that the longest path might not pass through the root, so you can't simply compute left and right subtree heights and add them. You need to consider paths that exist entirely within subtrees while efficiently tracking the global maximum.

## Visual Walkthrough

Let's trace through a simple example: `[1,2,3,4,5]` (in level-order representation).

```
        1
       / \
      2   3
     / \
    4   5
```

The diameter is the path `[4 → 2 → 5]` or `[5 → 2 → 4]`, which has length 3 (3 edges between 4 nodes).

Here's how we think about it:

1. At node 4: height = 1 (just itself), diameter = 0 (no path between two different nodes)
2. At node 5: height = 1, diameter = 0
3. At node 2: left height = 1 (from node 4), right height = 1 (from node 5). The diameter through node 2 is `left height + right height = 2`. We compare this with diameters from children (both 0), so diameter at node 2 = max(2, 0, 0) = 2.
4. At node 3: height = 1, diameter = 0
5. At root node 1: left height = 2 (from node 2's height + 1), right height = 1 (from node 3). Diameter through root = `2 + 1 = 3`. Compare with child diameters (2 and 0), so final diameter = max(3, 2, 0) = 3.

The key insight: at each node, the longest path passing through that node is `left height + right height`. The global diameter is the maximum of these values across all nodes.

## Brute Force Approach

A naive approach would be to compute the diameter for every node separately:

1. For each node, find the longest downward path in its left subtree
2. Find the longest downward path in its right subtree
3. Sum these two lengths to get the diameter through that node
4. Track the maximum across all nodes

This requires repeatedly traversing subtrees. For each node, computing heights requires O(n) time, and we do this for all n nodes, resulting in O(n²) time complexity. This is inefficient for large trees.

What makes the brute force insufficient is the repeated work — we're computing the height of subtrees multiple times. The optimal solution computes both height and diameter in a single pass.

## Optimal Solution

We can solve this with a single DFS traversal. The trick is to realize that while computing the height of each subtree, we can also compute the diameter passing through the current node as `left height + right height`. We track a global maximum diameter throughout the traversal.

The algorithm:

1. Perform DFS from the root
2. For each node, compute the height of its left and right subtrees
3. The diameter through the current node is `left height + right height`
4. Update the global maximum diameter if this value is larger
5. Return the height of the current subtree (max of left/right height + 1)

<div class="code-group">

```python
# Time: O(n) - we visit each node exactly once
# Space: O(h) - where h is the height of the tree (recursion stack)
class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        # Initialize diameter as 0 (empty tree or single node has diameter 0)
        self.diameter = 0

        def dfs(node):
            """
            DFS helper function that returns the height of the subtree
            rooted at 'node' while updating the global diameter.
            """
            # Base case: if node is None, height is 0
            if not node:
                return 0

            # Recursively get heights of left and right subtrees
            left_height = dfs(node.left)
            right_height = dfs(node.right)

            # Update global diameter: the path through current node
            # is left_height + right_height (number of edges between nodes)
            self.diameter = max(self.diameter, left_height + right_height)

            # Return height of current subtree: max of left/right height + 1
            # The +1 accounts for the current node itself
            return max(left_height, right_height) + 1

        # Start DFS from root
        dfs(root)

        # Return the maximum diameter found
        return self.diameter
```

```javascript
// Time: O(n) - we visit each node exactly once
// Space: O(h) - where h is the height of the tree (recursion stack)
function diameterOfBinaryTree(root) {
  // Initialize diameter as 0 (empty tree or single node has diameter 0)
  let diameter = 0;

  /**
   * DFS helper function that returns the height of the subtree
   * rooted at 'node' while updating the global diameter.
   */
  function dfs(node) {
    // Base case: if node is null, height is 0
    if (!node) {
      return 0;
    }

    // Recursively get heights of left and right subtrees
    const leftHeight = dfs(node.left);
    const rightHeight = dfs(node.right);

    // Update global diameter: the path through current node
    // is leftHeight + rightHeight (number of edges between nodes)
    diameter = Math.max(diameter, leftHeight + rightHeight);

    // Return height of current subtree: max of left/right height + 1
    // The +1 accounts for the current node itself
    return Math.max(leftHeight, rightHeight) + 1;
  }

  // Start DFS from root
  dfs(root);

  // Return the maximum diameter found
  return diameter;
}
```

```java
// Time: O(n) - we visit each node exactly once
// Space: O(h) - where h is the height of the tree (recursion stack)
class Solution {
    // Class variable to track the maximum diameter
    private int diameter = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        // Start DFS from root
        dfs(root);

        // Return the maximum diameter found
        return diameter;
    }

    /**
     * DFS helper function that returns the height of the subtree
     * rooted at 'node' while updating the global diameter.
     */
    private int dfs(TreeNode node) {
        // Base case: if node is null, height is 0
        if (node == null) {
            return 0;
        }

        // Recursively get heights of left and right subtrees
        int leftHeight = dfs(node.left);
        int rightHeight = dfs(node.right);

        // Update global diameter: the path through current node
        // is leftHeight + rightHeight (number of edges between nodes)
        diameter = Math.max(diameter, leftHeight + rightHeight);

        // Return height of current subtree: max of left/right height + 1
        // The +1 accounts for the current node itself
        return Math.max(leftHeight, rightHeight) + 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the tree. We perform a single DFS traversal, visiting each node exactly once.

**Space Complexity:** O(h) where h is the height of the tree. This is the maximum depth of the recursion stack. In the worst case (a skewed tree), h = n, giving O(n) space. In a balanced tree, h = log n, giving O(log n) space.

The key to the O(n) time complexity is that we compute both height and diameter simultaneously in one pass, avoiding the repeated work of the brute force approach.

## Common Mistakes

1. **Confusing diameter with height:** The diameter is the number of edges on the longest path, not the number of nodes. When computing the diameter through a node, you sum the left and right heights (which are already edge counts), not `left + right + 1`.

2. **Forgetting the diameter might not pass through the root:** Many candidates assume the longest path always goes through the root. This is incorrect — the diameter could be entirely within a subtree. That's why we need to track the global maximum at every node.

3. **Not handling empty trees or single nodes:** An empty tree (null root) has diameter 0. A tree with only one node also has diameter 0 (no edges between two different nodes). Always test these edge cases.

4. **Using instance variables incorrectly in Java:** In Java, if you declare the diameter variable inside the method, you can't update it from the recursive helper. Either use a class variable (as shown) or pass a mutable container like an array `int[] diameter = new int[1]`.

## When You'll See This Pattern

This "compute and propagate" DFS pattern appears in many tree problems where you need to compute a global property based on local subtree information. The key insight is performing a bottom-up computation where each node processes information from its children and passes up a result.

Related problems using similar patterns:

- **Maximum Path Sum** (LeetCode 124): Instead of summing heights, you sum node values, with the added complexity of negative values.
- **Longest Univalue Path** (LeetCode 687): Similar structure but only counts paths where all nodes have the same value.
- **Binary Tree Maximum Path Sum** (LeetCode 124): A more complex version where nodes have values (possibly negative) and you're looking for the maximum sum path.

## Key Takeaways

1. **Bottom-up computation is powerful for tree problems:** When you need to compute a global property, consider what information each node needs from its children and what it should pass up to its parent.

2. **The diameter through a node = left height + right height:** This is the core insight. The height of a node is `max(left height, right height) + 1`, while the diameter through it is the sum of both heights.

3. **Track global maximum during traversal:** Since the diameter might be in any subtree, update a global variable as you compute local diameters at each node.

Remember: The diameter is measured in edges, not nodes. A path with k nodes has k-1 edges between them.

Related problems: [Diameter of N-Ary Tree](/problem/diameter-of-n-ary-tree), [Longest Path With Different Adjacent Characters](/problem/longest-path-with-different-adjacent-characters)
