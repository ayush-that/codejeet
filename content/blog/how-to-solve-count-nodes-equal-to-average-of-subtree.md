---
title: "How to Solve Count Nodes Equal to Average of Subtree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Nodes Equal to Average of Subtree. Medium difficulty, 86.7% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2026-02-05"
category: "dsa-patterns"
tags:
  ["count-nodes-equal-to-average-of-subtree", "tree", "depth-first-search", "binary-tree", "medium"]
---

# How to Solve Count Nodes Equal to Average of Subtree

This problem asks us to count how many nodes in a binary tree have a value equal to the average of all values in their subtree (including themselves). The tricky part is that we need to compute both the sum and count of nodes for each subtree efficiently. A naive approach would repeatedly traverse subtrees, but we can do much better with a single post-order traversal.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this tree:

```
      4
     / \
    8   5
   / \
  0   1
```

We need to check each node:

1. **Node 0 (leaf)**: Subtree = {0}. Sum = 0, count = 1. Average = 0/1 = 0. Node value = 0 ✓ (counts)
2. **Node 1 (leaf)**: Subtree = {1}. Sum = 1, count = 1. Average = 1/1 = 1. Node value = 1 ✓ (counts)
3. **Node 8**: Subtree = {8, 0, 1}. Sum = 8+0+1 = 9, count = 3. Average = 9/3 = 3. Node value = 8 ✗ (doesn't count)
4. **Node 5 (leaf)**: Subtree = {5}. Sum = 5, count = 1. Average = 5/1 = 5. Node value = 5 ✓ (counts)
5. **Node 4**: Subtree = {4, 8, 0, 1, 5}. Sum = 4+8+0+1+5 = 18, count = 5. Average = 18/5 = 3 (rounded down). Node value = 4 ✗ (doesn't count)

Total count = 3 (nodes 0, 1, and 5).

The key insight: to compute a node's subtree average, we need the sum and count of all nodes in that subtree. We could compute this from scratch for each node, but that's inefficient. Instead, we can compute it bottom-up: each node can use the sum and count from its children to compute its own subtree statistics.

## Brute Force Approach

A naive solution would be to write a helper function that traverses each node's entire subtree to calculate the sum and count. For each node in the tree, we would:

1. Traverse the entire subtree rooted at that node to compute the sum of values
2. Count the number of nodes in that subtree
3. Calculate the average (sum // count)
4. Compare the node's value to this average

This approach has O(n²) time complexity in the worst case (for a skewed tree) because for each of n nodes, we might traverse O(n) nodes in its subtree. For a balanced tree, it's still O(n log n) due to overlapping traversals. The space complexity would be O(h) for the recursion stack, where h is the tree height.

While this would technically work, it's inefficient for larger trees. The main issue is redundant work: we're repeatedly traversing the same nodes. For example, when computing statistics for a parent node, we end up traversing all its descendants again, even though we already traversed them when computing statistics for the child nodes.

## Optimized Approach

The optimal solution uses a **post-order traversal** (DFS) with a single pass through the tree. Here's the key insight:

For any node, the statistics of its subtree = (node's value + left subtree statistics + right subtree statistics).

If we define a helper function that returns both the sum and count for a subtree, we can:

1. Recursively process left and right children first (post-order)
2. Combine their results with the current node's value
3. Check if the current node's value equals the average of its subtree
4. Return the combined statistics to the parent

This way, each node is visited exactly once, and we compute all necessary information in O(n) time.

We'll use a global counter (or a mutable reference) to track how many nodes satisfy the condition. The helper function returns a pair (sum, count) for the subtree rooted at the current node.

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
# Space: O(h) - Where h is the height of the tree (recursion stack)
class Solution:
    def averageOfSubtree(self, root):
        # Initialize counter for nodes that match the condition
        self.count = 0

        def dfs(node):
            """
            Post-order traversal that returns (sum, count) for subtree.
            Also updates the global count if current node matches average.
            """
            if not node:
                # Base case: empty subtree has sum=0, count=0
                return 0, 0

            # Recursively process left and right subtrees
            left_sum, left_count = dfs(node.left)
            right_sum, right_count = dfs(node.right)

            # Compute current subtree statistics
            # Sum = current value + sum of left subtree + sum of right subtree
            curr_sum = node.val + left_sum + right_sum
            # Count = 1 (current node) + count of left subtree + count of right subtree
            curr_count = 1 + left_count + right_count

            # Calculate average (integer division rounds down)
            avg = curr_sum // curr_count

            # Check if current node's value equals the average
            if node.val == avg:
                self.count += 1

            # Return statistics to parent
            return curr_sum, curr_count

        # Start DFS from root
        dfs(root)
        return self.count
```

```javascript
// Definition for a binary tree node.
// function TreeNode(val, left, right) {
//     this.val = (val===undefined ? 0 : val)
//     this.left = (left===undefined ? null : left)
//     this.right = (right===undefined ? null : right)
// }

// Time: O(n) - We visit each node exactly once
// Space: O(h) - Where h is the height of the tree (recursion stack)
/**
 * @param {TreeNode} root
 * @return {number}
 */
var averageOfSubtree = function (root) {
  // Counter for nodes that match the condition
  let count = 0;

  /**
   * Post-order traversal that returns [sum, count] for subtree.
   * Also updates count if current node matches average.
   * @param {TreeNode} node - Current node being processed
   * @return {number[]} - Array containing [sum, count] of subtree
   */
  function dfs(node) {
    if (!node) {
      // Base case: empty subtree has sum=0, count=0
      return [0, 0];
    }

    // Recursively process left and right subtrees
    const [leftSum, leftCount] = dfs(node.left);
    const [rightSum, rightCount] = dfs(node.right);

    // Compute current subtree statistics
    // Sum = current value + sum of left subtree + sum of right subtree
    const currSum = node.val + leftSum + rightSum;
    // Count = 1 (current node) + count of left subtree + count of right subtree
    const currCount = 1 + leftCount + rightCount;

    // Calculate average (Math.floor for integer division)
    const avg = Math.floor(currSum / currCount);

    // Check if current node's value equals the average
    if (node.val === avg) {
      count++;
    }

    // Return statistics to parent
    return [currSum, currCount];
  }

  // Start DFS from root
  dfs(root);
  return count;
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

// Time: O(n) - We visit each node exactly once
// Space: O(h) - Where h is the height of the tree (recursion stack)
class Solution {
    // Counter for nodes that match the condition
    private int count = 0;

    public int averageOfSubtree(TreeNode root) {
        // Start DFS from root
        dfs(root);
        return count;
    }

    /**
     * Post-order traversal that returns int[] {sum, count} for subtree.
     * Also updates count if current node matches average.
     * @param node - Current node being processed
     * @return int[] - Array containing {sum, count} of subtree
     */
    private int[] dfs(TreeNode node) {
        if (node == null) {
            // Base case: empty subtree has sum=0, count=0
            return new int[]{0, 0};
        }

        // Recursively process left and right subtrees
        int[] left = dfs(node.left);
        int[] right = dfs(node.right);

        // Compute current subtree statistics
        // Sum = current value + sum of left subtree + sum of right subtree
        int currSum = node.val + left[0] + right[0];
        // Count = 1 (current node) + count of left subtree + count of right subtree
        int currCount = 1 + left[1] + right[1];

        // Calculate average (integer division rounds down)
        int avg = currSum / currCount;

        // Check if current node's value equals the average
        if (node.val == avg) {
            count++;
        }

        // Return statistics to parent
        return new int[]{currSum, currCount};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We perform a single DFS traversal of the entire tree
- Each node is visited exactly once
- At each node, we perform O(1) operations (addition, division, comparison)

**Space Complexity: O(h)**

- The space is dominated by the recursion call stack
- In the worst case (skewed tree), h = n, so O(n)
- In the best case (balanced tree), h = log n, so O(log n)
- We also use O(1) extra space per node for the return values, but these are on the stack

## Common Mistakes

1. **Forgetting integer division rounding**: The problem specifies "rounded down to the nearest integer." Using regular division (which produces floats) and then comparing to an integer node value will fail for cases like subtree average = 3.6 (should round to 3). Always use integer division (// in Python, Math.floor in JavaScript, / with integers in Java).

2. **Incorrect base case handling**: When a node is null, we must return (0, 0) for sum and count. Returning (0, 1) or any other values would incorrectly affect parent calculations. Remember: an empty subtree has no sum and no nodes.

3. **Not using post-order traversal**: Attempting to compute statistics top-down won't work efficiently. We need children's statistics before we can compute parent statistics. Post-order (left, right, then current) is essential.

4. **Mixing up sum and count in return values**: The helper function must return both values consistently. Swapping them or returning them in the wrong order will cause incorrect average calculations throughout the tree.

## When You'll See This Pattern

This "bottom-up aggregation" pattern appears in many tree problems where you need to compute subtree statistics:

1. **Maximum Average Subtree (LeetCode 1120)**: Very similar - instead of counting nodes that match their subtree average, you find the maximum average among all subtrees. The same post-order approach works.

2. **Count Nodes Equal to Sum of Descendants (LeetCode 1973)**: Another counting problem where you need subtree sums to compare with node values.

3. **Binary Tree Maximum Path Sum (LeetCode 124)**: While more complex, it uses a similar bottom-up approach where each node computes best path sums from its children and combines them.

The core pattern: when you need information from children to compute something for the parent, use post-order traversal. Each recursive call returns aggregated information about its subtree.

## Key Takeaways

1. **Post-order traversal enables bottom-up computation**: When you need to aggregate information from children to parents (like subtree sums, counts, averages), process children first, then the current node.

2. **Return multiple values when needed**: Don't be afraid to have helper functions return tuples/arrays/objects containing multiple computed values. This avoids redundant traversals.

3. **Tree problems often have O(n) solutions**: With careful single-pass algorithms, most tree problems can be solved in linear time. The challenge is designing the right traversal order and return values.

Related problems: [Maximum Average Subtree](/problem/maximum-average-subtree), [Insufficient Nodes in Root to Leaf Paths](/problem/insufficient-nodes-in-root-to-leaf-paths), [Count Nodes Equal to Sum of Descendants](/problem/count-nodes-equal-to-sum-of-descendants)
