---
title: "How to Solve Make Costs of Paths Equal in a Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Make Costs of Paths Equal in a Binary Tree. Medium difficulty, 58.3% acceptance rate. Topics: Array, Dynamic Programming, Greedy, Tree, Binary Tree."
date: "2029-09-03"
category: "dsa-patterns"
tags:
  ["make-costs-of-paths-equal-in-a-binary-tree", "array", "dynamic-programming", "greedy", "medium"]
---

# How to Solve Make Costs of Paths Equal in a Binary Tree

This problem asks us to make all root-to-leaf path sums equal in a perfect binary tree by incrementing node values, with the goal of minimizing the total increments. What makes this problem interesting is that changes to a node affect multiple paths simultaneously, creating dependencies between different parts of the tree. The challenge lies in finding an efficient way to balance these competing requirements while minimizing total cost.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider a tree with 7 nodes (3 levels) and the following initial costs:

```
Node values: [0, 1, 2, 3, 4, 5, 6] (index 0 is unused)
Tree structure:
        1 (1)
       /    \
      2(2)   3(3)
     / \     / \
    4(4)5(5)6(6)7(7)
```

The root-to-leaf paths are:

- Path 1: 1 → 2 → 4 = 1 + 2 + 4 = 7
- Path 2: 1 → 2 → 5 = 1 + 2 + 5 = 8
- Path 3: 1 → 3 → 6 = 1 + 3 + 6 = 10
- Path 4: 1 → 3 → 7 = 1 + 3 + 7 = 11

The maximum path sum is 11. A naive approach would be to increase all shorter paths to match 11:

- Increase node 4 by 4 (7→11)
- Increase node 5 by 3 (8→11)
- Increase node 6 by 1 (10→11)
- Total increase: 4 + 3 + 1 = 8

But we can do better! Notice that increasing node 2 affects both paths through it (1→2→4 and 1→2→5). If we increase node 2 by 3, then:

- Path 1: 1 + (2+3) + 4 = 10
- Path 2: 1 + (2+3) + 5 = 11
- Now we only need to increase node 4 by 1 (10→11)
- Total increase: 3 + 1 = 4

This is much better! The key insight is that we should work from the bottom up, making sibling nodes equal first, then propagating the required changes upward.

## Brute Force Approach

A brute force approach would try all possible combinations of increments to make all path sums equal. For each leaf node, we could try increasing it by various amounts, then check if all paths are equal.

The problem with this approach is exponential complexity. With n nodes and potentially large cost values, there are far too many possibilities to explore. Even for a small tree with 15 nodes, if each node could be increased by up to 1000, we'd have 1000¹⁵ possibilities - completely infeasible.

What candidates might try is a greedy top-down approach: find the maximum path sum, then try to increase nodes to reach that maximum. But this fails because increasing a node affects multiple paths differently, and a local greedy choice might lead to suboptimal global results.

## Optimized Approach

The key insight is that we need to work from the leaves upward. At each internal node, we look at its two children and make their subtree path sums equal by increasing the smaller one. Then we propagate the maximum of the two upward.

Here's the step-by-step reasoning:

1. **Bottom-up processing**: Since changes to parent nodes affect all paths through them, we should process from leaves to root. This ensures we make local decisions that don't need to be revisited.

2. **Equalizing siblings**: For each internal node, we look at the maximum path sum from that node through its left subtree and right subtree. We make them equal by increasing nodes in the smaller subtree.

3. **Propagation**: After equalizing the two subtrees, the path sum from the current node downward is the maximum of its two children's path sums plus the node's own value.

4. **Counting increments**: Every time we increase a node value to make subtrees equal, we add that increase to our total answer.

The algorithm works because:

- Making sibling subtrees equal at each level is optimal (proof by contradiction: if they weren't equal, we could reduce total cost by transferring some increments between them)
- Bottom-up processing ensures each decision is final
- The total increments equal the sum of all differences we had to reconcile at each internal node

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1) ignoring input storage, O(n) for the tree
def minIncrements(self, n: int, cost: List[int]) -> int:
    """
    Makes all root-to-leaf path sums equal with minimum total increments.

    Args:
        n: Number of nodes in the perfect binary tree
        cost: List of node costs (1-indexed, index 0 is unused for convenience)

    Returns:
        Minimum total increments needed
    """
    total_increments = 0

    # Process nodes from last internal node to first (bottom-up)
    # In a perfect binary tree, the first n//2 nodes are internal nodes
    for i in range(n // 2 - 1, -1, -1):
        # Convert to 1-based indexing for easier child calculation
        node_idx = i + 1

        # Get indices of left and right children (1-based)
        left_child = 2 * node_idx
        right_child = 2 * node_idx + 1

        # Convert back to 0-based for array access
        left_idx = left_child - 1
        right_idx = right_child - 1

        # Get the maximum path sum from each child
        left_max = cost[left_idx]
        right_max = cost[right_idx]

        # We need to make both subtrees have equal maximum path sums
        # The difference tells us how much we need to add to the smaller subtree
        diff = abs(left_max - right_max)
        total_increments += diff

        # Update current node's cost to represent the maximum path sum
        # from this node downward after equalization
        cost[i] += max(left_max, right_max)

    return total_increments
```

```javascript
// Time: O(n) | Space: O(1) ignoring input storage, O(n) for the tree
/**
 * Makes all root-to-leaf path sums equal with minimum total increments.
 *
 * @param {number} n - Number of nodes in the perfect binary tree
 * @param {number[]} cost - Array of node costs (1-indexed, index 0 is unused for convenience)
 * @return {number} Minimum total increments needed
 */
var minIncrements = function (n, cost) {
  let totalIncrements = 0;

  // Process nodes from last internal node to first (bottom-up)
  // In a perfect binary tree, the first n//2 nodes are internal nodes
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    // Convert to 1-based indexing for easier child calculation
    const nodeIdx = i + 1;

    // Get indices of left and right children (1-based)
    const leftChild = 2 * nodeIdx;
    const rightChild = 2 * nodeIdx + 1;

    // Convert back to 0-based for array access
    const leftIdx = leftChild - 1;
    const rightIdx = rightChild - 1;

    // Get the maximum path sum from each child
    const leftMax = cost[leftIdx];
    const rightMax = cost[rightIdx];

    // We need to make both subtrees have equal maximum path sums
    // The difference tells us how much we need to add to the smaller subtree
    const diff = Math.abs(leftMax - rightMax);
    totalIncrements += diff;

    // Update current node's cost to represent the maximum path sum
    // from this node downward after equalization
    cost[i] += Math.max(leftMax, rightMax);
  }

  return totalIncrements;
};
```

```java
// Time: O(n) | Space: O(1) ignoring input storage, O(n) for the tree
class Solution {
    /**
     * Makes all root-to-leaf path sums equal with minimum total increments.
     *
     * @param n Number of nodes in the perfect binary tree
     * @param cost Array of node costs (1-indexed, index 0 is unused for convenience)
     * @return Minimum total increments needed
     */
    public int minIncrements(int n, int[] cost) {
        int totalIncrements = 0;

        // Process nodes from last internal node to first (bottom-up)
        // In a perfect binary tree, the first n/2 nodes are internal nodes
        for (int i = n / 2 - 1; i >= 0; i--) {
            // Convert to 1-based indexing for easier child calculation
            int nodeIdx = i + 1;

            // Get indices of left and right children (1-based)
            int leftChild = 2 * nodeIdx;
            int rightChild = 2 * nodeIdx + 1;

            // Convert back to 0-based for array access
            int leftIdx = leftChild - 1;
            int rightIdx = rightChild - 1;

            // Get the maximum path sum from each child
            int leftMax = cost[leftIdx];
            int rightMax = cost[rightIdx];

            // We need to make both subtrees have equal maximum path sums
            // The difference tells us how much we need to add to the smaller subtree
            int diff = Math.abs(leftMax - rightMax);
            totalIncrements += diff;

            // Update current node's cost to represent the maximum path sum
            // from this node downward after equalization
            cost[i] += Math.max(leftMax, rightMax);
        }

        return totalIncrements;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each internal node exactly once
- In a perfect binary tree with n nodes, there are n/2 internal nodes
- Each node requires constant time operations (comparisons, additions)

**Space Complexity: O(1) extra space**

- We only use a few integer variables (total_increments, indices, differences)
- We modify the input array in place, so no additional data structures are needed
- If we consider the input storage, it's O(n) for the cost array

The linear time complexity is optimal since we must examine each node at least once to compute the solution.

## Common Mistakes

1. **Top-down instead of bottom-up processing**: Many candidates try to work from the root downward, but this leads to repeated work. When you increase a parent node, you affect all paths through it, potentially requiring you to revisit previously "fixed" paths. Bottom-up processing ensures each decision is final.

2. **Incorrect index calculations**: The problem uses 1-based indexing for nodes but 0-based indexing for arrays. Common errors include:
   - Forgetting to convert between 1-based and 0-based indices
   - Incorrect child calculations (should be 2*i and 2*i+1 for 1-based indices)
   - Off-by-one errors in loop boundaries

3. **Not understanding what cost[i] represents**: After processing a node, we update cost[i] to represent the maximum path sum from that node downward. Some candidates mistakenly think it should be the node's original value or something else.

4. **Trying to actually modify the tree structure**: The problem only asks for the minimum total increments, not to actually construct the modified tree. Some candidates waste time building tree data structures or tracking individual node increments instead of just accumulating the total.

## When You'll See This Pattern

This bottom-up tree processing pattern appears in several tree problems:

1. **Binary Tree Maximum Path Sum (LeetCode 124)**: Similar bottom-up approach where each node returns the maximum path sum through it, while updating a global maximum.

2. **House Robber III (LeetCode 337)**: Uses post-order traversal to process children before parents, making decisions based on subtree results.

3. **Distribute Coins in Binary Tree (LeetCode 979)**: Another bottom-up tree problem where you calculate excess/deficit at each node and propagate the balance upward.

The common theme is that when a node's value affects multiple paths or subtrees, processing from leaves to root allows you to make local decisions that don't need to be revisited.

## Key Takeaways

1. **Bottom-up tree processing is powerful**: When dealing with tree problems where parent decisions depend on children results, consider post-order traversal or processing from leaves to root.

2. **Look for opportunities to propagate information upward**: Instead of storing intermediate results in separate data structures, often you can modify node values to represent computed information about their subtrees.

3. **Perfect binary tree properties simplify indexing**: Knowing that node i has children 2i and 2i+1 (1-based) allows efficient array-based tree representation without explicit pointers.

[Practice this problem on CodeJeet](/problem/make-costs-of-paths-equal-in-a-binary-tree)
