---
title: "How to Solve Binary Tree Level Order Traversal II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Binary Tree Level Order Traversal II. Medium difficulty, 67.7% acceptance rate. Topics: Tree, Breadth-First Search, Binary Tree."
date: "2026-12-09"
category: "dsa-patterns"
tags:
  ["binary-tree-level-order-traversal-ii", "tree", "breadth-first-search", "binary-tree", "medium"]
---

# How to Solve Binary Tree Level Order Traversal II

This problem asks us to traverse a binary tree level by level, but instead of returning the levels from top to bottom, we need to return them from bottom to top. While this sounds like a simple variation of the classic level order traversal problem, it introduces an interesting twist that requires careful consideration of how we collect and reverse the results.

What makes this problem interesting is that we can't simply traverse from the bottom up—binary trees don't have parent pointers that allow easy upward traversal. Instead, we need to perform a standard level order traversal and then reverse the results, or find a way to build the result list from the bottom up as we traverse.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this binary tree:

```
        3
       / \
      9   20
         /  \
        15   7
```

**Step 1: Standard Level Order Traversal**
If we did a normal level order traversal (top to bottom), we'd get:

- Level 0: [3]
- Level 1: [9, 20]
- Level 2: [15, 7]

**Step 2: Reverse for Bottom-Up Order**
To get the bottom-up order, we simply reverse this list:

- Level 2: [15, 7]
- Level 1: [9, 20]
- Level 0: [3]

So the final result would be `[[15, 7], [9, 20], [3]]`.

**Step-by-step BFS Process:**

1. Start with root node 3 in the queue
2. Process level 0: queue has [3] → process all nodes at current level → add [3] to result
3. Add children of 3 to queue: [9, 20]
4. Process level 1: queue has [9, 20] → process all nodes → add [9, 20] to result
5. Add children: 9 has no children, 20 has children 15 and 7 → queue becomes [15, 7]
6. Process level 2: queue has [15, 7] → process all nodes → add [15, 7] to result
7. Queue is empty, traversal complete
8. Reverse the result list: `[[3], [9, 20], [15, 7]]` becomes `[[15, 7], [9, 20], [3]]`

## Brute Force Approach

For this problem, there isn't really a "brute force" solution in the traditional sense, as any solution needs to visit every node at least once. However, a naive approach might try to:

1. Perform a depth-first search (DFS) while keeping track of depth
2. Store nodes at each depth in a dictionary
3. Sort the dictionary by depth in descending order
4. Convert to list format

While this approach would work, it's unnecessarily complex compared to the BFS approach. The main issue isn't time complexity (both approaches are O(n)), but rather that DFS doesn't naturally give us level-by-level ordering. We'd need to sort the results by depth, which adds complexity.

Another naive approach might try to traverse from the bottom up by finding the maximum depth first, then traversing again to collect nodes at each depth. This would require two passes through the tree, which is less efficient than the optimal single-pass BFS approach.

## Optimized Approach

The key insight is that we can use **Breadth-First Search (BFS)** with a queue to traverse the tree level by level. BFS naturally processes nodes level by level, which is exactly what we need.

Here's the step-by-step reasoning:

1. **Use a queue for BFS**: We'll process nodes level by level using a queue (FIFO structure).
2. **Track level boundaries**: At each iteration, we process all nodes currently in the queue (which represent one complete level).
3. **Collect level values**: For each level, we collect all node values into a list.
4. **Add children to queue**: After processing a node, we add its left and right children (if they exist) to the queue for the next level.
5. **Reverse the result**: Since BFS gives us levels from top to bottom, we simply reverse the final list to get bottom-up order.

An alternative approach is to add each new level to the beginning of the result list instead of the end, which avoids the need to reverse at the end. This is more efficient since adding to the beginning of a list is O(1) for linked lists (though in practice, Python lists and JavaScript arrays have O(n) insertion at the beginning).

## Optimal Solution

The optimal solution uses BFS with a queue. We traverse the tree level by level, collecting values for each level, then reverse the result list at the end.

<div class="code-group">

```python
# Time: O(n) where n is the number of nodes in the tree
# Space: O(n) for the queue and result storage
from collections import deque
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def levelOrderBottom(self, root: Optional[TreeNode]) -> List[List[int]]:
        # Handle empty tree case
        if not root:
            return []

        # Initialize result list to store levels
        result = []
        # Use deque for efficient queue operations (popleft is O(1))
        queue = deque([root])

        # Process tree level by level
        while queue:
            # Get number of nodes at current level
            level_size = len(queue)
            # List to store values of current level
            current_level = []

            # Process all nodes at current level
            for _ in range(level_size):
                # Get next node from queue (FIFO)
                node = queue.popleft()
                # Add node value to current level list
                current_level.append(node.val)

                # Add children to queue for next level processing
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

            # Add current level to result
            result.append(current_level)

        # Reverse result to get bottom-up order
        return result[::-1]
```

```javascript
// Time: O(n) where n is the number of nodes in the tree
// Space: O(n) for the queue and result storage

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrderBottom = function (root) {
  // Handle empty tree case
  if (!root) {
    return [];
  }

  // Initialize result array to store levels
  const result = [];
  // Use array as queue (shift operation is O(n) but acceptable for this problem)
  const queue = [root];

  // Process tree level by level
  while (queue.length > 0) {
    // Get number of nodes at current level
    const levelSize = queue.length;
    // Array to store values of current level
    const currentLevel = [];

    // Process all nodes at current level
    for (let i = 0; i < levelSize; i++) {
      // Get next node from queue (FIFO)
      const node = queue.shift();
      // Add node value to current level array
      currentLevel.push(node.val);

      // Add children to queue for next level processing
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }

    // Add current level to result
    result.push(currentLevel);
  }

  // Reverse result to get bottom-up order
  return result.reverse();
};
```

```java
// Time: O(n) where n is the number of nodes in the tree
// Space: O(n) for the queue and result storage

import java.util.*;

/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public List<List<Integer>> levelOrderBottom(TreeNode root) {
        // Initialize result list
        List<List<Integer>> result = new ArrayList<>();

        // Handle empty tree case
        if (root == null) {
            return result;
        }

        // Use LinkedList as queue for efficient operations
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        // Process tree level by level
        while (!queue.isEmpty()) {
            // Get number of nodes at current level
            int levelSize = queue.size();
            // List to store values of current level
            List<Integer> currentLevel = new ArrayList<>();

            // Process all nodes at current level
            for (int i = 0; i < levelSize; i++) {
                // Get next node from queue (FIFO)
                TreeNode node = queue.poll();
                // Add node value to current level list
                currentLevel.add(node.val);

                // Add children to queue for next level processing
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }

            // Add current level to result
            result.add(currentLevel);
        }

        // Reverse result to get bottom-up order
        Collections.reverse(result);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once when we process it from the queue
- Each node is added to the queue once and removed once
- The reversal operation at the end is O(L) where L is the number of levels, which is at most O(n) in the worst case (skewed tree)
- Overall time complexity is linear in the number of nodes

**Space Complexity: O(n)**

- The queue can hold at most the width of the tree, which in the worst case (complete binary tree) is about n/2 nodes at the last level
- The result list stores all n node values
- In the worst case, we need O(n) space for both the queue and result storage

## Common Mistakes

1. **Forgetting to handle the empty tree case**: Always check if `root` is `null`/`None` at the beginning. An empty tree should return an empty list, not `null` or cause an error.

2. **Not tracking level boundaries properly**: A common mistake is to use a single loop without tracking how many nodes are in the current level. This mixes nodes from different levels. The key is to get `queue.size()` at the beginning of each level and only process that many nodes.

3. **Adding null children to the queue**: When checking children, only add them to the queue if they're not null. Adding null nodes will cause null pointer exceptions when you try to access their values.

4. **Inefficient reversal**: Some candidates try to insert each new level at the beginning of the result list (using `result.insert(0, currentLevel)` in Python or `result.unshift(currentLevel)` in JavaScript). While this works, it's O(n) per level insertion, making the overall time complexity O(n²) in the worst case. It's better to append and reverse once at the end.

## When You'll See This Pattern

The BFS level-order traversal pattern appears in many tree problems:

1. **Binary Tree Level Order Traversal (LeetCode 102)**: The classic version of this problem (top to bottom).
2. **Average of Levels in Binary Tree (LeetCode 637)**: Uses the same BFS approach but calculates averages instead of collecting all values.
3. **Binary Tree Zigzag Level Order Traversal (LeetCode 103)**: Similar BFS approach but alternates direction at each level.
4. **Find Largest Value in Each Tree Row (LeetCode 515)**: Uses BFS to find the maximum value at each level.
5. **N-ary Tree Level Order Traversal (LeetCode 429)**: Same pattern but generalized to trees with more than two children per node.

The core pattern is: when you need to process a tree level by level, BFS with a queue is almost always the right approach. The queue ensures you process nodes in the order they were discovered, which naturally corresponds to level order.

## Key Takeaways

1. **BFS with a queue is the standard approach for level-order traversal**: Whenever a problem mentions "level by level" or "row by row" in a tree, think BFS with a queue.

2. **Track level boundaries by processing nodes in batches**: Get the queue size at the start of each level and only process that many nodes to ensure you don't mix levels.

3. **Bottom-up is just top-down reversed**: For this specific variation, don't overcomplicate it. Perform a standard level-order traversal and reverse the result at the end.

4. **The pattern generalizes beyond binary trees**: The same BFS approach works for N-ary trees, graphs (with visited tracking), and other hierarchical structures.

Related problems: [Binary Tree Level Order Traversal](/problem/binary-tree-level-order-traversal), [Average of Levels in Binary Tree](/problem/average-of-levels-in-binary-tree)
