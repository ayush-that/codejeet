---
title: "How to Solve Construct String from Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Construct String from Binary Tree. Medium difficulty, 70.6% acceptance rate. Topics: String, Tree, Depth-First Search, Binary Tree."
date: "2027-09-28"
category: "dsa-patterns"
tags: ["construct-string-from-binary-tree", "string", "tree", "depth-first-search", "medium"]
---

# How to Solve Construct String from Binary Tree

This problem asks us to create a string representation of a binary tree using preorder traversal with specific formatting rules. The tricky part is knowing when to include empty parentheses for missing children — we need them for left children when the right child exists, but can omit them when both children are missing. This requires careful conditional logic during traversal.

## Visual Walkthrough

Let's trace through an example to understand the rules. Consider this tree:

```
       1
     /   \
    2     3
   /
  4
```

**Step 1:** Start at root (1). Add "1" to string.

**Step 2:** Process left child (2). Since left child exists, we add "(2" to string: "1(2"

**Step 3:** Process left child of node 2 (node 4). Add "(4" to string: "1(2(4"

**Step 4:** Node 4 has no children. Since both children are null, we don't add any parentheses. Close node 4's parentheses: "1(2(4)"

**Step 5:** Node 2 has no right child. Since left child exists but right is null, we don't need extra parentheses. Close node 2's parentheses: "1(2(4))"

**Step 6:** Process right child of root (node 3). Add "(3" to string: "1(2(4))(3"

**Step 7:** Node 3 has no children. Since both are null, we don't add parentheses. Close node 3's parentheses: "1(2(4))(3)"

Final result: `"1(2(4))(3)"`

Notice what happens if we have a node with only a right child:

```
    1
     \
      2
     / \
    3   4
```

Result: `"1()(2(3)(4))"` — we need empty parentheses for the missing left child because the right child exists.

## Brute Force Approach

A naive approach might be to perform a preorder traversal and always add parentheses for both children, then try to clean up the string afterward. For example:

1. Do a standard preorder traversal
2. For each node, add the node value followed by "(left_subtree)(right_subtree)"
3. Replace "()()" patterns with "" (empty string)
4. Replace ")()" patterns with ")" when appropriate

However, this post-processing is complex and error-prone. We'd need to handle multiple edge cases:

- When a node has only a right child, we need "()" for the left child
- When a node has only a left child, we don't need "()" for the right child
- When a node has no children, we need no parentheses at all

The cleanup logic becomes messy because we're trying to fix a representation that was built incorrectly from the start. This approach would have O(n) time complexity but would be difficult to implement correctly and maintain.

## Optimized Approach

The key insight is to build the string correctly during traversal by following these rules:

1. **Always add the current node's value**
2. **Process left child:**
   - If left child exists: add "(" + left_subtree + ")"
   - If left child is null but right child exists: add "()"
   - If both children are null: add nothing
3. **Process right child:**
   - If right child exists: add "(" + right_subtree + ")"
   - If right child is null: add nothing

This approach ensures we build the correct string incrementally without needing post-processing. We use recursion to naturally handle the tree structure, with the base case being when we reach a null node (return empty string).

The recursive function should:

1. Convert current node value to string
2. Recursively get string for left subtree
3. Recursively get string for right subtree
4. Combine based on the rules above

This is essentially a modified preorder traversal where we conditionally add parentheses based on child existence.

## Optimal Solution

Here's the complete solution implementing the optimized approach:

<div class="code-group">

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

# Time: O(n) where n is number of nodes (we visit each node once)
# Space: O(h) where h is tree height (recursion stack)
class Solution:
    def tree2str(self, root: Optional[TreeNode]) -> str:
        # Base case: if node is None, return empty string
        if not root:
            return ""

        # Convert current node value to string
        result = str(root.val)

        # Process left child
        left_str = self.tree2str(root.left)
        # Process right child
        right_str = self.tree2str(root.right)

        # Apply formatting rules:
        # 1. If right child exists, we must include left child (even if empty)
        # 2. If only left child exists, include it
        # 3. If no children exist, include nothing

        if root.left or root.right:  # If at least one child exists
            result += "(" + left_str + ")"

        if root.right:  # If right child exists, include it
            result += "(" + right_str + ")"

        return result
```

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

// Time: O(n) where n is number of nodes (we visit each node once)
// Space: O(h) where h is tree height (recursion stack)
/**
 * @param {TreeNode} root
 * @return {string}
 */
var tree2str = function (root) {
  // Base case: if node is null, return empty string
  if (!root) {
    return "";
  }

  // Convert current node value to string
  let result = root.val.toString();

  // Process left child recursively
  const leftStr = tree2str(root.left);
  // Process right child recursively
  const rightStr = tree2str(root.right);

  // Apply formatting rules:
  // 1. If right child exists, we must include left child (even if empty)
  // 2. If only left child exists, include it
  // 3. If no children exist, include nothing

  if (root.left || root.right) {
    // Include left child when at least one child exists
    result += "(" + leftStr + ")";
  }

  if (root.right) {
    // Include right child only when it exists
    result += "(" + rightStr + ")";
  }

  return result;
};
```

```java
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

// Time: O(n) where n is number of nodes (we visit each node once)
// Space: O(h) where h is tree height (recursion stack)
class Solution {
    public String tree2str(TreeNode root) {
        // Base case: if node is null, return empty string
        if (root == null) {
            return "";
        }

        // Convert current node value to string
        StringBuilder result = new StringBuilder();
        result.append(root.val);

        // Process left child recursively
        String leftStr = tree2str(root.left);
        // Process right child recursively
        String rightStr = tree2str(root.right);

        // Apply formatting rules:
        // 1. If right child exists, we must include left child (even if empty)
        // 2. If only left child exists, include it
        // 3. If no children exist, include nothing

        if (root.left != null || root.right != null) {
            // Include left child when at least one child exists
            result.append("(").append(leftStr).append(")");
        }

        if (root.right != null) {
            // Include right child only when it exists
            result.append("(").append(rightStr).append(")");
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the tree. We visit each node exactly once during the recursive traversal.

**Space Complexity:** O(h) where h is the height of the tree. This is the maximum depth of the recursion stack. In the worst case (skewed tree), this could be O(n). In the best case (balanced tree), it's O(log n).

The string construction itself also uses O(n) space for the output string, but this is typically considered separate from the algorithm's space complexity.

## Common Mistakes

1. **Forgetting to handle the case where left child is null but right child exists:** This is the trickiest part. When a node has only a right child, we need to include empty parentheses for the left child: `"root()(right)"`. Many candidates omit the `"()"` in this case.

2. **Including unnecessary parentheses for leaf nodes:** When a node has no children, we should not add any parentheses. Some candidates add `"()"` or `"()()"` for leaf nodes, which is incorrect.

3. **Using string concatenation inefficiently in Java:** In Java, using `+` operator for string concatenation in a loop creates many intermediate String objects. Using `StringBuilder` is more efficient for building the result incrementally.

4. **Not handling the null root case:** Always check if the root is null at the beginning and return an appropriate value (empty string in this case).

## When You'll See This Pattern

This problem combines tree traversal with conditional string building, a pattern that appears in several tree serialization problems:

1. **Construct Binary Tree from String (LeetCode 536):** The inverse problem — given a string like `"1(2(4))(3)"`, reconstruct the binary tree. It uses similar parsing logic with stack-based or recursive approaches.

2. **Find Duplicate Subtrees (LeetCode 652):** Uses tree serialization to create unique string representations of subtrees, then checks for duplicates using a hash map.

3. **Serialize and Deserialize Binary Tree (LeetCode 297):** Another serialization problem with different formatting rules (often using level-order traversal with null markers).

The core pattern is using recursion to traverse the tree while building some representation, with conditional logic based on node properties.

## Key Takeaways

1. **Tree serialization often uses preorder traversal** because it naturally preserves the parent-child relationships when reconstructing the tree.

2. **Conditional formatting based on child existence** is a common requirement in tree-to-string problems. Always carefully consider all four cases: both children, left only, right only, and no children.

3. **Recursive solutions are natural for tree problems**, but pay attention to the base case (null node) and how you combine results from left and right subtrees.

Related problems: [Construct Binary Tree from String](/problem/construct-binary-tree-from-string), [Find Duplicate Subtrees](/problem/find-duplicate-subtrees)
