---
title: "How to Solve Find Bottom Left Tree Value — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Bottom Left Tree Value. Medium difficulty, 72.2% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2027-06-21"
category: "dsa-patterns"
tags:
  ["find-bottom-left-tree-value", "tree", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Find Bottom Left Tree Value

Given the root of a binary tree, you need to find the leftmost value in the deepest row of the tree. This problem is interesting because it combines tree traversal with tracking both depth and leftmost position, requiring careful state management during traversal.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this binary tree:

```
        1
       / \
      2   3
     /   / \
    4   5   6
       /
      7
```

We need to find the leftmost value in the last row. The last row contains nodes 4 and 7 (and possibly 6 depending on how you count, but depth-wise, 7 is at depth 4 while 4 is at depth 3). Let's examine the depths:

- Node 1: depth 1
- Node 2: depth 2
- Node 3: depth 2
- Node 4: depth 3
- Node 5: depth 3
- Node 6: depth 3
- Node 7: depth 4

The deepest row is depth 4, which contains only node 7. Since it's the only node at that depth, it's also the leftmost. So our answer should be 7.

Now let's think about how we'd find this systematically. We need to:

1. Determine the maximum depth of the tree
2. Find the leftmost node at that maximum depth

The challenge is doing both efficiently in a single traversal.

## Brute Force Approach

A naive approach might involve two passes:

1. First, perform a traversal (BFS or DFS) to find the maximum depth of the tree
2. Second, perform another traversal to find the leftmost node at that depth

While this would work, it's inefficient because we're traversing the tree twice. In an interview, you'd want to optimize this to a single traversal.

Another brute force approach might involve collecting all nodes by level and then returning the first node of the last level. This is actually a reasonable BFS approach, but we need to think about whether we can do better with DFS.

## Optimized Approach

The key insight is that we can track both the current depth and the maximum depth seen so far during a single DFS traversal. We use a pre-order traversal (root, left, right) because we want to visit the leftmost nodes first at each depth.

Here's the step-by-step reasoning:

1. **Why DFS over BFS?** Both work, but DFS can be implemented recursively which is often cleaner. BFS would require a queue and level-by-level processing.

2. **Tracking state:** We need to track:
   - `maxDepth`: the maximum depth encountered so far
   - `result`: the value of the leftmost node at the maximum depth
   - `currentDepth`: the depth of the current node

3. **Traversal order:** We use pre-order traversal (visit root, then left subtree, then right subtree) because:
   - We visit nodes in a depth-first manner
   - By visiting the left child before the right child, we ensure that the first node we encounter at a new maximum depth is the leftmost node at that depth

4. **Update logic:** When we encounter a node:
   - If `currentDepth > maxDepth`, this is a new deepest level
   - Since we're doing pre-order and visiting left before right, the first node we see at a new depth is guaranteed to be the leftmost at that depth
   - So we update both `maxDepth` and `result`

5. **Recursive exploration:** We recursively explore left and right subtrees, incrementing the depth as we go down.

This approach works in O(n) time with O(h) space (for the recursion stack), where h is the height of the tree.

## Optimal Solution

Here's the complete implementation using DFS with recursion:

<div class="code-group">

```python
# Time: O(n) where n is the number of nodes in the tree
# Space: O(h) where h is the height of the tree (recursion stack)
class Solution:
    def findBottomLeftValue(self, root):
        # Initialize variables to track the deepest level and its leftmost value
        self.max_depth = -1  # Start with -1 so root at depth 0 is deeper
        self.result = 0

        # Start DFS traversal from the root with depth 0
        self.dfs(root, 0)
        return self.result

    def dfs(self, node, depth):
        # Base case: if node is None, return (reached end of path)
        if not node:
            return

        # Check if we've reached a new maximum depth
        # Since we traverse left before right, the first node at a new depth
        # is guaranteed to be the leftmost node at that depth
        if depth > self.max_depth:
            self.max_depth = depth
            self.result = node.val

        # Recursively traverse left subtree first (important for leftmost property)
        # Then traverse right subtree
        # Depth increases by 1 as we go down a level
        self.dfs(node.left, depth + 1)
        self.dfs(node.right, depth + 1)
```

```javascript
// Time: O(n) where n is the number of nodes in the tree
// Space: O(h) where h is the height of the tree (recursion stack)
function findBottomLeftValue(root) {
  // Initialize variables to track the deepest level and its leftmost value
  let maxDepth = -1; // Start with -1 so root at depth 0 is deeper
  let result = 0;

  // Helper function for DFS traversal
  function dfs(node, depth) {
    // Base case: if node is null, return (reached end of path)
    if (node === null) {
      return;
    }

    // Check if we've reached a new maximum depth
    // Since we traverse left before right, the first node at a new depth
    // is guaranteed to be the leftmost node at that depth
    if (depth > maxDepth) {
      maxDepth = depth;
      result = node.val;
    }

    // Recursively traverse left subtree first (important for leftmost property)
    // Then traverse right subtree
    // Depth increases by 1 as we go down a level
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  }

  // Start DFS traversal from the root with depth 0
  dfs(root, 0);
  return result;
}
```

```java
// Time: O(n) where n is the number of nodes in the tree
// Space: O(h) where h is the height of the tree (recursion stack)
class Solution {
    // Class variables to track state during DFS
    private int maxDepth = -1;  // Start with -1 so root at depth 0 is deeper
    private int result = 0;

    public int findBottomLeftValue(TreeNode root) {
        // Start DFS traversal from the root with depth 0
        dfs(root, 0);
        return result;
    }

    private void dfs(TreeNode node, int depth) {
        // Base case: if node is null, return (reached end of path)
        if (node == null) {
            return;
        }

        // Check if we've reached a new maximum depth
        // Since we traverse left before right, the first node at a new depth
        // is guaranteed to be the leftmost node at that depth
        if (depth > maxDepth) {
            maxDepth = depth;
            result = node.val;
        }

        // Recursively traverse left subtree first (important for leftmost property)
        // Then traverse right subtree
        // Depth increases by 1 as we go down a level
        dfs(node.left, depth + 1);
        dfs(node.right, depth + 1);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We visit each node exactly once during the DFS traversal
- Each node is processed in constant time (checking depth and updating result)
- Therefore, time complexity is linear in the number of nodes

**Space Complexity:** O(h) where h is the height of the tree

- In the worst case (skewed tree), h = n, so O(n)
- In the best case (balanced tree), h = log n, so O(log n)
- The space is used by the recursion call stack
- For BFS approach, space complexity would be O(w) where w is the maximum width of the tree

## Common Mistakes

1. **Forgetting to traverse left before right:** This is crucial! If you traverse right subtree before left, you'll get the rightmost value at the deepest level instead of the leftmost. Always do left-first traversal in DFS solutions.

2. **Incorrect depth initialization:** Starting `maxDepth` at 0 instead of -1 can cause issues. If you start at 0, the root node (depth 0) won't trigger the update condition `depth > maxDepth`. Starting at -1 ensures the root is properly considered.

3. **Not handling the single node case:** When the tree has only one node (the root), the answer should be the root's value. Test this edge case to ensure your solution handles it correctly.

4. **Using BFS without tracking the first node in each level:** If using BFS, you need to track which node is the first in each level. A common mistake is to simply return the last node processed, which might be the rightmost node at the deepest level.

## When You'll See This Pattern

This pattern of tracking depth during tree traversal appears in many tree problems:

1. **Maximum Depth of Binary Tree (LeetCode 104):** Similar DFS approach tracking depth, but simpler since you only need the maximum depth, not the value at that depth.

2. **Binary Tree Right Side View (LeetCode 199):** Instead of tracking the leftmost node at each depth, you track the rightmost node. The traversal order changes (right before left instead of left before right).

3. **Find Largest Value in Each Tree Row (LeetCode 515):** Similar level-based tracking, but instead of tracking just the leftmost value, you track the maximum value at each level.

The core technique is DFS with state tracking (depth, result) that gets updated based on traversal order. Recognizing when to use pre-order, in-order, or post-order traversal based on what information you need is key.

## Key Takeaways

1. **DFS with state tracking:** Many tree problems can be solved with DFS while tracking additional state (depth, sum, count, etc.). The state gets updated based on conditions met during traversal.

2. **Traversal order matters:** For problems involving "leftmost" or "rightmost" nodes, the order in which you traverse subtrees is crucial. Left-first gives leftmost nodes, right-first gives rightmost nodes.

3. **Single pass optimization:** Whenever possible, try to solve tree problems in a single traversal rather than multiple passes. This often involves tracking multiple pieces of information simultaneously.

[Practice this problem on CodeJeet](/problem/find-bottom-left-tree-value)
