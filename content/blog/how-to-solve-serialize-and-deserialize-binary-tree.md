---
title: "How to Solve Serialize and Deserialize Binary Tree — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Serialize and Deserialize Binary Tree. Hard difficulty, 60.4% acceptance rate. Topics: String, Tree, Depth-First Search, Breadth-First Search, Design."
date: "2026-09-08"
category: "dsa-patterns"
tags: ["serialize-and-deserialize-binary-tree", "string", "tree", "depth-first-search", "hard"]
---

# How to Solve Serialize and Deserialize Binary Tree

Serializing a binary tree means converting it into a string representation, and deserializing means reconstructing the exact same tree from that string. What makes this problem tricky is that you need to preserve both the node values and the tree structure, including null positions, so the reconstructed tree is identical to the original. The challenge lies in designing a format that captures the complete structure unambiguously.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this binary tree:

```
    1
   / \
  2   3
     / \
    4   5
```

A common serialization approach is to use a level-order (BFS) traversal with null markers. Here's how it works step by step:

**Serialization:**

1. Start with root node `1`. Serialized string so far: `"1"`
2. Process level by level. After `1`, we have its children: `2` and `3`
3. Add `2` to string: `"1,2,3"`
4. `2` has no children, so add two nulls: `"1,2,3,null,null"`
5. `3` has children `4` and `5`: `"1,2,3,null,null,4,5"`
6. `4` and `5` have no children, so add four nulls: `"1,2,3,null,null,4,5,null,null,null,null"`

We can trim trailing nulls to save space: `"1,2,3,null,null,4,5"`

**Deserialization:**

1. Split string by commas: `["1", "2", "3", "null", "null", "4", "5"]`
2. Create root node from `"1"` (index 0)
3. Use a queue to track parent nodes needing children
4. For root `1`, assign next two values as children: `2` (left) and `3` (right)
5. Move to `2`, assign next two values: both `null`, so no children
6. Move to `3`, assign next two values: `4` (left) and `5` (right)
7. Continue until all values are processed

The key insight: we need null markers to preserve the tree structure. Without them, `[1,2,3,4,5]` could represent multiple different trees.

## Brute Force Approach

A naive approach might try to serialize using just pre-order traversal without null markers. For example, serialize as `"1,2,3,4,5"` using pre-order. The problem is that multiple trees can produce the same pre-order sequence. Consider these two different trees:

Tree A: 1 Tree B: 1
/ /
2 2
/ \
 3 3

Both would serialize to `"1,2,3"` without null markers, making deserialization ambiguous.

Another brute force idea: store both inorder and preorder traversals. While this theoretically works (you can reconstruct a tree from inorder+preorder), it requires O(n²) time for deserialization (searching for root in inorder array for each recursive call) and uses twice the space. More importantly, it fails if the tree has duplicate values.

The fundamental issue with brute force approaches is they either lose structural information or are inefficient. We need a solution that:

1. Preserves the exact tree structure
2. Handles duplicate values
3. Works in O(n) time and space

## Optimized Approach

The optimal solution uses a level-order (BFS) or depth-first (DFS) traversal with explicit null markers. Both approaches work in O(n) time and space.

**Key Insight:** Include null markers in your serialization to preserve the complete tree structure. This allows unambiguous reconstruction.

**DFS (Pre-order) Approach:**

- Serialize using pre-order traversal: root, left, right
- Append "null" for null nodes
- Deserialize by reading values in the same pre-order sequence
- When you encounter "null", return null to stop recursion in that branch

**BFS (Level-order) Approach:**

- Serialize level by level using a queue
- Include null nodes in the serialization
- Deserialize by using a queue to track parent nodes
- Assign children from the serialized data in level order

Both approaches are O(n) time and space. DFS is more elegant recursively, while BFS is more intuitive for level-by-level thinking. We'll implement the BFS approach as it's more straightforward to visualize and handles the serialization format most candidates find intuitive.

## Optimal Solution

Here's the complete solution using BFS with null markers:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes in the tree
# Space: O(n) for the queue and serialized string
class Codec:
    def serialize(self, root):
        """Encodes a tree to a single string.

        Args:
            root: TreeNode - root of the binary tree

        Returns:
            str: comma-separated level-order traversal with null markers
        """
        if not root:
            return ""

        result = []
        queue = [root]

        while queue:
            node = queue.pop(0)  # Dequeue the front node

            if node:
                # Add node value to result
                result.append(str(node.val))
                # Enqueue children (even if null, we need to process them)
                queue.append(node.left)
                queue.append(node.right)
            else:
                # Add null marker for empty node
                result.append("null")

        # Remove trailing nulls to minimize string length
        while result and result[-1] == "null":
            result.pop()

        return ",".join(result)

    def deserialize(self, data):
        """Decodes your encoded data to tree.

        Args:
            data: str - comma-separated serialized tree

        Returns:
            TreeNode: root of the reconstructed binary tree
        """
        if not data:
            return None

        # Split the serialized string into values
        values = data.split(",")

        # Create root from first value
        root = TreeNode(int(values[0]))
        queue = [root]

        # Index for values array
        i = 1

        while queue and i < len(values):
            # Get the next parent node that needs children
            node = queue.pop(0)

            # Process left child
            if i < len(values) and values[i] != "null":
                left_node = TreeNode(int(values[i]))
                node.left = left_node
                queue.append(left_node)
            i += 1

            # Process right child
            if i < len(values) and values[i] != "null":
                right_node = TreeNode(int(values[i]))
                node.right = right_node
                queue.append(right_node)
            i += 1

        return root
```

```javascript
// Time: O(n) where n is number of nodes in the tree
// Space: O(n) for the queue and serialized string
class Codec {
  /**
   * Encodes a tree to a single string.
   *
   * @param {TreeNode} root
   * @return {string}
   */
  serialize(root) {
    if (!root) return "";

    const result = [];
    const queue = [root];

    while (queue.length > 0) {
      const node = queue.shift(); // Dequeue the front node

      if (node) {
        // Add node value to result
        result.push(node.val.toString());
        // Enqueue children (even if null, we need to process them)
        queue.push(node.left);
        queue.push(node.right);
      } else {
        // Add null marker for empty node
        result.push("null");
      }
    }

    // Remove trailing nulls to minimize string length
    while (result.length > 0 && result[result.length - 1] === "null") {
      result.pop();
    }

    return result.join(",");
  }

  /**
   * Decodes your encoded data to tree.
   *
   * @param {string} data
   * @return {TreeNode}
   */
  deserialize(data) {
    if (!data) return null;

    // Split the serialized string into values
    const values = data.split(",");

    // Create root from first value
    const root = new TreeNode(parseInt(values[0]));
    const queue = [root];

    // Index for values array
    let i = 1;

    while (queue.length > 0 && i < values.length) {
      // Get the next parent node that needs children
      const node = queue.shift();

      // Process left child
      if (i < values.length && values[i] !== "null") {
        const leftNode = new TreeNode(parseInt(values[i]));
        node.left = leftNode;
        queue.push(leftNode);
      }
      i++;

      // Process right child
      if (i < values.length && values[i] !== "null") {
        const rightNode = new TreeNode(parseInt(values[i]));
        node.right = rightNode;
        queue.push(rightNode);
      }
      i++;
    }

    return root;
  }
}
```

```java
// Time: O(n) where n is number of nodes in the tree
// Space: O(n) for the queue and serialized string
public class Codec {
    /**
     * Encodes a tree to a single string.
     *
     * @param root TreeNode root of the binary tree
     * @return comma-separated level-order traversal with null markers
     */
    public String serialize(TreeNode root) {
        if (root == null) return "";

        StringBuilder sb = new StringBuilder();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();  // Dequeue the front node

            if (node != null) {
                // Add node value to result
                sb.append(node.val);
                // Enqueue children (even if null, we need to process them)
                queue.offer(node.left);
                queue.offer(node.right);
            } else {
                // Add null marker for empty node
                sb.append("null");
            }

            // Add comma separator if there are more elements to process
            if (!queue.isEmpty()) {
                sb.append(",");
            }
        }

        // Remove trailing nulls to minimize string length
        String result = sb.toString();
        while (result.endsWith(",null")) {
            result = result.substring(0, result.length() - 5);
        }

        return result;
    }

    /**
     * Decodes your encoded data to tree.
     *
     * @param data comma-separated serialized tree
     * @return root of the reconstructed binary tree
     */
    public TreeNode deserialize(String data) {
        if (data == null || data.isEmpty()) return null;

        // Split the serialized string into values
        String[] values = data.split(",");

        // Create root from first value
        TreeNode root = new TreeNode(Integer.parseInt(values[0]));
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        // Index for values array
        int i = 1;

        while (!queue.isEmpty() && i < values.length) {
            // Get the next parent node that needs children
            TreeNode node = queue.poll();

            // Process left child
            if (i < values.length && !values[i].equals("null")) {
                TreeNode leftNode = new TreeNode(Integer.parseInt(values[i]));
                node.left = leftNode;
                queue.offer(leftNode);
            }
            i++;

            // Process right child
            if (i < values.length && !values[i].equals("null")) {
                TreeNode rightNode = new TreeNode(Integer.parseInt(values[i]));
                node.right = rightNode;
                queue.offer(rightNode);
            }
            i++;
        }

        return root;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Serialization: We visit each node exactly once in BFS traversal → O(n)
- Deserialization: We process each value in the serialized string exactly once → O(n)

**Space Complexity: O(n)**

- Serialization: The queue holds at most O(n) nodes, and the result string stores O(n) values → O(n)
- Deserialization: The queue holds O(n) nodes, and we create n TreeNode objects → O(n)

The space complexity is optimal because we need to store the entire tree structure. The time complexity is also optimal since we must process every node at least once.

## Common Mistakes

1. **Forgetting null markers:** The most common mistake is serializing without null markers (e.g., just storing node values in pre-order). This loses structural information, making deserialization impossible for many trees.

2. **Incorrect index handling in deserialization:** When assigning children to parent nodes, candidates often mess up the index arithmetic. Remember: for each parent node, you need to read two values from the serialized data (left and right children).

3. **Not handling empty input:** Forgetting to check `if not data:` or `if data == ""` in deserialization will cause errors when trying to split an empty string or access array index 0.

4. **Using stack instead of queue for BFS:** Some candidates try to use a stack (DFS) when implementing what should be a BFS approach. For level-order reconstruction, you need a queue to process nodes in the correct order.

## When You'll See This Pattern

This serialization/deserialization pattern appears in several related problems:

1. **Encode and Decode Strings (LeetCode 271):** Similar concept of converting data structures to strings and back, but for arrays of strings instead of trees. You need delimiters and escape characters.

2. **Serialize and Deserialize BST (LeetCode 449):** A variation where the tree is a Binary Search Tree. You can optimize by leveraging BST properties (left < root < right) to use less space.

3. **Find Duplicate Subtrees (LeetCode 652):** Uses serialization to create unique identifiers for subtrees, making it easy to detect duplicates through string comparison.

The core technique of adding null/sentinel markers to preserve structure applies whenever you need to serialize hierarchical data.

## Key Takeaways

1. **Null markers are essential** for preserving tree structure during serialization. Without them, you lose information about the shape of the tree.

2. **BFS with a queue provides intuitive serialization** that's easy to visualize and debug. The level-order format with nulls clearly shows the tree structure.

3. **The serialization format determines the deserialization algorithm.** Choose a traversal order (pre-order, level-order) and stick with it consistently for both serialization and deserialization.

Remember: the goal isn't just to store node values, but to capture the complete tree structure so it can be perfectly reconstructed.

Related problems: [Encode and Decode Strings](/problem/encode-and-decode-strings), [Serialize and Deserialize BST](/problem/serialize-and-deserialize-bst), [Find Duplicate Subtrees](/problem/find-duplicate-subtrees)
