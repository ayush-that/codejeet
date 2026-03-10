---
title: "How to Solve Find Largest Value in Each Tree Row — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Largest Value in Each Tree Row. Medium difficulty, 66.3% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2027-04-30"
category: "dsa-patterns"
tags:
  [
    "find-largest-value-in-each-tree-row",
    "tree",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Find the Largest Value in Each Tree Row

This problem asks us to traverse a binary tree and collect the maximum value at each depth level. While it sounds straightforward, the challenge lies in efficiently tracking which nodes belong to which level during traversal. You need to process nodes level by level while maintaining the current maximum for each row.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this tree:

```
        1
       / \
      3   2
     / \   \
    5   3   9
```

**Row 0 (root level):** Only node with value 1 → max = 1  
**Row 1:** Nodes with values 3 and 2 → max = 3  
**Row 2:** Nodes with values 5, 3, and 9 → max = 9

The expected output is `[1, 3, 9]`.

Now let's think about traversal. If we use BFS (level-order traversal), we naturally process nodes level by level. For each level, we can track the maximum value as we process all nodes at that depth. With DFS, we need to track the current depth and update a result array as we encounter nodes at different depths.

## Brute Force Approach

A truly naive approach might involve traversing the tree multiple times - once for each level to find its maximum. However, this would be extremely inefficient (O(n²) in the worst case for a skewed tree).

A more reasonable but still suboptimal approach would be to use DFS while storing all values by level in separate lists, then finding the maximum in each list:

1. Perform DFS traversal
2. Store all node values in lists organized by level
3. After traversal, iterate through each level's list to find the maximum

The problem with this approach is the extra space needed to store all values when we only need the maximums. While the time complexity would be O(n), the space complexity would be O(n + h) where h is the height of the tree, which is less optimal than necessary.

## Optimized Approach

The key insight is that we can track the maximum value for each level **as we traverse**, without storing all values. We have two main strategies:

**BFS (Level-order traversal):**

- Use a queue to process nodes level by level
- For each level, iterate through all nodes at that level
- Track the maximum value for the current level
- Add children to the queue for the next level
- Append the level's maximum to the result

**DFS (Pre-order traversal):**

- Maintain a result array where index = depth
- As we visit each node, compare its value with `result[depth]`
- If `depth >= len(result)`, this is the first node at this depth
- Otherwise, update `result[depth] = max(result[depth], node.val)`
- Recursively process left and right children with `depth + 1`

Both approaches have O(n) time complexity, but BFS uses O(w) space (where w is the maximum width of the tree) while DFS uses O(h) space (where h is the height). For balanced trees, BFS typically uses more space; for skewed trees, DFS uses more space.

## Optimal Solution

Here are complete implementations using both BFS and DFS approaches:

<div class="code-group">

```python
# Time: O(n) - we visit each node exactly once
# Space: O(w) - where w is the maximum width of the tree (BFS queue size)
from collections import deque
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def largestValues(self, root: Optional[TreeNode]) -> List[int]:
        """
        BFS approach using level-order traversal.
        Process nodes level by level, tracking max for each level.
        """
        # Handle empty tree case
        if not root:
            return []

        result = []
        queue = deque([root])  # Initialize queue with root node

        while queue:
            level_size = len(queue)  # Number of nodes at current level
            level_max = float('-inf')  # Initialize max for current level

            # Process all nodes at current level
            for _ in range(level_size):
                node = queue.popleft()
                level_max = max(level_max, node.val)  # Update level max

                # Add children to queue for next level processing
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

            result.append(level_max)  # Add level max to result

        return result

    def largestValuesDFS(self, root: Optional[TreeNode]) -> List[int]:
        """
        DFS approach using pre-order traversal.
        Track depth and update result array as we encounter nodes.
        """
        result = []

        def dfs(node: Optional[TreeNode], depth: int):
            # Base case: reached end of branch
            if not node:
                return

            # If this is the first node at this depth, add it to result
            if depth == len(result):
                result.append(node.val)
            else:
                # Otherwise, update the max for this depth
                result[depth] = max(result[depth], node.val)

            # Recursively process children with increased depth
            dfs(node.left, depth + 1)
            dfs(node.right, depth + 1)

        dfs(root, 0)
        return result
```

```javascript
// Time: O(n) - we visit each node exactly once
// Space: O(w) - where w is the maximum width of the tree (BFS queue size)

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class Solution {
  /**
   * BFS approach using level-order traversal.
   * Process nodes level by level, tracking max for each level.
   */
  largestValues(root) {
    // Handle empty tree case
    if (!root) {
      return [];
    }

    const result = [];
    const queue = [root]; // Initialize queue with root node

    while (queue.length > 0) {
      const levelSize = queue.length; // Number of nodes at current level
      let levelMax = -Infinity; // Initialize max for current level

      // Process all nodes at current level
      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift();
        levelMax = Math.max(levelMax, node.val); // Update level max

        // Add children to queue for next level processing
        if (node.left) {
          queue.push(node.left);
        }
        if (node.right) {
          queue.push(node.right);
        }
      }

      result.push(levelMax); // Add level max to result
    }

    return result;
  }

  /**
   * DFS approach using pre-order traversal.
   * Track depth and update result array as we encounter nodes.
   */
  largestValuesDFS(root) {
    const result = [];

    const dfs = (node, depth) => {
      // Base case: reached end of branch
      if (!node) {
        return;
      }

      // If this is the first node at this depth, add it to result
      if (depth === result.length) {
        result.push(node.val);
      } else {
        // Otherwise, update the max for this depth
        result[depth] = Math.max(result[depth], node.val);
      }

      // Recursively process children with increased depth
      dfs(node.left, depth + 1);
      dfs(node.right, depth + 1);
    };

    dfs(root, 0);
    return result;
  }
}
```

```java
// Time: O(n) - we visit each node exactly once
// Space: O(w) - where w is the maximum width of the tree (BFS queue size)

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
    /**
     * BFS approach using level-order traversal.
     * Process nodes level by level, tracking max for each level.
     */
    public List<Integer> largestValues(TreeNode root) {
        List<Integer> result = new ArrayList<>();

        // Handle empty tree case
        if (root == null) {
            return result;
        }

        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);  // Initialize queue with root node

        while (!queue.isEmpty()) {
            int levelSize = queue.size();  // Number of nodes at current level
            int levelMax = Integer.MIN_VALUE;  // Initialize max for current level

            // Process all nodes at current level
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                levelMax = Math.max(levelMax, node.val);  // Update level max

                // Add children to queue for next level processing
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }

            result.add(levelMax);  // Add level max to result
        }

        return result;
    }

    /**
     * DFS approach using pre-order traversal.
     * Track depth and update result array as we encounter nodes.
     */
    public List<Integer> largestValuesDFS(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        dfs(root, 0, result);
        return result;
    }

    private void dfs(TreeNode node, int depth, List<Integer> result) {
        // Base case: reached end of branch
        if (node == null) {
            return;
        }

        // If this is the first node at this depth, add it to result
        if (depth == result.size()) {
            result.add(node.val);
        } else {
            // Otherwise, update the max for this depth
            result.set(depth, Math.max(result.get(depth), node.val));
        }

        // Recursively process children with increased depth
        dfs(node.left, depth + 1, result);
        dfs(node.right, depth + 1, result);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) for both BFS and DFS approaches, where n is the number of nodes in the tree. Each node is visited exactly once.

**Space Complexity:**

- **BFS:** O(w) where w is the maximum width (number of nodes at the widest level) of the tree. In the worst case (perfect binary tree), this could be O(n/2) ≈ O(n).
- **DFS:** O(h) where h is the height of the tree. In the worst case (skewed tree), this could be O(n). The recursion stack stores at most h frames.

For most interview scenarios, either approach is acceptable. BFS is more intuitive for level-based problems, while DFS can be more elegant and uses less space for wide, shallow trees.

## Common Mistakes

1. **Forgetting to handle the empty tree case:** Always check if `root` is `null`/`None` at the beginning. An empty tree should return an empty array/list.

2. **Incorrect level tracking in BFS:** A common mistake is not tracking the level size properly. You must get `queue.size()` **before** processing the level, not during, because the queue size changes as you add children.

3. **Initializing level max incorrectly:** When initializing `levelMax`, use `-Infinity` (or `Integer.MIN_VALUE` in Java) rather than 0, as tree nodes can have negative values.

4. **DFS depth indexing errors:** In the DFS approach, remember that array indices start at 0, which corresponds to depth 0 (root level). When you encounter a new depth, you need to add to the result array; otherwise, update the existing value.

## When You'll See This Pattern

This problem combines tree traversal with level/depth tracking, a common pattern in tree problems:

1. **Binary Tree Level Order Traversal (LeetCode 102)** - Almost identical structure, but instead of tracking maximums, you collect all values by level.

2. **Find Bottom Left Tree Value (LeetCode 513)** - Uses similar level tracking to find specific nodes at certain depths.

3. **Average of Levels in Binary Tree (LeetCode 637)** - Same level-based processing but calculates averages instead of maximums.

The core technique of processing trees level by level (BFS) or tracking depth during traversal (DFS) appears in many tree problems where you need information organized by depth.

## Key Takeaways

1. **Level-based tree processing naturally suggests BFS**, but DFS with depth tracking can be equally effective and sometimes more space-efficient for certain tree shapes.

2. **When you need to process or aggregate data by tree level**, maintain a result array where the index represents depth, and update it as you traverse.

3. **Always consider edge cases**: empty trees, single-node trees, skewed trees (which affect space complexity), and trees with negative values (affects initialization of tracking variables).

[Practice this problem on CodeJeet](/problem/find-largest-value-in-each-tree-row)
