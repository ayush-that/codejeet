---
title: "How to Solve Subtree of Another Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Subtree of Another Tree. Easy difficulty, 51.3% acceptance rate. Topics: Tree, Depth-First Search, String Matching, Binary Tree, Hash Function."
date: "2026-08-29"
category: "dsa-patterns"
tags: ["subtree-of-another-tree", "tree", "depth-first-search", "string-matching", "easy"]
---

# How to Solve Subtree of Another Tree

This problem asks us to determine if one binary tree (`subRoot`) is a subtree of another binary tree (`root`). A subtree means the entire structure and values must match exactly starting from some node in the main tree. What makes this problem interesting is that we need to check not just if the trees are identical, but if there exists _any_ node in the main tree where the subtree rooted at that node matches the entire target tree.

## Visual Walkthrough

Let's trace through a concrete example:

```
Main tree (root):
      3
     / \
    4   5
   / \
  1   2

Subtree (subRoot):
    4
   / \
  1   2
```

**Step 1:** Start at root node 3. Compare the subtree rooted at 3 with subRoot:

- 3 ≠ 4 → Not a match

**Step 2:** Move to left child 4. Compare subtree rooted at 4 with subRoot:

- Root values match (4 = 4)
- Compare left children: 1 = 1
- Compare right children: 2 = 2
- All nodes match → Found a subtree!

If we had a more complex case where the main tree was:

```
      3
     / \
    4   5
   / \
  1   2
     /
    0
```

And we were still looking for the same subRoot (4,1,2), we'd need to check:

- Node 3: no match
- Node 4: match! (even though node 4 has an extra child 0 in the main tree, the subtree rooted at 4 in the main tree has the exact structure 4,1,2)

The key insight is that we need to check _every_ node in the main tree as a potential starting point for our comparison.

## Brute Force Approach

The most straightforward approach is to:

1. Traverse the main tree (using DFS or BFS)
2. For each node, check if the subtree rooted at that node is identical to the target tree
3. Return true if any comparison succeeds

The "are trees identical" check is itself a recursive function that compares:

- Current node values
- Left subtrees recursively
- Right subtrees recursively

This brute force approach is actually optimal for this problem! The reason is that in the worst case, we might need to compare the target tree against every node in the main tree. However, many candidates try to optimize prematurely or make implementation errors that lead to incorrect solutions.

Let's see what makes the brute force solution work and where candidates typically stumble.

## Optimal Solution

The optimal solution uses DFS to traverse the main tree. At each node, we check if the subtree starting there matches the target tree. We need two recursive functions:

1. `isSubtree(root, subRoot)` - traverses the main tree
2. `isSameTree(p, q)` - checks if two trees are identical

<div class="code-group">

```python
# Time: O(m * n) where m = nodes in root, n = nodes in subRoot
# Space: O(h) where h = height of root (recursion stack)
class Solution:
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        # Edge case: if subRoot is empty, it's always a subtree (by definition)
        if not subRoot:
            return True
        # If root is empty but subRoot isn't, can't be a subtree
        if not root:
            return False

        # Check if trees rooted at current node are identical
        if self.isSameTree(root, subRoot):
            return True

        # If not, check left and right subtrees recursively
        # We use OR because we only need one match anywhere
        return (self.isSubtree(root.left, subRoot) or
                self.isSubtree(root.right, subRoot))

    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        # Both nodes are None -> identical
        if not p and not q:
            return True
        # One is None, other isn't -> not identical
        if not p or not q:
            return False
        # Values don't match -> not identical
        if p.val != q.val:
            return False

        # Recursively check left and right subtrees
        # Both must match for trees to be identical
        return (self.isSameTree(p.left, q.left) and
                self.isSameTree(p.right, q.right))
```

```javascript
// Time: O(m * n) where m = nodes in root, n = nodes in subRoot
// Space: O(h) where h = height of root (recursion stack)
var isSubtree = function (root, subRoot) {
  // Edge case: empty subRoot is always a subtree
  if (!subRoot) return true;
  // If root is empty but subRoot isn't, can't be a subtree
  if (!root) return false;

  // Check if trees starting at current node match
  if (isSameTree(root, subRoot)) {
    return true;
  }

  // If not, search in left and right subtrees
  // Use OR because we need only one match
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
};

function isSameTree(p, q) {
  // Both null -> identical
  if (!p && !q) return true;
  // One null, other not -> not identical
  if (!p || !q) return false;
  // Values differ -> not identical
  if (p.val !== q.val) return false;

  // Both left and right subtrees must match
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
```

```java
// Time: O(m * n) where m = nodes in root, n = nodes in subRoot
// Space: O(h) where h = height of root (recursion stack)
class Solution {
    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        // Edge case: empty subtree is always a subtree
        if (subRoot == null) return true;
        // If main tree is empty but subtree isn't, no match
        if (root == null) return false;

        // Check if trees starting from current node match
        if (isSameTree(root, subRoot)) {
            return true;
        }

        // Recursively check left and right subtrees
        // Only need one match, so use OR
        return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
    }

    private boolean isSameTree(TreeNode p, TreeNode q) {
        // Both null -> identical
        if (p == null && q == null) return true;
        // One null, other not -> not identical
        if (p == null || q == null) return false;
        // Values don't match -> not identical
        if (p.val != q.val) return false;

        // Both subtrees must match
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}
```

</div>

**Key implementation details:**

1. The base cases handle null pointers correctly
2. `isSubtree` uses OR between left and right recursive calls because we only need one match
3. `isSameTree` uses AND between left and right recursive calls because both subtrees must match
4. Order matters: check `isSameTree` first, then recurse to children

## Complexity Analysis

**Time Complexity:** O(m × n) in the worst case, where m is the number of nodes in `root` and n is the number of nodes in `subRoot`.

Why? In the worst case:

- We visit every node in the main tree (m nodes)
- For each node, we might compare against the entire subtree (n nodes)
- This gives us m × n comparisons

However, in practice it's often better because:

- We short-circuit when values don't match
- The subtree is usually smaller than the main tree
- We stop searching once we find a match

**Space Complexity:** O(h) where h is the height of the main tree. This is the maximum depth of the recursion stack. In the worst case (skewed tree), this is O(m). In a balanced tree, it's O(log m).

## Common Mistakes

1. **Incorrect null handling in `isSameTree`**: The most common error is not checking the `(p == null || q == null)` case separately from the `(p == null && q == null)` case. If you only check `if (!p && !q) return true` and then proceed to compare values, you'll get a null pointer exception when one tree has a node and the other doesn't.

2. **Using AND instead of OR in `isSubtree`**: Some candidates write `return isSubtree(root.left, subRoot) && isSubtree(root.right, subRoot)`. This is wrong! We need to check if the subtree exists in EITHER the left OR right subtree, not both.

3. **Forgetting to handle empty subtree case**: By definition, an empty tree (null) is considered a subtree of any tree. Always check if `subRoot` is null and return true immediately.

4. **Comparing references instead of values**: When checking if nodes match, compare `node.val` not `node` itself. Nodes with the same value but different memory locations should still be considered equal for this problem.

## When You'll See This Pattern

This "tree comparison" pattern appears in several tree problems:

1. **Same Tree (LeetCode 100)** - The `isSameTree` function is literally this problem. It's a building block for many tree comparison problems.

2. **Symmetric Tree (LeetCode 101)** - Uses a similar recursive comparison, but compares mirror images (left with right, right with left).

3. **Merge Two Binary Trees (LeetCode 617)** - While not exactly the same, it uses similar tree traversal and node-by-node operations.

4. **Most Frequent Subtree Sum (LeetCode 508)** - Requires traversing all subtrees and computing their sums, similar to how we check all subtrees here.

The core pattern is: when you need to compare or process all subtrees, use DFS with a helper function that processes individual subtrees.

## Key Takeaways

1. **Tree comparison problems often need two recursive functions**: one to traverse the main tree, and another to compare subtree structures. Recognize when you need this pattern.

2. **Pay attention to boolean logic**: Use OR when searching for any match (like "exists in left OR right"), use AND when all conditions must be true (like "left AND right must match").

3. **Handle edge cases systematically**: Empty trees, single nodes, and skewed trees often reveal implementation bugs. Always test: both null, one null, same structure different values, same values different structure.

4. **This is actually an optimal solution**: Don't waste time looking for a better asymptotic complexity - O(m × n) is the best we can do in the worst case since we might need to compare every node.

Related problems: [Count Univalue Subtrees](/problem/count-univalue-subtrees), [Most Frequent Subtree Sum](/problem/most-frequent-subtree-sum)
