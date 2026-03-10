---
title: "How to Solve Range Sum of BST — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Range Sum of BST. Easy difficulty, 87.6% acceptance rate. Topics: Tree, Depth-First Search, Binary Search Tree, Binary Tree."
date: "2026-08-10"
category: "dsa-patterns"
tags: ["range-sum-of-bst", "tree", "depth-first-search", "binary-search-tree", "easy"]
---

# How to Solve Range Sum of BST

The problem asks us to sum all node values in a Binary Search Tree (BST) that fall within a given inclusive range `[low, high]`. While this is labeled "Easy," it's interesting because it tests your understanding of BST properties and how to leverage them for efficient traversal. The key insight is that BSTs have ordered structure (left < root < right), which allows us to prune entire subtrees that cannot contain values in our target range.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this BST:

```
        10
       /  \
      5    15
     / \     \
    3   7     18
```

Given `low = 7` and `high = 15`, we need to sum values between 7 and 15 inclusive.

**Step-by-step traversal:**

1. Start at root (10). 10 is within [7,15], so we add it to our sum.
2. Check left child (5). Since 5 < low (7), we know ALL values in 5's left subtree (3) are also < low, so we can skip that entire subtree. However, 5's right subtree (7) might contain valid values, so we must explore it.
3. Check node 7. 7 is within range, so add it to sum.
4. Back to root's right child (15). 15 is within range, so add it.
5. Check 15's left child (none). Check 15's right child (18). Since 18 > high (15), we know ALL values in 18's subtree are > high, so we skip it.

Our sum = 10 + 7 + 15 = 32.

This demonstrates the pruning power: we skipped node 3 entirely because its parent (5) was already below our range, and we skipped exploring 18's descendants because 18 was above our range.

## Brute Force Approach

A naive approach would be to traverse every node in the tree (using any traversal: inorder, preorder, postorder, or level-order) and add values that fall within `[low, high]`. While this would give the correct answer, it visits every single node regardless of their values.

**Why this is inefficient:** In a balanced BST with `n` nodes, the brute force takes O(n) time. However, we can do better by leveraging BST properties to skip irrelevant subtrees. In the worst case (when the range covers most values), we still visit O(n) nodes, but in many practical cases we can prune significantly.

Here's what the brute force DFS looks like:

```python
def rangeSumBST(root, low, high):
    if not root:
        return 0
    total = 0
    if low <= root.val <= high:
        total += root.val
    total += rangeSumBST(root.left, low, high)
    total += rangeSumBST(root.right, low, high)
    return total
```

This approach works but doesn't use BST properties at all—it treats the tree as a regular binary tree.

## Optimal Solution

The optimal solution uses DFS with pruning. At each node:

1. If the node is `None`, return 0 (base case).
2. If the node's value is less than `low`, we only need to check the right subtree (since all left subtree values will be even smaller).
3. If the node's value is greater than `high`, we only need to check the left subtree (since all right subtree values will be even larger).
4. Otherwise (node's value is within range), add the node's value and check both subtrees.

This approach is essentially a modified DFS that prunes irrelevant branches based on BST ordering.

<div class="code-group">

```python
# Time: O(n) worst case, but O(k + log n) average where k is number of nodes in range
# Space: O(h) where h is the height of the tree (recursion stack)
class Solution:
    def rangeSumBST(self, root: Optional[TreeNode], low: int, high: int) -> int:
        # Base case: empty node contributes 0 to sum
        if not root:
            return 0

        # If current node's value is less than low, all values in left subtree
        # will be even smaller (BST property), so we only need to check right subtree
        if root.val < low:
            return self.rangeSumBST(root.right, low, high)

        # If current node's value is greater than high, all values in right subtree
        # will be even larger, so we only need to check left subtree
        if root.val > high:
            return self.rangeSumBST(root.left, low, high)

        # Current node's value is within [low, high]
        # Add current value and check both subtrees (both could contain valid values)
        return (root.val +
                self.rangeSumBST(root.left, low, high) +
                self.rangeSumBST(root.right, low, high))
```

```javascript
// Time: O(n) worst case, but O(k + log n) average where k is number of nodes in range
// Space: O(h) where h is the height of the tree (recursion stack)
function rangeSumBST(root, low, high) {
  // Base case: null node contributes 0 to sum
  if (root === null) {
    return 0;
  }

  // If current node's value is less than low, all left subtree values
  // are smaller (BST property), so only check right subtree
  if (root.val < low) {
    return rangeSumBST(root.right, low, high);
  }

  // If current node's value is greater than high, all right subtree values
  // are larger, so only check left subtree
  if (root.val > high) {
    return rangeSumBST(root.left, low, high);
  }

  // Current node's value is within [low, high]
  // Add current value and check both subtrees
  return root.val + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
}
```

```java
// Time: O(n) worst case, but O(k + log n) average where k is number of nodes in range
// Space: O(h) where h is the height of the tree (recursion stack)
class Solution {
    public int rangeSumBST(TreeNode root, int low, int high) {
        // Base case: null node contributes 0 to sum
        if (root == null) {
            return 0;
        }

        // If current node's value is less than low, all left subtree values
        // are smaller (BST property), so only check right subtree
        if (root.val < low) {
            return rangeSumBST(root.right, low, high);
        }

        // If current node's value is greater than high, all right subtree values
        // are larger, so only check left subtree
        if (root.val > high) {
            return rangeSumBST(root.left, low, high);
        }

        // Current node's value is within [low, high]
        // Add current value and check both subtrees
        return root.val +
               rangeSumBST(root.left, low, high) +
               rangeSumBST(root.right, low, high);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Worst case:** O(n) when the range covers almost all nodes (e.g., `low` = minimum value, `high` = maximum value), or when the tree is degenerate (linked list).
- **Best case:** O(log n) when the range is very narrow and we can prune aggressively in a balanced tree.
- **Average case:** O(k + log n) where `k` is the number of nodes in the range. We visit nodes on the path to the range boundaries (log n) plus all nodes within the range.

**Space Complexity:**

- **Recursive solution:** O(h) where `h` is the height of the tree. This is the recursion stack depth.
  - Balanced tree: O(log n)
  - Degenerate tree (linked list): O(n)
- **Iterative solution (using stack):** Also O(h) for the stack storage.

## Common Mistakes

1. **Forgetting BST properties and traversing all nodes:** Some candidates treat this as a regular binary tree problem and visit every node. While this gives the correct answer, it misses the optimization opportunity. Always ask yourself: "Am I using the BST ordering property?"

2. **Incorrect pruning conditions:** A common error is to only check if `root.val < low` and then explore both subtrees anyway. Remember: if `root.val < low`, ALL values in the left subtree are guaranteed to be `< low` due to BST property. Similarly, if `root.val > high`, all right subtree values are `> high`.

3. **Off-by-one errors with range boundaries:** The problem specifies an _inclusive_ range `[low, high]`. Make sure your conditions use `<=` and `>=` appropriately. The solution above uses `<` and `>` for pruning because when `root.val == low`, we still need to check the left subtree (there could be other values equal to `low` in the left subtree if duplicates are allowed? Actually in BST, duplicates are typically not allowed, but it's safer to check).

4. **Not handling null/empty tree:** Always check for `root == null` as the first base case. This also handles leaf nodes' children.

## When You'll See This Pattern

This "BST pruning" pattern appears whenever you need to search or process nodes in a BST within certain constraints:

1. **Closest Binary Search Tree Value (LeetCode 270)** - Find the value in BST closest to a target. You prune subtrees that cannot contain closer values.
2. **Trim a Binary Search Tree (LeetCode 669)** - Remove nodes outside a range, requiring similar pruning logic.
3. **Search in a Binary Search Tree (LeetCode 700)** - Classic BST search that prunes one subtree at each step.
4. **Validate Binary Search Tree (LeetCode 98)** - While different in goal, it uses the BST property to validate node ranges.

The core idea is always the same: use the BST ordering property (`left < root < right`) to eliminate irrelevant portions of the tree from consideration.

## Key Takeaways

1. **BST ordering enables pruning:** When a node's value is outside your target range, you can eliminate an entire subtree from further consideration. This turns O(n) traversal into something more efficient.

2. **Think in terms of value ranges, not just individual values:** For problems involving BSTs, consider what ranges of values can exist in each subtree. If the entire possible range of a subtree falls outside your target, skip it entirely.

3. **Recursive structure fits tree problems naturally:** The "check current node, then recurse on relevant children" pattern appears in many tree problems. The pruning just modifies which children you recurse on.

[Practice this problem on CodeJeet](/problem/range-sum-of-bst)
