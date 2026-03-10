---
title: "How to Solve Binary Tree Level Order Traversal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Binary Tree Level Order Traversal. Medium difficulty, 72.2% acceptance rate. Topics: Tree, Breadth-First Search, Binary Tree."
date: "2026-03-21"
category: "dsa-patterns"
tags: ["binary-tree-level-order-traversal", "tree", "breadth-first-search", "binary-tree", "medium"]
---

# How to Solve Binary Tree Level Order Traversal

Binary Tree Level Order Traversal asks you to return the values of nodes in a binary tree, grouped level by level from left to right. While conceptually simple, this problem is a classic test of breadth-first search (BFS) implementation and requires careful handling of level boundaries. The tricky part isn't just visiting nodes in BFS order, but correctly grouping nodes from the same level together in the output.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this binary tree:

```
        3
       / \
      9   20
         /  \
        15   7
```

We want to return: `[[3], [9,20], [15,7]]`

Here's how a level-order traversal works step by step:

1. **Level 0**: Start with just the root node `3`. This forms our first level: `[3]`
2. **Level 1**: Process the children of level 0 nodes. Node `3` has left child `9` and right child `20`. These form our second level: `[9, 20]`
3. **Level 2**: Process the children of level 1 nodes. Node `9` has no children. Node `20` has left child `15` and right child `7`. These form our third level: `[15, 7]`

The key insight is that we need to process all nodes at the current level before moving to the next level. A simple BFS queue would give us `[3, 9, 20, 15, 7]` as a flat list, but we need the level grouping. To achieve this, we need to track when we've finished processing one level and started the next.

## Brute Force Approach

A naive approach might try to use depth-first search (DFS) with level tracking. While this would work, it's not the most intuitive or efficient approach for level-order traversal. However, let's consider what a candidate might try first:

1. Perform any traversal (preorder, inorder, postorder) while tracking the current depth
2. Append each node's value to a list corresponding to its depth
3. Return the list of lists

The problem with this approach is that it doesn't naturally process nodes level by level - it processes them in DFS order. While the final grouping would be correct, the thought process doesn't align with the problem's natural BFS solution. More importantly, in an interview, the interviewer expects to see BFS for level-order problems.

## Optimized Approach

The optimal solution uses **breadth-first search (BFS) with level tracking**. Here's the key insight:

**We can process nodes level by level by tracking how many nodes are in the current level.**

Here's the step-by-step reasoning:

1. **Use a queue**: BFS naturally uses a queue (FIFO) to process nodes in the order they're discovered.
2. **Track level size**: Before processing each level, record how many nodes are currently in the queue (this is exactly the number of nodes at the current level).
3. **Process level by level**: For each node at the current level:
   - Remove it from the queue
   - Add its value to the current level's list
   - Add its children (if they exist) to the queue for the next level
4. **Repeat**: After processing all nodes at the current level, add the level's list to the result and move to the next level.

The clever part is that when we start processing a level, the queue contains **only** nodes from that level (or it's empty if we're done). By recording `level_size = len(queue)` before processing the level, we ensure we only process exactly that many nodes before moving to the next level.

## Optimal Solution

Here's the complete implementation using BFS with level tracking:

<div class="code-group">

```python
# Time: O(n) where n is the number of nodes in the tree
# Space: O(n) for the queue and output list
from collections import deque
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        # Edge case: empty tree
        if not root:
            return []

        result = []
        # Use deque for efficient popleft operations (O(1))
        queue = deque([root])

        # Process tree level by level
        while queue:
            # Get the number of nodes at the current level
            level_size = len(queue)
            # List to store values of nodes at current level
            current_level = []

            # Process all nodes at the current level
            for _ in range(level_size):
                # Remove the front node from the queue
                node = queue.popleft()
                # Add its value to the current level list
                current_level.append(node.val)

                # Add children to the queue for the next level
                # We check if children exist before adding them
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

            # Add the completed level to the result
            result.append(current_level)

        return result
```

```javascript
// Time: O(n) where n is the number of nodes in the tree
// Space: O(n) for the queue and output array
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function (root) {
  // Edge case: empty tree
  if (!root) {
    return [];
  }

  const result = [];
  // Use an array as a queue (shift() is O(n) but acceptable for interview context)
  // In production, consider using a proper queue implementation
  const queue = [root];

  // Process tree level by level
  while (queue.length > 0) {
    // Get the number of nodes at the current level
    const levelSize = queue.length;
    // Array to store values of nodes at current level
    const currentLevel = [];

    // Process all nodes at the current level
    for (let i = 0; i < levelSize; i++) {
      // Remove the front node from the queue
      const node = queue.shift();
      // Add its value to the current level array
      currentLevel.push(node.val);

      // Add children to the queue for the next level
      // We check if children exist before adding them
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }

    // Add the completed level to the result
    result.push(currentLevel);
  }

  return result;
};
```

```java
// Time: O(n) where n is the number of nodes in the tree
// Space: O(n) for the queue and output list
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
    public List<List<Integer>> levelOrder(TreeNode root) {
        // Result list to store levels
        List<List<Integer>> result = new ArrayList<>();

        // Edge case: empty tree
        if (root == null) {
            return result;
        }

        // Queue for BFS traversal
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        // Process tree level by level
        while (!queue.isEmpty()) {
            // Get the number of nodes at the current level
            int levelSize = queue.size();
            // List to store values of nodes at current level
            List<Integer> currentLevel = new ArrayList<>();

            // Process all nodes at the current level
            for (int i = 0; i < levelSize; i++) {
                // Remove the front node from the queue
                TreeNode node = queue.poll();
                // Add its value to the current level list
                currentLevel.add(node.val);

                // Add children to the queue for the next level
                // We check if children exist before adding them
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }

            // Add the completed level to the result
            result.add(currentLevel);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once when we add it to the queue
- We process each node exactly once when we remove it from the queue
- Each node operation (adding to queue, removing from queue, adding to result list) takes O(1) time
- Therefore, total time is proportional to the number of nodes: O(n)

**Space Complexity: O(n)**

- The queue can hold at most all nodes at the widest level. In a perfect binary tree, the last level contains roughly n/2 nodes, so O(n)
- The output list stores all n node values, so O(n)
- In the worst case (a completely unbalanced tree that looks like a linked list), the queue only holds one node at a time, but the output still stores all n values

## Common Mistakes

1. **Forgetting the empty tree case**: Always check if `root` is `null`/`None` at the beginning. An empty tree should return an empty list `[]`, not `null` or cause an error.

2. **Not tracking level boundaries**: The most common mistake is using a simple BFS that produces a flat list like `[3, 9, 20, 15, 7]` instead of grouped levels. Remember to:
   - Get the queue size **before** processing each level
   - Use a for loop to process exactly that many nodes
   - Create a new list for each level

3. **Adding null children to the queue**: Always check if a child exists before adding it to the queue. Adding `null` values will cause errors when you try to access `node.val` later.

4. **Using the wrong data structure for the queue**: In Python, using a list as a queue with `pop(0)` is O(n) per operation. Use `collections.deque` for O(1) popleft. In JavaScript, `shift()` is O(n), but it's generally acceptable in interviews if you mention the trade-off.

## When You'll See This Pattern

The BFS-with-level-tracking pattern appears in many tree and graph problems:

1. **Binary Tree Zigzag Level Order Traversal** (LeetCode 103): Same as this problem, but alternate direction each level. You can use the same BFS approach with a flag to reverse every other level.

2. **Binary Tree Level Order Traversal II** (LeetCode 107): Same traversal but return levels from bottom to top. Solve with regular BFS, then reverse the result list.

3. **Minimum Depth of Binary Tree** (LeetCode 111): Use BFS and return the depth when you encounter the first leaf node. BFS is optimal here because it finds the minimum depth without exploring the entire tree.

4. **Binary Tree Right Side View** (LeetCode 199): Another BFS variation where you only take the last node at each level.

5. **Graph level-order problems**: Any problem asking for "shortest path" or "minimum steps" in an unweighted graph uses BFS, which is essentially the same algorithm.

## Key Takeaways

1. **BFS is for level-order**: When a problem asks for "level by level" or "shortest path" in trees or unweighted graphs, BFS is usually the right approach.

2. **Track level size**: The key trick for grouping nodes by level is to record the queue size before processing each level, then process exactly that many nodes.

3. **Queue management matters**: Use efficient queue implementations (deque in Python, LinkedList in Java) and always check for null/None before adding nodes to avoid errors.

Related problems: [Binary Tree Zigzag Level Order Traversal](/problem/binary-tree-zigzag-level-order-traversal), [Binary Tree Level Order Traversal II](/problem/binary-tree-level-order-traversal-ii), [Minimum Depth of Binary Tree](/problem/minimum-depth-of-binary-tree)
