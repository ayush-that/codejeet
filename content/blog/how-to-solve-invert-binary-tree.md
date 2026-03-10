---
title: "How to Solve Invert Binary Tree — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Invert Binary Tree. Easy difficulty, 79.8% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2026-03-31"
category: "dsa-patterns"
tags: ["invert-binary-tree", "tree", "depth-first-search", "breadth-first-search", "easy"]
---

# How to Solve Invert Binary Tree

Inverting a binary tree means swapping every left child with its corresponding right child throughout the entire tree. This creates a mirror image of the original tree. While conceptually simple, this problem is interesting because it tests your understanding of tree traversal and recursion, and it's famously associated with how some companies evaluate candidates' basic tree manipulation skills.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this binary tree:

```
     4
   /   \
  2     7
 / \   / \
1   3 6   9
```

**Step 1:** Start at the root (4). We need to swap its left and right children.

- Left child: 2
- Right child: 7
  After swapping: 7 becomes left child, 2 becomes right child

**Step 2:** Now process the new left subtree (rooted at 7):

- Left child: 6
- Right child: 9
  After swapping: 9 becomes left child, 6 becomes right child

**Step 3:** Process the new right subtree (rooted at 2):

- Left child: 1
- Right child: 3
  After swapping: 3 becomes left child, 1 becomes right child

**Step 4:** All leaf nodes (1, 3, 6, 9) have no children, so we stop.

The final inverted tree looks like this:

```
     4
   /   \
  7     2
 / \   / \
9   6 3   1
```

Notice that we can perform this operation using either Depth-First Search (DFS) or Breadth-First Search (BFS). The key insight is that we need to visit every node exactly once and swap its children.

## Brute Force Approach

For tree inversion, there isn't really a "brute force" in the traditional sense since we must visit every node to swap children. However, a naive approach might involve creating a completely new tree instead of modifying the existing one in-place, which would use unnecessary extra space.

Another suboptimal approach would be to traverse the tree multiple times or use complex data structures when simple recursion or iteration suffices. The most straightforward solution is already optimal: visit each node once and swap its children.

## Optimal Solution

The optimal solution uses either DFS (recursive or iterative) or BFS (iterative). Both approaches have O(n) time complexity and O(n) space complexity in the worst case. The recursive DFS solution is the most elegant and commonly expected in interviews.

<div class="code-group">

```python
# Time: O(n) where n is the number of nodes in the tree
# Space: O(h) where h is the height of the tree (due to recursion stack)
#        Worst case: O(n) for a skewed tree
#        Best case: O(log n) for a balanced tree

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def invertTree(root):
    """
    Inverts a binary tree using recursive DFS.
    Base case: if node is None, return None
    Recursive case: swap left and right children, then recursively invert subtrees
    """
    # Base case: empty tree or leaf node
    if root is None:
        return None

    # Swap the left and right children
    # This is the core operation of tree inversion
    root.left, root.right = root.right, root.left

    # Recursively invert the left subtree
    # After swapping, what was originally the right child is now the left child
    invertTree(root.left)

    # Recursively invert the right subtree
    # After swapping, what was originally the left child is now the right child
    invertTree(root.right)

    # Return the root of the inverted tree
    return root
```

```javascript
// Time: O(n) where n is the number of nodes in the tree
// Space: O(h) where h is the height of the tree (due to recursion stack)
//        Worst case: O(n) for a skewed tree
//        Best case: O(log n) for a balanced tree

function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function invertTree(root) {
  /**
   * Inverts a binary tree using recursive DFS.
   * Base case: if node is null, return null
   * Recursive case: swap left and right children, then recursively invert subtrees
   */

  // Base case: empty tree or leaf node
  if (root === null) {
    return null;
  }

  // Swap the left and right children using a temporary variable
  // This is the core operation of tree inversion
  const temp = root.left;
  root.left = root.right;
  root.right = temp;

  // Recursively invert the left subtree
  // After swapping, what was originally the right child is now the left child
  invertTree(root.left);

  // Recursively invert the right subtree
  // After swapping, what was originally the left child is now the right child
  invertTree(root.right);

  // Return the root of the inverted tree
  return root;
}
```

```java
// Time: O(n) where n is the number of nodes in the tree
// Space: O(h) where h is the height of the tree (due to recursion stack)
//        Worst case: O(n) for a skewed tree
//        Best case: O(log n) for a balanced tree

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
    public TreeNode invertTree(TreeNode root) {
        /**
         * Inverts a binary tree using recursive DFS.
         * Base case: if node is null, return null
         * Recursive case: swap left and right children, then recursively invert subtrees
         */

        // Base case: empty tree or leaf node
        if (root == null) {
            return null;
        }

        // Swap the left and right children using a temporary variable
        // This is the core operation of tree inversion
        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;

        // Recursively invert the left subtree
        // After swapping, what was originally the right child is now the left child
        invertTree(root.left);

        // Recursively invert the right subtree
        // After swapping, what was originally the left child is now the right child
        invertTree(root.right);

        // Return the root of the inverted tree
        return root;
    }
}
```

</div>

## Alternative BFS Solution

Sometimes interviewers ask for an iterative solution. Here's a BFS approach using a queue:

<div class="code-group">

```python
def invertTreeBFS(root):
    """
    Inverts a binary tree using iterative BFS with a queue.
    Process nodes level by level, swapping children of each node.
    """
    if root is None:
        return None

    # Use a queue for BFS traversal
    queue = [root]

    while queue:
        # Get the next node to process
        node = queue.pop(0)

        # Swap left and right children
        node.left, node.right = node.right, node.left

        # Add children to queue if they exist
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)

    return root
```

```javascript
function invertTreeBFS(root) {
  /**
   * Inverts a binary tree using iterative BFS with a queue.
   * Process nodes level by level, swapping children of each node.
   */
  if (root === null) {
    return null;
  }

  // Use a queue for BFS traversal
  const queue = [root];

  while (queue.length > 0) {
    // Get the next node to process
    const node = queue.shift();

    // Swap left and right children
    const temp = node.left;
    node.left = node.right;
    node.right = temp;

    // Add children to queue if they exist
    if (node.left !== null) {
      queue.push(node.left);
    }
    if (node.right !== null) {
      queue.push(node.right);
    }
  }

  return root;
}
```

```java
public TreeNode invertTreeBFS(TreeNode root) {
    /**
     * Inverts a binary tree using iterative BFS with a queue.
     * Process nodes level by level, swapping children of each node.
     */
    if (root == null) {
        return null;
    }

    // Use a queue for BFS traversal
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
        // Get the next node to process
        TreeNode node = queue.poll();

        // Swap left and right children
        TreeNode temp = node.left;
        node.left = node.right;
        node.right = temp;

        // Add children to queue if they exist
        if (node.left != null) {
            queue.offer(node.left);
        }
        if (node.right != null) {
            queue.offer(node.right);
        }
    }

    return root;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We visit each node exactly once, performing a constant-time swap operation at each node.
- Whether using DFS or BFS, we must traverse the entire tree.

**Space Complexity:**

- **Recursive DFS:** O(h) where h is the height of the tree
  - Worst case (skewed tree): O(n) - recursion stack depth equals number of nodes
  - Best case (balanced tree): O(log n) - recursion stack depth equals tree height
- **Iterative BFS:** O(w) where w is the maximum width of the tree
  - Worst case (complete tree): O(n) - last level contains ~n/2 nodes
  - Best case (skewed tree): O(1) - queue only holds one node at a time

## Common Mistakes

1. **Forgetting the base case:** Not handling the `root is None` case will lead to null pointer exceptions when the tree is empty or when reaching leaf nodes' children.

2. **Swapping before recursion:** While both orders work (swap then recurse vs recurse then swap), swapping before recursion is more intuitive. If you recurse first, you're inverting subtrees before swapping their parents, which can be confusing.

3. **Not returning the root:** The problem asks to return the root of the inverted tree. While modifying in-place, you still need to return the original root pointer.

4. **Creating unnecessary copies:** Some candidates try to create a new tree instead of modifying the existing one in-place, which uses O(n) extra space unnecessarily.

5. **Incorrect child order in recursion:** After swapping, `root.left` now points to the original right child. Make sure to call `invertTree(root.left)` to invert what was originally the right subtree.

## When You'll See This Pattern

The tree inversion pattern appears in various tree manipulation problems:

1. **Symmetric Tree (LeetCode 101):** Check if a tree is symmetric by comparing left and right subtrees - similar swapping logic.

2. **Merge Two Binary Trees (LeetCode 617):** Combine two trees by summing corresponding nodes - uses similar traversal patterns.

3. **Univalued Binary Tree (LeetCode 965):** Check if all nodes have the same value - uses similar tree traversal techniques.

4. **Binary Tree Pruning (LeetCode 814):** Remove subtrees that don't contain 1s - modifies tree structure during traversal.

The core pattern is **tree traversal with in-place modification**. Whenever you need to transform a tree by visiting each node and potentially modifying its structure or relationships, this approach applies.

## Key Takeaways

1. **Tree inversion is fundamentally about swapping children:** The core operation is simple - for each node, swap its left and right children. The complexity comes from ensuring you visit every node exactly once.

2. **Choose traversal method based on constraints:**
   - Use recursive DFS for simplicity and when tree depth isn't extreme
   - Use iterative BFS when you want to avoid recursion or process level by level
   - Both have O(n) time complexity but different space characteristics

3. **In-place modification is key:** Unlike array problems where you might create new data structures, tree problems often modify the existing structure in-place, which is more space-efficient.

4. **Base cases matter:** Always handle empty trees (root is None) and leaf nodes (both children are None) correctly to avoid null pointer errors.

Related problems: [Reverse Odd Levels of Binary Tree](/problem/reverse-odd-levels-of-binary-tree)
