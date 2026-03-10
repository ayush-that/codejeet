---
title: "How to Solve Reverse Odd Levels of Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reverse Odd Levels of Binary Tree. Medium difficulty, 86.7% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2026-03-09"
category: "dsa-patterns"
tags:
  [
    "reverse-odd-levels-of-binary-tree",
    "tree",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Solve Reverse Odd Levels of Binary Tree

This problem asks us to reverse the values of nodes at odd levels (1-indexed) in a **perfect binary tree** — meaning every level is completely filled. While it sounds similar to inverting a binary tree, there's a key difference: we're only reversing the **values** at odd levels, not swapping the actual node positions. This creates an interesting challenge where we need to identify nodes at the same level and reverse their values while maintaining the tree structure.

What makes this problem tricky is that we need to efficiently access nodes at the same level to reverse their values. If we simply traverse the tree depth-first, we lose the horizontal relationships between nodes at the same level. This forces us to think about level-order traversal strategies.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this perfect binary tree:

```
Level 1:        2
Level 2:      3   5
Level 3:    8 13 21 34
```

**Step 1: Identify odd levels**  
Levels are 1-indexed, so:

- Level 1 (root) is odd → needs reversal
- Level 2 is even → no change
- Level 3 is odd → needs reversal

**Step 2: Reverse level 1**  
Level 1 has only one node `[2]`. Reversing a single element gives `[2]` (no change).

**Step 3: Reverse level 3**  
Original level 3 values: `[8, 13, 21, 34]`  
Reversed: `[34, 21, 13, 8]`

**Step 4: Apply reversed values**  
We swap the values in place while keeping the tree structure:

- Node with original value 8 gets new value 34
- Node with original value 13 gets new value 21
- Node with original value 21 gets new value 13
- Node with original value 34 gets new value 8

**Final tree:**

```
Level 1:        2
Level 2:      3   5
Level 3:    34 21 13 8
```

Notice that the reversal happens left-to-right across each level. The leftmost node at level 3 gets the value that was originally in the rightmost node, and so on.

## Brute Force Approach

A naive approach might try to:

1. Traverse the tree to collect all values level by level
2. Reverse the values at odd levels
3. Traverse the tree again to reassign the reversed values

While this would work, it requires two full traversals and additional space to store all values. More importantly, it doesn't take advantage of the perfect binary tree property. A candidate might also try modifying values during a depth-first traversal, but this fails because DFS doesn't give us easy access to nodes that are symmetric across the level.

The real issue with brute force is the difficulty of efficiently pairing up nodes that need to swap values. Without careful planning, we might end up with O(n²) operations or complex bookkeeping.

## Optimized Approach

The key insight is that in a perfect binary tree, nodes at the same level have a predictable relationship. For two nodes at the same odd level that need to swap values, they are symmetric across the center of that level.

We can solve this efficiently using **BFS (level-order traversal)**:

1. Perform BFS to process nodes level by level
2. Track the current level number (starting from 1 for the root)
3. When we're at an odd level:
   - Collect all node values at that level
   - Reverse the list of values
   - Assign the reversed values back to the nodes in left-to-right order

However, there's an even more elegant approach using **DFS with paired traversal**:

1. Traverse the tree with two pointers: one starting from the left child and one from the right child
2. These pointers represent symmetric positions at the next level
3. When at an odd level (parent level is even), swap the values of the two symmetric nodes
4. Recursively apply this to their children

This DFS approach is particularly clever because it leverages the perfect binary tree structure to directly access symmetric nodes without needing to store entire levels.

## Optimal Solution

The most efficient solution uses DFS with paired traversal. We traverse the tree with two nodes at a time that are symmetric across the center. When their parent level is even (making the current level odd), we swap their values.

<div class="code-group">

```python
# Time: O(n) | Space: O(h) where h is the height of the tree
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def reverseOddLevels(self, root):
        """
        Reverse node values at odd levels of a perfect binary tree.
        Uses DFS with paired traversal to access symmetric nodes directly.
        """
        def dfs(left, right, level):
            # Base case: if either node is None, we've reached the end
            if not left or not right:
                return

            # If current level is odd (level starts at 0 for root's children)
            # We check if level is odd by checking level % 2 == 0
            # because when we call dfs on root.left and root.right,
            # they are at level 1 (odd), so we pass level=0 initially
            if level % 2 == 0:
                # Swap values of symmetric nodes
                left.val, right.val = right.val, left.val

            # Recursively process the children
            # Note the pairing: left.left with right.right and left.right with right.left
            # This ensures we're always comparing symmetric positions
            dfs(left.left, right.right, level + 1)
            dfs(left.right, right.left, level + 1)

        # Start DFS from the children of root (level 0 corresponds to level 2 in 1-indexed)
        # If root is None or has no children, return root
        if root and root.left:
            dfs(root.left, root.right, 0)

        return root
```

```javascript
// Time: O(n) | Space: O(h) where h is the height of the tree
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
var reverseOddLevels = function (root) {
  /**
   * Reverse node values at odd levels of a perfect binary tree.
   * Uses DFS with paired traversal to access symmetric nodes directly.
   */

  const dfs = (left, right, level) => {
    // Base case: if either node is null, we've reached the end
    if (!left || !right) return;

    // If current level is odd (level starts at 0 for root's children)
    // We check if level is even because when we call dfs on root.left and root.right,
    // they are at level 1 (odd), so we pass level=0 initially
    if (level % 2 === 0) {
      // Swap values of symmetric nodes
      [left.val, right.val] = [right.val, left.val];
    }

    // Recursively process the children
    // Pair left.left with right.right and left.right with right.left
    // This ensures we're always comparing symmetric positions
    dfs(left.left, right.right, level + 1);
    dfs(left.right, right.left, level + 1);
  };

  // Start DFS from the children of root
  // If root is null or has no children, return root
  if (root && root.left) {
    dfs(root.left, root.right, 0);
  }

  return root;
};
```

```java
// Time: O(n) | Space: O(h) where h is the height of the tree
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
    /**
     * Reverse node values at odd levels of a perfect binary tree.
     * Uses DFS with paired traversal to access symmetric nodes directly.
     */
    public TreeNode reverseOddLevels(TreeNode root) {
        // Start DFS from the children of root
        // If root is null or has no children, return root
        if (root != null && root.left != null) {
            dfs(root.left, root.right, 0);
        }
        return root;
    }

    private void dfs(TreeNode left, TreeNode right, int level) {
        // Base case: if either node is null, we've reached the end
        if (left == null || right == null) return;

        // If current level is odd (level starts at 0 for root's children)
        // We check if level is even because when we call dfs on root.left and root.right,
        // they are at level 1 (odd), so we pass level=0 initially
        if (level % 2 == 0) {
            // Swap values of symmetric nodes
            int temp = left.val;
            left.val = right.val;
            right.val = temp;
        }

        // Recursively process the children
        // Pair left.left with right.right and left.right with right.left
        // This ensures we're always comparing symmetric positions
        dfs(left.left, right.right, level + 1);
        dfs(left.right, right.left, level + 1);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We visit each node exactly once in the DFS traversal. Each node is processed in constant time (just a possible value swap), so the total time is proportional to the number of nodes.

**Space Complexity:** O(h) where h is the height of the tree  
This is the space used by the recursion stack. In the worst case, for a perfect binary tree with n nodes, the height is O(log n). Note that we don't use any additional data structures that grow with n.

## Common Mistakes

1. **Forgetting the root level is level 1 (odd)**  
   Many candidates start counting levels from 0 or forget that the root is at level 1. In our solution, we handle this by starting the recursion from the root's children with level=0, which corresponds to level 2 in 1-indexed terms.

2. **Incorrect pairing of symmetric nodes**  
   When doing the paired DFS, it's crucial to pair `left.left` with `right.right` and `left.right` with `right.left`. Mixing these up (like pairing `left.left` with `right.left`) will not correctly reverse the level.

3. **Not handling the perfect binary tree constraint**  
   The problem states the tree is perfect, but some candidates write code that tries to handle non-perfect trees. This can lead to null pointer errors. Always check the problem constraints.

4. **Modifying tree structure instead of values**  
   This problem asks to reverse values, not node positions. Some candidates mistakenly try to swap entire nodes (changing left/right pointers), which is incorrect.

## When You'll See This Pattern

This paired DFS traversal pattern appears in several tree problems:

1. **Symmetric Tree (LeetCode 101)** - Check if a tree is symmetric by comparing mirrored nodes
2. **Invert Binary Tree (LeetCode 226)** - Swap left and right children throughout the tree
3. **Merge Two Binary Trees (LeetCode 617)** - Traverse two trees simultaneously

The core idea is traversing two related positions in a tree simultaneously, which is efficient for problems involving symmetric operations or comparisons between corresponding positions in tree structures.

## Key Takeaways

1. **Paired traversal is powerful for symmetric operations** - When you need to compare or operate on symmetric positions in a tree, consider traversing with two pointers that move in mirrored paths.

2. **Level parity matters** - Many tree problems involve different operations based on whether a level is odd or even. Always clarify if levels are 0-indexed or 1-indexed.

3. **Perfect binary trees have special properties** - The symmetry in perfect binary trees allows for elegant solutions that wouldn't work on general binary trees. Always check if a tree is perfect, complete, or full as these constraints often enable optimizations.

Related problems: [Invert Binary Tree](/problem/invert-binary-tree)
