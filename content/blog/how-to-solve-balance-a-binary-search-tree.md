---
title: "How to Solve Balance a Binary Search Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Balance a Binary Search Tree. Medium difficulty, 86.3% acceptance rate. Topics: Divide and Conquer, Greedy, Tree, Depth-First Search, Binary Search Tree."
date: "2027-08-03"
category: "dsa-patterns"
tags: ["balance-a-binary-search-tree", "divide-and-conquer", "greedy", "tree", "medium"]
---

# How to Solve Balance a Binary Search Tree

This problem asks us to take an existing binary search tree (BST) and transform it into a balanced version while preserving all node values. The tricky part is that the input BST could be extremely unbalanced (like a linked list), but we need to produce a tree where for every node, the heights of its left and right subtrees differ by at most 1. What makes this interesting is that we must maintain the BST property while achieving balance.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this unbalanced BST:

```
Input:
        5
       /
      4
     /
    3
   /
  2
 /
1

Values in-order: [1, 2, 3, 4, 5]
```

This tree is essentially a linked list with height 5. To balance it:

1. **Step 1: Extract values in sorted order**  
   Perform an in-order traversal to get: [1, 2, 3, 4, 5]

2. **Step 2: Build balanced BST from sorted array**  
   The middle element (3) becomes the root:

   ```
       3
   ```

   Left subarray [1, 2] gives left subtree:

   ```
       3
      /
     2
    /
   1
   ```

   Wait, that's still unbalanced! We need to recursively apply the same logic.

3. **Step 3: Recursively build balanced subtrees**  
   For [1, 2]:
   - Middle element: 2 (or 1 if we choose left-middle)
   - Left: [1], Right: []

   ```
       2
      /
     1
   ```

   For [4, 5]:
   - Middle element: 5 (or 4 if we choose left-middle)
   - Left: [4], Right: []

   ```
       5
      /
     4
   ```

4. **Step 4: Combine**  
   Final balanced tree:
   ```
       3
      / \
     2   5
    /   /
   1   4
   ```
   Or if we consistently choose left-middle:
   ```
       3
      / \
     1   4
      \   \
       2   5
   ```
   Both are valid balanced BSTs!

## Brute Force Approach

A naive approach might try to repeatedly rotate nodes until the tree becomes balanced. We could:

1. Calculate the height of each node's subtrees
2. If imbalance > 1 at any node, perform tree rotations
3. Repeat until the entire tree is balanced

However, this approach has several problems:

- Determining which rotations to perform and in what order is complex
- We might need multiple passes through the tree
- Worst-case time complexity could be O(n²) for extremely unbalanced trees
- The logic becomes convoluted with many edge cases

The brute force approach is not only inefficient but also difficult to implement correctly. Interviewers would expect a more systematic solution.

## Optimized Approach

The key insight is that:

1. **In-order traversal of a BST gives sorted values** - This is a fundamental property of BSTs
2. **A sorted array can be converted to a balanced BST** - By recursively picking the middle element as root

This leads to a clean two-step algorithm:

1. **Flatten**: Perform in-order traversal to extract all node values into a sorted array
2. **Rebuild**: Recursively build a balanced BST from the sorted array by:
   - Selecting the middle element as the root
   - Recursively building left subtree from elements before the middle
   - Recursively building right subtree from elements after the middle

Why this works:

- The resulting tree is balanced because we're dividing the array in half each time
- It maintains BST property because left subtree contains smaller elements and right subtree contains larger elements
- Time complexity is O(n) for traversal + O(n) for rebuilding = O(n)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def balanceBST(self, root: TreeNode) -> TreeNode:
        # Step 1: Perform in-order traversal to get sorted values
        def inorder(node):
            if not node:
                return []
            # Traverse left, visit node, traverse right
            return inorder(node.left) + [node.val] + inorder(node.right)

        # Get sorted values from the BST
        values = inorder(root)

        # Step 2: Build balanced BST from sorted array
        def build_balanced(left, right):
            # Base case: no elements in this range
            if left > right:
                return None

            # Choose middle element as root to ensure balance
            mid = (left + right) // 2

            # Create root node with middle value
            node = TreeNode(values[mid])

            # Recursively build left subtree from left half
            node.left = build_balanced(left, mid - 1)

            # Recursively build right subtree from right half
            node.right = build_balanced(mid + 1, right)

            return node

        # Build the balanced BST from the entire values array
        return build_balanced(0, len(values) - 1)
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var balanceBST = function (root) {
  // Step 1: Perform in-order traversal to get sorted values
  const values = [];

  function inorder(node) {
    if (!node) return;

    // Traverse left subtree
    inorder(node.left);

    // Visit current node
    values.push(node.val);

    // Traverse right subtree
    inorder(node.right);
  }

  inorder(root);

  // Step 2: Build balanced BST from sorted array
  function buildBalanced(left, right) {
    // Base case: no elements in this range
    if (left > right) {
      return null;
    }

    // Choose middle element as root to ensure balance
    const mid = Math.floor((left + right) / 2);

    // Create root node with middle value
    const node = new TreeNode(values[mid]);

    // Recursively build left subtree from left half
    node.left = buildBalanced(left, mid - 1);

    // Recursively build right subtree from right half
    node.right = buildBalanced(mid + 1, right);

    return node;
  }

  // Build the balanced BST from the entire values array
  return buildBalanced(0, values.length - 1);
};
```

```java
// Time: O(n) | Space: O(n)
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */

class Solution {
    public TreeNode balanceBST(TreeNode root) {
        // Step 1: Perform in-order traversal to get sorted values
        List<Integer> values = new ArrayList<>();
        inorder(root, values);

        // Step 2: Build balanced BST from sorted array
        return buildBalanced(values, 0, values.size() - 1);
    }

    // Helper method for in-order traversal
    private void inorder(TreeNode node, List<Integer> values) {
        if (node == null) return;

        // Traverse left subtree
        inorder(node.left, values);

        // Visit current node
        values.add(node.val);

        // Traverse right subtree
        inorder(node.right, values);
    }

    // Helper method to build balanced BST from sorted list
    private TreeNode buildBalanced(List<Integer> values, int left, int right) {
        // Base case: no elements in this range
        if (left > right) {
            return null;
        }

        // Choose middle element as root to ensure balance
        int mid = left + (right - left) / 2;

        // Create root node with middle value
        TreeNode node = new TreeNode(values.get(mid));

        // Recursively build left subtree from left half
        node.left = buildBalanced(values, left, mid - 1);

        // Recursively build right subtree from right half
        node.right = buildBalanced(values, mid + 1, right);

        return node;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- In-order traversal visits each node once: O(n)
- Building the balanced BST processes each element once: O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- Values array stores all n node values: O(n)
- Recursion stack for building balanced tree: O(log n) in balanced case, but O(n) in worst case if tree is extremely unbalanced
- Total: O(n) for the array dominates

The space complexity is optimal because we need to store all values somewhere during the transformation.

## Common Mistakes

1. **Forgetting that in-order traversal of BST gives sorted order**  
   Some candidates try to balance the tree in-place without extracting values first, which leads to complex rotation logic. Always remember this fundamental BST property.

2. **Incorrect middle element selection when building balanced tree**  
   Using `(left + right) // 2` ensures we get the floor of the middle. Some candidates use `(left + right + 1) // 2` which gives the ceiling - both work, but be consistent. The key is that the middle element should roughly divide the array in half.

3. **Not handling empty/null cases properly**  
   In the `build_balanced` function, the base case `if left > right` must return `None/null`. Some candidates check `if left == right` only, which misses cases where the subarray has no elements.

4. **Modifying the original tree instead of creating a new one**  
   The problem doesn't require in-place modification. Creating a new tree is simpler and safer. If you try to modify the original tree structure, you risk losing node references.

## When You'll See This Pattern

This "flatten and rebuild" pattern appears in several tree problems:

1. **Convert Sorted Array to Binary Search Tree (LeetCode 108)**  
   Direct application of the second half of our solution - building balanced BST from sorted array.

2. **Convert Binary Search Tree to Sorted Doubly Linked List (LeetCode 426)**  
   Uses in-order traversal like our first step, but connects nodes into a linked list instead of an array.

3. **Recover Binary Search Tree (LeetCode 99)**  
   Uses in-order traversal to detect where the BST property is violated, similar to how we extract values.

The core technique is recognizing that in-order traversal of a BST yields sorted order, which enables array-based operations on tree data.

## Key Takeaways

1. **In-order traversal of BST produces sorted sequence** - This is the most important BST property for many problems. If you need sorted data from a BST, in-order traversal is your tool.

2. **Balanced BST from sorted array uses divide-and-conquer** - By recursively selecting the middle element as root, you guarantee balance. This is essentially a binary search pattern applied to tree construction.

3. **Sometimes rebuilding is simpler than fixing** - For tree restructuring problems, consider whether extracting data and rebuilding might be cleaner than complex in-place modifications.

[Practice this problem on CodeJeet](/problem/balance-a-binary-search-tree)
