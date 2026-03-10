---
title: "How to Solve Average of Levels in Binary Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Average of Levels in Binary Tree. Easy difficulty, 74.7% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2027-01-10"
category: "dsa-patterns"
tags:
  ["average-of-levels-in-binary-tree", "tree", "depth-first-search", "breadth-first-search", "easy"]
---

# How to Solve Average of Levels in Binary Tree

This problem asks us to compute the average value of nodes at each level of a binary tree and return them as an array. While conceptually straightforward, it requires careful level-by-level traversal and demonstrates fundamental tree traversal techniques. The interesting aspect is that we need to process nodes level by level rather than in a simple depth-first manner, which makes breadth-first search the natural approach.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this binary tree:

```
        3
       / \
      9   20
         /  \
        15   7
```

**Level 0:** Only node 3 → Average = 3/1 = 3.0  
**Level 1:** Nodes 9 and 20 → Average = (9 + 20)/2 = 14.5  
**Level 2:** Nodes 15 and 7 → Average = (15 + 7)/2 = 11.0

The expected output would be `[3.0, 14.5, 11.0]`.

Now let's think about how to compute this systematically. We need to:

1. Process all nodes at the current level
2. Calculate their sum and count
3. Move to the next level
4. Repeat until no more levels exist

This level-by-level processing is exactly what breadth-first search (BFS) with a queue provides. We'll use a queue to track nodes at the current level, process them, then enqueue their children for the next level.

## Brute Force Approach

While there isn't a true "brute force" that's fundamentally different from the optimal approach for this problem, a naive implementation might try to use depth-first search (DFS) without proper level tracking. For example, someone might try to traverse the tree recursively while maintaining a global list of sums and counts, but this requires careful coordination between recursive calls to ensure nodes at the same level are grouped correctly.

The challenge with a DFS approach is that it doesn't naturally process nodes level by level. You'd need to:

1. Track the current depth during recursion
2. Maintain separate arrays for sums and counts at each depth
3. Ensure you visit all nodes before calculating averages

While this is possible, it's more error-prone than the BFS approach. The BFS solution is cleaner because it naturally processes nodes level by level using a queue.

## Optimal Solution

The optimal solution uses breadth-first search with a queue. We process each level completely before moving to the next, calculating the average as we go. Here's the step-by-step approach:

1. Initialize a queue with the root node (if it exists)
2. While the queue is not empty:
   - Get the number of nodes at the current level (queue size)
   - Initialize sum for current level to 0
   - Process exactly that many nodes:
     - Dequeue a node
     - Add its value to the level sum
     - Enqueue its left and right children (if they exist)
   - Calculate average = sum / count
   - Add average to result list
3. Return result list

<div class="code-group">

```python
# Time: O(n) where n is number of nodes - we visit each node once
# Space: O(m) where m is maximum nodes at any level (worst case O(n) for complete tree)
from collections import deque
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def averageOfLevels(self, root: Optional[TreeNode]) -> List[float]:
        # Handle empty tree case
        if not root:
            return []

        result = []  # Will store averages for each level
        queue = deque([root])  # Initialize queue with root node

        # Process tree level by level
        while queue:
            level_size = len(queue)  # Number of nodes at current level
            level_sum = 0  # Sum of values at current level

            # Process all nodes at current level
            for _ in range(level_size):
                node = queue.popleft()  # Get next node from current level
                level_sum += node.val  # Add its value to level sum

                # Add children to queue for next level processing
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

            # Calculate average for current level and add to result
            level_average = level_sum / level_size
            result.append(level_average)

        return result
```

```javascript
// Time: O(n) where n is number of nodes - we visit each node once
// Space: O(m) where m is maximum nodes at any level (worst case O(n) for complete tree)

function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var averageOfLevels = function (root) {
  // Handle empty tree case
  if (!root) return [];

  const result = []; // Will store averages for each level
  const queue = [root]; // Initialize queue with root node

  // Process tree level by level
  while (queue.length > 0) {
    const levelSize = queue.length; // Number of nodes at current level
    let levelSum = 0; // Sum of values at current level

    // Process all nodes at current level
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift(); // Get next node from current level
      levelSum += node.val; // Add its value to level sum

      // Add children to queue for next level processing
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    // Calculate average for current level and add to result
    const levelAverage = levelSum / levelSize;
    result.push(levelAverage);
  }

  return result;
};
```

```java
// Time: O(n) where n is number of nodes - we visit each node once
// Space: O(m) where m is maximum nodes at any level (worst case O(n) for complete tree)

import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    public List<Double> averageOfLevels(TreeNode root) {
        // Handle empty tree case
        List<Double> result = new ArrayList<>();
        if (root == null) return result;

        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);  // Initialize queue with root node

        // Process tree level by level
        while (!queue.isEmpty()) {
            int levelSize = queue.size();  // Number of nodes at current level
            double levelSum = 0;  // Sum of values at current level

            // Process all nodes at current level
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();  // Get next node from current level
                levelSum += node.val;  // Add its value to level sum

                // Add children to queue for next level processing
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }

            // Calculate average for current level and add to result
            double levelAverage = levelSum / levelSize;
            result.add(levelAverage);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the tree. We visit each node exactly once when we process it from the queue.

**Space Complexity:** O(m) where m is the maximum number of nodes at any level. In the worst case (a complete binary tree), the last level contains roughly n/2 nodes, giving us O(n) space complexity. The queue stores nodes at the current level being processed.

The space complexity comes from:

1. The queue storing nodes at the current level
2. The result array storing one value per level (O(h) where h is tree height, which is negligible compared to queue storage)

## Common Mistakes

1. **Not handling the empty tree case:** Forgetting to check if `root` is `null`/`None` will cause null pointer errors. Always check for empty input first.

2. **Incorrect level processing:** A common mistake is to use `while (!queue.isEmpty())` without tracking level size, which mixes nodes from different levels. The key is to capture `queue.size()` before processing each level and only process that many nodes.

3. **Integer division errors:** In languages like Java and Python 2, dividing integers gives integer results. We need floating-point division. In Python 3, regular division works, but in Java, we need to ensure at least one operand is a `double`.

4. **Forgetting to use a proper queue data structure:** Using a list and popping from the front (index 0) in Python or JavaScript has O(n) time complexity for each pop, making the overall algorithm O(n²). Always use `deque` in Python or manage indices properly in JavaScript.

## When You'll See This Pattern

This level-order traversal pattern appears in many tree problems:

1. **Binary Tree Level Order Traversal (LeetCode 102)** - Almost identical to this problem, but instead of averages, you return lists of values at each level.

2. **Binary Tree Level Order Traversal II (LeetCode 107)** - Same as above, but you return levels from bottom to top.

3. **Find Largest Value in Each Tree Row (LeetCode 515)** - Instead of averages, you find the maximum value at each level.

4. **Binary Tree Right Side View (LeetCode 199)** - Uses level-order traversal but only keeps the last node at each level.

The core pattern is: when you need to process a tree level by level, use BFS with a queue and track the level size before processing each level.

## Key Takeaways

1. **Breadth-first search with a queue is the natural choice for level-by-level processing** of trees. The queue ensures nodes are processed in the order they're discovered.

2. **Always capture the queue size before processing a level** to know how many nodes belong to the current level. This prevents mixing nodes from different levels.

3. **This pattern extends to any problem requiring level-specific computations** - whether it's averages, sums, maximums, or just collecting values.

Related problems: [Binary Tree Level Order Traversal](/problem/binary-tree-level-order-traversal), [Binary Tree Level Order Traversal II](/problem/binary-tree-level-order-traversal-ii)
