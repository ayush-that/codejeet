---
title: "How to Solve Closest Nodes Queries in a Binary Search Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Closest Nodes Queries in a Binary Search Tree. Medium difficulty, 44.1% acceptance rate. Topics: Array, Binary Search, Tree, Depth-First Search, Binary Search Tree."
date: "2028-12-18"
category: "dsa-patterns"
tags: ["closest-nodes-queries-in-a-binary-search-tree", "array", "binary-search", "tree", "medium"]
---

# How to Solve Closest Nodes Queries in a Binary Search Tree

You're given a binary search tree (BST) and a list of queries. For each query, you need to find two values: the largest value in the BST ≤ the query, and the smallest value in the BST ≥ the query. What makes this problem interesting is that you need to answer multiple queries efficiently, and the BST structure gives you a natural ordering that you can exploit.

## Visual Walkthrough

Let's walk through a concrete example to build intuition. Consider this BST:

```
        8
       / \
      3   10
     / \    \
    1   6    14
       / \   /
      4   7 13
```

And queries: `[2, 5, 16]`

For query `2`:

- We need the largest value ≤ 2. Looking at the tree: 1 ≤ 2, 3 > 2, so the answer is 1.
- We need the smallest value ≥ 2. Looking at the tree: 3 ≥ 2, so the answer is 3.
- Result: `[1, 3]`

For query `5`:

- Largest value ≤ 5: 4 ≤ 5, 6 > 5, so answer is 4.
- Smallest value ≥ 5: 6 ≥ 5, so answer is 6.
- Result: `[4, 6]`

For query `16`:

- Largest value ≤ 16: 14 ≤ 16, and there's nothing larger ≤ 16, so answer is 14.
- Smallest value ≥ 16: Nothing in the tree is ≥ 16, so we return -1.
- Result: `[14, -1]`

The challenge is doing this efficiently for many queries. Checking the entire tree for each query would be too slow.

## Brute Force Approach

A naive approach would be to traverse the entire tree for each query to find the closest values:

1. For each query, traverse the entire BST
2. Keep track of the largest value seen that's ≤ the query
3. Keep track of the smallest value seen that's ≥ the query
4. Return these two values for each query

This approach has O(n × m) time complexity where n is the number of nodes and m is the number of queries. For a balanced BST with 10,000 nodes and 10,000 queries, that's 100 million operations - far too slow.

The key insight we're missing is that we can preprocess the BST into a sorted array, then use binary search for each query.

## Optimized Approach

The optimal solution has three clear steps:

1. **Inorder Traversal**: Perform an inorder traversal of the BST to extract all values into a sorted array. This works because inorder traversal of a BST yields values in ascending order.

2. **Binary Search**: For each query, use binary search on the sorted array to find:
   - The rightmost position where we could insert the query while maintaining sorted order (this gives us the largest value ≤ query)
   - The leftmost position where we could insert the query (this gives us the smallest value ≥ query)

3. **Handle Edge Cases**: What if the query is smaller than all values? Larger than all values? Exactly equal to a value? We need to handle these cases properly.

The beauty of this approach is that we only traverse the tree once (O(n)), then answer each query with binary search (O(log n) per query). Total time is O(n + m log n), which is much better than O(n × m).

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n + m log n) where n = number of nodes, m = number of queries
# Space: O(n) for storing the inorder traversal
class Solution:
    def closestNodes(self, root, queries):
        # Step 1: Perform inorder traversal to get sorted values
        def inorder(node):
            if not node:
                return []
            return inorder(node.left) + [node.val] + inorder(node.right)

        # Get the sorted array from BST
        sorted_vals = inorder(root)
        n = len(sorted_vals)
        result = []

        # Step 2: Process each query using binary search
        for query in queries:
            # Initialize answer for this query
            min_val, max_val = -1, -1

            # Binary search to find the largest value <= query
            left, right = 0, n - 1
            while left <= right:
                mid = (left + right) // 2
                if sorted_vals[mid] <= query:
                    # This value could be our answer, but check if there's a larger one
                    min_val = sorted_vals[mid]
                    left = mid + 1  # Look for potentially larger values
                else:
                    right = mid - 1  # Value too large, go left

            # Binary search to find the smallest value >= query
            left, right = 0, n - 1
            while left <= right:
                mid = (left + right) // 2
                if sorted_vals[mid] >= query:
                    # This value could be our answer, but check if there's a smaller one
                    max_val = sorted_vals[mid]
                    right = mid - 1  # Look for potentially smaller values
                else:
                    left = mid + 1  # Value too small, go right

            result.append([min_val, max_val])

        return result
```

```javascript
// Time: O(n + m log n) where n = number of nodes, m = number of queries
// Space: O(n) for storing the inorder traversal
var closestNodes = function (root, queries) {
  // Step 1: Perform inorder traversal to get sorted values
  const inorder = (node) => {
    if (!node) return [];
    return [...inorder(node.left), node.val, ...inorder(node.right)];
  };

  // Get the sorted array from BST
  const sortedVals = inorder(root);
  const n = sortedVals.length;
  const result = [];

  // Step 2: Process each query using binary search
  for (const query of queries) {
    // Initialize answer for this query
    let minVal = -1,
      maxVal = -1;

    // Binary search to find the largest value <= query
    let left = 0,
      right = n - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (sortedVals[mid] <= query) {
        // This value could be our answer, but check if there's a larger one
        minVal = sortedVals[mid];
        left = mid + 1; // Look for potentially larger values
      } else {
        right = mid - 1; // Value too large, go left
      }
    }

    // Binary search to find the smallest value >= query
    left = 0;
    right = n - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (sortedVals[mid] >= query) {
        // This value could be our answer, but check if there's a smaller one
        maxVal = sortedVals[mid];
        right = mid - 1; // Look for potentially smaller values
      } else {
        left = mid + 1; // Value too small, go right
      }
    }

    result.push([minVal, maxVal]);
  }

  return result;
};
```

```java
// Time: O(n + m log n) where n = number of nodes, m = number of queries
// Space: O(n) for storing the inorder traversal
class Solution {
    public List<List<Integer>> closestNodes(TreeNode root, List<Integer> queries) {
        // Step 1: Perform inorder traversal to get sorted values
        List<Integer> sortedVals = new ArrayList<>();
        inorder(root, sortedVals);

        int n = sortedVals.size();
        List<List<Integer>> result = new ArrayList<>();

        // Step 2: Process each query using binary search
        for (int query : queries) {
            // Initialize answer for this query
            int minVal = -1, maxVal = -1;

            // Binary search to find the largest value <= query
            int left = 0, right = n - 1;
            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (sortedVals.get(mid) <= query) {
                    // This value could be our answer, but check if there's a larger one
                    minVal = sortedVals.get(mid);
                    left = mid + 1;  // Look for potentially larger values
                } else {
                    right = mid - 1;  // Value too large, go left
                }
            }

            // Binary search to find the smallest value >= query
            left = 0;
            right = n - 1;
            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (sortedVals.get(mid) >= query) {
                    // This value could be our answer, but check if there's a smaller one
                    maxVal = sortedVals.get(mid);
                    right = mid - 1;  // Look for potentially smaller values
                } else {
                    left = mid + 1;  // Value too small, go right
                }
            }

            result.add(Arrays.asList(minVal, maxVal));
        }

        return result;
    }

    // Helper method for inorder traversal
    private void inorder(TreeNode node, List<Integer> result) {
        if (node == null) return;
        inorder(node.left, result);
        result.add(node.val);
        inorder(node.right, result);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m log n)**

- `O(n)` for the inorder traversal to collect all node values
- `O(m log n)` for processing m queries with binary search (each binary search is O(log n))
- Total: O(n + m log n)

**Space Complexity: O(n)**

- `O(n)` to store the sorted values from the inorder traversal
- `O(h)` for the recursion stack during inorder traversal, where h is the height of the tree
- In the worst case (skewed tree), h = n, but in a balanced BST, h = log n

## Common Mistakes

1. **Forgetting to handle empty tree**: If the root is null, we should return a list of `[-1, -1]` for each query. Our solution handles this because `inorder(null)` returns an empty array, and the binary search loops won't execute.

2. **Incorrect binary search logic**: The most common error is using the wrong comparison operators or not updating bounds correctly. Remember:
   - For "largest value ≤ query": when `arr[mid] ≤ query`, we record it as candidate and search right for potentially larger values
   - For "smallest value ≥ query": when `arr[mid] ≥ query`, we record it as candidate and search left for potentially smaller values

3. **Not using two separate binary searches**: Some candidates try to find both values in one binary search, which gets messy. It's cleaner and less error-prone to use two separate binary searches.

4. **Assuming values are unique**: The problem doesn't guarantee unique values, but BSTs typically have unique values. Our solution works regardless since we're looking for values that satisfy inequalities.

## When You'll See This Pattern

This "BST to sorted array + binary search" pattern appears in several problems:

1. **Closest Binary Search Tree Value (Easy)**: Find the value in a BST that's closest to a target. You could use the same approach: convert to sorted array, then binary search.

2. **Two Sum IV - Input is a BST (Easy)**: Find if there exist two elements in a BST that sum to a target. Convert to sorted array, then use two pointers.

3. **Range Sum of BST (Easy)**: Sum all values in a BST within a range. While you can solve it with DFS, converting to sorted array then using binary search to find bounds is another approach.

The pattern is: when you need to answer multiple range queries or nearest-value queries on a BST, converting to a sorted array often simplifies the problem.

## Key Takeaways

1. **BST inorder traversal gives sorted order**: This is a fundamental property of BSTs. Whenever you need sorted data from a BST, think inorder traversal.

2. **Preprocessing can optimize multiple queries**: When you have many queries, it's often worth preprocessing the data once (O(n)) to answer each query quickly (O(log n)) rather than processing each query from scratch.

3. **Separate concerns**: Break the problem into clear steps: (1) extract data, (2) process queries. This makes the code cleaner and easier to debug.

Related problems: [Closest Binary Search Tree Value](/problem/closest-binary-search-tree-value), [Closest Binary Search Tree Value II](/problem/closest-binary-search-tree-value-ii), [Search in a Binary Search Tree](/problem/search-in-a-binary-search-tree)
