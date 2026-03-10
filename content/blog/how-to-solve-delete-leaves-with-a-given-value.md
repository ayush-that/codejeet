---
title: "How to Solve Delete Leaves With a Given Value — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Delete Leaves With a Given Value. Medium difficulty, 77.3% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2028-05-02"
category: "dsa-patterns"
tags: ["delete-leaves-with-a-given-value", "tree", "depth-first-search", "binary-tree", "medium"]
---

## Brief Problem Restatement

We're given a binary tree and a target integer value. We need to delete all leaf nodes (nodes with no children) that have the value equal to the target. The tricky part is that after deleting a leaf, its parent might become a new leaf node, and if that parent also has the target value, we need to delete it too. This creates a chain reaction where deletions can propagate upward through the tree.

What makes this problem interesting is that we can't simply do a single pass from top to bottom—we need to handle the bottom-up nature of the deletions. The parent's status depends on what happens to its children, which requires post-order processing.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Tree:**

```
       1
     /   \
    2     3
   / \   /
  2   2 2
```

**Target:** 2

**Step-by-step process:**

1. Start at the leftmost leaf (value 2). It's a leaf with target value → delete it.
2. Move to the middle leaf (value 2). It's a leaf with target value → delete it.
3. Now their parent (value 2) has lost both children and becomes a leaf. It has target value → delete it.
4. Move to the right subtree's leaf (value 2). It's a leaf with target value → delete it.
5. Now its parent (value 3) becomes a leaf, but value 3 ≠ target → keep it.
6. Final tree:

```
       1
         \
          3
```

The key insight: we need to process children before parents to know if a parent becomes a leaf. This naturally suggests a post-order traversal (left → right → root).

## Brute Force Approach

A naive approach might try to repeatedly scan the tree from top to bottom, deleting leaves with the target value in each pass until no more deletions occur:

1. Perform a level-order traversal to find all current leaves
2. Delete those with value equal to target
3. Repeat until no deletions occur in a pass

**Why this is inefficient:**

- Each pass requires O(n) time to scan the entire tree
- In the worst case (a chain of nodes all with target value), we might need O(n) passes
- This gives O(n²) time complexity, which is unacceptable for large trees
- The approach also requires extra bookkeeping to track which nodes become leaves after deletions

The brute force fails because it doesn't leverage the natural bottom-up structure of the problem. We're essentially rediscovering the same information repeatedly instead of computing it once in the optimal order.

## Optimized Approach

The key insight is that we need to process nodes **after** we know what happens to their children. This is exactly what post-order traversal provides:

1. Recursively process the left subtree
2. Recursively process the right subtree
3. Only then examine the current node

At step 3, we know:

- Whether the left child was deleted (it will be `null`)
- Whether the right child was deleted (it will be `null`)
- If both children are `null`, the current node is now a leaf
- If the current node is a leaf and has the target value, we should delete it (return `null` to its parent)

This approach naturally handles the chain reaction: when we return `null` for a deleted node, its parent sees that child as gone, which might make the parent a leaf, triggering further deletions.

The recursion does all the work for us—we just need to implement the base case and the post-order logic correctly.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is number of nodes in the tree
# Space: O(h) where h is the height of the tree (recursion stack)
def removeLeafNodes(root, target):
    """
    Delete all leaf nodes with value equal to target.
    After deletion, if a parent becomes a leaf with target value,
    it should also be deleted (propagate upward).

    Args:
        root: TreeNode - root of the binary tree
        target: int - value to match for deletion

    Returns:
        TreeNode - new root after deletions (may be None)
    """
    # Base case: empty tree
    if root is None:
        return None

    # Post-order traversal: process children first
    # Recursively process left subtree
    root.left = removeLeafNodes(root.left, target)
    # Recursively process right subtree
    root.right = removeLeafNodes(root.right, target)

    # After processing children, check if current node is now a leaf
    # A node is a leaf if it has no left AND no right child
    if root.left is None and root.right is None:
        # Check if this leaf has the target value
        if root.val == target:
            # Delete this node by returning None to parent
            return None

    # If not deleted, return the node (with potentially updated children)
    return root
```

```javascript
// Time: O(n) where n is number of nodes in the tree
// Space: O(h) where h is the height of the tree (recursion stack)
function removeLeafNodes(root, target) {
  /**
   * Delete all leaf nodes with value equal to target.
   * After deletion, if a parent becomes a leaf with target value,
   * it should also be deleted (propagate upward).
   *
   * @param {TreeNode} root - root of the binary tree
   * @param {number} target - value to match for deletion
   * @return {TreeNode} - new root after deletions (may be null)
   */

  // Base case: empty tree
  if (root === null) {
    return null;
  }

  // Post-order traversal: process children first
  // Recursively process left subtree
  root.left = removeLeafNodes(root.left, target);
  // Recursively process right subtree
  root.right = removeLeafNodes(root.right, target);

  // After processing children, check if current node is now a leaf
  // A node is a leaf if it has no left AND no right child
  if (root.left === null && root.right === null) {
    // Check if this leaf has the target value
    if (root.val === target) {
      // Delete this node by returning null to parent
      return null;
    }
  }

  // If not deleted, return the node (with potentially updated children)
  return root;
}
```

```java
// Time: O(n) where n is number of nodes in the tree
// Space: O(h) where h is the height of the tree (recursion stack)
class Solution {
    public TreeNode removeLeafNodes(TreeNode root, int target) {
        /**
         * Delete all leaf nodes with value equal to target.
         * After deletion, if a parent becomes a leaf with target value,
         * it should also be deleted (propagate upward).
         *
         * @param root - root of the binary tree
         * @param target - value to match for deletion
         * @return TreeNode - new root after deletions (may be null)
         */

        // Base case: empty tree
        if (root == null) {
            return null;
        }

        // Post-order traversal: process children first
        // Recursively process left subtree
        root.left = removeLeafNodes(root.left, target);
        // Recursively process right subtree
        root.right = removeLeafNodes(root.right, target);

        // After processing children, check if current node is now a leaf
        // A node is a leaf if it has no left AND no right child
        if (root.left == null && root.right == null) {
            // Check if this leaf has the target value
            if (root.val == target) {
                // Delete this node by returning null to parent
                return null;
            }
        }

        // If not deleted, return the node (with potentially updated children)
        return root;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once in the post-order traversal
- Each node's processing (checking if it's a leaf and comparing value) takes O(1) time
- Total time is proportional to the number of nodes in the tree

**Space Complexity: O(h)**

- The space is dominated by the recursion call stack
- In the worst case (skewed tree), h = n, so O(n)
- In the best case (balanced tree), h = log n, so O(log n)
- The algorithm uses only a constant amount of extra space beyond the recursion stack

## Common Mistakes

1. **Using pre-order or in-order traversal instead of post-order**
   - Mistake: Checking if a node is a leaf before processing its children
   - Result: Parents might be deleted before we know if children were deleted, missing the chain reaction
   - Fix: Always use post-order (children first, then parent) for bottom-up problems

2. **Forgetting to update child pointers after recursion**
   - Mistake: Calling `removeLeafNodes(root.left, target)` but not assigning the result back to `root.left`
   - Result: Deletions don't propagate upward because parent still references deleted children
   - Fix: Always assign the recursive result: `root.left = removeLeafNodes(root.left, target)`

3. **Incorrect leaf detection logic**
   - Mistake: Checking `if not root.left or not root.right` instead of `if not root.left and not root.right`
   - Result: Nodes with one child get incorrectly classified as leaves
   - Fix: A leaf must have BOTH children as null

4. **Not handling the case where the entire tree gets deleted**
   - Mistake: Assuming the root will never be deleted
   - Result: Returning the original root when it should be null
   - Fix: The algorithm naturally handles this—if root gets deleted, we return null

## When You'll See This Pattern

This post-order traversal pattern appears whenever you need to compute something for a parent based on its children's results. Look for these clues:

1. **"Bottom-up" requirements** - The problem asks for information that propagates upward from leaves to root
2. **Parent's state depends on children** - You can't determine a node's fate without knowing what happens to its children
3. **Tree modification based on subtree properties** - You need to transform the tree based on conditions that depend on subtrees

**Related LeetCode problems:**

1. **Binary Tree Pruning (LeetCode 814)** - Almost identical pattern: remove subtrees that don't contain 1
2. **Evaluate Boolean Binary Tree (LeetCode 2331)** - Post-order evaluation where leaves are values and internal nodes are operators
3. **Maximum Depth of Binary Tree (LeetCode 104)** - Classic post-order: depth = 1 + max(left_depth, right_depth)

## Key Takeaways

1. **Post-order traversal is the natural choice for bottom-up tree problems** - When a parent's outcome depends on its children's results, process children first (post-order: left → right → root).

2. **Tree deletion problems often use the "return null" pattern** - Instead of physically deleting nodes, we return `null` to the parent, which updates the parent's child pointer. This is cleaner than trying to modify the tree in place.

3. **The recursion handles the chain reaction automatically** - By properly implementing the base case and recursive case, the upward propagation of deletions happens naturally without extra bookkeeping.

[Practice this problem on CodeJeet](/problem/delete-leaves-with-a-given-value)
