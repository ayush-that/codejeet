---
title: "How to Solve Recover Binary Search Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Recover Binary Search Tree. Medium difficulty, 58.8% acceptance rate. Topics: Tree, Depth-First Search, Binary Search Tree, Binary Tree."
date: "2027-02-16"
category: "dsa-patterns"
tags: ["recover-binary-search-tree", "tree", "depth-first-search", "binary-search-tree", "medium"]
---

# How to Solve Recover Binary Search Tree

You're given a binary search tree where exactly two nodes have been swapped, breaking the BST property. Your task is to identify and swap them back without modifying the tree structure. The challenge lies in efficiently finding the two swapped nodes in what appears to be a valid BST at first glance.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this BST where nodes 2 and 6 have been swapped:

```
Original BST:    3
                / \
               1   4
                  /
                 2
```

After swapping nodes 2 and 6 (but 6 doesn't exist in our tree - let me correct the example):

Actually, let's use a proper example. Consider this BST where nodes 1 and 3 have been swapped:

```
Incorrect BST:   3
                / \
               2   4
              /
             1
```

Wait, that's still valid. Let me use the classic example from LeetCode:

```
Correct BST:    1
               / \
              3   4
                 /
                2
```

Actually, that's not right either. Let's trace through a clear example:

**Step 1:** We have a BST where nodes 2 and 3 are swapped:

```
Given:    1
         / \
        3   4
       /
      2
```

**Step 2:** Perform an in-order traversal (left, root, right):

- Start at root 1, go left to 3
- From 3, go left to 2 (leaf node)
- Visit 2 → output: [2]
- Back to 3 → output: [2, 3]
- Back to 1 → output: [2, 3, 1]
- Go right to 4 → output: [2, 3, 1, 4]

**Step 3:** Notice the in-order traversal [2, 3, 1, 4] is NOT sorted! In a valid BST, in-order traversal should be strictly increasing: [1, 2, 3, 4].

**Step 4:** Find the violations:

- Compare 2 → 3: OK (2 < 3)
- Compare 3 → 1: VIOLATION (3 > 1) ← first anomaly
- Compare 1 → 4: OK (1 < 4)

**Step 5:** The swapped nodes are the first node in the first violation (3) and the second node in the last violation (1). So we need to swap nodes with values 3 and 1.

**Step 6:** After swapping 3 and 1:

```
Corrected:   1
            / \
           2   4
          /
         3
```

Wait, that's not right. Actually after swapping 3 and 1:

```
Corrected:   3
            / \
           2   4
          /
         1
```

Hmm, let me think... Actually the tree should be:

```
Corrected:   1
            / \
           3   4
          /
         2
```

No, that's our original. I'm confusing myself. The key insight is: in the in-order traversal [2, 3, 1, 4], we find where `prev > current`. The first violation gives us the larger node (3), and the last violation gives us the smaller node (1).

## Brute Force Approach

The brute force approach would be:

1. Perform an in-order traversal to collect all node values
2. Sort the values to get the correct order
3. Perform another in-order traversal, reassigning values to nodes in sorted order

This works because:

- In-order traversal of a BST should give sorted values
- Swapping two nodes creates exactly two "dips" in the sorted sequence
- By sorting, we restore the correct order

However, this approach has problems:

1. **Time complexity:** O(n log n) for sorting, plus O(n) for traversals
2. **Space complexity:** O(n) to store all values
3. **It modifies values** rather than identifying which nodes to swap
4. **It doesn't actually solve the problem** as stated - we need to identify the specific nodes that were swapped

The brute force misses the key insight: we only need to find two specific nodes, not sort all values.

## Optimized Approach

The key insight comes from understanding BST properties: **In-order traversal of a valid BST produces strictly increasing values.**

When two nodes are swapped, the in-order traversal will have exactly one or two "violations" where `previous_value > current_value`:

**Case 1: Swapped nodes are adjacent in in-order traversal**

- Example: [1, 3, 2, 4] (swapped 3 and 2)
- Only one violation: 3 > 2
- Both swapped nodes are part of this violation

**Case 2: Swapped nodes are not adjacent**

- Example: [3, 2, 1, 4] (swapped 3 and 1)
- Two violations: 3 > 2 and 2 > 1
- First violation's first node (3) and last violation's second node (1) are the swapped nodes

The algorithm:

1. Perform in-order traversal while tracking:
   - `prev`: previously visited node
   - `first`: first swapped node
   - `second`: second swapped node
   - `prevViolation`: node from previous violation (for non-adjacent case)
2. When we find `prev.val > current.val`:
   - If `first` is null, set `first = prev` and `prevViolation = current`
   - Else, set `second = current`
3. After traversal:
   - If `second` is null (adjacent case), swap `first` and `prevViolation`
   - Else, swap `first` and `second`

This gives us O(n) time and O(h) space (recursion stack), where h is tree height.

## Optimal Solution

Here's the complete implementation using Morris traversal for O(1) space:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) with Morris traversal
class Solution:
    def recoverTree(self, root: Optional[TreeNode]) -> None:
        """
        Do not return anything, modify root in-place instead.
        Uses Morris traversal for O(1) space.
        """
        # Initialize pointers for tracking nodes
        first = None      # First swapped node
        second = None     # Second swapped node
        prev = None       # Previous node in in-order traversal
        predecessor = None  # For Morris traversal

        current = root

        while current:
            if current.left:
                # Find inorder predecessor of current
                predecessor = current.left
                while predecessor.right and predecessor.right != current:
                    predecessor = predecessor.right

                if not predecessor.right:
                    # Create temporary link to current
                    predecessor.right = current
                    current = current.left
                else:
                    # Revert the temporary link
                    predecessor.right = None

                    # Process current node
                    if prev and prev.val > current.val:
                        if not first:
                            first = prev
                        second = current
                    prev = current

                    current = current.right
            else:
                # Process current node (no left child)
                if prev and prev.val > current.val:
                    if not first:
                        first = prev
                    second = current
                prev = current

                current = current.right

        # Swap the values of the two identified nodes
        if first and second:
            first.val, second.val = second.val, first.val
```

```javascript
// Time: O(n) | Space: O(1) with Morris traversal
var recoverTree = function (root) {
  // Initialize pointers for tracking nodes
  let first = null; // First swapped node
  let second = null; // Second swapped node
  let prev = null; // Previous node in in-order traversal
  let predecessor = null; // For Morris traversal

  let current = root;

  while (current) {
    if (current.left) {
      // Find inorder predecessor of current
      predecessor = current.left;
      while (predecessor.right && predecessor.right !== current) {
        predecessor = predecessor.right;
      }

      if (!predecessor.right) {
        // Create temporary link to current
        predecessor.right = current;
        current = current.left;
      } else {
        // Revert the temporary link
        predecessor.right = null;

        // Process current node
        if (prev && prev.val > current.val) {
          if (!first) {
            first = prev;
          }
          second = current;
        }
        prev = current;

        current = current.right;
      }
    } else {
      // Process current node (no left child)
      if (prev && prev.val > current.val) {
        if (!first) {
          first = prev;
        }
        second = current;
      }
      prev = current;

      current = current.right;
    }
  }

  // Swap the values of the two identified nodes
  if (first && second) {
    const temp = first.val;
    first.val = second.val;
    second.val = temp;
  }
};
```

```java
// Time: O(n) | Space: O(1) with Morris traversal
class Solution {
    public void recoverTree(TreeNode root) {
        // Initialize pointers for tracking nodes
        TreeNode first = null;     // First swapped node
        TreeNode second = null;    // Second swapped node
        TreeNode prev = null;      // Previous node in in-order traversal
        TreeNode predecessor = null; // For Morris traversal

        TreeNode current = root;

        while (current != null) {
            if (current.left != null) {
                // Find inorder predecessor of current
                predecessor = current.left;
                while (predecessor.right != null && predecessor.right != current) {
                    predecessor = predecessor.right;
                }

                if (predecessor.right == null) {
                    // Create temporary link to current
                    predecessor.right = current;
                    current = current.left;
                } else {
                    // Revert the temporary link
                    predecessor.right = null;

                    // Process current node
                    if (prev != null && prev.val > current.val) {
                        if (first == null) {
                            first = prev;
                        }
                        second = current;
                    }
                    prev = current;

                    current = current.right;
                }
            } else {
                // Process current node (no left child)
                if (prev != null && prev.val > current.val) {
                    if (first == null) {
                        first = prev;
                    }
                    second = current;
                }
                prev = current;

                current = current.right;
            }
        }

        // Swap the values of the two identified nodes
        if (first != null && second != null) {
            int temp = first.val;
            first.val = second.val;
            second.val = temp;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We visit each node exactly once during the Morris traversal
- Each node is processed a constant number of times (at most twice)
- The while loop to find predecessors doesn't increase asymptotic complexity since each edge is traversed at most twice

**Space Complexity:** O(1)

- Morris traversal uses no additional data structures
- We only use a constant number of pointers (first, second, prev, predecessor, current)
- No recursion stack or explicit stack data structure

## Common Mistakes

1. **Forgetting the adjacent nodes case:** When swapped nodes are adjacent in the in-order traversal, there's only one violation. Candidates often look for two violations and miss this case. Solution: Track `prevViolation` or handle the case where `second` remains null.

2. **Modifying tree structure instead of values:** The problem says "without changing its structure" - some candidates try to swap nodes (changing left/right pointers) instead of just swapping values. Solution: Only swap node values, not pointers.

3. **Incorrect violation tracking:** When finding violations `prev.val > current.val`, candidates sometimes assign nodes incorrectly. Remember: first violation gives us the larger node as `first`, and the last violation gives us the smaller node as `second`.

4. **Not handling null pointers:** When checking `prev.val > current.val`, forgetting to check if `prev` is null for the first node. Solution: Always check `if (prev && prev.val > current.val)`.

## When You'll See This Pattern

This problem teaches the **in-order traversal with violation detection** pattern, which appears in:

1. **Validate Binary Search Tree (LeetCode 98):** Similar concept of checking BST property during traversal, but here we fix violations instead of just detecting them.

2. **Kth Smallest Element in a BST (LeetCode 230):** Uses in-order traversal to process nodes in sorted order, similar to how we detect violations here.

3. **Binary Tree Inorder Traversal (LeetCode 94):** The core traversal technique used here, often implemented iteratively or with Morris traversal.

The pattern is: **When you need to process BST nodes in sorted order or detect ordering violations, in-order traversal is your tool.** Morris traversal is especially useful when O(1) space is required.

## Key Takeaways

1. **In-order traversal reveals BST order:** Any BST property violation will show up as `prev.val > current.val` during in-order traversal.

2. **Two cases for swapped nodes:** Adjacent (one violation) or non-adjacent (two violations) in the traversal order. Handle both by tracking the first violation's first node and the last violation's second node.

3. **Morris traversal enables O(1) space:** By temporarily modifying tree pointers during traversal, we can achieve constant space without recursion stacks.

[Practice this problem on CodeJeet](/problem/recover-binary-search-tree)
