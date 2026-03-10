---
title: "How to Solve Convert BST to Greater Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Convert BST to Greater Tree. Medium difficulty, 71.4% acceptance rate. Topics: Tree, Depth-First Search, Binary Search Tree, Binary Tree."
date: "2027-10-02"
category: "dsa-patterns"
tags: ["convert-bst-to-greater-tree", "tree", "depth-first-search", "binary-search-tree", "medium"]
---

# How to Solve Convert BST to Greater Tree

This problem asks us to transform a Binary Search Tree (BST) by replacing each node's value with the sum of all values greater than or equal to itself. What makes this problem interesting is that in a BST, "greater" nodes are located to the right, but we need to accumulate values in a specific order to avoid redundant calculations. The key insight is that we need to traverse the tree in reverse in-order (right → root → left) while maintaining a running sum.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this BST:

```
     4
   /   \
  1     6
 / \   / \
0   2 5   7
     \     \
      3     8
```

We need to transform each node value to: original value + sum of all greater values.

Let's process nodes in reverse in-order (right → root → left):

1. Start at node 8 (rightmost): No greater values → becomes 8. Running sum = 8
2. Move to node 7: Original 7 + running sum 8 = 15. Running sum = 15
3. Move to node 6: Original 6 + running sum 15 = 21. Running sum = 21
4. Move to node 5: Original 5 + running sum 21 = 26. Running sum = 26
5. Move to node 4: Original 4 + running sum 26 = 30. Running sum = 30
6. Move to node 3: Original 3 + running sum 30 = 33. Running sum = 33
7. Move to node 2: Original 2 + running sum 33 = 35. Running sum = 35
8. Move to node 1: Original 1 + running sum 35 = 36. Running sum = 36
9. Move to node 0: Original 0 + running sum 36 = 36. Running sum = 36

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

Notice how we process nodes from largest to smallest, accumulating the sum as we go.

## Brute Force Approach

A naive approach would be to:

1. Traverse the tree to collect all values into an array
2. Sort the array in descending order
3. For each node, find its value in the sorted array and sum all values before it
4. Update each node with the calculated sum

This approach has several problems:

- It requires O(n) space to store all values
- Sorting takes O(n log n) time
- Finding each node's position and calculating the sum would be inefficient
- The overall time complexity would be O(n²) if we recalculate sums for each node

The brute force fails because it doesn't leverage the BST property that allows us to process nodes in a specific order to compute sums efficiently in a single pass.

## Optimized Approach

The key insight is that in a BST:

- All values greater than a node are in its right subtree
- When we process nodes in reverse in-order (right → root → left), we visit nodes in descending order
- We can maintain a running sum of all values we've processed so far

Here's the step-by-step reasoning:

1. We need to process nodes from largest to smallest value
2. In a BST, the largest values are in the rightmost nodes
3. Reverse in-order traversal (right → root → left) gives us descending order
4. As we traverse, we keep a running sum of all values processed so far
5. For each node, we update it with: original value + running sum
6. Then we update the running sum to include this node's original value
7. Continue the traversal to process smaller values

This approach processes each node exactly once and uses O(h) space for the recursion stack (where h is the tree height).

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes
# Space: O(h) where h is height of tree (recursion stack)
class Solution:
    def convertBST(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        # Initialize running sum to 0
        self.running_sum = 0

        def reverse_inorder(node):
            # Base case: if node is None, return
            if not node:
                return

            # 1. Traverse right subtree first (larger values)
            reverse_inorder(node.right)

            # 2. Process current node
            # Save original value before modification
            original_val = node.val
            # Update node value with running sum
            node.val += self.running_sum
            # Update running sum to include original value
            self.running_sum += original_val

            # 3. Traverse left subtree (smaller values)
            reverse_inorder(node.left)

        # Start the reverse in-order traversal from root
        reverse_inorder(root)
        return root
```

```javascript
// Time: O(n) where n is number of nodes
// Space: O(h) where h is height of tree (recursion stack)
var convertBST = function (root) {
  let runningSum = 0;

  // Helper function for reverse in-order traversal
  function reverseInorder(node) {
    // Base case: if node is null, return
    if (!node) return;

    // 1. Traverse right subtree first (larger values)
    reverseInorder(node.right);

    // 2. Process current node
    // Save original value before modification
    const originalVal = node.val;
    // Update node value with running sum
    node.val += runningSum;
    // Update running sum to include original value
    runningSum += originalVal;

    // 3. Traverse left subtree (smaller values)
    reverseInorder(node.left);
  }

  // Start the reverse in-order traversal from root
  reverseInorder(root);
  return root;
};
```

```java
// Time: O(n) where n is number of nodes
// Space: O(h) where h is height of tree (recursion stack)
class Solution {
    private int runningSum = 0;

    public TreeNode convertBST(TreeNode root) {
        // Start the reverse in-order traversal
        reverseInorder(root);
        return root;
    }

    private void reverseInorder(TreeNode node) {
        // Base case: if node is null, return
        if (node == null) return;

        // 1. Traverse right subtree first (larger values)
        reverseInorder(node.right);

        // 2. Process current node
        // Save original value before modification
        int originalVal = node.val;
        // Update node value with running sum
        node.val += runningSum;
        // Update running sum to include original value
        runningSum += originalVal;

        // 3. Traverse left subtree (smaller values)
        reverseInorder(node.left);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We visit each node exactly once during the reverse in-order traversal
- Each node visit involves constant-time operations (value update and sum update)
- Total time is proportional to the number of nodes

**Space Complexity:** O(h) where h is the height of the tree

- In the recursive implementation, space is used for the call stack
- In the worst case (skewed tree), h = n, so O(n) space
- In the best case (balanced tree), h = log n, so O(log n) space
- Note: We could achieve O(1) space using Morris traversal, but the recursive solution is more intuitive for interviews

## Common Mistakes

1. **Wrong traversal order:** Attempting standard in-order (left → root → right) instead of reverse in-order. This processes nodes from smallest to largest, making it impossible to accumulate the sum of greater values.

2. **Forgetting to save the original value:** Updating the node value before adding it to the running sum. For example:

   ```python
   # WRONG: using updated value in running sum
   node.val += running_sum
   running_sum += node.val  # Adds modified value instead of original

   # CORRECT: save original value first
   original_val = node.val
   node.val += running_sum
   running_sum += original_val
   ```

3. **Not handling empty tree:** Forgetting the base case when node is null. Always check for null nodes before accessing their properties.

4. **Using global variable incorrectly in recursion:** In Python, forgetting to use `self.running_sum` or declaring it properly. In Java/JavaScript, ensuring the running sum is accessible within the recursive function.

## When You'll See This Pattern

The reverse in-order traversal pattern appears in several BST problems:

1. **Kth Largest Element in a BST (LeetCode 230)** - Find the kth largest element by doing reverse in-order traversal and counting nodes.

2. **Binary Search Tree Iterator (LeetCode 173)** - Implementing `next()` to return the next smallest element uses standard in-order, while returning the next largest would use reverse in-order.

3. **Validate Binary Search Tree (LeetCode 98)** - In-order traversal produces sorted order, which can be used to validate BST properties.

The core pattern is: when you need to process BST nodes in sorted order (ascending or descending), use in-order traversal. When you need to accumulate values from one direction, choose the appropriate traversal direction.

## Key Takeaways

1. **Reverse in-order traversal (right → root → left)** processes BST nodes in descending order. This is crucial when you need to work with "greater" values in a BST.

2. **Maintain a running sum** when you need to accumulate values during traversal. This avoids redundant calculations and keeps time complexity linear.

3. **BST properties enable efficient ordered processing.** Always consider how BST structure (left < root < right) can help you traverse in the needed order without sorting.

Remember: For "greater sum" problems on BSTs, think reverse in-order traversal with a running sum.

[Practice this problem on CodeJeet](/problem/convert-bst-to-greater-tree)
