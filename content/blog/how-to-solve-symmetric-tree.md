---
title: "How to Solve Symmetric Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Symmetric Tree. Easy difficulty, 60.8% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2026-04-10"
category: "dsa-patterns"
tags: ["symmetric-tree", "tree", "depth-first-search", "breadth-first-search", "easy"]
---

# How to Solve Symmetric Tree

A symmetric tree is a binary tree that is a mirror image of itself around its center. This means the left subtree must be a mirror reflection of the right subtree. While this problem is categorized as "Easy," it's tricky because you need to compare two separate parts of the tree simultaneously, not just check if the tree is balanced or identical on both sides. The key insight is recognizing that symmetry requires comparing corresponding nodes in opposite subtrees.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this symmetric tree:

```
        1
       / \
      2   2
     / \ / \
    3  4 4  3
```

To check symmetry, we need to verify that:

1. The root's left child (2) equals the root's right child (2)
2. The left child's left child (3) equals the right child's right child (3)
3. The left child's right child (4) equals the right child's left child (4)

Here's the step-by-step comparison process:

1. **Compare root's children**: left=2, right=2 → match ✓
2. **Compare left.left (3) with right.right (3)** → match ✓
3. **Compare left.right (4) with right.left (4)** → match ✓

Now consider an asymmetric tree:

```
        1
       / \
      2   2
       \   \
       3    3
```

1. **Compare root's children**: left=2, right=2 → match ✓
2. **Compare left.right (3) with right.left (null)** → mismatch ✗ (3 ≠ null)

The pattern emerges: for symmetry, we must compare outer pairs (left.left with right.right) and inner pairs (left.right with right.left) recursively.

## Brute Force Approach

A naive approach might try to serialize each subtree and compare the serializations. For example:

1. Serialize the left subtree using pre-order traversal
2. Serialize the right subtree using reverse pre-order traversal (right before left)
3. Compare the two serializations

However, this approach has several issues:

- It requires O(n) extra space for the serializations
- The comparison step adds unnecessary overhead
- It doesn't handle the mirroring logic elegantly
- Edge cases with null values become complicated

The brute force would technically work but is inefficient in both time and space compared to the optimal solution.

## Optimal Solution

The optimal solution uses recursion to compare corresponding nodes in the tree. We create a helper function that takes two nodes and checks if they're mirrors of each other. The base cases handle null values, and the recursive step checks both value equality and the mirrored subtree comparisons.

<div class="code-group">

```python
# Time: O(n) where n is number of nodes in the tree
# Space: O(h) where h is height of the tree (recursion stack)
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isSymmetric(self, root: TreeNode) -> bool:
        # Edge case: empty tree is symmetric
        if not root:
            return True

        # Start comparing left and right subtrees
        return self.isMirror(root.left, root.right)

    def isMirror(self, left: TreeNode, right: TreeNode) -> bool:
        # Base case 1: both nodes are null
        if not left and not right:
            return True

        # Base case 2: one node is null, other is not
        if not left or not right:
            return False

        # Base case 3: values don't match
        if left.val != right.val:
            return False

        # Recursive case: check mirrored pairs
        # Outer pair: left.left with right.right
        # Inner pair: left.right with right.left
        return (self.isMirror(left.left, right.right) and
                self.isMirror(left.right, right.left))
```

```javascript
// Time: O(n) where n is number of nodes in the tree
// Space: O(h) where h is height of the tree (recursion stack)
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class Solution {
  isSymmetric(root) {
    // Edge case: empty tree is symmetric
    if (!root) {
      return true;
    }

    // Start comparing left and right subtrees
    return this.isMirror(root.left, root.right);
  }

  isMirror(left, right) {
    // Base case 1: both nodes are null
    if (!left && !right) {
      return true;
    }

    // Base case 2: one node is null, other is not
    if (!left || !right) {
      return false;
    }

    // Base case 3: values don't match
    if (left.val !== right.val) {
      return false;
    }

    // Recursive case: check mirrored pairs
    // Outer pair: left.left with right.right
    // Inner pair: left.right with right.left
    return this.isMirror(left.left, right.right) && this.isMirror(left.right, right.left);
  }
}
```

```java
// Time: O(n) where n is number of nodes in the tree
// Space: O(h) where h is height of the tree (recursion stack)
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    public boolean isSymmetric(TreeNode root) {
        // Edge case: empty tree is symmetric
        if (root == null) {
            return true;
        }

        // Start comparing left and right subtrees
        return isMirror(root.left, root.right);
    }

    private boolean isMirror(TreeNode left, TreeNode right) {
        // Base case 1: both nodes are null
        if (left == null && right == null) {
            return true;
        }

        // Base case 2: one node is null, other is not
        if (left == null || right == null) {
            return false;
        }

        // Base case 3: values don't match
        if (left.val != right.val) {
            return false;
        }

        // Recursive case: check mirrored pairs
        // Outer pair: left.left with right.right
        // Inner pair: left.right with right.left
        return isMirror(left.left, right.right) &&
               isMirror(left.right, right.left);
    }
}
```

</div>

## Iterative Solution

While recursion is elegant, an iterative approach using a queue or stack is also valid and avoids recursion stack overhead. Here's the iterative version:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes in the tree
# Space: O(n) for the queue in worst case
from collections import deque

class Solution:
    def isSymmetric(self, root: TreeNode) -> bool:
        if not root:
            return True

        # Use a queue to process nodes in pairs
        queue = deque()
        # Start with the pair of root's children
        queue.append((root.left, root.right))

        while queue:
            left, right = queue.popleft()

            # Both nodes are null - continue checking other pairs
            if not left and not right:
                continue

            # One node is null, other is not - not symmetric
            if not left or not right:
                return False

            # Values don't match - not symmetric
            if left.val != right.val:
                return False

            # Add the next pairs to check:
            # Outer pair: left.left with right.right
            # Inner pair: left.right with right.left
            queue.append((left.left, right.right))
            queue.append((left.right, right.left))

        # All pairs matched
        return True
```

```javascript
// Time: O(n) where n is number of nodes in the tree
// Space: O(n) for the queue in worst case
class Solution {
  isSymmetric(root) {
    if (!root) {
      return true;
    }

    // Use a queue to process nodes in pairs
    const queue = [];
    // Start with the pair of root's children
    queue.push([root.left, root.right]);

    while (queue.length > 0) {
      const [left, right] = queue.shift();

      // Both nodes are null - continue checking other pairs
      if (!left && !right) {
        continue;
      }

      // One node is null, other is not - not symmetric
      if (!left || !right) {
        return false;
      }

      // Values don't match - not symmetric
      if (left.val !== right.val) {
        return false;
      }

      // Add the next pairs to check:
      // Outer pair: left.left with right.right
      // Inner pair: left.right with right.left
      queue.push([left.left, right.right]);
      queue.push([left.right, right.left]);
    }

    // All pairs matched
    return true;
  }
}
```

```java
// Time: O(n) where n is number of nodes in the tree
// Space: O(n) for the queue in worst case
import java.util.LinkedList;
import java.util.Queue;

class Solution {
    public boolean isSymmetric(TreeNode root) {
        if (root == null) {
            return true;
        }

        // Use a queue to process nodes in pairs
        Queue<TreeNode[]> queue = new LinkedList<>();
        // Start with the pair of root's children
        queue.offer(new TreeNode[]{root.left, root.right});

        while (!queue.isEmpty()) {
            TreeNode[] pair = queue.poll();
            TreeNode left = pair[0];
            TreeNode right = pair[1];

            // Both nodes are null - continue checking other pairs
            if (left == null && right == null) {
                continue;
            }

            // One node is null, other is not - not symmetric
            if (left == null || right == null) {
                return false;
            }

            // Values don't match - not symmetric
            if (left.val != right.val) {
                return false;
            }

            // Add the next pairs to check:
            // Outer pair: left.left with right.right
            // Inner pair: left.right with right.left
            queue.offer(new TreeNode[]{left.left, right.right});
            queue.offer(new TreeNode[]{left.right, right.left});
        }

        // All pairs matched
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the tree. We visit each node exactly once in both recursive and iterative approaches.

**Space Complexity:**

- **Recursive approach:** O(h) where h is the height of the tree. This is the maximum depth of the recursion stack. In the worst case (skewed tree), h = n, giving O(n) space.
- **Iterative approach:** O(n) in the worst case when the tree is complete, as we might need to store all leaf nodes in the queue.

## Common Mistakes

1. **Comparing identical subtrees instead of mirrored subtrees:** The most common mistake is checking if `left.left == right.left` and `left.right == right.right` (identical comparison) instead of the correct mirrored comparison `left.left == right.right` and `left.right == right.left`.

2. **Incorrect handling of null values:** Forgetting to check if one node is null while the other isn't. Always check: if both are null → continue/symmetric; if one is null → not symmetric.

3. **Value comparison before null check:** Attempting to access `node.val` before checking if `node` is null will cause a null pointer exception. Always check for null first.

4. **Assuming single node tree is asymmetric:** A tree with only a root node (no children) is symmetric. The empty tree is also symmetric by definition.

## When You'll See This Pattern

The "mirror comparison" pattern appears in several tree problems:

1. **Same Tree (LeetCode 100):** Instead of comparing mirrored subtrees, you compare identical positions. The structure is similar but without the mirroring logic.

2. **Invert Binary Tree (LeetCode 226):** While not checking symmetry, it uses similar recursive tree manipulation where you swap left and right children.

3. **Subtree of Another Tree (LeetCode 572):** Uses similar recursive comparison logic to check if one tree is a subtree of another.

4. **Balanced Binary Tree (LeetCode 110):** Uses recursive depth calculation with early termination, similar to how we terminate early when finding asymmetry.

## Key Takeaways

1. **Mirror comparison requires comparing outer and inner pairs:** For symmetry, compare `left.left` with `right.right` (outer) and `left.right` with `right.left` (inner).

2. **Handle null cases first:** Always check for null values before accessing node properties to avoid runtime errors.

3. **Both recursive and iterative approaches work:** Recursion is more elegant for this problem, but an iterative approach using a queue demonstrates understanding of BFS/level-order traversal.

4. **Early termination improves efficiency:** Return false as soon as any asymmetry is detected rather than checking the entire tree.

[Practice this problem on CodeJeet](/problem/symmetric-tree)
