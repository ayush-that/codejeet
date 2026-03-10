---
title: "How to Solve Serialize and Deserialize BST — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Serialize and Deserialize BST. Medium difficulty, 59.4% acceptance rate. Topics: String, Tree, Depth-First Search, Breadth-First Search, Design."
date: "2028-03-09"
category: "dsa-patterns"
tags: ["serialize-and-deserialize-bst", "string", "tree", "depth-first-search", "medium"]
---

# How to Solve Serialize and Deserialize BST

Serializing a binary search tree (BST) means converting it into a string format that can be stored or transmitted, while deserializing reconstructs the original BST from that string. What makes this problem interesting is that we need to preserve the BST structure and values efficiently. Unlike a general binary tree, a BST has ordering properties that allow for more compact serialization.

## Visual Walkthrough

Let's trace through serializing and deserializing a BST with this example:

```
    4
   / \
  2   6
 / \   \
1   3   7
```

**Serialization Steps:**

1. We'll use preorder traversal (root, left, right) because it naturally preserves the root-first structure
2. Traversal order: 4 → 2 → 1 → 3 → 6 → 7
3. Serialized string: "4,2,1,3,6,7"

**Deserialization Steps:**

1. Split the string into list: [4, 2, 1, 3, 6, 7]
2. First value (4) is the root
3. All values < 4 go to left subtree: [2, 1, 3]
4. All values > 4 go to right subtree: [6, 7]
5. Recursively apply this logic to build the entire tree

The key insight is that in preorder traversal of a BST, once we know the root value, we can identify which subsequent values belong to the left subtree (all values less than root) and which belong to the right subtree (all values greater than root).

## Brute Force Approach

A naive approach might serialize using level-order traversal (like we would for a general binary tree), storing null markers for missing children. For our example BST, this would produce: "4,2,6,1,3,null,7".

While this works, it's inefficient for BSTs because:

1. We store unnecessary null markers
2. The serialized string is longer than necessary
3. During deserialization, we can't leverage BST properties for efficient reconstruction

For a BST with n nodes, this approach uses O(n) space for null markers in the worst case (a skewed tree), making the serialized string up to twice as long as needed.

## Optimized Approach

The optimal approach leverages the BST property: for any node, all values in its left subtree are less than the node's value, and all values in its right subtree are greater.

**Key Insight:** In a preorder traversal array of a BST:

- The first element is always the root
- All elements after the root that are less than the root belong to the left subtree
- All elements after the root that are greater than the root belong to the right subtree

This property allows us to:

1. Serialize using simple preorder traversal without null markers
2. Deserialize by recursively partitioning the array based on BST ordering

**Why preorder works best:**

- Postorder would work but is less intuitive (root is at the end)
- Inorder doesn't work alone (it produces sorted array but loses structure)
- Preorder gives us the root first, which is exactly what we need to partition the remaining values

## Optimal Solution

We'll implement both serialize and deserialize methods using preorder traversal and recursive reconstruction.

<div class="code-group">

```python
# Time: O(n) for both serialize and deserialize
# Space: O(n) for both serialize and deserialize
class Codec:
    def serialize(self, root: TreeNode) -> str:
        """Encodes a tree to a single string using preorder traversal."""
        result = []

        def preorder(node):
            if not node:
                return
            result.append(str(node.val))
            preorder(node.left)
            preorder(node.right)

        preorder(root)
        return ','.join(result)  # Join values with commas

    def deserialize(self, data: str) -> TreeNode:
        """Decodes your encoded data to tree."""
        if not data:
            return None

        # Convert string to list of integers
        values = list(map(int, data.split(',')))

        def build_tree(preorder, lower=float('-inf'), upper=float('inf')):
            """Recursively build tree from preorder list using BST bounds."""
            if not preorder:
                return None

            val = preorder[0]
            # Check if current value is within valid BST range
            if val < lower or val > upper:
                return None

            # Create root node with first value
            root = TreeNode(val)
            preorder.pop(0)  # Remove processed value

            # All values less than root go to left subtree
            root.left = build_tree(preorder, lower, val)
            # All values greater than root go to right subtree
            root.right = build_tree(preorder, val, upper)

            return root

        return build_tree(values)
```

```javascript
// Time: O(n) for both serialize and deserialize
// Space: O(n) for both serialize and deserialize
class Codec {
  serialize(root) {
    /** Encodes a tree to a single string using preorder traversal. */
    const result = [];

    function preorder(node) {
      if (!node) return;
      result.push(node.val.toString());
      preorder(node.left);
      preorder(node.right);
    }

    preorder(root);
    return result.join(","); // Join values with commas
  }

  deserialize(data) {
    /** Decodes your encoded data to tree. */
    if (!data) return null;

    // Convert string to array of numbers
    const values = data.split(",").map(Number);
    let index = 0; // Track current position in values array

    function buildTree(lower = -Infinity, upper = Infinity) {
      /** Recursively build tree from preorder array using BST bounds. */
      if (index >= values.length) return null;

      const val = values[index];
      // Check if current value is within valid BST range
      if (val < lower || val > upper) return null;

      // Create root node with current value
      const root = new TreeNode(val);
      index++; // Move to next value

      // All values less than root go to left subtree
      root.left = buildTree(lower, val);
      // All values greater than root go to right subtree
      root.right = buildTree(val, upper);

      return root;
    }

    return buildTree();
  }
}
```

```java
// Time: O(n) for both serialize and deserialize
// Space: O(n) for both serialize and deserialize
public class Codec {
    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        preorder(root, sb);
        // Remove trailing comma if string is not empty
        if (sb.length() > 0) {
            sb.setLength(sb.length() - 1);
        }
        return sb.toString();
    }

    private void preorder(TreeNode node, StringBuilder sb) {
        if (node == null) return;
        sb.append(node.val).append(",");
        preorder(node.left, sb);
        preorder(node.right, sb);
    }

    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        if (data.isEmpty()) return null;

        // Split string into array of values
        String[] values = data.split(",");
        int[] index = {0};  // Use array to maintain mutable index across recursive calls

        return buildTree(values, index, Integer.MIN_VALUE, Integer.MAX_VALUE);
    }

    private TreeNode buildTree(String[] values, int[] index, int lower, int upper) {
        // Base case: reached end of array or value out of BST range
        if (index[0] >= values.length) return null;

        int val = Integer.parseInt(values[index[0]]);
        // Check if current value is within valid BST range
        if (val < lower || val > upper) return null;

        // Create root node with current value
        TreeNode root = new TreeNode(val);
        index[0]++;  // Move to next value

        // All values less than root go to left subtree
        root.left = buildTree(values, index, lower, val);
        // All values greater than root go to right subtree
        root.right = buildTree(values, index, val, upper);

        return root;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n) for both operations**

- Serialization: We visit each node exactly once during preorder traversal
- Deserialization: We process each value exactly once while building the tree
- Each recursive call processes one node, resulting in n total calls

**Space Complexity: O(n) for both operations**

- Serialization: The result string stores all n node values
- Deserialization:
  - The recursion stack uses O(h) space where h is tree height
  - In worst case (skewed tree), h = n, so O(n)
  - In balanced tree, h = log n, so O(log n)
- Overall worst-case space is O(n)

## Common Mistakes

1. **Forgetting to handle empty tree/null input**: Always check if the input is null/empty before processing. In serialize, an empty tree should return an empty string. In deserialize, an empty string should return null.

2. **Using level-order with null markers unnecessarily**: While this works for general binary trees, it's inefficient for BSTs. Candidates often don't recognize they can leverage BST properties for more compact serialization.

3. **Incorrect bounds checking during deserialization**: When recursively building the tree, it's crucial to check if the current value is within the valid range (between lower and upper bounds). Without this check, the algorithm might incorrectly assign values to wrong subtrees.

4. **Not using global index or passing list by reference**: In the recursive deserialization, we need to track our position in the values array. Some implementations create new subarrays for each recursive call, which uses O(n²) space. The optimal approach uses a single index that increments globally.

## When You'll See This Pattern

This serialization/deserialization pattern appears in several tree-related problems:

1. **Serialize and Deserialize Binary Tree (Hard)**: The general version of this problem, where you need to handle any binary tree (not just BSTs). You'll typically use level-order traversal with null markers.

2. **Find Duplicate Subtrees (Medium)**: Uses serialization to create unique string representations of subtrees, which can be compared to find duplicates.

3. **Construct Binary Search Tree from Preorder Traversal (Medium)**: Very similar to our deserialization logic - building a BST from preorder traversal by partitioning values based on BST properties.

The core technique of using traversal order + structural properties (like BST ordering) for serialization is a powerful pattern for tree problems.

## Key Takeaways

1. **BST properties enable compact serialization**: Unlike general binary trees, BSTs can be serialized without null markers by leveraging the ordering property during deserialization.

2. **Preorder traversal is natural for reconstruction**: When you know the root first (from preorder), you can determine which subsequent values belong to left vs right subtrees based on BST ordering.

3. **Bound checking is crucial**: During deserialization, always validate that each value falls within the expected range for its position in the tree to maintain BST properties.

Related problems: [Serialize and Deserialize Binary Tree](/problem/serialize-and-deserialize-binary-tree), [Find Duplicate Subtrees](/problem/find-duplicate-subtrees), [Serialize and Deserialize N-ary Tree](/problem/serialize-and-deserialize-n-ary-tree)
