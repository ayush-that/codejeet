---
title: "How to Solve Binary Tree Maximum Path Sum — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Binary Tree Maximum Path Sum. Hard difficulty, 42.0% acceptance rate. Topics: Dynamic Programming, Tree, Depth-First Search, Binary Tree."
date: "2026-06-09"
category: "dsa-patterns"
tags: ["binary-tree-maximum-path-sum", "dynamic-programming", "tree", "depth-first-search", "hard"]
---

# How to Solve Binary Tree Maximum Path Sum

This problem asks us to find the maximum sum of any path in a binary tree, where a path is defined as any sequence of connected nodes where each node appears at most once. The tricky part is that the path doesn't need to start at the root or end at a leaf—it can be any connected sequence of nodes, including paths that go through a node's left and right children. This makes it fundamentally different from simpler path sum problems where paths must go from root to leaf.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
     -10
     /  \
    9    20
        /  \
       15   7
```

We need to find the maximum path sum. Let's think about what paths are possible:

1. **Single node paths**: -10, 9, 20, 15, 7
2. **Two-node paths**: 9 → -10, -10 → 20, 20 → 15, 20 → 7
3. **Three-node paths**: 15 → 20 → 7
4. **Four-node paths**: 9 → -10 → 20 → 15 (but wait, this isn't a valid path because -10 connects to both 9 and 20, creating a "fork")

The key insight: A valid path can't have more than one child of any node in the path (except at the ends). So when we're at node 20, we could have:

- A path that goes through 20: 15 → 20 → 7 (sum = 15 + 20 + 7 = 42)
- A path that ends at 20: either 15 → 20 or 7 → 20

Let's calculate step by step from the bottom up:

1. **Leaf nodes**:
   - Node 9: max path ending here = 9
   - Node 15: max path ending here = 15
   - Node 7: max path ending here = 7

2. **Node 20**:
   - Max path ending at 20 (going upward) = max(20, 20 + 15, 20 + 7) = max(20, 35, 27) = 35
   - But also consider paths that go THROUGH 20: 15 → 20 → 7 = 42
   - So the best path involving node 20 is max(35, 42) = 42

3. **Node -10**:
   - Max path ending at -10 = max(-10, -10 + 9, -10 + 35) = max(-10, -1, 25) = 25
   - Path through -10: 9 → -10 → 20 (but wait, this would be 9 + (-10) + 35 = 34, not as good as 42)

The maximum overall is 42 (path 15 → 20 → 7).

## Brute Force Approach

A naive approach would be to consider every possible path in the tree. For each node, we could:

1. Consider it as the "root" of a path
2. Try all combinations of extending left and right

This would involve:

- For each node as the "highest" point in the path
- Try all paths going left only
- Try all paths going right only
- Try all combinations of left and right paths meeting at this node

The problem is that there are O(n) nodes, and for each node, we'd need to explore O(n) possible paths in the worst case (if the tree is skewed), giving us O(n²) time complexity. For a tree with 30,000 nodes (common in LeetCode tests), this would be 900 million operations—far too slow.

Even if we tried to memoize some results, a brute force approach would be complex to implement correctly because we need to track whether we're taking a continuous path (for upward propagation) or a complete path (for the global maximum).

## Optimized Approach

The key insight is that we can solve this with a **single post-order traversal** (DFS) that computes two things at each node:

1. **Maximum path sum ending at this node (going upward)**: This is the maximum sum of any path that starts somewhere in the subtree and ends at this node, moving upward toward the root. This value is what we return to the parent, because from the parent's perspective, it can only extend ONE of its children's paths (not both).

2. **Maximum path sum with this node as the highest point**: This is the maximum sum of any path that has this node as its "highest" point (closest to the root). This path can include:
   - Just the node itself
   - The node + its left child's best upward path
   - The node + its right child's best upward path
   - The node + left child's best upward path + right child's best upward path

We track a global maximum that gets updated with the second value at each node. The first value gets returned to the parent so it can decide whether to include this subtree in its upward path.

Why does this work? Because any path in the tree has exactly one node that is "highest" (closest to the root). Our DFS visits every node and considers it as that highest point, computing the best path through it.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is number of nodes - we visit each node once
# Space: O(h) where h is tree height - recursion stack space
class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        # Initialize result with smallest possible value
        # Using float('-inf') handles trees with all negative values
        self.max_sum = float('-inf')

        def dfs(node):
            """
            Returns the maximum sum of any path that ends at 'node'
            and goes upward (can be extended to parent).
            Also updates global max_sum with best complete path through 'node'.
            """
            if not node:
                return 0

            # Recursively get max upward path sums from children
            # We use max(0, ...) because negative values would reduce the sum
            left_gain = max(0, dfs(node.left))
            right_gain = max(0, dfs(node.right))

            # Current path sum with 'node' as the highest point
            # This is a complete path that cannot be extended upward
            current_path_sum = node.val + left_gain + right_gain

            # Update global maximum if we found a better path
            self.max_sum = max(self.max_sum, current_path_sum)

            # Return the maximum upward path sum ending at 'node'
            # This is what the parent can extend (only one child's path)
            return node.val + max(left_gain, right_gain)

        dfs(root)
        return self.max_sum
```

```javascript
// Time: O(n) where n is number of nodes - we visit each node once
// Space: O(h) where h is tree height - recursion stack space
var maxPathSum = function (root) {
  // Initialize result with smallest possible value
  // Using -Infinity handles trees with all negative values
  let maxSum = -Infinity;

  function dfs(node) {
    /**
     * Returns the maximum sum of any path that ends at 'node'
     * and goes upward (can be extended to parent).
     * Also updates global maxSum with best complete path through 'node'.
     */
    if (!node) return 0;

    // Recursively get max upward path sums from children
    // We use Math.max(0, ...) because negative values would reduce the sum
    const leftGain = Math.max(0, dfs(node.left));
    const rightGain = Math.max(0, dfs(node.right));

    // Current path sum with 'node' as the highest point
    // This is a complete path that cannot be extended upward
    const currentPathSum = node.val + leftGain + rightGain;

    // Update global maximum if we found a better path
    maxSum = Math.max(maxSum, currentPathSum);

    // Return the maximum upward path sum ending at 'node'
    // This is what the parent can extend (only one child's path)
    return node.val + Math.max(leftGain, rightGain);
  }

  dfs(root);
  return maxSum;
};
```

```java
// Time: O(n) where n is number of nodes - we visit each node once
// Space: O(h) where h is tree height - recursion stack space
class Solution {
    private int maxSum;

    public int maxPathSum(TreeNode root) {
        // Initialize result with smallest possible value
        // Using Integer.MIN_VALUE handles trees with all negative values
        maxSum = Integer.MIN_VALUE;

        dfs(root);
        return maxSum;
    }

    private int dfs(TreeNode node) {
        /**
         * Returns the maximum sum of any path that ends at 'node'
         * and goes upward (can be extended to parent).
         * Also updates global maxSum with best complete path through 'node'.
         */
        if (node == null) return 0;

        // Recursively get max upward path sums from children
        // We use Math.max(0, ...) because negative values would reduce the sum
        int leftGain = Math.max(0, dfs(node.left));
        int rightGain = Math.max(0, dfs(node.right));

        // Current path sum with 'node' as the highest point
        // This is a complete path that cannot be extended upward
        int currentPathSum = node.val + leftGain + rightGain;

        // Update global maximum if we found a better path
        maxSum = Math.max(maxSum, currentPathSum);

        // Return the maximum upward path sum ending at 'node'
        // This is what the parent can extend (only one child's path)
        return node.val + Math.max(leftGain, rightGain);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We perform a single depth-first search traversal of the tree
- Each node is visited exactly once
- At each node, we do O(1) work (arithmetic operations and comparisons)

**Space Complexity: O(h)**

- The space is determined by the recursion stack depth
- In the worst case (skewed tree), h = n, so O(n)
- In the best case (balanced tree), h = log n, so O(log n)
- This is the space needed for the call stack, not counting the tree storage itself

## Common Mistakes

1. **Forgetting to handle negative values correctly**: Many candidates forget the `max(0, ...)` when getting child gains. Without this, negative subtree sums would reduce the path sum when we actually shouldn't include those subtrees at all. The key insight: a path doesn't have to include a subtree if it would make the sum worse.

2. **Confusing upward paths with complete paths**: The value returned to the parent (upward path) can only include ONE child's path, but the complete path through a node can include BOTH children. Candidates often return `node.val + left_gain + right_gain` instead of `node.val + max(left_gain, right_gain)`.

3. **Initializing max_sum to 0 instead of -∞**: If all node values are negative, the maximum path sum would be negative. Initializing to 0 would incorrectly return 0 instead of the correct negative value. Always initialize to the smallest possible value for "max" problems.

4. **Not considering the node itself as a valid path**: Some candidates only consider paths with at least two nodes, but a single node is a valid path. Our solution handles this because when both left_gain and right_gain are 0 (or negative), we still have `node.val` as a possible path.

## When You'll See This Pattern

This "DFS with two types of returns" pattern appears in many tree problems:

1. **Diameter of Binary Tree (LeetCode 543)**: Very similar structure—at each node, you compute the longest path through that node (left depth + right depth) and return the maximum depth upward (1 + max(left, right)).

2. **Binary Tree Maximum Path Sum (this problem)**: The exact same pattern.

3. **Longest Univalue Path (LeetCode 687)**: Similar structure where you track both the longest univalue path through a node and the longest univalue path ending at that node.

4. **House Robber III (LeetCode 337)**: Uses a similar "return two values" pattern where you return [rob this node, don't rob this node] pairs.

The common theme: When you need to compute something about paths in a tree, and paths can have a "highest point," do a post-order traversal that computes both "what can I contribute upward to my parent" and "what's the best complete thing in my subtree."

## Key Takeaways

1. **Post-order traversal is powerful for path problems**: When you need information from both children to compute something at a node, post-order (process children first, then node) is often the right approach.

2. **Distinguish between "upward contribution" and "complete solution"**: Many tree problems require you to return one value to the parent (for continuation) while tracking another value globally (for the final answer).

3. **The max(0, ...) trick is crucial**: When you can choose whether to include a subtree (if it hurts the sum), use `max(0, value)` to effectively say "only include if it helps."

Related problems: [Path Sum](/problem/path-sum), [Sum Root to Leaf Numbers](/problem/sum-root-to-leaf-numbers), [Path Sum IV](/problem/path-sum-iv)
