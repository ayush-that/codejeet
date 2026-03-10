---
title: "How to Solve Maximum Level Sum of a Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Level Sum of a Binary Tree. Medium difficulty, 70.0% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2027-04-01"
category: "dsa-patterns"
tags:
  [
    "maximum-level-sum-of-a-binary-tree",
    "tree",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Solve Maximum Level Sum of a Binary Tree

This problem asks us to find the level in a binary tree that has the maximum sum of node values, and if multiple levels have the same maximum sum, return the smallest level number. The challenge lies in efficiently traversing the tree while keeping track of sums per level, which requires careful consideration of traversal strategy and data management.

## Visual Walkthrough

Let's walk through a concrete example to build intuition. Consider this binary tree:

```
        1
       / \
      7   0
     / \
    7  -8
```

**Level 1:** Only node 1 → Sum = 1  
**Level 2:** Nodes 7 and 0 → Sum = 7 + 0 = 7  
**Level 3:** Nodes 7 and -8 → Sum = 7 + (-8) = -1

Now let's trace what happens step by step:

1. We start at the root (level 1, value = 1)
2. We need to process all nodes at level 1 before moving to level 2
3. After processing level 1, we move to level 2: nodes 7 and 0
4. After processing level 2, we move to level 3: nodes 7 and -8
5. We compare sums: Level 1 = 1, Level 2 = 7, Level 3 = -1
6. The maximum sum is 7 at level 2
7. Since we only have one level with sum 7, we return 2

The key insight is that we need to process nodes level by level, which naturally suggests a breadth-first search (BFS) approach using a queue.

## Brute Force Approach

A naive approach might try to use depth-first search (DFS) without proper level tracking. For example, a candidate might try to traverse the tree recursively while passing down the current level, but then struggle to aggregate sums properly because DFS doesn't naturally process all nodes at the same level together.

The brute force approach that does work but is inefficient would be:

1. First, find the maximum depth of the tree (requires O(n) time)
2. For each level from 1 to max depth, traverse the entire tree to sum nodes at that level
3. This gives us O(n × h) time complexity where h is the height of the tree

This approach is inefficient because we're traversing the tree multiple times. In the worst case of a skewed tree (like a linked list), h = n, giving us O(n²) time complexity, which is unacceptable for large trees.

## Optimized Approach

The optimal solution uses **level-order traversal (BFS)** with a queue. Here's the step-by-step reasoning:

1. **Why BFS?** BFS processes nodes level by level, which is exactly what we need. When we use a queue, we can process all nodes at the current level before moving to the next level.

2. **Key Insight:** At each level, we need to:
   - Know how many nodes are at the current level
   - Sum all their values
   - Compare with the maximum sum seen so far

3. **Implementation Strategy:**
   - Use a queue to store nodes to be processed
   - Track the current level number (starting at 1 for the root)
   - For each level, process all nodes currently in the queue (which represent the current level)
   - For each node processed, add its children to the queue for the next level
   - Keep track of the maximum sum and the corresponding level

4. **Handling Ties:** When we find a level with a sum equal to the current maximum, we don't update the level because we want the smallest level number. We only update when we find a strictly larger sum.

## Optimal Solution

Here's the complete solution using BFS with a queue:

<div class="code-group">

```python
# Time: O(n) where n is the number of nodes in the tree
# Space: O(w) where w is the maximum width of the tree (worst case O(n))
from collections import deque

def maxLevelSum(root):
    """
    Returns the smallest level with maximum sum in a binary tree.

    Args:
        root: TreeNode - root of the binary tree

    Returns:
        int - the smallest level with maximum sum
    """
    # Edge case: empty tree
    if not root:
        return 0

    # Initialize queue with root node for BFS
    queue = deque([root])

    # Track current level (root is level 1)
    current_level = 1

    # Track maximum sum and corresponding level
    max_sum = float('-inf')
    max_level = 1

    # Process tree level by level
    while queue:
        # Get number of nodes at current level
        level_size = len(queue)

        # Initialize sum for current level
        level_sum = 0

        # Process all nodes at current level
        for _ in range(level_size):
            # Remove node from front of queue
            node = queue.popleft()

            # Add node value to current level sum
            level_sum += node.val

            # Add children to queue for next level processing
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        # Check if current level has larger sum than maximum seen so far
        if level_sum > max_sum:
            max_sum = level_sum
            max_level = current_level

        # Move to next level
        current_level += 1

    return max_level
```

```javascript
// Time: O(n) where n is the number of nodes in the tree
// Space: O(w) where w is the maximum width of the tree (worst case O(n))

function maxLevelSum(root) {
  /**
   * Returns the smallest level with maximum sum in a binary tree.
   *
   * @param {TreeNode} root - root of the binary tree
   * @return {number} - the smallest level with maximum sum
   */

  // Edge case: empty tree
  if (!root) {
    return 0;
  }

  // Initialize queue with root node for BFS
  const queue = [root];

  // Track current level (root is level 1)
  let currentLevel = 1;

  // Track maximum sum and corresponding level
  let maxSum = -Infinity;
  let maxLevel = 1;

  // Process tree level by level
  while (queue.length > 0) {
    // Get number of nodes at current level
    const levelSize = queue.length;

    // Initialize sum for current level
    let levelSum = 0;

    // Process all nodes at current level
    for (let i = 0; i < levelSize; i++) {
      // Remove node from front of queue
      const node = queue.shift();

      // Add node value to current level sum
      levelSum += node.val;

      // Add children to queue for next level processing
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }

    // Check if current level has larger sum than maximum seen so far
    if (levelSum > maxSum) {
      maxSum = levelSum;
      maxLevel = currentLevel;
    }

    // Move to next level
    currentLevel++;
  }

  return maxLevel;
}
```

```java
// Time: O(n) where n is the number of nodes in the tree
// Space: O(w) where w is the maximum width of the tree (worst case O(n))

import java.util.LinkedList;
import java.util.Queue;

public class Solution {
    public int maxLevelSum(TreeNode root) {
        /**
         * Returns the smallest level with maximum sum in a binary tree.
         *
         * @param root - root of the binary tree
         * @return the smallest level with maximum sum
         */

        // Edge case: empty tree
        if (root == null) {
            return 0;
        }

        // Initialize queue with root node for BFS
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        // Track current level (root is level 1)
        int currentLevel = 1;

        // Track maximum sum and corresponding level
        int maxSum = Integer.MIN_VALUE;
        int maxLevel = 1;

        // Process tree level by level
        while (!queue.isEmpty()) {
            // Get number of nodes at current level
            int levelSize = queue.size();

            // Initialize sum for current level
            int levelSum = 0;

            // Process all nodes at current level
            for (int i = 0; i < levelSize; i++) {
                // Remove node from front of queue
                TreeNode node = queue.poll();

                // Add node value to current level sum
                levelSum += node.val;

                // Add children to queue for next level processing
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }

            // Check if current level has larger sum than maximum seen so far
            if (levelSum > maxSum) {
                maxSum = levelSum;
                maxLevel = currentLevel;
            }

            // Move to next level
            currentLevel++;
        }

        return maxLevel;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once when we process it from the queue
- Each node is enqueued once and dequeued once
- All operations inside the loop (adding to sum, enqueueing children) are O(1)

**Space Complexity: O(w)** where w is the maximum width of the tree

- In the worst case, the queue holds all nodes at the widest level
- For a complete binary tree, the maximum width is roughly n/2 at the last level, giving O(n) space
- For a skewed tree (like a linked list), the width is 1, giving O(1) space
- The worst-case space complexity is O(n) when the tree is perfectly balanced and we store all leaf nodes

## Common Mistakes

1. **Not handling empty tree:** Forgetting to check if root is null can lead to null pointer exceptions. Always include this edge case check at the beginning.

2. **Incorrect level numbering:** Starting level count at 0 instead of 1. The problem explicitly states the root is at level 1, so we need to initialize `currentLevel = 1`.

3. **Not processing all nodes at current level:** A common mistake is to not use the `levelSize` variable to control the inner loop. Without it, we might mix nodes from different levels in our sum calculation.

4. **Wrong comparison for ties:** When finding a level with the same sum as the current maximum, we should NOT update the level because we want the smallest level. The condition should be `levelSum > maxSum`, not `levelSum >= maxSum`.

5. **Using DFS without proper level tracking:** Attempting to use DFS requires maintaining a dictionary or array to store sums per level, which is less intuitive than BFS for this problem.

## When You'll See This Pattern

This level-order traversal pattern appears in many tree problems:

1. **Binary Tree Level Order Traversal (LeetCode 102)** - The classic BFS problem that this pattern is based on
2. **Average of Levels in Binary Tree (LeetCode 637)** - Similar structure but calculating averages instead of sums
3. **Find Largest Value in Each Tree Row (LeetCode 515)** - Another variation where you find maximum per level instead of sum
4. **Binary Tree Right Side View (LeetCode 199)** - Uses BFS but only cares about the last node at each level

The core pattern is: **When you need to process nodes level by level or need information aggregated per level, BFS with queue and level-size tracking is usually the right approach.**

## Key Takeaways

1. **BFS with queue is ideal for level-based operations:** When a problem mentions "level" or requires processing nodes by their depth, think BFS with a queue. The key technique is tracking the number of nodes at the current level before processing them.

2. **The level-size trick is crucial:** Always store `levelSize = queue.size()` before the inner loop to ensure you only process nodes from the current level. This separates level-by-level processing from simple BFS.

3. **Handle ties according to problem requirements:** This problem asks for the smallest level when sums are equal. Other problems might ask for the largest level or have different tie-breaking rules. Always read carefully.

4. **Space complexity depends on tree shape:** For BFS on trees, space complexity is determined by the maximum width (number of nodes at the widest level), not the height. This is O(n) in worst case but often much less in practice.

Related problems: [Kth Largest Sum in a Binary Tree](/problem/kth-largest-sum-in-a-binary-tree), [Cousins in Binary Tree II](/problem/cousins-in-binary-tree-ii)
