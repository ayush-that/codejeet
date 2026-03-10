---
title: "How to Solve Cousins in Binary Tree II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Cousins in Binary Tree II. Medium difficulty, 75.8% acceptance rate. Topics: Hash Table, Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2027-01-03"
category: "dsa-patterns"
tags: ["cousins-in-binary-tree-ii", "hash-table", "tree", "depth-first-search", "medium"]
---

# How to Solve Cousins in Binary Tree II

This problem asks us to replace each node's value in a binary tree with the sum of all its cousins' values. Two nodes are cousins if they have the same depth but different parents. The challenge lies in efficiently calculating, for each node, the sum of all other nodes at its depth _except_ its siblings (nodes with the same parent). This requires careful tracking of both depth and parent relationships.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this tree:

```
        1
       / \
      2   3
     / \   \
    4   5   6
```

We need to replace each node's value with the sum of its cousins:

- **Node 1 (depth 0)**: No cousins (only node at depth 0) → becomes 0
- **Node 2 (depth 1)**: Cousins are nodes at depth 1 with different parents. Node 3 is at depth 1 with parent 1 (different from node 2's parent 1? Wait — they have the same parent! Actually, node 2 and 3 have the same parent (1), so they're siblings, not cousins. Thus node 2 has no cousins → becomes 0
- **Node 3 (depth 1)**: Similarly, no cousins → becomes 0
- **Node 4 (depth 2)**: Cousins are nodes at depth 2 with different parents. Nodes at depth 2: 4 (parent 2), 5 (parent 2), 6 (parent 3). Node 4's cousins are nodes with different parents: node 6 (parent 3 ≠ parent 2). Node 5 has the same parent as node 4, so it's a sibling, not a cousin. Thus node 4 becomes 6
- **Node 5 (depth 2)**: Similarly, cousins are node 6 → becomes 6
- **Node 6 (depth 2)**: Cousins are nodes 4 and 5 (both have parent 2 ≠ parent 3) → becomes 4 + 5 = 9

Final tree:

```
        0
       / \
      0   0
     / \   \
    6   6   9
```

The key insight: For each depth, we need:

1. The total sum of all nodes at that depth
2. For each parent, the sum of its children at that depth
   Then for a node: cousin sum = (total depth sum) - (sum of siblings) - (node's own value)

## Brute Force Approach

A naive approach would be: For each node, traverse the entire tree to find all nodes at the same depth with different parents, sum their values, and replace the current node's value.

**Why this fails:**

- Time complexity: O(n²) where n is number of nodes (for each node, we potentially traverse all nodes)
- Space complexity: O(h) for recursion stack, but the time makes this impractical
- We're doing redundant work — recalculating depth sums repeatedly

Even with memoization of depth sums, we still need to exclude siblings for each node, which requires additional per-node calculations.

## Optimized Approach

The optimal solution uses **two passes** with careful tracking:

**First pass (BFS or DFS):**

1. Traverse the tree level by level (BFS is natural for this)
2. For each level, calculate:
   - Total sum of all nodes at that level
   - For each parent, the sum of its children at that level
3. Store these values in dictionaries keyed by depth

**Second pass (BFS or DFS):**

1. Traverse the tree again
2. For each node at depth d with parent p:
   - Cousin sum = (total sum at depth d) - (sum of p's children at depth d) - (node's own value)
   - Wait, why subtract node's own value? Because "sum of p's children" includes the current node, and we want to exclude all siblings (including ourselves) from the cousin sum
3. Update the node's value

**Why BFS works well:**

- BFS processes nodes level by level, making it easy to track depth
- We can naturally group nodes by depth during traversal
- Alternative: DFS with depth parameter also works

## Optimal Solution

Here's the complete solution using BFS with two passes:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
# We traverse the tree twice, each taking O(n) time
# We store level sums and parent-child sums, both O(n) in worst case

from collections import deque

class Solution:
    def replaceValueInTree(self, root):
        """
        Replace each node's value with the sum of its cousins' values.
        Two nodes are cousins if they have the same depth with different parents.
        """
        if not root:
            return None

        # First pass: Calculate level sums and parent-child sums
        level_sums = {}  # depth -> sum of all nodes at that depth
        parent_sums = {}  # (depth, parent) -> sum of parent's children at that depth

        # BFS queue: (node, parent, depth)
        queue = deque()
        queue.append((root, None, 0))

        while queue:
            node, parent, depth = queue.popleft()

            # Update level sum
            level_sums[depth] = level_sums.get(depth, 0) + node.val

            # Update parent sum if parent exists
            if parent:
                key = (depth, parent)
                parent_sums[key] = parent_sums.get(key, 0) + node.val

            # Add children to queue
            if node.left:
                queue.append((node.left, node, depth + 1))
            if node.right:
                queue.append((node.right, node, depth + 1))

        # Second pass: Update node values
        queue = deque()
        queue.append((root, None, 0))

        while queue:
            node, parent, depth = queue.popleft()

            # Calculate cousin sum:
            # total at depth - parent's children sum at depth - node's own value
            total_at_depth = level_sums[depth]

            if parent:
                parent_key = (depth, parent)
                siblings_sum = parent_sums[parent_key]
            else:
                # Root has no parent, so no siblings
                siblings_sum = node.val

            # Cousin sum excludes all siblings (including current node)
            # and excludes current node itself
            node.val = total_at_depth - siblings_sum

            # Add children to queue for processing
            if node.left:
                queue.append((node.left, node, depth + 1))
            if node.right:
                queue.append((node.right, node, depth + 1))

        return root
```

```javascript
// Time: O(n) | Space: O(n)
// We traverse the tree twice, each taking O(n) time
// We store level sums and parent-child sums, both O(n) in worst case

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
 * @return {TreeNode}
 */
var replaceValueInTree = function (root) {
  if (!root) return null;

  // First pass: Calculate level sums and parent-child sums
  const levelSums = new Map(); // depth -> sum of all nodes at that depth
  const parentSums = new Map(); // key(depth, parent) -> sum of parent's children at that depth

  // BFS queue: [node, parent, depth]
  let queue = [[root, null, 0]];

  while (queue.length > 0) {
    const [node, parent, depth] = queue.shift();

    // Update level sum
    levelSums.set(depth, (levelSums.get(depth) || 0) + node.val);

    // Update parent sum if parent exists
    if (parent) {
      const key = `${depth},${parent.val}`; // Using string key for Map
      parentSums.set(key, (parentSums.get(key) || 0) + node.val);
    }

    // Add children to queue
    if (node.left) {
      queue.push([node.left, node, depth + 1]);
    }
    if (node.right) {
      queue.push([node.right, node, depth + 1]);
    }
  }

  // Second pass: Update node values
  queue = [[root, null, 0]];

  while (queue.length > 0) {
    const [node, parent, depth] = queue.shift();

    // Calculate cousin sum
    const totalAtDepth = levelSums.get(depth);

    let siblingsSum;
    if (parent) {
      const parentKey = `${depth},${parent.val}`;
      siblingsSum = parentSums.get(parentKey);
    } else {
      // Root has no parent, so no siblings
      siblingsSum = node.val;
    }

    // Cousin sum excludes all siblings (including current node)
    node.val = totalAtDepth - siblingsSum;

    // Add children to queue for processing
    if (node.left) {
      queue.push([node.left, node, depth + 1]);
    }
    if (node.right) {
      queue.push([node.right, node, depth + 1]);
    }
  }

  return root;
};
```

```java
// Time: O(n) | Space: O(n)
// We traverse the tree twice, each taking O(n) time
// We store level sums and parent-child sums, both O(n) in worst case

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

import java.util.*;

class Solution {
    public TreeNode replaceValueInTree(TreeNode root) {
        if (root == null) return null;

        // First pass: Calculate level sums and parent-child sums
        Map<Integer, Integer> levelSums = new HashMap<>();  // depth -> sum of all nodes at that depth
        Map<String, Integer> parentSums = new HashMap<>();  // key(depth,parent) -> sum of parent's children

        // BFS queue: each element is [node, parent, depth]
        Queue<Object[]> queue = new LinkedList<>();
        queue.offer(new Object[]{root, null, 0});

        while (!queue.isEmpty()) {
            Object[] item = queue.poll();
            TreeNode node = (TreeNode) item[0];
            TreeNode parent = (TreeNode) item[1];
            int depth = (int) item[2];

            // Update level sum
            levelSums.put(depth, levelSums.getOrDefault(depth, 0) + node.val);

            // Update parent sum if parent exists
            if (parent != null) {
                String key = depth + "," + System.identityHashCode(parent); // Use identity for uniqueness
                parentSums.put(key, parentSums.getOrDefault(key, 0) + node.val);
            }

            // Add children to queue
            if (node.left != null) {
                queue.offer(new Object[]{node.left, node, depth + 1});
            }
            if (node.right != null) {
                queue.offer(new Object[]{node.right, node, depth + 1});
            }
        }

        // Second pass: Update node values
        queue = new LinkedList<>();
        queue.offer(new Object[]{root, null, 0});

        while (!queue.isEmpty()) {
            Object[] item = queue.poll();
            TreeNode node = (TreeNode) item[0];
            TreeNode parent = (TreeNode) item[1];
            int depth = (int) item[2];

            // Calculate cousin sum
            int totalAtDepth = levelSums.get(depth);
            int siblingsSum;

            if (parent != null) {
                String parentKey = depth + "," + System.identityHashCode(parent);
                siblingsSum = parentSums.get(parentKey);
            } else {
                // Root has no parent, so no siblings
                siblingsSum = node.val;
            }

            // Cousin sum excludes all siblings (including current node)
            node.val = totalAtDepth - siblingsSum;

            // Add children to queue for processing
            if (node.left != null) {
                queue.offer(new Object[]{node.left, node, depth + 1});
            }
            if (node.right != null) {
                queue.offer(new Object[]{node.right, node, depth + 1});
            }
        }

        return root;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We perform two complete BFS traversals of the tree
- Each traversal visits every node exactly once → O(n) each
- Dictionary operations (get/put) are O(1) on average
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- BFS queue: In worst case (complete binary tree), last level has ~n/2 nodes → O(n)
- `level_sums`: Stores one entry per depth, at most O(h) where h is tree height
- `parent_sums`: Stores sum for each parent at each depth. In worst case (each node has unique parent at its depth), this could be O(n)
- Total: O(n) for the dictionaries + O(n) for queue = O(n)

## Common Mistakes

1. **Forgetting to subtract the node's own value**: When calculating `total_at_depth - siblings_sum`, remember that `siblings_sum` includes the current node. If you don't subtract the node's own value separately, you'll be including it in the cousin sum.

2. **Incorrect parent tracking in BFS**: When doing BFS, it's easy to lose track of parent relationships. Make sure to pass the parent reference along with each node in the queue.

3. **Using node value as parent key**: In trees with duplicate values, using node value as a key can cause collisions. Use the node's memory address/identity (like `id(node)` in Python or `System.identityHashCode()` in Java) or pass the parent reference directly as part of a tuple key.

4. **Not handling the root specially**: The root has no parent, so it has no siblings. Its cousin sum is simply `total_at_depth - root.val` (which equals 0 if root is the only node at depth 0).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Level-order traversal with aggregation**: Similar to "Maximum Level Sum of a Binary Tree" (LeetCode 1161), where you calculate sums per level and then find the maximum.

2. **Two-pass tree processing**: Like "Distribute Coins in Binary Tree" (LeetCode 979), where you first gather information in one pass, then use it in another.

3. **Cousin relationships in trees**: The original "Cousins in Binary Tree" (LeetCode 993) tests understanding of depth and parent relationships, which is foundational for this problem.

The core technique of aggregating information by level and then using it to transform nodes appears in various tree modification problems.

## Key Takeaways

1. **When you need to relate nodes by depth, think level-order traversal**: BFS naturally groups nodes by depth, making it easier to compute depth-based aggregates.

2. **Two-pass approach is powerful for transformation problems**: First gather global information (like level sums), then apply local transformations using that information.

3. **Cousin = same depth, different parent**: This definition is key. The formula `cousin_sum = total_depth_sum - siblings_sum` elegantly captures this by excluding all nodes with the same parent.

Related problems: [Cousins in Binary Tree](/problem/cousins-in-binary-tree), [Maximum Level Sum of a Binary Tree](/problem/maximum-level-sum-of-a-binary-tree)
