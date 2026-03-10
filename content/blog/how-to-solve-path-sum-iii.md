---
title: "How to Solve Path Sum III — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Path Sum III. Medium difficulty, 46.3% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2026-12-26"
category: "dsa-patterns"
tags: ["path-sum-iii", "tree", "depth-first-search", "binary-tree", "medium"]
---

# How to Solve Path Sum III

This problem asks us to count all downward paths in a binary tree where the sum of node values equals a given target. The tricky part is that paths don't need to start at the root or end at a leaf—they can begin and end anywhere as long as they go from parent to child. This means we need to consider all possible subpaths within the tree, making brute force approaches inefficient for large trees.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
Tree: [10, 5, -3, 3, 2, null, 11, 3, -2, null, 1]
Target: 8

Visual representation:
        10
       /  \
      5   -3
     / \    \
    3   2   11
   / \   \
  3  -2   1
```

We need to find all downward paths summing to 8. Let's examine a few:

1. **Path starting at node 5**: 5 → 3 (sum = 8) ✓
2. **Path starting at node 5**: 5 → 2 → 1 (sum = 8) ✓
3. **Path starting at node 3**: 3 → 3 → -2 (sum = 4, not 8)
4. **Path starting at node -3**: -3 → 11 (sum = 8) ✓
5. **Path starting at node 10**: 10 → 5 → 3 (sum = 18, too large)

Notice that we need to check paths starting from EVERY node, not just the root. For each starting node, we need to explore all possible ending nodes in its subtree. This leads to the brute force approach.

## Brute Force Approach

The most straightforward solution is to perform a DFS from every node, checking all possible paths starting from that node:

1. For each node in the tree, perform DFS to find all paths starting from that node that sum to target
2. Count all such paths
3. Repeat for every node

This approach has O(n²) time complexity in the worst case (when the tree is a linked list), as we're doing O(n) work for each of n nodes. For a balanced tree, it's O(n log n) since each node's subtree has logarithmic depth.

The problem with this approach is efficiency. With n up to 1000 in typical interview constraints, O(n²) could be 1,000,000 operations—too slow for many test cases.

## Optimized Approach

The key insight is to use the **prefix sum** technique, similar to finding subarrays with a target sum in an array. Here's the reasoning:

1. As we traverse from root to leaf, we maintain a running sum of node values
2. At any node, if `current_sum - target` exists in our prefix sums, it means there's a path ending at this node with sum = target
3. The number of such `current_sum - target` values tells us how many valid paths end at this node

Why does this work? Let's say we have:

- Path: A → B → C → D
- Running sums: sum_A, sum_AB, sum_ABC, sum_ABCD

If `sum_ABCD - target = sum_AB`, then `sum_CD = target` (because sum_ABCD - sum_AB = sum_CD). This means the path from C to D has sum = target!

We use a hash map to store how many times each prefix sum has occurred on the current path from root. This allows O(1) lookups to find how many valid subpaths end at the current node.

## Optimal Solution

The optimal solution uses DFS with backtracking and a prefix sum hash map:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for recursion stack and prefix sum map
class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> int:
        # Dictionary to store prefix sums and their frequencies
        # Key: prefix sum, Value: count of how many times it occurred
        prefix_sums = {0: 1}  # Initialize with 0 sum occurring once (empty path)

        def dfs(node, current_sum):
            if not node:
                return 0

            # Update current sum with current node's value
            current_sum += node.val

            # Count how many paths ending at current node sum to target
            # If current_sum - target exists in prefix_sums, it means there's a
            # subpath (from some ancestor to current node) that sums to target
            path_count = prefix_sums.get(current_sum - targetSum, 0)

            # Add current sum to prefix sums (for child nodes to use)
            prefix_sums[current_sum] = prefix_sums.get(current_sum, 0) + 1

            # Recursively count paths in left and right subtrees
            left_count = dfs(node.left, current_sum)
            right_count = dfs(node.right, current_sum)

            # Backtrack: remove current sum from prefix sums before returning to parent
            # This ensures prefix sums only contain sums from the current path
            prefix_sums[current_sum] -= 1
            if prefix_sums[current_sum] == 0:
                del prefix_sums[current_sum]

            # Total paths = paths ending at current node + paths in left + paths in right
            return path_count + left_count + right_count

        return dfs(root, 0)
```

```javascript
// Time: O(n) | Space: O(n) for recursion stack and prefix sum map
var pathSum = function (root, targetSum) {
  // Map to store prefix sums and their frequencies
  // Key: prefix sum, Value: count of how many times it occurred
  const prefixSums = new Map();
  prefixSums.set(0, 1); // Initialize with 0 sum occurring once (empty path)

  const dfs = (node, currentSum) => {
    if (!node) return 0;

    // Update current sum with current node's value
    currentSum += node.val;

    // Count how many paths ending at current node sum to target
    // If currentSum - target exists in prefixSums, it means there's a
    // subpath (from some ancestor to current node) that sums to target
    const pathCount = prefixSums.get(currentSum - targetSum) || 0;

    // Add current sum to prefix sums (for child nodes to use)
    prefixSums.set(currentSum, (prefixSums.get(currentSum) || 0) + 1);

    // Recursively count paths in left and right subtrees
    const leftCount = dfs(node.left, currentSum);
    const rightCount = dfs(node.right, currentSum);

    // Backtrack: remove current sum from prefix sums before returning to parent
    // This ensures prefix sums only contain sums from the current path
    prefixSums.set(currentSum, prefixSums.get(currentSum) - 1);
    if (prefixSums.get(currentSum) === 0) {
      prefixSums.delete(currentSum);
    }

    // Total paths = paths ending at current node + paths in left + paths in right
    return pathCount + leftCount + rightCount;
  };

  return dfs(root, 0);
};
```

```java
// Time: O(n) | Space: O(n) for recursion stack and prefix sum map
class Solution {
    public int pathSum(TreeNode root, int targetSum) {
        // Map to store prefix sums and their frequencies
        // Key: prefix sum, Value: count of how many times it occurred
        Map<Long, Integer> prefixSums = new HashMap<>();
        prefixSums.put(0L, 1);  // Initialize with 0 sum occurring once (empty path)

        return dfs(root, 0L, targetSum, prefixSums);
    }

    private int dfs(TreeNode node, long currentSum, int targetSum, Map<Long, Integer> prefixSums) {
        if (node == null) return 0;

        // Update current sum with current node's value
        currentSum += node.val;

        // Count how many paths ending at current node sum to target
        // If currentSum - target exists in prefixSums, it means there's a
        // subpath (from some ancestor to current node) that sums to target
        int pathCount = prefixSums.getOrDefault(currentSum - targetSum, 0);

        // Add current sum to prefix sums (for child nodes to use)
        prefixSums.put(currentSum, prefixSums.getOrDefault(currentSum, 0) + 1);

        // Recursively count paths in left and right subtrees
        int leftCount = dfs(node.left, currentSum, targetSum, prefixSums);
        int rightCount = dfs(node.right, currentSum, targetSum, prefixSums);

        // Backtrack: remove current sum from prefix sums before returning to parent
        // This ensures prefix sums only contain sums from the current path
        prefixSums.put(currentSum, prefixSums.get(currentSum) - 1);
        if (prefixSums.get(currentSum) == 0) {
            prefixSums.remove(currentSum);
        }

        // Total paths = paths ending at current node + paths in left + paths in right
        return pathCount + leftCount + rightCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once during the DFS traversal
- For each node, we perform O(1) operations (hash map lookups, updates)
- Total operations scale linearly with number of nodes

**Space Complexity: O(n)**

- Recursion stack: O(h) where h is tree height (O(n) worst case for skewed tree, O(log n) for balanced)
- Hash map: O(n) in worst case when all prefix sums are unique (e.g., all positive values)
- Total: O(n) worst case

## Common Mistakes

1. **Forgetting to initialize prefix sum map with {0: 1}**: This represents the empty path before the root. Without it, you'll miss paths that start at the root and sum to target.

2. **Not backtracking properly**: If you don't remove the current prefix sum after processing a node's children, sibling nodes will see prefix sums from different branches, leading to incorrect counts.

3. **Using integer overflow in Java**: When node values can be large, sums might exceed 32-bit integer range. Always use `long` for prefix sums in Java to avoid overflow.

4. **Counting paths multiple times**: In the brute force approach, it's easy to double-count paths or miss the backtracking logic needed to explore all starting points correctly.

## When You'll See This Pattern

The prefix sum technique with hash maps appears in several problems:

1. **Subarray Sum Equals K (LeetCode 560)**: Find number of subarrays with sum = k in an array. This is the 1D version of our tree problem.

2. **Continuous Subarray Sum (LeetCode 523)**: Check if array has continuous subarray of size ≥ 2 with sum multiple of k. Uses similar prefix sum modulo technique.

3. **Binary Subarrays With Sum (LeetCode 930)**: Count binary subarrays with given sum. Same pattern with 0/1 values.

The pattern is: when you need to find subarrays/subpaths with a specific sum property, consider using prefix sums with a hash map for O(n) solutions.

## Key Takeaways

1. **Prefix sums transform path problems into lookup problems**: Instead of checking all possible paths (O(n²)), we can use the relationship `sum(i,j) = prefix[j] - prefix[i-1]` to find valid paths in O(1) time.

2. **Backtracking is crucial for tree problems**: When using global data structures in DFS, always clean up (backtrack) after processing a node's subtree to avoid polluting state for other branches.

3. **Initialize with empty path case**: The {0: 1} initialization handles paths starting at the root. This is a common pattern in prefix sum problems.

Related problems: [Path Sum](/problem/path-sum), [Path Sum II](/problem/path-sum-ii), [Path Sum IV](/problem/path-sum-iv)
