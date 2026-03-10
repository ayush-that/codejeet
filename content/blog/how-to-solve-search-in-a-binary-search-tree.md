---
title: "How to Solve Search in a Binary Search Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Search in a Binary Search Tree. Easy difficulty, 82.5% acceptance rate. Topics: Tree, Binary Search Tree, Binary Tree."
date: "2026-08-07"
category: "dsa-patterns"
tags: ["search-in-a-binary-search-tree", "tree", "binary-search-tree", "binary-tree", "easy"]
---

# How to Solve Search in a Binary Search Tree

You're given the root of a binary search tree (BST) and a target value. Your task is to find the node whose value equals the target and return the subtree rooted at that node, or return `null` if the value doesn't exist in the tree. What makes this problem interesting is that it's a perfect demonstration of how BST properties enable efficient search—if you understand the BST structure, the solution becomes almost trivial. If you don't, you might waste time implementing unnecessary traversals.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this BST:

```
        4
       / \
      2   7
     / \
    1   3
```

We're searching for the value `2`. Here's how the search progresses:

1. **Start at root (4)**: Compare target (2) with current node value (4)
   - Since 2 < 4, we know (if it exists) the target must be in the left subtree
   - Move to the left child (node with value 2)

2. **At node with value 2**: Compare target (2) with current node value (2)
   - They're equal! We've found our target
   - Return this node (which includes its entire subtree: nodes 1 and 3)

If we were searching for value `5` instead:

1. **Start at root (4)**: Compare 5 with 4
   - Since 5 > 4, move to the right child (node with value 7)

2. **At node with value 7**: Compare 5 with 7
   - Since 5 < 7, move to the left child
   - But there's no left child (it's `null`), so we return `null`

The key insight: **BST property guarantees that for any node, all values in its left subtree are smaller, and all values in its right subtree are larger**. This lets us eliminate half the remaining search space at each step.

## Brute Force Approach

A naive approach would be to perform a complete traversal (inorder, preorder, or postorder) of the entire tree, checking each node's value against the target. While this would technically work, it completely ignores the BST structure and has O(n) time complexity in the worst case, where n is the number of nodes.

What makes this approach suboptimal is that it treats the BST like any ordinary binary tree. A BST isn't just any tree—it's organized specifically to enable efficient search. By traversing the entire tree regardless of the target value, you're doing unnecessary work.

The brute force would look like this in pseudocode:

```
function searchBST(root, val):
    if root is null: return null
    if root.val == val: return root

    left_result = searchBST(root.left, val)
    if left_result is not null: return left_result

    return searchBST(root.right, val)
```

This searches both subtrees unconditionally, wasting the opportunity to prune the search space using the BST property.

## Optimal Solution

The optimal solution leverages the BST property to guide the search. At each node, we compare the target value with the current node's value:

- If they're equal, we've found our node
- If target is smaller, search only the left subtree
- If target is larger, search only the right subtree

This approach is essentially binary search adapted to a tree structure. The recursion naturally follows the BST's organization.

<div class="code-group">

```python
# Time: O(h) where h is the height of the tree
# Space: O(h) for the recursion stack (or O(1) for iterative version)
class Solution:
    def searchBST(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:
        """
        Search for a node with given value in a BST.

        Args:
            root: Root node of the BST
            val: Target value to search for

        Returns:
            The node containing the value, or None if not found
        """
        # Base case: empty tree or reached a null child
        if not root:
            return None

        # Found the target value at current node
        if root.val == val:
            return root

        # If target is smaller than current node's value,
        # it must be in the left subtree (if it exists)
        if val < root.val:
            return self.searchBST(root.left, val)

        # Otherwise, target is larger than current node's value,
        # so it must be in the right subtree
        return self.searchBST(root.right, val)
```

```javascript
// Time: O(h) where h is the height of the tree
// Space: O(h) for the recursion stack (or O(1) for iterative version)
/**
 * Search for a node with given value in a BST.
 *
 * @param {TreeNode} root - Root node of the BST
 * @param {number} val - Target value to search for
 * @return {TreeNode} - The node containing the value, or null if not found
 */
var searchBST = function (root, val) {
  // Base case: empty tree or reached a null child
  if (root === null) {
    return null;
  }

  // Found the target value at current node
  if (root.val === val) {
    return root;
  }

  // If target is smaller than current node's value,
  // it must be in the left subtree (if it exists)
  if (val < root.val) {
    return searchBST(root.left, val);
  }

  // Otherwise, target is larger than current node's value,
  // so it must be in the right subtree
  return searchBST(root.right, val);
};
```

```java
// Time: O(h) where h is the height of the tree
// Space: O(h) for the recursion stack (or O(1) for iterative version)
/**
 * Search for a node with given value in a BST.
 *
 * @param root Root node of the BST
 * @param val Target value to search for
 * @return The node containing the value, or null if not found
 */
public TreeNode searchBST(TreeNode root, int val) {
    // Base case: empty tree or reached a null child
    if (root == null) {
        return null;
    }

    // Found the target value at current node
    if (root.val == val) {
        return root;
    }

    // If target is smaller than current node's value,
    // it must be in the left subtree (if it exists)
    if (val < root.val) {
        return searchBST(root.left, val);
    }

    // Otherwise, target is larger than current node's value,
    // so it must be in the right subtree
    return searchBST(root.right, val);
}
```

</div>

**Iterative Alternative**: You can also implement this iteratively, which uses O(1) space:

<div class="code-group">

```python
def searchBST(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:
    current = root
    while current:
        if current.val == val:
            return current
        elif val < current.val:
            current = current.left
        else:
            current = current.right
    return None
```

```javascript
var searchBST = function (root, val) {
  let current = root;
  while (current) {
    if (current.val === val) {
      return current;
    } else if (val < current.val) {
      current = current.left;
    } else {
      current = current.right;
    }
  }
  return null;
};
```

```java
public TreeNode searchBST(TreeNode root, int val) {
    TreeNode current = root;
    while (current != null) {
        if (current.val == val) {
            return current;
        } else if (val < current.val) {
            current = current.left;
        } else {
            current = current.right;
        }
    }
    return null;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(h), where h is the height of the tree

- In a balanced BST, h = O(log n), so time is O(log n)
- In the worst case (a degenerate tree where each node has only one child), h = O(n), so time is O(n)
- At each step, we either find the node or eliminate one subtree from consideration

**Space Complexity**:

- **Recursive version**: O(h) for the recursion call stack
- **Iterative version**: O(1) additional space (just a pointer variable)

The height h determines both time and space complexity. This is why balanced BSTs (like AVL trees or Red-Black trees) are so important—they guarantee O(log n) operations.

## Common Mistakes

1. **Forgetting the BST property and searching both subtrees**: This is the most common mistake. Candidates sometimes write generic tree traversal code that checks both left and right children regardless of the target value. Remember: BSTs are organized specifically so you only need to explore one path.

2. **Not handling the null/empty tree case**: Always check if `root` is `null` at the beginning. If the tree is empty or you reach a leaf's child, you should return `null`.

3. **Confusing node values with nodes**: The problem asks you to return the _node_ (subtree), not just the value. Make sure you're returning the actual TreeNode object, not `root.val`.

4. **Infinite recursion in iterative solution**: When implementing the iterative version, ensure your loop condition handles the case when `current` becomes `null`. The loop should be `while (current != null)` not `while (true)`.

## When You'll See This Pattern

This BST search pattern appears in many tree-related problems:

1. **Closest Binary Search Tree Value (Easy)**: Instead of finding an exact match, you find the closest value. The approach is similar—traverse down the tree while keeping track of the closest value seen so far.

2. **Insert into a Binary Search Tree (Medium)**: You use the same comparison logic to find where to insert a new node. You traverse down the tree until you find an appropriate null position.

3. **Closest Nodes Queries in a Binary Search Tree (Medium)**: This involves multiple searches with additional logic to find predecessor/successor values.

4. **Validate Binary Search Tree (Medium)**: While not a search problem, it uses the same understanding of BST properties—all nodes in the left subtree must be smaller, all in the right must be larger.

The core pattern is: **Use comparisons at each node to decide which subtree to explore, eliminating half the search space at each step.**

## Key Takeaways

1. **BST property enables efficient search**: The organized structure of a BST (left < parent < right) allows you to make decisions at each node about which direction to go, similar to binary search in arrays.

2. **Always consider tree height for complexity**: The time complexity depends on the tree's height, not just the number of nodes. Balanced trees give O(log n) performance; unbalanced trees degrade to O(n).

3. **Recursive vs. iterative trade-offs**: The recursive solution is more elegant and easier to understand, but uses O(h) stack space. The iterative solution uses O(1) space and is preferred when space is a concern or when the tree might be very deep.

Remember: When you see "binary search tree" in a problem description, immediately think about how you can use the ordering property to optimize your solution. Don't treat it like a regular binary tree!

Related problems: [Closest Binary Search Tree Value](/problem/closest-binary-search-tree-value), [Insert into a Binary Search Tree](/problem/insert-into-a-binary-search-tree), [Closest Nodes Queries in a Binary Search Tree](/problem/closest-nodes-queries-in-a-binary-search-tree)
