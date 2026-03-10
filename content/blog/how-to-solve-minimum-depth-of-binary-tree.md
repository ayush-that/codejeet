---
title: "How to Solve Minimum Depth of Binary Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Depth of Binary Tree. Easy difficulty, 52.4% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2026-06-30"
category: "dsa-patterns"
tags: ["minimum-depth-of-binary-tree", "tree", "depth-first-search", "breadth-first-search", "easy"]
---

# How to Solve Minimum Depth of Binary Tree

Finding the minimum depth of a binary tree seems straightforward at first glance, but it has a subtle twist that trips up many candidates. The key is understanding that the minimum depth is measured from the root to the **nearest leaf node** - a node with no children. This means you can't simply take the shorter of the left and right subtree depths when a node has only one child, because that path wouldn't lead to a leaf. This nuance makes the problem more interesting than its counterpart, Maximum Depth of Binary Tree.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this binary tree:

```
        3
       / \
      9   20
         /  \
        15   7
```

We need to find the shortest path from the root (3) to any leaf node. Let's examine the possible paths:

1. **Path 1:** 3 → 9 (leaf) → Depth = 2 nodes (3 and 9)
2. **Path 2:** 3 → 20 → 15 (leaf) → Depth = 3 nodes
3. **Path 3:** 3 → 20 → 7 (leaf) → Depth = 3 nodes

The shortest path is 3 → 9, giving us a minimum depth of 2. Notice that node 20 is not a leaf because it has children, so we can't stop there.

Now consider a trickier case:

```
        2
         \
          3
           \
            4
             \
              5
               \
                6
```

In this right-skewed tree, the only leaf is node 6. The path is 2 → 3 → 4 → 5 → 6, giving a minimum depth of 5. This illustrates why we can't use a simple recursive min(left, right) approach - when a node has only one child, we must follow that child to find a leaf.

## Brute Force Approach

A truly brute force approach would be to explore every possible path from root to leaf and track the shortest one. We could do this with a depth-first search that enumerates all paths:

1. Start at the root
2. Recursively explore left and right children
3. When reaching a leaf, record the path length
4. Keep track of the minimum length seen

While this would work, it's inefficient because we're exploring the entire tree even when we might find a short path early. More importantly, many candidates mistakenly try to adapt the maximum depth solution by simply changing `max()` to `min()`:

```python
# INCORRECT approach - doesn't handle single-child nodes properly
def minDepth(root):
    if not root:
        return 0
    return 1 + min(minDepth(root.left), minDepth(root.right))
```

This fails for the right-skewed tree example above because when a node has only one child (like node 2 with only a right child), `min(None, depth)` returns 0 (treating None as 0), making it think we've reached a leaf. The correct logic must handle three cases:

1. No children → leaf node → depth = 1
2. Only left child → must go left
3. Only right child → must go right
4. Both children → take the minimum of both sides

## Optimal Solution

The optimal solution uses either BFS (level-order traversal) or DFS with proper case handling. BFS is particularly efficient for this problem because it explores level by level, and the first leaf we encounter gives us the minimum depth. With DFS, we need to be careful about the single-child case.

### BFS Approach (Most Intuitive)

BFS explores the tree level by level using a queue. We stop as soon as we find a leaf node, which guarantees we've found the minimum depth.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the queue
from collections import deque

def minDepth(root):
    """
    Find minimum depth of binary tree using BFS.
    BFS is optimal because we stop at the first leaf we encounter.
    """
    # Edge case: empty tree
    if not root:
        return 0

    # Initialize queue with root node and its depth (1)
    queue = deque([(root, 1)])

    while queue:
        # Get the next node and its depth
        node, depth = queue.popleft()

        # Check if this is a leaf node (no children)
        if not node.left and not node.right:
            return depth  # First leaf found = minimum depth

        # Add children to queue with incremented depth
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))

    # This line is theoretically unreachable for valid trees
    return 0
```

```javascript
// Time: O(n) | Space: O(n) for the queue
function minDepth(root) {
  /**
   * Find minimum depth of binary tree using BFS.
   * BFS is optimal because we stop at the first leaf we encounter.
   */
  // Edge case: empty tree
  if (!root) return 0;

  // Initialize queue with root node and its depth (1)
  const queue = [[root, 1]];

  while (queue.length > 0) {
    // Get the next node and its depth
    const [node, depth] = queue.shift();

    // Check if this is a leaf node (no children)
    if (!node.left && !node.right) {
      return depth; // First leaf found = minimum depth
    }

    // Add children to queue with incremented depth
    if (node.left) {
      queue.push([node.left, depth + 1]);
    }
    if (node.right) {
      queue.push([node.right, depth + 1]);
    }
  }

  // This line is theoretically unreachable for valid trees
  return 0;
}
```

```java
// Time: O(n) | Space: O(n) for the queue
import java.util.LinkedList;
import java.util.Queue;

class Solution {
    public int minDepth(TreeNode root) {
        /**
         * Find minimum depth of binary tree using BFS.
         * BFS is optimal because we stop at the first leaf we encounter.
         */
        // Edge case: empty tree
        if (root == null) return 0;

        // Initialize queue with root node and its depth (1)
        Queue<Pair<TreeNode, Integer>> queue = new LinkedList<>();
        queue.offer(new Pair<>(root, 1));

        while (!queue.isEmpty()) {
            // Get the next node and its depth
            Pair<TreeNode, Integer> current = queue.poll();
            TreeNode node = current.getKey();
            int depth = current.getValue();

            // Check if this is a leaf node (no children)
            if (node.left == null && node.right == null) {
                return depth;  // First leaf found = minimum depth
            }

            // Add children to queue with incremented depth
            if (node.left != null) {
                queue.offer(new Pair<>(node.left, depth + 1));
            }
            if (node.right != null) {
                queue.offer(new Pair<>(node.right, depth + 1));
            }
        }

        // This line is theoretically unreachable for valid trees
        return 0;
    }

    // Helper class since Java doesn't have built-in Pair
    class Pair<K, V> {
        private K key;
        private V value;

        public Pair(K key, V value) {
            this.key = key;
            this.value = value;
        }

        public K getKey() { return key; }
        public V getValue() { return value; }
    }
}
```

</div>

### DFS Approach (Alternative)

DFS with proper case handling also works and can be more memory-efficient for unbalanced trees.

<div class="code-group">

```python
# Time: O(n) | Space: O(h) where h is tree height
def minDepth(root):
    """
    Find minimum depth using DFS with proper handling of single-child nodes.
    """
    # Base case: empty node
    if not root:
        return 0

    # Case 1: Leaf node - depth is 1
    if not root.left and not root.right:
        return 1

    # Case 2: Only left child exists - must go left
    if not root.right:
        return 1 + minDepth(root.left)

    # Case 3: Only right child exists - must go right
    if not root.left:
        return 1 + minDepth(root.right)

    # Case 4: Both children exist - take minimum
    return 1 + min(minDepth(root.left), minDepth(root.right))
```

```javascript
// Time: O(n) | Space: O(h) where h is tree height
function minDepth(root) {
  /**
   * Find minimum depth using DFS with proper handling of single-child nodes.
   */
  // Base case: empty node
  if (!root) return 0;

  // Case 1: Leaf node - depth is 1
  if (!root.left && !root.right) return 1;

  // Case 2: Only left child exists - must go left
  if (!root.right) return 1 + minDepth(root.left);

  // Case 3: Only right child exists - must go right
  if (!root.left) return 1 + minDepth(root.right);

  // Case 4: Both children exist - take minimum
  return 1 + Math.min(minDepth(root.left), minDepth(root.right));
}
```

```java
// Time: O(n) | Space: O(h) where h is tree height
class Solution {
    public int minDepth(TreeNode root) {
        /**
         * Find minimum depth using DFS with proper handling of single-child nodes.
         */
        // Base case: empty node
        if (root == null) return 0;

        // Case 1: Leaf node - depth is 1
        if (root.left == null && root.right == null) return 1;

        // Case 2: Only left child exists - must go left
        if (root.right == null) return 1 + minDepth(root.left);

        // Case 3: Only right child exists - must go right
        if (root.left == null) return 1 + minDepth(root.right);

        // Case 4: Both children exist - take minimum
        return 1 + Math.min(minDepth(root.left), minDepth(root.right));
    }
}
```

</div>

## Complexity Analysis

**BFS Approach:**

- **Time Complexity:** O(n) in the worst case, where n is the number of nodes. We might need to visit all nodes if the tree is completely unbalanced (like a linked list), but we stop as soon as we find the first leaf.
- **Space Complexity:** O(n) in the worst case for the queue. In a complete binary tree, the maximum queue size would be at the last level, which contains roughly n/2 nodes.

**DFS Approach:**

- **Time Complexity:** O(n) since we might visit all nodes in the worst case.
- **Space Complexity:** O(h) where h is the height of the tree, due to the recursion stack. In the worst case (skewed tree), h = n, giving O(n) space. In a balanced tree, h = log(n).

The BFS approach is generally preferred for this problem because it can stop early when it finds the first leaf at the minimum depth, while DFS might explore deeper paths before finding shallower ones.

## Common Mistakes

1. **Using min(left, right) without handling single-child nodes:** This is the most common mistake. Candidates try to adapt the maximum depth solution by replacing `max()` with `min()`, but this fails when a node has only one child because `min(None, depth)` treats `None` as 0, incorrectly suggesting a leaf was found.

2. **Forgetting the empty tree case:** Always check if the root is `null`/`None` at the beginning. An empty tree has depth 0 by convention.

3. **Incorrect leaf detection:** Some candidates check `if not node:` instead of `if not node.left and not node.right:`. The former checks if the node itself is null, while the latter correctly identifies leaf nodes.

4. **Off-by-one errors in depth calculation:** Remember that depth is measured in number of nodes, not edges. The root has depth 1, not 0. When you move to a child, you add 1 to the current depth.

## When You'll See This Pattern

The BFS level-order traversal pattern appears in many tree problems:

1. **Binary Tree Level Order Traversal (LeetCode 102):** This problem also uses BFS to process nodes level by level, but instead of stopping at the first leaf, it collects all nodes at each level.

2. **Find Bottom Left Tree Value (LeetCode 513):** Uses BFS to find the leftmost value at the last level, which requires traversing the entire tree level by level.

3. **Average of Levels in Binary Tree (LeetCode 637):** Another level-order traversal problem where you process all nodes at each level to compute averages.

The DFS approach with case analysis is similar to:

- **Maximum Depth of Binary Tree (LeetCode 104):** The simpler version where you can use `max(left, right)` without special cases.
- **Balanced Binary Tree (LeetCode 110):** Requires checking both subtrees and handling different cases based on their properties.

## Key Takeaways

1. **BFS finds shortest paths in unweighted graphs:** In trees (which are acyclic graphs), BFS explores level by level, so the first leaf encountered gives the minimum depth. This is analogous to finding the shortest path in maze problems.

2. **Leaf detection is crucial:** A leaf is defined as a node with no children (`!node.left && !node.right`), not just any node. This distinction matters for problems involving path termination conditions.

3. **Adapt solutions carefully:** Just because maximum depth uses `max(left, right)` doesn't mean minimum depth uses `min(left, right)`. Always consider edge cases like single-child nodes that break the pattern.

Related problems: [Binary Tree Level Order Traversal](/problem/binary-tree-level-order-traversal), [Maximum Depth of Binary Tree](/problem/maximum-depth-of-binary-tree)
