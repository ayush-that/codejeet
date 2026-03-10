---
title: "How to Solve Deepest Leaves Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Deepest Leaves Sum. Medium difficulty, 86.5% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2027-07-29"
category: "dsa-patterns"
tags: ["deepest-leaves-sum", "tree", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Deepest Leaves Sum

You're given the root of a binary tree and need to find the sum of values of its deepest leaves. The challenge is identifying which leaves are at the maximum depth and summing only those values, not all leaves. This problem is interesting because it requires tracking both depth and values simultaneously, and there are multiple valid approaches with different trade-offs.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
Tree: [1,2,3,4,5,null,6,7,null,null,null,null,8]
Visual representation:
        1
       / \
      2   3
     / \   \
    4   5   6
   /         \
  7           8
```

We need to find the deepest leaves and sum their values:

- Depth 0: Node 1 (not a leaf)
- Depth 1: Nodes 2 and 3 (not leaves)
- Depth 2: Nodes 4, 5, and 6 (nodes 4 and 6 aren't leaves yet)
- Depth 3: Nodes 7 and 8 (both are leaves at maximum depth)

The deepest leaves are at depth 3 with values 7 and 8, so the sum is 7 + 8 = 15.

The key insight: we need to traverse the tree while tracking the current depth, and when we find leaves deeper than any we've seen before, we reset our sum. If we find leaves at the same depth as our current maximum, we add to the existing sum.

## Brute Force Approach

A naive approach might be:

1. First pass: Find the maximum depth of the tree using DFS
2. Second pass: Traverse again, summing all leaves at that maximum depth

While this works, it requires two complete traversals of the tree. The code would look like:

<div class="code-group">

```python
# Time: O(2n) = O(n) but two passes | Space: O(h) for recursion
def deepestLeavesSum(root):
    if not root:
        return 0

    # First pass: find max depth
    def maxDepth(node):
        if not node:
            return 0
        return 1 + max(maxDepth(node.left), maxDepth(node.right))

    max_depth = maxDepth(root)

    # Second pass: sum leaves at max depth
    def sumAtDepth(node, current_depth):
        if not node:
            return 0
        if not node.left and not node.right and current_depth == max_depth:
            return node.val
        return (sumAtDepth(node.left, current_depth + 1) +
                sumAtDepth(node.right, current_depth + 1))

    return sumAtDepth(root, 1)
```

```javascript
// Time: O(2n) = O(n) but two passes | Space: O(h) for recursion
function deepestLeavesSum(root) {
  if (!root) return 0;

  // First pass: find max depth
  function maxDepth(node) {
    if (!node) return 0;
    return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));
  }

  const maxDepthVal = maxDepth(root);

  // Second pass: sum leaves at max depth
  function sumAtDepth(node, currentDepth) {
    if (!node) return 0;
    if (!node.left && !node.right && currentDepth === maxDepthVal) {
      return node.val;
    }
    return sumAtDepth(node.left, currentDepth + 1) + sumAtDepth(node.right, currentDepth + 1);
  }

  return sumAtDepth(root, 1);
}
```

```java
// Time: O(2n) = O(n) but two passes | Space: O(h) for recursion
public int deepestLeavesSum(TreeNode root) {
    if (root == null) return 0;

    // First pass: find max depth
    int maxDepth = maxDepth(root);

    // Second pass: sum leaves at max depth
    return sumAtDepth(root, 1, maxDepth);
}

private int maxDepth(TreeNode node) {
    if (node == null) return 0;
    return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));
}

private int sumAtDepth(TreeNode node, int currentDepth, int targetDepth) {
    if (node == null) return 0;
    if (node.left == null && node.right == null && currentDepth == targetDepth) {
        return node.val;
    }
    return sumAtDepth(node.left, currentDepth + 1, targetDepth) +
           sumAtDepth(node.right, currentDepth + 1, targetDepth);
}
```

</div>

This brute force works but is inefficient because we traverse the entire tree twice. While the time complexity is still O(n), we can do better with a single traversal.

## Optimized Approach

The key insight for optimization: we can track both the current maximum depth and the sum of leaves at that depth in a single traversal. As we traverse:

1. If we find a leaf deeper than our current maximum depth:
   - Reset the sum to this leaf's value
   - Update maximum depth to this leaf's depth
2. If we find a leaf at the same depth as our current maximum:
   - Add this leaf's value to our running sum
3. If we find a leaf at a shallower depth:
   - Ignore it (it's not at the deepest level)

We can implement this using either DFS (depth-first search) or BFS (breadth-first search). DFS is more natural for tracking depth, while BFS naturally processes levels, making it easy to sum the last level.

**DFS Approach:** Use recursion or a stack to traverse while tracking depth. Maintain global/mutable variables for max depth and sum.

**BFS Approach:** Process level by level. Keep summing each level, and when we finish the last level, that sum is our answer. This is particularly elegant because the last level processed in BFS is always the deepest level.

## Optimal Solution

Here are complete implementations using both DFS and BFS approaches:

<div class="code-group">

```python
# Time: O(n) | Space: O(h) where h is tree height (DFS approach)
def deepestLeavesSum(root):
    """
    DFS approach: Track max depth and sum during single traversal.
    """
    max_depth = 0
    total_sum = 0

    def dfs(node, depth):
        nonlocal max_depth, total_sum

        if not node:
            return

        # If this is a leaf node
        if not node.left and not node.right:
            # Case 1: Found deeper leaf than current max
            if depth > max_depth:
                max_depth = depth      # Update max depth
                total_sum = node.val   # Reset sum to this leaf's value
            # Case 2: Found leaf at current max depth
            elif depth == max_depth:
                total_sum += node.val  # Add to existing sum
            # Case 3: Shallower leaf - ignore (do nothing)

        # Recursively traverse left and right subtrees
        dfs(node.left, depth + 1)
        dfs(node.right, depth + 1)

    dfs(root, 0)  # Start with root at depth 0 (or 1, either works with adjustment)
    return total_sum

# Alternative BFS approach (often preferred for clarity)
def deepestLeavesSumBFS(root):
    """
    BFS approach: Process level by level, return sum of last level.
    """
    if not root:
        return 0

    queue = [root]
    level_sum = 0

    while queue:
        level_sum = 0  # Reset sum for current level
        level_size = len(queue)

        # Process all nodes at current level
        for _ in range(level_size):
            node = queue.pop(0)
            level_sum += node.val

            # Add children to queue for next level
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

    # After loop, level_sum contains sum of last (deepest) level
    return level_sum
```

```javascript
// Time: O(n) | Space: O(h) where h is tree height (DFS approach)
function deepestLeavesSum(root) {
  /**
   * DFS approach: Track max depth and sum during single traversal.
   */
  let maxDepth = 0;
  let totalSum = 0;

  function dfs(node, depth) {
    if (!node) return;

    // If this is a leaf node
    if (!node.left && !node.right) {
      // Case 1: Found deeper leaf than current max
      if (depth > maxDepth) {
        maxDepth = depth; // Update max depth
        totalSum = node.val; // Reset sum to this leaf's value
      }
      // Case 2: Found leaf at current max depth
      else if (depth === maxDepth) {
        totalSum += node.val; // Add to existing sum
      }
      // Case 3: Shallower leaf - ignore (do nothing)
    }

    // Recursively traverse left and right subtrees
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  }

  dfs(root, 0); // Start with root at depth 0
  return totalSum;
}

// Alternative BFS approach (often preferred for clarity)
function deepestLeavesSumBFS(root) {
  /**
   * BFS approach: Process level by level, return sum of last level.
   */
  if (!root) return 0;

  let queue = [root];
  let levelSum = 0;

  while (queue.length > 0) {
    levelSum = 0; // Reset sum for current level
    const levelSize = queue.length;

    // Process all nodes at current level
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      levelSum += node.val;

      // Add children to queue for next level
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  // After loop, levelSum contains sum of last (deepest) level
  return levelSum;
}
```

```java
// Time: O(n) | Space: O(h) where h is tree height (DFS approach)
class Solution {
    private int maxDepth = 0;
    private int totalSum = 0;

    public int deepestLeavesSum(TreeNode root) {
        /**
         * DFS approach: Track max depth and sum during single traversal.
         */
        dfs(root, 0);
        return totalSum;
    }

    private void dfs(TreeNode node, int depth) {
        if (node == null) return;

        // If this is a leaf node
        if (node.left == null && node.right == null) {
            // Case 1: Found deeper leaf than current max
            if (depth > maxDepth) {
                maxDepth = depth;      // Update max depth
                totalSum = node.val;   // Reset sum to this leaf's value
            }
            // Case 2: Found leaf at current max depth
            else if (depth == maxDepth) {
                totalSum += node.val;  // Add to existing sum
            }
            // Case 3: Shallower leaf - ignore (do nothing)
        }

        // Recursively traverse left and right subtrees
        dfs(node.left, depth + 1);
        dfs(node.right, depth + 1);
    }
}

// Alternative BFS approach (often preferred for clarity)
class SolutionBFS {
    public int deepestLeavesSum(TreeNode root) {
        /**
         * BFS approach: Process level by level, return sum of last level.
         */
        if (root == null) return 0;

        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int levelSum = 0;

        while (!queue.isEmpty()) {
            levelSum = 0;  // Reset sum for current level
            int levelSize = queue.size();

            // Process all nodes at current level
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                levelSum += node.val;

                // Add children to queue for next level
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
        }

        // After loop, levelSum contains sum of last (deepest) level
        return levelSum;
    }
}
```

</div>

## Complexity Analysis

**DFS Approach:**

- **Time Complexity:** O(n) where n is the number of nodes. We visit each node exactly once.
- **Space Complexity:** O(h) where h is the height of the tree. This is the maximum depth of the recursion stack. In the worst case (skewed tree), h = n, giving O(n). In the best case (balanced tree), h = log n.

**BFS Approach:**

- **Time Complexity:** O(n) where n is the number of nodes. We visit each node exactly once.
- **Space Complexity:** O(w) where w is the maximum width of the tree (maximum number of nodes at any level). In the worst case (complete binary tree), the last level has ~n/2 nodes, giving O(n).

Both approaches have the same time complexity. The choice between them depends on:

- DFS uses less space for deep, narrow trees
- BFS uses less space for wide, shallow trees
- BFS is often more intuitive for level-based problems

## Common Mistakes

1. **Summing all leaves instead of deepest leaves:** Candidates sometimes return the sum of ALL leaves rather than only those at the maximum depth. Always verify you're checking depth conditions.

2. **Incorrect depth tracking in DFS:** Forgetting to increment depth when recursing to children, or starting depth at 1 vs 0 inconsistently. Be consistent: if root is depth 0, leaves are at depth > 0.

3. **Not resetting sum when finding deeper leaves:** In the DFS approach, when you find a leaf deeper than your current max, you must reset the sum to this leaf's value (not add to existing sum).

4. **BFS implementation errors:**
   - Not using level-order traversal correctly (missing the inner for-loop)
   - Returning sum after processing each level instead of only the last level
   - Forgetting to reset level_sum at the start of each level

5. **Edge case handling:** Forgetting to handle empty tree (root is null). Always check for this first.

## When You'll See This Pattern

This problem combines tree traversal with depth/level tracking, a common pattern in tree problems:

1. **Binary Tree Level Order Traversal (LeetCode 102):** Similar BFS level-by-level processing.
2. **Maximum Depth of Binary Tree (LeetCode 104):** Uses similar DFS depth tracking.
3. **Find Bottom Left Tree Value (LeetCode 513):** Another "deepest node" problem that can use similar DFS or BFS approaches.
4. **Sum of Left Leaves (LeetCode 404):** Similar structure but with additional condition (only left leaves).

The pattern is: when you need information about nodes at specific depths or the deepest level, consider BFS for level-order processing or DFS with depth tracking.

## Key Takeaways

1. **BFS is natural for level-based problems:** When you need to process or analyze tree levels, BFS with level-order traversal (using a queue with size tracking) is often the most intuitive approach.

2. **DFS can track depth efficiently:** For problems involving maximum/minimum depth, DFS with depth parameter passing allows single-traversal solutions.

3. **Choose based on tree shape and space constraints:** DFS uses O(h) space (good for deep trees), BFS uses O(w) space (good for wide trees). Consider which is more appropriate.

4. **Always handle edge cases:** Empty tree (null root), single node tree, skewed trees, and balanced trees should all be tested.

[Practice this problem on CodeJeet](/problem/deepest-leaves-sum)
