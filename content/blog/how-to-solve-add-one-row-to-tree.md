---
title: "How to Solve Add One Row to Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Add One Row to Tree. Medium difficulty, 64.1% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2028-01-06"
category: "dsa-patterns"
tags: ["add-one-row-to-tree", "tree", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve "Add One Row to Tree"

This problem asks us to insert a new row of nodes at a specific depth in a binary tree. The tricky part is handling the pointer reassignments correctly: when we insert at depth `d`, we need to find all nodes at depth `d-1`, create new nodes with the given value, and insert them between the depth `d-1` nodes and their existing children. This requires careful tree traversal and pointer manipulation.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
Tree:        4
            / \
           2   6
          /   / \
         3   5   7

val = 1, depth = 2
```

**Step-by-step process:**

1. **Root is at depth 1.** We need to add nodes at depth 2, so we look for nodes at depth 1 (depth - 1 = 1).

2. **Find nodes at depth 1:** Only the root node `4` is at depth 1.

3. **For node 4:**
   - Create new left node with value 1
   - Create new right node with value 1
   - Original left child `2` becomes the left child of new left node
   - Original right child `6` becomes the right child of new right node
   - Set node 4's left child to new left node
   - Set node 4's right child to new right node

**Result:**

```
Tree:        4
            / \
           1   1
          /     \
         2       6
        /       / \
       3       5   7
```

Notice how the original children (`2` and `6`) become grandchildren, and the new nodes (`1` and `1`) become the children at depth 2.

## Brute Force Approach

A naive approach might be to:

1. Traverse the entire tree to find all nodes at depth `d-1`
2. For each such node, create new nodes and reassign pointers

However, there's no fundamentally different "brute force" vs "optimized" approach for tree problems like this - the key is in the implementation details. The main challenge candidates face is handling the special cases:

1. **Depth = 1:** We need to create a new root
2. **Depth > 1:** We need to find nodes at depth `d-1`
3. **Missing children:** If a node at depth `d-1` only has one child, we still create both new nodes

A common mistake is to try modifying the tree during traversal without properly storing references, which can lead to infinite loops or lost nodes.

## Optimized Approach

The key insight is that we need to perform a **level-order traversal** (BFS) or **depth-first search** (DFS) to find nodes at depth `d-1`. Both approaches work, but they have different trade-offs:

**BFS Approach:**

- Use a queue to traverse level by level
- Stop when we reach depth `d-1`
- For each node at that depth, insert the new row
- More intuitive for this problem since we're working with depths/levels

**DFS Approach:**

- Recursively traverse with current depth tracking
- When current depth = `d-1`, insert new nodes
- Cleaner code but less intuitive for level-based operations

The critical logic for both approaches:

1. Handle the special case where `depth = 1` (create new root)
2. Traverse to find nodes at depth `d-1`
3. For each such node:
   - Create left and right children with value `val`
   - Attach original left child to new left node's left
   - Attach original right child to new right node's right
   - Set node's children to the new nodes

## Optimal Solution

Here's the complete solution using DFS (cleaner implementation) and BFS (more intuitive):

<div class="code-group">

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

# Time: O(n) where n is number of nodes in the tree
# Space: O(h) where h is height of the tree (recursion stack)
class Solution:
    def addOneRow(self, root: Optional[TreeNode], val: int, depth: int) -> Optional[TreeNode]:
        # Special case: if depth is 1, create new root
        if depth == 1:
            new_root = TreeNode(val)
            new_root.left = root
            return new_root

        # DFS helper function
        def dfs(node, current_depth):
            if not node:
                return

            # When we reach depth-1, insert new row
            if current_depth == depth - 1:
                # Store original children
                original_left = node.left
                original_right = node.right

                # Create new nodes with given value
                new_left = TreeNode(val)
                new_right = TreeNode(val)

                # Attach original children to new nodes
                new_left.left = original_left
                new_right.right = original_right

                # Replace node's children with new nodes
                node.left = new_left
                node.right = new_right

                # Return early since we've inserted at this level
                return

            # Continue DFS traversal
            dfs(node.left, current_depth + 1)
            dfs(node.right, current_depth + 1)

        # Start DFS from root at depth 1
        dfs(root, 1)
        return root
```

```javascript
// Definition for a binary tree node.
// function TreeNode(val, left, right) {
//     this.val = (val===undefined ? 0 : val)
//     this.left = (left===undefined ? null : left)
//     this.right = (right===undefined ? null : right)
// }

// Time: O(n) where n is number of nodes in the tree
// Space: O(h) where h is height of the tree (recursion stack)
/**
 * @param {TreeNode} root
 * @param {number} val
 * @param {number} depth
 * @return {TreeNode}
 */
var addOneRow = function (root, val, depth) {
  // Special case: if depth is 1, create new root
  if (depth === 1) {
    const newRoot = new TreeNode(val);
    newRoot.left = root;
    return newRoot;
  }

  // DFS helper function
  const dfs = (node, currentDepth) => {
    if (!node) return;

    // When we reach depth-1, insert new row
    if (currentDepth === depth - 1) {
      // Store original children
      const originalLeft = node.left;
      const originalRight = node.right;

      // Create new nodes with given value
      const newLeft = new TreeNode(val);
      const newRight = new TreeNode(val);

      // Attach original children to new nodes
      newLeft.left = originalLeft;
      newRight.right = originalRight;

      // Replace node's children with new nodes
      node.left = newLeft;
      node.right = newRight;

      // Return early since we've inserted at this level
      return;
    }

    // Continue DFS traversal
    dfs(node.left, currentDepth + 1);
    dfs(node.right, currentDepth + 1);
  };

  // Start DFS from root at depth 1
  dfs(root, 1);
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

// Time: O(n) where n is number of nodes in the tree
// Space: O(h) where h is height of the tree (recursion stack)
class Solution {
    public TreeNode addOneRow(TreeNode root, int val, int depth) {
        // Special case: if depth is 1, create new root
        if (depth == 1) {
            TreeNode newRoot = new TreeNode(val);
            newRoot.left = root;
            return newRoot;
        }

        // Start DFS from root at depth 1
        dfs(root, 1, val, depth);
        return root;
    }

    private void dfs(TreeNode node, int currentDepth, int val, int targetDepth) {
        if (node == null) return;

        // When we reach depth-1, insert new row
        if (currentDepth == targetDepth - 1) {
            // Store original children
            TreeNode originalLeft = node.left;
            TreeNode originalRight = node.right;

            // Create new nodes with given value
            TreeNode newLeft = new TreeNode(val);
            TreeNode newRight = new TreeNode(val);

            // Attach original children to new nodes
            newLeft.left = originalLeft;
            newRight.right = originalRight;

            // Replace node's children with new nodes
            node.left = newLeft;
            node.right = newRight;

            // Return early since we've inserted at this level
            return;
        }

        // Continue DFS traversal
        dfs(node.left, currentDepth + 1, val, targetDepth);
        dfs(node.right, currentDepth + 1, val, targetDepth);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We visit each node at most once during the DFS traversal
- In the worst case, we traverse the entire tree (when depth is greater than tree height or when we need to find nodes at the deepest level)

**Space Complexity:** O(h) where h is the height of the tree

- This is the space used by the recursion call stack
- In the worst case (skewed tree), h = n, so O(n)
- In the best case (balanced tree), h = log n, so O(log n)

For the BFS approach (not shown but equally valid), the space complexity would be O(w) where w is the maximum width of the tree, which could be O(n) in the worst case.

## Common Mistakes

1. **Not handling depth = 1 as a special case:** When depth is 1, we need to create a new root. Many candidates try to use the same logic for all depths and end up with incorrect pointer assignments.

2. **Incorrect depth tracking:** Off-by-one errors are common. Remember: root is at depth 1, not 0. When the problem says "add at depth d", we need to find nodes at depth d-1.

3. **Losing reference to original children:** This is the most critical mistake. When inserting new nodes, you MUST store the original children before reassigning pointers:

   ```python
   # WRONG - loses reference to original left child
   node.left = TreeNode(val)
   node.left.left = node.left  # This is now pointing to the new node!

   # CORRECT - store reference first
   original_left = node.left
   new_left = TreeNode(val)
   new_left.left = original_left
   node.left = new_left
   ```

4. **Assuming both children exist:** A node at depth d-1 might have only one child (or none). The solution should still create both new nodes even if one or both original children are null.

## When You'll See This Pattern

This problem combines tree traversal with node insertion/modification. You'll see similar patterns in:

1. **"Insert into a Binary Search Tree" (LeetCode 701)** - Similar node insertion logic but with BST ordering rules
2. **"Delete Node in a BST" (LeetCode 450)** - More complex pointer manipulation when removing nodes
3. **"Binary Tree Pruning" (LeetCode 814)** - Modifying tree structure based on node values
4. **"Merge Two Binary Trees" (LeetCode 617)** - Combining two trees with pointer manipulation

The core pattern is: traverse the tree, identify target nodes based on some condition (depth, value, etc.), and perform structural modifications while preserving necessary references.

## Key Takeaways

1. **Always store references before reassigning pointers** when modifying tree structures. This prevents losing access to subtrees.

2. **Depth in trees is usually 1-indexed** in LeetCode problems (root at depth 1). Be consistent with this convention to avoid off-by-one errors.

3. **Both DFS and BFS work for tree modification problems** - choose based on what's more intuitive for the specific operation. DFS is often cleaner for recursive problems, while BFS is better for level-based operations.

4. **Handle edge cases first** - special cases like empty trees, depth = 1, or single-node trees should be addressed before the general logic.

[Practice this problem on CodeJeet](/problem/add-one-row-to-tree)
