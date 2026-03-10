---
title: "How to Solve Same Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Same Tree. Easy difficulty, 66.7% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2026-03-20"
category: "dsa-patterns"
tags: ["same-tree", "tree", "depth-first-search", "breadth-first-search", "easy"]
---

# How to Solve Same Tree

At first glance, checking if two binary trees are identical seems straightforward: just compare them node by node. What makes this problem interesting is that it introduces fundamental tree traversal concepts in a clean, focused way. You'll need to understand both structural equality (same shape) and value equality (same content), which requires careful handling of edge cases like empty trees and mismatched structures.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider these two trees:

```
Tree p:        Tree q:
    1              1
   / \            / \
  2   3          2   3
```

**Step 1:** Compare root nodes (1 vs 1) → values match ✓  
**Step 2:** Compare left subtrees:

- Compare left children (2 vs 2) → values match ✓
- Both left children have no children → left subtrees identical ✓

**Step 3:** Compare right subtrees:

- Compare right children (3 vs 3) → values match ✓
- Both right children have no children → right subtrees identical ✓

**Result:** Trees are identical.

Now consider a case where they differ:

```
Tree p:        Tree q:
    1              1
   / \            / \
  2   3          2   4
```

**Step 1:** Compare root nodes (1 vs 1) → values match ✓  
**Step 2:** Compare left subtrees (2 vs 2) → values match ✓  
**Step 3:** Compare right subtrees (3 vs 4) → values differ ✗

**Result:** Trees are not identical.

The key insight is that we need to check three things at each node:

1. Are both nodes null? (base case for identical empty subtrees)
2. Is only one node null? (structural mismatch)
3. Do the values match? (value mismatch)

## Brute Force Approach

There isn't really a "brute force" alternative for this problem since any solution must examine every node. However, a naive approach might try to serialize both trees to strings and compare the strings. While this would technically work, it's inefficient in both time and space compared to the optimal solution.

What some candidates might incorrectly try is comparing just the root values and assuming the trees are identical, or only checking a few levels deep. These approaches fail because they don't verify the complete structure and values throughout the entire tree.

## Optimal Solution

The optimal solution uses recursion to traverse both trees simultaneously. At each step, we check if the current nodes are both null (identical empty subtrees), if only one is null (structural mismatch), or if their values differ. If all checks pass, we recursively check the left and right subtrees.

<div class="code-group">

```python
# Time: O(n) where n is the number of nodes in the smaller tree
# Space: O(h) where h is the height of the tree (recursion stack)
def isSameTree(p, q):
    """
    Check if two binary trees are identical.

    Args:
        p: Root node of first tree
        q: Root node of second tree

    Returns:
        True if trees are identical, False otherwise
    """
    # Base case 1: Both nodes are None → identical empty trees
    if not p and not q:
        return True

    # Base case 2: One node is None, other isn't → structural mismatch
    if not p or not q:
        return False

    # Base case 3: Values differ → content mismatch
    if p.val != q.val:
        return False

    # Recursive case: Check left and right subtrees
    # Both must be identical for the trees to be identical
    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)
```

```javascript
// Time: O(n) where n is the number of nodes in the smaller tree
// Space: O(h) where h is the height of the tree (recursion stack)
function isSameTree(p, q) {
  /**
   * Check if two binary trees are identical.
   *
   * @param {TreeNode} p - Root node of first tree
   * @param {TreeNode} q - Root node of second tree
   * @return {boolean} True if trees are identical, False otherwise
   */

  // Base case 1: Both nodes are null → identical empty trees
  if (p === null && q === null) {
    return true;
  }

  // Base case 2: One node is null, other isn't → structural mismatch
  if (p === null || q === null) {
    return false;
  }

  // Base case 3: Values differ → content mismatch
  if (p.val !== q.val) {
    return false;
  }

  // Recursive case: Check left and right subtrees
  // Both must be identical for the trees to be identical
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
```

```java
// Time: O(n) where n is the number of nodes in the smaller tree
// Space: O(h) where h is the height of the tree (recursion stack)
public boolean isSameTree(TreeNode p, TreeNode q) {
    /**
     * Check if two binary trees are identical.
     *
     * @param p Root node of first tree
     * @param q Root node of second tree
     * @return True if trees are identical, False otherwise
     */

    // Base case 1: Both nodes are null → identical empty trees
    if (p == null && q == null) {
        return true;
    }

    // Base case 2: One node is null, other isn't → structural mismatch
    if (p == null || q == null) {
        return false;
    }

    // Base case 3: Values differ → content mismatch
    if (p.val != q.val) {
        return false;
    }

    // Recursive case: Check left and right subtrees
    // Both must be identical for the trees to be identical
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
```

</div>

**Alternative Iterative Solution:** You can also solve this problem iteratively using a stack or queue (BFS). The iterative approach avoids recursion overhead and is useful for very deep trees that might cause stack overflow. Here's a BFS version:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the queue
def isSameTreeIterative(p, q):
    """
    Iterative BFS approach to check tree equality.
    """
    from collections import deque

    queue = deque([(p, q)])

    while queue:
        node1, node2 = queue.popleft()

        # Both None → continue checking other nodes
        if not node1 and not node2:
            continue

        # One None, other not None → mismatch
        if not node1 or not node2:
            return False

        # Values differ → mismatch
        if node1.val != node2.val:
            return False

        # Add children to queue for comparison
        queue.append((node1.left, node2.left))
        queue.append((node1.right, node2.right))

    return True
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the smaller tree. We visit each node exactly once in both trees. In the worst case, we compare all nodes before finding a mismatch or confirming equality.

**Space Complexity:**

- **Recursive solution:** O(h) where h is the height of the tree. This is the maximum depth of the recursion stack. In the worst case (skewed tree), h = n, giving O(n) space. In the best case (balanced tree), h = log n.
- **Iterative solution:** O(n) for the queue in the worst case, as we might need to store all nodes at the widest level of the tree.

## Common Mistakes

1. **Forgetting to check for null nodes before accessing values:** This is the most common error. Always check `if not p or not q:` before comparing `p.val != q.val`, otherwise you'll get a null pointer exception.

2. **Incorrect base case order:** The order of checks matters! Check `both null` first, then `one null`, then `values differ`. If you check values first, you'll crash on null nodes.

3. **Using OR instead of AND in the recursive call:** The trees are identical only if BOTH left subtrees AND right subtrees are identical. Using `or` would incorrectly return true if only one subtree matches.

4. **Assuming trees with same values but different structures are identical:** For example, trees `[1,2]` and `[1,null,2]` have the same values but different structures. Your solution must catch this by checking structural equality at each step.

## When You'll See This Pattern

This "simultaneous tree traversal" pattern appears in many tree comparison problems:

1. **Symmetric Tree (LeetCode 101):** Check if a tree is symmetric around its center. The solution involves comparing left and right subtrees similarly to Same Tree, but with mirrored comparisons.

2. **Subtree of Another Tree (LeetCode 572):** Determine if one tree is a subtree of another. You can reuse the Same Tree function to check if any subtree matches the target tree.

3. **Merge Two Binary Trees (LeetCode 617):** Merge two trees by summing overlapping nodes. The traversal logic is similar, but instead of comparing, you're creating new nodes.

The core pattern is: traverse two trees simultaneously, handle null cases carefully, and combine results from subtrees appropriately (using AND, OR, or other operations).

## Key Takeaways

1. **Tree comparison requires simultaneous traversal:** When comparing two trees, you typically traverse them together, checking corresponding nodes at each step.

2. **Handle null cases first:** Always check for null nodes before accessing their values or children. The standard pattern is: check both null → check one null → check values → recurse.

3. **Recursive tree problems often have simple base cases and clean recursive cases:** This problem exemplifies the elegance of recursive tree solutions. The base cases handle the simple scenarios, and the recursive case combines results from subtrees.

[Practice this problem on CodeJeet](/problem/same-tree)
