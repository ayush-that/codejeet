---
title: "How to Solve Binary Tree Zigzag Level Order Traversal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Binary Tree Zigzag Level Order Traversal. Medium difficulty, 63.2% acceptance rate. Topics: Tree, Breadth-First Search, Binary Tree."
date: "2026-06-17"
category: "dsa-patterns"
tags:
  [
    "binary-tree-zigzag-level-order-traversal",
    "tree",
    "breadth-first-search",
    "binary-tree",
    "medium",
  ]
---

# How to Solve Binary Tree Zigzag Level Order Traversal

This problem asks us to traverse a binary tree level by level, but with a twist: we alternate the direction of traversal for each level. The first level goes left-to-right, the second right-to-left, the third left-to-right, and so on. What makes this interesting is that it combines standard level-order traversal (BFS) with direction toggling, requiring careful handling of node processing order and result formatting.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this binary tree:

```
        3
       / \
      9   20
         /  \
        15   7
```

**Step 1: Level 0 (depth 0, left-to-right)**

- Process root node 3 → add [3] to result

**Step 2: Level 1 (depth 1, right-to-left)**

- Process nodes from left-to-right in queue: [9, 20]
- But we need right-to-left output, so we reverse: [20, 9]
- Add [20, 9] to result

**Step 3: Level 2 (depth 2, left-to-right)**

- Process nodes from left-to-right in queue: [15, 7]
- We need left-to-right output, so keep as-is: [15, 7]
- Add [15, 7] to result

Final result: [[3], [20, 9], [15, 7]]

Notice the pattern: we always process nodes in the natural BFS order (left-to-right within each level), but we sometimes reverse the output list before adding it to our final result.

## Brute Force Approach

A naive approach might try to modify the tree structure or use recursion with complex indexing. One brute force idea is to:

1. Perform standard level-order traversal to get all levels
2. Reverse every other level in the result

While this approach would technically work, it's not truly "brute force" in the sense of being inefficient — it's actually quite reasonable! The real challenge comes from implementing the BFS traversal correctly and handling the zigzag logic properly.

However, a truly naive candidate might try to use DFS and track depth, but then struggle with maintaining the correct order within each level since DFS doesn't naturally process nodes level-by-level.

## Optimized Approach

The key insight is that we can use **Breadth-First Search (BFS)** with a queue, which naturally processes nodes level by level. The zigzag requirement adds one twist: we need to reverse the order of nodes for alternating levels.

Here's the step-by-step reasoning:

1. **Use BFS with a queue**: This gives us level-order traversal
2. **Track current level**: We need to know when we've finished processing one level and moved to the next
3. **Toggle direction**: Use a boolean flag to track whether the current level should be reversed
4. **Process level-by-level**: For each level:
   - Collect all node values in a list
   - Reverse the list if needed (based on current direction)
   - Add to result
   - Toggle direction for next level

The critical realization is that we always process nodes in the queue in the order they were added (left-to-right for each level), but we sometimes reverse the output before adding it to our final result.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes - we visit each node once
# Space: O(n) for the queue and result storage
from collections import deque
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        # Edge case: empty tree
        if not root:
            return []

        result = []
        queue = deque([root])  # Use deque for efficient popleft operations
        left_to_right = True   # Flag to track traversal direction

        # Process tree level by level
        while queue:
            level_size = len(queue)  # Number of nodes at current level
            current_level = []       # Store values for current level

            # Process all nodes at current level
            for _ in range(level_size):
                node = queue.popleft()

                # Add node value to current level list
                current_level.append(node.val)

                # Add children to queue for next level
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

            # Reverse current level if we're going right-to-left
            if not left_to_right:
                current_level.reverse()

            # Add current level to result and toggle direction
            result.append(current_level)
            left_to_right = not left_to_right

        return result
```

```javascript
// Time: O(n) where n is number of nodes - we visit each node once
// Space: O(n) for the queue and result storage
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var zigzagLevelOrder = function (root) {
  // Edge case: empty tree
  if (!root) {
    return [];
  }

  const result = [];
  const queue = [root]; // Use array as queue (shift for dequeue)
  let leftToRight = true; // Flag to track traversal direction

  // Process tree level by level
  while (queue.length > 0) {
    const levelSize = queue.length; // Number of nodes at current level
    const currentLevel = []; // Store values for current level

    // Process all nodes at current level
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();

      // Add node value to current level list
      currentLevel.push(node.val);

      // Add children to queue for next level
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }

    // Reverse current level if we're going right-to-left
    if (!leftToRight) {
      currentLevel.reverse();
    }

    // Add current level to result and toggle direction
    result.push(currentLevel);
    leftToRight = !leftToRight;
  }

  return result;
};
```

```java
// Time: O(n) where n is number of nodes - we visit each node once
// Space: O(n) for the queue and result storage
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
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();

        // Edge case: empty tree
        if (root == null) {
            return result;
        }

        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        boolean leftToRight = true;  // Flag to track traversal direction

        // Process tree level by level
        while (!queue.isEmpty()) {
            int levelSize = queue.size();  // Number of nodes at current level
            List<Integer> currentLevel = new ArrayList<>(levelSize);

            // Process all nodes at current level
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();

                // Add node value to current level list
                currentLevel.add(node.val);

                // Add children to queue for next level
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }

            // Reverse current level if we're going right-to-left
            if (!leftToRight) {
                Collections.reverse(currentLevel);
            }

            // Add current level to result and toggle direction
            result.add(currentLevel);
            leftToRight = !leftToRight;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once when processing the tree
- The `reverse()` operation on each level is O(k) where k is the level size, but summing across all levels gives us O(n) total
- Each node is enqueued and dequeued exactly once

**Space Complexity: O(n)**

- The queue can hold at most the widest level of the tree
- In the worst case (perfect binary tree), the last level contains ~n/2 nodes
- The result list stores all n node values
- Overall, we use O(n) additional space

## Common Mistakes

1. **Forgetting to handle the empty tree case**: Always check if `root` is null/None at the beginning. This is a common interview pitfall.

2. **Not tracking level boundaries**: Without tracking `levelSize`, you might mix nodes from different levels. The key is to process all nodes at the current level before moving to the next.

3. **Inefficient reversing**: Some candidates reverse the entire result array instead of just the current level. This is less efficient and more complex.

4. **Wrong direction toggling**: Starting with the wrong initial direction or toggling at the wrong time. Remember: level 0 (root) is left-to-right, level 1 is right-to-left, etc.

5. **Using stack instead of queue for BFS**: While you could use two stacks for zigzag traversal, it's more complex and error-prone than the queue approach with occasional reversing.

## When You'll See This Pattern

This problem combines two fundamental patterns:

1. **Level-order traversal (BFS)**: Used in many tree problems where you need to process nodes level by level.
   - **Binary Tree Level Order Traversal** (LeetCode 102): The simpler version without zigzag
   - **Binary Tree Right Side View** (LeetCode 199): Another BFS variation
   - **Find Largest Value in Each Tree Row** (LeetCode 515): BFS with aggregation at each level

2. **Direction toggling**: The zigzag pattern appears in various forms:
   - **Zigzag Conversion** (LeetCode 6): String processing with zigzag pattern
   - **Spiral Matrix** (LeetCode 54): 2D array traversal in spiral/zigzag order
   - **Diagonal Traverse** (LeetCode 498): Matrix traversal with alternating directions

The core technique of BFS with a queue and processing levels is widely applicable to tree and graph problems.

## Key Takeaways

1. **BFS with level tracking is versatile**: By tracking the number of nodes at each level, you can solve many level-based tree problems. The pattern is: use a queue, track level size with a variable, process that many nodes, then repeat.

2. **Sometimes simple is best**: The straightforward approach of reversing arrays when needed is often clearer and more maintainable than complex pointer manipulation or multiple data structures.

3. **Direction toggling is a common twist**: Many traversal problems add a "zigzag" or "alternating direction" requirement. The pattern is usually: track direction with a boolean flag, and apply transformation (like reversing) based on that flag.

Related problems: [Binary Tree Level Order Traversal](/problem/binary-tree-level-order-traversal), [Zigzag Grid Traversal With Skip](/problem/zigzag-grid-traversal-with-skip)
