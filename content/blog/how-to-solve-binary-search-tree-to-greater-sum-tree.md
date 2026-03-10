---
title: "How to Solve Binary Search Tree to Greater Sum Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Binary Search Tree to Greater Sum Tree. Medium difficulty, 88.4% acceptance rate. Topics: Tree, Depth-First Search, Binary Search Tree, Binary Tree."
date: "2027-10-25"
category: "dsa-patterns"
tags:
  [
    "binary-search-tree-to-greater-sum-tree",
    "tree",
    "depth-first-search",
    "binary-search-tree",
    "medium",
  ]
---

# How to Solve Binary Search Tree to Greater Sum Tree

This problem asks us to transform a Binary Search Tree (BST) so that each node's value becomes the sum of its original value plus all values greater than it in the tree. What makes this problem interesting is that we need to process nodes in descending order (largest to smallest) while maintaining the BST structure. The key insight is that a reverse in-order traversal gives us exactly the order we need.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this BST:

```
     4
   /   \
  1     6
 / \   / \
0   2 5   7
     \     \
      3     8
```

We need to transform each node to: original value + sum of all greater values.

**Step-by-step reasoning:**

1. Start from the largest value (8). There are no values greater than 8, so 8 becomes 8.
2. Next is 7. Greater values seen so far: 8. So 7 becomes 7 + 8 = 15.
3. Next is 6. Greater values seen: 8 + 7 = 15. So 6 becomes 6 + 15 = 21.
4. Next is 5. Greater values: 8 + 7 + 6 = 21. So 5 becomes 5 + 21 = 26.
5. Next is 4. Greater values: 8 + 7 + 6 + 5 = 26. So 4 becomes 4 + 26 = 30.
6. Next is 3. Greater values: 8 + 7 + 6 + 5 + 4 = 30. So 3 becomes 3 + 30 = 33.
7. Next is 2. Greater values: 8 + 7 + 6 + 5 + 4 + 3 = 33. So 2 becomes 2 + 33 = 35.
8. Next is 1. Greater values: 8 + 7 + 6 + 5 + 4 + 3 + 2 = 35. So 1 becomes 1 + 35 = 36.
9. Finally 0. Greater values: 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1 = 36. So 0 becomes 0 + 36 = 36.

Final transformed tree:

```
     30
   /    \
  36     21
 / \    /  \
36  35 26   15
      \      \
      33      8
```

Notice the pattern: we're visiting nodes in descending order (right → root → left) and accumulating a running sum.

## Brute Force Approach

A naive approach might be:

1. Traverse the tree to collect all values into an array
2. Sort the array in descending order
3. For each node, find its value in the sorted array, sum all values before it, and update the node

**Why this fails:**

- Time complexity: O(n²) if we recalculate sums for each node, or O(n log n) with preprocessing but still requires extra O(n) space
- We're not leveraging the BST property that allows us to process nodes in order without sorting
- The problem expects an in-place transformation with O(n) time and O(h) space (where h is tree height)

## Optimized Approach

The key insight is that a **reverse in-order traversal** (right subtree → root → left subtree) visits nodes in descending order. If we maintain a running sum of all values we've seen so far (which are all greater than the current node in a reverse traversal), we can update each node in a single pass.

**Step-by-step reasoning:**

1. Initialize a `running_sum` variable to 0
2. Perform reverse in-order traversal:
   - First traverse the right subtree (larger values)
   - Update the current node: `node.val += running_sum`
   - Update `running_sum = node.val` (now contains sum of original node value + all greater values)
   - Traverse the left subtree (smaller values)
3. This works because when we visit a node, we've already processed all values greater than it

This approach uses the BST property optimally and processes each node exactly once.

## Optimal Solution

Here's the complete solution using reverse in-order traversal with recursion:

<div class="code-group">

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

# Time: O(n) - We visit each node exactly once
# Space: O(h) - Recursion stack depth equals tree height (worst case O(n) for skewed tree)
class Solution:
    def bstToGst(self, root: TreeNode) -> TreeNode:
        # Initialize running sum to 0
        self.running_sum = 0

        def reverse_inorder(node):
            # Base case: if node is None, return
            if not node:
                return

            # 1. Traverse right subtree first (larger values)
            reverse_inorder(node.right)

            # 2. Update current node value with running sum
            # The running_sum contains sum of all values greater than current node
            self.running_sum += node.val
            node.val = self.running_sum

            # 3. Traverse left subtree (smaller values)
            reverse_inorder(node.left)

        # Start the reverse in-order traversal from root
        reverse_inorder(root)
        return root
```

```javascript
// Definition for a binary tree node.
// function TreeNode(val, left, right) {
//     this.val = (val===undefined ? 0 : val)
//     this.left = (left===undefined ? null : left)
//     this.right = (right===undefined ? null : right)
// }

// Time: O(n) - We visit each node exactly once
// Space: O(h) - Recursion stack depth equals tree height (worst case O(n) for skewed tree)
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var bstToGst = function (root) {
  let runningSum = 0;

  // Helper function for reverse in-order traversal
  function reverseInorder(node) {
    // Base case: if node is null, return
    if (!node) return;

    // 1. Traverse right subtree first (larger values)
    reverseInorder(node.right);

    // 2. Update current node value with running sum
    // The runningSum contains sum of all values greater than current node
    runningSum += node.val;
    node.val = runningSum;

    // 3. Traverse left subtree (smaller values)
    reverseInorder(node.left);
  }

  // Start the reverse in-order traversal from root
  reverseInorder(root);
  return root;
};
```

```java
// Definition for a binary tree node.
// public class TreeNode {
//     int val;
//     TreeNode left;
//     TreeNode right;
//     TreeNode() {}
//     TreeNode(int val) { this.val = val; }
//     TreeNode(int val, TreeNode left, TreeNode right) {
//         this.val = val;
//         this.left = left;
//         this.right = right;
//     }
// }

// Time: O(n) - We visit each node exactly once
// Space: O(h) - Recursion stack depth equals tree height (worst case O(n) for skewed tree)
class Solution {
    private int runningSum = 0;

    public TreeNode bstToGst(TreeNode root) {
        // Start the reverse in-order traversal from root
        reverseInorder(root);
        return root;
    }

    private void reverseInorder(TreeNode node) {
        // Base case: if node is null, return
        if (node == null) return;

        // 1. Traverse right subtree first (larger values)
        reverseInorder(node.right);

        // 2. Update current node value with running sum
        // The runningSum contains sum of all values greater than current node
        runningSum += node.val;
        node.val = runningSum;

        // 3. Traverse left subtree (smaller values)
        reverseInorder(node.left);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once during the reverse in-order traversal
- Each visit involves constant-time operations: updating the running sum and modifying the node value

**Space Complexity: O(h)**

- Where h is the height of the tree
- This is the maximum depth of the recursion stack
- For a balanced BST: O(log n)
- For a skewed tree (worst case): O(n)
- If we used an iterative approach with an explicit stack, the space complexity would still be O(h)

## Common Mistakes

1. **Processing nodes in ascending order instead of descending**: Some candidates try regular in-order traversal (left → root → right), which processes nodes from smallest to largest. This doesn't work because when you process a node, you haven't seen the greater values yet.

2. **Forgetting to update the running sum correctly**: The running sum should be updated _before_ traversing the left subtree. The sequence is crucial: process right subtree → update current node → process left subtree.

3. **Creating a new tree instead of modifying in-place**: The problem expects you to modify the existing tree. Creating a new tree wastes O(n) extra space and is less efficient.

4. **Not handling the base case in recursion**: Forgetting the `if not node: return` check leads to infinite recursion or null pointer errors when reaching leaf nodes' children.

## When You'll See This Pattern

The reverse in-order traversal pattern appears in several BST problems:

1. **Convert BST to Greater Tree (LeetCode 538)** - This is essentially the same problem with a different name.

2. **Binary Search Tree to Sorted Doubly Linked List (LeetCode 426)** - Uses in-order traversal to create sorted order, though not necessarily reverse.

3. **Kth Largest Element in a BST (LeetCode 230)** - Reverse in-order traversal can find the kth largest element efficiently.

4. **Range Sum of BST (LeetCode 938)** - While not using reverse traversal, it demonstrates how BST properties enable efficient range queries.

The core pattern is: when you need to process BST nodes in sorted order (ascending or descending), in-order traversal (or its reverse) is your tool of choice.

## Key Takeaways

1. **Reverse in-order traversal processes BST nodes in descending order** - This is perfect for problems where you need to accumulate values from largest to smallest.

2. **BST properties enable O(n) solutions for many problems** - The sorted structure of BSTs allows efficient traversals without needing to sort explicitly.

3. **Running sums can be computed during traversal** - Instead of collecting all values first, maintain state during traversal to compute results in one pass.

[Practice this problem on CodeJeet](/problem/binary-search-tree-to-greater-sum-tree)
