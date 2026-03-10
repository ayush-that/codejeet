---
title: "How to Solve Minimum Distance Between BST Nodes — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Distance Between BST Nodes. Easy difficulty, 61.1% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Search Tree, Binary Tree."
date: "2027-11-28"
category: "dsa-patterns"
tags:
  [
    "minimum-distance-between-bst-nodes",
    "tree",
    "depth-first-search",
    "breadth-first-search",
    "easy",
  ]
---

# How to Solve Minimum Distance Between BST Nodes

This problem asks us to find the smallest absolute difference between any two distinct node values in a Binary Search Tree. While it's labeled "Easy," it's interesting because it tests your understanding of BST properties and how to leverage them for efficient computation. The tricky part is recognizing that in a BST, the minimum distance will always be between two nodes that are adjacent in the sorted order of values, which we can obtain through an inorder traversal.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this BST:

```
      4
     / \
    2   6
   / \   \
  1   3   7
```

The sorted values of this BST (obtained via inorder traversal) are: `[1, 2, 3, 4, 6, 7]`

Now, to find the minimum difference between any two nodes:

- Difference between 1 and 2: |1-2| = 1
- Difference between 2 and 3: |2-3| = 1
- Difference between 3 and 4: |3-4| = 1
- Difference between 4 and 6: |4-6| = 2
- Difference between 6 and 7: |6-7| = 1

The minimum difference is 1. Notice that we only need to compare consecutive values in the sorted order. This works because if we have three sorted numbers `a < b < c`, the difference between `a` and `c` will always be larger than or equal to the difference between `a` and `b` or `b` and `c`. Therefore, the minimum distance in a BST will always be between two nodes that are adjacent in the inorder traversal.

## Brute Force Approach

A naive approach would be to collect all node values into an array, then compare every pair of values to find the minimum difference:

1. Traverse the tree (any traversal) to collect all values into an array
2. For each value at index `i`, compare it with every value at index `j > i`
3. Track the minimum absolute difference found

This approach has O(n²) time complexity where n is the number of nodes, since we're comparing every pair of values. The space complexity is O(n) for storing all values.

While this would technically work, it's inefficient because it doesn't leverage the BST property. In an interview, you should mention this approach and explain why it's suboptimal before moving to the optimal solution.

## Optimal Solution

The optimal solution uses an inorder traversal to visit nodes in sorted order while tracking the previous node's value. This allows us to compute differences between consecutive nodes in the sorted sequence without storing all values.

Key insights:

1. Inorder traversal of a BST yields values in ascending order
2. The minimum difference must be between two consecutive values in this sorted order
3. We can track the previous value during traversal to compute differences on the fly

<div class="code-group">

```python
# Time: O(n) where n is number of nodes - we visit each node once
# Space: O(h) where h is tree height - recursion stack space
class Solution:
    def minDiffInBST(self, root: Optional[TreeNode]) -> int:
        # Initialize previous value to None (we haven't seen any nodes yet)
        self.prev = None
        # Initialize minimum difference to infinity (any real difference will be smaller)
        self.min_diff = float('inf')

        def inorder(node):
            # Base case: if node is None, return
            if not node:
                return

            # 1. Traverse left subtree first (inorder: left -> root -> right)
            inorder(node.left)

            # 2. Process current node
            if self.prev is not None:
                # Calculate difference between current node and previous node
                # Since we're traversing inorder, prev is always smaller than current
                diff = node.val - self.prev
                # Update minimum difference if we found a smaller one
                self.min_diff = min(self.min_diff, diff)

            # Update previous value to current node's value
            self.prev = node.val

            # 3. Traverse right subtree
            inorder(node.right)

        # Start inorder traversal from root
        inorder(root)

        # Return the minimum difference found
        return self.min_diff
```

```javascript
// Time: O(n) where n is number of nodes - we visit each node once
// Space: O(h) where h is tree height - recursion stack space
var minDiffInBST = function (root) {
  // Initialize previous value to null (we haven't seen any nodes yet)
  let prev = null;
  // Initialize minimum difference to Infinity (any real difference will be smaller)
  let minDiff = Infinity;

  // Helper function for inorder traversal
  function inorder(node) {
    // Base case: if node is null, return
    if (node === null) {
      return;
    }

    // 1. Traverse left subtree first (inorder: left -> root -> right)
    inorder(node.left);

    // 2. Process current node
    if (prev !== null) {
      // Calculate difference between current node and previous node
      // Since we're traversing inorder, prev is always smaller than current
      const diff = node.val - prev;
      // Update minimum difference if we found a smaller one
      minDiff = Math.min(minDiff, diff);
    }

    // Update previous value to current node's value
    prev = node.val;

    // 3. Traverse right subtree
    inorder(node.right);
  }

  // Start inorder traversal from root
  inorder(root);

  // Return the minimum difference found
  return minDiff;
};
```

```java
// Time: O(n) where n is number of nodes - we visit each node once
// Space: O(h) where h is tree height - recursion stack space
class Solution {
    // Use class variables to track previous value and minimum difference
    private Integer prev = null;
    private int minDiff = Integer.MAX_VALUE;

    public int minDiffInBST(TreeNode root) {
        // Start inorder traversal from root
        inorder(root);

        // Return the minimum difference found
        return minDiff;
    }

    private void inorder(TreeNode node) {
        // Base case: if node is null, return
        if (node == null) {
            return;
        }

        // 1. Traverse left subtree first (inorder: left -> root -> right)
        inorder(node.left);

        // 2. Process current node
        if (prev != null) {
            // Calculate difference between current node and previous node
            // Since we're traversing inorder, prev is always smaller than current
            int diff = node.val - prev;
            // Update minimum difference if we found a smaller one
            minDiff = Math.min(minDiff, diff);
        }

        // Update previous value to current node's value
        prev = node.val;

        // 3. Traverse right subtree
        inorder(node.right);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**  
We perform a single inorder traversal of the tree, visiting each node exactly once. Each node visit involves constant-time operations: comparing with previous value, updating minimum difference, and updating the previous value.

**Space Complexity: O(h)** where h is the height of the tree  
This is the space used by the recursion stack. In the worst case (a skewed tree), h = n, giving us O(n) space. In the best case (a balanced tree), h = log n, giving us O(log n) space. Note that we don't store all node values in an array, which would be O(n) additional space.

## Common Mistakes

1. **Not using inorder traversal**: Some candidates try to compute differences between parent and child nodes directly. This doesn't work because the minimum difference might be between nodes that aren't directly related in the tree structure (like 3 and 4 in our example).

2. **Forgetting to handle the first node**: When processing the first node in the inorder traversal, there's no previous node to compare with. That's why we need to check if `prev` is `None`/`null` before computing the difference.

3. **Using absolute value incorrectly**: Since inorder traversal gives us values in ascending order, `current.val - prev` will always be positive. Some candidates unnecessarily use `abs(current.val - prev)`, which works but shows they might not fully understand why inorder traversal solves the problem.

4. **Initializing min_diff incorrectly**: Initializing `min_diff` to 0 would give the wrong answer. We need to initialize it to a very large value (like infinity or `Integer.MAX_VALUE`) so that the first real difference we compute becomes the new minimum.

## When You'll See This Pattern

This pattern of using inorder traversal to process BST nodes in sorted order appears in several problems:

1. **Kth Smallest Element in a BST (LeetCode 230)**: Find the kth smallest element in a BST. The inorder traversal gives elements in ascending order, so the kth element visited is the answer.

2. **Validate Binary Search Tree (LeetCode 98)**: Check if a binary tree is a valid BST. During inorder traversal, each value should be greater than the previous one.

3. **Minimum Absolute Difference in BST (LeetCode 530)**: This is essentially the same problem! The only difference is that problem specifies all nodes have non-negative values.

The core technique is recognizing that inorder traversal of a BST yields sorted values, which allows us to solve problems involving order, ranking, or differences between values efficiently.

## Key Takeaways

1. **BST inorder traversal yields sorted values**: This is the fundamental property that makes the optimal solution work. Whenever you need to process BST values in order or find relationships between values, consider an inorder traversal.

2. **Track previous value during traversal**: For problems involving consecutive values in sorted order, you can track the previous value during traversal instead of storing all values in an array. This saves space and makes the code cleaner.

3. **The minimum difference is between adjacent sorted values**: In any sorted sequence, the minimum difference between any two elements will always be between two consecutive elements. This mathematical insight simplifies the problem from checking all pairs to just checking consecutive pairs.

Related problems: [Binary Tree Inorder Traversal](/problem/binary-tree-inorder-traversal)
