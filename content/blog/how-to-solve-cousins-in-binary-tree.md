---
title: "How to Solve Cousins in Binary Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Cousins in Binary Tree. Easy difficulty, 59.1% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2027-10-10"
category: "dsa-patterns"
tags: ["cousins-in-binary-tree", "tree", "depth-first-search", "breadth-first-search", "easy"]
---

# How to Solve Cousins in Binary Tree

This problem asks us to determine if two nodes in a binary tree are cousins — meaning they're at the same depth (level) but have different parents. The tricky part is that we need to track both the depth and parent information for each node, and we need to do this efficiently without traversing the tree multiple times.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this tree:

```
        1
       / \
      2   3
     /     \
    4       5
```

We're asked: Are nodes 4 and 5 cousins?

**Step-by-step reasoning:**

1. Node 4 is at depth 2 (1→2→4), with parent 2
2. Node 5 is at depth 2 (1→3→5), with parent 3
3. Both are at the same depth (level 2)
4. They have different parents (2 ≠ 3)
5. Therefore, they ARE cousins

Now consider nodes 2 and 3:

1. Node 2 is at depth 1, parent 1
2. Node 3 is at depth 1, parent 1
3. Same depth? Yes (both depth 1)
4. Different parents? No (both have parent 1)
5. Therefore, they are NOT cousins (they're siblings)

The key insight: We need to find both the depth and parent for each target node, then compare them.

## Brute Force Approach

A naive approach might involve:

1. First traversal: Find the depth of node x
2. Second traversal: Find the depth of node y
3. Third traversal: Find the parent of node x
4. Fourth traversal: Find the parent of node y
5. Compare depths and parents

This would work but is inefficient — O(4n) time complexity in worst case. More importantly, it's unnecessarily complex. A better candidate might try to store all node information in a hash map first, but without careful design, they might end up with messy code that's hard to debug.

The real issue with brute force isn't just efficiency (though that matters), but that it misses the opportunity to gather all needed information in a single pass through the tree.

## Optimal Solution

We can solve this efficiently with either DFS or BFS. Both approaches work well, but BFS is particularly intuitive since we're checking nodes level by level. The core idea: traverse the tree once, tracking both parent and depth for each node as we go, then compare the information for our two target nodes.

Here's the BFS approach:

<div class="code-group">

```python
# Time: O(n) - We visit each node once
# Space: O(n) - In worst case, queue holds all nodes at widest level
from collections import deque

def isCousins(root, x, y):
    """
    Determine if nodes with values x and y are cousins.
    Cousins = same depth, different parents.
    """
    # Edge case: empty tree
    if not root:
        return False

    # Queue for BFS: stores (node, parent, depth)
    queue = deque()
    queue.append((root, None, 0))

    # Track found nodes and their info
    x_info = None  # (parent, depth)
    y_info = None  # (parent, depth)

    while queue:
        node, parent, depth = queue.popleft()

        # Check if current node is x or y
        if node.val == x:
            x_info = (parent, depth)
        if node.val == y:
            y_info = (parent, depth)

        # If we found both nodes, we can stop early
        if x_info and y_info:
            break

        # Add children to queue with updated parent and depth
        if node.left:
            queue.append((node.left, node, depth + 1))
        if node.right:
            queue.append((node.right, node, depth + 1))

    # Check if both nodes were found and are cousins
    if not x_info or not y_info:
        return False  # One or both nodes not in tree

    x_parent, x_depth = x_info
    y_parent, y_depth = y_info

    # Cousins condition: same depth AND different parents
    return x_depth == y_depth and x_parent != y_parent
```

```javascript
// Time: O(n) - We visit each node once
// Space: O(n) - In worst case, queue holds all nodes at widest level

function isCousins(root, x, y) {
  /**
   * Determine if nodes with values x and y are cousins.
   * Cousins = same depth, different parents.
   */
  // Edge case: empty tree
  if (!root) return false;

  // Queue for BFS: stores [node, parent, depth]
  const queue = [[root, null, 0]];

  // Track found nodes and their info
  let xInfo = null; // [parent, depth]
  let yInfo = null; // [parent, depth]

  while (queue.length > 0) {
    const [node, parent, depth] = queue.shift();

    // Check if current node is x or y
    if (node.val === x) {
      xInfo = [parent, depth];
    }
    if (node.val === y) {
      yInfo = [parent, depth];
    }

    // If we found both nodes, we can stop early
    if (xInfo && yInfo) {
      break;
    }

    // Add children to queue with updated parent and depth
    if (node.left) {
      queue.push([node.left, node, depth + 1]);
    }
    if (node.right) {
      queue.push([node.right, node, depth + 1]);
    }
  }

  // Check if both nodes were found
  if (!xInfo || !yInfo) {
    return false; // One or both nodes not in tree
  }

  const [xParent, xDepth] = xInfo;
  const [yParent, yDepth] = yInfo;

  // Cousins condition: same depth AND different parents
  return xDepth === yDepth && xParent !== yParent;
}
```

```java
// Time: O(n) - We visit each node once
// Space: O(n) - In worst case, queue holds all nodes at widest level

import java.util.LinkedList;
import java.util.Queue;

public class Solution {
    public boolean isCousins(TreeNode root, int x, int y) {
        /**
         * Determine if nodes with values x and y are cousins.
         * Cousins = same depth, different parents.
         */
        // Edge case: empty tree
        if (root == null) return false;

        // Queue for BFS: we'll use a custom class to store node, parent, and depth
        Queue<NodeInfo> queue = new LinkedList<>();
        queue.offer(new NodeInfo(root, null, 0));

        // Track found nodes and their info
        NodeInfo xInfo = null;  // stores parent and depth for node x
        NodeInfo yInfo = null;  // stores parent and depth for node y

        while (!queue.isEmpty()) {
            NodeInfo current = queue.poll();
            TreeNode node = current.node;
            TreeNode parent = current.parent;
            int depth = current.depth;

            // Check if current node is x or y
            if (node.val == x) {
                xInfo = new NodeInfo(null, parent, depth);
            }
            if (node.val == y) {
                yInfo = new NodeInfo(null, parent, depth);
            }

            // If we found both nodes, we can stop early
            if (xInfo != null && yInfo != null) {
                break;
            }

            // Add children to queue with updated parent and depth
            if (node.left != null) {
                queue.offer(new NodeInfo(node.left, node, depth + 1));
            }
            if (node.right != null) {
                queue.offer(new NodeInfo(node.right, node, depth + 1));
            }
        }

        // Check if both nodes were found
        if (xInfo == null || yInfo == null) {
            return false;  // One or both nodes not in tree
        }

        // Cousins condition: same depth AND different parents
        return xInfo.depth == yInfo.depth && xInfo.parent != yInfo.parent;
    }

    // Helper class to store node information for BFS
    class NodeInfo {
        TreeNode node;
        TreeNode parent;
        int depth;

        NodeInfo(TreeNode node, TreeNode parent, int depth) {
            this.node = node;
            this.parent = parent;
            this.depth = depth;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node at most once in the worst case
- The early break when both nodes are found can save time, but worst-case is still O(n)
- Each node operation (check value, enqueue children) is O(1)

**Space Complexity: O(n)**

- In the worst case (perfectly balanced tree), the queue holds all nodes at the widest level
- For a complete binary tree, the widest level has roughly n/2 nodes
- The NodeInfo objects (or equivalent in other languages) also contribute to space usage

## Common Mistakes

1. **Confusing cousins with siblings**: The most common logical error is forgetting to check that the parents must be different. Candidates often check only for same depth, returning true for siblings. Always remember: cousins = same depth + different parents.

2. **Not handling the case where one node is the parent of the other**: If x is the parent of y, they're at different depths, so they're not cousins. But if you don't track depth properly, you might incorrectly return true.

3. **Assuming both nodes exist in the tree**: The problem states the tree has unique values and x and y are different, but doesn't guarantee both exist. Always check that you found both nodes before comparing.

4. **Inefficient multiple traversals**: Some candidates traverse once to find depths, then again to find parents. This works but is less elegant. Interviewers prefer the single-pass solution that demonstrates better algorithmic thinking.

## When You'll See This Pattern

This problem combines two fundamental tree traversal patterns:

1. **Level/depth tracking**: Used in problems like:
   - [Binary Tree Level Order Traversal](/problem/binary-tree-level-order-traversal) - Group nodes by their depth
   - [Minimum Depth of Binary Tree](/problem/minimum-depth-of-binary-tree) - Find the shortest path to a leaf

2. **Parent-child relationship tracking**: Used in problems like:
   - [Lowest Common Ancestor](/problem/lowest-common-ancestor-of-a-binary-tree) - Find where two nodes' paths converge
   - [Cousins in Binary Tree II](/problem/cousins-in-binary-tree-ii) - The follow-up problem that builds on this one

The BFS-with-additional-info pattern is versatile: whenever you need to track multiple pieces of information (depth, parent, path, etc.) during traversal, consider storing them together in your queue/stack.

## Key Takeaways

1. **BFS is natural for level-based problems**: When you need information about depth/level, BFS processes nodes level by level, making depth tracking straightforward.

2. **Store related information together**: Instead of maintaining separate data structures for depth and parent, store them together (as a tuple or custom object) for cleaner code and better performance.

3. **Early termination optimizations**: Once you find both target nodes, you can stop the traversal. This doesn't change worst-case complexity but shows good algorithmic thinking.

Related problems: [Binary Tree Level Order Traversal](/problem/binary-tree-level-order-traversal), [Cousins in Binary Tree II](/problem/cousins-in-binary-tree-ii)
