---
title: "How to Solve Binary Tree Right Side View — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Binary Tree Right Side View. Medium difficulty, 69.5% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2026-05-18"
category: "dsa-patterns"
tags:
  ["binary-tree-right-side-view", "tree", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Binary Tree Right Side View

Imagine you're standing to the right of a binary tree. What nodes would you see? At each level, you'd see the rightmost node. But here's the catch: sometimes the rightmost node might be hidden behind a taller left subtree, or a left subtree might extend further to the right than the right subtree. This problem is tricky because it's not simply about always taking the right child—it's about finding the rightmost visible node at each depth level, which requires understanding both tree structure and traversal order.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this tree:

```
        1
       / \
      2   3
       \   \
        5   4
```

If we stand on the right side, what do we see?

- **Level 0 (depth 0)**: Only node 1 → we see [1]
- **Level 1 (depth 1)**: Nodes 2 and 3. From the right, node 3 is in front → we see [1, 3]
- **Level 2 (depth 2)**: Nodes 5 and 4. Both are visible from the right, but node 4 is further right → we see [1, 3, 4]

But wait—what if the tree looked like this?

```
        1
       / \
      2   3
     / \
    4   5
```

Now from the right side:

- **Level 0**: Node 1 → [1]
- **Level 1**: Nodes 2 and 3. Node 3 is in front → [1, 3]
- **Level 2**: Nodes 4 and 5. Node 5 extends further right than node 3's children → [1, 3, 5]

The key insight: we need to capture the last node we encounter at each depth level during a traversal. If we traverse right-first, the first node we see at each depth will be the rightmost one. If we traverse left-first, we need to keep updating nodes at each depth until we finish.

## Brute Force Approach

A naive approach might be to collect all nodes at each level, then take the last one from each level. Here's how that would work:

1. Perform a level-order traversal (BFS) to get all nodes grouped by level
2. For each level, take the last node in that level's list
3. Return these nodes in order of increasing depth

While this approach works, it's inefficient in terms of space because we store ALL nodes at each level, not just the rightmost ones. The time complexity is O(n) which is optimal, but the space complexity could be O(w) where w is the maximum width of the tree, which in the worst case (a complete binary tree) is about n/2 nodes.

However, there's an even more naive approach some candidates consider: always follow the right child. This fails miserably on the second example above—it would return [1, 3] but miss node 5, which is visible from the right side despite being in the left subtree.

## Optimized Approach

The optimal insight is that we need to track nodes by their depth. We can use either BFS (level-order) or DFS (depth-first search) with a clever modification:

**BFS Approach (Level-order traversal):**

- Traverse the tree level by level
- At each level, track the last node we encounter
- Add that node's value to our result
- This naturally gives us the rightmost node at each level

**DFS Approach (Depth-first search):**

- Perform a traversal (pre-order, in-order, or post-order)
- Keep track of the current depth
- Maintain a result list where index = depth
- If we're doing a **right-first DFS**, the first node we encounter at each depth is the rightmost one
- If we're doing a **left-first DFS**, we need to update the result at each depth as we encounter nodes (later nodes at the same depth replace earlier ones)

The BFS approach is more intuitive for this problem since we're thinking about levels. The DFS approach can be more space-efficient in certain cases (O(h) vs O(w) where h is height and w is width), but both have O(n) time complexity.

## Optimal Solution

Here's the BFS (level-order) solution, which is the most intuitive approach:

<div class="code-group">

```python
# Time: O(n) - we visit each node exactly once
# Space: O(w) - where w is the maximum width of the tree (queue size)
from collections import deque
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def rightSideView(root: Optional[TreeNode]) -> List[int]:
    """
    Returns the right side view of a binary tree.
    Uses BFS (level-order traversal) to process nodes level by level.
    At each level, we capture the last node's value.
    """
    # Edge case: empty tree
    if not root:
        return []

    result = []
    queue = deque([root])  # Initialize queue with root node

    while queue:
        # Get the number of nodes at current level
        level_size = len(queue)

        # Process all nodes at current level
        for i in range(level_size):
            # Pop the front node from queue
            node = queue.popleft()

            # If this is the last node at current level, add to result
            # Note: i is 0-indexed, so last node has i = level_size - 1
            if i == level_size - 1:
                result.append(node.val)

            # Add child nodes to queue for next level processing
            # We add left first so right stays at the end for next iteration
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

    return result
```

```javascript
// Time: O(n) - we visit each node exactly once
// Space: O(w) - where w is the maximum width of the tree (queue size)

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
 * @return {number[]}
 */
function rightSideView(root) {
  /**
   * Returns the right side view of a binary tree.
   * Uses BFS (level-order traversal) to process nodes level by level.
   * At each level, we capture the last node's value.
   */

  // Edge case: empty tree
  if (!root) {
    return [];
  }

  const result = [];
  const queue = [root]; // Initialize queue with root node

  while (queue.length > 0) {
    // Get the number of nodes at current level
    const levelSize = queue.length;

    // Process all nodes at current level
    for (let i = 0; i < levelSize; i++) {
      // Remove and get the front node from queue
      const node = queue.shift();

      // If this is the last node at current level, add to result
      // Note: i is 0-indexed, so last node has i = levelSize - 1
      if (i === levelSize - 1) {
        result.push(node.val);
      }

      // Add child nodes to queue for next level processing
      // We add left first so right stays at the end for next iteration
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
  }

  return result;
}
```

```java
// Time: O(n) - we visit each node exactly once
// Space: O(w) - where w is the maximum width of the tree (queue size)

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
    /**
     * Returns the right side view of a binary tree.
     * Uses BFS (level-order traversal) to process nodes level by level.
     * At each level, we capture the last node's value.
     */
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> result = new ArrayList<>();

        // Edge case: empty tree
        if (root == null) {
            return result;
        }

        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);  // Initialize queue with root node

        while (!queue.isEmpty()) {
            // Get the number of nodes at current level
            int levelSize = queue.size();

            // Process all nodes at current level
            for (int i = 0; i < levelSize; i++) {
                // Remove and get the front node from queue
                TreeNode node = queue.poll();

                // If this is the last node at current level, add to result
                // Note: i is 0-indexed, so last node has i = levelSize - 1
                if (i == levelSize - 1) {
                    result.add(node.val);
                }

                // Add child nodes to queue for next level processing
                // We add left first so right stays at the end for next iteration
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once during the BFS traversal
- Each node is processed (added to queue, removed from queue, and its children are checked) exactly once
- This linear time complexity is optimal since we must examine every node to determine the right side view

**Space Complexity: O(w)** where w is the maximum width of the tree

- The queue stores nodes at each level
- In the worst case (a complete binary tree), the maximum number of nodes at any level is roughly n/2
- This occurs at the last level of a full binary tree
- For a skewed tree (like a linked list), the width is 1, so space complexity would be O(1)
- The result list stores at most h elements (where h is the height), which is O(h) ≤ O(n)

## Common Mistakes

1. **Always following the right child**: This is the most common mistake. Candidates think "right side view = always go right," but this misses nodes in the left subtree that extend further right. Example: a tree where the left child has a right child—that right child would be visible from the right side.

2. **Forgetting to handle empty tree**: Always check if root is null/None at the beginning. An empty tree should return an empty list, not null or an error.

3. **Incorrect level tracking in BFS**: Without tracking level sizes, you might mix nodes from different levels. The key is to process all nodes at the current level before moving to the next. We do this by getting `queue.size()` at the start of each level and only processing that many nodes.

4. **Adding nodes in wrong order**: When adding children to the queue, add left first, then right. This ensures that within each level, the rightmost node is processed last, making it easy to identify as the last node in that level's iteration.

## When You'll See This Pattern

The "level-order traversal with level tracking" pattern appears in many tree problems:

1. **Binary Tree Level Order Traversal (LeetCode 102)**: Almost identical pattern—instead of taking the last node at each level, you collect all nodes at each level.

2. **Populating Next Right Pointers in Each Node (LeetCode 116)**: Uses level-order traversal to connect nodes at the same level. You need to track level boundaries to know when to stop connecting.

3. **Find Largest Value in Each Tree Row (LeetCode 515)**: Same BFS with level tracking, but instead of taking the rightmost node, you find the maximum value at each level.

4. **Binary Tree Zigzag Level Order Traversal (LeetCode 103)**: Level-order traversal with alternating direction—the core level tracking mechanism is the same.

The pattern is: when a problem asks for "something per level" or "something based on depth," think BFS with level size tracking or DFS with depth parameter.

## Key Takeaways

1. **Right side view ≠ always go right**: The rightmost visible node at each level might come from the left subtree if it extends further right than the right subtree. Think in terms of levels, not just right children.

2. **BFS with level tracking is your friend**: When you need to process trees level by level, use a queue and track level sizes. Process all nodes at the current level before moving to the next.

3. **Space-time tradeoff**: BFS uses O(w) space for the queue, while DFS approaches can use O(h) space for the recursion stack. For wide, shallow trees, DFS might be more space-efficient. For deep, narrow trees, BFS might be better.

Related problems: [Populating Next Right Pointers in Each Node](/problem/populating-next-right-pointers-in-each-node), [Boundary of Binary Tree](/problem/boundary-of-binary-tree)
