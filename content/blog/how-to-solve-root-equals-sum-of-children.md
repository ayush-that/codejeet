---
title: "How to Solve Root Equals Sum of Children — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Root Equals Sum of Children. Easy difficulty, 84.9% acceptance rate. Topics: Tree, Binary Tree."
date: "2027-10-14"
category: "dsa-patterns"
tags: ["root-equals-sum-of-children", "tree", "binary-tree", "easy"]
---

# How to Solve Root Equals Sum of Children

This problem asks you to check whether the root node's value equals the sum of its left and right children's values in a binary tree that always has exactly three nodes. While conceptually simple, this problem tests your understanding of binary tree traversal basics and serves as a gentle introduction to tree problems. The interesting part is recognizing that despite being about trees, this problem requires no actual traversal—just direct access to the root's children.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this binary tree:

```
    10
   /  \
  4    6
```

Here, the root node has value 10. Its left child has value 4, and its right child has value 6. To check if the root equals the sum of its children:

1. **Access the children**: Get the left child's value (4) and right child's value (6)
2. **Calculate the sum**: 4 + 6 = 10
3. **Compare with root**: 10 == 10 ✓

The function should return `true`.

Now consider another example:

```
    5
   / \
  2   2
```

1. **Access the children**: Left = 2, Right = 2
2. **Calculate the sum**: 2 + 2 = 4
3. **Compare with root**: 5 == 4 ✗

This should return `false`.

The key insight is that we only need to check the immediate children of the root—no traversal through the entire tree is necessary since the problem guarantees exactly three nodes.

## Brute Force Approach

For this particular problem, there's no meaningful "brute force" approach that differs from the optimal solution because:

1. The tree always has exactly 3 nodes (root + 2 children)
2. We only need to check the root and its immediate children
3. No traversal or searching is required

However, a naive candidate might overcomplicate this by:

- Writing unnecessary tree traversal code
- Checking more nodes than needed
- Making the solution more complex than required

The simplest and most direct approach is already optimal: access the root's left and right children, sum their values, and compare with the root's value.

## Optimal Solution

The optimal solution is straightforward: check if `root.val == root.left.val + root.right.val`. We need to handle null checks since the problem statement doesn't explicitly guarantee both children exist (though the description says "exactly 3 nodes," it's good practice to be defensive).

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def checkTree(self, root: Optional[TreeNode]) -> bool:
        # Step 1: Check if root exists (defensive programming)
        if not root:
            return False

        # Step 2: Check if both children exist
        # While the problem guarantees 3 nodes, we check for safety
        if not root.left or not root.right:
            return False

        # Step 3: Calculate sum of children's values
        children_sum = root.left.val + root.right.val

        # Step 4: Compare with root's value
        return root.val == children_sum
```

```javascript
// Time: O(1) | Space: O(1)
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
 * @return {boolean}
 */
var checkTree = function (root) {
  // Step 1: Check if root exists (defensive programming)
  if (!root) {
    return false;
  }

  // Step 2: Check if both children exist
  // While the problem guarantees 3 nodes, we check for safety
  if (!root.left || !root.right) {
    return false;
  }

  // Step 3: Calculate sum of children's values
  const childrenSum = root.left.val + root.right.val;

  // Step 4: Compare with root's value
  return root.val === childrenSum;
};
```

```java
// Time: O(1) | Space: O(1)
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
    public boolean checkTree(TreeNode root) {
        // Step 1: Check if root exists (defensive programming)
        if (root == null) {
            return false;
        }

        // Step 2: Check if both children exist
        // While the problem guarantees 3 nodes, we check for safety
        if (root.left == null || root.right == null) {
            return false;
        }

        // Step 3: Calculate sum of children's values
        int childrenSum = root.left.val + root.right.val;

        // Step 4: Compare with root's value
        return root.val == childrenSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We perform a constant number of operations: two null checks, one addition, and one comparison
- No loops or recursion depend on input size
- The tree size is fixed at 3 nodes, so even if we did traverse, it would be O(1)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables (`childrenSum`)
- No additional data structures are created
- The call stack doesn't grow since we don't use recursion

## Common Mistakes

1. **Forgetting null checks**: While the problem states there are exactly 3 nodes, in real interviews, you should always check for null pointers. A robust solution handles edge cases even when they're not explicitly mentioned.

2. **Overcomplicating with traversal**: Some candidates write DFS or BFS traversal code when only direct child access is needed. Remember: if you only need immediate children, don't traverse the whole tree.

3. **Incorrect comparison order**: Writing `root.left.val + root.right.val == root.val` is mathematically equivalent but less readable than `root.val == root.left.val + root.right.val`. The latter reads more naturally: "Is the root equal to the sum?"

4. **Assuming children values exist without checking**: Accessing `root.left.val` without checking if `root.left` exists first will cause a null pointer exception in languages like Java and JavaScript.

## When You'll See This Pattern

This problem introduces the fundamental skill of accessing and manipulating binary tree nodes directly, which appears in many tree problems:

1. **Same Tree (LeetCode 100)**: Check if two trees are identical by comparing nodes and their children recursively.

2. **Symmetric Tree (LeetCode 101)**: Check if a tree is symmetric by comparing left and right subtrees—similar to comparing children but extended recursively.

3. **Maximum Depth of Binary Tree (LeetCode 104)**: While this requires traversal, it builds on the same concept of accessing `root.left` and `root.right` to explore the tree.

The pattern of checking properties between a node and its immediate children extends to more complex problems like validating BSTs, checking balanced trees, and calculating path sums.

## Key Takeaways

1. **Direct child access is O(1)**: When you only need immediate children in a binary tree, you can access them directly via `root.left` and `root.right` without any traversal.

2. **Defensive programming matters**: Always check for null pointers before accessing properties, even when the problem seems to guarantee they exist. This shows attention to detail.

3. **Read the constraints carefully**: The guarantee of "exactly 3 nodes" simplifies this problem significantly. Recognizing such constraints helps you avoid over-engineering solutions.

[Practice this problem on CodeJeet](/problem/root-equals-sum-of-children)
