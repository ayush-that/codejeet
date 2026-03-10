---
title: "How to Solve Maximum Width of Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Width of Binary Tree. Medium difficulty, 45.3% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2027-03-19"
category: "dsa-patterns"
tags:
  ["maximum-width-of-binary-tree", "tree", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Maximum Width of Binary Tree

This problem asks us to find the maximum width of a binary tree, where width is defined as the distance between the leftmost and rightmost non-null nodes at each level, counting null nodes between them. The tricky part is that we need to account for "gaps" in the tree structure—if a level has nodes scattered with nulls between them, we must include those null positions in our width calculation.

What makes this problem interesting is that we can't simply count nodes at each level. We need a way to track each node's "position" within its level to calculate the true width, including null positions. This requires a clever numbering scheme.

## Visual Walkthrough

Let's trace through a simple example to build intuition:

```
Tree: [1,3,2,5,3,null,9]
Visual representation:
       1
      / \
     3   2
    / \   \
   5   3   9
```

**Level 0:** Only node 1. If we assign it position 0, width = 1 (rightmost - leftmost + 1 = 0 - 0 + 1 = 1)

**Level 1:** Nodes 3 (left child of 1) and 2 (right child of 1).

- Node 3 gets position 0 (2\*0 + 0 = 0)
- Node 2 gets position 1 (2\*0 + 1 = 1)
- Width = 1 - 0 + 1 = 2

**Level 2:** Nodes 5 (left child of 3), 3 (right child of 3), and 9 (right child of 2)

- Node 5: parent position 0 → 2\*0 + 0 = 0
- Node 3: parent position 0 → 2\*0 + 1 = 1
- Node 9: parent position 1 → 2\*1 + 1 = 3
- Leftmost position = 0, rightmost = 3
- Width = 3 - 0 + 1 = 4

The maximum width is max(1, 2, 4) = 4.

Notice how node 9 has position 3 because its parent (node 2) was at position 1. The gap between positions 1 and 3 represents a null left child of node 2, which contributes to the width.

## Brute Force Approach

A naive approach might try to store the entire tree as an array (like a heap) and then calculate widths by finding the first and last non-null nodes at each level. However, this approach has serious issues:

1. **Memory Explosion**: For a tree of height h, we'd need to store 2^h - 1 positions, even if most are null. For a skewed tree of n nodes, this becomes O(2^n) memory.
2. **Incorrect Width Calculation**: The problem defines width based on positions, not just node counts. Two nodes at the same level with nulls between them should have a larger width than two adjacent nodes.

Here's what the brute force might look like conceptually:

```python
def widthOfBinaryTree(root):
    if not root:
        return 0

    # Build complete binary tree array
    tree_array = [root]
    max_width = 1

    level_start = 0
    level_size = 1

    while True:
        # Track non-null nodes in current level
        leftmost = None
        rightmost = None

        for i in range(level_start, level_start + level_size):
            if i < len(tree_array) and tree_array[i] is not None:
                if leftmost is None:
                    leftmost = i
                rightmost = i

        if leftmost is None:  # No more nodes
            break

        width = rightmost - leftmost + 1
        max_width = max(max_width, width)

        # Expand array for next level
        next_level = []
        for i in range(level_start, level_start + level_size):
            if i < len(tree_array) and tree_array[i] is not None:
                next_level.extend([tree_array[i].left, tree_array[i].right])
            else:
                next_level.extend([None, None])

        tree_array.extend(next_level)
        level_start += level_size
        level_size *= 2

    return max_width
```

**Why it's too slow**: This approach uses O(2^h) space where h is the tree height. For a tree with n nodes, h could be O(n) in the worst case (skewed tree), giving us O(2^n) space complexity—completely impractical.

## Optimized Approach

The key insight is that we don't need to store null nodes explicitly. Instead, we can assign each node a "position index" and track only the actual nodes. Here's the step-by-step reasoning:

1. **Position Numbering**: Assign the root position 0. For any node at position `i`:
   - Its left child gets position `2*i`
   - Its right child gets position `2*i + 1`

2. **Level Tracking**: Use BFS (level-order traversal) to process nodes level by level. For each level:
   - Track the first (leftmost) position
   - Track the last (rightmost) position
   - Width = last_position - first_position + 1

3. **Avoiding Integer Overflow**: In deep trees, positions can grow very large (2^h). We can avoid overflow by normalizing positions at each level: subtract the minimum position of the level from all positions. This keeps numbers manageable without affecting width calculations.

**Why this works**: The position numbering creates a coordinate system where the distance between any two nodes at the same level accurately represents the number of positions (including nulls) between them. By tracking only actual nodes and their positions, we get O(n) space instead of exponential.

## Optimal Solution

Here's the complete solution using BFS with position tracking:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
# We visit each node exactly once and store each node in the queue
from collections import deque

def widthOfBinaryTree(root):
    """
    Calculate the maximum width of a binary tree.

    The width of a level is defined as the distance between the
    leftmost and rightmost non-null nodes at that level,
    including null nodes between them.
    """
    if not root:
        return 0

    # Queue stores tuples of (node, position_index)
    # We start with root at position 0
    queue = deque([(root, 0)])
    max_width = 0

    while queue:
        level_length = len(queue)

        # Get the position of the first node in this level
        # This will be our "base" for this level
        first_pos = queue[0][1]
        last_pos = queue[-1][1]

        # Calculate width for current level
        # +1 because width is inclusive of both ends
        current_width = last_pos - first_pos + 1
        max_width = max(max_width, current_width)

        # Process all nodes at the current level
        for _ in range(level_length):
            node, pos = queue.popleft()

            # Normalize position to prevent integer overflow in deep trees
            # Subtract first_pos to keep numbers small
            normalized_pos = pos - first_pos

            # Add children to queue with their positions
            if node.left:
                # Left child position: 2 * parent_position
                queue.append((node.left, 2 * normalized_pos))

            if node.right:
                # Right child position: 2 * parent_position + 1
                queue.append((node.right, 2 * normalized_pos + 1))

    return max_width
```

```javascript
// Time: O(n) | Space: O(n)
// We visit each node exactly once and store each node in the queue

function widthOfBinaryTree(root) {
  /**
   * Calculate the maximum width of a binary tree.
   *
   * The width of a level is defined as the distance between the
   * leftmost and rightmost non-null nodes at that level,
   * including null nodes between them.
   */
  if (!root) return 0;

  // Queue stores arrays of [node, positionIndex]
  // We start with root at position 0
  const queue = [[root, 0]];
  let maxWidth = 0;

  while (queue.length > 0) {
    const levelLength = queue.length;

    // Get the position of the first node in this level
    // This will be our "base" for this level
    const firstPos = queue[0][1];
    const lastPos = queue[queue.length - 1][1];

    // Calculate width for current level
    // +1 because width is inclusive of both ends
    const currentWidth = lastPos - firstPos + 1;
    maxWidth = Math.max(maxWidth, currentWidth);

    // Process all nodes at the current level
    for (let i = 0; i < levelLength; i++) {
      const [node, pos] = queue.shift();

      // Normalize position to prevent integer overflow in deep trees
      // Subtract firstPos to keep numbers small
      const normalizedPos = pos - firstPos;

      // Add children to queue with their positions
      if (node.left) {
        // Left child position: 2 * parent_position
        queue.push([node.left, 2 * normalizedPos]);
      }

      if (node.right) {
        // Right child position: 2 * parent_position + 1
        queue.push([node.right, 2 * normalizedPos + 1]);
      }
    }
  }

  return maxWidth;
}
```

```java
// Time: O(n) | Space: O(n)
// We visit each node exactly once and store each node in the queue

import java.util.LinkedList;
import java.util.Queue;

class Solution {
    public int widthOfBinaryTree(TreeNode root) {
        /**
         * Calculate the maximum width of a binary tree.
         *
         * The width of a level is defined as the distance between the
         * leftmost and rightmost non-null nodes at that level,
         * including null nodes between them.
         */
        if (root == null) return 0;

        // Queue stores pairs of (node, positionIndex)
        // We use a custom class to store the pair
        Queue<Pair<TreeNode, Integer>> queue = new LinkedList<>();
        queue.offer(new Pair<>(root, 0));
        int maxWidth = 0;

        while (!queue.isEmpty()) {
            int levelLength = queue.size();

            // Get the position of the first node in this level
            // This will be our "base" for this level
            int firstPos = queue.peek().getValue();
            int lastPos = firstPos;

            // Process all nodes at the current level
            for (int i = 0; i < levelLength; i++) {
                Pair<TreeNode, Integer> current = queue.poll();
                TreeNode node = current.getKey();
                int pos = current.getValue();

                // Update last position for this level
                lastPos = pos;

                // Normalize position to prevent integer overflow in deep trees
                // We'll subtract firstPos when calculating child positions
                int normalizedPos = pos - firstPos;

                // Add children to queue with their positions
                if (node.left != null) {
                    // Left child position: 2 * parent_position
                    queue.offer(new Pair<>(node.left, 2 * normalizedPos));
                }

                if (node.right != null) {
                    // Right child position: 2 * parent_position + 1
                    queue.offer(new Pair<>(node.right, 2 * normalizedPos + 1));
                }
            }

            // Calculate width for current level
            // +1 because width is inclusive of both ends
            int currentWidth = lastPos - firstPos + 1;
            maxWidth = Math.max(maxWidth, currentWidth);
        }

        return maxWidth;
    }

    // Helper class for storing node-position pairs
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

## Complexity Analysis

**Time Complexity: O(n)**

- We perform a standard BFS traversal, visiting each node exactly once
- Each node is processed in constant time (queue operations and position calculations)
- Total operations: O(n) where n is the number of nodes in the tree

**Space Complexity: O(n)**

- In the worst case, the queue stores all nodes at the widest level
- For a complete binary tree, the last level contains roughly n/2 nodes
- Therefore, worst-case space is O(n)

The position normalization (subtracting `firstPos`) is crucial for preventing integer overflow in languages without arbitrary-precision integers. Without it, positions could reach 2^h where h is the tree height, which for h=1000 would be astronomically large.

## Common Mistakes

1. **Forgetting to handle the empty tree**: Always check if root is null at the beginning. An empty tree has width 0.

2. **Not accounting for null nodes in width calculation**: Some candidates try to count only the actual nodes at each level, but the problem specifically includes null nodes between the leftmost and rightmost non-null nodes. The position numbering scheme solves this.

3. **Integer overflow in deep trees**: Without position normalization, the position indices can grow exponentially (2^h). In Java/C++, this causes integer overflow for trees deeper than ~31 levels. The normalization trick (subtracting the minimum position at each level) keeps numbers small.

4. **Using DFS instead of BFS for level tracking**: While DFS is possible, BFS is more natural for this problem because we need to process nodes level by level. With DFS, you'd need to track the minimum and maximum positions at each depth separately.

## When You'll See This Pattern

This "position indexing" pattern appears in several tree problems:

1. **Serialize and Deserialize Binary Tree (LeetCode 297)**: Uses similar position-based encoding to represent tree structure compactly.

2. **Check Completeness of a Binary Tree (LeetCode 958)**: Also uses position indexing to check if all nodes are as far left as possible.

3. **Count Complete Tree Nodes (LeetCode 222)**: Uses binary search on the position space to count nodes efficiently in a complete tree.

The core idea is mapping tree nodes to positions in an imaginary complete binary tree array, which allows us to reason about their relationships and distances.

## Key Takeaways

1. **Position indexing transforms tree problems into array problems**: By assigning each node a position in an imaginary complete binary tree array, we can use simple arithmetic to calculate distances and relationships.

2. **BFS + position tracking is powerful for level-based calculations**: When you need to compute something per level (like width), BFS with position tracking often provides an elegant solution.

3. **Normalization prevents overflow**: When dealing with exponentially growing indices, subtract the minimum value at each step to keep numbers manageable without affecting relative differences.

[Practice this problem on CodeJeet](/problem/maximum-width-of-binary-tree)
