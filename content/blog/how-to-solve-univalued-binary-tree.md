---
title: "How to Solve Univalued Binary Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Univalued Binary Tree. Easy difficulty, 72.9% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2028-03-15"
category: "dsa-patterns"
tags: ["univalued-binary-tree", "tree", "depth-first-search", "breadth-first-search", "easy"]
---

# How to Solve Univalued Binary Tree

This problem asks us to determine whether all nodes in a binary tree have the same value. While conceptually simple, it's an excellent exercise in tree traversal fundamentals and handling edge cases properly. The tricky part isn't the algorithm itself, but ensuring we cover all cases correctly and understand the trade-offs between different traversal approaches.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this tree:

```
    1
   / \
  1   1
 / \   \
1   1   1
```

**Step 1:** Start at the root (value = 1). This is our reference value.

**Step 2:** Check left child (value = 1). Same as root value, so continue.

**Step 3:** Check right child (value = 1). Same as root value, so continue.

**Step 4:** Check left-left child (value = 1). Same as root value, so continue.

**Step 5:** Check left-right child (value = 1). Same as root value, so continue.

**Step 6:** Check right-right child (value = 1). Same as root value.

Since all nodes have value 1, this tree is univalued.

Now consider a counterexample:

```
    1
   / \
  1   2
```

**Step 1:** Start at root (value = 1).

**Step 2:** Check left child (value = 1). Same as root.

**Step 3:** Check right child (value = 2). Different from root! We can immediately return `false` without checking further nodes.

This shows we can short-circuit as soon as we find a mismatch.

## Brute Force Approach

For this problem, there's no "brute force" in the traditional sense of trying all possible combinations. However, a naive approach might involve:

1. Collecting all node values into a list
2. Checking if all values in the list are equal

This approach works but is inefficient because:

- It requires storing all node values (O(n) space)
- It traverses the entire tree even if we find a mismatch early
- The final comparison requires checking all collected values

The better approach is to traverse the tree while comparing each node's value to a reference value (the root's value). We can stop immediately when we find a mismatch.

## Optimal Solution

The optimal solution uses either DFS (Depth-First Search) or BFS (Breadth-First Search) to traverse the tree. We'll use DFS (recursive) as it's simpler for this problem. The algorithm:

1. Store the root's value as the reference value
2. Traverse the tree (pre-order, in-order, or post-order - doesn't matter)
3. For each node, compare its value to the reference value
4. If any node's value differs, return `false` immediately
5. If we finish traversal without finding mismatches, return `true`

<div class="code-group">

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

# Time: O(n) where n is number of nodes (we might visit all nodes in worst case)
# Space: O(h) where h is height of tree (recursion stack)
class Solution:
    def isUnivalTree(self, root):
        # Edge case: empty tree is vacuously univalued
        if not root:
            return True

        # Store the reference value from root
        target_value = root.val

        # Helper function for DFS traversal
        def dfs(node):
            # Base case: null node means we've reached the end of a branch
            if not node:
                return True

            # Check if current node's value matches reference
            if node.val != target_value:
                return False

            # Recursively check left and right subtrees
            # Both must be univalued with the same value
            return dfs(node.left) and dfs(node.right)

        # Start DFS from root
        return dfs(root)
```

```javascript
// Definition for a binary tree node.
// function TreeNode(val, left, right) {
//     this.val = (val===undefined ? 0 : val)
//     this.left = (left===undefined ? null : left)
//     this.right = (right===undefined ? null : right)
// }

// Time: O(n) where n is number of nodes
// Space: O(h) where h is height of tree (recursion stack)
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isUnivalTree = function (root) {
  // Edge case: empty tree is vacuously univalued
  if (!root) {
    return true;
  }

  // Store the reference value from root
  const targetValue = root.val;

  // Helper function for DFS traversal
  const dfs = (node) => {
    // Base case: null node means we've reached the end of a branch
    if (!node) {
      return true;
    }

    // Check if current node's value matches reference
    if (node.val !== targetValue) {
      return false;
    }

    // Recursively check left and right subtrees
    // Both must be univalued with the same value
    return dfs(node.left) && dfs(node.right);
  };

  // Start DFS from root
  return dfs(root);
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

// Time: O(n) where n is number of nodes
// Space: O(h) where h is height of tree (recursion stack)
class Solution {
    public boolean isUnivalTree(TreeNode root) {
        // Edge case: empty tree is vacuously univalued
        if (root == null) {
            return true;
        }

        // Store the reference value from root
        int targetValue = root.val;

        // Start DFS from root
        return dfs(root, targetValue);
    }

    private boolean dfs(TreeNode node, int targetValue) {
        // Base case: null node means we've reached the end of a branch
        if (node == null) {
            return true;
        }

        // Check if current node's value matches reference
        if (node.val != targetValue) {
            return false;
        }

        // Recursively check left and right subtrees
        // Both must be univalued with the same value
        return dfs(node.left, targetValue) && dfs(node.right, targetValue);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the tree. In the worst case, we need to visit every node to confirm the tree is univalued. In the best case (root's children have different values), we can return `false` after checking just the root and one child.

**Space Complexity:** O(h) where h is the height of the tree. This is the space used by the recursion stack. For a balanced tree, h = O(log n). For a skewed tree (like a linked list), h = O(n).

The space complexity comes from:

- Recursion call stack depth equals the height of the tree
- We only store the reference value and current node pointer, which is O(1) additional space

## Common Mistakes

1. **Forgetting the empty tree case:** An empty tree (root is null) should return `true` because there are no nodes with different values. Some candidates return `false` or get a null pointer exception.

2. **Not storing the reference value:** Some candidates compare each node only to its parent, which fails for trees like:

   ```
       1
      / \
     1   1
    / \
   1   2
   ```

   The right child of the left subtree (2) would only be compared to its parent (1), but we need to compare it to the root value (1) - which it matches in this case, but the algorithm would incorrectly accept it.

3. **Incorrect short-circuit logic:** Using `||` instead of `&&` when combining recursive calls. We need **both** subtrees to be univalued, so we use `&&`. Using `||` would return `true` if either subtree is univalued, which is wrong.

4. **Modifying the tree:** Some candidates try to modify node values during traversal or create unnecessary data structures. The solution should be read-only and space-efficient.

## When You'll See This Pattern

This pattern of tree traversal with early termination appears in many tree problems:

1. **Same Tree (LeetCode 100):** Check if two trees are identical using similar DFS traversal with early termination when nodes differ.

2. **Symmetric Tree (LeetCode 101):** Check if a tree is symmetric by comparing mirror positions in the tree.

3. **Maximum Depth of Binary Tree (LeetCode 104):** Traverse to find the deepest leaf, though without early termination.

4. **Path Sum (LeetCode 112):** Traverse while accumulating sum and terminate early when target sum is found.

The core pattern is: traverse the tree (DFS or BFS), maintain some state (reference value, accumulated sum, etc.), and potentially terminate early when a condition is met.

## Key Takeaways

1. **Tree traversal fundamentals matter:** This problem tests your understanding of basic tree traversal (DFS/BFS) and how to adapt it for specific conditions.

2. **Early termination optimization:** When searching for a condition that invalidates the result (like a mismatched value), you can return immediately upon finding it rather than completing the full traversal.

3. **Reference value pattern:** When comparing all elements to a standard, store the reference once (usually from the root) rather than comparing only to local neighbors.

4. **Edge cases are critical:** Always consider empty trees, single-node trees, and skewed trees in your testing.

Related problems: [Find All The Lonely Nodes](/problem/find-all-the-lonely-nodes)
