---
title: "How to Solve Delete Node in a BST — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Delete Node in a BST. Medium difficulty, 54.2% acceptance rate. Topics: Tree, Binary Search Tree, Binary Tree."
date: "2026-12-02"
category: "dsa-patterns"
tags: ["delete-node-in-a-bst", "tree", "binary-search-tree", "binary-tree", "medium"]
---

# How to Solve Delete Node in a BST

Deleting a node from a Binary Search Tree (BST) is a classic problem that tests your understanding of tree manipulation and BST properties. While searching for a node in a BST is straightforward, deletion requires careful handling of three distinct cases based on the node's children. The challenge lies in maintaining the BST property (left subtree values < node value < right subtree values) after removal, which requires different strategies depending on whether the node has zero, one, or two children.

## Visual Walkthrough

Let's trace through deleting node 3 from this BST:

```
        5
       / \
      3   8
     / \   \
    2   4   9
```

**Step 1: Search for node 3**

- Start at root (5): 3 < 5, go left
- Found node 3

**Step 2: Determine deletion case**
Node 3 has two children (2 and 4), so this is the two-child case.

**Step 3: Find replacement**
We need to find either:

- Inorder predecessor: largest value in left subtree (2)
- Inorder successor: smallest value in right subtree (4)

Let's choose the inorder successor (4).

**Step 4: Replace and delete**

- Copy value 4 to node 3
- Now we need to delete the original node 4 (which has no children)
- Delete node 4 by setting its parent's reference to null

**Result:**

```
        5
       / \
      4   8
     /     \
    2       9
```

Notice the BST property is preserved: 2 < 4 < 5 < 8 < 9.

## Brute Force Approach

A naive approach might be to reconstruct the entire tree after removal, but this is inefficient. Another brute force idea would be to:

1. Find the node to delete
2. Remove it by setting it to null
3. Reinsert all nodes from its subtrees

This approach fails because:

- It destroys the original tree structure unnecessarily
- Reinsertion would take O(n log n) time in the worst case
- It doesn't leverage BST properties for efficient deletion

The key insight is that we only need to modify local connections around the deleted node, not rebuild the entire tree.

## Optimized Approach

The optimal solution uses BST properties and handles three cases:

**Case 1: Node has no children (leaf node)**
Simply remove it by setting the parent's reference to null.

**Case 2: Node has one child**
Bypass the node by connecting its parent directly to its child.

**Case 3: Node has two children**
This is the trickiest case. We need to:

1. Find either the inorder predecessor (largest in left subtree) or inorder successor (smallest in right subtree)
2. Replace the node's value with the predecessor/successor's value
3. Recursively delete the predecessor/successor node (which will be case 1 or 2)

The recursion naturally handles updating parent references as we return back up the call stack.

## Optimal Solution

<div class="code-group">

```python
# Time: O(h) where h is tree height, O(log n) for balanced BST, O(n) for skewed
# Space: O(h) for recursion stack
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def deleteNode(self, root: Optional[TreeNode], key: int) -> Optional[TreeNode]:
        # Base case: empty tree
        if not root:
            return None

        # Search for the node to delete
        if key < root.val:
            # Key is in left subtree
            root.left = self.deleteNode(root.left, key)
        elif key > root.val:
            # Key is in right subtree
            root.right = self.deleteNode(root.right, key)
        else:
            # Found the node to delete
            # Case 1: No left child
            if not root.left:
                return root.right
            # Case 2: No right child
            elif not root.right:
                return root.left
            # Case 3: Two children
            else:
                # Find inorder successor (smallest in right subtree)
                successor = self.findMin(root.right)
                # Replace current value with successor value
                root.val = successor.val
                # Delete the successor node from right subtree
                root.right = self.deleteNode(root.right, successor.val)

        return root

    def findMin(self, node: TreeNode) -> TreeNode:
        # Find minimum value node (leftmost node)
        while node.left:
            node = node.left
        return node
```

```javascript
// Time: O(h) where h is tree height, O(log n) for balanced BST, O(n) for skewed
// Space: O(h) for recursion stack
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class Solution {
  deleteNode(root, key) {
    // Base case: empty tree
    if (!root) {
      return null;
    }

    // Search for the node to delete
    if (key < root.val) {
      // Key is in left subtree
      root.left = this.deleteNode(root.left, key);
    } else if (key > root.val) {
      // Key is in right subtree
      root.right = this.deleteNode(root.right, key);
    } else {
      // Found the node to delete
      // Case 1: No left child
      if (!root.left) {
        return root.right;
      }
      // Case 2: No right child
      else if (!root.right) {
        return root.left;
      }
      // Case 3: Two children
      else {
        // Find inorder successor (smallest in right subtree)
        const successor = this.findMin(root.right);
        // Replace current value with successor value
        root.val = successor.val;
        // Delete the successor node from right subtree
        root.right = this.deleteNode(root.right, successor.val);
      }
    }

    return root;
  }

  findMin(node) {
    // Find minimum value node (leftmost node)
    while (node.left) {
      node = node.left;
    }
    return node;
  }
}
```

```java
// Time: O(h) where h is tree height, O(log n) for balanced BST, O(n) for skewed
// Space: O(h) for recursion stack
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
    public TreeNode deleteNode(TreeNode root, int key) {
        // Base case: empty tree
        if (root == null) {
            return null;
        }

        // Search for the node to delete
        if (key < root.val) {
            // Key is in left subtree
            root.left = deleteNode(root.left, key);
        } else if (key > root.val) {
            // Key is in right subtree
            root.right = deleteNode(root.right, key);
        } else {
            // Found the node to delete
            // Case 1: No left child
            if (root.left == null) {
                return root.right;
            }
            // Case 2: No right child
            else if (root.right == null) {
                return root.left;
            }
            // Case 3: Two children
            else {
                // Find inorder successor (smallest in right subtree)
                TreeNode successor = findMin(root.right);
                // Replace current value with successor value
                root.val = successor.val;
                // Delete the successor node from right subtree
                root.right = deleteNode(root.right, successor.val);
            }
        }

        return root;
    }

    private TreeNode findMin(TreeNode node) {
        // Find minimum value node (leftmost node)
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(h)**

- `h` is the height of the tree
- For a balanced BST: O(log n) where n is number of nodes
- For a skewed tree (worst case): O(n)
- We traverse down the tree to find the node (O(h)), and in the two-child case, we traverse further to find the successor (O(h))

**Space Complexity: O(h)**

- Due to recursion stack depth
- For balanced BST: O(log n)
- For skewed tree: O(n)
- An iterative approach could reduce this to O(1) extra space, but recursion is more intuitive for tree problems

## Common Mistakes

1. **Forgetting to update parent references**: When you delete a node recursively, you must assign the result back to `root.left` or `root.right`. Without this, the parent won't know about the deletion.

2. **Handling the two-child case incorrectly**: A common error is to try to move entire subtrees instead of just replacing the value. Remember: in the two-child case, we only replace the node's value with its successor/predecessor, then delete that successor/predecessor node.

3. **Not considering all three cases**: Candidates often miss one of the cases (0, 1, or 2 children). Practice drawing examples of each case to ensure you handle them all.

4. **Choosing the wrong successor/predecessor**: The inorder successor is the smallest node in the right subtree (leftmost node), not just the right child. Similarly, the inorder predecessor is the largest node in the left subtree (rightmost node).

## When You'll See This Pattern

This deletion pattern appears in various tree manipulation problems:

1. **Split BST (LeetCode 776)**: Similar recursive structure but splits the tree based on a value rather than deleting a node.

2. **Insert into a Binary Search Tree (LeetCode 701)**: Uses similar recursive search to find where to insert, maintaining BST properties.

3. **Trim a Binary Search Tree (LeetCode 669)**: Recursively removes nodes outside a range, similar to deletion but for multiple nodes.

The core pattern is recursive tree traversal with modification, where you return the modified subtree to update parent references.

## Key Takeaways

1. **BST deletion has three distinct cases**: Handle leaf nodes, single-child nodes, and two-child nodes differently. The two-child case requires finding a replacement value from the inorder predecessor or successor.

2. **Recursive tree modification requires proper return values**: Always return the (potentially modified) subtree so parent nodes can update their references correctly.

3. **The inorder successor is the leftmost node in the right subtree**: This is a key fact to remember for the two-child deletion case and appears in many BST problems.

Related problems: [Split BST](/problem/split-bst)
