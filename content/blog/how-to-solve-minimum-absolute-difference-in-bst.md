---
title: "How to Solve Minimum Absolute Difference in BST — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Absolute Difference in BST. Easy difficulty, 59.2% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Search Tree, Binary Tree."
date: "2027-03-08"
category: "dsa-patterns"
tags:
  [
    "minimum-absolute-difference-in-bst",
    "tree",
    "depth-first-search",
    "breadth-first-search",
    "easy",
  ]
---

# How to Solve Minimum Absolute Difference in BST

Given a binary search tree, we need to find the minimum absolute difference between the values of any two different nodes. While this sounds straightforward, the challenge lies in efficiently comparing node values without checking every possible pair. The key insight is that in a BST, an in-order traversal visits nodes in sorted order, allowing us to find adjacent values efficiently.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this BST:

```
      4
     / \
    2   6
   / \   \
  1   3   7
```

The sorted values from this tree are: [1, 2, 3, 4, 6, 7]

To find the minimum absolute difference, we need to check adjacent values in this sorted list:

- |1-2| = 1
- |2-3| = 1
- |3-4| = 1
- |4-6| = 2
- |6-7| = 1

The minimum is 1. Notice that in a sorted list, the minimum difference must occur between adjacent elements. Checking non-adjacent elements (like 1 and 4) would give us 3, which is larger than any adjacent difference.

This reveals our strategy: perform an in-order traversal to get nodes in sorted order, then track the minimum difference between consecutive values.

## Brute Force Approach

A naive approach would be to collect all node values into an array, then compare every possible pair:

1. Traverse the tree (any traversal works) and collect all values into a list
2. For each pair (i, j) where i < j, compute the absolute difference
3. Track the minimum difference found

This approach has O(n²) time complexity for the pair comparisons, which is inefficient for large trees. Even if we sort the array first (which would be O(n log n)), we'd still need O(n) space to store all values.

The brute force misses the key property of BSTs: an in-order traversal gives us sorted values without needing to store them all or sort them separately. We can compute differences on the fly as we traverse.

## Optimal Solution

The optimal solution uses in-order traversal to visit nodes in sorted order. As we traverse, we keep track of the previously visited node's value and compute the difference with the current node. We update our minimum difference whenever we find a smaller one.

Here's why this works:

1. In a BST, in-order traversal yields values in ascending order
2. The minimum difference must occur between consecutive values in this sorted sequence
3. By tracking the previous value during traversal, we can compute differences without storing all values

<div class="code-group">

```python
# Time: O(n) - We visit each node exactly once
# Space: O(h) - Where h is the height of the tree (recursion stack)
class Solution:
    def getMinimumDifference(self, root: Optional[TreeNode]) -> int:
        # Initialize variables
        self.min_diff = float('inf')  # Track minimum difference found
        self.prev_val = None          # Track previous node's value

        def inorder_traversal(node):
            if not node:
                return

            # Traverse left subtree first (in-order: left -> root -> right)
            inorder_traversal(node.left)

            # Process current node
            if self.prev_val is not None:
                # Calculate difference with previous node
                current_diff = abs(node.val - self.prev_val)
                # Update minimum if we found a smaller difference
                self.min_diff = min(self.min_diff, current_diff)

            # Update previous value for next iteration
            self.prev_val = node.val

            # Traverse right subtree
            inorder_traversal(node.right)

        # Start traversal from root
        inorder_traversal(root)

        return self.min_diff
```

```javascript
// Time: O(n) - We visit each node exactly once
// Space: O(h) - Where h is the height of the tree (recursion stack)
function getMinimumDifference(root) {
  let minDiff = Infinity; // Track minimum difference found
  let prevVal = null; // Track previous node's value

  function inorderTraversal(node) {
    if (!node) return;

    // Traverse left subtree first (in-order: left -> root -> right)
    inorderTraversal(node.left);

    // Process current node
    if (prevVal !== null) {
      // Calculate difference with previous node
      const currentDiff = Math.abs(node.val - prevVal);
      // Update minimum if we found a smaller difference
      minDiff = Math.min(minDiff, currentDiff);
    }

    // Update previous value for next iteration
    prevVal = node.val;

    // Traverse right subtree
    inorderTraversal(node.right);
  }

  // Start traversal from root
  inorderTraversal(root);

  return minDiff;
}
```

```java
// Time: O(n) - We visit each node exactly once
// Space: O(h) - Where h is the height of the tree (recursion stack)
class Solution {
    private int minDiff = Integer.MAX_VALUE;  // Track minimum difference found
    private Integer prevVal = null;           // Track previous node's value

    public int getMinimumDifference(TreeNode root) {
        inorderTraversal(root);
        return minDiff;
    }

    private void inorderTraversal(TreeNode node) {
        if (node == null) return;

        // Traverse left subtree first (in-order: left -> root -> right)
        inorderTraversal(node.left);

        // Process current node
        if (prevVal != null) {
            // Calculate difference with previous node
            int currentDiff = Math.abs(node.val - prevVal);
            // Update minimum if we found a smaller difference
            minDiff = Math.min(minDiff, currentDiff);
        }

        // Update previous value for next iteration
        prevVal = node.val;

        // Traverse right subtree
        inorderTraversal(node.right);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once during the in-order traversal
- At each node, we perform O(1) operations (comparison and update)
- Total operations scale linearly with the number of nodes

**Space Complexity: O(h)**

- Where h is the height of the tree
- This is the maximum depth of the recursion stack
- For a balanced BST: O(log n)
- For a skewed tree (worst case): O(n)
- Note: We use only O(1) additional space for variables (min_diff and prev_val)

## Common Mistakes

1. **Not handling the first node properly**: Forgetting that we can't compute a difference for the first node visited (since there's no previous node). Always check if `prev_val` is not None/null before computing differences.

2. **Using pre-order or post-order traversal**: These traversals don't visit nodes in sorted order in a BST. Only in-order traversal guarantees sorted order, which is crucial for finding adjacent values efficiently.

3. **Storing all values in an array first**: While this works, it uses O(n) extra space unnecessarily. The optimal solution computes differences on the fly during traversal.

4. **Forgetting absolute value**: The problem asks for absolute difference, so always use `abs()` or `Math.abs()` when computing differences. Regular subtraction could give negative values.

5. **Incorrect initialization of min_diff**: Initialize to a very large value (like infinity or Integer.MAX_VALUE) so the first valid difference will replace it. Initializing to 0 would give incorrect results.

## When You'll See This Pattern

This pattern of using in-order traversal to process BST nodes in sorted order appears in several problems:

1. **Validate Binary Search Tree (LeetCode 98)**: Use in-order traversal to check if each node's value is greater than the previous one.

2. **Kth Smallest Element in a BST (LeetCode 230)**: Use in-order traversal while counting nodes to find the kth smallest element.

3. **Convert BST to Greater Tree (LeetCode 538)**: Use reverse in-order traversal (right -> root -> left) to accumulate sums.

4. **Minimum Distance Between BST Nodes (LeetCode 783)**: This is essentially the same problem with a different name.

The core insight is that in-order traversal of a BST yields sorted values, allowing O(n) solutions to problems that would otherwise require sorting or more complex approaches.

## Key Takeaways

1. **In-order traversal is your best friend for BST problems**: It visits nodes in sorted order, enabling efficient solutions for problems involving order, differences, or rankings.

2. **Process nodes during traversal when possible**: Instead of collecting all values and processing them later, compute results on the fly to save space. This is a common optimization pattern.

3. **Track previous state during traversal**: Many BST problems require comparing consecutive nodes. Keeping track of the previous node's value during traversal is a powerful technique.

4. **The minimum difference in sorted data always occurs between adjacent elements**: This mathematical insight simplifies the problem from checking all pairs to checking only consecutive pairs.

Related problems: [K-diff Pairs in an Array](/problem/k-diff-pairs-in-an-array)
