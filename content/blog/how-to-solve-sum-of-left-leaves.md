---
title: "How to Solve Sum of Left Leaves — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sum of Left Leaves. Easy difficulty, 62.4% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2026-12-23"
category: "dsa-patterns"
tags: ["sum-of-left-leaves", "tree", "depth-first-search", "breadth-first-search", "easy"]
---

# How to Solve Sum of Left Leaves

This problem asks us to sum all leaf nodes in a binary tree that happen to be left children of their parent. While conceptually simple, it's tricky because we need to identify two conditions simultaneously: 1) the node must be a leaf (no children), and 2) it must be a left child of its parent. The challenge lies in tracking parent-child relationships during tree traversal.

## Visual Walkthrough

Let's trace through a concrete example:

```
      3
     / \
    9   20
       /  \
      15   7
```

**Step-by-step reasoning:**

1. Start at root node 3. It's not a leaf (has children), so we don't add anything.
2. Move to left child 9. Check: Is it a leaf? Yes (no children). Is it a left child? Yes (of node 3). Add 9 to our sum.
3. Move to right child 20. Not a leaf, so continue.
4. Move to left child 15 of node 20. Check: Leaf? Yes. Left child? Yes (of node 20). Add 15 to sum.
5. Move to right child 7 of node 20. Check: Leaf? Yes. Left child? No (it's a right child). Don't add.

**Final sum:** 9 + 15 = 24

The key insight is that we need to pass information about whether a node is a left child from parent to child during traversal.

## Brute Force Approach

A truly naive approach might try to collect all nodes first, then filter for left leaves. However, this doesn't work well because:

1. We lose parent-child relationships when collecting nodes
2. We'd need additional data structures to track relationships
3. It's inefficient in both time and space

A better "brute force" would be to traverse the tree and for each node, check if it has a left child that's a leaf. This is actually the optimal approach! The reason there's no worse brute force is that any solution must examine every node to determine if it's a left leaf, giving us a baseline O(n) time complexity.

What makes this problem "Easy" is that the straightforward recursive DFS or iterative BFS approach is already optimal. The challenge is implementing it correctly with proper condition checks.

## Optimal Solution

We can solve this with either DFS (recursive or iterative) or BFS. The recursive DFS is most elegant. The core logic: at each node, check if its left child exists AND is a leaf. If so, add its value. Then recursively process both children.

<div class="code-group">

```python
# Time: O(n) where n is number of nodes in tree
# Space: O(h) where h is height of tree (recursion stack)
def sumOfLeftLeaves(root):
    """
    Calculate sum of all left leaves in binary tree.

    Args:
        root: TreeNode - root of binary tree

    Returns:
        int - sum of values of all left leaves
    """
    # Base case: empty tree
    if not root:
        return 0

    total = 0

    # Check if left child exists
    if root.left:
        # Check if left child is a leaf (no children)
        if not root.left.left and not root.left.right:
            # Add left leaf's value to total
            total += root.left.val
        else:
            # Left child is not a leaf, recursively process it
            total += sumOfLeftLeaves(root.left)

    # Process right child (it can't be a left leaf, but its descendants might be)
    if root.right:
        total += sumOfLeftLeaves(root.right)

    return total
```

```javascript
// Time: O(n) where n is number of nodes in tree
// Space: O(h) where h is height of tree (recursion stack)
function sumOfLeftLeaves(root) {
  /**
   * Calculate sum of all left leaves in binary tree.
   *
   * @param {TreeNode} root - root of binary tree
   * @return {number} - sum of values of all left leaves
   */

  // Base case: empty tree
  if (!root) {
    return 0;
  }

  let total = 0;

  // Check if left child exists
  if (root.left) {
    // Check if left child is a leaf (no children)
    if (!root.left.left && !root.left.right) {
      // Add left leaf's value to total
      total += root.left.val;
    } else {
      // Left child is not a leaf, recursively process it
      total += sumOfLeftLeaves(root.left);
    }
  }

  // Process right child (it can't be a left leaf, but its descendants might be)
  if (root.right) {
    total += sumOfLeftLeaves(root.right);
  }

  return total;
}
```

```java
// Time: O(n) where n is number of nodes in tree
// Space: O(h) where h is height of tree (recursion stack)
class Solution {
    public int sumOfLeftLeaves(TreeNode root) {
        /**
         * Calculate sum of all left leaves in binary tree.
         *
         * @param root - root of binary tree
         * @return sum of values of all left leaves
         */

        // Base case: empty tree
        if (root == null) {
            return 0;
        }

        int total = 0;

        // Check if left child exists
        if (root.left != null) {
            // Check if left child is a leaf (no children)
            if (root.left.left == null && root.left.right == null) {
                // Add left leaf's value to total
                total += root.left.val;
            } else {
                // Left child is not a leaf, recursively process it
                total += sumOfLeftLeaves(root.left);
            }
        }

        // Process right child (it can't be a left leaf, but its descendants might be)
        if (root.right != null) {
            total += sumOfLeftLeaves(root.right);
        }

        return total;
    }
}
```

</div>

**Alternative iterative solution using stack:**

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def sumOfLeftLeavesIterative(root):
    if not root:
        return 0

    stack = [(root, False)]  # (node, is_left_child)
    total = 0

    while stack:
        node, is_left = stack.pop()

        # Check if current node is a leaf AND a left child
        if not node.left and not node.right and is_left:
            total += node.val

        # Add children to stack with their left/right status
        if node.right:
            stack.append((node.right, False))
        if node.left:
            stack.append((node.left, True))

    return total
```

```javascript
// Time: O(n) | Space: O(n)
function sumOfLeftLeavesIterative(root) {
  if (!root) return 0;

  const stack = [[root, false]]; // [node, is_left_child]
  let total = 0;

  while (stack.length > 0) {
    const [node, isLeft] = stack.pop();

    // Check if current node is a leaf AND a left child
    if (!node.left && !node.right && isLeft) {
      total += node.val;
    }

    // Add children to stack with their left/right status
    if (node.right) {
      stack.push([node.right, false]);
    }
    if (node.left) {
      stack.push([node.left, true]);
    }
  }

  return total;
}
```

```java
// Time: O(n) | Space: O(n)
public int sumOfLeftLeavesIterative(TreeNode root) {
    if (root == null) return 0;

    Stack<Pair<TreeNode, Boolean>> stack = new Stack<>();
    stack.push(new Pair<>(root, false));
    int total = 0;

    while (!stack.isEmpty()) {
        Pair<TreeNode, Boolean> pair = stack.pop();
        TreeNode node = pair.getKey();
        boolean isLeft = pair.getValue();

        // Check if current node is a leaf AND a left child
        if (node.left == null && node.right == null && isLeft) {
            total += node.val;
        }

        // Add children to stack with their left/right status
        if (node.right != null) {
            stack.push(new Pair<>(node.right, false));
        }
        if (node.left != null) {
            stack.push(new Pair<>(node.left, true));
        }
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We visit each node exactly once in the worst case
- Each node visit involves constant-time operations (checking children, adding to sum)
- Even in the iterative approach with stack operations, each node is pushed and popped once

**Space Complexity:**

- Recursive: O(h) where h is the height of the tree
  - Best case (balanced tree): O(log n)
  - Worst case (skewed tree): O(n)
- Iterative with stack: O(n) in worst case when tree is skewed
- The space is used for the recursion call stack or the explicit stack

## Common Mistakes

1. **Checking leaf condition incorrectly:** The most common error is checking `if not node:` instead of `if not node.left and not node.right:` to determine if a node is a leaf. Remember: a leaf has NO children, not that the node itself is null.

2. **Forgetting the root can't be a left leaf:** The root node is never a left leaf (it has no parent). Some candidates try to check if the root itself is a left leaf, which doesn't make sense.

3. **Incorrect parent tracking in iterative solutions:** When using a stack or queue, you must track whether each node is a left child. Forgetting to pass this information leads to counting all leaves, not just left leaves.

4. **Not handling empty tree:** Always check if `root is None/null` at the beginning. This is a common edge case that interviewers test.

5. **Double-counting in recursive approach:** When you find a left leaf, you should NOT recursively call the function on it since it has no children. Doing so wastes computation and could cause errors if not handled properly.

## When You'll See This Pattern

This problem teaches **tree traversal with state tracking** - a pattern where you pass additional information (like "am I a left child?") during traversal. You'll see this pattern in:

1. **Binary Tree Path Sum (LeetCode 112)**: Similar traversal but tracking running sum instead of left-child status.
2. **Find Bottom Left Tree Value (LeetCode 513)**: Track depth and leftmost status during traversal.
3. **Binary Tree Right Side View (LeetCode 199)**: Track which nodes are visible from the right side.
4. **Count Good Nodes in Binary Tree (LeetCode 1448)**: Track the maximum value seen so far in the path.

The core idea is the same: traverse the tree (DFS/BFS) while maintaining some state that helps answer the specific question.

## Key Takeaways

1. **Tree problems often require tracking additional state** during traversal. Here, we track whether a node is a left child. In other problems, you might track depth, path sum, or maximum value seen.

2. **The definition matters**: Pay close attention to problem definitions. "Left leaf" means two things: it's a leaf AND it's a left child. Missing either condition is a common error.

3. **Multiple traversal approaches work**: Both DFS (recursive/iterative) and BFS can solve this. Choose based on what's most intuitive to you and the problem constraints. Recursive DFS is often cleanest for tree problems.

4. **Edge cases are critical**: Always test with empty tree, single node, skewed trees, and trees where all leaves are right children.

[Practice this problem on CodeJeet](/problem/sum-of-left-leaves)
