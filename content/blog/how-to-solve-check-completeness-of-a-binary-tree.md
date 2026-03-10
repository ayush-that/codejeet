---
title: "How to Solve Check Completeness of a Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Check Completeness of a Binary Tree. Medium difficulty, 59.0% acceptance rate. Topics: Tree, Breadth-First Search, Binary Tree."
date: "2027-12-08"
category: "dsa-patterns"
tags:
  ["check-completeness-of-a-binary-tree", "tree", "breadth-first-search", "binary-tree", "medium"]
---

# How to Solve Check Completeness of a Binary Tree

Determining if a binary tree is complete is a classic tree traversal problem with a subtle twist. A complete binary tree has all levels fully filled except possibly the last, where nodes must be packed to the left. The challenge lies in detecting when a gap appears in the last level—something that requires careful tracking during traversal.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this binary tree:

```
        1
       / \
      2   3
     / \   \
    4   5   6
```

**Step 1:** Start at root node 1. In a complete tree, after a node with no left child, we shouldn't see any more nodes.

**Step 2:** Process node 2 (left child of 1). Still no issues.

**Step 3:** Process node 3 (right child of 1). Still okay.

**Step 4:** Process node 4 (left child of 2). All good.

**Step 5:** Process node 5 (right child of 2). Still fine.

**Step 6:** Process node 6 (right child of 3). Here's the problem! Node 3 has no left child, but it has a right child. In a complete tree, if a parent has no left child, it shouldn't have a right child either. More precisely, once we encounter a missing node (null), all subsequent nodes must also be null.

The key insight: In a level-order traversal of a complete tree, once we see a null node, we shouldn't see any more non-null nodes.

## Brute Force Approach

A naive approach might try to check each level individually:

1. Perform BFS to get all nodes level by level
2. For each level except the last, check if it has 2^level nodes
3. For the last level, check if nodes are left-aligned

However, this gets messy because we need to handle the last level specially. We'd need to track when we reach the last level and verify left-alignment. The implementation becomes complex with many edge cases.

More importantly, this approach doesn't efficiently detect early violations. We might traverse the entire tree before realizing it's incomplete. While the time complexity would still be O(n), the implementation is unnecessarily complicated and error-prone.

## Optimized Approach

The optimal solution uses level-order traversal (BFS) with a clever observation: **In a complete binary tree, during BFS, once we encounter a null node, all remaining nodes in the queue must also be null.**

Here's the step-by-step reasoning:

1. **Use BFS (level-order traversal)** because completeness is about level filling
2. **Track when we first see a null node** - this is our "gap" indicator
3. **After seeing a null, check all remaining nodes** - if any non-null appears, the tree is incomplete
4. **Include null children in the queue** - unlike normal BFS where we skip nulls, here we need to detect gaps

Why this works: In a complete tree, nodes are packed tightly from left to right. If there's a gap (null) at position i, then position i+1, i+2, etc., should also be null because all nodes after a gap would be in the next level, violating completeness.

## Optimal Solution

Here's the implementation using BFS with null tracking:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes | Space: O(n) for the queue
def isCompleteTree(root):
    """
    Check if a binary tree is complete using BFS.
    A tree is complete if all levels are fully filled except possibly
    the last, which must be left-aligned.
    """
    if not root:
        return True  # Empty tree is complete by definition

    from collections import deque

    queue = deque([root])
    found_null = False  # Flag to track if we've seen a null node

    while queue:
        node = queue.popleft()

        if node is None:
            # First time seeing a null node
            found_null = True
        else:
            # If we've already seen a null before, but now we see a non-null node
            # This violates the completeness property
            if found_null:
                return False

            # Add both children to queue (even if they're null)
            # We need to detect gaps, so we include nulls
            queue.append(node.left)
            queue.append(node.right)

    return True
```

```javascript
// Time: O(n) where n is number of nodes | Space: O(n) for the queue
function isCompleteTree(root) {
  /**
   * Check if a binary tree is complete using BFS.
   * A tree is complete if all levels are fully filled except possibly
   * the last, which must be left-aligned.
   */
  if (!root) return true; // Empty tree is complete by definition

  const queue = [root];
  let foundNull = false; // Flag to track if we've seen a null node

  while (queue.length > 0) {
    const node = queue.shift();

    if (node === null) {
      // First time seeing a null node
      foundNull = true;
    } else {
      // If we've already seen a null before, but now we see a non-null node
      // This violates the completeness property
      if (foundNull) return false;

      // Add both children to queue (even if they're null)
      // We need to detect gaps, so we include nulls
      queue.push(node.left);
      queue.push(node.right);
    }
  }

  return true;
}
```

```java
// Time: O(n) where n is number of nodes | Space: O(n) for the queue
public boolean isCompleteTree(TreeNode root) {
    /**
     * Check if a binary tree is complete using BFS.
     * A tree is complete if all levels are fully filled except possibly
     * the last, which must be left-aligned.
     */
    if (root == null) return true;  // Empty tree is complete by definition

    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    boolean foundNull = false;  // Flag to track if we've seen a null node

    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();

        if (node == null) {
            // First time seeing a null node
            foundNull = true;
        } else {
            // If we've already seen a null before, but now we see a non-null node
            // This violates the completeness property
            if (foundNull) return false;

            // Add both children to queue (even if they're null)
            // We need to detect gaps, so we include nulls
            queue.offer(node.left);
            queue.offer(node.right);
        }
    }

    return true;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the tree. We visit each node exactly once in the BFS traversal.

**Space Complexity:** O(n) in the worst case. The queue can hold up to n/2 nodes (the last level of a complete tree), which gives us O(n) space. In the best case (a perfectly balanced tree), it's O(n) as well since we still process all nodes.

The linear time is optimal because we must examine every node to verify completeness. The space is also optimal for BFS since we need to process nodes level by level.

## Common Mistakes

1. **Not including nulls in the queue:** The most common error is doing normal BFS where you skip null children. For this problem, you MUST add null children to detect gaps. If you skip them, you can't distinguish between "no right child" and "gap in the middle."

2. **Checking levels separately:** Some candidates try to check each level's node count. This gets complicated with the last level and requires calculating expected node counts (2^level). The BFS with null detection is simpler and more robust.

3. **Forgetting the empty tree case:** An empty tree (root is null) is technically a complete binary tree. Always handle this edge case at the beginning.

4. **Incorrect gap detection logic:** The logic must be: once we see ANY null, ALL subsequent nodes (including those already in the queue) must be null. A common mistake is to only check immediate neighbors instead of all remaining nodes.

## When You'll See This Pattern

This BFS-with-null-detection pattern appears in several tree problems:

1. **Serialize and Deserialize Binary Tree (LeetCode 297):** Uses similar BFS with null inclusion to represent tree structure.

2. **Binary Tree Level Order Traversal (LeetCode 102):** The basic BFS pattern without null tracking is foundational.

3. **Populating Next Right Pointers in Each Node (LeetCode 116):** Also uses level-order traversal to connect nodes across the same level.

The core pattern is: **When tree structure matters (not just values), include nulls in BFS to preserve positional information.**

## Key Takeaways

1. **Completeness is about node positions, not values:** The check focuses on whether nodes fill levels left-to-right without gaps, regardless of their values.

2. **BFS with null inclusion is key:** Unlike most BFS problems where you skip nulls, here you need to process them to detect structural gaps.

3. **The "gap detection" trick:** Once a null appears in level-order traversal of a complete tree, everything after must also be null. This simple check replaces complex level-by-level validation.

Remember: For tree problems involving structure or positioning, consider whether including nulls in your traversal would help detect patterns or violations.

[Practice this problem on CodeJeet](/problem/check-completeness-of-a-binary-tree)
