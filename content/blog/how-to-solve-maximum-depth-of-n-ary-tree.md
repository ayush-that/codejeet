---
title: "How to Solve Maximum Depth of N-ary Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Depth of N-ary Tree. Easy difficulty, 73.5% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search."
date: "2027-10-04"
category: "dsa-patterns"
tags: ["maximum-depth-of-n-ary-tree", "tree", "depth-first-search", "breadth-first-search", "easy"]
---

# How to Solve Maximum Depth of N-ary Tree

Finding the maximum depth of an N-ary tree is a fundamental tree traversal problem that tests your understanding of recursion, breadth-first search, and tree data structures. While conceptually simple, it's interesting because N-ary trees can have any number of children per node, requiring a more general approach than binary trees. The challenge lies in efficiently exploring all possible paths to find the longest one.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this N-ary tree:

```
        1
      / | \
     3  2  4
    / \
   5   6
```

**Step-by-step reasoning:**

1. Starting at root node 1, we need to find the maximum depth among all its children's subtrees
2. Node 1 has three children: 3, 2, and 4
3. For child 3: It has two children (5 and 6), both with no children → depth from node 3 is 1 + max(0, 0) = 1
4. For child 2: No children → depth from node 2 is 0
5. For child 4: No children → depth from node 4 is 0
6. Maximum depth among children: max(1, 0, 0) = 1
7. Total depth from root: 1 (root itself) + 1 = 2

The longest path is 1 → 3 → 5 or 1 → 3 → 6, both with 3 nodes, so maximum depth = 3.

## Brute Force Approach

For tree problems, there's rarely a true "brute force" in the sense of trying all possible combinations, since trees have inherent structure. However, a naive approach might involve:

1. Generating all possible paths from root to leaves
2. Measuring the length of each path
3. Returning the maximum length

This approach would require exploring every path exactly once anyway, which is actually optimal! The confusion often comes from candidates trying to store all paths explicitly, which wastes memory but doesn't change the time complexity.

The real issue candidates face is not recognizing that we can compute depth without explicitly storing paths. We'll see in the optimal solution how to do this efficiently.

## Optimal Solution

We have two optimal approaches: Depth-First Search (DFS) and Breadth-First Search (BFS). Both run in O(N) time where N is the number of nodes.

### DFS (Recursive) Approach

The recursive DFS approach is elegant and intuitive: The depth of a node is 1 (for the node itself) plus the maximum depth among all its children. If a node has no children, its depth is just 1.

<div class="code-group">

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children
"""

# Time: O(N) where N is number of nodes - we visit each node once
# Space: O(H) where H is height of tree - recursion stack space
class Solution:
    def maxDepth(self, root: 'Node') -> int:
        # Base case: empty tree has depth 0
        if not root:
            return 0

        # Base case: leaf node has depth 1
        if not root.children:
            return 1

        # Recursive case: depth = 1 + max depth among all children
        max_child_depth = 0
        for child in root.children:
            # Recursively compute depth of each child subtree
            child_depth = self.maxDepth(child)
            # Track the maximum depth found so far
            max_child_depth = max(max_child_depth, child_depth)

        # Current node contributes 1 to the depth
        return 1 + max_child_depth
```

```javascript
/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

// Time: O(N) where N is number of nodes - we visit each node once
// Space: O(H) where H is height of tree - recursion stack space
var maxDepth = function (root) {
  // Base case: empty tree has depth 0
  if (!root) {
    return 0;
  }

  // Base case: leaf node has depth 1
  if (!root.children || root.children.length === 0) {
    return 1;
  }

  // Recursive case: depth = 1 + max depth among all children
  let maxChildDepth = 0;
  for (let child of root.children) {
    // Recursively compute depth of each child subtree
    const childDepth = maxDepth(child);
    // Track the maximum depth found so far
    maxChildDepth = Math.max(maxChildDepth, childDepth);
  }

  // Current node contributes 1 to the depth
  return 1 + maxChildDepth;
};
```

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> children;

    public Node() {}

    public Node(int _val) {
        val = _val;
    }

    public Node(int _val, List<Node> _children) {
        val = _val;
        children = _children;
    }
};
*/

// Time: O(N) where N is number of nodes - we visit each node once
// Space: O(H) where H is height of tree - recursion stack space
class Solution {
    public int maxDepth(Node root) {
        // Base case: empty tree has depth 0
        if (root == null) {
            return 0;
        }

        // Base case: leaf node has depth 1
        if (root.children == null || root.children.isEmpty()) {
            return 1;
        }

        // Recursive case: depth = 1 + max depth among all children
        int maxChildDepth = 0;
        for (Node child : root.children) {
            // Recursively compute depth of each child subtree
            int childDepth = maxDepth(child);
            // Track the maximum depth found so far
            maxChildDepth = Math.max(maxChildDepth, childDepth);
        }

        // Current node contributes 1 to the depth
        return 1 + maxChildDepth;
    }
}
```

</div>

### BFS (Iterative) Approach

The BFS approach counts how many levels we traverse. We process the tree level by level, incrementing a depth counter for each level we complete.

<div class="code-group">

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children
"""

# Time: O(N) where N is number of nodes - we visit each node once
# Space: O(W) where W is maximum width of tree - queue storage
from collections import deque

class Solution:
    def maxDepth(self, root: 'Node') -> int:
        # Handle empty tree
        if not root:
            return 0

        # Initialize queue with root node and depth counter
        queue = deque([root])
        depth = 0

        # Process tree level by level
        while queue:
            # Increment depth for current level
            depth += 1

            # Process all nodes at current level
            level_size = len(queue)
            for _ in range(level_size):
                # Remove node from front of queue
                node = queue.popleft()

                # Add all children to queue for next level
                if node.children:
                    for child in node.children:
                        queue.append(child)

        return depth
```

```javascript
/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

// Time: O(N) where N is number of nodes - we visit each node once
// Space: O(W) where W is maximum width of tree - queue storage
var maxDepth = function (root) {
  // Handle empty tree
  if (!root) {
    return 0;
  }

  // Initialize queue with root node and depth counter
  const queue = [root];
  let depth = 0;

  // Process tree level by level
  while (queue.length > 0) {
    // Increment depth for current level
    depth++;

    // Process all nodes at current level
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      // Remove node from front of queue
      const node = queue.shift();

      // Add all children to queue for next level
      if (node.children) {
        for (let child of node.children) {
          queue.push(child);
        }
      }
    }
  }

  return depth;
};
```

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> children;

    public Node() {}

    public Node(int _val) {
        val = _val;
    }

    public Node(int _val, List<Node> _children) {
        val = _val;
        children = _children;
    }
};
*/

// Time: O(N) where N is number of nodes - we visit each node once
// Space: O(W) where W is maximum width of tree - queue storage
class Solution {
    public int maxDepth(Node root) {
        // Handle empty tree
        if (root == null) {
            return 0;
        }

        // Initialize queue with root node and depth counter
        Queue<Node> queue = new LinkedList<>();
        queue.offer(root);
        int depth = 0;

        // Process tree level by level
        while (!queue.isEmpty()) {
            // Increment depth for current level
            depth++;

            // Process all nodes at current level
            int levelSize = queue.size();
            for (int i = 0; i < levelSize; i++) {
                // Remove node from front of queue
                Node node = queue.poll();

                // Add all children to queue for next level
                if (node.children != null) {
                    for (Node child : node.children) {
                        queue.offer(child);
                    }
                }
            }
        }

        return depth;
    }
}
```

</div>

## Complexity Analysis

**DFS (Recursive) Complexity:**

- **Time:** O(N) where N is the number of nodes. We visit each node exactly once.
- **Space:** O(H) where H is the height of the tree. This is the maximum depth of the recursion stack. In the worst case (a skewed tree), H = N, giving O(N) space.

**BFS (Iterative) Complexity:**

- **Time:** O(N) where N is the number of nodes. Each node is processed once when dequeued.
- **Space:** O(W) where W is the maximum width of the tree (maximum number of nodes at any level). In the worst case (a complete tree), the last level has ~N/2 nodes, giving O(N) space.

**Which to choose?**

- DFS is usually simpler to implement recursively and uses less space for deep, narrow trees.
- BFS is better for wide, shallow trees and avoids recursion depth limits.
- Both are acceptable in interviews; mention you know both and choose based on the tree's expected shape.

## Common Mistakes

1. **Forgetting the empty tree case:** Always check if `root is None/null` first. Returning 0 for an empty tree is standard.

2. **Incorrect base case for leaf nodes:** Some candidates return 0 for leaf nodes, forgetting that a leaf node itself contributes 1 to the depth. Remember: depth = number of nodes along the path.

3. **Not handling null/empty children lists:** In some implementations, `node.children` might be `None/null` or an empty list. Always check before iterating.

4. **In BFS: not tracking level boundaries:** Simply adding nodes to a queue and counting operations won't give you the depth. You must process nodes level by level, tracking how many nodes are in the current level.

5. **Off-by-one errors in recursion:** The formula is `1 + max(child depths)`, not `max(1 + child depths)`. You add 1 after finding the maximum child depth.

## When You'll See This Pattern

This maximum depth calculation is a fundamental pattern in tree problems:

1. **Maximum Depth of Binary Tree (LeetCode 104):** The binary tree version of this exact problem. The solution is simpler since each node has at most 2 children.

2. **Minimum Depth of Binary Tree (LeetCode 111):** Similar concept but finding the shortest path to a leaf. Requires careful handling of nodes with only one child.

3. **Diameter of Binary Tree (LeetCode 543):** Builds on depth calculation but tracks the longest path between any two nodes, which may not pass through the root.

4. **Balanced Binary Tree (LeetCode 110):** Requires computing depths of subtrees and checking if they differ by at most 1.

The core pattern is **post-order traversal**: compute something for children first, then combine results at the current node. This "bottom-up" approach is powerful for many tree problems.

## Key Takeaways

1. **Tree depth problems often use DFS or BFS:** DFS is naturally recursive for trees, while BFS uses a queue. Know both and when to use each.

2. **The recursive formula is key:** For many tree metrics, you can define them recursively: "The property of a node is some function of the properties of its children."

3. **Post-order traversal pattern:** Compute results for children first, then combine at current node. This pattern appears in many tree problems including sum, average, depth, and balance checks.

4. **N-ary vs Binary trees:** The logic extends naturally from binary to N-ary trees—just iterate over all children instead of checking left/right.

Remember: Tree problems test your understanding of recursion and traversal. Practice identifying when to use pre-order, in-order, or post-order traversal based on what information you need at each step.

Related problems: [Maximum Depth of Binary Tree](/problem/maximum-depth-of-binary-tree), [The Time When the Network Becomes Idle](/problem/the-time-when-the-network-becomes-idle), [Count the Number of Good Nodes](/problem/count-the-number-of-good-nodes)
