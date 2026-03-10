---
title: "How to Solve Maximum Difference Between Node and Ancestor — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Difference Between Node and Ancestor. Medium difficulty, 78.1% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2027-08-25"
category: "dsa-patterns"
tags:
  [
    "maximum-difference-between-node-and-ancestor",
    "tree",
    "depth-first-search",
    "binary-tree",
    "medium",
  ]
---

# How to Solve Maximum Difference Between Node and Ancestor

This problem asks us to find the maximum absolute difference between any node and any of its ancestors in a binary tree. The tricky part is that we need to track both the minimum and maximum values along each path from root to leaf, since the maximum difference for any node will be between its value and either the smallest or largest ancestor value encountered so far.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this tree:

```
        8
       / \
      3   10
     / \    \
    1   6    14
       / \   /
      4   7 13
```

We want to find the maximum difference between any node and its ancestor. Let's walk through the tree:

1. **Path 8 → 3 → 1**: Values: [8, 3, 1]
   - At node 1: min=1, max=8, difference = max(7, 2) = 7
2. **Path 8 → 3 → 6 → 4**: Values: [8, 3, 6, 4]
   - At node 4: min=3, max=8, difference = max(5, 4) = 5
3. **Path 8 → 3 → 6 → 7**: Values: [8, 3, 6, 7]
   - At node 7: min=3, max=8, difference = max(5, 4) = 5
4. **Path 8 → 10 → 14 → 13**: Values: [8, 10, 14, 13]
   - At node 13: min=8, max=14, difference = max(6, 5) = 6

The maximum difference we found is 7 (between node 1 with value 1 and ancestor 8 with value 8). But wait — we should also check differences at intermediate nodes:

- At node 3: difference with ancestor 8 = |3-8| = 5
- At node 6: difference with min ancestor 3 = |6-3| = 3, with max ancestor 8 = |6-8| = 2
- At node 10: difference with ancestor 8 = |10-8| = 2
- At node 14: difference with min ancestor 8 = |14-8| = 6, with max ancestor 10 = |14-10| = 4

The true maximum is indeed 7. This shows we need to check every node against the minimum and maximum values along its path from the root.

## Brute Force Approach

A naive approach would be to:

1. For each node, find all its ancestors
2. For each ancestor, calculate the absolute difference
3. Track the maximum difference found

This would require O(n²) time in the worst case (for a skewed tree) because for each of n nodes, we might need to check up to n ancestors. The space complexity would be O(n) for storing ancestor paths.

Here's what the brute force might look like:

```python
def maxAncestorDiff(root):
    def dfs(node, ancestors):
        if not node:
            return 0

        # Calculate max difference with all ancestors
        max_diff = 0
        for ancestor in ancestors:
            max_diff = max(max_diff, abs(node.val - ancestor.val))

        # Add current node to ancestors for children
        ancestors.append(node)

        # Recursively check children
        left_diff = dfs(node.left, ancestors)
        right_diff = dfs(node.right, ancestors)

        # Remove current node from ancestors before returning
        ancestors.pop()

        return max(max_diff, left_diff, right_diff)

    return dfs(root, [])
```

The problem with this approach is efficiency. For each node, we're comparing it with all its ancestors, leading to O(n²) time complexity. We can do better by realizing we don't need to compare with every ancestor individually — we just need to know the minimum and maximum ancestor values.

## Optimized Approach

The key insight is that for any node, the maximum difference with its ancestors will be either:

1. The difference between the node's value and the **minimum** ancestor value, or
2. The difference between the node's value and the **maximum** ancestor value

Therefore, as we traverse the tree from root to leaf, we only need to track:

- The minimum value seen so far on the current path
- The maximum value seen so far on the current path

At each node, we calculate:

- `diff_with_min = abs(node.val - min_so_far)`
- `diff_with_max = abs(node.val - max_so_far)`

We take the maximum of these two differences and update our global maximum.

We then update `min_so_far` and `max_so_far` for the children by taking the minimum/maximum of the current node's value and the current min/max.

This approach reduces the time complexity to O(n) since we visit each node exactly once, and at each node we only do constant-time operations.

## Optimal Solution

Here's the complete solution using DFS with min/max tracking:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes in the tree
# Space: O(h) where h is height of the tree (recursion stack)
class Solution:
    def maxAncestorDiff(self, root: Optional[TreeNode]) -> int:
        # Helper function for DFS traversal
        def dfs(node, current_min, current_max):
            # Base case: if node is None, return 0
            if not node:
                return 0

            # Calculate the maximum difference for current node
            # The max difference will be with either the smallest or largest ancestor
            diff_with_min = abs(node.val - current_min)
            diff_with_max = abs(node.val - current_max)
            current_diff = max(diff_with_min, diff_with_max)

            # Update current_min and current_max for the path
            # We need to pass the updated min/max to children
            new_min = min(current_min, node.val)
            new_max = max(current_max, node.val)

            # Recursively process left and right children
            left_diff = dfs(node.left, new_min, new_max)
            right_diff = dfs(node.right, new_min, new_max)

            # Return the maximum difference found in this subtree
            return max(current_diff, left_diff, right_diff)

        # Start DFS with root's value as both initial min and max
        # This ensures the root node itself won't create a difference
        return dfs(root, root.val, root.val)
```

```javascript
// Time: O(n) where n is number of nodes in the tree
// Space: O(h) where h is height of the tree (recursion stack)
var maxAncestorDiff = function (root) {
  // Helper function for DFS traversal
  const dfs = (node, currentMin, currentMax) => {
    // Base case: if node is null, return 0
    if (!node) return 0;

    // Calculate the maximum difference for current node
    // The max difference will be with either the smallest or largest ancestor
    const diffWithMin = Math.abs(node.val - currentMin);
    const diffWithMax = Math.abs(node.val - currentMax);
    const currentDiff = Math.max(diffWithMin, diffWithMax);

    // Update currentMin and currentMax for the path
    // We need to pass the updated min/max to children
    const newMin = Math.min(currentMin, node.val);
    const newMax = Math.max(currentMax, node.val);

    // Recursively process left and right children
    const leftDiff = dfs(node.left, newMin, newMax);
    const rightDiff = dfs(node.right, newMin, newMax);

    // Return the maximum difference found in this subtree
    return Math.max(currentDiff, leftDiff, rightDiff);
  };

  // Start DFS with root's value as both initial min and max
  // This ensures the root node itself won't create a difference
  return dfs(root, root.val, root.val);
};
```

```java
// Time: O(n) where n is number of nodes in the tree
// Space: O(h) where h is height of the tree (recursion stack)
class Solution {
    public int maxAncestorDiff(TreeNode root) {
        // Start DFS with root's value as both initial min and max
        // This ensures the root node itself won't create a difference
        return dfs(root, root.val, root.val);
    }

    private int dfs(TreeNode node, int currentMin, int currentMax) {
        // Base case: if node is null, return 0
        if (node == null) return 0;

        // Calculate the maximum difference for current node
        // The max difference will be with either the smallest or largest ancestor
        int diffWithMin = Math.abs(node.val - currentMin);
        int diffWithMax = Math.abs(node.val - currentMax);
        int currentDiff = Math.max(diffWithMin, diffWithMax);

        // Update currentMin and currentMax for the path
        // We need to pass the updated min/max to children
        int newMin = Math.min(currentMin, node.val);
        int newMax = Math.max(currentMax, node.val);

        // Recursively process left and right children
        int leftDiff = dfs(node.left, newMin, newMax);
        int rightDiff = dfs(node.right, newMin, newMax);

        // Return the maximum difference found in this subtree
        return Math.max(currentDiff, Math.max(leftDiff, rightDiff));
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once in the tree
- At each node, we perform constant-time operations: calculating differences, updating min/max, and making recursive calls
- Therefore, the time complexity is linear in the number of nodes

**Space Complexity: O(h)**

- The space is determined by the recursion stack depth
- In the worst case (skewed tree), the height h = n, so space is O(n)
- In the best case (balanced tree), the height h = log n, so space is O(log n)
- The space is O(h) where h is the height of the tree

## Common Mistakes

1. **Forgetting that the root has no ancestors**: The root node should not contribute to the maximum difference since it has no ancestors. Our solution handles this by starting with the root's value as both min and max, so the root's difference calculation will be 0.

2. **Not tracking both min and max**: Some candidates try to track only the minimum or only the maximum, but you need both. Consider a path where values are [100, 50, 75]. The maximum difference for node 75 is with ancestor 100 (difference 25), not with the minimum ancestor 50 (difference 25). Actually in this case both give 25, but consider [100, 50, 1] — the max difference for node 1 is with ancestor 100 (99), not 50 (49).

3. **Using global variables incorrectly**: Some implementations use global variables for tracking the maximum difference, which can lead to issues with recursion. It's cleaner to return values from the recursive function as shown in our solution.

4. **Not handling null/empty tree**: While the problem guarantees at least 2 nodes, in real interviews you should still check for edge cases. Our solution handles null nodes in the base case of the DFS function.

## When You'll See This Pattern

This pattern of tracking min/max along a path in a tree appears in several other problems:

1. **Binary Tree Maximum Path Sum (LeetCode 124)**: Similar concept of tracking values along paths, though more complex because paths don't have to go through the root.

2. **Diameter of Binary Tree (LeetCode 543)**: Involves tracking information (heights) through recursive tree traversal.

3. **Longest Univalue Path (LeetCode 687)**: Requires tracking path information while comparing node values.

4. **Minimum Depth of Binary Tree (LeetCode 111)**: Simpler but uses similar DFS traversal with information passing.

The common theme is using DFS to traverse the tree while passing information (min, max, sum, count, etc.) down the recursion and returning aggregated information up.

## Key Takeaways

1. **For ancestor-descendant problems in trees, track path information recursively**: When you need to compare nodes with their ancestors, pass the relevant information (min, max, etc.) down the recursion stack.

2. **You often only need extremes, not all values**: Instead of storing all ancestor values, track just the minimum and maximum. This optimization from O(n) storage per path to O(1) is crucial.

3. **Tree DFS often involves returning values from children**: The pattern of processing a node, recursively processing children, and combining results is fundamental to tree problems.

[Practice this problem on CodeJeet](/problem/maximum-difference-between-node-and-ancestor)
