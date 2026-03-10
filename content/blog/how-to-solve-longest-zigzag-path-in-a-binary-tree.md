---
title: "How to Solve Longest ZigZag Path in a Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest ZigZag Path in a Binary Tree. Medium difficulty, 67.0% acceptance rate. Topics: Dynamic Programming, Tree, Depth-First Search, Binary Tree."
date: "2028-02-23"
category: "dsa-patterns"
tags:
  [
    "longest-zigzag-path-in-a-binary-tree",
    "dynamic-programming",
    "tree",
    "depth-first-search",
    "medium",
  ]
---

# How to Solve Longest ZigZag Path in a Binary Tree

This problem asks us to find the longest zigzag path in a binary tree, where a zigzag path alternates direction at each step (left-right-left or right-left-right). The tricky part is that the path can start at any node and go in either direction, but once you choose a starting direction, you must alternate directions at each step. This isn't just about finding the longest path—it's about finding the longest path with alternating directions, which requires tracking both the current direction and length simultaneously.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this tree:

```
        1
       / \
      2   3
     / \   \
    4   5   6
       / \
      7   8
```

Starting at node 2 going right:

- 2 → 5 (right child)
- 5 → 7 (left child, direction changes)
- 7 has no right child, so path ends with length 3

Starting at node 1 going left:

- 1 → 2 (left child)
- 2 → 4 (left child, but this breaks zigzag! Must alternate)
- So valid path length is only 1

Starting at node 5 going right:

- 5 → 8 (right child)
- 8 has no left child, so path ends with length 1

The key insight: At each node, we need to track two values:

1. The longest zigzag path if we go left from this node
2. The longest zigzag path if we go right from this node

For node 5:

- If we go left: 5 → 7 → (would need to go right next, but 7 has no right child) = length 1
- If we go right: 5 → 8 → (would need to go left next, but 8 has no left child) = length 1

The maximum zigzag path in the entire tree is 3 (2 → 5 → 7).

## Brute Force Approach

A naive approach would be to try every possible starting node and direction, then simulate the zigzag path until it breaks. For each starting point, we would:

1. Choose a starting node (n possibilities)
2. Choose starting direction (2 possibilities: left or right)
3. Walk down the tree, alternating directions until we can't continue

This would require O(n²) time in the worst case (a skewed tree) because for each of n starting nodes, we might traverse O(n) nodes. The space complexity would be O(h) for the recursion stack, where h is the tree height.

The brute force is inefficient because it recomputes the same subproblems many times. For example, when computing paths starting from a node's left child, we're essentially recomputing information we could have used when computing paths starting from the node itself.

## Optimized Approach

The key insight is that we can use DFS with dynamic programming concepts. At each node, we need to know:

- `left_len`: The length of the longest zigzag path starting from this node going left
- `right_len`: The length of the longest zigzag path starting from this node going right

These values can be computed recursively:

- If we go left from current node, the next step must go right from the left child
- If we go right from current node, the next step must go left from the right child

The recurrence relation:

- `left_len = 1 + (right_len of left child)` if left child exists, otherwise 1
- `right_len = 1 + (left_len of right child)` if right child exists, otherwise 1

We track the maximum value of `left_len` and `right_len` across all nodes as our answer.

This is essentially a post-order traversal where each node returns two values to its parent: how long a zigzag path would be if the parent goes left to this node, and how long if the parent goes right to this node.

## Optimal Solution

Here's the complete solution using DFS with state tracking:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes | Space: O(h) where h is tree height
class Solution:
    def longestZigZag(self, root: Optional[TreeNode]) -> int:
        # We'll use DFS to traverse the tree
        # At each node, we track the longest path starting from that node
        # going left and going right

        self.max_length = 0

        def dfs(node):
            """
            Returns: (left_len, right_len)
            - left_len: longest zigzag path starting from this node going left
            - right_len: longest zigzag path starting from this node going right
            """
            if not node:
                # Base case: null node has no path
                return (0, 0)

            # Recursively get values from children
            left_child = dfs(node.left)
            right_child = dfs(node.right)

            # Calculate values for current node
            # If we go left from current node, next must go right from left child
            # If left child doesn't exist, path length is 1 (just current node)
            current_left = 1 + right_child[1] if node.left else 1

            # If we go right from current node, next must go left from right child
            # If right child doesn't exist, path length is 1 (just current node)
            current_right = 1 + left_child[0] if node.right else 1

            # Update global maximum
            self.max_length = max(self.max_length, current_left, current_right)

            # Return values to parent
            return (current_left, current_right)

        # Start DFS from root
        dfs(root)

        # Subtract 1 because we counted nodes but problem wants edges
        return self.max_length - 1
```

```javascript
// Time: O(n) where n is number of nodes | Space: O(h) where h is tree height
var longestZigZag = function (root) {
  let maxLength = 0;

  // DFS function returns [leftLen, rightLen]
  // leftLen: longest zigzag starting from current node going left
  // rightLen: longest zigzag starting from current node going right
  const dfs = (node) => {
    if (!node) {
      // Base case: null node
      return [0, 0];
    }

    // Get values from children
    const leftChild = dfs(node.left);
    const rightChild = dfs(node.right);

    // Calculate for current node
    // Going left: current node + right path from left child
    const currentLeft = node.left ? 1 + rightChild[1] : 1;

    // Going right: current node + left path from right child
    const currentRight = node.right ? 1 + leftChild[0] : 1;

    // Update global maximum
    maxLength = Math.max(maxLength, currentLeft, currentRight);

    // Return values to parent
    return [currentLeft, currentRight];
  };

  dfs(root);

  // Subtract 1 because we counted nodes but problem wants edges
  return maxLength - 1;
};
```

```java
// Time: O(n) where n is number of nodes | Space: O(h) where h is tree height
class Solution {
    private int maxLength = 0;

    public int longestZigZag(TreeNode root) {
        dfs(root);
        // Subtract 1 because we counted nodes but problem wants edges
        return maxLength - 1;
    }

    // Returns int[2] where [0] = leftLen, [1] = rightLen
    private int[] dfs(TreeNode node) {
        if (node == null) {
            // Base case: null node
            return new int[]{0, 0};
        }

        // Get values from children
        int[] leftChild = dfs(node.left);
        int[] rightChild = dfs(node.right);

        // Calculate for current node
        // leftLen: if we go left from here, next must go right from left child
        int currentLeft = (node.left != null) ? 1 + rightChild[1] : 1;

        // rightLen: if we go right from here, next must go left from right child
        int currentRight = (node.right != null) ? 1 + leftChild[0] : 1;

        // Update global maximum
        maxLength = Math.max(maxLength, Math.max(currentLeft, currentRight));

        // Return values to parent
        return new int[]{currentLeft, currentRight};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the tree. We visit each node exactly once during the DFS traversal.

**Space Complexity:** O(h) where h is the height of the tree. This is the space used by the recursion call stack. In the worst case (skewed tree), h = n, so O(n). In a balanced tree, h = log n, so O(log n).

The space complexity comes from:

1. Recursion stack depth: O(h)
2. No additional data structures are used that scale with n

## Common Mistakes

1. **Forgetting to subtract 1 at the end**: The problem asks for the longest zigzag path measured in edges, but it's natural to count nodes during computation. Remember to subtract 1 from the final result.

2. **Not handling null children correctly**: When a node doesn't have a left or right child, the path from that direction should have length 1 (just the current node), not 0. This is because we're counting the starting node.

3. **Confusing when to add 1**: The recurrence is `current_left = 1 + right_len_of_left_child`, not `1 + left_len_of_left_child`. If you go left from current node, the next step from the left child must go right (alternating direction).

4. **Using BFS instead of DFS**: While BFS could work, DFS is more natural for this problem because we need information from children to compute parent values (post-order traversal).

## When You'll See This Pattern

This problem combines tree traversal with state tracking, which appears in many tree problems:

1. **Binary Tree Maximum Path Sum (LeetCode 124)**: Similar concept of tracking multiple states (max path sum through left, through right, and overall max).

2. **Diameter of Binary Tree (LeetCode 543)**: Also requires tracking the longest path passing through each node, computed from children's information.

3. **House Robber III (LeetCode 337)**: Requires tracking two states at each node (rob this node vs don't rob this node) and combining children's information.

The pattern is: when you need to compute a value at each node that depends on values from children, use DFS with state return values. This is essentially dynamic programming on trees.

## Key Takeaways

1. **Tree DP pattern**: When solving tree problems where each node's answer depends on its children's answers, think about what information the parent needs from its children and return that from DFS.

2. **State tracking**: Some problems require tracking multiple pieces of information at each node. Here we tracked two values (left_len and right_len). Don't try to cram everything into a single return value.

3. **Edge vs node counting**: Always check whether the problem asks for path length in terms of nodes or edges. Many tree path problems measure in edges, so you may need to adjust your counting.

Related problems: [Zigzag Grid Traversal With Skip](/problem/zigzag-grid-traversal-with-skip)
